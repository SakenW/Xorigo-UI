/**
 * Badge 徽章组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 状态/通知/进度/结果/无障碍提示
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useThemeSafe } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const badgeVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "inline-flex items-center justify-center rounded-full border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
  {
    variants: {
      // 变体系统 - 使用七轴主题系统的颜色令牌
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary-500-500 text-secondary-600-600-foreground hover:bg-secondary-500-500/80",
        destructive: "border-transparent bg-error-500 text-error-600-foreground hover:bg-error-500/80",
        outline: "text-text-primary border-border-base-base",
        success: "border-transparent bg-success text-success-foreground hover:bg-success/80",
        warning: "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        info: "border-transparent bg-info text-info-foreground hover:bg-info/80",
      },

      // 尺寸系统 - 使用七轴主题系统的密度令牌
      size: {
        xs: "px-1.5 py-0.5 text-xs leading-none min-w-[1.25rem] h-5",
        sm: "px-2 py-0.5 text-xs leading-none min-w-[1.5rem] h-6",
        md: "px-2.5 py-0.5 text-sm leading-none min-w-[2rem] h-7",
        lg: "px-3 py-1 text-sm leading-none min-w-[2.5rem] h-8",
        xl: "px-4 py-1.5 text-base leading-none min-w-[3rem] h-10",
      },

      // 形状
      shape: {
        rounded: "rounded-full",
        "rounded-lg": "rounded-lg",
        pill: "rounded-full px-3",
        square: "rounded-none",
      },

      // 状态
      state: {
        default: "",
        active: "ring-2 ring-primary-500 ring-offset-2",
        disabled: "opacity-50 cursor-not-allowed",
        interactive: "cursor-pointer hover:scale-105 active:scale-95",
      },

      // 是否显示点状指示器
      dot: {
        false: "",
        true: "p-0 min-w-0 h-auto",
      },
    },

    // 默认变体
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shape: 'rounded',
      state: 'default',
      dot: false,
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * 徽章内容
   */
  children?: React.ReactNode

  /**
   * 数字值（自动格式化）
   */
  count?: number

  /**
   * 最大显示数字（超过显示 "99+"）
   */
  maxCount?: number

  /**
   * 是否显示为零
   */
  showZero?: boolean

  /**
   * 自定义格式化函数
   */
  formatter?: (count: number) => string

  /**
   * 是否可移除
   */
  removable?: boolean

  /**
   * 移除回调
   */
  onRemove?: () => void

  /**
   * 角色标签
   */
  role?: 'status' | 'badge' | 'button'

  /**
   * ARIA 标签
   */
  ariaLabel?: string

  /**
   * 是否可点击
   */
  clickable?: boolean

  /**
   * 点击回调
   */
  onClick?: () => void

  /**
   * 自定义样式类名
   */
  className?: string
}

