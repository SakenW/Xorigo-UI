import React, { createContext, useContext, useState, forwardRef } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '@/utils'

// 选项卡项接口
export interface TabItem {
  /** 键值 */
  key: string
  /** 标签 */
  label: React.ReactNode
  /** 内容 */
  content?: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 图标 */
  icon?: React.ReactNode
  /** 是否可关闭 */
  closable?: boolean
  /** 关闭回调 */
  onClose?: (key: string) => void
  /** 徽标 */
  badge?: React.ReactNode
}

// 选项卡上下文
interface TabsContextValue {
  activeKey: string
  setActiveKey: (key: string) => void
  variant: 'default' | 'pills' | 'underline' | 'card'
  size: 'sm' | 'md' | 'lg'
  orientation: 'horizontal' | 'vertical'
  animated: boolean
  items: TabItem[]
  setItems: (items: TabItem[]) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

const useTabs = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs')
  }
  return context
}

// 选项卡变体配置
const tabsVariants = cva(
  // 基础样式
  'w-full',
  {
    variants: {
      orientation: {
        horizontal: 'flex-col',
        vertical: 'flex-row',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
)

// 选项卡列表变体
const tabsListVariants = cva(
  // 基础样式
  'flex',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
        pills: 'gap-2 p-1',
        underline: 'border-b border-gray-200 dark:border-gray-700 bg-transparent p-0',
        card: 'bg-transparent border-b border-gray-200 dark:border-gray-700 p-0',
      },
      size: {
        sm: 'text-sm',
        md: 'text-sm',
        lg: 'text-base',
      },
      orientation: {
        horizontal: 'flex-row w-full overflow-x-auto',
        vertical: 'flex-col w-48 space-y-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      orientation: 'horizontal',
    },
  }
)

// 选项卡触发器变体
const tabsTriggerVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative',
  {
    variants: {
      variant: {
        default: 'rounded-md',
        pills: 'rounded-full px-4',
        underline: 'border-b-2 border-transparent rounded-t-md',
        card: 'border-b-2 border-transparent rounded-t-lg mr-2',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs min-h-8',
        md: 'px-4 py-2 text-sm min-h-10',
        lg: 'px-6 py-3 text-base min-h-12',
      },
      active: {
        true: '',
        false: '',
      },
      orientation: {
        horizontal: '',
        vertical: 'w-full justify-start',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      active: false,
      orientation: 'horizontal',
    },
  }
)

// 选项卡内容变体
const tabsContentVariants = cva(
  // 基础样式
  'focus:outline-hidden',
  {
    variants: {
      variant: {
        default: 'mt-2',
        pills: 'mt-4',
        underline: 'mt-4',
        card: 'mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// 选项卡组件属性
export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof tabsVariants> {
  /** 默认激活选项卡 */
  defaultValue: string
  /** 当前激活选项卡（受控模式） */
  value?: string
  /** 选项卡变化回调 */
  onValueChange?: (key: string) => void
  /** 选项卡数据 */
  items?: TabItem[]
  /** 是否开启动画 */
  animated?: boolean
  /** 是否可滚动 */
  scrollable?: boolean
  /** 选项卡位置 */
  tabPosition?: 'top' | 'bottom' | 'left' | 'right'
  /** 选项卡大小 */
  size?: 'sm' | 'md' | 'lg'
  /** 类型 */
  type?: 'line' | 'card' | 'editable-card'
}

// 复合组件类型定义
interface TabsComponent extends React.FC<TabsProps> {
  List: typeof TabsList
  Trigger: typeof TabsTrigger
  Content: typeof TabsContent
  TabPane: typeof TabPane
}

export const Tabs: TabsComponent = forwardRef<HTMLDivElement, TabsProps>(
  ({
    variant,
    size,
    orientation,
    defaultValue,
    value,
    onValueChange,
    items = [],
    animated = true,
    scrollable = false,
    tabPosition = 'top',
    type = 'line',
    className,
    children,
    ...props
  }, ref) => {
    const { themeConfig } = useTheme()
    const [internalValue, setInternalValue] = useState(defaultValue)
    const [internalItems, setInternalItems] = useState(items)

    const activeKey = value !== undefined ? value : internalValue
    const currentItems = items.length > 0 ? items : internalItems

    const setActiveKey = React.useCallback((key: string) => {
      if (value === undefined) {
        setInternalValue(key)
      }
      onValueChange?.(key)
    }, [value, onValueChange])

    const handleTabClose = React.useCallback((key: string) => {
      const item = currentItems.find(item => item.key === key)
      if (item?.onClose) {
        item.onClose(key)
      } else {
        const newItems = currentItems.filter(item => item.key !== key)
        setInternalItems(newItems)

        // 如果关闭的是当前激活的选项卡，切换到其他选项卡
        if (key === activeKey && newItems.length > 0) {
          const index = currentItems.findIndex(item => item.key === key)
          const nextIndex = index >= newItems.length ? newItems.length - 1 : index
          setActiveKey(newItems[nextIndex].key)
        }
      }
    }, [currentItems, activeKey, setActiveKey])

    // 根据位置确定方向
    const currentOrientation = ['left', 'right'].includes(tabPosition) ? 'vertical' : 'horizontal'
    const currentVariant = type === 'card' ? 'card' : variant

    const contextValue: TabsContextValue = {
      activeKey,
      setActiveKey,
      variant: currentVariant || 'default',
      size: size || 'md',
      orientation: currentOrientation,
      animated,
      items: currentItems,
      setItems: setInternalItems,
    }

    const renderContent = () => {
      if (children) return children

      return currentItems.map((item) => (
        <TabPane key={item.key} item={item}>
          {item.content}
        </TabPane>
      ))
    }

    const renderList = () => {
      if (children) {
        // 如果使用子组件模式，从children中提取TabsList
        const listChildren = React.Children.toArray(children).find(
          (child) => React.isValidElement(child) && child.type === TabsList
        )
        return listChildren
      }

      return (
        <TabsList>
          {currentItems.map((item) => (
            <TabsTrigger
              key={item.key}
              value={item.key}
              disabled={item.disabled}
              icon={item.icon}
              badge={item.badge}
              closable={type === 'editable-card' && item.closable}
              onClose={() => handleTabClose(item.key)}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      )
    }

    const content = (
      <TabsContext.Provider value={contextValue}>
        <motion.div
          ref={ref}
          className={cn(tabsVariants({ orientation: currentOrientation }), className)}
          {...props}
        >
          {['top', 'left'].includes(tabPosition) && renderList()}
          {renderContent()}
          {['bottom', 'right'].includes(tabPosition) && renderList()}
        </motion.div>
      </TabsContext.Provider>
    )

    if (animated) {
      return (
        <LayoutGroup>
          {content}
        </LayoutGroup>
      )
    }

    return content
  }
)

Tabs.displayName = 'Tabs'

// 选项卡列表组件
export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListVariants> {}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant, size, orientation, ...props }, ref) => {
    const { variant: contextVariant, size: contextSize, orientation: contextOrientation } = useTabs()

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          tabsListVariants({
            variant: variant ?? contextVariant,
            size: size ?? contextSize,
            orientation: orientation ?? contextOrientation,
          }),
          className
        )}
        {...props}
      />
    )
  }
)

TabsList.displayName = 'TabsList'

// 选项卡触发器组件
export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabsTriggerVariants> {
  /** 选项卡值 */
  value: string
  /** 图标 */
  icon?: React.ReactNode
  /** 徽标 */
  badge?: React.ReactNode
  /** 是否可关闭 */
  closable?: boolean
  /** 关闭回调 */
  onClose?: () => void
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({
    className,
    variant,
    size,
    orientation,
    value,
    disabled = false,
    icon,
    badge,
    closable,
    onClose,
    children,
    ...props
  }, ref) => {
    const { activeKey, setActiveKey, variant: contextVariant, size: contextSize, orientation: contextOrientation, animated } = useTabs()
    const isActive = activeKey === value

    const handleClick = React.useCallback(() => {
      if (!disabled) {
        setActiveKey(value)
      }
    }, [disabled, setActiveKey, value])

    const handleClose = React.useCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      onClose?.()
    }, [onClose])

    const getVariantClasses = () => {
      const baseVariant = variant ?? contextVariant
      const baseSize = size ?? contextSize
      const baseOrientation = orientation ?? contextOrientation

      switch (baseVariant) {
        case 'default':
          return cn(
            tabsTriggerVariants({
              variant: baseVariant,
              size: baseSize,
              active: isActive,
              orientation: baseOrientation,
            }),
            isActive
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          )
        case 'pills':
          return cn(
            tabsTriggerVariants({
              variant: baseVariant,
              size: baseSize,
              active: isActive,
              orientation: baseOrientation,
            }),
            isActive
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
          )
        case 'underline':
          return cn(
            tabsTriggerVariants({
              variant: baseVariant,
              size: baseSize,
              active: isActive,
              orientation: baseOrientation,
            }),
            isActive
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border-transparent'
          )
        case 'card':
          return cn(
            tabsTriggerVariants({
              variant: baseVariant,
              size: baseSize,
              active: isActive,
              orientation: baseOrientation,
            }),
            isActive
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
          )
        default:
          return tabsTriggerVariants({
            variant: baseVariant,
            size: baseSize,
            active: isActive,
            orientation: baseOrientation,
          })
      }
    }

    return (
      <motion.button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-disabled={disabled}
        disabled={disabled}
        className={cn(getVariantClasses(), className)}
        onClick={handleClick}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {icon && (
          <span className="mr-2 flex-shrink-0">
            {icon}
          </span>
        )}
        <span className="flex-1">{children}</span>
        {badge && (
          <span className="ml-2 flex-shrink-0">
            {badge}
          </span>
        )}
        {closable && (
          <motion.button
            type="button"
            className="ml-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0"
            onClick={handleClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
        {variant === 'underline' && isActive && animated && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
            layoutId="activeTab"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </motion.button>
    )
  }
)

TabsTrigger.displayName = 'TabsTrigger'

// 选项卡内容组件
export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsContentVariants> {
  /** 选项卡值 */
  value: string
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, variant, value, children, ...props }, ref) => {
    const { activeKey, variant: contextVariant, animated } = useTabs()

    if (activeKey !== value) return null

    const content = (
      <div
        ref={ref}
        role="tabpanel"
        className={cn(
          tabsContentVariants({
            variant: variant ?? contextVariant,
          }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    )

    if (animated) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      )
    }

    return content
  }
)

TabsContent.displayName = 'TabsContent'

// 选项卡面板组件
export interface TabPaneProps {
  item?: TabItem
  value?: string
  children?: React.ReactNode
  tab?: React.ReactNode
  disabled?: boolean
  closable?: boolean
  onClose?: () => void
}

export const TabPane: React.FC<TabPaneProps> = ({
  item,
  value,
  children,
  tab,
  disabled,
  closable,
  onClose
}) => {
  const { activeKey } = useTabs()
  const isActive = item ? activeKey === item.key : activeKey === value

  if (!isActive) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item?.key || value}
        role="tabpanel"
        className="focus:outline-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

TabPane.displayName = 'TabPane'

// 附加子组件到主组件
Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent
Tabs.TabPane = TabPane

export default Tabs
