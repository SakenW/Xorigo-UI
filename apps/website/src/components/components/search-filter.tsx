/**
 * 搜索和筛选组件
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Input } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Card, CardContent } from '@xorigo-ui/core'
import { Tabs, TabsList, TabsTrigger } from '@xorigo-ui/core'
import { Separator } from '@xorigo-ui/core'
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Tag,
  Package,
  BookOpen,
  Sparkles
} from 'lucide-react'

import {
  ComponentMeta,
  ComponentCategory,
  ComponentTag,
  componentCategories,
  getComponentsByCategory,
  getComponentsByTag,
  searchComponents
} from './component-registry'

interface SearchFilterProps {
  onFilterChange: (filters: SearchFilters) => void
  totalCount: number
  filteredCount: number
}

export interface SearchFilters {
  query: string
  categories: ComponentCategory[]
  tags: ComponentTag[]
  sortBy: 'name' | 'category' | 'relevance'
  sortOrder: 'asc' | 'desc'
}

const tagConfig = {
  basic: { label: '基础', icon: Package, color: 'bg-blue-100 text-blue-800' },
  advanced: { label: '高级', icon: Sparkles, color: 'bg-purple-100 text-purple-800' },
  experimental: { label: '实验性', icon: BookOpen, color: 'bg-orange-100 text-orange-800' },
  responsive: { label: '响应式', icon: SlidersHorizontal, color: 'bg-green-100 text-green-800' },
  animated: { label: '动画', icon: Sparkles, color: 'bg-pink-100 text-pink-800' },
  accessible: { label: '无障碍', icon: Tag, color: 'bg-indigo-100 text-indigo-800' }
}

/**
 * 搜索输入框
 */
