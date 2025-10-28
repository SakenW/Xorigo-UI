// 主导出（仅稳定 API）
export * from './foundations'
export * from './system'
export * from './primitives'
export * from './branding'

// Phase 3 组件库导出
export * from './feedback'
export * from './layout'
export * from './navigation'
export * from './data-display'
export * from './form'
export * from './typography'
export * from './showcase'
export * from './effects'
export * from './motion'

// 保留的旧组件（兼容性）
export * from './data-display/table'
export * from './data-display/data-table'
// 注意：不导出 './data-display/stat' 因为它已经在 './data-display' 中包含，会造成 StatCard 冲突
export * from './overlays/dialog'
export * from './loading/xorigo-logo-loader'
export * from './branding'
