import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useMotionValue, useVelocity } from 'framer-motion'

/**
 * 萤火虫粒子系统（高性能版）
 * 关键优化：
 * 1) 粒子数据放入 useRef，使用 requestAnimationFrame 逐帧更新，不触发 React 渲染。
 * 2) 通过元素引用直接设置 style（transform/opacity/boxShadow），避免创建大量对象与 setState diff。
 * 3) 仅首次渲染创建 DOM；后续完全 DOM 直驱。
 */

type FireflyState = 'wandering' | 'attracted' | 'orbiting' | 'escaping'

interface Firefly {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseOpacity: number
  currentOpacity: number
  glowPhase: number
  orbitAngle: number
  orbitRadius: number
  orbitSpeed: number
  state: FireflyState
  stateTimer: number
  escapeAngle: number
  wanderAngle: number
  wanderSpeed: number
  attractionStrength: number
  lastMouseDistance: number
}

interface SuperParticleSystemProps {
  /** 粒子数量（默认 24） */
  count?: number
  /** 目标帧率（默认 60） */
  fps?: number
  /** 吸引半径（默认 250） */
  attractRadius?: number
  /** 进入环绕的阈值（默认 150） */
  orbitEnterDist?: number
  /** 逃逸触发距离（默认 250） */
  orbitExitDist?: number
  /** 环绕半径基础（默认 60） */
  orbitBase?: number
  /** 颜色变量名（CSS 变量），默认 --color-warning-400 系列 */
  colorVar400?: string
  colorVar300?: string
  colorVar200?: string
}

