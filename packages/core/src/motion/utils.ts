/**
 * Xorigo UI 动画工具函数
 *
 * 提供实用的动画工具和辅助函数
 * 支持性能优化、调试和动画编排
 */

import type { AnimationControls, MotionValue, TargetAndTransition } from 'framer-motion'
import { useAnimation, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import { animationSystem } from './animation-system'
import { motionThemeProvider, useMotionTheme } from './theme-integration'

// =============================================================================
// 动画 Hook
// =============================================================================

/**
 * 使用主题感知动画控制
 */
export function useThemeAnimation() {
  const controls = useAnimation()
  const shouldReduceMotion = useReducedMotion()
  const { config } = useMotionTheme ? useMotionTheme() : { config: motionThemeProvider.getConfig() }

  const createAnimation = useCallback((
    target: TargetAndTransition,
    options?: {
      duration?: number
      delay?: number
      ease?: string
      respectReducedMotion?: boolean
    }
  ) => {
    const duration = options?.duration || 200
    const delay = options?.delay || 0
    const ease = options?.ease || 'easeOut'
    const respectMotion = options?.respectReducedMotion ?? true

    // 检查是否应该禁用动画
    if (respectMotion && (shouldReduceMotion || config.accessibility.reducedMotion)) {
      return controls.start(target)
    }

    return controls.start({
      ...target,
      transition: {
        duration: duration / 1000,
        delay: delay / 1000,
        ease,
      },
    })
  }, [controls, shouldReduceMotion, config])

  return { controls, createAnimation }
}

/**
 * 使用视口检测动画
 */
export function useViewportAnimation(options: {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
} = {}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, {
    threshold: options.threshold || 0.1,
    rootMargin: options.rootMargin || '0px',
    triggerOnce: options.triggerOnce !== false,
  })

  const { controls, createAnimation } = useThemeAnimation()

  useEffect(() => {
    if (isInView) {
      createAnimation({ opacity: 1, y: 0 }, { duration: 300 })
    }
  }, [isInView, createAnimation])

  return { ref, isInView, controls }
}

/**
 * 使用交错动画
 */
export function useStaggerAnimation(
  itemCount: number,
  options: {
    staggerDelay?: number
    initialDelay?: number
    duration?: number
  } = {}
) {
  const [animationStates, setAnimationStates] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  )

  const startStagger = useCallback(() => {
    const { staggerDelay = 0.1, initialDelay = 0 } = options

    animationStates.forEach((_, index) => {
      setTimeout(() => {
        setAnimationStates(prev => {
          const newStates = [...prev]
          newStates[index] = true
          return newStates
        })
      }, initialDelay + index * staggerDelay * 1000)
    })
  }, [animationStates.length, options])

  const resetStagger = useCallback(() => {
    setAnimationStates(new Array(itemCount).fill(false))
  }, [itemCount])

  return {
    animationStates,
    startStagger,
    resetStagger,
  }
}

/**
 * 使用动画编排
 */
export function useAnimationOrchestrator() {
  const animations = useRef<Map<string, AnimationControls>>(new Map())
  const [completedAnimations, setCompletedAnimations] = useState<Set<string>>(new Set())

  const addAnimation = useCallback((name: string, controls: AnimationControls) => {
    animations.current.set(name, controls)
  }, [])

  const playSequence = useCallback(async (sequence: Array<{
    name: string
    animation: TargetAndTransition
    options?: {
      duration?: number
      delay?: number
      onComplete?: () => void
    }
  }>) => {
    for (const step of sequence) {
      const controls = animations.current.get(step.name)
      if (controls) {
        await controls.start({
          ...step.animation,
          transition: {
            duration: step.options?.duration ? step.options.duration / 1000 : 0.3,
            delay: step.options?.delay ? step.options.delay / 1000 : 0,
          },
        })

        setCompletedAnimations(prev => new Set([...prev, step.name]))
        step.options?.onComplete?.()
      }
    }
  }, [])

  const playParallel = useCallback(async (animations: Array<{
    name: string
    animation: TargetAndTransition
    options?: {
      duration?: number
      delay?: number
      onComplete?: () => void
    }
  }>) => {
    const promises = animations.map(async (step) => {
      const controls = animations.current.get(step.name)
      if (controls) {
        await controls.start({
          ...step.animation,
          transition: {
            duration: step.options?.duration ? step.options.duration / 1000 : 0.3,
            delay: step.options?.delay ? step.options.delay / 1000 : 0,
          },
        })

        setCompletedAnimations(prev => new Set([...prev, step.name]))
        step.options?.onComplete?.()
      }
    })

    await Promise.all(promises)
  }, [])

  const reset = useCallback(() => {
    setCompletedAnimations(new Set())
  }, [])

  return {
    addAnimation,
    playSequence,
    playParallel,
    completedAnimations,
    reset,
  }
}

