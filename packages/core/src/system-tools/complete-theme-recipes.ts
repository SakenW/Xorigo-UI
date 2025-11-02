/**
 * 🎨 Xorigo UI 完整主题配方库
 *
 * 包含20个精心设计的主题配方，涵盖企业、极简、科技、创意、自然、节日等多种风格
 * 支持七轴主题系统：mode, base, accent, tone, density, motion, surface
 */

// ============================================================================
// 核心类型定义
// ============================================================================

export interface CompleteThemeRecipe {
  // 基础信息
  id: string
  name: string
  category: string
  description: string

  // 七轴配方ID
  recipeId: string

  // 主题色彩
  colors: {
    primary: string
    accent: string
    background: string
  }

  // 标签和状态
  tags: string[]
  isNew: boolean
  isPopular: boolean
}

export interface ThemeCategory {
  id: string
  name: string
  description: string
}

// ============================================================================
// 主题分类定义
// ============================================================================

export const THEME_CATEGORIES: ThemeCategory[] = [
  { id: 'all', name: '全部主题', description: '查看所有20个主题配方' },
  { id: 'corporate', name: '企业系列', description: '专业商务应用主题' },
  { id: 'minimal', name: '极简系列', description: '简洁现代设计风格' },
  { id: 'tech', name: '科技系列', description: '现代科技感主题' },
  { id: 'creative', name: '创意系列', description: '富有创意的设计风格' },
  { id: 'nature', name: '自然风光', description: '自然色彩主题' },
  { id: 'festival', name: '节日庆典', description: '欢快节日氛围主题' },
  { id: 'accessibility', name: '可访问性', description: '高对比无障碍主题' }
] as const

// ============================================================================
// 完整的20个主题配方
// ============================================================================

export const COMPLETE_THEME_RECIPES: CompleteThemeRecipe[] = [
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
    tags: ['高贵', '紫色', '奢华'],
    isNew: true,
    isPopular: false
  },

  // ========================
  // 自然风光 (Nature)
  // ========================
  {
    id: 'deep-ocean',
    name: '深海探索',
    category: 'nature',
    description: '神秘深邃的蓝色主题，探索深海的静谧',
    recipeId: 'dark.neutral-cool-high.mono(blue).standard.comfortable.minimal.elevated',
    colors: { primary: '#1e40af', accent: '#3b82f6', background: '#0f172a' },
    tags: ['海洋', '深邃', '自然'],
    isNew: true,
    isPopular: true
  },
  {
    id: 'forest-nature',
    name: '自然森林',
    category: 'nature',
    description: '清新自然的绿色主题，呼吸森林的空气',
    recipeId: 'light.neutral-true-mid.analog(green).standard.comfortable.standard.soft-shadow',
    colors: { primary: '#059669', accent: '#10b981', background: '#ffffff' },
    tags: ['森林', '自然', '绿色'],
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
    tags: ['嘉年华', '马戏团', '节日'],
    isNew: true,
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
    tags: ['高对比', '可访问性', 'WCAG'],
    isNew: false,
    isPopular: false
  }
] as const

// ============================================================================
// 主题工具函数
// ============================================================================

/**
 * 根据分类获取主题
 */
export function getThemesByCategory(category: string): CompleteThemeRecipe[] {
  if (category === 'all') return COMPLETE_THEME_RECIPES
  return COMPLETE_THEME_RECIPES.filter(theme => theme.category === category)
}

/**
 * 搜索主题
 */
export function searchThemes(query: string): CompleteThemeRecipe[] {
  const lowercaseQuery = query.toLowerCase()
  return COMPLETE_THEME_RECIPES.filter(theme =>
    theme.name.toLowerCase().includes(lowercaseQuery) ||
    theme.description.toLowerCase().includes(lowercaseQuery) ||
    theme.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

/**
 * 根据ID获取主题
 */
export function getThemeById(id: string): CompleteThemeRecipe | undefined {
  return COMPLETE_THEME_RECIPES.find(theme => theme.id === id)
}

/**
 * 获取热门主题
 */
export function getPopularThemes(): CompleteThemeRecipe[] {
  return COMPLETE_THEME_RECIPES.filter(theme => theme.isPopular)
}

/**
 * 获取新主题
 */
export function getNewThemes(): CompleteThemeRecipe[] {
  return COMPLETE_THEME_RECIPES.filter(theme => theme.isNew)
}

/**
 * 获取主题统计信息
 */
export function getThemeStats() {
  const stats = {
    total: COMPLETE_THEME_RECIPES.length,
    categories: THEME_CATEGORIES.length - 1, // 排除"all"分类
    popular: COMPLETE_THEME_RECIPES.filter(t => t.isPopular).length,
    new: COMPLETE_THEME_RECIPES.filter(t => t.isNew).length,
    byCategory: {} as Record<string, number>
  }

  THEME_CATEGORIES.slice(1).forEach(category => {
    stats.byCategory[category.id] = getThemesByCategory(category.id).length
  })

  return stats
}

// ============================================================================
// 导出默认值
// ============================================================================

export const DEFAULT_THEME = COMPLETE_THEME_RECIPES[0] // 企业蓝作为默认主题
export const DEFAULT_CATEGORY = 'all'