'use client'

import React from 'react'

// Label Renderer
interface LabelRendererProps {
  for?: string
  required?: boolean
  children?: React.ReactNode
}

export function LabelRenderer({
  for: htmlFor,
  required = false,
  children = '这是一个标签示例'
}: LabelRendererProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={htmlFor}
        className={`
          block text-sm font-medium
          ${required ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}
        `}
      >
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {required ? '必填字段' : '可选字段'}
        {htmlFor && ` | 关联ID: ${htmlFor}`}
      </div>
    </div>
  )
}

// Badge Renderer
interface BadgeRendererProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
}

export function BadgeRenderer({
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

// Tag Renderer
interface TagRendererProps {
  color?: string
  closable?: boolean
  onClose?: () => void
  children?: React.ReactNode
}

export function TagRenderer({
  color = '#3B82F6',
  closable = false,
  onClose,
  children = 'Tag'
}: TagRendererProps) {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onClose) onClose()
  }

  return (
    <div className="w-full">
      <span
        className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-white"
        style={{ backgroundColor: color }}
      >
        {children}
        {closable && (
          <button
            onClick={handleClose}
            className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </span>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        颜色: {color} | 可关闭: {closable ? '是' : '否'}
      </div>
    </div>
  )
}

// Divider Renderer
interface DividerRendererProps {
  orientation?: 'horizontal' | 'vertical'
  dashed?: boolean
  text?: string
}

export function DividerRenderer({
  orientation = 'horizontal',
  dashed = false,
  text
}: DividerRendererProps) {
  if (orientation === 'vertical') {
    return (
      <div className="w-full flex justify-center">
        <div className={`
          h-16 w-px
          ${dashed ? 'border-l-2 border-dashed' : 'border-l'}
          border-gray-300 dark:border-gray-600
        `} />
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-20">
          垂直分割线 | {dashed ? '虚线' : '实线'}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="relative">
        <div className={`
          w-full
          ${dashed ? 'border-t-2 border-dashed' : 'border-t'}
          border-gray-300 dark:border-gray-600
        `} />
        {text && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white dark:bg-gray-800 px-3 text-sm text-gray-500 dark:text-gray-400">
              {text}
            </span>
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        水平分割线 | {dashed ? '虚线' : '实线'} {text && `| 文本: ${text}`}
      </div>
    </div>
  )
}