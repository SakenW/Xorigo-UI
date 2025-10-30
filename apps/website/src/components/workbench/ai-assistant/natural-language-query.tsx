'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import {
  Search,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Loader2,
  Lightbulb,
  Bot,
  User,
  Clock,
  TrendingUp
} from 'lucide-react'
import { Button } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import type { AIResponse, AISuggestion } from '@/types/ai-assistant'
import { useAIAssistant } from '@/services/ai-assistant-service'

// ============================================================================
// 样式变体定义
// ============================================================================

const queryInputVariants = cva(
  'relative w-full transition-all duration-300 rounded-2xl overflow-hidden backdrop-blur-sm',
  {
    variants: {
      focused: {
        true: [
          'ring-2 ring-inset ring-blue-500/20',
          'shadow-[0_8px_32px_rgba(59,130,246,0.12),0_4px_16px_rgba(59,130,246,0.08)]',
          'bg-white/95 dark:bg-gray-800/95'
        ].join(' '),
        false: [
          'ring-1 ring-inset ring-gray-200 dark:ring-gray-700',
          'shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]',
          'hover:ring-gray-300 dark:hover:ring-gray-600',
          'hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.06)]',
          'bg-white/90 dark:bg-gray-800/90'
        ].join(' ')
      },
      size: {
        sm: 'h-12 text-sm',
        md: 'h-14 text-base',
        lg: 'h-16 text-lg'
      }
    },
    defaultVariants: {
      focused: false,
      size: 'md'
    }
  }
)

const suggestionVariants = cva(
  'group relative flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200',
  {
    variants: {
      priority: {
        high: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30',
        medium: 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30',
        low: 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
      }
    }
  }
)

// ============================================================================
// 组件属性接口
// ============================================================================

interface NaturalLanguageQueryProps {
  className?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  onQuerySubmit?: (query: string) => void
  onSuggestionSelect?: (suggestion: AISuggestion) => void
  showVoiceInput?: boolean
  showSuggestions?: boolean
  suggestions?: string[]
  autoFocus?: boolean
  disabled?: boolean
}

// ============================================================================
// 查询建议组件
// ============================================================================

