/**
 * 🔍 客户端搜索引擎
 *
 * 基于 Fuse.js 的高性能前端搜索
 * 特性:
 * - 模糊搜索
 * - 多字段权重
 * - 结果高亮
 * - 性能优化 (≤ 50ms)
 */

import Fuse from 'fuse.js'
import type {
  SearchResult,
  ComponentSearchData,
  RecipeSearchData,
  MatchInfo,
} from '../../app/api/search/types'

// ============================================================================
// 配置
// ============================================================================

/**
 * 组件搜索配置
 */
const COMPONENT_FUSE_OPTIONS: Fuse.IFuseOptions<ComponentSearchData> = {
  threshold: 0.3, // 匹配阈值 (0=完全匹配, 1=任意匹配)
  includeScore: true, // 返回匹配分数
  includeMatches: true, // 返回匹配位置（用于高亮）
  minMatchCharLength: 2, // 最小匹配字符数
  ignoreLocation: true, // 忽略位置，全文搜索
  useExtendedSearch: false, // 禁用扩展搜索（提升性能）
  keys: [
    { name: 'name', weight: 2.0 }, // 名称权重最高
    { name: 'description', weight: 1.0 }, // 描述次之
    { name: 'category', weight: 0.5 }, // 类别
    { name: 'tags', weight: 0.8 }, // 标签
  ],
}

/**
 * 配方搜索配置
 */
const RECIPE_FUSE_OPTIONS: Fuse.IFuseOptions<RecipeSearchData> = {
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
  useExtendedSearch: false,
  keys: [
    { name: 'name', weight: 2.0 },
    { name: 'description', weight: 1.0 },
    { name: 'tags', weight: 0.8 },
    { name: 'category', weight: 0.5 },
    { name: 'mode', weight: 0.4 }, // 模式 (light/dark)
    { name: 'base', weight: 0.3 }, // 基础色调
    { name: 'accent', weight: 0.3 }, // 强调色
  ],
}

// ============================================================================
// 搜索引擎类
// ============================================================================

export class ClientSearchEngine {
  private componentFuse: Fuse<ComponentSearchData> | null = null
  private recipeFuse: Fuse<RecipeSearchData> | null = null
  private componentData: ComponentSearchData[] = []
  private recipeData: RecipeSearchData[] = []
  private initialized: boolean = false

  /**
   * 初始化搜索引擎
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    try {
      // 并行加载索引数据
      const [componentData, recipeData] = await Promise.all([
        this.loadComponentIndex(),
        this.loadRecipeIndex(),
      ])

      this.componentData = componentData
      this.recipeData = recipeData

      // 创建 Fuse 实例
      this.componentFuse = new Fuse(componentData, COMPONENT_FUSE_OPTIONS)
      this.recipeFuse = new Fuse(recipeData, RECIPE_FUSE_OPTIONS)

      this.initialized = true
    } catch (error) {
      console.error('搜索引擎初始化失败:', error)
      throw error
    }
  }

  /**
   * 搜索组件
   */
  searchComponents(query: string, limit: number = 20): SearchResult[] {
    if (!this.componentFuse) {
      return []
    }

    const startTime = performance.now()
    const results = this.componentFuse.search(query, { limit })
    const duration = performance.now() - startTime

    // 性能监控：超过 50ms 警告
    if (duration > 50) {
      console.warn(`组件搜索耗时过长: ${duration.toFixed(2)}ms`)
    }

    return results.map((result) => this.transformComponentResult(result))
  }

  /**
   * 搜索配方
   */
  searchRecipes(query: string, limit: number = 20): SearchResult[] {
    if (!this.recipeFuse) {
      return []
    }

    const startTime = performance.now()
    const results = this.recipeFuse.search(query, { limit })
    const duration = performance.now() - startTime

    // 性能监控
    if (duration > 50) {
      console.warn(`配方搜索耗时过长: ${duration.toFixed(2)}ms`)
    }

    return results.map((result) => this.transformRecipeResult(result))
  }

  /**
   * 搜索所有内容
   */
  searchAll(query: string, limit: number = 20): SearchResult[] {
    const componentResults = this.searchComponents(query, Math.ceil(limit / 2))
    const recipeResults = this.searchRecipes(query, Math.ceil(limit / 2))

    // 合并结果并按分数排序
    const allResults = [...componentResults, ...recipeResults]
    return allResults.sort((a, b) => a.score - b.score).slice(0, limit)
  }

