/**
 * 🎛️ 高级筛选组件
 *
 * 多维度筛选功能：
 * - 内容类型 (组件/配方)
 * - 类别筛选
 * - 标签筛选
 * - 自定义筛选条件
 */

'use client'

import { useState } from 'react'

// ============================================================================
// 类型定义
// ============================================================================

export interface FilterOptions {
  type: 'component' | 'recipe' | 'all'
  categories: string[]
  tags: string[]
}

export interface AdvancedFiltersProps {
  filters: FilterOptions
  availableCategories: string[]
  availableTags: string[]
  onFilterChange: (filters: FilterOptions) => void
  onReset: () => void
}

// ============================================================================
// 高级筛选组件
// ============================================================================

export function AdvancedFilters({
  filters,
  availableCategories,
  availableTags,
  onFilterChange,
  onReset,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // 处理类型变更
  const handleTypeChange = (type: FilterOptions['type']) => {
    onFilterChange({ ...filters, type })
  }

  // 处理类别变更
  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]

    onFilterChange({ ...filters, categories: newCategories })
  }

  // 处理标签变更
  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag]

    onFilterChange({ ...filters, tags: newTags })
  }

  // 计算激活的筛选数量
  const activeFilterCount =
    (filters.type !== 'all' ? 1 : 0) +
    filters.categories.length +
    filters.tags.length

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* 筛选头部 */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">高级筛选</h3>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              重置
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            <svg
              className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 筛选内容 */}
      {isExpanded && (
        <div className="space-y-4 p-4">
          {/* 内容类型 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              内容类型
            </label>
            <div className="flex gap-2">
              {(['all', 'component', 'recipe'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    filters.type === type
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:bg-accent'
                  }`}
                >
                  {type === 'all'
                    ? '全部'
                    : type === 'component'
                      ? '组件'
                      : '配方'}
                </button>
              ))}
            </div>
          </div>

          {/* 类别筛选 */}
          {availableCategories.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                类别
              </label>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`rounded-md border px-3 py-1 text-xs transition-colors ${
                      filters.categories.includes(category)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-foreground hover:bg-accent'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 标签筛选 */}
          {availableTags.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                标签
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 20).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`rounded-md border px-2.5 py-0.5 text-xs transition-colors ${
                      filters.tags.includes(tag)
                        ? 'border-accent bg-accent/10 text-accent-foreground'
                        : 'border-border bg-background text-foreground hover:bg-accent'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 快速筛选标签 */}
      {!isExpanded && activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {filters.type !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {filters.type === 'component' ? '组件' : '配方'}
              <button
                onClick={() => handleTypeChange('all')}
                className="hover:text-primary-foreground"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </span>
          )}
          {filters.categories.map((category) => (
            <span
              key={category}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
            >
              {category}
              <button
                onClick={() => handleCategoryToggle(category)}
                className="hover:text-primary-foreground"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </span>
          ))}
          {filters.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent-foreground"
            >
              {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="hover:text-foreground"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </span>
          ))}
          {filters.tags.length > 5 && (
            <span className="text-xs text-muted-foreground">
              +{filters.tags.length - 5} 更多
            </span>
          )}
        </div>
      )}
    </div>
  )
}
