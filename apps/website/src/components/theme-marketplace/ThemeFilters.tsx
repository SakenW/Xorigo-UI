'use client'

/**
 * 🔍 主题过滤器组件
 */

import React from 'react'
import { X, Check } from 'lucide-react'

interface FilterState {
  categories: string[]
  tags: string[]
  searchQuery: string
  minRating: number
  sortBy: 'popularity' | 'rating' | 'downloads' | 'newest' | 'trending' | 'name'
  sortOrder: 'asc' | 'desc'
}

interface ThemeFiltersProps {
  filters: FilterState
  onChange: (filters: Partial<FilterState>) => void
  categories: string[]
}

const ThemeFilters: React.FC<ThemeFiltersProps> = ({
  filters,
  onChange,
  categories
}) => {
  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    onChange({ categories: newCategories })
  }

  const handleMinRatingChange = (rating: number) => {
    onChange({ minRating: rating })
  }

  const clearFilters = () => {
    onChange({
      categories: [],
      tags: [],
      minRating: 0
    })
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          过滤条件
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          清除
        </button>
      </div>

      {/* 分类过滤 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          主题分类
        </h4>
        <div className="space-y-1">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.categories.includes(category)
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>{category}</span>
              {filters.categories.includes(category) && (
                <Check className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 评分过滤 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          最低评分
        </h4>
        <div className="space-y-1">
          {[0, 4.0, 4.5, 4.7, 4.8].map(rating => (
            <button
              key={rating}
              onClick={() => handleMinRatingChange(rating)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.minRating === rating
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>{rating === 0 ? '全部' : `${rating}分及以上`}</span>
              {filters.minRating === rating && (
                <Check className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 活跃过滤器 */}
      {(filters.categories.length > 0 || filters.minRating > 0) && (
        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            活跃过滤
          </h4>
          <div className="flex flex-wrap gap-2">
            {filters.categories.map(category => (
              <span
                key={category}
                className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded"
              >
                {category}
                <button
                  onClick={() => handleCategoryToggle(category)}
                  className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.minRating > 0 && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded">
                {filters.minRating}分+
                <button
                  onClick={() => handleMinRatingChange(0)}
                  className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ThemeFilters
