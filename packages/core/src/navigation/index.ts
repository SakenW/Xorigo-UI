/**
 * Navigation 层 - 导航组件
 * 提供页面导航和路由支持
 *
 * 符合 Xorigo UI 架构白皮书v1.0标准
 * React 19 + TypeScript 5.9 + Framer Motion 12 + CVA
 */

// 核心导航组件 - 重构完成（符合白皮书标准）
export {
  Breadcrumb,
  type BreadcrumbItem,
  type BreadcrumbProps,
} from './Breadcrumb'

export {
  Pagination,
  type PaginationItem,
  type PaginationProps,
} from './Pagination'

export {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuGroup,
  MenuSubMenu,
  type MenuItemType,
  type MenuProps,
  type MenuTriggerProps,
  type MenuContentProps,
  type MenuItemProps,
  type MenuSeparatorProps,
  type MenuGroupProps,
  type MenuSubMenuProps,
} from './Menu'

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabPane,
  type TabItem,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps,
  type TabPaneProps,
} from './Tabs'

// 画廊导航组件
export {
  ComponentNav,
  type NavGroup,
  type NavItem,
  type ComponentNavProps,
} from './ComponentNav'

// 兼容性组件（待重构）
export * from './Navbar'
export * from './BasicHeader'
export * from './DataTable'
export * from './ResponsiveLayout'
export * from './Sidebar'