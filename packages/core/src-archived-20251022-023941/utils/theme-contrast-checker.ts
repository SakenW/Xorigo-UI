/**
 * 主题颜色对比度检查工具
 * 检查Xorigo UI主题的可访问性合规性
 */

import { checkThemeContrast, generateContrastReport, getColorFromCSSVariable } from './color-contrast'

/**
 * 主题对比度检查配置
 */
export interface ThemeContrastConfig {
  // 基础文本对比度测试
  textContrasts: Array<{
    name: string
    foregroundVar: string
    backgroundVar: string
    fontSize?: number
    fontWeight?: number | string
  }>

  // 按钮对比度测试
  buttonContrasts: Array<{
    name: string
    variant: string
    state?: 'default' | 'hover' | 'disabled'
    fontSize?: number
    fontWeight?: number | string
  }>

  // 表单元素对比度测试
  formContrasts: Array<{
    name: string
    element: 'input' | 'label' | 'error' | 'helper'
    state?: 'default' | 'focus' | 'error' | 'disabled'
    fontSize?: number
  }>

  // 反馈组件对比度测试
  feedbackContrasts: Array<{
    name: string
    component: 'alert' | 'toast' | 'badge'
    variant?: 'info' | 'success' | 'warning' | 'error'
    fontSize?: number
  }>
}

/**
 * 默认的主题对比度检查配置
 */
export const defaultThemeContrastConfig: ThemeContrastConfig = {
  textContrasts: [
    {
      name: '主要文本',
      foregroundVar: '--text-primary',
      backgroundVar: '--bg-primary',
      fontSize: 16,
      fontWeight: 400
    },
    {
      name: '次要文本',
      foregroundVar: '--text-secondary',
      backgroundVar: '--bg-primary',
      fontSize: 14,
      fontWeight: 400
    },
    {
      name: '辅助文本',
      foregroundVar: '--text-tertiary',
      backgroundVar: '--bg-primary',
      fontSize: 12,
      fontWeight: 400
    },
    {
      name: '逆色文本',
      foregroundVar: '--text-inverse',
      backgroundVar: '--bg-primary-action',
      fontSize: 16,
      fontWeight: 500
    }
  ],

  buttonContrasts: [
    {
      name: '主要按钮',
      variant: 'primary',
      state: 'default',
      fontSize: 16,
      fontWeight: 500
    },
    {
      name: '主要按钮悬停',
      variant: 'primary',
      state: 'hover',
      fontSize: 16,
      fontWeight: 500
    },
    {
      name: '次要按钮',
      variant: 'secondary',
      state: 'default',
      fontSize: 16,
      fontWeight: 500
    },
    {
      name: '危险按钮',
      variant: 'danger',
      state: 'default',
      fontSize: 16,
      fontWeight: 500
    },
    {
      name: '幽灵按钮',
      variant: 'ghost',
      state: 'default',
      fontSize: 16,
      fontWeight: 500
    },
    {
      name: '链接按钮',
      variant: 'link',
      state: 'default',
      fontSize: 16,
      fontWeight: 400
    }
  ],

  formContrasts: [
    {
      name: '输入框文本',
      element: 'input',
      state: 'default',
      fontSize: 16
    },
    {
      name: '输入框占位符',
      element: 'input',
      state: 'disabled',
      fontSize: 16
    },
    {
      name: '表单标签',
      element: 'label',
      state: 'default',
      fontSize: 14,
      fontWeight: 500
    },
    {
      name: '错误信息',
      element: 'error',
      state: 'error',
      fontSize: 14
    },
    {
      name: '帮助文本',
      element: 'helper',
      state: 'default',
      fontSize: 12
    }
  ],

  feedbackContrasts: [
    {
      name: '信息提示',
      component: 'alert',
      variant: 'info',
      fontSize: 14
    },
    {
      name: '成功提示',
      component: 'alert',
      variant: 'success',
      fontSize: 14
    },
    {
      name: '警告提示',
      component: 'alert',
      variant: 'warning',
      fontSize: 14
    },
    {
      name: '错误提示',
      component: 'alert',
      variant: 'error',
      fontSize: 14
    },
    {
      name: '标签文本',
      component: 'badge',
      variant: 'default',
      fontSize: 12,
      fontWeight: 500
    }
  ]
}

/**
 * 按钮状态的颜色变量映射
 */
