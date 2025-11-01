import React, { memo, useMemo, useCallback, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

/**
 * 性能优化工具集合
 * 提供通用的性能优化方案和 HOC
 */

// 创建记忆化组件的 HOC
export const createMemoComponent = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  const MemoizedComponent = memo(Component, areEqual)
  MemoizedComponent.displayName = `Memoized(${Component.displayName || Component.name})`
  return MemoizedComponent
}

// 创建带性能优化的 forwardRef 组件
export const createOptimizedComponent = <T extends React.ElementType, P extends object>(
  Component: T,
  shouldMemoize: boolean = true
) => {
  const ForwardRefComponent = forwardRef<any, P>((props, ref) =>
    React.createElement(Component, { ...props, ref })
  )

  if (shouldMemoize) {
    return memo(ForwardRefComponent)
  }

  return ForwardRefComponent
}

// 类名记忆化工具
export const useMemoClassName = (
  baseClasses: string,
  variants: Record<string, string>,
  dependencies: any[]
) => {
  return useMemo(() => {
    const activeVariants = Object.entries(variants)
      .filter(([, value]) => Boolean(value))
      .map(([key, value]) => value)
      .join(' ')

    return cn(baseClasses, activeVariants)
  }, [baseClasses, variants, ...dependencies])
}

// CVA 变体记忆化 Hook
export const useCVAClassName = <T extends Record<string, any>>(
  variants: cva<any>,
  props: T,
  dependencies: any[] = []
) => {
  return useMemo(() => {
    return variants(props)
  }, [variants, props, ...dependencies])
}

// 样式对象记忆化 Hook
export const useMemoStyles = (
  styleFactory: () => React.CSSProperties,
  dependencies: any[]
) => {
  return useMemo(styleFactory, dependencies)
}

// 事件处理器记忆化 Hook
export const useEventCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[]
) => {
  return useCallback(callback, dependencies)
}

// 防抖 Hook
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  dependencies: any[] = []
) => {
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay, ...dependencies])
}

// 节流 Hook
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  dependencies: any[] = []
) => {
  const lastCallRef = React.useRef<number>(0)

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now
      callback(...args)
    }
  }, [callback, delay, ...dependencies])
}

// 懒加载组件创建工具
function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFunc)

  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) =>
    React.createElement(
      React.Suspense,
      {
        fallback: fallback
          ? React.createElement(fallback)
          : React.createElement('div', null, 'Loading...')
      },
      React.createElement(LazyComponent, { ...props, ref })
    )
  )
}

export { createLazyComponent }

// 条件渲染优化
export const useConditionalRender = <T>(
  condition: boolean,
  Component: React.ComponentType<T>,
  props: T
) => {
  return useMemo(() => {
    return condition ? React.createElement(Component, props) : null
  }, [condition, Component, props])
}

// 列表项渲染优化
export const useOptimizedList = <T, P>(
  items: T[],
  renderItem: (item: T, index: number) => React.ReactElement<P>,
  keyExtractor: (item: T, index: number) => string
) => {
  return useMemo(() => {
    return items.map((item, index) => {
      const key = keyExtractor(item, index)
      return React.cloneElement(renderItem(item, index), { key })
    })
  }, [items, renderItem, keyExtractor])
}

// 性能监控装饰器
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string = Component.displayName || Component.name
) => {
  const MonitoredComponent = forwardRef<any, P>((props, ref) => {
    const startTime = React.useRef<number>()

    React.useEffect(() => {
      startTime.current = performance.now()

      return () => {
        if (startTime.current) {
          const endTime = performance.now()
          console.log(`${componentName} render time: ${endTime - startTime.current}ms`)
        }
      }
    })

    return React.createElement(Component, { ...props, ref })
  })

  MonitoredComponent.displayName = `WithPerformanceMonitoring(${componentName})`

  return memo(MonitoredComponent)
}

// 虚拟化列表 Hook（简化版）
export const useVirtualizedList = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = React.useState(0)

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )

    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
  }, [items, visibleRange])

  const totalHeight = items.length * itemHeight

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return {
    visibleItems,
    totalHeight,
    startIndex: visibleRange.startIndex,
    endIndex: visibleRange.endIndex,
    handleScroll,
    offsetY: visibleRange.startIndex * itemHeight,
  }
}