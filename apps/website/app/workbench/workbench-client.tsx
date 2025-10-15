/**
 * Workbench 客户端组件
 * 处理所有客户端交互逻辑 - 集成智能工作台功能
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { componentCategories } from '../../src/data/component-classification'
import { WorkbenchGalleryClientEnhanced } from '../../src/components/workbench/gallery-mode/workbench-gallery-client-enhanced'
import { WorkbenchProvider } from '../../src/components/workbench/workbench-context'

export function WorkbenchClient() {
  const [activeMode, setActiveMode] = useState('gallery')
  const [selectedComponent, setSelectedComponent] = useState('Button')
  const [mounted, setMounted] = useState(false)

  // 确保组件已挂载
  useEffect(() => {
    setMounted(true)
  }, [])

  const modes = [
    { id: 'gallery', name: '组件画廊', description: '浏览所有可用组件', icon: '🎨' },
    { id: 'editor', name: '属性编辑器', description: '实时编辑组件属性', icon: '⚙️' },
    { id: 'split', name: '分屏模式', description: '画廊和编辑器并排显示', icon: '📱' }
  ]

  // 根据URL参数获取模式
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const mode = urlParams.get('mode')
    if (mode && modes.some(m => m.id === mode)) {
      setActiveMode(mode)
    }
  }, [])

  const isGalleryMode = activeMode === 'gallery'
  const isLoading = !mounted

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">正在加载智能工作台...</p>
        </div>
      </div>
    )
  }

  return (
    <WorkbenchProvider>
      {/* 渲染智能工作台画廊 */}
      {isGalleryMode ? (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* 头部标题 */}
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center space-x-3">
                <span>🧠</span>
                <span>智能工作台</span>
                <span className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  v2.0
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                基于AI的智能组件搜索、推荐和发现系统
              </p>
            </div>

            {/* 模式选择器 */}
            <div className="mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  选择工作模式
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {modes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setActiveMode(mode.id)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        activeMode === mode.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">{mode.icon}</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {mode.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {mode.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 智能工作台画廊 */}
          <div className="container mx-auto px-4 pb-8">
            <WorkbenchGalleryClientEnhanced />
          </div>

          {/* 底部信息 */}
          <div className="container mx-auto px-4 pb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">
                🚀 智能工作台功能特性
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex items-start space-x-2">
                  <span>🔍</span>
                  <div>
                    <strong>智能搜索</strong>
                    <p className="text-xs">自然语言处理 + 语义匹配</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span>🎛️</span>
                  <div>
                    <strong>高级过滤</strong>
                    <p className="text-xs">多维度过滤 + 逻辑组合</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span>🧠</span>
                  <div>
                    <strong>智能推荐</strong>
                    <p className="text-xs">个性化推荐 + 行为学习</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span>🕐</span>
                  <div>
                    <strong>搜索历史</strong>
                    <p className="text-xs">本地存储 + 统计分析</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 其他模式的占位符
        <div className="space-y-8">
          {/* 模式选择器 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              选择工作模式
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activeMode === mode.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {mode.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mode.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* 工作区域 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              工作区域 - {activeMode} 模式
            </h2>

            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {activeMode === 'editor' ? '⚙️' : '📱'}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {activeMode === 'editor' ? '属性编辑器' : '分屏模式'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  此功能正在开发中...
                </p>
                <button
                  onClick={() => setActiveMode('gallery')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  返回组件画廊
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </WorkbenchProvider>
  )
}