/**
 * 🎨 TH-UI 风格配方体系 - 配方引擎 (Recipe Engine)
 *
 * 核心功能：
 * 1. 解析风格配方 ID
 * 2. 生成三层令牌系统
 * 3. 应用轴锁规则
 * 4. 生成 CSS 变量
 * 5. 可访问性验证
 */

import type {
  StyleRecipe,
  StyleRecipeID,
  CoreTokens,
  RoleTokens,
  ComponentTokens,
  ParsedRecipe,
  RecipeEngineConfig,
  AxisLockRule,
  ResponseLevel,
  RecipeValidationResult,
  ModeAxis,
  BaseAxis,
  AccentAxis,
  ToneAxis,
  DensityAxis,
  MotionAxis,
  SurfaceAxis,
  StyleAxis,
  ColorScale,
} from '../types'
import { coreTokens } from '../tokens/core'
import { officialRecipes, getRecipe } from '../recipes'

// ============================================================================
// 配方引擎核心类 (Recipe Engine Core Class)
// ============================================================================

/**
 * 风格配方引擎
 */
export class StyleRecipeEngine {
  private config: RecipeEngineConfig
  private currentRecipe: StyleRecipe | null = null
  private axisLocks: AxisLockRule[] = []

  constructor(config: Partial<RecipeEngineConfig> = {}) {
    this.config = {
      defaultRecipe: 'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow',
      availableRecipes: officialRecipes,
      axisLocks: [],
      responseLevels: this.initResponseLevels(),
      oklchEnabled: true,
      accessibilityMode: 'standard',
      ...config,
    }
  }

  // ============================================================================
  // 配方解析与生成
  // ============================================================================

  /**
   * 解析并应用风格配方
   */
  public parseRecipe(recipeId: StyleRecipeID, axisLocks?: AxisLockRule[]): ParsedRecipe | null {
    const recipe = getRecipe(recipeId)
    if (!recipe) {
      console.error(`Recipe not found: ${recipeId}`)
      return null
    }

    this.currentRecipe = recipe
    this.axisLocks = axisLocks || this.config.axisLocks

    // 生成语义令牌
    const roleTokens = this.generateRoleTokens(recipe)

    // 生成组件别名令牌
    const componentTokens = this.generateComponentTokens(roleTokens)

    // 生成 CSS 变量
    const cssVariables = this.generateCSSVariables(roleTokens, componentTokens)

    return {
      recipe,
      tokens: {
        core: coreTokens,
        role: roleTokens,
        component: componentTokens,
      },
      cssVariables,
    }
  }

  /**
   * 生成语义令牌 (Role Tokens)
   */
  private generateRoleTokens(recipe: StyleRecipe): RoleTokens {
    const { mode, base, accent, tone, density, surface } = recipe

    // 解析各轴取值
    const baseColor = this.parseBaseAxis(base)
    const accentColor = this.parseAccentAxis(accent)
    const toneIntensity = this.parseToneAxis(tone)
    const densityMultiplier = this.parseDensityAxis(density)

    // 获取基础色板
    const neutralScale = coreTokens.colors.neutral
    const accentScale = this.getAccentScale(accentColor)

    // 应用非对称 Dark 模式映射
    const adjustedScales = this.applyDarkModeMapping(neutralScale, accentScale, mode, tone)

    // 生成语义颜色
    const background = this.generateBackgroundTokens(adjustedScales.neutral, mode, surface)
    const text = this.generateTextTokens(adjustedScales.neutral, mode)
    const border = this.generateBorderTokens(adjustedScales.neutral, mode)
    const accentColors = this.generateAccentTokens(adjustedScales.accent, toneIntensity)
    const states = this.generateStateTokens(adjustedScales, toneIntensity)

    return {
      background,
      text,
      border,
      accent: accentColors,
      states,
    }
  }

