/**
 * Xorigo UI Button 组件 v1.1
 *
 * 遵循新的API设计标准：
 * - 统一5级尺寸系统 (xs, sm, md, lg, xl)
 * - 统一6种语义化变体 (primary, secondary, success, warning, danger, neutral)
 * - 标准状态控制 (disabled, loading, error)
 * - 完整的可访问性支持
 * - 标准的测试Props
 */

import React from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'
import { createStandardVariants, generateTestProps } from '../../tokens/token-utils'

// 标准CVA变体配置 - 遵循API设计标准
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      // 统一5级尺寸系统
      size: {
        xs: "h-6 px-2 text-xs",
        sm: "h-8 px-3 py-1.5 text-sm",
        md: "h-10 px-4 py-2 text-base",
        lg: "h-12 px-6 py-3 text-lg",
        xl: "h-14 px-8 py-4 text-xl",
      },
      // 统一6种语义化变体
      variant: {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
        secondary: "bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        neutral: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
      },
      // 标准状态控制
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
      },
      loading: {
        true: "opacity-75 cursor-wait",
      },
      error: {
        true: "border-red-500 focus:ring-red-500",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
    },
  }
)

// 标准Props接口 - 遵循API设计标准
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
            VariantProps<typeof buttonVariants> {
  /**
   * 加载状态
   * @default false
   */
  loading?: boolean

  /**
   * 加载时显示的文本
   */
  loadingText?: string

  /**
   * 左侧图标
   */
  leftIcon?: React.ReactNode

  /**
   * 右侧图标
   */
  rightIcon?: React.ReactNode

  /**
   * 仅图标模式
   * @default false
   */
  iconOnly?: boolean

  /**
   * 测试ID
   */
  testId?: string
}

// 加载动画组件
const LoadingSpinner = ({ size }: { size: string }) => {
  const sizeClass = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  }[size] || 'w-4 h-4'

  return (
    <svg
      className={cn('animate-spin', sizeClass)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

/**
 * Button 组件 v1.1
 *
 * 遵循Xorigo UI v1.1 API设计标准
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" loading={false}>
 *   点击我
 * </Button>
 *
 * <Button variant="success" size="lg" leftIcon={<CheckIcon />}>
 *   保存
 * </Button>
 *
 * <Button variant="danger" iconOnly>
 *   <TrashIcon />
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    size,
    variant,
    disabled = false,
    loading = false,
    error = false,
    loadingText,
    leftIcon,
    rightIcon,
    iconOnly = false,
    testId,
    className,
    children,
    ...props
  }, ref) => {
    // 生成标准测试Props
    const testProps = generateTestProps('button', {
      variant,
      size,
      state: disabled ? 'disabled' : loading ? 'loading' : error ? 'error' : 'normal',
      testId,
    })

    // 处理显示内容
    const displayContent = loading && loadingText ? loadingText : children

    // 处理图标尺寸
    const getIconSize = () => {
      const iconSizeMap = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
        xl: 'w-6 h-6',
      }
      return iconSizeMap[size || 'md']
    }

    // 动画配置
    const animationProps = {
      whileHover: { scale: disabled || loading ? 1 : 1.02 },
      whileTap: { scale: disabled || loading ? 1 : 0.98 },
      transition: { duration: 0.2 },
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          buttonVariants({
            size,
            variant,
            disabled,
            loading,
            error
          }),
          // iconOnly模式的特殊样式
          iconOnly && {
            xs: 'w-6 px-0',
            sm: 'w-8 px-0',
            md: 'w-10 px-0',
            lg: 'w-12 px-0',
            xl: 'w-14 px-0',
          }[size || 'md'],
          className
        )}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        aria-label={iconOnly && typeof children === 'string' ? children : undefined}
        {...testProps}
        {...animationProps}
        {...props}
      >
        {loading && (
          <span className={cn("mr-2", iconOnly && "mr-0")}>
            <LoadingSpinner size={size || 'md'} />
          </span>
        )}

        {!loading && leftIcon && !iconOnly && (
          <span className="mr-2">
            <span className={getIconSize()}>
              {leftIcon}
            </span>
          </span>
        )}

        {displayContent && (
          <span className={cn(iconOnly && "sr-only")}>
            {displayContent}
          </span>
        )}

        {!loading && rightIcon && !iconOnly && (
          <span className="ml-2">
            <span className={getIconSize()}>
              {rightIcon}
            </span>
          </span>
        )}

        {!loading && iconOnly && (leftIcon || rightIcon || children) && (
          <span className={getIconSize()}>
            {leftIcon || rightIcon || children}
          </span>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

// 导出变体类型
export { buttonVariants }
export type ButtonVariants = VariantProps<typeof buttonVariants>

// 预设组件导出 - 遵循复合组件模式
export const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: ButtonProps['variant']
    size?: ButtonProps['size']
  }
>(({ className, variant, size, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex",
      // 分组样式
      "[&>*:not(:first-child)]:-ml-px",
      "[&>*:not(:first-child)]:rounded-l-none",
      "[&>*:not(:last-child)]:rounded-r-none",
      className
    )}
    role="group"
    {...props}
  >
      {/* 克隆子组件并注入相同的 variant 和 size */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Button) {
          return React.cloneElement(child, {
            variant: variant || child.props.variant,
            size: size || child.props.size,
          } as ButtonProps)
        }
        return child
      })}
  </div>
))

ButtonGroup.displayName = 'ButtonGroup'

// 复合组件类型定义
export interface ButtonCompound {
  Root: typeof Button
  Group: typeof ButtonGroup
}

/**
 * Button 复合组件
 */
export const ButtonComponent: ButtonCompound = {
  Root: Button,
  Group: ButtonGroup,
}

// 默认导出
export default Button