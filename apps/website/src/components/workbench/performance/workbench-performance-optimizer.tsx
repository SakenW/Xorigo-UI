/**
 * Workbench 性能优化器
 * 提供性能监控、优化建议、并发支持和缓存管理
 */

import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'

/**
 * 性能指标接口
 */
export interface PerformanceMetrics {
  /** FPS */
  fps: number
  /** 内存使用量 */
  memoryUsage: number
  /** CPU使用率 */
  cpuUsage: number
  /** 网络延迟 */
  networkLatency: number
  /** 渲染时间 */
  renderTime: number
  /** 交互响应时间 */
  responseTime: number
  /** 缓存命中率 */
  cacheHitRate: number
}

/**
 * 性能优化建议
 */
export interface OptimizationSuggestion {
  /** 类型 */
  type: 'rendering' | 'memory' | 'network' | 'code' | 'accessibility'
  /** 优先级 */
  priority: 'high' | 'medium' | 'low'
  /** 标题 */
  title: string
  /** 描述 */
  description: string
  /** 影响 */
  impact: string
  /** 建议操作 */
  action: string
  /** 预期改进 */
  expectedImprovement: string
}

/**
 * 缓存配置
 */
export interface CacheConfig {
  /** 最大缓存大小 */
  maxSize: number
  /** TTL（秒） */
  ttl: number
  /** 是否启用预加载 */
  preload: boolean
  /** 缓存策略 */
  strategy: 'lru' | 'fifo' | 'lfu'
}

/**
 * 并发管理配置
 */
export interface ConcurrencyConfig {
  /** 最大并发数 */
  maxConcurrent: number
  /** 队列大小 */
  queueSize: number
  /** 超时时间 */
  timeout: number
  /** 重试次数 */
  retryCount: number
}

/**
 * 性能优化器属性
 */
export interface WorkbenchPerformanceOptimizerProps {
  /** 组件代码 */
  code?: string
  /** 是否启用自动优化 */
  autoOptimize?: boolean
  /** 缓存配置 */
  cacheConfig?: Partial<CacheConfig>
  /** 并发配置 */
  concurrencyConfig?: Partial<ConcurrencyConfig>
  /** 性能指标更新回调 */
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
  /** 优化建议回调 */
  onSuggestion?: (suggestion: OptimizationSuggestion) => void
  /** 是否显示高级选项 */
  showAdvanced?: boolean
}

/**
 * 智能缓存管理器
 */
class SmartCacheManager {
  private cache = new Map<string, { data: any; timestamp: number; hits: number }>()
  private maxSize: number
  private ttl: number
  private strategy: 'lru' | 'fifo' | 'lfu'

  constructor(config: CacheConfig) {
    this.maxSize = config.maxSize
    this.ttl = config.ttl * 1000 // 转换为毫秒
    this.strategy = config.strategy
  }

  /**
   * 获取缓存
   */
  get(key: string): any | null {
    const item = this.cache.get(key)

    if (!item) {
      return null
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    // 更新命中次数
    item.hits++
    return item.data
  }

  /**
   * 设置缓存
   */
  set(key: string, data: any): void {
    // 如果缓存已满，删除项目
    if (this.cache.size >= this.maxSize) {
      this.evict()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0
    })
  }

  /**
   * 删除缓存项
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 缓存淘汰策略
   */
  private evict(): void {
    let keyToDelete: string | null = null

    switch (this.strategy) {
      case 'lru': // 最近最少使用
        let oldestTime = Date.now()
        for (const [key, item] of this.cache) {
          if (item.timestamp < oldestTime) {
            oldestTime = item.timestamp
            keyToDelete = key
          }
        }
        break

      case 'lfu': // 最少使用频率
        let minHits = Infinity
        for (const [key, item] of this.cache) {
          if (item.hits < minHits) {
            minHits = item.hits
            keyToDelete = key
          }
        }
        break

      case 'fifo': // 先进先出
        keyToDelete = this.cache.keys().next().value
        break
    }

    if (keyToDelete) {
      this.cache.delete(keyToDelete)
    }
  }

  /**
   * 获取缓存统计
   */
  getStats() {
    const totalHits = Array.from(this.cache.values()).reduce((sum, item) => sum + item.hits, 0)
    const totalSize = this.cache.size

    return {
      size: totalSize,
      maxSize: this.maxSize,
      hitRate: totalSize > 0 ? (totalHits / (totalHits + totalSize)) * 100 : 0,
      items: Array.from(this.cache.entries()).map(([key, item]) => ({
        key,
        timestamp: item.timestamp,
        hits: item.hits,
        age: Date.now() - item.timestamp
      }))
    }
  }
}

