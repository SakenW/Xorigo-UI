'use client'

import { checkWCAGCompliance, validateColorContrast, type WCAGComplianceResult, type ColorContrastResult } from './accessibility'

// =============================================================================
// 可访问性测试套件
// =============================================================================

export interface AccessibilityTestResult {
  component: string
  score: number
  wcagCompliant: boolean
  issues: Array<{
    type: 'error' | 'warning' | 'info'
    category: 'keyboard' | 'aria' | 'contrast' | 'focus' | 'screen-reader' | 'color'
    message: string
    element?: string
    recommendation: string
  }>
  tests: {
    keyboardNavigation: boolean
    ariaAttributes: boolean
    colorContrast: boolean
    focusManagement: boolean
    screenReaderSupport: boolean
  }
  colorContrastResults?: ColorContrastResult[]
}

export class AccessibilityTester {
  private testResults: AccessibilityTestResult[] = []

  /**
   * 测试单个组件的可访问性
   */
  testComponent(
    componentName: string,
    element: HTMLElement,
    props: Record<string, any> = {}
  ): AccessibilityTestResult {
    const issues: AccessibilityTestResult['issues'] = []
    const tests = {
      keyboardNavigation: true,
      ariaAttributes: true,
      colorContrast: true,
      focusManagement: true,
      screenReaderSupport: true
    }

    // 1. 键盘导航测试
    this.testKeyboardNavigation(element, issues)
    if (issues.some(i => i.category === 'keyboard')) {
      tests.keyboardNavigation = false
    }

    // 2. ARIA 属性测试
    this.testAriaAttributes(element, issues)
    if (issues.some(i => i.category === 'aria')) {
      tests.ariaAttributes = false
    }

    // 3. 颜色对比度测试
    const colorContrastResults = this.testColorContrast(element, issues)
    if (issues.some(i => i.category === 'contrast')) {
      tests.colorContrast = false
    }

    // 4. 焦点管理测试
    this.testFocusManagement(element, issues)
    if (issues.some(i => i.category === 'focus')) {
      tests.focusManagement = false
    }

    // 5. 屏幕阅读器支持测试
    this.testScreenReaderSupport(element, issues)
    if (issues.some(i => i.category === 'screen-reader')) {
      tests.screenReaderSupport = false
    }

    // 计算分数
    const score = this.calculateScore(tests, issues)

    const result: AccessibilityTestResult = {
      component: componentName,
      score,
      wcagCompliant: issues.filter(i => i.type === 'error').length === 0,
      issues,
      tests,
      colorContrastResults
    }

    this.testResults.push(result)
    return result
  }

  /**
   * 测试整个页面的可访问性
   */
  testPage(): AccessibilityTestResult[] {
    this.testResults = []

    // 安全检查：确保在浏览器环境中
    if (typeof document === 'undefined') {
      return []
    }

    // 查找所有可交互元素
    const interactiveElements = document.querySelectorAll(
      'button, [role="button"], input, select, textarea, a, [tabindex]:not([tabindex="-1"])'
    )

    // 如果没有找到可交互元素，返回空数组
    if (interactiveElements.length === 0) {
      return []
    }

    // 测试每个元素
    interactiveElements.forEach((element, index) => {
      const tagName = element.tagName.toLowerCase()
      const role = element.getAttribute('role')
      const componentType = role || tagName

      this.testComponent(
        `${componentType}-${index}`,
        element as HTMLElement,
        this.getElementProps(element as HTMLElement)
      )
    })

    return this.testResults
  }

