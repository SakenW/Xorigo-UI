/**
 * Alert 反馈组件 - 符合七轴主题系统 v1.4 SSOT
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

const alertVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      // 变体系统 - 使用七轴主题系统的颜色令牌
      variant: {
        default: "border-border-base-base bg-background-primary text-text-primary",
        destructive: "border-error-500 bg-error-500 text-error-600-foreground",
        warning: "border-warning bg-warning text-warning-foreground",
        success: "border-success bg-success text-success-foreground",
        info: "border-info bg-info text-info-foreground",
      },

      // 尺寸系统 - 使用七轴主题系统的密度令牌
      size: {
        sm: "p-3 text-sm",
        md: "p-4 text-base",
        lg: "p-6 text-lg",
        xl: "p-8 text-xl",
      },

      // 状态样式
      state: {
        default: "",
        subtle: "opacity-75",
        bold: "border-2 font-semibold",
      },

      // 图标位置
      iconPosition: {
        none: "",
        start: "pl-12",
        end: "pr-12",
      },

      // 可关闭状态
      dismissible: {
        true: "pr-12",
        false: "",
      }
    },

    // 默认变体
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
      iconPosition: "none",
      dismissible: false,
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /**
   * 警告图标
   */
  icon?: React.ReactNode

  /**
   * 标题
   */
  title?: React.ReactNode

  /**
   * 描述内容
   */
  description?: React.ReactNode

  /**
   * 操作按钮
   */
  action?: React.ReactNode

  /**
   * 是否可关闭
   */
  dismissible?: boolean

  /**
   * 关闭回调
   */
  onDismiss?: () => void

  /**
   * 是否显示关闭按钮
   */
  showCloseButton?: boolean

  /**
   * 自动关闭时间（毫秒）
   */
  autoClose?: number

  /**
   * 子元素内容
   */
  children?: React.ReactNode

  /**
   * 自定义样式类名
   */
  className?: string

  /**
   * 角色标签
   */
  role?: 'alert' | 'status' | 'log'

  /**
   * 实时区域设置
   */
  ariaLive?: 'off' | 'polite' | 'assertive'

  /**
   * 是否显示动画
   */
  animated?: boolean
}

// =============================================================================
// Alert 主组件实现
// =============================================================================

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant,
      size,
      state,
      iconPosition,
      dismissible,
      icon,
      title,
      description,
      action,
      showCloseButton = false,
      onDismiss,
      autoClose,
      children,
      className,
      role = 'alert',
      ariaLive = 'polite',
      animated = true,
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
      onDismiss?.()
    }, [onDismiss])

    // 如果不可见且没有动画，直接返回 null
    if (!isVisible && !animated) {
      return null
    }

    // 生成图标位置类名
    const iconPositionClass = icon ? `absolute ${iconPosition === 'start' ? 'left-4' : 'right-4'} top-4` : ''

    // 生成主题相关的样式
    const themeStyles: React.CSSProperties = {
      // 七轴主题系统集成
      '--alert-bg': `hsl(${theme.colors.background})`,
      '--alert-border': `hsl(${theme.colors.border.primary})`,
      '--alert-text': `hsl(${theme.colors.text.primary})`,
      '--alert-icon': `hsl(${theme.colors[variant === 'default' ? 'text' : variant]})`,
      // 可根据七轴动态调整
    }

    // 生成 ARIA 属性
    const ariaProps: React.AriaAttributes = {
      'aria-live': ariaLive,
      'role': role,
      'aria-label': title ? `${title} alert` : 'alert',
    }

    return (
      <div
        ref={ref}
        className={cn(
          alertVariants({
            variant,
            size,
            state,
            iconPosition: icon ? iconPosition : undefined,
            dismissible: dismissible || showCloseButton,
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
      >
        {/* 警告图标 */}
        {icon && (
          <div className={cn("flex-shrink-0", iconPositionClass)}>
            <div className="h-5 w-5" style={{ color: 'var(--alert-icon)' }}>
              {icon}
            </div>
          </div>
        )}

        {/* 主要内容区域 */}
        <div className={cn("flex-1", icon && iconPosition === 'start' && "ml-8")}>
          {/* 标题 */}
          {title && (
            <div className="font-semibold" style={{ color: 'var(--alert-text)' }}>
              {title}
            </div>
          )}

          {/* 描述或子元素 */}
          {(description || children) && (
            <div className="mt-1 text-sm" style={{ color: 'var(--alert-text)', opacity: 0.9 }}>
              {description || children}
            </div>
          )}

          {/* 操作按钮 */}
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>

        {/* 关闭按钮 */}
        {(dismissible || showCloseButton) && (
          <button
            onClick={handleClose}
            className="absolute right-2 top-2 rounded-md p-1 hover:bg-accent-500-500-500 hover:text-text-on-accent transition-colors"
            aria-label="关闭警告"
            style={{ color: 'var(--alert-text)', opacity: 0.7 }}
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

Alert.displayName = 'Alert'

// =============================================================================
// 导出
// =============================================================================

export { Alert, alertVariants }
export type { AlertProps }