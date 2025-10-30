'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import {
  Bot,
  Lightbulb,
  Zap,
  Palette,
  Shield,
  Code,
  Cpu,
  Eye,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  Sparkles,
  Target,
  Gauge,
  Accessibility,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react'
import { cn } from '@/utils'

// AI建议类型定义
interface AISuggestion {
  id: string
  type: 'component' | 'performance' | 'design' | 'bestPractice' | 'accessibility'
  category: 'recommendation' | 'optimization' | 'warning' | 'enhancement'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
  suggestion: string
  codeExample?: string
  benefits: string[]
  relatedComponents?: string[]
  priority: number
  status: 'pending' | 'applied' | 'dismissed'
  feedback?: 'positive' | 'negative'
}

// AI分析结果接口
interface AIAnalysisResult {
  overallScore: number
  suggestions: AISuggestion[]
  insights: {
    componentUsage: { component: string; count: number; efficiency: number }[]
    performanceBottlenecks: string[]
    designImprovements: string[]
    accessibilityIssues: string[]
  }
  trends: {
    complexity: 'increasing' | 'stable' | 'decreasing'
    maintainability: 'good' | 'moderate' | 'needs-improvement'
    performance: 'optimal' | 'acceptable' | 'needs-optimization'
  }
}

interface AIAssistantProps {
  config: any
  components: string[]
  generatedCode: string
  onApplySuggestion?: (suggestion: AISuggestion) => void
  onRegenerateSuggestions?: () => void
  className?: string
}

