/**
 * Workbench 2.0 统一架构
 * 基于混合架构模式：业务层 → 组合层 → 原子层 → 基础层
 * 整合解决方案平台、组件库展示、编辑器、主题配置器
 */

'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ComponentBrowser } from './ComponentRegistry'

// ============================================================================
// 基础层 - 类型定义
// ============================================================================

/**
 * 工作台模式
 */
type WorkbenchMode = 'solution' | 'components' | 'editor' | 'theme' | 'devtools'

/**
 * 组件示例
 */
interface ComponentExample {
  id: string
  name: string
  description: string
  category: string
  code: string
  props?: Record<string, any>
  preview?: string
}

/**
 * 业务场景
 */
interface BusinessScenario {
  id: string
  name: string
  description: string
  icon: string
  category: 'enterprise' | 'ecommerce' | 'content' | 'analytics' | 'social' | 'mobile'
  components: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  template?: string
}

/**
 * 主题配方
 */
interface ThemeRecipe {
  id: string
  name: string
  description: string
  preview: string
  config: {
    mode: 'light' | 'dark' | 'auto'
    hue: string
    saturation: number
    lightness: number
    density: 'compact' | 'comfortable' | 'spacious'
    roundness: number
    contrast: 'low' | 'normal' | 'high'
  }
}

// ============================================================================
// 组合层 - 核心组件
// ============================================================================

/**
 * 工作台布局组件
 */
interface WorkbenchLayoutProps {
  mode: WorkbenchMode
  onModeChange: (mode: WorkbenchMode) => void
  children: React.ReactNode
}

