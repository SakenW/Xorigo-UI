import React, { forwardRef, useEffect, useState } from 'react'

export interface SSRBoundaryProps {
  /** 子元素 */
  children: React.ReactNode
  /** 服务端渲染时的fallback内容 */
  fallback?: React.ReactNode
  /** 客户端渲染时的fallback内容 */
  clientFallback?: React.ReactNode
  /** 延迟渲染时间(ms) */
  delay?: number
  /** 是否禁用服务端渲染 */
  disableSSR?: boolean
  /** 是否启用客户端hydration */
  enableHydration?: boolean
  /** hydration完成回调 */
  onHydrated?: () => void
  /** 错误边界回调 */
  onError?: (error: Error) => void
  /** 自定义容器类名 */
  className?: string
}

interface SSRBoundaryState {
  isClient: boolean
  isHydrated: boolean
  hasError: boolean
  error: Error | null
}

export const SSRBoundary = forwardRef<HTMLDivElement, SSRBoundaryProps>(
  ({
    children,
    fallback = null,
    clientFallback = null,
    delay = 0,
    disableSSR = false,
    enableHydration = true,
    onHydrated,
    onError,
    className,
    ...props
  }, ref) => {
    const [state, setState] = useState<SSRBoundaryState>({
      isClient: false,
      isHydrated: false,
      hasError: false,
      error: null,
    })

    // 检测客户端环境
    useEffect(() => {
      setState(prev => ({ ...prev, isClient: true }))

      // 延迟渲染
      if (delay > 0) {
        const timer = setTimeout(() => {
          setState(prev => ({ ...prev, isHydrated: true }))
          onHydrated?.()
        }, delay)

        return () => clearTimeout(timer)
      } else {
        setState(prev => ({ ...prev, isHydrated: true }))
        onHydrated?.()
      }
    }, [delay, onHydrated])

    // 错误处理
    useEffect(() => {
      const handleError = (event: ErrorEvent) => {
        setState(prev => ({
          ...prev,
          hasError: true,
          error: event.error
        }))
        onError?.(event.error)
      }

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        setState(prev => ({
          ...prev,
          hasError: true,
          error: new Error(event.reason)
        }))
        onError?.(new Error(event.reason))
      }

      window.addEventListener('error', handleError)
      window.addEventListener('unhandledrejection', handleUnhandledRejection)

      return () => {
        window.removeEventListener('error', handleError)
        window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      }
    }, [onError])

    // 渲染逻辑
    const renderContent = () => {
      // 如果有错误
      if (state.hasError) {
        return (
          <div className="text-red-500 p-4 border border-red-200 rounded-md">
            <h3 className="font-semibold mb-2">渲染错误</h3>
            <p className="text-sm">{state.error?.message || '未知错误'}</p>
          </div>
        )
      }

      // 服务端渲染阶段
      if (!state.isClient) {
        if (disableSSR) {
          return null
        }
        return fallback
      }

      // 客户端渲染阶段
      if (!state.isHydrated) {
        if (clientFallback) {
          return clientFallback
        }
        return fallback
      }

      // 正常渲染
      return children
    }

    return (
      <div ref={ref} className={className} {...props}>
        {renderContent()}
      </div>
    )
  }
)

SSRBoundary.displayName = 'SSRBoundary'

// 客户端专用组件
export interface ClientOnlyProps extends Omit<SSRBoundaryProps, 'fallback' | 'disableSSR'> {
  /** 客户端渲染前的fallback */
  fallback?: React.ReactNode
}

export const ClientOnly = forwardRef<HTMLDivElement, ClientOnlyProps>(
  ({ fallback = null, ...props }, ref) => (
    <SSRBoundary
      ref={ref}
      disableSSR
      fallback={fallback}
      {...props}
    />
  )
)

ClientOnly.displayName = 'ClientOnly'

// 服务端专用组件
export interface ServerOnlyProps extends Omit<SSRBoundaryProps, 'clientFallback' | 'enableHydration'> {
  /** 子元素 */
  children: React.ReactNode
  /** 客户端渲染时的fallback */
  clientFallback?: React.ReactNode
}

export const ServerOnly = forwardRef<HTMLDivElement, ServerOnlyProps>(
  ({ children, clientFallback = null, ...props }, ref) => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
      setIsClient(true)
    }, [])

    return (
      <div ref={ref} {...props}>
        {isClient ? clientFallback : children}
      </div>
    )
  }
)

