/**
 * 🧮 26参数计算器
 *
 * 负责将26个用户参数转换为完整的主题配置
 */

import type {
  TwentySixParams,
  ThemeCalculationResult,
  FontSystem,
  SizeScale,
  SpacingSystem,
  ColorScale
} from './twenty-six-params'
import type { OKLCHColor } from '../seven-axis-calculator'

// ============================================================================
// 参数计算引擎
// ============================================================================

/**
 * 26参数计算引擎主类
 */
export class TwentySixParamCalculator {
  private colorCache: Map<string, ColorScale>
  private typographyCache: Map<string, any>
  private layoutCache: Map<string, any>

  constructor() {
    this.colorCache = new Map()
    this.typographyCache = new Map()
    this.layoutCache = new Map()
  }

  /**
   * 计算完整主题
   */
  async calculateTheme(params: TwentySixParams): Promise<ThemeCalculationResult> {
    const startTime = performance.now()

    // 并行计算各个系统
    const [
      colors,
      typography,
      layout
    ] = await Promise.all([
      this.calculateColorSystem(params),
      this.calculateTypographySystem(params),
      this.calculateLayoutSystem(params)
    ])

    // 生成CSS变量
    const cssVariables = this.generateCSSVariables(colors, typography, layout, params)

    const endTime = performance.now()

    return {
      colors,
      typography,
      layout,
      cssVariables,
      metadata: {
        calculatedAt: Date.now(),
        calculationTime: endTime - startTime,
        version: '1.0.0'
      }
    }
  }

  // ========================================================================
  // 颜色系统计算
  // ========================================================================

  /**
   * 计算颜色系统
   */
  private async calculateColorSystem(params: TwentySixParams): Promise<ThemeCalculationResult['colors']> {
    const { mode, hue, saturation, lightness, contrast } = params

    // 主色调计算
    const primary = await this.calculateColorScale(
      hue.primary,
      saturation.factor,
      lightness.factor,
      mode.mode,
      contrast.ratio
    )

    // 次色调计算
    const secondary = hue.secondary ? await this.calculateColorScale(
      hue.secondary,
      saturation.factor,
      lightness.factor,
      mode.mode,
      contrast.ratio
    ) : undefined

    // 强调色计算
    const accent = hue.accent ? await this.calculateColorScale(
      hue.accent,
      saturation.factor * 1.2, // 强调色更鲜艳
      lightness.factor,
      mode.mode,
      contrast.ratio
    ) : undefined

    // 中性色计算
    const neutral = await this.calculateNeutralScale(mode.mode, lightness.factor, contrast.ratio)

    // 语义颜色计算
    const semantic = await this.calculateSemanticColors(mode.mode, contrast.ratio)

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
    hue: number,
    saturationFactor: number,
    lightnessFactor: number,
    mode: string,
    contrastRatio: number
  ): Promise<ColorScale> {
    const cacheKey = `${hue}-${saturationFactor}-${lightnessFactor}-${mode}-${contrastRatio}`

    if (this.colorCache.has(cacheKey)) {
      return this.colorCache.get(cacheKey)!
    }

    const scale: ColorScale = {}
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

    for (const step of steps) {
      const l = this.calculateLightnessForStep(step, mode, lightnessFactor, contrastRatio)
      const c = this.calculateChromaForStep(step, saturationFactor)

      scale[step] = {
        mode: 'oklch',
        l,
        c,
        h: hue
      }
    }

    this.colorCache.set(cacheKey, scale)
    return scale
  }

  /**
   * 计算中性色色阶
   */
  private async calculateNeutralScale(
    mode: string,
    lightnessFactor: number,
    contrastRatio: number
  ): Promise<ColorScale> {
    const scale: ColorScale = {}
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

    for (const step of steps) {
      const l = this.calculateLightnessForStep(step, mode, lightnessFactor, contrastRatio)
      const isHighContrast = contrastRatio > 0.7

      scale[step] = {
        mode: 'oklch',
        l,
        c: isHighContrast ? 0 : 0.001, // 高对比模式下完全无色度
        h: 0
      }
    }

    return scale
  }

