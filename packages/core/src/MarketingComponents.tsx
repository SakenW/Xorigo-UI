/**
 * 营销页面专用组件 - 临时解决方案
 * TODO: 迁移到正确的组件包结构中
 */

'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// 动态 XorigoLogo 组件 - 基于原始版本简化
export interface XorigoLogoProps {
  size?: number
  className?: string
  containerAware?: boolean
  colorOptions?: {
    vibrant?: boolean
    count?: number
    minContrast?: number
  }
  ringStops?: string[]
  centerColor?: string
  mode?: 'rotateGroup' | 'rotateGradient' | 'hybrid'
  spinSeconds?: number
  breatheSeconds?: number
  glow?: boolean
}

export const XorigoLogo: React.FC<XorigoLogoProps> = ({
  size = 48,
  className = '',
  containerAware = false,
  colorOptions = { vibrant: true, count: 4, minContrast: 4.5 },
  ringStops = ['#d946ef', '#f472b6', '#22d3ee', '#06b6d4', '#d946ef'],
  centerColor = 'var(--color-text-primary)',
  mode = 'hybrid',
  spinSeconds = 8,
  breatheSeconds = 3,
  glow = true
}) => {
  const [paletteA, setPaletteA] = useState<string[]>(ringStops)
  const [paletteB, setPaletteB] = useState<string[]>(ringStops)
  const [activeIdx, setActiveIdx] = useState<0 | 1>(0)
  const reduced = useReducedMotion()

  const goldenRatio = 1.618
  const outerRadius = size / 2
  const centerRadius = outerRadius / goldenRatio
  const ringInnerRadius = centerRadius + (outerRadius - centerRadius) / goldenRatio
  const ringThickness = Math.max(outerRadius - ringInnerRadius, 1)
  const viewBoxSize = size
  const center = viewBoxSize / 2

  // 动效节奏
  const spinDur = (reduced ? 2 : 1) * spinSeconds
  const breatheDur = (reduced ? 2 : 1) * breatheSeconds
  const paletteInterval = (reduced ? 1.5 : 1) * 3.6
  const crossfadeDur = 1.2

  // 生成随机色彩
  function jitterHsl(hexOrHsl: string) {
    const hue = Math.floor(Math.random() * 360)
    const sat = 60 + Math.random() * 30
    const light = 45 + Math.random() * 25
    return `hsl(${hue}deg ${sat}% ${light}%)`
  }

  function nextPalette(prev: string[]) {
    return prev.map(() => jitterHsl(''))
  }

  // 定时切换色彩
  useEffect(() => {
    if (reduced) return // 禁用动画时停止颜色切换

    const id = setInterval(() => {
      const target = activeIdx === 0 ? 1 : 0
      const setter = target === 0 ? setPaletteA : setPaletteB
      const base = target === 0 ? paletteA : paletteB

      setter(nextPalette(base))

      requestAnimationFrame(() => {
        setActiveIdx(target as 0 | 1)
      })
    }, paletteInterval * 1000)

    return () => clearInterval(id)
  }, [activeIdx, paletteA, paletteB, paletteInterval, reduced])

  const toStops = (colors: string[]) =>
    colors.map((c, i) => ({
      offset: `${Math.round((i / Math.max(colors.length - 1, 1)) * 100)}%`,
      color: c,
      key: `${i}-${c}`,
    }))

  const gradientStopsA = useMemo(() => toStops(paletteA), [paletteA])
  const gradientStopsB = useMemo(() => toStops(paletteB), [paletteB])

  const enableGroupRotate = mode === 'rotateGroup' || mode === 'hybrid'

  return (
    <div
      className={`relative rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={`circleClip-${Math.random()}`}>
            <circle cx={center} cy={center} r={outerRadius} />
          </clipPath>

          <linearGradient
            id={`ringGradientA-${Math.random()}`}
            x1="0" y1="0" x2={viewBoxSize} y2={viewBoxSize}
            gradientUnits="userSpaceOnUse"
          >
            {gradientStopsA.map(s => (
              <stop key={s.key} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>

          <linearGradient
            id={`ringGradientB-${Math.random()}`}
            x1="0" y1="0" x2={viewBoxSize} y2={viewBoxSize}
            gradientUnits="userSpaceOnUse"
          >
            {gradientStopsB.map(s => (
              <stop key={s.key} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>

          <radialGradient id={`haloGradient-${Math.random()}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.18)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0.08)" />
          </radialGradient>

          {glow && (
            <filter id={`softGlow-${Math.random()}`} x="-50%" y="-50%" width="200%" height="200%">
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

        <g clipPath={`url(#circleClip-${Math.random()})`}>
          {/* 光晕呼吸 */}
          <motion.circle
            cx={center} cy={center} r={outerRadius - ringThickness / 2}
            fill={`url(#haloGradient-${Math.random()})`}
            initial={{ opacity: 0.35, scale: 1 }}
            animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.05, 1] }}
            transition={{ duration: breatheDur * 1.5, ease: 'easeInOut', repeat: Infinity }}
            style={{ originX: '50%', originY: '50%' }}
          />

          {/* 外环旋转 */}
          {enableGroupRotate ? (
            <motion.g
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: spinDur, ease: 'linear', repeat: Infinity }}
              style={{ originX: '50%', originY: '50%' }}
              filter={glow ? `url(#softGlow-${Math.random()})` : undefined}
            >
              <motion.circle
                cx={center} cy={center}
                r={outerRadius - ringThickness / 2}
                fill="none"
                stroke={`url(#ringGradientA-${Math.random()})`}
                strokeWidth={ringThickness}
                strokeLinecap="round"
                initial={{ opacity: activeIdx === 0 ? 1 : 0 }}
                animate={{ opacity: activeIdx === 0 ? 1 : 0 }}
                transition={{ duration: crossfadeDur, ease: 'easeInOut' }}
              />
              <motion.circle
                cx={center} cy={center}
                r={outerRadius - ringThickness / 2}
                fill="none"
                stroke={`url(#ringGradientB-${Math.random()})`}
                strokeWidth={ringThickness}
                strokeLinecap="round"
                initial={{ opacity: activeIdx === 1 ? 1 : 0 }}
                animate={{ opacity: activeIdx === 1 ? 1 : 0 }}
                transition={{ duration: crossfadeDur, ease: 'easeInOut' }}
              />
            </motion.g>
          ) : (
            <g filter={glow ? `url(#softGlow-${Math.random()})` : undefined}>
              <motion.circle
                cx={center} cy={center}
                r={outerRadius - ringThickness / 2}
                fill="none"
                stroke={`url(#ringGradientA-${Math.random()})`}
                strokeWidth={ringThickness}
                strokeLinecap="round"
                initial={{ opacity: activeIdx === 0 ? 1 : 0 }}
                animate={{ opacity: activeIdx === 0 ? 1 : 0 }}
                transition={{ duration: crossfadeDur, ease: 'easeInOut' }}
              />
              <motion.circle
                cx={center} cy={center}
                r={outerRadius - ringThickness / 2}
                fill="none"
                stroke={`url(#ringGradientB-${Math.random()})`}
                strokeWidth={ringThickness}
                strokeLinecap="round"
                initial={{ opacity: activeIdx === 1 ? 1 : 0 }}
                animate={{ opacity: activeIdx === 1 ? 1 : 0 }}
                transition={{ duration: crossfadeDur, ease: 'easeInOut' }}
              />
            </g>
          )}

          {/* 中心点呼吸 */}
          <motion.circle
            cx={center} cy={center}
            r={Math.max(centerRadius * 0.25, 1)}
            fill={centerColor}
            initial={{ scale: 1, opacity: 1 }}
            animate={{
              scale: [1, 1.45, 1],
              opacity: [1, 0.85, 1],
              filter: [
                `drop-shadow(0 0 6px ${centerColor}dd)`,
                `drop-shadow(0 0 12px ${centerColor}f3)`,
                `drop-shadow(0 0 8px ${centerColor}e6)`,
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

// HeroTitle 组件
export interface HeroTitleProps {
  id?: string
  text: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  shine?: boolean
  glow?: boolean
  enable3D?: boolean
  gradientStops?: string[]
  beamColor?: string
  beamSecondaryColor?: string
  glowColor?: string
  entranceDelay?: number
  className?: string
  ariaLabel?: string
}

export const HeroTitle: React.FC<HeroTitleProps> = ({
  id,
  text,
  size = 'lg',
  shine = true,
  glow = true,
  enable3D = true,
  gradientStops = ['#a855f7', '#ec4899', '#06b6d4', '#0891b2'],
  beamColor = 'rgba(255,255,255,0.6)',
  beamSecondaryColor = 'rgba(168, 85, 247, 0.4)',
  glowColor = 'rgba(6, 182, 212, 0.3)',
  entranceDelay = 0,
  className = '',
  ariaLabel
}) => {
  const sizeClasses = {
    sm: 'text-3xl md:text-4xl',
    md: 'text-4xl md:text-5xl',
    lg: 'text-5xl md:text-6xl',
    xl: 'text-6xl md:text-7xl'
  }

  return (
    <motion.h1
      id={id}
      className={`font-bold text-center ${sizeClasses[size]} ${className}`}
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: entranceDelay }}
      style={{
        background: shine ? `linear-gradient(135deg, ${gradientStops.join(', ')})` : undefined,
        WebkitBackgroundClip: shine ? 'text' : undefined,
        WebkitTextFillColor: shine ? 'transparent' : undefined,
        backgroundClip: shine ? 'text' : undefined,
        textShadow: glow ? `0 0 30px ${glowColor}` : undefined,
        transform: enable3D ? 'perspective(1000px) rotateX(5deg)' : undefined
      }}
    >
      {text}
    </motion.h1>
  )
}

// StatCard 组件
export interface StatCardProps {
  title: string
  value: string
  description: string
  trend?: {
    value: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  variant?: 'primary' | 'secondary' | 'accent' | 'success'
  icon?: string
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  trend,
  variant = 'primary',
  icon,
  className = ''
}) => {
  const variantColors = {
    primary: 'from-purple-500 to-purple-600',
    secondary: 'from-gray-500 to-gray-600',
    accent: 'from-cyan-500 to-cyan-600',
    success: 'from-green-500 to-green-600'
  }

  const trendColors = {
    increase: 'text-green-500',
    decrease: 'text-red-500',
    neutral: 'text-gray-500'
  }

  return (
    <motion.div
      className={`rounded-lg p-6 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        {trend && (
          <div className={`text-sm font-medium ${trendColors[trend.type]}`}>
            {trend.value}
          </div>
        )}
      </div>
      <div className={`text-2xl font-bold mb-2 bg-gradient-to-r ${variantColors[variant]} bg-clip-text text-transparent`}>
        {value}
      </div>
      <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </div>
    </motion.div>
  )
}

// SkipLink 组件
export interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  href,
  children,
  className = ''
}) => {
  return (
    <a
      href={href}
      className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-md font-medium z-50 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
    >
      {children}
    </a>
  )
}

// BreathingBackground 组件
export interface BreathingBackgroundProps {
  enableMouseInteraction?: boolean
  breathingDuration?: number
  floatingDuration?: number
  bubbleCount?: number
  primaryColor?: string
  secondaryColor?: string
  tertiaryColor?: string
  minBubbleSize?: number
  maxBubbleSize?: number
  className?: string
}

export const BreathingBackground: React.FC<BreathingBackgroundProps> = ({
  enableMouseInteraction = false,
  breathingDuration = 6,
  floatingDuration = 30,
  bubbleCount = 6,
  primaryColor = '#a855f7',
  secondaryColor = '#06b6d4',
  tertiaryColor = '#ec4899',
  minBubbleSize = 150,
  maxBubbleSize = 300,
  className = ''
}) => {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: bubbleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: Math.random() * (maxBubbleSize - minBubbleSize) + minBubbleSize,
            height: Math.random() * (maxBubbleSize - minBubbleSize) + minBubbleSize,
            background: `radial-gradient(circle, ${[primaryColor, secondaryColor, tertiaryColor][i % 3]}, transparent)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: breathingDuration + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * breathingDuration,
          }}
        />
      ))}
    </div>
  )
}

