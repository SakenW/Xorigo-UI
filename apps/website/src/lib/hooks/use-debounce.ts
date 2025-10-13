/**
 * ⏱️ 防抖钩子
 *
 * 用于搜索输入等场景的性能优化
 */

'use client'

import { useEffect, useState } from 'react'

/**
 * 防抖钩子
 *
 * @param value - 需要防抖的值
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的值
 *
 * @example
 * const debouncedQuery = useDebounce(query, 300)
 *
 * useEffect(() => {
 *   // 仅在用户停止输入 300ms 后触发搜索
 *   if (debouncedQuery) {
 *     search(debouncedQuery)
 *   }
 * }, [debouncedQuery])
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // 设置定时器
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // 清理函数：在值变化或组件卸载时清除定时器
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * 节流钩子
 *
 * @param value - 需要节流的值
 * @param interval - 节流间隔（毫秒）
 * @returns 节流后的值
 */
export function useThrottle<T>(value: T, interval: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now())

  useEffect(() => {
    const now = Date.now()
    const timeSinceLastUpdate = now - lastUpdate

    if (timeSinceLastUpdate >= interval) {
      setThrottledValue(value)
      setLastUpdate(now)
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value)
        setLastUpdate(Date.now())
      }, interval - timeSinceLastUpdate)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [value, interval, lastUpdate])

  return throttledValue
}
