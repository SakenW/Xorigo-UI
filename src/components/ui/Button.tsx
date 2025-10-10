import React, { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from '../../theme/ThemeProvider'
import { cn } from '../../utils/cn'

// 按钮变体配置
const buttonVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
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

        // 幽灵按钮
        ghost:
          'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',

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
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

// 按钮组件接口
export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'variant' | 'children'>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const { themeConfig } = useTheme()

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
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2">{icon}</span>
        )}

        <span>{children}</span>

        {icon && iconPosition === 'right' && !loading && (
          <span className="ml-2">{icon}</span>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
