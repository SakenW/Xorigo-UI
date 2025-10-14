/**
 * 🗄️ Website 数据层类型定义
 *
 * 四层架构 - 数据层类型定义
 * 提供类型安全的数据访问接口
 *
 * @author Hive Mind Coder Agent
 * @version 2.0.0
 */

import { z } from 'zod'

// ============================================================================
// 基础类型定义 (Base Type Definitions)
// ============================================================================

/**
 * 基础 API 响应类型
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

/**
 * 分页参数类型
 */
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 分页响应类型
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// ============================================================================
// Registry 相关类型 (Registry Types)
// ============================================================================

/**
 * 组件属性定义 - 宽松验证
 */
export const ComponentPropSchema = z.any()

export type ComponentProp = z.infer<typeof ComponentPropSchema>

/**
 * 组件示例定义
 */
export const ComponentExampleSchema = z.object({
  name: z.string(),
  code: z.string(),
  description: z.string().optional(),
  props: z.record(z.any()).optional()
})

export type ComponentExample = z.infer<typeof ComponentExampleSchema>

/**
 * 组件分类类型 - 基于白皮书 v1.0
 */
export const ComponentCategorySchema = z.enum([
  'ui', 'inputs', 'forms', 'navigation',
  'layout', 'feedback', 'overlays',
  'datadisplay', 'charts', 'utilities'
])

export type ComponentCategory = z.infer<typeof ComponentCategorySchema>

/**
 * 可访问性级别
 */
export const A11yLevelSchema = z.enum(['ok', 'warn', 'na'])

export type A11yLevel = z.infer<typeof A11yLevelSchema>

/**
 * 组件预览配置
 */
export const ComponentPreviewSchema = z.object({
  module: z.string(),
  component: z.string().optional()
})

export type ComponentPreview = z.infer<typeof ComponentPreviewSchema>

/**
 * 组件定义 - 基于白皮书 v1.0 分类体系
 */
export const ComponentSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string(),
  category: ComponentCategorySchema,
  description: z.string(),
  tags: z.array(z.string()),
  tokens: z.array(z.string()).optional(),
  a11y: A11yLevelSchema,
  rtl: z.boolean(),
  i18n: z.array(z.string()),
  preview: ComponentPreviewSchema,
  props: z.record(ComponentPropSchema).optional(),
  examples: z.array(ComponentExampleSchema).optional(),
  dependencies: z.array(z.string()).optional(),
  status: z.enum(['stable', 'beta', 'alpha', 'deprecated']).default('stable'),
  version: z.string().optional(),
  accessibility: z.object({
    ariaAttributes: z.array(z.string()).optional(),
    keyboardNavigation: z.boolean().default(true),
    screenReaderSupport: z.boolean().default(true),
    colorContrast: z.boolean().optional(),
    typographyScale: z.boolean().optional(),
  }).optional()
})

export type Component = z.infer<typeof ComponentSchema>

/**
 * 分类定义
 */
export const CategoryDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  components: z.array(z.string()),
  color: z.string().optional()
})

export type CategoryDefinition = z.infer<typeof CategoryDefinitionSchema>

/**
 * Registry 元数据 - 基于白皮书 v1.0
 */
export const RegistryMetadataSchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
  updated: z.string(),
  totalComponents: z.number(),
  categories: z.array(ComponentCategorySchema),
  compliance: z.object({
    whitepaper: z.string(),
    lastValidated: z.string()
  }).optional()
})

export type RegistryMetadata = z.infer<typeof RegistryMetadataSchema>

/**
 * 完整 Registry 数据 - 基于白皮书 v1.0
 */
export const RegistrySchema = z.object({
  version: z.string(),
  metadata: RegistryMetadataSchema,
  components: z.array(ComponentSchema),
  categories: z.array(CategoryDefinitionSchema).optional(),
  schemas: z.object({
    component: z.any().optional()
  }).optional()
})

export type Registry = z.infer<typeof RegistrySchema>

// ============================================================================
// Tokens 相关类型 (Tokens Types)
// ============================================================================

/**
 * DTCG 令牌定义
 */
export const DTCGTokenSchema = z.object({
  $value: z.union([z.string(), z.number()]),
  $type: z.string(),
  $description: z.string().optional()
})

export type DTCGToken = z.infer<typeof DTCGTokenSchema>

/**
 * DTCG 调色板定义
 */
export const DTCGPaletteSchema = z.record(z.unknown())

export type DTCGPalette = z.infer<typeof DTCGPaletteSchema>

/**
 * 字体系统定义
 */
export const TypographySystemSchema = z.record(z.object({
  fontFamily: z.string().optional(),
  fontSize: z.string().optional(),
  fontWeight: z.string().optional(),
  lineHeight: z.string().optional(),
  letterSpacing: z.string().optional()
}))

export type TypographySystem = z.infer<typeof TypographySystemSchema>

/**
 * 间距系统定义
 */
export const SpacingSystemSchema = z.record(z.string())

export type SpacingSystem = z.infer<typeof SpacingSystemSchema>

