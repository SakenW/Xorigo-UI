/**
 * @fileoverview withDebounce HOC - 防抖高阶组件
 * @description 为组件和方法提供防抖功能，优化性能
 */

import React, { useRef, useCallback } from 'react'
import { HOC, ComponentType } from '../types'

/**
 * 防抖配置
 */
export interface DebounceConfig {
  /**
   * 延迟时间（毫秒）
   */
  delay: number

  /**
   * 是否在防抖前执行一次
   */
  immediate?: boolean

  /**
   * 最大等待时间
   */
  maxWait?: number

  /**
   * 防抖回调函数
   */
  callback: (...args: any[]) => any
}

/**
 * 防抖上下文
 */
export interface DebounceContextValue {
  /**
   * 防抖执行函数
   */
  debounce: (...args: any[]) => void

  /**
   * 立即执行（忽略防抖）
   */
  flush: () => void

  /**
   * 取消防抖
   */
  cancel: () => void

  /**
   * 检查是否有待执行的函数
   */
  isPending: () => boolean
}

/**
 * 创建防抖函数
 */
function createDebounce(
  func: (...args: any[]) => any,
  delay: number,
  immediate = false
) {
  let timeout: NodeJS.Timeout | null = null
  let lastCallTime = 0
  let lastInvokeTime = 0
  let maxWait: number | null = null

  const later = () => {
    const time = Date.now()
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    // 检查是否应该立即执行
    if (immediate && !timeout) {
      lastInvokeTime = time
      func()
      return
    }

    // 继续等待
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        lastInvokeTime = time
        func()
      }, delay)
    } else {
      // 重置定时器
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        timeout = null
        lastInvokeTime = time
        func()
      }, delay - timeSinceLastCall + (maxWait ? timeSinceLastInvoke : 0))
    }
  }

  const debounced = function(...args: any[]) {
    const time = Date.now()
    const isInvoking = immediate && !timeout

    lastCallTime = time

    if (isInvoking) {
      lastInvokeTime = time
      func()
    }

    later()
  }

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    maxWait = null
    lastCallTime = 0
    lastInvokeTime = 0
  }

  debounced.flush = () => {
    return timeout ? func() : undefined
  }

  debounced.isPending = () => {
    return timeout !== null
  }

  return debounced
}

/**
 * withDebounce HOC - 提供防抖功能
 *
 * @param config 防抖配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const DebouncedInput = withDebounce({
 *   delay: 300,
 *   callback: (value) => search(value)
 * })(Input)
 * ```
 */
export function withDebounce<T extends Record<string, any> = {}>(
  config: DebounceConfig
): HOC<T, T & DebounceContextValue> {
  return function(Component: ComponentType<T>) {
    const { delay, immediate = false, callback } = config

    const displayName = `withDebounce(${Component.displayName || Component.name || 'Component'})`

    const DebounceComponent = React.forwardRef<any, T & DebounceContextValue>(
      (props, ref) => {
        const debouncedRef = useRef<any>(null)

        // 创建防抖函数
        const createDebounced = useCallback(() => {
          if (debouncedRef.current?.cancel) {
            debouncedRef.current.cancel()
          }

          debouncedRef.current = createDebounce(
            callback,
            delay,
            immediate
          )

          return debouncedRef.current
        }, [delay, immediate, callback])

        // 立即创建防抖函数
        React.useEffect(() => {
          createDebounced()
        }, [createDebounced])

        // 防抖执行
        const debounce = useCallback((...args: any[]) => {
          if (!debouncedRef.current) {
            debouncedRef.current = createDebounce(callback, delay, immediate)
          }
          return debouncedRef.current(...args)
        }, [callback, delay, immediate, createDebounced])

        // 立即执行
        const flush = useCallback(() => {
          if (debouncedRef.current?.flush) {
            return debouncedRef.current.flush()
          }
        }, [])

        // 取消防抖
        const cancel = useCallback(() => {
          if (debouncedRef.current?.cancel) {
            debouncedRef.current.cancel()
          }
        }, [])

        // 检查是否有待执行
        const isPending = useCallback(() => {
          return debouncedRef.current?.isPending?.() || false
        }, [])

        // 传递给组件的增强props
        const enhancedProps = {
          ...props,
          ref,
          debounce,
          flush,
          cancel,
          isPending,
        }

        return <Component {...enhancedProps} />
      }
    )

    DebounceComponent.displayName = displayName

    return DebounceComponent
  }
}

// 便捷导出
export const WithDebounce = withDebounce

// 预设防抖配置
export const withQuickDebounce = withDebounce({
  delay: 100,
  callback: () => {},
})

export const withMediumDebounce = withDebounce({
  delay: 300,
  callback: () => {},
})

export const withSlowDebounce = withDebounce({
  delay: 1000,
  callback: () => {},
})

export default withDebounce
