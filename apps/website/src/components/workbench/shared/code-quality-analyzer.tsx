'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@xorigo-ui/core'
import { CheckCircle, AlertCircle, XCircle, Info, TrendingUp, Code, Zap, Shield } from 'lucide-react'
import { cn } from '@/utils'

// 代码质量评分接口
interface CodeQualityScore {
  overall: number // 0-100 总分
  readability: number // 可读性评分
  maintainability: number // 可维护性评分
  performance: number // 性能评分
  accessibility: number // 可访问性评分
  bestPractices: number // 最佳实践评分
}

// 质量建议接口
interface QualitySuggestion {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  category: 'readability' | 'maintainability' | 'performance' | 'accessibility' | 'bestPractices'
  title: string
  description: string
  suggestion: string
  impact: 'high' | 'medium' | 'low'
}

interface CodeQualityAnalyzerProps {
  code: string
  config: any
  className?: string
}

export function CodeQualityAnalyzer({ code, config, className }: CodeQualityAnalyzerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'suggestions' | 'details'>('overview')

  // 分析代码质量
  const qualityScore = useMemo((): CodeQualityScore => {
    let score: CodeQualityScore = {
      overall: 0,
      readability: 0,
      maintainability: 0,
      performance: 0,
      accessibility: 0,
      bestPractices: 0
    }

    // 可读性分析
    const readabilityFactors = {
      codeLength: Math.max(0, 100 - (code.length / 50)), // 代码长度影响
      hasComments: /\/\/.*$|\/\*[\s\S]*?\*\//m.test(code) ? 20 : 0, // 注释
      properIndentation: /^[ \t]*\S/m.test(code) ? 15 : 0, // 缩进
      meaningfulNames: /\b(btn|div|span)\b/.test(code) ? 0 : 15 // 有意义命名
    }
    score.readability = Math.min(100, Object.values(readabilityFactors).reduce((a, b) => a + b, 0))

    // 可维护性分析
    const maintainabilityFactors = {
      componentStructure: code.includes('export default function') ? 25 : 0,
      typeScriptUsage: (code.match(/:\s*string|number|boolean|React\./g) || []).length * 5,
      propsInterface: code.includes('interface') || code.includes('type') ? 20 : 0,
      modularity: code.split('\n').length < 100 ? 15 : 5
    }
    score.maintainability = Math.min(100, Object.values(maintainabilityFactors).reduce((a, b) => a + b, 0))

    // 性能分析
    const performanceFactors = {
      noInlineStyles: !/style={{/.test(code) ? 25 : 0,
      usesMemo: /\buseMemo\b/.test(code) ? 15 : 0,
      useCallback: /\buseCallback\b/.test(code) ? 15 : 0,
      optimizedImports: !code.includes('*') ? 20 : 0,
      lazyLoading: /\blazy\b/.test(code) ? 10 : 0
    }
    score.performance = Math.min(100, Object.values(performanceFactors).reduce((a, b) => a + b, 0))

    // 可访问性分析
    const accessibilityFactors = {
      semanticHTML: /\b(header|main|nav|section|article|aside|footer)\b/.test(code) ? 25 : 0,
      altAttributes: /alt=/.test(code) ? 20 : 0,
      ariaLabels: /aria-/.test(code) ? 20 : 0,
      keyboardNavigation: /tabIndex|onKeyDown/.test(code) ? 15 : 0,
      roleAttributes: /role=/.test(code) ? 10 : 0
    }
    score.accessibility = Math.min(100, Object.values(accessibilityFactors).reduce((a, b) => a + b, 0))

    // 最佳实践分析
    const bestPracticesFactors = {
      errorBoundaries: /ErrorBoundary/.test(code) ? 20 : 0,
      loadingStates: /loading|Loading/.test(code) ? 15 : 0,
      nullChecks: code.includes('?') || code.includes('??') ? 15 : 0,
      constUsage: (code.match(/\bconst\b/g) || []).length > 0 ? 20 : 0,
      functionalComponents: code.includes('function') || code.includes('=>') ? 20 : 0
    }
    score.bestPractices = Math.min(100, Object.values(bestPracticesFactors).reduce((a, b) => a + b, 0))

    // 计算总分
    score.overall = Math.round(
      (score.readability * 0.2 +
       score.maintainability * 0.25 +
       score.performance * 0.25 +
       score.accessibility * 0.15 +
       score.bestPractices * 0.15)
    )

    return score
  }, [code])

  // 生成质量建议
  const suggestions = useMemo((): QualitySuggestion[] => {
    const suggestions: QualitySuggestion[] = []

    // 可读性建议
    if (qualityScore.readability < 70) {
      suggestions.push({
        id: 'readability-1',
        type: 'warning',
        category: 'readability',
        title: '提高代码可读性',
        description: '当前代码的可读性评分较低',
        suggestion: '添加有意义的注释，使用描述性的变量名，确保适当的代码缩进和格式化',
        impact: 'medium'
      })
    }

    // 性能建议
    if (!/\buseMemo\b/.test(code) && code.length > 200) {
      suggestions.push({
        id: 'performance-1',
        type: 'info',
        category: 'performance',
        title: '考虑使用 useMemo 优化',
        description: '检测到复杂计算可能需要缓存',
        suggestion: '对于复杂的计算逻辑，使用 useMemo 缓存结果以避免不必要的重新计算',
        impact: 'high'
      })
    }

    // 可访问性建议
    if (!/alt=/.test(code) && /<img/i.test(code)) {
      suggestions.push({
        id: 'accessibility-1',
        type: 'error',
        category: 'accessibility',
        title: '图片缺少 alt 属性',
        description: '检测到图片元素没有提供替代文本',
        suggestion: '为所有图片添加有意义的 alt 属性，提高屏幕阅读器兼容性',
        impact: 'high'
      })
    }

    // TypeScript 建议
    if (!code.includes('interface') && !code.includes('type')) {
      suggestions.push({
        id: 'typescript-1',
        type: 'info',
        category: 'bestPractices',
        title: '添加 TypeScript 类型定义',
        description: '建议为组件 props 添加类型定义',
        suggestion: '定义接口或类型别名来描述组件的 props，提高类型安全性',
        impact: 'medium'
      })
    }

    // 错误处理建议
    if (!/try|catch|ErrorBoundary/.test(code)) {
      suggestions.push({
        id: 'error-handling-1',
        type: 'warning',
        category: 'bestPractices',
        title: '添加错误处理机制',
        description: '组件缺少错误处理',
        suggestion: '考虑添加 try-catch 块或使用 ErrorBoundary 组件来处理可能的错误',
        impact: 'medium'
      })
    }

    // 内联样式建议
    if (/style={{/.test(code)) {
      suggestions.push({
        id: 'performance-2',
        type: 'warning',
        category: 'performance',
        title: '避免内联样式',
        description: '检测到内联样式使用',
        suggestion: '使用 CSS 类名或 CSS-in-JS 解决方案替代内联样式，提高性能和可维护性',
        impact: 'medium'
      })
    }

    return suggestions.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 }
      const typeOrder = { error: 4, warning: 3, info: 2, success: 1 }
      return (impactOrder[b.impact] - impactOrder[a.impact]) || (typeOrder[b.type] - typeOrder[a.type])
    })
  }, [code, qualityScore])

  // 获取评分等级
  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 80) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 70) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (score >= 60) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' }
  }

  // 获取建议图标
  const getSuggestionIcon = (type: QualitySuggestion['type']) => {
    switch (type) {
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
    }
  }

  // 获取影响标签样式
  const getImpactStyles = (impact: QualitySuggestion['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  const overallGrade = getScoreGrade(qualityScore.overall)

  return (
    <div className={cn('space-y-6', className)}>
      {/* 总体评分卡片 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Code className="w-5 h-5" />
            代码质量分析
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">总体评分</span>
            <div className={cn('px-3 py-1 rounded-full font-bold text-lg', overallGrade.bg, overallGrade.color)}>
              {qualityScore.overall}/100 ({overallGrade.grade})
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'overview', label: '总览', icon: TrendingUp },
            { id: 'suggestions', label: '建议', icon: Zap },
            { id: 'details', label: '详情', icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 总览标签页 */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {[
                { key: 'readability', label: '可读性', value: qualityScore.readability },
                { key: 'maintainability', label: '可维护性', value: qualityScore.maintainability },
                { key: 'performance', label: '性能', value: qualityScore.performance },
                { key: 'accessibility', label: '可访问性', value: qualityScore.accessibility },
                { key: 'bestPractices', label: '最佳实践', value: qualityScore.bestPractices }
              ].map((metric) => {
                const grade = getScoreGrade(metric.value)
                return (
                  <div key={metric.key} className="text-center">
                    <div className={cn('text-2xl font-bold mb-1', grade.color)}>
                      {metric.value}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {metric.label}
                    </div>
                    <div className={cn('text-xs px-2 py-1 rounded-full', grade.bg, grade.color)}>
                      {grade.grade}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 快速建议 */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4" />
                关键改进建议
              </h4>
              {suggestions.slice(0, 3).map((suggestion) => (
                <div key={suggestion.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  {getSuggestionIcon(suggestion.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        {suggestion.title}
                      </h5>
                      <span className={cn('text-xs px-2 py-1 rounded border', getImpactStyles(suggestion.impact))}>
                        {suggestion.impact === 'high' ? '高影响' : suggestion.impact === 'medium' ? '中影响' : '低影响'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 建议标签页 */}
        {activeTab === 'suggestions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              {suggestions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    代码质量优秀！
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    没有发现需要改进的地方，您的代码质量很高。
                  </p>
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      {getSuggestionIcon(suggestion.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {suggestion.title}
                          </h5>
                          <div className="flex items-center gap-2">
                            <span className={cn('text-xs px-2 py-1 rounded border', getImpactStyles(suggestion.impact))}>
                              {suggestion.impact === 'high' ? '高影响' : suggestion.impact === 'medium' ? '中影响' : '低影响'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {suggestion.category}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {suggestion.description}
                        </p>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>建议：</strong> {suggestion.suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* 详情标签页 */}
        {activeTab === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* 代码统计 */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">代码统计</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">代码行数</span>
                    <span className="font-medium">{code.split('\n').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">字符数量</span>
                    <span className="font-medium">{code.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">函数数量</span>
                    <span className="font-medium">{(code.match(/function|=>/g) || []).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">组件数量</span>
                    <span className="font-medium">{(code.match(/React\.|jsx|tsx/g) || []).length}</span>
                  </div>
                </div>
              </div>

              {/* 质量指标详情 */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">质量指标</h4>
                <div className="space-y-3">
                  {[
                    { key: 'readability', label: '可读性', description: '代码的清晰度和易读性' },
                    { key: 'maintainability', label: '可维护性', description: '代码的修改和扩展便利性' },
                    { key: 'performance', label: '性能', description: '代码的运行效率和优化程度' },
                    { key: 'accessibility', label: '可访问性', description: '无障碍访问和用户体验' },
                    { key: 'bestPractices', label: '最佳实践', description: '遵循行业标准和规范' }
                  ].map((metric) => (
                    <div key={metric.key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">{metric.label}</span>
                        <span className="text-gray-600 dark:text-gray-400">{qualityScore[metric.key as keyof CodeQualityScore]}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={cn('h-2 rounded-full transition-all duration-500',
                            qualityScore[metric.key as keyof CodeQualityScore] >= 80 ? 'bg-green-500' :
                            qualityScore[metric.key as keyof CodeQualityScore] >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          )}
                          style={{ width: `${qualityScore[metric.key as keyof CodeQualityScore]}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  )
}