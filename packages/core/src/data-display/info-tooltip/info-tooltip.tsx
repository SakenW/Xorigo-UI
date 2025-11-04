/**
 * InfoTooltip - 信息提示组件
 *
 * 为用户提供上下文相关的信息提示，帮助理解界面元素或功能。
 * 支持多种触发方式、位置调整和自定义样式。
 */

import React, { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface InfoTooltipProps {
  /**
   * 触发提示的元素
   */
  children: React.ReactNode

  /**
   * 提示内容
   */
  content: React.ReactNode

  /**
   * 提示内容的位置
   */
  position?: 'top' | 'bottom' | 'left' | 'right'

  /**
   * 触发方式
   */
  trigger?: 'hover' | 'click' | 'focus'

  /**
   * 是否显示箭头
   */
  showArrow?: boolean

  /**
   * 延迟显示时间（毫秒）
   */
  delay?: number

  /**
   * 自定义类名
   */
  className?: string

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 提示框的变体
   */
  variant?: 'default' | 'inverted'

  /**
   * 提示框的大小
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * 强制显示（用于演示或特殊场景）
   */
  forceShow?: boolean
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * InfoTooltip 组件
 *
 * 提供上下文信息提示功能，支持多种触发方式和位置调整
 */
export const InfoTooltip = forwardRef<HTMLDivElement, InfoTooltipProps>(
  (
    {
      children,
      content,
      position = 'top',
      trigger = 'hover',
      showArrow = true,
      delay = 200,
      className,
      disabled = false,
      variant = 'default',
      size = 'md',
      forceShow = false,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false)
    const [timeoutId, setTimeoutId] = useState<number | null>(null)

    // 处理显示
    const handleShow = () => {
      if (disabled || forceShow) return

      if (timeoutId) {
        clearTimeout(timeoutId)
        setTimeoutId(null)
      }

      const id = window.setTimeout(() => {
        setIsVisible(true)
      }, delay)
      setTimeoutId(id)
    }

    // 处理隐藏
    const handleHide = () => {
      if (disabled || forceShow) return

      if (timeoutId) {
        clearTimeout(timeoutId)
        setTimeoutId(null)
      }

      setIsVisible(false)
    }

    // 切换显示状态（用于点击触发）
    const handleToggle = () => {
      if (disabled) return

      if (isVisible) {
        handleHide()
      } else {
        setIsVisible(true)
      }
    }

    // 获取触发事件
    const getTriggerEvents = () => {
      if (disabled || forceShow) return {}

      switch (trigger) {
        case 'click':
          return {
            onClick: handleToggle
          }
        case 'focus':
          return {
            onFocus: handleShow,
            onBlur: handleHide
          }
        case 'hover':
        default:
          return {
            onMouseEnter: handleShow,
            onMouseLeave: handleHide
          }
      }
    }

    // 获取位置样式
    const getPositionStyles = () => {
      const baseStyles = 'absolute z-50 px-3 py-2 rounded-md text-sm font-medium shadow-lg'
      const variantStyles = {
        default: 'bg-[var(--color-tooltip-bg)] text-[var(--color-tooltip-text)] border border-[var(--color-tooltip-border)]',
        inverted: 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)]'
      }
      const sizeStyles = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-2',
        lg: 'text-base px-4 py-3'
      }

      const positionStyles = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
      }

      return cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        positionStyles[position],
        className
      )
    }

    // 获取箭头样式
    const getArrowStyles = () => {
      if (!showArrow) return null

      const baseStyles = 'absolute w-2 h-2 bg-[var(--color-tooltip-bg)] transform rotate-45'
      const variantStyles = variant === 'default' ? 'border border-[var(--color-tooltip-border)]' : ''

      const positionStyles = {
        top: 'top-full left-1/2 transform -translate-x-1/2 -mt-1',
        bottom: 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1',
        left: 'left-full top-1/2 transform -translate-y-1/2 -ml-1',
        right: 'right-full top-1/2 transform -translate-y-1/2 -mr-1'
      }

      return cn(baseStyles, variantStyles, positionStyles[position])
    }

    return (
      <div
        ref={ref}
        className="relative inline-block"
        {...getTriggerEvents()}
        {...props}
      >
        {children}

        <AnimatePresence>
          {(isVisible || forceShow) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={getPositionStyles()}
              role="tooltip"
              aria-hidden={!isVisible}
            >
              {content}
              {showArrow && <div className={getArrowStyles()} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

InfoTooltip.displayName = 'InfoTooltip'

// ============================================================================
// Export
// ============================================================================

export type { InfoTooltipProps }