// =============================================================================
// 动画性能工具
// =============================================================================

/**
 * 动画性能监控器
 */
class AnimationPerformanceMonitor {
  private static instance: AnimationPerformanceMonitor
  private metrics: Map<string, PerformanceMetric> = new Map()
  private observers: Set<() => void> = new Set()
  private rafId: number | null = null

  private constructor() {
    this.startMonitoring()
  }

  public static getInstance(): AnimationPerformanceMonitor {
    if (!AnimationPerformanceMonitor.instance) {
      AnimationPerformanceMonitor.instance = new AnimationPerformanceMonitor()
    }
    return AnimationPerformanceMonitor.instance
  }

  private startMonitoring(): void {
    const monitor = () => {
      // 收集性能指标
      this.collectMetrics()

      // 通知观察者
      this.notifyObservers()

      // 继续监控
      this.rafId = requestAnimationFrame(monitor)
    }

    this.rafId = requestAnimationFrame(monitor)
  }

  private collectMetrics(): void {
    // 获取页面性能指标
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType('paint')
    const frames = performance.getEntriesByType('measure').filter(
      entry => entry.name.includes('frame')
    )

    // 计算动画相关指标
    const frameRate = frames.length > 0 ?
      Math.round(1000 / (frames[frames.length - 1].startTime - frames[0].startTime)) : 60

    // 计算内存使用（如果可用）
    const memory = (performance as any).memory
    const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0

    // 更新指标
    const metric: PerformanceMetric = {
      frameRate,
      memoryUsage,
      domNodes: document.querySelectorAll('*').length,
      activeAnimations: this.metrics.size,
      timestamp: Date.now(),
    }

    this.metrics.set('current', metric)
  }

  private notifyObservers(): void {
    this.observers.forEach(observer => observer())
  }

  public getMetrics(): PerformanceMetric {
    return this.metrics.get('current') || {
      frameRate: 60,
      memoryUsage: 0,
      domNodes: 0,
      activeAnimations: 0,
      timestamp: Date.now(),
    }
  }

  public subscribe(observer: () => void): () => void {
    this.observers.add(observer)
    return () => {
      this.observers.delete(observer)
    }
  }

  public stopMonitoring(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }
}

// =============================================================================
// 动画性能 Hook
// =============================================================================

export function useAnimationPerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetric | null>(null)

  useEffect(() => {
    const monitor = AnimationPerformanceMonitor.getInstance()

    const updateMetrics = () => {
      setMetrics(monitor.getMetrics())
    }

    const unsubscribe = monitor.subscribe(updateMetrics)
    updateMetrics()

    return () => {
      unsubscribe()
    }
  }, [])

  const getPerformanceScore = useCallback((currentMetrics: PerformanceMetric) => {
    let score = 100

    // 帧率评分
    if (currentMetrics.frameRate < 30) score -= 40
    else if (currentMetrics.frameRate < 45) score -= 20
    else if (currentMetrics.frameRate < 55) score -= 10

    // 内存使用评分
    if (currentMetrics.memoryUsage > 100) score -= 20
    else if (currentMetrics.memoryUsage > 50) score -= 10

    // DOM 节点评分
    if (currentMetrics.domNodes > 1000) score -= 20
    else if (currentMetrics.domNodes > 500) score -= 10

    // 活跃动画评分
    if (currentMetrics.activeAnimations > 20) score -= 20
    else if (currentMetrics.activeAnimations > 10) score -= 10

    return Math.max(0, score)
  }, [])

  const getRecommendations = useCallback((currentMetrics: PerformanceMetric) => {
    const recommendations: string[] = []

    if (currentMetrics.frameRate < 45) {
      recommendations.push('帧率较低，建议减少同时运行的动画数量')
    }

    if (currentMetrics.memoryUsage > 50) {
      recommendations.push('内存使用较高，建议优化动画性能')
    }

    if (currentMetrics.activeAnimations > 10) {
      recommendations.push('活跃动画数量较多，考虑使用动画编排')
    }

    if (currentMetrics.domNodes > 500) {
      recommendations.push('DOM 节点较多，动画可能影响性能')
    }

    return recommendations
  }, [])

  return {
    metrics,
    getPerformanceScore,
    getRecommendations,
  }
}

