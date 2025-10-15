/**
 * 搜索历史记录管理器
 * 提供本地存储的搜索历史记录管理功能
 */

import type {
  SearchHistoryItem,
  SearchHistoryStats,
  SearchHistoryConfig,
  SearchHistoryManager
} from './types'

/**
 * 默认配置
 */
const DEFAULT_CONFIG: SearchHistoryConfig = {
  maxHistoryItems: 100,
  expirationDays: 30,
  enablePersistence: true,
  storageKey: 'xorigo-workbench-search-history',
  enableStats: true
}

/**
 * 搜索历史记录管理器实现
 */
export class LocalSearchHistoryManager implements SearchHistoryManager {
  private history: SearchHistoryItem[] = []
  private config: SearchHistoryConfig

  constructor(config: Partial<SearchHistoryConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.loadHistory()
  }

  /**
   * 添加搜索记录
   */
  addSearch(
    query: string,
    resultCount?: number,
    duration?: number,
    context?: any
  ): void {
    if (!query || !query.trim()) return

    const trimmedQuery = query.trim()
    const now = new Date()

    // 查找现有记录
    const existingIndex = this.history.findIndex(item => item.query === trimmedQuery)

    if (existingIndex >= 0) {
      // 更新现有记录
      const existing = this.history[existingIndex]
      existing.count += 1
      existing.lastSearch = now
      existing.resultCount = resultCount ?? existing.resultCount

      // 更新平均搜索时长
      if (duration !== undefined) {
        if (existing.averageDuration === undefined) {
          existing.averageDuration = duration
        } else {
          existing.averageDuration = (existing.averageDuration + duration) / 2
        }
      }

      // 更新上下文
      if (context) {
        existing.context = { ...existing.context, ...context }
      }

      // 移到最前面
      this.history.splice(existingIndex, 1)
      this.history.unshift(existing)
    } else {
      // 创建新记录
      const newItem: SearchHistoryItem = {
        query: trimmedQuery,
        count: 1,
        firstSearch: now,
        lastSearch: now,
        averageDuration: duration,
        resultCount,
        isFavorite: false,
        tags: [],
        context
      }

      this.history.unshift(newItem)
    }

    // 限制历史记录数量
    if (this.history.length > this.config.maxHistoryItems) {
      this.history = this.history.slice(0, this.config.maxHistoryItems)
    }

    // 保存到本地存储
    this.saveHistory()
  }

  /**
   * 获取历史记录
   */
  getHistory(limit?: number): SearchHistoryItem[] {
    const filtered = this.getValidHistory()

    if (limit) {
      return filtered.slice(0, limit)
    }

    return filtered
  }

