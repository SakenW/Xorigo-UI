/**
 * 🎨 Xorigo UI 主题工具集
 *
 * 提供主题应用、切换、管理等实用功能
 * 替代复杂的AI推荐引擎，提供轻量级的主题管理
 */

import { COMPLETE_THEME_RECIPES, getThemeById, type CompleteThemeRecipe } from './complete-theme-recipes'

// ============================================================================
// 核心类型定义
// ============================================================================

export interface ThemeUtils {
  applyTheme: (recipeId: string) => Promise<void>
  getCurrentTheme: () => CompleteThemeRecipe | null
  getThemeHistory: () => string[]
  resetTheme: () => Promise<void>
}

export interface ThemeSearchFilter {
  category?: string
  tags?: string[]
  isNew?: boolean
  isPopular?: boolean
}

export interface ThemeSearchResult {
  themes: CompleteThemeRecipe[]
  total: number
  facets: {
    categories: Record<string, number>
    tags: Record<string, number>
  }
}

// ============================================================================
// 主题应用管理器
// ============================================================================

class ThemeManager {
  private currentThemeId: string | null = null
  private themeHistory: string[] = []
  private maxHistorySize = 10

  /**
   * 应用主题
   */
  async applyTheme(recipeId: string): Promise<void> {
    const theme = getThemeById(recipeId)
    if (!theme) {
      throw new Error(`主题配方不存在: ${recipeId}`)
    }

    // 解析recipeId并应用主题
    try {
      await this.parseAndApplyRecipe(theme.recipeId)

      // 更新当前主题
      this.currentThemeId = recipeId

      // 添加到历史记录
      this.addToHistory(recipeId)

      // 保存到本地存储
      this.saveToLocalStorage()

      console.log(`🎨 主题已应用: ${theme.name}`)
    } catch (error) {
      console.error('应用主题失败:', error)
      throw error
    }
  }

  /**
   * 解析并应用配方
   */
  private async parseAndApplyRecipe(recipeId: string): Promise<void> {
    // 简化版本：解析recipeId并应用CSS变量
    const root = document.documentElement

    // 解析配方ID (简化版逻辑)
    const parts = recipeId.split('.')

    // 应用模式
    if (parts[0]) {
      root.setAttribute('data-theme-mode', parts[0])
    }

    // 应用基础色调
    if (parts[1]) {
      root.setAttribute('data-theme-base', parts[1])
    }

    // 应用其他参数...

    // 模拟异步应用过程
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme(): CompleteThemeRecipe | null {
    if (!this.currentThemeId) return null
    return getThemeById(this.currentThemeId) || null
  }

  /**
   * 获取主题历史
   */
  getThemeHistory(): string[] {
    return [...this.themeHistory]
  }

  /**
   * 重置主题
   */
  async resetTheme(): Promise<void> {
    const defaultTheme = COMPLETE_THEME_RECIPES[0]
    await this.applyTheme(defaultTheme.id)
  }

  /**
   * 添加到历史记录
   */
  private addToHistory(themeId: string): void {
    // 移除重复项
    this.themeHistory = this.themeHistory.filter(id => id !== themeId)

    // 添加到开头
    this.themeHistory.unshift(themeId)

    // 限制历史记录大小
    if (this.themeHistory.length > this.maxHistorySize) {
      this.themeHistory = this.themeHistory.slice(0, this.maxHistorySize)
    }
  }

  /**
   * 保存到本地存储
   */
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('xorigo-current-theme', this.currentThemeId || '')
      localStorage.setItem('xorigo-theme-history', JSON.stringify(this.themeHistory))
    } catch (error) {
      console.warn('保存主题设置失败:', error)
    }
  }

  /**
   * 从本地存储加载
   */
  loadFromLocalStorage(): void {
    try {
      const savedTheme = localStorage.getItem('xorigo-current-theme')
      const savedHistory = localStorage.getItem('xorigo-theme-history')

      if (savedTheme) {
        this.currentThemeId = savedTheme
      }

      if (savedHistory) {
        this.themeHistory = JSON.parse(savedHistory)
      }
    } catch (error) {
      console.warn('加载主题设置失败:', error)
    }
  }
}

