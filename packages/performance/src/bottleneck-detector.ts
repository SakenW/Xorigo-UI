/**
 * Xorigo UI 性能瓶颈检测器
 *
 * 自动检测应用程序中的性能瓶颈，包括：
 * - 不必要的组件重渲染
 * - 内存泄漏
 * - 慢速函数执行
 * - 资源加载问题
 * - 事件处理瓶颈
 *
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import type { PerformanceMetric } from './monitor'

// ==================== 类型定义 ====================

export interface Bottleneck {
  id: string
  type: 're-render' | 'memory-leak' | 'slow-function' | 'large-bundle' | 'event-handler' | 'render-blocking' | 'state-update'
  severity: 'critical' | 'serious' | 'moderate' | 'minor'
  title: string
  description: string
  location: string
  component?: string
  functionName?: string
  metric: PerformanceMetric
  impact: {
    performance: number // 1-100
    userExperience: number // 1-100
    resourceUsage: number // 1-100
  }
  timestamp: number
  stackTrace?: string
  context?: Record<string, any>
}

export interface ReRenderAnalysis {
  componentName: string
  instanceId: string
  renderCount: number
  unnecessaryRenders: number
  renderReasons: Array<{
    reason: string
    count: number
    percentage: number
  }>
  wastefulRenders: Array<{
    reason: string
    count: number
    avgRenderTime: number
  }>
  suggestions: string[]
  canBeOptimized: boolean
  optimizationPotential: number // 1-100
}

export interface MemoryLeakAnalysis {
  type: 'event-listener' | 'timer' | 'component' | 'closure' | 'dom-node' | 'cache'
  severity: 'critical' | 'serious' | 'moderate' | 'minor'
  location: string
  component?: string
  description: string
  memoryUsage: number // MB
  growthRate: number // MB/min
  evidence: string[]
  recommendations: string[]
  autoFixable: boolean
}

export interface FunctionPerformanceAnalysis {
  functionName: string
  executionCount: number
  averageTime: number
  maxTime: number
  minTime: number
  totalTime: number
  slowExecutions: Array<{
    timestamp: number
    duration: number
    context?: any
  }>
  bottlenecks: Array<{
    line: number
    duration: number
    percentage: number
  }>
  canBeOptimized: boolean
  optimizationSuggestions: string[]
}

export interface DetectionConfig {
  scanInterval: number // ms
  enableReRenderDetection: boolean
  enableMemoryLeakDetection: boolean
  enableFunctionAnalysis: boolean
  enableBundleAnalysis: boolean
  renderThreshold: number // 渲染次数阈值
  renderTimeThreshold: number // ms
  memoryThreshold: number // MB
  functionTimeThreshold: number // ms
  leakGrowthThreshold: number // MB/min
  maxStackTraces: number
  enableAutoFix: boolean
}

export interface DetectionResult {
  bottlenecks: Bottleneck[]
  reRenderAnalysis: ReRenderAnalysis[]
  memoryLeakAnalysis: MemoryLeakAnalysis[]
  functionAnalysis: FunctionPerformanceAnalysis[]
  overallScore: number // 1-100
  summary: {
    totalBottlenecks: number
    criticalIssues: number
    seriousIssues: number
    moderateIssues: number
    minorIssues: number
  }
  recommendations: string[]
  timestamp: number
}

// ==================== 瓶颈检测器类 ====================

export class BottleneckDetector {
  private config: DetectionConfig
  private bottlenecks: Bottleneck[] = []
  private reRenderData: Map<string, Array<{
    timestamp: number
    reason?: string
    renderTime: number
  }>> = new Map()
  private memorySnapshots: Array<{
    timestamp: number
    usage: number
  }> = []
  private functionExecutions: Map<string, Array<{
    timestamp: number
    duration: number
    context?: any
  }>> = new Map()
  private analysisInterval?: NodeJS.Timeout
  private callbacks: Set<(result: DetectionResult) => void> = new Set()

  constructor(config: Partial<DetectionConfig> = {}) {
    this.config = {
      scanInterval: 10000, // 每10秒检测一次
      enableReRenderDetection: true,
      enableMemoryLeakDetection: true,
      enableFunctionAnalysis: true,
      enableBundleAnalysis: false,
      renderThreshold: 100,
      renderTimeThreshold: 16,
      memoryThreshold: 70,
      functionTimeThreshold: 10,
      leakGrowthThreshold: 5,
      maxStackTraces: 10,
      enableAutoFix: false,
      ...config
    }
  }

  // ==================== 检测控制 ====================

  /**
   * 开始自动检测
   */
  start(autoScan: boolean = true): void {
    if (autoScan) {
      this.analysisInterval = setInterval(() => {
        this.detectAllBottlenecks()
      }, this.config.scanInterval)
    }

    console.log('[BottleneckDetector] 开始性能瓶颈检测')
  }

  /**
   * 停止检测
   */
  stop(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval)
      this.analysisInterval = undefined
    }

    console.log('[BottleneckDetector] 停止性能瓶颈检测')
  }

  /**
   * 执行全面检测
   */
  detectAllBottlenecks(): DetectionResult {
    const result: DetectionResult = {
      bottlenecks: [],
      reRenderAnalysis: [],
      memoryLeakAnalysis: [],
      functionAnalysis: [],
      overallScore: 100,
      summary: {
        totalBottlenecks: 0,
        criticalIssues: 0,
        seriousIssues: 0,
        moderateIssues: 0,
        minorIssues: 0
      },
      recommendations: [],
      timestamp: Date.now()
    }

    // 检测重渲染问题
    if (this.config.enableReRenderDetection) {
      result.reRenderAnalysis = this.detectReRenderBottlenecks()
    }

    // 检测内存泄漏
    if (this.config.enableMemoryLeakDetection) {
      result.memoryLeakAnalysis = this.detectMemoryLeaks()
    }

    // 检测函数性能
    if (this.config.enableFunctionAnalysis) {
      result.functionAnalysis = this.detectFunctionBottlenecks()
    }

    // 合并所有瓶颈
    result.bottlenecks = [
      ...result.reRenderAnalysis.map(a => this.createReRenderBottleneck(a)),
      ...result.memoryLeakAnalysis.map(a => this.createMemoryLeakBottleneck(a)),
      ...result.functionAnalysis.map(a => this.createFunctionBottleneck(a))
    ]

    // 计算总体分数
    result.overallScore = this.calculateOverallScore(result.bottlenecks)

    // 计算汇总统计
    result.summary = {
      totalBottlenecks: result.bottlenecks.length,
      criticalIssues: result.bottlenecks.filter(b => b.severity === 'critical').length,
      seriousIssues: result.bottlenecks.filter(b => b.severity === 'serious').length,
      moderateIssues: result.bottlenecks.filter(b => b.severity === 'moderate').length,
      minorIssues: result.bottlenecks.filter(b => b.severity === 'minor').length
    }

    // 生成总体建议
    result.recommendations = this.generateRecommendations(result)

    this.bottlenecks = result.bottlenecks

    // 通知回调
    this.callbacks.forEach(callback => callback(result))

    return result
  }

  // ==================== 重渲染检测 ====================

  /**
   * 检测重渲染瓶颈
   */
  detectReRenderBottlenecks(): ReRenderAnalysis[] {
    const analyses: ReRenderAnalysis[] = []
    const componentData = new Map<string, Array<{
      timestamp: number
      reason?: string
      renderTime: number
    }>>()

    // 收集重渲染数据
    this.reRenderData.forEach((data, key) => {
      componentData.set(key, data)
    })

    componentData.forEach((data, componentKey) => {
      const [componentName, instanceId] = componentKey.split(':')
      const renderCount = data.length

      if (renderCount < this.config.renderThreshold) {
        return
      }

      // 分析渲染原因
      const reasonCounts = new Map<string, number>()
      const wastefulRenders: Array<{
        reason: string
        count: number
        avgRenderTime: number
      }> = []

      data.forEach(render => {
        if (render.reason) {
          reasonCounts.set(render.reason, (reasonCounts.get(render.reason) || 0) + 1)
        }
      })

      // 识别不必要的渲染
      let unnecessaryRenders = 0
      const renderReasons = Array.from(reasonCounts.entries()).map(([reason, count]) => {
        const percentage = (count / renderCount) * 100
        const slowRenders = data.filter(r => r.reason === reason && r.renderTime > this.config.renderTimeThreshold)

        if (slowRenders.length > 0) {
          wastefulRenders.push({
            reason,
            count: slowRenders.length,
            avgRenderTime: slowRenders.reduce((sum, r) => sum + r.renderTime, 0) / slowRenders.length
          })
        }

        // 如果渲染时间很短，可能是不必要的
        if (renderCount > this.config.renderThreshold * 2 && percentage > 50) {
          unnecessaryRenders += Math.floor(count * 0.3)
        }

        return {
          reason,
          count,
          percentage: Math.round(percentage * 100) / 100
        }
      }).sort((a, b) => b.count - a.count)

      // 生成建议
      const suggestions: string[] = []
      if (unnecessaryRenders > renderCount * 0.3) {
        suggestions.push(`检测到 ${unnecessaryRenders} 次不必要的渲染，建议使用 React.memo`)
      }

      const topReason = renderReasons[0]
      if (topReason && topReason.percentage > 70) {
        suggestions.push(`组件主要因 "${topReason.reason}" 频繁渲染，建议优化相关逻辑`)
      }

      if (wastefulRenders.length > 0) {
        suggestions.push('存在渲染时间过长的渲染，建议使用 useMemo 或 useCallback 优化')
      }

      // 计算优化潜力
      const optimizationPotential = Math.min(100, Math.max(0,
        (unnecessaryRenders / renderCount) * 100 +
        (wastefulRenders.length / renderCount) * 50
      ))

      const analysis: ReRenderAnalysis = {
        componentName,
        instanceId,
        renderCount,
        unnecessaryRenders,
        renderReasons,
        wastefulRenders,
        suggestions,
        canBeOptimized: optimizationPotential > 20,
        optimizationPotential
      }

      analyses.push(analysis)
    })

    return analyses
  }

  /**
   * 记录组件渲染
   */
  recordRender(componentName: string, instanceId: string, renderTime: number, reason?: string): void {
    const key = `${componentName}:${instanceId}`
    const data = this.reRenderData.get(key) || []

    data.push({
      timestamp: Date.now(),
      reason,
      renderTime
    })

    // 限制数据量
    if (data.length > 1000) {
      data.shift()
    }

    this.reRenderData.set(key, data)
  }

  // ==================== 内存泄漏检测 ====================

  /**
   * 检测内存泄漏
   */
  detectMemoryLeaks(): MemoryLeakAnalysis[] {
    const analyses: MemoryLeakAnalysis[] = []

    if (this.memorySnapshots.length < 10) {
      return analyses
    }

    // 分析内存增长趋势
    const recent = this.memorySnapshots.slice(-5)
    const older = this.memorySnapshots.slice(-10, -5)

    if (recent.length > 0 && older.length > 0) {
      const recentAvg = recent.reduce((sum, s) => sum + s.usage, 0) / recent.length
      const olderAvg = older.reduce((sum, s) => sum + s.usage, 0) / older.length
      const growthRate = ((recentAvg - olderAvg) / olderAvg) * 100

      // 检测持续增长
      if (growthRate > 10) {
        analyses.push({
          type: 'memory-leak',
          severity: growthRate > 50 ? 'critical' : growthRate > 20 ? 'serious' : 'moderate',
          location: 'heap',
          description: `内存使用持续增长，增长率: ${growthRate.toFixed(2)}%`,
          memoryUsage: recentAvg,
          growthRate: growthRate,
          evidence: [
            `过去5次快照平均使用: ${recentAvg.toFixed(2)} MB`,
            `更早5次快照平均使用: ${olderAvg.toFixed(2)} MB`
          ],
          recommendations: [
            '检查是否有未清理的事件监听器',
            '检查是否有未清理的定时器',
            '检查组件是否正确卸载',
            '使用内存分析工具进一步调查'
          ],
          autoFixable: false
        })
      }
    }

    // 检测内存峰值
    const currentUsage = this.memorySnapshots[this.memorySnapshots.length - 1]?.usage || 0
    const peakUsage = Math.max(...this.memorySnapshots.map(s => s.usage))

    if (currentUsage > this.config.memoryThreshold) {
      analyses.push({
        type: 'memory-leak',
        severity: currentUsage > this.config.memoryThreshold * 1.5 ? 'critical' : 'serious',
        location: 'heap',
        description: `当前内存使用过高: ${currentUsage.toFixed(2)} MB`,
        memoryUsage: currentUsage,
        growthRate: 0,
        evidence: [
          `当前使用: ${currentUsage.toFixed(2)} MB`,
          `历史峰值: ${peakUsage.toFixed(2)} MB`,
          `阈值: ${this.config.memoryThreshold} MB`
        ],
        recommendations: [
          '立即执行垃圾回收',
          '清理不必要的缓存',
          '检查是否存在内存泄漏'
        ],
        autoFixable: true
      })
    }

    return analyses
  }

  /**
   * 记录内存快照
   */
  recordMemorySnapshot(usage: number): void {
    this.memorySnapshots.push({
      timestamp: Date.now(),
      usage
    })

    // 限制数据量
    if (this.memorySnapshots.length > 100) {
      this.memorySnapshots.shift()
    }
  }

  // ==================== 函数性能检测 ====================

  /**
   * 检测函数性能瓶颈
   */
  detectFunctionBottlenecks(): FunctionPerformanceAnalysis[] {
    const analyses: FunctionPerformanceAnalysis[] = []

    this.functionExecutions.forEach((executions, functionName) => {
      if (executions.length < 5) {
        return // 至少需要5次执行才分析
      }

      const durations = executions.map(e => e.duration)
      const averageTime = durations.reduce((sum, d) => sum + d, 0) / durations.length
      const maxTime = Math.max(...durations)
      const minTime = Math.min(...durations)
      const totalTime = durations.reduce((sum, d) => sum + d, 0)

      if (averageTime < this.config.functionTimeThreshold) {
        return
      }

      // 找出慢速执行
      const slowExecutions = executions.filter(e => e.duration > this.config.functionTimeThreshold)

      const analysis: FunctionPerformanceAnalysis = {
        functionName,
        executionCount: executions.length,
        averageTime,
        maxTime,
        minTime,
        totalTime,
        slowExecutions: slowExecutions.slice(-10).map(e => ({
          timestamp: e.timestamp,
          duration: e.duration,
          context: e.context
        })),
        bottlenecks: [], // 简化实现
        canBeOptimized: maxTime > this.config.functionTimeThreshold * 2,
        optimizationSuggestions: this.generateFunctionOptimizationSuggestions(averageTime, maxTime, slowExecutions.length)
      }

      analyses.push(analysis)
    })

    return analyses
  }

  /**
   * 记录函数执行
   */
  recordFunctionExecution(functionName: string, duration: number, context?: any): void {
    const executions = this.functionExecutions.get(functionName) || []

    executions.push({
      timestamp: Date.now(),
      duration,
      context
    })

    // 限制数据量
    if (executions.length > 100) {
      executions.shift()
    }

    this.functionExecutions.set(functionName, executions)
  }

  // ==================== 数据查询 ====================

  /**
   * 获取所有瓶颈
   */
  getBottlenecks(filter?: {
    type?: string
    severity?: string
    component?: string
  }): Bottleneck[] {
    if (!filter) {
      return [...this.bottlenecks]
    }

    return this.bottlenecks.filter(b => {
      if (filter.type && b.type !== filter.type) return false
      if (filter.severity && b.severity !== filter.severity) return false
      if (filter.component && b.component !== filter.component) return false
      return true
    })
  }

  /**
   * 获取最新的检测结果
   */
  getLatestResult(): DetectionResult | null {
    if (this.bottlenecks.length === 0) {
      return null
    }

    const criticalIssues = this.bottlenecks.filter(b => b.severity === 'critical').length
    const seriousIssues = this.bottlenecks.filter(b => b.severity === 'serious').length
    const moderateIssues = this.bottlenecks.filter(b => b.severity === 'moderate').length
    const minorIssues = this.bottlenecks.filter(b => b.severity === 'minor').length

    return {
      bottlenecks: [...this.bottlenecks],
      reRenderAnalysis: [],
      memoryLeakAnalysis: [],
      functionAnalysis: [],
      overallScore: this.calculateOverallScore(this.bottlenecks),
      summary: {
        totalBottlenecks: this.bottlenecks.length,
        criticalIssues,
        seriousIssues,
        moderateIssues,
        minorIssues
      },
      recommendations: this.generateRecommendations({
        bottlenecks: this.bottlenecks,
        reRenderAnalysis: [],
        memoryLeakAnalysis: [],
        functionAnalysis: [],
        overallScore: 0,
        summary: {
          totalBottlenecks: this.bottlenecks.length,
          criticalIssues,
          seriousIssues,
          moderateIssues,
          minorIssues
        },
        recommendations: [],
        timestamp: Date.now()
      }),
      timestamp: Date.now()
    }
  }

  // ==================== 订阅和通知 ====================

  /**
   * 订阅检测结果
   */
  subscribe(callback: (result: DetectionResult) => void): () => void {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  // ==================== 私有方法 ====================

  private createReRenderBottleneck(analysis: ReRenderAnalysis): Bottleneck {
    const severity = analysis.unnecessaryRenders > analysis.renderCount * 0.5 ? 'critical' :
                     analysis.unnecessaryRenders > analysis.renderCount * 0.3 ? 'serious' :
                     'moderate'

    return {
      id: `re-render-${analysis.componentName}-${analysis.instanceId}`,
      type: 're-render',
      severity,
      title: `组件 ${analysis.componentName} 存在不必要的重渲染`,
      description: `组件在 ${analysis.renderCount} 次渲染中，有 ${analysis.unnecessaryRenders} 次是不必要的`,
      location: `${analysis.componentName}.${analysis.instanceId}`,
      component: analysis.componentName,
      metric: {
        name: 'component.re-render',
        value: analysis.unnecessaryRenders,
        unit: 'count',
        timestamp: Date.now(),
        componentId: `${analysis.componentName}:${analysis.instanceId}`
      },
      impact: {
        performance: Math.min(100, analysis.optimizationPotential),
        userExperience: Math.min(100, analysis.unnecessaryRenders / analysis.renderCount * 100),
        resourceUsage: Math.min(100, analysis.renderCount / 100 * 100)
      },
      timestamp: Date.now(),
      context: {
        renderCount: analysis.renderCount,
        unnecessaryRenders: analysis.unnecessaryRenders,
        renderReasons: analysis.renderReasons
      }
    }
  }

  private createMemoryLeakBottleneck(analysis: MemoryLeakAnalysis): Bottleneck {
    return {
      id: `memory-leak-${analysis.location}-${Date.now()}`,
      type: 'memory-leak',
      severity: analysis.severity,
      title: `检测到内存泄漏: ${analysis.description}`,
      description: analysis.description,
      location: analysis.location,
      component: analysis.component,
      metric: {
        name: 'memory.leak',
        value: analysis.memoryUsage,
        unit: 'bytes',
        timestamp: Date.now()
      },
      impact: {
        performance: analysis.severity === 'critical' ? 90 : analysis.severity === 'serious' ? 70 : 50,
        userExperience: analysis.severity === 'critical' ? 95 : analysis.severity === 'serious' ? 75 : 55,
        resourceUsage: 100
      },
      timestamp: Date.now()
    }
  }

  private createFunctionBottleneck(analysis: FunctionPerformanceAnalysis): Bottleneck {
    const severity = analysis.maxTime > analysis.averageTime * 3 ? 'critical' :
                     analysis.maxTime > analysis.averageTime * 2 ? 'serious' :
                     analysis.averageTime > this.config.functionTimeThreshold ? 'moderate' : 'minor'

    return {
      id: `function-${analysis.functionName}`,
      type: 'slow-function',
      severity,
      title: `函数 ${analysis.functionName} 执行性能较差`,
      description: `函数平均执行时间 ${analysis.averageTime.toFixed(2)}ms，最长 ${analysis.maxTime.toFixed(2)}ms`,
      location: analysis.functionName,
      functionName: analysis.functionName,
      metric: {
        name: 'function.performance',
        value: analysis.averageTime,
        unit: 'ms',
        timestamp: Date.now()
      },
      impact: {
        performance: Math.min(100, (analysis.averageTime / this.config.functionTimeThreshold) * 100),
        userExperience: Math.min(100, (analysis.averageTime / 16) * 100),
        resourceUsage: Math.min(100, analysis.executionCount / 100 * 100)
      },
      timestamp: Date.now()
    }
  }

  private calculateOverallScore(bottlenecks: Bottleneck[]): number {
    if (bottlenecks.length === 0) return 100

    let score = 100
    const weights = {
      critical: 20,
      serious: 10,
      moderate: 5,
      minor: 2
    }

    bottlenecks.forEach(bottleneck => {
      score -= weights[bottleneck.severity]
    })

    return Math.max(0, score)
  }

  private generateRecommendations(result: DetectionResult): string[] {
    const recommendations: string[] = []

    // 根据瓶颈类型生成建议
    if (result.reRenderAnalysis.length > 0) {
      const totalWastefulRenders = result.reRenderAnalysis.reduce((sum, a) => sum + a.unnecessaryRenders, 0)
      if (totalWastefulRenders > 100) {
        recommendations.push(`检测到 ${totalWastefulRenders} 次不必要的重渲染，建议使用 React.memo 和 useCallback 优化`)
      }
    }

    if (result.memoryLeakAnalysis.length > 0) {
      const criticalLeaks = result.memoryLeakAnalysis.filter(a => a.severity === 'critical')
      if (criticalLeaks.length > 0) {
        recommendations.push(`发现 ${criticalLeaks.length} 个严重内存泄漏，建议立即修复`)
      }
    }

    if (result.functionAnalysis.length > 0) {
      const slowFunctions = result.functionAnalysis.filter(a => a.averageTime > this.config.functionTimeThreshold * 2)
      if (slowFunctions.length > 0) {
        recommendations.push(`发现 ${slowFunctions.length} 个性能较差的函数，建议优化算法或使用缓存`)
      }
    }

    // 总体建议
    if (result.summary.criticalIssues > 0) {
      recommendations.push(`存在 ${result.summary.criticalIssues} 个严重性能问题，建议优先修复`)
    }

    if (result.overallScore < 70) {
      recommendations.push('整体性能分数较低，建议进行全面优化')
    }

    return recommendations
  }

  private generateFunctionOptimizationSuggestions(averageTime: number, maxTime: number, slowCount: number): string[] {
    const suggestions: string[] = []

    if (averageTime > 20) {
      suggestions.push('函数执行时间过长，建议优化算法复杂度')
    }

    if (maxTime > averageTime * 3) {
      suggestions.push('函数执行时间波动较大，建议检查异常情况处理')
    }

    if (slowCount > 10) {
      suggestions.push('慢速执行次数较多，建议增加缓存或使用Web Worker')
    }

    suggestions.push('考虑将函数拆分或使用异步执行')

    return suggestions
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.stop()
    this.bottlenecks = []
    this.reRenderData.clear()
    this.memorySnapshots = []
    this.functionExecutions.clear()
    this.callbacks.clear()
  }
}

// ==================== 默认导出 ====================

export default BottleneckDetector
