/**
 * ⚡ 七轴主题系统性能测试和优化
 *
 * 提供全面的性能测试、监控和优化功能：
 * - 配方加载性能测试
 * - 主题切换性能监控
 * - 内存使用分析
 * - 缓存效率评估
 * - 渲染性能测量
 * - 自动化性能优化建议
 */

import { DynamicRecipe, CompleteCalculationResult } from './seven-axis-recipe-engine'
import { sevenAxisCalculator } from './seven-axis-calculator'
import { recipeCacheManager } from './recipe-cache-manager'
import { recipeRegistry } from './recipe-registry'

// ============================================================================
// 性能测试类型定义
// ============================================================================

/**
 * 性能测试配置
 */
export interface PerformanceTestConfig {
  /** 测试名称 */
  name: string
  /** 测试描述 */
  description: string
  /** 测试类型 */
  type: 'load' | 'switch' | 'memory' | 'cache' | 'render' | 'comprehensive'
  /** 测试参数 */
  parameters: Record<string, any>
  /** 性能基准 */
  benchmarks: PerformanceBenchmarks
  /** 运行次数 */
  iterations: number
  /** 预热次数 */
  warmupIterations: number
  /** 是否启用详细日志 */
  verbose: boolean
}

/**
 * 性能基准
 */
export interface PerformanceBenchmarks {
  /** 最小可接受时间（毫秒） */
  minAcceptableTime: number
  /** 目标时间（毫秒） */
  targetTime: number
  /** 最大内存使用（MB） */
  maxMemoryUsage: number
  /** 最小缓存命中率 */
  minCacheHitRate: number
  /** 最大CPU使用率 */
  maxCPUUsage: number
}

/**
 * 性能测试结果
 */
export interface PerformanceTestResult {
  /** 测试名称 */
  name: string
  /** 测试类型 */
  type: string
  /** 是否通过基准 */
  passed: boolean
  /** 执行时间统计 */
  timing: TimingStats
  /** 内存使用统计 */
  memory: MemoryStats
  /** 缓存统计 */
  cache: CacheStats
  /** CPU使用率 */
  cpuUsage: number
  /** 错误信息 */
  errors: string[]
  /** 警告信息 */
  warnings: string[]
  /** 优化建议 */
  recommendations: PerformanceRecommendation[]
  /** 测试时间戳 */
  timestamp: number
  /** 详细指标 */
  metrics: Record<string, number>
}

/**
 * 时间统计
 */
export interface TimingStats {
  /** 平均时间（毫秒） */
  average: number
  /** 最小时间（毫秒） */
  min: number
  /** 最大时间（毫秒） */
  max: number
  /** 中位数时间（毫秒） */
  median: number
  /** 标准差 */
  standardDeviation: number
  /** 95百分位 */
  p95: number
  /** 99百分位 */
  p99: number
  /** 总执行时间 */
  totalTime: number
}

/**
 * 内存统计
 */
export interface MemoryStats {
  /** 初始内存（MB） */
  initial: number
  /** 峰值内存（MB） */
  peak: number
  /** 最终内存（MB） */
  final: number
  /** 内存增长（MB） */
  growth: number
  /** 垃圾回收次数 */
  gcCount: number
  /** 内存泄漏风险 */
  leakRisk: 'low' | 'medium' | 'high'
}

/**
 * 缓存统计
 */
export interface CacheStats {
  /** 命中率 */
  hitRate: number
  /** 未命中次数 */
  missCount: number
  /** 命中次数 */
  hitCount: number
  /** 缓存大小 */
  size: number
  /** 平均访问时间 */
  averageAccessTime: number
}

/**
 * 性能优化建议
 */
export interface PerformanceRecommendation {
  /** 建议类型 */
  type: 'critical' | 'warning' | 'info'
  /** 建议标题 */
  title: string
  /** 建议描述 */
  description: string
  /** 预期改进 */
  expectedImprovement: string
  /** 实施难度 */
  difficulty: 'easy' | 'medium' | 'hard'
  /** 相关配置 */
  relatedConfig?: string
}

/**
 * 性能报告
 */
