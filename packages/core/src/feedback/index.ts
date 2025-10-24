/**
 * Feedback 组件导出 - 符合七轴主题系统 v1.4 SSOT
 *
 * 状态/通知/进度/结果/无障碍提示组件集合
 */

// =============================================================================
// 核心组件导出
// =============================================================================

// Alert 组件
export { Alert, alertVariants } from './alert/alert'
export type { AlertProps } from './alert/alert'

// Toast 组件系统
export {
  Toast,
  toastVariants
} from './toast/toast'
export type {
  ToastProps
} from './toast/toast'

// Notification 组件
export { Notification, notificationVariants } from './notification/notification'
export type { NotificationProps } from './notification/notification'

// Progress 组件
export { Progress, progressVariants } from './progress/progress'
export type { ProgressProps } from './progress/progress'

// Loading 组件
export { Loading, loadingVariants } from './loading/loading'
export type { LoadingProps } from './loading/loading'

// Badge 组件系列
export {
  Badge,
  badgeVariants,
  StatusBadge,
  NotificationBadge
} from './badge/badge'
export type {
  BadgeProps,
  StatusBadgeProps,
  NotificationBadgeProps
} from './badge/badge'

// Tooltip 组件系列
export {
  Tooltip,
  TooltipProvider,
  SimpleTooltip,
  useTooltipConfig,
  tooltipVariants,
  TooltipContext
} from './tooltip/tooltip'
export type {
  TooltipProps,
  TooltipContextType,
  SimpleTooltipProps
} from './tooltip/tooltip'

// =============================================================================
// 便捷组合导出
// =============================================================================

/**
 * 基础反馈组件组合
 */
export const BaseFeedback = {
  Alert,
  Toast,
  Notification,
  Progress,
} as const

/**
 * 状态指示组件组合
 */
export const StatusIndicators = {
  Loading,
  Badge,
  StatusBadge,
  NotificationBadge,
} as const

/**
 * 交互提示组件组合
 */
export const InteractiveTooltips = {
  Tooltip,
  SimpleTooltip,
  TooltipProvider,
} as const

/**
 * 完整反馈组件集合
 */
export const FeedbackComponents = {
  ...BaseFeedback,
  ...StatusIndicators,
  ...InteractiveTooltips,
} as const

// =============================================================================
// 类型导出
// =============================================================================

/**
 * 所有反馈组件的 Props 类型联合
 */
export type FeedbackComponentProps =
  | AlertProps
  | NotificationProps
  | ProgressProps
  | LoadingProps
  | BadgeProps
  | StatusBadgeProps
  | NotificationBadgeProps
  | TooltipProps
  | SimpleTooltipProps

/**
 * 反馈组件变体类型
 */
export type FeedbackVariants =
  | AlertProps['variant']
  | BadgeProps['variant']
  | LoadingProps['variant']
  | ProgressProps['variant']
  | NotificationProps['variant']

/**
 * 反馈组件尺寸类型
 */
export type FeedbackSizes =
  | AlertProps['size']
  | BadgeProps['size']
  | LoadingProps['size']
  | ProgressProps['size']

// =============================================================================
// 默认配置导出
// =============================================================================

/**
 * 默认的 Toast 配置
 */
export const defaultToastConfig = {
  duration: 5000,
  position: 'top-right' as const,
  maxToasts: 5,
} as const

/**
 * 默认的 Tooltip 配置
 */
export const defaultTooltipConfig = {
  delay: 300,
  hideDelay: 100,
  closeOnClickOutside: true,
  closeOnClick: false,
  closeOnEscape: true,
  usePortal: true,
} as const

/**
 * 默认的 Loading 配置
 */
export const defaultLoadingConfig = {
  size: 'md' as const,
  type: 'spinner' as const,
  variant: 'primary' as const,
} as const

// =============================================================================
// 工具函数导出
// =============================================================================

/**
 * 创建标准 Toast 的便捷函数
 */
export const createStandardToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  return {
    title: message,
    variant: type,
    duration: defaultToastConfig.duration,
  }
}

/**
 * 创建标准 Badge 的便捷函数
 */
export const createStandardBadge = (count: number, variant: BadgeProps['variant'] = 'default') => {
  return {
    count,
    variant,
    maxCount: 99,
    showZero: false,
  }
}

/**
 * 创建标准 Loading 的便捷函数
 */
export const createStandardLoading = (message?: string) => {
  return {
    label: message,
    ...defaultLoadingConfig,
  }
}

// =============================================================================
// 主题集成导出
// =============================================================================

/**
 * 反馈组件的主题 CSS 变量映射
 */
export const feedbackThemeVariables = {
  // Alert 主题变量
  '--alert-bg': 'hsl(var(--background))',
  '--alert-border': 'hsl(var(--border))',
  '--alert-text': 'hsl(var(--foreground))',

  // Toast 主题变量
  '--toast-bg': 'hsl(var(--background))',
  '--toast-border': 'hsl(var(--border))',
  '--toast-text': 'hsl(var(--foreground))',

  // Badge 主题变量
  '--badge-bg': 'hsl(var(--primary))',
  '--badge-border': 'hsl(var(--border))',
  '--badge-text': 'hsl(var(--primary-foreground))',

  // Tooltip 主题变量
  '--tooltip-bg': 'hsl(var(--popover))',
  '--tooltip-border': 'hsl(var(--border))',
  '--tooltip-text': 'hsl(var(--popover-foreground))',
} as const

/**
 * 反馈组件的标准主题类名
 */
export const feedbackThemeClasses = {
  // 状态颜色
  success: 'text-success bg-success/10 border-success/20',
  warning: 'text-warning bg-warning/10 border-warning/20',
  error: 'text-error-600 bg-error-500/10 border-error-500/20',
  info: 'text-info bg-info/10 border-info/20',

  // 中性颜色
  default: 'text-text-primary bg-background-primary border-border-base-base',
  secondary: 'text-secondary-600-600-foreground bg-secondary-500-500 border-secondary',

  // 交互状态
  interactive: 'cursor-pointer hover:bg-accent-500-500-500 hover:text-text-on-accent',
  disabled: 'opacity-50 cursor-not-allowed',
} as const