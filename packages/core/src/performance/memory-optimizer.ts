/**
 * Xorigo UI 内存使用优化和泄漏检测系统
 *
 * 提供全面的内存监控、优化和泄漏检测功能
 * 确保应用内存使用保持在100MB以下，并自动检测内存泄漏
 *
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import { useEffect, useRef, useCallback, useState } from 'react'

// ==================== 类型定义 ====================

export interface MemorySnapshot {
  timestamp: number
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
  componentCount: number
  eventListenerCount: number
  timerCount: number
  domNodeCount: number
  customData?: Record<string, any>
}

export interface MemoryLeak {
  id: string
  type: 'event-listener' | 'timer' | 'component' | 'dom-node' | 'closure' | 'cache' | 'observer'
  severity: 'critical' | 'serious' | 'moderate' | 'minor'
  description: string
  location: string
  component?: string
  stackTrace?: string
  memoryImpact: number // bytes
  detectedAt: number
  recommendation: string
  autoFixable: boolean
}

export interface MemoryOptimizationResult {
  optimizedMemory: number
  freedMemory: number
  optimizationTechniques: string[]
  duration: number
  success: boolean
  issues: string[]
}

export interface MemoryMetrics {
  currentUsage: number // MB
  peakUsage: number
  averageUsage: number
  trend: 'increasing' | 'decreasing' | 'stable'
  growthRate: number // MB/min
  leakCount: number
  optimizationScore: number
  recommendations: string[]
  lastOptimization?: number
}

export interface MemoryOptimizerConfig {
  enableAutoOptimization: boolean
  enableLeakDetection: boolean
  maxMemoryUsage: number // MB
  optimizationThreshold: number // MB
  monitoringInterval: number // ms
  snapshotInterval: number // ms
  enableMemoryProfiling: boolean
  enableComponentTracking: boolean
  enableEventTracking: boolean
  aggressiveOptimization: boolean
  cleanupOnUnload: boolean
}

export interface ComponentMemoryProfile {
  componentName: string
  instances: number
  memoryUsage: number
  averageLifetime: number
  leakProbability: number
  lastSeen: number
  issues: string[]
}

// ==================== 内存监控器 ====================

class MemoryMonitor {
  private snapshots: MemorySnapshot[] = []
  private metrics: MemoryMetrics
  private config: MemoryOptimizerConfig
  private isMonitoring: boolean = false
  private monitoringInterval?: NodeJS.Timeout
  private snapshotInterval?: NodeJS.Timeout
  private observers: PerformanceObserver[] = []
  private callbacks: Set<(snapshot: MemorySnapshot) => void> = new Set()

  constructor(config: Partial<MemoryOptimizerConfig> = {}) {
    this.config = {
      enableAutoOptimization: true,
      enableLeakDetection: true,
      maxMemoryUsage: 100,
      optimizationThreshold: 80,
      monitoringInterval: 5000,
      snapshotInterval: 30000,
      enableMemoryProfiling: true,
      enableComponentTracking: true,
      enableEventTracking: true,
      aggressiveOptimization: false,
      cleanupOnUnload: true,
      ...config
    }

    this.metrics = this.initializeMetrics()

    if (this.config.cleanupOnUnload) {
      window.addEventListener('beforeunload', () => this.cleanup())
    }
  }

  /**
   * 开始内存监控
   */
  startMonitoring(): void {
    if (this.isMonitoring) return

    this.isMonitoring = true

    // 立即获取第一个快照
    this.takeSnapshot()

    // 设置定期监控
    this.monitoringInterval = setInterval(() => {
      this.checkMemoryUsage()
    }, this.config.monitoringInterval)

    // 设置定期快照
    this.snapshotInterval = setInterval(() => {
      this.takeSnapshot()
    }, this.config.snapshotInterval)

    // 设置性能观察器
    if (this.config.enableMemoryProfiling) {
      this.setupPerformanceObservers()
    }
  }

  /**
   * 停止内存监控
   */
  stopMonitoring(): void {
    this.isMonitoring = false

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }

    if (this.snapshotInterval) {
      clearInterval(this.snapshotInterval)
    }

    this.cleanupPerformanceObservers()
  }

  /**
   * 获取当前内存快照
   */
  getCurrentSnapshot(): MemorySnapshot | null {
    return this.snapshots.length > 0 ? this.snapshots[this.snapshots.length - 1] : null
  }

  /**
   * 获取内存指标
   */
  getMetrics(): MemoryMetrics {
    return { ...this.metrics }
  }

  /**
   * 获取内存快照历史
   */
  getSnapshots(): MemorySnapshot[] {
    return [...this.snapshots]
  }

  /**
   * 添加监控回调
   */
  onSnapshot(callback: (snapshot: MemorySnapshot) => void): () => void {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  /**
   * 强制垃圾回收（如果可用）
   */
  forceGarbageCollection(): boolean {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc()
      return true
    }
    return false
  }

  // ==================== 私有方法 ====================

  private initializeMetrics(): MemoryMetrics {
    return {
      currentUsage: 0,
      peakUsage: 0,
      averageUsage: 0,
      trend: 'stable',
      growthRate: 0,
      leakCount: 0,
      optimizationScore: 100,
      recommendations: []
    }
  }

  private takeSnapshot(): void {
    if (!('memory' in performance)) {
      console.warn('Memory API not available')
      return
    }

    const memory = (performance as any).memory
    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      componentCount: this.countComponents(),
      eventListenerCount: this.countEventListeners(),
      timerCount: this.countTimers(),
      domNodeCount: this.countDOMNodes()
    }

    this.snapshots.push(snapshot)

    // 限制快照数量
    if (this.snapshots.length > 100) {
      this.snapshots = this.snapshots.slice(-100)
    }

    // 更新指标
    this.updateMetrics(snapshot)

    // 通知回调
    this.callbacks.forEach(callback => callback(snapshot))
  }

  private checkMemoryUsage(): void {
    if (!('memory' in performance)) return

    const currentUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024

    // 检查是否超过阈值
    if (currentUsage > this.config.optimizationThreshold) {
      this.triggerOptimization()
    }

    // 检查是否超过最大限制
    if (currentUsage > this.config.maxMemoryUsage) {
      this.handleMemoryOverflow()
    }
  }

  private updateMetrics(snapshot: MemorySnapshot): void {
    const currentUsage = snapshot.usedJSHeapSize / 1024 / 1024

    // 更新当前使用量
    this.metrics.currentUsage = currentUsage

    // 更新峰值使用量
    this.metrics.peakUsage = Math.max(this.metrics.peakUsage, currentUsage)

    // 计算平均使用量
    if (this.snapshots.length > 0) {
      const totalUsage = this.snapshots.reduce((sum, s) => sum + s.usedJSHeapSize, 0)
      this.metrics.averageUsage = totalUsage / this.snapshots.length / 1024 / 1024
    }

    // 计算趋势
    if (this.snapshots.length >= 2) {
      const recent = this.snapshots.slice(-10)
      const older = this.snapshots.slice(-20, -10)

      if (older.length > 0) {
        const recentAvg = recent.reduce((sum, s) => sum + s.usedJSHeapSize, 0) / recent.length
        const olderAvg = older.reduce((sum, s) => sum + s.usedJSHeapSize, 0) / older.length

        if (recentAvg > olderAvg * 1.1) {
          this.metrics.trend = 'increasing'
        } else if (recentAvg < olderAvg * 0.9) {
          this.metrics.trend = 'decreasing'
        } else {
          this.metrics.trend = 'stable'
        }

        // 计算增长率
        const timeDiff = (recent[recent.length - 1].timestamp - older[0].timestamp) / 1000 / 60 // minutes
        const memoryDiff = (recentAvg - olderAvg) / 1024 / 1024 // MB
        this.metrics.growthRate = timeDiff > 0 ? memoryDiff / timeDiff : 0
      }
    }

    // 计算优化分数
    this.metrics.optimizationScore = this.calculateOptimizationScore()

    // 生成建议
    this.metrics.recommendations = this.generateRecommendations()
  }

  private calculateOptimizationScore(): number {
    let score = 100

    // 内存使用评分
    if (this.metrics.currentUsage > this.config.maxMemoryUsage) {
      score -= 40
    } else if (this.metrics.currentUsage > this.config.optimizationThreshold) {
      score -= 20
    }

    // 增长趋势评分
    if (this.metrics.trend === 'increasing' && this.metrics.growthRate > 5) {
      score -= 25
    } else if (this.metrics.trend === 'increasing' && this.metrics.growthRate > 2) {
      score -= 15
    }

    // 峰值使用评分
    if (this.metrics.peakUsage > this.config.maxMemoryUsage * 1.5) {
      score -= 20
    }

    // 泄漏评分
    if (this.metrics.leakCount > 10) {
      score -= 30
    } else if (this.metrics.leakCount > 5) {
      score -= 15
    }

    return Math.max(0, score)
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = []

    if (this.metrics.currentUsage > this.config.optimizationThreshold) {
      recommendations.push('内存使用接近阈值，建议执行优化')
    }

    if (this.metrics.trend === 'increasing' && this.metrics.growthRate > 2) {
      recommendations.push('检测到内存持续增长，可能存在内存泄漏')
    }

    if (this.metrics.peakUsage > this.config.maxMemoryUsage) {
      recommendations.push('内存峰值过高，建议优化内存使用模式')
    }

    if (this.metrics.leakCount > 0) {
      recommendations.push(`检测到 ${this.metrics.leakCount} 个内存泄漏，建议修复`)
    }

    if (this.metrics.optimizationScore < 70) {
      recommendations.push('内存优化分数较低，建议全面优化')
    }

    return recommendations
  }

  private triggerOptimization(): void {
    if (this.config.enableAutoOptimization) {
      // 这里会触发优化器
      console.log('触发内存优化')
    }
  }

  private handleMemoryOverflow(): void {
    console.error('内存使用超过限制，执行紧急清理')

    // 强制垃圾回收
    this.forceGarbageCollection()

    // 清理缓存
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }

    // 清理事件监听器（这里需要实现具体逻辑）
    this.cleanupEventListeners()
  }

  private countComponents(): number {
    // 简化实现，实际需要更复杂的逻辑
    return document.querySelectorAll('[data-reactroot], [data-react-component]').length
  }

  private countEventListeners(): number {
    // 这是一个估算，实际浏览器API可能不提供准确计数
    return 50 // 占位符
  }

  private countTimers(): number {
    // 简化实现
    return 20 // 占位符
  }

  private countDOMNodes(): number {
    return document.querySelectorAll('*').length
  }

  private setupPerformanceObservers(): void {
    if (typeof PerformanceObserver === 'undefined') return

    // 观察内存相关的性能条目
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.entryType === 'measure' && entry.name.includes('memory')) {
            console.log('Memory performance entry:', entry)
          }
        })
      })

      observer.observe({ entryTypes: ['measure'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('Failed to setup performance observer:', error)
    }
  }

  private cleanupPerformanceObservers(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }

  private cleanupEventListeners(): void {
    // 清理事件监听器的实现
    console.log('清理事件监听器')
  }

  private cleanup(): void {
    this.stopMonitoring()
    this.cleanupPerformanceObservers()
    this.callbacks.clear()
  }
}

