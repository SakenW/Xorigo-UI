/**
 * 🎨 统一主题预设库 - 50+ 预设主题
 *
 * 整合所有分类的主题预设：
 * - 企业级 (10个)
 * - 创意类 (10个)
 * - 科技类 (10个)
 * - 自然类 (10个)
 * - 经典款 (10个)
 *
 * 总计：50个精心设计的主题
 */

import type { PresetTheme } from '../advanced/twenty-six-params'

// 导入所有分类主题
export * from './corporate'
export * from './creative'
export * from './tech'
export * from './nature'
export * from './classic'

// ============================================================================
// 统一主题集合
// ============================================================================

/**
 * 所有50个预设主题
 */
export const ALL_PRESET_THEMES: PresetTheme[] = [
  // 企业级 (10个)
  ...require('./corporate').CORPORATE_THEMES,
  // 创意类 (10个)
  ...require('./creative').CREATIVE_THEMES,
  // 科技类 (10个)
  ...require('./tech').TECH_THEMES,
  // 自然类 (10个)
  ...require('./nature').NATURE_THEMES,
  // 经典款 (10个)
  ...require('./classic').CLASSIC_THEMES
]

/**
 * 按分类获取主题
 */
export function getThemesByCategory(category: string): PresetTheme[] {
  return ALL_PRESET_THEMES.filter(theme => theme.category === category)
}

/**
 * 获取所有分类
 */
export function getAllCategories(): string[] {
  const categories = Array.from(new Set(ALL_PRESET_THEMES.map(theme => theme.category)))
  return categories.sort()
}

/**
 * 获取热门主题 (rating >= 4.5)
 */
export function getPopularThemes(): PresetTheme[] {
  return ALL_PRESET_THEMES
    .filter(theme => theme.rating >= 4.5)
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 12)
}

/**
 * 获取新主题 (isNew === true)
 */
export function getNewThemes(): PresetTheme[] {
  return ALL_PRESET_THEMES
    .filter(theme => theme.isNew)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 12)
}

/**
 * 根据ID获取主题
 */
export function getThemeById(id: string): PresetTheme | undefined {
  return ALL_PRESET_THEMES.find(theme => theme.id === id)
}

/**
 * 搜索主题
 */
export function searchThemes(query: string): PresetTheme[] {
  if (!query || query.trim().length === 0) {
    return ALL_PRESET_THEMES
  }

  const lowercaseQuery = query.toLowerCase()
  return ALL_PRESET_THEMES.filter(theme =>
    theme.name.toLowerCase().includes(lowercaseQuery) ||
    theme.description.toLowerCase().includes(lowercaseQuery) ||
    theme.category.toLowerCase().includes(lowercaseQuery) ||
    theme.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

/**
 * 按标签搜索主题
 */
export function getThemesByTag(tag: string): PresetTheme[] {
  return ALL_PRESET_THEMES.filter(theme =>
    theme.tags.includes(tag.toLowerCase())
  )
}

/**
 * 获取主题统计信息
 */
export function getThemeStats() {
  const categoryStats = ALL_PRESET_THEMES.reduce((acc, theme) => {
    acc[theme.category] = (acc[theme.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalDownloads = ALL_PRESET_THEMES.reduce((sum, theme) => sum + theme.downloads, 0)
  const averageRating = ALL_PRESET_THEMES.reduce((sum, theme) => sum + theme.rating, 0) / ALL_PRESET_THEMES.length

  return {
    totalThemes: ALL_PRESET_THEMES.length,
    categories: Object.keys(categoryStats),
    categoryStats,
    totalDownloads,
    averageRating: Number(averageRating.toFixed(2)),
    mostPopular: ALL_PRESET_THEMES.sort((a, b) => b.downloads - a.downloads)[0],
    highestRated: ALL_PRESET_THEMES.sort((a, b) => b.rating - a.rating)[0]
  }
}

/**
 * 获取推荐主题 (基于当前主题)
 */
export function getRecommendedThemes(currentThemeId?: string, limit: number = 6): PresetTheme[] {
  const themes = currentThemeId
    ? ALL_PRESET_THEMES.filter(theme => theme.id !== currentThemeId)
    : ALL_PRESET_THEMES

  return themes
    .sort((a, b) => {
      // 热门优先，然后按评分
      if (a.isPopular && !b.isPopular) return -1
      if (!a.isPopular && b.isPopular) return 1
      return (b.rating * 0.7 + b.downloads / 10000 * 0.3) - (a.rating * 0.7 + a.downloads / 10000 * 0.3)
    })
    .slice(0, limit)
}

/**
 * 获取随机主题
 */
export function getRandomThemes(count: number = 6): PresetTheme[] {
  const shuffled = [...ALL_PRESET_THEMES].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

/**
 * 获取主题标签云
 */
export function getThemeTags(): Array<{ tag: string; count: number; themes: PresetTheme[] }> {
  const tagMap = new Map<string, { count: number; themes: PresetTheme[] }>()

  ALL_PRESET_THEMES.forEach(theme => {
    theme.tags.forEach(tag => {
      const lowerTag = tag.toLowerCase()
      if (!tagMap.has(lowerTag)) {
        tagMap.set(lowerTag, { count: 0, themes: [] })
      }
      const data = tagMap.get(lowerTag)!
      data.count++
      data.themes.push(theme)
    })
  })

  return Array.from(tagMap.entries())
    .map(([tag, data]) => ({ tag, count: data.count, themes: data.themes }))
    .sort((a, b) => b.count - a.count)
}

/**
 * 导出默认主题 (经典黑白)
 */
export const DEFAULT_PRESET_THEME = ALL_PRESET_THEMES.find(
  theme => theme.id === 'classic-black-white'
) || ALL_PRESET_THEMES[0]

/**
 * 获取主题排序选项
 */
export const THEME_SORT_OPTIONS = [
  { value: 'popularity', label: '热门度' },
  { value: 'rating', label: '评分' },
  { value: 'downloads', label: '下载量' },
  { value: 'newest', label: '最新' },
  { value: 'name', label: '名称' }
] as const

/**
 * 获取主题过滤选项
 */
export const THEME_FILTER_OPTIONS = {
  categories: getAllCategories(),
  tags: getThemeTags().map(item => item.tag),
  minRating: [4.0, 4.5, 4.7, 4.8, 4.9],
  hasDarkMode: (theme: PresetTheme) => theme.parameters.mode.mode === 'dark' || theme.parameters.mode.autoDetectSystem
}

// ============================================================================
// 主题预设库版本信息
// ============================================================================

export const PRESET_THEME_VERSION = {
  version: '2.0.0',
  buildDate: '2024-12-01',
  totalThemes: ALL_PRESET_THEMES.length,
  categories: getAllCategories().length,
  features: [
    '50+精心设计的主题',
    '5大主题分类',
    '七轴参数精细控制',
    '26参数完整配置',
    '搜索和过滤功能',
    '智能推荐系统'
  ]
}

// 默认导出所有主题
export default ALL_PRESET_THEMES
