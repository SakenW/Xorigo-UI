---
name: "usePerformanceOptimization"
description: "智能化性能优化系统，提供组件性能分析、Bundle 优化、运行时性能监控和自动化性能优化建议"
version: "1.0.0"
tags: ["performance", "optimization", "bundle-analysis", "runtime-monitoring", "automation"]
---

# usePerformanceOptimization Hook

## 🚀 功能概述

`usePerformanceOptimization` 是 Xorigo UI 的智能化性能优化系统，提供组件性能分析、Bundle 优化、运行时性能监控和自动化性能优化建议，确保组件库达到最佳性能表现。

## 📊 性能分析维度

### 1. 渲染性能分析
```typescript
interface RenderPerformance {
  metrics: {
    firstPaint: number            // 首次渲染时间 (ms)
    largestContentfulPaint: number // 最大内容绘制时间 (ms)
    timeToInteractive: number     // 可交互时间 (ms)
    cumulativeLayoutShift: number // 累积布局偏移
  }
  componentMetrics: {
    renderTime: number            // 组件渲染时间 (ms)
    reRenderCount: number         // 重渲染次数
    mountTime: number             // 挂载时间 (ms)
    updateTime: number            // 更新时间 (ms)
  }
}
```

### 2. Bundle 分析
```typescript
interface BundleAnalysis {
  size: {
    raw: number                   // 原始大小 (KB)
    gzipped: number              // Gzip 后大小 (KB)
    treeshaken: number           // Tree Shaking 后大小 (KB)
  }
  composition: {
    dependencies: Dependency[]   // 依赖关系
    chunks: Chunk[]              // 代码块信息
    assets: Asset[]              // 资源文件
  }
  opportunities: {
    unusedCode: UnusedCode[]     // 未使用代码
    largeDependencies: string[]  // 大型依赖
    optimization: string[]       // 优化机会
  }
}
```

### 3. 运行时性能监控
```typescript
interface RuntimePerformance {
  memory: {
    heapUsed: number             // 堆内存使用 (MB)
    heapTotal: number            // 堆内存总量 (MB)
    external: number             // 外部内存 (MB)
  }
  cpu: {
    usage: number                // CPU 使用率 (%)
    longTasks: LongTask[]        // 长任务 (>50ms)
  }
  network: {
    requestCount: number         // 请求总数
    totalSize: number            // 总传输大小 (KB)
    slowRequests: Request[]      // 慢请求 (>100ms)
  }
}
```

## 🔍 性能检测功能

### 1. 组件性能分析器
```typescript
class ComponentPerformanceAnalyzer {
  analyzeComponent(component: Component): PerformanceReport {
    return {
      renderPerformance: this.analyzeRenderPerformance(component),
      memoryUsage: this.analyzeMemoryUsage(component),
      eventHandling: this.analyzeEventHandling(component),
      reRenderOptimization: this.analyzeReRenderOptimization(component)
    }
  }

  private analyzeRenderPerformance(component: Component): RenderAnalysis {
    return {
      renderTime: this.measureRenderTime(component),
      mountTime: this.measureMountTime(component),
      updateTime: this.measureUpdateTime(component),
      optimization: {
        canMemoize: this.checkMemoizationPotential(component),
        canLazyLoad: this.checkLazyLoadPotential(component),
        canVirtualize: this.checkVirtualizationPotential(component)
      }
    }
  }
}
```

