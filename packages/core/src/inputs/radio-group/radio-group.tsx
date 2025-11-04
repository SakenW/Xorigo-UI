/**
 * RadioGroup - 单选框组组件
 *
 * 提供单选选项的组合
 */

import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export interface RadioGroupOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioGroupProps {
  options: RadioGroupOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  direction?: 'horizontal' | 'vertical'
  disabled?: boolean
  className?: string
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    { options = [], value, defaultValue = '', onValueChange, direction = 'vertical', disabled, className },
    ref
  ) => {
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : defaultValue

    const handleChange = (optionValue: string) => {
      if (disabled) return
      onValueChange?.(optionValue)
    }

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-2',
          direction === 'horizontal' && 'flex space-x-4',
          className
        )}
      >
        {options.map((option) => {
          const checked = currentValue === option.value

          return (
            <label
              key={option.value}
              className={cn(
                'flex items-center space-x-2 cursor-pointer',
                (disabled || option.disabled) && 'opacity-50 cursor-not-allowed'
              )}
            >
              <input
                type="radio"
                checked={checked}
                onChange={() => handleChange(option.value)}
                disabled={disabled || option.disabled}
                className="sr-only"
              />
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  'border-[var(--color-border-primary)]',
                  checked && 'border-[var(--color-primary-500)]'
                )}
              >
                {checked && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary-500)]" />
                )}
              </div>
              <span className="text-sm">{option.label}</span>
            </label>
          )
        })}
      </div>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'
export type { RadioGroupProps, RadioGroupOption }
