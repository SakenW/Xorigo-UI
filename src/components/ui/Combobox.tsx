import React, { forwardRef, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from './Command'

// ========== 类型定义 ==========

export interface ComboboxOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  group?: string
}

export interface ComboboxProps<T = string> {
  value?: T
  defaultValue?: T
  onValueChange?: (value: T) => void
  options: ComboboxOption<T>[]
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  popoverClassName?: string
  searchable?: boolean
  clearable?: boolean
  label?: string
  error?: string
  helperText?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined' | 'underlined'
}

// ========== Combobox 组件 ==========

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      options,
      placeholder = '请选择...',
      searchPlaceholder = '搜索...',
      emptyText = '未找到结果',
      disabled = false,
      className,
      popoverClassName,
      searchable = true,
      clearable = false,
      label,
      error,
      helperText,
      size = 'md',
      variant = 'default',
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<string>(controlledValue?.toString() || defaultValue?.toString() || '')
    const triggerRef = useRef<HTMLButtonElement>(null)
    const popoverRef = useRef<HTMLDivElement>(null)

    // 同步受控值
    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue.toString())
      }
    }, [controlledValue])

    // 点击外部关闭
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          popoverRef.current &&
          !popoverRef.current.contains(event.target as Node)
        ) {
          setOpen(false)
        }
      }

      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [open])

    // 键盘导航
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && open) {
          setOpen(false)
          triggerRef.current?.focus()
        }
      }

      if (open) {
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
      }
    }, [open])

    // 获取选中项标签
    const getSelectedLabel = () => {
      const selected = options.find(opt => opt.value.toString() === value)
      return selected?.label || placeholder
    }

    // 处理选择
    const handleSelect = (selectedValue: string) => {
      console.log('Combobox: 选择项', selectedValue)
      setValue(selectedValue)

      // 查找原始值类型
      const option = options.find(opt => opt.value.toString() === selectedValue)
      if (option) {
        onValueChange?.(option.value)
      }

      setOpen(false)
      triggerRef.current?.focus()
    }

    // 清除选择
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      console.log('Combobox: 清除选择')
      setValue('')
      onValueChange?.('' as any)
    }

    // 按分组整理选项
    const groupedOptions = options.reduce((acc, option) => {
      const group = option.group || 'default'
      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push(option)
      return acc
    }, {} as Record<string, ComboboxOption[]>)

    // 尺寸类
    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-5 text-base',
    }

    // 变体类
    const variantClasses = {
      default: cn(
        'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
        'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
      ),
      filled: cn(
        'border-0 bg-gray-100 dark:bg-gray-900',
        'focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20',
        error ? 'bg-red-50 dark:bg-red-950/20' : ''
      ),
      outlined: cn(
        'border-2 border-gray-300 dark:border-gray-600 bg-transparent',
        'focus:border-blue-500',
        error ? 'border-red-500' : ''
      ),
      underlined: cn(
        'border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent rounded-none px-0',
        'focus:border-blue-500',
        error ? 'border-red-500' : ''
      ),
    }

    return (
      <div ref={ref} className={cn('w-full', className)}>
        {/* 标签 */}
        {label && (
          <motion.label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {label}
          </motion.label>
        )}

        {/* 触发按钮 */}
        <div className="relative">
          <motion.button
            ref={triggerRef}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            disabled={disabled}
            onClick={() => !disabled && setOpen(!open)}
            className={cn(
              'w-full flex items-center justify-between rounded-lg',
              'transition-all duration-200',
              'text-gray-900 dark:text-gray-100',
              'disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50',
              'focus:outline-none',
              sizeClasses[size],
              variantClasses[variant],
              open && 'ring-2 ring-blue-500/20 border-blue-500'
            )}
            whileHover={!disabled ? { scale: 1.01 } : undefined}
            whileTap={!disabled ? { scale: 0.99 } : undefined}
          >
            <span
              className={cn(
                'truncate',
                !value && 'text-gray-500 dark:text-gray-400'
              )}
            >
              {getSelectedLabel()}
            </span>

            <div className="flex items-center gap-1 ml-2">
              {/* 清除按钮 */}
              {clearable && value && !disabled && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </motion.div>
              )}

              {/* 箭头图标 */}
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronsUpDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </motion.div>
            </div>
          </motion.button>

          {/* 下拉菜单 */}
          <AnimatePresence>
            {open && (
              <motion.div
                ref={popoverRef}
                className={cn(
                  'absolute z-50 w-full mt-1 rounded-lg shadow-lg',
                  'border border-gray-200 dark:border-gray-700',
                  popoverClassName
                )}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <Command>
                  {searchable && (
                    <CommandInput
                      placeholder={searchPlaceholder}
                      autoFocus
                    />
                  )}
                  <CommandList>
                    <CommandEmpty>{emptyText}</CommandEmpty>

                    {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                      <CommandGroup
                        key={groupName}
                        heading={groupName !== 'default' ? groupName : undefined}
                      >
                        {groupOptions.map(option => (
                          <CommandItem
                            key={option.value.toString()}
                            value={option.value.toString()}
                            disabled={option.disabled}
                            onSelect={handleSelect}
                            selected={value === option.value.toString()}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{option.label}</span>
                              {value === option.value.toString() && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                >
                                  <Check className="h-4 w-4" />
                                </motion.div>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </motion.div>
            )}
          </AnimatePresence>
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

Combobox.displayName = 'Combobox'

export default Combobox
