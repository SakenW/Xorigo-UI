'use client'

import { readonlyRegistry } from '@/data/registry.readonly'
import type { Component } from '@/data/types'

/**
 * Search Client - 搜索系统客户端
 * 负责处理搜索和筛选功能
 */
export class SearchClient {
  /**
   * 搜索组件
   */
  static async searchComponents(query: string, filters?: {
    category?: string
    tags?: string[]
  }): Promise<Component[]> {
    try {
      let components = readonlyRegistry.getComponents()

      // 应用分类筛选
      if (filters?.category) {
        components = components.filter(comp => comp.category === filters.category)
      }

      // 应用标签筛选
      if (filters?.tags && filters.tags.length > 0) {
        components = components.filter(comp =>
          filters.tags!.some(tag => comp.tags.includes(tag))
        )
      }

      // 应用文本搜索
      if (query.trim()) {
        const lowerQuery = query.toLowerCase()
        components = components.filter(component =>
          component.name.toLowerCase().includes(lowerQuery) ||
          component.displayName.toLowerCase().includes(lowerQuery) ||
          component.description.toLowerCase().includes(lowerQuery) ||
          component.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        )
      }

      return components
    } catch (error) {
      console.error('Failed to search components:', error)
      return []
    }
  }

  /**
   * 获取搜索建议
   */
  static async getSearchSuggestions(query: string): Promise<string[]> {
    try {
      const components = readonlyRegistry.getComponents()
      const suggestions = new Set<string>()

      // 从组件名称中提取建议
      components.forEach(component => {
        const lowerName = component.name.toLowerCase()
        const lowerDisplayName = component.displayName.toLowerCase()

        if (lowerName.includes(query.toLowerCase())) {
          suggestions.add(component.displayName)
        }

        if (lowerDisplayName.includes(query.toLowerCase())) {
          suggestions.add(component.displayName)
        }
      })

      // 从标签中提取建议
      components.forEach(component => {
        component.tags.forEach(tag => {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(tag)
          }
        })
      })

      return Array.from(suggestions).slice(0, 10)
    } catch (error) {
      console.error('Failed to get search suggestions:', error)
      return []
    }
  }

  /**
   * 获取热门搜索
   */
  static async getPopularSearches(): Promise<string[]> {
    try {
      const categories = readonlyRegistry.getCategories()
      const popularSearches = [
        'Button',
        'Input',
        'Card',
        'Modal',
        'Form',
        'Table',
        'Navigation',
      ]

      // 添加分类名称
      categories.forEach(category => {
        popularSearches.push(category.displayName)
      })

      return popularSearches.slice(0, 8)
    } catch (error) {
      console.error('Failed to get popular searches:', error)
      return []
    }
  }

  /**
   * 获取筛选选项
   */
  static async getFilterOptions(): Promise<{
    categories: Array<{ value: string; label: string; count: number }>
    tags: Array<{ value: string; label: string; count: number }>
  }> {
    try {
      const components = readonlyRegistry.getComponents()
      const categories = readonlyRegistry.getCategories()

      // 统计分类
      const categoryStats = categories.map(category => ({
        value: category.name,
        label: category.displayName,
        count: readonlyRegistry.getComponentsByCategory(category.name).length,
      }))

      // 统计标签
      const tagMap = new Map<string, number>()
      components.forEach(component => {
        component.tags.forEach(tag => {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
        })
      })

      const tagStats = Array.from(tagMap.entries())
        .map(([value, count]) => ({
          value,
          label: value,
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20) // 只返回前20个常用标签

      return {
        categories: categoryStats,
        tags: tagStats,
      }
    } catch (error) {
      console.error('Failed to get filter options:', error)
      return {
        categories: [],
        tags: [],
      }
    }
  }

  /**
   * 高级搜索
   */
  static async advancedSearch(params: {
    query?: string
    category?: string
    tags?: string[]
    hasProps?: boolean
    sortBy?: 'name' | 'category' | 'updated'
    sortOrder?: 'asc' | 'desc'
    limit?: number
    offset?: number
  }): Promise<{
      components: Component[]
      total: number
      hasMore: boolean
    }> {
    try {
      let components = readonlyRegistry.getComponents()

      // 应用筛选条件
      if (params.category) {
        components = components.filter(comp => comp.category === params.category)
      }

      if (params.tags && params.tags.length > 0) {
        components = components.filter(comp =>
          params.tags!.some(tag => comp.tags.includes(tag))
        )
      }

      if (params.query) {
        const lowerQuery = params.query.toLowerCase()
        components = components.filter(component =>
          component.name.toLowerCase().includes(lowerQuery) ||
          component.displayName.toLowerCase().includes(lowerQuery) ||
          component.description.toLowerCase().includes(lowerQuery)
        )
      }

      // 计算总数
      const total = components.length

      // 排序
      if (params.sortBy) {
        components.sort((a, b) => {
          let comparison = 0
          switch (params.sortBy) {
            case 'name':
              comparison = a.name.localeCompare(b.name)
              break
            case 'category':
              comparison = a.category.localeCompare(b.category)
              break
            case 'updated':
              comparison = (b.updatedAt || 0) - (a.updatedAt || 0)
              break
          }
          return params.sortOrder === 'desc' ? -comparison : comparison
        })
      }

      // 分页
      const limit = params.limit || 20
      const offset = params.offset || 0
      const paginatedComponents = components.slice(offset, offset + limit)

      return {
        components: paginatedComponents,
        total,
        hasMore: offset + limit < total,
      }
    } catch (error) {
      console.error('Failed to perform advanced search:', error)
      return {
        components: [],
        total: 0,
        hasMore: false,
      }
    }
  }
}

// 导出便捷函数
export const searchComponents = SearchClient.searchComponents
export const getSearchSuggestions = SearchClient.getSearchSuggestions
export const getPopularSearches = SearchClient.getPopularSearches
export const getFilterOptions = SearchClient.getFilterOptions
export const advancedSearch = SearchClient.advancedSearch