/**
 * 并发任务管理器
 */
class ConcurrencyManager {
  private maxConcurrent: number
  private queue: Array<() => Promise<any>> = []
  private running: Set<Promise<any>> = new Set()
  private timeout: number
  private retryCount: number

  constructor(config: ConcurrencyConfig) {
    this.maxConcurrent = config.maxConcurrent
    this.timeout = config.timeout
    this.retryCount = config.retryCount
  }

  /**
   * 执行任务
   */
  async execute<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedTask = async () => {
        try {
          const result = await this.executeWithRetry(task)
          resolve(result)
        } catch (error) {
          reject(error)
        } finally {
          this.running.delete(promise)
          this.processQueue()
        }
      }

      const promise = wrappedTask()
      this.running.add(promise)

      if (this.running.size <= this.maxConcurrent) {
        wrappedTask()
      } else {
        this.queue.push(wrappedTask)
      }
    })
  }

  /**
   * 处理队列
   */
  private processQueue(): void {
    while (this.running.size < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift()!
      task()
    }
  }

  /**
   * 带重试的执行
   */
  private async executeWithRetry<T>(task: () => Promise<T>, attempt = 0): Promise<T> {
    try {
      return await Promise.race([
        task(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Task timeout')), this.timeout)
        )
      ])
    } catch (error) {
      if (attempt < this.retryCount) {
        await this.delay(1000 * (attempt + 1)) // 指数退避
        return this.executeWithRetry(task, attempt + 1)
      }
      throw error
    }
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 获取队列状态
   */
  getStatus() {
    return {
      running: this.running.size,
      queued: this.queue.length,
      maxConcurrent: this.maxConcurrent
    }
  }
}

/**
 * 性能监控器
 */
class PerformanceMonitor {
  private observers: PerformanceObserver[] = []
  private metrics: PerformanceMetrics = {
    fps: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    networkLatency: 0,
    renderTime: 0,
    responseTime: 0,
    cacheHitRate: 0
  }
  private frameCount = 0
  private lastFrameTime = performance.now()
  private callbacks: ((metrics: PerformanceMetrics) => void)[] = []

  /**
   * 开始监控
   */
  start(): void {
    this.monitorFPS()
    this.monitorMemory()
    this.monitorNetwork()
    this.observePerformanceEntries()
  }

  /**
   * 停止监控
   */
  stop(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }

  /**
   * 添加回调
   */
  onUpdate(callback: (metrics: PerformanceMetrics) => void): void {
    this.callbacks.push(callback)
  }

  /**
   * 移除回调
   */
  removeCallback(callback: (metrics: PerformanceMetrics) => void): void {
    const index = this.callbacks.indexOf(callback)
    if (index > -1) {
      this.callbacks.splice(index, 1)
    }
  }

  /**
   * 获取当前指标
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * 监控FPS
   */
  private monitorFPS(): void {
    const measureFPS = () => {
      this.frameCount++
      const currentTime = performance.now()
      const deltaTime = currentTime - this.lastFrameTime

      if (deltaTime >= 1000) {
        this.metrics.fps = Math.round((this.frameCount * 1000) / deltaTime)
        this.frameCount = 0
        this.lastFrameTime = currentTime
        this.notifyCallbacks()
      }

      requestAnimationFrame(measureFPS)
    }

    requestAnimationFrame(measureFPS)
  }

  /**
   * 监控内存
   */
  private monitorMemory(): void {
    const updateMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        this.metrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024)
      }
    }

    updateMemory()
    setInterval(updateMemory, 2000)
  }

  /**
   * 监控网络
   */
  private monitorNetwork(): void {
    const measureLatency = async () => {
      const startTime = performance.now()
      try {
        await fetch('/api/health', { method: 'HEAD' })
        this.metrics.networkLatency = Math.round(performance.now() - startTime)
      } catch (error) {
        // 网络错误时使用估算值
        this.metrics.networkLatency = 500
      }
    }

    measureLatency()
    setInterval(measureLatency, 10000)
  }

  /**
   * 观察性能条目
   */
  private observePerformanceEntries(): void {
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'measure') {
              this.metrics.renderTime = Math.round(entry.duration)
            }
          }
          this.notifyCallbacks()
        })
        observer.observe({ entryTypes: ['measure', 'navigation'] })
        this.observers.push(observer)
      } catch (error) {
        console.warn('Performance observation not fully supported:', error)
      }
    }
  }

  /**
   * 通知回调
   */
  private notifyCallbacks(): void {
    this.callbacks.forEach(callback => {
      try {
        callback(this.metrics)
      } catch (error) {
        console.error('Performance callback error:', error)
      }
    })
  }
}

