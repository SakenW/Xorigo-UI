'use client'
/**
 * CheckboxGroup - 复选框组组件
 *
 * 提供多个复选选项的组合，支持全选/取消全选功能
 */

import React, { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface CheckboxGroupOption {
  value: string
  label: string
  disabled?: boolean
}

export interface CheckboxGroupProps {
  /**
   * 选项列表
   */
  options: CheckboxGroupOption[]

  /**
   * 当前值
   */
  value?: string[]

  /**
   * 默认值
   */
  defaultValue?: string[]

  /**
   * 值变化处理
   */
  onValueChange?: (value: string[]) => void

  /**
   * 尺寸
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * 方向
   */
  direction?: 'horizontal' | 'vertical'

  /**
   * 是否显示全选
   */
  showSelectAll?: boolean

  /**
   * 全选标签
   */
  selectAllLabel?: string

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 自定义类名
   */
  className?: string
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * CheckboxGroup 组件
 */
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      options = [],
      value,
      defaultValue = [],
      onValueChange,
      size = 'md',
      direction = 'vertical',
      showSelectAll = false,
      selectAllLabel = '全选',
      disabled = false,
      className
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = useState(defaultValue)
    const currentValue = isControlled ? value : internalValue

    const handleChange = (optionValue: string, checked: boolean) => {
      const newValue = checked
        ? [...currentValue, optionValue]
        : currentValue.filter((v) => v !== optionValue)

      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    const handleSelectAll = (checked: boolean) => {
      const newValue = checked ? options.map((opt) => opt.value) : []
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    const isAllSelected = currentValue.length === options.length
    const isIndeterminate = currentValue.length > 0 && currentValue.length < options.length

    const sizeStyles = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }

    const directionStyles = {
      horizontal: 'flex-row',
      vertical: 'flex-col'
    }

    return (
      <motion.div
        ref={ref}
        className={cn('space-y-2', className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {showSelectAll && (
          <motion.label
            className={cn(
              'flex items-center space-x-2 cursor-pointer',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            whileHover={!disabled ? { scale: 1.01 } : {}}
          >
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(el) => {
                if (el) {
                  el.indeterminate = isIndeterminate
                }
              }}
              onChange={(e) => handleSelectAll(e.target.checked)}
              disabled={disabled}
              className="sr-only"
            />
            <div
              className={cn(
                'flex items-center justify-center border-2 rounded',
                'border-[var(--color-border-primary)] transition-colors',
                isAllSelected && 'bg-[var(--color-primary-500)] border-[var(--color-primary-500)]',
                sizeStyles[size]
              )}
            >
              {isAllSelected && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium">{selectAllLabel}</span>
          </motion.label>
        )}

        <div className={cn('flex', directionStyles[direction])}>
          {options.map((option) => {
            const checked = currentValue.includes(option.value)

            return (
              <motion.label
                key={option.value}
                className={cn(
                  'flex items-center space-x-2 cursor-pointer',
                  (disabled || option.disabled) && 'opacity-50 cursor-not-allowed'
                )}
                whileHover={!disabled && !option.disabled ? { scale: 1.01 } : {}}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => handleChange(option.value, e.target.checked)}
                  disabled={disabled || option.disabled}
                  className="sr-only"
                />
                <div
                  className={cn(
                    'flex items-center justify-center border-2 rounded transition-colors',
                    'border-[var(--color-border-primary)]',
                    checked && 'bg-[var(--color-primary-500)] border-[var(--color-primary-500)]',
                    sizeStyles[size]
                  )}
                >
                  {checked && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm">{option.label}</span>
              </motion.label>
            )
          })}
        </div>
      </motion.div>
    )
  }
)

CheckboxGroup.displayName = 'CheckboxGroup'

export type { CheckboxGroupProps, CheckboxGroupOption }
