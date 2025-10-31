/**
 * 🗄️ 配方缓存和热更新管理器
 *
 * 提供高性能的多层缓存策略、实时热更新和版本管理
 * 支持本地存储、IndexedDB和WebSocket实时同步
 */

import { DynamicRecipe, ValidationResult } from './seven-axis-recipe-engine'
import { SecurityCheckResult } from './recipe-validator'

// ============================================================================
// 缓存类型定义
// ============================================================================

/**
 * 缓存层级
 */
export enum CacheLevel {
  MEMORY = 'memory',
  LOCAL_STORAGE = 'localStorage',
  INDEXED_DB = 'indexedDB',
  NETWORK = 'network'
}

/**
 * 缓存项
 */
export interface CacheItem {
  /** 配方数据 */
  recipe: DynamicRecipe
  /** 验证结果 */
  validation?: ValidationResult
  /** 安全检查结果 */
  security?: SecurityCheckResult
  /** 缓存层级 */
  level: CacheLevel
  /** 创建时间 */
  createdAt: number
  /** 最后访问时间 */
  lastAccessed: number
  /** 过期时间 */
  expiresAt: number
  /** 访问次数 */
  hitCount: number
  /** 版本号 */
  version: string
  /** ETag或校验和 */
  etag?: string
  /** 数据大小 */
  size: number
}

/**
 * 缓存配置
 */
export interface CacheConfig {
  /** 内存缓存最大大小 */
  memoryMaxSize: number
  /** 内存缓存过期时间 */
  memoryExpirationMs: number
  /** 本地存储过期时间 */
  localStorageExpirationMs: number
  /** IndexedDB过期时间 */
  indexedDBExpirationMs: number
  /** 是否启用压缩 */
  enableCompression: boolean
  /** 是否启用预加载 */
  enablePreloading: boolean
  /** 预加载的配方ID列表 */
  preloadRecipes: string[]
}

/**
 * 热更新事件
 */
export interface HotUpdateEvent {
  type: 'recipe-updated' | 'recipe-deleted' | 'recipe-created' | 'batch-update'
  recipeId?: string
  recipeIds?: string[]
  data: any
  timestamp: number
  source: 'websocket' | 'polling' | 'manual'
}

/**
 * 同步状态
 */
export interface SyncStatus {
  isOnline: boolean
  lastSyncAt: number
  pendingUpdates: string[]
  conflicts: RecipeConflict[]
  syncInProgress: boolean
}

/**
 * 配方冲突
 */
export interface RecipeConflict {
  recipeId: string
  localVersion: string
  remoteVersion: string
  localRecipe: DynamicRecipe
  remoteRecipe: DynamicRecipe
  conflictType: 'version' | 'content' | 'deleted'
}

// ============================================================================
// 多层缓存管理器
// ============================================================================

/**
 * 高性能多层缓存管理器
 *
 * 特性：
 * - 四层缓存架构（内存 → localStorage → IndexedDB → 网络）
 * - 智能预加载和预取
 * - 压缩存储
 * - 实时热更新
 * - 版本冲突解决
 */
