import React, { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  inputSize?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined' | 'underlined' | 'ghost' | 'neon'
  floatingLabel?: boolean
  showPasswordToggle?: boolean
  loading?: boolean
  validationState?: 'success' | 'error' | 'warning'
  showCharCount?: boolean
  onValidationChange?: (isValid: boolean) => void
}

// 浮动标签组件
const FloatingLabel: React.FC<{
  htmlFor: string
  label: string
  required?: boolean
  isFocused: boolean
  hasValue: boolean
  error?: string
}> = ({ htmlFor, label, required, isFocused, hasValue, error }) => {
  return (
    <motion.label
      htmlFor={htmlFor}
      className={cn(
        'absolute left-3 transition-all duration-200 pointer-events-none',
        isFocused || hasValue
          ? 'text-xs -top-2 bg-white dark:bg-gray-800 px-1'
          : 'text-sm top-1/2 -translate-y-1/2',
        error
          ? 'text-red-500'
          : isFocused
            ? 'text-blue-500'
            : 'text-gray-500'
      )}
      animate={{
        scale: isFocused || hasValue ? 0.85 : 1,
        y: isFocused || hasValue ? -24 : 0,
      }}
    >
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </motion.label>
  )
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      inputSize = 'md',
      variant = 'default',
      floatingLabel = false,
      showPasswordToggle = false,
      loading = false,
      validationState,
      showCharCount = false,
      maxLength,
      type = 'text',
      value = '',
      onChange,
      onValidationChange,
      required = false,
      disabled = false,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const inputId = id || `input-${React.useId()}`

    const hasValue = String(value).length > 0
    const shouldShowFloatingLabel = floatingLabel && label

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

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
        error || validationState === 'error'
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
          : '',
        validationState === 'success'
          ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
          : '',
        validationState === 'warning'
          ? 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20'
          : ''
      ),
      filled: cn(
        'border-0 bg-gray-100 dark:bg-gray-900',
        'focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20',
        error || validationState === 'error' ? 'bg-red-50 dark:bg-red-950/20' : ''
      ),
      outlined: cn(
        'border-2 border-gray-300 dark:border-gray-600 bg-transparent',
        'focus:border-blue-500',
        error || validationState === 'error' ? 'border-red-500' : ''
      ),
      underlined: cn(
        'border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent rounded-none px-0',
        'focus:border-blue-500',
        error || validationState === 'error' ? 'border-red-500' : ''
      ),
      ghost: cn(
        'border-0 bg-transparent',
        'focus:ring-2 focus:ring-blue-500/20 hover:bg-gray-100 dark:hover:bg-gray-800'
      ),
      neon: cn(
        'border border-cyan-400 bg-black/50 text-cyan-400',
        'focus:ring-cyan-400 focus:border-cyan-400',
        'shadow-[0_0_10px_rgba(6,182,212,0.3)] focus:shadow-[0_0_20px_rgba(6,182,212,0.5)]'
      ),
    }

    const actualType = type === 'password' && showPassword ? 'text' : type

    return (
      <div className={cn('w-full', className)}>
        {/* 普通标签 */}
        {!shouldShowFloatingLabel && label && (
          <motion.label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}

        <div className="relative">
          {/* 前缀图标 */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* 输入框 */}
          <div className="relative">
            <motion.input
              ref={ref}
              id={inputId}
              type={actualType}
              value={value}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
              maxLength={maxLength}
              className={cn(
                'w-full rounded-lg transition-all duration-200',
                'text-gray-900 dark:text-gray-100',
                'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                'disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed',
                'focus:outline-none',
                sizeClasses[inputSize],
                variantClasses[variant],
                leftIcon ? 'pl-10' : '',
                rightIcon || showPasswordToggle ? 'pr-10' : '',
                shouldShowFloatingLabel && (isFocused || hasValue) ? 'pt-5' : ''
              )}
              whileFocus={{
                scale: 1.01,
                transition: { duration: 0.2 },
              }}
              {...props}
            />

            {/* 浮动标签 */}
            {shouldShowFloatingLabel && (
              <FloatingLabel
                htmlFor={inputId}
                label={label!}
                required={required}
                isFocused={isFocused}
                hasValue={hasValue}
                error={error}
              />
            )}

            {/* 后缀区域 */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              {/* 字符计数 */}
              {showCharCount && maxLength && (
                <span
                  className={cn(
                    'text-xs',
                    String(value).length >= maxLength
                      ? 'text-red-500'
                      : 'text-gray-400'
                  )}
                >
                  {String(value).length}/{maxLength}
                </span>
              )}

              {/* 密码显示切换 */}
              {type === 'password' && showPasswordToggle && (
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </motion.button>
              )}

              {/* 自定义后缀 */}
              {rightIcon}
            </div>
          </div>
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

Input.displayName = 'Input'
