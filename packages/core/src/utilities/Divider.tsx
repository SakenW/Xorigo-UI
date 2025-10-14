import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const dividerVariants = cva(
  "shrink-0",
  {
    variants: {
      orientation: {
        horizontal: "w-full border-t",
        vertical: "h-full border-l",
      },
      variant: {
        default: "border-gray-200",
        primary: "border-blue-200",
        secondary: "border-gray-300",
        success: "border-green-200",
        warning: "border-yellow-200",
        error: "border-red-200",
        info: "border-cyan-200",
        subtle: "border-gray-100",
        strong: "border-gray-400 border-t-2",
      },
      size: {
        xs: "border-t",
        sm: "border-t",
        md: "border-t",
        lg: "border-t-2",
        xl: "border-t-4",
      },
      dashed: {
        true: "border-dashed",
        false: "",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      variant: "default",
      size: "md",
      dashed: false,
    },
  }
)

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerVariants> {
  label?: string
  labelPosition?: 'start' | 'center' | 'end'
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({
    className,
    orientation,
    variant,
    size,
    dashed,
    label,
    labelPosition = 'center',
    ...props
  }, ref) => {
    if (label) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-4 text-sm text-gray-500",
            orientation === 'vertical' ? "flex-col" : "",
            className
          )}
          {...props}
        >
          <div
            className={cn(
              dividerVariants({
                orientation,
                variant,
                size,
                dashed,
                className: labelPosition === 'end' ? 'flex-1' :
                             labelPosition === 'start' ? 'flex-1' : 'flex-1'
              })
            )}
          />
          <span className="shrink-0 px-2 text-xs font-medium bg-white">
            {label}
          </span>
          <div
            className={cn(
              dividerVariants({
                orientation,
                variant,
                size,
                dashed,
                className: labelPosition === 'start' ? 'flex-1' :
                             labelPosition === 'end' ? 'flex-1' : 'flex-1'
              })
            )}
          />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(dividerVariants({ orientation, variant, size, dashed, className }))}
        role="separator"
        aria-orientation={orientation}
        {...props}
      />
    )
  }
)

Divider.displayName = "Divider"

// Spacing divider (invisible divider for space)
export interface SpacingDividerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  orientation?: 'horizontal' | 'vertical'
}

const SpacingDivider = React.forwardRef<HTMLDivElement, SpacingDividerProps>(
  ({ className, size = 'md', orientation = 'horizontal', ...props }, ref) => {
    const sizeClasses = {
      horizontal: {
        xs: 'h-2',
        sm: 'h-4',
        md: 'h-6',
        lg: 'h-8',
        xl: 'h-12',
        '2xl': 'h-16',
      },
      vertical: {
        xs: 'w-2',
        sm: 'w-4',
        md: 'w-6',
        lg: 'w-8',
        xl: 'w-12',
        '2xl': 'w-16',
      },
    }

    return (
      <div
        ref={ref}
        className={cn(sizeClasses[orientation][size], className)}
        {...props}
      />
    )
  }
)

SpacingDivider.displayName = "SpacingDivider"

// Animated divider
export interface AnimatedDividerProps
  extends Omit<DividerProps, 'dashed'> {
  animation?: 'pulse' | 'shimmer' | 'gradient'
}

const AnimatedDivider = React.forwardRef<HTMLDivElement, AnimatedDividerProps>(
  ({ className, variant = 'default', size = 'md', animation = 'pulse', orientation = 'horizontal', ...props }, ref) => {
    const animationClasses = {
      pulse: 'animate-pulse',
      shimmer: 'relative overflow-hidden',
      gradient: 'relative bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-pulse',
    }

    if (animation === 'shimmer') {
      return (
        <div
          ref={ref}
          className={cn(
            "relative overflow-hidden",
            orientation === 'horizontal' ? "h-px w-full" : "h-full w-px",
            className
          )}
          {...props}
        >
          <div className="absolute inset-0 bg-gray-300 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400 to-transparent animate-shimmer" />
        </div>
      )
    }

    if (animation === 'gradient') {
      return (
        <div
          ref={ref}
          className={cn(
            "bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-pulse",
            orientation === 'horizontal' ? "h-px w-full" : "h-full w-px",
            className
          )}
          {...props}
        />
      )
    }

    return (
      <Divider
        ref={ref}
        orientation={orientation}
        variant={variant}
        size={size}
        className={cn(animationClasses[animation], className)}
        {...props}
      />
    )
  }
)

AnimatedDivider.displayName = "AnimatedDivider"

// Timeline divider
export interface TimelineDividerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  completed?: boolean
  active?: boolean
}

const TimelineDivider = React.forwardRef<HTMLDivElement, TimelineDividerProps>(
  ({ className, completed = false, active = false, ...props }, ref) => {
    const variant = completed ? 'success' : active ? 'primary' : 'default'
    const size = active ? 'lg' : 'md'

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        <Divider
          orientation="vertical"
          variant={variant}
          size={size}
          className="h-8"
        />
        {active && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full ring-2 ring-white" />
        )}
        {completed && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
        )}
      </div>
    )
  }
)

TimelineDivider.displayName = "TimelineDivider"

export {
  Divider,
  SpacingDivider,
  AnimatedDivider,
  TimelineDivider,
  dividerVariants,
}