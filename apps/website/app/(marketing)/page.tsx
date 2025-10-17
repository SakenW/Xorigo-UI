'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useVelocity, useAnimationFrame, MotionValue, useInView } from 'framer-motion'
import { Button, Card, AnimatedCard, Typography, Surface, Code as CodeComponent, XorigoLogoLoader } from '@xorigo-ui/core'
import {
  Zap,
  Palette,
  Box,
  Github,
  ArrowRight,
  Copy,
  Check,
  Code2,
  Rocket,
  Menu,
  X,
  Square,
  Pentagon,
  Braces,
  Database,
  FileCode,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react'

/**
 * Xorigo UI 主页 - 稳定优秀版
 * 基于 stable-excellent 页面的优化版本，作为新的主页展示
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

// 页面加载动画 - 使用 XorigoLogoLoader
const PageLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // 使用预设时间让 XorigoLogoLoader 完成动画
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 2500) // 与 XorigoLogoLoader 的默认 duration 2000ms + 缓冲时间匹配

    return () => clearTimeout(timer)
  }, [])

  if (isLoaded) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <XorigoLogoLoader
        variant="enhanced"
        size="xl"
        duration={2000}
        showProgress={true}
        className="scale-110" // 稍微放大以突出品牌效果
      />
    </motion.div>
  )
}

// ✨ 萤火虫粒子系统 - 精致梦幻版
const SuperParticleSystem = () => {
  const [mounted, setMounted] = useState(false)
  const [fireflies, setFireflies] = useState<Array<{
    id: number
    x: number
    y: number
    vx: number
    vy: number
    targetX: number
    targetY: number
    size: number
    baseOpacity: number
    currentOpacity: number
    glowPhase: number
    wanderAngle: number
    wanderSpeed: number
    isAttracted: boolean
    attractionStrength: number
  }>>([])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const mouseVelocity = useVelocity(mouseY)
  const lastMouseTime = useRef(Date.now())
  const isMouseMoving = useRef(false)

  // 获取鼠标当前位置
  const getCurrentMousePos = () => ({
    x: mouseX.get(),
    y: mouseY.get()
  })

  useEffect(() => {
    setMounted(true)

    // 🦋 初始化萤火虫粒子
    const initFireflies = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: 0,
      vy: 0,
      targetX: Math.random() * window.innerWidth,
      targetY: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1.5,
      baseOpacity: Math.random() * 0.3 + 0.2,
      currentOpacity: Math.random() * 0.3 + 0.2,
      glowPhase: Math.random() * Math.PI * 2,
      wanderAngle: Math.random() * Math.PI * 2,
      wanderSpeed: Math.random() * 0.02 + 0.01,
      isAttracted: false,
      attractionStrength: 0
    }))
    setFireflies(initFireflies)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      lastMouseTime.current = Date.now()
      isMouseMoving.current = true
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 持续检测鼠标是否停止移动 - 可靠检测
    const mouseStopChecker = setInterval(() => {
      const timeSinceLastMove = Date.now() - lastMouseTime.current
      if (timeSinceLastMove > 1000) { // 1秒后标记停止
        isMouseMoving.current = false
      }
    }, 200) // 更频繁的检测

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(mouseStopChecker)
    }
  }, [mouseX, mouseY, mouseVelocity])

  // ✨ 萤火虫飞舞动画
  useEffect(() => {
    let animationId: number
    let lastTime = 0
    const targetFPS = 30
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        const mousePos = getCurrentMousePos()

        setFireflies(prev => prev.map(firefly => {
          let {
            x, y, vx, vy, targetX, targetY,
            glowPhase, wanderAngle, wanderSpeed,
            isAttracted, attractionStrength
          } = firefly

          // 🌟 更新闪烁相位
          glowPhase += 0.05

          // 🎯 计算与鼠标的距离
          const dx = mousePos.x - x
          const dy = mousePos.y - y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // 🦋 判断是否应该被吸引 - 修复自动飞走机制
          const shouldBeAttracted = isMouseMoving.current && distance < 300
          const minSafeDistance = 70
          const maxSafeDistance = 120
          const idealDistance = 95

          // 简化响应逻辑，确保状态转换可靠
          if (shouldBeAttracted && !isAttracted) {
            // 开始吸引
            isAttracted = true
            attractionStrength = 0
          } else if (!shouldBeAttracted && isAttracted) {
            // 停止吸引，立即切换到漫游并飞走
            isAttracted = false
            attractionStrength = 0
            // 设置远离鼠标的新目标
            const escapeAngle = Math.atan2(y - mousePos.y, x - mousePos.x)
            const escapeDistance = 300 + Math.random() * 200
            targetX = mousePos.x + Math.cos(escapeAngle) * escapeDistance
            targetY = mousePos.y + Math.sin(escapeAngle) * escapeDistance
          }

          if (isAttracted) {
            // 🧲 明显的吸引效果 - 让萤火虫真正被吸引
            attractionStrength = Math.min(attractionStrength + 0.01, 0.8)

            if (distance > maxSafeDistance) {
              // 在安全距离外，强有力地吸引
              const attractForce = attractionStrength * 0.1
              vx += (dx / distance) * attractForce
              vy += (dy / distance) * attractForce
            } else if (distance < minSafeDistance) {
              // 只在很近时才轻微推开
              const repelForce = (minSafeDistance - distance) / minSafeDistance * 0.05
              vx -= (dx / distance) * repelForce
              vy -= (dy / distance) * repelForce
            } else {
              // 在理想距离范围内，轻微调整保持稳定
              const adjustForce = (distance - idealDistance) / (maxSafeDistance - minSafeDistance) * 0.1
              const targetAngle = Math.atan2(dy, dx) + adjustForce * 0.2

              // 主要靠轨道运动控制位置
              const orbitAngle = Math.atan2(dy, dx) + 0.01
              const orbitRadius = idealDistance + Math.sin(currentTime * 0.001 + firefly.id) * 8
              const orbitX = mousePos.x + Math.cos(orbitAngle) * orbitRadius
              const orbitY = mousePos.y + Math.sin(orbitAngle) * orbitRadius

              const orbitDx = orbitX - x
              const orbitDy = orbitY - y
              const orbitDistance = Math.sqrt(orbitDx * orbitDx + orbitDy * orbitDy)

              if (orbitDistance > 3) {
                vx += (orbitDx / orbitDistance) * 0.04
                vy += (orbitDy / orbitDistance) * 0.04
              }
            }

            // 🌊 极其随机的漂移 - 几乎不直接环绕鼠标
            const randomFactor = Math.random() * 0.8 - 0.4
            const wobble = Math.sin(currentTime * 0.001 + firefly.id) * 1.2
            const driftAngle = Math.atan2(dy, dx) + wobble + randomFactor

            // 极其微弱的向鼠标倾向
            const weakInfluence = 0.003 + Math.random() * 0.002
            vx += Math.cos(driftAngle) * weakInfluence
            vy += Math.sin(driftAngle) * weakInfluence
          } else {
            // 🎲 自然漫游 - 正常漫游，不主动逃离
            attractionStrength = Math.max(attractionStrength - 0.008, 0)

            // 正常随机漫游
            if (Math.random() < 0.02) { // 增加改变目标的频率
              targetX = Math.random() * window.innerWidth
              targetY = Math.random() * window.innerHeight
            }

            const targetDx = targetX - x
            const targetDy = targetY - y
            const targetDistance = Math.sqrt(targetDx * targetDx + targetDy * targetDy)

            if (targetDistance > 5) {
              vx += (targetDx / targetDistance) * wanderSpeed * 1.5 // 增强漫游速度
              vy += (targetDy / targetDistance) * wanderSpeed * 1.5
            }

            // 添加自然的随机漂移，增强动感
            wanderAngle += (Math.random() - 0.5) * 0.15
            vx += Math.cos(wanderAngle) * 0.08
            vy += Math.sin(wanderAngle) * 0.08
          }

          // 💫 应用阻力
          vx *= 0.95
          vy *= 0.95

          // 更新位置
          x += vx
          y += vy

          // 🌍 边界处理 - 严格约束在视窗内，防止横向滚动条
          const margin = 10
          if (x < margin) {
            x = margin
            vx = Math.abs(vx) * 0.5 // 反弹并减速
          } else if (x > window.innerWidth - margin) {
            x = window.innerWidth - margin
            vx = -Math.abs(vx) * 0.5 // 反弹并减速
          }

          if (y < margin) {
            y = margin
            vy = Math.abs(vy) * 0.5 // 反弹并减速
          } else if (y > window.innerHeight - margin) {
            y = window.innerHeight - margin
            vy = -Math.abs(vy) * 0.5 // 反弹并减速
          }

          // ✨ 计算当前透明度（闪烁效果）
          const glowIntensity = Math.sin(glowPhase) * 0.3 + 0.7
          const currentOpacity = firefly.baseOpacity * glowIntensity

          return {
            ...firefly,
            x, y, vx, vy, targetX, targetY,
            glowPhase, wanderAngle, wanderSpeed,
            isAttracted, attractionStrength, currentOpacity
          }
        }))

        lastTime = currentTime
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [mouseX, mouseY])

  if (!mounted) return null

  // ✨ 渲染萤火虫粒子
  const renderFirefly = (firefly: typeof fireflies[0]) => {
    return (
      <div
        key={firefly.id}
        style={{
          position: 'absolute',
          left: firefly.x,
          top: firefly.y,
          width: firefly.size * 2,
          height: firefly.size * 2,
          backgroundColor: '#ffeb3b',
          borderRadius: '50%',
          opacity: firefly.currentOpacity,
          transform: 'translate(-50%, -50%)',
          boxShadow: `
            0 0 ${firefly.size * 8}px rgba(255, 235, 59, ${firefly.currentOpacity}),
            0 0 ${firefly.size * 4}px rgba(255, 235, 59, ${firefly.currentOpacity * 0.6}),
            0 0 ${firefly.size * 2}px rgba(255, 235, 59, ${firefly.currentOpacity * 0.3})
          `,
          filter: 'blur(0.5px)',
          willChange: 'transform, opacity',
          mixBlendMode: 'screen'
        }}
      />
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* ✨ 渲染萤火虫 */}
      {fireflies.map(firefly => renderFirefly(firefly))}
    </div>
  )
}

