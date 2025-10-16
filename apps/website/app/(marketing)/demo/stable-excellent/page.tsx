'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useVelocity, useAnimationFrame, MotionValue, useInView } from 'framer-motion'
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
  Infinity,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Eye,
  Fingerprint,
  Timer,
  Activity
} from 'lucide-react'

/**
 * 稳定优秀版 - 基于ultimate-final.tsx的优化版本
 * 特点：视觉效果震撼，性能稳定，代码质量高
 *
 * 主要特性：
 * - 页面加载动画
 * - 超级粒子系统（带鼠标轨迹）
 * - 3D组件轮播展示
 * - 视差滚动效果
 * - 流体背景动画
 * - 增强导航栏
 * - 代码编辑器组件
 * - 统计数字动画
 */

// 页面加载动画
const PageLoader = () => {
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoaded(true), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)
    return () => clearInterval(interval)
  }, [])

  if (isLoaded) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          className="w-32 h-32 mx-auto mb-8"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-3xl animate-pulse" />
            <div className="absolute inset-2 bg-black rounded-2xl flex items-center justify-center">
              <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                X
              </span>
            </div>
          </div>
        </motion.div>

        <div className="w-64 h-2 bg-gray-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>

        <motion.p
          className="mt-4 text-gray-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          初始化组件系统...
        </motion.p>
      </div>
    </motion.div>
  )
}

