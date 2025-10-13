'use client'

import React, { useState, createContext, useContext } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
  variant: 'default' | 'pills' | 'underline'
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

const useTabs = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs')
  }
  return context
}

export interface TabsProps {
  children: React.ReactNode
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  variant?: 'default' | 'pills' | 'underline'
  className?: string
}

export interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export interface TabsTriggerProps {
  children: React.ReactNode
  value: string
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
}

export interface TabsContentProps {
  children: React.ReactNode
  value: string
  className?: string
}

// 定义 Tabs 组件类型，包含子组件
interface TabsComponent extends React.FC<TabsProps> {
  List: typeof TabsList
  Trigger: typeof TabsTrigger
  Content: typeof TabsContent
}

export const Tabs: TabsComponent = ({
  children,
  defaultValue,
  value,
  onValueChange,
  variant = 'default',
  className,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const activeTab = value !== undefined ? value : internalValue

  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab: handleValueChange,
        variant,
      }}
    >
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  const { variant } = useTabs()

  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
    pills: 'gap-2',
    underline: 'border-b border-gray-200 dark:border-gray-700',
  }

  return (
    <div
      className={cn(
        'flex items-center',
        variantClasses[variant],
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  )
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  children,
  value,
  disabled = false,
  className,
  icon,
}) => {
  const { activeTab, setActiveTab, variant } = useTabs()
  const isActive = activeTab === value

  const variantClasses = {
    default: cn(
      'px-4 py-2 rounded-md font-medium transition-all duration-200',
      'hover:bg-white/50 dark:hover:bg-gray-700/50',
      isActive
        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
        : 'text-gray-600 dark:text-gray-400'
    ),
    pills: cn(
      'px-4 py-2 rounded-full font-medium transition-all duration-200',
      'hover:bg-gray-100 dark:hover:bg-gray-800',
      isActive
        ? 'bg-blue-600 text-white shadow-xs'
        : 'text-gray-600 dark:text-gray-400'
    ),
    underline: cn(
      'px-4 py-2 font-medium transition-all duration-200 relative',
      'hover:text-gray-900 dark:hover:text-white',
      isActive
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-600 dark:text-gray-400'
    ),
  }

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      className={cn(
        'relative inline-flex items-center gap-2',
        'focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        className
      )}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
      {variant === 'underline' && isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
          layoutId="activeTab"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  )
}

export const TabsContent: React.FC<TabsContentProps> = ({
  children,
  value,
  className,
}) => {
  const { activeTab } = useTabs()

  if (activeTab !== value) {
    return null
  }

  return (
    <motion.div
      role="tabpanel"
      className={cn('mt-4', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

// 将子组件附加到主组件上
Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent

export default Tabs