// =============================================================================
// 动画工具函数
// =============================================================================

/**
 * 检查元素是否在视口中
 */
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * 获取元素的动画性能预算
 */
export function getAnimationBudget(element: HTMLElement): AnimationBudget {
  const rect = element.getBoundingClientRect()
  const area = rect.width * rect.height
  const isVisible = isElementInViewport(element)

  // 根据元素大小和可见性计算预算
  let complexity: 'simple' | 'moderate' | 'complex' = 'moderate'
  let maxDuration = 300
  let maxParallelAnimations = 3

  if (area < 10000) { // 小元素
    complexity = 'simple'
    maxDuration = 500
    maxParallelAnimations = 5
  } else if (area > 100000) { // 大元素
    complexity = 'complex'
    maxDuration = 200
    maxParallelAnimations = 1
  }

  if (!isVisible) {
    maxDuration = 100
    maxParallelAnimations = 1
  }

  return {
    complexity,
    maxDuration,
    maxParallelAnimations,
    isVisible,
    area,
  }
}

/**
 * 创建动画节流函数
 */
export function createAnimationThrottle(delay: number = 16) {
  let lastCall = 0
  let rafId: number | null = null

  return function <T extends (...args: any[]) => void>(
    fn: T,
    ...args: Parameters<T>
  ) {
    const now = performance.now()

    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    } else {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        lastCall = performance.now()
        fn(...args)
      })
    }
  }
}

/**
 * 动画防抖函数
 */
export function createAnimationDebounce(delay: number = 100) {
  let timeoutId: NodeJS.Timeout | null = null

  return function <T extends (...args: any[]) => void>(
    fn: T,
    ...args: Parameters<T>
  ) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

/**
 * 检查浏览器是否支持硬件加速
 */
export function supportsHardwareAcceleration(): boolean {
  const testElement = document.createElement('div')
  testElement.style.transform = 'translateZ(0)'
  testElement.style.perspective = '1000px'

  const hasTransform3D = testElement.style.transform.length > 0
  const hasPerspective = testElement.style.perspective.length > 0

  return hasTransform3D && hasPerspective
}

/**
 * 获取最优的动画属性
 */
export function getOptimalAnimationProperties(): {
  transform: string[]
  willChange: string[]
  gpuAccelerated: boolean
} {
  const gpuAccelerated = supportsHardwareAcceleration()

  return {
    transform: gpuAccelerated
      ? ['translate3d(0,0,0)', 'scale3d(1,1,1)', 'rotate3d(0,0,0)']
      : ['translate(0,0)', 'scale(1)', 'rotate(0)'],
    willChange: gpuAccelerated
      ? ['transform', 'opacity']
      : ['opacity'],
    gpuAccelerated,
  }
}

// =============================================================================
// 类型定义
// =============================================================================

export interface PerformanceMetric {
  frameRate: number
  memoryUsage: number
  domNodes: number
  activeAnimations: number
  timestamp: number
}

export interface AnimationBudget {
  complexity: 'simple' | 'moderate' | 'complex'
  maxDuration: number
  maxParallelAnimations: number
  isVisible: boolean
  area: number
}

// =============================================================================
// 导出工具函数
// =============================================================================

export {
  AnimationPerformanceMonitor,
}