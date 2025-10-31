/**
 * 🧮 七轴参数实时计算引擎
 *
 * 提供高性能的七轴DTCG参数计算、颜色空间转换和实时渲染优化
 * 支持OKLCH颜色空间、WCAG对比度计算和动态主题生成
 */

import { DynamicRecipe, SevenAxisConfig, CalculationContext } from './seven-axis-recipe-engine'

// ============================================================================
// 颜色空间和计算类型定义
// ============================================================================

/**
 * OKLCH颜色值
 */
export interface OKLCHColor {
  mode: 'oklch'
  l: number    // 明度 (0-1)
  c: number    // 色度 (0-0.4)
  h: number    // 色相 (0-360)
  a?: number   // 透明度 (0-1)
}

/**
 * 颜色转换结果
 */
export interface ColorConversionResult {
  oklch: OKLCHColor
  srgb: string
  p3: string
  hsl: string
  hex: string
  contrastRatio?: number
  readabilityLevel?: 'AAA' | 'AA' | 'AA-Large' | 'Fail'
}

/**
 * 计算缓存项
 */
export interface CalculationCacheItem {
  /** 计算结果 */
  result: any
  /** 计算时间戳 */
  timestamp: number
  /** 过期时间 */
  expiresAt: number
  /** 计算耗时 */
  calculationTime: number
  /** 使用次数 */
  hitCount: number
  /** 缓存大小（字节） */
  size: number
}

/**
 * 颜色调色板
 */
export interface ColorPalette {
  /** 主色调色板 */
  primary: ColorScale
  /** 次要色调色板 */
  secondary?: ColorScale
  /** 强调色调色板 */
  accent?: ColorScale
  /** 中性色调色板 */
  neutral: ColorScale
  /** 状态色板 */
  semantic: SemanticColors
}

/**
 * 颜色色阶
 */
export interface ColorScale {
  /** 色阶值 */
  [shade: number]: OKLCHColor
}

/**
 * 语义颜色
 */
export interface SemanticColors {
  success: ColorScale
  warning: ColorScale
  error: ColorScale
  info: ColorScale
}

/**
 * 空间系统
 */
export interface SpatialSystem {
  /** 间距系统 */
  spacing: SpatialScale
  /** 尺寸系统 */
  sizes: SpatialScale
  /** 字体大小系统 */
  fontSizes: SpatialScale
  /** 圆角系统 */
  radii: SpatialScale
}

/**
 * 空间比例
 */
export interface SpatialScale {
  /** 比例值 */
  [step: number]: number
}

/**
 * 动画系统
 */
export interface AnimationSystem {
  /** 缓动函数 */
  easings: Record<string, string>
  /** 持续时间 */
  durations: Record<string, number>
  /** 延迟时间 */
  delays: Record<string, number>
}

/**
 * 完整计算结果
 */
export interface CompleteCalculationResult {
  /** 配方信息 */
  recipe: {
    id: string
    name: string
    version: string
  }
  /** 颜色系统 */
  colors: ColorPalette
  /** 空间系统 */
  spatial: SpatialSystem
  /** 动画系统 */
  animations: AnimationSystem
  /** CSS变量 */
  cssVariables: Record<string, string>
  /** 计算元数据 */
  metadata: {
    calculatedAt: number
    calculationTime: number
    cacheHit: boolean
    context: CalculationContext
    performance: {
      colorCalculations: number
      spatialCalculations: number
      animationCalculations: number
    }
  }
}

// ============================================================================
// 高级七轴计算引擎
// ============================================================================

/**
 * 高级七轴参数计算引擎
 *
 * 特性：
 * - OKLCH颜色空间支持
 * - WCAG对比度计算
 * - 高性能缓存
 * - 并行计算
 * - 实时优化
 */
export class SevenAxisCalculator {
  private cache: Map<string, CalculationCacheItem>
  private colorCache: Map<string, ColorConversionResult>
  private performanceMetrics: Map<string, number>
  private calculationWorkers: Worker[] | null
  private isInitialized: boolean

  constructor(private config: CalculatorConfig = {}) {
    this.cache = new Map()
    this.colorCache = new Map()
    this.performanceMetrics = new Map()
    this.calculationWorkers = null
    this.isInitialized = false

    this.initialize()
  }

