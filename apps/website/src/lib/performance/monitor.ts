/**
 * Core Web Vitals 性能监控核心模块
 * 基于 web-vitals 库和 Performance Observer API
 */

import type {
  CoreWebVitals,
  PerformanceReport,
  PerformanceScore,
  PerformanceMonitorConfig,
  PerformanceThresholds,
  CustomMetric,
  ComponentPerformance
} from './types'

// 默认阈值 (基于 Google Web Vitals 标准)
const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
  INP: { good: 200, needsImprovement: 500 }
}

// 默认配置
const DEFAULT_CONFIG: PerformanceMonitorConfig = {
  enabled: true,
  reportInterval: 30000, // 30秒
  sampleRate: 1.0, // 100%采样
  thresholds: DEFAULT_THRESHOLDS,
  enableResourceTiming: true,
  enableLongTaskMonitoring: true,
  maxResourceEntries: 150
}

/**
 * 性能监控管理器
 */
class PerformanceMonitor {
  private config: PerformanceMonitorConfig
  private metrics: Partial<CoreWebVitals> = {}
  private customMetrics: Map<string, CustomMetric> = new Map()
  private componentMetrics: Map<string, ComponentPerformance> = new Map()
  private observers: PerformanceObserver[] = []
  private reportTimer: NodeJS.Timeout | null = null

  constructor(config: Partial<PerformanceMonitorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }

