'use client'

import React, { forwardRef, useId, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { cn } from '../../utils'
import {
  AlertCircle,
  XCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Network,
  Server,
  Shield,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react'

// ==============================
// Variants
// ==============================

const errorBannerVariants = cva(
  // 基础样式
  "rounded-lg border p-4 transition-all duration-300 shadow-sm",
  {
    variants: {
      variant: {
        default: "border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20",
        destructive: "border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20",
        warning: "border-yellow-200 bg-yellow-50 dark:border-yellow-800/50 dark:bg-yellow-900/20",
        info: "border-blue-200 bg-blue-50 dark:border-blue-800/50 dark:bg-blue-900/20",
        success: "border-green-200 bg-green-50 dark:border-green-800/50 dark:bg-green-900/20",
      },
      size: {
        sm: "text-sm p-3",
        md: "text-sm p-4",
        lg: "text-base p-5",
      },
      severity: {
        critical: "border-l-4 border-l-red-600 dark:border-l-red-400 shadow-lg",
        major: "border-l-4 border-l-yellow-600 dark:border-l-yellow-400 shadow-md",
        minor: "border-l-4 border-l-blue-600 dark:border-l-blue-400",
      },
      layout: {
        default: "",
        compact: "p-3",
        spacious: "p-6",
      },
    },
    defaultVariants: {
      variant: "destructive",
      size: "md",
      severity: "major",
      layout: "default",
    },
  }
)

const bannerIconVariants = cva(
  "flex-shrink-0",
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
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
      },
    },
    defaultVariants: {
      variant: "destructive",
      size: "md",
    },
  }
)

const actionButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600",
        info: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600",
      },
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2",
      },
      tone: {
        solid: "",
        outline: "bg-transparent border-2 border-current hover:bg-white/10",
        subtle: "bg-white/20 hover:bg-white/30",
      },
    },
    defaultVariants: {
      variant: "destructive",
      size: "md",
      tone: "solid",
    },
  }
)

const secondaryButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white/80 hover:bg-white text-gray-700 border border-gray-300 dark:bg-gray-800/80 dark:hover:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:ring-gray-500",
  {
    variants: {
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const collapseButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
  {
    variants: {
      size: {
        sm: "w-6 h-6",
        md: "w-7 h-7",
        lg: "w-8 h-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

// ==============================
// Types
// ==============================

export interface ErrorAction {
  /** 操作按钮文本 */
  text: string
  /** 点击处理函数 */
  onClick: () => void
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 禁用状态 */
  disabled?: boolean
  /** 按钮变体 */
  variant?: 'primary' | 'secondary'
  /** 是否在新窗口打开 */
  external?: boolean
}

export interface FormErrorBannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof errorBannerVariants> {
  /** 错误横幅内容 */
  children?: React.ReactNode
  /** 错误消息 */
  message?: string | React.ReactNode
  /** 详细错误信息 */
  details?: string | React.ReactNode
  /** 错误代码 */
  code?: string
  /** 错误类型 */
  errorType?: 'validation' | 'network' | 'server' | 'permission' | 'unknown'
  /** 是否显示 */
  visible?: boolean
  /** 自动消失延迟（毫秒，0表示不自动消失） */
  autoDismiss?: number
  /** 可关闭状态 */
  dismissible?: boolean
  /** 关闭回调 */
  onDismiss?: () => void
  /** 重试回调 */
  onRetry?: () => void
  /** 操作按钮配置 */
  actions?: ErrorAction[]
  /** 显示图标 */
  showIcon?: boolean
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 展开状态 */
  expanded?: boolean
  /** 初始展开状态 */
  defaultExpanded?: boolean
  /** 展开状态改变回调 */
  onExpandedChange?: (expanded: boolean) => void
  /** 显示详情按钮 */
  showDetailsToggle?: boolean
  /** 详情按钮文本（展开时） */
  detailsHideText?: string
  /** 详情按钮文本（折叠时） */
  detailsShowText?: string
  /** 固定定位 */
  fixed?: boolean
  /** 固定位置 */
  position?: 'top' | 'bottom' | 'top-full'
  /** 固定层级 */
  zIndex?: number
  /** 最大宽度 */
  maxWidth?: string
  /** 复制错误消息回调 */
  onCopy?: (text: string) => void
  /** 复制按钮文本 */
  copyButtonText?: string
  /** 重试按钮文本 */
  retryButtonText?: string
  /** 关闭按钮文本 */
  dismissButtonText?: string
  /** 禁用状态 */
  disabled?: boolean
  /** 显示阴影 */
  elevated?: boolean
  /** ID */
  id?: string
  /** 自定义类名 */
  className?: string
}

// ==============================
// Helper Functions
// ==============================

const getErrorTypeIcon = (
  errorType?: FormErrorBannerProps['errorType'],
  size: number = 20
) => {
  const iconProps = {
    size,
    className: bannerIconVariants({
      variant: 'destructive',
      size: size <= 16 ? 'sm' : size >= 24 ? 'lg' : 'md'
    })
  }

  switch (errorType) {
    case 'network':
      return <Network {...iconProps} />
    case 'server':
      return <Server {...iconProps} />
    case 'permission':
      return <Shield {...iconProps} />
    case 'validation':
      return <AlertCircle {...iconProps} />
    case 'unknown':
    default:
      return <XCircle {...iconProps} />
  }
}

const getStatusIcon = (
  variant?: FormErrorBannerProps['variant'],
  size: number = 20
) => {
  const iconProps = {
    size,
    className: bannerIconVariants({
      variant: variant || 'destructive',
      size: size <= 16 ? 'sm' : size >= 24 ? 'lg' : 'md'
    })
  }

  switch (variant) {
    case 'warning':
      return <AlertTriangle {...iconProps} />
    case 'info':
      return <Info {...iconProps} />
    case 'success':
      return <CheckCircle2 {...iconProps} />
    case 'destructive':
    case 'default':
    default:
      return <XCircle {...iconProps} />
  }
}

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

// ==============================
// Animation Variants
// ==============================

const animationVariants = {
  enter: {
    opacity: 0,
    y: -20,
    scale: 0.98,
  },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.2,
    },
  },
}

const detailsAnimationVariants = {
  enter: {
    opacity: 0,
    height: 0,
  },
  center: {
    opacity: 1,
    height: 'auto',
  },
  exit: {
    opacity: 0,
    height: 0,
  },
}

// ==============================
// FormErrorBanner Component
// ==============================

export const FormErrorBanner = forwardRef<HTMLDivElement, FormErrorBannerProps>(({
  className,
  variant,
  size,
  severity = 'major',
  layout = 'default',
  children,
  message,
  details,
  code,
  errorType = 'unknown',
  visible = true,
  autoDismiss = 0,
  dismissible = true,
  onDismiss,
  onRetry,
  actions = [],
  showIcon = true,
  icon,
  expanded = false,
  defaultExpanded = false,
  onExpandedChange,
  showDetailsToggle = !!details,
  detailsHideText = '隐藏详情',
  detailsShowText = '显示详情',
  fixed = false,
  position = 'top',
  zIndex = 50,
  maxWidth = '100%',
  onCopy,
  copyButtonText = '复制错误',
  retryButtonText = '重试',
  dismissButtonText = '关闭',
  disabled = false,
  elevated = true,
  id,
  ...props
}, ref) => {
  const [isExpanded, setIsExpanded] = useState(expanded || defaultExpanded)
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(visible)
  const [isAutoDismissing, setIsAutoDismissing] = useState(false)

  const generatedId = useId()
  const componentId = id || `form-error-banner-${generatedId}`
  const detailsId = `${componentId}-details`

  // 处理展开/折叠
  const handleToggleExpanded = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onExpandedChange?.(newExpanded)
  }

  // 处理复制
  const handleCopy = async () => {
    const textToCopy = typeof message === 'string'
      ? message
      : typeof message === 'object'
        ? JSON.stringify(message, null, 2)
        : ''

    const success = await copyToClipboard(textToCopy)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      onCopy?.(textToCopy)
    }
  }

  // 处理关闭
  const handleDismiss = () => {
    setIsVisible(false)
    setIsAutoDismissing(true)
    onDismiss?.()
  }

  // 处理重试
  const handleRetry = () => {
    onRetry?.()
  }

  // 自动消失
  useEffect(() => {
    if (!autoDismiss || autoDismiss <= 0 || !isVisible) {
      return
    }

    const timer = setTimeout(() => {
      handleDismiss()
    }, autoDismiss)

    return () => clearTimeout(timer)
  }, [autoDismiss, isVisible])

  // 同步外部 visible 状态
  useEffect(() => {
    if (visible) {
      setIsVisible(true)
    }
  }, [visible])

  // 空状态不渲染
  if (!isVisible || (!message && !children && !details)) {
    return null
  }

  // 合并状态变体
  const finalVariant = variant || (errorType === 'validation' ? 'destructive' : errorType === 'network' ? 'warning' : 'destructive')

  // 获取图标
  const bannerIcon = icon || getStatusIcon(finalVariant, size === 'sm' ? 16 : size === 'lg' ? 24 : 20)
  const errorTypeIcon = getErrorTypeIcon(errorType, size === 'sm' ? 16 : size === 'lg' ? 24 : 20)

  // 计算容器样式
  const containerStyles = cn(
    "relative",
    {
      'fixed inset-x-0 top-0 z-[var(--z-index)]': fixed && position === 'top',
      'fixed inset-x-0 bottom-0 z-[var(--z-index)]': fixed && position === 'bottom',
      'absolute top-full left-0 right-0 z-[var(--z-index)]': fixed && position === 'top-full',
    },
    {
      'shadow-lg': elevated && !fixed,
      'shadow-xl': elevated && fixed,
    }
  )

  // 响应式样式
  const responsiveStyles = {
    '--z-index': zIndex,
    maxWidth: maxWidth === '100%' ? (fixed ? '100%' : '100%') : maxWidth,
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        ref={ref}
        id={componentId}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className={cn(
          containerStyles,
          className
        )}
        style={responsiveStyles}
        initial="enter"
        animate="center"
        exit="exit"
        variants={animationVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        {...props}
      >
        <div
          className={cn(
            errorBannerVariants({ variant: finalVariant, size, severity, layout }),
            {
              'mx-auto': !fixed || position === 'top-full',
              'rounded-none': fixed,
            }
          )}
        >
          <div className="flex items-start gap-3">
            {/* 图标 */}
            {showIcon && (
              <div className="flex-shrink-0 mt-0.5">
                {errorType !== 'unknown' ? errorTypeIcon : bannerIcon}
              </div>
            )}

            {/* 内容 */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* 主要内容 */}
              <div className="space-y-1">
                {/* 错误消息 */}
                {message && (
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {message}
                  </p>
                )}

                {/* 自定义内容 */}
                {children && (
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {children}
                  </div>
                )}

                {/* 错误代码 */}
                {code && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                      {code}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={cn(
                        "text-xs underline underline-offset-2",
                        "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200",
                        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-sm"
                      )}
                      aria-label="复制错误代码"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="inline w-3 h-3 mr-1" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="inline w-3 h-3 mr-1" />
                          {copyButtonText}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* 详情区域 */}
              {details && (
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      id={detailsId}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      variants={detailsAnimationVariants}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="pt-2 border-t border-gray-200/60 dark:border-gray-700/60"
                    >
                      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                        {typeof details === 'string' ? (
                          <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                            {details}
                          </pre>
                        ) : (
                          details
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* 操作按钮区域 */}
              {(onRetry || actions.length > 0 || (showDetailsToggle && details)) && (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {/* 重试按钮 */}
                  {onRetry && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={disabled}
                      className={cn(
                        actionButtonVariants({ variant: finalVariant, size, tone: 'solid' }),
                        {
                          'opacity-50 cursor-not-allowed': disabled,
                        }
                      )}
                      aria-label={retryButtonText}
                    >
                      <RefreshCw className="w-4 h-4" />
                      {retryButtonText}
                    </button>
                  )}

                  {/* 自定义操作按钮 */}
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={action.onClick}
                      disabled={action.disabled || disabled}
                      className={cn(
                        action.variant === 'secondary'
                          ? secondaryButtonVariants({ size })
                          : actionButtonVariants({ variant: finalVariant, size, tone: 'solid' }),
                        {
                          'opacity-50 cursor-not-allowed': action.disabled || disabled,
                        }
                      )}
                      aria-label={action.text}
                    >
                      {action.icon && (
                        <span className="inline-flex" aria-hidden="true">
                          {action.icon}
                        </span>
                      )}
                      {action.text}
                      {action.external && <ExternalLink className="w-3 h-3 ml-1" />}
                    </button>
                  ))}

                  {/* 显示详情按钮 */}
                  {showDetailsToggle && details && (
                    <button
                      type="button"
                      onClick={handleToggleExpanded}
                      disabled={disabled}
                      className={secondaryButtonVariants({ size })}
                      aria-expanded={isExpanded}
                      aria-controls={detailsId}
                      aria-label={isExpanded ? detailsHideText : detailsShowText}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          {detailsHideText}
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          {detailsShowText}
                        </>
                      )}
                    </button>
                  )}

                  {/* 关闭按钮 */}
                  {dismissible && (
                    <button
                      type="button"
                      onClick={handleDismiss}
                      disabled={disabled}
                      className={secondaryButtonVariants({ size })}
                      aria-label={dismissButtonText}
                    >
                      <X className="w-4 h-4" />
                      {dismissButtonText}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
})

FormErrorBanner.displayName = "FormErrorBanner"

export { errorBannerVariants, bannerIconVariants, actionButtonVariants, secondaryButtonVariants, collapseButtonVariants }
