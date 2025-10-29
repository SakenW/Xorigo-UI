'use client'

import React, { useState, useEffect } from 'react'

export interface AnimatedBackgroundProps {
  className?: string
  primaryColor?: string
  secondaryColor?: string
  primarySize?: number
  secondarySize?: number
  transitionDuration?: string
  opacity?: string
  blur?: string
}

/**
 * AnimatedBackground - 跟随鼠标的动态背景效果
 *
 * 两个模糊圆形跟随鼠标移动，创造动态的背景效果
 * 支持主题感知，颜色会随主题变化
 */
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = '',
  primaryColor = 'var(--color-primary-500)',
  secondaryColor = 'var(--color-accent-500)',
  primarySize = 384, // w-96 = 24rem = 384px
  secondarySize = 256, // w-64 = 16rem = 256px
  transitionDuration = '0.3s ease-out',
  opacity = '0.1',
  blur = '3xl'
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const primaryOffset = primarySize / 2
  const secondaryOffset = secondarySize / 2

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* 主圆形 - 跟随鼠标左侧 */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: `${primarySize}px`,
          height: `${primarySize}px`,
          backgroundColor: primaryColor,
          left: `${mousePosition.x - primaryOffset}px`,
          top: `${mousePosition.y - primaryOffset}px`,
          opacity,
          transition: `all ${transitionDuration}`
        }}
      />

      {/* 次圆形 - 跟随鼠标右侧 */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: `${secondarySize}px`,
          height: `${secondarySize}px`,
          backgroundColor: secondaryColor,
          right: `${window.innerWidth - mousePosition.x - secondaryOffset}px`,
          bottom: `${window.innerHeight - mousePosition.y - secondaryOffset}px`,
          opacity,
          transition: `all ${transitionDuration}`
        }}
      />
    </div>
  )
}

export default AnimatedBackground