'use client'

import React, { useState } from 'react'

interface TagRendererProps {
  color?: string
  closable?: boolean
  onClose?: () => void
  children?: React.ReactNode
}

export default function TagRenderer({
  color = '#3B82F6',
  closable = false,
  onClose,
  children = 'Tag'
}: TagRendererProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsVisible(false)
    if (onClose) onClose()
  }

  if (!isVisible) {
    return (
      <div className="w-full">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          标签已关闭
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <span
        className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white"
        style={{ backgroundColor: color }}
      >
        {children}
        {closable && (
          <button
            onClick={handleClose}
            className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </span>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        颜色: {color} | 可关闭: {closable ? '是' : '否'}
      </div>
    </div>
  )
}