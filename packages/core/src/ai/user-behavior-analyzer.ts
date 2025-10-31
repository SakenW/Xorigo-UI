/**
 * 📊 用户行为分析系统
 *
 * 收集、分析和学习用户的配方使用行为
 * 建立个性化偏好模型和行为模式识别
 */

import type { StyleRecipe } from '@xorigo-ui/style-recipe'
import type { UserPreferenceProfile } from './recommendation-engine'

// ============================================================================
// 用户行为分析类型 (User Behavior Analysis Types)
// ============================================================================

/**
 * 用户行为事件
 */
export interface UserBehaviorEvent {
  id: string
  userId: string
  timestamp: Date
  eventType: 'recipe_view' | 'recipe_select' | 'recipe_switch' | 'recipe_search' | 'recipe_filter' | 'recipe_favorite' | 'recipe_share'
  data: {
    recipeId?: string
    recipeIds?: string[]
    searchQuery?: string
    filterOptions?: any
    context?: {
      timeOfDay: string
      deviceType: string
      sessionDuration: number
      taskContext: string
    }
    metadata?: Record<string, any>
  }
  sessionId: string
}

/**
 * 用户会话信息
 */
export interface UserSession {
  id: string
  userId: string
  startTime: Date
  endTime?: Date
  duration?: number
  events: UserBehaviorEvent[]
  context: {
    deviceType: string
    browser: string
    screenResolution: string
    referrer?: string
  }
  conversion: {
    recipesViewed: string[]
    recipesSelected: string[]
    recipesSwitched: string[]
    timeSpentOnRecipes: Record<string, number>
  }
}

/**
 * 行为模式分析结果
 */
export interface BehaviorPatternAnalysis {
  userId: string
  analysisPeriod: {
    start: Date
    end: Date
  }
  patterns: {
    temporal: {
      peakUsageHours: number[]
      preferredModes: Record<string, number>
      sessionDurationDistribution: {
        short: number // < 5 min
        medium: number // 5-15 min
        long: number // > 15 min
      }
    }
    contextual: {
      deviceUsage: Record<string, number>
      taskContextUsage: Record<string, number>
      environmentUsage: Record<string, number>
    }
    preferential: {
      favoriteRecipes: Array<{
        recipeId: string
        frequency: number
        lastUsed: Date
        averageTimeSpent: number
      }>
      preferredAxes: {
        mode: Record<string, number>
        base: Record<string, number>
        accent: Record<string, number>
        tone: Record<string, number>
        density: Record<string, number>
        motion: Record<string, number>
        surface: Record<string, number>
      }
      explorationPatterns: {
        recipeSwitchFrequency: number
        searchQueryComplexity: number
        filterUsageFrequency: number
        categoryExplorationRate: number
      }
    }
    aesthetic: {
      colorPreferences: Record<string, number>
      contrastPreferences: Record<string, number>
      complexityPreferences: Record<string, number>
      emotionalTonePreferences: Record<string, number>
    }
    accessibility: {
      highContrastUsage: number
      reducedMotionUsage: number
      cvdFriendlyUsage: number
      accessibilityFeatureUsage: number
    }
  }
  insights: {
    userPersona: 'minimalist' | 'explorer' | 'professional' | 'creative' | 'accessibility-focused'
    adaptationSpeed: 'conservative' | 'balanced' | 'aggressive'
    decisionMakingStyle: 'quick' | 'deliberate' | 'experimental'
    satisfactionIndicators: {
      recipeSelectionRate: number
      recipeRetentionRate: number
      sessionCompletionRate: number
      returnVisitRate: number
    }
  }
  recommendations: {
    recipeRecommendations: string[]
    featureRecommendations: string[]
    improvementSuggestions: string[]
  }
}

/**
 * 实时行为分析结果
 */
