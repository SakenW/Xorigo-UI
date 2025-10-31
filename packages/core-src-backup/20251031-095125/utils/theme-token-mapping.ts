/**
 * Xorigo UI 主题令牌映射系统
 *
 * 将硬编码的 Tailwind CSS 类名映射到 Xorigo UI 的主题令牌
 * 确保组件能够正确响应七轴主题系统的变化
 */

// =============================================================================
// 颜色令牌映射表
// =============================================================================

/**
 * 主色调映射
 * 将蓝色的各种变体映射到主题主色调
 */
export const primaryColorMap = {
  // 背景色
  'bg-blue-50': 'bg-primary-50',
  'bg-blue-100': 'bg-primary-100',
  'bg-blue-200': 'bg-primary-200',
  'bg-blue-300': 'bg-primary-300',
  'bg-blue-400': 'bg-primary-400',
  'bg-blue-500': 'bg-primary-500',
  'bg-blue-600': 'bg-primary-600',
  'bg-blue-700': 'bg-primary-700',
  'bg-blue-800': 'bg-primary-800',
  'bg-blue-900': 'bg-primary-900',
  'bg-blue-950': 'bg-primary-950',

  // 文本色
  'text-blue-50': 'text-primary-50',
  'text-blue-100': 'text-primary-100',
  'text-blue-200': 'text-primary-200',
  'text-blue-300': 'text-primary-300',
  'text-blue-400': 'text-primary-400',
  'text-blue-500': 'text-primary-500',
  'text-blue-600': 'text-primary-600',
  'text-blue-700': 'text-primary-700',
  'text-blue-800': 'text-primary-800',
  'text-blue-900': 'text-primary-900',
  'text-blue-950': 'text-primary-950',

  // 边框色
  'border-blue-50': 'border-primary-50',
  'border-blue-100': 'border-primary-100',
  'border-blue-200': 'border-primary-200',
  'border-blue-300': 'border-primary-300',
  'border-blue-400': 'border-primary-400',
  'border-blue-500': 'border-primary-500',
  'border-blue-600': 'border-primary-600',
  'border-blue-700': 'border-primary-700',
  'border-blue-800': 'border-primary-800',
  'border-blue-900': 'border-primary-900',
  'border-blue-950': 'border-primary-950',

  // ring 效果
  'ring-blue-500': 'ring-primary-500',
  'ring-blue-600': 'ring-primary-600',
  'ring-offset-blue-500': 'ring-offset-primary-500',
} as const

/**
 * 中性色调映射
 * 将灰色系列映射到主题背景和文本色
 */
export const neutralColorMap = {
  // 背景色
  'bg-gray-50': 'bg-background-primary',
  'bg-gray-100': 'bg-background-secondary',
  'bg-gray-200': 'bg-background-tertiary',
  'bg-slate-50': 'bg-background-primary',
  'bg-slate-100': 'bg-background-secondary',
  'bg-white': 'bg-background-primary',
  'bg-black': 'bg-background-inverse',

  // 文本色
  'text-gray-50': 'text-text-tertiary',
  'text-gray-100': 'text-text-tertiary',
  'text-gray-200': 'text-text-secondary',
  'text-gray-300': 'text-text-secondary',
  'text-gray-400': 'text-text-tertiary',
  'text-gray-500': 'text-text-tertiary',
  'text-gray-600': 'text-text-secondary',
  'text-gray-700': 'text-text-secondary',
  'text-gray-800': 'text-text-primary',
  'text-gray-900': 'text-text-primary',
  'text-gray-950': 'text-text-primary',
  'text-slate-900': 'text-text-primary',
  'text-slate-700': 'text-text-secondary',
  'text-slate-600': 'text-text-secondary',
  'text-slate-500': 'text-text-tertiary',
  'text-white': 'text-text-on-primary',
  'text-black': 'text-text-inverse',

  // 边框色
  'border-gray-200': 'border-border-base',
  'border-gray-300': 'border-border-base',
  'border-gray-400': 'border-border-subtle',
  'border-gray-500': 'border-border-subtle',
  'border-gray-600': 'border-border-emphasis',
  'border-gray-700': 'border-border-emphasis',
  'border-slate-200': 'border-border-base',
  'border-slate-300': 'border-border-base',

  // divide 效果
  'divide-gray-200': 'divide-border-base',
  'divide-gray-300': 'divide-border-base',
} as const

