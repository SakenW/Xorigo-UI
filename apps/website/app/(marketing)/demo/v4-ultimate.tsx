'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion'
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
  Menu
} from 'lucide-react'

/**
 * 方案4：终极融合版
 * 融合所有方案的优点：
 * - 方案1的极简美学和流体渐变
 * - 方案2的代码展示和终端动画
 * - 方案3的3D效果和霓虹光效
 * 新增特性：
 * - 智能色彩系统
 * - 高级粒子系统
 * - 交互式组件预览
 * - 平滑过渡动画
 */

// 智能粒子系统
const IntelligentParticles = () => {
  const [mounted, setMounted] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const particles = Array.from({ length: 50 })

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })

      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight })
      }

      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
      }

      window.addEventListener('resize', handleResize)
      window.addEventListener('mousemove', handleMouseMove)
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [mouseX, mouseY])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              i % 3 === 0 ? 'rgba(139, 92, 246, 0.5)' :
              i % 3 === 1 ? 'rgba(6, 182, 212, 0.5)' :
              'rgba(236, 72, 153, 0.5)'
            } 0%, transparent 70%)`
          }}
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          animate={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
            scale: {
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
            }
          }}
        />
      ))}

      {/* 鼠标跟随光效 */}
      <motion.div
        className="absolute w-[300px] h-[300px] pointer-events-none"
        style={{
          x: mouseX,
          y: mouseY,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
}

// 高级渐变背景
const AdvancedGradientBackground = () => {
  const [gradientIndex, setGradientIndex] = useState(0)

  const gradients = [
    'radial-gradient(at 20% 50%, rgba(120, 119, 255, 0.3) 0%, transparent 50%)',
    'radial-gradient(at 80% 80%, rgba(255, 119, 247, 0.3) 0%, transparent 50%)',
    'radial-gradient(at 40% 20%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)',
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [gradients.length])

  return (
    <div className="fixed inset-0 opacity-30">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: gradients[gradientIndex],
          rotate: [0, 360],
        }}
        transition={{
          background: { duration: 3 },
          rotate: { duration: 100, repeat: Infinity, ease: "linear" }
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20" />
    </div>
  )
}

// 打字机效果（来自方案2）
const TypewriterText = ({ text, delay = 50 }: { text: string; delay?: number }) => {
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

  return (
    <span className="relative">
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          className="inline-block w-0.5 h-8 bg-gradient-to-b from-purple-500 to-cyan-500 ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  )
}

// 3D卡片（增强版）
const Enhanced3DCard = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    setRotateX(((y - centerY) / centerY) * -15)
    setRotateY(((x - centerX) / centerX) * 15)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative preserve-3d ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      initial={{ opacity: 0, y: 20, rotateX: -30 }}
      animate={{
        opacity: 1,
        y: 0,
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
      }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <div
        style={{
          transform: 'translateZ(50px)',
          transition: 'all 0.3s ease',
        }}
      >
        {children}
      </div>

      {/* 发光效果 */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(20px)',
            transform: 'translateZ(-10px)',
          }}
        />
      )}
    </motion.div>
  )
}

// 迷你终端组件（简化版）
const MiniTerminal = () => {
  const commands = [
    { text: 'npm install @xorigo-ui/core', delay: 0 },
    { text: '✓ Installation complete', delay: 1000, isOutput: true },
    { text: 'npm run dev', delay: 2000 },
    { text: 'Server running at http://localhost:3100', delay: 3000, isOutput: true },
  ]

  const [visibleLines, setVisibleLines] = useState<number[]>([])

  useEffect(() => {
    commands.forEach((cmd, index) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, index])
      }, cmd.delay)
    })
  }, [])

  return (
    <div className="bg-black/90 rounded-lg overflow-hidden shadow-2xl backdrop-blur-sm border border-purple-500/20">
      <div className="bg-gray-900/50 px-4 py-2 flex items-center gap-2 border-b border-purple-500/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
        </div>
        <span className="text-gray-400 text-xs ml-2">Terminal</span>
      </div>
      <div className="p-4 font-mono text-sm">
        <AnimatePresence>
          {commands.map((cmd, index) => (
            visibleLines.includes(index) && (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={cmd.isOutput ? 'text-green-400 ml-4' : 'text-cyan-400'}
              >
                {!cmd.isOutput && <span className="text-purple-400 mr-2">➜</span>}
                <TypewriterText text={cmd.text} delay={30} />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// 交互式代码预览
const InteractiveCodePreview = () => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [buttonVariant, setButtonVariant] = useState('primary')

  const codeExample = `import { Button } from '@xorigo-ui/core'

