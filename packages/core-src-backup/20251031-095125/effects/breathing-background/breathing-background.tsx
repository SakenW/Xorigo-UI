'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export interface BreathingBackgroundProps {
  className?: string
  enableMouseInteraction?: boolean
  breathingDuration?: number
  floatingDuration?: number
  bubbleCount?: number
  primaryColor?: string
  secondaryColor?: string
  tertiaryColor?: string
  minBubbleSize?: number
  maxBubbleSize?: number
}

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  color: string
  animationDuration: number
  delay: number
  moveX: number
  moveY: number
  rotateSpeed: number
}

/**
 * BreathingBackground - 呼吸感飘动的背景效果
 *
 * 多个彩色气泡缓慢飘动，具有呼吸感和优雅的动画效果
 * 支持鼠标交互，气泡会对鼠标做出反应
 * 主题感知，颜色会随主题变化
 */
export const BreathingBackground: React.FC<BreathingBackgroundProps> = ({
  className = '',
  enableMouseInteraction = true,
  breathingDuration = 4,
  floatingDuration = 20,
  bubbleCount = 8,
  primaryColor = 'var(--color-primary-500)',
  secondaryColor = 'var(--color-accent-500)',
  tertiaryColor = 'var(--color-secondary-500)',
  minBubbleSize = 60,
  maxBubbleSize = 200
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // 生成初始气泡
  useEffect(() => {
    const colors = [primaryColor, secondaryColor, tertiaryColor]
    const generatedBubbles: Bubble[] = []

    for (let i = 0; i < bubbleCount; i++) {
      generatedBubbles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: minBubbleSize + Math.random() * (maxBubbleSize - minBubbleSize),
        color: colors[Math.floor(Math.random() * colors.length)],
        animationDuration: floatingDuration + Math.random() * 15,
        delay: Math.random() * 8,
        moveX: (Math.random() - 0.5) * 80, // -40% 到 +40% 的水平移动范围
        moveY: (Math.random() - 0.5) * 60, // -30% 到 +30% 的垂直移动范围
        rotateSpeed: Math.random() * 360 - 180 // -180 到 +180 度的旋转
      })
    }

    setBubbles(generatedBubbles)
  }, [bubbleCount, minBubbleSize, maxBubbleSize, floatingDuration, primaryColor, secondaryColor, tertiaryColor])

  // 鼠标交互
  useEffect(() => {
    if (!enableMouseInteraction) return

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [enableMouseInteraction])

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* 呼吸感背景光晕 - 增强效果 */}
      <motion.div
        className="absolute inset-0 opacity-25"
        animate={{
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: breathingDuration * 0.7, // 缩短周期
          ease: "easeInOut",
          repeat: Infinity
        }}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${primaryColor}22 0%, transparent 50%)`
        }}
      />

      {/* 次要呼吸光晕 - 增强透明度和动画 */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 opacity-20"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: breathingDuration,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 0.5
        }}
        style={{
          background: `radial-gradient(circle, ${secondaryColor}25 0%, transparent 70%)`
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: breathingDuration * 1.2,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 1
        }}
        style={{
          background: `radial-gradient(circle, ${tertiaryColor}20 0%, transparent 60%)`
        }}
      />

      {/* 飘动气泡 - 随机缓慢自然浮动 */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full blur-2xl opacity-15"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            backgroundColor: bubble.color,
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            // 随机缓慢的椭圆形移动路径 - 增强幅度
            x: [
              0,
              bubble.moveX * 0.4,
              bubble.moveX * 0.8,
              bubble.moveX,
              bubble.moveX * 0.6,
              bubble.moveX * 0.2,
              0
            ],
            y: [
              0,
              bubble.moveY * 0.5,
              bubble.moveY * 0.9,
              bubble.moveY,
              bubble.moveY * 0.7,
              bubble.moveY * 0.3,
              0
            ],
            // 增强的呼吸缩放
            scale: [1, 1.08 + Math.sin(Date.now() / 1000 / breathingDuration) * 0.05, 1],
            // 更明显的旋转
            rotate: [0, bubble.rotateSpeed * 0.3, bubble.rotateSpeed * 0.7, bubble.rotateSpeed],
          }}
          transition={{
            duration: bubble.animationDuration * 0.6, // 缩短周期，让动画更快
            ease: [0.4, 0, 0.6, 1], // 自定义贝塞尔曲线，更自然的运动
            repeat: Infinity,
            delay: bubble.delay,
            times: [0, 0.17, 0.33, 0.5, 0.67, 0.83, 1] // 关键帧时间点
          }}
        />
      ))}

      {/* 渐变层叠效果 - 增强效果 */}
      <div
        className="absolute inset-0 opacity-35"
        style={{
          background: `
            linear-gradient(135deg, ${primaryColor}15 0%, transparent 25%),
            linear-gradient(225deg, ${secondaryColor}15 0%, transparent 25%),
            linear-gradient(315deg, ${tertiaryColor}15 0%, transparent 25%)
          `
        }}
      />
    </div>
  )
}

export default BreathingBackground