// ============================================================================
// 搜索和过滤功能
// ============================================================================

/**
 * 搜索主题
 */
export function searchThemes(query: string, filter?: ThemeSearchFilter): ThemeSearchResult {
  let themes = COMPLETE_THEME_RECIPES

  // 应用过滤条件
  if (filter) {
    if (filter.category && filter.category !== 'all') {
      themes = themes.filter(theme => theme.category === filter.category)
    }

    if (filter.tags && filter.tags.length > 0) {
      themes = themes.filter(theme =>
        filter.tags!.some(tag => theme.tags.includes(tag))
      )
    }

    if (filter.isNew !== undefined) {
      themes = themes.filter(theme => theme.isNew === filter.isNew)
    }

    if (filter.isPopular !== undefined) {
      themes = themes.filter(theme => theme.isPopular === filter.isPopular)
    }
  }

  // 应用搜索查询
  if (query.trim()) {
    const lowercaseQuery = query.toLowerCase()
    themes = themes.filter(theme =>
      theme.name.toLowerCase().includes(lowercaseQuery) ||
      theme.description.toLowerCase().includes(lowercaseQuery) ||
      theme.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  // 计算分类统计
  const categoryStats: Record<string, number> = {}
  themes.forEach(theme => {
    categoryStats[theme.category] = (categoryStats[theme.category] || 0) + 1
  })

  // 计算标签统计
  const tagStats: Record<string, number> = {}
  themes.forEach(theme => {
    theme.tags.forEach(tag => {
      tagStats[tag] = (tagStats[tag] || 0) + 1
    })
  })

  return {
    themes,
    total: themes.length,
    facets: {
      categories: categoryStats,
      tags: tagStats
    }
  }
}

/**
 * 获取推荐主题
 */
export function getRecommendedThemes(limit: number = 5): CompleteThemeRecipe[] {
  // 简单的推荐逻辑：返回热门主题
  return COMPLETE_THEME_RECIPES
    .filter(theme => theme.isPopular)
    .slice(0, limit)
}

/**
 * 获取相似主题
 */
export function getSimilarThemes(themeId: string, limit: number = 3): CompleteThemeRecipe[] {
  const theme = getThemeById(themeId)
  if (!theme) return []

  // 基于分类和标签找相似主题
  return COMPLETE_THEME_RECIPES
    .filter(t =>
      t.id !== themeId &&
      (t.category === theme.category ||
       t.tags.some(tag => theme.tags.includes(tag)))
    )
    .slice(0, limit)
}

// ============================================================================
// 主题工具实例
// ============================================================================

export const themeManager = new ThemeManager()

// 初始化时从本地存储加载
if (typeof window !== 'undefined') {
  themeManager.loadFromLocalStorage()
}

// 向后兼容的导出
export const themeUtils: ThemeUtils = {
  applyTheme: (recipeId: string) => themeManager.applyTheme(recipeId),
  getCurrentTheme: () => themeManager.getCurrentTheme(),
  getThemeHistory: () => themeManager.getThemeHistory(),
  resetTheme: () => themeManager.resetTheme()
}

// ============================================================================
// 快捷函数
// ============================================================================

/**
 * 快速应用主题
 */
export async function applyTheme(themeId: string): Promise<void> {
  return themeUtils.applyTheme(themeId)
}

/**
 * 获取当前主题
 */
export function getCurrentTheme(): CompleteThemeRecipe | null {
  return themeUtils.getCurrentTheme()
}

/**
 * 搜索主题
 */
export function findThemes(query: string, filter?: ThemeSearchFilter): CompleteThemeRecipe[] {
  const result = searchThemes(query, filter)
  return result.themes
}

/**
 * 获取主题统计
 */
export function getThemeStats() {
  return {
    total: COMPLETE_THEME_RECIPES.length,
    categories: [...new Set(COMPLETE_THEME_RECIPES.map(t => t.category))].length,
    popular: COMPLETE_THEME_RECIPES.filter(t => t.isPopular).length,
    new: COMPLETE_THEME_RECIPES.filter(t => t.isNew).length
  }
}