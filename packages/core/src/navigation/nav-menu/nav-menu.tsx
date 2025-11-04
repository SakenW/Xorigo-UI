/**
 * NavMenu - 导航菜单组件
 *
 * 提供应用的导航菜单，支持多级菜单、图标、分组等功能。
 */

import React, { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface NavMenuItem {
  /**
   * 项目唯一标识
   */
  id: string

  /**
   * 项目标签
   */
  label: string

  /**
   * 项目链接
   */
  href?: string

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
  children?: NavMenuItem[]

  /**
   * 禁用状态
   */
  disabled?: boolean

  /**
   * 是否显示徽章
   */
  badge?: React.ReactNode
}

export interface NavMenuProps {
  /**
   * 菜单项
   */
  items: NavMenuItem[]

  /**
   * 菜单方向
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * 菜单变体
   */
  variant?: 'default' | 'bordered' | 'pilled'

  /**
   * 菜单大小
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * 是否可折叠（垂直模式）
   */
  collapsible?: boolean

  /**
   * 自定义类名
   */
  className?: string
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * NavMenu 组件
 */
export const NavMenu = forwardRef<HTMLElement, NavMenuProps>(
  (
    {
      items,
      orientation = 'horizontal',
      variant = 'default',
      size = 'md',
      collapsible = false,
      className
    },
    ref
  ) => {
    const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

    const toggleExpanded = (itemId: string) => {
      setExpandedItems((prev) => {
        const next = new Set(prev)
        if (next.has(itemId)) {
          next.delete(itemId)
        } else {
          next.add(itemId)
        }
        return next
      })
    }

    const sizeStyles = {
      sm: orientation === 'horizontal' ? 'h-8' : 'py-1',
      md: orientation === 'horizontal' ? 'h-10' : 'py-2',
      lg: orientation === 'horizontal' ? 'h-12' : 'py-3'
    }

    const variantStyles = {
      default: '',
      bordered: orientation === 'vertical' ? 'border border-[var(--color-border)] rounded-md' : '',
      pilled: orientation === 'vertical' ? 'rounded-md' : 'rounded-full'
    }

    return (
      <nav
        ref={ref as any}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row gap-1' : 'flex-col',
          className
        )}
      >
        {items.map((item) => (
          <NavMenuItem
            key={item.id}
            item={item}
            orientation={orientation}
            variant={variant}
            size={size}
            sizeStyles={sizeStyles}
            variantStyles={variantStyles}
            collapsible={collapsible}
            expanded={expandedItems.has(item.id)}
            onToggleExpanded={toggleExpanded}
          />
        ))}
      </nav>
    )
  }
)

NavMenu.displayName = 'NavMenu'

// ============================================================================
// NavMenuItem Component
// ============================================================================

interface NavMenuItemProps {
  item: NavMenuItem
  orientation: 'horizontal' | 'vertical'
  variant: 'default' | 'bordered' | 'pilled'
  size: 'sm' | 'md' | 'lg'
  sizeStyles: Record<string, string>
  variantStyles: Record<string, string>
  collapsible: boolean
  expanded: boolean
  onToggleExpanded: (id: string) => void
}

const NavMenuItem: React.FC<NavMenuItemProps> = ({
  item,
  orientation,
  variant,
  size,
  sizeStyles,
  variantStyles,
  collapsible,
  expanded,
  onToggleExpanded
}) => {
  const hasChildren = item.children && item.children.length > 0

  return (
    <div>
      <motion.a
        href={item.href}
        className={cn(
          'flex items-center gap-2 transition-colors',
          orientation === 'horizontal' ? 'px-4' : 'px-3',
          sizeStyles[size],
          variantStyles[variant],
          item.active
            ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'
            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]',
          item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
        )}
        onClick={(e) => {
          if (!item.href) e.preventDefault()
          if (hasChildren && collapsible) {
            e.preventDefault()
            onToggleExpanded(item.id)
          }
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <span className="truncate">{item.label}</span>
        {item.badge && <span className="ml-auto">{item.badge}</span>}
        {hasChildren && collapsible && (
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-auto"
          >
            ▶
          </motion.span>
        )}
      </motion.a>

      <AnimatePresence>
        {hasChildren && collapsible && expanded && orientation === 'vertical' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden ml-4"
          >
            {item.children?.map((child) => (
              <NavMenuItem
                key={child.id}
                item={child}
                orientation={orientation}
                variant={variant}
                size={size}
                sizeStyles={sizeStyles}
                variantStyles={variantStyles}
                collapsible={collapsible}
                expanded={false}
                onToggleExpanded={onToggleExpanded}
              />
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

export type { NavMenuProps, NavMenuItem }
