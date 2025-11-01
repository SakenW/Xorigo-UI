/**
 * 🛠️ 组件实用工具函数 (从 v1.1 迁移)
 *
 * 提供CVA辅助函数、样式生成函数和响应式工具
 * 兼容新版本令牌系统，提供实用的开发工具
 */

import { cva } from 'class-variance-authority'
import { getCoreTokens } from './token-accessors'

// =============================================================================
// CVA 辅助函数
// ============================================================================

/**
 * 创建标准变体配置
 * 基于新令牌系统重新实现
 */
export const createStandardVariants = (config: {
  base?: string
  size?: Record<string, string>
  variant?: Record<string, string>
  state?: Record<string, string>
  defaultVariants?: {
    size?: string
    variant?: string
  }
}) => {
  const coreTokens = getCoreTokens()

  return cva(config.base || '', {
    variants: {
      // 统一尺寸变体 (基于新令牌系统)
      size: config.size || {
        xs: "text-xs px-2 py-1",
        sm: "text-sm px-3 py-1.5",
        md: "text-base px-4 py-2",
        lg: "text-lg px-5 py-2.5",
        xl: "text-xl px-6 py-3",
      },
      // 统一颜色变体 (基于新令牌系统)
      variant: config.variant || {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
        secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        neutral: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
        outline: "border-2 border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-primary-500",
        ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
      },
      // 统一状态变体
      state: config.state || {
        disabled: "opacity-50 cursor-not-allowed pointer-events-none",
        loading: "opacity-75 cursor-wait",
        error: "border-red-500 focus:ring-red-500",
        focused: "ring-2 ring-primary-500 border-primary-500",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
      ...config.defaultVariants,
    },
  })
}

/**
 * 创建组件特定的变体配置
 * 使用新令牌系统的组件别名
 */
export const createComponentVariants = <T extends Record<string, Record<string, string>>>(
  componentName: string,
  config: {
    base?: string
    variants?: T
    defaultVariants?: Record<string, string>
  }
) => {
  // 基于新令牌系统获取组件配置
  const coreTokens = getCoreTokens()
  const foundations = coreTokens.foundations

  // 创建基于令牌的尺寸变体
  const tokenBasedSizes = {
    xs: `text-xs px-2 py-1`,
    sm: `text-sm px-3 py-1.5`,
    md: `text-base px-4 py-2`,
    lg: `text-lg px-5 py-2.5`,
    xl: `text-xl px-6 py-3`,
  }

  // 合并组件特定配置
  const mergedVariants = {
    size: tokenBasedSizes,
    ...config.variants,
  }

  return cva(config.base || '', {
    variants: mergedVariants,
    defaultVariants: {
      size: 'md',
      ...config.defaultVariants,
    },
  })
}

// =============================================================================
// 样式生成函数 (基于新令牌系统)
// ============================================================================

/**
 * 生成间距样式类名
 */
export const spacing = (size: string): string => {
  const coreTokens = getCoreTokens()

  if (typeof size === 'string' && size in coreTokens.foundations.spacing) {
    return `p-${size}`
  }

  // 处理复杂间距，如 'mx-4'
  const match = size.match(/^([xytrbl])-?(\d+\.?\d*)$/)
  if (match) {
    const [, direction, value] = match
    return direction ? `${direction}-${value}` : value
  }

  return size
}

/**
 * 生成尺寸样式类名
 */
export const size = (value: string): string => {
  const coreTokens = getCoreTokens()
  const spacingValues = coreTokens.foundations.spacing

  if (typeof value === 'string' && value in spacingValues) {
    return `w-${value} h-${value}`
  }
  return value
}

/**
 * 生成圆角样式类名
 */
export const borderRadius = (size: string): string => {
  const coreTokens = getCoreTokens()

  if (typeof size === 'string' && size in coreTokens.foundations.borderRadius) {
    return `rounded-${size === 'base' ? '' : size}`
  }
  return size
}

/**
 * 生成字体大小样式类名
 */
export const fontSize = (size: string): string => {
  const coreTokens = getCoreTokens()

  if (typeof size === 'string' && size in coreTokens.foundations.typography.fontSize) {
    return `text-${size}`
  }
  return size
}

/**
 * 生成颜色样式类名 (支持新令牌系统的颜色)
 */
export const color = (colorName: string, shade?: number | string): string => {
  if (shade) {
    return `text-${colorName}-${shade}`
  }
  return `text-${colorName}`
}

/**
 * 生成背景颜色样式类名
 */
export const backgroundColor = (colorName: string, shade?: number | string): string => {
  if (shade) {
    return `bg-${colorName}-${shade}`
  }
  return `bg-${colorName}`
}

/**
 * 生成边框颜色样式类名
 */
export const borderColor = (colorName: string, shade?: number | string): string => {
  if (shade) {
    return `border-${colorName}-${shade}`
  }
  return `border-${colorName}`
}

// =============================================================================
// 响应式工具 (基于新令牌系统)
// ============================================================================

// 标准断点定义
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

/**
 * 生成响应式样式类名
 */
export const responsive = (
  values: Record<string, any>,
  property: string
): string => {
  const classes: string[] = []

  // 默认值（移动端）
  if (values.default) {
    classes.push(`${property}-${values.default}`)
  }

  // 响应式值
  Object.entries(breakpoints).forEach(([breakpoint, _width]) => {
    if (values[breakpoint]) {
      classes.push(`${breakpoint}:${property}-${values[breakpoint]}`)
    }
  })

  return classes.join(' ')
}

/**
 * 生成响应式间距
 */
export const responsiveSpacing = (values: {
  default?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
}): string => responsive(values, 'p')

/**
 * 生成响应式字体大小
 */
export const responsiveFontSize = (values: {
  default?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
}): string => responsive(values, 'text')

// =============================================================================
// 状态工具
// ============================================================================

/**
 * 生成状态样式类名
 */
export const state = (states: {
  disabled?: boolean
  loading?: boolean
  error?: boolean
  focus?: boolean
  hover?: boolean
}): string => {
  const classes: string[] = []

  if (states.disabled) {
    classes.push('opacity-50 cursor-not-allowed pointer-events-none')
  }

  if (states.loading) {
    classes.push('opacity-75 cursor-wait')
  }

  if (states.error) {
    classes.push('border-red-500 focus:ring-red-500')
  }

  if (states.focus) {
    classes.push('focus:outline-none focus:ring-2 focus:ring-primary-500')
  }

  if (states.hover) {
    classes.push('hover:bg-gray-100')
  }

  return classes.join(' ')
}

/**
 * 生成交互状态样式类名 (更新为包含更多变体)
 */
export const interactive = (variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' = 'primary'): string => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }

  return variants[variant]
}

// =============================================================================
// 主题工具 (兼容新令牌系统)
// ============================================================================

/**
 * 应用主题到CSS变量 (兼容新令牌系统)
 */
export const applyTheme = (theme: Record<string, any>): void => {
  const root = document.documentElement

  Object.entries(theme).forEach(([property, value]) => {
    root.style.setProperty(property, String(value))
  })
}

/**
 * 获取当前主题
 */
export const getCurrentTheme = (): Record<string, any> => {
  const root = document.documentElement
  const computedStyle = getComputedStyle(root)

  const theme: Record<string, string> = {}

  // 从CSS变量中读取当前主题值
  const cssVariables = Array.from(document.styleSheets)
    .flatMap(sheet => {
      try {
        return Array.from(sheet.cssRules || [])
      } catch (e) {
        return []
      }
    })
    .filter(rule => rule instanceof CSSStyleRule)
    .map(rule => (rule as CSSStyleRule).selectorText)
    .filter(selector => selector.startsWith(':root'))
    .length > 0

  if (cssVariables) {
    // 读取所有CSS变量
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i]
        for (let j = 0; j < sheet.cssRules.length; j++) {
          const rule = sheet.cssRules[j]
          if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
            const cssText = rule.style.cssText
            const variables = cssText.split(';').filter(v => v.trim().startsWith('--'))
            variables.forEach(v => {
              const [property, value] = v.split(':').map(s => s.trim())
              if (property && value) {
                const computedValue = computedStyle.getPropertyValue(property)
                if (computedValue) {
                  theme[property] = computedValue.trim()
                }
              }
            })
          }
        }
      } catch (e) {
        // 跨域样式表可能无法访问，忽略错误
      }
    }
  }

  return {
    name: 'current',
    colors: theme,
    darkMode: root.classList.contains('dark'),
  }
}

