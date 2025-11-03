/**
 * Xorigo UI 组件注册表实现
 * 基于 component-taxonomy-v1.5.yaml 的组件管理
 */

import type {
  ComponentMetadata,
  ComponentRegistry,
  ComponentQuery,
  ComponentSearchResult,
  CategoryDescription
} from '../types/component-metadata'

/**
 * 组件注册表实现
 */
class ComponentRegistryImpl implements ComponentRegistry {
  private components: Map<string, ComponentMetadata> = new Map()
  private categoryDescriptions: Map<string, CategoryDescription> = new Map()

  constructor() {
    this.initializeCategoryDescriptions()
  }

  /**
   * 获取组件元数据
   */
  getByName(name: string): ComponentMetadata | null {
    return this.components.get(name) || null
  }

  /**
   * 按分类获取组件
   */
  getByCategory(category: string): ComponentMetadata[] {
    return Array.from(this.components.values()).filter(
      component => component.category === category
    )
  }

  /**
   * 按稳定性获取组件
   */
  getByStability(stability: string): ComponentMetadata[] {
    return Array.from(this.components.values()).filter(
      component => component.stability === stability
    )
  }

  /**
   * 按层级获取组件
   */
  getByLevel(level: string): ComponentMetadata[] {
    return Array.from(this.components.values()).filter(
      component => component.level === level
    )
  }

  /**
   * 按标签获取组件
   */
  getByTag(tag: string): ComponentMetadata[] {
    return Array.from(this.components.values()).filter(
      component => component.tags.includes(tag)
    )
  }

  /**
   * 按多个条件搜索组件
   */
  search(filters: ComponentQuery): ComponentMetadata[] {
    let results = Array.from(this.components.values())

    // 分类过滤
    if (filters.category) {
      const categories = Array.isArray(filters.category)
        ? filters.category
        : [filters.category]
      results = results.filter(comp => categories.includes(comp.category))
    }

    // 层级过滤
    if (filters.level) {
      const levels = Array.isArray(filters.level)
        ? filters.level
        : [filters.level]
      results = results.filter(comp => levels.includes(comp.level))
    }

    // 稳定性过滤
    if (filters.stability) {
      const stabilities = Array.isArray(filters.stability)
        ? filters.stability
        : [filters.stability]
      results = results.filter(comp => stabilities.includes(comp.stability))
    }

    // 标签过滤
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(comp =>
        filters.tags!.some(tag => comp.tags.includes(tag))
      )
    }

    // 搜索关键词
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      results = results.filter(comp =>
        comp.name.toLowerCase().includes(searchTerm) ||
        comp.description.toLowerCase().includes(searchTerm) ||
        comp.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // 排序
    const sortBy = filters.sortBy || 'name'
    const sortOrder = filters.sortOrder || 'asc'

    results.sort((a, b) => {
      let aValue: string | number = a[sortBy as keyof ComponentMetadata] as string | number
      let bValue: string | number = b[sortBy as keyof ComponentMetadata] as string | number

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })

    // 分页
    if (filters.page && filters.limit) {
      const start = (filters.page - 1) * filters.limit
      const end = start + filters.limit
      results = results.slice(start, end)
    }

    return results
  }

  /**
   * 获取所有分类
   */
  getCategories(): string[] {
    return Array.from(new Set(
      Array.from(this.components.values()).map(comp => comp.category)
    )).sort()
  }

  /**
   * 获取分类描述
   */
  getCategoryDescription(category: string): string {
    const desc = this.categoryDescriptions.get(category)
    return desc?.description || ''
  }

  /**
   * 注册新组件
   */
  register(metadata: ComponentMetadata): void {
    this.components.set(metadata.name, metadata)
  }

  /**
   * 更新组件元数据
   */
  update(name: string, metadata: Partial<ComponentMetadata>): void {
    const existing = this.components.get(name)
    if (existing) {
      this.components.set(name, { ...existing, ...metadata, lastUpdated: new Date().toISOString() })
    }
  }

  /**
   * 移除组件
   */
  remove(name: string): boolean {
    return this.components.delete(name)
  }

