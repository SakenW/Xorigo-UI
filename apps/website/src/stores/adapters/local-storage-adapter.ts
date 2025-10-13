/**
 * @fileoverview LocalStorage 数据适配器
 * 提供基于 localStorage 的数据持久化功能
 */

import type { DataAdapter, ComponentState, Snapshot, ThemeState } from '../playground.store'

export class LocalStorageAdapter implements DataAdapter {
  private readonly STORAGE_KEYS = {
    COMPONENTS: 'playground_components',
    SNAPSHOTS: 'playground_snapshots',
    THEME: 'playground_theme',
  } as const

  async loadComponent(id: string): Promise<ComponentState | null> {
    try {
      const components = this.loadFromStorage(this.STORAGE_KEYS.COMPONENTS) || {}
      return components[id] || null
    } catch (error) {
      console.error('加载组件失败:', error)
      return null
    }
  }

  async saveComponent(state: ComponentState): Promise<void> {
    try {
      const components = this.loadFromStorage(this.STORAGE_KEYS.COMPONENTS) || {}
      components[state.name] = state
      this.saveToStorage(this.STORAGE_KEYS.COMPONENTS, components)
    } catch (error) {
      console.error('保存组件失败:', error)
      throw error
    }
  }

  async deleteComponent(id: string): Promise<void> {
    try {
      const components = this.loadFromStorage(this.STORAGE_KEYS.COMPONENTS) || {}
      delete components[id]
      this.saveToStorage(this.STORAGE_KEYS.COMPONENTS, components)
    } catch (error) {
      console.error('删除组件失败:', error)
      throw error
    }
  }

  async loadSnapshots(): Promise<Snapshot[]> {
    try {
      const snapshots = this.loadFromStorage(this.STORAGE_KEYS.SNAPSHOTS) || []
      return Array.isArray(snapshots) ? snapshots : []
    } catch (error) {
      console.error('加载快照失败:', error)
      return []
    }
  }

  async saveSnapshot(snapshot: Snapshot): Promise<void> {
    try {
      const snapshots = await this.loadSnapshots()
      const existingIndex = snapshots.findIndex(s => s.id === snapshot.id)

      if (existingIndex >= 0) {
        snapshots[existingIndex] = snapshot
      } else {
        snapshots.push(snapshot)
      }

      // 限制快照数量 (最多保留 100 个)
      if (snapshots.length > 100) {
        // 保留最新的 90 个，移除最旧的 10 个
        snapshots.splice(0, snapshots.length - 90)
      }

      this.saveToStorage(this.STORAGE_KEYS.SNAPSHOTS, snapshots)
    } catch (error) {
      console.error('保存快照失败:', error)
      throw error
    }
  }

  async deleteSnapshot(id: string): Promise<void> {
    try {
      const snapshots = await this.loadSnapshots()
      const filteredSnapshots = snapshots.filter(s => s.id !== id)
      this.saveToStorage(this.STORAGE_KEYS.SNAPSHOTS, filteredSnapshots)
    } catch (error) {
      console.error('删除快照失败:', error)
      throw error
    }
  }

  async loadTheme(): Promise<ThemeState | null> {
    try {
      const theme = this.loadFromStorage(this.STORAGE_KEYS.THEME)
      return theme || null
    } catch (error) {
      console.error('加载主题失败:', error)
      return null
    }
  }

  async saveTheme(theme: ThemeState): Promise<void> {
    try {
      this.saveToStorage(this.STORAGE_KEYS.THEME, theme)
    } catch (error) {
      console.error('保存主题失败:', error)
      throw error
    }
  }

  /**
   * 清理所有数据
   */
  async clearAll(): Promise<void> {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('清理数据失败:', error)
      throw error
    }
  }

  /**
   * 获取存储统计信息
   */
  getStorageStats() {
    try {
      const stats: Record<string, { size: number; count: number }> = {}

      Object.entries(this.STORAGE_KEYS).forEach(([name, key]) => {
        const data = localStorage.getItem(key)
        stats[name] = {
          size: data ? new Blob([data]).size : 0,
          count: data ? JSON.parse(data).length || 1 : 0,
        }
      })

      return stats
    } catch (error) {
      console.error('获取存储统计失败:', error)
      return {}
    }
  }

  private loadFromStorage<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) as T : null
    } catch (error) {
      console.error(`从 localStorage 加载数据失败 (${key}):`, error)
      return null
    }
  }

  private saveToStorage<T>(key: string, data: T): void {
    try {
      const serialized = JSON.stringify(data)
      localStorage.setItem(key, serialized)
    } catch (error) {
      console.error(`保存数据到 localStorage 失败 (${key}):`, error)

      // 如果是存储空间不足，尝试清理旧数据
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.cleanupOldData()
        // 重试一次
        try {
          const serialized = JSON.stringify(data)
          localStorage.setItem(key, serialized)
        } catch (retryError) {
          throw new Error('存储空间不足且清理失败')
        }
      } else {
        throw error
      }
    }
  }

  /**
   * 清理旧数据以释放空间
   */
  private cleanupOldData(): void {
    try {
      // 清理超过 30 天的自动保存快照
      const snapshots = this.loadFromStorage<Snapshot[]>(this.STORAGE_KEYS.SNAPSHOTS) || []
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)

      const filteredSnapshots = snapshots.filter(snapshot => {
        // 保留非自动保存的快照
        if (!snapshot.isAutoSave) return true
        // 保留 30 天内的自动保存快照
        return snapshot.timestamp > thirtyDaysAgo
      })

      if (filteredSnapshots.length < snapshots.length) {
        this.saveToStorage(this.STORAGE_KEYS.SNAPSHOTS, filteredSnapshots)
        console.log(`清理了 ${snapshots.length - filteredSnapshots.length} 个旧快照`)
      }
    } catch (error) {
      console.error('清理旧数据失败:', error)
    }
  }
}

// 创建默认实例
export const localStorageAdapter = new LocalStorageAdapter()