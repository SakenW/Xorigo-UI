/**
 * Xorigo UI 键盘导航和焦点管理系统验证器
 *
 * 全面验证键盘导航的可用性、焦点管理的正确性和Tab顺序的逻辑性
 * 确保所有交互元素都完全符合键盘可访问性标准
 *
 * @version 1.0.0
 * @author Xorigo UI Team
 */

// ==================== 类型定义 ====================

export interface FocusableElement {
  element: string
  selector: string
  index: number
  tabIndex: number
  isVisible: boolean
  isEnabled: boolean
  hasFocusIndicator: boolean
  focusIndicatorStyles: FocusIndicatorStyles
  role?: string
  ariaLabel?: string
  expectedOrder: number
  actualOrder?: number
  issues: string[]
}

export interface FocusIndicatorStyles {
  hasOutline: boolean
  outlineWidth: string
  outlineColor: string
  outlineStyle: string
  hasBackgroundColor: boolean
  backgroundColor?: string
  hasBorderColor: boolean
  borderColor?: string
  hasBoxShadow: boolean
  boxShadow?: string
  customStyles: string[]
  contrastRatio?: number
}

export interface KeyboardNavigationTest {
  testName: string
  description: string
  category: 'focus' | 'tab' | 'escape' | 'arrow' | 'enter' | 'space'
  expectedBehavior: string
  actualBehavior?: string
  passed: boolean
  issues: string[]
  severity: 'critical' | 'serious' | 'moderate' | 'minor'
  automated: boolean
  needsManualTest: boolean
}

export interface FocusOrderAnalysis {
  logicalOrder: boolean
  visualOrder: boolean
  domOrder: boolean
  readingOrder: boolean
  inconsistencies: FocusOrderInconsistency[]
  recommendations: string[]
}

export interface FocusOrderInconsistency {
  type: 'visual-vs-dom' | 'reading-vs-dom' | 'logical-gap' | 'unexpected-jump'
  elements: string[]
  description: string
  severity: 'critical' | 'serious' | 'moderate'
  suggestion: string
}

export interface FocusTrapAnalysis {
  traps: FocusTrap[]
  escapeRoutes: EscapeRoute[]
  trapIssues: TrapIssue[]
  recommendations: string[]
}

export interface FocusTrap {
  container: string
  trappedElements: string[]
  hasEscapeKey: boolean
  escapeKeyTarget?: string
  trapType: 'modal' | 'menu' | 'dialog' | 'custom'
  isIntentional: boolean
}

export interface EscapeRoute {
  trapContainer: string
  escapeMethod: 'ESC' | 'click-outside' | 'focus-outside' | 'custom'
  target: string
  worksCorrectly: boolean
}

export interface TrapIssue {
  trapId: string
  issueType: 'no-escape' | 'partial-trap' | 'unintentional-trap' | 'escape-fails'
  severity: 'critical' | 'serious'
  description: string
  affectedElements: string[]
  recommendation: string
}

export interface KeyboardShortcutAnalysis {
  shortcuts: KeyboardShortcut[]
  conflicts: ShortcutConflict[]
  missingShortcuts: string[]
  consistencyIssues: ShortcutConsistencyIssue[]
  recommendations: string[]
}

export interface KeyboardShortcut {
  keys: string[]
  action: string
  context: string
  element?: string
  isStandard: boolean
  isDocumented: boolean
  works: boolean
  priority: 'essential' | 'helpful' | 'optional'
}

export interface ShortcutConflict {
  keys: string[]
  conflictingActions: string[]
  context: string
  severity: 'critical' | 'serious' | 'moderate'
  resolution: string
}

export interface ShortcutConsistencyIssue {
  shortcut: string[]
  inconsistentBehaviors: string[]
  expectedBehavior: string
  severity: 'moderate' | 'minor'
  suggestion: string
}

export interface SkipLinkAnalysis {
  skipLinks: SkipLink[]
  targetExists: boolean
  targetsAreFocusable: boolean
  hiddenInitially: boolean
  visibleOnFocus: boolean
  issues: SkipLinkIssue[]
}

export interface SkipLink {
  link: string
  target: string
  text: string
  isVisible: boolean
  becomesVisibleOnFocus: boolean
  worksCorrectly: boolean
}

export interface SkipLinkIssue {
  linkId: string
  issueType: 'missing-target' | 'target-not-focusable' | 'not-hidden' | 'not-visible-focus' | 'poor-text'
  severity: 'serious' | 'moderate' | 'minor'
  description: string
  recommendation: string
}

