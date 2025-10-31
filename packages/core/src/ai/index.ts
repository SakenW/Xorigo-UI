/**
 * 🤖 Xorigo UI AI系统统一接口
 *
 * 整合AI推荐引擎、配方生成器、用户行为分析器和设计助手
 * 提供统一的AI服务接口和API
 */

// 核心类导出
export { AIRecipeRecommendationEngine, aiRecommendationEngine } from './recommendation-engine'
export { AIRecipeGenerator, aiRecipeGenerator } from './recipe-generator'
export { UserBehaviorAnalyzer, userBehaviorAnalyzer } from './user-behavior-analyzer'
export { AIDesignAssistant, aiDesignAssistant } from './design-assistant'

// 类型导出
export type {
  // 推荐引擎类型
  UserPreferenceProfile,
  RecipeSimilarityResult,
  AIRecommendationResult,
  RecommendedRecipe,

  // 配方生成器类型
  RecipeGenerationParams,
  RecipeGenerationResult,
  GeneratedRecipe,

  // 用户行为分析类型
  UserBehaviorEvent,
  UserSession,
  BehaviorPatternAnalysis,
  RealTimeBehaviorAnalysis,

  // 设计助手类型
  DesignAssessmentResult,
  DesignAssistantSuggestion,
  AccessibilityAuditResult,
  ColorHarmonyAnalysis,
  VisualHierarchyAnalysis,
  UserExperienceAnalysis
} from './recommendation-engine'

// ============================================================================
// AI系统管理器 (AI System Manager)
// ============================================================================

import type { StyleRecipe } from '@xorigo-ui/style-recipe'
import type {
  UserPreferenceProfile,
  AIRecommendationResult,
  RecipeGenerationParams,
  RecipeGenerationResult,
  DesignAssessmentResult,
  DesignAssistantSuggestion
} from './recommendation-engine'

import {
  aiRecommendationEngine,
  aiRecipeGenerator,
  userBehaviorAnalyzer,
  aiDesignAssistant
} from './index'

/**
 * AI系统配置
 */
export interface AISystemConfig {
  // 推荐引擎配置
  recommendation: {
    maxRecommendations: number
    cacheEnabled: boolean
    realTimeUpdates: boolean
  }

  // 配方生成器配置
  generation: {
    maxGeneratedRecipes: number
    creativityLevel: number // 0-1
    constraintStrictness: number // 0-1
  }

  // 用户行为分析配置
  analytics: {
    dataRetentionDays: number
    anonymizationEnabled: boolean
    realTimeProcessing: boolean
  }

  // 设计助手配置
  designAssistant: {
    strictAccessibilityMode: boolean
    enableRealTimeSuggestions: boolean
    suggestionPriority: 'critical' | 'balanced' | 'comprehensive'
  }

  // 性能配置
  performance: {
    enableCaching: boolean
    maxCacheSize: number
    cacheTimeout: number // 毫秒
    enableBackgroundProcessing: boolean
  }
}

/**
 * AI系统状态
 */
export interface AISystemStatus {
  isInitialized: boolean
  isActive: boolean
  performance: {
    averageResponseTime: number
    cacheHitRate: number
    memoryUsage: number
    activeConnections: number
  }
  modules: {
    recommendationEngine: 'active' | 'inactive' | 'error'
    recipeGenerator: 'active' | 'inactive' | 'error'
    userBehaviorAnalyzer: 'active' | 'inactive' | 'error'
    designAssistant: 'active' | 'inactive' | 'error'
  }
  statistics: {
    totalRecommendations: number
    totalGenerations: number
    totalAnalyses: number
    totalUsers: number
    uptime: number
  }
}

/**
 * AI服务请求结果
 */
export interface AIServiceResult<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  performance: {
    processingTime: number
    cacheHit: boolean
    timestamp: number
  }
}

/**
 * AI系统管理器
 */
export class AISystemManager {
  private config: AISystemConfig
  private status: AISystemStatus
  private cache: Map<string, any>
  private startTime: number