### 2. Bundle 分析器
```typescript
class BundleAnalyzer {
  analyzeBundle(bundlePath: string): BundleAnalysis {
    return {
      size: this.calculateBundleSize(bundlePath),
      composition: this.analyzeBundleComposition(bundlePath),
      dependencies: this.analyzeDependencies(bundlePath),
      opportunities: this.identifyOptimizationOpportunities(bundlePath)
    }
  }

  private identifyOptimizationOpportunities(bundlePath: string): OptimizationOpportunity[] {
    const opportunities: OptimizationOpportunity[] = []

    // 检查 Tree Shaking 效果
    if (this.hasUnusedCode(bundlePath)) {
      opportunities.push({
        type: 'treeshaking',
        description: '发现未使用的代码，可以进一步优化 Tree Shaking',
        potentialSavings: this.calculateUnusedCodeSize(bundlePath),
        implementation: '更新配置以增强 Tree Shaking'
      })
    }

    // 检查大型依赖
    const largeDeps = this.findLargeDependencies(bundlePath)
    largeDeps.forEach(dep => {
      opportunities.push({
        type: 'dependency',
        description: `发现大型依赖: ${dep.name}`,
        potentialSavings: dep.size,
        implementation: this.getDependencyOptimization(dep.name)
      })
    })

    return opportunities
  }
}
```

### 3. 主题切换性能监控
```typescript
class ThemePerformanceMonitor {
  monitorThemeSwitching(): ThemePerformanceReport {
    return {
      switchTime: this.measureThemeSwitchTime(),
      reflowCount: this.countReflows(),
      repaintCount: this.countRepaints(),
      memoryImpact: this.measureMemoryImpact(),
      optimization: this.suggestThemeOptimizations()
    }
  }

  private measureThemeSwitchTime(): number {
    const startTime = performance.now()

    // 执行主题切换
    this.switchTheme('midnight')

    return performance.now() - startTime
  }

  private suggestThemeOptimizations(): ThemeOptimization[] {
    return [
      {
        type: 'css-variables',
        description: '优化 CSS 变量的使用',
        implementation: '将频繁变化的变量使用 CSS 自定义属性',
        impact: 'high'
      },
      {
        type: 'transitions',
        description: '优化主题切换动画',
        implementation: '使用 prefers-reduced-motion 媒体查询',
        impact: 'medium'
      }
    ]
  }
}
```

### 4. 内存使用分析器
```typescript
class MemoryAnalyzer {
  analyzeMemoryUsage(): MemoryAnalysisReport {
    return {
      heapUsage: this.analyzeHeapUsage(),
      memoryLeaks: this.detectMemoryLeaks(),
      gcImpact: this.analyzeGCImpact(),
      optimization: this.suggestMemoryOptimizations()
    }
  }

  private detectMemoryLeaks(): MemoryLeak[] {
    const leaks: MemoryLeak[] = []

    // 检查事件监听器泄漏
    if (this.hasEventListenerLeaks()) {
      leaks.push({
        type: 'event-listener',
        description: '检测到事件监听器泄漏',
        location: this.findEventListenerLeaks(),
        fix: '在组件卸载时清理事件监听器'
      })
    }

    // 检查定时器泄漏
    if (this.hasTimerLeaks()) {
      leaks.push({
        type: 'timer',
        description: '检测到定时器泄漏',
        location: this.findTimerLeaks(),
        fix: '在组件卸载时清理定时器'
      })
    }

    return leaks
  }
}
```

## 🎯 性能优化策略

### 1. React 性能优化
```typescript
interface ReactOptimization {
  memo: {
    components: string[]           // 可以使用 React.memo 的组件
    hooks: string[]                // 可以使用 useMemo/useCallback 的 hooks
    patterns: string[]              // 推荐的性能模式
  }
  lazy: {
    components: string[]           // 可以懒加载的组件
    routes: string[]                // 可以懒加载的路由
    assets: string[]                // 可以懒加载的资源
  }
  virtual: {
    lists: string[]                // 可以虚拟化的列表
    tables: string[]               // 可以虚拟化的表格
    grids: string[]                // 可以虚拟化的网格
  }
}
```

### 2. CSS 性能优化
```typescript
interface CSPOptimization {
  animations: {
    optimize: string[]             // 可以优化的动画
    replace: string[]              // 可以替换的动画
    hardware: string[]             // 可以硬件加速的动画
  }
  layout: {
    optimize: string[]             // 可以优化的布局
    avoid: string[]                // 避免的布局操作
    flatten: string[]               // 可以扁平化的布局
  }
  paint: {
    optimize: string[]             // 可以优化的绘制操作
    reduce: string[]               // 可以减少的绘制操作
    composite: string[]            // 可以复合的图层
  }
}
```

