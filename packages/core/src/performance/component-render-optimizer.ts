/**
 * Xorigo UI 组件渲染性能优化系统
 *
 * 提供全面的React组件性能优化解决方案，包括虚拟化、懒加载、
 * 记忆化、批量更新等高级优化技术
 *
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
  memo,
  forwardRef,
  ComponentType,
  ReactNode,
  CSSProperties
} from 'react'

// ==================== 类型定义 ====================

export interface PerformanceMetrics {
  renderCount: number
  renderTime: number
  lastRenderTime: number
  averageRenderTime: number
  memoryUsage: number
  reRenderCauses: string[]
  optimizationScore: number
  recommendations: string[]
}

export interface VirtualItem {
  index: number
  size: number
  start: number
  end: number
  offset: number
  visible: boolean
  data?: any
}

export interface VirtualizationConfig {
  itemHeight: number | ((index: number) => number)
  containerHeight: number
  overscan?: number
  getItemKey?: (index: number, data: any) => string | number
  estimatedItemSize?: number
  scrollElement?: HTMLElement | Window
  horizontal?: boolean
  onScroll?: (scrollOffset: number) => void
  onItemsRendered?: (items: VirtualItem[]) => void
}

export interface LazyLoadConfig {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  triggerOnce?: boolean
  fallback?: ReactNode
  delay?: number
  placeholder?: ReactNode
}

export interface MemoizationConfig {
  equalityFn?: (prevProps: any, nextProps: any) => boolean
  maxDepth?: number
  compareKeys?: string[]
  deepCompare?: boolean
  customComparator?: (prev: any, next: any) => boolean
}

export interface BatchingConfig {
  debounceTime?: number
  maxBatchSize?: number
  batchTimeout?: number
  shouldBatch?: (update: any) => boolean
  onBatchComplete?: (batch: any[]) => void
}

export interface RenderOptimizationOptions {
  enableVirtualization?: boolean
  enableLazyLoading?: boolean
  enableMemoization?: boolean
  enableBatching?: boolean
  enableProfiling?: boolean
  virtualizationConfig?: VirtualizationConfig
  lazyLoadConfig?: LazyLoadConfig
  memoizationConfig?: MemoizationConfig
  batchingConfig?: BatchingConfig
}

export interface ComponentPerformanceProfile {
  componentName: string
  renderCount: number
  totalRenderTime: number
  averageRenderTime: number
  lastRenderTime: number
  memoryFootprint: number
  reRenderReasons: Record<string, number>
  optimizationOpportunities: string[]
  performanceScore: number
  recommendations: string[]
}

// ==================== 虚拟化Hook ====================

/**
 * 虚拟列表Hook - 高性能渲染大量数据
 */
