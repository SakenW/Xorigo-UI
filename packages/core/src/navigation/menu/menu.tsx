/**
 * Menu 菜单组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 导航组件 - 下拉菜单和导航菜单
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const menuVariants = cva(
  "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
  {
    variants: {
      variant: {
        default: "border-border bg-popover",
        dropdown: "border-border bg-popover shadow-lg",
        context: "border-border bg-popover shadow-xl",
        navigation: "border-border bg-card",
      },
      size: {
        sm: "min-w-[6rem] p-0.5",
        md: "min-w-[8rem] p-1",
        lg: "min-w-[12rem] p-1.5",
        xl: "min-w-[16rem] p-2",
      },
      position: {
        'top-left': "bottom-full left-0 mb-2",
        'top-right': "bottom-full right-0 mb-2",
        'bottom-left': "top-full left-0 mt-2",
        'bottom-right': "top-full right-0 mt-2",
        'left-top': "right-full top-0 mr-2",
        'left-bottom': "right-full bottom-0 mr-2",
        'right-top': "left-full top-0 ml-2",
        'right-bottom': "left-full bottom-0 ml-2",
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      position: 'bottom-left',
    },
  }
)

const menuItemVariants = cva(
  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
  {
    variants: {
      variant: {
        default: "focus:bg-accent focus:text-accent-foreground",
        destructive: "text-destructive focus:bg-destructive focus:text-destructive-foreground",
        warning: "text-warning focus:bg-warning focus:text-warning-foreground",
        success: "text-success focus:bg-success focus:text-success-foreground",
      },
      active: {
        true: "bg-accent text-accent-foreground",
        false: "",
      },
      disabled: {
        true: "pointer-events-none opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      variant: 'default',
      active: false,
      disabled: false,
    },
  }
)

// =============================================================================
// 组件 Props 接口
// =============================================================================

export interface MenuProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface MenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export interface MenuContentProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof menuVariants> {
  forceMount?: boolean
}

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof menuItemVariants> {
  value?: string
  disabled?: boolean
  inset?: boolean
}

export interface MenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  decorative?: boolean
}

export interface MenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

export interface MenuGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string
}

// =============================================================================
// Context
// =============================================================================

interface MenuContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement>
}

const MenuContext = React.createContext<MenuContextValue | null>(null)

const useMenuContext = () => {
  const context = React.useContext(MenuContext)
  if (!context) {
    throw new Error('Menu components must be used within a Menu provider')
  }
  return context
}

// =============================================================================
// Menu 主组件实现
// =============================================================================

const Menu: React.FC<MenuProps> = ({ children, open, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const isOpen = open !== undefined ? open : internalOpen
  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }, [open, onOpenChange])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        handleOpenChange(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, handleOpenChange])

  // ESC键关闭
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleOpenChange(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleOpenChange])

  const contextValue: MenuContextValue = React.useMemo(() => ({
    open: isOpen,
    onOpenChange: handleOpenChange,
    triggerRef,
  }), [isOpen, handleOpenChange])

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  )
}

// =============================================================================
// MenuTrigger 组件
// =============================================================================

const MenuTrigger = React.forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ asChild = false, children, ...props }, ref) => {
    const { open, onOpenChange, triggerRef } = useMenuContext()
    const internalRef = useRef<HTMLButtonElement>(null)

    // 合并refs
    React.useImperativeHandle(ref, () => internalRef.current!)
    React.useImperativeHandle(triggerRef, () => internalRef.current!)

    const handleClick = () => {
      onOpenChange(!open)
    }

    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        ref: internalRef,
        onClick: handleClick,
        'aria-expanded': open,
        'aria-haspopup': 'menu',
        ...props,
      })
    }

    return (
      <button
        ref={internalRef}
        type="button"
        onClick={handleClick}
        aria-expanded={open}
        aria-haspopup="menu"
        {...props}
      >
        {children}
      </button>
    )
  }
)

// =============================================================================
// MenuContent 组件
// =============================================================================

const MenuContent = React.forwardRef<HTMLDivElement, MenuContentProps>(
  ({ variant, size, position, forceMount, className, children, ...props }, ref) => {
    const { open, triggerRef } = useMenuContext()

    if (!forceMount && !open) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(menuVariants({ variant, size, position }), className)}
        role="menu"
        {...props}
      >
        {children}
      </div>
    )
  }
)

// =============================================================================
// MenuItem 组件
// =============================================================================

const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ value, variant, active, disabled, inset, className, children, onClick, ...props }, ref) => {
    const { onOpenChange } = useMenuContext()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return
      onClick?.(event)
      onOpenChange(false)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        className={cn(
          menuItemVariants({ variant, active, disabled }),
          inset && "pl-8",
          className
        )}
        disabled={disabled}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)

// =============================================================================
// MenuSeparator 组件
// =============================================================================

const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(
  ({ decorative = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation="horizontal"
        className={cn("my-1 h-px bg-muted", className)}
        {...props}
      />
    )
  }
)

// =============================================================================
// MenuLabel 组件
// =============================================================================

const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ inset, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="menuitem"
        className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
        {...props}
      />
    )
  }
)

// =============================================================================
// MenuGroup 组件
// =============================================================================

const MenuGroup: React.FC<MenuGroupProps> = ({ heading, children, ...props }) => {
  return (
    <div role="group" {...props}>
      {heading && <MenuLabel>{heading}</MenuLabel>}
      {children}
    </div>
  )
}

// =============================================================================
// 组件元数据
// =============================================================================

Menu.displayName = 'Menu'
MenuTrigger.displayName = 'MenuTrigger'
MenuContent.displayName = 'MenuContent'
MenuItem.displayName = 'MenuItem'
MenuSeparator.displayName = 'MenuSeparator'
MenuLabel.displayName = 'MenuLabel'
MenuGroup.displayName = 'MenuGroup'

// =============================================================================
// 导出
// =============================================================================

export {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuLabel,
  MenuGroup,
  menuVariants,
  menuItemVariants,
}
export type { MenuProps, MenuTriggerProps, MenuContentProps, MenuItemProps, MenuSeparatorProps, MenuLabelProps, MenuGroupProps }