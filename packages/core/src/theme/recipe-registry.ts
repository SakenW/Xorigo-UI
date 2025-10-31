/**
 * 🏷️ 配方分类和搜索系统
 *
 * 提供智能配方分类、全文搜索、标签管理和推荐系统
 * 支持模糊搜索、语义分析、使用统计和个性化推荐
 */

import { DynamicRecipe, SevenAxisConfig } from './seven-axis-recipe-engine'
import { RecipeHistory } from './recipe-storage-manager'

// ============================================================================
// 分类和搜索类型定义
// ============================================================================

/**
 * 配方分类
 */
export interface RecipeCategory {
  /** 分类ID */
  id: string
  /** 分类名称 */
  name: string
  /** 分类描述 */
  description: string
  /** 父分类ID */
  parentId?: string
  /** 分类图标 */
  icon?: string
  /** 配色方案 */
  color?: string
  /** 分类下的配方数量 */
  recipeCount: number
  /** 子分类 */
  children: RecipeCategory[]
  /** 分类权重 */
  weight: number
  /** 是否启用 */
  enabled: boolean
}

/**
 * 搜索过滤器
 */
export interface SearchFilter {
  /** 关键词 */
  query?: string
  /** 分类过滤 */
  categories?: string[]
  /** 标签过滤 */
  tags?: string[]
  /** 轴配置过滤 */
  axes?: {
    mode?: string[]
    hue?: string[]
    density?: string[]
    contrast?: string[]
  }
  /** 评分过滤 */
  minRating?: number
  /** 下载量过滤 */
  minDownloads?: number
  /** 更新时间过滤 */
  updatedAfter?: Date
  /** 排序方式 */
  sortBy?: 'relevance' | 'popularity' | 'rating' | 'newest' | 'name'
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
  /** 分页 */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 搜索结果
 */
export interface SearchResult {
  /** 配方列表 */
  recipes: RecipeSearchItem[]
  /** 总数 */
  total: number
  /** 当前页 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 总页数 */
  totalPages: number
  /** 搜索耗时 */
  searchTime: number
  /** 搜索建议 */
  suggestions?: string[]
  /** 聚合统计 */
  aggregations?: SearchAggregations
}

/**
 * 配方搜索项
 */
export interface RecipeSearchItem {
  /** 配方ID */
  id: string
  /** 配方名称 */
  name: string
  /** 配方描述 */
  description: string
  /** 版本 */
  version: string
  /** 分类 */
  category: string
  /** 标签 */
  tags: string[]
  /** 作者 */
  author: string
  /** 评分 */
  rating: number
  /** 下载量 */
  downloads: number
  /** 更新时间 */
  updatedAt: Date
  /** 相关性得分 */
  relevanceScore: number
  /** 匹配高亮 */
  highlights?: SearchHighlight[]
  /** 缩略图 */
  thumbnail?: string
}

/**
 * 搜索高亮
 */
export interface SearchHighlight {
  /** 字段名 */
  field: string
  /** 高亮片段 */
  fragments: string[]
}

/**
 * 搜索聚合统计
 */
export interface SearchAggregations {
  /** 分类聚合 */
  categories: Array<{ category: string; count: number }>
  /** 标签聚合 */
  tags: Array<{ tag: string; count: number }>
  /** 轴配置聚合 */
  axes: {
    modes: Array<{ mode: string; count: number }>
    hues: Array<{ hue: string; count: number }>
    densities: Array<{ density: string; count: number }>
    contrasts: Array<{ contrast: string; count: number }>
  }
  /** 评分分布 */
  ratingDistribution: Array<{ rating: number; count: number }>
}

/**
 * 推荐结果
 */
export interface RecommendationResult {
  /** 推荐配方 */
  recommendations: RecipeRecommendation[]
  /** 推荐类型 */
  recommendationType: 'similar' | 'trending' | 'personalized' | 'collaborative'
  /** 推荐理由 */
  reasoning: string
}

/**
 * 配方推荐
 */
export interface RecipeRecommendation {
  /** 配方 */
  recipe: RecipeSearchItem
  /** 推荐得分 */
  score: number
  /** 推荐理由 */
  reason: string
  /** 相似度 */
  similarity?: number
}

/**
 * 标签统计
 */
export interface TagStats {
  /** 标签名 */
  tag: string
  /** 使用次数 */
  count: number
  /** 相关配方 */
  relatedRecipes: string[]
  /** 权重 */
  weight: number
}

/**
 * 搜索索引项
 */
export interface SearchIndexItem {
  /** 配方ID */
  recipeId: string
  /** 可搜索文本 */
  searchText: string
  /** 配方数据 */
  recipe: RecipeSearchItem
  /** 关键词向量 */
  keywordVector: Map<string, number>
  /** 分类向量 */
  categoryVector: number[]
  /** 标签向量 */
  tagVector: number[]
}

// ============================================================================
// 配方注册表
// ============================================================================

/**
 * 配方注册表和搜索引擎
 *
 * 特性：
 * - 全文搜索和模糊匹配
 * - 智能分类和标签管理
 * - 个性化推荐
 * - 搜索分析和统计
 * - 实时索引更新
 */
export class RecipeRegistry {
  private searchIndex: Map<string, SearchIndexItem>
  private categories: Map<string, RecipeCategory>
  private tagStats: Map<string, TagStats>
  private searchHistory: string[]
  private popularQueries: Map<string, number>
  private userPreferences: UserPreferences
  private isInitialized: boolean

