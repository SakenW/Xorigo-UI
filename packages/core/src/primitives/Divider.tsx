'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'

// Divider变体配置
const dividerVariants = cva(
  // 基础样式
  'border-[var(--border-primary)]',
  {
    variants: {
      orientation: {
        horizontal: 'border-t',
        vertical: 'border-l',
      },
      variant: {
        solid: 'border-solid',
        dashed: 'border-dashed',
        dotted: 'border-dotted',
      },
      thickness: {
        thin: 'border-t',
        medium: 'border-t-2',
        thick: 'border-t-4',
      },
      color: {
        default: 'border-[var(--border-primary)]',
        secondary: 'border-[var(--border-secondary)]',
        primary: 'border-[var(--border-primary-action)]',
        success: 'border-[var(--border-success)]',
        warning: 'border-[var(--border-warning)]',
        error: 'border-[var(--border-error)]',
        info: 'border-[var(--border-info)]',
        gradient: 'border-transparent bg-gradient-to-r from-[var(--border-primary-action)] to-[var(--border-secondary-action)]',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'solid',
      thickness: 'thin',
      color: 'default',
    },
  }
)

// 间距配置
const spacingClasses = {
  horizontal: {
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-8',
    xl: 'my-12',
  },
  vertical: {
    sm: 'mx-2',
    md: 'mx-4',
    lg: 'mx-8',
    xl: 'mx-12',
  },
}

export interface DividerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'orientation'>,
    VariantProps<typeof dividerVariants> {
  /** 子元素（文本） */
  children?: React.ReactNode
  /** 对齐方式（仅在有子元素时有效） */
  align?: 'left' | 'center' | 'right'
  /** 间距大小 */
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  /** 是否显示动画 */
  animated?: boolean
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(({
  children,
  orientation = 'horizontal',
  variant,
  thickness,
  color,
  align = 'center',
  spacing = 'md',
  animated = true,
  className,
  ...props
}, ref) => {
  // 垂直分隔线
  if (orientation === 'vertical') {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex h-full',
          spacingClasses.vertical[spacing],
          className
        )}
        {...props}
      >
        <motion.div
          className={cn(
            'w-full',
            dividerVariants({ orientation, variant, thickness, color })
          )}
          initial={animated ? { scaleY: 0 } : undefined}
          animate={animated ? { scaleY: 1 } : undefined}
          transition={{ duration: 0.3 }}
        />
      </div>
    )
  }

  // 无文本的水平分隔线
  if (!children) {
    return (
      <motion.hr
        ref={ref}
        className={cn(
          dividerVariants({ orientation, variant, thickness, color }),
          spacingClasses.horizontal[spacing],
          'border-0 m-0',
          className
        )}
        initial={animated ? { scaleX: 0 } : undefined}
        animate={animated ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.3 }}
        {...props}
      />
    )
  }

  // 带文本的水平分隔线
  const alignClasses = {
    left: 'justify-start text-left',
    center: 'justify-center text-center',
    right: 'justify-end text-right',
  }

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center',
        alignClasses[align],
        spacingClasses.horizontal[spacing],
        className
      )}
      {...props}
    >
      {align !== 'left' && (
        <motion.div
          className={cn(
            'flex-1 border-t',
            dividerVariants({ orientation, variant, thickness, color })
          )}
          initial={animated ? { scaleX: 0 } : undefined}
          animate={animated ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
      )}
      <span
        className={cn(
          'px-4 text-sm whitespace-nowrap',
          'text-[var(--text-secondary)]',
          'font-medium'
        )}
      >
        {children}
      </span>
      {align !== 'right' && (
        <motion.div
          className={cn(
            'flex-1 border-t',
            dividerVariants({ orientation, variant, thickness, color })
          )}
          initial={animated ? { scaleX: 0 } : undefined}
          animate={animated ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
      )}
    </div>
  )
})

Divider.displayName = 'Divider'

// 特殊的分隔线组件：垂直文本分隔线
export interface VerticalTextDividerProps {
  /** 文本内容 */
  children: React.ReactNode
  /** 高度 */
  height?: 'auto' | 'sm' | 'md' | 'lg'
  /** 位置 */
  position?: 'left' | 'center' | 'right'
  /** 类名 */
  className?: string
}

export const VerticalTextDivider: React.FC<VerticalTextDividerProps> = ({
  children,
  height = 'auto',
  position = 'center',
  className,
}) => {
  const heightClasses = {
    auto: 'h-auto',
    sm: 'h-16',
    md: 'h-24',
    lg: 'h-32',
  }

  const positionClasses = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
  }

  return (
    <div className={cn('flex items-center', heightClasses[height], positionClasses[position], className)}>
      <div className="relative flex items-center justify-center px-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border-primary)]" />
        </div>
        <span className="relative bg-[var(--bg-primary)] px-2 text-xs font-medium text-[var(--text-secondary)]">
          {children}
        </span>
      </div>
    </div>
  )
}

VerticalTextDivider.displayName = 'VerticalTextDivider'