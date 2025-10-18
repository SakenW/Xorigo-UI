'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy } from 'lucide-react'

/**
 * CodeEditor - 增强代码编辑器组件
 *
 * 特性：
 * - 代码展示和复制功能
 * - 现代化设计风格
 * - macOS 风格窗口按钮
 * - 行号显示
 * - 动画效果和交互反馈
 */
export interface CodeEditorProps {
  /** 代码内容 */
  code?: string
  /** 文件名显示 */
  filename?: string
  /** 语言标识 */
  language?: string
  /** 是否只读模式 */
  readOnly?: boolean
  /** 主题样式 */
  theme?: 'dark' | 'light'
  /** 额外的 CSS 类名 */
  className?: string
}

const CodeEditor: React.FC<CodeEditorProps> = ({
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
  filename = 'App.tsx',
  language = 'typescript',
  readOnly = true,
  theme = 'dark',
  className = ''
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const themeClasses = theme === 'dark'
    ? 'bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95 border-purple-500/30'
    : 'bg-gradient-to-br from-gray-100/95 via-gray-100/90 to-gray-50/95 border-blue-500/30'

  const headerThemeClasses = theme === 'dark'
    ? 'bg-black/60 border-purple-500/20'
    : 'bg-white/60 border-blue-500/20'

  const textThemeClasses = theme === 'dark'
    ? 'text-gray-300'
    : 'text-gray-700'

  const filenameThemeClasses = theme === 'dark'
    ? 'bg-purple-500/10 border-purple-500/20 text-gray-300'
    : 'bg-blue-500/10 border-blue-500/20 text-gray-700'

  const copyButtonThemeClasses = theme === 'dark'
    ? 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 hover:border-purple-400/50'
    : 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 hover:border-blue-400/50'

  const lineNumberThemeClasses = theme === 'dark'
    ? 'bg-black/40 border-purple-500/10 text-gray-600'
    : 'bg-white/40 border-blue-500/10 text-gray-400'

  const copyIconThemeClasses = theme === 'dark'
    ? 'text-gray-400 group-hover:text-purple-400'
    : 'text-gray-500 group-hover:text-blue-500'

  const copyTextThemeClasses = theme === 'dark'
    ? 'text-gray-400 group-hover:text-purple-400'
    : 'text-gray-500 group-hover:text-blue-500'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${themeClasses} rounded-2xl overflow-hidden border shadow-2xl ${className}`}
      style={{
        boxShadow: theme === 'dark'
          ? '0 25px 50px -12px rgba(168, 85, 247, 0.1)'
          : '0 25px 50px -12px rgba(59, 130, 246, 0.1)'
      }}
    >
      {/* 顶部光晕效果 */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-${theme === 'dark' ? 'purple' : 'blue'}-500/50 to-transparent`} />

      {/* 编辑器头部 */}
      <div className={`flex items-center justify-between px-5 py-3.5 ${headerThemeClasses} backdrop-blur-sm border-b`}>
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
          <div className={`flex items-center gap-2 px-3 py-1 ${filenameThemeClasses} rounded-md border`}>
            <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-purple-400' : 'bg-blue-400'} rounded-full animate-pulse`} />
            <span className="text-sm font-medium">{filename}</span>
          </div>
        </div>

        {/* 复制按钮 */}
        <motion.button
          onClick={handleCopy}
          className={`group relative px-3 py-1.5 ${copyButtonThemeClasses} rounded-lg transition-all`}
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
                  className={copyIconThemeClasses}
                >
                  <Copy className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className={`text-xs ${copyTextThemeClasses} transition-colors`}>
              {copied ? '已复制' : '复制'}
            </span>
          </div>
        </motion.button>
      </div>

      {/* 代码内容区域 */}
      <div className="relative">
        {/* 行号列 */}
        <div className={`absolute left-0 top-0 bottom-0 w-12 ${lineNumberThemeClasses} border-r flex flex-col py-6 text-right pr-3`}>
          {code.split('\n').map((_, i) => (
            <span key={i} className="text-xs leading-6 font-mono">
              {i + 1}
            </span>
          ))}
        </div>

        {/* 代码内容 */}
        <pre className="pl-16 pr-6 py-6 text-sm overflow-x-auto text-left">
          <code className={`${textThemeClasses} font-mono leading-6 whitespace-pre`}>{code}</code>
        </pre>
      </div>

      {/* 装饰性光效 */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${theme === 'dark' ? 'bg-purple-500/5' : 'bg-blue-500/5'} rounded-full blur-3xl pointer-events-none`} />
    </motion.div>
  )
}

CodeEditor.displayName = 'CodeEditor'

export { CodeEditor }