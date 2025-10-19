'use client'

import React, { useState, useEffect } from 'react'

// 直接内联设计令牌，避免依赖解析问题
const designTokens = {
  // 10个组件分类的颜色令牌
  categories: {
    'ui-basic': {
      name: 'UI基础组件',
      primary: '#3b82f6',
      secondary: '#06b6d4',
      gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
      hoverGradient: 'linear-gradient(135deg, #2563eb, #0891b2)',
      selectedGradient: 'linear-gradient(135deg, #1d4ed8, #0e7490)',
    },
    'inputs': {
      name: '输入控件',
      primary: '#f97316',
      secondary: '#fb923c',
      gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
      hoverGradient: 'linear-gradient(135deg, #ea580c, #f59e0b)',
      selectedGradient: 'linear-gradient(135deg, #c2410c, #d97706)',
    },
    'navigation': {
      name: '导航结构',
      primary: '#06b6d4',
      secondary: '#0ea5e9',
      gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
      hoverGradient: 'linear-gradient(135deg, #0891b2, #0284c7)',
      selectedGradient: 'linear-gradient(135deg, #0e7490, #0369a1)',
    },
    'feedback': {
      name: '反馈状态',
      primary: '#10b981',
      secondary: '#34d399',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      hoverGradient: 'linear-gradient(135deg, #059669, #10b981)',
      selectedGradient: 'linear-gradient(135deg, #047857, #059669)',
    },
    'overlays': {
      name: '弹层遮罩',
      primary: '#ef4444',
      secondary: '#f87171',
      gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
      hoverGradient: 'linear-gradient(135deg, #dc2626, #ef4444)',
      selectedGradient: 'linear-gradient(135deg, #b91c1c, #dc2626)',
    },
    'data-display': {
      name: '数据展示',
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      hoverGradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
      selectedGradient: 'linear-gradient(135deg, #6d28d9, #7c3aed)',
    },
    'layout': {
      name: '布局分区',
      primary: '#ec4899',
      secondary: '#f472b6',
      gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
      hoverGradient: 'linear-gradient(135deg, #db2777, #ec4899)',
      selectedGradient: 'linear-gradient(135deg, #be185d, #db2777)',
    },
    'charts': {
      name: '图表组件',
      primary: '#f59e0b',
      secondary: '#fbbf24',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      hoverGradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
      selectedGradient: 'linear-gradient(135deg, #b45309, #d97706)',
    },
    'forms': {
      name: '表单容器',
      primary: '#f43f5e',
      secondary: '#fb7185',
      gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)',
      hoverGradient: 'linear-gradient(135deg, #e11d48, #f43f5e)',
      selectedGradient: 'linear-gradient(135deg, #be123c, #e11d48)',
    },
    'utilities': {
      name: '工具类',
      primary: '#a16207',
      secondary: '#b45309',
      gradient: 'linear-gradient(135deg, #a16207, #b45309)',
      hoverGradient: 'linear-gradient(135deg, #854d0e, #a16207)',
      selectedGradient: 'linear-gradient(135deg, #713f12, #854d0e)',
    }
  }
}

// 获取分类颜色配置的函数
const getCategoryColors = (category: string) => {
  return designTokens.categories[category as keyof typeof designTokens.categories]
}

// 基于令牌的渐变组件
const GradientText = ({
  children,
  category = 'ui-basic',
  state = 'normal',
  as: Component = 'span',
  className = ''
}: {
  children: React.ReactNode
  category?: string
  state?: 'normal' | 'hover' | 'selected'
  as?: keyof JSX.IntrinsicElements
  className?: string
}) => {
  const colors = getCategoryColors(category)

  if (!colors) {
    console.warn(`GradientText: 未找到分类 "${category}" 的颜色配置`)
    return React.createElement(Component, { className }, children)
  }

  // 根据状态选择渐变
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

  return React.createElement(Component, { className, style: gradientStyle }, children)
}

