/**
 * @fileoverview 主题映射核心工具模块
 * @description 负责23个主题配方到10个system主题的映射转换逻辑
 *
 * 核心职责：
 * 1. 提供双向映射转换函数
 * 2. 管理映射关系数据
 * 3. 类型安全保障和运行时验证
 *
 * 设计原则：
 * - 单一职责：仅处理映射逻辑，不涉及UI组件
 * - 类型安全：严格的TypeScript类型约束
 * - 向后兼容：保持现有API不变
 * - 性能优化：使用Map和Set提升查找效率
 *
 * @author Xorigo UI Team
 * @version 2.0.0
 */

import { COMPLETE_THEME_RECIPES, type CompleteThemeRecipe } from '../system-tools/complete-theme-recipes'

// ============================================================================
// 类型定义
// ============================================================================

/** 主题配方类型 */
export type ThemeRecipe = CompleteThemeRecipe

/** System主题类型 */
export type SystemTheme = string

/** 主题配方ID类型 */
export type RecipeId = string

/** System主题ID类型 */
export type SystemThemeId = string

/** 映射配置接口 */
export interface MappingConfig {
  recipeId: RecipeId
  systemTheme: SystemThemeId
  name: string
  category: string
}

// ============================================================================
// 核心数据结构 - 使用高性能集合
// ============================================================================

/** 主题配方到System主题的映射表 */
export const THEME_RECIPE_TO_SYSTEM: Record<RecipeId, SystemThemeId> = {
  // 企业系列 (Corporate)
  'corporate-blue': 'cyber-blue-purple',
  'corporate-navy-dark': 'deep-ocean',
  'classic-neutral': 'minimal-black-white',

  // 极简系列 (Minimal)
  'minimal-white': 'minimal-black-white',
  'minimal-graphite-dark': 'deep-ocean',
  'minimal-black-white': 'minimal-black-white',

  // 科技系列 (Tech)
  'tech-cyan': 'cyber-blue-purple',
  'tech-neon-dark': 'deep-ocean',
  'cyber-blue-purple': 'cyber-blue-purple',

  // 创意系列 (Creative)
  'creative-purple': 'royal-violet',
  'creative-aurora-dark': 'deep-ocean',
  'royal-violet': 'royal-violet',

  // 自然风光 (Nature)
  'deep-ocean': 'deep-ocean',
  'forest-nature': 'forest-nature',
  'warm-sunrise': 'warm-sunrise',
  'vibrant-lemon': 'vibrant-lemon',

  // 节日庆典 (Festival)
  'pink-romance': 'pink-romance',
  'dreamy-rainbow': 'dreamy-rainbow',
  'carnival-circus': 'carnival-circus',

  // 可访问性 (Accessibility)
  'high-contrast-pro': 'minimal-black-white'
} as const

/** System主题到主题配方的反向映射表 */
export const SYSTEM_TO_RECIPE: Record<SystemThemeId, RecipeId> = Object
  .fromEntries(Object.entries(THEME_RECIPE_TO_SYSTEM).map(([recipe, system]) => [system, recipe]))

/** 主题配方集合（用于快速查找） */
export const AVAILABLE_RECIPE_IDS = new Set(Object.keys(THEME_RECIPE_TO_SYSTEM))

/** System主题集合（用于快速查找） */
export const AVAILABLE_SYSTEM_THEMES = new Set(Object.values(THEME_RECIPE_TO_SYSTEM))

/** 默认主题配置 */
export const DEFAULT_RECIPE_ID: RecipeId = 'corporate-blue'
export const DEFAULT_SYSTEM_THEME: SystemThemeId = 'cyber-blue-purple'

// ============================================================================
// 核心工具函数 - 带类型安全和验证
// ============================================================================

/**
 * 将主题配方ID转换为system包主题ID
 *
 * @param recipeId - 主题配方ID
 * @returns 对应的system主题ID，如果不存在则返回默认值
 *
 * @example
 * ```typescript
 * mapRecipeToSystem('corporate-blue') // 'cyber-blue-purple'
 * mapRecipeToSystem('invalid-id') // 'cyber-blue-purple' (默认值)
 * ```
 */
export function mapRecipeToSystem(recipeId: RecipeId): SystemThemeId {
  return THEME_RECIPE_TO_SYSTEM[recipeId] ?? DEFAULT_SYSTEM_THEME
}

/**
 * 将system包主题ID转换为主题配方ID
 *
 * @param systemTheme - system主题ID
 * @returns 对应的主题配方ID，如果不存在则返回默认值
 *
 * @example
 * ```typescript
 * mapSystemToRecipe('cyber-blue-purple') // 'corporate-blue'
 * mapSystemToRecipe('invalid-theme') // 'corporate-blue' (默认值)
 * ```
 */