  /**
   * 获取所有组件
   */
  getAll(): ComponentMetadata[] {
    return Array.from(this.components.values())
  }

  /**
   * 初始化分类描述
   */
  private initializeCategoryDescriptions(): void {
    // System Layer
    this.categoryDescriptions.set('foundations', {
      id: 'foundations',
      title: 'Foundations · 设计基础',
      description: '静态设计令牌与基础样式，只放常量/tokens，不放组件',
      layer: 'system',
      level: 'primitive',
      examples: ['color-system', 'typography-system', 'spacing-system'],
      guidelines: ['不包含运行时状态', '提供中性的设计基础', '遵循DTCG设计令牌标准'],
      relatedCategories: ['system', 'primitives']
    })

    this.categoryDescriptions.set('system', {
      id: 'system',
      title: 'System · 系统能力',
      description: '跨组件机制，支撑所有组件，不直接给UI',
      layer: 'system',
      level: 'system',
      examples: ['theming-engine', 'breakpoints-responsive', 'accessibility-system'],
      guidelines: ['提供系统能力', '支撑所有组件', '不直接渲染UI'],
      relatedCategories: ['foundations', 'primitives']
    })

    this.categoryDescriptions.set('primitives', {
      id: 'primitives',
      title: 'Primitives · 原子级组件',
      description: '少而精，高复用、跨大量组件的「砖」',
      layer: 'system',
      level: 'primitive',
      examples: ['box', 'surface', 'flex', 'stack', 'grid', 'text'],
      guidelines: ['高复用性', '原子化设计', '无样式优先'],
      relatedCategories: ['foundations', 'system']
    })

    // Component Layer
    this.categoryDescriptions.set('layout', {
      id: 'layout',
      title: 'Layout · 布局',
      description: '页面级布局和容器组件',
      layer: 'component',
      examples: ['container', 'simple-grid', 'split-view', 'app-layout'],
      guidelines: ['空间分配', '响应式布局', '结构清晰'],
      relatedCategories: ['navigation', 'utilities']
    })

    this.categoryDescriptions.set('navigation', {
      id: 'navigation',
      title: 'Navigation · 导航',
      description: '页面导航和路由相关组件',
      layer: 'component',
      examples: ['navbar', 'sidebar', 'tabs', 'breadcrumb', 'pagination'],
      guidelines: ['清晰的导航结构', '可访问性支持', '响应式设计'],
      relatedCategories: ['layout', 'overlays']
    })

    this.categoryDescriptions.set('inputs', {
      id: 'inputs',
      title: 'Inputs & Controls · 输入与控制',
      description: '能改变状态或提交数据的可交互控件本体',
      layer: 'component',
      examples: ['button', 'input', 'select', 'checkbox', 'switch'],
      guidelines: ['交互性优先', '状态管理', '表单集成'],
      relatedCategories: ['forms', 'feedback']
    })

    this.categoryDescriptions.set('forms', {
      id: 'forms',
      title: 'Forms · 表单结构与校验',
      description: '表单数据管理、校验逻辑、多步表单',
      layer: 'component',
      examples: ['form', 'form-field', 'validation-summary', 'rhf-adapter'],
      guidelines: ['结构化表单', '校验集成', '错误处理'],
      relatedCategories: ['inputs', 'feedback']
    })

    this.categoryDescriptions.set('data-display', {
      id: 'data-display',
      title: 'Data Display · 数据展示',
      description: '不改变数据，只负责「展示当前状态」',
      layer: 'component',
      examples: ['card', 'table', 'list', 'avatar', 'timeline'],
      guidelines: ['只读展示', '响应式设计', '可访问性'],
      relatedCategories: ['typography-media', 'charts']
    })

    this.categoryDescriptions.set('typography-media', {
      id: 'typography-media',
      title: 'Typography & Media · 文本与媒体',
      description: '文本内容和媒体展示组件',
      layer: 'component',
      examples: ['text', 'heading', 'code', 'image', 'video'],
      guidelines: ['内容展示', '语义化标记', '媒体适配'],
      relatedCategories: ['data-display']
    })

    this.categoryDescriptions.set('charts', {
      id: 'charts',
      title: 'Charts · 图表（可视化）',
      description: '数据可视化图表组件',
      layer: 'component',
      examples: ['line-chart', 'bar-chart', 'pie-chart', 'heatmap'],
      guidelines: ['数据可视化', '交互性图表', '响应式设计'],
      relatedCategories: ['data-display']
    })

    this.categoryDescriptions.set('feedback', {
      id: 'feedback',
      title: 'Feedback & Status · 反馈与状态',
      description: '所有 Loading 统统归这里，统一视为「状态反馈」',
      layer: 'component',
      examples: ['alert', 'toast', 'notification', 'skeleton', 'progress'],
      guidelines: ['及时反馈', '状态明确', '用户友好'],
      relatedCategories: ['inputs', 'forms', 'overlays']
    })

    this.categoryDescriptions.set('overlays', {
      id: 'overlays',
      title: 'Overlays · 浮层',
      description: '覆盖当前内容、打断或补充当前流程',
      layer: 'component',
      examples: ['modal', 'dialog', 'drawer', 'popover', 'tooltip'],
      guidelines: ['焦点管理', '可访问性', '层级控制'],
      relatedCategories: ['navigation', 'feedback']
    })

    this.categoryDescriptions.set('interactive', {
      id: 'interactive',
      title: 'Interactive · 高阶交互',
      description: '复杂交互模式，不放简单按钮、开关',
      layer: 'component',
      examples: ['draggable', 'sortable-list', 'virtual-list', 'carousel'],
      guidelines: ['复杂交互', '性能优化', '用户体验'],
      relatedCategories: ['utilities', 'feedback']
    })

    this.categoryDescriptions.set('utilities', {
      id: 'utilities',
      title: 'Utilities · 工具性组件',
      description: '辅助其他组件工作，功能上不直接归某一大类',
      layer: 'component',
      examples: ['transition', 'responsive', 'error-boundary', 'click-away-listener'],
      guidelines: ['辅助功能', '开发工具', '跨组件支持'],
      relatedCategories: ['interactive', 'layout']
    })

    // Composition Layer
    this.categoryDescriptions.set('blocks', {
      id: 'blocks',
      title: 'Blocks · 组合区块',
      description: '通用场景的拼装块，不写死具体业务/品牌',
      layer: 'composition',
      examples: ['hero-section', 'feature-section', 'pricing-section', 'auth-card'],
      guidelines: ['场景化组合', '业务无关', '高复用性'],
      relatedCategories: ['templates']
    })

    this.categoryDescriptions.set('templates', {
      id: 'templates',
      title: 'Templates · 页面模板',
      description: '页面级骨架结构，只在设计文档/示例项目中存在',
      layer: 'composition',
      examples: ['auth-page-template', 'landing-page-template', 'dashboard-template'],
      guidelines: ['页面级结构', '模板化设计', '开发指导'],
      relatedCategories: ['blocks']
    })

    this.categoryDescriptions.set('labs', {
      id: 'labs',
      title: 'Labs · 实验组件',
      description: '稳定性维度的实验组件，同时在对应分类和Labs专区展示',
      layer: 'composition',
      examples: ['new-date-range-picker', 'guided-tour', 'ai-chat'],
      guidelines: ['实验性功能', 'API可能变化', '创新探索'],
      relatedCategories: []
    })
  }
}

// 创建全局组件注册表实例
export const componentRegistry = new ComponentRegistryImpl()

/**
 * 便捷的查询函数
 */
export const getComponentMetadata = (name: string): ComponentMetadata | null => {
  return componentRegistry.getByName(name)
}

export const getComponentsByCategory = (category: string): ComponentMetadata[] => {
  return componentRegistry.getByCategory(category)
}

export const getComponentsByStability = (stability: string): ComponentMetadata[] => {
  return componentRegistry.getByStability(stability)
}

export const searchComponents = (query: ComponentQuery): ComponentMetadata[] => {
  return componentRegistry.search(query)
}

export const getAllCategories = (): string[] => {
  return componentRegistry.getCategories()
}

export default componentRegistry