  constructor(config?: Partial<AISystemConfig>) {
    this.config = this.mergeConfig(config)
    this.status = this.initializeStatus()
    this.cache = new Map()
    this.startTime = Date.now()

    this.initializeSystem()
  }

  /**
   * 初始化AI系统
   */
  private async initializeSystem(): Promise<void> {
    try {
      // 初始化各个模块
      await this.initializeModules()

      // 设置定时清理任务
      this.setupMaintenanceTasks()

      this.status.isInitialized = true
      this.status.isActive = true

      console.log('🤖 Xorigo UI AI系统初始化完成')
    } catch (error) {
      console.error('❌ AI系统初始化失败:', error)
      this.status.modules.recommendationEngine = 'error'
      this.status.modules.recipeGenerator = 'error'
      this.status.modules.userBehaviorAnalyzer = 'error'
      this.status.modules.designAssistant = 'error'
    }
  }

  /**
   * 获取个性化推荐
   */
  public async getRecommendations(
    userId: string,
    context?: {
      timeOfDay?: string
      deviceType?: string
      taskType?: string
      numberOfRecommendations?: number
    }
  ): Promise<AIServiceResult<AIRecommendationResult>> {
    const startTime = performance.now()

    try {
      // 检查缓存
      const cacheKey = this.generateCacheKey('recommendations', userId, context)
      if (this.config.performance.enableCaching && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey)
        return {
          success: true,
          data: cached,
          performance: {
            processingTime: performance.now() - startTime,
            cacheHit: true,
            timestamp: Date.now()
          }
        }
      }

      // 获取推荐
      const result = await aiRecommendationEngine.generateRecommendations(userId, {
        ...context,
        numberOfRecommendations: context?.numberOfRecommendations || this.config.recommendation.maxRecommendations
      })

      // 记录用户行为
      userBehaviorAnalyzer.recordEvent({
        userId,
        sessionId: this.generateSessionId(userId),
        eventType: 'recipe_recommend',
        data: {
          recipeIds: result.recommendations.map(r => r.recipe.id),
          context
        }
      })

      // 缓存结果
      if (this.config.performance.enableCaching) {
        this.setCache(cacheKey, result, this.config.performance.cacheTimeout)
      }

      return {
        success: true,
        data: result,
        performance: {
          processingTime: performance.now() - startTime,
          cacheHit: false,
          timestamp: Date.now()
        }
      }

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'RECOMMENDATION_ERROR',
          message: error instanceof Error ? error.message : '未知推荐错误',
          details: error
        },
        performance: {
          processingTime: performance.now() - startTime,
          cacheHit: false,
          timestamp: Date.now()
        }
      }
    }
  }

  /**
   * 生成新配方
   */
  public async generateRecipes(
    params: RecipeGenerationParams,
    userId?: string
  ): Promise<AIServiceResult<RecipeGenerationResult>> {
    const startTime = performance.now()

    try {
      // 检查缓存
      const cacheKey = this.generateCacheKey('generation', params)
      if (this.config.performance.enableCaching && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey)
        return {
          success: true,
          data: cached,
          performance: {
            processingTime: performance.now() - startTime,
            cacheHit: true,
            timestamp: Date.now()
          }
        }
      }

      // 生成配方
      const result = await aiRecipeGenerator.generateRecipes(params)

      // 记录生成行为
      if (userId) {
        userBehaviorAnalyzer.recordEvent({
          userId,
          sessionId: this.generateSessionId(userId),
          eventType: 'recipe_generate',
          data: {
            keywords: params.keywords,
            mood: params.mood,
            context: params.context,
            resultCount: result.recipes.length
          }
        })
      }

      // 缓存结果
      if (this.config.performance.enableCaching) {
        this.setCache(cacheKey, result, this.config.performance.cacheTimeout)
      }

      return {
        success: true,
        data: result,
        performance: {
          processingTime: performance.now() - startTime,
          cacheHit: false,
          timestamp: Date.now()
        }
      }

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GENERATION_ERROR',
          message: error instanceof Error ? error.message : '未知生成错误',
          details: error
        },
        performance: {
          processingTime: performance.now() - startTime,
          cacheHit: false,
          timestamp: Date.now()
        }
      }
    }
  }

  /**
   * 获取设计建议
   */
  public async getDesignSuggestions(
    recipe: StyleRecipe,
    userId?: string,
    focusArea?: 'accessibility' | 'aesthetics' | 'usability' | 'performance' | 'all'
  ): Promise<AIServiceResult<DesignAssistantSuggestion[]>> {
    const startTime = performance.now()

    try {
      const suggestions = await aiDesignAssistant.generateSuggestions(recipe, focusArea)

      // 记录设计分析行为
      if (userId) {
        userBehaviorAnalyzer.recordEvent({
          userId,
          sessionId: this.generateSessionId(userId),
          eventType: 'recipe_analysis',
          data: {
            recipeId: recipe.id,
            focusArea,
            suggestionCount: suggestions.length
          }
        })
      }

      return {
        success: true,
        data: suggestions,
        performance: {
          processingTime: performance.now() - startTime,
          cacheHit: false,
          timestamp: Date.now()
        }
      }

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DESIGN_ASSISTANT_ERROR',
          message: error instanceof Error ? error.message : '设计助手错误',
          details: error
        },
        performance: {
          processingTime: performance.now() - startTime,
          cacheHit: false,
          timestamp: Date.now()
        }
      }
    }
  }

  /**
   * 全面设计评估
   */
  public async assessDesign(
    recipe: StyleRecipe,
    userId?: string,
    context?: any
  ): Promise<AIServiceResult<DesignAssessmentResult>> {
    const startTime = performance.now()

    try {
      const result = await aiDesignAssistant.assessDesign(recipe, context)

      // 记录设计评估行为
      if (userId) {
        userBehaviorAnalyzer.recordEvent({
          userId,
          sessionId: this.generateSessionId(userId),
          eventType: 'design_assessment',
          data: {
            recipeId: recipe.id,
            overallScore: result.overallScore,
            context
          }
        })
      }

      return {
        success: true,
        data: result,
        performance: {
          processingTime: performance.now() - startTime,
          cacheHit: false,
          timestamp: Date.now()
        }
      }

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DESIGN_ASSESSMENT_ERROR',
          message: error instanceof Error ? error.message : '设计评估错误',
          details: error
        },
        performance: {
          processingTime: performance.now() - startTime,
          cacheHit: false,
          timestamp: Date.now()
        }
      }
    }
  }

  /**
   * 获取用户行为分析
   */
  public getUserBehaviorAnalysis(
    userId: string,
    period?: { start: Date; end: Date }
  ): AIServiceResult {
    try {
      const analysis = userBehaviorAnalyzer.analyzeBehaviorPatterns(userId, period)

      return {
        success: true,
        data: analysis,
        performance: {
          processingTime: 0,
          cacheHit: false,
          timestamp: Date.now()
        }
      }

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'BEHAVIOR_ANALYSIS_ERROR',
          message: error instanceof Error ? error.message : '行为分析错误',
          details: error
        },
        performance: {
          processingTime: 0,
          cacheHit: false,
          timestamp: Date.now()
        }
      }
    }
  }

  /**
   * 更新用户偏好
   */
  public updateUserPreferences(userId: string): AIServiceResult<UserPreferenceProfile> {
    try {
      const profile = userBehaviorAnalyzer.updateUserPreferenceProfile(userId)

      return {
        success: true,
        data: profile,
        performance: {
          processingTime: 0,
          cacheHit: false,
          timestamp: Date.now()
        }
      }

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PREFERENCE_UPDATE_ERROR',
          message: error instanceof Error ? error.message : '偏好更新错误',
          details: error
        },
        performance: {
          processingTime: 0,
          cacheHit: false,
          timestamp: Date.now()
        }
      }
    }
  }

  /**
   * 记录用户事件
   */
  public recordUserEvent(
    userId: string,
    eventType: string,
    data: any
  ): AIServiceResult {
    try {
      userBehaviorAnalyzer.recordEvent({
        userId,
        sessionId: this.generateSessionId(userId),
        eventType: eventType as any,
        data,
        context: {
          timeOfDay: new Date().getHours().toString(),
          deviceType: 'unknown',
          sessionDuration: 0,
          taskContext: 'unknown'
        }
      })

      return {
        success: true,
        performance: {
          processingTime: 0,
          cacheHit: false,
          timestamp: Date.now()
        }
      }

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'EVENT_RECORDING_ERROR',
          message: error instanceof Error ? error.message : '事件记录错误',
          details: error
        },
        performance: {
          processingTime: 0,
          cacheHit: false,
          timestamp: Date.now()
        }
      }
    }
  }

  /**
   * 获取系统状态
   */
  public getSystemStatus(): AISystemStatus {
    // 更新性能指标
    this.updatePerformanceMetrics()

    return { ...this.status }
  }

  /**
   * 更新配置
   */
  public updateConfig(newConfig: Partial<AISystemConfig>): void {
    this.config = this.mergeConfig(newConfig)
  }

  /**
   * 清理缓存
   */
  public clearCache(): void {
    this.cache.clear()
    aiRecommendationEngine.clearCache()
    aiRecipeGenerator.clearCache()
  }

  /**
   * 关闭系统
   */
  public shutdown(): void {
    this.status.isActive = false
    this.clearCache()
    console.log('🤖 Xorigo UI AI系统已关闭')
  }

  // ============================================================================
  // 私有方法 (Private Methods)
  // ============================================================================

  private mergeConfig(userConfig?: Partial<AISystemConfig>): AISystemConfig {
    const defaultConfig: AISystemConfig = {
      recommendation: {
        maxRecommendations: 5,
        cacheEnabled: true,
        realTimeUpdates: true
      },
      generation: {
        maxGeneratedRecipes: 5,
        creativityLevel: 0.7,
        constraintStrictness: 0.8
      },
      analytics: {
        dataRetentionDays: 90,
        anonymizationEnabled: true,
        realTimeProcessing: true
      },
      designAssistant: {
        strictAccessibilityMode: false,
        enableRealTimeSuggestions: true,
        suggestionPriority: 'balanced'
      },
      performance: {
        enableCaching: true,
        maxCacheSize: 1000,
        cacheTimeout: 5 * 60 * 1000, // 5分钟
        enableBackgroundProcessing: true
      }
    }

    return {
      recommendation: { ...defaultConfig.recommendation, ...userConfig?.recommendation },
      generation: { ...defaultConfig.generation, ...userConfig?.generation },
      analytics: { ...defaultConfig.analytics, ...userConfig?.analytics },
      designAssistant: { ...defaultConfig.designAssistant, ...userConfig?.designAssistant },
      performance: { ...defaultConfig.performance, ...userConfig?.performance }
    }
  }

  private initializeStatus(): AISystemStatus {
    return {
      isInitialized: false,
      isActive: false,
      performance: {
        averageResponseTime: 0,
        cacheHitRate: 0,
        memoryUsage: 0,
        activeConnections: 0
      },
      modules: {
        recommendationEngine: 'inactive',
        recipeGenerator: 'inactive',
        userBehaviorAnalyzer: 'inactive',
        designAssistant: 'inactive'
      },
      statistics: {
        totalRecommendations: 0,
        totalGenerations: 0,
        totalAnalyses: 0,
        totalUsers: 0,
        uptime: 0
      }
    }
  }

  private async initializeModules(): Promise<void> {
    try {
      // 测试各个模块
      await aiRecommendationEngine.getPerformanceMetrics()
      this.status.modules.recommendationEngine = 'active'

      await aiRecipeGenerator.getGenerationStats()
      this.status.modules.recipeGenerator = 'active'

      userBehaviorAnalyzer.getAnalyticsStats()
      this.status.modules.userBehaviorAnalyzer = 'active'

      // 设计助手不需要异步初始化
      this.status.modules.designAssistant = 'active'

    } catch (error) {
      console.error('模块初始化失败:', error)
      throw error
    }
  }

  private setupMaintenanceTasks(): void {
    // 定期清理过期缓存
    setInterval(() => {
      this.cleanExpiredCache()
    }, 10 * 60 * 1000) // 每10分钟清理一次

    // 定期更新性能指标
    setInterval(() => {
      this.updatePerformanceMetrics()
    }, 60 * 1000) // 每分钟更新一次
  }

  private generateCacheKey(type: string, ...params: any[]): string {
    return `${type}:${JSON.stringify(params)}`
  }

  private generateSessionId(userId: string): string {
    return `session_${userId}_${Date.now()}`
  }

  private setCache(key: string, value: any, timeout: number): void {
    // 检查缓存大小限制
    if (this.cache.size >= this.config.performance.maxCacheSize) {
      // 删除最旧的缓存项
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      timeout
    })
  }

  private cleanExpiredCache(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.timeout) {
        this.cache.delete(key)
      }
    }
  }

  private updatePerformanceMetrics(): void {
    // 获取各模块性能指标
    const recommendationMetrics = aiRecommendationEngine.getPerformanceMetrics()
    const generationStats = aiRecipeGenerator.getGenerationStats()
    const analyticsStats = userBehaviorAnalyzer.getAnalyticsStats()

    // 更新状态
    this.status.performance.averageResponseTime = recommendationMetrics.averageResponseTime
    this.status.performance.cacheHitRate = recommendationMetrics.cacheHitRate || 0
    this.status.performance.memoryUsage = this.cache.size

    // 更新统计信息
    this.status.statistics.totalRecommendations = recommendationMetrics.totalRecommendations
    this.status.statistics.totalGenerations = generationStats.cacheSize // 简化统计
    this.status.statistics.totalAnalyses = analyticsStats.cacheSize // 简化统计
    this.status.statistics.totalUsers = analyticsStats.activeUsers
    this.status.statistics.uptime = Date.now() - this.startTime
  }
}

