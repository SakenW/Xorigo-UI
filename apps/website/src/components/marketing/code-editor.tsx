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

const CodeEditor = () => {
  const [code, setCode] = useState(`import { Button, Card } from '@xorigo-ui/core'

function App() {
  return (
    <Card className="p-6">
      <h1>欢迎使用 Xorigo UI</h1>
      <Button variant="primary">
        开始构建
      </Button>
    </Card>
  )
}`)

  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 左侧：代码编辑器 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95 rounded-2xl overflow-hidden border shadow-2xl transition-all duration-300 ${
          isHovered
            ? 'border-cyan-400/60 shadow-cyan-400/20 scale-[1.02]'
            : 'border-cyan-500/30 shadow-cyan-500/10'
        }`}
      >
      {/* 顶部光晕效果 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* 编辑器头部 - 增强设计 */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gray-800/60 backdrop-blur-sm border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          {/* macOS 风格按钮 */}
          <div className="flex gap-2">
            <motion.div
              className="w-3 h-3 bg-red-500 rounded-full cursor-pointer"
              whileHover={{ scale: 1.2, boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)' }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.div
              className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer"
              whileHover={{ scale: 1.2, boxShadow: '0 0 8px rgba(234, 179, 8, 0.6)' }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.div
              className="w-3 h-3 bg-green-500 rounded-full cursor-pointer"
              whileHover={{ scale: 1.2, boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)' }}
              whileTap={{ scale: 0.9 }}
            />
          </div>

          {/* 文件名标签 */}
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 rounded-md border border-cyan-500/20">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-gray-300 text-sm font-medium">App.tsx</span>
          </div>
        </div>

        {/* 复制按钮 - 增强交互 */}
        <motion.button
          onClick={handleCopy}
          className="group relative px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/50 rounded-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="text-green-400"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-gray-400 group-hover:text-cyan-400 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="text-xs text-gray-400 group-hover:text-cyan-400 transition-colors">
              {copied ? '已复制' : '复制'}
            </span>
          </div>
        </motion.button>
      </div>

      {/* 代码内容区域 - 左对齐标准格式 */}
      <div className="relative">
        {/* 行号列 */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800/40 border-r border-cyan-500/10 flex flex-col py-6 text-right pr-3">
          {code.split('\n').map((_, i) => (
            <span key={i} className="text-xs text-gray-600 leading-6 font-mono">
              {i + 1}
            </span>
          ))}
        </div>

        {/* 代码内容 - 左对齐，无居中 */}
        <pre className="pl-16 pr-6 py-6 text-sm overflow-x-auto text-left">
          <code className="text-gray-300 font-mono leading-6 whitespace-pre">{code}</code>
        </pre>
      </div>

      {/* 装饰性光效 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* 右侧：实时预览 */}
      <motion.div
        className={`relative bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95 rounded-2xl overflow-hidden border shadow-2xl p-8 transition-all duration-300 ${
          isHovered
            ? 'border-purple-400/60 shadow-purple-400/20 scale-[1.02]'
            : 'border-purple-500/30 shadow-purple-500/10'
        }`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {/* 顶部光晕 */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        {/* 预览标题 */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span className="text-gray-300 text-sm font-medium">实时预览</span>
        </div>
        {/* 预览内容 */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 flex flex-col items-center justify-center min-h-[200px]"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h1 className="text-2xl font-bold text-white mb-6 text-center">欢迎使用 Xorigo UI</h1>
          <motion.button
            className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">开始构建</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
        {/* 装饰光效 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      </motion.div>
    </div>
  )
}


export { CodeEditor }
