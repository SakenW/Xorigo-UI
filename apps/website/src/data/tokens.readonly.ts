/**
 * 🎯 Tokens 只读适配器
 *
 * 提供对 @xorigo-ui/tokens 的只读访问接口
 * 使用 Singleton 模式确保单一数据源
 * 完整的 Schema 验证和错误处理
 */

import {
  getCoreTokens,
  getAllRecipeMeta,
  getAllDensityPresets,
  buttonAliases,
  cardAliases,
  type DTCGCoreTokens as PackageDTCGCoreTokens,
  type DTCGRecipeMeta as PackageDTCGRecipeMeta,
  type DTCGDensityPreset as PackageDTCGDensityPreset,
} from '@xorigo-ui/tokens'

import {
  TokensSchema,
  type Tokens,
  type DTCGPalette,
  type DTCGRecipeMeta,
  type DTCGDensityPreset,
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
} from './types'

/**
 * Tokens 只读适配器类 (Singleton)
 */
export class TokensReadonlyAdapter {
  private static instance: TokensReadonlyAdapter | null = null
  private tokens: Tokens | null = null
  private validated: boolean = false
  private validationResult: ValidationResult | null = null

  /**
   * 私有构造函数，防止外部实例化
   */
  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): TokensReadonlyAdapter {
    if (!TokensReadonlyAdapter.instance) {
      TokensReadonlyAdapter.instance = new TokensReadonlyAdapter()
    }
    return TokensReadonlyAdapter.instance
  }

  /**
   * 初始化 Tokens 数据
   */
  private ensureInitialized(): void {
    if (!this.tokens) {
      try {
        const coreTokens = getCoreTokens()
        const recipes = getAllRecipeMeta()
        const densityPresets = getAllDensityPresets()

        // 验证核心令牌结构
        if (!coreTokens?.palettes) {
          throw new Error('Core tokens palettes is missing')
        }

        if (!coreTokens?.foundations) {
          throw new Error('Core tokens foundations is missing')
        }

        this.tokens = {
          palettes: {
            neutralScale: coreTokens.palettes.neutralScale as DTCGPalette,
            blueScale: coreTokens.palettes.blueScale as DTCGPalette,
            cyanScale: coreTokens.palettes.cyanScale as DTCGPalette,
            purpleScale: coreTokens.palettes.purpleScale as DTCGPalette,
            stateColors: coreTokens.palettes.stateColors as DTCGPalette,
          },
          foundations: coreTokens.foundations,
          recipes: recipes as Record<string, DTCGRecipeMeta>,
          densityPresets: densityPresets as Record<string, DTCGDensityPreset>,
          componentAliases: {
            button: buttonAliases as Record<string, any>,
            card: cardAliases as Record<string, any>,
          },
        }

        this.validated = false
        this.validationResult = null
      } catch (error) {
        let errorMessage = 'Tokens 初始化失败'
        let details: any = {}

        if (error instanceof Error) {
          if (error.message.includes('Cannot find module')) {
            errorMessage = 'Tokens 包未正确安装或导入失败'
            details.moduleError = error.message
          } else if (error.message.includes('is missing')) {
            errorMessage = 'Tokens 数据结构不完整'
            details.structureError = error.message
          } else {
            details.originalError = error.message
          }
        }

        throw new Error(`${errorMessage}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  /**
   * 获取所有设计令牌
   */
  getDesignTokens(): Tokens {
    this.ensureInitialized()
    return this.tokens!
  }

  /**
   * 获取核心调色板
   */
  getPalettes(): Tokens['palettes'] {
    this.ensureInitialized()
    return this.tokens!.palettes
  }

  /**
   * 获取特定调色板
   */
  getPalette(
    name: keyof Tokens['palettes']
  ): DTCGPalette {
    this.ensureInitialized()
    return this.tokens!.palettes[name]
  }

  /**
   * 获取基础令牌 (Typography, Spacing)
   */
  getFoundations(): Tokens['foundations'] {
    this.ensureInitialized()
    return this.tokens!.foundations
  }

  /**
   * 获取排版令牌
   */
  getTypography(): Record<string, any> {
    this.ensureInitialized()
    return this.tokens!.foundations.typography
  }

  /**
   * 获取间距令牌
   */
  getSpacing(): Record<string, any> {
    this.ensureInitialized()
    return this.tokens!.foundations.spacing
  }

  /**
   * 获取所有配方
   */
  getRecipes(): Record<string, DTCGRecipeMeta> {
    this.ensureInitialized()
    return this.tokens!.recipes
  }

  /**
   * 获取特定配方
   */
  getRecipe(name: string): DTCGRecipeMeta | undefined {
    this.ensureInitialized()
    const recipe = this.tokens!.recipes[name]
    return recipe ? (recipe as DTCGRecipeMeta) : undefined
  }

  /**
   * 获取所有密度预设
   */
  getDensityPresets(): Record<string, DTCGDensityPreset> {
    this.ensureInitialized()
    return this.tokens!.densityPresets
  }

  /**
   * 获取特定密度预设
   */
  getDensityPreset(name: string): DTCGDensityPreset | undefined {
    this.ensureInitialized()
    const preset = this.tokens!.densityPresets[name]
    return preset ? (preset as DTCGDensityPreset) : undefined
  }

  /**
   * 获取组件别名
   */
  getComponentAliases(): Record<string, Record<string, any>> {
    this.ensureInitialized()
    return this.tokens!.componentAliases
  }

  /**
   * 获取特定组件的别名
   */
  getComponentAlias(componentName: string): Record<string, any> | undefined {
    this.ensureInitialized()
    const alias = this.tokens!.componentAliases[componentName]
    return alias ? (alias as Record<string, any>) : undefined
  }

  /**
   * 根据主题名称获取主题令牌
   * 注意：当前实现返回配方，后续可能需要与 style-recipe 包集成
   */
  getThemeTokens(theme: string): DTCGRecipeMeta | undefined {
    this.ensureInitialized()
    const recipe = this.tokens!.recipes[theme]
    return recipe ? (recipe as DTCGRecipeMeta) : undefined
  }

  /**
   * 验证 Tokens 数据一致性
   */
  validateConsistency(): ValidationResult {
    this.ensureInitialized()

    // 如果已经验证过，直接返回缓存结果
    if (this.validated && this.validationResult) {
      return this.validationResult
    }

    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    try {
      // 使用 Zod Schema 验证整体结构
      const parseResult = TokensSchema.safeParse(this.tokens)

      if (!parseResult.success) {
        parseResult.error.issues.forEach((zodError) => {
          errors.push({
            path: zodError.path.join('.'),
            message: zodError.message,
            code: zodError.code,
          })
        })
      }

      // 额外的业务逻辑验证
      this.validatePalettes(errors, warnings)
      this.validateRecipes(errors, warnings)
      this.validateDensityPresets(errors, warnings)
      this.validateComponentAliases(warnings)

      this.validationResult = {
        valid: errors.length === 0,
        errors,
        warnings,
      }

      this.validated = true
      return this.validationResult
    } catch (error) {
      errors.push({
        path: 'tokens',
        message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'VALIDATION_ERROR',
      })

      this.validationResult = {
        valid: false,
        errors,
        warnings,
      }

      return this.validationResult
    }
  }

  /**
   * 验证调色板的完整性
   */
  private validatePalettes(
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!this.tokens) return

    const paletteNames = [
      'neutralScale',
      'blueScale',
      'cyanScale',
      'purpleScale',
      'stateColors',
    ] as const

    paletteNames.forEach((paletteName) => {
      const palette = this.tokens!.palettes[paletteName]
      if (!palette || Object.keys(palette).length === 0) {
        errors.push({
          path: `palettes.${paletteName}`,
          message: `Palette ${paletteName} is empty or missing`,
          code: 'MISSING_PALETTE',
        })
      }
    })
  }

  /**
   * 验证配方的完整性
   */
  private validateRecipes(
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!this.tokens) return

    if (Object.keys(this.tokens.recipes).length === 0) {
      warnings.push({
        path: 'recipes',
        message: 'No recipes found',
      })
    }

    Object.entries(this.tokens.recipes).forEach(([name, recipe]) => {
      const recipeData = recipe as DTCGRecipeMeta

      if (!recipeData.axes) {
        warnings.push({
          path: `recipes.${name}.axes`,
          message: `Recipe ${name} has no axes configuration`,
        })
      }

      if (!recipeData.a11y) {
        warnings.push({
          path: `recipes.${name}.a11y`,
          message: `Recipe ${name} has no accessibility configuration`,
        })
      }
    })
  }

  /**
   * 验证密度预设的完整性
   */
  private validateDensityPresets(
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!this.tokens) return

    const requiredPresets = ['comfortable', 'spacious', 'compact']

    requiredPresets.forEach((preset) => {
      if (!this.tokens!.densityPresets[preset]) {
        warnings.push({
          path: `densityPresets.${preset}`,
          message: `Missing density preset: ${preset}`,
        })
      }
    })
  }

  /**
   * 验证组件别名的完整性
   */
  private validateComponentAliases(warnings: ValidationWarning[]): void {
    if (!this.tokens) return

    if (Object.keys(this.tokens.componentAliases).length === 0) {
      warnings.push({
        path: 'componentAliases',
        message: 'No component aliases found',
      })
    }
  }

  /**
   * 重置实例（主要用于测试）
   */
  static resetInstance(): void {
    TokensReadonlyAdapter.instance = null
  }
}

// ============================================================================
// 便捷导出
// ============================================================================

/**
 * 获取全局 Tokens 适配器实例
 */
export function getTokensAdapter(): TokensReadonlyAdapter {
  return TokensReadonlyAdapter.getInstance()
}

/**
 * 全局只读 Tokens 适配器实例
 * 便捷导出，直接使用 Singleton 模式
 */
export const readonlyTokens = TokensReadonlyAdapter.getInstance()
