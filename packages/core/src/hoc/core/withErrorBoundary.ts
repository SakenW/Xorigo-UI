/**
 * @fileoverview withErrorBoundary HOC - 错误边界高阶组件
 * @description 为组件提供错误边界功能，支持错误捕获、错误恢复和错误报告
 */

import React, { forwardRef, Component, ReactNode } from 'react'
import { HOC, ComponentType, ErrorBoundaryConfig } from '../types'

/**
 * 错误边界状态接口
 */
export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: string | null
  retryCount: number
}

/**
 * 错误上下文接口
 */
export interface ErrorContextValue {
  hasError: boolean
  error: Error | null
  errorInfo: string | null
  retry: () => void
  clearError: () => void
  reportError: (error: Error, errorInfo?: string) => void
  retryCount: number
}

/**
 * 默认错误Fallback组件
 */
export interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  retryCount: number
}

export const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  retryCount,
}) => (
  <div
    style={{
      padding: '2rem',
      border: '1px solid #f87171',
      borderRadius: '0.5rem',
      backgroundColor: '#fef2f2',
      color: '#991b1b',
      textAlign: 'center',
      maxWidth: '500px',
      margin: '2rem auto',
    }}
  >
    <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
      出现了一些错误
    </h2>
    <p style={{ marginBottom: '1rem', color: '#dc2626' }}>
      {error.message || '发生了未知错误'}
    </p>
    {process.env.NODE_ENV === 'development' && (
      <details style={{ marginBottom: '1rem', textAlign: 'left' }}>
        <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
          技术详情
        </summary>
        <pre
          style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            overflow: 'auto',
          }}
        >
          {error.stack}
        </pre>
      </details>
    )}
    <button
      onClick={resetError}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '0.25rem',
        cursor: 'pointer',
        fontSize: '1rem',
      }}
    >
      {retryCount > 0 ? `重试 (${retryCount})` : '重试'}
    </button>
  </div>
)

/**
 * 错误边界类组件
 */
class ErrorBoundary extends Component<{
  config: ErrorBoundaryConfig
  children: ReactNode
  displayName: string
}, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: any) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      errorInfo: errorInfo.componentStack,
    })

    // 报告错误
    if (this.props.config.onError) {
      this.props.config.onError(error, errorInfo)
    }

    // 自动重试逻辑
    if (this.state.retryCount < 3) {
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry()
      }, 2000)
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }))

    if (this.props.config.onReset) {
      this.props.config.onReset()
    }
  }

  handleClearError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const { config } = this.props
      const FallbackComponent = config.fallback || DefaultErrorFallback

      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.handleRetry}
          retryCount={this.state.retryCount}
        />
      )
    }

    return this.props.children
  }
}

/**
 * withErrorBoundary HOC - 为组件注入错误边界功能
 *
 * @param config 错误边界配置选项
 * @returns 高阶组件函数
 *
 * @example
 * ```tsx
 * const SafeComponent = withErrorBoundary({
 *   fallback: ({ error, resetError }) => <div>Error: {error.message}</div>,
 *   onError: (error, errorInfo) => console.error('Component error:', error),
 *   onReset: () => console.log('Error boundary reset')
 * })(BaseComponent)
 * ```
 */
export function withErrorBoundary<T extends Record<string, any> = {}>(
  config: ErrorBoundaryConfig = {}
): HOC<T, T & ErrorContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      fallback,
      onError,
      onReset,
    } = config

    const displayName = config.displayName || `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`

    // 创建包装组件，包含错误边界功能
    const WrappedComponent = forwardRef<any, T & ErrorContextValue>((props, ref) => {
      const {
        onError: propOnError,
        onReset: propOnReset,
        ...componentProps
      } = props

      // 内部错误状态
      const [internalError, setInternalError] = React.useState<Error | null>(null)
      const [retryCount, setRetryCount] = React.useState(0)

      // 错误处理
      const handleError = React.useCallback((error: Error, errorInfo?: string) => {
        setInternalError(error)

        if (onError) {
          onError(error, { componentStack: errorInfo })
        }

        if (propOnError) {
          propOnError(error, { componentStack: errorInfo })
        }
      }, [onError, propOnError])

      // 重试功能
      const handleRetry = React.useCallback(() => {
        setInternalError(null)
        setRetryCount(prev => prev + 1)

        if (onReset) {
          onReset()
        }

        if (propOnReset) {
          propOnReset()
        }
      }, [onReset, propOnReset])

      // 清除错误
      const handleClearError = React.useCallback(() => {
        setInternalError(null)
      }, [])

      // 报告错误
      const handleReportError = React.useCallback((error: Error, errorInfo?: string) => {
        handleError(error, errorInfo)
      }, [handleError])

      // 错误上下文
      const errorContext: ErrorContextValue = {
        hasError: !!internalError,
        error: internalError,
        errorInfo: null,
        retry: handleRetry,
        clearError: handleClearError,
        reportError: handleReportError,
        retryCount,
      }

      // 如果有错误，显示错误状态
      if (internalError) {
        const FallbackComponent = fallback || DefaultErrorFallback
        return (
          <FallbackComponent
            error={internalError}
            resetError={handleRetry}
            retryCount={retryCount}
          />
        )
      }

      return <Component ref={ref} {...componentProps} {...errorContext} />
    })

    // 包装在错误边界中
    const ErrorBoundaryComponent = forwardRef<any, T>((props, ref) => {
      return (
        <ErrorBoundary
          config={{ fallback, onError, onReset }}
          displayName={displayName}
        >
          <WrappedComponent ref={ref} {...props} />
        </ErrorBoundary>
      )
    })

    ErrorBoundaryComponent.displayName = displayName

    return ErrorBoundaryComponent
  }
}

// 便捷导出
export const WithErrorBoundary = withErrorBoundary({})

// 预设配置
export const withSilentErrorBoundary = withErrorBoundary({
  fallback: () => null,
})

export const withLoggingErrorBoundary = withErrorBoundary({
  onError: (error, errorInfo) => {
    console.error('Error caught by boundary:', error, errorInfo)
  },
})

export const withAutoRetryErrorBoundary = withErrorBoundary({
  onReset: () => {
    console.log('Auto-retrying after error...')
  },
})

export default withErrorBoundary