export function useVirtualization<T = any>(
  items: T[],
  config: VirtualizationConfig
): {
  virtualItems: VirtualItem[]
  totalSize: number
  scrollElementProps: {
    ref: React.RefObject<HTMLElement>
    onScroll: (e: React.UIEvent<HTMLElement>) => void
    style: CSSProperties
  }
  scrollToIndex: (index: number, alignment?: 'auto' | 'smart' | 'center' | 'end' | 'start') => void
  scrollToOffset: (offset: number) => void
} {
  const [scrollOffset, setScrollOffset] = useState(0)
  const [containerSize, setContainerSize] = useState(config.containerHeight)
  const scrollElementRef = useRef<HTMLElement>(null)

  const {
    itemHeight,
    overscan = 5,
    getItemKey,
    estimatedItemSize = 50,
    horizontal = false,
    onScroll,
    onItemsRendered
  } = config

  // 计算项目位置信息
  const itemMetadata = useMemo(() => {
    const metadata: Array<{ offset: number; size: number }> = []
    let offset = 0

    for (let i = 0; i < items.length; i++) {
      const size = typeof itemHeight === 'function' ? itemHeight(i) : itemHeight
      metadata.push({ offset, size })
      offset += size
    }

    return metadata
  }, [items.length, itemHeight])

  // 计算总尺寸
  const totalSize = useMemo(() => {
    if (itemMetadata.length === 0) return 0
    const lastItem = itemMetadata[itemMetadata.length - 1]
    return lastItem.offset + lastItem.size
  }, [itemMetadata])

  // 计算可见项目
  const virtualItems = useMemo(() => {
    const visibleItems: VirtualItem[] = []
    const itemCount = items.length

    if (itemCount === 0) return visibleItems

    // 二分查找找到开始索引
    let startIndex = 0
    let endIndex = itemCount - 1

    while (startIndex <= endIndex) {
      const middleIndex = Math.floor((startIndex + endIndex) / 2)
      const middleOffset = itemMetadata[middleIndex].offset

      if (middleOffset < scrollOffset) {
        startIndex = middleIndex + 1
      } else if (middleOffset > scrollOffset) {
        endIndex = middleIndex - 1
      } else {
        startIndex = middleIndex
        break
      }
    }

    // 确定结束索引
    let visibleEndIndex = startIndex
    let currentOffset = itemMetadata[startIndex]?.offset || 0

    while (visibleEndIndex < itemCount && currentOffset < scrollOffset + containerSize) {
      currentOffset += itemMetadata[visibleEndIndex].size
      visibleEndIndex++
    }

    // 添加overscan
    const finalStartIndex = Math.max(0, startIndex - overscan)
    const finalEndIndex = Math.min(itemCount - 1, visibleEndIndex + overscan - 1)

    // 生成虚拟项目
    for (let i = finalStartIndex; i <= finalEndIndex; i++) {
      const item = itemMetadata[i]
      const itemData = items[i]

      visibleItems.push({
        index: i,
        size: item.size,
        start: item.offset,
        end: item.offset + item.size,
        offset: item.offset,
        visible: item.offset < scrollOffset + containerSize && item.offset + item.size > scrollOffset,
        data: itemData
      })
    }

    onItemsRendered?.(visibleItems)
    return visibleItems
  }, [items, itemMetadata, scrollOffset, containerSize, overscan, onItemsRendered])

  // 滚动处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const element = e.currentTarget
    const offset = horizontal ? element.scrollLeft : element.scrollTop
    setScrollOffset(offset)
    onScroll?.(offset)
  }, [horizontal, onScroll])

  // 滚动到指定索引
  const scrollToIndex = useCallback((
    index: number,
    alignment: 'auto' | 'smart' | 'center' | 'end' | 'start' = 'auto'
  ) => {
    if (!scrollElementRef.current || index < 0 || index >= items.length) return

    const item = itemMetadata[index]
    if (!item) return

    const element = scrollElementRef.current
    const containerHeight = horizontal ? element.clientWidth : element.clientHeight
    const itemHeight = item.size

    let scrollOffset = item.offset

    switch (alignment) {
      case 'start':
        break
      case 'end':
        scrollOffset = item.offset - containerHeight + itemHeight
        break
      case 'center':
        scrollOffset = item.offset - (containerHeight - itemHeight) / 2
        break
      case 'auto':
      case 'smart':
        if (item.offset < scrollOffset) {
          scrollOffset = item.offset
        } else if (item.offset + itemHeight > scrollOffset + containerHeight) {
          scrollOffset = item.offset - containerHeight + itemHeight
        }
        break
    }

    if (horizontal) {
      element.scrollTo({ left: scrollOffset, behavior: 'smooth' })
    } else {
      element.scrollTo({ top: scrollOffset, behavior: 'smooth' })
    }
  }, [itemMetadata, items.length, horizontal])

  // 滚动到指定偏移
  const scrollToOffset = useCallback((offset: number) => {
    if (!scrollElementRef.current) return

    if (horizontal) {
      scrollElementRef.current.scrollTo({ left: offset, behavior: 'smooth' })
    } else {
      scrollElementRef.current.scrollTo({ top: offset, behavior: 'smooth' })
    }
  }, [horizontal])

  // 容器大小监听
  useEffect(() => {
    if (!scrollElementRef.current) return

    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0]
      const size = horizontal ? entry.contentRect.width : entry.contentRect.height
      setContainerSize(size)
    })

    resizeObserver.observe(scrollElementRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [horizontal])

  return {
    virtualItems,
    totalSize,
    scrollElementProps: {
      ref: scrollElementRef,
      onScroll: handleScroll,
      style: {
        height: horizontal ? 'auto' : containerSize,
        width: horizontal ? containerSize : 'auto',
        overflow: 'auto'
      }
    },
    scrollToIndex,
    scrollToOffset
  }
}

// ==================== 懒加载Hook ====================

