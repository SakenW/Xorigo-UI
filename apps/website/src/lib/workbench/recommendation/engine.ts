/**
 * 智能推荐引擎核心实现
 * 基于多种策略的混合推荐系统
 */

import type {
  UserBehavior,
  UserProfile,
  RecommendationStrategy,
  RecommendationResult,
  RecommendationContext,
  RecommendationConfig,
  RecommendationEngine
} from './types'

/**
 * 默认配置
 */
const DEFAULT_CONFIG: RecommendationConfig = {
  maxRecommendations: 10,
  minScore: 0.3,
  enableRealTimeUpdates: true,
  cacheExpiration: 30,
  enableLearning: true,
  strategies: {
    collaborative: { enabled: true, weight: 0.3 },
    contentBased: { enabled: true, weight: 0.3 },
    popularity: { enabled: true, weight: 0.2 },
    contextual: { enabled: true, weight: 0.1 },
    trending: { enabled: true, weight: 0.1 }
  }
}

/**
 * 智能推荐引擎实现
 */
export class SmartRecommendationEngine implements RecommendationEngine {
  private behaviors: UserBehavior[] = []
  private userProfiles: Map<string, UserProfile> = new Map()
  private strategies: Map<string, RecommendationStrategy> = new Map()
  private config: RecommendationConfig
  private cache: Map<string, { results: RecommendationResult[]; timestamp: number }> = new Map()

  constructor(config: Partial<RecommendationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.initializeStrategies()
  }

  /**
   * 记录用户行为
   */
  trackBehavior(behavior: UserBehavior): void {
    this.behaviors.push(behavior)

    // 更新用户档案
    this.updateUserProfile(behavior)

    // 清理缓存（实时更新）
    if (this.config.enableRealTimeUpdates) {
      this.clearCache()
    }

    // 限制行为记录数量
    if (this.behaviors.length > 10000) {
      this.behaviors = this.behaviors.slice(-5000)
    }
  }

  /**
   * 获取推荐
   */
  async getRecommendations(
    userProfile: UserProfile,
    context?: RecommendationContext
  ): Promise<RecommendationResult[]> {
    const cacheKey = this.generateCacheKey(userProfile, context)

    // 检查缓存
    const cached = this.getFromCache(cacheKey)
    if (cached) {
      return cached
    }

    const results: RecommendationResult[] = []
    const enabledStrategies = Array.from(this.strategies.values())
      .filter(strategy => strategy.enabled)

    // 并行执行所有推荐策略
    const strategyResults = await Promise.all(
      enabledStrategies.map(async strategy => {
        try {
          return strategy.recommend(userProfile, this.behaviors, [], context)
        } catch (error) {
          console.error(`Recommendation strategy ${strategy.id} failed:`, error)
          return []
        }
      })
    )

    // 合并和加权结果
    const combinedResults = this.combineResults(strategyResults)

    // 过滤和排序
    const filteredResults = combinedResults
      .filter(result => result.score >= this.config.minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config.maxRecommendations)

    // 缓存结果
    this.setCache(cacheKey, filteredResults)

    return filteredResults
  }