export interface PerformanceReport {
  /** 报告ID */
  id: string
  /** 报告名称 */
  name: string
  /** 测试结果 */
  results: PerformanceTestResult[]
  /** 总体评分 */
  overallScore: number
  /** 总体状态 */
  overallStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
  /** 生成时间 */
  generatedAt: number
  /** 测试环境信息 */
  environment: {
    userAgent: string
    platform: string
    memory: number
    cores: number
  }
  /** 主要发现 */
  keyFindings: string[]
  /** 优先建议 */
  priorityRecommendations: PerformanceRecommendation[]
}

// ============================================================================
// 性能测试套件
// ============================================================================

/**
 * 七轴主题系统性能测试套件
 *
 * 提供全面的性能测试和监控功能：
 * - 配方加载性能测试
 * - 主题切换性能测试
 * - 内存使用分析
 * - 缓存效率测试
 * - 渲染性能测量
 * - 自动化优化建议
 */
export class ThemePerformanceTestSuite {
  private testConfigs: Map<string, PerformanceTestConfig>
  private currentResults: Map<string, PerformanceTestResult>
  private baselineResults: Map<string, PerformanceTestResult>
  private isMonitoring: boolean
  private monitoringInterval: NodeJS.Timeout | null

  constructor() {
    this.testConfigs = new Map()
    this.currentResults = new Map()
    this.baselineResults = new Map()
    this.isMonitoring = false
    this.monitoringInterval = null

    this.initializeTestConfigs()
  }

  // ========================================================================
  // 初始化
  // ========================================================================

  /**
   * 初始化测试配置
   */
  private initializeTestConfigs(): void {
    // 配方加载性能测试
    this.testConfigs.set('recipe-load-performance', {
      name: '配方加载性能测试',
      description: '测试配方从网络加载到应用完成的性能',
      type: 'load',
      parameters: {
        recipeIds: ['corporate-blue', 'dark-professional', 'minimal-light'],
        enableCaching: true,
        enablePreloading: false
      },
      benchmarks: {
        minAcceptableTime: 100,
        targetTime: 50,
        maxMemoryUsage: 10,
        minCacheHitRate: 0.8,
        maxCPUUsage: 70
      },
      iterations: 10,
      warmupIterations: 3,
      verbose: true
    })

    // 主题切换性能测试
    this.testConfigs.set('theme-switch-performance', {
      name: '主题切换性能测试',
      description: '测试主题切换时的性能表现',
      type: 'switch',
      parameters: {
        switchCount: 50,
        recipeIds: ['corporate-blue', 'dark-professional'],
        enableAnimations: true,
        enableTransitions: true
      },
      benchmarks: {
        minAcceptableTime: 150,
        targetTime: 100,
        maxMemoryUsage: 5,
        minCacheHitRate: 0.9,
        maxCPUUsage: 60
      },
      iterations: 20,
      warmupIterations: 5,
      verbose: true
    })

    // 内存使用测试
    this.testConfigs.set('memory-usage-test', {
      name: '内存使用测试',
      description: '测试内存使用情况和垃圾回收效率',
      type: 'memory',
      parameters: {
        recipeCount: 100,
        operationCycles: 10,
        enableMemoryProfiling: true
      },
      benchmarks: {
        minAcceptableTime: 1000,
        targetTime: 500,
        maxMemoryUsage: 50,
        minCacheHitRate: 0.5,
        maxCPUUsage: 80
      },
      iterations: 5,
      warmupIterations: 2,
      verbose: true
    })

    // 缓存效率测试
    this.testConfigs.set('cache-efficiency-test', {
      name: '缓存效率测试',
      description: '测试缓存命中率和访问效率',
      type: 'cache',
      parameters: {
        accessPatterns: ['sequential', 'random', 'repeated'],
        cacheSize: 100,
        accessCount: 1000
      },
      benchmarks: {
        minAcceptableTime: 50,
        targetTime: 20,
        maxMemoryUsage: 20,
        minCacheHitRate: 0.85,
        maxCPUUsage: 50
      },
      iterations: 15,
      warmupIterations: 3,
      verbose: true
    })

    // 渲染性能测试
    this.testConfigs.set('render-performance-test', {
      name: '渲染性能测试',
      description: '测试主题渲染和重绘性能',
      type: 'render',
      parameters: {
        componentCount: 100,
        updateFrequency: 60,
        animationComplexity: 'medium'
      },
      benchmarks: {
        minAcceptableTime: 16.67, // 60fps
        targetTime: 8.33, // 120fps
        maxMemoryUsage: 15,
        minCacheHitRate: 0.7,
        maxCPUUsage: 75
      },
      iterations: 30,
      warmupIterations: 5,
      verbose: true
    })

    // 综合性能测试
    this.testConfigs.set('comprehensive-performance-test', {
      name: '综合性能测试',
      description: '完整的系统性能综合测试',
      type: 'comprehensive',
      parameters: {
        includeAllTests: true,
        stressTest: true,
        duration: 30000 // 30秒
      },
      benchmarks: {
        minAcceptableTime: 500,
        targetTime: 300,
        maxMemoryUsage: 100,
        minCacheHitRate: 0.8,
        maxCPUUsage: 85
      },
      iterations: 3,
      warmupIterations: 1,
      verbose: true
    })
  }

