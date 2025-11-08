'use client'

import React, { useState } from 'react'

interface PhoneInputRendererProps {
  countryCode?: string
  format?: string
  placeholder?: string
  value?: string
  disabled?: boolean
  onChange?: (value: string) => void
  updateProp?: (prop: string, value: any) => void
}

export default function PhoneInputRenderer({
  countryCode = '+86',
  format = '### #### ####',
  placeholder = '请输入手机号...',
  value = '',
  disabled = false,
  onChange,
  updateProp
}: PhoneInputRendererProps) {
  const [localValue, setLocalValue] = useState(value)

  const formatPhoneNumber = (input: string) => {
    const digits = input.replace(/\D/g, '')
    let formatted = format

    let digitIndex = 0
    for (let i = 0; i < formatted.length && digitIndex < digits.length; i++) {
      if (formatted[i] === '#') {
        formatted = formatted.substring(0, i) + digits[digitIndex] + formatted.substring(i + 1)
        digitIndex++
      }
    }

    return formatted.replace(/#.*$/, '')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11)
    const formattedValue = formatPhoneNumber(digits)

    setLocalValue(formattedValue)
    if (onChange) onChange(formattedValue)
    if (updateProp) updateProp('value', formattedValue)
  }

  return (
    <div className="w-full">
      <div className="flex">
        <div className="flex items-center px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-sm font-medium">{countryCode}</span>
        </div>
        <input
          type="tel"
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        格式示例: 138 0013 8000
      </div>
    </div>
  )
}