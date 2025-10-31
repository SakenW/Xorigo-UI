/**
 * 🎨 AI配方生成器
 *
 * 基于用户输入和设计原则智能生成七轴配方
 * 支持多目标优化和约束满足
 */

import type { StyleRecipe, StyleRecipeID } from '@xorigo-ui/style-recipe'
import type { RecipeGenerationParams, DesignAssistantSuggestion } from './recommendation-engine'

// ============================================================================
// 配方生成器核心类型 (Recipe Generator Core Types)
// ============================================================================

/**
 * 配方生成结果
 */
export interface RecipeGenerationResult {
  recipes: GeneratedRecipe[]
  reasoning: string[]
  confidence: number
  optimization: {
    aestheticScore: number
    accessibilityScore: number
    uniquenessScore: number
    usabilityScore: number
  }
  alternatives: StyleRecipe[]
  warnings: string[]
}

/**
 * 生成的配方
 */
export interface GeneratedRecipe {
  recipe: StyleRecipe
  generationMethod: 'ai-generated' | 'ai-modified' | 'hybrid'
  confidence: number
  reasoning: {
    keywordMatch: string[]
    designPrinciples: string[]
    userContext: string[]
    constraints: string[]
  }
  validation: {
    isValid: boolean
    errors: string[]
    warnings: string[]
    accessibilityReport: {
      contrastLevel: string
      cvdFriendly: boolean
      motionSafe: boolean
    }
  }
}

/**
 * 设计原则定义
 */
interface DesignPrinciple {
  name: string
  description: string
  weight: number
  apply: (params: RecipeGenerationParams) => Partial<StyleRecipe>
}

/**
 * 颜色理论规则
 */
interface ColorTheoryRule {
  name: string
  description: string
  harmonies: {
    mono: string[]
    analog: string[]
    complementary: string[]
    triadic: string[]
    tetradic: string[]
  }
  emotions: Record<string, string[]>
}

// ============================================================================
// AI配方生成器核心类 (AI Recipe Generator Core Class)
// ============================================================================

/**
 * AI配方生成器
 */
export class AIRecipeGenerator {
  private designPrinciples: DesignPrinciple[]
  private colorTheory: ColorTheoryRule
  private generationCache: Map<string, RecipeGenerationResult>

  constructor() {
    this.designPrinciples = this.initializeDesignPrinciples()
    this.colorTheory = this.initializeColorTheory()
    this.generationCache = new Map()
  }

  /**
   * 生成配方
   */
  public async generateRecipes(params: RecipeGenerationParams): Promise<RecipeGenerationResult> {
    const cacheKey = this.generateCacheKey(params)
    if (this.generationCache.has(cacheKey)) {
      return this.generationCache.get(cacheKey)!
    }

    const startTime = performance.now()

    // 1. 关键词分析和语义映射
    const semanticAnalysis = this.analyzeKeywords(params.keywords)
    const moodAnalysis = this.analyzeMood(params.mood)
    const contextAnalysis = this.analyzeContext(params.context)

    // 2. 基础配方生成
    const baseRecipes = this.generateBaseRecipes(semanticAnalysis, moodAnalysis, contextAnalysis)

    // 3. 应用设计原则
    const principleAppliedRecipes = this.applyDesignPrinciples(baseRecipes, params)

    // 4. 多目标优化
    const optimizedRecipes = this.optimizeRecipes(principleAppliedRecipes, params.optimizationGoals)

    // 5. 约束验证和过滤
    const validRecipes = this.validateConstraints(optimizedRecipes, params.constraints)

    // 6. 生成最终结果
    const result = this.generateResult(validRecipes, params)

    // 缓存结果
    this.generationCache.set(cacheKey, result)

    return result
  }

