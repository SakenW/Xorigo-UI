import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  offset?: number
  className?: string
  arrow?: boolean
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  maxWidth?: number
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 200,
  offset = 8,
  className,
  arrow = true,
  disabled = false,
  open,
  onOpenChange,
  maxWidth,
}) => {
  const [internalIsVisible, setInternalIsVisible] = useState(false)
  
  // 使用受控模式或非受控模式
  const isVisible = open !== undefined ? open : internalIsVisible
  const setIsVisible = onOpenChange || setInternalIsVisible
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const updatePosition = () => {
    if (!triggerRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    let x = 0
    let y = 0

    switch (placement) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 + scrollX
        y = triggerRect.top + scrollY - offset
        break
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 + scrollX
        y = triggerRect.bottom + scrollY + offset
        break
      case 'left':
        x = triggerRect.left + scrollX - offset
        y = triggerRect.top + triggerRect.height / 2 + scrollY
        break
      case 'right':
        x = triggerRect.right + scrollX + offset
        y = triggerRect.top + triggerRect.height / 2 + scrollY
        break
    }

    setPosition({ x, y })
  }

  const handleMouseEnter = () => {
    if (disabled) return

    // 如果是受控模式，直接调用onOpenChange
    if (open !== undefined && onOpenChange) {
      onOpenChange(true)
      return
    }

    timeoutRef.current = setTimeout(() => {
      updatePosition()
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // 如果是受控模式，直接调用onOpenChange
    if (open !== undefined && onOpenChange) {
      onOpenChange(false)
      return
    }
    
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isVisible) {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)

      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isVisible])

  const triggerElement = React.cloneElement(children as React.ReactElement<any>, {
    ref: (node: HTMLElement) => {
      // 保存ref到triggerRef
      triggerRef.current = node
      
      // 如果原始子元素有自己的ref，也调用它
      const { ref: originalRef } = children as any
      if (typeof originalRef === 'function') {
        originalRef(node)
      } else if (originalRef) {
        originalRef.current = node
      }
    },
    onMouseEnter: (e: React.MouseEvent) => {
      handleMouseEnter()
      // 安全地调用原始的onMouseEnter
      const childProps = (children as any).props || {}
      if (typeof childProps.onMouseEnter === 'function') {
        childProps.onMouseEnter(e)
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleMouseLeave()
      // 安全地调用原始的onMouseLeave
      const childProps = (children as any).props || {}
      if (typeof childProps.onMouseLeave === 'function') {
        childProps.onMouseLeave(e)
      }
    },
  } as any)

  const getTransformOrigin = () => {
    switch (placement) {
      case 'top':
        return 'bottom center'
      case 'bottom':
        return 'top center'
      case 'left':
        return 'right center'
      case 'right':
        return 'left center'
      default:
        return 'center'
    }
  }

  const getTooltipTransform = () => {
    switch (placement) {
      case 'top':
        return 'translateX(-50%) translateY(-100%)'
      case 'bottom':
        return 'translateX(-50%)'
      case 'left':
        return 'translateX(-100%) translateY(-50%)'
      case 'right':
        return 'translateY(-50%)'
      default:
        return ''
    }
  }

  const getArrowStyles = () => {
    const baseStyles = 'absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45'

    switch (placement) {
      case 'top':
        return cn(baseStyles, 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2')
      case 'bottom':
        return cn(baseStyles, 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2')
      case 'left':
        return cn(baseStyles, 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2')
      case 'right':
        return cn(baseStyles, 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2')
      default:
        return baseStyles
    }
  }

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'fixed z-9999 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg',
            'break-words',
            className
          )}
          style={{
            left: position.x,
            top: position.y,
            transform: getTooltipTransform(),
            transformOrigin: getTransformOrigin(),
            maxWidth: maxWidth || '12rem', // 默认最大宽度为12rem (192px)
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
        >
          {content}
          {arrow && <div className={getArrowStyles()} />}
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {triggerElement}
      {typeof window !== 'undefined' && createPortal(tooltipContent, document.body)}
    </>
  )
}

export default Tooltip
