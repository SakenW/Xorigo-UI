/**
 * Workbench V2 集成版本 - 左侧导航栏布局
 * 支持96个组件的分类展示和导航
 */

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 导入现有组件
import { FloatingAIButton } from '../../src/components/workbench/ai-assistant/floating-ai-button'
import { WorkbenchMonacoEditor } from '../../src/components/workbench/editor/workbench-monaco-editor'

// 类型定义
type WorkbenchMode = 'solution' | 'components' | 'editor' | 'theme' | 'devtools'

interface BusinessScenario {
  id: string
  name: string
  description: string
  icon: string
  category: string
  difficulty: string
}

interface ComponentCategory {
  id: string
  name: string
  icon: string
  description: string
  count: number
  color: string
}

interface ComponentExample {
  id: string
  name: string
  description: string
  category: string
  count: number
}

interface ThemeRecipe {
  id: string
  name: string
  description: string
  mode: string
  hue: string
  preview: string
}

// 模拟数据
const businessScenarios: BusinessScenario[] = [
  { id: '1', name: '企业官网', description: '专业的企业展示网站', icon: '🏢', category: 'enterprise', difficulty: 'beginner' },
  { id: '2', name: '电商平台', description: '完整的电商解决方案', icon: '🛒', category: 'ecommerce', difficulty: 'advanced' },
  { id: '3', name: '内容管理', description: '灵活的CMS系统', icon: '📝', category: 'content', difficulty: 'intermediate' },
  { id: '4', name: '数据分析', description: '数据可视化平台', icon: '📊', category: 'analytics', difficulty: 'advanced' },
  { id: '5', name: '社交应用', description: '社交媒体平台', icon: '💬', category: 'social', difficulty: 'intermediate' },
  { id: '6', name: '移动应用', description: '移动端应用模板', icon: '📱', category: 'mobile', difficulty: 'beginner' }
]

// 基于96个真实组件的分类数据
const componentCategories: ComponentCategory[] = [
  {
    id: 'core',
    name: '核心组件',
    icon: '⚡',
    description: 'WorkbenchV2、智能面包屑等核心功能组件',
    count: 3,
    color: 'blue'
  },
  {
    id: 'components',
    name: '组件管理',
    icon: '📦',
    description: 'ComponentRegistry、ComponentScanner等组件管理工具',
    count: 12,
    color: 'green'
  },
  {
    id: 'editor',
    name: '编辑器',
    icon: '✏️',
    description: 'Monaco编辑器系列、AI助手、代码生成器',
    count: 15,
    color: 'purple'
  },
  {
    id: 'devtools',
    name: '开发工具',
    icon: '🔧',
    description: '性能监控、调试工具、优化器',
    count: 8,
    color: 'orange'
  },
  {
    id: 'solution',
    name: '解决方案',
    icon: '🎯',
    description: '业务场景组件、配置器、详情页',
    count: 6,
    color: 'red'
  },
  {
    id: 'shared',
    name: '共享组件',
    icon: '🔗',
    description: '导航、权限、版本控制、协作等共享功能',
    count: 32,
    color: 'indigo'
  },
  {
    id: 'preview',
    name: '预览展示',
    icon: '👁️',
    description: '组件预览、实时预览、增强预览',
    count: 5,
    color: 'pink'
  },
  {
    id: 'cards',
    name: '卡片组件',
    icon: '🃏',
    description: '智能卡片、增强卡片、简单卡片',
    count: 4,
    color: 'teal'
  },
  {
    id: 'filters',
    name: '过滤器',
    icon: '🔍',
    description: '高级过滤器、智能搜索',
    count: 3,
    color: 'cyan'
  },
  {
    id: 'ui',
    name: 'UI组件',
    icon: '🎨',
    description: 'Website专用UI组件集合',
    count: 8,
    color: 'emerald'
  }
]

const components: ComponentExample[] = [
  { id: '1', name: 'Button', description: '按钮组件', category: 'ui', count: 24 },
  { id: '2', name: 'Input', description: '输入框组件', category: 'ui', count: 18 },
  { id: '3', name: 'Card', description: '卡片组件', category: 'ui', count: 12 },
  { id: '4', name: 'Modal', description: '模态框组件', category: 'ui', count: 8 },
  { id: '5', name: 'Table', description: '表格组件', category: 'ui', count: 15 }
]

