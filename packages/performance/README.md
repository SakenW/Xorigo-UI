# @xorigo-ui/performance

Xorigo UI 性能优化工具包 - 提供全面的组件性能监控、瓶颈检测、自动优化和Bundle分析功能。

## 功能特性

### 🚀 性能监控器 (PerformanceMonitor)
- **实时性能监控**: 监控组件渲染时间、内存使用、重渲染次数
- **组件级追踪**: 跟踪每个组件的渲染指标和生命周期
- **内存监控**: 检测内存使用趋势、增长率和潜在泄漏
- **性能指标**: 计算优化分数并生成改进建议

### 🔍 瓶颈检测器 (BottleneckDetector)
- **重渲染检测**: 自动识别不必要的组件重渲染
- **内存泄漏检测**: 检测事件监听器、定时器、DOM节点泄漏
- **函数性能分析**: 分析函数执行时间并识别性能瓶颈
- **智能建议**: 生成可操作的优化建议

### ⚡ 自动优化器 (PerformanceOptimizer)
- **React.memo 自动包装**: 为频繁重渲染的组件添加记忆化
- **useCallback/useMemo 建议**: 智能推荐需要优化的回调函数
- **懒加载实现**: 自动生成组件懒加载代码
- **代码分割建议**: 提供Bundle代码分割策略
- **Bundle 优化**: 分析并优化依赖关系

### 📦 Bundle 分析器 (BundleAnalyzer)
- **Bundle 大小分析**: 计算gzip压缩后的大小
- **依赖关系分析**: 识别重型依赖和重复依赖
- **Tree Shaking 效果**: 分析未使用的代码
- **优化建议**: 生成具体的优化实施方案
- **大小目标检查**: 对比性能目标提供改进建议

## 安装

```bash
pnpm add @xorigo-ui/performance
# 或
npm install @xorigo-ui/performance
# 或
yarn add @xorigo-ui/performance
```

## 快速开始

### 1. 性能监控

```typescript
import { PerformanceMonitor, startQuickMonitoring } from '@xorigo-ui/performance'

// 方法1: 使用便捷函数
const monitor = startQuickMonitoring({
  enableRealTimeMonitoring: true,
  enableMemoryTracking: true
})

// 方法2: 使用类
import { PerformanceMonitor } from '@xorigo-ui/performance'

const monitor = new PerformanceMonitor({
  enableRealTimeMonitoring: true,
  enableMemoryTracking: true,
  thresholds: {
    maxRenderTime: 16,
    maxMemoryUsage: 70
  }
})

monitor.start()

// 记录组件渲染
monitor.recordRender('MyComponent', 'instance-1', 12.5, 'props_change')
monitor.recordPropsChange('MyComponent', 'instance-1')

// 获取报告
console.log(monitor.generateReport())
```

### 2. 性能瓶颈检测

```typescript
import { BottleneckDetector } from '@xorigo-ui/performance'

const detector = new BottleneckDetector({
  renderThreshold: 100,
  renderTimeThreshold: 16,
  memoryThreshold: 70
})

detector.start()

// 记录组件数据
detector.recordRender('MyComponent', 'instance-1', 25.3, 'state_change')
detector.recordMemorySnapshot(75) // MB

// 执行检测
const result = detector.detectAllBottlenecks()

console.log(result.summary)
console.log(result.recommendations)

// 订阅检测结果
detector.subscribe((result) => {
  console.log('新的瓶颈检测结果:', result)
})
```

### 3. 自动优化

```typescript
import { PerformanceOptimizer } from '@xorigo-ui/performance'

const optimizer = new PerformanceOptimizer({
  enableAutoOptimization: true,
  safetyMode: false, // 设为 true 只会生成建议
  optimizationLevel: 'balanced'
})

// 生成优化策略
const strategies = optimizer.generateOptimizations(
  result.bottlenecks,
  result.reRenderAnalysis,
  result.memoryLeakAnalysis,
  result.functionAnalysis
)

// 应用优化
const optimizationResult = await optimizer.applyOptimizations(strategies)

console.log('优化结果:', optimizationResult)
console.log('节省时间:', optimizationResult.totalImpact.estimatedTimeSaved)

// 生成优化报告
console.log(optimizer.generateOptimizationReport())
```

### 4. Bundle 分析

```typescript
import { BundleAnalyzer } from '@xorigo-ui/performance'

const analyzer = new BundleAnalyzer({
  analyzeDependencies: true,
  analyzeTreeShaking: true,
  sizeTargets: {
    totalSize: 500 * 1024, // 500KB
    gzippedSize: 200 * 1024, // 200KB
    chunkSize: 244 * 1024 // 244KB
  }
})

// 分析Bundle文件
const bundleStats = await analyzer.analyzeBundle('./dist/bundle.js')

console.log('Bundle大小:', bundleStats.totalSize)
console.log('Gzip大小:', bundleStats.totalGzippedSize)

// 生成报告
const report = analyzer.generateReport()
console.log(report)

// 导出JSON格式
const jsonData = analyzer.exportAsJSON()
```

## API 参考

### PerformanceMonitor

#### 配置选项

```typescript
interface MonitoringConfig {
  enableRealTimeMonitoring: boolean // 是否启用实时监控
  enableMemoryTracking: boolean // 是否启用内存跟踪
  enableComponentTracking: boolean // 是否启用组件跟踪
  sampleRate: number // 采样率 (1 = 100%)
  bufferSize: number // 缓冲区大小
  thresholds: PerformanceThresholds // 性能阈值
  trackMemoryLeaks: boolean // 是否跟踪内存泄漏
  enableProfiling: boolean // 是否启用性能分析
}
```

#### 主要方法