  constructor() {
    this.searchIndex = new Map()
    this.categories = new Map()
    this.tagStats = new Map()
    this.searchHistory = []
    this.popularQueries = new Map()
    this.userPreferences = this.loadUserPreferences()
    this.isInitialized = false

    this.initialize()
  }

  // ========================================================================
  // 初始化和生命周期
  // ========================================================================

  /**
   * 初始化注册表
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) return

    const startTime = performance.now()

    try {
      // 初始化分类系统
      await this.initializeCategories()

      // 加载搜索历史
      this.loadSearchHistory()

      this.isInitialized = true

      const endTime = performance.now()
      console.log(`🏷️ 配方注册表初始化完成 (${(endTime - startTime).toFixed(2)}ms)`)

    } catch (error) {
      console.error('配方注册表初始化失败:', error)
      throw error
    }
  }

  /**
   * 注册配方
   */
  async registerRecipe(recipe: DynamicRecipe, history: RecipeHistory): Promise<void> {
    const searchItem: RecipeSearchItem = {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      version: recipe.version,
      category: history.category,
      tags: history.tags,
      author: history.author.name,
      rating: history.averageRating,
      downloads: history.totalDownloads,
      updatedAt: new Date(history.lastUpdated),
      relevanceScore: 0
    }

    // 构建搜索索引
    const indexItem: SearchIndexItem = {
      recipeId: recipe.id,
      searchText: this.buildSearchText(recipe, history),
      recipe: searchItem,
      keywordVector: this.buildKeywordVector(recipe, history),
      categoryVector: this.buildCategoryVector(history.category),
      tagVector: this.buildTagVector(history.tags)
    }

    this.searchIndex.set(recipe.id, indexItem)

    // 更新标签统计
    this.updateTagStats(history.tags, recipe.id)

    // 更新分类统计
    this.updateCategoryStats(history.category)

    console.log(`📝 配方注册成功: ${recipe.id}`)
  }

