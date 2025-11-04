/**
 * Primitives - 原子组件集合
 *
 * 包含最基础的UI组件，遵循原子设计原则
 * 这些组件是构建复杂界面的基础
 */

// 核心交互组件
export { Button } from './button'
export type { ButtonProps } from './button'

export { Card } from './card'
export type { CardProps } from './card'

export { Badge } from './badge'
export type { BadgeProps } from './badge'

export { Spinner } from './Spinner'
export type { SpinnerProps } from './Spinner'

// 导航和标签组件
export { Tabs } from './Tabs'
export type { TabsProps } from './Tabs'

export { Tooltip } from './Tooltip'
export type { TooltipProps } from './Tooltip'

// 表单组件
export { Textarea } from './Textarea'
export type { TextareaProps } from './Textarea'

export { Switch } from './Switch'
export type { SwitchProps } from './Switch'

export { SwitchNoMotion } from './switch-no-motion'
export type { SwitchNoMotionProps } from './switch-no-motion'

export { Toggle } from './Toggle'
export type { ToggleProps } from './Toggle'

export { Checkbox } from './checkbox'
export type { CheckboxProps } from './checkbox'

// 布局和分隔组件
export { Divider } from './divider'
export type { DividerProps } from './divider'

export { Separator } from './separator'
export type { SeparatorProps } from './separator'

export { ScrollArea } from './scroll-area'
export type { ScrollAreaProps } from './scroll-area'

// 显示组件
export { Skeleton } from './Skeleton'
export type { SkeletonProps } from './Skeleton'

export { Alert } from './alert'
export type { AlertProps } from './alert'

export { Modal } from './modal'
export type { ModalProps } from './modal'

export { Kbd } from './kbd'
export type { KbdProps } from './kbd'

export { Code } from './code'
export type { CodeProps } from './code'

export { Typography } from './Typography'
export type { TypographyProps } from './Typography'

export { Surface } from './Surface'
export type { SurfaceProps } from './Surface'

export { Avatar } from './avatar'
export type { AvatarProps } from './avatar'

// 图标组件集合
export {
  CheckIcon,
  XIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  MinusIcon,
  SearchIcon,
  BellIcon,
  HomeIcon,
  SettingsIcon
} from './icon'
export type { IconProps } from './icon'

// 特殊组件
export { AnimatedCard } from './animated-card'
export type { AnimatedCardProps } from './animated-card'

export { extendedGradientPresets } from './gradient-presets'
export type { GradientPresetKey, GradientPresetProps } from './gradient-presets'

export { CopyButton } from './copy-button'
export type { CopyButtonProps } from './copy-button'