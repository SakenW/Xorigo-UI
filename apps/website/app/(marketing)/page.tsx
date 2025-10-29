'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XorigoLogo } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { StatCard } from '@xorigo-ui/core'
import { ThemeSwitcher } from '@xorigo-ui/core'

// 动态背景组件
const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{
          backgroundColor: 'var(--color-primary-500)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: 'all 0.3s ease-out'
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{
          backgroundColor: 'var(--color-accent-500)',
          right: mousePosition.x - 128,
          bottom: mousePosition.y - 128,
          transition: 'all 0.3s ease-out'
        }}
      />
    </div>
  )
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}>
      {/* 主题切换器 */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      <AnimatedBackground />

      {/* Hero Section */}
      <motion.section
        className="min-h-screen flex flex-col items-center justify-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="theme-aware-logo">
      <XorigoLogo
              className="w-32 h-32"
              containerAware={false}  // 禁用容器感知，避免延迟
              colorOptions={{
                vibrant: true,
                count: 5,
                minContrast: 6.0
              }}
              ringStops={['#d946ef', '#f472b6', '#22d3ee', '#06b6d4', '#d946ef']}
              centerColor="#1a202c"  // 默认深色中心点
      />
    </div>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-bold text-center mb-6 bg-gradient-to-r from-[var(--color-primary-400)] via-[var(--color-accent-400)] to-[var(--color-secondary-400)] bg-clip-text text-transparent"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Xorigo UI
        </motion.h1>

        <motion.p
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
        >
          <Button size="lg">
            开始使用
          </Button>
          <Button variant="outline" size="lg">
            查看文档
          </Button>
        </motion.div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        className="py-20 px-4"
        style={{ backgroundColor: 'var(--color-background-secondary)' }}
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