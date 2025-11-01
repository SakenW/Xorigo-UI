/**
 * Primitives Components - 原子组件集合 (棕地架构 v1.5.1)
 *
 * 包含最基础的UI原子组件，是所有复合组件的基础构建块
 * 与Xorigo UI设计系统完全集成，支持七轴主题和可访问性
 */

// ============================================================================
// 基础交互组件 (Basic Interactive Components)
// ============================================================================

export { Button } from './Button'
export type { ButtonProps } from './Button'

export { Toggle } from './Toggle'
export type { ToggleProps } from './Toggle'

export { SwitchNoMotion } from './SwitchNoMotion'
export type { SwitchNoMotionProps } from './SwitchNoMotion'

// ============================================================================
// 数据展示组件 (Data Display Components)
// ============================================================================

export { Card } from './Card'
export type { CardProps } from './Card'

export { AnimatedCard } from './AnimatedCard'
export type { AnimatedCardProps } from './AnimatedCard'

export { Avatar } from './Avatar'
export type { AvatarProps } from './Avatar'

export { Badge } from './Badge'
export type { BadgeProps } from './Badge'

export { Alert } from './Alert'
export type { AlertProps } from './Alert'

export { Surface } from './Surface'
export type { SurfaceProps } from './Surface'

// ============================================================================
// 反馈组件 (Feedback Components)
// ============================================================================

export { Skeleton } from './Skeleton'
export type { SkeletonProps } from './Skeleton'

export { Spinner } from './Spinner'
export type { SpinnerProps } from './Spinner'

// ============================================================================
// 布局组件 (Layout Components)
// ============================================================================

export { Divider } from './Divider'
export type { DividerProps } from './Divider'

export { Separator } from './Separator'
export type { SeparatorProps } from './Separator'

export { ScrollArea } from './ScrollArea'
export type { ScrollAreaProps } from './ScrollArea'

// ============================================================================
// 叠加层组件 (Overlay Components)
// ============================================================================

export { Modal } from './Modal'
export type { ModalProps } from './Modal'

export { Tooltip } from './Tooltip'
export type { TooltipProps } from './Tooltip'

// ============================================================================
// 导航组件 (Navigation Components)
// ============================================================================

export { Tabs } from './Tabs'
export type { TabsProps } from './Tabs'

// ============================================================================
// 内容组件 (Content Components)
// ============================================================================

export { Typography } from './Typography'
export type { TypographyProps } from './Typography'

export { Code } from './Code'
export type { CodeProps } from './Code'

export { Kbd } from './Kbd'
export type { KbdProps } from './Kbd'

export { Icon } from './Icon'
export type { IconProps } from './Icon'

export { CopyButton } from './CopyButton'
export type { CopyButtonProps } from './CopyButton'

// ============================================================================
// 渐变组件 (Gradient Components)
// ============================================================================

export {
  GradientPreset,
  GradientPresetSelector,
  GradientPresetShowcase,
  extendedGradientPresets
} from './GradientPresets'

export type {
  GradientPresetProps,
  GradientPresetKey,
  GradientPresetSelectorProps,
  GradientPresetShowcaseProps
} from './GradientPresets'

// ============================================================================
// Usage Examples
// ============================================================================
//
// // 导入所有原子组件
// import { Button, Card, Modal, Tooltip } from '@xorigo-ui/core'
//
// // 或者只导入原子组件类别
// import { Button, Card, Badge, Spinner } from '@xorigo-ui/core/primitives'
//
// // 基础用法
// <Card>
//   <Typography variant="h3">卡片标题</Typography>
//   <Button variant="primary">操作按钮</Button>
//   <Tooltip content="提示信息">
//     <Icon name="info" />
//   </Tooltip>
// </Card>
//
// ============================================================================