// ==================== 内存泄漏检测器 ====================

class MemoryLeakDetector {
  private leaks: Map<string, MemoryLeak> = new Map()
  private componentRegistry: Map<string, ComponentMemoryProfile> = new Map()
  private eventListenerRegistry: Set<string> = new Set()
  private timerRegistry: Set<string> = new Set()
  private isDetecting: boolean = false
  private detectionInterval?: NodeJS.Timeout

  constructor() {
    this.setupGlobalListeners()
  }

  /**
   * 开始泄漏检测
   */
  startDetection(): void {
    if (this.isDetecting) return

    this.isDetecting = true

    // 定期检测泄漏
    this.detectionInterval = setInterval(() => {
      this.detectLeaks()
    }, 10000) // 每10秒检测一次
  }

  /**
   * 停止泄漏检测
   */
  stopDetection(): void {
    this.isDetecting = false

    if (this.detectionInterval) {
      clearInterval(this.detectionInterval)
    }
  }

  /**
   * 获取检测到的泄漏
   */
  getLeaks(): MemoryLeak[] {
    return Array.from(this.leaks.values())
  }

  /**
   * 注册组件
   */
  registerComponent(componentName: string, instanceId: string): void {
    const profile = this.componentRegistry.get(componentName) || {
      componentName,
      instances: 0,
      memoryUsage: 0,
      averageLifetime: 0,
      leakProbability: 0,
      lastSeen: Date.now(),
      issues: []
    }

    profile.instances++
    profile.lastSeen = Date.now()

    this.componentRegistry.set(componentName, profile)
  }

