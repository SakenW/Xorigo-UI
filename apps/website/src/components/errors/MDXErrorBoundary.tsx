'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

/**
 * MDX ErrorBoundary - MDX 文档渲染专用错误边界
 *
 * 特性:
 * - 捕获 MDX 渲染错误
 * - 显示友好的错误信息
 * - 提供文档链接
 * - 支持错误边界嵌套
 * - 显示错误发生的 MDX 文件路径
 */

interface MDXErrorBoundaryProps {
  children: ReactNode
  /** MDX 文件路径 (用于错误提示) */
  filePath?: string
  /** 自定义降级 UI */
  fallback?: ReactNode
}

interface MDXErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class MDXErrorBoundary extends Component<MDXErrorBoundaryProps, MDXErrorBoundaryState> {
  constructor(props: MDXErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<MDXErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录 MDX 错误
    this.logMDXError(error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })
  }

  /**
   * MDX 特定的错误日志
   */
  private logMDXError(error: Error, errorInfo: ErrorInfo) {
    const { filePath } = this.props

    // 开发环境下详细打印
    if (process.env.NODE_ENV === 'development') {
      console.group('📄 MDX Rendering Error')
      console.error('MDX 文件:', filePath || 'unknown')
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
          mdx: {
            filePath: filePath || 'unknown',
          },
        },
        tags: {
          errorBoundary: 'mdx',
          area: 'documentation',
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
   * 返回文档首页
   */
  private handleGoToDocs = () => {
    window.location.href = '/docs'
  }

  /**
   * 分析 MDX 错误并提供修复建议
   */
  private getMDXErrorSuggestion(error: Error | null): string {
    if (!error) return ''

    const message = error.message.toLowerCase()

    // MDX 特定错误模式
    if (message.includes('expected') && message.includes('jsx')) {
      return 'MDX 语法错误：可能是 JSX 标签未正确闭合或嵌套有误'
    }
    if (message.includes('component') && message.includes('not defined')) {
      return 'MDX 组件未定义：请检查组件是否正确导入或在 MDXComponents 中注册'
    }
    if (message.includes('frontmatter')) {
      return 'Frontmatter 解析错误：请检查 YAML 格式是否正确 (注意缩进和引号)'
    }
    if (message.includes('unexpected token')) {
      return 'MDX 语法错误：可能是在 JSX 上下文中使用了 Markdown 语法，或反之'
    }
    if (message.includes('hydration')) {
      return 'React 水合错误：服务端和客户端渲染的内容不一致，请检查动态内容的处理'
    }

    return '文档渲染出现问题，这可能是 MDX 语法错误或组件配置问题'
  }

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义降级 UI，使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, errorInfo } = this.state
      const { filePath } = this.props
      const isDevelopment = process.env.NODE_ENV === 'development'
      const errorSuggestion = this.getMDXErrorSuggestion(error)

      return (
        <div className="my-8 mx-auto max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden">
            {/* 错误头部 */}
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-amber-500"
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
                  <h2 className="text-xl font-bold text-white mb-1">
                    文档渲染出错
                  </h2>
                  <p className="text-amber-100 text-sm">
                    {filePath ? `在渲染 ${filePath} 时出现问题` : '文档内容渲染失败'}
                  </p>
                </div>
              </div>
            </div>

            {/* 错误内容 */}
            <div className="p-6 space-y-4">
              {/* 错误信息 */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2 text-sm flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  错误详情
                </h3>
                <p className="text-red-800 font-mono text-xs break-words">
                  {error?.message || '未知 MDX 渲染错误'}
                </p>
              </div>

              {/* 修复建议 */}
              {errorSuggestion && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 text-sm flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
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
                  <summary className="font-semibold text-gray-900 cursor-pointer hover:text-gray-700 text-sm">
                    查看详细堆栈 (开发模式)
                  </summary>
                  <pre className="mt-3 text-xs text-gray-700 overflow-x-auto whitespace-pre-wrap font-mono bg-gray-100 p-3 rounded max-h-48">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors shadow-sm hover:shadow-md"
                >
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1.5"
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
                  className="px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors shadow-sm hover:shadow-md"
                >
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1.5"
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
                  onClick={this.handleGoToDocs}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    返回文档
                  </span>
                </button>
              </div>

              {/* 帮助文本 */}
              <div className="text-center text-xs text-gray-600 pt-3 border-t border-gray-200">
                <p>
                  如果问题持续存在，请{' '}
                  <a href="https://github.com/yourusername/xorigo-ui/issues" className="text-amber-600 hover:text-amber-800 font-medium underline">
                    报告文档错误
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