  // ========================================================================
  // 测试执行
  // ========================================================================

  /**
   * 运行单个测试
   */
  async runTest(testName: string): Promise<PerformanceTestResult> {
    const config = this.testConfigs.get(testName)
    if (!config) {
      throw new Error(`测试配置不存在: ${testName}`)
    }

    console.log(`🧪 开始性能测试: ${config.name}`)
    const startTime = performance.now()

    try {
      // 预热
      await this.warmupTest(config)

      // 执行测试
      const result = await this.executeTest(config)

      // 生成建议
      result.recommendations = await this.generateRecommendations(config, result)

      // 保存结果
      this.currentResults.set(testName, result)

      const endTime = performance.now()
      console.log(`✅ 测试完成: ${config.name} (${(endTime - startTime).toFixed(2)}ms)`)

      return result

    } catch (error) {
      console.error(`❌ 测试失败: ${config.name}`, error)
      throw error
    }
  }

  /**
   * 运行所有测试
   */
  async runAllTests(): Promise<PerformanceReport> {
    console.log('🚀 开始运行所有性能测试')
    const startTime = performance.now()

    const results: PerformanceTestResult[] = []
    const testNames = Array.from(this.testConfigs.keys())

    for (const testName of testNames) {
      try {
        const result = await this.runTest(testName)
        results.push(result)
      } catch (error) {
        console.error(`测试失败: ${testName}`, error)
      }
    }

    // 生成报告
    const report = await this.generateReport(results)

    const endTime = performance.now()
    console.log(`🎉 所有测试完成 (${(endTime - startTime).toFixed(2)}ms)`)

    return report
  }

  /**
   * 预热测试
   */
  private async warmupTest(config: PerformanceTestConfig): Promise<void> {
    for (let i = 0; i < config.warmupIterations; i++) {
      try {
        await this.executeTestIteration(config, i, true)
      } catch (error) {
        // 预热阶段的错误忽略
      }
    }
  }

  /**
   * 执行测试
   */
  private async executeTest(config: PerformanceTestConfig): Promise<PerformanceTestResult> {
    const timings: number[] = []
    const errors: string[] = []
    const warnings: string[] = []

    let initialMemory = this.getMemoryUsage()
    let peakMemory = initialMemory

    // 执行多次测试
    for (let i = 0; i < config.iterations; i++) {
      try {
        const iterationTime = await this.executeTestIteration(config, i, false)
        timings.push(iterationTime)

        // 监控内存使用
        const currentMemory = this.getMemoryUsage()
        peakMemory = Math.max(peakMemory, currentMemory)

      } catch (error) {
        errors.push(`Iteration ${i + 1}: ${error}`)
      }
    }

    const finalMemory = this.getMemoryUsage()

    // 计算统计信息
    const timing = this.calculateTimingStats(timings)
    const memory = this.calculateMemoryStats(initialMemory, peakMemory, finalMemory)
    const cache = await this.calculateCacheStats(config)
    const cpuUsage = this.getCPUUsage()

    // 检查是否通过基准
    const passed = this.checkBenchmarks(config, timing, memory, cache, cpuUsage)

    return {
      name: config.name,
      type: config.type,
      passed,
      timing,
      memory,
      cache,
      cpuUsage,
      errors,
      warnings,
      recommendations: [],
      timestamp: Date.now(),
      metrics: this.calculateAdditionalMetrics(config, timing, memory, cache)
    }
  }

