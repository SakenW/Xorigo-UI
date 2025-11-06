/**
 * Xorigo UI 性能优化工具包
 *
 * @version 1.0.0
 * @author Xorigo UI Team
 */

// ==================== 导出所有功能 ====================

export { default as PerformanceMonitor } from './monitor'
export type {
  PerformanceMetric,
  RenderMetrics,
  MemoryMetrics,
  ComponentMetrics,
  PerformanceThresholds,
  MonitoringConfig
} from './monitor'

export { default as BottleneckDetector } from './bottleneck-detector'
export type {
  Bottleneck,
  ReRenderAnalysis,
  MemoryLeakAnalysis,
  FunctionPerformanceAnalysis,
  DetectionConfig,
  DetectionResult
} from './bottleneck-detector'

export { default as PerformanceOptimizer } from './optimizer'
export type {
  OptimizationStrategy,
  CodeChange,
  OptimizationResult,
  MemoizationSuggestion,
  LazyLoadingSuggestion,
  ComponentSplitSuggestion,
  BundleOptimization,
  OptimizationConfig
} from './optimizer'

export { default as BundleAnalyzer } from './bundle-analyzer'
export type {
  BundleModule,
  BundleStats,
  TreeShakingAnalysis,
  DependencyAnalysis,
  BundleOptimizationSuggestion,
  BundleSizeTarget,
  AnalysisConfig
} from './bundle-analyzer'

// ==================== 便捷工具 ====================

/**
 * 快速开始性能监控
 */
export function startQuickMonitoring(config?: Partial<MonitoringConfig>) {
  const monitor = new PerformanceMonitor(config)
  monitor.start()
  return monitor
}

/**
 * 快速检测性能瓶颈
 */
export function quickBottleneckDetection(config?: Partial<DetectionConfig>) {
  const detector = new BottleneckDetector(config)
  detector.start()
  return detector
}

/**
 * 快速Bundle分析
 */
export async function quickBundleAnalysis(bundlePath: string, config?: Partial<AnalysisConfig>) {
  const analyzer = new BundleAnalyzer(config)
  await analyzer.analyzeBundle(bundlePath)
  return analyzer
}

// ==================== 全局实例 ====================

export const globalMonitor = new PerformanceMonitor()
export const globalDetector = new BottleneckDetector()
export const globalOptimizer = new PerformanceOptimizer()
