'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue } from 'framer-motion'
import { Button, Card, AnimatedCard, Typography, Surface } from '@xorigo-ui/core'
import {
  Sparkles,
  Zap,
  Layers,
  Palette,
  Box,
  Star,
  Github,
  ArrowUpRight,
  MousePointer2,
  Gem,
  Flame,
  Award,
  Crown,
  Heart
} from 'lucide-react'

/**
 * 方案3：创意动感风
 * 特点：3D透视、视差滚动、霓虹光效、鼠标跟随、强视觉冲击
 */

// 3D卡片组件
const Card3D = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    setRotateX(((y - centerY) / centerY) * -10)
    setRotateY(((x - centerX) / centerX) * 10)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative preserve-3d ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      <div style={{ transform: 'translateZ(50px)' }}>
        {children}
      </div>
    </motion.div>
  )
}

// 霓虹发光文字
const NeonText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <h1 className={`relative ${className}`}>
      <span className="relative z-10">{children}</span>
      <span
        className="absolute inset-0 blur-lg opacity-75"
        style={{
          background: 'linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
      >
        {children}
      </span>
    </h1>
  )
}

// 鼠标跟随光效
const MouseFollower = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX - 100)
        mouseY.set(e.clientY - 100)
      }

      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

  return (
    <motion.div
      className="fixed w-[200px] h-[200px] pointer-events-none z-50"
      style={{
        x: mouseX,
        y: mouseY,
        background: 'radial-gradient(circle, rgba(255,0,255,0.1) 0%, transparent 70%)',
        filter: 'blur(40px)'
      }}
    />
  )
}

