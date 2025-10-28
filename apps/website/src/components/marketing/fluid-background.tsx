'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'

/**
 * 🚀 性能优化版 FluidBackground
 *
 * 优化特性：
 * - 减少更新频率 (40ms -> 60ms)
 * - 简化动画计算
 * - 使用 useMemo 缓存计算结果
 * - 移除不必要的导入
 */
const FluidBackground = () => {
  const [time, setTime] = useState(0)
  const animationRef = useRef<number>()
  const lastTimeRef = useRef(0)

  // 🚀 性能优化：降低更新频率
  useEffect(() => {
    const targetFPS = 16 // ~60ms 帧间隔
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTimeRef.current >= frameInterval) {
        lastTimeRef.current = currentTime
        setTime(prev => prev + 0.015) // 减少增量
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // 🚀 性能优化：缓存计算结果
  const animatedElements = useMemo(() => {
    const breathScale = 1 + Math.sin(time * 0.4) * 0.06 // 减少呼吸幅度

    // 🚀 简化的流动光点 - 减少数量和复杂度
    const flowingPoints = [
      {
        x: 30 + Math.sin(time * 0.3) * 12,
        y: 30 + Math.cos(time * 0.4) * 12,
        size: 180 + Math.sin(time * 0.6) * 60,
        color: 'rgba(139, 92, 246, 0.10)',
      },
      {
        x: 70 + Math.cos(time * 0.5) * 12,
        y: 20 + Math.sin(time * 0.3) * 8,
        size: 160 + Math.cos(time * 0.6) * 50,
        color: 'rgba(6, 182, 212, 0.08)',
      },
      {
        x: 50 + Math.sin(time * 0.2) * 15,
        y: 70 + Math.cos(time * 0.4) * 8,
        size: 200 + Math.sin(time * 0.7) * 40,
        color: 'rgba(236, 72, 153, 0.06)',
      }
    ]

    return { breathScale, flowingPoints }
  }, [time])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* 🚀 简化的基础背景 */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${135 + Math.sin(time * 0.15) * 8}deg, #000000 0%, #0a0a1a 50%, #000000 100%)`
        }}
      />

      {/* 🚀 简化的流动光点系统 */}
      {animatedElements.flowingPoints.map((point, index) => (
        <div
          key={index}
          className="absolute rounded-full"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: `${point.size}px`,
            height: `${point.size}px`,
            background: `radial-gradient(circle, ${point.color} 0%, transparent 70%)`,
            mixBlendMode: 'screen',
            transform: `translate(-50%, -50%) scale(${animatedElements.breathScale})`,
            filter: 'blur(1.5px)', // 减少模糊
          }}
        />
      ))}

      {/* 🚀 简化的网格装饰 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px', // 增大网格尺寸
          opacity: 0.3 // 降低透明度
        }}
      />
    </div>
  )
}


export { FluidBackground }
