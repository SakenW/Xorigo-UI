'use client'

import React, { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils'
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'

// ==============================
// Types
// ==============================

export interface ValidationMessageItem {
  id: string
  type: 'error' | 'warning' | 'success' | 'info'
  message: string
  dismissible?: boolean
}

// ==============================
// Variants
// ==============================

const validationMessageVariants = cva(
  // 基础样式
  "rounded-lg border p-3 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200",
        error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
        warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
        success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
      },
      size: {
        sm: "p-2 text-xs",
        md: "p-3 text-sm",
        lg: "p-4 text-base",
      },
      dismissible: {
        true: "pr-8",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      dismissible: false,
    },
  }
)

const validationIconVariants = cva(
  // 基础样式
  "flex-shrink-0",
  {
    variants: {
      variant: {
        default: "text-gray-500 dark:text-gray-400",
        error: "text-red-500 dark:text-red-400",
        warning: "text-yellow-500 dark:text-yellow-400",
        success: "text-green-500 dark:text-green-400",
      },
      size: {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-5 h-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const validationTextVariants = cva(
  // 基础样式
  "font-medium",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const validationListVariants = cva(
  // 基础样式
  "space-y-1",
  {
    variants: {
      size: {
        sm: "space-y-0.5",
        md: "space-y-1",
        lg: "space-y-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

// ==============================
// Props
// ==============================

export interface ValidationMessageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof validationMessageVariants> {
  type?: 'error' | 'warning' | 'success' | 'info'
  message?: string | string[]
  messages?: ValidationMessageItem[]
  icon?: boolean
  showIcon?: boolean
  dismissible?: boolean
  onDismiss?: () => void
  onMessageDismiss?: (messageId: string) => void
  animation?: boolean
  maxVisible?: number
  children?: React.ReactNode
}

// ==============================
// Helper Functions
// ==============================

const getStatusIcon = (type: ValidationMessageProps['type'], size: number = 16) => {
  const iconProps = { size, className: "flex-shrink-0" }

  switch (type) {
    case 'error':
      return <AlertCircle {...iconProps} />
    case 'warning':
      return <AlertTriangle {...iconProps} />
    case 'success':
      return <CheckCircle {...iconProps} />
    case 'info':
      return <Info {...iconProps} />
    default:
      return <AlertCircle {...iconProps} />
  }
}

const getVariantFromType = (type: ValidationMessageProps['type']): ValidationMessageProps['variant'] => {
  switch (type) {
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'success':
      return 'success'
    case 'info':
      return 'default'
    default:
      return 'default'
  }
}

// ==============================
// Animation Variants
// ==============================

const animationVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 10 : -10,
    scale: 0.95,
  }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction < 0 ? 10 : -10,
    scale: 0.95,
  }),
}

// ==============================
// ValidationMessage Component
// ==============================

export const ValidationMessage = forwardRef<HTMLDivElement, ValidationMessageProps>(({
  className,
  variant,
  size,
  type = 'default',
  message,
  messages,
  showIcon = true,
  dismissible = false,
  onDismiss,
  onMessageDismiss,
  animation = true,
  maxVisible,
  children,
  ...props
}, ref) => {
  // 内部状态
  const [visibleMessages, setVisibleMessages] = React.useState<ValidationMessageItem[]>([])

  // 确定最终的variant
  const finalVariant = variant || getVariantFromType(type || 'default')

  // 处理messages数据
  React.useEffect(() => {
    let newMessages: ValidationMessageItem[] = []

    if (messages) {
      newMessages = messages
    } else if (message) {
      if (Array.isArray(message)) {
        newMessages = message.map((msg, index) => ({
          id: `msg-${index}`,
          type,
          message: msg,
          dismissible: false,
        }))
      } else {
        newMessages = [{
          id: 'msg-0',
          type,
          message,
          dismissible,
        }]
      }
    }

    if (maxVisible && newMessages.length > maxVisible) {
      newMessages = newMessages.slice(0, maxVisible)
    }

    setVisibleMessages(newMessages)
  }, [message, messages, type, dismissible, maxVisible])

  // 处理消息消失
  const handleMessageDismiss = (messageId: string) => {
    setVisibleMessages(prev => prev.filter(msg => msg.id !== messageId))
    onMessageDismiss?.(messageId)
  }

  // 处理全部消失
  const handleDismiss = () => {
    setVisibleMessages([])
    onDismiss?.()
  }

  // 渲染单个消息
  const renderMessage = (msg: ValidationMessageItem, index: number) => {
    const messageVariant = getVariantFromType(msg.type)
    const hasIcon = showIcon || msg.type === 'error'

    return (
      <motion.div
        key={msg.id}
        custom={index}
        variants={animation ? animationVariants : undefined}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className={cn(
          validationMessageVariants({
            variant: messageVariant,
            size,
            dismissible: msg.dismissible || dismissible,
          }),
          "flex items-start space-x-2"
        )}
        role="alert"
        aria-live={msg.type === 'error' ? 'assertive' : 'polite'}
      >
        {/* Icon */}
        {hasIcon && (
          <div className="flex-shrink-0 mt-0.5">
            {getStatusIcon(msg.type, size === 'sm' ? 12 : size === 'md' ? 16 : size === 'lg' ? 20 : 16)}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={validationTextVariants({ size })}>
            {msg.message}
          </p>
        </div>

        {/* Dismiss Button */}
        {(msg.dismissible || dismissible) && (
          <button
            type="button"
            onClick={() => handleMessageDismiss(msg.id)}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="关闭消息"
          >
            <X size={16} />
          </button>
        )}
      </motion.div>
    )
  }

  // 如果有自定义children，使用children
  if (children) {
    return (
      <motion.div
        ref={ref}
        className={cn(
          validationMessageVariants({
            variant: finalVariant,
            size,
            dismissible,
          }),
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  // 渲染消息列表
  return (
    <div
      ref={ref}
      className={cn(
        "space-y-2",
        className
      )}
      {...props}
    >
      <AnimatePresence mode="popLayout">
        {visibleMessages.map((msg, index) => renderMessage(msg, index))}
      </AnimatePresence>

      {/* 全局消失按钮 */}
      {visibleMessages.length > 1 && dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          清除所有消息
        </button>
      )}
    </div>
  )
})

ValidationMessage.displayName = "ValidationMessage"

// ==============================
// ValidationSummary Component
// ==============================

export interface ValidationSummaryProps extends Omit<ValidationMessageProps, 'messages'> {
  errors?: string[]
  warnings?: string[]
  successes?: string[]
  infos?: string[]
  showSections?: boolean
}

export const ValidationSummary = forwardRef<HTMLDivElement, ValidationSummaryProps>(({
  errors = [],
  warnings = [],
  successes = [],
  infos = [],
  showSections = true,
  size,
  ...props
}, ref) => {
  // 生成消息列表
  const allMessages: ValidationMessageItem[] = [
    ...errors.map((msg, index) => ({
      id: `error-${index}`,
      type: 'error' as const,
      message: msg,
      dismissible: false,
    })),
    ...warnings.map((msg, index) => ({
      id: `warning-${index}`,
      type: 'warning' as const,
      message: msg,
      dismissible: false,
    })),
    ...successes.map((msg, index) => ({
      id: `success-${index}`,
      type: 'success' as const,
      message: msg,
      dismissible: false,
    })),
    ...infos.map((msg, index) => ({
      id: `info-${index}`,
      type: 'info' as const,
      message: msg,
      dismissible: false,
    })),
  ]

  if (!showSections) {
    return (
      <ValidationMessage
        ref={ref}
        messages={allMessages}
        size={size}
        {...props}
      />
    )
  }

  // 按类型分组渲染
  return (
    <div ref={ref} className="space-y-4" {...props}>
      {errors.length > 0 && (
        <div className="space-y-2">
          <h4 className={validationTextVariants({ size }) + " font-medium text-red-600 dark:text-red-400"}>
            错误 ({errors.length})
          </h4>
          <div className={validationListVariants({ size })}>
            {errors.map((error, index) => (
              <ValidationMessage
                key={`error-${index}`}
                type="error"
                message={error}
                size={size}
                showIcon
                animation={false}
              />
            ))}
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="space-y-2">
          <h4 className={validationTextVariants({ size }) + " font-medium text-yellow-600 dark:text-yellow-400"}>
            警告 ({warnings.length})
          </h4>
          <div className={validationListVariants({ size })}>
            {warnings.map((warning, index) => (
              <ValidationMessage
                key={`warning-${index}`}
                type="warning"
                message={warning}
                size={size}
                showIcon
                animation={false}
              />
            ))}
          </div>
        </div>
      )}

      {successes.length > 0 && (
        <div className="space-y-2">
          <h4 className={validationTextVariants({ size }) + " font-medium text-green-600 dark:text-green-400"}>
            成功 ({successes.length})
          </h4>
          <div className={validationListVariants({ size })}>
            {successes.map((success, index) => (
              <ValidationMessage
                key={`success-${index}`}
                type="success"
                message={success}
                size={size}
                showIcon
                animation={false}
              />
            ))}
          </div>
        </div>
      )}

      {infos.length > 0 && (
        <div className="space-y-2">
          <h4 className={validationTextVariants({ size }) + " font-medium text-blue-600 dark:text-blue-400"}>
            信息 ({infos.length})
          </h4>
          <div className={validationListVariants({ size })}>
            {infos.map((info, index) => (
              <ValidationMessage
                key={`info-${index}`}
                type="info"
                message={info}
                size={size}
                showIcon
                animation={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

ValidationSummary.displayName = "ValidationSummary"

export { validationMessageVariants, validationIconVariants, validationTextVariants, validationListVariants }