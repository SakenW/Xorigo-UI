/**
 * 🎨 Xorigo UI 统一主题配方库
 *
 * 合并所有主题数据，去重并统一格式
 * 包含最终的22个主题配方（去重后）
 */

import { type CompleteThemeRecipe } from './complete-theme-recipes'

// ============================================================================
// 统一主题配方 (去重合并后的最终版本)
// ============================================================================

export interface UnifiedThemeRecipe extends CompleteThemeRecipe {
  // 扩展字段，支持Workbench配方格式
  colors?: string[] // Workbench的8色调色板格式
  image?: string // Workbench的预览图
}

export const UNIFIED_THEME_RECIPES: UnifiedThemeRecipe[] = [
  // ========================
  // 企业系列 (Corporate)
  // ========================
  {
    id: 'corporate-blue',
    name: '企业蓝',
    category: 'corporate',
    description: '专业企业级蓝色主题，适用于SaaS控制台',
    recipeId: 'light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow',
    colors: { primary: '#3b82f6', accent: '#06b6d4', background: '#ffffff' },
    colorsArray: ['#3b82f6', '#06b6d4', '#0284c7', '#f0f9ff', '#0c4a6e', '#e0f2fe', '#bae6fd', '#7dd3fc'],
    tags: ['企业', '专业', '蓝色'],
    isNew: false,
    isPopular: true
  },
  {
    id: 'corporate-navy-dark',
    name: '企业深蓝',
    category: 'corporate',
    description: '企业深色配方，适用于正式商业环境',
    recipeId: 'dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow',
    colors: { primary: '#1e3a8a', accent: '#0c4a6e', background: '#0f172a' },
    colorsArray: ['#1e3a8a', '#0c4a6e', '#1e3a8a', '#f8fafc', '#1e293b', '#f1f5f9', '#e2e8f0', '#cbd5e1'],
    tags: ['企业', '深色', '专业'],
    isNew: false,
    isPopular: true
  },
  {
    id: 'classic-neutral',
    name: '经典中性',
    category: 'corporate',
    description: '经典中性配方，永不过时的设计',
    recipeId: 'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow',
    colors: { primary: '#6b7280', accent: '#9ca3af', background: '#ffffff' },
    colorsArray: ['#6b7280', '#9ca3af', '#4b5563', '#f9fafb', '#111827', '#f3f4f6', '#e5e7eb', '#d1d5db'],
    tags: ['经典', '中性', '永不过时'],
    isNew: false,
    isPopular: false
  },

  // ========================
  // 极简系列 (Minimal)
  // ========================
  {
    id: 'minimal-white',
    name: '极简白',
    category: 'minimal',
    description: '极简白色配方，专注内容展示',
    recipeId: 'light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat',
    colors: { primary: '#6b7280', accent: '#9ca3af', background: '#ffffff' },
    colorsArray: ['#6b7280', '#9ca3af', '#4b5563', '#ffffff', '#111827', '#f3f4f6', '#e5e7eb', '#d1d5db'],
    tags: ['极简', '白色', '内容'],
    isNew: false,
    isPopular: true
  },
  {
    id: 'minimal-graphite-dark',
    name: '极简石墨',
    category: 'minimal',
    description: '极简深色配方，石墨风格设计',
    recipeId: 'dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat',
    colors: { primary: '#374151', accent: '#6b7280', background: '#111827' },
    colorsArray: ['#374151', '#6b7280', '#4b5563', '#111827', '#f9fafb', '#1f2937', '#374151', '#4b5563'],
    tags: ['极简', '深色', '石墨'],
    isNew: false,
    isPopular: false
  },
  {
    id: 'minimal-black-white',
    name: '极简黑白',
    category: 'minimal',
    description: '极致简约的黑白主题，回归设计的本质',
    recipeId: 'light.neutral-true-mid.mono(gray).calm.spacious.minimal.flat',
    colors: { primary: '#000000', accent: '#666666', background: '#ffffff' },
    colorsArray: ['#000000', '#666666', '#333333', '#ffffff', '#f0f0f0', '#333333', '#666666', '#999999'],
    tags: ['极简', '黑白', '经典'],
    isNew: true,
    isPopular: true
  },

  // ========================
  // 科技系列 (Tech)
  // ========================
  {
    id: 'tech-cyan',
    name: '科技青',
    category: 'tech',
    description: '科技青色配方，现代科技感设计',
    recipeId: 'light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow',
    colors: { primary: '#06b6d4', accent: '#0891b2', background: '#ffffff' },
    colorsArray: ['#06b6d4', '#0891b2', '#0e7490', '#f0fdfa', '#164e63', '#cffafe', '#a5f3fc', '#67e8f9'],
    tags: ['科技', '青色', '现代'],
    isNew: false,
    isPopular: true
  },
  {
    id: 'tech-neon-dark',
    name: '科技霓虹',
    category: 'tech',
    description: '科技霓虹深色配方，未来感十足',
    recipeId: 'dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon',
    colors: { primary: '#0ea5e9', accent: '#d946ef', background: '#0f172a' },
    colorsArray: ['#0ea5e9', '#d946ef', '#7c3aed', '#0f172a', '#fbbf24', '#22d3ee', '#c084fc', '#818cf8'],
    tags: ['科技', '霓虹', '未来'],
    isNew: true,
    isPopular: true
  },
  {
    id: 'cyber-blue-purple',
    name: '赛博蓝紫',
    category: 'tech',
    description: '经典赛博朋克风格，蓝紫渐变充满科技感',
    recipeId: 'dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass',
    colors: { primary: '#3b82f6', accent: '#8b5cf6', background: '#0f172a' },
    colorsArray: ['#3b82f6', '#8b5cf6', '#6366f1', '#0f172a', '#22d3ee', '#a78bfa', '#60a5fa', '#818cf8'],
    tags: ['赛博', '蓝紫', '科技'],
    isNew: true,
    isPopular: false
  },

  // ========================
  // 创意系列 (Creative)
  // ========================
  {
    id: 'creative-purple',
    name: '创意紫',
    category: 'creative',
    description: '创意紫色配方，激发创造力',
    recipeId: 'light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring',
    colors: { primary: '#8b5cf6', accent: '#a78bfa', background: '#ffffff' },
    colorsArray: ['#8b5cf6', '#a78bfa', '#7c3aed', '#faf5ff', '#4c1d95', '#ede9fe', '#ddd6fe', '#c4b5fd'],
    tags: ['创意', '紫色', '设计'],
    isNew: false,
    isPopular: false
  },
  {
    id: 'creative-aurora-dark',
    name: '创意极光',
    category: 'creative',
    description: '创意极光深色配方，梦幻效果',
    recipeId: 'dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass',
    colors: { primary: '#8b5cf6', accent: '#c084fc', background: '#0f172a' },
    colorsArray: ['#8b5cf6', '#c084fc', '#7c3aed', '#0f172a', '#22d3ee', '#e9d5ff', '#d8b4fe', '#a78bfa'],
    tags: ['创意', '极光', '梦幻'],
    isNew: false,
    isPopular: false
  },
  {
    id: 'royal-violet',
    name: '高贵紫罗兰',
    category: 'creative',
    description: '高贵典雅的紫色主题，皇室般的奢华',
    recipeId: 'dark.neutral-cool-high.mono(purple).vivid.comfortable.standard.glass',
    colors: { primary: '#7c3aed', accent: '#8b5cf6', background: '#0f172a' },
    colorsArray: ['#7c3aed', '#8b5cf6', '#6d28d9', '#0f172a', '#fbbf24', '#ddd6fe', '#a78bfa', '#818cf8'],
    tags: ['高贵', '紫色', '奢华'],
    isNew: true,
    isPopular: false
  },

  // ========================
  // 自然风光 (Nature) - 合并去重版本
  // ========================
  {
    id: 'ocean-deep',
    name: '深海探索',
    category: 'nature',
    description: '神秘深邃的蓝色主题，探索深海的静谧（合并海洋蓝和深海探索）',
    recipeId: 'dark.neutral-cool-high.mono(blue).standard.comfortable.minimal.elevated',
    colors: { primary: '#1e40af', accent: '#3b82f6', background: '#0f172a' },
    colorsArray: ['#1e40af', '#3b82f6', '#2563eb', '#f0f9ff', '#0c4a6e', '#e0f2fe', '#bae6fd', '#7dd3fc'],
    tags: ['海洋', '深邃', '自然', '蓝色'],
    isNew: true,
    isPopular: true
  },
  {
    id: 'forest-green',
    name: '自然森林',
    category: 'nature',
    description: '清新自然的绿色主题，呼吸森林的空气（合并森林绿和自然森林）',
    recipeId: 'light.neutral-true-mid.analog(green).standard.comfortable.standard.soft-shadow',
    colors: { primary: '#059669', accent: '#10b981', background: '#ffffff' },
    colorsArray: ['#059669', '#10b981', '#047857', '#f0fdf4', '#064e3b', '#d1fae5', '#a7f3d0', '#6ee7b7'],
    tags: ['森林', '自然', '绿色', '清新'],
    isNew: true,
    isPopular: false
  },

  // ========================
  // 温暖活力 (Warm & Vibrant)
  // ========================
  {
    id: 'warm-sunrise',
    name: '温暖晨曦',
    category: 'nature',
    description: '温馨活力的橙色主题，如清晨的第一缕阳光',
    recipeId: 'light.neutral-warm-high.analog(orange).vibrant.comfortable.standard.soft-shadow',
    colors: { primary: '#f97316', accent: '#fb923c', background: '#ffffff' },
    colorsArray: ['#f97316', '#fb923c', '#ea580c', '#fff7ed', '#9a3412', '#fed7aa', '#fdba74', '#fb923c'],
    tags: ['温暖', '晨曦', '橙色'],
    isNew: true,
    isPopular: true
  },
  {
    id: 'vibrant-lemon',
    name: '活力柠檬',
    category: 'nature',
    description: '明亮活泼的黄色主题，充满青春活力',
    recipeId: 'light.neutral-warm-mid.analog(yellow).vibrant.comfortable.expressive.soft-shadow',
    colors: { primary: '#eab308', accent: '#facc15', background: '#ffffff' },
    colorsArray: ['#eab308', '#facc15', '#ca8a04', '#fefce8', '#713f12', '#fef3c7', '#fde047', '#facc15'],
    tags: ['活力', '黄色', '青春'],
    isNew: true,
    isPopular: false
  },

  // ========================
  // 浪漫梦幻 (Romantic & Festival)
  // ========================
  {
    id: 'pink-romance',
    name: '粉彩浪漫',
    category: 'festival',
    description: '温柔浪漫的粉色主题，充满少女心',
    recipeId: 'light.neutral-warm-mid.analog(pink).soft.spacious.standard.soft-shadow',
    colors: { primary: '#ec4899', accent: '#f472b6', background: '#ffffff' },
    colorsArray: ['#ec4899', '#f472b6', '#db2777', '#fdf2f8', '#831843', '#fce7f3', '#fbcfe8', '#f9a8d4'],
    tags: ['浪漫', '粉色', '温柔'],
    isNew: true,
    isPopular: false
  },
  {
    id: 'dreamy-rainbow',
    name: '梦幻彩虹',
    category: 'festival',
    description: '缤纷多彩的彩虹主题，如梦如幻',
    recipeId: 'light.neutral-true-mid.triadic(red,green,blue).vivid.spacious.expressive.glass',
    colors: { primary: '#ef4444', accent: '#22c55e', background: '#ffffff' },
    colorsArray: ['#ef4444', '#22c55e', '#3b82f6', '#ffffff', '#fbbf24', '#10b981', '#6366f1', '#f87171'],
    tags: ['彩虹', '梦幻', '缤纷'],
    isNew: true,
    isPopular: true
  },
  {
    id: 'carnival-circus',
    name: '嘉年华马戏团',
    category: 'festival',
    description: '欢快热烈的三色主题，充满节日气氛的嘉年华',
    recipeId: 'light.neutral-warm-mid.triadic(red,yellow,blue).vibrant.comfortable.expressive.elevated',
    colors: { primary: '#ef4444', accent: '#eab308', background: '#ffffff' },
    colorsArray: ['#ef4444', '#eab308', '#3b82f6', '#ffffff', '#f59e0b', '#84cc16', '#06b6d4', '#8b5cf6'],
    tags: ['嘉年华', '马戏团', '节日'],
    isNew: true,
    isPopular: false
  },

  // ========================
  // 特殊和扩展主题
  // ========================
  {
    id: 'sunset-orange',
    name: '夕阳橙',
    category: 'festival',
    description: '温暖活力的夕阳橙色调主题（从workbench添加）',
    recipeId: 'light.neutral-warm-high.analog(orange).vibrant.comfortable.standard.soft-shadow',
    colors: { primary: '#fb923c', accent: '#f97316', background: '#ffffff' },
    colorsArray: ['#fb923c', '#f97316', '#ea580c', '#fff7ed', '#9a3412', '#fed7aa', '#fdba74', '#fb923c'],
    tags: ['夕阳', '橙色', '温暖', '活力'],
    isNew: false,
    isPopular: true
  },
  {
    id: 'royal-purple-workbench',
    name: '皇室紫',
    category: 'creative',
    description: '高贵典雅的紫色调主题（从workbench添加）',
    recipeId: 'dark.neutral-cool-high.mono(purple).vivid.comfortable.standard.glass',
    colors: { primary: '#8b5cf6', accent: '#7c3aed', background: '#0f172a' },
    colorsArray: ['#8b5cf6', '#7c3aed', '#6d28d9', '#f5f3ff', '#4c1d95', '#ede9fe', '#ddd6fe', '#c4b5fd'],
    tags: ['皇室', '紫色', '高贵', '典雅'],
    isNew: false,
    isPopular: false
  },

  // ========================
  // 可访问性 (Accessibility)
  // ========================
  {
    id: 'high-contrast-pro',
    name: '高对比专业',
    category: 'accessibility',
    description: '高对比专业配方，满足WCAG AAA标准',
    recipeId: 'hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat',
    colors: { primary: '#1e40af', accent: '#1d4ed8', background: '#ffffff' },
    colorsArray: ['#1e40af', '#1d4ed8', '#1e3a8a', '#ffffff', '#1e293b', '#f1f5f9', '#e2e8f0', '#cbd5e1'],
    tags: ['高对比', '可访问性', 'WCAG'],
    isNew: false,
    isPopular: false
  }
] as const

