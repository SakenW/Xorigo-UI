'use client'

import React, { useState, useEffect } from 'react'

// Alert Renderer
interface AlertRendererProps {
  type?: 'success' | 'warning' | 'error' | 'info'
  closable?: boolean
  showIcon?: boolean
  children?: React.ReactNode
}

export function AlertRenderer({
  type = 'info',
  closable = false,
  showIcon = true,
  children = '这是一个提示信息示例'
}: AlertRendererProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return <div className="w-full text-xs text-gray-500">提示已关闭</div>
  }

  const getTypeStyles = () => {
    const typeMap = {
      success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400',
      error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
      info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
    }
    return typeMap[type]
  }

  const getIcon = () => {
    const icons = {
      success: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    return icons[type]
  }

  return (
    <div className={`w-full p-4 border rounded-lg ${getTypeStyles()}`}>
      <div className="flex items-start">
        {showIcon && <div className="flex-shrink-0 mr-3">{getIcon()}</div>}
        <div className="flex-1">
          <div className="text-sm font-medium">{children}</div>
          <div className="text-xs mt-1 opacity-75">类型: {type} | 可关闭: {closable ? '是' : '否'}</div>
        </div>
        {closable && (
          <button
            onClick={() => setIsVisible(false)}
            className="ml-3 flex-shrink-0 hover:opacity-75"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

// Progress Renderer
interface ProgressRendererProps {
  percent?: number
  status?: 'normal' | 'success' | 'error' | 'active'
  showInfo?: boolean
  strokeWidth?: number
}

export function ProgressRenderer({
  percent = 60,
  status = 'normal',
  showInfo = true,
  strokeWidth = 8
}: ProgressRendererProps) {
  const getStatusColor = () => {
    const statusMap = {
      normal: 'bg-blue-500',
      success: 'bg-green-500',
      error: 'bg-red-500',
      active: 'bg-blue-500 animate-pulse'
    }
    return statusMap[status]
  }

  return (
    <div className="w-full">
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getStatusColor()}`}
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
        </div>
        {showInfo && (
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem] text-right">
            {percent}%
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        进度: {percent}% | 状态: {status} | 线宽: {strokeWidth}px
      </div>
    </div>
  )
}

// Spinner Renderer
interface SpinnerRendererProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  speed?: 'slow' | 'normal' | 'fast'
}

export function SpinnerRenderer({
  size = 'md',
  color = '#3B82F6',
  speed = 'normal'
}: SpinnerRendererProps) {
  const getSizeClass = () => {
    const sizeMap = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    }
    return sizeMap[size]
  }

  const getAnimationClass = () => {
    const speedMap = {
      slow: 'animate-spin-slow',
      normal: 'animate-spin',
      fast: 'animate-spin-fast'
    }
    return speedMap[speed]
  }

  return (
    <div className="w-full flex items-center justify-center space-x-3">
      <div className={`${getSizeClass()} ${getAnimationClass()}`} style={{ color }}>
        <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        加载中... | 大小: {size} | 速度: {speed}
      </div>
    </div>
  )
}