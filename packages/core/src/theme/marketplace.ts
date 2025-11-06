/**
 * 🏪 主题市场核心系统
 *
 * 提供完整的主题市场功能：
 * - 主题评分系统
 * - 用户收藏功能
 * - 主题趋势分析
 * - 主题分享和导入导出
 * - 实时预览和切换
 * - 主题排行榜
 * - 社区推荐
 */

import type { PresetTheme, TwentySixParams } from './advanced/twenty-six-params'
import { ALL_PRESET_THEMES, getRecommendedThemes } from './presets'

// ============================================================================
// 主题市场类型定义
// ============================================================================

/**
 * 主题评分
 */
export interface ThemeRating {
  userId: string
  themeId: string
  rating: number // 1-5
  review?: string
  createdAt: number
  updatedAt: number
}

/**
 * 用户收藏
 */
export interface UserFavorite {
  userId: string
  themeId: string
  createdAt: number
  tags?: string[] // 用户自定义标签
  notes?: string // 用户笔记
}

/**
 * 主题趋势
 */
export interface ThemeTrend {
  themeId: string
  date: string // YYYY-MM-DD
  downloads: number
  views: number
  shares: number
  rating: number
}

/**
 * 主题统计
 */
export interface ThemeStats {
  themeId: string
  totalDownloads: number
  totalViews: number
  totalShares: number
  totalRatings: number
  averageRating: number
  ratingDistribution: Record<number, number> // 1-5星分布
  trendData: ThemeTrend[]
  lastUpdated: number
}

/**
 * 主题市场项目
 */
export interface MarketplaceTheme extends PresetTheme {
  stats: ThemeStats
  isFavorited?: boolean
  userRating?: number
  trendScore: number // 综合趋势得分
  compatibility: {
    darkMode: boolean
    highContrast: boolean
    accessibility: boolean
  }
  community: {
    totalComments: number
    totalShares: number
    featured: boolean
  }
}

/**
 * 主题排行榜
 */
export interface ThemeRanking {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all'
  categories: {
    mostDownloaded: MarketplaceTheme[]
    highestRated: MarketplaceTheme[]
    trending: MarketplaceTheme[]
    newest: MarketplaceTheme[]
    featured: MarketplaceTheme[]
  }
  updatedAt: number
}

/**
 * 用户偏好
 */
export interface UserPreference {
  userId: string
  favoriteCategories: string[]
  favoriteTags: string[]
  preferredColors: number[]
  usageHistory: string[]
  lastActive: number
}

/**
 * 主题市场过滤器
 */
export interface MarketplaceFilter {
  categories?: string[]
  tags?: string[]
  colors?: number[]
  minRating?: number
  maxRating?: number
  features?: string[]
  searchQuery?: string
  sortBy?: 'popularity' | 'rating' | 'downloads' | 'newest' | 'trending' | 'name'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

// ============================================================================
// 主题市场核心类
// ============================================================================

/**
 * 主题市场核心系统
 */
export class ThemeMarketplace {
  private ratings: Map<string, ThemeRating[]>
  private favorites: Map<string, UserFavorite[]>
  private trends: Map<string, ThemeTrend[]>
  private statsCache: Map<string, ThemeStats>
  private userPreferences: Map<string, UserPreference>
  private rankingsCache: Map<string, ThemeRanking>

  constructor() {
    this.ratings = new Map()
    this.favorites = new Map()
    this.trends = new Map()
    this.statsCache = new Map()
    this.userPreferences = new Map()
    this.rankingsCache = new Map()

    this.initializeData()
  }

  // ========================================================================
  // 数据初始化
  // ========================================================================

  private initializeData(): void {
    // 模拟初始数据
    ALL_PRESET_THEMES.forEach(theme => {
      this.initializeThemeStats(theme.id)
      this.initializeTrends(theme.id)
    })
  }

