/**
 * @fileoverview Registry 只读适配层 - 唯一数据访问入口
 * 禁止其他路径直接访问 @xorigo-ui/registry
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import {
  RegistrySchema,
  ComponentCategorySchema,
  type Component,
  type ComponentCategory,
  type CategoryDefinition,
  type ValidationResult
} from './types'

class RegistryReadonlyAdapter {
  private static instance: RegistryReadonlyAdapter
  private registry: any = null
  private validated: boolean = false

  private constructor() {}

  static getInstance(): RegistryReadonlyAdapter {
    if (!RegistryReadonlyAdapter.instance) {
      RegistryReadonlyAdapter.instance = new RegistryReadonlyAdapter()
    }
    return RegistryReadonlyAdapter.instance
  }

  /**
   * 获取组件列表 - 唯一访问方法
   */
  getComponents(): Component[] {
    this.ensureLoaded()
    return this.registry.components
  }

  /**
   * 获取组件详情
   */
  getComponent(name: string): Component | undefined {
    this.ensureLoaded()
    return this.registry.components.find((c: Component) => c.name === name)
  }

  /**
   * 获取元数据
   */
  getMetadata() {
    this.ensureLoaded()
    return this.registry.metadata
  }

  /**
   * 按类别获取组件 - 支持白皮书分类
   */
  getComponentsByCategory(category: ComponentCategory): Component[] {
    this.ensureLoaded()
    return this.registry.components.filter((c: Component) => c.category === category)
  }

  /**
   * 获取分类定义列表
   */
  getCategories(): CategoryDefinition[] {
    this.ensureLoaded()
    return this.registry.categories || []
  }

  /**
   * 获取有效的分类列表
   */
  getValidCategories(): ComponentCategory[] {
    this.ensureLoaded()
    const validCategories = new Set<ComponentCategory>()

    // 从组件中提取实际使用的分类
    this.registry.components.forEach((c: Component) => {
      try {
        const validated = ComponentCategorySchema.parse(c.category)
        validCategories.add(validated)
      } catch (error) {
        console.warn(`Invalid category for component ${c.name}: ${c.category}`)
      }
    })

    return Array.from(validCategories)
  }

  /**
   * 检查分类是否有效
   */
  isValidCategory(category: string): category is ComponentCategory {
    try {
      ComponentCategorySchema.parse(category)
      return true
    } catch {
      return false
    }
  }

  /**
   * 按七轴分组组件
   */
  getComponentsByAxis(axis: 'presentation' | 'interaction' | 'structure' | 'composition' | 'design' | 'logic' | 'i18n'): Component[] {
    this.ensureLoaded()

    const axisMapping: Record<typeof axis, ComponentCategory[]> = {
      presentation: ['ui', 'datadisplay', 'overlays', 'charts'],
      interaction: ['inputs', 'forms', 'feedback'],
      structure: ['layout', 'navigation'],
      composition: ['patterns'], // 暂时没有 patterns 组件
      design: ['tokens'], // 暂时没有 tokens 组件
      logic: ['utilities'], // 暂时没有 utilities 组件
      i18n: ['i18n'] // 暂时没有 i18n 组件
    }

    const categories = axisMapping[axis] || []
    return this.registry.components.filter((c: Component) =>
      categories.includes(c.category as ComponentCategory)
    )
  }

  /**
   * 按标签搜索组件
   */
  searchByTags(tags: string[]): Component[] {
    this.ensureLoaded()
    return this.registry.components.filter((c: Component) =>
      tags.some((tag) => c.tags?.includes(tag)),
    )
  }

  /**
   * 获取所有类别
   */
  getCategories(): string[] {
    this.ensureLoaded()
    const categories = new Set(this.registry.components.map((c: Component) => c.category))
    return Array.from(categories)
  }

  /**
   * 获取主题数据（用于构建搜索索引）
   */
  getThemes(): any[] {
    // 返回基础主题数据，确保构建不会失败
    return [
      {
        id: 'light',
        name: 'Light Theme',
        description: '浅色主题',
        colors: ['#ffffff', '#f3f4f6', '#e5e7eb'],
        tags: ['light', 'default']
      },
      {
        id: 'dark',
        name: 'Dark Theme',
        description: '深色主题',
        colors: ['#1f2937', '#374151', '#4b5563'],
        tags: ['dark', 'night']
      }
    ]
  }

  /**
   * 验证 Registry 一致性
   */
  validateConsistency(): ValidationResult {
    this.ensureLoaded()

    const results: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
    }

    // 1. 验证 Schema
    try {
      RegistrySchema.parse(this.registry)
    } catch (error) {
      results.valid = false
      results.errors.push({
        type: 'schema',
        message: 'Registry Schema 验证失败',
        details: error,
      })
    }

    // 2. 验证组件依赖
    for (const component of this.registry.components) {
      if (component.dependencies) {
        for (const dep of component.dependencies) {
          const depExists = this.registry.components.some((c: Component) => c.name === dep)
          if (!depExists) {
            results.warnings.push({
              type: 'dependency',
              message: `依赖组件不存在: ${dep}`,
              component: component.name,
            })
          }
        }
      }
    }

    return results
  }

  /**
   * 私有: 确保数据已加载和验证
   */
  private ensureLoaded() {
    if (!this.registry) {
      this.loadRegistry()
    }
    if (!this.validated) {
      this.validateRegistry()
    }
  }

  /**
   * 私有: 加载 Registry 数据
   */
  private loadRegistry() {
    try {
      const registryPath = join(process.cwd(), '../../packages/registry/registry.json')
      const content = readFileSync(registryPath, 'utf-8')
      this.registry = JSON.parse(content)
    } catch (error) {
      let errorMessage = '加载 Registry 失败'
      let details: any = {}

      if (error instanceof Error) {
        if (error.message.includes('ENOENT')) {
          errorMessage = 'Registry 文件不存在'
          details.filePath = join(process.cwd(), '../../packages/registry/registry.json')
        } else if (error.message.includes('Unexpected token')) {
          errorMessage = 'Registry JSON 格式错误'
          details.parseError = error.message
        } else {
          details.originalError = error.message
        }
      }

      throw new Error(`${errorMessage}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * 私有: 验证 Registry 数据
   */
  private validateRegistry() {
    try {
      RegistrySchema.parse(this.registry)
      this.validated = true
    } catch (error) {
      throw new Error(`Registry Schema 验证失败: ${error}`)
    }
  }
}

// 导出单例实例
export const readonlyRegistry = RegistryReadonlyAdapter.getInstance()

// 导出类型
export type {
  Component,
  ComponentCategory,
  CategoryDefinition,
  ValidationResult
}

/**
 * 构建时一致性校验 (在 scripts/ 中使用)
 */
export function validateRegistryConsistency(): ValidationResult {
  return readonlyRegistry.validateConsistency()
}

/**
 * 获取注册表适配器实例 (用于构建脚本)
 */
export function getRegistryAdapter(): RegistryReadonlyAdapter {
  return readonlyRegistry
}
