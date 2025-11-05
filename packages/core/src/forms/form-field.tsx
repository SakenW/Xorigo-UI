import React, { forwardRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils'
import { useFormField } from './forms-index'
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'

// ==============================
// Variants
// ==============================

const formFieldVariants = cva(
  // 基础样式
  "relative",
  {
    variants: {
      variant: {
        default: "flex flex-col space-y-2",
        stacked: "flex flex-col space-y-1",
        inline: "flex items-center space-x-3",
        floating: "relative",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
      status: {
        default: "",
        error: "",
        success: "",
        warning: "",
        info: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      status: "default",
    },
  }
)

const formLabelVariants = cva(
  // 基础样式
  "font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default: "text-sm font-medium text-gray-700 dark:text-gray-300",
        stacked: "text-xs font-medium text-gray-600 dark:text-gray-400",
        inline: "text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap",
        floating: "text-sm font-medium text-gray-700 dark:text-gray-300",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
        xl: "text-lg",
      },
      required: {
        true: "",
        false: "",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
      floating: {
        true: "absolute left-3 top-3 bg-white dark:bg-gray-900 px-1 transition-all duration-200 z-10",
        false: "",
      },
      hasValue: {
        true: "",
        false: "",
      },
      focused: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      required: false,
      disabled: false,
      floating: false,
      hasValue: false,
      focused: false,
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
        floating: "text-xs text-gray-500 dark:text-gray-400 mt-1",
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

const errorTextVariants = cva(
  // 基础样式
  "flex items-center space-x-1 font-medium",
  {
    variants: {
      variant: {
        default: "text-xs text-red-600 dark:text-red-400 mt-1",
        stacked: "text-xs text-red-600 dark:text-red-400",
        inline: "text-xs text-red-600 dark:text-red-400 ml-2",
        floating: "text-xs text-red-600 dark:text-red-400 mt-1",
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

// ==============================
// Props
// ==============================

export interface FormFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof formFieldVariants> {
  label?: string
  description?: string
  helpText?: string
  required?: boolean
  optional?: boolean
  error?: string | string[]
  warning?: string
  info?: string
  success?: string
  disabled?: boolean
  readonly?: boolean
  children: React.ReactNode
  showRequiredIndicator?: boolean
  showOptionalIndicator?: boolean
  id?: string
  'aria-describedby'?: string
  'aria-labelledby'?: string
}

// ==============================
// Helper Functions
// ==============================

const getStatusIcon = (status: 'error' | 'warning' | 'success' | 'info', size: number = 14) => {
  const iconProps = { size, className: "flex-shrink-0" }

  switch (status) {
    case 'error':
      return <AlertCircle {...iconProps} />
    case 'warning':
      return <AlertTriangle {...iconProps} />
    case 'success':
      return <CheckCircle {...iconProps} />
    case 'info':
      return <Info {...iconProps} />
    default:
      return null
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
// FormField Component
// ==============================

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(({
  className,
  variant,
  size,
  label,
  description,
  helpText,
  required = false,
  optional = false,
  error,
  warning,
  info,
  success,
  disabled = false,
  readonly = false,
  children,
  showRequiredIndicator = true,
  showOptionalIndicator = false,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  ...props
}, ref) => {
  // 内部状态（用于floating label）
  const [focused, setFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

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

  // 生成ID
  const fieldId = id || `form-field-${React.useId()}`
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

  // 处理焦点变化
  const handleFocus = useCallback((e: React.FocusEvent) => {
    if (variant === 'floating') {
      setFocused(true)
    }
    // 如果子组件有onFocus，调用它
    const target = e.target as HTMLElement
    if (target.onfocus) {
      target.onfocus(e)
    }
  }, [variant])

  const handleBlur = useCallback((e: React.FocusEvent) => {
    if (variant === 'floating') {
      setFocused(false)
    }
    // 检查是否有值
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    if (target) {
      setHasValue(!!target.value)
    }
    // 如果子组件有onBlur，调用它
    if (target.onblur) {
      target.onblur(e)
    }
  }, [variant])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (variant === 'floating') {
      setHasValue(!!e.target.value)
    }
  }, [variant])

  // 渲染标签
  const renderLabel = () => {
    if (!label) return null

    const isFloating = variant === 'floating'
    const shouldFloat = isFloating && (focused || hasValue)

    return (
      <label
        id={labelId}
        htmlFor={fieldId}
        className={cn(
          formLabelVariants({
            variant,
            size,
            required: isRequired,
            disabled: isDisabled,
            floating: isFloating,
            hasValue: shouldFloat,
            focused,
          })
        )}
      >
        {label}
        {isRequired && showRequiredIndicator && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
        {!isRequired && showOptionalIndicator && (
          <span className="text-gray-400 ml-1 text-xs">
            (可选)
          </span>
        )}
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
      <div
        id={helpTextId}
        className={helperTextVariants({ variant, size })}
      >
        {helpText}
      </div>
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
          className={errorTextVariants({ variant, size })}
          role="alert"
          aria-live="polite"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {getStatusIcon('error')}
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
        className={cn(errorTextVariants({ variant, size }), "text-yellow-600 dark:text-yellow-400")}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {getStatusIcon('warning')}
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
        className={cn(errorTextVariants({ variant, size }), "text-blue-600 dark:text-blue-400")}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {getStatusIcon('info')}
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
        className={cn(errorTextVariants({ variant, size }), "text-green-600 dark:text-green-400")}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {getStatusIcon('success')}
        <span>{success}</span>
      </motion.div>
    )
  }

  // 克隆子元素并添加必要的事件处理器和属性
  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const additionalProps: any = {
          id: fieldId,
          disabled: isDisabled,
          readOnly: isReadonly,
          'aria-describedby': ariaDescribedByValues,
          'aria-labelledby': ariaLabelledBy || (label ? labelId : undefined),
          'aria-invalid': hasError ? 'true' : 'false',
          'aria-required': isRequired ? 'true' : 'false',
        }

        // 如果是表单控件元素，添加事件处理器
        if (variant === 'floating' &&
            (child.type === 'input' ||
             child.type === 'textarea' ||
             child.props.as === 'input' ||
             child.props.as === 'textarea')) {
          additionalProps.onFocus = handleFocus
          additionalProps.onBlur = handleBlur
          additionalProps.onChange = handleChange
        }

        return React.cloneElement(child, additionalProps)
      }
      return child
    })
  }

  // 渲染主要内容
  const renderContent = () => {
    switch (variant) {
      case 'inline':
        return (
          <>
            {renderLabel()}
            <div className="flex-1">
              {renderChildren()}
            </div>
            {hasError && renderError()}
            {hasWarning && renderWarning()}
            {hasInfo && renderInfo()}
            {hasSuccess && renderSuccess()}
          </>
        )

      case 'floating':
        return (
          <>
            {renderLabel()}
            {renderChildren()}
            {renderDescription()}
            {hasError && renderError()}
            {hasWarning && renderWarning()}
            {hasInfo && renderInfo()}
            {hasSuccess && renderSuccess()}
            {hasHelpText && renderHelpText()}
          </>
        )

      default:
        return (
          <>
            {renderLabel()}
            {renderDescription()}
            {renderChildren()}
            {hasHelpText && renderHelpText()}
            {hasError && renderError()}
            {hasWarning && renderWarning()}
            {hasInfo && renderInfo()}
            {hasSuccess && renderSuccess()}
          </>
        )
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        formFieldVariants({ variant, size, status }),
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
  )
})

FormField.displayName = "FormField"

export { formFieldVariants, formLabelVariants, helperTextVariants, errorTextVariants }