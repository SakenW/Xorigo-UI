---
name: "Xorigo UI 性能优化器"
description: "专门优化 Xorigo UI 组件库的性能，包括代码分析、Bundle 优化、运行时性能监控和渲染优化建议"
author: "Xorigo UI Team"
version: "2025.11.05"
tags: ["performance", "optimization", "bundle-analysis", "rendering", "monitoring"]
---

# Xorigo UI 性能优化器

这个 Skill 专门用于分析和优化 Xorigo UI 组件库的性能，确保最佳的用户体验和开发体验。

## 性能优化领域

### 📦 Bundle 优化
- **Bundle 分析** - 分析打包体积和依赖关系
- **Tree Shaking** - 确保未使用代码被正确移除
- **代码分割** - 智能分割组件和功能模块
- **压缩优化** - 代码压缩和混淆优化
- **依赖优化** - 减少不必要的依赖

### ⚡ 运行时性能
- **渲染性能** - 组件渲染时间和重渲染优化
- **内存使用** - 内存泄漏检测和优化
- **主题切换性能** - 主题切换响应时间优化
- **动画性能** - Framer Motion 动画性能分析
- **交互响应** - 用户交互响应时间优化

### 🎨 样式性能
- **CSS 优化** - Tailwind CSS 类名优化
- **样式计算** - 减少样式重计算
- **主题切换优化** - CSS 变量切换性能
- **关键 CSS** - 关键路径 CSS 优化
- **字体加载** - 字体加载性能优化

### 📈 开发体验性能
- **热更新速度** - 开发环境热更新优化
- **TypeScript 编译** - 类型检查性能优化
- **ESLint 性能** - 代码检查性能优化
- **构建时间** - 构建过程时间优化

## 使用方法

对我说：
- "分析 Button 组件的性能"
- "优化 Bundle 大小"
- "检查主题切换性能"
- "分析渲染瓶颈"
- "生成性能报告"
- "优化构建配置"

## 性能分析功能

### 📊 Bundle 分析

**依赖关系分析**：
> "分析 Bundle 依赖关系"
> "检查未使用的代码"
> "优化依赖大小"

**体积分析**：
> "分析 Bundle 大小"
> "找出体积最大的模块"
> "生成 Bundle 报告"

**代码分割建议**：
> "建议代码分割策略"
> "优化模块加载"
> "减少初始加载体积"

### ⚡ 运行时性能分析

**渲染性能**：
> "分析组件渲染性能"
> "检查重渲染原因"
> "优化渲染速度"

**内存分析**：
> "检查内存使用情况"
> "找出内存泄漏"
> "优化内存占用"

**交互性能**：
> "测试用户交互响应"
> "优化点击处理速度"
> "分析滚动性能"

### 🎨 样式性能分析

**CSS 性能**：
> "分析 CSS 性能"
> "优化样式计算"
> "减少重绘和回流"

**主题性能**：
> "测试主题切换性能"
> "优化 CSS 变量"
> "分析主题加载时间"

## 性能测试

### 🧪 性能基准测试

**组件渲染基准**：
```typescript
// 基准测试示例
describe('Button Performance', () => {
  it('should render quickly', async () => {
    const startTime = performance.now()

    render(<Button>Test Button</Button>)

    const endTime = performance.now()
    const renderTime = endTime - startTime

    expect(renderTime).toBeLessThan(16) // 16ms = 60fps
  })

  it('should handle many instances', async () => {
    const startTime = performance.now()

    const { rerender } = render(
      <>
        {Array.from({ length: 1000 }, (_, i) => (
          <Button key={i}>Button {i}</Button>
        ))}
      </>
    )

    const endTime = performance.now()
    const renderTime = endTime - startTime

    expect(renderTime).toBeLessThan(100) // 100ms for 1000 components
  })
})
```

