/**
 * 🎨 CSS变量映射系统
 *
 * 将DTCG令牌转换为CSS变量，支持主题切换
 */

import neutralScaleData from './core/palettes/neutralScale.json'
import blueScaleData from './core/palettes/blueScale.json'
import cyanScaleData from './core/palettes/cyanScale.json'
import purpleScaleData from './core/palettes/purpleScale.json'
import stateColorsData from './core/palettes/stateColors.json'
import typographyData from './core/foundations/typography.json'
import spacingData from './core/foundations/spacing.json'

/**
 * 语义化颜色令牌映射
 */
export const semanticColors = {
  // 主要色系
  primary: {
    50: 'var(--color-primary-50)',
    100: 'var(--color-primary-100)',
    200: 'var(--color-primary-200)',
    300: 'var(--color-primary-300)',
    400: 'var(--color-primary-400)',
    500: 'var(--color-primary-500)',
    600: 'var(--color-primary-600)',
    700: 'var(--color-primary-700)',
    800: 'var(--color-primary-800)',
    900: 'var(--color-primary-900)',
    950: 'var(--color-primary-950)',
  },

  // 次要色系
  secondary: {
    50: 'var(--color-secondary-50)',
    100: 'var(--color-secondary-100)',
    200: 'var(--color-secondary-200)',
    300: 'var(--color-secondary-300)',
    400: 'var(--color-secondary-400)',
    500: 'var(--color-secondary-500)',
    600: 'var(--color-secondary-600)',
    700: 'var(--color-700)',
    800: 'var(--color-800)',
    900: 'var(--color-900)',
    950: 'var(--color-950)',
  },

  // 成功色系
  success: {
    50: 'var(--color-success-50)',
    100: 'var(--color-success-100)',
    200: 'var(--color-success-200)',
    300: 'var(--color-success-300)',
    400: 'var(--color-success-400)',
    500: 'var(--color-success-500)',
    600: 'var(--color-success-600)',
    700: 'var(--color-success-700)',
    800: 'var(--color-success-800)',
    900: 'var(--color-success-900)',
    950: 'var(--color-950)',
  },

  // 警告色系
  warning: {
    50: 'var(--color-warning-50)',
    100: 'var(--color-warning-100)',
    200: 'var(--color-warning-200)',
    300: 'var(--color-warning-300)',
    400: 'var(--color-warning-400)',
    500: 'var(--color-warning-500)',
    600: 'var(--color-warning-600)',
    700: 'var(--color-warning-700)',
    800: 'var(--color-warning-800)',
    900: 'var(--color-warning-900)',
    950: 'var(--color-950)',
  },

  // 错误色系
  error: {
    50: 'var(--color-error-50)',
    100: 'var(--color-error-100)',
    200: 'var(--color-error-200)',
    300: 'var(--color-error-300)',
    400: 'var(--color-error-400)',
    500: 'var(--color-error-500)',
    600: 'var(--color-error-600)',
    700: 'var(--color-error-700)',
    800: 'var(--color-error-800)',
    900: 'var(--color-error-900)',
    950: 'var(--color-950)',
  },

  // 信息色系
  info: {
    50: 'var(--color-info-50)',
    100: 'var(--color-info-100)',
    200: 'var(--color-info-200)',
    300: 'var(--color-info-300)',
    400: 'var(--color-info-400)',
    500: 'var(--color-info-500)',
    600: 'var(--color-info-600)',
    700: 'var(--color-info-700)',
    800: 'var(--color-info-800)',
    900: 'var(--color-info-900)',
    950: 'var(--color-950)',
  },

  // 中性色系
  neutral: {
    50: 'var(--color-neutral-50)',
    100: 'var(--color-neutral-100)',
    200: 'var(--color-neutral-200)',
    300: 'var(--color-neutral-300)',
    400: 'var(--color-neutral-400)',
    500: 'var(--color-neutral-500)',
    600: 'var(--color-neutral-600)',
    700: 'var(--color-neutral-700)',
    800: 'var(--color-neutral-800)',
    900: 'var(--color-900)',
    950: 'var(--color-950)',
  },

  // 对比色系
  contrast: {
    50: 'var(--color-contrast-50)',
    100: 'var(--color-contrast-100)',
    200: 'var(--color-contrast-200)',
    300: 'var(--color-contrast-300)',
    400: 'var(--color-contrast-400)',
    500: 'var(--color-contrast-500)',
    600: 'var(--color-contrast-600)',
    700: 'var(--color-contrast-700)',
    800: 'var(--color-contrast-800)',
    900: 'var(--color-contrast-900)',
    950: 'var(--color-contrast-950)',
  },
} as const

