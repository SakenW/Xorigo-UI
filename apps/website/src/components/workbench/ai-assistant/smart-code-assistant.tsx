'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import {
  Code,
  Zap,
  CheckCircle,
  AlertCircle,
  XCircle,
  Lightbulb,
  TrendingUp,
  Download,
  Copy,
  Check,
  Play,
  Settings,
  FileText,
  Shield,
  Rocket,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  RefreshCw,
  BookOpen
} from 'lucide-react'
import { Button } from '@xorigo-ui/core'
import { Card } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@xorigo-ui/core'
import type {
  CodeAnalysisRequest,
  CodeAnalysisResult,
  CodeIssue,
  CodeSuggestion,
  BestPracticeRecommendation
} from '@/types/ai-assistant'
import { aiAssistantService } from '@/services/ai-assistant-service'

// ============================================================================
// 样式变体定义
// ============================================================================

const issueVariants = cva(
  'flex items-start gap-3 p-4 rounded-lg border transition-all duration-200',
  {
    variants: {
      severity: {
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      }
    }
  }
)

const suggestionVariants = cva(
  'group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 transition-all duration-200 hover:shadow-lg cursor-pointer',
  {
    variants: {
      impact: {
        high: 'border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700',
        medium: 'border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700',
        low: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }
    }
  }
)

// ============================================================================
// 组件属性接口
// ============================================================================

interface SmartCodeAssistantProps {
  className?: string
  initialCode?: string
  language?: 'typescript' | 'javascript' | 'jsx' | 'tsx'
  onAnalyze?: (result: CodeAnalysisResult) => void
  onApplyFix?: (fix: any) => void
  showOptimizedCode?: boolean
  autoAnalyze?: boolean
}

// ============================================================================
// 代码编辑器组件
// ============================================================================

interface CodeEditorProps {
  code: string
  language: string
  onChange: (code: string) => void
  placeholder?: string
  readOnly?: boolean
  lines?: number
}

function CodeEditor({
  code,
  language,
  onChange,
  placeholder = "在此输入您的代码...",
  readOnly = false,
  lines = 20
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.currentTarget
      const start = target.selectionStart
      const end = target.selectionEnd
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      onChange(newCode)
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2
      }, 0)
    }
  }, [code, onChange])

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      {/* 行号 */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800 text-gray-500 text-xs font-mono leading-6 pt-4 pb-4 select-none">
        {Array.from({ length: Math.max(lines, code.split('\n').length) }, (_, i) => (
          <div key={i + 1} className="text-right pr-2">
            {i + 1}
          </div>
        ))}
      </div>

      {/* 代码输入区域 */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        readOnly={readOnly}
        className={cn(
          "w-full bg-transparent text-gray-100 font-mono text-sm leading-6 pt-4 pb-4 pl-14 pr-4 resize-none focus:outline-none",
          readOnly && "cursor-default"
        )}
        style={{ minHeight: `${lines * 24}px` }}
        spellCheck={false}
      />
    </div>
  )
}

// ============================================================================
// 代码问题卡片
// ============================================================================

interface CodeIssueCardProps {
  issue: CodeIssue
  onApplyFix?: (fix: any) => void
}

