'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
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
  VolumeX,
  Eye,
  Timer,
  Activity,
  Terminal,
  Code,
  Monitor,
  Layers3,
  Sparkles as SparklesIcon,
  Zap as ZapIcon
} from 'lucide-react'

/**
 * 优秀版本演示 - 基于 git commit d40beea8fa59cd9c9c0f5f774d6760ac4dae5886
 * 这个版本视觉效果震撼，性能稳定，用户体验流畅
 */

// 高级粒子系统 - 完整功能
const AdvancedParticleSystem = () => {
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
    connections: number[]
  }>>([])

  const [connections, setConnections] = useState<Array<{
    from: { x: number; y: number }
    to: { x: number; y: number }
    opacity: number
  }>>([])

  useEffect(() => {
    setMounted(true)

    if (typeof window !== 'undefined') {
      const initialParticles = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 1,
        color: ['#8B5CF6', '#06B6D4', '#EC4899', '#F59E0B', '#10B981', '#F97316'][Math.floor(Math.random() * 6)],
        life: 1,
        connections: []
      }))
      setParticles(initialParticles)

      const updateParticles = () => {
        setParticles(prev => {
          const updated = prev.map(particle => {
            let { x, y, vx, vy, life } = particle

            // 更新位置
            x += vx
            y += vy

            // 边界反弹
            if (x < 0 || x > window.innerWidth) vx = -vx * 0.8
            if (y < 0 || y > window.innerHeight) vy = -vy * 0.8

            // 添加随机运动
            vx += (Math.random() - 0.5) * 0.02
            vy += (Math.random() - 0.5) * 0.02

            // 阻尼
            vx *= 0.99
            vy *= 0.99

            // 生命周期
            life -= 0.002
            if (life <= 0) {
              x = Math.random() * window.innerWidth
              y = Math.random() * window.innerHeight
              life = 1
            }

            return { ...particle, x, y, vx, vy, life }
          })

          // 生成连接线
          const newConnections = []
          for (let i = 0; i < updated.length; i++) {
            for (let j = i + 1; j < Math.min(i + 5, updated.length); j++) {
              const dx = updated[i].x - updated[j].x
              const dy = updated[i].y - updated[j].y
              const distance = Math.sqrt(dx * dx + dy * dy)
              if (distance < 150) {
                newConnections.push({
                  from: { x: updated[i].x, y: updated[i].y },
                  to: { x: updated[j].x, y: updated[j].y },
                  opacity: (150 - distance) / 150 * 0.3
                })
              }
            }
          }
          setConnections(newConnections)

          return updated
        })
      }

      const interval = setInterval(updateParticles, 16)
      return () => clearInterval(interval)
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* 连接线 */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((conn, index) => (
          <line
            key={index}
            x1={conn.from.x}
            y1={conn.from.y}
            x2={conn.to.x}
            y2={conn.to.y}
            stroke="#8B5CF6"
            strokeWidth="1"
            opacity={conn.opacity}
          />
        ))}
      </svg>

      {/* 粒子 */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life * 0.8,
            boxShadow: `0 0 ${20 * particle.life}px ${particle.color}`,
            filter: `blur(${(1 - particle.life) * 2}px)`
          }}
        />
      ))}
    </div>
  )
}

