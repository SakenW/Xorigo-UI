'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../foundations/utils/cn'

// Checkbox 变体定义
export const checkboxVariants = cva(
  "relative inline-flex items-center justify-center rounded border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border-[var(--color-primary-300)] bg-[var(--color-background-primary)] focus:ring-[var(--color-primary-500)]",
        secondary: "border-[var(--color-secondary-300)] bg-[var(--color-background-secondary)] focus:ring-[var(--color-secondary-500)]",
        success: "border-[var(--color-success-300)] bg-[var(--color-background-primary)] focus:ring-[var(--color-success-500)]",
        warning: "border-[var(--color-warning-300)] bg-[var(--color-background-primary)] focus:ring-[var(--color-warning-500)]",
        error: "border-[var(--color-error-300)] bg-[var(--color-background-primary)] focus:ring-[var(--color-error-500)]"
      },
      size: {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
      },
      state: {
        default: "",
        error: "border-[var(--color-error-500)]"
      }
    }
  }
)

// Checkbox 属性接口
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    VariantProps<typeof checkboxVariants> {
  label?: string
  error?: boolean
  helperText?: string
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}

// Checkbox 组件
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    className,
    variant = "primary",
    size = "md",
    state = "default",
    disabled = false,
    checked,
    defaultChecked,
    label,
    error,
    helperText,
    indeterminate,
    onCheckedChange,
    onChange,
    ...props
  }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false)
    const internalRef = React.useRef<HTMLInputElement>(null)
    const mergedRef = (ref || internalRef) as React.RefObject<HTMLInputElement>

    // 处理 indeterminate 状态
    React.useEffect(() => {
      if (mergedRef.current && indeterminate !== undefined) {
        mergedRef.current.indeterminate = indeterminate
      }
    }, [indeterminate, mergedRef])

    // 处理选中状态变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked
      setIsChecked(newChecked)
      onCheckedChange?.(newChecked)
      onChange?.(e)
    }

    const checkbox = (
      <motion.input
        type="checkbox"
        ref={mergedRef}
        className={cn(checkboxVariants({ variant, size, state, className }))}
        disabled={disabled}
        checked={checked !== undefined ? checked : isChecked}
        aria-disabled={disabled}
        aria-invalid={error || state === 'error'}
        aria-describedby={helperText ? `${props.id || 'checkbox'}-helper` : undefined}
        {...props}
        onChange={handleChange}
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        transition={{ duration: 0.15 }}
      />
    )

    if (label) {
      return (
        <motion.label
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          transition={{ duration: 0.15 }}
        >
          {checkbox}
          <span className={cn(
            "text-sm select-none",
            disabled ? "text-[var(--color-text-disabled)]" : "text-[var(--color-text-primary)]"
          )}>
            {label}
          </span>
        </motion.label>
      )
    }

    return checkbox
  }
)

Checkbox.displayName = 'Checkbox'
