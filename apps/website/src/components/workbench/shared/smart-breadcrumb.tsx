'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Home, ArrowRight, MoreHorizontal, X, Bookmark, History, Star } from 'lucide-react'
import { Button } from '@xorigo-ui/core'
import { cn } from '@/utils'

// 面包屑项目接口
interface BreadcrumbItem {
  id: string
  label: string
  href?: string
  icon?: React.ReactNode
  isActive?: boolean
  isDropdown?: boolean
  children?: BreadcrumbItem[]
  description?: string
  badge?: string
  onClick?: () => void
}

// 用户偏好接口
interface UserPreferences {
  defaultView: 'solutions' | 'components'
  theme: 'light' | 'dark' | 'auto'
  language: 'zh-CN' | 'en-US'
  showAdvanced: boolean
  compactMode: boolean
  animationsEnabled: boolean
  searchHistory: string[]
  favoriteComponents: string[]
  favoriteSolutions: string[]
  recentlyViewed: {
    id: string
    type: 'component' | 'solution' | 'template'
    label: string
    timestamp: Date
  }[]
}

interface SmartBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showFavorites?: boolean
  showHistory?: boolean
  maxVisible?: number
  onItemSelect?: (item: BreadcrumbItem) => void
  onPreferencesChange?: (preferences: Partial<UserPreferences>) => void
}