  /**
   * 生成组件别名令牌 (Component Tokens)
   */
  private generateComponentTokens(roleTokens: RoleTokens): ComponentTokens {
    return {
      button: {
        bg: roleTokens.accent.default,
        fg: roleTokens.text.inverse,
        border: roleTokens.accent.default,
        hover: roleTokens.accent.hover,
        active: roleTokens.accent.active,
      },
      input: {
        bg: roleTokens.background.surface,
        border: roleTokens.border.default,
        placeholder: roleTokens.text.muted,
        focus: roleTokens.accent.default,
      },
      card: {
        bg: roleTokens.background.surface,
        border: roleTokens.border.default,
        shadow: 'var(--shadow-elevated)',
      },
      modal: {
        bg: roleTokens.background.surface,
        overlay: 'oklch(0 0 0 / 0.5)',
        border: roleTokens.border.emphasis,
      },
      tooltip: {
        bg: roleTokens.text.primary,
        fg: roleTokens.text.inverse,
        border: roleTokens.border.emphasis,
      },
      // ... 更多组件令牌
    }
  }

  /**
   * 生成 CSS 变量
   */
  private generateCSSVariables(roleTokens: RoleTokens, componentTokens: ComponentTokens): Record<string, string> {
    const cssVars: Record<string, string> = {}

    // 语义令牌 CSS 变量
    Object.entries(roleTokens.background).forEach(([key, value]) => {
      cssVars[`--th-bg-${key}`] = value
    })

    Object.entries(roleTokens.text).forEach(([key, value]) => {
      cssVars[`--th-text-${key}`] = value
    })

    Object.entries(roleTokens.border).forEach(([key, value]) => {
      cssVars[`--th-border-${key}`] = value
    })

    Object.entries(roleTokens.accent).forEach(([key, value]) => {
      cssVars[`--th-accent-${key}`] = value
    })

    Object.entries(roleTokens.states).forEach(([key, value]) => {
      cssVars[`--th-state-${key}`] = value
    })

    // 组件别名令牌 CSS 变量
    Object.entries(componentTokens).forEach(([component, tokens]) => {
      Object.entries(tokens).forEach(([token, value]) => {
        cssVars[`--th-${component}-${token}`] = value
      })
    })

    return cssVars
  }

  // ============================================================================
  // 轴解析器 (Axis Parsers)
  // ============================================================================

  /**
   * 解析 Base 轴
   */
  private parseBaseAxis(base: BaseAxis): 'neutral-warm' | 'neutral-cool' | 'neutral-true' {
    const [colorType] = base.split('-') as [string]
    return colorType as 'neutral-warm' | 'neutral-cool' | 'neutral-true'
  }

  /**
   * 解析 Accent 轴
   */
  private parseAccentAxis(accent: AccentAxis): { strategy: string; hue: string } {
    const match = accent.match(/^(mono|analog|duo)\(([^)]+)\)$/)
    if (!match) {
      throw new Error(`Invalid accent format: ${accent}`)
    }

