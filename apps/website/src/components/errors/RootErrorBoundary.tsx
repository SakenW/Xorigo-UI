'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

/**
 * Root ErrorBoundary - 全局错误边界
 * 捕获应用中的所有未处理错误
 *
 * 特性:
 * - 美观的错误展示UI
 * - 错误上报机制 (Sentry)
 * - 重试和恢复选项
 * - 错误详情展示 (开发模式)
 */

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorCount: number
}

export class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // 更新状态以显示降级 UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误到错误上报服务
    this.logErrorToService(error, errorInfo)

    // 更新状态
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }))
  }

  /**
   * 错误上报机制
   */
  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // 开发环境下打印错误
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Root ErrorBoundary 捕获到错误:', error)
      console.error('错误堆栈:', errorInfo.componentStack)
    }

    // 生产环境下上报到 Sentry (如果已配置)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
        tags: {
          errorBoundary: 'root',
          errorCount: this.state.errorCount + 1,
        },
      })
    }
  }

  /**
   * 重置错误状态
   */
  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  /**
   * 刷新页面
   */
  private handleRefresh = () => {
    window.location.reload()
  }

  /**
   * 返回首页
   */
  private handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorCount } = this.state
      const isDevelopment = process.env.NODE_ENV === 'development'

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden">
            {/* 错误头部 */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-red-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-1">
                    应用遇到了一个错误
                  </h1>
                  <p className="text-red-100 text-sm">
                    我们已经记录了这个问题，正在努力修复
                  </p>
                </div>
              </div>
            </div>

            {/* 错误内容 */}
            <div className="p-6 space-y-6">
              {/* 错误信息 */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  错误详情
                </h3>
                <p className="text-red-800 font-mono text-sm break-words">
                  {error?.message || '未知错误'}
                </p>
                {errorCount > 1 && (
                  <p className="text-red-600 text-xs mt-2">
                    这个错误已经发生了 {errorCount} 次
                  </p>
                )}
              </div>

              {/* 开发模式下显示错误堆栈 */}
              {isDevelopment && errorInfo && (
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer hover:text-gray-700">
                    错误堆栈 (仅开发模式显示)
                  </summary>
                  <pre className="mt-3 text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap font-mono bg-gray-100 p-3 rounded">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    重试
                  </span>
                </button>
                <button
                  onClick={this.handleRefresh}
                  className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    刷新页面
                  </span>
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    返回首页
                  </span>
                </button>
              </div>

              {/* 帮助文本 */}
              <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                <p>如果问题持续存在,请 <a href="https://github.com/yourusername/xorigo-ui/issues" className="text-blue-600 hover:text-blue-800 font-medium underline">报告问题</a></p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Sentry 类型声明
declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error, context?: any) => void
    }
  }
}