export function SmartBreadcrumb({
  items,
  className,
  showFavorites = true,
  showHistory = true,
  maxVisible = 4,
  onItemSelect,
  onPreferencesChange
}: SmartBreadcrumbProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [showDropdown, setShowDropdown] = useState<string | null>(null)
  const [showFavoritesPanel, setShowFavoritesPanel] = useState(false)
  const [showHistoryPanel, setShowHistoryPanel] = useState(false)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    defaultView: 'solutions',
    theme: 'auto',
    language: 'zh-CN',
    showAdvanced: false,
    compactMode: false,
    animationsEnabled: true,
    searchHistory: [],
    favoriteComponents: [],
    favoriteSolutions: [],
    recentlyViewed: []
  })

  // 从 localStorage 加载用户偏好
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('xorigo-workbench-preferences')
      if (saved) {
        try {
          const preferences = JSON.parse(saved)
          setUserPreferences(prev => ({ ...prev, ...preferences }))
        } catch (error) {
          console.error('Failed to load preferences:', error)
        }
      }
    }
  }, [])

  // 保存用户偏好到 localStorage
  const savePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...userPreferences, ...newPreferences }
    setUserPreferences(updated)
    localStorage.setItem('xorigo-workbench-preferences', JSON.stringify(updated))
    onPreferencesChange?.(newPreferences)
  }

  // 处理面包屑项目点击
  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick()
    } else if (item.href) {
      window.location.href = item.href
    }
    onItemSelect?.(item)

    // 添加到最近查看
    if (item.id && !item.isActive) {
      const recentlyViewed = [
        {
          id: item.id,
          type: 'component' as const,
          label: item.label,
          timestamp: new Date()
        },
        ...userPreferences.recentlyViewed.slice(0, 9)
      ]
      savePreferences({ recentlyViewed })
    }
  }

  // 切换下拉菜单
  const toggleDropdown = (itemId: string) => {
    setShowDropdown(showDropdown === itemId ? null : itemId)
  }

  // 切换收藏状态
  const toggleFavorite = (itemId: string, type: 'component' | 'solution') => {
    const favoritesKey = type === 'component' ? 'favoriteComponents' : 'favoriteSolutions'
    const favorites = userPreferences[favoritesKey] as string[]
    const updated = favorites.includes(itemId)
      ? favorites.filter(id => id !== itemId)
      : [...favorites, itemId]

    savePreferences({ [favoritesKey]: updated })
  }

  // 处理项目展开/收起
  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  // 渲染面包屑项目
  const renderBreadcrumbItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const isExpanded = expandedItems.has(item.id)
    const hasDropdown = item.children && item.children.length > 0
    const isFavorite = [
      ...userPreferences.favoriteComponents,
      ...userPreferences.favoriteSolutions
    ].includes(item.id)

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center"
      >
        {/* 面包屑项目 */}
        <div className="relative group">
          <button
            onClick={() => handleItemClick(item)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
              item.isActive
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {/* 图标 */}
            {item.icon && (
              <span className="flex-shrink-0 w-4 h-4">
                {item.icon}
              </span>
            )}

            {/* 标签 */}
            <span className="truncate max-w-[150px] md:max-w-[200px]">
              {item.label}
            </span>

            {/* 徽章 */}
            {item.badge && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                {item.badge}
              </span>
            )}

            {/* 收藏图标 */}
            {showFavorites && !isLast && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const type = item.id?.startsWith('component-') ? 'component' : 'solution'
                  toggleFavorite(item.id, type)
                }}
                className={cn(
                  'p-1 rounded transition-colors',
                  'hover:bg-gray-200 dark:hover:bg-gray-700',
                  isFavorite
                    ? 'text-yellow-500 hover:text-yellow-600'
                    : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                )}
              >
                <Star className={cn('w-3 h-3', isFavorite && 'fill-current')} />
              </button>
            )}

            {/* 下拉指示器 */}
            {hasDropdown && (
              <ChevronRight
                className={cn(
                  'w-4 h-4 transition-transform duration-200',
                  showDropdown === item.id && 'rotate-90'
                )}
              />
            )}
          </button>

          {/* 下拉菜单 */}
          <AnimatePresence>
            {hasDropdown && showDropdown === item.id && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
              >
                <div className="p-2">
                  {item.children?.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => {
                        handleItemClick(child)
                        setShowDropdown(null)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {child.icon && (
                        <span className="w-4 h-4 flex-shrink-0">
                          {child.icon}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">
                          {child.label}
                        </div>
                        {child.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {child.description}
                          </div>
                        )}
                      </div>
                      {child.badge && (
                        <span className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                          {child.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 悬停提示 */}
          {item.description && (
            <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {item.description}
            </div>
          )}
        </div>

        {/* 分隔符 */}
        {!isLast && (
          <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
        )}
      </motion.div>
    )
  }

  // 计算可见的面包屑项目
  const visibleItems = useMemo(() => {
    if (items.length <= maxVisible) {
      return items
    }

    const firstItems = items.slice(0, 2)
    const lastItems = items.slice(-2)
    const collapsedItems = items.slice(2, -2)

    return [
      ...firstItems,
      {
        id: 'collapsed',
        label: '...',
        icon: <MoreHorizontal className="w-4 h-4" />,
        isActive: false,
        isDropdown: true,
        children: collapsedItems
      },
      ...lastItems
    ]
  }, [items, maxVisible])

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* 主面包屑导航 */}
      <nav className="flex items-center gap-2 flex-1 overflow-hidden">
        {/* 首页按钮 */}
        <button
          onClick={() => {
            // 返回首页逻辑
            window.location.href = '/workbench'
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <Home className="w-4 h-4" />
          <span className="hidden md:inline">首页</span>
        </button>

        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />

        {/* 面包屑项目 */}
        <div className="flex items-center gap-2 overflow-hidden">
          {visibleItems.map((item, index) => (
            <div key={item.id}>
              {renderBreadcrumbItem(item, index, index === visibleItems.length - 1)}
            </div>
          ))}
        </div>
      </nav>

      {/* 操作按钮组 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* 收藏面板按钮 */}
        {showFavorites && (
          <button
            onClick={() => setShowFavoritesPanel(!showFavoritesPanel)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              showFavoritesPanel && 'bg-gray-100 dark:bg-gray-800'
            )}
            title="收藏夹"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        )}

        {/* 历史面板按钮 */}
        {showHistory && (
          <button
            onClick={() => setShowHistoryPanel(!showHistoryPanel)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
              showHistoryPanel && 'bg-gray-100 dark:bg-gray-800'
            )}
            title="浏览历史"
          >
            <History className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 收藏面板 */}
      <AnimatePresence>
        {showFavoritesPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  收藏夹
                </h3>
                <button
                  onClick={() => setShowFavoritesPanel(false)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {/* 组件收藏 */}
                {userPreferences.favoriteComponents.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      组件
                    </div>
                    {userPreferences.favoriteComponents.map((componentId) => (
                      <button
                        key={componentId}
                        className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        {componentId.replace('component-', '')}
                      </button>
                    ))}
                  </div>
                )}

                {/* 解决方案收藏 */}
                {userPreferences.favoriteSolutions.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      解决方案
                    </div>
                    {userPreferences.favoriteSolutions.map((solutionId) => (
                      <button
                        key={solutionId}
                        className="w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        {solutionId}
                      </button>
                    ))}
                  </div>
                )}

                {userPreferences.favoriteComponents.length === 0 &&
                 userPreferences.favoriteSolutions.length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                    暂无收藏内容
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 历史面板 */}
      <AnimatePresence>
        {showHistoryPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  浏览历史
                </h3>
                <button
                  onClick={() => setShowHistoryPanel(false)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {userPreferences.recentlyViewed.length > 0 ? (
                  userPreferences.recentlyViewed.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        // 处理历史项目点击
                        setShowHistoryPanel(false)
                      }}
                      className="w-full text-left px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{item.label}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                    暂无浏览历史
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}