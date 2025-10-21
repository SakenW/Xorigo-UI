import React, { forwardRef, useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

// Overlay内容变体配置
const overlayContentVariants = cva(
  'absolute z-50 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg',
  {
    variants: {
      position: {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
        'top-start': 'bottom-full left-0 mb-2',
        'top-end': 'bottom-full right-0 mb-2',
        'bottom-start': 'top-full left-0 mt-2',
        'bottom-end': 'top-full right-0 mt-2',
        'left-start': 'right-full top-0 mr-2',
        'left-end': 'right-full bottom-0 mr-2',
        'right-start': 'left-full top-0 ml-2',
        'right-end': 'left-full bottom-0 ml-2',
        center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      },
      size: {
        sm: 'w-48 p-3',
        md: 'w-64 p-4',
        lg: 'w-80 p-5',
        xl: 'w-96 p-6',
        auto: 'min-w-max p-4',
        full: 'w-screen h-screen p-6',
      },
      variant: {
        default: 'bg-white dark:bg-gray-900',
        dark: 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900',
        colored: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        glass: 'backdrop-blur-md bg-white/80 dark:bg-black/80 border-white/20 dark:border-white/10',
      },
    },
    defaultVariants: {
      position: 'bottom',
      size: 'auto',
      variant: 'default',
    },
  }
)

// 遮罩层变体
const backdropVariants = cva(
  'fixed inset-0',
  {
    variants: {
      variant: {
        transparent: 'bg-transparent',
        dark: 'bg-black/20',
        light: 'bg-white/20',
        blur: 'bg-black/10 backdrop-blur-sm',
      },
    },
    defaultVariants: {
      variant: 'transparent',
    },
  }
)

export interface OverlayTriggerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** 触发子元素 */
  children: React.ReactNode
  /** 覆盖层内容 */
  overlay: React.ReactNode
  /** 触发方式 */
  trigger?: 'click' | 'hover' | 'focus' | 'manual'
  /** 是否显示覆盖层 */
  open?: boolean
  /** 受控模式下的关闭回调 */
  onClose?: () => void
  /** 位置 */
  position?: VariantProps<typeof overlayContentVariants>['position']
  /** 尺寸 */
  size?: VariantProps<typeof overlayContentVariants>['size']
  /** 变体 */
  variant?: VariantProps<typeof overlayContentVariants>['variant']
  /** 遮罩层变体 */
  backdropVariant?: VariantProps<typeof backdropVariants>['variant']
  /** 延迟显示时间(ms) */
  openDelay?: number
  /** 延迟隐藏时间(ms) */
  closeDelay?: number
  /** 点击外部是否关闭 */
  closeOnOutsideClick?: boolean
  /** 点击遮罩是否关闭 */
  closeOnBackdropClick?: boolean
  /** 按ESC键是否关闭 */
  closeOnEscape?: boolean
  /** 是否显示遮罩 */
  showBackdrop?: boolean
  /** 是否禁用智能位置调整 */
  disableSmartPosition?: boolean
  /** 自定义容器 */
  container?: HTMLElement | null
  /** z-index */
  zIndex?: number
  /** 最大宽度 */
  maxWidth?: string
  /** 最大高度 */
  maxHeight?: string
  /** 是否禁用Portal */
  disablePortal?: boolean
}

