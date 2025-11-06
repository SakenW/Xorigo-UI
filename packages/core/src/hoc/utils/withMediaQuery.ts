/**
 * @fileoverview withMediaQuery HOC - 媒体查询高阶组件
 * @description 监听媒体查询变化，支持响应式设计和断点检测
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { HOC, ComponentType, MediaQueryConfig, Breakpoint, DeviceType } from '../types'

/**
 * 媒体查询信息
 */
export interface MediaQueryInfo {
  matches: boolean
  query: string
  matchesBreakpoint: Partial<Record<Breakpoint, boolean>>
  deviceType: DeviceType
  orientation: 'portrait' | 'landscape' | 'unknown'
  colorScheme: 'light' | 'dark' | 'no-preference'
  prefersReducedMotion: boolean
  prefersContrast: 'more' | 'less' | 'no-preference'
}

/**
 * 媒体查询上下文
 */
export interface MediaQueryContextValue {
  mediaInfo: MediaQueryInfo
  matches: boolean
  updateQuery: (newQuery: string) => void
  addBreakpointListener: (breakpoint: Breakpoint, callback: (matches: boolean) => void) => () => void
  removeAllListeners: () => void
}

/**
 * 预定义断点
 */
export const BREAKPOINTS: Record<Breakpoint, string> = {
  xs: '(max-width: 639px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
}

/**
 * 断点范围定义
 */
export const BREAKPOINT_RANGES: Record<Breakpoint, { min: number; max: number }> = {
  xs: { min: 0, max: 639 },
  sm: { min: 640, max: 767 },
  md: { min: 768, max: 1023 },
  lg: { min: 1024, max: 1279 },
  xl: { min: 1280, max: 1535 },
  '2xl': { min: 1536, max: Infinity },
}

/**
 * 检测设备类型
 */
function detectDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop'

  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

/**
 * 检测设备方向
 */
function detectOrientation(): 'portrait' | 'landscape' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown'

  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}

/**
 * 检测颜色方案偏好
 */
function detectColorScheme(): 'light' | 'dark' | 'no-preference' {
  if (typeof window === 'undefined') return 'no-preference'

  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    if (mediaQuery.matches) {
      return 'dark'
    }
  } catch {}

  return 'light'
}

/**
 * 检测动画偏好
 */
function detectPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    return mediaQuery.matches
  } catch {}

  return false
}

/**
 * 检测对比度偏好
 */
function detectPrefersContrast(): 'more' | 'less' | 'no-preference' {
  if (typeof window === 'undefined') return 'no-preference'

  try {
    const mediaQuery = window.matchMedia('(prefers-contrast: more)')
    if (mediaQuery.matches) return 'more'

    const mediaQueryLess = window.matchMedia('(prefers-contrast: less)')
    if (mediaQueryLess.matches) return 'less'
  } catch {}

  return 'no-preference'
}

/**
 * 创建媒体查询信息
 */
function createMediaQueryInfo(
  query: string,
  matches: boolean,
  mediaQueryList: MediaQueryList | null
): MediaQueryInfo {
  const deviceType = detectDeviceType()
  const orientation = detectOrientation()
  const colorScheme = detectColorScheme()
  const prefersReducedMotion = detectPrefersReducedMotion()
  const prefersContrast = detectPrefersContrast()

  // 检测所有断点匹配
  const matchesBreakpoint = Object.entries(BREAKPOINTS).reduce(
    (acc, [breakpoint, breakpointQuery]) => {
      try {
        const mediaQuery = window.matchMedia(breakpointQuery)
        acc[breakpoint as Breakpoint] = mediaQuery.matches
      } catch {
        acc[breakpoint as Breakpoint] = false
      }
      return acc
    },
    {} as Partial<Record<Breakpoint, boolean>>
  )

  return {
    matches,
    query,
    matchesBreakpoint,
    deviceType,
    orientation,
    colorScheme,
    prefersReducedMotion,
    prefersContrast,
  }
}

/**
 * withMediaQuery HOC - 监听媒体查询变化
 *
 * @param config 媒体查询配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const ResponsiveComponent = withMediaQuery({
 *   query: '(min-width: 768px)',
 *   onMatch: () => console.log('Desktop view'),
 *   onUnmatch: () => console.log('Mobile view')
 * })(BaseComponent)
 * ```
 */
