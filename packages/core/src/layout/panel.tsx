import React, { useState, createContext, useContext, forwardRef } from 'react'
import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils/cn'

// Panel Context用于复合组件模式
interface PanelContextValue {
  collapsed: boolean
  toggle: () => void
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant: 'default' | 'elevated' | 'outlined' | 'ghost' | 'filled' | 'glass'
  collapsible: boolean
  disabled: boolean
  direction: 'horizontal' | 'vertical'
}

const PanelContext = createContext<PanelContextValue | undefined>(undefined)

const usePanelContext = () => {
  const context = useContext(PanelContext)
  if (!context) {
    throw new Error('Panel复合组件必须在Panel内部使用')
  }
  return context
}

// Panel组件变体配置
const panelVariants = cva(
  // 基础样式
  'w-full border rounded-xl overflow-hidden transition-all duration-200',
  {
    variants: {
      variant: {
        // 默认面板
        default: 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700',
        // 浮起面板
        elevated: 'bg-white border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700',
        // 轮廓面板
        outlined: 'bg-white border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-600',
        // 幽灵面板
        ghost: 'bg-transparent border-transparent dark:bg-transparent',
        // 填充面板
        filled: 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600',
        // 玻璃面板
        glass: 'backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-white/30 dark:border-gray-700/50',
      },
      size: {
        xs: 'text-xs p-3',
        sm: 'text-sm p-4',
        md: 'text-base p-6',
        lg: 'text-lg p-8',
        xl: 'text-xl p-10',
      },
      direction: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
      collapsible: {
        true: '',
        false: '',
      },
      disabled: {
        true: 'opacity-60 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      direction: 'vertical',
      collapsible: false,
      disabled: false,
    },
  }
)

// Panel组件接口
export interface PanelProps
  extends Omit<HTMLMotionProps<'div'>, 'variant'>,
    VariantProps<typeof panelVariants> {
  /** 默认折叠状态 */
  defaultCollapsed?: boolean
  /** 受控折叠状态 */
  collapsed?: boolean
  /** 折叠状态变化回调 */
  onCollapseChange?: (collapsed: boolean) => void
  /** 是否可折叠 */
  collapsible?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 折叠动画持续时间 */
  collapseDuration?: number
  /** 折叠方向 */
  collapseDirection?: 'height' | 'width'
  /** 是否显示展开/折叠图标 */
  showToggleIcon?: boolean
  /** 自定义展开图标 */
  expandIcon?: React.ReactNode
  /** 自定义折叠图标 */
  collapseIcon?: React.ReactNode
  /** 折叠高度（像素） */
  collapsedHeight?: number
}

// Panel组件实现
const Panel = forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      className,
      variant,
      size,
      direction,
      defaultCollapsed = false,
      collapsed: controlledCollapsed,
      onCollapseChange,
      collapsible = false,
      disabled = false,
      collapseDuration = 0.3,
      collapseDirection = 'height',
      showToggleIcon = true,
      expandIcon,
      collapseIcon,
      collapsedHeight = 60,
      children,
      ...props
    },
    ref
  ) => {
    // 非受控模式的内部状态
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)

    // 判断组件是受控还是非受控
    const isControlled = controlledCollapsed !== undefined
    const collapsed = isControlled ? controlledCollapsed : internalCollapsed

    // 切换折叠状态
    const toggle = React.useCallback(() => {
      if (disabled || !collapsible) return

      const newState = !collapsed
      if (isControlled) {
        onCollapseChange?.(newState)
      } else {
        setInternalCollapsed(newState)
      }
    }, [collapsed, disabled, collapsible, isControlled, onCollapseChange])

    // 键盘事件处理
    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
      if (disabled || !collapsible) return

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggle()
      }
    }, [disabled, collapsible, toggle])

    const contextValue: PanelContextValue = React.useMemo(() => ({
      collapsed,
      toggle,
      size: size || 'md',
      variant: variant || 'default',
      collapsible,
      disabled,
      direction: direction || 'vertical',
    }), [collapsed, toggle, size, variant, collapsible, disabled, direction])

    // 动画变体
    const motionVariants: any = {
      expanded: {
        [collapseDirection]: 'auto',
        opacity: 1,
        transition: {
          duration: collapseDuration,
          ease: [0.04, 0.62, 0.23, 0.98] as const
        }
      },
      collapsed: {
        [collapseDirection]: collapsible ? collapsedHeight : 'auto',
        opacity: collapsible ? 0.8 : 1,
        transition: {
          duration: collapseDuration,
          ease: [0.04, 0.62, 0.23, 0.98] as const
        }
      }
    }

    // 默认图标
    const defaultExpandIcon = (
      <svg
        className="w-4 h-4 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )

    const defaultCollapseIcon = (
      <svg
        className="w-4 h-4 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    )

    return (
      <PanelContext.Provider value={contextValue}>
        <motion.div
          ref={ref}
          className={cn(
            panelVariants({
              variant,
              size,
              direction,
              collapsible,
              disabled,
            }),
            collapsible && 'cursor-pointer',
            className
          )}
          variants={motionVariants}
          animate={collapsed ? 'collapsed' : 'expanded'}
          initial={false}
          onKeyDown={handleKeyDown}
          role={collapsible ? 'button' : undefined}
          tabIndex={collapsible && !disabled ? 0 : undefined}
          aria-expanded={collapsible ? !collapsed : undefined}
          aria-disabled={disabled}
          {...props}
        >
          {/* 折叠/展开图标 */}
          {collapsible && showToggleIcon && (
            <div className="absolute top-4 right-4 z-10">
              <motion.div
                animate={{ rotate: collapsed ? 0 : 180 }}
                transition={{ duration: 0.2 }}
                className="text-gray-500 dark:text-gray-400"
              >
                {collapsed ? (expandIcon || defaultExpandIcon) : (collapseIcon || defaultCollapseIcon)}
              </motion.div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 折叠时显示的内容 */}
          {collapsible && collapsed && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              点击展开
            </div>
          )}
        </motion.div>
      </PanelContext.Provider>
    )
  }
)

Panel.displayName = 'Panel'

export { Panel, PanelContext, usePanelContext, panelVariants }