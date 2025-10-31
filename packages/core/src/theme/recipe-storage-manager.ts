/**
 * 📚 配方存储和版本管理系统
 *
 * 提供完整的配方生命周期管理、版本控制和持久化存储
 * 支持语义化版本、增量更新、配方回滚和历史追踪
 */

import { DynamicRecipe, ValidationResult } from './seven-axis-recipe-engine'
import { SecurityCheckResult } from './recipe-validator'
import { HotUpdateEvent } from './recipe-cache-manager'

// ============================================================================
// 版本管理类型定义
// ============================================================================

/**
 * 语义化版本
 */
export interface SemanticVersion {
  major: number
  minor: number
  patch: number
  prerelease?: string
  build?: string
}

/**
 * 配方版本信息
 */
export interface RecipeVersion {
  /** 版本号 */
  version: string
  /** 版本标签 */
  tag: 'stable' | 'beta' | 'alpha' | 'dev' | 'hotfix'
  /** 发布说明 */
  changelog: string
  /** 发布时间 */
  releasedAt: number
  /** 配方数据 */
  recipe: DynamicRecipe
  /** 版本差异 */
  diff?: RecipeDiff
  /** 依赖版本 */
  dependencies: Record<string, string>
  /** 兼容性信息 */
  compatibility: {
    minEngineVersion: string
    maxEngineVersion?: string
    breakingChanges: string[]
  }
}

/**
 * 配方差异
 */
export interface RecipeDiff {
  /** 配方ID */
  recipeId: string
  /** 从版本 */
  fromVersion: string
  /** 到版本 */
  toVersion: string
  /** 变更类型 */
  changeType: 'major' | 'minor' | 'patch' | 'prerelease'
  /** 具体变更 */
  changes: RecipeChange[]
  /** 统计信息 */
  stats: {
    added: number
    removed: number
    modified: number
    moved: number
  }
}

/**
 * 配方变更项
 */
export interface RecipeChange {
  /** 变更路径 */
  path: string
  /** 变更类型 */
  type: 'add' | 'remove' | 'modify' | 'move'
  /** 旧值 */
  oldValue?: any
  /** 新值 */
  newValue?: any
  /** 变更描述 */
  description: string
  /** 影响等级 */
  impact: 'low' | 'medium' | 'high' | 'critical'
}

/**
 * 配方历史记录
 */
export interface RecipeHistory {
  /** 配方ID */
  recipeId: string
  /** 历史版本列表 */
  versions: RecipeVersion[]
  /** 当前版本 */
  currentVersion: string
  /** 创建时间 */
  createdAt: number
  /** 最后更新时间 */
  lastUpdated: number
  /** 总下载次数 */
  totalDownloads: number
  /** 平均评分 */
  averageRating: number
  /** 标签 */
  tags: string[]
  /** 分类 */
  category: string
  /** 作者信息 */
  author: {
    id: string
    name: string
    email?: string
    website?: string
  }
  /** 许可证 */
  license: string
  /** 是否公开 */
  isPublic: boolean
}

/**
 * 存储配置
 */
export interface StorageConfig {
  /** 存储后端类型 */
  backend: 'local' | 'remote' | 'hybrid'
  /** 远程API基础URL */
  remoteApiUrl?: string
  /** API密钥 */
  apiKey?: string
  /** 自动同步间隔 */
  autoSyncIntervalMs?: number
  /** 是否启用版本压缩 */
  enableVersionCompression?: boolean
  /** 最大版本历史数量 */
  maxVersionHistory?: number
  /** 是否启用增量更新 */
  enableIncrementalUpdates?: boolean
}

/**
 * 同步状态
 */
export interface SyncState {
  /** 是否正在同步 */
  isSyncing: boolean
  /** 最后同步时间 */
  lastSyncAt: number
  /** 待同步项目 */
  pendingItems: string[]
  /** 同步错误 */
  errors: SyncError[]
  /** 冲突列表 */
  conflicts: SyncConflict[]
}

/**
 * 同步错误
 */
export interface SyncError {
  recipeId: string
  version: string
  error: string
  timestamp: number
  retryCount: number
}

/**
 * 同步冲突
 */
