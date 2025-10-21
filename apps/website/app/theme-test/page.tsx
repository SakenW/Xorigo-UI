'use client'

import React from 'react'

export default function ThemeTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          🎨 主题测试页面
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            基础测试
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            如果你看到这个页面，说明基础路由正常工作。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">蓝色测试卡片</h3>
              <p className="text-blue-700 dark:text-blue-300">这是一个测试卡片</p>
            </div>

            <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-100">绿色测试卡片</h3>
              <p className="text-green-700 dark:text-green-300">这是另一个测试卡片</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            交互测试
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => alert('按钮点击正常！')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              测试按钮
            </button>

            <input
              type="text"
              placeholder="测试输入框"
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}