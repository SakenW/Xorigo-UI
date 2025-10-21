// @ts-nocheck
/**
 * 🎨 TH-UI 风格配方体系 - 备份主题配方
 *
 * 从备份系统移植的经典主题配方
 * 保持与原有主题的视觉一致性
 */

import type {
  StyleRecipe,
  StyleRecipeID,
  ModeAxis,
  BaseAxis,
  AccentAxis,
  ToneAxis,
  DensityAxis,
  MotionAxis,
  SurfaceAxis,
} from '../types'

// ============================================================================
// 备份主题配方集合 (Legacy Theme Recipes)
// ============================================================================

/**
 * Warm Sunrise - 温暖晨曦主题
 * Recipe: light.neutral-warm-mid.analog(orange).standard.comfortable.standard.soft-shadow
 */
export const warmSunriseRecipe: StyleRecipe = {
  id: 'light.neutral-warm-mid.analog(orange).standard.comfortable.standard.soft-shadow',
  name: 'Warm Sunrise',
  description: '温暖的橙色和黄色渐变，营造积极向上的氛围',
  category: 'classic',

  // 七轴配置
  mode: 'light',
  base: 'neutral-warm-mid',
  accent: 'analog(orange)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'standard.classic',
  surface: 'soft-shadow',

  // 元数据
  tags: ['warm', 'energetic', 'friendly', 'comfortable'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Pink Romance - 粉彩浪漫主题
 * Recipe: light.neutral-warm-mid.analog(pink).calm.comfortable.standard.soft-shadow
 */
export const pinkRomanceRecipe: StyleRecipe = {
  id: 'light.neutral-warm-mid.analog(pink).calm.comfortable.standard.soft-shadow',
  name: 'Pink Romance',
  description: '温柔的粉紫色系，营造浪漫优雅的氛围',
  category: 'creative',

  // 七轴配置
  mode: 'light',
  base: 'neutral-warm-mid',
  accent: 'analog(pink)',
  tone: 'calm',
  density: 'comfortable',
  motion: 'standard.spring',
  surface: 'soft-shadow',

  // 元数据
  tags: ['romantic', 'elegant', 'gentle', 'artistic'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Forest Nature - 自然森林主题
 * Recipe: light.neutral-cool-mid.analog(green).calm.spacious.standard.soft-shadow
 */
export const forestNatureRecipe: StyleRecipe = {
  id: 'light.neutral-cool-mid.analog(green).calm.spacious.standard.soft-shadow',
  name: 'Forest Nature',
  description: '清新的绿色系，带来自然舒适的视觉体验',
  category: 'nature',

  // 七轴配置
  mode: 'light',
  base: 'neutral-cool-mid',
  accent: 'analog(green)',
  tone: 'calm',
  density: 'spacious',
  motion: 'standard.classic',
  surface: 'soft-shadow',

  // 元数据
  tags: ['natural', 'fresh', 'eco-friendly', 'healthy'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Deep Ocean - 深海秘境主题
 * Recipe: dark.neutral-cool-high.mono(blue).standard.comfortable.standard.glass
 */
export const deepOceanRecipe: StyleRecipe = {
  id: 'dark.neutral-cool-high.mono(blue).standard.comfortable.standard.glass',
  name: 'Deep Ocean',
  description: '深邃的蓝色系，营造神秘专业的氛围',
  category: 'tech',

  // 七轴配置
  mode: 'dark',
  base: 'neutral-cool-high',
  accent: 'mono(blue)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'standard.classic',
  surface: 'glass',

  // 元数据
  tags: ['deep', 'mysterious', 'professional', 'steady'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Royal Violet - 高贵紫罗兰主题
 * Recipe: light.neutral-warm-mid.analog(purple).standard.comfortable.standard.soft-shadow
 */
export const royalVioletRecipe: StyleRecipe = {
  id: 'light.neutral-warm-mid.analog(purple).standard.comfortable.standard.soft-shadow',
  name: 'Royal Violet',
  description: '优雅的紫罗兰色系，彰显高贵典雅的气质',
  category: 'elegant',

  // 七轴配置
  mode: 'light',
  base: 'neutral-warm-mid',
  accent: 'analog(purple)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'standard.spring',
  surface: 'soft-shadow',

  // 元数据
  tags: ['noble', 'elegant', 'mysterious', 'luxurious'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Vibrant Lemon - 活力柠檬主题
 * Recipe: light.neutral-true-mid.duo(yellow,green).vivid.comfortable.standard.soft-shadow
 */
export const vibrantLemonRecipe: StyleRecipe = {
  id: 'light.neutral-true-mid.duo(yellow,green).vivid.comfortable.standard.soft-shadow',
  name: 'Vibrant Lemon',
  description: '明亮的柠檬黄绿配色，充满生机与活力',
  category: 'playful',

  // 七轴配置
  mode: 'light',
  base: 'neutral-true-mid',
  accent: 'duo(yellow,green)',
  tone: 'vivid',
  density: 'comfortable',
  motion: 'standard.spring',
  surface: 'soft-shadow',

  // 元数据
  tags: ['vibrant', 'fresh', 'youthful', 'creative'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Dreamy Rainbow - 梦幻彩虹主题
 * Recipe: light.neutral-true-mid.trio(red,yellow,blue).vivid.spacious.expressive.glass
 */
export const dreamyRainbowRecipe: StyleRecipe = {
  id: 'light.neutral-true-mid.trio(red,yellow,blue).vivid.spacious.expressive.glass',
  name: 'Dreamy Rainbow',
  description: '多彩的渐变配色，充满童趣和想象力',
  category: 'playful',

  // 七轴配置
  mode: 'light',
  base: 'neutral-true-mid',
  accent: 'trio(red,yellow,blue)',
  tone: 'vivid',
  density: 'spacious',
  motion: 'expressive.spring',
  surface: 'glass',

  // 元数据
  tags: ['rainbow', 'playful', 'dreamy', 'colorful'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: false, // 表现力动效
  },
}

/**
 * Carnival Circus - 嘉年华马戏团主题
 * Recipe: light.neutral-true-mid.quintet(red,orange,yellow,green,blue).vivid.compact.expressive.glass+neon
 */
export const carnivalCircusRecipe: StyleRecipe = {
  id: 'light.neutral-true-mid.quintet(red,orange,yellow,green,blue).vivid.compact.expressive.glass+neon',
  name: 'Carnival Circus',
  description: '热情奔放的五彩配色，营造欢乐节庆氛围',
  category: 'playful',

  // 七轴配置
  mode: 'light',
  base: 'neutral-true-mid',
  accent: 'quintet(red,orange,yellow,green,blue)',
  tone: 'vivid',
  density: 'compact',
  motion: 'expressive.spring',
  surface: 'glass+neon',

  // 元数据
  tags: ['joyful', 'festive', 'lively', 'colorful'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: false, // 多色彩可能影响色盲用户
    motionSafe: false, // 表现力动效和霓虹效果
  },
}

// ============================================================================
// 配方集合与工具函数
// ============================================================================

/**
 * 所有备份主题配方
 */
export const legacyThemeRecipes: StyleRecipe[] = [
  warmSunriseRecipe,
  pinkRomanceRecipe,
  forestNatureRecipe,
  deepOceanRecipe,
  royalVioletRecipe,
  vibrantLemonRecipe,
  dreamyRainbowRecipe,
  carnivalCircusRecipe,
] as const

/**
 * 配方映射表
 */
export const legacyRecipeMap: Record<string, StyleRecipe> = legacyThemeRecipes.reduce(
  (map, recipe) => {
    map[recipe.id] = recipe
    return map
  },
  {} as Record<string, StyleRecipe>
)

/**
 * 按类别分组的配方
 */
export const legacyRecipesByCategory = legacyThemeRecipes.reduce((groups, recipe) => {
  if (!groups[recipe.category]) {
    groups[recipe.category] = []
  }
  groups[recipe.category].push(recipe)
  return groups
}, {} as Record<string, StyleRecipe[]>)

/**
 * 获取配方
 */
export function getLegacyRecipe(id: StyleRecipeID): StyleRecipe | undefined {
  return legacyRecipeMap[id]
}

/**
 * 按类别获取配方
 */
export function getLegacyRecipesByCategory(category: string): StyleRecipe[] {
  return legacyRecipesByCategory[category] || []
}

/**
 * 搜索配方
 */
export function searchLegacyRecipes(query: string): StyleRecipe[] {
  const lowercaseQuery = query.toLowerCase()
  return legacyThemeRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(lowercaseQuery) ||
    recipe.description.toLowerCase().includes(lowercaseQuery) ||
    recipe.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
    recipe.category.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * 获取推荐的备份主题配方
 */
export function getRecommendedLegacyRecipes(): StyleRecipe[] {
  return [
    warmSunriseRecipe,    // 温暖推荐
    forestNatureRecipe,   // 自然推荐
    dreamyRainbowRecipe,  // 创意推荐
    royalVioletRecipe,   // 优雅推荐
  ]
}

export default {
  legacyThemeRecipes,
  legacyRecipeMap,
  legacyRecipesByCategory,
  getLegacyRecipe,
  getLegacyRecipesByCategory,
  searchLegacyRecipes,
  getRecommendedLegacyRecipes,
}