export function withMediaQuery<T extends Record<string, any> = {}>(
  config: MediaQueryConfig
): HOC<T, T & MediaQueryContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      query,
      onMatch,
      onUnmatch,
      debounceMs = 0,
    } = config

    const displayName = `withMediaQuery(${Component.displayName || Component.name || 'Component'})`

    const MediaQueryComponent = React.forwardRef<any, T & MediaQueryContextValue>(
      (props, ref) => {
        const [mediaInfo, setMediaInfo] = useState<MediaQueryInfo>(() =>
          createMediaQueryInfo(query, false, null)
        )
        const [matches, setMatches] = useState(false)
        const mediaQueryRef = useRef<MediaQueryList | null>(null)
        const timeoutRef = useRef<NodeJS.Timeout | null>(null)
        const breakpointListenersRef = useRef<Map<Breakpoint, Set<(matches: boolean) => void>>>(new Map())

        // 更新媒体查询
        const updateQuery = useCallback(
          (newQuery: string) => {
            if (mediaQueryRef.current) {
              mediaQueryRef.current.removeEventListener('change', handleChange)
            }

            try {
              mediaQueryRef.current = window.matchMedia(newQuery)
            } catch (error) {
              console.error('Invalid media query:', newQuery, error)
              return
            }

            mediaQueryRef.current.addEventListener('change', handleChange)
            handleChange(mediaQueryRef.current)
          },
          []
        )

        // 处理媒体查询变化
        const handleChange = useCallback(
          (event: MediaQueryListEvent | MediaQueryList) => {
            const currentMatches = event.matches

            if (debounceMs > 0) {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
              }

              timeoutRef.current = setTimeout(() => {
                setMatches(currentMatches)
                setMediaInfo(createMediaQueryInfo(query, currentMatches, event as MediaQueryList))

                if (currentMatches) {
                  onMatch?.()
                } else {
                  onUnmatch?.()
                }

                // 触发断点监听器
                Object.entries(mediaInfo.matchesBreakpoint).forEach(([breakpoint, breakpointMatches]) => {
                  const listeners = breakpointListenersRef.current.get(breakpoint as Breakpoint)
                  if (listeners) {
                    listeners.forEach(callback => callback(breakpointMatches || false))
                  }
                })
              }, debounceMs)
            } else {
              setMatches(currentMatches)
              setMediaInfo(createMediaQueryInfo(query, currentMatches, event as MediaQueryList))

              if (currentMatches) {
                onMatch?.()
              } else {
                onUnmatch?.()
              }

              // 触发断点监听器
              Object.entries(mediaInfo.matchesBreakpoint).forEach(([breakpoint, breakpointMatches]) => {
                const listeners = breakpointListenersRef.current.get(breakpoint as Breakpoint)
                if (listeners) {
                  listeners.forEach(callback => callback(breakpointMatches || false))
                }
              })
            }
          },
          [query, debounceMs, onMatch, onUnmatch, mediaInfo.matchesBreakpoint]
        )

        // 添加断点监听器
        const addBreakpointListener = useCallback(
          (breakpoint: Breakpoint, callback: (matches: boolean) => void) => {
            if (!breakpointListenersRef.current.has(breakpoint)) {
              breakpointListenersRef.current.set(breakpoint, new Set())
            }

            const listeners = breakpointListenersRef.current.get(breakpoint)!
            listeners.add(callback)

            // 立即触发一次
            const isMatched = mediaInfo.matchesBreakpoint[breakpoint] || false
            callback(isMatched)

            // 返回清理函数
            return () => {
              listeners.delete(callback)
              if (listeners.size === 0) {
                breakpointListenersRef.current.delete(breakpoint)
              }
            }
          },
          [mediaInfo.matchesBreakpoint]
        )

        // 移除所有监听器
        const removeAllListeners = useCallback(() => {
          breakpointListenersRef.current.clear()
        }, [])

        // 初始化媒体查询
        useEffect(() => {
          if (typeof window === 'undefined') return

          try {
            mediaQueryRef.current = window.matchMedia(query)
          } catch (error) {
            console.error('Invalid media query:', query, error)
            return
          }

          // 立即检查一次
          handleChange(mediaQueryRef.current)

          // 绑定监听器
          if (mediaQueryRef.current) {
            mediaQueryRef.current.addEventListener('change', handleChange)
          }

          return () => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
            }

            if (mediaQueryRef.current) {
              mediaQueryRef.current.removeEventListener('change', handleChange)
            }
          }
        }, [query, handleChange])

        // 清理
        useEffect(() => {
          return () => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
            }
          }
        }, [])

        // 传递给组件的增强props
        const enhancedProps = {
          ...props,
          ref,
          mediaInfo,
          matches,
          updateQuery,
          addBreakpointListener,
          removeAllListeners,
        }

        return <Component {...enhancedProps} />
      }
    )

    MediaQueryComponent.displayName = displayName

    return MediaQueryComponent
  }
}

// 便捷导出
export const WithMediaQuery = withMediaQuery

// 预设配置
export const withResponsive = withMediaQuery({
  query: BREAKPOINTS.md,
})

export const withMobileQuery = withMediaQuery({
  query: BREAKPOINTS.xs,
})

export const withTabletQuery = withMediaQuery({
  query: '(min-width: 768px) and (max-width: 1023px)',
})

export const withDarkModeQuery = withMediaQuery({
  query: '(prefers-color-scheme: dark)',
})

export const withReducedMotionQuery = withMediaQuery({
  query: '(prefers-reduced-motion: reduce)',
})

export default withMediaQuery