/**
 * 懒加载Hook - 基于Intersection Observer的组件懒加载
 */
export function useLazyLoad(config: LazyLoadConfig = {}): {
  ref: React.RefObject<HTMLElement>
  isVisible: boolean
  hasBeenVisible: boolean
  isLoading: boolean
} {
  const {
    root = null,
    rootMargin = '50px',
    threshold = 0,
    triggerOnce = true,
    delay = 0,
    placeholder = null
  } = config

  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (triggerOnce && hasBeenVisible) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (entry.isIntersecting) {
          setIsLoading(true)

          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true)
              setHasBeenVisible(true)
              setIsLoading(false)
            }, delay)
          } else {
            setIsVisible(true)
            setHasBeenVisible(true)
            setIsLoading(false)
          }

          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
          setIsLoading(false)
        }
      },
      {
        root,
        rootMargin,
        threshold
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [root, rootMargin, threshold, triggerOnce, delay, hasBeenVisible])

  return {
    ref: elementRef,
    isVisible,
    hasBeenVisible,
    isLoading
  }
}

// ==================== 记忆化Hook ====================

/**
 * 智能记忆化Hook - 优化组件重渲染
 */
export function useMemoization<T extends Record<string, any>>(
  props: T,
  config: MemoizationConfig = {}
): T {
  const {
    equalityFn,
    maxDepth = 3,
    compareKeys,
    deepCompare = false,
    customComparator
  } = config

  const previousPropsRef = useRef<T>()
  const memoizedPropsRef = useRef<T>()

  const areEqual = useCallback((prev: T, next: T): boolean => {
    if (customComparator) {
      return customComparator(prev, next)
    }

    if (compareKeys) {
      return compareKeys.every(key => {
        const prevValue = prev[key]
        const nextValue = next[key]

        if (deepCompare && typeof prevValue === 'object' && typeof nextValue === 'object') {
          return deepEqual(prevValue, nextValue, maxDepth)
        }

        return prevValue === nextValue
      })
    }

    if (equalityFn) {
      return equalityFn(prev, next)
    }

    if (deepCompare) {
      return deepEqual(prev, next, maxDepth)
    }

    return shallowEqual(prev, next)
  }, [equalityFn, maxDepth, compareKeys, deepCompare, customComparator])

  if (!previousPropsRef.current || !areEqual(previousPropsRef.current, props)) {
    memoizedPropsRef.current = props
  }

  previousPropsRef.current = props

  return memoizedPropsRef.current as T
}

// ==================== 批量更新Hook ====================

/**
 * 批量更新Hook - 优化频繁的状态更新
 */
export function useBatching<T>(config: BatchingConfig = {}): {
  batchUpdate: (update: T | ((prev: T[]) => T[])) => void
  flush: () => void
  clear: () => void
  getBatch: () => T[]
  batchCount: number
} {
  const {
    debounceTime = 16,
    maxBatchSize = 100,
    batchTimeout = 1000,
    shouldBatch = () => true,
    onBatchComplete
  } = config

  const [batch, setBatch] = useState<T[]>([])
  const [batchCount, setBatchCount] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastFlushRef = useRef<number>(Date.now())

  const flush = useCallback(() => {
    if (batch.length === 0) return

    const currentBatch = [...batch]
    setBatch([])
    setBatchCount(prev => prev + currentBatch.length)
    lastFlushRef.current = Date.now()

    onBatchComplete?.(currentBatch)
  }, [batch, onBatchComplete])

  const batchUpdate = useCallback((update: T | ((prev: T[]) => T[])) => {
    if (!shouldBatch(update)) {
      if (typeof update === 'function') {
        const newBatch = (update as Function)(batch)
        onBatchComplete?.(newBatch)
      } else {
        onBatchComplete?.([update])
      }
      return
    }

    setBatch(prev => {
      const newBatch = typeof update === 'function' ?
        (update as Function)(prev) :
        [...prev, update]

      if (newBatch.length >= maxBatchSize) {
        // 立即刷新如果达到最大批次大小
        setTimeout(flush, 0)
      }

      return newBatch
    })

    // 清除之前的超时
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 设置新的超时
    timeoutRef.current = setTimeout(() => {
      flush()
    }, Math.min(debounceTime, batchTimeout))
  }, [batch, shouldBatch, maxBatchSize, debounceTime, batchTimeout, flush, onBatchComplete])

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setBatch([])
    setBatchCount(0)
  }, [])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    batchUpdate,
    flush,
    clear,
    getBatch: () => batch,
    batchCount
  }
}

