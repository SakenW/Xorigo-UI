'use client'

import React from 'react'

interface DividerRendererProps {
  orientation?: 'horizontal' | 'vertical'
  dashed?: boolean
  text?: string
}

export default function DividerRenderer({
  orientation = 'horizontal',
  dashed = false,
  text = '分割线文本'
}: DividerRendererProps) {
  if (orientation === 'vertical') {
    return (
      <div className="w-full flex justify-center items-center space-x-4">
        <div className={`
          h-16 w-px
          ${dashed ? 'border-l-2 border-dashed' : 'border-l'}
          border-gray-300 dark:border-gray-600
        `} />
        <div className="text-xs text-gray-500 dark:text-gray-400">
          垂直分割线
        </div>
        <div className={`
          h-16 w-px
          ${dashed ? 'border-l-2 border-dashed' : 'border-l'}
          border-gray-300 dark:border-gray-600
        `} />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="relative">
        <div className={`
          w-full
          ${dashed ? 'border-t-2 border-dashed' : 'border-t'}
          border-gray-300 dark:border-gray-600
        `} />
        {text && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white dark:bg-gray-800 px-3 text-sm text-gray-500 dark:text-gray-400">
              {text}
            </span>
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        水平分割线 | {dashed ? '虚线' : '实线'} {text && `| 文本: ${text}`}
      </div>
    </div>
  )
}