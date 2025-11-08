'use client'

import React from 'react'

// 输入增强组件预览缩略图
export function InputEnhancedPreviews({ componentName }: { componentName: string }) {
  switch (componentName) {
    case 'DatePicker':
      return (
        <div className="w-full max-w-xs">
          <div className="border border-gray-200 rounded-md p-3">
            <div className="text-center text-xs font-medium mb-2">2025年11月</div>
            <div className="grid grid-cols-7 gap-1 text-xs">
              <div className="text-center text-gray-500">日</div>
              <div className="text-center text-gray-500">一</div>
              <div className="text-center text-gray-500">二</div>
              <div className="text-center text-gray-500">三</div>
              <div className="text-center text-gray-500">四</div>
              <div className="text-center text-gray-500">五</div>
              <div className="text-center text-gray-500">六</div>
              <div className="text-center py-1">1</div>
              <div className="text-center py-1">2</div>
              <div className="text-center py-1 bg-blue-600 text-white rounded">3</div>
              <div className="text-center py-1">4</div>
              <div className="text-center py-1">5</div>
              <div className="text-center py-1">6</div>
              <div className="text-center py-1">7</div>
            </div>
          </div>
        </div>
      )

    case 'ColorPicker':
      return (
        <div className="w-full max-w-xs">
          <div className="border border-gray-200 rounded-md p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded border-2 border-gray-300"></div>
              <span className="text-xs">#3B82F6</span>
            </div>
            <div className="grid grid-cols-6 gap-1">
              <div className="w-6 h-6 bg-red-500 rounded cursor-pointer"></div>
              <div className="w-6 h-6 bg-green-500 rounded cursor-pointer"></div>
              <div className="w-6 h-6 bg-blue-500 rounded cursor-pointer"></div>
              <div className="w-6 h-6 bg-yellow-500 rounded cursor-pointer"></div>
              <div className="w-6 h-6 bg-purple-500 rounded cursor-pointer"></div>
              <div className="w-6 h-6 bg-pink-500 rounded cursor-pointer"></div>
            </div>
          </div>
        </div>
      )

    case 'Upload':
      return (
        <div className="w-full max-w-xs">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <div className="text-gray-400 mb-2">📁</div>
            <p className="text-xs text-gray-600">点击或拖拽文件上传</p>
            <p className="text-xs text-gray-400">支持 JPG, PNG, PDF</p>
          </div>
        </div>
      )

    case 'Editor':
      return (
        <div className="w-full max-w-xs">
          <div className="border border-gray-200 rounded-md">
            <div className="border-b border-gray-200 p-2">
              <div className="flex space-x-1">
                <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">B</button>
                <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">I</button>
                <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">U</button>
                <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">链接</button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-700">这是富文本编辑器内容...</p>
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}