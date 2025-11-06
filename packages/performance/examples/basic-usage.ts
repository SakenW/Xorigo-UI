/**
 * @xorigo-ui/performance 使用示例
 *
 * 演示如何在实际项目中使用性能优化工具包
 */

import {
  PerformanceMonitor,
  BottleneckDetector,
  PerformanceOptimizer,
  BundleAnalyzer,
  startQuickMonitoring,
  quickBottleneckDetection,
  quickBundleAnalysis
} from '../src/index'

// ==================== 示例 1: 基础性能监控 ====================

export async function example1BasicMonitoring() {
  console.log('=== 示例 1: 基础性能监控 ===\n')

  // 方式 1: 使用便捷函数
  const monitor = startQuickMonitoring({
    enableRealTimeMonitoring: true,
    enableMemoryTracking: true,
    thresholds: {
      maxRenderTime: 16,
      maxMemoryUsage: 70,
      maxRenderCount: 1000
    }
  })

  // 开始组件跟踪
  monitor.startComponentTracking('UserProfile', 'profile-1')
  monitor.startComponentTracking('ProductList', 'list-1')

  // 模拟一些组件渲染
  setTimeout(() => {
    monitor.recordRender('UserProfile', 'profile-1', 12.5, 'props_change')
    monitor.recordPropsChange('UserProfile', 'profile-1')
  }, 100)

  setTimeout(() => {
    monitor.recordRender('ProductList', 'list-1', 18.3, 'state_change')
    monitor.recordStateChange('ProductList', 'list-1')
  }, 200)

  // 等待一段时间后获取报告
  setTimeout(() => {
    console.log('性能报告:')
    console.log(monitor.generateReport())
    monitor.stop()
  }, 1000)
}

// ==================== 示例 2: 瓶颈检测 ====================

export async function example2BottleneckDetection() {
  console.log('\n=== 示例 2: 性能瓶颈检测 ===\n')

  // 创建检测器
  const detector = new BottleneckDetector({
    renderThreshold: 100,
    renderTimeThreshold: 16,
    memoryThreshold: 70,
    scanInterval: 5000
  })

  // 启动自动检测
  detector.start()

  // 模拟性能数据
  const componentName = 'HeavyComponent'
  const instanceId = 'instance-1'

  // 记录大量重渲染
  for (let i = 0; i < 150; i++) {
    detector.recordRender(componentName, instanceId, 20 + Math.random() * 10, 'props_change')
  }

  // 记录内存数据
  detector.recordMemorySnapshot(75) // 75MB

  // 执行检测
  const result = detector.detectAllBottlenecks()

  console.log('瓶颈检测结果:')
  console.log(`- 总瓶颈数: ${result.summary.totalBottlenecks}`)
  console.log(`- 严重问题: ${result.summary.criticalIssues}`)
  console.log(`- 性能分数: ${result.overallScore}/100`)
  console.log('\n建议:')
  result.recommendations.forEach(rec => console.log(`  • ${rec}`))

  detector.stop()
}

// ==================== 示例 3: 自动优化 ====================

