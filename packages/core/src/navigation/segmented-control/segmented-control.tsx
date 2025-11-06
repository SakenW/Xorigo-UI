'use client'
/**
 * SegmentedControl - 分段控制器组件
 *
 * 提供多个选项的单选控件，类似于 iOS 的 UISegmentedControl。
 */

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface SegmentedOption {
  /**
   * 选项唯一标识
   */
  value: string

  /**
   * 选项标签
   */
  label: string

  /**
   * 选项图标
   */
  icon?: React.ReactNode

  /**
   * 是否禁用
   */
  disabled?: boolean
}

export interface SegmentedControlProps {
  /**
   * 选项列表
   */
  options: SegmentedOption[]

  /**
   * 当前选中的值
   */
  value?: string

  /**
   * 默认值
   */
  defaultValue?: string

  /**
   * 值改变时的回调
   */
  onValueChange?: (value: string) => void

  /**
   * 控制器的大小
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * 变体
   */
  variant?: 'default' | 'pilled' | 'bordered'

  /**
   * 是否充满宽度
   */
  fullWidth?: boolean

  /**
   * 自定义类名
   */
  className?: string
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * SegmentedControl 组件
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      size = 'md',
      variant = 'default',
      fullWidth = false,
      className
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || options[0]?.value)
    const activeValue = value !== undefined ? value : internalValue

    const handleValueChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    const sizeStyles = {
      sm: 'h-8 text-xs',
      md: 'h-10 text-sm',
      lg: 'h-12 text-base'
    }

    const variantStyles = {
      default: 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)]',
      pilled: 'bg-[var(--color-surface-elevated)]',
      bordered: 'border-2 border-[var(--color-border)]'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex rounded-md overflow-hidden',
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className
        )}
      >
        {options.map((option) => {
          const isActive = activeValue === option.value
          const isDisabled = option.disabled

          return (
            <motion.button
              key={option.value}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 transition-colors',
                isActive
                  ? 'bg-[var(--color-primary-500)] text-white'
                  : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]',
                isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none'
              )}
              onClick={() => !isDisabled && handleValueChange(option.value)}
              whileTap={{ scale: 0.98 }}
            >
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
            </motion.button>
          )
        })}
      </div>
    )
  }
)

SegmentedControl.displayName = 'SegmentedControl'

// ============================================================================
// Export
// ============================================================================

export type { SegmentedControlProps, SegmentedOption }