// 超级粒子系统 - 带鼠标轨迹
const SuperParticleSystem = () => {
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
    life: number
    type: 'normal' | 'trail' | 'explosion'
  }>>([])

  const [mouseTrail, setMouseTrail] = useState<Array<{ x: number; y: number; id: number }>>([])
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const mouseXSmooth = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const mouseYSmooth = useSpring(mouseY, { stiffness: 100, damping: 30 })

  useEffect(() => {
    setMounted(true)

    // 初始化粒子
    const initialParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      color: ['#8B5CF6', '#06B6D4', '#EC4899', '#F59E0B', '#10B981'][Math.floor(Math.random() * 5)],
      life: 1,
      type: 'normal' as const
    }))
    setParticles(initialParticles)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      // 添加鼠标轨迹
      setMouseTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }]
        return newTrail.slice(-20) // 保留最后20个点
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // 粒子物理动画
  useAnimationFrame(() => {
    setParticles(prev => prev.map(particle => {
      let { x, y, vx, vy, life, type } = particle

      if (type === 'normal') {
        // 鼠标吸引力和排斥力
        const dx = mouseXSmooth.get() - x
        const dy = mouseYSmooth.get() - y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          const force = (150 - distance) / 150 * 0.03
          vx += (dx / distance) * force
          vy += (dy / distance) * force
        }

        // 粒子间相互作用
        prev.forEach(other => {
          if (other.id !== particle.id) {
            const odx = other.x - x
            const ody = other.y - y
            const odist = Math.sqrt(odx * odx + ody)

            if (odist < 50 && odist > 0) {
              const repel = (50 - odist) / 50 * 0.01
              vx -= (odx / odist) * repel
              vy -= (ody / odist) * repel
            }
          }
        })
      }

      // 阻尼
      vx *= 0.98
      vy *= 0.98

      // 更新位置
      x += vx
      y += vy

      // 边界反弹
      if (x < 0 || x > window.innerWidth) {
        vx = -vx * 0.8
        x = Math.max(0, Math.min(window.innerWidth, x))
      }
      if (y < 0 || y > window.innerHeight) {
        vy = -vy * 0.8
        y = Math.max(0, Math.min(window.innerHeight, y))
      }

      // 生命周期
      life -= type === 'explosion' ? 0.02 : 0.001
      if (life <= 0) {
        x = Math.random() * window.innerWidth
        y = Math.random() * window.innerHeight
        life = 1
        type = 'normal'
      }

      return { ...particle, x, y, vx, vy, life, type }
    }))
  })

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* 粒子 */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            x: particle.x,
            y: particle.y,
            width: particle.size * (particle.type === 'explosion' ? 2 : 1),
            height: particle.size * (particle.type === 'explosion' ? 2 : 1),
            backgroundColor: particle.color,
            opacity: particle.life * 0.6,
            filter: `blur(${(1 - particle.life) * 2}px)`,
            boxShadow: `0 0 ${20 * particle.life}px ${particle.color}`
          }}
        />
      ))}

      {/* 鼠标轨迹 */}
      {mouseTrail.map((point, index) => (
        <motion.div
          key={point.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: point.x,
            top: point.y,
            backgroundColor: '#8B5CF6',
            opacity: (index / mouseTrail.length) * 0.5,
            filter: `blur(${(1 - index / mouseTrail.length) * 3}px)`
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      ))}

      {/* 鼠标超级光晕 */}
      <motion.div
        className="absolute w-[600px] h-[600px] pointer-events-none"
        style={{
          x: mouseXSmooth,
          y: mouseYSmooth,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative w-full h-full">
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-purple-500/30 via-purple-500/10 to-transparent"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute inset-[15%] bg-gradient-radial from-cyan-500/20 via-cyan-500/10 to-transparent"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute inset-[30%] bg-gradient-radial from-pink-500/15 via-pink-500/05 to-transparent"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}

// 3D组件轮播展示
const Component3DCarousel = () => {
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
    }, 3000)
    return () => clearInterval(interval)
  }, [components.length])

  return (
    <div className="relative h-96 flex items-center justify-center perspective-1000">
      <div className="relative w-full h-full max-w-4xl">
        {components.map((component, index) => {
          const offset = index - activeIndex
          const absOffset = Math.abs(offset)
          const isActive = offset === 0

          return (
            <motion.div
              key={component.name}
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                x: `${offset * 120}%`,
                z: -absOffset * 200,
                rotateY: offset * -30,
                opacity: absOffset > 1 ? 0 : 1 - absOffset * 0.3,
                scale: 1 - absOffset * 0.2
              }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div
                className={`relative w-64 h-80 rounded-3xl bg-gradient-to-br ${component.color} p-[2px] cursor-pointer`}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                onClick={() => setActiveIndex(index)}
              >
                <div className="relative w-full h-full bg-black/90 rounded-3xl p-8 flex flex-col items-center justify-center">
                  <motion.div
                    className="text-6xl mb-6"
                    animate={{
                      rotateY: isActive ? 360 : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: isActive ? Infinity : undefined,
                      repeatType: "loop"
                    }}
                  >
                    {React.cloneElement(component.icon as React.ReactElement, {
                      className: 'w-24 h-24 text-white'
                    })}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">{component.name}</h3>
                  <p className="text-gray-400 text-center">现代化的 {component.name} 组件</p>

                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-3xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      style={{
                        background: `radial-gradient(circle at center, ${
                          component.color.includes('purple') ? 'rgba(139, 92, 246, 0.3)' :
                          component.color.includes('cyan') ? 'rgba(6, 182, 212, 0.3)' :
                          component.color.includes('yellow') ? 'rgba(245, 158, 11, 0.3)' :
                          component.color.includes('green') ? 'rgba(16, 185, 129, 0.3)' :
                          component.color.includes('indigo') ? 'rgba(99, 102, 241, 0.3)' :
                          'rgba(236, 72, 153, 0.3)'
                        } 0%, transparent 70%)`
                      }}
                    />
                  )}
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

// 流体背景动画
const FluidBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-20">
      <svg className="w-full h-full">
        <defs>
          <filter id="fluid">
            <feTurbulence baseFrequency="0.01" numOctaves="2" result="turbulence" />
            <feColorMatrix in="turbulence" type="saturate" values="2" />
          </filter>
        </defs>
        <motion.rect
          width="100%"
          height="100%"
          filter="url(#fluid)"
          className="fill-purple-500/20"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
        />
      </svg>
    </div>
  )
}

