import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

// Sheet变体配置
const sheetVariants = cva(
  'fixed bg-white dark:bg-gray-900 shadow-2xl',
  {
    variants: {
      side: {
        top: 'top-0 left-0 right-0 h-auto max-h-[80vh] rounded-b-lg',
        bottom: 'bottom-0 left-0 right-0 h-auto max-h-[80vh] rounded-t-lg',
        left: 'left-0 top-0 bottom-0 w-auto max-w-[80vw]',
        right: 'right-0 top-0 bottom-0 w-auto max-w-[80vw]',
      },
      size: {
        sm: {
          top: 'max-h-[200px]',
          bottom: 'max-h-[200px]',
          left: 'max-w-[300px]',
          right: 'max-w-[300px]',
        },
        md: {
          top: 'max-h-[400px]',
          bottom: 'max-h-[400px]',
          left: 'max-w-[400px]',
          right: 'max-w-[400px]',
        },
        lg: {
          top: 'max-h-[600px]',
          bottom: 'max-h-[600px]',
          left: 'max-w-[600px]',
          right: 'max-w-[600px]',
        },
        xl: {
          top: 'max-h-[800px]',
          bottom: 'max-h-[800px]',
          left: 'max-w-[800px]',
          right: 'max-w-[800px]',
        },
        full: {
          top: 'h-screen',
          bottom: 'h-screen',
          left: 'w-screen',
          right: 'w-screen',
        },
      },
    },
    defaultVariants: {
      side: 'right',
      size: 'md',
    },
  }
)

// 遮罩层变体
const overlayVariants = cva(
  'fixed inset-0 bg-black/50 backdrop-blur-sm',
  {
    variants: {
      variant: {
        default: 'bg-black/50',
        light: 'bg-black/30',
        dark: 'bg-black/70',
        blur: 'bg-black/40 backdrop-blur-md',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// 动画配置
const sheetAnimations = {
  top: {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 },
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  bottom: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  left: {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  right: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
}

export interface SheetProps
  extends Omit<HTMLMotionProps<'div'>, 'size' | 'side'>,
    VariantProps<typeof sheetVariants>,
    VariantProps<typeof overlayVariants> {
  /** 是否打开 */
  open: boolean
  /** 关闭回调 */
  onClose: () => void
  /** 子元素 */
  children: React.ReactNode
  /** 是否显示遮罩 */
  showOverlay?: boolean
  /** 点击遮罩是否关闭 */
  closeOnOverlayClick?: boolean
  /** 按ESC键是否关闭 */
  closeOnEscape?: boolean
  /** 是否阻止背景滚动 */
  preventBodyScroll?: boolean
  /** 自定义容器 */
  container?: HTMLElement | null
  /** z-index */
  zIndex?: number
}

export const Sheet = forwardRef<HTMLDivElement, SheetProps>(
  ({
    open,
    onClose,
    children,
    side = 'right',
    size = 'md',
    variant = 'default',
    showOverlay = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    preventBodyScroll = true,
    container,
    zIndex = 1000,
    className,
    ...props
  }, ref) => {
    const sheetRef = useRef<HTMLDivElement>(null)
    const [isClient, setIsClient] = useState(false)

    // 客户端检测
    useEffect(() => {
      setIsClient(true)
    }, [])

    // ESC键处理
    useEffect(() => {
      if (!open || !closeOnEscape) return

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [open, closeOnEscape, onClose])

    // 阻止背景滚动
    useEffect(() => {
      if (!open || !preventBodyScroll) return

      const originalStyle = window.getComputedStyle(document.body)
      const originalOverflow = originalStyle.overflow

      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = originalOverflow
      }
    }, [open, preventBodyScroll])

    // 焦点管理
    useEffect(() => {
      if (!open || !sheetRef.current) return

      // 获取焦点元素
      const focusableElements = sheetRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>

      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    }, [open])

    // 合并refs
    const mergedRef = React.useCallback((node: HTMLDivElement) => {
      sheetRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }, [ref])

    // 遮罩点击处理
    const handleOverlayClick = React.useCallback(() => {
      if (closeOnOverlayClick) {
        onClose()
      }
    }, [closeOnOverlayClick, onClose])

    // 阻止事件冒泡
    const handleSheetClick = React.useCallback((event: React.MouseEvent) => {
      event.stopPropagation()
    }, [])

    // 渲染内容
    const renderContent = () => (
      <AnimatePresence>
        {open && (
          <>
            {/* 遮罩层 */}
            {showOverlay && (
              <motion.div
                className={overlayVariants({ variant })}
                style={{ zIndex }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleOverlayClick}
              />
            )}

            {/* Sheet内容 */}
            <motion.div
              ref={mergedRef}
              className={cn(sheetVariants({ side, size }), className)}
              style={{ zIndex: zIndex + 1 }}
              {...sheetAnimations[side]}
              onClick={handleSheetClick}
              role="dialog"
              aria-modal="true"
              aria-label={`${side} sheet`}
              {...props}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )

    // 服务端渲染处理
    if (!isClient) {
      return null
    }

    // Portal渲染
    const portalContainer = container || document.body
    return createPortal(renderContent(), portalContainer)
  }
)

Sheet.displayName = 'Sheet'

// Sheet头部组件
export interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 标题 */
  title?: string
  /** 描述 */
  description?: string
  /** 是否显示关闭按钮 */
  showCloseButton?: boolean
  /** 关闭按钮自定义内容 */
  closeButton?: React.ReactNode
  /** 关闭回调 */
  onClose?: () => void
}

export const SheetHeader = forwardRef<HTMLDivElement, SheetHeaderProps>(
  ({
    className,
    title,
    description,
    showCloseButton = true,
    closeButton,
    onClose,
    children,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800', className)}
        {...props}
      >
        <div className="flex-1">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
          {children}
        </div>

        {showCloseButton && (
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="关闭"
          >
            {closeButton || (
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        )}
      </div>
    )
  }
)

SheetHeader.displayName = 'SheetHeader'

// Sheet内容组件
export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex-1 overflow-auto p-6', className)}
      {...props}
    />
  )
)

SheetContent.displayName = 'SheetContent'

// Sheet底部组件
export interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SheetFooter = forwardRef<HTMLDivElement, SheetFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800', className)}
      {...props}
    />
  )
)

SheetFooter.displayName = 'SheetFooter'

// 预设组件
export const TopSheet = forwardRef<HTMLDivElement, Omit<SheetProps, 'side'>>(
  (props, ref) => <Sheet ref={ref} side="top" {...props} />
)

TopSheet.displayName = 'TopSheet'

export const BottomSheet = forwardRef<HTMLDivElement, Omit<SheetProps, 'side'>>(
  (props, ref) => <Sheet ref={ref} side="bottom" {...props} />
)

BottomSheet.displayName = 'BottomSheet'

export const LeftSheet = forwardRef<HTMLDivElement, Omit<SheetProps, 'side'>>(
  (props, ref) => <Sheet ref={ref} side="left" {...props} />
)

LeftSheet.displayName = 'LeftSheet'

export const RightSheet = forwardRef<HTMLDivElement, Omit<SheetProps, 'side'>>(
  (props, ref) => <Sheet ref={ref} side="right" {...props} />
)

RightSheet.displayName = 'RightSheet'

export {
  sheetVariants,
  overlayVariants,
  sheetAnimations,
}