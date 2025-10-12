/**
 * 搜索引擎核心逻辑
 * 使用 Fuse.js 实现模糊搜索
 */

import Fuse from 'fuse.js'
import type {
  SearchResult,
  ComponentSearchData,
  RecipeSearchData,
  MatchInfo,
} from './types'

// ============================================================================
// Fuse.js 配置
// 根据 Context7 文档配置
// ============================================================================

/**
 * 组件搜索配置
 */
const COMPONENT_FUSE_OPTIONS = {
  threshold: 0.3,           // 匹配阈值 (0=完全匹配, 1=任意匹配)
  includeScore: true,       // 返回匹配分数
  includeMatches: true,     // 返回匹配位置（用于高亮）
  minMatchCharLength: 2,    // 最小匹配字符数
  keys: [
    { name: 'name', weight: 2 },           // 名称权重最高
    { name: 'description', weight: 1 },    // 描述次之
    { name: 'category', weight: 0.5 },     // 类别
    { name: 'tags', weight: 0.5 },         // 标签
  ],
}

/**
 * 配方搜索配置
 */
const RECIPE_FUSE_OPTIONS = {
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  keys: [
    { name: 'name', weight: 2 },
    { name: 'description', weight: 1 },
    { name: 'tags', weight: 0.8 },
    { name: 'category', weight: 0.5 },
    { name: 'mode', weight: 0.3 },         // 模式 (light/dark)
    { name: 'base', weight: 0.2 },         // 基础色调
    { name: 'accent', weight: 0.2 },       // 强调色
  ],
}

// ============================================================================
// 搜索引擎类
// ============================================================================

export class SearchEngine {
  private componentFuse: Fuse<ComponentSearchData> | null = null
  private recipeFuse: Fuse<RecipeSearchData> | null = null

  /**
   * 初始化组件搜索引擎
   */
  initComponentSearch(components: ComponentSearchData[]) {
    this.componentFuse = new Fuse(components, COMPONENT_FUSE_OPTIONS)
  }

  /**
   * 初始化配方搜索引擎
   */
  initRecipeSearch(recipes: RecipeSearchData[]) {
    this.recipeFuse = new Fuse(recipes, RECIPE_FUSE_OPTIONS)
  }

  /**
   * 搜索组件
   */
  searchComponents(query: string): SearchResult[] {
    if (!this.componentFuse) {
      return []
    }

    const results = this.componentFuse.search(query)
    return results.map(result => this.transformComponentResult(result))
  }

  /**
   * 搜索配方
   */
  searchRecipes(query: string): SearchResult[] {
    if (!this.recipeFuse) {
      return []
    }

    const results = this.recipeFuse.search(query)
    return results.map(result => this.transformRecipeResult(result))
  }

  /**
   * 搜索所有内容
   */
  searchAll(query: string): SearchResult[] {
    const componentResults = this.searchComponents(query)
    const recipeResults = this.searchRecipes(query)

    // 合并结果并按分数排序
    const allResults = [...componentResults, ...recipeResults]
    return allResults.sort((a, b) => a.score - b.score)
  }

  // ============================================================================
  // 私有方法 - 结果转换
  // ============================================================================

  /**
   * 转换组件搜索结果
   */
  private transformComponentResult(
    result: any
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
    result: any
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
   * Fuse.js 的 matches 格式转换为我们的 MatchInfo 格式
   */
  private transformMatches(
    fuseMatches: readonly any[]
  ): MatchInfo[] {
    return fuseMatches.map(match => ({
      key: match.key || '',
      value: match.value || '',
      indices: match.indices as [number, number][],
    }))
  }
}

// ============================================================================
// 导出单例实例
// ============================================================================

export const searchEngine = new SearchEngine()
