'use client'

import React from 'react'

// 展示组件预览缩略图
export function DisplayPreviews({ componentName }: { componentName: string }) {
  switch (componentName) {
    case 'Heading':
      return (
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">一级标题</h1>
          <h2 className="text-xl font-semibold text-gray-800">二级标题</h2>
          <h3 className="text-lg font-medium text-gray-700">三级标题</h3>
        </div>
      )

    case 'Text':
      return (
        <div className="w-full max-w-xs space-y-1">
          <p className="text-sm text-gray-600">这是一段普通文本内容</p>
          <p className="text-sm font-semibold text-gray-800">这是加粗文本</p>
          <p className="text-xs text-gray-500">这是小号文本</p>
        </div>
      )

    case 'Label':
      return (
        <div className="w-full max-w-xs space-y-2">
          <label className="text-sm font-medium text-gray-700">用户名</label>
          <label className="text-sm text-gray-600">邮箱地址</label>
          <label className="text-sm text-red-600">必填字段</label>
        </div>
      )

    case 'Badge':
      return (
        <div className="flex gap-2">
          <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">新</span>
          <span className="px-2 py-1 text-xs bg-green-600 text-white rounded-full">完成</span>
          <span className="px-2 py-1 text-xs bg-gray-600 text-white rounded-full">待处理</span>
        </div>
      )

    case 'Tag':
      return (
        <div className="flex gap-2">
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">React</span>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md">JavaScript</span>
          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md">UI</span>
        </div>
      )

    case 'Divider':
      return (
        <div className="w-full max-w-xs space-y-2">
          <div className="border-t border-gray-300"></div>
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-2 text-xs text-gray-500">分割线</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
        </div>
      )

    case 'Card':
      return (
        <div className="w-full max-w-xs">
          <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-base font-semibold mb-2">卡片标题</h3>
            <p className="text-xs text-gray-600">这是卡片的内容描述部分</p>
          </div>
        </div>
      )

    default:
      return null
  }
}