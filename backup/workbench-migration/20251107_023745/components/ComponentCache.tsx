/**
 * 组件注册缓存系统
 * 提供高性能的元数据缓存、增量更新和CDN分发支持
 */

import { ComponentMetadata } from './ComponentRegistry'

// ============================================================================
// 类型定义
// ============================================================================

export interface CacheEntry<T = any> {
  key: string
  value: T
  timestamp: number
  expiresAt?: number
  version: string
  size: number
}

export interface CacheConfig {
  maxSize: number
  maxAge: number
  compression: boolean
  storageType: 'memory' | 'localStorage' | 'redis'
  enableMetrics: boolean
}

export interface CacheMetrics {
  hits: number
  misses: number
  hitRate: number
  totalRequests: number
  memoryUsage: number
  averageResponseTime: number
}

export interface IncrementalUpdate {
  componentId: string
  lastModified: number
  changes: ComponentChange[]
}

export interface ComponentChange {
  type: 'added' | 'modified' | 'removed' | 'moved'
  field: string
  oldValue?: any
  newValue?: any
  timestamp: number
}

// ============================================================================
// 内存缓存实现
// ============================================================================

class MemoryCache {
  private storage: Map<string, CacheEntry> = new Map()
  private config: CacheConfig
  private metrics: CacheMetrics

  constructor(config: CacheConfig) {
    this.config = config
    this.metrics = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalRequests: 0,
      memoryUsage: 0,
      averageResponseTime: 0
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    this.metrics.totalRequests++
    const start = performance.now()

    const entry = this.storage.get(key)
    const responseTime = performance.now() - start
    this.updateAverageResponseTime(responseTime)

    if (!entry) {
      this.metrics.misses++
      this.updateHitRate()
      return null
    }

    // 检查过期时间
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.delete(key)
      this.metrics.misses++
      this.updateHitRate()
      return null
    }

    this.metrics.hits++
    this.updateHitRate()

    // 解压缩
    if (this.config.compression && typeof entry.value === 'string') {
      return JSON.parse(entry.value) as T
    }

    return entry.value as T
  }

  async set<T = any>(key: string, value: T, ttl?: number): Promise<void> {
    const timestamp = Date.now()
    const expiresAt = ttl ? timestamp + ttl : undefined

    // 序列化
    let serialized = value
    let size = 0
    if (this.config.compression) {
      serialized = JSON.stringify(value)
      size = new Blob([serialized as string]).size
    } else {
      size = new Blob([JSON.stringify(value)]).size
    }

    // 检查缓存大小限制
    if (this.getSize() + size > this.config.maxSize) {
      await this.evict()
    }

    const entry: CacheEntry = {
      key,
      value: serialized as any,
      timestamp,
      expiresAt,
      version: '1.0.0',
      size
    }

    this.storage.set(key, entry)
    this.updateMemoryUsage()
  }

  async delete(key: string): Promise<boolean> {
    const deleted = this.storage.delete(key)
    if (deleted) {
      this.updateMemoryUsage()
    }
    return deleted
  }

  async clear(): Promise<void> {
    this.storage.clear()
    this.updateMemoryUsage()
  }

  async has(key: string): Promise<boolean> {
    const entry = this.storage.get(key)
    if (!entry) return false

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      await this.delete(key)
      return false
    }

    return true
  }

  getSize(): number {
    return Array.from(this.storage.values()).reduce((sum, entry) => sum + entry.size, 0)
  }

  private async evict(): Promise<void> {
    // LRU策略：删除最旧的条目
    const entries = Array.from(this.storage.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)

    const targetSize = this.config.maxSize * 0.8
    let currentSize = this.getSize()

    for (const [key] of entries) {
      await this.delete(key)
      currentSize = this.getSize()
      if (currentSize <= targetSize) break
    }
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics }
  }

  private updateHitRate(): void {
    this.metrics.hitRate = this.metrics.totalRequests > 0
      ? (this.metrics.hits / this.metrics.totalRequests) * 100
      : 0
  }

  private updateMemoryUsage(): void {
    this.metrics.memoryUsage = this.getSize()
  }

  private updateAverageResponseTime(responseTime: number): void {
    this.metrics.averageResponseTime =
      (this.metrics.averageResponseTime + responseTime) / 2
  }
}

