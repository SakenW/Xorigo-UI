/**
 * @fileoverview Playground Store - Zustand 状态管理
 * 支持 Live Props Mode、Snapshot Mode 和 Compare Mode
 * 集成数据层适配器和错误边界系统
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'

// ===== 数据层适配器接口 =====

export interface DataAdapter {
  // 组件数据操作
  loadComponent(id: string): Promise<ComponentState | null>
  saveComponent(state: ComponentState): Promise<void>
  deleteComponent(id: string): Promise<void>

  // 快照数据操作
  loadSnapshots(): Promise<Snapshot[]>
  saveSnapshot(snapshot: Snapshot): Promise<void>
  deleteSnapshot(id: string): Promise<void>

  // 主题数据操作
  loadTheme(): Promise<ThemeState | null>
  saveTheme(theme: ThemeState): Promise<void>
}

// ===== 错误边界集成接口 =====

export interface ErrorBoundaryContext {
  reportError(error: Error, context?: Record<string, any>): void
  captureUserAction(action: string, data?: any): void
  getLastError(): Error | null
}

// ===== 类型定义 =====

export type PlaygroundMode = 'live' | 'snapshot' | 'compare'

export interface ThemeState {
  mode: 'light' | 'dark'
  density: 'comfortable' | 'compact' | 'spacious'
  hue: string
  surface: 'flat' | 'elevated'
  rtl: boolean
  // 主题配方系统支持
  recipeId?: string
  customTokens?: Record<string, any>
}

export interface ComponentProps {
  [key: string]: any
}

export interface ComponentState {
  name: string
  props: ComponentProps
  tokens: string[]
  dependencies: string[]
  // 性能数据
  renderMetrics?: {
    renderTime: number
    updateCount: number
    lastUpdate: number
  }
}

export interface Snapshot {
  id: string
  name: string
  timestamp: number
  componentState: ComponentState
  themeState: ThemeState
  description?: string
  tags?: string[]
  // 版本控制
  version?: string
  isAutoSave?: boolean
}

export interface PerformanceMetrics {
  renderTime: number
  updateCount: number
  lastUpdate: number
  memoryUsage?: number
  bundleSize?: number
}

export interface PlaygroundState {
  // 当前模式
  mode: PlaygroundMode
  setMode: (mode: PlaygroundMode) => void

  // 组件状态
  currentComponentId: string
  currentProps: ComponentProps
  setCurrentComponent: (id: string, initialProps?: ComponentProps) => void
  updateProp: (key: string, value: any) => void
  resetProps: () => void

  // 组件动态加载
  loadingComponent: boolean
  componentError: Error | null
  loadComponentAsync: (id: string) => Promise<void>

  // 主题状态
  themeState: ThemeState
  updateTheme: (updates: Partial<ThemeState>) => void
  applyRecipe: (recipeId: string, customTokens?: Record<string, any>) => void

  // 历史记录 (用于 Live Props Mode)
  history: ComponentState[]
  historyIndex: number
  maxHistorySize: number
  canUndo: () => boolean
  canRedo: () => boolean
  undo: () => void
  redo: () => void
  pushHistory: (state: ComponentState) => void
  clearHistory: () => void

  // 快照管理 (Snapshot Mode)
  snapshots: Snapshot[]
  loadingSnapshots: boolean
  createSnapshot: (name: string, description?: string) => Promise<void>
  restoreSnapshot: (id: string) => Promise<void>
  deleteSnapshot: (id: string) => Promise<void>
  updateSnapshot: (id: string, updates: Partial<Snapshot>) => Promise<void>
  duplicateSnapshot: (id: string, newName?: string) => Promise<void>
  exportSnapshots: () => string
  importSnapshots: (data: string) => Promise<void>

  // 对比模式 (Compare Mode)
  compareMode: boolean
  snapshotA: string | null
  snapshotB: string | null
  setCompareMode: (enabled: boolean) => void
  setCompareSnapshots: (snapshotA: string | null, snapshotB: string | null) => void
  swapCompareSnapshots: () => void

  // UI 状态
  showPropsEditor: boolean
  showTokenInspector: boolean
  showCodeViewer: boolean
  showPerformancePanel: boolean
  togglePropsEditor: () => void
  toggleTokenInspector: () => void
  toggleCodeViewer: () => void
  togglePerformancePanel: () => void
  resetUILayout: () => void

  // 性能指标
  performanceMetrics: PerformanceMetrics
  updatePerformanceMetrics: (metrics: Partial<PerformanceMetrics>) => void
  startPerformanceTracking: () => void
  stopPerformanceTracking: () => void

  // 搜索和筛选
  searchQuery: string
  filterTags: string[]
  setSearchQuery: (query: string) => void
  setFilterTags: (tags: string[]) => void
  getFilteredSnapshots: () => Snapshot[]

  // 数据层适配器集成
  dataAdapter: DataAdapter | null
  setDataAdapter: (adapter: DataAdapter) => void
  syncToStorage: () => Promise<void>
  syncFromStorage: () => Promise<void>

  // 错误边界集成
  errorBoundary: ErrorBoundaryContext | null
  setErrorBoundary: (context: ErrorBoundaryContext) => void
  reportError: (error: Error, context?: Record<string, any>) => void

  // 自动保存
  autoSaveEnabled: boolean
  autoSaveInterval: number
  lastAutoSave: number | null
  setAutoSave: (enabled: boolean, interval?: number) => void
  triggerAutoSave: () => Promise<void>

  // 重置所有状态
  reset: () => void
  resetPreservingSnapshots: () => void

  // 状态健康检查
  validateState: () => { isValid: boolean; errors: string[] }
  repairState: () => Promise<void>
}

// ===== 初始状态 =====

const initialThemeState: ThemeState = {
  mode: 'light',
  density: 'comfortable',
  hue: 'blue',
  surface: 'flat',
  rtl: false,
}

const initialPerformanceMetrics: PerformanceMetrics = {
  renderTime: 0,
  updateCount: 0,
  lastUpdate: Date.now(),
  memoryUsage: 0,
  bundleSize: 0,
}

// ===== Store 创建 =====

export const usePlaygroundStore = create<PlaygroundState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        mode: 'live',
        currentComponentId: '',
        currentProps: {},
        loadingComponent: false,
        componentError: null,
        themeState: initialThemeState,
        history: [],
        historyIndex: -1,
        maxHistorySize: 50,
        snapshots: [],
        loadingSnapshots: false,
        compareMode: false,
        snapshotA: null,
        snapshotB: null,
        showPropsEditor: true,
        showTokenInspector: true,
        showCodeViewer: false,
        showPerformancePanel: false,
        performanceMetrics: initialPerformanceMetrics,
        searchQuery: '',
        filterTags: [],
        dataAdapter: null,
        errorBoundary: null,
        autoSaveEnabled: true,
        autoSaveInterval: 30000, // 30秒
        lastAutoSave: null,

        // 模式切换
        setMode: (mode) => {
          const state = get()
          set({ mode })

          // 记录用户操作
          state.errorBoundary?.captureUserAction('switch_mode', { mode })
        },

        // 组件状态管理
        setCurrentComponent: (id, initialProps = {}) => {
          set({ loadingComponent: true, componentError: null })

          const componentState: ComponentState = {
            name: id,
            props: initialProps,
            tokens: [], // 从 registry 获取
            dependencies: [], // 从 registry 获取
            renderMetrics: {
              renderTime: 0,
              updateCount: 0,
              lastUpdate: Date.now(),
            },
          }

          set({
            currentComponentId: id,
            currentProps: initialProps,
            history: [componentState],
            historyIndex: 0,
            loadingComponent: false,
          })

          // 记录用户操作
          get().errorBoundary?.captureUserAction('set_component', { id, propsCount: Object.keys(initialProps).length })
        },

        loadComponentAsync: async (id) => {
          const state = get()

          try {
            set({ loadingComponent: true, componentError: null })

            const componentState = state.dataAdapter ?
              await state.dataAdapter.loadComponent(id) :
              null

            if (componentState) {
              set({
                currentComponentId: componentState.name,
                currentProps: componentState.props,
                history: [componentState],
                historyIndex: 0,
                loadingComponent: false,
              })

              state.errorBoundary?.captureUserAction('load_component', { id, success: true })
            } else {
              throw new Error(`组件 ${id} 未找到`)
            }
          } catch (error) {
            const err = error as Error
            set({
              loadingComponent: false,
              componentError: err
            })
            state.reportError(err, { action: 'loadComponentAsync', componentId: id })
          }
        },

        updateProp: (key, value) => {
          const state = get()
          const startTime = performance.now()

          const newProps = {
            ...state.currentProps,
            [key]: value,
          }

          const componentState: ComponentState = {
            name: state.currentComponentId,
            props: newProps,
            tokens: [],
            dependencies: [],
            renderMetrics: {
              renderTime: state.performanceMetrics.renderTime,
              updateCount: state.performanceMetrics.updateCount + 1,
              lastUpdate: Date.now(),
            },
          }

          // 更新性能指标
          const renderTime = performance.now() - startTime
          const memoryUsage = performance.memory ? performance.memory.usedJSHeapSize : 0

          set({
            currentProps: newProps,
            performanceMetrics: {
              ...state.performanceMetrics,
              renderTime,
              updateCount: state.performanceMetrics.updateCount + 1,
              lastUpdate: Date.now(),
              memoryUsage,
            },
          })

          // 推入历史记录
          state.pushHistory(componentState)

          // 记录用户操作
          state.errorBoundary?.captureUserAction('update_prop', { key, value: typeof value })

          // 触发自动保存
          if (state.autoSaveEnabled && state.dataAdapter) {
            state.triggerAutoSave().catch(err => {
              console.warn('自动保存失败:', err)
            })
          }
        },

        resetProps: () => {
          const state = get()
          if (state.history.length > 0) {
            const firstState = state.history[0]
            set({
              currentProps: firstState.props,
              historyIndex: 0,
            })

            state.errorBoundary?.captureUserAction('reset_props')
          }
        },

        // 主题管理
        updateTheme: (updates) => {
          set((state) => {
            const newThemeState = {
              ...state.themeState,
              ...updates,
            }

            return {
              themeState: newThemeState,
            }
          })

          // 记录用户操作
          get().errorBoundary?.captureUserAction('update_theme', { updates: Object.keys(updates) })
        },

        applyRecipe: (recipeId, customTokens) => {
          set((state) => ({
            themeState: {
              ...state.themeState,
              recipeId,
              customTokens,
            },
          }))

          get().errorBoundary?.captureUserAction('apply_recipe', { recipeId })
        },

        // 历史记录管理
        canUndo: () => {
          const state = get()
          return state.historyIndex > 0
        },

        canRedo: () => {
          const state = get()
          return state.historyIndex < state.history.length - 1
        },

        undo: () => {
          const state = get()
          if (state.canUndo()) {
            const newIndex = state.historyIndex - 1
            const prevState = state.history[newIndex]
            set({
              currentProps: prevState.props,
              historyIndex: newIndex,
            })

            state.errorBoundary?.captureUserAction('undo', { index: newIndex })
          }
        },

        redo: () => {
          const state = get()
          if (state.canRedo()) {
            const newIndex = state.historyIndex + 1
            const nextState = state.history[newIndex]
            set({
              currentProps: nextState.props,
              historyIndex: newIndex,
            })

            state.errorBoundary?.captureUserAction('redo', { index: newIndex })
          }
        },

        pushHistory: (componentState) => {
          set((state) => {
            // 移除当前索引之后的历史记录
            const newHistory = state.history.slice(0, state.historyIndex + 1)
            newHistory.push(componentState)

            // 限制历史记录数量
            const maxHistory = state.maxHistorySize
            if (newHistory.length > maxHistory) {
              newHistory.shift()
            }

            return {
              history: newHistory,
              historyIndex: newHistory.length - 1,
            }
          })
        },

        clearHistory: () => {
          const state = get()
          const currentState: ComponentState = {
            name: state.currentComponentId,
            props: state.currentProps,
            tokens: [],
            dependencies: [],
          }

          set({
            history: [currentState],
            historyIndex: 0,
          })

          state.errorBoundary?.captureUserAction('clear_history')
        },

        // 快照管理
        createSnapshot: async (name, description) => {
          const state = get()

          try {
            const snapshot: Snapshot = {
              id: `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name,
              timestamp: Date.now(),
              componentState: {
                name: state.currentComponentId,
                props: { ...state.currentProps },
                tokens: [],
                dependencies: [],
                renderMetrics: state.performanceMetrics,
              },
              themeState: { ...state.themeState },
              description,
              tags: [],
              version: '1.0.0',
              isAutoSave: false,
            }

            set((prev) => ({
              snapshots: [...prev.snapshots, snapshot],
            }))

            // 保存到数据层
            if (state.dataAdapter) {
              await state.dataAdapter.saveSnapshot(snapshot)
            }

            state.errorBoundary?.captureUserAction('create_snapshot', { name, id: snapshot.id })
          } catch (error) {
            state.reportError(error as Error, { action: 'createSnapshot', name })
          }
        },

        restoreSnapshot: async (id) => {
          const state = get()

          try {
            const snapshot = state.snapshots.find((s) => s.id === id)
            if (snapshot) {
              set({
                currentComponentId: snapshot.componentState.name,
                currentProps: { ...snapshot.componentState.props },
                themeState: { ...snapshot.themeState },
              })

              // 重建历史记录
              const componentState = {
                ...snapshot.componentState,
                renderMetrics: state.performanceMetrics,
              }
              state.pushHistory(componentState)

              state.errorBoundary?.captureUserAction('restore_snapshot', { id, name: snapshot.name })
            }
          } catch (error) {
            state.reportError(error as Error, { action: 'restoreSnapshot', id })
          }
        },

        deleteSnapshot: async (id) => {
          const state = get()

          try {
            set((prev) => ({
              snapshots: prev.snapshots.filter((s) => s.id !== id),
            }))

            // 从数据层删除
            if (state.dataAdapter) {
              await state.dataAdapter.deleteSnapshot(id)
            }

            state.errorBoundary?.captureUserAction('delete_snapshot', { id })
          } catch (error) {
            state.reportError(error as Error, { action: 'deleteSnapshot', id })
          }
        },

        updateSnapshot: async (id, updates) => {
          const state = get()

          try {
            set((prev) => ({
              snapshots: prev.snapshots.map((s) =>
                s.id === id ? { ...s, ...updates } : s
              ),
            }))

            // 更新数据层
            if (state.dataAdapter) {
              const snapshot = state.snapshots.find(s => s.id === id)
              if (snapshot) {
                await state.dataAdapter.saveSnapshot(snapshot)
              }
            }

            state.errorBoundary?.captureUserAction('update_snapshot', { id, updates: Object.keys(updates) })
          } catch (error) {
            state.reportError(error as Error, { action: 'updateSnapshot', id })
          }
        },

        duplicateSnapshot: async (id, newName) => {
          const state = get()

          try {
            const originalSnapshot = state.snapshots.find((s) => s.id === id)
            if (originalSnapshot) {
              const duplicatedSnapshot: Snapshot = {
                ...originalSnapshot,
                id: `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: newName || `${originalSnapshot.name} (副本)`,
                timestamp: Date.now(),
                isAutoSave: false,
              }

              set((prev) => ({
                snapshots: [...prev.snapshots, duplicatedSnapshot],
              }))

              if (state.dataAdapter) {
                await state.dataAdapter.saveSnapshot(duplicatedSnapshot)
              }

              state.errorBoundary?.captureUserAction('duplicate_snapshot', {
                originalId: id,
                newName: duplicatedSnapshot.name,
                newId: duplicatedSnapshot.id
              })
            }
          } catch (error) {
            state.reportError(error as Error, { action: 'duplicateSnapshot', id })
          }
        },

        exportSnapshots: () => {
          const state = get()
          return JSON.stringify({
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            snapshots: state.snapshots,
            themeState: state.themeState,
          }, null, 2)
        },

        importSnapshots: async (data) => {
          const state = get()

          try {
            const importData = JSON.parse(data)

            if (importData.snapshots && Array.isArray(importData.snapshots)) {
              set((prev) => ({
                snapshots: [...prev.snapshots, ...importData.snapshots],
              }))

              // 保存到数据层
              if (state.dataAdapter) {
                for (const snapshot of importData.snapshots) {
                  await state.dataAdapter.saveSnapshot(snapshot)
                }
              }

              state.errorBoundary?.captureUserAction('import_snapshots', {
                count: importData.snapshots.length
              })
            }
          } catch (error) {
            state.reportError(error as Error, { action: 'importSnapshots' })
          }
        },

        // 对比模式
        setCompareMode: (enabled) => {
          set({ compareMode: enabled })
          if (!enabled) {
            set({ snapshotA: null, snapshotB: null })
          }

          get().errorBoundary?.captureUserAction('set_compare_mode', { enabled })
        },

        setCompareSnapshots: (snapshotA, snapshotB) => {
          set({ snapshotA, snapshotB })

          get().errorBoundary?.captureUserAction('set_compare_snapshots', { snapshotA, snapshotB })
        },

        swapCompareSnapshots: () => {
          const state = get()
          if (state.snapshotA && state.snapshotB) {
            set({
              snapshotA: state.snapshotB,
              snapshotB: state.snapshotA,
            })

            state.errorBoundary?.captureUserAction('swap_compare_snapshots')
          }
        },

        // UI 状态切换
        togglePropsEditor: () => {
          set((state) => ({ showPropsEditor: !state.showPropsEditor }))
          get().errorBoundary?.captureUserAction('toggle_props_editor')
        },

        toggleTokenInspector: () => {
          set((state) => ({ showTokenInspector: !state.showTokenInspector }))
          get().errorBoundary?.captureUserAction('toggle_token_inspector')
        },

        toggleCodeViewer: () => {
          set((state) => ({ showCodeViewer: !state.showCodeViewer }))
          get().errorBoundary?.captureUserAction('toggle_code_viewer')
        },

        togglePerformancePanel: () => {
          set((state) => ({ showPerformancePanel: !state.showPerformancePanel }))
          get().errorBoundary?.captureUserAction('toggle_performance_panel')
        },

        resetUILayout: () => {
          set({
            showPropsEditor: true,
            showTokenInspector: true,
            showCodeViewer: false,
            showPerformancePanel: false,
          })

          get().errorBoundary?.captureUserAction('reset_ui_layout')
        },

        // 性能指标
        updatePerformanceMetrics: (metrics) => {
          set((state) => ({
            performanceMetrics: {
              ...state.performanceMetrics,
              ...metrics,
            },
          }))
        },

        startPerformanceTracking: () => {
          // 启动性能监控
          if (typeof window !== 'undefined' && 'performance' in window) {
            const updateMetrics = () => {
              const state = get()
              const memoryUsage = performance.memory ? performance.memory.usedJSHeapSize : 0

              set({
                performanceMetrics: {
                  ...state.performanceMetrics,
                  memoryUsage,
                  lastUpdate: Date.now(),
                },
              })
            }

            // 每秒更新一次内存使用情况
            const intervalId = setInterval(updateMetrics, 1000)
            // 存储 interval ID 以便后续清理
            ;(window as any).__performanceInterval = intervalId

            get().errorBoundary?.captureUserAction('start_performance_tracking')
          }
        },

        stopPerformanceTracking: () => {
          // 停止性能监控
          if (typeof window !== 'undefined' && (window as any).__performanceInterval) {
            clearInterval((window as any).__performanceInterval)
            delete (window as any).__performanceInterval

            get().errorBoundary?.captureUserAction('stop_performance_tracking')
          }
        },

        // 搜索和筛选
        setSearchQuery: (query) => {
          set({ searchQuery: query })
          get().errorBoundary?.captureUserAction('set_search_query', { query })
        },

        setFilterTags: (tags) => {
          set({ filterTags: tags })
          get().errorBoundary?.captureUserAction('set_filter_tags', { tags })
        },

        getFilteredSnapshots: () => {
          const state = get()
          let filtered = state.snapshots

          // 按搜索词筛选
          if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase()
            filtered = filtered.filter(snapshot =>
              snapshot.name.toLowerCase().includes(query) ||
              snapshot.description?.toLowerCase().includes(query) ||
              snapshot.tags?.some(tag => tag.toLowerCase().includes(query))
            )
          }

          // 按标签筛选
          if (state.filterTags.length > 0) {
            filtered = filtered.filter(snapshot =>
              state.filterTags.some(tag => snapshot.tags?.includes(tag))
            )
          }

          return filtered
        },

        // 数据层适配器集成
        setDataAdapter: (adapter) => {
          set({ dataAdapter: adapter })
          get().errorBoundary?.captureUserAction('set_data_adapter')
        },

        syncToStorage: async () => {
          const state = get()
          if (!state.dataAdapter) return

          try {
            // 同步当前组件状态
            const componentState: ComponentState = {
              name: state.currentComponentId,
              props: state.currentProps,
              tokens: [],
              dependencies: [],
              renderMetrics: state.performanceMetrics,
            }
            await state.dataAdapter.saveComponent(componentState)

            // 同步主题状态
            await state.dataAdapter.saveTheme(state.themeState)

            // 同步快照状态
            for (const snapshot of state.snapshots) {
              await state.dataAdapter.saveSnapshot(snapshot)
            }

            state.errorBoundary?.captureUserAction('sync_to_storage')
          } catch (error) {
            state.reportError(error as Error, { action: 'syncToStorage' })
          }
        },

        syncFromStorage: async () => {
          const state = get()
          if (!state.dataAdapter) return

          try {
            set({ loadingSnapshots: true })

            // 同步快照
            const snapshots = await state.dataAdapter.loadSnapshots()
            if (snapshots) {
              set({ snapshots })
            }

            // 同步主题
            const themeState = await state.dataAdapter.loadTheme()
            if (themeState) {
              set({ themeState })
            }

            set({ loadingSnapshots: false })
            state.errorBoundary?.captureUserAction('sync_from_storage', { snapshotsCount: snapshots?.length })
          } catch (error) {
            set({ loadingSnapshots: false })
            state.reportError(error as Error, { action: 'syncFromStorage' })
          }
        },

        // 错误边界集成
        setErrorBoundary: (context) => {
          set({ errorBoundary: context })
        },

        reportError: (error, context) => {
          const state = get()
          if (state.errorBoundary) {
            state.errorBoundary.reportError(error, {
              ...context,
              playgroundState: {
                mode: state.mode,
                currentComponent: state.currentComponentId,
                timestamp: Date.now(),
              },
            })
          } else {
            console.error('Playground Store Error:', error, context)
          }
        },

        // 自动保存
        setAutoSave: (enabled, interval) => {
          set({
            autoSaveEnabled: enabled,
            autoSaveInterval: interval || 30000,
          })

          get().errorBoundary?.captureUserAction('set_auto_save', { enabled, interval })
        },

        triggerAutoSave: async () => {
          const state = get()
          if (!state.autoSaveEnabled || !state.dataAdapter) return

          try {
            // 创建自动保存快照
            const autoSaveSnapshot: Snapshot = {
              id: `autosave-${Date.now()}`,
              name: '自动保存',
              timestamp: Date.now(),
              componentState: {
                name: state.currentComponentId,
                props: { ...state.currentProps },
                tokens: [],
                dependencies: [],
                renderMetrics: state.performanceMetrics,
              },
              themeState: { ...state.themeState },
              description: '系统自动保存',
              tags: ['autosave'],
              version: '1.0.0',
              isAutoSave: true,
            }

            await state.dataAdapter.saveSnapshot(autoSaveSnapshot)

            set({ lastAutoSave: Date.now() })
          } catch (error) {
            state.reportError(error as Error, { action: 'triggerAutoSave' })
          }
        },

        // 重置
        reset: () => {
          set({
            mode: 'live',
            currentComponentId: '',
            currentProps: {},
            loadingComponent: false,
            componentError: null,
            themeState: initialThemeState,
            history: [],
            historyIndex: -1,
            snapshots: [],
            loadingSnapshots: false,
            compareMode: false,
            snapshotA: null,
            snapshotB: null,
            showPropsEditor: true,
            showTokenInspector: true,
            showCodeViewer: false,
            showPerformancePanel: false,
            performanceMetrics: initialPerformanceMetrics,
            searchQuery: '',
            filterTags: [],
            lastAutoSave: null,
          })

          get().errorBoundary?.captureUserAction('reset_all')
        },

        resetPreservingSnapshots: () => {
          set((state) => ({
            mode: 'live',
            currentComponentId: '',
            currentProps: {},
            loadingComponent: false,
            componentError: null,
            themeState: initialThemeState,
            history: [],
            historyIndex: -1,
            compareMode: false,
            snapshotA: null,
            snapshotB: null,
            showPropsEditor: true,
            showTokenInspector: true,
            showCodeViewer: false,
            showPerformancePanel: false,
            performanceMetrics: initialPerformanceMetrics,
            searchQuery: '',
            filterTags: [],
            lastAutoSave: null,
            // 保留快照
            snapshots: state.snapshots,
            loadingSnapshots: false,
          }))

          get().errorBoundary?.captureUserAction('reset_preserving_snapshots')
        },

        // 状态健康检查
        validateState: () => {
          const state = get()
          const errors: string[] = []

          // 检查历史记录一致性
          if (state.historyIndex < -1 || state.historyIndex >= state.history.length) {
            errors.push('历史记录索引超出范围')
          }

          // 检查快照数据完整性
          state.snapshots.forEach((snapshot, index) => {
            if (!snapshot.id || !snapshot.name) {
              errors.push(`快照 ${index} 缺少必要字段`)
            }
            if (!snapshot.componentState || !snapshot.themeState) {
              errors.push(`快照 ${index} 数据不完整`)
            }
          })

          // 检查对比模式状态
          if (state.compareMode && (!state.snapshotA || !state.snapshotB)) {
            errors.push('对比模式状态不完整')
          }

          return {
            isValid: errors.length === 0,
            errors,
          }
        },

        repairState: async () => {
          const state = get()
          const validation = state.validateState()

          if (!validation.isValid) {
            console.warn('发现状态问题，正在修复:', validation.errors)

            // 修复历史记录索引
            if (state.historyIndex < -1 || state.historyIndex >= state.history.length) {
              set({ historyIndex: Math.max(0, state.history.length - 1) })
            }

            // 修复快照数据
            const validSnapshots = state.snapshots.filter(snapshot =>
              snapshot.id && snapshot.name && snapshot.componentState && snapshot.themeState
            )
            if (validSnapshots.length !== state.snapshots.length) {
              set({ snapshots: validSnapshots })
            }

            // 修复对比模式
            if (state.compareMode && (!state.snapshotA || !state.snapshotB)) {
              set({ compareMode: false, snapshotA: null, snapshotB: null })
            }

            state.errorBoundary?.captureUserAction('repair_state', {
              errorsFound: validation.errors.length,
              errorsFixed: validation.errors.length,
            })
          }
        },
      }),
      {
        name: 'xorigo-playground-storage',
        partialize: (state) => ({
          // 持久化配置
          snapshots: state.snapshots,
          themeState: state.themeState,
          showPropsEditor: state.showPropsEditor,
          showTokenInspector: state.showTokenInspector,
          showCodeViewer: state.showCodeViewer,
          showPerformancePanel: state.showPerformancePanel,
          autoSaveEnabled: state.autoSaveEnabled,
          autoSaveInterval: state.autoSaveInterval,
          maxHistorySize: state.maxHistorySize,
        }),
        version: 1,
      }
    ),
    { name: 'PlaygroundStore' }
  )
)

// ===== Store 实例 (用于高级用法) =====

export const playgroundStore = usePlaygroundStore.getState

// ===== Shallow 选择器 (性能优化) =====

export const usePlaygroundMode = () =>
  usePlaygroundStore((state) => state.mode)

export const useCurrentComponent = () =>
  usePlaygroundStore(
    (state) => ({
      id: state.currentComponentId,
      props: state.currentProps,
      loading: state.loadingComponent,
      error: state.componentError,
      updateProp: state.updateProp,
      resetProps: state.resetProps,
      loadComponentAsync: state.loadComponentAsync,
    }),
    shallow
  )

export const useThemeState = () =>
  usePlaygroundStore(
    (state) => ({
      themeState: state.themeState,
      updateTheme: state.updateTheme,
      applyRecipe: state.applyRecipe,
    }),
    shallow
  )

export const useHistory = () =>
  usePlaygroundStore(
    (state) => ({
      history: state.history,
      historyIndex: state.historyIndex,
      canUndo: state.canUndo(),
      canRedo: state.canRedo(),
      undo: state.undo,
      redo: state.redo,
      clearHistory: state.clearHistory,
    }),
    shallow
  )

export const useSnapshots = () =>
  usePlaygroundStore(
    (state) => ({
      snapshots: state.snapshots,
      loading: state.loadingSnapshots,
      filteredSnapshots: state.getFilteredSnapshots(),
      createSnapshot: state.createSnapshot,
      restoreSnapshot: state.restoreSnapshot,
      deleteSnapshot: state.deleteSnapshot,
      updateSnapshot: state.updateSnapshot,
      duplicateSnapshot: state.duplicateSnapshot,
      exportSnapshots: state.exportSnapshots,
      importSnapshots: state.importSnapshots,
    }),
    shallow
  )

export const useCompareMode = () =>
  usePlaygroundStore(
    (state) => ({
      compareMode: state.compareMode,
      snapshotA: state.snapshotA,
      snapshotB: state.snapshotB,
      setCompareMode: state.setCompareMode,
      setCompareSnapshots: state.setCompareSnapshots,
      swapCompareSnapshots: state.swapCompareSnapshots,
    }),
    shallow
  )

export const useUIState = () =>
  usePlaygroundStore(
    (state) => ({
      showPropsEditor: state.showPropsEditor,
      showTokenInspector: state.showTokenInspector,
      showCodeViewer: state.showCodeViewer,
      showPerformancePanel: state.showPerformancePanel,
      togglePropsEditor: state.togglePropsEditor,
      toggleTokenInspector: state.toggleTokenInspector,
      toggleCodeViewer: state.toggleCodeViewer,
      togglePerformancePanel: state.togglePerformancePanel,
      resetUILayout: state.resetUILayout,
    }),
    shallow
  )

export const usePerformanceMetrics = () =>
  usePlaygroundStore(
    (state) => ({
      metrics: state.performanceMetrics,
      updateMetrics: state.updatePerformanceMetrics,
      startTracking: state.startPerformanceTracking,
      stopTracking: state.stopPerformanceTracking,
    }),
    shallow
  )

export const useSearchAndFilter = () =>
  usePlaygroundStore(
    (state) => ({
      searchQuery: state.searchQuery,
      filterTags: state.filterTags,
      setSearchQuery: state.setSearchQuery,
      setFilterTags: state.setFilterTags,
      getFilteredSnapshots: state.getFilteredSnapshots,
    }),
    shallow
  )

export const useDataAdapter = () =>
  usePlaygroundStore(
    (state) => ({
      adapter: state.dataAdapter,
      setAdapter: state.setDataAdapter,
      syncToStorage: state.syncToStorage,
      syncFromStorage: state.syncFromStorage,
    }),
    shallow
  )

export const useAutoSave = () =>
  usePlaygroundStore(
    (state) => ({
      enabled: state.autoSaveEnabled,
      interval: state.autoSaveInterval,
      lastAutoSave: state.lastAutoSave,
      setAutoSave: state.setAutoSave,
      triggerAutoSave: state.triggerAutoSave,
    }),
    shallow
  )

export const usePlaygroundActions = () =>
  usePlaygroundStore(
    (state) => ({
      setMode: state.setMode,
      setCurrentComponent: state.setCurrentComponent,
      updateProp: state.updateProp,
      resetProps: state.resetProps,
      updateTheme: state.updateTheme,
      applyRecipe: state.applyRecipe,
      undo: state.undo,
      redo: state.redo,
      reset: state.reset,
      resetPreservingSnapshots: state.resetPreservingSnapshots,
      validateState: state.validateState,
      repairState: state.repairState,
    }),
    shallow
  )

// ===== 工具函数 =====

/**
 * 获取当前快照的差异对比
 */
export const useSnapshotDiff = () => {
  const { snapshotA, snapshotB, snapshots } = usePlaygroundStore()

  const getDiff = () => {
    if (!snapshotA || !snapshotB) return null

    const snapA = snapshots.find(s => s.id === snapshotA)
    const snapB = snapshots.find(s => s.id === snapshotB)

    if (!snapA || !snapB) return null

    return {
      componentDiff: compareObjects(snapA.componentState.props, snapB.componentState.props),
      themeDiff: compareObjects(snapA.themeState, snapB.themeState),
    }
  }

  return { getDiff }
}

/**
 * 简单的对象比较工具
 */
function compareObjects(obj1: any, obj2: any) {
  const diff: { [key: string]: { old: any; new: any } } = {}

  for (const key in obj1) {
    if (obj1[key] !== obj2[key]) {
      diff[key] = { old: obj1[key], new: obj2[key] }
    }
  }

  for (const key in obj2) {
    if (!(key in obj1)) {
      diff[key] = { old: undefined, new: obj2[key] }
    }
  }

  return diff
}
