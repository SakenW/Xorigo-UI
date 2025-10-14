'use client'

import React, { useEffect, useCallback, useState } from 'react'

// Core Web Vitals 接口定义
interface WebVitalsMetrics {
  LCP: number | null  // Largest Contentful Paint
  FID: number | null  // First Input Delay
  CLS: number | null  // Cumulative Layout Shift
  FCP: number | null  // First Contentful Paint
  TTFB: number | null // Time to First Byte
  INP: number | null  // Interaction to Next Paint
}

interface PerformanceData {
  timestamp: number
  url: string
  userAgent: string
  metrics: WebVitalsMetrics
  customMetrics: {
    renderTime: number
    bundleSize: number
    memoryUsage: number
  }
}

// Core Web Vitals 配置
const WEB_VITALS_CONFIG = {
  enabled: process.env.NODE_ENV === 'production',
  sampleRate: parseFloat(process.env.NEXT_PUBLIC_WEB_VITALS_SAMPLE_RATE || '0.1'),
  endpoint: '/api/web-vitals',
  maxRetries: 3,
  retryDelay: 1000,
}

// 性能监控组件
export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTFB: null,
    INP: null,
  })

  // 发送性能数据到服务器
  const sendMetrics = useCallback(async (data: PerformanceData) => {
    if (!WEB_VITALS_CONFIG.enabled) return

    // 采样控制
    if (Math.random() > WEB_VITALS_CONFIG.sampleRate) return

    let retryCount = 0

    const sendRequest = async (): Promise<void> => {
      try {
        await fetch(WEB_VITALS_CONFIG.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      } catch (error) {
        if (retryCount < WEB_VITALS_CONFIG.maxRetries) {
          retryCount++
          setTimeout(sendRequest, WEB_VITALS_CONFIG.retryDelay * retryCount)
        } else {
          console.error('Failed to send web vitals data:', error)
        }
      }
    }

    sendRequest()
  }, [])

  // 获取自定义指标
  const getCustomMetrics = useCallback(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

    return {
      renderTime: navigation.loadEventEnd - navigation.fetchStart,
      bundleSize: getBundleSize(),
      memoryUsage: getMemoryUsage(),
    }
  }, [])

  // 获取包大小（估算）
  const getBundleSize = (): number => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    return resources
      .filter(resource => resource.name.includes('.js') || resource.name.includes('.css'))
      .reduce((total, resource) => total + (resource.transferSize || 0), 0)
  }

  // 获取内存使用情况
  const getMemoryUsage = (): number => {
    if ('memory' in performance && performance.memory) {
      return performance.memory.usedJSHeapSize
    }
    return 0
  }

  // 计算 LCP
  const calculateLCP = useCallback(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      setMetrics(prev => ({ ...prev, LCP: lastEntry.startTime }))
    })

    observer.observe({ entryTypes: ['largest-contentful-paint'] })

    return () => observer.disconnect()
  }, [])

  // 计算 FID
  const calculateFID = useCallback(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        setMetrics(prev => ({ ...prev, FID: entry.processingStart - entry.startTime }))
      })
    })

    observer.observe({ entryTypes: ['first-input'] })

    return () => observer.disconnect()
  }, [])

  // 计算 CLS
  const calculateCLS = useCallback(() => {
    let clsValue = 0

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          setMetrics(prev => ({ ...prev, CLS: clsValue }))
        }
      })
    })

    observer.observe({ entryTypes: ['layout-shift'] })

    return () => observer.disconnect()
  }, [])

  // 计算 FCP
  const calculateFCP = useCallback(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcpEntry = entries.find((entry: any) => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, FCP: fcpEntry.startTime }))
      }
    })

    observer.observe({ entryTypes: ['paint'] })

    return () => observer.disconnect()
  }, [])

  // 计算 TTFB
  const calculateTTFB = useCallback(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      setMetrics(prev => ({ ...prev, TTFB: navigation.responseStart - navigation.requestStart }))
    }
  }, [])

  // 计算 INP (Interaction to Next Paint)
  const calculateINP = useCallback(() => {
    let inpValue = 0

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        inpValue = Math.max(inpValue, entry.duration)
        setMetrics(prev => ({ ...prev, INP: inpValue }))
      })
    })

    observer.observe({ entryTypes: ['event'] })

    return () => observer.disconnect()
  }, [])

  // 初始化性能监控
  useEffect(() => {
    if (!WEB_VITALS_CONFIG.enabled) return

    const cleanupFunctions: (() => void)[] = []

    // 检查 Performance Observer 支持
    if ('PerformanceObserver' in window) {
      cleanupFunctions.push(calculateLCP())
      cleanupFunctions.push(calculateFID())
      cleanupFunctions.push(calculateCLS())
      cleanupFunctions.push(calculateFCP())
      cleanupFunctions.push(calculateINP())
    }

    // 计算 TTFB
    calculateTTFB()

    // 页面卸载时发送最终指标
    const handleBeforeUnload = () => {
      const performanceData: PerformanceData = {
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        metrics,
        customMetrics: getCustomMetrics(),
      }

      // 使用 sendBeacon API 确保数据发送
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon(
          WEB_VITALS_CONFIG.endpoint,
          JSON.stringify(performanceData)
        )
      } else {
        sendMetrics(performanceData)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [metrics, calculateLCP, calculateFID, calculateCLS, calculateFCP, calculateTTFB, calculateINP, sendMetrics, getCustomMetrics])

  // 定期发送指标数据
  useEffect(() => {
    if (!WEB_VITALS_CONFIG.enabled) return

    const interval = setInterval(() => {
      const performanceData: PerformanceData = {
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        metrics,
        customMetrics: getCustomMetrics(),
      }

      sendMetrics(performanceData)
    }, 30000) // 每30秒发送一次

    return () => clearInterval(interval)
  }, [metrics, sendMetrics, getCustomMetrics])

  // 在开发环境中显示性能指标
  if (process.env.NODE_ENV === 'development' && metrics.LCP) {
    return (
      <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs font-mono z-50">
        <div className="font-bold mb-2">Performance Metrics</div>
        <div>LCP: {metrics.LCP?.toFixed(0)}ms</div>
        <div>FID: {metrics.FID?.toFixed(0)}ms</div>
        <div>CLS: {metrics.CLS?.toFixed(3)}</div>
        <div>FCP: {metrics.FCP?.toFixed(0)}ms</div>
        <div>TTFB: {metrics.TTFB?.toFixed(0)}ms</div>
        <div>INP: {metrics.INP?.toFixed(0)}ms</div>
      </div>
    )
  }

  return null
}

// 性能监控 Hook
export const usePerformanceMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false)

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
  }, [])

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
  }, [])

  const recordCustomMetric = useCallback((name: string, value: number) => {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(`${name}-start`)
      performance.measure(name, `${name}-start`)
      const measure = performance.getEntriesByName(name, 'measure')[0]
      if (measure) {
        console.log(`Custom metric ${name}: ${measure.duration}ms`)
      }
    }
  }, [])

  return {
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    recordCustomMetric,
  }
}