/**
 * 🧪 AI系统测试套件
 *
 * 测试AI推荐引擎、配方生成器、用户行为分析器和设计助手的功能
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { StyleRecipe } from '@xorigo-ui/style-recipe'
import {
  AIRecipeRecommendationEngine,
  AIRecipeGenerator,
  UserBehaviorAnalyzer,
  AIDesignAssistant,
  AISystemManager,
  aiSystem
} from '../index'

// ============================================================================
// 测试数据 (Test Data)
// ============================================================================

const mockRecipe: StyleRecipe = {
  id: 'light.neutral-true-mid.mono(blue).standard.comfortable.standard.soft-shadow',
  name: '测试配方',
  description: '用于测试的配方',
  category: 'test',
  mode: 'light',
  base: 'neutral-true-mid',
  accent: 'mono(blue)',
  tone: 'standard',
  density: 'comfortable',
  motion: 'standard.spring',
  surface: 'soft-shadow',
  tags: ['测试', '蓝色'],
  accessibility: {
    contrastLevel: 'AA',
    cvdFriendly: true,
    motionSafe: true
  }
}

const testUserId = 'test-user-123'
const testContext = {
  timeOfDay: 'morning',
  deviceType: 'desktop',
  taskType: 'work'
}

// ============================================================================
// AI推荐引擎测试 (AI Recommendation Engine Tests)
// ============================================================================

describe('AIRecipeRecommendationEngine', () => {
  let engine: AIRecipeRecommendationEngine

  beforeEach(() => {
    engine = new AIRecipeRecommendationEngine()
  })

  afterEach(() => {
    engine.clearCache()
  })

  it('应该能够初始化推荐引擎', () => {
    expect(engine).toBeDefined()
    expect(engine.getPerformanceMetrics()).toBeDefined()
  })

  it('应该能够计算配方相似度', () => {
    const similarity = engine.calculateRecipeSimilarity(
      mockRecipe.id,
      'dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass'
    )

    expect(similarity).toBeDefined()
    expect(similarity.overallSimilarity).toBeGreaterThanOrEqual(0)
    expect(similarity.overallSimilarity).toBeLessThanOrEqual(1)
    expect(similarity.axisSimilarities).toBeDefined()
    expect(similarity.semanticSimilarity).toBeDefined()
    expect(similarity.aestheticSimilarity).toBeDefined()
  })

  it('应该能够生成个性化推荐', async () => {
    const result = await engine.generateRecommendations(testUserId, testContext)

    expect(result).toBeDefined()
    expect(result.recommendations).toBeDefined()
    expect(Array.isArray(result.recommendations)).toBe(true)
    expect(result.reasoning).toBeDefined()
    expect(result.personalizedScore).toBeGreaterThanOrEqual(0)
    expect(result.personalizedScore).toBeLessThanOrEqual(100)
    expect(result.performance).toBeDefined()
    expect(result.performance.inferenceTime).toBeGreaterThanOrEqual(0)
  }, 10000)

  it('推荐结果应该包含有效的配方信息', async () => {
    const result = await engine.generateRecommendations(testUserId, testContext)

    if (result.recommendations.length > 0) {
      const recommendation = result.recommendations[0]
      expect(recommendation.recipe).toBeDefined()
      expect(recommendation.score).toBeGreaterThanOrEqual(0)
      expect(recommendation.score).toBeLessThanOrEqual(100)
      expect(recommendation.confidence).toBeGreaterThanOrEqual(0)
      expect(recommendation.confidence).toBeLessThanOrEqual(1)
      expect(recommendation.reasoning).toBeDefined()
      expect(recommendation.personalizedTags).toBeDefined()
    }
  }, 10000)

  it('应该能够处理性能指标', () => {
    const metrics = engine.getPerformanceMetrics()
    expect(metrics).toBeDefined()
    expect(metrics.totalRecommendations).toBeGreaterThanOrEqual(0)
    expect(metrics.averageResponseTime).toBeGreaterThanOrEqual(0)
    expect(metrics.cacheHitRate).toBeGreaterThanOrEqual(0)
    expect(metrics.cacheHitRate).toBeLessThanOrEqual(1)
  })
})

// ============================================================================
// 配方生成器测试 (Recipe Generator Tests)
// ============================================================================

describe('AIRecipeGenerator', () => {
  let generator: AIRecipeGenerator

  beforeEach(() => {
    generator = new AIRecipeGenerator()
  })

  afterEach(() => {
    generator.clearCache()
  })

  it('应该能够初始化配方生成器', () => {
    expect(generator).toBeDefined()
    expect(generator.getGenerationStats()).toBeDefined()
  })

  it('应该能够基于关键词生成配方', async () => {
    const params = {
      keywords: ['温暖', '专业'],
      mood: ['舒适', '现代'],
      context: '办公环境',
      constraints: {
        mode: ['light'],
        tone: ['standard']
      },
      optimizationGoals: {
        aesthetic: 0.8,
        accessibility: 0.9,
        uniqueness: 0.6,
        usability: 0.8
      }
    }

    const result = await generator.generateRecipes(params, testUserId)

    expect(result).toBeDefined()
    expect(result.recipes).toBeDefined()
    expect(Array.isArray(result.recipes)).toBe(true)
    expect(result.reasoning).toBeDefined()
    expect(result.confidence).toBeGreaterThanOrEqual(0)
    expect(result.confidence).toBeLessThanOrEqual(1)
    expect(result.optimization).toBeDefined()
    expect(result.warnings).toBeDefined()
  }, 15000)

  it('生成的配方应该具有有效的结构', async () => {
    const params = {
      keywords: ['现代', '简洁'],
      mood: ['专业'],
      context: '工作环境'
    }

    const result = await generator.generateRecipes(params, testUserId)

    if (result.recipes.length > 0) {
      const generatedRecipe = result.recipes[0]
      expect(generatedRecipe.recipe).toBeDefined()
      expect(generatedRecipe.recipe.id).toBeDefined()
      expect(generatedRecipe.recipe.name).toBeDefined()
      expect(generatedRecipe.recipe.mode).toBeDefined()
      expect(generatedRecipe.recipe.base).toBeDefined()
      expect(generatedRecipe.recipe.accent).toBeDefined()
      expect(generatedRecipe.recipe.tone).toBeDefined()
      expect(generatedRecipe.recipe.density).toBeDefined()
      expect(generatedRecipe.recipe.motion).toBeDefined()
      expect(generatedRecipe.recipe.surface).toBeDefined()
      expect(generatedRecipe.generationMethod).toBeDefined()
      expect(generatedRecipe.confidence).toBeGreaterThanOrEqual(0)
      expect(generatedRecipe.validation).toBeDefined()
    }
  }, 15000)

  it('应该能够处理约束条件', async () => {
    const params = {
      keywords: ['创意', '活力'],
      mood: ['动感'],
      context: '创意工作',
      constraints: {
        mode: ['dark'],
        tone: ['vivid'],
        accessibility: ['high-contrast']
      }
    }

    const result = await generator.generateRecipes(params, testUserId)

    if (result.recipes.length > 0) {
      const recipes = result.recipes.map(r => r.recipe)

      // 检查约束是否被遵守
      recipes.forEach(recipe => {
        if (params.constraints?.mode) {
          expect(params.constraints.mode).toContain(recipe.mode)
        }
        if (params.constraints?.tone) {
          expect(params.constraints.tone).toContain(recipe.tone)
        }
      })
    }
  }, 15000)

  it('应该能够处理生成统计', () => {
    const stats = generator.getGenerationStats()
    expect(stats).toBeDefined()
    expect(stats.cacheSize).toBeGreaterThanOrEqual(0)
    expect(stats.principlesCount).toBeGreaterThan(0)
    expect(stats.colorHarmoniesCount).toBeGreaterThan(0)
  })
})

// ============================================================================
// 用户行为分析器测试 (User Behavior Analyzer Tests)
// ============================================================================

describe('UserBehaviorAnalyzer', () => {
  let analyzer: UserBehaviorAnalyzer

  beforeEach(() => {
    analyzer = new UserBehaviorAnalyzer()
  })

  afterEach(() => {
    analyzer.clearAllData()
  })

  it('应该能够初始化用户行为分析器', () => {
    expect(analyzer).toBeDefined()
    expect(analyzer.getAnalyticsStats()).toBeDefined()
  })

  it('应该能够记录用户行为事件', () => {
    const event = {
      userId: testUserId,
      eventType: 'recipe_view' as const,
      sessionId: 'test-session-123',
      data: {
        recipeId: mockRecipe.id,
        context: testContext
      }
    }

    expect(() => analyzer.recordEvent(event)).not.toThrow()

    const stats = analyzer.getAnalyticsStats()
    expect(stats.totalEvents).toBe(1)
  })

  it('应该能够分析用户行为模式', () => {
    // 记录一些测试事件
    const events = [
      {
        userId: testUserId,
        eventType: 'recipe_view' as const,
        sessionId: 'test-session-123',
        data: { recipeId: mockRecipe.id }
      },
      {
        userId: testUserId,
        eventType: 'recipe_select' as const,
        sessionId: 'test-session-123',
        data: { recipeId: mockRecipe.id }
      },
      {
        userId: testUserId,
        eventType: 'recipe_switch' as const,
        sessionId: 'test-session-123',
        data: { recipeId: mockRecipe.id }
      }
    ]

    events.forEach(event => analyzer.recordEvent(event))

    const analysis = analyzer.analyzeBehaviorPatterns(testUserId)

    expect(analysis).toBeDefined()
    expect(analysis.userId).toBe(testUserId)
    expect(analysis.patterns).toBeDefined()
    expect(analysis.insights).toBeDefined()
    expect(analysis.recommendations).toBeDefined()
  })

  it('应该能够获取实时行为分析', () => {
    // 记录一些事件
    analyzer.recordEvent({
      userId: testUserId,
      eventType: 'recipe_view',
      sessionId: 'test-session-123',
      data: { recipeId: mockRecipe.id }
    })

    const realTimeAnalysis = analyzer.getRealTimeAnalysis(testUserId)

    expect(realTimeAnalysis).toBeDefined()
    expect(realTimeAnalysis.userId).toBe(testUserId)
    expect(realTimeAnalysis.currentSession).toBeDefined()
    expect(realTimeAnalysis.immediateInsights).toBeDefined()
    expect(realTimeAnalysis.contextualAdaptations).toBeDefined()
  })

  it('应该能够更新用户偏好模型', () => {
    // 记录一些事件
    analyzer.recordEvent({
      userId: testUserId,
      eventType: 'recipe_select',
      sessionId: 'test-session-123',
      data: { recipeId: mockRecipe.id }
    })

    const profile = analyzer.updateUserPreferenceProfile(testUserId)

    expect(profile).toBeDefined()
    expect(profile.userId).toBe(testUserId)
    expect(profile.preferences).toBeDefined()
    expect(profile.behaviorPatterns).toBeDefined()
    expect(profile.aestheticPreferences).toBeDefined()
    expect(profile.accessibilityNeeds).toBeDefined()
    expect(profile.lastUpdated).toBeInstanceOf(Date)
  })

  it('应该能够处理分析统计', () => {
    analyzer.recordEvent({
      userId: testUserId,
      eventType: 'recipe_view',
      sessionId: 'test-session-123',
      data: { recipeId: mockRecipe.id }
    })

    const stats = analyzer.getAnalyticsStats()
    expect(stats).toBeDefined()
    expect(stats.totalEvents).toBe(1)
    expect(stats.totalSessions).toBeGreaterThanOrEqual(0)
    expect(stats.activeUsers).toBeGreaterThanOrEqual(0)
  })
})

// ============================================================================
// 设计助手测试 (Design Assistant Tests)
// ============================================================================

describe('AIDesignAssistant', () => {
  let assistant: AIDesignAssistant

  beforeEach(() => {
    assistant = new AIDesignAssistant()
  })

  it('应该能够初始化设计助手', () => {
    expect(assistant).toBeDefined()
  })

  it('应该能够进行全面设计评估', async () => {
    const result = await assistant.assessDesign(mockRecipe, testContext)

    expect(result).toBeDefined()
    expect(result.overallScore).toBeGreaterThanOrEqual(0)
    expect(result.overallScore).toBeLessThanOrEqual(100)
    expect(result.categories).toBeDefined()
    expect(result.categories.accessibility).toBeDefined()
    expect(result.categories.aesthetics).toBeDefined()
    expect(result.categories.usability).toBeDefined()
    expect(result.categories.performance).toBeDefined()
    expect(result.suggestions).toBeDefined()
    expect(Array.isArray(result.suggestions)).toBe(true)
    expect(result.quickWins).toBeDefined()
    expect(result.criticalIssues).toBeDefined()
    expect(result.recommendations).toBeDefined()
  }, 20000)

  it('应该能够生成设计建议', async () => {
    const suggestions = await assistant.generateSuggestions(mockRecipe, testUserId)

    expect(suggestions).toBeDefined()
    expect(Array.isArray(suggestions)).toBe(true)

    if (suggestions.length > 0) {
      const suggestion = suggestions[0]
      expect(suggestion.type).toBeDefined()
      expect(suggestion.priority).toBeDefined()
      expect(suggestion.title).toBeDefined()
      expect(suggestion.description).toBeDefined()
      expect(suggestion.action).toBeDefined()
      expect(suggestion.reasoning).toBeDefined()
      expect(suggestion.confidence).toBeGreaterThanOrEqual(0)
      expect(suggestion.confidence).toBeLessThanOrEqual(1)
    }
  }, 15000)

  it('应该能够分析配色和谐度', () => {
    const analysis = assistant.analyzeColorHarmony(mockRecipe)

    expect(analysis).toBeDefined()
    expect(analysis.overallScore).toBeGreaterThanOrEqual(0)
    expect(analysis.overallScore).toBeLessThanOrEqual(100)
    expect(analysis.harmonyType).toBeDefined()
    expect(analysis.colorRelationships).toBeDefined()
    expect(Array.isArray(analysis.colorRelationships)).toBe(true)
    expect(analysis.emotionalImpact).toBeDefined()
    expect(analysis.improvements).toBeDefined()
  })

  it('应该能够分析视觉层次', () => {
    const analysis = assistant.analyzeVisualHierarchy(mockRecipe)

    expect(analysis).toBeDefined()
    expect(analysis.overallScore).toBeGreaterThanOrEqual(0)
    expect(analysis.overallScore).toBeLessThanOrEqual(100)
    expect(analysis.hierarchy).toBeDefined()
    expect(analysis.contrastRatios).toBeDefined()
    expect(analysis.spacing).toBeDefined()
    expect(analysis.suggestions).toBeDefined()
  })
})

// ============================================================================
// AI系统管理器测试 (AI System Manager Tests)
// ============================================================================

describe('AISystemManager', () => {
  let system: AISystemManager

  beforeEach(() => {
    system = new AISystemManager({
      recommendation: {
        maxRecommendations: 3,
        cacheEnabled: true,
        realTimeUpdates: true
      },
      performance: {
        enableCaching: true,
        maxCacheSize: 100,
        cacheTimeout: 60000
      }
    })
  })

  afterEach(() => {
    system.shutdown()
  })

  it('应该能够初始化AI系统', () => {
    expect(system).toBeDefined()

    const status = system.getSystemStatus()
    expect(status).toBeDefined()
    expect(status.modules).toBeDefined()
  }, 10000)

  it('应该能够获取推荐', async () => {
    const result = await system.getRecommendations(testUserId, testContext)

    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(result.performance).toBeDefined()
    expect(result.performance.processingTime).toBeGreaterThanOrEqual(0)
  }, 15000)

  it('应该能够生成配方', async () => {
    const params = {
      keywords: ['现代', '专业'],
      mood: ['舒适'],
      context: '工作环境'
    }

    const result = await system.generateRecipes(params, testUserId)

    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(result.performance).toBeDefined()
  }, 20000)

  it('应该能够获取设计建议', async () => {
    const result = await system.getDesignSuggestions(mockRecipe, testUserId)

    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(Array.isArray(result.data)).toBe(true)
  }, 15000)

  it('应该能够进行全面设计评估', async () => {
    const result = await system.assessDesign(mockRecipe, testUserId, testContext)

    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(result.data.overallScore).toBeGreaterThanOrEqual(0)
  }, 20000)

  it('应该能够记录用户事件', () => {
    const result = system.recordUserEvent(testUserId, 'recipe_view', {
      recipeId: mockRecipe.id,
      context: testContext
    })

    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.performance).toBeDefined()
  })

  it('应该能够获取用户行为分析', () => {
    const result = system.getUserBehaviorAnalysis(testUserId)

    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
  })

  it('应该能够更新用户偏好', () => {
    const result = system.updateUserPreferences(testUserId)

    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
  })

  it('应该能够获取系统状态', () => {
    const status = system.getSystemStatus()

    expect(status).toBeDefined()
    expect(status.isInitialized).toBe(true)
    expect(status.isActive).toBe(true)
    expect(status.performance).toBeDefined()
    expect(status.modules).toBeDefined()
    expect(status.statistics).toBeDefined()
  })

  it('应该能够清理缓存', () => {
    expect(() => system.clearCache()).not.toThrow()
  })

  it('应该能够更新配置', () => {
    expect(() => system.updateConfig({
      recommendation: { maxRecommendations: 10 }
    })).not.toThrow()
  })
})

// ============================================================================
// 集成测试 (Integration Tests)
// ============================================================================

describe('AI系统集成测试', () => {
  let system: AISystemManager

  beforeEach(() => {
    system = new AISystemManager()
  })

  afterEach(() => {
    system.shutdown()
  })

  it('应该能够处理完整的用户工作流', async () => {
    const userId = 'integration-test-user'

    // 1. 记录用户访问
    system.recordUserEvent(userId, 'page_visit', { page: 'recipes' })

    // 2. 获取推荐
    const recommendations = await system.getRecommendations(userId, {
      timeOfDay: 'morning',
      deviceType: 'desktop',
      taskType: 'work'
    })

    expect(recommendations.success).toBe(true)
    expect(recommendations.data?.recommendations.length).toBeGreaterThan(0)

    // 3. 选择推荐
    if (recommendations.data && recommendations.data.recommendations.length > 0) {
      const selectedRecipe = recommendations.data.recommendations[0].recipe

      // 4. 记录选择行为
      system.recordUserEvent(userId, 'recipe_select', {
        recipeId: selectedRecipe.id
      })

      // 5. 获取设计建议
      const suggestions = await system.getDesignSuggestions(selectedRecipe, userId)
      expect(suggestions.success).toBe(true)

      // 6. 进行设计评估
      const assessment = await system.assessDesign(selectedRecipe, userId)
      expect(assessment.success).toBe(true)

      // 7. 更新用户偏好
      const preferences = system.updateUserPreferences(userId)
      expect(preferences.success).toBe(true)

      // 8. 获取行为分析
      const analysis = system.getUserBehaviorAnalysis(userId)
      expect(analysis.success).toBe(true)
    }
  }, 30000)

  it('应该能够处理配方生成和应用流程', async () => {
    const userId = 'generator-test-user'

    // 1. 生成配方
    const generationParams = {
      keywords: ['现代', '专业', '简洁'],
      mood: ['舒适', '高效'],
      context: '办公环境'
    }

    const generationResult = await system.generateRecipes(generationParams, userId)
    expect(generationResult.success).toBe(true)
    expect(generationResult.data?.recipes.length).toBeGreaterThan(0)

    // 2. 选择生成的配方
    if (generationResult.data && generationResult.data.recipes.length > 0) {
      const generatedRecipe = generationResult.data.recipes[0].recipe

      // 3. 获取设计建议
      const suggestions = await system.getDesignSuggestions(generatedRecipe, userId)
      expect(suggestions.success).toBe(true)

      // 4. 评估生成的配方
      const assessment = await system.assessDesign(generatedRecipe, userId)
      expect(assessment.success).toBe(true)
      expect(assessment.data?.overallScore).toBeGreaterThanOrEqual(0)

      // 5. 记录生成和选择行为
      system.recordUserEvent(userId, 'recipe_generate_success', {
        keywords: generationParams.keywords,
        selectedRecipeId: generatedRecipe.id,
        confidence: generationResult.data?.confidence
      })
    }
  }, 30000)

  it('应该能够处理错误情况', async () => {
    // 测试无效的用户ID
    const invalidUserResult = await system.getRecommendations('', {})
    expect(invalidUserResult.success).toBe(false)
    expect(invalidUserResult.error).toBeDefined()

    // 测试无效的配方生成参数
    const invalidGenerationResult = await system.generateRecipes({
      keywords: [], // 空关键词
      mood: [],
      context: ''
    })
    expect(invalidGenerationResult.success).toBe(true) // 生成器应该能处理空参数

    // 测试无效配方的设计建议
    const invalidRecipe = { ...mockRecipe, id: '' }
    const invalidSuggestionResult = await system.getDesignSuggestions(invalidRecipe)
    expect(invalidSuggestionResult.success).toBe(true) // 应该能处理无效配方
  }, 15000)
})

// ============================================================================
// 性能测试 (Performance Tests)
// ============================================================================

describe('AI系统性能测试', () => {
  let system: AISystemManager

  beforeEach(() => {
    system = new AISystemManager({
      performance: {
        enableCaching: true,
        maxCacheSize: 1000,
        cacheTimeout: 60000
      }
    })
  })

  afterEach(() => {
    system.shutdown()
  })

  it('推荐响应时间应该少于100ms', async () => {
    const startTime = performance.now()
    const result = await system.getRecommendations('perf-test-user', testContext)
    const endTime = performance.now()

    expect(result.success).toBe(true)
    expect(endTime - startTime).toBeLessThan(100)
  })

  it('配方生成时间应该少于500ms', async () => {
    const params = {
      keywords: ['现代', '专业'],
      mood: ['舒适'],
      context: '工作环境'
    }

    const startTime = performance.now()
    const result = await system.generateRecipes(params)
    const endTime = performance.now()

    expect(result.success).toBe(true)
    expect(endTime - startTime).toBeLessThan(500)
  })

  it('缓存应该提高响应速度', async () => {
    const userId = 'cache-test-user'
    const context = testContext

    // 第一次请求（无缓存）
    const startTime1 = performance.now()
    const result1 = await system.getRecommendations(userId, context)
    const endTime1 = performance.now()
    const time1 = endTime1 - startTime1

    expect(result1.success).toBe(true)
    expect(result1.performance.cacheHit).toBe(false)

    // 第二次请求（有缓存）
    const startTime2 = performance.now()
    const result2 = await system.getRecommendations(userId, context)
    const endTime2 = performance.now()
    const time2 = endTime2 - startTime2

    expect(result2.success).toBe(true)
    expect(result2.performance.cacheHit).toBe(true)
    expect(time2).toBeLessThan(time1) // 缓存应该更快
  })

  it('系统应该能够处理并发请求', async () => {
    const userIds = Array.from({ length: 10 }, (_, i) => `concurrent-user-${i}`)
    const promises = userIds.map(userId =>
      system.getRecommendations(userId, testContext)
    )

    const startTime = performance.now()
    const results = await Promise.all(promises)
    const endTime = performance.now()

    expect(results.length).toBe(10)
    results.forEach(result => {
      expect(result.success).toBe(true)
    })
    expect(endTime - startTime).toBeLessThan(1000) // 10个并发请求应该在1秒内完成
  })
})