export interface SyncConflict {
  recipeId: string
  localVersion: string
  remoteVersion: string
  localData: any
  remoteData: any
  conflictType: 'version' | 'content' | 'deleted'
  resolved: boolean
}

// ============================================================================
// 配方存储管理器
// ============================================================================

/**
 * 配方存储和版本管理器
 *
 * 特性：
 * - 语义化版本控制
 * - 增量更新和差异计算
 * - 配方历史追踪
 * - 自动同步和冲突解决
 * - 配方发布和订阅
 */
export class RecipeStorageManager {
  private config: StorageConfig
  private recipeHistories: Map<string, RecipeHistory>
  private syncState: SyncState
  private syncTimer: NodeJS.Timeout | null
  private eventListeners: Map<string, Set<Function>>
  private localDb: IDBDatabase | null
  private isInitialized: boolean

  constructor(config: StorageConfig = { backend: 'local' }) {
    this.config = {
      autoSyncIntervalMs: 300000, // 5分钟
      enableVersionCompression: true,
      maxVersionHistory: 20,
      enableIncrementalUpdates: true,
      ...config
    }

    this.recipeHistories = new Map()
    this.syncState = {
      isSyncing: false,
      lastSyncAt: 0,
      pendingItems: [],
      errors: [],
      conflicts: []
    }
    this.syncTimer = null
    this.eventListeners = new Map()
    this.localDb = null
    this.isInitialized = false

    this.initialize()
  }

  // ========================================================================
  // 初始化和生命周期
  // ========================================================================

  /**
   * 初始化存储管理器
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) return

    const startTime = performance.now()

    try {
      // 初始化本地数据库
      await this.initializeLocalDatabase()

      // 加载配方历史
      await this.loadRecipeHistories()

      // 启动自动同步
      if (this.config.backend !== 'local') {
        this.startAutoSync()
      }

      this.isInitialized = true

      const endTime = performance.now()
      console.log(`📚 存储管理器初始化完成 (${(endTime - startTime).toFixed(2)}ms)`)

    } catch (error) {
      console.error('存储管理器初始化失败:', error)
      throw error
    }
  }

  /**
   * 发布新版本配方
   */
  async publishRecipe(
    recipe: DynamicRecipe,
    options: PublishOptions = {}
  ): Promise<RecipeVersion> {
    const recipeId = recipe.id

    // 获取现有历史
    let history = this.recipeHistories.get(recipeId)
    if (!history) {
      // 创建新历史记录
      history = await this.createRecipeHistory(recipe)
    }

    // 确定新版本号
    const newVersion = this.determineVersionNumber(history, options.versionType)
    recipe.version = newVersion

    // 验证配方
    if (options.validate !== false) {
      const validation = await this.validateRecipe(recipe)
      if (!validation.isValid) {
        throw new Error(`配方验证失败: ${validation.errors.join(', ')}`)
      }
    }

    // 安全检查
    if (options.securityCheck !== false) {
      const securityCheck = await this.performSecurityCheck(recipe)
      if (securityCheck.riskLevel === 'blocked') {
        throw new Error('配方安全检查失败，已被阻止')
      }
    }

    // 计算版本差异
    const diff = history.currentVersion
      ? await this.calculateRecipeDiff(history.currentVersion, recipe)
      : undefined

    // 创建版本对象
    const version: RecipeVersion = {
      version: newVersion,
      tag: options.tag || this.determineVersionTag(options.versionType),
      changelog: options.changelog || this.generateChangelog(diff),
      releasedAt: Date.now(),
      recipe: JSON.parse(JSON.stringify(recipe)), // 深拷贝
      diff,
      dependencies: recipe.dependencies || {},
      compatibility: {
        minEngineVersion: '1.0.0',
        breakingChanges: diff?.changes.filter(c => c.impact === 'critical').map(c => c.description) || []
      }
    }

    // 添加到历史
    history.versions.push(version)
    history.currentVersion = newVersion
    history.lastUpdated = Date.now()

    // 限制版本历史数量
    if (history.versions.length > (this.config.maxVersionHistory || 20)) {
      history.versions = history.versions.slice(-this.config.maxVersionHistory!)
    }

    // 保存到本地
    await this.saveRecipeHistory(history)

    // 发布到远程
    if (this.config.backend !== 'local') {
      await this.publishToRemote(version)
    }

    // 触发事件
    this.emitEvent('recipe-published', {
      recipeId,
      version: newVersion,
      recipe
    })

    console.log(`📦 配方发布成功: ${recipeId} v${newVersion}`)
    return version
  }