/**
 * 间距令牌映射
 */
export const spacing = {
  0: 'var(--spacing-0)',
  px: 'var(--spacing-px)',
  0.5: 'var(--spacing-0-5)',
  1: 'var(--spacing-1)',
  1.5: 'var(--spacing-1-5)',
  2: 'var(--spacing-2)',
  2.5: 'var(--spacing-2-5)',
  3: 'var(--spacing-3)',
  3.5: 'var(--spacing-3-5)',
  4: 'var(--spacing-4)',
  5: 'var(--spacing-5)',
  6: 'var(--spacing-6)',
  7: 'var(--spacing-7)',
  8: 'var(--spacing-8)',
  9: 'var(--spacing-9)',
  10: 'var(--spacing-10)',
  12: 'var(--spacing-12)',
  16: 'var(--spacing-16)',
  20: 'var(--spacing-20)',
  24: 'var(--spacing-24)',
  32: 'var(--spacing-32)',
  40: 'var(--spacing-40)',
  48: 'var(--spacing-48)',
  56: 'var(--spacing-56)',
  64: 'var(--spacing-64)',
  80: 'var(--spacing-80)',
  96: 'var(--spacing-96)',
  112: 'var(--spacing-112)',
  128: 'var(--spacing-128)',
  144: 'var(--spacing-144)',
  160: 'var(--spacing-160)',
  176: 'var(--spacing-176)',
  192: 'var(--spacing-192)',
  208: 'var(--spacing-208)',
  224: 'var(--spacing-224)',
  240: 'var(--spacing-240)',
  256: 'var(--spacing-256)',
} as const

/**
 * 字体令牌映射
 */
export const typography = {
  // 字体大小
  fontSize: {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    base: 'var(--font-size-base)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
    '2xl': 'var(--font-size-2xl)',
    '3xl': 'var(--font-size-3xl)',
    '4xl': 'var(--font-size-4xl)',
    '5xl': 'var(--font-size-5xl)',
    '6xl': 'var(--font-size-6xl)',
    '7xl': 'var(--font-size-7xl)',
    '8xl': 'var(--font-size-8xl)',
    '9xl': 'var(--font-size-9xl)',
  },

  // 字体粗细
  fontWeight: {
    thin: 'var(--font-weight-thin)',
    extralight: 'var(--font-weight-extralight)',
    light: 'var(--font-weight-light)',
    normal: 'var(--font-weight-normal)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
    extrabold: 'var(--font-weight-extrabold)',
    black: 'var(--font-weight-black)',
  },

  // 行高
  lineHeight: {
    tight: 'var(--line-height-tight)',
    snug: 'var(--line-height-snug)',
    normal: 'var(--line-height-normal)',
    relaxed: 'var(--line-height-relaxed)',
    loose: 'var(--line-height-loose)',
  },

  // 字母间距
  letterSpacing: {
    tighter: 'var(--letter-spacing-tighter)',
    tight: 'var(--letter-spacing-tight)',
    normal: 'var(--letter-spacing-normal)',
    wide: 'var(--letter-spacing-wide)',
    wider: 'var(--letter-spacing-wider)',
    widest: 'var(--letter-spacing-widest)',
  },
} as const

/**
 * 阴影令牌映射
 */
