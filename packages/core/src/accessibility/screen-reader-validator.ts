/**
 * Xorigo UI 屏幕阅读器兼容性和ARIA属性完整性验证系统
 *
 * 全面验证组件的屏幕阅读器兼容性，包括ARIA属性、语义化标记、
 * 可访问名称和描述、状态通知等方面
 *
 * @version 1.0.0
 * @author Xorigo UI Team
 */

// ==================== 类型定义 ====================

export interface ScreenReaderTest {
  testName: string
  description: string
  category: 'aria' | 'semantic' | 'naming' | 'state' | 'navigation' | 'form' | 'media'
  expectedBehavior: string
  actualBehavior?: string
  passed: boolean
  issues: ScreenReaderIssue[]
  severity: 'critical' | 'serious' | 'moderate' | 'minor'
  automated: boolean
  needsManualTest: boolean
  testedWith: string[] // 支持的屏幕阅读器
}

export interface ScreenReaderIssue {
  id: string
  element: string
  attribute?: string
  value?: string
  expected?: string
  issue: string
  suggestion: string
  wcagReference: string
  impact: string
  automated: boolean
}

export interface ARIAAttributeAnalysis {
  validRoles: RoleValidation[]
  invalidRoles: InvalidRole[]
  missingAttributes: MissingARIA[]
  incorrectAttributes: IncorrectARIA[]
  redundantAttributes: RedundantARIA[]
  recommendedAttributes: RecommendedARIA[]
}

export interface RoleValidation {
  element: string
  role: string
  isValid: boolean
  requiredAttributes: string[]
  providedAttributes: string[]
  missingRequired: string[]
  optionalAttributes: string[]
  providedOptional: string[]
}

export interface InvalidRole {
  element: string
  invalidRole: string
  validAlternatives: string[]
  reason: string
  suggestion: string
}

export interface MissingARIA {
  element: string
  missingAttribute: string
  importance: 'required' | 'recommended' | 'optional'
  reason: string
  suggestion: string
}

export interface IncorrectARIA {
  element: string
  attribute: string
  incorrectValue: string
  correctValues: string[]
  reason: string
  suggestion: string
}

export interface RedundantARIA {
  element: string
  redundantAttribute: string
  nativeEquivalent: string
  reason: string
  suggestion: string
}

export interface RecommendedARIA {
  element: string
  recommendedAttribute: string
  recommendedValue?: string
  benefit: string
  priority: 'high' | 'medium' | 'low'
}

export interface SemanticMarkupAnalysis {
  headingStructure: HeadingStructure
  listStructure: ListStructure
  landmarkStructure: LandmarkStructure
  tableStructure: TableStructure
  formStructure: FormStructure
  linkAnalysis: LinkAnalysis
  imageAnalysis: ImageAnalysis
}

export interface HeadingStructure {
  headings: HeadingInfo[]
  hasH1: boolean
  properNesting: boolean
  skippedLevels: number[]
  consecutiveHeadings: string[]
  recommendations: string[]
}

export interface HeadingInfo {
  level: number
  text: string
  element: string
  isHidden: boolean
  hasAriaLabel: boolean
  properNesting: boolean
}

export interface ListStructure {
  lists: ListInfo[]
  properNesting: boolean
  hasProperMarkers: boolean
  listItemsWithoutMarkers: string[]
  recommendations: string[]
}

export interface ListInfo {
  type: 'ul' | 'ol' | 'dl'
  element: string
  itemCount: number
  hasProperStructure: boolean
  issues: string[]
}

export interface LandmarkStructure {
  landmarks: LandmarkInfo[]
  hasMain: boolean
  hasNavigation: boolean
  hasHeader: boolean
  hasFooter: boolean
  hierarchy: boolean
  overlappingRoles: string[]
  missingLandmarks: string[]
  recommendations: string[]
}

export interface LandmarkInfo {
  role: string
  element: string
  label?: string
  labelledBy?: string
  isUnique: boolean
  nestingLevel: number
}

export interface TableStructure {
  tables: TableInfo[]
  hasHeaders: boolean
  hasCaptions: boolean
  hasScope: boolean
  complexTables: string[]
  simpleTables: string[]
  recommendations: string[]
}

export interface TableInfo {
  element: string
  hasCaption: boolean
  hasHeaders: boolean
  hasScope: boolean
  headerCount: number
  dataCellCount: number
  complexity: 'simple' | 'complex'
  issues: string[]
}

export interface FormStructure {
  forms: FormInfo[]
  hasLabels: boolean
  hasFieldsets: boolean
  hasLegends: boolean
  hasRequiredIndicators: boolean
  hasErrorMessaging: boolean
  recommendations: string[]
}

export interface FormInfo {
  element: string
  fieldCount: number
  hasProperLabels: boolean
  hasFieldsets: boolean
  hasValidation: boolean
  hasErrorMessages: boolean
  issues: string[]
}

export interface LinkAnalysis {
  links: LinkInfo[]
  hasUniqueText: boolean
  hasDescriptiveText: boolean
  hasExternalIndicators: boolean
  ambiguousLinks: string[]
  recommendations: string[]
}

export interface LinkInfo {
  element: string
  text: string
  href: string
  isExternal: boolean
  hasAriaLabel: boolean
  hasTitle: boolean
  isDescriptive: boolean
  isUnique: boolean
}

export interface ImageAnalysis {
  images: ImageInfo[]
  hasAltText: boolean
  hasDecorativeImages: boolean
  hasComplexImages: boolean
  missingAlt: string[]
  redundantAlt: string[]
  recommendations: string[]
}

export interface ImageInfo {
  element: string
  src: string
  hasAlt: boolean
  altText: string
  isDecorative: boolean
  isComplex: boolean
  needsLongDesc: boolean
  hasLongDesc: boolean
}

export interface AccessibleNameAnalysis {
  elements: AccessibleNameInfo[]
  missingNames: string[]
  ambiguousNames: string[]
  redundantNames: string[]
  recommendations: string[]
}

export interface AccessibleNameInfo {
  element: string
  accessibleName: string
  nameSource: 'content' | 'aria-label' | 'aria-labelledby' | 'title' | 'placeholder'
  isDescriptive: boolean
  isUnique: boolean
  isAppropriate: boolean
}

export interface StateNotificationAnalysis {
  dynamicRegions: DynamicRegion[]
  statusMessages: StatusMessage[]
  errorNotifications: ErrorNotification[]
  successNotifications: SuccessNotification[]
  loadingStates: LoadingState[]
  recommendations: string[]
}

export interface DynamicRegion {
  element: string
  ariaLive: 'polite' | 'assertive' | 'off'
  ariaAtomic: boolean
  ariaBusy: boolean
  ariaRelevant?: string
  content: string
  worksCorrectly: boolean
  issues: string[]
}

export interface StatusMessage {
  element: string
  role: string
  message: string
  isPolite: boolean
  isTimely: boolean
  isClear: boolean
  issues: string[]
}

export interface ErrorNotification {
  element: string
  type: 'inline' | 'summary' | 'dialog'
  message: string
  associatedField: string
  isAnnounced: boolean
  isClear: boolean
  isCorrective: boolean
  issues: string[]
}

export interface SuccessNotification {
  element: string
  message: string
  context: string
  isPolite: boolean
  isTimely: boolean
  isRelevant: boolean
  issues: string[]
}