  /**
   * 获取相似组件
   */
  async getSimilarComponents(componentId: string, limit = 5): Promise<RecommendationResult[]> {
    // 基于内容的相似性
    const contentStrategy = this.strategies.get('content-based')
    if (contentStrategy) {
      const mockProfile: UserProfile = {
        interests: {},
        skillLevel: 'intermediate',
        preferredComplexity: {},
        frequentlyUsed: [],
        searchPatterns: {
          commonQueries: [],
          preferredCategories: [],
          averageSessionDuration: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const results = contentStrategy.recommend(mockProfile, this.behaviors, [], {
        currentComponent: componentId
      })

      return results.slice(0, limit)
    }

    return []
  }

  /**
   * 获取热门组件
   */
  async getTrendingComponents(timeWindow = 7 * 24 * 60 * 60 * 1000): Promise<RecommendationResult[]> {
    const now = Date.now()
    const recentBehaviors = this.behaviors.filter(
      behavior => now - behavior.timestamp.getTime() < timeWindow
    )

    const componentFrequency = new Map<string, number>()

    recentBehaviors.forEach(behavior => {
      const count = componentFrequency.get(behavior.componentId) || 0
      componentFrequency.set(behavior.componentId, count + 1)
    })

    const results: RecommendationResult[] = Array.from(componentFrequency.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([componentId, frequency], index) => ({
        componentId,
        component: null, // 这里应该从组件库获取实际组件对象
        score: frequency / Math.max(...componentFrequency.values()),
        reasons: ['近期热门'],
        strategy: 'trending',
        confidence: 0.8 - index * 0.05,
        timestamp: new Date()
      }))

    return results
  }

  /**
   * 更新用户反馈
   */
  updateFeedback(
    componentId: string,
    feedback: 'positive' | 'negative',
    context?: any
  ): void {
    const behavior: UserBehavior = {
      sessionId: this.generateSessionId(),
      type: feedback === 'positive' ? 'favorite' : 'view',
      componentId,
      timestamp: new Date(),
      feedback,
      context
    }

    this.trackBehavior(behavior)
  }

  /**
   * 获取推荐解释
   */
  getExplanation(recommendation: RecommendationResult): string {
    const strategyExplanations: Record<string, string> = {
      'collaborative': '基于与您相似的用户的使用习惯推荐',
      'content-based': '基于您过去喜欢的组件特性推荐',
      'popularity': '这是最受欢迎的组件之一',
      'contextual': '基于当前场景的相关性推荐',
      'trending': '这是最近热门的组件'
    }

    const baseExplanation = strategyExplanations[recommendation.strategy] || '基于智能算法推荐'
    const detailExplanation = recommendation.reasons.length > 0
      ? `。${recommendation.reasons.join('，')}`
      : ''

    return baseExplanation + detailExplanation
  }

  /**
   * 初始化推荐策略
   */
  private initializeStrategies(): void {
    // 协同过滤策略
    this.strategies.set('collaborative', {
      id: 'collaborative',
      name: '协同过滤',
      description: '基于相似用户的行为推荐',
      weight: this.config.strategies.collaborative.weight,
      enabled: this.config.strategies.collaborative.enabled,
      recommend: this.collaborativeFiltering.bind(this)
    })

    // 基于内容的策略
    this.strategies.set('content-based', {
      id: 'content-based',
      name: '内容推荐',
      description: '基于组件特征和用户偏好推荐',
      weight: this.config.strategies.contentBased.weight,
      enabled: this.config.strategies.contentBased.enabled,
      recommend: this.contentBasedFiltering.bind(this)
    })

    // 流行度策略
    this.strategies.set('popularity', {
      id: 'popularity',
      name: '流行度推荐',
      description: '基于整体使用频率推荐',
      weight: this.config.strategies.popularity.weight,
      enabled: this.config.strategies.popularity.enabled,
      recommend: this.popularityBasedFiltering.bind(this)
    })

    // 上下文策略
    this.strategies.set('contextual', {
      id: 'contextual',
      name: '上下文推荐',
      description: '基于当前使用场景推荐',
      weight: this.config.strategies.contextual.weight,
      enabled: this.config.strategies.contextual.enabled,
      recommend: this.contextualFiltering.bind(this)
    })

    // 趋势策略
    this.strategies.set('trending', {
      id: 'trending',
      name: '趋势推荐',
      description: '基于近期使用趋势推荐',
      weight: this.config.strategies.trending.weight,
      enabled: this.config.strategies.trending.enabled,
      recommend: this.trendingBasedFiltering.bind(this)
    })
  }

  /**
   * 协同过滤推荐
   */
  private collaborativeFiltering(
    userProfile: UserProfile,
    behaviors: UserBehavior[],
    components: any[],
    context?: RecommendationContext
  ): RecommendationResult[] {
    // 简化的协同过滤实现
    const userComponentFrequency = new Map<string, number>()

    behaviors
      .filter(b => b.type === 'view' || b.type === 'copy')
      .forEach(behavior => {
        const count = userComponentFrequency.get(behavior.componentId) || 0
        userComponentFrequency.set(behavior.componentId, count + 1)
      })

    return Array.from(userComponentFrequency.entries())
      .map(([componentId, frequency]) => ({
        componentId,
        component: null,
        score: Math.min(frequency / 10, 1),
        reasons: ['其他用户也使用了此组件'],
        strategy: 'collaborative',
        confidence: 0.7,
        timestamp: new Date()
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }

  /**
   * 基于内容的推荐
   */
  private contentBasedFiltering(
    userProfile: UserProfile,
    behaviors: UserBehavior[],
    components: any[],
    context?: RecommendationContext
  ): RecommendationResult[] {
    const categoryScores = userProfile.interests || {}
    const complexityScores = userProfile.preferredComplexity || {}

    return Object.entries(categoryScores)
      .map(([category, score]) => ({
        componentId: `${category}-component`,
        component: null,
        score: score * 0.7,
        reasons: ['符合您的兴趣偏好'],
        strategy: 'content-based',
        confidence: 0.8,
        timestamp: new Date()
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }

  /**
   * 流行度推荐
   */
  private popularityBasedFiltering(
    userProfile: UserProfile,
    behaviors: UserBehavior[],
    components: any[],
    context?: RecommendationContext
  ): RecommendationResult[] {
    const componentFrequency = new Map<string, number>()

    behaviors.forEach(behavior => {
      const count = componentFrequency.get(behavior.componentId) || 0
      componentFrequency.set(behavior.componentId, count + 1)
    })

    const totalInteractions = behaviors.length

    return Array.from(componentFrequency.entries())
      .map(([componentId, frequency]) => ({
        componentId,
        component: null,
        score: frequency / totalInteractions,
        reasons: ['这是热门组件'],
        strategy: 'popularity',
        confidence: 0.6,
        timestamp: new Date()
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }

  /**
   * 上下文推荐
   */
  private contextualFiltering(
    userProfile: UserProfile,
    behaviors: UserBehavior[],
    components: any[],
    context?: RecommendationContext
  ): RecommendationResult[] {
    if (!context) return []

    const results: RecommendationResult[] = []

    // 基于当前组件推荐相似组件
    if (context.currentComponent) {
      results.push({
        componentId: `similar-to-${context.currentComponent}`,
        component: null,
        score: 0.8,
        reasons: ['与当前组件相似'],
        strategy: 'contextual',
        confidence: 0.9,
        timestamp: new Date()
      })
    }

    // 基于时间推荐
    if (context.time.hour >= 9 && context.time.hour <= 17) {
      results.push({
        componentId: 'work-hours-component',
        component: null,
        score: 0.6,
        reasons: ['工作时间常用组件'],
        strategy: 'contextual',
        confidence: 0.5,
        timestamp: new Date()
      })
    }

    return results
  }

  /**
   * 趋势推荐
   */
  private trendingBasedFiltering(
    userProfile: UserProfile,
    behaviors: UserBehavior[],
    components: any[],
    context?: RecommendationContext
  ): RecommendationResult[] {
    const now = new Date()
    const recentBehaviors = behaviors.filter(
      behavior => now.getTime() - behavior.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
    )

    const componentFrequency = new Map<string, number>()

    recentBehaviors.forEach(behavior => {
      const count = componentFrequency.get(behavior.componentId) || 0
      componentFrequency.set(behavior.componentId, count + 1)
    })

    return Array.from(componentFrequency.entries())
      .map(([componentId, frequency]) => ({
        componentId,
        component: null,
        score: frequency / Math.max(1, recentBehaviors.length / 10),
        reasons: ['最近使用趋势上升'],
        strategy: 'trending',
        confidence: 0.7,
        timestamp: new Date()
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
  }

  /**
   * 合并多个策略的结果
   */
  private combineResults(strategyResults: RecommendationResult[][]): RecommendationResult[] {
    const combinedMap = new Map<string, RecommendationResult>()

    strategyResults.forEach(results => {
      results.forEach(result => {
        const existing = combinedMap.get(result.componentId)
        if (existing) {
          // 加权合并
          const strategy = this.strategies.get(result.strategy)
          const weight = strategy?.weight || 1

          existing.score = Math.max(existing.score, result.score)
          existing.reasons.push(...result.reasons)
          existing.confidence = Math.max(existing.confidence, result.confidence)
        } else {
          combinedMap.set(result.componentId, { ...result })
        }
      })
    })

    return Array.from(combinedMap.values())
  }

  /**
   * 更新用户档案
   */
  private updateUserProfile(behavior: UserBehavior): void {
    const userId = behavior.userId || 'anonymous'
    let profile = this.userProfiles.get(userId)

    if (!profile) {
      profile = {
        userId,
        interests: {},
        skillLevel: 'intermediate',
        preferredComplexity: {},
        frequentlyUsed: [],
        searchPatterns: {
          commonQueries: [],
          preferredCategories: [],
          averageSessionDuration: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
      this.userProfiles.set(userId, profile)
    }

    // 更新兴趣分类
    if (behavior.context?.category) {
      const category = behavior.context.category
      profile.interests[category] = (profile.interests[category] || 0) + 1
    }

    // 更新常用组件
    const existingIndex = profile.frequentlyUsed.findIndex(
      item => item.componentId === behavior.componentId
    )
    if (existingIndex >= 0) {
      profile.frequentlyUsed[existingIndex].frequency += 1
      profile.frequentlyUsed[existingIndex].lastUsed = behavior.timestamp
    } else {
      profile.frequentlyUsed.push({
        componentId: behavior.componentId,
        frequency: 1,
        lastUsed: behavior.timestamp
      })
    }

    // 更新时间
    profile.updatedAt = behavior.timestamp
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(userProfile: UserProfile, context?: RecommendationContext): string {
    const profileHash = JSON.stringify({
      interests: userProfile.interests,
      skillLevel: userProfile.skillLevel
    })
    const contextHash = context ? JSON.stringify(context) : ''
    return `${btoa(profileHash).slice(0, 16)}_${btoa(contextHash).slice(0, 16)}`
  }

  /**
   * 从缓存获取结果
   */
  private getFromCache(key: string): RecommendationResult[] | null {
    const cached = this.cache.get(key)
    if (cached) {
      const age = Date.now() - cached.timestamp
      if (age < this.config.cacheExpiration * 60 * 1000) {
        return cached.results
      }
      this.cache.delete(key)
    }
    return null
  }

  /**
   * 设置缓存
   */
  private setCache(key: string, results: RecommendationResult[]): void {
    this.cache.set(key, {
      results,
      timestamp: Date.now()
    })

    // 限制缓存大小
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
  }

  /**
   * 清空缓存
   */
  private clearCache(): void {
    this.cache.clear()
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * 创建推荐引擎实例
 */
export function createRecommendationEngine(config?: Partial<RecommendationConfig>): RecommendationEngine {
  return new SmartRecommendationEngine(config)
}