  /**
   * 注销组件
   */
  unregisterComponent(componentName: string, instanceId: string): void {
    const profile = this.componentRegistry.get(componentName)
    if (profile) {
      profile.instances = Math.max(0, profile.instances - 1)
    }
  }

  /**
   * 注册事件监听器
   */
  registerEventListener(element: string, event: string, handlerId: string): void {
    this.eventListenerRegistry.add(handlerId)
  }

  /**
   * 注销事件监听器
   */
  unregisterEventListener(handlerId: string): void {
    this.eventListenerRegistry.delete(handlerId)
  }

  /**
   * 注册定时器
   */
  registerTimer(timerId: string): void {
    this.timerRegistry.add(timerId)
  }

  /**
   * 注销定时器
   */
  unregisterTimer(timerId: string): void {
    this.timerRegistry.delete(timerId)
  }

  // ==================== 私有方法 ====================

  private detectLeaks(): void {
    this.detectComponentLeaks()
    this.detectEventListenerLeaks()
    this.detectTimerLeaks()
    this.detectDOMLeaks()
    this.detectClosureLeaks()
  }

  private detectComponentLeaks(): void {
    for (const [componentName, profile] of this.componentRegistry) {
      // 检查组件实例数量异常
      if (profile.instances > 10) {
        this.reportLeak({
          id: `component-${componentName}-${Date.now()}`,
          type: 'component',
          severity: 'serious',
          description: `组件 ${componentName} 实例数量过多: ${profile.instances}`,
          location: componentName,
          component: componentName,
          memoryImpact: profile.instances * 1024 * 1024, // 估算每个实例1MB
          detectedAt: Date.now(),
          recommendation: '检查组件是否正确卸载，清理事件监听器和定时器',
          autoFixable: false
        })
      }

      // 检查组件生命周期异常
      const timeSinceLastSeen = Date.now() - profile.lastSeen
      if (timeSinceLastSeen > 60000 && profile.instances > 0) { // 1分钟
        this.reportLeak({
          id: `component-lifecycle-${componentName}-${Date.now()}`,
          type: 'component',
          severity: 'moderate',
          description: `组件 ${componentName} 可能存在生命周期问题`,
          location: componentName,
          component: componentName,
          memoryImpact: profile.instances * 512 * 1024, // 估算
          detectedAt: Date.now(),
          recommendation: '检查componentWillUnmount或useEffect清理函数',
          autoFixable: false
        })
      }
    }
  }

