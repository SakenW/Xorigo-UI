'use client'

import React, { useState } from 'react'

interface EmailInputRendererProps {
  validation?: boolean
  domains?: string[]
  placeholder?: string
  value?: string
  disabled?: boolean
  onChange?: (value: string, isValid?: boolean) => void
  updateProp?: (prop: string, value: any) => void
}

export default function EmailInputRenderer({
  validation = true,
  domains = [],
  placeholder = '请输入邮箱地址...',
  value = '',
  disabled = false,
  onChange,
  updateProp
}: EmailInputRendererProps) {
  const [localValue, setLocalValue] = useState(value)
  const [isValid, setIsValid] = useState(true)

  // 确保 domains 是数组格式
  const safeDomains = Array.isArray(domains) ? domains :
    (typeof domains === 'string' ?
      (domains.startsWith('[') ? JSON.parse(domains) : []) : []
    )

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return false

    if (safeDomains.length > 0) {
      const domain = email.split('@')[1]
      return safeDomains.some(allowedDomain => domain === allowedDomain)
    }

    return true
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)

    let emailValid = true
    if (validation && newValue) {
      emailValid = validateEmail(newValue)
    }

    setIsValid(emailValid)
    if (onChange) onChange(newValue, emailValid)
    if (updateProp) updateProp('value', newValue)
  }

  const getStatusColor = () => {
    if (!localValue) return 'border-gray-300 dark:border-gray-600'
    if (isValid) return 'border-green-500 dark:border-green-400'
    return 'border-red-500 dark:border-red-400'
  }

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="email"
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${getStatusColor()}`}
        />
        {localValue && validation && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        )}
      </div>
      {validation && safeDomains.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          允许的域名: {safeDomains.join(', ')}
        </div>
      )}
      {localValue && !isValid && (
        <div className="text-xs text-red-500 dark:text-red-400 mt-1">
          请输入有效的邮箱地址
        </div>
      )}
    </div>
  )
}