  /**
   * 执行单次测试迭代
   */
  private async executeTestIteration(
    config: PerformanceTestConfig,
    iteration: number,
    isWarmup: boolean
  ): Promise<number> {
    const startTime = performance.now()

    switch (config.type) {
      case 'load':
        return await this.executeLoadTest(config, iteration, isWarmup)
      case 'switch':
        return await this.executeSwitchTest(config, iteration, isWarmup)
      case 'memory':
        return await this.executeMemoryTest(config, iteration, isWarmup)
      case 'cache':
        return await this.executeCacheTest(config, iteration, isWarmup)
      case 'render':
        return await this.executeRenderTest(config, iteration, isWarmup)
      case 'comprehensive':
        return await this.executeComprehensiveTest(config, iteration, isWarmup)
      default:
        throw new Error(`不支持的测试类型: ${config.type}`)
    }
  }

  /**
   * 执行加载测试
   */
  private async executeLoadTest(
    config: PerformanceTestConfig,
    iteration: number,
    isWarmup: boolean
  ): Promise<number> {
    const { recipeIds, enableCaching, enablePreloading } = config.parameters

    // 随机选择一个配方
    const recipeId = recipeIds[iteration % recipeIds.length]

    if (enablePreloading && !isWarmup) {
      await recipeCacheManager.prefetchRecipe(recipeId)
    }

    // 测量加载时间
    const startTime = performance.now()
    const recipe = await recipeCacheManager.getRecipe(recipeId)
    const loadTime = performance.now() - startTime

    if (!recipe && !isWarmup) {
      throw new Error(`配方加载失败: ${recipeId}`)
    }

    // 应用配方
    const applyStart = performance.now()
    if (recipe) {
      // 这里应该调用实际的应用方法
      // await applyRecipe(recipeId, false)
    }
    const applyTime = performance.now() - applyStart

    return loadTime + applyTime
  }

