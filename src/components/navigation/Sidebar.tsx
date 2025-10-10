import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface SidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  active?: boolean
  badge?: string | number
  children?: SidebarItem[]
}

export interface SidebarProps {
  items: SidebarItem[]
  collapsed?: boolean
  logo?: React.ReactNode
  logoText?: string
  footer?: React.ReactNode
  onItemClick?: (item: SidebarItem) => void
  onCollapsedChange?: (collapsed: boolean) => void
  className?: string
  width?: string
  collapsedWidth?: string
}

/**
 * Sidebar - 侧边栏导航组件
 * 支持多级菜单、折叠展开、徽章显示等功能
 */
export const Sidebar: React.FC<SidebarProps> = ({
  items,
  collapsed = false,
  logo,
  logoText = 'TH-UI',
  footer,
  onItemClick,
  onCollapsedChange,
  className = '',
  width = '256px',
  collapsedWidth = '64px',
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const renderItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const paddingLeft = collapsed ? '12px' : `${level * 16 + 16}px`

    return (
      <div key={item.id} className="w-full">
        <motion.button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id)
            }
            onItemClick?.(item)
          }}
          className={cn(
            'w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative',
            item.active
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100'
          )}
          style={{ paddingLeft }}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* 激活指示器 */}
          {item.active && (
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-500 rounded-r-full"
              layoutId="activeIndicator"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}

          {/* 图标 */}
          {item.icon && (
            <span className={cn('shrink-0', !collapsed && 'mr-3')}>
              {item.icon}
            </span>
          )}

          {/* 标签 */}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className="flex-1 text-left truncate"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* 徽章 */}
          {!collapsed && item.badge && (
            <motion.span
              className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              {item.badge}
            </motion.span>
          )}

          {/* 展开/收起图标 */}
          {!collapsed && hasChildren && (
            <motion.svg
              className="w-4 h-4 ml-2 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </motion.svg>
          )}
        </motion.button>

        {/* 子菜单 */}
        <AnimatePresence>
          {!collapsed && hasChildren && isExpanded && (
            <motion.div
              className="mt-1 space-y-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {item.children!.map((child) => renderItem(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <motion.nav
      className={cn(
        'h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col',
        className
      )}
      animate={{ width: collapsed ? collapsedWidth : width }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Logo区域 */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center min-w-0">
          {logo || (
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">TH</span>
            </div>
          )}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className="ml-3 text-lg font-semibold text-gray-900 dark:text-gray-100 truncate"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                {logoText}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* 折叠按钮 */}
        <motion.button
          onClick={() => onCollapsedChange?.(!collapsed)}
          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                collapsed
                  ? 'M13 5l7 7-7 7M5 5l7 7-7 7'
                  : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'
              }
              animate={{ d: collapsed ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7' }}
            />
          </svg>
        </motion.button>
      </div>

      {/* 导航菜单 */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {items.map((item) => renderItem(item))}
        </div>
      </div>

      {/* 底部内容 */}
      {footer && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          {footer}
        </div>
      )}
    </motion.nav>
  )
}

Sidebar.displayName = 'Sidebar'
