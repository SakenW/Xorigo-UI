'use client'

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cn } from '../utils'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

// Popover Context
interface PopoverContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClose: () => void
  variant: PopoverProps['variant']
  position: PopoverProps['position']
  showArrow: boolean
  delay: PopoverProps['delay']
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined)

const usePopoverContext = () => {
  const context = useContext(PopoverContext)
  if (!context) {
    throw new Error('Popover components must be used within a Popover provider')
  }
  return context
}

// Popover 变体定义
const popoverVariants = cva(
  'absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-gray-800',
        card: 'bg-white dark:bg-gray-800 shadow-xl',
        dropdown: 'bg-white dark:bg-gray-800 rounded-lg shadow-lg',
        tooltip: 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm px-2 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// Popover Props
export interface PopoverProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof popoverVariants> {
  open: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  position?: 'top' | 'bottom' | 'left' | 'right'
  showArrow?: boolean
  delay?: number
  closeOnClickOutside?: boolean
  zIndex?: number
  offset?: number
}

// Popover 主组件
export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({
    open,
    onOpenChange,
    onClose,
    variant = 'default',
    position = 'bottom',
    showArrow = true,
    delay = 0,
    closeOnClickOutside = true,
    zIndex = 1000,
    offset = 8,
    className,
    children,
    ...props
  }, ref) => {
    const [internalOpen, setInternalOpen] = useState(open)
    const isOpen = onOpenChange ? open : internalOpen
    const timeoutRef = useRef<NodeJS.Timeout>()

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

    const handleDelayedOpen = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          handleOpenChange(true)
        }, delay)
      } else {
        handleOpenChange(true)
      }
    }, [delay, handleOpenChange])

    const handleDelayedClose = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          handleClose()
        }, delay)
      } else {
        handleClose()
      }
    }, [delay, handleClose])

    // 处理点击外部关闭
    useEffect(() => {
      if (!closeOnClickOutside || !isOpen) return

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Element
        if (!target.closest('[data-popover-content]') && !target.closest('[data-popover-trigger]')) {
          handleClose()
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [closeOnClickOutside, isOpen, handleClose])

    // 清理定时器
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    const contextValue: PopoverContextType = {
      open: isOpen,
      onOpenChange: handleOpenChange,
      onClose: handleClose,
      variant,
      position,
      showArrow,
      delay,
    }

    return (
      <PopoverContext.Provider value={contextValue}>
        <div ref={ref} className="relative inline-block" {...props}>
          {children}
        </div>
      </PopoverContext.Provider>
    )
  }
)

Popover.displayName = 'Popover'

// Popover Trigger 组件
export interface PopoverTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {}

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange, delay } = usePopoverContext()
    const timeoutRef = useRef<NodeJS.Timeout>()

    const handleMouseEnter = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          onOpenChange(true)
        }, delay)
      } else {
        onOpenChange(true)
      }
    }, [delay, onOpenChange])

    const handleMouseLeave = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          onOpenChange(false)
        }, delay)
      } else {
        onOpenChange(false)
      }
    }, [delay, onOpenChange])

    const handleClick = useCallback(() => {
      onOpenChange(!open)
    }, [open, onOpenChange])

    // 清理定时器
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        data-popover-trigger
        {...props}
      >
        {children}
      </button>
    )
  }
)

PopoverTrigger.displayName = 'PopoverTrigger'

