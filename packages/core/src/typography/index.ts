/**
 * Typography 组件导出 - 符合七轴主题系统 v1.4 SSOT
 *
 * 排版组件集合 - HeroTitle 等
 */

// =============================================================================
// 核心组件导出
// =============================================================================

// HeroTitle 组件系列
export {
  HeroTitle
} from './hero-title/hero-title'
export type {
  HeroTitleProps,
  Size,
  AsTag
} from './hero-title/hero-title'
import { HeroTitle } from './hero-title/hero-title'

// =============================================================================
// 组件集合导出
// =============================================================================

/**
 * 排版组件集合
 */
export const TypographyComponents = {
  HeroTitle,
} as const

// =============================================================================
// 类型导出
// =============================================================================

/**
 * 所有排版组件的 Props 类型联合
 */
export type TypographyComponentProps = HeroTitleProps