// 波浪动画背景
const WaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,100 C320,300 420,50 800,100 C1200,150 1200,50 1440,100 L1440,600 L0,600 Z"
          fill="url(#gradient1)"
          animate={{
            d: [
              "M0,100 C320,300 420,50 800,100 C1200,150 1200,50 1440,100 L1440,600 L0,600 Z",
              "M0,200 C320,100 420,250 800,200 C1200,100 1200,250 1440,200 L1440,600 L0,600 Z",
              "M0,100 C320,300 420,50 800,100 C1200,150 1200,50 1440,100 L1440,600 L0,600 Z"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,200 C320,100 420,300 800,200 C1200,100 1200,300 1440,200 L1440,600 L0,600 Z"
          fill="url(#gradient2)"
          animate={{
            d: [
              "M0,200 C320,100 420,300 800,200 C1200,100 1200,300 1440,200 L1440,600 L0,600 Z",
              "M0,150 C320,250 420,100 800,150 C1200,200 1200,100 1440,150 L1440,600 L0,600 Z",
              "M0,200 C320,100 420,300 800,200 C1200,100 1200,300 1440,200 L1440,600 L0,600 Z"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff00ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// 浮动图标
const FloatingIcons = () => {
  const icons = [
    { Icon: Sparkles, color: 'text-purple-400' },
    { Icon: Star, color: 'text-yellow-400' },
    { Icon: Gem, color: 'text-cyan-400' },
    { Icon: Crown, color: 'text-pink-400' },
    { Icon: Flame, color: 'text-orange-400' },
    { Icon: Heart, color: 'text-red-400' }
  ]

  return (
    <>
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.color} opacity-20`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        >
          <item.Icon className="w-8 h-8" />
        </motion.div>
      ))}
    </>
  )
}

export default function CreativeHome() {
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])

  const [currentColorIndex, setCurrentColorIndex] = useState(0)
  const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff00aa', '#00ffaa']

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colors.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [colors.length])

  const features = [
    {
      icon: <Layers className="w-8 h-8" />,
      title: '17+ 组件',
      description: '精心设计的原子化组件',
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: '20+ 配方',
      description: '七轴主题系统',
      gradient: 'from-cyan-400 to-blue-400'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: '极速',
      description: 'React 19 + Vite',
      gradient: 'from-yellow-400 to-orange-400'
    },
    {
      icon: <Box className="w-8 h-8" />,
      title: 'TypeScript',
      description: '完整类型支持',
      gradient: 'from-green-400 to-teal-400'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 鼠标跟随光效 */}
      <MouseFollower />

      {/* 浮动图标 */}
      <FloatingIcons />

      {/* 波浪背景 */}
      <WaveBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        >
          {/* Logo 3D动画 */}
          <motion.div
            className="mb-8 inline-block"
            animate={{
              rotateZ: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-32 h-32 mx-auto relative">
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: `linear-gradient(135deg, ${colors[currentColorIndex]}, ${colors[(currentColorIndex + 1) % colors.length]})`,
                  boxShadow: `0 0 60px ${colors[currentColorIndex]}40, 0 0 100px ${colors[currentColorIndex]}20`
                }}
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-white">X</span>
              </div>
            </div>
          </motion.div>

          {/* 霓虹标题 */}
          <NeonText className="text-7xl md:text-8xl lg:text-9xl font-bold mb-6">
            Xorigo UI
          </NeonText>

          {/* 动感副标题 */}
          <motion.p
            className="text-2xl md:text-3xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              background: 'linear-gradient(90deg, #ff00ff, #00ffff, #ffff00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            释放创意，突破极限
          </motion.p>

          <motion.p
            className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            下一代 React 组件库，为创意而生
          </motion.p>

          {/* CTA按钮 */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="group relative overflow-hidden px-8 py-4 text-lg font-bold"
                style={{
                  background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
                  boxShadow: '0 0 30px rgba(255, 0, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)'
                }}
              >
                <span className="relative z-10 flex items-center">
                  开启创意之旅
                  <Sparkles className="ml-2 w-5 h-5" />
                </span>
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(45deg, #00ffff, #ff00ff)'
                  }}
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
                className="border-2 border-purple-500 hover:border-cyan-500 px-8 py-4 text-lg relative group overflow-hidden"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open('https://github.com/SakenW/Xorigo-UI', '_blank')
                  }
                }}
              >
                <span className="relative z-10 flex items-center">
                  <Github className="mr-2 w-5 h-5" />
                  GitHub
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 滚动指示器 */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{
            y: [0, 20, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          <MousePointer2 className="w-8 h-8 text-purple-400" />
        </motion.div>
      </section>

      {/* 3D Features Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span
                style={{
                  background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                突破想象的功能
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                viewport={{ once: true }}
              >
                <Card3D>
                  <Card
                    className="p-8 bg-gradient-to-br from-gray-900 to-black border-gray-800 hover:border-purple-500 transition-all duration-300"
                    style={{
                      boxShadow: '0 10px 40px rgba(255, 0, 255, 0.2)'
                    }}
                  >
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6`}
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -10, 10, -10, 0]
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </Card>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span
                style={{
                  background: 'linear-gradient(45deg, #00ffff, #ffff00)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                视觉盛宴
              </span>
            </h2>
          </motion.div>

          {/* 3D展示卡片 */}
          <motion.div
            className="relative h-[600px]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={{
                  z: index * -100,
                  scale: 1 - index * 0.1,
                  opacity: 1 - index * 0.3
                }}
                animate={{
                  z: index * -100,
                  rotateY: index * 10
                }}
                whileHover={{
                  z: index * -80,
                  scale: 1 - index * 0.05
                }}
                transition={{ type: 'spring', stiffness: 100 }}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                <Card
                  className="h-full bg-gradient-to-br from-purple-900/50 to-cyan-900/50 backdrop-blur-lg border-purple-500/30"
                  style={{
                    boxShadow: `0 ${20 + index * 10}px ${60 + index * 20}px rgba(255, 0, 255, ${0.3 - index * 0.1})`
                  }}
                >
                  <div className="p-12 h-full flex flex-col justify-center items-center">
                    <motion.div
                      className="text-8xl mb-6"
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    >
                      {index === 0 && '✨'}
                      {index === 1 && '🎨'}
                      {index === 2 && '🚀'}
                    </motion.div>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      {index === 0 && '创意无限'}
                      {index === 1 && '设计精美'}
                      {index === 2 && '性能卓越'}
                    </h3>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <Card
            className="p-12 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 backdrop-blur-xl border-purple-500/50"
            style={{
              boxShadow: '0 0 100px rgba(255, 0, 255, 0.3), 0 0 200px rgba(0, 255, 255, 0.2)'
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span
                  style={{
                    background: 'linear-gradient(90deg, #ff00ff, #00ffff, #ffff00, #ff00ff)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradient 3s ease infinite'
                  }}
                >
                  加入创意革命
                </span>
              </h2>
            </motion.div>

            <p className="text-xl text-gray-300 mb-8">
              Xorigo UI - 新生代组件库
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="px-8 py-3 font-bold"
                  style={{
                    background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
                    boxShadow: '0 0 30px rgba(255, 0, 255, 0.5)'
                  }}
                >
                  立即体验
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </div>

            <div className="pt-8 border-t border-purple-500/30">
              <p className="text-sm text-gray-400">
                Created by <span className="text-purple-400 font-semibold">Saken</span> + <span className="text-cyan-400 font-semibold">AI</span>
                <br />
                <a href="https://github.com/SakenW/Xorigo-UI" className="text-purple-400 hover:text-cyan-400 transition-colors">
                  GitHub
                </a>
                {' • '}
                <span className="text-gray-500">saken.w@gmail.com</span>
              </p>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* 添加渐变动画样式 */}
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