import React, { createContext, useContext, useState, useRef, useEffect, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'

// 菜单项接口
export interface MenuItemType {
  /** 标签 */
  label: React.ReactNode
  /** 键值 */
  key: string
  /** 图标 */
  icon?: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 是否激活 */
  active?: boolean
  /** 子菜单项 */
  children?: MenuItemType[]
  /** 点击事件 */
  onClick?: (key: string) => void
  /** 链接地址 */
  href?: string
  /** 快捷键 */
  shortcut?: string
  /** 描述 */
  description?: string
  /** 危险项 */
  danger?: boolean
}

// 菜单上下文
interface MenuContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  variant: 'default' | 'dropdown' | 'sidebar' | 'context'
  size: 'sm' | 'md' | 'lg'
  activeKey?: string
  setActiveKey: (key?: string) => void
  triggerRef: React.RefObject<HTMLElement>
  contentRef: React.RefObject<HTMLElement>
}

const MenuContext = createContext<MenuContextValue>({
  isOpen: false,
  setIsOpen: () => {},
  variant: 'default',
  size: 'md',
  setActiveKey: () => {},
  triggerRef: { current: null },
  contentRef: { current: null },
})

const useMenu = () => {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('Menu components must be used within a MenuProvider')
  }
  return context
}

// 菜单变体配置
const menuVariants = cva(
  // 基础样式
  'relative inline-block',
  {
    variants: {
      variant: {
        default: 'inline-block',
        dropdown: 'relative',
        sidebar: 'block w-full',
        context: 'absolute',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// 菜单触发器变体
const menuTriggerVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
        dropdown: 'px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
        sidebar: 'w-full justify-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-0 rounded-lg',
        context: 'px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-6 py-3',
      },
      active: {
        true: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      active: false,
    },
  }
)

// 菜单内容变体
const menuContentVariants = cva(
  // 基础样式
  'z-50 min-w-48 overflow-hidden rounded-xl border bg-white dark:bg-gray-800 shadow-lg backdrop-blur-sm',
  {
    variants: {
      variant: {
        default: 'absolute top-full left-0 mt-2',
        dropdown: 'absolute top-full left-0 mt-2',
        sidebar: 'relative top-0 left-0 mt-0 border-none bg-transparent shadow-none',
        context: 'absolute py-2',
      },
      size: {
        sm: 'text-sm py-1',
        md: 'text-sm py-1',
        lg: 'text-base py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// 菜单项变体
const menuItemVariants = cva(
  // 基础样式
  'relative flex cursor-pointer select-none items-center rounded-lg transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-inset',
  {
    variants: {
      variant: {
        default: 'px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        dropdown: 'px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        sidebar: 'px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mx-2',
        context: 'px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
      },
      size: {
        sm: 'text-sm py-1.5',
        md: 'text-sm py-2',
        lg: 'text-base py-2.5',
      },
      active: {
        true: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        false: '',
      },
      danger: {
        true: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
        false: '',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      active: false,
      danger: false,
      disabled: false,
    },
  }
)

// 菜单分隔符变体
const menuSeparatorVariants = cva(
  // 基础样式
  'border-gray-200 dark:border-gray-700',
  {
    variants: {
      variant: {
        default: 'my-1 border-t',
        dropdown: 'my-1 border-t',
        sidebar: 'my-2 border-t mx-4',
        context: 'my-1 border-t',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// 菜单组件属性
export interface MenuProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof menuVariants> {
  /** 是否打开 */
  open?: boolean
  /** 打开状态变化回调 */
  onOpenChange?: (open: boolean) => void
  /** 当前激活项的键值 */
  activeKey?: string
  /** 选中变化回调 */
  onSelect?: (key: string) => void
  /** 菜单项数据 */
  items?: MenuItemType[]
  /** 触发方式 */
  trigger?: 'click' | 'hover' | 'context'
  /** 放置位置 */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'right-end'
}

// 复合组件类型定义
interface MenuComponent extends React.FC<MenuProps> {
  Trigger: typeof MenuTrigger
  Content: typeof MenuContent
  Item: typeof MenuItem
  Separator: typeof MenuSeparator
  Group: typeof MenuGroup
  SubMenu: typeof MenuSubMenu
}

export const Menu: MenuComponent = forwardRef<HTMLDivElement, MenuProps>(
  ({
    variant,
    size,
    open,
    onOpenChange,
    activeKey,
    onSelect,
    items,
    trigger = 'click',
    placement = 'bottom-start',
    className,
    children,
    ...props
  }, ref) => {
    const { themeConfig } = useTheme()
    const [internalOpen, setInternalOpen] = useState(false)
    const [internalActiveKey, setInternalActiveKey] = useState<string>()
    const triggerRef = useRef<HTMLElement>(null)
    const contentRef = useRef<HTMLElement>(null)

    const isOpen = open ?? internalOpen
    const currentActiveKey = activeKey ?? internalActiveKey

    const setIsOpen = React.useCallback((newOpen: boolean) => {
      onOpenChange?.(newOpen)
      if (open === undefined) {
        setInternalOpen(newOpen)
      }
    }, [onOpenChange, open])

    const setActiveKey = React.useCallback((key?: string) => {
      if (key !== activeKey) {
        onSelect?.(key!)
        if (activeKey === undefined) {
          setInternalActiveKey(key)
        }
      }
    }, [activeKey, onSelect])

    // 键盘导航处理
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) return

        switch (event.key) {
          case 'Escape':
            setIsOpen(false)
            triggerRef.current?.focus()
            break
          case 'ArrowDown':
          case 'ArrowUp':
            event.preventDefault()
            // TODO: 实现键盘导航
            break
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, setIsOpen])

    // 点击外部关闭
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen, setIsOpen])

    const contextValue: MenuContextValue = {
      isOpen,
      setIsOpen,
      variant: variant || 'default',
      size: size || 'md',
      activeKey: currentActiveKey,
      setActiveKey,
      triggerRef,
      contentRef,
    }

    return (
      <MenuContext.Provider value={contextValue}>
        <motion.div
          ref={ref}
          className={cn(menuVariants({ variant }), className)}
          {...props}
        >
          {children || (
            <>
              <MenuTrigger>
                <span>Menu</span>
              </MenuTrigger>
              <MenuContent>
                {items?.map((item) => (
                  <MenuItem key={item.key} item={item} />
                ))}
              </MenuContent>
            </>
          )}
        </motion.div>
      </MenuContext.Provider>
    )
  }
)

Menu.displayName = 'Menu'

// 菜单触发器组件
export interface MenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof menuTriggerVariants> {}

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ className, variant, size, onClick, children, ...props }, ref) => {
    const { isOpen, setIsOpen, variant: contextVariant, size: contextSize, triggerRef } = useMenu()

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsOpen(!isOpen)
        onClick?.(event)
      },
      [isOpen, setIsOpen, onClick]
    )

    return (
      <motion.button
        ref={(node) => {
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
          triggerRef.current = node
        }}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={cn(
          menuTriggerVariants({
            variant: variant ?? contextVariant,
            size: size ?? contextSize,
            className,
          })
        )}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
        <motion.svg
          className="w-4 h-4 ml-2 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>
    )
  }
)

MenuTrigger.displayName = 'MenuTrigger'

// 菜单内容组件
export interface MenuContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof menuContentVariants> {}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const { isOpen, variant: contextVariant, size: contextSize, contentRef } = useMenu()

    if (!isOpen) return null

    return (
      <AnimatePresence>
        <motion.div
          ref={(node) => {
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
            contentRef.current = node
          }}
          className={cn(
            menuContentVariants({
              variant: variant ?? contextVariant,
              size: size ?? contextSize,
              className,
            })
          )}
          role="menu"
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          {...props}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    )
  }
)

