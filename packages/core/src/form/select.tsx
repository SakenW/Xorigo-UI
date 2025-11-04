import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'
import { ChevronDown, X, Search, Check } from 'lucide-react'

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
  renderOption?: (option: SelectOption, index: number, isSelected: boolean) => React.ReactNode
  renderGroupHeader?: (group: string) => React.ReactNode
  renderValue?: (selectedOptions: SelectOption[]) => React.ReactNode
  renderEmpty?: (query: string) => React.ReactNode
  renderLoading?: () => React.ReactNode
  onSearch?: (query: string) => void
  onClear?: () => void
  onOpen?: () => void
  onClose?: () => void
  dropdownPosition?: 'bottom' | 'top' | 'auto'
  closeOnSelect?: boolean
  virtualScrolling?: boolean
  filterOption?: (option: SelectOption, query: string) => boolean
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

// 自定义下拉选项组件
const DropdownOption: React.FC<{
  option: SelectOption
  isSelected: boolean
  isHighlighted: boolean
  onClick: () => void
  renderOption?: (option: SelectOption, index: number, isSelected: boolean) => React.ReactNode
}> = ({ option, isSelected, isHighlighted, onClick, renderOption }) => {
  return (
    <motion.div
      className={cn(
        'px-3 py-2 cursor-pointer transition-colors flex items-center justify-between',
        'hover:bg-gray-100 dark:hover:bg-gray-700',
        isHighlighted && 'bg-gray-100 dark:bg-gray-700',
        isSelected && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        option.disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={() => !option.disabled && onClick()}
      whileTap={{ scale: 0.98 }}
    >
      {renderOption ? (
        renderOption(option, 0, isSelected)
      ) : (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
          <div className="flex-1 min-w-0">
            <div className="truncate">{option.label}</div>
            {option.description && (
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {option.description}
              </div>
            )}
          </div>
        </div>
      )}
      {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
    </motion.div>
  )
}

// 自定义下拉组件
const CustomDropdown: React.FC<{
  isOpen: boolean
  options: SelectOption[]
  groupedOptions: Record<string, SelectOption[]>
  selectedValue: string | number | (string | number)[]
  onSelect: (value: string | number) => void
  onClose: () => void
  renderOption?: (option: SelectOption, index: number, isSelected: boolean) => React.ReactNode
  renderGroupHeader?: (group: string) => React.ReactNode
  renderEmpty?: (query: string) => React.ReactNode
  renderLoading?: () => React.ReactNode
  loading?: boolean
  searchQuery?: string
  multiple?: boolean
  maxVisibleItems?: number
  dropdownRef?: React.RefObject<HTMLDivElement>
}> = ({
  isOpen,
  options,
  groupedOptions,
  selectedValue,
  onSelect,
  onClose,
  renderOption,
  renderGroupHeader,
  renderEmpty,
  renderLoading,
  loading,
  searchQuery,
  multiple,
  maxVisibleItems = 8,
  dropdownRef
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const isSelected = useCallback((value: string | number) => {
    if (multiple && Array.isArray(selectedValue)) {
      return selectedValue.includes(value)
    }
    return selectedValue === value
  }, [selectedValue, multiple])

  const handleSelect = useCallback((value: string | number) => {
    onSelect(value)
  }, [onSelect])

  // 键盘导航
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightedIndex(prev => Math.min(prev + 1, options.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (highlightedIndex >= 0 && options[highlightedIndex]) {
            handleSelect(options[highlightedIndex].value)
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, highlightedIndex, options, handleSelect, onClose])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          'absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        )}
      >
        {loading ? (
          <div className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
            {renderLoading ? renderLoading() : '加载中...'}
          </div>
        ) : options.length === 0 ? (
          <div className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
            {renderEmpty ? renderEmpty(searchQuery || '') : '没有找到选项'}
          </div>
        ) : (
          <div>
            {Object.entries(groupedOptions).map(([group, groupOptions]) => (
              <div key={group}>
                {Object.keys(groupedOptions).length > 1 && (
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
                    {renderGroupHeader ? renderGroupHeader(group) : group}
                  </div>
                )}
                {groupOptions.slice(0, maxVisibleItems).map((option, index) => (
                  <DropdownOption
                    key={option.value}
                    option={option}
                    isSelected={isSelected(option.value)}
                    isHighlighted={highlightedIndex === options.indexOf(option)}
                    onClick={() => handleSelect(option.value)}
                    renderOption={renderOption}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
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
      renderValue,
      renderEmpty,
      renderLoading,
      onSearch,
      onClear,
      onOpen,
      onClose,
      dropdownPosition = 'bottom',
      closeOnSelect = true,
      virtualScrolling = false,
      filterOption,
      value,
      onChange,
      multiple = false,
      ...props
    },
    ref
  ) => {
    const { themeConfig } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [dropdownPositionState, setDropdownPositionState] = useState<'bottom' | 'top'>('bottom')
    const selectRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const selectId = id || `select-${React.useId()}`

    // 处理状态
    const effectiveStatus = status || (error ? 'error' : 'default')
    const currentValue = value || (multiple ? [] : '')
    const hasValue = multiple
      ? Array.isArray(currentValue) && currentValue.length > 0
      : currentValue !== ''

    // 获取选中的选项
    const getSelectedOptions = useCallback(() => {
      if (multiple && Array.isArray(currentValue)) {
        return options.filter(opt => currentValue.includes(opt.value))
      } else if (currentValue) {
        return options.filter(opt => opt.value === currentValue)
      }
      return []
    }, [currentValue, multiple, options])

    // 自定义过滤
    const filteredOptions = options.filter(option => {
      if (filterOption) {
        return filterOption(option, searchQuery)
      }
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

    // 计算下拉框位置
    useEffect(() => {
      if (isOpen && selectRef.current && dropdownPosition === 'auto') {
        const rect = selectRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const spaceAbove = rect.top
        setDropdownPositionState(spaceBelow >= 200 || spaceBelow > spaceAbove ? 'bottom' : 'top')
      }
    }, [isOpen, dropdownPosition])

    // 点击外部关闭
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

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

    // 处理选择
    const handleSelect = (selectedValue: string | number) => {
      if (onChange) {
        let newValue: string | number | (string | number)[]

        if (multiple) {
          const currentValues = Array.isArray(currentValue) ? currentValue : []
          if (currentValues.includes(selectedValue)) {
            newValue = currentValues.filter(v => v !== selectedValue)
          } else {
            newValue = [...currentValues, selectedValue]
          }
        } else {
          newValue = selectedValue
        }

        const event = {
          target: { value: newValue },
        } as React.ChangeEvent<HTMLSelectElement>
        onChange(event)
      }

      if (closeOnSelect && !multiple) {
        setIsOpen(false)
      }
    }

    // 处理打开/关闭
    const handleToggle = () => {
      if (disabled) return

      if (isOpen) {
        setIsOpen(false)
        onClose?.()
      } else {
        setIsOpen(true)
        onOpen?.()
        if (searchable && searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }
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

    const selectedOptions = getSelectedOptions()

    return (
      <div className={cn('w-full', className)} ref={selectRef}>
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
          <div
            ref={ref}
            className={cn(
              selectVariants({
                variant,
                size,
                status: effectiveStatus as any,
                searchable,
                multiple,
              }),
              // 主题相关的额外样式
              'text-gray-900 dark:text-gray-100 cursor-pointer',
              variant === 'neon' && 'text-cyan-400',
              // 可搜索时的额外样式
              searchable && 'pl-10'
            )}
            style={getSelectThemeStyle()}
            onClick={handleToggle}
            {...props}
          >
            {/* 搜索输入框（可搜索模式） */}
            {searchable && isOpen && (
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="搜索..."
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {!searchable && (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            )}

            {/* 显示选中的值 */}
            <div className="flex items-center justify-between min-w-0">
              <div className="flex-1 min-w-0">
                {renderValue && hasValue ? (
                  renderValue(selectedOptions)
                ) : multiple && hasValue ? (
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
                ) : !multiple && hasValue ? (
                  <div className="truncate">
                    {selectedOptions[0]?.label}
                  </div>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 truncate">
                    {placeholder || '请选择...'}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                {/* 清除按钮 */}
                {clearable && hasValue && !disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClear()
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* 下拉箭头 */}
                <ChevronDown className={cn(
                  'w-4 h-4 transition-transform duration-200',
                  isOpen && 'rotate-180',
                  disabled ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                )} />
              </div>
            </div>
          </div>

          {/* 自定义下拉框 */}
          <div className={cn(
            'relative z-50',
            dropdownPositionState === 'top' && 'bottom-full mb-1'
          )}>
            <CustomDropdown
              isOpen={isOpen}
              options={filteredOptions}
              groupedOptions={groupedOptions}
              selectedValue={currentValue}
              onSelect={handleSelect}
              onClose={() => setIsOpen(false)}
              renderOption={renderOption}
              renderGroupHeader={renderGroupHeader}
              renderEmpty={renderEmpty}
              renderLoading={renderLoading}
              loading={loading}
              searchQuery={searchQuery}
              multiple={multiple}
              maxVisibleItems={maxVisibleItems}
              dropdownRef={dropdownRef}
            />
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