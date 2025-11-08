'use client'

import React from 'react'

// 反馈组件预览缩略图
export function FeedbackPreviews({ componentName }: { componentName: string }) {
  switch (componentName) {
    case 'Alert':
      return (
        <div className="w-full max-w-xs space-y-2">
          <div className="p-3 bg-green-100 border border-green-400 rounded-md">
            <p className="text-sm text-green-800">✅ 成功提示信息</p>
          </div>
          <div className="p-3 bg-red-100 border border-red-400 rounded-md">
            <p className="text-sm text-red-800">❌ 错误提示信息</p>
          </div>
        </div>
      )

    case 'Message':
      return (
        <div className="w-full max-w-xs space-y-2">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">ℹ️ 这是一条信息提示</p>
          </div>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">⚠️ 这是一条警告信息</p>
          </div>
        </div>
      )

    case 'Progress':
      return (
        <div className="w-full max-w-xs space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>
      )

    case 'Spinner':
      return (
        <div className="flex gap-4">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )

    case 'Empty':
      return (
        <div className="w-full max-w-xs text-center py-6">
          <div className="text-gray-300 mb-2 text-2xl">📦</div>
          <p className="text-sm text-gray-500">暂无数据</p>
        </div>
      )

    default:
      return null
  }
}