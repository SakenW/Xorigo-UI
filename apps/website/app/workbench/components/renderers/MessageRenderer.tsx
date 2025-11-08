'use client'

import React, { useState, useEffect } from 'react'

interface MessageRendererProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  content?: string
  duration?: number
  closable?: boolean
  onClose?: () => void
  updateProp?: (prop: string, value: any) => void
}

export default function MessageRenderer({
  type = 'info',
  content = '这是一条消息提示',
  duration = 3,
  closable = true,
  onClose,
  updateProp
}: MessageRendererProps) {
  const [visible, setVisible] = useState(true)
  const [countdown, setCountdown] = useState(duration)

  useEffect(() => {
    if (duration > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setVisible(false)
            if (onClose) onClose()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setVisible(false)
    if (onClose) onClose()
    if (updateProp) updateProp('visible', false)
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  if (!visible) {
    return (
      <div className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
        消息已关闭 (点击编辑模式重新打开)
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className={`
        relative flex items-start gap-3 p-4 border rounded-lg shadow-sm transition-all duration-300
        ${getTypeStyles()}
      `}>
        <div className="flex-shrink-0 text-lg">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {content}
          </p>
          {duration > 0 && (
            <p className="text-xs opacity-60 mt-1">
              {countdown}秒后自动关闭
            </p>
          )}
        </div>

        {closable && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="关闭消息"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 消息类型指示器 */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        消息类型: {type} | 可关闭: {closable ? '是' : '否'} | 自动关闭: {duration > 0 ? `${duration}秒` : '不自动'}
      </div>
    </div>
  )
}