'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useVelocity, useAnimationFrame, MotionValue } from 'framer-motion'
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
 * 终极增强版 - 极致细节与动效
 * 新增特性：
 * - 高级鼠标交互
 * - 流畅的页面过渡
 * - 智能颜色系统
 * - 3D 文字效果
 * - 高级粒子物理
 * - 磁性按钮
 * - 液态过渡
 * - 代码雨效果
 */

// 高级粒子系统 - 带物理效果
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
  }>>([])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const mouseXSmooth = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const mouseYSmooth = useSpring(mouseY, { stiffness: 100, damping: 30 })

  useEffect(() => {
    setMounted(true)

    // 初始化粒子
    const initialParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      color: ['#8B5CF6', '#06B6D4', '#EC4899', '#F59E0B'][Math.floor(Math.random() * 4)],
      life: 1
    }))
    setParticles(initialParticles)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // 粒子动画循环
  useAnimationFrame(() => {
    setParticles(prev => prev.map(particle => {
      let { x, y, vx, vy, life } = particle

      // 鼠标吸引力
      const dx = mouseXSmooth.get() - x
      const dy = mouseYSmooth.get() - y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 200) {
        const force = (200 - distance) / 200 * 0.02
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
      if (x < 0 || x > window.innerWidth) vx = -vx
      if (y < 0 || y > window.innerHeight) vy = -vy

      // 生命周期
      life -= 0.001
      if (life <= 0) {
        x = Math.random() * window.innerWidth
        y = Math.random() * window.innerHeight
        life = 1
      }

      return { ...particle, x, y, vx, vy, life }
    }))
  })

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            x: particle.x,
            y: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life * 0.6,
            filter: `blur(${(1 - particle.life) * 2}px)`,
            boxShadow: `0 0 ${10 * particle.life}px ${particle.color}`
          }}
        />
      ))}

      {/* 鼠标光晕 */}
      <motion.div
        className="absolute w-[400px] h-[400px] pointer-events-none"
        style={{
          x: mouseXSmooth,
          y: mouseYSmooth,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/20 to-transparent animate-pulse" />
          <div className="absolute inset-[20%] bg-gradient-radial from-cyan-500/15 to-transparent animate-pulse animation-delay-200" />
          <div className="absolute inset-[40%] bg-gradient-radial from-pink-500/10 to-transparent animate-pulse animation-delay-400" />
        </div>
      </motion.div>
    </div>
  )
}

// 代码雨背景
const CodeRainBackground = () => {
  const [columns, setColumns] = useState<Array<{ x: number; y: number; speed: number; chars: string[] }>>([])

  useEffect(() => {
    const chars = 'const=>(){}[]</>import:;,.functionreturnifelseclassextends'.split('')
    const columnCount = Math.floor(window.innerWidth / 30)

    const initialColumns = Array.from({ length: columnCount }, (_, i) => ({
      x: i * 30 + 15,
      y: Math.random() * -window.innerHeight,
      speed: Math.random() * 2 + 1,
      chars: Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)])
    }))

    setColumns(initialColumns)
  }, [])

  useAnimationFrame(() => {
    setColumns(prev => prev.map(col => ({
      ...col,
      y: col.y > window.innerHeight ? -400 : col.y + col.speed
    })))
  })

  return (
    <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
      {columns.map((col, i) => (
        <div
          key={i}
          className="absolute font-mono text-xs text-purple-500"
          style={{
            left: col.x,
            transform: `translateY(${col.y}px)`,
          }}
        >
          {col.chars.map((char, j) => (
            <div
              key={j}
              className="leading-6"
              style={{
                opacity: 1 - j * 0.05,
                filter: j === 0 ? 'none' : `blur(${j * 0.1}px)`
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// 3D 文字效果
const Text3D = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      <motion.span
        className="relative inline-block"
        animate={{
          rotateX: isHovered ? 10 : 0,
          rotateY: isHovered ? -10 : 0,
          z: isHovered ? 50 : 0
        }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {children}
      </motion.span>
      {/* 3D阴影层 */}
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="absolute inset-0 select-none pointer-events-none"
          style={{
            transform: `translateZ(${-i * 2}px)`,
            opacity: 0.1 - i * 0.02,
            filter: `blur(${i * 0.5}px)`
          }}
        >
          {children}
        </span>
      ))}
    </motion.div>
  )
}

// 磁性按钮
const MagneticButton = ({ children, className = '', ...props }: any) => {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setPosition({ x: x * 0.2, y: y * 0.2 })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y
      }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <motion.div
        animate={{
          x: position.x * 0.5,
          y: position.y * 0.5
        }}
      >
        {children}
      </motion.div>
    </motion.button>
  )
}

// 液态卡片
const LiquidCard = ({ children, className = '', delay = 0 }: any) => {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', bounce: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 液态背景 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'blur(40px)' }}>
        <motion.circle
          cx="20%"
          cy="30%"
          r="60"
          fill="#8B5CF6"
          animate={{
            cx: isHovered ? '30%' : '20%',
            cy: isHovered ? '40%' : '30%',
          }}
          transition={{ type: 'spring', stiffness: 30 }}
        />
        <motion.circle
          cx="80%"
          cy="70%"
          r="80"
          fill="#06B6D4"
          animate={{
            cx: isHovered ? '70%' : '80%',
            cy: isHovered ? '60%' : '70%',
          }}
          transition={{ type: 'spring', stiffness: 30 }}
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r="70"
          fill="#EC4899"
          animate={{
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ type: 'spring', stiffness: 30 }}
        />
      </svg>

      {/* 卡片内容 */}
      <Card className="relative bg-black/80 backdrop-blur-xl border-white/10 overflow-hidden group">
        {/* 光线扫描效果 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
          animate={{
            x: isHovered ? ['-200%', '200%'] : '-200%'
          }}
          transition={{
            duration: 1,
            ease: 'easeInOut'
          }}
        />

        {children}
      </Card>
    </motion.div>
  )
}

// 交互式图标
const InteractiveIcon = ({ icon: Icon, gradient, size = 'w-7 h-7' }: any) => {
  const [isHovered, setIsHovered] = useState(false)
  const [rotation, setRotation] = useState(0)

  return (
    <motion.div
      className={`relative ${size} cursor-pointer`}
      onMouseEnter={() => {
        setIsHovered(true)
        setRotation(rotation + 360)
      }}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        rotate: rotation,
        scale: isHovered ? 1.2 : 1
      }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      {/* 动态光环 */}
      <motion.div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient}`}
        animate={{
          scale: isHovered ? [1, 1.3, 1] : 1,
          opacity: isHovered ? [0.8, 0.3, 0.8] : 0.8
        }}
        transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
      />

      {/* 图标容器 */}
      <div className={`relative z-10 w-full h-full rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
        <Icon className="w-4/6 h-4/6" />
      </div>

      {/* 发光效果 */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            boxShadow: `0 0 30px ${gradient.includes('purple') ? '#8B5CF6' :
                               gradient.includes('cyan') ? '#06B6D4' :
                               gradient.includes('pink') ? '#EC4899' :
                               gradient.includes('yellow') ? '#F59E0B' :
                               gradient.includes('green') ? '#10B981' :
                               '#3B82F6'}`,
          }}
        />
      )}
    </motion.div>
  )
}