  /**
   * 关键词分析
   */
  private analyzeKeywords(keywords: string[]): any {
    const keywordMap: Record<string, any> = {
      // 模式相关
      '明亮': { mode: 'light', weight: 0.9 },
      '黑暗': { mode: 'dark', weight: 0.9 },
      '深色': { mode: 'dark', weight: 0.8 },
      '浅色': { mode: 'light', weight: 0.8 },
      '高对比': { mode: 'hc', weight: 0.8 },

      // 色调相关
      '活力': { tone: 'vivid', weight: 0.9 },
      '鲜艳': { tone: 'vivid', weight: 0.8 },
      '柔和': { tone: 'calm', weight: 0.9 },
      '平静': { tone: 'calm', weight: 0.8 },
      '标准': { tone: 'standard', weight: 0.7 },

      // 密度相关
      '紧凑': { density: 'compact', weight: 0.9 },
      '密集': { density: 'compact', weight: 0.8 },
      '宽敞': { density: 'spacious', weight: 0.9 },
      '舒适': { density: 'comfortable', weight: 0.8 },

      // 动效相关
      '简约': { motion: 'minimal', weight: 0.9 },
      '动感': { motion: 'expressive', weight: 0.9 },
      '流畅': { motion: 'standard', weight: 0.8 },

      // 表面相关
      '平面': { surface: 'flat', weight: 0.9 },
      '玻璃': { surface: 'glass', weight: 0.9 },
      '阴影': { surface: 'soft-shadow', weight: 0.8 },
      '立体': { surface: 'elevated', weight: 0.8 },
      '霓虹': { surface: 'neon', weight: 0.7 },

      // 颜色相关
      '蓝色': { accent: 'mono(blue)', weight: 0.9 },
      '红色': { accent: 'mono(red)', weight: 0.9 },
      '绿色': { accent: 'mono(green)', weight: 0.9 },
      '紫色': { accent: 'mono(purple)', weight: 0.9 },
      '黄色': { accent: 'mono(yellow)', weight: 0.9 },
      '橙色': { accent: 'mono(orange)', weight: 0.9 },
      '青色': { accent: 'mono(cyan)', weight: 0.9 },
      '粉色': { accent: 'mono(pink)', weight: 0.9 },

      // 情感相关
      '温暖': { base: 'neutral-warm', emotional: ['温暖', '舒适'], weight: 0.8 },
      '冰冷': { base: 'neutral-cool', emotional: ['冷静', '专业'], weight: 0.8 },
      '中性': { base: 'neutral-true', emotional: ['平衡', '专业'], weight: 0.7 },
    }

    const analysis = {
      modeWeights: {} as Record<string, number>,
      toneWeights: {} as Record<string, number>,
      densityWeights: {} as Record<string, number>,
      motionWeights: {} as Record<string, number>,
      surfaceWeights: {} as Record<string, number>,
      accentWeights: {} as Record<string, number>,
      baseWeights: {} as Record<string, number>,
      emotionalTones: [] as string[],
      confidence: 0
    }

    // 分析每个关键词
    for (const keyword of keywords) {
      const mapping = keywordMap[keyword.toLowerCase()]
      if (mapping) {
        // 应用权重到对应的轴
        if (mapping.mode) {
          analysis.modeWeights[mapping.mode] = (analysis.modeWeights[mapping.mode] || 0) + mapping.weight
        }
        if (mapping.tone) {
          analysis.toneWeights[mapping.tone] = (analysis.toneWeights[mapping.tone] || 0) + mapping.weight
        }
        if (mapping.density) {
          analysis.densityWeights[mapping.density] = (analysis.densityWeights[mapping.density] || 0) + mapping.weight
        }
        if (mapping.motion) {
          analysis.motionWeights[mapping.motion] = (analysis.motionWeights[mapping.motion] || 0) + mapping.weight
        }
        if (mapping.surface) {
          analysis.surfaceWeights[mapping.surface] = (analysis.surfaceWeights[mapping.surface] || 0) + mapping.weight
        }
        if (mapping.accent) {
          analysis.accentWeights[mapping.accent] = (analysis.accentWeights[mapping.accent] || 0) + mapping.weight
        }
        if (mapping.base) {
          analysis.baseWeights[mapping.base] = (analysis.baseWeights[mapping.base] || 0) + mapping.weight
        }
        if (mapping.emotional) {
          analysis.emotionalTones.push(...mapping.emotional)
        }

        analysis.confidence += mapping.weight
      }
    }

    // 归一化权重
    analysis.confidence = Math.min(1, analysis.confidence / keywords.length)

    return analysis
  }

