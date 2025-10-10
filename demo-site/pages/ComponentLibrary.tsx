import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "../../src/components/feedback/ThemeToggle"
import { ToastProvider } from "../../src/components/feedback/Notification"
import ButtonDemo from "../components/forms/ButtonDemo"
import InputDemo from "../components/forms/InputDemo"
import CheckboxDemo from "../components/forms/CheckboxDemo"
import SelectDemo from "../components/forms/SelectDemo"
import AlertDemo from "../components/feedback/AlertDemo"
import NotificationDemo from "../components/feedback/NotificationDemo"
import LoadingDemo from "../components/feedback/LoadingDemo"
import ModalDemo from "../components/feedback/ModalDemo"
import DataTableDemo from "../components/data/DataTableDemo"
import BreadcrumbDemo from "../components/navigation/BreadcrumbDemo"
import HeaderDemo from "../components/navigation/HeaderDemo"
import SidebarDemo from "../components/navigation/SidebarDemo"
import CardDemo from "../components/layout/CardDemo"
import AdvancedCardDemo from "../components/layout/AdvancedCardDemo"
import ThemeDemo from "../components/advanced/ThemeDemo"
import ThemeToggleDemo from "../components/advanced/ThemeToggleDemo"
import AnimatedCardDemo from "../components/advanced/AnimatedCardDemo"
import MicroInteractionsDemo from "../components/advanced/MicroInteractionsDemo"
import ResponsiveLayoutDemo from "../components/layout/ResponsiveLayoutDemo"
import InteractionStatesDemo from "../components/advanced/InteractionStatesDemo"
import TooltipDemo from "../components/feedback/TooltipDemo"
import BadgeDemo from "../components/data/BadgeDemo"
import TabsDemo from "../components/navigation/TabsDemo"
import SwitchDemo from "../components/forms/SwitchDemo"
import AvatarDemo from "../components/data/AvatarDemo"
import DividerDemo from "../components/layout/DividerDemo"
import ProgressDemo from "../components/feedback/ProgressDemo"
import PaginationDemo from "../components/navigation/PaginationDemo"
import RadioDemo from "../components/forms/RadioDemo"
import TextareaDemo from "../components/forms/TextareaDemo"
import SkeletonDemo from "../components/feedback/SkeletonDemo"

const categories = [
  {
    id: 'forms',
    name: '表单组件',
    icon: '📝',
    description: '输入、按钮、选择器等交互组件',
    count: 7,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'feedback',
    name: '反馈组件',
    icon: '💬',
    description: '提示、加载、对话框等反馈组件',
    count: 7,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'data',
    name: '数据展示',
    icon: '📊',
    description: '表格、徽章、头像等数据组件',
    count: 3,
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'navigation',
    name: '导航组件',
    icon: '🧭',
    description: '面包屑、标签页、分页等导航',
    count: 5,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'layout',
    name: '布局组件',
    icon: '📐',
    description: '卡片、分隔线、响应式布局',
    count: 4,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'advanced',
    name: '高级组件',
    icon: '🚀',
    description: '主题、动画、微交互等高级特性',
    count: 5,
    color: 'from-pink-500 to-rose-500'
  }
]