const buttonStateColorVars = {
  primary: {
    default: { fg: '--text-inverse', bg: '--bg-primary-action' },
    hover: { fg: '--text-inverse', bg: '--bg-primary-action-hover' },
    disabled: { fg: '--text-disabled', bg: '--bg-disabled' }
  },
  secondary: {
    default: { fg: '--text-primary', bg: '--bg-secondary' },
    hover: { fg: '--text-primary', bg: '--bg-tertiary' },
    disabled: { fg: '--text-disabled', bg: '--bg-disabled' }
  },
  danger: {
    default: { fg: '--text-inverse', bg: '--bg-error' },
    hover: { fg: '--text-inverse', bg: '--bg-error-hover' },
    disabled: { fg: '--text-disabled', bg: '--bg-disabled' }
  },
  ghost: {
    default: { fg: '--text-secondary', bg: '--bg-primary' },
    hover: { fg: '--text-primary', bg: '--bg-tertiary' },
    disabled: { fg: '--text-disabled', bg: '--bg-primary' }
  },
  link: {
    default: { fg: '--text-primary-action', bg: '--bg-primary' },
    hover: { fg: '--text-primary-action-hover', bg: '--bg-primary' },
    disabled: { fg: '--text-disabled', bg: '--bg-primary' }
  }
}

/**
 * 表单元素的颜色变量映射
 */
const formElementColorVars = {
  input: {
    default: { fg: '--text-primary', bg: '--bg-secondary' },
    focus: { fg: '--text-primary', bg: '--bg-secondary' },
    error: { fg: '--text-primary', bg: '--bg-secondary' },
    disabled: { fg: '--text-disabled', bg: '--bg-disabled' }
  },
  label: {
    default: { fg: '--text-secondary', bg: '--bg-primary' },
    focus: { fg: '--text-primary-action', bg: '--bg-primary' },
    error: { fg: '--text-error', bg: '--bg-primary' },
    disabled: { fg: '--text-disabled', bg: '--bg-primary' }
  },
  error: {
    default: { fg: '--text-error', bg: '--bg-primary' },
    error: { fg: '--text-error', bg: '--bg-primary' }
  },
  helper: {
    default: { fg: '--text-tertiary', bg: '--bg-primary' }
  }
}

/**
 * 反馈组件的颜色变量映射
 */
const feedbackComponentColorVars = {
  alert: {
    info: { fg: '--text-info', bg: '--bg-info' },
    success: { fg: '--text-success', bg: '--bg-success' },
    warning: { fg: '--text-warning', bg: '--bg-warning' },
    error: { fg: '--text-error', bg: '--bg-error' }
  },
  toast: {
    info: { fg: '--text-info', bg: '--bg-info' },
    success: { fg: '--text-success', bg: '--bg-success' },
    warning: { fg: '--text-warning', bg: '--bg-warning' },
    error: { fg: '--text-error', bg: '--bg-error' }
  },
  badge: {
    default: { fg: '--text-inverse', bg: '--bg-primary-action' },
    info: { fg: '--text-inverse', bg: '--bg-info' },
    success: { fg: '--text-inverse', bg: '--bg-success' },
    warning: { fg: '--text-inverse', bg: '--bg-warning' },
    error: { fg: '--text-inverse', bg: '--bg-error' }
  }
}

/**
 * 检查按钮对比度
 */
const checkButtonContrasts = (
  element: HTMLElement,
  config: ThemeContrastConfig['buttonContrasts']
) => {
  return config.map(test => {
    const colorVars = buttonStateColorVars[test.variant as keyof typeof buttonStateColorVars]
    const stateVars = colorVars[test.state as keyof typeof colorVars] || colorVars.default

    return {
      name: `${test.name}${test.state ? ` (${test.state})` : ''}`,
      foregroundVar: stateVars.fg,
      backgroundVar: stateVars.bg,
      fontSize: test.fontSize,
      fontWeight: test.fontWeight
    }
  })
}

/**
 * 检查表单元素对比度
 */
const checkFormContrasts = (
  element: HTMLElement,
  config: ThemeContrastConfig['formContrasts']
) => {
  return config.map(test => {
    const colorVars = formElementColorVars[test.element as keyof typeof formElementColorVars]
    const stateVars = colorVars[test.state as keyof typeof colorVars] || colorVars.default

    return {
      name: `${test.name}${test.state ? ` (${test.state})` : ''}`,
      foregroundVar: stateVars.fg,
      backgroundVar: stateVars.bg,
      fontSize: test.fontSize,
      fontWeight: test.fontWeight
    }
  })
}

/**
 * 检查反馈组件对比度
 */
