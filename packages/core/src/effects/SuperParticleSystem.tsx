'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useMotionValue, useVelocity } from 'framer-motion'

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
          backgroundColor: 'var(--color-warning-400)',
          borderRadius: '50%',
          opacity: firefly.currentOpacity,
          transform: 'translate(-50%, -50%)',
          boxShadow: `
            0 0 ${firefly.size * 8}px var(--color-warning-400),
            0 0 ${firefly.size * 4}px var(--color-warning-300),
            0 0 ${firefly.size * 2}px var(--color-warning-200)
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

export { SuperParticleSystem }
export default SuperParticleSystem