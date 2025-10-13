'use client'

import React, { forwardRef, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils'
import { Search } from 'lucide-react'

// ========== 类型定义 ==========

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  filter?: (value: string, search: string) => boolean
  label?: string
}

export interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string
  showSearchIcon?: boolean
}

export interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string
}

export interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string
}

export interface CommandItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  value: string
  disabled?: boolean
  onSelect?: (value: string) => void
  selected?: boolean
}

export interface CommandSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CommandShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

// ========== Context 上下文 ==========

interface CommandContextValue {
  search: string
  setSearch: (search: string) => void
  value: string
  setValue: (value: string) => void
  filter: (value: string, search: string) => boolean
  activeIndex: number
  setActiveIndex: (index: number) => void
  itemValues: string[]
  registerItem: (value: string) => void
  unregisterItem: (value: string) => void
  itemRefs: Map<string, React.RefObject<HTMLDivElement>>
  registerItemRef: (value: string, ref: React.RefObject<HTMLDivElement>) => void
}

const CommandContext = React.createContext<CommandContextValue | undefined>(undefined)

const useCommand = () => {
  const context = React.useContext(CommandContext)
  if (!context) {
    throw new Error('Command components must be used within Command')
  }
  return context
}

// ========== 默认过滤函数 ==========

const defaultFilter = (value: string, search: string): boolean => {
  const normalizedValue = value.toLowerCase().trim()
  const normalizedSearch = search.toLowerCase().trim()
  return normalizedValue.includes(normalizedSearch)
}

// ========== Command 主组件 ==========

