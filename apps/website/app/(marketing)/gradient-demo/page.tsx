'use client'

import React, { useState, useEffect } from 'react'

// 🎨 内联渐变工具实现（绕过模块解析问题）
const inlineGradientUtils = {
  primary: {
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    text: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    border: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
  },
  success: {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    text: 'linear-gradient(135deg, #10b981, #059669)',
    border: 'linear-gradient(135deg, #10b981, #059669)',
  },
  warning: {
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    text: 'linear-gradient(135deg, #f59e0b, #d97706)',
    border: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  error: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    text: 'linear-gradient(135deg, #ef4444, #dc2626)',
    border: 'linear-gradient(135deg, #ef4444, #dc2626)',
  },
  info: {
    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    text: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    border: 'linear-gradient(135deg, #06b6d4, #0891b2)',
  },
  glass: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
    text: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
    border: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
  },
  rainbow: {
    background: 'linear-gradient(90deg, #3b82f6, #f59e0b, #10b981, #06b6d4)',
    text: 'linear-gradient(90deg, #3b82f6, #f59e0b, #10b981, #06b6d4)',
    border: 'linear-gradient(90deg, #3b82f6, #f59e0b, #10b981, #06b6d4)',
  },
  dark: {
    background: 'linear-gradient(135deg, #1f2937, #111827)',
    text: 'linear-gradient(135deg, #f9fafb, #e5e7eb)',
    border: 'linear-gradient(135deg, #374151, #1f2937)',
  },
  subtle: {
    background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
    text: 'linear-gradient(135deg, #374151, #1f2937)',
    border: 'linear-gradient(135deg, #d1d5db, #9ca3af)',
  }
}

// 兼容 gradientUtils API 的工具对象
const gradientUtils = {
  getTextGradientClasses: (preset: keyof typeof inlineGradientUtils) => ({
    className: '',
    style: {
      background: inlineGradientUtils[preset].text,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }
  }),

  getBackgroundGradientClasses: (preset: keyof typeof inlineGradientUtils) => ({
    className: '',
    style: {
      background: inlineGradientUtils[preset].background
    }
  }),

  getBorderGradientClasses: (preset: keyof typeof inlineGradientUtils, borderWidth: number = 2) => ({
    className: '',
    style: {
      background: inlineGradientUtils[preset].border,
      padding: `${borderWidth}px`,
      position: 'relative'
    }
  }),

  createAnimatedGradient: (colors: string[], duration: number = 3) => ({
    className: '',
    style: {
      background: `linear-gradient(90deg, ${colors.join(', ')})`,
      backgroundSize: `${colors.length * 100}% 100%`,
      animation: `gradient-flow ${duration}s ease-in-out infinite`
    }
  })
}

export default function GradientDemo() {
  const [mounted, setMounted] = useState(false)

  // 添加动画样式
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes gradient-flow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

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
        <h1 className="text-4xl font-bold text-center mb-8">
          🎨 渐变工具演示页面
        </h1>

        {/* 文字渐变展示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">文字渐变效果</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['primary', 'success', 'warning', 'error', 'info', 'glass'].map((preset) => (
              <div key={preset} className="text-center p-6 rounded-lg border border-gray-700">
                <h3
                  style={gradientUtils.getTextGradientClasses(preset as any).style}
                  className="text-2xl font-bold mb-2"
                >
                  {preset} 渐变文字
                </h3>
                <p className="text-gray-400 text-sm">
                  预设: {preset}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 背景渐变展示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">背景渐变效果</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['primary', 'success', 'warning', 'error'].map((preset) => (
              <div
                key={preset}
                style={gradientUtils.getBackgroundGradientClasses(preset as any).style}
                className="p-8 rounded-lg text-center"
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {preset} 背景渐变
                </h3>
                <p className="text-white/80">
                  使用背景渐变工具创建
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 边框渐变展示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">边框渐变效果</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['info', 'glass', 'rainbow'].map((preset) => (
              <div
                key={preset}
                style={gradientUtils.getBorderGradientClasses(preset as any, 3).style}
                className="p-8 rounded-lg bg-gray-800 text-center"
              >
                <h3 className="text-xl font-bold mb-2">
                  {preset} 边框渐变
                </h3>
                <p className="text-gray-300">
                  边框宽度: 3px
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 动态渐变展示 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">动态渐变动画</h2>
          <div className="flex justify-center">
            <div
              style={gradientUtils.createAnimatedGradient([
                'var(--bg-primary-action)',
                'var(--bg-secondary-action)',
                'var(--bg-info)',
                'var(--bg-success)',
                'var(--bg-warning)'
              ], 5)}
              className="h-32 w-full max-w-2xl rounded-xl flex items-center justify-center"
            >
              <div className="text-white text-xl font-bold bg-black/30 px-6 py-3 rounded-lg">
                动态渐变演示 (5色循环)
              </div>
            </div>
          </div>
        </section>

        {/* 技术信息 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">技术实现</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <pre className="text-sm text-gray-300 overflow-x-auto">
{`// 导入渐变工具
import { gradientUtils } from '@xorigo-ui/core'

// 文字渐变
const textGradient = gradientUtils.getTextGradientClasses('primary')
<h1 style={textGradient.style}>渐变文字</h1>

// 背景渐变
const bgGradient = gradientUtils.getBackgroundGradientClasses('success')
<div style={bgGradient.style}>渐变背景</div>

// 边框渐变
const borderGradient = gradientUtils.getBorderGradientClasses('info', 2)
<div style={borderGradient.style}>渐变边框</div>

// 动态渐变
const animatedGradient = gradientUtils.createAnimatedGradient([
  'var(--color-1)',
  'var(--color-2)',
  'var(--color-3)'
], 3)
<div style={animatedGradient.style}>动态渐变</div>

// 可用预设: primary, success, warning, error, info, glass, rainbow, dark, subtle`}
            </pre>
          </div>
        </section>

        {/* 导航 */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ← 返回首页
          </a>
          <span className="mx-4 text-gray-500">|</span>
          <a
            href="https://localhost:3100"
            target="_blank"
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            🚀 打开新页面
          </a>
        </div>
      </div>
    </div>
  )
}