const SuperParticleSystem: React.FC<SuperParticleSystemProps> = ({
  count = 24,
  fps = 60,
  attractRadius = 250,
  orbitEnterDist = 150,
  orbitExitDist = 250,
  orbitBase = 60,
  colorVar400 = 'var(--color-warning-400)',
  colorVar300 = 'var(--color-warning-300)',
  colorVar200 = 'var(--color-warning-200)',
}) => {
  const [mounted, setMounted] = useState(false)

  // 鼠标/指针跟踪（用 framer-motion 的 MotionValue + Velocity 判定是否在动）
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const mouseVY = useVelocity(mouseY)
  const lastMoveTS = useRef<number>(Date.now())
  const isPointerMoving = useRef<boolean>(false)

  // 物理数据与 DOM 引用
  const firefliesRef = useRef<Firefly[]>([])
  const elementsRef = useRef<Map<number, HTMLDivElement>>(new Map())

  // 视窗尺寸
  const viewportRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 })

  // 工具函数：安全随机
  const rand = (min: number, max: number) => Math.random() * (max - min) + min

  // 初始化尺寸
  const readViewport = () => {
    viewportRef.current.w = window.innerWidth
    viewportRef.current.h = window.innerHeight
  }

  // 初始化 fireflies 数据
  const initParticles = (n: number) => {
    const { w, h } = viewportRef.current
    const arr: Firefly[] = Array.from({ length: n }, (_, i) => {
      const size = rand(1, 3.5) // 比原版略扩大一点视觉层次
      const baseOpacity = rand(0.3, 0.7)
      return {
        id: i,
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size,
        baseOpacity,
        currentOpacity: baseOpacity,
        glowPhase: Math.random() * Math.PI * 2,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: 80 + Math.random() * 40,
        orbitSpeed: 0.02 + Math.random() * 0.03,
        state: 'wandering',
        stateTimer: 0,
        escapeAngle: 0,
        wanderAngle: Math.random() * Math.PI * 2,
        wanderSpeed: rand(0.02, 0.05),
        attractionStrength: 0,
        lastMouseDistance: Infinity,
      }
    })
    firefliesRef.current = arr
  }

  // 指针事件（支持鼠标/触屏/笔）
  useEffect(() => {
    setMounted(true)
    readViewport()
    initParticles(count)

    const onPointerMove = (e: PointerEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      lastMoveTS.current = Date.now()
      isPointerMoving.current = true
    }
    const onResize = () => {
      readViewport()
      // 软校正：避免 resize 当帧卡死，轻微拉回边界
      const { w, h } = viewportRef.current
      firefliesRef.current.forEach(f => {
        if (f.x > w - 10) f.x = w - 10
        if (f.y > h - 10) f.y = h - 10
      })
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    // 停止检测：基于时间 + 速度阈值
    const stopTimer = window.setInterval(() => {
      const dt = Date.now() - lastMoveTS.current
      const vy = Math.abs(mouseVY.get() ?? 0)
      // 1) 超过 1.2s 未移动 或 2) 速度极小即视为静止
      isPointerMoving.current = !(dt > 1200 || vy < 0.01)
    }, 180)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)
      window.clearInterval(stopTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  // 预构建节点数组（避免 render 内 map*2 带来的细碎开销）
  const nodes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => i)
  }, [count])

  // 主动画循环（DOM 直驱）
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const frameInterval = 1000 / fps

    const animate = (now: number) => {
      const elapsed = now - last
      if (elapsed >= frameInterval) {
        last = now
        const fx = firefliesRef.current
        const { w, h } = viewportRef.current
        const mx = mouseX.get()
        const my = mouseY.get()
        const moving = isPointerMoving.current

        for (let i = 0; i < fx.length; i++) {
          const f = fx[i]
          // ====== 物理与状态机 ======
          f.glowPhase += 0.06
          f.stateTimer++

          const dx = mx - f.x
          const dy = my - f.y
          const dist = Math.hypot(dx, dy) || 0.0001
          f.lastMouseDistance = dist

          switch (f.state) {
            case 'wandering': {
              if (moving && dist < attractRadius) {
                f.state = 'attracted'
                f.stateTimer = 0
                f.attractionStrength = 0
              }
              if (Math.random() < 0.03) {
                f.wanderAngle += (Math.random() - 0.5) * 0.4
              }
              f.vx += Math.cos(f.wanderAngle) * f.wanderSpeed
              f.vy += Math.sin(f.wanderAngle) * f.wanderSpeed
              f.vx += (Math.random() - 0.5) * 0.1
              f.vy += (Math.random() - 0.5) * 0.1
              break
            }
            case 'attracted': {
              f.attractionStrength = Math.min(f.attractionStrength + 0.02, 1)
              if (dist < orbitEnterDist) {
                f.state = 'orbiting'
                f.stateTimer = 0
                f.orbitAngle = Math.atan2(dy, dx)
                f.orbitRadius = orbitBase + (f.id % 3) * 30 + Math.random() * 20
                f.orbitSpeed = 0.03 + Math.random() * 0.02
              } else if (!moving || dist > attractRadius + 50) {
                f.state = 'wandering'
                f.stateTimer = 0
                f.attractionStrength = 0
              }
              const attractForce = f.attractionStrength * 0.15
              f.vx += (dx / dist) * attractForce
              f.vy += (dy / dist) * attractForce
              break
            }
            case 'orbiting': {
              f.orbitAngle += f.orbitSpeed
              const radiusWobble = Math.sin(now * 0.003 + f.id) * 10
              const finalRadius = f.orbitRadius + radiusWobble
              const targetX = mx + Math.cos(f.orbitAngle) * finalRadius
              const targetY = my + Math.sin(f.orbitAngle) * finalRadius
              const ox = targetX - f.x
              const oy = targetY - f.y
              const od = Math.hypot(ox, oy) || 1
              if (od > 2) {
                f.vx += (ox / od) * 0.08
                f.vy += (oy / od) * 0.08
              }
              if (!moving || dist > orbitExitDist) {
                if (f.stateTimer > 60) {
                  f.state = 'escaping'
                  f.stateTimer = 0
                  f.escapeAngle = Math.atan2(f.y - my, f.x - mx) + (Math.random() - 0.5) * Math.PI
                }
              }
              break
            }
            case 'escaping': {
              if (f.stateTimer > 30) {
                f.state = 'wandering'
                f.stateTimer = 0
                f.attractionStrength = 0
                f.wanderAngle = f.escapeAngle + (Math.random() - 0.5) * (Math.PI / 2)
              }
              const escapeForce = 0.2
              f.vx += Math.cos(f.escapeAngle) * escapeForce
              f.vy += Math.sin(f.escapeAngle) * escapeForce
              f.vx += (Math.random() - 0.5) * 0.15
              f.vy += (Math.random() - 0.5) * 0.15
              break
            }
          }

          // 阻尼与限速
          f.vx *= 0.92
          f.vy *= 0.92
          const maxSpeed = f.state === 'escaping' ? 8 : 4
          const spd = Math.hypot(f.vx, f.vy) || 0.0001
          if (spd > maxSpeed) {
            const scale = maxSpeed / spd
            f.vx *= scale
            f.vy *= scale
          }

          // 移动
          f.x += f.vx
          f.y += f.vy

          // 边界（带回弹）
          const m = 15
          if (f.x < m) {
            f.x = m
            f.vx = Math.abs(f.vx) * 0.8
            if (f.state === 'wandering') f.wanderAngle = -f.wanderAngle
          } else if (f.x > w - m) {
            f.x = w - m
            f.vx = -Math.abs(f.vx) * 0.8
            if (f.state === 'wandering') f.wanderAngle = Math.PI - f.wanderAngle
          }
          if (f.y < m) {
            f.y = m
            f.vy = Math.abs(f.vy) * 0.8
            if (f.state === 'wandering') f.wanderAngle = -f.wanderAngle
          } else if (f.y > h - m) {
            f.y = h - m
            f.vy = -Math.abs(f.vy) * 0.8
            if (f.state === 'wandering') f.wanderAngle = Math.PI - f.wanderAngle
          }

          // 亮度
          let glowIntensity = Math.sin(f.glowPhase) * 0.3 + 0.7
          if (f.state === 'orbiting' || f.state === 'attracted') glowIntensity *= 1.3
          f.currentOpacity = f.baseOpacity * glowIntensity

          // ====== DOM 直驱渲染 ======
          const el = elementsRef.current.get(f.id)
          if (el) {
            // transform/opacity：GPU 加速，最省
            el.style.transform = `translate3d(${f.x}px, ${f.y}px, 0)`
            el.style.opacity = `${f.currentOpacity}`

            // 仅需核心小圆点 + 外发光；尺寸根据状态放大
            const coreSize = f.size * (f.state === 'orbiting' || f.state === 'attracted' ? 2.2 : 2.0)
            const glowSize = f.size * (f.state === 'orbiting' || f.state === 'attracted' ? 12 : 8)

            // width/height 不是每帧必须改，但 glowPhase 会带来光晕变化（box-shadow 半径）
            // 折中方案：核心尺寸固定，光晕半径动态
            el.style.width = `${coreSize}px`
            el.style.height = `${coreSize}px`
            el.style.boxShadow = `
              0 0 ${glowSize}px ${colorVar400},
              0 0 ${glowSize * 0.5}px ${colorVar300},
              0 0 ${glowSize * 0.25}px ${colorVar200}
            `
          }
        }
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [fps, attractRadius, orbitEnterDist, orbitExitDist, orbitBase, colorVar200, colorVar300, colorVar400, mouseX, mouseY])

  if (!mounted) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      aria-hidden
      style={{ contain: 'layout paint size', isolation: 'isolate' }}
    >
      {nodes.map((id) => (
        <div
          key={id}
          ref={(el) => {
            if (!el) return
            elementsRef.current.set(id, el)
            // 初始静态样式（只设一次）
            el.style.position = 'absolute'
            el.style.left = '0'
            el.style.top = '0'
            el.style.backgroundColor = colorVar400
            el.style.borderRadius = '50%'
            el.style.transform = 'translate3d(-9999px, -9999px, 0)' // 初始化移出
            el.style.filter = 'blur(0.5px)'
            el.style.willChange = 'transform, opacity'
            el.style.mixBlendMode = 'screen'
          }}
        />
      ))}
    </div>
  )
}

export { SuperParticleSystem }
export default SuperParticleSystem
