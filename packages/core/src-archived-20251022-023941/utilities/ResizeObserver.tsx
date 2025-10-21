import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react'

export interface ResizeObserverProps {
  /** 子元素 */
  children: React.ReactNode
  /** 尺寸变化回调 */
  onResize?: (entries: ResizeObserverEntry[]) => void
  /** 宽度变化回调 */
  onWidthChange?: (width: number) => void
  /** 高度变化回调 */
  onHeightChange?: (height: number) => void
  /** 节流延迟(ms) */
  throttleDelay?: number
  /** 是否启用节流 */
  throttle?: boolean
  /** 是否立即触发一次回调 */
  immediate?: boolean
  /** 是否禁用观察 */
  disabled?: boolean
  /** 观察器选项 */
  options?: ResizeObserverOptions
  /** 容器类名 */
  className?: string
}

export const ResizeObserverComponent = forwardRef<HTMLDivElement, ResizeObserverProps>(
  ({
    children,
    onResize,
    onWidthChange,
    onHeightChange,
    throttleDelay = 16,
    throttle = true,
    immediate = false,
    disabled = false,
    options,
    className,
    ...props
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const observerRef = useRef<ResizeObserver | null>(null)
    const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // 处理尺寸变化
    const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
      if (disabled) return

      const entry = entries[0]
      if (!entry) return

      const { width, height } = entry.contentRect

      // 清除之前的节流定时器
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
      }

      const executeCallbacks = () => {
        // 调用主回调
        onResize?.(entries)

        // 调用特定回调
        onWidthChange?.(width)
        onHeightChange?.(height)
      }

      if (throttle) {
        // 节流处理
        throttleTimeoutRef.current = setTimeout(executeCallbacks, throttleDelay)
      } else {
        // 立即执行
        executeCallbacks()
      }
    }, [disabled, onResize, onWidthChange, onHeightChange, throttle, throttleDelay])

    // 创建观察器
    const createObserver = useCallback(() => {
      if (disabled || !containerRef.current) return

      // 清理之前的观察器
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      // 创建新的观察器
      observerRef.current = new window.ResizeObserver(handleResize)

      // 开始观察
      observerRef.current.observe(containerRef.current, options)

      // 立即触发一次
      if (immediate && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const entry = {
          target: containerRef.current,
          contentRect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
          },
          borderBoxSize: [],
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        } as ResizeObserverEntry

        handleResize([entry])
      }
    }, [disabled, handleResize, immediate, options])

    // 清理观察器
    const cleanupObserver = useCallback(() => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current)
        throttleTimeoutRef.current = null
      }
    }, [])

    // 监听容器变化
    useEffect(() => {
      if (!containerRef.current) return

      createObserver()

      return cleanupObserver
    }, [createObserver, cleanupObserver])

    // 清理函数
    useEffect(() => {
      return cleanupObserver
    }, [cleanupObserver])

    // 合并refs
    const mergedRef = React.useCallback((node: HTMLDivElement) => {
      containerRef.current = node
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

ResizeObserverComponent.displayName = 'ResizeObserver'

// 简化的尺寸观察Hook
export const useResizeObserver = (
  target: HTMLElement | null | undefined,
  callback: (entries: ResizeObserverEntry[]) => void,
  options?: ResizeObserverOptions
) => {
  const observerRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    if (!target) return

    // 创建观察器
    observerRef.current = new window.ResizeObserver(callback)

    // 开始观察
    observerRef.current.observe(target, options)

    // 清理函数
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [target, callback, options])
}

// 尺寸状态Hook
export const useElementSize = (target?: HTMLElement | null) => {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useResizeObserver(
    target,
    useCallback((entries) => {
      const entry = entries[0]
      if (entry) {
        const { width, height } = entry.contentRect
        setSize({ width, height })
      }
    }, [])
  )

  return size
}

// 容器查询Hook
export const useContainerQuery = (
  target: HTMLElement | null | undefined,
  breakpoints: Record<string, number>
) => {
  const [matches, setMatches] = useState<Record<string, boolean>>(() =>
    Object.keys(breakpoints).reduce((acc, key) => ({ ...acc, [key]: false }), {})
  )

  useResizeObserver(
    target,
    useCallback((entries) => {
      const entry = entries[0]
      if (entry) {
        const width = entry.contentRect.width
        const newMatches = Object.entries(breakpoints).reduce((acc, [name, breakpoint]) => ({
          ...acc,
          [name]: width >= breakpoint,
        }), {})

        setMatches(newMatches)
      }
    }, [breakpoints])
  )

  return matches
}

// 响应式Hook
export const useResponsive = (target?: HTMLElement | null) => {
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  }

  return useContainerQuery(target, breakpoints)
}

// 高级ResizeObserver组件（支持多元素观察）
export interface AdvancedResizeObserverProps {
  /** 观察目标选择器列表 */
  targets: string[]
  /** 尺寸变化回调 */
  onResize?: (entries: ResizeObserverEntry[], target: Element) => void
  /** 是否启用 */
  enabled?: boolean
  /** 观察器选项 */
  options?: ResizeObserverOptions
}

export const AdvancedResizeObserver = forwardRef<HTMLDivElement, AdvancedResizeObserverProps>(
  ({ targets, onResize, enabled = true, options, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const observerRef = useRef<ResizeObserver | null>(null)

    useEffect(() => {
      if (!enabled || !containerRef.current) return

      // 清理之前的观察器
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      // 创建新的观察器
      observerRef.current = new window.ResizeObserver((entries) => {
        entries.forEach((entry) => {
          onResize?.([entry], entry.target)
        })
      })

      // 观察所有目标元素
      targets.forEach((selector) => {
        const elements = containerRef.current?.querySelectorAll(selector)
        elements?.forEach((element) => {
          observerRef.current?.observe(element, options)
        })
      })

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect()
        }
      }
    }, [enabled, targets, onResize, options])

    return <div ref={ref} {...props} />
  }
)

AdvancedResizeObserver.displayName = 'AdvancedResizeObserver'