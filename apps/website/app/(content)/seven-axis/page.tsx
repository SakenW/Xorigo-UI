import Link from 'next/link'
import { ArrowRight, Palette, Zap, Shield, Code } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 导航栏 */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Xorigo UI</span>
            </div>
            <div className="flex space-x-6">
              <Link
                href="/simple-theme"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                简化主题
              </Link>
              <Link
                href="/axis-demo"
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                七轴演示
              </Link>
              <Link
                href="/workbench"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                工作台
              </Link>
              <Link
                href="/docs"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                文档
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Hero 区域 */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              七轴主题系统
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            体验革命性的主题设计系统：从专业预设到完全自定义，渐进式复杂性设计让每个人都能找到适合自己的主题配置方式
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/simple-theme"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Palette className="w-5 h-5 mr-2" />
              体验七轴主题系统
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/axis-demo"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <div className="w-5 h-5 mr-2 bg-white rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs font-bold">7</span>
              </div>
              完整七轴演示
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/workbench"
              className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              <Code className="w-5 h-5 mr-2" />
              进入工作台
            </Link>
          </div>
        </div>

        {/* 特性卡片 */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
              <Palette className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              三层渐进式架构
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              从 1-click 专业预设到场景化快速配置，再到完全自定义七轴控制，满足不同技能水平用户需求
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                18个专业预设配方
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                8个场景化配置
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                无限自定义组合
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              智能约束系统
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              防止明显错误的主题组合，在安全范围内鼓励创意探索，让自由与约束完美平衡
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                视觉舒适度保护
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                可访问性优化
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                专业性指导
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              现代技术栈
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              基于 React 19 + TypeScript 5.9 + Tailwind CSS 4 构建，支持 OKLCH 色彩空间和 WCAG 2.2 标准
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                React 19 + TypeScript 5.9
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                OKLCH 色彩空间
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                WCAG 2.2 合规
              </li>
            </ul>
          </div>
        </div>

        {/* 快速开始 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              立即开始体验
            </h2>
            <p className="text-xl mb-8 opacity-90">
              探索七轴主题系统的无限可能，从简单到复杂，找到最适合你的主题配置方式
            </p>
            <Link
              href="/simple-theme"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              <Palette className="w-6 h-6 mr-3" />
              体验七轴主题系统
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Xorigo UI</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              🎨 七轴主题系统 - 让主题设计既简单又强大
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              基于渐进式复杂性设计理念 | 支持无限自定义组合
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}