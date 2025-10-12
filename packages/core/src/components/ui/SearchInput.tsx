'use client'

import React, { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Input, type InputProps } from './Input'
import { Search } from 'lucide-react'
import { cn } from '@/utils'

export interface SearchInputProps extends Omit<InputProps, 'type' | 'leftIcon'> {
  onSearch?: (value: string) => void
  showSearchButton?: boolean
  searchButtonText?: string
  loading?: boolean
}

/**
 * SearchInput - 搜索输入组件
 *
 * 专门的搜索输入框，包含：
 * - 搜索图标
 * - 可选的搜索按钮
 * - 回车搜索支持
 * - 清除按钮
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      onSearch,
      showSearchButton = false,
      searchButtonText = '搜索',
      loading = false,
      value = '',
      onChange,
      onKeyDown,
      clearable = true,
      placeholder = '搜索...',
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value)

    const handleSearch = () => {
      if (onSearch) {
        onSearch(String(internalValue))
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
      onKeyDown?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value)
      onChange?.(e)
    }

    if (showSearchButton) {
      return (
        <div className={cn('flex gap-2', className)}>
          <div className="flex-1">
            <Input
              ref={ref}
              type="text"
              leftIcon={<Search className="w-4 h-4" />}
              value={value}
              onChange={onChange || handleChange}
              onKeyDown={handleKeyDown}
              clearable={clearable}
              placeholder={placeholder}
              disabled={loading}
              {...props}
            />
          </div>
          <motion.button
            type="button"
            onClick={handleSearch}
            disabled={loading || !String(value || internalValue).trim()}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              'bg-blue-500 text-white',
              'hover:bg-blue-600',
              'disabled:bg-gray-300 disabled:cursor-not-allowed',
              'focus:outline-hidden focus:ring-2 focus:ring-blue-500/20'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>搜索中...</span>
              </div>
            ) : (
              searchButtonText
            )}
          </motion.button>
        </div>
      )
    }

    return (
      <Input
        ref={ref}
        type="text"
        leftIcon={<Search className="w-4 h-4" />}
        value={value}
        onChange={onChange || handleChange}
        onKeyDown={handleKeyDown}
        clearable={clearable}
        placeholder={placeholder}
        disabled={loading}
        className={className}
        {...props}
      />
    )
  }
)

SearchInput.displayName = 'SearchInput'
