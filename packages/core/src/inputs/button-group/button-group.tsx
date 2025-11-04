/**
 * ButtonGroup - 按钮组组件
 *
 * 将多个按钮组合在一起，提供统一的样式和交互
 */

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface ButtonGroupOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ButtonGroupProps {
  /**
   * 选项列表
   */
  options: ButtonGroupOption[]

  /**
   * 当前值
   */
  value?: string | string[]

  /**
   * 默认值
   */
  defaultValue?: string | string[]

  /**
   * 值变化处理
   */
  onValueChange?: (value: string | string[]) => void

  /**
   * 尺寸
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * 变体
   */
  variant?: 'default' | 'outline' | 'solid' | 'ghost'

  /**
   * 形状
   */
  shape?: 'rounded' | 'pill' | 'square'

  /**
   * 是否多选
   */
  multiple?: boolean

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 自定义类名
   */
  className?: string

  /**
   * 子元素
   */
  children?: React.ReactNode
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * ButtonGroup 组件
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      options = [],
      value,
      defaultValue = '',
      onValueChange,
      size = 'md',
      variant = 'default',
      shape = 'rounded',
      multiple = false,
      disabled = false,
      className,
      children
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : defaultValue
    const isSelected = (optionValue: string) => {
      if (multiple && Array.isArray(currentValue)) {
        return currentValue.includes(optionValue)
      }
      return currentValue === optionValue
    }

    const handleSelect = (optionValue: string) => {
      if (disabled) return

      if (multiple) {
        const newValue = Array.isArray(currentValue)
          ? currentValue.includes(optionValue)
            ? currentValue.filter((v) => v !== optionValue)
            : [...currentValue, optionValue]
          : [optionValue]
        onValueChange?.(newValue)
      } else {
        onValueChange?.(optionValue)
      }
    }

    const sizeStyles = {
      sm: 'h-8 text-sm px-3',
      md: 'h-10 text-base px-4',
      lg: 'h-12 text-lg px-5'
    }

    const shapeStyles = {
      rounded: 'rounded-md',
      pill: 'rounded-full',
      square: 'rounded-none'
    }

    const variantStyles = {
      default: 'border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)]',
      outline: 'border-2 border-[var(--color-primary-500)] bg-transparent',
      solid: 'bg-[var(--color-primary-500)] text-white',
      ghost: 'bg-transparent hover:bg-[var(--color-surface-secondary)]'
    }

    return (
      <motion.div
        ref={ref}
        className={cn('inline-flex', className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {options.map((option, index) => {
          const selected = isSelected(option.value)
          const isFirst = index === 0
          const isLast = index === options.length - 1

          return (
            <motion.button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              disabled={disabled || option.disabled}
              className={cn(
                'inline-flex items-center justify-center font-medium transition-colors',
                'first:rounded-l-md last:rounded-r-md',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                sizeStyles[size],
                selected
                  ? 'bg-[var(--color-primary-500)] text-white'
                  : variantStyles[variant],
                !isFirst && !isLast && 'rounded-none',
                isFirst && !isLast && shapeStyles[shape],
                isLast && !isFirst && shapeStyles[shape]
              )}
              whileHover={!disabled && !option.disabled ? { scale: 1.02 } : {}}
              whileTap={!disabled && !option.disabled ? { scale: 0.98 } : {}}
            >
              {option.label}
            </motion.button>
          )
        })}
        {children}
      </motion.div>
    )
  }
)

ButtonGroup.displayName = 'ButtonGroup'

export type { ButtonGroupProps, ButtonGroupOption }
