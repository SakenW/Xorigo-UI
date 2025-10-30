'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import {
  Bot,
  MessageSquare,
  Search,
  Code,
  Bug,
  Sparkles,
  Settings,
  X,
  Maximize2,
  Minimize2,
  History,
  Star,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  ChevronRight,
  Send,
  User
} from 'lucide-react'
import { Button } from '@xorigo-ui/core'
import { Card } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@xorigo-ui/core'
import { NaturalLanguageQuery } from './natural-language-query'
import { ComponentRecommendationEngine } from './component-recommendation-engine'
import { SmartCodeAssistant } from './smart-code-assistant'
import { ErrorDiagnosisSystem } from './error-diagnosis-system'
import type {
  AIResponse,
  AISuggestion,
  ComponentRecommendation,
  RecommendedComponent,
  CodeAnalysisResult,
  ErrorDiagnosisResult,
  ErrorSolution,
  ConversationMessage
} from '@/types/ai-assistant'
import { useAIAssistant } from '@/services/ai-assistant-service'

// ============================================================================
// 样式变体定义
// ============================================================================

const panelVariants = cva(
  'fixed bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden transition-all duration-300',
  {
    variants: {
      position: {
        'bottom-right': 'bottom-4 right-4 rounded-t-2xl rounded-l-2xl',
        'bottom-left': 'bottom-4 left-4 rounded-t-2xl rounded-r-2xl',
        'top-right': 'top-4 right-4 rounded-b-2xl rounded-l-2xl',
        'top-left': 'top-4 left-4 rounded-b-2xl rounded-r-2xl',
        'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl'
      },
      size: {
        compact: 'w-80 h-96',
        normal: 'w-96 h-[32rem]',
        large: 'w-[48rem] h-[36rem]',
        fullscreen: 'w-[90vw] h-[90vh] max-w-7xl'
      },
      expanded: {
        true: '',
        false: ''
      }
    }
  }
)

const featureCardVariants = cva(
  'group relative bg-white dark:bg-gray-800 rounded-xl border p-4 transition-all duration-200 cursor-pointer hover:shadow-lg',
  {
    variants: {
      variant: {
        default: 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700',
        primary: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700',
        success: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700',
        warning: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 hover:border-yellow-300 dark:hover:border-yellow-700'
      }
    }
  }
)

// ============================================================================
// 组件属性接口
// ============================================================================

interface AIAssistantPanelProps {
  className?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
  size?: 'compact' | 'normal' | 'large' | 'fullscreen'
  defaultTab?: string
  onComponentSelect?: (component: RecommendedComponent) => void
  onSolutionSelect?: (solution: any) => void
  onClose?: () => void
  showMinimizeButton?: boolean
  showCloseButton?: boolean
}

// ============================================================================
// 聊天消息组件
// ============================================================================

interface ChatMessageProps {
  message: ConversationMessage
  isLatest?: boolean
}

