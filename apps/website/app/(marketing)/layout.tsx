'use client'

import React, { ReactNode, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useScroll, useTransform } from 'framer-motion'
import { NavbarOriginLogo } from '@/components/ui/NavbarOriginLogo'
import {
  Github,
  ArrowRight,
  Menu,
  X,
  Rocket,
  Zap,
  Sparkles,
  BarChart3,
  Code2,
  FileText
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
    href: '/workbench?mode=gallery',
    icon: BarChart3
  },
  {
    name: '演练场',
    href: '/workbench?mode=editor',
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

// 新的增强导航栏组件
const EnhancedNavbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const navbarY = useTransform(scrollY, [0, 100], [0, -100])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-3xl shadow-2xl shadow-purple-500/10'
          : 'bg-transparent'
      }`}
      style={{ y: navbarY }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo增强 - 使用NavbarOriginLogo组件，持续循环的原点动画 */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <NavbarOriginLogo size={48} className="scale-90" />

            {/* 文字容器 - 添加足够的 padding 防止剪裁 */}
            <div className="text-2xl font-bold px-1 py-1 overflow-visible">
              <motion.span
                className="inline-block relative"
                style={{
                  background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 25%, #06b6d4 50%, #a855f7 75%, #ec4899 100%)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 8,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              >
                Xorigo UI

                {/* 移除横向移动效果，只保留基础渐变动画 */}
              </motion.span>
            </div>
          </motion.div>

          {/* Desktop Menu增强 */}
          <div className="hidden md:flex items-center gap-8">
            {['组件', '文档', '主题', 'GitHub'].map((item, i) => (
              <motion.a
                key={item}
                href={item === 'GitHub' ? 'https://github.com/SakenW/Xorigo-UI' : `#${item}`}
                target={item === 'GitHub' ? '_blank' : undefined}
                className="relative text-gray-400 hover:text-white transition-colors group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="relative z-10">{item}</span>
                <motion.div
                  className="absolute -inset-x-2 -inset-y-1 bg-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  layoutId="nav-hover"
                />
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
              </motion.a>
            ))}

            <motion.button
              className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-purple-500/25 transition-all group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center">
                <Rocket className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" />
                开始使用
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>

          {/* Mobile Menu按钮 */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative w-8 h-8 flex items-center justify-center"
          >
            <div className={mobileMenuOpen ? 'block' : 'hidden'}>
              <X className="w-6 h-6 text-white" />
            </div>
            <div className={mobileMenuOpen ? 'hidden' : 'block'}>
              <Menu className="w-6 h-6 text-white" />
            </div>
          </motion.button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-3xl border-b border-purple-500/20"
        >
          <div className="px-6 py-4 space-y-4">
            {marketingNavigation.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all"
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </a>
              )
            })}

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

              <a
                href="/docs/getting-started"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white transition-all"
              >
                <Zap className="h-5 w-5" />
                开始使用
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* 新的导航栏 */}
      <EnhancedNavbar />

      {/* 页面内容 */}
      <main className="flex-1">
        {children}
      </main>

      {/* 页脚 */}
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
              <h3 className="text-sm font-semibold text-white mb-4">
                产品
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/workbench?mode=gallery" className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300 group">
                    <span className="relative">
                      组件库
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/workbench?mode=editor" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300 group">
                    <span className="relative">
                      演练场
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300 group">
                    <span className="relative">
                      文档
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* 资源 */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">
                资源
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/docs/getting-started" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300 group">
                    <span className="relative">
                      快速开始
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/docs/tokens" className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300 group">
                    <span className="relative">
                      设计令牌
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/matrix" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300 group">
                    <span className="relative">
                      无障碍工具
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* 社区 */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">
                社区
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="https://github.com/xorigo-ui/xorigo-ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300 group"
                  >
                    <span className="relative">
                      GitHub
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300 group">
                    <span className="relative">
                      关于我们
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 版权信息 */}
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