'use client'

import { ReactNode } from 'react'

/**
 * ErrorFallback - 通用错误回退 UI 组件
 *
 * 可用于所有 ErrorBoundary 的降级显示
 * 提供简洁的错误提示和操作选项
 */

export interface ErrorFallbackProps {
  /** 错误对象 */
  error: Error | null
  /** 错误标题 */
  title?: string
  /** 错误描述 */
  description?: string
  /** 显示错误详情 */
  showErrorDetails?: boolean
  /** 重置错误回调 */
  onReset?: () => void
  /** 自定义操作按钮 */
  actions?: ReactNode
  /** 主题色调 */
  variant?: 'error' | 'warning' | 'info'
}

export function ErrorFallback({
  error,
  title = '出现错误',
  description,
  showErrorDetails = false,
  onReset,
  actions,
  variant = 'error',
}: ErrorFallbackProps) {
  const variantStyles = {
    error: {
      bg: 'from-red-500 to-orange-500',
      border: 'border-red-100',
      iconColor: 'text-red-500',
      messageBg: 'bg-red-50',
      messageBorder: 'border-red-200',
      messageText: 'text-red-900',
      linkColor: 'text-red-600 hover:text-red-800',
    },
    warning: {
      bg: 'from-amber-500 to-yellow-500',
      border: 'border-amber-100',
      iconColor: 'text-amber-500',
      messageBg: 'bg-amber-50',
      messageBorder: 'border-amber-200',
      messageText: 'text-amber-900',
      linkColor: 'text-amber-600 hover:text-amber-800',
    },
    info: {
      bg: 'from-blue-500 to-indigo-500',
      border: 'border-blue-100',
      iconColor: 'text-blue-500',
      messageBg: 'bg-blue-50',
      messageBorder: 'border-blue-200',
      messageText: 'text-blue-900',
      linkColor: 'text-blue-600 hover:text-blue-800',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className="p-4">
      <div className={`max-w-2xl mx-auto bg-white rounded-xl shadow-lg border ${styles.border} overflow-hidden`}>
        {/* 错误头部 */}
        <div className={`bg-gradient-to-r ${styles.bg} p-4`}>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg
                  className={`w-6 h-6 ${styles.iconColor}`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {variant === 'error' && (
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  )}
                  {variant === 'warning' && (
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  )}
                  {variant === 'info' && (
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              {description && (
                <p className="text-white text-opacity-90 text-sm mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 错误内容 */}
        <div className="p-4 space-y-4">
          {/* 错误信息 */}
          {error && showErrorDetails && (
            <div className={`${styles.messageBg} border ${styles.messageBorder} rounded-lg p-3`}>
              <h4 className={`font-semibold ${styles.messageText} mb-1 text-sm flex items-center`}>
                <svg
                  className="w-4 h-4 mr-2"
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
              </h4>
              <p className={`${styles.messageText} font-mono text-xs break-words`}>
                {error.message}
              </p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2">
            {onReset && (
              <button
                onClick={onReset}
                className={`flex-1 px-4 py-2 bg-gradient-to-r ${styles.bg} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm`}
              >
                <span className="flex items-center justify-center">
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
            )}
            {actions}
          </div>
        </div>
      </div>
    </div>
  )
}
