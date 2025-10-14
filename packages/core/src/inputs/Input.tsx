'use client'

import React, { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'
import { X, Eye, EyeOff, Check, AlertCircle, AlertTriangle } from 'lucide-react'

// Input变体配置
const inputVariants = cva(
  // 基础样式
  'w-full rounded-lg transition-all duration-200 focus:outline-hidden disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // 默认样式 - 带边框和背景
        default:
          'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',

        // 填充样式 - 无边框，有背景色
        filled:
          'border-0 bg-gray-100 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20',

        // 轮廓样式 - 粗边框，透明背景
        outlined:
          'border-2 border-gray-300 dark:border-gray-600 bg-transparent focus:border-blue-500',

        // 下划线样式 - 仅底部边框
        underlined:
          'border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent rounded-none px-0 focus:border-blue-500',

        // 幽灵样式 - 透明背景，hover时显示
        ghost:
          'border-0 bg-transparent focus:ring-2 focus:ring-blue-500/20 hover:bg-gray-100 dark:hover:bg-gray-800',

        // 霓虹样式 - 赛博朋克风格
        neon:
          'border border-cyan-400 bg-black/50 text-cyan-400 focus:ring-cyan-400 focus:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)] focus:shadow-[0_0_20px_rgba(6,182,212,0.5)]',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-3 text-base',
      },
      status: {
        default: '',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
        warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20',
      },
      hasLeftElement: {
        true: '',
      },
      hasRightElement: {
        true: '',
      },
      floatingLabel: {
        true: '',
      },
    },
    compoundVariants: [
      // 左侧元素时的padding
      {
        hasLeftElement: true,
        floatingLabel: false,
        size: 'sm',
        className: 'pl-10',
      },
      {
        hasLeftElement: true,
        floatingLabel: false,
        size: 'md',
        className: 'pl-10',
      },
      {
        hasLeftElement: true,
        floatingLabel: false,
        size: 'lg',
        className: 'pl-12',
      },
      // 右侧元素时的padding
      {
        hasRightElement: true,
        size: 'sm',
        className: 'pr-10',
      },
      {
        hasRightElement: true,
        size: 'md',
        className: 'pr-10',
      },
      {
        hasRightElement: true,
        size: 'lg',
        className: 'pr-12',
      },
      // 浮动标签时的padding
      {
        floatingLabel: true,
        size: 'sm',
        className: 'pt-6',
      },
      {
        floatingLabel: true,
        size: 'md',
        className: 'pt-6',
      },
      {
        floatingLabel: true,
        size: 'lg',
        className: 'pt-7',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      status: 'default',
      hasLeftElement: false,
      hasRightElement: false,
      floatingLabel: false,
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'prefix'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  prefix?: string
  suffix?: string
  clearable?: boolean
  onClear?: () => void
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
      variant = 'default',
      size = 'md',
      status,
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
      placeholder,
      ...restProps
    },
    ref
  ) => {
    const { themeConfig } = useTheme()
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const inputId = id || `input-${React.useId()}`

    const hasValue = String(value).length > 0
    const shouldShowFloatingLabel = floatingLabel && label

    // 合并状态
    const effectiveStatus = status || validationState || (error ? 'error' : 'default')

    // 确定是否有左侧和右侧元素
    const hasLeftElement = !!(leftIcon || prefix)
    const hasRightElement = !!(
      suffix ||
      showCharCount ||
      effectiveStatus !== 'default' ||
      clearable ||
      showPasswordToggle ||
      rightIcon
    )

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
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    const actualType = type === 'password' && showPassword ? 'text' : type

    // 获取主题样式
    const getInputThemeStyle = (): React.CSSProperties => {
      if (variant === 'neon') {
        return {
          boxShadow: `0 0 10px ${themeConfig.glow}`,
          borderColor: (themeConfig.colors?.[400] as unknown as string) || '#38bdf8',
        }
      }
      return {}
    }

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
          {hasLeftElement && (
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
              placeholder={placeholder}
              className={cn(
                inputVariants({
                  variant,
                  size,
                  status: effectiveStatus as any,
                  hasLeftElement,
                  hasRightElement,
                  floatingLabel,
                }),
                // 主题相关的额外样式
                'text-gray-900 dark:text-gray-100',
                'placeholder:text-gray-500 dark:placeholder:text-gray-400',
                variant === 'neon' && 'text-cyan-400'
              )}
              style={getInputThemeStyle()}
              whileFocus={{
                scale: disabled ? 1 : 1.01,
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
            {hasRightElement && (
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
            )}
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
