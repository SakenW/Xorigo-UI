'use client'
import React, { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '../system/theming-engine'
import { cn } from '../foundations/utils/cn'
import { X, Eye, EyeOff, Check, AlertCircle, AlertTriangle } from 'lucide-react'
import { getInputAriaProps, generateAriaId } from '../utils/accessibility'

// 使用语义化令牌定义Input变体
const getSemanticInputClasses = () => ({
  // 默认样式 - 带边框和背景
  default: `border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--ring-primary-action)]/20`,

  // 填充样式 - 无边框，有背景色
  filled: `border-0 bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:bg-[var(--bg-secondary)] focus:ring-2 focus:ring-[var(--ring-primary-action)]/20`,

  // 轮廓样式 - 粗边框，透明背景
  outlined: `border-2 border-[var(--border-secondary)] bg-transparent text-[var(--text-primary)] focus:border-[var(--border-focus)]`,

  // 下划线样式 - 仅底部边框
  underlined: `border-0 border-b-2 border-[var(--border-secondary)] bg-transparent text-[var(--text-primary)] rounded-none px-0 focus:border-[var(--border-focus)]`,

  // 幽灵样式 - 透明背景，hover时显示
  ghost: `border-0 bg-transparent text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--ring-primary-action)]/20 hover:bg-[var(--bg-tertiary)]`,

  // 霓虹样式 - 赛博朋克风格
  neon: `border border-[var(--border-info)] bg-[var(--bg-contrast-high)]/50 text-[var(--text-info)] focus:ring-[var(--ring-info)] focus:border-[var(--border-info)] shadow-[0_0_10px_var(--border-info)] focus:shadow-[0_0_20px_var(--border-info)]`,
})

// Input变体配置
const inputVariants = cva(
  // 基础样式
  'w-full rounded-lg transition-all duration-200 focus:outline-hidden disabled:bg-[var(--bg-disabled)] disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // 默认样式 - 带边框和背景
        default: '',

        // 填充样式 - 无边框，有背景色
        filled: '',

        // 轮廓样式 - 粗边框，透明背景
        outlined: '',

        // 下划线样式 - 仅底部边框
        underlined: '',

        // 幽灵样式 - 透明背景，hover时显示
        ghost: '',

        // 霓虹样式 - 赛博朋克风格
        neon: '',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-3 text-base',
      },
      status: {
        default: '',
        error: 'border-[var(--border-error)] focus:border-[var(--border-error)] focus:ring-[var(--ring-error)]/20',
        success: 'border-[var(--border-success)] focus:border-[var(--border-success)] focus:ring-[var(--ring-success)]/20',
        warning: 'border-[var(--border-warning)] focus:border-[var(--border-warning)] focus:ring-[var(--ring-warning)]/20',
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
          ? 'text-xs -top-2 bg-[var(--bg-secondary)] px-1'
          : 'text-sm top-1/2',
        error
          ? 'text-[var(--text-error)]'
          : isFocused
            ? 'text-[var(--text-primary-action)]'
            : 'text-[var(--text-tertiary)]'
      )}
      initial={false}
      animate={{
        scale: isFloating ? 0.85 : 1,
        y: isFloating ? 0 : '-50%',
      }}
      transition={{ duration: 0.2 }}
    >
      {label}
      {required && <span className="text-[var(--text-error)] ml-1">*</span>}
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
      value,
      defaultValue,
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

    // 生成可访问性相关的ID
    const helperId = helperText ? generateAriaId('helper') : undefined
    const errorId = error ? generateAriaId('error') : undefined

    // 合并状态 - 必须在 use 之前定义
    const effectiveStatus = status || validationState || (error ? 'error' : 'default')

    // 构建 describedBy 数组
    const describedByParts = []
    if (helperId) describedByParts.push(helperId)
    if (errorId) describedByParts.push(errorId)
    const describedBy = describedByParts.length > 0 ? describedByParts.join(' ') : undefined

    // 生成可访问性属性
    const ariaProps = getInputAriaProps({
      label: label && !floatingLabel ? label : undefined,
      error,
      helperText,
      required,
      invalid: effectiveStatus === 'error',
      describedBy
    })

    const hasValue = String(value).length > 0
    const shouldShowFloatingLabel = floatingLabel && label

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
          return <Check className="w-4 h-4 text-[var(--text-success)]" />
        case 'error':
          return <AlertCircle className="w-4 h-4 text-[var(--text-error)]" />
        case 'warning':
          return <AlertTriangle className="w-4 h-4 text-[var(--text-warning)]" />
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

    // 获取语义化变体类名
    const getSemanticClasses = () => {
      const semanticVariants = getSemanticInputClasses()
      return semanticVariants[variant as keyof typeof semanticVariants] || ''
    }

    // 获取主题样式
    const getInputThemeStyle = (): React.CSSProperties => {
      if (variant === 'neon') {
        return {
          boxShadow: `0 0 10px ${themeConfig.glow}`,
          borderColor: 'var(--border-info)',
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
            className="block text-sm font-medium text-[var(--text-secondary)] mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {label}
            {required && <span className="text-[var(--text-error)] ml-1">*</span>}
          </motion.label>
        )}

        <div className="relative">
          {/* 左侧前缀区域 */}
          {hasLeftElement && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center">
              {/* 前缀图标 */}
              {leftIcon && (
                <div className="ml-3 text-[var(--text-tertiary)] flex items-center">
                  {leftIcon}
                </div>
              )}
              {/* 前缀文本 */}
              {prefix && (
                <span className={cn(
                  'text-[var(--text-tertiary)] select-none',
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
              defaultValue={value === undefined ? defaultValue : undefined}
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
                getSemanticClasses(),
                // 主题相关的额外样式
                'text-[var(--text-primary)]',
                'placeholder:text-[var(--text-tertiary)]',
                variant === 'neon' && 'text-[var(--text-info)]'
              )}
              style={getInputThemeStyle()}
              whileFocus={{
                scale: disabled ? 1 : 1.01,
                transition: { duration: 0.2 },
              }}
              {...ariaProps}
              // 过滤掉与Framer Motion冲突的属性和自定义组件props
              {...Object.keys(restProps).reduce((acc, key) => {
                const excludedProps = [
                  'onDrag', 'onDragStart', 'onDragEnd',
                  'leftIcon', 'rightIcon', 'prefix', 'suffix',
                  'clearable', 'onClear', 'floatingLabel',
                  'showPasswordToggle', 'loading', 'validationState',
                  'showCharCount', 'onValidationChange'
                ]
                if (!excludedProps.includes(key)) {
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
                  <span className="text-[var(--text-tertiary)] select-none">
                    {suffix}
                  </span>
                )}

                {/* 字符计数 */}
                {showCharCount && maxLength && (
                  <span
                    className={cn(
                      'text-xs',
                      String(value).length >= maxLength
                        ? 'text-[var(--text-error)]'
                        : 'text-[var(--text-tertiary)]'
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
                    className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
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
                    className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </motion.button>
                )}

                {/* 自定义后缀图标 */}
                {rightIcon && <div className="text-[var(--text-tertiary)]">{rightIcon}</div>}
              </div>
            )}
          </div>
        </div>

        {/* 错误信息 */}
        <AnimatePresence>
          {error && (
            <motion.p
              id={errorId}
              className="mt-1 text-sm text-[var(--text-error)]"
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
            id={helperId}
            className="mt-1 text-sm text-[var(--text-tertiary)]"
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

// 导出inputVariants以便外部使用
export { inputVariants }
