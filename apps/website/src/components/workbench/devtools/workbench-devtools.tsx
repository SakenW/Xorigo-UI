/**
 * Workbench 开发工具集成
 * 提供性能分析、可访问性检测、代码质量分析等开发工具
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'

/**
 * 性能指标
 */
export interface PerformanceMetrics {
  /** 渲染时间 */
  renderTime: number
  /** 组件数量 */
  componentCount: number
  /** 重新渲染次数 */
  rerenderCount: number
  /** 内存使用 */
  memoryUsage: number
  /** 网络请求数 */
  requestCount: number
  /** 包大小 */
  bundleSize: number
  /** 首屏渲染时间 */
  firstPaint: number
  /** 可交互时间 */
  interactive: number
}

/**
 * 可访问性检查结果
 */
export interface AccessibilityCheck {
  /** 检查项名称 */
  name: string
  /** 状态 */
  status: 'pass' | 'fail' | 'warning'
  /** 描述 */
  description: string
  /** 影响 */
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  /** 元素选择器 */
  selector?: string
  /** 建议 */
  suggestion?: string
}

/**
 * 代码质量分析结果
 */
export interface CodeQualityAnalysis {
  /** 总体评分 */
  score: number
  /** 复杂度 */
  complexity: number
  /** 可维护性 */
  maintainability: number
  /** 可读性 */
  readability: number
  /** 测试覆盖率 */
  testCoverage: number
  /** 重复代码 */
  duplication: number
  /** 问题列表 */
  issues: Array<{
    type: 'error' | 'warning' | 'info'
    message: string
    line: number
    column: number
    rule: string
  }>
}

/**
 * 开发工具属性
 */
export interface WorkbenchDevtoolsProps {
  /** 要分析的组件代码 */
  code?: string
  /** 组件名称 */
  componentName?: string
  /** 性能分析数据 */
  performanceData?: Partial<PerformanceMetrics>
  /** 可访问性配置 */
  a11yConfig?: {
    enableContrastCheck: boolean
    enableKeyboardNavigation: boolean
    enableScreenReader: boolean
  }
  /** 代码质量配置 */
  qualityConfig?: {
    enableESLint: boolean
    enableTypeCheck: boolean
    enableComplexityAnalysis: boolean
  }
  /** 分析更新回调 */
  onAnalysisUpdate?: (analysis: {
    performance?: PerformanceMetrics
    accessibility?: AccessibilityCheck[]
    quality?: CodeQualityAnalysis
  }) => void
  /** 是否显示高级选项 */
  showAdvanced?: boolean
}

/**
 * 性能分析器
 */
class PerformanceAnalyzer {
  private observers: PerformanceObserver[] = []
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    componentCount: 0,
    rerenderCount: 0,
    memoryUsage: 0,
    requestCount: 0,
    bundleSize: 0,
    firstPaint: 0,
    interactive: 0
  }

  /**
   * 开始监控
   */
  startMonitoring() {
    // 监控渲染性能
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-paint') {
              this.metrics.firstPaint = entry.startTime
            } else if (entry.name === 'first-contentful-paint') {
              this.metrics.interactive = entry.startTime
            }
          }
        })
        paintObserver.observe({ entryTypes: ['paint'] })
        this.observers.push(paintObserver)

        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming
              this.metrics.interactive = navEntry.domInteractive - navEntry.navigationStart
            }
          }
        })
        navigationObserver.observe({ entryTypes: ['navigation'] })
        this.observers.push(navigationObserver)
      } catch (error) {
        console.warn('Performance monitoring not fully supported:', error)
      }
    }

    // 监控内存使用
    this.startMemoryMonitoring()

    // 监控网络请求
    this.startNetworkMonitoring()
  }

  /**
   * 停止监控
   */
  stopMonitoring() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }

  /**
   * 获取当前指标
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * 内存监控
   */
  private startMemoryMonitoring() {
    const updateMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        this.metrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024)
      }
    }

    updateMemory()
    setInterval(updateMemory, 2000)
  }

  /**
   * 网络监控
   */
  private startNetworkMonitoring() {
    const originalFetch = window.fetch
    let requestCount = 0

    window.fetch = async (...args) => {
      requestCount++
      this.metrics.requestCount = requestCount
      return originalFetch(...args)
    }

    // 监控XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function(...args) {
      requestCount++
      this.metrics.requestCount = requestCount
      return originalXHROpen.apply(this, args)
    }
  }

  /**
   * 分析组件性能
   */
  analyzeComponentPerformance(componentName: string, renderTime: number): PerformanceMetrics {
    return {
      ...this.metrics,
      renderTime,
      componentCount: this.countComponents(),
      rerenderCount: this.countRerenders()
    }
  }

  /**
   * 统计组件数量
   */
  private countComponents(): number {
    const elements = document.querySelectorAll('[data-component]')
    return elements.length
  }

  /**
   * 统计重新渲染次数
   */
  private countRerenders(): number {
    // 这里可以通过React DevTools API或自定义Hook来获取
    return 0
  }
}

