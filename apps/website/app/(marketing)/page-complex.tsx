'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Box, Palette, Code2, Zap } from 'lucide-react'

// 导入核心组件
import { StatCard } from '@xorigo-ui/core'
import { HeroTitle } from '@xorigo-ui/core'
import { CodeDemo } from '@xorigo-ui/core'
import { SuperParticleSystem } from '@xorigo-ui/core'

// 🎨 背景效果组件
const SimpleBackground = () => {
  const [time, setTime] = useState(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const animate = () => {
      setTime(prev => prev + 0.01)
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const backgroundStyle = useMemo(() => ({
    background: `linear-gradient(${135 + Math.sin(time * 0.1) * 10}deg, #000000 0%, #0a0a1a 50%, #000000 100%)`
  }), [time])

  return (
    <div className="fixed inset-0 pointer-events-none" style={backgroundStyle}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.4
        }}
      />
      <div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
        style={{
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(time * 0.5) * 0.1})`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"
        style={{
          transform: `translate(50%, 50%) scale(${1 + Math.cos(time * 0.4) * 0.1})`,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-40 h-40 bg-pink-500/10 rounded-full blur-xl"
        style={{
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(time * 0.3) * 0.08})`,
        }}
      />
    </div>
  )
}

/**
 * Xorigo UI 首页 - 优化稳定版本
 */
export default function HomePage() {
  const { scrollY } = useScroll()
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)

  // 🎨 优化的滚动动画 - 使用 useMemo 优化性能
  const scrollAnimations = useMemo(() => ({
    heroOpacity: useTransform(scrollY, [0, 150], [1, 0]),
    contentOpacity: useTransform(scrollY, [100, 300], [0, 1]),
    scrollIndicatorOpacity: useTransform(scrollY, [50, 180], [1, 0]),
    backToTopOpacity: useTransform(scrollY, [200, 350], [0, 1])
  }), [scrollY])

  // 📊 统计数据
  const stats = [
    { title: '组件', value: 100, icon: <Box />, change: 25 },
    { title: '主题配方', value: 10, icon: <Palette />, change: 5 },
    { title: '七轴系统', value: 7, icon: <Zap />, change: 0 },
    { title: 'TypeScript', value: 100, icon: <Code2 />, change: 0 }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(scrollY.get() < 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollY])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 🎨 动态背景效果 */}
      <SimpleBackground />

      {/* 🌟 粒子系统 */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <SuperParticleSystem
          count={20}
          colorVar400="#fbbf24"
          colorVar300="#fcd34d"
          colorVar200="#fde68a"
        />
      </div>

      {/* 📜 滚动进度指示器 */}
      <motion.div
        className="fixed left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 z-50 origin-top"
        style={{
          scaleY: useTransform(scrollY, [0, 1000], [0, 1])
        }}
      />

      {/* 📜 滚动指示器 */}
      <AnimatePresence>
        {showScrollIndicator && (
          <motion.div
            className="fixed bottom-8 right-8 z-50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex flex-col items-center gap-2">
              <motion.div
                className="w-2 h-2 bg-purple-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs text-gray-400">向下滚动</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 返回顶部按钮 */}
      <motion.button
        className="fixed bottom-8 right-8 z-50 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-colors"
        style={{
          opacity: scrollAnimations.backToTopOpacity
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>

      {/* 🚀 Hero Section */}
      <motion.section
        className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-4"
        style={{
          opacity: scrollAnimations.heroOpacity
        }}
      >
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* 🌟 炫彩标题 - 使用 HeroTitle 组件 */}
          <HeroTitle
            text="Xorigo UI"
            size="xl"
            className="mb-12"
            shine={true}
            glow={true}
            enable3D={true}
            entranceDelay={0.2}
          />

          <motion.p
            className="text-3xl text-gray-300 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            下一代 React 组件库
          </motion.p>

          <motion.p
            className="text-xl text-gray-500 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            由 Saken 与 AI 协作打造，为现代 Web 应用提供极致的开发体验
          </motion.p>

          {/* 📊 统计数据 - 使用 StatCard 组件 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* 💻 代码演示区域 */}
      <motion.section
        className="relative -mt-20 pt-4 pb-16 px-4"
        style={{
          opacity: scrollAnimations.contentOpacity
        }}
      >
        <motion.div className="max-w-7xl mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            实时代码演示
          </motion.h2>

          <motion.p
            className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            即时预览组件效果，感受 Xorigo UI 的开发体验
          </motion.p>

          {/* 代码演示组件 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <CodeDemo theme="cyan" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* 🚀 CTA Section */}
      <motion.section
        className="relative py-20 px-4"
        style={{
          opacity: scrollAnimations.contentOpacity
        }}
      >
        <motion.div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-8 text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            立即开始使用
          </motion.h2>

          <motion.p
            className="text-xl text-gray-400 mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            快速构建现代化的 React 应用
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <a
              href="/docs"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              查看文档
            </a>
            <a
              href="https://github.com/xorigo-ui/xorigo-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold border border-purple-600/30 transition-all transform hover:scale-105"
            >
              GitHub
            </a>
          </motion.div>

          {/* 🎯 功能展示 */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-lg border border-purple-600/20 hover:border-purple-500/40 transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2 text-white">设计系统</h3>
              <p className="text-gray-400">完整的设计令牌系统，支持自定义主题和品牌定制</p>
            </motion.div>
            <motion.div
              className="bg-gray-900 p-6 rounded-lg border border-purple-600/20 hover:border-purple-500/40 transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-white">性能优化</h3>
              <p className="text-gray-400">基于React 19和现代工具链，确保最佳性能表现</p>
            </motion.div>
            <motion.div
              className="bg-gray-900 p-6 rounded-lg border border-purple-600/20 hover:border-purple-500/40 transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2 text-white">类型安全</h3>
              <p className="text-gray-400">完全基于TypeScript，提供智能提示和类型保护</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  )
}