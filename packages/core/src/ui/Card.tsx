'use client'

import React, { forwardRef, useState } from 'react'
import { motion, type MotionProps } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from '@xorigo-ui/system'
import { semanticColors } from '@xorigo-ui/tokens'
import { cn } from '@/utils'
import { Skeleton } from './Skeleton'

// 卡片变体配置
const cardVariants = cva('rounded-lg border transition-all duration-200', {
  variants: {
    variant: {
      default:
        'border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-xs',
      elevated:
        'border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-lg',
      bordered:
        'border-2 border-[var(--border-secondary)] bg-[var(--bg-secondary)]',
      filled:
        'border-transparent bg-[var(--bg-tertiary)]',
      glass:
        'border-[var(--border-glass)] bg-[var(--bg-glass)] backdrop-blur-md shadow-lg',
      neumorphic:
        'border-[var(--border-secondary)] bg-[var(--bg-tertiary)] shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)]',
      gradient:
        'border-transparent bg-gradient-to-br from-[var(--bg-primary-action)] to-[var(--bg-secondary-action)] text-[var(--text-inverse)] shadow-lg',
      neon: 'border-[var(--border-info)] bg-[var(--bg-contrast-high)]/50 text-[var(--text-info)] shadow-[0_0_20px_var(--border-info)]',
      outlined:
        'border-2 border-[var(--border-secondary)] bg-transparent',
      interactive:
        'border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-xs cursor-pointer',
    },
    density: {
      compact: 'p-3',
      comfortable: 'p-4',
      spacious: 'p-6',
    },
    animated: {
      true: 'transition-all duration-300 ease-in-out',
    },
  },
  defaultVariants: {
    variant: 'default',
    density: 'comfortable',
    animated: false,
  },
})

// 卡片组件接口
export interface CardProps
  extends Omit<MotionProps, 'children'>,
    VariantProps<typeof cardVariants> {
  className?: string
  children?: React.ReactNode
  hoverable?: boolean
  loading?: boolean
  onClick?: () => void
  // 向后兼容的 props
  hover?: boolean
  click?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      density,
      animated,
      hoverable,
      loading,
      onClick,
      children,
      // 向后兼容
      hover,
      click,
      size,
      ...motionProps
    },
    ref
  ) => {
    const { themeConfig } = useTheme()

    // 向后兼容：size 映射到 density
    const effectiveDensity = size
      ? size === 'sm'
        ? 'compact'
        : size === 'md'
          ? 'comfortable'
          : size === 'lg' || size === 'xl'
            ? 'spacious'
            : density
      : density

    // 向后兼容：hover/click 映射到 hoverable/onClick
    const isHoverable = hoverable ?? hover ?? false
    const isClickable = !!onClick || click

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

    // Hover 动画配置
    const hoverAnimation = isHoverable
      ? {
          y: -4,
          boxShadow:
            variant === 'elevated'
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              : variant === 'neon'
                ? '0 0 30px rgba(6,182,212,0.8)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }
      : undefined

    // 点击动画配置
    const tapAnimation = isClickable ? { scale: 0.98 } : undefined

    // Loading 状态渲染
    if (loading) {
      return (
        <div
          className={cn(
            cardVariants({ variant, density: effectiveDensity, animated, className })
          )}
          style={getCardStyle()}
        >
          <div className="space-y-3">
            <Skeleton variant="text" width="60%" height="1.5em" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
          </div>
        </div>
      )
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          cardVariants({ variant, density: effectiveDensity, animated, className }),
          isClickable && 'cursor-pointer',
          isHoverable && 'hover:border-[var(--border-secondary)]'
        )}
        style={getCardStyle()}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={onClick}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={
          isClickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClick?.()
                }
              }
            : undefined
        }
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
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
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

// 卡片图片组件
export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  position?: 'top' | 'left' | 'right' | 'cover'
  aspectRatio?: '16/9' | '4/3' | '1/1'
  lazy?: boolean
}

export const CardImage: React.FC<CardImageProps> = ({
  position = 'top',
  aspectRatio = '16/9',
  lazy = true,
  src,
  alt = '',
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const aspectRatioClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
  }

  const positionClasses = {
    top: '-m-4 mb-4 rounded-t-lg',
    left: '-m-4 mr-4 rounded-l-lg w-1/3 h-full object-cover',
    right: '-m-4 ml-4 rounded-r-lg w-1/3 h-full object-cover',
    cover: 'absolute inset-0 rounded-lg -z-10',
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setError(true)
  }

  if (error) {
    return (
      <div
        className={cn(
          'bg-[var(--bg-disabled)] flex items-center justify-center',
          aspectRatioClasses[aspectRatio],
          positionClasses[position],
          className
        )}
      >
        <svg
          className="w-12 h-12 text-[var(--text-disabled)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn('relative', position !== 'cover' && 'overflow-hidden')}>
      {isLoading && (
        <Skeleton
          variant="rectangular"
          className={cn(
            aspectRatioClasses[aspectRatio],
            positionClasses[position],
            'absolute inset-0'
          )}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          aspectRatioClasses[aspectRatio],
          positionClasses[position],
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        {...props}
      />
    </div>
  )
}

CardImage.displayName = 'CardImage'
