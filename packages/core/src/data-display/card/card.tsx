/**
 * Card 卡片组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 数据展示组件 - 灵活的卡片布局和内容展示
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const cardVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "rounded-lg border bg-background-primary-primary text-text-primary shadow-sm",
  {
    variants: {
      // 变体系统 - 使用七轴主题系统的颜色令牌
      variant: {
        default: "border-border-base-base bg-background-primary-primary text-text-primary",
        outline: "border-2 border-border-base-base bg-background-primary",
        elevated: "border-border-base-base bg-background-primary-primary shadow-lg",
        ghost: "border-transparent bg-transparent shadow-none",
        filled: "border-border-base-base bg-background-primary-secondary",
        primary: "border-primary bg-primary text-primary-foreground",
        secondary: "border-secondary bg-secondary-500-500 text-secondary-600-600-foreground",
        success: "border-success bg-success text-success-foreground",
        warning: "border-warning bg-warning text-warning-foreground",
        destructive: "border-error-500 bg-error-500 text-error-600-foreground",
      },

      // 尺寸系统 - 使用七轴主题系统的密度令牌
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },

      // 阴影效果
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        inner: "shadow-inner",
      },

      // 悬停效果
      hoverable: {
        true: "transition-shadow hover:shadow-md cursor-pointer",
        false: "",
      },

      // 圆角
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },

      // 边框样式
      borderStyle: {
        solid: "border-solid",
        dashed: "border-dashed",
        dotted: "border-dotted",
        double: "border-double",
      },

      // 交互状态
      interactive: {
        true: "cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        false: "",
      },

      // 可选中状态
      selectable: {
        true: "relative",
        false: "",
      },
    },

    // 默认变体
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shadow: 'sm',
      hoverable: false,
      rounded: 'lg',
      borderStyle: 'solid',
      interactive: false,
      selectable: false,
    },
  }
)

const cardContentVariants = cva(
  // 基础样式
  "",
  {
    variants: {
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
      spacing: {
        none: "space-y-0",
        sm: "space-y-2",
        md: "space-y-4",
        lg: "space-y-6",
      },
    },
    defaultVariants: {
      size: 'md',
      spacing: 'md',
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * 头部内容
   */
  header?: React.ReactNode

  /**
   * 主体内容
   */
  children?: React.ReactNode

  /**
   * 底部内容
   */
  footer?: React.ReactNode

  /**
   * 是否可选中
   */
  selected?: boolean

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 是否加载中
   */
  loading?: boolean

  /**
   * 加载遮罩
   */
  loadingOverlay?: React.ReactNode

  /**
   * 点击回调
   */
  onClick?: () => void

  /**
   * 卡片数据
   */
  data?: any

  /**
   * 自定义样式类名
   */
  className?: string
}

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * 标题
   */
  title?: React.ReactNode

  /**
   * 描述
   */
  description?: React.ReactNode

  /**
   * 操作区域
   */
  actions?: React.ReactNode

  /**
   * 图标
   */
  icon?: React.ReactNode

  /**
   * 是否居中
   */
  centered?: boolean
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardContentVariants> {
  /**
   * 内容对齐
   */
  align?: 'start' | 'center' | 'end' | 'justify'

  /**
   * 垂直对齐
   */
  valign?: 'start' | 'center' | 'end' | 'stretch'
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 对齐方式
   */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
}

// =============================================================================
// Card 主组件实现
// =============================================================================

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant,
      size,
      shadow,
      hoverable,
      rounded,
      borderStyle,
      interactive,
      selectable,
      header,
      children,
      footer,
      selected = false,
      disabled = false,
      loading = false,
      loadingOverlay,
      onClick,
      data,
      className,
      ...props
    },
    ref
  ) => {
    // 生成主题相关的样式
    const themeStyles: React.CSSProperties = {
      // 使用主题令牌
      ['--card-bg' as any]: `var(--xor-bg-primary)`,
      ['--card-text' as any]: `var(--xor-text-primary)`,
      ['--card-border' as any]: `var(--xor-border-primary)`,
      ['--card-shadow' as any]: `var(--xor-surface-shadow, hsl(0 0% 0% / 0.1))`,
    }

    // 处理点击事件
    const handleClick = React.useCallback(() => {
      if (!disabled && !loading && onClick) {
        onClick()
      }
    }, [disabled, loading, onClick])

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            variant,
            size,
            shadow,
            hoverable: hoverable && !disabled && !loading,
            rounded,
            borderStyle,
            interactive: interactive && !disabled && !loading,
            selectable,
          }),
          selected && "ring-2 ring-primary-500 ring-offset-2",
          disabled && "opacity-50 cursor-not-allowed",
          loading && "relative overflow-hidden",
          className
        )}
        style={themeStyles}
        onClick={handleClick}
        role={interactive ? "button" : undefined}
        tabIndex={interactive && !disabled ? 0 : undefined}
        aria-disabled={disabled}
        aria-selected={selectable ? selected : undefined}
        {...props}
      >
        {/* 选中指示器 */}
        {selectable && selected && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        )}

        {/* 头部 */}
        {header && (
          <div className="border-b border-border-base-base/50">
            {header}
          </div>
        )}

        {/* 主体内容 */}
        {children && (
          <div className="flex-1">
            {children}
          </div>
        )}

        {/* 底部 */}
        {footer && (
          <div className="border-t border-border-base-base/50 mt-auto">
            {footer}
          </div>
        )}

        {/* 加载遮罩 */}
        {loading && (
          <div className="absolute inset-0 bg-background-primary/80 backdrop-blur-sm flex items-center justify-center">
            {loadingOverlay || (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">加载中...</span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)

// =============================================================================
// CardHeader 组件实现
// =============================================================================

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      title,
      description,
      actions,
      icon,
      centered = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start justify-between p-4 pb-3",
          centered && "flex-col items-center text-center space-y-2",
          className
        )}
        style={{
          ['--card-header-text' as any]: `var(--xor-text-primary)`,
          ['--card-header-muted' as any]: `var(--xor-text-secondary-600-600)`,
        }}
        {...props}
      >
        <div className={cn("flex-1 min-w-0", centered && "text-center")}>
          {icon && (
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary mb-2",
              centered && "mx-auto"
            )}>
              {icon}
            </div>
          )}

          {title && (
            <h3 className="text-lg font-semibold leading-none tracking-tight text-card-header-text">
              {title}
            </h3>
          )}

          {description && (
            <p className="text-sm text-text-secondary-600 mt-1 text-card-header-muted">
              {description}
            </p>
          )}

          {children}
        </div>

        {actions && (
          <div className={cn("flex items-center space-x-2 ml-4", centered && "mt-2")}>
            {actions}
          </div>
        )}
      </div>
    )
  }
)