// 基于令牌的渐变背景组件
const GradientBackground = ({
  children,
  category = 'ui-basic',
  state = 'normal',
  as: Component = 'div',
  animated = false,
  animationDuration = 3,
  className = ''
}: {
  children: React.ReactNode
  category?: string
  state?: 'normal' | 'hover' | 'selected'
  as?: keyof JSX.IntrinsicElements
  animated?: boolean
  animationDuration?: number
  className?: string
}) => {
  const colors = getCategoryColors(category)

  if (!colors) {
    console.warn(`GradientBackground: 未找到分类 "${category}" 的颜色配置`)
    return React.createElement(Component, { className }, children)
  }

  // 根据状态选择渐变
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

  const baseStyle = {
    background: gradient
  }

  const animatedStyle = animated ? {
    ...baseStyle,
    backgroundSize: '200% 200%',
    animation: `gradient-flow ${animationDuration}s ease-in-out infinite`
  } : baseStyle

  return React.createElement(Component, { className, style: animatedStyle }, children)
}

// 基于令牌的渐变边框组件
const GradientBorder = ({
  children,
  category = 'ui-basic',
  state = 'normal',
  borderWidth = 2,
  as: Component = 'div',
  className = ''
}: {
  children: React.ReactNode
  category?: string
  state?: 'normal' | 'hover' | 'selected'
  borderWidth?: number
  as?: keyof JSX.IntrinsicElements
  className?: string
}) => {
  const colors = getCategoryColors(category)

  if (!colors) {
    console.warn(`GradientBorder: 未找到分类 "${category}" 的颜色配置`)
    return React.createElement(Component, { className }, children)
  }

  // 根据状态选择渐变
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

  const borderStyle = {
    background: gradient,
    padding: `${borderWidth}px`,
    position: 'relative' as const
  }

  return React.createElement(Component, { className, style: borderStyle }, children)
}

