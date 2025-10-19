'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useVelocity, useAnimationFrame, MotionValue, useInView } from 'framer-motion'
import { SuperParticleSystem, Button, Card, Typography, XorigoLogoLoader } from '@xorigo-ui/core'
import { gradientUtils, type GradientType } from '@xorigo-ui/core/utils'

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

// 🎯 页面加载动画 - 使用渐变工具增强
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

  const titleGradient = gradientUtils.getTextGradientClasses('primary')
  const subtitleGradient = gradientUtils.getTextGradientClasses('subtle')

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex flex-col items-center justify-center">
        <XorigoLogoLoader
          variant="enhanced"
          size="xl"
          duration={2000}
          showProgress={true}
          className="scale-125"
        />

        {/* 使用渐变工具替换硬编码渐变 */}
        <motion.div
          className="mt-8 text-center"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 style={titleGradient.style} className="text-3xl font-bold mb-2">
            Xorigo UI
          </h2>
          <motion.p
            style={subtitleGradient.style}
            className="text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            下一代 React 组件库
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// 组件展示卡片 - 使用渐变工具
const ComponentCard = ({ name, icon, gradientType, desc }: {
  name: string
  icon: React.ReactNode
  gradientType: GradientType
  desc: string
}) => {
  const backgroundGradient = gradientUtils.getBackgroundGradientClasses(gradientType)
  const borderGradient = gradientUtils.getBorderGradientClasses(gradientType, 2)

  return (
    <motion.div
      className="relative w-72 h-96 rounded-3xl p-[2px] cursor-pointer"
      variants={cardVariants}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      style={borderGradient.style}
    >
      <div className="relative w-full h-full bg-white dark:bg-gray-900 rounded-3xl p-6 flex flex-col items-center justify-center overflow-hidden">
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent`} />

        <div className="relative z-10 text-center">
          <div className="text-4xl mb-4" style={backgroundGradient.style}>
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 dark:bg-gray-800/20 rounded-2xl flex items-center justify-center shadow-lg">
              {icon}
            </div>
          </div>

          <h3 style={gradientUtils.getTextGradientClasses(gradientType).style} className="text-2xl font-bold mb-2">
            {name}
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            {desc}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// 统计数字卡片 - 使用渐变工具
const StatsCard = ({ number, label, gradientType }: {
  number: string
  label: string
  gradientType: GradientType
}) => {
  const numberGradient = gradientUtils.getTextGradientClasses(gradientType)
  const backgroundGradient = gradientUtils.getBackgroundGradientClasses('subtle')

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl p-8"
      style={backgroundGradient.style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: Math.random() * 0.3 }}
    >
      <div className="relative z-10 text-center">
        <div style={numberGradient.style} className="text-4xl font-bold mb-2">
          {number}
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {label}
        </p>
      </div>
    </motion.div>
  )
}

// 主要页面组件
export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const components = [
    { name: 'Button', icon: '🔘', gradientType: 'primary' as GradientType, desc: '灵活的按钮组件' },
    { name: 'Card', icon: '📋', gradientType: 'success' as GradientType, desc: '优雅的卡片容器' },
    { name: 'Input', icon: '📝', gradientType: 'warning' as GradientType, desc: '强大的表单输入' },
    { name: 'Modal', icon: '🪟', gradientType: 'error' as GradientType, desc: '流畅的弹窗组件' },
    { name: 'Table', icon: '📊', gradientType: 'info' as GradientType, desc: '智能数据表格' },
    { name: 'Form', icon: '📄', gradientType: 'rainbow' as GradientType, desc: '完整的表单方案' }
  ]

  const stats = [
    { number: '50+', label: 'UI 组件', gradientType: 'primary' as GradientType },
    { number: '10+', label: '主题配色', gradientType: 'success' as GradientType },
    { number: '100%', label: 'TypeScript', gradientType: 'info' as GradientType },
    { number: 'A11y', label: '可访问性', gradientType: 'warning' as GradientType }
  ]

  const heroGradient = gradientUtils.getBackgroundGradientClasses('dark')

  return (
    <>
      <PageLoader />

      {/* 英雄区域 - 使用渐变工具 */}
      <section style={heroGradient.style} className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <SuperParticleSystem />

        <div className="relative z-10 text-center px-4">
          <motion.h1
            style={gradientUtils.getTextGradientClasses('primary').style}
            className="text-6xl md:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Xorigo UI
          </motion.h1>

          <motion.p
            style={gradientUtils.getTextGradientClasses('subtle').style}
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            基于 React 19 + TypeScript 5.9 + Tailwind CSS 4 的下一代组件库
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              variant="primary"
              size="lg"
              style={gradientUtils.applyGradient('primary', 'background').style}
              className="px-8 py-4 text-lg"
            >
              开始使用
            </Button>

            <Button
              variant="outline"
              size="lg"
              style={gradientUtils.applyGradient('rainbow', 'border').style}
              className="px-8 py-4 text-lg"
            >
              查看文档
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 组件展示区域 */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 style={gradientUtils.getTextGradientClasses('primary').style} className="text-4xl font-bold mb-4">
              核心组件
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              使用渐变工具增强的组件展示
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {components.map((component, index) => (
              <ComponentCard
                key={component.name}
                {...component}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 统计数据区域 */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 style={gradientUtils.getTextGradientClasses('info').style} className="text-4xl font-bold mb-4">
              强大的功能
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              完整的设计系统和开发体验
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatsCard
                key={stat.label}
                {...stat}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 动态渐变展示区域 */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 style={gradientUtils.getTextGradientClasses('rainbow').style} className="text-4xl font-bold mb-4">
              动态渐变效果
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              基于语义化令牌的动态渐变
            </p>
          </motion.div>

          <div className="flex justify-center">
            <motion.div
              style={gradientUtils.createAnimatedGradient([
                'var(--bg-primary-action)',
                'var(--bg-secondary-action)',
                'var(--bg-info)',
                'var(--bg-success)',
                'var(--bg-warning)'
              ], 5)}
              className="h-32 w-full max-w-2xl rounded-2xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />
          </div>
        </div>
      </section>
    </>
  )
}