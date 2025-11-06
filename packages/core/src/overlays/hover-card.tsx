'use client'
import React, { forwardRef, useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils'

// HoverCard内容变体配置
const hoverCardContentVariants = cva(
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
      },
      size: {
        sm: 'w-48 p-3',
        md: 'w-64 p-4',
        lg: 'w-80 p-5',
        xl: 'w-96 p-6',
        auto: 'min-w-max p-4',
      },
      variant: {
        default: 'bg-white dark:bg-gray-900',
        dark: 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900',
        colored: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      },
    },
    defaultVariants: {
      position: 'top',
      size: 'md',
      variant: 'default',
    },
  }
)

// 箭头变体配置
const arrowVariants = cva(
  'absolute w-2 h-2 bg-inherit border-inherit',
  {
    variants: {
      position: {
        top: 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 border-t border-l',
        bottom: 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r',
        left: 'right-full top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 border-t border-r',
        right: 'left-full top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45 border-b border-l',
        'top-start': 'bottom-full left-4 translate-y-1/2 rotate-45 border-t border-l',
        'top-end': 'bottom-full right-4 translate-y-1/2 rotate-45 border-t border-l',
        'bottom-start': 'top-full left-4 -translate-y-1/2 rotate-45 border-b border-r',
        'bottom-end': 'top-full right-4 -translate-y-1/2 rotate-45 border-b border-r',
        'left-start': 'right-full top-4 translate-x-1/2 rotate-45 border-t border-r',
        'left-end': 'right-full bottom-4 translate-x-1/2 rotate-45 border-t border-r',
        'right-start': 'left-full top-4 -translate-x-1/2 rotate-45 border-b border-l',
        'right-end': 'left-full bottom-4 -translate-x-1/2 rotate-45 border-b border-l',
      },
    },
    defaultVariants: {
      position: 'top',
    },
  }
)

export interface HoverCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** 触发子元素 */
  children: React.ReactNode
  /** 悬浮内容 */
  content: React.ReactNode
  /** 触发方式 */
  trigger?: 'hover' | 'click' | 'focus'
  /** 位置 */
  position?: VariantProps<typeof hoverCardContentVariants>['position']
  /** 尺寸 */
  size?: VariantProps<typeof hoverCardContentVariants>['size']
  /** 变体 */
  variant?: VariantProps<typeof hoverCardContentVariants>['variant']
  /** 延迟显示时间(ms) */
  openDelay?: number
  /** 延迟隐藏时间(ms) */
  closeDelay?: number
  /** 是否显示箭头 */
  showArrow?: boolean
  /** 是否禁用智能位置调整 */
  disableSmartPosition?: boolean
  /** 自定义容器 */
  container?: HTMLElement | null
  /** z-index */
  zIndex?: number
  /** 最大宽度 */
  maxWidth?: string
  /** 是否禁用Portal */
  disablePortal?: boolean
}

