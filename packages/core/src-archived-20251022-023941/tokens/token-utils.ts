/**
 * Xorigo UI 令牌工具函数
 *
 * 提供设计令牌的使用工具和辅助函数
 */

import { cva, type VariantProps } from 'class-variance-authority'
import { designTokens, semanticTokens, componentTokens, type ThemeConfig } from './design-tokens'

// =============================================================================
// CVA 辅助函数
// =============================================================================

/**
 * 创建标准变体配置
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
  return cva(config.base || '', {
    variants: {
      // 统一尺寸变体
      size: config.size || {
        xs: "text-xs px-2 py-1",
        sm: "text-sm px-3 py-1.5",
        md: "text-base px-4 py-2",
        lg: "text-lg px-5 py-2.5",
        xl: "text-xl px-6 py-3",
      },
      // 统一颜色变体
      variant: config.variant || {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
        secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        neutral: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
      },
      // 统一状态变体
      state: config.state || {
        disabled: "opacity-50 cursor-not-allowed pointer-events-none",
        loading: "opacity-75 cursor-wait",
        error: "border-red-500 focus:ring-red-500",
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
 */
export const createComponentVariants = <T extends Record<string, Record<string, string>>>(
  componentName: keyof typeof componentTokens,
  config: {
    base?: string
    variants?: T
    defaultVariants?: Record<string, string>
  }
) => {
  const componentConfig = componentTokens[componentName]

  // 合并组件特定配置
  const mergedVariants = {
    size: {
      xs: `h-${componentConfig.height?.xs || 'xs'} px-${componentConfig.padding?.xs?.split(' ')[1] || '2'} py-${componentConfig.padding?.xs?.split(' ')[3] || '1'}`,
      sm: `h-${componentConfig.height?.sm || 'sm'} px-${componentConfig.padding?.sm?.split(' ')[1] || '3'} py-${componentConfig.padding?.sm?.split(' ')[3] || '1.5'}`,
      md: `h-${componentConfig.height?.md || 'md'} px-${componentConfig.padding?.md?.split(' ')[1] || '4'} py-${componentConfig.padding?.md?.split(' ')[3] || '2'}`,
      lg: `h-${componentConfig.height?.lg || 'lg'} px-${componentConfig.padding?.lg?.split(' ')[1] || '5'} py-${componentConfig.padding?.lg?.split(' ')[3] || '2.5'}`,
      xl: `h-${componentConfig.height?.xl || 'xl'} px-${componentConfig.padding?.xl?.split(' ')[1] || '6'} py-${componentConfig.padding?.xl?.split(' ')[3] || '3'}`,
      ...config.variants?.size,
    },
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
// 样式生成函数
// =============================================================================

/**
 * 生成间距样式类名
 */
export const spacing = (size: keyof typeof designTokens.spacing | string): string => {
  if (typeof size === 'string' && size in designTokens.spacing) {
    return `p-${size}`
  }

  // 处理复杂间距，如 'mx-4'
  const match = size.match(/^([xytrbl])-?(\d+\.?\d*)$/)
  if (match) {
    const [, direction, value] = match
    const unit = direction ? `${direction}-${value}` : value
    return unit
  }

  return size
}

/**
 * 生成尺寸样式类名
 */
export const size = (size: keyof typeof designTokens.sizes.height | string): string => {
  if (typeof size === 'string' && size in designTokens.sizes.height) {
    return `h-${size}`
  }
  return size
}

/**
 * 生成圆角样式类名
 */
export const borderRadius = (size: keyof typeof designTokens.sizes.borderRadius | string): string => {
  if (typeof size === 'string' && size in designTokens.sizes.borderRadius) {
    return `rounded-${size === 'DEFAULT' ? '' : size}`
  }
  return size
}

/**
 * 生成字体大小样式类名
 */
export const fontSize = (size: keyof typeof designTokens.typography.fontSize | string): string => {
  if (typeof size === 'string' && size in designTokens.typography.fontSize) {
    return `text-${size}`
  }
  return size
}

/**
 * 生成颜色样式类名
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
// 响应式工具
// =============================================================================

/**
 * 生成响应式样式类名
 */
export const responsive = (
  values: Record<string, any>,
  property: string
): string => {
  const breakpoints = designTokens.breakpoints
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
// =============================================================================

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
 * 生成交互状态样式类名
 */
export const interactive = (variant: 'primary' | 'secondary' | 'ghost' = 'primary'): string => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  }

  return variants[variant]
}

// =============================================================================
// 主题工具
// =============================================================================

/**
 * 应用主题到CSS变量
 */
export const applyTheme = (theme: ThemeConfig): void => {
  const root = document.documentElement

  Object.entries(theme.colors).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
}

/**
 * 获取当前主题
 */
export const getCurrentTheme = (): ThemeConfig => {
  const root = document.documentElement
  const computedStyle = getComputedStyle(root)

  const colors: Record<string, string> = {}
  Object.entries(semanticTokens).forEach(([category, tokens]) => {
    Object.entries(tokens).forEach(([name, token]) => {
      const property = token.replace('var(', '').replace(')', '')
      const value = computedStyle.getPropertyValue(property)
      if (value) {
        colors[`${category}.${name}`] = value.trim()
      }
    })
  })

  return {
    name: 'current',
    colors,
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
// =============================================================================

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
// =============================================================================

/**
 * 标准组件 Props 类型
 */
export interface StandardComponentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'
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
// =============================================================================

export const tokens = {
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