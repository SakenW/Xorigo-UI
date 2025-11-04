'use client'

import React, { forwardRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { cn } from '../../utils'
import { ChevronDown, ChevronRight, AlertCircle, Info } from 'lucide-react'

// ============================================================================
// Variants - 样式变体定义
// ============================================================================

const formGroupVariants = cva(
  // 基础样式
  "relative",
  {
    variants: {
      variant: {
        default: "rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
        bordered: "border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50",
        ghost: "border-0 bg-transparent",
        filled: "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700",
      },
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
      layout: {
        single: "space-y-4",
        grid: "grid grid-cols-1 gap-4",
        double: "grid grid-cols-1 md:grid-cols-2 gap-4",
        triple: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
      collapsed: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      layout: "single",
      disabled: false,
      collapsed: false,
    },
  }
)

const headerVariants = cva(
  // 基础样式
  "flex items-center justify-between transition-colors duration-200",
  {
    variants: {
      size: {
        sm: "mb-2 pb-2 border-b border-gray-200 dark:border-gray-700",
        md: "mb-3 pb-3 border-b border-gray-200 dark:border-gray-700",
        lg: "mb-4 pb-4 border-b-2 border-gray-200 dark:border-gray-700",
        xl: "mb-5 pb-5 border-b-2 border-gray-200 dark:border-gray-700",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const legendVariants = cva(
  // 基础样式
  "font-medium transition-colors duration-200",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
      required: {
        true: "",
        false: "",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "cursor-pointer",
      },
      collapsible: {
        true: "",
        false: "",
      },
      collapsed: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      required: false,
      disabled: false,
      collapsible: false,
      collapsed: false,
    },
  }
)

const descriptionVariants = cva(
  // 基础样式
  "text-gray-600 dark:text-gray-400",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
        xl: "text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const errorSummaryVariants = cva(
  // 基础样式
  "flex items-start space-x-2 p-3 rounded-md",
  {
    variants: {
      variant: {
        default: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50",
        warning: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50",
        info: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
        xl: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const collapseButtonVariants = cva(
  // 基础样式
  "flex items-center justify-center rounded-md transition-colors duration-200",
  {
    variants: {
      size: {
        sm: "w-5 h-5",
        md: "w-6 h-6",
        lg: "w-7 h-7",
        xl: "w-8 h-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

// ============================================================================
// Props - 类型定义
// ============================================================================

export interface FormGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof formGroupVariants> {
  // 基础属性
  title?: string
  description?: string
  helpText?: string

  // 状态属性
  required?: boolean
  optional?: boolean
  disabled?: boolean
  showRequiredIndicator?: boolean
  showOptionalIndicator?: boolean

  // 折叠功能
  collapsible?: boolean
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapseChange?: (collapsed: boolean) => void

  // 验证相关
  error?: string | string[]
  warning?: string
  info?: string
  errors?: Array<{ field: string; message: string }>

  // 内容布局
  children: React.ReactNode

  // 自定义样式
  className?: string
  headerClassName?: string
  contentClassName?: string
  legendClassName?: string
  descriptionClassName?: string

  // ID
  id?: string
  'aria-describedby'?: string
  'aria-labelledby'?: string
}

export interface FormGroupContextValue {
  disabled: boolean
  readonly: boolean
  errors: Record<string, string>
  addFieldError: (fieldName: string, message: string) => void
  removeFieldError: (fieldName: string) => void
  getFieldError: (fieldName: string) => string | undefined
}

// ============================================================================
// Helper Functions - 辅助函数
// ============================================================================

const getErrorIcon = () => (
  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
)

const getInfoIcon = () => (
  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
)

const getErrorSummaryVariant = (
  hasError: boolean,
  hasWarning: boolean,
  hasInfo: boolean
): 'default' | 'warning' | 'info' => {
  if (hasError) return 'default'
  if (hasWarning) return 'warning'
  if (hasInfo) return 'info'
  return 'default'
}

// ============================================================================
// FormGroup Component - 主组件
// ============================================================================

export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(({
  className,
  variant,
  size,
  layout,
  disabled = false,
  collapsed = false,
  title,
  description,
  helpText,
  required = false,
  optional = false,
  showRequiredIndicator = true,
  showOptionalIndicator = false,
  collapsible = false,
  defaultCollapsed = false,
  error,
  warning,
  info,
  errors,
  children,
  headerClassName,
  contentClassName,
  legendClassName,
  descriptionClassName,
  id,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  onCollapseChange,
  ...props
}, ref) => {
  // 内部状态
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // 状态合并
  const isDisabled = disabled
  const isCollapsed = collapsible ? collapsed : false
  const actualCollapsed = collapsible ? (collapsed ?? internalCollapsed) : false

  // 生成ID
  const groupId = id || `form-group-${React.useId()}`
  const titleId = `${groupId}-title`
  const descriptionId = `${groupId}-description`
  const helpTextId = `${groupId}-help`
  const errorId = `${groupId}-error`
  const contentId = `${groupId}-content`

  // 验证状态检测
  const hasError = !!error || !!warning || !!info || Object.keys(fieldErrors).length > 0
  const hasFieldErrors = Object.keys(fieldErrors).length > 0
  const errorSummaryVariant = getErrorSummaryVariant(!!error, !!warning, !!info)

  // 构建 aria-describedby
  const ariaDescribedByValues = [
    ariaDescribedBy,
    description && descriptionId,
    helpText && helpTextId,
    (hasError && errorId) || null,
  ].filter(Boolean).join(' ')

  // Context 值
  const contextValue: FormGroupContextValue = {
    disabled: isDisabled,
    readonly: false,
    errors: fieldErrors,
    addFieldError: useCallback((fieldName: string, message: string) => {
      setFieldErrors(prev => ({
        ...prev,
        [fieldName]: message,
      }))
    }, []),
    removeFieldError: useCallback((fieldName: string) => {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }, []),
    getFieldError: useCallback((fieldName: string) => {
      return fieldErrors[fieldName]
    }, [fieldErrors]),
  }

  // 处理折叠状态变化
  const handleCollapseChange = useCallback((newCollapsed: boolean) => {
    if (collapsible) {
      onCollapseChange?.(newCollapsed)
    } else {
      setInternalCollapsed(newCollapsed)
    }
  }, [collapsible, onCollapseChange])

  // 渲染标题栏
  const renderHeader = () => {
    if (!title && !collapsible) return null

    return (
      <div className={cn(headerVariants({ size }), headerClassName)}>
        <div className="flex items-center space-x-2">
          {collapsible && (
            <button
              type="button"
              onClick={() => handleCollapseChange(!actualCollapsed)}
              className={cn(
                collapseButtonVariants({ size }),
                "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              )}
              aria-expanded={!actualCollapsed}
              aria-controls={contentId}
            >
              {actualCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}

          {title && (
            <h3
              id={titleId}
              className={cn(
                legendVariants({
                  size,
                  required,
                  disabled: isDisabled,
                  collapsible,
                  collapsed: actualCollapsed,
                }),
                legendClassName
              )}
              onClick={collapsible ? () => handleCollapseChange(!actualCollapsed) : undefined}
            >
              {title}
              {required && showRequiredIndicator && (
                <span className="text-red-500 ml-1" aria-label="required">
                  *
                </span>
              )}
              {!required && showOptionalIndicator && (
                <span className="text-gray-400 ml-1 text-xs">
                  (可选)
                </span>
              )}
            </h3>
          )}
        </div>

        {isDisabled && (
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            已禁用
          </span>
        )}
      </div>
    )
  }

  // 渲染描述文本
  const renderDescription = () => {
    if (!description) return null

    return (
      <div
        id={descriptionId}
        className={cn(descriptionVariants({ size }), descriptionClassName)}
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
        className={cn(
          descriptionVariants({ size }),
          "text-gray-500 dark:text-gray-400 italic"
        )}
      >
        {helpText}
      </div>
    )
  }

  // 渲染错误汇总
  const renderErrorSummary = () => {
    const errorMessages: Array<{ field: string; message: string }> = []

    // 添加组级错误
    if (error) {
      const errors = Array.isArray(error) ? error : [error]
      errorMessages.push(...errors.map(msg => ({ field: 'group', message: msg })))
    }

    // 添加字段错误
    Object.entries(fieldErrors).forEach(([field, message]) => {
      errorMessages.push({ field, message })
    })

    // 添加警告
    if (warning) {
      errorMessages.push({ field: 'group', message: warning })
    }

    // 添加信息
    if (info) {
      errorMessages.push({ field: 'group', message: info })
    }

    if (errorMessages.length === 0) return null

    return (
      <AnimatePresence mode="wait">
        <motion.div
          id={errorId}
          className={errorSummaryVariants({ variant: errorSummaryVariant, size })}
          role="alert"
          aria-live="polite"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {errorSummaryVariant === 'default' ? getErrorIcon() : getInfoIcon()}
          <div className="flex-1">
            {errorMessages.map((err, index) => (
              <div
                key={`${err.field}-${index}`}
                className={cn(
                  index > 0 && "mt-1",
                  errorSummaryVariant === 'warning' && "text-yellow-800 dark:text-yellow-200",
                  errorSummaryVariant === 'info' && "text-blue-800 dark:text-blue-200",
                  errorSummaryVariant === 'default' && "text-red-800 dark:text-red-200"
                )}
              >
                {err.field !== 'group' && (
                  <span className="font-medium">{err.field}: </span>
                )}
                <span>{err.message}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // 渲染内容
  const renderContent = () => {
    if (actualCollapsed) return null

    return (
      <motion.div
        id={contentId}
        className={cn(
          formGroupVariants({ layout }),
          contentClassName
        )}
        initial={false}
        animate={{
          opacity: actualCollapsed ? 0 : 1,
          height: actualCollapsed ? 0 : 'auto',
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div
      ref={ref}
      id={groupId}
      className={cn(
        formGroupVariants({ variant, size, layout, disabled, collapsed: actualCollapsed }),
        {
          'transition-all duration-200': true,
        },
        className
      )}
      aria-labelledby={title ? titleId : ariaLabelledBy}
      aria-describedby={ariaDescribedByValues || undefined}
      aria-disabled={isDisabled ? 'true' : undefined}
      {...props}
    >
      {/* Header */}
      {renderHeader()}

      {/* Description */}
      {description && !actualCollapsed && renderDescription()}

      {/* Help Text */}
      {helpText && !actualCollapsed && renderHelpText()}

      {/* Error Summary */}
      {renderErrorSummary()}

      {/* Content */}
      {renderContent()}
    </div>
  )
})

FormGroup.displayName = "FormGroup"

// ============================================================================
// Nested FormGroup - 嵌套表单组
// ============================================================================

export interface NestedFormGroupProps
  extends Omit<FormGroupProps, 'collapsible'> {
  depth?: number
  showBorder?: boolean
}

export const NestedFormGroup = forwardRef<HTMLDivElement, NestedFormGroupProps>(({
  className,
  depth = 1,
  showBorder = true,
  size,
  variant,
  ...props
}, ref) => {
  const isLast = depth > 2

  return (
    <div
      ref={ref}
      className={cn(
        showBorder && "border-l-2 border-gray-200 dark:border-gray-700 ml-4 pl-4",
        !isLast && "mb-4",
        className
      )}
    >
      <FormGroup
        {...props}
        variant={variant || "ghost"}
        size={size || "sm"}
        className="mb-0"
      />
    </div>
  )
})

NestedFormGroup.displayName = "NestedFormGroup"

export { formGroupVariants, headerVariants, legendVariants, descriptionVariants, errorSummaryVariants }
