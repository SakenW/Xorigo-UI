'use client'
/**
 * 🎭 断点响应式系统 - v2025.11.03
 *
 * 响应式断点定义、媒体查询工具
 * 支持断点隐藏/显示、响应式工具函数
 *
 * @version 2025.11.03
 * @category System
 * @layer system
 */

import React, { useEffect, useState } from 'react'

/**
 * 断点定义
 */
export const breakpoints = {
  xs: '0px',      // 超小屏幕
  sm: '640px',    // 小屏幕
  md: '768px',    // 中等屏幕
  lg: '1024px',   // 大屏幕
  xl: '1280px',   // 超大屏幕
  '2xl': '1536px' // 2倍超大屏幕
} as const

/**
 * 断点类型
 */
export type Breakpoint = keyof typeof breakpoints

/**
 * 屏幕尺寸接口
 */
export interface ScreenSize {
  width: number
  height: number
  breakpoint: Breakpoint
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

/**
 * 响应式值接口
 */
export interface ResponsiveValue<T> {
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  '2xl'?: T
}

/**
 * 获取当前断点
 */
export function getCurrentBreakpoint(width: number): Breakpoint {
  if (width >= 1536) return '2xl'
  if (width >= 1280) return 'xl'
  if (width >= 1024) return 'lg'
  if (width >= 768) return 'md'
  if (width >= 640) return 'sm'
  return 'xs'
}

/**
 * 获取响应式值
 */
export function getResponsiveValue<T>(
  value: ResponsiveValue<T> | T,
  currentBreakpoint: Breakpoint
): T | undefined {
  if (typeof value !== 'object' || value === null) {
    return value as T
  }

  const breakpointOrder: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs']
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint)

  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i]
    if (value[bp] !== undefined) {
      return value[bp]
    }
  }

  return undefined
}

/**
 * 创建媒体查询
 */
export function createMediaQuery(breakpoint: Breakpoint, direction: 'up' | 'down' | 'only' = 'up'): string {
  const bp = breakpoints[breakpoint]
  const minBreakpoints = Object.values(breakpoints).sort((a, b) =>
    parseInt(a) - parseInt(b)
  )
  const index = minBreakpoints.indexOf(bp)

  switch (direction) {
    case 'up':
      return `(min-width: ${bp})`
    case 'down': {
      const maxWidth = index > 0 ?
        `max-width: ${parseInt(minBreakpoints[index]) - 1}px` :
        `max-width: ${parseInt(bp) - 1}px`
      return `(${maxWidth})`
    }
    case 'only': {
      if (breakpoint === 'xs') {
        return `(max-width: ${parseInt(breakpoints.sm) - 1}px)`
      }
      const minWidth = `min-width: ${bp}`
      const maxWidth = `max-width: ${parseInt(minBreakpoints[index + 1]) - 1}px`
      return `(${minWidth}) and (${maxWidth})`
    }
    default:
      return `(min-width: ${bp})`
  }
}

/**
 * 媒体查询 Hook
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [query])

  return matches
}

/**
 * 屏幕尺寸 Hook
 */