  private initializeThemeStats(themeId: string): void {
    const theme = ALL_PRESET_THEMES.find(t => t.id === themeId)
    if (!theme) return

    const stats: ThemeStats = {
      themeId,
      totalDownloads: theme.downloads,
      totalViews: theme.downloads * (Math.random() * 2 + 1),
      totalShares: Math.floor(theme.downloads * 0.1),
      totalRatings: Math.floor(theme.downloads * 0.05),
      averageRating: theme.rating,
      ratingDistribution: {
        5: Math.floor(theme.downloads * 0.04),
        4: Math.floor(theme.downloads * 0.008),
        3: Math.floor(theme.downloads * 0.002),
        2: Math.floor(theme.downloads * 0.0005),
        1: Math.floor(theme.downloads * 0.0001)
      },
      trendData: this.generateTrendData(themeId, theme.downloads),
      lastUpdated: Date.now()
    }

    this.statsCache.set(themeId, stats)
  }

  private generateTrendData(themeId: string, baseDownloads: number): ThemeTrend[] {
    const data: ThemeTrend[] = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const trend: ThemeTrend = {
        themeId,
        date: date.toISOString().split('T')[0],
        downloads: Math.floor(baseDownloads * 0.001 * (Math.random() * 2 + 0.5)),
        views: Math.floor(baseDownloads * 0.005 * (Math.random() * 2 + 0.5)),
        shares: Math.floor(baseDownloads * 0.0001 * (Math.random() * 2 + 0.5)),
        rating: baseDownloads > 10000 ? 4.5 + Math.random() * 0.4 : 4.0 + Math.random() * 0.6
      }

      data.push(trend)
    }

    return data
  }

  private initializeTrends(themeId: string): void {
    // 趋势数据已在 initializeThemeStats 中生成
  }

  // ========================================================================
  // 主题市场功能
  // ========================================================================

  /**
   * 获取所有市场主题
   */
  getAllMarketplaceThemes(userId?: string): MarketplaceTheme[] {
    return ALL_PRESET_THEMES.map(theme => {
      const stats = this.statsCache.get(theme.id)!
      const isFavorited = userId ? this.isThemeFavorited(userId, theme.id) : false
      const userRating = userId ? this.getUserRating(userId, theme.id) : undefined
      const trendScore = this.calculateTrendScore(theme.id)

      return {
        ...theme,
        stats,
        isFavorited,
        userRating,
        trendScore,
        compatibility: {
          darkMode: theme.parameters.mode.mode === 'dark' || theme.parameters.mode.autoDetectSystem,
          highContrast: theme.parameters.contrast.level === 'high',
          accessibility: theme.category === '企业级' && theme.tags.includes('accessibility')
        },
        community: {
          totalComments: Math.floor(stats.totalDownloads * 0.02),
          totalShares: stats.totalShares,
          featured: theme.isPopular || trendScore > 8.0
        }
      }
    })
  }