    if (this.config.enabled && typeof window !== 'undefined') {
      this.init()
    }
  }

  /**
   * 初始化性能监控
   */
  private init() {
    // 监控 LCP (Largest Contentful Paint)
    this.observeLCP()

    // 监控 FID (First Input Delay)
    this.observeFID()

    // 监控 CLS (Cumulative Layout Shift)
    this.observeCLS()

    // 监控 FCP (First Contentful Paint)
    this.observeFCP()

    // 监控 TTFB (Time to First Byte)
    this.observeTTFB()

    // 监控 INP (Interaction to Next Paint)
    this.observeINP()

    // 监控资源加载
    if (this.config.enableResourceTiming) {
      this.observeResourceTiming()
    }

    // 监控长任务
    if (this.config.enableLongTaskMonitoring) {
      this.observeLongTasks()
    }

    // 定期上报
    this.startReporting()
  }

  /**
   * 监控 LCP
   */
  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number
          loadTime?: number
        }

        if (lastEntry) {
          const value = lastEntry.renderTime || lastEntry.loadTime || 0
          this.metrics.LCP = value
        }
      })

      observer.observe({ type: 'largest-contentful-paint', buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn('LCP monitoring not supported:', error)
    }
  }

  /**
   * 监控 FID
   */
  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: PerformanceEntry & { processingStart?: number }) => {
          const fid = entry.processingStart
            ? entry.processingStart - entry.startTime
            : 0
          this.metrics.FID = Math.max(this.metrics.FID || 0, fid)
        })
      })

      observer.observe({ type: 'first-input', buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn('FID monitoring not supported:', error)
    }
  }

  /**
   * 监控 CLS
   */
  private observeCLS() {
    try {
      let clsValue = 0

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: PerformanceEntry & { value?: number; hadRecentInput?: boolean }) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value || 0
            this.metrics.CLS = clsValue
          }
        })
      })

      observer.observe({ type: 'layout-shift', buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn('CLS monitoring not supported:', error)
    }
  }

  /**
   * 监控 FCP
   */
  private observeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.FCP = entry.startTime
          }
        })
      })

      observer.observe({ type: 'paint', buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn('FCP monitoring not supported:', error)
    }
  }

  /**
   * 监控 TTFB
   */
  private observeTTFB() {
    try {
      if ('navigation' in performance && performance.navigation) {
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

        if (navEntry) {
          this.metrics.TTFB = navEntry.responseStart - navEntry.requestStart
        }
      }
    } catch (error) {
      console.warn('TTFB monitoring not supported:', error)
    }
  }

  /**
   * 监控 INP (Interaction to Next Paint)
   */
  private observeINP() {
    try {
      let maxINP = 0

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: PerformanceEntry & { processingStart?: number; processingEnd?: number }) => {
          const processingStart = entry.processingStart || 0
          const processingEnd = entry.processingEnd || 0
          const inp = processingEnd - entry.startTime

          if (inp > maxINP) {
            maxINP = inp
            this.metrics.INP = inp
          }
        })
      })

      observer.observe({ type: 'event', buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn('INP monitoring not supported:', error)
    }
  }

  /**
   * 监控资源加载
   */
  private observeResourceTiming() {
    try {
      const observer = new PerformanceObserver((list) => {
        // 限制资源条目数量
        if (performance.getEntriesByType('resource').length > this.config.maxResourceEntries) {
          performance.clearResourceTimings()
        }
      })

      observer.observe({ type: 'resource', buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn('Resource timing monitoring not supported:', error)
    }
  }

  /**
   * 监控长任务
   */
  private observeLongTasks() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.duration > 50) {
            // 长任务 > 50ms
            this.recordCustomMetric({
              name: 'long-task',
              value: entry.duration,
              timestamp: Date.now(),
              category: 'other'
            })
          }
        })
      })

      observer.observe({ type: 'longtask', buffered: true })
      this.observers.push(observer)
    } catch (error) {
      console.warn('Long task monitoring not supported:', error)
    }
  }

  /**
   * 计算性能评分
   */
  private calculateScore(metric: keyof CoreWebVitals, value: number): PerformanceScore {
    const threshold = this.config.thresholds[metric]

    if (!threshold) return 'unknown'

    if (value <= threshold.good) {
      return 'good'
    } else if (value <= threshold.needsImprovement) {
      return 'needs-improvement'
    } else {
      return 'poor'
    }
  }

  /**
   * 生成性能报告
   */
  getReport(): PerformanceReport {
    const scores: Record<string, PerformanceScore> = {}
    let totalScore = 0
    let scoreCount = 0

    // 计算各指标评分
    Object.entries(this.metrics).forEach(([key, value]) => {
      if (value !== undefined) {
        const score = this.calculateScore(key as keyof CoreWebVitals, value)
        scores[key] = score

        // 计算总分 (good=100, needs-improvement=50, poor=0)
        const scoreValue = score === 'good' ? 100 : score === 'needs-improvement' ? 50 : 0
        totalScore += scoreValue
        scoreCount++
      }
    })

    const overallScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0

    // 获取导航和资源性能数据
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming || null
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]

    // 获取内存使用情况
    const memory = (performance as Performance & {
      memory?: {
        usedJSHeapSize: number
        totalJSHeapSize: number
        jsHeapSizeLimit: number
      }
    }).memory

    return {
      timestamp: Date.now(),
      metrics: this.metrics as CoreWebVitals,
      scores: scores as Record<keyof CoreWebVitals, PerformanceScore>,
      overallScore,
      navigation,
      resources,
      memory: memory ? {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      } : undefined
    }
  }

  /**
   * 记录自定义指标
   */
  recordCustomMetric(metric: CustomMetric) {
    this.customMetrics.set(metric.name, metric)
  }

  /**
   * 记录组件性能
   */
  recordComponentRender(name: string, renderTime: number) {
    const existing = this.componentMetrics.get(name)

    if (existing) {
      existing.renderCount++
      existing.lastRenderTime = renderTime
      existing.averageRenderTime =
        (existing.averageRenderTime * (existing.renderCount - 1) + renderTime) / existing.renderCount
      existing.maxRenderTime = Math.max(existing.maxRenderTime, renderTime)
    } else {
      this.componentMetrics.set(name, {
        name,
        renderCount: 1,
        averageRenderTime: renderTime,
        maxRenderTime: renderTime,
        lastRenderTime: renderTime
      })
    }
  }

  /**
   * 获取组件性能数据
   */
  getComponentMetrics(): ComponentPerformance[] {
    return Array.from(this.componentMetrics.values())
  }

  /**
   * 获取自定义指标
   */
  getCustomMetrics(): CustomMetric[] {
    return Array.from(this.customMetrics.values())
  }

  /**
   * 开始定期上报
   */
  private startReporting() {
    if (this.reportTimer) {
      clearInterval(this.reportTimer)
    }

    this.reportTimer = setInterval(() => {
      if (Math.random() < this.config.sampleRate) {
        const report = this.getReport()
        this.onReport(report)
      }
    }, this.config.reportInterval)
  }

  /**
   * 上报回调 (可被重写)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onReport(report: PerformanceReport) {
    // 默认实现：输出到控制台
    console.log('[PerformanceMonitor] Report:', report)
  }

  /**
   * 清理资源
   */
  dispose() {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []

    if (this.reportTimer) {
      clearInterval(this.reportTimer)
      this.reportTimer = null
    }
  }
}

// 导出单例
export const performanceMonitor = new PerformanceMonitor()

// 导出类
export { PerformanceMonitor }
