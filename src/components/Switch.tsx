import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'success' | 'danger'
  loading?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      description,
      size = 'md',
      variant = 'primary',
      checked,
      disabled = false,
      loading = false,
      onChange,
      onCheckedChange,
      className,
      id,
      ...restProps
    },
    ref
  ) => {
    const switchId = id || `switch-${React.useId()}`

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onCheckedChange?.(e.target.checked)
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
            checked={checked}
            disabled={disabled || loading}
            onChange={handleChange}
            className="sr-only peer"
            {...restProps}
          />
          <label
            htmlFor={switchId}
            className={cn(
              'relative inline-flex items-center cursor-pointer',
              'transition-all duration-200',
              (disabled || loading) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <motion.div
              className={cn(
                'relative rounded-full transition-colors duration-200',
                sizeClasses[size].track,
                variantClasses[variant],
                'peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2'
              )}
              whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
            >
              <motion.div
                className={cn(
                  'absolute top-0.5 left-0.5 bg-white rounded-full shadow-md',
                  'flex items-center justify-center',
                  sizeClasses[size].thumb
                )}
                animate={{
                  x: checked ? parseInt(sizeClasses[size].translate.replace(/[^\d]/g, '')) - 2 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
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
            </motion.div>
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

Switch.displayName = 'Switch'

export default Switch