  /**
   * 高级搜索 - 支持筛选条件
   */
  advancedSearch(
    query: string,
    filters: {
      type?: 'component' | 'recipe' | 'all'
      category?: string
      tags?: string[]
    } = {},
    limit: number = 20
  ): SearchResult[] {
    const { type = 'all', category, tags } = filters

    let results: SearchResult[] = []

    // 根据类型搜索
    if (type === 'component' || type === 'all') {
      results.push(...this.searchComponents(query, limit))
    }
    if (type === 'recipe' || type === 'all') {
      results.push(...this.searchRecipes(query, limit))
    }

    // 应用筛选条件
    if (category) {
      results = results.filter((r) => r.metadata?.category === category)
    }

    if (tags && tags.length > 0) {
      results = results.filter((r) => {
        const itemTags = r.metadata?.tags || []
        return tags.some((tag) => itemTags.includes(tag))
      })
    }

    // 排序并限制数量
    return results.sort((a, b) => a.score - b.score).slice(0, limit)
  }

  /**
   * 获取搜索建议
   */
  getSuggestions(query: string, limit: number = 5): string[] {
    if (!query || query.length < 2) {
      return []
    }

    const allResults = this.searchAll(query, limit * 2)
    const suggestions = new Set<string>()

    // 从搜索结果中提取建议
    allResults.forEach((result) => {
      // 添加标题
      if (result.title.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(result.title)
      }

      // 添加标签
      const tags = result.metadata?.tags || []
      tags.forEach((tag: string) => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(tag)
        }
      })
    })

    return Array.from(suggestions).slice(0, limit)
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      componentCount: this.componentData.length,
      recipeCount: this.recipeData.length,
      totalCount: this.componentData.length + this.recipeData.length,
      initialized: this.initialized,
    }
  }

  // ============================================================================
  // 私有方法
  // ============================================================================

  /**
   * 加载组件索引
   */
  private async loadComponentIndex(): Promise<ComponentSearchData[]> {
    const response = await fetch('/search-index/components.json')
    if (!response.ok) {
      throw new Error('加载组件索引失败')
    }
    return response.json()
  }

  /**
   * 加载配方索引
   */
  private async loadRecipeIndex(): Promise<RecipeSearchData[]> {
    const response = await fetch('/search-index/recipes.json')
    if (!response.ok) {
      throw new Error('加载配方索引失败')
    }
    return response.json()
  }

  /**
   * 转换组件搜索结果
   */
  private transformComponentResult(
    result: Fuse.FuseResult<ComponentSearchData>
  ): SearchResult {
    const { item, score = 0, matches = [] } = result

    return {
      id: item.id,
      type: 'component',
      title: item.name,
      description: item.description,
      url: item.path,
      score,
      matches: this.transformMatches(matches),
      metadata: {
        category: item.category,
        tags: item.tags || [],
      },
    }
  }

  /**
   * 转换配方搜索结果
   */
  private transformRecipeResult(
    result: Fuse.FuseResult<RecipeSearchData>
  ): SearchResult {
    const { item, score = 0, matches = [] } = result

    return {
      id: item.id,
      type: 'recipe',
      title: item.name,
      description: item.description,
      url: item.path,
      score,
      matches: this.transformMatches(matches),
      metadata: {
        category: item.category,
        tags: item.tags,
        mode: item.mode,
        base: item.base,
        accent: item.accent,
        tone: item.tone,
        density: item.density,
        motion: item.motion,
        surface: item.surface,
      },
    }
  }

  /**
   * 转换匹配信息
   */
  private transformMatches(
    fuseMatches: readonly Fuse.FuseResultMatch[]
  ): MatchInfo[] {
    return fuseMatches.map((match) => ({
      key: match.key || '',
      value: match.value || '',
      indices: match.indices as [number, number][],
    }))
  }
}

// ============================================================================
// 导出单例实例
// ============================================================================

let clientSearchEngineInstance: ClientSearchEngine | null = null

/**
 * 获取搜索引擎实例
 */
export function getClientSearchEngine(): ClientSearchEngine {
  if (!clientSearchEngineInstance) {
    clientSearchEngineInstance = new ClientSearchEngine()
  }
  return clientSearchEngineInstance
}

/**
 * 初始化搜索引擎（使用防抖）
 */
let initPromise: Promise<void> | null = null

export async function initializeSearch(): Promise<void> {
  if (initPromise) {
    return initPromise
  }

  const engine = getClientSearchEngine()
  initPromise = engine.initialize()
  return initPromise
}