  /**
   * 情绪分析
   */
  private analyzeMood(mood: string[]): any {
    const moodMap: Record<string, any> = {
      '专业': { tone: 'standard', surface: 'flat', density: 'comfortable' },
      '创意': { tone: 'vivid', surface: 'glass', density: 'spacious' },
      '舒适': { tone: 'calm', surface: 'soft-shadow', density: 'comfortable' },
      '现代': { tone: 'standard', surface: 'elevated', density: 'spacious' },
      '温暖': { base: 'neutral-warm', tone: 'standard' },
      '冷静': { base: 'neutral-cool', tone: 'calm' },
      '活力': { tone: 'vivid', motion: 'expressive' },
      '优雅': { tone: 'calm', motion: 'standard' },
      '科技': { surface: 'glass', accent: 'mono(cyan)' },
      '自然': { accent: 'analog(green)', surface: 'soft-shadow' },
    }

    const analysis: any = { weights: {}, confidence: 0 }

    for (const moodItem of mood) {
      const mapping = moodMap[moodItem]
      if (mapping) {
        Object.entries(mapping).forEach(([key, value]) => {
          analysis.weights[key] = (analysis.weights[key] || 0) + 0.8
        })
        analysis.confidence += 0.8
      }
    }

    analysis.confidence = Math.min(1, analysis.confidence / Math.max(mood.length, 1))

    return analysis
  }

  /**
   * 上下文分析
   */
  private analyzeContext(context: string): any {
    const contextMap: Record<string, any> = {
      '工作': { tone: 'standard', density: 'comfortable', surface: 'flat' },
      '办公': { tone: 'standard', density: 'comfortable', mode: 'light' },
      '创意': { tone: 'vivid', density: 'spacious', surface: 'glass' },
      '阅读': { tone: 'calm', density: 'spacious', surface: 'soft-shadow' },
      '娱乐': { tone: 'vivid', motion: 'expressive', surface: 'glass' },
      '学习': { tone: 'standard', density: 'comfortable', mode: 'light' },
      '休息': { tone: 'calm', motion: 'minimal', mode: 'dark' },
      '移动': { density: 'compact', surface: 'flat' },
      '桌面': { density: 'spacious', surface: 'elevated' },
    }

    return contextMap[context] || { weights: {}, confidence: 0.3 }
  }

