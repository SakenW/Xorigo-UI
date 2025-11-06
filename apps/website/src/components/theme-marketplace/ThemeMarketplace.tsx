'use client'

/**
 * 🏪 主题市场 UI 组件
 *
 * 完整的主题市场界面，包含：
 * - 主题浏览和搜索
 * - 高级过滤和排序
 * - 实时预览和一键应用
 * - 评分和收藏系统
 * - 主题分享和导入导出
 * - 趋势分析和推荐
 */

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PresetTheme } from '../../../../packages/core/src/theme/advanced/twenty-six-params'
import {
  getAllCategories,
  searchThemes,
  getPopularThemes,
  getNewThemes,
  getThemeById
} from '../../../../packages/core/src/theme/presets'
import { ThemeMarketplace } from '../../../../packages/core/src/theme/marketplace'
import { enhancedThemeImportExport } from '../../../../packages/core/src/theme/export-import'

// 子组件
import ThemeGrid from './ThemeGrid'
import ThemeFilters from './ThemeFilters'
import ThemePreview from './ThemePreview'
import ThemeDetail from './ThemeDetail'
import ThemeRankings from './ThemeRankings'
import ShareDialog from './ShareDialog'
import ExportDialog from './ExportDialog'

// 图标组件
import {
  Search,
  Filter,
  Star,
  Download,
  Heart,
  Share2,
  TrendingUp,
  Award,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  RefreshCw
} from 'lucide-react'

// ============================================================================
// 类型定义
// ============================================================================

interface ThemeMarketplaceProps {
  initialCategory?: string
  showHeader?: boolean
  showRankings?: boolean
  defaultView?: 'grid' | 'list'
  userId?: string
}

interface FilterState {
  categories: string[]
  tags: string[]
  searchQuery: string
  minRating: number
  sortBy: 'popularity' | 'rating' | 'downloads' | 'newest' | 'trending' | 'name'
  sortOrder: 'asc' | 'desc'
}

interface ViewState {
  mode: 'grid' | 'list'
  selectedTheme: PresetTheme | null
  previewTheme: PresetTheme | null
  showFilters: boolean
  showRankings: boolean
  showShareDialog: boolean
  showExportDialog: boolean
}

// ============================================================================
// 主组件
// ============================================================================