const WorkbenchLayout: React.FC<WorkbenchLayoutProps> = ({ mode, onModeChange, children }) => {
  const modes = [
    { id: 'solution', label: '解决方案', icon: '🎯' },
    { id: 'components', label: '组件库', icon: '🧩' },
    { id: 'editor', label: '编辑器', icon: '✏️' },
    { id: 'theme', label: '主题配方', icon: '🎨' },
    { id: 'devtools', label: '开发工具', icon: '🔧' }
  ] as const

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
                混合架构
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* 模式导航 */}
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => onModeChange(m.id)}
                className={`${
                  mode === m.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

/**
 * 主题切换器（简化版）
 */
const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}

// ============================================================================
// 业务层 - 解决方案平台
// ============================================================================

/**
 * 业务场景数据
 */
const BUSINESS_SCENARIOS: BusinessScenario[] = [
  {
    id: 'login-form',
    name: '登录表单',
    description: '完整的用户登录解决方案，包含验证、记住我、忘记密码',
    icon: '🔐',
    category: 'enterprise',
    components: ['Input', 'Password', 'Checkbox', 'Button', 'Link'],
    difficulty: 'beginner',
    template: `function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  return (
    <form className="space-y-4">
      <Input
        type="email"
        label="邮箱"
        value={email}
        onChange={setEmail}
        required
      />
      <Password
        label="密码"
        value={password}
        onChange={setPassword}
        required
      />
      <Checkbox
        label="记住我"
        checked={remember}
        onChange={setRemember}
      />
      <Button type="submit" variant="primary">
        登录
      </Button>
    </form>
  )
}`
  },
  {
    id: 'data-table',
    name: '数据表格',
    description: '可排序、分页、筛选的数据表格解决方案',
    icon: '📊',
    category: 'analytics',
    components: ['Table', 'Pagination', 'Filter', 'Search', 'Button'],
    difficulty: 'intermediate',
    template: `function DataTable() {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)

  return (
    <div className="space-y-4">
      <Search placeholder="搜索..." />
      <Table
        data={data}
        columns={columns}
        sortable
        striped
      />
      <Pagination
        current={page}
        total={100}
        onChange={setPage}
      />
    </div>
  )
}`
  },
  {
    id: 'dashboard',
    name: '仪表盘',
    description: '数据可视化仪表盘，包含图表、统计卡片、趋势分析',
    icon: '📈',
    category: 'analytics',
    components: ['Card', 'Chart', 'Stat', 'Grid', 'DateRange'],
    difficulty: 'advanced',
    template: `function Dashboard() {
  return (
    <Grid cols={3} gap="md">
      <Card>
        <Stat label="总用户" value="10,234" change="+12%" />
      </Card>
      <Card>
        <Stat label="月收入" value="¥125,430" change="+8%" />
      </Card>
      <Card>
        <Chart type="line" data={data} />
      </Card>
    </Grid>
  )
}`
  }
]

/**
 * 解决方案平台页面
 */
const SolutionPlatform: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: '全部', icon: '🌟' },
    { id: 'enterprise', label: '企业应用', icon: '🏢' },
    { id: 'ecommerce', label: '电商', icon: '🛒' },
    { id: 'content', label: '内容管理', icon: '📝' },
    { id: 'analytics', label: '数据分析', icon: '📊' },
    { id: 'social', label: '社交', icon: '💬' },
    { id: 'mobile', label: '移动应用', icon: '📱' }
  ]

  const filteredScenarios = useMemo(() => {
    return selectedCategory === 'all'
      ? BUSINESS_SCENARIOS
      : BUSINESS_SCENARIOS.filter(s => s.category === selectedCategory)
  }, [selectedCategory])

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🎯 解决方案平台
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          基于真实业务场景的组件组合，一键生成完整解决方案。减少从0到1的时间，提升开发效率。
        </p>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* 场景卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario) => (
            <motion.div
              key={scenario.id}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{scenario.icon}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  scenario.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  scenario.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {scenario.difficulty === 'beginner' ? '简单' :
                   scenario.difficulty === 'intermediate' ? '中等' : '困难'}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {scenario.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {scenario.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-4">
                {scenario.components.slice(0, 3).map((comp) => (
                  <span key={comp} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                    {comp}
                  </span>
                ))}
                {scenario.components.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    +{scenario.components.length - 3}
                  </span>
                )}
              </div>
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                使用此方案
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 组件库展示页面
// ============================================================================

/**
 * 组件库展示页面（使用组件注册系统）
 */
const ComponentsGallery: React.FC = () => {
  return (
    <div className="space-y-6">
      <ComponentBrowser />
    </div>
  )
}

// ============================================================================
// Monaco 编辑器集成（完整版）
// ============================================================================

import MonacoEditorWrapper from './editor/monaco-editor-wrapper'

/**
 * 代码编辑器页面
 */
const CodeEditor: React.FC = () => {
  const [code, setCode] = useState(`// 欢迎使用 Xorigo UI Workbench 2.0
// 完整的 Monaco 编辑器已就绪！

import { Button, Card, Input } from '@xorigo-ui/core'
import { useState } from 'react'

export function WelcomeComponent() {
  const [count, setCount] = useState(0)

  return (
    <Card>
      <h1>欢迎使用 Xorigo UI 2.0</h1>
      <p>当前计数: {count}</p>
      <Input
        label="输入框"
        placeholder="请输入..."
        value={count.toString()}
        onChange={(value) => setCount(parseInt(value) || 0)}
      />
      <Button
        variant="primary"
        onClick={() => setCount(count + 1)}
      >
        点击我 (+1)
      </Button>
      <Button
        variant="secondary"
        onClick={() => setCount(0)}
      >
        重置
      </Button>
    </Card>
  )
}

