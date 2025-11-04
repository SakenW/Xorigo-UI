'use client'

import React, { forwardRef, useState, useCallback, createContext, useContext, isValidElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { cn } from '../../utils'
import { useFormField } from '../form'

// ==============================
// Context
// ==============================

interface FormItemContextValue {
  variant: FormItemProps['variant']
  size: FormItemProps['size']
  disabled: boolean
  readonly: boolean
  required: boolean
  id?: string
}

const FormItemContext = createContext<FormItemContextValue | null>(null)

export const useFormItem = () => {
  const context = useContext(FormItemContext)
  if (!context) {
    throw new Error('useFormItem must be used within a FormItem component')
  }
  return context
}

// ==============================
// Variants
// ==============================

const formItemVariants = cva(
  // 基础样式
  "relative",
  {
    variants: {
      variant: {
        default: "flex flex-col space-y-2",
        stacked: "flex flex-col space-y-1.5",
        inline: "flex items-start gap-3",
        horizontal: "grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-center",
        vertical: "flex flex-col space-y-2",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
      status: {
        default: "",
        error: "has-error",
        success: "has-success",
        warning: "has-warning",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      status: "default",
    },
  }
)

const labelVariants = cva(
  // 基础样式
  "font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "text-sm font-medium text-gray-700 dark:text-gray-300",
        stacked: "text-sm font-medium text-gray-700 dark:text-gray-300",
        inline: "text-sm font-medium text-gray-700 dark:text-gray-300 pt-2",
        horizontal: "text-sm font-medium text-gray-700 dark:text-gray-300 col-span-3 sm:col-span-3",
        vertical: "text-sm font-medium text-gray-700 dark:text-gray-300",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
        xl: "text-lg",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
      required: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      disabled: false,
      required: false,
    },
  }
)

const contentVariants = cva(
  // 基础样式
  "flex-1 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        stacked: "",
        inline: "",
        horizontal: "col-span-9 sm:col-span-9",
        vertical: "",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
        xl: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const helperTextVariants = cva(
  // 基础样式
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "text-xs text-gray-500 dark:text-gray-400 mt-1",
        stacked: "text-xs text-gray-500 dark:text-gray-400",
        inline: "text-xs text-gray-500 dark:text-gray-400",
        horizontal: "col-span-12 text-xs text-gray-500 dark:text-gray-400",
        vertical: "text-xs text-gray-500 dark:text-gray-400 mt-1",
      },
      size: {
        sm: "text-xs",
        md: "text-xs",
        lg: "text-sm",
        xl: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const statusIndicatorVariants = cva(
  // 基础样式
  "absolute flex items-center transition-all duration-200",
  {
    variants: {
      variant: {
        default: "right-3 top-1/2 -translate-y-1/2",
        stacked: "right-3 top-1/2 -translate-y-1/2",
        inline: "right-3 top-1/2 -translate-y-1/2",
        horizontal: "right-3 top-1/2 -translate-y-1/2",
        vertical: "right-3 top-1/2 -translate-y-1/2",
      },
      size: {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-7 h-7",
      },
      status: {
        error: "text-red-500",
        success: "text-green-500",
        warning: "text-yellow-500",
        default: "text-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      status: "default",
    },
  }
)

// ==============================
// Props
// ==============================

export interface FormItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof formItemVariants> {
  label?: string
  description?: string
  helpText?: string
  error?: string | string[] | null
  warning?: string | null
  info?: string | null
  success?: string | null
  required?: boolean
  optional?: boolean
  disabled?: boolean
  readonly?: boolean
  children: React.ReactNode
  showRequiredIndicator?: boolean
  showOptionalIndicator?: boolean
  id?: string
  'aria-describedby'?: string
  'aria-labelledby'?: string
  showStatusIndicator?: boolean
}

// ==============================
// Helper Functions
// ==============================

const getStatusIcon = (status: 'error' | 'warning' | 'success' | 'info', size: number = 16) => {
  const iconProps = { size, className: "flex-shrink-0" }

  // 使用图标组件（如果可用）
  try {
    const icons = {
      error: () => <svg {...iconProps} viewBox="0 0 16 16" fill="currentColor"><path d="M8 0l8 14H0L8 0zm-1 3v6h2V3H7zm0 8v2h2v-2H7z"/></svg>,
      warning: () => <svg {...iconProps} viewBox="0 0 16 16" fill="currentColor"><path d="M8 0l8 14H0L8 0zm0 3c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1s-1-.4-1-1V4c0-.6.4-1 1-1zm0 8c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/></svg>,
      success: () => <svg {...iconProps} viewBox="0 0 16 16" fill="currentColor"><path d="M8 0l10 14H-2L8 0zm-1.5 3.5L8 5l3.5-2.5L10 6 8 8 6 6 6.5 3.5z"/></svg>,
      info: () => <svg {...iconProps} viewBox="0 0 16 16" fill="currentColor"><path d="M8 0l8 14H0L8 0zm0 3c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1s-1-.4-1-1V4c0-.6.4-1 1-1zm0 9c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/></svg>,
    }
    const Icon = icons[status as keyof typeof icons]
    return Icon ? <Icon /> : null
  } catch {
    // 回退到简单文本
    const symbols = { error: '✕', warning: '!', success: '✓', info: 'i' }
    return <span {...iconProps}>{symbols[status as keyof typeof symbols]}</span>
  }
}

const getStatusVariant = (hasError: boolean, hasWarning: boolean, hasSuccess: boolean, hasInfo: boolean): 'error' | 'warning' | 'success' | 'info' | 'default' => {
  if (hasError) return 'error'
  if (hasWarning) return 'warning'
  if (hasSuccess) return 'success'
  if (hasInfo) return 'info'
  return 'default'
}

// ==============================
// FormItem Component
// ==============================

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(({
  className,
  variant,
  size,
  label,
  description,
  helpText,
  error,
  warning,
  info,
  success,
  required = false,
  optional = false,
  disabled = false,
  readonly = false,
  children,
  showRequiredIndicator = true,
  showOptionalIndicator = false,
  id,
  showStatusIndicator = false,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  ...props
}, ref) => {
  // 获取字段上下文（如果在Form内使用）
  let fieldContext = null
  try {
    fieldContext = useFormField()
  } catch {
    // 不在Form内使用，使用props提供的值
  }

  // 合并状态和错误信息
  const isDisabled = disabled || fieldContext?.disabled || false
  const isReadonly = readonly || fieldContext?.readonly || false
  const fieldError = error || fieldContext?.error
  const isRequired = required || fieldContext?.required || false

  // 状态检测
  const hasError = !!fieldError
  const hasWarning = !!warning
  const hasInfo = !!info
  const hasSuccess = !!success
  const hasDescription = !!description
  const hasHelpText = !!helpText

  // 状态变体
  const status = getStatusVariant(hasError, hasWarning, hasSuccess, hasInfo)

  // 生成唯一ID
  const fieldId = id || `form-item-${React.useId()}`
  const labelId = `${fieldId}-label`
  const descriptionId = `${fieldId}-description`
  const helpTextId = `${fieldId}-help`
  const errorId = `${fieldId}-error`
  const warningId = `${fieldId}-warning`
  const infoId = `${fieldId}-info`
  const successId = `${fieldId}-success`

  // 构建aria-describedby
  const ariaDescribedByValues = [
    ariaDescribedBy,
    hasDescription && descriptionId,
    hasHelpText && helpTextId,
    hasError && errorId,
    hasWarning && warningId,
    hasInfo && infoId,
    hasSuccess && successId,
  ].filter(Boolean).join(' ')

  // 上下文值
  const contextValue: FormItemContextValue = {
    variant,
    size,
    disabled: isDisabled,
    readonly: isReadonly,
    required: isRequired,
    id: fieldId,
  }

  // 渲染标签
  const renderLabel = () => {
    if (!label) return null

    return (
      <label
        id={labelId}
        htmlFor={variant === 'horizontal' ? undefined : fieldId}
        className={cn(
          labelVariants({
            variant,
            size,
            required: isRequired,
            disabled: isDisabled,
          })
        )}
      >
        <span className="flex items-center gap-1">
          <span>{label}</span>
          {isRequired && showRequiredIndicator && (
            <span className="text-red-500 ml-0.5" aria-label="required">
              *
            </span>
          )}
          {!isRequired && showOptionalIndicator && (
            <span className="text-gray-400 ml-0.5 text-xs font-normal">
              (可选)
            </span>
          )}
        </span>
      </label>
    )
  }

  // 渲染描述文本
  const renderDescription = () => {
    if (!description) return null

    return (
      <div
        id={descriptionId}
        className={cn(
          helperTextVariants({ variant, size }),
          "text-gray-600 dark:text-gray-300"
        )}
      >
        {description}
      </div>
    )
  }

  // 渲染帮助文本
  const renderHelpText = () => {
    if (!helpText) return null

    return (
      <AnimatePresence mode="wait">
        <motion.div
          id={helpTextId}
          className={helperTextVariants({ variant, size })}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {helpText}
        </motion.div>
      </AnimatePresence>
    )
  }

  // 渲染错误消息
  const renderError = () => {
    if (!fieldError) return null

    const errorMessages = Array.isArray(fieldError) ? fieldError : [fieldError]

    return (
      <AnimatePresence mode="wait">
        <motion.div
          id={errorId}
          className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400"
          role="alert"
          aria-live="polite"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {getStatusIcon('error', 14)}
          <span>{errorMessages[0]}</span>
        </motion.div>
      </AnimatePresence>
    )
  }

  // 渲染警告消息
  const renderWarning = () => {
    if (!warning) return null

    return (
      <motion.div
        id={warningId}
        className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {getStatusIcon('warning', 14)}
        <span>{warning}</span>
      </motion.div>
    )
  }

  // 渲染信息消息
  const renderInfo = () => {
    if (!info) return null

    return (
      <motion.div
        id={infoId}
        className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {getStatusIcon('info', 14)}
        <span>{info}</span>
      </motion.div>
    )
  }

  // 渲染成功消息
  const renderSuccess = () => {
    if (!success) return null

    return (
      <motion.div
        id={successId}
        className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {getStatusIcon('success', 14)}
        <span>{success}</span>
      </motion.div>
    )
  }

  // 渲染状态指示器
  const renderStatusIndicator = () => {
    if (!showStatusIndicator) return null

    return (
      <div className={statusIndicatorVariants({ variant, size, status: status === 'default' ? 'default' : status })}>
        {getStatusIcon(status === 'default' ? 'info' : status, 16)}
      </div>
    )
  }

  // 克隆子元素并添加必要的事件处理器和属性
  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      if (isValidElement(child)) {
        const additionalProps: any = {
          id: variant !== 'horizontal' ? fieldId : undefined,
          disabled: isDisabled,
          readOnly: isReadonly,
          'aria-describedby': ariaDescribedByValues || undefined,
          'aria-labelledby': ariaLabelledBy || (label ? labelId : undefined),
          'aria-invalid': hasError ? 'true' : 'false',
          'aria-required': isRequired ? 'true' : 'false',
          'data-form-item-id': fieldId,
        }

        return React.cloneElement(child, additionalProps)
      }
      return child
    })
  }

  // 渲染主要内容
  const renderContent = () => {
    if (variant === 'horizontal') {
      return (
        <div className={formItemVariants({ variant, size, status })}>
          {renderLabel()}
          <div className={contentVariants({ variant, size })}>
            {renderChildren()}
            {renderDescription()}
            {renderStatusIndicator()}
            <div className="space-y-1">
              {hasError && renderError()}
              {hasWarning && renderWarning()}
              {hasInfo && renderInfo()}
              {hasSuccess && renderSuccess()}
              {hasHelpText && renderHelpText()}
            </div>
          </div>
        </div>
      )
    }

    return (
      <>
        {(variant === 'inline' || variant === 'default' || variant === 'stacked' || variant === 'vertical') && renderLabel()}
        <div className={contentVariants({ variant, size })}>
          {renderChildren()}
          {renderDescription()}
          {renderStatusIndicator()}
        </div>
        <div className="space-y-1">
          {hasError && renderError()}
          {hasWarning && renderWarning()}
          {hasInfo && renderInfo()}
          {hasSuccess && renderSuccess()}
          {hasHelpText && renderHelpText()}
        </div>
      </>
    )
  }

  return (
    <FormItemContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={cn(
          formItemVariants({ variant, size, status }),
          {
            'opacity-50 cursor-not-allowed': isDisabled,
            'opacity-75': isReadonly,
          },
          className
        )}
        {...props}
      >
        {renderContent()}
      </div>
    </FormItemContext.Provider>
  )
})

FormItem.displayName = "FormItem"

export { formItemVariants, labelVariants, contentVariants, helperTextVariants, statusIndicatorVariants }
