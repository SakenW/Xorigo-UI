/**
 * Layout 层 - 布局组件
 * 提供页面结构和布局支持
 * 基于 Xorigo UI v1.0 架构白皮书标准
 */

// ===========================
// 基础布局组件
// ===========================
export * from './Box'
export * from './Container'
export * from './Flex'

// ===========================
// 网格布局系统
// ===========================
export * from './Grid'
export * from './GridItem'

// ===========================
// 面板布局系统
// ===========================
export * from './Panel'
export * from './PanelHeader'
export * from './PanelContent'
export * from './PanelFooter'

// ===========================
// 间距组件系统
// ===========================
export * from './Spacer'

// ===========================
// 重新导出核心组件类型
// ===========================
export type { GridProps } from './Grid'
export type { ContainerProps } from './Container'
export type { PanelProps } from './Panel'
export type { SpacerProps } from './Spacer'