export async function example3AutoOptimization() {
  console.log('\n=== 示例 3: 自动性能优化 ===\n')

  // 创建优化器 (安全模式)
  const optimizer = new PerformanceOptimizer({
    safetyMode: true,
    optimizationLevel: 'balanced',
    enableMemoization: true,
    enableLazyLoading: true
  })

  // 模拟瓶颈数据
  const bottlenecks = [
    {
      id: 'bottleneck-1',
      type: 're-render' as const,
      severity: 'serious' as const,
      title: '组件重渲染过多',
      description: '组件渲染了150次，其中50次是不必要的',
      location: 'HeavyComponent',
      component: 'HeavyComponent',
      metric: {
        name: 'component.re-render',
        value: 50,
        unit: 'count' as const,
        timestamp: Date.now()
      },
      impact: {
        performance: 75,
        userExperience: 60,
        resourceUsage: 50
      },
      timestamp: Date.now()
    }
  ]

  const reRenderAnalysis = [
    {
      componentName: 'HeavyComponent',
      instanceId: 'instance-1',
      renderCount: 150,
      unnecessaryRenders: 50,
      renderReasons: [
        { reason: 'props_change', count: 80, percentage: 53.33 },
        { reason: 'state_change', count: 70, percentage: 46.67 }
      ],
      wastefulRenders: [],
      suggestions: ['使用 React.memo 优化组件'],
      canBeOptimized: true,
      optimizationPotential: 75
    }
  ]

  const memoryAnalysis = []
  const functionAnalysis = []

  // 生成优化策略
  const strategies = optimizer.generateOptimizations(
    bottlenecks,
    reRenderAnalysis,
    memoryAnalysis,
    functionAnalysis
  )

  console.log(`生成了 ${strategies.length} 个优化策略:\n`)

  strategies.forEach((strategy, index) => {
    console.log(`策略 ${index + 1}: ${strategy.name}`)
    console.log(`  描述: ${strategy.description}`)
    console.log(`  优先级: ${strategy.priority}`)
    console.log(`  预期影响: 性能提升 ${strategy.estimatedImpact.performance}%, 减少 ${strategy.estimatedImpact.bundleSize}KB`)
    console.log(`  类别: ${strategy.category}`)
    console.log('')
  })

  // 应用优化 (在安全模式下不会实际修改代码)
  const optimizationResult = await optimizer.applyOptimizations(strategies)

  console.log('优化结果:')
  console.log(`- 已应用: ${optimizationResult.appliedOptimizations.length}`)
  console.log(`- 已跳过: ${optimizationResult.skippedOptimizations.length}`)
  console.log(`- 失败: ${optimizationResult.failedOptimizations.length}`)

  if (optimizationResult.recommendations.length > 0) {
    console.log('\n优化建议:')
    optimizationResult.recommendations.forEach(rec => console.log(`  • ${rec}`))
  }
}

// ==================== 示例 4: Bundle分析 ====================

export async function example4BundleAnalysis() {
  console.log('\n=== 示例 4: Bundle 大小分析 ===\n')

  // 创建分析器
  const analyzer = new BundleAnalyzer({
    analyzeDependencies: true,
    analyzeTreeShaking: true,
    checkDuplicates: true,
    sizeTargets: {
      totalSize: 500 * 1024,    // 500KB
      gzippedSize: 200 * 1024,  // 200KB
      chunkSize: 244 * 1024     // 244KB
    },
    outputFormat: 'markdown'
  })

  // 模拟分析结果 (实际使用时需要真实的bundle文件)
  console.log('注意: 这是一个模拟分析，实际使用需要提供真实的bundle文件路径\n')

  console.log('Bundle分析报告:')
  console.log('- 总大小: 520 KB')
  console.log('- Gzip压缩后: 210 KB')
  console.log('- 压缩比例: 59.62%')
  console.log('- 模块数量: 245')
  console.log('- 未使用模块: 23 个')
  console.log('- 重复模块: 5 个')

  console.log('\nTree Shaking 分析:')
  console.log('- 使用率: 72.5%')
  console.log('- 已使用导出: 890')
  console.log('- 未使用导出: 340')
  console.log('- 估计节省空间: 156 KB')

  console.log('\n重型依赖:')
  console.log('- lodash: 1.2 MB (2.5%)')
  console.log('- moment: 950 KB (2.0%)')
  console.log('- axios: 420 KB (0.9%)')

  console.log('\n优化建议:')
  console.log('  1. 移除未使用的代码 (高优先级)')
  console.log('     - 影响: 减少 156KB, 性能提升 15%')
  console.log('     - 实现: 确保只导入需要的部分')
  console.log('')
  console.log('  2. 实现代码分割 (中等优先级)')
  console.log('     - 影响: 减少 180KB, 性能提升 40%')
  console.log('     - 实现: 使用动态导入()和React.lazy')
  console.log('')
  console.log('  3. 替换重型依赖 (低优先级)')
  console.log('     - 影响: 减少 220KB, 性能提升 20%')
  console.log('     - 实现: 用 lodash-es 替换 lodash')

  // 生成完整报告
  const report = analyzer.generateReport()
  console.log('\n完整报告已生成 (使用 analyzer.generateReport() 获取)')

  // 导出优化脚本
  const script = analyzer.generateOptimizationScript()
  console.log('\n优化脚本已生成 (使用 analyzer.generateOptimizationScript() 获取)')
}

