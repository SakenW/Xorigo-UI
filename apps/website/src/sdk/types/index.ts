/**
 * SDK类型定义
 */

export interface ComponentInfo {
  id: string
  name: string
  category: string
  description: string
  props: Record<string, any>
  examples: ComponentExample[]
  tags: string[]
  version: string
}

export interface ComponentExample {
  name: string
  code: string
  description?: string
}

export interface ComponentQuery {
  id?: string
  name?: string
  category?: string
}

export interface SearchFilters {
  category?: string
  tags?: string[]
  query?: string
  limit?: number
  offset?: number
}

export interface RegistryInfo {
  version: string
  components: number
  categories: string[]
  lastUpdated: string
}