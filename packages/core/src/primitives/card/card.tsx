/**
 * Card 原子组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 从 ui/card 迁移至 primitives/card，集成新设计令牌系统
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
      // 变体系统 - 使用七轴主题系统的表面令牌
      variant: {
        default: "border-border-base-base bg-background-primary-primary",
        outlined: "border-2 border-border-base-base bg-background-primary",
        elevated: "border-0 shadow-lg bg-background-primary-primary",
        ghost: "border-0 bg-transparent shadow-none",
        filled: "border-0 bg-background-primary-secondary",
      },

      // 尺寸系统 - 使用七轴主题系统的密度令牌
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },

      // 交互状态
      interactive: {
        none: "",
        hover: "hover:shadow-md hover:bg-accent-500-500-500/50 cursor-pointer transition-all",
        click: "active:scale-95 cursor-pointer transition-transform",
      },

      // 表面效果 - 使用七轴主题系统的表面令牌
      surface: {
        flat: "",
        'soft-shadow': "shadow-md",
        glass: "backdrop-blur-md bg-background-primary-primary/80 border-white/20",
        neon: "shadow-none border-primary/50 shadow-lg shadow-primary/25",
      }
    },

    // 默认变体
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: "none",
      surface: "flat",
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
   * 卡片标题
   */
  title?: React.ReactNode

  /**
   * 卡片描述
   */
  description?: React.ReactNode

  /**
   * 卡片操作区域
   */
  actions?: React.ReactNode

  /**
   * 是否显示卡片头部
   */
  showHeader?: boolean

  /**
   * 是否显示卡片底部
   */
  showFooter?: boolean

  /**
   * 卡片图标
   */
  icon?: React.ReactNode

  /**
   * 是否可悬停
   */
  hoverable?: boolean

  /**
   * 卡片加载状态
   */
  loading?: boolean

  /**
   * 子元素内容
   */
  children?: React.ReactNode

  /**
   * 自定义样式类名
   */
  className?: string
}

// =============================================================================
// Card 子组件 - CardHeader
// =============================================================================

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardHeader.displayName = "CardHeader"

// =============================================================================
// Card 子组件 - CardTitle
// =============================================================================

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  className?: string
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ level = 'h3', className, children, ...props }, ref) => {
    const HeadingTag = level
    return (
      <HeadingTag
        ref={ref}
        className={cn(
          "text-2xl font-semibold leading-none tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </HeadingTag>
    )
  }
)
CardTitle.displayName = "CardTitle"

// =============================================================================
// Card 子组件 - CardDescription
// =============================================================================

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-text-secondary-600", className)}
      {...props}
    >
      {children}
    </p>
  )
)
CardDescription.displayName = "CardDescription"

// =============================================================================
// Card 子组件 - CardContent
// =============================================================================

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
)
CardContent.displayName = "CardContent"

// =============================================================================
// Card 子组件 - CardFooter
// =============================================================================

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardFooter.displayName = "CardFooter"

// =============================================================================
// Card 主组件实现
// =============================================================================

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant,
      size,
      interactive,
      surface,
      title,
      description,
      actions,
      showHeader,
      showFooter,
      icon,
      hoverable,
      loading,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()

    // 处理交互状态
    const interactiveVariant = hoverable ? "hover" : interactive

    // 生成 ARIA 属性
    const ariaProps: React.AriaAttributes = {
      'aria-busy': loading,
    }

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({
            variant,
            size,
            interactive: interactiveVariant,
            surface,
          }),
          className
        )}
        style={{
          // 七轴主题系统集成
          '--card-bg': `hsl(${theme.colors.background})`,
          '--card-border': `hsl(${theme.colors.border.primary})`,
          '--card-shadow': theme.surface.shadow,
          // 可根据七轴动态调整
        } as React.CSSProperties}
        {...ariaProps}
        {...props}
      >
        {/* 卡片头部 */}
        {(title || description || icon) && (showHeader !== false) && (
          <CardHeader>
            <div className="flex items-start gap-3">
              {icon && (
                <div className="mt-1 flex-shrink-0">{icon}</div>
              )}
              <div className="flex-1 min-w-0">
                {title && <CardTitle>{title}</CardTitle>}
                {description && <CardDescription>{description}</CardDescription>}
              </div>
            </div>
          </CardHeader>
        )}

        {/* 卡片内容 */}
        {children && <CardContent>{children}</CardContent>}

        {/* 卡片底部 */}
        {actions && (showFooter !== false) && (
          <CardFooter>{actions}</CardFooter>
        )}

        {/* 加载状态 */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background-primary/50 rounded-lg">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    )
  }
)

// =============================================================================
// 组件元数据
// =============================================================================

Card.displayName = 'Card'

// =============================================================================
// 导出
// =============================================================================

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants
}

export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps
}
