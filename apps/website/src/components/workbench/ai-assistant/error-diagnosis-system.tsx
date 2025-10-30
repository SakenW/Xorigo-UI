'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import {
  AlertTriangle,
  XCircle,
  CheckCircle,
  Bug,
  Search,
  Code,
  FileText,
  Lightbulb,
  Shield,
  Wrench,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Zap,
  Clock,
  Target,
  Activity
} from 'lucide-react'
import { Button } from '@xorigo-ui/core'
import { Card } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@xorigo-ui/core'
import type {
  ErrorDiagnosisRequest,
  ErrorDiagnosisResult,
  ErrorSolution,
  ErrorPrevention,
  ErrorResource
} from '@/types/ai-assistant'
import { aiAssistantService } from '@/services/ai-assistant-service'

// ============================================================================
// 样式变体定义
// ============================================================================

const errorCardVariants = cva(
  'flex items-start gap-4 p-4 rounded-xl border transition-all duration-200',
  {
    variants: {
      severity: {
        critical: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        error: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      }
    }
  }
)

const solutionVariants = cva(
  'group relative bg-white dark:bg-gray-800 rounded-xl border p-4 transition-all duration-200 hover:shadow-lg cursor-pointer',
  {
    variants: {
      type: {
        fix: 'border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700',
        workaround: 'border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700',
        refactor: 'border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700'
      }
    }
  }
)

// ============================================================================
// 组件属性接口
// ============================================================================

interface ErrorDiagnosisSystemProps {
  className?: string
  onErrorDiagnosed?: (result: ErrorDiagnosisResult) => void
  onSolutionApply?: (solution: ErrorSolution) => void
  initialError?: {
    message: string
    stack?: string
    type?: string
  }
}

// ============================================================================
// 错误输入组件
// ============================================================================

interface ErrorInputProps {
  onSubmit: (error: ErrorDiagnosisRequest) => void
  initialError?: {
    message: string
    stack?: string
    type?: string
  }
}

