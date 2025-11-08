'use client'

import React from 'react'

// 布局组件预览缩略图
export function LayoutPreviews({ componentName }: { componentName: string }) {
  switch (componentName) {
    case 'Row':
      return (
        <div className="w-full max-w-xs">
          <div className="flex space-x-2">
            <div className="flex-1 h-8 bg-blue-100 rounded flex items-center justify-center text-xs">Col 1</div>
            <div className="flex-1 h-8 bg-green-100 rounded flex items-center justify-center text-xs">Col 2</div>
            <div className="flex-1 h-8 bg-purple-100 rounded flex items-center justify-center text-xs">Col 3</div>
          </div>
        </div>
      )

    case 'Col':
      return (
        <div className="w-full max-w-xs">
          <div className="h-16 bg-blue-100 rounded flex items-center justify-center text-xs">列组件</div>
        </div>
      )

    case 'Collapse':
      return (
        <div className="w-full max-w-xs">
          <div className="border border-gray-200 rounded-md">
            <div className="px-3 py-2 text-sm bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <span>展开项 1</span>
              <span className="text-gray-400">▼</span>
            </div>
            <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-300">
              展开内容 1
            </div>
            <div className="px-3 py-2 text-sm bg-gray-50 flex items-center justify-between">
              <span>展开项 2</span>
              <span className="text-gray-400">▶</span>
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}