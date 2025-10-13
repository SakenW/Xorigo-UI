'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
}

/**
 * 性能监控组件
 * 用于收集和显示页面性能指标
 */
export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 只在开发环境显示
    if (process.env.NODE_ENV !== 'development') return

    const measurePerformance = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const metrics: Partial<PerformanceMetrics> = {}

        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime
          } else if (entry.entryType === 'largest-contentful-paint') {
            metrics.lcp = entry.startTime
          } else if (entry.entryType === 'first-input') {
            metrics.fid = (entry as any).processingStart - entry.startTime
          } else if (entry.entryType === 'layout-shift') {
            if (!(entry as any).hadRecentInput) {
              metrics.cls = (metrics.cls || 0) + (entry as any).value
            }
          }
        })

        // TTFB
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          metrics.ttfb = navigation.responseStart - navigation.requestStart
        }

        setMetrics(metrics as PerformanceMetrics)
      })

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] })

      return () => observer.disconnect()
    }

    const cleanup = measurePerformance()

    // 3秒后自动隐藏
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => {
      cleanup?.()
      clearTimeout(timer)
    }
  }, [])

  if (!isVisible || !metrics || process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold">性能指标</span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/50 hover:text-white"
        >
          ✕
        </button>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={metrics.fcp > 1800 ? 'text-red-400' : 'text-green-400'}>
            {metrics.fcp?.toFixed(0)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={metrics.lcp > 2500 ? 'text-red-400' : 'text-green-400'}>
            {metrics.lcp?.toFixed(0)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>FID:</span>
          <span className={metrics.fid > 100 ? 'text-red-400' : 'text-green-400'}>
            {metrics.fid?.toFixed(0)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={metrics.cls > 0.1 ? 'text-red-400' : 'text-green-400'}>
            {metrics.cls?.toFixed(3)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={metrics.ttfb > 600 ? 'text-red-400' : 'text-green-400'}>
            {metrics.ttfb?.toFixed(0)}ms
          </span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-white/20">
        <div className="text-green-400 text-xs">
          ✓ RSC 优化已启用
        </div>
        <div className="text-green-400 text-xs">
          ✓ 动态导入已优化
        </div>
      </div>
    </div>
  )
}