/**
 * Feedback Components - 反馈组件集合
 *
 * 提供用户操作反馈和状态提示组件，包括警告、提示、加载等
 * 支持七轴主题系统，确保在不同主题下的视觉一致性
 */

// 警告和提示组件
export { Alert } from './alert'
export type { AlertProps } from './alert'

export { Toast } from './toast'
export type { ToastProps } from './toast'

// Notification组件在notification.tsx中不存在，暂时注释
// export { Notification } from './notification'
// export type { NotificationProps } from './notification'
export { NotificationProgress, ToastProvider, useToast } from './notification'
export type { NotificationProgressProps } from './notification'

// 进度指示组件
export { Progress } from './progress'
export type { ProgressProps } from './progress'

export { Loading } from './loading'
export type { LoadingProps } from './loading'

// 主题控制组件
export { ThemeToggle } from './theme-toggle'
export type { ThemeToggleProps } from './theme-toggle'

export { AdvancedThemeSwitcher, ThemeSwitcher } from './advanced-theme-switcher'
export type { AdvancedThemeSwitcherProps as ThemeSwitcherProps } from './advanced-theme-switcher'