function SearchInput({
  value,
  onChange,
  placeholder = "搜索组件..."
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4"
        clearable
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange('')}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

/**
 * 分类筛选器
 */
function CategoryFilter({
  selectedCategories,
  onCategoryChange
}: {
  selectedCategories: ComponentCategory[]
  onCategoryChange: (categories: ComponentCategory[]) => void
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <Package className="h-4 w-4" />
        组件分类
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(componentCategories).map(([category, info]) => {
          const isSelected = selectedCategories.includes(category as ComponentCategory)
          return (
            <Button
              key={category}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (isSelected) {
                  onCategoryChange(selectedCategories.filter(c => c !== category))
                } else {
                  onCategoryChange([...selectedCategories, category as ComponentCategory])
                }
              }}
              className="justify-start h-8"
            >
              <span className="mr-1">{info.icon}</span>
              <span className="truncate">{info.name}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * 标签筛选器
 */
function TagFilter({
  selectedTags,
  onTagChange
}: {
  selectedTags: ComponentTag[]
  onTagChange: (tags: ComponentTag[]) => void
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <Tag className="h-4 w-4" />
        组件标签
      </h3>
      <div className="flex flex-wrap gap-1">
        {Object.entries(tagConfig).map(([tag, config]) => {
          const isSelected = selectedTags.includes(tag as ComponentTag)
          const Icon = config.icon
          return (
            <Badge
              key={tag}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer px-2 py-1 text-xs ${
                isSelected ? '' : config.color
              }`}
              onClick={() => {
                if (isSelected) {
                  onTagChange(selectedTags.filter(t => t !== tag))
                } else {
                  onTagChange([...selectedTags, tag as ComponentTag])
                }
              }}
            >
              <Icon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}

/**
 * 排序选项
 */
function SortOptions({
  sortBy,
  sortOrder,
  onChange
}: {
  sortBy: 'name' | 'category' | 'relevance'
  sortOrder: 'asc' | 'desc'
  onChange: (sortBy: 'name' | 'category' | 'relevance', sortOrder: 'asc' | 'desc') => void
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">排序方式</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={sortBy === 'name' ? "default" : "outline"}
          size="sm"
          onClick={() => onChange('name', sortOrder)}
          className="h-8"
        >
          按名称
        </Button>
        <Button
          variant={sortBy === 'category' ? "default" : "outline"}
          size="sm"
          onClick={() => onChange('category', sortOrder)}
          className="h-8"
        >
          按分类
        </Button>
        <Button
          variant={sortBy === 'relevance' ? "default" : "outline"}
          size="sm"
          onClick={() => onChange('relevance', sortOrder)}
          className="h-8"
        >
          按相关性
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
          className="h-8"
        >
          {sortOrder === 'asc' ? '升序' : '降序'}
        </Button>
      </div>
    </div>
  )
}

/**
 * 活跃筛选器显示
 */
function ActiveFilters({
  filters,
  onClearAll,
  onRemoveCategory,
  onRemoveTag,
  onClearQuery
}: {
  filters: SearchFilters
  onClearAll: () => void
  onRemoveCategory: (category: ComponentCategory) => void
  onRemoveTag: (tag: ComponentTag) => void
  onClearQuery: () => void
}) {
  const hasActiveFilters = filters.query ||
                          filters.categories.length > 0 ||
                          filters.tags.length > 0

  if (!hasActiveFilters) return null

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/50 rounded-md">
      <span className="text-sm font-medium">活跃筛选:</span>

      {filters.query && (
        <Badge variant="secondary" className="gap-1">
          搜索: {filters.query}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearQuery}
            className="h-4 w-4 p-0 hover:bg-muted-foreground/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {filters.categories.map((category) => (
        <Badge key={category} variant="secondary" className="gap-1">
          {componentCategories[category].name}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveCategory(category)}
            className="h-4 w-4 p-0 hover:bg-muted-foreground/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {filters.tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="gap-1">
          {tagConfig[tag].label}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveTag(tag)}
            className="h-4 w-4 p-0 hover:bg-muted-foreground/20"
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 text-xs"
      >
        清除所有
      </Button>
    </div>
  )
}

/**
 * 搜索筛选主组件
 */
export function SearchFilter({
  onFilterChange,
  totalCount,
  filteredCount
}: SearchFilterProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    tags: [],
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  // 更新筛选器并通知父组件
  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const handleQueryChange = (query: string) => {
    updateFilters({ query })
  }

  const handleCategoryChange = (categories: ComponentCategory[]) => {
    updateFilters({ categories })
  }

  const handleTagChange = (tags: ComponentTag[]) => {
    updateFilters({ tags })
  }

  const handleSortChange = (sortBy: SearchFilters['sortBy'], sortOrder: SearchFilters['sortOrder']) => {
    updateFilters({ sortBy, sortOrder })
  }

  const handleClearAll = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      categories: [],
      tags: [],
      sortBy: 'name',
      sortOrder: 'asc'
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const handleRemoveCategory = (category: ComponentCategory) => {
    handleCategoryChange(filters.categories.filter(c => c !== category))
  }

  const handleRemoveTag = (tag: ComponentTag) => {
    handleTagChange(filters.tags.filter(t => t !== tag))
  }

  const handleClearQuery = () => {
    handleQueryChange('')
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* 搜索框 */}
        <div className="space-y-2">
          <SearchInput
            value={filters.query}
            onChange={handleQueryChange}
            placeholder="搜索组件名称、描述或标签..."
          />
        </div>

        {/* 快速分类标签 */}
        <Tabs
          value={filters.categories[0] || 'all'}
          onValueChange={(value) => {
            if (value === 'all') {
              handleCategoryChange([])
            } else {
              handleCategoryChange([value as ComponentCategory])
            }
          }}
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all" className="text-xs">
              全部
            </TabsTrigger>
            {Object.entries(componentCategories).slice(0, 5).map(([category, info]) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                <span className="mr-1">{info.icon}</span>
                {info.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* 活跃筛选器 */}
        <ActiveFilters
          filters={filters}
          onClearAll={handleClearAll}
          onRemoveCategory={handleRemoveCategory}
          onRemoveTag={handleRemoveTag}
          onClearQuery={handleClearQuery}
        />

        {/* 高级筛选 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              高级筛选
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-6 text-xs"
            >
              {showAdvanced ? '收起' : '展开'}
            </Button>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-muted/30 rounded-md">
              <CategoryFilter
                selectedCategories={filters.categories}
                onCategoryChange={handleCategoryChange}
              />
              <TagFilter
                selectedTags={filters.tags}
                onTagChange={handleTagChange}
              />
              <SortOptions
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onChange={handleSortChange}
              />
            </div>
          )}
        </div>

        {/* 结果统计 */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            显示 {filteredCount} / {totalCount} 个组件
          </span>
          {filteredCount === 0 && (
            <span>没有找到匹配的组件，请尝试调整筛选条件</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * 组件筛选工具函数
 */
export function filterComponents(
  components: ComponentMeta[],
  filters: SearchFilters
): ComponentMeta[] {
  let filtered = [...components]

  // 文本搜索
  if (filters.query) {
    filtered = searchComponents(filters.query)
  }

  // 分类筛选
  if (filters.categories.length > 0) {
    filtered = filtered.filter(component =>
      filters.categories.includes(component.category)
    )
  }

  // 标签筛选
  if (filters.tags.length > 0) {
    filtered = filtered.filter(component =>
      filters.tags.some(tag => component.tags.includes(tag))
    )
  }

  // 排序
  filtered.sort((a, b) => {
    let comparison = 0

    switch (filters.sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'category':
        comparison = a.category.localeCompare(b.category)
        break
      case 'relevance':
        // 简单的相关性排序：匹配查询的组件优先
        if (filters.query) {
          const aMatch = a.name.toLowerCase().includes(filters.query.toLowerCase()) ||
                        a.description.toLowerCase().includes(filters.query.toLowerCase())
          const bMatch = b.name.toLowerCase().includes(filters.query.toLowerCase()) ||
                        b.description.toLowerCase().includes(filters.query.toLowerCase())
          comparison = aMatch === bMatch ? 0 : aMatch ? -1 : 1
        }
        break
    }

    return filters.sortOrder === 'desc' ? -comparison : comparison
  })

  return filtered
}

export default SearchFilter