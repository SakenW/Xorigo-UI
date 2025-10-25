/**
 * Navigation 组件导出 - 符合七轴主题系统 v1.4 SSOT
 *
 * 导航组件集合 - Navbar, Breadcrumb, Tabs, Menu
 */

// =============================================================================
// 核心组件导出
// =============================================================================

// Navbar 组件系列
export {
  Navbar,
  navbarVariants,
  NavbarBrand,
  NavbarNav,
  NavbarActions,
  NavbarLink
} from './navbar/navbar'
export type {
  NavbarProps,
  NavbarBrandProps,
  NavbarNavProps,
  NavbarActionsProps,
  NavbarLinkProps
} from './navbar/navbar'
import {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarActions,
  NavbarLink
} from './navbar/navbar'

// Breadcrumb 组件系列
export {
  Breadcrumb,
  breadcrumbVariants,
  BreadcrumbItemComponent,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  generateBreadcrumbFromPath,
  generateBreadcrumbSchema
} from './breadcrumb/breadcrumb'
export type {
  BreadcrumbProps,
  BreadcrumbItem,
  BreadcrumbItemComponentProps,
  BreadcrumbSeparatorProps,
  BreadcrumbEllipsisProps
} from './breadcrumb/breadcrumb'
import {
  Breadcrumb,
  BreadcrumbItemComponent,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from './breadcrumb/breadcrumb'

// Tabs 组件系列
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsVariants,
  tabListVariants,
  tabTriggerVariants
} from './tabs/tabs'
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps
} from './tabs/tabs'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from './tabs/tabs'

// Menu 组件系列
export {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuLabel,
  MenuGroup,
  menuVariants,
  menuItemVariants
} from './menu/menu'
export type {
  MenuProps,
  MenuTriggerProps,
  MenuContentProps,
  MenuItemProps,
  MenuSeparatorProps,
  MenuLabelProps,
  MenuGroupProps
} from './menu/menu'
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuLabel,
  MenuGroup
} from './menu/menu'

// Sidebar 组件系列
export {
  Sidebar,
  sidebarVariants
} from './sidebar/sidebar'
export type {
  SidebarProps,
  SidebarItem,
  SidebarItemComponentProps
} from './sidebar/sidebar'
import { Sidebar } from './sidebar/sidebar'

// =============================================================================
// 便捷组合导出
// =============================================================================

/**
 * 基础导航组件组合
 */
export const BaseNavigation = {
  Navbar,
  Breadcrumb,
  Tabs,
  Menu,
  Sidebar,
} as const

/**
 * 面包屑导航组件组合
 */
export const BreadcrumbComponents = {
  Breadcrumb,
  BreadcrumbItemComponent,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} as const

/**
 * 标签页导航组件组合
 */
export const TabsComponents = {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} as const

/**
 * 菜单导航组件组合
 */
export const MenuComponents = {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuLabel,
  MenuGroup,
} as const

/**
 * 导航栏组件组合
 */
export const NavbarComponents = {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarActions,
  NavbarLink,
} as const

/**
 * 侧边栏组件组合
 */
export const SidebarComponents = {
  Sidebar,
} as const

/**
 * 完整导航组件集合
 */
export const NavigationComponents = {
  ...BaseNavigation,
  ...BreadcrumbComponents,
  ...TabsComponents,
  ...MenuComponents,
  ...NavbarComponents,
  ...SidebarComponents,
} as const

// =============================================================================
// 类型导出
// =============================================================================

/**
 * 所有导航组件的 Props 类型联合
 */
export type NavigationComponentProps =
  | NavbarProps
  | BreadcrumbProps
  | TabsProps
  | MenuProps
  | SidebarProps

/**
 * 导航组件变体类型
 */
export type NavigationVariant =
  | NavbarProps['variant']
  | BreadcrumbProps['variant']
  | TabsProps['variant']
  | MenuProps['variant']

/**
 * 导航组件尺寸类型
 */
export type NavigationSize =
  | NavbarProps['size']
  | BreadcrumbProps['size']
  | TabsProps['size']
  | MenuProps['size']

/**
 * 导航方向类型
 */
export type NavigationOrientation =
  | 'horizontal'
  | 'vertical'

/**
 * 导航位置类型
 */
export type NavigationPosition =
  | 'static'
  | 'sticky'
  | 'fixed'

// =============================================================================
// 默认配置导出
// =============================================================================

/**
 * 默认的 Navbar 配置
 */
export const defaultNavbarConfig = {
  variant: 'default' as const,
  size: 'md' as const,
  position: 'static' as const,
  layout: 'spaceBetween' as const,
} as const

/**
 * 默认的 Breadcrumb 配置
 */
export const defaultBreadcrumbConfig = {
  variant: 'default' as const,
  size: 'md' as const,
  separator: 'slash' as const,
  align: 'start' as const,
  clickable: true,
} as const

/**
 * 默认的 Tabs 配置
 */
export const defaultTabsConfig = {
  variant: 'default' as const,
  size: 'md' as const,
  orientation: 'horizontal' as const,
  justify: 'start' as const,
} as const