### 3. Bundle 优化
```typescript
interface BundleOptimization {
  codeSplitting: {
    routes: string[]               // 可以拆分的路由
    components: string[]           // 可以拆分的组件
    features: string[]             // 可以拆分的特性
  }
  compression: {
    algorithms: string[]           // 推荐的压缩算法
    settings: CompressionSettings   // 压缩设置
    assets: string[]               // 可以压缩的资源
  }
  caching: {
    strategies: string[]           // 缓存策略
    headers: CacheHeaders          // 缓存头设置
    serviceWorker: boolean         // Service Worker 支持
  }
}
```

## 🚀 使用场景

### 场景 1: 组件性能优化
```
用户: "我的 Modal 组件渲染很慢"

Hook 执行流程:
1. 分析 Modal 组件的性能瓶颈
2. 检查重渲染模式和原因
3. 测量内存使用和泄漏
4. 生成优化建议 (React.memo, 懒加载)
5. 提供具体的代码改进方案

输出: Modal 组件性能优化报告 + 改进代码
```

### 场景 2: Bundle 优化
```
用户: "我们的 Bundle 太大了"

Hook 执行流程:
1. 分析 Bundle 大小和组成
2. 识别大型依赖和未使用代码
3. 建议代码分割策略
4. 推荐压缩和缓存优化
5. 生成优化配置

输出: Bundle 优化方案 + Webpack/Vite 配置
```

### 场景 3: 主题性能优化
```
用户: "主题切换有点卡顿"

Hook 执行流程:
1. 监控主题切换性能
2. 分析重绘和重排情况
3. 检查 CSS 变量使用效率
4. 建议动画优化方案
5. 提供性能监控工具

输出: 主题优化方案 + 性能监控代码
```

## 📊 性能报告格式

### 组件性能报告
```
🚀 Modal 组件性能分析报告
============================
分析时间: 2025-01-XX 15:30:00
组件复杂度: 中等

📊 性能指标:
- 首次渲染: 12.3ms (目标: <16ms) ✅
- 重渲染时间: 8.7ms (目标: <10ms) ✅
- 内存使用: 2.1MB (正常) ✅
- 内存泄漏: 无 ✅

⚠️ 发现的问题:
1. 在 props 变化时不必要的重渲染
   影响: 中等
   解决方案: 使用 React.memo

2. 子组件未优化的事件处理器
   影响: 低
   解决方案: 使用 useCallback

💡 优化建议:
1. 高优先级:
   - 使用 React.memo 包装组件
   - 使用 useCallback 优化事件处理器
   - 考虑懒加载非关键功能

2. 中等优先级:
   - 实现虚拟滚动 (如果内容很长)
   - 添加加载状态优化
   - 优化动画性能

3. 低优先级:
   - 微调 CSS 动画
   - 优化图片加载
   - 实现预加载机制

📈 预期改进:
- 渲染时间减少 30-40%
- 内存使用减少 10-15%
- 用户体验提升明显
```

### Bundle 分析报告
```
📦 Bundle 分析报告
====================
Bundle 大小: 245.3 KB (gzipped: 67.8 KB)
分析时间: 2025-01-XX 15:30:00

📊 大小分布:
- React 相关: 89.2 KB (36.4%)
- Xorigo UI 核心: 67.1 KB (27.3%)
- 第三方依赖: 156.3 KB (63.7%)
- 应用代码: 34.7 KB (14.1%)

🔍 优化机会:
1. 第三方依赖优化:
   - Framer Motion: 可以按需导入 (-42KB)
   - Lodash: 替换为原生实现 (-23KB)
   - Moment.js: 替换为 date-fns (-67KB)

2. 代码分割:
   - 路由级别分割: 预计减少 30%
   - 组件懒加载: 预计减少 20%
   - 特性开关: 预计减少 15%

3. 压缩优化:
   - 启用 Brotli 压缩: 预计减少 15%
   - 图片优化: 预计减少 10%
   - 资源合并: 预计减少 5%

💡 推荐方案:
1. 立即实施 (高影响):
   - 启用代码分割
   - 优化 Framer Motion 使用
   - 启用 Brotli 压缩

2. 计划实施 (中等影响):
   - 替换大型依赖
   - 实现特性开关
   - 优化资源加载

📈 预期结果:
- Bundle 大小减少 40-50%
- 首屏加载时间减少 30%
- 缓存命中率提升 25%
```

