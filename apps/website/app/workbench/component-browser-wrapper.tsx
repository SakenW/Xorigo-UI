/**
 * ComponentBrowser 包装器
 * 简化版本用于集成测试
 */

'use client'

import React from 'react'

// 简化版的组件浏览器
export default function ComponentBrowserWrapper() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        组件库展示 (简化版)
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        完整的ComponentRegistry系统正在准备中...
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Button', category: '基础组件', description: '按钮组件', count: 24 },
          { name: 'Input', category: '表单组件', description: '输入框组件', count: 18 },
          { name: 'Card', category: '布局组件', description: '卡片组件', count: 12 },
          { name: 'Modal', category: '反馈组件', description: '模态框组件', count: 8 },
          { name: 'Table', category: '数据展示', description: '表格组件', count: 15 },
          { name: 'Form', category: '表单组件', description: '表单组件', count: 20 }
        ].map((component, index) => (
          <div
            key={`component-browser-${component.name}-${index}`}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {component.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {component.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {component.category}
              </span>
              <span className="text-xs text-blue-600 font-medium">
                {component.count} 变体
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>ComponentRegistry系统状态:</strong> 正在准备集成417个组件的完整扫描和注册功能...
        </p>
      </div>
    </div>
  )
}