  /**
   * 搜索和过滤主题
   */
  searchThemes(filter: MarketplaceFilter, userId?: string): {
    themes: MarketplaceTheme[]
    total: number
    page: number
    pageSize: number
  } {
    let themes = this.getAllMarketplaceThemes(userId)

    // 应用过滤器
    if (filter.categories && filter.categories.length > 0) {
      themes = themes.filter(theme => filter.categories!.includes(theme.category))
    }

    if (filter.tags && filter.tags.length > 0) {
      themes = themes.filter(theme =>
        filter.tags!.some(tag => theme.tags.includes(tag.toLowerCase()))
      )
    }

    if (filter.colors && filter.colors.length > 0) {
      themes = themes.filter(theme => {
        const hue = theme.parameters.hue.primary
        return filter.colors!.some(color => {
          const diff = Math.min(
            Math.abs(hue - color),
            360 - Math.abs(hue - color)
          )
          return diff <= 30 // 允许30度误差
        })
      })
    }

    if (filter.minRating !== undefined) {
      themes = themes.filter(theme => theme.stats.averageRating >= filter.minRating!)
    }

    if (filter.maxRating !== undefined) {
      themes = themes.filter(theme => theme.stats.averageRating <= filter.maxRating!)
    }

    if (filter.searchQuery && filter.searchQuery.trim()) {
      const query = filter.searchQuery.toLowerCase()
      themes = themes.filter(theme =>
        theme.name.toLowerCase().includes(query) ||
        theme.description.toLowerCase().includes(query) ||
        theme.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 排序
    if (filter.sortBy) {
      themes = this.sortThemes(themes, filter.sortBy, filter.sortOrder || 'desc')
    }

    // 分页
    const page = filter.page || 1
    const pageSize = filter.pageSize || 20
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    return {
      themes: themes.slice(startIndex, endIndex),
      total: themes.length,
      page,
      pageSize
    }
  }

  /**
   * 主题排序
   */
  private sortThemes(
    themes: MarketplaceTheme[],
    sortBy: string,
    order: 'asc' | 'desc'
  ): MarketplaceTheme[] {
    const reverse = order === 'desc' ? -1 : 1

    switch (sortBy) {
      case 'popularity':
        return themes.sort((a, b) => (a.stats.totalDownloads - b.stats.totalDownloads) * reverse)

      case 'rating':
        return themes.sort((a, b) => (a.stats.averageRating - b.stats.averageRating) * reverse)

      case 'downloads':
        return themes.sort((a, b) => (a.stats.totalDownloads - b.stats.totalDownloads) * reverse)

      case 'newest':
        return themes.sort((a, b) => (a.createdAt.getTime() - b.createdAt.getTime()) * reverse)

      case 'trending':
        return themes.sort((a, b) => (a.trendScore - b.trendScore) * reverse)

      case 'name':
        return themes.sort((a, b) => a.name.localeCompare(b.name) * reverse)

      default:
        return themes
    }
  }

  // ========================================================================
  // 评分系统
  // ========================================================================

  /**
   * 评分主题
   */
  rateTheme(userId: string, themeId: string, rating: number, review?: string): boolean {
    if (rating < 1 || rating > 5) {
      throw new Error('评分必须在1-5之间')
    }

    const userRatings = this.ratings.get(userId) || []
    const existingRatingIndex = userRatings.findIndex(r => r.themeId === themeId)

    const ratingData: ThemeRating = {
      userId,
      themeId,
      rating,
      review,
      createdAt: existingRatingIndex >= 0 ? userRatings[existingRatingIndex].createdAt : Date.now(),
      updatedAt: Date.now()
    }

    if (existingRatingIndex >= 0) {
      userRatings[existingRatingIndex] = ratingData
    } else {
      userRatings.push(ratingData)
    }

    this.ratings.set(userId, userRatings)

    // 更新主题统计
    this.updateThemeRating(themeId)

    return true
  }

  /**
   * 获取用户评分
   */
  getUserRating(userId: string, themeId: string): number | undefined {
    const userRatings = this.ratings.get(userId)
    const rating = userRatings?.find(r => r.themeId === themeId)
    return rating?.rating
  }

  /**
   * 更新主题评分统计
   */
  private updateThemeRating(themeId: string): void {
    let totalRating = 0
    let count = 0
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    for (const ratings of this.ratings.values()) {
      const rating = ratings.find(r => r.themeId === themeId)
      if (rating) {
        totalRating += rating.rating
        count++
        distribution[rating.rating as keyof typeof distribution]++
      }
    }

    const stats = this.statsCache.get(themeId)
    if (stats) {
      stats.averageRating = count > 0 ? totalRating / count : 0
      stats.totalRatings = count
      stats.ratingDistribution = distribution
      stats.lastUpdated = Date.now()
    }
  }

  // ========================================================================
  // 收藏系统
  // ========================================================================

  /**
   * 切换主题收藏状态
   */
  toggleFavorite(userId: string, themeId: string, tags?: string[], notes?: string): boolean {
    const userFavorites = this.favorites.get(userId) || []
    const existingIndex = userFavorites.findIndex(f => f.themeId === themeId)

    if (existingIndex >= 0) {
      // 取消收藏
      userFavorites.splice(existingIndex, 1)
      this.favorites.set(userId, userFavorites)
      return false
    } else {
      // 添加收藏
      userFavorites.push({
        userId,
        themeId,
        createdAt: Date.now(),
        tags,
        notes
      })
      this.favorites.set(userId, userFavorites)
      return true
    }
  }

  /**
   * 检查主题是否被收藏
   */
  isThemeFavorited(userId: string, themeId: string): boolean {
    const userFavorites = this.favorites.get(userId) || []
    return userFavorites.some(f => f.themeId === themeId)
  }

  /**
   * 获取用户收藏的主题
   */
  getUserFavorites(userId: string): MarketplaceTheme[] {
    const userFavorites = this.favorites.get(userId) || []
    return this.getAllMarketplaceThemes(userId).filter(theme =>
      userFavorites.some(f => f.themeId === theme.id)
    )
  }

  // ========================================================================
  // 趋势分析
  // ========================================================================

  /**
   * 计算主题趋势得分
   */
  private calculateTrendScore(themeId: string): number {
    const stats = this.statsCache.get(themeId)
    if (!stats || stats.trendData.length === 0) return 0

    const recentData = stats.trendData.slice(-7) // 最近7天
    const olderData = stats.trendData.slice(-14, -7) // 前7天

    const recentAvg = recentData.reduce((sum, d) => sum + d.downloads, 0) / recentData.length
    const olderAvg = olderData.reduce((sum, d) => sum + d.downloads, 0) / olderData.length

    // 计算增长率
    const growthRate = olderAvg > 0 ? (recentAvg - olderAvg) / olderAvg : 0

    // 综合得分：下载量增长率 + 评分 + 分享率
    const shareRate = stats.totalViews > 0 ? stats.totalShares / stats.totalViews : 0
    const score = (growthRate * 50) + (stats.averageRating * 10) + (shareRate * 1000)

    return Math.max(0, Math.min(10, score))
  }

  /**
   * 获取热门趋势主题
   */
  getTrendingThemes(limit: number = 10): MarketplaceTheme[] {
    const themes = this.getAllMarketplaceThemes()
    return themes
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit)
  }

  // ========================================================================
  // 排行榜
  // ========================================================================

  /**
   * 获取主题排行榜
   */
  getThemeRankings(period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all' = 'monthly'): ThemeRanking {
    const cacheKey = `rankings-${period}`
    const cached = this.rankingsCache.get(cacheKey)

    if (cached && Date.now() - cached.updatedAt < 3600000) { // 1小时缓存
      return cached
    }

    const themes = this.getAllMarketplaceThemes()

    const rankings: ThemeRanking = {
      period,
      categories: {
        mostDownloaded: themes
          .sort((a, b) => b.stats.totalDownloads - a.stats.totalDownloads)
          .slice(0, 10),
        highestRated: themes
          .sort((a, b) => b.stats.averageRating - a.stats.averageRating)
          .slice(0, 10),
        trending: themes
          .sort((a, b) => b.trendScore - a.trendScore)
          .slice(0, 10),
        newest: themes
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 10),
        featured: themes.filter(t => t.isPopular || t.trendScore > 8.0).slice(0, 10)
      },
      updatedAt: Date.now()
    }

    this.rankingsCache.set(cacheKey, rankings)
    return rankings
  }

