import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const statVariants = cva(
  "p-6 rounded-lg border",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200",
        primary: "bg-blue-50 border-blue-200",
        success: "bg-green-50 border-green-200",
        warning: "bg-yellow-50 border-yellow-200",
        error: "bg-red-50 border-red-200",
        gradient: "bg-gradient-to-br from-blue-50 to-purple-50 border-purple-200",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const valueVariants = cva(
  "font-bold",
  {
    variants: {
      size: {
        sm: "text-2xl",
        md: "text-3xl",
        lg: "text-4xl",
      },
      color: {
        default: "text-gray-900",
        primary: "text-blue-600",
        success: "text-green-600",
        warning: "text-yellow-600",
        error: "text-red-600",
        gradient: "text-purple-600",
      },
    },
    defaultVariants: {
      size: "md",
      color: "default",
    },
  }
)

export interface StatProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statVariants> {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down'
    label?: string
  }
  loading?: boolean
}

const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  ({
    className,
    variant,
    size,
    title,
    value,
    description,
    icon,
    trend,
    loading = false,
    ...props
  }, ref) => {
    if (loading) {
      return (
        <div
          className={cn(statVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      )
    }

    const getTrendColor = () => {
      if (trend.direction === 'up') return 'text-green-600'
      return 'text-red-600'
    }

    const getTrendIcon = () => {
      return trend.direction === 'up' ? '↑' : '↓'
    }

    return (
      <div
        className={cn(statVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className={cn(valueVariants({ size, color: variant }))}>
              {value}
            </p>

            {trend && (
              <div className={cn("flex items-center mt-2 text-sm", getTrendColor())}>
                <span className="mr-1">{getTrendIcon()}</span>
                <span className="font-medium">{Math.abs(trend.value)}%</span>
                {trend.label && <span className="ml-1 text-gray-600">{trend.label}</span>}
              </div>
            )}

            {description && (
              <p className="text-sm text-gray-500 mt-2">{description}</p>
            )}
          </div>

          {icon && (
            <div className="ml-4 flex-shrink-0">
              <div className={cn(
                "p-3 rounded-full",
                variant === 'primary' && 'bg-blue-100 text-blue-600',
                variant === 'success' && 'bg-green-100 text-green-600',
                variant === 'warning' && 'bg-yellow-100 text-yellow-600',
                variant === 'error' && 'bg-red-100 text-red-600',
                variant === 'gradient' && 'bg-purple-100 text-purple-600',
                variant === 'default' && 'bg-gray-100 text-gray-600'
              )}>
                {icon}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)

Stat.displayName = "Stat"

export { Stat, statVariants, valueVariants }