**主题切换基准**：
```typescript
// 主题切换性能测试
test('theme switching performance', async () => {
  const themes = ['midnight', 'ocean', 'forest', 'sunset']

  for (const theme of themes) {
    const startTime = performance.now()

    // 切换主题
    document.documentElement.setAttribute('data-theme', theme)

    // 等待主题应用完成
    await waitForThemeChange()

    const endTime = performance.now()
    const switchTime = endTime - startTime

    expect(switchTime).toBeLessThan(50) // 主题切换应在 50ms 内完成
  }
})
```

### 📈 性能监控

**实时性能监控**：
```typescript
// 性能监控器
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()

  startMeasure(name: string) {
    performance.mark(`${name}-start`)
  }

  endMeasure(name: string): number {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)

    const measure = performance.getEntriesByName(name)[0]
    const duration = measure.duration

    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(duration)

    return duration
  }

  getAverage(name: string): number {
    const values = this.metrics.get(name) || []
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  generateReport(): PerformanceReport {
    return {
      metrics: Object.fromEntries(this.metrics),
      averages: Object.fromEntries(
        Array.from(this.metrics.entries()).map(([name, values]) => [
          name,
          values.reduce((sum, val) => sum + val, 0) / values.length
        ])
      )
    }
  }
}
```

## 优化建议

### 📦 Bundle 优化

**依赖优化**：
```typescript
// ✅ 推荐的导入方式
import { Button } from '@xorigo-ui/core' // 只导入需要的组件

// ❌ 避免的导入方式
import * as Core from '@xorigo-ui/core' // 导入整个库

// ✅ 动态导入
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))
```

**Tree Shaking 优化**：
```typescript
// package.json 优化配置
{
  "sideEffects": false,
  "module": "dist/index.esm.js",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    },
    "./themes": "./dist/themes/index.js"
  }
}
```

### ⚡ 渲染优化

**React.memo 优化**：
```typescript
// ✅ 使用 React.memo 优化组件
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default React.memo(Button)
```

**useMemo 和 useCallback 优化**：
```typescript
// ✅ 优化计算密集型操作
const Component = ({ data, onItemClick }) => {
  const expensiveValue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0)
  }, [data])

  const handleClick = useCallback((item) => {
    onItemClick(item)
  }, [onItemClick])

  return (
    <div>
      <div>Total: {expensiveValue}</div>
      {data.map(item => (
        <Item key={item.id} item={item} onClick={handleClick} />
      ))}
    </div>
  )
}
```

### 🎨 样式优化

**CSS 变量优化**：
```css
/* ✅ 使用 CSS 变量优化主题切换 */
:root {
  --color-primary-500: #3b82f6;
  --transition-fast: 150ms ease;
  --radius-md: 6px;
}

[data-theme="dark"] {
  --color-primary-500: #60a5fa;
}

/* ✅ 优化动画性能 */
.button {
  transition: background-color var(--transition-fast);
  will-change: background-color; /* 提示浏览器优化 */
}
```

**Tailwind CSS 优化**：
```javascript
// tailwind.config.js 优化
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 避免过多的自定义配置
    },
  },
  plugins: [],
  // 启用 JIT 模式以提高性能
  corePlugins: {
    // 禁用不使用的插件
    float: false,
  },
}
```

## 性能报告

### 📊 Bundle 分析报告

```
📦 Bundle 分析报告
====================
总大小: 245.3 KB
Gzip 后: 67.8 KB
Tree Shaking: ✅ 已启用
代码分割: ✅ 已启用

模块大小排行:
1. framer-motion: 89.2 KB (36.4%)
2. @xorigo-ui/core: 67.1 KB (27.3%)
3. react-dom: 39.4 KB (16.1%)
4. 其他: 49.6 KB (20.2%)

优化建议:
- 考虑按需加载 framer-motion
- 移除未使用的组件
- 启用更激进的压缩

依赖分析:
- ✅ 无重复依赖
- ✅ 无循环依赖
- ⚠️ 发现 2 个可优化的依赖
```