/**
 * 核心令牌集合
 */
export const CoreTokensSchema = z.object({
  palettes: z.object({
    neutralScale: DTCGPaletteSchema,
    blueScale: DTCGPaletteSchema,
    cyanScale: DTCGPaletteSchema,
    purpleScale: DTCGPaletteSchema,
    stateColors: DTCGPaletteSchema
  }),
  foundations: z.object({
    typography: TypographySystemSchema,
    spacing: SpacingSystemSchema,
    colors: z.record(z.string()).optional(),
    borderRadius: z.record(z.string()).optional(),
    shadows: z.record(z.string()).optional(),
  })
})

export type CoreTokens = z.infer<typeof CoreTokensSchema>

/**
 * 配方元数据定义
 */
export const RecipeMetaSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  version: z.string().optional(),
  tags: z.array(z.string()).optional(),
  axes: z.object({
    mode: z.enum(['light', 'dark', 'hc']).optional(),
    base: z.object({
      neutral: z.string(),
      contrast: z.string()
    }).optional(),
    accent: z.object({
      strategy: z.string(),
      hues: z.array(z.string())
    }).optional(),
    tone: z.enum(['calm', 'standard', 'vivid']).optional(),
    density: z.enum(['spacious', 'comfortable', 'compact']).optional(),
    motion: z.object({
      pack: z.string(),
      curve: z.string()
    }).optional(),
    surface: z.array(z.string()).optional()
  }).optional(),
  oklchTone: z.record(z.object({
    dC: z.number(),
    dL: z.number()
  })).optional(),
  a11y: z.object({
    text: z.number(),
    largeText: z.number(),
    nonText: z.number(),
    colorContrast: z.boolean().optional(),
    typographyScale: z.boolean().optional(),
  }).optional()
})

export type RecipeMeta = z.infer<typeof RecipeMetaSchema>

/**
 * 密度预设定义
 */
export const DensityPresetSchema = z.object({
  name: z.string().optional(),
  scale: z.number().optional(),
  multipliers: z.object({
    typography: z.record(z.union([z.number(), z.any()])).optional(),
    spacing: z.record(z.union([z.number(), z.any()])).optional(),
    sizing: z.record(z.union([z.number(), z.any()])).optional(),
    border: z.record(z.union([z.number(), z.any()])).optional(),
    shadow: z.record(z.union([z.number(), z.any()])).optional()
  }).optional(),
  spacing: z.record(z.number()).optional(),
  typography: z.record(z.number()).optional(),
})

export type DensityPreset = z.infer<typeof DensityPresetSchema>

/**
 * 完整令牌数据 - 兼容原有格式
 */
export const TokensSchema = z.object({
  palettes: z.object({
    neutralScale: z.record(z.string()),
    blueScale: z.record(z.string()),
    cyanScale: z.record(z.string()),
    purpleScale: z.record(z.string()),
    stateColors: z.record(z.string()),
  }),
  foundations: z.object({
    typography: z.record(z.any()),
    spacing: z.record(z.any()),
    colors: z.record(z.string()),
    borderRadius: z.record(z.string()),
    shadows: z.record(z.string()),
  }),
  recipes: z.record(RecipeMetaSchema),
  densityPresets: z.record(DensityPresetSchema),
  componentAliases: z.record(z.record(z.string())),
})

export type Tokens = z.infer<typeof TokensSchema>

// ============================================================================
// Docs 相关类型 (Docs Types)
// ============================================================================

/**
 * 文档分类
 */
export const DocCategorySchema = z.enum([
  'getting-started',
  'components',
  'design-tokens',
  'patterns',
  'guidelines',
  'migration',
  'api-reference'
])

export type DocCategory = z.infer<typeof DocCategorySchema>

/**
 * 文档元数据
 */
export const DocMetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: DocCategorySchema,
  author: z.string().optional(),
  lastUpdated: z.string(),
  version: z.string().optional(),
  tags: z.array(z.string()).optional(),
  readTime: z.number().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional()
})

export type DocMetadata = z.infer<typeof DocMetadataSchema>

/**
 * 文档内容块
 */
export const DocContentBlockSchema = z.object({
  type: z.enum(['heading', 'paragraph', 'code', 'list', 'table', 'image', 'warning', 'info']),
  content: z.union([z.string(), z.array(z.any()), z.record(z.any())]),
  attrs: z.record(z.any()).optional()
})

export type DocContentBlock = z.infer<typeof DocContentBlockSchema>

/**
 * 文档内容
 */
export const DocContentSchema = z.object({
  metadata: DocMetadataSchema,
  content: z.array(DocContentBlockSchema),
  toc: z.array(z.object({
    level: z.number(),
    title: z.string(),
    anchor: z.string()
  })).optional(),
  related: z.array(z.string()).optional()
})

export type DocContent = z.infer<typeof DocContentSchema>

/**
 * 文档索引项
 */
export const DocIndexItemSchema = z.object({
  slug: z.string(),
  metadata: DocMetadataSchema,
  excerpt: z.string().optional()
})

