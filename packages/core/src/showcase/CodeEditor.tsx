'use client'

import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy } from 'lucide-react'

/**
 * CodeEditor - 轻量增强代码查看器
 * - 复制（含剪贴板回退方案）
 * - 行号
 * - macOS 风格头部
 * - 可切换主题（Tailwind 无动态类名）
 */
export interface CodeEditorProps {
  code?: string
  filename?: string
  language?: string
  readOnly?: boolean
  theme?: 'dark' | 'light'
  className?: string
  onCopy?: (ok: boolean) => void
}

const THEME = {
  dark: {
    container:
      'bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95 border-purple-500/30',
    header: 'bg-black/60 border-purple-500/20',
    text: 'text-gray-300',
    filename:
      'bg-purple-500/10 border-purple-500/20 text-gray-300',
    copyBtn:
      'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 hover:border-purple-400/50',
    lineNo:
      'bg-black/40 border-purple-500/10 text-gray-600',
    copyIcon: 'text-gray-400 group-hover:text-purple-400',
    copyText: 'text-gray-400 group-hover:text-purple-400',
    glow: 'bg-purple-500/5',
    topGlow: 'from-transparent via-purple-500/50 to-transparent'
  },
  light: {
    container:
      'bg-gradient-to-br from-gray-100/95 via-gray-100/90 to-gray-50/95 border-blue-500/30',
    header: 'bg-white/60 border-blue-500/20',
    text: 'text-gray-700',
    filename:
      'bg-blue-500/10 border-blue-500/20 text-gray-700',
    copyBtn:
      'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 hover:border-blue-400/50',
    lineNo:
      'bg-white/40 border-blue-500/10 text-gray-400',
    copyIcon: 'text-gray-500 group-hover:text-blue-500',
    copyText: 'text-gray-500 group-hover:text-blue-500',
    glow: 'bg-blue-500/5',
    topGlow: 'from-transparent via-blue-500/50 to-transparent'
  }
} as const

export const CodeEditor: React.FC<CodeEditorProps> = ({
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
  className = '',
  onCopy
}) => {
  const [copied, setCopied] = useState(false)
  const t = THEME[theme]

  // 预计算行与行号，避免每次 render split
  const lines = useMemo(() => code.split('\n'), [code])
  const lineCount = lines.length

  const handleCopy = async () => {
    let ok = false
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code)
        ok = true
      } else {
        // 回退：使用隐藏 textarea 复制
        const ta = document.createElement('textarea')
        ta.value = code
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        ok = document.execCommand('copy')
        document.body.removeChild(ta)
      }
    } catch {
      ok = false
    }
    setCopied(ok)
    onCopy?.(ok)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      role="region"
      aria-label={`${filename} 代码示例（${language}）`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl overflow-hidden border shadow-2xl ${t.container} ${className}`}
      style={{
        boxShadow:
          theme === 'dark'
            ? '0 25px 50px -12px rgba(168, 85, 247, 0.1)'
            : '0 25px 50px -12px rgba(59, 130, 246, 0.1)'
      }}
      data-language={language}
      data-readonly={readOnly}
    >
      {/* 顶部光晕（静态类，避免动态拼接） */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${t.topGlow}`} />

      {/* 头部 */}
      <div className={`flex items-center justify-between px-5 py-3.5 ${t.header} backdrop-blur-sm border-b`}>
        <div className="flex items-center gap-3">
          {/* macOS 三色按钮（纯装饰） */}
          <div className="flex gap-2">
            <motion.div className="w-3 h-3 bg-red-500 rounded-full" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} />
            <motion.div className="w-3 h-3 bg-yellow-500 rounded-full" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} />
            <motion.div className="w-3 h-3 bg-green-500 rounded-full" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} />
          </div>

          {/* 文件名 */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-md border ${t.filename}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${theme === 'dark' ? 'bg-purple-400' : 'bg-blue-400'}`} />
            <span className="text-sm font-medium">{filename}</span>
          </div>
        </div>

        {/* 复制按钮（含回退） */}
        <motion.button
          type="button"
          onClick={handleCopy}
          aria-live="polite"
          className={`group relative px-3 py-1.5 rounded-lg transition-all ${t.copyBtn}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="text-green-400"
                >
                  <Check className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className={t.copyIcon}
                >
                  <Copy className="w-4 h-4" />
                </motion.span>
              )}
            </AnimatePresence>
            <span className={`text-xs transition-colors ${t.copyText}`}>
              {copied ? '已复制' : '复制'}
            </span>
          </div>
        </motion.button>
      </div>

      {/* 内容区 */}
      <div className="relative">
        {/* 行号列 */}
        <div className={`absolute left-0 top-0 bottom-0 w-12 border-r flex flex-col py-6 text-right pr-3 ${t.lineNo}`}>
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i} className="text-xs leading-6 font-mono select-none">
              {i + 1}
            </span>
          ))}
        </div>

        {/* 代码文本 */}
        <pre className="pl-16 pr-6 py-6 text-sm overflow-x-auto text-left">
          <code className={`font-mono leading-6 whitespace-pre ${t.text}`}>
            {code}
          </code>
        </pre>
      </div>

      {/* 装饰性光效 */}
      <div className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl ${t.glow}`} />
    </motion.div>
  )
}

CodeEditor.displayName = 'CodeEditor'
export default CodeEditor