// ============================================================================
// 默认AI系统实例 (Default AI System Instance)
// ============================================================================

export const aiSystem = new AISystemManager({
  recommendation: {
    maxRecommendations: 5,
    cacheEnabled: true,
    realTimeUpdates: true
  },
  generation: {
    maxGeneratedRecipes: 5,
    creativityLevel: 0.7,
    constraintStrictness: 0.8
  },
  analytics: {
    dataRetentionDays: 90,
    anonymizationEnabled: true,
    realTimeProcessing: true
  },
  designAssistant: {
    strictAccessibilityMode: false,
    enableRealTimeSuggestions: true,
    suggestionPriority: 'balanced'
  },
  performance: {
    enableCaching: true,
    maxCacheSize: 1000,
    cacheTimeout: 5 * 60 * 1000,
    enableBackgroundProcessing: true
  }
})

// ============================================================================
// 便捷API (Convenience API)
// ============================================================================

/**
 * 快速获取推荐
 */
export async function getRecommendations(userId: string, context?: any) {
  return await aiSystem.getRecommendations(userId, context)
}

/**
 * 快速生成配方
 */
export async function generateRecipes(params: RecipeGenerationParams, userId?: string) {
  return await aiSystem.generateRecipes(params, userId)
}

/**
 * 快速获取设计建议
 */
export async function getDesignSuggestions(recipe: StyleRecipe, userId?: string) {
  return await aiSystem.getDesignSuggestions(recipe, userId)
}

/**
 * 快速评估设计
 */
export async function assessDesign(recipe: StyleRecipe, userId?: string) {
  return await aiSystem.assessDesign(recipe, userId)
}

/**
 * 记录用户行为
 */
export function recordUserAction(userId: string, action: string, data: any) {
  return aiSystem.recordUserEvent(userId, action, data)
}