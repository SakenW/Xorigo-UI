'use client'

import React, { forwardRef, useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@th-ui/core'

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  size?: 'sm' | 'md' | 'lg'
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  autoResize?: boolean
  maxLength?: number
  showCount?: boolean
  wrapperClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      resize = 'vertical',
      autoResize = false,
      maxLength,
      showCount = false,
      className,
      wrapperClassName,
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null)
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef
    const [charCount, setCharCount] = useState(0)

    const sizeClasses = {
      sm: 'text-sm px-3 py-2 min-h-[80px]',
      md: 'text-base px-4 py-3 min-h-[120px]',
      lg: 'text-lg px-4 py-3 min-h-[160px]',
    }

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    }

    // 自动调整高度
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }, [value, autoResize, textareaRef])

    // 更新字符计数
    useEffect(() => {
      if (value !== undefined) {
        setCharCount(String(value).length)
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      onChange?.(e)
    }

    return (
      <div className={cn('w-full', wrapperClassName)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
            {maxLength && showCount && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                ({charCount}/{maxLength})
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={textareaRef}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            onChange={handleChange}
            className={cn(
              'w-full rounded-lg border transition-all',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'focus:outline-hidden focus:ring-2',
              sizeClasses[size],
              autoResize ? 'resize-none overflow-hidden' : resizeClasses[resize],
              error
                ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20',
              disabled
                ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60'
                : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
              className
            )}
            {...props}
          />

          {/* 字符计数（显示在右下角） */}
          {showCount && maxLength && !label && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 pointer-events-none">
              {charCount}/{maxLength}
            </div>
          )}
        </div>

        {/* 错误信息或帮助文本 */}
        {(error || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mt-2 text-sm',
              error
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400'
            )}
          >
            {error || helperText}
          </motion.div>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
