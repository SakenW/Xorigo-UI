'use client'
"use client"

import * as React from "react"
import { forwardRef, useRef, useEffect, useState, useCallback } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { cn } from "../utils"

// Slider 基础值类型
type SliderValue = number | number[]

// Slider 标记点类型
interface SliderMark {
  value: number
  label?: string
}

// Slider 组件 Props 接口
export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'onChange' | 'onFocus' | 'onBlur'> {
  /** 滑块值 - 单值或范围值 */
  value?: SliderValue
  /** 默认值 - 非受控模式 */
  defaultValue?: SliderValue
  /** 值变化回调 */
  onValueChange?: (value: SliderValue) => void
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步长 */
  step?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 滑块方向 */
  orientation?: 'horizontal' | 'vertical'
  /** 是否显示标记点 */
  showMarks?: boolean
  /** 标记点数组 */
  marks?: SliderMark[]
  /** 是否显示数值标签 */
  showLabel?: boolean
  /** 是否显示输入框 */
  showInput?: boolean
  /** 数值格式化函数 */
  formatValue?: (value: number) => string
  /** 自定义轨道样式 */
  trackClassName?: string
  /** 自定义滑块样式 */
  thumbClassName?: string
  /** 自定义标记点样式 */
  markClassName?: string
  /** 动画变体 */
  variant?: 'default' | 'smooth' | 'bounce'
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 颜色主题 */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  /** 标签文本 */
  label?: string
  /** 帮助文本 */
  helperText?: string
  /** 错误信息 */
  error?: string
}