export interface LoadingState {
  element: string
  ariaLive: string
  ariaBusy: boolean
  hasIndication: boolean
  hasTimeout: boolean
  issues: string[]
}

export interface ScreenReaderCompatibilityReport {
  timestamp: Date
  overallScore: number
  totalTests: number
  passedTests: number
  failedTests: number
  criticalIssues: number
  screenReaderTests: ScreenReaderTest[]
  ariaAttributeAnalysis: ARIAAttributeAnalysis
  semanticMarkupAnalysis: SemanticMarkupAnalysis
  accessibleNameAnalysis: AccessibleNameAnalysis
  stateNotificationAnalysis: StateNotificationAnalysis
  recommendations: string[]
  needsManualTesting: boolean
  manualTestInstructions: string[]
  supportedScreenReaders: string[]
}

// ==================== ARIA角色和属性定义 ====================

const VALID_ARIA_ROLES = [
  // Landmark roles
  'banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'region', 'search',

  // Widget roles
  'button', 'checkbox', 'gridcell', 'link', 'listbox', 'option', 'progressbar',
  'radio', 'scrollbar', 'searchbox', 'separator', 'slider', 'spinbutton', 'switch',
  'tab', 'tabpanel', 'textbox', 'treeitem', 'grid', 'list', 'row', 'rowgroup',
  'tree', 'treegrid', 'columnheader', 'rowheader', 'combobox', 'group', 'menu',
  'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'navigation', 'note',
  'tooltip', 'dialog', 'alert', 'alertdialog', 'application', 'article', 'document',
  'feed', 'figure', 'img', 'math', 'none', 'presentation', 'table', 'term', 'time'
]

const ROLE_ATTRIBUTE_REQUIREMENTS: Record<string, {
  required: string[]
  recommended: string[]
  prohibited: string[]
}> = {
  'button': {
    required: [],
    recommended: ['aria-expanded', 'aria-pressed'],
    prohibited: []
  },
  'link': {
    required: [],
    recommended: [],
    prohibited: ['aria-disabled']
  },
  'textbox': {
    required: [],
    recommended: ['aria-label', 'aria-placeholder', 'aria-required'],
    prohibited: []
  },
  'checkbox': {
    required: [],
    recommended: ['aria-checked', 'aria-required'],
    prohibited: []
  },
  'radio': {
    required: [],
    recommended: ['aria-checked', 'aria-required'],
    prohibited: []
  },
  'combobox': {
    required: ['aria-expanded'],
    recommended: ['aria-label', 'aria-required', 'aria-autocomplete'],
    prohibited: []
  },
  'listbox': {
    required: [],
    recommended: ['aria-label', 'aria-multiselectable'],
    prohibited: []
  },
  'menu': {
    required: [],
    recommended: ['aria-label'],
    prohibited: []
  },
  'dialog': {
    required: [],
    recommended: ['aria-label', 'aria-describedby'],
    prohibited: []
  },
  'alert': {
    required: [],
    recommended: ['aria-live'],
    prohibited: []
  },
  'table': {
    required: [],
    recommended: ['aria-label', 'aria-rowcount', 'aria-colcount'],
    prohibited: []
  },
  'grid': {
    required: [],
    recommended: ['aria-rowcount', 'aria-colcount'],
    prohibited: []
  }
}

// ==================== 核心验证类 ====================

export class ScreenReaderValidator {
  private readonly supportedScreenReaders = [
    'NVDA', 'JAWS', 'VoiceOver', 'TalkBack', 'Narrator', 'ChromeVox'
  ]

  /**
   * 执行完整的屏幕阅读器兼容性验证
   */
  async validateScreenReaderCompatibility(
    container: HTMLElement | Document = document
  ): Promise<ScreenReaderCompatibilityReport> {
    const timestamp = new Date()

    // 1. ARIA属性分析
    const ariaAttributeAnalysis = this.analyzeARIAAttributes(container)

    // 2. 语义化标记分析
    const semanticMarkupAnalysis = this.analyzeSemanticMarkup(container)

    // 3. 可访问名称分析
    const accessibleNameAnalysis = this.analyzeAccessibleNames(container)

    // 4. 状态通知分析
    const stateNotificationAnalysis = this.analyzeStateNotifications(container)

    // 5. 执行屏幕阅读器测试
    const screenReaderTests = await this.performScreenReaderTests(container)

    // 6. 计算总体分数
    const { overallScore, passedTests, failedTests, criticalIssues } =
      this.calculateOverallScore(screenReaderTests, ariaAttributeAnalysis, semanticMarkupAnalysis)

    // 7. 生成建议
    const recommendations = this.generateRecommendations(
      ariaAttributeAnalysis,
      semanticMarkupAnalysis,
      accessibleNameAnalysis,
      stateNotificationAnalysis,
      screenReaderTests
    )

    // 8. 确定手动测试需求
    const { needsManualTesting, manualTestInstructions } =
      this.determineManualTestingRequirements(screenReaderTests)

    return {
      timestamp,
      overallScore,
      totalTests: screenReaderTests.length,
      passedTests,
      failedTests,
      criticalIssues,
      screenReaderTests,
      ariaAttributeAnalysis,
      semanticMarkupAnalysis,
      accessibleNameAnalysis,
      stateNotificationAnalysis,
      recommendations,
      needsManualTesting,
      manualTestInstructions,
      supportedScreenReaders: this.supportedScreenReaders
    }
  }

  /**
   * 分析ARIA属性
   */
  private analyzeARIAAttributes(container: HTMLElement | Document): ARIAAttributeAnalysis {
    const elements = container.querySelectorAll('*')
    const validRoles: RoleValidation[] = []
    const invalidRoles: InvalidRole[] = []
    const missingAttributes: MissingARIA[] = []
    const incorrectAttributes: IncorrectARIA[] = []
    const redundantAttributes: RedundantARIA[] = []
    const recommendedAttributes: RecommendedARIA[] = []

    elements.forEach(element => {
      const role = element.getAttribute('role')
      const tagName = element.tagName.toLowerCase()

      // 验证角色
      if (role) {
        if (VALID_ARIA_ROLES.includes(role)) {
          validRoles.push(this.validateRole(element, role))
        } else {
          invalidRoles.push(this.identifyInvalidRole(element, role))
        }
      }

      // 检查缺失的必需属性
      if (role && ROLE_ATTRIBUTE_REQUIREMENTS[role]) {
        const requirements = ROLE_ATTRIBUTE_REQUIREMENTS[role]
        requirements.required.forEach(attr => {
          if (!element.hasAttribute(attr)) {
            missingAttributes.push({
              element: this.getElementSelector(element),
              missingAttribute: attr,
              importance: 'required',
              reason: `${role} 角色需要 ${attr} 属性`,
              suggestion: `添加 ${attr} 属性到元素`
            })
          }
        })

        // 推荐可选属性
        requirements.recommended.forEach(attr => {
          if (!element.hasAttribute(attr)) {
            recommendedAttributes.push({
              element: this.getElementSelector(element),
              recommendedAttribute: attr,
              benefit: this.getAttributeBenefit(role, attr),
              priority: 'medium'
            })
          }
        })
      }

      // 检查不正确的属性值
      this.checkIncorrectAttributeValues(element, incorrectAttributes)

      // 检查冗余属性
      this.checkRedundantAttributes(element, redundantAttributes)
    })

    return {
      validRoles,
      invalidRoles,
      missingAttributes,
      incorrectAttributes,
      redundantAttributes,
      recommendedAttributes
    }
  }