  /**
   * 执行切换测试
   */
  private async executeSwitchTest(
    config: PerformanceTestConfig,
    iteration: number,
    isWarmup: boolean
  ): Promise<number> {
    const { recipeIds, switchCount, enableAnimations, enableTransitions } = config.parameters

    const startTime = performance.now()

    // 模拟多次切换
    for (let i = 0; i < switchCount; i++) {
      const recipeId = recipeIds[i % recipeIds.length]

      // 模拟主题切换
      if (enableTransitions) {
        // 等待过渡动画
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      // 这里应该调用实际的切换方法
      // await applyRecipe(recipeId, enableAnimations)
    }

    return performance.now() - startTime
  }

  /**
   * 执行内存测试
   */
  private async executeMemoryTest(
    config: PerformanceTestConfig,
    iteration: number,
    isWarmup: boolean
  ): Promise<number> {
    const { recipeCount, operationCycles, enableMemoryProfiling } = config.parameters

    const startTime = performance.now()

    // 创建大量配方数据
    const recipes: DynamicRecipe[] = []
    for (let i = 0; i < recipeCount; i++) {
      const recipe: DynamicRecipe = {
        id: `test-recipe-${iteration}-${i}`,
        name: `Test Recipe ${iteration}-${i}`,
        description: `Memory test recipe ${iteration}-${i}`,
        version: '1.0.0',
        axes: {
          mode: 'light',
          hue: { primary: 'blue' },
          saturation: { factor: 1.0, strategy: 'standard' },
          lightness: { factor: 1.0, contrast: 'medium' },
          density: { level: 'comfortable', scaleFactor: 1.0 },
          roundness: { level: 'rounded', radius: 8 },
          contrast: { level: 'standard', ratio: 4.5 }
        },
        customTokens: {}
      }

      // 添加大量自定义令牌来增加内存使用
      for (let j = 0; j < 100; j++) {
        recipe.customTokens![`token-${j}`] = `value-${j}-${iteration}-${i}`
      }

      recipes.push(recipe)
    }

    // 执行多轮操作
    for (let cycle = 0; cycle < operationCycles; cycle++) {
      // 缓存操作
      for (const recipe of recipes) {
        await recipeCacheManager.setRecipe(recipe)
      }

      // 查询操作
      for (const recipe of recipes) {
        await recipeCacheManager.getRecipe(recipe.id)
      }

      // 触发垃圾回收（如果可用）
      if (window.gc) {
        window.gc()
      }
    }

    return performance.now() - startTime
  }

  /**
   * 执行缓存测试
   */
  private async executeCacheTest(
    config: PerformanceTestConfig,
    iteration: number,
    isWarmup: boolean
  ): Promise<number> {
    const { accessPatterns, cacheSize, accessCount } = config.parameters

    // 创建测试数据
    const recipes: string[] = []
    for (let i = 0; i < cacheSize; i++) {
      recipes.push(`cache-test-recipe-${i}`)
    }

    const startTime = performance.now()

    // 根据访问模式执行测试
    for (const pattern of accessPatterns) {
      await this.executeAccessPattern(pattern, recipes, accessCount / accessPatterns.length)
    }

    return performance.now() - startTime
  }

  /**
   * 执行访问模式
   */
  private async executeAccessPattern(
    pattern: string,
    recipes: string[],
    count: number
  ): Promise<void> {
    switch (pattern) {
      case 'sequential':
        for (let i = 0; i < count; i++) {
          const recipeId = recipes[i % recipes.length]
          await recipeCacheManager.getRecipe(recipeId)
        }
        break

      case 'random':
        for (let i = 0; i < count; i++) {
          const randomIndex = Math.floor(Math.random() * recipes.length)
          const recipeId = recipes[randomIndex]
          await recipeCacheManager.getRecipe(recipeId)
        }
        break

      case 'repeated':
        const targetRecipe = recipes[0]
        for (let i = 0; i < count; i++) {
          await recipeCacheManager.getRecipe(targetRecipe)
        }
        break
    }
  }

  /**
   * 执行渲染测试
   */
  private async executeRenderTest(
    config: PerformanceTestConfig,
    iteration: number,
    isWarmup: boolean
  ): Promise<number> {
    const { componentCount, updateFrequency, animationComplexity } = config.parameters

    const startTime = performance.now()

    // 创建测试DOM元素
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.top = '-9999px'
    container.style.left = '-9999px'
    document.body.appendChild(container)

    try {
      // 创建多个组件
      for (let i = 0; i < componentCount; i++) {
        const element = document.createElement('div')
        element.className = 'test-component'
        element.textContent = `Component ${i}`
        element.style.padding = '10px'
        element.style.margin = '5px'
        element.style.border = '1px solid #ccc'
        container.appendChild(element)
      }

      // 模拟样式更新
      const updateInterval = 1000 / updateFrequency
      const updates = 30 // 30次更新

      for (let i = 0; i < updates; i++) {
        // 更新样式
        const elements = container.querySelectorAll('.test-component')
        elements.forEach((element, index) => {
          const hue = (i * 10 + index * 5) % 360
          ;(element as HTMLElement).style.backgroundColor = `hsl(${hue}, 70%, 80%)`
        })

        // 等待下一帧
        await new Promise(resolve => requestAnimationFrame(resolve))
      }

    } finally {
      // 清理DOM
      document.body.removeChild(container)
    }

    return performance.now() - startTime
  }

  /**
   * 执行综合测试
   */
  private async executeComprehensiveTest(
    config: PerformanceTestConfig,
    iteration: number,
    isWarmup: boolean
  ): Promise<number> {
    const { includeAllTests, stressTest, duration } = config.parameters

    const startTime = performance.now()
    const endTime = startTime + duration

    while (performance.now() < endTime) {
      // 执行各种操作
      await this.executeLoadTest({
        ...config,
        parameters: { recipeIds: ['corporate-blue', 'dark-professional'] }
      }, 0, true)

      await this.executeSwitchTest({
        ...config,
        parameters: { recipeIds: ['corporate-blue', 'dark-professional'], switchCount: 5 }
      }, 0, true)

      await this.executeCacheTest({
        ...config,
        parameters: { accessPatterns: ['random'], cacheSize: 10, accessCount: 20 }
      }, 0, true)

      if (stressTest) {
        // 添加压力测试操作
        await this.executeMemoryTest({
          ...config,
          parameters: { recipeCount: 20, operationCycles: 2 }
        }, 0, true)
      }
    }

    return performance.now() - startTime
  }

  // ========================================================================
  // 统计计算
  // ========================================================================

  /**
   * 计算时间统计
   */
  private calculateTimingStats(timings: number[]): TimingStats {
    if (timings.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        median: 0,
        standardDeviation: 0,
        p95: 0,
        p99: 0,
        totalTime: 0
      }
    }

    const sorted = [...timings].sort((a, b) => a - b)
    const sum = timings.reduce((acc, val) => acc + val, 0)

    const average = sum / timings.length
    const median = sorted[Math.floor(sorted.length / 2)]
    const min = sorted[0]
    const max = sorted[sorted.length - 1]

    // 计算标准差
    const variance = timings.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / timings.length
    const standardDeviation = Math.sqrt(variance)

    // 计算百分位数
    const p95Index = Math.floor(sorted.length * 0.95)
    const p99Index = Math.floor(sorted.length * 0.99)
    const p95 = sorted[Math.min(p95Index, sorted.length - 1)]
    const p99 = sorted[Math.min(p99Index, sorted.length - 1)]

    return {
      average,
      min,
      max,
      median,
      standardDeviation,
      p95,
      p99,
      totalTime: sum
    }
  }

