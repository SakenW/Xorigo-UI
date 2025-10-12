import React, { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  label?: string
  error?: string
  helperText?: string
  checkboxSize?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      required = false,
      disabled = false,
      checkboxSize = 'md',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${React.useId()}`

    // 尺寸类
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    }

    // 变体类
    const variantClasses = {
      default: cn(
        'text-blue-600 border-gray-300 dark:border-gray-600 rounded-sm',
        'focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0',
        error ? 'border-red-500' : ''
      ),
      filled: cn(
        'text-blue-600 border-0 bg-gray-100 dark:bg-gray-900 rounded-sm',
        'focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0',
        error ? 'bg-red-50 dark:bg-red-950/20' : ''
      ),
      outlined: cn(
        'text-blue-600 border-2 border-gray-300 dark:border-gray-600 rounded-sm',
        'focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0',
        error ? 'border-red-500' : ''
      ),
    }

    return (
      <div className={cn('flex flex-col', className)}>
        <div className="flex items-start">
          {/* 复选框 */}
          <div className="flex items-center h-5">
            <motion.input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              disabled={disabled}
              className={cn(
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-hidden cursor-pointer',
                sizeClasses[checkboxSize],
                variantClasses[variant]
              )}
              whileHover={!disabled ? { scale: 1.1 } : undefined}
              whileTap={!disabled ? { scale: 0.9 } : undefined}
              // 过滤掉与Framer Motion冲突的属性
              {...Object.keys(props).reduce((acc, key) => {
                if (!['onDrag', 'onDragStart', 'onDragEnd'].includes(key)) {
                  acc[key] = props[key as keyof typeof props]
                }
                return acc
              }, {} as any)}
            />
          </div>

          {/* 标签和帮助文本 */}
          {label && (
            <div className="ml-3 text-sm">
              <label
                htmlFor={checkboxId}
                className={cn(
                  'font-medium cursor-pointer',
                  disabled
                    ? 'text-gray-400 dark:text-gray-600'
                    : 'text-gray-700 dark:text-gray-300',
                  error ? 'text-red-700 dark:text-red-400' : ''
                )}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {/* 帮助文本 */}
              {!error && helperText && (
                <motion.p
                  className="text-gray-500 dark:text-gray-400 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {helperText}
                </motion.p>
              )}
            </div>
          )}
        </div>

        {/* 错误信息 */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="mt-1 text-sm text-red-600 dark:text-red-400"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