export interface RealTimeBehaviorAnalysis {
  userId: string
  currentSession: {
    duration: number
    eventsCount: number
    recipesViewed: string[]
    activeTime: number
  }
  immediateInsights: {
    engagementLevel: 'low' | 'medium' | 'high'
    satisfactionSignals: string[]
    frustrationSignals: string[]
    nextActionPrediction: {
      likelyAction: string
      confidence: number
      reasoning: string
    }
  }
  contextualAdaptations: {
    suggestedRecipes: string[]
    uiAdjustments: {
      density: string
      motion: string
      contrast: string
    }
    featureHighlights: string[]
  }
}

// ============================================================================
// 用户行为分析器核心类 (User Behavior Analyzer Core Class)
// ============================================================================

/**
 * 用户行为分析器
 */
export class UserBehaviorAnalyzer {
  private userSessions: Map<string, UserSession[]>
  private userProfiles: Map<string, UserPreferenceProfile>
  private behaviorEvents: UserBehaviorEvent[]
  private analysisCache: Map<string, BehaviorPatternAnalysis>
  private realTimeCache: Map<string, RealTimeBehaviorAnalysis>

  constructor() {
    this.userSessions = new Map()
    this.userProfiles = new Map()
    this.behaviorEvents = []
    this.analysisCache = new Map()
    this.realTimeCache = new Map()
  }

  /**
   * 记录用户行为事件
   */
  public recordEvent(event: Omit<UserBehaviorEvent, 'id' | 'timestamp'>): void {
    const fullEvent: UserBehaviorEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date()
    }

    this.behaviorEvents.push(fullEvent)

    // 更新会话信息
    this.updateSession(fullEvent)

    // 更新实时分析
    this.updateRealTimeAnalysis(event.userId)

