'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence, useAnimation, useReducedMotion, useMotionValue } from 'framer-motion'
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
  Eye,
  Triangle,
  Hexagon,
  Circle,
  Square,
  Diamond,
  Crown,
  Flame
} from 'lucide-react'

// 性能监控钩子 - 增强版
const usePerformanceMonitor = () => {
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high')
  const [fps, setFps] = useState(60)
  const [isAuto, setIsAuto] = useState(true)
  const fpsRef = useRef(60)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(0)
  const animationRef = useRef<number>()

  // 手动切换质量
  const setQualityManual = useCallback((newQuality: 'high' | 'medium' | 'low') => {
    setIsAuto(false)
    setQuality(newQuality)
  }, [])

  // 恢复自动模式
  const setAutoMode = useCallback(() => {
    setIsAuto(true)
  }, [])

  useEffect(() => {
    const monitorPerformance = (currentTime: number) => {
      frameCountRef.current++
      if (currentTime - lastTimeRef.current >= 1000) {
        const currentFps = frameCountRef.current
        fpsRef.current = currentFps
        setFps(currentFps)
        frameCountRef.current = 0
        lastTimeRef.current = currentTime

        // 只在自动模式下调整质量
        if (isAuto) {
          if (currentFps < 30) {
            setQuality('low')
          } else if (currentFps < 50) {
            setQuality('medium')
          } else {
            setQuality('high')
          }
        }
      }
      animationRef.current = requestAnimationFrame(monitorPerformance)
    }

    animationRef.current = requestAnimationFrame(monitorPerformance)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAuto])

  return { quality, fps, isAuto, setQualityManual, setAutoMode }
}

// 混合粒子系统 - CSS + Canvas结合
const HybridParticleSystem = () => {
  const { quality, fps, isAuto, setQualityManual, setAutoMode } = usePerformanceMonitor()
  const [particles, setParticles] = useState<Array<any>>([])
  const mousePosition = useMotionValue({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const particleCount = quality === 'high' ? 60 : quality === 'medium' ? 40 : 25
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      color: ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)],
      type: Math.random() > 0.7 ? 'pulse' : Math.random() > 0.5 ? 'float' : 'orbit'
    }))
    setParticles(newParticles)
  }, [quality])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        mousePosition.set({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mousePosition])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-black" />

      {/* CSS粒子 */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          animate={
            particle.type === 'pulse'
              ? {
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                }
              : particle.type === 'float'
              ? {
                  y: [0, -30, 0],
                  x: [0, 10, 0],
                }
              : {
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1],
                }
          }
          transition={{
            duration: particle.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}

      {/* 鼠标跟随光效 */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          x: useMotionValue(0),
          y: useMotionValue(0),
        }}
        onUpdate={(latest) => {
          const mouse = mousePosition.get()
          latest.x = mouse.x - 50
          latest.y = mouse.y - 50
        }}
      />
    </div>
  )
}

// 优化的代码雨 - 使用CSS动画
const OptimizedCodeRain = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const columns = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${i * 5}%`,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
    chars: Array.from({ length: 15 }, () =>
      '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}()[].,;:?/~`'.charAt(Math.floor(Math.random() * 30))
    ).join('')
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {columns.map((column) => (
        <motion.div
          key={column.id}
          className="absolute text-green-400 font-mono text-xs"
          style={{
            left: column.left,
            top: '-100px',
            textShadow: '0 0 8px #00ff00',
          }}
          animate={{
            y: ['0vh', '120vh'],
          }}
          transition={{
            duration: column.duration,
            repeat: Infinity,
            delay: column.delay,
            ease: 'linear',
          }}
        >
          <pre style={{ margin: 0, whiteSpace: 'pre' }}>{column.chars}</pre>
        </motion.div>
      ))}
    </div>
  )
}