// ==================== 性能监控Hook ====================

/**
 * 性能监控Hook - 监控组件渲染性能
 */
export function usePerformanceMonitoring(componentName: string): {
  metrics: PerformanceMetrics
  startProfiling: () => void
  stopProfiling: () => void
  recordRender: (reason?: string) => void
  getRecommendations: () => string[]
} {
  const renderCountRef = useRef(0)
  const renderTimesRef = useRef<number[]>([])
  const reRenderCausesRef = useRef<Record<string, number>>({})
  const isProfilingRef = useRef(false)
  const startTimeRef = useRef<number>(0)

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    renderTime: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    memoryUsage: 0,
    reRenderCauses: [],
    optimizationScore: 100,
    recommendations: []
  })

  const startProfiling = useCallback(() => {
    isProfilingRef.current = true
    startTimeRef.current = performance.now()
  }, [])

  const stopProfiling = useCallback(() => {
    if (!isProfilingRef.current) return

    const endTime = performance.now()
    const renderTime = endTime - startTimeRef.current

    renderCountRef.current++
    renderTimesRef.current.push(renderTime)
    isProfilingRef.current = false

    // 只保留最近100次渲染时间
    if (renderTimesRef.current.length > 100) {
      renderTimesRef.current = renderTimesRef.current.slice(-100)
    }

    updateMetrics()
  }, [])

  const recordRender = useCallback((reason?: string) => {
    if (reason) {
      reRenderCausesRef.current[reason] = (reRenderCausesRef.current[reason] || 0) + 1
    }
  }, [])

  const updateMetrics = useCallback(() => {
    const renderCount = renderCountRef.current
    const renderTimes = renderTimesRef.current
    const reRenderCauses = reRenderCausesRef.current

    const totalRenderTime = renderTimes.reduce((sum, time) => sum + time, 0)
    const averageRenderTime = renderTimes.length > 0 ? totalRenderTime / renderTimes.length : 0
    const lastRenderTime = renderTimes[renderTimes.length - 1] || 0

    // 获取内存使用情况（如果可用）
    let memoryUsage = 0
    if ('memory' in performance) {
      memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024 // MB
    }

    // 计算优化分数
    const optimizationScore = calculateOptimizationScore({
      renderCount,
      averageRenderTime,
      memoryUsage,
      reRenderCauses
    })

    // 生成建议
    const recommendations = generatePerformanceRecommendations({
      componentName,
      renderCount,
      averageRenderTime,
      memoryUsage,
      reRenderCauses,
      optimizationScore
    })

    setMetrics({
      renderCount,
      renderTime: totalRenderTime,
      lastRenderTime,
      averageRenderTime,
      memoryUsage,
      reRenderCauses: Object.entries(reRenderCauses).map(([cause, count]) => `${cause}: ${count}`),
      optimizationScore,
      recommendations
    })
  }, [componentName])

  const getRecommendations = useCallback(() => {
    return generatePerformanceRecommendations({
      componentName,
      renderCount: renderCountRef.current,
      averageRenderTime: renderTimesRef.current.length > 0 ?
        renderTimesRef.current.reduce((sum, time) => sum + time, 0) / renderTimesRef.current.length : 0,
      memoryUsage: 'memory' in performance ? (performance as any).memory.usedJSHeapSize / 1024 / 1024 : 0,
      reRenderCauses: reRenderCausesRef.current,
      optimizationScore: metrics.optimizationScore
    })
  }, [componentName, metrics.optimizationScore])

  return {
    metrics,
    startProfiling,
    stopProfiling,
    recordRender,
    getRecommendations
  }
}

// ==================== 高阶组件 ====================

/**
 * 性能优化高阶组件
 */
