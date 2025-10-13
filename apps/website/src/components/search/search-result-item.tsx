/**
 * 🔍 搜索结果项组件
 *
 * 显示单个搜索结果，支持高亮匹配文本
 */

'use client'

import Link from 'next/link'
import type { SearchResult } from '../../app/api/search/types'
import { highlightMatches } from '../../lib/search/highlight'

// ============================================================================
// 组件属性
// ============================================================================

export interface SearchResultItemProps {
  result: SearchResult
  onClick?: (result: SearchResult) => void
}

// ============================================================================
// 搜索结果项组件
// ============================================================================

export function SearchResultItem({ result, onClick }: SearchResultItemProps) {
  const handleClick = () => {
    onClick?.(result)
  }

  return (
    <Link
      href={result.url}
      className="block rounded-md border border-border bg-card p-4 transition-colors hover:bg-accent hover:border-accent-foreground/20"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* 类型图标 */}
        <div className="mt-1 flex-shrink-0">
          {result.type === 'component' ? (
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          )}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 min-w-0">
          {/* 标题 */}
          <h3 className="font-medium text-foreground truncate">
            {highlightMatches(result.title, result.matches, 'name')}
          </h3>

          {/* 描述 */}
          {result.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {highlightMatches(
                result.description,
                result.matches,
                'description'
              )}
            </p>
          )}

          {/* 元数据 */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* 类别 */}
            {result.metadata?.category && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {result.metadata.category}
              </span>
            )}

            {/* 标签 */}
            {result.metadata?.tags?.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}

            {/* 分数（开发模式显示） */}
            {process.env.NODE_ENV === 'development' && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-mono text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                {result.score.toFixed(3)}
              </span>
            )}
          </div>
        </div>

        {/* 箭头图标 */}
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  )
}

// ============================================================================
// 紧凑版搜索结果项
// ============================================================================

export function CompactSearchResultItem({
  result,
  onClick,
}: SearchResultItemProps) {
  const handleClick = () => {
    onClick?.(result)
  }

  return (
    <Link
      href={result.url}
      className="block rounded-md px-3 py-2 transition-colors hover:bg-accent"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <span className="flex-1 truncate text-sm font-medium text-foreground">
          {result.title}
        </span>
        {result.metadata?.category && (
          <span className="text-xs text-muted-foreground">
            {result.metadata.category}
          </span>
        )}
      </div>
    </Link>
  )
}
