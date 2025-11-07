/**
 * Xorigo UI Workbench 2.0
 * 业务场景驱动的双轨并行架构
 *
 * 特性：
 * - 解决方案平台 (业务场景驱动)
 * - 组件库展示 (组件注册系统)
 * - 主题系统 (七轴配方)
 * - 开发工具 (性能监控、调试)
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 集成的组件
import { FloatingAIButton } from '../../src/components/workbench/ai-assistant/floating-ai-button'
import { WorkbenchMonacoEditor } from '../../src/components/workbench/editor/workbench-monaco-editor'

// 模拟业务场景数据
const businessScenarios = [
  { id: 1, name: '企业官网', category: '企业展示', icon: '🏢', difficulty: 'beginner' },
  { id: 2, name: '电商平台', category: '电商', icon: '🛒', difficulty: 'advanced' },
  { id: 3, name: '内容管理', category: '内容', icon: '📝', difficulty: 'intermediate' },
  { id: 4, name: '数据分析', category: '数据', icon: '📊', difficulty: 'advanced' },
  { id: 5, name: '社交应用', category: '社交', icon: '💬', difficulty: 'intermediate' },
  { id: 6, name: '移动应用', category: '移动', icon: '📱', difficulty: 'beginner' }
]

// 模拟组件数据
const components = [
  { id: 1, name: 'Button', category: '基础组件', description: '按钮组件', count: 24 },
  { id: 2, name: 'Input', category: '表单组件', description: '输入框组件', count: 18 },
  { id: 3, name: 'Card', category: '布局组件', description: '卡片组件', count: 12 },
  { id: 4, name: 'Modal', category: '反馈组件', description: '模态框组件', count: 8 },
  { id: 5, name: 'Table', category: '数据展示', description: '表格组件', count: 15 }
]

// 主题配方
const recipes = [
  { id: 1, name: '现代简约', mode: 'light', hue: 'blue', description: '简洁清爽的现代风格' },
  { id: 2, name: '暗夜模式', mode: 'dark', hue: 'purple', description: '适合夜间使用的深色主题' },
  { id: 3, name: '企业蓝', mode: 'light', hue: 'indigo', description: '专业的企业级配色' },
  { id: 4, name: '自然绿', mode: 'light', hue: 'green', description: '清新的自然绿色调' }
]

export default function WorkbenchPage() {
  const [activeTab, setActiveTab] = useState('solution')
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(recipes[0])

  const tabs = [
    { id: 'solution', label: '解决方案', icon: '🎯', count: businessScenarios.length },
    { id: 'components', label: '组件库', icon: '🧩', count: 417 },
    { id: 'editor', label: '编辑器', icon: '✏️' },
    { id: 'theme', label: '主题配方', icon: '🎨', count: recipes.length },
    { id: 'devtools', label: '开发工具', icon: '🔧' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* 顶部导航 */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Xorigo UI Workbench 2.0
              </h1>
              <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
                双轨并行架构
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                🌙
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 标签导航 */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count && (
                  <span className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'solution' && (
            <motion.div
              key="solution"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  业务场景驱动开发
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  选择您的业务场景，获取完整的组件解决方案和代码模板
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businessScenarios.map((scenario) => (
                    <motion.div
                      key={scenario.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all"
                      onClick={() => setSelectedScenario(scenario)}
                    >
                      <div className="text-4xl mb-3">{scenario.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {scenario.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {scenario.category}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        scenario.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        scenario.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {scenario.difficulty === 'beginner' ? '初级' :
                         scenario.difficulty === 'intermediate' ? '中级' : '高级'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'components' && (
            <motion.div
              key="components"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    组件库
                  </h2>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="搜索组件..."
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>全部分类</option>
                      <option>基础组件</option>
                      <option>表单组件</option>
                      <option>布局组件</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {components.map((component) => (
                    <motion.div
                      key={component.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all"
                      onClick={() => setSelectedComponent(component)}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {component.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {component.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {component.count} 个变体
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                代码编辑器
              </h2>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Monaco 编辑器集成 - 支持 TypeScript、智能提示、错误检查
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <WorkbenchMonacoEditor
                    language="typescript"
                    theme="vs-dark"
                    minHeight="200px"
                    value={`import { Button } from '@xorigo-ui/core'

export default function MyComponent() {
  return (
    <Button variant="primary" size="lg">
      Hello Xorigo UI
    </Button>
  )
}`}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'theme' && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  七轴主题配方
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  实时预览和配置主题配方，支持 26 个参数调节
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recipes.map((recipe) => (
                    <motion.div
                      key={recipe.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedRecipe?.id === recipe.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
                      }`}
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-4 h-4 rounded-full ${
                          recipe.mode === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-300'
                        }`} />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {recipe.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {recipe.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        模式: {recipe.mode === 'dark' ? '暗色' : '亮色'} | 色相: {recipe.hue}
                      </p>
                    </motion.div>
                  ))}
                </div>
                {selectedRecipe && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      当前选中: {selectedRecipe.name}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          模式
                        </label>
                        <select
                          value={selectedRecipe.mode}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        >
                          <option value="light">亮色</option>
                          <option value="dark">暗色</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          色相
                        </label>
                        <input
                          type="text"
                          value={selectedRecipe.hue}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          饱和度
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="50"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          亮度
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="50"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'devtools' && (
            <motion.div
              key="devtools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  开发工具
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                    <div className="text-2xl mb-2">⚡</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      性能监控
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      实时监控组件渲染性能
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">FPS</span>
                        <span className="text-sm font-mono text-green-600">60</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">内存</span>
                        <span className="text-sm font-mono text-blue-600">128 MB</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                    <div className="text-2xl mb-2">🔍</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      组件检查
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      查看组件树和属性
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                    <div className="text-2xl mb-2">♿</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      可访问性
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      WCAG 2.1 AA 合规检测
                    </p>
                    <div className="mt-4">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                        合规通过
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 底部状态栏 */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>状态: <span className="text-green-600 font-medium">运行中</span></span>
              <span>组件: <span className="font-mono">417 已注册</span></span>
            </div>
            <div className="flex items-center space-x-4">
              <span>服务器: <span className="text-green-600 font-medium">在线</span></span>
              <span>版本: <span className="font-mono">v2.0.0</span></span>
            </div>
          </div>
        </div>
      </footer>

      {/* AI 助手浮动按钮 */}
      <FloatingAIButton
        position="bottom-right"
        variant="default"
      />
    </div>
  )
}

/**
 * 组件迁移状态
 * 迁移日期: 2025-11-07 02:37:45
 * 已迁移组件: 2
 */

/**
 * 组件迁移状态
 * 迁移日期: 2025-11-07 02:38:02
 * 已迁移组件: 2
 */

/**
 * 组件迁移状态
 * 迁移日期: 2025-11-07 02:38:42
 * 已迁移组件: 2
 */