export class RecipeCacheManager {
  private memoryCache: Map<string, CacheItem>
  private config: CacheConfig
  private db: IDBDatabase | null
  private websocket: WebSocket | null
  private syncStatus: SyncStatus
  private updateListeners: Set<(event: HotUpdateEvent) => void>
  private compressionWorker: Worker | null
  private prefetchQueue: Set<string>
  private isInitialized: boolean

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      memoryMaxSize: 50,
      memoryExpirationMs: 300000, // 5分钟
      localStorageExpirationMs: 3600000, // 1小时
      indexedDBExpirationMs: 86400000, // 24小时
      enableCompression: true,
      enablePreloading: true,
      preloadRecipes: ['corporate-blue', 'dark-professional'],
      ...config
    }

    this.memoryCache = new Map()
    this.db = null
    this.websocket = null
    this.compressionWorker = null
    this.prefetchQueue = new Set()
    this.updateListeners = new Set()
    this.isInitialized = false

    this.syncStatus = {
      isOnline: navigator.onLine,
      lastSyncAt: 0,
      pendingUpdates: [],
      conflicts: [],
      syncInProgress: false
    }

    this.initialize()
  }

  // ========================================================================
  // 初始化和生命周期管理
  // ========================================================================

  /**
   * 初始化缓存管理器
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) return

    const startTime = performance.now()

    try {
      // 初始化IndexedDB
      await this.initializeIndexedDB()

      // 初始化WebSocket连接
      await this.initializeWebSocket()

      // 初始化压缩Worker
      if (this.config.enableCompression) {
        await this.initializeCompressionWorker()
      }

      // 恢复内存缓存
      await this.restoreMemoryCache()

      // 预加载核心配方
      if (this.config.enablePreloading) {
        await this.preloadRecipes()
      }

      // 启动缓存清理
      this.startCacheCleanup()

      // 设置网络状态监听
      this.setupNetworkListeners()

      this.isInitialized = true

      const endTime = performance.now()
      console.log(`🗄️ 缓存管理器初始化完成 (${(endTime - startTime).toFixed(2)}ms)`)

    } catch (error) {
      console.error('缓存管理器初始化失败:', error)
      throw error
    }
  }

  /**
   * 获取配方（多层缓存查找）
   */
  async getRecipe(recipeId: string): Promise<DynamicRecipe | null> {
    const startTime = performance.now()

    try {
      // 1. 内存缓存查找
      const memoryItem = this.memoryCache.get(recipeId)
      if (memoryItem && !this.isExpired(memoryItem)) {
        this.updateCacheItem(memoryItem)
        return memoryItem.recipe
      }

      // 2. localStorage查找
      const localStorageItem = await this.getFromLocalStorage(recipeId)
      if (localStorageItem && !this.isExpired(localStorageItem)) {
        // 提升到内存缓存
        await this.promoteToMemory(localStorageItem)
        return localStorageItem.recipe
      }

      // 3. IndexedDB查找
      const indexedDBItem = await this.getFromIndexedDB(recipeId)
      if (indexedDBItem && !this.isExpired(indexedDBItem)) {
        // 提升到上层缓存
        await this.promoteToUpperCaches(indexedDBItem)
        return indexedDBItem.recipe
      }

      // 4. 网络加载
      const networkItem = await this.fetchFromNetwork(recipeId)
      if (networkItem) {
        // 存储到所有缓存层
        await this.storeToAllCaches(networkItem)
        return networkItem.recipe
      }

      return null

    } finally {
      const endTime = performance.now()
      console.log(`🔍 配方查找完成: ${recipeId} (${(endTime - startTime).toFixed(2)}ms)`)
    }
  }

  /**
   * 存储配方到所有缓存层
   */
  async setRecipe(
    recipe: DynamicRecipe,
    options: CacheOptions = {}
  ): Promise<void> {
    const cacheItem: CacheItem = {
      recipe,
      level: CacheLevel.MEMORY,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      expiresAt: Date.now() + (options.expirationMs || this.config.memoryExpirationMs),
      hitCount: 0,
      version: recipe.version,
      etag: options.etag,
      size: this.estimateSize(recipe)
    }

    // 存储到内存缓存
    await this.setToMemoryCache(cacheItem)

    // 根据选项存储到其他层
    if (options.persistToLocalStorage !== false) {
      await this.setToLocalStorage(cacheItem)
    }

    if (options.persistToIndexedDB !== false) {
      await this.setToIndexedDB(cacheItem)
    }

    // 触发热更新
    if (options.triggerHotUpdate !== false) {
      this.triggerHotUpdate({
        type: 'recipe-updated',
        recipeId: recipe.id,
        data: recipe,
        timestamp: Date.now(),
        source: 'manual'
      })
    }
  }

  /**
   * 删除配方
   */
  async deleteRecipe(recipeId: string): Promise<void> {
    // 从所有缓存层删除
    this.memoryCache.delete(recipeId)
    await this.deleteFromLocalStorage(recipeId)
    await this.deleteFromIndexedDB(recipeId)

    // 触发热更新
    this.triggerHotUpdate({
      type: 'recipe-deleted',
      recipeId,
      data: { recipeId },
      timestamp: Date.now(),
      source: 'manual'
    })
  }

  // ========================================================================
  // 内存缓存管理
  // ========================================================================

  /**
   * 设置内存缓存
   */
  private async setToMemoryCache(item: CacheItem): Promise<void> {
    // 检查缓存大小限制
    if (this.memoryCache.size >= this.config.memoryMaxSize) {
      await this.evictLeastUsedMemoryItem()
    }

    this.memoryCache.set(item.recipe.id, item)
  }

  /**
   * 更新缓存项
   */
  private updateCacheItem(item: CacheItem): void {
    item.lastAccessed = Date.now()
    item.hitCount++
  }

  /**
   * 驱逐最少使用的内存项
   */
  private async evictLeastUsedMemoryItem(): Promise<void> {
    let leastUsedId: string | null = null
    let leastUsedItem: CacheItem | null = null

    for (const [id, item] of this.memoryCache) {
      if (!leastUsedItem ||
          item.hitCount < leastUsedItem.hitCount ||
          (item.hitCount === leastUsedItem.hitCount && item.lastAccessed < leastUsedItem.lastAccessed)) {
        leastUsedId = id
        leastUsedItem = item
      }
    }

    if (leastUsedId && leastUsedItem) {
      // 在驱逐前保存到localStorage
      await this.setToLocalStorage(leastUsedItem)
      this.memoryCache.delete(leastUsedId)
    }
  }

  /**
   * 恢复内存缓存
   */
  private async restoreMemoryCache(): Promise<void> {
    try {
      const keys = Object.keys(localStorage)
      const recipeKeys = keys.filter(key => key.startsWith('xorigo-recipe-'))

      for (const key of recipeKeys.slice(0, this.config.memoryMaxSize)) {
        try {
          const data = localStorage.getItem(key)
          if (data) {
            const item = JSON.parse(data) as CacheItem
            if (!this.isExpired(item)) {
              this.memoryCache.set(item.recipe.id, item)
            }
          }
        } catch (error) {
          console.warn(`恢复内存缓存失败: ${key}`, error)
        }
      }

      console.log(`💾 恢复内存缓存: ${this.memoryCache.size} 个配方`)
    } catch (error) {
      console.warn('恢复内存缓存失败:', error)
    }
  }

  // ========================================================================
  // localStorage 缓存管理
  // ========================================================================

  /**
   * 从localStorage获取
   */
  private async getFromLocalStorage(recipeId: string): Promise<CacheItem | null> {
    try {
      const key = `xorigo-recipe-${recipeId}`
      const data = localStorage.getItem(key)

      if (!data) return null

      const item = JSON.parse(data) as CacheItem
      item.level = CacheLevel.LOCAL_STORAGE

      return item
    } catch (error) {
      console.warn(`localStorage读取失败: ${recipeId}`, error)
      return null
    }
  }

  /**
   * 设置localStorage
   */
  private async setToLocalStorage(item: CacheItem): Promise<void> {
    try {
      const key = `xorigo-recipe-${item.recipe.id}`
      const data = JSON.stringify(item)

      // 检查localStorage配额
      if (data.length > 4 * 1024 * 1024) { // 4MB限制
        console.warn(`配方过大，跳过localStorage存储: ${item.recipe.id}`)
        return
      }

      localStorage.setItem(key, data)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        // 清理旧数据
        await this.cleanupLocalStorage()
        // 重试一次
        try {
          const key = `xorigo-recipe-${item.recipe.id}`
          localStorage.setItem(key, JSON.stringify(item))
        } catch (retryError) {
          console.warn(`localStorage存储失败: ${item.recipe.id}`, retryError)
        }
      } else {
        console.warn(`localStorage存储失败: ${item.recipe.id}`, error)
      }
    }
  }

  /**
   * 从localStorage删除
   */
  private async deleteFromLocalStorage(recipeId: string): Promise<void> {
    try {
      const key = `xorigo-recipe-${recipeId}`
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`localStorage删除失败: ${recipeId}`, error)
    }
  }

  /**
   * 清理localStorage
   */
  private async cleanupLocalStorage(): Promise<void> {
    try {
      const keys = Object.keys(localStorage)
      const recipeKeys = keys.filter(key => key.startsWith('xorigo-recipe-'))

      // 按过期时间排序，删除最旧的
      const items: Array<{ key: string; expiresAt: number }> = []

      for (const key of recipeKeys) {
        try {
          const data = localStorage.getItem(key)
          if (data) {
            const item = JSON.parse(data) as CacheItem
            items.push({ key, expiresAt: item.expiresAt })
          }
        } catch (error) {
          // 删除损坏的项
          localStorage.removeItem(key)
        }
      }

      items.sort((a, b) => a.expiresAt - b.expiresAt)

      // 删除最旧的25%
      const toDelete = Math.floor(items.length * 0.25)
      for (let i = 0; i < toDelete; i++) {
        localStorage.removeItem(items[i].key)
      }

      console.log(`🧹 localStorage清理完成，删除 ${toDelete} 个旧配方`)
    } catch (error) {
      console.warn('localStorage清理失败:', error)
    }
  }

  // ========================================================================
  // IndexedDB 缓存管理
  // ========================================================================

  /**
   * 初始化IndexedDB
   */
  private async initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('XorigoRecipeCache', 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建配方存储
        if (!db.objectStoreNames.contains('recipes')) {
          const recipeStore = db.createObjectStore('recipes', { keyPath: 'id' })
          recipeStore.createIndex('expiresAt', 'expiresAt', { unique: false })
          recipeStore.createIndex('lastAccessed', 'lastAccessed', { unique: false })
          recipeStore.createIndex('version', 'version', { unique: false })
        }

        // 创建同步状态存储
        if (!db.objectStoreNames.contains('syncStatus')) {
          db.createObjectStore('syncStatus', { keyPath: 'id' })
        }
      }
    })
  }

  /**
   * 从IndexedDB获取
   */
  private async getFromIndexedDB(recipeId: string): Promise<CacheItem | null> {
    if (!this.db) return null

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['recipes'], 'readonly')
      const store = transaction.objectStore('recipes')
      const request = store.get(recipeId)

      request.onsuccess = () => {
        const item = request.result
        if (item) {
          item.level = CacheLevel.INDEXED_DB
          resolve(item)
        } else {
          resolve(null)
        }
      }

      request.onerror = () => {
        console.warn(`IndexedDB读取失败: ${recipeId}`, request.error)
        resolve(null)
      }
    })
  }

  /**
   * 设置IndexedDB
   */
  private async setToIndexedDB(item: CacheItem): Promise<void> {
    if (!this.db) return

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['recipes'], 'readwrite')
      const store = transaction.objectStore('recipes')
      const request = store.put(item)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 从IndexedDB删除
   */
  private async deleteFromIndexedDB(recipeId: string): Promise<void> {
    if (!this.db) return

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['recipes'], 'readwrite')
      const store = transaction.objectStore('recipes')
      const request = store.delete(recipeId)

      request.onsuccess = () => resolve()
      request.onerror = () => {
        console.warn(`IndexedDB删除失败: ${recipeId}`, request.error)
        resolve()
      }
    })
  }

  // ========================================================================
  // 网络加载和同步
  // ========================================================================

  /**
   * 从网络获取配方
   */
  private async fetchFromNetwork(recipeId: string): Promise<CacheItem | null> {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`配方不存在: ${recipeId}`)
        }
        return null
      }

      const recipe = await response.json()
      const etag = response.headers.get('ETag')

      return {
        recipe,
        level: CacheLevel.NETWORK,
        createdAt: Date.now(),
        lastAccessed: Date.now(),
        expiresAt: Date.now() + this.config.indexedDBExpirationMs,
        hitCount: 0,
        version: recipe.version,
        etag,
        size: this.estimateSize(recipe)
      }
    } catch (error) {
      console.warn(`网络加载失败: ${recipeId}`, error)
      return null
    }
  }

  /**
   * 提升到内存缓存
   */
  private async promoteToMemory(item: CacheItem): Promise<void> {
    const memoryItem: CacheItem = {
      ...item,
      level: CacheLevel.MEMORY,
      expiresAt: Date.now() + this.config.memoryExpirationMs
    }

    await this.setToMemoryCache(memoryItem)
  }

  /**
   * 提升到上层缓存
   */
  private async promoteToUpperCaches(item: CacheItem): Promise<void> {
    await this.setToLocalStorage(item)
    await this.promoteToMemory(item)
  }

  /**
   * 存储到所有缓存层
   */
  private async storeToAllCaches(item: CacheItem): Promise<void> {
    await Promise.all([
      this.setToMemoryCache(item),
      this.setToLocalStorage(item),
      this.setToIndexedDB(item)
    ])
  }

  // ========================================================================
  // 热更新系统
  // ========================================================================

  /**
   * 初始化WebSocket连接
   */
  private async initializeWebSocket(): Promise<void> {
    if (typeof WebSocket === 'undefined') return

    try {
      const wsUrl = this.getWebSocketUrl()
      this.websocket = new WebSocket(wsUrl)

      this.websocket.onopen = () => {
        console.log('🔌 WebSocket连接已建立')
        this.subscribeToUpdates()
      }

      this.websocket.onmessage = (event) => {
        try {
          const updateEvent: HotUpdateEvent = JSON.parse(event.data)
          this.handleHotUpdate(updateEvent)
        } catch (error) {
          console.warn('热更新消息解析失败:', error)
        }
      }

      this.websocket.onclose = () => {
        console.log('🔌 WebSocket连接已关闭')
        // 尝试重连
        setTimeout(() => this.initializeWebSocket(), 5000)
      }

      this.websocket.onerror = (error) => {
        console.warn('WebSocket错误:', error)
      }

    } catch (error) {
      console.warn('WebSocket初始化失败:', error)
    }
  }

  /**
   * 获取WebSocket URL
   */
  private getWebSocketUrl(): string {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = location.host
    return `${protocol}//${host}/api/recipes/updates`
  }

  /**
   * 订阅更新
   */
  private subscribeToUpdates(): void {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) return

    const message = JSON.stringify({
      type: 'subscribe',
      filters: {
        categories: ['all'],
        version: '>=1.0.0'
      }
    })

    this.websocket.send(message)
  }

  /**
   * 处理热更新
   */
  private async handleHotUpdate(event: HotUpdateEvent): Promise<void> {
    console.log('🔥 收到热更新:', event)

    switch (event.type) {
      case 'recipe-updated':
        if (event.recipeId && event.data) {
          // 检查版本冲突
          const existingItem = this.memoryCache.get(event.recipeId)
          if (existingItem && existingItem.version !== event.data.version) {
            await this.handleVersionConflict(event.recipeId, existingItem.recipe, event.data)
          } else {
            await this.setRecipe(event.data, { triggerHotUpdate: false })
          }
        }
        break

      case 'recipe-deleted':
        if (event.recipeId) {
          await this.deleteRecipe(event.recipeId)
        }
        break

      case 'batch-update':
        if (event.recipeIds && Array.isArray(event.recipeIds)) {
          await this.handleBatchUpdate(event.recipeIds, event.data)
        }
        break
    }

    // 通知监听器
    this.notifyUpdateListeners(event)
  }

  /**
   * 触发热更新
   */
  private triggerHotUpdate(event: HotUpdateEvent): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      try {
        this.websocket.send(JSON.stringify(event))
      } catch (error) {
        console.warn('发送热更新失败:', error)
      }
    }

    // 本地通知
    this.notifyUpdateListeners(event)
  }

  /**
   * 处理版本冲突
   */
  private async handleVersionConflict(
    recipeId: string,
    localRecipe: DynamicRecipe,
    remoteRecipe: DynamicRecipe
  ): Promise<void> {
    const conflict: RecipeConflict = {
      recipeId,
      localVersion: localRecipe.version,
      remoteVersion: remoteRecipe.version,
      localRecipe,
      remoteRecipe,
      conflictType: 'version'
    }

    this.syncStatus.conflicts.push(conflict)

    // 暂时使用远程版本，但标记冲突
    await this.setRecipe(remoteRecipe, { triggerHotUpdate: false })

    console.warn(`版本冲突: ${recipeId} (本地: ${localRecipe.version}, 远程: ${remoteRecipe.version})`)
  }

  /**
   * 处理批量更新
   */
  private async handleBatchUpdate(recipeIds: string[], data: any): Promise<void> {
    for (const recipeId of recipeIds) {
      try {
        const recipe = await this.fetchFromNetwork(recipeId)
        if (recipe) {
          await this.storeToAllCaches(recipe)
        }
      } catch (error) {
        console.warn(`批量更新失败: ${recipeId}`, error)
      }
    }
  }

  /**
   * 通知更新监听器
   */
  private notifyUpdateListeners(event: HotUpdateEvent): void {
    this.updateListeners.forEach(listener => {
      try {
        listener(event)
      } catch (error) {
        console.error('更新监听器执行失败:', error)
      }
    })
  }

  // ========================================================================
  // 预加载和预取
  // ========================================================================

  /**
   * 预加载配方
   */
  private async preloadRecipes(): Promise<void> {
    const promises = this.config.preloadRecipes.map(async (recipeId) => {
      try {
        await this.getRecipe(recipeId)
        console.log(`📦 预加载完成: ${recipeId}`)
      } catch (error) {
        console.warn(`预加载失败: ${recipeId}`, error)
      }
    })

    await Promise.allSettled(promises)
  }

  /**
   * 预取配方
   */
  async prefetchRecipe(recipeId: string): Promise<void> {
    if (this.prefetchQueue.has(recipeId)) return

    this.prefetchQueue.add(recipeId)

    try {
      // 低优先级获取
      setTimeout(async () => {
        try {
          await this.getRecipe(recipeId)
          console.log(`🚀 预取完成: ${recipeId}`)
        } catch (error) {
          console.warn(`预取失败: ${recipeId}`, error)
        } finally {
          this.prefetchQueue.delete(recipeId)
        }
      }, 1000)
    } catch (error) {
      this.prefetchQueue.delete(recipeId)
    }
  }

  // ========================================================================
  // 缓存维护和清理
  // ========================================================================

  /**
   * 启动缓存清理
   */
  private startCacheCleanup(): void {
    // 每分钟清理过期项
    setInterval(() => {
      this.cleanupExpiredItems()
    }, 60000)

    // 每5分钟清理IndexedDB
    setInterval(() => {
      this.cleanupIndexedDB()
    }, 300000)
  }

  /**
   * 清理过期项
   */
  private cleanupExpiredItems(): void {
    const now = Date.now()
    let cleanedCount = 0

    // 清理内存缓存
    for (const [id, item] of this.memoryCache) {
      if (item.expiresAt < now) {
        this.memoryCache.delete(id)
        cleanedCount++
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 清理过期缓存项: ${cleanedCount} 个`)
    }
  }

  /**
   * 清理IndexedDB
   */
  private async cleanupIndexedDB(): Promise<void> {
    if (!this.db) return

    const now = Date.now()
    const transaction = this.db.transaction(['recipes'], 'readwrite')
    const store = transaction.objectStore('recipes')
    const index = store.index('expiresAt')
    const request = index.openCursor(IDBKeyRange.upperBound(now))

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result
      if (cursor) {
        cursor.delete()
        cursor.continue()
      }
    }
  }

  /**
   * 检查项目是否过期
   */
  private isExpired(item: CacheItem): boolean {
    return item.expiresAt < Date.now()
  }

  /**
   * 估算对象大小
   */
  private estimateSize(obj: any): number {
    return JSON.stringify(obj).length * 2 // 粗略估算（UTF-16）
  }

  // ========================================================================
  // 网络状态管理
  // ========================================================================

  /**
   * 设置网络状态监听
   */
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.syncStatus.isOnline = true
      console.log('🌐 网络已连接')
      this.startSync()
    })

    window.addEventListener('offline', () => {
      this.syncStatus.isOnline = false
      console.log('📵 网络已断开')
    })
  }

  /**
   * 开始同步
   */
  private async startSync(): Promise<void> {
    if (this.syncStatus.syncInProgress || !this.syncStatus.isOnline) return

    this.syncStatus.syncInProgress = true

    try {
      // 同步待处理的更新
      for (const recipeId of this.syncStatus.pendingUpdates) {
        try {
          await this.syncRecipe(recipeId)
        } catch (error) {
          console.warn(`同步失败: ${recipeId}`, error)
        }
      }

      this.syncStatus.lastSyncAt = Date.now()
      this.syncStatus.pendingUpdates = []

    } finally {
      this.syncStatus.syncInProgress = false
    }
  }

  /**
   * 同步配方
   */
  private async syncRecipe(recipeId: string): Promise<void> {
    const localItem = this.memoryCache.get(recipeId) ||
                      await this.getFromLocalStorage(recipeId) ||
                      await this.getFromIndexedDB(recipeId)

    if (!localItem) return

    try {
      const response = await fetch(`/api/recipes/${recipeId}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'If-None-Match': localItem.etag || ''
        }
      })

      if (response.status === 304) {
        // 未修改，无需更新
        return
      }

      if (response.ok) {
        const remoteRecipe = await response.json()
        await this.setRecipe(remoteRecipe, { triggerHotUpdate: false })
      }
    } catch (error) {
      console.warn(`同步失败: ${recipeId}`, error)
    }
  }

  // ========================================================================
  // 压缩支持
  // ========================================================================

  /**
   * 初始化压缩Worker
   */
  private async initializeCompressionWorker(): Promise<void> {
    // 压缩Worker初始化逻辑
    // 暂时跳过实现
    console.log('🗜️ 压缩Worker初始化跳过（暂未实现）')
  }

  // ========================================================================
  // 公共API方法
  // ========================================================================

  /**
   * 订阅热更新事件
   */
  subscribe(listener: (event: HotUpdateEvent) => void): () => void {
    this.updateListeners.add(listener)

    return () => {
      this.updateListeners.delete(listener)
    }
  }

  /**
   * 获取缓存统计
   */
  getCacheStats(): CacheStats {
    const memoryItems = Array.from(this.memoryCache.values())
    const totalMemorySize = memoryItems.reduce((sum, item) => sum + item.size, 0)

    return {
      memory: {
        size: this.memoryCache.size,
        totalSize: totalMemorySize,
        hitCount: memoryItems.reduce((sum, item) => sum + item.hitCount, 0)
      },
      sync: this.syncStatus,
      lastCleanup: Date.now()
    }
  }

  /**
   * 清空所有缓存
   */
  async clearAllCaches(): Promise<void> {
    // 清空内存缓存
    this.memoryCache.clear()

    // 清空localStorage
    const keys = Object.keys(localStorage)
    const recipeKeys = keys.filter(key => key.startsWith('xorigo-recipe-'))
    recipeKeys.forEach(key => localStorage.removeItem(key))

    // 清空IndexedDB
    if (this.db) {
      const transaction = this.db.transaction(['recipes'], 'readwrite')
      const store = transaction.objectStore('recipes')
      store.clear()
    }

    console.log('🗑️ 所有缓存已清空')
  }

  /**
   * 解决版本冲突
   */
  async resolveConflict(recipeId: string, resolution: 'local' | 'remote' | 'merge'): Promise<void> {
    const conflictIndex = this.syncStatus.conflicts.findIndex(c => c.recipeId === recipeId)
    if (conflictIndex === -1) return

    const conflict = this.syncStatus.conflicts[conflictIndex]

    switch (resolution) {
      case 'local':
        // 使用本地版本，标记为已解决
        await this.setRecipe(conflict.localRecipe, { triggerHotUpdate: true })
        break

      case 'remote':
        // 使用远程版本
        await this.setRecipe(conflict.remoteRecipe, { triggerHotUpdate: true })
        break

      case 'merge':
        // 简单合并：使用远程版本但保留本地自定义令牌
        const mergedRecipe = {
          ...conflict.remoteRecipe,
          customTokens: {
            ...conflict.remoteRecipe.customTokens,
            ...conflict.localRecipe.customTokens
          }
        }
        await this.setRecipe(mergedRecipe, { triggerHotUpdate: true })
        break
    }

    // 移除冲突
    this.syncStatus.conflicts.splice(conflictIndex, 1)
  }
}

