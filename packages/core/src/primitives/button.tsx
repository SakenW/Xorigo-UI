import React, { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { semanticUtils } from '@xorigo-ui/tokens'
import { cn } from '../utils'
import { Spinner } from './Spinner'
import { getButtonAriaProps } from '../utils/accessibility'

// 测试Props生成工具 - 从v1.1版本引入
const generateTestProps = (component: string, options: {
  variant?: string
  size?: string
  state?: string
  testId?: string
}) => {
  const { variant, size, state, testId } = options
  const testIdValue = testId || `${component}-${variant || 'default'}-${size || 'md'}-${state || 'normal'}`
  return {
    'data-testid': testIdValue,
    'data-component': component,
    'data-variant': variant,
    'data-size': size,
    'data-state': state,
  }
}

// 使用语义化令牌定义按钮变体
const getSemanticVariantClasses = () => ({
  // 主要按钮 - 使用语义化主色
  primary: `bg-gradient-to-r from-[var(--bg-primary-action)] to-[var(--bg-secondary-action)] text-[var(--text-inverse)] shadow-lg hover:shadow-xl hover:scale-105 focus:ring-[var(--ring-primary-action)]`,

  // 次要按钮 - 使用语义化次要色
  secondary: `bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)] focus:ring-[var(--border-primary)]`,

  // 成功按钮 - 使用语义化成功色
  success: `bg-gradient-to-r from-[var(--bg-success)] to-[var(--bg-success-hover)] text-[var(--text-inverse)] shadow-lg hover:shadow-xl hover:scale-105 focus:ring-[var(--ring-success)]`,

  // 警告按钮 - 使用语义化警告色
  warning: `bg-gradient-to-r from-[var(--bg-warning)] to-[var(--bg-warning-hover)] text-[var(--text-inverse)] shadow-lg hover:shadow-xl hover:scale-105 focus:ring-[var(--ring-warning)]`,

  // 危险按钮 - 使用语义化错误色
  danger: `bg-gradient-to-r from-[var(--bg-error)] to-[var(--bg-error-hover)] text-[var(--text-inverse)] shadow-lg hover:shadow-xl hover:scale-105 focus:ring-[var(--ring-error)]`,

  // 幽灵按钮 - 透明背景，hover 时显示背景
  ghost: `text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] focus:ring-[var(--border-primary)]`,

  // 链接按钮 - 无背景无边框
  link: `text-[var(--text-primary-action)] hover:text-[var(--text-primary-action-hover)] hover:underline focus:ring-[var(--ring-primary-action)] shadow-none`,

  // 轮廓按钮
  outline: `border-2 text-[var(--text-primary-action)] border-[var(--border-primary-action)] hover:bg-[var(--bg-primary-action)] hover:text-[var(--text-inverse)] focus:ring-[var(--ring-primary-action)]`,

  // 玻璃按钮 - 使用语义化玻璃效果
  glass: `backdrop-blur-xs bg-[var(--bg-glass)] border-[var(--border-glass)] text-[var(--text-glass)] hover:bg-[var(--bg-floating)] focus:ring-[var(--ring-primary-action)] will-change-transform`,

  // 霓虹按钮 - 使用语义化信息色
  neon: `bg-[var(--bg-contrast-high)] text-[var(--text-info)] border border-[var(--border-info)] shadow-[0_0_10px_var(--border-info)] hover:shadow-[0_0_20px_var(--border-info)] hover:text-[var(--text-info)] focus:ring-[var(--ring-info)]`,

  // 渐变边框按钮
  gradientOutline: `relative bg-transparent text-transparent bg-clip-text bg-gradient-to-r from-[var(--bg-primary-action)] to-[var(--bg-secondary-action)] before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-gradient-to-r before:from-[var(--bg-primary-action)] before:to-[var(--bg-secondary-action)] before:-z-10 hover:before:scale-105 before:transition-transform`,
})

// 按钮变体配置
const buttonVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        // 主要按钮 - 使用主题渐变
        primary: '',

        // 次要按钮
        secondary: '',

        // 成功按钮
        success: '',

        // 警告按钮
        warning: '',

        // 危险按钮
        danger: '',

        // 幽灵按钮 - 透明背景，hover 时显示背景
        ghost: '',

        // 链接按钮 - 无背景无边框
        link: '',

        // 轮廓按钮
        outline: '',

        // 玻璃按钮
        glass: '',

        // 霓虹按钮
        neon: '',

        // 渐变边框按钮
        gradientOutline: '',
      },
      size: {
        xs: 'px-2 py-1 text-xs min-h-[24px]',
        sm: 'px-3 py-1.5 text-sm min-h-[32px]',
        md: 'px-4 py-2 text-sm min-h-[40px]',
        lg: 'px-6 py-3 text-base min-h-[48px]',
        xl: 'px-8 py-4 text-lg min-h-[56px]',
        '2xl': 'px-10 py-5 text-xl min-h-[64px]',
      },
      fullWidth: {
        true: 'w-full',
      },
      iconOnly: {
        true: 'aspect-square p-0',
      },
    },
    compoundVariants: [
      // iconOnly 模式下的尺寸调整
      {
        iconOnly: true,
        size: 'xs',
        className: 'w-[24px] h-[24px]',
      },
      {
        iconOnly: true,
        size: 'sm',
        className: 'w-[32px] h-[32px]',
      },
      {
        iconOnly: true,
        size: 'md',
        className: 'w-[40px] h-[40px]',
      },
      {
        iconOnly: true,
        size: 'lg',
        className: 'w-[48px] h-[48px]',
      },
      {
        iconOnly: true,
        size: 'xl',
        className: 'w-[56px] h-[56px]',
      },
      {
        iconOnly: true,
        size: '2xl',
        className: 'w-[64px] h-[64px]',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      iconOnly: false,
    },
  }
)

