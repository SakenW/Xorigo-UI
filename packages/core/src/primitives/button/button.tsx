'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'

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
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, loading }), className)}
        disabled={disabled || loading}
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
          />
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
