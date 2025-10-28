'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '../../foundations/utils/cn'

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string
  description?: string
  trend?: {
    value: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'
  icon?: React.ReactNode
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, title, value, description, trend, variant = 'primary', icon, children, ...props }, ref) => {
    const variants = {
      primary: {
        background: "bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)]",
        border: "border-[var(--color-primary-200)]",
        trendColor: "text-[var(--color-primary-600)]"
      },
      secondary: {
        background: "bg-gradient-to-br from-[var(--color-secondary-50)] to-[var(--color-secondary-100)]",
        border: "border-[var(--color-secondary-200)]",
        trendColor: "text-[var(--color-secondary-600)]"
      },
      accent: {
        background: "bg-gradient-to-br from-[var(--color-accent-50)] to-[var(--color-accent-100)]",
        border: "border-[var(--color-accent-200)]",
        trendColor: "text-[var(--color-accent-600)]"
      },
      success: {
        background: "bg-gradient-to-br from-[var(--color-success-50)] to-[var(--color-success-100)]",
        border: "border-[var(--color-success-200)]",
        trendColor: "text-[var(--color-success-600)]"
      },
      warning: {
        background: "bg-gradient-to-br from-[var(--color-warning-50)] to-[var(--color-warning-100)]",
        border: "border-[var(--color-warning-200)]",
        trendColor: "text-[var(--color-warning-600)]"
      },
      error: {
        background: "bg-gradient-to-br from-[var(--color-error-50)] to-[var(--color-error-100)]",
        border: "border-[var(--color-error-200)]",
        trendColor: "text-[var(--color-error-600)]"
      }
    }

    const currentVariant = variants[variant]

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -4, boxShadow: "var(--shadow-lg)" }}
        className={cn(
          "relative p-6 rounded-xl border backdrop-blur-sm transition-all duration-200",
          currentVariant.background,
          currentVariant.border,
          className
        )}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center">
            {icon}
          </div>
        )}

        {/* Title */}
        <h3 className="text-[var(--color-text-secondary)] text-sm font-medium mb-2">
          {title}
        </h3>

        {/* Value */}
        <div className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
          {value}
        </div>

        {/* Description */}
        {description && (
          <p className="text-[var(--color-text-tertiary)] text-sm mb-3">
            {description}
          </p>
        )}

        {/* Trend */}
        {trend && (
          <div className={cn(
            "flex items-center text-sm font-medium",
            trend.type === 'increase' && "text-[var(--color-success-600)]",
            trend.type === 'decrease' && "text-[var(--color-error-600)]",
            trend.type === 'neutral' && "text-[var(--color-text-secondary)]"
          )}>
            <span className="mr-1">
              {trend.type === 'increase' && '↑'}
              {trend.type === 'decrease' && '↓'}
              {trend.type === 'neutral' && '→'}
            </span>
            {trend.value}
          </div>
        )}

        {/* Additional Content */}
        {children}
      </motion.div>
    )
  }
)

StatCard.displayName = 'StatCard'

export { StatCard }