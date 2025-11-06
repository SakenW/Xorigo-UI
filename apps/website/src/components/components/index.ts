/**
 * Components 模块导出文件
 */

// 核心组件导出
export { default as ComponentCard } from './component-card'
export { ComponentPreview, ComponentVariants } from './component-preview'
export { default as SearchFilter } from './search-filter'

// 类型导出
export type {
  ComponentMeta,
  ComponentCategory,
  ComponentTag,
  PropMeta,
  VariantMeta,
  ExampleMeta,
  AccessibilityInfo
} from './component-registry'

export type {
  SearchFilters
} from './search-filter'

// 数据导出
export {
  componentRegistry,
  componentCategories,
  getComponentById,
  getComponentsByCategory,
  getComponentsByTag,
  searchComponents,
  getComponentCategories
} from './component-registry'

export {
  filterComponents
} from './search-filter'