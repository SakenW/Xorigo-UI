/**
 * @fileoverview withLoading HOC - 加载状态高阶组件
 * @description 为组件提供加载状态管理，包括加载指示器、延迟加载和防抖动加载
 */

import React, { forwardRef, useState, useEffect, useMemo, useCallback } from 'react'
import { HOC, ComponentType } from '../types'

/**
 * 加载状态配置接口
 */
export interface LoadingConfig {
  initialLoading?: boolean
  showDelay?: number
  minDuration?: number
  loadingComponent?: React.ComponentType<{ delay: number }>
  spinnerProps?: Record<string, any>
  overlay?: boolean
  preventInteractions?: boolean
}

/**
 * 加载上下文接口
 */
export interface LoadingContextValue {
  isLoading: boolean
  loadingState: 'idle' | 'loading' | 'success' | 'error'
  startLoading: () => void
  stopLoading: (success?: boolean) => void
  setLoading: (loading: boolean, state?: 'idle' | 'loading' | 'success' | 'error') => void
  withLoading: <T extends any[], R>(
    asyncFn: (...args: T) => Promise<R>,
    successMessage?: string,
    errorMessage?: string
  ) => (...args: T) => Promise<R>
  retry: () => void
  error: Error | null
}

/**
 * 默认加载组件
 */
const DefaultLoadingSpinner: React.FC<{ delay: number }> = ({ delay }) => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999,
    }}
  >
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 2s linear infinite',
      }}
    >
      <style>
        {`@keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }`}
      </style>
    </div>
  </div>
)

/**
 * 加载遮罩组件
 */
const LoadingOverlay: React.FC<{
  isVisible: boolean
  children: React.ReactNode
  loadingComponent?: React.ComponentType<{ delay: number }>
  delay: number
}> = ({ isVisible, children, loadingComponent: LoadingComponent, delay }) => {
  if (!isVisible) return <>{children}</>

  return (
    <div style={{ position: 'relative' }}>
      {children}
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998,
          }}
        >
          {LoadingComponent ? <LoadingComponent delay={delay} /> : <DefaultLoadingSpinner delay={delay} />}
        </div>
      )}
    </div>
  )
}

/**
 * withLoading HOC - 为组件注入加载状态管理
 *
 * @param config 加载状态配置选项
 * @returns 高阶组件函数
 *
 * @example
 * ```tsx
 * const LoadingButton = withLoading({
 *   showDelay: 200,
 *   minDuration: 500,
 *   preventInteractions: true
 * })(Button)
 * ```
 */