  // ========================================================================
  // 统计信息
  // ========================================================================

  /**
   * 获取市场统计
   */
  getMarketplaceStats(): {
    totalThemes: number
    totalDownloads: number
    totalUsers: number
    totalRatings: number
    averageRating: number
    topCategories: Array<{ name: string; count: number }>
    trendingThemes: MarketplaceTheme[]
  } {
    const themes = this.getAllMarketplaceThemes()
    const totalDownloads = themes.reduce((sum, t) => sum + t.stats.totalDownloads, 0)
    const totalRatings = themes.reduce((sum, t) => sum + t.stats.totalRatings, 0)
    const averageRating = themes.reduce((sum, t) => sum + t.stats.averageRating, 0) / themes.length

    const categoryStats = themes.reduce((acc, theme) => {
      acc[theme.category] = (acc[theme.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topCategories = Object.entries(categoryStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return {
      totalThemes: themes.length,
      totalDownloads,
      totalUsers: this.userPreferences.size,
      totalRatings,
      averageRating: Number(averageRating.toFixed(2)),
      topCategories,
      trendingThemes: this.getTrendingThemes(5)
    }
  }

  // ========================================================================
  // 个性化推荐
  // ========================================================================

  /**
   * 获取个性化推荐
   */
  getPersonalizedRecommendations(userId: string, limit: number = 6): MarketplaceTheme[] {
    const userPrefs = this.userPreferences.get(userId)
    const allThemes = this.getAllMarketplaceThemes(userId)

    if (!userPrefs) {
      // 新用户推荐热门主题
      return allThemes
        .sort((a, b) => b.stats.totalDownloads - a.stats.totalDownloads)
        .slice(0, limit)
    }

    // 基于用户偏好计算推荐得分
    const scoredThemes = allThemes.map(theme => {
      let score = 0

      // 分类偏好
      if (userPrefs.favoriteCategories.includes(theme.category)) {
        score += 5
      }

      // 标签偏好
      const matchingTags = theme.tags.filter(tag =>
        userPrefs.favoriteTags.includes(tag)
      )
      score += matchingTags.length * 2

      // 颜色偏好
      const hue = theme.parameters.hue.primary
      if (userPrefs.preferredColors.some(color => {
        const diff = Math.min(Math.abs(hue - color), 360 - Math.abs(hue - color))
        return diff <= 30
      })) {
        score += 3
      }

      // 已有评分加权
      const userRating = this.getUserRating(userId, theme.id)
      if (userRating) {
        score += userRating * 2
      }

      // 避免重复推荐
      if (userPrefs.usageHistory.includes(theme.id)) {
        score *= 0.5
      }

      return { theme, score }
    })

    return scoredThemes
      .sort((a, b) => b.score - a.score)
      .map(item => item.theme)
      .slice(0, limit)
  }

  /**
   * 更新用户偏好
   */
  updateUserPreference(userId: string, preferences: Partial<UserPreference>): void {
    const existing = this.userPreferences.get(userId) || {
      userId,
      favoriteCategories: [],
      favoriteTags: [],
      preferredColors: [],
      usageHistory: [],
      lastActive: Date.now()
    }

    this.userPreferences.set(userId, {
      ...existing,
      ...preferences,
      lastActive: Date.now()
    })
  }

  // ========================================================================
  // 工具方法
  // ========================================================================

  /**
   * 记录主题使用
   */
  recordThemeUsage(userId: string, themeId: string): void {
    const prefs = this.userPreferences.get(userId)
    if (prefs) {
      const usage = [themeId, ...prefs.usageHistory.filter(id => id !== themeId)].slice(0, 50)
      this.userPreferences.set(userId, {
        ...prefs,
        usageHistory: usage,
        lastActive: Date.now()
      })
    }
  }

  /**
   * 获取主题详细信息
   */
  getThemeDetails(themeId: string, userId?: string): MarketplaceTheme | null {
    const themes = this.getAllMarketplaceThemes(userId)
    return themes.find(t => t.id === themeId) || null
  }
}

// ============================================================================
// 默认实例
// ============================================================================

export const themeMarketplace = new ThemeMarketplace()

// ============================================================================
// 便捷函数
// ============================================================================

export const getAllMarketplaceThemes = (userId?: string) =>
  themeMarketplace.getAllMarketplaceThemes(userId)

export const searchMarketplaceThemes = (filter: MarketplaceFilter, userId?: string) =>
  themeMarketplace.searchThemes(filter, userId)

export const getThemeRankings = (period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all') =>
  themeMarketplace.getThemeRankings(period)

export const getTrendingThemes = (limit?: number) =>
  themeMarketplace.getTrendingThemes(limit)

export const getPersonalizedRecommendations = (userId: string, limit?: number) =>
  themeMarketplace.getPersonalizedRecommendations(userId, limit)

export const rateTheme = (userId: string, themeId: string, rating: number, review?: string) =>
  themeMarketplace.rateTheme(userId, themeId, rating, review)

export const toggleFavorite = (userId: string, themeId: string, tags?: string[], notes?: string) =>
  themeMarketplace.toggleFavorite(userId, themeId, tags, notes)

export const getMarketplaceStats = () =>
  themeMarketplace.getMarketplaceStats()

export default themeMarketplace
