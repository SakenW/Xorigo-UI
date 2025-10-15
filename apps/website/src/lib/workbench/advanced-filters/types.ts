/**
 * 高级搜索过滤器类型定义
 */

export interface FilterOption {
  value: string
  label: string
  count?: number
  description?: string
}

export interface FilterGroup {
  id: string
  name: string
  type: 'checkbox' | 'radio' | 'range' | 'select'
  options: FilterOption[]
  description?: string
  icon?: string
}

export interface ActiveFilter {
  groupId: string
  value: string | string[]
  operator?: 'and' | 'or'
  label?: string
}

export interface SearchFiltersState {
  activeFilters: ActiveFilter[]
  availableFilters: FilterGroup[]
  filterLogic: 'and' | 'or'
  sortBy: 'relevance' | 'name' | 'category' | 'popularity'
  sortOrder: 'asc' | 'desc'
}

export interface FilterSearchConfig {
  enableCategoryFilter: boolean
  enableVariantFilter: boolean
  enablePropsFilter: boolean
  enableComplexityFilter: boolean
  enablePopularityFilter: boolean
  enableAdvancedLogic: boolean
}

export interface ComponentMetrics {
  complexity: 'simple' | 'moderate' | 'complex'
  popularity: number
  usageFrequency: number
  lastUpdated: Date
  communityRating: number
}

export interface AdvancedSearchQuery {
  text: string
  filters: ActiveFilter[]
  logic: 'and' | 'or'
  sortBy: string
  sortOrder: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface FilterSearchResult {
  components: Array<{
    component: any
    score: number
    matchReasons: string[]
    relatedComponents: string[]
  }>
  total: number
  facets: Record<string, FilterOption[]>
  suggestions: string[]
  searchTime: number
  appliedFilters: ActiveFilter[]
}