function ErrorInput({ onSubmit, initialError }: ErrorInputProps) {
  const [errorMessage, setErrorMessage] = useState(initialError?.message || '')
  const [errorStack, setErrorStack] = useState(initialError?.stack || '')
  const [errorType, setErrorType] = useState(initialError?.type || '')
  const [contextCode, setContextCode] = useState('')

  const handleSubmit = useCallback(() => {
    if (!errorMessage.trim()) return

    onSubmit({
      error: {
        message: errorMessage.trim(),
        stack: errorStack.trim() || undefined,
        type: errorType.trim() || undefined
      },
      context: {
        environment: 'development'
      },
      code: contextCode.trim() || undefined
    })
  }, [errorMessage, errorStack, errorType, contextCode])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            错误信息 *
          </label>
          <textarea
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
            placeholder="请粘贴具体的错误信息..."
            className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            错误堆栈（可选）
          </label>
          <textarea
            value={errorStack}
            onChange={(e) => setErrorStack(e.target.value)}
            placeholder="错误堆栈信息..."
            className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none font-mono text-xs"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            错误类型（可选）
          </label>
          <Input
            value={errorType}
            onChange={(e) => setErrorType(e.target.value)}
            placeholder="例如: TypeError, ReferenceError..."
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            相关代码（可选）
          </label>
          <textarea
            value={contextCode}
            onChange={(e) => setContextCode(e.target.value)}
            placeholder="出错的代码片段..."
            className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none font-mono text-xs"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={!errorMessage.trim()}
          className="flex items-center gap-2 px-6"
        >
          <Search className="w-4 h-4" />
          开始诊断
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// 错误诊断结果展示
// ============================================================================

interface DiagnosisResultProps {
  result: ErrorDiagnosisResult
  onSolutionApply: (solution: ErrorSolution) => void
}

function DiagnosisResult({ result, onSolutionApply }: DiagnosisResultProps) {
  const [expandedSolution, setExpandedSolution] = useState<string | null>(null)
  const [expandedPrevention, setExpandedPrevention] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)

  const getSeverityColor = () => {
    switch (result.diagnosis.severity) {
      case 'critical': return 'text-red-600 dark:text-red-400'
      case 'error': return 'text-orange-600 dark:text-orange-400'
      case 'warning': return 'text-yellow-600 dark:text-yellow-400'
    }
  }

  const getSeverityBg = () => {
    switch (result.diagnosis.severity) {
      case 'critical': return 'bg-red-50 dark:bg-red-900/20'
      case 'error': return 'bg-orange-50 dark:bg-orange-900/20'
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20'
    }
  }

  const getTypeIcon = () => {
    switch (result.diagnosis.type) {
      case 'syntax': return <Code className="w-5 h-5" />
      case 'runtime': return <Bug className="w-5 h-5" />
      case 'logic': return <Target className="w-5 h-5" />
      case 'type': return <FileText className="w-5 h-5" />
      case 'dependency': return <AlertTriangle className="w-5 h-5" />
      case 'performance': return <Activity className="w-5 h-5" />
      default: return <XCircle className="w-5 h-5" />
    }
  }

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 诊断结果总览 */}
      <div className={cn("p-6 rounded-xl border", getSeverityBg(), result.diagnosis.severity === 'critical' ? 'border-red-200 dark:border-red-800' : result.diagnosis.severity === 'error' ? 'border-orange-200 dark:border-orange-800' : 'border-yellow-200 dark:border-yellow-800')}>
        <div className="flex items-start gap-4">
          <div className={cn("flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center", getSeverityBg())}>
            {getTypeIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                错误诊断结果
              </h3>
              <Badge className={cn(getSeverityColor(), "bg-transparent border-current")}>
                {result.diagnosis.severity}
              </Badge>
              <Badge variant="outline">
                {result.diagnosis.type}
              </Badge>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  问题解释
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {result.diagnosis.explanation}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  根本原因
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {result.diagnosis.rootCause}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">置信度:</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          i < Math.floor(result.diagnosis.confidence * 5)
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {Math.round(result.diagnosis.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 解决方案 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          解决方案 ({result.solutions.length})
        </h3>
        <div className="grid gap-4">
          {result.solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(solutionVariants({ type: solution.type }))}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {solution.title}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {solution.type}
                  </Badge>
                  <Badge className={cn(
                    "text-xs",
                    solution.applicability === 'immediate' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                    solution.applicability === 'planned' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                  )}>
                    {solution.applicability === 'immediate' ? '立即应用' :
                     solution.applicability === 'planned' ? '计划应用' : '条件应用'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    置信度: {Math.round(solution.confidence * 100)}%
                  </span>
                  <button
                    onClick={() => setExpandedSolution(
                      expandedSolution === solution.id ? null : solution.id
                    )}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {expandedSolution === solution.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {solution.description}
              </p>

              <AnimatePresence>
                {expandedSolution === solution.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      {/* 解决步骤 */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          解决步骤
                        </h5>
                        <ol className="space-y-1 ml-4">
                          {solution.steps.map((step, stepIndex) => (
                            <li
                              key={stepIndex}
                              className="text-sm text-gray-600 dark:text-gray-400 list-decimal"
                            >
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* 代码示例 */}
                      {solution.codeExample && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            代码示例
                          </h5>
                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                              <code>{solution.codeExample}</code>
                            </pre>
                            <div className="absolute top-2 right-2 flex gap-1">
                              <button
                                onClick={() => handleCopyCode(solution.codeExample!)}
                                className="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                              >
                                {copiedCode ? (
                                  <Check className="w-3 h-3 text-green-400" />
                                ) : (
                                  <Copy className="w-3 h-3 text-gray-300" />
                                )}
                              </button>
                              <Button
                                size="sm"
                                onClick={() => onSolutionApply(solution)}
                                className="px-2 py-1 text-xs"
                              >
                                应用修复
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 预防措施 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          预防措施 ({result.prevention.length})
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {result.prevention.map((prevention, index) => (
            <motion.div
              key={prevention.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {prevention.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {prevention.description}
                  </p>

                  {/* 实践列表 */}
                  {prevention.practices.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        推荐实践
                      </h5>
                      <ul className="space-y-1 ml-2">
                        {prevention.practices.map((practice, practiceIndex) => (
                          <li
                            key={practiceIndex}
                            className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1"
                          >
                            <span className="text-blue-500 mt-0.5">•</span>
                            {practice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 工具推荐 */}
                  {prevention.tools && prevention.tools.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        推荐工具
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {prevention.tools.map((tool, toolIndex) => (
                          <Badge
                            key={toolIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 监控建议 */}
                  {prevention.monitoring && prevention.monitoring.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        监控建议
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {prevention.monitoring.map((monitor, monitorIndex) => (
                          <Badge
                            key={monitorIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {monitor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 相关资源 */}
      {result.relatedResources.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            相关资源 ({result.relatedResources.length})
          </h3>
          <div className="grid gap-3">
            {result.relatedResources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-shrink-0">
                  {resource.type === 'documentation' && <FileText className="w-4 h-4 text-blue-500" />}
                  {resource.type === 'example' && <Code className="w-4 h-4 text-green-500" />}
                  {resource.type === 'discussion' && <Lightbulb className="w-4 h-4 text-purple-500" />}
                  {resource.type === 'tool' && <Wrench className="w-4 h-4 text-orange-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {resource.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {resource.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          i < Math.floor(resource.relevance * 5)
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        )}
                      />
                    ))}
                  </div>
                  {resource.url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ============================================================================
// 主组件
// ============================================================================

export function ErrorDiagnosisSystem({
  className,
  onErrorDiagnosed,
  onSolutionApply,
  initialError
}: ErrorDiagnosisSystemProps) {
  const [isDiagnosing, setIsDiagnosing] = useState(false)
  const [diagnosisResult, setDiagnosisResult] = useState<ErrorDiagnosisResult | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const handleDiagnosis = useCallback(async (request: ErrorDiagnosisRequest) => {
    setIsDiagnosing(true)
    setError(null)

    try {
      const result = await aiAssistantService.diagnoseError(request)
      setDiagnosisResult(result)
      onErrorDiagnosed?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('诊断失败')
      setError(error)
      console.error('错误诊断失败:', err)
    } finally {
      setIsDiagnosing(false)
    }
  }, [onErrorDiagnosed])

  const handleSolutionApply = useCallback((solution: ErrorSolution) => {
    onSolutionApply?.(solution)
    // 这里可以添加应用解决方案的逻辑
    console.log('应用解决方案:', solution)
  }, [onSolutionApply])

  const handleReset = useCallback(() => {
    setDiagnosisResult(null)
    setError(null)
  }, [])

  return (
    <div className={cn("w-full max-w-6xl mx-auto space-y-6", className)}>
      {/* 头部 */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Bug className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            AI 错误诊断系统
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          智能分析代码错误，提供详细的诊断结果和修复建议
        </p>
      </div>

      {!diagnosisResult && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              请输入错误信息
            </h3>
            <ErrorInput
              onSubmit={handleDiagnosis}
              initialError={initialError}
            />
          </Card>
        </motion.div>
      )}

      {/* 诊断中状态 */}
      {isDiagnosing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="relative w-16 h-16 mb-4">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            AI正在分析错误...
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            这可能需要几秒钟时间
          </p>
        </motion.div>
      )}

      {/* 错误状态 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                诊断失败
              </h3>
            </div>
            <p className="text-red-700 dark:text-red-300 mb-4">
              {error.message}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                重新输入
              </Button>
              <Button
                onClick={() => handleDiagnosis({
                  error: { message: '', stack: error.stack },
                  context: { environment: 'development' }
                })}
              >
                重试诊断
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* 诊断结果 */}
      {diagnosisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                诊断完成
              </span>
            </div>
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              诊断新错误
            </Button>
          </div>

          <DiagnosisResult
            result={diagnosisResult}
            onSolutionApply={handleSolutionApply}
          />
        </motion.div>
      )}
    </div>
  )
}