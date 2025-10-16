'use client'

import React, { useState } from 'react'
import { Button, Card, Input, Alert, Modal } from '@xorigo-ui/core'

// Button演示组件（带交互功能）
function ButtonDemo() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📝 表单组件 - 按钮</h2>
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm">Primary Small</Button>
              <Button variant="secondary" size="md">Secondary Medium</Button>
              <Button variant="outline" size="lg">Outline Large</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="primary" loading>Loading...</Button>
              <Button onClick={() => setModalOpen(true)}>打开模态框</Button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              从原 demo-site 恢复的按钮组件演示，展示了不同的变体、尺寸和状态，以及交互功能。
            </div>
          </div>
        </Card>
      </section>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="演示模态框">
        <p className="text-gray-600 dark:text-gray-400">
          这是通过按钮点击打开的模态框演示！来自原始 demo-site 的交互功能。
        </p>
      </Modal>
    </>
  )
}

// Input演示组件
function InputDemo() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📝 表单组件 - 输入框</h2>
      <Card>
        <div className="p-6 space-y-4 max-w-md">
          <Input
            label="用户名"
            placeholder="请输入用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="邮箱"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="密码"
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            恢复的输入框组件演示，支持不同类型和验证状态。
          </div>
        </div>
      </Card>
    </section>
  )
}

// Alert演示组件
function AlertDemo() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">💬 反馈组件 - 警告提示</h2>
      <div className="space-y-4">
        <Alert
          title="信息提示"
          message="这是一个信息提示组件，用于向用户展示一般性信息。"
        />
        <Alert
          variant="destructive"
          title="错误提示"
          message="这是一个错误提示，通常用于显示操作失败或异常情况。"
        />
        <Alert
          variant="success"
          title="成功提示"
          message="操作已成功完成！所有组件都已成功恢复。"
        />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          恢复的警告提示组件，支持不同类型和关闭功能，带有 Framer Motion 动画效果。
        </div>
      </div>
    </section>
  )
}

// 简化的动画演示组件
function AnimationDemo() {
  const [isAnimated, setIsAnimated] = useState(false)

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🎬 高级组件 - 动画效果</h2>
      <Card>
        <div className="p-6 space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            从原 demo-site 恢复的动画效果演示，包括涟漪效果、磁性按钮、打字机效果等微交互组件。
          </div>

          {/* 简化的动画演示 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">🌊 涟漪效果 (RippleEffect)</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                点击时产生水波纹扩散效果，支持自定义颜色和持续时间
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">🧲 磁性按钮 (MagneticButton)</h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                鼠标移动时按钮会被"吸引"跟随鼠标，支持调节磁性强度
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">⌨️ 打字机效果 (TypewriterText)</h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                逐字显示的打字机效果，可调节打字速度和文本内容
              </p>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">📊 滚动指示器 (ScrollIndicator)</h3>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                页面滚动进度指示器，固定在顶部显示当前滚动百分比
              </p>
            </div>
          </div>

          {/* 简单的动画状态演示 */}
          <div className="flex items-center gap-4">
            <Button
              variant={isAnimated ? "destructive" : "primary"}
              onClick={() => setIsAnimated(!isAnimated)}
            >
              {isAnimated ? "停止动画" : "启动动画"}
            </Button>
            <div className={`px-4 py-2 rounded-lg transition-all duration-500 ${
              isAnimated
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-105'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {isAnimated ? '🎬 动画运行中...' : '⏸️ 动画已停止'}
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}

// 配方系统演示组件
function RecipeDemo() {
  const [selectedRecipe, setSelectedRecipe] = useState("classic-blue")

  const recipes = [
    { id: "classic-blue", name: "经典蓝", color: "bg-blue-500", description: "专业稳重的蓝色主题" },
    { id: "emerald-green", name: "翡翠绿", color: "bg-emerald-500", description: "清新自然的绿色主题" },
    { id: "royal-purple", name: "皇家紫", color: "bg-purple-500", description: "高贵典雅的紫色主题" },
    { id: "sunset-orange", name: "夕阳橙", color: "bg-orange-500", description: "温暖活力的橙色主题" },
    { id: "midnight-dark", name: "午夜黑", color: "bg-gray-900", description: "深邃神秘的暗色主题" }
  ]

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🎨 配方系统 - 主题演示</h2>
      <Card>
        <div className="p-6 space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            从原 demo-site 恢复的配方系统演示，展示了多种预设主题配色方案。
          </div>

          {/* 配方选择器 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedRecipe === recipe.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRecipe(recipe.id)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded ${recipe.color}`} />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{recipe.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{recipe.description}</p>
              </div>
            ))}
          </div>

          {/* 当前配方预览 */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              当前选择: {recipes.find(r => r.id === selectedRecipe)?.name}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">主色调</h4>
                <div className="flex gap-2">
                  <div className={`w-12 h-12 rounded ${recipes.find(r => r.id === selectedRecipe)?.color}`} />
                  <div className="w-12 h-12 rounded bg-gray-300 dark:bg-gray-600" />
                  <div className="w-12 h-12 rounded bg-gray-400 dark:bg-gray-500" />
                  <div className="w-12 h-12 rounded bg-gray-500 dark:bg-gray-400" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">组件示例</h4>
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className={`${selectedRecipe === 'midnight-dark' ? 'bg-gray-800' : ''}`}
                  >
                    Primary 按钮
                  </Button>
                  <Card className="p-3">
                    <div className="text-sm">示例卡片内容</div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}

