'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useMotionValue } from 'framer-motion'

export interface SuperParticleSystemProps {
  count?: number
  colorVar200?: string
  colorVar300?: string
  colorVar400?: string
  className?: string
}

/**
 * 超级粒子系统组件 - 萤火虫效果
 *
 * 支持鼠标交互的梦幻粒子效果，萤火虫会被鼠标吸引并产生动态光效
 */
export const SuperParticleSystem: React.FC<SuperParticleSystemProps> = ({
  count = 20,
  colorVar200 = '#fef3c7',
  colorVar300 = '#fde68a',
  colorVar400 = '#fbbf24',
  className = ''
}) => {
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

  const [safeDimensions, setSafeDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? Math.min(window.innerWidth, 1000) : 1000,
    height: typeof window !== 'undefined' ? Math.min(window.innerHeight, 800) : 800
  }))

  // 🚀 性能优化：使用 useMemo 缓存计算结果
  const stableSafeDimensions = useMemo(() => safeDimensions, [safeDimensions.width, safeDimensions.height])

  // 🚀 性能优化：减少 Framer Motion hooks 的使用
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const lastMouseTime = useRef(Date.now())
  const isMouseMoving = useRef(false)
  const animationFrameRef = useRef<number>()
  const lastUpdateTime = useRef(0)

  // 🚀 性能优化：缓存鼠标位置计算
  const getCurrentMousePos = useCallback(() => ({
    x: mouseX.get(),
    y: mouseY.get()
  }), [mouseX, mouseY])

  useEffect(() => {
    setMounted(true)

    // 🦋 初始化萤火虫粒子 - 使用更安全的边界计算
    const safeWidth = stableSafeDimensions.width
    const safeHeight = stableSafeDimensions.height

    const initFireflies = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * safeWidth,
      y: Math.random() * safeHeight,
      vx: 0,
      vy: 0,
      targetX: Math.random() * safeWidth,
      targetY: Math.random() * safeHeight,
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

    const handleResize = () => {
      const newSafeWidth = Math.min(window.innerWidth, document.documentElement.clientWidth)
      const newSafeHeight = Math.min(window.innerHeight, document.documentElement.clientHeight)
      setSafeDimensions({ width: newSafeWidth, height: newSafeHeight })

      // 重新定位超出边界的萤火虫
      setFireflies(prev => prev.map(firefly => {
        let { x, y } = firefly
        const margin = 20

        if (x > newSafeWidth - margin) x = newSafeWidth - margin
        if (y > newSafeHeight - margin) y = newSafeHeight - margin

        return { ...firefly, x, y }
      }))
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    // 持续检测鼠标是否停止移动 - 可靠检测
    const mouseStopChecker = setInterval(() => {
      const timeSinceLastMove = Date.now() - lastMouseTime.current
      if (timeSinceLastMove > 1000) { // 1秒后标记停止
        isMouseMoving.current = false
      }
    }, 200) // 更频繁的检测

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      clearInterval(mouseStopChecker)
    }
  }, [mouseX, mouseY, mouseVelocity, count, stableSafeDimensions])

  // 🚀 性能优化：简化高效的动画循环
  useEffect(() => {
    if (!mounted) return

    const targetFPS = count > 25 ? 15 : 25 // 🚀 进一步降低FPS
    const frameInterval = 1000 / targetFPS
    let animationId: number

    const animate = (currentTime: number) => {
      if (currentTime - lastUpdateTime.current >= frameInterval) {
        lastUpdateTime.current = currentTime
        const mousePos = getCurrentMousePos()

        setFireflies(prev => prev.map(firefly => {
          let { x, y, vx, vy, targetX, targetY, glowPhase, wanderAngle, wanderSpeed, isAttracted } = firefly

          // 🚀 简化更新逻辑
          glowPhase += 0.03 // 减少更新频率

          // 🎯 优化距离计算
          const dx = mousePos.x - x
          const dy = mousePos.y - y
          const distanceSq = dx * dx + dy * dy // 使用平方距离避免开方
          const attractDistanceSq = 200 * 200 // 200px 的平方

          // 🚀 简化吸引逻辑
          const shouldBeAttracted = isMouseMoving.current && distanceSq < attractDistanceSq

          if (shouldBeAttracted && !isAttracted) {
            isAttracted = true
          } else if (!shouldBeAttracted && isAttracted) {
            isAttracted = false
            // 设置新的随机目标
            targetX = Math.random() * stableSafeDimensions.width
            targetY = Math.random() * stableSafeDimensions.height
          }

          if (isAttracted && distanceSq > 0) {
            // 🚀 简化的吸引算法
            const attractForce = 0.05
            const distance = Math.sqrt(distanceSq)
            vx += (dx / distance) * attractForce
            vy += (dy / distance) * attractForce
          } else {
            // 🚀 简化的漫游逻辑
            if (Math.random() < 0.02) { // 降低更新频率
              targetX = Math.random() * stableSafeDimensions.width
              targetY = Math.random() * stableSafeDimensions.height
            }

            const tdx = targetX - x
            const tdy = targetY - y
            vx += tdx * 0.001
            vy += tdy * 0.001
          }

          // 🚀 应用阻尼和速度限制
          vx *= 0.95
          vy *= 0.95
          const maxSpeed = 2
          const speed = Math.sqrt(vx * vx + vy * vy)
          if (speed > maxSpeed) {
            vx = (vx / speed) * maxSpeed
            vy = (vy / speed) * maxSpeed
          }

          // 更新位置
          x += vx
          y += vy

          // 🚀 简化的边界处理
          const margin = 50
          if (x < margin || x > stableSafeDimensions.width - margin) {
            vx = -vx
            x = Math.max(margin, Math.min(stableSafeDimensions.width - margin, x))
          }
          if (y < margin || y > stableSafeDimensions.height - margin) {
            vy = -vy
            y = Math.max(margin, Math.min(stableSafeDimensions.height - margin, y))
          }

          // 🚀 简化的透明度计算
          const currentOpacity = firefly.baseOpacity + Math.sin(glowPhase) * 0.1

          return {
            ...firefly,
            x, y, vx, vy, targetX, targetY,
            glowPhase, currentOpacity, isAttracted
          }
        }))
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [mounted, count, getCurrentMousePos, stableSafeDimensions])

  if (!mounted) return null

  // 🚀 性能优化：简化的渲染函数
  const renderFirefly = React.useMemo(() => (firefly: typeof fireflies[0]) => {
    const opacity = Math.max(0, Math.min(1, firefly.currentOpacity))

    return (
      <div
        key={firefly.id}
        style={{
          position: 'absolute',
          left: firefly.x,
          top: firefly.y,
          width: firefly.size * 2,
          height: firefly.size * 2,
          backgroundColor: colorVar400,
          borderRadius: '50%',
          opacity,
          transform: 'translate(-50%, -50%)',
          // 🚀 简化阴影效果
          boxShadow: `0 0 ${firefly.size * 4}px ${colorVar400}`,
          filter: 'blur(0.5px)',
          mixBlendMode: 'screen'
        }}
      />
    )
  }, [colorVar400])

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      {/* ✨ 渲染萤火虫 */}
      {fireflies.map(firefly => renderFirefly(firefly))}
    </div>
  )
}

SuperParticleSystem.displayName = 'SuperParticleSystem'