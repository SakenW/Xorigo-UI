/**
 * @fileoverview withResizeObserver HOC - 尺寸监听高阶组件
 * @description 使用ResizeObserver监听元素尺寸变化
 */

import React, { useEffect, useRef, useCallback, useState } from 'react'
import { HOC, ComponentType } from '../types'
import { ResizeObserverConfig } from '../types'

/**
 * 尺寸信息
 */
export interface ResizeInfo {
  width: number
  height: number
  contentBoxWidth: number
  contentBoxHeight: number
  borderBoxWidth: number
  borderBoxHeight: number
  devicePixelRatio: number
}

/**
 * 尺寸观察上下文
 */
export interface ResizeObserverContextValue {
  resizeInfo: ResizeInfo | null
  observe: () => void
  unobserve: () => void
  isObserving: boolean
  lastUpdateTime: number
}

/**
 * 默认尺寸观察器配置
 */
const DEFAULT_CONFIG: ResizeObserverConfig = {
  debounceMs: 100,
}

/**
 * withResizeObserver HOC - 监听元素尺寸变化
 *
 * @param config 尺寸观察器配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const ResponsiveComponent = withResizeObserver({
 *   onResize: (entry) => console.log('Resized:', entry.contentRect),
 *   debounceMs: 200
 * })(BaseComponent)
 * ```
 */
export function withResizeObserver<T extends Record<string, any> = {}>(
  config: ResizeObserverConfig = {}
): HOC<T, T & ResizeObserverContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      onResize,
      onResizeEnd,
      debounceMs = DEFAULT_CONFIG.debounceMs,
    } = config

    const displayName = `withResizeObserver(${Component.displayName || Component.name || 'Component'})`

    const ResizeObserverComponent = React.forwardRef<any, T & ResizeObserverContextValue>(
      (props, ref) => {
        const elementRef = useRef<HTMLElement>(null)
        const resizeObserverRef = useRef<ResizeObserver | null>(null)
        const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
        const lastUpdateTimeRef = useRef<number>(0)

        // 尺寸状态
        const [resizeInfo, setResizeInfo] = useState<ResizeInfo | null>(null)
        const [isObserving, setIsObserving] = useState(false)

        // 创建尺寸信息
        const createResizeInfo = useCallback((entry: ResizeObserverEntry): ResizeInfo => {
          const { width, height } = entry.contentRect
          const { width: borderBoxWidth, height: borderBoxHeight } = entry.borderBoxSize?.[0] || {
            width: width,
            height: height,
          }
          const { width: contentBoxWidth, height: contentBoxHeight } = entry.contentBoxSize?.[0] || {
            width: width,
            height: height,
          }

          return {
            width,
            height,
            contentBoxWidth,
            contentBoxHeight,
            borderBoxWidth,
            borderBoxHeight,
            devicePixelRatio: window.devicePixelRatio || 1,
          }
        }, [])

        // 处理尺寸变化
        const handleResize = useCallback(
          (entries: ResizeObserverEntry[]) => {
            if (entries.length === 0) return

            const entry = entries[0]
            const info = createResizeInfo(entry)
            const currentTime = Date.now()

            setResizeInfo(info)
            lastUpdateTimeRef.current = currentTime

            // 延迟调用回调
            if (resizeTimeoutRef.current) {
              clearTimeout(resizeTimeoutRef.current)
            }

            if (onResize) {
              onResize(entry)
            }

            // 延迟调用结束回调
            if (onResizeEnd) {
              resizeTimeoutRef.current = setTimeout(() => {
                if (Date.now() - lastUpdateTimeRef.current >= debounceMs) {
                  onResizeEnd(entry)
                }
              }, debounceMs)
            }
          },
          [createResizeInfo, onResize, onResizeEnd, debounceMs]
        )

        // 开始观察
        const observe = useCallback(() => {
          if (!elementRef.current || isObserving) return

          if ('ResizeObserver' in window) {
            resizeObserverRef.current = new ResizeObserver(handleResize)
            resizeObserverRef.current.observe(elementRef.current)
            setIsObserving(true)
          } else {
            // 回退到window resize事件
            const handleWindowResize = () => {
              if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect()
                const fakeEntry: ResizeObserverEntry = {
                  target: elementRef.current,
                  contentRect: rect,
                  borderBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
                  contentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
                  devicePixelRatio: window.devicePixelRatio || 1,
                } as ResizeObserverEntry

                handleResize([fakeEntry])
              }
            }

            window.addEventListener('resize', handleWindowResize)
            resizeObserverRef.current = window as any // 存储window引用以清理

            // 立即触发一次
            handleWindowResize()
            setIsObserving(true)
          }
        }, [handleResize, isObserving])

        // 停止观察
        const unobserve = useCallback(() => {
          if (!isObserving) return

          if (resizeObserverRef.current) {
            if (resizeObserverRef.current instanceof ResizeObserver) {
              resizeObserverRef.current.disconnect()
            } else {
              // 回退情况：移除window resize事件
              window.removeEventListener('resize', resizeObserverRef.current as any)
            }
            resizeObserverRef.current = null
          }

          if (resizeTimeoutRef.current) {
            clearTimeout(resizeTimeoutRef.current)
            resizeTimeoutRef.current = null
          }

          setIsObserving(false)
        }, [isObserving])

        // 自动开始观察
        useEffect(() => {
          observe()

          return () => {
            unobserve()
          }
        }, [observe, unobserve])

        // 清理资源
        useEffect(() => {
          return () => {
            if (resizeTimeoutRef.current) {
              clearTimeout(resizeTimeoutRef.current)
            }
          }
        }, [])

        // 传递给组件的增强props
        const enhancedProps = {
          ...props,
          ref: (node: HTMLElement) => {
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
            elementRef.current = node
          },
          resizeInfo,
          observe,
          unobserve,
          isObserving,
          lastUpdateTime: lastUpdateTimeRef.current,
        }

        return <Component {...enhancedProps} />
      }
    )

    ResizeObserverComponent.displayName = displayName

    return ResizeObserverComponent
  }
}

// 便捷导出
export const WithResizeObserver = withResizeObserver({})

// 预设配置
export const withDebouncedResize = withResizeObserver({
  debounceMs: 300,
  onResizeEnd: (entry) => {
    console.log('Resize ended:', entry.contentRect)
  },
})

export const withResponsiveResize = withResizeObserver({
  debounceMs: 100,
  onResize: (entry) => {
    const { width } = entry.contentRect
    // 根据宽度响应式处理
    if (width < 768) {
      console.log('Mobile view')
    } else if (width < 1024) {
      console.log('Tablet view')
    } else {
      console.log('Desktop view')
    }
  },
})

export default withResizeObserver
