/**
 * 高级搜索引擎
 * 提供复杂的过滤、排序和分面搜索功能
 */

import type {
  FilterGroup,
  FilterOption,
  ActiveFilter,
  SearchFiltersState,
  ComponentMetrics,
  AdvancedSearchQuery,
  FilterSearchResult
} from './types'
import type { ComponentInfo } from '../../../../../data/component-classification'

/**
 * 高级过滤器引擎
 */
export class AdvancedFilterEngine {
  private components: ComponentInfo[] = []
  private componentMetrics: Map<string, ComponentMetrics> = new Map()

  constructor() {
    this.initializeMetrics()
  }

  /**
   * 设置组件数据
   */
  setComponents(components: ComponentInfo[]): void {
    this.components = components
    this.updateMetrics()
  }

  /**
   * 初始化组件指标
   */
  private initializeMetrics(): void {
    // 模拟组件指标数据，实际应该从分析服务获取
    const mockMetrics: Record<string, ComponentMetrics> = {
      'Button': { complexity: 'simple', popularity: 95, usageFrequency: 1500, lastUpdated: new Date(), communityRating: 4.8 },
      'Card': { complexity: 'moderate', popularity: 88, usageFrequency: 1200, lastUpdated: new Date(), communityRating: 4.6 },
      'Modal': { complexity: 'complex', popularity: 92, usageFrequency: 800, lastUpdated: new Date(), communityRating: 4.7 },
      'DataTable': { complexity: 'complex', popularity: 75, usageFrequency: 600, lastUpdated: new Date(), communityRating: 4.4 },
      'Input': { complexity: 'simple', popularity: 98, usageFrequency: 2000, lastUpdated: new Date(), communityRating: 4.9 },
      'Tabs': { complexity: 'moderate', popularity: 85, usageFrequency: 900, lastUpdated: new Date(), communityRating: 4.5 },
      'Alert': { complexity: 'simple', popularity: 80, usageFrequency: 700, lastUpdated: new Date(), communityRating: 4.3 },
      'Carousel': { complexity: 'complex', popularity: 70, usageFrequency: 400, lastUpdated: new Date(), communityRating: 4.2 },
    }

    this.componentMetrics = new Map(Object.entries(mockMetrics))
  }

  /**
   * 更新组件指标
   */
  private updateMetrics(): void {
    // 为新组件生成默认指标
    this.components.forEach(component => {
      if (!this.componentMetrics.has(component.name)) {
        const complexity = this.calculateComplexity(component)
        const popularity = Math.floor(Math.random() * 40) + 60 // 60-100
        const usageFrequency = Math.floor(Math.random() * 1500) + 200 // 200-1700
        const communityRating = (Math.random() * 2 + 3).toFixed(1) // 3.0-5.0

        this.componentMetrics.set(component.name, {
          complexity,
          popularity,
          usageFrequency,
          lastUpdated: new Date(),
          communityRating: parseFloat(communityRating)
        })
      }
    })
  }

  /**
   * 计算组件复杂度
   */
  private calculateComplexity(component: ComponentInfo): 'simple' | 'moderate' | 'complex' {
    let score = 0

    // 基于props数量
    if (component.props) score += component.props.length * 2

    // 基于variants数量
    if (component.variants) score += component.variants.length * 3

    // 基于描述长度（复杂组件通常有更长的描述）
    score += component.description.length / 50

    if (score <= 10) return 'simple'
    if (score <= 20) return 'moderate'
    return 'complex'
  }

