/**
 * 🧭 Navigation · 导航 - v2025.11.03
 *
 * 页面导航和路由相关组件
 * 包含菜单、面包屑、分页等导航元素
 *
 * @version 2025.11.03
 * @category Navigation
 * @layer component
 */

// 顶部工具栏
export { Topbar } from './topbar'
export type { TopbarProps } from './topbar'

// 侧边导航
export { Sidenav } from './sidenav'
export type { SidenavProps, SidenavItem } from './sidenav'

// 应用壳层
export { AppShell } from './app-shell'
export type { AppShellProps } from './app-shell'

// 基础导航组件
export { BasicHeader } from './basic-header'
export { Navbar } from './navbar'
export { Sidebar } from './sidebar'
export { Menu } from './menu'

// 分段控制器
export { SegmentedControl } from './segmented-control'
export type { SegmentedControlProps, SegmentedOption } from './segmented-control'

// 导航菜单
export { NavMenu } from './nav-menu'
export type { NavMenuProps, NavMenuItem } from './nav-menu'

// 上下文菜单
export { ContextualMenu, useContextualMenu } from './contextual-menu'
export type { ContextualMenuProps, ContextMenuItem } from './contextual-menu'

// 面包屑导航
export { Breadcrumb } from './breadcrumb'

// 分页组件
export { Pagination } from './pagination'

// 步骤导航
export { Stepper } from './stepper'
export type { StepperProps, Step } from './stepper'

// 标签页
export { Tabs } from './tabs'

// 导航链接
export { NavLink } from './nav-link'
export type { NavLinkProps } from './nav-link'

// 基础链接
export { Link } from './link'
export type { LinkProps } from './link'

// 布局组件
export { ResponsiveLayout } from './responsive-layout'

// 数据表格（也在 data-display 中）
export { DataTable } from './data-table'

// 组件导航
export { ComponentNav } from './component-nav'

// 类型导出（从各自的组件文件中导出）
export type { BasicHeaderProps } from './basic-header'
export type { NavbarProps } from './navbar'
export type { SidebarProps } from './sidebar'
export type { MenuProps } from './menu'
export type { BreadcrumbProps } from './breadcrumb'
export type { PaginationProps } from './pagination'
export type { TabsProps } from './tabs'
export type { ResponsiveLayoutProps } from './responsive-layout'
export type { DataTableProps } from './data-table'
export type { ComponentNavProps } from './component-nav'
// 可访问性导航
export { SkipNav } from './skip-nav'
export type { SkipNavProps } from './skip-nav'
