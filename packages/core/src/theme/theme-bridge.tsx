/**
 * 主题桥接层
 *
 * 将 COMPLETE_THEME_RECIPES 映射到 system 包的主题系统
 * 实现高层主题配方到底层主题的转换
 */

import { COMPLETE_THEME_RECIPES, type CompleteThemeRecipe } from '../system-tools/complete-theme-recipes'

// 主题配方映射表 - 将23个主题配方映射到10个真实system主题
export const THEME_RECIPE_MAPPING: Record<string, string> = {
  // 企业系列 (Corporate)
  'corporate-blue': 'cyber-blue-purple',        // 企业蓝 -> 赛博蓝紫
  'corporate-navy-dark': 'deep-ocean',         // 企业深蓝 -> 深海秘境
  'classic-neutral': 'minimal-black-white',    // 经典中性 -> 极简黑白

  // 极简系列 (Minimal)
  'minimal-white': 'minimal-black-white',      // 极简白 -> 极简黑白
  'minimal-graphite-dark': 'deep-ocean',       // 极简石墨 -> 深海秘境
  'minimal-black-white': 'minimal-black-white', // 极简黑白 -> 自身

  // 科技系列 (Tech)
  'tech-cyan': 'cyber-blue-purple',            // 科技青 -> 赛博蓝紫
  'tech-neon-dark': 'deep-ocean',              // 科技霓虹 -> 深海秘境
  'cyber-blue-purple': 'cyber-blue-purple',    // 赛博蓝紫 -> 自身

  // 创意系列 (Creative)
  'creative-purple': 'royal-violet',           // 创意紫 -> 高贵紫罗兰
  'creative-aurora-dark': 'deep-ocean',        // 创意极光 -> 深海秘境
  'royal-violet': 'royal-violet',              // 高贵紫罗兰 -> 自身

  // 自然风光 (Nature)
  'deep-ocean': 'deep-ocean',                  // 深海探索 -> 自身
  'forest-nature': 'forest-nature',            // 自然森林 -> 自身
  'warm-sunrise': 'warm-sunrise',              // 温暖晨曦 -> 自身
  'vibrant-lemon': 'vibrant-lemon',            // 活力柠檬 -> 自身

  // 节日庆典 (Festival)
  'pink-romance': 'pink-romance',              // 粉彩浪漫 -> 自身
  'dreamy-rainbow': 'dreamy-rainbow',          // 梦幻彩虹 -> 自身
  'carnival-circus': 'carnival-circus',        // 嘉年华马戏团 -> 自身

  // 可访问性 (Accessibility)
  'high-contrast-pro': 'minimal-black-white'   // 高对比专业 -> 极简黑白
}

// 反向映射：system 主题到主题配方
export const SYSTEM_TO_RECIPE_MAPPING: Record<string, string> = {}

// 生成反向映射
Object.entries(THEME_RECIPE_MAPPING).forEach(([recipeId, systemTheme]) => {
  SYSTEM_TO_RECIPE_MAPPING[systemTheme] = recipeId
})

/**
 * 将主题配方ID转换为system包主题ID
 */
export function mapRecipeToSystem(recipeId: string): string {
  return THEME_RECIPE_MAPPING[recipeId] || 'cyber-blue-purple'
}

/**
 * 将system包主题ID转换为主题配方ID
 */
export function mapSystemToRecipe(systemTheme: string): string {
  return SYSTEM_TO_RECIPE_MAPPING[systemTheme] || 'cyber-blue-purple'
}

/**
 * 获取主题配方的完整信息
 */
export function getRecipeInfo(recipeId: string): CompleteThemeRecipe | undefined {
  return COMPLETE_THEME_RECIPES.find(recipe => recipe.id === recipeId)
}

/**
 * 获取所有可用的主题配方（按映射过滤）
 */
export function getAvailableRecipes(): CompleteThemeRecipe[] {
  return COMPLETE_THEME_RECIPES.filter(recipe =>
    THEME_RECIPE_MAPPING[recipe.id] // 只保留有映射的主题
  )
}

/**
 * 根据分类获取主题配方
 */
export function getRecipesByCategory(category: string): CompleteThemeRecipe[] {
  return getAvailableRecipes().filter(recipe => recipe.category === category)
}