// 高级终端组件
const AdvancedTerminal = () => {
  const [currentCommand, setCurrentCommand] = useState(0)
  const [output, setOutput] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const commands = [
    { cmd: 'npm create xorigo-app@latest', delay: 0 },
    { cmd: 'cd my-awesome-app', delay: 1500 },
    { cmd: 'npm install', delay: 2500 },
    { cmd: 'npm run dev', delay: 4000 }
  ]

  const outputs = [
    '✨ Creating a new Xorigo UI project...',
    '📁 Project structure created',
    '📦 Installing dependencies... Done!',
    '🚀 Server running at http://localhost:3100'
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentCommand < commands.length) {
        setIsTyping(true)
        setTimeout(() => {
          setOutput(prev => [...prev, outputs[currentCommand]])
          setIsTyping(false)
          setCurrentCommand(currentCommand + 1)
        }, 1000)
      }
    }, commands[currentCommand]?.delay || 0)

    return () => clearTimeout(timer)
  }, [currentCommand])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', bounce: 0.3 }}
      className="relative"
    >
      {/* 装饰光效 */}
      <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 rounded-2xl blur-xl animate-pulse" />

      <div className="relative bg-black/90 rounded-xl overflow-hidden shadow-2xl border border-purple-500/20">
        {/* 标题栏 */}
        <div className="bg-gradient-to-r from-gray-900 to-black px-4 py-3 flex items-center justify-between border-b border-purple-500/10">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 bg-red-500 rounded-full cursor-pointer" />
              <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer" />
              <motion.div whileHover={{ scale: 1.2 }} className="w-3 h-3 bg-green-500 rounded-full cursor-pointer" />
            </div>
            <span className="text-gray-400 text-xs ml-2 font-mono">Terminal - Xorigo UI</span>
          </div>
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* 终端内容 */}
        <div className="p-6 font-mono text-sm space-y-3 min-h-[250px]">
          {commands.slice(0, currentCommand + 1).map((cmd, index) => (
            <div key={index} className="space-y-1">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-purple-400">➜</span>
                <span className="text-cyan-400">~/projects</span>
                <span className="text-gray-400">$</span>
                <span className="text-white">
                  {index === currentCommand && isTyping ? (
                    <TypewriterText text={cmd.cmd} />
                  ) : (
                    cmd.cmd
                  )}
                </span>
              </motion.div>

              {output[index] && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="ml-6 text-green-400"
                >
                  {output[index]}
                </motion.div>
              )}
            </div>
          ))}

          {/* 光标 */}
          {currentCommand < commands.length && (
            <motion.span
              className="inline-block w-2 h-4 bg-purple-400"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.7, repeat: Infinity }}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

// 打字机效果
const TypewriterText = ({ text, delay = 30 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, text, delay])

  return <span>{displayText}</span>
}