  /**
   * 生成可访问性报告
   */
  generateReport(): {
    overallScore: number
    wcagCompliant: boolean
    componentResults: AccessibilityTestResult[]
    summary: {
      totalIssues: number
      errors: number
      warnings: number
      info: number
    }
    recommendations: string[]
  } {
    const totalIssues = this.testResults.reduce((sum, result) => sum + result.issues.length, 0)
    const errors = this.testResults.reduce((sum, result) =>
      sum + result.issues.filter(i => i.type === 'error').length, 0)
    const warnings = this.testResults.reduce((sum, result) =>
      sum + result.issues.filter(i => i.type === 'warning').length, 0)
    const info = this.testResults.reduce((sum, result) =>
      sum + result.issues.filter(i => i.type === 'info').length, 0)

    const overallScore = this.testResults.length > 0
      ? Math.round(this.testResults.reduce((sum, result) => sum + result.score, 0) / this.testResults.length)
      : 100

    const wcagCompliant = errors === 0

    const recommendations = this.generateRecommendations()

    return {
      overallScore,
      wcagCompliant,
      componentResults: this.testResults,
      summary: {
        totalIssues,
        errors,
        warnings,
        info
      },
      recommendations
    }
  }

  // =============================================================================
  // 私有测试方法
  // =============================================================================

  private testKeyboardNavigation(element: HTMLElement, issues: AccessibilityTestResult['issues']): void {
    // 检查是否可通过键盘访问
    if (element.tabIndex < 0 && element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA') {
      issues.push({
        type: 'warning',
        category: 'keyboard',
        message: 'Element is not keyboard accessible',
        element: this.getElementSelector(element),
        recommendation: 'Add tabindex="0" or ensure element is naturally focusable'
      })
    }

    // 检查交互元素是否有键盘事件处理
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea']
    if (interactiveTags.includes(element.tagName.toLowerCase())) {
      const hasKeyHandler = element.onkeydown !== null || element.getAttribute('onkeydown') !== null
      if (!hasKeyHandler && element.tagName === 'BUTTON') {
        issues.push({
          type: 'warning',
          category: 'keyboard',
          message: 'Button should have keyboard event handler',
          element: this.getElementSelector(element),
          recommendation: 'Add onKeyDown handler to support Enter/Space keys'
        })
      }
    }
  }

  private testAriaAttributes(element: HTMLElement, issues: AccessibilityTestResult['issues']): void {
    const role = element.getAttribute('role')
    const ariaLabel = element.getAttribute('aria-label')
    const ariaLabelledBy = element.getAttribute('aria-labelledby')
    const ariaDescribedBy = element.getAttribute('aria-describedby')
    const ariaRequired = element.getAttribute('aria-required')
    const ariaInvalid = element.getAttribute('aria-invalid')

    // 检查标签
    if (element.tagName === 'INPUT' && element.type !== 'hidden') {
      const hasLabel = element.labels && element.labels.length > 0
      if (!hasLabel && !ariaLabel && !ariaLabelledBy) {
        issues.push({
          type: 'error',
          category: 'aria',
          message: 'Input element is missing label',
          element: this.getElementSelector(element),
          recommendation: 'Add label element or aria-label/aria-labelledby attribute'
        })
      }
    }

    // 检查必填字段
    if (element.hasAttribute('required') && !ariaRequired) {
      issues.push({
        type: 'warning',
        category: 'aria',
        message: 'Required field should have aria-required="true"',
        element: this.getElementSelector(element),
        recommendation: 'Add aria-required="true" to required fields'
      })
    }

    // 检查错误状态
    const hasError = element.classList.contains('error') || element.getAttribute('aria-invalid') === 'true'
    if (hasError && !ariaInvalid) {
      issues.push({
        type: 'error',
        category: 'aria',
        message: 'Error state missing aria-invalid attribute',
        element: this.getElementSelector(element),
        recommendation: 'Add aria-invalid="true" when element has error state'
      })
    }

    // 检查按钮角色
    if (element.tagName === 'BUTTON' && role && role !== 'button') {
      issues.push({
        type: 'warning',
        category: 'aria',
        message: 'Button element has non-standard role',
        element: this.getElementSelector(element),
        recommendation: 'Remove role attribute from button elements'
      })
    }
  }

