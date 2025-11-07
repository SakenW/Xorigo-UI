/**
 * 智能组件卡片
 * 提供多模式显示、懒加载、智能建议等功能
 */

'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { cn } from '../../../lib/utils'
import type { ComponentInfo } from '../../../data/component-classification'
import type { ComponentPreview } from '../../../lib/workbench/preview-engine/types'
import { createIntelligentPreviewEngine } from '../../../lib/workbench/preview-engine'

/**
 * 智能组件卡片属性
 */
interface SmartComponentCardProps {
  /** 组件信息 */
  component: ComponentInfo
  /** 显示模式 */
  mode?: 'compact' | 'normal' | 'detailed' | 'comparison'
  /** 是否支持交互 */
  interactive?: boolean
  /** 是否懒加载 */
  lazy?: boolean
  /** 智能建议 */
  suggestions?: {
    relatedComponents: string[]
    popularCombinations: string[]
    usageTips: string[]
    companionComponents: string[]
  }
  /** 预览回调 */
  onPreview?: (component: ComponentInfo) => void
  /** 编辑回调 */
  onEdit?: (component: ComponentInfo) => void
  /** 复制回调 */
  onCopy?: (component: ComponentInfo) => void
  /** 文档回调 */
  onDocs?: (component: ComponentInfo) => void
  /** 主题 */
  theme?: string
  /** 卡片类名 */
  className?: string
  /** 测试ID */
  'data-testid'?: string
}

/**
 * 加载状态组件
 */
const LoadingState: React.FC<{ mode: string }> = ({ mode }) => {
  if (mode === 'compact') {
    return (
      <div className="flex items-center justify-center h-16">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <div className="text-sm text-muted-foreground">加载预览中...</div>
    </div>
  )
}

/**
 * 错误状态组件
 */
const ErrorState: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-6 space-y-3">
    <div className="text-2xl">⚠️</div>
    <div className="text-sm text-muted-foreground text-center">预览加载失败</div>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry}>
        重试
      </Button>
    )}
  </div>
)

/**
 * 使用统计组件
 */
