'use client'

import React from 'react'

interface ProgressRendererProps {
  percent?: number
  status?: 'normal' | 'success' | 'error' | 'active'
  showInfo?: boolean
  strokeWidth?: number
}

export default function ProgressRenderer({
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