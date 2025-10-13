/**
 * @fileoverview Recipes 只读适配层 - 配方系统数据访问
 * 提供对 @xorigo-ui/tokens 中配方数据的只读访问
 * 解析七轴配方ID,提供按轴筛选功能
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { type ValidationResult } from './types'

/**
 * 七轴配方结构
 */
export interface Recipe {
  id: string // 七轴配方ID: mode.base.accent.tone.density.motion.surface
  name: string
  description?: string
  axes: {
    mode: 'light' | 'dark' | 'hc' // 亮暗模式
    base: string // 中性基底 (neutral-true-mid, neutral-cool-high等)
    accent: string // 强调色策略 (mono(blue), duo(cyan,magenta)等)
    tone: 'calm' | 'standard' | 'vivid' // 色调
    density: 'compact' | 'comfortable' | 'spacious' // 密度
    motion: 'subtle' | 'standard' | 'expressive' // 动效
    surface: string // 表面包 (flat, soft-shadow, glass等)
  }
  tokens?: Record<string, any> // 配方令牌
  preview?: {
    primaryColor?: string
    gradientColors?: string[]
  }
}

/**
 * 配方筛选选项
 */
export interface RecipeFilterOptions {
  mode?: 'light' | 'dark' | 'hc' | 'all'
  tone?: 'calm' | 'standard' | 'vivid' | 'all'
  density?: 'compact' | 'comfortable' | 'spacious' | 'all'
  motion?: 'subtle' | 'standard' | 'expressive' | 'all'
  accentHue?: string // 强调色色相 (blue, cyan, purple等)
}

/**
 * Recipes 只读适配器类 (Singleton)
 */
class RecipesReadonlyAdapter {
  private static instance: RecipesReadonlyAdapter
  private recipes: Recipe[] = []
  private recipeMap: Map<string, Recipe> = new Map()
  private validated: boolean = false

  private constructor() {}

  static getInstance(): RecipesReadonlyAdapter {
    if (!RecipesReadonlyAdapter.instance) {
      RecipesReadonlyAdapter.instance = new RecipesReadonlyAdapter()
    }
    return RecipesReadonlyAdapter.instance
  }

  /**
   * 解析七轴配方ID
   */
  private parseRecipeId(id: string): Recipe['axes'] | null {
    // 格式: mode.base.accent.tone.density.motion.surface
    // 示例: light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow
    const regex =
      /^(light|dark|hc)\.(neutral-(?:true|warm|cool)-(?:low|mid|high))\.(mono|analog|complementary|duo|triad|compound)\(([^)]+)\)\.(calm|standard|vivid)\.(compact|comfortable|spacious)\.(subtle|standard|expressive)\.(flat|soft-shadow|glass|glass\+neon|neon|spring)$/

    const match = id.match(regex)
    if (!match) {
      return null
    }