    // 如果事件数量达到阈值，触发批量分析
    if (this.behaviorEvents.length % 100 === 0) {
      this.performBatchAnalysis()
    }
  }

  /**
   * 分析用户行为模式
   */
  public analyzeBehaviorPatterns(userId: string, period?: { start: Date; end: Date }): BehaviorPatternAnalysis {
    const cacheKey = `${userId}-${period?.start.getTime()}-${period?.end.getTime()}`
    if (this.analysisCache.has(cacheKey)) {
      return this.analysisCache.get(cacheKey)!
    }

    const userEvents = this.getUserEvents(userId, period)
    const userSessions = this.getUserSessions(userId, period)

    const analysis: BehaviorPatternAnalysis = {
      userId,
      analysisPeriod: {
        start: period?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 默认30天
        end: period?.end || new Date()
      },
      patterns: {
        temporal: this.analyzeTemporalPatterns(userEvents, userSessions),
        contextual: this.analyzeContextualPatterns(userEvents),
        preferential: this.analyzePreferentialPatterns(userEvents, userSessions),
        aesthetic: this.analyzeAestheticPatterns(userEvents),
        accessibility: this.analyzeAccessibilityPatterns(userEvents)
      },
      insights: this.generateUserInsights(userEvents, userSessions),
      recommendations: this.generateRecommendations(userEvents, userSessions)
    }

    this.analysisCache.set(cacheKey, analysis)
    return analysis
  }

  /**
   * 获取实时行为分析
   */
  public getRealTimeAnalysis(userId: string): RealTimeBehaviorAnalysis {
    if (this.realTimeCache.has(userId)) {
      return this.realTimeCache.get(userId)!
    }

    const currentSession = this.getCurrentSession(userId)
    const recentEvents = this.getRecentEvents(userId, 10) // 最近10个事件

    const analysis: RealTimeBehaviorAnalysis = {
      userId,
      currentSession: {
        duration: currentSession ? Date.now() - currentSession.startTime.getTime() : 0,
        eventsCount: recentEvents.length,
        recipesViewed: currentSession?.conversion.recipesViewed || [],
        activeTime: this.calculateActiveTime(recentEvents)
      },
      immediateInsights: this.analyzeImmediateInsights(recentEvents),
      contextualAdaptations: this.generateContextualAdaptations(recentEvents, userId)
    }

    this.realTimeCache.set(userId, analysis)
    return analysis
  }

  /**
   * 更新用户偏好模型
   */
  public updateUserPreferenceProfile(userId: string): UserPreferenceProfile {
    const analysis = this.analyzeBehaviorPatterns(userId)
    const existingProfile = this.userProfiles.get(userId)

    const updatedProfile: UserPreferenceProfile = {
      userId,
      preferences: {
        modeWeights: this.calculateAxisWeights(analysis.patterns.preferential.preferredAxes.mode),
        baseWeights: this.calculateAxisWeights(analysis.patterns.preferential.preferredAxes.base),
        accentWeights: this.calculateAxisWeights(analysis.patterns.preferential.preferredAxes.accent),
        toneWeights: this.calculateAxisWeights(analysis.patterns.preferential.preferredAxes.tone),
        densityWeights: this.calculateAxisWeights(analysis.patterns.preferential.preferredAxes.density),
        motionWeights: this.calculateAxisWeights(analysis.patterns.preferential.preferredAxes.motion),
        surfaceWeights: this.calculateAxisWeights(analysis.patterns.preferential.preferredAxes.surface)
      },
      behaviorPatterns: {
        timeOfDayUsage: this.calculateTimeOfDayUsage(analysis.patterns.temporal.peakUsageHours),
        contextUsage: analysis.patterns.contextual.taskContextUsage,
        interactionStyle: this.mapPersonaToInteractionStyle(analysis.insights.userPersona),
        adaptationSpeed: analysis.insights.adaptationSpeed
      },
      aestheticPreferences: {
        colorHarmony: this.inferColorHarmony(analysis.patterns.aesthetic.colorPreferences),
        contrastLevel: this.inferContrastLevel(analysis.patterns.aesthetic.contrastPreferences),
        visualComplexity: this.inferVisualComplexity(analysis.patterns.aesthetic.complexityPreferences),
        emotionalTone: Object.keys(analysis.patterns.aesthetic.emotionalTonePreferences).slice(0, 3)
      },
      accessibilityNeeds: {
        highContrast: analysis.patterns.accessibility.highContrastUsage > 0.3,
        reducedMotion: analysis.patterns.accessibility.reducedMotionUsage > 0.3,
        cvdFriendly: analysis.patterns.accessibility.cvdFriendlyUsage > 0.3
      },
      lastUpdated: new Date()
    }

    this.userProfiles.set(userId, updatedProfile)
    return updatedProfile
  }

  // ============================================================================
  // 私有方法 (Private Methods)
  // ============================================================================

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private updateSession(event: UserBehaviorEvent): void {
    let session = this.getCurrentSession(event.userId)

    if (!session || this.shouldStartNewSession(session, event)) {
      session = this.createNewSession(event.userId)
    }

    session.events.push(event)

    // 更新会话转换信息
    this.updateSessionConversion(session, event)
  }

  private getCurrentSession(userId: string): UserSession | undefined {
    const sessions = this.userSessions.get(userId) || []
    const lastSession = sessions[sessions.length - 1]

    // 检查会话是否仍然活跃（30分钟内有活动）
    if (lastSession && !lastSession.endTime) {
      const timeSinceLastEvent = Date.now() - lastSession.startTime.getTime()
      if (timeSinceLastEvent < 30 * 60 * 1000) { // 30分钟
        return lastSession
      }
    }

    return undefined
  }

  private shouldStartNewSession(session: UserSession, event: UserBehaviorEvent): boolean {
    const timeSinceLastEvent = event.timestamp.getTime() - session.startTime.getTime()
    return timeSinceLastEvent > 30 * 60 * 1000 // 30分钟无活动则开始新会话
  }

  private createNewSession(userId: string): UserSession {
    const session: UserSession = {
      id: this.generateSessionId(),
      userId,
      startTime: new Date(),
      events: [],
      context: {
        deviceType: 'unknown',
        browser: 'unknown',
        screenResolution: 'unknown'
      },
      conversion: {
        recipesViewed: [],
        recipesSelected: [],
        recipesSwitched: [],
        timeSpentOnRecipes: {}
      }
    }

    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, [])
    }

    this.userSessions.get(userId)!.push(session)
    return session
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private updateSessionConversion(session: UserSession, event: UserBehaviorEvent): void {
    switch (event.eventType) {
      case 'recipe_view':
        if (event.data.recipeId) {
          session.conversion.recipesViewed.push(event.data.recipeId)
        }
        break
      case 'recipe_select':
        if (event.data.recipeId) {
          session.conversion.recipesSelected.push(event.data.recipeId)
        }
        break
      case 'recipe_switch':
        if (event.data.recipeId) {
          session.conversion.recipesSwitched.push(event.data.recipeId)
        }
        break
    }
  }

  private getUserEvents(userId: string, period?: { start: Date; end: Date }): UserBehaviorEvent[] {
    return this.behaviorEvents.filter(event => {
      if (event.userId !== userId) return false
      if (period) {
        return event.timestamp >= period.start && event.timestamp <= period.end
      }
      return true
    })
  }

  private getUserSessions(userId: string, period?: { start: Date; end: Date }): UserSession[] {
    const sessions = this.userSessions.get(userId) || []
    if (!period) return sessions

    return sessions.filter(session => {
      return session.startTime >= period.start && session.startTime <= period.end
    })
  }

  private analyzeTemporalPatterns(events: UserBehaviorEvent[], sessions: UserSession[]) {
    const hourlyUsage = new Array(24).fill(0)
    const modeUsage: Record<string, number> = {}

    // 分析小时使用模式
    events.forEach(event => {
      const hour = event.timestamp.getHours()
      hourlyUsage[hour]++
    })

    // 找出使用高峰时段
    const avgUsage = hourlyUsage.reduce((sum, count) => sum + count, 0) / 24
    const peakHours = hourlyUsage
      .map((count, hour) => ({ hour, count }))
      .filter(({ count }) => count > avgUsage * 1.5)
      .map(({ hour }) => hour)

    // 分析模式使用偏好
    events
      .filter(event => event.eventType === 'recipe_select' && event.data.recipeId)
      .forEach(event => {
        const recipeId = event.data.recipeId!
        const mode = this.extractModeFromRecipeId(recipeId)
        modeUsage[mode] = (modeUsage[mode] || 0) + 1
      })

    // 分析会话时长分布
    const sessionDurations = sessions
      .filter(session => session.endTime)
      .map(session => session.duration || 0)

    const durationDistribution = {
      short: sessionDurations.filter(d => d < 5 * 60 * 1000).length / Math.max(sessionDurations.length, 1),
      medium: sessionDurations.filter(d => d >= 5 * 60 * 1000 && d <= 15 * 60 * 1000).length / Math.max(sessionDurations.length, 1),
      long: sessionDurations.filter(d => d > 15 * 60 * 1000).length / Math.max(sessionDurations.length, 1)
    }

    return {
      peakUsageHours: peakHours,
      preferredModes: modeUsage,
      sessionDurationDistribution: durationDistribution
    }
  }

  private analyzeContextualPatterns(events: UserBehaviorEvent[]) {
    const deviceUsage: Record<string, number> = {}
    const taskContextUsage: Record<string, number> = {}
    const environmentUsage: Record<string, number> = {}

    events.forEach(event => {
      if (event.data.context) {
        const context = event.data.context

        if (context.deviceType) {
          deviceUsage[context.deviceType] = (deviceUsage[context.deviceType] || 0) + 1
        }

        if (context.taskContext) {
          taskContextUsage[context.taskContext] = (taskContextUsage[context.taskContext] || 0) + 1
        }

        if (context.environment) {
          environmentUsage[context.environment] = (environmentUsage[context.environment] || 0) + 1
        }
      }
    })

    return {
      deviceUsage,
      taskContextUsage,
      environmentUsage
    }
  }

  private analyzePreferentialPatterns(events: UserBehaviorEvent[], sessions: UserSession[]) {
    // 分析最喜欢的配方
    const recipeFrequency: Record<string, { count: number; lastUsed: Date; totalTime: number }> = {}

    events
      .filter(event => event.eventType === 'recipe_select' && event.data.recipeId)
      .forEach(event => {
        const recipeId = event.data.recipeId!
        if (!recipeFrequency[recipeId]) {
          recipeFrequency[recipeId] = { count: 0, lastUsed: event.timestamp, totalTime: 0 }
        }
        recipeFrequency[recipeId].count++
        recipeFrequency[recipeId].lastUsed = event.timestamp
      })

    const favoriteRecipes = Object.entries(recipeFrequency)
      .map(([recipeId, data]) => ({
        recipeId,
        frequency: data.count,
        lastUsed: data.lastUsed,
        averageTimeSpent: data.totalTime / data.count
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10)

    // 分析轴偏好
    const selectedRecipes = events
      .filter(event => event.eventType === 'recipe_select' && event.data.recipeId)
      .map(event => event.data.recipeId!)

    const preferredAxes = {
      mode: this.analyzeAxisPreference(selectedRecipes, 'mode'),
      base: this.analyzeAxisPreference(selectedRecipes, 'base'),
      accent: this.analyzeAxisPreference(selectedRecipes, 'accent'),
      tone: this.analyzeAxisPreference(selectedRecipes, 'tone'),
      density: this.analyzeAxisPreference(selectedRecipes, 'density'),
      motion: this.analyzeAxisPreference(selectedRecipes, 'motion'),
      surface: this.analyzeAxisPreference(selectedRecipes, 'surface')
    }

    // 分析探索模式
    const explorationPatterns = {
      recipeSwitchFrequency: this.calculateRecipeSwitchFrequency(events),
      searchQueryComplexity: this.calculateSearchComplexity(events),
      filterUsageFrequency: this.calculateFilterUsage(events),
      categoryExplorationRate: this.calculateCategoryExploration(events)
    }

    return {
      favoriteRecipes,
      preferredAxes,
      explorationPatterns
    }
  }

  private analyzeAestheticPatterns(events: UserBehaviorEvent[]) {
    const colorPreferences: Record<string, number> = {}
    const contrastPreferences: Record<string, number> = {}
    const complexityPreferences: Record<string, number> = {}
    const emotionalTonePreferences: Record<string, number> = {}

    events
      .filter(event => event.eventType === 'recipe_select' && event.data.recipeId)
      .forEach(event => {
        const recipeId = event.data.recipeId!

        // 提取颜色偏好
        const accent = this.extractAccentFromRecipeId(recipeId)
        if (accent) {
          colorPreferences[accent] = (colorPreferences[accent] || 0) + 1
        }

        // 提取对比度偏好
        const tone = this.extractToneFromRecipeId(recipeId)
        if (tone) {
          contrastPreferences[tone] = (contrastPreferences[tone] || 0) + 1
        }

        // 提取复杂度偏好
        const motion = this.extractMotionFromRecipeId(recipeId)
        const complexity = this.inferComplexityFromMotion(motion)
        complexityPreferences[complexity] = (complexityPreferences[complexity] || 0) + 1
      })

    return {
      colorPreferences,
      contrastPreferences,
      complexityPreferences,
      emotionalTonePreferences
    }
  }

  private analyzeAccessibilityPatterns(events: UserBehaviorEvent[]) {
    let totalEvents = 0
    let highContrastEvents = 0
    let reducedMotionEvents = 0
    let cvdFriendlyEvents = 0

    events
      .filter(event => event.eventType === 'recipe_select' && event.data.recipeId)
      .forEach(event => {
        totalEvents++
        const recipeId = event.data.recipeId!

        if (recipeId.includes('hc')) {
          highContrastEvents++
        }

        if (this.extractMotionFromRecipeId(recipeId)?.includes('minimal')) {
          reducedMotionEvents++
        }

        // 假设某些配方更适合色盲用户
        if (this.isCVDFriendlyRecipe(recipeId)) {
          cvdFriendlyEvents++
        }
      })

    return {
      highContrastUsage: highContrastEvents / Math.max(totalEvents, 1),
      reducedMotionUsage: reducedMotionEvents / Math.max(totalEvents, 1),
      cvdFriendlyUsage: cvdFriendlyEvents / Math.max(totalEvents, 1),
      accessibilityFeatureUsage: (highContrastEvents + reducedMotionEvents + cvdFriendlyEvents) / Math.max(totalEvents * 3, 1)
    }
  }

  private generateUserInsights(events: UserBehaviorEvent[], sessions: UserSession[]) {
    // 识别用户画像
    const userPersona = this.identifyUserPersona(events, sessions)

    // 分析适应速度
    const adaptationSpeed = this.analyzeAdaptationSpeed(events)

    // 分析决策风格
    const decisionMakingStyle = this.analyzeDecisionMakingStyle(events, sessions)

    // 计算满意度指标
    const satisfactionIndicators = this.calculateSatisfactionIndicators(events, sessions)

    return {
      userPersona,
      adaptationSpeed,
      decisionMakingStyle,
      satisfactionIndicators
    }
  }

  private generateRecommendations(events: UserBehaviorEvent[], sessions: UserSession[]) {
    const analysis = this.analyzeBehaviorPatterns(events[0]?.userId || '')

    return {
      recipeRecommendations: analysis.patterns.preferential.favoriteRecipes.slice(0, 5).map(f => f.recipeId),
      featureRecommendations: this.generateFeatureRecommendations(analysis),
      improvementSuggestions: this.generateImprovementSuggestions(analysis)
    }
  }

  private updateRealTimeAnalysis(userId: string): void {
    // 清除缓存，强制重新计算
    this.realTimeCache.delete(userId)
  }

  private getRecentEvents(userId: string, count: number): UserBehaviorEvent[] {
    return this.behaviorEvents
      .filter(event => event.userId === userId)
      .slice(-count)
  }

  private calculateActiveTime(events: UserBehaviorEvent[]): number {
    if (events.length === 0) return 0

    const timeSpan = events[events.length - 1].timestamp.getTime() - events[0].timestamp.getTime()
    const estimatedActiveRatio = 0.3 // 假设用户30%的时间是活跃的

    return timeSpan * estimatedActiveRatio
  }

  private analyzeImmediateInsights(events: UserBehaviorEvent[]) {
    const engagementLevel = this.calculateEngagementLevel(events)
    const satisfactionSignals = this.detectSatisfactionSignals(events)
    const frustrationSignals = this.detectFrustrationSignals(events)
    const nextActionPrediction = this.predictNextAction(events)

    return {
      engagementLevel,
      satisfactionSignals,
      frustrationSignals,
      nextActionPrediction
    }
  }

  private generateContextualAdaptations(events: UserBehaviorEvent[], userId: string) {
    const userProfile = this.userProfiles.get(userId)
    const recentRecipeId = events
      .filter(e => e.data.recipeId)
      .slice(-1)[0]?.data.recipeId

    return {
      suggestedRecipes: this.suggestRecipesBasedOnContext(events, userProfile),
      uiAdjustments: this.suggestUIAdjustments(recentRecipeId, userProfile),
      featureHighlights: this.suggestFeatureHighlights(events)
    }
  }

  // ============================================================================
  // 辅助方法 (Helper Methods)
  // ============================================================================

  private extractModeFromRecipeId(recipeId: string): string {
    return recipeId.split('.')[0] || 'unknown'
  }

  private extractToneFromRecipeId(recipeId: string): string {
    const parts = recipeId.split('.')
    return parts[3] || 'unknown'
  }

  private extractAccentFromRecipeId(recipeId: string): string {
    const parts = recipeId.split('.')
    return parts[2] || 'unknown'
  }

  private extractMotionFromRecipeId(recipeId: string): string {
    const parts = recipeId.split('.')
    return parts[5] || 'unknown'
  }

  private inferComplexityFromMotion(motion: string): string {
    if (motion.includes('minimal')) return 'minimal'
    if (motion.includes('expressive')) return 'complex'
    return 'moderate'
  }

  private isCVDFriendlyRecipe(recipeId: string): boolean {
    // 简化判断：单色配色通常对色盲友好
    return recipeId.includes('mono(')
  }

  private calculateAxisPreferences(recipes: string[], axis: 'mode' | 'base' | 'accent' | 'tone' | 'density' | 'motion' | 'surface'): Record<string, number> {
    const preferences: Record<string, number> = {}

    recipes.forEach(recipeId => {
      const value = this.extractAxisFromRecipeId(recipeId, axis)
      if (value) {
        preferences[value] = (preferences[value] || 0) + 1
      }
    })

    return preferences
  }

  private extractAxisFromRecipeId(recipeId: string, axis: string): string {
    const parts = recipeId.split('.')
    const axisIndex = {
      mode: 0,
      base: 1,
      accent: 2,
      tone: 3,
      density: 4,
      motion: 5,
      surface: 6
    }[axis]

    return parts[axisIndex] || 'unknown'
  }

  private performBatchAnalysis(): void {
    // 批量分析活跃用户
    const activeUsers = Array.from(new Set(this.behaviorEvents.map(e => e.userId)))

    activeUsers.forEach(userId => {
      this.analyzeBehaviorPatterns(userId)
      this.updateUserPreferenceProfile(userId)
    })

    // 清理过期缓存
    this.cleanupExpiredCache()
  }

  private cleanupExpiredCache(): void {
    const now = Date.now()
    const maxAge = 24 * 60 * 60 * 1000 // 24小时

    for (const [key, analysis] of this.analysisCache) {
      if (now - analysis.analysisPeriod.end.getTime() > maxAge) {
        this.analysisCache.delete(key)
      }
    }
  }

  // 其他辅助方法的实现...
  private calculateAxisWeights(weights: Record<string, number>): Record<string, number> {
    const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0)
    const normalized: Record<string, number> = {}

    for (const [key, weight] of Object.entries(weights)) {
      normalized[key] = total > 0 ? weight / total : 1 / Object.keys(weights).length
    }

    return normalized
  }

  private calculateTimeOfDayUsage(peakHours: number[]): Record<string, number> {
    const usage: Record<string, number> = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0
    }

    peakHours.forEach(hour => {
      if (hour >= 6 && hour < 12) usage.morning++
      else if (hour >= 12 && hour < 18) usage.afternoon++
      else if (hour >= 18 && hour < 22) usage.evening++
      else usage.night++
    })

    return usage
  }

  private mapPersonaToInteractionStyle(persona: string): 'explorer' | 'focused' | 'minimalist' {
    const mapping: Record<string, 'explorer' | 'focused' | 'minimalist'> = {
      'minimalist': 'minimalist',
      'professional': 'focused',
      'creative': 'explorer',
      'explorer': 'explorer',
      'accessibility-focused': 'focused'
    }

    return mapping[persona] || 'focused'
  }

  private inferColorHarmony(colorPreferences: Record<string, number>): 'monochromatic' | 'analogous' | 'complementary' | 'triadic' {
    // 简化的推断逻辑
    const topColors = Object.entries(colorPreferences)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([color]) => color)

    if (topColors.length === 1) return 'monochromatic'
    if (topColors.length === 2) return 'complementary'
    return 'analogous'
  }

  private inferContrastLevel(contrastPreferences: Record<string, number>): 'subtle' | 'balanced' | 'bold' {
    const topContrast = Object.entries(contrastPreferences)
      .sort(([, a], [, b]) => b - a)[0]?.[0]

    switch (topContrast) {
      case 'calm': return 'subtle'
      case 'vivid': return 'bold'
      default: return 'balanced'
    }
  }

  private inferVisualComplexity(complexityPreferences: Record<string, number>): 'minimal' | 'moderate' | 'rich' {
    const topComplexity = Object.entries(complexityPreferences)
      .sort(([, a], [, b]) => b - a)[0]?.[0]

    switch (topComplexity) {
      case 'minimal': return 'minimal'
      case 'complex': return 'rich'
      default: return 'moderate'
    }
  }

  // 占位符方法，实际实现会更复杂
  private analyzeAxisPreference(recipes: string[], axis: string): Record<string, number> { return {} }
  private calculateRecipeSwitchFrequency(events: UserBehaviorEvent[]): number { return 0.5 }
  private calculateSearchComplexity(events: UserBehaviorEvent[]): number { return 0.5 }
  private calculateFilterUsage(events: UserBehaviorEvent[]): number { return 0.5 }
  private calculateCategoryExploration(events: UserBehaviorEvent[]): number { return 0.5 }
  private identifyUserPersona(events: UserBehaviorEvent[], sessions: UserSession[]): any { return 'professional' }
  private analyzeAdaptationSpeed(events: UserBehaviorEvent[]): any { return 'balanced' }
  private analyzeDecisionMakingStyle(events: UserBehaviorEvent[], sessions: UserSession[]): any { return 'deliberate' }
  private calculateSatisfactionIndicators(events: UserBehaviorEvent[], sessions: UserSession[]): any {
    return { recipeSelectionRate: 0.5, recipeRetentionRate: 0.5, sessionCompletionRate: 0.5, returnVisitRate: 0.5 }
  }
  private generateFeatureRecommendations(analysis: BehaviorPatternAnalysis): string[] { return [] }
  private generateImprovementSuggestions(analysis: BehaviorPatternAnalysis): string[] { return [] }
  private calculateEngagementLevel(events: UserBehaviorEvent[]): any { return 'medium' }
  private detectSatisfactionSignals(events: UserBehaviorEvent[]): string[] { return [] }
  private detectFrustrationSignals(events: UserBehaviorEvent[]): string[] { return [] }
  private predictNextAction(events: UserBehaviorEvent[]): any {
    return { likelyAction: 'recipe_view', confidence: 0.5, reasoning: 'Based on recent patterns' }
  }
  private suggestRecipesBasedOnContext(events: UserBehaviorEvent[], profile?: UserPreferenceProfile): string[] { return [] }
  private suggestUIAdjustments(recentRecipeId: string | undefined, profile?: UserPreferenceProfile): any {
    return { density: 'comfortable', motion: 'standard', contrast: 'standard' }
  }
  private suggestFeatureHighlights(events: UserBehaviorEvent[]): string[] { return [] }

  /**
   * 获取分析统计
   */
  public getAnalyticsStats() {
    return {
      totalEvents: this.behaviorEvents.length,
      totalSessions: Array.from(this.userSessions.values()).reduce((sum, sessions) => sum + sessions.length, 0),
      activeUsers: this.userSessions.size,
      cacheSize: this.analysisCache.size,
      realTimeCacheSize: this.realTimeCache.size
    }
  }

  /**
   * 清理所有数据
   */
  public clearAllData(): void {
    this.behaviorEvents = []
    this.userSessions.clear()
    this.userProfiles.clear()
    this.analysisCache.clear()
    this.realTimeCache.clear()
  }
}

// ============================================================================
// 单例实例 (Singleton Instance)
// ============================================================================

export const userBehaviorAnalyzer = new UserBehaviorAnalyzer()