ServerOnly.displayName = 'ServerOnly'

// 延迟渲染组件
export interface DelayRenderProps extends Omit<SSRBoundaryProps, 'children' | 'delay'> {
  /** 延迟时间(ms) */
  delay: number
  /** 子元素 */
  children: React.ReactNode
  /** 延迟期间显示的内容 */
  placeholder?: React.ReactNode
}

export const DelayRender = forwardRef<HTMLDivElement, DelayRenderProps>(
  ({ delay, children, placeholder, ...props }, ref) => {
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
      const timer = setTimeout(() => {
        setShouldRender(true)
      }, delay)

      return () => clearTimeout(timer)
    }, [delay])

    return (
      <div ref={ref} {...props}>
        {shouldRender ? children : placeholder}
      </div>
    )
  }
)

DelayRender.displayName = 'DelayRender'

// 条件渲染组件
export interface ConditionalRenderProps {
  /** 条件 */
  condition: boolean
  /** 条件为真时渲染的内容 */
  children: React.ReactNode
  /** 条件为假时渲染的内容 */
  fallback?: React.ReactNode
  /** 延迟渲染时间(ms) */
  delay?: number
}

export const ConditionalRender = forwardRef<HTMLDivElement, ConditionalRenderProps>(
  ({ condition, children, fallback = null, delay = 0, ...props }, ref) => {
    const [shouldShow, setShouldShow] = useState(false)

    useEffect(() => {
      const timer = setTimeout(() => {
        setShouldShow(true)
      }, delay)

      return () => clearTimeout(timer)
    }, [delay])

    return (
      <div ref={ref} {...props}>
        {shouldShow && condition ? children : fallback}
      </div>
    )
  }
)

ConditionalRender.displayName = 'ConditionalRender'

// 环境检测组件
export interface EnvironmentDetectionProps {
  /** 开发环境渲染的内容 */
  development?: React.ReactNode
  /** 生产环境渲染的内容 */
  production?: React.ReactNode
  /** 测试环境渲染的内容 */
  test?: React.ReactNode
  /** 默认内容 */
  fallback?: React.ReactNode
}

export const EnvironmentDetection = forwardRef<HTMLDivElement, EnvironmentDetectionProps>(
  ({ development, production, test, fallback, ...props }, ref) => {
    const getEnvironment = () => {
      if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
        return process.env.NODE_ENV
      }
      return 'production'
    }

    const environment = getEnvironment()

    const renderContent = () => {
      switch (environment) {
        case 'development':
          return development || fallback
        case 'production':
          return production || fallback
        case 'test':
          return test || fallback
        default:
          return fallback
      }
    }

    return (
      <div ref={ref} {...props}>
        {renderContent()}
      </div>
    )
  }
)

EnvironmentDetection.displayName = 'EnvironmentDetection'

// Hydration检测组件
export interface HydrationDetectorProps {
  /** Hydration完成前显示的内容 */
  beforeHydration?: React.ReactNode
  /** Hydration完成后显示的内容 */
  afterHydration?: React.ReactNode
  /** Hydration完成回调 */
  onHydrated?: () => void
  /** Hydration超时时间(ms) */
  timeout?: number
}

export const HydrationDetector = forwardRef<HTMLDivElement, HydrationDetectorProps>(
  ({ beforeHydration, afterHydration, onHydrated, timeout = 5000, ...props }, ref) => {
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
      // 检测hydration完成
      const checkHydration = () => {
        setIsHydrated(true)
        onHydrated?.()
      }

      // 延迟检测，确保hydration完成
      const timer = setTimeout(checkHydration, 100)

      // 超时处理
      const timeoutTimer = setTimeout(() => {
        if (!isHydrated) {
          console.warn('Hydration检测超时')
          setIsHydrated(true)
          onHydrated?.()
        }
      }, timeout)

      return () => {
        clearTimeout(timer)
        clearTimeout(timeoutTimer)
      }
    }, [onHydrated, timeout, isHydrated])

    return (
      <div ref={ref} {...props}>
        {isHydrated ? afterHydration : beforeHydration}
      </div>
    )
  }
)

HydrationDetector.displayName = 'HydrationDetector'