function CodeIssueCard({ issue, onApplyFix }: CodeIssueCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getSeverityIcon = () => {
    switch (issue.severity) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Lightbulb className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(issueVariants({ severity: issue.severity }))}
    >
      <div className="flex-1">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getSeverityIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {issue.title}
              </h4>
              <Badge variant="outline" className="text-xs">
                {issue.type}
              </Badge>
              {issue.line && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  行 {issue.line}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {issue.description}
            </p>

            {/* 修复建议 */}
            {issue.fix && (
              <div className="mt-3">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-2"
                >
                  <Settings className="w-4 h-4" />
                  {showDetails ? '收起修复方案' : '查看修复方案'}
                </button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            修复方案
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              置信度: {Math.round(issue.fix.confidence * 100)}%
                            </span>
                            {issue.fix.autoApplicable && (
                              <Badge variant="default" className="text-xs">
                                可自动修复
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {issue.fix.description}
                        </p>
                        {issue.fix.code && (
                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                              <code>{issue.fix.code}</code>
                            </pre>
                            <button
                              onClick={() => onApplyFix?.(issue.fix)}
                              className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                            >
                              应用修复
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 代码建议卡片
// ============================================================================

interface CodeSuggestionCardProps {
  suggestion: CodeSuggestion
  onApplySuggestion?: (suggestion: CodeSuggestion) => void
}

function CodeSuggestionCard({ suggestion, onApplySuggestion }: CodeSuggestionCardProps) {
  const [showCodeExample, setShowCodeExample] = useState(false)

  const getImpactColor = () => {
    switch (suggestion.impact) {
      case 'high': return 'text-green-600 dark:text-green-400'
      case 'medium': return 'text-blue-600 dark:text-blue-400'
      case 'low': return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getEffortColor = () => {
    switch (suggestion.effort) {
      case 'low': return 'text-green-600 dark:text-green-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'high': return 'text-red-600 dark:text-red-400'
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onApplySuggestion?.(suggestion)}
      className={cn(suggestionVariants({ impact: suggestion.impact }))}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {suggestion.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-medium", getImpactColor())}>
                影响: {suggestion.impact}
              </span>
              <span className={cn("text-xs font-medium", getEffortColor())}>
                工作量: {suggestion.effort}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {suggestion.description}
          </p>

          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              {suggestion.benefit}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowCodeExample(!showCodeExample)
            }}
            className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Code className="w-4 h-4" />
            {showCodeExample ? '收起代码示例' : '查看代码示例'}
          </button>

          <AnimatePresence>
            {showCodeExample && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">优化前:</h4>
                    <pre className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-2 rounded text-xs">
                      <code>{suggestion.exampleBefore}</code>
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">优化后:</h4>
                    <pre className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-2 rounded text-xs">
                      <code>{suggestion.exampleAfter}</code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 最佳实践推荐
// ============================================================================

interface BestPracticeCardProps {
  practice: BestPracticeRecommendation
}

function BestPracticeCard({ practice }: BestPracticeCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getImportanceColor = () => {
    switch (practice.importance) {
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      case 'important': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
      case 'recommended': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    }
  }

  const getCategoryIcon = () => {
    switch (practice.category) {
      case 'react': return <Rocket className="w-4 h-4" />
      case 'typescript': return <Code className="w-4 h-4" />
      case 'accessibility': return <Shield className="w-4 h-4" />
      case 'performance': return <Zap className="w-4 h-4" />
      case 'security': return <Shield className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
          {getCategoryIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {practice.title}
            </h3>
            <Badge className={getImportanceColor()}>
              {practice.importance}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {practice.description}
          </p>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <BookOpen className="w-4 h-4" />
              {showDetails ? '收起资源' : '查看资源'}
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {practice.resources.length} 个资源
            </span>
          </div>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="space-y-2">
                  {practice.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        {resource.type === 'documentation' && <FileText className="w-4 h-4 text-blue-500" />}
                        {resource.type === 'example' && <Code className="w-4 h-4 text-green-500" />}
                        {resource.type === 'tutorial' && <BookOpen className="w-4 h-4 text-purple-500" />}
                        {resource.type === 'tool' && <Settings className="w-4 h-4 text-orange-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {resource.title}
                        </p>
                        {resource.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {resource.description}
                          </p>
                        )}
                      </div>
                      {resource.url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(resource.url, '_blank')}
                        >
                          打开
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 主组件
// ============================================================================

export function SmartCodeAssistant({
  className,
  initialCode = '',
  language = 'typescript',
  onAnalyze,
  onApplyFix,
  showOptimizedCode = true,
  autoAnalyze = false
}: SmartCodeAssistantProps) {
  const [code, setCode] = useState(initialCode)
  const [analysisResult, setAnalysisResult] = useState<CodeAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedTab, setSelectedTab] = useState('issues')
  const [showOptimized, setShowOptimized] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  // 代码分析
  const analyzeCode = useCallback(async () => {
    if (!code.trim()) return

    setIsAnalyzing(true)
    try {
      const request: CodeAnalysisRequest = {
        code,
        language,
        context: {
          framework: 'React',
          libraries: ['@xorigo-ui/core'],
          projectType: 'component-library'
        },
        analysisType: 'optimization'
      }

      const result = await aiAssistantService.analyzeCode(request)
      setAnalysisResult(result)
      onAnalyze?.(result)
    } catch (error) {
      console.error('代码分析失败:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [code, language, onAnalyze])

  // 自动分析
  const debouncedAnalyze = useMemo(() => {
    if (!autoAnalyze) return null
    const timeoutId = setTimeout(() => {
      analyzeCode()
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [code, autoAnalyze, analyzeCode])

  // 处理修复应用
  const handleApplyFix = useCallback((fix: any) => {
    if (fix.type === 'replace' && fix.code) {
      setCode(fix.code)
      onApplyFix?.(fix)
    }
  }, [onApplyFix])

  // 复制代码
  const handleCopyCode = useCallback(async (codeToCopy: string) => {
    await navigator.clipboard.writeText(codeToCopy)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }, [])

  // 应用优化后的代码
  const handleApplyOptimizedCode = useCallback(() => {
    if (analysisResult?.optimizedCode) {
      setCode(analysisResult.optimizedCode)
    }
  }, [analysisResult])

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              智能代码助手
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI驱动的代码分析和优化建议
            </p>
          </div>
        </div>
        <Button
          onClick={analyzeCode}
          disabled={isAnalyzing || !code.trim()}
          className="flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              分析中...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              分析代码
            </>
          )}
        </Button>
      </div>

      {/* 代码编辑器 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            代码输入
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="jsx">JSX</option>
              <option value="tsx">TSX</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyCode(code)}
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        <CodeEditor
          code={code}
          language={language}
          onChange={setCode}
          placeholder="在此输入您的React组件代码..."
        />
      </div>

      {/* 分析结果 */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 总览卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总体评分</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {analysisResult.summary.overallScore}/100
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">发现问题</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {analysisResult.summary.issuesFound}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">优化建议</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {analysisResult.summary.suggestionsCount}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">预期提升</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {analysisResult.summary.estimatedImprovement}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* 详细分析 */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="issues" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                问题检测
                {analysisResult.issues.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs rounded-full">
                    {analysisResult.issues.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                优化建议
                {analysisResult.suggestions.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs rounded-full">
                    {analysisResult.suggestions.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="practices" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                最佳实践
                {analysisResult.bestPractices.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full">
                    {analysisResult.bestPractices.length}
                  </span>
                )}
              </TabsTrigger>
              {showOptimizedCode && analysisResult.optimizedCode && (
                <TabsTrigger value="optimized" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  优化代码
                </TabsTrigger>
              )}
            </TabsList>

            {/* 问题检测 */}
            <TabsContent value="issues" className="mt-6">
              {analysisResult.issues.length > 0 ? (
                <div className="space-y-3">
                  {analysisResult.issues.map((issue, index) => (
                    <CodeIssueCard
                      key={issue.id}
                      issue={issue}
                      onApplyFix={handleApplyFix}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    太棒了！没有发现任何代码问题
                  </p>
                </div>
              )}
            </TabsContent>

            {/* 优化建议 */}
            <TabsContent value="suggestions" className="mt-6">
              {analysisResult.suggestions.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {analysisResult.suggestions.map((suggestion, index) => (
                    <CodeSuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      onApplySuggestion={(s) => {
                        // 应用建议的逻辑
                        console.log('应用建议:', s)
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Lightbulb className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    当前代码已经很好了，暂无优化建议
                  </p>
                </div>
              )}
            </TabsContent>

            {/* 最佳实践 */}
            <TabsContent value="practices" className="mt-6">
              {analysisResult.bestPractices.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {analysisResult.bestPractices.map((practice, index) => (
                    <BestPracticeCard key={practice.id} practice={practice} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    暂无相关的最佳实践推荐
                  </p>
                </div>
              )}
            </TabsContent>

            {/* 优化代码 */}
            {showOptimizedCode && analysisResult.optimizedCode && (
              <TabsContent value="optimized" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      优化后的代码
                    </h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowOptimized(!showOptimized)}
                      >
                        {showOptimized ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyCode(analysisResult.optimizedCode!)}
                      >
                        {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={handleApplyOptimizedCode}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        应用优化代码
                      </Button>
                    </div>
                  </div>
                  <CodeEditor
                    code={analysisResult.optimizedCode}
                    language={language}
                    onChange={() => {}}
                    readOnly={true}
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      )}
    </div>
  )
}