export function withLoading<T extends Record<string, any> = {}>(
  config: LoadingConfig = {}
): HOC<T, T & LoadingContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      initialLoading = false,
      showDelay = 0,
      minDuration = 0,
      loadingComponent,
      spinnerProps = {},
      overlay = true,
      preventInteractions = false,
    } = config

    const displayName = config.displayName || `withLoading(${Component.displayName || Component.name || 'Component'})`

    const LoadingComponent = forwardRef<any, T & LoadingContextValue>((props, ref) => {
      const {
        loading: propLoading,
        onLoadingStart,
        onLoadingEnd,
        onLoadingSuccess,
        onLoadingError,
        onRetry,
        ...componentProps
      } = props

      // 内部状态
      const [internalLoading, setInternalLoading] = useState(initialLoading)
      const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
      const [error, setError] = useState<Error | null>(null)
      const [startTime, setStartTime] = useState<number>(0)

      // 计算实际加载状态
      const isLoading = useMemo(() => {
        return propLoading !== undefined ? propLoading : internalLoading
      }, [propLoading, internalLoading])

      // 加载状态变更处理
      useEffect(() => {
        if (isLoading && loadingState !== 'loading') {
          setLoadingState('loading')
          setStartTime(Date.now())
          if (onLoadingStart) {
            onLoadingStart()
          }
        } else if (!isLoading && loadingState === 'loading') {
          const duration = Date.now() - startTime
          const minDelayPromise = duration >= minDuration
            ? Promise.resolve()
            : new Promise(resolve => setTimeout(resolve, minDuration - duration))

          minDelayPromise.then(() => {
            const nextState = error ? 'error' : 'success'
            setLoadingState(nextState)

            if (onLoadingEnd) {
              onLoadingEnd(error)
            }

            if (error && onLoadingError) {
              onLoadingError(error)
            } else if (!error && onLoadingSuccess) {
              onLoadingSuccess()
            }
          })
        }
      }, [isLoading, loadingState, startTime, minDuration, error, onLoadingStart, onLoadingEnd, onLoadingSuccess, onLoadingError])

      // 开始加载
      const startLoading = useCallback(() => {
        if (propLoading === undefined) {
          setInternalLoading(true)
        }
        setError(null)
      }, [propLoading])

      // 停止加载
      const stopLoading = useCallback((success: boolean = true) => {
        if (propLoading === undefined) {
          setInternalLoading(false)
        }

        if (!success) {
          setError(new Error('Operation failed'))
        } else {
          setError(null)
        }
      }, [propLoading])

      // 设置加载状态
      const setLoading = useCallback((
        loading: boolean,
        state: 'idle' | 'loading' | 'success' | 'error' = 'idle'
      ) => {
        if (propLoading === undefined) {
          setInternalLoading(loading)
        }
        setLoadingState(state)

        if (!loading && state === 'error') {
          setError(new Error('Operation failed'))
        } else if (loading) {
          setError(null)
        }
      }, [propLoading])

      // 带加载的异步操作
      const withLoadingAsync = useCallback(
        async function<T extends any[], R>(
          asyncFn: (...args: T) => Promise<R>,
          successMessage?: string,
          errorMessage?: string
        ) {
          return async function(...args: T): Promise<R> {
            startLoading()

            try {
              const result = await asyncFn(...args)
              stopLoading(true)

              if (successMessage) {
                console.log(successMessage)
              }

              return result
            } catch (err) {
              const error = err instanceof Error ? err : new Error(String(err))
              stopLoading(false)

              if (errorMessage) {
                console.error(errorMessage, error)
              }

              throw error
            }
          }
        },
        [startLoading, stopLoading]
      )

      // 重试功能
      const retry = useCallback(() => {
        if (onRetry) {
          onRetry()
        } else {
          // 默认重试逻辑：重新加载页面或重新发起请求
          if (typeof window !== 'undefined') {
            window.location.reload()
          }
        }
      }, [onRetry])

      // 传递给组件的增强props
      const enhancedProps = {
        ...componentProps,
        isLoading,
        loadingState,
        startLoading,
        stopLoading,
        setLoading,
        withLoading: withLoadingAsync,
        retry,
        error,
        disabled: preventInteractions && isLoading ? true : componentProps.disabled,
        'aria-busy': isLoading,
        'aria-disabled': preventInteractions && isLoading ? true : undefined,
      }

      // 渲染组件或带遮罩的组件
      if (overlay) {
        return (
          <LoadingOverlay
            isVisible={isLoading}
            loadingComponent={loadingComponent}
            delay={showDelay}
          >
            <Component ref={ref} {...enhancedProps} />
          </LoadingOverlay>
        )
      }

      return <Component ref={ref} {...enhancedProps} />
    })

    LoadingComponent.displayName = displayName

    return LoadingComponent
  }
}

// 便捷导出
export const WithLoading = withLoading({})

// 预设配置
export const withDelayedLoading = withLoading({
  showDelay: 300,
  minDuration: 500,
})

export const withOverlayLoading = withLoading({
  overlay: true,
  preventInteractions: true,
  minDuration: 300,
})

export const withSpinnerLoading = withLoading({
  loadingComponent: DefaultLoadingSpinner,
  overlay: false,
})

export default withLoading
