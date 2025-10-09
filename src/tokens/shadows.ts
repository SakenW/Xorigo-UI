/**
 * 🌑 阴影令牌系统
 *
 * 从xs到2xl的完整阴影层级
 * 包括彩色阴影和特殊效果阴影
 */

// 基础阴影
export const shadowTokens = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const

// 彩色阴影
export const coloredShadows = {
  primary: '0 10px 25px -3px rgb(14 165 233 / 0.3)',
  secondary: '0 10px 25px -3px rgb(168 85 247 / 0.3)',
  success: '0 10px 25px -3px rgb(34 197 94 / 0.3)',
  warning: '0 10px 25px -3px rgb(245 158 11 / 0.3)',
  danger: '0 10px 25px -3px rgb(239 68 68 / 0.3)',
} as const

// 特殊效果阴影
export const effectShadows = {
  glow: '0 0 20px rgb(14 165 233 / 0.4)',
  glowSecondary: '0 0 20px rgb(168 85 247 / 0.4)',
  glowSuccess: '0 0 20px rgb(34 197 94 / 0.4)',
  neon: '0 0 5px currentColor, 0 0 20px currentColor',
} as const

// 统一导出
export const shadows = {
  ...shadowTokens,
  colored: coloredShadows,
  effect: effectShadows,
} as const

// 类型定义
export type ShadowToken = typeof shadowTokens
export type ColoredShadows = typeof coloredShadows
export type EffectShadows = typeof effectShadows
export type Shadows = typeof shadows
