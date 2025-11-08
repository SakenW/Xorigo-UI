'use client'

import React from 'react'

// 导航组件预览缩略图
export function NavigationPreviews({ componentName }: { componentName: string }) {
  switch (componentName) {
    case 'Menu':
      return (
        <div className="w-full max-w-xs">
          <div className="border border-gray-200 rounded-md shadow-sm">
            <div className="px-3 py-2 text-sm bg-gray-50 border-b border-gray-200">文件</div>
            <div className="px-3 py-2 text-sm hover:bg-gray-50">新建</div>
            <div className="px-3 py-2 text-sm hover:bg-gray-50">打开</div>
            <div className="px-3 py-2 text-sm hover:bg-gray-50">保存</div>
          </div>
        </div>
      )

    case 'Breadcrumb':
      return (
        <div className="w-full max-w-xs">
          <nav className="flex items-center space-x-2 text-sm">
            <a className="text-blue-600 hover:underline">首页</a>
            <span className="text-gray-400">/</span>
            <a className="text-blue-600 hover:underline">产品</a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">详情</span>
          </nav>
        </div>
      )

    case 'Pagination':
      return (
        <div className="flex items-center space-x-1">
          <button className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">‹</button>
          <button className="px-2 py-1 text-sm bg-blue-600 text-white rounded">1</button>
          <button className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">2</button>
          <button className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">3</button>
          <button className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">›</button>
        </div>
      )

    case 'Steps':
      return (
        <div className="w-full max-w-xs">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</div>
              <span className="ml-2 text-xs">开始</span>
            </div>
            <div className="flex-1 h-px bg-blue-600 mx-2"></div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs">2</div>
              <span className="ml-2 text-xs text-gray-500">进行中</span>
            </div>
            <div className="flex-1 h-px bg-gray-300 mx-2"></div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs">3</div>
              <span className="ml-2 text-xs text-gray-500">完成</span>
            </div>
          </div>
        </div>
      )

    case 'Anchor':
      return (
        <div className="w-full max-w-xs">
          <div className="space-y-2">
            <a className="flex items-center text-sm text-blue-600 hover:underline">
              <span className="mr-2">#</span>
              <span>快速导航 1</span>
            </a>
            <a className="flex items-center text-sm text-blue-600 hover:underline">
              <span className="mr-2">#</span>
              <span>快速导航 2</span>
            </a>
          </div>
        </div>
      )

    case 'BackTop':
      return (
        <div className="w-full max-w-xs">
          <button className="w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center">
            <span className="text-sm">↑</span>
          </button>
        </div>
      )

    default:
      return null
  }
}