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

// 性能优化的粒子系统
const OptimizedParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()
  const particlesRef = useRef<any[]>([])
  const lastTimeRef = useRef(0)
  const fpsRef = useRef(0)
  const frameCountRef = useRef(0)
  const qualityRef = useRef<'high' | 'medium' | 'low'>('high')

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

    // 性能监控
    const monitorPerformance = (currentTime: number) => {
      frameCountRef.current++
      if (currentTime - lastTimeRef.current >= 1000) {
        fpsRef.current = frameCountRef.current
        frameCountRef.current = 0
        lastTimeRef.current = currentTime

        // 根据FPS调整质量
        if (fpsRef.current < 30) {
          qualityRef.current = 'low'
        } else if (fpsRef.current < 50) {
          qualityRef.current = 'medium'
        } else {
          qualityRef.current = 'high'
        }
      }
    }

    // 优化后的粒子类
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      baseRadius: number
      color: string
      type: 'normal' | 'glow' | 'magnetic'
      glowIntensity: number
      updateCounter: number

      constructor(type: 'normal' | 'glow' | 'magnetic' = 'normal') {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.6
        this.vy = (Math.random() - 0.5) * 0.6
        this.baseRadius = Math.random() * 1.5 + 0.5
        this.type = type
        this.glowIntensity = Math.random()
        this.updateCounter = 0

        const colors = {
          normal: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
          glow: ['#fbbf24', '#f59e0b', '#f97316'],
          magnetic: ['#06b6d4', '#0891b2', '#0e7490']
        }
        const typeColors = colors[type]
        this.color = typeColors[Math.floor(Math.random() * typeColors.length)]
      }

      update() {
        // 降低更新频率
        this.updateCounter++
        if (qualityRef.current === 'low' && this.updateCounter % 2 !== 0) return
        if (qualityRef.current === 'medium' && this.updateCounter % 1 !== 0) return

        // 边界反弹
        if (this.x + this.baseRadius > canvas.width || this.x - this.baseRadius < 0) {
          this.vx = -this.vx * 0.95
        }
        if (this.y + this.baseRadius > canvas.height || this.y - this.baseRadius < 0) {
          this.vy = -this.vy * 0.95
        }

        // 鼠标交互 - 只对磁性粒子
        if (this.type === 'magnetic') {
          const dx = mouseRef.current.x - this.x
          const dy = mouseRef.current.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            const force = (120 - distance) / 120
            this.vx += (dx / distance) * force * 0.08
            this.vy += (dy / distance) * force * 0.08
          }
        }

        // 速度衰减
        this.vx *= 0.996
        this.vy *= 0.996

        // 位置更新
        this.x += this.vx
        this.y += this.vy

        // 发光效果更新
        if (this.type === 'glow' && this.updateCounter % 3 === 0) {
          this.glowIntensity = Math.sin(Date.now() * 0.001) * 0.5 + 0.5
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()

        if (this.type === 'glow' && qualityRef.current !== 'low') {
          ctx.shadowBlur = 15 * this.glowIntensity
          ctx.shadowColor = this.color
        }

        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.baseRadius, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }
    }

    // 根据性能创建粒子
    const getParticleCount = () => {
      switch (qualityRef.current) {
        case 'low': return 40
        case 'medium': return 70
        case 'high': return 100
        default: return 70
      }
    }

    const particles: Particle[] = []
    const particleCount = getParticleCount()

    for (let i = 0; i < particleCount; i++) {
      let type: 'normal' | 'glow' | 'magnetic' = 'normal'
      if (i < particleCount * 0.2) type = 'glow'
      else if (i < particleCount * 0.4) type = 'magnetic'

      particles.push(new Particle(type))
    }

    particlesRef.current = particles

    // 鼠标移动事件 - 节流
    let mouseUpdateTimer: number
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseUpdateTimer) return
      mouseUpdateTimer = window.requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect()
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
        mouseUpdateTimer = 0
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 优化的动画循环
    const animate = (currentTime: number) => {
      monitorPerformance(currentTime)

      // 减少清除频率以提高性能
      if (qualityRef.current === 'low') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 更新和绘制粒子
      particles.forEach((particle, i) => {
        particle.update()
        particle.draw(ctx)

        // 连线效果 - 根据质量调整
        if (qualityRef.current !== 'low') {
          const maxDistance = qualityRef.current === 'high' ? 100 : 80
          particles.slice(i + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < maxDistance) {
              ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - distance / maxDistance)})`
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.stroke()
            }
          })
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate(0)

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

// 性能优化的代码雨
const OptimizedCodeRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

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

    // 简化的字符集
    const charSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}();'

    // 优化的代码列类
    class CodeColumn {
      x: number
      y: number
      speed: number
      chars: string[]
      length: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height - canvas.height
        this.speed = Math.random() * 1.5 + 0.5
        this.length = Math.floor(Math.random() * 15) + 8

        this.chars = []
        for (let i = 0; i < this.length; i++) {
          this.chars.push(charSet[Math.floor(Math.random() * charSet.length)])
        }
      }

      update() {
        this.y += this.speed

        // 随机改变字符 - 降低频率
        if (Math.random() < 0.05) {
          const charIndex = Math.floor(Math.random() * this.chars.length)
          this.chars[charIndex] = charSet[Math.floor(Math.random() * charSet.length)]
        }

        // 重置位置
        if (this.y > canvas.height + this.length * 20) {
          this.y = -this.length * 20
          this.x = Math.random() * canvas.width
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        this.chars.forEach((char, index) => {
          const y = this.y + index * 20

          if (y > 0 && y < canvas.height) {
            const opacity = 1 - (index / this.length)
            const green = Math.floor(255 * opacity)

            ctx.fillStyle = `rgba(0, ${green}, 0, ${opacity})`
            ctx.font = '12px monospace'
            ctx.fillText(char, this.x, y)

            // 首字符发光效果
            if (index === 0) {
              ctx.shadowBlur = 8
              ctx.shadowColor = '#00ff00'
              ctx.fillText(char, this.x, y)
              ctx.shadowBlur = 0
            }
          }
        })
      }
    }

    // 减少代码列数量
    const columns: CodeColumn[] = []
    const columnCount = Math.floor(canvas.width / 40) // 从30改为40，减少密度

    for (let i = 0; i < columnCount; i++) {
      columns.push(new CodeColumn())
    }

    // 降低动画帧率
    let frameSkip = 0
    const animate = () => {
      frameSkip++
      if (frameSkip % 2 !== 0) { // 跳过偶数帧
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      columns.forEach(column => {
        column.update()
        column.draw(ctx)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-10 opacity-20" />
}

// 优化的3D球体组件展示 - 减少复杂度
const OptimizedComponentSphere = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // 降低更新频率
    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x + 0.3,
        y: prev.y + 0.6
      }))
    }, 50) // 从30ms改为50ms

    return () => clearInterval(interval)
  }, [])

  const components = [
    { name: 'Button', icon: <Zap className="w-6 h-6" />, color: 'from-purple-500 to-pink-500' },
    { name: 'Card', icon: <Layers className="w-6 h-6" />, color: 'from-blue-500 to-cyan-500' },
    { name: 'Input', icon: <Code className="w-6 h-6" />, color: 'from-green-500 to-emerald-500' },
    { name: 'Modal', icon: <Box className="w-6 h-6" />, color: 'from-orange-500 to-red-500' },
    { name: 'Form', icon: <Wrench className="w-6 h-6" />, color: 'from-indigo-500 to-purple-500' },
    { name: 'Table', icon: <GitBranch className="w-6 h-6" />, color: 'from-yellow-500 to-orange-500' }
  ]

  const radius = 150 // 减小半径

  return (
    <div className="relative w-[400px] h-[400px] mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
          {components.map((component, index) => {
            const angle = (index / components.length) * Math.PI * 2
            const x = Math.sin(angle + rotation.y * Math.PI / 180) * radius
            const z = Math.cos(angle + rotation.y * Math.PI / 180) * radius
            const y = Math.sin(rotation.x * Math.PI / 180) * 30

            return (
              <motion.div
                key={component.name}
                className="absolute w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 flex flex-col items-center justify-center shadow-lg"
                style={{
                  transform: `translate3d(${x + 200 - 40}px, ${y + 200 - 40}px, ${z}px)`,
                  opacity: (z + radius) / (radius * 2),
                  zIndex: Math.floor((z + radius) / 10)
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }} // 降低刚度
              >
                <div className={`bg-gradient-to-br ${component.color} bg-clip-text text-transparent mb-1`}>
                  {component.icon}
                </div>
                <span className="text-white text-xs font-medium">{component.name}</span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 简化的中心发光效果 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-24 h-24 bg-purple-500 rounded-full blur-2xl opacity-10" />
      </div>
    </div>
  )
}

// 简化的统计卡片
const OptimizedStatsCard = ({ icon, title, value, description, trend }: any) => {
  return (
    <motion.div
      className="relative group"
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }} // 降低刚度
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-10 group-hover:opacity-20 transition-opacity" />
      <Surface className="relative bg-gray-900/90 backdrop-blur-xl border-gray-800 overflow-hidden">
        <div className="relative p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white">
              {icon}
            </div>
            {trend && (
              <div className="flex items-center text-green-400 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                {trend}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">{value}</h3>
            <p className="text-gray-300 font-medium text-sm">{title}</p>
            <p className="text-gray-500 text-xs">{description}</p>
          </div>
        </div>
      </Surface>
    </motion.div>
  )
}

// 优化的导航栏
const OptimizedNavbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // 使用节流
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
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
      transition={{ type: "spring", stiffness: 200, damping: 30 }} // 降低刚度
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Xorigo UI</span>
          </motion.div>

          {/* Desktop Menu - 简化 */}
          <div className="hidden md:flex items-center space-x-6">
            {['组件', '文档', '示例'].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                whileHover={{ y: -1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* GitHub Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              className="bg-purple-600 hover:bg-purple-700 text-white border-purple-400/30 px-5 py-2.5 rounded-full font-medium flex items-center gap-2"
              onClick={() => window.open('https://github.com/SakenW/Xorigo-UI', '_blank')}
            >
              <Github className="w-4 h-4" />
              GitHub
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}

export default function OptimizedUltimateHome() {
  const { scrollY } = useScroll()
  const shouldReduceMotion = useReducedMotion()

  const backgroundY = useTransform(scrollY, [0, 1000], [0, 200])
  const textY = useTransform(scrollY, [0, 1000], [0, -50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  // 简化统计数据
  const stats = [
    {
      icon: <Package className="w-5 h-5" />,
      title: '组件总数',
      value: '25+',
      description: '精心设计的高质量组件',
      trend: '+15%'
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: '设计令牌',
      value: '500+',
      description: '完整的设计系统令牌',
      trend: '+25%'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: '性能评分',
      value: '99+',
      description: 'Lighthouse 性能评分',
      trend: '+5%'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: '类型安全',
      value: '100%',
      description: '完整的 TypeScript 支持',
      trend: '0%'
    }
  ]

  // 简化技术栈
  const techStack = [
    { name: 'React 19', description: '最新的 React 特性', color: 'from-cyan-500 to-blue-500' },
    { name: 'TypeScript 5.9', description: '类型安全保证', color: 'from-blue-500 to-indigo-500' },
    { name: 'Tailwind CSS', description: '原子化 CSS 框架', color: 'from-green-500 to-emerald-500' },
    { name: 'Framer Motion', description: '专业动画库', color: 'from-purple-500 to-pink-500' }
  ]

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 背景层 */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{ y: shouldReduceMotion ? 0 : backgroundY }}
      >
        <OptimizedParticleSystem />
        <OptimizedCodeRain />
      </motion.div>

      {/* 导航栏 */}
      <OptimizedNavbar />

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
                className="space-y-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <motion.h1
                  className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  Xorigo UI
                </motion.h1>

                <motion.p
                  className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
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
                transition={{ delay: 0.6, duration: 0.8 }}
                className="py-10"
              >
                <OptimizedComponentSphere />
              </motion.div>

              {/* 按钮组 */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-3.5 rounded-full text-lg font-semibold shadow-xl shadow-purple-500/30 border border-purple-400/30"
                    onClick={() => window.open('https://github.com/SakenW/Xorigo-UI', '_blank')}
                  >
                    <Github className="w-5 h-5 mr-2" />
                    立即开始
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-purple-400/30 text-purple-300 hover:text-white hover:bg-purple-600/20 px-10 py-3.5 rounded-full text-lg font-semibold"
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
          className="py-16 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ y: 30 }}
              whileInView={{ y: 0 }}
              transition={{ type: "spring" }}
              viewport={{ once: true }}
            >
              强大的功能特性
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  viewport={{ once: true }}
                >
                  <OptimizedStatsCard {...stat} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 技术栈 */}
        <motion.section
          className="py-16 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ y: 30 }}
              whileInView={{ y: 0 }}
              transition={{ type: "spring" }}
              viewport={{ once: true }}
            >
              现代化技术栈
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -3 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    hover: { type: "spring", stiffness: 300 }
                  }}
                  viewport={{ once: true }}
                >
                  <Surface className="p-5 bg-gray-900/90 backdrop-blur-xl border-gray-800 hover:border-purple-500/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${tech.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                        {tech.name.charAt(0)}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{tech.name}</h3>
                    <p className="text-gray-400 text-sm">{tech.description}</p>
                  </Surface>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 页脚 */}
        <footer className="py-10 px-6 border-t border-gray-800">
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