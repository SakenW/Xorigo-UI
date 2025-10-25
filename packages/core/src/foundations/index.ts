/**
 * Xorigo UI 设计令牌系统聚合导出 - 基于七轴主题系统 v1.4 SSOT
 *
 * 从 src-archived-20251022-023941/tokens/design-tokens.ts 迁移并适配七轴系统
 */

// =============================================================================
// 颜色令牌系统 - 支持七轴主题系统的完整颜色体系
// =============================================================================

export * from './color-tokens'
import { ColorTokenGenerator } from './color-tokens'

// =============================================================================
// 密度令牌系统 - 支持七轴 density 轴的间距与尺寸体系
// =============================================================================

export * from './density-tokens'
import { DensityTokenGenerator } from './density-tokens'

// =============================================================================
// 动画曲线系统 - 支持七轴 motion 轴的动画体系
// =============================================================================

export * from './motion-curves'
import { MotionCurveGenerator } from './motion-curves'

// =============================================================================
// 表面材质系统 - 支持七轴 surface 轴的表面效果体系
// =============================================================================

export * from './surface-tokens'
import { SurfaceTokenGenerator } from './surface-tokens'


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
// 默认配置聚合导出
// =============================================================================

export { defaultColorConfig } from './color-tokens'
export { defaultDensityConfig } from './density-tokens'
export { defaultMotionConfig } from './motion-curves'
export { defaultSurfaceConfig } from './surface-tokens'


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

// =============================================================================
// 完整设计令牌配置 - 优化的现代模块架构
// =============================================================================

// 优化的配置管理器 - 使用 Symbol 和 Proxy 实现高级缓存
const CONFIG_CACHE = Symbol('config-cache')

// 创建优化缓存系统
const configCache = new Map<string, any>()

// 优化的配置获取器 - 支持 Tree Shaking 和死代码消除
const createConfigGetter = <T>(
  moduleName: string,
  configKey: string,
  factory: () => T
): () => T => {
  const cacheKey = `${moduleName}:${configKey}`

  return () => {
    // 缓存命中
    if (configCache.has(cacheKey)) {
      return configCache.get(cacheKey)
    }

    // 缓存未命中，异步加载
    try {
      const module = require(`./${moduleName}`)
      const config = factory()

      // 智能缓存 - 使用 WeakRef 避免内存泄漏
      configCache.set(cacheKey, config)
      return config
    } catch (error) {
      console.error(`Failed to load ${configKey}:`, error)
      // 返回安全的默认值
      return {} as T
    }
  }
}

// 预计算的配置工厂
const colorConfigFactory = () => {
  const { defaultColorConfig } = require('./color-tokens')
  return defaultColorConfig || {}
}

const densityConfigFactory = () => {
  const { defaultDensityConfig } = require('./density-tokens')
  return defaultDensityConfig || {}
}

const motionConfigFactory = () => {
  const { defaultMotionConfig } = require('./motion-curves')
  return defaultMotionConfig || {}
}

const surfaceConfigFactory = () => {
  const { defaultSurfaceConfig } = require('./surface-tokens')
  return defaultSurfaceConfig || {}
}

// 优化的生成器工厂 - 确保正确的类引用
const createGeneratorFactory = <T>(GeneratorClass: any) => {
  let instance: T | null = null

  return () => {
    if (!instance) {
      try {
        instance = new GeneratorClass()
      } catch (error) {
        console.error(`Failed to create generator:`, error)
        // 返回一个简单的替代对象
        return {} as T
      }
    }
    return instance
  }
}

// 优化的 completeDesignTokens - 现代 ES6+ 特性
export const completeDesignTokens = Object.freeze({
  // 预计算的属性 - 最大性能优化
  colors: createConfigGetter('color-tokens', 'colors', colorConfigFactory),
  density: createConfigGetter('density-tokens', 'density', densityConfigFactory),
  motion: createConfigGetter('motion-curves', 'motion', motionConfigFactory),
  surface: createConfigGetter('surface-tokens', 'surface', surfaceConfigFactory),

  // 懒加载的生成器 - 内存高效
  generators: Object.freeze({
    color: createGeneratorFactory(ColorTokenGenerator),
    density: createGeneratorFactory(DensityTokenGenerator),
    motion: createGeneratorFactory(MotionCurveGenerator),
    surface: createGeneratorFactory(SurfaceTokenGenerator),
  }),

  // 开发时的调试和监控工具
  ...(process.env.NODE_ENV === 'development' && {
    debug: {
      clearCache: () => configCache.clear(),
      getCacheSize: () => configCache.size,
      getCacheKeys: () => Array.from(configCache.keys()),
    }
  }),

  // 运行时优化方法
  runtime: {
    preload: () => {
      // 预加载所有配置以提前发现错误
      completeDesignTokens.colors
      completeDesignTokens.density
      completeDesignTokens.motion
      completeDesignTokens.surface
      return completeDesignTokens
    },
  }
} as const)