  private testColorContrast(element: HTMLElement, issues: AccessibilityTestResult['issues']): ColorContrastResult[] {
    const results: ColorContrastResult[] = []
    const styles = window.getComputedStyle(element)

    // 获取前景色和背景色
    const foregroundColor = this.rgbToHex(styles.color)
    const backgroundColor = this.rgbToHex(styles.backgroundColor)

    // 跳过透明背景
    if (backgroundColor === 'transparent' || backgroundColor === 'rgba(0, 0, 0, 0)') {
      return results
    }

    // 检查对比度
    const contrastResult = validateColorContrast(foregroundColor, backgroundColor)
    results.push(contrastResult)

    if (!contrastResult.wcagAA) {
      issues.push({
        type: 'error',
        category: 'contrast',
        message: `Color contrast ratio ${contrastResult.ratio.toFixed(2)}:1 is below WCAG AA standard (4.5:1)`,
        element: this.getElementSelector(element),
        recommendation: contrastResult.recommendation || 'Increase color contrast'
      })
    } else if (!contrastResult.wcagAAA) {
      issues.push({
        type: 'warning',
        category: 'contrast',
        message: `Color contrast ratio ${contrastResult.ratio.toFixed(2)}:1 meets AA but not AAA standard (7:1)`,
        element: this.getElementSelector(element),
        recommendation: 'Consider increasing contrast for better readability'
      })
    }

    return results
  }