// 修复版3D组件轮播展示
const Component3DCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const components = [
    { name: 'Button', icon: <Box />, color: 'from-purple-500 to-pink-500', desc: '灵活的按钮组件' },
    { name: 'Card', icon: <Square />, color: 'from-cyan-500 to-blue-500', desc: '优雅的卡片容器' },
    { name: 'Input', icon: <Braces />, color: 'from-yellow-500 to-orange-500', desc: '强大的表单输入' },
    { name: 'Modal', icon: <Pentagon />, color: 'from-green-500 to-teal-500', desc: '流畅的弹窗组件' },
    { name: 'Table', icon: <Database />, color: 'from-indigo-500 to-purple-500', desc: '智能数据表格' },
    { name: 'Form', icon: <FileCode />, color: 'from-pink-500 to-rose-500', desc: '完整的表单方案' }
  ]

  // 自动轮播效果 - 简化版
  useEffect(() => {
    if (isHovering) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % components.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [isHovering, components.length])

  // 导航函数 - 简化版
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + components.length) % components.length)
  }, [components.length])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % components.length)
  }, [components.length])

  return (
    <div
      className="relative h-[450px] flex items-center justify-center"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 3D轮播容器 */}
      <div className="relative w-full h-full max-w-6xl">
        {components.map((component, index) => {
          const offset = index - activeIndex
          const absOffset = Math.abs(offset)
          const isActive = offset === 0

          return (
            <motion.div
              key={component.name}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                x: `${offset * 120}px`,
                z: isActive ? 0 : -absOffset * 150,
                rotateY: offset * -25,
                opacity: absOffset > 2 ? 0 : isActive ? 1 : 0.5,
                scale: isActive ? 1.1 : 0.8,
              }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 25,
                duration: 0.5
              }}
              style={{
                transformStyle: 'preserve-3d',
                zIndex: isActive ? 30 : 20 - absOffset * 2
              }}
            >
              <motion.div
                className={`relative w-72 h-96 rounded-3xl bg-gradient-to-br ${component.color} p-[3px] cursor-pointer ${
                  isActive ? 'shadow-2xl' : 'shadow-lg'
                }`}
                whileHover={{
                  scale: isActive ? 1.08 : 1.03,
                  rotateY: 5,
                }}
                onClick={() => setActiveIndex(index)}
                style={{
                  boxShadow: isActive
                    ? '0 25px 60px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)'
                    : '0 10px 30px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* 卡片内容 */}
                <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 flex flex-col items-center justify-center overflow-hidden"
                     style={{
                       background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)'
                     }}>
                  {/* 顶部装饰光线 */}
                  <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${
                    isActive ? 'via-white/40' : 'via-white/20'
                  } to-transparent`} />

                  {/* 图标 */}
                  <motion.div
                    className={`relative mb-4 ${isActive ? 'p-6' : 'p-4'} bg-white/5 rounded-xl backdrop-blur-sm`}
                    animate={{
                      rotateY: isActive ? [0, 360] : 0,
                      scale: isActive ? [1, 1.1, 1] : 1
                    }}
                    transition={{
                      rotateY: {
                        duration: 3,
                        ease: "linear",
                        repeat: isActive ? Infinity : 0
                      }
                    }}
                  >
                    {React.cloneElement(component.icon as React.ReactElement, {
                      className: `${isActive ? 'w-16 h-16' : 'w-12 h-12'} text-white drop-shadow-lg`
                    })}
                  </motion.div>

                  {/* 组件名称 */}
                  <motion.h3
                    className={`${isActive ? 'text-2xl' : 'text-lg'} font-bold text-white mb-2`}
                  >
                    {component.name}
                  </motion.h3>

                  {/* 描述文字 */}
                  <p className={`text-center ${isActive ? 'text-sm text-gray-300' : 'text-xs text-gray-500'}`}>
                    {component.desc}
                  </p>

                  {/* 底部标签 */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-4 left-1/2 -translate-x-1/2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <span className="text-xs text-white font-medium">当前选中</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* 控制点 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-sm px-4 py-3 rounded-full border border-white/10 z-10">
        {components.map((component, index) => {
          const isActive = index === activeIndex
          return (
            <motion.button
              key={index}
              className={`relative rounded-full transition-all ${
                isActive
                  ? 'w-8 h-2 bg-gradient-to-r from-purple-500 to-cyan-500'
                  : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
              }`}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white"
                  style={{ opacity: 0.3 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* 左右切换按钮 */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <motion.button
          className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-purple-500/40 transition-all"
          onClick={handlePrev}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
        </motion.button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
        <motion.button
          className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-purple-500/40 transition-all"
          onClick={handleNext}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}

// 🌌 全屏流动背景系统 - 重新设计版
const FluidBackground = () => {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.01)
    }, 40)
    return () => clearInterval(interval)
  }, [])

  // 更明显的流动效果参数
  const breathScale = 1 + Math.sin(time * 0.6) * 0.08 // 增强呼吸幅度

  // 全屏流动光点 - 重新设计位置和颜色
  const flowingPoints = [
    {
      x: 20 + Math.sin(time * 0.4) * 40, // 20% ± 40%
      y: 30 + Math.cos(time * 0.5) * 30, // 30% ± 30%
      size: 400 + Math.sin(time * 0.8) * 200, // 400px ± 200px
      color: 'rgba(139, 92, 246, 0.15)', // 紫色，更明显
      blendMode: 'screen'
    },
    {
      x: 80 + Math.cos(time * 0.6) * 30, // 80% ± 30%
      y: 20 + Math.sin(time * 0.4) * 40, // 20% ± 40%
      size: 350 + Math.cos(time * 0.7) * 150, // 350px ± 150px
      color: 'rgba(6, 182, 212, 0.12)', // 青色
      blendMode: 'screen'
    },
    {
      x: 50 + Math.sin(time * 0.3) * 50, // 50% ± 50%
      y: 70 + Math.cos(time * 0.5) * 20, // 70% ± 20%
      size: 450 + Math.sin(time * 0.9) * 100, // 450px ± 100px
      color: 'rgba(236, 72, 153, 0.10)', // 粉色
      blendMode: 'screen'
    },
    {
      x: 15 + Math.cos(time * 0.7) * 15, // 15% ± 15%
      y: 60 + Math.sin(time * 0.4) * 25, // 60% ± 25%
      size: 300 + Math.cos(time * 0.6) * 100, // 300px ± 100px
      color: 'rgba(251, 146, 60, 0.08)', // 橙色
      blendMode: 'screen'
    },
    {
      x: 85 + Math.sin(time * 0.5) * 25, // 85% ± 25%
      y: 50 + Math.cos(time * 0.3) * 35, // 50% ± 35%
      size: 380 + Math.sin(time * 0.8) * 120, // 380px ± 120px
      color: 'rgba(163, 230, 53, 0.09)', // 绿色
      blendMode: 'screen'
    }
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* 基础暗色背景 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(${135 + Math.sin(time * 0.2) * 10}deg,
            #000000 0%,
            #0a0a1a 30%,
            #1a1a2e 60%,
            #0a0a1a 100%)
          `
        }}
      />

      {/* 流动光点系统 */}
      {flowingPoints.map((point, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: `${point.size}px`,
            height: `${point.size}px`,
            background: `radial-gradient(circle, ${point.color} 0%, transparent 70%)`,
            mixBlendMode: point.blendMode,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(2px)',
            scale: breathScale
          }}
        />
      ))}

      {/* 网格装饰线 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.5
        }}
      />

      {/* 额外的小光点装饰 */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={`decor-${i}`}
          className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 3) * 25}%`,
            opacity: 0.3 + Math.sin(time + i) * 0.2
          }}
        />
      ))}
    </div>
  )
}

// 增强代码编辑器组件
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
      className="relative bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95 rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/10"
    >
      {/* 顶部光晕效果 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* 编辑器头部 - 增强设计 */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-black/60 backdrop-blur-sm border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          {/* macOS 风格按钮 */}
          <div className="flex gap-2">
            <motion.div
              className="w-3 h-3 bg-red-500 rounded-full cursor-pointer"
              whileHover={{ scale: 1.2, boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)' }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.div
              className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer"
              whileHover={{ scale: 1.2, boxShadow: '0 0 8px rgba(234, 179, 8, 0.6)' }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.div
              className="w-3 h-3 bg-green-500 rounded-full cursor-pointer"
              whileHover={{ scale: 1.2, boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)' }}
              whileTap={{ scale: 0.9 }}
            />
          </div>

          {/* 文件名标签 */}
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 rounded-md border border-purple-500/20">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-gray-300 text-sm font-medium">App.tsx</span>
          </div>
        </div>

        {/* 复制按钮 - 增强交互 */}
        <motion.button
          onClick={handleCopy}
          className="group relative px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-400/50 rounded-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="text-green-400"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-gray-400 group-hover:text-purple-400 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="text-xs text-gray-400 group-hover:text-purple-400 transition-colors">
              {copied ? '已复制' : '复制'}
            </span>
          </div>
        </motion.button>
      </div>

      {/* 代码内容区域 - 左对齐标准格式 */}
      <div className="relative">
        {/* 行号列 */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-black/40 border-r border-purple-500/10 flex flex-col py-6 text-right pr-3">
          {code.split('\n').map((_, i) => (
            <span key={i} className="text-xs text-gray-600 leading-6 font-mono">
              {i + 1}
            </span>
          ))}
        </div>

        {/* 代码内容 - 左对齐，无居中 */}
        <pre className="pl-16 pr-6 py-6 text-sm overflow-x-auto text-left">
          <code className="text-gray-300 font-mono leading-6 whitespace-pre">{code}</code>
        </pre>
      </div>

      {/* 装饰性光效 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  )
}

// 统计数字滚动动画
const CounterAnimation = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1, // 当元素10%进入视窗时就触发 - 更早触发
    margin: "-200px 0px" // 提前200px触发 - 更明显的提前量
  })

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

// 导航栏已移至全局布局，无需在此重复定义

// 主组件
export default function Home() {
  const { scrollY, scrollYProgress } = useScroll()
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5], [1, 0.6])

  // 优化滚动衔接动画
  const heroOpacity = useTransform(scrollY, [0, 300, 600], [1, 0.8, 0])
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95])
  const heroY = useTransform(scrollY, [0, 500], [0, -100])
  const codeEditorOpacity = useTransform(scrollY, [0, 200, 400], [1, 0.8, 0])
  const codeEditorY = useTransform(scrollY, [0, 300], [0, -50])

  // 第二屏进入动画
  const carouselOpacity = useTransform(scrollY, [300, 600, 800], [0, 0.8, 1])
  const carouselY = useTransform(scrollY, [300, 600], [100, 0])
  const sectionTitleOpacity = useTransform(scrollY, [200, 500, 700], [0, 0.8, 1])
  const sectionTitleY = useTransform(scrollY, [200, 500], [50, 0])

  const stats = [
    { label: '组件', value: 50, suffix: '+', icon: <Box /> },
    { label: '主题', value: 20, suffix: '+', icon: <Palette /> },
    { label: 'TypeScript', value: 100, suffix: '%', icon: <Code2 /> },
    { label: '性能提升', value: 50, suffix: '%', icon: <Zap /> }
  ]

  const [soundEnabled, setSoundEnabled] = useState(false)

  // ✨ 点击涟漪效果组件
  const ClickRipple = () => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
    const rippleIdRef = useRef(0)

    useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        const newRipple = {
          id: rippleIdRef.current++,
          x: e.clientX,
          y: e.clientY
        }
        setRipples(prev => [...prev, newRipple])

        // 800ms后自动移除涟漪
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id))
        }, 800)
      }

      window.addEventListener('mousedown', handleClick)
      return () => window.removeEventListener('mousedown', handleClick)
    }, [])

    return (
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              className="absolute"
              style={{
                left: ripple.x,
                top: ripple.y,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{
                scale: [0, 3, 5],
                opacity: [0.8, 0.3, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut"
              }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-purple-400" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

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
        <ClickRipple />

        {/* Hero Section增强版 - 优化滚动衔接，向上提内容 */}
        <section className="relative min-h-screen flex items-start justify-center px-6 pt-24">
          <motion.div
            className="max-w-7xl mx-auto w-full"
            style={{
              scale: heroScale,
              opacity: heroOpacity,
              y: heroY
            }}
          >
            <div className="text-center">
              {/* 声音控制 */}
              <motion.button
                className="fixed bottom-4 right-4 z-50 bg-purple-500/20 backdrop-blur-sm border border-purple-500/50 text-purple-400 p-3 rounded-full"
                onClick={() => setSoundEnabled(!soundEnabled)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ opacity: heroOpacity }}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </motion.button>

              {/* 标题超级动画 - 流动渐变光影 */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* 增加容器高度，防止下降字符被剪裁 */}
                <div className="relative px-6 py-6 overflow-visible">
                  <motion.h1
                    className="text-7xl md:text-8xl lg:text-9xl font-bold mb-12 leading-relaxed"
                    style={{
                      perspective: '1000px',
                      lineHeight: '1.3'
                    }}
                  >
                    <motion.span
                      className="inline-block relative pb-4"
                      animate={{
                        rotateX: [0, 3, 0, -3, 0],
                      }}
                      transition={{
                        rotateX: {
                          duration: 10,
                          ease: 'easeInOut',
                          repeat: Infinity,
                        }
                      }}
                    >
                      {/* 基础渐变文字层 - 无缝循环流动 */}
                      <motion.div
                        className="relative"
                        style={{
                          background: 'linear-gradient(110deg, #a855f7 0%, #ec4899 12.5%, #06b6d4 25%, #10b981 37.5%, #f59e0b 50%, #ec4899 62.5%, #a855f7 75%, #06b6d4 87.5%, #a855f7 100%)',
                          backgroundSize: '400% 100%',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }}
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '200% 50%', '300% 50%', '400% 50%'],
                        }}
                        transition={{
                          duration: 25,
                          ease: 'linear',
                          repeat: Infinity,
                        }}
                      >
                        Xorigo UI
                      </motion.div>

                      {/* 光影流动效果层 1 - 主光束（减慢速度） */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)',
                          backgroundSize: '200% 100%',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                          mixBlendMode: 'overlay',
                        }}
                        animate={{
                          backgroundPosition: ['-200% 0%', '200% 0%']
                        }}
                        transition={{
                          duration: 4, // 减慢：2.5s → 4s
                          ease: 'easeInOut',
                          repeat: Infinity,
                          repeatDelay: 1.5 // 增加间隔：0.8s → 1.5s
                        }}
                      >
                        Xorigo UI
                      </motion.div>

                      {/* 光影流动效果层 2 - 副光束（反向，更慢） */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.4) 50%, transparent 100%)',
                          backgroundSize: '150% 100%',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                          mixBlendMode: 'screen',
                        }}
                        animate={{
                          backgroundPosition: ['200% 0%', '-200% 0%']
                        }}
                        transition={{
                          duration: 6, // 减慢：4s → 6s
                          ease: 'easeInOut',
                          repeat: Infinity,
                          repeatDelay: 1 // 增加间隔：0.3s → 1s
                        }}
                      >
                        Xorigo UI
                      </motion.div>

                      {/* 脉冲光晕效果（更慢呼吸） */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                          mixBlendMode: 'color-dodge',
                        }}
                        animate={{
                          opacity: [0.3, 0.7, 0.3], // 降低峰值：0.8 → 0.7
                        }}
                        transition={{
                          duration: 5, // 减慢：3s → 5s
                          ease: 'easeInOut',
                          repeat: Infinity,
                        }}
                      >
                        Xorigo UI
                      </motion.div>
                    </motion.span>
                  </motion.h1>
                </div>

                <motion.p
                  className="text-3xl text-gray-300 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }} // 更快出现
                >
                  下一代 React 组件库
                </motion.p>

                <motion.p
                  className="text-xl text-gray-500 mb-12 max-w-3xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }} // 更快出现
                >
                  由 Saken 与 AI 协作打造，为现代 Web 应用提供极致的开发体验
                </motion.p>

                {/* CTA按钮组 */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }} // 更快出现
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

              {/* 代码编辑器展示 - 左右布局 */}
              <motion.div
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                style={{
                  opacity: codeEditorOpacity,
                  y: codeEditorY
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 左侧：代码编辑器 */}
                  <CodeEditor />

                  {/* 右侧：实时预览 */}
                  <motion.div
                    className="relative bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 p-8"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3, duration: 0.6 }}
                  >
                    {/* 顶部光晕 */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                    {/* 预览标题 */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      <span className="text-gray-300 text-sm font-medium">实时预览</span>
                    </div>

                    {/* 预览内容 */}
                    <motion.div
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <h1 className="text-2xl font-bold text-white mb-4">欢迎使用 Xorigo UI</h1>
                      <motion.button
                        className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg"
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10">开始构建</span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500"
                          initial={{ x: '100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                    </motion.div>

                    {/* 装饰光效 */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* 3D组件展示 - 优化滚动衔接，避免导航条重叠 */}
        <section className="py-8 px-6 pt-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              style={{
                opacity: sectionTitleOpacity,
                y: sectionTitleY
              }}
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

            <motion.div
              style={{
                opacity: carouselOpacity,
                y: carouselY
              }}
            >
              <Component3DCarousel />
            </motion.div>
          </div>
        </section>

        {/* 统计数据 - 完全重构版本 */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* 简单直接的统计卡片实现 */}
              <div className="text-center opacity-100 scale-100 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Box className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <div className="text-gray-400">组件</div>
              </div>

              <div className="text-center opacity-100 scale-100 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  20+
                </div>
                <div className="text-gray-400">主题</div>
              </div>

              <div className="text-center opacity-100 scale-100 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Code2 className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-gray-400">TypeScript</div>
              </div>

              <div className="text-center opacity-100 scale-100 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  50%
                </div>
                <div className="text-gray-400">性能提升</div>
              </div>
            </div>
          </div>
        </section>

        {/* 页脚由全局布局提供，无需在这里重复添加 */}
      </motion.div>
    </AnimatePresence>
  )
}