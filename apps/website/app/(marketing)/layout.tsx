'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Code2,
  FileText,
  Github,
  Menu,
  X,
  Zap,
  Sparkles
} from 'lucide-react'
import { useState } from 'react'

interface MarketingLayoutProps {
  children: ReactNode
}

const marketingNavigation = [
  {
    name: '首页',
    href: '/',
    icon: Sparkles
  },
  {
    name: '组件库',
    href: '/gallery',
    icon: BarChart3
  },
  {
    name: '演练场',
    href: '/playground',
    icon: Code2
  },
  {
    name: '文档',
    href: '/docs',
    icon: FileText
  },
  {
    name: '关于',
    href: '/about',
    icon: Sparkles
  }
]

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">XO</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Xorigo UI
                </span>
              </Link>

              {/* 桌面端导航 */}
              <div className="hidden md:flex items-center gap-6">
                {marketingNavigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                          : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* 右侧按钮 */}
            <div className="flex items-center gap-4">
              {/* GitHub 按钮 */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center gap-2"
                asChild
              >
                <Link
                  href="https://github.com/xorigo-ui/xorigo-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
              </Button>

              {/* 开始使用按钮 */}
              <Button size="sm" className="hidden md:flex items-center gap-2" asChild>
                <Link href="/docs/getting-started">
                  <Zap className="h-4 w-4" />
                  开始使用
                </Link>
              </Button>

              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* 移动端导航菜单 */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4">
              <div className="space-y-2">
                {marketingNavigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors w-full",
                        isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                          : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>

              {/* 移动端按钮 */}
              <div className="mt-6 space-y-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link
                    href="https://github.com/xorigo-ui/xorigo-ui"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Link>
                </Button>

                <Button size="sm" className="w-full" asChild>
                  <Link href="/docs/getting-started">
                    <Zap className="h-4 w-4 mr-2" />
                    开始使用
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* 页面内容 */}
      <main className="flex-1">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* 品牌信息 */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">XO</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Xorigo UI
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                基于 React 19 + TypeScript 5.9 + Tailwind CSS 4 的现代化组件库
              </p>
            </div>

            {/* 产品 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                产品
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/gallery" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    组件库
                  </Link>
                </li>
                <li>
                  <Link href="/playground" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    演练场
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    文档
                  </Link>
                </li>
              </ul>
            </div>

            {/* 资源 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                资源
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs/getting-started" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    快速开始
                  </Link>
                </li>
                <li>
                  <Link href="/docs/tokens" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    设计令牌
                  </Link>
                </li>
                <li>
                  <Link href="/matrix" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    无障碍工具
                  </Link>
                </li>
              </ul>
            </div>

            {/* 社区 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                社区
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://github.com/xorigo-ui/xorigo-ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    关于我们
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 版权信息 */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              © 2025 Xorigo UI. 基于 MIT 许可证开源.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}