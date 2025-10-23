/**
 * Notification 通知组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 状态/通知/进度/结果/无障碍提示
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const notificationVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "relative w-full rounded-lg border bg-background-primary-primary text-text-primary shadow-lg",
  {
    variants: {
      // 变体系统 - 使用七轴主题系统的颜色令牌
      variant: {
        default: "border-border-base-base",
        success: "border-success bg-success/10 text-success",
        warning: "border-warning bg-warning/10 text-warning",
        error: "border-error-500 bg-error-500/10 text-error-600",
        info: "border-info bg-info/10 text-info",
      },

      // 尺寸系统 - 使用七轴主题系统的密度令牌
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },

      // 状态
      state: {
        default: "",
        unread: "border-l-4 border-l-current",
        read: "opacity-75",
        highlighted: "ring-2 ring-primary-500 ring-offset-2",
      },

      // 是否可交互
      interactive: {
        false: "",
        true: "cursor-pointer hover:shadow-xl transition-shadow",
      }
    },

    // 默认变体
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
      interactive: false,
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  /**
   * 通知图标
   */
  icon?: React.ReactNode

  /**
   * 通知标题
   */
  title?: React.ReactNode

  /**
   * 通知内容
   */
  content?: React.ReactNode

  /**
   * 通知时间
   */
  timestamp?: Date | string

  /**
   * 通知来源
   */
  source?: string

  /**
   * 操作按钮
   */
  action?: React.ReactNode

  /**
   * 是否显示关闭按钮
   */
  showCloseButton?: boolean

  /**
   * 是否已读
   */
  read?: boolean

  /**
   * 是否重要
   */
  important?: boolean

  /**
   * 是否可点击
   */
  clickable?: boolean

  /**
   * 点击回调
   */
  onClick?: () => void

  /**
   * 关闭回调
   */
  onClose?: () => void

  /**
   * 标记
   */
  badge?: React.ReactNode

  /**
   * 自定义样式类名
   */
  className?: string

  /**
   * 角色标签
   */
  role?: 'alert' | 'status' | 'log' | 'marquee'

  /**
   * 是否显示动画
   */
  animated?: boolean

  /**
   * 自动关闭时间（毫秒）
   */
  autoClose?: number
}

// =============================================================================
// Notification 主组件实现
// =============================================================================

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  (
    {
      variant,
      size,
      state,
      interactive,
      icon,
      title,
      content,
      timestamp,
      source,
      action,
      showCloseButton = true,
      read = false,
      important = false,
      clickable = false,
      onClick,
      onClose,
      badge,
      className,
      role = 'alert',
      animated = true,
      autoClose,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()
    const [isVisible, setIsVisible] = React.useState(true)

    // 处理自动关闭
    React.useEffect(() => {
      if (autoClose && autoClose > 0) {
        const timer = setTimeout(() => {
          handleClose()
        }, autoClose)
        return () => clearTimeout(timer)
      }
    }, [autoClose])

    // 处理关闭操作
    const handleClose = React.useCallback(() => {
      setIsVisible(false)
      onClose?.()
    }, [onClose])

    // 处理点击事件
    const handleClick = React.useCallback(() => {
      if (clickable) {
        onClick?.()
      }
    }, [clickable, onClick])

    // 如果不可见且没有动画，直接返回 null
    if (!isVisible && !animated) {
      return null
    }

    // 格式化时间戳
    const formattedTimestamp = React.useMemo(() => {
      if (!timestamp) return null
      if (timestamp instanceof Date) {
        return timestamp.toLocaleString()
      }
      if (typeof timestamp === 'string') {
        return timestamp
      }
      return null
    }, [timestamp])

    // 生成主题相关的样式
    const themeStyles: React.CSSProperties = {
      '--notification-bg': `hsl(${theme.colors.background})`,
      '--notification-border': `hsl(${theme.colors.border.primary})`,
      '--notification-text': `hsl(${theme.colors.text.primary})`,
      '--notification-icon': `hsl(${theme.colors[variant === 'default' ? 'text' : variant]})`,
      '--notification-accent': `hsl(${theme.colors.primary})`,
      // 可根据七轴动态调整
    }

    // 生成 ARIA 属性
    const ariaProps: React.AriaAttributes = {
      'role': role,
      'aria-label': title ? `${title} notification` : 'notification',
      'aria-live': important ? 'assertive' : 'polite',
      'aria-atomic': 'true',
      'tabIndex': clickable ? 0 : undefined,
    }

    // 确定状态
    const notificationState = important ? 'highlighted' : read ? 'read' : state || 'default'

    return (
      <div
        ref={ref}
        className={cn(
          notificationVariants({
            variant,
            size,
            state: notificationState,
            interactive: interactive || clickable,
          }),
          // 动画类名
          animated && "transition-all duration-300 ease-in-out",
          // 可见性控制
          !isVisible && "opacity-0 scale-95 pointer-events-none",
          className
        )}
        style={themeStyles}
        {...ariaProps}
        {...props}
        onClick={handleClick}
      >
        {/* 重要性指示器 */}
        {important && (
          <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
        )}

        {/* 标记 */}
        {badge && (
          <div className="absolute top-2 right-2">
            {badge}
          </div>
        )}

        {/* 主要内容 */}
        <div className="flex gap-4">
          {/* 图标 */}
          {icon && (
            <div className="flex-shrink-0 mt-1">
              <div className="h-5 w-5" style={{ color: 'var(--notification-icon)' }}>
                {icon}
              </div>
            </div>
          )}

          {/* 内容区域 */}
          <div className="flex-1 min-w-0">
            {/* 标题 */}
            {title && (
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm" style={{ color: 'var(--notification-text)' }}>
                  {title}
                </h3>
                {source && (
                  <span className="text-xs opacity-60" style={{ color: 'var(--notification-text)' }}>
                    {source}
                  </span>
                )}
              </div>
            )}

            {/* 内容 */}
            {content && (
              <div className="text-sm opacity-90 mb-2" style={{ color: 'var(--notification-text)' }}>
                {content}
              </div>
            )}

            {/* 时间戳和操作 */}
            <div className="flex items-center justify-between">
              {formattedTimestamp && (
                <time className="text-xs opacity-60" style={{ color: 'var(--notification-text)' }}>
                  {formattedTimestamp}
                </time>
              )}
              {action && (
                <div className="flex-shrink-0">
                  {action}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 关闭按钮 */}
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 rounded-md p-1 hover:bg-accent-500-500-500 hover:text-text-on-accent transition-colors"
            aria-label="关闭通知"
            style={{ color: 'var(--notification-text)', opacity: 0.7 }}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

// =============================================================================
// 组件元数据
// =============================================================================

Notification.displayName = 'Notification'

// =============================================================================
// 导出
// =============================================================================

export { Notification, notificationVariants }
export type { NotificationProps }