  // ========================================================================
  // 初始化和生命周期
  // ========================================================================

  /**
   * 初始化计算引擎
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) return

    const startTime = performance.now()

    try {
      // 初始化Web Workers（如果支持）
      if (typeof Worker !== 'undefined' && this.config.enableWorkers) {
        await this.initializeWorkers()
      }

      // 预热缓存
      await this.warmupCache()

      // 启动缓存清理
      this.startCacheCleanup()

      this.isInitialized = true

      const endTime = performance.now()
      console.log(`🧮 七轴计算引擎初始化完成 (${(endTime - startTime).toFixed(2)}ms)`)

    } catch (error) {
      console.error('七轴计算引擎初始化失败:', error)
      throw error
    }
  }

  /**
   * 计算完整的七轴主题
   */
  async calculateCompleteTheme(
    recipe: DynamicRecipe,
    context?: CalculationContext
  ): Promise<CompleteCalculationResult> {
    const startTime = performance.now()

    // 检查缓存
    const cacheKey = this.generateCacheKey(recipe, context)
    const cached = this.getFromCache(cacheKey)

    if (cached) {
      cached.hitCount++
      return {
        ...cached.result,
        metadata: {
          ...cached.result.metadata,
          cacheHit: true,
          calculationTime: cached.calculationTime
        }
      }
    }

    try {
      // 并行计算各个系统
      const [
        colors,
        spatial,
        animations,
        cssVariables
      ] = await Promise.all([
        this.calculateColorSystem(recipe, context),
        this.calculateSpatialSystem(recipe, context),
        this.calculateAnimationSystem(recipe, context),
        this.calculateCSSVariables(recipe, context)
      ])

      const endTime = performance.now()
      const calculationTime = endTime - startTime

      const result: CompleteCalculationResult = {
        recipe: {
          id: recipe.id,
          name: recipe.name,
          version: recipe.version
        },
        colors,
        spatial,
        animations,
        cssVariables,
        metadata: {
          calculatedAt: Date.now(),
          calculationTime,
          cacheHit: false,
          context: context || {},
          performance: {
            colorCalculations: this.getCalculationCount('colors'),
            spatialCalculations: this.getCalculationCount('spatial'),
            animationCalculations: this.getCalculationCount('animations')
          }
        }
      }

      // 缓存结果
      this.setCache(cacheKey, result, calculationTime)

      return result

    } catch (error) {
      console.error('七轴主题计算失败:', error)
      throw error
    }
  }

  // ========================================================================
  // 颜色系统计算
  // ========================================================================

  /**
   * 计算颜色系统
   */
  private async calculateColorSystem(
    recipe: DynamicRecipe,
    context?: CalculationContext
  ): Promise<ColorPalette> {
    const { axes } = recipe

    // 1. 计算主色调色板
    const primary = await this.calculateColorScale(
      axes.hue.primary,
      axes.saturation,
      axes.lightness,
      axes.mode,
      context
    )

    // 2. 计算次要色调色板
    const secondary = axes.hue.secondary ?
      await this.calculateColorScale(
        axes.hue.secondary,
        axes.saturation,
        axes.lightness,
        axes.mode,
        context
      ) : undefined

    // 3. 计算强调色调色板
    const accent = axes.hue.accent ?
      await this.calculateColorScale(
        axes.hue.accent,
        { ...axes.saturation, factor: axes.saturation.factor * 1.2 },
        axes.lightness,
        axes.mode,
        context
      ) : undefined

    // 4. 计算中性色调色板
    const neutral = await this.calculateNeutralScale(axes.mode, axes.lightness)

    // 5. 计算语义颜色
    const semantic = await this.calculateSemanticColors(primary, axes.contrast, axes.mode)

    return {
      primary,
      secondary,
      accent,
      neutral,
      semantic
    }
  }

  /**
   * 计算颜色色阶
   */
  private async calculateColorScale(
    hueName: string,
    saturation: any,
    lightness: any,
    mode: string,
    context?: CalculationContext
  ): Promise<ColorScale> {
    const baseHue = this.getBaseHue(hueName)
    const saturationFactor = saturation.factor
    const lightnessFactor = lightness.factor

    const scale: ColorScale = {}
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

    for (const shade of shades) {
      const l = this.calculateLightnessForShade(shade, mode, lightnessFactor)
      const c = this.calculateChromaForShade(shade, saturationFactor)

      scale[shade] = {
        mode: 'oklch',
        l,
        c,
        h: baseHue
      }
    }

    return scale
  }