export function AIAssistant({
  config,
  components,
  generatedCode,
  onApplySuggestion,
  onRegenerateSuggestions,
  className
}: AIAssistantProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // AI智能分析
  const analysisResult = useMemo((): AIAnalysisResult => {
    setIsAnalyzing(true)

    // 模拟AI分析过程
    const suggestions: AISuggestion[] = []

    // 组件推荐分析
    if (components.length < 3) {
      suggestions.push({
        id: 'comp-1',
        type: 'component',
        category: 'recommendation',
        title: '建议添加数据展示组件',
        description: '当前配置缺少数据展示组件，添加表格或列表组件可以提升用户体验',
        impact: 'medium',
        effort: 'low',
        suggestion: '考虑添加 Table 或 List 组件来展示结构化数据',
        benefits: ['提升数据展示能力', '改善用户体验', '增强功能性'],
        relatedComponents: ['Table', 'List', 'Card'],
        priority: 1,
        status: 'pending'
      })
    }

    // 性能优化建议
    if (generatedCode.length > 5000) {
      suggestions.push({
        id: 'perf-1',
        type: 'performance',
        category: 'optimization',
        title: '代码体积较大，建议优化',
        description: '生成的代码体积较大，可能影响加载性能',
        impact: 'high',
        effort: 'medium',
        suggestion: '考虑使用懒加载、代码分割和组件按需导入来优化性能',
        codeExample: `// 使用 React.lazy 进行懒加载
const LazyComponent = React.lazy(() => import('./LazyComponent'))

// 在渲染中使用
<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>`,
        benefits: ['减少初始加载时间', '改善用户体验', '提升性能评分'],
        priority: 2,
        status: 'pending'
      })
    }

    // 设计建议
    if (!config.designTokens || !config.designTokens.spacingScale) {
      suggestions.push({
        id: 'design-1',
        type: 'design',
        category: 'enhancement',
        title: '建议配置统一间距系统',
        description: '缺少间距系统配置，可能导致视觉不一致',
        impact: 'medium',
        effort: 'low',
        suggestion: '配置间距令牌以确保视觉一致性和节奏感',
        benefits: ['提升视觉一致性', '改善用户体验', '符合设计规范'],
        priority: 3,
        status: 'pending'
      })
    }

    // 可访问性建议
    if (!generatedCode.includes('aria-') && !generatedCode.includes('alt=')) {
      suggestions.push({
        id: 'a11y-1',
        type: 'accessibility',
        category: 'warning',
        title: '缺少可访问性属性',
        description: '检测到缺少ARIA属性和可访问性配置',
        impact: 'high',
        effort: 'medium',
        suggestion: '添加适当的ARIA属性、键盘导航支持和屏幕阅读器兼容性',
        codeExample: `// 添加可访问性属性
<button
  aria-label="关闭对话框"
  aria-describedby="dialog-description"
  onClick={handleClose}
>
  <XIcon aria-hidden="true" />
</button>

// 添加键盘导航
<div onKeyDown={handleKeyDown} tabIndex={0}>
  可聚焦内容
</div>`,
        benefits: ['提升可访问性', '符合WCAG标准', '扩大用户群体'],
        priority: 1,
        status: 'pending'
      })
    }

    // 最佳实践建议
    if (!generatedCode.includes('ErrorBoundary') && !generatedCode.includes('try-catch')) {
      suggestions.push({
        id: 'bp-1',
        type: 'bestPractice',
        category: 'recommendation',
        title: '建议添加错误处理机制',
        description: '缺少错误处理机制，可能影响应用稳定性',
        impact: 'medium',
        effort: 'medium',
        suggestion: '实现错误边界和错误处理机制以提升应用稳定性',
        codeExample: `// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}`,
        benefits: ['提升应用稳定性', '改善用户体验', '便于调试维护'],
        priority: 4,
        status: 'pending'
      })
    }

    // 智能组件组合建议
    if (components.includes('Form') && !components.includes('Button')) {
      suggestions.push({
        id: 'comp-2',
        type: 'component',
        category: 'recommendation',
        title: '表单建议添加按钮组件',
        description: '检测到表单组件但没有按钮，用户可能无法提交表单',
        impact: 'high',
        effort: 'low',
        suggestion: '为表单添加提交按钮和重置按钮',
        benefits: ['完善表单功能', '改善用户体验', '提升交互性'],
        relatedComponents: ['Button', 'Input'],
        priority: 1,
        status: 'pending'
      })
    }

    // 响应式设计建议
    if (!generatedCode.includes('responsive') && !generatedCode.includes('md:')) {
      suggestions.push({
        id: 'design-2',
        type: 'design',
        category: 'enhancement',
        title: '建议增强响应式设计',
        description: '建议添加更多响应式断点以适配不同设备',
        impact: 'medium',
        effort: 'medium',
        suggestion: '使用Tailwind的响应式前缀添加移动端适配',
        codeExample: `// 响应式设计示例
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="w-full md:w-auto">
    移动端全宽，桌面端自适应
  </div>
</div>

<button className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base">
  响应式按钮尺寸
</button>`,
        benefits: ['提升移动端体验', '扩大用户覆盖', '改善用户满意度'],
        priority: 5,
        status: 'pending'
      })
    }

    setTimeout(() => setIsAnalyzing(false), 1000)

    return {
      overallScore: Math.max(60, 100 - suggestions.length * 5),
      suggestions: suggestions.sort((a, b) => a.priority - b.priority),
      insights: {
        componentUsage: components.map(comp => ({
          component: comp,
          count: 1,
          efficiency: Math.random() * 40 + 60 // 60-100
        })),
        performanceBottlenecks: generatedCode.length > 5000 ? ['代码体积较大'] : [],
        designImprovements: config.designTokens ? [] : ['缺少设计令牌配置'],
        accessibilityIssues: generatedCode.includes('aria-') ? [] : ['缺少可访问性属性']
      },
      trends: {
        complexity: components.length > 5 ? 'increasing' : 'stable',
        maintainability: generatedCode.length > 3000 ? 'needs-improvement' : 'good',
        performance: generatedCode.length > 5000 ? 'needs-optimization' : 'optimal'
      }
    }
  }, [config, components, generatedCode])

  // 过滤建议
  const filteredSuggestions = useMemo(() => {
    if (activeCategory === 'all') return analysisResult.suggestions
    return analysisResult.suggestions.filter(s => s.type === activeCategory)
  }, [activeCategory, analysisResult.suggestions])

  // 获取类型图标
  const getTypeIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'component': return <Bot className="w-5 h-5 text-blue-500" />
      case 'performance': return <Gauge className="w-5 h-5 text-green-500" />
      case 'design': return <Palette className="w-5 h-5 text-purple-500" />
      case 'bestPractice': return <Shield className="w-5 h-5 text-orange-500" />
      case 'accessibility': return <Accessibility className="w-5 h-5 text-red-500" />
    }
  }

  // 获取类别标签样式
  const getCategoryStyles = (category: AISuggestion['category']) => {
    switch (category) {
      case 'recommendation': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'optimization': return 'bg-green-100 text-green-700 border-green-200'
      case 'warning': return 'bg-red-100 text-red-700 border-red-200'
      case 'enhancement': return 'bg-purple-100 text-purple-700 border-purple-200'
    }
  }

  // 获取影响样式
  const getImpactStyles = (impact: AISuggestion['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-50 text-green-700 border-green-200'
    }
  }

  // 获取工作量样式
  const getEffortStyles = (effort: AISuggestion['effort']) => {
    switch (effort) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
    }
  }

  // 应用建议
  const handleApplySuggestion = (suggestion: AISuggestion) => {
    onApplySuggestion?.(suggestion)
    // 更新建议状态
    suggestion.status = 'applied'
  }

  // 反馈处理
  const handleFeedback = (suggestionId: string, feedback: 'positive' | 'negative') => {
    const suggestion = analysisResult.suggestions.find(s => s.id === suggestionId)
    if (suggestion) {
      suggestion.feedback = feedback
    }
  }

  // 复制代码示例
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* AI助手头部 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                AI 智能助手
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                基于您的配置提供智能化优化建议
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analysisResult.overallScore}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                优化评分
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerateSuggestions}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn('w-4 h-4', isAnalyzing && 'animate-spin')} />
              重新分析
            </Button>
          </div>
        </div>

        {/* 快速统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: '组件推荐', value: analysisResult.suggestions.filter(s => s.type === 'component').length, icon: Bot, color: 'blue' },
            { label: '性能优化', value: analysisResult.suggestions.filter(s => s.type === 'performance').length, icon: Gauge, color: 'green' },
            { label: '设计建议', value: analysisResult.suggestions.filter(s => s.type === 'design').length, icon: Palette, color: 'purple' },
            { label: '最佳实践', value: analysisResult.suggestions.filter(s => s.type === 'bestPractice').length, icon: Shield, color: 'orange' }
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <stat.icon className={cn('w-5 h-5 mx-auto mb-1 text-', stat.color, '-500')} />
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 分类过滤器 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: '全部建议', icon: Lightbulb },
            { id: 'component', label: '组件推荐', icon: Bot },
            { id: 'performance', label: '性能优化', icon: Gauge },
            { id: 'design', label: '设计建议', icon: Palette },
            { id: 'bestPractice', label: '最佳实践', icon: Shield },
            { id: 'accessibility', label: '可访问性', icon: Accessibility }
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                activeCategory === category.id
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </button>
          ))}
        </div>
      </Card>

      {/* AI建议列表 */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredSuggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={cn(
                'p-6 transition-all duration-200',
                suggestion.status === 'applied' && 'opacity-60',
                suggestion.status === 'dismissed' && 'opacity-40'
              )}>
                {/* 建议头部 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getTypeIcon(suggestion.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {suggestion.title}
                        </h4>
                        <span className={cn('text-xs px-2 py-1 rounded-full border', getCategoryStyles(suggestion.category))}>
                          {suggestion.category === 'recommendation' && '推荐'}
                          {suggestion.category === 'optimization' && '优化'}
                          {suggestion.category === 'warning' && '警告'}
                          {suggestion.category === 'enhancement' && '增强'}
                        </span>
                        {suggestion.status === 'applied' && (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            已应用
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {suggestion.description}
                      </p>

                      {/* 影响和工作量标签 */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={cn('text-xs px-2 py-1 rounded border', getImpactStyles(suggestion.impact))}>
                          影响度：{suggestion.impact === 'high' ? '高' : suggestion.impact === 'medium' ? '中' : '低'}
                        </span>
                        <span className={cn('text-xs px-2 py-1 rounded', getEffortStyles(suggestion.effort))}>
                          工作量：{suggestion.effort === 'low' ? '低' : suggestion.effort === 'medium' ? '中' : '高'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => setExpandedSuggestion(
                        expandedSuggestion === suggestion.id ? null : suggestion.id
                      )}
                      variant="outline"
                      className="p-2"
                    >
                      <ChevronRight className={cn(
                        'w-4 h-4 transition-transform',
                        expandedSuggestion === suggestion.id && 'rotate-90'
                      )} />
                    </Button>
                    {suggestion.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleApplySuggestion(suggestion)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        应用
                      </Button>
                    )}
                  </div>
                </div>

                {/* 展开的详细内容 */}
                {expandedSuggestion === suggestion.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t pt-4 mt-4"
                  >
                    {/* 建议详情 */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        建议
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        {suggestion.suggestion}
                      </p>
                    </div>

                    {/* 收益说明 */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        预期收益
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {suggestion.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 相关组件 */}
                    {suggestion.relatedComponents && suggestion.relatedComponents.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <Bot className="w-4 h-4 text-blue-500" />
                          相关组件
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {suggestion.relatedComponents.map((comp) => (
                            <span key={comp} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 代码示例 */}
                    {suggestion.codeExample && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Code className="w-4 h-4 text-purple-500" />
                            代码示例
                          </h5>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyCode(suggestion.codeExample!)}
                            className="flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            复制
                          </Button>
                        </div>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                          <pre className="text-sm">
                            <code>{suggestion.codeExample}</code>
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* 反馈按钮 */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        这些建议对您有帮助吗？
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFeedback(suggestion.id, 'positive')}
                          className={cn(
                            'flex items-center gap-1',
                            suggestion.feedback === 'positive' && 'bg-green-50 text-green-700 border-green-200'
                          )}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          有帮助
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFeedback(suggestion.id, 'negative')}
                          className={cn(
                            'flex items-center gap-1',
                            suggestion.feedback === 'negative' && 'bg-red-50 text-red-700 border-red-200'
                          )}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          没帮助
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 空状态 */}
      {filteredSuggestions.length === 0 && !isAnalyzing && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            没有发现需要优化的项目
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            您的配置已经很优秀了！AI助手没有发现需要改进的地方。
          </p>
          <Button
            variant="outline"
            onClick={onRegenerateSuggestions}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            重新分析
          </Button>
        </Card>
      )}

      {/* 分析中状态 */}
      {isAnalyzing && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-blue-500 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            AI 正在分析...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            智能分析您的配置，提供个性化优化建议
          </p>
        </Card>
      )}
    </div>
  )
}