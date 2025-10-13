/**
 * 🚀 虚拟化搜索结果列表
 *
 * 使用 @tanstack/react-virtual 实现高性能列表渲染
 * 特性:
 * - 虚拟滚动 (仅渲染可见项)
 * - 支持大量数据 (10000+ 项)
 * - 性能优化 (60fps 滚动)
 */

'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import type { SearchResult } from '../../app/api/search/types'
import { SearchResultItem } from './search-result-item'

// ============================================================================
// 组件属性
// ============================================================================

export interface VirtualizedSearchResultsProps {
  results: SearchResult[]
  onResultClick?: (result: SearchResult) => void
  loading?: boolean
  emptyMessage?: string
  className?: string
}

// ============================================================================
// 虚拟化搜索结果组件
// ============================================================================

export function VirtualizedSearchResults({
  results,
  onResultClick,
  loading = false,
  emptyMessage = '没有找到匹配的结果',
  className = '',
}: VirtualizedSearchResultsProps) {
  // 滚动容器引用
  const parentRef = useRef<HTMLDivElement>(null)

  // 虚拟化配置
  const rowVirtualizer = useVirtualizer({
    count: results.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // 估算每项高度 (px)
    overscan: 5, // 预渲染额外项数
  })

  // ============================================================================
  // 渲染状态
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">搜索中...</p>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground/50"
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
          <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  // ============================================================================
  // 虚拟化列表渲染
  // ============================================================================

  return (
    <div
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{
        height: '600px', // 固定高度，启用虚拟滚动
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const result = results[virtualItem.index]

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <SearchResultItem result={result} onClick={onResultClick} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// 性能统计组件
// ============================================================================

export interface SearchPerformanceStatsProps {
  totalResults: number
  renderTime: number
  searchTime: number
}

export function SearchPerformanceStats({
  totalResults,
  renderTime,
  searchTime,
}: SearchPerformanceStatsProps) {
  return (
    <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-xs text-muted-foreground">
      <span>
        找到 <strong className="text-foreground">{totalResults}</strong> 个结果
      </span>
      <span>·</span>
      <span>
        搜索耗时 <strong className="text-foreground">{searchTime}ms</strong>
      </span>
      <span>·</span>
      <span>
        渲染耗时 <strong className="text-foreground">{renderTime}ms</strong>
      </span>
      {searchTime > 50 && (
        <>
          <span>·</span>
          <span className="text-yellow-600">⚠️ 搜索耗时超过性能目标</span>
        </>
      )}
    </div>
  )
}
