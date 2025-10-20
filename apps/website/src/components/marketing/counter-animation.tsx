'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XorigoLogoLoader } from '@xorigo-ui/core'
import {
  Box, Square, Pentagon, Braces, Database, FileCode,
  ArrowRight, Navigation, Layout, BarChart, FileText,
  Loader2, Zap, Copy, Check
} from 'lucide-react'

// 🎯 动画配置
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const createWillChange = (properties: string[]) => ({
  willChange: properties.join(', ')
})

const createRandomizedAnimation = (baseDuration: number, variance: number = 0.2, index: number = 0) => {
  const seedRandom = (index: number) => {
    const x = Math.sin(index) * 10000
    return x - Math.floor(x)
  }

  const randomOffset = seedRandom(index) * variance
  const randomDelay = seedRandom(index + 100) * 0.5

  return {
    duration: baseDuration + randomOffset,
    ease: [0.4, 0, 0.6, 1] as const,
    repeat: Infinity,
    delay: randomDelay
  }
}

const CounterAnimation = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(value) // 直接初始化为最终值
  const [shouldAnimate, setShouldAnimate] = useState(false)

  // 组件挂载后等待一下开始动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldAnimate(true)
    }, 1500) // 1.5秒后开始动画

    return () => clearTimeout(timer)
  }, [])

  // 简单的动画逻辑
  useEffect(() => {
    if (!shouldAnimate) return

    let start = 0
    let current = 0
    const end = value
    const duration = 2000 // 2秒动画
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
  }, [shouldAnimate, value])

  return (
    <span className="inline-block">
      {count.toLocaleString()}{suffix}
    </span>
  )
}


export { CounterAnimation }