  /**
   * 计算中性色色阶
   */
  private async calculateNeutralScale(mode: string, lightness: any): Promise<ColorScale> {
    const scale: ColorScale = {}
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    const lightnessFactor = lightness.factor

    for (const shade of shades) {
      const l = this.calculateLightnessForShade(shade, mode, lightnessFactor)

      // 中性色使用极低色度
      scale[shade] = {
        mode: 'oklch',
        l,
        c: mode === 'hc' ? 0 : 0.002, // 高对比度模式下完全无色度
        h: 0 // 色相值不重要，设为0
      }
    }

    return scale
  }

  /**
   * 计算语义颜色
   */
  private async calculateSemanticColors(
    primary: ColorScale,
    contrast: any,
    mode: string
  ): Promise<SemanticColors> {
    const getHueForState = (state: string): number => {
      const stateHues = {
        success: 140,    // 绿色
        warning: 50,     // 黄色
        error: 20,       // 红色
        info: 220        // 蓝色
      }
      return stateHues[state as keyof typeof stateHues] || 0
    }

    const states: (keyof SemanticColors)[] = ['success', 'warning', 'error', 'info']
    const semantic: Partial<SemanticColors> = {}

    for (const state of states) {
      const hue = getHueForState(state)
      const scale: ColorScale = {}

      // 为每个状态生成完整的色阶
      for (const shade of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
        const baseLightness = this.calculateLightnessForShade(shade, mode, { factor: 1.0, contrast: contrast.level })

        scale[shade] = {
          mode: 'oklch',
          l: baseLightness,
          c: state === 'warning' ? 0.15 : 0.12, // 警告色使用更高色度
          h
        }
      }

      semantic[state] = scale
    }

    return semantic as SemanticColors
  }

  // ========================================================================
  // 空间系统计算
  // ========================================================================

  /**
   * 计算空间系统
   */
  private async calculateSpatialSystem(
    recipe: DynamicRecipe,
    context?: CalculationContext
  ): Promise<SpatialSystem> {
    const { axes } = recipe

    const [
      spacing,
      sizes,
      fontSizes,
      radii
    ] = await Promise.all([
      this.calculateSpacingScale(axes.density),
      this.calculateSizeScale(axes.density),
      this.calculateFontSizeScale(axes.density),
      this.calculateRadiusScale(axes.roundness)
    ])

    return {
      spacing,
      sizes,
      fontSizes,
      radii
    }
  }

  /**
   * 计算间距比例
   */
  private async calculateSpacingScale(density: any): Promise<SpatialScale> {
    const baseSpacing = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160]
    const factor = density.scaleFactor * this.getDensityMultiplier(density.level)

    const scale: SpatialScale = {}
    baseSpacing.forEach((value, index) => {
      scale[index * 100] = Math.round(value * factor)
    })

