'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useInView } from 'framer-motion'
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
  Workflow
} from 'lucide-react'

/**
 * 终极稳定版 - 修复了所有动画问题的版本
 * 专注于性能优化和稳定性
 */

// 简化的粒子系统
const StableParticleSystem = () => {
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
  }>>([])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    setMounted(true)

    if (typeof window !== 'undefined') {
      // 初始化粒子
      const initialParticles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        color: ['#8B5CF6', '#06B6D4', '#EC4899', '#F59E0B'][Math.floor(Math.random() * 4)]
      }))
      setParticles(initialParticles)

      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
      }

      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => {
        let { x, y, vx, vy } = particle

        // 简单的鼠标吸引力
        const dx = mouseX.get() - x
        const dy = mouseY.get() - y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 200 && distance > 0) {
          const force = (200 - distance) / 200 * 0.005
          vx += (dx / distance) * force
          vy += (dy / distance) * force
        }

        // 阻尼
        vx *= 0.99
        vy *= 0.99

        // 更新位置
        x += vx
        y += vy

        // 边界反弹
        if (typeof window !== 'undefined') {
          if (x < 0 || x > window.innerWidth) {
            vx = -vx * 0.8
            x = Math.max(0, Math.min(window.innerWidth, x))
          }
          if (y < 0 || y > window.innerHeight) {
            vy = -vy * 0.8
            y = Math.max(0, Math.min(window.innerHeight, y))
          }
        }

        return { ...particle, x, y, vx, vy }
      }))
    }, 16) // 60fps

    return () => clearInterval(interval)
  }, [mounted, mouseX, mouseY])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: 0.6
          }}
        />
      ))}

      {/* 鼠标光晕 */}
      <motion.div
        className="absolute w-[400px] h-[400px] pointer-events-none"
        style={{
          left: mouseX,
          top: mouseY,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative w-full h-full">
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-purple-500/20 via-purple-500/5 to-transparent"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>
      </motion.div>
    </div>
  )
}

// 简化的3D轮播
const SimpleCarousel = () => {
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
    }, 4000)
    return () => clearInterval(interval)
  }, [components.length])

  return (
    <div className="relative h-80 flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl">
        {components.map((component, index) => {
          const offset = index - activeIndex
          const isActive = offset === 0

          return (
            <motion.div
              key={component.name}
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                x: `${offset * 100}%`,
                opacity: Math.abs(offset) > 1 ? 0 : 1 - Math.abs(offset) * 0.5,
                scale: 1 - Math.abs(offset) * 0.2,
                zIndex: isActive ? 10 : 5 - Math.abs(offset)
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <motion.div
                className={`relative w-64 h-72 rounded-2xl bg-gradient-to-br ${component.color} p-[2px] cursor-pointer`}
                whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                onClick={() => setActiveIndex(index)}
              >
                <div className="relative w-full h-full bg-black/90 rounded-2xl p-8 flex flex-col items-center justify-center">
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{
                      rotateY: isActive ? 360 : 0,
                    }}
                    transition={{ duration: 2 }}
                  >
                    {React.cloneElement(component.icon as React.ReactElement, {
                      className: 'w-20 h-20 text-white'
                    })}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{component.name}</h3>
                  <p className="text-gray-400 text-center text-sm">现代化的 {component.name} 组件</p>
                </div>
              </motion.div>
            </motion.div>
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

// 简化的代码编辑器
const SimpleCodeEditor = () => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const code = `import { Button, Card } from '@xorigo-ui/core'

function App() {
  return (
    <Card className="p-6">
      <h1>欢迎使用 Xorigo UI</h1>
      <Button variant="primary">
        开始构建
      </Button>
    </Card>
  )
}`
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gray-900/90 rounded-2xl overflow-hidden border border-purple-500/20 max-w-4xl mx-auto"
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
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* 代码内容 */}
      <pre className="p-6 text-sm overflow-x-auto">
        <code className="text-gray-300">{`import { Button, Card } from '@xorigo-ui/core'

function App() {
  return (
    <Card className="p-6">
      <h1>欢迎使用 Xorigo UI</h1>
      <Button variant="primary">
        开始构建
      </Button>
    </Card>
  )
}`}</code>
      </pre>
    </motion.div>
  )
}

// 简化的统计数字动画
const SimpleCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
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

// 简化的导航栏
const SimpleNavbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-purple-500/20 shadow-lg'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div className="relative w-10 h-10">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "loop", ease: 'linear' }}
              />
              <div className="relative w-full h-full flex items-center justify-center text-white font-bold text-lg">
                X
              </div>
            </motion.div>
            <div className="text-xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Xorigo UI
              </span>
            </div>
          </motion.div>

          {/* Menu */}
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
    </motion.nav>
  )
}

// 主组件
export default function UltimateStableHome() {
  const { scrollYProgress } = useScroll()
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5], [1, 0.7])

  const stats = [
    { label: '组件', value: 50, suffix: '+', icon: <Box /> },
    { label: '主题', value: 20, suffix: '+', icon: <Palette /> },
    { label: 'TypeScript', value: 100, suffix: '%', icon: <Code2 /> },
    { label: '性能提升', value: 50, suffix: '%', icon: <Zap /> }
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 背景效果 */}
      <StableParticleSystem />

      {/* 导航栏 */}
      <SimpleNavbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div
          className="max-w-7xl mx-auto w-full text-center"
          style={{ scale: scaleProgress, opacity: opacityProgress }}
        >
          {/* 标题 */}
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Xorigo UI
            </span>
          </motion.h1>

          <motion.p
            className="text-2xl text-gray-300 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            下一代 React 组件库
          </motion.p>

          <motion.p
            className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            由 Saken 与 AI 协作打造，为现代 Web 应用提供极致的开发体验
          </motion.p>

          {/* CTA按钮组 */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <SimpleCodeEditor />
          </motion.div>
        </motion.div>
      </section>

      {/* 组件展示 */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                组件预览
              </span>
            </h2>
            <p className="text-lg text-gray-400">
              探索我们精心打造的每一个组件
            </p>
          </motion.div>

          <SimpleCarousel />
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
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {React.cloneElement(stat.icon as React.ReactElement, {
                    className: 'w-8 h-8 text-white'
                  })}
                </motion.div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  <SimpleCounter value={stat.value} suffix={stat.suffix} />
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
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
    </div>
  )
}