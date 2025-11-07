'use client'

import React from 'react'

interface TextInputRendererProps {
  placeholder?: string
  value?: string
  disabled?: boolean
  onChange?: (value: string) => void
  updateProp?: (prop: string, value: any) => void
}

export default function TextInputRenderer({
  placeholder = '请输入文本...',
  value = '',
  disabled = false,
  onChange,
  updateProp
}: TextInputRendererProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (onChange) {
      onChange(newValue)
    }
    if (updateProp) {
      updateProp('value', newValue)
    }
  }

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
      />
    </div>
  )
}