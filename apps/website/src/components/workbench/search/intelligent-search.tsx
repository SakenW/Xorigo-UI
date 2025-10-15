/**
 * 智能搜索组件
 * 提供自然语言搜索、实时建议、语义匹配等功能
 */

'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Input } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { cn } from '../../../lib/utils'
import type { ComponentInfo } from '../../../data/component-classification'
import type {
  IntelligentSearchEngine,
  SearchQuery,
  SearchResult,
  SearchSuggestion
} from '../../../lib/workbench/intelligent-search/types'
import { createIntelligentSearchEngine } from '../../../lib/workbench/intelligent-search'
import AdvancedFilters from '../filters/advanced-filters'
import type { SearchFiltersState } from '../../../lib/workbench/advanced-filters/types'

/**
 * 智能搜索组件属性
 */
interface IntelligentSearchProps {
  /** 搜索引擎实例 */
  searchEngine?: IntelligentSearchEngine
  /** 占位符文本 */
  placeholder?: string
  /** 是否显示建议 */
  showSuggestions?: boolean
  /** 是否显示搜索历史 */
  showHistory?: boolean
  /** 搜索回调 */
  onSearch?: (query: string, results: SearchResult) => void
  /** 搜索过滤回调 */
  onFilter?: (filters: any) => void
  /** 高级过滤回调 */
  onAdvancedFilter?: (filters: SearchFiltersState) => void
  /** 组件数据 */
  components?: ComponentInfo[]
  /** 是否启用高级过滤器 */
  enableAdvancedFilters?: boolean
  /** 类名 */
  className?: string
  /** 测试ID */
  'data-testid'?: string
}

/**
 * 搜索建议项组件
 */
const SuggestionItem: React.FC<{
  suggestion: SearchSuggestion
  onSelect: (suggestion: string) => void
  isActive: boolean
  onMouseEnter: () => void
}> = ({ suggestion, onSelect, isActive, onMouseEnter }) => {
  const getIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'completion': return '💡'
      case 'correction': return '✏️'
      case 'related': return '🔗'
      case 'trending': return '🔥'
      default: return '💡'
    }
  }

  return (
    <div
      className={cn(
        'flex items-center space-x-3 px-4 py-2 cursor-pointer hover:bg-muted/50 transition-colors',
        isActive && 'bg-muted/50'
      )}
      onClick={() => onSelect(suggestion.text)}
      onMouseEnter={onMouseEnter}
    >
      <span className="text-lg">{getIcon(suggestion.type)}</span>
      <span className="flex-1">{suggestion.text}</span>
      <Badge variant="outline" className="text-xs">
        {suggestion.source}
      </Badge>
    </div>
  )
}

/**
 * 搜索历史项组件
 */
const HistoryItem: React.FC<{
  query: string
  count: number
  onSelect: (query: string) => void
  onRemove: (query: string) => void
  isActive: boolean
  onMouseEnter: () => void
}> = ({ query, count, onSelect, onRemove, isActive, onMouseEnter }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-muted/50 transition-colors group',
        isActive && 'bg-muted/50'
      )}
      onClick={() => onSelect(query)}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-center space-x-3">
        <span className="text-muted-foreground">🕐</span>
        <span>{query}</span>
        <Badge variant="secondary" className="text-xs">
          {count}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation()
          onRemove(query)
        }}
      >
        ✕
      </Button>
    </div>
  )
}


/**
 * 智能搜索主组件
 */