// ============================================================================
// 类型定义
// ============================================================================

export interface CacheOptions {
  /** 过期时间（毫秒） */
  expirationMs?: number
  /** ETag */
  etag?: string
  /** 是否存储到localStorage */
  persistToLocalStorage?: boolean
  /** 是否存储到IndexedDB */
  persistToIndexedDB?: boolean
  /** 是否触发热更新 */
  triggerHotUpdate?: boolean
}

export interface CacheStats {
  memory: {
    size: number
    totalSize: number
    hitCount: number
  }
  sync: SyncStatus
  lastCleanup: number
}

// ============================================================================
// 默认实例和便捷函数
// ============================================================================

/**
 * 默认缓存管理器实例
 */
export const recipeCacheManager = new RecipeCacheManager({
  memoryMaxSize: 100,
  memoryExpirationMs: 600000, // 10分钟
  localStorageExpirationMs: 3600000, // 1小时
  indexedDBExpirationMs: 86400000, // 24小时
  enableCompression: true,
  enablePreloading: true,
  preloadRecipes: ['corporate-blue', 'dark-professional', 'minimal-light']
})

/**
 * 便捷函数
 */
export const getCachedRecipe = (recipeId: string) => recipeCacheManager.getRecipe(recipeId)
export const setCachedRecipe = (recipe: DynamicRecipe, options?: CacheOptions) =>
  recipeCacheManager.setRecipe(recipe, options)
export const deleteCachedRecipe = (recipeId: string) => recipeCacheManager.deleteRecipe(recipeId)
export const subscribeToRecipeUpdates = (listener: (event: HotUpdateEvent) => void) =>
  recipeCacheManager.subscribe(listener)

export default {
  RecipeCacheManager,
  recipeCacheManager,
  getCachedRecipe,
  setCachedRecipe,
  deleteCachedRecipe,
  subscribeToRecipeUpdates
}