'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { SuperParticleSystem } from '@xorigo-ui/core'
import { Box, Palette, Code2, Zap } from 'lucide-react'

// 导入拆分的营销组件
import {
  PageLoader,
  Component3DCarousel,
  ComponentCategoryGrid,
  FluidBackground
} from '@/components/marketing'

// 导入通用组件库
import { CodeDemo, StatsCard } from '@xorigo-ui/core'

// 导入 HeroTitle 特效组件
import { HeroTitle } from '@xorigo-ui/core'


// ✨ 点击涟漪效果组件
const ClickRipple = () => {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([])
  const rippleIdRef = React.useRef(0)

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple = {
        id: rippleIdRef.current++,
        x: e.clientX,
        y: e.clientY
      }
      setRipples(prev => [...prev, newRipple])

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 800)
    }

    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{
              scale: [0, 3, 5],
              opacity: [0.8, 0.3, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            <div className="w-8 h-8 rounded-full border-2 border-[var(--color-primary-400)]" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * Xorigo UI 重构版首页
 *
 * 组件化架构 + 设计令牌系统
 */
export default function Page2() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { scrollY } = useScroll()

  // 滚动动画配置
  const heroOpacity = useTransform(scrollY, [0, 300, 600], [1, 0.8, 0])
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95])
  const heroY = useTransform(scrollY, [0, 500], [0, -100])
  const carouselOpacity = useTransform(scrollY, [300, 600, 800], [0, 0.8, 1])
  const carouselY = useTransform(scrollY, [300, 600], [100, 0])
  const sectionTitleOpacity = useTransform(scrollY, [200, 500, 700], [0, 0.8, 1])
  const sectionTitleY = useTransform(scrollY, [200, 500], [50, 0])

  // 控制加载状态，与 PageLoader 协调
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2800) // 与 PageLoader 的退出时间协调

    return () => clearTimeout(timer)
  }, [])

  // 统计数据 - 基于实际系统特点修正
  const stats = [
    { label: '组件', value: 100, suffix: '+', icon: <Box /> },
    { label: '主题配方', value: 10, suffix: '+', icon: <Palette /> },
    { label: '七轴系统', value: 7, suffix: '维度', icon: <Zap /> },
    { label: 'TypeScript', value: 100, suffix: '%', icon: <Code2 /> }
  ]

  return (
    <>
      {/* 页面加载器 */}
      <AnimatePresence>
        <PageLoader key="page-loader" />
      </AnimatePresence>

      {/* 加载遮罩层 - 在加载时显示，平滑过渡 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading-overlay"
            className="fixed inset-0 z-[9998] bg-black pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.8, ease: "easeInOut" }
            }}
          />
        )}
      </AnimatePresence>

      {/* 主页面内容 */}
      <motion.div
        key="main-content"
        className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] relative overflow-hidden overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isLoading ? 0 : 1,
          scale: isLoading ? 0.98 : 1,
          transition: {
            duration: 1.2,
            ease: "easeInOut",
            delay: isLoading ? 0 : 0.2
          }
        }}
      >
        {/* 🎨 背景效果层 */}
        <FluidBackground />
        {/* 萤火虫背景效果 */}
        <div className="fixed inset-0 pointer-events-none z-[10]" style={{ isolation: 'isolate' }}>
          <SuperParticleSystem
            count={50}
            colorVar400="#fbbf24"
            colorVar300="#fcd34d"
            colorVar200="#fde68a"
          />
        </div>
        <ClickRipple />

        {/* 🚀 Hero Section */}
        <motion.section
          className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-32 pb-20"
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroY
          }}
        >
          <div className="max-w-6xl mx-auto text-center relative z-10">
            {/* 🎨 炫彩标题 - 使用增强的 HeroTitle 组件 */}
            <HeroTitle
              text="Xorigo UI"
              size="xl"
              className="mb-12"
              enable3D={true}
              shine={true}
              glow={true}
              gradientStops={[
                '#a855f7', // purple-500
                '#ec4899', // pink-500
                '#06b6d4', // cyan-500
                '#10b981', // emerald-500
                '#f59e0b', // amber-500
                '#ec4899', // pink-500 (back to pink)
                '#a855f7', // purple-500
                '#06b6d4', // cyan-500
                '#a855f7', // purple-500 (cycle complete)
              ]}
              beamColor="rgba(255,255,255,0.5)"
              beamSecondaryColor="rgba(139, 92, 246, 0.4)"
              glowColor="rgba(6, 182, 212, 0.3)"
              flowDurationSec={25}
              beamDuration={4}
              beamSecondaryDuration={6}
              glowDuration={5}
              entranceDelay={0.2}
            />

            <motion.p
              className="text-3xl text-[var(--color-text-secondary)] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              下一代 React 组件库
            </motion.p>

            <motion.p
              className="text-xl text-[var(--color-text-tertiary)] mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              由 Saken 与 AI 协作打造，为现代 Web 应用提供极致的开发体验
            </motion.p>

            {/* 📊 统计数据 */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <StatsCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  icon={stat.icon}
                  delay={0.6 + index * 0.1}
                />
              ))}
            </motion.div>

            </div>
        </motion.section>

        {/* 💻 代码编辑器独立区域 */}
        <section className="relative py-32 px-4">
          <motion.div
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* 区域标题 */}
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-accent-400)] bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              实时代码演示
            </motion.h2>

            <motion.p
              className="text-xl text-[var(--color-text-secondary)] text-center mb-16 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              即时预览组件效果，感受 Xorigo UI 的开发体验
            </motion.p>

            {/* 代码编辑器 */}
            <CodeDemo />
          </motion.div>
        </section>

        {/* 📦 组件分类网格 */}
        <section className="relative py-32 px-4">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[var(--color-secondary-400)] to-[var(--color-accent-400)] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            组件分类
          </motion.h2>

          <ComponentCategoryGrid
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </section>

        {/* 🚀 CTA Section */}
        <section className="relative py-32 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-8 text-[var(--color-text-primary)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              立即开始使用
            </motion.h2>

            <motion.p
              className="text-xl text-[var(--color-text-secondary)] mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              快速构建现代化的 React 应用
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <a
                href="/docs"
                className="px-8 py-4 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white rounded-lg font-semibold transition-colors"
              >
                查看文档
              </a>
              <a
                href="https://github.com/Xorigo/xorigo-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[var(--color-surface-dark)] hover:bg-[var(--color-surface-medium)] text-[var(--color-text-primary)] rounded-lg font-semibold border border-[var(--color-primary-500)]/30 transition-colors"
              >
                GitHub
              </a>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </>
  )
}