export function withPerformanceOptimization<P extends object>(
  Component: ComponentType<P>,
  options: RenderOptimizationOptions = {}
): ComponentType<P> {
  const {
    enableVirtualization = false,
    enableLazyLoading = false,
    enableMemoization = true,
    enableBatching = false,
    enableProfiling = false,
    virtualizationConfig,
    lazyLoadConfig,
    memoizationConfig,
    batchingConfig
  } = options

  const WrappedComponent = memo(Component)

  return forwardRef<any, P>((props, ref) => {
    const { metrics, startProfiling, stopProfiling, recordRender } =
      usePerformanceMonitoring(Component.displayName || Component.name)

    // 性能分析
    useEffect(() => {
      if (enableProfiling) {
        startProfiling()
        return () => {
          stopProfiling()
        }
      }
    }, [enableProfiling, startProfiling, stopProfiling])

    // 记录重渲染原因
    useEffect(() => {
      recordRender('props_change')
    })

    // 记忆化props
    const memoizedProps = enableMemoization ?
      useMemoization(props as any, memoizationConfig) : props

    // 懒加载
    const { ref: lazyRef, isVisible } = useLazyLoad(lazyLoadConfig)

    // 批量更新
    const { batchUpdate } = useBatching(batchingConfig)

    if (enableLazyLoading && !isVisible) {
      return <>{lazyLoadConfig?.fallback || null}</>
    }

    return (
      <div ref={enableLazyLoading ? lazyRef : undefined}>
        <WrappedComponent
          {...memoizedProps}
          ref={ref}
          batchUpdate={enableBatching ? batchUpdate : undefined}
          performanceMetrics={enableProfiling ? metrics : undefined}
        />
      </div>
    )
  })
}

// ==================== 虚拟化组件 ====================

