'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useVelocity, useAnimationFrame, MotionValue, useInView } from 'framer-motion'
import { SuperParticleSystem, Button, Card, Typography, XorigoLogoLoader } from '@xorigo-ui/core'

// 🎯 动画优化：创建 variants 简化动画参数配置
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const cardVariants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

// 🎯 页面加载动画 - 内联渐变工具实现
const PageLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 2500)

    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 2600)

    return () => {
      clearTimeout(timer)
      clearTimeout(contentTimer)
    }
  }, [])

  if (isLoaded) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative"
      >
        {/* 渐变光晕效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur-xl opacity-75 animate-pulse" />

        {/* Logo 容器 */}
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700">
          {/* 顶部渐变装饰 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-t-2xl" />

          <div className="flex flex-col items-center space-y-6">
            {/* Logo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">X</span>
              </div>
            </motion.div>

            {/* 渐变标题 */}
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Xorigo UI 渐变增强版
              </h1>
              <p className="text-gray-400 text-sm mt-2">正在加载炫彩渐变效果...</p>
            </div>

            {/* 渐变进度条 */}
            <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
              />
            </div>
          </div>

          {/* 底部渐变装饰 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-b-2xl" />
        </div>
      </motion.div>
    </div>
  )
}

// 🎯 内联渐变工具实现（避免模块依赖问题）
const inlineGradientUtils = {
  primary: {
    background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    text: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    border: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
  },
  success: {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    text: 'linear-gradient(135deg, #10b981, #059669)',
    border: 'linear-gradient(135deg, #10b981, #059669)',
  },
  rainbow: {
    background: 'linear-gradient(90deg, #3b82f6, #f59e0b, #10b981, #06b6d4)',
    text: 'linear-gradient(90deg, #3b82f6, #f59e0b, #10b981, #06b6d4)',
    border: 'linear-gradient(90deg, #3b82f6, #f59e0b, #10b981, #06b6d4)',
  },
  glass: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
    text: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
    border: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
  }
}

// 创建渐变样式的工具函数
const createGradientStyle = (type: 'background' | 'text' | 'border', preset: keyof typeof inlineGradientUtils) => {
  const gradient = inlineGradientUtils[preset][type]

  switch (type) {
    case 'text':
      return { background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }
    case 'background':
      return { background: gradient }
    case 'border':
      return { background: gradient, padding: '1px' }
    default:
      return {}
  }
}

// 🎯 增强版标题组件 - 使用内联渐变工具
const GradientTitle = ({ children, preset = 'primary' as const, className = '' }) => {
  return (
    <h1
      style={createGradientStyle('text', preset)}
      className={`text-5xl md:text-7xl font-bold ${className}`}
    >
      {children}
    </h1>
  )
}

// 🎯 增强版按钮组件 - 使用内联渐变工具
const GradientButton = ({
  children,
  preset = 'primary' as const,
  onClick,
  className = '',
  ...props
}: {
  children: React.ReactNode
  preset?: keyof typeof inlineGradientUtils
  onClick?: () => void
  className?: string
  [key: string]: any
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${className}`}
      style={createGradientStyle('background', preset)}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
           style={{ background: 'linear-gradient(45deg, rgba(255,255,255,0.2), transparent)' }} />
    </motion.button>
  )
}

// 🎯 增强版卡片组件 - 使用内联渐变工具
const GradientCard = ({
  children,
  preset = 'glass' as const,
  className = '',
  ...props
}: {
  children: React.ReactNode
  preset?: keyof typeof inlineGradientUtils
  className?: string
  [key: string]: any
}) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className={`relative p-6 rounded-2xl backdrop-blur-sm border border-white/10 ${className}`}
      style={createGradientStyle('background', preset)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// 🎯 主页面组件
export default function GradientEnhancedDemo() {
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // 🎯 滚动进度指示器 - 渐变增强
  const scrollProgress = useSpring(scrollYProgress, { stiffness: 400, damping: 40 })

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <>
      {/* 🎯 渐变滚动进度条 */}
      <motion.div
        style={{ scaleX: scrollProgress }}
        className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
        style={{
          background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #10b981, #f59e0b)'
        }}
      />

      {/* 🎯 动态背景 - 多层渐变视差 */}
      <div
        ref={containerRef}
        className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
      >
        {/* 背景渐变层 */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 opacity-30"
        >
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-green-500/20 to-cyan-400/20 rounded-full blur-3xl" />
        </motion.div>

        {/* 🎯 主要内容 */}
        <div className="relative z-10">
          {/* Hero Section - 渐变增强 */}
          <motion.section
            variants={pageVariants}
            initial="initial"
            animate="animate"
            className="min-h-screen flex items-center justify-center px-4"
          >
            <div className="max-w-7xl mx-auto text-center">
              {/* 渐变主标题 */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <GradientTitle preset="rainbow" className="mb-6">
                  Xorigo UI 渐变增强版
                </GradientTitle>
              </motion.div>

              {/* 渐变副标题 */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-8"
              >
                <h2 style={createGradientStyle('text', 'primary')} className="text-2xl md:text-3xl font-semibold mb-4">
                  现代渐变设计系统
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  体验完全使用渐变工具构建的现代化界面，
                  <span style={createGradientStyle('text', 'success')} className="font-semibold"> 9种语义化渐变预设</span>，
                  <span style={createGradientStyle('text', 'rainbow')} className="font-semibold"> 3种渐变类型</span>，
                  与现有组件完美集成
                </p>
              </motion.div>

              {/* 渐变按钮组 */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-center mb-12"
              >
                <GradientButton preset="primary" className="px-8 py-4 text-lg">
                  开始体验
                </GradientButton>
                <GradientButton preset="success" className="px-8 py-4 text-lg">
                  查看组件
                </GradientButton>
                <GradientButton preset="rainbow" className="px-8 py-4 text-lg">
                  源码演示
                </GradientButton>
              </motion.div>

              {/* 渐变特性卡片 */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
              >
                <GradientCard preset="glass">
                  <h3 style={createGradientStyle('text', 'primary')} className="text-xl font-bold mb-3">
                    🎨 语义化渐变
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    基于 CSS 自定义属性的渐变系统，支持主题切换，确保10种主题下的一致性表现
                  </p>
                </GradientCard>

                <GradientCard preset="glass">
                  <h3 style={createGradientStyle('text', 'success')} className="text-xl font-bold mb-3">
                    ⚡ 高性能动画
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    使用 Framer Motion 优化的渐变动画，支持流动效果、脉冲动画和状态转换
                  </p>
                </GradientCard>

                <GradientCard preset="glass">
                  <h3 style={createGradientStyle('text', 'rainbow')} className="text-xl font-bold mb-3">
                    🧩 完美集成
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    为现有组件提供渐变增强功能，无需重写组件，保持API一致性
                  </p>
                </GradientCard>
              </motion.div>
            </div>
          </motion.section>

          {/* 🎯 渐变展示区域 */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="min-h-screen flex items-center justify-center px-4 py-20"
          >
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 style={createGradientStyle('text', 'rainbow')} className="text-4xl md:text-5xl font-bold mb-6">
                  渐变预设展示
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  所有渐变效果都使用内联渐变工具实现，无需外部依赖
                </p>
              </motion.div>

              {/* 渐变预设网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(inlineGradientUtils).map(([preset, gradients], index) => (
                  <motion.div
                    key={preset}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="relative group"
                  >
                    <div
                      className="p-6 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                      style={createGradientStyle('background', preset)}
                    >
                      <h3 className="text-white font-bold text-lg mb-3 capitalize">
                        {preset} 渐变
                      </h3>
                      <div className="space-y-2">
                        <div
                          className="h-4 rounded"
                          style={createGradientStyle('background', preset)}
                        />
                        <div
                          className="h-4 rounded"
                          style={createGradientStyle('border', preset)}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  )
}