export const shadows = {
  sm: 'var(--shadow-sm)',
  DEFAULT: 'var(--shadow)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  '2xl': 'var(--shadow-2xl)',
  inner: 'var(--shadow-inner)',
  none: 'var(--shadow-none)',
} as const

/**
 * 圆角令牌映射
 */
export const borderRadius = {
  none: 'var(--radius-none)',
  sm: 'var(--radius-sm)',
  DEFAULT: 'var(--radius)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  '3xl': 'var(--radius-3xl)',
  full: 'var(--radius-full)',
} as const

/**
 * 动画令牌映射
 */
export const transitions = {
  duration: {
    75: 'var(--duration-75)',
    100: 'var(--duration-100)',
    150: 'var(--duration-150)',
    200: 'var(--duration-200)',
    300: 'var(--duration-300)',
    500: 'var(--duration-500)',
    700: 'var(--duration-700)',
    1000: 'var(--duration-1000)',
  },

  easing: {
    linear: 'var(--easing-linear)',
    ease: 'var(--easing-ease)',
    easeIn: 'var(--easing-ease-in)',
    easeOut: 'var(--easing-ease-out)',
    easeInOut: 'var(--easing-ease-in-out)',
  },
} as const

/**
 * Z-index令牌映射
 */
export const zIndex = {
  hide: 'var(--z-index-hide)',
  auto: 'var(--z-index-auto)',
  base: 'var(--z-index-base)',
  docked: 'var(--z-index-docked)',
  dropdown: 'var(--z-index-dropdown)',
  sticky: 'var(--z-index-sticky)',
  banner: 'var(--z-index-banner)',
  overlay: 'var(--z-index-overlay)',
  modal: 'var(--z-index-modal)',
  popover: 'var(--z-index-popover)',
  skipLink: 'var(--z-index-skip-link)',
  toast: 'var(--z-index-toast)',
  tooltip: 'var(--z-index-tooltip)',
} as const

/**
 * 组合令牌对象
 */
export const tokens = {
  colors: semanticColors,
  spacing,
  typography,
  shadows,
  borderRadius,
  transitions,
  zIndex,
} as const

/**
 * 主题切换相关工具函数
 */
export const themeUtils = {
  /**
   * 获取CSS变量值
   */
  getCSSVariable: (name: string): string => `var(--${name})`,

  /**
   * 检查CSS变量是否存在
   */
  hasCSSVariable: (name: string): boolean => {
    return typeof document !== 'undefined' &&
           getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).length > 0
  },

  /**
   * 设置CSS变量值（用于动态主题切换）
   */
  setCSSVariable: (name: string, value: string): void => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(`--${name}`, value)
    }
  },

  /**
   * 批量设置CSS变量
   */
  setCSSVariables: (variables: Record<string, string>): void => {
    if (typeof document !== 'undefined') {
      Object.entries(variables).forEach(([name, value]) => {
        document.documentElement.style.setProperty(`--${name}`, value)
      })
    }
  },
} as const

/**
 * 主题配方工具函数
 */
export const recipeUtils = {
  /**
   * 应用主题配方
   */
  applyRecipe: (recipe: Record<string, string>): void => {
    themeUtils.setCSSVariables(recipe)
  },

  /**
   * 获取当前主题配方
   */
  getCurrentRecipe: (): Record<string, string> => {
    if (typeof document === 'undefined') return {}

    const computedStyle = getComputedStyle(document.documentElement)
    const recipe: Record<string, string> = {}

    // 提取所有CSS变量
    Object.keys(computedStyle).forEach(key => {
      if (key.startsWith('--')) {
        const variableName = key.substring(2)
        recipe[variableName] = computedStyle.getPropertyValue(key).trim()
      }
    })

    return recipe
  },

  /**
   * 检查主题配方是否已应用
   */
  isRecipeApplied: (recipe: Record<string, string>): boolean => {
    const current = recipeUtils.getCurrentRecipe()
    return Object.entries(recipe).every(([key, value]) => current[key] === value)
  },
} as const

export default {
  ...tokens,
  utils: themeUtils,
  recipes: recipeUtils,
}