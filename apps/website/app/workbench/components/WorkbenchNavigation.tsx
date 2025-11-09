'use client'

import React from 'react'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

interface WorkbenchNavigationProps {
  activeMode: 'workbench' | 'component-library'
  onModeChange: (mode: 'workbench' | 'component-library') => void
  totalComponentCount: number
}

export default function WorkbenchNavigation({
  activeMode,
  onModeChange,
  totalComponentCount
}: WorkbenchNavigationProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧Logo和标题 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                X
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Xorigo UI Workbench
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">V2.0</p>
              </div>
            </div>
          </div>

          {/* 中间模式切换 */}
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => onModeChange('workbench')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeMode === 'workbench'
                  ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              🎯 工作台
            </button>
            <button
              onClick={() => onModeChange('component-library')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeMode === 'component-library'
                  ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              🧩 组件库
            </button>
          </div>

          {/* 右侧统计和工具 */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {totalComponentCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">总组件数</div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>开发服务器运行中</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              当前模式: {activeMode === 'workbench' ? '工作台' : '组件库'}
            </div>
            {/* 主题切换器 */}
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* 模式描述 */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎯</span>
            <span>解决方案工作台</span>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded text-xs">
              推荐 {15}个企业级业务场景
            </span>
            <span className="text-green-600 dark:text-green-400 font-semibold">15</span>
          </div>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🛠️</span>
            <span>开发工具套件</span>
            <span className="text-gray-600 dark:text-gray-400">编辑器、调试、性能监控</span>
          </div>
        </div>
      </div>
    </header>
  )
}