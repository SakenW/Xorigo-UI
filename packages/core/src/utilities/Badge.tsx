import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gray-100 text-gray-800",
        primary: "border-transparent bg-blue-100 text-blue-800",
        secondary: "border-transparent bg-gray-100 text-gray-800",
        success: "border-transparent bg-green-100 text-green-800",
        warning: "border-transparent bg-yellow-100 text-yellow-800",
        error: "border-transparent bg-red-100 text-red-800",
        info: "border-transparent bg-cyan-100 text-cyan-800",
        outline: "border-gray-300 text-gray-800",
        destructive: "border-transparent bg-red-500 text-white",
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