  /**
   * 搜索配方
   */
  async searchRecipes(filter: SearchFilter): Promise<SearchResult> {
    const startTime = performance.now()

    try {
      // 记录搜索历史
      if (filter.query) {
        this.recordSearchQuery(filter.query)
      }

      // 执行搜索
      let results = Array.from(this.searchIndex.values())

      // 应用过滤条件
      results = this.applyFilters(results, filter)

      // 计算相关性得分
      if (filter.query) {
        results = this.calculateRelevanceScores(results, filter.query)
      }

      // 排序
      results = this.sortResults(results, filter.sortBy, filter.sortOrder)

      // 分页
      const page = filter.page || 1
      const pageSize = filter.pageSize || 20
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedResults = results.slice(startIndex, endIndex)

      // 生成搜索结果
      const searchResult: SearchResult = {
        recipes: paginatedResults.map(item => ({
          ...item.recipe,
          relevanceScore: item.keywordVector.get('__relevance__') || 0,
          highlights: this.generateHighlights(item, filter.query)
        })),
        total: results.length,
        page,
        pageSize,
        totalPages: Math.ceil(results.length / pageSize),
        searchTime: performance.now() - startTime,
        suggestions: this.generateSuggestions(filter.query),
        aggregations: this.calculateAggregations(results)
      }

      return searchResult

    } catch (error) {
      console.error('搜索失败:', error)
      return {
        recipes: [],
        total: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
        searchTime: performance.now() - startTime
      }
    }
  }

  /**
   * 获取推荐配方
   */
  async getRecommendations(
    recipeId?: string,
    type: 'similar' | 'trending' | 'personalized' = 'similar',
    limit: number = 10
  ): Promise<RecommendationResult> {
    const startTime = performance.now()

    let recommendations: RecipeRecommendation[] = []

    switch (type) {
      case 'similar':
        recommendations = await this.getSimilarRecipes(recipeId, limit)
        break
      case 'trending':
        recommendations = await this.getTrendingRecipes(limit)
        break
      case 'personalized':
        recommendations = await this.getPersonalizedRecommendations(limit)
        break
    }

    const endTime = performance.now()

    return {
      recommendations,
      recommendationType: type,
      reasoning: this.generateRecommendationReasoning(type, recipeId),
      searchTime: endTime - startTime
    }
  }

  /**
   * 获取分类树
   */
  getCategoryTree(): RecipeCategory[] {
    const rootCategories: RecipeCategory[] = []

    for (const category of this.categories.values()) {
      if (!category.parentId) {
        rootCategories.push({
          ...category,
          children: this.getChildCategories(category.id)
        })
      }
    }

    return rootCategories.sort((a, b) => b.weight - a.weight)
  }

