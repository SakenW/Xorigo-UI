import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { semanticColors } from '@xorigo-ui/tokens'

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring-primary-action)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--bg-tertiary)] text-[var(--text-secondary)]",
        primary: "border-transparent bg-[var(--bg-primary-action)]/10 text-[var(--text-primary-action)]",
        secondary: "border-transparent bg-[var(--bg-tertiary)] text-[var(--text-secondary)]",
        success: "border-transparent bg-[var(--bg-success)]/10 text-[var(--text-success)]",
        warning: "border-transparent bg-[var(--bg-warning)]/10 text-[var(--text-warning)]",
        error: "border-transparent bg-[var(--bg-error)]/10 text-[var(--text-error)]",
        info: "border-transparent bg-[var(--bg-info)]/10 text-[var(--text-info)]",
        outline: "border-[var(--border-secondary)] text-[var(--text-secondary)]",
        destructive: "border-transparent bg-[var(--bg-error)] text-[var(--text-inverse)]",
      },
      size: {
        xs: "px-1.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-sm",
        lg: "px-3 py-1 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  count?: number
  maxCount?: number
  showZero?: boolean
  children?: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({
    className,
    variant,
    size,
    dot = false,
    count,
    maxCount = 99,
    showZero = false,
    children,
    ...props
  }, ref) => {
    if (dot) {
      return (
        <div
          ref={ref}
          className={cn(
            "w-2 h-2 rounded-full",
            badgeVariants({ variant: variant === 'default' ? 'primary' : variant, size: 'xs', className })
          )}
          {...props}
        />
      )
    }

    const displayCount = count !== undefined
      ? count > maxCount
        ? `${maxCount}+`
        : count === 0 && !showZero
        ? null
        : count.toString()
      : null

    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {displayCount !== null ? (
          <span>{displayCount}</span>
        ) : (
          children
        )}
      </div>
    )
  }
)

Badge.displayName = "Badge"

// Badge variants for specific use cases
export const StatusBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'variant'> & {
    status: 'online' | 'offline' | 'away' | 'busy'
  }
>(({ status, className, ...props }, ref) => {
  const statusVariants = {
    online: 'success',
    offline: 'secondary',
    away: 'warning',
    busy: 'error',
  } as const

  return (
    <Badge
      ref={ref}
      variant={statusVariants[status]}
      dot
      className={cn("shrink-0", className)}
      {...props}
    />
  )
})

StatusBadge.displayName = "StatusBadge"

export const CountBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'children'> & {
    value: number
    showZero?: boolean
    max?: number
  }
>(({ value, showZero = false, max = 99, className, ...props }, ref) => {
  return (
    <Badge
      ref={ref}
      count={value}
      maxCount={max}
      showZero={showZero}
      variant="destructive"
      className={cn("absolute -top-1 -right-1 min-w-[20px] h-5", className)}
      {...props}
    />
  )
})

CountBadge.displayName = "CountBadge"

export const NewBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'variant' | 'children'>
>(({ className, ...props }, ref) => (
  <Badge
    ref={ref}
    variant="error"
    size="sm"
    className={cn("animate-pulse", className)}
    {...props}
  >
    NEW
  </Badge>
))

NewBadge.displayName = "NewBadge"

export const FeaturedBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'variant' | 'children'>
>(({ className, ...props }, ref) => (
  <Badge
    ref={ref}
    variant="warning"
    size="sm"
    className={cn("animate-pulse", className)}
    {...props}
  >
    热门
  </Badge>
))

FeaturedBadge.displayName = "FeaturedBadge"

export {
  Badge,
  badgeVariants,
}