export const Command = forwardRef<HTMLDivElement, CommandProps>(
  ({ className, value: controlledValue, onValueChange, filter = defaultFilter, children, ...props }, ref) => {
    const [search, setSearch] = useState('')
    const [value, setValue] = useState(controlledValue || '')
    const [activeIndex, setActiveIndex] = useState(-1)
    const [itemValues, setItemValues] = useState<string[]>([])
    const [itemRefs] = useState(new Map<string, React.RefObject<HTMLDivElement>>())
    const commandRef = useRef<HTMLDivElement>(null)

    // 同步受控值
    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue)
      }
    }, [controlledValue])

    // 值变化时通知父组件
    const handleValueChange = (newValue: string) => {
      setValue(newValue)
      onValueChange?.(newValue)
    }

    // 注册和取消注册项
    const registerItem = (itemValue: string) => {
      setItemValues(prev => [...prev, itemValue])
    }

    const unregisterItem = (itemValue: string) => {
      setItemValues(prev => prev.filter(v => v !== itemValue))
    }

    const registerItemRef = (itemValue: string, itemRef: React.RefObject<HTMLDivElement>) => {
      itemRefs.set(itemValue, itemRef)
    }

    // 获取可见的项目列表
    const getVisibleItems = () => {
      return itemValues.filter(itemValue => filter(itemValue, search))
    }

    // 键盘导航
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const visibleItems = getVisibleItems()

        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setActiveIndex(prev => {
            const nextIndex = prev + 1
            return nextIndex >= visibleItems.length ? 0 : nextIndex
          })
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setActiveIndex(prev => {
            const prevIndex = prev - 1
            return prevIndex < 0 ? visibleItems.length - 1 : prevIndex
          })
        } else if (e.key === 'Enter') {
          e.preventDefault()
          const activeItem = visibleItems[activeIndex]
          if (activeItem) {
            setValue(activeItem)
            onValueChange?.(activeItem)
          }
        }
      }

      const element = commandRef.current
      element?.addEventListener('keydown', handleKeyDown)
      return () => element?.removeEventListener('keydown', handleKeyDown)
    }, [activeIndex, search, itemValues, filter, onValueChange])

    // 自动滚动到激活项
    useEffect(() => {
      const visibleItems = getVisibleItems()
      const activeItem = visibleItems[activeIndex]
      if (activeItem) {
        const itemRef = itemRefs.get(activeItem)
        itemRef?.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }, [activeIndex, search, itemValues])

    const contextValue: CommandContextValue = {
      search,
      setSearch,
      value,
      setValue: handleValueChange,
      filter,
      activeIndex,
      setActiveIndex,
      itemValues,
      registerItem,
      unregisterItem,
      itemRefs,
      registerItemRef,
    }

    return (
      <CommandContext.Provider value={contextValue}>
        <div
          ref={(node) => {
            commandRef.current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
          }}
          className={cn(
            'flex h-full w-full flex-col overflow-hidden rounded-lg bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </CommandContext.Provider>
    )
  }
)

Command.displayName = 'Command'

// ========== CommandInput 搜索输入框 ==========

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, containerClassName, showSearchIcon = true, ...props }, ref) => {
    const { search, setSearch, setActiveIndex } = useCommand()

    // 搜索改变时重置激活索引
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
      setActiveIndex(0)
    }

    return (
      <div className={cn('flex items-center border-b border-gray-200 dark:border-gray-700 px-3', containerClassName)}>
        {showSearchIcon && (
          <Search className="mr-2 h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
        )}
        <input
          ref={ref}
          value={search}
          onChange={handleSearchChange}
          autoFocus
          className={cn(
            'flex h-10 w-full rounded-md bg-transparent py-3 text-sm',
            'placeholder:text-gray-500 dark:placeholder:text-gray-400',
            'focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            'text-gray-900 dark:text-gray-100',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

CommandInput.displayName = 'CommandInput'

// ========== CommandList 列表容器 ==========

export const CommandList = forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, maxHeight = '300px', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('overflow-y-auto overflow-x-hidden', className)}
        style={{ maxHeight }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CommandList.displayName = 'CommandList'

// ========== CommandEmpty 空状态 ==========

export const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyProps>(
  ({ className, children = '未找到结果', ...props }, ref) => {
    const { search, itemValues, filter } = useCommand()

    // 计算是否应该显示空状态
    const hasResults = itemValues.some(value => filter(value, search))

    if (hasResults) return null

    return (
      <div
        ref={ref}
        className={cn('py-6 text-center text-sm text-gray-500 dark:text-gray-400', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CommandEmpty.displayName = 'CommandEmpty'

// ========== CommandGroup 分组 ==========

export const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => {
    const { search, filter } = useCommand()

    // 过滤子项
    const filteredChildren = React.Children.toArray(children).filter(child => {
      if (!React.isValidElement(child)) return false
      if (child.type !== CommandItem) return true

      const itemValue = (child.props as CommandItemProps).value
      return filter(itemValue, search)
    })

    // 如果没有匹配项则不渲染分组
    if (filteredChildren.length === 0) return null

    return (
      <div ref={ref} className={cn('overflow-hidden p-1', className)} {...props}>
        {heading && (
          <div className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            {heading}
          </div>
        )}
        <div>{filteredChildren}</div>
      </div>
    )
  }
)

CommandGroup.displayName = 'CommandGroup'

// ========== CommandItem 选项项 ==========

export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, value: itemValue, disabled, onSelect, selected, children, ...props }, ref) => {
    const {
      search,
      value: selectedValue,
      setValue,
      filter,
      registerItem,
      unregisterItem,
      registerItemRef,
      activeIndex,
      itemValues,
    } = useCommand()
    const itemRef = useRef<HTMLDivElement>(null)

    // 注册/取消注册项
    useEffect(() => {
      registerItem(itemValue)
      registerItemRef(itemValue, itemRef)
      return () => unregisterItem(itemValue)
    }, [itemValue])

    // 判断是否匹配搜索
    const isMatch = filter(itemValue, search)
    const isSelected = selected !== undefined ? selected : selectedValue === itemValue

    // 计算是否为激活项
    const visibleItems = itemValues.filter(v => filter(v, search))
    const itemIndex = visibleItems.indexOf(itemValue)
    const isActive = itemIndex === activeIndex

    if (!isMatch) return null

    const handleSelect = () => {
      if (disabled) return
      setValue(itemValue)
      onSelect?.(itemValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleSelect()
      }
    }

    return (
      <div
        ref={(node) => {
          itemRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled}
        data-active={isActive}
        className={cn(
          'relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm',
          'transition-colors duration-150',
          'focus:outline-none',
          isActive && !disabled
            ? 'bg-gray-100 dark:bg-gray-700'
            : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50',
          isSelected && 'bg-blue-500 text-white hover:bg-blue-600',
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CommandItem.displayName = 'CommandItem'

// ========== CommandSeparator 分隔线 ==========

export const CommandSeparator = forwardRef<HTMLDivElement, CommandSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        className={cn('-mx-1 h-px bg-gray-200 dark:bg-gray-700', className)}
        {...props}
      />
    )
  }
)

CommandSeparator.displayName = 'CommandSeparator'

// ========== CommandShortcut 快捷键显示 ==========

export const CommandShortcut = forwardRef<HTMLSpanElement, CommandShortcutProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'ml-auto text-xs tracking-widest text-gray-500 dark:text-gray-400',
          'font-mono',
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

CommandShortcut.displayName = 'CommandShortcut'

// ========== CommandDialog 对话框模式 ==========

export interface CommandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export const CommandDialog: React.FC<CommandDialogProps> = ({ open, onOpenChange, children }) => {
  // 处理 Esc 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, onOpenChange])

  // 处理滚动锁定
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩层 */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpenChange(false)}
          />

          {/* Command 对话框 */}
          <motion.div
            className="fixed inset-0 flex items-start justify-center pt-[20vh] z-[1001] pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="w-full max-w-2xl mx-4 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

CommandDialog.displayName = 'CommandDialog'

// ========== 导出所有组件 ==========

export default Command