const themeRecipes: ThemeRecipe[] = [
  { id: '1', name: '现代简约', description: '简洁清爽的现代风格', mode: 'light', hue: 'blue', preview: 'modern' },
  { id: '2', name: '暗夜模式', description: '适合夜间使用的深色主题', mode: 'dark', hue: 'purple', preview: 'dark' },
  { id: '3', name: '企业蓝', description: '专业的企业级配色', mode: 'light', hue: 'indigo', preview: 'corporate' },
  { id: '4', name: '自然绿', description: '清新的自然绿色调', mode: 'light', hue: 'green', preview: 'nature' }
]

export default function WorkbenchV2Integrated() {
  const [activeMode, setActiveMode] = useState<WorkbenchMode>('components')
  const [selectedCategory, setSelectedCategory] = useState<string>('core')
  const [selectedScenario, setSelectedScenario] = useState<BusinessScenario | null>(null)
  const [selectedComponent, setSelectedComponent] = useState<ComponentExample | null>(null)
  const [selectedRecipe, setSelectedRecipe] = useState<ThemeRecipe>(themeRecipes[0])

  const modes = [
    { id: 'solution', label: '解决方案', icon: '🎯' },
    { id: 'components', label: '组件库', icon: '🧩' },
    { id: 'editor', label: '编辑器', icon: '✏️' },
    { id: 'theme', label: '主题配方', icon: '🎨' },
    { id: 'devtools', label: '开发工具', icon: '🔧' }
  ] as const

  const totalComponentCount = componentCategories.reduce((sum, cat) => sum + cat.count, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* 顶部导航 */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Xorigo UI Workbench V2
              </h1>
              <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
                {totalComponentCount}个组件
              </span>
            </div>

            {/* 模式切换 */}
            <nav className="flex items-center space-x-1">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeMode === mode.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-2">{mode.icon}</span>
                  {mode.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* 主要内容区域 - 左侧导航栏布局 */}
      <main className="flex h-[calc(100vh-4rem)]">
        {/* 左侧导航栏 */}
        {activeMode === 'components' && (
          <aside className="w-80 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                组件分类导航
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                共{totalComponentCount}个组件，分为10个主要类别
              </p>

              {/* 分类列表 */}
              <div className="space-y-2">
                {componentCategories.map((category) => (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedCategory === category.id
                        ? `bg-${category.color}-100 dark:bg-${category.color}-900/30 border-2 border-${category.color}-500`
                        : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium bg-${category.color}-500 text-white rounded-full`}>
                            {category.count}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 统计信息 */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">统计信息</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>总组件数: {totalComponentCount}</p>
                  <p>分类数: {componentCategories.length}</p>
                  <p>最大分类: 共享组件 (32个)</p>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* 右侧内容区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeMode === 'solution' && (
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
                      解决方案平台
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      基于业务场景的解决方案模板，涵盖6大应用场景
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {businessScenarios.map((scenario) => (
                        <motion.div
                          key={scenario.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedScenario?.id === scenario.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
                          }`}
                          onClick={() => setSelectedScenario(scenario)}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-3xl">{scenario.icon}</span>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {scenario.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {scenario.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-full">
                          {scenario.category}
                        </span>
                        <span className={`text-xs font-medium ${
                          scenario.difficulty === 'beginner' ? 'text-green-600' :
                          scenario.difficulty === 'intermediate' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {scenario.difficulty}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeMode === 'components' && (
            <motion.div
              key="components"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* 当前选中分类的详细信息 */}
              {(() => {
                const currentCategory = componentCategories.find(cat => cat.id === selectedCategory)
                return (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <span className="text-4xl">{currentCategory?.icon}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {currentCategory?.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          {currentCategory?.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {components.map((component) => (
                        <motion.div
                          key={component.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedComponent?.id === component.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
                          }`}
                          onClick={() => setSelectedComponent(component)}
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
                        </motion.div>
                      ))}
                    </div>

                    {/* 分类详情说明 */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        {currentCategory?.name} 详细信息
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">组件数量</h4>
                          <p className="text-gray-600 dark:text-gray-400">{currentCategory?.count} 个组件</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">主要用途</h4>
                          <p className="text-gray-600 dark:text-gray-400">{currentCategory?.description}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">文件位置</h4>
                          <p className="text-gray-600 dark:text-gray-400">/src/components/workbench/{currentCategory?.id}/</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* 组件详情展示区域 */}
              {selectedComponent && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {selectedComponent.name} 详情
                        </h3>
                        <button
                          onClick={() => setSelectedComponent(null)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 左侧：组件预览 */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            组件预览
                          </h4>
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                            {selectedComponent.name === 'Button' && (
                              <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                    Primary Button
                                  </button>
                                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    Secondary Button
                                  </button>
                                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                    Success Button
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <button className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                                    Small
                                  </button>
                                  <button className="px-6 py-3 text-lg bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
                                    Large
                                  </button>
                                </div>
                              </div>
                            )}
                            {selectedComponent.name === 'Input' && (
                              <div className="space-y-4">
                                <input
                                  type="text"
                                  placeholder="请输入内容..."
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                                <input
                                  type="email"
                                  placeholder="邮箱地址..."
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                                <textarea
                                  placeholder="多行文本输入..."
                                  rows={3}
                                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                />
                              </div>
                            )}
                            {selectedComponent.name === 'Card' && (
                              <div className="space-y-4">
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    卡片标题
                                  </h3>
                                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    这是一个卡片组件的示例，包含标题、内容和操作按钮。
                                  </p>
                                  <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                                      确认
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                                      取消
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {selectedComponent.name === 'Modal' && (
                              <div className="space-y-4">
                                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                  打开模态框
                                </button>
                                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                  <p className="text-gray-600 dark:text-gray-400 text-center">
                                    模态框预览区域
                                  </p>
                                </div>
                              </div>
                            )}
                            {selectedComponent.name === 'Table' && (
                              <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                  <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-800">
                                      <th className="px-4 py-2 text-left text-gray-900 dark:text-white">姓名</th>
                                      <th className="px-4 py-2 text-left text-gray-900 dark:text-white">年龄</th>
                                      <th className="px-4 py-2 text-left text-gray-900 dark:text-white">城市</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">张三</td>
                                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">25</td>
                                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">北京</td>
                                    </tr>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">李四</td>
                                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">30</td>
                                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">上海</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 右侧：组件信息 */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            组件信息
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">组件名称:</span>
                              <span className="text-gray-900 dark:text-white font-medium">
                                {selectedComponent.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">组件类别:</span>
                              <span className="text-gray-900 dark:text-white font-medium">
                                {selectedComponent.category}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">变体数量:</span>
                              <span className="text-gray-900 dark:text-white font-medium">
                                {selectedComponent.count} 个
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">组件描述:</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {selectedComponent.description}
                            </p>
                          </div>

                          <div className="mt-6">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                              使用示例
                            </h4>
                            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                              <pre className="text-sm">
                                <code>
{`import { ${selectedComponent.name} } from '@xorigo-ui/core'

function Example() {
  return React.createElement(
    ${selectedComponent.name},
    { variant: "primary", size: "md" },
    "示例内容"
  )
}`}
                                </code>
                              </pre>
                            </div>
                          </div>

                          <div className="mt-6 flex gap-2">
                            <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                              查看文档
                            </button>
                            <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              复制代码
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

          {activeMode === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  代码编辑器
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Monaco编辑器集成 - 支持 TypeScript、智能提示、错误检查
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                  <WorkbenchMonacoEditor
                    language="typescript"
                    theme="vs-dark"
                    minHeight="400px"
                    value={`import { Button } from '@xorigo-ui/core'

export default function MyComponent() {
  return (
    <div>
      <Button variant="primary" size="lg">
        Hello Xorigo UI Workbench V2
      </Button>
    </div>
  )
}`}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeMode === 'theme' && (
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
                  {themeRecipes.map((recipe) => (
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
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {recipe.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                          {recipe.mode}
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                          {recipe.hue}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeMode === 'devtools' && (
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
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  性能监控、调试工具、依赖分析等开发辅助工具
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      性能监控器
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      实时监控组件渲染性能和内存使用
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      依赖分析器
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      可视化组件依赖关系和包大小分析
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      错误边界检测
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      自动检测和处理组件中的错误
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      代码质量分析
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      代码规范检查和最佳实践建议
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
        </div>
      </main>

      {/* 底部状态栏 */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-8">
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