/**
 * Workbench V2 优化版本 - 简化导航交互
 * 左侧导航直接显示内容，移除重复的类别选择
 */

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 导入现有组件
import { FloatingAIButton } from '../../src/components/workbench/ai-assistant/floating-ai-button'
import { WorkbenchMonacoEditor } from '../../src/components/workbench/editor/workbench-monaco-editor'

// 类型定义
type NavigationItem = {
  id: string
  name: string
  icon: string
  description: string
  count?: number
  color?: string
}

interface ComponentExample {
  id: string
  name: string
  description: string
  category: string
  count: number
}

interface BusinessScenario {
  id: string
  name: string
  description: string
  icon: string
  category: string
  difficulty: string
}

interface ThemeRecipe {
  id: string
  name: string
  description: string
  mode: string
  hue: string
  preview: string
}

// 导航数据结构
const navigationItems: NavigationItem[] = [
  // 组件分类
  { id: 'core', name: '核心组件', icon: '⚡', description: 'WorkbenchV2、智能面包屑等核心功能组件', count: 3, color: 'blue' },
  { id: 'components', name: '组件管理', icon: '📦', description: 'ComponentRegistry、ComponentScanner等组件管理工具', count: 12, color: 'green' },
  { id: 'editor', name: '编辑器', icon: '📝', description: 'Monaco编辑器、代码高亮、智能提示等功能', count: 8, color: 'purple' },
  { id: 'layout', name: '布局组件', icon: '🏗️', description: '智能布局、响应式栅格、容器组件', count: 15, color: 'orange' },
  { id: 'form', name: '表单组件', icon: '📋', description: '智能表单、验证器、输入组件', count: 18, color: 'pink' },
  { id: 'feedback', name: '反馈组件', icon: '💬', description: '提示、通知、加载状态等反馈组件', count: 10, color: 'teal' },
  { id: 'navigation', name: '导航组件', icon: '🧭', description: '智能面包屑、分页、标签页等导航组件', count: 7, color: 'indigo' },
  { id: 'overlay', name: '覆盖层组件', icon: '🎭', description: '模态框、抽屉、悬浮层等覆盖组件', count: 9, color: 'yellow' },
  { id: 'media', name: '媒体组件', icon: '🖼️', description: '图片、视频、图标等媒体展示组件', count: 6, color: 'rose' },
  { id: 'chart', name: '图表组件', icon: '📊', description: '数据可视化、图表、仪表盘等展示组件', count: 8, color: 'cyan' },

  // 功能模块
  { id: 'solutions', name: '解决方案', icon: '🚀', description: '业务场景模板和解决方案', count: 15, color: 'emerald' },
  { id: 'themes', name: '主题系统', icon: '🎨', description: '七轴主题系统、配色方案、设计令牌', count: 20, color: 'violet' },
  { id: 'devtools', name: '开发工具', icon: '🛠️', description: '调试工具、性能监控、代码检查', count: 5, color: 'slate' }
]

// 模拟数据
const mockComponents: ComponentExample[] = [
  { id: 'workbench-v2', name: 'WorkbenchV2', description: '统一工作台组件', category: 'core', count: 3 },
  { id: 'smart-breadcrumb', name: 'SmartBreadcrumb', description: '智能面包屑导航', category: 'core', count: 2 },
  { id: 'component-registry', name: 'ComponentRegistry', description: '组件注册管理器', category: 'components', count: 5 },
  { id: 'monaco-editor', name: 'MonacoEditor', description: '代码编辑器组件', category: 'editor', count: 8 },
]

const mockScenarios: BusinessScenario[] = [
  { id: 'dashboard', name: '智能仪表盘', icon: '📈', category: 'solutions', difficulty: '中级' },
  { id: 'form-system', name: '动态表单系统', icon: '📝', category: 'solutions', difficulty: '高级' },
  { id: 'data-visualization', name: '数据可视化平台', icon: '📊', category: 'solutions', difficulty: '高级' },
]

