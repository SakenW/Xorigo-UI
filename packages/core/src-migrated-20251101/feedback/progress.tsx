'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../utils'
import { cva, type VariantProps } from 'class-variance-authority'

// 线性进度条变体
const progressVariants = cva(
  'h-full rounded-full transition-all duration-500 ease-out',
  {
    variants: {
      variant: {
        default: 'bg-primary-500',
        success: 'bg-emerald-500',
        warning: 'bg-amber-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
      },
      animated: {
        true: '',
        false: '',
      },
      striped: {
        true: 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:40px_100%]',
        false: '',
      },
    },
    compoundVariants: [
      {
        striped: true,
        animated: true,
        className: 'animate-[shimmer_2s_linear_infinite]',
      },
    ],
    defaultVariants: {
      variant: 'default',
      animated: false,
      striped: false,
    },
  }
)

const progressTrackVariants = cva(
  'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
  {
    variants: {
      size: {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof progressTrackVariants> {
  value: number // 0-100
  max?: number
  showLabel?: boolean
  label?: string
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      size,
      variant,
      showLabel = false,
      label,
      striped,
      animated,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(showLabel || label) && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label || 'Progress'}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(percentage)}%
            </span>
          </div>
        )}

        <div className={progressTrackVariants({ size })}>
          <motion.div
            className={progressVariants({ variant, striped, animated })}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    )
  }
)

Progress.displayName = 'Progress'

// 环形进度条变体
const circularProgressVariants = cva(
  'text-current',
  {
    variants: {
      variant: {
        default: 'text-primary-500',
        success: 'text-emerald-500',
        warning: 'text-amber-500',
        error: 'text-red-500',
        info: 'text-blue-500',
      },
      size: {
        sm: 'text-sm',
        md: 'text-2xl',
        lg: 'text-3xl',
        xl: 'text-4xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface CircularProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof circularProgressVariants> {
  value: number // 0-100
  strokeWidth?: number
  circleSize?: number
  showLabel?: boolean
}

export const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value,
      variant,
      size,
      strokeWidth = 8,
      circleSize = 120,
      showLabel = true,
      className,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max(value, 0), 100)

    const sizeConfig = {
      sm: { circleSize: 60, strokeWidth: 4, labelSize: 'text-xs' },
      md: { circleSize: 120, strokeWidth: 8, labelSize: 'text-lg' },
      lg: { circleSize: 160, strokeWidth: 12, labelSize: 'text-2xl' },
      xl: { circleSize: 200, strokeWidth: 16, labelSize: 'text-3xl' },
    }

    const config = size ? sizeConfig[size] : sizeConfig.md
    const finalCircleSize = circleSize || config.circleSize
    const finalStrokeWidth = strokeWidth || config.strokeWidth
    const finalRadius = (finalCircleSize - finalStrokeWidth) / 2
    const finalCircumference = finalRadius * 2 * Math.PI

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex items-center justify-center', className)}
        {...props}
      >
        <svg
          width={finalCircleSize}
          height={finalCircleSize}
          className="transform -rotate-90"
        >
          {/* 背景圆环 */}
          <circle
            cx={finalCircleSize / 2}
            cy={finalCircleSize / 2}
            r={finalRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth={finalStrokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
          {/* 进度圆环 */}
          <motion.circle
            cx={finalCircleSize / 2}
            cy={finalCircleSize / 2}
            r={finalRadius}
            fill="none"
            strokeWidth={finalStrokeWidth}
            strokeDasharray={finalCircumference}
            strokeDashoffset={finalCircumference - (percentage / 100) * finalCircumference}
            strokeLinecap="round"
            className={circularProgressVariants({ variant })}
            initial={{ strokeDashoffset: finalCircumference }}
            animate={{ strokeDashoffset: finalCircumference - (percentage / 100) * finalCircumference }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                'font-bold text-gray-700 dark:text-gray-300',
                size ? config.labelSize : 'text-lg'
              )}
            >
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    )
  }
)

CircularProgress.displayName = 'CircularProgress'