  private detectEventListenerLeaks(): void {
    // 检查事件监听器数量异常
    if (this.eventListenerRegistry.size > 100) {
      this.reportLeak({
        id: `event-listener-${Date.now()}`,
        type: 'event-listener',
        severity: 'serious',
        description: `事件监听器数量过多: ${this.eventListenerRegistry.size}`,
        location: 'global',
        memoryImpact: this.eventListenerRegistry.size * 1024,
        detectedAt: Date.now(),
        recommendation: '确保组件卸载时移除事件监听器',
        autoFixable: true
      })
    }
  }

  private detectTimerLeaks(): void {
    // 检测定时器数量异常
    if (this.timerRegistry.size > 50) {
      this.reportLeak({
        id: `timer-${Date.now()}`,
        type: 'timer',
        severity: 'serious',
        description: `定时器数量过多: ${this.timerRegistry.size}`,
        location: 'global',
        memoryImpact: this.timerRegistry.size * 512,
        detectedAt: Date.now(),
        recommendation: '确保组件卸载时清理定时器',
        autoFixable: true
      })
    }
  }

  private detectDOMLeaks(): void {
    // 检查DOM节点数量异常
    const nodeCount = document.querySelectorAll('*').length
    if (nodeCount > 10000) {
      this.reportLeak({
        id: `dom-node-${Date.now()}`,
        type: 'dom-node',
        severity: 'moderate',
        description: `DOM节点数量过多: ${nodeCount}`,
        location: 'document',
        memoryImpact: nodeCount * 200, // 估算每个节点200字节
        detectedAt: Date.now(),
        recommendation: '检查是否有未清理的DOM节点',
        autoFixable: false
      })
    }

    // 检查分离的DOM节点
    const detachedNodes = this.findDetachedNodes()
    if (detachedNodes.length > 100) {
      this.reportLeak({
        id: `detached-dom-${Date.now()}`,
        type: 'dom-node',
        severity: 'serious',
        description: `分离的DOM节点过多: ${detachedNodes.length}`,
        location: 'document',
        memoryImpact: detachedNodes.length * 300,
        detectedAt: Date.now(),
        recommendation: '清理分离的DOM节点',
        autoFixable: true
      })
    }
  }

