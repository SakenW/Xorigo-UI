'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XorigoLogoLoader } from '@xorigo-ui/core'
import {
  Box, Square, Pentagon, Braces, Database, FileCode,
  ArrowRight, Navigation, Layout, BarChart, FileText,
  Loader2, Zap, Copy, Check
} from 'lucide-react'

// 🎯 动画配置
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const createWillChange = (properties: string[]) => ({
  willChange: properties.join(', ')
})

const createRandomizedAnimation = (baseDuration: number, variance: number = 0.2, index: number = 0) => {
  const seedRandom = (index: number) => {
    const x = Math.sin(index) * 10000
    return x - Math.floor(x)
  }

  const randomOffset = seedRandom(index) * variance
  const randomDelay = seedRandom(index + 100) * 0.5

  return {
    duration: baseDuration + randomOffset,
    ease: [0.4, 0, 0.6, 1] as const,
    repeat: Infinity,
    delay: randomDelay
  }
}

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

  // 全屏流动光点 - 修复横向溢出问题，减小尺寸确保完全在视口内
  const flowingPoints = [
    {
      x: 30 + Math.sin(time * 0.4) * 15, // 30% ± 15% (范围: 15%-45%)
      y: 30 + Math.cos(time * 0.5) * 15, // 30% ± 15% (范围: 15%-45%)
      size: 200 + Math.sin(time * 0.8) * 80, // 200px ± 80px (范围: 120px-280px)
      color: 'rgba(139, 92, 246, 0.12)', // 紫色，稍微降低透明度
      blendMode: 'screen'
    },
    {
      x: 70 + Math.cos(time * 0.6) * 15, // 70% ± 15% (范围: 55%-85%)
      y: 20 + Math.sin(time * 0.4) * 10, // 20% ± 10% (范围: 10%-30%)
      size: 180 + Math.cos(time * 0.7) * 60, // 180px ± 60px (范围: 120px-240px)
      color: 'rgba(6, 182, 212, 0.10)', // 青色
      blendMode: 'screen'
    },
    {
      x: 50 + Math.sin(time * 0.3) * 20, // 50% ± 20% (范围: 30%-70%)
      y: 70 + Math.cos(time * 0.5) * 10, // 70% ± 10% (范围: 60%-80%)
      size: 220 + Math.sin(time * 0.9) * 50, // 220px ± 50px (范围: 170px-270px)
      color: 'rgba(236, 72, 153, 0.08)', // 粉色
      blendMode: 'screen'
    },
    {
      x: 25 + Math.cos(time * 0.7) * 10, // 25% ± 10% (范围: 15%-35%)
      y: 60 + Math.sin(time * 0.4) * 15, // 60% ± 15% (范围: 45%-75%)
      size: 160 + Math.cos(time * 0.6) * 50, // 160px ± 50px (范围: 110px-210px)
      color: 'rgba(251, 146, 60, 0.06)', // 橙色
      blendMode: 'screen'
    },
    {
      x: 75 + Math.sin(time * 0.5) * 15, // 75% ± 15% (范围: 60%-90%)
      y: 50 + Math.cos(time * 0.3) * 20, // 50% ± 20% (范围: 30%-70%)
      size: 190 + Math.sin(time * 0.8) * 60, // 190px ± 60px (范围: 130px-250px)
      color: 'rgba(163, 230, 53, 0.07)', // 绿色
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
          className="absolute w-1 h-1 bg-[var(--color-primary-400)]/20 rounded-full"
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


export { FluidBackground }
