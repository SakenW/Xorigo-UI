import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useMotionValue, useVelocity } from 'framer-motion'

/**
 * 简化版萤火虫粒子系统 - 用于调试
 */

interface SimpleFirefly {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

const SuperParticleSystemSimple: React.FC = () => {
  const [mounted, setMounted] = useState(false)

  // 鼠标跟踪
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // 粒子数据
  const firefliesRef = useRef<SimpleFirefly[]>([])
  const elementsRef = useRef<Map<number, HTMLDivElement>>(new Map())

  // 视窗尺寸
  const viewportRef = useRef({ w: 800, h: 600 })

  // 初始化粒子
  const initParticles = () => {
    const { w, h } = viewportRef.current
    const arr: SimpleFirefly[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.3
    }))
    firefliesRef.current = arr
    console.log(`初始化了 ${arr.length} 个萤火虫`)
  }

  useEffect(() => {
    setMounted(true)
    viewportRef.current = { w: window.innerWidth, h: window.innerHeight }
    initParticles()

    const handleMouseMove = (e: PointerEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleResize = () => {
      viewportRef.current = { w: window.innerWidth, h: window.innerHeight }
    }

    window.addEventListener('pointermove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('pointermove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [mouseX, mouseY])

  // 动画循环
  useEffect(() => {
    let raf = 0

    const animate = () => {
      const fireflies = firefliesRef.current
      const { w, h } = viewportRef.current
      const mx = mouseX.get()
      const my = mouseY.get()

      for (let i = 0; i < fireflies.length; i++) {
        const f = fireflies[i]

        // 简单的鼠标吸引力
        const dx = mx - f.x
        const dy = my - f.y
        const dist = Math.hypot(dx, dy)

        if (dist < 200 && dist > 20) {
          // 被鼠标吸引
          f.vx += (dx / dist) * 0.1
          f.vy += (dy / dist) * 0.1
        } else {
          // 随机游走
          f.vx += (Math.random() - 0.5) * 0.2
          f.vy += (Math.random() - 0.5) * 0.2
        }

        // 阻尼
        f.vx *= 0.95
        f.vy *= 0.95

        // 限制速度
        const speed = Math.hypot(f.vx, f.vy)
        if (speed > 5) {
          f.vx = (f.vx / speed) * 5
          f.vy = (f.vy / speed) * 5
        }

        // 更新位置
        f.x += f.vx
        f.y += f.vy

        // 边界检测
        if (f.x < 0) f.x = w
        if (f.x > w) f.x = 0
        if (f.y < 0) f.y = h
        if (f.y > h) f.y = 0

        // 更新DOM
        const el = elementsRef.current.get(f.id)
        if (el) {
          el.style.transform = `translate3d(${f.x}px, ${f.y}px, 0)`
          el.style.opacity = `${f.opacity}`
        }
      }

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [mouseX, mouseY])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden>
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (!el) return
            elementsRef.current.set(i, el)
            el.style.position = 'absolute'
            el.style.left = '0'
            el.style.top = '0'
            el.style.width = '4px'
            el.style.height = '4px'
            el.style.backgroundColor = '#fbbf24' // 硬编码黄色
            el.style.borderRadius = '50%'
            el.style.boxShadow = '0 0 10px #fbbf24, 0 0 20px #f59e0b'
            el.style.filter = 'blur(0.5px)'
            el.style.mixBlendMode = 'screen'
          }}
        />
      ))}
    </div>
  )
}

export { SuperParticleSystemSimple }
export default SuperParticleSystemSimple