export const OverlayTrigger = forwardRef<HTMLDivElement, OverlayTriggerProps>(
  ({
    children,
    overlay,
    trigger = 'click',
    open: controlledOpen,
    onClose,
    position = 'bottom',
    size = 'auto',
    variant = 'default',
    backdropVariant = 'transparent',
    openDelay = 100,
    closeDelay = 100,
    closeOnOutsideClick = true,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    showBackdrop = false,
    disableSmartPosition = false,
    container,
    zIndex = 1050,
    maxWidth,
    maxHeight,
    disablePortal = false,
    className,
    ...props
  }, ref) => {
    const [internalOpen, setInternalOpen] = useState(false)
    const [adjustedPosition, setAdjustedPosition] = useState(position)
    const triggerRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout>()

    // 当前打开状态（受控或非受控）
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

    // 清理定时器
    const clearTimeoutRef = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }, [])

    // 打开覆盖层
    const openOverlay = useCallback(() => {
      if (trigger === 'manual') return

      clearTimeoutRef()
      timeoutRef.current = setTimeout(() => {
        if (controlledOpen === undefined) {
          setInternalOpen(true)
        }
      }, openDelay)
    }, [trigger, openDelay, controlledOpen, clearTimeoutRef])

    // 关闭覆盖层
    const closeOverlay = useCallback(() => {
      if (trigger === 'manual') return

      clearTimeoutRef()
      timeoutRef.current = setTimeout(() => {
        if (controlledOpen === undefined) {
          setInternalOpen(false)
        }
        onClose?.()
      }, closeDelay)
    }, [trigger, closeDelay, controlledOpen, onClose, clearTimeoutRef])

    // 立即关闭
    const immediatelyCloseOverlay = useCallback(() => {
      clearTimeoutRef()
      if (controlledOpen === undefined) {
        setInternalOpen(false)
      }
      onClose?.()
    }, [controlledOpen, onClose, clearTimeoutRef])

    // 切换覆盖层状态
    const toggleOverlay = useCallback(() => {
      if (isOpen) {
        immediatelyCloseOverlay()
      } else {
        openOverlay()
      }
    }, [isOpen, openOverlay, immediatelyCloseOverlay])

    // 智能位置调整
    const adjustPosition = useCallback(() => {
      if (!triggerRef.current || !overlayRef.current || disableSmartPosition) {
        return
      }

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const overlayRect = overlayRef.current.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      let newPosition = position

      // 根据空间调整位置
      if (position.startsWith('top') && triggerRect.top < overlayRect.height + 10) {
        newPosition = position.replace('top', 'bottom')
      } else if (position.startsWith('bottom') && viewport.height - triggerRect.bottom < overlayRect.height + 10) {
        newPosition = position.replace('bottom', 'top')
      } else if (position.startsWith('left') && triggerRect.left < overlayRect.width + 10) {
        newPosition = position.replace('left', 'right')
      } else if (position.startsWith('right') && viewport.width - triggerRect.right < overlayRect.width + 10) {
        newPosition = position.replace('right', 'left')
      }

      setAdjustedPosition(newPosition)
    }, [position, disableSmartPosition])

    // 事件处理
    const handleMouseEnter = useCallback(() => {
      if (trigger === 'hover') {
        openOverlay()
      }
    }, [trigger, openOverlay])

    const handleMouseLeave = useCallback(() => {
      if (trigger === 'hover') {
        closeOverlay()
      }
    }, [trigger, closeOverlay])

    const handleClick = useCallback((event: React.MouseEvent) => {
      if (trigger === 'click') {
        event.stopPropagation()
        toggleOverlay()
      }
    }, [trigger, toggleOverlay])

    const handleFocus = useCallback(() => {
      if (trigger === 'focus') {
        openOverlay()
      }
    }, [trigger, openOverlay])

    const handleBlur = useCallback(() => {
      if (trigger === 'focus') {
        closeOverlay()
      }
    }, [trigger, closeOverlay])

    // 外部点击处理
    const handleOutsideClick = useCallback((event: MouseEvent) => {
      if (
        closeOnOutsideClick &&
        triggerRef.current &&
        overlayRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        immediatelyCloseOverlay()
      }
    }, [closeOnOutsideClick, immediatelyCloseOverlay])

    // 遮罩点击处理
    const handleBackdropClick = useCallback(() => {
      if (closeOnBackdropClick) {
        immediatelyCloseOverlay()
      }
    }, [closeOnBackdropClick, immediatelyCloseOverlay])

    // 键盘事件处理
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        immediatelyCloseOverlay()
      }
    }, [closeOnEscape, immediatelyCloseOverlay])

    // 位置调整
    useEffect(() => {
      if (isOpen) {
        adjustPosition()
      }
    }, [isOpen, adjustPosition])

    // 外部点击监听
    useEffect(() => {
      if (isOpen && closeOnOutsideClick) {
        document.addEventListener('mousedown', handleOutsideClick)
        return () => document.removeEventListener('mousedown', handleOutsideClick)
      }
    }, [isOpen, closeOnOutsideClick, handleOutsideClick])

    // 键盘事件监听
    useEffect(() => {
      if (isOpen && closeOnEscape) {
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
      }
    }, [isOpen, closeOnEscape, handleKeyDown])

    // 清理定时器
    useEffect(() => {
      return () => {
        clearTimeoutRef()
      }
    }, [clearTimeoutRef])

    // 渲染覆盖层内容
    const renderOverlay = () => (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩层 */}
            {showBackdrop && (
              <motion.div
                className={backdropVariants({ variant: backdropVariant })}
                style={{ zIndex }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleBackdropClick}
              />
            )}

            {/* 覆盖层内容 */}
            <motion.div
              ref={overlayRef}
              className={cn(
                overlayContentVariants({ position: adjustedPosition, size, variant }),
                maxWidth && `max-w-[${maxWidth}]`,
                maxHeight && `max-h-[${maxHeight}]`
              )}
              style={{ zIndex: zIndex + 1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {overlay}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )

    return (
      <div
        ref={ref}
        className={cn('relative inline-block', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {/* 触发元素 */}
        <div ref={triggerRef}>
          {children}
        </div>

        {/* 覆盖层内容 */}
        {disablePortal ? (
          renderOverlay()
        ) : (
          createPortal(renderOverlay(), container || document.body)
        )}
      </div>
    )
  }
)

OverlayTrigger.displayName = 'OverlayTrigger'

// 触发器组件
export interface TriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否禁用 */
  disabled?: boolean
}

export const Trigger = forwardRef<HTMLDivElement, TriggerProps>(
  ({ className, disabled = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-block cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)

Trigger.displayName = 'Trigger'

// 内容组件
export interface OverlayContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const OverlayContent = forwardRef<HTMLDivElement, OverlayContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative z-10', className)}
      {...props}
    />
  )
)

OverlayContent.displayName = 'OverlayContent'

// 预设组件
export const TooltipTrigger = forwardRef<HTMLDivElement, Omit<OverlayTriggerProps, 'trigger' | 'size'>>(
  (props, ref) => (
    <OverlayTrigger
      ref={ref}
      trigger="hover"
      size="auto"
      {...props}
    />
  )
)

TooltipTrigger.displayName = 'TooltipTrigger'

export const DropdownTrigger = forwardRef<HTMLDivElement, Omit<OverlayTriggerProps, 'trigger'>>(
  (props, ref) => (
    <OverlayTrigger
      ref={ref}
      trigger="click"
      {...props}
    />
  )
)

DropdownTrigger.displayName = 'DropdownTrigger'

export const ModalTrigger = forwardRef<HTMLDivElement, Omit<OverlayTriggerProps, 'position' | 'size' | 'showBackdrop'>>(
  (props, ref) => (
    <OverlayTrigger
      ref={ref}
      position="center"
      size="lg"
      showBackdrop
      backdropVariant="dark"
      {...props}
    />
  )
)

ModalTrigger.displayName = 'ModalTrigger'

export {
  overlayContentVariants,
  backdropVariants,
}