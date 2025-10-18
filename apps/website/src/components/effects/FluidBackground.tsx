'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * FluidBackground - 全屏流动背景系统
 *
 * 创建一个动态的、流动的背景效果，包含：
 * - 动态渐变背景
 * - 5个流动光点，具有不同的颜色和运动轨迹
 * - 呼吸缩放效果
 * - 网格装饰线
 * - 小光点装饰
 */
const FluidBackground: React.FC = () => {
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
      blendMode: 'screen' as const
    },
    {
      x: 80 + Math.cos(time * 0.6) * 30, // 80% ± 30%
      y: 20 + Math.sin(time * 0.4) * 40, // 20% ± 40%
      size: 350 + Math.cos(time * 0.7) * 150, // 350px ± 150px
      color: 'rgba(6, 182, 212, 0.12)', // 青色
      blendMode: 'screen' as const
    },
    {
      x: 50 + Math.sin(time * 0.3) * 50, // 50% ± 50%
      y: 70 + Math.cos(time * 0.5) * 20, // 70% ± 20%
      size: 450 + Math.sin(time * 0.9) * 100, // 450px ± 100px
      color: 'rgba(236, 72, 153, 0.10)', // 粉色
      blendMode: 'screen' as const
    },
    {
      x: 15 + Math.cos(time * 0.7) * 15, // 15% ± 15%
      y: 60 + Math.sin(time * 0.4) * 25, // 60% ± 25%
      size: 300 + Math.cos(time * 0.6) * 100, // 300px ± 100px
      color: 'rgba(251, 146, 60, 0.08)', // 橙色
      blendMode: 'screen' as const
    },
    {
      x: 85 + Math.sin(time * 0.5) * 25, // 85% ± 25%
      y: 50 + Math.cos(time * 0.3) * 35, // 50% ± 35%
      size: 380 + Math.sin(time * 0.8) * 120, // 380px ± 120px
      color: 'rgba(163, 230, 53, 0.09)', // 绿色
      blendMode: 'screen' as const
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

export { FluidBackground }