export const IntelligentSearch: React.FC<IntelligentSearchProps> = ({
  searchEngine,
  placeholder = '搜索组件名称或描述...',
  showSuggestions = true,
  showHistory = true,
  onSearch,
  onFilter,
  onAdvancedFilter,
  components = [],
  enableAdvancedFilters = true,
  className,
  'data-testid': testId
}) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [history, setHistory] = useState<Array<{ query: string; count: number; timestamp: number }>>([])
  const [showSuggestionsList, setShowSuggestionsList] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState<SearchFiltersState | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // 初始化搜索引擎
  const engine = useMemo(() => {
    if (searchEngine) return searchEngine

    const newEngine = createIntelligentSearchEngine()
    if (components.length > 0) {
      newEngine.buildIndex(components)
    }
    return newEngine
  }, [searchEngine, components])

  // 更新组件索引
  useEffect(() => {
    if (components.length > 0) {
      engine.buildIndex(components)
    }
  }, [components, engine])

  // 加载搜索历史
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const popularSearches = await engine.getPopularSearches(10)
        setHistory(popularSearches.map(query => ({
          query,
          count: Math.floor(Math.random() * 10) + 1,
          timestamp: Date.now()
        })))
      } catch (error) {
        console.error('Failed to load search history:', error)
      }
    }

    if (showHistory) {
      loadHistory()
    }
  }, [engine, showHistory])

  // 获取搜索建议
  const getSuggestions = useCallback(async (searchQuery: string) => {
    if (!showSuggestions || searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const newSuggestions = await engine.suggest(searchQuery)
      setSuggestions(newSuggestions)
      setShowSuggestionsList(true)
    } catch (error) {
      console.error('Failed to get suggestions:', error)
      setSuggestions([])
    }
  }, [engine, showSuggestions])

  // 执行搜索
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setShowSuggestionsList(false)

    try {
      const searchQueryData: SearchQuery = {
        text: searchQuery,
        filters: filters.length > 0 ? filters : undefined,
        pagination: {
          page: 1,
          limit: 20
        }
      }

      const results = await engine.search(searchQueryData)

      // 更新历史
      setHistory(prev => {
        const existing = prev.find(h => h.query === searchQuery)
        if (existing) {
          return prev.map(h =>
            h.query === searchQuery
              ? { ...h, count: h.count + 1, timestamp: Date.now() }
              : h
          ).sort((a, b) => b.count - a.count).slice(0, 20)
        } else {
          return [{ query: searchQuery, count: 1, timestamp: Date.now() }, ...prev]
            .sort((a, b) => b.count - a.count)
            .slice(0, 20)
        }
      })

      onSearch?.(searchQuery, results)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [engine, filters, onSearch])

  // 处理输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setActiveSuggestionIndex(-1)

    // 防抖获取建议
    const timeoutId = setTimeout(() => {
      getSuggestions(value)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [getSuggestions])

  // 处理键盘事件
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
        setQuery(suggestions[activeSuggestionIndex].text)
        performSearch(suggestions[activeSuggestionIndex].text)
      } else {
        performSearch(query)
      }
      setShowSuggestionsList(false)
      setActiveSuggestionIndex(-1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestionIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Escape') {
      setShowSuggestionsList(false)
      setActiveSuggestionIndex(-1)
      inputRef.current?.blur()
    }
  }, [query, suggestions, activeSuggestionIndex, performSearch])

  // 处理建议选择
  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setQuery(suggestion)
    performSearch(suggestion)
    setShowSuggestionsList(false)
    setActiveSuggestionIndex(-1)
    inputRef.current?.focus()
  }, [performSearch])

  // 处理历史选择
  const handleHistorySelect = useCallback((historyQuery: string) => {
    setQuery(historyQuery)
    performSearch(historyQuery)
    setShowSuggestionsList(false)
    setActiveSuggestionIndex(-1)
    inputRef.current?.focus()
  }, [performSearch])

  // 处理历史删除
  const handleHistoryRemove = useCallback((historyQuery: string) => {
    setHistory(prev => prev.filter(h => h.query !== historyQuery))
  }, [])

  // 处理过滤器变化
  const handleFilterChange = useCallback((newFilters: any[]) => {
    setFilters(newFilters)
    onFilter?.(newFilters)

    // 如果有当前查询，重新搜索
    if (query.trim()) {
      performSearch(query)
    }
  }, [query, performSearch, onFilter])

  // 点击外部关闭建议列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestionsList(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn('relative', className)} data-testid={testId}>
      {/* 搜索输入框 */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length >= 2) {
              setShowSuggestionsList(true)
            }
          }}
          className={cn(
            'pr-20',
            isLoading && 'animate-pulse'
          )}
        />

        {/* 搜索状态指示器 */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          )}

          {/* 过滤器按钮 */}
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => setShowFilters(!showFilters)}
            title="高级过滤"
          >
            🔍
          </Button>

          {/* 清除按钮 */}
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => {
                setQuery('')
                setShowSuggestionsList(false)
                setActiveSuggestionIndex(-1)
                inputRef.current?.focus()
              }}
              title="清除"
            >
              ✕
            </Button>
          )}
        </div>
      </div>

      {/* 高级过滤器 */}
      {showFilters && enableAdvancedFilters && (
        <div className="mt-2">
          <AdvancedFilters
            components={components}
            filters={advancedFilters || undefined}
            onFiltersChange={(newFilters) => {
              setAdvancedFilters(newFilters)
              onAdvancedFilter?.(newFilters)

              // 如果有当前查询，重新搜索
              if (query.trim()) {
                performSearch(query)
              }
            }}
            onSearch={(filterQuery) => {
              // 执行过滤器搜索
              onSearch?.('', {
                components: filterQuery.components,
                searchTime: filterQuery.searchTime,
                stats: {
                  textMatches: filterQuery.components.length,
                  semanticMatches: 0,
                  totalMatches: filterQuery.total
                },
                suggestions: [],
                facets: filterQuery.facets
              })
            }}
            config={{
              enableCategoryFilter: true,
              enableVariantFilter: true,
              enablePropsFilter: true,
              enableComplexityFilter: true,
              enablePopularityFilter: true,
              enableAdvancedLogic: true
            }}
            showAdvanced={true}
          />
        </div>
      )}

      {/* 建议和历史列表 */}
      {showSuggestionsList && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {/* 搜索建议 */}
          {suggestions.length > 0 && (
            <div className="border-b">
              <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
                搜索建议
              </div>
              {suggestions.map((suggestion, index) => (
                <SuggestionItem
                  key={`${suggestion.text}-${index}`}
                  suggestion={suggestion}
                  onSelect={handleSuggestionSelect}
                  isActive={index === activeSuggestionIndex}
                  onMouseEnter={() => setActiveSuggestionIndex(index)}
                />
              ))}
            </div>
          )}

          {/* 搜索历史 */}
          {showHistory && history.length > 0 && (
            <div>
              <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
                最近搜索
              </div>
              {history.slice(0, 5).map((item, index) => (
                <HistoryItem
                  key={`${item.query}-${index}`}
                  query={item.query}
                  count={item.count}
                  onSelect={handleHistorySelect}
                  onRemove={handleHistoryRemove}
                  isActive={index === activeSuggestionIndex - suggestions.length}
                  onMouseEnter={() => setActiveSuggestionIndex(suggestions.length + index)}
                />
              ))}
            </div>
          )}

          {/* 无结果提示 */}
          {suggestions.length === 0 && history.length === 0 && (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-sm">输入关键词开始搜索</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// 设置显示名称
IntelligentSearch.displayName = 'IntelligentSearch'

export default IntelligentSearch