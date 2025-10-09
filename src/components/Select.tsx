import React, { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  selectSize?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined' | 'underlined'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder,
      id,
      required = false,
      disabled = false,
      selectSize = 'md',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${React.useId()}`

    // 尺寸类
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-3 text-base',
    }

    // 变体类
    const variantClasses = {
      default: cn(
        'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
        'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
      ),
      filled: cn(
        'border-0 bg-gray-100 dark:bg-gray-900',
        'focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20',
        error ? 'bg-red-50 dark:bg-red-950/20' : ''
      ),
      outlined: cn(
        'border-2 border-gray-300 dark:border-gray-600 bg-transparent',
        'focus:border-blue-500',
        error ? 'border-red-500' : ''
      ),
      underlined: cn(
        'border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent rounded-none px-0',
        'focus:border-blue-500',
        error ? 'border-red-500' : ''
      ),
    }

    return (
      <div className={cn('w-full', className)}>
        {/* 标签 */}
        {label && (
          <motion.label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}

        {/* 选择框 */}
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={cn(
            'w-full rounded-lg transition-all duration-200',
            'text-gray-900 dark:text-gray-100',
            'disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed',
            'focus:outline-none',
            'appearance-none',
            'bg-[url(\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgN0wxMCAxMkwxNSA3IiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==\')] bg-no-repeat bg-[center_right_0.75rem]',
            sizeClasses[selectSize],
            variantClasses[variant]
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

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

        {/* 帮助信息 */}
        {!error && helperText && (
          <motion.p
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {helperText}
          </motion.p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
