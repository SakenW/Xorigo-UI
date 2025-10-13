/**
 * @fileoverview Playground 初始化工具
 * 提供数据适配器和错误边界的初始化功能
 */

import { usePlaygroundStore } from './playground.store'
import { localStorageAdapter } from './adapters/local-storage-adapter'
import { playgroundErrorBoundary } from './error-boundary-context'

export interface PlaygroundInitOptions {
  /**
   * 是否启用自动保存
   */
  autoSave?: boolean
  /**
   * 自动保存间隔 (毫秒)
   */
  autoSaveInterval?: number
  /**
   * 是否启用性能监控
   */
  performanceTracking?: boolean
  /**
   * 是否从存储中恢复数据
   */
  restoreFromStorage?: boolean
  /**
   * 自定义数据适配器
   */
  dataAdapter?: any
  /**
   * 自定义错误边界
   */
  errorBoundary?: any
}

/**
 * 初始化 Playground Store
 */
export async function initializePlayground(options: PlaygroundInitOptions = {}) {
  const {
    autoSave = true,
    autoSaveInterval = 30000,
    performanceTracking = true,
    restoreFromStorage = true,
    dataAdapter = localStorageAdapter,
    errorBoundary = playgroundErrorBoundary,
  } = options

  const store = usePlaygroundStore.getState()

  try {
    console.log('🎮 正在初始化 Playground Store...')

    // 设置错误边界
    if (errorBoundary) {
      // 恢复错误历史
      if (restoreFromStorage) {
        errorBoundary.restoreFromStorage()
      }
      store.setErrorBoundary(errorBoundary)
      console.log('✅ 错误边界已设置')
    }

    // 设置数据适配器
    if (dataAdapter) {
      store.setDataAdapter(dataAdapter)
      console.log('✅ 数据适配器已设置')
    }

    // 从存储中恢复数据
    if (restoreFromStorage && dataAdapter) {
      try {
        await store.syncFromStorage()
        console.log('✅ 已从存储中恢复数据')
      } catch (error) {
        console.warn('⚠️ 从存储中恢复数据失败:', error)
      }
    }

    // 设置自动保存
    if (autoSave) {
      store.setAutoSave(true, autoSaveInterval)

      // 设置定时保存
      const intervalId = setInterval(() => {
        store.triggerAutoSave().catch(err => {
          console.warn('自动保存失败:', err)
        })
      }, autoSaveInterval)

      // 存储 interval ID 以便清理
      ;(window as any).__autoSaveInterval = intervalId

      console.log(`✅ 自动保存已启用 (${autoSaveInterval}ms 间隔)`)
    }

    // 启用性能监控
    if (performanceTracking) {
      store.startPerformanceTracking()
      console.log('✅ 性能监控已启用')
    }

    // 设置页面卸载时的保存逻辑
    const handleBeforeUnload = () => {
      store.triggerAutoSave().catch(() => {
        // 忽略错误，因为页面即将卸载
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // 存储 cleanup 函数
    ;(window as any).__playgroundCleanup = () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)

      if ((window as any).__autoSaveInterval) {
        clearInterval((window as any).__autoSaveInterval)
      }

      store.stopPerformanceTracking()

      if (autoSave) {
        store.triggerAutoSave().catch(() => {
          // 忽略错误
        })
      }
    }

    // 验证状态完整性
    const validation = store.validateState()
    if (!validation.isValid) {
      console.warn('⚠️ 发现状态问题:', validation.errors)
      await store.repairState()
    }

    console.log('🎉 Playground Store 初始化完成!')

    return {
      success: true,
      store,
      cleanup: () => (window as any).__playgroundCleanup?.(),
    }
  } catch (error) {
    console.error('❌ Playground Store 初始化失败:', error)
    store.reportError(error as Error, { phase: 'initialization' })

    return {
      success: false,
      error,
      store,
    }
  }
}

/**
 * 清理 Playground 资源
 */
export function cleanupPlayground() {
  const cleanup = (window as any).__playgroundCleanup
  if (cleanup) {
    cleanup()
    console.log('🧹 Playground 资源已清理')
  }
}

/**
 * 获取 Playground 状态摘要
 */
export function getPlaygroundStateSummary() {
  const state = usePlaygroundStore.getState()
  const errorBoundary = state.errorBoundary

  return {
    mode: state.mode,
    currentComponent: state.currentComponentId,
    snapshotsCount: state.snapshots.length,
    historySize: state.history.length,
    compareMode: state.compareMode,
    autoSaveEnabled: state.autoSaveEnabled,
    lastAutoSave: state.lastAutoSave,
    errors: errorBoundary?.getErrorHistory().length || 0,
    recentActions: errorBoundary?.getRecentActions(5).length || 0,
    performanceMetrics: {
      renderTime: state.performanceMetrics.renderTime,
      updateCount: state.performanceMetrics.updateCount,
      memoryUsage: state.performanceMetrics.memoryUsage,
    },
    validation: state.validateState(),
  }
}

/**
 * 导出 Playground 数据
 */
export async function exportPlaygroundData() {
  const state = usePlaygroundStore.getState()
  const errorBoundary = state.errorBoundary

  const exportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    store: {
      snapshots: state.snapshots,
      themeState: state.themeState,
      mode: state.mode,
      currentComponentId: state.currentComponentId,
      currentProps: state.currentProps,
      autoSaveSettings: {
        enabled: state.autoSaveEnabled,
        interval: state.autoSaveInterval,
      },
    },
    errorBoundary: {
      errors: errorBoundary?.getErrorHistory().map(error => ({
        message: error.message,
        stack: error.stack,
        name: error.name,
      })) || [],
      recentActions: errorBoundary?.getRecentActions(20) || [],
    },
    summary: getPlaygroundStateSummary(),
  }

  return JSON.stringify(exportData, null, 2)
}

/**
 * 导入 Playground 数据
 */
export async function importPlaygroundData(data: string) {
  const state = usePlaygroundStore.getState()

  try {
    const importData = JSON.parse(data)

    // 验证数据格式
    if (!importData.store) {
      throw new Error('无效的数据格式')
    }

    // 导入快照
    if (importData.store.snapshots && Array.isArray(importData.store.snapshots)) {
      await state.importSnapshots(JSON.stringify(importData.store.snapshots))
    }

    // 导入主题状态
    if (importData.store.themeState) {
      state.updateTheme(importData.store.themeState)
    }

    // 导入其他设置
    if (importData.store.autoSaveSettings) {
      state.setAutoSave(
        importData.store.autoSaveSettings.enabled,
        importData.store.autoSaveSettings.interval
      )
    }

    console.log('✅ Playground 数据导入成功')
    return true
  } catch (error) {
    console.error('❌ Playground 数据导入失败:', error)
    state.reportError(error as Error, { phase: 'import' })
    return false
  }
}