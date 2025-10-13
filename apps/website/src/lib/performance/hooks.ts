/**
 * 性能监控 React Hooks
 */

import { useEffect, useRef, useState } from 'react'
import { performanceMonitor } from './monitor'
import type { PerformanceReport, ComponentPerformance, CustomMetric } from './types'

/**
 * 使用性能报告
 */
export function usePerformanceReport(updateInterval = 3000) {
  const [report, setReport] = useState<PerformanceReport | null>(null)

  useEffect(() => {
    // 初始获取
    setReport(performanceMonitor.getReport())

    // 定期更新
    const timer = setInterval(() => {
      setReport(performanceMonitor.getReport())
    }, updateInterval)

    return () => clearInterval(timer)
  }, [updateInterval])

  return report
}

/**
 * 监控组件渲染性能
 */
export function useComponentPerformance(componentName: string) {
  const renderStartRef = useRef<number>(0)

  useEffect(() => {
    renderStartRef.current = performance.now()

    return () => {
      const renderTime = performance.now() - renderStartRef.current
      performanceMonitor.recordComponentRender(componentName, renderTime)
    }
  })
}

/**
 * 获取组件性能指标
 */
export function useComponentMetrics() {
  const [metrics, setMetrics] = useState<ComponentPerformance[]>([])

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getComponentMetrics())
    }

    updateMetrics()
    const timer = setInterval(updateMetrics, 2000)

    return () => clearInterval(timer)
  }, [])

  return metrics
}

/**
 * 获取自定义指标
 */
export function useCustomMetrics() {
  const [metrics, setMetrics] = useState<CustomMetric[]>([])

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getCustomMetrics())
    }

    updateMetrics()
    const timer = setInterval(updateMetrics, 2000)

    return () => clearInterval(timer)
  }, [])

  return metrics
}

/**
 * 记录用户交互性能
 */
export function useInteractionTracking(actionName: string) {
  return () => {
    const start = performance.now()

    return () => {
      const duration = performance.now() - start
      performanceMonitor.recordCustomMetric({
        name: actionName,
        value: duration,
        timestamp: Date.now(),
        category: 'interaction'
      })
    }
  }
}