    return scale
  }

  /**
   * 计算尺寸比例
   */
  private async calculateSizeScale(density: any): Promise<SpatialScale> {
    const baseSizes = [20, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128]
    const factor = this.getDensityMultiplier(density.level)

    const scale: SpatialScale = {}
    baseSizes.forEach((value, index) => {
      scale[index * 100] = Math.round(value * factor)
    })

    return scale
  }

  /**
   * 计算字体大小比例
   */
  private async calculateFontSizeScale(density: any): Promise<SpatialScale> {
    const baseFontSizes = [11, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72]
    const factor = this.getDensityMultiplier(density.level)

    const scale: SpatialScale = {}
    baseFontSizes.forEach((value, index) => {
      scale[index * 100] = Math.round(value * factor * 10) / 10
    })

    return scale
  }

  /**
   * 计算圆角比例
   */
  private async calculateRadiusScale(roundness: any): Promise<SpatialScale> {
    const baseRadius = roundness.radius
    const multiplier = this.getRoundnessMultiplier(roundness.level)

    const scale: SpatialScale = {
      0: 0,
      100: Math.round(baseRadius * 0.5 * multiplier),
      200: Math.round(baseRadius * multiplier),
      300: Math.round(baseRadius * 1.5 * multiplier),
      400: Math.round(baseRadius * 2 * multiplier),
      500: Math.round(baseRadius * 3 * multiplier)
    }

    return scale
  }

  // ========================================================================
  // 动画系统计算
  // ========================================================================

  /**
   * 计算动画系统
   */
  private async calculateAnimationSystem(
    recipe: DynamicRecipe,
    context?: CalculationContext
  ): Promise<AnimationSystem> {
    const { axes } = recipe

    const easings = this.calculateEasings(axes.mode, axes.density)
    const durations = this.calculateDurations(axes.density)
    const delays = this.calculateDelays(axes.density)

    return {
      easings,
      durations,
      delays
    }
  }

  /**
   * 计算缓动函数
   */
  private calculateEasings(mode: string, density: any): Record<string, string> {
    const baseEasings = {
      ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
      easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)'
    }

    // 根据密度调整缓动
    const densityMultiplier = this.getDensityMultiplier(density.level)

    if (density.level === 'compact') {
      // 紧凑模式使用更快的缓动
      return {
        ...baseEasings,
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }
    } else if (density.level === 'spacious') {
      // 宽松模式使用更平滑的缓动
      return {
        ...baseEasings,
        bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        smooth: 'cubic-bezier(0.23, 1, 0.32, 1)'
      }
    }

    return baseEasings
  }

  /**
   * 计算动画持续时间
   */
  private calculateDurations(density: any): Record<string, number> {
    const baseDurations = {
      fast: 150,
      normal: 250,
      slow: 400
    }

    const multiplier = this.getDensityMultiplier(density.level)

    return {
      fast: Math.round(baseDurations.fast * multiplier),
      normal: Math.round(baseDurations.normal * multiplier),
      slow: Math.round(baseDurations.slow * multiplier)
    }
  }

  /**
   * 计算延迟时间
   */
  private calculateDelays(density: any): Record<string, number> {
    const baseDelays = {
      short: 50,
      normal: 100,
      long: 200
    }

    const multiplier = this.getDensityMultiplier(density.level)

    return {
      short: Math.round(baseDelays.short * multiplier),
      normal: Math.round(baseDelays.normal * multiplier),
      long: Math.round(baseDelays.long * multiplier)
    }
  }

  // ========================================================================
  // CSS变量生成
  // ========================================================================

  /**
   * 计算CSS变量
   */
  private async calculateCSSVariables(
    recipe: DynamicRecipe,
    context?: CalculationContext
  ): Promise<Record<string, string>> {
    const variables: Record<string, string> = {}
    const prefix = 'xorigo'

    // 获取计算结果
    const theme = await this.calculateCompleteTheme(recipe, context)

    // 1. 生成颜色变量
    this.generateColorVariables(theme.colors, variables, prefix)

    // 2. 生成空间变量
    this.generateSpatialVariables(theme.spatial, variables, prefix)

    // 3. 生成动画变量
    this.generateAnimationVariables(theme.animations, variables, prefix)

    // 4. 生成主题元数据变量
    this.generateMetadataVariables(theme, variables, prefix)

    // 5. 应用自定义令牌
    if (recipe.customTokens) {
      Object.entries(recipe.customTokens).forEach(([key, value]) => {
        variables[`--${prefix}-${key}`] = value
      })
    }

    return variables
  }

  /**
   * 生成颜色变量
   */
  private generateColorVariables(colors: ColorPalette, variables: Record<string, string>, prefix: string): void {
    // 主色调
    Object.entries(colors.primary).forEach(([shade, color]) => {
      const cssValue = this.oklchToCSS(color)
      variables[`--${prefix}-color-primary-${shade}`] = cssValue
    })

    // 次要色调
    if (colors.secondary) {
      Object.entries(colors.secondary).forEach(([shade, color]) => {
        const cssValue = this.oklchToCSS(color)
        variables[`--${prefix}-color-secondary-${shade}`] = cssValue
      })
    }

    // 强调色
    if (colors.accent) {
      Object.entries(colors.accent).forEach(([shade, color]) => {
        const cssValue = this.oklchToCSS(color)
        variables[`--${prefix}-color-accent-${shade}`] = cssValue
      })
    }

    // 中性色
    Object.entries(colors.neutral).forEach(([shade, color]) => {
      const cssValue = this.oklchToCSS(color)
      variables[`--${prefix}-color-neutral-${shade}`] = cssValue
    })

    // 语义色
    Object.entries(colors.semantic).forEach(([state, scale]) => {
      Object.entries(scale).forEach(([shade, color]) => {
        const cssValue = this.oklchToCSS(color)
        variables[`--${prefix}-color-${state}-${shade}`] = cssValue
      })
    })
  }

  /**
   * 生成空间变量
   */
  private generateSpatialVariables(spatial: SpatialSystem, variables: Record<string, string>, prefix: string): void {
    // 间距
    Object.entries(spatial.spacing).forEach(([key, value]) => {
      variables[`--${prefix}-spacing-${key}`] = `${value}px`
    })

    // 尺寸
    Object.entries(spatial.sizes).forEach(([key, value]) => {
      variables[`--${prefix}-size-${key}`] = `${value}px`
    })

    // 字体大小
    Object.entries(spatial.fontSizes).forEach(([key, value]) => {
      variables[`--${prefix}-font-size-${key}`] = `${value}px`
    })

    // 圆角
    Object.entries(spatial.radii).forEach(([key, value]) => {
      variables[`--${prefix}-radius-${key}`] = `${value}px`
    })
  }

  /**
   * 生成动画变量
   */
  private generateAnimationVariables(animations: AnimationSystem, variables: Record<string, string>, prefix: string): void {
    // 缓动函数
    Object.entries(animations.easings).forEach(([key, value]) => {
      variables[`--${prefix}-ease-${key}`] = value
    })

    // 持续时间
    Object.entries(animations.durations).forEach(([key, value]) => {
      variables[`--${prefix}-duration-${key}`] = `${value}ms`
    })

    // 延迟时间
    Object.entries(animations.delays).forEach(([key, value]) => {
      variables[`--${prefix}-delay-${key}`] = `${value}ms`
    })
  }

  /**
   * 生成元数据变量
   */
  private generateMetadataVariables(theme: CompleteCalculationResult, variables: Record<string, string>, prefix: string): void {
    variables[`--${prefix}-theme-id`] = theme.recipe.id
    variables[`--${prefix}-theme-version`] = theme.recipe.version
    variables[`--${prefix}-theme-calculated-at`] = theme.metadata.calculatedAt.toString()
    variables[`--${prefix}-theme-calculation-time`] = `${theme.metadata.calculationTime.toFixed(2)}ms`
  }

  // ========================================================================
  // 颜色转换工具方法
  // ========================================================================

  /**
   * OKLCH转CSS字符串
   */
  private oklchToCSS(color: OKLCHColor): string {
    const { l, c, h, a = 1 } = color
    const clampedC = Math.min(0.4, Math.max(0, c))
    const clampedL = Math.min(1, Math.max(0, l))

    let css = `oklch(${(clampedL * 100).toFixed(2)}% ${(clampedC * 100).toFixed(2)}% ${h.toFixed(2)}`

    if (a < 1) {
      css += ` / ${a.toFixed(2)}`
    }

    css += ')'

    return css
  }

  /**
   * 获取基础色相值
   */
  private getBaseHue(hueName: string): number {
    const hueMap: Record<string, number> = {
      red: 20,
      orange: 45,
      yellow: 65,
      green: 140,
      cyan: 190,
      blue: 240,
      purple: 280,
      pink: 330,
      indigo: 260
    }

    return hueMap[hueName] || 240
  }

  /**
   * 计算色阶对应的明度
   */
  private calculateLightnessForShade(shade: number, mode: string, lightness: any): number {
    const { factor } = lightness

    // 基础明度映射
    const baseLightness: Record<number, number> = {
      50: mode === 'dark' ? 0.98 : 0.96,
      100: mode === 'dark' ? 0.94 : 0.91,
      200: mode === 'dark' ? 0.88 : 0.83,
      300: mode === 'dark' ? 0.78 : 0.72,
      400: mode === 'dark' ? 0.68 : 0.61,
      500: mode === 'dark' ? 0.58 : 0.51,
      600: mode === 'dark' ? 0.45 : 0.41,
      700: mode === 'dark' ? 0.32 : 0.31,
      800: mode === 'dark' ? 0.22 : 0.21,
      900: mode === 'dark' ? 0.14 : 0.13,
      950: mode === 'dark' ? 0.08 : 0.07
    }

    const baseL = baseLightness[shade] || 0.5
    const adjustedL = baseL * factor

    // 确保明度在合理范围内
    return Math.min(0.98, Math.max(0.02, adjustedL))
  }

  /**
   * 计算色阶对应的色度
   */
  private calculateChromaForShade(shade: number, saturationFactor: number): number {
    // 基础色度映射
    const baseChroma: Record<number, number> = {
      50: 0.02,
      100: 0.04,
      200: 0.08,
      300: 0.12,
      400: 0.16,
      500: 0.18,
      600: 0.16,
      700: 0.14,
      800: 0.10,
      900: 0.06,
      950: 0.03
    }

    const baseC = baseChroma[shade] || 0.1
    const adjustedC = baseC * saturationFactor

    // 确保色度在合理范围内
    return Math.min(0.4, Math.max(0, adjustedC))
  }

  /**
   * 获取密度乘数
   */
  private getDensityMultiplier(level: string): number {
    const multipliers = {
      compact: 0.85,
      comfortable: 1.0,
      spacious: 1.15
    }

    return multipliers[level as keyof typeof multipliers] || 1.0
  }

  /**
   * 获取圆度乘数
   */
  private getRoundnessMultiplier(level: string): number {
    const multipliers = {
      sharp: 0.2,
      rounded: 1.0,
      circular: 2.0
    }

    return multipliers[level as keyof typeof multipliers] || 1.0
  }

  // ========================================================================
  // 缓存管理
  // ========================================================================

  /**
   * 生成缓存键
   */
  private generateCacheKey(recipe: DynamicRecipe, context?: CalculationContext): string {
    const recipeHash = this.hashObject({
      id: recipe.id,
      version: recipe.version,
      axes: recipe.axes,
      customTokens: recipe.customTokens
    })

    const contextHash = context ? this.hashObject(context) : ''

    return `${recipeHash}-${contextHash}`
  }

  /**
   * 从缓存获取
   */
  private getFromCache(key: string): CalculationCacheItem | null {
    const item = this.cache.get(key)

    if (!item) return null

    // 检查是否过期
    if (item.expiresAt < Date.now()) {
      this.cache.delete(key)
      return null
    }

    return item
  }

  /**
   * 设置缓存
   */
  private setCache(key: string, result: any, calculationTime: number): void {
    const expiresAt = Date.now() + (this.config.cacheExpirationMs || 300000) // 5分钟
    const size = this.estimateObjectSize(result)

    const item: CalculationCacheItem = {
      result,
      timestamp: Date.now(),
      expiresAt,
      calculationTime,
      hitCount: 0,
      size
    }

    this.cache.set(key, item)

    // 检查缓存大小限制
    this.enforceCacheLimit()
  }

  /**
   * 启动缓存清理
   */
  private startCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now()
      const expired: string[] = []

      this.cache.forEach((item, key) => {
        if (item.expiresAt < now) {
          expired.push(key)
        }
      })

      expired.forEach(key => this.cache.delete(key))

      if (expired.length > 0) {
        console.log(`🧹 清理过期缓存: ${expired.length} 项`)
      }
    }, 60000) // 每分钟清理一次
  }

  /**
   * 强制缓存大小限制
   */
  private enforceCacheLimit(): void {
    const maxSize = this.config.maxCacheSize || 100

    if (this.cache.size <= maxSize) return

    // 按使用频率和时间排序
    const entries = Array.from(this.cache.entries()).sort((a, b) => {
      const scoreA = a[1].hitCount + (Date.now() - a[1].timestamp) / 1000000
      const scoreB = b[1].hitCount + (Date.now() - b[1].timestamp) / 1000000
      return scoreA - scoreB
    })

    // 删除最少使用的项
    const toDelete = entries.slice(0, entries.length - maxSize)
    toDelete.forEach(([key]) => this.cache.delete(key))
  }

  /**
   * 预热缓存
   */
  private async warmupCache(): Promise<void> {
    // 预热常用颜色转换
    const commonColors = [
      { l: 0.5, c: 0.18, h: 240 },
      { l: 0.3, c: 0.16, h: 240 },
      { l: 0.9, c: 0.02, h: 0 }
    ]

    for (const color of commonColors) {
      this.convertColor(color as OKLCHColor)
    }
  }

  // ========================================================================
  // Web Workers支持
  // ========================================================================

  /**
   * 初始化Web Workers
   */
  private async initializeWorkers(): Promise<void> {
    // Web Workers初始化逻辑
    // 暂时跳过实现
    console.log('👷 Web Workers 初始化跳过（暂未实现）')
  }

  // ========================================================================
  // 工具方法
  // ========================================================================

  /**
   * 对象哈希
   */
  private hashObject(obj: any): string {
    return btoa(JSON.stringify(obj)).slice(0, 16)
  }

  /**
   * 估算对象大小
   */
  private estimateObjectSize(obj: any): number {
    return JSON.stringify(obj).length * 2 // 粗略估算（UTF-16）
  }

  /**
   * 获取计算次数
   */
  private getCalculationCount(type: string): number {
    return this.performanceMetrics.get(type) || 0
  }

  /**
   * 增加计算次数
   */
  private incrementCalculationCount(type: string): void {
    const current = this.performanceMetrics.get(type) || 0
    this.performanceMetrics.set(type, current + 1)
  }

  /**
   * 颜色转换
   */
  private convertColor(color: OKLCHColor): ColorConversionResult {
    const cacheKey = `${color.l}-${color.c}-${color.h}`

    let result = this.colorCache.get(cacheKey)
    if (result) return result

    // 简化的颜色转换（实际应该使用完整的颜色转换库）
    result = {
      oklch: color,
      srgb: 'rgb(59, 130, 246)', // 占位符
      p3: 'color(display-p3 0.23 0.51 0.96)', // 占位符
      hsl: 'hsl(217, 91%, 60%)', // 占位符
      hex: '#3b82f6' // 占位符
    }

    this.colorCache.set(cacheKey, result)
    return result
  }

  /**
   * 获取缓存统计
   */
  getCacheStats(): CacheStats {
    const items = Array.from(this.cache.values())
    const totalSize = items.reduce((sum, item) => sum + item.size, 0)
    const totalHits = items.reduce((sum, item) => sum + item.hitCount, 0)

    return {
      size: this.cache.size,
      totalSize,
      totalHits,
      averageHitRate: items.length > 0 ? totalHits / items.length : 0,
      oldestItem: items.length > 0 ? Math.min(...items.map(item => item.timestamp)) : 0,
      newestItem: items.length > 0 ? Math.max(...items.map(item => item.timestamp)) : 0
    }
  }

  /**
   * 清空缓存
   */
  clearCache(): void {
    this.cache.clear()
    this.colorCache.clear()
    this.performanceMetrics.clear()
    console.log('🗑️ 缓存已清空')
  }
}