interface VirtualListProps<T> extends VirtualizationConfig {
  items: T[]
  renderItem: (item: VirtualItem & { data: T }) => ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * 虚拟列表组件
 */
export function VirtualList<T>({
  items,
  renderItem,
  className,
  style,
  ...config
}: VirtualListProps<T>) {
  const { virtualItems, totalSize, scrollElementProps } = useVirtualization(items, config)

  return (
    <div
      {...scrollElementProps}
      className={className}
      style={{ ...scrollElementProps.style, ...style }}
    >
      <div style={{ height: totalSize, position: 'relative' }}>
        {virtualItems.map((item) => (
          <div
            key={config.getItemKey ? config.getItemKey(item.index, item.data) : item.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: item.size,
              transform: `translateY(${item.offset}px)`,
            }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== 工具函数 ====================

/**
 * 深度比较函数
 */
function deepEqual(a: any, b: any, maxDepth: number = 3, currentDepth: number = 0): boolean {
  if (currentDepth > maxDepth) return false

  if (a === b) return true

  if (a == null || b == null) return a === b

  if (typeof a !== typeof b) return false

  if (typeof a !== 'object') return a === b

  if (Array.isArray(a) !== Array.isArray(b)) return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (!deepEqual(a[key], b[key], maxDepth, currentDepth + 1)) return false
  }

  return true
}

/**
 * 浅度比较函数
 */
function shallowEqual(a: any, b: any): boolean {
  if (a === b) return true

  if (a == null || b == null) return false

  if (typeof a !== typeof b) return false

  if (typeof a !== 'object') return a === b

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (a[key] !== b[key]) return false
  }

  return true
}

/**
 * 计算优化分数
 */
function calculateOptimizationScore({
  renderCount,
  averageRenderTime,
  memoryUsage,
  reRenderCauses
}: {
  renderCount: number
  averageRenderTime: number
  memoryUsage: number
  reRenderCauses: Record<string, number>
}): number {
  let score = 100

  // 渲染次数惩罚
  if (renderCount > 1000) score -= 20
  else if (renderCount > 500) score -= 10
  else if (renderCount > 100) score -= 5

  // 渲染时间惩罚
  if (averageRenderTime > 16) score -= 20 // 超过一帧时间
  else if (averageRenderTime > 10) score -= 10
  else if (averageRenderTime > 5) score -= 5

  // 内存使用惩罚
  if (memoryUsage > 100) score -= 15 // 100MB
  else if (memoryUsage > 50) score -= 10 // 50MB
  else if (memoryUsage > 20) score -= 5 // 20MB

  // 重渲染原因惩罚
  const causeCount = Object.keys(reRenderCauses).length
  if (causeCount > 10) score -= 10
  else if (causeCount > 5) score -= 5

  return Math.max(0, score)
}

/**
 * 生成性能建议
 */
function generatePerformanceRecommendations({
  componentName,
  renderCount,
  averageRenderTime,
  memoryUsage,
  reRenderCauses,
  optimizationScore
}: {
  componentName: string
  renderCount: number
  averageRenderTime: number
  memoryUsage: number
  reRenderCauses: Record<string, number>
  optimizationScore: number
}): string[] {
  const recommendations: string[] = []

  if (renderCount > 100) {
    recommendations.push(`${componentName} 渲染次数过多 (${renderCount})，考虑使用React.memo或useMemo`)
  }

  if (averageRenderTime > 16) {
    recommendations.push(`${componentName} 平均渲染时间过长 (${averageRenderTime.toFixed(2)}ms)，考虑优化渲染逻辑或使用虚拟化`)
  }

  if (memoryUsage > 50) {
    recommendations.push(`${componentName} 内存使用较高 (${memoryUsage.toFixed(2)}MB)，检查是否存在内存泄漏`)
  }

  const frequentCauses = Object.entries(reRenderCauses)
    .filter(([_, count]) => count > 10)
    .map(([cause, count]) => `${cause} (${count}次)`)

  if (frequentCauses.length > 0) {
    recommendations.push(`${componentName} 频繁重渲染原因: ${frequentCauses.join(', ')}，考虑优化相关逻辑`)
  }

  if (optimizationScore < 70) {
    recommendations.push(`${componentName} 优化分数较低 (${optimizationScore}/100)，建议全面性能优化`)
  }

  return recommendations
}

// ==================== 性能分析器 ====================

/**
 * 组件性能分析器
 */
export class ComponentPerformanceProfiler {
  private profiles: Map<string, ComponentPerformanceProfile> = new Map()
  private observers: PerformanceObserver[] = []

  /**
   * 开始分析组件
   */
  startProfiling(componentName: string): void {
    if (this.profiles.has(componentName)) {
      return
    }

    const profile: ComponentPerformanceProfile = {
      componentName,
      renderCount: 0,
      totalRenderTime: 0,
      averageRenderTime: 0,
      lastRenderTime: 0,
      memoryFootprint: 0,
      reRenderReasons: {},
      optimizationOpportunities: [],
      performanceScore: 100,
      recommendations: []
    }

    this.profiles.set(componentName, profile)

    // 设置性能观察器
    this.setupPerformanceObserver(componentName)
  }

  /**
   * 停止分析组件
   */
  stopProfiling(componentName: string): ComponentPerformanceProfile | null {
    const profile = this.profiles.get(componentName)
    if (!profile) return null

    // 清理观察器
    this.cleanupPerformanceObserver(componentName)

    // 计算最终分数和建议
    profile.optimizationOpportunities = this.identifyOptimizationOpportunities(profile)
    profile.recommendations = this.generateRecommendations(profile)

    return profile
  }

  /**
   * 记录渲染
   */
  recordRender(componentName: string, renderTime: number, reason?: string): void {
    const profile = this.profiles.get(componentName)
    if (!profile) return

    profile.renderCount++
    profile.totalRenderTime += renderTime
    profile.lastRenderTime = renderTime
    profile.averageRenderTime = profile.totalRenderTime / profile.renderCount

    if (reason) {
      profile.reRenderReasons[reason] = (profile.reRenderReasons[reason] || 0) + 1
    }

    // 更新内存使用
    if ('memory' in performance) {
      profile.memoryFootprint = (performance as any).memory.usedJSHeapSize / 1024 / 1024
    }

    // 计算性能分数
    profile.performanceScore = this.calculatePerformanceScore(profile)
  }

  /**
   * 获取所有分析结果
   */
  getAllProfiles(): ComponentPerformanceProfile[] {
    return Array.from(this.profiles.values())
  }

  /**
   * 获取特定组件的分析结果
   */
  getProfile(componentName: string): ComponentPerformanceProfile | null {
    return this.profiles.get(componentName) || null
  }

  /**
   * 生成性能报告
   */
  generateReport(): string {
    const profiles = this.getAllProfiles()
    if (profiles.length === 0) {
      return '没有可用的性能分析数据'
    }

    let report = '# Xorigo UI 组件性能分析报告\n\n'
    report += `生成时间: ${new Date().toLocaleString('zh-CN')}\n\n`

    profiles.forEach(profile => {
      report += `## ${profile.componentName}\n\n`
      report += `- 渲染次数: ${profile.renderCount}\n`
      report += `- 总渲染时间: ${profile.totalRenderTime.toFixed(2)}ms\n`
      report += `- 平均渲染时间: ${profile.averageRenderTime.toFixed(2)}ms\n`
      report += `- 最后渲染时间: ${profile.lastRenderTime.toFixed(2)}ms\n`
      report += `- 内存使用: ${profile.memoryFootprint.toFixed(2)}MB\n`
      report += `- 性能分数: ${profile.performanceScore}/100\n\n`

      if (Object.keys(profile.reRenderReasons).length > 0) {
        report += '### 重渲染原因\n\n'
        Object.entries(profile.reRenderReasons).forEach(([reason, count]) => {
          report += `- ${reason}: ${count}次\n`
        })
        report += '\n'
      }

      if (profile.recommendations.length > 0) {
        report += '### 优化建议\n\n'
        profile.recommendations.forEach(rec => {
          report += `- ${rec}\n`
        })
        report += '\n'
      }

      report += '---\n\n'
    })

    return report
  }

  private setupPerformanceObserver(componentName: string): void {
    // 设置渲染性能观察器
    const renderObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (entry.name.includes(componentName)) {
          this.recordRender(componentName, entry.duration)
        }
      })
    })

    renderObserver.observe({ entryTypes: ['measure'] })
    this.observers.push(renderObserver)
  }