function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isTyping = isLatest && message.role === 'assistant' && !message.content

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={cn(
        "max-w-[70%] rounded-2xl px-4 py-3",
        isUser
          ? "bg-blue-500 text-white rounded-br-sm"
          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm"
      )}>
        {isTyping ? (
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className={cn(
                  "w-2 h-2 rounded-full",
                  isUser ? "bg-white" : "bg-blue-500"
                )}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{message.content}</p>
        )}

        {message.metadata && (
          <div className="mt-2 pt-2 border-t border-current/20">
            <div className="flex items-center gap-2 text-xs opacity-70">
              <Clock className="w-3 h-3" />
              <span>{message.metadata.processingTime}ms</span>
              {message.metadata.confidence && (
                <>
                  <span>•</span>
                  <span>{Math.round(message.metadata.confidence * 100)}% 置信度</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.div>
  )
}

// ============================================================================
// 功能卡片组件
// ============================================================================

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
  variant?: 'default' | 'primary' | 'success' | 'warning'
  onClick: () => void
  stats?: {
    label: string
    value: string
  }[]
}

function FeatureCard({
  icon,
  title,
  description,
  badge,
  variant = 'default',
  onClick,
  stats
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(featureCardVariants({ variant }))}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {description}
          </p>

          {stats && stats.length > 0 && (
            <div className="flex items-center gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mt-3 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
            <span className="text-sm font-medium">开始使用</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 主组件
// ============================================================================

export function AIAssistantPanel({
  className,
  position = 'bottom-right',
  size = 'normal',
  defaultTab = 'home',
  onComponentSelect,
  onSolutionSelect,
  onClose,
  showMinimizeButton = true,
  showCloseButton = true
}: AIAssistantPanelProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [currentSize, setCurrentSize] = useState(size)

  const { state, isProcessing, processQuery } = useAIAssistant()

  // 处理查询提交
  const handleQuerySubmit = useCallback(async (query: string) => {
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    // 添加AI响应占位符
    const aiPlaceholder: ConversationMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiPlaceholder])

    try {
      const response = await processQuery(query)

      // 更新AI响应
      setMessages(prev => prev.map(msg =>
        msg.id === aiPlaceholder.id
          ? {
              ...msg,
              content: response.response,
              metadata: {
                intent: response.intent,
                suggestions: response.suggestions,
                processingTime: response.processingTime,
                confidence: response.confidence
              }
            }
          : msg
      ))
    } catch (error) {
      // 处理错误
      setMessages(prev => prev.map(msg =>
        msg.id === aiPlaceholder.id
          ? {
              ...msg,
              content: '抱歉，我遇到了一些问题。请稍后再试。'
            }
          : msg
      ))
    }
  }, [processQuery])

  // 处理AI建议选择
  const handleSuggestionSelect = useCallback((suggestion: AISuggestion) => {
    if (suggestion.action) {
      switch (suggestion.action.type) {
        case 'navigate-to':
          if (suggestion.action.payload.view === 'components') {
            setActiveTab('recommendations')
          }
          break
        case 'open-config':
          if (suggestion.action.payload.feature === 'code-analysis') {
            setActiveTab('code-assistant')
          } else if (suggestion.action.payload.feature === 'error-diagnosis') {
            setActiveTab('error-diagnosis')
          }
          break
        case 'apply-component':
          onComponentSelect?.(suggestion.action.payload)
          break
      }
    }
  }, [onComponentSelect])

  // 处理组件选择
  const handleComponentSelect = useCallback((component: RecommendedComponent) => {
    onComponentSelect?.(component)
    // 添加选择消息到聊天
    const message: ConversationMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `已选择组件: ${component.component.name}。您可以在右侧查看详细配置。`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, message])
  }, [onComponentSelect])

  // 处理解决方案应用
  const handleSolutionApply = useCallback((solution: ErrorSolution | any) => {
    onSolutionSelect?.(solution)
  }, [onSolutionSelect])

  // 切换展开状态
  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded)
    setCurrentSize(isExpanded ? size : 'large')
  }, [isExpanded, size])

  // 渲染主页内容
  const renderHomeContent = () => (
    <div className="p-6 space-y-6">
      {/* 欢迎信息 */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Bot className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            AI 智能助手
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          我是您的开发助手，可以帮您解决各种开发问题
        </p>
      </div>

      {/* 快速查询 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          有什么可以帮您的吗？
        </h3>
        <NaturalLanguageQuery
          onQuerySubmit={handleQuerySubmit}
          onSuggestionSelect={handleSuggestionSelect}
          showSuggestions={true}
          autoFocus={false}
        />
      </div>

      {/* 功能卡片 */}
      <div className="grid gap-4 md:grid-cols-2">
        <FeatureCard
          icon={<Search className="w-5 h-5" />}
          title="组件推荐"
          description="基于需求智能推荐最适合的组件组合"
          badge="AI"
          onClick={() => setActiveTab('recommendations')}
          stats={[
            { label: "推荐准确率", value: "95%" },
            { label: "响应时间", value: "<1s" }
          ]}
        />

        <FeatureCard
          icon={<Code className="w-5 h-5" />}
          title="代码助手"
          description="分析代码质量，提供优化建议"
          badge="智能"
          onClick={() => setActiveTab('code-assistant')}
          stats={[
            { label: "优化建议", value: "50+" },
            { label: "覆盖问题", value: "15种" }
          ]}
        />

        <FeatureCard
          icon={<Bug className="w-5 h-5" />}
          title="错误诊断"
          description="智能分析错误，提供修复方案"
          badge="精准"
          onClick={() => setActiveTab('error-diagnosis')}
          stats={[
            { label: "诊断准确率", value: "92%" },
            { label: "修复方案", value: "3-5个" }
          ]}
        />

        <FeatureCard
          icon={<MessageSquare className="w-5 h-5" />}
          title="智能对话"
          description="自然语言交流，解答开发问题"
          badge="24/7"
          onClick={() => setActiveTab('chat')}
          stats={[
            { label: "响应速度", value: "<2s" },
            { label: "满意度", value: "98%" }
          ]}
        />
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {state.statistics.totalQueries}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">总查询次数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {Math.round(state.statistics.successRate * 100)}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">成功率</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {state.statistics.componentRecommendations}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">组件推荐</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {state.statistics.issuesResolved}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">问题解决</div>
        </div>
      </div>
    </div>
  )

  // 渲染聊天内容
  const renderChatContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Bot className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                开始对话吧！我可以帮您解决各种开发问题。
              </p>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLatest={index === messages.length - 1}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && inputMessage.trim()) {
                handleQuerySubmit(inputMessage.trim())
                setInputMessage('')
              }
            }}
            placeholder="输入您的问题..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isProcessing}
          />
          <Button
            onClick={() => {
              if (inputMessage.trim()) {
                handleQuerySubmit(inputMessage.trim())
                setInputMessage('')
              }
            }}
            disabled={!inputMessage.trim() || isProcessing}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={cn(
        panelVariants({ position, size: currentSize, expanded: isExpanded }),
        className
      )}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              AI 智能助手
            </h2>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                state.isOnline ? "bg-green-500" : "bg-gray-400"
              )} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {state.isOnline ? '在线' : '离线'}
              </span>
              {isProcessing && (
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  处理中...
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {showMinimizeButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="p-1"
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          )}
          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 m-4">
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">首页</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">推荐</span>
          </TabsTrigger>
          <TabsTrigger value="code-assistant" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">代码</span>
          </TabsTrigger>
          <TabsTrigger value="error-diagnosis" className="flex items-center gap-2">
            <Bug className="w-4 h-4" />
            <span className="hidden sm:inline">诊断</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="home" className="h-full m-0">
            {renderHomeContent()}
          </TabsContent>

          <TabsContent value="recommendations" className="h-full m-0 overflow-y-auto">
            <ComponentRecommendationEngine
              onComponentSelect={handleComponentSelect}
              onCombinationSelect={(combination) => {
                // 处理组件组合选择
                console.log('Selected combination:', combination)
              }}
            />
          </TabsContent>

          <TabsContent value="code-assistant" className="h-full m-0 overflow-y-auto">
            <SmartCodeAssistant
              onAnalyze={(result) => {
                console.log('Code analysis result:', result)
              }}
              onApplyFix={handleSolutionApply}
              autoAnalyze={false}
            />
          </TabsContent>

          <TabsContent value="error-diagnosis" className="h-full m-0 overflow-y-auto">
            <ErrorDiagnosisSystem
              onErrorDiagnosed={(result) => {
                console.log('Error diagnosis result:', result)
              }}
              onSolutionApply={handleSolutionApply}
            />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  )
}