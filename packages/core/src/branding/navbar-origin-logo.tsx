'use client'

import React, { useId, useMemo, useRef, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type Mode = 'rotateGroup' | 'rotateGradient' | 'hybrid'

export type NavbarOriginLogoProps = {
  className?: string
  size?: number
  spinSeconds?: number
  gradientSeconds?: number
  breatheSeconds?: number
  paletteIntervalSeconds?: number
  crossfadeSeconds?: number
  ringStops?: string[]
  centerColor?: string
  glow?: boolean
  title?: string
  mode?: Mode
  /** SVG 四周额外留白（像素），防止描边/光晕被裁切 */
  bleed?: number
}

export const NavbarOriginLogo: React.FC<NavbarOriginLogoProps> = React.memo(
  ({
    className = '',
    size = 48,
    spinSeconds = 8,
    gradientSeconds = 12,
    breatheSeconds = 3,
    paletteIntervalSeconds = 3.6,
    crossfadeSeconds = 1.2,
    ringStops = ['#d946ef', '#f472b6', '#22d3ee', '#06b6d4', '#d946ef'],
    centerColor = '#ffffff',
    glow = true,
    title,
    mode = 'hybrid',
    bleed = 2, // ✅ 默认 2px 缓冲
  }) => {
    // ==== 尺寸与几何 ====
    const rid = useId()
    const gidGradientA = `ringGradientA-${rid}`
    const gidGradientB = `ringGradientB-${rid}`
    const gidHalo = `haloGradient-${rid}`
    const fidGlow = `softGlow-${rid}`
    const cidClip = `circleClip-${rid}`

    const goldenRatio = 1.618
    const outerRadius = size / 2
    const centerRadius = outerRadius / goldenRatio
    const ringInnerRadius = centerRadius + (outerRadius - centerRadius) / goldenRatio
    const ringThickness = Math.max(outerRadius - ringInnerRadius, 1)

    // ✅ 带 bleed 的 viewBox：在可视区四周加留白，防止描边/发光被切
    const vb = {
      x: -bleed,
      y: -bleed,
      w: size + bleed * 2,
      h: size + bleed * 2,
    }
    const center = size / 2 // 仍以原尺寸中心为圆心

    // ==== 动效节奏 ====
    const reduced = useReducedMotion()
    const spinDur = (reduced ? 2 : 1) * spinSeconds
    const gradDur = (reduced ? 2 : 1) * gradientSeconds
    const breatheDur = (reduced ? 2 : 1) * breatheSeconds
    const paletteInterval = (reduced ? 1.5 : 1) * paletteIntervalSeconds
    const crossfadeDur = Math.max(0.6, crossfadeSeconds)

    // ==== 双缓冲渐变 ====
    const [paletteA, setPaletteA] = useState<string[]>(ringStops)
    const [paletteB, setPaletteB] = useState<string[]>(ringStops)
    const [activeIdx, setActiveIdx] = useState<0 | 1>(0)

    const jitterHsl = () => {
      const hue = Math.floor(Math.random() * 360)
      const sat = 60 + Math.random() * 30
      const light = 45 + Math.random() * 25
      return `hsl(${hue}deg ${sat}% ${light}%)`
    }
    const nextPalette = (prev: string[]) => prev.map(() => jitterHsl())

    useEffect(() => {
      const id = setInterval(() => {
        const target = activeIdx === 0 ? 1 : 0
        const setter = target === 0 ? setPaletteA : setPaletteB
        const base = target === 0 ? paletteA : paletteB
        setter(nextPalette(base))
        requestAnimationFrame(() => setActiveIdx(target as 0 | 1))
      }, paletteInterval * 1000)
      return () => clearInterval(id)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIdx, paletteA, paletteB, paletteInterval])

    const toStops = (colors: string[]) =>
      colors.map((c, i) => ({
        offset: `${Math.round((i / Math.max(colors.length - 1, 1)) * 100)}%`,
        color: c,
        key: `${i}-${c}`,
      }))
    const gradientStopsA = useMemo(() => toStops(paletteA), [paletteA])
    const gradientStopsB = useMemo(() => toStops(paletteB), [paletteB])

    // ==== 渐变相位旋转 ====
    const gradRefA = useRef<SVGLinearGradientElement | null>(null)
    const gradRefB = useRef<SVGLinearGradientElement | null>(null)
    useEffect(() => {
      const enable = mode === 'rotateGradient' || mode === 'hybrid'
      if (!enable) return
      let raf = 0
      let start: number | null = null
      const cx = String(center)
      const cy = String(center)
      const loop = (t: number) => {
        if (start === null) start = t
        const period = gradDur * 1000
        const theta = period > 0 ? ((t - start) % period) / period * 360 : 0
        const transform = `rotate(${theta}, ${cx}, ${cy})`
        if (gradRefA.current) gradRefA.current.setAttribute('gradientTransform', transform)
        if (gradRefB.current) gradRefB.current.setAttribute('gradientTransform', transform)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
      return () => cancelAnimationFrame(raf)
    }, [mode, center, gradDur])

    const enableGroupRotate = mode === 'rotateGroup' || mode === 'hybrid'

    return (
      // ✅ 不要裁剪外层，让相邻文字/其他元素不受影响
      <div
        className={`relative rounded-full overflow-visible ${className}`}
        style={{ width: size, height: size, lineHeight: 0, pointerEvents: 'none' }}
        aria-hidden={title ? undefined : true}
        role={title ? 'img' : undefined}
      >
        <svg
          width={size}
          height={size}
          viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} // ✅ 带 bleed 的 viewBox
          xmlns="http://www.w3.org/2000/svg"
        >
          {title ? <title>{title}</title> : null}

          <defs>
            <clipPath id={cidClip}>
              {/* ✅ clip 只裁成圆形，可稍微收紧半径，避免描边越界被裁 */}
              <circle cx={center} cy={center} r={outerRadius} />
            </clipPath>

            <linearGradient
              id={gidGradientA}
              x1={vb.x} y1={vb.y} x2={vb.x + vb.w} y2={vb.y + vb.h}
              gradientUnits="userSpaceOnUse"
              ref={gradRefA}
            >
              {gradientStopsA.map(s => <stop key={s.key} offset={s.offset} stopColor={s.color} />)}
            </linearGradient>

            <linearGradient
              id={gidGradientB}
              x1={vb.x} y1={vb.y} x2={vb.x + vb.w} y2={vb.y + vb.h}
              gradientUnits="userSpaceOnUse"
              ref={gradRefB}
            >
              {gradientStopsB.map(s => <stop key={s.key} offset={s.offset} stopColor={s.color} />)}
            </linearGradient>

            <radialGradient id={gidHalo} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(168,85,247,0.18)" />
              <stop offset="100%" stopColor="rgba(6,182,212,0.08)" />
            </radialGradient>

            {glow && (
              <filter id={fidGlow} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b2" />
                <feMerge>
                  <feMergeNode in="b2" />
                  <feMergeNode in="b1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
          </defs>

          <g clipPath={`url(#${cidClip})`}>
            {/* 背景光晕（半径略小，避免贴边） */}
            <motion.circle
              cx={center} cy={center}
              r={outerRadius - ringThickness / 2}
              fill={`url(#${gidHalo})`}
              animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.05, 1] }}
              transition={{ duration: breatheDur * 1.5, ease: 'easeInOut', repeat: Infinity }}
              style={{ originX: '50%', originY: '50%' }}
            />

            {/* 外环（双层交叉淡入） */}
            {enableGroupRotate ? (
              <motion.g
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: spinDur, ease: 'linear', repeat: Infinity }}
                style={{ originX: '50%', originY: '50%' }}
                filter={glow ? `url(#${fidGlow})` : undefined}
              >
                <motion.circle
                  cx={center} cy={center}
                  r={outerRadius - ringThickness / 2 - 0.25}  // ✅ 轻微内收，防贴边
                  fill="none"
                  stroke={`url(#${gidGradientA})`}
                  strokeWidth={ringThickness}
                  strokeLinecap="round"
                  animate={{ opacity: activeIdx === 0 ? 1 : 0 }}
                  transition={{ duration: crossfadeDur, ease: 'easeInOut' }}
                />
                <motion.circle
                  cx={center} cy={center}
                  r={outerRadius - ringThickness / 2 - 0.25}
                  fill="none"
                  stroke={`url(#${gidGradientB})`}
                  strokeWidth={ringThickness}
                  strokeLinecap="round"
                  animate={{ opacity: activeIdx === 1 ? 1 : 0 }}
                  transition={{ duration: crossfadeDur, ease: 'easeInOut' }}
                />
              </motion.g>
            ) : (
              <g filter={glow ? `url(#${fidGlow})` : undefined}>
                <motion.circle
                  cx={center} cy={center}
                  r={outerRadius - ringThickness / 2 - 0.25}
                  fill="none"
                  stroke={`url(#${gidGradientA})`}
                  strokeWidth={ringThickness}
                  strokeLinecap="round"
                  animate={{ opacity: activeIdx === 0 ? 1 : 0 }}
                  transition={{ duration: crossfadeDur, ease: 'easeInOut' }}
                />
                <motion.circle
                  cx={center} cy={center}
                  r={outerRadius - ringThickness / 2 - 0.25}
                  fill="none"
                  stroke={`url(#${gidGradientB})`}
                  strokeWidth={ringThickness}
                  strokeLinecap="round"
                  animate={{ opacity: activeIdx === 1 ? 1 : 0 }}
                  transition={{ duration: crossfadeDur, ease: 'easeInOut' }}
                />
              </g>
            )}

            {/* 中心点 */}
            <motion.circle
              cx={center} cy={center}
              r={Math.max(centerRadius * 0.25, 1)}
              fill={centerColor}
              animate={{
                scale: [1, 1.45, 1],
                opacity: [1, 0.85, 1],
                filter: [
                  'drop-shadow(0 0 6px rgba(255,255,255,0.85))',
                  'drop-shadow(0 0 12px rgba(255,200,250,0.95))',
                  'drop-shadow(0 0 8px rgba(190,255,245,0.9))',
                ],
              }}
              transition={{ duration: breatheDur, ease: 'easeInOut', repeat: Infinity, delay: 0.2 }}
              style={{ originX: '50%', originY: '50%' }}
            />
          </g>
        </svg>
      </div>
    )
  }
)

export default NavbarOriginLogo
