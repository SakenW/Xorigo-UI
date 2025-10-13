'use client'

import { readonlyRegistry } from '@/data/registry.readonly'
import type { Component, ComponentCategory } from '@/data/types'

/**
 * Docs Client - 文档系统客户端
 * 负责处理文档相关的数据获取和处理
 */
export class DocsClient {
  /**
   * 获取组件文档
   */
  static async getComponentDocs(category?: string): Promise<{
    components: Component[]
    category?: ComponentCategory
  }> {
    try {
      const components = category
        ? readonlyRegistry.getComponentsByCategory(category)
        : readonlyRegistry.getComponents()

      let categoryData = undefined
      if (category) {
        const categories = readonlyRegistry.getCategories()
        categoryData = categories.find(c => c.name === category)
      }

      return {
        components,
        category: categoryData,
      }
    } catch (error) {
      console.error('Failed to get component docs:', error)
      return {
        components: [],
        category: undefined,
      }
    }
  }

  /**
   * 获取分类列表
   */
  static async getCategories(): Promise<ComponentCategory[]> {
    try {
      return readonlyRegistry.getCategories()
    } catch (error) {
      console.error('Failed to get categories:', error)
      return []
    }
  }

  /**
   * 搜索组件
   */
  static async searchComponents(query: string): Promise<Component[]> {
    try {
      const allComponents = readonlyRegistry.getComponents()

      if (!query.trim()) {
        return allComponents
      }

      const lowerQuery = query.toLowerCase()
      return allComponents.filter(component =>
        component.name.toLowerCase().includes(lowerQuery) ||
        component.displayName.toLowerCase().includes(lowerQuery) ||
        component.description.toLowerCase().includes(lowerQuery) ||
        component.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    } catch (error) {
      console.error('Failed to search components:', error)
      return []
    }
  }

  /**
   * 获取组件统计信息
   */
  static async getStats(): Promise<{
    totalComponents: number
    totalCategories: number
    categoryStats: Record<string, number>
  }> {
    try {
      const components = readonlyRegistry.getComponents()
      const categories = readonlyRegistry.getCategories()

      const categoryStats: Record<string, number> = {}
      categories.forEach(category => {
        categoryStats[category.name] = readonlyRegistry.getComponentsByCategory(category.name).length
      })

      return {
        totalComponents: components.length,
        totalCategories: categories.length,
        categoryStats,
      }
    } catch (error) {
      console.error('Failed to get stats:', error)
      return {
        totalComponents: 0,
        totalCategories: 0,
        categoryStats: {},
      }
    }
  }
}

// 导出便捷函数
export const getComponentDocs = DocsClient.getComponentDocs
export const getCategories = DocsClient.getCategories
export const searchComponents = DocsClient.searchComponents
export const getDocsStats = DocsClient.getStats