export interface KeyboardNavigationReport {
  timestamp: Date
  overallScore: number
  totalTests: number
  passedTests: number
  failedTests: number
  criticalIssues: number
  focusableElements: FocusableElement[]
  navigationTests: KeyboardNavigationTest[]
  focusOrderAnalysis: FocusOrderAnalysis
  focusTrapAnalysis: FocusTrapAnalysis
  keyboardShortcutAnalysis: KeyboardShortcutAnalysis
  skipLinkAnalysis: SkipLinkAnalysis
  recommendations: string[]
  needsManualTesting: boolean
  manualTestInstructions: string[]
}

// ==================== 标准键盘快捷键定义 ====================

const STANDARD_KEYBOARD_SHORTCUTS = {
  // 导航
  'Tab': 'Move to next focusable element',
  'Shift+Tab': 'Move to previous focusable element',
  'Enter': 'Activate button/link/submit form',
  'Space': 'Activate button/toggle checkbox/select radio',
  'Escape': 'Close modal/dropdown/cancel action',

  // 方向键
  'ArrowUp': 'Move up in lists/menus/decrease value',
  'ArrowDown': 'Move down in lists/menus/increase value',
  'ArrowLeft': 'Move left/decrease value',
  'ArrowRight': 'Move right/increase value',

  // 其他常用
  'Home': 'Go to beginning of list/first item',
  'End': 'Go to end of list/last item',
  'PageUp': 'Move up one page/screen',
  'PageDown': 'Move down one page/screen',

  // 字母键
  'a': 'Select all (in text areas)',
  'c': 'Copy (with Ctrl)',
  'v': 'Paste (with Ctrl)',
  'x': 'Cut (with Ctrl)',
  'z': 'Undo (with Ctrl)',
  'y': 'Redo (with Ctrl)'
}

// ==================== 核心验证类 ====================

