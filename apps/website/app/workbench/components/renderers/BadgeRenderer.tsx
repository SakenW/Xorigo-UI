'use client'

import React from 'react'

interface BadgeRendererProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

export default function BadgeRenderer({
  variant = 'default',
  size = 'md',
  children = 'Badge'
}: BadgeRendererProps) {
  const getVariantClass = () => {
    const variantMap = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    }
    return variantMap[variant] || variantMap.default
  }

  const getSizeClass = () => {
    const sizeMap = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base'
    }
    return sizeMap[size] || sizeMap.md
  }

  return (
    <div className="w-full">
      <span className={`
        inline-flex items-center font-medium rounded-full
        ${getVariantClass()} ${getSizeClass()}
      `}>
        {children}
      </span>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        类型: {variant} | 大小: {size}
      </div>
    </div>
  )
}