// SDK Layer - 客户端协议层
// 负责处理 RSC 和 Client Component 之间的数据交互

export * from './docs-client'
export * from './playground-client'
export * from './search-client'

// 保留原有的 XorigoUIClient 以兼容现有代码
import { ComponentClient } from './core/component-client'
import { RegistryClient } from './registry/registry-client'
import type { ComponentInfo, ComponentQuery, SearchFilters } from './types'

export class XorigoUIClient {
  private componentClient: ComponentClient
  private registryClient: RegistryClient

  constructor(options?: { endpoint?: string }) {
    this.componentClient = new ComponentClient(options)
    this.registryClient = new RegistryClient(options)
  }

  /**
   * 查询组件信息
   */
  async getComponent(query: ComponentQuery): Promise<ComponentInfo | null> {
    return this.componentClient.get(query)
  }

  /**
   * 搜索组件
   */
  async searchComponents(filters: SearchFilters): Promise<ComponentInfo[]> {
    return this.componentClient.search(filters)
  }

  /**
   * 获取所有组件类别
   */
  async getCategories(): Promise<string[]> {
    return this.registryClient.getCategories()
  }

  /**
   * 获取组件使用统计
   */
  async getComponentStats(componentId: string): Promise<any> {
    return this.registryClient.getStats(componentId)
  }
}

export * from './types'