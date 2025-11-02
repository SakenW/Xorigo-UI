/**
 * Switch - 开关组件
 *
 * 临时的基础开关组件实现
 */

import React, { forwardRef } from 'react'

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: 'sm' | 'md' | 'lg'
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = '', checked, onCheckedChange, size = 'md', onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onCheckedChange?.(e.target.checked)
    }

    const sizeClasses = {
      sm: 'w-8 h-4',
      md: 'w-11 h-6',
      lg: 'w-14 h-8'
    }

    const thumbSizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }

    return (
      <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        <div
          className={`${sizeClasses[size]} rounded-full transition-colors ${
            checked ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <div
            className={`${thumbSizeClasses[size]} bg-white rounded-full shadow-md transform transition-transform ${
              checked ? 'translate-x-5' : 'translate-x-1'
            }`}
            style={{
              transform: checked
                ? size === 'sm' ? 'translateX(1rem)' : size === 'md' ? 'translateX(1.25rem)' : 'translateX(1.5rem)'
                : 'translateX(0.25rem)'
            }}
          />
        </div>
      </label>
    )
  }
)

Switch.displayName = 'Switch'