### ⚡ 运行时性能报告

```
⚡ 运行时性能报告
====================
测试环境: Chrome 120.0, macOS 14.0

组件渲染性能:
- Button: 2.3ms (目标: <5ms) ✅
- Card: 4.1ms (目标: <10ms) ✅
- Modal: 8.7ms (目标: <15ms) ✅
- DataTable: 23.4ms (目标: <30ms) ✅

主题切换性能:
- Midnight: 12ms ✅
- Ocean: 15ms ✅
- Forest: 18ms ⚠️
- 平均: 15ms (目标: <20ms) ✅

内存使用:
- 初始: 45.2 MB
- 渲染 100 个组件: 52.8 MB
- 内存增长: 7.6 MB (正常范围)
- 无内存泄漏 ✅

交互响应:
- 点击响应: 8ms ✅
- 键盘输入: 5ms ✅
- 滚动性能: 55fps ✅

优化建议:
- 考虑虚拟化长列表
- 优化 Forest 主题的切换速度
- 实现组件懒加载
```

### 🎨 样式性能报告

```
🎨 样式性能报告
====================
CSS 文件大小: 12.4 KB (压缩后: 8.7 KB)
CSS 类名数量: 1,247
关键 CSS: 2.1 KB

样式计算性能:
- 首次渲染: 45ms ✅
- 主题切换: 15ms ✅
- 样式重计算: 3.2ms ✅

字体加载性能:
- 字体文件: 156 KB
- 加载时间: 234ms ✅
- FOUT 时间: 89ms ✅

CSS 优化建议:
- 减少未使用的 Tailwind 类
- 优化关键 CSS 内联
- 考虑字体子集化
- 启用 CSS 压缩
```

## 性能监控配置

### 📈 开发环境监控

```typescript
// 性能监控配置
const performanceConfig = {
  // 开启性能监控
  enabled: process.env.NODE_ENV === 'development',

  // 监控指标
  metrics: {
    renderTime: true,
    bundleSize: true,
    themeSwitchTime: true,
    memoryUsage: true,
  },

  // 性能阈值
  thresholds: {
    renderTime: 16, // 60fps
    themeSwitchTime: 50,
    bundleSize: 300 * 1024, // 300KB
  },

  // 报告配置
  reporting: {
    interval: 5000, // 5秒报告一次
    detailed: true, // 详细报告
  }
}
```

### 🔧 生产环境监控

```typescript
// 生产环境性能监控
class ProductionPerformanceMonitor {
  static observe(componentName: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name.includes(componentName)) {
            // 发送性能数据到分析服务
            this.reportMetrics(componentName, entry)
          }
        })
      })

      observer.observe({ entryTypes: ['measure', 'navigation'] })
    }
  }

  private static reportMetrics(component: string, entry: PerformanceEntry) {
    // 发送到性能分析服务
    analytics.track('component_performance', {
      component,
      duration: entry.duration,
      timestamp: Date.now(),
    })
  }
}
```

## 最佳实践

### ✅ 性能优化原则

1. **测量优先** - 先测量，再优化
2. **渐进优化** - 逐步优化，避免过度优化
3. **用户体验优先** - 优先优化用户感知的性能
4. **持续监控** - 建立持续的性能监控体系

### 📊 性能目标

- **首次内容绘制 (FCP)**: < 1.5s
- **最大内容绘制 (LCP)**: < 2.5s
- **首次输入延迟 (FID)**: < 100ms
- **累积布局偏移 (CLS)**: < 0.1

### 🛠️ 开发工具

- **Bundle Analyzer**: webpack-bundle-analyzer
- **性能监控**: Chrome DevTools
- **内存分析**: Chrome Memory Tab
- **渲染性能**: React DevTools Profiler

让我知道你要优化什么性能指标，我会立即进行全面的性能分析并提供优化建议！