  /**
   * 计算语义颜色
   */
  private async calculateSemanticColors(
    mode: string,
    contrastRatio: number
  ): Promise<ThemeCalculationResult['colors']['semantic']> {
    const semanticHues = {
      success: 140, // 绿色
      warning: 50,  // 黄色
      error: 20,    // 红色
      info: 220     // 蓝色
    }

    const semantic: any = {}

    for (const [state, hue] of Object.entries(semanticHues)) {
      semantic[state] = await this.calculateColorScale(
        hue,
        state === 'warning' ? 0.4 : 0.3, // 警告色使用不同饱和度
        0.5,
        mode,
        contrastRatio
      )
    }

    return semantic
  }

  /**
   * 计算色阶对应的明度
   */
  private calculateLightnessForStep(
    step: number,
    mode: string,
    lightnessFactor: number,
    contrastRatio: number
  ): number {
    // 基础明度映射 (OKLCH 空间)
    const baseLightnessMap: Record<string, Record<number, number>> = {
      light: {
        50: 0.97, 100: 0.92, 200: 0.85, 300: 0.75, 400: 0.65,
        500: 0.55, 600: 0.45, 700: 0.35, 800: 0.25, 900: 0.17, 950: 0.10
      },
      dark: {
        50: 0.99, 100: 0.96, 200: 0.90, 300: 0.82, 400: 0.72,
        500: 0.62, 600: 0.50, 700: 0.40, 800: 0.30, 900: 0.20, 950: 0.12
      }
    }

    const modeMap = mode === 'dark' ? 'dark' : 'light'
    const baseL = baseLightnessMap[modeMap][step] || 0.5

    // 应用亮度和对比度调整
    const adjustedL = baseL * lightnessFactor

    // 根据对比度调整
    const contrastMultiplier = contrastRatio > 0.5
      ? 1 + (contrastRatio - 0.5) * 0.4
      : 1 - (0.5 - contrastRatio) * 0.4

    const finalL = Math.max(0, Math.min(1, adjustedL * contrastMultiplier))

    return finalL
  }

  /**
   * 计算色阶对应的色度
   */
  private calculateChromaForStep(step: number, saturationFactor: number): number {
    // 基础色度映射
    const baseChromaMap: Record<number, number> = {
      50: 0.01, 100: 0.02, 200: 0.04, 300: 0.08, 400: 0.12,
      500: 0.14, 600: 0.12, 700: 0.10, 800: 0.07, 900: 0.04, 950: 0.02
    }

    const baseC = baseChromaMap[step] || 0.1
    return Math.min(0.4, baseC * saturationFactor)
  }

  // ========================================================================
  // 字体系统计算
  // ========================================================================

  /**
   * 计算字体系统
   */
  private async calculateTypographySystem(params: TwentySixParams): Promise<ThemeCalculationResult['typography']> {
    const { fonts, density, sizes } = params

    const families: Record<string, string> = {
      primary: fonts.primary.family,
      secondary: fonts.secondary.family,
      mono: fonts.mono.family,
      display: fonts.display.family,
      code: fonts.code.family
    }

    const weights: Record<string, number> = {
      primary: fonts.primary.weight,
      secondary: fonts.secondary.weight,
      mono: fonts.mono.weight,
      display: fonts.display.weight,
      code: fonts.code.weight
    }

    const fontSizes: Record<string, number> = {
      xs: sizes.xs,
      sm: sizes.sm,
      md: sizes.md,
      lg: sizes.lg,
      xl: sizes.xl,
      '2xl': sizes['2xl']
    }

    const lineHeights: Record<string, number> = {
      xs: this.calculateLineHeight(fontSizes.xs),
      sm: this.calculateLineHeight(fontSizes.sm),
      md: this.calculateLineHeight(fontSizes.md),
      lg: this.calculateLineHeight(fontSizes.lg),
      xl: this.calculateLineHeight(fontSizes.xl),
      '2xl': this.calculateLineHeight(fontSizes['2xl'])
    }

    return {
      families,
      sizes: fontSizes,
      weights,
      lineHeights
    }
  }