// =============================================================================
// Badge 主组件实现
// =============================================================================

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      variant,
      size,
      shape,
      state,
      dot,
      children,
      count,
      maxCount = 99,
      showZero = false,
      formatter,
      removable = false,
      onRemove,
      role = 'status',
      ariaLabel,
      clickable = false,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const theme = useThemeSafe()

    // 格式化计数
    const formattedCount = React.useMemo(() => {
      if (typeof count !== 'number') return null

      if (count === 0 && !showZero) return null

      if (formatter) {
        return formatter(count)
      }

      if (count > maxCount) {
        return `${maxCount}+`
      }

      return count.toString()
    }, [count, maxCount, showZero, formatter])

    // 生成主题相关的样式
    const themeStyles: React.CSSProperties = theme ? {
      '--badge-bg': `hsl(${theme?.colors[variant === 'default' ? 'primary' : variant]})`,
      '--badge-border': `hsl(${theme?.colors.border.primary || '#e5e5e5'})`,
      '--badge-text': `hsl(${theme?.colors.text.primary || '#000000'})`,
      '--badge-dot': `hsl(${theme?.colors[variant === 'default' ? 'primary' : variant]})`,
      // 可根据七轴动态调整
    } : {
      // 默认样式，当没有主题时使用
      '--badge-bg': 'hsl(var(--primary))',
      '--badge-border': 'hsl(var(--border))',
      '--badge-text': 'hsl(var(--primary-foreground))',
      '--badge-dot': 'hsl(var(--primary))',
    }

    // 生成 ARIA 属性
    const ariaProps: React.AriaAttributes = {
      'role': role,
      'aria-label': ariaLabel || (formattedCount ? `${formattedCount} items` : 'badge'),
    }

    // 确定最终状态
    const finalState = removable ? 'interactive' : clickable ? 'interactive' : state

    // 渲染点状指示器
    if (dot) {
      return (
        <div
          ref={ref}
          className={cn(
            "w-2 h-2 rounded-full",
            badgeVariants({
              variant,
              size: 'xs',
              shape: 'rounded',
              state: finalState,
              dot: true,
            }),
            className
          )}
          style={{
            backgroundColor: 'var(--badge-dot)',
            ...themeStyles
          }}
          {...ariaProps}
          {...props}
        />
      )
    }

    // 处理移除操作
    const handleRemove = React.useCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      onRemove?.()
    }, [onRemove])

    // 处理点击操作
    const handleClick = React.useCallback((e: React.MouseEvent) => {
      if (clickable || removable) {
        e.preventDefault()
        onClick?.()
      }
    }, [clickable, removable, onClick])

    // 确定内容
    const badgeContent = children || formattedCount

    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({
            variant,
            size,
            shape,
            state: finalState,
            dot: false,
          }),
          // 移除状态下的额外样式
          removable && "pr-1",
          className
        )}
        style={themeStyles}
        onClick={handleClick}
        {...ariaProps}
        {...props}
      >
        {/* 主要内容 */}
        <span className="truncate">
          {badgeContent}
        </span>

        {/* 移除按钮 */}
        {removable && (
          <button
            type="button"
            onClick={handleRemove}
            className="ml-1 rounded-full p-0.5 hover:bg-background-primary-inverse/10 hover:text-text-primary dark:hover:bg-background-primary-primary/10 dark:hover:text-text-on-primary transition-colors"
            aria-label="Remove badge"
          >
            <svg
              className="w-3 h-3"
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
// 专用 Badge 组件
// =============================================================================

// Status Badge - 状态徽章
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'online' | 'offline' | 'away' | 'busy' | 'invisible'
}

export const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, size = 'sm', className, ...props }, ref) => {
    const variantMap = {
      online: 'success',
      offline: 'secondary',
      away: 'warning',
      busy: 'destructive',
      invisible: 'outline',
    } as const

    const statusLabels = {
      online: 'Online',
      offline: 'Offline',
      away: 'Away',
      busy: 'Busy',
      invisible: 'Invisible',
    }

    return (
      <Badge
        ref={ref}
        variant={variantMap[status]}
        size={size}
        dot
        ariaLabel={statusLabels[status]}
        className={className}
        {...props}
      />
    )
  }
)

StatusBadge.displayName = 'StatusBadge'

// Notification Badge - 通知徽章
export interface NotificationBadgeProps extends Omit<BadgeProps, 'children' | 'count'> {
  notifications: number
  showZero?: boolean
}

export const NotificationBadge = React.forwardRef<HTMLDivElement, NotificationBadgeProps>(
  ({ notifications, showZero = false, size = 'sm', className, ...props }, ref) => {
    return (
      <Badge
        ref={ref}
        count={notifications}
        showZero={showZero}
        variant="destructive"
        size={size}
        ariaLabel={`${notifications} notifications`}
        className={className}
        {...props}
      />
    )
  }
)

NotificationBadge.displayName = 'NotificationBadge'

// =============================================================================
// 组件元数据
// =============================================================================

Badge.displayName = 'Badge'

// =============================================================================
// 导出
// =============================================================================

export { Badge, badgeVariants }
export type { BadgeProps }