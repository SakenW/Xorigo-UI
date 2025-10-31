/**
 * Xorigo UI 企业级可访问性合规验证系统
 *
 * 基于 WCAG 2.1 AA 标准的完整合规性检测框架
 * 支持实时监控、自动报告和智能修复建议
 *
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import { ReactElement } from 'react'
import { getContrastRatio } from '@xorigo/utils/container-aware-colors'

// ==================== WCAG 2.1 AA 标准定义 ====================

export interface WCAGGuideline {
  id: string
  title: string
  description: string
  level: 'A' | 'AA' | 'AAA'
  category: 'perceivable' | 'operable' | 'understandable' | 'robust'
  successCriteria: string[]
}

export interface AccessibilityViolation {
  id: string
  guideline: string
  severity: 'critical' | 'serious' | 'moderate' | 'minor'
  element: string
  issue: string
  suggestion: string
  automated: boolean
  needsManualReview: boolean
}

export interface AccessibilityReport {
  timestamp: Date
  overallScore: number
  complianceLevel: 'A' | 'AA' | 'AAA' | 'non-compliant'
  violations: AccessibilityViolation[]
  passedChecks: number
  totalChecks: number
  componentAnalysis: ComponentAccessibilityAnalysis[]
  themeCompliance: ThemeComplianceReport
}

export interface ComponentAccessibilityAnalysis {
  componentName: string
  score: number
  violations: AccessibilityViolation[]
  passedTests: string[]
  missedTests: string[]
  keyboardNavigation: KeyboardNavigationAnalysis
  colorContrast: ColorContrastAnalysis
  screenReader: ScreenReaderAnalysis
}

export interface KeyboardNavigationAnalysis {
  focusableElements: number
  tabIndexCorrect: boolean
  focusOrder: number[]
  trapElements: string[]
  skipLinks: string[]
  focusIndicators: FocusIndicator[]
}

export interface FocusIndicator {
  element: string
  hasVisibleIndicator: boolean
  indicatorStyle: 'outline' | 'border' | 'background' | 'custom' | 'none'
  contrastRatio: number
}

export interface ColorContrastAnalysis {
  textCombinations: ContrastCheck[]
  iconCombinations: ContrastCheck[]
  interactiveElements: ContrastCheck[]
  stateCombinations: ContrastCheck[]
  themeCoverage: ThemeCoverage
}

export interface ContrastCheck {
  foreground: string
  background: string
  ratio: number
  passesAA: boolean
  passesAAA: boolean
  context: string
  fontSize: 'normal' | 'large'
  weight: 'normal' | 'bold'
}

export interface ThemeCoverage {
  lightTheme: ComplianceStatus
  darkTheme: ComplianceStatus
  highContrast: ComplianceStatus
  customThemes: { [themeName: string]: ComplianceStatus }
}

export interface ComplianceStatus {
  percentage: number
  passCount: number
  totalCount: number
  issues: string[]
}

export interface ScreenReaderAnalysis {
  ariaLabels: ARIAAnalysis[]
  roles: RoleAnalysis[]
  announcements: AnnouncementAnalysis[]
  landmarks: LandmarkAnalysis[]
  forms: FormAccessibilityAnalysis
}

export interface ARIAAnalysis {
  element: string
  hasLabel: boolean
  labelType: 'aria-label' | 'aria-labelledby' | 'title' | 'none'
  descriptive: boolean
  validRole: boolean
}

export interface RoleAnalysis {
  element: string
  role: string
  isValid: boolean
  requiredAttributes: string[]
  missingAttributes: string[]
  optionalAttributes: string[]
}

export interface AnnouncementAnalysis {
  trigger: string
  message: string
  polite: boolean
  timing: 'immediate' | 'delayed'
}

export interface LandmarkAnalysis {
  landmarks: string[]
  hierarchy: boolean
  navigationElements: number
  mainContent: boolean
  complementary: boolean
}

export interface FormAccessibilityAnalysis {
  inputs: FormInputAnalysis[]
  validation: ValidationAnalysis
  errorHandling: ErrorHandlingAnalysis
  instructions: boolean
}

export interface FormInputAnalysis {
  inputType: string
  hasLabel: boolean
  labelAssociated: boolean
  hasPlaceholder: boolean
  hasRequired: boolean
  hasError: boolean
  errorMessage: string
}

export interface ValidationAnalysis {
  realTime: boolean
  clearMessages: boolean
  accessibleErrors: boolean
  errorSummary: boolean
}

export interface ErrorHandlingAnalysis {
  inlineErrors: boolean
  errorAnnouncement: boolean
  correctionGuidance: boolean
  errorPrevention: boolean
}

export interface ThemeComplianceReport {
  currentTheme: string
  contrastRatios: { [key: string]: number }
  failsContrast: string[]
  passesWCAG: { [level: string]: boolean }
  recommendations: ThemeRecommendation[]
}

export interface ThemeRecommendation {
  type: 'contrast' | 'color' | 'typography' | 'spacing'
  priority: 'high' | 'medium' | 'low'
  description: string
  suggestedFix: string
}

// ==================== 核心验证类 ====================

export class WCAGComplianceValidator {
  private guidelines: WCAGGuideline[] = []
  private currentTheme: string = 'light'
  private componentRegistry: Map<string, ReactElement> = new Map()

  constructor() {
    this.initializeGuidelines()
  }

  private initializeGuidelines() {
    this.guidelines = [
      // 感知性 (Perceivable)
      {
        id: '1.1.1',
        title: 'Non-text Content',
        description: 'All non-text content has a text alternative',
        level: 'A',
        category: 'perceivable',
        successCriteria: ['alt-text', 'aria-label', 'svg-description']
      },
      {
        id: '1.3.1',
        title: 'Info and Relationships',
        description: 'Information, structure, and relationships can be programmatically determined',
        level: 'A',
        category: 'perceivable',
        successCriteria: ['semantic-markup', 'heading-hierarchy', 'list-structure']
      },
      {
        id: '1.3.4',
        title: 'Orientation',
        description: 'Content does not restrict its view and operation to a single display orientation',
        level: 'AA',
        category: 'perceivable',
        successCriteria: ['responsive-design', 'orientation-support']
      },
      {
        id: '1.4.3',
        title: 'Contrast (Minimum)',
        description: 'Text images and visual presentations of text have a contrast ratio of at least 4.5:1',
        level: 'AA',
        category: 'perceivable',
        successCriteria: ['text-contrast', 'large-text-contrast', 'icon-contrast']
      },
      {
        id: '1.4.10',
        title: 'Reflow',
        description: 'Content can be presented without loss of information or functionality',
        level: 'AA',
        category: 'perceivable',
        successCriteria: ['horizontal-scrolling', 'text-wrapping', 'zoom-support']
      },
      {
        id: '1.4.11',
        title: 'Non-text Contrast',
        description: 'The visual presentation of user interface components has a contrast ratio of at least 3:1',
        level: 'AA',
        category: 'perceivable',
        successCriteria: ['component-contrast', 'state-indicators', 'boundaries']
      },
      {
        id: '1.4.12',
        title: 'Text Spacing',
        description: 'Text spacing can be set without loss of content or functionality',
        level: 'AA',
        category: 'perceivable',
        successCriteria: ['line-height', 'letter-spacing', 'word-spacing', 'paragraph-spacing']
      },

      // 可操作性 (Operable)
      {
        id: '2.1.1',
        title: 'Keyboard',
        description: 'All functionality is available using a keyboard',
        level: 'A',
        category: 'operable',
        successCriteria: ['keyboard-accessible', 'focus-visible', 'no-keyboard-trap']
      },
      {
        id: '2.1.2',
        title: 'No Keyboard Trap',
        description: 'Keyboard focus does not become trapped',
        level: 'A',
        category: 'operable',
        successCriteria: ['focus-management', 'escape-hatches', 'focus-order']
      },
      {
        id: '2.2.1',
        title: 'Timing Adjustable',
        description: 'Users are warned of the duration of any limit or given the option to turn it off',
        level: 'A',
        category: 'operable',
        successCriteria: ['time-limits', 'pause-controls', 'auto-refresh-control']
      },
      {
        id: '2.3.1',
        title: 'Three Flashes or Below',
        description: 'Web pages do not contain anything that flashes more than three times per second',
        level: 'A',
        category: 'operable',
        successCriteria: ['flashing-content', 'motion-control', 'seizure-safe']
      },
      {
        id: '2.4.1',
        title: 'Bypass Blocks',
        description: 'A mechanism is available to bypass blocks of content',
        level: 'A',
        category: 'operable',
        successCriteria: ['skip-links', 'landmarks', 'headings']
      },
      {
        id: '2.4.2',
        title: 'Page Titled',
        description: 'Web pages have titles that describe topic or purpose',
        level: 'A',
        category: 'operable',
        successCriteria: ['page-title', 'iframe-titles']
      },
      {
        id: '2.4.3',
        title: 'Focus Order',
        description: 'Focus order preserves meaning and operability',
        level: 'A',
        category: 'operable',
        successCriteria: ['logical-order', 'tab-order', 'focus-management']
      },
      {
        id: '2.4.7',
        title: 'Focus Visible',
        description: 'Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible',
        level: 'AA',
        category: 'operable',
        successCriteria: ['focus-indicator', 'high-contrast-focus', 'custom-focus']
      },

      // 可理解性 (Understandable)
      {
        id: '3.1.1',
        title: 'Language of Page',
        description: 'The default human language of each web page can be programmatically determined',
        level: 'A',
        category: 'understandable',
        successCriteria: ['html-lang', 'lang-attribute']
      },
      {
        id: '3.1.2',
        title: 'Language of Parts',
        description: 'The human language of each passage or phrase can be programmatically determined',
        level: 'AA',
        category: 'understandable',
        successCriteria: ['lang-attribute-parts', 'language-changes']
      },
      {
        id: '3.2.1',
        title: 'On Focus',
        description: 'When any component receives focus, it does not initiate a change of context',
        level: 'A',
        category: 'understandable',
        successCriteria: ['focus-behavior', 'no-auto-change', 'predictable-focus']
      },
      {
        id: '3.2.2',
        title: 'On Input',
        description: 'Changing the setting of any user interface component does not automatically cause a change of context',
        level: 'A',
        category: 'understandable',
        successCriteria: ['input-behavior', 'no-auto-submit', 'predictable-input']
      },
      {
        id: '3.3.1',
        title: 'Error Identification',
        description: 'If an input error is automatically detected, the item is identified and the error is described to the user',
        level: 'A',
        category: 'understandable',
        successCriteria: ['error-messages', 'error-identification', 'field-errors']
      },
      {
        id: '3.3.2',
        title: 'Labels or Instructions',
        description: 'Labels or instructions are provided when content requires user input',
        level: 'A',
        category: 'understandable',
        successCriteria: ['form-labels', 'instructions', 'field-identification']
      },
      {
        id: '3.3.3',
        title: 'Error Suggestion',
        description: 'If an input error is automatically detected and suggestions for correction are known, then the suggestions are provided to the user',
        level: 'AA',
        category: 'understandable',
        successCriteria: ['error-suggestions', 'correction-hints', 'input-guidance']
      },
      {
        id: '3.3.4',
        title: 'Error Prevention (Legal, Financial, Data)',
        description: 'For web pages that cause legal commitments or financial transactions, data modification or deletion, user input is verified',
        level: 'AA',
        category: 'understandable',
        successCriteria: ['error-prevention', 'confirmation-dialogs', 'review-submission']
      },

      // 健壮性 (Robust)
      {
        id: '4.1.1',
        title: 'Parsing',
        description: 'In content implemented using markup languages, elements have complete start and end tags',
        level: 'A',
        category: 'robust',
        successCriteria: ['valid-html', 'proper-nesting', 'element-structure']
      },
      {
        id: '4.1.2',
        title: 'Name, Role, Value',
        description: 'For all user interface components, the name and role can be programmatically determined',
        level: 'A',
        category: 'robust',
        successCriteria: ['accessible-name', 'role-attributes', 'value-properties']
      },
      {
        id: '4.1.3',
        title: 'Status Messages',
        description: 'In content implemented using markup languages, status messages can be programmatically determined',
        level: 'AA',
        category: 'robust',
        successCriteria: ['live-regions', 'status-announcements', 'dynamic-content']
      }
    ]
  }

  // ==================== 主要验证方法 ====================

  /**
   * 执行完整的可访问性合规性检查
   */
  async validateAccessibility(
    components: ReactElement[],
    theme: string = 'light'
  ): Promise<AccessibilityReport> {
    this.currentTheme = theme

    const violations: AccessibilityViolation[] = []
    const componentAnalyses: ComponentAccessibilityAnalysis[] = []
    let totalPassedChecks = 0
    let totalChecks = 0

    // 分析每个组件
    for (const component of components) {
      const analysis = await this.analyzeComponent(component)
      componentAnalyses.push(analysis)
      violations.push(...analysis.violations)
      totalPassedChecks += analysis.passedTests.length
      totalChecks += analysis.passedTests.length + analysis.missedTests.length
    }

    // 生成主题合规性报告
    const themeCompliance = await this.analyzeThemeCompliance(theme)

    // 计算总体分数
    const overallScore = this.calculateOverallScore(violations, totalPassedChecks, totalChecks)
    const complianceLevel = this.determineComplianceLevel(overallScore)

    return {
      timestamp: new Date(),
      overallScore,
      complianceLevel,
      violations,
      passedChecks: totalPassedChecks,
      totalChecks,
      componentAnalysis: componentAnalyses,
      themeCompliance
    }
  }

  /**
   * 分析单个组件的可访问性
   */
  private async analyzeComponent(
    component: ReactElement
  ): Promise<ComponentAccessibilityAnalysis> {
    const componentName = this.getComponentName(component)
    const violations: AccessibilityViolation[] = []

    // 键盘导航分析
    const keyboardNavigation = await this.analyzeKeyboardNavigation(component)

    // 颜色对比度分析
    const colorContrast = await this.analyzeColorContrast(component)

    // 屏幕阅读器分析
    const screenReader = await this.analyzeScreenReaderSupport(component)

    // 收集违规项
    violations.push(...keyboardNavigation.violations)
    violations.push(...colorContrast.violations)
    violations.push(...screenReader.violations)

    const passedTests = this.getPassedTests(component)
    const missedTests = this.getMissedTests(component)
    const score = this.calculateComponentScore(passedTests, missedTests)

    return {
      componentName,
      score,
      violations,
      passedTests,
      missedTests,
      keyboardNavigation,
      colorContrast,
      screenReader
    }
  }

  /**
   * 键盘导航分析
   */
  private async analyzeKeyboardNavigation(
    component: ReactElement
  ): Promise<{ violations: AccessibilityViolation[] } & KeyboardNavigationAnalysis> {
    const violations: AccessibilityViolation[] = []
    const focusableElements = this.extractFocusableElements(component)
    const focusOrder = this.extractFocusOrder(component)
    const trapElements = this.findFocusTraps(component)
    const skipLinks = this.findSkipLinks(component)
    const focusIndicators = this.analyzeFocusIndicators(component)

    let tabIndexCorrect = true

    // 检查焦点管理
    if (focusableElements.length === 0) {
      violations.push({
        id: '2.1.1-1',
        guideline: '2.1.1 Keyboard',
        severity: 'critical',
        element: this.getComponentName(component),
        issue: '组件中没有可聚焦的交互元素',
        suggestion: '确保所有交互元素都可以通过键盘访问',
        automated: true,
        needsManualReview: false
      })
    }

    // 检查焦点指示器
    const indicatorsWithoutVisibleFocus = focusIndicators.filter(
      indicator => !indicator.hasVisibleIndicator
    )

    if (indicatorsWithoutVisibleFocus.length > 0) {
      violations.push({
        id: '2.4.7-1',
        guideline: '2.4.7 Focus Visible',
        severity: 'serious',
        element: this.getComponentName(component),
        issue: '存在没有可见焦点指示器的交互元素',
        suggestion: '为所有可聚焦元素添加明显的焦点样式',
        automated: true,
        needsManualReview: false
      })
    }

    // 检查焦点陷阱
    if (trapElements.length > 0) {
      violations.push({
        id: '2.1.2-1',
        guideline: '2.1.2 No Keyboard Trap',
        severity: 'critical',
        element: this.getComponentName(component),
        issue: `检测到焦点陷阱: ${trapElements.join(', ')}`,
        suggestion: '确保用户可以通过Tab键进入和退出所有交互区域',
        automated: true,
        needsManualReview: true
      })
    }

    return {
      violations,
      focusableElements: focusableElements.length,
      tabIndexCorrect,
      focusOrder,
      trapElements,
      skipLinks,
      focusIndicators
    }
  }

  /**
   * 颜色对比度分析
   */
  private async analyzeColorContrast(
    component: ReactElement
  ): Promise<{ violations: AccessibilityViolation[] } & ColorContrastAnalysis> {
    const violations: AccessibilityViolation[] = []
    const textCombinations: ContrastCheck[] = []
    const iconCombinations: ContrastCheck[] = []
    const interactiveElements: ContrastCheck[] = []
    const stateCombinations: ContrastCheck[] = []

    const themeCoverage = await this.analyzeThemeCoverage()

    // 提取组件中的颜色组合
    const colorPairs = this.extractColorPairs(component)

    for (const pair of colorPairs) {
      const ratio = getContrastRatio(pair.foreground, pair.background)
      const check: ContrastCheck = {
        foreground: pair.foreground,
        background: pair.background,
        ratio,
        passesAA: ratio >= 4.5,
        passesAAA: ratio >= 7,
        context: pair.context,
        fontSize: pair.fontSize,
        weight: pair.weight
      }

      if (pair.type === 'text') {
        textCombinations.push(check)
        if (!check.passesAA) {
          violations.push({
            id: '1.4.3-1',
            guideline: '1.4.3 Contrast (Minimum)',
            severity: 'serious',
            element: pair.element,
            issue: `文本对比度不足 (${ratio.toFixed(2)}:1，需要至少4.5:1)`,
            suggestion: '增加文本和背景之间的对比度，或使用更大/更粗的字体',
            automated: true,
            needsManualReview: false
          })
        }
      } else if (pair.type === 'icon') {
        iconCombinations.push(check)
        if (!check.passesAA) {
          violations.push({
            id: '1.4.11-1',
            guideline: '1.4.11 Non-text Contrast',
            severity: 'serious',
            element: pair.element,
            issue: `图标对比度不足 (${ratio.toFixed(2)}:1，需要至少3:1)`,
            suggestion: '增加图标和背景之间的对比度',
            automated: true,
            needsManualReview: false
          })
        }
      } else if (pair.type === 'interactive') {
        interactiveElements.push(check)
        if (ratio < 3) {
          violations.push({
            id: '1.4.11-2',
            guideline: '1.4.11 Non-text Contrast',
            severity: 'serious',
            element: pair.element,
            issue: `交互元素边界对比度不足 (${ratio.toFixed(2)}:1，需要至少3:1)`,
            suggestion: '增加交互元素边界的对比度',
            automated: true,
            needsManualReview: false
          })
        }
      }
    }

    return {
      violations,
      textCombinations,
      iconCombinations,
      interactiveElements,
      stateCombinations,
      themeCoverage
    }
  }

  /**
   * 屏幕阅读器支持分析
   */
  private async analyzeScreenReaderSupport(
    component: ReactElement
  ): Promise<{ violations: AccessibilityViolation[] } & ScreenReaderAnalysis> {
    const violations: AccessibilityViolation[] = []
    const ariaLabels: ARIAAnalysis[] = []
    const roles: RoleAnalysis[] = []
    const announcements: AnnouncementAnalysis[] = []
    const landmarks = this.analyzeLandmarks(component)
    const forms = this.analyzeFormAccessibility(component)

    // 分析 ARIA 标签
    const elementsWithoutLabels = this.findElementsWithoutLabels(component)
    for (const element of elementsWithoutLabels) {
      violations.push({
        id: '4.1.2-1',
        guideline: '4.1.2 Name, Role, Value',
        severity: 'serious',
        element,
        issue: '交互元素缺少可访问的名称',
        suggestion: '添加 aria-label、aria-labelledby 或使用语义化HTML标签',
        automated: true,
        needsManualReview: false
      })
    }

    // 分析角色属性
    const invalidRoles = this.findInvalidRoles(component)
    for (const role of invalidRoles) {
      violations.push({
        id: '4.1.2-2',
        guideline: '4.1.2 Name, Role, Value',
        severity: 'moderate',
        element: role.element,
        issue: `使用了无效的ARIA角色: ${role.role}`,
        suggestion: `使用有效的ARIA角色: ${role.validAlternatives.join(', ')}`,
        automated: true,
        needsManualReview: false
      })
    }

    return {
      violations,
      ariaLabels,
      roles,
      announcements,
      landmarks,
      forms
    }
  }

  // ==================== 辅助方法 ====================

  private getComponentName(component: ReactElement): string {
    return component.type?.displayName ||
           component.type?.name ||
           'UnknownComponent'
  }

  private calculateOverallScore(
    violations: AccessibilityViolation[],
    passedChecks: number,
    totalChecks: number
  ): number {
    if (totalChecks === 0) return 0

    const weightedViolations = violations.reduce((score, violation) => {
      const weights = {
        critical: 10,
        serious: 5,
        moderate: 2,
        minor: 1
      }
      return score - weights[violation.severity]
    }, 100)

    return Math.max(0, Math.min(100, weightedViolations))
  }

  private determineComplianceLevel(score: number): 'A' | 'AA' | 'AAA' | 'non-compliant' {
    if (score >= 95) return 'AAA'
    if (score >= 85) return 'AA'
    if (score >= 70) return 'A'
    return 'non-compliant'
  }

  private extractFocusableElements(component: ReactElement): string[] {
    // 实现焦点元素提取逻辑
    return [] // 占位符实现
  }

  private extractFocusOrder(component: ReactElement): number[] {
    // 实现焦点顺序提取逻辑
    return [] // 占位符实现
  }

  private findFocusTraps(component: ReactElement): string[] {
    // 实现焦点陷阱检测逻辑
    return [] // 占位符实现
  }

  private findSkipLinks(component: ReactElement): string[] {
    // 实现跳转链接检测逻辑
    return [] // 占位符实现
  }

  private analyzeFocusIndicators(component: ReactElement): FocusIndicator[] {
    // 实现焦点指示器分析逻辑
    return [] // 占位符实现
  }

  private extractColorPairs(component: ReactElement): Array<{
    foreground: string
    background: string
    type: 'text' | 'icon' | 'interactive'
    context: string
    element: string
    fontSize: 'normal' | 'large'
    weight: 'normal' | 'bold'
  }> {
    // 实现颜色对提取逻辑
    return [] // 占位符实现
  }

  private async analyzeThemeCoverage(): Promise<ThemeCoverage> {
    // 实现主题覆盖分析逻辑
    return {
      lightTheme: { percentage: 100, passCount: 0, totalCount: 0, issues: [] },
      darkTheme: { percentage: 100, passCount: 0, totalCount: 0, issues: [] },
      highContrast: { percentage: 100, passCount: 0, totalCount: 0, issues: [] },
      customThemes: {}
    }
  }

  private findElementsWithoutLabels(component: ReactElement): string[] {
    // 实现无标签元素检测逻辑
    return [] // 占位符实现
  }

  private findInvalidRoles(component: ReactElement): Array<{
    element: string
    role: string
    validAlternatives: string[]
  }> {
    // 实现无效角色检测逻辑
    return [] // 占位符实现
  }

  private analyzeLandmarks(component: ReactElement): LandmarkAnalysis {
    // 实现地标分析逻辑
    return {
      landmarks: [],
      hierarchy: false,
      navigationElements: 0,
      mainContent: false,
      complementary: false
    }
  }

  private analyzeFormAccessibility(component: ReactElement): FormAccessibilityAnalysis {
    // 实现表单可访问性分析逻辑
    return {
      inputs: [],
      validation: {
        realTime: false,
        clearMessages: false,
        accessibleErrors: false,
        errorSummary: false
      },
      errorHandling: {
        inlineErrors: false,
        errorAnnouncement: false,
        correctionGuidance: false,
        errorPrevention: false
      },
      instructions: false
    }
  }

  private getPassedTests(component: ReactElement): string[] {
    // 实现通过的测试获取逻辑
    return [] // 占位符实现
  }

  private getMissedTests(component: ReactElement): string[] {
    // 实现未通过的测试获取逻辑
    return [] // 占位符实现
  }

  private calculateComponentScore(passed: string[], missed: string[]): number {
    const total = passed.length + missed.length
    return total > 0 ? (passed.length / total) * 100 : 0
  }

  private async analyzeThemeCompliance(theme: string): Promise<ThemeComplianceReport> {
    // 实现主题合规性分析逻辑
    return {
      currentTheme: theme,
      contrastRatios: {},
      failsContrast: [],
      passesWCAG: { A: false, AA: false, AAA: false },
      recommendations: []
    }
  }

  // ==================== 实用工具方法 ====================

  /**
   * 生成可访问性改进建议
   */
  generateRecommendations(report: AccessibilityReport): string[] {
    const recommendations: string[] = []

    // 基于违规项生成建议
    const criticalViolations = report.violations.filter(v => v.severity === 'critical')
    if (criticalViolations.length > 0) {
      recommendations.push('优先修复严重违规项，这些会影响基本可访问性')
    }

    const contrastIssues = report.violations.filter(v =>
      v.guideline.includes('1.4.3') || v.guideline.includes('1.4.11')
    )
    if (contrastIssues.length > 0) {
      recommendations.push('改进颜色对比度，确保文本和交互元素满足WCAG AA标准')
    }

    const keyboardIssues = report.violations.filter(v =>
      v.guideline.startsWith('2.1') || v.guideline.startsWith('2.4')
    )
    if (keyboardIssues.length > 0) {
      recommendations.push('完善键盘导航支持，确保所有功能都可以通过键盘访问')
    }

    return recommendations
  }

  /**
   * 导出为标准格式报告
   */
  exportReport(report: AccessibilityReport, format: 'json' | 'html' | 'pdf'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2)
      case 'html':
        return this.generateHTMLReport(report)
      case 'pdf':
        // 这里需要集成PDF生成库
        return 'PDF export not implemented yet'
      default:
        return JSON.stringify(report, null, 2)
    }
  }

  private generateHTMLReport(report: AccessibilityReport): string {
    // 生成HTML格式的可访问性报告
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <title>Xorigo UI 可访问性合规报告</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 2rem; }
          .score { font-size: 2rem; font-weight: bold; color: ${this.getScoreColor(report.overallScore)}; }
          .violation { margin: 1rem 0; padding: 1rem; border-left: 4px solid ${this.getSeverityColor('serious')}; }
          .critical { border-color: #dc2626; }
          .serious { border-color: #ea580c; }
          .moderate { border-color: #ca8a04; }
          .minor { border-color: #65a30d; }
        </style>
      </head>
      <body>
        <h1>Xorigo UI 可访问性合规报告</h1>
        <div class="score">总体评分: ${report.overallScore.toFixed(1)}/100</div>
        <p>合规等级: ${report.complianceLevel}</p>
        <p>生成时间: ${report.timestamp.toLocaleString('zh-CN')}</p>

        <h2>发现的问题 (${report.violations.length})</h2>
        ${report.violations.map(v => `
          <div class="violation ${v.severity}">
            <h3>${v.guideline} - ${v.severity}</h3>
            <p><strong>元素:</strong> ${v.element}</p>
            <p><strong>问题:</strong> ${v.issue}</p>
            <p><strong>建议:</strong> ${v.suggestion}</p>
          </div>
        `).join('')}
      </body>
      </html>
    `
  }

  private getScoreColor(score: number): string {
    if (score >= 90) return '#16a34a'
    if (score >= 70) return '#ca8a04'
    return '#dc2626'
  }

  private getSeverityColor(severity: string): string {
    const colors = {
      critical: '#dc2626',
      serious: '#ea580c',
      moderate: '#ca8a04',
      minor: '#65a30d'
    }
    return colors[severity as keyof typeof colors] || '#6b7280'
  }
}

// ==================== 导出 ====================

export const wcagValidator = new WCAGComplianceValidator()

// 便捷方法
export async function validateAccessibility(
  components: ReactElement[],
  theme?: string
): Promise<AccessibilityReport> {
  return wcagValidator.validateAccessibility(components, theme)
}

export function generateAccessibilityRecommendations(
  report: AccessibilityReport
): string[] {
  return wcagValidator.generateRecommendations(report)
}

export function exportAccessibilityReport(
  report: AccessibilityReport,
  format: 'json' | 'html' | 'pdf' = 'json'
): string {
  return wcagValidator.exportReport(report, format)
}