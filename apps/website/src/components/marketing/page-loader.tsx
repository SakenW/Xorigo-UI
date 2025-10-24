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

const PageLoader = () => {
  // 移除内部状态，完全由外部的 AnimatePresence 控制
  // 这样可以确保进度条完整显示
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // 延迟显示内容动画
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 200) // 短暂延迟后开始显示内容

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[var(--color-surface-dark)] flex items-center justify-center"
      style={{
        ...createWillChange(['opacity', 'transform']),
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 1.02,
        y: -10,
        transition: {
          duration: 1.0,
          ease: [0.25, 0.46, 0.45, 0.94] // 更柔和的退出动画
        }
      }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex flex-col items-center justify-center">
        <XorigoLogoLoader
          variant="enhanced"
          size="xl"
          duration={3200}
          showProgress={true}
          className="scale-125" // 增大一些以突出品牌效果
        />

        {/* 增加品牌文字 - 重新设计动画时序 */}
        <motion.div
          className="mt-8 text-center"
          style={createWillChange(['opacity', 'transform'])}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h2
            className="text-3xl font-bold mb-2 relative"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 1.2,
              duration: 0.7,
              ease: [0.25, 0.46, 0.45, 0.94] // 更柔和的缓动
            }}
          >
            {/* 渐变文字层 */}
            <span className="bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-info-400)] bg-clip-text text-transparent">
              Xorigo UI
            </span>
            {/* 后备文字层 - 支持不兼容bg-clip-text的浏览器 */}
            <span className="absolute inset-0 text-[var(--color-primary-300)]" aria-hidden="true">
              Xorigo UI
            </span>
          </motion.h2>
          <motion.p
            className="text-[var(--color-text-secondary)] text-lg"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.6,
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            下一代 React 组件库
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}


export { PageLoader }
