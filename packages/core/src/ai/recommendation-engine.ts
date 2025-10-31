/**
 * 🤖 Xorigo UI AI配方推荐引擎
 *
 * 基于七轴主题系统的智能配方推荐和生成引擎
 * 支持用户行为分析、设计原则应用和个性化推荐
 */

import type { StyleRecipe, RecipeFilterOptions } from '@xorigo-ui/style-recipe'
// 临时导入 - TODO: 修复 @xorigo-ui/style-recipe 包的导出
import { unifiedRecipes } from '../temp-recipes'

// ============================================================================
// 核心类型定义 (Core Type Definitions)
// ============================================================================

/**
 * 用户偏好模型
 */
export interface UserPreferenceProfile {
  userId: string
  preferences: {
    // 七轴偏好权重 (0-1)
    modeWeights: Record<string, number>
    baseWeights: Record<string, number>
    accentWeights: Record<string, number>
    toneWeights: Record<string, number>
    densityWeights: Record<string, number>
    motionWeights: Record<string, number>
    surfaceWeights: Record<string, number>
  }
  // 行为模式
  behaviorPatterns: {
    timeOfDayUsage: Record<string, number> // 时段使用偏好
    contextUsage: Record<string, number>   // 场景使用偏好
    interactionStyle: 'explorer' | 'focused' | 'minimalist'
    adaptationSpeed: 'conservative' | 'balanced' | 'aggressive'
  }
  // 设计美学偏好
  aestheticPreferences: {
    colorHarmony: 'monochromatic' | 'analogous' | 'complementary' | 'triadic'
    contrastLevel: 'subtle' | 'balanced' | 'bold'
    visualComplexity: 'minimal' | 'moderate' | 'rich'
    emotionalTone: string[]
  }
  // 可访问性需求
  accessibilityNeeds: {
    highContrast: boolean
    reducedMotion: boolean
    cvdFriendly: boolean
  }
  lastUpdated: Date
}

/**
 * 配方相似度计算结果
 */
export interface RecipeSimilarityResult {
  recipe1: string
  recipe2: string
  overallSimilarity: number // 0-1
  axisSimilarities: {
    mode: number
    base: number
    accent: number
    tone: number
    density: number
    motion: number
    surface: number
  }
  semanticSimilarity: number
  aestheticSimilarity: number
}

/**
 * AI推荐结果
 */
export interface AIRecommendationResult {
  recommendations: RecommendedRecipe[]
  reasoning: {
    primary: string[]
    secondary: string[]
    confidence: number
  }
  personalizedScore: number
  performance: {
    inferenceTime: number
    cacheHit: boolean
  }
}

/**
 * 推荐配方
 */
export interface RecommendedRecipe {
  recipe: StyleRecipe
  score: number // 0-100
  confidence: number // 0-1
  reasoning: {
    userPreferenceMatch: number
    contextRelevance: number
    aestheticHarmony: number
    accessibilityScore: number
  }
  personalizedTags: string[]
}

/**
 * 配方生成参数
 */
export interface RecipeGenerationParams {
  // 基础参数
  keywords: string[]
  mood: string[]
  context: string

  // 约束条件
  constraints?: {
    mode?: string[]
    tone?: string[]
    density?: string[]
    accessibility?: string[]
  }

  // 优化目标
  optimizationGoals?: {
    aesthetic?: number
    accessibility?: number
    uniqueness?: number
    usability?: number
  }

  // 用户上下文
  userContext?: {
    timeOfDay: string
    deviceType: string
    environment: string
    taskType: string
  }
}

/**
 * 设计助手建议
 */
export interface DesignAssistantSuggestion {
  type: 'color' | 'typography' | 'layout' | 'accessibility' | 'motion'
  priority: 'critical' | 'important' | 'suggestion'
  title: string
  description: string
  action: {
    type: 'modify' | 'recommend' | 'replace'
    target: string
    newValue?: any
    alternatives?: StyleRecipe[]
  }
  reasoning: string
  confidence: number
}

// ============================================================================
// AI推荐引擎核心类 (AI Recommendation Engine Core Class)
// ============================================================================

/**
 * AI配方推荐引擎
 */
