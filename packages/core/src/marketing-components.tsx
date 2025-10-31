/**
 * 营销页面专用组件 - 临时解决方案
 * TODO: 迁移到正确的组件包结构中
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'

// XorigoLogo 组件
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
}

export const XorigoLogo: React.FC<XorigoLogoProps> = ({
  size = 48,
  className = '',
  containerAware = false,
  colorOptions = { vibrant: true, count: 4, minContrast: 4.5 },
  ringStops = ['#a855f7', '#ec4899', '#06b6d4', '#0891b2'],
  centerColor = '#1a202c'
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg"
        style={{
          background: `conic-gradient(from 0deg, ${ringStops.join(', ')})`
        }}
      />
      <div
        className="absolute inset-1 rounded-full flex items-center justify-center"
        style={{ backgroundColor: centerColor }}
      >
        <span className="text-white font-bold text-xs">XO</span>
      </div>
    </motion.div>
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