function ComponentLibraryContent() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getTotalCount = () => categories.reduce((sum, cat) => sum + cat.count, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg shadow-gray-900/5'
            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
        } border-b border-gray-200/50 dark:border-gray-700/50`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                TH-UI 组件库
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  {getTotalCount()} 个组件
                </span>
                <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-semibold text-purple-600 dark:text-purple-400">10</span>
                  种主题配色
                </span>
                <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-gray-500 dark:text-gray-400">React 19</span>
                  <span className="text-gray-300 dark:text-gray-700">+</span>
                  <span className="text-gray-500 dark:text-gray-400">TypeScript</span>
                </span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Category Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sticky top-[88px] sm:top-[100px] z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory('all')}
              className={`relative px-5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md'
              }`}
            >
              <span className="flex items-center gap-2">
                🎯 <span>全部组件</span>
                <span className="text-xs opacity-75">({getTotalCount()})</span>
              </span>
            </motion.button>

            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative px-5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap overflow-hidden ${
                  activeCategory === category.id
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md'
                }`}
              >
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className={`absolute inset-0 bg-gradient-to-r ${category.color} rounded-xl`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                  <span className="text-xs opacity-75">({category.count})</span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 sm:space-y-12"
          >
            {/* Forms Section */}
            {(activeCategory === 'all' || activeCategory === 'forms') && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-8"
              >
                {activeCategory === 'all' && (
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xl shadow-lg shadow-blue-500/25">
                      📝
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">表单组件</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">输入、按钮、选择器等交互组件</p>
                    </div>
                  </div>
                )}
                <div className="space-y-6">
                  <ButtonDemo />
                  <InputDemo />
                  <CheckboxDemo />
                  <SelectDemo />
                  <SwitchDemo />
                  <RadioDemo />
                  <TextareaDemo />
                </div>
              </motion.section>
            )}

            {/* Feedback Section */}
            {(activeCategory === 'all' || activeCategory === 'feedback') && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: activeCategory === 'all' ? 0.2 : 0.1 }}
                className="space-y-8"
              >
                {activeCategory === 'all' && (
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl shadow-lg shadow-purple-500/25">
                      💬
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">反馈组件</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">提示、加载、对话框等反馈组件</p>
                    </div>
                  </div>
                )}
                <div className="space-y-6">
                  <AlertDemo />
                  <NotificationDemo />
                  <LoadingDemo />
                  <ModalDemo />
                  <TooltipDemo />
                  <ProgressDemo />
                  <SkeletonDemo />
                </div>
              </motion.section>
            )}

            {/* Data Section */}
            {(activeCategory === 'all' || activeCategory === 'data') && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: activeCategory === 'all' ? 0.3 : 0.1 }}
                className="space-y-8"
              >
                {activeCategory === 'all' && (
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 text-white text-xl shadow-lg shadow-green-500/25">
                      📊
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">数据展示</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">表格、徽章、头像等数据组件</p>
                    </div>
                  </div>
                )}
                <div className="space-y-6">
                  <DataTableDemo />
                  <BadgeDemo />
                  <AvatarDemo />
                </div>
              </motion.section>
            )}

            {/* Navigation Section */}
            {(activeCategory === 'all' || activeCategory === 'navigation') && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: activeCategory === 'all' ? 0.4 : 0.1 }}
                className="space-y-8"
              >
                {activeCategory === 'all' && (
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white text-xl shadow-lg shadow-orange-500/25">
                      🧭
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">导航组件</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">面包屑、标签页、分页等导航</p>
                    </div>
                  </div>
                )}
                <div className="space-y-6">
                  <BreadcrumbDemo />
                  <HeaderDemo />
                  <SidebarDemo />
                  <TabsDemo />
                  <PaginationDemo />
                </div>
              </motion.section>
            )}

            {/* Layout Section */}
            {(activeCategory === 'all' || activeCategory === 'layout') && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: activeCategory === 'all' ? 0.5 : 0.1 }}
                className="space-y-8"
              >
                {activeCategory === 'all' && (
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xl shadow-lg shadow-indigo-500/25">
                      📐
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">布局组件</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">卡片、分隔线、响应式布局</p>
                    </div>
                  </div>
                )}
                <div className="space-y-6">
                  <CardDemo />
                  <AdvancedCardDemo />
                  <ResponsiveLayoutDemo />
                  <DividerDemo />
                </div>
              </motion.section>
            )}

            {/* Advanced Section */}
            {(activeCategory === 'all' || activeCategory === 'advanced') && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: activeCategory === 'all' ? 0.6 : 0.1 }}
                className="space-y-8"
              >
                {activeCategory === 'all' && (
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xl shadow-lg shadow-pink-500/25">
                      🚀
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">高级组件</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">主题、动画、微交互等高级特性</p>
                    </div>
                  </div>
                )}
                <div className="space-y-6">
                  <ThemeDemo />
                  <ThemeToggleDemo />
                  <AnimatedCardDemo />
                  <MicroInteractionsDemo />
                  <InteractionStatesDemo />
                </div>
              </motion.section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="relative mt-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Footer Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                TH-UI 组件库
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                基于 Trans-Hub 设计系统构建的现代化 React 组件库，提供优雅、高效、可访问的 UI 组件。
              </p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  v0.1.0
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  开发中
                </span>
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                技术栈
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  React 19 - 最新并发特性
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  TypeScript 5.9 - 类型安全
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  Tailwind CSS 3 - 样式系统
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Framer Motion 12 - 动画引擎
                </li>
              </ul>
            </div>

            {/* Stats */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                统计数据
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/30">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {getTotalCount()}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    组件总数
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/30">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    10
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    主题配色
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border border-green-200/50 dark:border-green-700/30">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    6
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    组件分类
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200/50 dark:border-orange-700/30">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    100%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    TypeScript
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mb-6" />

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              © 2025 TH-UI. 基于 Trans-Hub 设计系统构建
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a
                href="https://github.com/trans-hub/th-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                GitHub
              </a>
              <a
                href="/docs"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                文档
              </a>
              <a
                href="/"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                首页
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-20 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
      </motion.footer>
    </div>
  )
}

export default function ComponentLibrary() {
  return (
    <ToastProvider>
      <ComponentLibraryContent />
    </ToastProvider>
  )
}
