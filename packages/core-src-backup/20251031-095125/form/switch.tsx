'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../foundations/utils/cn'

// Switch 变体定义
export const switchVariants = cva(
  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-neutral-300)] focus:ring-[var(--color-primary-500)]",
        secondary: "bg-[var(--color-neutral-300)] focus:ring-[var(--color-secondary-500)]",
        success: "bg-[var(--color-neutral-300)] focus:ring-[var(--color-success-500)]",
        warning: "bg-[var(--color-neutral-300)] focus:ring-[var(--color-warning-500)]",
        error: "bg-[var(--color-neutral-300)] focus:ring-[var(--color-error-500)]"
      },
      size: {
        sm: "h-4 w-7",
        md: "h-6 w-11",
        lg: "h-8 w-15"
      },
      state: {
        default: "",
        error: "bg-[var(--color-error-300)]"
      }
    }
  }
)

// Switch Thumb 变体定义
export const switchThumbVariants = cva(
  "inline-block rounded-full bg-white shadow-lg transform transition-transform duration-200",
  {
    variants: {
      variant: {
        primary: "bg-white",
        secondary: "bg-white",
        success: "bg-white",
        warning: "bg-white",
        error: "bg-white"
      },
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5"
      }
    }
  }
)

// Switch 属性接口
export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    VariantProps<typeof switchVariants> {
  label?: string
  error?: boolean
  helperText?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

// Switch 组件
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({
    className,
    variant = "primary",
    size = "md",
    state = "default",
    disabled = false,
    checked,
    defaultChecked = false,
    label,
    error,
    helperText,
    onCheckedChange,
    onChange,
    ...props
  }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked)
    const internalRef = React.useRef<HTMLInputElement>(null)
    const mergedRef = (ref || internalRef) as React.RefObject<HTMLInputElement>

    // 处理选中状态变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked
      setIsChecked(newChecked)
      onCheckedChange?.(newChecked)
      onChange?.(e)
    }

    const isActuallyChecked = checked !== undefined ? checked : isChecked

    const switchElement = (
      <motion.button
        type="button"
        role="switch"
        ref={mergedRef}
        className={cn(
          switchVariants({ variant, size, state, className }),
          isActuallyChecked && "bg-[var(--color-primary-500)]"
        )}
        disabled={disabled}
        aria-disabled={disabled}
        aria-invalid={error || state === 'error'}
        aria-checked={isActuallyChecked}
        aria-describedby={helperText ? `${props.id || 'switch'}-helper` : undefined}
        onClick={() => {
          const newChecked = !isActuallyChecked
          setIsChecked(newChecked)
          onCheckedChange?.(newChecked)
          if (mergedRef.current) {
            mergedRef.current.checked = newChecked
          }
        }}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        transition={{ duration: 0.15 }}
      >
        <motion.span
          className={switchThumbVariants({ variant, size })}
          animate={{
            x: isActuallyChecked
              ? (size === 'sm' ? 12 : size === 'md' ? 20 : 28)
              : (size === 'sm' ? 1 : size === 'md' ? 2 : 3)
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>
    )

    if (label) {
      return (
        <motion.label
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          transition={{ duration: 0.15 }}
        >
          {switchElement}
          <span className={cn(
            "text-sm select-none",
            disabled ? "text-[var(--color-text-disabled)]" : "text-[var(--color-text-primary)]"
          )}>
            {label}
          </span>
        </motion.label>
      )
    }

    return switchElement
  }
)

Switch.displayName = 'Switch'
