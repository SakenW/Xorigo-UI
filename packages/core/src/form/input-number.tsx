'use client'

import React, { forwardRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'
import { ChevronUp, ChevronDown } from 'lucide-react'

// 变体配置
const inputNumberVariants = cva(
  'relative flex items-center',
  {
    variants: {
      variant: {
        default: '',
        primary: '',
        success: '',
        warning: '',
        danger: '',
        neon: '',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
      status: {
        default: '',
        error: '',
        success: '',
        warning: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      status: 'default',
    },
  }
)

const stepperVariants = cva(
  'absolute right-1 top-1/2 -translate-y-1/2 flex flex-col border rounded-md overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-gray-300 dark:border-gray-600',
        primary: 'border-gray-300 dark:border-gray-600',
        success: 'border-gray-300 dark:border-gray-600',
        warning: 'border-gray-300 dark:border-gray-600',
        danger: 'border-gray-300 dark:border-gray-600',
        neon: 'border-cyan-400 bg-black/50',
      },
      size: {
        sm: 'right-0.5',
        md: 'right-1',
        lg: 'right-1.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

const stepperButtonVariants = cva(
  'flex items-center justify-center transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-1 disabled:opacity-30 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 focus:ring-gray-500/20',
        primary: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 focus:ring-blue-500/20',
        success: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 focus:ring-green-500/20',
        warning: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 focus:ring-yellow-500/20',
        danger: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 focus:ring-red-500/20',
        neon: 'hover:bg-cyan-900/30 text-cyan-400 focus:ring-cyan-400/20',
      },
      size: {
        sm: 'p-0.5',
        md: 'p-1',
        lg: 'p-1.5',
      },
      position: {
        up: 'rounded-t-md rounded-b-none border-b',
        down: 'rounded-b-md rounded-t-none border-t',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      position: 'up',
    },
  }
)

export interface InputNumberProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  min?: number
  max?: number
  step?: number
  formatter?: (value: number) => string
  parser?: (value: string) => number
  precision?: number
  variant?: VariantProps<typeof inputNumberVariants>['variant']
  size?: VariantProps<typeof inputNumberVariants>['size']
  status?: VariantProps<typeof inputNumberVariants>['status']
  label?: string
  error?: string
  helperText?: string
  stepperPosition?: 'right' | 'left'
  hideStepper?: boolean
}

/**
 * InputNumber - 数字输入组件
 *
 * 专门的数字输入框，支持：
 * - 增减按钮
 * - 最小值/最大值限制
 * - 步长控制
 * - 键盘上下键调整
 * - 自定义格式化
 */
export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      min,
      max,
      step = 1,
      formatter,
      parser,
      precision = 0,
      value = '',
      onChange,
      onKeyDown,
      disabled = false,
      variant = 'primary',
      size = 'md',
      status,
      label,
      error,
      helperText,
      stepperPosition = 'right',
      hideStepper = false,
      className,
      ...props
    },
    ref
  ) => {
    const { themeConfig } = useTheme()
    const [internalValue, setInternalValue] = useState<string>(String(value))
    const [numericValue, setNumericValue] = useState<number>(
      parseFloat(String(value)) || 0
    )
    const [isFocused, setIsFocused] = useState(false)

    const effectiveStatus = status || (error ? 'error' : 'default')

    useEffect(() => {
      setInternalValue(String(value))
      setNumericValue(parseFloat(String(value)) || 0)
    }, [value])

    // 获取主题样式
    const getInputThemeStyle = (): React.CSSProperties => {
      if (variant === 'neon') {
        return {
          boxShadow: isFocused ? `0 0 10px ${themeConfig.glow}` : `0 0 5px ${themeConfig.glow}`,
          borderColor: isFocused ? (themeConfig.colors?.[400] as unknown as string) : undefined,
        }
      }
      return {}
    }

    // 获取基础输入框样式
    const getInputClassName = () => {
      const baseInputClass = 'w-full px-3 py-2 border rounded-md transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

      const variantClasses = {
        default: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500/20',
        primary: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500/20',
        success: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-green-500 focus:ring-green-500/20',
        warning: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-yellow-500 focus:ring-yellow-500/20',
        danger: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-red-500 focus:ring-red-500/20',
        neon: 'border-cyan-400 bg-black/50 text-cyan-400 focus:border-cyan-400 focus:ring-cyan-400/20',
      }

      const statusClasses = {
        default: '',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
        warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20',
      }

      const sizeClasses = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-3 text-base',
      }

      const paddingRight = hideStepper ? '' : (stepperPosition === 'right' ? 'pr-12' : 'pl-12')

      return cn(
        baseInputClass,
        variantClasses[variant],
        statusClasses[effectiveStatus],
        sizeClasses[size],
        paddingRight
      )
    }

    // 解析字符串为数字
    const parseValue = (val: string): number => {
      if (parser) {
        return parser(val)
      }
      const parsed = parseFloat(val)
      return isNaN(parsed) ? 0 : parsed
    }

    // 格式化数字为字符串
    const formatValue = (val: number): string => {
      if (formatter) {
        return formatter(val)
      }
      return val.toFixed(precision)
    }

    // 限制数字在范围内
    const clampValue = (val: number): number => {
      let clamped = val
      if (min !== undefined && clamped < min) clamped = min
      if (max !== undefined && clamped > max) clamped = max
      return Number(clamped.toFixed(precision))
    }

    // 增加数值
    const increment = () => {
      if (disabled) return
      const newValue = clampValue(numericValue + step)
      updateValue(newValue)
    }

    // 减少数值
    const decrement = () => {
      if (disabled) return
      const newValue = clampValue(numericValue - step)
      updateValue(newValue)
    }

    // 更新数值
    const updateValue = (newValue: number) => {
      setNumericValue(newValue)
      const formatted = formatValue(newValue)
      setInternalValue(formatted)

      if (onChange) {
        const event = {
          target: { value: String(newValue) },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(event)
      }
    }

    // 处理输入变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      setInternalValue(inputValue)

      // 尝试解析输入的数字
      const parsed = parseValue(inputValue)
      if (!isNaN(parsed)) {
        const clamped = clampValue(parsed)
        setNumericValue(clamped)

        if (onChange) {
          const newEvent = {
            ...e,
            target: { ...e.target, value: String(clamped) },
          }
          onChange(newEvent)
        }
      }
    }

    // 处理失焦 - 确保值在范围内并格式化
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const parsed = parseValue(internalValue)
      const clamped = clampValue(parsed)
      const formatted = formatValue(clamped)
      setInternalValue(formatted)
      setNumericValue(clamped)
      setIsFocused(false)

      props.onBlur?.(e)
    }

    // 处理键盘事件
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        increment()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        decrement()
      }
      onKeyDown?.(e)
    }

    // 处理焦点事件
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    
    // 检查是否可以增减
    const canIncrement = max === undefined || numericValue < max
    const canDecrement = min === undefined || numericValue > min

    // 渲染增减按钮
    const renderStepper = () => {
      if (hideStepper) return null

      const stepperPositionClasses = stepperPosition === 'right'
        ? 'right-1'
        : 'left-1'

      return (
        <div className={cn(
          stepperVariants({ variant, size }),
          stepperPositionClasses
        )}>
          {/* 增加按钮 */}
          <motion.button
            type="button"
            onClick={increment}
            disabled={disabled || !canIncrement}
            className={cn(
              stepperButtonVariants({
                variant,
                size,
                position: 'up'
              })
            )}
            whileHover={canIncrement && !disabled ? { scale: 1.05 } : {}}
            whileTap={canIncrement && !disabled ? { scale: 0.95 } : {}}
            aria-label="增加数值"
          >
            <ChevronUp className="w-3 h-3" />
          </motion.button>

          {/* 减少按钮 */}
          <motion.button
            type="button"
            onClick={decrement}
            disabled={disabled || !canDecrement}
            className={cn(
              stepperButtonVariants({
                variant,
                size,
                position: 'down'
              })
            )}
            whileHover={canDecrement && !disabled ? { scale: 1.05 } : {}}
            whileTap={canDecrement && !disabled ? { scale: 0.95 } : {}}
            aria-label="减少数值"
          >
            <ChevronDown className="w-3 h-3" />
          </motion.button>
        </div>
      )
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

        {/* 输入框容器 */}
        <div className={cn('relative', inputNumberVariants({ variant, size, status: effectiveStatus }))}>
          <motion.input
            ref={ref}
            type="text"
            value={internalValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={getInputClassName()}
            style={getInputThemeStyle()}
            whileHover={!disabled ? { scale: 1.01 } : {}}
            transition={{ duration: 0.2 }}
            {...props}
          />

          {/* 增减按钮 */}
          {renderStepper()}
        </div>

        {/* 帮助文本 */}
        {helperText && !error && (
          <motion.p
            className="text-sm mt-1 text-gray-500 dark:text-gray-400"
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
              className="text-sm mt-1 text-red-600 dark:text-red-400"
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

InputNumber.displayName = 'InputNumber'
