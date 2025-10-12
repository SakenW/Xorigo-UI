'use client'

import { useState, useEffect } from 'react'
import { Button } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react'
import { useTheme } from 'next-themes'

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 标签 */}
          <div className="space-y-4">
            <Badge
              variant="default"
              className="inline-flex items-center gap-2 text-sm font-medium mb-4"
            >
              <Sparkles className="h-4 w-4" />
              TH-UI v0.1.0
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                现代化 React
              </span>
              <br />
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                组件库
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              基于 React 19 + TypeScript + Tailwind CSS 4 + Framer Motion 12 构建
              提供完整的 39 个组件，七轴样式配方系统，WCAG AA 可访问性标准
            </p>
          </div>

          {/* 特性标签 */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>React 19</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Zap className="h-4 w-4 text-green-500" />
              <span>TypeScript 5.9</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Zap className="h-4 w-4 text-cyan-500" />
              <span>Tailwind CSS 4</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Zap className="h-4 w-4 text-purple-500" />
              <span>Framer Motion 12</span>
            </div>
          </div>

          {/* CTA 按钮组 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-base px-8 py-3"
              onClick={() => window.location.href = '/gallery'}
            >
              开始探索
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-3"
              onClick={() => window.open('https://github.com/th-ui/th-ui', '_blank')}
            >
              GitHub
            </Button>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">39</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">核心组件</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">10</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">主题配色</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">20+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">动画效果</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">WCAG</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">AA 标准</div>
            </div>
          </div>
        </div>
      </div>

      {/* 背景装饰元素 */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:bg-blue-700 animate-pulse" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:bg-purple-700 animate-pulse animation-delay-2000" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:bg-indigo-700 animate-pulse animation-delay-4000" />
    </section>
  )
}