export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        breakpoint: 'lg',
        isMobile: false,
        isTablet: false,
        isDesktop: true
      }
    }

    const width = window.innerWidth
    const height = window.innerHeight
    const breakpoint = getCurrentBreakpoint(width)

    return {
      width,
      height,
      breakpoint,
      isMobile: breakpoint === 'xs' || breakpoint === 'sm',
      isTablet: breakpoint === 'md',
      isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl'
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const breakpoint = getCurrentBreakpoint(width)

      setScreenSize({
        width,
        height,
        breakpoint,
        isMobile: breakpoint === 'xs' || breakpoint === 'sm',
        isTablet: breakpoint === 'md',
        isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl'
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return screenSize
}

/**
 * 响应式 Hook
 */
export function useResponsive<T>(value: ResponsiveValue<T> | T): T | undefined {
  const { breakpoint } = useScreenSize()
  return getResponsiveValue(value, breakpoint)
}

/**
 * 断点隐藏组件
 */
export function HiddenAt({
  breakpoint,
  children,
  above = false
}: {
  breakpoint: Breakpoint
  children: React.ReactNode
  above?: boolean
}) {
  const query = above ?
    createMediaQuery(breakpoint, 'up') :
    createMediaQuery(breakpoint, 'only')

  const shouldHide = useMediaQuery(query)

  if (shouldHide) return null
  return <>{children}</>
}

/**
 * 断点显示组件
 */
export function ShowAt({
  breakpoint,
  children,
  above = false,
  only = false
}: {
  breakpoint: Breakpoint
  children: React.ReactNode
  above?: boolean
  only?: boolean
}) {
  let query: string

  if (only) {
    query = createMediaQuery(breakpoint, 'only')
  } else if (above) {
    query = createMediaQuery(breakpoint, 'up')
  } else {
    query = createMediaQuery(breakpoint, 'only')
  }

  const shouldShow = useMediaQuery(query)

  if (!shouldShow) return null
  return <>{children}</>
}

/**
 * 移动端组件
 */
export function Mobile({ children }: { children: React.ReactNode }) {
  const { isMobile } = useScreenSize()
  if (!isMobile) return null
  return <>{children}</>
}

/**
 * 平板组件
 */
export function Tablet({ children }: { children: React.ReactNode }) {
  const { isTablet } = useScreenSize()
  if (!isTablet) return null
  return <>{children}</>
}

/**
 * 桌面端组件
 */
export function Desktop({ children }: { children: React.ReactNode }) {
  const { isDesktop } = useScreenSize()
  if (!isDesktop) return null
  return <>{children}</>
}

/**
 * 响应式工具类
 */
export class ResponsiveHelper {
  /**
   * 生成响应式 CSS 类名
   */
  static generateResponsiveClasses(
    baseClass: string,
    values: ResponsiveValue<string>
  ): string {
    const classes: string[] = []

    Object.entries(values).forEach(([breakpoint, value]) => {
      if (value) {
        const className = breakpoint === 'xs' ?
          `${baseClass}-${value}` :
          `${breakpoint}:${baseClass}-${value}`
        classes.push(className)
      }
    })

    return classes.join(' ')
  }

  /**
   * 生成响应式样式
   */
  static generateResponsiveStyles(
    property: string,
    values: ResponsiveValue<string | number>
  ): Record<string, string | number> {
    const styles: Record<string, string | number> = {}

    Object.entries(values).forEach(([breakpoint, value]) => {
      if (value !== undefined) {
        const mediaQuery = createMediaQuery(breakpoint as Breakpoint, 'up')
        styles[`@media ${mediaQuery}`] = {
          [property]: value
        }
      }
    })

    return styles
  }

  /**
   * 获取断点范围
   */
  static getBreakpointRange(breakpoint: Breakpoint): {
    min: number
    max: number
    nextBreakpoint?: Breakpoint
  } {
    const bpValue = parseInt(breakpoints[breakpoint])
    const sortedBreakpoints = Object.entries(breakpoints)
      .sort(([, a], [, b]) => parseInt(a) - parseInt(b))
      .map(([name, value]) => ({ name, value: parseInt(value) }))

    const currentIndex = sortedBreakpoints.findIndex(bp => bp.name === breakpoint)
    const nextBreakpoint = sortedBreakpoints[currentIndex + 1]

    return {
      min: bpValue,
      max: nextBreakpoint ? nextBreakpoint.value - 1 : Infinity,
      nextBreakpoint: nextBreakpoint?.name
    }
  }

  /**
   * 验证断点
   */
  static validateBreakpoint(breakpoint: string): breakpoint is Breakpoint {
    return breakpoint in breakpoints
  }

  /**
   * 获取所有断点
   */
  static getAllBreakpoints(): Breakpoint[] {
    return Object.keys(breakpoints) as Breakpoint[]
  }

  /**
   * 比较断点
   */
  static compareBreakpoints(bp1: Breakpoint, bp2: Breakpoint): -1 | 0 | 1 {
    const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
    const index1 = order.indexOf(bp1)
    const index2 = order.indexOf(bp2)

    if (index1 < index2) return -1
    if (index1 > index2) return 1
    return 0
  }

  /**
   * 检查是否为较大断点
   */
  static isLargerBreakpoint(bp1: Breakpoint, bp2: Breakpoint): boolean {
    return this.compareBreakpoints(bp1, bp2) > 0
  }

  /**
   * 检查是否为较小断点
   */
  static isSmallerBreakpoint(bp1: Breakpoint, bp2: Breakpoint): boolean {
    return this.compareBreakpoints(bp1, bp2) < 0
  }
}

/**
 * 响应式 CSS 变量生成器
 */
export function generateResponsiveCSSVariables(
  variables: Record<string, ResponsiveValue<string | number>>
): string {
  const cssRules: string[] = []

  Object.entries(variables).forEach(([varName, values]) => {
    Object.entries(values).forEach(([breakpoint, value]) => {
      if (value !== undefined) {
        const mediaQuery = createMediaQuery(breakpoint as Breakpoint, 'up')
        const cssRule = `
@media ${mediaQuery} {
  :root {
    ${varName}: ${value};
  }
}`
        cssRules.push(cssRule)
      }
    })
  })

  return cssRules.join('\n')
}