  /**
   * 根据字体大小计算行高
   */
  private calculateLineHeight(fontSize: number): number {
    // 小字体需要更大的行高，大字体行高相对较小
    if (fontSize <= 12) return 1.6
    if (fontSize <= 16) return 1.5
    if (fontSize <= 20) return 1.4
    if (fontSize <= 24) return 1.3
    return 1.2
  }

  // ========================================================================
  // 布局系统计算
  // ========================================================================

  /**
   * 计算布局系统
   */
  private async calculateLayoutSystem(params: TwentySixParams): Promise<ThemeCalculationResult['layout']> {
    const { sizes, spacing, roundness, density } = params

    const densityMultiplier = this.getDensityMultiplier(density.level, density.customScale)

    // 应用密度调整的尺寸
    const adjustedSizes: SizeScale = {
      xs: Math.round(sizes.xs * densityMultiplier),
      sm: Math.round(sizes.sm * densityMultiplier),
      md: Math.round(sizes.md * densityMultiplier),
      lg: Math.round(sizes.lg * densityMultiplier),
      xl: Math.round(sizes.xl * densityMultiplier),
      '2xl': Math.round(sizes['2xl'] * densityMultiplier)
    }

    // 应用密度调整的间距
    const adjustedSpacing: SpacingSystem = {
      space0: spacing.space0,
      space1: Math.round(spacing.space1 * densityMultiplier),
      space2: Math.round(spacing.space2 * densityMultiplier),
      space3: Math.round(spacing.space3 * densityMultiplier),
      space4: Math.round(spacing.space4 * densityMultiplier),
      space5: Math.round(spacing.space5 * densityMultiplier),
      space6: Math.round(spacing.space6 * densityMultiplier),
      space7: Math.round(spacing.space7 * densityMultiplier)
    }

    // 圆角系统
    const radii = {
      none: 0,
      sm: Math.round(roundness.radius * 0.5),
      md: Math.round(roundness.radius),
      lg: Math.round(roundness.radius * 1.5),
      xl: Math.round(roundness.radius * 2),
      full: 9999
    }

    return {
      sizes: adjustedSizes,
      spacing: adjustedSpacing,
      radii
    }
  }

  /**
   * 获取密度乘数
   */
  private getDensityMultiplier(level: string, customScale?: number): number {
    const baseMultipliers = {
      compact: 0.85,
      comfortable: 1.0,
      spacious: 1.15
    }

    const baseMultiplier = baseMultipliers[level as keyof typeof baseMultipliers] || 1.0
    return customScale ? baseMultiplier * customScale : baseMultiplier
  }

  // ========================================================================
  // CSS变量生成
  // ========================================================================

  /**
   * 生成CSS变量
   */
  private generateCSSVariables(
    colors: ThemeCalculationResult['colors'],
    typography: ThemeCalculationResult['typography'],
    layout: ThemeCalculationResult['layout'],
    params: TwentySixParams
  ): Record<string, string> {
    const variables: Record<string, string> = {}

    // 颜色变量
    this.generateColorVariables(colors, variables)

    // 字体变量
    this.generateTypographyVariables(typography, variables)

    // 布局变量
    this.generateLayoutVariables(layout, variables)

    // 七轴参数变量
    this.generateAxisVariables(params, variables)

    return variables
  }

