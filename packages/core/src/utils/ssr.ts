/**
 * SSR (Server-Side Rendering) 兼容性工具
 *
 * 提供服务端渲染环境检测和兼容性处理功能
 */

import React from 'react'

/**
 * 检测当前是否在浏览器环境
 */
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

/**
 * 检测当前是否在服务端环境
 */
export const isServer = !isBrowser

/**
 * 检测当前是否在Node.js环境
 */
export const isNode = typeof process !== 'undefined' && process.versions?.node

/**
 * 检测当前是否支持DOM API
 */
export const hasDOM = isBrowser && typeof document !== 'undefined'

/**
 * 获取当前环境信息
 */
export const getEnvironment = () => ({
  isBrowser,
  isServer,
  isNode,
  hasDOM,
  userAgent: isBrowser ? navigator.userAgent : undefined,
  platform: isNode ? process.platform : undefined,
})

/**
 * SSR安全的 useEffect Hook
 * 在服务端不执行effect
 */
export const useSSRSafeEffect = (effect: React.EffectCallback, deps?: React.DependencyList) => {
  if (isBrowser) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(effect, deps)
  }
}

/**
 * SSR安全的 useState Hook with localStorage
 * 在服务端使用默认值，在客户端恢复localStorage值
 */
export const useSSRSafeLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] => {
  const [state, setState] = React.useState<T>(() => {
    if (isServer) {
      return defaultValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  })

  const setValue = React.useCallback((value: T) => {
    setState(value)

    if (isBrowser) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    }
  }, [key])

  return [state, setValue]
}

/**
 * SSR安全的 window 对象访问
 */
export const getWindow = () => {
  if (isBrowser) {
    return window
  }
  return null
}

/**
 * SSR安全的 document 对象访问
 */
export const getDocument = () => {
  if (isBrowser) {
    return document
  }
  return null
}

/**
 * SSR安全的导航对象访问
 */
export const getNavigator = () => {
  if (isBrowser) {
    return navigator
  }
  return null
}

/**
 * 延迟到客户端执行的函数
 */
export const deferToClient = (callback: () => void) => {
  if (isBrowser) {
    callback()
  }
}

/**
 * 客户端渲染完成后执行的函数
 */
export const useAfterHydration = (callback: () => void) => {
  const [hasHydrated, setHasHydrated] = React.useState(false)

  React.useEffect(() => {
    setHasHydrated(true)
    callback()
  }, [callback])

  return hasHydrated
}

/**
 * SSR安全的媒体查询Hook
 */
export const useSSRSafeMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    if (!isBrowser) return

    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

/**
 * SSR安全的 Intersection Observer Hook
 */
export const useSSRSafeIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [entries, setEntries] = React.useState<IntersectionObserverEntry[]>([])
  const [ref, setRef] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!isBrowser || !ref) return

    const observer = new IntersectionObserver(setEntries, options)
    observer.observe(ref)

    return () => observer.disconnect()
  }, [ref, options])

  return [setRef, entries] as const
}

/**
 * SSR安全的尺寸测量Hook
 */
export const useSSRSafeMeasure = () => {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 })
  const [ref, setRef] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!isBrowser || !ref) return

    const measure = () => {
      const { width, height } = ref.getBoundingClientRect()
      setDimensions({ width, height })
    }

    measure()

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(ref)

    return () => resizeObserver.disconnect()
  }, [ref])

  return [setRef, dimensions] as const
}

/**
 * SSR安全的错误边界组件
 */
export class SSRSafeErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (isBrowser) {
      console.error('SSRSafeErrorBoundary caught an error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

/**
 * 类型守卫：检查对象是否为Window
 */
export const isWindow = (obj: any): obj is Window => {
  return obj && obj === obj.window
}

/**
 * 类型守卫：检查对象是否为Document
 */
export const isDocument = (obj: any): obj is Document => {
  return obj && typeof obj.nodeType === 'number' && obj.nodeType === 9
}

/**
 * SSR安全的URL参数获取
 */
export const getURLParams = () => {
  if (!isBrowser) return {}

  const params = new URLSearchParams(window.location.search)
  const result: Record<string, string> = {}

  for (const [key, value] of params) {
    result[key] = value
  }

  return result
}

/**
 * SSR安全的页面标题设置
 */
export const setPageTitle = (title: string) => {
  if (isBrowser && document) {
    document.title = title
  }
}

/**
 * SSR安全的焦点管理
 */
export const useSSRSafeFocus = () => {
  const [element, setElement] = React.useState<HTMLElement | null>(null)

  const focus = React.useCallback(() => {
    if (isBrowser && element) {
      element.focus()
    }
  }, [element])

  return [setElement, focus] as const
}