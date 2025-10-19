'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, Typography, Badge } from '@xorigo-ui/core'

// 独立的渐变令牌系统
const designTokens = {
  categories: {
    'ui-basic': {
      name: 'UI基础',
      gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      hoverGradient: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      selectedGradient: 'linear-gradient(135deg, #1d4ed8, #6d28d9)',
      description: '基础UI组件的渐变配色',
    },
    'inputs': {
      name: '输入组件',
      gradient: 'linear-gradient(135deg, #10b981, #3b82f6)',
      hoverGradient: 'linear-gradient(135deg, #059669, #2563eb)',
      selectedGradient: 'linear-gradient(135deg, #047857, #1d4ed8)',
      description: '输入框、表单等组件的渐变配色',
    },
    'navigation': {
      name: '导航组件',
      gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      hoverGradient: 'linear-gradient(135deg, #7c3aed, #db2777)',
      selectedGradient: 'linear-gradient(135deg, #6d28d9, #be185d)',
      description: '导航栏、菜单等组件的渐变配色',
    },
    'feedback': {
      name: '反馈组件',
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      hoverGradient: 'linear-gradient(135deg, #d97706, #dc2626)',
      selectedGradient: 'linear-gradient(135deg, #b45309, #b91c1c)',
      description: '提示、警告、反馈等组件的渐变配色',
    },
    'overlays': {
      name: '覆盖层组件',
      gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
      hoverGradient: 'linear-gradient(135deg, #0891b2, #2563eb)',
      selectedGradient: 'linear-gradient(135deg, #0e7490, #1d4ed8)',
      description: '弹窗、抽屉等覆盖层组件的渐变配色',
    },
    'data-display': {
      name: '数据显示',
      gradient: 'linear-gradient(135deg, #14b8a6, #22d3ee)',
      hoverGradient: 'linear-gradient(135deg, #0d9488, #06b6d4)',
      selectedGradient: 'linear-gradient(135deg, #0f766e, #0891b2)',
      description: '表格、图表等数据显示组件的渐变配色',
    },
    'layout': {
      name: '布局组件',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      hoverGradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      selectedGradient: 'linear-gradient(135deg, #4338ca, #6d28d9)',
      description: '容器、分隔符等布局组件的渐变配色',
    },
    'charts': {
      name: '图表组件',
      gradient: 'linear-gradient(135deg, #f97316, #eab308)',
      hoverGradient: 'linear-gradient(135deg, #ea580c, #ca8a04)',
      selectedGradient: 'linear-gradient(135deg, #c2410c, #a16207)',
      description: '统计图表、数据可视化组件的渐变配色',
    },
    'forms': {
      name: '表单组件',
      gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
      hoverGradient: 'linear-gradient(135deg, #9333ea, #db2777)',
      selectedGradient: 'linear-gradient(135deg, #7c3aed, #be185d)',
      description: '表单容器、字段组等表单组件的渐变配色',
    },
    'utilities': {
      name: '工具组件',
      gradient: 'linear-gradient(135deg, #0ea5e9, #14b8a6)',
      hoverGradient: 'linear-gradient(135deg, #0284c7, #0d9488)',
      selectedGradient: 'linear-gradient(135deg, #0369a1, #0f766e)',
      description: '通用工具、辅助组件的渐变配色',
    },
  },
}

const getCategoryColors = (category: string) => {
  return designTokens.categories[category as keyof typeof designTokens.categories] || designTokens.categories['ui-basic']
}

