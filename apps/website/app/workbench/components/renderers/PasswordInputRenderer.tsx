'use client'

import React, { useState } from 'react'

interface PasswordInputRendererProps {
  placeholder?: string
  value?: string
  showPassword?: boolean
  strength?: boolean
  disabled?: boolean
  onChange?: (value: string) => void
  updateProp?: (prop: string, value: any) => void
}

export default function PasswordInputRenderer({
  placeholder = '请输入密码...',
  value = '',
  showPassword = false,
  strength = true,
  disabled = false,
  onChange,
  updateProp
}: PasswordInputRendererProps) {
  const [showPwd, setShowPwd] = useState(showPassword)
  const [pwdValue, setPwdValue] = useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setPwdValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
    if (updateProp) {
      updateProp('value', newValue)
    }
  }

  const togglePasswordVisibility = () => {
    const newShow = !showPwd
    setShowPwd(newShow)
    if (updateProp) {
      updateProp('showPassword', newShow)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, text: '' }

    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    const levels = ['', '弱', '一般', '中等', '强', '很强']
    return { score, text: levels[score] }
  }

  const pwdStrength = getPasswordStrength(pwdValue)

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <input
          type={showPwd ? 'text' : 'password'}
          placeholder={placeholder}
          value={pwdValue}
          onChange={handleChange}
          disabled={disabled}
          className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          {showPwd ? '🙈' : '👁️'}
        </button>
      </div>

      {strength && pwdValue && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">密码强度:</span>
            <span className={`font-medium ${
              pwdStrength.score <= 2 ? 'text-red-500' :
              pwdStrength.score <= 3 ? 'text-yellow-500' :
              'text-green-500'
            }`}>
              {pwdStrength.text}
            </span>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  level <= pwdStrength.score
                    ? level <= 2 ? 'bg-red-500' : level <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}