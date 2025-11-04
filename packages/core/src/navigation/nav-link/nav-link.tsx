/**
 * NavLink - 导航链接组件
 *
 * 提供带状态的导航链接组件，支持激活状态、下划线样式等。
 */

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface NavLinkProps {
  /**
   * 链接地址
   */
  href: string

  /**
   * 链接标签
   */
  children: React.ReactNode

  /**
   * 是否激活
   */
  active?: boolean

  /**
   * 变体
   */
  variant?: 'default' | 'underline' | 'filled' | 'pilled'

  /**
   * 尺寸
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * 是否禁用
   */
  disabled?: boolean

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
 * NavLink 组件
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      href,
      children,
      active = false,
      variant = 'default',
      size = 'md',
      disabled = false,
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
      default: cn(
        'text-[var(--color-text-primary)] hover:text-[var(--color-primary-600)]',
        active && 'text-[var(--color-primary-600)] font-medium'
      ),
      underline: cn(
        'text-[var(--color-text-primary)] hover:text-[var(--color-primary-600)] border-b-2 border-transparent hover:border-[var(--color-primary-200)]',
        active && 'text-[var(--color-primary-600)] border-[var(--color-primary-500)]'
      ),
      filled: cn(
        'text-[var(--color-text-primary)] hover:text-[var(--color-primary-600)] px-3 py-2 rounded-md',
        active && 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] font-medium'
      ),
      pilled: cn(
        'text-[var(--color-text-primary)] hover:text-[var(--color-primary-600)] px-4 py-2 rounded-full',
        active && 'bg-[var(--color-primary-500)] text-white'
      )
    }

    return (
      <motion.a
        ref={ref}
        href={disabled ? undefined : href}
        className={cn(
          'inline-flex items-center transition-colors',
          sizeStyles[size],
          variantStyles[variant],
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        onClick={disabled ? undefined : onClick}
        whileHover={disabled ? undefined : { scale: 1.05 }}
        whileTap={disabled ? undefined : { scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.a>
    )
  }
)

NavLink.displayName = 'NavLink'

// ============================================================================
// Export
// ============================================================================

export type { NavLinkProps }