  /**
   * 获取热门标签
   */
  getPopularTags(limit: number = 50): TagStats[] {
    return Array.from(this.tagStats.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  /**
   * 获取搜索建议
   */
  getSearchSuggestions(query: string, limit: number = 10): string[] {
    const suggestions: string[] = []
    const queryLower = query.toLowerCase()

    // 从搜索历史中查找
    for (const historicalQuery of this.searchHistory) {
      if (historicalQuery.toLowerCase().includes(queryLower) && !suggestions.includes(historicalQuery)) {
        suggestions.push(historicalQuery)
        if (suggestions.length >= limit) break
      }
    }

    // 从热门查询中查找
    if (suggestions.length < limit) {
      for (const [popularQuery, count] of this.popularQueries.entries()) {
        if (popularQuery.toLowerCase().includes(queryLower) && !suggestions.includes(popularQuery)) {
          suggestions.push(popularQuery)
          if (suggestions.length >= limit) break
        }
      }
    }

    return suggestions
  }

  // ========================================================================
  // 搜索算法实现
  // ========================================================================

  /**
   * 构建搜索文本
   */
  private buildSearchText(recipe: DynamicRecipe, history: RecipeHistory): string {
    const texts = [
      recipe.name,
      recipe.description,
      history.category,
      ...history.tags,
      history.author.name,
      recipe.id
    ]

    // 添加七轴配置关键词
    if (recipe.axes) {
      texts.push(recipe.axes.mode)
      texts.push(recipe.axes.hue.primary)
      if (recipe.axes.hue.secondary) texts.push(recipe.axes.hue.secondary)
      if (recipe.axes.hue.accent) texts.push(recipe.axes.hue.accent)
      texts.push(recipe.axes.saturation.strategy)
      texts.push(recipe.axes.density.level)
      texts.push(recipe.axes.contrast.level)
      texts.push(recipe.axes.roundness.level)
    }

    return texts.join(' ').toLowerCase()
  }

  /**
   * 构建关键词向量
   */
  private buildKeywordVector(recipe: DynamicRecipe, history: RecipeHistory): Map<string, number> {
    const vector = new Map<string, number>()
    const text = this.buildSearchText(recipe, history)
    const keywords = text.split(/\s+/)

    // 计算词频（TF）
    const totalWords = keywords.length
    const wordCount = new Map<string, number>()

    for (const word of keywords) {
      if (word.length > 1) { // 忽略单字符
        wordCount.set(word, (wordCount.get(word) || 0) + 1)
      }
    }

    // 计算TF-IDF权重
    for (const [word, count] of wordCount) {
      const tf = count / totalWords
      const idf = this.calculateIDF(word)
      vector.set(word, tf * idf)
    }

    return vector
  }

  /**
   * 计算逆文档频率（IDF）
   */
  private calculateIDF(word: string): number {
    const totalDocuments = this.searchIndex.size
    let documentCount = 0

    for (const item of this.searchIndex.values()) {
      if (item.searchText.includes(word)) {
        documentCount++
      }
    }

    return Math.log(totalDocuments / (documentCount + 1))
  }

  /**
   * 构建分类向量
   */
  private buildCategoryVector(category: string): number[] {
    // 简化实现：使用分类哈希作为向量
    const hash = this.hashCode(category)
    return [hash % 100, (hash / 100) % 100, (hash / 10000) % 100]
  }

  /**
   * 构建标签向量
   */
  private buildTagVector(tags: string[]): number[] {
    // 简化实现：使用标签集的特征向量
    const vector = new Array(10).fill(0)

    for (const tag of tags) {
      const index = this.hashCode(tag) % 10
      vector[index] += 1
    }

    return vector
  }

  /**
   * 应用搜索过滤器
   */
  private applyFilters(results: SearchIndexItem[], filter: SearchFilter): SearchIndexItem[] {
    let filtered = results

    // 关键词过滤
    if (filter.query) {
      const queryLower = filter.query.toLowerCase()
      filtered = filtered.filter(item =>
        item.searchText.includes(queryLower)
      )
    }

    // 分类过滤
    if (filter.categories && filter.categories.length > 0) {
      filtered = filtered.filter(item =>
        filter.categories!.includes(item.recipe.category)
      )
    }

    // 标签过滤
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(item =>
        filter.tags!.some(tag => item.recipe.tags.includes(tag))
      )
    }

    // 轴配置过滤
    if (filter.axes) {
      filtered = filtered.filter(item => {
        const recipe = this.getRecipeById(item.recipeId)
        if (!recipe) return false

        if (filter.axes!.mode && !filter.axes!.mode.includes(recipe.axes.mode)) {
          return false
        }
        if (filter.axes!.hue && !filter.axes!.hue.includes(recipe.axes.hue.primary)) {
          return false
        }
        if (filter.axes!.density && !filter.axes!.density.includes(recipe.axes.density.level)) {
          return false
        }
        if (filter.axes!.contrast && !filter.axes!.contrast.includes(recipe.axes.contrast.level)) {
          return false
        }

        return true
      })
    }

    // 评分过滤
    if (filter.minRating !== undefined) {
      filtered = filtered.filter(item =>
        item.recipe.rating >= filter.minRating!
      )
    }

    // 下载量过滤
    if (filter.minDownloads !== undefined) {
      filtered = filtered.filter(item =>
        item.recipe.downloads >= filter.minDownloads!
      )
    }

    // 更新时间过滤
    if (filter.updatedAfter) {
      filtered = filtered.filter(item =>
        item.recipe.updatedAt >= filter.updatedAfter!
      )
    }

    return filtered
  }

  /**
   * 计算相关性得分
   */
  private calculateRelevanceScores(results: SearchIndexItem[], query: string): SearchIndexItem[] {
    const queryLower = query.toLowerCase()
    const queryWords = queryLower.split(/\s+/)

    for (const item of results) {
      let score = 0

      // 文本匹配得分
      for (const word of queryWords) {
        if (item.searchText.includes(word)) {
          score += item.keywordVector.get(word) || 0.1
        }
      }

      // 名称精确匹配加分
      if (item.recipe.name.toLowerCase().includes(queryLower)) {
        score += 2
      }

      // 标签匹配加分
      for (const tag of item.recipe.tags) {
        if (tag.toLowerCase().includes(queryLower)) {
          score += 1.5
        }
      }

      // 分类匹配加分
      if (item.recipe.category.toLowerCase().includes(queryLower)) {
        score += 1
      }

      item.keywordVector.set('__relevance__', score)
    }

    return results
  }

  /**
   * 排序结果
   */
  private sortResults(
    results: SearchIndexItem[],
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'desc'
  ): SearchIndexItem[] {
    const reverse = sortOrder === 'desc' ? -1 : 1

    switch (sortBy) {
      case 'relevance':
        return results.sort((a, b) =>
          (a.keywordVector.get('__relevance__') || 0) -
          (b.keywordVector.get('__relevance__') || 0)
        ) * reverse

      case 'popularity':
        return results.sort((a, b) =>
          (a.recipe.downloads - b.recipe.downloads) * reverse
        )

      case 'rating':
        return results.sort((a, b) =>
          (a.recipe.rating - b.recipe.rating) * reverse
        )

      case 'newest':
        return results.sort((a, b) =>
          (a.recipe.updatedAt.getTime() - b.recipe.updatedAt.getTime()) * reverse
        )

      case 'name':
        return results.sort((a, b) =>
          a.recipe.name.localeCompare(b.recipe.name) * reverse
        )

      default:
        return results
    }
  }

  // ========================================================================
  // 推荐算法实现
  // ========================================================================

  /**
   * 获取相似配方
   */
  private async getSimilarRecipes(recipeId: string, limit: number): Promise<RecipeRecommendation[]> {
    const targetItem = this.searchIndex.get(recipeId)
    if (!targetItem) return []

    const similarities: Array<{ id: string; similarity: number }> = []

    for (const [id, item] of this.searchIndex) {
      if (id === recipeId) continue

      const similarity = this.calculateCosineSimilarity(targetItem, item)
      similarities.push({ id, similarity })
    }

    // 按相似度排序
    similarities.sort((a, b) => b.similarity - a.similarity)

    // 生成推荐结果
    return similarities
      .slice(0, limit)
      .map(sim => ({
        recipe: this.searchIndex.get(sim.id)!.recipe,
        score: sim.similarity,
        reason: `与"${targetItem.recipe.name}"相似`,
        similarity: sim.similarity
      }))
  }

  /**
   * 获取热门配方
   */
  private async getTrendingRecipes(limit: number): Promise<RecipeRecommendation[]> {
    const items = Array.from(this.searchIndex.values())

    // 计算热度得分（下载量 + 评分 + 时间衰减）
    const trending = items.map(item => {
      const daysSinceUpdate = (Date.now() - item.recipe.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      const timeDecay = Math.exp(-daysSinceUpdate / 30) // 30天衰减
      const score = (item.recipe.downloads * 0.3 + item.recipe.rating * 20 * 0.7) * timeDecay

      return {
        recipe: item.recipe,
        score,
        reason: '热门配方'
      }
    })

    return trending
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * 获取个性化推荐
   */
  private async getPersonalizedRecommendations(limit: number): Promise<RecipeRecommendation[]> {
    const items = Array.from(this.searchIndex.values())
    const preferences = this.userPreferences

    const personalized = items.map(item => {
      let score = 0
      let reasons: string[] = []

      // 基于用户偏好分类的得分
      if (preferences.preferredCategories.includes(item.recipe.category)) {
        score += 2
        reasons.push(`符合您偏好的分类：${item.recipe.category}`)
      }

      // 基于用户偏好标签的得分
      const commonTags = item.recipe.tags.filter(tag => preferences.preferredTags.includes(tag))
      if (commonTags.length > 0) {
        score += commonTags.length * 0.5
        reasons.push(`包含您感兴趣的标签：${commonTags.join(', ')}`)
      }

      // 基于历史搜索的得分
      if (preferences.searchHistory.length > 0) {
        for (const query of preferences.searchHistory) {
          if (item.searchText.includes(query.toLowerCase())) {
            score += 0.3
            reasons.push(`与您的搜索历史相关`)
          }
        }
      }

      return {
        recipe: item.recipe,
        score,
        reason: reasons.join('; ') || '个性化推荐'
      }
    })

    return personalized
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * 计算余弦相似度
   */
  private calculateCosineSimilarity(item1: SearchIndexItem, item2: SearchIndexItem): number {
    // 分类相似度
    const categorySimilarity = this.cosineSimilarity(item1.categoryVector, item2.categoryVector)

    // 标签相似度
    const tagSimilarity = this.cosineSimilarity(item1.tagVector, item2.tagVector)

    // 关键词相似度
    const keywordSimilarity = this.calculateKeywordSimilarity(item1.keywordVector, item2.keywordVector)

    // 综合相似度
    return (categorySimilarity * 0.3 + tagSimilarity * 0.3 + keywordSimilarity * 0.4)
  }

  /**
   * 计算向量余弦相似度
   */
  private cosineSimilarity(vector1: number[], vector2: number[]): number {
    if (vector1.length !== vector2.length) return 0

    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0

    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i]
      norm1 += vector1[i] * vector1[i]
      norm2 += vector2[i] * vector2[i]
    }

    if (norm1 === 0 || norm2 === 0) return 0

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
  }

  /**
   * 计算关键词相似度
   */
  private calculateKeywordSimilarity(vector1: Map<string, number>, vector2: Map<string, number>): number {
    const allWords = new Set([...vector1.keys(), ...vector2.keys()])

    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0

    for (const word of allWords) {
      const weight1 = vector1.get(word) || 0
      const weight2 = vector2.get(word) || 0

      dotProduct += weight1 * weight2
      norm1 += weight1 * weight1
      norm2 += weight2 * weight2
    }

    if (norm1 === 0 || norm2 === 0) return 0

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))
  }

