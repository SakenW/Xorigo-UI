'use client'

import React, { useState } from 'react'

export default function ThemeDemoPage() {
  const [currentTheme, setCurrentTheme] = useState('默认主题')
  const [message, setMessage] = useState('欢迎使用七轴主题系统演示！')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 页面头部 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              🎨 七轴主题系统演示
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              体验渐进式复杂性设计：预设主题 → 快速配置 → 完全自定义
            </p>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 快速访问导航 */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🚀 快速导航
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => document.getElementById('full-demo')?.scrollIntoView({ behavior: 'smooth' })}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
            >
              <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                🎨 完整演示
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                体验三层架构的完整功能
              </div>
            </button>

            <button
              onClick={() => document.getElementById('app-example')?.scrollIntoView({ behavior: 'smooth' })}
              className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
            >
              <div className="font-medium text-green-900 dark:text-green-100 mb-1">
                📱 应用示例
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                查看真实应用场景集成
              </div>
            </button>

            <button
              onClick={() => document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })}
              className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left"
            >
              <div className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                📖 设计哲学
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">
                了解系统设计思路
              </div>
            </button>
          </div>
        </div>

        {/* 完整演示区域 */}
        <section id="full-demo" className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              🎨 主题系统基础演示
            </h2>
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                {message}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                当前主题: <span className="font-semibold">{currentTheme}</span>
              </p>
            </div>
          </div>
        </section>

        {/* 应用示例区域 */}
        <section id="app-example" className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              📱 简化应用示例
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-center">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">企业主题</h3>
                <p className="text-blue-700 dark:text-blue-300">适合专业场景</p>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg text-center">
                <h3 className="font-semibold text-green-900 dark:text-green-100">创意主题</h3>
                <p className="text-green-700 dark:text-green-300">激发设计灵感</p>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-center">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">极简主题</h3>
                <p className="text-purple-700 dark:text-purple-300">简洁优雅设计</p>
              </div>
            </div>
          </div>
        </section>

        {/* 设计哲学说明 */}
        <section id="philosophy" className="mb-12">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700 p-6">
            <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-6">
              📖 七轴系统设计哲学
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">
                  🎯 核心设计原则
                </h3>
                <ul className="space-y-2 text-purple-700 dark:text-purple-300">
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span><strong>渐进式复杂性</strong>：从 1-click 预设到专业级控制</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span><strong>智能约束系统</strong>：防错保护但不限制创造力</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span><strong>场景驱动</strong>：解决真实使用场景问题</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✅</span>
                    <span><strong>用户成长</strong>：从新手到专家的学习路径</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">
                  🧩 七轴系统详解
                </h3>
                <ul className="space-y-2 text-purple-700 dark:text-purple-300">
                  <li><strong>模式轴</strong>：light/dark/hc (明暗模式)</li>
                  <li><strong>基础色轴</strong>：neutral-warm/cool (基础色调)</li>
                  <li><strong>对比度轴</strong>：low/mid/high (对比强度)</li>
                  <li><strong>强调色轴</strong>：mono/analog (色彩策略)</li>
                  <li><strong>色调轴</strong>：calm/standard/vivid (色彩强度)</li>
                  <li><strong>密度轴</strong>：spacious/comfortable (空间密度)</li>
                  <li><strong>动效轴</strong>：subtle/expressive (动画强度)</li>
                  <li><strong>表面轴</strong>：flat/glass/neon (材质效果)</li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🚀 如何在你的项目中使用
              </h3>
              <div className="bg-gray-900 dark:bg-black rounded-lg p-4 font-mono text-sm text-gray-100 overflow-x-auto">
                <pre>{`import {
  StyleRecipeProvider,
  useThemeSystem,
  useDynamicTheme
} from '@xorigo-ui/style-recipe'

function App() {
  const themeSystem = useThemeSystem()
  const dynamicTheme = useDynamicTheme({ autoApply: true })

  return (
    <StyleRecipeProvider>
      <button onClick={() => themeSystem.applyPreset('corporate-blue')}>
        应用企业蓝调主题
      </button>
      <button onClick={() => dynamicTheme.updateAxis('mode', 'dark')}>
        切换到暗色模式
      </button>
    </StyleRecipeProvider>
  )
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* 快速测试区域 */}
        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              ⚡ 简化主题切换测试
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <button
                onClick={() => { setCurrentTheme('企业蓝调'); setMessage('已切换到企业蓝调主题！'); }}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                企业蓝调
              </button>
              <button
                onClick={() => { setCurrentTheme('极简白'); setMessage('已切换到极简白主题！'); }}
                className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                极简白
              </button>
              <button
                onClick={() => { setCurrentTheme('创意紫'); setMessage('已切换到创意紫主题！'); }}
                className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                创意紫
              </button>
              <button
                onClick={() => { setCurrentTheme('科技青'); setMessage('已切换到科技青主题！'); }}
                className="px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
              >
                科技青
              </button>
              <button
                onClick={() => { setCurrentTheme('暗色模式'); setMessage('已切换到暗色模式！'); }}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                暗色模式
              </button>
              <button
                onClick={() => { setCurrentTheme('随机主题'); const themes = ['企业蓝调', '极简白', '创意紫', '科技青']; const random = themes[Math.floor(Math.random() * themes.length)]; setCurrentTheme(random); setMessage(`已随机切换到${random}主题！`); }}
                className="px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
              >
                随机主题
              </button>
            </div>
          </div>
        </section>

        {/* 使用指南 */}
        <section className="mb-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
              📋 使用指南
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  🎯 适合人群
                </h3>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                  <li>• 设计师 - 快速预览主题效果</li>
                  <li>• 开发者 - 集成主题系统</li>
                  <li>• 产品经理 - 体验不同风格</li>
                  <li>• 终端用户 - 个性化设置</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  🔧 技术栈
                </h3>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                  <li>• React 19 + TypeScript 5.9</li>
                  <li>• Tailwind CSS 4</li>
                  <li>• Framer Motion 12</li>
                  <li>• OKLCH 色彩空间</li>
                  <li>• WCAG 2.2 标准</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p className="mb-2">
              🎨 七轴主题系统 - 让主题设计既简单又强大
            </p>
            <p className="text-sm">
              基于渐进式复杂性设计理念 | 支持无限自定义组合
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}