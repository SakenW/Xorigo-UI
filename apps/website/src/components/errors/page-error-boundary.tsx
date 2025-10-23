'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

/**
 * Page ErrorBoundary - 页面级错误边界
 *
 * 特性:
 * - 捕获页面级错误
 * - 保留页面导航功能
 * - 提供页面特定的错误信息
 * - 支持错误恢复和页面跳转
 * - 美观的错误展示UI
 */

interface PageErrorBoundaryProps {
  children: ReactNode
  /** 页面名称 (用于错误提示) */
  pageName?: string
  /** 页面路径 (用于错误报告) */
  pagePath?: string
  /** 自定义降级 UI */
  fallback?: ReactNode
  /** 错误恢复回调 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface PageErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

export class PageErrorBoundary extends Component<PageErrorBoundaryProps, PageErrorBoundaryState> {
  constructor(props: PageErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
    }
  }

  static getDerivedStateFromError(error: Error): Partial<PageErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: PageErrorBoundary.generateErrorId(),
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录页面错误
    this.logPageError(error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // 调用自定义错误处理回调
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  /**
   * 生成唯一错误ID
   */
  private static generateErrorId(): string {
    return `page_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateErrorId(): string {
    return PageErrorBoundary.generateErrorId()
  }

  /**
   * 页面特定的错误日志
   */
  private logPageError(error: Error, errorInfo: ErrorInfo) {
    const { pageName, pagePath } = this.props
    const { errorId } = this.state

    // 开发环境下详细打印
    if (process.env.NODE_ENV === 'development') {
      console.group(`📄 Page ErrorBoundary - ${pageName || 'Unknown Page'}`)
      console.error('错误ID:', errorId)
      console.error('页面路径:', pagePath || window.location.pathname)
      console.error('错误:', error)
      console.error('组件堆栈:', errorInfo.componentStack)
      console.groupEnd()
    }

    // 上报到 Sentry (如果已配置)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
          page: {
            name: pageName || 'Unknown Page',
            path: pagePath || window.location.pathname,
            errorId,
          },
        },
        tags: {
          errorBoundary: 'page',
          area: 'page-level',
          pageName: pageName || 'unknown',
        },
        extra: {
          errorId,
        },
      })
    }

    // 保存错误信息到 sessionStorage 用于用户反馈
    try {
      const errorLog = {
        errorId,
        timestamp: new Date().toISOString(),
        pageName,
        pagePath: pagePath || window.location.pathname,
        error: {
          message: error.message,
          stack: error.stack,
        },
        componentStack: errorInfo.componentStack,
      }
      sessionStorage.setItem('page_error_log', JSON.stringify(errorLog))
    } catch (e) {
      // 忽略 sessionStorage 错误
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
      errorId: this.generateErrorId(),
    })
  }

  /**
   * 刷新页面
   */
  private handleRefresh = () => {
    window.location.reload()
  }

  /**
   * 返回上一页
   */
  private handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  /**
   * 返回首页
   */
  private handleGoHome = () => {
    window.location.href = '/'
  }

  /**
   * 分析页面错误并提供修复建议
   */
  private getPageErrorSuggestion(error: Error | null): string {
    if (!error) return ''

    const message = error.message.toLowerCase()

    // 页面特定错误模式
    if (message.includes('hydration')) {
      return '页面水合错误：服务端和客户端渲染的内容不一致，可能需要检查动态内容的处理方式'
    }
    if (message.includes('chunk') && message.includes('load')) {
      return '代码块加载失败：网络连接可能有问题，请尝试刷新页面或检查网络连接'
    }
    if (message.includes('network')) {
      return '网络错误：请检查网络连接，或稍后重试'
    }
    if (message.includes('permission')) {
      return '权限错误：您可能没有访问此页面的权限'
    }
    if (message.includes('not found') || message.includes('404')) {
      return '页面未找到：您访问的页面可能不存在或已被移动'
    }
    if (message.includes('timeout')) {
      return '页面加载超时：服务器响应缓慢，请稍后重试'
    }

    return '页面渲染出现问题，请尝试刷新页面或返回其他页面'
  }

  /**
   * 复制错误信息用于报告
   */
  private handleCopyErrorInfo = () => {
    const { error, errorInfo, errorId } = this.state
    const { pageName, pagePath } = this.props

    const errorText = `
错误ID: ${errorId}
页面: ${pageName || '未知页面'}
路径: ${pagePath || window.location.pathname}
时间: ${new Date().toLocaleString('zh-CN')}

错误信息: ${error?.message || '未知错误'}

${error?.stack ? `错误堆栈:\n${error.stack}` : ''}

${errorInfo?.componentStack ? `组件堆栈:\n${errorInfo.componentStack}` : ''}
    `.trim()

    navigator.clipboard.writeText(errorText).then(() => {
      // 显示复制成功提示
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50'
      toast.textContent = '错误信息已复制到剪贴板'
      document.body.appendChild(toast)
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 3000)
    }).catch(() => {
      // 复制失败，忽略
    })
  }

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义降级 UI，使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, errorInfo, errorId } = this.state
      const { pageName } = this.props
      const isDevelopment = process.env.NODE_ENV === 'development'
      const errorSuggestion = this.getPageErrorSuggestion(error)

      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden">
            {/* 错误头部 */}
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-indigo-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-1">
                    页面加载出错
                  </h1>
                  <p className="text-indigo-100 text-sm">
                    {pageName ? `${pageName} 页面遇到问题` : '当前页面渲染失败'}
                  </p>
                  <p className="text-indigo-200 text-xs mt-1">
                    错误ID: {errorId}
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
                  {error?.message || '未知页面错误'}
                </p>
              </div>

              {/* 修复建议 */}
              {errorSuggestion && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    可能的原因
                  </h3>
                  <p className="text-blue-800 text-sm">
                    {errorSuggestion}
                  </p>
                </div>
              )}

              {/* 开发模式下显示错误堆栈 */}
              {isDevelopment && errorInfo && (
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer hover:text-gray-700 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    查看错误堆栈 (开发模式)
                  </summary>
                  <pre className="mt-3 text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap font-mono bg-gray-100 p-3 rounded max-h-64">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* 操作按钮 */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={this.handleReset}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
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
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
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
                  onClick={this.handleGoBack}
                  className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
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
                      <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    返回上页
                  </span>
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
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

              {/* 复制错误信息按钮 */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={this.handleCopyErrorInfo}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium underline transition-colors"
                >
                  复制错误信息用于报告问题
                </button>
              </div>

              {/* 帮助文本 */}
              <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                <p>
                  遇到问题? 查看{' '}
                  <a href="/docs/troubleshooting" className="text-indigo-600 hover:text-indigo-800 font-medium underline">
                    故障排查指南
                  </a>
                  {' '}或{' '}
                  <a href="https://github.com/yourusername/xorigo-ui/issues" className="text-indigo-600 hover:text-indigo-800 font-medium underline">
                    报告问题
                  </a>
                  {' '}并包含错误ID: {errorId}
                </p>
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