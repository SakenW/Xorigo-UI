'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { X } from 'lucide-react'
import { cn } from '../utils'

// Badge变体配置
const badgeVariants = cva(
  // 基础样式
  'inline-flex items-center gap-1 font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-secondary)]',
        primary: 'bg-[var(--bg-primary-action)] text-[var(--text-inverse)]',
        success: 'bg-[var(--bg-success)] text-[var(--text-success)]',
        warning: 'bg-[var(--bg-warning)] text-[var(--text-warning)]',
        danger: 'bg-[var(--bg-error)] text-[var(--text-error)]',
        info: 'bg-[var(--bg-info)] text-[var(--text-info)]',
        'outline-solid': 'bg-transparent border-2 border-[var(--border-primary)] text-[var(--text-primary)]',
        neon: 'bg-[var(--bg-contrast-high)] text-[var(--text-info)] border border-[var(--border-info)] shadow-[0_0_10px_var(--border-info)]',
        gradient: 'bg-gradient-to-r from-[var(--bg-primary-action)] to-[var(--bg-secondary-action)] text-[var(--text-inverse)] border-0',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
      },
      shape: {
        rounded: 'rounded-md',
        pill: 'rounded-full',
        square: 'rounded-none',
      },
      dot: {
        true: 'gap-1.5',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shape: 'rounded',
      dot: false,
    },
  }
)

// Dot指示器变体
const dotVariants = cva('w-2 h-2 rounded-full', {
  variants: {
    variant: {
      default: 'bg-[var(--bg-disabled)]',
      primary: 'bg-[var(--bg-primary-action)]',
      success: 'bg-[var(--bg-success)]',
      warning: 'bg-[var(--bg-warning)]',
      danger: 'bg-[var(--bg-error)]',
      info: 'bg-[var(--bg-info)]',
      'outline-solid': 'bg-[var(--bg-primary-action)]',
      neon: 'bg-[var(--border-info)] animate-pulse',
      gradient: 'bg-white/80',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'size'>,
    VariantProps<typeof badgeVariants> {
  /** 子元素 */
  children?: React.ReactNode
  /** 可移除 */
  removable?: boolean
  /** 移除回调 */
  onRemove?: () => void
  /** 图标 */
  icon?: React.ReactNode
  /** 是否显示动画 */
  animated?: boolean
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({
  children,
  variant,
  size,
  shape,
  dot,
  removable = false,
  onRemove,
  icon,
  animated = true,
  className,
  ...props
}, ref) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove?.()
  }

  const BadgeContent = (
    <span
      ref={ref}
      className={cn(
        badgeVariants({ variant, size, shape, dot }),
        className
      )}
      {...props}
    >
      {dot && (
        <span className={dotVariants({ variant })} />
      )}
      {icon && <span className="inline-flex items-center">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          className={cn(
            'inline-flex items-center justify-center rounded-full',
            'hover:bg-[var(--bg-disabled)]/20 dark:hover:bg-[var(--bg-disabled)]/10',
            'transition-colors duration-150',
            'ml-1',
            size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
          )}
          aria-label="移除标签"
        >
          <X
            className={size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'}
          />
        </button>
      )}
    </span>
  )

  if (animated) {
    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {BadgeContent}
      </motion.span>
    )
  }

  return BadgeContent
})

Badge.displayName = 'Badge'

// Badge Group Component
export interface BadgeGroupProps {
  /** 标签元素 */
  children: React.ReactNode
  /** 最大显示数量 */
  max?: number
  /** 更多标签显示方式 */
  overflowType?: 'ellipsis' | 'dropdown' | 'hidden'
  /** 间距 */
  spacing?: 'tight' | 'normal' | 'loose'
  /** 类名 */
  className?: string
}

export const BadgeGroup: React.FC<BadgeGroupProps> = ({
  children,
  max = 3,
  overflowType = 'ellipsis',
  spacing = 'normal',
  className,
}) => {
  const childrenArray = React.Children.toArray(children)
  const displayedBadges = childrenArray.slice(0, max)
  const remainingCount = childrenArray.length - max

  const spacingClasses = {
    tight: 'gap-1',
    normal: 'gap-2',
    loose: 'gap-3',
  }

  if (overflowType === 'hidden' && childrenArray.length > max) {
    return (
      <div className={cn('flex items-center flex-wrap', spacingClasses[spacing], className)}>
        {displayedBadges}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center flex-wrap', spacingClasses[spacing], className)}>
      {displayedBadges}
      {remainingCount > 0 && overflowType === 'ellipsis' && (
        <Badge variant="outline-solid" size="sm">
          +{remainingCount}
        </Badge>
      )}
      {remainingCount > 0 && overflowType === 'dropdown' && (
        <Badge variant="default" size="sm">
          查看全部 ({childrenArray.length})
        </Badge>
      )}
    </div>
  )
}

BadgeGroup.displayName = 'BadgeGroup'