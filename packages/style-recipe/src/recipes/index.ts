// @ts-nocheck
/**
 * 🎨 TH-UI 风格配方体系 - 官方配方集合
 *
 * 基于设计指南 v1.0 的 10 条官方配方
 * 支持完整的七轴风格配方系统
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
// 官方配方集合 (Official Recipe Collection)
// ============================================================================

/**
 * Corporate Blue - 企业/SaaS 控制台
 * Recipe: light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow
 */
export const corporateBlueRecipe: StyleRecipe = {
  id: 'light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow',
  name: 'Corporate Blue',
  description: '专业企业级蓝色主题，适用于SaaS控制台和商业应用',
  category: 'corporate',

  // 七轴配置
  mode: 'light',
  base: 'neutral-cool-mid',
  accent: 'mono(blue)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'standard.classic',
  surface: 'soft-shadow',

  // 元数据
  tags: ['professional', 'business', 'saas', 'corporate'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Corporate Navy Dark - 深色企业后台
 * Recipe: dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow
 */
export const corporateNavyDarkRecipe: StyleRecipe = {
  id: 'dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow',
  name: 'Corporate Navy Dark',
  description: '深色企业后台主题，护眼且专业',
  category: 'corporate',

  // 七轴配置
  mode: 'dark',
  base: 'neutral-cool-high',
  accent: 'mono(navy)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'standard.classic',
  surface: 'soft-shadow',

  // 元数据
  tags: ['dark', 'professional', 'business', 'enterprise'],
  accessibility: {
    contrastLevel: 'AAA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Minimal White - 文档/内容主题
 * Recipe: light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat
 */
export const minimalWhiteRecipe: StyleRecipe = {
  id: 'light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat',
  name: 'Minimal White',
  description: '极简白色主题，适合文档和内容阅读',
  category: 'minimal',

  // 七轴配置
  mode: 'light',
  base: 'neutral-true-mid',
  accent: 'mono(gray)',
  tone: 'calm',
  density: 'spacious',
  motion: 'subtle.classic',
  surface: 'flat',

  // 元数据
  tags: ['minimal', 'clean', 'documentation', 'reading'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Minimal Graphite Dark - 内容深色主题
 * Recipe: dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat
 */
export const minimalGraphiteDarkRecipe: StyleRecipe = {
  id: 'dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat',
  name: 'Minimal Graphite Dark',
  description: '深色极简主题，适合长时间阅读和写作',
  category: 'minimal',

  // 七轴配置
  mode: 'dark',
  base: 'neutral-true-high',
  accent: 'mono(gray)',
  tone: 'calm',
  density: 'comfortable',
  motion: 'subtle.classic',
  surface: 'flat',

  // 元数据
  tags: ['dark', 'minimal', 'reading', 'writing'],
  accessibility: {
    contrastLevel: 'AAA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Tech Cyan - 开发者平台
 * Recipe: light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow
 */
export const techCyanRecipe: StyleRecipe = {
  id: 'light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow',
  name: 'Tech Cyan',
  description: '科技感青色主题，专为开发者平台设计',
  category: 'tech',

  // 七轴配置
  mode: 'light',
  base: 'neutral-cool-mid',
  accent: 'mono(cyan)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'standard.classic',
  surface: 'soft-shadow',

  // 元数据
  tags: ['tech', 'developer', 'cyan', 'platform'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Tech Neon Dark - AI/品牌页
 * Recipe: dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon
 */
export const techNeonDarkRecipe: StyleRecipe = {
  id: 'dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon',
  name: 'Tech Neon Dark',
  description: '赛博朋克风格霓虹主题，适合AI产品和品牌展示',
  category: 'tech',

  // 七轴配置
  mode: 'dark',
  base: 'neutral-cool-high',
  accent: 'duo(cyan,magenta)',
  tone: 'vivid',
  density: 'compact',
  motion: 'expressive.spring',
  surface: 'glass+neon',

  // 元数据
  tags: ['dark', 'neon', 'cyberpunk', 'ai', 'brand'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: false, // 震荡效果可能影响光敏用户
    motionSafe: false, // 表现力强的动效
  },
}

/**
 * Creative Purple - 设计/创意主题
 * Recipe: light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring
 */
export const creativePurpleRecipe: StyleRecipe = {
  id: 'light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring',
  name: 'Creative Purple',
  description: '创意紫色主题，适合设计工具和创意平台',
  category: 'creative',

  // 七轴配置
  mode: 'light',
  base: 'neutral-true-mid',
  accent: 'analog(purple)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'standard.spring',
  surface: 'soft-shadow',

  // 元数据
  tags: ['creative', 'purple', 'design', 'artistic'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * Creative Aurora Dark - 品牌/展示主题
 * Recipe: dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass
 */
export const creativeAuroraDarkRecipe: StyleRecipe = {
  id: 'dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass',
  name: 'Creative Aurora Dark',
  description: '极光深色主题，适合品牌展示和创意作品',
  category: 'creative',

  // 七轴配置
  mode: 'dark',
  base: 'neutral-true-mid',
  accent: 'analog(purple)',
  tone: 'vivid',
  density: 'comfortable',
  motion: 'expressive.spring',
  surface: 'glass',

  // 元数据
  tags: ['dark', 'aurora', 'creative', 'brand', 'showcase'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: false, // 表现力动效
  },
}

/**
 * Classic Neutral - 默认通用主题
 * Recipe: light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow
 */
export const classicNeutralRecipe: StyleRecipe = {
  id: 'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow',
  name: 'Classic Neutral',
  description: '经典中性主题，通用性强，适合大多数场景',
  category: 'classic',

  // 七轴配置
  mode: 'light',
  base: 'neutral-true-mid',
  accent: 'mono(gray)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'standard.classic',
  surface: 'soft-shadow',

  // 元数据
  tags: ['classic', 'neutral', 'universal', 'default'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true,
  },
}

/**
 * High-Contrast Pro - 无障碍/高可读主题
 * Recipe: hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat
 */
export const highContrastProRecipe: StyleRecipe = {
  id: 'hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat',
  name: 'High-Contrast Pro',
  description: '高对比度专业主题，专为无障碍设计',
  category: 'classic',

  // 七轴配置
  mode: 'hc',
  base: 'neutral-true-high',
  accent: 'mono(blue)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'subtle.classic',
  surface: 'flat',

  // 元数据
  tags: ['accessibility', 'high-contrast', 'a11y', 'professional'],
  accessibility: {
    contrastLevel: 'HC',
    cvdFriendly: true,
    motionSafe: true,
  },
}

// ============================================================================
// 配方集合与工具函数
// ============================================================================

/**
 * 所有官方配方
 */
export const officialRecipes: StyleRecipe[] = [
  corporateBlueRecipe,
  corporateNavyDarkRecipe,
  minimalWhiteRecipe,
  minimalGraphiteDarkRecipe,
  techCyanRecipe,
  techNeonDarkRecipe,
  creativePurpleRecipe,
  creativeAuroraDarkRecipe,
  classicNeutralRecipe,
  highContrastProRecipe,
] as const

/**
 * 配方映射表
 */
export const recipeMap: Record<string, StyleRecipe> = officialRecipes.reduce(
  (map, recipe) => {
    map[recipe.id] = recipe
    return map
  },
  {} as Record<string, StyleRecipe>
)

/**
 * 按类别分组的配方
 */
export const recipesByCategory = officialRecipes.reduce((groups, recipe) => {
  if (!groups[recipe.category]) {
    groups[recipe.category] = []
  }
  groups[recipe.category].push(recipe)
  return groups
}, {} as Record<string, StyleRecipe[]>)

/**
 * 获取配方
 */
export function getRecipe(id: StyleRecipeID): StyleRecipe | undefined {
  return recipeMap[id]
}

/**
 * 按类别获取配方
 */
export function getRecipesByCategory(category: string): StyleRecipe[] {
  return recipesByCategory[category] || []
}

/**
 * 搜索配方
 */
export function searchRecipes(query: string): StyleRecipe[] {
  const lowercaseQuery = query.toLowerCase()
  return officialRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(lowercaseQuery) ||
    recipe.description.toLowerCase().includes(lowercaseQuery) ||
    recipe.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
    recipe.category.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * 获取推荐配方
 */
export function getRecommendedRecipes(): StyleRecipe[] {
  return [
    classicNeutralRecipe, // 默认推荐
    corporateBlueRecipe, // 企业推荐
    minimalWhiteRecipe,  // 内容推荐
    techCyanRecipe,      // 开发者推荐
  ]
}

// ============================================================================
// 配方验证
// ============================================================================

/**
 * 验证配方ID格式
 */
export function validateRecipeID(id: string): boolean {
  const pattern = /^(light|dark|hc)\.(neutral-warm|neutral-cool|neutral-true)-(low|mid|high)\.(mono|analog|duo)\([^)]+\)\.(calm|standard|vivid)\.(spacious|comfortable|compact)\.(subtle|standard|expressive)\.(classic|soft|spring)(\+(flat|soft-shadow|glass|neon))*$/
  return pattern.test(id)
}

/**
 * 解析配方ID
 */
export function parseRecipeID(id: string): {
  mode: ModeAxis
  base: BaseAxis
  accent: AccentAxis
  tone: ToneAxis
  density: DensityAxis
  motion: MotionAxis
  surface: SurfaceAxis
} | null {
  if (!validateRecipeID(id)) {
    return null
  }

  const parts = id.split('.')
  return {
    mode: parts[0] as ModeAxis,
    base: parts[1] as BaseAxis,
    accent: parts[2] as AccentAxis,
    tone: parts[3] as ToneAxis,
    density: parts[4] as DensityAxis,
    motion: parts[5] as MotionAxis,
    surface: parts.slice(6).join('.') as SurfaceAxis,
  }
}