export const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(
  ({
    children,
    content,
    trigger = 'hover',
    position = 'top',
    size = 'md',
    variant = 'default',
    openDelay = 300,
    closeDelay = 150,
    showArrow = true,
    disableSmartPosition = false,
    container,
    zIndex = 1050,
    maxWidth,
    disablePortal = false,
    className,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [adjustedPosition, setAdjustedPosition] = useState(position)
    const triggerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout>()

    // 清理定时器
    const clearTimeoutRef = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }, [])

    // 打开悬浮卡片
    const openCard = useCallback(() => {
      clearTimeoutRef()
      timeoutRef.current = setTimeout(() => {
        setIsOpen(true)
      }, openDelay)
    }, [openDelay, clearTimeoutRef])

    // 关闭悬浮卡片
    const closeCard = useCallback(() => {
      clearTimeoutRef()
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false)
      }, closeDelay)
    }, [closeDelay, clearTimeoutRef])

    // 立即关闭
    const immediatelyCloseCard = useCallback(() => {
      clearTimeoutRef()
      setIsOpen(false)
    }, [clearTimeoutRef])

    // 智能位置调整
    const adjustPosition = useCallback(() => {
      if (!triggerRef.current || !contentRef.current || disableSmartPosition) {
        return
      }

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      let newPosition = position

      // 根据空间调整位置
      if (position.startsWith('top') && triggerRect.top < contentRect.height + 10) {
        newPosition = position.replace('top', 'bottom')
      } else if (position.startsWith('bottom') && viewport.height - triggerRect.bottom < contentRect.height + 10) {
        newPosition = position.replace('bottom', 'top')
      } else if (position.startsWith('left') && triggerRect.left < contentRect.width + 10) {
        newPosition = position.replace('left', 'right')
      } else if (position.startsWith('right') && viewport.width - triggerRect.right < contentRect.width + 10) {
        newPosition = position.replace('right', 'left')
      }

      setAdjustedPosition(newPosition)
    }, [position, disableSmartPosition])

    // 事件处理
    const handleMouseEnter = useCallback(() => {
      if (trigger === 'hover') {
        openCard()
      }
    }, [trigger, openCard])

    const handleMouseLeave = useCallback(() => {
      if (trigger === 'hover') {
        closeCard()
      }
    }, [trigger, closeCard])

    const handleClick = useCallback(() => {
      if (trigger === 'click') {
        setIsOpen(!isOpen)
      }
    }, [trigger, isOpen])

    const handleFocus = useCallback(() => {
      if (trigger === 'focus') {
        openCard()
      }
    }, [trigger, openCard])

    const handleBlur = useCallback(() => {
      if (trigger === 'focus') {
        closeCard()
      }
    }, [trigger, closeCard])

    // 键盘事件处理
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        immediatelyCloseCard()
      }
    }, [immediatelyCloseCard])

    // 位置调整
    useEffect(() => {
      if (isOpen) {
        adjustPosition()
      }
    }, [isOpen, adjustPosition])

    // 清理定时器
    useEffect(() => {
      return () => {
        clearTimeoutRef()
      }
    }, [clearTimeoutRef])

    // 渲染悬浮内容
    const renderContent = () => (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={contentRef}
            className={cn(
              hoverCardContentVariants({ position: adjustedPosition, size, variant }),
              maxWidth && `max-w-[${maxWidth}]`
            )}
            style={{ zIndex }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* 箭头 */}
            {showArrow && (
              <div
                className={cn(
                  arrowVariants({ position: adjustedPosition }),
                  'border border-gray-200 dark:border-gray-800'
                )}
              />
            )}

            {/* 内容 */}
            <div className="relative z-10">
              {content}
            </div>
          </motion.div>
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
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* 触发元素 */}
        <div ref={triggerRef}>
          {children}
        </div>

        {/* 悬浮内容 */}
        {disablePortal ? (
          renderContent()
        ) : (
          createPortal(renderContent(), container || document.body)
        )}
      </div>
    )
  }
)

HoverCard.displayName = 'HoverCard'

// HoverCard内容组件
export interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 标题 */
  title?: string
  /** 描述 */
  description?: string
  /** 是否显示标题 */
  showTitle?: boolean
}

export const HoverCardContent = forwardRef<HTMLDivElement, HoverCardContentProps>(
  ({ className, title, description, showTitle = true, children, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {title && showTitle && (
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {children}
    </div>
  )
)

HoverCardContent.displayName = 'HoverCardContent'

// 快捷触发器组件
export interface HoverCardTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否禁用 */
  disabled?: boolean
}

export const HoverCardTrigger = forwardRef<HTMLDivElement, HoverCardTriggerProps>(
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

HoverCardTrigger.displayName = 'HoverCardTrigger'

// 预设组件
export const TopHoverCard = forwardRef<HTMLDivElement, Omit<HoverCardProps, 'position'>>(
  (props, ref) => <HoverCard ref={ref} position="top" {...props} />
)

TopHoverCard.displayName = 'TopHoverCard'

export const BottomHoverCard = forwardRef<HTMLDivElement, Omit<HoverCardProps, 'position'>>(
  (props, ref) => <HoverCard ref={ref} position="bottom" {...props} />
)

BottomHoverCard.displayName = 'BottomHoverCard'

export const LeftHoverCard = forwardRef<HTMLDivElement, Omit<HoverCardProps, 'position'>>(
  (props, ref) => <HoverCard ref={ref} position="left" {...props} />
)

LeftHoverCard.displayName = 'LeftHoverCard'

export const RightHoverCard = forwardRef<HTMLDivElement, Omit<HoverCardProps, 'position'>>(
  (props, ref) => <HoverCard ref={ref} position="right" {...props} />
)

RightHoverCard.displayName = 'RightHoverCard'

export {
  hoverCardContentVariants,
  arrowVariants,
}