- `start()`: 开始监控
- `stop()`: 停止监控
- `recordRender(componentName, instanceId, renderTime, reason?)`: 记录组件渲染
- `getComponentMetrics(componentName?, instanceId?)`: 获取组件指标
- `generateReport()`: 生成性能报告
- `subscribe(callback)`: 订阅性能指标更新

### BottleneckDetector

#### 配置选项

```typescript
interface DetectionConfig {
  scanInterval: number // 检测间隔 (ms)
  enableReRenderDetection: boolean // 是否启用重渲染检测
  renderThreshold: number // 渲染次数阈值
  renderTimeThreshold: number // 渲染时间阈值 (ms)
  memoryThreshold: number // 内存阈值 (MB)
  enableAutoFix: boolean // 是否启用自动修复
}
```

#### 主要方法

- `start()`: 开始自动检测
- `detectAllBottlenecks()`: 执行全面检测
- `getBottlenecks(filter?)`: 获取瓶颈列表
- `subscribe(callback)`: 订阅检测结果

### PerformanceOptimizer

#### 配置选项

```typescript
interface OptimizationConfig {
  enableAutoOptimization: boolean // 是否启用自动优化
  enableMemoization: boolean // 是否启用记忆化优化
  enableLazyLoading: boolean // 是否启用懒加载
  safetyMode: boolean // 安全模式（只生成建议）
  optimizationLevel: 'minimal' | 'balanced' | 'aggressive' // 优化级别
}
```

#### 主要方法

- `generateOptimizations(...)`: 生成优化策略
- `applyOptimizations(strategies)`: 应用优化策略
- `generateOptimizationReport()`: 生成优化报告
- `exportOptimizationConfig()`: 导出优化配置

### BundleAnalyzer

#### 配置选项

```typescript
interface AnalysisConfig {
  analyzeDependencies: boolean // 是否分析依赖
  analyzeTreeShaking: boolean // 是否分析Tree Shaking
  checkDuplicates: boolean // 检查重复依赖
  sizeTargets: BundleSizeTargets // 大小目标
  outputFormat: 'json' | 'html' | 'markdown' // 输出格式
}
```

#### 主要方法

- `analyzeBundle(bundlePath)`: 分析Bundle文件
- `analyzeDependencies(packageJsonPath?)`: 分析依赖
- `generateOptimizationSuggestions()`: 生成优化建议
- `generateReport()`: 生成分析报告
- `exportAsJSON()`: 导出JSON格式数据

## 性能目标

本工具旨在帮助实现以下性能目标：

- **Bundle大小**: < 500KB (gzipped: < 200KB)
- **组件扫描时间**: < 5秒
- **缓存命中率**: > 95%
- **内存占用**: < 70MB
- **渲染时间**: < 16ms (一帧时间)
- **首次内容绘制 (FCP)**: < 1.8s
- **最大内容绘制 (LCP)**: < 2.5s
- **首次输入延迟 (FID)**: < 100ms

## 使用示例

### 集成到 React 组件

```typescript
import React, { useEffect } from 'react'
import { PerformanceMonitor } from '@xorigo-ui/performance'

function MyComponent() {
  const monitor = new PerformanceMonitor()
  const instanceId = `comp-${Date.now()}`

  useEffect(() => {
    monitor.start()
    monitor.startComponentTracking('MyComponent', instanceId)

    return () => {
      monitor.stopComponentTracking('MyComponent', instanceId)
    }
  }, [])

  return (
    <div>
      {/* 组件内容 */}
    </div>
  )
}
```

### 性能监控仪表板

```typescript
import { useState, useEffect } from 'react'
import { PerformanceMonitor } from '@xorigo-ui/performance'

function PerformanceDashboard() {
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    const monitor = new PerformanceMonitor({
      enableRealTimeMonitoring: true
    })

    monitor.start()

    const interval = setInterval(() => {
      const snapshots = monitor.getMemorySnapshots()
      const currentMemory = snapshots[snapshots.length - 1]
      setMetrics(currentMemory)
    }, 5000)

    return () => {
      clearInterval(interval)
      monitor.dispose()
    }
  }, [])

  return (
    <div>
      <h2>性能监控</h2>
      {metrics && (
        <div>
          <p>内存使用: {metrics.currentUsage.toFixed(2)} MB</p>
          <p>内存趋势: {metrics.trend}</p>
          <p>增长率: {metrics.growthRate.toFixed(2)} MB/min</p>
        </div>
      )}
    </div>
  )
}
```

## 最佳实践

### 1. 开发阶段
- 在开发阶段启用性能监控，跟踪组件性能
- 使用瓶颈检测器定期检查性能问题
- 及时应用优化建议，避免性能债务累积

### 2. 生产环境
- 仅启用必要的监控功能，避免性能开销
- 定期分析Bundle大小，优化加载性能
- 使用懒加载和代码分割减少初始加载时间

### 3. 性能优化
- 优先优化高影响、低成本的优化项
- 使用React.memo优化频繁重渲染的组件
- 实施代码分割和懒加载减少Bundle大小
- 定期清理未使用的依赖

## 故障排除

### 常见问题

**Q: 性能监控影响应用性能怎么办？**
A: 在生产环境中可以将 `sampleRate` 设置为 0.1 (10%)，减少监控开销。

**Q: 内存监控数据不准确？**
A: 确保浏览器支持 Performance Memory API，或者使用外部内存分析工具。

**Q: Bundle分析失败？**
A: 确保Bundle文件存在且可读，检查文件路径是否正确。

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## Changelog

### v2025.11.05
- 初始版本发布
- 实现性能监控器
- 实现瓶颈检测器
- 实现自动优化器
- 实现Bundle分析器

## 支持

如果您在使用过程中遇到问题，请提交 Issue 或联系维护团队。
