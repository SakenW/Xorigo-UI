/**
 * 高级过滤器组件
 * 提供复杂的多维度过滤功能
 */

'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { cn } from '../../../lib/utils'
import type {
  FilterGroup,
  FilterOption,
  ActiveFilter,
  SearchFiltersState,
  FilterSearchConfig
} from '../../../lib/workbench/advanced-filters/types'
import { createAdvancedFilterEngine } from '../../../lib/workbench/advanced-filters'

/**
 * 高级过滤器属性
 */
interface AdvancedFiltersProps {
  /** 组件数据 */
  components: any[]
  /** 当前过滤器状态 */
  filters?: SearchFiltersState
  /** 过滤器变更回调 */
  onFiltersChange?: (filters: SearchFiltersState) => void
  /** 搜索执行回调 */
  onSearch?: (query: any) => void
  /** 配置选项 */
  config?: Partial<FilterSearchConfig>
  /** 是否显示高级选项 */
  showAdvanced?: boolean
  /** 主题 */
  theme?: string
  /** 类名 */
  className?: string
}

/**
 * 过滤器选项组件
 */
const FilterOptionItem: React.FC<{
  option: FilterOption
  isActive: boolean
  isMultiSelect: boolean
  onToggle: (value: string) => void
  count?: number
}> = ({ option, isActive, isMultiSelect, onToggle, count }) => {
  return (
    <label
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
        "hover:bg-muted/50 border border-transparent hover:border-border",
        isActive && "bg-primary/10 border-primary/30"
      )}
    >
      <input
        type={isMultiSelect ? "checkbox" : "radio"}
        checked={isActive}
        onChange={() => onToggle(option.value)}
        className={cn(
          "w-4 h-4 text-primary border-2 rounded",
          "focus:ring-2 focus:ring-primary/20"
        )}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium truncate">{option.label}</span>
          {count !== undefined && (
            <Badge variant="secondary" className="text-xs">
              {count}
            </Badge>
          )}
        </div>
        {option.description && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {option.description}
          </p>
        )}
      </div>
    </label>
  )
}

/**
 * 活动过滤器标签组件
 */
const ActiveFilterTag: React.FC<{
  filter: ActiveFilter
  group: FilterGroup
  onRemove: () => void
}> = ({ filter, group, onRemove }) => {
  const getDisplayValue = (value: string | string[]) => {
    if (Array.isArray(value)) {
      if (value.length === 1) return value[0]
      return `${value.length} 项`
    }
    return value
  }

  const getDisplayLabel = (value: string | string[]) => {
    if (Array.isArray(value) && value.length > 1) {
      return `${group.name}: ${value.length} 项`
    }
    const option = group.options.find(opt => opt.value === value)
    return `${group.name}: ${option?.label || value}`
  }

  return (
    <Badge
      variant="outline"
      className="flex items-center space-x-1 pr-1"
    >
      <span>{getDisplayLabel(filter.value)}</span>
      <button
        onClick={onRemove}
        className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={`移除${group.name}过滤器`}
      >
        ×
      </button>
    </Badge>
  )
}

/**
 * 高级过滤器主组件
 */
