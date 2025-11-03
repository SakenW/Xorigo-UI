/**
 * Xorigo UI 组件元数据系统
 * 基于 component-taxonomy-v1.5.yaml 的类型定义
 */

export interface ComponentMetadata {
  /** 组件名称 */
  name: string

  /** 所属分类 */
  category: string

  /** 组件层级 */
  level: 'primitive' | 'component' | 'block'

  /** 稳定性 */
  stability: 'stable' | 'beta' | 'labs'

  /** 组件描述 */
  description: string

  /** 标签 */
  tags: string[]

  /** 依赖的其他组件或模块 */
  dependencies: string[]

  /** 支持的变体 */
  variants?: string[]

  /** 支持的尺寸 */
  sizes?: string[]

  /** API 参考 */
  apiReference?: string

  /** 文档链接 */
  documentation?: string

  /** 示例链接 */
  examples?: string[]

  /** 可访问性特性 */
  accessibility?: string[]

  /** 主题支持 */
  themeSupport?: {
    /** 是否支持主题定制 */
    customizable: boolean
    /** 支持的主题维度 */
    dimensions?: string[]
  }

  /** 性能特性 */
  performance?: {
    /** 是否支持虚拟化 */
    virtualizable: boolean
    /** 是否支持懒加载 */
    lazyLoadable: boolean
    /** 是否轻量级 */
    lightweight: boolean
  }

  /** 最后更新时间 */
  lastUpdated: string
}

export interface ComponentRegistry {
  /** 获取组件元数据 */
  getByName(name: string): ComponentMetadata | null

  /** 按分类获取组件 */
  getByCategory(category: string): ComponentMetadata[]

  /** 按稳定性获取组件 */
  getByStability(stability: string): ComponentMetadata[]

  /** 按层级获取组件 */
  getByLevel(level: string): ComponentMetadata[]

  /** 按标签获取组件 */
  getByTag(tag: string): ComponentMetadata[]

  /** 按多个条件搜索组件 */
  search(filters: {
    category?: string
    level?: string
    stability?: string
    tags?: string[]
  }): ComponentMetadata[]

  /** 获取所有分类 */
  getCategories(): string[]

  /** 获取分类描述 */
  getCategoryDescription(category: string): string

  /** 注册新组件 */
  register(metadata: ComponentMetadata): void

  /** 更新组件元数据 */
  update(name: string, metadata: Partial<ComponentMetadata>): void

  /** 移除组件 */
  remove(name: string): boolean

  /** 获取所有组件 */
  getAll(): ComponentMetadata[]
}

export interface ComponentQuery {
  /** 分类过滤 */
  category?: string | string[]

  /** 层级过滤 */
  level?: string | string[]

  /** 稳定性过滤 */
  stability?: string | string[]

  /** 标签过滤 */
  tags?: string[]

  /** 搜索关键词 */
  search?: string

  /** 排序方式 */
  sortBy?: 'name' | 'category' | 'level' | 'stability' | 'lastUpdated'

  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'

  /** 分页 */
  page?: number
  limit?: number
}

export interface ComponentSearchResult {
  /** 匹配的组件 */
  components: ComponentMetadata[]

  /** 总数 */
  total: number

  /** 当前页 */
  page: number

  /** 每页数量 */
  limit: number

  /** 总页数 */
  totalPages: number
}

/**
 * 组件元数据验证器
 */
export interface ComponentMetadataValidator {
  /** 验证元数据格式 */
  validate(metadata: ComponentMetadata): ValidationResult

  /** 验证分类是否存在 */
  validateCategory(category: string): boolean

  /** 验证层级是否正确 */
  validateLevel(category: string, level: string): boolean

  /** 验证稳定性是否合适 */
  validateStability(category: string, stability: string): boolean

  /** 获取验证错误 */
  getErrors(metadata: ComponentMetadata): string[]
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * 分类描述接口
 */
export interface CategoryDescription {
  /** 分类 ID */
  id: string

  /** 分类标题 */
  title: string

  /** 分类描述 */
  description: string

  /** 所属层级 */
  layer: 'system' | 'component' | 'composition'

  /** 组件层级 */
  level?: 'primitive' | 'system'

  /** 典型组件示例 */
  examples: string[]

  /** 使用指南 */
  guidelines: string[]

  /** 相关分类 */
  relatedCategories: string[]
}

/**
 * 组件生成配置
 */
export interface ComponentGenerationConfig {
  /** 组件名称 */
  name: string

  /** 目标分类 */
  category: string

  /** 稳定性级别 */
  stability: 'stable' | 'beta' | 'labs'

  /** 组件层级 */
  level: 'primitive' | 'component' | 'block'

  /** 功能特性 */
  features: string[]

  /** 自定义选项 */
  options: {
    /** 包含测试文件 */
    includeTests: boolean

    /** 包含 Storybook 故事 */
    includeStories: boolean

    /** 包含 TypeScript 严格类型 */
    strictTypes: boolean

    /** 包含可访问性特性 */
    includeAccessibility: boolean

    /** 包含动画支持 */
    includeMotion: boolean

    /** 包含主题定制 */
    includeTheming: boolean
  }
}

/**
 * 导出类型
 */
export type {
  ComponentMetadata as default,
  ComponentRegistry,
  ComponentQuery,
  ComponentSearchResult,
  ComponentMetadataValidator,
  ValidationResult,
  CategoryDescription,
  ComponentGenerationConfig
}