/**
 * 可访问性检查器
 */
class AccessibilityChecker {
  private checks: AccessibilityCheck[] = []

  /**
   * 运行所有检查
   */
  async runAllChecks(): Promise<AccessibilityCheck[]> {
    this.checks = []

    // 颜色对比度检查
    await this.checkColorContrast()

    // 键盘导航检查
    await this.checkKeyboardNavigation()

    // 语义化HTML检查
    await this.checkSemanticHTML()

    // ARIA标签检查
    await this.checkARIALabels()

    // 图片alt属性检查
    await this.checkImageAlt()

    // 表单标签检查
    await this.checkFormLabels()

    return this.checks
  }

  /**
   * 颜色对比度检查
   */
  private async checkColorContrast() {
    const elements = document.querySelectorAll('*')

    elements.forEach(element => {
      const styles = window.getComputedStyle(element)
      const color = styles.color
      const backgroundColor = styles.backgroundColor

      if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const contrast = this.calculateContrast(color, backgroundColor)

        if (contrast < 4.5) {
          this.checks.push({
            name: '颜色对比度',
            status: contrast < 3 ? 'fail' : 'warning',
            description: `颜色对比度为 ${contrast.toFixed(2)}:1`,
            impact: contrast < 3 ? 'critical' : 'serious',
            selector: this.generateSelector(element),
            suggestion: '增加前景色和背景色的对比度，确保文本可读性'
          })
        }
      }
    })
  }

  /**
   * 键盘导航检查
   */
  private async checkKeyboardNavigation() {
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) {
      this.checks.push({
        name: '键盘导航',
        status: 'warning',
        description: '页面中没有找到可聚焦的元素',
        impact: 'moderate',
        suggestion: '确保所有交互元素都可以通过键盘访问'
      })
    }

    // 检查tabindex顺序
    const tabElements = document.querySelectorAll('[tabindex]')
    tabElements.forEach(element => {
      const tabindex = element.getAttribute('tabindex')
      if (tabindex && parseInt(tabindex) > 0) {
        this.checks.push({
          name: 'Tab顺序',
          status: 'warning',
          description: '发现正数tabindex，可能影响自然的Tab顺序',
          impact: 'moderate',
          selector: this.generateSelector(element),
          suggestion: '避免使用正数tabindex，让元素按DOM顺序自然排列'
        })
      }
    })
  }

  /**
   * 语义化HTML检查
   */
  private async checkSemanticHTML() {
    // 检查是否有语义化标签
    const hasSemanticTags = document.querySelectorAll(
      'main, nav, header, footer, section, article, aside'
    ).length > 0

    if (!hasSemanticTags) {
      this.checks.push({
        name: '语义化HTML',
        status: 'warning',
        description: '页面中缺少语义化HTML标签',
        impact: 'moderate',
        suggestion: '使用适当的语义化标签来提高页面结构的可访问性'
      })
    }

    // 检查标题层级
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let previousLevel = 0

    headings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName.substring(1))
      if (currentLevel > previousLevel + 1 && previousLevel !== 0) {
        this.checks.push({
          name: '标题层级',
          status: 'warning',
          description: `标题层级跳跃：从 H${previousLevel} 直接到 H${currentLevel}`,
          impact: 'minor',
          selector: this.generateSelector(heading),
          suggestion: '保持标题层级的连续性，避免跳级'
        })
      }
      previousLevel = currentLevel
    })
  }

  /**
   * ARIA标签检查
   */
  private async checkARIALabels() {
    // 检查按钮是否有标签
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])')
    buttons.forEach(button => {
      if (!button.textContent?.trim()) {
        this.checks.push({
          name: 'ARIA标签',
          status: 'fail',
          description: '按钮缺少可访问的标签',
          impact: 'serious',
          selector: this.generateSelector(button),
          suggestion: '为按钮添加aria-label或确保按钮有文本内容'
        })
      }
    })

    // 检查图标按钮
    const iconButtons = document.querySelectorAll('button svg, button i')
    iconButtons.forEach(button => {
      const parent = button.parentElement
      if (parent?.tagName === 'BUTTON' && !parent.textContent?.trim()) {
        this.checks.push({
          name: '图标按钮标签',
          status: 'fail',
          description: '图标按钮缺少aria-label',
          impact: 'serious',
          selector: this.generateSelector(parent),
          suggestion: '为图标按钮添加描述性的aria-label'
        })
      }
    })
  }

  /**
   * 图片alt属性检查
   */
  private async checkImageAlt() {
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      if (!img.alt) {
        this.checks.push({
          name: '图片alt属性',
          status: 'fail',
          description: '图片缺少alt属性',
          impact: 'serious',
          selector: this.generateSelector(img),
          suggestion: '为所有图片添加描述性的alt属性'
        })
      }
    })
  }

  /**
   * 表单标签检查
   */
  private async checkFormLabels() {
    const inputs = document.querySelectorAll('input, select, textarea')
    inputs.forEach(input => {
      const hasLabel = document.querySelector(`label[for="${input.id}"]`) ||
                      input.getAttribute('aria-label') ||
                      input.getAttribute('aria-labelledby')

      if (!hasLabel && input.type !== 'hidden') {
        this.checks.push({
          name: '表单标签',
          status: 'fail',
          description: '表单控件缺少关联的标签',
          impact: 'serious',
          selector: this.generateSelector(input),
          suggestion: '为表单控件添加label标签或aria-label'
        })
      }
    })
  }

  /**
   * 计算颜色对比度
   */
  private calculateContrast(color1: string, color2: string): number {
    const getLuminance = (color: string) => {
      const rgb = this.hexToRgb(color)
      if (!rgb) return 0

      const sRGB = [rgb.r, rgb.g, rgb.b].map(val => {
        val = val / 255
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
      })

      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
    }

    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)

    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)
  }

  /**
   * HEX转RGB
   */
  private hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  /**
   * 生成CSS选择器
   */
  private generateSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`
    }

    if (element.className) {
      return `.${element.className.split(' ').join('.')}`
    }

    return element.tagName.toLowerCase()
  }
}

/**
 * 代码质量分析器
 */
class CodeQualityAnalyzer {
  /**
   * 分析代码质量
   */
  analyzeCode(code: string): CodeQualityAnalysis {
    const issues: CodeQualityAnalysis['issues'] = []

    // 基础代码检查
    this.performBasicChecks(code, issues)

    // 复杂度分析
    const complexity = this.calculateComplexity(code)

    // 可读性分析
    const readability = this.calculateReadability(code)

    // 可维护性分析
    const maintainability = this.calculateMaintainability(code, complexity, readability)

    // 计算总分
    const score = Math.round(
      (maintainability * 0.4 + readability * 0.3 + (100 - complexity) * 0.2 + 90 * 0.1)
    )

    return {
      score,
      complexity,
      maintainability,
      readability,
      testCoverage: 0, // 需要额外工具支持
      duplication: this.calculateDuplication(code),
      issues
    }
  }

  /**
   * 基础代码检查
   */
  private performBasicChecks(code: string, issues: CodeQualityAnalysis['issues']) {
    const lines = code.split('\n')

    lines.forEach((line, index) => {
      const lineNumber = index + 1

      // 检查console.log
      if (line.includes('console.log')) {
        issues.push({
          type: 'warning',
          message: '移除console.log语句',
          line: lineNumber,
          column: line.indexOf('console.log') + 1,
          rule: 'no-console'
        })
      }

      // 检查TODO注释
      if (line.includes('// TODO') || line.includes('/* TODO')) {
        issues.push({
          type: 'info',
          message: '发现TODO注释',
          line: lineNumber,
          column: line.indexOf('TODO') + 1,
          rule: 'todo-comments'
        })
      }

      // 检查行长度
      if (line.length > 100) {
        issues.push({
          type: 'warning',
          message: `行过长 (${line.length} 字符)`,
          line: lineNumber,
          column: 101,
          rule: 'max-line-length'
        })
      }

      // 检查硬编码颜色
      if (line.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/)) {
        issues.push({
          type: 'warning',
          message: '避免硬编码颜色值',
          line: lineNumber,
          column: line.search(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/) + 1,
          rule: 'no-hardcoded-colors'
        })
      }
    })
  }

  /**
   * 计算复杂度
   */
  private calculateComplexity(code: string): number {
    // 简化的复杂度计算
    const complexityPatterns = [
      /if\s*\(/g, /else\s+if\s*\(/g, /for\s*\(/g, /while\s*\(/g,
      /switch\s*\(/g, /case\s+/g, /catch\s*\(/g, /&&/g, /\|\|/g
    ]

    let complexity = 1 // 基础复杂度

    complexityPatterns.forEach(pattern => {
      const matches = code.match(pattern)
      if (matches) {
        complexity += matches.length
      }
    })

    return Math.min(complexity, 100)
  }

  /**
   * 计算可读性
   */
  private calculateReadability(code: string): number {
    let score = 100

    // 检查注释比例
    const lines = code.split('\n')
    const commentLines = lines.filter(line =>
      line.trim().startsWith('//') ||
      line.trim().startsWith('/*') ||
      line.trim().startsWith('*')
    ).length

    const commentRatio = commentLines / lines.length
    if (commentRatio < 0.1) score -= 20
    else if (commentRatio > 0.3) score += 10

    // 检查函数长度
    const functionMatches = code.match(/function\s+\w+[^{]*\{[\s\S]*?\}/g) || []
    functionMatches.forEach(func => {
      const funcLines = func.split('\n').length
      if (funcLines > 50) score -= 10
      else if (funcLines > 20) score -= 5
    })

    // 检查变量命名
    const badNames = ['a', 'b', 'c', 'x', 'y', 'z', 'temp', 'data']
    badNames.forEach(name => {
      const regex = new RegExp(`\\b${name}\\b`, 'g')
      const matches = code.match(regex)
      if (matches) score -= matches.length * 2
    })

    return Math.max(0, Math.min(100, score))
  }

  /**
   * 计算可维护性
   */
  private calculateMaintainability(code: string, complexity: number, readability: number): number {
    let maintainability = (readability + (100 - complexity)) / 2

    // 检查模块化程度
    const imports = (code.match(/import\s+.*from/g) || []).length
    const exports = (code.match(/export\s+/g) || []).length
    const modularity = (imports + exports) / Math.max(code.length / 1000, 1)
    maintainability += Math.min(modularity * 5, 20)

    // 检查重复代码
    const duplication = this.calculateDuplication(code)
    maintainability -= duplication * 10

    return Math.max(0, Math.min(100, maintainability))
  }

  /**
   * 计算重复代码
   */
  private calculateDuplication(code: string): number {
    const lines = code.split('\n').filter(line => line.trim().length > 10)
    const lineMap = new Map<string, number>()

    lines.forEach(line => {
      const normalized = line.trim().toLowerCase()
      lineMap.set(normalized, (lineMap.get(normalized) || 0) + 1)
    })

    const duplicateLines = Array.from(lineMap.values()).filter(count => count > 1)
    return duplicateLines.reduce((sum, count) => sum + (count - 1), 0) / Math.max(lines.length, 1)
  }
}

/**
 * 全局分析器实例
 */
const performanceAnalyzer = new PerformanceAnalyzer()
const accessibilityChecker = new AccessibilityChecker()
const qualityAnalyzer = new CodeQualityAnalyzer()

/**
 * Workbench 开发工具组件
 */
export function WorkbenchDevtools({
  code = '',
  componentName = '',
  performanceData = {},
  a11yConfig = {
    enableContrastCheck: true,
    enableKeyboardNavigation: true,
    enableScreenReader: true
  },
  qualityConfig = {
    enableESLint: true,
    enableTypeCheck: true,
    enableComplexityAnalysis: true
  },
  onAnalysisUpdate,
  showAdvanced = false,
}: WorkbenchDevtoolsProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>(performanceAnalyzer.getMetrics())
  const [accessibilityResults, setAccessibilityResults] = useState<AccessibilityCheck[]>([])
  const [qualityResults, setQualityResults] = useState<CodeQualityAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState<'performance' | 'accessibility' | 'quality'>('performance')

  const analysisTimeoutRef = useRef<number>()

  /**
   * 运行性能分析
   */
  const runPerformanceAnalysis = useCallback(async () => {
    const metrics = performanceAnalyzer.getMetrics()
    setPerformanceMetrics(metrics)
  }, [])

  /**
   * 运行可访问性检查
   */
  const runAccessibilityCheck = useCallback(async () => {
    setIsAnalyzing(true)
    try {
      const results = await accessibilityChecker.runAllChecks()
      setAccessibilityResults(results)
    } catch (error) {
      console.error('Accessibility check failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  /**
   * 运行代码质量分析
   */
  const runQualityAnalysis = useCallback(() => {
    if (!code) return

    setIsAnalyzing(true)
    try {
      const results = qualityAnalyzer.analyzeCode(code)
      setQualityResults(results)
    } catch (error) {
      console.error('Quality analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [code])

  /**
   * 运行所有分析
   */
  const runAllAnalysis = useCallback(async () => {
    setIsAnalyzing(true)

    try {
      await Promise.all([
        runPerformanceAnalysis(),
        runAccessibilityCheck(),
        runQualityAnalysis()
      ])

      const analysisData = {
        performance: performanceMetrics,
        accessibility: accessibilityResults,
        quality: qualityResults
      }

      onAnalysisUpdate?.(analysisData)
    } finally {
      setIsAnalyzing(false)
    }
  }, [runPerformanceAnalysis, runAccessibilityCheck, runQualityAnalysis, performanceMetrics, accessibilityResults, qualityResults, onAnalysisUpdate])

  /**
   * 初始化监控
   */
  useEffect(() => {
    performanceAnalyzer.startMonitoring()

    return () => {
      performanceAnalyzer.stopMonitoring()
    }
  }, [])

  /**
   * 自动分析
   */
  useEffect(() => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current)
    }

    analysisTimeoutRef.current = window.setTimeout(() => {
      runAllAnalysis()
    }, 1000)

    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current)
      }
    }
  }, [code, componentName, runAllAnalysis])

  /**
   * 渲染性能面板
   */
  const PerformancePanel = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary">{performanceMetrics.renderTime}ms</div>
          <div className="text-sm text-muted-foreground">渲染时间</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-secondary">{performanceMetrics.componentCount}</div>
          <div className="text-sm text-muted-foreground">组件数量</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-accent">{performanceMetrics.memoryUsage}MB</div>
          <div className="text-sm text-muted-foreground">内存使用</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{performanceMetrics.requestCount}</div>
          <div className="text-sm text-muted-foreground">网络请求</div>
        </div>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Core Web Vitals</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>首次绘制:</span>
                <span className={performanceMetrics.firstPaint < 2000 ? 'text-green-600' : 'text-red-600'}>
                  {performanceMetrics.firstPaint}ms
                </span>
              </div>
              <div className="flex justify-between">
                <span>可交互时间:</span>
                <span className={performanceMetrics.interactive < 5000 ? 'text-green-600' : 'text-red-600'}>
                  {performanceMetrics.interactive}ms
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">性能建议</h4>
            <ul className="text-sm space-y-1">
              {performanceMetrics.renderTime > 100 && (
                <li className="text-yellow-600">• 考虑优化组件渲染性能</li>
              )}
              {performanceMetrics.memoryUsage > 50 && (
                <li className="text-yellow-600">• 内存使用较高，检查内存泄漏</li>
              )}
              {performanceMetrics.requestCount > 10 && (
                <li className="text-yellow-600">• 减少网络请求数量</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )

  /**
   * 渲染可访问性面板
   */
  const AccessibilityPanel = () => {
    const passCount = accessibilityResults.filter(r => r.status === 'pass').length
    const failCount = accessibilityResults.filter(r => r.status === 'fail').length
    const warningCount = accessibilityResults.filter(r => r.status === 'warning').length

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{passCount}</div>
            <div className="text-sm text-green-700">通过</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <div className="text-sm text-yellow-700">警告</div>
          </div>
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{failCount}</div>
            <div className="text-sm text-red-700">失败</div>
          </div>
        </div>

        {accessibilityResults.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-auto">
            {accessibilityResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.status === 'fail' ? 'bg-red-50 border-red-200' :
                  result.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{result.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{result.description}</p>
                    {result.suggestion && (
                      <p className="text-xs mt-1 italic">{result.suggestion}</p>
                    )}
                  </div>
                  <Badge
                    variant={result.status === 'fail' ? 'destructive' : result.status === 'warning' ? 'secondary' : 'default'}
                    className="ml-2"
                  >
                    {result.impact}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  /**
   * 渲染代码质量面板
   */
  const QualityPanel = () => {
    if (!qualityResults) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          需要提供代码才能进行质量分析
        </div>
      )
    }

    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-600'
      if (score >= 60) return 'text-yellow-600'
      return 'text-red-600'
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className={`text-2xl font-bold ${getScoreColor(qualityResults.score)}`}>
              {qualityResults.score}
            </div>
            <div className="text-sm text-muted-foreground">总体评分</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className={`text-2xl font-bold ${getScoreColor(qualityResults.maintainability)}`}>
              {qualityResults.maintainability}
            </div>
            <div className="text-sm text-muted-foreground">可维护性</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className={`text-2xl font-bold ${getScoreColor(qualityResults.readability)}`}>
              {qualityResults.readability}
            </div>
            <div className="text-sm text-muted-foreground">可读性</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{qualityResults.complexity}</div>
            <div className="text-sm text-muted-foreground">复杂度</div>
          </div>
        </div>

        {qualityResults.issues.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">发现的问题</h4>
            <div className="max-h-64 overflow-auto space-y-2">
              {qualityResults.issues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    issue.type === 'error' ? 'bg-red-50 border-red-200' :
                    issue.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="font-medium text-sm">{issue.message}</span>
                      <div className="text-xs text-muted-foreground mt-1">
                        行 {issue.line}, 列 {issue.column} · {issue.rule}
                      </div>
                    </div>
                    <Badge
                      variant={issue.type === 'error' ? 'destructive' : issue.type === 'warning' ? 'secondary' : 'outline'}
                      className="ml-2"
                    >
                      {issue.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">质量指标详情</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>测试覆盖率:</span>
                  <span className="text-yellow-600">{qualityResults.testCoverage}%</span>
                </div>
                <div className="flex justify-between">
                  <span>重复代码:</span>
                  <span className={qualityResults.duplication < 5 ? 'text-green-600' : 'text-red-600'}>
                    {(qualityResults.duplication * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">改进建议</h4>
              <ul className="text-sm space-y-1">
                {qualityResults.score < 80 && (
                  <li className="text-yellow-600">• 提高代码质量评分</li>
                )}
                {qualityResults.complexity > 20 && (
                  <li className="text-yellow-600">• 降低代码复杂度</li>
                )}
                {qualityResults.readability < 70 && (
                  <li className="text-yellow-600">• 提高代码可读性</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="workbench-devtools">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>开发工具</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={runAllAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? '分析中...' : '重新分析'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 标签切换 */}
          <div className="flex space-x-1 mb-6">
            <Button
              variant={activeTab === 'performance' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('performance')}
            >
              性能分析
            </Button>
            <Button
              variant={activeTab === 'accessibility' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('accessibility')}
            >
              可访问性
            </Button>
            <Button
              variant={activeTab === 'quality' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('quality')}
            >
              代码质量
            </Button>
          </div>

          {/* 面板内容 */}
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
              <span className="text-muted-foreground">正在分析...</span>
            </div>
          ) : (
            <div>
              {activeTab === 'performance' && <PerformancePanel />}
              {activeTab === 'accessibility' && <AccessibilityPanel />}
              {activeTab === 'quality' && <QualityPanel />}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}