'use client'

import { motion } from 'framer-motion'

interface WorkbenchHeaderProps {
  buildTime: string
}

/**
 * 工作台头部组件 - 客户端渲染的动画头部
 */
export function WorkbenchHeader({ buildTime }: WorkbenchHeaderProps) {
  return (
    <div className="relative z-10 container mx-auto px-4 py-8">
      {/* 装饰性背景元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* 增强的标题区域 */}
      <div className="text-center mb-12">
        {/* 主标题区域 */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">X</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Xorigo UI Workbench
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            🚀 智能化的组件开发、测试和调试工作台
            <br />
            <span className="text-base text-gray-500 dark:text-gray-500">
              基于 React 19 + TypeScript 5.9 + Tailwind CSS 4 + Framer Motion 12 构建
            </span>
          </motion.p>
        </div>

        {/* 统计信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">🎨</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">60+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">核心组件</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">🎭</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">10</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">主题配色</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">100%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">TypeScript</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-2xl mb-1">🛡️</div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">A11y</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">无障碍支持</div>
          </div>
        </motion.div>

        {/* 快速操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md">
            📖 查看文档
          </button>
          <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md">
            🎨 设计系统
          </button>
          <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md">
            ⚡ 快速开始
          </button>
          <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md">
            💡 示例模板
          </button>
        </motion.div>
      </div>

      {/* 增强的底部信息 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            🛠️ 开发环境信息
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            {/* 技术栈信息 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">React</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">19.x</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">TypeScript</span>
                <span className="font-mono text-green-600 dark:text-green-400">5.9.x</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Tailwind CSS</span>
                <span className="font-mono text-purple-600 dark:text-purple-400">4.x</span>
              </div>
            </div>

            {/* 构建信息 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Next.js</span>
                <span className="font-mono text-orange-600 dark:text-orange-400">15.x</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">Framer Motion</span>
                <span className="font-mono text-pink-600 dark:text-pink-400">12.x</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">构建时间</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 text-xs">{buildTime}</span>
              </div>
            </div>

            {/* 渲染模式信息 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">渲染模式</span>
                <span className="font-mono text-teal-600 dark:text-teal-400 text-xs">SSR + CSR</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">包管理</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">npm</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">环境</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">开发模式</span>
              </div>
            </div>
          </div>

          {/* 附加信息 */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                系统就绪
              </span>
              <span>•</span>
              <span>支持热更新</span>
              <span>•</span>
              <span>完整类型检查</span>
              <span>•</span>
              <span>无障碍优化</span>
              <span>•</span>
              <span>响应式设计</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}