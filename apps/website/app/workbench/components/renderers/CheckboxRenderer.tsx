'use client'

import React from 'react'

interface CheckboxRendererProps {
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  updateProp?: (prop: string, value: any) => void
}

export default function CheckboxRenderer({
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  updateProp
}: CheckboxRendererProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked
    if (onChange) onChange(newChecked)
    if (updateProp) updateProp('checked', newChecked)
  }

  const getCheckboxClass = () => {
    let baseClass = "w-5 h-5 rounded border-2 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"

    if (disabled) {
      return `${baseClass} bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed`
    }

    if (indeterminate) {
      return `${baseClass} bg-blue-500 border-blue-500`
    }

    if (checked) {
      return `${baseClass} bg-blue-500 border-blue-500`
    }

    return `${baseClass} bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer`
  }

  return (
    <div className="w-full">
      <label className="flex items-center space-x-3 cursor-pointer">
        <div className="relative">
          <input
            ref={inputRef}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            className="sr-only"
          />
          <div className={getCheckboxClass()}>
            {checked && (
              <svg className="w-3 h-3 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {indeterminate && (
              <svg className="w-3 h-3 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
              </svg>
            )}
          </div>
        </div>
        <span className="text-gray-700 dark:text-gray-300 select-none">
          {checked ? '已选中' : '未选中'}
          {indeterminate && ' (部分选中)'}
          {disabled && ' (禁用)'}
        </span>
      </label>
    </div>
  )
}