  /**
   * 获取配方版本
   */
  async getRecipeVersion(recipeId: string, version?: string): Promise<RecipeVersion | null> {
    const history = this.recipeHistories.get(recipeId)
    if (!history) return null

    // 查找指定版本
    if (version) {
      return history.versions.find(v => v.version === version) || null
    }

    // 返回当前版本
    const currentVersion = history.versions.find(v => v.version === history.currentVersion)
    return currentVersion || null
  }

  /**
   * 获取配方历史
   */
  async getRecipeHistory(recipeId: string): Promise<RecipeHistory | null> {
    return this.recipeHistories.get(recipeId) || null
  }

  /**
   * 回滚到指定版本
   */
  async rollbackRecipe(recipeId: string, targetVersion: string): Promise<RecipeVersion> {
    const history = this.recipeHistories.get(recipeId)
    if (!history) {
      throw new Error(`配方历史不存在: ${recipeId}`)
    }

    const targetVersionData = history.versions.find(v => v.version === targetVersion)
    if (!targetVersionData) {
      throw new Error(`目标版本不存在: ${targetVersion}`)
    }

    // 检查是否当前版本
    if (history.currentVersion === targetVersion) {
      return targetVersionData
    }

    // 创建回滚版本
    const rollbackVersion = this.generateRollbackVersion(history.currentVersion, targetVersion)
    const rollbackRecipe: DynamicRecipe = JSON.parse(JSON.stringify(targetVersionData.recipe))
    rollbackRecipe.version = rollbackVersion

    // 发布回滚版本
    const version = await this.publishRecipe(rollbackRecipe, {
      versionType: 'patch',
      tag: 'hotfix',
      changelog: `回滚到版本 ${targetVersion}`,
      validate: false, // 跳过验证，因为之前已验证过
      securityCheck: false
    })

    console.log(`🔄 配方回滚成功: ${recipeId} to ${targetVersion}`)
    return version
  }

  /**
   * 删除配方
   */
  async deleteRecipe(recipeId: string, options: DeleteOptions = {}): Promise<void> {
    const history = this.recipeHistories.get(recipeId)
    if (!history) {
      throw new Error(`配方不存在: ${recipeId}`)
    }

    if (options.force !== true) {
      // 检查是否有依赖
      const dependents = await this.findDependentRecipes(recipeId)
      if (dependents.length > 0) {
        throw new Error(`无法删除配方，以下配方依赖它: ${dependents.join(', ')}`)
      }
    }

    // 从本地删除
    this.recipeHistories.delete(recipeId)
    await this.deleteRecipeHistory(recipeId)

    // 从远程删除
    if (this.config.backend !== 'local') {
      await this.deleteFromRemote(recipeId)
    }

    // 触发事件
    this.emitEvent('recipe-deleted', {
      recipeId,
      history
    })

    console.log(`🗑️ 配方删除成功: ${recipeId}`)
  }

  // ========================================================================
  // 版本管理方法
  // ========================================================================

  /**
   * 确定版本号
   */
  private determineVersionNumber(history: RecipeHistory, versionType?: string): string {
    const currentVersion = history.currentVersion || '0.0.0'
    const semver = this.parseVersion(currentVersion)

    switch (versionType) {
      case 'major':
        semver.major++
        semver.minor = 0
        semver.patch = 0
        break
      case 'minor':
        semver.minor++
        semver.patch = 0
        break
      case 'patch':
        semver.patch++
        break
      case 'prerelease':
        semver.patch++
        semver.prerelease = 'alpha'
        break
      default:
        // 自动确定版本类型
        const latestChanges = history.versions[history.versions.length - 1]?.diff
        if (latestChanges?.changes.some(c => c.impact === 'critical')) {
          semver.major++
          semver.minor = 0
          semver.patch = 0
        } else if (latestChanges?.changes.some(c => c.impact === 'high')) {
          semver.minor++
          semver.patch = 0
        } else {
          semver.patch++
        }
    }

    return this.formatVersion(semver)
  }