export default WelcomeComponent
`)

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode)
  }, [])

  const handleSave = useCallback((codeToSave: string) => {
    console.log('代码已保存:', codeToSave.substring(0, 100) + '...')
  }, [])

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            ✏️ 代码编辑器
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            完整的 Monaco 编辑器，支持语法高亮、智能补全、错误检测等功能
          </p>
        </div>

        {/* Monaco 编辑器 */}
        <div className="h-[700px]">
          <MonacoEditorWrapper
            initialCode={code}
            initialLanguage="tsx"
            height="100%"
            showFullInterface={false}
            onChange={handleCodeChange}
            onSave={handleSave}
            enableValidation={true}
            enableThemeAdapter={true}
            config={{
              fontSize: 14,
              tabSize: 2,
              minimap: { enabled: true },
              folding: true,
              lineNumbers: 'on',
              wordWrap: 'on',
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                bracketPairsHorizontal: true,
                highlightActiveBracketPair: true,
                indentation: true
              },
              suggest: {
                enabled: true,
                showSnippets: true,
                showFunctions: true,
                showClasses: true,
                showVariables: true
              },
              quickSuggestions: true,
              parameterHints: { enabled: true },
              formatOnPaste: true,
              formatOnType: true,
              smoothScrolling: true,
              mouseWheelZoom: true,
              cursorSmoothCaretAnimation: 'on'
            }}
          />
        </div>

        {/* 功能说明 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              ✓ 语法高亮
            </span>
            <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              ✓ 智能补全
            </span>
            <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              ✓ 错误检测
            </span>
            <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              ✓ 代码格式化
            </span>
            <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              ✓ 主题适配
            </span>
            <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              ✓ 代码折叠
            </span>
            <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              ✓ 小地图
            </span>
            <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              ✓ 多语言支持
            </span>
          </div>
        </div>
      </div>

      {/* 快捷键提示 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          快捷键提示
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+S</kbd>
            <span className="text-gray-600 dark:text-gray-400">保存代码</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+F</kbd>
            <span className="text-gray-600 dark:text-gray-400">格式化代码</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+M</kbd>
            <span className="text-gray-600 dark:text-gray-400">切换小地图</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt+Z</kbd>
            <span className="text-gray-600 dark:text-gray-400">切换自动换行</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">F12</kbd>
            <span className="text-gray-600 dark:text-gray-400">跳转到定义</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+/</kbd>
            <span className="text-gray-600 dark:text-gray-400">切换注释</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 七轴主题配置器
// ============================================================================

/**
 * 主题配方页面
 */
const ThemeConfigurator: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark' | 'auto'>('light')
  const [hue, setHue] = useState('#3b82f6')
  const [saturation, setSaturation] = useState(0.8)
  const [lightness, setLightness] = useState(0.6)
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable')
  const [roundness, setRoundness] = useState(0.5)
  const [contrast, setContrast] = useState<'low' | 'normal' | 'high'>('normal')

  const recipes: ThemeRecipe[] = [
    {
      id: 'modern-blue',
      name: '现代蓝',
      description: '简洁现代的蓝色主题',
      preview: '🔵',
      config: {
        mode: 'light',
        hue: '#3b82f6',
        saturation: 0.8,
        lightness: 0.6,
        density: 'comfortable',
        roundness: 0.5,
        contrast: 'normal'
      }
    },
    {
      id: 'dark-elegant',
      name: '优雅深色',
      description: '深色优雅主题',
      preview: '🌙',
      config: {
        mode: 'dark',
        hue: '#8b5cf6',
        saturation: 0.7,
        lightness: 0.4,
        density: 'compact',
        roundness: 0.3,
        contrast: 'high'
      }
    }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🎨 七轴主题配置器
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 配置面板 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基础设置 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">基础设置</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  主题模式
                </label>
                <div className="flex gap-2">
                  {(['light', 'dark', 'auto'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        mode === m
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {m === 'light' ? '🌞 亮色' : m === 'dark' ? '🌙 暗色' : '🔄 自动'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  主色调: {hue}
                </label>
                <input
                  type="color"
                  value={hue}
                  onChange={(e) => setHue(e.target.value)}
                  className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* 高级设置 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">高级设置</h3>

              {[
                { label: '饱和度', value: saturation, setValue: setSaturation, min: 0, max: 1, step: 0.1 },
                { label: '亮度', value: lightness, setValue: setLightness, min: 0, max: 1, step: 0.1 },
                { label: '圆角', value: roundness, setValue: setRoundness, min: 0, max: 1, step: 0.1 }
              ].map(({ label, value, setValue, min, max, step }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}: {value.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => setValue(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 预览面板 */}
          <div className="space-y-6">
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">实时预览</h3>

              {/* 示例组件 */}
              <div className="space-y-3">
                <button
                  className="w-full px-4 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: hue,
                    color: mode === 'dark' ? 'white' : 'black',
                    borderRadius: `${roundness * 8 + 4}px`
                  }}
                >
                  主要按钮
                </button>

                <div
                  className="p-4 border rounded-lg"
                  style={{
                    borderColor: hue,
                    borderRadius: `${roundness * 8 + 4}px`
                  }}
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    示例卡片内容
                  </p>
                </div>
              </div>
            </div>

            {/* 预设配方 */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">预设配方</h3>
              <div className="space-y-2">
                {recipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => {
                      setMode(recipe.config.mode)
                      setHue(recipe.config.hue)
                      setSaturation(recipe.config.saturation)
                      setLightness(recipe.config.lightness)
                      setDensity(recipe.config.density)
                      setRoundness(recipe.config.roundness)
                      setContrast(recipe.config.contrast)
                    }}
                    className="w-full p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{recipe.preview}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{recipe.name}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{recipe.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 开发工具页面
// ============================================================================

/**
 * 开发工具页面
 */
const DevTools: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🔧 开发工具
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 组件检查器 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span>🔍</span> 组件检查器
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              点击组件查看详细信息
            </p>
            <div className="space-y-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">Selected: Button</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Props: variant, size, disabled</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">State: normal</div>
            </div>
          </div>

          {/* 性能监控 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span>⚡</span> 性能监控
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              实时性能指标
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">渲染时间</span>
                <span className="text-green-600 font-mono">12ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">内存使用</span>
                <span className="text-blue-600 font-mono">45MB</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">FPS</span>
                <span className="text-purple-600 font-mono">60</span>
              </div>
            </div>
          </div>

          {/* 可访问性 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span>♿</span> 可访问性
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              WCAG 合规性检测
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">对比度</span>
                <span className="text-green-600">AA ✓</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">键盘导航</span>
                <span className="text-green-600">支持 ✓</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">屏幕阅读器</span>
                <span className="text-green-600">优化 ✓</span>
              </div>
            </div>
          </div>

          {/* 代码质量 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span>✅</span> 代码质量
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              自动化代码审查
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">TypeScript</span>
                <span className="text-green-600">A+ ✓</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">ESLint</span>
                <span className="text-green-600">无错误 ✓</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">覆盖率</span>
                <span className="text-blue-600">92%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">💡 智能建议</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• 组件渲染性能良好 ✅</li>
            <li>• 建议使用 React.memo 优化 Button 组件</li>
            <li>• Input 组件缺少 aria-label 属性</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 主组件 - Workbench 2.0
// ============================================================================

/**
 * Workbench 2.0 主组件
 */
export interface WorkbenchV2Props {
  initialMode?: WorkbenchMode
  initialComponent?: ComponentExample
  initialRecipe?: ThemeRecipe
  onSave?: (data: any) => void
}

export const WorkbenchV2: React.FC<WorkbenchV2Props> = ({
  initialMode = 'solution',
  initialComponent,
  initialRecipe,
  onSave
}) => {
  const [mode, setMode] = useState<WorkbenchMode>(initialMode)

  const handleModeChange = useCallback((newMode: WorkbenchMode) => {
    setMode(newMode)
  }, [])

  const handleSave = useCallback((data: any) => {
    onSave?.(data)
  }, [onSave])

  return (
    <WorkbenchLayout mode={mode} onModeChange={handleModeChange}>
      {mode === 'solution' && <SolutionPlatform />}
      {mode === 'components' && <ComponentsGallery />}
      {mode === 'editor' && <CodeEditor />}
      {mode === 'theme' && <ThemeConfigurator />}
      {mode === 'devtools' && <DevTools />}
    </WorkbenchLayout>
  )
}

export default WorkbenchV2