// 代码雨效果
const CodeRain = () => {
  const [mounted, setMounted] = useState(false)
  const [drops, setDrops] = useState<Array<{
    id: number
    x: number
    y: number
    speed: number
    text: string
    color: string
  }>>([])

  useEffect(() => {
    setMounted(true)

    const characters = '0123456789ABCDEFghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}();:,.'
    const colors = ['#10B981', '#8B5CF6', '#EC4899', '#F59E0B']

    const createDrop = () => ({
      id: Date.now() + Math.random(),
      x: Math.random() * window.innerWidth,
      y: -20,
      speed: Math.random() * 3 + 2,
      text: characters[Math.floor(Math.random() * characters.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    })

    const interval = setInterval(() => {
      setDrops(prev => {
        let updated = prev
          // 偶尔添加新雨滴
        if (Math.random() < 0.3 && updated.length < 50) {
          updated = [...updated, createDrop()]
        }

        // 更新位置
        updated = updated.map(drop => ({
          ...drop,
          y: drop.y + drop.speed
        })).filter(drop => drop.y < window.innerHeight)

        return updated
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

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
            opacity: 0.7,
            textShadow: `0 0 5px ${drop.color}`
          }}
        >
          {drop.text}
        </div>
      ))}
    </div>
  )
}

// 3D组件轮播 - 完整功能
const Advanced3DCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const components = [
    {
      name: 'Button',
      icon: <Box />,
      color: 'from-purple-500 to-pink-500',
      description: '多种变体和尺寸，支持加载状态和图标',
      features: ['Primary', 'Secondary', 'Outline', 'Ghost', 'Loading']
    },
    {
      name: 'Card',
      icon: <Square />,
      color: 'from-cyan-500 to-blue-500',
      description: '灵活的卡片布局，支持阴影和悬停效果',
      features: ['Basic', 'Elevated', 'Outlined', 'Interactive']
    },
    {
      name: 'Input',
      icon: <Braces />,
      color: 'from-yellow-500 to-orange-500',
      description: '表单输入组件，支持验证和状态管理',
      features: ['Text', 'Password', 'Number', 'Search']
    },
    {
      name: 'Modal',
      icon: <Pentagon />,
      color: 'from-green-500 to-teal-500',
      description: '模态对话框，支持动画和自定义内容',
      features: ['Alert', 'Confirm', 'Fullscreen', 'Nested']
    },
    {
      name: 'Table',
      icon: <Database />,
      color: 'from-indigo-500 to-purple-500',
      description: '数据表格组件，支持排序和筛选功能',
      features: ['Sortable', 'Filterable', 'Responsive', 'Editable']
    },
    {
      name: 'Form',
      icon: <FileCode />,
      color: 'from-pink-500 to-rose-500',
      description: '表单组件，支持验证和提交状态',
      features: ['Controlled', 'Dynamic', 'Multi-step', 'Validation']
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % components.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [components.length])

  return (
    <div className="relative h-96 flex items-center justify-center">
      <div className="relative w-full h-full max-w-6xl">
        {components.map((component, index) => {
          const offset = index - activeIndex
          const absOffset = Math.abs(offset)
          const isActive = offset === 0

          return (
            <motion.div
              key={component.name}
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                x: `${offset * 130}%`,
                z: -absOffset * 250,
                rotateY: offset * -35,
                opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.4,
                scale: 1 - absOffset * 0.25,
                rotateX: absOffset * 10
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <motion.div
                className={`relative w-72 h-80 rounded-3xl bg-gradient-to-br ${component.color} p-[3px] cursor-pointer`}
                whileHover={{
                  scale: 1.1,
                  rotateY: 10,
                  boxShadow: '0 25px 50px rgba(139, 92, 246, 0.3)'
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
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div style={{ transform: 'translateZ(20px)' }}>
                      {React.cloneElement(component.icon as React.ReactElement, {
                        className: 'w-28 h-28 text-white drop-shadow-2xl'
                      })}
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-2 text-center">
                    {component.name}
                  </h3>
                  <p className="text-gray-400 text-center text-sm mb-4">
                    {component.description}
                  </p>

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

// 高级代码编辑器
const AdvancedCodeEditor = () => {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code')

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
        ) : (
          <div className="p-6">
            {preview}
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

// 高级统计数字动画
const AdvancedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
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
    <span ref={ref} className="inline-block">
      <motion.span
        className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {count.toLocaleString()}{suffix}
      </motion.span>
    </span>
  )
}

// 高级导航栏
const AdvancedNavbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
          ? 'bg-black/95 backdrop-blur-2xl border-b border-purple-500/20 shadow-2xl'
          : 'bg-transparent'
      }`}
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
              <span className="ml-2 text-sm text-gray-400">Enhanced</span>
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
    </nav>
  )
}

// 主组件
export default function ExcellentVersionDemo() {
  const { scrollYProgress } = useScroll()
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5], [1, 0.7])

  const stats = [
    { label: '组件', value: 60, suffix: '+', icon: <Box />, description: '精心设计的UI组件' },
    { label: '主题', value: 25, suffix: '+', icon: <Palette />, description: '多套配色方案' },
    { label: '动画', value: 50, suffix: '+', icon: <SparklesIcon />, description: '流畅的过渡效果' },
    { label: 'TypeScript', value: 100, suffix: '%', icon: <Code2 />, description: '完整的类型支持' },
    { label: '响应式', value: 100, suffix: '%', icon: <Monitor />, description: '完美适配' },
    { label: '可访问性', value: 'WCAG', icon: <Eye />, description: '无障碍设计' }
  ]

  const [soundEnabled, setSoundEnabled] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 背景效果层 */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-cyan-900/30" />
      </div>

      {/* 代码雨效果 */}
      <CodeRain />

      {/* 高级粒子系统 */}
      <AdvancedParticleSystem />

      {/* 导航栏 */}
      <AdvancedNavbar />

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
                  scale: [1, 1.05, 1],
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
              下一代 React 组件库 - 优秀版本演示
            </motion.p>

            <motion.p
              className="text-xl text-gray-500 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              由 Saken 与 AI 协作打造，为现代 Web 应用提供极致的开发体验
              <br />
              <span className="text-purple-400">高级粒子系统 • 代码雨效果 • 3D组件轮播 • 完整动画系统</span>
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

            {/* 版本信息 */}
            <motion.div
              className="inline-flex items-center gap-4 px-6 py-3 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">优秀版本</span>
              </div>
              <div className="text-gray-400 text-sm">
                基于 d40beea8fa59cd9c9c0f5f774d6760ac4dae5886
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

          <AdvancedCodeEditor />
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
              3D透视效果 • 交互式展示 • 动态切换
            </p>
          </motion.div>

          <Advanced3DCarousel />
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
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  {React.cloneElement(stat.icon as React.ReactElement, {
                    className: 'w-8 h-8 text-white'
                  })}
                </div>
                <AdvancedCounter value={stat.value} suffix={stat.suffix} />
                <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
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
              优秀版本演示 • 稳定流畅 • 视觉震撼
            </span>
          </motion.p>
        </div>
      </footer>
    </div>
  )
}