## 🔧 技术实现

### 性能监控配置
```typescript
interface PerformanceConfig {
  thresholds: {
    renderTime: number           // 渲染时间阈值 (ms)
    bundleSize: number          // Bundle 大小阈值 (KB)
    memoryUsage: number         // 内存使用阈值 (MB)
    themeSwitchTime: number      // 主题切换时间阈值 (ms)
  }
  monitoring: {
    enableContinuous: boolean   // 启用持续监控
    reportInterval: number       // 报告间隔 (分钟)
    alertThreshold: number       // 告警阈值
  }
  optimization: {
    autoApply: boolean          // 自动应用优化
    requireApproval: boolean    // 需要审批
    backupOriginal: boolean      // 备份原始代码
  }
}
```

### 自动化优化器
```typescript
class PerformanceOptimizer {
  async optimizeComponent(component: Component): Promise<OptimizationResult> {
    // 1. 分析性能瓶颈
    const analysis = await this.analyzePerformance(component)

    // 2. 生成优化方案
    const optimizations = this.generateOptimizations(analysis)

    // 3. 应用优化
    const optimized = await this.applyOptimizations(component, optimizations)

    // 4. 验证结果
    const verification = await this.verifyOptimization(optimized)

    return {
      original: analysis,
      optimizations,
      optimized,
      verification,
      improvement: this.calculateImprovement(analysis, verification)
    }
  }
}
```

## 🎛️ 配置选项

### Hook 配置
```yaml
# .claude/hooks/usePerformanceOptimization.yml
config:
  enableMonitoring: true         # 启用性能监控
  enableOptimization: true       # 启用自动优化
  generateReports: true          # 生成性能报告

thresholds:
  renderTime: 16                # 渲染时间阈值 (ms)
  bundleSize: 300               # Bundle 大小阈值 (KB)
  memoryUsage: 50               # 内存使用阈值 (MB)
  themeSwitchTime: 50           # 主题切换时间阈值 (ms)

monitoring:
  continuous: true               # 持续监控
  interval: 5                   # 监控间隔 (分钟)
  autoAlert: true                # 自动告警

optimization:
  autoApply: false               # 自动应用优化
  requireConfirmation: true      # 需要确认
  backupBeforeChanges: true     # 修改前备份
```

## 🔗 与其他工具的集成

### Skills 集成
- **xorigo-performance-optimizer**: 提供性能分析能力
- **xorigo-component-generator**: 生成性能优化的组件
- **xorigo-test-automation**: 提供性能测试

### Sub-agents 集成
- **xorigo-quality-guardian**: 将性能作为质量标准的一部分
- **xorigo-component-master**: 在组件开发中集成性能检查

## 🚀 未来扩展

### 高级功能
- **AI 性能预测**: 基于机器学习的性能预测
- **实时性能监控**: 生产环境实时性能监控
- **自动性能回归检测**: 自动检测性能回归
- **跨设备性能分析**: 多设备性能对比分析

### 协作功能
- **团队性能标准**: 建立团队性能标准
- **性能知识库**: 性能优化知识库
- **性能审查流程**: 性能审查自动化流程

这个 Hook 将为 Xorigo UI 提供全面的性能优化能力，确保组件库在各种场景下都能达到最佳性能表现。