const mockThemeRecipes: ThemeRecipe[] = [
  { id: 'modern-blue', name: '现代蓝调', description: '专业的蓝色主题', mode: 'light', hue: 'blue', preview: 'bg-blue-500' },
  { id: 'dark-mode', name: '深色模式', description: '护眼的深色主题', mode: 'dark', hue: 'gray', preview: 'bg-gray-900' },
]

export default function WorkbenchV2Optimized() {
  const [selectedNav, setSelectedNav] = useState<string>('core')
  const [selectedComponent, setSelectedComponent] = useState<ComponentExample | null>(null)

  // 获取当前选中的导航项
  const currentNavItem = navigationItems.find(item => item.id === selectedNav)

  // 渲染组件内容
  const renderComponentContent = () => {
    const categoryComponents = mockComponents.filter(comp => comp.category === selectedNav)

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {currentNavItem?.name} ({categoryComponents.length})
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {currentNavItem?.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryComponents.map((component) => (
              <motion.div
                key={component.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg border-2 border-dashed cursor-pointer transition-all hover:shadow-md ${
                  selectedComponent?.id === component.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onClick={() => setSelectedComponent(component)}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {component.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {component.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 组件详情展示 */}
        <AnimatePresence mode="wait">
          {selectedComponent && (
            <motion.div
              key={selectedComponent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedComponent.name} 详情
                </h3>
                <button
                  onClick={() => setSelectedComponent(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">组件预览</h4>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-2">🎯</div>
                      {selectedComponent.name} 组件预览区域
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-100 mb-3">使用示例</h4>
                  <pre className="text-sm">
                    <code>{`import { ${selectedComponent.name} } from '@xorigo-ui/core'

function Example() {
  return React.createElement(
    ${selectedComponent.name},
    { variant: "primary", size: "md" },
    "示例内容"
  )
}`}</code>
                  </pre>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    查看文档
                  </button>
                  <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    复制代码
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // 渲染解决方案内容
  const renderSolutionContent = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            解决方案 ({mockScenarios.length})
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            业务场景模板和解决方案，快速搭建企业级应用
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockScenarios.map((scenario) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-3xl mb-3">{scenario.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {scenario.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    scenario.difficulty === '初级' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    scenario.difficulty === '中级' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {scenario.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  企业级{scenario.name}解决方案，包含完整的业务流程和最佳实践
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 渲染主题内容
  const renderThemeContent = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            主题系统 ({mockThemeRecipes.length})
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            七轴主题系统，支持完整的个性化定制
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockThemeRecipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className={`h-16 rounded mb-3 ${recipe.preview}`}></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {recipe.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {recipe.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 渲染编辑器内容
  const renderEditorContent = () => {
    return (
      <div className="space-y-6">
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
      </div>
    )
  }

  // 渲染开发工具内容
  const renderDevToolsContent = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            开发工具
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            调试工具、性能监控、代码检查等开发辅助工具
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">🔍 组件检查器</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                实时检查组件属性、状态和性能数据
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📊 性能监控</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                监控渲染性能、内存使用和网络请求
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 根据选中的导航项渲染对应内容
  const renderContent = () => {
    switch (selectedNav) {
      case 'solutions':
        return renderSolutionContent()
      case 'themes':
        return renderThemeContent()
      case 'editor':
        return renderEditorContent()
      case 'devtools':
        return renderDevToolsContent()
      default:
        return renderComponentContent()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* 顶部导航栏 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Xorigo UI Workbench V2
          </h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm">
            {navigationItems.length} 个模块
          </span>
        </div>
      </header>

      <main className="flex h-[calc(100vh-4rem)]">
        {/* 左侧导航栏 */}
        <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">导航菜单</h2>
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedNav(item.id)
                    setSelectedComponent(null) // 重置选中的组件
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedNav === item.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs opacity-80">{item.description}</div>
                    </div>
                    {item.count && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedNav === item.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* 右侧内容区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNav}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* AI 助手浮动按钮 */}
      <FloatingAIButton
        position="bottom-right"
        variant="default"
      />
    </div>
  )
}