// ============================================================================
// 类型定义
// ============================================================================

export interface CalculatorConfig {
  /** 缓存过期时间（毫秒） */
  cacheExpirationMs?: number
  /** 最大缓存大小 */
  maxCacheSize?: number
  /** 是否启用Web Workers */
  enableWorkers?: boolean
  /** 是否启用性能监控 */
  enablePerformanceMonitoring?: boolean
}

export interface CacheStats {
  size: number
  totalSize: number
  totalHits: number
  averageHitRate: number
  oldestItem: number
  newestItem: number
}

// ============================================================================
// 默认实例和便捷函数
// ============================================================================

/**
 * 默认计算器实例
 */
export const sevenAxisCalculator = new SevenAxisCalculator({
  cacheExpirationMs: 300000, // 5分钟
  maxCacheSize: 200,
  enableWorkers: true,
  enablePerformanceMonitoring: true
})

/**
 * 便捷函数
 */
export const calculateTheme = (recipe: DynamicRecipe, context?: CalculationContext) =>
  sevenAxisCalculator.calculateCompleteTheme(recipe, context)

export const getCacheStats = () => sevenAxisCalculator.getCacheStats()

export const clearThemeCache = () => sevenAxisCalculator.clearCache()

export default {
  SevenAxisCalculator,
  sevenAxisCalculator,
  calculateTheme,
  getCacheStats,
  clearThemeCache
}