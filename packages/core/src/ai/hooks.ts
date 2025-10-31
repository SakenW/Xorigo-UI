/**
 * 🎣 AI系统React Hooks
 *
 * 为React组件提供便捷的AI功能集成
 * 包含推荐、生成、分析等功能的hooks
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type {
  AIRecommendationResult,
  RecipeGenerationParams,
  RecipeGenerationResult,
  DesignAssessmentResult,
  DesignAssistantSuggestion,
  UserPreferenceProfile,
  BehaviorPatternAnalysis
} from './index'
import {
  aiSystem,
  getRecommendations,
  generateRecipes,
  getDesignSuggestions,
  assessDesign,
  recordUserAction
} from './index'

// ============================================================================
// 推荐相关Hooks (Recommendation Hooks)
// ============================================================================

/**
 * 使用AI推荐功能的Hook
 */
export interface UseAIRecommendationsOptions {
  userId: string
  context?: {
    timeOfDay?: string
    deviceType?: string
    taskType?: string
    numberOfRecommendations?: number
  }
  autoRefresh?: boolean
  refreshInterval?: number // 毫秒
}

export interface UseAIRecommendationsReturn {
  recommendations: AIRecommendationResult | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  selectRecommendation: (recipeId: string) => void
  performance: {
    processingTime: number
    cacheHit: boolean
  }
}

