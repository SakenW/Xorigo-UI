'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@xorigo-ui/core'
import { cn } from '@/utils'
import { Bot, Bug, BarChart3 } from 'lucide-react'

interface WorkbenchNavigationProps {
  currentView: 'solutions' | 'components' | 'debug-tools' | 'performance-monitoring'
  onViewChange?: (view: 'solutions' | 'components' | 'debug-tools' | 'performance-monitoring') => void
  onPreferencesClick?: () => void
  onAIAssistantClick?: () => void
  onDebugToolsClick?: () => void
  onPerformanceMonitoringClick?: () => void
  className?: string
}

export function WorkbenchNavigation({
  currentView,
  onViewChange,
  onPreferencesClick,
  onAIAssistantClick,
  onDebugToolsClick,
  onPerformanceMonitoringClick,
  className
}: WorkbenchNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // 监听滚动状态
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    {
      id: 'solutions',
      label: '🎯 解决方案',
      description: '业务场景导向',
      view: 'solutions' as const
    },
    {
      id: 'components',
      label: '📚 组件库',
      description: '技术组件展示',
      view: 'components' as const
    },
    {
      id: 'performance-monitoring',
      label: '📊 性能监控',
      description: '性能分析优化',
      view: 'performance-monitoring' as const
    },
    {
      id: 'debug-tools',
      label: '🔧 调试工具',
      description: '高级调试分析',
      view: 'debug-tools' as const
    },
    {
      id: 'ai-assistant',
      label: '🤖 AI 助手',
      description: '智能开发助手',
      action: 'ai-assistant' as const
    },
    {
      id: 'docs',
      label: '📖 文档',
      description: '使用指南',
      href: '/docs',
      external: true
    }
  ]

  const handleViewChange = (view: 'solutions' | 'components' | 'debug-tools' | 'performance-monitoring') => {
    onViewChange?.(view)
    setIsMenuOpen(false)
  }

  const handleNavigationClick = (item: any) => {
    if (item.action === 'ai-assistant') {
      onAIAssistantClick?.()
      setIsMenuOpen(false)
    } else if (item.view === 'debug-tools') {
      onDebugToolsClick?.()
      setIsMenuOpen(false)
    } else if (item.view === 'performance-monitoring') {
      onPerformanceMonitoringClick?.()
      setIsMenuOpen(false)
    } else if (item.external) {
      window.open(item.href, '_blank')
    } else {
      handleViewChange(item.view)
    }
  }

  return (
    <>
      {/* 固定导航栏 */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg'
            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800'
        , className)}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo 和品牌 */}
            <div className="flex items-center gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  X
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Xorigo UI
                </span>
              </motion.div>

              {/* 桌面端导航 */}
              <div className="hidden md:flex items-center gap-1">
                {navigationItems.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => !item.external && (item.view === 'debug-tools' ? onDebugToolsClick?.() : item.view === 'performance-monitoring' ? onPerformanceMonitoringClick?.() : handleViewChange(item.view))}
                    className={cn(
                      'relative px-4 py-2 rounded-xl transition-all duration-200',
                      currentView === item.view
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.label}</span>
                      {currentView === item.view && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-xl -z-10"
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-3">
              {/* 性能监控按钮 */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-2 px-3 py-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all duration-200"
                title="性能监控与分析"
                onClick={onPerformanceMonitoringClick}
              >
                <BarChart3 className="w-4 h-4" />
                <span>性能监控</span>
              </Button>

              {/* 调试工具按钮 */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-2 px-3 py-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-all duration-200"
                title="高级调试工具"
                onClick={onDebugToolsClick}
              >
                <Bug className="w-4 h-4" />
                <span>调试工具</span>
              </Button>

              {/* AI 助手按钮 */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
                title="AI 智能助手"
                onClick={onAIAssistantClick}
              >
                <Bot className="w-4 h-4" />
                <span>AI 助手</span>
              </Button>

              {/* 文档链接 */}
              <a
                href="/docs"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              >
                <span>📖</span>
                <span>文档</span>
              </a>

              {/* 主题切换 */}
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  title="切换主题"
                >
                  🌙
                </Button>
              </div>

              {/* 用户菜单 */}
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  title="用户设置"
                  onClick={onPreferencesClick}
                >
                  👤
                </Button>
              </div>

              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-6 h-5 flex flex-col justify-center gap-1">
                  <div className={cn(
                    'w-full h-0.5 bg-current transition-all duration-300',
                    isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  )}></div>
                  <div className={cn(
                    'w-full h-0.5 bg-current transition-all duration-300',
                    isMenuOpen ? 'opacity-0' : ''
                  )}></div>
                  <div className={cn(
                    'w-full h-0.5 bg-current transition-all duration-300',
                    isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  )}></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* 遮罩层 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            />

            {/* 菜单面板 */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-white dark:bg-gray-900 shadow-xl md:hidden"
            >
              <div className="p-6">
                {/* 菜单头部 */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      X
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      Xorigo UI
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* 导航项 */}
                <div className="space-y-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigationClick(item)}
                      className={cn(
                        'w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left',
                        (item.view && currentView === item.view)
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                      )}
                    >
                      <span className="text-xl">{item.label.split(' ')[0]}</span>
                      <div>
                        <div className="font-medium">{item.label.split(' ')[1]}</div>
                        <div className="text-sm opacity-70">{item.description}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* 底部信息 */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    <div>版本 2.0.1</div>
                    <div className="mt-1">智能工作台</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}