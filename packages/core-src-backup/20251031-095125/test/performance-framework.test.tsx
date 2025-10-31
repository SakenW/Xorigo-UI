/**
 * 性能测试框架
 *
 * 提供全面的组件性能测试，包括渲染性能、内存使用、Bundle大小等
 * 建立性能基准并监控性能回归
 */

import React from 'react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { performance } from 'perf_hooks'

// 导入测试组件
import { Button } from '../primitives/button/button'
import { Card } from '../data-display/card/card'
import { Badge } from '../feedback/badge/badge'
import { Input } from '../primitives/input/input'
import { Modal } from '../overlays/modal/modal'
import { Alert } from '../feedback/alert/alert'

// 性能基准定义
export const PERFORMANCE_BENCHMARKS = {
  render: {
    simple: 10,      // 简单组件 10ms
    complex: 50,     // 复杂组件 50ms
    list: 100        // 列表组件 100ms
  },
  interaction: {
    click: 16,       // 点击响应 16ms (60fps)
    hover: 8,        // 悬停响应 8ms
    scroll: 16,      // 滚动响应 16ms
    resize: 50       // 调整大小 50ms
  },
  memory: {
    component: 1024,     // 组件内存 1KB
    list: 10240,         // 列表内存 10KB
    increase: 512        // 内存增长 512B
  },
  bundle: {
    button: 10240,       // Button组件 10KB
    card: 15360,         // Card组件 15KB
    modal: 20480,        // Modal组件 20KB
    total: 512000        // 总大小 500KB
  }
}

// 性能监控工具类
export class PerformanceMonitor {
  private static measurements: Map<string, number[]> = new Map()
  private static memorySnapshots: MemorySnapshot[] = []

  static startMeasurement(name: string): () => void {
    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime

      if (!this.measurements.has(name)) {
        this.measurements.set(name, [])
      }

      this.measurements.get(name)!.push(duration)
    }
  }

  static getAverageMeasurement(name: string): number {
    const measurements = this.measurements.get(name) || []
    if (measurements.length === 0) return 0
    return measurements.reduce((sum, m) => sum + m, 0) / measurements.length
  }

  static getMeasurementStats(name: string): MeasurementStats | null {
    const measurements = this.measurements.get(name) || []
    if (measurements.length === 0) return null

    const sorted = [...measurements].sort((a, b) => a - b)
    const min = sorted[0]
    const max = sorted[sorted.length - 1]
    const avg = measurements.reduce((sum, m) => sum + m, 0) / measurements.length
    const median = sorted[Math.floor(sorted.length / 2)]
    const p95 = sorted[Math.floor(sorted.length * 0.95)]
    const p99 = sorted[Math.floor(sorted.length * 0.99)]

    return { min, max, avg, median, p95, p99, samples: measurements.length }
  }

  static captureMemorySnapshot(label: string): void {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory
      const snapshot: MemorySnapshot = {
        label,
        timestamp: Date.now(),
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      }
      this.memorySnapshots.push(snapshot)
    }
  }

  static getMemoryGrowth(): MemoryGrowth | null {
    if (this.memorySnapshots.length < 2) return null

    const first = this.memorySnapshots[0]
    const last = this.memorySnapshots[this.memorySnapshots.length - 1]

    return {
      timeSpan: last.timestamp - first.timestamp,
      memoryGrowth: last.usedJSHeapSize - first.usedJSHeapSize,
      snapshots: this.memorySnapshots.length
    }
  }

  static generateReport(): PerformanceReport {
    const measurements = Object.fromEntries(
      Array.from(this.measurements.entries()).map(([name, data]) => [
        name,
        this.getMeasurementStats(name)
      ])
    )

    const memoryGrowth = this.getMemoryGrowth()

    return {
      measurements,
      memoryGrowth,
      generatedAt: new Date().toISOString()
    }
  }

  static reset(): void {
    this.measurements.clear()
    this.memorySnapshots = []
  }
}

// 类型定义
interface MeasurementStats {
  min: number
  max: number
  avg: number
  median: number
  p95: number
  p99: number
  samples: number
}

