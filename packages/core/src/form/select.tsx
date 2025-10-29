'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../foundations/utils/cn'

// Select 变体定义
export const selectVariants = cva(
  "w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border-[var(--color-primary-300)] bg-[var(--color-background-primary)] text-[var(--color-text-primary)] focus:ring-[var(--color-primary-500)]",
        secondary: "border-[var(--color-secondary-300)] bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)] focus:ring-[var(--color-secondary-500)]",
        outline: "border-[var(--color-neutral-300)] bg-transparent text-[var(--color-text-primary)] focus:ring-[var(--color-primary-500)]",
        ghost: "border-transparent bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-background-hover)]"
      },
      size: {
        sm: "px-2 py-1 text-sm",
        md: "px-3 py-2 text-base",
        lg: "px-4 py-3 text-lg"
      },
      state: {
        default: "",
        error: "border-[var(--color-error-500)] focus:ring-[var(--color-error-500)]",
        success: "border-[var(--color-success-500)] focus:ring-[var(--color-success-500)]"
      }
    }
  }
)

// Select 属性接口
export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  placeholder?: string
  error?: boolean
  helperText?: string
  onValueChange?: (value: string) => void
}

// Select 组件
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    variant = "primary",
    size = "md",
    state = "default",
    disabled = false,
    children,
    error,
    helperText,
    onValueChange,
    onChange,
    ...props
  }, ref) => {
    // 处理值变化
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onValueChange?.(e.target.value)
      onChange?.(e)
    }

    return (
      <motion.select
        ref={ref}
        className={cn(selectVariants({ variant, size, state, className }))}
        disabled={disabled}
        aria-disabled={disabled}
        aria-invalid={error || state === 'error'}
        aria-describedby={helperText ? `${props.id || 'select'}-helper` : undefined}
        {...props}
        onChange={handleChange}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.select>
    )
  }
)

Select.displayName = 'Select'
