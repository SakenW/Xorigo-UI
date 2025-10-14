'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

// 错误监控配置
const ERROR_MONITORING_CONFIG = {
  enabled: process.env.NODE_ENV === 'production',
  endpoint: '/api/error-monitoring',
  maxRetries: 3,
  retryDelay: 1000,
  includeStack: true,
  includeComponentStack: true,
}

// 生产环境错误边界组件
export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: ErrorBoundary.generateErrorId(),
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // 发送错误报告
    this.reportError(error, errorInfo)

    // 调用自定义错误处理
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  private static generateErrorId(): string {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private generateErrorId(): string {
    return ErrorBoundary.generateErrorId()
  }

  private async reportError(error: Error, errorInfo: ErrorInfo) {
    if (!ERROR_MONITORING_CONFIG.enabled) return

    const errorData = {
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: ERROR_MONITORING_CONFIG.includeStack ? error.stack : null,
      componentStack: ERROR_MONITORING_CONFIG.includeComponentStack ? errorInfo.componentStack : null,
      url: window.location.href,
      userAgent: navigator.userAgent,
      location: {
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
      },
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_VERSION || 'unknown',
      buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || 'unknown',
      customData: this.getCustomErrorData(),
    }

    this.sendErrorReport(errorData)
  }

  private async sendErrorReport(errorData: any) {
    try {
      await fetch(ERROR_MONITORING_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      })
    } catch (error) {
      if (this.retryCount < ERROR_MONITORING_CONFIG.maxRetries) {
        this.retryCount++
        setTimeout(() => {
          this.sendErrorReport(errorData)
        }, ERROR_MONITORING_CONFIG.retryDelay * this.retryCount)
      } else {
        console.error('Failed to send error report:', error)
        console.error('Original error:', errorData)
      }
    }
  }

  private getCustomErrorData(): any {
    // 收集自定义错误数据
    const customData: any = {}

    // 内存使用情况
    if ('memory' in performance && performance.memory) {
      customData.memory = {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      }
    }

    // 网络信息
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      customData.network = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      }
    }

    // 页面加载信息
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      customData.navigation = {
        loadEventEnd: navigation.loadEventEnd,
        domContentLoadedEventEnd: navigation.domContentLoadedEventEnd,
        transferSize: navigation.transferSize,
      }
    }

    return customData
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
    })
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // 开发环境显示详细错误信息
      if (process.env.NODE_ENV === 'development') {
        return (
          <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-2xl font-bold text-red-800 mb-4">
                开发环境错误
              </h1>
              <div className="bg-red-100 border border-red-300 rounded p-4 mb-4">
                <p className="text-red-800 font-mono text-sm mb-2">
                  错误ID: {this.state.errorId}
                </p>
                <p className="text-red-800 font-mono text-sm">
                  {this.state.error?.message}
                </p>
              </div>
              <details className="mb-4">
                <summary className="cursor-pointer font-mono text-sm text-gray-700 mb-2">
                  错误堆栈
                </summary>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {this.state.error?.stack}
                </pre>
              </details>
              <details className="mb-4">
                <summary className="cursor-pointer font-mono text-sm text-gray-700 mb-2">
                  组件堆栈
                </summary>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
              <div className="flex gap-4">
                <button
                  onClick={this.handleRetry}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  重试
                </button>
                <button
                  onClick={this.handleReload}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  刷新页面
                </button>
              </div>
            </div>
          </div>
        )
      }

      // 生产环境显示用户友好的错误页面
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                出现了一些问题
              </h1>
              <p className="text-gray-600 mb-6">
                很抱歉，页面遇到了一个错误。我们已经记录了这个问题，正在努力修复。
              </p>
              <div className="text-sm text-gray-500 mb-6">
                错误编号: {this.state.errorId}
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                重试
              </button>
              <button
                onClick={this.handleReload}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                刷新页面
              </button>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                如果问题持续存在，请联系我们的技术支持团队。
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// 错误监控 Hook
export const useErrorMonitoring = () => {
  const reportError = useCallback((error: Error, context?: any) => {
    if (!ERROR_MONITORING_CONFIG.enabled) return

    const errorData = {
      errorId: ErrorBoundary.generateErrorId(),
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent,
      type: 'manual',
    }

    fetch(ERROR_MONITORING_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    }).catch(console.error)
  }, [])

  const reportCustomError = useCallback((message: string, details?: any) => {
    const error = new Error(message)
    reportError(error, details)
  }, [reportError])

  return {
    reportError,
    reportCustomError,
  }
}