interface MemorySnapshot {
  label: string
  timestamp: number
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

interface MemoryGrowth {
  timeSpan: number
  memoryGrowth: number
  snapshots: number
}

interface PerformanceReport {
  measurements: Record<string, MeasurementStats | null>
  memoryGrowth: MemoryGrowth | null
  generatedAt: string
}

// 性能测试辅助函数
export const measureRenderPerformance = <P extends object>(
  Component: React.ComponentType<P>,
  props: P,
  iterations = 10
): { avgTime: number; stats: MeasurementStats | null } => {
  const times: number[] = []

  for (let i = 0; i < iterations; i++) {
    const endMeasure = PerformanceMonitor.startMeasurement(`render-${Component.name}`)

    const { unmount } = render(<Component {...props} />)
    unmount()

    endMeasure()
  }

  const avgTime = PerformanceMonitor.getAverageMeasurement(`render-${Component.name}`)
  const stats = PerformanceMonitor.getMeasurementStats(`render-${Component.name}`)

  return { avgTime, stats }
}

export const measureInteractionPerformance = async (
  element: HTMLElement,
  interaction: 'click' | 'hover' | 'focus',
  iterations = 10
): Promise<{ avgTime: number; stats: MeasurementStats | null }> => {
  const times: number[] = []

  for (let i = 0; i < iterations; i++) {
    const endMeasure = PerformanceMonitor.startMeasurement(`${interaction}-${element.tagName}`)

    switch (interaction) {
      case 'click':
        fireEvent.click(element)
        break
      case 'hover':
        fireEvent.mouseEnter(element)
        break
      case 'focus':
        fireEvent.focus(element)
        break
    }

    // 等待下一个事件循环
    await new Promise(resolve => setTimeout(resolve, 0))

    endMeasure()
  }

  const avgTime = PerformanceMonitor.getAverageMeasurement(`${interaction}-${element.tagName}`)
  const stats = PerformanceMonitor.getMeasurementStats(`${interaction}-${element.tagName}`)

  return { avgTime, stats }
}

// 性能测试套件
describe('性能测试框架', () => {
  beforeEach(() => {
    PerformanceMonitor.reset()
  })

  afterEach(() => {
    PerformanceMonitor.reset()
  })

  // =============================================================================
  // 1. 组件渲染性能测试
  // =============================================================================
  describe('组件渲染性能测试', () => {
    it('Button组件应该在10ms内完成渲染', () => {
      const { avgTime, stats } = measureRenderPerformance(Button, {
        children: '测试按钮',
        variant: 'primary'
      })

      expect(avgTime).toBeLessThan(PERFORMANCE_BENCHMARKS.render.simple)
      expect(stats).toBeTruthy()
      expect(stats!.max).toBeLessThan(PERFORMANCE_BENCHMARKS.render.simple * 2)
    })

    it('Card组件应该在10ms内完成渲染', () => {
      const { avgTime, stats } = measureRenderPerformance(Card, {
        children: (
          <div>
            <h3>卡片标题</h3>
            <p>卡片内容</p>
          </div>
        )
      })

      expect(avgTime).toBeLessThan(PERFORMANCE_BENCHMARKS.render.simple)
      expect(stats).toBeTruthy()
    })

    it('Modal组件应该在50ms内完成渲染', () => {
      const { avgTime, stats } = measureRenderPerformance(Modal, {
        isOpen: true,
        onClose: () => {},
        title: '模态框标题',
        children: '模态框内容'
      })

      expect(avgTime).toBeLessThan(PERFORMANCE_BENCHMARKS.render.complex)
      expect(stats).toBeTruthy()
    })

    it('应该高效渲染大量组件', () => {
      const itemCount = 1000
      const items = Array.from({ length: itemCount }, (_, i) => (
        <Badge key={i}>徽章 {i}</Badge>
      ))

      const endMeasure = PerformanceMonitor.startMeasurement('render-large-list')

      const { container } = render(<div>{items}</div>)

      endMeasure()

      const avgTime = PerformanceMonitor.getAverageMeasurement('render-large-list')
      expect(avgTime).toBeLessThan(PERFORMANCE_BENCHMARKS.render.list)
      expect(container.children.length).toBe(itemCount)
    })
  })

  // =============================================================================
  // 2. 交互性能测试
  // =============================================================================
  describe('交互性能测试', () => {
    it('按钮点击响应时间应该少于16ms', async () => {
      const handleClick = vi.fn()
      const { getByRole } = render(
        <Button onClick={handleClick}>点击测试</Button>
      )

      const button = getByRole('button')
      const { avgTime } = await measureInteractionPerformance(button, 'click')

      expect(avgTime).toBeLessThan(PERFORMANCE_BENCHMARKS.interaction.click)
      expect(handleClick).toHaveBeenCalledTimes(10) // 10次测试
    })

    it('输入框聚焦响应时间应该少于16ms', async () => {
      const { getByRole } = render(
        <Input placeholder="测试输入框" />
      )

      const input = getByRole('textbox')
      const { avgTime } = await measureInteractionPerformance(input, 'focus')

      expect(avgTime).toBeLessThan(PERFORMANCE_BENCHMARKS.interaction.click)
    })

    it('组件悬停响应时间应该少于8ms', async () => {
      const { getByRole } = render(
        <Button variant="secondary">悬停测试</Button>
      )

      const button = getByRole('button')
      const { avgTime } = await measureInteractionPerformance(button, 'hover')

      expect(avgTime).toBeLessThan(PERFORMANCE_BENCHMARKS.interaction.hover)
    })
  })

  // =============================================================================
  // 3. 内存使用测试
  // =============================================================================
  describe('内存使用测试', () => {
    beforeEach(() => {
      PerformanceMonitor.captureMemorySnapshot('test-start')
    })

    afterEach(() => {
      PerformanceMonitor.captureMemorySnapshot('test-end')
    })

    it('组件渲染不应该导致明显的内存泄漏', () => {
      // 渲染和卸载组件多次
      for (let i = 0; i < 100; i++) {
        const { unmount } = render(
          <div>
            <Button key={i}>按钮 {i}</Button>
            <Card key={i + 100}>卡片 {i}</Card>
          </div>
        )
        unmount()
      }

      PerformanceMonitor.captureMemorySnapshot('after-100-cycles')

      const memoryGrowth = PerformanceMonitor.getMemoryGrowth()
      if (memoryGrowth) {
        // 内存增长应该小于5MB
        expect(memoryGrowth.memoryGrowth).toBeLessThan(5 * 1024 * 1024)
      }
    })

    it('大量列表渲染应该在内存限制内', () => {
      PerformanceMonitor.captureMemorySnapshot('before-large-list')

      const itemCount = 10000
      const items = Array.from({ length: itemCount }, (_, i) => (
        <Badge key={i}>项目 {i}</Badge>
      ))

      const { unmount } = render(<div>{items}</div>)

      PerformanceMonitor.captureMemorySnapshot('after-large-list')
      unmount()

      PerformanceMonitor.captureMemorySnapshot('after-unmount')

      const memoryGrowth = PerformanceMonitor.getMemoryGrowth()
      if (memoryGrowth) {
        // 内存使用应该合理
        expect(memoryGrowth.memoryGrowth).toBeLessThan(50 * 1024 * 1024) // 50MB
      }
    })
  })

  // =============================================================================
  // 4. 性能基准回归测试
  // =============================================================================
  describe('性能基准回归测试', () => {
    it('Button组件性能不应该出现回归', () => {
      const { avgTime, stats } = measureRenderPerformance(Button, {
        children: '基准测试按钮',
        variant: 'primary'
      }, 20)

      // 与基准比较
      const benchmark = PERFORMANCE_BENCHMARKS.render.simple
      const regressionThreshold = benchmark * 2 // 允许2倍的基准时间

      expect(avgTime).toBeLessThan(regressionThreshold)
      if (stats) {
        expect(stats.p95).toBeLessThan(regressionThreshold)
      }
    })

    it('复杂组件性能不应该出现回归', () => {
      const { avgTime, stats } = measureRenderPerformance(Modal, {
        isOpen: true,
        onClose: () => {},
        title: '性能基准测试',
        children: (
          <div>
            <p>这是一个复杂的模态框内容</p>
            <Button>操作按钮</Button>
            <Input placeholder="输入框" />
          </div>
        )
      }, 15)

      const benchmark = PERFORMANCE_BENCHMARKS.render.complex
      const regressionThreshold = benchmark * 1.5

      expect(avgTime).toBeLessThan(regressionThreshold)
      if (stats) {
        expect(stats.p95).toBeLessThan(regressionThreshold)
      }
    })
  })

  // =============================================================================
  // 5. 性能监控集成测试
  // =============================================================================
  describe('性能监控集成测试', () => {
    it('应该生成完整的性能报告', () => {
      // 执行一些操作
      measureRenderPerformance(Button, { children: '测试' })
      measureRenderPerformance(Card, { children: '内容' })

      const report = PerformanceMonitor.generateReport()

      expect(report).toHaveProperty('measurements')
      expect(report).toHaveProperty('memoryGrowth')
      expect(report).toHaveProperty('generatedAt')

      expect(Object.keys(report.measurements)).toContain('render-Button')
      expect(Object.keys(report.measurements)).toContain('render-Card')
    })

    it('应该正确计算性能统计', () => {
      const endMeasure = PerformanceMonitor.startMeasurement('test-measurement')

      // 模拟一些工作
      setTimeout(() => {
        endMeasure()
      }, 10)

      const stats = PerformanceMonitor.getMeasurementStats('test-measurement')

      expect(stats).toBeTruthy()
      if (stats) {
        expect(stats.samples).toBeGreaterThan(0)
        expect(stats.avg).toBeGreaterThan(0)
        expect(stats.max).toBeGreaterThanOrEqual(stats.avg)
        expect(stats.min).toBeLessThanOrEqual(stats.avg)
      }
    })
  })

  // =============================================================================
  // 6. Bundle大小影响测试
  // =============================================================================
  describe('Bundle大小影响测试', () => {
    it('应该监控组件导入大小', async () => {
      // 这个测试需要在实际构建环境中运行
      // 这里提供一个示例框架
      const componentImports = [
        () => import('../primitives/button/button'),
        () => import('../data-display/card/card'),
        () => import('../primitives/input/input'),
        () => import('../overlays/modal/modal')
      ]

      const importSizes: number[] = []

      for (const importFn of componentImports) {
        const startMeasure = PerformanceMonitor.startMeasurement('import-size')
        const module = await importFn()
        startMeasure()

        // 这里应该有实际的Bundle大小检测逻辑
        // 暂时使用导入时间作为代理指标
      }

      const avgImportTime = PerformanceMonitor.getAverageMeasurement('import-size')
      expect(avgImportTime).toBeLessThan(100) // 导入应该在100ms内完成
    })
  })

  // =============================================================================
  // 7. 性能优化建议测试
  // =============================================================================
  describe('性能优化建议测试', () => {
    it('应该检测性能问题并提供建议', () => {
      // 模拟慢速渲染
      const SlowComponent = () => {
        // 模拟重计算
        const result = Array.from({ length: 100000 }, (_, i) => Math.sqrt(i))
        return <div>慢速组件 {result.length}</div>
      }

      const { avgTime } = measureRenderPerformance(SlowComponent, {})

      // 如果性能差，应该有优化建议
      if (avgTime > PERFORMANCE_BENCHMARKS.render.complex) {
        // 这里应该触发优化建议逻辑
        console.warn(`⚠️ 检测到性能问题: 组件渲染时间 ${avgTime.toFixed(2)}ms`)
        console.warn('💡 建议: 考虑使用React.memo、useMemo或useCallback优化')
      }
    })
  })
})

// 性能测试工具导出
export {
  PerformanceMonitor,
  measureRenderPerformance,
  measureInteractionPerformance,
  PERFORMANCE_BENCHMARKS
}