export function useAIRecommendations(options: UseAIRecommendationsOptions): UseAIRecommendationsReturn {
  const [recommendations, setRecommendations] = useState<AIRecommendationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [performance, setPerformance] = useState({ processingTime: 0, cacheHit: false })

  const intervalRef = useRef<NodeJS.Timeout>()

  const refresh = useCallback(async () => {
    if (!options.userId) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await getRecommendations(options.userId, options.context)

      if (result.success && result.data) {
        setRecommendations(result.data)
        setPerformance({
          processingTime: result.performance.processingTime,
          cacheHit: result.performance.cacheHit
        })
      } else {
        setError(result.error?.message || '获取推荐失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setIsLoading(false)
    }
  }, [options.userId, options.context])

  const selectRecommendation = useCallback((recipeId: string) => {
    if (recommendations) {
      const selectedRecipe = recommendations.recommendations.find(r => r.recipe.id === recipeId)
      if (selectedRecipe) {
        // 记录用户选择行为
        recordUserAction(options.userId, 'recipe_select', {
          recipeId,
          score: selectedRecipe.score,
          confidence: selectedRecipe.confidence,
          context: options.context
        })
      }
    }
  }, [recommendations, options.userId, options.context])

  // 自动刷新
  useEffect(() => {
    if (options.autoRefresh && options.refreshInterval) {
      intervalRef.current = setInterval(refresh, options.refreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [options.autoRefresh, options.refreshInterval, refresh])

  // 初始加载
  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    recommendations,
    isLoading,
    error,
    refresh,
    selectRecommendation,
    performance
  }
}

/**
 * 使用推荐历史的Hook
 */
export interface UseRecommendationHistoryOptions {
  userId: string
  maxItems?: number
}

export interface UseRecommendationHistoryReturn {
  history: Array<{
    timestamp: Date
    recommendations: AIRecommendationResult
    selectedRecipe?: string
  }>
  clearHistory: () => void
  getMostSelected: () => string | null
}

export function useRecommendationHistory(options: UseRecommendationHistoryOptions): UseRecommendationHistoryReturn {
  const [history, setHistory] = useState<Array<{
    timestamp: Date
    recommendations: AIRecommendationResult
    selectedRecipe?: string
  }>>([])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const getMostSelected = useCallback(() => {
    const selectionCounts: Record<string, number> = {}

    history.forEach(item => {
      if (item.selectedRecipe) {
        selectionCounts[item.selectedRecipe] = (selectionCounts[item.selectedRecipe] || 0) + 1
      }
    })

    const selections = Object.entries(selectionCounts)
    if (selections.length === 0) return null

    return selections.reduce((a, b) => a[1] > b[1] ? a : b)[0]
  }, [history])

  return {
    history: history.slice(0, options.maxItems || 10),
    clearHistory,
    getMostSelected
  }
}

// ============================================================================
// 配方生成相关Hooks (Recipe Generation Hooks)
// ============================================================================

/**
 * 使用AI配方生成功能的Hook
 */
export interface UseAIRecipeGeneratorOptions {
  userId?: string
  autoGenerate?: boolean
}

export interface UseAIRecipeGeneratorReturn {
  generate: (params: RecipeGenerationParams) => Promise<RecipeGenerationResult | null>
  isGenerating: boolean
  error: string | null
  lastResult: RecipeGenerationResult | null
  clearResult: () => void
}

export function useAIRecipeGenerator(options: UseAIRecipeGeneratorOptions): UseAIRecipeGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<RecipeGenerationResult | null>(null)

  const generate = useCallback(async (params: RecipeGenerationParams): Promise<RecipeGenerationResult | null> => {
    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateRecipes(params, options.userId)

      if (result.success && result.data) {
        setLastResult(result.data)

        // 记录生成行为
        if (options.userId) {
          recordUserAction(options.userId, 'recipe_generate', {
            keywords: params.keywords,
            mood: params.mood,
            context: params.context,
            resultCount: result.data.recipes.length,
            confidence: result.data.confidence
          })
        }

        return result.data
      } else {
        setError(result.error?.message || '生成配方失败')
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
      return null
    } finally {
      setIsGenerating(false)
    }
  }, [options.userId])

  const clearResult = useCallback(() => {
    setLastResult(null)
    setError(null)
  }, [])

  return {
    generate,
    isGenerating,
    error,
    lastResult,
    clearResult
  }
}

/**
 * 使用智能配方参数的Hook
 */
export interface UseSmartRecipeParamsOptions {
  onParamsChange?: (params: RecipeGenerationParams) => void
}

export interface UseSmartRecipeParamsReturn {
  params: RecipeGenerationParams
  updateParams: (updates: Partial<RecipeGenerationParams>) => void
  setKeywords: (keywords: string[]) => void
  setMood: (mood: string[]) => void
  setContext: (context: string) => void
  resetParams: () => void
  validateParams: () => { isValid: boolean; errors: string[] }
}

export function useSmartRecipeParams(options: UseSmartRecipeParamsOptions): UseSmartRecipeParamsReturn {
  const [params, setParams] = useState<RecipeGenerationParams>({
    keywords: [],
    mood: [],
    context: '',
    constraints: {},
    optimizationGoals: {
      aesthetic: 0.7,
      accessibility: 0.8,
      uniqueness: 0.6,
      usability: 0.8
    }
  })

  const updateParams = useCallback((updates: Partial<RecipeGenerationParams>) => {
    const newParams = { ...params, ...updates }
    setParams(newParams)
    options.onParamsChange?.(newParams)
  }, [params, options.onParamsChange])

  const setKeywords = useCallback((keywords: string[]) => {
    updateParams({ keywords })
  }, [updateParams])

  const setMood = useCallback((mood: string[]) => {
    updateParams({ mood })
  }, [updateParams])

  const setContext = useCallback((context: string) => {
    updateParams({ context })
  }, [updateParams])

  const resetParams = useCallback(() => {
    const defaultParams: RecipeGenerationParams = {
      keywords: [],
      mood: [],
      context: '',
      constraints: {},
      optimizationGoals: {
        aesthetic: 0.7,
        accessibility: 0.8,
        uniqueness: 0.6,
        usability: 0.8
      }
    }
    setParams(defaultParams)
    options.onParamsChange?.(defaultParams)
  }, [options.onParamsChange])

  const validateParams = useCallback(() => {
    const errors: string[] = []

    if (params.keywords.length === 0) {
      errors.push('至少需要一个关键词')
    }

    if (params.keywords.length > 10) {
      errors.push('关键词数量不能超过10个')
    }

    if (params.context.length > 100) {
      errors.push('上下文描述不能超过100个字符')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }, [params])

  return {
    params,
    updateParams,
    setKeywords,
    setMood,
    setContext,
    resetParams,
    validateParams
  }
}

// ============================================================================
// 设计助手相关Hooks (Design Assistant Hooks)
// ============================================================================

/**
 * 使用设计建议功能的Hook
 */
export interface UseDesignAssistantOptions {
  recipe: any // StyleRecipe
  userId?: string
  focusArea?: 'accessibility' | 'aesthetics' | 'usability' | 'performance' | 'all'
  autoAnalyze?: boolean
}

export interface UseDesignAssistantReturn {
  suggestions: DesignAssistantSuggestion[]
  assessment: DesignAssessmentResult | null
  isAnalyzing: boolean
  error: string | null
  analyze: () => Promise<void>
  applySuggestion: (suggestion: DesignAssistantSuggestion) => void
  dismissSuggestion: (suggestionId: string) => void
  performance: {
    analysisTime: number
    lastUpdated: Date | null
  }
}

export function useDesignAssistant(options: UseDesignAssistantOptions): UseDesignAssistantReturn {
  const [suggestions, setSuggestions] = useState<DesignAssistantSuggestion[]>([])
  const [assessment, setAssessment] = useState<DesignAssessmentResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [performance, setPerformance] = useState({ analysisTime: 0, lastUpdated: null as Date | null })
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set())

  const analyze = useCallback(async () => {
    if (!options.recipe) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // 并行执行建议生成和设计评估
      const [suggestionsResult, assessmentResult] = await Promise.all([
        getDesignSuggestions(options.recipe, options.userId, options.focusArea),
        assessDesign(options.recipe, options.userId)
      ])

      if (suggestionsResult.success && suggestionsResult.data) {
        // 过滤已忽略的建议
        const activeSuggestions = suggestionsResult.data.filter(
          suggestion => !dismissedSuggestions.has(suggestion.title)
        )
        setSuggestions(activeSuggestions)
      }

      if (assessmentResult.success && assessmentResult.data) {
        setAssessment(assessmentResult.data)
      }

      setPerformance({
        analysisTime: Math.max(
          suggestionsResult.performance.processingTime,
          assessmentResult.performance.processingTime
        ),
        lastUpdated: new Date()
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败')
    } finally {
      setIsAnalyzing(false)
    }
  }, [options.recipe, options.userId, options.focusArea, dismissedSuggestions])

  const applySuggestion = useCallback((suggestion: DesignAssistantSuggestion) => {
    // 记录应用建议的行为
    if (options.userId) {
      recordUserAction(options.userId, 'suggestion_applied', {
        suggestionId: suggestion.title,
        suggestionType: suggestion.type,
        suggestionPriority: suggestion.priority,
        recipeId: options.recipe.id
      })
    }

    // 从建议列表中移除已应用的建议
    setSuggestions(prev => prev.filter(s => s.title !== suggestion.title))
  }, [options.userId, options.recipe.id])

  const dismissSuggestion = useCallback((suggestionId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]))
    setSuggestions(prev => prev.filter(s => s.title !== suggestionId))
  }, [])

  // 自动分析
  useEffect(() => {
    if (options.autoAnalyze && options.recipe) {
      analyze()
    }
  }, [options.autoAnalyze, options.recipe, analyze])

  return {
    suggestions,
    assessment,
    isAnalyzing,
    error,
    analyze,
    applySuggestion,
    dismissSuggestion,
    performance
  }
}

