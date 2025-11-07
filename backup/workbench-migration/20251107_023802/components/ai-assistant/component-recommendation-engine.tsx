'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  TrendingUp,
  Lightbulb,
  Code,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  BarChart3
} from 'lucide-react'
import { Button } from '@xorigo-ui/core'
import { Card } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@xorigo-ui/core'
import type {
  ComponentRecommendationRequest,
  ComponentRecommendation,
  RecommendedComponent,
  ComponentCombination,
  AlternativeOption
} from '@/types/ai-assistant'
import { aiAssistantService } from '@/services/ai-assistant-service'
import { getAllComponents } from '@/data/component-classification'

// ============================================================================
// 样式变体定义
// ============================================================================

const recommendationCardVariants = cva(
  'group relative bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 hover:shadow-lg cursor-pointer',
  {
    variants: {
      relevance: {
        high: 'border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700',
        medium: 'border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700',
        low: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }
    }
  }
)

const componentTagVariants = cva(
  'inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium',
  {
    variants: {
      variant: {
        category: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        difficulty: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        time: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        popularity: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      }
    }
  }
)

// ============================================================================
// 组件属性接口
// ============================================================================

interface ComponentRecommendationEngineProps {
  className?: string
  onComponentSelect?: (component: RecommendedComponent) => void
  onCombinationSelect?: (combination: ComponentCombination) => void
  showCombinations?: boolean
  showAlternatives?: boolean
  maxRecommendations?: number
  viewMode?: 'grid' | 'list'
}

// ============================================================================
// 推荐组件卡片
// ============================================================================

interface RecommendedComponentCardProps {
  component: RecommendedComponent
  onSelect: (component: RecommendedComponent) => void
  relevance: 'high' | 'medium' | 'low'
}

