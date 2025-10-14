import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react'

export interface IntersectionObserverProps {
  /** 子元素 */
  children: React.ReactNode
  /** 交叉状态变化回调 */
  onChange?: (entry: IntersectionObserverEntry) => void
  /** 进入视图回调 */
  onEnter?: (entry: IntersectionObserverEntry) => void
  /** 离开视图回调 */
  onLeave?: (entry: IntersectionObserverEntry) => void
  /** 可见性阈值 */
  threshold?: number | number[]
  /** 根元素边距 */
  rootMargin?: string
  /** 根元素 */
  root?: Element | null
  /** 是否只触发一次 */
  triggerOnce?: boolean
  /** 是否立即触发 */
  immediate?: boolean
  /** 是否禁用观察 */
  disabled?: boolean
  /** 自定义容器类名 */
  className?: string
}

export const IntersectionObserverComponent = forwardRef<HTMLDivElement, IntersectionObserverProps>(
  ({
    children,
    onChange,
    onEnter,
    onLeave,
    threshold = 0,
    rootMargin = '0px',
    root = null,
    triggerOnce = false,
    immediate = false,
    disabled = false,
    className,
    ...props
  }, ref) => {
    const elementRef = useRef<HTMLDivElement>(null)
    const observerRef = useRef<IntersectionObserver | null>(null)
    const hasTriggeredRef = useRef(false)
    const [isIntersecting, setIsIntersecting] = useState(false)

    // 处理交叉状态变化
    const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
      const entry = entries[0]
      if (!entry) return

      const { isIntersecting: currentIsIntersecting } = entry

      // 更新状态
      setIsIntersecting(currentIsIntersecting)

      // 调用主回调
      onChange?.(entry)

      // 调用特定回调
      if (currentIsIntersecting) {
        onEnter?.(entry)

        // 如果只触发一次，标记已触发
        if (triggerOnce) {
          hasTriggeredRef.current = true
        }
      } else {
        onLeave?.(entry)
      }
    }, [onChange, onEnter, onLeave, triggerOnce])

    // 创建观察器
    const createObserver = useCallback(() => {
      if (disabled || !elementRef.current) return

      // 清理之前的观察器
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      // 创建新的观察器
      observerRef.current = new window.IntersectionObserver(handleIntersection, {
        threshold,
        rootMargin,
        root,
      })

      // 开始观察
      observerRef.current.observe(elementRef.current)

      // 立即检查一次
      if (immediate && elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        const rootRect = root ? root.getBoundingClientRect() : {
          top: 0,
          left: 0,
          bottom: window.innerHeight,
          right: window.innerWidth,
          width: window.innerWidth,
          height: window.innerHeight,
          x: 0,
          y: 0,
        }

        const intersectionRect = {
          top: Math.max(rect.top, rootRect.top),
          left: Math.max(rect.left, rootRect.left),
          bottom: Math.min(rect.bottom, rootRect.bottom),
          right: Math.min(rect.right, rootRect.right),
          width: Math.min(rect.right, rootRect.right) - Math.max(rect.left, rootRect.left),
          height: Math.min(rect.bottom, rootRect.bottom) - Math.max(rect.top, rootRect.top),
          x: Math.max(rect.left, rootRect.left),
          y: Math.max(rect.top, rootRect.top),
        }

        const isIntersecting = intersectionRect.width > 0 && intersectionRect.height > 0

        const entry = {
          target: elementRef.current,
          isIntersecting,
          intersectionRatio: isIntersecting ? Math.min(
            intersectionRect.width / rect.width,
            intersectionRect.height / rect.height
          ) : 0,
          intersectionRect,
          boundingClientRect: rect,
          rootBounds: rootRect,
          time: Date.now(),
        } as IntersectionObserverEntry

        handleIntersection([entry])
      }
    }, [disabled, handleIntersection, immediate, threshold, rootMargin, root])

    // 清理观察器
    const cleanupObserver = useCallback(() => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }, [])

    // 监听元素变化
    useEffect(() => {
      if (!elementRef.current) return

      createObserver()

      return cleanupObserver
    }, [createObserver, cleanupObserver])

    // 检查是否需要停止观察
    useEffect(() => {
      if (triggerOnce && hasTriggeredRef.current && observerRef.current) {
        observerRef.current.disconnect()
      }
    }, [isIntersecting, triggerOnce])

    // 清理函数
    useEffect(() => {
      return cleanupObserver
    }, [cleanupObserver])

    // 合并refs
    const mergedRef = React.useCallback((node: HTMLDivElement) => {
      elementRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }, [ref])

    return (
      <div ref={mergedRef} className={className} {...props}>
        {children}
      </div>
    )
  }
)

