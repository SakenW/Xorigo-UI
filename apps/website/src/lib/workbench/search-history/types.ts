/**
 * 搜索历史记录类型定义
 */

export interface SearchHistoryItem {
  /** 搜索查询 */
  query: string
  /** 搜索次数 */
  count: number
  /** 首次搜索时间 */
  firstSearch: Date
  /** 最后搜索时间 */
  lastSearch: Date
  /** 平均搜索时长(ms) */
  averageDuration?: number
  /** 搜索结果数量 */
  resultCount?: number
  /** 是否收藏 */
  isFavorite?: boolean
  /** 搜索标签 */
  tags?: string[]
  /** 搜索上下文 */
  context?: {
    category?: string
    filters?: string[]
    sortBy?: string
  }
}

export interface SearchHistoryStats {
  /** 总搜索次数 */
  totalSearches: number
  /** 独特查询数量 */
  uniqueQueries: number
  /** 最热门的搜索 */
  popularSearches: Array<{ query: string; count: number }>
  /** 最近搜索 */
  recentSearches: SearchHistoryItem[]
  /** 搜索频率趋势 */
  searchFrequency: Array<{ date: string; count: number }>
  /** 平均搜索时长 */
  averageSearchDuration: number
}

export interface SearchHistoryConfig {
  /** 最大历史记录数量 */
  maxHistoryItems: number
  /** 数据过期时间(天) */
  expirationDays: number
  /** 是否启用持久化 */
  enablePersistence: boolean
  /** 存储键名 */
  storageKey: string
  /** 是否收集统计数据 */
  enableStats: boolean
}

export interface SearchHistoryManager {
  /** 添加搜索记录 */
  addSearch(query: string, resultCount?: number, duration?: number, context?: any): void
  /** 获取历史记录 */
  getHistory(limit?: number): SearchHistoryItem[]
  /** 搜索历史记录 */
  searchHistory(query: string): SearchHistoryItem[]
  /** 删除历史记录 */
  removeHistory(query: string): boolean
  /** 清空历史记录 */
  clearHistory(): void
  /** 获取统计数据 */
  getStats(): SearchHistoryStats
  /** 收藏/取消收藏 */
  toggleFavorite(query: string): boolean
  /** 获取收藏的搜索 */
  getFavorites(): SearchHistoryItem[]
  /** 导出历史记录 */
  exportHistory(): string
  /** 导入历史记录 */
  importHistory(data: string): boolean
  /** 同步到服务器 */
  syncToServer?(): Promise<void>
  /** 从服务器同步 */
  syncFromServer?(): Promise<void>
}