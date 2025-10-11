/**
 * 🎨 TH-UI 统一配方体系 - 完整配方集合
 *
 * 所有配方均为标准七轴DTCG格式
 * 可无限扩展，未来可添加更多主题配方
 */

import type { StyleRecipe } from '../types'
import { officialRecipes } from './official-recipes'
import { colorPalettes } from '../../theme/palettes'

// ============================================================================
// 七轴配方集合 (Seven-Axis Recipe Collection)
// ============================================================================

/**
 * Cyber Blue Purple - 赛博蓝紫
 * 原创意配色转换为七轴格式
 */
export const cyberBluePurpleRecipe: StyleRecipe = {
  id: 'dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass',
  name: '赛博蓝紫',
  description: '经典赛博朋克风格，蓝紫渐变充满科技感',
  category: 'creative',

  // 七轴配置
  mode: 'dark',
  base: 'neutral-cool-mid',
  accent: 'analog(purple)',
  tone: 'vivid',
  density: 'comfortable',
  motion: 'expressive.spring',
  surface: 'glass',

  // 元数据
  tags: ['科技', '未来', '赛博朋克', '蓝紫'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: false, // 表现力动效
  },
}

/**
 * Warm Sunrise - 温暖晨曦
 */
export const warmSunriseRecipe: StyleRecipe = {
  id: 'light.neutral-warm-high.analog(orange).vibrant.comfortable.standard.soft-shadow',
  name: '温暖晨曦',
  description: '温馨活力的橙色主题，如清晨的第一缕阳光',
  category: 'creative',

  mode: 'light',
  base: 'neutral-warm-high',
  accent: 'analog(orange)',
  tone: 'vibrant',
  density: 'comfortable',
  motion: 'standard.spring',
  surface: 'soft-shadow',

  tags: ['温暖', '活力', '清新', '橙色'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Deep Ocean - 深海探索
 */
export const deepOceanRecipe: StyleRecipe = {
  id: 'dark.neutral-cool-high.mono(blue).standard.comfortable.minimal.elevated',
  name: '深海探索',
  description: '神秘深邃的蓝色主题，探索深海的静谧',
  category: 'creative',

  mode: 'dark',
  base: 'neutral-cool-high',
  accent: 'mono(blue)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'minimal.classic',
  surface: 'elevated',

  tags: ['深邃', '神秘', '蓝色', '海洋'],
  accessibility: {
    contrastLevel: 'AAA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Forest Nature - 自然森林
 */
export const forestNatureRecipe: StyleRecipe = {
  id: 'light.neutral-true-mid.analog(green).standard.comfortable.standard.soft-shadow',
  name: '自然森林',
  description: '清新自然的绿色主题，沉浸式森林体验',
  category: 'creative',

  mode: 'light',
  base: 'neutral-true-mid',
  accent: 'analog(green)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'standard.classic',
  surface: 'soft-shadow',

  tags: ['自然', '清新', '绿色', '森林'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Pink Romance - 粉彩浪漫
 */
export const pinkRomanceRecipe: StyleRecipe = {
  id: 'light.neutral-warm-mid.analog(pink).standard.comfortable.soft.soft-shadow',
  name: '粉彩浪漫',
  description: '温柔的粉紫色系，营造浪漫优雅的氛围',
  category: 'creative',

  mode: 'light',
  base: 'neutral-warm-mid',
  accent: 'analog(pink)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'soft.spring',
  surface: 'soft-shadow',

  tags: ['浪漫', '优雅', '粉色', '温柔'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Royal Violet - 高贵紫罗兰
 */
export const royalVioletRecipe: StyleRecipe = {
  id: 'dark.neutral-cool-mid.mono(purple).vivid.comfortable.standard.elevated',
  name: '高贵紫罗兰',
  description: '优雅高贵的紫色主题，展现王者风范',
  category: 'creative',

  mode: 'dark',
  base: 'neutral-cool-mid',
  accent: 'mono(purple)',
  tone: 'vivid',
  density: 'comfortable',
  motion: 'standard.spring',
  surface: 'elevated',

  tags: ['高贵', '优雅', '紫色', '奢华'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Minimal Black White - 极简黑白
 */
export const minimalBlackWhiteRecipe: StyleRecipe = {
  id: 'light.neutral-true-high.mono(gray).calm.spacious.minimal.flat',
  name: '极简黑白',
  description: '经典黑白配色，极致的简约美学',
  category: 'creative',

  mode: 'light',
  base: 'neutral-true-high',
  accent: 'mono(gray)',
  tone: 'calm',
  density: 'spacious',
  motion: 'minimal.classic',
  surface: 'flat',

  tags: ['极简', '黑白', '经典', '简约'],
  accessibility: {
    contrastLevel: 'AAA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Vibrant Lemon - 活力柠檬
 */
export const vibrantLemonRecipe: StyleRecipe = {
  id: 'light.neutral-warm-mid.mono(yellow).vibrant.comfortable.playful.soft-shadow',
  name: '活力柠檬',
  description: '明亮活泼的柠檬黄主题，充满青春活力',
  category: 'creative',

  mode: 'light',
  base: 'neutral-warm-mid',
  accent: 'mono(yellow)',
  tone: 'vibrant',
  density: 'comfortable',
  motion: 'playful.spring',
  surface: 'soft-shadow',

  tags: ['活力', '明亮', '黄色', '青春'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Dreamy Rainbow - 梦幻彩虹
 */
export const dreamyRainbowRecipe: StyleRecipe = {
  id: 'light.neutral-true-mid.triadic(rainbow).vibrant.comfortable.playful.glass',
  name: '梦幻彩虹',
  description: '缤纷多彩的渐变主题，如梦如幻的彩虹色彩',
  category: 'creative',

  mode: 'light',
  base: 'neutral-true-mid',
  accent: 'triadic(rainbow)',
  tone: 'vibrant',
  density: 'comfortable',
  motion: 'playful.spring',
  surface: 'glass',

  tags: ['梦幻', '彩虹', '多彩', '活泼'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: false, // 多色可能影响色盲用户
    motionSafe: true,
  },
}

/**
 * Carnival Circus - 嘉年华马戏团
 */
export const carnivalCircusRecipe: StyleRecipe = {
  id: 'light.neutral-warm-mid.triadic(red,yellow,blue).vibrant.comfortable.expressive.elevated',
  name: '嘉年华马戏团',
  description: '欢快热烈的三色主题，充满节日气氛的嘉年华',
  category: 'creative',

  mode: 'light',
  base: 'neutral-warm-mid',
  accent: 'triadic(red,yellow,blue)',
  tone: 'vibrant',
  density: 'comfortable',
  motion: 'expressive.spring',
  surface: 'elevated',

  tags: ['欢快', '热烈', '节日', '多彩'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: false, // 多色组合可能影响色盲用户
    motionSafe: false, // 表现力动效
  },
}

// ============================================================================
// 统一配方集合 (Unified Recipe Collection)
// ============================================================================

/**
 * 主题配方组 A (10个)
 */
export const themeRecipesA: StyleRecipe[] = [
  cyberBluePurpleRecipe,        // 1. 赛博蓝紫
  warmSunriseRecipe,             // 2. 温暖晨曦
  pinkRomanceRecipe,             // 3. 粉彩浪漫
  forestNatureRecipe,            // 4. 自然森林
  deepOceanRecipe,               // 5. 深海秘境
  royalVioletRecipe,             // 6. 高贵紫罗兰
  minimalBlackWhiteRecipe,       // 7. 极简黑白
  vibrantLemonRecipe,            // 8. 活力柠檬
  dreamyRainbowRecipe,           // 9. 梦幻彩虹
  carnivalCircusRecipe,          // 10. 嘉年华马戏团
] as const

/**
 * 主题配方组 B (10个)
 */
export const themeRecipesB: StyleRecipe[] = officialRecipes

/**
 * 所有七轴配方 (当前20个，可无限扩展)
 */
export const unifiedRecipes: StyleRecipe[] = [
  ...themeRecipesA,
  ...themeRecipesB,
] as const

/**
 * 配方映射表
 */
export const unifiedRecipeMap: Record<string, StyleRecipe> = unifiedRecipes.reduce(
  (map, recipe) => {
    map[recipe.id] = recipe
    return map
  },
  {} as Record<string, StyleRecipe>
)

/**
 * 按类别分组的配方
 */
export const unifiedRecipesByCategory = unifiedRecipes.reduce((groups, recipe) => {
  if (!groups[recipe.category]) {
    groups[recipe.category] = []
  }
  groups[recipe.category].push(recipe)
  return groups
}, {} as Record<string, StyleRecipe[]>)

/**
 * 按模式分组 (light/dark/hc)
 */
export const unifiedRecipesByMode = unifiedRecipes.reduce((groups, recipe) => {
  if (!groups[recipe.mode]) {
    groups[recipe.mode] = []
  }
  groups[recipe.mode].push(recipe)
  return groups
}, {} as Record<string, StyleRecipe[]>)

/**
 * 按色调分组 (vivid/vibrant/standard/muted/calm)
 */
export const unifiedRecipesByTone = unifiedRecipes.reduce((groups, recipe) => {
  if (!groups[recipe.tone]) {
    groups[recipe.tone] = []
  }
  groups[recipe.tone].push(recipe)
  return groups
}, {} as Record<string, StyleRecipe[]>)

/**
 * 按密度分组 (compact/comfortable/spacious)
 */
export const unifiedRecipesByDensity = unifiedRecipes.reduce((groups, recipe) => {
  if (!groups[recipe.density]) {
    groups[recipe.density] = []
  }
  groups[recipe.density].push(recipe)
  return groups
}, {} as Record<string, StyleRecipe[]>)

/**
 * 按表面分组 (flat/soft-shadow/elevated/glass/glass+neon)
 */
export const unifiedRecipesBySurface = unifiedRecipes.reduce((groups, recipe) => {
  if (!groups[recipe.surface]) {
    groups[recipe.surface] = []
  }
  groups[recipe.surface].push(recipe)
  return groups
}, {} as Record<string, StyleRecipe[]>)

// ============================================================================
// 工具函数 (Utility Functions)
// ============================================================================

/**
 * 获取配方
 */
export function getUnifiedRecipe(id: string): StyleRecipe | undefined {
  return unifiedRecipeMap[id]
}

/**
 * 按类别获取配方
 */
export function getUnifiedRecipesByCategory(category: string): StyleRecipe[] {
  return unifiedRecipesByCategory[category] || []
}

/**
 * 按模式获取配方
 */
export function getUnifiedRecipesByMode(mode: string): StyleRecipe[] {
  return unifiedRecipesByMode[mode] || []
}

/**
 * 按色调获取配方
 */
export function getUnifiedRecipesByTone(tone: string): StyleRecipe[] {
  return unifiedRecipesByTone[tone] || []
}

/**
 * 按密度获取配方
 */
export function getUnifiedRecipesByDensity(density: string): StyleRecipe[] {
  return unifiedRecipesByDensity[density] || []
}

/**
 * 按表面获取配方
 */
export function getUnifiedRecipesBySurface(surface: string): StyleRecipe[] {
  return unifiedRecipesBySurface[surface] || []
}

/**
 * 搜索配方
 */
export function searchUnifiedRecipes(query: string): StyleRecipe[] {
  const lowercaseQuery = query.toLowerCase()
  return unifiedRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(lowercaseQuery) ||
    recipe.description.toLowerCase().includes(lowercaseQuery) ||
    recipe.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
    recipe.category.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * 多维度过滤配方
 */
export interface RecipeFilterOptions {
  mode?: string | string[]
  tone?: string | string[]
  density?: string | string[]
  surface?: string | string[]
  category?: string | string[]
  tags?: string | string[]
}

export function filterUnifiedRecipes(options: RecipeFilterOptions): StyleRecipe[] {
  return unifiedRecipes.filter(recipe => {
    // 模式过滤
    if (options.mode) {
      const modes = Array.isArray(options.mode) ? options.mode : [options.mode]
      if (!modes.includes(recipe.mode)) return false
    }

    // 色调过滤
    if (options.tone) {
      const tones = Array.isArray(options.tone) ? options.tone : [options.tone]
      if (!tones.includes(recipe.tone)) return false
    }

    // 密度过滤
    if (options.density) {
      const densities = Array.isArray(options.density) ? options.density : [options.density]
      if (!densities.includes(recipe.density)) return false
    }

    // 表面过滤
    if (options.surface) {
      const surfaces = Array.isArray(options.surface) ? options.surface : [options.surface]
      if (!surfaces.includes(recipe.surface)) return false
    }

    // 类别过滤
    if (options.category) {
      const categories = Array.isArray(options.category) ? options.category : [options.category]
      if (!categories.includes(recipe.category)) return false
    }

    // 标签过滤
    if (options.tags) {
      const tags = Array.isArray(options.tags) ? options.tags : [options.tags]
      if (!tags.some(tag => recipe.tags.includes(tag))) return false
    }

    return true
  })
}

/**
 * 获取推荐配方
 */
export function getRecommendedUnifiedRecipes(): StyleRecipe[] {
  return [
    warmSunriseRecipe,      // 创意推荐 - 温暖活力
    cyberBluePurpleRecipe,  // 创意推荐 - 科技感
    forestNatureRecipe,     // 创意推荐 - 清新自然
    deepOceanRecipe,        // 创意推荐 - 深邃宁静
  ]
}

/**
 * 配方颜色映射表
 * 将七轴配方 ID 映射到 colorPalettes 的实际渐变色
 */
export const recipeColorMap: Record<string, { gradient: string; primary: string; secondary: string }> = {
  // 主题配方组 A (10个) - 使用 colorPalettes 中的实际颜色
  'dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass': {
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%)',
    primary: '#3b82f6',
    secondary: '#a855f7',
  },
  'light.neutral-warm-high.analog(orange).vibrant.comfortable.standard.soft-shadow': {
    gradient: 'linear-gradient(135deg, #fb923c 0%, #facc15 100%)',
    primary: '#f97316',
    secondary: '#facc15',
  },
  'light.neutral-warm-mid.analog(pink).standard.comfortable.soft.soft-shadow': {
    gradient: 'linear-gradient(135deg, #f472b6 0%, #e879f9 100%)',
    primary: '#ec4899',
    secondary: '#c084fc',
  },
  'light.neutral-true-mid.analog(green).standard.comfortable.standard.soft-shadow': {
    gradient: 'linear-gradient(135deg, #34d399 0%, #a3e635 100%)',
    primary: '#10b981',
    secondary: '#84cc16',
  },
  'dark.neutral-cool-high.mono(blue).standard.comfortable.minimal.elevated': {
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
    primary: '#0ea5e9',
    secondary: '#0284c7',
  },
  'dark.neutral-cool-mid.mono(purple).vivid.comfortable.standard.elevated': {
    gradient: 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)',
    primary: '#a855f7',
    secondary: '#c084fc',
  },
  'light.neutral-true-high.mono(gray).calm.spacious.minimal.flat': {
    gradient: 'linear-gradient(135deg, #6b7280 0%, #374151 100%)',
    primary: '#6b7280',
    secondary: '#374151',
  },
  'light.neutral-warm-mid.mono(yellow).vibrant.comfortable.playful.soft-shadow': {
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #facc15 100%)',
    primary: '#facc15',
    secondary: '#fbbf24',
  },
  'light.neutral-true-mid.triadic(rainbow).vibrant.comfortable.playful.glass': {
    gradient: 'linear-gradient(135deg, #f472b6 0%, #fbbf24 25%, #34d399 50%, #3b82f6 75%, #a855f7 100%)',
    primary: '#ec4899',
    secondary: '#a855f7',
  },
  'light.neutral-warm-mid.triadic(red,yellow,blue).vibrant.comfortable.expressive.elevated': {
    gradient: 'linear-gradient(135deg, #ef4444 0%, #fbbf24 50%, #3b82f6 100%)',
    primary: '#ef4444',
    secondary: '#3b82f6',
  },

  // 主题配方组 B (10个) - 基于七轴参数定义渐变色
  'light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow': {
    gradient: 'linear-gradient(135deg, #dbeafe 0%, #3b82f6 100%)',
    primary: '#3b82f6',
    secondary: '#60a5fa',
  },
  'dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow': {
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    primary: '#1e40af',
    secondary: '#3b82f6',
  },
  'light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat': {
    gradient: 'linear-gradient(135deg, #f3f4f6 0%, #9ca3af 100%)',
    primary: '#6b7280',
    secondary: '#9ca3af',
  },
  'dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat': {
    gradient: 'linear-gradient(135deg, #374151 0%, #6b7280 100%)',
    primary: '#4b5563',
    secondary: '#6b7280',
  },
  'light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow': {
    gradient: 'linear-gradient(135deg, #cffafe 0%, #06b6d4 100%)',
    primary: '#06b6d4',
    secondary: '#22d3ee',
  },
  'dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon': {
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)',
    primary: '#06b6d4',
    secondary: '#ec4899',
  },
  'light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring': {
    gradient: 'linear-gradient(135deg, #e9d5ff 0%, #a855f7 100%)',
    primary: '#a855f7',
    secondary: '#c084fc',
  },
  'dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass': {
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    primary: '#a855f7',
    secondary: '#c084fc',
  },
  'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow': {
    gradient: 'linear-gradient(135deg, #f9fafb 0%, #6b7280 100%)',
    primary: '#6b7280',
    secondary: '#9ca3af',
  },
  'hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat': {
    gradient: 'linear-gradient(135deg, #000000 0%, #3b82f6 100%)',
    primary: '#3b82f6',
    secondary: '#60a5fa',
  },
}

/**
 * 获取配方预览颜色
 */
export function getRecipePreviewColors(recipeId: string): { gradient: string; primary: string; secondary: string } {
  return recipeColorMap[recipeId] || {
    gradient: 'linear-gradient(135deg, #f3f4f6 0%, #9ca3af 100%)',
    primary: '#6b7280',
    secondary: '#9ca3af',
  }
}
