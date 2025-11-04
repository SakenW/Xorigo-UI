/**
 * Topbar - 顶部工具栏组件
 *
 * 提供应用顶部的工具栏，支持搜索、用户菜单、通知等功能。
 */

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface TopbarProps {
  /**
   * 工具栏的内容
   */
  children?: React.ReactNode

  /**
   * 工具栏的高度
   */
  height?: number | string

  /**
   * 是否固定在顶部
   */
  fixed?: boolean

  /**
   * 工具栏的变体
   */
  variant?: 'default' | 'bordered' | 'elevated'

  /**
   * 工具栏的对齐方式
   */
  align?: 'left' | 'center' | 'right'

  /**
   * 自定义类名
   */
  className?: string

  /**
   * 自定义样式
   */
  style?: React.CSSProperties
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * Topbar 组件
 *
 * 提供应用顶部的工具栏，支持搜索、用户菜单、通知等功能
 */
export const Topbar = forwardRef<HTMLDivElement, TopbarProps>(
  (
    {
      children,
      height = 64,
      fixed = false,
      variant = 'default',
      align = 'left',
      className,
      style,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: 'bg-[var(--color-surface)]',
      bordered: 'bg-[var(--color-surface)] border-b border-[var(--color-border)]',
      elevated: 'bg-[var(--color-surface)] shadow-md'
    }

    const alignStyles = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end'
    }

    return (
      <motion.header
        ref={ref}
        className={cn(
          'w-full flex items-center px-6 py-3',
          variantStyles[variant],
          fixed && 'sticky top-0 z-50',
          className
        )}
        style={{ height, ...style }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        <div className={cn('flex items-center gap-4 w-full', alignStyles[align])}>
          {children}
        </div>
      </motion.header>
    )
  }
)

Topbar.displayName = 'Topbar'

// ============================================================================
// Export
// ============================================================================

export type { TopbarProps }