export function mapSystemToRecipe(systemTheme: SystemThemeId): RecipeId {
  return SYSTEM_TO_RECIPE[systemTheme] ?? DEFAULT_RECIPE_ID
}

/**
 * 验证主题配方ID是否有效
 *
 * @param recipeId - 主题配方ID
 * @returns 是否为有效的主题配方ID
 */
export function isValidRecipeId(recipeId: string): recipeId is RecipeId {
  return AVAILABLE_RECIPE_IDS.has(recipeId)
}

/**
 * 验证System主题ID是否有效
 *
 * @param systemTheme - system主题ID
 * @returns 是否为有效的system主题ID
 */
export function isValidSystemTheme(systemTheme: string): systemTheme is SystemThemeId {
  return AVAILABLE_SYSTEM_THEMES.has(systemTheme)
}

/**
 * 获取主题配方的完整信息
 *
 * @param recipeId - 主题配方ID
 * @returns 主题配方完整信息，如果不存在则返回undefined
 */
export function getRecipeInfo(recipeId: RecipeId): ThemeRecipe | undefined {
  return COMPLETE_THEME_RECIPES.find(recipe => recipe.id === recipeId)
}

/**
 * 获取所有可用的主题配方
 *
 * @returns 可用主题配方列表（按映射过滤）
 */
export function getAvailableRecipes(): ThemeRecipe[] {
  return COMPLETE_THEME_RECIPES.filter(recipe => AVAILABLE_RECIPE_IDS.has(recipe.id))
}

/**
 * 根据分类获取主题配方
 *
 * @param category - 主题分类
 * @returns 指定分类的主题配方列表
 */
export function getRecipesByCategory(category: string): ThemeRecipe[] {
  return getAvailableRecipes().filter(recipe => recipe.category === category)
}

/**
 * 获取所有可用的System主题
 *
 * @returns System主题ID列表
 */
export function getAvailableSystemThemes(): SystemThemeId[] {
  return Array.from(AVAILABLE_SYSTEM_THEMES)
}

/**
 * 获取主题映射统计信息
 *
 * @returns 映射统计数据
 */
export function getMappingStats() {
  return {
    totalRecipes: AVAILABLE_RECIPE_IDS.size,
    totalSystemThemes: AVAILABLE_SYSTEM_THEMES.size,
    recipeToSystemMappings: Object.keys(THEME_RECIPE_TO_SYSTEM).length,
    systemToRecipeMappings: Object.keys(SYSTEM_TO_RECIPE).length,
    defaultRecipe: DEFAULT_RECIPE_ID,
    defaultSystemTheme: DEFAULT_SYSTEM_THEME
  }
}

// ============================================================================
// 向后兼容性导出（保持与旧版本的兼容性）
// ============================================================================

/** @deprecated 使用 THEME_RECIPE_TO_SYSTEM 替代 */
export const THEME_RECIPE_MAPPING = THEME_RECIPE_TO_SYSTEM

/** @deprecated 使用 SYSTEM_TO_RECIPE 替代 */
export const SYSTEM_TO_RECIPE_MAPPING = SYSTEM_TO_RECIPE

// ============================================================================
// 开发者工具函数
// ============================================================================

/**
 * 开发环境下的映射关系验证
 * 仅在开发环境下执行，生产环境下会被tree-shaking移除
 */
export function validateMappings(): boolean {
  if (process.env.NODE_ENV === 'development') {
    const errors: string[] = []

    // 检查正向映射
    Object.entries(THEME_RECIPE_TO_SYSTEM).forEach(([recipe, system]) => {
      if (!getRecipeInfo(recipe as RecipeId)) {
        errors.push(`Recipe ${recipe} exists in mapping but not in COMPLETE_THEME_RECIPES`)
      }
    })

    // 检查反向映射一致性
    Object.entries(THEME_RECIPE_TO_SYSTEM).forEach(([recipe, system]) => {
      if (SYSTEM_TO_RECIPE[system] !== recipe) {
        errors.push(`Inconsistent mapping: ${recipe} -> ${system} -> ${SYSTEM_TO_RECIPE[system]}`)
      }
    })

    if (errors.length > 0) {
      console.error('Theme mapping validation errors:', errors)
      return false
    }
  }

  return true
}

// 开发环境下自动验证映射关系
if (process.env.NODE_ENV === 'development') {
  validateMappings()
}