/**
 * Template 筛选组件
 * 提供模板分类、难度、技术栈等筛选功能
 */

'use client'

import { useState } from 'react'
import { TemplateFilters, TemplateCategory } from '@/types/templates'
import { templateCategories, difficultyLevels, availableTechnologies } from '@/data/templates'
import { Button, Input } from '@xorigo-ui/core'

interface TemplateFiltersProps {
  filters: TemplateFilters
  onFiltersChange: (filters: TemplateFilters) => void
  totalCount: number
  filteredCount: number
}

export function TemplateFilters({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount
}: TemplateFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category as TemplateCategory | 'all'
    })
  }

  const handleDifficultyChange = (difficulty: string) => {
    onFiltersChange({
      ...filters,
      difficulty: difficulty as 'all' | 'beginner' | 'intermediate' | 'advanced'
    })
  }

  const handleTechnologyToggle = (tech: string) => {
    const currentTechs = filters.technologies || []
    const newTechs = currentTechs.includes(tech)
      ? currentTechs.filter(t => t !== tech)
      : [...currentTechs, tech]

    onFiltersChange({
      ...filters,
      technologies: newTechs.length > 0 ? newTechs : undefined
    })
  }

  const handleSearchChange = (search: string) => {
    onFiltersChange({
      ...filters,
      search: search.trim() || undefined
    })
  }

  const handleClearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = filters.category || filters.difficulty || filters.technologies?.length || filters.search

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
      {/* 搜索框 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          搜索模板
        </label>
        <Input
          type="text"
          placeholder="搜索模板名称、描述或标签..."
          value={filters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      {/* 分类筛选 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          模板分类
        </label>
        <div className="flex flex-wrap gap-2">
          {templateCategories.map((category) => (
            <Button
              key={category.value}
              variant={filters.category === category.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 高级筛选选项 */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {showAdvanced ? '收起' : '展开'}高级筛选
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-6">
            {/* 难度筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                难度级别
              </label>
              <div className="flex flex-wrap gap-2">
                {difficultyLevels.map((level) => (
                  <Button
                    key={level.value}
                    variant={filters.difficulty === level.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleDifficultyChange(level.value)}
                  >
                    <span className={`w-2 h-2 rounded-full bg-${level.color}-500 mr-2`} />
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 技术栈筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                技术栈
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTechnologies.map((tech) => {
                  const isSelected = filters.technologies?.includes(tech)
                  return (
                    <Button
                      key={tech}
                      variant={isSelected ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleTechnologyToggle(tech)}
                    >
                      {tech}
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 筛选结果统计和清除 */}
      <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {hasActiveFilters ? (
            <>
              显示 <span className="font-medium text-gray-900 dark:text-white">{filteredCount}</span> 个模板，
              共 <span className="font-medium text-gray-900 dark:text-white">{totalCount}</span> 个
            </>
          ) : (
            <>
              共 <span className="font-medium text-gray-900 dark:text-white">{totalCount}</span> 个模板
            </>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
          >
            清除筛选
          </Button>
        )}
      </div>
    </div>
  )
}