// 3D组件展示 - 优化版
const ComponentShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const autoPlayRef = useRef<NodeJS.Timeout>()

  const components = [
    {
      name: 'Button',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      description: '多种样式和变体',
      features: ['渐变背景', '悬停效果', '加载状态']
    },
    {
      name: 'Card',
      icon: <Layers className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      description: '灵活的卡片组件',
      features: ['阴影效果', '圆角变体', '内容布局']
    },
    {
      name: 'Input',
      icon: <Code className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      description: '强大的输入控件',
      features: ['验证支持', '状态反馈', '图标集成']
    },
    {
      name: 'Modal',
      icon: <Box className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      description: '优雅的弹窗组件',
      features: ['动画过渡', '键盘导航', '尺寸控制']
    },
    {
      name: 'Form',
      icon: <Wrench className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500',
      description: '完整的表单系统',
      features: ['字段验证', '提交处理', '错误提示']
    },
    {
      name: 'Table',
      icon: <GitBranch className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500',
      description: '数据表格组件',
      features: ['排序功能', '分页支持', '自定义列']
    }
  ]

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % components.length)
    }, 4000)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [components.length])

  return (
    <div className="relative h-[500px] flex items-center justify-center py-20">
      {/* 3D透视容器 */}
      <div className="relative w-full max-w-6xl mx-auto" style={{ perspective: '1200px' }}>
        <div className="relative h-[400px] flex items-center justify-center">
          {components.map((component, index) => {
            const isActive = index === activeIndex
            const offset = index - activeIndex
            const angle = offset * 60

            return (
              <motion.div
                key={component.name}
                className="absolute"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(300px)`,
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  transform: `rotateY(${angle}deg) translateZ(${isActive ? 350 : 300}px)`,
                }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                onClick={() => setActiveIndex(index)}
              >
                <motion.div
                  className={`relative w-72 h-80 bg-gradient-to-br ${component.color} p-[2px] rounded-2xl cursor-pointer`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative w-full h-full bg-gray-900/95 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                    {/* 图标容器 */}
                    <motion.div
                      className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6"
                      animate={{
                        rotateY: isActive ? 360 : 0,
                      }}
                      transition={{ duration: 2, ease: 'linear' }}
                    >
                      <div className={`text-white`}>
                        {component.icon}
                      </div>
                    </motion.div>

                    {/* 组件信息 */}
                    <h3 className="text-2xl font-bold text-white mb-3">{component.name}</h3>
                    <p className="text-gray-300 mb-6 text-sm">{component.description}</p>

                    {/* 特性列表 */}
                    <div className="space-y-2">
                      {component.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* 发光效果 */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: `linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.1), transparent)`,
                        }}
                        animate={{
                          background: [
                            'linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
                            'linear-gradient(45deg, transparent, rgba(236, 72, 153, 0.1), transparent)',
                            'linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
                          ],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* 控制指示器 */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3">
          {components.map((_, index) => (
            <button
              key={index}
              className={`transition-all duration-300 ${
                index === activeIndex
                  ? 'w-12 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full'
                  : 'w-3 h-3 bg-gray-600 rounded-full hover:bg-gray-500'
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// 增强的统计卡片
const EnhancedStatsCard = ({ icon, title, value, description, trend, color }: any) => {
  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* 背景光效 */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}
      />

      <Surface className="relative bg-gray-900/90 backdrop-blur-xl border-gray-800/50 group-hover:border-purple-500/30 transition-all duration-300 overflow-hidden">
        {/* 顶部渐变条 */}
        <div className={`h-1 bg-gradient-to-r ${color}`} />

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white`}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </motion.div>
            {trend && (
              <motion.div
                className="flex items-center text-green-400 text-sm font-medium"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                {trend}
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <motion.h3
              className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {value}
            </motion.h3>
            <p className="text-gray-200 font-semibold text-lg">{title}</p>
            <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
          </div>

          {/* 装饰性几何图形 */}
          <motion.div
            className="absolute -bottom-4 -right-4 w-20 h-20 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${color.includes('purple') ? '#8b5cf6' : color.includes('blue') ? '#3b82f6' : '#10b981'}, transparent)`,
            }}
            animate={{
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </Surface>
    </motion.div>
  )
}

// 智能导航栏
const SmartNavbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const navBackground = useTransform(scrollY, [0, 100], [0, 1])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${navBackground.get() * 0.9})`,
        backdropFilter: `blur(${navBackground.get() * 20}px)`,
        borderBottomWidth: scrolled ? '1px' : '0px',
        borderBottomColor: `rgba(139, 92, 246, ${navBackground.get() * 0.2})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-white">Xorigo UI</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['组件', '文档', '示例', '博客'].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                className="relative text-gray-300 hover:text-white transition-colors group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-purple-400/30 px-6 py-2.5 rounded-full font-medium flex items-center gap-2 shadow-lg shadow-purple-500/20"
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

// 性能控制面板
const PerformancePanel = () => {
  const { quality, fps, isAuto, setQualityManual, setAutoMode } = usePerformanceMonitor()

  const qualityConfig = {
    high: { label: '高质量', color: 'from-green-500 to-emerald-500', particles: 60 },
    medium: { label: '中等质量', color: 'from-yellow-500 to-orange-500', particles: 40 },
    low: { label: '低质量', color: 'from-red-500 to-pink-500', particles: 25 }
  }

  const currentConfig = qualityConfig[quality]

  return (
    <motion.div
      className="fixed top-20 left-4 z-40 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-lg p-4 shadow-2xl"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-3">
        {/* 标题 */}
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          性能监控
        </div>

        {/* FPS 显示 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">FPS:</span>
          <span className={`text-sm font-bold ${
            fps >= 50 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {fps}
          </span>
        </div>

        {/* 当前质量 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">质量:</span>
          <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${currentConfig.color} text-white font-medium`}>
            {currentConfig.label}
          </span>
        </div>

        {/* 自动/手动模式 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">模式:</span>
          <button
            onClick={isAuto ? undefined : setAutoMode}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              isAuto
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600 border border-gray-600'
            }`}
            disabled={isAuto}
          >
            {isAuto ? '自动' : '手动'}
          </button>
        </div>

        {/* 手动质量切换按钮 */}
        <div className="space-y-2">
          <div className="text-xs text-gray-400 mb-1">手动切换:</div>
          <div className="flex gap-1">
            {(Object.keys(qualityConfig) as Array<keyof typeof qualityConfig>).map((q) => (
              <button
                key={q}
                onClick={() => setQualityManual(q)}
                className={`flex-1 text-xs px-2 py-1 rounded transition-all ${
                  quality === q
                    ? `bg-gradient-to-r ${qualityConfig[q].color} text-white shadow-lg`
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                disabled={isAuto}
              >
                {q === 'high' ? '高' : q === 'medium' ? '中' : '低'}
              </button>
            ))}
          </div>
        </div>

        {/* 粒子数量显示 */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">粒子数:</span>
          <span className="text-gray-300">{currentConfig.particles}</span>
        </div>

        {/* 恢复自动按钮 */}
        {!isAuto && (
          <button
            onClick={setAutoMode}
            className="w-full text-xs px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 transition-colors"
          >
            恢复自动模式
          </button>
        )}
      </div>
    </motion.div>
  )
}

// 主组件
export default function UltimateHybridHome() {
  const { scrollY } = useScroll()
  const shouldReduceMotion = useReducedMotion()

  const backgroundY = useTransform(scrollY, [0, 1000], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.9])

  const stats = [
    {
      icon: <Package className="w-6 h-6" />,
      title: '组件总数',
      value: '25+',
      description: '精心设计的高质量组件，覆盖常用场景',
      trend: '+15%',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: '设计令牌',
      value: '500+',
      description: '完整的设计系统令牌，确保视觉一致性',
      trend: '+25%',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: '性能评分',
      value: '99+',
      description: 'Lighthouse 性能评分，极致加载速度',
      trend: '+5%',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '类型安全',
      value: '100%',
      description: '完整的 TypeScript 支持，智能代码提示',
      trend: '0%',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: '动画流畅度',
      value: '60fps',
      description: '丝滑的动画体验，智能性能优化',
      trend: '+10%',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: '创新特性',
      value: '10+',
      description: '独特的创新功能，提升开发体验',
      trend: '+20%',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  const techStack = [
    { name: 'React 19', description: '最新的 React 特性和并发渲染', color: 'from-cyan-500 to-blue-500' },
    { name: 'TypeScript 5.9', description: '完整的类型安全和智能提示', color: 'from-blue-500 to-indigo-500' },
    { name: 'Tailwind CSS 3.4', description: '原子化 CSS 框架，快速样式开发', color: 'from-green-500 to-emerald-500' },
    { name: 'Framer Motion 12', description: '专业动画库，流畅的交互体验', color: 'from-purple-500 to-pink-500' },
    { name: 'Vite 5', description: '极速构建工具，毫秒级热更新', color: 'from-orange-500 to-red-500' },
    { name: 'Vitest', description: '现代测试框架，可靠的代码质量', color: 'from-yellow-500 to-orange-500' }
  ]

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 动态背景 */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{ y: shouldReduceMotion ? 0 : backgroundY }}
      >
        <HybridParticleSystem />
        <OptimizedCodeRain />
      </motion.div>

      {/* 导航栏 */}
      <SmartNavbar />

      {/* 性能控制面板 */}
      <PerformancePanel />

      {/* 主要内容 */}
      <main className="relative z-20">
        {/* Hero Section */}
        <motion.section
          className="min-h-screen flex items-center justify-center px-6 pt-24"
          style={{
            opacity: shouldReduceMotion ? 1 : heroOpacity,
            scale: shouldReduceMotion ? 1 : heroScale
          }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="space-y-8">
              {/* 标题动画 */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <motion.h1
                  className="text-6xl md:text-8xl font-bold bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-6"
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  Xorigo UI
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4"
                  initial={{ y: 30 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  🚀 极致视觉体验的现代 UI 组件库
                </motion.p>

                <motion.p
                  className="text-lg text-purple-400 max-w-2xl mx-auto"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  React 19 + TypeScript 5.9 + Framer Motion 12
                </motion.p>
              </motion.div>

              {/* 按钮组 */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
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
                  whileHover={{ scale: 1.05, rotateY: 5 }}
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
            </div>
          </div>
        </motion.section>

        {/* 3D组件展示 */}
        <motion.section
          className="py-20 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ y: 30 }}
              whileInView={{ y: 0 }}
              transition={{ type: "spring" }}
              viewport={{ once: true }}
            >
              核心组件展示
            </motion.h2>

            <ComponentShowcase />
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
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
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
                  <EnhancedStatsCard {...stat} />
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
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
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
                      <motion.div
                        className={`w-12 h-12 bg-gradient-to-br ${tech.color} rounded-xl flex items-center justify-center text-white font-bold text-lg`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {tech.name.charAt(0)}
                      </motion.div>
                      <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                        {tech.name.split(' ')[1]}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{tech.name}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{tech.description}</p>
                  </Surface>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 页脚 */}
        <footer className="py-16 px-6 border-t border-gray-800">
          <div className="max-w-7xl mx-auto text-center">
            <motion.p
              className="text-gray-400 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span>crafted with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>by Saken + AI Assistant</span>
            </motion.p>
          </div>
        </footer>
      </main>
    </div>
  )
}