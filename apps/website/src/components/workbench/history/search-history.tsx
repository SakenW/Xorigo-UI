/**
 * 搜索历史记录组件
 * 提供历史记录显示、管理和统计功能
 */

'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { cn } from '../../../../../lib/utils'
import type {
  SearchHistoryItem,
  SearchHistoryStats,
  SearchHistoryManager
} from '../../../../lib/workbench/search-history/types'
import { createSearchHistoryManager } from '../../../../lib/workbench/search-history'

/**
 * 搜索历史记录组件属性
 */
interface SearchHistoryProps {
  /** 历史记录管理器实例 */
  historyManager?: SearchHistoryManager
  /** 选择历史记录回调 */
  onSelect?: (query: string) => void
  /** 删除历史记录回调 */
  onDelete?: (query: string) => void
  /** 是否显示统计信息 */
  showStats?: boolean
  /** 是否显示收藏夹 */
  showFavorites?: boolean
  /** 最大显示数量 */
  maxItems?: number
  /** 显示模式 */
  mode?: 'list' | 'grid' | 'compact'
  /** 主题 */
  theme?: string
  /** 类名 */
  className?: string
  /** 测试ID */
  'data-testid'?: string
}

/**
 * 历史记录项组件
 */
const HistoryItem: React.FC<{
  item: SearchHistoryItem
  onSelect: (query: string) => void
  onDelete: (query: string) => void
  onToggleFavorite: (query: string) => void
  mode: string
}> = ({ item, onSelect, onDelete, onToggleFavorite, mode }) => {
  const formatLastSearch = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return '刚刚'
    if (diffHours < 24) return `${diffHours}小时前`
    if (diffDays < 7) return `${diffDays}天前`
    return date.toLocaleDateString()
  }

  const getRelativePopularity = (count: number) => {
    if (count >= 10) return { level: 'high', color: 'bg-red-500', label: '热门' }
    if (count >= 5) return { level: 'medium', color: 'bg-yellow-500', label: '常用' }
    return { level: 'low', color: 'bg-blue-500', label: '普通' }
  }

  const popularity = getRelativePopularity(item.count)

  if (mode === 'compact') {
    return (
      <div
        className="flex items-center justify-between p-2 hover:bg-muted/30 rounded cursor-pointer transition-colors"
        onClick={() => onSelect(item.query)}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(item.query)
            }}
            className="text-muted-foreground hover:text-yellow-500 transition-colors"
          >
            {item.isFavorite ? '⭐' : '☆'}
          </button>
          <span className="truncate text-sm">{item.query}</span>
          <Badge variant="secondary" className="text-xs">
            {item.count}
          </Badge>
        </div>
        <div className="flex items-center space-x-1">
          <div className={cn('w-2 h-2 rounded-full', popularity.color)} />
          <span className="text-xs text-muted-foreground">
            {formatLastSearch(item.lastSearch)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 opacity-0 hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(item.query)
            }}
          >
            ✕
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-all cursor-pointer group",
        mode === 'grid' && "h-full"
      )}
      onClick={() => onSelect(item.query)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(item.query)
              }}
              className="text-lg hover:scale-110 transition-transform"
            >
              {item.isFavorite ? '⭐' : '☆'}
            </button>
            <h4 className="font-medium truncate">{item.query}</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(item.query)
            }}
          >
            ✕
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>搜索 {item.count} 次</span>
          <span>{formatLastSearch(item.lastSearch)}</span>
        </div>

        {item.resultCount !== undefined && (
          <div className="text-xs text-muted-foreground mb-2">
            约 {item.resultCount} 个结果
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex items-center space-x-1">
            <div className={cn('w-2 h-2 rounded-full', popularity.color)} />
            <span className="text-xs">{popularity.label}</span>
          </div>
          {item.averageDuration && (
            <span className="text-xs text-muted-foreground">
              {Math.round(item.averageDuration)}ms
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * 统计信息组件
 */
const StatsPanel: React.FC<{ stats: SearchHistoryStats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="text-center p-4 bg-muted/30 rounded-lg">
        <div className="text-2xl font-bold text-primary">{stats.totalSearches}</div>
        <div className="text-sm text-muted-foreground">总搜索次数</div>
      </div>
      <div className="text-center p-4 bg-muted/30 rounded-lg">
        <div className="text-2xl font-bold text-primary">{stats.uniqueQueries}</div>
        <div className="text-sm text-muted-foreground">独特查询</div>
      </div>
      <div className="text-center p-4 bg-muted/30 rounded-lg">
        <div className="text-2xl font-bold text-primary">
          {Math.round(stats.averageSearchDuration)}ms
        </div>
        <div className="text-sm text-muted-foreground">平均时长</div>
      </div>
      <div className="text-center p-4 bg-muted/30 rounded-lg">
        <div className="text-2xl font-bold text-primary">
          {stats.popularSearches[0]?.count || 0}
        </div>
        <div className="text-sm text-muted-foreground">最热搜索</div>
      </div>
    </div>
  )
}

/**
 * 搜索历史记录主组件
 */
export const SearchHistory: React.FC<SearchHistoryProps> = ({
  historyManager,
  onSelect,
  onDelete,
  showStats = false,
  showFavorites = false,
  maxItems = 20,
  mode = 'list',
  theme = 'default',
  className,
  'data-testid': testId
}) => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])
  const [favorites, setFavorites] = useState<SearchHistoryItem[]>([])
  const [stats, setStats] = useState<SearchHistoryStats | null>(null)
  const [viewMode, setViewMode] = useState<'all' | 'favorites'>(
    showFavorites ? 'all' : 'all'
  )
  const [searchQuery, setSearchQuery] = useState('')

  // 初始化历史记录管理器
  const manager = useMemo(() => {
    if (historyManager) return historyManager
    return createSearchHistoryManager({
      maxHistoryItems: 100,
      expirationDays: 30,
      enablePersistence: true
    })
  }, [historyManager])

  // 加载数据
  useEffect(() => {
    const loadData = () => {
      const allHistory = manager.getHistory(maxItems)
      setHistory(allHistory)
      setFavorites(manager.getFavorites())
      if (showStats) {
        setStats(manager.getStats())
      }
    }

    loadData()
  }, [manager, maxItems, showStats])

  // 处理选择历史记录
  const handleSelect = useCallback((query: string) => {
    onSelect?.(query)
  }, [onSelect])

  // 处理删除历史记录
  const handleDelete = useCallback((query: string) => {
    if (manager.removeHistory(query)) {
      const allHistory = manager.getHistory(maxItems)
      setHistory(allHistory)
      setFavorites(manager.getFavorites())
      onDelete?.(query)
    }
  }, [manager, maxItems, onDelete])

  // 处理收藏切换
  const handleToggleFavorite = useCallback((query: string) => {
    manager.toggleFavorite(query)
    const allHistory = manager.getHistory(maxItems)
    setHistory(allHistory)
    setFavorites(manager.getFavorites())
  }, [manager, maxItems])

  // 获取显示的数据
  const displayData = useMemo(() => {
    let data = viewMode === 'favorites' ? favorites : history

    if (searchQuery) {
      data = data.filter(item =>
        item.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    return data
  }, [history, favorites, viewMode, searchQuery])

  // 导出历史记录
  const handleExport = useCallback(() => {
    const data = manager.exportHistory()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `search-history-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [manager])

  // 清空历史记录
  const handleClearAll = useCallback(() => {
    if (confirm('确定要清空所有搜索历史记录吗？此操作无法撤销。')) {
      manager.clearHistory()
      setHistory([])
      setFavorites([])
      setStats(null)
    }
  }, [manager])

  if (displayData.length === 0 && !showStats) {
    return (
      <Card className={className} data-testid={testId}>
        <CardContent className="py-16">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-4">🕐</div>
            <h3 className="text-lg font-medium mb-2">暂无搜索历史</h3>
            <p className="text-sm">开始搜索组件后，历史记录将显示在这里</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6', className)} data-testid={testId}>
      {/* 头部 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <span>🕐</span>
                <span>搜索历史</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                查看和管理您的搜索历史记录
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {showFavorites && (
                <Button
                  variant={viewMode === 'favorites' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'favorites' ? 'all' : 'favorites')}
                >
                  {viewMode === 'favorites' ? '全部' : '收藏'}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleExport}>
                导出
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClearAll}>
                清空
              </Button>
            </div>
          </div>

          {/* 搜索框 */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="搜索历史记录..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardHeader>
      </Card>

      {/* 统计信息 */}
      {showStats && stats && <StatsPanel stats={stats} />}

      {/* 历史记录列表 */}
      {displayData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {viewMode === 'favorites' ? '收藏的搜索' : '搜索历史'}
                <Badge variant="secondary" className="ml-2">
                  {displayData.length}
                </Badge>
              </h4>
              <div className="text-sm text-muted-foreground">
                显示最近 {maxItems} 条记录
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {mode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayData.map((item, index) => (
                  <HistoryItem
                    key={`${item.query}-${index}`}
                    item={item}
                    onSelect={handleSelect}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                    mode={mode}
                  />
                ))}
              </div>
            ) : mode === 'compact' ? (
              <div className="space-y-1">
                {displayData.map((item, index) => (
                  <HistoryItem
                    key={`${item.query}-${index}`}
                    item={item}
                    onSelect={handleSelect}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                    mode={mode}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {displayData.map((item, index) => (
                  <HistoryItem
                    key={`${item.query}-${index}`}
                    item={item}
                    onSelect={handleSelect}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                    mode={mode}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// 设置显示名称用于调试
SearchHistory.displayName = 'SearchHistory'

export default SearchHistory