export default function GradientTokenStandalone() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    )
  }

  const categories = Object.keys(designTokens.categories)
  const states = ['normal', 'hover', 'selected'] as const

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* 标题 - 使用导航分类的渐变 */}
        <h1 className="text-4xl font-bold text-center mb-8">
          <GradientText category="navigation" as="h1" className="inline-block">
            🎨 Xorigo UI 令牌化渐变演示 - 独立版本
          </GradientText>
        </h1>

        <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          基于 Xorigo UI 设计令牌系统的渐变组件演示。
          每个组件分类都有独特的配色方案，支持 normal、hover、selected 三种状态。
          <br />
          <span className="text-emerald-400">✅ 完全令牌化 | ✅ 组件化 | ✅ 语义化API</span>
        </p>

        {/* 组件分类概览 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText category="ui-basic" as="h2">
              组件分类配色方案
            </GradientText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <GradientBorder
                key={category}
                category={category}
                className="p-4 rounded-lg text-center"
              >
                <h3 className="font-semibold mb-2 capitalize">
                  <GradientText category={category} as="h3">
                    {category.replace('-', ' ')}
                  </GradientText>
                </h3>
                <p className="text-sm text-gray-400">
                  {designTokens.categories[category as keyof typeof designTokens.categories].name}
                </p>
              </GradientBorder>
            ))}
          </div>
        </section>

        {/* 文字渐变展示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText category="feedback" as="h2">
              文字渐变效果 - 令牌驱动
            </GradientText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category) => (
              <GradientBorder key={category} category={category} className="text-center p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-2">
                  <GradientText category={category} as="h3">
                    {category} 渐变文字
                  </GradientText>
                </h3>
                <p className="text-gray-400 text-sm">
                  分类: {category}
                </p>
              </GradientBorder>
            ))}
          </div>
        </section>

        {/* 背景渐变展示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText category="data-display" as="h2">
              背景渐变效果 - 令牌驱动
            </GradientText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category) => (
              <GradientBackground key={category} category={category} className="p-8 rounded-lg text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  {category} 背景渐变
                </h3>
                <p className="text-white/80">
                  使用 <GradientText category="glass" as="span">令牌系统</GradientText> 驱动
                </p>
              </GradientBackground>
            ))}
          </div>
        </section>

        {/* 状态变化展示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText category="overlays" as="h2">
              渐变状态变化
            </GradientText>
          </h2>
          <div className="space-y-8">
            {['ui-basic', 'inputs', 'navigation'].map((category) => (
              <div key={category} className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 capitalize">
                  <GradientText category={category} as="h3">
                    {category} 分类状态
                  </GradientText>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {states.map((state) => (
                    <GradientBorder
                      key={state}
                      category={category}
                      state={state}
                      className="p-4 rounded-lg text-center"
                    >
                      <GradientText category={category} state={state} as="h4" className="text-lg font-semibold mb-2">
                        {state}
                      </GradientText>
                      <p className="text-gray-400 text-sm">
                        {state} 状态渐变
                      </p>
                    </GradientBorder>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 动态渐变展示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText category="navigation" as="h2">
              动态渐变动画
            </GradientText>
          </h2>
          <div className="flex justify-center">
            <GradientBackground
              category="charts"
              animated={true}
              animationDuration={5}
              className="h-32 w-full max-w-2xl rounded-xl flex items-center justify-center"
            >
              <div className="text-white text-xl font-bold bg-black/30 px-6 py-3 rounded-lg">
                动态渐变演示 (5色循环)
              </div>
            </GradientBackground>
          </div>
        </section>

        {/* 技术实现 - 令牌化方式 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText category="layout" as="h2">
              令牌化技术实现
            </GradientText>
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <pre className="text-sm text-gray-300 overflow-x-auto">
{`// ✅ 令牌化方式 - 无硬编码，完全语义化
import { GradientText, GradientBackground, GradientBorder } from '@xorigo-ui/core'

// 基于组件分类的语义化渐变
<GradientText category="ui-basic" state="hover">
  UI组件文字
</GradientText>

<GradientBackground category="feedback" animated={true}>
  反馈背景
</GradientBackground>

<GradientBorder category="navigation" state="selected">
  导航边框
</GradientBorder>

// 🎯 令牌系统优势:
// - 无硬编码颜色值
// - 语义化API设计
// - 自动继承设计系统
// - 完全可扩展
// - 主题一致性保证

// 支持的10个组件分类:
// ui-basic, inputs, navigation, feedback, overlays,
// data-display, layout, charts, forms, utilities

// 支持的3种状态: normal, hover, selected`}
            </pre>
          </div>
        </section>

        {/* 令牌 vs 硬编码对比 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText category="feedback" as="h2">
              令牌化 vs 硬编码对比
            </GradientText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GradientBackground category="error" className="p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-white">❌ 硬编码方式</h3>
              <pre className="text-sm text-white/90">
{`const gradientPresets = {
  primary: 'linear-gradient(...)', // 手动定义
  success: 'linear-gradient(...)', // 手动定义
}
<span style={{
  background: gradientPresets.primary,
  WebkitBackgroundClip: 'text'
}}>
  渐变文字
</span>`}
              </pre>
            </GradientBackground>

            <GradientBackground category="success" className="p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-white">✅ 令牌化方式</h3>
              <pre className="text-sm text-white/90">
{`import { getCategoryColors } from '@xorigo-ui/tokens'

<GradientText category="ui-basic" state="hover">
  渐变文字
</GradientText>
// 自动从设计令牌系统获取`}
              </pre>
            </GradientBackground>
          </div>
        </section>

        {/* 导航 */}
        <div className="text-center space-y-4">
          <GradientBackground category="navigation" className="inline-block px-6 py-3 rounded-lg transition-all hover:scale-105">
            <a href="/" className="text-white font-semibold">
              ← 返回首页
            </a>
          </GradientBackground>
          <span className="mx-4 text-gray-500">|</span>
          <GradientBackground category="forms" className="inline-block px-6 py-3 rounded-lg transition-all hover:scale-105">
            <a href="/gradient-demo" className="text-white font-semibold">
              🚀 基础渐变演示
            </a>
          </GradientBackground>
          <span className="mx-4 text-gray-500">|</span>
          <GradientBackground category="overlays" className="inline-block px-6 py-3 rounded-lg transition-all hover:scale-105">
            <a href="/gradient-enhanced-demo" className="text-white font-semibold">
              🎨 渐变增强版
            </a>
          </GradientBackground>
        </div>

        {/* 底部信息 */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            🎯 Xorigo UI 令牌化渐变系统 - 完全组件化和令牌化实现
          </p>
          <p className="text-gray-500 text-xs mt-2">
            基于设计令牌驱动，无硬编码，语义化API设计
          </p>
        </div>
      </div>
    </div>
  )
}