  private testFocusManagement(element: HTMLElement, issues: AccessibilityTestResult['issues']): void {
    // 检查焦点样式
    const styles = window.getComputedStyle(element, ':focus')
    const hasFocusStyle = styles.outline !== 'none' || styles.boxShadow !== 'none'

    if (!hasFocusStyle && element.tabIndex >= 0) {
      issues.push({
        type: 'error',
        category: 'focus',
        message: 'Focusable element lacks visible focus indicator',
        element: this.getElementSelector(element),
        recommendation: 'Add focus styles using :focus pseudo-class or focus-visible'
      })
    }

    // 检查模态框焦点管理
    if (element.getAttribute('role') === 'dialog' || element.classList.contains('modal')) {
      const modalId = element.id
      if (modalId) {
        const focusableElements = element.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length === 0) {
          issues.push({
            type: 'error',
            category: 'focus',
            message: 'Modal has no focusable elements',
            element: this.getElementSelector(element),
            recommendation: 'Ensure modal contains at least one focusable element'
          })
        }
      }
    }
  }

  private testScreenReaderSupport(element: HTMLElement, issues: AccessibilityTestResult['issues']): void {
    // 检查图片 alt 文本
    if (element.tagName === 'IMG') {
      const alt = element.getAttribute('alt')
      if (!alt && alt !== '') {
        issues.push({
          type: 'error',
          category: 'screen-reader',
          message: 'Image missing alt attribute',
          element: this.getElementSelector(element),
          recommendation: 'Add descriptive alt text or alt="" for decorative images'
        })
      }
    }

    // 检查标题结构
    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
      const level = parseInt(element.tagName.charAt(1))
      const headingText = element.textContent?.trim()

      if (!headingText) {
        issues.push({
          type: 'warning',
          category: 'screen-reader',
          message: 'Heading element is empty',
          element: this.getElementSelector(element),
          recommendation: 'Provide meaningful text content for headings'
        })
      }
    }

    // 检查链接的目的
    if (element.tagName === 'A') {
      const linkText = element.textContent?.trim()
      if (!linkText && !element.getAttribute('aria-label')) {
        issues.push({
          type: 'error',
          category: 'screen-reader',
          message: 'Link has no accessible text',
          element: this.getElementSelector(element),
          recommendation: 'Add text content or aria-label to describe link destination'
        })
      }
    }
  }

  private calculateScore(tests: AccessibilityTestResult['tests'], issues: AccessibilityTestResult['issues']): number {
    let score = 100

    // 基础分数
    Object.values(tests).forEach(passed => {
      if (!passed) score -= 15
    })

    // 问题扣分
    issues.forEach(issue => {
      switch (issue.type) {
        case 'error':
          score -= 10
          break
        case 'warning':
          score -= 5
          break
        case 'info':
          score -= 2
          break
      }
    })

    return Math.max(0, score)
  }

  private getElementProps(element: HTMLElement): Record<string, any> {
    const props: Record<string, any> = {}

    // 常用属性
    const attributes = ['disabled', 'required', 'readonly', 'placeholder', 'type', 'role', 'aria-label', 'aria-labelledby', 'aria-describedby']
    attributes.forEach(attr => {
      const value = element.getAttribute(attr)
      if (value !== null) {
        props[attr] = value
      }
    })

    // 类名
    if (element.className) {
      props.className = element.className
    }

    return props
  }

  private getElementSelector(element: HTMLElement): string {
    if (element.id) {
      return `#${element.id}`
    }

    if (element.className) {
      const classes = element.className.split(' ').filter(c => c.trim())
      if (classes.length > 0) {
        return `${element.tagName.toLowerCase()}.${classes[0]}`
      }
    }

    return element.tagName.toLowerCase()
  }

  private rgbToHex(rgb: string): string {
    // 处理 rgb() 格式
    const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1])
      const g = parseInt(rgbMatch[2])
      const b = parseInt(rgbMatch[3])
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    }

    // 处理 rgba() 格式
    const rgbaMatch = rgb.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/)
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1])
      const g = parseInt(rgbaMatch[2])
      const b = parseInt(rgbaMatch[3])
      const a = parseFloat(rgbaMatch[4])

      if (a < 0.5) {
        return 'transparent'
      }

      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    }

    // 处理十六进制格式
    if (rgb.startsWith('#')) {
      return rgb
    }

    return '#000000' // 默认黑色
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = []
    const commonErrors = this.getCommonIssues()

    if (commonErrors.keyboard > 0) {
      recommendations.push('Add keyboard navigation support for interactive elements')
    }

    if (commonErrors.aria > 0) {
      recommendations.push('Ensure proper ARIA attributes for screen readers')
    }

    if (commonErrors.contrast > 0) {
      recommendations.push('Improve color contrast to meet WCAG AA standards')
    }

    if (commonErrors.focus > 0) {
      recommendations.push('Add visible focus indicators for keyboard navigation')
    }

    if (commonErrors['screen-reader'] > 0) {
      recommendations.push('Provide alternative text for images and descriptive labels')
    }

    return recommendations
  }

  private getCommonIssues(): Record<string, number> {
    const commonErrors = {
      keyboard: 0,
      aria: 0,
      contrast: 0,
      focus: 0,
      'screen-reader': 0
    }

    this.testResults.forEach(result => {
      result.issues.forEach(issue => {
        commonErrors[issue.category]++
      })
    })

    return commonErrors
  }
}

// =============================================================================
// 导出单例实例
// =============================================================================

export const accessibilityTester = new AccessibilityTester()

// =============================================================================
// 开发工具函数
// =============================================================================

/**
 * 在开发环境中运行可访问性测试
 */
export function runAccessibilityTests(): AccessibilityTestResult[] {
  if (process.env.NODE_ENV === 'development') {
    try {
      console.group('🔍 Running Accessibility Tests')
      const results = accessibilityTester.testPage()
      const report = accessibilityTester.generateReport()

      console.log('📊 Overall Score:', report.overallScore)
      console.log('✅ WCAG Compliant:', report.wcagCompliant)
      console.log('📋 Summary:', report.summary)

      if (report.recommendations && report.recommendations.length > 0) {
        console.log('💡 Recommendations:', report.recommendations)
      }

      console.groupEnd()
      return results
    } catch (error) {
      console.warn('⚠️ Accessibility tests failed:', error)
      console.groupEnd()
      return []
    }
  }

  return []
}

/**
 * 测试特定组件的可访问性
 */
export function testComponentAccessibility(
  componentName: string,
  element: HTMLElement,
  props?: Record<string, any>
): AccessibilityTestResult {
  return accessibilityTester.testComponent(componentName, element, props)
}

export default accessibilityTester