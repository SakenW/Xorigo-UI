/**
 * 组件客户端 - 处理组件相关的API调用
 */

import type { ComponentInfo, ComponentQuery, SearchFilters } from '../types'

export class ComponentClient {
  private endpoint: string

  constructor(options?: { endpoint?: string }) {
    this.endpoint = options?.endpoint || '/api/components'
  }

  /**
   * 获取单个组件信息
   */
  async get(query: ComponentQuery): Promise<ComponentInfo | null> {
    try {
      const params = new URLSearchParams()
      if (query.id) params.append('id', query.id)
      if (query.name) params.append('name', query.name)
      if (query.category) params.append('category', query.category)

      const response = await fetch(`${this.endpoint}?${params.toString()}`)
      if (!response.ok) return null

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch component:', error)
      return null
    }
  }

  /**
   * 搜索组件
   */
  async search(filters: SearchFilters): Promise<ComponentInfo[]> {
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.query) params.append('query', filters.query)
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.offset) params.append('offset', filters.offset.toString())
      if (filters.tags?.length) params.append('tags', filters.tags.join(','))

      const response = await fetch(`${this.endpoint}/search?${params.toString()}`)
      if (!response.ok) return []

      return await response.json()
    } catch (error) {
      console.error('Failed to search components:', error)
      return []
    }
  }
}