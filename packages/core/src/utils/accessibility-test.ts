/**
 * 可访问性测试配置和工具函数
 * 集成axe-core进行自动化可访问性检测
 */

import { axe, toHaveNoViolations } from 'jest-axe'
import { JSDOM } from 'jsdom'

// 扩展jest匹配器
expect.extend(toHaveNoViolations)

/**
 * 默认的axe配置
 * 针对组件库进行优化的规则配置
 */
export const defaultAxeConfig = {
  // 运行所有规则
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21aa']
  },
  // 禁用某些不适用于组件库的规则
  rules: {
    // 禁用html-has-lang，因为组件可能是页面的一部分
    'html-has-lang': { enabled: false },
    // 禁用landmark-one-main，因为组件可能有多个主要区域
    'landmark-one-main': { enabled: false },
    // 禁用page-has-heading-one，因为组件不保证有h1
    'page-has-heading-one': { enabled: false },
    // 禁用region，因为组件可能使用多个区域
    'region': { enabled: false }
  }
}

/**
 * 组件特定的axe配置
 */
export const componentAxeConfigs = {
  button: {
    ...defaultAxeConfig,
    rules: {
      ...defaultAxeConfig.rules,
      // 按钮必须有可访问的名称
      'button-name': { enabled: true },
      // 按钮不能仅依赖图标
      'image-alt': { enabled: true }
    }
  },

  input: {
    ...defaultAxeConfig,
    rules: {
      ...defaultAxeConfig.rules,
      // 输入框必须有标签
      'label': { enabled: true },
      // 输入框必须有名称
      'input-button-name': { enabled: true }
    }
  },

  modal: {
    ...defaultAxeConfig,
    rules: {
      ...defaultAxeConfig.rules,
      // 模态框必须有焦点管理
      'focus-trap': { enabled: true },
      // 模态框必须有ARIA属性
      'aria-modal': { enabled: true }
    }
  },

  navigation: {
    ...defaultAxeConfig,
    rules: {
      ...defaultAxeConfig.rules,
      // 导航链接必须有可访问的名称
      'link-name': { enabled: true },
      // 导航必须有正确的结构
      'nav-role': { enabled: true }
    }
  }
}

/**
 * 检查React组件的可访问性
 * @param container DOM容器
 * @param config axe配置
 * @returns Promise<axe.AxeResults>
 */
export const checkAccessibility = async (
  container: HTMLElement,
  config = defaultAxeConfig
) => {
  const results = await axe(container, config)
  return results
}

/**
 * 断言组件没有可访问性违规
 * @param container DOM容器
 * @param config axe配置
 */
export const expectNoAccessibilityViolations = async (
  container: HTMLElement,
  config = defaultAxeConfig
) => {
  const results = await checkAccessibility(container, config)
  expect(results).toHaveNoViolations()
}

/**
 * 创建用于测试的虚拟DOM
 * @param html HTML字符串
 * @returns Document对象
 */
export const createTestDOM = (html: string): Document => {
  const dom = new JSDOM(html)
  return dom.window.document
}

/**
 * 测试颜色对比度
 * @param foreground 前景色
 * @param background 背景色
 * @param fontSize 字体大小
 * @returns 对比度结果
 */
export const testColorContrast = (
  foreground: string,
  background: string,
  fontSize: number = 16
) => {
  // 这里会集成color-contrast-checker库
  // 暂时返回模拟数据
  return {
    ratio: 4.5,
    passesWCAG: {
      AA: fontSize >= 18 || fontSize >= 14 && fontWeight >= 700,
      AAA: fontSize >= 18 || fontSize >= 14 && fontWeight >= 700,
      AALarge: true,
      AAALarge: fontSize >= 18 || fontSize >= 14 && fontWeight >= 700
    }
  }
}

/**
 * 生成可访问性测试报告
 * @param results axe检测结果
 * @returns 格式化的报告字符串
 */
export const generateAccessibilityReport = (results: any): string => {
  if (results.violations.length === 0) {
    return '✅ 可访问性测试通过：未发现违规'
  }

  let report = `❌ 可访问性测试失败：发现 ${results.violations.length} 个违规\n\n`

  results.violations.forEach((violation: any, index: number) => {
    report += `${index + 1}. ${violation.help}\n`
    report += `   影响: ${violation.impact}\n`
    report += `   描述: ${violation.description}\n`

    if (violation.nodes && violation.nodes.length > 0) {
      report += `   问题元素: ${violation.nodes.length} 个\n`
      violation.nodes.forEach((node: any, nodeIndex: number) => {
        report += `     ${nodeIndex + 1}. ${node.html}\n`
      })
    }

    report += `   帮助链接: ${violation.helpUrl}\n\n`
  })

  return report
}

/**
 * 测试键盘导航
 * @param container DOM容器
 * @returns 键盘导航测试结果
 */
export const testKeyboardNavigation = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>

  const results = {
    focusableElementCount: focusableElements.length,
    hasTabIndexNegative: false,
    hasTabIndexZero: false,
    hasTabIndexPositive: false,
    allElementsHaveFocusStyles: true
  }

  focusableElements.forEach((element) => {
    const tabIndex = parseInt(element.getAttribute('tabindex') || '0')

    if (tabIndex < 0) results.hasTabIndexNegative = true
    else if (tabIndex === 0) results.hasTabIndexZero = true
    else if (tabIndex > 0) results.hasTabIndexPositive = true

    // 检查是否有焦点样式（简化检查）
    const computedStyle = window.getComputedStyle(element)
    const hasFocusStyle =
      computedStyle.outline !== 'none' ||
      computedStyle.outlineWidth !== '0px' ||
      element.hasAttribute('data-focus-visible')

    if (!hasFocusStyle) {
      results.allElementsHaveFocusStyles = false
    }
  })

  return results
}

/**
 * 测试ARIA标签的正确性
 * @param container DOM容器
 * @returns ARIA标签测试结果
 */
export const testAriaLabels = (container: HTMLElement) => {
  const results = {
    elementsWithoutAriaLabel: 0,
    elementsWithInvalidAria: 0,
    missingRequiredAria: [] as string[]
  }

  // 检查按钮
  const buttons = container.querySelectorAll('button') as NodeListOf<HTMLButtonElement>
  buttons.forEach(button => {
    const hasText = button.textContent?.trim().length > 0
    const hasAriaLabel = button.hasAttribute('aria-label')
    const hasAriaLabelledBy = button.hasAttribute('aria-labelledby')
    const hasTitle = button.hasAttribute('title')

    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
      results.elementsWithoutAriaLabel++
      results.missingRequiredAria.push('button')
    }
  })

  // 检查输入框
  const inputs = container.querySelectorAll('input') as NodeListOf<HTMLInputElement>
  inputs.forEach(input => {
    const hasLabel = container.querySelector(`label[for="${input.id}"]`)
    const hasAriaLabel = input.hasAttribute('aria-label')
    const hasAriaLabelledBy = input.hasAttribute('aria-labelledby')
    const hasTitle = input.hasAttribute('title')

    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
      results.elementsWithoutAriaLabel++
      results.missingRequiredAria.push('input')
    }
  })

  return results
}