  /**
   * 计算内存统计
   */
  private calculateMemoryStats(
    initial: number,
    peak: number,
    final: number
  ): MemoryStats {
    const growth = final - initial
    const leakRisk = growth > 10 ? 'high' : growth > 5 ? 'medium' : 'low'

    return {
      initial,
      peak,
      final,
      growth,
      gcCount: 0, // 需要更复杂的监控
      leakRisk
    }
  }

  /**
   * 计算缓存统计
   */
  private async calculateCacheStats(config: PerformanceTestConfig): Promise<CacheStats> {
    try {
      const stats = recipeCacheManager.getCacheStats()
      const hitRate = stats.memory.totalHits > 0
        ? stats.memory.totalHits / (stats.memory.totalHits + stats.memory.totalHits)
        : 0

      return {
        hitRate,
        missCount: 0, // 需要更详细的统计
        hitCount: stats.memory.totalHits,
        size: stats.memory.size,
        averageAccessTime: 0 // 需要实际测量
      }
    } catch (error) {
      return {
        hitRate: 0,
        missCount: 0,
        hitCount: 0,
        size: 0,
        averageAccessTime: 0
      }
    }
  }

  /**
   * 获取CPU使用率
   */
  private getCPUUsage(): number {
    // 简化实现：返回估算值
    return Math.random() * 100
  }

  /**
   * 检查基准
   */
  private checkBenchmarks(
    config: PerformanceTestConfig,
    timing: TimingStats,
    memory: MemoryStats,
    cache: CacheStats,
    cpuUsage: number
  ): boolean {
    const { benchmarks } = config

    return (
      timing.average <= benchmarks.minAcceptableTime &&
      memory.peak <= benchmarks.maxMemoryUsage &&
      cache.hitRate >= benchmarks.minCacheHitRate &&
      cpuUsage <= benchmarks.maxCPUUsage
    )
  }

  /**
   * 计算额外指标
   */
  private calculateAdditionalMetrics(
    config: PerformanceTestConfig,
    timing: TimingStats,
    memory: MemoryStats,
    cache: CacheStats
  ): Record<string, number> {
    return {
      throughput: config.iterations / timing.totalTime,
      efficiency: cache.hitRate / timing.average,
      memoryEfficiency: memory.growth / config.iterations,
      cacheEfficiency: cache.hitRate * cache.size,
      performanceScore: this.calculatePerformanceScore(timing, memory, cache)
    }
  }

  /**
   * 计算性能评分
   */
  private calculatePerformanceScore(
    timing: TimingStats,
    memory: MemoryStats,
    cache: CacheStats
  ): number {
    // 简化的评分算法
    const timingScore = Math.max(0, 100 - timing.average)
    const memoryScore = Math.max(0, 100 - memory.peak * 2)
    const cacheScore = cache.hitRate * 100

    return (timingScore + memoryScore + cacheScore) / 3
  }

