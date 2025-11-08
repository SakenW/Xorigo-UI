'use client'

import React from 'react'

interface LabelRendererProps {
  for?: string
  required?: boolean
  children?: React.ReactNode
}

export default function LabelRenderer({
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