/**
 * 状态颜色映射
 * 将语义化颜色映射到主题状态色
 */
export const statusColorMap = {
  // 成功状态 (绿色)
  'bg-green-50': 'bg-success-50',
  'bg-green-100': 'bg-success-100',
  'bg-green-500': 'bg-success-500',
  'bg-green-600': 'bg-success-600',
  'bg-green-700': 'bg-success-700',
  'text-green-600': 'text-success-600',
  'text-green-700': 'text-success-700',
  'text-green-800': 'text-success-800',
  'text-green-900': 'text-success-900',
  'border-green-500': 'border-success-500',
  'border-green-600': 'border-success-600',
  'ring-green-500': 'ring-success-500',

  // 错误状态 (红色)
  'bg-red-50': 'bg-error-50',
  'bg-red-100': 'bg-error-100',
  'bg-red-500': 'bg-error-500',
  'bg-red-600': 'bg-error-600',
  'bg-red-700': 'bg-error-700',
  'text-red-500': 'text-error-500',
  'text-red-600': 'text-error-600',
  'text-red-700': 'text-error-700',
  'text-red-800': 'text-error-800',
  'text-red-900': 'text-error-900',
  'border-red-500': 'border-error-500',
  'border-red-600': 'border-error-600',
  'ring-red-500': 'ring-error-500',

  // 警告状态 (黄色/橙色)
  'bg-yellow-50': 'bg-warning-50',
  'bg-yellow-100': 'bg-warning-100',
  'bg-yellow-500': 'bg-warning-500',
  'bg-yellow-600': 'bg-warning-600',
  'bg-orange-500': 'bg-warning-500',
  'bg-orange-600': 'bg-warning-600',
  'text-yellow-600': 'text-warning-600',
  'text-yellow-700': 'text-warning-700',
  'text-yellow-800': 'text-warning-800',
  'text-orange-600': 'text-warning-600',
  'text-orange-700': 'text-warning-700',
  'text-orange-800': 'text-warning-800',
  'border-yellow-500': 'border-warning-500',
  'border-yellow-600': 'border-warning-600',
  'border-orange-500': 'border-warning-500',
  'border-orange-600': 'border-warning-600',
  'ring-yellow-500': 'ring-warning-500',
  'ring-orange-500': 'ring-warning-500',

  // 信息状态 (蓝色/青色)
  'bg-cyan-50': 'bg-info-50',
  'bg-cyan-100': 'bg-info-100',
  'bg-cyan-500': 'bg-info-500',
  'bg-cyan-600': 'bg-info-600',
  'bg-indigo-50': 'bg-info-50',
  'bg-indigo-100': 'bg-info-100',
  'bg-indigo-500': 'bg-info-500',
  'bg-indigo-600': 'bg-info-600',
  'text-cyan-600': 'text-info-600',
  'text-cyan-700': 'text-info-700',
  'text-indigo-600': 'text-info-600',
  'text-indigo-700': 'text-info-700',
  'border-cyan-500': 'border-info-500',
  'border-cyan-600': 'border-info-600',
  'border-indigo-500': 'border-info-500',
  'border-indigo-600': 'border-info-600',
  'ring-cyan-500': 'ring-info-500',
  'ring-indigo-500': 'ring-info-500',
} as const

/**
 * 次要色调映射
 * 用于次要按钮、卡片等元素
 */
export const secondaryColorMap = {
  'bg-purple-50': 'bg-secondary-50',
  'bg-purple-100': 'bg-secondary-100',
  'bg-purple-500': 'bg-secondary-500',
  'bg-purple-600': 'bg-secondary-600',
  'bg-purple-700': 'bg-secondary-700',
  'bg-pink-50': 'bg-accent-50',
  'bg-pink-100': 'bg-accent-100',
  'bg-pink-500': 'bg-accent-500',
  'bg-pink-600': 'bg-accent-600',
  'text-purple-600': 'text-secondary-600',
  'text-purple-700': 'text-secondary-700',
  'text-pink-600': 'text-accent-600',
  'text-pink-700': 'text-accent-700',
  'border-purple-500': 'border-secondary-500',
  'border-purple-600': 'border-secondary-600',
  'border-pink-500': 'border-accent-500',
  'border-pink-600': 'border-accent-600',
} as const

// =============================================================================
// 完整映射表
// =============================================================================

/**
 * 完整的颜色令牌映射表
 * 合并所有颜色类别的映射
 */
