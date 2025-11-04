import React from 'react'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils/cn'

const gaugeVariants = cva(
  "relative flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "w-32 h-32",
        md: "w-48 h-48",
        lg: "w-64 h-64",
        xl: "w-80 h-80",
      },
      variant: {
        default: "",
        primary: "",
        success: "",
        warning: "",
        error: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
)

const getColorByVariant = (variant: string, value: number, max: number) => {
  const percentage = (value / max) * 100

  switch (variant) {
    case 'primary':
      return '#3b82f6'
    case 'success':
      return percentage >= 80 ? '#10b981' : percentage >= 50 ? '#84cc16' : '#eab308'
    case 'warning':
      return '#f59e0b'
    case 'error':
      return percentage >= 80 ? '#ef4444' : percentage >= 50 ? '#f97316' : '#eab308'
    default:
      if (percentage >= 80) return '#10b981'
      if (percentage >= 50) return '#f59e0b'
      return '#ef4444'
  }
}

export interface GaugeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gaugeVariants> {
  value: number
  max: number
  min?: number
  label?: string
  unit?: string
  showValue?: boolean
  animated?: boolean
  thresholds?: {
    good?: number
    warning?: number
    danger?: number
  }
}

const Gauge = React.forwardRef<HTMLDivElement, GaugeProps>(
  ({
    className,
    size,
    variant,
    value,
    max,
    min = 0,
    label,
    unit,
    showValue = true,
    animated = true,
    thresholds,
    ...props
  }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100
    const clampedPercentage = Math.min(100, Math.max(0, percentage))
    const color = getColorByVariant(variant, value, max)

    const getThresholdColor = () => {
      if (!thresholds) return color

      if (thresholds.danger && percentage >= thresholds.danger) {
        return '#ef4444'
      }
      if (thresholds.warning && percentage >= thresholds.warning) {
        return '#f59e0b'
      }
      if (thresholds.good && percentage >= thresholds.good) {
        return '#10b981'
      }
      return '#ef4444'
    }

    const strokeWidth = size === 'sm' ? 8 : size === 'lg' ? 12 : size === 'xl' ? 16 : 10
    const radius = size === 'sm' ? 56 : size === 'lg' ? 88 : size === 'xl' ? 112 : 72
    const circumference = 2 * Math.PI * radius * 0.75 // 3/4 circle
    const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference * 0.75

    return (
      <div
        className={cn(gaugeVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      >
        <svg
          className={cn(
            "transform -rotate-90",
            size === 'sm' && 'w-32 h-32',
            size === 'md' && 'w-48 h-48',
            size === 'lg' && 'w-64 h-64',
            size === 'xl' && 'w-80 h-80'
          )}
          viewBox="0 0 200 200"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * 0.25}
            transform="rotate(45 100 100)"
          />

          {/* Value circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={getThresholdColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset + circumference * 0.25}
            transform="rotate(45 100 100)"
            className={cn(
              animated && "transition-all duration-500 ease-out"
            )}
          />

          {/* Scale markers */}
          {Array.from({ length: 10 }, (_, i) => {
            const angle = 45 + (i * 270) / 9
            const isLarge = i % 2 === 0
            const markerLength = isLarge ? 8 : 4
            const startRadius = radius - strokeWidth / 2 - markerLength
            const endRadius = radius - strokeWidth / 2

            const x1 = 100 + startRadius * Math.cos((angle * Math.PI) / 180)
            const y1 = 100 + startRadius * Math.sin((angle * Math.PI) / 180)
            const x2 = 100 + endRadius * Math.cos((angle * Math.PI) / 180)
            const y2 = 100 + endRadius * Math.sin((angle * Math.PI) / 180)

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#9ca3af"
                strokeWidth={isLarge ? 2 : 1}
              />
            )
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && (
            <>
              <span className={cn(
                "font-bold",
                size === 'sm' && 'text-2xl',
                size === 'md' && 'text-3xl',
                size === 'lg' && 'text-4xl',
                size === 'xl' && 'text-5xl'
              )}>
                {value}
                {unit && <span className="text-lg font-normal ml-1">{unit}</span>}
              </span>
              <span className="text-sm text-gray-500 mt-1">
                / {max}
              </span>
            </>
          )}

          {label && (
            <span className={cn(
              "text-gray-600 font-medium mt-2",
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base',
              size === 'xl' && 'text-lg'
            )}>
              {label}
            </span>
          )}
        </div>

        {/* Threshold indicators */}
        {thresholds && (
          <div className="absolute bottom-0 flex justify-center w-full gap-4">
            {thresholds.danger && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-600">危险</span>
              </div>
            )}
            {thresholds.warning && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-gray-600">警告</span>
              </div>
            )}
            {thresholds.good && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">良好</span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)

Gauge.displayName = "Gauge"

export { Gauge, gaugeVariants }