  /**
   * 生成可用的过滤器
   */
  generateAvailableFilters(): FilterGroup[] {
    const categories = [...new Set(this.components.map(c => c.category))]
    const allVariants = [...new Set(this.components.flatMap(c => c.variants || []))]
    const allProps = [...new Set(this.components.flatMap(c => c.props || []))]
    const complexities = ['simple', 'moderate', 'complex']

    return [
      {
        id: 'category',
        name: '组件分类',
        type: 'checkbox',
        icon: '📁',
        description: '按组件功能分类筛选',
        options: categories.map(cat => ({
          value: cat,
          label: this.getCategoryDisplayName(cat),
          count: this.components.filter(c => c.category === cat).length
        }))
      },
      {
        id: 'variant',
        name: '组件变体',
        type: 'checkbox',
        icon: '🎨',
        description: '按可用的样式变体筛选',
        options: allVariants.map(variant => ({
          value: variant,
          label: variant,
          count: this.components.filter(c => c.variants?.includes(variant)).length
        }))
      },
      {
        id: 'props',
        name: '组件属性',
        type: 'checkbox',
        icon: '⚙️',
        description: '按支持的属性筛选',
        options: allProps.slice(0, 20).map(prop => ({ // 限制显示数量
          value: prop,
          label: prop,
          count: this.components.filter(c => c.props?.includes(prop)).length
        }))
      },
      {
        id: 'complexity',
        name: '复杂度',
        type: 'radio',
        icon: '📊',
        description: '按组件复杂度筛选',
        options: complexities.map(level => ({
          value: level,
          label: this.getComplexityDisplayName(level),
          count: Array.from(this.componentMetrics.values()).filter(m => m.complexity === level).length
        }))
      },
      {
        id: 'popularity',
        name: '流行度',
        type: 'range',
        icon: '🔥',
        description: '按组件流行度范围筛选',
        options: [
          { value: '80-100', label: '热门 (80-100)', description: '最受欢迎的组件' },
          { value: '60-80', label: '常用 (60-80)', description: '经常使用的组件' },
          { value: '40-60', label: '一般 (40-60)', description: '使用一般的组件' },
          { value: '0-40', label: '冷门 (0-40)', description: '较少使用的组件' }
        ]
      }
    ]
  }

  /**
   * 获取分类显示名称
   */
  private getCategoryDisplayName(category: string): string {
    const names: Record<string, string> = {
      'base': 'Base 基础组件',
      'layout': 'Layout 布局组件',
      'navigation': 'Navigation 导航组件',
      'form': 'Form 表单组件',
      'data-display': 'Data Display 数据展示',
      'feedback': 'Feedback 反馈组件',
      'overlay': 'Overlay 弹层组件',
      'composite': 'Composite 复合组件',
      'system': 'System 系统组件',
      'visualization': 'Visualization 可视化组件'
    }
    return names[category] || category
  }

  /**
   * 获取复杂度显示名称
   */
  private getComplexityDisplayName(complexity: string): string {
    const names: Record<string, string> = {
      'simple': '简单 - 易于使用和理解',
      'moderate': '中等 - 有一定的学习成本',
      'complex': '复杂 - 功能丰富但需要深入理解'
    }
    return names[complexity] || complexity
  }

  /**
   * 执行高级搜索
   */
  async search(query: AdvancedSearchQuery): Promise<FilterSearchResult> {
    const startTime = performance.now()

    let filteredComponents = this.components

    // 应用文本搜索
    if (query.text.trim()) {
      filteredComponents = this.textSearch(filteredComponents, query.text)
    }

    // 应用过滤器
    query.filters.forEach(filter => {
      filteredComponents = this.applyFilter(filteredComponents, filter)
    })

    // 计算匹配分数
    const scoredComponents = filteredComponents.map(component => {
      const score = this.calculateScore(component, query)
      const matchReasons = this.generateMatchReasons(component, query)
      const relatedComponents = this.findRelatedComponents(component, filteredComponents)

      return {
        component,
        score,
        matchReasons,
        relatedComponents
      }
    })

    // 排序
    scoredComponents.sort((a, b) => {
      const direction = query.sortOrder === 'desc' ? -1 : 1

      switch (query.sortBy) {
        case 'relevance':
          return (b.score - a.score) * direction
        case 'name':
          return a.component.name.localeCompare(b.component.name) * direction
        case 'category':
          return a.component.category.localeCompare(b.component.category) * direction
        case 'popularity':
          const aPopularity = this.componentMetrics.get(a.component.name)?.popularity || 0
          const bPopularity = this.componentMetrics.get(b.component.name)?.popularity || 0
          return (bPopularity - aPopularity) * direction
        default:
          return (b.score - a.score) * direction
      }
    })

    // 分页
    const limit = query.limit || 50
    const offset = query.offset || 0
    const paginatedResults = scoredComponents.slice(offset, offset + limit)

    // 生成分面数据
    const facets = this.generateFacets(filteredComponents)

    // 生成建议
    const suggestions = this.generateSuggestions(query, filteredComponents)

    const endTime = performance.now()
    const searchTime = endTime - startTime

    return {
      components: paginatedResults,
      total: filteredComponents.length,
      facets,
      suggestions,
      searchTime,
      appliedFilters: query.filters
    }
  }

