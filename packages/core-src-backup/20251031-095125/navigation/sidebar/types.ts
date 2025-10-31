/**
 * Sidebar 侧边栏组件类型定义
 */

import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

// === Sidebar 变体类型 ===
export interface SidebarVariants extends VariantProps<typeof import('./sidebar').sidebarVariants> {}

// === SidebarItem 接口 ===
export interface SidebarItem {
  id: string
  label: string
  icon?: ReactNode
  badge?: string
  active?: boolean
  disabled?: boolean
  children?: SidebarItem[]
  onClick?: () => void
}

// === Sidebar Props 接口 ===
export interface SidebarProps extends
  React.HTMLAttributes<HTMLDivElement>,
  SidebarVariants {
  /** 导航项列表 */
  items: SidebarItem[]
  /** 是否折叠 */
  collapsed?: boolean
  /** 折叠状态变化回调 */
  onCollapsedChange?: (collapsed: boolean) => void
  /** Logo 图标 */
  logo?: ReactNode
  /** Logo 文字 */
  logoText?: string
  /** 底部内容 */
  footer?: ReactNode
  /** 项目点击回调 */
  onItemClick?: (item: SidebarItem) => void
  /** 侧边栏宽度 */
  width?: string
  /** 折叠时的宽度 */
  collapsedWidth?: string
}

// === SidebarItemComponent Props ===
export interface SidebarItemComponentProps {
  item: SidebarItem
  level: number
  collapsed: boolean
  onItemClick?: (item: SidebarItem) => void
}