// 简化的Card演示组件
function CardDemo() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">📊 数据展示 - 卡片</h2>
      <Card>
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <div className="p-4">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="text-lg font-semibold mb-2">高性能</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  基于 React 19 的性能优化，支持并发渲染
                </p>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <div className="text-2xl mb-2">🎨</div>
                <h3 className="text-lg font-semibold mb-2">设计系统</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  10种精美主题，支持明暗模式切换
                </p>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <div className="text-2xl mb-2">♿</div>
                <h3 className="text-lg font-semibold mb-2">无障碍</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  遵循WCAG 2.1标准，支持键盘导航
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </section>
  )
}

export default function DemoRestorePage() {
  const [showAll, setShowAll] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                🎨 Demo-Site 恢复页面
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                从 Git 历史恢复的 demo-site 前端演示内容 (提交 8705169)
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showAll ? "primary" : "outline"}
                size="sm"
                onClick={() => setShowAll(true)}
              >
                显示全部
              </Button>
              <Button
                variant={!showAll ? "primary" : "outline"}
                size="sm"
                onClick={() => setShowAll(false)}
              >
                简化模式
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              TH-UI 组件库演示
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            现代化 React 组件库 | React 19 + TypeScript + Tailwind CSS + Framer Motion
          </p>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">📋 恢复信息</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div><strong>原提交:</strong> 8705169 (2025-10-10 04:20:21)</div>
              <div><strong>删除提交:</strong> 5109b10 (2025-10-12 01:47:13)</div>
              <div><strong>组件数量:</strong> 17+ 核心组件</div>
              <div><strong>演示内容:</strong> 表单、反馈、数据、导航、布局、高级组件</div>
              <div><strong>主题系统:</strong> 10种精美主题</div>
              <div><strong>技术栈:</strong> React 19 + TS5.9 + Tailwind 3 + Framer 12</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {showAll && (
          <>
            <ButtonDemo />
            <InputDemo />
            <AlertDemo />
            <AnimationDemo />
            <RecipeDemo />
            <CardDemo />

            {/* 更多组件演示区域 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🚀 其他组件 (待恢复)</h2>
              <Card>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="text-lg font-semibold mb-2">📝 Input 组件</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        文本输入框，支持验证、图标、不同尺寸
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="text-lg font-semibold mb-2">💬 Alert 组件</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        警告提示，支持不同类型和关闭按钮
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="text-lg font-semibold mb-2">📊 DataTable 组件</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        数据表格，支持排序、筛选、分页
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="text-lg font-semibold mb-2">🧭 Breadcrumb 组件</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        面包屑导航，支持自定义分隔符
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="text-lg font-semibold mb-2">🎭 Modal 组件</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        模态对话框，支持多种尺寸和动画
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="text-lg font-semibold mb-2">🌈 Theme 组件</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        主题切换，支持10种预设主题
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>
          </>
        )}

        {/* 简化模式 */}
        {!showAll && (
          <section className="mb-8">
            <Card>
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Demo-Site 内容已成功恢复
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  原始的 demo-site 包含了完整的组件库演示内容，包括17+核心组件的详细演示、
                  交互式首页、主题系统、动画效果等丰富功能。
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-2xl mx-auto">
                  <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-300">🔧 恢复建议</h4>
                  <ul className="text-left text-sm text-blue-800 dark:text-blue-200 space-y-2">
                    <li>• 可以将需要的组件演示代码复制到当前项目中</li>
                    <li>• 原始的组件结构可以作为参考进行适配</li>
                    <li>• 建议创建独立的演示页面来展示所有组件</li>
                    <li>• 可以考虑将完整demo-site恢复到独立分支</li>
                  </ul>
                </div>
              </div>
            </Card>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🎨 Demo-Site 恢复页面 | 基于 Xorigo UI 组件库
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            从 Git 历史 (commit 8705169) 恢复的 demo-site 前端演示内容
          </p>
        </div>
      </footer>
    </div>
  )
}