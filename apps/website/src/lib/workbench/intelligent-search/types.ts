/**
 * 智能搜索引擎类型定义
 * 提供自然语言搜索、语义匹配和智能推荐功能
 */

import type { ComponentInfo } from '@/data/component-classification'

/**
 * 搜索查询接口
 */
export interface SearchQuery {
  /** 搜索文本 */
  text: string
  /** 搜索上下文 */
  context?: SearchContext
  /** 搜索过滤器 */
  filters?: SearchFilter[]
  /** 用户偏好 */
  preferences?: UserPreferences
  /** 分页信息 */
  pagination?: {
    page: number
    limit: number
  }
}

/**
 * 搜索上下文
 */
export interface SearchContext {
  /** 当前项目上下文 */
  project?: {
    type: string
    domain: string
    stack: string[]
  }
  /** 用户意图 */
  intent?: 'browsing' | 'searching' | 'comparing' | 'learning' | 'implementing'
  /** 最近的搜索 */
  recentSearches?: string[]
  /** 当前选中的组件 */
  currentComponent?: string
}

/**
 * 搜索过滤器
 */
export interface SearchFilter {
  /** 过滤器类型 */
  type: 'category' | 'variant' | 'prop' | 'usage' | 'complexity' | 'popularity'
  /** 过滤器值 */
  value: string | string[]
  /** 是否包含 */
  include: boolean
}

/**
 * 用户偏好
 */
export interface UserPreferences {
  /** 偏好的组件类型 */
  preferredTypes?: string[]
  /** 常用的分类 */
  frequentCategories?: string[]
  /** 历史行为权重 */
  behaviorWeight?: number
  /** 性能偏好 */
  performancePreference?: 'speed' | 'features' | 'balanced'
}

/**
 * 搜索结果
 */
export interface SearchResult {
  /** 匹配的组件 */
  components: ComponentMatch[]
  /** 搜索建议 */
  suggestions: string[]
  /** 相关搜索 */
  relatedSearches: string[]
  /** 总数量 */
  totalFound: number
  /** 搜索耗时 */
  searchTime: number
  /** 分页信息 */
  pagination: {
    page: number
    limit: number
    total: number
    hasNext: boolean
    hasPrev: boolean
  }
  /** 搜索统计 */
  stats: {
    textMatches: number
    semanticMatches: number
    contextualMatches: number
    personalizedMatches: number
  }
}

/**
 * 组件匹配结果
 */
export interface ComponentMatch {
  /** 组件信息 */
  component: ComponentInfo
  /** 匹配分数 (0-100) */
  score: number
  /** 匹配类型 */
  matchType: 'exact' | 'partial' | 'semantic' | 'contextual' | 'personalized'
  /** 高亮信息 */
  highlights: {
    name: string[]
    description: string[]
    props: string[]
  }
  /** 相关组件 */
  relatedComponents: string[]
  /** 使用统计 */
  usageStats: {
    frequency: number
    recentUsage: Date
    userRating?: number
    trending?: boolean
  }
  /** 匹配原因 */
  matchReasons: string[]
  /** 置信度 */
  confidence: number
}

/**
 * 搜索建议
 */
export interface SearchSuggestion {
  /** 建议文本 */
  text: string
  /** 建议类型 */
  type: 'completion' | 'correction' | 'related' | 'trending'
  /** 权重 */
  weight: number
  /** 来源 */
  source: 'history' | 'popular' | 'semantic' | 'collaborative'
}

/**
 * 搜索配置
 */
export interface SearchConfig {
  /** 搜索算法权重 */
  weights: {
    textMatch: number
    semanticMatch: number
    contextualMatch: number
    behaviorMatch: number
    popularityMatch: number
  }
  /** 搜索阈值 */
  thresholds: {
    minScore: number
    semanticSimilarity: number
    maxResults: number
  }
  /** 缓存配置 */
  cache: {
    enabled: boolean
    ttl: number
    maxSize: number
  }
  /** 性能配置 */
  performance: {
    enableFuzzySearch: boolean
    enableSemanticSearch: boolean
    maxSearchTime: number
    enablePredictiveLoading: boolean
  }
}

/**
 * 搜索引擎接口
 */
export interface IntelligentSearchEngine {
  /** 搜索配置 */
  config: SearchConfig

  /**
   * 执行搜索
   */
  search: (query: SearchQuery) => Promise<SearchResult>

  /**
   * 获取搜索建议
   */
  suggest: (partial: string, context?: SearchContext) => Promise<SearchSuggestion[]>

  /**
   * 构建搜索索引
   */
  buildIndex: (components: ComponentInfo[]) => Promise<void>

  /**
   * 更新索引
   */
  updateIndex: (component: ComponentInfo) => Promise<void>

  /**
   * 从索引中移除
   */
  removeFromIndex: (componentName: string) => Promise<void>

  /**
   * 获取热门搜索
   */
  getPopularSearches: (limit?: number) => Promise<string[]>

  /**
   * 获取推荐组件
   */
  getRecommendations: (context: SearchContext) => Promise<ComponentInfo[]>

  /**
   * 分析搜索统计
   */
  getAnalytics: () => Promise<SearchAnalytics>
}

/**
 * 搜索分析数据
 */
export interface SearchAnalytics {
  /** 总搜索次数 */
  totalSearches: number
  /** 平均搜索时间 */
  averageSearchTime: number
  /** 热门搜索词 */
  popularQueries: Array<{
    query: string
    count: number
    trend: 'up' | 'down' | 'stable'
  }>
  /** 搜索成功率 */
  successRate: number
  /** 用户行为模式 */
  userPatterns: {
    averageResultsPerSearch: number
    averageFiltersUsed: number
    commonFilterCombinations: Array<{
      filters: SearchFilter[]
      usage: number
    }>
  }
}

/**
 * 默认搜索配置
 */
export const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  weights: {
    textMatch: 0.4,
    semanticMatch: 0.3,
    contextualMatch: 0.2,
    behaviorMatch: 0.05,
    popularityMatch: 0.05
  },
  thresholds: {
    minScore: 30,
    semanticSimilarity: 0.7,
    maxResults: 50
  },
  cache: {
    enabled: true,
    ttl: 300000, // 5分钟
    maxSize: 1000
  },
  performance: {
    enableFuzzySearch: true,
    enableSemanticSearch: true,
    maxSearchTime: 500, // 500ms
    enablePredictiveLoading: true
  }
}