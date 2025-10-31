'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check } from 'lucide-react'

export interface CodeDemoProps {
  /** 代码内容 */
  code?: string
  /** 文件名 */
  fileName?: string
  /** 是否显示行号 */
  showLineNumbers?: boolean
  /** 是否显示预览面板 */
  showPreview?: boolean
  /** 预览内容 */
  previewContent?: React.ReactNode
  /** 主题颜色 */
  theme?: 'cyan' | 'purple' | 'green' | 'blue'
  /** 额外的CSS类名 */
  className?: string
}

/**
 * 代码演示组件
 *
 * 用于展示代码示例和预览，包含语法高亮、复制功能和预览面板
 */
export function CodeDemo({
  code = `import { Button, Card } from '@xorigo-ui/core'

function App() {
  return (
    <Card className="p-6">
      <h1>欢迎使用 Xorigo UI</h1>
      <Button variant="primary">
        开始构建
      </Button>
    </Card>
  )
}`,
  fileName = 'App.tsx',
  showLineNumbers = true,
  showPreview = true,
  previewContent,
  theme = 'cyan',
  className = ''
}: CodeDemoProps) {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // 主题配置
  const themes = {
    cyan: {
      border: 'border-cyan-500/30 hover:border-cyan-400/60',
      shadow: 'shadow-cyan-500/10 hover:shadow-cyan-400/20',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10 hover:bg-cyan-500/20',
      borderButton: 'border-cyan-500/30 hover:border-cyan-400/50'
    },
    purple: {
      border: 'border-purple-500/30 hover:border-purple-400/60',
      shadow: 'shadow-purple-500/10 hover:shadow-purple-400/20',
      text: 'text-purple-400',
      bg: 'bg-purple-500/10 hover:bg-purple-500/20',
      borderButton: 'border-purple-500/30 hover:border-purple-400/50'
    },
    green: {
      border: 'border-green-500/30 hover:border-green-400/60',
      shadow: 'shadow-green-500/10 hover:shadow-green-400/20',
      text: 'text-green-400',
      bg: 'bg-green-500/10 hover:bg-green-500/20',
      borderButton: 'border-green-500/30 hover:border-green-400/50'
    },
    blue: {
      border: 'border-blue-500/30 hover:border-blue-400/60',
      shadow: 'shadow-blue-500/10 hover:shadow-blue-400/20',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10 hover:bg-blue-500/20',
      borderButton: 'border-blue-500/30 hover:border-blue-400/50'
    }
  }

  const currentTheme = themes[theme]

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-2' : ''} gap-6 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 左侧：代码编辑器 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95 rounded-2xl overflow-hidden border shadow-2xl transition-all duration-300 ${
          isHovered ? `${currentTheme.border} ${currentTheme.shadow} scale-[1.02]` : `${currentTheme.border} ${currentTheme.shadow}`
        }`}
      >
        {/* 顶部光晕效果 */}
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-${theme}-500/50 to-transparent`} />

        {/* 编辑器头部 */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gray-800/60 backdrop-blur-sm border-b border-gray-700/50">
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
            <div className={`flex items-center gap-2 px-3 py-1 ${currentTheme.bg} rounded-md border ${currentTheme.borderButton}`}>
              <div className={`w-2 h-2 bg-${theme}-400 rounded-full animate-pulse`} />
              <span className="text-gray-300 text-sm font-medium">{fileName}</span>
            </div>
          </div>

          {/* 复制按钮 */}
          <motion.button
            onClick={handleCopy}
            className={`group relative px-3 py-1.5 ${currentTheme.bg} ${currentTheme.borderButton} rounded-lg transition-all`}
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

        {/* 代码内容区域 */}
        <div className="relative">
          {showLineNumbers && (
            /* 行号列 */
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800/40 border-r border-gray-700/30 flex flex-col py-6 text-right pr-3">
              {code.split('\n').map((_, i) => (
                <span key={i} className="text-xs text-gray-600 leading-6 font-mono">
                  {i + 1}
                </span>
              ))}
            </div>
          )}

          {/* 代码内容 */}
          <pre className={`${showLineNumbers ? 'pl-16' : 'pl-6'} pr-6 py-6 text-sm overflow-x-auto text-left`}>
            <code className="text-gray-300 font-mono leading-6 whitespace-pre">{code}</code>
          </pre>
        </div>

        {/* 装饰性光效 */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-${theme}-500/5 rounded-full blur-3xl pointer-events-none`} />
      </motion.div>

      {/* 右侧：实时预览 */}
      {showPreview && (
        <motion.div
          className={`relative bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95 rounded-2xl overflow-hidden border shadow-2xl p-8 transition-all duration-300 ${
            isHovered ? 'border-purple-400/60 shadow-purple-400/20 scale-[1.02]' : 'border-purple-500/30 shadow-purple-500/10'
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
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 flex flex-col items-center justify-center min-h-[200px]">
            {previewContent || (
              <>
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
              </>
            )}
          </div>

          {/* 装饰光效 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
      )}
    </div>
  )
}

CodeDemo.displayName = 'CodeDemo'

export { CodeDemo as default }