  private cleanupPerformanceObserver(componentName: string): void {
    // 清理相关的性能观察器
    this.observers = this.observers.filter(observer => {
      observer.disconnect()
      return false
    })
  }

  private identifyOptimizationOpportunities(profile: ComponentPerformanceProfile): string[] {
    const opportunities: string[] = []

    if (profile.renderCount > 100) {
      opportunities.push('高渲染频率 - 考虑使用React.memo')
    }

    if (profile.averageRenderTime > 16) {
      opportunities.push('渲染时间长 - 考虑组件拆分或虚拟化')
    }

    if (profile.memoryFootprint > 50) {
      opportunities.push('内存使用高 - 检查是否有内存泄漏')
    }

    const frequentRerenders = Object.entries(profile.reRenderReasons)
      .filter(([_, count]) => count > 10)
      .map(([reason]) => reason)

    if (frequentRerenders.length > 0) {
      opportunities.push(`频繁重渲染: ${frequentRerenders.join(', ')}`)
    }

    return opportunities
  }

  private generateRecommendations(profile: ComponentPerformanceProfile): string[] {
    const recommendations: string[] = []

    if (profile.performanceScore < 70) {
      recommendations.push('组件性能需要优化，建议进行全面重构')
    }

    if (profile.averageRenderTime > 10) {
      recommendations.push('考虑使用useMemo和useCallback优化重渲染')
    }

    if (profile.renderCount > 200) {
      recommendations.push('考虑使用React.memo或shouldComponentUpdate优化渲染')
    }

    if (profile.memoryFootprint > 30) {
      recommendations.push('检查是否有未清理的事件监听器或定时器')
    }

    return recommendations
  }

  private calculatePerformanceScore(profile: ComponentPerformanceProfile): number {
    let score = 100

    // 渲染性能评分
    if (profile.averageRenderTime > 16) score -= 30
    else if (profile.averageRenderTime > 10) score -= 20
    else if (profile.averageRenderTime > 5) score -= 10

    // 渲染频率评分
    if (profile.renderCount > 1000) score -= 20
    else if (profile.renderCount > 500) score -= 10
    else if (profile.renderCount > 100) score -= 5

    // 内存使用评分
    if (profile.memoryFootprint > 100) score -= 20
    else if (profile.memoryFootprint > 50) score -= 10
    else if (profile.memoryFootprint > 20) score -= 5

    // 重渲染原因评分
    const causeCount = Object.keys(profile.reRenderReasons).length
    if (causeCount > 10) score -= 10
    else if (causeCount > 5) score -= 5

    return Math.max(0, score)
  }
}

// ==================== 导出 ====================

export const componentPerformanceProfiler = new ComponentPerformanceProfiler()

// 便捷导出
export {
  VirtualList as default,
  useVirtualization,
  useLazyLoad,
  useMemoization,
  useBatching,
  usePerformanceMonitoring,
  withPerformanceOptimization
}