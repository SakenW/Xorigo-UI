/**
 * Workbench 页面 - 简化版本
 * 避免复杂的依赖，专注于核心功能
 */

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workbench - Xorigo UI | 组件开发工作台',
  description: '组件开发工作台',
}

export default function WorkbenchPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Workbench</h1>
        <p className="text-gray-600 mb-8">开发中...</p>
        <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          返回首页
        </a>
      </div>
    </div>
  )
}