function RecommendedComponentCard({ component, onSelect, relevance }: RecommendedComponentCardProps) {
  const [copiedCode, setCopiedCode] = useState(false)

  const handleCopyCode = useCallback(async () => {
    if (component.usageExample) {
      await navigator.clipboard.writeText(component.usageExample)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }, [component.usageExample])

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(component)}
      className={cn(recommendationCardVariants({ relevance }))}
    >
      <div className="p-4">
        {/* 头部信息 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {component.component.name}
              </h3>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i < Math.floor(component.relevanceScore * 5)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    )}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {component.component.description}
            </p>
          </div>
          <div className="flex-shrink-0 ml-2">
            <div className={cn(
              "px-2 py-1 text-xs rounded-full font-medium",
              relevance === 'high' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
              relevance === 'medium' ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
              "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            )}>
              {Math.round(component.relevanceScore * 100)}% 匹配
            </div>
          </div>
        </div>

        {/* 推荐理由 */}
        <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {component.reason}
            </p>
          </div>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className={cn(componentTagVariants({ variant: 'category' }))}>
            {component.component.category}
          </span>
          {component.dependencies && component.dependencies.length > 0 && (
            <span className={cn(componentTagVariants({ variant: 'difficulty' }))}>
              {component.dependencies.length} 依赖
            </span>
          )}
        </div>

        {/* 代码示例 */}
        {component.usageExample && (
          <div className="relative">
            <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{component.usageExample}</pre>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleCopyCode()
              }}
              className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              {copiedCode ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <Copy className="w-3 h-3 text-gray-300" />
              )}
            </button>
          </div>
        )}

        {/* 底部操作 */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Zap className="w-3 h-3" />
            <span>快速集成</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 组件组合卡片
// ============================================================================

interface ComponentCombinationCardProps {
  combination: ComponentCombination
  onSelect: (combination: ComponentCombination) => void
}

function ComponentCombinationCard({ combination, onSelect }: ComponentCombinationCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(combination)}
      className="group relative bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-4 cursor-pointer hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {combination.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {combination.description}
          </p>

          {/* 协同度评分 */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">协同度:</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    i < Math.floor(combination.synergy * 5)
                      ? "bg-purple-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {Math.round(combination.synergy * 100)}%
            </span>
          </div>

          {/* 包含的组件 */}
          <div className="flex flex-wrap gap-1 mb-3">
            {combination.components.map((component, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-700"
              >
                {component}
              </span>
            ))}
          </div>

          {/* 使用场景 */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Lightbulb className="w-3 h-3" />
            <span>{combination.useCase}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 替代选项卡片
// ============================================================================

interface AlternativeOptionCardProps {
  option: AlternativeOption
}

function AlternativeOptionCard({ option }: AlternativeOptionCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          {option.title}
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          {showDetails ? '收起' : '详情'}
        </button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {option.description}
      </p>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              {/* 优点 */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <span className="text-xs text-green-600 dark:text-green-400">+</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">优点</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {option.pros.map((pro, index) => (
                    <li key={index} className="text-xs text-gray-600 dark:text-gray-400">
                      • {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 缺点 */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <span className="text-xs text-red-600 dark:text-red-400">−</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">缺点</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {option.cons.map((con, index) => (
                    <li key={index} className="text-xs text-gray-600 dark:text-gray-400">
                      • {con}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 适用场景 */}
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-3 h-3 text-blue-500" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">适用场景</span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {option.whenToUse}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================================================
// 主组件
// ============================================================================

export function ComponentRecommendationEngine({
  className,
  onComponentSelect,
  onCombinationSelect,
  showCombinations = true,
  showAlternatives = true,
  maxRecommendations = 6,
  viewMode = 'grid'
}: ComponentRecommendationEngineProps) {
  const [recommendation, setRecommendation] = useState<ComponentRecommendation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState('components')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentViewMode, setCurrentViewMode] = useState<'grid' | 'list'>(viewMode)

  // 模拟推荐请求
  const generateRecommendations = useCallback(async (query?: string) => {
    setIsLoading(true)
    try {
      const request: ComponentRecommendationRequest = {
        query: query || '用户界面组件',
        context: {
          projectType: 'web-application',
          complexity: 'medium',
          targetAudience: 'intermediate'
        },
        filters: {
          popularity: 70
        }
      }

      const result = await aiAssistantService.recommendComponents(request)
      setRecommendation(result)
    } catch (error) {
      console.error('生成推荐失败:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 初始化推荐
  useEffect(() => {
    generateRecommendations()
  }, [generateRecommendations])

  // 处理组件选择
  const handleComponentSelect = useCallback((component: RecommendedComponent) => {
    onComponentSelect?.(component)
  }, [onComponentSelect])

  // 处理组合选择
  const handleCombinationSelect = useCallback((combination: ComponentCombination) => {
    onCombinationSelect?.(combination)
  }, [onCombinationSelect])

  // 过滤推荐组件
  const filteredComponents = useMemo(() => {
    if (!recommendation || !searchTerm) return recommendation?.components || []

    return recommendation.components.filter(comp =>
      comp.component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.component.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [recommendation, searchTerm])

  // 计算相关性等级
  const getRelevanceLevel = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 0.8) return 'high'
    if (score >= 0.6) return 'medium'
    return 'low'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">AI正在分析您的需求...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* 头部信息 */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            AI 组件推荐
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          基于您的需求，AI为您推荐最合适的组件组合和最佳实践方案
        </p>
      </div>

      {/* 搜索和控制栏 */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索推荐的组件..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentViewMode(currentViewMode === 'grid' ? 'list' : 'grid')}
          >
            {currentViewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateRecommendations(searchTerm || undefined)}
          >
            <Filter className="w-4 h-4 mr-2" />
            重新推荐
          </Button>
        </div>
      </div>

      {/* 推荐理由 */}
      {recommendation?.rationale && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">推荐理由</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {recommendation.rationale}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 标签页 */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="components" className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            推荐组件
            {filteredComponents && (
              <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs rounded-full">
                {filteredComponents.length}
              </span>
            )}
          </TabsTrigger>
          {showCombinations && (
            <TabsTrigger value="combinations" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              组件组合
              {recommendation?.combinations && (
                <span className="ml-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs rounded-full">
                  {recommendation.combinations.length}
                </span>
              )}
            </TabsTrigger>
          )}
          {showAlternatives && (
            <TabsTrigger value="alternatives" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              替代方案
              {recommendation?.alternativeOptions && (
                <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs rounded-full">
                  {recommendation.alternativeOptions.length}
                </span>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        {/* 推荐组件 */}
        <TabsContent value="components" className="mt-6">
          {filteredComponents && filteredComponents.length > 0 ? (
            <div className={cn(
              "grid gap-4",
              currentViewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {filteredComponents
                .slice(0, maxRecommendations)
                .map((component, index) => (
                  <motion.div
                    key={component.component.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <RecommendedComponentCard
                      component={component}
                      onSelect={handleComponentSelect}
                      relevance={getRelevanceLevel(component.relevanceScore)}
                    />
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">暂无推荐的组件</p>
            </div>
          )}
        </TabsContent>

        {/* 组件组合 */}
        {showCombinations && (
          <TabsContent value="combinations" className="mt-6">
            {recommendation?.combinations && recommendation.combinations.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {recommendation.combinations.map((combination, index) => (
                  <motion.div
                    key={combination.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ComponentCombinationCard
                      combination={combination}
                      onSelect={handleCombinationSelect}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">暂无推荐的组件组合</p>
              </div>
            )}
          </TabsContent>
        )}

        {/* 替代方案 */}
        {showAlternatives && (
          <TabsContent value="alternatives" className="mt-6">
            {recommendation?.alternativeOptions && recommendation.alternativeOptions.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {recommendation.alternativeOptions.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AlternativeOptionCard option={option} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">暂无替代方案</p>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}