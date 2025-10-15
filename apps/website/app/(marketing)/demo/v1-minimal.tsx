'use client'

import React from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { Button, Card, AnimatedCard, Typography, Icon, Surface } from '@xorigo-ui/core'
import { ArrowRight, Star, Github, Package, Zap, Layers, Code2, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'

/**
 * 方案1：极简科技风
 * 特点：流体渐变、粒子动效、玻璃态、大量留白
 */

// 粒子背景组件
const ParticleBackground = () => {
  const [mounted, setMounted] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })
  const particles = Array.from({ length: 30 })

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })

      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight })
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-b from-cyan-400/30 to-purple-400/30 rounded-full"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          animate={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// 流体渐变背景
const FluidGradient = () => {
  return (
    <div className="absolute inset-0 opacity-30">
      <motion.div
        className="absolute -inset-[100%] opacity-50"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 119, 247, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
          `
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 100,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}

// 统计数字动画组件
const AnimatedNumber = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayValue(prev => {
        if (prev < value) {
          return Math.min(prev + Math.ceil(value / 50), value)
        }
        return value
      })
    }, 30)
    return () => clearInterval(timer)
  }, [value])

  return <span>{displayValue}{suffix}</span>
}

export default function MinimalTechHome() {
  const { scrollYProgress } = useScroll()
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [1, 0.3])
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY })
      }
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const features = [
    {
      icon: <Layers className="w-6 h-6" />,
      title: "17+ 核心组件",
      description: "精心设计的原子化组件，可组合成任意界面"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "20+ 主题配方",
      description: "七轴 DTCG 配方系统，一键切换设计风格"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "极致性能",
      description: "基于 React 19 和 Vite，构建速度提升 50%"
    }
  ]

  const techStack = [
    { name: "React 19", color: "from-cyan-400 to-blue-500" },
    { name: "TypeScript 5.9", color: "from-blue-400 to-indigo-500" },
    { name: "Tailwind CSS", color: "from-teal-400 to-cyan-500" },
    { name: "Framer Motion 12", color: "from-purple-400 to-pink-500" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
      {/* 背景效果 */}
      <ParticleBackground />
      <FluidGradient />

      {/* Hero Section */}
      <motion.section
        className="relative z-10 min-h-screen flex items-center justify-center px-6"
        style={{ scale: scaleProgress, opacity: opacityProgress }}
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo动画 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="mb-8 inline-block"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-cyan-500 rounded-3xl shadow-2xl shadow-purple-500/25 flex items-center justify-center">
              <span className="text-white text-4xl font-bold">X</span>
            </div>
          </motion.div>

          {/* 标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          >
            Xorigo UI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-4"
          >
            下一代 React 组件库
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-500 dark:text-gray-500 mb-12 max-w-2xl mx-auto"
          >
            为现代 Web 应用打造的极简设计系统，提供优雅、高性能、类型安全的组件
          </motion.p>

          {/* CTA按钮组 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="group bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              开始使用
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-2"
            >
              <Github className="mr-2 w-5 h-5" />
              GitHub
            </Button>
          </motion.div>

          {/* 技术栈标签 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex flex-wrap justify-center gap-3"
          >
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${tech.color} text-white text-sm font-medium shadow-lg`}
              >
                {tech.name}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 鼠标滚动指示器 */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-gray-400 rounded-full mt-2" />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              为什么选择 Xorigo UI
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              简单、强大、可扩展
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border-gray-200/50 dark:border-gray-800/50 hover:shadow-2xl transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: '组件', value: 17, suffix: '+' },
              { label: '主题配方', value: 20, suffix: '+' },
              { label: '周下载', value: 0, suffix: '' },
              { label: 'TypeScript', value: 100, suffix: '%' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <Card className="p-12 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 backdrop-blur-lg border-purple-200/50 dark:border-purple-800/50">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              准备好构建美观的界面了吗？
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Xorigo UI 是全新的组件库，由 Saken 和 AI 协作开发，持续迭代中
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-3"
              >
                <Package className="mr-2 w-5 h-5" />
                npm install @xorigo-ui/core
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open('https://github.com/SakenW/Xorigo-UI', '_blank')
                  }
                }}
              >
                <Star className="mr-2 w-5 h-5" />
                Star on GitHub
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Created by Saken + AI • Contact: saken.w@gmail.com
              </p>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}