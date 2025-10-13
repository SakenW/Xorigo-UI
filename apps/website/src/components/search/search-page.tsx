/**
 * 🔍 完整搜索页面组件
 *
 * 集成所有搜索功能：
 * - 实时搜索
 * - 高级筛选
 * - 虚拟化列表
 * - URL 状态同步
 */

'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useDebounce } from '../../lib/hooks/use-debounce'
import { getClientSearchEngine, initializeSearch } from '../../lib/search/client'
import type { SearchResult } from '../../app/api/search/types'
import { VirtualizedSearchResults, SearchPerformanceStats } from './virtualized-search-results'
import { AdvancedFilters, FilterOptions } from './advanced-filters'

// ============================================================================
// 搜索页面组件
// ============================================================================

export function SearchPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 搜索状态
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // 性能统计
  const [searchTime, setSearchTime] = useState(0)
  const [renderTime, setRenderTime] = useState(0)

  // 筛选状态
  const [filters, setFilters] = useState<FilterOptions>({
    type: (searchParams.get('type') as FilterOptions['type']) || 'all',
    categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
  })

  // 防抖查询
  const debouncedQuery = useDebounce(query, 300)

  // 初始化搜索引擎
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        await initializeSearch()
        setInitialized(true)
      } catch (error) {
        console.error('搜索引擎初始化失败:', error)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  // 执行搜索
  useEffect(() => {
    if (!initialized || !debouncedQuery) {
      setResults([])
      return
    }

    const performSearch = async () => {
      const startTime = performance.now()

      try {
        setLoading(true)
        const engine = getClientSearchEngine()

        // 执行搜索
        const searchResults = engine.advancedSearch(debouncedQuery, filters, 100)

        const searchDuration = performance.now() - startTime
        setSearchTime(Math.round(searchDuration))

        // 渲染计时
        const renderStart = performance.now()
        setResults(searchResults)
        const renderDuration = performance.now() - renderStart
        setRenderTime(Math.round(renderDuration))
      } catch (error) {
        console.error('搜索失败:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery, filters, initialized])

  // 同步 URL 状态
  useEffect(() => {
    const params = new URLSearchParams()

    if (query) params.set('q', query)
    if (filters.type !== 'all') params.set('type', filters.type)
    if (filters.categories.length > 0) {
      params.set('categories', filters.categories.join(','))
    }
    if (filters.tags.length > 0) {
      params.set('tags', filters.tags.join(','))
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [query, filters, pathname, router])

  // 获取可用的类别和标签
  const { availableCategories, availableTags } = useMemo(() => {
    if (!initialized) return { availableCategories: [], availableTags: [] }

    const engine = getClientSearchEngine()
    const stats = engine.getStats()

    // 从搜索结果中提取
    const categories = new Set<string>()
    const tags = new Set<string>()

    results.forEach((result) => {
      if (result.metadata?.category) {
        categories.add(result.metadata.category)
      }
      if (result.metadata?.tags) {
        result.metadata.tags.forEach((tag: string) => tags.add(tag))
      }
    })

    return {
      availableCategories: Array.from(categories),
      availableTags: Array.from(tags),
    }
  }, [results, initialized])

  // 处理筛选变更
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  // 重置筛选
  const handleResetFilters = () => {
    setFilters({
      type: 'all',
      categories: [],
      tags: [],
    })
  }

  // 处理结果点击
  const handleResultClick = (result: SearchResult) => {
    // 可以在这里添加点击追踪等逻辑
    console.log('Result clicked:', result)
  }

  // ============================================================================
  // 渲染
  // ============================================================================

  return (
    <div className="container mx-auto max-w-6xl py-8">
      {/* 搜索头部 */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">搜索</h1>
        <p className="text-muted-foreground">
          搜索组件、配方和文档
        </p>
      </div>

      {/* 搜索输入 */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入关键词搜索..."
            className="w-full rounded-lg border border-border bg-background px-4 py-3 pl-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>
      </div>

      {/* 高级筛选 */}
      {initialized && debouncedQuery && (
        <div className="mb-6">
          <AdvancedFilters
            filters={filters}
            availableCategories={availableCategories}
            availableTags={availableTags}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>
      )}

      {/* 搜索结果 */}
      {initialized && debouncedQuery && (
        <div className="space-y-4">
          <VirtualizedSearchResults
            results={results}
            loading={loading}
            onResultClick={handleResultClick}
            emptyMessage="没有找到匹配的结果，请尝试其他关键词"
          />

          {/* 性能统计 */}
          {results.length > 0 && (
            <SearchPerformanceStats
              totalResults={results.length}
              renderTime={renderTime}
              searchTime={searchTime}
            />
          )}
        </div>
      )}

      {/* 空状态 */}
      {!debouncedQuery && initialized && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg
            className="mb-4 h-16 w-16 text-muted-foreground/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mb-2 text-lg font-medium">开始搜索</h3>
          <p className="text-sm text-muted-foreground">
            输入关键词搜索组件、配方和文档
          </p>
        </div>
      )}
    </div>
  )
}
