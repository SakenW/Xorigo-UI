'use client'
/**
 * @fileoverview Card 组件 - 数据展示卡片
 * @description 用于数据展示的卡片组件，支持多种变体、状态和交互
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-04
 */

import React, { forwardRef, useState } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../../utils'
import { Skeleton } from '../../primitives/Skeleton'

// =============================================================================
// 变体配置
// =============================================================================

const cardVariants = cva(
  // 基础样式
  'relative w-full rounded-2xl transition-all duration-300 break-inside-avoid',
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--bg-primary)]',
          'border border-[var(--border-primary)]',
          'shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        ].join(' '),
        elevated: [
          'bg-[var(--bg-primary)]',
          'border border-[var(--border-primary)]',
          'shadow-[0_4px_12px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)]',
        ].join(' '),
        bordered: [
          'bg-[var(--bg-primary)]',
          'border-2 border-[var(--border-secondary)]',
          'shadow-none',
        ].join(' '),
        filled: [
          'bg-[var(--bg-secondary)]',
          'border border-[var(--border-tertiary)]',
          'shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        ].join(' '),
        glass: [
          'bg-[var(--bg-glass)]',
          'border border-[var(--border-glass)]',
          'backdrop-blur-md',
          'shadow-[0_4px_12px_rgba(0,0,0,0.1)]',
        ].join(' '),
        gradient: [
          'bg-gradient-to-br from-[var(--bg-primary-action)] to-[var(--bg-secondary-action)]',
          'border border-transparent',
          'text-[var(--text-inverse)]',
          'shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
        ].join(' '),
        neon: [
          'bg-[var(--bg-contrast-high)]',
          'border border-[var(--border-info)]',
          'text-[var(--text-info)]',
          'shadow-[0_0_20px_rgba(var(--border-info-rgb,59,130,246),0.3)]',
        ].join(' '),
        interactive: [
          'bg-[var(--bg-primary)]',
          'border border-[var(--border-primary)]',
          'shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
          'cursor-pointer',
          'hover:border-[var(--border-secondary)]',
          'hover:shadow-[0_4px_12px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)]',
          'active:scale-[0.98]',
        ].join(' '),
      },
      shadowLevel: {
        none: 'shadow-none',
        xs: 'shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        sm: 'shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]',
        md: 'shadow-[0_4px_6px_rgba(0,0,0,0.07),0_2px_4px_rgba(0,0,0,0.05)]',
        lg: 'shadow-[0_10px_15px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.05)]',
        xl: 'shadow-[0_20px_25px_rgba(0,0,0,0.1),0_10px_10px_rgba(0,0,0,0.04)]',
        '2xl': 'shadow-[0_25px_50px_rgba(0,0,0,0.25)]',
      },
      roundness: {
        none: 'rounded-none',
        sm: 'rounded-lg',
        md: 'rounded-xl',
        lg: 'rounded-2xl',
        xl: 'rounded-3xl',
        full: 'rounded-full',
      },
      interactive: {
        true: 'cursor-pointer hover:-translate-y-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      shadowLevel: 'sm',
      roundness: 'lg',
      interactive: false,
    },
  }
)

// =============================================================================
// Props 类型定义
// =============================================================================

export interface CardProps
  extends Omit<HTMLMotionProps<'div'>, 'children'>,
    VariantProps<typeof cardVariants> {
  /** 卡片内容 */
  children?: React.ReactNode
  /** 自定义样式类 */
  className?: string
  /** 悬停效果 */
  hoverable?: boolean
  /** 加载状态 */
  loading?: boolean
  /** 禁用状态 */
  disabled?: boolean
  /** 选中状态 */
  selected?: boolean
  /** 点击事件 */
  onClick?: () => void
  /** 悬浮事件 */
  onHover?: (isHovered: boolean) => void
  /** 装饰性图标 */
  icon?: React.ReactNode
  /** 右上角操作区 */
  actions?: React.ReactNode
  /** 徽章（如：新品、推荐等） */
  badge?: string | React.ReactNode
  /** 徽章颜色 */
  badgeColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  /** 媒体内容（图片、视频等） */
  media?: React.ReactNode
  /** 媒体位置 */
  mediaPosition?: 'top' | 'left' | 'right' | 'cover'
  /** 媒体宽高比 */
  mediaAspectRatio?: '16/9' | '4/3' | '1/1' | '21/9'
  /** 测试ID */
  testId?: string
}