  // ========================================================================
  // 辅助方法
  // ========================================================================

  /**
   * 初始化分类系统
   */
  private async initializeCategories(): Promise<void> {
    const defaultCategories: RecipeCategory[] = [
      {
        id: 'corporate',
        name: '企业专业',
        description: '适用于企业环境和商务应用的专业主题',
        weight: 10,
        recipeCount: 0,
        children: [],
        enabled: true,
        color: '#2563eb'
      },
      {
        id: 'minimal',
        name: '极简主义',
        description: '简洁清爽的极简风格主题',
        weight: 8,
        recipeCount: 0,
        children: [],
        enabled: true,
        color: '#64748b'
      },
      {
        id: 'creative',
        name: '创意设计',
        description: '富有创意和个性化的设计主题',
        weight: 7,
        recipeCount: 0,
        children: [],
        enabled: true,
        color: '#a855f7'
      },
      {
        id: 'technology',
        name: '科技感',
        description: '具有现代科技感的设计主题',
        weight: 8,
        recipeCount: 0,
        children: [],
        enabled: true,
        color: '#06b6d4'
      },
      {
        id: 'accessibility',
        name: '可访问性',
        description: '优化可访问性的无障碍主题',
        weight: 9,
        recipeCount: 0,
        children: [],
        enabled: true,
        color: '#16a34a'
      }
    ]

    for (const category of defaultCategories) {
      this.categories.set(category.id, category)
    }
  }

