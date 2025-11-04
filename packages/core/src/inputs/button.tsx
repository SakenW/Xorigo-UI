/**
 * Button Component - 按钮组件
 *
 * 一个现代化的按钮组件，支持多种变体、尺寸和状态。
 * 完全集成 Xorigo UI 主题系统，确保在所有主题下的一致性表现。
 *
 * @version 1.0.0
 * @category Inputs
 * @since Xorigo UI v1.5.1
 */

import React, { forwardRef, ButtonHTMLAttributes } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { cn } from '../utils/cn'

/**
 * Button variant types - 按钮变体类型
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

/**
 * Button size types - 按钮尺寸类型
 */
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Button component props - 按钮组件属性
 */
export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> {
  /** Button variant - 按钮变体 */
  variant?: ButtonVariant
  /** Button size - 按钮尺寸 */
  size?: ButtonSize
  /** Loading state - 加载状态 */
  loading?: boolean
  /** Disabled state - 禁用状态 */
  disabled?: boolean
  /** Custom className - 自定义类名 */
  className?: string
  /** Button content - 按钮内容 */
  children: React.ReactNode
  /** Click handler - 点击处理函数 */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

/**
 * Animation variants for Framer Motion - Framer Motion 动画变体
 */
const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeIn"
    }
  },
  disabled: {
    opacity: 0.6,
    cursor: "not-allowed"
  }
}

/**
 * Base button classes - 基础按钮样式类
 */
const baseButtonClasses = [
  // Layout & Structure
  'inline-flex',
  'items-center',
  'justify-center',
  'gap-2',
  'font-medium',
  'rounded-lg',
  'border',
  'transition-all',
  'duration-200',
  'ease-in-out',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-offset-2',
  'focus:ring-[var(--color-primary-500)]',
  'disabled:pointer-events-none',
  'disabled:opacity-60',

  // Responsive design
  'sm:text-sm',
  'md:text-base',
  'lg:text-lg'
]

/**
 * Variant classes - 变体样式类
 */
const variantClasses: Record<ButtonVariant, string[]> = {
  primary: [
    'bg-[var(--color-primary-500)]',
    'text-[var(--color-text-inverse)]',
    'border-[var(--color-primary-500)]',
    'hover:bg-[var(--color-primary-600)]',
    'hover:border-[var(--color-primary-600)]',
    'active:bg-[var(--color-primary-700)]',
    'active:border-[var(--color-primary-700)]'
  ],
  secondary: [
    'bg-[var(--color-secondary-500)]',
    'text-[var(--color-text-inverse)]',
    'border-[var(--color-secondary-500)]',
    'hover:bg-[var(--color-secondary-600)]',
    'hover:border-[var(--color-secondary-600)]',
    'active:bg-[var(--color-secondary-700)]',
    'active:border-[var(--color-secondary-700)]'
  ],
  outline: [
    'bg-transparent',
    'text-[var(--color-primary-600)]',
    'border-[var(--color-primary-500)]',
    'hover:bg-[var(--color-primary-50)]',
    'hover:text-[var(--color-primary-700)]',
    'hover:border-[var(--color-primary-600)]',
    'active:bg-[var(--color-primary-100)]'
  ],
  ghost: [
    'bg-transparent',
    'text-[var(--color-text-secondary)]',
    'border-transparent',
    'hover:bg-[var(--color-surface-100)]',
    'hover:text-[var(--color-text-primary)]',
    'active:bg-[var(--color-surface-200)]'
  ]
}

/**
 * Size classes - 尺寸样式类
 */
const sizeClasses: Record<ButtonSize, string[]> = {
  sm: [
    'h-8',
    'px-3',
    'py-1.5',
    'text-sm',
    'rounded-md'
  ],
  md: [
    'h-10',
    'px-4',
    'py-2',
    'text-base',
    'rounded-lg'
  ],
  lg: [
    'h-12',
    'px-6',
    'py-3',
    'text-lg',
    'rounded-lg'
  ]
}

/**
 * Button Component - 按钮组件
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * <Button variant="outline" size="sm" loading>
 *   Loading...
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // Combine all CSS classes
    const buttonClasses = cn(
      ...baseButtonClasses,
      ...variantClasses[variant],
      ...sizeClasses[size],
      className
    )

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    // Handle click events
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) {
        event.preventDefault()
        return
      }
      onClick?.(event)
    }

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={handleClick}
        variants={buttonVariants}
        whileHover={disabled || loading ? {} : "hover"}
        whileTap={disabled || loading ? {} : "tap"}
        animate={disabled ? "disabled" : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {/* Loading state spinner */}
        {loading && <LoadingSpinner />}

        {/* Button content */}
        <span className={loading ? 'opacity-70' : ''}>
          {children}
        </span>
      </motion.button>
    )
  }
)

Button.displayName = 'Button'