/**
 * 使用实时设计建议的Hook
 */
export interface UseRealTimeDesignAssistantOptions {
  recipe: any
  userId?: string
  debounceMs?: number
}

export function useRealTimeDesignAssistant(options: UseRealTimeDesignAssistantOptions) {
  const [realTimeSuggestions, setRealTimeSuggestions] = useState<DesignAssistantSuggestion[]>([])
  const [isRealTimeAnalyzing, setIsRealTimeAnalyzing] = useState(false)

  const analyzeRealTime = useCallback(async () => {
    if (!options.recipe) return

    setIsRealTimeAnalyzing(true)
    try {
      const result = await getDesignSuggestions(options.recipe, options.userId, 'accessibility')
      if (result.success && result.data) {
        // 只显示关键建议
        const criticalSuggestions = result.data.filter(s => s.priority === 'critical')
        setRealTimeSuggestions(criticalSuggestions)
      }
    } catch (err) {
      console.error('实时分析失败:', err)
    } finally {
      setIsRealTimeAnalyzing(false)
    }
  }, [options.recipe, options.userId])

  // 使用防抖进行实时分析
  useEffect(() => {
    const timer = setTimeout(() => {
      if (options.recipe) {
        analyzeRealTime()
      }
    }, options.debounceMs || 500)

    return () => clearTimeout(timer)
  }, [options.recipe, analyzeRealTime, options.debounceMs])

  return {
    realTimeSuggestions,
    isRealTimeAnalyzing
  }
}

