import React from "react"
import { Link } from "react-router-dom"
import { Button } from "../../src/components/ui/Button"

export default function LandingPage() {
  const features = [
    {
      icon: '⚡',
      title: '现代化技术栈',
      description: 'React 19 + TypeScript + Tailwind CSS 3 + Framer Motion 12'
    },
    {
      icon: '🎨',
      title: '10种精美主题',
      description: '经典、现代、自然、优雅、活力系列，支持明暗模式切换'
    },
    {
      icon: '♿',
      title: '无障碍设计',
      description: '遵循WCAG 2.1标准，支持键盘导航和屏幕阅读器'
    },
    {
      icon: '🚀',
      title: '高性能',
      description: '基于React 19性能优化，支持并发渲染'
    },
    {
      icon: '📦',
      title: '组件丰富',
      description: '17+核心组件，覆盖表单、反馈、数据、导航、布局等场景'
    },
    {
      icon: '🎭',
      title: '动画流畅',
      description: 'Framer Motion驱动的微交互和页面过渡动画'
    }
  ]

  const stats = [
    { label: '组件数量', value: '17+' },
    { label: '主题配色', value: '10种' },
    { label: 'TypeScript', value: '100%' },
    { label: '测试覆盖', value: '95%' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                TH-UI
              </span>
            </h1>
            <p className="text-2xl text-gray-600 dark:text-gray-400 mb-4">
              现代化React组件库
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-500 mb-12 max-w-2xl mx-auto">
              基于 React 19 + TypeScript + Tailwind CSS 3 + Framer Motion 12
              <br />
              提供丰富的UI组件、精美的主题系统和流畅的交互动画
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/components">
                <Button variant="primary" size="lg">
                  查看组件库
                </Button>
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg">
                  GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            核心特性
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            现代化的设计理念，完善的开发体验
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            开始使用 TH-UI
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            立即体验现代化的React组件库，提升您的开发效率
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/components">
              <Button variant="secondary" size="lg">
                浏览组件
              </Button>
            </Link>
            <a href="#" className="px-8 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
              查看文档
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            TH-UI v0.1.0 | 基于 Trans-Hub 设计系统
          </p>
          <p className="text-gray-500 text-sm mt-2">
            MIT License © 2025
          </p>
        </div>
      </footer>
    </div>
  )
}
