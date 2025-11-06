'use client'
/**
 * RangeSlider - 范围滑块组件
 *
 * 提供双滑块范围选择
 */

import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export interface RangeSliderProps {
  value?: [number, number]
  defaultValue?: [number, number]
  onValueChange?: (value: [number, number]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
}

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
  (
    { value, defaultValue = [0, 100], onValueChange, min = 0, max = 100, step = 1, disabled, className },
    ref
  ) => {
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = useState(defaultValue)
    const currentValue = isControlled ? value : internalValue

    const handleChange = (index: 0 | 1, newValue: number) => {
      const newVal: [number, number] = [...currentValue]
      newVal[index] = newValue

      if (!isControlled) {
        setInternalValue(newVal)
      }
      onValueChange?.(newVal)
    }

    return (
      <div className={cn('relative h-6', className)}>
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-[var(--color-surface-secondary)] rounded-full" />
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue[0]}
          onChange={(e) => handleChange(0, Number(e.target.value))}
          disabled={disabled}
          className="absolute w-full h-6 opacity-0 cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue[1]}
          onChange={(e) => handleChange(1, Number(e.target.value))}
          disabled={disabled}
          className="absolute w-full h-6 opacity-0 cursor-pointer"
        />
      </div>
    )
  }
)

RangeSlider.displayName = 'RangeSlider'
export type { RangeSliderProps }