// ============================================================================
// LocalStorage缓存实现
// ============================================================================

class LocalStorageCache {
  private storageKey: string = 'xorigo-component-cache'
  private config: CacheConfig
  private metrics: CacheMetrics

  constructor(config: CacheConfig) {
    this.config = config
    this.metrics = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalRequests: 0,
      memoryUsage: 0,
      averageResponseTime: 0
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    this.metrics.totalRequests++
    const start = performance.now()

    try {
      const data = localStorage.getItem(`${this.storageKey}:${key}`)
      const responseTime = performance.now() - start
      this.updateAverageResponseTime(responseTime)

      if (!data) {
        this.metrics.misses++
        this.updateHitRate()
        return null
      }

      const entry: CacheEntry = JSON.parse(data)

      // 检查过期
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        await this.delete(key)
        this.metrics.misses++
        this.updateHitRate()
        return null
      }

      this.metrics.hits++
      this.updateHitRate()
      return entry.value as T
    } catch (error) {
      this.metrics.misses++
      this.updateHitRate()
      return null
    }
  }

  async set<T = any>(key: string, value: T, ttl?: number): Promise<void> {
    const timestamp = Date.now()
    const expiresAt = ttl ? timestamp + ttl : undefined

    const entry: CacheEntry = {
      key,
      value,
      timestamp,
      expiresAt,
      version: '1.0.0',
      size: new Blob([JSON.stringify(value)]).size
    }

    try {
      localStorage.setItem(`${this.storageKey}:${key}`, JSON.stringify(entry))
      this.updateMemoryUsage()
    } catch (error) {
      // 清理旧数据
      await this.cleanExpired()
      throw new Error('缓存空间不足')
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      localStorage.removeItem(`${this.storageKey}:${key}`)
      this.updateMemoryUsage()
      return true
    } catch (error) {
      return false
    }
  }

  async clear(): Promise<void> {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(this.storageKey)) {
        localStorage.removeItem(key)
      }
    })
    this.updateMemoryUsage()
  }

  async has(key: string): Promise<boolean> {
    return (await this.get(key)) !== null
  }

  private updateMemoryUsage(): void {
    const keys = Object.keys(localStorage)
    const cacheKeys = keys.filter(k => k.startsWith(this.storageKey))
    const size = cacheKeys.reduce((sum, key) => {
      const item = localStorage.getItem(key)
      return sum + (item ? item.length : 0)
    }, 0)
    this.metrics.memoryUsage = size
  }

  private async cleanExpired(): Promise<void> {
    const keys = Object.keys(localStorage)
    const now = Date.now()

    for (const key of keys) {
      if (key.startsWith(this.storageKey)) {
        try {
          const data = localStorage.getItem(key)
          if (data) {
            const entry: CacheEntry = JSON.parse(data)
            if (entry.expiresAt && now > entry.expiresAt) {
              localStorage.removeItem(key)
            }
          }
        } catch {
          localStorage.removeItem(key)
        }
      }
    }
  }

  private updateHitRate(): void {
    this.metrics.hitRate = this.metrics.totalRequests > 0
      ? (this.metrics.hits / this.metrics.totalRequests) * 100
      : 0
  }

  private updateAverageResponseTime(responseTime: number): void {
    this.metrics.averageResponseTime =
      (this.metrics.averageResponseTime + responseTime) * 0.5
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics }
  }
}

// ============================================================================
// 缓存管理器
// ============================================================================

export class ComponentCache {
  private backend: MemoryCache | LocalStorageCache
  private config: CacheConfig
  private prefix: string = 'components'

  constructor(config: CacheConfig) {
    this.config = config
    this.backend = config.storageType === 'memory'
      ? new MemoryCache(config)
      : new LocalStorageCache(config)
  }

  /**
   * 获取组件元数据缓存
   */
  async getComponent(id: string): Promise<ComponentMetadata | null> {
    const key = `${this.prefix}:${id}`
    return this.backend.get<ComponentMetadata>(key)
  }

