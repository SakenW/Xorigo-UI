/**
 * 性能监控类型定义
 */

// Core Web Vitals 指标
export interface CoreWebVitals {
  /** Largest Contentful Paint - 最大内容绘制 */
  LCP?: number
  /** First Input Delay - 首次输入延迟 */
  FID?: number
  /** Cumulative Layout Shift - 累积布局偏移 */
  CLS?: number
  /** First Contentful Paint - 首次内容绘制 */
  FCP?: number
  /** Time to First Byte - 首字节时间 */
  TTFB?: number
  /** Interaction to Next Paint - 交互到下次绘制 */
  INP?: number
}

// 性能指标阈值
export interface PerformanceThresholds {
  LCP: { good: number; needsImprovement: number }
  FID: { good: number; needsImprovement: number }
  CLS: { good: number; needsImprovement: number }
  FCP: { good: number; needsImprovement: number }
  TTFB: { good: number; needsImprovement: number }
  INP: { good: number; needsImprovement: number }
}

// 性能评分
export type PerformanceScore = 'good' | 'needs-improvement' | 'poor' | 'unknown'

// 性能报告
export interface PerformanceReport {
  timestamp: number
  metrics: CoreWebVitals
  scores: Record<keyof CoreWebVitals, PerformanceScore>
  overallScore: number
  navigation: PerformanceNavigationTiming | null
  resources: PerformanceResourceTiming[]
  memory?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
}

// 自定义性能标记
export interface CustomMetric {
  name: string
  value: number
  timestamp: number
  category: 'component' | 'theme' | 'search' | 'route' | 'interaction' | 'other'
}

// 性能监控配置
export interface PerformanceMonitorConfig {
  enabled: boolean
  reportInterval: number // 上报间隔 (ms)
  sampleRate: number // 采样率 (0-1)
  thresholds: PerformanceThresholds
  enableResourceTiming: boolean
  enableLongTaskMonitoring: boolean
  maxResourceEntries: number
}

// Bundle 分析数据
export interface BundleAnalysis {
  totalSize: number
  chunks: Array<{
    name: string
    size: number
    modules: number
  }>
  largestModules: Array<{
    name: string
    size: number
  }>
  duplicates: Array<{
    name: string
    count: number
    totalSize: number
  }>
}

// 组件性能数据
export interface ComponentPerformance {
  name: string
  renderCount: number
  averageRenderTime: number
  maxRenderTime: number
  lastRenderTime: number
}
