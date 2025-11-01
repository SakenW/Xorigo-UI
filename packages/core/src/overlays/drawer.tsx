'use client'

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cn } from '../utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'

// Drawer Context
interface DrawerContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  placement: DrawerProps['placement']
  size: DrawerProps['size']
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined)

const useDrawerContext = () => {
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error('Drawer components must be used within a Drawer provider')
  }
  return context
}

// Drawer 变体定义
const drawerVariants = cva(
  'fixed bg-white dark:bg-gray-800 shadow-2xl flex flex-col',
  {
    variants: {
      placement: {
        left: 'left-0 top-0 h-full',
        right: 'right-0 top-0 h-full',
        top: 'top-0 left-0 right-0 w-full',
        bottom: 'bottom-0 left-0 right-0 w-full',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
        xl: '',
      },
    },
    defaultVariants: {
      placement: 'right',
      size: 'md',
    },
  }
)

// 尺寸映射
const sizeClasses = {
  sm: {
    left: 'w-80',
    right: 'w-80',
    top: 'h-64',
    bottom: 'h-64',
  },
  md: {
    left: 'w-96',
    right: 'w-96',
    top: 'h-96',
    bottom: 'h-96',
  },
  lg: {
    left: 'w-[32rem]',
    right: 'w-[32rem]',
    top: 'h-[32rem]',
    bottom: 'h-[32rem]',
  },
  xl: {
    left: 'w-[40rem]',
    right: 'w-[40rem]',
    top: 'h-[40rem]',
    bottom: 'h-[40rem]',
  },
}

// Drawer Props
export interface DrawerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerVariants> {
  open: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  maskClosable?: boolean
  closeOnEscape?: boolean
  preventBodyScroll?: boolean
  zIndex?: number
  swipeable?: boolean
  swipeThreshold?: number
}

