'use client'

import React, { useState } from 'react'

interface ButtonRendererProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'link' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  children?: React.ReactNode
  onClick?: () => void
  updateProp?: (prop: string, value: any) => void
}

export default function ButtonRenderer({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  children = '按钮',
  onClick,
  updateProp
}: ButtonRendererProps) {
  const [clickCount, setClickCount] = useState(0)
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = () => {
    if (!disabled && !loading) {
      setClickCount(prev => prev + 1)
      setIsPressed(true)
      setTimeout(() => setIsPressed(false), 200)
      if (onClick) onClick()
    }
  }

  const getVariantClasses = () => {
    const variants = {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500',
      secondary: 'bg-gray-500 hover:bg-gray-600 text-white border-gray-500',
      outline: 'border-blue-500 text-blue-500 hover:bg-blue-50 bg-white',
      text: 'text-blue-500 hover:bg-blue-50 hover:text-blue-600',
      link: 'text-blue-500 hover:text-blue-600 hover:underline p-0',
      danger: 'bg-red-500 hover:bg-red-600 text-white border-red-500',
      ghost: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
    }
    return variants[variant]
  }

  const getSizeClasses = () => {
    const sizes = {
      small: 'px-3 py-1.5 text-sm',
      medium: 'px-4 py-2 text-base',
      large: 'px-6 py-3 text-lg'
    }
    return sizes[size]
  }

  return (
    <div className="w-full">
      {/* 按钮展示区 */}
      <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <button
          onClick={handleClick}
          disabled={disabled || loading}
          className={`
            relative inline-flex items-center justify-center
            font-medium rounded-lg border transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${getVariantClasses()}
            ${getSizeClasses()}
            ${isPressed ? 'scale-95' : 'scale-100'}
            ${loading ? 'cursor-wait' : 'cursor-pointer'}
          `}
        >
          {/* 加载状态 */}
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}

          {/* 按钮内容 */}
          <span className={loading ? 'opacity-0' : ''}>
            {children}
          </span>

          {/* 按按下效果 */}
          {isPressed && (
            <span className="absolute inset-0 rounded-lg bg-white opacity-20 pointer-events-none"></span>
          )}
        </button>
      </div>

      {/* 配置面板 */}
      <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          按钮配置
        </h4>

        <div className="grid grid-cols-2 gap-4">
          {/* 样式选择 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              样式
            </label>
            <select
              value={variant}
              onChange={(e) => updateProp && updateProp('variant', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            >
              <option value="primary">主要</option>
              <option value="secondary">次要</option>
              <option value="outline">轮廓</option>
              <option value="text">文本</option>
              <option value="link">链接</option>
              <option value="danger">危险</option>
              <option value="ghost">幽灵</option>
            </select>
          </div>

          {/* 尺寸选择 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              尺寸
            </label>
            <select
              value={size}
              onChange={(e) => updateProp && updateProp('size', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            >
              <option value="small">小</option>
              <option value="medium">中</option>
              <option value="large">大</option>
            </select>
          </div>
        </div>

        {/* 状态开关 */}
        <div className="mt-4 space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => updateProp && updateProp('disabled', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">禁用状态</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={loading}
              onChange={(e) => updateProp && updateProp('loading', e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">加载状态</span>
          </label>
        </div>

        {/* 按钮文本 */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            按钮文本
          </label>
          <input
            type="text"
            value={typeof children === 'string' ? children : ''}
            onChange={(e) => updateProp && updateProp('children', e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            placeholder="输入按钮文本"
          />
        </div>
      </div>

      {/* 状态信息 */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          按钮状态
        </h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div>点击次数: {clickCount}</div>
          <div>当前样式: {variant}</div>
          <div>当前尺寸: {size}</div>
          <div>禁用状态: {disabled ? '是' : '否'}</div>
          <div>加载状态: {loading ? '是' : '否'}</div>
          <div>按下状态: {isPressed ? '是' : '否'}</div>
        </div>
      </div>
    </div>
  )
}