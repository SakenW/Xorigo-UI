/**
 * ContextualMenu - 上下文菜单组件
 *
 * 提供基于用户操作上下文的右键菜单或点击菜单。
 */

import React, { forwardRef, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface ContextMenuItem {
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
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 是否显示分隔线
   */
  divider?: boolean

  /**
   * 点击处理
   */
  onClick?: () => void

  /**
   * 子菜单
   */
  children?: ContextMenuItem[]
}

export interface ContextualMenuProps {
  /**
   * 菜单项
   */
  items: ContextMenuItem[]

  /**
   * 菜单是否可见
   */
  open: boolean

  /**
   * 菜单位置
   */
  position: { x: number; y: number }

  /**
   * 关闭回调
   */
  onClose: () => void

  /**
   * 菜单变体
   */
  variant?: 'default' | 'bordered' | 'dark'

  /**
   * 自定义类名
   */
  className?: string
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * ContextualMenu 组件
 */
export const ContextualMenu = forwardRef<HTMLDivElement, ContextualMenuProps>(
  (
    {
      items,
      open,
      position,
      onClose,
      variant = 'default',
      className
    },
    ref
  ) => {
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          onClose()
        }
      }

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }

      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }, [open, onClose])

    const variantStyles = {
      default: 'bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg',
      bordered: 'bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-xl',
      dark: 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)] shadow-xl'
    }

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            className={cn(
              'absolute z-50 min-w-[180px] rounded-md py-1',
              variantStyles[variant],
              className
            )}
            style={{
              left: position.x,
              top: position.y
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            role="menu"
            aria-orientation="vertical"
          >
            {items.map((item) => (
              <ContextMenuItemRenderer key={item.id} item={item} onClose={onClose} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

ContextualMenu.displayName = 'ContextualMenu'

// ============================================================================
// ContextMenuItemRenderer Component
// ============================================================================

interface ContextMenuItemRendererProps {
  item: ContextMenuItem
  onClose: () => void
}

const ContextMenuItemRenderer: React.FC<ContextMenuItemRendererProps> = ({ item, onClose }) => {
  const [submenuOpen, setSubmenuOpen] = React.useState(false)
  const hasChildren = item.children && item.children.length > 0

  if (item.divider) {
    return <div className="my-1 border-t border-[var(--color-border)]" />
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => hasChildren && setSubmenuOpen(true)}
      onMouseLeave={() => hasChildren && setSubmenuOpen(false)}
    >
      <button
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 text-left transition-colors',
          item.disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]'
        )}
        onClick={() => {
          if (!item.disabled) {
            item.onClick?.()
            onClose()
          }
        }}
        disabled={item.disabled}
        role="menuitem"
      >
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <span className="flex-1">{item.label}</span>
        {hasChildren && <span className="text-xs">▶</span>}
      </button>

      <AnimatePresence>
        {hasChildren && submenuOpen && (
          <motion.div
            className="absolute left-full top-0 ml-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md py-1 min-w-[160px] shadow-lg"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            {item.children?.map((child) => (
              <ContextMenuItemRenderer key={child.id} item={child} onClose={onClose} />
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

export type { ContextualMenuProps, ContextMenuItem }

// Hook for using contextual menu
export const useContextualMenu = () => {
  const [open, setOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  const show = (event: React.MouseEvent) => {
    event.preventDefault()
    setPosition({ x: event.clientX, y: event.clientY })
    setOpen(true)
  }

  const hide = () => setOpen(false)

  return {
    open,
    position,
    show,
    hide,
    ContextualMenu: (props: Omit<ContextualMenuProps, 'open' | 'position' | 'onClose'>) => (
      <ContextualMenu
        {...props}
        open={open}
        position={position}
        onClose={hide}
      />
    )
  }
}