export const colorTokenMap = {
  ...primaryColorMap,
  ...neutralColorMap,
  ...statusColorMap,
  ...secondaryColorMap,
} as const

// =============================================================================
// 特殊效果映射
// =============================================================================

/**
 * 阴影效果映射
 */
export const shadowMap = {
  'shadow-sm': 'shadow-subtle',
  'shadow-md': 'shadow-base',
  'shadow-lg': 'shadow-elevated',
  'shadow-xl': 'shadow-floating',
  'shadow-2xl': 'shadow-dramatic',
  'shadow-inner': 'shadow-inset',
} as const

/**
 * 背景效果映射
 */
export const backgroundMap = {
  'bg-opacity-50': 'bg-surface-50',
  'bg-opacity-75': 'bg-surface-75',
  'bg-opacity-90': 'bg-surface-90',
  'bg-opacity-95': 'bg-surface-95',
  'backdrop-blur-sm': 'backdrop-blur-subtle',
  'backdrop-blur-md': 'backdrop-blur-base',
  'backdrop-blur-lg': 'backdrop-blur-strong',
} as const

// =============================================================================
// 完整工具映射表
// =============================================================================

/**
 * 完整的主题令牌映射表
 * 包含所有类别的映射
 */
export const completeThemeTokenMap = {
  ...colorTokenMap,
  ...shadowMap,
  ...backgroundMap,
} as const

// =============================================================================
// 工具函数
// =============================================================================

/**
 * 检查是否为主题相关的类名
 */
export function isThemeRelated(className: string): boolean {
  const prefixes = ['bg-', 'text-', 'border-', 'ring-', 'divide-', 'shadow-', 'backdrop-']
  return prefixes.some(prefix => className.startsWith(prefix))
}

/**
 * 映射单个类名到主题令牌
 */
export function mapClassName(className: string): string {
  return completeThemeTokenMap[className as keyof typeof completeThemeTokenMap] || className
}

/**
 * 批量映射类名到主题令牌
 */
export function mapClassNames(classNames: string[]): string[] {
  return classNames.map(className => mapClassName(className))
}

/**
 * 处理 className 字符串，将主题相关的类名映射为令牌
 */
export function processThemeClasses(classString: string): string {
  if (!classString) return classString

  const classes = classString.split(/\s+/).filter(Boolean)
  const mappedClasses = classes.map(className => {
    if (isThemeRelated(className)) {
      return mapClassName(className)
    }
    return className
  })

  return mappedClasses.join(' ')
}

/**
 * 获取映射统计信息
 */
export function getMappingStats(inputClasses: string[]) {
  const totalClasses = inputClasses.length
  const themeRelatedClasses = inputClasses.filter(isThemeRelated)
  const mappedClasses = themeRelatedClasses.filter(cls =>
    completeThemeTokenMap[cls as keyof typeof completeThemeTokenMap]
  )
  const unmappedClasses = themeRelatedClasses.filter(cls =>
    !completeThemeTokenMap[cls as keyof typeof completeThemeTokenMap]
  )

  return {
    total: totalClasses,
    themeRelated: themeRelatedClasses.length,
    mapped: mappedClasses.length,
    unmapped: unmappedClasses.length,
    mappingRate: totalClasses > 0 ? (mappedClasses.length / totalClasses) * 100 : 0,
    unmappedClasses
  }
}

// =============================================================================
// 类型定义
// =============================================================================

export type ThemeTokenMap = typeof completeThemeTokenMap
export type ColorTokenMap = typeof colorTokenMap
export type StatusColorMap = typeof statusColorMap
export type PrimaryColorMap = typeof primaryColorMap
export type NeutralColorMap = typeof neutralColorMap
export type SecondaryColorMap = typeof secondaryColorMap
export type ShadowMap = typeof shadowMap
export type BackgroundMap = typeof backgroundMap

export interface MappingStats {
  total: number
  themeRelated: number
  mapped: number
  unmapped: number
  mappingRate: number
  unmappedClasses: string[]
}

// =============================================================================
// 导出
// =============================================================================

export default {
  colorTokenMap,
  completeThemeTokenMap,
  isThemeRelated,
  mapClassName,
  mapClassNames,
  processThemeClasses,
  getMappingStats,
  primaryColorMap,
  neutralColorMap,
  statusColorMap,
  secondaryColorMap,
  shadowMap,
  backgroundMap,
}