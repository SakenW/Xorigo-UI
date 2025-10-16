'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence, useAnimation, useReducedMotion } from 'framer-motion'
import { Button, Card, AnimatedCard, Typography, Surface, Code as CodeComponent } from '@xorigo-ui/core'
import {
  Sparkles,
  Zap,
  Layers,
  Palette,
  Code,
  Package,
  Rocket,
  Star,
  GitBranch,
  Cpu,
  Globe,
  Shield,
  Terminal,
  Play,
  ExternalLink,
  Github,
  Heart,
  Lightbulb,
  ChevronDown,
  TrendingUp,
  Activity,
  Box,
  Wrench,
  Eye
} from 'lucide-react'

// 超高级粒子系统 - 支持多种粒子类型和交互
const UltimateParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()
  const particlesRef = useRef<any[]>([])
  const connectionsRef = useRef<any[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 粒子类定义
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
      type: 'normal' | 'glow' | 'magnetic' | 'pulse'
      pulsePhase: number
      glowIntensity: number
      connections: number[]

      constructor(type: 'normal' | 'glow' | 'magnetic' | 'pulse' = 'normal') {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.8
        this.vy = (Math.random() - 0.5) * 0.8
        this.radius = Math.random() * 2 + 1
        this.type = type
        this.pulsePhase = Math.random() * Math.PI * 2
        this.glowIntensity = Math.random()
        this.connections = []

        // 根据类型设置颜色
        const colors = {
          normal: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
          glow: ['#fbbf24', '#f59e0b', '#f97316'],
          magnetic: ['#06b6d4', '#0891b2', '#0e7490'],
          pulse: ['#ec4899', '#db2777', '#be185d']
        }
        const typeColors = colors[type]
        this.color = typeColors[Math.floor(Math.random() * typeColors.length)]
      }

      update() {
        // 边界反弹
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.vx = -this.vx * 0.95
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.vy = -this.vy * 0.95
        }

        // 鼠标交互
        const dx = mouseRef.current.x - this.x
        const dy = mouseRef.current.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (this.type === 'magnetic' && distance < 150) {
          const force = (150 - distance) / 150
          this.vx += (dx / distance) * force * 0.1
          this.vy += (dy / distance) * force * 0.1
        } else if (this.type === 'normal' && distance < 100) {
          const force = (100 - distance) / 100
          this.vx -= (dx / distance) * force * 0.05
          this.vy -= (dy / distance) * force * 0.05
        }

        // 速度衰减
        this.vx *= 0.995
        this.vy *= 0.995

        // 位置更新
        this.x += this.vx
        this.y += this.vy

        // 脉冲效果
        if (this.type === 'pulse') {
          this.pulsePhase += 0.05
        }

        // 发光效果
        if (this.type === 'glow') {
          this.glowIntensity = Math.sin(Date.now() * 0.002) * 0.5 + 0.5
        }
      }

      draw() {
        ctx.save()

        if (this.type === 'glow') {
          // 发光效果
          ctx.shadowBlur = 20 * this.glowIntensity
          ctx.shadowColor = this.color
        }

        ctx.fillStyle = this.color
        ctx.beginPath()

        // 确保半径始终为正数
        let drawRadius = this.radius
        if (this.type === 'pulse') {
          const pulseRadius = this.radius + Math.sin(this.pulsePhase) * 2
          drawRadius = Math.max(0.5, pulseRadius) // 确保最小半径为0.5
          ctx.globalAlpha = 0.6 + Math.sin(this.pulsePhase) * 0.4
        }

        ctx.arc(this.x, this.y, drawRadius, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }
    }

    // 创建粒子 - 增加数量和类型
    const particles: Particle[] = []
    const particleCount = 150 // 增加到150个粒子

    for (let i = 0; i < particleCount; i++) {
      let type: 'normal' | 'glow' | 'magnetic' | 'pulse' = 'normal'
      if (i < particleCount * 0.2) type = 'glow'
      else if (i < particleCount * 0.4) type = 'magnetic'
      else if (i < particleCount * 0.6) type = 'pulse'

      particles.push(new Particle(type))
    }

    particlesRef.current = particles

    // 鼠标移动事件
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 动画循环
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 更新和绘制粒子
      particles.forEach((particle, i) => {
        particle.update()
        particle.draw()

        // 连线效果
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - distance / 120)})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)' }}
    />
  )
}

