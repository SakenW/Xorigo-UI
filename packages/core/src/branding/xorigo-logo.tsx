'use client'

import React, { useId, useMemo, useRef, useEffect, useState, forwardRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useContainerAwareColors, UseContainerAwareColorsOptions } from '../hooks/useContainerAwareColors'

export type Mode = 'rotateGroup' | 'rotateGradient' | 'hybrid'

export type XorigoLogoProps = {
  className?: string
  size?: number
  spinSeconds?: number         // 整环旋转一圈时间
  gradientSeconds?: number     // 渐变相位旋转一圈时间
  breatheSeconds?: number      // 光晕/中心点呼吸周期
  paletteIntervalSeconds?: number // 随机换色的间隔（建议 ≥ 3）
  crossfadeSeconds?: number    // 换色淡入淡出时间
  ringStops?: string[]         // 初始色带
  centerColor?: string
  glow?: boolean
  title?: string
  mode?: Mode

  // 容器感知相关属性
  containerAware?: boolean     // 是否启用容器感知模式
  colorOptions?: UseContainerAwareColorsOptions['colorOptions']
  fallbackColors?: {
    ringStops?: string[]
    centerColor?: string
  }
}

export const XorigoLogo = forwardRef<HTMLDivElement, XorigoLogoProps>(
  (
    {
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
      containerAware = false,
      colorOptions,
      fallbackColors,
    },
    ref
  ) => {
    // 合并 refs - 必须先合并，然后再用于容器感知
    const mergedRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(mergedRef.current)
      } else if (ref) {
        ref.current = mergedRef.current
      }
    }, [ref])

    // 容器感知颜色检测 - 使用合并后的ref
    const awareColors = useContainerAwareColors(mergedRef, {
      containerAware,
      fallbackColors,
      colorOptions
    })

    // 使用容器感知的颜色或回退到传入的颜色
    // 缓存颜色值，避免频繁重新计算
    const effectiveRingStops = containerAware && awareColors ? awareColors.ringStops : ringStops
    const effectiveCenterColor = containerAware && awareColors ? awareColors.centerColor : centerColor
    const effectiveHaloGradient = containerAware && awareColors ? awareColors.haloGradient : {
      start: 'rgba(168,85,247,0.18)',
      end: 'rgba(6,182,212,0.08)'
    }
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
    const viewBoxSize = size
    const center = viewBoxSize / 2

    // ==== 动效节奏 ====
    const reduced = useReducedMotion()
    const spinDur = (reduced ? 2 : 1) * spinSeconds
    const gradDur = (reduced ? 2 : 1) * gradientSeconds
    const breatheDur = (reduced ? 2 : 1) * breatheSeconds
    const paletteInterval = (reduced ? 1.5 : 1) * paletteIntervalSeconds
    const crossfadeDur = Math.min(crossfadeSeconds, Math.max(0.6, crossfadeSeconds)) // 保底 0.6s

    // ==== 双缓冲渐变：A / B ====
    // 保持 SSR 确定性：初始 palette 用有效颜色，随机仅在 CSR 中发生
    const [paletteA, setPaletteA] = useState<string[]>(effectiveRingStops)
    const [paletteB, setPaletteB] = useState<string[]>(effectiveRingStops)
    const [activeIdx, setActiveIdx] = useState<0 | 1>(0) // 正在显示哪一层

    // 当容器感知的颜色变化时，更新调色板
    useEffect(() => {
      if (containerAware && awareColors) {
        setPaletteA(awareColors.ringStops)
        setPaletteB(awareColors.ringStops)
        setActiveIdx(0)
      }
    }, [containerAware, awareColors, effectiveRingStops])

    // 平滑“随机”策略：在现有 HSL 基础上做小幅抖动，避免色阶跳变过大
    function jitterHsl(hexOrHsl: string) {
      // 简化：用 CSS 色彩函数 hsl() 直接随机生成，抖动幅度可控
      const hue = Math.floor(Math.random() * 360)
      const sat = 60 + Math.random() * 30   // 60% ~ 90%
      const light = 45 + Math.random() * 25 // 45% ~ 70%
      return `hsl(${hue}deg ${sat}% ${light}%)` // 兼容现代浏览器
    }

    // 生成新调色：与现有 stops 数量保持一致，整体色系随机但步进温和
    function nextPalette(prev: string[]) {
      return prev.map(() => jitterHsl(''))
    }

    // 定时切换：先把“非活动层”的渐变 stops 更新为新 palette，然后切换 activeIdx，触发交叉淡入
    useEffect(() => {
      const id = setInterval(() => {
        // 目标层：非活动层
        const target = activeIdx === 0 ? 1 : 0
        const setter = target === 0 ? setPaletteA : setPaletteB
        const base = target === 0 ? paletteA : paletteB

        setter(nextPalette(base))

        // 让浏览器先渲染新 palette 再切换层（避免同帧替换导致无过渡）
        requestAnimationFrame(() => {
          setActiveIdx(target as 0 | 1)
        })
      }, paletteInterval * 1000)

      return () => clearInterval(id)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIdx, paletteA, paletteB, paletteInterval])

    // 生成等距 offset 的 stops（复用逻辑）
    const toStops = (colors: string[]) =>
      colors.map((c, i) => ({
        offset: `${Math.round((i / Math.max(colors.length - 1, 1)) * 100)}%`,
        color: c,
        key: `${i}-${c}`,
      }))

    const gradientStopsA = useMemo(() => toStops(paletteA), [paletteA])
    const gradientStopsB = useMemo(() => toStops(paletteB), [paletteB])

    // ==== 渐变相位旋转（可选：rotateGradient / hybrid） ====
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
        const elapsed = t - start
        const period = gradDur * 1000
        const theta = period > 0 ? ((elapsed % period) / period) * 360 : 0
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
      <div
        ref={mergedRef}
        className={`relative rounded-full overflow-hidden ${className}`}
        style={{ width: size, height: size, lineHeight: 0 }}
        aria-hidden={title ? undefined : true}
        role={title ? 'img' : undefined}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {title ? <title>{title}</title> : null}

          <defs>
            <clipPath id={cidClip}>
              <circle cx={center} cy={center} r={outerRadius} />
            </clipPath>

            {/* 两套线性渐变：A / B（双缓冲） */}
            <linearGradient
              id={gidGradientA}
              x1="0" y1="0" x2={viewBoxSize} y2={viewBoxSize}
              gradientUnits="userSpaceOnUse"
              ref={gradRefA}
            >
              {gradientStopsA.map(s => (
                <stop key={s.key} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>

            <linearGradient
              id={gidGradientB}
              x1="0" y1="0" x2={viewBoxSize} y2={viewBoxSize}
              gradientUnits="userSpaceOnUse"
              ref={gradRefB}
            >
              {gradientStopsB.map(s => (
                <stop key={s.key} offset={s.offset} stopColor={s.color} />
              ))}
            </linearGradient>

            {/* 背景光晕 */}
            <radialGradient id={gidHalo} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={effectiveHaloGradient.start} />
              <stop offset="100%" stopColor={effectiveHaloGradient.end} />
            </radialGradient>

            {/* 轻微发光（静态滤镜，低成本） */}
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
            {/* 光晕呼吸 */}
            <motion.circle
              cx={center} cy={center} r={outerRadius - ringThickness / 2}
              fill={`url(#${gidHalo})`}
              animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.05, 1] }}
              transition={{ duration: breatheDur * 1.5, ease: 'easeInOut', repeat: Infinity }}
              style={{ originX: '50%', originY: '50%' }}
            />

            {/* 外环（两层叠加，做交叉淡入） */}
            {enableGroupRotate ? (
              <motion.g
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: spinDur, ease: 'linear', repeat: Infinity }}
                style={{ originX: '50%', originY: '50%' }}
                filter={glow ? `url(#${fidGlow})` : undefined}
              >
                {/* A 层 */}
                <motion.circle
                  cx={center} cy={center}
                  r={outerRadius - ringThickness / 2}
                  fill="none"
                  stroke={`url(#${gidGradientA})`}
                  strokeWidth={ringThickness}
                  strokeLinecap="round"
                  animate={{ opacity: activeIdx === 0 ? 1 : 0 }}
                  transition={{ duration: crossfadeDur, ease: 'easeInOut' }}
                />
                {/* B 层 */}
                <motion.circle
                  cx={center} cy={center}
                  r={outerRadius - ringThickness / 2}
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
                  r={outerRadius - ringThickness / 2}
                  fill="none"
                  stroke={`url(#${gidGradientA})`}
                  strokeWidth={ringThickness}
                  strokeLinecap="round"
                  animate={{ opacity: activeIdx === 0 ? 1 : 0 }}
                  transition={{ duration: crossfadeDur, ease: 'easeInOut' }}
                />
                <motion.circle
                  cx={center} cy={center}
                  r={outerRadius - ringThickness / 2}
                  fill="none"
                  stroke={`url(#${gidGradientB})`}
                  strokeWidth={ringThickness}
                  strokeLinecap="round"
                  animate={{ opacity: activeIdx === 1 ? 1 : 0 }}
                  transition={{ duration: crossfadeDur, ease: 'easeInOut' }}
                />
              </g>
            )}

            {/* 中心点：与外环错相的呼吸（更"活”） */}
            <motion.circle
              cx={center} cy={center}
              r={Math.max(centerRadius * 0.25, 1)}
              fill={effectiveCenterColor}
              animate={{
                scale: [1, 1.45, 1],
                opacity: [1, 0.85, 1],
                filter: [
                  `drop-shadow(0 0 6px ${effectiveCenterColor}dd)`,
                  `drop-shadow(0 0 12px ${effectiveCenterColor}f3)`,
                  `drop-shadow(0 0 8px ${effectiveCenterColor}e6)`,
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

XorigoLogo.displayName = 'XorigoLogo'

export default XorigoLogo
