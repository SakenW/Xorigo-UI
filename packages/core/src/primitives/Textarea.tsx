/**
 * Textarea - 文本域组件
 *
 * 临时的基础文本域组件实现
 */

import React, { forwardRef } from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'bordered'
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', variant = 'default', size = 'md', error = false, ...props }, ref) => {
    const baseClasses = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
    const variantClasses = {
      default: 'border',
      bordered: 'border-2'
    }
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-5 py-4 text-lg'
    }
    const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''

    return (
      <textarea
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${errorClasses} ${className}`}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'