export class AIRecipeRecommendationEngine {
  private userProfiles: Map<string, UserPreferenceProfile>
  private recipeEmbeddings: Map<string, number[]>
  private similarityCache: Map<string, RecipeSimilarityResult[]>
  private performanceMetrics: {
    totalRecommendations: number
    averageResponseTime: number
    cacheHitRate: number
  }

  constructor() {
    this.userProfiles = new Map()
    this.recipeEmbeddings = new Map()
    this.similarityCache = new Map()
    this.performanceMetrics = {
      totalRecommendations: 0,
      averageResponseTime: 0,
      cacheHitRate: 0
    }

    this.initializeRecipeEmbeddings()
  }

  /**
   * 初始化配方嵌入向量
   */
  private async initializeRecipeEmbeddings(): Promise<void> {
    for (const recipe of unifiedRecipes) {
      const embedding = await this.generateRecipeEmbedding(recipe)
      this.recipeEmbeddings.set(recipe.id, embedding)
    }
  }

  /**
   * 生成配方嵌入向量
   */
  private async generateRecipeEmbedding(recipe: StyleRecipe): Promise<number[]> {
    // 基于七轴参数生成特征向量
    const features = [
      // Mode轴编码
      recipe.mode === 'light' ? 1 : 0,
      recipe.mode === 'dark' ? 1 : 0,
      recipe.mode === 'hc' ? 1 : 0,

      // Base轴编码 (简化版本)
      this.encodeBaseAxis(recipe.base),

      // Accent轴编码
      this.encodeAccentAxis(recipe.accent),

      // Tone轴编码
      recipe.tone === 'calm' ? 1 : 0,
      recipe.tone === 'standard' ? 1 : 0,
      recipe.tone === 'vivid' ? 1 : 0,

      // Density轴编码
      recipe.density === 'spacious' ? 1 : 0,
      recipe.density === 'comfortable' ? 1 : 0,
      recipe.density === 'compact' ? 1 : 0,

      // Motion轴编码
      this.encodeMotionAxis(recipe.motion),

      // Surface轴编码
      this.encodeSurfaceAxis(recipe.surface),

      // 语义特征
      this.encodeSemanticFeatures(recipe.tags, recipe.category),

      // 可访问性特征
      recipe.accessibility.contrastLevel === 'AAA' ? 1 : 0,
      recipe.accessibility.cvdFriendly ? 1 : 0,
      recipe.accessibility.motionSafe ? 1 : 0,
    ]

    return features
  }

  private encodeBaseAxis(base: string): number {
    // 简化的Base轴编码
    if (!base) return 0.5 // 如果base为undefined或null，返回neutral
    if (base.includes('warm')) return 0.33
    if (base.includes('cool')) return 0.67
    return 0.5 // neutral
  }

  private encodeAccentAxis(accent: string): number {
    // 简化的Accent轴编码
    if (accent.includes('mono')) return 0.25
    if (accent.includes('analog')) return 0.5
    if (accent.includes('duo')) return 0.75
    return 0.5
  }

  private encodeMotionAxis(motion: string): number {
    // 简化的Motion轴编码
    if (motion.includes('subtle')) return 0.33
    if (motion.includes('standard')) return 0.67
    if (motion.includes('expressive')) return 1.0
    return 0.5
  }

  private encodeSurfaceAxis(surface: string): number {
    // 简化的Surface轴编码
    if (surface.includes('flat')) return 0.2
    if (surface.includes('soft-shadow')) return 0.4
    if (surface.includes('elevated')) return 0.6
    if (surface.includes('glass')) return 0.8
    if (surface.includes('neon')) return 1.0
    return 0.5
  }

  private encodeSemanticFeatures(tags: string[], category: string): number {
    // 简化的语义特征编码
    const semanticMap: Record<string, number> = {
      '科技': 0.8,
      '现代': 0.7,
      '自然': 0.3,
      '温暖': 0.2,
      '神秘': 0.6,
      '极简': 0.1,
      '活力': 0.9,
      '浪漫': 0.4,
      '优雅': 0.5,
      '创意': 0.85
    }

    let score = 0
    for (const tag of tags) {
      score += semanticMap[tag] || 0.5
    }
    return score / Math.max(tags.length, 1)
  }