  /**
   * 分析语义化标记
   */
  private analyzeSemanticMarkup(container: HTMLElement | Document): SemanticMarkupAnalysis {
    return {
      headingStructure: this.analyzeHeadingStructure(container),
      listStructure: this.analyzeListStructure(container),
      landmarkStructure: this.analyzeLandmarkStructure(container),
      tableStructure: this.analyzeTableStructure(container),
      formStructure: this.analyzeFormStructure(container),
      linkAnalysis: this.analyzeLinks(container),
      imageAnalysis: this.analyzeImages(container)
    }
  }

  /**
   * 分析可访问名称
   */
  private analyzeAccessibleNames(container: HTMLElement | Document): AccessibleNameAnalysis {
    const elements: AccessibleNameInfo[] = []
    const missingNames: string[] = []
    const ambiguousNames: string[] = []
    const redundantNames: string[] = []

    const interactiveElements = container.querySelectorAll(
      'a[href], button, input, select, textarea, [role="button"], [role="link"], [role="menuitem"]'
    )

    interactiveElements.forEach(element => {
      const nameInfo = this.getAccessibleNameInfo(element)
      elements.push(nameInfo)

      if (!nameInfo.accessibleName) {
        missingNames.push(nameInfo.element)
      } else if (!nameInfo.isDescriptive) {
        ambiguousNames.push(nameInfo.element)
      }

      // 检查冗余名称
      const redundant = this.checkRedundantName(element, nameInfo.accessibleName)
      if (redundant) {
        redundantNames.push(nameInfo.element)
      }
    })

    const recommendations = this.generateNameRecommendations(missingNames, ambiguousNames, redundantNames)

    return {
      elements,
      missingNames,
      ambiguousNames,
      redundantNames,
      recommendations
    }
  }

  /**
   * 分析状态通知
   */
  private analyzeStateNotifications(container: HTMLElement | Document): StateNotificationAnalysis {
    const dynamicRegions: DynamicRegion[] = []
    const statusMessages: StatusMessage[] = []
    const errorNotifications: ErrorNotification[] = []
    const successNotifications: SuccessNotification[] = []
    const loadingStates: LoadingState[] = []

    // 查找动态区域
    const liveRegions = container.querySelectorAll('[aria-live], [role="status"], [role="alert"]')
    liveRegions.forEach(element => {
      dynamicRegions.push(this.analyzeDynamicRegion(element))
    })

    // 查找错误消息
    const errorElements = container.querySelectorAll('.error, [role="alert"], [aria-invalid="true"]')
    errorElements.forEach(element => {
      errorNotifications.push(this.analyzeErrorNotification(element))
    })

    // 查找成功消息
    const successElements = container.querySelectorAll('.success, .message[role="status"]')
    successElements.forEach(element => {
      successNotifications.push(this.analyzeSuccessNotification(element))
    })

    // 查找加载状态
    const loadingElements = container.querySelectorAll('[aria-busy="true"], .loading')
    loadingElements.forEach(element => {
      loadingStates.push(this.analyzeLoadingState(element))
    })

    const recommendations = this.generateStateNotificationRecommendations(
      dynamicRegions,
      errorNotifications,
      successNotifications,
      loadingStates
    )

    return {
      dynamicRegions,
      statusMessages,
      errorNotifications,
      successNotifications,
      loadingStates,
      recommendations
    }
  }

  /**
   * 执行屏幕阅读器测试
   */
  private async performScreenReaderTests(
    container: HTMLElement | Document
  ): Promise<ScreenReaderTest[]> {
    const tests: ScreenReaderTest[] = []

    // ARIA属性测试
    tests.push(this.testARIAAttributes(container))

    // 语义化标记测试
    tests.push(this.testSemanticMarkup(container))

    // 可访问名称测试
    tests.push(this.testAccessibleNames(container))

    // 焦点管理测试
    tests.push(this.testFocusManagement(container))

    // 状态通知测试
    tests.push(this.testStateNotifications(container))

    // 表单可访问性测试
    tests.push(this.testFormAccessibility(container))

    // 媒体可访问性测试
    tests.push(this.testMediaAccessibility(container))

    return tests
  }

  // ==================== 具体分析方法 ====================