export type DocIndexItem = z.infer<typeof DocIndexItemSchema>

/**
 * 完整文档数据
 */
export const DocsDataSchema = z.object({
  index: z.array(DocIndexItemSchema),
  content: z.record(DocContentSchema),
  categories: z.array(DocCategorySchema),
  lastUpdated: z.string()
})

export type DocsData = z.infer<typeof DocsDataSchema>

// ============================================================================
// Recipes 相关类型 (Recipes Types) - 兼容现有
// ============================================================================

/**
 * 配方数据类型
 */
export const RecipeDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  meta: RecipeMetaSchema,
  tokens: z.record(z.unknown()).optional(),
  preview: z.object({
    colors: z.array(z.string()),
    gradient: z.string().optional(),
  }).optional()
})

export type RecipeData = z.infer<typeof RecipeDataSchema>

// ============================================================================
// I18n 相关类型 (I18n Types) - 兼容现有
// ============================================================================

/**
 * 语言环境类型
 */
export const LocaleSchema = z.enum(['zh-CN', 'en-US', 'ja-JP'])

export type Locale = z.infer<typeof LocaleSchema>

/**
 * 翻译键值对
 */
export type TranslationMessages = Record<string, string | Record<string, any>>

/**
 * I18n 数据结构
 */
export const I18nDataSchema = z.object({
  locale: LocaleSchema,
  messages: z.record(z.string(), z.union([z.string(), z.record(z.any())])),
  fallback: z.string().optional()
})

export type I18nData = z.infer<typeof I18nDataSchema>

// ============================================================================
// 错误类型定义 (Error Types)
// ============================================================================

/**
 * 数据层错误代码
 */
export enum DataErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  CACHE_ERROR = 'CACHE_ERROR',
  CONFIG_ERROR = 'CONFIG_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * 数据层错误类
 */
export class DataError extends Error {
  constructor(
    public code: DataErrorCode,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'DataError'
  }
}

// ============================================================================
// 验证结果类型 (Validation Result Types) - 兼容现有
// ============================================================================

/**
 * 验证错误
 */
export interface ValidationError {
  type?: string
  code?: string
  message: string
  component?: string
  token?: string
  path?: string
  details?: any
}

/**
 * 验证警告
 */
export interface ValidationWarning {
  type?: string
  message: string
  component?: string
  token?: string
  path?: string
}

/**
 * 验证结果
 */
export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

// ============================================================================
// 缓存配置类型 (Cache Configuration Types)
// ============================================================================

/**
 * 缓存策略
 */
export const CacheStrategySchema = z.enum([
  'none',
  'memory',
  'localStorage',
  'sessionStorage',
  'redis'
])

export type CacheStrategy = z.infer<typeof CacheStrategySchema>

/**
 * 缓存配置
 */
export const CacheConfigSchema = z.object({
  strategy: CacheStrategySchema,
  ttl: z.number().optional(), // 生存时间（秒）
  maxSize: z.number().optional(), // 最大缓存条目数
  keyPrefix: z.string().optional() // 键前缀
})

export type CacheConfig = z.infer<typeof CacheConfigSchema>

// ============================================================================
// 适配器配置类型 (Adapter Configuration Types)
// ============================================================================

/**
 * 基础适配器配置
 */
export const BaseAdapterConfigSchema = z.object({
  name: z.string(),
  enabled: z.boolean().default(true),
  cache: CacheConfigSchema.optional(),
  retryAttempts: z.number().default(3),
  timeout: z.number().default(5000) // 超时时间（毫秒）
})

export type BaseAdapterConfig = z.infer<typeof BaseAdapterConfigSchema>

/**
 * Registry 适配器配置
 */
export const RegistryAdapterConfigSchema = BaseAdapterConfigSchema.extend({
  registryPath: z.string().default('../../packages/registry/registry.json'),
  autoRefresh: z.boolean().default(false),
  refreshInterval: z.number().default(60000) // 刷新间隔（毫秒）
})

export type RegistryAdapterConfig = z.infer<typeof RegistryAdapterConfigSchema>

/**
 * Tokens 适配器配置
 */
export const TokensAdapterConfigSchema = BaseAdapterConfigSchema.extend({
  tokensPath: z.string().default('../../packages/tokens/src/'),
  watchChanges: z.boolean().default(false)
})

export type TokensAdapterConfig = z.infer<typeof TokensAdapterConfigSchema>

/**
 * Docs 适配器配置
 */
export const DocsAdapterConfigSchema = BaseAdapterConfigSchema.extend({
  docsPath: z.string().default('../../packages/core/src/docs/'),
  supportedFormats: z.array(z.enum(['md', 'mdx', 'json'])).default(['md', 'mdx'])
})

export type DocsAdapterConfig = z.infer<typeof DocsAdapterConfigSchema>

// ============================================================================
// 统一导出 (Unified Exports)
// ============================================================================

export * from './registry.readonly'
export * from './tokens.readonly'
export * from './docs.readonly'
export * from './validation'
