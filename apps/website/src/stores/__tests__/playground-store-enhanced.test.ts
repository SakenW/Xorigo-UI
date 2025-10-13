/**
 * @fileoverview 增强版 Playground Store 测试
 * 包含新增功能的测试用例
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { usePlaygroundStore } from '../playground.store'
import { LocalStorageAdapter } from '../adapters/local-storage-adapter'
import { PlaygroundErrorBoundary } from '../error-boundary-context'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  }
})()

// Mock window and localStorage
Object.defineProperty(global, 'window', {
  value: {
    localStorage: localStorageMock,
    performance: {
      memory: {
        usedJSHeapSize: 1024,
      },
      now: vi.fn(() => Date.now()),
    },
    Sentry: null,
  },
  writable: true,
})

describe('Enhanced PlaygroundStore', () => {
  let mockDataAdapter: LocalStorageAdapter
  let mockErrorBoundary: PlaygroundErrorBoundary

  beforeEach(() => {
    // 重置 store 状态
    usePlaygroundStore.getState().reset()

    // 重置 localStorage mock
    localStorageMock.clear()
    vi.clearAllMocks()

    // 创建 mock 适配器和错误边界
    mockDataAdapter = new LocalStorageAdapter()
    mockErrorBoundary = new PlaygroundErrorBoundary()

    // 设置到 store
    usePlaygroundStore.getState().setDataAdapter(mockDataAdapter)
    usePlaygroundStore.getState().setErrorBoundary(mockErrorBoundary)
  })

  describe('组件状态管理增强功能', () => {
    it('应该支持异步组件加载', async () => {
      const state = usePlaygroundStore.getState()

      // Mock 数据适配器
      const mockComponent = {
        name: 'TestButton',
        props: { variant: 'primary' },
        tokens: [],
        dependencies: [],
      }
      vi.spyOn(mockDataAdapter, 'loadComponent').mockResolvedValue(mockComponent)

      await state.loadComponentAsync('TestButton')

      expect(state.currentComponentId).toBe('TestButton')
      expect(state.currentProps).toEqual({ variant: 'primary' })
      expect(state.loadingComponent).toBe(false)
      expect(state.componentError).toBe(null)
    })

    it('应该处理组件加载错误', async () => {
      const state = usePlaygroundStore.getState()
      const error = new Error('组件未找到')

      vi.spyOn(mockDataAdapter, 'loadComponent').mockRejectedValue(error)

      await state.loadComponentAsync('NonExistentComponent')

      expect(state.loadingComponent).toBe(false)
      expect(state.componentError).toBe(error)
    })
  })

  describe('主题配方系统', () => {
    it('应该支持应用主题配方', () => {
      const state = usePlaygroundStore.getState()

      state.applyRecipe('modern-blue', { primaryColor: '#3b82f6' })

      expect(state.themeState.recipeId).toBe('modern-blue')
      expect(state.themeState.customTokens).toEqual({ primaryColor: '#3b82f6' })
    })
  })

  describe('快照管理增强功能', () => {
    it('应该支持快照复制', async () => {
      const state = usePlaygroundStore.getState()

      // 创建原始快照
      state.setCurrentComponent('Button', { variant: 'primary' })
      await state.createSnapshot('原始快照')

      const snapshots = state.snapshots
      expect(snapshots.length).toBe(1)

      // 复制快照
      await state.duplicateSnapshot(snapshots[0].id, '复制的快照')

      expect(state.snapshots.length).toBe(2)
      expect(state.snapshots[1].name).toBe('复制的快照')
      expect(state.snapshots[1].componentState.props).toEqual({ variant: 'primary' })
    })

    it('应该支持快照导入导出', async () => {
      const state = usePlaygroundStore.getState()

      // 创建测试快照
      state.setCurrentComponent('Button', { variant: 'primary' })
      await state.createSnapshot('测试快照', '测试描述')

      // 导出快照
      const exportData = state.exportSnapshots()
      expect(exportData).toContain('测试快照')

      // 重置并导入
      state.reset()
      expect(state.snapshots.length).toBe(0)

      await state.importSnapshots(exportData)
      expect(state.snapshots.length).toBe(1)
      expect(state.snapshots[0].name).toBe('测试快照')
    })
  })

  describe('对比模式增强功能', () => {
    it('应该支持快照交换', () => {
      const state = usePlaygroundStore.getState()

      // 创建两个快照
      state.setCompareSnapshots('snapshot-a', 'snapshot-b')
      expect(state.snapshotA).toBe('snapshot-a')
      expect(state.snapshotB).toBe('snapshot-b')

      // 交换快照
      state.swapCompareSnapshots()
      expect(state.snapshotA).toBe('snapshot-b')
      expect(state.snapshotB).toBe('snapshot-a')
    })
  })

  describe('搜索和筛选功能', () => {
    it('应该支持按名称搜索快照', async () => {
      const state = usePlaygroundStore.getState()

      // 创建测试快照
      await state.createSnapshot('Primary Button', '主要按钮')
      await state.createSnapshot('Secondary Button', '次要按钮')
      await state.createSnapshot('Card Component', '卡片组件')

      // 搜索
      state.setSearchQuery('button')
      const filtered = state.getFilteredSnapshots()

      expect(filtered.length).toBe(2)
      expect(filtered.every(s => s.name.toLowerCase().includes('button'))).toBe(true)
    })

    it('应该支持按标签筛选快照', async () => {
      const state = usePlaygroundStore.getState()

      // 创建带标签的快照
      await state.createSnapshot('Button 1')
      state.updateSnapshot(state.snapshots[0].id, { tags: ['button', 'primary'] })

      await state.createSnapshot('Card 1')
      state.updateSnapshot(state.snapshots[1].id, { tags: ['card', 'layout'] })

      // 按标签筛选
      state.setFilterTags(['button'])
      const filtered = state.getFilteredSnapshots()

      expect(filtered.length).toBe(1)
      expect(filtered[0].name).toBe('Button 1')
    })
  })

  describe('自动保存功能', () => {
    it('应该支持自动保存配置', () => {
      const state = usePlaygroundStore.getState()

      state.setAutoSave(true, 60000)
      expect(state.autoSaveEnabled).toBe(true)
      expect(state.autoSaveInterval).toBe(60000)
    })

    it('应该触发自动保存', async () => {
      const state = usePlaygroundStore.getState()
      state.setAutoSave(true)

      vi.spyOn(mockDataAdapter, 'saveSnapshot')

      await state.triggerAutoSave()

      expect(mockDataAdapter.saveSnapshot).toHaveBeenCalled()
      expect(state.lastAutoSave).toBeTruthy()
    })
  })

  describe('性能监控功能', () => {
    it('应该更新性能指标', () => {
      const state = usePlaygroundStore.getState()

      state.updatePerformanceMetrics({
        renderTime: 10,
        memoryUsage: 1024,
      })

      expect(state.performanceMetrics.renderTime).toBe(10)
      expect(state.performanceMetrics.memoryUsage).toBe(1024)
    })

    it('应该启动和停止性能跟踪', () => {
      const state = usePlaygroundStore.getState()
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

      state.startPerformanceTracking()
      expect((window as any).__performanceInterval).toBeTruthy()

      state.stopPerformanceTracking()
      expect(clearIntervalSpy).toHaveBeenCalled()
      expect((window as any).__performanceInterval).toBeUndefined()
    })
  })

  describe('数据层适配器集成', () => {
    it('应该支持数据同步到存储', async () => {
      const state = usePlaygroundStore.getState()

      vi.spyOn(mockDataAdapter, 'saveComponent')
      vi.spyOn(mockDataAdapter, 'saveTheme')
      vi.spyOn(mockDataAdapter, 'saveSnapshot')

      await state.syncToStorage()

      expect(mockDataAdapter.saveComponent).toHaveBeenCalled()
      expect(mockDataAdapter.saveTheme).toHaveBeenCalled()
    })

    it('应该支持从存储恢复数据', async () => {
      const state = usePlaygroundStore.getState()

      const mockSnapshots = [{
        id: 'test-snapshot',
        name: 'Test',
        timestamp: Date.now(),
        componentState: {
          name: 'Button',
          props: { variant: 'primary' },
          tokens: [],
          dependencies: [],
        },
        themeState: {
          mode: 'light' as const,
          density: 'comfortable' as const,
          hue: 'blue',
          surface: 'flat' as const,
          rtl: false,
        },
      }]

      vi.spyOn(mockDataAdapter, 'loadSnapshots').mockResolvedValue(mockSnapshots)

      await state.syncFromStorage()

      expect(state.snapshots.length).toBe(1)
      expect(state.snapshots[0].name).toBe('Test')
    })
  })

  describe('错误边界集成', () => {
    it('应该报告错误', () => {
      const state = usePlaygroundStore.getState()
      const error = new Error('测试错误')

      state.reportError(error, { action: 'test' })

      expect(mockErrorBoundary.getLastError()).toBe(error)
    })

    it('应该捕获用户操作', () => {
      const state = usePlaygroundStore.getState()

      state.errorBoundary?.captureUserAction('test_action', { data: 'test' })

      const actions = mockErrorBoundary.getRecentActions(1)
      expect(actions[0].action).toBe('test_action')
      expect(actions[0].data).toEqual({ data: 'test' })
    })
  })

  describe('状态健康检查', () => {
    it('应该验证状态完整性', () => {
      const state = usePlaygroundStore.getState()

      // 手动破坏状态
      state.historyIndex = 999

      const validation = state.validateState()
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('历史记录索引超出范围')
    })

    it('应该修复损坏的状态', async () => {
      const state = usePlaygroundStore.getState()

      // 手动破坏状态
      state.historyIndex = 999

      await state.repairState()

      expect(state.historyIndex).toBeLessThan(state.history.length)
    })
  })

  describe('重置功能增强', () => {
    it('应该支持保留快照的重置', async () => {
      const state = usePlaygroundStore.getState()

      // 创建快照
      await state.createSnapshot('测试快照')
      expect(state.snapshots.length).toBe(1)

      // 重置但保留快照
      state.resetPreservingSnapshots()

      expect(state.snapshots.length).toBe(1)
      expect(state.currentComponentId).toBe('')
    })
  })
})