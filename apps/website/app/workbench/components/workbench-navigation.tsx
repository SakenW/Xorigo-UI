/**
 * Workbench V2 导航组件
 * 支持工作台模式和组件库模式的切换
 */

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

// 类型定义
type WorkMode = 'workbench' | 'component-library'
type ActiveMode = 'solution' | 'devtools' | 'components' | 'editor' | 'theme' | 'ai-assistant'

interface NavigationItem {
  id: string
  label: string
  icon: string
  description: string
  count?: number
  type: 'primary' | 'secondary' | 'standalone' | 'tool'
  badge?: string
}

interface WorkbenchNavigationProps {
  workMode: WorkMode
  activeMode: ActiveMode
  onWorkModeChange: (mode: WorkMode) => void
  onActiveModeChange: (mode: ActiveMode) => void
  totalComponentCount: number
  solutionCount: number
  themeRecipeCount: number
  componentCategories: any[]
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
}

export default function WorkbenchNavigation({
  workMode,
  activeMode,
  onWorkModeChange,
  onActiveModeChange,
  totalComponentCount,
  solutionCount,
  themeRecipeCount,
  componentCategories,
  selectedCategory,
  onCategoryChange
}: WorkbenchNavigationProps) {

  // 主工作台导航 - 核心工作流程
  const mainWorkbenchItems: NavigationItem[] = [
    {
      id: 'solution',
      label: '解决方案工作台',
      icon: '🎯',
      description: '15个企业级业务场景',
      count: solutionCount,
      type: 'primary',
      badge: '推荐'
    },
    {
      id: 'devtools',
      label: '开发工具套件',
      icon: '🛠️',
      description: '编辑器、调试、性能监控',
      type: 'secondary'
    }
  ]

  // 组件库独立入口
  const componentLibraryEntry: NavigationItem = {
    id: 'components',
    label: '组件库中心',
    icon: '🧩',
    description: '96个组件的专业展示厅',
    count: totalComponentCount,
    type: 'standalone',
    badge: '独立入口'
  }

  // 解决方案模式下的工具栏
  const solutionTools: NavigationItem[] = [
    {
      id: 'editor',
      label: '代码编辑器',
      icon: '💻',
      description: 'Monaco编辑器，TypeScript支持',
      type: 'tool'
    },
    {
      id: 'theme',
      label: '主题配置',
      icon: '🎨',
      description: '七轴主题系统，4个预设配方',
      count: themeRecipeCount,
      type: 'tool'
    },
    {
      id: 'ai-assistant',
      label: 'AI助手',
      icon: '🤖',
      description: '智能交互辅助',
      type: 'tool'
    }
  ]

  return (
    <div className="w-80 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">X</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Xorigo UI Workbench
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">V2.0</p>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">总组件数</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{totalComponentCount}</span>
          </div>
        </div>

        {/* 工作模式切换 */}
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">工作模式</div>
          <div className="flex gap-2">
            <button
              onClick={() => onWorkModeChange('workbench')}
              className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                workMode === 'workbench'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              🎯 工作台
            </button>
            <button
              onClick={() => onWorkModeChange('component-library')}
              className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                workMode === 'component-library'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              🧩 组件库
            </button>
          </div>
        </div>

        {/* 主导航列表 - 根据工作模式显示 */}
        <nav className="space-y-1">
          {workMode === 'workbench' ? (
            // 工作台导航
            mainWorkbenchItems.map((item) => (
              <div key={item.id}>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onActiveModeChange(item.id as ActiveMode)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    activeMode === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {item.label}
                          {item.badge && (
                            <span className="px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </div>
                    {item.count !== null && (
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </div>
                </motion.button>
              </div>
            ))
          ) : (
            // 组件库独立入口
            <div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onActiveModeChange('components')}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  activeMode === 'components'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{componentLibraryEntry.icon}</span>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {componentLibraryEntry.label}
                        <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                          {componentLibraryEntry.badge}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{componentLibraryEntry.description}</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                    {componentLibraryEntry.count}
                  </span>
                </div>
              </motion.button>
            </div>
          )}
        </nav>

        {/* 工作台模式下的工具栏 */}
        {workMode === 'workbench' && activeMode === 'solution' && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">开发工具</div>
            <div className="space-y-1">
              {solutionTools.map((tool) => (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onActiveModeChange(tool.id as ActiveMode)}
                  className={`w-full text-left p-2 rounded-lg transition-all text-sm ${
                    activeMode === tool.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{tool.icon}</span>
                    <span>{tool.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* 组件库模式下的分类导航 */}
        {workMode === 'component-library' && activeMode === 'components' && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">组件分类</div>
            <div className="space-y-1">
              {componentCategories.map((category: any) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onCategoryChange?.(category.id)}
                  className={`w-full text-left p-2 rounded-lg transition-all text-sm ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full">
                      {category.count}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* 底部状态 */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>开发服务器运行中</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            当前模式: {workMode === 'workbench' ? '工作台' : '组件库'}
          </div>
        </div>
      </div>
    </div>
  )
}