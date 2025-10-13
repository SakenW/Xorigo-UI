/**
 * @fileoverview Stores 模块入口文件
 * 统一导出所有状态管理相关的 stores 和 hooks
 */

// 主要 Store
export { usePlaygroundStore } from './playground.store'

// 选择器 hooks
export {
  usePlaygroundMode,
  useCurrentComponent,
  useThemeState,
  useHistory,
  useSnapshots,
  useCompareMode,
  useUIState,
  usePerformanceMetrics,
  useSearchAndFilter,
  useDataAdapter,
  useAutoSave,
  usePlaygroundActions,
  useSnapshotDiff,
} from './playground.store'

// 类型导出
export type {
  PlaygroundMode,
  ThemeState,
  ComponentProps,
  ComponentState,
  Snapshot,
  PerformanceMetrics,
  PlaygroundState,
  DataAdapter,
  ErrorBoundaryContext,
} from './playground.store'

// Store 实例 (用于高级用法)
export { playgroundStore } from './playground.store'

// 数据适配器
export { LocalStorageAdapter, localStorageAdapter } from './adapters/local-storage-adapter'

// 错误边界
export { PlaygroundErrorBoundary, playgroundErrorBoundary } from './error-boundary-context'

// 初始化工具
export {
  initializePlayground,
  cleanupPlayground,
  getPlaygroundStateSummary,
  exportPlaygroundData,
  importPlaygroundData,
} from './playground-init'

export type { PlaygroundInitOptions } from './playground-init'