// Drawer 主组件
export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  ({
    open,
    onOpenChange,
    onClose,
    placement = 'right',
    size = 'md',
    maskClosable = true,
    closeOnEscape = true,
    preventBodyScroll = true,
    zIndex = 1000,
    swipeable = true,
    swipeThreshold = 50,
    className,
    children,
    ...props
  }, ref) => {
    const [internalOpen, setInternalOpen] = useState(open)
    const isOpen = onOpenChange ? open : internalOpen

    const handleOpenChange = useCallback((newOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(newOpen)
      } else {
        setInternalOpen(newOpen)
      }
      if (!newOpen && onClose) {
        onClose()
      }
    }, [onOpenChange, onClose])

    const handleClose = useCallback(() => {
      handleOpenChange(false)
    }, [handleOpenChange])

    // 处理ESC键关闭
    useEffect(() => {
      if (!closeOnEscape || !isOpen) return

      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          handleClose()
        }
      }

      document.addEventListener('keydown', handleEsc)
      return () => document.removeEventListener('keydown', handleEsc)
    }, [closeOnEscape, isOpen, handleClose])

    // 处理滚动锁定
    useEffect(() => {
      if (!preventBodyScroll) return

      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }

      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isOpen, preventBodyScroll])

    // 焦点管理
    const focusRef = useRef<HTMLDivElement>(null)
    const previousFocusRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
      if (isOpen) {
        previousFocusRef.current = document.activeElement as HTMLElement
        const timer = setTimeout(() => {
          focusRef.current?.focus()
        }, 100)
        return () => clearTimeout(timer)
      } else if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }, [isOpen])

    // 手势处理
    const handleDragEnd = useCallback((e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!swipeable) return

      const threshold = swipeThreshold
      const { offset, velocity } = info

      let shouldClose = false

      switch (placement) {
        case 'left':
          shouldClose = offset.x < -threshold || velocity.x < -500
          break
        case 'right':
          shouldClose = offset.x > threshold || velocity.x > 500
          break
        case 'top':
          shouldClose = offset.y < -threshold || velocity.y < -500
          break
        case 'bottom':
          shouldClose = offset.y > threshold || velocity.y > 500
          break
      }

      if (shouldClose) {
        handleClose()
      }
    }, [swipeable, swipeThreshold, placement, handleClose])

    // 获取动画变体
    const getAnimationVariants = () => {
      switch (placement) {
        case 'left':
          return {
            initial: { x: '-100%' },
            animate: { x: 0 },
            exit: { x: '-100%' },
          }
        case 'right':
          return {
            initial: { x: '100%' },
            animate: { x: 0 },
            exit: { x: '100%' },
          }
        case 'top':
          return {
            initial: { y: '-100%' },
            animate: { y: 0 },
            exit: { y: '-100%' },
          }
        case 'bottom':
          return {
            initial: { y: '100%' },
            animate: { y: 0 },
            exit: { y: '100%' },
          }
      }
    }

    // 获取拖拽约束
    const getDragConstraints = () => {
      switch (placement) {
        case 'left':
          return { left: 0, right: 100 }
        case 'right':
          return { left: -100, right: 0 }
        case 'top':
          return { top: 0, bottom: 100 }
        case 'bottom':
          return { top: -100, bottom: 0 }
      }
    }

    // 获取拖拽方向
    const getDrag = () => {
      switch (placement) {
        case 'left':
        case 'right':
          return 'x'
        case 'top':
        case 'bottom':
          return 'y'
      }
    }

    const contextValue: DrawerContextType = {
      open: isOpen,
      onOpenChange: handleOpenChange,
      onClose: handleClose,
      placement,
      size,
    }

    const handleMaskClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && maskClosable) {
        handleClose()
      }
    }

    const drawerContent = (
      <DrawerContext.Provider value={contextValue}>
        <AnimatePresence>
          {isOpen && (
            <>
              {/* 遮罩层 */}
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleMaskClick}
                style={{ zIndex }}
              />

              {/* 抽屉内容 */}
              <motion.div
                ref={ref}
                className={cn(
                  drawerVariants({ placement, size }),
                  sizeClasses[size][placement],
                  className
                )}
                {...getAnimationVariants()}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 300,
                }}
                drag={swipeable ? getDrag() : false}
                dragConstraints={getDragConstraints()}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                style={{ zIndex: zIndex + 1 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title"
                aria-describedby="drawer-description"
                tabIndex={-1}
                {...props}
              >
                {children}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </DrawerContext.Provider>
    )

    return createPortal(drawerContent, document.body)
  }
)

Drawer.displayName = 'Drawer'

// Drawer Header 组件
export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { placement, onClose } = useDrawerContext()

    const isHorizontal = placement === 'left' || placement === 'right'

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700',
          !isHorizontal && 'border-b-0 border-r border-l border-t',
          className
        )}
        {...props}
      >
        <div className="flex items-center space-x-3 flex-1">
          {children}
        </div>
        <motion.button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="关闭抽屉"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>
    )
  }
)

DrawerHeader.displayName = 'DrawerHeader'

// Drawer Content 组件
export interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex-1 overflow-y-auto p-6',
          className
        )}
        id="drawer-description"
        {...props}
      >
        {children}
      </div>
    )
  }
)

DrawerContent.displayName = 'DrawerContent'

// Drawer Footer 组件
export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, children, ...props }, ref) => {
    const { placement } = useDrawerContext()

    const isHorizontal = placement === 'left' || placement === 'right'

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50',
          !isHorizontal && 'border-t-0 border-r border-l border-b',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

DrawerFooter.displayName = 'DrawerFooter'

// Drawer Title 组件
export interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const DrawerTitle = React.forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          'text-xl font-semibold text-gray-900 dark:text-gray-100',
          className
        )}
        id="drawer-title"
        {...props}
      >
        {children}
      </h2>
    )
  }
)

DrawerTitle.displayName = 'DrawerTitle'

// Drawer Description 组件
export interface DrawerDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const DrawerDescription = React.forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-sm text-gray-600 dark:text-gray-400 mt-1',
          className
        )}
        {...props}
      >
        {children}
      </p>
    )
  }
)

DrawerDescription.displayName = 'DrawerDescription'