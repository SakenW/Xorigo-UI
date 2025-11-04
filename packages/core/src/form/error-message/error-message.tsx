'use client'

import React, { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { cn } from '../../utils'
import {
  AlertCircle,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  X,
  RotateCcw,
  ExternalLink,
  Code2
} from 'lucide-react'

// ==============================
// Variants
// ==============================

const errorMessageVariants = cva(
  // 基础样式
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "text-xs text-red-600 dark:text-red-400",
        destructive: "text-xs text-red-600 dark:text-red-400",
        warning: "text-xs text-yellow-600 dark:text-yellow-400",
        info: "text-xs text-blue-600 dark:text-blue-400",
        success: "text-xs text-green-600 dark:text-green-400",
      },
      size: {
        sm: "text-xs",
        md: "text-xs",
        lg: "text-sm",
      },
      severity: {
        critical: "text-xs font-medium",
        major: "text-xs font-medium",
        minor: "text-xs",
        info: "text-xs",
      },
      truncation: {
        none: "",
        single: "truncate",
        multi: "break-words",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      severity: "minor",
      truncation: "none",
    },
  }
)

const errorIconVariants = cva(
  // 基础样式
  "flex-shrink-0",
  {
    variants: {
      variant: {
        default: "text-red-500 dark:text-red-400",
        destructive: "text-red-500 dark:text-red-400",
        warning: "text-yellow-500 dark:text-yellow-400",
        info: "text-blue-500 dark:text-blue-400",
        success: "text-green-500 dark:text-green-400",
      },
      size: {
        sm: "w-3 h-3",
        md: "w-3.5 h-3.5",
        lg: "w-4 h-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const actionButtonVariants = cva(
  // 基础样式
  "inline-flex items-center gap-1 text-xs underline underline-offset-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-sm",
  {
    variants: {
      variant: {
        default: "text-red-600 dark:text-red-400",
        destructive: "text-red-600 dark:text-red-400",
        warning: "text-yellow-600 dark:text-yellow-400",
        info: "text-blue-600 dark:text-blue-400",
        success: "text-green-600 dark:text-green-400",
      },
      size: {
        sm: "text-xs",
        md: "text-xs",
        lg: "text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// ==============================
// Types
// ==============================

export interface ErrorAction {
  text: string
  onClick: () => void
  icon?: React.ReactNode
  disabled?: boolean
}

export interface ErrorMessageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof errorMessageVariants> {
  /**
   * 错误消息内容
   */
  children?: React.ReactNode
  /**
   * 文本内容（字符串或React节点）
   */
  content?: string | React.ReactNode
  /**
   * 状态变体
   * @default "default"
   */
  status?: 'default' | 'destructive' | 'warning' | 'info' | 'success'
  /**
   * 显示图标
   * @default true
   */
  showIcon?: boolean
  /**
   * 自定义图标
   */
  icon?: React.ReactNode
  /**
   * 严重程度
   * @default "minor"
   */
  severity?: 'critical' | 'major' | 'minor' | 'info'
  /**
   * 错误代码或标识符
   */
  code?: string
  /**
   * 最大行数（0表示不限制）
   * @default 0
   */
  maxLines?: number
  /**
   * 截断模式
   * @default "none"
   */
  truncation?: 'none' | 'single' | 'multi'
  /**
   * 隐藏文本（屏幕阅读器可见）
   * @default false
   */
  isHidden?: boolean
  /**
   * 禁用状态
   * @default false
   */
  disabled?: boolean
  /**
   * 可关闭状态
   * @default false
   */
  dismissible?: boolean
  /**
   * 关闭回调函数
   */
  onDismiss?: () => void
  /**
   * 操作按钮配置
   */
  actions?: ErrorAction[]
  /**
   * 关联的字段ID（用于可访问性）
   */
  fieldId?: string
  /**
   * HTML内容（谨慎使用，需确保安全性）
   */
  dangerouslySetInnerHTML?: { __html: string }
  /**
   * 是否显示代码高亮样式
   * @default false
   */
  showCodeStyle?: boolean
  /**
   * ID
   */
  id?: string
  /**
   * 自定义类名
   */
  className?: string
}

export interface ErrorMessageGroupProps extends Omit<ErrorMessageProps, 'children' | 'content'> {
  /**
   * 错误消息列表
   */
  items: Array<{
    id?: string
    content: string | React.ReactNode
    status?: ErrorMessageProps['status']
    severity?: ErrorMessageProps['severity']
    code?: string
    actions?: ErrorAction[]
  }>
  /**
   * 是否显示动画
   * @default true
   */
  animation?: boolean
  /**
   * 分组标题
   */
  title?: string
}

// ==============================
// Helper Functions
// ==============================

const getStatusIcon = (status: ErrorMessageProps['status'], size: number = 14) => {
  const iconProps = {
    size,
    className: errorIconVariants({
      variant: status || 'default',
      size: size <= 12 ? 'sm' : size >= 16 ? 'lg' : 'md'
    })
  }

  switch (status) {
    case 'info':
      return <Info {...iconProps} />
    case 'warning':
      return <AlertTriangle {...iconProps} />
    case 'destructive':
    case 'default':
      return <XCircle {...iconProps} />
    case 'success':
      return <HelpCircle {...iconProps} />
    default:
      return <AlertCircle {...iconProps} />
  }
}

const getSeverityIcon = (severity: ErrorMessageProps['severity'], statusIcon: React.ReactNode) => {
  if (severity === 'critical' || severity === 'major') {
    return statusIcon
  }
  return null
}

const getVariantFromStatus = (status?: ErrorMessageProps['status']): ErrorMessageProps['variant'] => {
  if (!status || status === 'default') return 'default'
  if (status === 'destructive') return 'destructive'
  return status
}

// ==============================
// Animation Variants
// ==============================

const animationVariants = {
  enter: {
    opacity: 0,
    y: -5,
    height: 0,
  },
  center: {
    opacity: 1,
    y: 0,
    height: 'auto',
  },
  exit: {
    opacity: 0,
    y: 5,
    height: 0,
  },
}

// ==============================
// ErrorMessage Component
// ==============================

export const ErrorMessage = forwardRef<HTMLDivElement, ErrorMessageProps>(({
  className,
  variant,
  size,
  status = 'default',
  severity = 'minor',
  content,
  children,
  showIcon = true,
  icon,
  code,
  maxLines = 0,
  truncation = 'none',
  isHidden = false,
  disabled = false,
  dismissible = false,
  onDismiss,
  actions,
  fieldId,
  dangerouslySetInnerHTML,
  showCodeStyle = false,
  id,
  ...props
}, ref) => {
  // 确定最终的variant
  const finalVariant = variant || getVariantFromStatus(status)

  // 生成ID
  const errorMessageId = id || `error-message-${React.useId()}`

  // 处理内容
  const textContent = children || content || ''

  // 如果没有内容，不渲染
  if (!textContent && !dangerouslySetInnerHTML) {
    return null
  }

  // 禁用状态样式
  const isDisabled = disabled

  // 处理文本渲染
  const renderText = () => {
    // 如果有HTML内容，直接渲染
    if (dangerouslySetInnerHTML) {
      return (
        <span
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
          className={showCodeStyle ? "font-mono text-xs" : undefined}
        />
      )
    }

    // 处理代码显示
    if (showCodeStyle && typeof textContent === 'string') {
      return (
        <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
          {textContent}
        </code>
      )
    }

    return textContent
  }

  // 处理操作按钮
  const renderActions = () => {
    if (!actions || actions.length === 0) {
      return null
    }

    return (
      <div className="flex items-center gap-2 mt-1.5">
        {actions.map((action, index) => (
          <button
            key={index}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled || isDisabled}
            className={cn(
              actionButtonVariants({ variant: finalVariant, size }),
              {
                'cursor-not-allowed opacity-50': action.disabled || isDisabled,
              }
            )}
            aria-disabled={action.disabled || isDisabled}
          >
            {action.icon && (
              <span className="inline-flex" aria-hidden="true">
                {action.icon}
              </span>
            )}
            {action.text}
          </button>
        ))}
      </div>
    )
  }

  // 处理样式类名
  const textStyles = cn(
    errorMessageVariants({ variant: finalVariant, size, severity, truncation }),
    {
      // 最大行数样式
      'line-clamp-1': maxLines === 1,
      'line-clamp-2': maxLines === 2,
      'line-clamp-3': maxLines === 3,
      'line-clamp-4': maxLines === 4,
      'line-clamp-5': maxLines === 5,
      // 禁用状态
      'opacity-50 cursor-not-allowed': isDisabled,
      // 截断样式
      'truncate': truncation === 'single',
      'break-words': truncation === 'multi',
      // 代码样式
      'font-mono': showCodeStyle,
    }
  )

  // 获取状态图标
  const statusIcon = icon || getStatusIcon(status, size === 'sm' ? 12 : size === 'lg' ? 16 : 14)
  const severityIcon = getSeverityIcon(severity, statusIcon)

  return (
    <motion.div
      ref={ref}
      id={errorMessageId}
      role="alert"
      aria-live="assertive"
      aria-hidden={isHidden}
      aria-describedby={fieldId}
      className={cn(
        "flex items-start gap-1.5",
        {
          'opacity-50 cursor-not-allowed': isDisabled,
        },
        className
      )}
      {...props}
    >
      {/* 图标 */}
      {showIcon && severityIcon && (
        <div className="flex-shrink-0 mt-0.5">
          {severityIcon}
        </div>
      )}

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className={textStyles}>
              {renderText()}
            </p>

            {/* 错误代码 */}
            {code && (
              <span className="inline-block mt-0.5 text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {code}
              </span>
            )}

            {/* 操作按钮 */}
            {renderActions()}
          </div>

          {/* 关闭按钮 */}
          {dismissible && onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              disabled={isDisabled}
              className={cn(
                "flex-shrink-0 p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
                {
                  'cursor-not-allowed opacity-50': isDisabled,
                }
              )}
              aria-label="关闭错误消息"
            >
              <X className={cn(
                errorIconVariants({ variant: finalVariant, size: 'sm' })
              )} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
})

ErrorMessage.displayName = "ErrorMessage"

// ==============================
// ErrorMessageList Component
// ==============================

export const ErrorMessageList = forwardRef<HTMLDivElement, ErrorMessageGroupProps>(({
  items,
  animation = true,
  title,
  className,
  ...props
}, ref) => {
  if (!items || items.length === 0) {
    return null
  }

  const errorMessageItems = items.map((item, index) => (
    <AnimatePresence mode="popLayout" key={item.id || index}>
      <motion.div
        initial={animation ? "enter" : false}
        animate="center"
        exit={animation ? "exit" : false}
        variants={animation ? animationVariants : undefined}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
      >
        <ErrorMessage
          {...props}
          content={item.content}
          status={item.status || 'default'}
          severity={item.severity || 'minor'}
          code={item.code}
          actions={item.actions}
          showIcon={true}
        />
      </motion.div>
    </AnimatePresence>
  ))

  return (
    <div
      ref={ref}
      className={cn("space-y-1.5", className)}
      {...props}
    >
      {/* 分组标题 */}
      {title && (
        <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          {title}
        </h4>
      )}

      {errorMessageItems}
    </div>
  )
})

ErrorMessageList.displayName = "ErrorMessageList"

// ==============================
// ErrorMessageGroup Component
// ==============================

export const ErrorMessageGroup = forwardRef<HTMLDivElement, ErrorMessageGroupProps>((props, ref) => {
  return <ErrorMessageList {...props} ref={ref} />
})

ErrorMessageGroup.displayName = "ErrorMessageGroup"

export { errorMessageVariants, errorIconVariants, actionButtonVariants }
