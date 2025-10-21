import React, { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'

const sliderVariants = cva(
  "relative flex w-full touch-none select-none items-center transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "focus:ring-blue-500/20",
        primary: "focus:ring-blue-500/20",
        success: "focus:ring-green-500/20",
        warning: "focus:ring-yellow-500/20",
        danger: "focus:ring-red-500/20",
        neon: "focus:ring-cyan-400/20",
      },
      size: {
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
      status: {
        default: '',
        error: 'focus:ring-red-500/20',
        success: 'focus:ring-green-500/20',
        warning: 'focus:ring-yellow-500/20',
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      disabled: false,
      status: "default",
    },
  }
)

const trackVariants = cva(
  "relative w-full grow overflow-hidden rounded-full transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-gray-200 dark:bg-gray-700",
        primary: "bg-gray-200 dark:bg-gray-700",
        success: "bg-gray-200 dark:bg-gray-700",
        warning: "bg-gray-200 dark:bg-gray-700",
        danger: "bg-gray-200 dark:bg-gray-700",
        neon: "bg-black/50 border border-cyan-400/30",
      },
      size: {
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

const rangeVariants = cva(
  "absolute h-full rounded-full transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-blue-600 dark:bg-blue-500",
        primary: "bg-blue-600 dark:bg-blue-500",
        success: "bg-green-600 dark:bg-green-500",
        warning: "bg-yellow-600 dark:bg-yellow-500",
        danger: "bg-red-600 dark:bg-red-500",
        neon: "bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]",
      },
      size: {
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

const thumbVariants = cva(
  "block rounded-full border-2 border-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-110 cursor-grab active:cursor-grabbing",
  {
    variants: {
      variant: {
        default: "bg-blue-600 focus:ring-blue-500/20",
        primary: "bg-blue-600 focus:ring-blue-500/20",
        success: "bg-green-600 focus:ring-green-500/20",
        warning: "bg-yellow-600 focus:ring-yellow-500/20",
        danger: "bg-red-600 focus:ring-red-500/20",
        neon: "bg-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)] focus:ring-cyan-400/20",
      },
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface SliderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sliderVariants> {
  min?: number
  max?: number
  step?: number
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
  disabled?: boolean
  showValue?: boolean
  marks?: { value: number; label?: string }[]
  label?: string
  helperText?: string
  error?: string
}

const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({
    className,
    variant = 'primary',
    size,
    status,
    min = 0,
    max = 100,
    step = 1,
    value: controlledValue,
    defaultValue = [50],
    onValueChange,
    onValueCommit,
    disabled = false,
    showValue = false,
    marks = [],
    label,
    helperText,
    error,
    ...props
  }, ref) => {
    const { themeConfig } = useTheme()
    const [internalValue, setInternalValue] = useState(defaultValue)
    const [isDragging, setIsDragging] = useState(false)

    const value = controlledValue !== undefined ? controlledValue : internalValue
    const currentValue = value[0] ?? 0
    const effectiveStatus = status || (error ? 'error' : 'default')

    const percentage = ((currentValue - min) / (max - min)) * 100

    // 获取主题样式
    const getSliderThemeStyle = (): React.CSSProperties => {
      if (variant === 'neon') {
        return {
          boxShadow: `0 0 5px ${themeConfig.glow}`,
        }
      }
      return {}
    }

    const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return

      const rect = event.currentTarget.getBoundingClientRect()
      const clickPosition = event.clientX - rect.left
      const clickPercentage = (clickPosition / rect.width) * 100
      const newValue = min + (clickPercentage / 100) * (max - min)
      const steppedValue = Math.round(newValue / step) * step
      const clampedValue = Math.max(min, Math.min(max, steppedValue))

      const newValueArray = [clampedValue]
      setInternalValue(newValueArray)
      onValueChange?.(newValueArray)
    }

    const handleThumbMouseDown = (event: React.MouseEvent) => {
      if (disabled) return
      event.preventDefault()
      setIsDragging(true)

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const slider = event.currentTarget.closest('[data-slider]')
        if (!slider) return

        const rect = slider.getBoundingClientRect()
        const mousePosition = moveEvent.clientX - rect.left
        const mousePercentage = Math.max(0, Math.min(100, (mousePosition / rect.width) * 100))
        const newValue = min + (mousePercentage / 100) * (max - min)
        const steppedValue = Math.round(newValue / step) * step
        const clampedValue = Math.max(min, Math.min(max, steppedValue))

        const newValueArray = [clampedValue]
        setInternalValue(newValueArray)
        onValueChange?.(newValueArray)
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        onValueCommit?.(value)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    const formatValue = (val: number) => {
      if (Number.isInteger(val)) {
        return val.toString()
      }
      return val.toFixed(1)
    }

    return (
      <div className={cn('flex flex-col', className)}>
        {/* 标签 */}
        {label && (
          <motion.label
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        {/* 滑块容器 */}
        <div
          ref={ref}
          className={cn(
            sliderVariants({
              variant,
              size,
              disabled,
              status: effectiveStatus as any,
              className: 'relative'
            })
          )}
          style={getSliderThemeStyle()}
          data-slider
          {...props}
        >
          {/* 数值提示 */}
          <AnimatePresence>
            {showValue && (
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-2 py-1 rounded text-xs font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                style={{
                  left: `${percentage}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                {formatValue(currentValue)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 轨道 */}
          <div
            className={trackVariants({ variant, size })}
            onClick={handleTrackClick}
          >
            {/* 进度条 */}
            <motion.div
              className={rangeVariants({ variant, size })}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          {/* 拖拽手柄 */}
          <motion.div
            className="absolute top-1/2 cursor-grab active:cursor-grabbing"
            style={{
              left: `${percentage}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onMouseDown={handleThumbMouseDown}
            whileHover={!disabled ? { scale: 1.1 } : {}}
            whileTap={!disabled ? { scale: 0.9 } : {}}
            drag={!disabled ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDrag={(_, info) => {
              if (!disabled && ref && 'current' in ref && ref.current) {
                const slider = ref.current
                const rect = slider.getBoundingClientRect()
                const percentage = Math.max(0, Math.min(100, ((info.point.x - rect.left) / rect.width) * 100))
                const newValue = min + (percentage / 100) * (max - min)
                const steppedValue = Math.round(newValue / step) * step
                const clampedValue = Math.max(min, Math.min(max, steppedValue))

                const newValueArray = [clampedValue]
                setInternalValue(newValueArray)
                onValueChange?.(newValueArray)
              }
            }}
            onDragEnd={() => {
              setIsDragging(false)
              onValueCommit?.(value)
            }}
          >
            <div className={cn(thumbVariants({ variant, size }), disabled && "cursor-not-allowed")} />
          </motion.div>

          {/* 刻度标记 */}
          {marks.map((mark, index) => {
            const markPercentage = ((mark.value - min) / (max - min)) * 100
            const isActive = mark.value <= currentValue

            return (
              <div
                key={index}
                className="absolute top-1/2 transform -translate-y-1/2"
                style={{ left: `${markPercentage}%` }}
              >
                <motion.div
                  className={cn(
                    "w-2 h-2 rounded-full border-2 border-white transition-all duration-200",
                    isActive
                      ? variant === 'neon'
                        ? "bg-cyan-400 border-cyan-400"
                        : "bg-blue-600 border-blue-600"
                      : "bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600"
                  )}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    opacity: isActive ? 1 : 0.7
                  }}
                  transition={{ duration: 0.2 }}
                />
                {mark.label && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {mark.label}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 帮助文本 */}
        {helperText && !error && (
          <motion.p
            className="text-sm mt-2 text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {helperText}
          </motion.p>
        )}

        {/* 错误信息 */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="text-sm mt-2 text-red-600 dark:text-red-400"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider, sliderVariants, trackVariants, rangeVariants, thumbVariants }