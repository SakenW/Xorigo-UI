/**
 * 🗄️ Website 数据层 - 统一导出入口
 *
 * 四层架构数据层统一访问接口
 * 提供对所有数据适配器的只读访问、类型定义和验证工具
 *
 * 核心原则:
 * - 单一数据入口: 所有数据访问通过这里
 * - 只读访问: 确保数据不可变性和一致性
 * - 类型安全: 完整的 TypeScript 5.9 类型支持
 * - Schema 验证: Zod 运行时数据一致性保证
 * - 单例模式: 确保单一数据源
 *
 * @author Hive Mind Coder Agent
 * @version 2.0.0
 */

// ============================================================================
// 核心适配器实例导出 (推荐使用)
// ============================================================================

/**
 * Registry 只读适配器 - 组件注册表数据访问
 * @example
 * import { readonlyRegistry } from '@/data'
 * const components = readonlyRegistry.getComponents()
 */
export { readonlyRegistry } from './registry.readonly'

/**
 * Tokens 只读适配器 - 设计令牌系统数据访问
 * @example
 * import { readonlyTokens } from '@/data'
 * const palettes = readonlyTokens.getPalettes()
 */
export { readonlyTokens } from './tokens.readonly'

/**
 * Docs 只读适配器 - 文档系统数据访问
 * @example
 * import { readonlyDocs } from '@/data'
 * const docs = readonlyDocs.getDocumentIndex()
 */
export { readonlyDocs } from './docs.readonly'

/**
 * Recipes 只读适配器 - 配方系统数据访问
 * @example
 * import { readonlyRecipes } from '@/data'
 * const recipes = readonlyRecipes.getAllRecipes()
 */
export { readonlyRecipes } from './recipes.readonly'

/**
 * I18n 只读适配器 - 国际化数据访问
 * @example
 * import { readonlyI18n, t } from '@/data'
 * const translation = t('common.loading')
 */
export { readonlyI18n, t, tWithParams } from './i18n.readonly'

// ============================================================================
// 适配器获取函数导出
// ============================================================================

/**
 * 获取适配器实例（用于依赖注入或测试）
 */
export { getRegistryAdapter } from './registry.readonly'
export { getTokensAdapter } from './tokens.readonly'
export { getDocsAdapter } from './docs.readonly'

// ============================================================================
// 验证工具导出
// ============================================================================

export {
  validateAllConsistency,
  printValidationReport,
  validateAndPrint,
  getValidationSummary,
  type ValidationReport,
  type ValidationStats,
} from './validation'

// ============================================================================
// 错误处理导出
// ============================================================================

export {
  DataError,
  DataErrorCode
} from './types'

// ============================================================================
// 核心类型定义导出
// ============================================================================

export type {
  // 基础类型
  ApiResponse,
  PaginatedResponse,
  PaginationParams,

  // Registry 类型
  Component,
  ComponentProp,
  ComponentExample,
  Registry,
  RegistryMetadata,
  ValidationResult,
  ValidationError,
  ValidationWarning,

  // Tokens 类型
  DTCGToken,
  DTCGPalette,
  TypographySystem,
  SpacingSystem,
  CoreTokens,
  RecipeMeta,
  DensityPreset,
  Tokens,

  // Docs 类型
  DocCategory,
  DocMetadata,
  DocContentBlock,
  DocContent,
  DocIndexItem,
  DocsData,

  // Recipes 类型
  RecipeData,
  Recipe,
  RecipeFilterOptions,

  // I18n 类型
  Locale,
  TranslationMessages,
  I18nData,
  I18nConfig,
  TranslationValue,

  // 配置类型
  CacheConfig,
  CacheStrategy,
  BaseAdapterConfig,
  RegistryAdapterConfig,
  TokensAdapterConfig,
  DocsAdapterConfig,
} from './types'

// ============================================================================
// Schema 导出（用于高级用例和构建时验证）
// ============================================================================

export {
  ComponentSchema,
  ComponentPropSchema,
  ComponentExampleSchema,
  RegistrySchema,
  RegistryMetadataSchema,

  TokensSchema,
  DTCGTokenSchema,
  DTCGPaletteSchema,
  TypographySystemSchema,
  SpacingSystemSchema,
  CoreTokensSchema,
  RecipeMetaSchema,
  DensityPresetSchema,

  DocsDataSchema,
  DocContentSchema,
  DocMetadataSchema,
  DocContentBlockSchema,
  DocIndexItemSchema,
  DocCategorySchema,

  RecipeDataSchema,

  I18nDataSchema,
  LocaleSchema,

  CacheConfigSchema,
  BaseAdapterConfigSchema,
  RegistryAdapterConfigSchema,
  TokensAdapterConfigSchema,
  DocsAdapterConfigSchema,
} from './types'

// ============================================================================
// 便捷工具函数导出
// ============================================================================

/**
 * 获取所有适配器的统计信息
 */
export function getDataLayerStats() {
  const registry = readonlyRegistry.getComponents()
  const tokens = readonlyTokens.getDesignTokens()
  const docs = readonlyDocs.getDocumentIndex()
  const recipes = readonlyRecipes.getAllRecipes()
  const i18n = readonlyI18n.getLocale()

  return {
    components: {
      total: registry.length,
      categories: readonlyRegistry.getCategories()
    },
    tokens: {
      palettes: Object.keys(tokens.palettes).length,
      recipes: Object.keys(tokens.recipes).length,
      densityPresets: Object.keys(tokens.densityPresets).length
    },
    docs: {
      total: docs.length,
      categories: readonlyDocs.getCategories()
    },
    recipes: {
      total: recipes.length
    },
    i18n: {
      currentLocale: i18n,
      supportedLocales: ['zh-CN', 'en-US', 'ja-JP']
    }
  }
}

/**
 * 检查数据层健康状态
 */
export function checkDataLayerHealth() {
  const report = validateAllConsistency()
  const stats = getDataLayerStats()

  return {
    healthy: report.summary.isValid,
    errors: report.summary.totalErrors,
    warnings: report.summary.totalWarnings,
    stats,
    lastValidated: report.timestamp,
    performance: report.performance
  }
}
