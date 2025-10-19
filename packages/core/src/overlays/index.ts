/**
 * Overlays 弹层与遮罩
 * 包含模态框、对话框、抽屉、弹出框等覆盖层组件
 *
 * 按照 Xorigo UI 白皮书 v1.0 标准实现
 * 提供完整的可访问性支持和流畅的动画效果
 */

// ============================================================================
// Dialog 对话框组件
// ============================================================================
export {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  type DialogProps,
  type DialogHeaderProps,
  type DialogContentProps,
  type DialogFooterProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
} from './Dialog'

// ============================================================================
// Drawer 抽屉组件
// ============================================================================
export {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  type DrawerProps,
  type DrawerHeaderProps,
  type DrawerContentProps,
  type DrawerFooterProps,
  type DrawerTitleProps,
  type DrawerDescriptionProps,
} from './Drawer'

// ============================================================================
// Popover 弹出框组件
// ============================================================================
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  type PopoverProps,
  type PopoverTriggerProps,
  type PopoverContentProps,
  type PopoverArrowProps,
} from './Popover'

// ============================================================================
// Modal 模态框组件 (保留现有实现)
// ============================================================================
export {
  Modal,
  type ModalProps,
} from './Modal'

// ============================================================================
// 组件分组导出 (便于按类别导入)
// ============================================================================

// 对话框系列 (临时注释以解决构建问题)
// export const DialogComponents = {
//   Dialog,
//   DialogHeader,
//   DialogContent,
//   DialogFooter,
//   DialogTitle,
//   DialogDescription,
// } as const

// 抽屉系列 (临时注释以解决构建问题)
// export const DrawerComponents = {
//   Drawer,
//   DrawerHeader,
//   DrawerContent,
//   DrawerFooter,
//   DrawerTitle,
//   DrawerDescription,
// } as const

// 弹出框系列 (临时注释以解决构建问题)
// export const PopoverComponents = {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
//   PopoverArrow,
// } as const

// 模态框系列 (临时注释以解决构建问题)
// export const ModalComponents = {
//   Modal,
// } as const

// ============================================================================
// 类型导出
// ============================================================================

// 所有组件的 Props 类型
export type OverlayComponentsProps =
  | DialogProps
  | DialogHeaderProps
  | DialogContentProps
  | DialogFooterProps
  | DialogTitleProps
  | DialogDescriptionProps
  | DrawerProps
  | DrawerHeaderProps
  | DrawerContentProps
  | DrawerFooterProps
  | DrawerTitleProps
  | DrawerDescriptionProps
  | PopoverProps
  | PopoverTriggerProps
  | PopoverContentProps
  | PopoverArrowProps
  | ModalProps

// 变体类型
export type DialogVariant = DialogProps['variant']
export type DrawerPlacement = DrawerProps['placement']
export type PopoverPosition = PopoverProps['position']
export type PopoverVariant = PopoverProps['variant']

// ============================================================================
// 版本信息
// ============================================================================
export const OVERLAYS_VERSION = '1.0.0'
export const OVERLAYS_BUILD_DATE = new Date().toISOString()

// ============================================================================
// 工具函数 (可选)
// ============================================================================

/**
 * 获取覆盖层 z-index 值的工具函数
 */
export const getOverlayZIndex = (base: number = 1000) => ({
  mask: base,
  content: base + 1,
  arrow: base + 2,
})

/**
 * 覆盖层动画配置
 */
export const overlayAnimations = {
  dialog: {
    initial: { scale: 0.95, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.95, opacity: 0, y: 20 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  },
  drawer: {
    horizontal: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    vertical: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    }
  },
  popover: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
  }
} as const

// ============================================================================
// Sheet 抽屉面板组件
// ============================================================================
export {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetFooter,
  TopSheet,
  BottomSheet,
  LeftSheet,
  RightSheet,
  type SheetProps,
  type SheetHeaderProps,
  type SheetContentProps,
  type SheetFooterProps,
} from './Sheet'

// ============================================================================
// HoverCard 悬浮卡片组件
// ============================================================================
export {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  TopHoverCard,
  BottomHoverCard,
  LeftHoverCard,
  RightHoverCard,
  type HoverCardProps,
  type HoverCardContentProps,
  type HoverCardTriggerProps,
} from './HoverCard'

// ============================================================================
// Lightbox 灯箱组件
// ============================================================================
export {
  Lightbox,
  ImageLightbox,
  type LightboxProps,
  type LightboxImage,
} from './Lightbox'

// ============================================================================
// OverlayTrigger 覆盖层触发器组件
// ============================================================================
export {
  OverlayTrigger,
  Trigger,
  OverlayContent,
  TooltipTrigger,
  DropdownTrigger,
  ModalTrigger,
  type OverlayTriggerProps,
  type TriggerProps,
  type OverlayContentProps,
} from './OverlayTrigger'

// ============================================================================
// 默认导出 - 组件集合
// ============================================================================

// 先导入所有组件
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './Dialog'

import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from './Drawer'

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
} from './Popover'

import { Modal } from './Modal'

import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetFooter,
  TopSheet,
  BottomSheet,
  LeftSheet,
  RightSheet,
} from './Sheet'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  TopHoverCard,
  BottomHoverCard,
  LeftHoverCard,
  RightHoverCard,
} from './HoverCard'

import { Lightbox, ImageLightbox } from './Lightbox'

import {
  OverlayTrigger,
  Trigger,
  OverlayContent,
  TooltipTrigger,
  DropdownTrigger,
  ModalTrigger,
} from './OverlayTrigger'

// 默认导出所有组件
export default {
  // Dialog 组件
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,

  // Drawer 组件
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,

  // Popover 组件
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,

  // Modal 组件
  Modal,

  // Sheet 组件
  Sheet,
  SheetHeader,
  SheetContent,
  SheetFooter,
  TopSheet,
  BottomSheet,
  LeftSheet,
  RightSheet,

  // HoverCard 组件
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  TopHoverCard,
  BottomHoverCard,
  LeftHoverCard,
  RightHoverCard,

  // Lightbox 组件
  Lightbox,
  ImageLightbox,

  // OverlayTrigger 组件
  OverlayTrigger,
  Trigger,
  OverlayContent,
  TooltipTrigger,
  DropdownTrigger,
  ModalTrigger,

  // 工具
  getOverlayZIndex,
  overlayAnimations,

  // 版本信息
  version: OVERLAYS_VERSION,
  buildDate: OVERLAYS_BUILD_DATE,
}