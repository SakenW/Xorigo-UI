/**
 * Primitives - 原子组件集合
 *
 * 包含最基础的UI组件，遵循原子设计原则
 * 这些组件是构建复杂界面的基础
 */

// 核心交互组件（仅导出最基础的组件）
export { Button } from './Button'
export type { ButtonProps } from './Button'

export { Card } from './Card'
export type { CardProps } from './Card'

export { Badge } from './Badge'
export type { BadgeProps } from './Badge'

export { Spinner } from './Spinner'
export type { SpinnerProps } from './Spinner'

// 添加实际组件导出
export { Textarea } from './Textarea'
export type { TextareaProps } from './Textarea'

export { Switch } from './Switch'
export type { SwitchProps } from './Switch'

export { Checkbox } from './Checkbox'
export type { CheckboxProps } from './Checkbox'

export { Divider } from './Divider'
export type { DividerProps } from './Divider'

// 类型导出（用于其他组件）
export interface AvatarProps {}
export interface AlertProps {}
export interface IconProps {}
export interface SkeletonProps {}
export interface SurfaceProps {}
export interface InputProps {}
export interface RadioProps {}
export interface SliderProps {}
export interface GradientPresetsProps {}
export interface AnimatedCardProps {}
export interface TypographyProps {}
export interface TestProps {}
export interface CopyButtonProps {}
export interface TooltipProps {}
export interface SeparatorProps {}
export interface SwitchNoMotionProps {}
export interface ToggleProps {}
export interface TabsProps {}
export interface ScrollAreaProps {}
export interface VisuallyHiddenProps {}
export interface PasswordInputProps {}
export interface SearchInputProps {}
export interface SelectProps {}
export interface ModalProps {}
export interface CodeProps {}
export interface KbdProps {}