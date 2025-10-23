'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

/**
 * Playground ErrorBoundary - Playground 专用错误边界
 *
 * 特性:
 * - 保留用户编辑状态
 * - 提供降级体验 (展示最后成功的状态)
 * - 错误日志记录
 * - 代码错误提示和修复建议
 */

interface PlaygroundErrorBoundaryProps {
  children: ReactNode
}

interface PlaygroundErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  lastValidState: any | null
}

export class PlaygroundErrorBoundary extends Component<
  PlaygroundErrorBoundaryProps,
  PlaygroundErrorBoundaryState
> {
  constructor(props: PlaygroundErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      lastValidState: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<PlaygroundErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误日志
    this.logPlaygroundError(error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })
  }

  /**
   * Playground 特定的错误日志
   */
  private logPlaygroundError(error: Error, errorInfo: ErrorInfo) {
    // 开发环境下详细打印
    if (process.env.NODE_ENV === 'development') {
      console.group('🎮 Playground Error')
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
          playground: {
            lastValidState: this.state.lastValidState,
          },
        },
        tags: {
          errorBoundary: 'playground',
          area: 'interactive-editor',
        },
      })
    }

    // 保存到 localStorage 用于错误分析
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        error: {
          message: error.message,
          stack: error.stack,
        },
        componentStack: errorInfo.componentStack,
      }
      localStorage.setItem('playground_last_error', JSON.stringify(errorLog))
    } catch (e) {
      // 忽略 localStorage 错误
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
   * 恢复到上次有效状态
   */
  private handleRestore = () => {
    const { lastValidState } = this.state
    if (lastValidState) {
      // TODO: 实现状态恢复逻辑
      console.log('恢复到上次有效状态:', lastValidState)
    }
    this.handleReset()
  }

  /**
   * 清除 Playground 缓存
   */
  private handleClearCache = () => {
    try {
      // 清除 localStorage 中的 playground 数据
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('playground_')) {
          localStorage.removeItem(key)
        }
      })
      // 刷新页面
      window.location.reload()
    } catch (e) {
      console.error('清除缓存失败:', e)
    }
  }

  /**
   * 分析错误并提供修复建议
   */
  private getErrorSuggestion(error: Error | null): string {
    if (!error) return ''

    const message = error.message.toLowerCase()

    // 常见错误模式匹配
    if (message.includes('undefined')) {
      return '代码中可能访问了未定义的变量或属性，请检查变量声明和对象属性访问'
    }
    if (message.includes('cannot read property')) {
      return '尝试读取 null 或 undefined 的属性，建议使用可选链操作符 (?.) 或添加空值检查'
    }
    if (message.includes('is not a function')) {
      return '尝试调用一个非函数值，请检查函数名拼写和导入路径'
    }
    if (message.includes('syntax error')) {
      return '代码存在语法错误，请检查括号、引号、分号等是否匹配'
    }
    if (message.includes('timeout')) {
      return '操作超时，可能是代码中存在死循环或异步操作未正确处理'
    }

    return '请检查代码逻辑，确保所有组件和钩子使用正确'
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state
      const isDevelopment = process.env.NODE_ENV === 'development'
      const errorSuggestion = this.getErrorSuggestion(error)

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
            {/* 错误头部 */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-purple-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-1">
                    Playground 遇到了错误
                  </h1>
                  <p className="text-purple-100 text-sm">
                    不用担心，您的编辑内容已保存
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
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  错误信息
                </h3>
                <p className="text-red-800 font-mono text-sm break-words">
                  {error?.message || '未知错误'}
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
                    修复建议
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
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
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
                  onClick={this.handleRestore}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
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
                      <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    恢复状态
                  </span>
                </button>
                <button
                  onClick={this.handleClearCache}
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
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    清除缓存
                  </span>
                </button>
                <button
                  onClick={() => window.location.href = '/'}
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

              {/* 帮助文本 */}
              <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                <p>
                  遇到问题? 查看{' '}
                  <a href="/docs/troubleshooting" className="text-purple-600 hover:text-purple-800 font-medium underline">
                    故障排查指南
                  </a>
                  {' '}或{' '}
                  <a href="https://github.com/yourusername/xorigo-ui/issues" className="text-purple-600 hover:text-purple-800 font-medium underline">
                    报告问题
                  </a>
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