// Popover Content 组件
export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end'
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, children, align = 'center', ...props }, ref) => {
    const { open, position, showArrow, variant } = usePopoverContext()
    const contentRef = useRef<HTMLDivElement>(null)
    const [placement, setPlacement] = useState(position)
    const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({})

    // 智能位置调整
    const adjustPosition = useCallback(() => {
      if (!contentRef.current) return

      const rect = contentRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const scrollY = window.scrollY
      const scrollX = window.scrollX

      let newPlacement = position
      let newArrowStyle: React.CSSProperties = {}

      // 根据不同位置进行调整
      switch (position) {
        case 'top':
          if (rect.top < 0) {
            newPlacement = 'bottom'
          }
          break
        case 'bottom':
          if (rect.bottom > viewportHeight) {
            newPlacement = 'top'
          }
          break
        case 'left':
          if (rect.left < 0) {
            newPlacement = 'right'
          }
          break
        case 'right':
          if (rect.right > viewportWidth) {
            newPlacement = 'left'
          }
          break
      }

      // 设置箭头样式
      if (showArrow) {
        switch (newPlacement) {
          case 'top':
            newArrowStyle = {
              bottom: -6,
              left: align === 'center' ? '50%' : align === 'start' ? '20%' : '80%',
              transform: align === 'center' ? 'translateX(-50%) rotate(45deg)' : 'rotate(45deg)',
            }
            break
          case 'bottom':
            newArrowStyle = {
              top: -6,
              left: align === 'center' ? '50%' : align === 'start' ? '20%' : '80%',
              transform: align === 'center' ? 'translateX(-50%) rotate(45deg)' : 'rotate(45deg)',
            }
            break
          case 'left':
            newArrowStyle = {
              right: -6,
              top: align === 'center' ? '50%' : align === 'start' ? '20%' : '80%',
              transform: align === 'center' ? 'translateY(-50%) rotate(45deg)' : 'rotate(45deg)',
            }
            break
          case 'right':
            newArrowStyle = {
              left: -6,
              top: align === 'center' ? '50%' : align === 'start' ? '20%' : '80%',
              transform: align === 'center' ? 'translateY(-50%) rotate(45deg)' : 'rotate(45deg)',
            }
            break
        }
      }

      setPlacement(newPlacement)
      setArrowStyle(newArrowStyle)
    }, [position, showArrow, align])

    useEffect(() => {
      if (open) {
        adjustPosition()
      }
    }, [open, adjustPosition])

    // 获取位置样式
    const getPositionStyles = (): React.CSSProperties => {
      const baseStyles: React.CSSProperties = {
        position: 'absolute',
        zIndex: 1000,
      }

      switch (placement) {
        case 'top':
          return {
            ...baseStyles,
            bottom: 'calc(100% + 8px)',
            left: align === 'center' ? '50%' : align === 'start' ? '0' : '100%',
            transform: align === 'center' ? 'translateX(-50%)' : align === 'end' ? 'translateX(-100%)' : 'none',
          }
        case 'bottom':
          return {
            ...baseStyles,
            top: 'calc(100% + 8px)',
            left: align === 'center' ? '50%' : align === 'start' ? '0' : '100%',
            transform: align === 'center' ? 'translateX(-50%)' : align === 'end' ? 'translateX(-100%)' : 'none',
          }
        case 'left':
          return {
            ...baseStyles,
            right: 'calc(100% + 8px)',
            top: align === 'center' ? '50%' : align === 'start' ? '0' : '100%',
            transform: align === 'center' ? 'translateY(-50%)' : align === 'end' ? 'translateY(-100%)' : 'none',
          }
        case 'right':
          return {
            ...baseStyles,
            left: 'calc(100% + 8px)',
            top: align === 'center' ? '50%' : align === 'start' ? '0' : '100%',
            transform: align === 'center' ? 'translateY(-50%)' : align === 'end' ? 'translateY(-100%)' : 'none',
          }
        default:
          return baseStyles
      }
    }

    // 获取箭头组件
    const getArrowIcon = () => {
      if (!showArrow) return null

      const arrowClass = 'absolute w-3 h-3 bg-inherit border-inherit rotate-45'
      const borderClass = 'border border-gray-200 dark:border-gray-700'

      switch (placement) {
        case 'top':
          return (
            <div
              className={cn(arrowClass, borderClass, 'border-b-0 border-r-0')}
              style={arrowStyle}
            />
          )
        case 'bottom':
          return (
            <div
              className={cn(arrowClass, borderClass, 'border-t-0 border-l-0')}
              style={arrowStyle}
            />
          )
        case 'left':
          return (
            <div
              className={cn(arrowClass, borderClass, 'border-r-0 border-t-0')}
              style={arrowStyle}
            />
          )
        case 'right':
          return (
            <div
              className={cn(arrowClass, borderClass, 'border-l-0 border-b-0')}
              style={arrowStyle}
            />
          )
        default:
          return null
      }
    }

    const content = (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={contentRef}
            className={cn(
              popoverVariants({ variant }),
              variant === 'tooltip' && 'max-w-xs',
              className
            )}
            style={getPositionStyles()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.15,
              ease: [0.4, 0, 0.2, 1]
            }}
            data-popover-content
            role={variant === 'tooltip' ? 'tooltip' : 'dialog'}
            aria-hidden={!open}
            {...props}
          >
            {getArrowIcon()}
            <div className="relative z-10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )

    return createPortal(content, document.body)
  }
)

PopoverContent.displayName = 'PopoverContent'

// Popover Arrow 组件（用于自定义箭头）
export interface PopoverArrowProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PopoverArrow = React.forwardRef<HTMLDivElement, PopoverArrowProps>(
  ({ className, ...props }, ref) => {
    const { position } = usePopoverContext()

    const getArrowIcon = () => {
      switch (position) {
        case 'top':
          return <ChevronDown className="w-4 h-4" />
        case 'bottom':
          return <ChevronUp className="w-4 h-4" />
        case 'left':
          return <ChevronRight className="w-4 h-4" />
        case 'right':
          return <ChevronLeft className="w-4 h-4" />
        default:
          return <ChevronUp className="w-4 h-4" />
      }
    }

    return (
      <div
        ref={ref}
        className={cn('absolute text-gray-200 dark:text-gray-700', className)}
        {...props}
      >
        {getArrowIcon()}
      </div>
    )
  }
)

PopoverArrow.displayName = 'PopoverArrow'