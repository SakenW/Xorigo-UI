/**
 * IconButton - 图标按钮组件
 *
 * 仅包含图标的按钮组件，用于节省空间的场景。
 */

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface IconButtonProps {
  /**
   * 图标元素
   */
  icon: React.ReactNode

  /**
   * 按钮变体
   */
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger'

  /**
   * 按钮尺寸
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * 是否圆形
   */
  circle?: boolean

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 工具提示文本
   */
  title?: string

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
 * IconButton 组件
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'default',
      size = 'md',
      circle = true,
      disabled = false,
      title,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: circle ? 'w-8 h-8 p-1.5' : 'w-8 h-8 p-1.5',
      md: circle ? 'w-10 h-10 p-2' : 'w-10 h-10 p-2',
      lg: circle ? 'w-12 h-12 p-2.5' : 'w-12 h-12 p-2.5'
    }

    const variantStyles = {
      default: 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)]',
      primary: 'bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)]',
      secondary: 'bg-[var(--color-secondary-500)] text-white hover:bg-[var(--color-secondary-600)]',
      ghost: 'bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]',
      danger: 'bg-[var(--color-error-500)] text-white hover:bg-[var(--color-error-600)]'
    }

    return (
      <motion.button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center justify-center transition-colors',
          sizeStyles[size],
          circle && 'rounded-full',
          variantStyles[variant],
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        disabled={disabled}
        onClick={onClick}
        title={title}
        whileHover={!disabled ? { scale: 1.05 } : undefined}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        {...props}
      >
        {icon}
      </motion.button>
    )
  }
)

IconButton.displayName = 'IconButton'

// ============================================================================
// Export
// ============================================================================

export type { IconButtonProps }
