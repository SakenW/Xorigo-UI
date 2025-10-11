import React, { forwardRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input, type InputProps } from './Input'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface InputNumberProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  min?: number
  max?: number
  step?: number
  formatter?: (value: number) => string
  parser?: (value: string) => number
  precision?: number
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
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string>(String(value))
    const [numericValue, setNumericValue] = useState<number>(
      parseFloat(String(value)) || 0
    )

    useEffect(() => {
      setInternalValue(String(value))
      setNumericValue(parseFloat(String(value)) || 0)
    }, [value])

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

    // 检查是否可以增减
    const canIncrement = max === undefined || numericValue < max
    const canDecrement = min === undefined || numericValue > min

    return (
      <div className={cn('relative', className)}>
        <Input
          ref={ref}
          type="text"
          value={internalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="pr-12"
          {...props}
        />

        {/* 增减按钮组 */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
          {/* 增加按钮 */}
          <motion.button
            type="button"
            onClick={increment}
            disabled={disabled || !canIncrement}
            className={cn(
              'p-1 rounded-t hover:bg-gray-100 dark:hover:bg-gray-700',
              'transition-colors',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent',
              'text-gray-600 dark:text-gray-400'
            )}
            whileHover={canIncrement && !disabled ? { scale: 1.1 } : {}}
            whileTap={canIncrement && !disabled ? { scale: 0.9 } : {}}
            aria-label="增加"
          >
            <ChevronUp className="w-4 h-4" />
          </motion.button>

          {/* 减少按钮 */}
          <motion.button
            type="button"
            onClick={decrement}
            disabled={disabled || !canDecrement}
            className={cn(
              'p-1 rounded-b hover:bg-gray-100 dark:hover:bg-gray-700',
              'transition-colors',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent',
              'text-gray-600 dark:text-gray-400'
            )}
            whileHover={canDecrement && !disabled ? { scale: 1.1 } : {}}
            whileTap={canDecrement && !disabled ? { scale: 0.9 } : {}}
            aria-label="减少"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    )
  }
)

InputNumber.displayName = 'InputNumber'
