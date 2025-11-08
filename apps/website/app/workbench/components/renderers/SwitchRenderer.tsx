'use client'

import React from 'react'

interface SwitchRendererProps {
  checked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  updateProp?: (prop: string, value: any) => void
}

export default function SwitchRenderer({
  checked = false,
  disabled = false,
  onChange,
  updateProp
}: SwitchRendererProps) {
  const handleChange = () => {
    const newChecked = !checked
    if (onChange) onChange(newChecked)
    if (updateProp) updateProp('checked', newChecked)
  }

  return (
    <div className="w-full">
      <label className="flex items-center space-x-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            className="sr-only"
          />
          <div className={`
            w-12 h-6 rounded-full transition-colors duration-200 ease-in-out
            ${disabled
              ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              : checked
                ? 'bg-blue-500'
                : 'bg-gray-300 dark:bg-gray-600'
            }
          `}>
            <div className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out
              ${disabled ? 'opacity-50' : ''}
              ${checked ? 'translate-x-6' : 'translate-x-0'}
            `} />
          </div>
        </div>
        <span className={`
          text-gray-700 dark:text-gray-300 select-none font-medium
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
          {checked ? '开启' : '关闭'}
          {disabled && ' (禁用)'}
        </span>
      </label>
    </div>
  )
}