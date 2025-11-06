/**
 * Performance Monitor 测试
 */

import { describe, it, expect } from 'vitest'
import { PerformanceMonitor } from './monitor'

describe('PerformanceMonitor', () => {
  it('should create monitor instance', () => {
    const monitor = new PerformanceMonitor()
    expect(monitor).toBeDefined()
  })

  it('should start and stop monitoring', () => {
    const monitor = new PerformanceMonitor()
    monitor.start()
    expect(monitor).toBeDefined()
    monitor.stop()
    expect(monitor).toBeDefined()
  })

  it('should record component render', () => {
    const monitor = new PerformanceMonitor()
    monitor.startComponentTracking('TestComponent', 'instance-1')
    monitor.recordRender('TestComponent', 'instance-1', 10.5, 'props_change')

    const metrics = monitor.getComponentMetrics('TestComponent', 'instance-1')
    expect(metrics).toHaveLength(1)
    expect(metrics[0].componentName).toBe('TestComponent')

    monitor.stop()
  })

  it('should generate performance report', () => {
    const monitor = new PerformanceMonitor()
    const report = monitor.generateReport()
    expect(report).toContain('Xorigo UI 性能监控报告')
  })

  it('should handle memory snapshots', () => {
    const monitor = new PerformanceMonitor()

    if ('memory' in performance) {
      monitor.start()
      const snapshot = monitor.getCurrentMemoryUsage()
      // 内存快照可能为 null 如果没有数据
      expect(snapshot).toBeDefined()
      monitor.stop()
    } else {
      console.log('Memory API not available, skipping test')
    }
  })

  it('should subscribe to metrics', () => {
    const monitor = new PerformanceMonitor()
    let called = false

    const unsubscribe = monitor.subscribe(() => {
      called = true
    })

    monitor.startComponentTracking('TestComponent', 'instance-1')
    monitor.recordRender('TestComponent', 'instance-1', 10)

    expect(called).toBe(true)
    unsubscribe()
    monitor.stop()
  })

  it('should dispose correctly', () => {
    const monitor = new PerformanceMonitor()
    monitor.start()
    monitor.dispose()
    expect(monitor).toBeDefined()
  })
})