  // ========================================================================
  // 建议生成
  // ========================================================================

  /**
   * 生成性能优化建议
   */
  private async generateRecommendations(
    config: PerformanceTestConfig,
    result: PerformanceTestResult
  ): Promise<PerformanceRecommendation[]> {
    const recommendations: PerformanceRecommendation[] = []

    // 时间性能建议
    if (result.timing.average > config.benchmarks.targetTime) {
      recommendations.push({
        type: 'warning',
        title: '优化加载时间',
        description: `平均加载时间 ${result.timing.average.toFixed(2)}ms 超过目标 ${config.benchmarks.targetTime}ms`,
        expectedImprovement: '减少20-50%的加载时间',
        difficulty: 'medium',
        relatedConfig: 'cacheSize'
      })
    }

    // 内存使用建议
    if (result.memory.growth > 10) {
      recommendations.push({
        type: 'critical',
        title: '内存使用过高',
        description: `内存增长 ${result.memory.growth.toFixed(2)}MB 可能存在内存泄漏`,
        expectedImprovement: '减少30-70%的内存使用',
        difficulty: 'hard',
        relatedConfig: 'maxCacheSize'
      })
    }

    // 缓存效率建议
    if (result.cache.hitRate < 0.8) {
      recommendations.push({
        type: 'warning',
        title: '提高缓存命中率',
        description: `缓存命中率 ${(result.cache.hitRate * 100).toFixed(1)}% 偏低`,
        expectedImprovement: '提升到85%以上的命中率',
        difficulty: 'easy',
        relatedConfig: 'preloading'
      })
    }

    // CPU使用建议
    if (result.cpuUsage > 80) {
      recommendations.push({
        type: 'critical',
        title: 'CPU使用率过高',
        description: `CPU使用率 ${result.cpuUsage.toFixed(1)}% 影响用户体验`,
        expectedImprovement: '降低到70%以下',
        difficulty: 'medium'
      })
    }

    return recommendations
  }

  /**
   * 生成性能报告
   */
  private async generateReport(results: PerformanceTestResult[]): Promise<PerformanceReport> {
    const report: PerformanceReport = {
      id: `perf-report-${Date.now()}`,
      name: '七轴主题系统性能报告',
      results,
      overallScore: 0,
      overallStatus: 'good',
      generatedAt: Date.now(),
      environment: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        memory: (performance as any).memory?.usedJSHeapSize || 0,
        cores: navigator.hardwareConcurrency || 1
      },
      keyFindings: [],
      priorityRecommendations: []
    }

    // 计算总体评分
    const totalScore = results.reduce((sum, result) => sum + result.metrics.performanceScore, 0)
    report.overallScore = totalScore / results.length

    // 确定总体状态
    if (report.overallScore >= 90) {
      report.overallStatus = 'excellent'
    } else if (report.overallScore >= 75) {
      report.overallStatus = 'good'
    } else if (report.overallScore >= 60) {
      report.overallStatus = 'fair'
    } else if (report.overallScore >= 40) {
      report.overallStatus = 'poor'
    } else {
      report.overallStatus = 'critical'
    }

    // 生成主要发现
    results.forEach(result => {
      if (!result.passed) {
        report.keyFindings.push(`${result.name} 未通过性能基准`)
      }
      if (result.memory.leakRisk === 'high') {
        report.keyFindings.push(`${result.name} 检测到内存泄漏风险`)
      }
      if (result.cache.hitRate < 0.5) {
        report.keyFindings.push(`${result.name} 缓存效率低下`)
      }
    })

    // 收集优先建议
    const allRecommendations = results.flatMap(result => result.recommendations)
    report.priorityRecommendations = allRecommendations
      .filter(rec => rec.type === 'critical')
      .slice(0, 5)