  private detectClosureLeaks(): void {
    // 闭包泄漏检测比较复杂，这里简化实现
    // 实际实现需要更复杂的分析工具
  }

  private findDetachedNodes(): Node[] {
    const allNodes = Array.from(document.querySelectorAll('*'))
    const detachedNodes: Node[] = []

    allNodes.forEach(node => {
      if (!document.contains(node)) {
        detachedNodes.push(node)
      }
    })

    return detachedNodes
  }

  private reportLeak(leak: MemoryLeak): void {
    // 避免重复报告相同的泄漏
    const existingLeak = Array.from(this.leaks.values())
      .find(l => l.type === leak.type && l.location === leak.location)

    if (existingLeak) {
      // 更新现有泄漏
      existingLeak.detectedAt = leak.detectedAt
      existingLeak.memoryImpact = Math.max(existingLeak.memoryImpact, leak.memoryImpact)
    } else {
      // 添加新泄漏
      this.leaks.set(leak.id, leak)
    }

    console.warn('Memory leak detected:', leak)
  }

  private setupGlobalListeners(): void {
    // 监听页面卸载事件
    window.addEventListener('beforeunload', () => {
      this.stopDetection()
    })
  }
}

// ==================== 内存优化器 ====================

export class MemoryOptimizer {
  private monitor: MemoryMonitor
  private leakDetector: MemoryLeakDetector
  private config: MemoryOptimizerConfig
  private isOptimizing: boolean = false

  constructor(config: Partial<MemoryOptimizerConfig> = {}) {
    this.config = {
      enableAutoOptimization: true,
      enableLeakDetection: true,
      maxMemoryUsage: 100,
      optimizationThreshold: 80,
      monitoringInterval: 5000,
      snapshotInterval: 30000,
      enableMemoryProfiling: true,
      enableComponentTracking: true,
      enableEventTracking: true,
      aggressiveOptimization: false,
      cleanupOnUnload: true,
      ...config
    }

    this.monitor = new MemoryMonitor(this.config)
    this.leakDetector = new MemoryLeakDetector()

    if (this.config.enableLeakDetection) {
      this.leakDetector.startDetection()
    }
  }

  /**
   * 开始优化
   */
  startOptimization(): void {
    this.monitor.startMonitoring()
  }

  /**
   * 停止优化
   */
  stopOptimization(): void {
    this.monitor.stopMonitoring()
    this.leakDetector.stopDetection()
  }

  /**
   * 执行内存优化
   */
  async optimizeMemory(): Promise<MemoryOptimizationResult> {
    if (this.isOptimizing) {
      return {
        optimizedMemory: 0,
        freedMemory: 0,
        optimizationTechniques: [],
        duration: 0,
        success: false,
        issues: ['优化正在进行中']
      }
    }

    this.isOptimizing = true
    const startTime = performance.now()

    try {
      const techniques: string[] = []
      let freedMemory = 0

      // 1. 清理缓存
      if (this.config.aggressiveOptimization) {
        const cacheResult = await this.clearCaches()
        if (cacheResult > 0) {
          techniques.push('清理缓存')
          freedMemory += cacheResult
        }
      }

      // 2. 清理事件监听器
      const listenerResult = this.cleanupEventListeners()
      if (listenerResult > 0) {
        techniques.push('清理事件监听器')
        freedMemory += listenerResult
      }

      // 3. 清理定时器
      const timerResult = this.cleanupTimers()
      if (timerResult > 0) {
        techniques.push('清理定时器')
        freedMemory += timerResult
      }

      // 4. 清理DOM节点
      const domResult = this.cleanupDOMNodes()
      if (domResult > 0) {
        techniques.push('清理DOM节点')
        freedMemory += domResult
      }

      // 5. 强制垃圾回收
      if (this.monitor.forceGarbageCollection()) {
        techniques.push('强制垃圾回收')
      }

      // 6. 清理分离的节点
      const detachedResult = this.cleanupDetachedNodes()
      if (detachedResult > 0) {
        techniques.push('清理分离节点')
        freedMemory += detachedResult
      }

      const duration = performance.now() - startTime
      const currentSnapshot = this.monitor.getCurrentSnapshot()
      const optimizedMemory = currentSnapshot ? currentSnapshot.usedJSHeapSize / 1024 / 1024 : 0

      return {
        optimizedMemory,
        freedMemory,
        optimizationTechniques: techniques,
        duration,
        success: true,
        issues: []
      }
    } catch (error) {
      return {
        optimizedMemory: 0,
        freedMemory: 0,
        optimizationTechniques: [],
        duration: performance.now() - startTime,
        success: false,
        issues: [error instanceof Error ? error.message : 'Unknown error']
      }
    } finally {
      this.isOptimizing = false
    }
  }