const UsageStats: React.FC<{ component: ComponentInfo }> = ({ component }) => {
  // 模拟数据，实际应该从 analytics 服务获取
  const stats = useMemo(() => ({
    weeklyUsage: Math.floor(Math.random() * 100) + 20,
    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
    trending: Math.random() > 0.7
  }), [component.name])

  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        <span>本周使用 {stats.weeklyUsage} 次</span>
      </div>
      <div className="flex items-center space-x-3">
        {stats.trending && (
          <div className="flex items-center space-x-1">
            <span className="text-orange-500">🔥</span>
            <span>热门</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <span className="text-yellow-500">⭐</span>
          <span>{stats.rating}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * 智能建议组件
 */
const SmartSuggestions: React.FC<{
  component: ComponentInfo
  suggestions?: SmartComponentCardProps['suggestions']
}> = ({ component, suggestions }) => {
  const hasContent = useMemo(() => {
    return suggestions && suggestions.usageTips.length > 0
  }, [suggestions])

  if (!hasContent) return null

  return (
    <div className="border-t pt-3 mt-3">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-yellow-500">💡</span>
        <span className="text-sm font-medium">智能建议</span>
      </div>
      <div className="space-y-1">
        {suggestions?.usageTips.slice(0, 2).map((tip, index) => (
          <div key={index} className="text-xs text-muted-foreground flex items-start space-x-1">
            <span className="text-primary mt-0.5">•</span>
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 预览区域组件
 */
const PreviewArea: React.FC<{
  component: ComponentInfo
  mode: string
  preview?: ComponentPreview
  isLoading: boolean
  error?: string
  onRetry: () => void
}> = ({ component, mode, preview, isLoading, error, onRetry }) => {
  const isCompact = mode === 'compact'

  if (isCompact) {
    return (
      <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
        <span className="text-primary font-bold text-sm">
          {component.name.charAt(0)}
        </span>
      </div>
    )
  }

  return (
    <div className="mb-4 min-h-[100px] bg-muted/30 rounded-lg p-4 flex items-center justify-center">
      {isLoading ? (
        <LoadingState mode={mode} />
      ) : error ? (
        <ErrorState error={error} onRetry={onRetry} />
      ) : preview ? (
        <div className="w-full">
          {preview.rendered.live}
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground">
          暂无预览
        </div>
      )}
    </div>
  )
}

/**
 * 智能组件卡片主组件
 */
export const SmartComponentCard: React.FC<SmartComponentCardProps> = ({
  component,
  mode = 'normal',
  interactive = true,
  lazy = true,
  suggestions,
  onPreview,
  onEdit,
  onCopy,
  onDocs,
  theme = 'default',
  className,
  'data-testid': testId
}) => {
  const [preview, setPreview] = useState<ComponentPreview | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(!lazy)

  const previewEngine = useMemo(() => createIntelligentPreviewEngine(), [])

  // 使用 Intersection Observer 实现懒加载
  useEffect(() => {
    if (!lazy) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById(`card-${component.name}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [lazy, component.name])

  // 加载预览
  useEffect(() => {
    if (!isVisible || !interactive) return

    const loadPreview = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const generatedPreview = await previewEngine.generatePreview(component, {
          mode,
          theme,
          size: 'md',
          interactive: false,
          animated: true,
          showCode: false
        })

        setPreview(generatedPreview)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preview')
      } finally {
        setIsLoading(false)
      }
    }

    loadPreview()
  }, [isVisible, interactive, component, mode, theme, previewEngine])

  // 处理卡片点击
  const handleClick = useCallback(() => {
    if (interactive && onPreview) {
      onPreview(component)
    }
  }, [interactive, onPreview, component])

  // 处理编辑按钮点击
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(component)
    }
  }, [onEdit, component])

  // 处理复制按钮点击
  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (onCopy) {
      onCopy(component)
    }
  }, [onCopy, component])

  // 处理文档按钮点击
  const handleDocs = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDocs) {
      onDocs(component)
    }
  }, [onDocs, component])

  // 重试加载
  const handleRetry = useCallback(() => {
    if (isVisible && interactive) {
      setIsLoading(true)
      setError(null)

      previewEngine.generatePreview(component, {
        mode,
        theme,
        size: 'md',
        interactive: false,
        animated: true,
        showCode: false
      }).then(setPreview).catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to load preview')
      }).finally(() => {
        setIsLoading(false)
      })
    }
  }, [isVisible, interactive, component, mode, theme, previewEngine])

  // 生成匹配分数显示
  const matchScore = useMemo(() => {
    if (preview?.metadata.performance.renderTime) {
      return Math.min(100, Math.floor((100 - preview.metadata.performance.renderTime) * 1.5))
    }
    return null
  }, [preview])

  return (
    <Card
      id={`card-${component.name}`}
      className={cn(
        'component-card transition-all duration-200 group',
        interactive && 'cursor-pointer hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5',
        isLoading && 'animate-pulse',
        className
      )}
      onClick={handleClick}
      data-component={component.name}
      data-mode={mode}
      data-testid={testId}
    >
      {/* 卡片头部 */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* 组件图标 */}
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="text-primary font-bold text-lg">
                {component.name.charAt(0)}
              </span>
            </div>

            {/* 组件信息 */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{component.name}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {component.category}
                </Badge>
                {matchScore && matchScore > 80 && (
                  <Badge variant="secondary" className="text-xs">
                    🎯 {matchScore}% 匹配
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* 快速操作按钮 */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="w-8 h-8 p-0"
              title="编辑组件"
            >
              ✏️
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="w-8 h-8 p-0"
              title="复制代码"
            >
              📋
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDocs}
              className="w-8 h-8 p-0"
              title="查看文档"
            >
              📖
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* 卡片内容 */}
      <CardContent className="pt-0">
        {/* 描述 */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {component.description}
        </p>

        {/* 组件预览 */}
        <PreviewArea
          component={component}
          mode={mode}
          preview={preview}
          isLoading={isLoading}
          error={error || undefined}
          onRetry={handleRetry}
        />

        {/* 属性标签 */}
        {component.props && component.props.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {component.props
              .slice(0, mode === 'detailed' ? 6 : 3)
              .map((prop) => (
                <Badge key={prop} variant="secondary" className="text-xs">
                  {prop}
                </Badge>
              ))}
            {component.props.length > (mode === 'detailed' ? 6 : 3) && (
              <Badge variant="secondary" className="text-xs">
                +{component.props.length - (mode === 'detailed' ? 6 : 3)}
              </Badge>
            )}
          </div>
        )}

        {/* 变体展示 */}
        {component.variants && component.variants.length > 0 && mode !== 'compact' && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {component.variants
                .slice(0, mode === 'detailed' ? component.variants.length : 4)
                .map((variant) => (
                  <Badge key={variant} variant="outline" className="text-xs">
                    {variant}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* 智能建议 */}
        {mode === 'detailed' && <SmartSuggestions component={component} suggestions={suggestions} />}

        {/* 使用统计 */}
        {mode === 'detailed' && <UsageStats component={component} />}

        {/* 快速操作 */}
        {mode !== 'compact' && (
          <div className="flex gap-2 pt-3 border-t">
            <Button
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation()
                handleEdit(e)
              }}
            >
              在编辑器中打开
            </Button>
            {mode === 'detailed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDocs(e)
                }}
              >
                查看文档
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 设置显示名称用于调试
SmartComponentCard.displayName = 'SmartComponentCard'

export default SmartComponentCard