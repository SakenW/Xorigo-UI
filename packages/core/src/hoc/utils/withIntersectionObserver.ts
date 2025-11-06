/**
 * @fileoverview withIntersectionObserver HOC - 视口监听高阶组件
 * @description 使用IntersectionObserver监听元素进入/离开视口
 */

import React, { useEffect, useRef, useCallback, useState } from 'react'
import { HOC, ComponentType } from '../types'
import { IntersectionObserverConfig } from '../types'

/**
 * 视口信息
 */
export interface IntersectionInfo {
  isIntersecting: boolean
  isVisible: boolean
  intersectionRatio: number
  intersectionRect: DOMRectReadOnly
  boundingClientRect: DOMRectReadOnly
  rootBounds: DOMRectReadOnly | null
  entry: IntersectionObserverEntry
}

/**
 * 视口观察上下文
 */
export interface IntersectionObserverContextValue {
  intersectionInfo: IntersectionInfo | null
  observe: () => void
  unobserve: () => void
  disconnect: () => void
  isObserving: boolean
}

/**
 * 默认视口观察器配置
 */
const DEFAULT_CONFIG: IntersectionObserverConfig = {
  threshold: 0,
  rootMargin: '0px',
}

/**
 * withIntersectionObserver HOC - 监听元素视口变化
 *
 * @param config 视口观察器配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const LazyImage = withIntersectionObserver({
 *   onIntersect: () => loadImage(),
 *   threshold: 0.1
 * })(BaseImage)
 * ```
 */
export function withIntersectionObserver<T extends Record<string, any> = {}>(
  config: IntersectionObserverConfig = {}
): HOC<T, T & IntersectionObserverContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      threshold = DEFAULT_CONFIG.threshold,
      rootMargin = DEFAULT_CONFIG.rootMargin,
      onIntersect,
      onEnter,
      onExit,
    } = config

    const displayName = `withIntersectionObserver(${Component.displayName || Component.name || 'Component'})`

    const IntersectionObserverComponent = React.forwardRef<any, T & IntersectionObserverContextValue>(
      (props, ref) => {
        const elementRef = useRef<HTMLElement>(null)
        const intersectionObserverRef = useRef<IntersectionObserver | null>(null)
        const previousIntersectingRef = useRef<boolean>(false)

        // 视口状态
        const [intersectionInfo, setIntersectionInfo] = useState<IntersectionInfo | null>(null)
        const [isObserving, setIsObserving] = useState(false)

        // 创建视口信息
        const createIntersectionInfo = useCallback((
          entry: IntersectionObserverEntry
        ): IntersectionInfo => {
          return {
            isIntersecting: entry.isIntersecting,
            isVisible: entry.intersectionRatio > 0,
            intersectionRatio: entry.intersectionRatio,
            intersectionRect: entry.intersectionRect,
            boundingClientRect: entry.boundingClientRect,
            rootBounds: entry.rootBounds,
            entry,
          }
        }, [])

        // 处理交叉变化
        const handleIntersection = useCallback(
          (entries: IntersectionObserverEntry[]) => {
            if (entries.length === 0) return

            const entry = entries[0]
            const info = createIntersectionInfo(entry)

            setIntersectionInfo(info)

            // 触发回调
            if (onIntersect) {
              onIntersect(entry)
            }

            // 检测进入/离开
            const wasIntersecting = previousIntersectingRef.current
            const isNowIntersecting = entry.isIntersecting

            if (!wasIntersecting && isNowIntersecting) {
              // 进入视口
              if (onEnter) {
                onEnter(entry)
              }
            } else if (wasIntersecting && !isNowIntersecting) {
              // 离开视口
              if (onExit) {
                onExit(entry)
              }
            }

            previousIntersectingRef.current = isNowIntersecting
          },
          [createIntersectionInfo, onIntersect, onEnter, onExit]
        )

        // 开始观察
        const observe = useCallback(() => {
          if (!elementRef.current || isObserving) return

          if ('IntersectionObserver' in window) {
            const rootElement = config.rootMargin ? null : undefined

            intersectionObserverRef.current = new IntersectionObserver(handleIntersection, {
              threshold,
              root: rootElement,
              rootMargin,
            })

            intersectionObserverRef.current.observe(elementRef.current)
            setIsObserving(true)
          } else {
            // 回退方案：使用scroll事件
            const handleScroll = () => {
              if (!elementRef.current) return

              const rect = elementRef.current.getBoundingClientRect()
              const isIntersecting = rect.top < window.innerHeight && rect.bottom > 0

              const fakeEntry: IntersectionObserverEntry = {
                target: elementRef.current,
                isIntersecting,
                intersectionRatio: isIntersecting ? 1 : 0,
                intersectionRect: rect,
                boundingClientRect: rect,
                rootBounds: document.documentElement.getBoundingClientRect(),
              } as IntersectionObserverEntry

              handleIntersection([fakeEntry])
            }

            // 初始检查
            handleScroll()

            // 绑定滚动事件
            window.addEventListener('scroll', handleScroll, { passive: true })
            window.addEventListener('resize', handleScroll, { passive: true })

            // 存储清理函数
            intersectionObserverRef.current = {
              disconnect: () => {
                window.removeEventListener('scroll', handleScroll)
                window.removeEventListener('resize', handleScroll)
              },
              observe: () => {},
              unobserve: () => {},
            } as any

            setIsObserving(true)
          }
        }, [handleIntersection, threshold, rootMargin, config.rootMargin, isObserving])

        // 停止观察
        const unobserve = useCallback(() => {
          if (!isObserving) return

          if (intersectionObserverRef.current) {
            if (intersectionObserverRef.current instanceof IntersectionObserver) {
              intersectionObserverRef.current.unobserve(elementRef.current!)
            }
            intersectionObserverRef.current.disconnect()
            intersectionObserverRef.current = null
          }

          setIsObserving(false)
        }, [isObserving])

        // 断开观察器
        const disconnect = useCallback(() => {
          if (intersectionObserverRef.current) {
            if (intersectionObserverRef.current instanceof IntersectionObserver) {
              intersectionObserverRef.current.disconnect()
            } else {
              intersectionObserverRef.current.disconnect()
            }
            intersectionObserverRef.current = null
          }

          setIsObserving(false)
        }, [])

        // 自动开始观察
        useEffect(() => {
          observe()

          return () => {
            disconnect()
          }
        }, [observe, disconnect])

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
          intersectionInfo,
          observe,
          unobserve,
          disconnect,
          isObserving,
        }

        return <Component {...enhancedProps} />
      }
    )

    IntersectionObserverComponent.displayName = displayName

    return IntersectionObserverComponent
  }
}

// 便捷导出
export const WithIntersectionObserver = withIntersectionObserver({})

// 预设配置
export const withLazyLoad = withIntersectionObserver({
  threshold: 0.1,
  onIntersect: (entry) => {
    const target = entry.target as HTMLElement
    const dataSrc = target.getAttribute('data-src')
    if (dataSrc) {
      target.setAttribute('src', dataSrc)
      target.removeAttribute('data-src')
    }
  },
})

export const withVisibilityObserver = withIntersectionObserver({
  threshold: 0.5,
  onEnter: (entry) => {
    console.log('Element is now visible:', entry.target)
  },
  onExit: (entry) => {
    console.log('Element is no longer visible:', entry.target)
  },
})

export const withScrollReveal = withIntersectionObserver({
  threshold: 0.1,
  rootMargin: '50px',
  onEnter: (entry) => {
    entry.target.classList.add('revealed')
  },
})

export default withIntersectionObserver