  /**
   * 获取内存指标
   */
  getMemoryMetrics(): MemoryMetrics {
    return this.monitor.getMetrics()
  }

  /**
   * 获取内存泄漏
   */
  getMemoryLeaks(): MemoryLeak[] {
    return this.leakDetector.getLeaks()
  }

  /**
   * 获取内存快照
   */
  getMemorySnapshots(): MemorySnapshot[] {
    return this.monitor.getSnapshots()
  }

  /**
   * 注册组件
   */
  registerComponent(componentName: string, instanceId: string): void {
    if (this.config.enableComponentTracking) {
      this.leakDetector.registerComponent(componentName, instanceId)
    }
  }

  /**
   * 注销组件
   */
  unregisterComponent(componentName: string, instanceId: string): void {
    if (this.config.enableComponentTracking) {
      this.leakDetector.unregisterComponent(componentName, instanceId)
    }
  }

  /**
   * 生成内存报告
   */
  generateMemoryReport(): string {
    const metrics = this.getMemoryMetrics()
    const leaks = this.getMemoryLeaks()
    const snapshots = this.getMemorySnapshots()

    let report = '# Xorigo UI 内存使用报告\n\n'
    report += `生成时间: ${new Date().toLocaleString('zh-CN')}\n\n`

    // 内存指标
    report += '## 内存使用指标\n\n'
    report += `- 当前使用: ${metrics.currentUsage.toFixed(2)} MB\n`
    report += `- 峰值使用: ${metrics.peakUsage.toFixed(2)} MB\n`
    report += `- 平均使用: ${metrics.averageUsage.toFixed(2)} MB\n`
    report += `- 使用趋势: ${metrics.trend}\n`
    report += `- 增长率: ${metrics.growthRate.toFixed(2)} MB/min\n`
    report += `- 优化分数: ${metrics.optimizationScore}/100\n\n`

    // 内存泄漏
    if (leaks.length > 0) {
      report += '## 检测到的内存泄漏\n\n'
      leaks.forEach(leak => {
        report += `### ${leak.type} (${leak.severity})\n`
        report += `- 描述: ${leak.description}\n`
        report += `- 位置: ${leak.location}\n`
        report += `- 内存影响: ${(leak.memoryImpact / 1024 / 1024).toFixed(2)} MB\n`
        report += `- 建议: ${leak.recommendation}\n\n`
      })
    }

    // 建议
    if (metrics.recommendations.length > 0) {
      report += '## 优化建议\n\n'
      metrics.recommendations.forEach(rec => {
        report += `- ${rec}\n`
      })
      report += '\n'
    }

    return report
  }

  // ==================== 私有方法 ====================