export default function App() {
  return (
    <Button
      variant="${buttonVariant}"
      size="lg"
      className="shadow-xl"
    >
      Xorigo UI Button
    </Button>
  )
}`

  const variants = ['primary', 'secondary', 'outline', 'ghost']

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-gray-900/95 to-black/95 border-purple-500/20 backdrop-blur-xl">
      <div className="flex border-b border-purple-500/20 bg-black/50">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-6 py-3 text-sm font-medium transition-all ${
            activeTab === 'preview'
              ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-400/10'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          预览
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-6 py-3 text-sm font-medium transition-all ${
            activeTab === 'code'
              ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-400/10'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          代码
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'preview' ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-8 min-h-[300px] flex flex-col items-center justify-center gap-6"
          >
            <div className="flex gap-2 mb-4">
              {variants.map(variant => (
                <button
                  key={variant}
                  onClick={() => setButtonVariant(variant)}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${
                    buttonVariant === variant
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {variant}
                </button>
              ))}
            </div>

            <motion.div
              key={buttonVariant}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.4 }}
            >
              <Button
                size="lg"
                variant={buttonVariant as any}
                className="shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Xorigo UI Button
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6"
          >
            <pre className="text-sm font-mono overflow-x-auto">
              <code className="text-gray-300">{codeExample}</code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// 功能特性卡片（融合版）
const FeatureCard = ({ icon, title, description, gradient, delay }: any) => {
  return (
    <Enhanced3DCard delay={delay}>
      <Card className="p-6 bg-gradient-to-br from-gray-900/90 to-black/90 border-purple-500/20 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-500 group">
        <motion.div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 shadow-lg`}
          whileHover={{
            scale: 1.1,
            rotate: [0, -5, 5, -5, 0],
          }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
      </Card>
    </Enhanced3DCard>
  )
}