// 技能图标网格
const TechIcon = ({ name, icon, version, delay }: any) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay, type: 'spring', bounce: 0.5 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <LiquidCard>
        <div className="p-6 text-center">
          <motion.div
            className="text-5xl mb-3"
            animate={{
              scale: isHovered ? [1, 1.2, 1] : 1,
              rotate: isHovered ? [0, 360] : 0
            }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
          <div className="font-bold text-white">{name}</div>
          <div className="text-xs text-purple-400 mt-1">{version}</div>
        </div>

        {/* 悬停时的光效 */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg" />
          </motion.div>
        )}
      </LiquidCard>
    </motion.div>
  )
}

// 导航栏
const Navbar = () => {
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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-2xl border-b border-purple-500/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="relative w-10 h-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 to-cyan-500/50 rounded-xl blur animate-pulse" />
              <div className="relative w-full h-full flex items-center justify-center text-white font-bold text-xl">
                X
              </div>
            </motion.div>
            <Text3D className="text-xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Xorigo UI
              </span>
            </Text3D>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {['功能', '组件', '文档', '定价'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item}`}
                className="text-gray-400 hover:text-white transition-colors relative group"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item}
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
              </motion.a>
            ))}

            <MagneticButton
              className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-purple-500/25 transition-shadow"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.open('https://github.com/SakenW/Xorigo-UI', '_blank')
                }
              }}
            >
              <span className="relative z-10 flex items-center">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </span>
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-2xl border-t border-purple-500/20"
          >
            <div className="p-6 space-y-4">
              {['功能', '组件', '文档', '定价'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item}`}
                  className="block text-gray-400 hover:text-white transition-colors"
                  whileHover={{ x: 10 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open('https://github.com/SakenW/Xorigo-UI', '_blank')
                  }
                  setMobileMenuOpen(false)
                }}
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default function UltimateEnhancedHome() {
  const { scrollYProgress } = useScroll()
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5], [1, 0.7])

  const features = [
    {
      icon: <Layers />,
      title: "原子化设计",
      description: "构建可复用、可组合的UI组件系统",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Palette />,
      title: "主题系统",
      description: "七轴DTCG配方，无限主题可能",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Zap />,
      title: "极速体验",
      description: "基于Vite 6构建，毫秒级热更新",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Shield />,
      title: "类型安全",
      description: "100% TypeScript，完整类型推导",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: <Workflow />,
      title: "开发工作流",
      description: "集成最佳实践，提升开发效率",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Cloud />,
      title: "云原生",
      description: "Docker容器化，一键部署上线",
      gradient: "from-pink-500 to-rose-500"
    }
  ]

  const techStack = [
    { name: "React", icon: "⚛️", version: "19.2.0" },
    { name: "TypeScript", icon: "🔷", version: "5.9.3" },
    { name: "Tailwind", icon: "🎨", version: "3.4.18" },
    { name: "Framer", icon: "✨", version: "12.23" },
    { name: "Vite", icon: "⚡", version: "6.0.7" },
    { name: "Docker", icon: "🐳", version: "Latest" }
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 背景效果 */}
      <CodeRainBackground />
      <AdvancedParticleSystem />

      {/* 导航栏 */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div
          className="max-w-7xl mx-auto w-full"
          style={{ scale: scaleProgress, opacity: opacityProgress }}
        >
          <div className="text-center">
            {/* 标题 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-block mb-6"
                animate={{
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold">
                  <Text3D>
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-300">
                      Xorigo UI
                    </span>
                  </Text3D>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl text-gray-300 mb-8"
              >
                下一代 React 组件库
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto"
              >
                为现代Web应用打造的极致组件库，融合美学与性能的完美平衡
              </motion.p>
            </motion.div>

            {/* CTA按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <MagneticButton className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-purple-500/30 transition-all">
                <span className="relative z-10 flex items-center">
                  <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  开始使用
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </MagneticButton>

              <MagneticButton className="border-2 border-purple-500/50 hover:border-purple-400 text-white px-10 py-5 rounded-2xl text-lg font-bold backdrop-blur-sm hover:bg-purple-500/10 transition-all">
                <Code2 className="w-5 h-5 mr-2" />
                查看文档
              </MagneticButton>
            </motion.div>

            {/* 终端展示 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, type: 'spring' }}
              className="mt-20 max-w-3xl mx-auto"
            >
              <AdvancedTerminal />
            </motion.div>
          </div>
        </motion.div>

        {/* 滚动提示 */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{
            y: [0, 10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          <MousePointer2 className="w-6 h-6 text-purple-400" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <Text3D>
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  核心特性
                </span>
              </Text3D>
            </h2>
            <p className="text-xl text-gray-400">
              为卓越而生，为效率而造
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <LiquidCard key={feature.title} delay={index * 0.1}>
                <div className="p-8">
                  <InteractiveIcon
                    icon={feature.icon}
                    gradient={feature.gradient}
                    size="w-16 h-16"
                  />
                  <h3 className="text-2xl font-bold mt-6 mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </LiquidCard>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <Text3D>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  技术栈
                </span>
              </Text3D>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <TechIcon
                key={tech.name}
                {...tech}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 添加必要的样式 */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .bg-300 {
          background-size: 300% 300%;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  )
}