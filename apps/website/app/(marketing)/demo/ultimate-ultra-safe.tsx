'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion'
import { Button, Card, AnimatedCard, Typography, Surface, Code as CodeComponent } from '@xorigo-ui/core'
import {
  Sparkles,
  Zap,
  Layers,
  Palette,
  Box,
  Star,
  Github,
  ArrowRight,
  MousePointer2,
  Gem,
  Flame,
  Award,
  Crown,
  Heart,
  Terminal as TerminalIcon,
  Copy,
  Check,
  ChevronRight,
  Code2,
  Cpu,
  FileCode,
  Package,
  Rocket,
  Globe,
  Shield,
  Gauge,
  Puzzle,
  Lightbulb,
  Wand2,
  ArrowUpRight,
  Menu,
  X,
  Hexagon,
  Triangle,
  Circle,
  Square,
  Pentagon,
  Braces,
  Database,
  GitBranch,
  Cloud,
  Lock,
  Workflow,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react'

/**
 * 终极安全增强版 - 零错误配置
 * 所有动画都使用最安全的基础配置
 */

// 超级安全的粒子系统 - 只使用基础CSS动画
const UltraSafeParticleSystem = () => {
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    color: string
  }>>([])

  useEffect(() => {
    setMounted(true)

    if (typeof window !== 'undefined') {
      // 简化粒子配置
      const initialParticles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        color: ['#8B5CF6', '#06B6D4', '#EC4899', '#F59E0B'][Math.floor(Math.random() * 4)]
      }))
      setParticles(initialParticles)

      // 简单的粒子移动 - 使用CSS动画
      const moveParticles = () => {
        setParticles(prev => prev.map(particle => ({
          ...particle,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight
        })))
      }

      const interval = setInterval(moveParticles, 3000)
      return () => clearInterval(interval)
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* 使用CSS动画的粒子 */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: 0.5,
            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`
          }}
        />
      ))}

      {/* 静态鼠标光晕 - 无动画 */}
      <div className="absolute w-[300px] h-[300px] pointer-events-none">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent" />
        </div>
      </div>
    </div>
  )
}

// 超级安全的轮播 - 简化配置
const UltraSafeCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const components = [
    { name: 'Button', icon: <Box />, color: 'from-purple-500 to-pink-500' },
    { name: 'Card', icon: <Square />, color: 'from-cyan-500 to-blue-500' },
    { name: 'Input', icon: <Braces />, color: 'from-yellow-500 to-orange-500' },
    { name: 'Modal', icon: <Pentagon />, color: 'from-green-500 to-teal-500' },
    { name: 'Table', icon: <Database />, color: 'from-indigo-500 to-purple-500' },
    { name: 'Form', icon: <FileCode />, color: 'from-pink-500 to-rose-500' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % components.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [components.length])

  return (
    <div className="relative h-80 flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl">
        {components.map((component, index) => {
          const offset = index - activeIndex
          const isActive = offset === 0

          return (
            <div
              key={component.name}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{
                transform: `translateX(${offset * 100}%)`,
                zIndex: isActive ? 10 : 1
              }}
            >
              <div
                className={`relative w-64 h-72 rounded-2xl bg-gradient-to-br ${component.color} p-[2px] cursor-pointer transform transition-transform duration-300 hover:scale-105`}
                onClick={() => setActiveIndex(index)}
              >
                <div className="relative w-full h-full bg-black/90 rounded-2xl p-8 flex flex-col items-center justify-center">
                  {/* 使用CSS动画的图标 */}
                  <div
                    className="text-6xl mb-4"
                    style={{
                      animation: isActive ? 'spin 3s linear infinite' : 'none'
                    }}
                  >
                    {React.cloneElement(component.icon as React.ReactElement, {
                      className: 'w-20 h-20 text-white'
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{component.name}</h3>
                  <p className="text-gray-400 text-center text-sm">现代化的 {component.name} 组件</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 控制点 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
        {components.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex ? 'w-8 bg-purple-500' : 'bg-gray-600'
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

// 超级安全的代码编辑器
const UltraSafeCodeEditor = () => {
  const [copied, setCopied] = useState(false)

  // 将代码字符串移到组件作用域
  const code = `import { Button, Card, AnimatedCard } from '@xorigo-ui/core'

function App() {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        欢迎使用 Xorigo UI
      </h1>
      <p className="text-gray-600 mb-6">
        现代化的React组件库，为Web应用提供极致体验
      </p>
      <Button variant="primary" size="lg">
        <Rocket className="w-4 h-4 mr-2" />
        开始构建
      </Button>
    </Card>
  )
}`

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative bg-gray-900/90 rounded-2xl overflow-hidden border border-purple-500/20 max-w-5xl mx-auto"
    >
      {/* 编辑器头部 */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/50 border-b border-purple-500/10">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <span className="text-gray-400 text-sm ml-2">App.tsx</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">TypeScript</span>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 代码内容 */}
      <pre className="p-6 text-sm overflow-x-auto">
        <code className="text-gray-300 font-mono">{code}</code>
      </pre>

      {/* 实时预览按钮 */}
      <motion.button
        className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-purple-500/50 text-purple-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-500/30 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play className="w-4 h-4" />
        实时预览
      </motion.button>
    </motion.div>
  )
}

// 超级安全的统计数字动画
const UltraSafeCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const startTime = Date.now()
      const endTime = startTime + duration

      const updateCount = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)
        const currentCount = Math.floor(progress * value)
        setCount(currentCount)

        if (now < endTime) {
          requestAnimationFrame(updateCount)
        }
      }

      updateCount()
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// 超级安全的导航栏
const UltraSafeNavbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-purple-500/20 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - 使用CSS动画 */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative w-12 h-12">
              <div
                className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl"
                style={{
                  animation: 'spin 10s linear infinite'
                }}
              />
              <div className="relative w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                X
              </div>
            </div>
            <div className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Xorigo UI
              </span>
            </div>
          </motion.div>

          {/* Desktop Menu */}
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
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
              </motion.a>
            ))}

            <motion.button
              className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-purple-500/25 transition-all group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center">
                <Rocket className="w-4 h-4 mr-2" />
                开始使用
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  )
}

// 主组件
export default function UltraSafeEnhancedHome() {
  const { scrollYProgress } = useScroll()
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5], [1, 0.7])

  const stats = [
    { label: '组件', value: 50, suffix: '+', icon: <Box /> },
    { label: '主题', value: 20, suffix: '+', icon: <Palette /> },
    { label: 'TypeScript', value: 100, suffix: '%', icon: <Code2 /> },
    { label: '性能提升', value: 50, suffix: '%', icon: <Zap /> }
  ]

  const [soundEnabled, setSoundEnabled] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 背景效果层 */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-cyan-900/20" />
      </div>
      <UltraSafeParticleSystem />

      {/* 导航栏 */}
      <UltraSafeNavbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div
          className="max-w-7xl mx-auto w-full"
          style={{ scale: scaleProgress, opacity: opacityProgress }}
        >
          <div className="text-center">
            {/* 声音控制 */}
            <motion.button
              className="fixed bottom-4 right-4 z-50 bg-purple-500/20 backdrop-blur-sm border border-purple-500/50 text-purple-400 p-3 rounded-full"
              onClick={() => setSoundEnabled(!soundEnabled)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.button>

            {/* 标题 - 最简单配置 */}
            <motion.h1
              className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Xorigo UI
              </span>
            </motion.h1>

            <motion.p
              className="text-3xl text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              下一代 React 组件库
            </motion.p>

            <motion.p
              className="text-xl text-gray-500 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              由 Saken 与 AI 协作打造，为现代 Web 应用提供极致的开发体验
            </motion.p>

            {/* CTA按钮组 */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-12 py-5 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-purple-500/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  开始使用
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                className="group border-2 border-purple-500/50 hover:border-purple-400 text-white px-12 py-5 rounded-2xl text-lg font-bold backdrop-blur-sm hover:bg-purple-500/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://github.com/SakenW/Xorigo-UI', '_blank')}
              >
                <Github className="w-5 h-5 mr-2 inline-block group-hover:rotate-12 transition-transform" />
                GitHub
              </motion.button>
            </motion.div>

            {/* 代码编辑器展示 */}
            <motion.div
              className="max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <UltraSafeCodeEditor />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 3D组件展示 */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                组件预览
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              探索我们精心打造的每一个组件
            </p>
          </motion.div>

          <UltraSafeCarousel />
        </div>
      </section>

      {/* 统计数据 */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {React.cloneElement(stat.icon as React.ReactElement, {
                    className: 'w-10 h-10 text-white'
                  })}
                </motion.div>
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  <UltraSafeCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p
            className="text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Created with ❤️ by Saken + AI • {new Date().getFullYear()}
          </motion.p>
        </div>
      </footer>

      {/* 样式 */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
    </div>
  )
}