  /**
   * 生成颜色变量
   */
  private generateColorVariables(colors: ThemeCalculationResult['colors'], variables: Record<string, string>): void {
    // 主色调
    Object.entries(colors.primary).forEach(([shade, color]) => {
      variables[`--xorigo-color-primary-${shade}`] = this.oklchToCSS(color)
    })

    // 次色调
    if (colors.secondary) {
      Object.entries(colors.secondary).forEach(([shade, color]) => {
        variables[`--xorigo-color-secondary-${shade}`] = this.oklchToCSS(color)
      })
    }

    // 强调色
    if (colors.accent) {
      Object.entries(colors.accent).forEach(([shade, color]) => {
        variables[`--xorigo-color-accent-${shade}`] = this.oklchToCSS(color)
      })
    }

    // 中性色
    Object.entries(colors.neutral).forEach(([shade, color]) => {
      variables[`--xorigo-color-neutral-${shade}`] = this.oklchToCSS(color)
    })

    // 语义色
    Object.entries(colors.semantic).forEach(([state, scale]) => {
      Object.entries(scale).forEach(([shade, color]) => {
        variables[`--xorigo-color-${state}-${shade}`] = this.oklchToCSS(color)
      })
    })
  }

  /**
   * 生成字体变量
   */
  private generateTypographyVariables(typography: ThemeCalculationResult['typography'], variables: Record<string, string>): void {
    // 字体族
    Object.entries(typography.families).forEach(([key, family]) => {
      variables[`--xorigo-font-${key}`] = family
    })

    // 字体大小
    Object.entries(typography.sizes).forEach(([key, size]) => {
      variables[`--xorigo-size-${key}`] = `${size}px`
    })

    // 字体权重
    Object.entries(typography.weights).forEach(([key, weight]) => {
      variables[`--xorigo-weight-${key}`] = String(weight)
    })

    // 行高
    Object.entries(typography.lineHeights).forEach(([key, lineHeight]) => {
      variables[`--xorigo-line-height-${key}`] = String(lineHeight)
    })
  }

  /**
   * 生成布局变量
   */
  private generateLayoutVariables(layout: ThemeCalculationResult['layout'], variables: Record<string, string>): void {
    // 间距
    Object.entries(layout.spacing).forEach(([key, value]) => {
      variables[`--xorigo-space-${key.replace('space', '')}`] = `${value}px`
    })

    // 圆角
    Object.entries(layout.radii).forEach(([key, value]) => {
      variables[`--xorigo-radius-${key}`] = `${value}px`
    })
  }

  /**
   * 生成七轴变量
   */
  private generateAxisVariables(params: TwentySixParams, variables: Record<string, string>): void {
    // 七轴参数
    variables['--xorigo-mode'] = params.mode.mode
    variables['--xorigo-hue'] = `${params.hue.primary}deg`
    variables['--xorigo-saturation'] = String(params.saturation.factor)
    variables['--xorigo-lightness'] = String(params.lightness.factor)
    variables['--xorigo-density'] = params.density.level
    variables['--xorigo-roundness'] = String(params.roundness.level)
    variables['--xorigo-contrast'] = String(params.contrast.level)
  }

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

  // ========================================================================
  // 公共方法
  // ========================================================================

  /**
   * 清空缓存
   */
  clearCache(): void {
    this.colorCache.clear()
    this.typographyCache.clear()
    this.layoutCache.clear()
  }

  /**
   * 获取缓存统计
   */
  getCacheStats() {
    return {
      colorCacheSize: this.colorCache.size,
      typographyCacheSize: this.typographyCache.size,
      layoutCacheSize: this.layoutCache.size
    }
  }
}

// ============================================================================
// 默认实例
// ============================================================================

export const twentySixParamCalculator = new TwentySixParamCalculator()

// ============================================================================
// 便捷函数
// ============================================================================

/**
 * 计算主题的便捷函数
 */
export async function calculateAdvancedTheme(params: TwentySixParams): Promise<ThemeCalculationResult> {
  return twentySixParamCalculator.calculateTheme(params)
}

/**
 * 生成预览用的简化主题
 */
export async function generatePreviewTheme(params: TwentySixParams): Promise<Partial<ThemeCalculationResult>> {
  const fullTheme = await calculateAdvancedTheme(params)

  // 预览只需要部分数据
  return {
    colors: fullTheme.colors,
    layout: fullTheme.layout,
    cssVariables: fullTheme.cssVariables
  }
}
