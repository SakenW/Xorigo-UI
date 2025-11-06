'use client'
/**
 * Sidenav - 侧边导航组件
 *
 * 提供应用侧边的导航菜单，支持折叠、展开等交互。
 */

import React, { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface SidenavItem {
  /**
   * 项目唯一标识
   */
  id: string

  /**
   * 项目标签
   */
  label: string

  /**
   * 项目图标
   */
  icon?: React.ReactNode

  /**
   * 是否激活
   */
  active?: boolean

  /**
   * 子项目
   */
  children?: SidenavItem[]

  /**
   * 点击处理
   */
  onClick?: () => void
}

export interface SidenavProps {
  /**
   * 导航项
   */
  items: SidenavItem[]

  /**
   * 是否折叠
   */
  collapsed?: boolean

  /**
   * 侧边栏宽度
   */
  width?: number | string

  /**
   * 折叠时的宽度
   */
  collapsedWidth?: number | string

  /**
   * 位置
   */
  position?: 'left' | 'right'

  /**
   * 变体
   */
  variant?: 'default' | 'bordered' | 'filled'

  /**
   * 自定义类名
   */
  className?: string
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * Sidenav 组件
 */
export const Sidenav = forwardRef<HTMLDivElement, SidenavProps>(
  (
    {
      items,
      collapsed = false,
      width = 256,
      collapsedWidth = 64,
      position = 'left',
      variant = 'default',
      className
    },
    ref
  ) => {
    const variantStyles = {
      default: 'bg-[var(--color-surface)]',
      bordered: 'bg-[var(--color-surface)] border-r border-[var(--color-border)]',
      filled: 'bg-[var(--color-primary-50)] border-r border-[var(--color-border)]'
    }

    const currentWidth = collapsed ? collapsedWidth : width

    return (
      <motion.aside
        ref={ref}
        className={cn(
          'flex flex-col h-full',
          variantStyles[variant],
          className
        )}
        style={{ width: currentWidth }}
        initial={false}
        animate={{ width: currentWidth }}
        transition={{ duration: 0.3 }}
      >
        <nav className="flex-1 overflow-y-auto py-4">
          {items.map((item) => (
            <SidenavItem key={item.id} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </motion.aside>
    )
  }
)

Sidenav.displayName = 'Sidenav'

// ============================================================================
// SidenavItem Component
// ============================================================================

interface SidenavItemProps {
  item: SidenavItem
  collapsed: boolean
}

const SidenavItem: React.FC<SidenavItemProps> = ({ item, collapsed }) => {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <div>
      <motion.button
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
          item.active
            ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'
            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]'
        )}
        onClick={item.onClick || (item.children ? () => setExpanded(!expanded) : undefined)}
        whileHover={{ x: 4 }}
      >
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        {!collapsed && <span className="truncate">{item.label}</span>}
      </motion.button>

      <AnimatePresence>
        {item.children && !collapsed && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {item.children.map((child) => (
              <SidenavItem key={child.id} item={child} collapsed={collapsed} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// Export
// ============================================================================

export type { SidenavProps, SidenavItem }
