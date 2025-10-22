/**
 * 主题配方系统索引
 *
 * 基于 v1.4 SSOT 文档的配方注册表和导出
 */

import type { ThemeRecipe } from '../theme-axis-controller'
import { corporateBlueRecipe, corporateBlueDarkRecipe } from './corporate-blue-recipe'
import { techCyanRecipe, techCyanNeonRecipe } from './tech-cyan-recipe'

// === 全部配方导出 ===
export {
  corporateBlueRecipe,
  corporateBlueDarkRecipe,
  techCyanRecipe,
  techCyanNeonRecipe,
}

// === 配方注册表 ===
export const recipeRegistry = new Map<string, ThemeRecipe>([
  // 企业蓝调系列
  ['corporate-blue', corporateBlueRecipe],
  ['corporate-blue-dark', corporateBlueDarkRecipe],

  // 科技青系列
  ['tech-cyan', techCyanRecipe],
  ['tech-cyan-neon', techCyanNeonRecipe],
])

// === 配方分类 ===
export interface RecipeCategory {
  id: string
  name: string
  description: string
  recipes: string[]
}

export const recipeCategories: RecipeCategory[] = [
  {
    id: 'corporate',
    name: '企业级主题',
    description: '适用于企业级应用和管理系统的专业主题',
    recipes: ['corporate-blue', 'corporate-blue-dark']
  },
  {
    id: 'tech',
    name: '科技风格主题',
    description: '适用于科技产品和开发工具的现代主题',
    recipes: ['tech-cyan', 'tech-cyan-neon']
  }
]

// === 配方查找工具 ===

/**
 * 根据 ID 获取主题配方
 */
export function getRecipe(id: string): ThemeRecipe | undefined {
  return recipeRegistry.get(id)
}

/**
 * 根据分类获取主题配方列表
 */
export function getRecipesByCategory(categoryId: string): ThemeRecipe[] {
  const category = recipeCategories.find(cat => cat.id === categoryId)
  if (!category) return []

  return category.recipes
    .map(recipeId => recipeRegistry.get(recipeId))
    .filter((recipe): recipe is ThemeRecipe => recipe !== undefined)
}

/**
 * 获取所有可用的主题配方
 */
export function getAllRecipes(): ThemeRecipe[] {
  return Array.from(recipeRegistry.values())
}

/**
 * 搜索主题配方
 */
export function searchRecipes(query: string): ThemeRecipe[] {
  const lowerQuery = query.toLowerCase()

  return Array.from(recipeRegistry.values()).filter(recipe => {
    return (
      recipe.id.toLowerCase().includes(lowerQuery) ||
      recipe.name.toLowerCase().includes(lowerQuery)
    )
  })
}

/**
 * 获取推荐的配方（基于常见使用场景）
 */
export function getRecommendedRecipes(): {
  default: ThemeRecipe
  alternatives: ThemeRecipe[]
} {
  const defaultRecipe = corporateBlueRecipe // 默认推荐企业蓝调

  const alternatives = [
    techCyanRecipe, // 科技风格作为备选
    corporateBlueDarkRecipe, // 暗色版本
  ]

  return {
    default: defaultRecipe,
    alternatives
  }
}

/**
 * 验证配方 ID 是否有效
 */
export function isValidRecipeId(id: string): boolean {
  return recipeRegistry.has(id)
}

// === 配方元数据 ===

/**
 * 获取配方的元数据信息
 */
export interface RecipeMetadata {
  id: string
  name: string
  category: string
  description: string
  mode: 'light' | 'dark' | 'both'
  variants?: string[]
}

export function getRecipeMetadata(id: string): RecipeMetadata | null {
  const recipe = recipeRegistry.get(id)
  if (!recipe) return null

  // 根据配方确定分类
  let category = 'other'
  if (id.includes('corporate')) {
    category = 'corporate'
  } else if (id.includes('tech')) {
    category = 'tech'
  }

  // 确定模式
  let mode: 'light' | 'dark' | 'both' = 'light'
  if (recipe.axes.mode === 'dark') {
    mode = 'dark'
  } else if (id.includes('-dark')) {
    mode = 'both'
  }

  // 生成描述
  const descriptions: Record<string, string> = {
    'corporate-blue': '专业的企业级蓝色主题，适合商务应用',
    'corporate-blue-dark': '企业级蓝色主题的暗色版本，适合长时间工作',
    'tech-cyan': '现代科技风格的青色主题，适合开发工具',
    'tech-cyan-neon': '科技感十足的霓虹青色主题，适合展示应用',
  }

  return {
    id: recipe.id,
    name: recipe.name,
    category,
    description: descriptions[id] || '自定义主题配方',
    mode,
    variants: id.includes('-dark') ? ['light', 'dark'] : undefined
  }
}

// === 便捷工具 ===

/**
 * 批量导入配方到注册表
 */
export function registerRecipes(recipes: ThemeRecipe[]): void {
  recipes.forEach(recipe => {
    recipeRegistry.set(recipe.id, recipe)
  })
}

/**
 * 创建自定义配方
 */
export function createCustomRecipe(
  id: string,
  name: string,
  axes: ThemeRecipe['axes'],
  customTokens?: Record<string, string | number>
): ThemeRecipe {
  // 这里可以调用 generateThemeTokens 来生成基础令牌
  // 然后与自定义令牌合并
  const baseRecipe: ThemeRecipe = {
    id,
    name,
    axes,
    tokens: {
      // 基础令牌可以从 generateThemeTokens 获取
      // 这里简化处理，实际应用中应该调用令牌生成器
      '--xor-bg-primary': '#ffffff',
      '--xor-text-primary': '#000000',
      ...customTokens
    }
  }

  return baseRecipe
}