  private validateRole(element: Element, role: string): RoleValidation {
    const requirements = ROLE_ATTRIBUTE_REQUIREMENTS[role] || { required: [], recommended: [] }
    const providedAttributes: string[] = []

    // 收集已提供的ARIA属性
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('aria-')) {
        providedAttributes.push(attr.name)
      }
    })

    const missingRequired = requirements.required.filter(attr => !providedAttributes.includes(attr))
    const providedOptional = providedAttributes.filter(attr => requirements.recommended.includes(attr))

    return {
      element: this.getElementSelector(element),
      role,
      isValid: true,
      requiredAttributes: requirements.required,
      providedAttributes,
      missingRequired,
      optionalAttributes: requirements.recommended,
      providedOptional
    }
  }

  private identifyInvalidRole(element: Element, invalidRole: string): InvalidRole {
    // 查找有效的替代角色
    const tagName = element.tagName.toLowerCase()
    const alternatives = this.findValidRoleAlternatives(tagName, invalidRole)

    return {
      element: this.getElementSelector(element),
      invalidRole,
      validAlternatives: alternatives,
      reason: `${invalidRole} 不是有效的ARIA角色`,
      suggestion: alternatives.length > 0 ? `使用有效的角色: ${alternatives.join(', ')}` : '移除无效的role属性'
    }
  }

  private findValidRoleAlternatives(tagName: string, invalidRole: string): string[] {
    const alternatives: string[] = []

    // 基于标签名推荐角色
    const tagToRole: Record<string, string[]> = {
      'button': ['button'],
      'a': ['link'],
      'input': ['textbox', 'checkbox', 'radio', 'searchbox'],
      'nav': ['navigation'],
      'main': ['main'],
      'header': ['banner'],
      'footer': ['contentinfo'],
      'aside': ['complementary'],
      'section': ['region'],
      'article': ['article'],
      'ul': ['list'],
      'ol': ['list'],
      'li': ['listitem'],
      'table': ['table'],
      'tr': ['row'],
      'td': ['gridcell'],
      'th': ['columnheader', 'rowheader']
    }

    if (tagToRole[tagName]) {
      alternatives.push(...tagToRole[tagName])
    }

    return alternatives.filter(role => VALID_ARIA_ROLES.includes(role))
  }

  private checkIncorrectAttributeValues(element: Element, incorrectAttributes: IncorrectARIA[]) {
    const ariaAttributes = Array.from(element.attributes).filter(attr => attr.name.startsWith('aria-'))

    ariaAttributes.forEach(attr => {
      const attributeName = attr.name
      const value = attr.value

      // 检查布尔值属性
      const booleanAttributes = ['aria-hidden', 'aria-disabled', 'aria-readonly', 'aria-required', 'aria-expanded', 'aria-selected', 'aria-checked', 'aria-pressed', 'aria-grabbed', 'aria-busy', 'aria-atomic']

      if (booleanAttributes.includes(attributeName) && !['true', 'false'].includes(value.toLowerCase())) {
        incorrectAttributes.push({
          element: this.getElementSelector(element),
          attribute: attributeName,
          incorrectValue: value,
          correctValues: ['true', 'false'],
          reason: `${attributeName} 必须是 'true' 或 'false'`,
          suggestion: `设置 ${attributeName}="true" 或 ${attributeName}="false"`
        })
      }

      // 检查aria-live属性
      if (attributeName === 'aria-live' && !['polite', 'assertive', 'off'].includes(value.toLowerCase())) {
        incorrectAttributes.push({
          element: this.getElementSelector(element),
          attribute: attributeName,
          incorrectValue: value,
          correctValues: ['polite', 'assertive', 'off'],
          reason: 'aria-live 只能是 polite, assertive 或 off',
          suggestion: `设置 aria-live="polite" 或 aria-live="assertive"`
        })
      }
    })
  }

  private checkRedundantAttributes(element: Element, redundantAttributes: RedundantARIA[]) {
    const tagName = element.tagName.toLowerCase()

    // 检查与HTML语义重复的ARIA属性
    const redundantPairs: Record<string, { aria: string; native: string }> = {
      'button': { aria: 'role="button"', native: '<button>' },
      'a': { aria: 'role="link"', native: '<a href="...">' },
      'img': { aria: 'role="img"', native: '<img>' },
      'input[type="checkbox"]': { aria: 'role="checkbox"', native: '<input type="checkbox">' },
      'input[type="radio"]': { aria: 'role="radio"', native: '<input type="radio">' }
    }

    if (redundantPairs[tagName]) {
      const pair = redundantPairs[tagName]
      if (element.getAttribute('role') === pair.aria.split('=')[1].replace(/"/g, '')) {
        redundantAttributes.push({
          element: this.getElementSelector(element),
          redundantAttribute: pair.aria,
          nativeEquivalent: pair.native,
          reason: 'HTML元素本身已经有相应的语义',
          suggestion: '移除冗余的role属性'
        })
      }
    }
  }

  private getAttributeBenefit(role: string, attribute: string): string {
    const benefits: Record<string, Record<string, string>> = {
      'button': {
        'aria-expanded': '指示按钮是否展开相关内容',
        'aria-pressed': '指示按钮是否被按下'
      },
      'textbox': {
        'aria-label': '为输入框提供描述性标签',
        'aria-required': '指示字段是否必填'
      },
      'checkbox': {
        'aria-checked': '明确指示复选框状态'
      }
    }

    return benefits[role]?.[attribute] || '提升屏幕阅读器用户体验'
  }

  private analyzeHeadingStructure(container: HTMLElement | Document): HeadingStructure {
    const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .map(element => {
        const level = parseInt(element.tagName.charAt(1))
        return {
          level,
          text: element.textContent?.trim() || '',
          element: this.getElementSelector(element),
          isHidden: window.getComputedStyle(element).display === 'none',
          hasAriaLabel: element.hasAttribute('aria-label'),
          properNesting: true // 稍后计算
        }
      })

    const hasH1 = headings.some(h => h.level === 1)
    let properNesting = true
    const skippedLevels: number[] = []

    // 检查标题嵌套
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i]
      const previous = headings[i - 1]

      if (current.level > previous.level + 1) {
        properNesting = false
        for (let level = previous.level + 1; level < current.level; level++) {
          if (!skippedLevels.includes(level)) {
            skippedLevels.push(level)
          }
        }
        current.properNesting = false
      }
    }

    const consecutiveHeadings = headings.map(h => `h${h.level}`)
    const recommendations = this.generateHeadingRecommendations(hasH1, properNesting, skippedLevels)

    return {
      headings,
      hasH1,
      properNesting,
      skippedLevels,
      consecutiveHeadings,
      recommendations
    }
  }

  private analyzeListStructure(container: HTMLElement | Document): ListStructure {
    const lists = Array.from(container.querySelectorAll('ul, ol, dl')).map(element => {
      const type = element.tagName.toLowerCase() as 'ul' | 'ol' | 'dl'
      const items = element.querySelectorAll('li, dt, dd')
      const hasProperStructure = items.length > 0

      const issues: string[] = []
      if (items.length === 0) {
        issues.push('列表没有列表项')
      }

      return {
        type,
        element: this.getElementSelector(element),
        itemCount: items.length,
        hasProperStructure,
        issues
      }
    })

    const properNesting = lists.every(list => list.hasProperStructure)
    const hasProperMarkers = true // 简化检查
    const listItemsWithoutMarkers: string[] = [] // 需要更详细的检查
    const recommendations = this.generateListRecommendations(lists, properNesting)

    return {
      lists,
      properNesting,
      hasProperMarkers,
      listItemsWithoutMarkers,
      recommendations
    }
  }

  private analyzeLandmarkStructure(container: HTMLElement | Document): LandmarkStructure {
    const landmarks = Array.from(container.querySelectorAll('[role], main, header, footer, nav, aside, section')).map(element => {
      let role = element.getAttribute('role') || ''

      // 将HTML5元素转换为对应的landmark角色
      if (!role) {
        const tagName = element.tagName.toLowerCase()
        const htmlToRole: Record<string, string> = {
          'main': 'main',
          'header': 'banner',
          'footer': 'contentinfo',
          'nav': 'navigation',
          'aside': 'complementary',
          'section': 'region'
        }
        role = htmlToRole[tagName] || ''
      }

      const landmarkRoles = ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'region', 'search']
      const isLandmark = landmarkRoles.includes(role)

      return {
        role: isLandmark ? role : '',
        element: this.getElementSelector(element),
        label: element.getAttribute('aria-label') || undefined,
        labelledBy: element.getAttribute('aria-labelledby') || undefined,
        isUnique: false, // 稍后计算
        nestingLevel: this.getElementNestingLevel(element)
      }
    }).filter(l => l.role)

    // 检查唯一性
    const roleCounts: Record<string, number> = {}
    landmarks.forEach(landmark => {
      roleCounts[landmark.role] = (roleCounts[landmark.role] || 0) + 1
    })

    landmarks.forEach(landmark => {
      landmark.isUnique = roleCounts[landmark.role] === 1
    })

    const hasMain = landmarks.some(l => l.role === 'main')
    const hasNavigation = landmarks.some(l => l.role === 'navigation')
    const hasHeader = landmarks.some(l => l.role === 'banner')
    const hasFooter = landmarks.some(l => l.role === 'contentinfo')
    const hierarchy = true // 简化检查
    const overlappingRoles: string[] = []
    const missingLandmarks: string[] = []

    if (!hasMain) missingLandmarks.push('main')
    if (!hasNavigation) missingLandmarks.push('navigation')

    const recommendations = this.generateLandmarkRecommendations(missingLandmarks, overlappingRoles)

    return {
      landmarks,
      hasMain,
      hasNavigation,
      hasHeader,
      hasFooter,
      hierarchy,
      overlappingRoles,
      missingLandmarks,
      recommendations
    }
  }

  private analyzeTableStructure(container: HTMLElement | Document): TableStructure {
    const tables = Array.from(container.querySelectorAll('table')).map(element => {
      const hasCaption = element.querySelector('caption') !== null
      const headers = element.querySelectorAll('th')
      const hasHeaders = headers.length > 0
      const hasScope = Array.from(headers).some(th => th.hasAttribute('scope'))
      const dataCells = element.querySelectorAll('td')

      const complexity = headers.length > 0 && dataCells.length > 0 ?
        (this.isComplexTable(element) ? 'complex' : 'simple') : 'simple'

      const issues: string[] = []
      if (!hasCaption) {
        issues.push('表格缺少标题说明')
      }
      if (!hasHeaders) {
        issues.push('表格缺少表头')
      }
      if (!hasScope) {
        issues.push('表头缺少scope属性')
      }

      return {
        element: this.getElementSelector(element),
        hasCaption,
        hasHeaders,
        hasScope,
        headerCount: headers.length,
        dataCellCount: dataCells.length,
        complexity,
        issues
      }
    })

    const hasHeaders = tables.some(t => t.hasHeaders)
    const hasCaptions = tables.some(t => t.hasCaption)
    const hasScope = tables.some(t => t.hasScope)
    const complexTables = tables.filter(t => t.complexity === 'complex').map(t => t.element)
    const simpleTables = tables.filter(t => t.complexity === 'simple').map(t => t.element)
    const recommendations = this.generateTableRecommendations(tables)

    return {
      tables,
      hasHeaders,
      hasCaptions,
      hasScope,
      complexTables,
      simpleTables,
      recommendations
    }
  }

  private analyzeFormStructure(container: HTMLElement | Document): FormStructure {
    const forms = Array.from(container.querySelectorAll('form')).map(element => {
      const fields = element.querySelectorAll('input, select, textarea, button')
      const hasLabels = Array.from(fields).some(field =>
        element.querySelector(`label[for="${field.id}"]`) ||
        field.closest('label') ||
        field.hasAttribute('aria-label')
      )
      const hasFieldsets = element.querySelectorAll('fieldset').length > 0
      const hasLegends = element.querySelectorAll('fieldset legend').length > 0
      const hasRequiredIndicators = element.querySelectorAll('[required], [aria-required="true"]').length > 0
      const hasErrorMessaging = element.querySelectorAll('.error, [role="alert"], [aria-invalid="true"]').length > 0
      const hasValidation = element.hasAttribute('novalidate') || hasErrorMessaging

      const issues: string[] = []
      if (!hasLabels) {
        issues.push('表单字段缺少标签')
      }
      if (fields.length > 1 && !hasFieldsets) {
        issues.push('复杂表单建议使用fieldset分组')
      }
      if (!hasErrorMessaging) {
        issues.push('表单缺少错误提示机制')
      }

      return {
        element: this.getElementSelector(element),
        fieldCount: fields.length,
        hasProperLabels: hasLabels,
        hasFieldsets,
        hasValidation,
        hasErrorMessages: hasErrorMessaging,
        issues
      }
    })

    const hasLabels = forms.some(f => f.hasProperLabels)
    const hasFieldsets = forms.some(f => f.hasFieldsets)
    const hasLegends = forms.some(f => f.hasLegends)
    const hasRequiredIndicators = forms.some(f => f.element.includes('required'))
    const hasErrorMessaging = forms.some(f => f.hasErrorMessages)
    const recommendations = this.generateFormRecommendations(forms)

    return {
      forms,
      hasLabels,
      hasFieldsets,
      hasLegends,
      hasRequiredIndicators,
      hasErrorMessaging,
      recommendations
    }
  }

  private analyzeLinks(container: HTMLElement | Document): LinkAnalysis {
    const links = Array.from(container.querySelectorAll('a[href]')).map(element => {
      const text = element.textContent?.trim() || ''
      const href = element.getAttribute('href') || ''
      const isExternal = href.includes('://') && !href.includes(window.location.hostname)
      const hasAriaLabel = element.hasAttribute('aria-label')
      const hasTitle = element.hasAttribute('title')
      const isDescriptive = text.length > 2 && !['点击这里', 'click here', '了解更多', 'read more'].includes(text.toLowerCase())
      const isUnique = true // 需要检查重复

      return {
        element: this.getElementSelector(element),
        text,
        href,
        isExternal,
        hasAriaLabel,
        hasTitle,
        isDescriptive,
        isUnique
      }
    })

    const hasUniqueText = links.every(l => l.isUnique)
    const hasDescriptiveText = links.every(l => l.isDescriptive)
    const hasExternalIndicators = links.filter(l => l.isExternal).every(l => l.hasAriaLabel || l.text.includes('external'))
    const ambiguousLinks = links.filter(l => !l.isDescriptive).map(l => l.element)
    const recommendations = this.generateLinkRecommendations(links)

    return {
      links,
      hasUniqueText,
      hasDescriptiveText,
      hasExternalIndicators,
      ambiguousLinks,
      recommendations
    }
  }

  private analyzeImages(container: HTMLElement | Document): ImageAnalysis {
    const images = Array.from(container.querySelectorAll('img')).map(element => {
      const hasAlt = element.hasAttribute('alt')
      const altText = element.getAttribute('alt') || ''
      const src = element.getAttribute('src') || ''
      const isDecorative = altText === ''
      const isComplex = this.isComplexImage(element)
      const needsLongDesc = isComplex && altText.length < 50
      const hasLongDesc = element.hasAttribute('longdesc') || element.parentElement?.querySelector('[aria-describedby]') !== null

      return {
        element: this.getElementSelector(element),
        src,
        hasAlt,
        altText,
        isDecorative,
        isComplex,
        needsLongDesc,
        hasLongDesc
      }
    })

    const hasAltText = images.every(img => img.hasAlt)
    const hasDecorativeImages = images.some(img => img.isDecorative)
    const hasComplexImages = images.some(img => img.isComplex)
    const missingAlt = images.filter(img => !img.hasAlt).map(img => img.element)
    const redundantAlt = images.filter(img => img.altText.includes('image of') || img.altText.includes('picture of')).map(img => img.element)
    const recommendations = this.generateImageRecommendations(images)

    return {
      images,
      hasAltText,
      hasDecorativeImages,
      hasComplexImages,
      missingAlt,
      redundantAlt,
      recommendations
    }
  }

  private getAccessibleNameInfo(element: Element): AccessibleNameInfo {
    let accessibleName = ''
    let nameSource: AccessibleNameInfo['nameSource'] = 'content'

    // 优先级顺序：aria-label -> aria-labelledby -> content -> title -> placeholder
    if (element.hasAttribute('aria-label')) {
      accessibleName = element.getAttribute('aria-label') || ''
      nameSource = 'aria-label'
    } else if (element.hasAttribute('aria-labelledby')) {
      const labelledById = element.getAttribute('aria-labelledby')
      const labelElement = document.getElementById(labelledById || '')
      accessibleName = labelElement?.textContent?.trim() || ''
      nameSource = 'aria-labelledby'
    } else if (element.textContent?.trim()) {
      accessibleName = element.textContent.trim()
      nameSource = 'content'
    } else if (element.hasAttribute('title')) {
      accessibleName = element.getAttribute('title') || ''
      nameSource = 'title'
    } else if (element.hasAttribute('placeholder')) {
      accessibleName = element.getAttribute('placeholder') || ''
      nameSource = 'placeholder'
    }

    const isDescriptive = accessibleName.length > 0 && !['click', 'submit', 'go', 'more'].includes(accessibleName.toLowerCase())
    const isUnique = true // 需要检查重复
    const isAppropriate = this.isNameAppropriateForElement(element, accessibleName)

    return {
      element: this.getElementSelector(element),
      accessibleName,
      nameSource,
      isDescriptive,
      isUnique,
      isAppropriate
    }
  }

  private analyzeDynamicRegion(element: Element): DynamicRegion {
    const ariaLive = element.getAttribute('aria-live') as DynamicRegion['ariaLive'] || 'off'
    const ariaAtomic = element.getAttribute('aria-atomic') === 'true'
    const ariaBusy = element.getAttribute('aria-busy') === 'true'
    const ariaRelevant = element.getAttribute('aria-relevant') || undefined
    const content = element.textContent?.trim() || ''

    const worksCorrectly = ariaLive !== 'off'
    const issues: string[] = []

    if (ariaLive === 'off' && (element.hasAttribute('role') || element.classList.contains('dynamic'))) {
      issues.push('动态内容区域应该设置aria-live属性')
    }

    return {
      element: this.getElementSelector(element),
      ariaLive,
      ariaAtomic,
      ariaBusy,
      ariaRelevant,
      content,
      worksCorrectly,
      issues
    }
  }

  private analyzeErrorNotification(element: Element): ErrorNotification {
    const type = this.getErrorNotificationType(element)
    const message = element.textContent?.trim() || ''
    const associatedField = this.findAssociatedFormField(element)
    const isAnnounced = element.hasAttribute('role') || element.hasAttribute('aria-live')
    const isClear = message.length > 10
    const isCorrective = message.includes('请') || message.includes('请检查') || message.includes('需要')

    const issues: string[] = []

    if (!isAnnounced) {
      issues.push('错误消息应该通过屏幕阅读器通知用户')
    }
    if (!isClear) {
      issues.push('错误消息不够清晰')
    }
    if (!isCorrective) {
      issues.push('错误消息应该包含修正建议')
    }

    return {
      element: this.getElementSelector(element),
      type,
      message,
      associatedField,
      isAnnounced,
      isClear,
      isCorrective,
      issues
    }
  }

  private analyzeSuccessNotification(element: Element): SuccessNotification {
    const message = element.textContent?.trim() || ''
    const context = this.getNotificationContext(element)
    const isPolite = element.getAttribute('aria-live') === 'polite' || element.getAttribute('role') === 'status'
    const isTimely = true // 简化检查
    const isRelevant = message.length > 5

    const issues: string[] = []

    if (!isPolite) {
      issues.push('成功消息应该使用polite通知')
    }
    if (!isRelevant) {
      issues.push('成功消息内容不够明确')
    }

    return {
      element: this.getElementSelector(element),
      message,
      context,
      isPolite,
      isTimely,
      isRelevant,
      issues
    }
  }

  private analyzeLoadingState(element: Element): LoadingState {
    const ariaLive = element.getAttribute('aria-live') || 'polite'
    const ariaBusy = element.getAttribute('aria-busy') === 'true'
    const hasIndication = element.textContent?.trim().length > 0 || element.querySelector('.spinner, .loader') !== null
    const hasTimeout = element.hasAttribute('data-timeout')

    const issues: string[] = []

    if (!ariaBusy) {
      issues.push('加载状态应该设置aria-busy属性')
    }
    if (!hasIndication) {
      issues.push('加载状态缺少视觉指示器')
    }

    return {
      element: this.getElementSelector(element),
      ariaLive,
      ariaBusy,
      hasIndication,
      hasTimeout,
      issues
    }
  }

  // ==================== 测试方法 ====================

  private testARIAAttributes(container: HTMLElement | Document): ScreenReaderTest {
    const issues: ScreenReaderIssue[] = []
    const elements = container.querySelectorAll('[role]')

    elements.forEach(element => {
      const role = element.getAttribute('role')
      if (role && !VALID_ARIA_ROLES.includes(role)) {
        issues.push({
          id: 'invalid-role',
          element: this.getElementSelector(element),
          attribute: 'role',
          value: role,
          issue: `使用了无效的ARIA角色: ${role}`,
          suggestion: `使用有效的ARIA角色或移除role属性`,
          wcagReference: '1.3.1 Info and Relationships',
          impact: '屏幕阅读器无法正确识别元素类型',
          automated: true
        })
      }
    })

    return {
      testName: 'ARIA属性验证',
      description: '检查ARIA角色的有效性和属性的完整性',
      category: 'aria',
      expectedBehavior: '所有ARIA属性应该有效且完整',
      passed: issues.length === 0,
      issues,
      severity: issues.length > 0 ? 'serious' : 'critical',
      automated: true,
      needsManualTest: false,
      testedWith: ['NVDA', 'JAWS', 'VoiceOver']
    }
  }

  private testSemanticMarkup(container: HTMLElement | Document): ScreenReaderTest {
    const issues: ScreenReaderIssue[] = []

    // 检查标题结构
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const hasH1 = Array.from(headings).some(h => h.tagName === 'H1')

    if (!hasH1 && headings.length > 0) {
      issues.push({
        id: 'missing-h1',
        element: 'document',
        issue: '页面缺少H1主标题',
        suggestion: '为页面添加H1标题来标识主要内容',
        wcagReference: '2.4.6 Headings and Labels',
        impact: '屏幕阅读器用户难以理解页面结构',
        automated: true
      })
    }

    return {
      testName: '语义化标记验证',
      description: '检查HTML5语义元素和标题结构的正确使用',
      category: 'semantic',
      expectedBehavior: '正确使用语义化HTML和标题层级',
      passed: issues.length === 0,
      issues,
      severity: issues.length > 0 ? 'moderate' : 'critical',
      automated: true,
      needsManualTest: false,
      testedWith: ['NVDA', 'JAWS', 'VoiceOver']
    }
  }

  private testAccessibleNames(container: HTMLElement | Document): ScreenReaderTest {
    const issues: ScreenReaderIssue[] = []
    const interactiveElements = container.querySelectorAll('a[href], button, input, select, textarea')

    interactiveElements.forEach(element => {
      const hasName = this.hasAccessibleName(element)
      if (!hasName) {
        issues.push({
          id: 'missing-accessible-name',
          element: this.getElementSelector(element),
          issue: '交互元素缺少可访问名称',
          suggestion: '添加aria-label、aria-labelledby或确保元素有文本内容',
          wcagReference: '4.1.2 Name, Role, Value',
          impact: '屏幕阅读器用户无法识别元素功能',
          automated: true
        })
      }
    })

    return {
      testName: '可访问名称验证',
      description: '检查交互元素是否有合适的可访问名称',
      category: 'naming',
      expectedBehavior: '所有交互元素都应该有明确的可访问名称',
      passed: issues.length === 0,
      issues,
      severity: issues.length > 0 ? 'serious' : 'critical',
      automated: true,
      needsManualTest: false,
      testedWith: ['NVDA', 'JAWS', 'VoiceOver']
    }
  }

  private testFocusManagement(container: HTMLElement | Document): ScreenReaderTest {
    return {
      testName: '焦点管理验证',
      description: '检查焦点管理和屏幕阅读器焦点跟踪',
      category: 'navigation',
      expectedBehavior: '屏幕阅读器应该能正确跟踪焦点变化',
      passed: true, // 需要更复杂的实现
      issues: [],
      severity: 'critical',
      automated: true,
      needsManualTest: true,
      testedWith: ['NVDA', 'JAWS', 'VoiceOver']
    }
  }

  private testStateNotifications(container: HTMLElement | Document): ScreenReaderTest {
    const issues: ScreenReaderIssue[] = []
    const dynamicContent = container.querySelectorAll('[aria-live], [role="status"], [role="alert"]')

    dynamicContent.forEach(element => {
      const ariaLive = element.getAttribute('aria-live')
      if (!ariaLive || ariaLive === 'off') {
        issues.push({
          id: 'missing-live-region',
          element: this.getElementSelector(element),
          attribute: 'aria-live',
          issue: '动态内容区域缺少aria-live属性',
          suggestion: '设置aria-live="polite"或aria-live="assertive"',
          wcagReference: '4.1.3 Status Messages',
          impact: '屏幕阅读器用户无法获知内容变化',
          automated: true
        })
      }
    })

    return {
      testName: '状态通知验证',
      description: '检查动态内容变化是否能正确通知屏幕阅读器',
      category: 'state',
      expectedBehavior: '重要状态变化应该通过live regions通知用户',
      passed: issues.length === 0,
      issues,
      severity: issues.length > 0 ? 'serious' : 'critical',
      automated: true,
      needsManualTest: true,
      testedWith: ['NVDA', 'JAWS', 'VoiceOver']
    }
  }

  private testFormAccessibility(container: HTMLElement | Document): ScreenReaderTest {
    const issues: ScreenReaderIssue[] = []
    const forms = container.querySelectorAll('form')

    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea')
      inputs.forEach(input => {
        const hasLabel = form.querySelector(`label[for="${input.id}"]`) || input.closest('label')
        if (!hasLabel && !input.hasAttribute('aria-label')) {
          issues.push({
            id: 'missing-form-label',
            element: this.getElementSelector(input),
            issue: '表单字段缺少标签',
            suggestion: '添加label元素或aria-label属性',
            wcagReference: '3.3.2 Labels or Instructions',
            impact: '屏幕阅读器用户无法理解字段用途',
            automated: true
          })
        }
      })
    })

    return {
      testName: '表单可访问性验证',
      description: '检查表单标签、错误提示和验证的可访问性',
      category: 'form',
      expectedBehavior: '表单字段应该有清晰的标签和错误提示',
      passed: issues.length === 0,
      issues,
      severity: issues.length > 0 ? 'serious' : 'critical',
      automated: true,
      needsManualTest: true,
      testedWith: ['NVDA', 'JAWS', 'VoiceOver']
    }
  }

  private testMediaAccessibility(container: HTMLElement | Document): ScreenReaderTest {
    return {
      testName: '媒体可访问性验证',
      description: '检查图片、视频等媒体元素的可访问性',
      category: 'media',
      expectedBehavior: '媒体元素应该有替代文本或描述',
      passed: true, // 需要更详细的实现
      issues: [],
      severity: 'critical',
      automated: true,
      needsManualTest: true,
      testedWith: ['NVDA', 'JAWS', 'VoiceOver']
    }
  }

  // ==================== 辅助方法 ====================

  private getElementSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`
    }
    if (element.className) {
      return `${element.tagName.toLowerCase()}.${element.className.split(' ').join('.')}`
    }
    return element.tagName.toLowerCase()
  }

  private getElementNestingLevel(element: Element): number {
    let level = 0
    let parent = element.parentElement
    while (parent) {
      level++
      parent = parent.parentElement
    }
    return level
  }

  private isComplexTable(element: Element): boolean {
    const rows = element.querySelectorAll('tr').length
    const cols = element.querySelectorAll('th, td').length
    const hasColspan = Array.from(element.querySelectorAll('td, th')).some(cell => cell.hasAttribute('colspan'))
    const hasRowspan = Array.from(element.querySelectorAll('td, th')).some(cell => cell.hasAttribute('rowspan'))

    return rows > 5 || cols > 10 || hasColspan || hasRowspan
  }

  private isComplexImage(element: Element): boolean {
    const src = element.getAttribute('src') || ''
    return src.includes('chart') || src.includes('graph') || src.includes('diagram') || src.includes('infographic')
  }

  private isNameAppropriateForElement(element: Element, name: string): boolean {
    const tagName = element.tagName.toLowerCase()

    // 检查是否描述了元素功能
    if (tagName === 'button' && name.includes('点击')) {
      return false
    }
    if (tagName === 'a' && name.includes('链接')) {
      return false
    }

    return name.length > 2
  }

  private hasAccessibleName(element: Element): boolean {
    return element.hasAttribute('aria-label') ||
           element.hasAttribute('aria-labelledby') ||
           (element.textContent?.trim().length || 0) > 0 ||
           element.hasAttribute('title') ||
           element.hasAttribute('placeholder')
  }

  private checkRedundantName(element: Element, name: string): boolean {
    const tagName = element.tagName.toLowerCase()
    const text = element.textContent?.trim() || ''

    // 检查是否有冗余的描述
    if (tagName === 'button' && text === name) {
      return name.includes('按钮') || name.includes('button')
    }

    return false
  }

  private getErrorNotificationType(element: Element): ErrorNotification['type'] {
    if (element.classList.contains('inline-error')) return 'inline'
    if (element.classList.contains('error-summary')) return 'summary'
    if (element.hasAttribute('role') && element.getAttribute('role') === 'dialog') return 'dialog'
    return 'inline'
  }

  private findAssociatedFormField(element: Element): string {
    const ariaDescribedBy = element.getAttribute('aria-describedby')
    if (ariaDescribedBy) {
      return `#${ariaDescribedBy}`
    }

    // 查找附近的表单字段
    let parent = element.parentElement
    while (parent && parent !== document.body) {
      const field = parent.querySelector('input, select, textarea')
      if (field) {
        return this.getElementSelector(field)
      }
      parent = parent.parentElement
    }

    return ''
  }

  private getNotificationContext(element: Element): string {
    if (element.closest('.form')) return 'form'
    if (element.closest('.modal')) return 'modal'
    if (element.closest('.notification')) return 'notification'
    return 'page'
  }

  // ==================== 分数计算和建议生成 ====================

  private calculateOverallScore(
    tests: ScreenReaderTest[],
    ariaAnalysis: ARIAAttributeAnalysis,
    semanticAnalysis: SemanticMarkupAnalysis
  ): {
    overallScore: number
    passedTests: number
    failedTests: number
    criticalIssues: number
  } {
    const passedTests = tests.filter(t => t.passed).length
    const failedTests = tests.filter(t => !t.passed).length
    const criticalIssues = tests.filter(t => t.severity === 'critical' && !t.passed).length

    const testScore = tests.length > 0 ? (passedTests / tests.length) * 100 : 100
    const ariaScore = this.calculateARIAScore(ariaAnalysis)
    const semanticScore = this.calculateSemanticScore(semanticAnalysis)

    const overallScore = (testScore * 0.4) + (ariaScore * 0.3) + (semanticScore * 0.3)

    return {
      overallScore: Math.round(overallScore),
      passedTests,
      failedTests,
      criticalIssues
    }
  }

  private calculateARIAScore(analysis: ARIAAttributeAnalysis): number {
    const totalRoles = analysis.validRoles.length + analysis.invalidRoles.length
    const validRoleScore = totalRoles > 0 ? (analysis.validRoles.length / totalRoles) * 100 : 100

    const missingAttrScore = Math.max(0, 100 - (analysis.missingAttributes.length * 10))
    const incorrectAttrScore = Math.max(0, 100 - (analysis.incorrectAttributes.length * 15))

    return (validRoleScore * 0.4) + (missingAttrScore * 0.3) + (incorrectAttrScore * 0.3)
  }

  private calculateSemanticScore(analysis: SemanticMarkupAnalysis): number {
    let score = 100

    if (!analysis.headingStructure.hasH1 && analysis.headingStructure.headings.length > 0) {
      score -= 10
    }
    if (!analysis.headingStructure.properNesting) {
      score -= 15
    }
    if (!analysis.landmarkStructure.hasMain) {
      score -= 10
    }

    return Math.max(0, score)
  }

  private generateRecommendations(
    ariaAnalysis: ARIAAttributeAnalysis,
    semanticAnalysis: SemanticMarkupAnalysis,
    nameAnalysis: AccessibleNameAnalysis,
    stateAnalysis: StateNotificationAnalysis,
    tests: ScreenReaderTest[]
  ): string[] {
    const recommendations: string[] = []

    // ARIA建议
    if (ariaAnalysis.invalidRoles.length > 0) {
      recommendations.push('修复无效的ARIA角色，使用标准的ARIA角色或语义化HTML元素')
    }
    if (ariaAnalysis.missingAttributes.length > 0) {
      recommendations.push('为ARIA组件添加必需的属性，确保屏幕阅读器能正确识别')
    }

    // 语义化建议
    if (!semanticAnalysis.headingStructure.hasH1) {
      recommendations.push('为页面添加H1标题，帮助屏幕阅读器用户理解页面主题')
    }
    if (!semanticAnalysis.landmarkStructure.hasMain) {
      recommendations.push('使用<main>元素或role="main"标识主要内容区域')
    }

    // 可访问名称建议
    if (nameAnalysis.missingNames.length > 0) {
      recommendations.push('为所有交互元素添加可访问名称，确保屏幕阅读器用户能理解功能')
    }

    // 状态通知建议
    if (stateAnalysis.dynamicRegions.length === 0 && tests.some(t => t.category === 'state')) {
      recommendations.push('为动态内容区域添加aria-live属性，确保内容变化能被及时通知')
    }

    return recommendations
  }

  private determineManualTestingRequirements(
    tests: ScreenReaderTest[]
  ): { needsManualTesting: boolean; manualTestInstructions: string[] } {
    const needsManualTest = tests.some(t => t.needsManualTest)

    const instructions: string[] = []
    if (needsManualTest) {
      instructions.push('使用NVDA或JAWS测试所有交互元素的屏幕阅读器识别')
      instructions.push('验证焦点管理是否正确，确保屏幕阅读器能跟踪焦点变化')
      instructions.push('测试动态内容变化是否能正确通知屏幕阅读器用户')
      instructions.push('验证表单验证和错误提示的可访问性')
      instructions.push('检查键盘导航与屏幕阅读器的协调工作')
    }

    return {
      needsManualTesting: needsManualTest,
      manualTestInstructions: instructions
    }
  }

  // 其他生成建议的方法
  private generateHeadingRecommendations(hasH1: boolean, properNesting: boolean, skippedLevels: number[]): string[] {
    const recommendations: string[] = []

    if (!hasH1) {
      recommendations.push('添加H1标题来标识页面主题')
    }
    if (!properNesting) {
      recommendations.push('修复标题层级，不要跳过标题级别')
    }
    if (skippedLevels.length > 0) {
      recommendations.push(`避免跳过标题级别: H${skippedLevels.join(', H')}`)
    }

    return recommendations
  }

  private generateListRecommendations(lists: ListStructure[], properNesting: boolean): string[] {
    const recommendations: string[] = []

    if (!properNesting) {
      recommendations.push('确保列表有正确的结构，包含列表项')
    }

    const emptyLists = lists.filter(list => list.itemCount === 0)
    if (emptyLists.length > 0) {
      recommendations.push('移除空列表或添加列表项')
    }

    return recommendations
  }

  private generateLandmarkRecommendations(missingLandmarks: string[], overlappingRoles: string[]): string[] {
    const recommendations: string[] = []

    if (missingLandmarks.includes('main')) {
      recommendations.push('添加<main>元素或role="main"来标识主要内容')
    }
    if (missingLandmarks.includes('navigation')) {
      recommendations.push('使用<nav>元素或role="navigation"标识导航区域')
    }

    return recommendations
  }

  private generateTableRecommendations(tables: TableInfo[]): string[] {
    const recommendations: string[] = []

    tables.forEach(table => {
      if (!table.hasCaption) {
        recommendations.push(`为表格 ${table.element} 添加标题说明`)
      }
      if (!table.hasHeaders) {
        recommendations.push(`为表格 ${table.element} 添加表头`)
      }
      if (!table.hasScope) {
        recommendations.push(`为表格 ${table.element} 的表头添加scope属性`)
      }
    })

    return recommendations
  }

  private generateFormRecommendations(forms: FormInfo[]): string[] {
    const recommendations: string[] = []

    forms.forEach(form => {
      if (!form.hasProperLabels) {
        recommendations.push(`为表单 ${form.element} 的字段添加标签`)
      }
      if (!form.hasErrorMessages) {
        recommendations.push(`为表单 ${form.element} 添加错误提示机制`)
      }
    })

    return recommendations
  }

  private generateLinkRecommendations(links: LinkInfo[]): string[] {
    const recommendations: string[] = []

    const ambiguousLinks = links.filter(link => !link.isDescriptive)
    if (ambiguousLinks.length > 0) {
      recommendations.push('改进链接文本，使其更具描述性')
    }

    const externalLinks = links.filter(link => link.isExternal && !link.hasAriaLabel)
    if (externalLinks.length > 0) {
      recommendations.push('为外部链接添加aria-label标识')
    }

    return recommendations
  }

  private generateImageRecommendations(images: ImageInfo[]): string[] {
    const recommendations: string[] = []

    const missingAlt = images.filter(img => !img.hasAlt)
    if (missingAlt.length > 0) {
      recommendations.push('为所有图片添加alt属性')
    }

    const complexImages = images.filter(img => img.needsLongDesc && !img.hasLongDesc)
    if (complexImages.length > 0) {
      recommendations.push('为复杂图片添加详细描述')
    }

    return recommendations
  }

  private generateNameRecommendations(missing: string[], ambiguous: string[], redundant: string[]): string[] {
    const recommendations: string[] = []

    if (missing.length > 0) {
      recommendations.push('为交互元素添加可访问名称')
    }
    if (ambiguous.length > 0) {
      recommendations.push('改进可访问名称的描述性')
    }
    if (redundant.length > 0) {
      recommendations.push('移除冗余的可访问名称信息')
    }

    return recommendations
  }

  private generateStateNotificationRecommendations(
    dynamicRegions: DynamicRegion[],
    errors: ErrorNotification[],
    successes: SuccessNotification[],
    loading: LoadingState[]
  ): string[] {
    const recommendations: string[] = []

    if (dynamicRegions.length === 0) {
      recommendations.push('为动态内容区域添加aria-live属性')
    }

    const errorsWithoutAnnouncement = errors.filter(e => !e.isAnnounced)
    if (errorsWithoutAnnouncement.length > 0) {
      recommendations.push('确保错误消息能被屏幕阅读器通知')
    }

    return recommendations
  }
}

// ==================== 导出 ====================

export const screenReaderValidator = new ScreenReaderValidator()

// 便捷方法
export async function validateScreenReaderCompatibility(
  container?: HTMLElement | Document
): Promise<ScreenReaderCompatibilityReport> {
  return screenReaderValidator.validateScreenReaderCompatibility(container)
}

export function analyzeARIAAttributes(container: HTMLElement | Document): ARIAAttributeAnalysis {
  return screenReaderValidator.analyzeARIAAttributes(container)
}

export function analyzeSemanticMarkup(container: HTMLElement | Document): SemanticMarkupAnalysis {
  return screenReaderValidator.analyzeSemanticMarkup(container)
}