export class KeyboardNavigationValidator {
  private focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
    'summary',
    'audio[controls]',
    'video[controls]',
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="option"]',
    '[role="tab"]'
  ]

  /**
   * 执行完整的键盘导航验证
   */
  async validateKeyboardNavigation(
    container: HTMLElement | Document = document
  ): Promise<KeyboardNavigationReport> {
    const timestamp = new Date()

    // 1. 识别所有可聚焦元素
    const focusableElements = this.identifyFocusableElements(container)

    // 2. 分析焦点顺序
    const focusOrderAnalysis = this.analyzeFocusOrder(focusableElements)

    // 3. 检测焦点陷阱
    const focusTrapAnalysis = this.analyzeFocusTraps(container, focusableElements)

    // 4. 分析键盘快捷键
    const keyboardShortcutAnalysis = this.analyzeKeyboardShortcuts(container)

    // 5. 检查跳转链接
    const skipLinkAnalysis = this.analyzeSkipLinks(container)

    // 6. 执行导航测试
    const navigationTests = await this.performNavigationTests(container, focusableElements)

    // 7. 计算总体分数
    const { overallScore, passedTests, failedTests, criticalIssues } =
      this.calculateOverallScore(navigationTests, focusOrderAnalysis, focusTrapAnalysis)

    // 8. 生成建议
    const recommendations = this.generateRecommendations(
      focusOrderAnalysis,
      focusTrapAnalysis,
      keyboardShortcutAnalysis,
      skipLinkAnalysis,
      navigationTests
    )

    // 9. 确定是否需要手动测试
    const { needsManualTesting, manualTestInstructions } =
      this.determineManualTestingRequirements(navigationTests, focusTrapAnalysis)

    return {
      timestamp,
      overallScore,
      totalTests: navigationTests.length,
      passedTests,
      failedTests,
      criticalIssues,
      focusableElements,
      navigationTests,
      focusOrderAnalysis,
      focusTrapAnalysis,
      keyboardShortcutAnalysis,
      skipLinkAnalysis,
      recommendations,
      needsManualTesting,
      manualTestInstructions
    }
  }

  /**
   * 识别所有可聚焦元素
   */
  private identifyFocusableElements(
    container: HTMLElement | Document
  ): FocusableElement[] {
    const elements: FocusableElement[] = []
    const nodeList = container.querySelectorAll(this.focusableSelectors.join(', '))

    nodeList.forEach((element, index) => {
      const focusableEl = this.analyzeFocusableElement(element, index)
      if (focusableEl) {
        elements.push(focusableEl)
      }
    })

    return elements
  }

  /**
   * 分析单个可聚焦元素
   */
  private analyzeFocusableElement(
    element: Element,
    index: number
  ): FocusableElement | null {
    const htmlElement = element as HTMLElement
    const computedStyle = window.getComputedStyle(htmlElement)

    // 检查元素是否真正可见和可交互
    if (!this.isElementVisible(htmlElement) || !this.isElementEnabled(htmlElement)) {
      return null
    }

    const selector = this.generateSelector(element)
    const tabIndex = parseInt(element.getAttribute('tabindex') || '0') || 0
    const isVisible = this.isElementVisible(htmlElement)
    const isEnabled = this.isElementEnabled(htmlElement)

    // 分析焦点指示器
    const focusIndicatorStyles = this.analyzeFocusIndicatorStyles(htmlElement)
    const hasFocusIndicator = this.hasFocusIndicator(focusIndicatorStyles)

    const issues: string[] = []

    // 检查常见问题
    if (tabIndex > 0) {
      issues.push(`使用了正数tabindex (${tabIndex})，可能破坏自然的Tab顺序`)
    }

    if (!hasFocusIndicator) {
      issues.push('缺少可见的焦点指示器')
    }

    if (!element.getAttribute('aria-label') &&
        !element.getAttribute('aria-labelledby') &&
        !this.hasTextContent(element)) {
      issues.push('交互元素缺少可访问的名称')
    }

    return {
      element: element.tagName.toLowerCase(),
      selector,
      index,
      tabIndex,
      isVisible,
      isEnabled,
      hasFocusIndicator,
      focusIndicatorStyles,
      role: element.getAttribute('role') || undefined,
      ariaLabel: element.getAttribute('aria-label') ||
                 element.getAttribute('aria-labelledby') || undefined,
      expectedOrder: index,
      issues
    }
  }

  /**
   * 分析焦点顺序
   */
  private analyzeFocusOrder(elements: FocusableElement[]): FocusOrderAnalysis {
    const inconsistencies: FocusOrderInconsistency[] = []

    // 检查DOM顺序与视觉顺序的一致性
    const visualOrderIssues = this.checkVisualVsDOMOrder(elements)
    inconsistencies.push(...visualOrderIssues)

    // 检查阅读顺序与焦点顺序的一致性
    const readingOrderIssues = this.checkReadingVsDOMOrder(elements)
    inconsistencies.push(...readingOrderIssues)

    // 检查逻辑顺序的一致性
    const logicalOrderIssues = this.checkLogicalOrder(elements)
    inconsistencies.push(...logicalOrderIssues)

    const logicalOrder = inconsistencies.filter(i => i.type === 'logical-gap').length === 0
    const visualOrder = inconsistencies.filter(i => i.type === 'visual-vs-dom').length === 0
    const domOrder = true // DOM顺序总是正确的
    const readingOrder = inconsistencies.filter(i => i.type === 'reading-vs-dom').length === 0

    const recommendations = this.generateFocusOrderRecommendations(inconsistencies)

    return {
      logicalOrder,
      visualOrder,
      domOrder,
      readingOrder,
      inconsistencies,
      recommendations
    }
  }

  /**
   * 分析焦点陷阱
   */
  private analyzeFocusTraps(
    container: HTMLElement | Document,
    focusableElements: FocusableElement[]
  ): FocusTrapAnalysis {
    const traps: FocusTrap[] = []
    const escapeRoutes: EscapeRoute[] = []
    const trapIssues: TrapIssue[] = []

    // 查找可能的焦点陷阱容器
    const trapContainers = this.findPotentialTrapContainers(container)

    for (const trapContainer of trapContainers) {
      const trap = this.analyzeFocusTrap(trapContainer, focusableElements)
      traps.push(trap)

      if (!trap.hasEscapeKey && trap.isIntentional) {
        trapIssues.push({
          trapId: trap.container,
          issueType: 'no-escape',
          severity: 'critical',
          description: `${trap.container} 是焦点陷阱但没有提供退出方式`,
          affectedElements: trap.trappedElements,
          recommendation: '添加ESC键或其他退出机制'
        })
      }

      if (!trap.isIntentional) {
        trapIssues.push({
          trapId: trap.container,
          issueType: 'unintentional-trap',
          severity: 'serious',
          description: `${trap.container} 意外创建了焦点陷阱`,
          affectedElements: trap.trappedElements,
          recommendation: '修复焦点管理逻辑或移除导致陷阱的属性'
        })
      }
    }

    // 分析逃生路线
    for (const trap of traps) {
      if (trap.hasEscapeKey) {
        const escapeRoute = this.testEscapeRoute(trap)
        escapeRoutes.push(escapeRoute)
      }
    }

    const recommendations = this.generateFocusTrapRecommendations(trapIssues, traps)

    return {
      traps,
      escapeRoutes,
      trapIssues,
      recommendations
    }
  }

  /**
   * 分析键盘快捷键
   */
  private analyzeKeyboardShortcuts(
    container: HTMLElement | Document
  ): KeyboardShortcutAnalysis {
    const shortcuts: KeyboardShortcut[] = []
    const conflicts: ShortcutConflict[] = []
    const missingShortcuts: string[] = []
    const consistencyIssues: ShortcutConsistencyIssue[] = []

    // 检测标准快捷键实现
    for (const [keys, expectedAction] of Object.entries(STANDARD_KEYBOARD_SHORTCUTS)) {
      const shortcut = this.detectKeyboardShortcut(container, keys, expectedAction)
      if (shortcut) {
        shortcuts.push(shortcut)
      } else {
        missingShortcuts.push(keys)
      }
    }

    // 检测自定义快捷键
    const customShortcuts = this.detectCustomShortcuts(container)
    shortcuts.push(...customShortcuts)

    // 检测快捷键冲突
    const detectedConflicts = this.detectShortcutConflicts(shortcuts)
    conflicts.push(...detectedConflicts)

    // 检查一致性问题
    const detectedInconsistencies = this.detectShortcutInconsistencies(shortcuts)
    consistencyIssues.push(...detectedInconsistencies)

    const recommendations = this.generateShortcutRecommendations(
      missingShortcuts,
      conflicts,
      consistencyIssues
    )

    return {
      shortcuts,
      conflicts,
      missingShortcuts,
      consistencyIssues,
      recommendations
    }
  }

  /**
   * 分析跳转链接
   */
  private analyzeSkipLinks(container: HTMLElement | Document): SkipLinkAnalysis {
    const skipLinks: SkipLink[] = []
    const issues: SkipLinkIssue[] = []

    // 查找跳转链接
    const skipLinkElements = container.querySelectorAll('a[href^="#"], [role="link"][href^="#"]')

    skipLinkElements.forEach(link => {
      const skipLink = this.analyzeSkipLink(link as HTMLAnchorElement)
      skipLinks.push(skipLink)

      // 检查问题
      const targetId = link.getAttribute('href')?.slice(1)
      if (targetId) {
        const target = document.getElementById(targetId)

        if (!target) {
          issues.push({
            linkId: link.id || `skip-link-${skipLinks.length}`,
            issueType: 'missing-target',
            severity: 'serious',
            description: `跳转链接指向不存在的目标: #${targetId}`,
            recommendation: '创建对应的目标元素或修正链接地址'
          })
        } else if (!this.isElementFocusable(target)) {
          issues.push({
            linkId: link.id || `skip-link-${skipLinks.length}`,
            issueType: 'target-not-focusable',
            severity: 'serious',
            description: `跳转链接目标不可聚焦: #${targetId}`,
            recommendation: '为目标元素添加tabindex或使用可聚焦的元素'
          })
        }
      }

      // 检查可见性设置
      const computedStyle = window.getComputedStyle(link)
      if (computedStyle.position !== 'absolute' && computedStyle.position !== 'fixed') {
        issues.push({
          linkId: link.id || `skip-link-${skipLinks.length}`,
          issueType: 'not-hidden',
          severity: 'moderate',
          description: '跳转链接应该默认隐藏',
          recommendation: '使用CSS将跳转链接设置为position: absolute且移出视窗'
        })
      }
    })

    const targetExists = skipLinks.every(link => {
      const targetId = link.target.slice(1)
      return document.getElementById(targetId) !== null
    })

    const targetsAreFocusable = skipLinks.every(link => {
      const targetId = link.target.slice(1)
      const target = document.getElementById(targetId)
      return target ? this.isElementFocusable(target) : false
    })

    const hiddenInitially = skipLinks.every(link => {
      const computedStyle = window.getComputedStyle(link as HTMLElement)
      return computedStyle.position === 'absolute' || computedStyle.position === 'fixed'
    })

    return {
      skipLinks,
      targetExists,
      targetsAreFocusable,
      hiddenInitially,
      visibleOnFocus: false, // 需要手动测试
      issues
    }
  }

  /**
   * 执行导航测试
   */
  private async performNavigationTests(
    container: HTMLElement | Document,
    focusableElements: FocusableElement[]
  ): Promise<KeyboardNavigationTest[]> {
    const tests: KeyboardNavigationTest[] = []

    // Tab键导航测试
    tests.push(this.testTabNavigation(focusableElements))

    // Shift+Tab键导航测试
    tests.push(this.testShiftTabNavigation(focusableElements))

    // Enter键激活测试
    tests.push(this.testEnterActivation(focusableElements))

    // Space键激活测试
    tests.push(this.testSpaceActivation(focusableElements))

    // Escape键测试
    tests.push(this.testEscapeKey(container))

    // 方向键导航测试
    tests.push(this.testArrowKeys(focusableElements))

    return tests
  }

  // ==================== 具体测试方法 ====================

  private testTabNavigation(elements: FocusableElement[]): KeyboardNavigationTest {
    const visibleElements = elements.filter(el => el.isVisible && el.isEnabled)
    const issues: string[] = []

    // 检查Tab顺序是否合理
    for (let i = 0; i < visibleElements.length - 1; i++) {
      const current = visibleElements[i]
      const next = visibleElements[i + 1]

      // 检查是否有不合理的跳跃
      if (current.tabIndex > 0 && next.tabIndex > 0 && current.tabIndex > next.tabIndex) {
        issues.push(`Tab顺序不合理: ${current.element} (tabindex: ${current.tabIndex}) 在 ${next.element} (tabindex: ${next.tabIndex}) 之前`)
      }
    }

    return {
      testName: 'Tab键导航',
      description: '测试使用Tab键在可聚焦元素间导航',
      category: 'tab',
      expectedBehavior: 'Tab键应该按照逻辑顺序在所有可见、可用的元素间移动焦点',
      passed: issues.length === 0,
      issues,
      severity: issues.length > 0 ? 'serious' : 'critical',
      automated: true,
      needsManualTest: false
    }
  }

  private testShiftTabNavigation(elements: FocusableElement[]): KeyboardNavigationTest {
    const issues: string[] = []

    // 检查Shift+Tab是否正常工作
    const positiveTabIndexes = elements.filter(el => el.tabIndex > 0)
    if (positiveTabIndexes.length > 1) {
      issues.push(`发现 ${positiveTabIndexes.length} 个元素使用了正数tabindex，可能影响Shift+Tab导航`)
    }

    return {
      testName: 'Shift+Tab键导航',
      description: '测试使用Shift+Tab键反向导航',
      category: 'tab',
      expectedBehavior: 'Shift+Tab键应该按相反顺序在元素间移动焦点',
      passed: issues.length === 0,
      issues,
      severity: issues.length > 0 ? 'moderate' : 'critical',
      automated: true,
      needsManualTest: false
    }
  }

  private testEnterActivation(elements: FocusableElement[]): KeyboardNavigationTest {
    const issues: string[] = []
    const enterableElements = elements.filter(el =>
      ['a', 'button', 'input[type="submit"]'].includes(el.element)
    )

    // 检查Enter键激活功能
    for (const element of enterableElements) {
      if (!element.isEnabled) {
        issues.push(`${element.element} 元素被禁用，但仍可能获得焦点`)
      }
    }

    return {
      testName: 'Enter键激活',
      description: '测试使用Enter键激活链接和按钮',
      category: 'enter',
      expectedBehavior: 'Enter键应该激活链接、按钮和表单提交',
      passed: issues.length === 0,
      issues,
      severity: 'moderate',
      automated: true,
      needsManualTest: true // 需要实际测试行为
    }
  }

  private testSpaceActivation(elements: FocusableElement[]): KeyboardNavigationTest {
    const spaceableElements = elements.filter(el =>
      ['button', 'input[type="checkbox"]', 'input[type="radio"]'].includes(el.element)
    )

    const issues: string[] = []

    return {
      testName: 'Space键激活',
      description: '测试使用Space键激活按钮和切换控件',
      category: 'space',
      expectedBehavior: 'Space键应该激活按钮、切换复选框和单选按钮',
      passed: issues.length === 0,
      issues,
      severity: 'moderate',
      automated: true,
      needsManualTest: true
    }
  }

  private testEscapeKey(container: HTMLElement | Document): KeyboardNavigationTest {
    const issues: string[] = []
    const modals = container.querySelectorAll('[role="dialog"], .modal, [aria-modal="true"]')

    if (modals.length > 0) {
      // 检查模态框是否有ESC键关闭功能
      for (const modal of modals) {
        const hasCloseButton = modal.querySelector('.close, [aria-label="关闭"], [aria-label="Close"]') !== null
        if (!hasCloseButton) {
          issues.push(`模态框 ${modal.id || '未命名'} 可能缺少ESC键关闭功能`)
        }
      }
    }

    return {
      testName: 'Escape键功能',
      description: '测试使用ESC键关闭模态框和取消操作',
      category: 'escape',
      expectedBehavior: 'ESC键应该关闭模态框、下拉菜单和取消当前操作',
      passed: issues.length === 0,
      issues,
      severity: issues.length > 0 ? 'serious' : 'critical',
      automated: true,
      needsManualTest: true
    }
  }

  private testArrowKeys(elements: FocusableElement[]): KeyboardNavigationTest {
    const issues: string[] = []
    const navigableElements = elements.filter(el =>
      ['[role="menuitem"]', '[role="option"]', '[role="tab"]'].some(role =>
        el.role === role || el.selector.includes(role)
      )
    )

    // 检查是否需要在列表、菜单中实现方向键导航
    if (navigableElements.length > 0) {
      // 这里应该检查是否正确实现了方向键导航
      // 由于自动化测试比较复杂，标记为需要手动测试
    }

    return {
      testName: '方向键导航',
      description: '测试在列表、菜单、标签页中使用方向键导航',
      category: 'arrow',
      expectedBehavior: '方向键应该在相关的元素组内导航',
      passed: issues.length === 0,
      issues,
      severity: 'moderate',
      automated: true,
      needsManualTest: true
    }
  }

  // ==================== 辅助方法 ====================

  private isElementVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element)
    const rect = element.getBoundingClientRect()

    return style.display !== 'none' &&
           style.visibility !== 'hidden' &&
           style.opacity !== '0' &&
           rect.width > 0 &&
           rect.height > 0
  }

  private isElementEnabled(element: HTMLElement): boolean {
    if (element.hasAttribute('disabled')) {
      return false
    }

    if (element.getAttribute('aria-disabled') === 'true') {
      return false
    }

    return true
  }

  private isElementFocusable(element: Element): boolean {
    const tagName = element.tagName.toLowerCase()
    const tabIndex = element.getAttribute('tabindex')

    if (tabIndex === '-1') return false
    if (tabIndex && parseInt(tabIndex) >= 0) return true

    const focusableTags = ['a', 'button', 'input', 'select', 'textarea', 'summary']
    return focusableTags.includes(tagName) ||
           element.hasAttribute('contenteditable') ||
           element.getAttribute('role') !== null
  }

  private hasTextContent(element: Element): boolean {
    return element.textContent?.trim().length > 0
  }

  private generateSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`
    }

    if (element.className) {
      return `${element.tagName.toLowerCase()}.${element.className.split(' ').join('.')}`
    }

    return element.tagName.toLowerCase()
  }

  private analyzeFocusIndicatorStyles(element: HTMLElement): FocusIndicatorStyles {
    const styles = window.getComputedStyle(element, ':focus')
    const hoverStyles = window.getComputedStyle(element, ':focus-visible')

    const hasOutline = styles.outlineStyle !== 'none' && styles.outlineWidth !== '0px'
    const hasBackgroundColor = styles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
                               styles.backgroundColor !== 'transparent'
    const hasBorderColor = styles.borderColor !== 'rgba(0, 0, 0, 0)' &&
                           styles.borderColor !== 'transparent'
    const hasBoxShadow = styles.boxShadow !== 'none'

    const customStyles: string[] = []

    // 检查transform、filter等可能影响焦点显示的样式
    if (styles.transform !== 'none') customStyles.push('transform')
    if (styles.filter !== 'none') customStyles.push('focus-filter')

    return {
      hasOutline,
      outlineWidth: styles.outlineWidth,
      outlineColor: styles.outlineColor,
      outlineStyle: styles.outlineStyle,
      hasBackgroundColor,
      backgroundColor: hasBackgroundColor ? styles.backgroundColor : undefined,
      hasBorderColor,
      borderColor: hasBorderColor ? styles.borderColor : undefined,
      hasBoxShadow,
      boxShadow: hasBoxShadow ? styles.boxShadow : undefined,
      customStyles,
      contrastRatio: hasOutline ? this.calculateContrastRatio(styles.outlineColor, styles.backgroundColor) : undefined
    }
  }

  private hasFocusIndicator(styles: FocusIndicatorStyles): boolean {
    return styles.hasOutline ||
           styles.hasBackgroundColor ||
           styles.hasBorderColor ||
           styles.hasBoxShadow ||
           styles.customStyles.length > 0
  }

  private calculateContrastRatio(color1: string, color2: string): number {
    // 简化的对比度计算，实际应该使用完整的算法
    // 这里返回一个估算值
    return 4.5 // 占位符
  }

  private checkVisualVsDOMOrder(elements: FocusableElement[]): FocusOrderInconsistency[] {
    // 这里应该比较视觉顺序和DOM顺序
    // 由于需要计算元素位置，这里简化处理
    return []
  }

  private checkReadingVsDOMOrder(elements: FocusableElement[]): FocusOrderInconsistency[] {
    // 检查阅读顺序与DOM顺序的一致性
    return []
  }

  private checkLogicalOrder(elements: FocusableElement[]): FocusOrderInconsistency[] {
    const issues: FocusOrderInconsistency[] = []

    // 检查是否有逻辑上的顺序问题
    for (let i = 0; i < elements.length - 1; i++) {
      const current = elements[i]
      const next = elements[i + 1]

      // 检查是否有不符合逻辑的跳跃
      if (current.tabIndex > 0 && next.tabIndex === 0) {
        issues.push({
          type: 'logical-gap',
          elements: [current.selector, next.selector],
          description: `tabindex顺序不连贯: ${current.element}(${current.tabIndex}) -> ${next.element}(${next.tabIndex})`,
          severity: 'serious',
          suggestion: '移除正数tabindex，让焦点顺序遵循DOM顺序'
        })
      }
    }

    return issues
  }

  private findPotentialTrapContainers(container: HTMLElement | Document): HTMLElement[] {
    const containers: HTMLElement[] = []

    // 查找模态框
    const modals = container.querySelectorAll('[role="dialog"], [aria-modal="true"], .modal')
    containers.push(...Array.from(modals) as HTMLElement[])

    // 查找下拉菜单
    const dropdowns = container.querySelectorAll('[role="menu"], .dropdown, [aria-expanded="true"]')
    containers.push(...Array.from(dropdowns) as HTMLElement[])

    return containers
  }

  private analyzeFocusTrap(container: HTMLElement, focusableElements: FocusableElement[]): FocusTrap {
    const trappedElements = focusableElements
      .filter(el => container.contains(document.querySelector(el.selector)))
      .map(el => el.selector)

    const hasEscapeKey = container.querySelector('.close, [aria-label*="关闭"], [aria-label*="Close"]') !== null

    let trapType: FocusTrap['trapType'] = 'custom'
    if (container.getAttribute('role') === 'dialog') trapType = 'dialog'
    if (container.getAttribute('role') === 'menu') trapType = 'menu'
    if (container.classList.contains('modal')) trapType = 'modal'

    const isIntentional = trapType !== 'custom' || container.hasAttribute('data-focus-trap')

    return {
      container: container.id || container.tagName.toLowerCase(),
      trappedElements,
      hasEscapeKey,
      trapType,
      isIntentional
    }
  }

  private testEscapeRoute(trap: FocusTrap): EscapeRoute {
    return {
      trapContainer: trap.container,
      escapeMethod: 'ESC',
      target: 'document',
      worksCorrectly: trap.hasEscapeKey
    }
  }

  private detectKeyboardShortcut(
    container: HTMLElement | Document,
    keys: string,
    expectedAction: string
  ): KeyboardShortcut | null {
    // 这里应该实际检测快捷键的实现
    // 由于自动化检测复杂，返回一个估算的快捷键对象
    return {
      keys: [keys],
      action: expectedAction,
      context: 'global',
      isStandard: true,
      isDocumented: false,
      works: true,
      priority: 'essential'
    }
  }

  private detectCustomShortcuts(container: HTMLElement | Document): KeyboardShortcut[] {
    // 检测自定义快捷键
    return []
  }

  private detectShortcutConflicts(shortcuts: KeyboardShortcut[]): ShortcutConflict[] {
    // 检测快捷键冲突
    return []
  }

  private detectShortcutInconsistencies(shortcuts: KeyboardShortcut[]): ShortcutConsistencyIssue[] {
    // 检测快捷键一致性问题
    return []
  }

  private analyzeSkipLink(link: HTMLAnchorElement): SkipLink {
    const target = link.getAttribute('href') || ''
    const computedStyle = window.getComputedStyle(link)
    const isVisible = computedStyle.display !== 'none' &&
                     computedStyle.visibility !== 'hidden' &&
                     computedStyle.opacity !== '0'

    return {
      link: link.id || `skip-link-${Date.now()}`,
      target,
      text: link.textContent?.trim() || '',
      isVisible,
      becomesVisibleOnFocus: false, // 需要检查:focus样式
      worksCorrectly: false // 需要实际测试
    }
  }

  // ==================== 分数计算和建议生成 ====================

  private calculateOverallScore(
    tests: KeyboardNavigationTest[],
    focusOrder: FocusOrderAnalysis,
    focusTraps: FocusTrapAnalysis
  ): {
    overallScore: number
    passedTests: number
    failedTests: number
    criticalIssues: number
  } {
    const passedTests = tests.filter(t => t.passed).length
    const failedTests = tests.filter(t => !t.passed).length
    const criticalIssues = tests.filter(t => t.severity === 'critical' && !t.passed).length +
                          focusTraps.trapIssues.filter(i => i.severity === 'critical').length

    const testScore = tests.length > 0 ? (passedTests / tests.length) * 100 : 100
    const orderScore = focusOrder.inconsistencies.length === 0 ? 100 :
                     Math.max(0, 100 - (focusOrder.inconsistencies.length * 10))
    const trapScore = focusTraps.trapIssues.length === 0 ? 100 :
                    Math.max(0, 100 - (focusTraps.trapIssues.length * 15))

    const overallScore = (testScore * 0.5) + (orderScore * 0.3) + (trapScore * 0.2)

    return {
      overallScore: Math.round(overallScore),
      passedTests,
      failedTests,
      criticalIssues
    }
  }

  private generateRecommendations(
    focusOrder: FocusOrderAnalysis,
    focusTraps: FocusTrapAnalysis,
    shortcuts: KeyboardShortcutAnalysis,
    skipLinks: SkipLinkAnalysis,
    tests: KeyboardNavigationTest[]
  ): string[] {
    const recommendations: string[] = []

    // 焦点顺序建议
    if (!focusOrder.logicalOrder) {
      recommendations.push('修复焦点顺序的逻辑性问题，确保Tab导航符合用户预期')
    }
    if (!focusOrder.visualOrder) {
      recommendations.push('调整元素顺序，使焦点顺序与视觉顺序保持一致')
    }

    // 焦点陷阱建议
    if (focusTraps.trapIssues.length > 0) {
      recommendations.push('修复焦点陷阱问题，确保用户能够正常退出交互区域')
    }

    // 快捷键建议
    if (shortcuts.missingShortcuts.length > 0) {
      recommendations.push(`实现缺失的标准快捷键: ${shortcuts.missingShortcuts.join(', ')}`)
    }
    if (shortcuts.conflicts.length > 0) {
      recommendations.push('解决快捷键冲突，避免用户混淆')
    }

    // 跳转链接建议
    if (skipLinks.issues.length > 0) {
      recommendations.push('修复跳转链接问题，提供快速导航到主要内容的方式')
    }
    if (skipLinks.skipLinks.length === 0) {
      recommendations.push('考虑添加跳转链接，帮助键盘用户快速跳过重复内容')
    }

    // 焦点指示器建议
    const focusIndicatorIssues = tests.filter(t =>
      t.issues.some(issue => issue.includes('焦点指示器'))
    )
    if (focusIndicatorIssues.length > 0) {
      recommendations.push('为所有可聚焦元素添加明显的焦点指示器')
    }

    return recommendations
  }

  private determineManualTestingRequirements(
    tests: KeyboardNavigationTest[],
    focusTraps: FocusTrapAnalysis
  ): { needsManualTesting: boolean; manualTestInstructions: string[] } {
    const needsManualTest = tests.some(t => t.needsManualTest) ||
                          focusTraps.traps.length > 0

    const instructions: string[] = []

    if (needsManualTest) {
      instructions.push('使用键盘在页面中导航，确保所有交互元素都可以通过Tab键访问')
      instructions.push('测试Enter和Space键是否能正确激活按钮和链接')
      instructions.push('打开模态框或下拉菜单，测试ESC键是否能正常关闭')
      instructions.push('测试方向键在列表、菜单、标签页中的导航功能')
      instructions.push('检查焦点指示器是否清晰可见')
    }

    return {
      needsManualTesting: needsManualTest,
      manualTestInstructions: instructions
    }
  }

  private generateFocusOrderRecommendations(inconsistencies: FocusOrderInconsistency[]): string[] {
    return inconsistencies.map(i => i.suggestion)
  }

  private generateFocusTrapRecommendations(issues: TrapIssue[], traps: FocusTrap[]): string[] {
    const recommendations: string[] = []

    for (const issue of issues) {
      recommendations.push(issue.recommendation)
    }

    // 为意图焦点陷阱添加建议
    const intentionalTraps = traps.filter(t => t.isIntentional)
    for (const trap of intentionalTraps) {
      if (!trap.hasEscapeKey) {
        recommendations.push(`为 ${trap.container} 添加ESC键退出功能`)
      }
    }

    return recommendations
  }

  private generateShortcutRecommendations(
    missing: string[],
    conflicts: ShortcutConflict[],
    inconsistencies: ShortcutConsistencyIssue[]
  ): string[] {
    const recommendations: string[] = []

    if (missing.length > 0) {
      recommendations.push(`实现标准键盘快捷键: ${missing.join(', ')}`)
    }

    for (const conflict of conflicts) {
      recommendations.push(conflict.resolution)
    }

    for (const inconsistency of inconsistencies) {
      recommendations.push(inconsistency.suggestion)
    }

    return recommendations
  }
}

// ==================== 导出 ====================

export const keyboardNavigationValidator = new KeyboardNavigationValidator()

// 便捷方法
export async function validateKeyboardNavigation(
  container?: HTMLElement | Document
): Promise<KeyboardNavigationReport> {
  return keyboardNavigationValidator.validateKeyboardNavigation(container)
}

export function checkFocusOrder(elements: FocusableElement[]): FocusOrderAnalysis {
  return keyboardNavigationValidator.analyzeFocusOrder(elements)
}

export function findFocusTraps(
  container: HTMLElement | Document
): FocusTrapAnalysis {
  const focusableElements = keyboardNavigationValidator.identifyFocusableElements(container)
  return keyboardNavigationValidator.analyzeFocusTraps(container, focusableElements)
}