// 渐变文字组件
const GradientText = React.forwardRef<HTMLSpanElement, {
  children: React.ReactNode
  category?: string
  state?: 'normal' | 'hover' | 'selected'
  className?: string
  as?: keyof JSX.IntrinsicElements
}>(({ children, category = 'ui-basic', state = 'normal', className = '', as: Component = 'span', ...props }, ref) => {
  const colors = getCategoryColors(category)

  if (!colors) {
    return (
      <Component ref={ref} className={className} {...props}>
        {children}
      </Component>
    )
  }

  let gradient: string
  switch (state) {
    case 'hover':
      gradient = colors.hoverGradient
      break
    case 'selected':
      gradient = colors.selectedGradient
      break
    default:
      gradient = colors.gradient
  }

  const gradientStyle = {
    background: gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }

  return (
    <Component
      ref={ref}
      className={className}
      style={gradientStyle}
      {...props}
    >
      {children}
    </Component>
  )
})

GradientText.displayName = 'GradientText'

// 渐变背景组件
const GradientBackground = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode
  category?: string
  state?: 'normal' | 'hover' | 'selected'
  className?: string
  animated?: boolean
}>(({ children, category = 'ui-basic', state = 'normal', className = '', animated = false, ...props }, ref) => {
  const colors = getCategoryColors(category)

  if (!colors) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    )
  }

  let gradient: string
  switch (state) {
    case 'hover':
      gradient = colors.hoverGradient
      break
    case 'selected':
      gradient = colors.selectedGradient
      break
    default:
      gradient = colors.gradient
  }

  const gradientStyle = {
    background: gradient,
    ...(animated && {
      backgroundSize: '200% 200%',
      animation: 'gradientFlow 3s ease infinite'
    })
  }

  return (
    <div
      ref={ref}
      className={className}
      style={gradientStyle}
      {...props}
    >
      {children}
    </div>
  )
})

GradientBackground.displayName = 'GradientBackground'

// 渐变边框组件
const GradientBorder = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode
  category?: string
  state?: 'normal' | 'hover' | 'selected'
  className?: string
  animated?: boolean
}>(({ children, category = 'ui-basic', state = 'normal', className = '', animated = false, ...props }, ref) => {
  const colors = getCategoryColors(category)

  if (!colors) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    )
  }

  let gradient: string
  switch (state) {
    case 'hover':
      gradient = colors.hoverGradient
      break
    case 'selected':
      gradient = colors.selectedGradient
      break
    default:
      gradient = colors.gradient
  }

  const gradientStyle = {
    position: 'relative' as const,
    background: '#ffffff',
    ...(animated && {
      background: colors.gradient,
      backgroundSize: '200% 200%',
      animation: 'gradientFlow 3s ease infinite'
    })
  }

  const beforeStyle = {
    content: '""',
    position: 'absolute' as const,
    inset: '0',
    padding: '2px',
    background: gradient,
    borderRadius: 'inherit',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'xor',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    ...(animated && {
      backgroundSize: '200% 200%',
      animation: 'gradientFlow 3s ease infinite'
    })
  }

  return (
    <div
      ref={ref}
      className={className}
      style={gradientStyle}
      {...props}
    >
      <div style={beforeStyle} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
      {animated && (
        <style jsx>{`
          @keyframes gradientFlow {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
        `}</style>
      )}
    </div>
  )
})

GradientBorder.displayName = 'GradientBorder'