const ThemeMarketplace: React.FC<ThemeMarketplaceProps> = ({
  initialCategory,
  showHeader = true,
  showRankings = true,
  defaultView = 'grid',
  userId
}) => {
  // 状态管理
  const [themes, setThemes] = useState<PresetTheme[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    categories: initialCategory ? [initialCategory] : [],
    tags: [],
    searchQuery: '',
    minRating: 0,
    sortBy: 'popularity',
    sortOrder: 'desc'
  })

  const [viewState, setViewState] = useState<ViewState>({
    mode: defaultView,
    selectedTheme: null,
    previewTheme: null,
    showFilters: false,
    showRankings,
    showShareDialog: false,
    showExportDialog: false
  })

  const [stats, setStats] = useState({
    totalThemes: 0,
    totalDownloads: 0,
    totalUsers: 0,
    averageRating: 0
  })

  // 市场实例
  const marketplace = useMemo(() => new ThemeMarketplace(), [])

  // ========================================================================
  // 数据加载
  // ========================================================================

  useEffect(() => {
    loadThemes()
    loadStats()
  }, [filters])

  const loadThemes = async () => {
    setLoading(true)
    try {
      // 应用搜索和过滤
      let filteredThemes: PresetTheme[]

      if (filters.searchQuery) {
        filteredThemes = searchThemes(filters.searchQuery)
      } else {
        filteredThemes = getPopularThemes()
      }

      // 应用分类过滤
      if (filters.categories.length > 0) {
        filteredThemes = filteredThemes.filter(theme =>
          filters.categories.includes(theme.category)
        )
      }

      // 应用标签过滤
      if (filters.tags.length > 0) {
        filteredThemes = filteredThemes.filter(theme =>
          filters.tags.some(tag => theme.tags.includes(tag))
        )
      }

      // 应用评分过滤
      if (filters.minRating > 0) {
        filteredThemes = filteredThemes.filter(theme =>
          theme.rating >= filters.minRating
        )
      }

      // 排序
      filteredThemes = sortThemes(filteredThemes, filters.sortBy, filters.sortOrder)

      setThemes(filteredThemes)
    } catch (error) {
      console.error('加载主题失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const marketplaceStats = marketplace.getMarketplaceStats()
      setStats(marketplaceStats)
    } catch (error) {
      console.error('加载统计数据失败:', error)
    }
  }

  // ========================================================================
  // 排序逻辑
  // ========================================================================

  const sortThemes = (
    themes: PresetTheme[],
    sortBy: string,
    order: 'asc' | 'desc'
  ): PresetTheme[] => {
    const reverse = order === 'desc' ? -1 : 1

    switch (sortBy) {
      case 'popularity':
      case 'downloads':
        return [...themes].sort((a, b) => (a.downloads - b.downloads) * reverse)

      case 'rating':
        return [...themes].sort((a, b) => (a.rating - b.rating) * reverse)

      case 'newest':
        return [...themes].sort((a, b) => (a.createdAt.getTime() - b.createdAt.getTime()) * reverse)

      case 'trending':
        return [...themes].sort((a, b) => (a.rating - b.rating) * reverse)

      case 'name':
        return [...themes].sort((a, b) => a.name.localeCompare(b.name) * reverse)

      default:
        return themes
    }
  }

  // ========================================================================
  // 事件处理
  // ========================================================================

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }))
  }

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }))
  }

  const handleThemeSelect = (theme: PresetTheme) => {
    setViewState(prev => ({ ...prev, selectedTheme: theme }))
  }

  const handleThemePreview = async (theme: PresetTheme) => {
    setViewState(prev => ({ ...prev, previewTheme: theme }))
    try {
      await enhancedThemeImportExport.applyThemePreview(theme)
    } catch (error) {
      console.error('应用预览失败:', error)
    }
  }

  const handleThemeApply = (theme: PresetTheme) => {
    handleThemePreview(theme)
    // TODO: 应用主题到整个应用
  }

  const handleThemeFavorite = (themeId: string) => {
    if (!userId) return

    try {
      marketplace.toggleFavorite(userId, themeId)
      // 更新主题列表
      loadThemes()
    } catch (error) {
      console.error('收藏操作失败:', error)
    }
  }

  const handleThemeRate = (themeId: string, rating: number) => {
    if (!userId) return

    try {
      marketplace.rateTheme(userId, themeId, rating)
      // 更新主题列表
      loadThemes()
    } catch (error) {
      console.error('评分操作失败:', error)
    }
  }

  const handleShareTheme = (theme: PresetTheme) => {
    setViewState(prev => ({ ...prev, showShareDialog: true, selectedTheme: theme }))
  }

  const handleExportThemes = (selectedThemes: PresetTheme[]) => {
    setViewState(prev => ({ ...prev, showExportDialog: true, selectedTheme: selectedThemes[0] || null }))
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadThemes()
    await loadStats()
    setRefreshing(false)
  }

  // ========================================================================
  // 渲染
  // ========================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* 头部 */}
      {showHeader && (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  主题市场
                </h1>
                <div className="hidden sm:flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                  <span>{stats.totalThemes} 个主题</span>
                  <span>•</span>
                  <span>{stats.totalDownloads.toLocaleString()} 下载</span>
                  <span>•</span>
                  <span>评分 {stats.averageRating.toFixed(1)}</span>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="刷新"
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={() => setViewState(prev => ({ ...prev, showFilters: !prev.showFilters }))}
                  className={`p-2 rounded-lg transition-colors ${
                    viewState.showFilters
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="过滤"
                >
                  <Filter className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setViewState(prev => ({ ...prev, showRankings: !prev.showRankings }))}
                  className={`p-2 rounded-lg transition-colors ${
                    viewState.showRankings
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="排行榜"
                >
                  <Award className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 主体内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 侧边栏 */}
          <AnimatePresence>
            {(viewState.showFilters || viewState.showRankings) && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="space-y-6">
                  {/* 过滤器 */}
                  {viewState.showFilters && (
                    <ThemeFilters
                      filters={filters}
                      onChange={handleFilterChange}
                      categories={getAllCategories()}
                    />
                  )}

                  {/* 排行榜 */}
                  {viewState.showRankings && showRankings && (
                    <ThemeRankings
                      marketplace={marketplace}
                      onThemeSelect={handleThemeSelect}
                    />
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* 主内容区 */}
          <main className="flex-1 min-w-0">
            {/* 搜索栏 */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索主题名称、描述或标签..."
                  value={filters.searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* 排序选项 */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    排序方式：
                  </span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleSortChange(e.target.value as FilterState['sortBy'])}
                    className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="popularity">热门度</option>
                    <option value="rating">评分</option>
                    <option value="downloads">下载量</option>
                    <option value="newest">最新</option>
                    <option value="trending">趋势</option>
                    <option value="name">名称</option>
                  </select>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }))}
                    className="p-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    {filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewState(prev => ({ ...prev, mode: 'grid' }))}
                    className={`p-2 rounded-lg transition-colors ${
                      viewState.mode === 'grid'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewState(prev => ({ ...prev, mode: 'list' }))}
                    className={`p-2 rounded-lg transition-colors ${
                      viewState.mode === 'list'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 主题网格 */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-20"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </motion.div>
              ) : (
                <ThemeGrid
                  themes={themes}
                  viewMode={viewState.mode}
                  onSelect={handleThemeSelect}
                  onPreview={handleThemePreview}
                  onApply={handleThemeApply}
                  onFavorite={handleThemeFavorite}
                  onRate={handleThemeRate}
                  onShare={handleShareTheme}
                  userId={userId}
                />
              )}
            </AnimatePresence>

            {/* 空状态 */}
            {!loading && themes.length === 0 && (
              <div className="text-center py-20">
                <div className="text-slate-400 dark:text-slate-600 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-medium">未找到匹配的主题</p>
                  <p className="text-sm mt-2">尝试调整搜索条件或过滤器</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 预览面板 */}
      <AnimatePresence>
        {viewState.previewTheme && (
          <ThemePreview
            theme={viewState.previewTheme}
            onClose={() => setViewState(prev => ({ ...prev, previewTheme: null }))}
            onApply={() => handleThemeApply(viewState.previewTheme!)}
          />
        )}
      </AnimatePresence>

      {/* 主题详情 */}
      <AnimatePresence>
        {viewState.selectedTheme && (
          <ThemeDetail
            theme={viewState.selectedTheme}
            onClose={() => setViewState(prev => ({ ...prev, selectedTheme: null }))}
            onPreview={() => handleThemePreview(viewState.selectedTheme!)}
            onApply={() => handleThemeApply(viewState.selectedTheme!)}
            onFavorite={() => handleThemeFavorite(viewState.selectedTheme!.id)}
            onRate={(rating) => handleThemeRate(viewState.selectedTheme!.id, rating)}
            onShare={() => handleShareTheme(viewState.selectedTheme!)}
            userId={userId}
          />
        )}
      </AnimatePresence>

      {/* 分享对话框 */}
      <AnimatePresence>
        {viewState.showShareDialog && viewState.selectedTheme && (
          <ShareDialog
            theme={viewState.selectedTheme}
            onClose={() => setViewState(prev => ({ ...prev, showShareDialog: false }))}
          />
        )}
      </AnimatePresence>

      {/* 导出对话框 */}
      <AnimatePresence>
        {viewState.showExportDialog && (
          <ExportDialog
            themes={themes}
            onClose={() => setViewState(prev => ({ ...prev, showExportDialog: false }))}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ThemeMarketplace

// ============================================================================
// 性能监控
// ============================================================================

// 主题切换性能监控
export const logThemeSwitchPerformance = (themeId: string, duration: number) => {
  if (duration > 100) {
    console.warn(`主题切换性能警告: ${themeId} 耗时 ${duration.toFixed(2)}ms (超过100ms阈值)`)
  }
}

// 预设加载性能监控
export const logPresetLoadPerformance = (count: number, duration: number) => {
  if (duration > 200) {
    console.warn(`预设加载性能警告: ${count} 个主题耗时 ${duration.toFixed(2)}ms (超过200ms阈值)`)
  }
}