  /**
   * 获取子分类
   */
  private getChildCategories(parentId: string): RecipeCategory[] {
    const children: RecipeCategory[] = []

    for (const category of this.categories.values()) {
      if (category.parentId === parentId) {
        children.push({
          ...category,
          children: this.getChildCategories(category.id)
        })
      }
    }

    return children.sort((a, b) => b.weight - a.weight)
  }

  /**
   * 更新标签统计
   */
  private updateTagStats(tags: string[], recipeId: string): void {
    for (const tag of tags) {
      const stats = this.tagStats.get(tag) || {
        tag,
        count: 0,
        relatedRecipes: [],
        weight: 0
      }

      stats.count++
      if (!stats.relatedRecipes.includes(recipeId)) {
        stats.relatedRecipes.push(recipeId)
      }
      stats.weight = stats.count * Math.log(stats.relatedRecipes.length + 1)

      this.tagStats.set(tag, stats)
    }
  }

  /**
   * 更新分类统计
   */
  private updateCategoryStats(categoryId: string): void {
    const category = this.categories.get(categoryId)
    if (category) {
      category.recipeCount++
    }
  }

  /**
   * 记录搜索查询
   */
  private recordSearchQuery(query: string): void {
    const queryTrim = query.trim()
    if (queryTrim.length === 0) return

    // 添加到搜索历史
    this.searchHistory.unshift(queryTrim)
    if (this.searchHistory.length > 100) {
      this.searchHistory = this.searchHistory.slice(0, 100)
    }

    // 更新热门查询
    this.popularQueries.set(queryTrim, (this.popularQueries.get(queryTrim) || 0) + 1)

    // 保存搜索历史
    this.saveSearchHistory()
  }