/**
 * 切换暗色模式
 */
export const toggleDarkMode = (enable?: boolean): void => {
  const root = document.documentElement

  if (enable === undefined) {
    root.classList.toggle('dark')
  } else {
    root.classList.toggle('dark', enable)
  }
}

/**
 * 检测系统主题偏好
 */
export const detectSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

// =============================================================================
// 调试工具
// ============================================================================

/**
 * 生成调试边框
 */
export const debugBorder = (color: string = 'red'): string => {
  return `border-2 border-${color}-500`
}

/**
 * 生成调试背景
 */
export const debugBackground = (color: string = 'yellow'): string => {
  return `bg-${color}-100`
}

/**
 * 生成调试信息标签
 */
export const debugLabel = (label: string): string => {
  return `before:content-['${label}'] before:absolute before:top-0 before:left-0 before:bg-red-500 before:text-white before:text-xs before:px-1 before:rounded relative`
}

// =============================================================================
// 类型辅助
// ============================================================================

/**
 * 标准组件 Props 类型 (更新为包含更多选项)
 */
export interface StandardComponentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline' | 'ghost'
  disabled?: boolean
  loading?: boolean
  error?: boolean
  className?: string
  testId?: string
  'data-testid'?: string
  'data-component'?: string
}

/**
 * 生成测试属性
 */
export const generateTestProps = (
  componentName: string,
  props?: {
    variant?: string
    size?: string
    state?: string
    testId?: string
  }
) => {
  return {
    'data-testid': props?.testId || `${componentName}-test-id`,
    'data-component': componentName,
    'data-variant': props?.variant,
    'data-size': props?.size,
    'data-state': props?.state || 'normal',
  }
}

// =============================================================================
// 导出常用组合
// ============================================================================

export const componentUtils = {
  // 基础样式工具
  spacing,
  size,
  borderRadius,
  fontSize,
  color,
  backgroundColor,
  borderColor,

  // 响应式工具
  responsive,
  responsiveSpacing,
  responsiveFontSize,

  // 状态工具
  state,
  interactive,

  // 主题工具
  applyTheme,
  getCurrentTheme,
  toggleDarkMode,
  detectSystemTheme,

  // 调试工具
  debugBorder,
  debugBackground,
  debugLabel,

  // 类型工具
  generateTestProps,

  // CVA 工具
  createStandardVariants,
  createComponentVariants,
}

// 默认导出
export default componentUtils