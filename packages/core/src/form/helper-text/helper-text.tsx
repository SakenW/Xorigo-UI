'use client'

import React, { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { cn } from '../../utils'
import { AlertCircle, CheckCircle, AlertTriangle, Info, HelpCircle, ExternalLink } from 'lucide-react'

// ==============================
// Variants
// ==============================

const helperTextVariants = cva(
  // 基础样式
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "text-xs text-gray-600 dark:text-gray-400",
        info: "text-xs text-blue-600 dark:text-blue-400",
        warning: "text-xs text-yellow-600 dark:text-yellow-400",
        error: "text-xs text-red-600 dark:text-red-400",
        success: "text-xs text-green-600 dark:text-green-400",
      },
      size: {
        sm: "text-xs",
        md: "text-xs",
        lg: "text-sm",
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
      truncation: "none",
    },
  }
)

const helperIconVariants = cva(
  // 基础样式
  "flex-shrink-0",
  {
    variants: {
      variant: {
        default: "text-gray-400 dark:text-gray-500",
        info: "text-blue-500 dark:text-blue-400",
        warning: "text-yellow-500 dark:text-yellow-400",
        error: "text-red-500 dark:text-red-400",
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

const helperLinkVariants = cva(
  // 基础样式
  "underline underline-offset-2 hover:opacity-80 transition-opacity",
  {
    variants: {
      variant: {
        default: "text-blue-600 dark:text-blue-400",
        info: "text-blue-600 dark:text-blue-400",
        warning: "text-yellow-600 dark:text-yellow-400",
        error: "text-red-600 dark:text-red-400",
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

export interface HelperLink {
  text: string
  href: string
  external?: boolean
  onClick?: () => void
}

export interface HelperTextProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof helperTextVariants> {
  /**
   * 帮助文本内容
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
  status?: 'default' | 'info' | 'warning' | 'error' | 'success'
  /**
   * 显示图标
   * @default false
   */
  showIcon?: boolean
  /**
   * 自定义图标
   */
  icon?: React.ReactNode
  /**
   * 链接配置
   */
  links?: HelperLink[]
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
   * ID
   */
  id?: string
  /**
   * 自定义类名
   */
  className?: string
}

// ==============================
// Helper Functions
// ==============================

const getStatusIcon = (status: HelperTextProps['status'], size: number = 14) => {
  const iconProps = { size, className: helperIconVariants({ variant: status || 'default', size: 'md' }) }

  switch (status) {
    case 'info':
      return <Info {...iconProps} />
    case 'warning':
      return <AlertTriangle {...iconProps} />
    case 'error':
      return <AlertCircle {...iconProps} />
    case 'success':
      return <CheckCircle {...iconProps} />
    default:
      return <HelpCircle {...iconProps} />
  }
}

const getVariantFromStatus = (status?: HelperTextProps['status']): HelperTextProps['variant'] => {
  if (!status || status === 'default') return 'default'
  return status
}

// ==============================
// Animation Variants
// ==============================

const animationVariants = {
  enter: {
    opacity: 0,
    y: -5,
  },
  center: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 5,
  },
}

// ==============================
// HelperText Component
// ==============================

export const HelperText = forwardRef<HTMLDivElement, HelperTextProps>(({
  className,
  variant,
  size,
  status = 'default',
  content,
  children,
  showIcon = false,
  icon,
  links,
  maxLines = 0,
  truncation = 'none',
  isHidden = false,
  disabled = false,
  id,
  ...props
}, ref) => {
  // 确定最终的variant
  const finalVariant = variant || getVariantFromStatus(status)

  // 生成ID
  const helperTextId = id || `helper-text-${React.useId()}`

  // 处理内容
  const textContent = children || content || ''

  // 如果没有内容，不渲染
  if (!textContent) {
    return null
  }

  // 禁用状态样式
  const isDisabled = disabled

  // 处理文本渲染
  const renderText = () => {
    // 如果有链接，渲染带链接的文本
    if (links && links.length > 0) {
      return (
        <span>
          {typeof textContent === 'string' ? (
            <>
              {textContent.split(/(\{[^{}]+\})/).map((part, index) => {
                // 检查是否是链接标记 {text}
                const linkMatch = part.match(/^\{(.+)\}$/)
                if (linkMatch) {
                  const linkIndex = parseInt(linkMatch[1], 10) - 1
                  const link = links[linkIndex]
                  if (link) {
                    return (
                      <React.Fragment key={index}>
                        {index > 0 && ' '}
                        <a
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                          onClick={link.onClick}
                          className={helperLinkVariants({ variant: finalVariant, size })}
                        >
                          {link.text}
                          {link.external && <ExternalLink className="inline w-3 h-3 ml-0.5" />}
                        </a>
                      </React.Fragment>
                    )
                  }
                }
                return <React.Fragment key={index}>{part}</React.Fragment>
              })}
            </>
          ) : (
            textContent
          )}
        </span>
      )
    }

    // 简单文本渲染
    return textContent
  }

  // 处理样式类名
  const textStyles = cn(
    helperTextVariants({ variant: finalVariant, size, truncation }),
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
    }
  )

  return (
    <motion.div
      ref={ref}
      id={helperTextId}
      role={status === 'error' ? 'alert' : 'status'}
      aria-live={status === 'error' ? 'assertive' : 'polite'}
      aria-hidden={isHidden}
      className={cn(
        "flex items-start space-x-1.5",
        {
          'opacity-50 cursor-not-allowed': isDisabled,
        },
        className
      )}
      {...props}
    >
      {/* 图标 */}
      {showIcon && (
        <div className="flex-shrink-0 mt-0.5">
          {icon || getStatusIcon(status, size === 'sm' ? 12 : size === 'lg' ? 16 : 14)}
        </div>
      )}

      {/* 文本内容 */}
      <div className="flex-1 min-w-0">
        <p className={textStyles}>
          {renderText()}
        </p>
      </div>
    </motion.div>
  )
})

HelperText.displayName = "HelperText"

// ==============================
// HelperTextList Component
// ==============================

export interface HelperTextListProps extends Omit<HelperTextProps, 'content'> {
  items: Array<{
    id?: string
    content: string | React.ReactNode
    status?: HelperTextProps['status']
  }>
  animation?: boolean
}

export const HelperTextList = forwardRef<HTMLDivElement, HelperTextListProps>(({
  items,
  animation = true,
  className,
  ...props
}, ref) => {
  if (!items || items.length === 0) {
    return null
  }

  const helperTextItems = items.map((item, index) => (
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
        <HelperText
          {...props}
          content={item.content}
          status={item.status || 'default'}
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
      {helperTextItems}
    </div>
  )
})

HelperTextList.displayName = "HelperTextList"

export { helperTextVariants, helperIconVariants, helperLinkVariants }