export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  components,
  filters,
  onFiltersChange,
  onSearch,
  config = {},
  showAdvanced = false,
  theme = 'default',
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(showAdvanced)
  const [availableFilters, setAvailableFilters] = useState<FilterGroup[]>([])
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(filters?.activeFilters || [])
  const [filterLogic, setFilterLogic] = useState<'and' | 'or'>(filters?.filterLogic || 'and')
  const [sortBy, setSortBy] = useState(filters?.sortBy || 'relevance')
  const [sortOrder, setSortOrder] = useState(filters?.sortOrder || 'desc')

  const filterEngine = useMemo(() => createAdvancedFilterEngine(), [])

  // 初始化过滤器
  useEffect(() => {
    filterEngine.setComponents(components)
    const filters = filterEngine.generateAvailableFilters()
    setAvailableFilters(filters)
  }, [components, filterEngine])

  // 处理过滤器变更
  useEffect(() => {
    const newState: SearchFiltersState = {
      activeFilters,
      availableFilters,
      filterLogic,
      sortBy,
      sortOrder
    }
    onFiltersChange?.(newState)
  }, [activeFilters, availableFilters, filterLogic, sortBy, sortOrder, onFiltersChange])

  // 切换过滤器选项
  const handleFilterToggle = useCallback((groupId: string, value: string) => {
    const group = availableFilters.find(g => g.id === groupId)
    if (!group) return

    setActiveFilters(prev => {
      const existing = prev.find(f => f.groupId === groupId)
      const isMultiSelect = group.type === 'checkbox'

      if (existing) {
        if (isMultiSelect && Array.isArray(existing.value)) {
          // 多选：切换特定值
          const newValues = existing.value.includes(value)
            ? existing.value.filter(v => v !== value)
            : [...existing.value, value]

          if (newValues.length === 0) {
            // 移除整个过滤器
            return prev.filter(f => f.groupId !== groupId)
          }

          return prev.map(f =>
            f.groupId === groupId
              ? { ...f, value: newValues }
              : f
          )
        } else {
          // 单选：替换值
          return existing.value === value
            ? prev.filter(f => f.groupId !== groupId)
            : prev.map(f => f.groupId === groupId ? { ...f, value } : f)
        }
      } else {
        // 新增过滤器
        return [...prev, {
          groupId,
          value: isMultiSelect ? [value] : value,
          operator: filterLogic
        }]
      }
    })
  }, [availableFilters, filterLogic])

  // 移除过滤器
  const handleRemoveFilter = useCallback((groupId: string) => {
    setActiveFilters(prev => prev.filter(f => f.groupId !== groupId))
  }, [])

  // 清除所有过滤器
  const handleClearAll = useCallback(() => {
    setActiveFilters([])
  }, [])

  // 执行搜索
  const handleSearch = useCallback(() => {
    const query = {
      text: '',
      filters: activeFilters,
      logic: filterLogic,
      sortBy,
      sortOrder,
      limit: 50
    }
    onSearch?.(query)
  }, [activeFilters, filterLogic, sortBy, sortOrder, onSearch])

  // 获取过滤器组状态
  const getFilterGroupState = useCallback((groupId: string) => {
    const filter = activeFilters.find(f => f.groupId === groupId)
    const group = availableFilters.find(g => g.id === groupId)

    if (!group) return { selectedValues: [], isMultiSelect: false }

    const isMultiSelect = group.type === 'checkbox'
    const selectedValues = Array.isArray(filter?.value)
      ? filter.value
      : filter?.value
        ? [filter.value]
        : []

    return { selectedValues, isMultiSelect }
  }, [activeFilters, availableFilters])

  // 生成活动过滤器显示
  const activeFilterDisplay = useMemo(() => {
    return activeFilters.map(filter => {
      const group = availableFilters.find(g => g.id === filter.groupId)
      return group ? { filter, group } : null
    }).filter(Boolean) as Array<{ filter: ActiveFilter; group: FilterGroup }>
  }, [activeFilters, availableFilters])

  const hasNoFilters = availableFilters.length === 0

  if (hasNoFilters) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <div className="text-2xl mb-2">🔍</div>
            <p>正在加载过滤器选项...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <span>🎛️</span>
              <span>高级过滤器</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              使用多维度过滤条件精确查找组件
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '收起' : '展开'}
            </Button>
            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
              >
                清除全部
              </Button>
            )}
          </div>
        </div>

        {/* 活动过滤器标签 */}
        {activeFilterDisplay.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {activeFilterDisplay.map(({ filter, group }) => (
              <ActiveFilterTag
                key={filter.groupId}
                filter={filter}
                group={group}
                onRemove={() => handleRemoveFilter(filter.groupId)}
              />
            ))}
          </div>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* 过滤器逻辑选择 */}
          <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
            <span className="text-sm font-medium">过滤逻辑:</span>
            <div className="flex space-x-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="filterLogic"
                  value="and"
                  checked={filterLogic === 'and'}
                  onChange={(e) => setFilterLogic(e.target.value as 'and' | 'or')}
                  className="w-4 h-4"
                />
                <span className="text-sm">AND (全部条件)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="filterLogic"
                  value="or"
                  checked={filterLogic === 'or'}
                  onChange={(e) => setFilterLogic(e.target.value as 'and' | 'or')}
                  className="w-4 h-4"
                />
                <span className="text-sm">OR (任一条件)</span>
              </label>
            </div>
          </div>

          {/* 过滤器组 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableFilters.map((group) => {
              const { selectedValues, isMultiSelect } = getFilterGroupState(group.id)

              return (
                <div key={group.id} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {group.icon && <span>{group.icon}</span>}
                    <h4 className="font-medium">{group.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {selectedValues.length}/{group.options.length}
                    </Badge>
                  </div>

                  {group.description && (
                    <p className="text-xs text-muted-foreground">
                      {group.description}
                    </p>
                  )}

                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                    {group.options.map((option) => (
                      <FilterOptionItem
                        key={option.value}
                        option={option}
                        isActive={selectedValues.includes(option.value)}
                        isMultiSelect={isMultiSelect}
                        onToggle={(value) => handleFilterToggle(group.id, value)}
                        count={option.count}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 排序选项 */}
          <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
            <span className="text-sm font-medium">排序方式:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="relevance">相关性</option>
              <option value="name">名称</option>
              <option value="category">分类</option>
              <option value="popularity">流行度</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="desc">降序</option>
              <option value="asc">升序</option>
            </select>
          </div>

          {/* 搜索按钮 */}
          <div className="flex justify-center">
            <Button
              onClick={handleSearch}
              disabled={activeFilters.length === 0}
              className="px-8"
            >
              应用过滤器 ({activeFilters.length})
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// 设置显示名称用于调试
AdvancedFilters.displayName = 'AdvancedFilters'

export default AdvancedFilters