// 图标尺寸映射
const iconSizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
  '2xl': 'w-7 h-7',
}

// 按钮组件接口
export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'variant' | 'children'>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode
  /** 加载状态 */
  loading?: boolean
  /** 加载时显示的文本 */
  loadingText?: string
  /** 左侧图标 */
  leftIcon?: React.ReactNode
  /** 右侧图标 */
  rightIcon?: React.ReactNode
  /** 仅图标模式（圆形按钮） */
  iconOnly?: boolean
  /** 旧版兼容 - 使用 leftIcon 替代 */
  icon?: React.ReactNode
  /** 旧版兼容 - 使用 leftIcon/rightIcon 替代 */
  iconPosition?: 'left' | 'right'
  /** 可访问性属性 */
  ariaLabel?: string
  /** 按钮状态 - 用于toggle按钮 */
  pressed?: boolean
  /** 展开状态 - 用于下拉菜单等 */
  expanded?: boolean
  /** 描述信息 */
  describedBy?: string
  /** 测试ID - 从v1.1版本引入 */
  testId?: string
  /** 错误状态 - 从v1.1版本引入 */
  error?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = 'md',
      fullWidth,
      iconOnly,
      loading,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      // 旧版兼容
      icon,
      iconPosition = 'left',
      // 可访问性属性
      ariaLabel,
      pressed,
      expanded,
      describedBy,
      // v1.1版本新增属性
      testId,
      error = false,
      ...props
    },
    ref
  ) => {
    const { themeConfig } = useTheme()

    // 向后兼容：如果使用了旧的 icon prop，转换为新的 leftIcon/rightIcon
    const finalLeftIcon = leftIcon || (icon && iconPosition === 'left' ? icon : undefined)
    const finalRightIcon = rightIcon || (icon && iconPosition === 'right' ? icon : undefined)

    // 获取语义化变体类名
    const getSemanticClasses = () => {
      const semanticVariants = getSemanticVariantClasses()
      return semanticVariants[variant as keyof typeof semanticVariants] || ''
    }

    // 获取主题样式
    const getButtonStyle = () => {
      // 语义化令牌优先，fallback到主题配置
      switch (variant) {
        case 'primary':
          return { background: themeConfig.gradient }
        case 'glass':
          return {
            background: themeConfig.palette.glass.background,
            borderColor: themeConfig.palette.glass.border,
            backdropFilter: 'blur(12px)',
          }
        default:
          return {}
      }
    }

    // 图标包装器
    const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <span className={cn('inline-flex items-center justify-center', iconSizeMap[size || 'md'])}>
        {children}
      </span>
    )

    // 生成可访问性属性
    const ariaProps = getButtonAriaProps({
      loading,
      disabled,
      pressed,
      expanded,
      label: ariaLabel,
      describedBy
    })

    // 生成测试Props - 从v1.1版本引入
    const testProps = generateTestProps('button', {
      variant,
      size,
      state: disabled ? 'disabled' : loading ? 'loading' : error ? 'error' : 'normal',
      testId,
    })

    // 确定组件状态 - 从v1.1版本引入
    const componentState = disabled ? 'disabled' : loading ? 'loading' : error ? 'error' : 'normal'

    // iconOnly 模式
    if (iconOnly) {
      return (
        <motion.button
          ref={ref}
          className={cn(
            buttonVariants({ variant, size, fullWidth, iconOnly }),
            getSemanticClasses(),
            className
          )}
          disabled={disabled || loading}
          style={getButtonStyle()}
          whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
          whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
          transition={{ duration: 0.2 }}
          {...ariaProps}
          {...testProps}
          {...props}
        >
          {loading ? (
            <Spinner size={size} />
          ) : (
            <IconWrapper>{finalLeftIcon || finalRightIcon || children}</IconWrapper>
          )}
        </motion.button>
      )
    }

    // 显示的内容
    const displayContent = loading && loadingText ? loadingText : children

    return (
      <motion.button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          getSemanticClasses(),
          className
        )}
        disabled={disabled || loading}
        style={getButtonStyle()}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ duration: 0.2 }}
        {...ariaProps}
        {...testProps}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <span className="mr-2">
            <Spinner size={size} />
          </span>
        )}

        {/* 左侧图标 */}
        {!loading && finalLeftIcon && (
          <span className="mr-2">
            <IconWrapper>{finalLeftIcon}</IconWrapper>
          </span>
        )}

        {/* 内容 */}
        {displayContent && <span>{displayContent}</span>}

        {/* 右侧图标 */}
        {!loading && finalRightIcon && (
          <span className="ml-2">
            <IconWrapper>{finalRightIcon}</IconWrapper>
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

