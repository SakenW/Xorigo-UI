'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils'

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'success' | 'danger'
  loading?: boolean
  disabled?: boolean
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked,
      onCheckedChange,
      onChange,
      label,
      description,
      size = 'md',
      variant = 'primary',
      loading = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false)
    // 为每个 Switch 生成唯一 ID
    const uniqueId = React.useId()

    // 判断是否为受控组件
    const isControlled = checked !== undefined
    const currentChecked = isControlled ? checked : internalChecked

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked

      // 如果是非受控模式，更新内部状态
      if (!isControlled) {
        setInternalChecked(newChecked)
      }

      onChange?.(e)
      onCheckedChange?.(newChecked)
    }

    // 尺寸配置
    const sizeClasses = {
      sm: {
        track: 'w-9 h-5',
        thumb: 'w-4 h-4',
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-5 h-5',
      },
      lg: {
        track: 'w-14 h-7',
        thumb: 'w-6 h-6',
      },
    }

    const variantClasses = {
      default:
        'bg-gray-200 dark:bg-gray-700 peer-checked:bg-gray-900 dark:peer-checked:bg-gray-100',
      primary:
        'bg-gray-200 dark:bg-gray-700 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500',
      success:
        'bg-gray-200 dark:bg-gray-700 peer-checked:bg-green-600 dark:peer-checked:bg-green-500',
      danger:
        'bg-gray-200 dark:bg-gray-700 peer-checked:bg-red-600 dark:peer-checked:bg-red-500',
    }

    return (
      <div className={cn('flex items-start gap-3', className)}>
        <div className="relative inline-flex items-center">
          <label
            className={cn(
              'relative inline-flex cursor-pointer items-center',
              'transition-all duration-200',
              (disabled || loading) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input
              ref={ref}
              type="checkbox"
              className="peer sr-only"
              checked={currentChecked}
              onChange={handleChange}
              disabled={disabled || loading}
              {...props}
            />
            <div
              className={cn(
                'relative rounded-full transition-colors duration-200',
                sizeClasses[size].track,
                variantClasses[variant],
                'peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2'
              )}
            >
              {/* Thumb - 使用 layout animation */}
              <motion.div
                layout
                className={cn(
                  'absolute bg-white rounded-full shadow-md',
                  'flex items-center justify-center',
                  sizeClasses[size].thumb,
                  currentChecked ? 'right-0.5 top-0.5' : 'left-0.5 top-0.5'
                )}
                transition={{
                  layout: {
                    type: 'spring',
                    stiffness: 700,
                    damping: 40,
                  }
                }}
              >
                {loading && (
                  <div
                    className={cn(
                      'border-2 border-gray-300 border-t-transparent rounded-full animate-spin',
                      size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-3 h-3' : 'w-3.5 h-3.5'
                    )}
                  />
                )}
              </motion.div>
            </div>
          </label>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span
                className={cn(
                  'text-sm font-medium text-gray-900 dark:text-gray-100',
                  (disabled || loading) && 'opacity-50'
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span
                className={cn(
                  'text-sm text-gray-500 dark:text-gray-400',
                  (disabled || loading) && 'opacity-50'
                )}
              >
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

Switch.displayName = 'Switch'
