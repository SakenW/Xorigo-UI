/**
 * Xorigo UI 性能监控器
 *
 * 提供实时的性能监控功能，包括渲染时间、内存使用、重渲染检测等
 * 支持组件级和应用程序级的性能监控，帮助开发者及时发现性能瓶颈
 *
 * @version 1.0.0
 * @author Xorigo UI Team
 */

// ==================== 类型定义 ====================

export interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count' | 'percent'
  timestamp: number
  componentId?: string
  metadata?: Record<string, any>
}

export interface RenderMetrics {
  renderCount: number
  renderTime: number
  lastRenderTime: number
  averageRenderTime: number
  totalRenderTime: number
  memoryUsage: number
  reRenderReasons: Record<string, number>
  optimizationScore: number
  recommendations: string[]
}

export interface MemoryMetrics {
  currentUsage: number // MB
  peakUsage: number
  averageUsage: number
  trend: 'increasing' | 'decreasing' | 'stable'
  growthRate: number // MB/min
  heapSize: {
    used: number
    total: number
    limit: number
  }
  gcEvents: number
  timestamp: number
}

export interface ComponentMetrics {
  componentName: string
  instanceId: string
  renderMetrics: RenderMetrics
  memoryMetrics: MemoryMetrics
  lifecycleMetrics: {
    mountTime: number
    unmountTime?: number
    mountCount: number
  }
  propsChangeCount: number
  stateChangeCount: number
  childrenCount: number
  domNodesCount: number
}

export interface PerformanceThresholds {
  maxRenderTime: number
  maxMemoryUsage: number
  maxRenderCount: number
  maxReRenderRate: number
  maxGrowthRate: number
}

export interface MonitoringConfig {
  enableRealTimeMonitoring: boolean
  enableMemoryTracking: boolean
  enableComponentTracking: boolean
  enableLifecycleTracking: boolean
  sampleRate: number
  bufferSize: number
  thresholds: PerformanceThresholds
  trackMemoryLeaks: boolean
  enableProfiling: boolean
}

