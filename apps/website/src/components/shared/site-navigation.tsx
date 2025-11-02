'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, ThemeSwitcher, XorigoLogo, NavbarOriginLogo } from '@xorigo-ui/core'
import { cn } from '@/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SiteNavigationProps {
  showWorkbenchNav?: boolean
  currentView?: 'solutions' | 'components' | 'debug-tools' | 'performance-monitoring'
  onViewChange?: (view: 'solutions' | 'components' | 'debug-tools' | 'performance-monitoring') => void
  className?: string
}

/**
 * 统一的网站导航组件
 * 在首页和workbench页面都可以使用
 */
export function SiteNavigation({
  showWorkbenchNav = false,
  currentView = 'components',
  onViewChange,
  className
}: SiteNavigationProps) {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isWorkbench = pathname?.includes('/workbench')

  return (
    <motion.nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50'
          : 'bg-transparent',
        className
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo 和主导航 */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
            >
              <Link href="/" className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <NavbarOriginLogo
                    size={48}
                    className="transition-transform duration-300 group-hover:scale-110"
                    mode="hybrid"
                    glow={true}
                    spinSeconds={8}
                    breatheSeconds={3}
                    bleed={2}
                    title="Xorigo UI"
                  />
                </div>
                <div className="text-xl font-bold px-1 py-1 overflow-visible">
                  <motion.span
                    className="inline-block bg-gradient-to-r from-purple-400 via-cyan-300 to-pink-400 bg-clip-text text-transparent drop-shadow-sm"
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
                    style={{ backgroundSize: '300% 100%' }}
                  >
                    Xorigo UI
                  </motion.span>
                </div>
              </Link>
            </motion.div>

            {/* 主导航菜单 */}
            {!isWorkbench && (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400',
                    pathname === '/'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300'
                  )}
                >
                  首页
                </Link>
                <Link
                  href="/workbench"
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400',
                    pathname === '/workbench'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300'
                  )}
                >
                  工作台
                </Link>
                <Link
                  href="/docs"
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400',
                    pathname?.startsWith('/docs')
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300'
                  )}
                >
                  文档
                </Link>
                <Link
                  href="/themes"
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400',
                    pathname?.startsWith('/themes')
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300'
                  )}
                >
                  主题管理
                </Link>
                <Link
                  href="/recipes"
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400',
                    pathname?.startsWith('/recipes')
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300'
                  )}
                >
                  主题配方
                </Link>
              </div>
            )}

            {/* Workbench 子导航 */}
            {isWorkbench && showWorkbenchNav && (
              <div className="hidden md:flex items-center gap-2">
                {[
                  { id: 'components', label: '组件库' },
                  { id: 'solutions', label: '解决方案' },
                  { id: 'debug-tools', label: '调试工具' },
                  { id: 'performance-monitoring', label: '性能监控' }
                ].map((item) => (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? 'solid' : 'ghost'}
                    size="sm"
                    onClick={() => onViewChange?.(item.id as any)}
                    className="text-sm"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-3">
            {/* 主题切换器 */}
            <ThemeSwitcher />

            {/* 移动端菜单按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => {
                // TODO: 实现移动端菜单
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {/* TODO: 实现移动端菜单 */}
      </AnimatePresence>
    </motion.nav>
  )
}