export function GradientDemo() {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'states' | 'code'>('overview')
  const [selectedCategory, setSelectedCategory] = useState('ui-basic')
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  const categories = [
    'ui-basic',
    'inputs',
    'navigation',
    'feedback',
    'overlays',
    'data-display',
    'layout',
    'charts',
    'forms',
    'utilities'
  ] as const

  const states = ['normal', 'hover', 'selected'] as const

  return (
    <div className="space-y-8">
      {/* 标题和说明 */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            <GradientText category="navigation" as="h1">
              🎨 Xorigo UI 令牌化渐变系统
            </GradientText>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            基于 Xorigo UI 设计令牌系统的渐变组件演示。10个组件分类，3种状态变化，完全消除硬编码渐变。
          </p>
        </motion.div>
      </div>

      {/* 标签导航 */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800">
          {[
            { id: 'overview', label: '总览', icon: '🎯' },
            { id: 'components', label: '组件', icon: '🧩' },
            { id: 'states', label: '状态', icon: '🔄' },
            { id: 'code', label: '代码', icon: '📝' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* 分类概览 */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  <GradientText category="ui-basic" as="h2">
                    10个组件分类配色方案
                  </GradientText>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {categories.map((category) => {
                    const colors = getCategoryColors(category)
                    return (
                      <motion.div
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        onHoverStart={() => setHoveredCategory(category)}
                        onHoverEnd={() => setHoveredCategory(null)}
                      >
                        <GradientBorder
                          category={category}
                          className="p-4 rounded-lg text-center cursor-pointer"
                        >
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full" style={{ background: colors.gradient }} />
                          <h3 className="font-semibold mb-1 capitalize text-sm">
                            <GradientText category={category} as="h3">
                              {category.replace('-', ' ')}
                            </GradientText>
                          </h3>
                          <p className="text-xs text-gray-500">{colors.description}</p>
                        </GradientBorder>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* 快速演示 */}
              <div className="grid md:grid-cols-2 gap-6">
                <GradientBackground category="navigation" className="p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">渐变文字效果</h3>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold">
                      <GradientText category="ui-basic">UI基础 渐变文字</GradientText>
                    </div>
                    <div className="text-xl font-semibold">
                      <GradientText category="feedback">反馈组件 渐变文字</GradientText>
                    </div>
                    <div className="text-lg">
                      <GradientText category="data-display">数据显示 渐变文字</GradientText>
                    </div>
                  </div>
                </GradientBackground>

                <GradientBackground category="charts" animated className="p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">动画渐变背景</h3>
                  <p className="text-white/90 mb-4">
                    支持流畅的渐变动画效果，可以创建动态视觉体验。
                  </p>
                  <div className="space-y-2">
                    <Badge className="bg-white/20 text-white border-white/30">
                      动画效果
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30">
                      流畅过渡
                    </Badge>
                  </div>
                </GradientBackground>
              </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-center">
                <GradientText category="feedback" as="h2">
                  三种渐变组件类型
                </GradientText>
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {/* GradientText */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">GradientText</h3>
                  <div className="space-y-3 mb-4">
                    <div className="text-2xl font-bold">
                      <GradientText category="ui-basic">渐变文字</GradientText>
                    </div>
                    <div className="text-xl">
                      <GradientText category="inputs">输入组件</GradientText>
                    </div>
                    <div className="text-lg">
                      <GradientText category="navigation">导航分类</GradientText>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    适用于标题、标语等文字元素的渐变效果
                  </p>
                </Card>

                {/* GradientBackground */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">GradientBackground</h3>
                  <div className="space-y-3 mb-4">
                    <GradientBackground category="feedback" className="p-4 rounded-lg text-white text-center">
                      反馈背景
                    </GradientBackground>
                    <GradientBackground category="overlays" className="p-3 rounded-lg text-white text-center text-sm">
                      覆盖层背景
                    </GradientBackground>
                  </div>
                  <p className="text-sm text-gray-600">
                    适用于容器、卡片等背景元素的渐变效果
                  </p>
                </Card>

                {/* GradientBorder */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">GradientBorder</h3>
                  <div className="space-y-3 mb-4">
                    <GradientBorder category="data-display" className="p-3 rounded-lg text-center">
                      数据显示边框
                    </GradientBorder>
                    <GradientBorder category="layout" className="p-2 rounded-lg text-center text-sm">
                      布局边框
                    </GradientBorder>
                  </div>
                  <p className="text-sm text-gray-600">
                    适用于按钮、输入框等边框元素的渐变效果
                  </p>
                </Card>
              </div>

              {/* 组件选择器演示 */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">交互式组件选择器</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="text-xl font-bold mb-2">
                      <GradientText category={selectedCategory}>
                        {selectedCategory} 渐变文字
                      </GradientText>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <GradientBackground category={selectedCategory} className="p-4 rounded-lg text-white">
                      {selectedCategory} 背景渐变
                    </GradientBackground>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <GradientBorder category={selectedCategory} className="p-4 rounded-lg">
                      {selectedCategory} 边框渐变
                    </GradientBorder>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'states' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-center">
                <GradientText category="overlays" as="h2">
                  渐变状态变化演示
                </GradientText>
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {['ui-basic', 'inputs', 'navigation'].map((category) => (
                  <Card key={category} className="p-6">
                    <h3 className="text-lg font-semibold mb-4 capitalize">
                      <GradientText category={category} as="h3">
                        {category} 分类状态
                      </GradientText>
                    </h3>
                    <div className="space-y-3">
                      {states.map((state) => (
                        <GradientBorder
                          key={state}
                          category={category}
                          state={state}
                          className="p-3 rounded-lg text-center"
                        >
                          <div className="font-semibold mb-1 capitalize">
                            {state} 状态
                          </div>
                          <div className="text-sm text-gray-600">
                            {category} - {state}
                          </div>
                        </GradientBorder>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {/* 状态对比 */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">配色状态对比</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="text-left py-2">组件分类</th>
                        <th className="text-center py-2">Normal</th>
                        <th className="text-center py-2">Hover</th>
                        <th className="text-center py-2">Selected</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.slice(0, 6).map((category) => {
                        const colors = getCategoryColors(category)
                        return (
                          <tr key={category} className="border-b dark:border-gray-700">
                            <td className="py-2 capitalize">{category.replace('-', ' ')}</td>
                            <td className="text-center py-2">
                              <div className="w-8 h-8 mx-auto rounded" style={{ background: colors.gradient }} />
                            </td>
                            <td className="text-center py-2">
                              <div className="w-8 h-8 mx-auto rounded" style={{ background: colors.hoverGradient }} />
                            </td>
                            <td className="text-center py-2">
                              <div className="w-8 h-8 mx-auto rounded" style={{ background: colors.selectedGradient }} />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-center">
                <GradientText category="layout" as="h2">
                  令牌化代码实现
                </GradientText>
              </h2>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">基础用法</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// ✅ 正确的令牌化方式 - 无硬编码
import { GradientText, GradientBackground, GradientBorder } from '@xorigo-ui/core'

// 渐变文字
<GradientText category="ui-basic" state="hover">
  UI组件文字
</GradientText>

// 渐变背景
<GradientBackground category="feedback" animated={true}>
  反馈背景
</GradientBackground>

// 渐变边框
<GradientBorder category="navigation" state="selected">
  导航边框
</GradientBorder>`}
                </pre>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">支持的组件分类</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ background: getCategoryColors(category).gradient }} />
                        <span className="capitalize">{category.replace('-', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">支持的状态</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">normal</Badge>
                      <span>默认状态</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="primary">hover</Badge>
                      <span>悬停状态</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">selected</Badge>
                      <span>选中状态</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
                  🎯 核心优势
                </h3>
                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <li>• <strong>语义化设计</strong>：基于组件分类的渐变配色，符合设计逻辑</li>
                  <li>• <strong>状态管理</strong>：支持 normal、hover、selected 三种状态</li>
                  <li>• <strong>完全令牌化</strong>：使用设计令牌系统，无硬编码颜色</li>
                  <li>• <strong>易于维护</strong>：统一管理所有渐变配色，易于主题切换</li>
                  <li>• <strong>类型安全</strong>：完整的 TypeScript 类型支持</li>
                  <li>• <strong>动画支持</strong>：内置流畅的渐变动画效果</li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 悬停提示 */}
      {hoveredCategory && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-xs z-50"
        >
          <div className="font-semibold mb-1">
            {getCategoryColors(hoveredCategory).name}
          </div>
          <div className="text-sm text-gray-300">
            {getCategoryColors(hoveredCategory).description}
          </div>
        </motion.div>
      )}
    </div>
  )
}