// ============================================================================
// Workbench默认配方 (单独管理，不与主题配方混淆)
// ============================================================================

export const WORKBENCH_DEFAULT_RECIPES = [
  {
    id: 'monochrome-gray',
    name: '单色灰',
    description: '极简主义灰色调主题',
    colors: ['#6B7280', '#4B5563', '#374151', '#F9FAFB', '#111827', '#F3F4F6', '#E5E7EB', '#D1D5DB'],
    tags: ['gray', 'monochrome', 'minimal', 'simple']
  }
] as const

// ============================================================================
// 统计和工具函数
// ============================================================================

export const UNIFIED_THEME_STATS = {
  total: UNIFIED_THEME_RECIPES.length,
  categories: {
    corporate: UNIFIED_THEME_RECIPES.filter(t => t.category === 'corporate').length,
    minimal: UNIFIED_THEME_RECIPES.filter(t => t.category === 'minimal').length,
    tech: UNIFIED_THEME_RECIPES.filter(t => t.category === 'tech').length,
    creative: UNIFIED_THEME_RECIPES.filter(t => t.category === 'creative').length,
    nature: UNIFIED_THEME_RECIPES.filter(t => t.category === 'nature').length,
    festival: UNIFIED_THEME_RECIPES.filter(t => t.category === 'festival').length,
    accessibility: UNIFIED_THEME_RECIPES.filter(t => t.category === 'accessibility').length
  },
  popular: UNIFIED_THEME_RECIPES.filter(t => t.isPopular).length,
  new: UNIFIED_THEME_RECIPES.filter(t => t.isNew).length
}

/**
 * 获取统一主题配方
 */
export function getUnifiedThemeById(id: string): UnifiedThemeRecipe | undefined {
  return UNIFIED_THEME_RECIPES.find(theme => theme.id === id)
}

/**
 * 获取Workbench配方
 */
export function getWorkbenchRecipeById(id: string): typeof WORKBENCH_DEFAULT_RECIPES[0] | undefined {
  return WORKBENCH_DEFAULT_RECIPES.find(recipe => recipe.id === id)
}

/**
 * 默认主题
 */
export const DEFAULT_UNIFIED_THEME = UNIFIED_THEME_RECIPES[0] // 企业蓝