  /**
   * 文本搜索
   */
  private textSearch(components: ComponentInfo[], text: string): ComponentInfo[] {
    const query = text.toLowerCase()
    return components.filter(component => {
      const name = component.name.toLowerCase()
      const description = component.description.toLowerCase()
      const category = component.category.toLowerCase()

      // 精确匹配优先
      if (name === query) return true

      // 包含匹配
      if (name.includes(query) || description.includes(query) || category.includes(query)) {
        return true
      }

      // 拼音匹配（简化版）
      return this.pinyinMatch(name, query)
    })
  }

  /**
   * 简单拼音匹配
   */
  private pinyinMatch(text: string, query: string): boolean {
    // 这里可以实现更复杂的拼音匹配逻辑
    // 现在只做基本的英文匹配
    return text.toLowerCase().includes(query.toLowerCase())
  }

  /**
   * 应用过滤器
   */
  private applyFilter(components: ComponentInfo[], filter: ActiveFilter): ComponentInfo[] {
    return components.filter(component => {
      switch (filter.groupId) {
        case 'category':
          return Array.isArray(filter.value)
            ? filter.value.includes(component.category)
            : component.category === filter.value

        case 'variant':
          if (!component.variants) return false
          return Array.isArray(filter.value)
            ? filter.value.some(v => component.variants!.includes(v))
            : component.variants.includes(filter.value as string)

        case 'props':
          if (!component.props) return false
          return Array.isArray(filter.value)
            ? filter.value.some(p => component.props!.includes(p))
            : component.props.includes(filter.value as string)

        case 'complexity':
          const metrics = this.componentMetrics.get(component.name)
          return metrics?.complexity === filter.value

        case 'popularity':
          const popularity = this.componentMetrics.get(component.name)?.popularity || 0
          const [min, max] = (filter.value as string).split('-').map(Number)
          return popularity >= min && popularity <= max

        default:
          return true
      }
    })
  }

  /**
   * 计算匹配分数
   */
  private calculateScore(component: ComponentInfo, query: AdvancedSearchQuery): number {
    let score = 0
    const text = query.text.toLowerCase()

    // 文本匹配分数
    if (text) {
      if (component.name.toLowerCase() === text) score += 100
      else if (component.name.toLowerCase().includes(text)) score += 80
      else if (component.description.toLowerCase().includes(text)) score += 60
      else if (component.category.toLowerCase().includes(text)) score += 40
    }

    // 过滤器匹配分数
    query.filters.forEach(filter => {
      if (this.applyFilter([component], filter).length > 0) {
        score += 20
      }
    })

    // 流行度加成
    const popularity = this.componentMetrics.get(component.name)?.popularity || 0
    score += popularity * 0.1

    return Math.min(100, score)
  }

