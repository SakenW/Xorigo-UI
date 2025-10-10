/**
 * TH-UI 组件库统一导出
 *
 * 按功能分类组织，提供清晰的组件结构和命名空间
 */

// ============================================================================
// UI 基础组件 (15个) - 最基础的 UI 构建块
// ============================================================================
export { Button } from './ui'
export { Input } from './ui'
export { Select } from './ui'
export { Checkbox } from './ui'
export { Radio } from './ui'
export { Switch } from './ui'
export { Textarea } from './ui'
export { Card, CardHeader, CardContent, CardFooter } from './ui'
export { Badge } from './ui'
export { Avatar } from './ui'
export { Divider } from './ui'
export { Skeleton } from './ui'
export { Breadcrumb } from './ui'
export { Pagination } from './ui'
export { Tooltip } from './ui'

// UI 基础组件类型
export type { ButtonProps } from './ui'
export type { InputProps } from './ui'
export type { SelectProps } from './ui'
export type { CheckboxProps } from './ui'
export type { RadioProps } from './ui'
export type { SwitchProps } from './ui'
export type { TextareaProps } from './ui'
export type { CardProps as UICardProps, CardHeaderProps, CardContentProps, CardFooterProps } from './ui'
export type { BadgeProps } from './ui'
export type { AvatarProps } from './ui'
export type { DividerProps } from './ui'
export type { SkeletonProps } from './ui'
export type { BreadcrumbProps } from './ui'
export type { PaginationProps } from './ui'
export type { TooltipProps } from './ui'

// ============================================================================
// 反馈组件 (8个) - 用户操作反馈和状态提示
// ============================================================================
export { Alert, Modal, Loading, Progress, ThemeToggle } from './feedback'
export { 
  Toast, 
  ToastViewport, 
  ToastAction, 
  ToastClose, 
  ToastTitle, 
  ToastDescription,
  useToast 
} from './feedback/Toast'
export { 
  ToastProvider as NotificationProvider,
  useToast as useNotification,
} from './feedback/Notification'

// 反馈组件类型
export type { AlertProps, ModalProps, LoadingProps, ProgressProps, ThemeToggleProps } from './feedback'
export type { 
  ToastViewportProps,
  ToastActionProps,
  ToastCloseProps,
  ToastTitleProps,
  ToastDescriptionProps
} from '@radix-ui/react-toast'
export type { Notification, NotificationType } from './feedback/Notification'

// ============================================================================
// 导航组件 (6个) - 导航和布局相关组件
// ============================================================================
export { Header as NavigationHeader, Sidebar, ResponsiveLayout, DataTable, Tabs } from './navigation'

// 导航组件类型
export type { HeaderProps, HeaderUser } from './navigation/BasicHeader'
export type { SidebarProps } from './navigation/Sidebar'
export type { ResponsiveLayoutProps } from './navigation/ResponsiveLayout'
export type { TableProps } from './navigation/DataTable'
export type { TabsProps } from './navigation/Tabs'

// ============================================================================
// 高级组件 (3个) - 复杂交互和动画组件
// ============================================================================
export { Dialog } from './advanced'
export { AdvancedCard } from './advanced'
export { AnimatedCard } from './advanced'

// 高级组件类型
// Dialog 组件使用 Radix UI 的原生类型，无需额外导出
export type { CardProps, StatCardProps, ProductCardProps, ArticleCardProps, CardGridProps } from './advanced/AdvancedCard'

// ============================================================================
// Radix UI 组件 (2个) - 基于 Radix UI 的高级组件
// ============================================================================
export { Accordion } from './radix'
export { DropdownMenu } from './radix'

// Radix UI 组件类型
// 这些组件使用 Radix UI 的原生类型，无需额外导出

// ============================================================================
// 业务组件 (Blocks) - 复合业务场景组件
// ============================================================================
export * from '../blocks'

// ============================================================================
// 版本信息
// ============================================================================
export const VERSION = '0.1.0'
export const BUILD_DATE = new Date().toISOString()