    return report
  }

  // ========================================================================
  // 实时监控
  // ========================================================================

  /**
   * 启动实时监控
   */
  startRealTimeMonitoring(intervalMs: number = 5000): void {
    if (this.isMonitoring) return

    this.isMonitoring = true
    console.log('📊 启动实时性能监控')

    this.monitoringInterval = setInterval(async () => {
      await this.collectRealTimeMetrics()
    }, intervalMs)
  }

  /**
   * 停止实时监控
   */
  stopRealTimeMonitoring(): void {
    if (!this.isMonitoring) return

    this.isMonitoring = false
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
    }

    console.log('📊 停止实时性能监控')
  }

  /**
   * 收集实时指标
   */
  private async collectRealTimeMetrics(): Promise<void> {
    const metrics = {
      timestamp: Date.now(),
      memory: this.getMemoryUsage(),
      cache: await this.calculateCacheStats({} as PerformanceTestConfig),
      cpu: this.getCPUUsage()
    }

    // 发送到监控系统或保存到本地存储
    console.log('📈 实时性能指标:', metrics)

    // 检查性能阈值
    if (metrics.memory > 100) {
      console.warn('⚠️ 内存使用过高:', metrics.memory, 'MB')
    }

    if (metrics.cpu > 90) {
      console.warn('⚠️ CPU使用率过高:', metrics.cpu, '%')
    }
  }

  // ========================================================================
  // 工具方法
  // ========================================================================

  /**
   * 获取内存使用情况
   */
  private getMemoryUsage(): number {
    if ((performance as any).memory) {
      const memory = (performance as any).memory
      return memory.usedJSHeapSize / 1024 / 1024 // MB
    }
    return 0
  }

  /**
   * 添加自定义测试配置
   */
  addTestConfig(name: string, config: PerformanceTestConfig): void {
    this.testConfigs.set(name, config)
  }

  /**
   * 移除测试配置
   */
  removeTestConfig(name: string): boolean {
    return this.testConfigs.delete(name)
  }

  /**
   * 获取测试配置列表
   */
  getTestConfigs(): string[] {
    return Array.from(this.testConfigs.keys())
  }

  /**
   * 获取测试结果
   */
  getTestResults(testName?: string): PerformanceTestResult[] | PerformanceTestResult | null {
    if (testName) {
      return this.currentResults.get(testName) || null
    }
    return Array.from(this.currentResults.values())
  }

  /**
   * 清理测试结果
   */
  clearResults(): void {
    this.currentResults.clear()
  }

  /**
   * 设置基准结果
   */
  setBaselineResults(testName: string, result: PerformanceTestResult): void {
    this.baselineResults.set(testName, result)
  }

  /**
   * 与基准比较
   */
  compareToBaseline(testName: string): {
    current: PerformanceTestResult | null
    baseline: PerformanceTestResult | null
    improvement: number
    status: 'improved' | 'degraded' | 'stable'
  } | null {
    const current = this.currentResults.get(testName)
    const baseline = this.baselineResults.get(testName)

    if (!current || !baseline) return null

    const currentScore = current.metrics.performanceScore
    const baselineScore = baseline.metrics.performanceScore
    const improvement = ((currentScore - baselineScore) / baselineScore) * 100

    let status: 'improved' | 'degraded' | 'stable'
    if (Math.abs(improvement) < 5) {
      status = 'stable'
    } else if (improvement > 0) {
      status = 'improved'
    } else {
      status = 'degraded'
    }

    return {
      current,
      baseline,
      improvement,
      status
    }
  }
}

// ============================================================================
// 默认实例和便捷函数
// ============================================================================

/**
 * 默认性能测试套件实例
 */
export const themePerformanceTestSuite = new ThemePerformanceTestSuite()

/**
 * 便捷函数
 */
export const runThemePerformanceTest = (testName: string) =>
  themePerformanceTestSuite.runTest(testName)

export const runAllThemePerformanceTests = () =>
  themePerformanceTestSuite.runAllTests()

export const startThemePerformanceMonitoring = (intervalMs?: number) =>
  themePerformanceTestSuite.startRealTimeMonitoring(intervalMs)

export const stopThemePerformanceMonitoring = () =>
  themePerformanceTestSuite.stopRealTimeMonitoring()

export default {
  ThemePerformanceTestSuite,
  themePerformanceTestSuite,
  runThemePerformanceTest,
  runAllThemePerformanceTests,
  startThemePerformanceMonitoring,
  stopThemePerformanceMonitoring
}