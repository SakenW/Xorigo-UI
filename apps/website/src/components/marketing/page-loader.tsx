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
  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // 使用预设时间让 XorigoLogoLoader 完成动画
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 2500) // 与 XorigoLogoLoader 的默认 duration 2000ms + 缓冲时间匹配

    // 延迟显示内容，避免闪烁
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 2600)

    return () => {
      clearTimeout(timer)
      clearTimeout(contentTimer)
    }
  }, [])

  if (isLoaded) return null

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
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex flex-col items-center justify-center">
        <XorigoLogoLoader
          variant="enhanced"
          size="xl"
          duration={2000}
          showProgress={true}
          className="scale-125" // 增大一些以突出品牌效果
        />

        {/* 增加品牌文字 - 使用 variants 优化 */}
        <motion.div
          className="mt-8 text-center"
          style={createWillChange(['opacity', 'transform'])}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-info-400)] bg-clip-text text-transparent mb-2">
            Xorigo UI
          </h2>
          <motion.p
            className="text-[var(--color-text-secondary)] text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            下一代 React 组件库
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}


export { PageLoader }
