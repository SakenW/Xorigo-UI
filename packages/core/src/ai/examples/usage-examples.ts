/**
 * 📚 AI系统使用示例
 *
 * 展示如何使用Xorigo UI AI系统的各种功能
 * 包含推荐、生成、分析等功能的完整示例
 */

import type { StyleRecipe } from '@xorigo-ui/style-recipe'
import {
  // 核心类
  AIRecipeRecommendationEngine,
  AIRecipeGenerator,
  UserBehaviorAnalyzer,
  AIDesignAssistant,
  AISystemManager,

  // 单例实例
  aiRecommendationEngine,
  aiRecipeGenerator,
  userBehaviorAnalyzer,
  aiDesignAssistant,
  aiSystem,

  // 便捷API
  getRecommendations,
  generateRecipes,
  getDesignSuggestions,
  assessDesign,
  recordUserAction,

  // React Hooks
  useAIRecommendations,
  useAIRecipeGenerator,
  useDesignAssistant,
  useUserBehaviorAnalysis,
  useAISystemStatus
} from '../index'

// ============================================================================
// 1. 基础使用示例 (Basic Usage Examples)
// ============================================================================

/**
 * 示例1: 获取个性化推荐
 */
export async function exampleGetRecommendations() {
  const userId = 'user-123'
  const context = {
    timeOfDay: 'morning',
    deviceType: 'desktop',
    taskType: 'work',
    numberOfRecommendations: 5
  }

  try {
    const result = await getRecommendations(userId, context)

    if (result.success && result.data) {
      console.log('🎯 获取到推荐:')
      result.data.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.recipe.name}`)
        console.log(`   分数: ${rec.score}`)
        console.log(`   置信度: ${rec.confidence}`)
        console.log(`   理由: ${rec.reasoning.userPreferenceMatch}`)
      })

      // 选择第一个推荐
      const firstRecommendation = result.data.recommendations[0]
      recordUserAction(userId, 'recipe_select', {
        recipeId: firstRecommendation.recipe.id,
        score: firstRecommendation.score
      })
    } else {
      console.error('❌ 推荐获取失败:', result.error?.message)
    }
  } catch (error) {
    console.error('❌ 推荐获取异常:', error)
  }
}

/**
 * 示例2: 生成新配方
 */
export async function exampleGenerateRecipes() {
  const generationParams = {
    keywords: ['现代', '专业', '简洁'],
    mood: ['舒适', '高效'],
    context: '办公环境设计',
    constraints: {
      mode: ['light'],
      tone: ['standard'],
      accessibility: ['aa']
    },
    optimizationGoals: {
      aesthetic: 0.8,
      accessibility: 0.9,
      uniqueness: 0.7,
      usability: 0.8
    }
  }

  try {
    const result = await generateRecipes(generationParams, 'user-123')

    if (result.success && result.data) {
      console.log('🎨 生成了新配方:')
      result.data.recipes.forEach((recipe, index) => {
        console.log(`${index + 1}. ${recipe.recipe.name}`)
        console.log(`   ID: ${recipe.recipe.id}`)
        console.log(`   置信度: ${recipe.confidence}`)
        console.log(`   生成方法: ${recipe.generationMethod}`)
        console.log(`   是否有效: ${recipe.validation.isValid}`)
      })

      // 选择第一个生成的配方
      const firstRecipe = result.data.recipes[0]
      recordUserAction('user-123', 'recipe_generate_select', {
        recipeId: firstRecipe.recipe.id,
        keywords: generationParams.keywords,
        confidence: firstRecipe.confidence
      })
    } else {
      console.error('❌ 配方生成失败:', result.error?.message)
    }
  } catch (error) {
    console.error('❌ 配方生成异常:', error)
  }
}

/**
 * 示例3: 获取设计建议
 */
export async function exampleGetDesignSuggestions() {
  const mockRecipe: StyleRecipe = {
    id: 'light.neutral-true-mid.mono(blue).standard.comfortable.standard.soft-shadow',
    name: '现代蓝调',
    description: '专业现代的蓝色主题',
    category: 'professional',
    mode: 'light',
    base: 'neutral-true-mid',
    accent: 'mono(blue)',
    tone: 'standard',
    density: 'comfortable',
    motion: 'standard.spring',
    surface: 'soft-shadow',
    tags: ['现代', '专业', '蓝色'],
    accessibility: {
      contrastLevel: 'AA',
      cvdFriendly: true,
      motionSafe: true
    }
  }

  try {
    const suggestions = await getDesignSuggestions(mockRecipe, 'user-123', 'all')

    if (suggestions.success && suggestions.data) {
      console.log('💡 设计建议:')
      suggestions.data.forEach((suggestion, index) => {
        console.log(`${index + 1}. [${suggestion.priority.toUpperCase()}] ${suggestion.title}`)
        console.log(`   描述: ${suggestion.description}`)
        console.log(`   理由: ${suggestion.reasoning}`)
        console.log(`   置信度: ${suggestion.confidence}`)
        console.log(`   操作: ${suggestion.action.type}`)
      })
    } else {
      console.error('❌ 设计建议获取失败:', suggestions.error?.message)
    }
  } catch (error) {
    console.error('❌ 设计建议获取异常:', error)
  }
}

/**
 * 示例4: 全面设计评估
 */
export async function exampleAssessDesign() {
  const mockRecipe: StyleRecipe = {
    id: 'dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass',
    name: '赛博蓝紫',
    description: '充满科技感的蓝紫配色',
    category: 'technology',
    mode: 'dark',
    base: 'neutral-cool-mid',
    accent: 'analog(purple)',
    tone: 'vivid',
    density: 'comfortable',
    motion: 'expressive.spring',
    surface: 'glass',
    tags: ['科技', '现代', '蓝紫'],
    accessibility: {
      contrastLevel: 'AA',
      cvdFriendly: true,
      motionSafe: false
    }
  }

  try {
    const assessment = await assessDesign(mockRecipe, 'user-123', {
      deviceType: 'desktop',
      environment: 'office'
    })

    if (assessment.success && assessment.data) {
      const result = assessment.data
      console.log('📊 设计评估结果:')
      console.log(`总体分数: ${result.overallScore}/100`)
      console.log('\n📈 各项分数:')
      console.log(`  可访问性: ${result.categories.accessibility.score}/100`)
      console.log(`  美学: ${result.categories.aesthetics.score}/100`)
      console.log(`  可用性: ${result.categories.usability.score}/100`)
      console.log(`  性能: ${result.categories.performance.score}/100`)

      if (result.criticalIssues.length > 0) {
        console.log('\n🚨 关键问题:')
        result.criticalIssues.forEach(issue => {
          console.log(`  - ${issue.description}`)
        })
      }

      if (result.quickWins.length > 0) {
        console.log('\n⚡ 快速改进:')
        result.quickWins.forEach(win => {
          console.log(`  - ${win.title}: ${win.description}`)
        })
      }

      console.log('\n🎯 推荐行动:')
      console.log('  立即执行:', result.recommendations.immediate.join(', '))
      console.log('  短期计划:', result.recommendations.shortTerm.join(', '))
      console.log('  长期规划:', result.recommendations.longTerm.join(', '))
    } else {
      console.error('❌ 设计评估失败:', assessment.error?.message)
    }
  } catch (error) {
    console.error('❌ 设计评估异常:', error)
  }
}

// ============================================================================
// 2. 高级使用示例 (Advanced Usage Examples)
// ============================================================================

/**
 * 示例5: 使用AI系统管理器
 */
export async function exampleUsingAISystemManager() {
  // 创建自定义配置的AI系统
  const aiSystem = new AISystemManager({
    recommendation: {
      maxRecommendations: 3,
      cacheEnabled: true,
      realTimeUpdates: true
    },
    generation: {
      maxGeneratedRecipes: 5,
      creativityLevel: 0.8,
      constraintStrictness: 0.7
    },
    designAssistant: {
      strictAccessibilityMode: true,
      enableRealTimeSuggestions: true,
      suggestionPriority: 'critical'
    },
    performance: {
      enableCaching: true,
      maxCacheSize: 500,
      cacheTimeout: 10 * 60 * 1000 // 10分钟
    }
  })

  const userId = 'advanced-user-123'

  try {
    // 1. 获取系统状态
    const status = aiSystem.getSystemStatus()
    console.log('🤖 AI系统状态:', {
      isInitialized: status.isInitialized,
      isActive: status.isActive,
      uptime: status.statistics.uptime
    })

    // 2. 批量操作
    const [recommendations, generatedRecipes] = await Promise.all([
      aiSystem.getRecommendations(userId, {
        timeOfDay: 'afternoon',
        deviceType: 'laptop',
        taskType: 'creative'
      }),
      aiSystem.generateRecipes({
        keywords: ['创意', '活力'],
        mood: ['动感', '现代'],
        context: '创意工作'
      }, userId)
    ])

    console.log('📦 批量操作结果:')
    console.log(`  推荐数量: ${recommendations.data?.recommendations.length || 0}`)
    console.log(`  生成配方数: ${generatedRecipes.data?.recipes.length || 0}`)

    // 3. 记录复合行为
    if (recommendations.data && generatedRecipes.data) {
      aiSystem.recordUserEvent(userId, 'complex_interaction', {
        recommendationsReceived: recommendations.data.recommendations.length,
        recipesGenerated: generatedRecipes.data.recipes.length,
        context: 'advanced_usage_example'
      })
    }

    // 4. 更新用户偏好
    const preferences = aiSystem.updateUserPreferences(userId)
    console.log('👤 用户偏好已更新:', {
      interactionStyle: preferences.data?.behaviorPatterns.interactionStyle,
      adaptationSpeed: preferences.data?.behaviorPatterns.adaptationSpeed
    })

    // 5. 获取用户行为分析
    const behaviorAnalysis = aiSystem.getUserBehaviorAnalysis(userId)
    if (behaviorAnalysis.success && behaviorAnalysis.data) {
      console.log('📊 行为分析结果:', {
        userPersona: behaviorAnalysis.data.insights.userPersona,
        satisfactionRate: behaviorAnalysis.data.insights.satisfactionIndicators.recipeSelectionRate
      })
    }

  } catch (error) {
    console.error('❌ 高级AI系统操作失败:', error)
  } finally {
    // 清理资源
    aiSystem.shutdown()
  }
}

/**
 * 示例6: 实时用户行为跟踪
 */
export function exampleRealTimeBehaviorTracking() {
  const userId = 'realtime-user-123'
  let sessionId = `session-${Date.now()}`

  // 模拟用户会话
  const simulateUserSession = async () => {
    try {
      // 1. 用户访问页面
      aiSystem.recordUserEvent(userId, 'page_visit', {
        page: 'recipes',
        referrer: 'home',
        timestamp: new Date()
      })

      // 2. 用户浏览配方
      await new Promise(resolve => setTimeout(resolve, 1000))
      aiSystem.recordUserEvent(userId, 'recipe_view', {
        recipeId: 'light.neutral-true-mid.mono(blue).standard.comfortable.standard.soft-shadow',
        viewDuration: 2500
      })

      // 3. 用户搜索
      await new Promise(resolve => setTimeout(resolve, 500))
      aiSystem.recordUserEvent(userId, 'recipe_search', {
        searchQuery: '现代专业',
        resultsCount: 5,
        selectedResult: 2
      })

      // 4. 用户获取推荐
      await new Promise(resolve => setTimeout(resolve, 800))
      const recommendations = await aiSystem.getRecommendations(userId, {
        timeOfDay: 'morning',
        deviceType: 'desktop',
        taskType: 'work'
      })

      if (recommendations.success && recommendations.data) {
        aiSystem.recordUserEvent(userId, 'recommendations_received', {
          recommendationCount: recommendations.data.recommendations.length,
          averageScore: recommendations.data.personalizedScore
        })
      }

      // 5. 用户选择配方
      await new Promise(resolve => setTimeout(resolve, 1200))
      aiSystem.recordUserEvent(userId, 'recipe_select', {
        recipeId: 'dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass',
        selectionSource: 'recommendation',
        confidence: 0.85
      })

      // 6. 用户请求设计建议
      await new Promise(resolve => setTimeout(resolve, 600))
      const suggestions = await aiSystem.getDesignSuggestions(
        { id: 'dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass' } as StyleRecipe,
        userId
      )

      if (suggestions.success && suggestions.data) {
        aiSystem.recordUserEvent(userId, 'suggestions_received', {
          suggestionCount: suggestions.data.length,
          criticalSuggestions: suggestions.data.filter(s => s.priority === 'critical').length
        })
      }

      // 7. 会话结束
      aiSystem.recordUserEvent(userId, 'session_end', {
        sessionId,
        sessionDuration: Date.now() - parseInt(sessionId.split('-')[1]),
        actionsCompleted: 6
      })

      console.log('✅ 实时行为跟踪会话完成')

      // 获取实时分析
      const realTimeAnalysis = userBehaviorAnalyzer.getRealTimeAnalysis(userId)
      console.log('📊 实时分析结果:', {
        engagementLevel: realTimeAnalysis.immediateInsights.engagementLevel,
        recipesViewed: realTimeAnalysis.currentSession.recipesViewed.length,
        activeTime: realTimeAnalysis.currentSession.activeTime
      })

    } catch (error) {
      console.error('❌ 实时行为跟踪失败:', error)
    }
  }

  return simulateUserSession
}

// ============================================================================
// 3. React组件示例 (React Component Examples)
// ============================================================================

/**
 * 示例7: React组件中使用AI推荐
 */
export function RecommendationComponentExample() {
  // 在实际React组件中的使用示例
  const componentCode = `
import React from 'react'
import { useAIRecommendations } from '@xorigo-ui/core/ai'

function RecommendationPanel({ userId }) {
  const {
    recommendations,
    isLoading,
    error,
    refresh,
    selectRecommendation,
    performance
  } = useAIRecommendations({
    userId,
    context: {
      timeOfDay: new Date().getHours() < 12 ? 'morning' : 'afternoon',
      deviceType: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      taskType: 'work'
    },
    autoRefresh: true,
    refreshInterval: 60000 // 每分钟刷新
  })

  if (isLoading) {
    return <div>正在获取个性化推荐...</div>
  }

  if (error) {
    return (
      <div>
        <p>获取推荐失败: {error}</p>
        <button onClick={refresh}>重试</button>
      </div>
    )
  }

  if (!recommendations) {
    return <div>暂无推荐</div>
  }

  return (
    <div className="recommendation-panel">
      <div className="panel-header">
        <h3>为您推荐</h3>
        <div className="performance-info">
          <span>响应时间: {performance.processingTime.toFixed(1)}ms</span>
          {performance.cacheHit && <span className="cache-badge">缓存命中</span>}
        </div>
      </div>

      <div className="recommendations-list">
        {recommendations.recommendations.map((rec, index) => (
          <div
            key={rec.recipe.id}
            className="recommendation-item"
            onClick={() => selectRecommendation(rec.recipe.id)}
          >
            <h4>{rec.recipe.name}</h4>
            <p>{rec.recipe.description}</p>
            <div className="recommendation-meta">
              <span className="score">匹配度: {rec.score}%</span>
              <span className="confidence">置信度: {(rec.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="recommendation-tags">
              {rec.personalizedTags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="panel-footer">
        <button onClick={refresh}>刷新推荐</button>
        <div className="reasoning">
          <p>推荐理由: {recommendations.reasoning.primary[0]}</p>
        </div>
      </div>
    </div>
  )
}
  `

  console.log('📱 React推荐组件示例代码:')
  console.log(componentCode)

  return componentCode
}

/**
 * 示例8: React组件中使用配方生成器
 */
export function RecipeGeneratorComponentExample() {
  const componentCode = `
import React, { useState } from 'react'
import { useAIRecipeGenerator, useSmartRecipeParams } from '@xorigo-ui/core/ai'

function RecipeGenerator({ userId }) {
  const [showResults, setShowResults] = useState(false)

  // 智能参数管理
  const {
    params,
    updateParams,
    setKeywords,
    setMood,
    setContext,
    resetParams,
    validateParams
  } = useSmartRecipeParams({
    onParamsChange: (newParams) => {
      console.log('参数已更新:', newParams)
    }
  })

  // 配方生成
  const {
    generate,
    isGenerating,
    error,
    lastResult,
    clearResult
  } = useAIRecipeGenerator({
    userId,
    autoGenerate: false
  })

  const handleGenerate = async () => {
    const validation = validateParams()
    if (!validation.isValid) {
      alert('参数错误: ' + validation.errors.join(', '))
      return
    }

    await generate(params)
    setShowResults(true)
  }

  const handleApplyRecipe = (recipe) => {
    // 应用生成的配方
    console.log('应用配方:', recipe.id)
    // 这里可以集成到主题系统中
  }

  return (
    <div className="recipe-generator">
      <div className="generator-inputs">
        <div className="input-group">
          <label>关键词</label>
          <input
            type="text"
            placeholder="输入关键词，如: 现代、专业、温暖"
            value={params.keywords.join(', ')}
            onChange={(e) => setKeywords(e.target.value.split(',').map(k => k.trim()))}
          />
        </div>

        <div className="input-group">
          <label>情绪氛围</label>
          <select
            multiple
            value={params.mood}
            onChange={(e) => setMood(Array.from(e.target.selectedOptions, opt => opt.value))}
          >
            <option value="舒适">舒适</option>
            <option value="现代">现代</option>
            <option value="专业">专业</option>
            <option value="创意">创意</option>
            <option value="温暖">温暖</option>
          </select>
        </div>

        <div className="input-group">
          <label>使用场景</label>
          <input
            type="text"
            placeholder="如: 办公环境、创意工作"
            value={params.context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <div className="generator-actions">
          <button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? '生成中...' : '生成配方'}
          </button>
          <button onClick={resetParams}>重置参数</button>
          <button onClick={clearResult}>清除结果</button>
        </div>

        {error && (
          <div className="error-message">
            生成失败: {error}
          </div>
        )}
      </div>

      {showResults && lastResult && (
        <div className="generator-results">
          <h3>生成的配方</h3>
          <div className="results-info">
            <p>置信度: {(lastResult.confidence * 100).toFixed(0)}%</p>
            <p>生成时间: {lastResult.performance?.processingTime || 0}ms</p>
          </div>

          <div className="generated-recipes">
            {lastResult.recipes.map((recipe, index) => (
              <div key={recipe.recipe.id} className="generated-recipe">
                <h4>{recipe.recipe.name}</h4>
                <p>{recipe.recipe.description}</p>
                <div className="recipe-details">
                  <span>模式: {recipe.recipe.mode}</span>
                  <span>色调: {recipe.recipe.tone}</span>
                  <span>密度: {recipe.recipe.density}</span>
                </div>
                <div className="recipe-actions">
                  <button onClick={() => handleApplyRecipe(recipe.recipe)}>
                    应用此配方
                  </button>
                </div>
              </div>
            ))}
          </div>

          {lastResult.warnings.length > 0 && (
            <div className="warnings">
              <h4>注意事项</h4>
              <ul>
                {lastResult.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
  `

  console.log('🎨 React配方生成器组件示例代码:')
  console.log(componentCode)

  return componentCode
}

/**
 * 示例9: 完整的AI系统集成示例
 */
export async function exampleCompleteAIIntegration() {
  console.log('🚀 开始完整的AI系统集成演示')

  const userId = 'integration-demo-user'

  try {
    // 1. 系统初始化检查
    const systemStatus = aiSystem.getSystemStatus()
    console.log('✅ AI系统状态:', {
      initialized: systemStatus.isInitialized,
      active: systemStatus.isActive,
      modules: Object.entries(systemStatus.modules)
        .filter(([_, status]) => status === 'active')
        .map(([name]) => name)
    })

    // 2. 模拟用户 journey
    console.log('\n📱 模拟用户使用流程...')

    // 2.1 用户访问并记录行为
    aiSystem.recordUserEvent(userId, 'app_open', {
      timestamp: new Date(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language
      }
    })

    // 2.2 获取上下文感知的推荐
    const hour = new Date().getHours()
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'

    const recommendations = await aiSystem.getRecommendations(userId, {
      timeOfDay,
      deviceType: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      taskType: 'work',
      numberOfRecommendations: 3
    })

    if (recommendations.success && recommendations.data) {
      console.log(`🎯 获取到 ${recommendations.data.recommendations.length} 个推荐`)

      // 2.3 用户选择推荐并记录
      const selectedRec = recommendations.data.recommendations[0]
      aiSystem.recordUserEvent(userId, 'recommendation_selected', {
        recipeId: selectedRec.recipe.id,
        score: selectedRec.score,
        confidence: selectedRec.confidence,
        reasoning: selectedRec.reasoning
      })

      // 2.4 获取设计建议
      const suggestions = await aiSystem.getDesignSuggestions(selectedRec.recipe, userId)
      if (suggestions.success && suggestions.data.length > 0) {
        console.log(`💡 获得 ${suggestions.data.length} 条设计建议`)

        // 2.5 用户应用建议
        const criticalSuggestion = suggestions.data.find(s => s.priority === 'critical')
        if (criticalSuggestion) {
          aiSystem.recordUserEvent(userId, 'suggestion_applied', {
            suggestionId: criticalSuggestion.title,
            type: criticalSuggestion.type,
            impact: criticalSuggestion.description
          })
        }
      }

      // 2.6 进行设计评估
      const assessment = await aiSystem.assessDesign(selectedRec.recipe, userId)
      if (assessment.success && assessment.data) {
        console.log(`📊 设计评估完成，总分: ${assessment.data.overallScore}`)

        aiSystem.recordUserEvent(userId, 'design_assessment_completed', {
          recipeId: selectedRec.recipe.id,
          overallScore: assessment.data.overallScore,
          criticalIssues: assessment.data.criticalIssues.length
        })
      }
    }

    // 3. 用户尝试生成新配方
    console.log('\n🎨 用户尝试生成新配方...')

    const generationResult = await aiSystem.generateRecipes({
      keywords: ['个性化', '专业', '现代'],
      mood: ['舒适', '高效'],
      context: '基于推荐配方的改进',
      constraints: {
        mode: [selectedRec?.recipe.mode || 'light'],
        accessibility: ['aa']
      },
      optimizationGoals: {
        aesthetic: 0.8,
        accessibility: 0.9,
        uniqueness: 0.7,
        usability: 0.8
      }
    }, userId)

    if (generationResult.success && generationResult.data) {
      console.log(`✅ 成功生成 ${generationResult.data.recipes.length} 个配方`)

      aiSystem.recordUserEvent(userId, 'recipe_generation_completed', {
        keywords: ['个性化', '专业', '现代'],
        resultCount: generationResult.data.recipes.length,
        confidence: generationResult.data.confidence
      })
    }

    // 4. 更新用户偏好模型
    console.log('\n👤 更新用户偏好模型...')

    const preferences = aiSystem.updateUserPreferences(userId)
    if (preferences.success && preferences.data) {
      console.log('✅ 用户偏好已更新:', {
        interactionStyle: preferences.data.behaviorPatterns.interactionStyle,
        adaptationSpeed: preferences.data.behaviorPatterns.adaptationSpeed,
        colorHarmony: preferences.data.aestheticPreferences.colorHarmony,
        contrastLevel: preferences.data.aestheticPreferences.contrastLevel
      })
    }

    // 5. 获取完整的行为分析
    console.log('\n📊 生成用户行为分析报告...')

    const behaviorAnalysis = aiSystem.getUserBehaviorAnalysis(userId)
    if (behaviorAnalysis.success && behaviorAnalysis.data) {
      const analysis = behaviorAnalysis.data
      console.log('📈 用户行为分析结果:')
      console.log(`  用户画像: ${analysis.insights.userPersona}`)
      console.log(`  决策风格: ${analysis.insights.decisionMakingStyle}`)
      console.log(`  满意度指标:`)
      console.log(`    配方选择率: ${(analysis.insights.satisfactionIndicators.recipeSelectionRate * 100).toFixed(1)}%`)
      console.log(`    会话完成率: ${(analysis.insights.satisfactionIndicators.sessionCompletionRate * 100).toFixed(1)}%`)
      console.log(`  偏好配方数量: ${analysis.patterns.preferential.favoriteRecipes.length}`)
      console.log(`  探索模式评分: ${analysis.patterns.preferential.explorationPatterns.recipeSwitchFrequency}`)
    }

    // 6. 获取系统性能指标
    console.log('\n⚡ 系统性能指标:')
    const finalStatus = aiSystem.getSystemStatus()
    console.log(`  总推荐数: ${finalStatus.statistics.totalRecommendations}`)
    console.log(`  总生成数: ${finalStatus.statistics.totalGenerations}`)
    console.log(`  总分析数: ${finalStatus.statistics.totalAnalyses}`)
    console.log(`  平均响应时间: ${finalStatus.performance.averageResponseTime.toFixed(1)}ms`)
    console.log(`  缓存命中率: ${(finalStatus.performance.cacheHitRate * 100).toFixed(1)}%`)
    console.log(`  系统运行时间: ${(finalStatus.statistics.uptime / 1000 / 60).toFixed(1)}分钟`)

    console.log('\n🎉 完整的AI系统集成演示成功完成!')

  } catch (error) {
    console.error('❌ AI系统集成演示失败:', error)
  }
}

// ============================================================================
// 4. 错误处理和最佳实践示例 (Error Handling & Best Practices)
// ============================================================================

/**
 * 示例10: 错误处理和重试机制
 */
export async function exampleErrorHandling() {
  const userId = 'error-handling-demo-user'

  const withRetry = async (operation, maxRetries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation()
        return result
      } catch (error) {
        console.warn(`操作失败 (尝试 ${attempt}/${maxRetries}):`, error.message)

        if (attempt === maxRetries) {
          throw error
        }

        // 指数退避
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
      }
    }
  }

  try {
    // 带重试的推荐获取
    const recommendations = await withRetry(async () => {
      const result = await getRecommendations(userId, {
        timeOfDay: 'morning',
        deviceType: 'desktop'
      })

      if (!result.success) {
        throw new Error(result.error?.message || '推荐获取失败')
      }

      return result
    }, 3, 1000)

    console.log('✅ 成功获取推荐 (带重试):', recommendations.data?.recommendations.length)

  } catch (error) {
    console.error('❌ 操作最终失败:', error)

    // 降级策略
    console.log('🔄 启用降级策略...')
    // 可以使用默认推荐或缓存的结果
  }
}

/**
 * 示例11: 性能监控和优化
 */
export function examplePerformanceMonitoring() {
  const performanceTracker = {
    operations: [],

    startOperation(name) {
      const operation = {
        name,
        startTime: performance.now(),
        endTime: null,
        duration: null
      }
      this.operations.push(operation)
      return operation
    },

    endOperation(operation) {
      operation.endTime = performance.now()
      operation.duration = operation.endTime - operation.startTime
      return operation
    },

    getStats() {
      const stats = {}
      this.operations.forEach(op => {
        if (!stats[op.name]) {
          stats[op.name] = { count: 0, totalDuration: 0, avgDuration: 0 }
        }
        stats[op.name].count++
        stats[op.name].totalDuration += op.duration
        stats[op.name].avgDuration = stats[op.name].totalDuration / stats[op.name].count
      })
      return stats
    },

    clear() {
      this.operations = []
    }
  }

  // 使用示例
  const monitorAsyncOperation = async (operationName, asyncFunction) => {
    const operation = performanceTracker.startOperation(operationName)

    try {
      const result = await asyncFunction()
      performanceTracker.endOperation(operation)
      return result
    } catch (error) {
      performanceTracker.endOperation(operation)
      throw error
    }
  }

  // 监控AI操作
  const monitoredOperations = async () => {
    try {
      // 监控推荐获取
      const recommendations = await monitorAsyncOperation(
        'get_recommendations',
        () => getRecommendations('monitor-user', { timeOfDay: 'morning' })
      )

      // 监控配方生成
      const generation = await monitorAsyncOperation(
        'generate_recipes',
        () => generateRecipes({
          keywords: ['监控', '测试'],
          mood: ['专业'],
          context: '性能测试'
        })
      )

      // 监控设计建议
      const suggestions = await monitorAsyncOperation(
        'get_suggestions',
        () => getDesignSuggestions({
          id: 'test-recipe',
          name: '测试配方'
        } as StyleRecipe)
      )

      // 输出性能统计
      console.log('📊 性能监控统计:')
      const stats = performanceTracker.getStats()
      Object.entries(stats).forEach(([name, stat]) => {
        console.log(`  ${name}: ${stat.count}次, 平均${stat.avgDuration.toFixed(1)}ms`)
      })

      return { recommendations, generation, suggestions }

    } finally {
      performanceTracker.clear()
    }
  }

  return monitoredOperations
}

// ============================================================================
// 导出所有示例 (Export All Examples)
// ============================================================================

export const examples = {
  // 基础示例
  getRecommendations: exampleGetRecommendations,
  generateRecipes: exampleGenerateRecipes,
  getDesignSuggestions: exampleGetDesignSuggestions,
  assessDesign: exampleAssessDesign,

  // 高级示例
  useAISystemManager: exampleUsingAISystemManager,
  realTimeBehaviorTracking: exampleRealTimeBehaviorTracking,

  // React组件示例
  recommendationComponent: RecommendationComponentExample,
  recipeGeneratorComponent: RecipeGeneratorComponentExample,

  // 完整集成
  completeIntegration: exampleCompleteAIIntegration,

  // 最佳实践
  errorHandling: exampleErrorHandling,
  performanceMonitoring: examplePerformanceMonitoring
}

console.log('📚 AI系统使用示例已加载完成!')
console.log('可用示例:', Object.keys(examples))
console.log('使用方法: examples.exampleName()')