'use client'

import React from 'react'

interface RadioRendererProps {
  options?: Array<{ value: string; label: string }>
  selected?: string
  disabled?: boolean
  onChange?: (value: string) => void
  updateProp?: (prop: string, value: any) => void
}

export default function RadioRenderer({
  options = [
    { value: 'option1', label: '选项 1' },
    { value: 'option2', label: '选项 2' },
    { value: 'option3', label: '选项 3' }
  ],
  selected = '',
  disabled = false,
  onChange,
  updateProp
}: RadioRendererProps) {
  // 确保 options 是数组格式
  const safeOptions = Array.isArray(options) ? options :
    (typeof options === 'string' ?
      (options.startsWith('[') ? JSON.parse(options) : []) : []
    )

  const handleChange = (value: string) => {
    if (onChange) onChange(value)
    if (updateProp) updateProp('selected', value)
  }

  return (
    <div className="w-full space-y-3">
      {safeOptions.map((option) => (
        <label
          key={option.value}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <div className="relative">
            <input
              type="radio"
              name="radio-group"
              value={option.value}
              checked={selected === option.value}
              disabled={disabled}
              onChange={() => handleChange(option.value)}
              className="sr-only"
            />
            <div className={`
              w-5 h-5 rounded-full border-2 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
              ${disabled
                ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                : selected === option.value
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer'
              }
            `}>
              {selected === option.value && (
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1.5" />
              )}
            </div>
          </div>
          <span className={`
            text-gray-700 dark:text-gray-300 select-none
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}>
            {option.label}
            {selected === option.value && ' (已选中)'}
          </span>
        </label>
      ))}
    </div>
  )
}