function QuerySuggestions({
  suggestions,
  onSelect,
  isVisible
}: {
  suggestions: string[]
  onSelect: (suggestion: string) => void
  isVisible: boolean
}) {
  return (
    <AnimatePresence>
      {isVisible && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 z-50 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-2">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              <Lightbulb className="w-4 h-4" />
              <span>建议查询</span>
            </div>
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-3 h-3 text-blue-500" />
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// AI 响应展示组件
// ============================================================================

interface AIResponseDisplayProps {
  response: AIResponse
  onSuggestionClick: (suggestion: AISuggestion) => void
}

function AIResponseDisplay({ response, onSuggestionClick }: AIResponseDisplayProps) {
  const [expandedSuggestions, setExpandedSuggestions] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 space-y-4"
    >
      {/* 主要响应内容 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">AI 助手</span>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{response.processingTime}ms</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        i < Math.floor(response.confidence * 5)
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {response.response}
            </p>

            {/* 意图分析标签 */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-md">
                {response.intent.type}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-md">
                {response.intent.complexity}
              </span>
              {response.intent.estimatedEffort && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-md">
                  {response.intent.estimatedEffort} effort
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI 建议 */}
      {response.suggestions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                智能建议 ({response.suggestions.length})
              </span>
            </div>
            <button
              onClick={() => setExpandedSuggestions(!expandedSuggestions)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              {expandedSuggestions ? '收起' : '展开'}
            </button>
          </div>

          <AnimatePresence>
            {expandedSuggestions && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-2 space-y-2">
                  {response.suggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onSuggestionClick(suggestion)}
                      className={cn(suggestionVariants({ priority: suggestion.priority }))}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {suggestion.title}
                          </span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            suggestion.priority === 'high' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                            suggestion.priority === 'medium' ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
                            "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          )}>
                            {suggestion.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {suggestion.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Button size="sm" variant="outline">
                          应用
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}

// ============================================================================
// 主组件
// ============================================================================

export function NaturalLanguageQuery({
  className,
  placeholder = "向AI助手描述您的需求，例如：我需要一个用户登录表单",
  size = 'md',
  onQuerySubmit,
  onSuggestionSelect,
  showVoiceInput = true,
  showSuggestions = true,
  suggestions = [],
  autoFocus = false,
  disabled = false
}: NaturalLanguageQueryProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [lastResponse, setLastResponse] = useState<AIResponse | null>(null)
  const [showQuerySuggestions, setShowQuerySuggestions] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const { isProcessing, processQuery } = useAIAssistant()

  // 默认建议查询
  const defaultSuggestions = [
    "我需要一个用户登录表单，包含用户名、密码和记住我选项",
    "推荐一个电商产品卡片组件，需要显示图片、标题、价格和购买按钮",
    "如何创建一个响应式的导航栏，支持移动端菜单",
    "我需要一个数据表格，支持排序、筛选和分页功能",
    "帮我优化这段React代码的性能",
    "我的组件出现了渲染错误，请帮我诊断问题"
  ]

  const activeSuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions

  // 自动聚焦
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // 处理查询提交
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!query.trim() || isProcessing || disabled) return

    try {
      const response = await processQuery(query.trim())
      setLastResponse(response)
      onQuerySubmit?.(query.trim())
      setQuery('')
      setShowQuerySuggestions(false)
    } catch (error) {
      console.error('AI查询失败:', error)
    }
  }, [query, isProcessing, disabled, processQuery, onQuerySubmit])

  // 处理建议选择
  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setQuery(suggestion)
    setShowQuerySuggestions(false)
    inputRef.current?.focus()
  }, [])

  // 处理AI建议点击
  const handleAISuggestionClick = useCallback((suggestion: AISuggestion) => {
    onSuggestionSelect?.(suggestion)
  }, [onSuggestionSelect])

  // 处理语音输入
  const handleVoiceInput = useCallback(() => {
    if (isRecording) {
      setIsRecording(false)
      // 这里可以停止录音并处理语音识别结果
    } else {
      setIsRecording(true)
      // 这里可以开始录音
      // 模拟语音识别
      setTimeout(() => {
        setQuery("我需要一个现代化的登录表单设计")
        setIsRecording(false)
      }, 2000)
    }
  }, [isRecording])

  // 处理输入框焦点
  const handleFocus = useCallback(() => {
    setIsFocused(true)
    if (showSuggestions && query.trim() === '') {
      setShowQuerySuggestions(true)
    }
  }, [showSuggestions, query])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    // 延迟隐藏建议，以便点击建议项
    setTimeout(() => {
      setShowQuerySuggestions(false)
    }, 150)
  }, [])

  // 处理键盘快捷键
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape') {
      setShowQuerySuggestions(false)
      inputRef.current?.blur()
    }
  }, [handleSubmit])

  return (
    <div className={cn("relative w-full max-w-4xl mx-auto", className)}>
      {/* 主输入区域 */}
      <div className="relative">
        <form onSubmit={handleSubmit} className="relative">
          <div className={cn(queryInputVariants({ focused: isFocused, size }))}>
            {/* 搜索图标 */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              {isProcessing ? (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {/* 输入框 */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isProcessing}
              className={cn(
                "w-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400",
                "pl-12 pr-32",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            />

            {/* 右侧按钮组 */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {/* 语音输入按钮 */}
              {showVoiceInput && (
                <motion.button
                  type="button"
                  onClick={handleVoiceInput}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isRecording
                      ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                  )}
                >
                  {isRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </motion.button>
              )}

              {/* 发送按钮 */}
              <motion.button
                type="submit"
                disabled={!query.trim() || isProcessing || disabled}
                whileHover={{ scale: query.trim() && !isProcessing && !disabled ? 1.05 : 1 }}
                whileTap={{ scale: query.trim() && !isProcessing && !disabled ? 0.95 : 1 }}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  query.trim() && !isProcessing && !disabled
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                )}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </motion.button>
            </div>

            {/* 语音录制动画 */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-red-500/10 dark:bg-red-500/20 rounded-2xl"
                >
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 8 }}
                          animate={{ height: [8, 24, 8] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.1
                          }}
                          className="w-1 bg-red-500 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-sm">正在录音...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>

        {/* 查询建议 */}
        {showSuggestions && (
          <QuerySuggestions
            suggestions={activeSuggestions}
            onSelect={handleSuggestionSelect}
            isVisible={showQuerySuggestions && !isProcessing}
          />
        )}
      </div>

      {/* AI 响应展示 */}
      <AnimatePresence>
        {lastResponse && (
          <AIResponseDisplay
            response={lastResponse}
            onSuggestionClick={handleAISuggestionClick}
          />
        )}
      </AnimatePresence>
    </div>
  )
}