// 超级代码雨效果 - 支持多语言和彩色
const UltimateCodeRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 多语言字符集
    const charSets = {
      javascript: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}();<>',
      typescript: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}();<> interface type',
      python: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}();<> def class import',
      binary: '01',
      matrix: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      emoji: '⚡🚀✨💎🔥⭐🌟💫⚙️🎯🎨🎭🎪'
    }

    // 代码列类
    class CodeColumn {
      x: number
      y: number
      speed: number
      chars: string[]
      charSet: string
      colors: string[]
      currentCharIndex: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height - canvas.height
        this.speed = Math.random() * 2 + 1

        const languages = Object.keys(charSets) as Array<keyof typeof charSets>
        const language = languages[Math.floor(Math.random() * languages.length)]
        this.charSet = charSets[language]

        // 根据语言设置颜色
        const colorSchemes = {
          javascript: ['#61dafb', '#38a169', '#f7df1e'],
          typescript: ['#3178c6', '#007acc', '#ff6b6b'],
          python: ['#3776ab', '#ffd43b', '#6cb52d'],
          binary: ['#00ff00', '#00cc00', '#009900'],
          matrix: ['#00ff00', '#00dd00', '#00bb00'],
          emoji: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b']
        }

        this.colors = colorSchemes[language]
        this.chars = []
        this.currentCharIndex = 0

        const columnHeight = Math.floor(Math.random() * 20) + 10
        for (let i = 0; i < columnHeight; i++) {
          this.chars.push(this.charSet[Math.floor(Math.random() * this.charSet.length)])
        }
      }

      update() {
        this.y += this.speed

        // 随机改变字符
        if (Math.random() < 0.1) {
          const charIndex = Math.floor(Math.random() * this.chars.length)
          this.chars[charIndex] = this.charSet[Math.floor(Math.random() * this.charSet.length)]
        }

        // 重置位置
        if (this.y > canvas.height + this.chars.length * 20) {
          this.y = -this.chars.length * 20
          this.x = Math.random() * canvas.width
          this.speed = Math.random() * 2 + 1
        }
      }

      draw() {
        this.chars.forEach((char, index) => {
          const y = this.y + index * 20

          if (y > 0 && y < canvas.height) {
            // 渐变效果
            const opacity = 1 - (index / this.chars.length)
            const colorIndex = Math.min(Math.floor(index / 5), this.colors.length - 1)

            ctx.fillStyle = this.colors[colorIndex] + Math.floor(opacity * 255).toString(16).padStart(2, '0')
            ctx.font = '14px monospace'
            ctx.fillText(char, this.x, y)

            // 发光效果
            if (index === 0) {
              ctx.shadowBlur = 10
              ctx.shadowColor = this.colors[0]
              ctx.fillText(char, this.x, y)
              ctx.shadowBlur = 0
            }
          }
        })
      }
    }

    // 创建代码列
    const columns: CodeColumn[] = []
    const columnCount = Math.floor(canvas.width / 30)

    for (let i = 0; i < columnCount; i++) {
      columns.push(new CodeColumn())
    }

    // 动画循环
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      columns.forEach(column => {
        column.update()
        column.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-10 opacity-30" />
}

// 3D 球体组件展示
const ComponentSphere = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x + 0.5,
        y: prev.y + 1
      }))
    }, 30)

    return () => clearInterval(interval)
  }, [])

  const components = [
    { name: 'Button', icon: <Zap className="w-8 h-8" />, color: 'from-purple-500 to-pink-500' },
    { name: 'Card', icon: <Layers className="w-8 h-8" />, color: 'from-blue-500 to-cyan-500' },
    { name: 'Input', icon: <Code className="w-8 h-8" />, color: 'from-green-500 to-emerald-500' },
    { name: 'Modal', icon: <Box className="w-8 h-8" />, color: 'from-orange-500 to-red-500' },
    { name: 'Form', icon: <Wrench className="w-8 h-8" />, color: 'from-indigo-500 to-purple-500' },
    { name: 'Table', icon: <GitBranch className="w-8 h-8" />, color: 'from-yellow-500 to-orange-500' },
    { name: 'Badge', icon: <Star className="w-8 h-8" />, color: 'from-pink-500 to-rose-500' },
    { name: 'Avatar', icon: <Eye className="w-8 h-8" />, color: 'from-teal-500 to-blue-500' }
  ]

  const radius = 200

  return (
    <div className="relative w-[500px] h-[500px] mx-auto" ref={containerRef}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
          {components.map((component, index) => {
            const angle = (index / components.length) * Math.PI * 2
            const x = Math.sin(angle + rotation.y * Math.PI / 180) * radius
            const z = Math.cos(angle + rotation.y * Math.PI / 180) * radius
            const y = Math.sin(rotation.x * Math.PI / 180) * 50

            return (
              <motion.div
                key={component.name}
                className="absolute w-24 h-24 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 flex flex-col items-center justify-center shadow-2xl"
                style={{
                  transform: `translate3d(${x + 250 - 48}px, ${y + 250 - 48}px, ${z}px)`,
                  opacity: (z + radius) / (radius * 2),
                  zIndex: Math.floor((z + radius) / 10)
                }}
                whileHover={{ scale: 1.1, rotateY: 10 }}
              >
                <div className={`bg-gradient-to-br ${component.color} bg-clip-text text-transparent mb-2`}>
                  {component.icon}
                </div>
                <span className="text-white text-xs font-medium">{component.name}</span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 中心发光效果 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20" />
      </div>
    </div>
  )
}

// 超级统计卡片
const UltraStatsCard = ({ icon, title, value, description, trend }: any) => {
  return (
    <motion.div
      className="relative group"
      whileHover={{ y: -5, rotateX: 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
      <Surface className="relative bg-gray-900/90 backdrop-blur-xl border-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white">
              {icon}
            </div>
            {trend && (
              <div className="flex items-center text-green-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                {trend}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">{value}</h3>
            <p className="text-gray-300 font-medium">{title}</p>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>
        </div>

        {/* 底部光效 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
      </Surface>
    </motion.div>
  )
}

// 超级导航栏
const UltimateNavbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-gray-800' : ''
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Xorigo UI</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['组件', '文档', '示例', '博客'].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* GitHub Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="bg-purple-600 hover:bg-purple-700 text-white border-purple-400/30 px-6 py-2.5 rounded-full font-medium flex items-center gap-2"
              onClick={() => window.open('https://github.com/SakenW/Xorigo-UI', '_blank')}
            >
              <Github className="w-4 h-4" />
              GitHub
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  className="text-white"
                >
                  ✕
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  className="text-white"
                >
                  ☰
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-4 space-y-2"
            >
              {['组件', '文档', '示例', '博客'].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className="block py-2 text-gray-300 hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                >
                  {item}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default function UltimateHome() {
  const { scrollY } = useScroll()
  const shouldReduceMotion = useReducedMotion()

  const backgroundY = useTransform(scrollY, [0, 1000], [0, 200])
  const textY = useTransform(scrollY, [0, 1000], [0, -50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const stats = [
    {
      icon: <Package className="w-6 h-6" />,
      title: '组件总数',
      value: '25+',
      description: '精心设计的高质量组件',
      trend: '+15%'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: '设计令牌',
      value: '500+',
      description: '完整的设计系统令牌',
      trend: '+25%'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: '性能评分',
      value: '99+',
      description: 'Lighthouse 性能评分',
      trend: '+5%'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '类型安全',
      value: '100%',
      description: '完整的 TypeScript 支持',
      trend: '0%'
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: '动画流畅度',
      value: '60fps',
      description: '丝滑的动画体验',
      trend: '+10%'
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: '创新特性',
      value: '10+',
      description: '独特的创新功能',
      trend: '+20%'
    }
  ]

  const techStack = [
    { name: 'React 19', description: '最新的 React 特性', color: 'from-cyan-500 to-blue-500' },
    { name: 'TypeScript 5.9', description: '类型安全保证', color: 'from-blue-500 to-indigo-500' },
    { name: 'Tailwind CSS 3.4', description: '原子化 CSS 框架', color: 'from-green-500 to-emerald-500' },
    { name: 'Framer Motion 12', description: '专业动画库', color: 'from-purple-500 to-pink-500' },
    { name: 'Vite 5', description: '极速构建工具', color: 'from-orange-500 to-red-500' },
    { name: 'Vitest', description: '现代测试框架', color: 'from-yellow-500 to-orange-500' }
  ]

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 背景层 */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{ y: shouldReduceMotion ? 0 : backgroundY }}
      >
        <UltimateParticleSystem />
        <UltimateCodeRain />
      </motion.div>

      {/* 导航栏 */}
      <UltimateNavbar />

      {/* 主要内容 */}
      <main className="relative z-20">
        {/* Hero Section */}
        <motion.section
          className="min-h-screen flex items-center justify-center px-6 pt-20"
          style={{ opacity: shouldReduceMotion ? 1 : opacity }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              style={{ y: shouldReduceMotion ? 0 : textY }}
              className="space-y-8"
            >
              {/* 标题 */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="space-y-4"
              >
                <motion.h1
                  className="text-6xl md:text-8xl font-bold bg-gradient-to-br from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  Xorigo UI
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                  initial={{ y: 30 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  🚀 极致视觉体验的现代 UI 组件库
                  <br />
                  <span className="text-purple-400">React 19 + TypeScript 5.9 + Framer Motion 12</span>
                </motion.p>
              </motion.div>

              {/* 3D 组件球体 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="py-12"
              >
                <ComponentSphere />
              </motion.div>

              {/* 按钮组 */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-2xl shadow-purple-500/30 border border-purple-400/30"
                    onClick={() => window.open('https://github.com/SakenW/Xorigo-UI', '_blank')}
                  >
                    <Github className="w-5 h-5 mr-2" />
                    立即开始
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-purple-400/30 text-purple-300 hover:text-white hover:bg-purple-600/20 px-12 py-4 rounded-full text-lg font-semibold"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    查看演示
                  </Button>
                </motion.div>
              </motion.div>

              {/* 滚动提示 */}
              <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronDown className="w-6 h-6 text-purple-400" />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* 统计数据 */}
        <motion.section
          className="py-20 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ y: 30 }}
              whileInView={{ y: 0 }}
              transition={{ type: "spring" }}
              viewport={{ once: true }}
            >
              强大的功能特性
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  viewport={{ once: true }}
                >
                  <UltraStatsCard {...stat} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 技术栈 */}
        <motion.section
          className="py-20 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ y: 30 }}
              whileInView={{ y: 0 }}
              transition={{ type: "spring" }}
              viewport={{ once: true }}
            >
              现代化技术栈
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    hover: { type: "spring", stiffness: 400 }
                  }}
                  viewport={{ once: true }}
                >
                  <Surface className="p-6 bg-gray-900/90 backdrop-blur-xl border-gray-800 hover:border-purple-500/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${tech.color} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                        {tech.name.charAt(0)}
                      </div>
                      <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                        {tech.name.split(' ')[1]}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{tech.name}</h3>
                    <p className="text-gray-400">{tech.description}</p>
                  </Surface>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 页脚 */}
        <footer className="py-12 px-6 border-t border-gray-800">
          <div className="max-w-7xl mx-auto text-center">
            <motion.p
              className="text-gray-400 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span> crafted with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>by Saken + AI Assistant</span>
            </motion.p>
          </div>
        </footer>
      </main>
    </div>
  )
}