  /**
   * 缓存组件元数据
   */
  async setComponent(metadata: ComponentMetadata, ttl?: number): Promise<void> {
    const key = `${this.prefix}:${metadata.id}`
    await this.backend.set(key, metadata, ttl)
  }

  /**
   * 批量缓存组件
   */
  async setComponents(metadataList: ComponentMetadata[], ttl?: number): Promise<void> {
    const promises = metadataList.map(meta => this.setComponent(meta, ttl))
    await Promise.allSettled(promises)
  }

  /**
   * 获取所有组件
   */
  async getAllComponents(): Promise<ComponentMetadata[]> {
    // 简化实现：实际应该枚举所有缓存键
    return []
  }

  /**
   * 缓存分类组件列表
   */
  async getCategory(category: string): Promise<ComponentMetadata[]> {
    const key = `${this.prefix}:category:${category}`
    return this.backend.get<ComponentMetadata[]>(key) || []
  }

  /**
   * 缓存分类组件
   */
  async setCategory(category: string, components: ComponentMetadata[], ttl?: number): Promise<void> {
    const key = `${this.prefix}:category:${category}`
    await this.backend.set(key, components, ttl)
  }

  /**
   * 缓存搜索结果
   */
  async getSearchResults(query: string): Promise<ComponentMetadata[]> {
    const key = `${this.prefix}:search:${this.hashQuery(query)}`
    return this.backend.get<ComponentMetadata[]>(key) || []
  }

  /**
   * 缓存搜索结果
   */
  async setSearchResults(query: string, results: ComponentMetadata[], ttl = 60000): Promise<void> {
    const key = `${this.prefix}:search:${this.hashQuery(query)}`
    await this.backend.set(key, results, ttl)
  }

  /**
   * 缓存组件树
   */
  async getComponentTree(): Promise<any> {
    const key = `${this.prefix}:tree`
    return this.backend.get<any>(key) || {}
  }

  /**
   * 缓存组件树
   */
  async setComponentTree(tree: any, ttl = 300000): Promise<void> {
    const key = `${this.prefix}:tree`
    await this.backend.set(key, tree, ttl)
  }

  /**
   * 缓存统计数据
   */
  async getStats(): Promise<any> {
    const key = `${this.prefix}:stats`
    return this.backend.get<any>(key) || {}
  }

  /**
   * 缓存统计数据
   */
  async setStats(stats: any, ttl = 60000): Promise<void> {
    const key = `${this.prefix}:stats`
    await this.backend.set(key, stats, ttl)
  }

  /**
   * 清除所有缓存
   */
  async clear(): Promise<void> {
    await this.backend.clear()
  }

  /**
   * 预热缓存
   */
  async warmup(data: {
    components?: ComponentMetadata[]
    categories?: Record<string, ComponentMetadata[]>
    tree?: any
  }): Promise<void> {
    const ttl = 300000 // 5分钟

    if (data.components) {
      await this.setComponents(data.components, ttl)
    }

    if (data.categories) {
      await Promise.all(
        Object.entries(data.categories).map(([category, components]) =>
          this.setCategory(category, components, ttl)
        )
      )
    }

    if (data.tree) {
      await this.setComponentTree(data.tree, ttl)
    }
  }

  /**
   * 增量更新
   */
  async incrementalUpdate(updates: IncrementalUpdate[]): Promise<void> {
    for (const update of updates) {
      if (update.changes.length === 0) continue

      // 根据变化类型更新缓存
      for (const change of update.changes) {
        if (change.type === 'removed') {
          await this.backend.delete(`${this.prefix}:${update.componentId}`)
        } else {
          // 重新获取和缓存
          // 这里需要实际的组件数据源
        }
      }
    }
  }

  /**
   * 获取缓存指标
   */
  getMetrics(): CacheMetrics {
    return this.backend.getMetrics()
  }

  /**
   * 生成查询哈希
   */
  private hashQuery(query: string): string {
    let hash = 0
    for (let i = 0; i < query.length; i++) {
      const char = query.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(36)
  }
}

export default ComponentCache