// ==================== 性能监控器类 ====================

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map()
  private componentMetrics: Map<string, ComponentMetrics> = new Map()
  private memorySnapshots: MemoryMetrics[] = []
  private config: MonitoringConfig
  private isMonitoring: boolean = false
  private monitoringInterval?: NodeJS.Timeout
  private gcObserver?: PerformanceObserver
  private observers: Map<string, PerformanceObserver> = new Map()
  private subscribers: Set<(metric: PerformanceMetric) => void> = new Set()
  private startTime: number = Date.now()

  constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = {
      enableRealTimeMonitoring: true,
      enableMemoryTracking: true,
      enableComponentTracking: true,
      enableLifecycleTracking: true,
      sampleRate: 1, // 监控所有事件
      bufferSize: 1000,
      trackMemoryLeaks: true,
      enableProfiling: false,
      thresholds: {
        maxRenderTime: 16, // ms, 超过一帧时间
        maxMemoryUsage: 70, // MB
        maxRenderCount: 1000,
        maxReRenderRate: 0.5, // 每秒重渲染率
        maxGrowthRate: 10 // MB/分钟
      },
      ...config
    }
  }

  // ==================== 监控控制 ====================

  /**
   * 开始监控
   */
  start(): void {
    if (this.isMonitoring) return

    this.isMonitoring = true
    this.startTime = Date.now()

    // 启动内存监控
    if (this.config.enableMemoryTracking) {
      this.startMemoryMonitoring()
    }

    // 启动实时监控
    if (this.config.enableRealTimeMonitoring) {
      this.startRealTimeMonitoring()
    }

    // 启动性能分析
    if (this.config.enableProfiling) {
      this.startProfiling()
    }

    console.log('[PerformanceMonitor] 开始性能监控')
  }

  /**
   * 停止监控
   */
  stop(): void {
    if (!this.isMonitoring) return

    this.isMonitoring = false

    // 清理定时器
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = undefined
    }

    // 清理观察器
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()

    if (this.gcObserver) {
      this.gcObserver.disconnect()
      this.gcObserver = undefined
    }

    console.log('[PerformanceMonitor] 停止性能监控')
  }

  /**
   * 重置所有指标
   */
  reset(): void {
    this.metrics.clear()
    this.componentMetrics.clear()
    this.memorySnapshots = []
    this.startTime = Date.now()
  }

  // ==================== 组件监控 ====================

  /**
   * 开始监控组件
   */
  startComponentTracking(componentName: string, instanceId: string): void {
    const key = `${componentName}:${instanceId}`

    if (this.componentMetrics.has(key)) {
      return
    }

    const metrics: ComponentMetrics = {
      componentName,
      instanceId,
      renderMetrics: {
        renderCount: 0,
        renderTime: 0,
        lastRenderTime: 0,
        averageRenderTime: 0,
        totalRenderTime: 0,
        memoryUsage: 0,
        reRenderReasons: {},
        optimizationScore: 100,
        recommendations: []
      },
      memoryMetrics: {
        currentUsage: 0,
        peakUsage: 0,
        averageUsage: 0,
        trend: 'stable',
        growthRate: 0,
        heapSize: {
          used: 0,
          total: 0,
          limit: 0
        },
        gcEvents: 0,
        timestamp: Date.now()
      },
      lifecycleMetrics: {
        mountTime: Date.now(),
        unmountTime: undefined,
        mountCount: 1
      },
      propsChangeCount: 0,
      stateChangeCount: 0,
      childrenCount: 0,
      domNodesCount: 0
    }

    this.componentMetrics.set(key, metrics)

    // 记录组件挂载事件
    this.recordMetric({
      name: 'component.mount',
      value: 1,
      unit: 'count',
      timestamp: Date.now(),
      componentId: key
    })
  }

  /**
   * 停止监控组件
   */
  stopComponentTracking(componentName: string, instanceId: string): void {
    const key = `${componentName}:${instanceId}`
    const metrics = this.componentMetrics.get(key)

    if (metrics) {
      metrics.lifecycleMetrics.unmountTime = Date.now()

      // 记录组件卸载事件
      this.recordMetric({
        name: 'component.unmount',
        value: 1,
        unit: 'count',
        timestamp: Date.now(),
        componentId: key
      })
    }
  }

  /**
   * 记录组件渲染
   */
  recordRender(componentName: string, instanceId: string, renderTime: number, reason?: string): void {
    const key = `${componentName}:${instanceId}`
    const metrics = this.componentMetrics.get(key)

    if (!metrics) return

    const renderMetrics = metrics.renderMetrics

    renderMetrics.renderCount++
    renderMetrics.renderTime += renderTime
    renderMetrics.lastRenderTime = renderTime
    renderMetrics.totalRenderTime += renderTime
    renderMetrics.averageRenderTime = renderMetrics.totalRenderTime / renderMetrics.renderCount

    if (reason) {
      renderMetrics.reRenderReasons[reason] = (renderMetrics.reRenderReasons[reason] || 0) + 1
    }

    // 更新内存使用
    if ('memory' in performance) {
      renderMetrics.memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024
    }

    // 计算优化分数
    renderMetrics.optimizationScore = this.calculateOptimizationScore(renderMetrics)

    // 生成建议
    renderMetrics.recommendations = this.generateRecommendations(renderMetrics, this.config.thresholds)

    // 记录渲染指标
    this.recordMetric({
      name: 'component.render',
      value: renderTime,
      unit: 'ms',
      timestamp: Date.now(),
      componentId: key,
      metadata: { reason }
    })

    // 检查阈值
    if (renderTime > this.config.thresholds.maxRenderTime) {
      this.recordMetric({
        name: 'component.render.warning',
        value: renderTime,
        unit: 'ms',
        timestamp: Date.now(),
        componentId: key,
        metadata: {
          threshold: this.config.thresholds.maxRenderTime,
          reason: 'render_time_exceeded'
        }
      })
    }
  }

  /**
   * 记录Props变化
   */
  recordPropsChange(componentName: string, instanceId: string): void {
    const key = `${componentName}:${instanceId}`
    const metrics = this.componentMetrics.get(key)

    if (metrics) {
      metrics.propsChangeCount++

      this.recordMetric({
        name: 'component.props_change',
        value: 1,
        unit: 'count',
        timestamp: Date.now(),
        componentId: key
      })
    }
  }

  /**
   * 记录State变化
   */
  recordStateChange(componentName: string, instanceId: string): void {
    const key = `${componentName}:${instanceId}`
    const metrics = this.componentMetrics.get(key)

    if (metrics) {
      metrics.stateChangeCount++

      this.recordMetric({
        name: 'component.state_change',
        value: 1,
        unit: 'count',
        timestamp: Date.now(),
        componentId: key
      })
    }
  }

  // ==================== 内存监控 ====================

  /**
   * 记录内存快照
   */
  private recordMemorySnapshot(): void {
    if (!('memory' in performance)) {
      console.warn('Memory API not available')
      return
    }

    const memory = (performance as any).memory
    const snapshot: MemoryMetrics = {
      currentUsage: memory.usedJSHeapSize / 1024 / 1024,
      peakUsage: Math.max(...this.memorySnapshots.map(s => s.currentUsage), 0),
      averageUsage: this.memorySnapshots.length > 0
        ? this.memorySnapshots.reduce((sum, s) => sum + s.currentUsage, 0) / this.memorySnapshots.length
        : 0,
      trend: this.calculateMemoryTrend(),
      growthRate: this.calculateMemoryGrowthRate(),
      heapSize: {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      },
      gcEvents: 0,
      timestamp: Date.now()
    }

    this.memorySnapshots.push(snapshot)

    // 限制快照数量
    if (this.memorySnapshots.length > this.config.bufferSize) {
      this.memorySnapshots = this.memorySnapshots.slice(-this.config.bufferSize)
    }

    // 检查内存阈值
    if (snapshot.currentUsage > this.config.thresholds.maxMemoryUsage) {
      this.recordMetric({
        name: 'memory.warning',
        value: snapshot.currentUsage,
        unit: 'bytes',
        timestamp: Date.now(),
        metadata: {
          threshold: this.config.thresholds.maxMemoryUsage * 1024 * 1024,
          reason: 'memory_usage_exceeded'
        }
      })
    }
  }

  // ==================== 数据查询 ====================

  /**
   * 获取所有指标
   */
  getAllMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.get(name) || []
    }

    const allMetrics: PerformanceMetric[] = []
    this.metrics.forEach(value => allMetrics.push(...value))
    return allMetrics
  }

  /**
   * 获取组件指标
   */
  getComponentMetrics(componentName?: string, instanceId?: string): ComponentMetrics[] {
    if (!componentName && !instanceId) {
      return Array.from(this.componentMetrics.values())
    }

    if (componentName && instanceId) {
      const key = `${componentName}:${instanceId}`
      const metrics = this.componentMetrics.get(key)
      return metrics ? [metrics] : []
    }

    if (componentName) {
      return Array.from(this.componentMetrics.values())
        .filter(m => m.componentName === componentName)
    }

    return []
  }

  /**
   * 获取内存快照
   */
  getMemorySnapshots(): MemoryMetrics[] {
    return [...this.memorySnapshots]
  }

  /**
   * 获取当前内存使用
   */
  getCurrentMemoryUsage(): MemoryMetrics | null {
    return this.memorySnapshots.length > 0
      ? this.memorySnapshots[this.memorySnapshots.length - 1]
      : null
  }

  /**
   * 获取性能报告
   */
  generateReport(): string {
    const report: string[] = []

    report.push('# Xorigo UI 性能监控报告')
    report.push(`\n生成时间: ${new Date().toLocaleString('zh-CN')}`)
    report.push(`监控时长: ${((Date.now() - this.startTime) / 1000).toFixed(2)} 秒\n`)

    // 组件性能
    report.push('## 组件性能统计')
    const components = Array.from(this.componentMetrics.values())
    if (components.length > 0) {
      components.forEach(comp => {
        report.push(`\n### ${comp.componentName} (${comp.instanceId})`)
        report.push(`- 渲染次数: ${comp.renderMetrics.renderCount}`)
        report.push(`- 平均渲染时间: ${comp.renderMetrics.averageRenderTime.toFixed(2)} ms`)
        report.push(`- 最后渲染时间: ${comp.renderMetrics.lastRenderTime.toFixed(2)} ms`)
        report.push(`- 内存使用: ${comp.renderMetrics.memoryUsage.toFixed(2)} MB`)
        report.push(`- 优化分数: ${comp.renderMetrics.optimizationScore}/100`)
        report.push(`- Props变化: ${comp.propsChangeCount}`)
        report.push(`- State变化: ${comp.stateChangeCount}`)

        if (comp.renderMetrics.recommendations.length > 0) {
          report.push('\n### 优化建议:')
          comp.renderMetrics.recommendations.forEach(rec => {
            report.push(`- ${rec}`)
          })
        }
      })
    } else {
      report.push('\n没有组件性能数据')
    }

    // 内存统计
    report.push('\n\n## 内存使用统计')
    const currentMemory = this.getCurrentMemoryUsage()
    if (currentMemory) {
      report.push(`- 当前使用: ${currentMemory.currentUsage.toFixed(2)} MB`)
      report.push(`- 峰值使用: ${currentMemory.peakUsage.toFixed(2)} MB`)
      report.push(`- 平均使用: ${currentMemory.averageUsage.toFixed(2)} MB`)
      report.push(`- 使用趋势: ${currentMemory.trend}`)
      report.push(`- 增长率: ${currentMemory.growthRate.toFixed(2)} MB/min`)
      report.push(`- 堆大小: ${(currentMemory.heapSize.used / 1024 / 1024).toFixed(2)} MB / ${(currentMemory.heapSize.total / 1024 / 1024).toFixed(2)} MB`)
    } else {
      report.push('\n没有内存使用数据')
    }

    // 总体建议
    report.push('\n## 总体建议')

    if (currentMemory && currentMemory.currentUsage > this.config.thresholds.maxMemoryUsage) {
      report.push('- 内存使用过高，建议优化内存管理')
    }

    if (components.length > 0) {
      const slowComponents = components.filter(c => c.renderMetrics.averageRenderTime > this.config.thresholds.maxRenderTime)
      if (slowComponents.length > 0) {
        report.push(`- 发现 ${slowComponents.length} 个渲染性能较慢的组件，建议优化`)
      }

      const highRenderCount = components.filter(c => c.renderMetrics.renderCount > this.config.thresholds.maxRenderCount)
      if (highRenderCount.length > 0) {
        report.push(`- 发现 ${highRenderCount.length} 个渲染次数过多的组件，建议使用 memo 优化`)
      }
    }

    return report.join('\n')
  }

  // ==================== 订阅和通知 ====================

  /**
   * 订阅性能指标
   */
  subscribe(callback: (metric: PerformanceMetric) => void): () => void {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  /**
   * 取消订阅
   */
  unsubscribe(callback: (metric: PerformanceMetric) => void): void {
    this.subscribers.delete(callback)
  }

  // ==================== 私有方法 ====================

  private startMemoryMonitoring(): void {
    // 立即记录一次
    this.recordMemorySnapshot()

    // 设置定期记录
    this.monitoringInterval = setInterval(() => {
      this.recordMemorySnapshot()
    }, 5000) // 每5秒记录一次

    // 监控垃圾回收
    if (this.config.trackMemoryLeaks) {
      this.setupGCObserver()
    }
  }

  private startRealTimeMonitoring(): void {
    // 设置性能观察器
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          this.recordMetric({
            name: entry.name,
            value: entry.duration,
            unit: 'ms',
            timestamp: entry.startTime
          })
        })
      })

      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] })
      this.observers.set('performance', observer)
    }
  }

  private startProfiling(): void {
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.entryType === 'function') {
            // 记录函数执行时间
            const metric = (entry as any)
            this.recordMetric({
              name: 'function.execution',
              value: metric.executionDuration || 0,
              unit: 'ms',
              timestamp: Date.now()
            })
          }
        })
      })

      observer.observe({ entryTypes: ['function'] })
      this.observers.set('profiling', observer)
    }
  }

  private setupGCObserver(): void {
    if (typeof PerformanceObserver === 'undefined') return

    this.gcObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        this.recordMetric({
          name: 'gc.event',
          value: entry.duration || 0,
          unit: 'ms',
          timestamp: Date.now()
        })
      })
    })

    this.gcObserver.observe({ entryTypes: ['gc'] })
  }

  private recordMetric(metric: PerformanceMetric): void {
    const name = metric.name
    const metrics = this.metrics.get(name) || []
    metrics.push(metric)

    // 限制缓冲区大小
    if (metrics.length > this.config.bufferSize) {
      metrics.shift()
    }

    this.metrics.set(name, metrics)

    // 通知订阅者
    this.subscribers.forEach(callback => callback(metric))
  }

  private calculateOptimizationScore(renderMetrics: RenderMetrics): number {
    let score = 100

    // 渲染时间评分
    if (renderMetrics.lastRenderTime > this.config.thresholds.maxRenderTime) {
      score -= 20
    }

    // 渲染次数评分
    if (renderMetrics.renderCount > this.config.thresholds.maxRenderCount) {
      score -= 30
    }

    // 内存使用评分
    if (renderMetrics.memoryUsage > this.config.thresholds.maxMemoryUsage) {
      score -= 25
    }

    // 重渲染原因评分
    const reasonCount = Object.keys(renderMetrics.reRenderReasons).length
    if (reasonCount > 5) {
      score -= 15
    }

    return Math.max(0, score)
  }

  private generateRecommendations(renderMetrics: RenderMetrics, thresholds: PerformanceThresholds): string[] {
    const recommendations: string[] = []

    if (renderMetrics.averageRenderTime > thresholds.maxRenderTime) {
      recommendations.push('渲染时间过长，建议使用 useMemo、useCallback 或组件拆分优化')
    }

    if (renderMetrics.renderCount > thresholds.maxRenderCount) {
      recommendations.push('渲染次数过多，建议使用 React.memo 优化组件')
    }

    if (renderMetrics.memoryUsage > thresholds.maxMemoryUsage) {
      recommendations.push('内存使用过高，检查是否存在内存泄漏')
    }

    const reasonCount = Object.keys(renderMetrics.reRenderReasons).length
    if (reasonCount > 3) {
      recommendations.push('重渲染原因过多，建议优化状态管理和组件结构')
    }

    if (renderMetrics.optimizationScore < 70) {
      recommendations.push('组件性能分数较低，建议全面重构优化')
    }

    return recommendations
  }

  private calculateMemoryTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.memorySnapshots.length < 10) return 'stable'

    const recent = this.memorySnapshots.slice(-5)
    const older = this.memorySnapshots.slice(-10, -5)

    const recentAvg = recent.reduce((sum, s) => sum + s.currentUsage, 0) / recent.length
    const olderAvg = older.reduce((sum, s) => sum + s.currentUsage, 0) / older.length

    if (recentAvg > olderAvg * 1.1) {
      return 'increasing'
    } else if (recentAvg < olderAvg * 0.9) {
      return 'decreasing'
    }

    return 'stable'
  }

  private calculateMemoryGrowthRate(): number {
    if (this.memorySnapshots.length < 2) return 0

    const latest = this.memorySnapshots[this.memorySnapshots.length - 1]
    const earliest = this.memorySnapshots[0]

    const timeDiff = (latest.timestamp - earliest.timestamp) / 1000 / 60 // minutes
    const memoryDiff = latest.currentUsage - earliest.currentUsage

    return timeDiff > 0 ? memoryDiff / timeDiff : 0
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.stop()
    this.subscribers.clear()
    this.metrics.clear()
    this.componentMetrics.clear()
    this.memorySnapshots = []
  }
}

// ==================== 全局实例 ====================

export const globalPerformanceMonitor = new PerformanceMonitor()

// ==================== 默认导出 ====================

export default PerformanceMonitor
