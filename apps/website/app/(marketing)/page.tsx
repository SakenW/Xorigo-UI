'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// 优化的导入：使用具体路径减少不必要的模块加载
import { XorigoLogo } from '@xorigo-ui/core'
import { HeroTitle } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { StatCard } from '@xorigo-ui/core'
import { SiteNavigation } from '@/components/shared/site-navigation'
import { AnimatedBackground, BreathingBackground, FluidBackground } from '@xorigo-ui/core'
import { SkipLink, runAccessibilityTests } from '@xorigo-ui/core'

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 在开发环境中运行可访问性测试
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // 延迟运行测试，等待页面完全加载
      setTimeout(() => {
        runAccessibilityTests()
      }, 2000)
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}>
      {/* 跳过链接 */}
      <SkipLink href="#main-content">
        Skip to main content
      </SkipLink>

      {/* 跳转到统计数据 */}
      <SkipLink href="#statistics">
        Skip to statistics
      </SkipLink>

      {/* 统一顶部导航栏 */}
      <SiteNavigation />

      {/* 现代化流动背景 - 科技感视觉效果 */}
      <FluidBackground />

      {/* Hero Section */}
      <motion.section
        id="main-content"
        className="min-h-screen flex flex-col items-center justify-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        aria-labelledby="hero-heading"
        aria-describedby="hero-description"
      >
        <HeroTitle
          id="hero-heading"
          text="Xorigo UI"
          size="xl"
          shine={true}
          glow={true}
          enable3D={true}
          gradientStops={[
            'var(--color-primary-400)',
            'var(--color-accent-400)',
            'var(--color-secondary-400)',
            'var(--color-primary-500)',
            'var(--color-accent-500)'
          ]}
          beamColor="rgba(255,255,255,0.6)"
          beamSecondaryColor="rgba(168, 85, 247, 0.4)"
          glowColor="rgba(6, 182, 212, 0.3)"
          entranceDelay={0.2}
          className="mb-8"
          aria-label="Xorigo UI - 现代化 React UI 组件库"
        />

        <motion.p
          id="hero-description"
          className="text-xl md:text-2xl mb-12 text-center max-w-4xl px-4"
          style={{ color: 'var(--color-text-secondary)' }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          基于 React 19 + TypeScript 5.9 + Tailwind CSS 4 构建的现代化 React UI 组件库
        </motion.p>

        <motion.div
          className="flex gap-4 flex-wrap justify-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          role="group"
          aria-label="主要操作按钮"
        >
          <Button
            size="lg"
            aria-label="开始使用 Xorigo UI 组件库"
            onClick={() => window.location.href = '/workbench'}
          >
            开始使用
          </Button>

          <Button
            variant="outline"
            size="lg"
            aria-label="查看 Xorigo UI 文档"
            onClick={() => window.location.href = '/docs'}
          >
            查看文档
          </Button>
        </motion.div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        id="statistics"
        className="py-20 px-4"
        style={{ backgroundColor: 'var(--color-background-secondary)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        aria-labelledby="statistics-heading"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            id="statistics-heading"
            className="text-4xl font-bold text-center mb-16"
            style={{ color: 'var(--color-text-primary)' }}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            强大的功能集
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="React 组件"
              value="50+"
              description="高质量的 UI 组件"
              trend={{ value: "+5 本月", type: "increase" }}
              variant="primary"
              icon="⚛️"
            />
            <StatCard
              title="主题配方"
              value="20+"
              description="七轴主题系统"
              trend={{ value: "+3 新增", type: "increase" }}
              variant="accent"
              icon="🎨"
            />
            <StatCard
              title="动画效果"
              value="100+"
              description="流畅的交互动画"
              trend={{ value: "+10 优化", type: "increase" }}
              variant="secondary"
              icon="✨"
            />
            <StatCard
              title="无障碍支持"
              value="100%"
              description="WCAG 2.1 AA 标准"
              trend={{ value: "持续改进", type: "neutral" }}
              variant="success"
              icon="♿"
            />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-4"
        style={{ backgroundColor: 'var(--color-background-tertiary)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-16"
            style={{ color: 'var(--color-text-primary)' }}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            为什么选择 Xorigo UI？
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: '现代化技术栈', desc: '基于最新的 React 19、TypeScript 5.9 和 Tailwind CSS 4', icon: '🚀' },
              { title: '灵活主题系统', desc: '支持七轴主题配方，轻松定制品牌风格', icon: '🎨' },
              { title: '流畅动画效果', desc: '集成 Framer Motion，提供丰富的交互动画', icon: '✨' },
              { title: 'TypeScript 支持', desc: '完整的类型定义，提供优秀的开发体验', icon: '📝' },
              { title: '无障碍友好', desc: '遵循 WCAG 标准，支持键盘导航和屏幕阅读器', icon: '♿' },
              { title: '响应式设计', desc: '完美适配桌面端和移动端设备', icon: '📱' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="rounded-lg p-6 transition-all duration-200"
                style={{
                  backgroundColor: 'var(--color-surface-primary)',
                  border: '1px solid var(--color-border-default)'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  borderColor: 'var(--color-primary-300)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Scroll Progress Indicator */}
      <AnimatePresence>
        {scrollY < 100 && (
          <motion.div
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-6 h-10 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: 'var(--color-primary-500)' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      {scrollY > 300 && (
        <motion.button
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center z-50"
          style={{ backgroundColor: 'var(--color-primary-600)' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{
            scale: 1.1,
            backgroundColor: 'var(--color-primary-700)'
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </div>
  )
}
