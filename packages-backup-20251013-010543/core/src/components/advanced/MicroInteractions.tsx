'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils'

// 涟漪效果组件
export interface RippleEffectProps {
  className?: string
  color?: string
  duration?: number
  children?: React.ReactNode
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
  className,
  color = 'rgba(255, 255, 255, 0.5)',
  duration = 600,
  children,
}) => {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = {
      id: Date.now(),
      x,
      y,
    }

    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, duration)
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onClick={handleClick}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              backgroundColor: color,
              width: 20,
              height: 20,
            }}
            initial={{
              scale: 0,
              opacity: 1,
            }}
            animate={{
              scale: 8,
              opacity: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: duration / 1000,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
      {children}
    </div>
  )
}

// 脉冲加载组件
export interface PulseLoaderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export const PulseLoader: React.FC<PulseLoaderProps> = ({
  className,
  size = 'md',
  color = 'bg-blue-500',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn('rounded-full', color, sizeClasses[size])}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// 磁性按钮组件
export interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  strength = 0.3,
  onClick,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    setMousePosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      className={cn('relative', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 1,
      }}
    >
      {children}
    </motion.button>
  )
}

// 打字机效果组件
export interface TypewriterTextProps {
  text: string
  className?: string
  speed?: number
  delay?: number
  onComplete?: () => void
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className,
  speed = 50,
  delay = 0,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      let currentIndex = 0

      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(interval)
          setIsComplete(true)
          onComplete?.()
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [text, speed, delay, onComplete])

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <motion.span
          className="inline-block w-1 h-5 bg-current ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
        />
      )}
    </span>
  )
}

// 滚动进度指示器组件
export interface ScrollIndicatorProps {
  className?: string
  color?: string
  height?: number
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  className,
  color = 'bg-blue-500',
  height = 4,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={cn('fixed top-0 left-0 w-full z-50', className)}>
      <motion.div
        className={cn('origin-left', color)}
        style={{
          height: `${height}px`,
          scaleX: scrollProgress / 100,
        }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
    </div>
  )
}

// 导出所有组件
export default {
  RippleEffect,
  PulseLoader,
  MagneticButton,
  TypewriterText,
  ScrollIndicator,
}
