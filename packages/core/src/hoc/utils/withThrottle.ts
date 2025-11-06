/**
 * @fileoverview withThrottle HOC - 节流高阶组件
 * @description 为组件和方法提供节流功能，限制执行频率
 */

import React, { useRef, useCallback } from 'react'
import { HOC, ComponentType } from '../types'

/**
 * 节流配置
 */
export interface ThrottleConfig {
  /**
   * 节流间隔（毫秒）
   */
  interval: number

  /**
   * 是否在开始时立即执行一次
   */
  immediate?: boolean

  /**
   * 节流回调函数
   */
  callback: (...args: any[]) => any

  /**
   * 是否等待执行
   */
  waitForLast?: boolean
}

/**
 * 节流上下文
 */
export interface ThrottleContextValue {
  /**
   * 节流执行函数
   */
  throttle: (...args: any[]) => void

  /**
   * 立即执行（忽略节流）
   */
  flush: () => void

  /**
   * 取消节流
   */
  cancel: () => void

  /**
   * 检查是否在节流中
   */
  isThrottled: () => boolean
}

/**
 * 创建节流函数
 */
function createThrottle(
  func: (...args: any[]) => any,
  interval: number,
  immediate = true,
  waitForLast = false
) {
  let lastCallTime = 0
  let timeout: NodeJS.Timeout | null = null
  let lastInvokeTime = 0
  let result: any

  const invoke = (time: number, args?: any[]) => {
    lastInvokeTime = time
    const context = this
    result = func.apply(context, args || [])
    return result
  }

  const remaining = (time: number) => {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = interval - timeSinceLastCall
    return timeWaiting
  }

  const shouldInvoke = (time: number) => {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    // 首次调用或间隔时间已到
    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= interval ||
      timeSinceLastCall < 0
    )
  }

  const trailing = (time: number) => {
    timeout = null

    // 如果需要等待最后一次执行
    if (waitForLast && lastCallTime !== 0) {
      return invoke(time)
    }

    return result
  }

  const throttled = function(...args: any[]) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastCallTime = time

    if (isInvoking) {
      if (timeout === null) {
        const startTimeForLastCall = lastCallTime
        timeout = setTimeout(() => {
          const time = Date.now()

          if (shouldInvoke(time)) {
            return trailing(time)
          }

          timeout = null
        }, interval)

        if (immediate) {
          return invoke(time, args)
        }
      }
    }

    // 如果没有立即执行且有定时器，则等待
    if (timeout === null) {
      timeout = setTimeout(() => {
        const time = Date.now()

        if (shouldInvoke(time) || time - lastCallTime >= interval) {
          return trailing(time)
        }

        timeout = null
      }, interval)
    }

    return result
  }

  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    lastCallTime = 0
    lastInvokeTime = 0
  }

  throttled.flush = () => {
    return timeout === null ? result : invoke(Date.now())
  }

  throttled.isThrottled = () => {
    return timeout !== null
  }

  return throttled
}

/**
 * withThrottle HOC - 提供节流功能
 *
 * @param config 节流配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const ThrottledScroll = withThrottle({
 *   interval: 100,
 *   callback: (event) => handleScroll(event)
 * })(ScrollHandler)
 * ```
 */
export function withThrottle<T extends Record<string, any> = {}>(
  config: ThrottleConfig
): HOC<T, T & ThrottleContextValue> {
  return function(Component: ComponentType<T>) {
    const { interval, immediate = true, callback, waitForLast = false } = config

    const displayName = `withThrottle(${Component.displayName || Component.name || 'Component'})`

    const ThrottleComponent = React.forwardRef<any, T & ThrottleContextValue>(
      (props, ref) => {
        const throttledRef = useRef<any>(null)

        // 创建节流函数
        const createThrottled = useCallback(() => {
          if (throttledRef.current?.cancel) {
            throttledRef.current.cancel()
          }

          throttledRef.current = createThrottle(
            callback,
            interval,
            immediate,
            waitForLast
          )

          return throttledRef.current
        }, [interval, immediate, callback, waitForLast])

        // 立即创建节流函数
        React.useEffect(() => {
          createThrottled()
        }, [createThrottled])

        // 节流执行
        const throttle = useCallback((...args: any[]) => {
          if (!throttledRef.current) {
            throttledRef.current = createThrottle(callback, interval, immediate, waitForLast)
          }
          return throttledRef.current(...args)
        }, [callback, interval, immediate, waitForLast, createThrottled])

        // 立即执行
        const flush = useCallback(() => {
          if (throttledRef.current?.flush) {
            return throttledRef.current.flush()
          }
        }, [])

        // 取消节流
        const cancel = useCallback(() => {
          if (throttledRef.current?.cancel) {
            throttledRef.current.cancel()
          }
        }, [])

        // 检查是否在节流中
        const isThrottled = useCallback(() => {
          return throttledRef.current?.isThrottled?.() || false
        }, [])

        // 传递给组件的增强props
        const enhancedProps = {
          ...props,
          ref,
          throttle,
          flush,
          cancel,
          isThrottled,
        }

        return <Component {...enhancedProps} />
      }
    )

    ThrottleComponent.displayName = displayName

    return ThrottleComponent
  }
}

// 便捷导出
export const WithThrottle = withThrottle

// 预设节流配置
export const withFastThrottle = withThrottle({
  interval: 50,
  callback: () => {},
})

export const withMediumThrottle = withThrottle({
  interval: 100,
  callback: () => {},
})

export const withSlowThrottle = withThrottle({
  interval: 500,
  callback: () => {},
})

export default withThrottle