// 动画变体配置
const sliderVariants = {
  default: {
    thumb: {
      scale: 1,
      transition: { duration: 0.2 }
    },
    thumbHover: {
      scale: 1.2,
      transition: { duration: 0.2 }
    },
    track: {
      transition: { duration: 0.3 }
    }
  },
  smooth: {
    thumb: {
      scale: 1,
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    thumbHover: {
      scale: 1.15,
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    track: {
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  },
  bounce: {
    thumb: {
      scale: 1,
      transition: { duration: 0.3, type: "spring", stiffness: 400 }
    },
    thumbHover: {
      scale: 1.25,
      transition: { duration: 0.3, type: "spring", stiffness: 600 }
    },
    track: {
      transition: { duration: 0.4, type: "spring", stiffness: 300 }
    }
  }
}

const Slider = forwardRef<HTMLDivElement, SliderProps>(({
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  orientation = 'horizontal',
  showMarks = false,
  marks = [],
  showLabel = true,
  showInput = false,
  formatValue = (val) => val.toString(),
  trackClassName,
  thumbClassName,
  markClassName,
  variant = 'default',
  size = 'md',
  color = 'primary',
  label,
  helperText,
  error,
  className,
  ...props
}, ref) => {
  // 内部状态管理
  const [internalValue, setInternalValue] = useState<SliderValue>(defaultValue ?? min)
  const [isDragging, setIsDragging] = useState(false)
  const [dragIndex, setDragIndex] = useState(0) // 用于范围滑块
  const [isHovered, setIsHovered] = useState(false)

  // 当前值（受控或非受控）
  const currentValue = value ?? internalValue
  const isRange = Array.isArray(currentValue)

  // 引用管理
  const sliderRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // 动画控制
  const thumbControls = useAnimation()
  const trackControls = useAnimation()

  // 计算百分比值
  const valueToPercentage = useCallback((val: number) => {
    return ((val - min) / (max - min)) * 100
  }, [min, max])

  // 计算位置值
  const percentageToValue = useCallback((percentage: number) => {
    const rawValue = (percentage / 100) * (max - min) + min
    return Math.round(rawValue / step) * step
  }, [min, max, step])

  // 处理鼠标/触摸事件
  const handlePointerDown = useCallback((event: React.PointerEvent, index?: number) => {
    if (disabled) return

    event.preventDefault()
    setIsDragging(true)
    setDragIndex(index ?? (isRange ? 0 : 0))

    // 立即更新到点击位置
    handlePointerMove(event)
  }, [disabled, isRange])

  const handlePointerMove = useCallback((event: React.PointerEvent | PointerEvent) => {
    if (!isDragging || !trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    let percentage: number

    if (orientation === 'horizontal') {
      percentage = ((event.clientX - rect.left) / rect.width) * 100
    } else {
      percentage = ((event.clientY - rect.top) / rect.height) * 100
      percentage = 100 - percentage // 垂直方向反转
    }

    percentage = Math.max(0, Math.min(100, percentage))
    const newValue = percentageToValue(percentage)

    if (isRange) {
      const newRange = [...currentValue] as number[]
      newRange[dragIndex] = newValue
      // 确保范围有效性
      if (dragIndex === 0 && newValue > newRange[1]) {
        newRange[0] = newRange[1]
      } else if (dragIndex === 1 && newValue < newRange[0]) {
        newRange[1] = newRange[0]
      }
      onValueChange?.(newRange)
      setInternalValue(newRange)
    } else {
      onValueChange?.(newValue)
      setInternalValue(newValue)
    }
  }, [isDragging, orientation, percentageToValue, isRange, dragIndex, currentValue, onValueChange])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // 处理输入框变化
  const handleInputChange = useCallback((index: number, inputValue: string) => {
    const numValue = parseFloat(inputValue)
    if (isNaN(numValue)) return

    const clampedValue = Math.max(min, Math.min(max, numValue))

    if (isRange) {
      const newRange = [...currentValue] as number[]
      newRange[index] = clampedValue
      onValueChange?.(newRange)
      setInternalValue(newRange)
    } else {
      onValueChange?.(clampedValue)
      setInternalValue(clampedValue)
    }
  }, [min, max, isRange, currentValue, onValueChange])

  // 全局事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener('pointerup', handlePointerUp)
      return () => {
        document.removeEventListener('pointermove', handlePointerMove)
        document.removeEventListener('pointerup', handlePointerUp)
      }
    }
  }, [isDragging, handlePointerMove, handlePointerUp])

  // 动画触发
  useEffect(() => {
    if (isHovered && !disabled) {
      thumbControls.start("thumbHover")
    } else {
      thumbControls.start("thumb")
    }
  }, [isHovered, disabled, thumbControls])

  // 计算轨道填充样式
  const getTrackFillStyle = () => {
    if (isRange) {
      const [start, end] = currentValue as number[]
      const startPercent = valueToPercentage(start)
      const endPercent = valueToPercentage(end)

      if (orientation === 'horizontal') {
        return {
          left: `${startPercent}%`,
          width: `${endPercent - startPercent}%`
        }
      } else {
        return {
          bottom: `${startPercent}%`,
          height: `${endPercent - startPercent}%`
        }
      }
    } else {
      const percentage = valueToPercentage(currentValue as number)

      if (orientation === 'horizontal') {
        return { width: `${percentage}%` }
      } else {
        return { height: `${percentage}%` }
      }
    }
  }

  // 尺寸配置
  const sizeConfig = {
    sm: {
      track: orientation === 'horizontal' ? 'h-1' : 'w-1',
      thumb: orientation === 'horizontal' ? 'w-3 h-3' : 'h-3 w-3',
      label: 'text-xs'
    },
    md: {
      track: orientation === 'horizontal' ? 'h-2' : 'w-2',
      thumb: orientation === 'horizontal' ? 'w-4 h-4' : 'h-4 w-4',
      label: 'text-sm'
    },
    lg: {
      track: orientation === 'horizontal' ? 'h-3' : 'w-3',
      thumb: orientation === 'horizontal' ? 'w-5 h-5' : 'h-5 w-5',
      label: 'text-base'
    }
  }

  // 颜色配置
  const colorConfig = {
    primary: {
      track: 'bg-[var(--color-primary-200)]',
      trackFill: 'bg-[var(--color-primary-500)]',
      thumb: 'bg-[var(--color-primary-500)] border-[var(--color-primary-600)]',
      thumbHover: 'bg-[var(--color-primary-600)] border-[var(--color-primary-700)]',
      label: 'text-[var(--color-primary-700)]'
    },
    secondary: {
      track: 'bg-[var(--color-secondary-200)]',
      trackFill: 'bg-[var(--color-secondary-500)]',
      thumb: 'bg-[var(--color-secondary-500)] border-[var(--color-secondary-600)]',
      thumbHover: 'bg-[var(--color-secondary-600)] border-[var(--color-secondary-700)]',
      label: 'text-[var(--color-secondary-700)]'
    },
    success: {
      track: 'bg-[var(--color-success-200)]',
      trackFill: 'bg-[var(--color-success-500)]',
      thumb: 'bg-[var(--color-success-500)] border-[var(--color-success-600)]',
      thumbHover: 'bg-[var(--color-success-600)] border-[var(--color-success-700)]',
      label: 'text-[var(--color-success-700)]'
    },
    warning: {
      track: 'bg-[var(--color-warning-200)]',
      trackFill: 'bg-[var(--color-warning-500)]',
      thumb: 'bg-[var(--color-warning-500)] border-[var(--color-warning-600)]',
      thumbHover: 'bg-[var(--color-warning-600)] border-[var(--color-warning-700)]',
      label: 'text-[var(--color-warning-700)]'
    },
    error: {
      track: 'bg-[var(--color-error-200)]',
      trackFill: 'bg-[var(--color-error-500)]',
      thumb: 'bg-[var(--color-error-500)] border-[var(--color-error-600)]',
      thumbHover: 'bg-[var(--color-error-600)] border-[var(--color-error-700)]',
      label: 'text-[var(--color-error-700)]'
    }
  }

  const currentSize = sizeConfig[size]
  const currentColor = colorConfig[color]
  const variants = sliderVariants[variant]

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex",
        orientation === 'horizontal' ? 'flex-col space-y-2' : 'flex-row space-x-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {/* 标签 */}
      {label && (
        <motion.label
          className={cn("text-sm font-medium text-[var(--color-text-primary)]", currentSize.label)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}

      {/* 数值标签和输入框 */}
      {showLabel && (
        <div className={cn(
          "flex items-center justify-between",
          orientation === 'horizontal' ? 'flex-row' : 'flex-col'
        )}>
          <div className={cn(
            "flex items-center space-x-2",
            orientation === 'horizontal' ? '' : 'flex-col space-y-1 space-x-0'
          )}>
            {isRange ? (
              <>
                <span className={cn("font-medium", currentSize.label, currentColor.label)}>
                  {formatValue((currentValue as number[])[0])}
                </span>
                <span className={cn("text-[var(--color-text-secondary)]", currentSize.label)}>
                  -
                </span>
                <span className={cn("font-medium", currentSize.label, currentColor.label)}>
                  {formatValue((currentValue as number[])[1])}
                </span>
              </>
            ) : (
              <span className={cn("font-medium", currentSize.label, currentColor.label)}>
                {formatValue(currentValue as number)}
              </span>
            )}
          </div>

          {/* 输入框 */}
          {showInput && (
            <div className={cn(
              "flex items-center space-x-2",
              orientation === 'horizontal' ? '' : 'flex-col space-y-1 space-x-0'
            )}>
              {isRange ? (
                <>
                  <input
                    type="number"
                    value={(currentValue as number[])[0]}
                    onChange={(e) => handleInputChange(0, e.target.value)}
                    min={min}
                    max={max}
                    step={step}
                    disabled={disabled}
                    className={cn(
                      "w-16 px-1 py-0.5 text-sm border rounded",
                      "bg-[var(--color-surface)] border-[var(--color-border)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                    )}
                  />
                  <input
                    type="number"
                    value={(currentValue as number[])[1]}
                    onChange={(e) => handleInputChange(1, e.target.value)}
                    min={min}
                    max={max}
                    step={step}
                    disabled={disabled}
                    className={cn(
                      "w-16 px-1 py-0.5 text-sm border rounded",
                      "bg-[var(--color-surface)] border-[var(--color-border)]",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                    )}
                  />
                </>
              ) : (
                <input
                  type="number"
                  value={currentValue as number}
                  onChange={(e) => handleInputChange(0, e.target.value)}
                  min={min}
                  max={max}
                  step={step}
                  disabled={disabled}
                  className={cn(
                    "w-16 px-1 py-0.5 text-sm border rounded",
                    "bg-[var(--color-surface)] border-[var(--color-border)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                  )}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* 滑块主体 */}
      <div
        ref={sliderRef}
        className={cn(
          "relative",
          orientation === 'horizontal' ? 'w-full' : 'h-full min-h-[200px]',
          !disabled && 'cursor-pointer'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onPointerDown={(e) => handlePointerDown(e)}
      >
        {/* 轨道背景 */}
        <motion.div
          ref={trackRef}
          className={cn(
            "relative rounded-full",
            currentSize.track,
            currentColor.track,
            trackClassName
          )}
          initial="track"
          animate={trackControls}
          variants={variants}
        >
          {/* 轨道填充 */}
          <motion.div
            className={cn(
              "absolute rounded-full",
              currentSize.track,
              currentColor.trackFill,
              orientation === 'horizontal' ? 'left-0 top-0' : 'bottom-0 left-0'
            )}
            style={getTrackFillStyle()}
            initial="track"
            animate={trackControls}
            variants={variants}
          />
        </motion.div>

        {/* 标记点 */}
        {showMarks && marks.length > 0 && (
          <div className={cn(
            "absolute",
            orientation === 'horizontal'
              ? 'top-1/2 left-0 right-0 -translate-y-1/2'
              : 'left-1/2 top-0 bottom-0 -translate-x-1/2'
          )}>
            {marks.map((mark) => {
              const percentage = valueToPercentage(mark.value)

              return (
                <div
                  key={mark.value}
                  className={cn(
                    "absolute",
                    orientation === 'horizontal'
                      ? '-translate-x-1/2'
                      : '-translate-y-1/2'
                  )}
                  style={
                    orientation === 'horizontal'
                      ? { left: `${percentage}%` }
                      : { bottom: `${percentage}%` }
                  }
                >
                  {/* 标记点圆点 */}
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full bg-[var(--color-border)]",
                      markClassName
                    )}
                  />

                  {/* 标记点标签 */}
                  {mark.label && (
                    <span className={cn(
                      "absolute text-xs text-[var(--color-text-secondary)] whitespace-nowrap",
                      orientation === 'horizontal'
                        ? '-top-6 left-1/2 -translate-x-1/2'
                        : '-left-6 top-1/2 -translate-y-1/2'
                    )}>
                      {mark.label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* 滑块手柄 */}
        <AnimatePresence>
          {(isRange ? (currentValue as number[]) : [currentValue]).map((val, index) => {
            const percentage = valueToPercentage(val)
            const isCurrentDragging = isDragging && dragIndex === index

            return (
              <motion.div
                key={index}
                className={cn(
                  "absolute rounded-full border-2 shadow-sm",
                  currentSize.thumb,
                  currentColor.thumb,
                  !disabled && 'cursor-grab active:cursor-grabbing',
                  isCurrentDragging && 'cursor-grabbing',
                  thumbClassName
                )}
                style={
                  orientation === 'horizontal'
                    ? { left: `${percentage}%`, top: '50%', transform: 'translate(-50%, -50%)' }
                    : { bottom: `${percentage}%`, left: '50%', transform: 'translate(-50%, 50%)' }
                }
                initial="thumb"
                animate={thumbControls}
                variants={variants}
                whileHover={disabled ? {} : "thumbHover"}
                onPointerDown={(e) => handlePointerDown(e, index)}
                layout
              >
                {/* 焦点环 */}
                <div className={cn(
                  "absolute inset-0 rounded-full ring-2 ring-[var(--color-primary-400)]",
                  "opacity-0 focus-within:opacity-100 transition-opacity"
                )}>
                  <div className="w-full h-full rounded-full" tabIndex={0} />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* 帮助文本 */}
      {helperText && !error && (
        <motion.p
          className="text-sm mt-2 text-[var(--color-text-secondary)]"
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
            className="text-sm mt-2 text-[var(--color-error-600)]"
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
})

Slider.displayName = "Slider"

export { Slider }