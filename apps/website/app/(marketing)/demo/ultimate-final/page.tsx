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
 * 最终稳定版本 - 使用成熟库和方法
 * 专注于稳定性和性能，修复了质量切换和代码雨问题
 */

// 性能配置
const PERFORMANCE_CONFIG = {
  high: {
    particleCount: 50,
    codeLines: 15,
    animationDuration: 20,
    enableGlow: true,
    enableParallax: true
  },
  medium: {
    particleCount: 30,
    codeLines: 10,
    animationDuration: 15,
    enableGlow: false,
    enableParallax: true
  },
  low: {
    particleCount: 15,
    codeLines: 5,
    animationDuration: 10,
    enableGlow: false,
    enableParallax: false
  }
}

// 简化性能监控 Hook
const usePerformanceMonitor = () => {
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high')
  const [fps, setFps] = useState(60)
  const frameCount = useRef(0)
  const lastTime = useRef(Date.now())

  useEffect(() => {
    let animationId: number

    const measureFPS = () => {
      frameCount.current++
      const currentTime = Date.now()
      const deltaTime = currentTime - lastTime.current

      if (deltaTime >= 1000) {
        const currentFps = Math.round((frameCount.current * 1000) / deltaTime)
        setFps(currentFps)

        // 自动调整性能等级
        if (currentFps < 30 && performanceLevel !== 'low') {
          setPerformanceLevel('low')
        } else if (currentFps < 45 && performanceLevel === 'high') {
          setPerformanceLevel('medium')
        } else if (currentFps > 55 && performanceLevel !== 'high') {
          setPerformanceLevel('high')
        }

        frameCount.current = 0
        lastTime.current = currentTime
      }

      animationId = requestAnimationFrame(measureFPS)
    }

    animationId = requestAnimationFrame(measureFPS)

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
    setPerformanceLevel: setManualPerformanceLevel,
    config: PERFORMANCE_CONFIG[performanceLevel]
  }
}

// 简化粒子系统
const SimpleParticleSystem = ({ config }: { config: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: config.particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      color: ['#8B5CF6', '#06B6D4', '#EC4899', '#F59E0B'][Math.floor(Math.random() * 4)]
    }))

    let animationId: number

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = 0.8
        ctx.fill()
      })

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
      style={{ opacity: config.enableGlow ? 0.8 : 0.6 }}
    />
  )
}

// CSS 代码雨效果
const CodeRainEffect = ({ config }: { config: any }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30" />
      <div className="code-rain-container">
        {Array.from({ length: config.codeLines }, (_, i) => (
          <div
            key={i}
            className="code-rain-line"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * config.animationDuration}s`,
              animationDuration: `${config.animationDuration + Math.random() * 10}s`,
              opacity: config.enableGlow ? 0.7 : 0.4
            }}
          >
            {Array.from({ length: 15 }, (_, j) => (
              <span key={j} style={{
                color: ['#8B5CF6', '#06B6D4', '#EC4899', '#F59E0B'][Math.floor(Math.random() * 4)]
              }}>
                {['{', '}', '[]', '()', ';', 'const', 'let', 'var', 'function', 'return', '=>', '<', '>', '/', '*'][Math.floor(Math.random() * 15)]}
              </span>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        .code-rain-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .code-rain-line {
          position: absolute;
          top: -100px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.2;
          white-space: pre;
          animation: code-rain linear infinite;
          text-shadow: 0 0 5px currentColor;
        }

        @keyframes code-rain {
          to {
            transform: translateY(calc(100vh + 200px));
          }
        }
      `}</style>
    </div>
  )
}

// 简化3D轮播
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

// 性能控制面板
const PerformanceControlPanel = ({
  performanceLevel,
  fps,
  setPerformanceLevel
}: {
  performanceLevel: 'high' | 'medium' | 'low'
  fps: number
  setPerformanceLevel: (level: 'high' | 'medium' | 'low') => void
}) => {
  return (
    <motion.div
      className="fixed top-20 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4 border border-purple-500/20 z-50"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2 }}
    >
      <h3 className="text-white font-bold mb-3 text-sm">性能控制</h3>

      <div className="mb-3">
        <div className="text-gray-400 text-xs mb-1">FPS: {fps}</div>
        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full transition-colors ${
              fps > 50 ? 'bg-green-500' : fps > 30 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(fps, 60) / 60 * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {[
          { value: 'high', label: '高画质', color: 'bg-red-500' },
          { value: 'medium', label: '中画质', color: 'bg-yellow-500' },
          { value: 'low', label: '低画质', color: 'bg-green-500' }
        ].map(({ value, label, color }) => (
          <button
            key={value}
            onClick={() => setPerformanceLevel(value as 'high' | 'medium' | 'low')}
            className={`w-full px-3 py-1 text-xs rounded transition-all ${
              performanceLevel === value
                ? `${color} text-white`
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// 简化导航栏
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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
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
export default function UltimateFinalHome() {
  const { scrollYProgress } = useScroll()
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5], [1, 0.7])
  const { performanceLevel, fps, setPerformanceLevel, config } = usePerformanceMonitor()

  const stats = [
    { label: '组件', value: 50, suffix: '+', icon: <Box /> },
    { label: '主题', value: 20, suffix: '+', icon: <Palette /> },
    { label: 'TypeScript', value: 100, suffix: '%', icon: <Code2 /> },
    { label: '性能提升', value: 50, suffix: '%', icon: <Zap /> }
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 背景效果 */}
      <SimpleParticleSystem config={config} />
      <CodeRainEffect config={config} />

      {/* 性能控制面板 */}
      <PerformanceControlPanel
        performanceLevel={performanceLevel}
        fps={fps}
        setPerformanceLevel={setPerformanceLevel}
      />

      {/* 导航栏 */}
      <SimpleNavbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div
          className="max-w-7xl mx-auto w-full text-center relative z-10"
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
        </motion.div>
      </section>

      {/* 组件展示 */}
      <section className="py-32 px-6 relative z-10">
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
      <section className="py-32 px-6 relative z-10">
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
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-400">{stat.label}</div>
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
          </motion.p>
        </div>
      </footer>

      {/* 性能信息显示 */}
      <div className="fixed bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-400 z-50">
        性能: {performanceLevel} | FPS: {fps}
      </div>
    </div>
  )
}