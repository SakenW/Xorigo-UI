/**
 * Link - 基础链接组件
 *
 * 提供统一的链接样式和行为，支持不同变体和状态。
 */

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface LinkProps {
  /**
   * 链接地址
   */
  href: string

  /**
   * 链接标签
   */
  children: React.ReactNode

  /**
   * 变体
   */
  variant?: 'default' | 'primary' | 'secondary' | 'muted'

  /**
   * 是否显示下划线
   */
  underline?: boolean

  /**
   * 是否在新窗口打开
   */
  external?: boolean

  /**
   * 尺寸
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * 自定义类名
   */
  className?: string

  /**
   * 点击处理
   */
  onClick?: () => void
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * Link 组件
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      children,
      variant = 'default',
      underline = true,
      external = false,
      size = 'md',
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }

    const variantStyles = {
      default: 'text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]',
      primary: 'text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)]',
      secondary: 'text-[var(--color-secondary-600)] hover:text-[var(--color-secondary-700)]',
      muted: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
    }

    const target = external ? '_blank' : undefined
    const rel = external ? 'noopener noreferrer' : undefined

    return (
      <motion.a
        ref={ref}
        href={href}
        target={target}
        rel={rel}
        className={cn(
          'inline-flex items-center transition-colors',
          sizeStyles[size],
          variantStyles[variant],
          underline && 'hover:underline',
          className
        )}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
        {external && (
          <svg
            className="ml-1 w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </motion.a>
    )
  }
)

Link.displayName = 'Link'

// ============================================================================
// Export
// ============================================================================

export type { LinkProps }
