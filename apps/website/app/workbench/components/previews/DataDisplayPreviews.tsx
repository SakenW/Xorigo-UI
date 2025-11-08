'use client'

import React from 'react'

// 数据展示组件预览缩略图
export function DataDisplayPreviews({ componentName }: { componentName: string }) {
  switch (componentName) {
    case 'Table':
      return (
        <div className="w-full max-w-xs">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1">姓名</th>
                <th className="border border-gray-300 px-2 py-1">年龄</th>
                <th className="border border-gray-300 px-2 py-1">状态</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-2 py-1">张三</td>
                <td className="border border-gray-300 px-2 py-1">25</td>
                <td className="border border-gray-300 px-2 py-1">活跃</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-2 py-1">李四</td>
                <td className="border border-gray-300 px-2 py-1">30</td>
                <td className="border border-gray-300 px-2 py-1">离线</td>
              </tr>
            </tbody>
          </table>
        </div>
      )

    case 'List':
      return (
        <div className="w-full max-w-xs">
          <div className="border border-gray-200 rounded-md">
            <div className="px-3 py-2 text-sm border-b border-gray-200 hover:bg-gray-50">列表项 1</div>
            <div className="px-3 py-2 text-sm border-b border-gray-200 hover:bg-gray-50">列表项 2</div>
            <div className="px-3 py-2 text-sm hover:bg-gray-50">列表项 3</div>
          </div>
        </div>
      )

    case 'Tree':
      return (
        <div className="w-full max-w-xs">
          <div className="text-sm">
            <div className="flex items-center py-1">
              <span className="mr-2">▼</span>
              <span>根节点</span>
            </div>
            <div className="ml-4">
              <div className="flex items-center py-1">
                <span className="mr-2">▶</span>
                <span>子节点 1</span>
              </div>
              <div className="flex items-center py-1">
                <span className="mr-2">▼</span>
                <span>子节点 2</span>
              </div>
              <div className="ml-4">
                <div className="flex items-center py-1">
                  <span className="mr-2">└</span>
                  <span>叶子节点</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'Timeline':
      return (
        <div className="w-full max-w-xs">
          <div className="relative">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-300"></div>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-4 h-4 bg-blue-600 rounded-full mt-0.5 relative z-10"></div>
                <div className="ml-3">
                  <div className="text-xs font-medium">步骤 1</div>
                  <div className="text-xs text-gray-600">完成项目初始化</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-4 h-4 bg-green-600 rounded-full mt-0.5 relative z-10"></div>
                <div className="ml-3">
                  <div className="text-xs font-medium">步骤 2</div>
                  <div className="text-xs text-gray-600">开发核心功能</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}