  /**
   * 生成搜索高亮
   */
  private generateHighlights(item: SearchIndexItem, query?: string): SearchHighlight[] {
    if (!query) return []

    const highlights: SearchHighlight[] = []
    const queryWords = query.toLowerCase().split(/\s+/)

    // 名称高亮
    const nameHighlights = this.highlightText(item.recipe.name, queryWords)
    if (nameHighlights.length > 0) {
      highlights.push({
        field: 'name',
        fragments: nameHighlights
      })
    }

    // 描述高亮
    const descHighlights = this.highlightText(item.recipe.description, queryWords)
    if (descHighlights.length > 0) {
      highlights.push({
        field: 'description',
        fragments: descHighlights
      })
    }

    return highlights
  }

  /**
   * 文本高亮
   */
  private highlightText(text: string, queryWords: string[]): string[] {
    const fragments: string[] = []
    const textLower = text.toLowerCase()

    for (const word of queryWords) {
      const index = textLower.indexOf(word.toLowerCase())
      if (index !== -1) {
        const start = Math.max(0, index - 20)
        const end = Math.min(text.length, index + word.length + 20)
        const fragment = text.slice(start, end)
        fragments.push(fragment.replace(new RegExp(word, 'gi'), `**${word}**`))
      }
    }

    return fragments
  }

  /**
   * 生成搜索建议
   */
  private generateSuggestions(query?: string): string[] {
    if (!query) return []

    const suggestions = this.getSearchSuggestions(query, 5)
    return suggestions
  }

