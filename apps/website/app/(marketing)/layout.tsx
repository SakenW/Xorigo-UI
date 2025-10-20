'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { NavbarOriginLogo } from '@/components/ui/NavbarOriginLogo'
import {
  Github,
  Menu,
  X,
  Rocket,
  Zap,
  BarChart3,
  Code2,
  Sparkles,
  FileText
} from 'lucide-react'

interface MarketingLayoutProps {
  children: ReactNode
}

/** —— 导航数据：统一管理，便于维护 —— */
const marketingNavigation = [
  { name: '首页', href: '/', icon: Sparkles, external: false },
  { name: '组件库', href: '/workbench?mode=gallery', icon: BarChart3, external: false },
  { name: '演练场', href: '/workbench?mode=editor', icon: Code2, external: false },
  { name: '文档', href: '/docs', icon: FileText, external: false },
  { name: '关于', href: '/about', icon: Sparkles, external: false }
]

const desktopQuickLinks = [
  { label: '组件', href: '#组件' },
  { label: '文档', href: '#文档' },
  { label: '主题', href: '#主题' },
  { label: 'GitHub', href: 'https://github.com/SakenW/Xorigo-UI', external: true }
]

/** —— 桌面端导航链接：避免重复 JSX —— */
const DesktopLink: React.FC<{ item: { label: string; href: string; external?: boolean }, i: number }> = ({ item, i }) => {
  const isExternal = !!item.external
  const Tag: any = isExternal ? 'a' : 'a' // 桌面此处 anchor 足够；站内是锚点
  return (
    <motion.a
      href={item.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="relative text-gray-400 hover:text-white transition-colors group"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
    >
      <span className="relative z-10">{item.label}</span>
      <motion.div
        className="absolute -inset-x-2 -inset-y-1 bg-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        layoutId="nav-hover"
      />
      <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
    </motion.a>
  )
}

/** —— 增强导航栏 —— */
const EnhancedNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const navbarY = useTransform(scrollY, [0, 100], [0, -100])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      aria-label="主导航"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled
          ? 'bg-black/90 backdrop-blur-3xl shadow-2xl shadow-purple-500/10'
          : 'bg-transparent'
        }`}
      style={{ y: navbarY }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧：Logo + 品牌名 */}
          <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
            <NavbarOriginLogo size={48} className="scale-90" />
            <div className="text-2xl font-bold px-1 py-1 overflow-visible">
              <motion.span
                className="inline-block bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
                style={{ backgroundSize: '300% 100%' }}
              >
                Xorigo UI
              </motion.span>
            </div>
          </motion.div>

          {/* 桌面端菜单 */}
          <div className="hidden md:flex items-center gap-8">
            {desktopQuickLinks.map((item, i) => (
              <DesktopLink key={item.label} item={item} i={i} />
            ))}
            <motion.a
              href="/docs/getting-started"
              className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-purple-500/25 transition-all group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="开始使用"
            >
              <span className="relative z-10 inline-flex items-center">
                <Rocket className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" />
                开始使用
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </div>

          {/* 移动端菜单按钮 */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden relative w-8 h-8 flex items-center justify-center"
            aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </motion.button>
        </div>
      </div>

      {/* 移动端菜单（带进出场） */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-3xl border-b border-purple-500/20"
          >
            <div className="px-6 py-4 space-y-4">
              {marketingNavigation.map(({ href, name, icon: Icon, external }) =>
                external ? (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all"
                  >
                    <Icon className="h-5 w-5" />
                    {name}
                  </a>
                ) : (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all"
                  >
                    <Icon className="h-5 w-5" />
                    {name}
                  </Link>
                )
              )}

              <div className="pt-4 border-t border-purple-500/20 space-y-3">
                <a
                  href="https://github.com/xorigo-ui/xorigo-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all"
                >
                  <Github className="h-5 w-5" />
                  GitHub
                </a>

                <Link
                  href="/docs/getting-started"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white transition-all"
                >
                  <Zap className="h-5 w-5" />
                  开始使用
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <EnhancedNavbar />
      <main className="flex-1">{children}</main>

      <footer className="relative z-30 border-t border-purple-500/20 bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* 品牌信息 */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <span className="text-white font-bold text-sm">XO</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Xorigo UI
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                基于 React 19 + TypeScript 5.9 + Tailwind CSS 4 的现代化组件库
              </p>
            </div>

            {/* 产品 */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">产品</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/workbench?mode=gallery" className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300 group">
                    <span className="relative">
                      组件库
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/workbench?mode=editor" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300 group">
                    <span className="relative">
                      演练场
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300 group">
                    <span className="relative">
                      文档
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* 资源 */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">资源</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/docs/getting-started" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300 group">
                    <span className="relative">
                      快速开始
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/docs/tokens" className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300 group">
                    <span className="relative">
                      设计令牌
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/matrix" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300 group">
                    <span className="relative">
                      无障碍工具
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/workbench/gradient" className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300 group">
                    <span className="relative">
                      渐变演示
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* 社区 */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">社区</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://github.com/xorigo-ui/xorigo-ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300 group"
                  >
                    <span className="relative">
                      GitHub
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300 group">
                    <span className="relative">
                      关于我们
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 版权 */}
          <div className="mt-8 pt-8 border-t border-purple-500/20">
            <p className="text-center text-sm text-gray-500">
              © 2025 Xorigo UI. 基于 MIT 许可证开源.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
