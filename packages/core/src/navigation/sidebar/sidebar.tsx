/**
 * Sidebar 侧边栏组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 可折叠的侧边栏导航组件，支持多层嵌套导航结构
 */

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'
import { createThemeStyles } from '../../utils/theme-token-mapper'

// === Sidebar 变体系统 ===
const sidebarVariants = cva(
  "flex flex-col bg-[var(--xor-bg-primary)] border-r border-[var(--xor-border-primary)] transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-[var(--xor-bg-primary)] text-[var(--xor-text-primary)]",
        inverse: "bg-[var(--xor-bg-inverse)] text-[var(--xor-text-on-inverse)]",
        glass: "bg-[var(--xor-bg-glass)] backdrop-blur-md border-[var(--xor-border-glass)]",
        minimal: "bg-transparent border-transparent"
      },
      size: {
        sm: "w-48",
        md: "w-64",
        lg: "w-80",
        xl: "w-96"
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

// === SidebarItem 类型定义 ===
export interface SidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string
  active?: boolean
  disabled?: boolean
  children?: SidebarItem[]
  onClick?: () => void
}

// === Sidebar Props 接口 ===
export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  /** 导航项列表 */
  items: SidebarItem[]
  /** 是否折叠 */
  collapsed?: boolean
  /** 折叠状态变化回调 */
  onCollapsedChange?: (collapsed: boolean) => void
  /** Logo 图标 */
  logo?: React.ReactNode
  /** Logo 文字 */
  logoText?: string
  /** 底部内容 */
  footer?: React.ReactNode
  /** 项目点击回调 */
  onItemClick?: (item: SidebarItem) => void
  /** 侧边栏宽度 */
  width?: string
  /** 折叠时的宽度 */
  collapsedWidth?: string
}

// === SidebarItem 组件 ===
interface SidebarItemComponentProps {
  item: SidebarItem
  level: number
  collapsed: boolean
  onItemClick?: (item: SidebarItem) => void
}

const SidebarItemComponent: React.FC<SidebarItemComponentProps> = ({
  item,
  level,
  collapsed,
  onItemClick
}) => {
  const [isExpanded, setIsExpanded] = useState(item.active || false)
  const hasChildren = item.children && item.children.length > 0

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
    onItemClick?.(item)
    item.onClick?.()
  }

  const itemStyles = cn(
    "flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 cursor-pointer",
    "hover:bg-[var(--xor-bg-secondary-500)] active:bg-[var(--xor-bg-tertiary)]",
    item.active && "bg-[var(--xor-bg-secondary-500)] text-[var(--xor-text-primary)] font-medium",
    item.disabled && "opacity-50 cursor-not-allowed",
    `pl-${3 + level * 4}`
  )

  return (
    <div className="w-full">
      <div className={itemStyles} onClick={handleClick}>
        {item.icon && (
          <span className="mr-3 flex-shrink-0 text-lg">
            {item.icon}
          </span>
        )}

        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-[var(--xor-primary)] text-[var(--xor-text-on-primary)] rounded-full">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <motion.svg
                className="ml-2 w-4 h-4 transition-transform duration-200"
                animate={{ rotate: isExpanded ? 90 : 0 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            )}
          </>
        )}
      </div>

      {hasChildren && !collapsed && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1">
                {item.children!.map((child) => (
                  <SidebarItemComponent
                    key={child.id}
                    item={child}
                    level={level + 1}
                    collapsed={collapsed}
                    onItemClick={onItemClick}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

// === Sidebar 组件实现 ===
export const Sidebar: React.FC<SidebarProps> = ({
  items,
  variant,
  size,
  className,
  collapsed = false,
  onCollapsedChange,
  logo,
  logoText,
  footer,
  onItemClick,
  width = "280px",
  collapsedWidth = "64px",
  ...props
}) => {
  const { theme } = useTheme()
  const themeStyles = createThemeStyles(theme)

  const handleToggleCollapse = () => {
    onCollapsedChange?.(!collapsed)
  }

  const sidebarStyles = cn(
    sidebarVariants({ variant, size, className }),
    collapsed ? "w-16" : ""
  )

  return (
    <div
      className={sidebarStyles}
      style={{
        ...themeStyles,
        width: collapsed ? collapsedWidth : width,
        minWidth: collapsed ? collapsedWidth : width
      }}
      {...props}
    >
      {/* Logo 区域 */}
      {!collapsed && logo && (
        <div className="flex items-center justify-between p-4 border-b border-[var(--xor-border-primary)]">
          <div className="flex items-center space-x-3">
            {logo}
            {logoText && (
              <span className="text-lg font-semibold text-[var(--xor-text-primary)]">
                {logoText}
              </span>
            )}
          </div>
          <button
            onClick={handleToggleCollapse}
            className="p-1 rounded-lg hover:bg-[var(--xor-bg-secondary-500)] transition-colors"
            aria-label="折叠侧边栏"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}

      {collapsed && logo && (
        <div className="flex justify-center p-4 border-b border-[var(--xor-border-primary)]">
          {logo}
        </div>
      )}

      {/* 展开按钮（仅折叠状态显示） */}
      {collapsed && (
        <div className="flex justify-center p-2">
          <button
            onClick={handleToggleCollapse}
            className="p-2 rounded-lg hover:bg-[var(--xor-bg-secondary-500)] transition-colors"
            aria-label="展开侧边栏"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* 导航内容 */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-2 space-y-1">
          {items.map((item) => (
            <SidebarItemComponent
              key={item.id}
              item={item}
              level={0}
              collapsed={collapsed}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      </div>

      {/* 底部区域 */}
      {footer && !collapsed && (
        <div className="p-4 border-t border-[var(--xor-border-primary)]">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Sidebar