  /**
   * 计算搜索聚合统计
   */
  private calculateAggregations(results: SearchIndexItem[]): SearchAggregations {
    const aggregations: SearchAggregations = {
      categories: [],
      tags: [],
      axes: {
        modes: [],
        hues: [],
        densities: [],
        contrasts: []
      },
      ratingDistribution: []
    }

    // 分类聚合
    const categoryCount = new Map<string, number>()
    for (const item of results) {
      categoryCount.set(item.recipe.category, (categoryCount.get(item.recipe.category) || 0) + 1)
    }
    aggregations.categories = Array.from(categoryCount.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // 标签聚合
    const tagCount = new Map<string, number>()
    for (const item of results) {
      for (const tag of item.recipe.tags) {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1)
      }
    }
    aggregations.tags = Array.from(tagCount.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // 轴配置聚合
    const axesCount = {
      modes: new Map<string, number>(),
      hues: new Map<string, number>(),
      densities: new Map<string, number>(),
      contrasts: new Map<string, number>()
    }

    for (const item of results) {
      const recipe = this.getRecipeById(item.recipeId)
      if (recipe) {
        axesCount.modes.set(recipe.axes.mode, (axesCount.modes.get(recipe.axes.mode) || 0) + 1)
        axesCount.hues.set(recipe.axes.hue.primary, (axesCount.hues.get(recipe.axes.hue.primary) || 0) + 1)
        axesCount.densities.set(recipe.axes.density.level, (axesCount.densities.get(recipe.axes.density.level) || 0) + 1)
        axesCount.contrasts.set(recipe.axes.contrast.level, (axesCount.contrasts.get(recipe.axes.contrast.level) || 0) + 1)
      }
    }

    aggregations.axes.modes = Array.from(axesCount.modes.entries())
      .map(([mode, count]) => ({ mode, count }))
      .sort((a, b) => b.count - a.count)

    aggregations.axes.hues = Array.from(axesCount.hues.entries())
      .map(([hue, count]) => ({ hue, count }))
      .sort((a, b) => b.count - a.count)

    aggregations.axes.densities = Array.from(axesCount.densities.entries())
      .map(([density, count]) => ({ density, count }))
      .sort((a, b) => b.count - a.count)

    aggregations.axes.contrasts = Array.from(axesCount.contrasts.entries())
      .map(([contrast, count]) => ({ contrast, count }))
      .sort((a, b) => b.count - a.count)

    return aggregations
  }

  /**
   * 生成推荐理由
   */
  private generateRecommendationReasoning(type: string, recipeId?: string): string {
    switch (type) {
      case 'similar':
        return recipeId ? `基于配方 "${recipeId}" 的相似性推荐` : '相似配方推荐'
      case 'trending':
        return '基于当前热门趋势的推荐'
      case 'personalized':
        return '基于您的使用偏好和历史记录的个性化推荐'
      default:
        return '智能推荐'
    }
  }

  /**
   * 获取配方数据
   */
  private getRecipeById(recipeId: string): DynamicRecipe | null {
    // 这里应该从存储管理器获取
    // 暂时返回null
    return null
  }

  /**
   * 哈希函数
   */
  private hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  /**
   * 加载用户偏好
   */
  private loadUserPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem('xorigo-user-preferences')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.warn('加载用户偏好失败:', error)
    }

    return {
      preferredCategories: [],
      preferredTags: [],
      searchHistory: [],
      lastSearchAt: 0
    }
  }

  /**
   * 加载搜索历史
   */
  private loadSearchHistory(): void {
    try {
      const stored = localStorage.getItem('xorigo-search-history')
      if (stored) {
        this.searchHistory = JSON.parse(stored)
      }
    } catch (error) {
      console.warn('加载搜索历史失败:', error)
    }
  }

  /**
   * 保存搜索历史
   */
  private saveSearchHistory(): void {
    try {
      localStorage.setItem('xorigo-search-history', JSON.stringify(this.searchHistory))
    } catch (error) {
      console.warn('保存搜索历史失败:', error)
    }
  }

  /**
   * 获取注册表统计
   */
  getRegistryStats(): RegistryStats {
    return {
      totalRecipes: this.searchIndex.size,
      totalCategories: this.categories.size,
      totalTags: this.tagStats.size,
      searchHistorySize: this.searchHistory.length,
      popularQueriesCount: this.popularQueries.size
    }
  }
}

// ============================================================================
// 类型定义
// ============================================================================

export interface UserPreferences {
  preferredCategories: string[]
  preferredTags: string[]
  searchHistory: string[]
  lastSearchAt: number
}

export interface RegistryStats {
  totalRecipes: number
  totalCategories: number
  totalTags: number
  searchHistorySize: number
  popularQueriesCount: number
}

// ============================================================================
// 默认实例和便捷函数
// ============================================================================

/**
 * 默认注册表实例
 */
export const recipeRegistry = new RecipeRegistry()

/**
 * 便捷函数
 */
export const searchRecipes = (filter: SearchFilter) => recipeRegistry.searchRecipes(filter)
export const getRecommendations = (recipeId?: string, type?: 'similar' | 'trending' | 'personalized', limit?: number) =>
  recipeRegistry.getRecommendations(recipeId, type, limit)
export const getCategoryTree = () => recipeRegistry.getCategoryTree()
export const getPopularTags = (limit?: number) => recipeRegistry.getPopularTags(limit)

export default {
  RecipeRegistry,
  recipeRegistry,
  searchRecipes,
  getRecommendations,
  getCategoryTree,
  getPopularTags
}