// =============================================================================
// 组件实现
// =============================================================================

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      shadowLevel,
      roundness,
      interactive,
      children,
      hoverable = false,
      loading = false,
      disabled = false,
      selected = false,
      onClick,
      onHover,
      icon,
      actions,
      badge,
      badgeColor = 'primary',
      media,
      mediaPosition = 'top',
      mediaAspectRatio = '16/9',
      testId,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false)
    const { themeConfig } = useTheme()

    // 合并交互状态
    const isInteractive = interactive || !!onClick || hoverable
    const isDisabled = disabled || loading

    // 获取卡片样式
    const getCardStyle = () => {
      switch (variant) {
        case 'gradient':
          return {
            background: themeConfig.gradient,
          }
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

    // 徽章样式映射
    const badgeColorMap = {
      primary: 'bg-[var(--bg-primary-action)] text-[var(--text-inverse)]',
      secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)]',
      success: 'bg-[var(--bg-success)] text-[var(--text-inverse)]',
      warning: 'bg-[var(--bg-warning)] text-[var(--text-inverse)]',
      error: 'bg-[var(--bg-error)] text-[var(--text-inverse)]',
      info: 'bg-[var(--bg-info)] text-[var(--text-inverse)]',
    }

    // 媒体区域宽高比
    const aspectRatioMap = {
      '16/9': 'aspect-video',
      '4/3': 'aspect-[4/3]',
      '1/1': 'aspect-square',
      '21/9': 'aspect-[21/9]',
    }

    // 媒体位置
    const mediaPositionMap = {
      top: 'rounded-t-2xl overflow-hidden -m-1 mb-1',
      left: 'rounded-l-2xl overflow-hidden -ml-1 mr-4 w-1/3 h-full',
      right: 'rounded-r-2xl overflow-hidden -mr-1 ml-4 w-1/3 h-full',
      cover: 'absolute inset-0 -z-10 rounded-2xl',
    }

    // 悬浮处理
    const handleMouseEnter = () => {
      setIsHovered(true)
      onHover?.(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      onHover?.(false)
    }

    // 加载状态
    if (loading) {
      return (
        <div
          className={cn(
            cardVariants({ variant, shadowLevel, roundness, interactive }),
            className
          )}
          style={getCardStyle()}
          data-testid={testId || 'card-loading'}
          data-component="card"
          data-state="loading"
        >
          <div className="p-6 space-y-4">
            {/* 标题骨架屏 */}
            <div className="space-y-2">
              <Skeleton variant="text" width="60%" height="1.5rem" />
              <Skeleton variant="text" width="40%" height="1rem" />
            </div>

            {/* 媒体骨架屏 */}
            {media && (
              <div className={cn('bg-[var(--bg-disabled)] rounded-lg', aspectRatioMap[mediaAspectRatio])}>
                <Skeleton variant="rectangular" className="w-full h-full" />
              </div>
            )}

            {/* 内容骨架屏 */}
            <div className="space-y-2">
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="80%" />
            </div>

            {/* 底部骨架屏 */}
            <div className="flex justify-between items-center pt-4">
              <Skeleton variant="text" width="30%" height="1rem" />
              <Skeleton variant="circular" width="2rem" height="2rem" />
            </div>
          </div>
        </div>
      )
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          cardVariants({ variant, shadowLevel, roundness, interactive: isInteractive }),
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          selected && 'ring-2 ring-[var(--ring-primary-action)]',
          isInteractive && !isDisabled && 'hover:-translate-y-1',
          className
        )}
        style={getCardStyle()}
        data-testid={testId}
        data-component="card"
        data-state={isDisabled ? 'disabled' : isHovered ? 'hovered' : 'normal'}
        onClick={!isDisabled ? onClick : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={isInteractive && !isDisabled ? { y: -4 } : undefined}
        whileTap={isInteractive && !isDisabled ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onKeyDown={
          isInteractive
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClick?.()
                }
              }
            : undefined
        }
        {...props}
      >
        {/* 徽章 */}
        {badge && (
          <div
            className={cn(
              'absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-semibold',
              badgeColorMap[badgeColor]
            )}
          >
            {badge}
          </div>
        )}

        {/* 媒体内容 */}
        {media && mediaPosition !== 'cover' && (
          <div className={mediaPositionMap[mediaPosition]}>
            <div className={cn(aspectRatioMap[mediaAspectRatio])}>{media}</div>
          </div>
        )}

        {/* 主要内容容器 */}
        <div className="relative p-6">
          {/* 头部区域（图标 + 标题 + 操作） */}
          {(icon || actions || React.Children.toArray(children).some(
            (child: any) => child?.type?.displayName === 'CardHeader'
          )) && (
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                    {icon}
                  </div>
                )}
              </div>
              {actions && <div className="flex-shrink-0">{actions}</div>}
            </div>
          )}

          {/* 子组件渲染区域 */}
          {children}

          {/* 背景覆盖媒体 */}
          {media && mediaPosition === 'cover' && (
            <div className={mediaPositionMap[mediaPosition]}>
              {media}
            </div>
          )}
        </div>
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

// =============================================================================
// 子组件：CardHeader
// =============================================================================

export interface CardHeaderProps {
  children?: React.ReactNode
  className?: string
  /** 标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 头部右侧操作区 */
  action?: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  title,
  subtitle,
  action,
}) => {
  if (children) return <div className={cn('mb-4', className)}>{children}</div>

  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
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
    </div>
  )
}

CardHeader.displayName = 'CardHeader'

// =============================================================================
// 子组件：CardBody
// =============================================================================

export interface CardBodyProps {
  children?: React.ReactNode
  className?: string
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className,
}) => {
  return <div className={cn('text-[var(--text-primary)]', className)}>{children}</div>
}

CardBody.displayName = 'CardBody'

// =============================================================================
// 子组件：CardFooter
// =============================================================================

export interface CardFooterProps {
  children?: React.ReactNode
  className?: string
  /** 底部对齐方式 */
  align?: 'left' | 'center' | 'right' | 'between'
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  align = 'left',
}) => {
  const alignMap = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  }

  return (
    <div className={cn('flex items-center pt-4 mt-4 border-t border-[var(--border-primary)]', alignMap[align], className)}>
      {children}
    </div>
  )
}

CardFooter.displayName = 'CardFooter'

// =============================================================================
// 导出类型
// =============================================================================

export { cardVariants }
export type CardVariants = VariantProps<typeof cardVariants>