const checkFeedbackContrasts = (
  element: HTMLElement,
  config: ThemeContrastConfig['feedbackContrasts']
) => {
  return config.map(test => {
    const colorVars = feedbackComponentColorVars[test.component as keyof typeof feedbackComponentColorVars]
    const variantVars = colorVars[test.variant as keyof typeof colorVars] || colorVars.default

    return {
      name: `${test.name}${test.variant ? ` (${test.variant})` : ''}`,
      foregroundVar: variantVars.fg,
      backgroundVar: variantVars.bg,
      fontSize: test.fontSize,
      fontWeight: test.fontWeight
    }
  })
}

/**
 * 完整的主题对比度检查
 * @param themeElement 主题根元素
 * @param config 检查配置
 * @returns 完整的对比度检查报告
 */
export const checkCompleteThemeContrast = (
  themeElement: HTMLElement,
  config: Partial<ThemeContrastConfig> = {}
) => {
  const finalConfig = {
    textContrasts: config.textContrasts || defaultThemeContrastConfig.textContrasts,
    buttonContrasts: config.buttonContrasts || defaultThemeContrastConfig.buttonContrasts,
    formContrasts: config.formContrasts || defaultThemeContrastConfig.formContrasts,
    feedbackContrasts: config.feedbackContrasts || defaultThemeContrastConfig.feedbackContrasts
  }

  const results = []

  // 检查文本对比度
  if (finalConfig.textContrasts.length > 0) {
    results.push(...checkThemeContrast(themeElement, finalConfig.textContrasts))
  }

  // 检查按钮对比度
  if (finalConfig.buttonContrasts.length > 0) {
    const buttonTests = checkButtonContrasts(themeElement, finalConfig.buttonContrasts)
    results.push(...checkThemeContrast(themeElement, buttonTests))
  }

  // 检查表单对比度
  if (finalConfig.formContrasts.length > 0) {
    const formTests = checkFormContrasts(themeElement, finalConfig.formContrasts)
    results.push(...checkThemeContrast(themeElement, formTests))
  }

  // 检查反馈组件对比度
  if (finalConfig.feedbackContrasts.length > 0) {
    const feedbackTests = checkFeedbackContrasts(themeElement, finalConfig.feedbackContrasts)
    results.push(...checkThemeContrast(themeElement, feedbackTests))
  }

  return {
    results,
    report: generateContrastReport(results),
    summary: {
      total: results.length,
      passed: results.filter(r => r.level !== 'FAIL').length,
      failed: results.filter(r => r.level === 'FAIL').length,
      aa: results.filter(r => r.level === 'AA').length,
      aaa: results.filter(r => r.level === 'AAA').length
    }
  }
}

/**
 * 在浏览器中检查当前主题对比度
 * @param themeSelector 主题根元素选择器
 * @param config 检查配置
 * @returns 对比度检查结果
 */
export const checkCurrentThemeContrast = (
  themeSelector: string = ':root',
  config?: Partial<ThemeContrastConfig>
) => {
  const themeElement = document.querySelector(themeSelector) as HTMLElement
  if (!themeElement) {
    throw new Error(`主题元素未找到: ${themeSelector}`)
  }

  return checkCompleteThemeContrast(themeElement, config)
}

/**
 * 生成主题改进建议
 * @param results 对比度检查结果
 * @returns 改进建议
 */
export const generateThemeImprovementSuggestions = (results: any[]) => {
  const suggestions = []
  const failedResults = results.filter(r => r.level === 'FAIL')

  if (failedResults.length === 0) {
    suggestions.push('🎉 所有颜色对比度都符合WCAG标准！')
    return suggestions
  }

  suggestions.push(`⚠️ 发现 ${failedResults.length} 个颜色对比度问题需要修复:\n`)

  // 按问题类型分组
  const grouped = failedResults.reduce((acc, result) => {
    const category = result.name.includes('按钮') ? '按钮' :
                   result.name.includes('输入') || result.name.includes('表单') ? '表单' :
                   result.name.includes('提示') || result.name.includes('标签') ? '反馈组件' :
                   '文本'
    acc[category] = acc[category] || []
    acc[category].push(result)
    return acc
  }, {} as Record<string, any[]>)

  Object.entries(grouped).forEach(([category, items]) => {
    suggestions.push(`\n### ${category} (${items.length}个问题):`)
    items.forEach(item => {
      suggestions.push(`- ${item.name}: 当前对比度 ${item.ratio}:1，建议至少达到4.5:1`)
    })
  })

  suggestions.push('\n### 通用改进建议:')
  suggestions.push('- 增加文本和背景的颜色差异')
  suggestions.push('- 考虑使用更大的字体或更粗的字重来降低对比度要求')
  suggestions.push('- 使用在线对比度检查工具验证颜色组合')
  suggestions.push('- 确保在所有主题变体中都符合标准')

  return suggestions
}