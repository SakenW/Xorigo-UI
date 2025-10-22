/**
 * Button 原子组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 从 ui/button 迁移至 primitives/button，集成新设计令牌系统
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const buttonVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      // 变体系统 - 使用七轴主题系统的颜色令牌
      variant: {
        primary: "bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },

      // 尺寸系统 - 使用七轴主题系统的密度令牌
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-10 rounded-md px-4 py-2 text-sm",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },

      // 状态变体
      state: {
        default: "",
        disabled: "pointer-events-none opacity-50",
        loading: "pointer-events-none",
        success: "bg-success-500 text-white hover:bg-success-600",
        warning: "bg-warning-500 text-white hover:bg-warning-600",
        danger: "bg-danger-500 text-white hover:bg-danger-600",
      }
    },

    // 默认变体
    defaultVariants: {
      variant: "primary",
      size: "md",
      state: "default",
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * 是否显示加载状态
   */
  loading?: boolean

  /**
   * 是否禁用按钮
   */
  disabled?: boolean

  /**
   * 左侧图标
   */
  leftIcon?: React.ReactNode

  /**
   * 右侧图标
   */
  rightIcon?: React.ReactNode

  /**
   * 自定义样式类名
   */
  className?: string

  /**
   * 子元素内容
   */
  children?: React.ReactNode

  /**
   * 加载状态时显示的文本
   */
  loadingText?: string

  /**
   * 按钮类型 - 默认为 button
   */
  type?: 'button' | 'submit' | 'reset'
}

// =============================================================================
// Button 组件实现
// =============================================================================

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      state,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className,
      children,
      loadingText,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()

    // 处理按钮状态逻辑
    const buttonState = disabled ? 'disabled' : loading ? 'loading' : state || 'default'

    // 生成 ARIA 属性
    const ariaProps: React.AriaAttributes = {
      'aria-disabled': disabled || loading,
      'aria-busy': loading,
    }

    // 构建按钮内容
    const renderContent = () => {
      if (loading) {
        return (
          <>
            <span
              className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            {loadingText || children}
          </>
        )
      }

      return (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          buttonVariants({
            variant,
            size,
            state: buttonState
          }),
          className
        )}
        style={{
          // 七轴主题系统集成
          '--button-primary': `hsl(${theme.colors.primary})`,
          '--button-secondary': `hsl(${theme.colors.secondary})`,
          // 可根据七轴动态调整
        } as React.CSSProperties}
        {...ariaProps}
        {...props}
      >
        {renderContent()}
      </button>
    )
  }
)

// =============================================================================
// 组件元数据
// =============================================================================

Button.displayName = 'Button'

// =============================================================================
// 导出
// =============================================================================

export { Button, buttonVariants }
export type { ButtonProps }
