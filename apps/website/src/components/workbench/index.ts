/**
 * Workbench 集成组件导出
 * Phase 2 Workbench集成任务的完整实现
 */

// 核心集成组件
export { IntegratedWorkbench, DEFAULT_INTEGRATED_CONFIG } from './workbench-integrated'
export type { IntegratedWorkbenchProps, IntegratedWorkbenchConfig } from './workbench-integrated'

// 实时预览系统
export { WorkbenchLivePreview, PreviewFactory, clearPreviewCache } from './preview/workbench-live-preview'
export type { ComponentPreviewConfig } from './preview/workbench-live-preview'

// Monaco编辑器集成
export { WorkbenchMonacoEditor } from './editor/workbench-monaco-editor'
export type { WorkbenchMonacoEditorProps, MonacoEditorConfig, EditorEvents } from './editor/workbench-monaco-editor'

// 配方可视化编辑器
export { RecipeVisualEditor } from './recipe/recipe-visual-editor'
export type { RecipeVisualEditorProps, SevenAxisTheme } from './recipe/recipe-visual-editor'

// 开发工具集成
export { WorkbenchDevtools } from './devtools/workbench-devtools'
export type {
  WorkbenchDevtoolsProps,
  PerformanceMetrics,
  AccessibilityCheck,
  CodeQualityAnalysis
} from './devtools/workbench-devtools'

// 性能优化器
export { WorkbenchPerformanceOptimizer, usePerformanceOptimizer } from './performance/workbench-performance-optimizer'
export type {
  WorkbenchPerformanceOptimizerProps,
  OptimizationSuggestion,
  CacheConfig,
  ConcurrencyConfig
} from './performance/workbench-performance-optimizer'

// 类型定义
export type {
  ViewMode,
  WorkbenchTab,
  Recipe,
  Category,
  ComponentExample,
  WorkbenchContextType
} from './workbench-types'

// Hook导出
export { useWorkbench, useGalleryState, useEditorState, useModeSwitching } from './workbench-context'

// 版本信息
export const WORKBENCH_VERSION = '2.0.0-phase2'
export const BUILD_DATE = new Date().toISOString()
export const FEATURES = {
  LIVE_PREVIEW: true,
  MONACO_EDITOR: true,
  RECIPE_EDITOR: true,
  DEVTOOLS: true,
  PERFORMANCE_OPTIMIZER: true,
  AUTO_SAVE: true,
  CONCURRENT_SUPPORT: true,
  SEVEN_AXIS_THEME: true,
  ACCESSIBILITY_CHECK: true,
  CODE_QUALITY_ANALYSIS: true
} as const