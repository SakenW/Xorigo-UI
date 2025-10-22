/**
 * ClassName 工具函数 - 符合七轴主题系统 v1.4 SSOT
 *
 * 提供简洁的 className 合并功能，支持 Tailwind CSS 和动态类名
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 className 的工具函数
 *
 * @param inputs - 类名输入，可以是字符串、对象、数组等
 * @returns 合并后的 className 字符串
 *
 * @example
 * ```typescript
 * cn('px-2 py-1', 'bg-blue-500') // 'px-2 py-1 bg-blue-500'
 * cn('px-2 py-1', { 'bg-blue-500': true, 'text-white': false }) // 'px-2 py-1 bg-blue-500'
 * cn('px-2', condition && 'bg-blue-500') // 'px-2 bg-blue-500' (当 condition 为 true)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * 预设的 Tailwind CSS 类名工具
 */
export const cnPresets = {
  // 间距预设 - 使用七轴密度令牌
  spacing: {
    xs: 'p-2 m-1',
    sm: 'p-3 m-2',
    md: 'p-4 m-3',
    lg: 'p-6 m-4',
    xl: 'p-8 m-6',
  },

  // 尺寸预设 - 使用七轴密度令牌
  sizes: {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  },

  // 颜色预设 - 使用七轴主题令牌
  colors: {
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
    success: 'bg-success-500 text-white hover:bg-success-600',
    warning: 'bg-warning-500 text-white hover:bg-warning-600',
    danger: 'bg-danger-500 text-white hover:bg-danger-600',
    info: 'bg-info-500 text-white hover:bg-info-600',
  },

  // 状态预设
  states: {
    disabled: 'opacity-50 pointer-events-none',
    loading: 'pointer-events-none',
    active: 'ring-2 ring-offset-2',
    focus: 'focus:ring-2 focus:ring-offset-2',
  },

  // 动画预设 - 使用七轴动效令牌
  animations: {
    subtle: 'transition-all duration-200 ease-out',
    standard: 'transition-all duration-300 ease-out',
    expressive: 'transition-all duration-500 ease-out',
  }
} as const

/**
 * 带预设的 className 工具函数
 */
export const cnWith = {
  spacing: (variant: keyof typeof cnPresets.spacing, ...inputs: ClassValue[]) =>
    cn(cnPresets.spacing[variant], ...inputs),

  sizes: (variant: keyof typeof cnPresets.sizes, ...inputs: ClassValue[]) =>
    cn(cnPresets.sizes[variant], ...inputs),

  colors: (variant: keyof typeof cnPresets.colors, ...inputs: ClassValue[]) =>
    cn(cnPresets.colors[variant], ...inputs),

  states: (variant: keyof typeof cnPresets.states, ...inputs: ClassValue[]) =>
    cn(cnPresets.states[variant], ...inputs),

  animations: (variant: keyof typeof cnPresets.animations, ...inputs: ClassValue[]) =>
    cn(cnPresets.animations[variant], ...inputs),
}

/**
 * 主题感知的 className 工具函数
 *
 * @param theme - 七轴主题配置
 * @param inputs - 类名输入
 * @returns 根据主题优化的 className
 */
export function cnTheme(theme: any, ...inputs: ClassValue[]): string {
  // 根据七轴主题配置动态调整类名
  const themeClasses = []

  // 根据密度轴调整间距
  if (theme.density === 'compact') {
    themeClasses.push('p-2 m-1')
  } else if (theme.density === 'spacious') {
    themeClasses.push('p-6 m-4')
  } else {
    themeClasses.push('p-4 m-3')
  }

  // 根据动效轴调整动画
  if (theme.motion?.startsWith('subtle')) {
    themeClasses.push('transition-all duration-200 ease-out')
  } else if (theme.motion?.startsWith('expressive')) {
    themeClasses.push('transition-all duration-500 ease-out')
  } else {
    themeClasses.push('transition-all duration-300 ease-out')
  }

  return cn(themeClasses, ...inputs)
}

export default cn