IntersectionObserverComponent.displayName = 'IntersectionObserver'

// 简化的交叉观察Hook
export const useIntersectionObserver = (
  target: HTMLElement | null | undefined,
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) => {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!target) return

    // 创建观察器
    observerRef.current = new window.IntersectionObserver(
      (entries) => callback(entries[0]),
      options
    )

    // 开始观察
    observerRef.current.observe(target)

    // 清理函数
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [target, callback, options])
}

// 可见性Hook
export const useVisibility = (
  target?: HTMLElement | null,
  options?: IntersectionObserverInit
) => {
  const [isVisible, setIsVisible] = useState(false)

  useIntersectionObserver(
    target,
    useCallback((entry) => {
      setIsVisible(entry.isIntersecting)
    }, []),
    options
  )

  return isVisible
}

// 进入视图Hook
export const useInViewport = (
  target?: HTMLElement | null,
  threshold = 0
) => {
  const [inViewport, setInViewport] = useState(false)

  useIntersectionObserver(
    target,
    useCallback((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
        setInViewport(true)
      } else {
        setInViewport(false)
      }
    }, [threshold]),
    { threshold }
  )

  return inViewport
}

// 懒加载Hook
export const useLazyLoad = (
  target?: HTMLElement | null,
  threshold = 0.1
) => {
  const [shouldLoad, setShouldLoad] = useState(false)

  useIntersectionObserver(
    target,
    useCallback((entry) => {
      if (entry.isIntersecting) {
        setShouldLoad(true)
      }
    }, []),
    { threshold, triggerOnce: true }
  )

  return shouldLoad
}

// 无限滚动Hook
export const useInfiniteScroll = (
  target?: HTMLElement | null,
  onLoadMore: () => void,
  threshold = 0.8
) => {
  const [loading, setLoading] = useState(false)

  useIntersectionObserver(
    target,
    useCallback(async (entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= threshold && !loading) {
        setLoading(true)
        await onLoadMore()
        setLoading(false)
      }
    }, [onLoadMore, loading, threshold]),
    { threshold }
  )

  return loading
}

// 视图进度Hook
export const useViewProgress = (
  target?: HTMLElement | null,
  root?: Element | null
) => {
  const [progress, setProgress] = useState(0)

  useIntersectionObserver(
    target,
    useCallback((entry) => {
      const { intersectionRatio, intersectionRect, boundingClientRect } = entry

      if (intersectionRect.height > 0) {
        const visibleHeight = intersectionRect.height
        const totalHeight = boundingClientRect.height
        const currentProgress = visibleHeight / totalHeight
        setProgress(Math.min(Math.max(currentProgress, 0), 1))
      }
    }, [root]),
    { threshold: Array.from({ length: 101 }, (_, i) => i / 100), root }
  )

  return progress
}

// 高级IntersectionObserver组件（支持多元素观察）
export interface AdvancedIntersectionObserverProps {
  /** 观察目标选择器列表 */
  targets: string[]
  /** 交叉状态变化回调 */
  onChange?: (entries: IntersectionObserverEntry[], target: Element) => void
  /** 是否启用 */
  enabled?: boolean
  /** 观察器选项 */
  options?: IntersectionObserverInit
}

export const AdvancedIntersectionObserver = forwardRef<HTMLDivElement, AdvancedIntersectionObserverProps>(
  ({ targets, onChange, enabled = true, options, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const observerRef = useRef<IntersectionObserver | null>(null)

    useEffect(() => {
      if (!enabled || !containerRef.current) return

      // 清理之前的观察器
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      // 创建新的观察器
      observerRef.current = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          onChange?.([entry], entry.target)
        })
      }, options)

      // 观察所有目标元素
      targets.forEach((selector) => {
        const elements = containerRef.current?.querySelectorAll(selector)
        elements?.forEach((element) => {
          observerRef.current?.observe(element)
        })
      })

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect()
        }
      }
    }, [enabled, targets, onChange, options])

    return <div ref={ref} {...props} />
  }
)

AdvancedIntersectionObserver.displayName = 'AdvancedIntersectionObserver'