  /**
   * 解析版本号
   */
  private parseVersion(version: string): SemanticVersion {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9-]+))?(?:\+([a-zA-Z0-9-]+))?$/)

    if (!match) {
      return { major: 0, minor: 0, patch: 0 }
    }

    return {
      major: parseInt(match[1]),
      minor: parseInt(match[2]),
      patch: parseInt(match[3]),
      prerelease: match[4],
      build: match[5]
    }
  }

  /**
   * 格式化版本号
   */
  private formatVersion(semver: SemanticVersion): string {
    let version = `${semver.major}.${semver.minor}.${semver.patch}`
    if (semver.prerelease) {
      version += `-${semver.prerelease}`
    }
    if (semver.build) {
      version += `+${semver.build}`
    }
    return version
  }

  /**
   * 确定版本标签
   */
  private determineVersionTag(versionType?: string): RecipeVersion['tag'] {
    switch (versionType) {
      case 'major':
      case 'minor':
      case 'patch':
        return 'stable'
      case 'prerelease':
        return 'alpha'
      default:
        return 'stable'
    }
  }

  /**
   * 生成回滚版本号
   */
  private generateRollbackVersion(currentVersion: string, targetVersion: string): string {
    const currentSemver = this.parseVersion(currentVersion)
    currentSemver.patch++
    currentSemver.prerelease = `rollback-${targetVersion.replace(/\./g, '-')}`
    return this.formatVersion(currentSemver)
  }

  /**
   * 计算配方差异
   */
  private async calculateRecipeDiff(fromVersion: string, toRecipe: DynamicRecipe): Promise<RecipeDiff> {
    // 获取来源版本的配方
    const fromVersionData = await this.getRecipeVersion(toRecipe.id, fromVersion)
    if (!fromVersionData) {
      throw new Error(`来源版本不存在: ${fromVersion}`)
    }

    const fromRecipe = fromVersionData.recipe

    // 计算差异
    const changes = this.calculateObjectDiff(fromRecipe, toRecipe)

    // 确定变更类型
    const changeType = this.determineChangeType(fromVersion, toRecipe.version || '0.0.1')

    // 统计变更
    const stats = {
      added: changes.filter(c => c.type === 'add').length,
      removed: changes.filter(c => c.type === 'remove').length,
      modified: changes.filter(c => c.type === 'modify').length,
      moved: changes.filter(c => c.type === 'move').length
    }

    return {
      recipeId: toRecipe.id,
      fromVersion,
      toVersion: toRecipe.version || '1.0.0',
      changeType,
      changes,
      stats
    }
  }

  /**
   * 计算对象差异
   */
  private calculateObjectDiff(obj1: any, obj2: any, path: string = ''): RecipeChange[] {
    const changes: RecipeChange[] = []
    const keys1 = new Set(Object.keys(obj1))
    const keys2 = new Set(Object.keys(obj2))

    // 检查删除的键
    for (const key of keys1) {
      if (!keys2.has(key)) {
        changes.push({
          path: path ? `${path}.${key}` : key,
          type: 'remove',
          oldValue: obj1[key],
          description: `删除属性: ${key}`,
          impact: this.determineChangeImpact(key, obj1[key], undefined)
        })
      }
    }

    // 检查新增的键
    for (const key of keys2) {
      if (!keys1.has(key)) {
        changes.push({
          path: path ? `${path}.${key}` : key,
          type: 'add',
          newValue: obj2[key],
          description: `新增属性: ${key}`,
          impact: this.determineChangeImpact(key, undefined, obj2[key])
        })
      }
    }

    // 检查修改的键
    for (const key of keys1) {
      if (keys2.has(key)) {
        const val1 = obj1[key]
        const val2 = obj2[key]

        if (JSON.stringify(val1) !== JSON.stringify(val2)) {
          if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
            // 递归计算嵌套对象差异
            const nestedChanges = this.calculateObjectDiff(val1, val2, path ? `${path}.${key}` : key)
            changes.push(...nestedChanges)
          } else {
            changes.push({
              path: path ? `${path}.${key}` : key,
              type: 'modify',
              oldValue: val1,
              newValue: val2,
              description: `修改属性: ${key}`,
              impact: this.determineChangeImpact(key, val1, val2)
            })
          }
        }
      }
    }

    return changes
  }

  /**
   * 确定变更类型
   */
  private determineChangeType(fromVersion: string, toVersion: string): RecipeDiff['changeType'] {
    const fromSemver = this.parseVersion(fromVersion)
    const toSemver = this.parseVersion(toVersion)

    if (toSemver.major > fromSemver.major) return 'major'
    if (toSemver.minor > fromSemver.minor) return 'minor'
    if (toSemver.patch > fromSemver.patch) return 'patch'
    return 'prerelease'
  }

  /**
   * 确定变更影响
   */
  private determineChangeImpact(path: string, oldValue?: any, newValue?: any): RecipeChange['impact'] {
    // 关键路径的高影响变更
    const criticalPaths = [
      'axes.mode',
      'axes.hue.primary',
      'axes.contrast.level',
      'id'
    ]

    if (criticalPaths.some(criticalPath => path.includes(criticalPath))) {
      return 'critical'
    }

    // 中等影响变更
    const mediumPaths = [
      'axes',
      'animations',
      'customTokens'
    ]

    if (mediumPaths.some(mediumPath => path.startsWith(mediumPath))) {
      return 'high'
    }

    // 低影响变更
    const lowPaths = [
      'metadata',
      'description',
      'tags'
    ]

    if (lowPaths.some(lowPath => path.startsWith(lowPath))) {
      return 'low'
    }

    return 'medium'
  }

  /**
   * 生成变更日志
   */
  private generateChangelog(diff?: RecipeDiff): string {
    if (!diff || diff.changes.length === 0) {
      return '初始版本'
    }

    const changesByType = diff.changes.reduce((groups, change) => {
      const group = groups[change.type] || []
      group.push(change)
      groups[change.type] = group
      return groups
    }, {} as Record<string, RecipeChange[]>)

    const lines: string[] = []

    // 主要变更
    const criticalChanges = diff.changes.filter(c => c.impact === 'critical')
    if (criticalChanges.length > 0) {
      lines.push('### 主要变更')
      criticalChanges.forEach(change => {
        lines.push(`- ${change.description}`)
      })
      lines.push('')
    }

    // 新增功能
    if (changesByType.add && changesByType.add.length > 0) {
      lines.push('### 新增功能')
      changesByType.add.forEach(change => {
        lines.push(`- ${change.description}`)
      })
      lines.push('')
    }

    // 改进优化
    if (changesByType.modify && changesByType.modify.length > 0) {
      lines.push('### 改进优化')
      changesByType.modify.forEach(change => {
        lines.push(`- ${change.description}`)
      })
      lines.push('')
    }

    // 问题修复
    if (changesByType.remove && changesByType.remove.length > 0) {
      lines.push('### 问题修复')
      changesByType.remove.forEach(change => {
        lines.push(`- ${change.description}`)
      })
    }

    return lines.join('\n')
  }

  // ========================================================================
  // 本地数据库管理
  // ========================================================================

  /**
   * 初始化本地数据库
   */
  private async initializeLocalDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('XorigoRecipeStorage', 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.localDb = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建配方历史存储
        if (!db.objectStoreNames.contains('recipeHistories')) {
          const historyStore = db.createObjectStore('recipeHistories', { keyPath: 'recipeId' })
          historyStore.createIndex('category', 'category', { unique: false })
          historyStore.createIndex('author', 'author.id', { unique: false })
          historyStore.createIndex('lastUpdated', 'lastUpdated', { unique: false })
        }

        // 创建同步状态存储
        if (!db.objectStoreNames.contains('syncState')) {
          db.createObjectStore('syncState', { keyPath: 'id' })
        }
      }
    })
  }

  /**
   * 加载配方历史
   */
  private async loadRecipeHistories(): Promise<void> {
    if (!this.localDb) return

    return new Promise((resolve) => {
      const transaction = this.localDb!.transaction(['recipeHistories'], 'readonly')
      const store = transaction.objectStore('recipeHistories')
      const request = store.getAll()

      request.onsuccess = () => {
        const histories = request.result as RecipeHistory[]
        histories.forEach(history => {
          this.recipeHistories.set(history.recipeId, history)
        })
        console.log(`📚 加载配方历史: ${histories.length} 个配方`)
        resolve()
      }

      request.onerror = () => {
        console.warn('加载配方历史失败:', request.error)
        resolve()
      }
    })
  }

  /**
   * 保存配方历史
   */
  private async saveRecipeHistory(history: RecipeHistory): Promise<void> {
    if (!this.localDb) return

    return new Promise((resolve, reject) => {
      const transaction = this.localDb!.transaction(['recipeHistories'], 'readwrite')
      const store = transaction.objectStore('recipeHistories')
      const request = store.put(history)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 删除配方历史
   */
  private async deleteRecipeHistory(recipeId: string): Promise<void> {
    if (!this.localDb) return

    return new Promise((resolve) => {
      const transaction = this.localDb!.transaction(['recipeHistories'], 'readwrite')
      const store = transaction.objectStore('recipeHistories')
      const request = store.delete(recipeId)

      request.onsuccess = () => resolve()
      request.onerror = () => {
        console.warn(`删除配方历史失败: ${recipeId}`, request.error)
        resolve()
      }
    })
  }

  // ========================================================================
  // 远程存储管理
  // ========================================================================

  /**
   * 发布到远程
   */
  private async publishToRemote(version: RecipeVersion): Promise<void> {
    if (!this.config.remoteApiUrl || !this.config.apiKey) {
      throw new Error('远程API配置不完整')
    }

    try {
      const response = await fetch(`${this.config.remoteApiUrl}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(version)
      })

      if (!response.ok) {
        throw new Error(`远程发布失败: ${response.statusText}`)
      }

      const result = await response.json()
      console.log(`📤 远程发布成功: ${version.recipe.id} v${version.version}`)

    } catch (error) {
      console.warn('远程发布失败:', error)
      throw error
    }
  }

  /**
   * 从远程删除
   */
  private async deleteFromRemote(recipeId: string): Promise<void> {
    if (!this.config.remoteApiUrl || !this.config.apiKey) return

    try {
      const response = await fetch(`${this.config.remoteApiUrl}/recipes/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })

      if (!response.ok) {
        throw new Error(`远程删除失败: ${response.statusText}`)
      }

      console.log(`📤 远程删除成功: ${recipeId}`)

    } catch (error) {
      console.warn('远程删除失败:', error)
    }
  }

  // ========================================================================
  // 同步管理
  // ========================================================================

  /**
   * 启动自动同步
   */
  private startAutoSync(): void {
    if (this.syncTimer) return

    this.syncTimer = setInterval(() => {
      this.performSync()
    }, this.config.autoSyncIntervalMs || 300000)

    console.log('🔄 自动同步已启动')
  }

  /**
   * 执行同步
   */
  private async performSync(): Promise<void> {
    if (this.syncState.isSyncing || this.config.backend === 'local') return

    this.syncState.isSyncing = true

    try {
      // 同步待处理项目
      for (const recipeId of this.syncState.pendingItems) {
        try {
          await this.syncRecipe(recipeId)
        } catch (error) {
          console.warn(`同步失败: ${recipeId}`, error)
          this.syncState.errors.push({
            recipeId,
            version: '',
            error: error instanceof Error ? error.message : '未知错误',
            timestamp: Date.now(),
            retryCount: 1
          })
        }
      }

      // 从远程获取更新
      await this.fetchRemoteUpdates()

      this.syncState.lastSyncAt = Date.now()
      this.syncState.pendingItems = []

      console.log('🔄 同步完成')

    } finally {
      this.syncState.isSyncing = false
    }
  }

  /**
   * 同步配方
   */
  private async syncRecipe(recipeId: string): Promise<void> {
    const localHistory = this.recipeHistories.get(recipeId)
    if (!localHistory) return

    try {
      const response = await fetch(`${this.config.remoteApiUrl}/recipes/${recipeId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'If-Modified-Since': new Date(localHistory.lastUpdated).toUTCString()
        }
      })

      if (response.status === 304) {
        // 未修改，无需同步
        return
      }

      if (response.ok) {
        const remoteHistory = await response.json()
        await this.mergeRemoteHistory(localHistory, remoteHistory)
      }

    } catch (error) {
      console.warn(`同步配方失败: ${recipeId}`, error)
      throw error
    }
  }

  /**
   * 获取远程更新
   */
  private async fetchRemoteUpdates(): Promise<void> {
    if (!this.config.remoteApiUrl || !this.config.apiKey) return

    try {
      const response = await fetch(`${this.config.remoteApiUrl}/recipes/updates`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })

      if (response.ok) {
        const updates = await response.json()
        for (const update of updates) {
          await this.processRemoteUpdate(update)
        }
      }

    } catch (error) {
      console.warn('获取远程更新失败:', error)
    }
  }

  /**
   * 处理远程更新
   */
  private async processRemoteUpdate(update: any): Promise<void> {
    const recipeId = update.recipeId
    const localHistory = this.recipeHistories.get(recipeId)

    if (!localHistory) {
      // 新配方，直接添加
      this.recipeHistories.set(recipeId, update.history)
      await this.saveRecipeHistory(update.history)
      return
    }

    // 检查版本冲突
    const localLatest = localHistory.versions[localHistory.versions.length - 1]
    const remoteLatest = update.history.versions[update.history.versions.length - 1]

    if (localLatest.version !== remoteLatest.version) {
      // 版本冲突
      this.syncState.conflicts.push({
        recipeId,
        localVersion: localLatest.version,
        remoteVersion: remoteLatest.version,
        localData: localLatest,
        remoteData: remoteLatest,
        conflictType: 'version',
        resolved: false
      })
    }
  }

  /**
   * 合并远程历史
   */
  private async mergeRemoteHistory(localHistory: RecipeHistory, remoteHistory: RecipeHistory): Promise<void> {
    // 简单合并：保留远程版本作为新版本
    for (const version of remoteHistory.versions) {
      const existingVersion = localHistory.versions.find(v => v.version === version.version)
      if (!existingVersion) {
        localHistory.versions.push(version)
      }
    }

    // 更新当前版本（如果远程版本更新）
    const remoteLatest = remoteHistory.versions[remoteHistory.versions.length - 1]
    const localLatest = localHistory.versions[localHistory.versions.length - 1]

    if (this.compareVersions(remoteLatest.version, localLatest.version) > 0) {
      localHistory.currentVersion = remoteLatest.version
    }

    localHistory.lastUpdated = Math.max(localHistory.lastUpdated, remoteHistory.lastUpdated)

    await this.saveRecipeHistory(localHistory)
  }

  /**
   * 比较版本号
   */
  private compareVersions(version1: string, version2: string): number {
    const v1 = this.parseVersion(version1)
    const v2 = this.parseVersion(version2)

    if (v1.major !== v2.major) return v1.major - v2.major
    if (v1.minor !== v2.minor) return v1.minor - v2.minor
    if (v1.patch !== v2.patch) return v1.patch - v2.patch

    // 预发布版本比较
    if (!v1.prerelease && !v2.prerelease) return 0
    if (!v1.prerelease) return 1
    if (!v2.prerelease) return -1

    return v1.prerelease.localeCompare(v2.prerelease)
  }

  // ========================================================================
  // 工具和辅助方法
  // ========================================================================

  /**
   * 创建配方历史
   */
  private async createRecipeHistory(recipe: DynamicRecipe): Promise<RecipeHistory> {
    const history: RecipeHistory = {
      recipeId: recipe.id,
      versions: [],
      currentVersion: '',
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      totalDownloads: 0,
      averageRating: 0,
      tags: recipe.metadata?.tags || [],
      category: recipe.metadata?.category || 'uncategorized',
      author: {
        id: 'anonymous',
        name: 'Anonymous'
      },
      license: 'MIT',
      isPublic: true
    }

    this.recipeHistories.set(recipe.id, history)
    await this.saveRecipeHistory(history)

    return history
  }

  /**
   * 查找依赖配方
   */
  private async findDependentRecipes(recipeId: string): Promise<string[]> {
    const dependents: string[] = []

    for (const [id, history] of this.recipeHistories) {
      const currentVersion = history.versions.find(v => v.version === history.currentVersion)
      if (currentVersion?.dependencies[recipeId]) {
        dependents.push(id)
      }
    }

    return dependents
  }

  /**
   * 验证配方
   */
  private async validateRecipe(recipe: DynamicRecipe): Promise<ValidationResult> {
    // 这里应该调用配方验证器
    // 暂时返回通过
    return {
      isValid: true,
      errors: [],
      warnings: [],
      securityLevel: 'safe'
    }
  }

  /**
   * 安全检查
   */
  private async performSecurityCheck(recipe: DynamicRecipe): Promise<SecurityCheckResult> {
    // 这里应该调用安全检查器
    // 暂时返回安全
    return {
      isSecure: true,
      riskLevel: 'safe',
      issues: [],
      recommendations: [],
      checkedAt: Date.now()
    }
  }

  /**
   * 事件发射
   */
  private emitEvent(event: string, data: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data)
        } catch (error) {
          console.error(`事件监听器执行失败 (${event}):`, error)
        }
      })
    }
  }

  /**
   * 添加事件监听器
   */
  on(event: string, listener: Function): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }

    this.eventListeners.get(event)!.add(listener)

    return () => {
      this.eventListeners.get(event)?.delete(listener)
    }
  }

  /**
   * 获取所有配方
   */
  async getAllRecipes(): Promise<string[]> {
    return Array.from(this.recipeHistories.keys())
  }

  /**
   * 获取配方统计
   */
  async getRecipeStats(recipeId: string): Promise<RecipeStats | null> {
    const history = this.recipeHistories.get(recipeId)
    if (!history) return null

    return {
      totalVersions: history.versions.length,
      currentVersion: history.currentVersion,
      totalDownloads: history.totalDownloads,
      averageRating: history.averageRating,
      lastUpdated: history.lastUpdated,
      category: history.category,
      tags: history.tags
    }
  }

  /**
   * 清理资源
   */
  dispose(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
      this.syncTimer = null
    }

    this.eventListeners.clear()
    this.recipeHistories.clear()

    console.log('🗑️ 存储管理器已清理')
  }
}

// ============================================================================
// 类型定义
// ============================================================================

export interface PublishOptions {
  /** 版本类型 */
  versionType?: 'major' | 'minor' | 'patch' | 'prerelease'
  /** 版本标签 */
  tag?: RecipeVersion['tag']
  /** 变更日志 */
  changelog?: string
  /** 是否验证 */
  validate?: boolean
  /** 是否安全检查 */
  securityCheck?: boolean
}

export interface DeleteOptions {
  /** 是否强制删除 */
  force?: boolean
}

export interface RecipeStats {
  totalVersions: number
  currentVersion: string
  totalDownloads: number
  averageRating: number
  lastUpdated: number
  category: string
  tags: string[]
}

// ============================================================================
// 默认实例和便捷函数
// ============================================================================

/**
 * 默认存储管理器实例
 */
export const recipeStorageManager = new RecipeStorageManager({
  backend: 'local', // 默认本地模式
  enableVersionCompression: true,
  maxVersionHistory: 20,
  enableIncrementalUpdates: true
})

/**
 * 便捷函数
 */
export const publishRecipe = (recipe: DynamicRecipe, options?: PublishOptions) =>
  recipeStorageManager.publishRecipe(recipe, options)

export const getRecipeVersion = (recipeId: string, version?: string) =>
  recipeStorageManager.getRecipeVersion(recipeId, version)

export const rollbackRecipe = (recipeId: string, targetVersion: string) =>
  recipeStorageManager.rollbackRecipe(recipeId, targetVersion)

export const deleteRecipe = (recipeId: string, options?: DeleteOptions) =>
  recipeStorageManager.deleteRecipe(recipeId, options)

export default {
  RecipeStorageManager,
  recipeStorageManager,
  publishRecipe,
  getRecipeVersion,
  rollbackRecipe,
  deleteRecipe
}