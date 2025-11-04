import React, { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils/cn'

// Separator变体配置
const separatorVariants = cva(
  'shrink-0',
  {
    variants: {
      orientation: {
        horizontal: 'h-px w-full',
        vertical: 'w-px h-full',
      },
      variant: {
        solid: 'bg-gray-200 dark:bg-gray-700',
        dashed: 'border-t border-dashed border-gray-300 dark:border-gray-600 bg-transparent',
        dotted: 'border-t border-dotted border-gray-300 dark:border-gray-600 bg-transparent',
      },
      thickness: {
        sm: {
          horizontal: 'h-px',
          vertical: 'w-px',
        },
        md: {
          horizontal: 'h-[2px]',
          vertical: 'w-[2px]',
        },
        lg: {
          horizontal: 'h-[3px]',
          vertical: 'w-[3px]',
        },
        xl: {
          horizontal: 'h-[4px]',
          vertical: 'w-[4px]',
        },
      },
      color: {
        default: '',
        primary: 'bg-blue-200 dark:bg-blue-800',
        secondary: 'bg-gray-200 dark:bg-gray-700',
        success: 'bg-green-200 dark:bg-green-800',
        warning: 'bg-yellow-200 dark:bg-yellow-800',
        danger: 'bg-red-200 dark:bg-red-800',
        info: 'bg-cyan-200 dark:bg-cyan-800',
      },
    },
    compoundVariants: [
      // 虚线和点线样式的特殊处理
      {
        variant: 'dashed',
        thickness: 'md',
        className: 'border-t-[2px]',
      },
      {
        variant: 'dashed',
        thickness: 'lg',
        className: 'border-t-[3px]',
      },
      {
        variant: 'dashed',
        thickness: 'xl',
        className: 'border-t-[4px]',
      },
      {
        variant: 'dotted',
        thickness: 'md',
        className: 'border-t-[2px]',
      },
      {
        variant: 'dotted',
        thickness: 'lg',
        className: 'border-t-[3px]',
      },
      {
        variant: 'dotted',
        thickness: 'xl',
        className: 'border-t-[4px]',
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'solid',
      thickness: 'sm',
      color: 'default',
    },
  }
)

// 文字标签样式
const labelVariants = cva(
  'text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-2',
  {
    variants: {
      position: {
        center: 'absolute left-1/2 -translate-x-1/2 -translate-y-1/2',
        start: 'absolute left-2 -translate-y-1/2',
        end: 'absolute right-2 -translate-y-1/2',
      },
      orientation: {
        horizontal: 'top-1/2',
        vertical: 'left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90',
      },
    },
    defaultVariants: {
      position: 'center',
      orientation: 'horizontal',
    },
  }
)

export interface SeparatorProps
  extends Omit<HTMLMotionProps<'div'>, 'variant'>,
    VariantProps<typeof separatorVariants> {
  /** 文字标签 */
  label?: string
  /** 标签位置 */
  labelPosition?: 'center' | 'start' | 'end'
  /** 自定义透明度 */
  opacity?: number
  /** 是否显示渐变效果 */
  gradient?: boolean
  /** 渐变颜色 */
  gradientColors?: string
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({
    className,
    orientation = 'horizontal',
    variant = 'solid',
    thickness = 'sm',
    color,
    label,
    labelPosition = 'center',
    opacity = 1,
    gradient = false,
    gradientColors = 'from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600',
    ...props
  }, ref) => {
    // 根据方向设置样式
    const isHorizontal = orientation === 'horizontal'

    // 渐变样式
    const gradientStyle = gradient && variant === 'solid' ? {
      background: `linear-gradient(${isHorizontal ? 'to right' : 'to bottom'}, var(--tw-gradient-stops))`,
    } : {}

    // 带标签的分隔符
    if (label) {
      return (
        <div
          ref={ref}
          className={cn(
            'relative flex items-center',
            isHorizontal ? 'w-full' : 'h-full',
            className
          )}
          style={{ opacity }}
          {...props}
        >
          {/* 左侧分隔线 */}
          <motion.div
            className={cn(
              separatorVariants({
                orientation,
                variant,
                thickness,
                color,
                className: 'flex-1'
              })
            )}
            style={gradientStyle}
            initial={{ opacity: 0, scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }}
            animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* 标签 */}
          <span className={cn(
            labelVariants({
              position: labelPosition,
              orientation
            })
          )}>
            {label}
          </span>

          {/* 右侧分隔线 */}
          <motion.div
            className={cn(
              separatorVariants({
                orientation,
                variant,
                thickness,
                color,
                className: 'flex-1'
              })
            )}
            style={gradientStyle}
            initial={{ opacity: 0, scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }}
            animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />
        </div>
      )
    }

    // 普通分隔符
    return (
      <motion.div
        ref={ref}
        className={cn(separatorVariants({ orientation, variant, thickness, color, className }))}
        style={{
          opacity,
          ...(gradient && gradientStyle)
        }}
        initial={{
          opacity: 0,
          scaleX: isHorizontal ? 0 : 1,
          scaleY: isHorizontal ? 1 : 0
        }}
        animate={{ opacity, scaleX: 1, scaleY: 1 }}
        transition={{ duration: 0.3 }}
        {...props}
      />
    )
  }
)

Separator.displayName = 'Separator'

// 垂直分隔符快捷组件
export interface VerticalSeparatorProps extends Omit<SeparatorProps, 'orientation'> {}

export const VerticalSeparator = forwardRef<HTMLDivElement, VerticalSeparatorProps>(
  (props, ref) => <Separator ref={ref} orientation="vertical" {...props} />
)

VerticalSeparator.displayName = 'VerticalSeparator'

// 水平分隔符快捷组件
export interface HorizontalSeparatorProps extends Omit<SeparatorProps, 'orientation'> {}

export const HorizontalSeparator = forwardRef<HTMLDivElement, HorizontalSeparatorProps>(
  (props, ref) => <Separator ref={ref} orientation="horizontal" {...props} />
)

HorizontalSeparator.displayName = 'HorizontalSeparator'

export {
  separatorVariants,
  labelVariants,
}