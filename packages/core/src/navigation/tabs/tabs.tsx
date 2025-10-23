/**
 * Tabs 标签页组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 导航组件 - 标签页切换和内容管理
 */

'use client'

import React, { useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const tabsVariants = cva(
  // 基础样式
  "w-full",
  {
    variants: {
      variant: {
        default: "",
        underline: "border-b border-border-base-base",
        pills: "",
        card: "bg-background-primary-primary rounded-lg border border-border-base-base p-1",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
      orientation: {
        horizontal: "flex-col",
        vertical: "flex-row",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        stretch: "justify-stretch",
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      orientation: 'horizontal',
      justify: 'start',
    },
  }
)

const tabListVariants = cva(
  "flex",
  {
    variants: {
      orientation: {
        horizontal: "flex-row space-x-1",
        vertical: "flex-col space-y-1",
      },
      variant: {
        default: "border-b border-border-base-base",
        underline: "border-b border-border-base-base",
        pills: "bg-background-primary-secondary rounded-lg p-1",
        card: "",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        stretch: "justify-stretch",
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'default',
      justify: 'start',
    },
  }
)

const tabTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[active]:bg-background-primary data-[active]:text-text-primary data-[active]:shadow-sm",
        underline: "border-b-2 border-transparent data-[active]:border-primary data-[active]:text-text-primary",
        pills: "data-[active]:bg-background-primary data-[active]:shadow-sm",
        card: "data-[active]:bg-background-primary data-[active]:shadow-sm",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// =============================================================================
// 组件 Props 接口
// =============================================================================

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tabsVariants> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tabListVariants> {
  children: React.ReactNode
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof tabTriggerVariants> {
  value: string
  disabled?: boolean
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  forceMount?: boolean
}

// =============================================================================
// Context
// =============================================================================

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
  variant: TabsProps['variant']
  size: TabsProps['size']
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

// =============================================================================
// Tabs 主组件实现
// =============================================================================

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, value, onValueChange, variant, size, orientation, justify, className, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '')

    const currentValue = value !== undefined ? value : internalValue
    const handleValueChange = React.useCallback((newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }, [value, onValueChange])

    const contextValue: TabsContextValue = React.useMemo(() => ({
      value: currentValue,
      onValueChange: handleValueChange,
      variant,
      size,
    }), [currentValue, handleValueChange, variant, size])

    const { theme } = useTheme()

    return (
      <TabsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(tabsVariants({ variant, size, orientation, justify }), className)}
          style={{
            '--tabs-border': `hsl(${theme.colors.border.primary})`,
            '--tabs-background': `hsl(${theme.colors.background})`,
            '--tabs-foreground': `hsl(${theme.colors.foreground})`,
            '--tabs-primary': `hsl(${theme.colors.primary})`,
          }}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)

// =============================================================================
// TabsList 组件
// =============================================================================

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ orientation, variant, justify, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(tabListVariants({ orientation, variant, justify }), className)}
        role="tablist"
        {...props}
      >
        {children}
      </div>
    )
  }
)

// =============================================================================
// TabsTrigger 组件
// =============================================================================

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, disabled, variant, size, className, children, ...props }, ref) => {
    const { value: currentValue, onValueChange } = useTabsContext()
    const isActive = currentValue === value

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? 'active' : 'inactive'}
        data-active={isActive}
        disabled={disabled}
        className={cn(tabTriggerVariants({ variant, size }), className)}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

// =============================================================================
// TabsContent 组件
// =============================================================================

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, forceMount, className, children, ...props }, ref) => {
    const { value: currentValue } = useTabsContext()
    const isActive = currentValue === value

    if (!forceMount && !isActive) {
      return null
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        aria-labelledby={value}
        data-state={isActive ? 'active' : 'inactive'}
        hidden={!isActive}
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          !isActive && "hidden",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

// =============================================================================
// 组件元数据
// =============================================================================

Tabs.displayName = 'Tabs'
TabsList.displayName = 'TabsList'
TabsTrigger.displayName = 'TabsTrigger'
TabsContent.displayName = 'TabsContent'

// =============================================================================
// 导出
// =============================================================================

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsVariants, tabListVariants, tabTriggerVariants }
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps }