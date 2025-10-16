'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring } from 'framer-motion'
import { Button, Card, AnimatedCard, Typography, Surface } from '@xorigo-ui/core'
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
  VolumeX,
  Eye,
  Timer,
  Activity,
  Terminal,
  Code,
  Monitor,
  Layers3,
  Sparkles as SparklesIcon,
  Zap as ZapIcon,
  Settings,
  TrendingUp,
  Users,
  Target,
  ArrowLeft,
  ArrowDown,
  ArrowUp
} from 'lucide-react'

/**
 * 终极增强版 - 在优秀版本基础上进一步优化
 * 新增特性：
 * - 鼠标交互粒子系统
 * - 增强性能控制面板
 * - 流体动画背景
 * - 3D视差效果
 * - 更丰富的动画细节
 */

// 性能配置
const PERFORMANCE_CONFIG = {
  high: {
    particleCount: 100,
    codeLines: 30,
    connectionDistance: 150,
    enableGlow: true,
    enableFluid: true,
    enable3D: true
  },
  medium: {
    particleCount: 60,
    codeLines: 20,
    connectionDistance: 100,
    enableGlow: true,
    enableFluid: false,
    enable3D: true
  },
  low: {
    particleCount: 30,
    codeLines: 10,
    connectionDistance: 80,
    enableGlow: false,
    enableFluid: false,
    enable3D: false
  }
}

// 增强性能监控系统
const useEnhancedPerformanceMonitor = () => {
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high')
  const [fps, setFps] = useState(60)
  const [frameTime, setFrameTime] = useState(0)
  const frameCount = useRef(0)
  const lastTime = useRef(Date.now())
  const frameTimeHistory = useRef<number[]>([])

  useEffect(() => {
    let animationId: number

    const measurePerformance = () => {
      const now = performance.now()
      frameCount.current++

      const deltaTime = now - lastTime.current
      frameTimeHistory.current.push(deltaTime)

      // 保留最近60帧的历史
      if (frameTimeHistory.current.length > 60) {
        frameTimeHistory.current.shift()
      }

      if (deltaTime >= 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / deltaTime)
        setFps(currentFps)

        // 计算平均帧时间
        const avgFrameTime = frameTimeHistory.current.reduce((a, b) => a + b, 0) / frameTimeHistory.current.length
        setFrameTime(Math.round(avgFrameTime * 100) / 100)

        // 智能性能调整
        if (currentFps < 30 && performanceLevel !== 'low') {
          setPerformanceLevel('low')
        } else if (currentFps < 45 && performanceLevel === 'high') {
          setPerformanceLevel('medium')
        } else if (currentFps > 55 && performanceLevel !== 'high') {
          setPerformanceLevel('high')
        }

        frameCount.current = 0
        lastTime.current = now
      }

      animationId = requestAnimationFrame(measurePerformance)
    }

    animationId = requestAnimationFrame(measurePerformance)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [performanceLevel])

  const setManualPerformanceLevel = (level: 'high' | 'medium' | 'low') => {
    setPerformanceLevel(level)
    console.log(`性能等级切换到: ${level}`)
  }

  return {
    performanceLevel,
    fps,
    frameTime,
    setPerformanceLevel: setManualPerformanceLevel,
    config: PERFORMANCE_CONFIG[performanceLevel]
  }
}

// 鼠标交互粒子系统
const InteractiveParticleSystem = ({ config, mouseX, mouseY }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)
  const particlesRef = useRef<any[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    mouseRef.current = { x: mouseX, y: mouseY }
  }, [mouseX, mouseY])

  useEffect(() => {
    if (!mounted || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // 初始化粒子
    particlesRef.current = Array.from({ length: config.particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      color: ['#8B5CF6', '#06B6D4', '#EC4899', '#F59E0B', '#10B981', '#F97316'][Math.floor(Math.random() * 6)],
      life: 1,
      originalVx: 0,
      originalVy: 0
    }))

    particlesRef.current.forEach(particle => {
      particle.originalVx = particle.vx
      particle.originalVy = particle.vy
    })

    let animationId: number

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 更新和绘制粒子
      particlesRef.current.forEach(particle => {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // 鼠标交互力场
        if (distance < 200 && config.enableGlow) {
          const force = (200 - distance) / 200 * 0.02
          const angle = Math.atan2(dy, dx)
          particle.vx += Math.cos(angle) * force
          particle.vy += Math.sin(angle) * force
        }

        // 恢复原始速度
        particle.vx += (particle.originalVx - particle.vx) * 0.05
        particle.vy += (particle.originalVy - particle.vy) * 0.05

        // 更新位置
        particle.x += particle.vx
        particle.y += particle.vy

        // 边界反弹
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // 绘制粒子
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = 0.8

        if (config.enableGlow) {
          ctx.shadowColor = particle.color
          ctx.shadowBlur = 10
        } else {
          ctx.shadowBlur = 0
        }

        ctx.fill()
      })

      // 绘制连接线
      if (config.connectionDistance > 0) {
        ctx.strokeStyle = '#8B5CF6'
        ctx.lineWidth = 0.5

        for (let i = 0; i < particlesRef.current.length; i++) {
          for (let j = i + 1; j < Math.min(i + 5, particlesRef.current.length); j++) {
            const p1 = particlesRef.current[i]
            const p2 = particlesRef.current[j]
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < config.connectionDistance) {
              ctx.globalAlpha = (config.connectionDistance - distance) / config.connectionDistance * 0.3
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
            }
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [mounted, config])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: config.enableGlow ? 1 : 0.7 }}
    />
  )
}

// 流体动画背景
const FluidBackground = ({ enabled }: { enabled: boolean }) => {
  if (!enabled) return null

  return (
    <div className="fixed inset-0 pointer-events-none opacity-30">
      <svg className="w-full h-full">
        <defs>
          <filter id="fluid" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              baseFrequency="0.01 0.02"
              numOctaves="2"
              result="turbulence"
              seed="1"
            >
              <animate
                attributeName="baseFrequency"
                dur="30s"
                values="0.01 0.02;0.02 0.01;0.01 0.02"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <motion.rect
          width="100%"
          height="100%"
          filter="url(#fluid)"
          className="fill-purple-500/20"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 1, -1, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  )
}

// 增强代码雨效果
const EnhancedCodeRain = ({ config }: any) => {
  const [mounted, setMounted] = useState(false)
  const [drops, setDrops] = useState<Array<{
    id: number
    x: number
    y: number
    speed: number
    text: string
    color: string
    opacity: number
  }>>([])

  useEffect(() => {
    setMounted(true)

    const characters = '0123456789ABCDEFghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}();:,.'
    const colors = ['#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#06B6D4']

    const createDrop = () => ({
      id: Date.now() + Math.random(),
      x: Math.random() * window.innerWidth,
      y: -20,
      speed: Math.random() * 4 + 2,
      text: Array.from({ length: Math.floor(Math.random() * 10) + 5 }, () =>
        characters[Math.floor(Math.random() * characters.length)]
      ).join(''),
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.3
    })

    const interval = setInterval(() => {
      setDrops(prev => {
        let updated = prev

        if (Math.random() < 0.4 && updated.length < config.codeLines * 2) {
          updated = [...updated, createDrop()]
        }

        updated = updated.map(drop => ({
          ...drop,
          y: drop.y + drop.speed,
          opacity: drop.opacity * 0.995
        })).filter(drop => drop.y < window.innerHeight && drop.opacity > 0.1)

        return updated
      })
    }, 50)

    return () => clearInterval(interval)
  }, [config.codeLines])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {drops.map(drop => (
        <div
          key={drop.id}
          className="text-xs font-mono"
          style={{
            position: 'absolute',
            left: drop.x,
            top: drop.y,
            color: drop.color,
            opacity: drop.opacity,
            textShadow: config.enableGlow ? `0 0 8px ${drop.color}` : 'none',
            transform: `rotate(${Math.sin(drop.y * 0.01) * 2}deg)`
          }}
        >
          {drop.text}
        </div>
      ))}
    </div>
  )
}

