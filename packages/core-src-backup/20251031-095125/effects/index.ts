/**
 * Effects 组件导出 - 符合七轴主题系统 v1.4 SSOT
 *
 * 视觉效果组件集合 - AnimatedBackground, BreathingBackground, SuperParticleSystem 等
 */

// =============================================================================
// 核心组件导出
// =============================================================================

// AnimatedBackground 组件
export {
  AnimatedBackground
} from './animated-background/animated-background'
export type {
  AnimatedBackgroundProps
} from './animated-background/animated-background'
import { AnimatedBackground } from './animated-background/animated-background'

// BreathingBackground 组件
export {
  BreathingBackground
} from './breathing-background/breathing-background'
export type {
  BreathingBackgroundProps
} from './breathing-background/breathing-background'
import { BreathingBackground } from './breathing-background/breathing-background'

// SuperParticleSystem 组件系列
export {
  SuperParticleSystem
} from './super-particle-system/super-particle-system'
export type {
  SuperParticleSystemProps
} from './super-particle-system/super-particle-system'
import { SuperParticleSystem } from './super-particle-system/super-particle-system'

// =============================================================================
// 组件集合导出
// =============================================================================

/**
 * 效果组件集合
 */
export const EffectsComponents = {
  AnimatedBackground,
  BreathingBackground,
  SuperParticleSystem,
} as const

// =============================================================================
// 类型导出
// =============================================================================

/**
 * 所有效果组件的 Props 类型联合
 */
export type EffectsComponentProps = AnimatedBackgroundProps | BreathingBackgroundProps | SuperParticleSystemProps