MenuContent.displayName = 'MenuContent'

// 菜单项组件
export interface MenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof menuItemVariants> {
  item?: MenuItemType
}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ className, variant, size, item, onClick, children, ...props }, ref) => {
    const { setIsOpen, setActiveKey, variant: contextVariant, size: contextSize } = useMenu()

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (item?.disabled) return

        item?.onClick?.(item.key)
        setActiveKey(item?.key)
        onClick?.(event)
        setIsOpen(false)
      },
      [item, onClick, setIsOpen, setActiveKey]
    )

    if (item) {
      return (
        <motion.button
          ref={ref}
          type="button"
          role="menuitem"
          disabled={item.disabled}
          className={cn(
            menuItemVariants({
              variant: variant ?? contextVariant,
              size: size ?? contextSize,
              active: item.active,
              danger: item.danger,
              disabled: item.disabled,
              className,
            })
          )}
          onClick={handleClick}
          whileHover={!item.disabled ? { x: 4 } : {}}
          transition={{ duration: 0.2 }}
          {...props}
        >
          {item.icon && (
            <span className="mr-3 flex-shrink-0">
              {item.icon}
            </span>
          )}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-medium">{item.label}</span>
            {item.description && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {item.description}
              </span>
            )}
          </div>
          {item.shortcut && (
            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 font-mono">
              {item.shortcut}
            </span>
          )}
        </motion.button>
      )
    }

    return (
      <motion.button
        ref={ref}
        type="button"
        role="menuitem"
        className={cn(
          menuItemVariants({
            variant: variant ?? contextVariant,
            size: size ?? contextSize,
            className,
          })
        )}
        onClick={(e) => {
          onClick?.(e)
          setIsOpen(false)
        }}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

MenuItem.displayName = 'MenuItem'

// 菜单分隔符组件
export interface MenuSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof menuSeparatorVariants> {}

export const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>(
  ({ className, variant, ...props }, ref) => {
    const { variant: contextVariant } = useMenu()

    return (
      <div
        ref={ref}
        role="separator"
        className={cn(
          menuSeparatorVariants({
            variant: variant ?? contextVariant,
            className,
          })
        )}
        {...props}
      />
    )
  }
)

MenuSeparator.displayName = 'MenuSeparator'

// 菜单分组组件
export interface MenuGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

export const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("py-1", className)} role="group" {...props}>
        {label && (
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {label}
          </div>
        )}
        {children}
      </div>
    )
  }
)

MenuGroup.displayName = 'MenuGroup'

// 子菜单组件
export interface MenuSubMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode
  item?: MenuItemType
}

export const MenuSubMenu = forwardRef<HTMLDivElement, MenuSubMenuProps>(
  ({ className, label, item, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const { variant: contextVariant } = useMenu()

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <motion.button
          type="button"
          className={cn(
            menuItemVariants({
              variant: contextVariant,
              active: item?.active,
              disabled: item?.disabled,
              className: "w-full justify-between",
            })
          )}
          onClick={() => setIsOpen(!isOpen)}
          whileHover={!item?.disabled ? { x: 4 } : {}}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            {item?.icon && (
              <span className="mr-3">
                {item.icon}
              </span>
            )}
            {label || item?.label}
          </div>
          <motion.svg
            className="w-4 h-4 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 90 : 0 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </motion.button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="ml-4 mt-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

MenuSubMenu.displayName = 'MenuSubMenu'

// 附加子组件到主组件
Menu.Trigger = MenuTrigger
Menu.Content = MenuContent
Menu.Item = MenuItem
Menu.Separator = MenuSeparator
Menu.Group = MenuGroup
Menu.SubMenu = MenuSubMenu

export default Menu