    return {
      strategy: match[1],
      hue: match[2],
    }
  }

  /**
   * 解析 Tone 轴
   */
  private parseToneAxis(tone: ToneAxis): number {
    const toneMap = {
      calm: 0.7,      // 降低彩度
      standard: 1.0,  // 标准
      vivid: 1.3,     // 增强彩度
    }
    return toneMap[tone]
  }

  /**
   * 解析 Density 轴
   */
  private parseDensityAxis(density: DensityAxis): number {
    const densityMap = {
      spacious: 1.2,    // 增加间距
      comfortable: 1.0, // 标准
      compact: 0.8,     // 减少间距
    }
    return densityMap[density]
  }

  // ============================================================================
  // 色彩处理工具 (Color Processing Utilities)
  // ============================================================================

  /**
   * 获取主色标度
   */
  private getAccentScale(accentColor: { strategy: string; hue: string }): ColorScale {
    const { hue } = accentColor

    // 尝试从核心令牌中获取对应色板
    if (hue in coreTokens.colors) {
      return coreTokens.colors[hue]
    }

    // 如果没有找到，使用默认的蓝色
    console.warn(`Color scale not found for hue: ${hue}, falling back to blue`)
    return coreTokens.colors.blue
  }

  /**
   * 应用 Dark 模式非对称映射
   */
  private applyDarkModeMapping(
    neutralScale: ColorScale,
    accentScale: ColorScale,
    mode: ModeAxis,
    tone: ToneAxis
  ): { neutral: ColorScale; accent: ColorScale } {
    if (mode === 'light' || mode === 'hc') {
      return { neutral: neutralScale, accent: accentScale }
    }

    const toneIntensity = this.parseToneAxis(tone)

    // Dark 模式：降低彩度，微提亮度
    const adjustedNeutral: ColorScale = {}
    const adjustedAccent: ColorScale = {}

    Object.entries(neutralScale).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('oklch(')) {
        const oklchMatch = value.match(/oklch\(([^)]+)\)/)
        if (oklchMatch) {
          const [l, c, h] = oklchMatch[1].split(' ').map(v => parseFloat(v))
          // 微提亮度，保持无彩度
          adjustedNeutral[key] = `oklch(${Math.min(l * 1.05, 0.98)} 0 ${h})`
        }
      } else {
        adjustedNeutral[key] = value
      }
    })

    Object.entries(accentScale).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('oklch(')) {
        const oklchMatch = value.match(/oklch\(([^)]+)\)/)
        if (oklchMatch) {
          const [l, c, h] = oklchMatch[1].split(' ').map(v => parseFloat(v))
          // 降彩度，微提亮度
          adjustedAccent[key] = `oklch(${Math.min(l * 1.08, 0.85)} ${c * 0.6 * toneIntensity} ${h})`
        }
      } else {
        adjustedAccent[key] = value
      }
    })

    return { neutral: adjustedNeutral, accent: adjustedAccent }
  }

  // ============================================================================
  // 语义令牌生成器 (Semantic Token Generators)
  // ============================================================================

  /**
   * 生成背景令牌
   */
  private generateBackgroundTokens(neutralScale: ColorScale, mode: ModeAxis, surface: SurfaceAxis): RoleTokens['background'] {
    return {
      primary: mode === 'dark' ? neutralScale[2] : neutralScale[15],
      surface: mode === 'dark' ? neutralScale[4] : neutralScale[13],
      elevated: mode === 'dark' ? neutralScale[6] : neutralScale[11],
    }
  }

  /**
   * 生成文本令牌
   */
  private generateTextTokens(neutralScale: ColorScale, mode: ModeAxis): RoleTokens['text'] {
    return {
      primary: mode === 'dark' ? neutralScale[14] : neutralScale[2],
      muted: mode === 'dark' ? neutralScale[11] : neutralScale[5],
      inverse: mode === 'dark' ? neutralScale[2] : neutralScale[14],
    }
  }

  /**
   * 生成边框令牌
   */
  private generateBorderTokens(neutralScale: ColorScale, mode: ModeAxis): RoleTokens['border'] {
    return {
      default: mode === 'dark' ? neutralScale[7] : neutralScale[10],
      emphasis: mode === 'dark' ? neutralScale[9] : neutralScale[8],
    }
  }

  /**
   * 生成强调色令牌
   */
  private generateAccentTokens(accentScale: ColorScale, toneIntensity: number): RoleTokens['accent'] {
    return {
      default: accentScale[8],
      hover: accentScale[7],
      active: accentScale[9],
    }
  }

  /**
   * 生成状态令牌
   */
  private generateStateTokens(
    scales: { neutral: ColorScale; accent: ColorScale },
    toneIntensity: number
  ): RoleTokens['states'] {
    return {
      success: coreTokens.states.success[8],
      warning: coreTokens.states.warning[8],
      error: coreTokens.states.error[8],
      info: coreTokens.states.info[8],
    }
  }

  // ============================================================================
  // 响应级别系统 (Response Level System)
  // ============================================================================

  /**
   * 初始化响应级别配置
   */
  private initResponseLevels(): Record<ResponseLevel, ResponseLevelConfig> {
    return {
      L0: {
        level: 'L0',
        description: '完全不随配方变化',
        responsiveAxes: [],
        typicalComponents: ['Logo', 'BrandBadge', 'CodeSyntax', 'DataViz'],
      },
      L1: {
        level: 'L1',
        description: '仅随 Mode/Base/Accent 变化',
        responsiveAxes: ['mode', 'base', 'accent'],
        typicalComponents: ['Typography', 'Link', 'Badge'],
      },
      L2: {
        level: 'L2',
        description: '再加密度与表面变化',
        responsiveAxes: ['mode', 'base', 'accent', 'density', 'surface'],
        typicalComponents: ['Table', 'Form', 'Card', 'List'],
      },
      L3: {
        level: 'L3',
        description: '七轴全响应',
        responsiveAxes: ['mode', 'base', 'accent', 'tone', 'density', 'motion', 'surface'],
        typicalComponents: ['Button', 'Popover', 'Tooltip', 'Dialog', 'Navigation'],
      },
    }
  }

  // ============================================================================
  // 可访问性验证 (Accessibility Validation)
  // ============================================================================

  /**
   * 验证配方可访问性
   */
  public validateAccessibility(recipe: StyleRecipe): RecipeValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // 解析配方生成令牌
    const parsed = this.parseRecipe(recipe.id)
    if (!parsed) {
      return {
        isValid: false,
        errors: ['Failed to parse recipe'],
        warnings: [],
        accessibilityReport: {
          contrastScore: 0,
          cvdScore: 0,
          motionScore: 0,
        },
      }
    }

    // 检查对比度
    const contrastScore = this.calculateContrastScore(parsed.tokens.role)

    // 检查 CVD 友好性
    const cvdScore = recipe.accessibility.cvdFriendly ? 100 : 50

    // 检查动效安全性
    const motionScore = recipe.accessibility.motionSafe ? 100 : 30

    // 生成警告
    if (recipe.tone === 'vivid' && recipe.mode === 'dark') {
      warnings.push('Vivid tone in dark mode may cause eye strain')
    }

    if (recipe.motion.includes('expressive') && !recipe.accessibility.motionSafe) {
      warnings.push('Expressive motion may affect users with vestibular disorders')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      accessibilityReport: {
        contrastScore,
        cvdScore,
        motionScore,
      },
    }
  }

  /**
   * 计算对比度分数
   */
  private calculateContrastScore(roleTokens: RoleTokens): number {
    // 简化的对比度计算，实际应该使用 OKLCH 对比度算法
    const bgL = this.extractLightness(roleTokens.background.primary)
    const textL = this.extractLightness(roleTokens.text.primary)

    const contrast = Math.abs(bgL - textL)

    // 映射到 0-100 分数
    return Math.min(Math.round(contrast * 200), 100)
  }

  /**
   * 从 OKLCH 值中提取亮度
   */
  private extractLightness(oklchValue: string): number {
    const match = oklchValue.match(/oklch\(([^)]+)\)/)
    if (match) {
      const [l] = match[1].split(' ').map(v => parseFloat(v))
      return l
    }
    return 0.5 // 默认值
  }

  // ============================================================================
  // 工具方法 (Utility Methods)
  // ============================================================================

  /**
   * 获取当前配方
   */
  public getCurrentRecipe(): StyleRecipe | null {
    return this.currentRecipe
  }

  /**
   * 获取配置
   */
  public getConfig(): RecipeEngineConfig {
    return this.config
  }

  /**
   * 更新配置
   */
  public updateConfig(newConfig: Partial<RecipeEngineConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * 应用轴锁
   */
  public applyAxisLocks(locks: AxisLockRule[]): void {
    this.axisLocks = [...this.axisLocks, ...locks]
  }

  /**
   * 清除轴锁
   */
  public clearAxisLocks(): void {
    this.axisLocks = []
  }
}

// ============================================================================
// 默认实例导出 (Default Instance Export)
// ============================================================================

/**
 * 默认配方引擎实例
 */
export const defaultRecipeEngine = new StyleRecipeEngine()

// ============================================================================
// 便捷函数 (Convenience Functions)
// ============================================================================

/**
 * 解析配方
 */
export function parseRecipe(recipeId: StyleRecipeID, axisLocks?: AxisLockRule[]): ParsedRecipe | null {
  return defaultRecipeEngine.parseRecipe(recipeId, axisLocks)
}

/**
 * 验证配方可访问性
 */
export function validateRecipeAccessibility(recipe: StyleRecipe): RecipeValidationResult {
  return defaultRecipeEngine.validateAccessibility(recipe)
}

/**
 * 获取当前配方
 */
export function getCurrentRecipe(): StyleRecipe | null {
  return defaultRecipeEngine.getCurrentRecipe()
}