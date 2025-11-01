import React, { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'
import { ChevronDown, X, Search } from 'lucide-react'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  group?: string
  icon?: React.ReactNode
  description?: string
}

// Select变体配置
const selectVariants = cva(
  // 基础样式
  'w-full rounded-lg transition-all duration-200 focus:outline-hidden disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed appearance-none',
  {
    variants: {
      variant: {
        // 默认样式 - 带边框和背景
        default:
          'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',

        // 填充样式 - 无边框，有背景色
        filled:
          'border-0 bg-gray-100 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20',

        // 轮廓样式 - 粗边框，透明背景
        outlined:
          'border-2 border-gray-300 dark:border-gray-600 bg-transparent focus:border-blue-500',

        // 下划线样式 - 仅底部边框
        underlined:
          'border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent rounded-none px-0 focus:border-blue-500',

        // 霓虹样式 - 赛博朋克风格
        neon:
          'border border-cyan-400 bg-black/50 text-cyan-400 focus:ring-cyan-400 focus:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)] focus:shadow-[0_0_20px_rgba(6,182,212,0.5)]',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm pr-8',
        md: 'px-4 py-2 text-sm pr-10',
        lg: 'px-5 py-3 text-base pr-12',
      },
      status: {
        default: '',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
        warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20',
      },
      searchable: {
        true: '',
      },
      multiple: {
        true: '',
      },
    },
    compoundVariants: [
      // 可搜索时的额外样式
      {
        searchable: true,
        className: 'cursor-text',
      },
      // 多选时的额外样式
      {
        multiple: true,
        className: 'min-h-[40px] py-1.5',
      },
      // 多选 + 尺寸
      {
        multiple: true,
        size: 'sm',
        className: 'min-h-[32px] py-1',
      },
      {
        multiple: true,
        size: 'lg',
        className: 'min-h-[48px] py-2',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      status: 'default',
      searchable: false,
      multiple: false,
    },
  }
)

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'multiple'>,
    VariantProps<typeof selectVariants> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  clearable?: boolean
  searchable?: boolean
  loading?: boolean
  maxVisibleItems?: number
  groupBy?: string
  renderOption?: (option: SelectOption, index: number) => React.ReactNode
  renderGroupHeader?: (group: string) => React.ReactNode
  onSearch?: (query: string) => void
  onClear?: () => void
}

// 多选标签组件
const MultiSelectTags: React.FC<{
  values: (string | number)[]
  options: SelectOption[]
  onRemove: (value: string | number) => void
  disabled?: boolean
}> = ({ values, options, onRemove, disabled }) => {
  const selectedOptions = options.filter(opt => values.includes(opt.value))

  return (
    <div className="flex flex-wrap gap-1">
      {selectedOptions.map((option) => (
        <span
          key={option.value}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md"
        >
          {option.label}
          {!disabled && (
            <button
              type="button"
              onClick={() => onRemove(option.value)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
    </div>
  )
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder,
      id,
      required = false,
      disabled = false,
      variant = 'default',
      size = 'md',
      status,
      clearable = false,
      searchable = false,
      loading = false,
      maxVisibleItems = 8,
      groupBy,
      renderOption,
      renderGroupHeader,
      onSearch,
      onClear,
      value,
      onChange,
      multiple = false,
      ...props
    },
    ref
  ) => {
    const { themeConfig } = useTheme()
    const [searchQuery, setSearchQuery] = useState('')
    const selectId = id || `select-${React.useId()}`

    // 处理状态
    const effectiveStatus = status || (error ? 'error' : 'default')
    const currentValue = value || (multiple ? [] : '')
    const hasValue = multiple
      ? Array.isArray(currentValue) && currentValue.length > 0
      : currentValue !== ''

    // 过滤选项
    const filteredOptions = options.filter(option => {
      if (searchQuery && !option.label.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      return true
    })

    // 分组选项
    const groupedOptions = groupBy
      ? filteredOptions.reduce((acc, option) => {
          const group = option.group || '其他'
          if (!acc[group]) acc[group] = []
          acc[group].push(option)
          return acc
        }, {} as Record<string, SelectOption[]>)
      : { '默认': filteredOptions }

    // 处理清除
    const handleClear = () => {
      if (onChange) {
        const event = {
          target: { value: multiple ? [] : '' },
        } as React.ChangeEvent<HTMLSelectElement>
        onChange(event)
      }
      onClear?.()
      setSearchQuery('')
    }

    // 处理搜索
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value
      setSearchQuery(query)
      onSearch?.(query)
    }

    // 获取主题样式
    const getSelectThemeStyle = (): React.CSSProperties => {
      if (variant === 'neon') {
        return {
          boxShadow: `0 0 10px ${themeConfig.glow}`,
          borderColor: (themeConfig.colors?.[400] as unknown as string) || '#38bdf8',
        }
      }
      return {}
    }

    // 自定义下拉箭头
    const dropdownIcon = (
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform duration-200',
          disabled ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
        )} />
      </div>
    )

    return (
      <div className={cn('w-full', className)}>
        {/* 标签 */}
        {label && (
          <motion.label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}

        <div className="relative">
          {/* 主选择框 */}
          <div className="relative">
            {/* 搜索输入框（可搜索模式） */}
            {searchable && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
            )}

            {/* 原生select元素（用于保持可访问性和表单功能） */}
            <select
              ref={ref}
              id={selectId}
              value={currentValue}
              onChange={onChange}
              disabled={disabled}
              multiple={multiple || false}
              className={cn(
                selectVariants({
                  variant,
                  size,
                  status: effectiveStatus as any,
                  searchable,
                  multiple,
                }),
                // 主题相关的额外样式
                'text-gray-900 dark:text-gray-100',
                variant === 'neon' && 'text-cyan-400',
                // 可搜索时的额外样式
                searchable && 'pl-10',
                // 多选时不显示原生选项
                multiple && 'opacity-0 absolute inset-0 z-20 cursor-pointer'
              )}
              style={getSelectThemeStyle()}
              {...props}
            >
              {placeholder && !multiple && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>

            {/* 多选标签显示 */}
            {multiple && hasValue && (
              <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                <MultiSelectTags
                  values={currentValue as (string | number)[]}
                  options={options}
                  onRemove={(val) => {
                    const newValues = (currentValue as (string | number)[]).filter(v => v !== val)
                    const event = {
                      target: { value: newValues },
                    } as unknown as React.ChangeEvent<HTMLSelectElement>
                    onChange?.(event)
                  }}
                  disabled={disabled}
                />
              </div>
            )}

            {/* 单选占位符显示 */}
            {!multiple && !hasValue && placeholder && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                {placeholder}
              </div>
            )}

            {/* 清除按钮 */}
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* 下拉箭头 */}
            {dropdownIcon}
          </div>
        </div>

        {/* 错误信息 */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="mt-1 text-sm text-red-600 dark:text-red-400"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* 帮助信息 */}
        {!error && helperText && (
          <motion.p
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {helperText}
          </motion.p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'