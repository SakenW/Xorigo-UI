import React, { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from '../../theme/ThemeProvider'
import { cn } from '@th-ui/core'
import { Spinner } from './Spinner'

// 按钮变体配置
const buttonVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        // 主要按钮 - 使用主题渐变
        primary:
          'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-blue-500',

        // 次要按钮
        secondary:
          'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-500',

        // 成功按钮
        success:
          'bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-green-500',

        // 警告按钮
        warning:
          'bg-linear-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-amber-500',

        // 危险按钮
        danger:
          'bg-linear-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-red-500',

        // 幽灵按钮 - 透明背景，hover 时显示背景
        ghost:
          'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',

        // 链接按钮 - 无背景无边框
        link: 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 hover:underline focus:ring-blue-500 shadow-none',

        // 轮廓按钮
        outline:
          'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500',

        // 玻璃按钮
        glass:
          'backdrop-blur-xs bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 text-gray-900 dark:text-gray-100 hover:bg-white/30 dark:hover:bg-black/30 focus:ring-blue-500 will-change-transform',

        // 霓虹按钮
        neon: 'bg-black text-cyan-400 border border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)] hover:shadow-[0_0_20px_rgba(6,182,212,0.8)] hover:text-cyan-300 focus:ring-cyan-400',

        // 渐变边框按钮
        gradientOutline:
          'relative bg-transparent text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-purple-600 before:absolute before:inset-0 before:rounded-lg before:p-[2px] before:bg-linear-to-r before:from-blue-500 before:to-purple-600 before:-z-10 hover:before:scale-105 before:transition-transform',
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
      ...props
    },
    ref
  ) => {
    const { themeConfig } = useTheme()

    // 向后兼容：如果使用了旧的 icon prop，转换为新的 leftIcon/rightIcon
    const finalLeftIcon = leftIcon || (icon && iconPosition === 'left' ? icon : undefined)
    const finalRightIcon = rightIcon || (icon && iconPosition === 'right' ? icon : undefined)

    // 获取主题样式
    const getButtonStyle = () => {
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

    // iconOnly 模式
    if (iconOnly) {
      return (
        <motion.button
          ref={ref}
          className={cn(buttonVariants({ variant, size, fullWidth, iconOnly, className }))}
          disabled={disabled || loading}
          style={getButtonStyle()}
          whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
          whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
          transition={{ duration: 0.2 }}
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
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || loading}
        style={getButtonStyle()}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ duration: 0.2 }}
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