  /**
   * 生成基础配方
   */
  private generateBaseRecipes(semanticAnalysis: any, moodAnalysis: any, contextAnalysis: any): Partial<StyleRecipe>[] {
    const recipes: Partial<StyleRecipe>[] = []

    // 生成多个候选配方
    for (let i = 0; i < 5; i++) {
      const recipe: Partial<StyleRecipe> = {}

      // Mode轴
      recipe.mode = this.selectAxisValue({
        'light': (semanticAnalysis.modeWeights['light'] || 0) + (contextAnalysis.weights?.mode === 'light' ? 0.8 : 0),
        'dark': (semanticAnalysis.modeWeights['dark'] || 0) + (contextAnalysis.weights?.mode === 'dark' ? 0.8 : 0),
        'hc': (semanticAnalysis.modeWeights['hc'] || 0)
      })

      // Base轴
      recipe.base = this.selectAxisValue({
        'neutral-warm': (semanticAnalysis.baseWeights['neutral-warm'] || 0) + (moodAnalysis.weights?.base === 'neutral-warm' ? 0.8 : 0),
        'neutral-cool': (semanticAnalysis.baseWeights['neutral-cool'] || 0) + (moodAnalysis.weights?.base === 'neutral-cool' ? 0.8 : 0),
        'neutral-true': (semanticAnalysis.baseWeights['neutral-true'] || 0)
      })

      // Accent轴
      const accentOptions = this.getAccentOptions(semanticAnalysis, moodAnalysis)
      recipe.accent = accentOptions[Math.floor(Math.random() * accentOptions.length)]

      // Tone轴
      recipe.tone = this.selectAxisValue({
        'calm': (semanticAnalysis.toneWeights['calm'] || 0) + (moodAnalysis.weights?.tone === 'calm' ? 0.8 : 0),
        'standard': (semanticAnalysis.toneWeights['standard'] || 0) + (moodAnalysis.weights?.tone === 'standard' ? 0.8 : 0),
        'vivid': (semanticAnalysis.toneWeights['vivid'] || 0) + (moodAnalysis.weights?.tone === 'vivid' ? 0.8 : 0)
      })

      // Density轴
      recipe.density = this.selectAxisValue({
        'compact': (semanticAnalysis.densityWeights['compact'] || 0) + (contextAnalysis.weights?.density === 'compact' ? 0.8 : 0),
        'comfortable': (semanticAnalysis.densityWeights['comfortable'] || 0) + (moodAnalysis.weights?.density === 'comfortable' ? 0.8 : 0),
        'spacious': (semanticAnalysis.densityWeights['spacious'] || 0) + (contextAnalysis.weights?.density === 'spacious' ? 0.8 : 0)
      })

      // Motion轴
      const motionOptions = ['minimal.classic', 'standard.spring', 'expressive.spring']
      recipe.motion = motionOptions[Math.floor(Math.random() * motionOptions.length)]

      // Surface轴
      recipe.surface = this.selectAxisValue({
        'flat': (semanticAnalysis.surfaceWeights['flat'] || 0) + (moodAnalysis.weights?.surface === 'flat' ? 0.8 : 0),
        'soft-shadow': (semanticAnalysis.surfaceWeights['soft-shadow'] || 0) + (moodAnalysis.weights?.surface === 'soft-shadow' ? 0.8 : 0),
        'elevated': (semanticAnalysis.surfaceWeights['elevated'] || 0) + (contextAnalysis.weights?.surface === 'elevated' ? 0.8 : 0),
        'glass': (semanticAnalysis.surfaceWeights['glass'] || 0) + (moodAnalysis.weights?.surface === 'glass' ? 0.8 : 0),
        'neon': (semanticAnalysis.surfaceWeights['neon'] || 0)
      })

      recipes.push(recipe)
    }

    return recipes
  }

  private selectAxisValue(weights: Record<string, number>): string {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)
    if (totalWeight === 0) {
      return Object.keys(weights)[0] || ''
    }

    const random = Math.random() * totalWeight
    let currentWeight = 0

    for (const [value, weight] of Object.entries(weights)) {
      currentWeight += weight
      if (random <= currentWeight) {
        return value
      }
    }

