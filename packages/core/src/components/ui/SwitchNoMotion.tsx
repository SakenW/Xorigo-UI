'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/utils'

export interface SwitchNoMotionProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'success' | 'danger'
  loading?: boolean
  onCheckedChange?: (checked: boolean) => void
  defaultChecked?: boolean
}

export const SwitchNoMotion = forwardRef<HTMLInputElement, SwitchNoMotionProps>(
  (
    {
      label,
      description,
      size = 'md',
      variant = 'primary',
      checked,
      defaultChecked,
      disabled = false,
      loading = false,
      onChange,
      onCheckedChange,
      className,
      id,
      ...restProps
    },
    forwardedRef
  ) => {
    const switchId = id || `switch-no-motion-${React.useId()}`

    // 内部 ref 和状态用于非受控模式
    const internalRef = React.useRef<HTMLInputElement>(null)
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false)

    // 合并 ref
    const ref = forwardedRef || internalRef

    // 判断是否为受控组件
    const isControlled = checked !== undefined
    const currentChecked = isControlled ? checked : internalChecked

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked
      console.log(`[SwitchNoMotion ${switchId}] ✅ handleChange 触发:`, {
        newChecked,
        isControlled,
        currentChecked,
        internalChecked
      })

      // 如果是非受控模式，更新内部状态
      if (!isControlled) {
        console.log(`[SwitchNoMotion ${switchId}] 🔄 更新内部状态为:`, newChecked)
        setInternalChecked(newChecked)
      }

      onChange?.(e)
      onCheckedChange?.(newChecked)
    }

    const handleClick = (e: React.MouseEvent) => {
      console.log(`[SwitchNoMotion ${switchId}] 🖱️ label 点击`, e.target)
    }

    const sizeClasses = {
      sm: {
        track: 'w-9 h-5',
        thumb: 'w-4 h-4',
        translate: 'translate-x-4',
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-5',
      },
      lg: {
        track: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: 'translate-x-7',
      },
    }

    const variantClasses = {
      default: 'bg-gray-200 dark:bg-gray-700 peer-checked:bg-gray-900 dark:peer-checked:bg-gray-100',
      primary: 'bg-gray-200 dark:bg-gray-700 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500',
      success: 'bg-gray-200 dark:bg-gray-700 peer-checked:bg-green-600 dark:peer-checked:bg-green-500',
      danger: 'bg-gray-200 dark:bg-gray-700 peer-checked:bg-red-600 dark:peer-checked:bg-red-500',
    }

    return (
      <div className={cn('inline-flex items-start gap-3', className)}>
        <div className="flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            checked={currentChecked}
            disabled={disabled || loading}
            onChange={handleChange}
            className="sr-only peer"
            {...restProps}
          />
          <label
            htmlFor={switchId}
            onClick={handleClick}
            className={cn(
              'relative inline-flex items-center cursor-pointer',
              'transition-all duration-200',
              (disabled || loading) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* 不使用 motion.div，直接用普通 div */}
            <div
              className={cn(
                'relative rounded-full transition-colors duration-200',
                sizeClasses[size].track,
                variantClasses[variant],
                'peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2'
              )}
            >
              <div
                className={cn(
                  'absolute top-0.5 left-0.5 bg-white rounded-full shadow-md',
                  'flex items-center justify-center',
                  'transition-transform duration-200 ease-in-out',
                  sizeClasses[size].thumb,
                  currentChecked && sizeClasses[size].translate
                )}
              >
                {loading && (
                  <div
                    className={cn(
                      'border-2 border-gray-300 border-t-transparent rounded-full animate-spin',
                      size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-3 h-3' : 'w-3.5 h-3.5'
                    )}
                  />
                )}
              </div>
            </div>
          </label>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={switchId}
                className={cn(
                  'text-sm font-medium text-gray-900 dark:text-white',
                  'cursor-pointer select-none',
                  (disabled || loading) && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

SwitchNoMotion.displayName = 'SwitchNoMotion'

export default SwitchNoMotion