    return {
      mode: match[1] as 'light' | 'dark' | 'hc',
      base: match[2],
      accent: `${match[3]}(${match[4]})`,
      tone: match[5] as 'calm' | 'standard' | 'vivid',
      density: match[7] as 'compact' | 'comfortable' | 'spacious',
      motion: match[8] as 'subtle' | 'standard' | 'expressive',
      surface: match[9],
    }
  }

  /**
   * 提取强调色色相
   */
  private extractAccentHue(accent: string): string {
    const match = accent.match(/\(([^)]+)\)/)
    if (match) {
      return match[1].split(',')[0].trim() // 取第一个色相
    }
    return ''
  }

  /**
   * 初始化配方数据
   */
  private ensureLoaded(): void {
    if (this.recipes.length > 0) {
      return
    }

    try {
      // 读取 tokens/src/index.json
      const tokensPath = join(process.cwd(), '../../packages/tokens/src/index.json')
      const content = readFileSync(tokensPath, 'utf-8')
      const tokensData = JSON.parse(content)

      // 解析 recipes 对象
      if (tokensData.recipes) {
        Object.entries(tokensData.recipes).forEach(([key, value]: [string, any]) => {
          if (value.$type === 'recipe' && value.id) {
            const axes = this.parseRecipeId(value.id)
            if (axes) {
              const recipe: Recipe = {
                id: value.id,
                name: key,
                description: value.$description,
                axes,
                tokens: value.modes || value.tokens,
                preview: value.preview,
              }
              this.recipes.push(recipe)
              this.recipeMap.set(value.id, recipe)
              this.recipeMap.set(key, recipe) // 同时支持按名称查询
            }
          }
        })
      }

      this.validated = false
    } catch (error) {
      throw new Error(`加载 Recipes 失败: ${error}`)
    }
  }

  /**
   * 获取所有配方
   */
  getAllRecipes(): Recipe[] {
    this.ensureLoaded()
    return [...this.recipes]
  }

  /**
   * 根据ID或名称获取配方
   */
  getRecipeById(idOrName: string): Recipe | undefined {
    this.ensureLoaded()
    return this.recipeMap.get(idOrName)
  }

  /**
   * 根据轴筛选配方
   */
  getRecipesByAxis(axis: keyof Recipe['axes'], value: string): Recipe[] {
    this.ensureLoaded()
    return this.recipes.filter((recipe) => recipe.axes[axis] === value)
  }

  /**
   * 高级筛选配方
   */
  filterRecipes(options: RecipeFilterOptions): Recipe[] {
    this.ensureLoaded()

    return this.recipes.filter((recipe) => {
      // 模式筛选
      if (options.mode && options.mode !== 'all' && recipe.axes.mode !== options.mode) {
        return false
      }

      // 色调筛选
      if (options.tone && options.tone !== 'all' && recipe.axes.tone !== options.tone) {
        return false
      }

      // 密度筛选
      if (
        options.density &&
        options.density !== 'all' &&
        recipe.axes.density !== options.density
      ) {
        return false
      }

      // 动效筛选
      if (
        options.motion &&
        options.motion !== 'all' &&
        recipe.axes.motion !== options.motion
      ) {
        return false
      }

      // 强调色筛选
      if (options.accentHue) {
        const recipeHue = this.extractAccentHue(recipe.axes.accent)
        if (!recipeHue.includes(options.accentHue)) {
          return false
        }
      }

      return true
    })
  }

  /**
   * 获取所有模式 (light/dark/hc)
   */
  getModes(): Array<'light' | 'dark' | 'hc'> {
    this.ensureLoaded()
    const modes = new Set(this.recipes.map((r) => r.axes.mode))
    return Array.from(modes)
  }

  /**
   * 获取所有色调
   */
  getTones(): Array<'calm' | 'standard' | 'vivid'> {
    this.ensureLoaded()
    const tones = new Set(this.recipes.map((r) => r.axes.tone))
    return Array.from(tones)
  }

  /**
   * 获取所有密度
   */
  getDensities(): Array<'compact' | 'comfortable' | 'spacious'> {
    this.ensureLoaded()
    const densities = new Set(this.recipes.map((r) => r.axes.density))
    return Array.from(densities)
  }

  /**
   * 获取所有动效级别
   */
  getMotionLevels(): Array<'subtle' | 'standard' | 'expressive'> {
    this.ensureLoaded()
    const motions = new Set(this.recipes.map((r) => r.axes.motion))
    return Array.from(motions)
  }

  /**
   * 获取所有强调色色相
   */
  getAccentHues(): string[] {
    this.ensureLoaded()
    const hues = new Set<string>()
    this.recipes.forEach((recipe) => {
      const hue = this.extractAccentHue(recipe.axes.accent)
      if (hue) {
        hue.split(',').forEach((h) => hues.add(h.trim()))
      }
    })
    return Array.from(hues)
  }

  /**
   * 获取配方统计信息
   */
  getStatistics() {
    this.ensureLoaded()
    return {
      total: this.recipes.length,
      byMode: {
        light: this.recipes.filter((r) => r.axes.mode === 'light').length,
        dark: this.recipes.filter((r) => r.axes.mode === 'dark').length,
        hc: this.recipes.filter((r) => r.axes.mode === 'hc').length,
      },
      byTone: {
        calm: this.recipes.filter((r) => r.axes.tone === 'calm').length,
        standard: this.recipes.filter((r) => r.axes.tone === 'standard').length,
        vivid: this.recipes.filter((r) => r.axes.tone === 'vivid').length,
      },
      byDensity: {
        compact: this.recipes.filter((r) => r.axes.density === 'compact').length,
        comfortable: this.recipes.filter((r) => r.axes.density === 'comfortable').length,
        spacious: this.recipes.filter((r) => r.axes.density === 'spacious').length,
      },
    }
  }

  /**
   * 验证配方一致性
   */
  validateConsistency(): ValidationResult {
    this.ensureLoaded()

    const results: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
    }

    // 验证配方ID格式
    this.recipes.forEach((recipe) => {
      const axes = this.parseRecipeId(recipe.id)
      if (!axes) {
        results.valid = false
        results.errors.push({
          type: 'recipe-id',
          message: `配方ID格式错误: ${recipe.id}`,
          component: recipe.name,
        })
      }
    })

    // 验证配方名称唯一性
    const names = new Set<string>()
    this.recipes.forEach((recipe) => {
      if (names.has(recipe.name)) {
        results.warnings.push({
          type: 'duplicate',
          message: `重复的配方名称: ${recipe.name}`,
          component: recipe.name,
        })
      }
      names.add(recipe.name)
    })

    // 验证配方ID唯一性
    const ids = new Set<string>()
    this.recipes.forEach((recipe) => {
      if (ids.has(recipe.id)) {
        results.valid = false
        results.errors.push({
          type: 'duplicate',
          message: `重复的配方ID: ${recipe.id}`,
          component: recipe.name,
        })
      }
      ids.add(recipe.id)
    })

    this.validated = true
    return results
  }
}

// 导出单例实例
export const readonlyRecipes = RecipesReadonlyAdapter.getInstance()

// 导出类型
export type { Recipe, RecipeFilterOptions, ValidationResult }

/**
 * 构建时一致性校验
 */
export function validateRecipesConsistency(): ValidationResult {
  return readonlyRecipes.validateConsistency()
}