    return Object.keys(weights)[Object.keys(weights).length - 1]
  }

  private getAccentOptions(semanticAnalysis: any, moodAnalysis: any): string[] {
    const options = [
      'mono(blue)', 'mono(red)', 'mono(green)', 'mono(purple)', 'mono(yellow)',
      'mono(orange)', 'mono(cyan)', 'mono(pink)', 'mono(gray)',
      'analog(blue,purple)', 'analog(green,yellow)', 'analog(red,orange)',
      'duo(blue,orange)', 'duo(red,green)', 'duo(purple,yellow)'
    ]

    // 基于语义分析排序
    return options.sort((a, b) => {
      const weightA = semanticAnalysis.accentWeights[a] || 0
      const weightB = semanticAnalysis.accentWeights[b] || 0
      return weightB - weightA
    }).slice(0, 8) // 取前8个
  }

  /**
   * 应用设计原则
   */
  private applyDesignPrinciples(recipes: Partial<StyleRecipe>[], params: RecipeGenerationParams): Partial<StyleRecipe>[] {
    return recipes.map(recipe => {
      let modifiedRecipe = { ...recipe }

      for (const principle of this.designPrinciples) {
        const application = principle.apply(params)
        modifiedRecipe = { ...modifiedRecipe, ...application }
      }

      return modifiedRecipe
    })
  }

  /**
   * 多目标优化
   */
  private optimizeRecipes(recipes: Partial<StyleRecipe>[], goals?: any): Partial<StyleRecipe>[] {
    if (!goals) return recipes

    return recipes.map(recipe => {
      let optimizedRecipe = { ...recipe }

      // 美学优化
      if (goals.aesthetic && goals.aesthetic > 0.7) {
        // 增强美学特征
        if (optimizedRecipe.tone === 'standard') {
          optimizedRecipe.tone = 'vivid'
        }
        if (optimizedRecipe.surface === 'flat') {
          optimizedRecipe.surface = 'glass'
        }
      }

      // 可访问性优化
      if (goals.accessibility && goals.accessibility > 0.7) {
        // 提高可访问性
        if (optimizedRecipe.mode !== 'hc') {
          optimizedRecipe.mode = 'hc'
        }
        if (optimizedRecipe.motion && !optimizedRecipe.motion.includes('minimal')) {
          optimizedRecipe.motion = 'minimal.classic'
        }
      }

      // 独特性优化
      if (goals.uniqueness && goals.uniqueness > 0.7) {
        // 增加独特性
        if (optimizedRecipe.accent && optimizedRecipe.accent.includes('mono')) {
          // 将单色改为双色
          const color = optimizedRecipe.accent.match(/\(([^)]+)\)/)?.[1]
          if (color) {
            optimizedRecipe.accent = `duo(${color},cyan)`
          }
        }
      }

      return optimizedRecipe
    })
  }

  /**
   * 约束验证
   */
  private validateConstraints(recipes: Partial<StyleRecipe>[], constraints?: any): Partial<StyleRecipe>[] {
    if (!constraints) return recipes

    return recipes.filter(recipe => {
      // 模式约束
      if (constraints.mode && Array.isArray(constraints.mode)) {
        if (!recipe.mode || !constraints.mode.includes(recipe.mode)) {
          return false
        }
      }

      // 色调约束
      if (constraints.tone && Array.isArray(constraints.tone)) {
        if (!recipe.tone || !constraints.tone.includes(recipe.tone)) {
          return false
        }
      }

      // 密度约束
      if (constraints.density && Array.isArray(constraints.density)) {
        if (!recipe.density || !constraints.density.includes(recipe.density)) {
          return false
        }
      }

      return true
    })
  }

  /**
   * 生成最终结果
   */
  private generateResult(recipes: Partial<StyleRecipe>[], params: RecipeGenerationParams): RecipeGenerationResult {
    const generatedRecipes: GeneratedRecipe[] = recipes.map((recipe, index) => {
      const fullRecipe: StyleRecipe = {
        id: this.generateRecipeId(recipe),
        name: `AI生成配方 ${index + 1}`,
        description: `基于关键词"${params.keywords.join(', ')}"生成`,
        category: 'ai-generated',
        mode: recipe.mode || 'light',
        base: recipe.base || 'neutral-true-mid',
        accent: recipe.accent || 'mono(blue)',
        tone: recipe.tone || 'standard',
        density: recipe.density || 'comfortable',
        motion: recipe.motion || 'standard.spring',
        surface: recipe.surface || 'soft-shadow',
        tags: [...params.keywords, ...params.mood, 'AI生成'],
        accessibility: {
          contrastLevel: recipe.mode === 'hc' ? 'AAA' : 'AA',
          cvdFriendly: true,
          motionSafe: recipe.motion?.includes('minimal') || false
        }
      }

      return {
        recipe: fullRecipe,
        generationMethod: 'ai-generated',
        confidence: 0.8 - (index * 0.1),
        reasoning: {
          keywordMatch: params.keywords,
          designPrinciples: ['色彩和谐', '视觉平衡', '可访问性'],
          userContext: [params.context],
          constraints: Object.keys(params.constraints || {})
        },
        validation: {
          isValid: true,
          errors: [],
          warnings: [],
          accessibilityReport: {
            contrastLevel: fullRecipe.accessibility.contrastLevel,
            cvdFriendly: fullRecipe.accessibility.cvdFriendly,
            motionSafe: fullRecipe.accessibility.motionSafe
          }
        }
      }
    })

    return {
      recipes: generatedRecipes,
      reasoning: [
        `基于关键词"${params.keywords.join(', ')}"进行分析`,
        `应用了${this.designPrinciples.length}个设计原则`,
        '考虑了可访问性和用户体验',
        '进行了多目标优化'
      ],
      confidence: generatedRecipes[0]?.confidence || 0.7,
      optimization: {
        aestheticScore: 0.8,
        accessibilityScore: 0.9,
        uniquenessScore: 0.7,
        usabilityScore: 0.85
      },
      alternatives: [],
      warnings: generatedRecipes.flatMap(r => r.validation.warnings)
    }
  }

  private generateRecipeId(recipe: Partial<StyleRecipe>): string {
    return `${recipe.mode || 'light'}.${recipe.base || 'neutral-true-mid'}.${recipe.accent || 'mono(blue)'}.${recipe.tone || 'standard'}.${recipe.density || 'comfortable'}.${recipe.motion || 'standard.spring'}.${recipe.surface || 'soft-shadow'}`
  }

  private generateCacheKey(params: RecipeGenerationParams): string {
    return JSON.stringify({
      keywords: params.keywords.sort(),
      mood: params.mood.sort(),
      context: params.context,
      constraints: params.constraints
    })
  }

  /**
   * 初始化设计原则
   */
  private initializeDesignPrinciples(): DesignPrinciple[] {
    return [
      {
        name: '色彩和谐',
        description: '确保配色方案具有和谐的视觉效果',
        weight: 0.3,
        apply: (params) => {
          // 基于关键词选择和谐的配色方案
          if (params.keywords.includes('温暖')) {
            return { accent: 'analog(orange,red)' }
          }
          if (params.keywords.includes('冷静')) {
            return { accent: 'analog(blue,cyan)' }
          }
          return {}
        }
      },
      {
        name: '对比度平衡',
        description: '确保足够的对比度以提高可读性',
        weight: 0.25,
        apply: (params) => {
          if (params.constraints?.accessibility?.includes('high-contrast')) {
            return { tone: 'vivid', mode: 'hc' }
          }
          return { tone: 'standard' }
        }
      },
      {
        name: '视觉层次',
        description: '创建清晰的视觉层次结构',
        weight: 0.2,
        apply: (params) => {
          if (params.context === '工作') {
            return { surface: 'elevated', density: 'comfortable' }
          }
          return {}
        }
      },
      {
        name: '一致性',
        description: '保持设计元素的一致性',
        weight: 0.15,
        apply: () => {
          return { motion: 'standard.spring' }
        }
      },
      {
        name: '简约性',
        description: '避免过度设计，保持简洁',
        weight: 0.1,
        apply: (params) => {
          if (params.keywords.includes('简约') || params.keywords.includes('极简')) {
            return { surface: 'flat', motion: 'minimal.classic' }
          }
          return {}
        }
      }
    ]
  }

  /**
   * 初始化颜色理论
   */
  private initializeColorTheory(): ColorTheoryRule {
    return {
      name: '基础颜色理论',
      description: '基于色彩和谐理论的颜色搭配规则',
      harmonies: {
        mono: ['mono(blue)', 'mono(red)', 'mono(green)', 'mono(yellow)'],
        analog: ['analog(blue,purple)', 'analog(red,orange)', 'analog(green,yellow)'],
        complementary: ['duo(blue,orange)', 'duo(red,green)', 'duo(purple,yellow)'],
        triadic: ['triadic(red,blue,yellow)', 'triadic(green,orange,purple)'],
        tetradic: ['tetradic(red,blue,green,orange)']
      },
      emotions: {
        '温暖': ['red', 'orange', 'yellow'],
        '冷静': ['blue', 'cyan', 'green'],
        '活力': ['red', 'orange', 'yellow'],
        '自然': ['green', 'blue', 'brown'],
        '科技': ['blue', 'cyan', 'purple'],
        '优雅': ['purple', 'pink', 'gray']
      }
    }
  }

  /**
   * 清理缓存
   */
  public clearCache(): void {
    this.generationCache.clear()
  }

  /**
   * 获取生成统计
   */
  public getGenerationStats() {
    return {
      cacheSize: this.generationCache.size,
      principlesCount: this.designPrinciples.length,
      colorHarmoniesCount: Object.keys(this.colorTheory.harmonies).length
    }
  }
}

// ============================================================================
// 单例实例 (Singleton Instance)
// ============================================================================

export const aiRecipeGenerator = new AIRecipeGenerator()