/**
 * Toast 组件 - 基于 v1.4 SSOT 的完整实现
 *
 * 提供临时通知提示功能，完全集成七轴主题系统
 */

'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme, useThemeSafe } from '../../system/theme-provider'
import { createThemeStyles } from '../../utils/theme-token-mapper'

// === Toast 变体系统 ===
const toastVariants = cva(
  "fixed top-4 right-4 rounded-lg p-4 shadow-lg z-50 max-w-sm border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-[var(--xor-bg-tertiary)] text-[var(--xor-text-primary)] border-[var(--xor-border-primary)]",
        success: "bg-[var(--xor-success)] text-[var(--xor-text-on-success)] border-[var(--xor-success)]",
        error: "bg-[var(--xor-error)] text-[var(--xor-text-on-error)] border-[var(--xor-error)]",
        warning: "bg-[var(--xor-warning)] text-[var(--xor-text-on-warning)] border-[var(--xor-warning)]",
        info: "bg-[var(--xor-info)] text-[var(--xor-text-on-info)] border-[var(--xor-info)]"
      },
      size: {
        sm: "p-3 text-sm max-w-xs",
        md: "p-4 text-base max-w-sm",
        lg: "p-5 text-lg max-w-md"
      },
      position: {
        'top-right': "top-4 right-4",
        'top-left': "top-4 left-4",
        'bottom-right': "bottom-4 right-4",
        'bottom-left': "bottom-4 left-4",
        'top-center': "top-4 left-1/2 transform -translate-x-1/2",
        'bottom-center': "bottom-4 left-1/2 transform -translate-x-1/2"
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      position: 'top-right'
    }
  }
)

// === Toast Props 接口 ===
export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  /** 是否显示关闭按钮 */
  closable?: boolean
  /** 自动关闭时间（毫秒），0 表示不自动关闭 */
  duration?: number
  /** 关闭回调 */
  onClose?: () => void
  /** 是否显示图标 */
  showIcon?: boolean
}

// === Toast 组件实现 ===
export const Toast: React.FC<ToastProps> = ({
  children,
  variant,
  size,
  position,
  className,
  closable = false,
  duration = 0,
  onClose,
  showIcon = false,
  ...props
}) => {
  const theme = useThemeSafe()
  const [isVisible, setIsVisible] = React.useState(true)

  // 自动关闭逻辑
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration])

  // 关闭处理
  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  // 使用统一的主题样式工具
  const themeStyles = createThemeStyles(theme)

  // 图标映射
  const getIcon = () => {
    if (!showIcon) return null

    const iconMap = {
      default: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }

    return (
      <span className="mr-2 text-lg" role="img" aria-label={`${variant} icon`}>
        {iconMap[variant || 'default']}
      </span>
    )
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(toastVariants({ variant, size, position, className }))}
      style={themeStyles}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <div className="flex items-start">
        {getIcon()}
        <div className="flex-1 min-w-0">
          {children}
        </div>
        {closable && (
          <button
            onClick={handleClose}
            className="ml-3 text-[var(--xor-text-secondary-600-600)] hover:text-[var(--xor-text-primary)] transition-colors p-1 rounded hover:bg-[var(--xor-bg-secondary-500-500)]"
            aria-label="关闭通知"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default Toast
export { toastVariants }