/**
 * 默认的 Menu 配置
 */
export const defaultMenuConfig = {
  variant: 'default' as const,
  size: 'md' as const,
  position: 'bottom-left' as const,
} as const

// =============================================================================
// 工具函数导出
// =============================================================================

/**
 * 创建标准导航栏的便捷函数
 */
export const createStandardNavbar = (props: Partial<NavbarProps> = {}) => {
  return {
    ...defaultNavbarConfig,
    ...props,
  }
}

/**
 * 创建标准面包屑的便捷函数
 */
export const createStandardBreadcrumb = (items: BreadcrumbItem[], props: Partial<BreadcrumbProps> = {}) => {
  return {
    ...defaultBreadcrumbConfig,
    items,
    ...props,
  }
}

/**
 * 创建标准标签页的便捷函数
 */
export const createStandardTabs = (props: Partial<TabsProps> = {}) => {
  return {
    ...defaultTabsConfig,
    ...props,
  }
}

/**
 * 创建标准菜单的便捷函数
 */
export const createStandardMenu = (props: Partial<MenuProps> = {}) => {
  return {
    ...defaultMenuConfig,
    ...props,
  }
}

// =============================================================================
// 主题集成导出
// =============================================================================

/**
 * 导航组件的主题 CSS 变量映射
 */
export const navigationThemeVariables = {
  // Navbar 主题变量
  '--navbar-border': 'hsl(var(--border))',
  '--navbar-bg': 'hsl(var(--background))',
  '--navbar-text': 'hsl(var(--foreground))',

  // Breadcrumb 主题变量
  '--breadcrumb-text': 'hsl(var(--muted-foreground))',
  '--breadcrumb-active': 'hsl(var(--foreground))',
  '--breadcrumb-separator': 'hsl(var(--muted-foreground))',

  // Tabs 主题变量
  '--tabs-border': 'hsl(var(--border))',
  '--tabs-background': 'hsl(var(--background))',
  '--tabs-foreground': 'hsl(var(--foreground))',
  '--tabs-primary': 'hsl(var(--primary))',

  // Menu 主题变量
  '--menu-border': 'hsl(var(--border))',
  '--menu-bg': 'hsl(var(--popover))',
  '--menu-text': 'hsl(var(--popover-foreground))',
} as const

/**
 * 导航组件的标准主题类名
 */
export const navigationThemeClasses = {
  // 导航栏样式
  navbar: 'bg-background-primary/95 backdrop-blur supports-[backdrop-filter]:bg-background-primary/60',

  // 面包屑样式
  breadcrumb: 'text-text-secondary-600',
  breadcrumbActive: 'text-text-primary font-medium',
  breadcrumbLink: 'hover:text-text-primary transition-colors',

  // 标签页样式
  tabs: 'w-full',
  tabsList: 'inline-flex h-10 items-center justify-center rounded-md bg-background-primary-secondary p-1 text-text-secondary-600',
  tabsTrigger: 'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background-primary data-[state=active]:text-text-primary data-[state=active]:shadow-sm',
  tabsContent: 'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',

  // 菜单样式
  menu: 'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
  menuItem: 'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent-500-500 focus:text-text-on-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  menuSeparator: 'my-1 h-px bg-background-primary-secondary',
} as const

// =============================================================================
// 预设导航导出
// =============================================================================

/**
 * 页面导航预设
 */
export const PageNavigationPresets = {
  // 标准页面导航
  standard: {
    navbar: {
      variant: 'default' as const,
      position: 'sticky' as const,
      layout: 'spaceBetween' as const,
    },
    breadcrumb: {
      variant: 'default' as const,
      size: 'sm' as const,
      showHome: true,
    },
  },

  // 简约页面导航
  minimal: {
    navbar: {
      variant: 'transparent' as const,
      position: 'static' as const,
      layout: 'center' as const,
    },
    breadcrumb: {
      variant: 'default' as const,
      size: 'sm' as const,
      showHome: false,
    },
  },

  // 管理后台导航
  admin: {
    navbar: {
      variant: 'inverse' as const,
      position: 'sticky' as const,
      layout: 'spaceBetween' as const,
    },
    breadcrumb: {
      variant: 'default' as const,
      size: 'md' as const,
      showHome: true,
    },
  },
} as const

/**
 * 组件导航预设
 */
export const ComponentNavigationPresets = {
  // 标签页导航
  tabs: {
    variant: 'underline' as const,
    size: 'md' as const,
    justify: 'start' as const,
  },

  // 卡片标签页
  cardTabs: {
    variant: 'card' as const,
    size: 'sm' as const,
    justify: 'stretch' as const,
  },

  // 下拉菜单
  dropdown: {
    variant: 'dropdown' as const,
    size: 'md' as const,
    position: 'bottom-left' as const,
  },

  // 右键菜单
  contextMenu: {
    variant: 'context' as const,
    size: 'md' as const,
    position: 'bottom-right' as const,
  },
} as const