/**
 * 性能优化分析器
 */
class PerformanceOptimizer {
  /**
   * 分析性能问题
   */
  analyze(metrics: PerformanceMetrics, code?: string): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []

    // FPS分析
    if (metrics.fps < 30) {
      suggestions.push({
        type: 'rendering',
        priority: 'high',
        title: '帧率过低',
        description: `当前帧率为 ${metrics.fps} FPS，低于推荐的 60 FPS`,
        impact: '影响用户体验，导致动画卡顿',
        action: '使用 React.memo、useMemo、useCallback 优化组件渲染',
        expectedImprovement: '提升帧率至 45-60 FPS'
      })
    }

    // 内存分析
    if (metrics.memoryUsage > 100) {
      suggestions.push({
        type: 'memory',
        priority: 'high',
        title: '内存使用过高',
        description: `当前内存使用为 ${metrics.memoryUsage} MB`,
        impact: '可能导致页面崩溃或性能下降',
        action: '检查内存泄漏，清理不必要的对象引用',
        expectedImprovement: '减少内存使用 20-40%'
      })
    }

    // 网络延迟分析
    if (metrics.networkLatency > 500) {
      suggestions.push({
        type: 'network',
        priority: 'medium',
        title: '网络延迟较高',
        description: `网络延迟为 ${metrics.networkLatency} ms`,
        impact: '影响数据加载速度',
        action: '启用缓存、压缩数据、使用CDN',
        expectedImprovement: '减少加载时间 30-50%'
      })
    }

    // 渲染时间分析
    if (metrics.renderTime > 100) {
      suggestions.push({
        type: 'rendering',
        priority: 'medium',
        title: '渲染时间过长',
        description: `组件渲染时间为 ${metrics.renderTime} ms`,
        impact: '影响页面响应速度',
        action: '虚拟化长列表、懒加载组件、代码分割',
        expectedImprovement: '减少渲染时间 40-60%'
      })
    }

    // 代码分析
    if (code) {
      const codeSuggestions = this.analyzeCode(code)
      suggestions.push(...codeSuggestions)
    }

    return suggestions
  }

  /**
   * 分析代码性能
   */
  private analyzeCode(code: string): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = []

    // 检查潜在的性能问题
    const lines = code.split('\n')

    lines.forEach((line, index) => {
      // 检查内联函数
      if (line.includes('onClick={()') || line.includes('onChange={()')) {
        suggestions.push({
          type: 'code',
          priority: 'medium',
          title: '发现内联函数',
          description: `第 ${index + 1} 行使用了内联函数`,
          impact: '可能导致不必要的重新渲染',
          action: '使用 useCallback 缓存函数',
          expectedImprovement: '减少重新渲染次数'
        })
      }

      // 检查未优化的数组方法
      if (line.includes('.map(') && !line.includes('key=')) {
        suggestions.push({
          type: 'code',
          priority: 'high',
          title: '缺少key属性',
          description: `第 ${index + 1} 行的列表项缺少key属性`,
          impact: '影响列表渲染性能和React协调',
          action: '为列表项添加唯一的key属性',
          expectedImprovement: '提升列表渲染性能'
        })
      }

      // 检查潜在的重渲染
      if (line.includes('useState') && lines[index + 1]?.includes('console.log')) {
        suggestions.push({
          type: 'code',
          priority: 'low',
          title: '不必要的副作用',
          description: `第 ${index + 1} 行可能在每次渲染时执行`,
          impact: '轻微影响性能',
          action: '使用 useEffect 包装副作用代码',
          expectedImprovement: '避免不必要的计算'
        })
      }
    })

    return suggestions
  }
}

/**
 * 全局实例
 */
const performanceMonitor = new PerformanceMonitor()
const performanceOptimizer = new PerformanceOptimizer()

/**
 * Workbench 性能优化器组件
 */
