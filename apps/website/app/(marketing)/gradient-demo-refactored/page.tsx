'use client'

import React, { useState, useEffect } from 'react'
import { GradientText, GradientBackground, GradientBorder } from '@xorigo-ui/core'

export default function GradientDemoRefactored() {
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* 使用渐变文字组件 */}
        <h1 className="text-4xl font-bold text-center mb-8">
          <GradientText preset="rainbow" as="h1" className="inline-block">
            🎨 组件化渐变演示页面
          </GradientText>
        </h1>

        {/* 文字渐变展示 - 使用组件化方式 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText preset="primary" as="h2">
              文字渐变效果
            </GradientText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['primary', 'success', 'warning', 'error', 'info', 'glass'].map((preset) => (
              <GradientBorder key={preset} preset={preset as any} borderWidth={3} className="text-center p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-2">
                  <GradientText preset={preset as any} as="h3">
                    {preset} 渐变文字
                  </GradientText>
                </h3>
                <p className="text-gray-400 text-sm">
                  预设: {preset}
                </p>
              </GradientBorder>
            ))}
          </div>
        </section>

        {/* 背景渐变展示 - 使用组件化方式 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText preset="success" as="h2">
              背景渐变效果
            </GradientText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['primary', 'success', 'warning', 'error'].map((preset) => (
              <GradientBackground key={preset} preset={preset as any} className="p-8 rounded-lg text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  {preset} 背景渐变
                </h3>
                <p className="text-white/80">
                  使用 <GradientText preset="glass" as="span">GradientBackground</GradientText> 组件创建
                </p>
              </GradientBackground>
            ))}
          </div>
        </section>

        {/* 边框渐变展示 - 使用组件化方式 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText preset="info" as="h2">
              边框渐变效果
            </GradientText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['info', 'glass', 'rainbow'].map((preset) => (
              <GradientBorder key={preset} preset={preset as any} borderWidth={3} className="p-8 rounded-lg bg-gray-800 text-center">
                <h3 className="text-xl font-bold mb-2">
                  <GradientText preset={preset as any} as="h3">
                    {preset} 边框渐变
                  </GradientText>
                </h3>
                <p className="text-gray-300">
                  边框宽度: 3px
                </p>
              </GradientBorder>
            ))}
          </div>
        </section>

        {/* 动态渐变展示 - 使用组件化方式 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText preset="rainbow" as="h2">
              动态渐变动画
            </GradientText>
          </h2>
          <div className="flex justify-center">
            <GradientBackground
              preset="rainbow"
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

        {/* 技术信息 - 使用组件化方式 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText preset="primary" as="h2">
              组件化技术实现
            </GradientText>
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <pre className="text-sm text-gray-300 overflow-x-auto">
{`// 导入渐变组件
import { GradientText, GradientBackground, GradientBorder } from '@xorigo-ui/core'

// 文字渐变 - 无需样式管理
<GradientText preset="primary">渐变文字</GradientText>

// 背景渐变 - 简洁明了
<GradientBackground preset="success">渐变背景</GradientBackground>

// 边框渐变 - 配置灵活
<GradientBorder preset="info" borderWidth={3}>渐变边框</GradientBorder>

// 动态渐变 - 内置动画支持
<GradientBackground preset="rainbow" animated={true}>
  动态渐变效果
</GradientBackground>

// 可用预设: primary, success, warning, error, info, glass, rainbow, dark, subtle
// 完全组件化，无硬编码，语义化API`}
            </pre>
          </div>
        </section>

        {/* 对比展示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            <GradientText preset="success" as="h2">
              组件化 vs 硬编码对比
            </GradientText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GradientBackground preset="error" className="p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">❌ 硬编码方式</h3>
              <pre className="text-sm text-white/90">
{`const inlineGradientUtils = {
  primary: {
    text: 'linear-gradient(...)'
  }
}
<span style={{
  background: gradient,
  WebkitBackgroundClip: 'text'
}}>
  渐变文字
</span>`}
              </pre>
            </GradientBackground>

            <GradientBackground preset="success" className="p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">✅ 组件化方式</h3>
              <pre className="text-sm text-white/90">
{`import { GradientText } from '@xorigo-ui/core'

<GradientText preset="primary">
  渐变文字
</GradientText>`}
              </pre>
            </GradientBackground>
          </div>
        </section>

        {/* 导航 */}
        <div className="text-center space-y-4">
          <GradientBackground preset="primary" className="inline-block px-6 py-3 rounded-lg transition-all hover:scale-105">
            <a href="/" className="text-white font-semibold">
              ← 返回首页
            </a>
          </GradientBackground>
          <span className="mx-4 text-gray-500">|</span>
          <GradientBackground preset="success" className="inline-block px-6 py-3 rounded-lg transition-all hover:scale-105">
            <a href="/gradient-enhanced-demo" className="text-white font-semibold">
              🚀 渐变增强版
            </a>
          </GradientBackground>
        </div>
      </div>
    </div>
  )
}