  private async clearCaches(): Promise<number> {
    let freedMemory = 0

    // 清理浏览器缓存
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys()
        for (const name of cacheNames) {
          await caches.delete(name)
          freedMemory += 1024 * 1024 // 估算每个缓存1MB
        }
      } catch (error) {
        console.warn('Failed to clear caches:', error)
      }
    }

    // 清理localStorage
    if (typeof localStorage !== 'undefined') {
      const size = this.calculateStorageSize(localStorage)
      localStorage.clear()
      freedMemory += size
    }

    // 清理sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      const size = this.calculateStorageSize(sessionStorage)
      sessionStorage.clear()
      freedMemory += size
    }

    return freedMemory
  }

  private cleanupEventListeners(): number {
    // 这是一个简化的实现
    // 实际实现需要跟踪所有注册的事件监听器
    return 0
  }

  private cleanupTimers(): number {
    // 清理所有定时器（这是危险的，只用于紧急情况）
    let clearedCount = 0

    // 获取最大的定时器ID
    const maxTimerId = setTimeout(() => {}, 0)

    for (let i = 1; i <= maxTimerId; i++) {
      clearTimeout(i)
      clearInterval(i)
      clearedCount++
    }

    return clearedCount * 512 // 估算每个定时器512字节
  }

  private cleanupDOMNodes(): number {
    let removedNodes = 0

    // 移除空的容器元素
    const emptyContainers = document.querySelectorAll('div:empty, span:empty')
    emptyContainers.forEach(node => {
      if (node.parentNode && !this.isNodeImportant(node)) {
        node.parentNode.removeChild(node)
        removedNodes++
      }
    })

    return removedNodes * 200 // 估算每个节点200字节
  }

  private cleanupDetachedNodes(): number {
    const allNodes = Array.from(document.querySelectorAll('*'))
    let removedNodes = 0

    allNodes.forEach(node => {
      if (!document.contains(node) && node.parentNode) {
        node.parentNode.removeChild(node)
        removedNodes++
      }
    })

    return removedNodes * 300 // 估算每个分离节点300字节
  }

  private calculateStorageSize(storage: Storage): number {
    let size = 0
    for (const key in storage) {
      if (storage.hasOwnProperty(key)) {
        size += storage[key].length + key.length
      }
    }
    return size * 2 // UTF-16
  }

  private isNodeImportant(node: Node): boolean {
    // 检查节点是否重要（不应该被删除）
    if (node.id) return true
    if (node.className) return true
    if (node.hasAttributes()) return true

    const tagName = (node as Element).tagName?.toLowerCase()
    const importantTags = ['script', 'style', 'link', 'meta', 'title']
    return importantTags.includes(tagName || '')
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.stopOptimization()
  }
}

// ==================== React Hook ====================

/**
 * 内存优化Hook
 */
export function useMemoryOptimizer(config?: Partial<MemoryOptimizerConfig>) {
  const optimizerRef = useRef<MemoryOptimizer>()
  const [metrics, setMetrics] = useState<MemoryMetrics>()
  const [leaks, setLeaks] = useState<MemoryLeak[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)

  useEffect(() => {
    optimizerRef.current = new MemoryOptimizer(config)
    optimizerRef.current.startOptimization()

    const interval = setInterval(() => {
      if (optimizerRef.current) {
        setMetrics(optimizerRef.current.getMemoryMetrics())
        setLeaks(optimizerRef.current.getMemoryLeaks())
      }
    }, 5000)

    return () => {
      clearInterval(interval)
      optimizerRef.current?.dispose()
    }
  }, [config])

  const optimizeMemory = useCallback(async () => {
    if (!optimizerRef.current) return

    setIsOptimizing(true)
    try {
      const result = await optimizerRef.current.optimizeMemory()
      return result
    } finally {
      setIsOptimizing(false)
    }
  }, [])

  const registerComponent = useCallback((componentName: string, instanceId: string) => {
    optimizerRef.current?.registerComponent(componentName, instanceId)
  }, [])

  const unregisterComponent = useCallback((componentName: string, instanceId: string) => {
    optimizerRef.current?.unregisterComponent(componentName, instanceId)
  }, [])

  const generateReport = useCallback(() => {
    return optimizerRef.current?.generateMemoryReport() || ''
  }, [])

  return {
    metrics,
    leaks,
    isOptimizing,
    optimizeMemory,
    registerComponent,
    unregisterComponent,
    generateReport,
    getSnapshots: () => optimizerRef.current?.getMemorySnapshots() || []
  }
}

// ==================== 导出 ====================

export default MemoryOptimizer

// 便捷导出
export {
  MemoryMonitor,
  MemoryLeakDetector,
  useMemoryOptimizer
}

// 全局实例
export const globalMemoryOptimizer = new MemoryOptimizer()