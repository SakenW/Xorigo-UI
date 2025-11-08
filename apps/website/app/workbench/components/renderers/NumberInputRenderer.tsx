'use client'

import React, { useState } from 'react'

interface NumberInputRendererProps {
  min?: number
  max?: number
  step?: number
  value?: number
  disabled?: boolean
  onChange?: (value: number) => void
  updateProp?: (prop: string, value: any) => void
}

export default function NumberInputRenderer({
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  disabled = false,
  onChange,
  updateProp
}: NumberInputRendererProps) {
  const [localValue, setLocalValue] = useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    if (!isNaN(newValue)) {
      setLocalValue(newValue)
      if (onChange) onChange(newValue)
      if (updateProp) updateProp('value', newValue)
    }
  }

  const increment = () => {
    const newValue = Math.min(localValue + step, max)
    setLocalValue(newValue)
    if (onChange) onChange(newValue)
    if (updateProp) updateProp('value', newValue)
  }

  const decrement = () => {
    const newValue = Math.max(localValue - step, min)
    setLocalValue(newValue)
    if (onChange) onChange(newValue)
    if (updateProp) updateProp('value', newValue)
  }

  return (
    <div className="w-full">
      <div className="flex items-center">
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || localValue <= min}
          className="px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center"
        />
        <button
          type="button"
          onClick={increment}
          disabled={disabled || localValue >= max}
          className="px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        范围: {min} - {max}, 步长: {step}
      </div>
    </div>
  )
}