  /**
   * 计算配方相似度
   */
  public calculateRecipeSimilarity(recipe1Id: string, recipe2Id: string): RecipeSimilarityResult {
    const cacheKey = `${recipe1Id}-${recipe2Id}`
    if (this.similarityCache.has(cacheKey)) {
      return this.similarityCache.get(cacheKey)!
    }

    const recipe1 = unifiedRecipes.find(r => r.id === recipe1Id)
    const recipe2 = unifiedRecipes.find(r => r.id === recipe2Id)

    if (!recipe1 || !recipe2) {
      throw new Error(`Recipe not found: ${recipe1Id} or ${recipe2Id}`)
    }

    const embedding1 = this.recipeEmbeddings.get(recipe1Id)!
    const embedding2 = this.recipeEmbeddings.get(recipe2Id)!

    // 计算余弦相似度
    const dotProduct = embedding1.reduce((sum, val, idx) => sum + val * embedding2[idx], 0)
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0))
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0))
    const overallSimilarity = dotProduct / (magnitude1 * magnitude2)

    // 计算各轴相似度
    const axisSimilarities = {
      mode: recipe1.mode === recipe2.mode ? 1 : 0,
      base: 1 - Math.abs(this.encodeBaseAxis(recipe1.base) - this.encodeBaseAxis(recipe2.base)),
      accent: 1 - Math.abs(this.encodeAccentAxis(recipe1.accent) - this.encodeAccentAxis(recipe2.accent)),
      tone: recipe1.tone === recipe2.tone ? 1 : 0,
      density: recipe1.density === recipe2.density ? 1 : 0,
      motion: 1 - Math.abs(this.encodeMotionAxis(recipe1.motion) - this.encodeMotionAxis(recipe2.motion)),
      surface: 1 - Math.abs(this.encodeSurfaceAxis(recipe1.surface) - this.encodeSurfaceAxis(recipe2.surface)),
    }

    // 计算语义相似度
    const semanticSimilarity = this.calculateSemanticSimilarity(recipe1, recipe2)

    // 计算美学相似度
    const aestheticSimilarity = this.calculateAestheticSimilarity(recipe1, recipe2)

    const result: RecipeSimilarityResult = {
      recipe1: recipe1Id,
      recipe2: recipe2Id,
      overallSimilarity: Math.max(0, Math.min(1, overallSimilarity)),
      axisSimilarities,
      semanticSimilarity,
      aestheticSimilarity
    }

    this.similarityCache.set(cacheKey, result)
    return result
  }

  private calculateSemanticSimilarity(recipe1: StyleRecipe, recipe2: StyleRecipe): number {
    const tags1 = new Set(recipe1.tags)
    const tags2 = new Set(recipe2.tags)
    const intersection = new Set([...tags1].filter(tag => tags2.has(tag)))
    const union = new Set([...tags1, ...tags2])
    return intersection.size / union.size
  }

  private calculateAestheticSimilarity(recipe1: StyleRecipe, recipe2: StyleRecipe): number {
    // 基于七轴参数计算美学相似度
    const factors = [
      recipe1.tone === recipe2.tone ? 1 : 0.5,
      recipe1.density === recipe2.density ? 1 : 0.7,
      recipe1.surface === recipe2.surface ? 1 : 0.6,
      recipe1.accessibility.contrastLevel === recipe2.accessibility.contrastLevel ? 1 : 0.8,
    ]
    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length
  }

  /**
   * 生成个性化推荐
   */
  public async generateRecommendations(
    userId: string,
    context?: {
      timeOfDay?: string
      deviceType?: string
      taskType?: string
      numberOfRecommendations?: number
    }
  ): Promise<AIRecommendationResult> {
    const startTime = performance.now()

    const userProfile = this.getUserProfile(userId)
    const numberOfRecommendations = context?.numberOfRecommendations || 5

    // 计算所有配方的推荐分数
    const scoredRecipes = await Promise.all(
      unifiedRecipes.map(async (recipe) => {
        const score = await this.calculateRecommendationScore(recipe, userProfile, context)
        return { recipe, score }
      })
    )

    // 按分数排序并选择前N个
    const topRecipes = scoredRecipes
      .sort((a, b) => b.score - a.score)
      .slice(0, numberOfRecommendations)

    // 生成推荐结果
    const recommendations: RecommendedRecipe[] = topRecipes.map(({ recipe, score }) => ({
      recipe,
      score,
      confidence: Math.min(1, score / 100),
      reasoning: {
        userPreferenceMatch: this.calculateUserPreferenceMatch(recipe, userProfile),
        contextRelevance: this.calculateContextRelevance(recipe, context),
        aestheticHarmony: this.calculateAestheticHarmony(recipe, userProfile),
        accessibilityScore: this.calculateAccessibilityScore(recipe, userProfile)
      },
      personalizedTags: this.generatePersonalizedTags(recipe, userProfile)
    }))

    const endTime = performance.now()
    const inferenceTime = endTime - startTime

    // 更新性能指标
    this.updatePerformanceMetrics(inferenceTime)

    return {
      recommendations,
      reasoning: {
        primary: [
          `基于您的偏好选择了${recommendations[0]?.recipe.name || '推荐配方'}`,
          '考虑了当前使用时间和设备类型',
          '优化了可访问性和用户体验'
        ],
        secondary: [
          '匹配您的审美偏好',
          '符合使用场景需求'
        ],
        confidence: recommendations[0]?.confidence || 0
      },
      personalizedScore: recommendations.reduce((sum, rec) => sum + rec.score, 0) / recommendations.length,
      performance: {
        inferenceTime,
        cacheHit: this.similarityCache.size > 0
      }
    }
  }

  private async calculateRecommendationScore(
    recipe: StyleRecipe,
    userProfile: UserPreferenceProfile,
    context?: any
  ): Promise<number> {
    const factors = {
      userPreference: this.calculateUserPreferenceMatch(recipe, userProfile) * 0.4,
      contextRelevance: this.calculateContextRelevance(recipe, context) * 0.25,
      aestheticHarmony: this.calculateAestheticHarmony(recipe, userProfile) * 0.2,
      accessibilityScore: this.calculateAccessibilityScore(recipe, userProfile) * 0.15,
    }

    return Object.values(factors).reduce((sum, factor) => sum + factor, 0) * 100
  }

  private calculateUserPreferenceMatch(recipe: StyleRecipe, userProfile: UserPreferenceProfile): number {
    // 计算七轴偏好匹配度
    const modeScore = userProfile.preferences.modeWeights[recipe.mode] || 0.5
    const toneScore = userProfile.preferences.toneWeights[recipe.tone] || 0.5
    const densityScore = userProfile.preferences.densityWeights[recipe.density] || 0.5
    const surfaceScore = userProfile.preferences.surfaceWeights[recipe.surface] || 0.5

    return (modeScore + toneScore + densityScore + surfaceScore) / 4
  }

  private calculateContextRelevance(recipe: StyleRecipe, context?: any): number {
    if (!context) return 0.5

    let score = 0.5

    // 时间相关性
    if (context.timeOfDay) {
      if (context.timeOfDay === 'morning' && recipe.mode === 'light') score += 0.2
      if (context.timeOfDay === 'evening' && recipe.mode === 'dark') score += 0.2
      if (context.timeOfDay === 'night' && recipe.mode === 'dark') score += 0.3
    }

    // 设备类型相关性
    if (context.deviceType) {
      if (context.deviceType === 'mobile' && recipe.density === 'compact') score += 0.2
      if (context.deviceType === 'desktop' && recipe.density === 'spacious') score += 0.2
    }

    // 任务类型相关性
    if (context.taskType) {
      if (context.taskType === 'work' && recipe.tone === 'standard') score += 0.2
      if (context.taskType === 'creative' && recipe.tone === 'vivid') score += 0.2
      if (context.taskType === 'reading' && recipe.accessibility.contrastLevel === 'AAA') score += 0.2
    }

    return Math.min(1, score)
  }

  private calculateAestheticHarmony(recipe: StyleRecipe, userProfile: UserPreferenceProfile): number {
    const aestheticPrefs = userProfile.aestheticPreferences

    let score = 0.5

    // 色彩和谐度匹配
    if (recipe.accent.includes('mono') && aestheticPrefs.colorHarmony === 'monochromatic') score += 0.3
    if (recipe.accent.includes('analog') && aestheticPrefs.colorHarmony === 'analogous') score += 0.3
    if (recipe.accent.includes('duo') && aestheticPrefs.colorHarmony === 'complementary') score += 0.3

    // 对比度匹配
    if (recipe.tone === 'calm' && aestheticPrefs.contrastLevel === 'subtle') score += 0.2
    if (recipe.tone === 'standard' && aestheticPrefs.contrastLevel === 'balanced') score += 0.2
    if (recipe.tone === 'vivid' && aestheticPrefs.contrastLevel === 'bold') score += 0.2

    // 复杂度匹配
    if (recipe.motion.includes('minimal') && aestheticPrefs.visualComplexity === 'minimal') score += 0.2
    if (recipe.motion.includes('expressive') && aestheticPrefs.visualComplexity === 'rich') score += 0.2

    return Math.min(1, score)
  }

  private calculateAccessibilityScore(recipe: StyleRecipe, userProfile: UserPreferenceProfile): number {
    const needs = userProfile.accessibilityNeeds
    let score = 0.5

    if (needs.highContrast && recipe.accessibility.contrastLevel === 'AAA') score += 0.3
    if (needs.reducedMotion && recipe.accessibility.motionSafe) score += 0.3
    if (needs.cvdFriendly && recipe.accessibility.cvdFriendly) score += 0.2

    return Math.min(1, score)
  }

  private generatePersonalizedTags(recipe: StyleRecipe, userProfile: UserPreferenceProfile): string[] {
    const tags = [...recipe.tags]

    // 基于用户偏好添加个性化标签
    if (userProfile.behaviorPatterns.interactionStyle === 'minimalist' && recipe.tone === 'calm') {
      tags.push('极简主义')
    }
    if (userProfile.behaviorPatterns.interactionStyle === 'explorer' && recipe.tone === 'vivid') {
      tags.push('创意探索')
    }

    return tags
  }

  private getUserProfile(userId: string): UserPreferenceProfile {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, this.createDefaultUserProfile(userId))
    }
    return this.userProfiles.get(userId)!
  }

  private createDefaultUserProfile(userId: string): UserPreferenceProfile {
    return {
      userId,
      preferences: {
        modeWeights: { light: 0.6, dark: 0.4, hc: 0.0 },
        baseWeights: { 'neutral-warm': 0.3, 'neutral-cool': 0.4, 'neutral-true': 0.3 },
        accentWeights: { mono: 0.3, analog: 0.4, duo: 0.3 },
        toneWeights: { calm: 0.3, standard: 0.5, vivid: 0.2 },
        densityWeights: { spacious: 0.2, comfortable: 0.6, compact: 0.2 },
        motionWeights: { subtle: 0.3, standard: 0.5, expressive: 0.2 },
        surfaceWeights: { flat: 0.2, 'soft-shadow': 0.4, elevated: 0.2, glass: 0.2 }
      },
      behaviorPatterns: {
        timeOfDayUsage: { morning: 0.3, afternoon: 0.4, evening: 0.3, night: 0.0 },
        contextUsage: { work: 0.6, personal: 0.3, creative: 0.1 },
        interactionStyle: 'balanced',
        adaptationSpeed: 'balanced'
      },
      aestheticPreferences: {
        colorHarmony: 'analogous',
        contrastLevel: 'balanced',
        visualComplexity: 'moderate',
        emotionalTone: ['专业', '现代']
      },
      accessibilityNeeds: {
        highContrast: false,
        reducedMotion: false,
        cvdFriendly: true
      },
      lastUpdated: new Date()
    }
  }

  private updatePerformanceMetrics(inferenceTime: number): void {
    this.performanceMetrics.totalRecommendations++
    const alpha = 0.1 // 指数移动平均的平滑因子
    this.performanceMetrics.averageResponseTime =
      alpha * inferenceTime + (1 - alpha) * this.performanceMetrics.averageResponseTime
  }

  /**
   * 获取性能指标
   */
  public getPerformanceMetrics() {
    return { ...this.performanceMetrics }
  }

  /**
   * 清理缓存
   */
  public clearCache(): void {
    this.similarityCache.clear()
  }
}

// ============================================================================
// 单例实例 (Singleton Instance)
// ============================================================================

export const aiRecommendationEngine = new AIRecipeRecommendationEngine()