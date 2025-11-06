'use client'
/**
 * Autocomplete - 自动完成组件
 *
 * 提供智能搜索和自动完成功能，支持过滤和自定义渲染
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface AutocompleteOption {
  value: string
  label: string
  disabled?: boolean
  [key: string]: any
}

export interface AutocompleteProps {
  /**
   * 选项列表
   */
  options: AutocompleteOption[]

  /**
   * 当前值
   */
  value?: string

  /**
   * 默认值
   */
  defaultValue?: string

  /**
   * 值变化处理
   */
  onValueChange?: (value: string) => void

  /**
   * 输入变化处理
   */
  onInputChange?: (value: string) => void

  /**
   * 选择处理
   */
  onSelect?: (option: AutocompleteOption) => void

  /**
   * 占位符文本
   */
  placeholder?: string

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 是否加载中
   */
  loading?: boolean

  /**
   * 尺寸
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * 变体
   */
  variant?: 'default' | 'filled' | 'outline'

  /**
   * 自定义类名
   */
  className?: string

  /**
   * 是否可清除
   */
  clearable?: boolean

  /**
   * 是否多选
   */
  multiple?: boolean

  /**
   * 过滤函数
   */
  filter?: (input: string, option: AutocompleteOption) => boolean

  /**
   * 渲染选项
   */
  renderOption?: (option: AutocompleteOption) => React.ReactNode
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * Autocomplete 组件
 */
export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      options = [],
      value,
      defaultValue = '',
      onValueChange,
      onInputChange,
      onSelect,
      placeholder = '输入搜索...',
      disabled = false,
      loading = false,
      size = 'md',
      variant = 'default',
      className,
      clearable = false,
      multiple = false,
      filter,
      renderOption,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(defaultValue)
    const [isOpen, setIsOpen] = useState(false)
    const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>(options)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    const isControlled = value !== undefined
    const displayValue = isControlled ? value : inputValue

    useEffect(() => {
      if (filter) {
        const filtered = options.filter((option) => filter(displayValue, option))
        setFilteredOptions(filtered)
      } else {
        const filtered = options.filter((option) =>
          option.label.toLowerCase().includes(displayValue.toLowerCase())
        )
        setFilteredOptions(filtered)
      }
    }, [displayValue, options, filter])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      onInputChange?.(newValue)
      setIsOpen(true)
      setSelectedIndex(-1)
    }

    const handleSelect = (option: AutocompleteOption) => {
      setInputValue(option.label)
      onValueChange?.(option.value)
      onSelect?.(option)
      setIsOpen(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
            handleSelect(filteredOptions[selectedIndex])
          }
          break
        case 'Escape':
          setIsOpen(false)
          break
      }
    }

    const sizeStyles = {
      sm: 'h-8 text-sm px-3',
      md: 'h-10 text-base px-4',
      lg: 'h-12 text-lg px-4'
    }

    const variantStyles = {
      default: 'border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)]',
      filled: 'border-0 bg-[var(--color-surface-secondary)]',
      outline: 'border-2 border-[var(--color-primary-500)] bg-transparent'
    }

    return (
      <div className={cn('relative', className)}>
        <div className="relative">
          <input
            ref={(el) => {
              if (typeof ref === 'function') {
                ref(el)
              } else if (ref) {
                ref.current = el
              }
              inputRef.current = el
            }}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled || loading}
            className={cn(
              'w-full rounded-md transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizeStyles[size],
              variantStyles[variant]
            )}
            {...props}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-[var(--color-primary-500)] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <AnimatePresence>
          {isOpen && filteredOptions.length > 0 && (
            <motion.ul
              ref={listRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'absolute z-50 w-full mt-2 rounded-md shadow-lg',
                'bg-[var(--color-surface-primary)] border border-[var(--color-border-primary)]',
                'max-h-60 overflow-auto'
              )}
            >
              {filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  onClick={() => !option.disabled && handleSelect(option)}
                  className={cn(
                    'px-4 py-2 cursor-pointer transition-colors',
                    'hover:bg-[var(--color-surface-secondary)]',
                    index === selectedIndex && 'bg-[var(--color-primary-100)]',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {renderOption ? renderOption(option) : option.label}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Autocomplete.displayName = 'Autocomplete'

export type { AutocompleteProps, AutocompleteOption }
