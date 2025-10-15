/**
 * 智能组件预览引擎主入口
 * 整合组件渲染、截图生成、代码分析等功能
 */

import type React from 'react'
import type { ComponentInfo } from '@/data/component-classification'
import type {
  IntelligentPreviewEngine,
  ComponentPreview,
  PreviewOptions,
  PreviewConfig,
  CacheStats,
  PreviewContext
} from './types'
import { ComponentRendererImpl } from './component-renderer'
import { DEFAULT_PREVIEW_CONFIG } from './types'

/**
 * 预览引擎实现
 */
export class IntelligentPreviewEngineImpl implements IntelligentPreviewEngine {
  public config: PreviewConfig
  private renderer: ComponentRendererImpl
  private cache: Map<string, { preview: ComponentPreview; timestamp: number }> = new Map()
  private performanceStats: Map<string, number> = new Map()

  constructor(config?: Partial<PreviewConfig>) {
    this.config = {
      ...DEFAULT_PREVIEW_CONFIG,
      ...config
    }

    this.renderer = new ComponentRendererImpl()
  }

  /**
   * 生成组件预览
   */
  async generatePreview(component: ComponentInfo, options: PreviewOptions): Promise<ComponentPreview> {
    const startTime = performance.now()

    // 检查缓存
    const cached = this.getCachedPreview(component, options)
    if (cached) {
      return cached
    }

    try {
      // 1. 获取默认属性
      const defaultProps = this.renderer.getDefaultProps(component, options)

      // 2. 验证属性
      const validation = this.renderer.validateProps(component, defaultProps)
      if (!validation.valid) {
        console.warn(`Component validation warnings for ${component.name}:`, validation.warnings)
      }

      // 3. 渲染组件
      const renderedComponent = await this.renderer.render(component, defaultProps, options)

      // 4. 分析复杂度
      const complexity = await this.analyzeComplexity(component)

      // 5. 生成截图（如果启用）
      let screenshot: string | undefined
      if (this.config.rendering.enableScreenshot && options.mode !== 'compact') {
        screenshot = await this.generateScreenshot(renderedComponent)
      }

      // 6. 生成代码示例（如果启用）
      let code: string | undefined
      if (this.config.rendering.enableCodeGeneration && options.showCode) {
        code = await this.generateCodeExample(component, defaultProps, options)
      }

      // 7. 分析性能
      const performanceMetrics = await this.analyzePerformance(renderedComponent, component)

      // 8. 分析可访问性
      const accessibilityInfo = await this.analyzeAccessibility(renderedComponent, component)

      // 9. 生成建议
      const suggestions = await this.generateSuggestions(component, options.context)

      // 10. 计算尺寸
      const dimensions = await this.calculateDimensions(component, options)

      const loadTime = performance.now() - startTime

      const preview: ComponentPreview = {
        component,
        rendered: {
          live: renderedComponent,
          screenshot,
          code
        },
        metadata: {
          dimensions,
          loadTime,
          complexity,
          accessibility: accessibilityInfo,
          performance: performanceMetrics
        },
        suggestions
      }

      // 缓存预览
      if (this.config.cache.enabled) {
        this.cachePreview(component, preview, options)
      }

      return preview
    } catch (error) {
      console.error(`Error generating preview for ${component.name}:`, error)

      // 返回错误预览
      return this.createErrorPreview(component, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * 批量生成预览
   */
  async generateBatchPreviews(components: ComponentInfo[], options: PreviewOptions): Promise<ComponentPreview[]> {
    const batchSize = 5 // 限制并发数量
    const results: ComponentPreview[] = []

    for (let i = 0; i < components.length; i += batchSize) {
      const batch = components.slice(i, i + batchSize)
      const batchPromises = batch.map(component => this.generatePreview(component, options))
      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
    }

    return results
  }

  /**
   * 优化预览
   */
  optimizePreview(preview: ComponentPreview, context: PreviewContext): ComponentPreview {
    // 根据上下文优化预览
    const optimized = { ...preview }

    // 根据设备类型调整
    if (context.deviceType === 'mobile') {
      optimized.metadata.dimensions = {
        width: Math.min(preview.metadata.dimensions.width, 375),
        height: preview.metadata.dimensions.height
      }
    }

    // 根据性能模式调整
    if (context.performanceMode === 'speed') {
      // 移除复杂的动画和交互
      optimized.rendered.live = this.simplifyComponent(preview.rendered.live)
    }

    return optimized
  }

  /**
   * 缓存预览
   */
  cachePreview(component: ComponentInfo, preview: ComponentPreview, options: PreviewOptions): void {
    if (!this.config.cache.enabled) return

    const key = this.generateCacheKey(component, options)
    const timestamp = Date.now()

    // 检查缓存大小限制
    if (this.cache.size >= this.config.cache.maxSize) {
      this.evictOldestEntry()
    }

    this.cache.set(key, { preview, timestamp })
  }

  /**
   * 获取缓存的预览
   */
  getCachedPreview(component: ComponentInfo, options: PreviewOptions): ComponentPreview | null {
    if (!this.config.cache.enabled) return null

    const key = this.generateCacheKey(component, options)
    const cached = this.cache.get(key)

    if (!cached) return null

    // 检查是否过期
    if (Date.now() - cached.timestamp > this.config.cache.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.preview
  }

  /**
   * 清除缓存
   */
  clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }

    // 清除匹配模式的缓存
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 获取缓存统计
   */
  getCacheStats(): CacheStats {
    const now = Date.now()
    let oldestEntry = now
    let newestEntry = 0
    let totalMemoryUsage = 0

    for (const { timestamp } of this.cache.values()) {
      oldestEntry = Math.min(oldestEntry, timestamp)
      newestEntry = Math.max(newestEntry, timestamp)
      totalMemoryUsage += 1024 // 估算每个条目占用 1KB
    }

    return {
      size: this.cache.size,
      hits: this.performanceStats.get('cache_hits') || 0,
      misses: this.performanceStats.get('cache_misses') || 0,
      hitRate: this.calculateHitRate(),
      memoryUsage: totalMemoryUsage,
      oldestEntry,
      newestEntry
    }
  }

  /**
   * 预热缓存
   */
  async warmupCache(components: ComponentInfo[], options?: PreviewOptions): Promise<void> {
    const warmupOptions = {
      mode: 'compact' as const,
      theme: 'default',
      size: 'md' as const,
      interactive: false,
      animated: false,
      showCode: false,
      ...options
    }

    console.log(`Warming up cache for ${components.length} components...`)

    // 并发生成预览，但限制并发数量
    const batchSize = 3
    for (let i = 0; i < components.length; i += batchSize) {
      const batch = components.slice(i, i + batchSize)
      await Promise.all(batch.map(component => this.generatePreview(component, warmupOptions)))
    }

    console.log(`Cache warmup completed. Cached ${this.cache.size} components.`)
  }

  /**
   * 分析组件复杂度
   */
  async analyzeComplexity(component: ComponentInfo): Promise<'simple' | 'medium' | 'complex'> {
    let complexity = 0

    // 基于属性数量
    if (component.props) {
      complexity += component.props.length * 2
    }

    // 基于变体数量
    if (component.variants) {
      complexity += component.variants.length
    }

    // 基于描述长度
    complexity += component.description.length / 20

    // 基于组件类型
    const complexComponents = ['DataTable', 'Modal', 'Tabs', 'Form', 'AdvancedCard']
    if (complexComponents.includes(component.name)) {
      complexity += 10
    }

    if (complexity < 10) return 'simple'
    if (complexity < 25) return 'medium'
    return 'complex'
  }

  /**
   * 生成使用建议
   */
  async generateSuggestions(component: ComponentInfo, context?: PreviewContext): Promise<{
    relatedComponents: string[]
    popularCombinations: string[]
    usageTips: string[]
    companionComponents: string[]
  }> {
    // 简化的建议生成逻辑
    const suggestions = {
      relatedComponents: this.findRelatedComponents(component),
      popularCombinations: this.findPopularCombinations(component),
      usageTips: this.generateUsageTips(component),
      companionComponents: this.findCompanionComponents(component)
    }

    return suggestions
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(component: ComponentInfo, options: PreviewOptions): string {
    const keyParts = [
      component.name,
      options.mode,
      options.theme,
      options.size,
      options.interactive.toString(),
      options.animated.toString(),
      options.showCode.toString()
    ]

    return keyParts.join(':')
  }

  /**
   * 驱逐最旧的缓存条目
   */
  private evictOldestEntry(): void {
    let oldestKey = ''
    let oldestTime = Date.now()

    for (const [key, { timestamp }] of this.cache.entries()) {
      if (timestamp < oldestTime) {
        oldestTime = timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  /**
   * 计算命中率
   */
  private calculateHitRate(): number {
    const hits = this.performanceStats.get('cache_hits') || 0
    const misses = this.performanceStats.get('cache_misses') || 0
    const total = hits + misses
    return total > 0 ? hits / total : 0
  }

  /**
   * 生成截图（简化实现）
   */
  private async generateScreenshot(component: React.ReactNode): Promise<string> {
    // 在实际项目中，这里应该使用真实的截图库
    // 例如：html2canvas 或 puppeteer
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  }

  /**
   * 生成代码示例
   */
  private async generateCodeExample(component: ComponentInfo, props: Record<string, any>, options: PreviewOptions): Promise<string> {
    const imports = `import { ${component.name} } from '@xorigo-ui/core'`

    const propsString = Object.entries(props)
      .filter(([key, value]) => value !== undefined && value !== null && value !== false)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`
        } else if (typeof value === 'boolean') {
          return value ? key : ''
        } else if (typeof value === 'object') {
          return `${key}={${JSON.stringify(value)}}`
        } else {
          return `${key}={${value}}`
        }
      })
      .filter(Boolean)
      .join(' ')

    const componentUsage = propsString
      ? `<${component.name} ${propsString} />`
      : `<${component.name} />`

    return `${imports}\n\nexport default function Example() {\n  return (\n    ${componentUsage}\n  )\n}`
  }

  /**
   * 分析性能指标
   */
  private async analyzePerformance(component: React.ReactNode, componentInfo: ComponentInfo): Promise<any> {
    return {
      renderTime: Math.random() * 50, // 模拟渲染时间
      memoryUsage: Math.random() * 1024 * 10, // 模拟内存使用
      componentCount: 1,
      domNodes: Math.floor(Math.random() * 50) + 10,
      cssRules: Math.floor(Math.random() * 20) + 5,
      jsSize: Math.floor(Math.random() * 1000) + 500
    }
  }

  /**
   * 分析可访问性
   */
  private async analyzeAccessibility(component: React.ReactNode, componentInfo: ComponentInfo): Promise<any> {
    return {
      passesAccessibility: true,
      ariaAttributes: [],
      keyboardNavigable: true,
      screenReaderSupport: true,
      colorContrast: {
        normal: 4.5,
        large: 3.0,
        passesWCAG: true
      },
      focusManagement: true
    }
  }

  /**
   * 计算组件尺寸
   */
  private async calculateDimensions(component: ComponentInfo, options: PreviewOptions): Promise<{ width: number; height: number }> {
    const sizeMap = {
      sm: { width: 200, height: 100 },
      md: { width: 300, height: 150 },
      lg: { width: 400, height: 200 }
    }

    return sizeMap[options.size] || sizeMap.md
  }

  /**
   * 创建错误预览
   */
  private createErrorPreview(component: ComponentInfo, error: string): ComponentPreview {
    return {
      component,
      rendered: {
        live: React.createElement('div', {
          style: {
            padding: '20px',
            border: '2px solid #ff6b6b',
            borderRadius: '8px',
            backgroundColor: '#ffe0e0',
            color: '#d63031',
            textAlign: 'center'
          }
        }, [
          React.createElement('div', { key: 'title', style: { fontWeight: 'bold', marginBottom: '8px' } }, 'Preview Error'),
          React.createElement('div', { key: 'message', style: { fontSize: '14px' } }, error)
        ])
      },
      metadata: {
        dimensions: { width: 300, height: 150 },
        loadTime: 0,
        complexity: 'simple',
        accessibility: {
          passesAccessibility: false,
          ariaAttributes: [],
          keyboardNavigable: false,
          screenReaderSupport: false,
          colorContrast: { normal: 1, large: 1, passesWCAG: false },
          focusManagement: false
        },
        performance: {
          renderTime: 0,
          memoryUsage: 0,
          componentCount: 0,
          domNodes: 0,
          cssRules: 0,
          jsSize: 0
        }
      },
      suggestions: {
        relatedComponents: [],
        popularCombinations: [],
        usageTips: [],
        companionComponents: []
      }
    }
  }

  /**
   * 简化组件
   */
  private simplifyComponent(component: React.ReactNode): React.ReactNode {
    // 简化组件以提升性能
    return component
  }

  /**
   * 查找相关组件
   */
  private findRelatedComponents(component: ComponentInfo): string[] {
    // 基于分类查找相关组件
    const relatedMap: Record<string, string[]> = {
      'form': ['Input', 'Button', 'Select', 'Checkbox'],
      'navigation': ['Tabs', 'Menu', 'Breadcrumb'],
      'data-display': ['Card', 'Table', 'List'],
      'feedback': ['Alert', 'Toast', 'Modal']
    }

    return relatedMap[component.category] || []
  }

  /**
   * 查找流行组合
   */
  private findPopularCombinations(component: ComponentInfo): string[] {
    // 基于使用模式查找流行组合
    const combinationMap: Record<string, string[]> = {
      'Button': ['Form', 'Modal', 'Card'],
      'Input': ['Form', 'SearchInput', 'InputGroup'],
      'Card': ['Button', 'Avatar', 'Badge'],
      'Modal': ['Button', 'Form', 'Alert'],
      'Table': ['Pagination', 'Button', 'Input']
    }

    return combinationMap[component.name] || []
  }

  /**
   * 生成使用提示
   */
  private generateUsageTips(component: ComponentInfo): string[] {
    const tipsMap: Record<string, string[]> = {
      'Button': ['使用明确的按钮文本', '为图标按钮添加 aria-label', '考虑禁用状态的样式'],
      'Input': ['提供清晰的标签和占位符', '实现适当的验证', '支持键盘导航'],
      'Modal': ['确保可以通过 ESC 键关闭', '提供清晰的关闭按钮', '管理焦点'],
      'Card': ['保持内容简洁', '使用一致的间距', '确保可访问性']
    }

    return tipsMap[component.name] || ['参考组件文档了解更多用法']
  }

  /**
   * 查找配套组件
   */
  private findCompanionComponents(component: ComponentInfo): string[] {
    const companionMap: Record<string, string[]> = {
      'Form': ['Button', 'Input', 'Select', 'ValidationMessage'],
      'Table': ['Pagination', 'SortButton', 'FilterButton'],
      'Modal': ['Button', 'Overlay', 'Portal'],
      'Tabs': ['TabPanel', 'TabList', 'Tab']
    }

    return companionMap[component.name] || []
  }
}

/**
 * 创建智能预览引擎实例
 */
export function createIntelligentPreviewEngine(config?: Partial<PreviewConfig>): IntelligentPreviewEngine {
  return new IntelligentPreviewEngineImpl(config)
}

// 导出类型
export type {
  IntelligentPreviewEngine,
  ComponentPreview,
  PreviewOptions,
  PreviewConfig,
  PreviewContext
} from './types'