// 代码编辑器组件
const CodeEditor = () => {
  const [code, setCode] = useState(`import { Button, Card } from '@xorigo-ui/core'

function App() {
  return (
    <Card className="p-6">
      <h1>欢迎使用 Xorigo UI</h1>
      <Button variant="primary">
        开始构建
      </Button>
    </Card>
  )
}`)

  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gray-900/90 rounded-2xl overflow-hidden border border-purple-500/20"
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
        <code className="text-gray-300">{code}</code>
      </pre>

      {/* 实时预览按钮 */}
      <motion.button
        className="absolute bottom-4 right-4 bg-purple-500/20 backdrop-blur-sm border border-purple-500/50 text-purple-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-500/30 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play className="w-4 h-4" />
        实时预览
      </motion.button>
    </motion.div>
  )
}

// 统计数字滚动动画
const CounterAnimation = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = value
      const duration = 2000
      const increment = end / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// 导航栏增强版
const EnhancedNavbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const navbarY = useTransform(scrollY, [0, 100], [0, -100])

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
          ? 'bg-black/90 backdrop-blur-3xl border-b border-purple-500/20 shadow-2xl shadow-purple-500/10'
          : 'bg-transparent'
      }`}
      style={{ y: navbarY }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo增强 */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div className="relative w-12 h-12">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl"
                animate={{
                  rotate: 360,
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "loop", ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/50 to-cyan-500/50 rounded-xl blur-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              />
              <div className="relative w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                X
              </div>
            </motion.div>
            <div className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-300">
                Xorigo UI
              </span>
            </div>
          </motion.div>

          {/* Desktop Menu增强 */}
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
                <motion.div
                  className="absolute -inset-x-2 -inset-y-1 bg-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  layoutId="nav-hover"
                />
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
              </motion.a>
            ))}

            <motion.button
              className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-2.5 rounded-full font-medium shadow-lg hover:shadow-purple-500/25 transition-all group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center">
                <Rocket className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" />
                开始使用
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>

          {/* Mobile Menu按钮 */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative w-8 h-8 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

// 主组件
export default function StableExcellentHome() {
  const { scrollYProgress } = useScroll()
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5], [1, 0.6])

  const stats = [
    { label: '组件', value: 50, suffix: '+', icon: <Box /> },
    { label: '主题', value: 20, suffix: '+', icon: <Palette /> },
    { label: 'TypeScript', value: 100, suffix: '%', icon: <Code2 /> },
    { label: '性能提升', value: 50, suffix: '%', icon: <Zap /> }
  ]

  const [soundEnabled, setSoundEnabled] = useState(false)

  return (
    <AnimatePresence>
      <PageLoader key="page-loader" />

      <motion.div
        key="main-content"
        className="min-h-screen bg-black text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* 背景效果层 */}
        <FluidBackground />
        <SuperParticleSystem />

        {/* 导航栏 */}
        <EnhancedNavbar />

        {/* Hero Section增强版 */}
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

              {/* 标题超级动画 */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <motion.h1
                  className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8"
                  style={{ perspective: '1000px' }}
                >
                  <motion.span
                    className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-300"
                    animate={{
                      rotateX: [0, 10, 0],
                      rotateY: [-10, 0, 10, 0, -10],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                  >
                    Xorigo UI
                  </motion.span>
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
                      <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      开始使用
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500"
                      initial={{ x: '100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
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
              </motion.div>

              {/* 代码编辑器展示 */}
              <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <CodeEditor />
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

            <Component3DCarousel />
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
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    {React.cloneElement(stat.icon as React.ReactElement, {
                      className: 'w-8 h-8 text-white'
                    })}
                  </div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    <CounterAnimation value={stat.value} suffix={stat.suffix} />
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
              <br />
              <span className="text-sm text-purple-400">
                稳定优秀版 • 基于ultimate-final.tsx • 视觉震撼且性能稳定
              </span>
            </motion.p>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  )
}