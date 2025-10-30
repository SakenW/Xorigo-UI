/**
 * 调试工具模块入口文件
 * Phase 3.3 高级调试工具
 */

// 主要组件
export { DebugToolsMain } from './debug-tools-main'
export type { DebugToolType } from './debug-tools-main'

// 性能分析器
export { PerformanceProfiler } from './performance/performance-profiler'

// 依赖关系可视化
export { DependencyVisualizer } from './dependency/dependency-visualizer'

// 错误边界检测
export {
  ErrorBoundaryDetector,
  DebugErrorBoundary,
  withErrorBoundary
} from './error/error-boundary-detector'

// 热重载监控
export { HotReloadMonitor } from './hot-reload/hot-reload-monitor'

// 核心引擎
export {
  DebugTools,
  globalProfiler,
  globalDependencyAnalyzer,
  globalErrorDetector,
  globalHotReloadMonitor
} from './core/debug-engine'

// 类型定义
export type {
  PerformanceMetrics,
  DependencyGraph,
  DependencyNode,
  DependencyEdge,
  ErrorReport,
  HotReloadMetrics,
  DebugToolPanel,
  PerformanceReport,
  ErrorReportSummary,
  HotReloadReport,
  DebugSession
} from './types/debug'