  /**
   * 生成匹配原因
   */
  private generateMatchReasons(component: ComponentInfo, query: AdvancedSearchQuery): string[] {
    const reasons: string[] = []
    const text = query.text.toLowerCase()

    if (text) {
      if (component.name.toLowerCase() === text) {
        reasons.push('精确匹配组件名称')
      } else if (component.name.toLowerCase().includes(text)) {
        reasons.push('组件名称匹配')
      }
      if (component.description.toLowerCase().includes(text)) {
        reasons.push('描述内容匹配')
      }
    }

    query.filters.forEach(filter => {
      if (this.applyFilter([component], filter).length > 0) {
        const filterGroup = this.generateAvailableFilters().find(g => g.id === filter.groupId)
        if (filterGroup) {
          reasons.push(`符合${filterGroup.name}过滤条件`)
        }
      }
    })

    return reasons
  }

  /**
   * 查找相关组件
   */
  private findRelatedComponents(component: ComponentInfo, allComponents: ComponentInfo[]): string[] {
    return allComponents
      .filter(c =>
        c.name !== component.name &&
        (c.category === component.category ||
         c.props?.some(p => component.props?.includes(p)))
      )
      .slice(0, 5)
      .map(c => c.name)
  }

  /**
   * 生成分面数据
   */
  private generateFacets(components: ComponentInfo[]): Record<string, FilterOption[]> {
    const facets: Record<string, FilterOption[]> = {}

    // 分类分面
    facets.category = this.generateFacetOptions(
      components,
      c => c.category,
      this.getCategoryDisplayName
    )

    // 变体分面
    const allVariants = [...new Set(components.flatMap(c => c.variants || []))]
    facets.variant = allVariants.map(variant => ({
      value: variant,
      label: variant,
      count: components.filter(c => c.variants?.includes(variant)).length
    }))

    // 复杂度分面
    facets.complexity = ['simple', 'moderate', 'complex'].map(level => ({
      value: level,
      label: this.getComplexityDisplayName(level),
      count: components.filter(c => {
        const metrics = this.componentMetrics.get(c.name)
        return metrics?.complexity === level
      }).length
    }))

    return facets
  }

  /**
   * 生成分面选项
   */
  private generateFacetOptions(
    components: ComponentInfo[],
    getValue: (c: ComponentInfo) => string,
    getLabel: (value: string) => string
  ): FilterOption[] {
    const groups = components.reduce((acc, component) => {
      const value = getValue(component)
      if (!acc[value]) acc[value] = []
      acc[value].push(component)
      return acc
    }, {} as Record<string, ComponentInfo[]>)

    return Object.entries(groups).map(([value, items]) => ({
      value,
      label: getLabel(value),
      count: items.length
    }))
  }

  /**
   * 生成搜索建议
   */
  private generateSuggestions(query: AdvancedSearchQuery, results: ComponentInfo[]): string[] {
    const suggestions: string[] = []

    // 基于搜索词的建议
    if (query.text && results.length === 0) {
      suggestions.push('尝试使用更通用的关键词')
      suggestions.push('检查拼写是否正确')
    }

    // 基于过滤器的建议
    if (query.filters.length > 0 && results.length < 5) {
      suggestions.push('尝试减少过滤条件')
      suggestions.push('使用 OR 逻辑放宽匹配要求')
    }

    // 热门组件建议
    const popularComponents = Array.from(this.componentMetrics.entries())
      .sort(([, a], [, b]) => b.popularity - a.popularity)
      .slice(0, 5)
      .map(([name]) => name)

    suggestions.push(`热门组件: ${popularComponents.join(', ')}`)

    return suggestions
  }

  /**
   * 获取组件指标
   */
  getComponentMetrics(componentName: string): ComponentMetrics | undefined {
    return this.componentMetrics.get(componentName)
  }

  /**
   * 更新组件指标
   */
  updateComponentMetrics(componentName: string, metrics: Partial<ComponentMetrics>): void {
    const existing = this.componentMetrics.get(componentName)
    if (existing) {
      this.componentMetrics.set(componentName, { ...existing, ...metrics })
    }
  }
}

/**
 * 创建高级过滤器引擎实例
 */
export function createAdvancedFilterEngine(): AdvancedFilterEngine {
  return new AdvancedFilterEngine()
}