// 3D组件轮播 - 增强版
const Enhanced3DCarousel = ({ enable3D }: { enable3D: boolean }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const components = [
    {
      name: 'Button',
      icon: <Box />,
      color: 'from-purple-500 to-pink-500',
      description: '多种变体和尺寸，支持加载状态和图标',
      features: ['Primary', 'Secondary', 'Outline', 'Ghost', 'Loading'],
      stats: '10+ variants'
    },
    {
      name: 'Card',
      icon: <Square />,
      color: 'from-cyan-500 to-blue-500',
      description: '灵活的卡片布局，支持阴影和悬停效果',
      features: ['Basic', 'Elevated', 'Outlined', 'Interactive'],
      stats: '8 layouts'
    },
    {
      name: 'Input',
      icon: <Braces />,
      color: 'from-yellow-500 to-orange-500',
      description: '表单输入组件，支持验证和状态管理',
      features: ['Text', 'Password', 'Number', 'Search'],
      stats: '15 types'
    },
    {
      name: 'Modal',
      icon: <Pentagon />,
      color: 'from-green-500 to-teal-500',
      description: '模态对话框，支持动画和自定义内容',
      features: ['Alert', 'Confirm', 'Fullscreen', 'Nested'],
      stats: '6 patterns'
    },
    {
      name: 'Table',
      icon: <Database />,
      color: 'from-indigo-500 to-purple-500',
      description: '数据表格组件，支持排序和筛选功能',
      features: ['Sortable', 'Filterable', 'Responsive', 'Editable'],
      stats: '4 modes'
    },
    {
      name: 'Form',
      icon: <FileCode />,
      color: 'from-pink-500 to-rose-500',
      description: '表单组件，支持验证和提交状态',
      features: ['Controlled', 'Dynamic', 'Multi-step', 'Validation'],
      stats: '20+ fields'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % components.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [components.length])

  const carouselStyle = enable3D ? {
    transformStyle: 'preserve-3d' as const,
    perspective: '1000px'
  } : {}

  return (
    <div className="relative h-96 flex items-center justify-center">
      <div className="relative w-full h-full max-w-6xl" style={carouselStyle}>
        {components.map((component, index) => {
          const offset = index - activeIndex
          const absOffset = Math.abs(offset)
          const isActive = offset === 0

          const animateProps = enable3D ? {
            x: `${offset * 130}%`,
            z: -absOffset * 250,
            rotateY: offset * -35,
            opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.4,
            scale: 1 - absOffset * 0.25,
            rotateX: absOffset * 10
          } : {
            x: `${offset * 100}%`,
            opacity: Math.abs(offset) > 1 ? 0 : 1 - Math.abs(offset) * 0.5,
            scale: 1 - Math.abs(offset) * 0.2,
            zIndex: isActive ? 10 : 5 - Math.abs(offset)
          }

          return (
            <motion.div
              key={component.name}
              className="absolute inset-0 flex items-center justify-center"
              animate={animateProps}
              transition={{ duration: enable3D ? 1 : 0.5, ease: "easeInOut" }}
            >
              <motion.div
                className={`relative w-72 h-80 rounded-3xl bg-gradient-to-br ${component.color} p-[3px] cursor-pointer`}
                whileHover={{
                  scale: enable3D ? 1.1 : 1.05,
                  ...(enable3D ? { rotateY: 10, boxShadow: '0 25px 50px rgba(139, 92, 246, 0.3)' } : {})
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveIndex(index)}
              >
                <div className="relative w-full h-full bg-black/95 rounded-3xl p-8 flex flex-col items-center justify-center backdrop-blur-sm">
                  {/* 3D图标 */}
                  <motion.div
                    className="text-7xl mb-4"
                    animate={{
                      rotateY: isActive ? [0, 360] : 0,
                      scale: isActive ? [1, 1.2, 1] : 1
                    }}
                    transition={{
                      duration: 3,
                      repeat: isActive ? Infinity : 0,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                    style={enable3D ? { transform: 'translateZ(20px)' } : {}}
                  >
                    {React.cloneElement(component.icon as React.ReactElement, {
                      className: 'w-28 h-28 text-white drop-shadow-2xl'
                    })}
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-2 text-center">
                    {component.name}
                  </h3>
                  <p className="text-gray-400 text-center text-sm mb-4">
                    {component.description}
                  </p>

                  {/* 统计数据 */}
                  <div className="text-xs text-purple-400 font-bold mb-3">
                    {component.stats}
                  </div>

                  {/* 特性标签 */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {component.features.slice(0, 3).map((feature, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/10 text-white text-xs rounded-full backdrop-blur-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-3xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                      style={{
                        background: `radial-gradient(circle at center, ${
                          component.color.includes('purple') ? 'rgba(139, 92, 246, 0.4)' :
                          component.color.includes('cyan') ? 'rgba(6, 182, 212, 0.4)' :
                          component.color.includes('yellow') ? 'rgba(245, 158, 11, 0.4)' :
                          component.color.includes('green') ? 'rgba(16, 185, 129, 0.4)' :
                          component.color.includes('indigo') ? 'rgba(99, 102, 241, 0.4)' :
                          'rgba(236, 72, 153, 0.4)'
                        } 0%, transparent 80%)`
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
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'w-12 bg-gradient-to-r from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/50'
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

// 增强代码编辑器
const EnhancedCodeEditor = () => {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'docs'>('code')

  const code = `import { Button, Card, AnimatedCard, Badge } from '@xorigo-ui/core'
import { useState } from 'react'

export default function ComponentShowcase() {
  const [isLoading, setIsLoading] = useState(false)
  const [count, setCount] = useState(0)

  const handleClick = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setCount(prev => prev + 1)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <Card className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">
            Xorigo UI 展示
          </h1>
          <Badge variant="primary">NEW</Badge>
        </div>

        <AnimatedCard className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              交互式按钮演示
            </h2>
            <div className="flex gap-4 items-center">
              <Button
                variant="primary"
                onClick={handleClick}
                loading={isLoading}
              >
                点击次数: {count}
              </Button>
              <Button variant="secondary">
                次要按钮
              </Button>
              <Button variant="outline">
                轮廓按钮
              </Button>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            实时更新演示
          </h2>
          <div className="text-gray-300">
            这是一个实时更新的示例，展示 Xorigo UI 的强大功能。
          </div>
        </AnimatedCard>
      </Card>
    </div>
  )
}`

  const preview = (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-md rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">
            Xorigo UI 展示
          </h1>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
            NEW
          </span>
        </div>

        <div className="p-6 bg-black/50 rounded-xl mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">
            交互式按钮演示
          </h2>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
              点击次数: 0
            </button>
            <button className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors">
              次要按钮
            </button>
          </div>
        </div>

        <div className="p-6 bg-black/50 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-white">
            实时更新演示
          </h2>
          <div className="text-gray-300">
            这是一个实时更新的示例，展示 Xorigo UI 的强大功能。
          </div>
        </div>
      </div>
    </div>
  )

  const docs = (
    <div className="p-6">
      <div className="space-y-4">
        <div className="bg-black/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">🚀 快速开始</h3>
          <p className="text-gray-300 text-sm">使用 npm 或 yarn 安装 Xorigo UI</p>
          <code className="block mt-2 p-2 bg-gray-900 rounded text-xs text-green-400">
            npm install @xorigo-ui/core
          </code>
        </div>

        <div className="bg-black/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">📚 文档</h3>
          <p className="text-gray-300 text-sm">查看完整的组件文档和示例</p>
          <a href="#" className="text-purple-400 text-sm hover:underline">访问文档 →</a>
        </div>

        <div className="bg-black/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">🎨 主题定制</h3>
          <p className="text-gray-300 text-sm">支持深色/浅色主题和自定义配色</p>
          <div className="flex gap-2 mt-2">
            <div className="w-6 h-6 bg-gray-900 rounded"></div>
            <div className="w-6 h-6 bg-gray-100 rounded"></div>
            <div className="w-6 h-6 bg-purple-500 rounded"></div>
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )

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
      className="relative bg-gray-900/90 rounded-3xl overflow-hidden border border-purple-500/30 max-w-6xl mx-auto shadow-2xl"
    >
      {/* 编辑器头部 */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/50 border-b border-purple-500/20">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <span className="text-gray-400 text-sm">ComponentShowcase.tsx</span>
          <span className="text-xs text-gray-500 ml-2 px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
            React 19 + TypeScript
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            <button
              className={`px-3 py-1 text-xs rounded transition-colors ${
                activeTab === 'code'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('code')}
            >
              代码
            </button>
            <button
              className={`px-3 py-1 text-xs rounded transition-colors ${
                activeTab === 'preview'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('preview')}
            >
              预览
            </button>
            <button
              className={`px-3 py-1 text-xs rounded transition-colors ${
                activeTab === 'docs'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('docs')}
            >
              文档
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="min-h-[400px]">
        {activeTab === 'code' ? (
          <pre className="p-6 text-sm overflow-x-auto">
            <code className="text-gray-300 font-mono leading-relaxed">{code}</code>
          </pre>
        ) : activeTab === 'preview' ? (
          <div className="p-6">
            {preview}
          </div>
        ) : (
          <div className="p-6">
            {docs}
          </div>
        )}
      </div>

      {/* 底部工具栏 */}
      <div className="px-6 py-4 bg-black/50 border-t border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Terminal className="w-4 h-4" />
          <span>实时预览</span>
          <Monitor className="w-4 h-4" />
          <span>组件展示</span>
          <Code className="w-4 h-4" />
          <span>代码高亮</span>
        </div>
        <motion.button
          className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg flex items-center gap-2 hover:bg-purple-500/30 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-4 h-4" />
          运行代码
        </motion.button>
      </div>
    </motion.div>
  )
}

// 增强统计数字动画
const EnhancedCounter = ({ value, suffix = '', label, icon }: any) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2500
      const startTime = Date.now()
      const endTime = startTime + duration

      const updateCount = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)
        // 使用贝塞尔缓动函数
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        const currentCount = Math.floor(easeProgress * value)
        setCount(currentCount)

        if (now < endTime) {
          requestAnimationFrame(updateCount)
        } else {
          setCount(value)
        }
      }

      updateCount()
    }
  }, [isInView, value])

  return (
    <div ref={ref} className="text-center">
      <motion.div
        className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center"
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        {React.cloneElement(icon as React.ReactElement, {
          className: 'w-8 h-8 text-white'
        })}
      </motion.div>
      <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {count.toLocaleString()}{suffix}
        </motion.span>
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  )
}

// 增强导航栏
const EnhancedNavbar = ({ mouseX, mouseY }: any) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const mouseDistance = useSpring(Math.sqrt(mouseX * mouseX + mouseY * mouseY), { stiffness: 100, damping: 20 })
  const navbarY = useTransform(mouseDistance, val => Math.max(0, 10 - val * 0.01))

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
          ? 'bg-black/95 backdrop-blur-2xl border-b border-purple-500/20 shadow-2xl'
          : 'bg-transparent'
      }`}
      style={{
        translateY: navbarY
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo增强 - 高级动画 */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative w-12 h-12">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/50 to-cyan-500/50 rounded-xl blur-lg"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div
                className="absolute inset-2 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear"
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
              <span className="ml-2 text-sm text-gray-400">Ultimate</span>
            </div>
          </motion.div>

          {/* Desktop Menu增强 */}
          <div className="hidden md:flex items-center gap-8">
            {['组件', '文档', '主题', '示例', 'GitHub'].map((item, i) => (
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
              className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white px-8 py-3 rounded-full font-bold shadow-xl hover:shadow-purple-500/30 transition-all group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center">
                <Rocket className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                开始使用
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500"
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
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
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

// 增强性能控制面板
const EnhancedPerformancePanel = ({
  performanceLevel,
  fps,
  frameTime,
  setPerformanceLevel
}: any) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const performanceData = [
    { label: 'FPS', value: fps, max: 60, good: 50, unit: '' },
    { label: '帧时间', value: frameTime, max: 30, good: 16, unit: 'ms', reverse: true }
  ]

  const getColor = (value: number, max: number, good: number, reverse = false) => {
    const percentage = value / max
    const threshold = good / max

    if (reverse) {
      return percentage <= threshold ? 'bg-green-500' : percentage <= threshold * 1.5 ? 'bg-yellow-500' : 'bg-red-500'
    } else {
      return percentage >= threshold ? 'bg-green-500' : percentage >= threshold * 0.7 ? 'bg-yellow-500' : 'bg-red-500'
    }
  }

  return (
    <motion.div
      className={`fixed top-20 right-4 bg-black/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl z-50 ${
        isExpanded ? 'w-80' : 'w-64'
      }`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            性能控制中心
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          </button>
        </div>

        {/* 性能指标 */}
        <div className="space-y-3 mb-4">
          {performanceData.map((metric, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-400 text-xs">{metric.label}</span>
                <span className="text-white text-xs font-bold">
                  {metric.value}{metric.unit}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full transition-colors ${getColor(metric.value, metric.max, metric.good, metric.reverse)}`}
                  style={{ width: `${(metric.value / metric.max) * 100}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 性能等级选择 */}
        <div className="space-y-2">
          {[
            { value: 'high', label: '🚀 极致效果', color: 'from-red-500 to-orange-500', desc: '完整视觉效果' },
            { value: 'medium', label: '⚡ 平衡模式', color: 'from-yellow-500 to-green-500', desc: '性能与效果平衡' },
            { value: 'low', label: '🛡️ 极速模式', color: 'from-green-500 to-cyan-500', desc: '最高性能' }
          ].map(({ value, label, color, desc }) => (
            <motion.button
              key={value}
              onClick={() => setPerformanceLevel(value)}
              className={`w-full px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                performanceLevel === value
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{label}</span>
                {performanceLevel === value && <Check className="w-4 h-4" />}
              </div>
              <div className={`text-xs ${performanceLevel === value ? 'text-white/80' : 'text-gray-500'}`}>
                {desc}
              </div>
            </motion.button>
          ))}
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            <div className="text-xs text-gray-500 space-y-1">
              <p>💡 提示：根据设备性能自动调整</p>
              <p>🎯 目标：保持60FPS流畅体验</p>
              <p>⚡ 优化：粒子数量 × 渲染质量</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// 主组件
export default function UltimateUltimateEnhancedHome() {
  const { scrollYProgress } = useScroll()
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)

  const { performanceLevel, fps, frameTime, setPerformanceLevel, config } = useEnhancedPerformanceMonitor()

  // 鼠标位置追踪
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX)
      setMouseY(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const stats = [
    { label: '组件', value: 60, suffix: '+', icon: <Box />, description: '精心设计的UI组件' },
    { label: '主题', value: 25, suffix: '+', icon: <Palette />, description: '多套配色方案' },
    { label: '动画', value: 50, suffix: '+', icon: <SparklesIcon />, description: '流畅的过渡效果' },
    { label: 'TypeScript', value: 100, suffix: '%', icon: <Code2 />, description: '完整的类型支持' },
    { label: '响应式', value: 100, suffix: '%', icon: <Monitor />, description: '完美适配' },
    { label: '可访问性', value: 'WCAG', icon: <Eye />, description: '无障碍设计' }
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 背景效果层 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-cyan-900/20" />
      </div>

      {/* 流体背景 */}
      <FluidBackground enabled={config.enableFluid} />

      {/* 增强代码雨效果 */}
      <EnhancedCodeRain config={config} />

      {/* 交互粒子系统 */}
      <InteractiveParticleSystem config={config} mouseX={mouseX} mouseY={mouseY} />

      {/* 增强性能控制面板 */}
      <EnhancedPerformancePanel
        performanceLevel={performanceLevel}
        fps={fps}
        frameTime={frameTime}
        setPerformanceLevel={setPerformanceLevel}
      />

      {/* 增强导航栏 */}
      <EnhancedNavbar mouseX={mouseX} mouseY={mouseY} />

      {/* Hero Section增强版 */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div
          className="max-w-7xl mx-auto w-full"
          style={{ scale: scaleProgress, opacity: opacityProgress }}
        >
          <div className="text-center">
            {/* 声音控制 */}
            <motion.button
              className="fixed bottom-8 right-8 z-50 bg-purple-500/20 backdrop-blur-sm border border-purple-500/50 text-purple-400 p-4 rounded-full"
              onClick={() => setSoundEnabled(!soundEnabled)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </motion.button>

            {/* 标题超级动画 */}
            <motion.h1
              className="text-8xl md:text-9xl lg:text-10xl font-bold mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              <motion.span
                className="inline-block"
                animate={{
                  scale: [1, 1.02, 1],
                  textShadow: [
                    '0 0 20px rgba(139, 92, 246, 0.5)',
                    '0 0 40px rgba(236, 72, 153, 0.3)',
                    '0 0 60px rgba(6, 182, 212, 0.2)'
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Xorigo UI
                </span>
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-3xl text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              下一代 React 组件库 - 终极增强版
            </motion.p>

            <motion.p
              className="text-xl text-gray-500 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              由 Saken 与 AI 协作打造，为现代 Web 应用提供极致的开发体验
              <br />
              <span className="text-purple-400">智能性能监控 • 鼠标交互 • 流体动画 • 3D效果</span>
            </motion.p>

            {/* CTA按钮组 */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                className="group relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white px-12 py-5 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-purple-500/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  开始使用
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500"
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

            {/* 性能指示器 */}
            <motion.div
              className="flex items-center justify-center gap-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className={`px-3 py-1 rounded-full ${
                performanceLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                performanceLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {performanceLevel === 'high' ? '🚀 极致效果' :
                 performanceLevel === 'medium' ? '⚡ 平衡模式' : '🛡️ 极速模式'}
              </div>
              <div className="text-gray-400">
                {fps} FPS • {frameTime}ms
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 代码编辑器展示 */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                代码示例
              </span>
            </h2>
            <p className="text-lg text-gray-400">
              实时预览 • 语法高亮 • 多标签支持
            </p>
          </motion.div>

          <EnhancedCodeEditor />
        </div>
      </section>

      {/* 3D组件展示 */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                组件展示
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              {config.enable3D ? '3D透视效果 • 交互式展示' : '优雅的2D展示 • 流畅动画'}
            </p>
          </motion.div>

          <Enhanced3DCarousel enable3D={config.enable3D} />
        </div>
      </section>

      {/* 统计数据 */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <EnhancedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  icon={stat.icon}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-purple-500/20 relative z-10">
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
              终极增强版 • 智能性能优化 • 沉浸式体验
            </span>
          </motion.p>
        </div>
      </footer>

      {/* 性能信息显示 */}
      <div className="fixed bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-400 z-50 border border-purple-500/20">
        <div className="flex items-center gap-2">
          <span>{performanceLevel.toUpperCase()}</span>
          <span>•</span>
          <span>{fps} FPS</span>
          <span>•</span>
          <span>{config.particleCount} 粒子</span>
        </div>
      </div>
    </div>
  )
}