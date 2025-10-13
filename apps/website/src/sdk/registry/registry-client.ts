/**
 * 注册表客户端 - 处理注册表相关的API调用
 */

import type { RegistryInfo } from '../types'

export class RegistryClient {
  private endpoint: string

  constructor(options?: { endpoint?: string }) {
    this.endpoint = options?.endpoint || '/api/registry'
  }

  /**
   * 获取所有组件类别
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${this.endpoint}/categories`)
      if (!response.ok) return []

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      return []
    }
  }

  /**
   * 获取组件统计信息
   */
  async getStats(componentId: string): Promise<any> {
    try {
      const response = await fetch(`${this.endpoint}/stats/${componentId}`)
      if (!response.ok) return null

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch component stats:', error)
      return null
    }
  }

  /**
   * 获取注册表信息
   */
  async getRegistryInfo(): Promise<RegistryInfo | null> {
    try {
      const response = await fetch(`${this.endpoint}/info`)
      if (!response.ok) return null

      return await response.json()
    } catch (error) {
      console.error('Failed to fetch registry info:', error)
      return null
    }
  }
}