// =============================================================================
// CardContent 组件实现
// =============================================================================

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  (
    {
      size,
      spacing,
      align = 'start',
      valign = 'start',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardContentVariants({ size, spacing }),
          "text-text-primary",
          // 对齐样式
          {
            'text-center': align === 'center',
            'text-right': align === 'end' || align === 'justify',
            'text-left': align === 'start',
          },
          // 垂直对齐样式
          {
            'items-start': valign === 'start',
            'items-center': valign === 'center',
            'items-end': valign === 'end',
            'items-stretch': valign === 'stretch',
          },
          className
        )}
        style={{
          ['--card-content-text' as any]: `var(--xor-text-primary)`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

// =============================================================================
// CardFooter 组件实现
// =============================================================================

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  (
    {
      justify = 'end',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center p-4 pt-3",
          {
            'justify-start': justify === 'start',
            'justify-center': justify === 'center',
            'justify-end': justify === 'end',
            'justify-between': justify === 'between',
            'justify-around': justify === 'around',
            'justify-evenly': justify === 'evenly',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

// =============================================================================
// 专用 Card 组件
// =============================================================================

// SimpleCard - 简化卡片
export interface SimpleCardProps extends Omit<CardProps, 'header' | 'footer'> {
  cardTitle?: React.ReactNode
  cardDescription?: React.ReactNode
}

export const SimpleCard = React.forwardRef<HTMLDivElement, SimpleCardProps>(
  ({ cardTitle, cardDescription, children, ...props }, ref) => {
    return (
      <Card ref={ref} {...props}>
        {(cardTitle || cardDescription) && (
          <CardHeader title={cardTitle} description={cardDescription} />
        )}
        {children && <CardContent>{children}</CardContent>}
      </Card>
    )
  }
)

SimpleCard.displayName = 'SimpleCard'

// StatsCard - 统计卡片
export interface StatsCardProps extends Omit<CardProps, 'variant' | 'children'> {
  title: string
  value: string | number
  change?: {
    value: string | number
    type: 'increase' | 'decrease' | 'neutral'
  }
  icon?: React.ReactNode
}

export const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ title, value, change, icon, ...props }, ref) => {
    const { theme } = useTheme()

    return (
      <Card ref={ref} variant="default" {...props}>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary-600">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {change && (
                <p className={cn(
                  "text-sm flex items-center",
                  change.type === 'increase' && "text-success",
                  change.type === 'decrease' && "text-error-600",
                  change.type === 'neutral' && "text-text-secondary-600"
                )}>
                  {change.type !== 'neutral' && (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={change.type === 'increase' ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"}
                      />
                    </svg>
                  )}
                  {change.value}
                </p>
              )}
            </div>
            {icon && (
              <div className="p-2 bg-primary/10 rounded-lg">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)

StatsCard.displayName = 'StatsCard'

// =============================================================================
// 工具函数
// =============================================================================

/**
 * 创建卡片数据
 */
export const createCardData = <T,>(
  items: T[],
  getTitle: (item: T) => React.ReactNode,
  getDescription?: (item: T) => React.ReactNode,
  getIcon?: (item: T) => React.ReactNode
) => {
  return items.map(item => ({
    data: item,
    title: getTitle(item),
    description: getDescription?.(item),
    icon: getIcon?.(item),
  }))
}

/**
 * 过滤卡片数据
 */
export const filterCards = <T,>(
  cards: T[],
  query: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!query.trim()) return cards

  const lowerQuery = query.toLowerCase()
  return cards.filter(card =>
    searchFields.some(field => {
      const value = card[field]
      return typeof value === 'string' && value.toLowerCase().includes(lowerQuery)
    })
  )
}

// =============================================================================
// 组件元数据
// =============================================================================

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardContent.displayName = 'CardContent'
CardFooter.displayName = 'CardFooter'

// =============================================================================
// 变体导出
// =============================================================================

export { cardVariants, cardContentVariants }