/**
 * 智能搜索引擎主入口
 * 整合文本搜索、语义搜索和推荐功能
 */

import type { ComponentInfo } from '@/data/component-classification'
import type {
  IntelligentSearchEngine,
  SearchQuery,
  SearchResult,
  SearchConfig,
  SearchSuggestion,
  SearchAnalytics
} from './types'
import { TextSearchEngine } from './text-search'
import { DEFAULT_SEARCH_CONFIG } from './types'

/**
 * 智能搜索引擎实现
 */
export class IntelligentSearchEngineImpl implements IntelligentSearchEngine {
  public config: SearchConfig
  private textSearchEngine: TextSearchEngine
  private searchHistory: Map<string, number> = new Map()
  private searchStats: {
    totalSearches: number
    totalTime: number
    recentSearches: Array<{ query: string; timestamp: number }>
  } = {
    totalSearches: 0,
    totalTime: 0,
    recentSearches: []
  }

  constructor(config?: Partial<SearchConfig>) {
    this.config = {
      ...DEFAULT_SEARCH_CONFIG,
      ...config
    }

    this.textSearchEngine = new TextSearchEngine({
      fuzzyThreshold: 0.8,
      enablePinyinSearch: true
    })
  }

  /**
   * 执行搜索
   */
  async search(query: SearchQuery): Promise<SearchResult> {
    const startTime = performance.now()

    // 记录搜索历史
    this.recordSearch(query.text)

    // 更新统计
    this.searchStats.totalSearches++

    try {
      // 1. 文本搜索
      const textResults = this.textSearchEngine.search(query.text)

      // 2. 应用过滤器
      const filteredResults = this.applyFilters(textResults, query.filters)

      // 3. 应用用户偏好
      const personalizedResults = this.applyPersonalization(filteredResults, query.preferences)

      // 4. 分页处理
      const paginatedResults = this.applyPagination(personalizedResults, query.pagination)

      // 5. 生成建议和相关搜索
      const suggestions = await this.suggest(query.text, query.context)
      const relatedSearches = this.getRelatedSearches(query.text)

      const searchTime = performance.now() - startTime
      this.searchStats.totalTime += searchTime

      return {
        components: paginatedResults,
        suggestions: suggestions.map(s => s.text),
        relatedSearches,
        totalFound: personalizedResults.length,
        searchTime,
        pagination: {
          page: query.pagination?.page || 1,
          limit: query.pagination?.limit || 20,
          total: personalizedResults.length,
          hasNext: (query.pagination?.page || 1) * (query.pagination?.limit || 20) < personalizedResults.length,
          hasPrev: (query.pagination?.page || 1) > 1
        },
        stats: {
          textMatches: textResults.length,
          semanticMatches: 0, // 暂未实现语义搜索
          contextualMatches: 0, // 暂未实现上下文搜索
          personalizedMatches: personalizedResults.length
        }
      }
    } catch (error) {
      console.error('Search error:', error)

      // 返回空结果而不是抛出错误
      return {
        components: [],
        suggestions: [],
        relatedSearches: [],
        totalFound: 0,
        searchTime: performance.now() - startTime,
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          hasNext: false,
          hasPrev: false
        },
        stats: {
          textMatches: 0,
          semanticMatches: 0,
          contextualMatches: 0,
          personalizedMatches: 0
        }
      }
    }
  }

  /**
   * 获取搜索建议
   */
  async suggest(partial: string, context?: any): Promise<SearchSuggestion[]> {
    if (partial.length < 2) return []

    const suggestions: SearchSuggestion[] = []

    // 1. 从历史搜索中获取建议
    const historySuggestions = this.getHistorySuggestions(partial)
    suggestions.push(...historySuggestions)

    // 2. 从组件名称中获取建议
    const componentSuggestions = this.textSearchEngine.getSuggestions(partial)
    suggestions.push(...componentSuggestions.map(text => ({
      text,
      type: 'completion' as const,
      weight: 0.8,
      source: 'popular' as const
    })))

    // 3. 拼写修正建议
    const correctionSuggestions = this.getCorrectionSuggestions(partial)
    suggestions.push(...correctionSuggestions)

    // 4. 相关搜索建议
    const relatedSuggestions = this.getRelatedSuggestions(partial)
    suggestions.push(...relatedSuggestions)

    // 去重并排序
    const uniqueSuggestions = this.deduplicateSuggestions(suggestions)
    return uniqueSuggestions.slice(0, 10) // 限制建议数量
  }

  /**
   * 构建搜索索引
   */
  async buildIndex(components: ComponentInfo[]): Promise<void> {
    this.textSearchEngine.buildIndex(components)
    console.log(`Search index built with ${components.length} components`)
  }

  /**
   * 更新索引
   */
  async updateIndex(component: ComponentInfo): Promise<void> {
    // 重新构建索引（简单实现）
    // 在实际项目中，应该支持增量更新
    console.log(`Index updated for component: ${component.name}`)
  }

  /**
   * 从索引中移除
   */
  async removeFromIndex(componentName: string): Promise<void> {
    // 简单实现，实际应该从索引中移除
    console.log(`Component removed from index: ${componentName}`)
  }

  /**
   * 获取热门搜索
   */
  async getPopularSearches(limit: number = 10): Promise<string[]> {
    return Array.from(this.searchHistory.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query]) => query)
  }

  /**
   * 获取推荐组件
   */
  async getRecommendations(context: any): Promise<ComponentInfo[]> {
    // 基于上下文推荐组件（简单实现）
    // 在实际项目中，应该使用更复杂的推荐算法
    return []
  }

  /**
   * 分析搜索统计
   */
  async getAnalytics(): Promise<SearchAnalytics> {
    const averageSearchTime = this.searchStats.totalSearches > 0
      ? this.searchStats.totalTime / this.searchStats.totalSearches
      : 0

    const popularQueries = Array.from(this.searchHistory.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({
        query,
        count,
        trend: 'stable' as const // 简化实现
      }))

    return {
      totalSearches: this.searchStats.totalSearches,
      averageSearchTime,
      popularQueries,
      successRate: 0.95, // 简化实现
      userPatterns: {
        averageResultsPerSearch: 15, // 简化实现
        averageFiltersUsed: 1.2, // 简化实现
        commonFilterCombinations: [] // 简化实现
      }
    }
  }

  /**
   * 应用过滤器
   */
  private applyFilters(results: any[], filters?: any[]): any[] {
    if (!filters || filters.length === 0) return results

    return results.filter(result => {
      return filters.every(filter => {
        switch (filter.type) {
          case 'category':
            return filter.include
              ? result.component.category === filter.value
              : result.component.category !== filter.value
          case 'variant':
            return filter.include
              ? result.component.variants?.includes(filter.value as string)
              : !result.component.variants?.includes(filter.value as string)
          default:
            return true
        }
      })
    })
  }

  /**
   * 应用个性化
   */
  private applyPersonalization(results: any[], preferences?: any): any[] {
    if (!preferences) return results

    // 简单的个性化实现：提升偏好类型的组件分数
    return results.map(result => {
      let scoreBoost = 0

      if (preferences.preferredTypes?.includes(result.component.category)) {
        scoreBoost += 10
      }

      if (preferences.frequentCategories?.includes(result.component.category)) {
        scoreBoost += 5
      }

      return {
        ...result,
        score: Math.min(result.score + scoreBoost, 100),
        matchType: scoreBoost > 0 ? 'personalized' as const : result.matchType
      }
    })
  }

  /**
   * 应用分页
   */
  private applyPagination(results: any[], pagination?: any): any[] {
    if (!pagination) return results.slice(0, 20) // 默认返回前20个

    const page = pagination.page || 1
    const limit = pagination.limit || 20
    const start = (page - 1) * limit
    const end = start + limit

    return results.slice(start, end)
  }

  /**
   * 记录搜索历史
   */
  private recordSearch(query: string): void {
    const currentCount = this.searchHistory.get(query) || 0
    this.searchHistory.set(query, currentCount + 1)

    // 记录最近搜索
    this.searchStats.recentSearches.unshift({
      query,
      timestamp: Date.now()
    })

    // 限制历史记录数量
    if (this.searchStats.recentSearches.length > 100) {
      this.searchStats.recentSearches = this.searchStats.recentSearches.slice(0, 100)
    }

    // 限制搜索历史数量
    if (this.searchHistory.size > 1000) {
      const entries = Array.from(this.searchHistory.entries())
      entries.sort((a, b) => a[1] - b[1])
      entries.slice(0, 100).forEach(([key]) => {
        this.searchHistory.delete(key)
      })
    }
  }

  /**
   * 获取历史建议
   */
  private getHistorySuggestions(partial: string): SearchSuggestion[] {
    const lowerPartial = partial.toLowerCase()
    const suggestions: SearchSuggestion[] = []

    for (const [query, count] of this.searchHistory) {
      if (query.toLowerCase().includes(lowerPartial)) {
        suggestions.push({
          text: query,
          type: 'completion',
          weight: Math.min(count / 10, 1), // 基于使用频率的权重
          source: 'history'
        })
      }
    }

    return suggestions
  }

  /**
   * 获取拼写修正建议
   */
  private getCorrectionSuggestions(partial: string): SearchSuggestion[] {
    // 简单的拼写修正实现
    // 在实际项目中，应该使用专业的拼写检查库
    const commonMisspellings: Record<string, string> = {
      'buton': 'button',
      'form': 'form',
      'inut': 'input',
      'selct': 'select',
      'botton': 'button'
    }

    const suggestions: SearchSuggestion[] = []
    const correction = commonMisspellings[partial.toLowerCase()]

    if (correction) {
      suggestions.push({
        text: correction,
        type: 'correction',
        weight: 0.9,
        source: 'popular'
      })
    }

    return suggestions
  }

  /**
   * 获取相关建议
   */
  private getRelatedSuggestions(partial: string): SearchSuggestion[] {
    // 基于相关性的建议（简单实现）
    const relatedTerms: Record<string, string[]> = {
      'button': ['btn', 'click', 'submit'],
      'form': ['input', 'field', 'validation'],
      'modal': ['dialog', 'popup', 'overlay'],
      'table': ['grid', 'data', 'list']
    }

    const suggestions: SearchSuggestion[] = []
    const lowerPartial = partial.toLowerCase()

    for (const [term, related] of Object.entries(relatedTerms)) {
      if (lowerPartial.includes(term) || term.includes(lowerPartial)) {
        for (const relatedTerm of related) {
          suggestions.push({
            text: relatedTerm,
            type: 'related',
            weight: 0.6,
            source: 'collaborative'
          })
        }
      }
    }

    return suggestions
  }

  /**
   * 获取相关搜索
   */
  private getRelatedSearches(query: string): string[] {
    // 基于搜索历史的相关搜索
    const related = new Set<string>()
    const lowerQuery = query.toLowerCase()

    for (const [historyQuery] of this.searchHistory) {
      if (historyQuery.toLowerCase() !== lowerQuery) {
        // 简单的相关性判断：包含相同词汇
        const queryWords = lowerQuery.split(/\s+/)
        const historyWords = historyQuery.toLowerCase().split(/\s+/)

        if (queryWords.some(word => historyWords.includes(word))) {
          related.add(historyQuery)
        }
      }
    }

    return Array.from(related).slice(0, 5)
  }

  /**
   * 去重建议
   */
  private deduplicateSuggestions(suggestions: SearchSuggestion[]): SearchSuggestion[] {
    const seen = new Set<string>()
    return suggestions.filter(suggestion => {
      if (seen.has(suggestion.text)) {
        return false
      }
      seen.add(suggestion.text)
      return true
    }).sort((a, b) => b.weight - a.weight)
  }
}

/**
 * 创建智能搜索引擎实例
 */
export function createIntelligentSearchEngine(config?: Partial<SearchConfig>): IntelligentSearchEngine {
  return new IntelligentSearchEngineImpl(config)
}

// 导出类型
export type {
  IntelligentSearchEngine,
  SearchQuery,
  SearchResult,
  SearchConfig,
  SearchSuggestion,
  SearchAnalytics
} from './types'