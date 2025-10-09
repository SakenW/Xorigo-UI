/**
 * 📏 间距令牌系统
 *
 * 基于4px网格系统的间距体系
 * 提供从0到128px的完整间距规范
 */

export const spacingTokens = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
} as const

// 类型定义
export type SpacingToken = typeof spacingTokens
export type SpacingKey = keyof typeof spacingTokens
