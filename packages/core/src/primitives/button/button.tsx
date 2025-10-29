'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import {
  generateAriaProps,
  generateKeyboardNavigation,
  announceToScreenReader,
  checkWCAGCompliance,
  type AriaAttributes
} from '../../utils/accessibility'

// Button 变体定义 - 使用 class-variance-authority
export const buttonVariants = cva(
  // 基础样式
  "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] focus:ring-[var(--color-primary-500)] shadow-md hover:shadow-lg",
        secondary: "bg-[var(--color-surface-primary)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-surface-secondary)] focus:ring-[var(--color-border-default)]",
        'outline-solid': "bg-transparent text-[var(--color-primary-500)] border-2 border-[var(--color-primary-500)] hover:bg-[var(--color-primary-500)] hover:text-white focus:ring-[var(--color-primary-500)]",
        outline: "bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-surface-secondary)] focus:ring-[var(--color-border-default)]",
        ghost: "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-secondary)] focus:ring-[var(--color-border-default)]"
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        xl: "px-8 py-4 text-xl"
      },
      loading: {
        true: "cursor-wait opacity-75",
        false: ""
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      loading: false
    }
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean
  children: React.ReactNode
  // 可访问性增强属性
  ariaLabel?: string
  ariaPressed?: boolean
  ariaExpanded?: boolean
  ariaDescribedBy?: string
  loadingText?: string
  announceStateChange?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    loading = false,
    children,
    disabled,
    ariaLabel,
    ariaPressed,
    ariaExpanded,
    ariaDescribedBy,
    loadingText = 'Loading',
    announceStateChange = false,
    onClick,
    onKeyDown,
    ...props
  }, ref) => {
    // 生成 ARIA 属性
    const ariaProps = generateAriaProps('Button', {
      disabled,
      loading,
      'aria-label': ariaLabel,
      'aria-pressed': ariaPressed,
      'aria-expanded': ariaExpanded,
      'aria-describedby': ariaDescribedBy
    })

    // 生成键盘导航处理
    const keyboardHandlers = generateKeyboardNavigation('Button', {
      onKeyDown
    })

    // 处理点击事件，包含屏幕阅读器公告
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return

      // 状态变化公告
      if (announceStateChange) {
        if (ariaPressed !== undefined) {
          const state = ariaPressed ? 'pressed' : 'not pressed'
          announceToScreenReader(`Button ${state}`)
        }
        if (ariaExpanded !== undefined) {
          const state = ariaExpanded ? 'expanded' : 'collapsed'
          announceToScreenReader(`Button ${state}`)
        }
      }

      onClick?.(event)
    }

    // 处理键盘事件
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      keyboardHandlers.onKeyDown?.(event)
      onKeyDown?.(event)
    }

    // 构建完整的 ARIA 属性
    const finalAriaProps: AriaAttributes = {
      ...ariaProps,
      'aria-label': ariaProps['aria-label'] || (loading ? loadingText : undefined),
      'aria-describedby': ariaDescribedBy || props['aria-describedby'],
      ...(ariaPressed !== undefined && { 'aria-pressed': ariaPressed }),
      ...(ariaExpanded !== undefined && { 'aria-expanded': ariaExpanded })
    }

    // 检查 WCAG 合规性（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      const compliance = checkWCAGCompliance('button', {
        ...props,
        disabled,
        loading,
        ...finalAriaProps
      })

      if (compliance.score < 100) {
        console.warn('Button WCAG Compliance Issues:', compliance.issues)
      }
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, loading }),
          // 确保焦点指示器可见
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          className
        )}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...finalAriaProps}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ duration: 0.15 }}
        {...props}
      >
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
          />
        )}
        <span className={loading ? 'sr-only' : undefined}>
          {loading ? loadingText : children}
        </span>
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
