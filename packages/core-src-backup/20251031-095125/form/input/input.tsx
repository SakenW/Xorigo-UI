'use client'

import React, { useState, forwardRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../foundations/utils/cn'
import { X, Eye, EyeOff, Check, AlertCircle, AlertTriangle } from 'lucide-react'
import {
  generateAriaProps,
  generateKeyboardNavigation,
  announceToScreenReader,
  validateColorContrast,
  checkWCAGCompliance,
  type ComponentAriaAttributes
} from '../../utils/accessibility'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'prefix'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  prefix?: string
  suffix?: string
  clearable?: boolean
  onClear?: () => void
  inputSize?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined' | 'underlined' | 'ghost' | 'neon'
  floatingLabel?: boolean
  showPasswordToggle?: boolean
  loading?: boolean
  status?: 'default' | 'success' | 'error' | 'warning'
  validationState?: 'success' | 'error' | 'warning'
  showCharCount?: boolean
  onValidationChange?: (isValid: boolean) => void
  // 可访问性增强属性
  ariaDescribedBy?: string
  errorMessageId?: string
  helperTextId?: string
  announceValidation?: boolean
  autoComplete?: string
  spellCheck?: boolean
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
  const isFloating = isFocused || hasValue

  return (
    <motion.label
      htmlFor={htmlFor}
      className={cn(
        'absolute left-3 pointer-events-none',
        isFloating
          ? 'text-xs -top-2 bg-white dark:bg-gray-800 px-1'
          : 'text-sm top-1/2',
        error
          ? 'text-red-500'
          : isFocused
            ? 'text-blue-500'
            : 'text-gray-500 dark:text-gray-400'
      )}
      initial={false}
      animate={{
        scale: isFloating ? 0.85 : 1,
        y: isFloating ? 0 : '-50%',
      }}
      transition={{ duration: 0.2 }}
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
      prefix,
      suffix,
      clearable = false,
      onClear,
      id,
      inputSize = 'md',
      variant = 'default',
      floatingLabel = false,
      showPasswordToggle = false,
      loading = false,
      status = 'default',
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
      placeholder,
      ariaDescribedBy,
      errorMessageId,
      helperTextId,
      announceValidation = false,
      autoComplete = 'off',
      spellCheck = false,
      ...restProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const inputId = id || `input-${React.useId()}`
    const errorId = errorMessageId || `${inputId}-error`
    const helperId = helperTextId || `${inputId}-helper`

    const hasValue = String(value).length > 0
    const shouldShowFloatingLabel = floatingLabel && label

    // 合并 status 和 validationState
    const effectiveStatus = status !== 'default' ? status : validationState || 'default'

    // 生成 ARIA 属性
    const ariaProps = generateAriaProps('Input', {
      error,
      required,
      label,
      type,
      disabled
    })

    // 验证状态变化公告
    useEffect(() => {
      if (announceValidation && effectiveStatus !== 'default') {
        let message = ''
        switch (effectiveStatus) {
          case 'success':
            message = 'Input field is valid'
            break
          case 'error':
            message = error ? `Error: ${error}` : 'Input field has an error'
            break
          case 'warning':
            message = helperText || 'Input field has a warning'
            break
        }
        if (message) {
          announceToScreenReader(message)
        }
      }
    }, [effectiveStatus, error, helperText, announceValidation])

    // 清除按钮处理
    const handleClear = () => {
      if (onChange) {
        const event = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(event)
      }
      onClear?.()
    }

    // 获取状态图标
    const getStatusIcon = () => {
      switch (effectiveStatus) {
        case 'success':
          return <Check className="w-4 h-4 text-green-500" />
        case 'error':
          return <AlertCircle className="w-4 h-4 text-red-500" />
        case 'warning':
          return <AlertTriangle className="w-4 h-4 text-yellow-500" />
        default:
          return null
      }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)

      // 焦点状态公告
      if (announceValidation && label) {
        announceToScreenReader(`Focused on ${label} input field`)
      }

      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    // 构建描述性元素ID列表
    const describedByElements = []
    if (error && errorId) describedByElements.push(errorId)
    if (helperText && helperId) describedByElements.push(helperId)
    if (ariaDescribedBy) describedByElements.push(ariaDescribedBy)
    const finalAriaDescribedBy = describedByElements.length > 0 ? describedByElements.join(' ') : undefined

    // 检查 WCAG 合规性（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      const compliance = checkWCAGCompliance('input', {
        ...restProps,
        id: inputId,
        label,
        error,
        required,
        disabled,
        type,
        'aria-invalid': !!error,
        'aria-required': required,
        'aria-describedby': finalAriaDescribedBy
      })

      if (compliance.score < 100) {
        console.warn('Input WCAG Compliance Issues:', compliance.issues)
      }
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
        error || effectiveStatus === 'error'
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
          : '',
        effectiveStatus === 'success'
          ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
          : '',
        effectiveStatus === 'warning'
          ? 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20'
          : ''
      ),
      filled: cn(
        'border-0 bg-gray-100 dark:bg-gray-900',
        'focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20',
        error || effectiveStatus === 'error' ? 'bg-red-50 dark:bg-red-950/20' : ''
      ),
      outlined: cn(
        'border-2 border-gray-300 dark:border-gray-600 bg-transparent',
        'focus:border-blue-500',
        error || effectiveStatus === 'error' ? 'border-red-500' : ''
      ),
      underlined: cn(
        'border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent rounded-none px-0',
        'focus:border-blue-500',
        error || effectiveStatus === 'error' ? 'border-red-500' : ''
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
          {/* 左侧前缀区域 */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center">
            {/* 前缀图标 */}
            {leftIcon && (
              <div className="ml-3 text-gray-400 flex items-center">
                {leftIcon}
              </div>
            )}
            {/* 前缀文本 */}
            {prefix && (
              <span className={cn(
                'text-gray-500 dark:text-gray-400 select-none',
                leftIcon ? 'ml-2' : 'ml-3'
              )}>
                {prefix}
              </span>
            )}
          </div>

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
              placeholder={placeholder}
              required={required}
              autoComplete={autoComplete}
              spellCheck={spellCheck}
              aria-invalid={!!error}
              aria-required={required}
              aria-describedby={finalAriaDescribedBy}
              aria-label={!shouldShowFloatingLabel && label ? label : undefined}
              className={cn(
                'w-full rounded-lg transition-all duration-200',
                'text-gray-900 dark:text-gray-100',
                'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                'disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                // 确保焦点指示器可见
                'focus:ring-blue-500 focus:border-blue-500',
                sizeClasses[inputSize],
                variantClasses[variant],
                leftIcon || prefix ? (leftIcon && prefix ? 'pl-20' : leftIcon ? 'pl-10' : 'pl-16') : '',
                'pr-10',
                shouldShowFloatingLabel && (isFocused || hasValue) ? 'pt-5' : ''
              )}
              whileFocus={{
                scale: 1.01,
                transition: { duration: 0.2 },
              }}
              // 过滤掉与Framer Motion冲突的属性
              {...Object.keys(restProps).reduce((acc, key) => {
                if (!['onDrag', 'onDragStart', 'onDragEnd'].includes(key)) {
                  acc[key] = restProps[key as keyof typeof restProps]
                }
                return acc
              }, {} as any)}
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
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* 后缀文本 */}
              {suffix && (
                <span className="text-gray-500 dark:text-gray-400 select-none">
                  {suffix}
                </span>
              )}

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

              {/* 状态图标 */}
              {effectiveStatus !== 'default' && getStatusIcon()}

              {/* 清除按钮 */}
              {clearable && hasValue && !disabled && (
                <motion.button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="清除"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}

              {/* 密码显示切换 */}
              {type === 'password' && showPasswordToggle && (
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </motion.button>
              )}

              {/* 自定义后缀图标 */}
              {rightIcon && <div className="text-gray-400">{rightIcon}</div>}
            </div>
          </div>
        </div>

        {/* 错误信息 */}
        <AnimatePresence>
          {error && (
            <motion.p
              id={errorId}
              className="mt-1 text-sm text-red-600 dark:text-red-400"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              role="alert"
              aria-live="polite"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* 帮助信息 */}
        {!error && helperText && (
          <motion.p
            id={helperId}
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="note"
            aria-live="polite"
          >
            {helperText}
          </motion.p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