  /**
   * 搜索历史记录
   */
  searchHistory(query: string): SearchHistoryItem[] {
    if (!query || !query.trim()) return []

    const searchTerm = query.toLowerCase()
    return this.getValidHistory().filter(item =>
      item.query.toLowerCase().includes(searchTerm) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  /**
   * 删除历史记录
   */
  removeHistory(query: string): boolean {
    const index = this.history.findIndex(item => item.query === query)
    if (index >= 0) {
      this.history.splice(index, 1)
      this.saveHistory()
      return true
    }
    return false
  }

  /**
   * 清空历史记录
   */
  clearHistory(): void {
    this.history = []
    this.saveHistory()
  }

  /**
   * 获取统计数据
   */
  getStats(): SearchHistoryStats {
    const validHistory = this.getValidHistory()
    const totalSearches = validHistory.reduce((sum, item) => sum + item.count, 0)
    const averageSearchDuration = validHistory
      .filter(item => item.averageDuration !== undefined)
      .reduce((sum, item, _, array) => {
        const validItems = array.filter(i => i.averageDuration !== undefined)
        return validItems.reduce((s, i) => s + (i.averageDuration || 0), 0) / validItems.length
      }, 0)

    // 热门搜索
    const popularSearches = validHistory
      .map(item => ({ query: item.query, count: item.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // 搜索频率趋势
    const searchFrequency = this.calculateSearchFrequency(validHistory)

    return {
      totalSearches,
      uniqueQueries: validHistory.length,
      popularSearches,
      recentSearches: validHistory.slice(0, 10),
      searchFrequency,
      averageSearchDuration
    }
  }

  /**
   * 收藏/取消收藏
   */
  toggleFavorite(query: string): boolean {
    const item = this.history.find(item => item.query === query)
    if (item) {
      item.isFavorite = !item.isFavorite
      this.saveHistory()
      return item.isFavorite
    }
    return false
  }

  /**
   * 获取收藏的搜索
   */
  getFavorites(): SearchHistoryItem[] {
    return this.getValidHistory()
      .filter(item => item.isFavorite)
      .sort((a, b) => b.lastSearch.getTime() - a.lastSearch.getTime())
  }

  /**
   * 导出历史记录
   */
  exportHistory(): string {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      history: this.history,
      stats: this.getStats()
    }
    return JSON.stringify(exportData, null, 2)
  }

  /**
   * 导入历史记录
   */
  importHistory(data: string): boolean {
    try {
      const importData = JSON.parse(data)

      if (!importData.history || !Array.isArray(importData.history)) {
        throw new Error('Invalid data format')
      }

      // 合并历史记录
      const existingQueries = new Set(this.history.map(item => item.query))
      const newItems = importData.history.filter((item: SearchHistoryItem) =>
        !existingQueries.has(item.query)
      )

      // 转换日期字符串
      newItems.forEach((item: any) => {
        if (typeof item.firstSearch === 'string') {
          item.firstSearch = new Date(item.firstSearch)
        }
        if (typeof item.lastSearch === 'string') {
          item.lastSearch = new Date(item.lastSearch)
        }
      })

      this.history.push(...newItems)

      // 重新排序和限制数量
      this.history.sort((a, b) => b.lastSearch.getTime() - a.lastSearch.getTime())
      if (this.history.length > this.config.maxHistoryItems) {
        this.history = this.history.slice(0, this.config.maxHistoryItems)
      }

      this.saveHistory()
      return true
    } catch (error) {
      console.error('Failed to import search history:', error)
      return false
    }
  }

  /**
   * 从本地存储加载历史记录
   */
  private loadHistory(): void {
    if (!this.config.enablePersistence || typeof window === 'undefined') {
      return
    }

    try {
      const stored = localStorage.getItem(this.config.storageKey)
      if (stored) {
        const data = JSON.parse(stored)

        if (Array.isArray(data)) {
          // 兼容旧格式
          this.history = this.migrateLegacyData(data)
        } else if (data.history && Array.isArray(data.history)) {
          // 新格式
          this.history = data.history.map((item: any) => ({
            ...item,
            firstSearch: new Date(item.firstSearch),
            lastSearch: new Date(item.lastSearch)
          }))
        }
      }
    } catch (error) {
      console.error('Failed to load search history:', error)
      this.history = []
    }
  }

  /**
   * 保存历史记录到本地存储
   */
  private saveHistory(): void {
    if (!this.config.enablePersistence || typeof window === 'undefined') {
      return
    }

    try {
      const data = {
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        history: this.history
      }
      localStorage.setItem(this.config.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save search history:', error)
    }
  }

  /**
   * 获取有效的历史记录（未过期的）
   */
  private getValidHistory(): SearchHistoryItem[] {
    const now = new Date()
    const expirationTime = this.config.expirationDays * 24 * 60 * 60 * 1000

    return this.history.filter(item => {
      return now.getTime() - item.lastSearch.getTime() < expirationTime
    })
  }

  /**
   * 迁移旧格式数据
   */
  private migrateLegacyData(legacyData: any[]): SearchHistoryItem[] {
    return legacyData.map(item => {
      if (typeof item === 'string') {
        // 最简单的格式：只有查询字符串
        return {
          query: item,
          count: 1,
          firstSearch: new Date(),
          lastSearch: new Date(),
          isFavorite: false,
          tags: []
        }
      } else if (item.query && typeof item.query === 'string') {
        // 中等格式：包含基本信息
        return {
          query: item.query,
          count: item.count || 1,
          firstSearch: new Date(item.timestamp || Date.now()),
          lastSearch: new Date(item.timestamp || Date.now()),
          resultCount: item.resultCount,
          isFavorite: item.isFavorite || false,
          tags: item.tags || []
        }
      }
      return null
    }).filter(Boolean) as SearchHistoryItem[]
  }

  /**
   * 计算搜索频率趋势
   */
  private calculateSearchFrequency(history: SearchHistoryItem[]): Array<{ date: string; count: number }> {
    const frequency: Record<string, number> = {}
    const days = 7 // 最近7天

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      frequency[dateStr] = 0
    }

    history.forEach(item => {
      const dateStr = item.lastSearch.toISOString().split('T')[0]
      if (frequency.hasOwnProperty(dateStr)) {
        frequency[dateStr] += item.count
      }
    })

    return Object.entries(frequency).map(([date, count]) => ({ date, count }))
  }
}

/**
 * 创建搜索历史记录管理器实例
 */
export function createSearchHistoryManager(config?: Partial<SearchHistoryConfig>): SearchHistoryManager {
  return new LocalSearchHistoryManager(config)
}