export default function UltimateHome() {
  const { scrollYProgress } = useScroll()
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const opacityProgress = useTransform(scrollYProgress, [0, 1], [1, 0.5])
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: <Layers className="w-7 h-7" />,
      title: "原子化组件",
      description: "17+ 精心设计的组件，可自由组合构建任意界面",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Palette className="w-7 h-7" />,
      title: "七轴主题系统",
      description: "20+ DTCG 配方，无限扩展可能，一键切换风格",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "极致性能",
      description: "React 19 + Vite 6 构建，启动速度快如闪电",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "TypeScript 优先",
      description: "100% 类型覆盖，完整的 IDE 智能提示",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: <Rocket className="w-7 h-7" />,
      title: "开发体验",
      description: "热更新、实时预览，让开发成为享受",
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: "生产就绪",
      description: "Tree-shaking、代码分割，优化到每个字节",
      gradient: "from-indigo-500 to-purple-500"
    }
  ]

  const techStack = [
    { name: "React 19", icon: "⚛️", version: "^19.2.0" },
    { name: "TypeScript", icon: "🔷", version: "~5.9.3" },
    { name: "Tailwind", icon: "🎨", version: "^3.4.18" },
    { name: "Framer Motion", icon: "✨", version: "^12.23.5" },
    { name: "Vite", icon: "⚡", version: "^6.0.7" },
    { name: "Docker", icon: "🐳", version: "Ready" }
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 背景层 */}
      <AdvancedGradientBackground />
      <IntelligentParticles />

      {/* 导航栏 */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-purple-500/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">X</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Xorigo UI
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">功能</a>
            <a href="#preview" className="text-gray-400 hover:text-white transition-colors">预览</a>
            <a href="#tech" className="text-gray-400 hover:text-white transition-colors">技术栈</a>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/50 hover:border-purple-400 text-purple-400"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.open('https://github.com/SakenW/Xorigo-UI', '_blank')
                }
              }}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div
          className="max-w-7xl mx-auto w-full"
          style={{ scale: scaleProgress, opacity: opacityProgress }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 左侧内容 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
            >
              {/* 标签 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 backdrop-blur-sm mb-6"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  全新组件库 • 持续进化中
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Xorigo
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-baseline"
                >
                  <span className="text-white">UI</span>
                  <motion.span
                    className="ml-3 text-2xl text-gray-500"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    _
                  </motion.span>
                </motion.div>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-300 mb-8 leading-relaxed"
              >
                下一代 React 组件库，为
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-semibold"> 现代开发者 </span>
                打造的极致体验
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-400 mb-10"
              >
                类型安全 • 主题系统 • 开箱即用 • 持续进化
              </motion.p>

              {/* CTA 按钮 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25"
                  >
                    <span className="relative z-10 flex items-center">
                      开始使用
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500"
                      initial={{ x: '100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-purple-500/50 hover:border-purple-400 px-8 py-4 text-lg backdrop-blur-sm"
                  >
                    <Code2 className="mr-2 w-5 h-5" />
                    查看文档
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* 右侧：迷你终端 + 代码预览 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
            >
              <MiniTerminal />

              {/* 快速安装 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg border border-purple-500/20 backdrop-blur-sm"
              >
                <Package className="w-5 h-5 text-purple-400" />
                <code className="text-sm text-gray-300 font-mono flex-1">
                  npm install @xorigo-ui/core
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-400 hover:text-purple-300"
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText('npm install @xorigo-ui/core')
                    }
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* 滚动指示器 */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                为什么选择 Xorigo UI
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              融合极简美学、开发体验与视觉创新的现代组件库
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Preview Section */}
      <section id="preview" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                实时组件预览
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              交互式文档，所见即所得
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <InteractiveCodePreview />
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section id="tech" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                现代技术栈
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              最新技术，最佳实践
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative group"
              >
                <Card className="p-6 bg-gradient-to-br from-gray-900/90 to-black/90 border-purple-500/20 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-300">
                  <div className="text-4xl mb-3 text-center">{tech.icon}</div>
                  <div className="text-sm font-semibold text-white text-center">{tech.name}</div>
                  <div className="text-xs text-gray-500 text-center mt-1">{tech.version}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-12 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-cyan-900/20 backdrop-blur-xl border-purple-500/30 relative overflow-hidden">
            {/* 装饰性背景 */}
            <div className="absolute inset-0 opacity-30">
              <motion.div
                className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl"
                animate={{
                  x: [0, -100, 0],
                  y: [0, 100, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 5
                }}
              />
            </div>

            <div className="relative z-10 text-center">
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  开始构建美好体验
                </span>
              </motion.h2>

              <motion.p
                className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Xorigo UI 正在持续进化，加入我们，一起打造更好的组件库
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 shadow-2xl hover:shadow-purple-500/25"
                  >
                    <Rocket className="mr-2 w-5 h-5" />
                    立即开始
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-purple-500/50 hover:border-purple-400 px-8 py-4"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.open('https://github.com/SakenW/Xorigo-UI', '_blank')
                      }
                    }}
                  >
                    <Star className="mr-2 w-5 h-5" />
                    Star on GitHub
                  </Button>
                </motion.div>
              </motion.div>

              {/* 作者信息 */}
              <motion.div
                className="mt-16 pt-8 border-t border-purple-500/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-gray-500">
                  Created with <Heart className="inline w-4 h-4 text-red-400 mx-1" /> by
                  <span className="text-purple-400 font-semibold mx-1">Saken</span>
                  +
                  <span className="text-cyan-400 font-semibold mx-1">AI</span>
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  <a
                    href="https://github.com/SakenW/Xorigo-UI"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    github.com/SakenW/Xorigo-UI
                  </a>
                  {' • '}
                  <span>MIT License</span>
                </p>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 text-2xl">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>功能</a>
              <a href="#preview" className="text-gray-400 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>预览</a>
              <a href="#tech" className="text-gray-400 hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>技术栈</a>
              <Button
                variant="outline"
                className="border-purple-500/50 hover:border-purple-400 text-purple-400"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open('https://github.com/SakenW/Xorigo-UI', '_blank')
                  }
                  setIsMenuOpen(false)
                }}
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>
            <button
              className="absolute top-8 right-8 text-gray-400 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 添加样式 */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  )
}