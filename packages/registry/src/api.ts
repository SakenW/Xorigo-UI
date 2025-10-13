/**
 * Registry API - 提供组件查询接口
 */

import type { Component, Registry } from './types'

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total?: number
    page?: number
    pageSize?: number
  }
}

export interface QueryOptions {
  category?: string
  search?: string
  tags?: string[]
  page?: number
  pageSize?: number
}

/**
 * Registry API 类
 */
export class RegistryAPI {
  private registry: Registry

  constructor(registry: Registry) {
    this.registry = registry
  }

  /**
   * GET /api/components
   * 获取组件列表
   */
  getComponents(options: QueryOptions = {}): APIResponse<Component[]> {
    try {
      let components = [...this.registry.components]

      // 按分类筛选
      if (options.category) {
        components = components.filter(c => c.category === options.category)
      }

      // 搜索
      if (options.search) {
        const searchLower = options.search.toLowerCase()
        components = components.filter(c =>
          c.name.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower)
        )
      }

      // 按标签筛选（如果未来添加 tags 字段）
      // if (options.tags && options.tags.length > 0) {
      //   components = components.filter(c =>
      //     options.tags!.some(tag => c.tags?.includes(tag))
      //   )
      // }

      // 分页
      const page = options.page || 1
      const pageSize = options.pageSize || 20
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedComponents = components.slice(startIndex, endIndex)

      return {
        success: true,
        data: paginatedComponents,
        meta: {
          total: components.length,
          page,
          pageSize,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * GET /api/components/:name
   * 获取单个组件详情
   */
  getComponent(name: string): APIResponse<Component> {
    try {
      const component = this.registry.components.find(c => c.name === name)

      if (!component) {
        return {
          success: false,
          error: `Component "${name}" not found`,
        }
      }

      return {
        success: true,
        data: component,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * GET /api/components/category/:category
   * 按分类获取组件
   */
  getComponentsByCategory(category: string): APIResponse<Component[]> {
    return this.getComponents({ category })
  }

  /**
   * GET /api/categories
   * 获取所有分类
   */
  getCategories(): APIResponse<{ name: string; count: number }[]> {
    try {
      const categoryCounts = this.registry.components.reduce((acc, component) => {
        acc[component.category] = (acc[component.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const categories = Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count,
      }))

      return {
        success: true,
        data: categories,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * POST /api/search
   * 高级搜索
   */
  search(query: {
    text?: string
    categories?: string[]
    hasAccessibility?: boolean
    hasTheme?: boolean
  }): APIResponse<Component[]> {
    try {
      let components = [...this.registry.components]

      // 文本搜索
      if (query.text) {
        const textLower = query.text.toLowerCase()
        components = components.filter(c =>
          c.name.toLowerCase().includes(textLower) ||
          c.description.toLowerCase().includes(textLower) ||
          c.props.some(p =>
            p.name.toLowerCase().includes(textLower) ||
            p.description?.toLowerCase().includes(textLower)
          )
        )
      }

      // 分类筛选
      if (query.categories && query.categories.length > 0) {
        components = components.filter(c => query.categories!.includes(c.category))
      }

      // 可访问性筛选
      if (query.hasAccessibility !== undefined) {
        components = components.filter(c => {
          const a11y = c.accessibility
          return a11y && (a11y['aria-label'] || a11y['keyboard-navigation'] || a11y['screen-reader'])
        })
      }

      // 主题支持筛选
      if (query.hasTheme !== undefined) {
        components = components.filter(c => c.theme?.supported === query.hasTheme)
      }

      return {
        success: true,
        data: components,
        meta: {
          total: components.length,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * GET /api/stats
   * 获取统计信息
   */
  getStats(): APIResponse<{
    totalComponents: number
    byCategory: Record<string, number>
    withAccessibility: number
    withTheme: number
    avgPropsCount: number
  }> {
    try {
      const totalComponents = this.registry.components.length

      // 按分类统计
      const byCategory = this.registry.components.reduce((acc, component) => {
        acc[component.category] = (acc[component.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // 可访问性统计
      const withAccessibility = this.registry.components.filter(c => {
        const a11y = c.accessibility
        return a11y && (a11y['aria-label'] || a11y['keyboard-navigation'] || a11y['screen-reader'])
      }).length

      // 主题支持统计
      const withTheme = this.registry.components.filter(c => c.theme?.supported).length

      // 平均 Props 数量
      const totalProps = this.registry.components.reduce((sum, c) => sum + c.props.length, 0)
      const avgPropsCount = totalComponents > 0 ? totalProps / totalComponents : 0

      return {
        success: true,
        data: {
          totalComponents,
          byCategory,
          withAccessibility,
          withTheme,
          avgPropsCount: Math.round(avgPropsCount * 10) / 10,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * GET /api/tokens
   * 获取设计令牌
   */
  getTokens(): APIResponse<Registry['tokens']> {
    try {
      return {
        success: true,
        data: this.registry.tokens,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * GET /api/themes
   * 获取主题列表
   */
  getThemes(): APIResponse<Registry['themes']> {
    try {
      return {
        success: true,
        data: this.registry.themes,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

/**
 * 创建 API 实例
 */
export function createAPI(registry: Registry): RegistryAPI {
  return new RegistryAPI(registry)
}

/**
 * Express/HTTP 路由适配器示例
 */
export function createRoutes(api: RegistryAPI) {
  return {
    // GET /api/components
    'GET /api/components': (query: QueryOptions) => api.getComponents(query),

    // GET /api/components/:name
    'GET /api/components/:name': (name: string) => api.getComponent(name),

    // GET /api/components/category/:category
    'GET /api/components/category/:category': (category: string) =>
      api.getComponentsByCategory(category),

    // GET /api/categories
    'GET /api/categories': () => api.getCategories(),

    // POST /api/search
    'POST /api/search': (query: Parameters<typeof api.search>[0]) => api.search(query),

    // GET /api/stats
    'GET /api/stats': () => api.getStats(),

    // GET /api/tokens
    'GET /api/tokens': () => api.getTokens(),

    // GET /api/themes
    'GET /api/themes': () => api.getThemes(),
  }
}