// ==================== 示例 5: 集成到 React 组件 ====================

export function example5ReactIntegration() {
  console.log('\n=== 示例 5: React 组件集成 ===\n')

  console.log(`
示例: 在 React 组件中使用性能监控

import { useEffect, useState } from 'react'
import { PerformanceMonitor } from '@xorigo-ui/performance'

function MyComponent() {
  const [metrics, setMetrics] = useState(null)
  const monitor = new PerformanceMonitor()

  useEffect(() => {
    const instanceId = \`comp-\${Date.now()}\`
    monitor.start()
    monitor.startComponentTracking('MyComponent', instanceId)

    return () => {
      monitor.stopComponentTracking('MyComponent', instanceId)
    }
  }, [])

  // 记录渲染
  monitor.recordRender('MyComponent', 'instance-1', 12.5, 'props_change')

  return <div>组件内容</div>
}

// 使用高阶组件优化性能
import { withPerformanceOptimization } from '@xorigo-ui/performance'

const OptimizedComponent = withPerformanceOptimization(MyComponent, {
  enableMemoization: true,
  enableBatching: true
})
  `)
}

// ==================== 示例 6: 完整性能优化流程 ====================

export async function example6CompleteWorkflow() {
  console.log('\n=== 示例 6: 完整性能优化流程 ===\n')

  // 1. 启动性能监控
  console.log('步骤 1: 启动性能监控')
  const monitor = startQuickMonitoring()
  monitor.start()

  // 2. 启动瓶颈检测
  console.log('步骤 2: 启动性能瓶颈检测')
  const detector = quickBottleneckDetection({
    scanInterval: 10000
  })
  detector.start()

  // 3. 模拟应用运行
  console.log('步骤 3: 模拟应用运行...\n')
  await new Promise(resolve => setTimeout(resolve, 2000))

  // 4. 执行瓶颈检测
  console.log('\n步骤 4: 执行性能瓶颈检测')
  const detectionResult = detector.detectAllBottlenecks()
  console.log(`检测到 ${detectionResult.summary.totalBottlenecks} 个性能瓶颈`)

  // 5. 生成优化策略
  console.log('\n步骤 5: 生成优化策略')
  const optimizer = new PerformanceOptimizer()
  const strategies = optimizer.generateOptimizations(
    detectionResult.bottlenecks,
    detectionResult.reRenderAnalysis,
    detectionResult.memoryLeakAnalysis,
    detectionResult.functionAnalysis
  )
  console.log(`生成了 ${strategies.length} 个优化策略`)

  // 6. 应用优化
  console.log('\n步骤 6: 应用优化策略')
  const optimizationResult = await optimizer.applyOptimizations(strategies)
  console.log(`应用了 ${optimizationResult.appliedOptimizations.length} 个优化`)

  // 7. 生成报告
  console.log('\n步骤 7: 生成优化报告')
  console.log(optimizer.generateOptimizationReport())

  // 清理
  monitor.stop()
  detector.stop()
  optimizer.dispose()
}

// ==================== 主函数 ====================

export async function runAllExamples() {
  console.log('╔════════════════════════════════════════════════╗')
  console.log('║   Xorigo UI 性能优化工具包使用示例              ║')
  console.log('╚════════════════════════════════════════════════╝\n')

  try {
    await example1BasicMonitoring()
    await example2BottleneckDetection()
    await example3AutoOptimization()
    await example4BundleAnalysis()
    example5ReactIntegration()
    await example6CompleteWorkflow()

    console.log('\n✅ 所有示例执行完成!')
  } catch (error) {
    console.error('\n❌ 示例执行出错:', error)
  }
}

// 如果直接运行此文件
if (require.main === module) {
  runAllExamples()
}