export function WorkbenchPerformanceOptimizer({
  code,
  autoOptimize = true,
  cacheConfig = {},
  concurrencyConfig = {},
  onMetricsUpdate,
  onSuggestion,
  showAdvanced = false,
}: WorkbenchPerformanceOptimizerProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(performanceMonitor.getMetrics())
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [activeTab, setActiveTab] = useState<'metrics' | 'suggestions' | 'cache'>('metrics')

  // 缓存管理器
  const cacheManager = useMemo(() => {
    const config: CacheConfig = {
      maxSize: 100,
      ttl: 300, // 5分钟
      preload: true,
      strategy: 'lru',
      ...cacheConfig
    }
    return new SmartCacheManager(config)
  }, [cacheConfig])

  // 并发管理器
  const concurrencyManager = useMemo(() => {
    const config: ConcurrencyConfig = {
      maxConcurrent: 5,
      queueSize: 20,
      timeout: 10000,
      retryCount: 3,
      ...concurrencyConfig
    }
    return new ConcurrencyManager(config)
  }, [concurrencyConfig])

  /**
   * 更新性能指标
   */
  const updateMetrics = useCallback((newMetrics: PerformanceMetrics) => {
    setMetrics(newMetrics)
    onMetricsUpdate?.(newMetrics)

    // 自动分析性能问题
    if (autoOptimize) {
      const newSuggestions = performanceOptimizer.analyze(newMetrics, code)
      setSuggestions(newSuggestions)

      // 发送高优先级建议
      newSuggestions
        .filter(s => s.priority === 'high')
        .forEach(suggestion => onSuggestion?.(suggestion))
    }
  }, [autoOptimize, code, onMetricsUpdate, onSuggestion])

  /**
   * 开始监控
   */
  const startMonitoring = useCallback(() => {
    performanceMonitor.start()
    performanceMonitor.onUpdate(updateMetrics)
    setIsMonitoring(true)
  }, [updateMetrics])

  /**
   * 停止监控
   */
  const stopMonitoring = useCallback(() => {
    performanceMonitor.stop()
    performanceMonitor.removeCallback(updateMetrics)
    setIsMonitoring(false)
  }, [updateMetrics])

  /**
   * 应用优化建议
   */
  const applySuggestion = useCallback((suggestion: OptimizationSuggestion) => {
    console.log('应用优化建议:', suggestion.title)
    // 这里可以实现具体的优化逻辑
  }, [])

  /**
   * 清空缓存
   */
  const clearCache = useCallback(() => {
    cacheManager.clear()
  }, [cacheManager])

  /**
   * 获取缓存统计
   */
  const cacheStats = useMemo(() => {
    return cacheManager.getStats()
  }, [cacheManager])

  /**
   * 获取并发状态
   */
  const concurrencyStatus = useMemo(() => {
    return concurrencyManager.getStatus()
  }, [concurrencyManager])

  /**
   * 组件挂载时开始监控
   */
  useEffect(() => {
    startMonitoring()
    return stopMonitoring
  }, [startMonitoring, stopMonitoring])

  /**
   * 渲染性能指标面板
   */
  const MetricsPanel = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className={`text-2xl font-bold ${metrics.fps >= 50 ? 'text-green-600' : metrics.fps >= 30 ? 'text-yellow-600' : 'text-red-600'}`}>
            {metrics.fps}
          </div>
          <div className="text-sm text-muted-foreground">FPS</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className={`text-2xl font-bold ${metrics.memoryUsage < 50 ? 'text-green-600' : metrics.memoryUsage < 100 ? 'text-yellow-600' : 'text-red-600'}`}>
            {metrics.memoryUsage}MB
          </div>
          <div className="text-sm text-muted-foreground">内存使用</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className={`text-2xl font-bold ${metrics.networkLatency < 200 ? 'text-green-600' : metrics.networkLatency < 500 ? 'text-yellow-600' : 'text-red-600'}`}>
            {metrics.networkLatency}ms
          </div>
          <div className="text-sm text-muted-foreground">网络延迟</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className={`text-2xl font-bold ${metrics.renderTime < 50 ? 'text-green-600' : metrics.renderTime < 100 ? 'text-yellow-600' : 'text-red-600'}`}>
            {metrics.renderTime}ms
          </div>
          <div className="text-sm text-muted-foreground">渲染时间</div>
        </div>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">并发状态</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>运行中任务:</span>
                <span>{concurrencyStatus.running}/{concurrencyStatus.maxConcurrent}</span>
              </div>
              <div className="flex justify-between">
                <span>队列中任务:</span>
                <span>{concurrencyStatus.queued}</span>
              </div>
              <div className="flex justify-between">
                <span>响应时间:</span>
                <span className={metrics.responseTime < 100 ? 'text-green-600' : 'text-yellow-600'}>
                  {metrics.responseTime}ms
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">缓存状态</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>缓存大小:</span>
                <span>{cacheStats.size}/{cacheStats.maxSize}</span>
              </div>
              <div className="flex justify-between">
                <span>命中率:</span>
                <span className={cacheStats.hitRate > 70 ? 'text-green-600' : 'text-yellow-600'}>
                  {cacheStats.hitRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>总命中:</span>
                <span>{cacheStats.items.reduce((sum, item) => sum + item.hits, 0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  /**
   * 渲染优化建议面板
   */
  const SuggestionsPanel = () => {
    const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high')
    const mediumPrioritySuggestions = suggestions.filter(s => s.priority === 'medium')
    const lowPrioritySuggestions = suggestions.filter(s => s.priority === 'low')

    return (
      <div className="space-y-4">
        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            暂无优化建议，性能表现良好！
          </div>
        ) : (
          <>
            {/* 高优先级建议 */}
            {highPrioritySuggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-red-600 mb-2">高优先级优化</h4>
                <div className="space-y-2">
                  {highPrioritySuggestions.map((suggestion, index) => (
                    <Card key={index} className="border-red-200 bg-red-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{suggestion.title}</h5>
                            <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                            <p className="text-xs mt-2">
                              <span className="font-medium">建议:</span> {suggestion.action}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              预期改进: {suggestion.expectedImprovement}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => applySuggestion(suggestion)}>
                            应用
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 中优先级建议 */}
            {mediumPrioritySuggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-yellow-600 mb-2">中优先级优化</h4>
                <div className="space-y-2">
                  {mediumPrioritySuggestions.map((suggestion, index) => (
                    <Card key={index} className="border-yellow-200 bg-yellow-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{suggestion.title}</h5>
                            <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                            <p className="text-xs mt-2">
                              <span className="font-medium">建议:</span> {suggestion.action}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => applySuggestion(suggestion)}>
                            应用
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 低优先级建议 */}
            {lowPrioritySuggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-600 mb-2">低优先级优化</h4>
                <div className="space-y-2">
                  {lowPrioritySuggestions.map((suggestion, index) => (
                    <Card key={index} className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{suggestion.title}</h5>
                            <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => applySuggestion(suggestion)}>
                            应用
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  /**
   * 渲染缓存管理面板
   */
  const CachePanel = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">缓存管理</h4>
        <Button size="sm" variant="outline" onClick={clearCache}>
          清空缓存
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-muted rounded-lg">
          <h5 className="font-medium mb-2">缓存统计</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>总大小:</span>
              <span>{cacheStats.size}/{cacheStats.maxSize}</span>
            </div>
            <div className="flex justify-between">
              <span>命中率:</span>
              <span className={cacheStats.hitRate > 70 ? 'text-green-600' : 'text-yellow-600'}>
                {cacheStats.hitRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>总命中次数:</span>
              <span>{cacheStats.items.reduce((sum, item) => sum + item.hits, 0)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h5 className="font-medium mb-2">缓存项详情</h5>
          <div className="max-h-32 overflow-auto text-xs space-y-1">
            {cacheStats.items.length === 0 ? (
              <div className="text-muted-foreground">暂无缓存项</div>
            ) : (
              cacheStats.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="truncate max-w-32">{item.key}</span>
                  <span>{item.hits}次</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="workbench-performance-optimizer">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>性能优化器</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant={isMonitoring ? 'default' : 'secondary'}>
                {isMonitoring ? '监控中' : '已停止'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={isMonitoring ? stopMonitoring : startMonitoring}
              >
                {isMonitoring ? '停止监控' : '开始监控'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 标签切换 */}
          <div className="flex space-x-1 mb-6">
            <Button
              variant={activeTab === 'metrics' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('metrics')}
            >
              性能指标
            </Button>
            <Button
              variant={activeTab === 'suggestions' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('suggestions')}
            >
              优化建议
              {suggestions.filter(s => s.priority === 'high').length > 0 && (
                <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                  {suggestions.filter(s => s.priority === 'high').length}
                </Badge>
              )}
            </Button>
            {showAdvanced && (
              <Button
                variant={activeTab === 'cache' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('cache')}
              >
                缓存管理
              </Button>
            )}
          </div>

          {/* 面板内容 */}
          <div>
            {activeTab === 'metrics' && <MetricsPanel />}
            {activeTab === 'suggestions' && <SuggestionsPanel />}
            {activeTab === 'cache' && <CachePanel />}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * 性能优化器 Hook
 */
export function usePerformanceOptimizer() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(performanceMonitor.getMetrics())
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([])

  useEffect(() => {
    performanceMonitor.start()
    performanceMonitor.onUpdate(setMetrics)

    return () => {
      performanceMonitor.stop()
      performanceMonitor.removeCallback(setMetrics)
    }
  }, [])

  const analyzePerformance = useCallback((code?: string) => {
    const newSuggestions = performanceOptimizer.analyze(metrics, code)
    setSuggestions(newSuggestions)
    return newSuggestions
  }, [metrics])

  return {
    metrics,
    suggestions,
    analyzePerformance
  }
}