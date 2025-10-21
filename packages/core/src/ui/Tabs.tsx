'use client'

import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react'

// Tabs Context
interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
  orientation: 'horizontal' | 'vertical'
  variant: 'default' | 'underline' | 'pills' | 'neon'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

const useTabs = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

// Tabs 变体配置
const tabsVariants = cva(
  // 基础样式
  'relative',
  {
    variants: {
      orientation: {
        horizontal: '',
        vertical: 'flex',
      },
      variant: {
        default: '',
        underline: '',
        pills: '',
        neon: '',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'default',
      size: 'md',
    },
  }
)

// Tab List 变体配置
const tabListVariants = cva(
  // 基础样式
  'flex',
  {
    variants: {
      orientation: {
        horizontal: 'flex-row border-b border-[var(--border-secondary)]',
        vertical: 'flex-col border-r border-[var(--border-secondary)]',
      },
      variant: {
        default: 'gap-2',
        underline: 'gap-0',
        pills: 'gap-1 bg-[var(--bg-tertiary)] p-1 rounded-lg',
        neon: 'gap-1 bg-black/80 p-1 rounded-lg border border-[var(--border-info)]',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'default',
      size: 'md',
    },
  }
)

// Tab 变体配置
const tabVariants = cva(
  // 基础样式
  'relative flex items-center justify-center whitespace-nowrap transition-all duration-200 cursor-pointer select-none focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      orientation: {
        horizontal: '',
        vertical: '',
      },
      variant: {
        default: 'px-4 py-2 text-sm font-medium rounded-md hover:bg-[var(--bg-tertiary)]',
        underline: 'px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-[var(--border-secondary)]',
        pills: 'px-3 py-1.5 text-sm font-medium rounded-md hover:bg-[var(--bg-quaternary)]',
        neon: 'px-3 py-1.5 text-sm font-medium rounded-md text-[var(--text-info)] hover:bg-[var(--bg-info)]/20 border border-transparent hover:border-[var(--border-info)]/50',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-3 text-base',
      },
      active: {
        true: '',
        false: '',
      },
      disabled: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Default variant + Active
      {
        variant: 'default',
        active: true,
        className: 'bg-[var(--bg-primary-action)] text-[var(--text-inverse)] hover:bg-[var(--bg-primary-action)]/90 focus:ring-[var(--ring-primary-action)]/20',
      },
      // Underline variant + Active
      {
        variant: 'underline',
        active: true,
        className: 'border-[var(--border-primary-action)] text-[var(--text-primary-action)] hover:border-[var(--border-primary-action)]',
      },
      // Pills variant + Active
      {
        variant: 'pills',
        active: true,
        className: 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm',
      },
      // Neon variant + Active
      {
        variant: 'neon',
        active: true,
        className: 'bg-[var(--bg-info)]/20 text-[var(--text-info)] border-[var(--border-info)] shadow-[0_0_10px_var(--glow-info)]',
      },
      // Vertical orientation adjustments
      {
        orientation: 'vertical',
        className: 'justify-start border-b-0 border-r-2 rounded-none rounded-l-md',
      },
      {
        orientation: 'vertical',
        variant: 'underline',
        className: 'border-b-0 border-r-2 border-r-transparent hover:border-r-[var(--border-secondary)]',
      },
      {
        orientation: 'vertical',
        variant: 'underline',
        active: true,
        className: 'border-r-[var(--border-primary-action)]',
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'default',
      size: 'md',
      active: false,
      disabled: false,
    },
  }
)

// Tab Panel 变体配置
const tabPanelVariants = cva(
  // 基础样式
  'focus:outline-hidden',
  {
    variants: {
      orientation: {
        horizontal: '',
        vertical: 'flex-1',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
)

// Tabs Props
export interface TabsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsVariants> {
  /** 当前激活的标签值 */
  value: string
  /** 标签切换回调 */
  onValueChange: (value: string) => void
  /** 标签方向 */
  orientation?: 'horizontal' | 'vertical'
  /** 标签样式变体 */
  variant?: 'default' | 'underline' | 'pills' | 'neon'
  /** 标签尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可添加标签 */
  allowAdd?: boolean
  /** 添加标签回调 */
  onAdd?: () => void
  /** 是否可关闭标签 */
  allowClose?: boolean
  /** 关闭标签回调 */
  onClose?: (value: string) => void
  /** 子元素 */
  children: React.ReactNode
}

// Tab List Props
export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 子元素 */
  children: React.ReactNode
  /** 是否可滚动 */
  scrollable?: boolean
  /** 自定义类名 */
  className?: string
}

// Tab Props
export interface TabProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onClick'> {
  /** 标签值 */
  value: string
  /** 标签内容 */
  children: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 徽章内容 */
  badge?: React.ReactNode
  /** 是否可关闭 */
  closable?: boolean
  /** 关闭回调 */
  onClose?: (value: string) => void
  /** 自定义类名 */
  className?: string
}

// Tab Panel Props
export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 标签值 */
  value: string
  /** 面板内容 */
  children: React.ReactNode
  /** 强制渲染（用于懒加载） */
  forceMount?: boolean
  /** 自定义类名 */
  className?: string
}

