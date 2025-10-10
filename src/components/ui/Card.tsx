import React, { forwardRef } from 'react'
import { motion, type MotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from '../../theme/ThemeProvider'
import { cn } from '../../utils/cn'

// 卡片变体配置
const cardVariants = cva('rounded-lg border transition-all duration-200', {
  variants: {
    variant: {
      default:
        'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xs hover:shadow-md',
      elevated:
        'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl',
      glass:
        'border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/10 backdrop-blur-md shadow-lg hover:shadow-xl hover:bg-white/20 dark:hover:bg-black/20 will-change-transform',
      neumorphic:
        'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-8px_-8px_16px_rgba(255,255,255,0.1)]',
      gradient:
        'border-transparent bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105',
      neon: 'border-cyan-400 bg-black/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)]',
      outlined:
        'border-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-transparent',
      interactive:
        'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xs hover:shadow-lg hover:scale-105 cursor-pointer',
    },
    size: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
    },
    animated: {
      true: 'transition-all duration-300 ease-in-out',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    animated: false,
  },
})

// 卡片组件接口
export interface CardProps
  extends Omit<MotionProps, 'children'>,
    VariantProps<typeof cardVariants> {
  className?: string
  children?: React.ReactNode
  hover?: boolean
  click?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      animated,
      hover,
      click,
      children,
      ...motionProps
    },
    ref
  ) => {
    const { themeConfig } = useTheme()

    // 获取主题样式
    const getCardStyle = () => {
      switch (variant) {
        case 'gradient':
          return {
            background: themeConfig.gradient,
            border: 'transparent',
          }
        case 'glass':
          return {
            background: themeConfig.palette.glass.background,
            borderColor: themeConfig.palette.glass.border,
            backdropFilter: 'blur(12px)',
          }
        case 'elevated':
          return {
            boxShadow: themeConfig.palette.shadows.primary,
          }
        default:
          return {}
      }
    }

    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ variant, size, animated, className }))}
        style={getCardStyle()}
        whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
        whileTap={click ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.2 }}
        {...motionProps}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

// 卡片头部组件
export interface CardHeaderProps {
  className?: string
  title?: string
  subtitle?: string
  action?: React.ReactNode
  children?: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  title,
  subtitle,
  action,
  children,
}) => (
  <div
    className={cn(
      'flex items-center justify-between space-y-0 pb-4',
      className
    )}
  >
    <div className="space-y-1">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
    </div>
    {action && <div>{action}</div>}
    {children}
  </div>
)

CardHeader.displayName = 'CardHeader'

// 卡片内容组件
export interface CardContentProps {
  className?: string
  children?: React.ReactNode
}

export const CardContent: React.FC<CardContentProps> = ({
  className,
  children,
}) => <div className={cn('pt-0', className)}>{children}</div>

CardContent.displayName = 'CardContent'

// 卡片底部组件
export interface CardFooterProps {
  className?: string
  children?: React.ReactNode
}

export const CardFooter: React.FC<CardFooterProps> = ({
  className,
  children,
}) => <div className={cn('flex items-center pt-4', className)}>{children}</div>

CardFooter.displayName = 'CardFooter'
