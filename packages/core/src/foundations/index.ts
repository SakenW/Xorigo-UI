/**
 * Xorigo UI 设计令牌系统聚合导出 - 基于七轴主题系统 v1.4 SSOT
 *
 * 从 src-archived-20251022-023941/tokens/design-tokens.ts 迁移并适配七轴系统
 */

// =============================================================================
// 颜色令牌系统 - 支持七轴主题系统的完整颜色体系
// =============================================================================

export * from './color-tokens'

// =============================================================================
// 密度令牌系统 - 支持七轴 density 轴的间距与尺寸体系
// =============================================================================

export * from './density-tokens'

// =============================================================================
// 动画曲线系统 - 支持七轴 motion 轴的动画体系
// =============================================================================

export * from './motion-curves'

// =============================================================================
// 表面材质系统 - 支持七轴 surface 轴的表面效果体系
// =============================================================================

export * from './surface-tokens'

// =============================================================================
// 七轴主题系统类型定义
// =============================================================================

export interface SevenAxisTheme {
  mode: 'light' | 'dark' | 'hc'
  base: `${'neutral-warm' | 'neutral-cool' | 'neutral-true'}-${'low' | 'mid' | 'high'}`
  accent: `${'mono' | 'analog' | 'duo'}(${string})`
  tone: 'calm' | 'standard' | 'vivid'
  density: 'spacious' | 'comfortable' | 'compact'
  motion: `${'subtle' | 'standard' | 'expressive'}.${'classic' | 'soft' | 'spring'}`
  surface: 'flat' | 'soft-shadow' | 'glass' | 'neon' | 'glass+neon'
}

// =============================================================================
// 设计令牌生成器统一导出
// =============================================================================

export { ColorTokenGenerator } from './color-tokens'
export { DensityTokenGenerator } from './density-tokens'
export { MotionCurveGenerator } from './motion-curves'
export { SurfaceTokenGenerator } from './surface-tokens'

// =============================================================================
// 默认配置聚合导出
// =============================================================================

export { defaultColorConfig } from './color-tokens'
export { defaultDensityConfig } from './density-tokens'
export { defaultMotionConfig } from './motion-curves'
export { defaultSurfaceConfig } from './surface-tokens'

// =============================================================================
// 完整设计令牌配置
// =============================================================================

export const completeDesignTokens = {
  colors: defaultColorConfig,
  density: defaultDensityConfig,
  motion: defaultMotionConfig,
  surface: defaultSurfaceConfig,
  generators: {
    color: new ColorTokenGenerator(),
    density: new DensityTokenGenerator(),
    motion: new MotionCurveGenerator(),
    surface: new SurfaceTokenGenerator(),
  }
} as const

// =============================================================================
// 工具函数导出
// =============================================================================

/**
 * 生成完整的七轴主题配置
 */
export function generateSevenAxisTheme(axes: SevenAxisTheme) {
  const colorConfig = ColorTokenGenerator.generateThemeColors({
    mode: axes.mode,
    base: axes.base,
    accent: axes.accent,
    tone: axes.tone
  })

  const densityConfig = DensityTokenGenerator.generateSpacingConfig(axes.density)
  const motionConfig = MotionCurveGenerator.generateDurationConfig(axes.motion.split('.')[0] as any)
  const surfaceConfig = SurfaceTokenGenerator.generateSurfaceConfig(axes.surface)

  return {
    axes,
    colors: colorConfig,
    density: densityConfig,
    motion: motionConfig,
    surface: surfaceConfig,
    cssVariables: [
      ColorTokenGenerator.generateCSSVariables(),
      DensityTokenGenerator.generateCSSVariables(axes.density),
      MotionCurveGenerator.generateCSSVariables(
        axes.motion.split('.')[0] as any,
        axes.motion.split('.')[1] as any
      ),
      SurfaceTokenGenerator.generateCSSVariables(axes.surface)
    ].join('\n\n')
  }
}

/**
 * 获取推荐的主题预设
 */
export function getRecommendedTheme(
  category: 'business' | 'creative' | 'technical' | 'minimal'
): SevenAxisTheme {
  const themes = {
    business: {
      mode: 'light' as const,
      base: 'neutral-true-mid' as const,
      accent: 'mono(blue)' as const,
      tone: 'standard' as const,
      density: 'comfortable' as const,
      motion: 'subtle.classic' as const,
      surface: 'soft-shadow' as const
    },
    creative: {
      mode: 'light' as const,
      base: 'neutral-warm-low' as const,
      accent: 'duo(purple,pink)' as const,
      tone: 'vivid' as const,
      density: 'spacious' as const,
      motion: 'expressive.spring' as const,
      surface: 'glass+neon' as const
    },
    technical: {
      mode: 'dark' as const,
      base: 'neutral-cool-mid' as const,
      accent: 'mono(cyan)' as const,
      tone: 'calm' as const,
      density: 'compact' as const,
      motion: 'subtle.soft' as const,
      surface: 'neon' as const
    },
    minimal: {
      mode: 'light' as const,
      base: 'neutral-true-high' as const,
      accent: 'mono(gray)' as const,
      tone: 'calm' as const,
      density: 'spacious' as const,
      motion: 'subtle.classic' as const,
      surface: 'flat' as const
    }
  }

  return themes[category]
}