// Tabs Component
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({
  value,
  onValueChange,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  disabled = false,
  allowAdd = false,
  onAdd,
  allowClose = false,
  onClose,
  children,
  className,
  ...props
}, ref) => {
  return (
    <TabsContext.Provider
      value={{
        value,
        onValueChange,
        orientation,
        variant,
        size,
        disabled,
      }}
    >
      <div
        ref={ref}
        className={cn(
          tabsVariants({ orientation, variant, size }),
          orientation === 'vertical' ? 'flex' : '',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
})

Tabs.displayName = 'Tabs'

// TabList Component
export const TabList = React.forwardRef<HTMLDivElement, TabListProps>(({
  children,
  scrollable = false,
  className,
  ...props
}, ref) => {
  const { orientation, variant, size } = useTabs()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // 检查滚动状态
  const checkScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    )
  }

  // 滚动控制
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 200
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    if (scrollable) {
      const container = scrollContainerRef.current
      if (container) {
        container.addEventListener('scroll', checkScroll)
        checkScroll()
        return () => container.removeEventListener('scroll', checkScroll)
      }
    }
  }, [scrollable])

  const tabListContent = (
    <div
      ref={ref}
      className={cn(
        tabListVariants({ orientation, variant, size }),
        scrollable && 'relative',
        className
      )}
      role="tablist"
      aria-orientation={orientation}
      {...props}
    >
      {scrollable && orientation === 'horizontal' && (
        <>
          {/* 左侧滚动按钮 */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-md shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* 滚动容器 */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex items-center gap-2">
              {children}
            </div>
          </div>

          {/* 右侧滚动按钮 */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-md shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </>
      )}

      {!scrollable && children}
    </div>
  )

  return tabListContent
})

TabList.displayName = 'TabList'

// Tab Component
export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(({
  value,
  children,
  disabled: disabledProp = false,
  icon,
  badge,
  closable: closableProp = false,
  onClose,
  className,
  ...props
}, ref) => {
  const { value: activeValue, onValueChange, orientation, variant, size, disabled: groupDisabled } = useTabs()
  const isActive = value === activeValue
  const isDisabled = disabledProp || groupDisabled

  const handleClick = () => {
    if (!isDisabled) {
      onValueChange(value)
    }
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose?.(value)
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(
        tabVariants({
          orientation,
          variant,
          size,
          active: isActive,
          disabled: isDisabled,
        }),
        'group',
        className
      )}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {/* 图标 */}
      {icon && (
        <span className="mr-2 flex-shrink-0">
          {icon}
        </span>
      )}

      {/* 标签文本 */}
      <span className="flex-1 min-w-0 text-left">
        {children}
      </span>

      {/* 徽章 */}
      {badge && (
        <span className="ml-2 flex-shrink-0">
          {badge}
        </span>
      )}

      {/* 关闭按钮 */}
      {closableProp && (
        <button
          type="button"
          onClick={handleClose}
          className="ml-1 p-0.5 rounded hover:bg-[var(--bg-tertiary)] opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* 活跃指示器（underline variant） */}
      {variant === 'underline' && isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--bg-primary-action)]"
          layoutId="activeTab"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  )
})

Tab.displayName = 'Tab'

// TabPanel Component
export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(({
  value,
  children,
  forceMount = false,
  className,
  ...props
}, ref) => {
  const { value: activeValue, orientation } = useTabs()
  const isActive = value === activeValue

  if (!forceMount && !isActive) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      {(forceMount || isActive) && (
        <motion.div
          ref={ref}
          role="tabpanel"
          aria-labelledby={`tab-${value}`}
          hidden={!isActive}
          className={cn(
            tabPanelVariants({ orientation }),
            className
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
})

TabPanel.displayName = 'TabPanel'

// Add Tab Button (for dynamic tabs)
export interface AddTabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 点击回调 */
  onAdd?: () => void
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 变体 */
  variant?: 'default' | 'underline' | 'pills' | 'neon'
}

export const AddTabButton: React.FC<AddTabButtonProps> = ({
  onAdd,
  size = 'md',
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <motion.button
      type="button"
      onClick={onAdd}
      className={cn(
        'flex items-center justify-center border-2 border-dashed border-[var(--border-secondary)] rounded-md text-[var(--text-secondary)] hover:border-[var(--border-primary-action)] hover:text-[var(--text-primary-action)] transition-colors',
        size === 'sm' && 'p-1.5 text-xs',
        size === 'md' && 'p-2 text-sm',
        size === 'lg' && 'p-3 text-base',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <Plus className="w-4 h-4" />
    </motion.button>
  )
}

AddTabButton.displayName = 'AddTabButton'

export default {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  AddTabButton,
}