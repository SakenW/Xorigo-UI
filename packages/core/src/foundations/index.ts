/**
 * 🎭 Foundations 统一导出 - v2025.11.03
 *
 * 设计令牌系统核心导出
 * 支持七轴主题系统的完整令牌生态
 *
 * @version 2025.11.03
 * @category Foundations
 * @layer system
 */

// 核心令牌系统
export { colorTokens, ColorTokenValidator, colorValidationResult } from './color-tokens'
export { densityTokens, DensityTokenValidator, densityValidationResult } from './density-tokens'
export { motionTokens, MotionTokenValidator, AnimationHelper, motionValidationResult } from './motion-curves'
export { surfaceTokens, SurfaceTokenValidator, SurfaceHelper, surfaceValidationResult } from './surface-tokens'

// 工具函数
export { cn, createThemeCn, createConditionalCn, createVariantCn } from './utils/cn'
export {
  ColorHelper,
  createColor,
  parseColor,
  type HSLColor,
  type RGBColor
} from './utils/color-helpers'

// 类型定义
export type { ColorTokens } from './color-tokens'
export type { DensityTokens } from './density-tokens'
export type { MotionTokens } from './motion-curves'
export type { SurfaceTokens } from './surface-tokens'

// 便捷别名
export const tokens = {
  color: colorTokens,
  density: densityTokens,
  motion: motionTokens,
  surface: surfaceTokens
}

export const helpers = {
  cn,
  color: ColorHelper,
  surface: SurfaceHelper,
  animation: {
    createAnimation: require('./motion-curves').AnimationHelper.createAnimation,
    createKeyframes: require('./motion-curves').AnimationHelper.createKeyframes,
    getAccessibilityAwareAnimation: require('./motion-curves').AnimationHelper.getAccessibilityAwareAnimation,
    getAnimationPreset: require('./motion-curves').AnimationHelper.getAnimationPreset
  }
}

// 验证器集合
export const validators = {
  color: ColorTokenValidator,
  density: DensityTokenValidator,
  motion: MotionTokenValidator,
  surface: SurfaceTokenValidator
}

// 验证结果集合
export const validationResults = {
  color: colorValidationResult,
  density: densityValidationResult,
  motion: motionValidationResult,
  surface: surfaceValidationResult
}