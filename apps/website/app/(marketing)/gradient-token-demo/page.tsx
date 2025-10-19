'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 独立的令牌系统 - 不依赖外部包
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
    console.warn(`GradientText: 未找到分类 "${category}" 的颜色配置`)
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
  as?: keyof JSX.IntrinsicElements
  animated?: boolean
}>(({ children, category = 'ui-basic', state = 'normal', className = '', as: Component = 'div', animated = false, ...props }, ref) => {
  const colors = getCategoryColors(category)

  if (!colors) {
    console.warn(`GradientBackground: 未找到分类 "${category}" 的颜色配置`)
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
    ...(animated && {
      backgroundSize: '200% 200%',
      animation: 'gradientFlow 3s ease infinite'
    })
  }

  return (
    <Component
      ref={ref}
      className={className}
      style={gradientStyle}
      {...props}
    >
      {children}
      {animated && (
        <style jsx>{`
          @keyframes gradientFlow {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
        `}</style>
      )}
    </Component>
  )
})

GradientBackground.displayName = 'GradientBackground'

// 渐变边框组件
const GradientBorder = React.forwardRef<HTMLDivElement, {
  children: React.ReactNode
  category?: string
  state?: 'normal' | 'hover' | 'selected'
  className?: string
  as?: keyof JSX.IntrinsicElements
  animated?: boolean
}>(({ children, category = 'ui-basic', state = 'normal', className = '', as: Component = 'div', animated = false, ...props }, ref) => {
  const colors = getCategoryColors(category)

  if (!colors) {
    console.warn(`GradientBorder: 未找到分类 "${category}" 的颜色配置`)
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
    <Component
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
    </Component>
  )
})

GradientBorder.displayName = 'GradientBorder'

export default function GradientTokenDemo() {
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    )
  }

  // Xorigo UI 的10个组件分类
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* 标题 - 使用导航分类的渐变 */}
        <h1 className="text-4xl font-bold text-center mb-8">
          <GradientText category="navigation" as="h1" className="inline-block">
            🎨 Xorigo UI 令牌化渐变演示
          </GradientText>
        </h1>

        <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          基于 Xorigo UI 设计令牌系统的渐变组件演示。
          每个组件分类都有独特的配色方案，支持 normal、hover、selected 三种状态。
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
                  分类渐变展示
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
                  使用 <span className="font-semibold" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>令牌系统</span> 驱动
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

        {/* 技术实现 - 令牌化方式 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText category="layout" as="h2">
              令牌化技术实现
            </GradientText>
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <pre className="text-sm text-gray-300 overflow-x-auto">
{`// ✅ 正确的令牌化方式 - 无硬编码
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

// 支持的10个组件分类:
// ui-basic, inputs, navigation, feedback, overlays,
// data-display, layout, charts, forms, utilities

// 支持的3种状态: normal, hover, selected

// 令牌系统自动处理配色，无需手动管理颜色`}
            </pre>
          </div>
        </section>

        {/* 分类配色详情 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText category="charts" as="h2">
              分类配色详情
            </GradientText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 9).map((category) => {
              const colors = getCategoryColors(category)
              return (
                <GradientBackground key={category} category={category} className="p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-4 capitalize">
                    {category.replace('-', ' ')} 配色
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">主色</span>
                      <div className="w-8 h-8 rounded" style={{ background: colors.gradient }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">渐变</span>
                      <div className="w-8 h-8 rounded" style={{ background: colors.gradient }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">悬停</span>
                      <div className="w-8 h-8 rounded" style={{ background: colors.hoverGradient }} />
                    </div>
                  </div>
                </GradientBackground>
              )
            })}
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
      </div>
    </div>
  )
}