// ============================================================================
// 用户行为分析Hooks (User Behavior Analysis Hooks)
// ============================================================================

/**
 * 使用用户行为分析的Hook
 */
export interface UseUserBehaviorAnalysisOptions {
  userId: string
  period?: { start: Date; end: Date }
  autoRefresh?: boolean
}

export interface UseUserBehaviorAnalysisReturn {
  analysis: BehaviorPatternAnalysis | null
  isLoading: boolean
  error: string | null
  refresh: () => void
  updatePreferences: () => void
  preferences: UserPreferenceProfile | null
}

export function useUserBehaviorAnalysis(options: UseUserBehaviorAnalysisOptions): UseUserBehaviorAnalysisReturn {
  const [analysis, setAnalysis] = useState<BehaviorPatternAnalysis | null>(null)
  const [preferences, setPreferences] = useState<UserPreferenceProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    if (!options.userId) return

    setIsLoading(true)
    setError(null)

    try {
      const result = aiSystem.getUserBehaviorAnalysis(options.userId, options.period)

      if (result.success && result.data) {
        setAnalysis(result.data)
      } else {
        setError(result.error?.message || '获取行为分析失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setIsLoading(false)
    }
  }, [options.userId, options.period])

  const updatePreferences = useCallback(() => {
    if (!options.userId) return

    try {
      const result = aiSystem.updateUserPreferences(options.userId)

      if (result.success && result.data) {
        setPreferences(result.data)
      }
    } catch (err) {
      console.error('更新用户偏好失败:', err)
    }
  }, [options.userId])

  // 初始加载
  useEffect(() => {
    refresh()
  }, [refresh])

  // 自动更新偏好
  useEffect(() => {
    if (options.autoRefresh) {
      const interval = setInterval(updatePreferences, 60000) // 每分钟更新一次
      return () => clearInterval(interval)
    }
  }, [options.autoRefresh, updatePreferences])

  return {
    analysis,
    isLoading,
    error,
    refresh,
    updatePreferences,
    preferences
  }
}

// ============================================================================
// AI系统状态Hooks (AI System Status Hooks)
// ============================================================================

/**
 * 使用AI系统状态的Hook
 */
export function useAISystemStatus() {
  const [systemStatus, setSystemStatus] = useState(aiSystem.getSystemStatus())

  const refreshStatus = useCallback(() => {
    setSystemStatus(aiSystem.getSystemStatus())
  }, [])

  useEffect(() => {
    const interval = setInterval(refreshStatus, 5000) // 每5秒刷新一次
    return () => clearInterval(interval)
  }, [refreshStatus])

  return {
    systemStatus,
    refreshStatus,
    isHealthy: systemStatus.isActive && systemStatus.isInitialized,
    performance: systemStatus.performance,
    modules: systemStatus.modules
  }
}

/**
 * 使用AI性能指标的Hook
 */
export function useAIPerformanceMetrics() {
  const systemStatus = useAISystemStatus()

  return {
    responseTime: systemStatus.performance.averageResponseTime,
    cacheHitRate: systemStatus.performance.cacheHitRate,
    memoryUsage: systemStatus.performance.memoryUsage,
    uptime: systemStatus.statistics.uptime,
    totalRequests: systemStatus.statistics.totalRecommendations + systemStatus.statistics.totalGenerations,
    isPerformant: systemStatus.performance.averageResponseTime < 100 && systemStatus.performance.cacheHitRate > 0.5
  }
}