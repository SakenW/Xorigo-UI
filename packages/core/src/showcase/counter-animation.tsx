'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * 数字动画计数器组件
 *
 * 用于数字的动画展示，从0计数到目标值
 */
interface CounterAnimationProps {
  /** 目标数值 */
  value: number
  /** 单位/后缀 */
  suffix?: string
  /** 动画持续时间（毫秒） */
  duration?: number
  /** 延迟开始时间（毫秒） */
  delay?: number
}

export function CounterAnimation({
  value,
  suffix = '',
  duration = 2000,
  delay = 500
}: CounterAnimationProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!isVisible) return

    let start = 0
    let current = 0
    const end = value
    const increment = end / (duration / 16) // 60fps

    const interval = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(interval)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(interval)
  }, [isVisible, value, duration])

  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {count.toLocaleString()}{suffix}
    </motion.span>
  )
}

export { CounterAnimation as default }