// AnimatedBackground 组件（简化版）
export interface AnimatedBackgroundProps {
  className?: string
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = ''
}) => {
  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-purple-900/20 dark:via-gray-900 dark:to-cyan-900/20 ${className}`} />
  )
}

// FluidBackground 组件 - 现代化流动背景
const FluidBackgroundComponent: React.FC = () => {
  const [time, setTime] = React.useState(0)

  React.useEffect(() => {
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

export const FluidBackground = FluidBackgroundComponent

// runAccessibilityTests 函数
export const runAccessibilityTests = () => {
  if (typeof window !== 'undefined') {
    console.log('🔍 运行可访问性测试...')

    // 基础可访问性检查
    const issues = []

    // 检查是否有适当的标题结构
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    if (headings.length === 0) {
      issues.push('页面缺少标题元素')
    }

    // 检查图片alt属性
    const images = document.querySelectorAll('img')
    images.forEach((img, index) => {
      if (!img.alt) {
        issues.push(`图片 ${index + 1} 缺少alt属性`)
      }
    })

    // 检查链接的可访问性
    const links = document.querySelectorAll('a')
    links.forEach((link, index) => {
      if (!link.textContent?.trim()) {
        issues.push(`链接 ${index + 1} 缺少文本内容`)
      }
    })

    if (issues.length > 0) {
      console.warn('⚠️ 发现可访问性问题：', issues)
    } else {
      console.log('✅ 基础可访问性检查通过')
    }
  }
}

// SiteNavigation 组件（简化版导航栏）
export const SiteNavigation: React.FC<{ className?: string }> = ({
  className = ''
}) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 bg-white/10 dark:bg-black/30 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <XorigoLogo size={32} />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-cyan-300 to-pink-400 bg-clip-text text-transparent">
              Xorigo UI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-800 dark:text-white hover:text-purple-500 transition-colors">特性</a>
            <a href="#docs" className="text-gray-800 dark:text-white hover:text-purple-500 transition-colors">文档</a>
            <a href="#github" className="text-gray-800 dark:text-white hover:text-purple-500 transition-colors">GitHub</a>
            <a
              href="/workbench"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all"
            >
              开始使用
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}