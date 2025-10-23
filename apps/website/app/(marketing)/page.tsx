'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Box, Palette, Code2, Zap } from 'lucide-react'

// 导入拆分的营销组件
import {
  PageLoader,
  Component3DCarousel,
  ComponentCategoryGrid,
  FluidBackground
} from '@/components/marketing'

// 导入通用组件库
import {
  CodeDemo,
  StatCard,
  HeroTitle,
  SuperParticleSystem
} from '@xorigo-ui/core'

/**
 * Xorigo UI 首页 - 重构版本
 *
 * 组件化架构 + 设计令牌系统 + 优化滚动体验
 */
export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { scrollY } = useScroll()

  // 调整后的滚动动画配置 - 让用户在第二屏看到动画过程
  const heroOpacity = useTransform(scrollY, [0, 150], [1, 0])
  const codeOpacity = useTransform(scrollY, [100, 400], [0, 1.1]) // 延迟到用户滚动到第二屏时开始
  const gridOpacity = useTransform(scrollY, [300, 500], [0, 1])
  const ctaOpacity = useTransform(scrollY, [450, 650], [0, 1])

  // 滚动指示器 - 调整后配合新的动画时机
  const shouldShowScrollIndicator = useTransform(scrollY, [50, 180], [1, 0])
  const shouldShowBackToTop = useTransform(scrollY, [200, 350], [0, 1])

  // 控制加载状态，与 PageLoader 协调
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2600) // 与 PageLoader 的退出时间协调，稍微提前触发退出动画

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
        {isLoading && <PageLoader key="page-loader" />}
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
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{
          opacity: isLoading ? 0 : 1,
          scale: isLoading ? 0.98 : 1,
          transition: {
            duration: 1.0,
            ease: [0.4, 0, 0.6, 1],
            delay: 0.1 // 减少延迟，让主内容更快出现
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

        {/* 📜 滚动进度指示器 */}
        <motion.div
          className="fixed left-0 top-0 w-1 h-full bg-gradient-to-b from-[var(--color-primary-500)] to-[var(--color-accent-500)] z-[60] origin-top"
          style={{
            scaleY: useTransform(scrollY, [0, 1000], [0, 1])
          }}
        />

        {/* 📜 平滑滚动指示 */}
        <motion.div
          className="fixed bottom-8 right-8 z-[60]"
          style={{
            opacity: shouldShowScrollIndicator
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <motion.div
              className="w-2 h-2 bg-[var(--color-primary-400)] rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-[var(--color-text-secondary)]">向下滚动</span>
          </div>
        </motion.div>

        {/* 🚀 返回顶部按钮 */}
        <motion.button
          className="fixed bottom-8 right-8 z-[60] p-3 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white rounded-full shadow-lg transition-colors"
          style={{
            opacity: shouldShowBackToTop
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
            opacity: heroOpacity
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
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  title={stat.label}
                  value={stat.value}
                  change={stat.change}
                  icon={stat.icon}
                />
              ))}
            </motion.div>

            </div>
        </motion.section>

        {/* 💻 代码编辑器区域 - 调整后的增强渐显效果 */}
        <motion.section
          className="relative -mt-20 pt-4 pb-16 px-4"
          style={{
            opacity: codeOpacity,
            y: useTransform(scrollY, [100, 400], [120, 0]),
            scale: useTransform(scrollY, [100, 400], [0.92, 1]) // 调整缩放时机
          }}
        >
          <motion.div
            className="max-w-7xl mx-auto"
          >
            {/* 区域标题 - 调整后的增强渐显效果 */}
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-accent-400)] bg-clip-text text-transparent"
              style={{
                opacity: useTransform(scrollY, [100, 200], [0, 1]),
                y: useTransform(scrollY, [100, 200], [80, 0]),
                scale: useTransform(scrollY, [100, 200], [0.88, 1]),
                filter: useTransform(scrollY, [100, 200], ['blur(8px)', 'blur(0px)'])
              }}
            >
              实时代码演示
            </motion.h2>

            <motion.p
              className="text-xl text-[var(--color-text-secondary)] text-center mb-16 max-w-3xl mx-auto"
              style={{
                opacity: useTransform(scrollY, [150, 250], [0, 1]),
                y: useTransform(scrollY, [150, 250], [70, 0]),
                scale: useTransform(scrollY, [150, 250], [0.9, 1]),
                filter: useTransform(scrollY, [150, 250], ['blur(6px)', 'blur(0px)'])
              }}
            >
              即时预览组件效果，感受 Xorigo UI 的开发体验
            </motion.p>

            {/* 代码编辑器 - 调整后的增强渐显效果 */}
            <motion.div
              style={{
                opacity: useTransform(scrollY, [200, 350], [0, 1]),
                y: useTransform(scrollY, [200, 350], [100, 0]),
                scale: useTransform(scrollY, [200, 350], [0.85, 1]),
                filter: useTransform(scrollY, [200, 350], ['blur(12px)', 'blur(0px)'])
              }}
            >
              <CodeDemo />
            </motion.div>
          </motion.div>
        </motion.section>

        {/* 📦 组件分类网格 - 紧凑布局 */}
        <motion.section
          className="relative py-16 px-4"
          style={{
            opacity: gridOpacity
          }}
        >
          <motion.div
            className="max-w-7xl mx-auto"
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-[var(--color-secondary-400)] to-[var(--color-accent-400)] bg-clip-text text-transparent"
            >
              组件分类
            </motion.h2>

            <ComponentCategoryGrid
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </motion.div>
        </motion.section>

        {/* 🚀 CTA Section - 紧凑布局 */}
        <motion.section
          className="relative py-20 px-4"
          style={{
            opacity: ctaOpacity
          }}
        >
          <motion.div
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-8 text-[var(--color-text-primary)]"
            >
              立即开始使用
            </motion.h2>

            <motion.p
              className="text-xl text-[var(--color-text-secondary)] mb-12"
            >
              快速构建现代化的 React 应用
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="/docs"
                className="px-8 py-4 bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                查看文档
              </a>
              <a
                href="https://github.com/Xorigo/xorigo-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[var(--color-surface-dark)] hover:bg-[var(--color-surface-medium)] text-[var(--color-text-primary)] rounded-lg font-semibold border border-[var(--color-primary-500)]/30 transition-all transform hover:scale-105 hover:border-[var(--color-primary-500)]/60"
              >
                GitHub
              </a>
            </motion.div>
          </motion.div>
        </motion.section>
      </motion.div>
    </>
  )
}