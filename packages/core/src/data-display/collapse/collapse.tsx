'use client'
/**
 * Collapse 折叠面板组件 - v2025.11.04
 *
 * 单一面板的展开/折叠组件，支持控制/非控制模式、动画过渡、键盘导航和可访问性。
 * 适用于需要隐藏/显示内容区域的场景，如 FAQ、详情展开等。
 *
 * @version 2025.11.04
 * @category Data Display
 * @layer component
 * @stability stable
 */

import React, { useState, useCallback, useRef } from 'react'
import { cn } from '../../utils/cn'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { motion, AnimatePresence } from 'framer-motion'

// 折叠面板变体样式
const collapseVariants = cva('overflow-hidden', {
  variants: {
    variant: {
      default: 'rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)]',
      bordered: 'border border-[var(--border-primary)] bg-transparent',
      ghost: 'bg-transparent',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

// 头部变体样式
const headerVariants = cva(
  'flex w-full items-center justify-between transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bg-primary-action)] focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'hover:bg-[var(--bg-secondary)] px-4 py-3 cursor-pointer',
        bordered: 'px-4 py-3 cursor-pointer',
        ghost: 'px-4 py-2 cursor-pointer',
      },
      size: {
        sm: 'py-2 text-sm',
        md: 'py-3 text-base',
        lg: 'py-4 text-lg',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      disabled: false,
    },
  }
)

// 内容区域变体样式
const contentVariants = cva('px-4 transition-colors', {
  variants: {
    size: {
      sm: 'py-2',
      md: 'py-3',
      lg: 'py-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// Collapse 组件属性接口
export interface CollapseProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof collapseVariants> {
  // 控制相关
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void

  // 内容相关
  children?: React.ReactNode
  trigger?: React.ReactNode
  content?: React.ReactNode

  // 功能特性
  disabled?: boolean
  lazy?: boolean
  keepMounted?: boolean

  // 交互相关
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void

  // 图标
  expandIcon?: React.ReactNode
  collapseIcon?: React.ReactNode

  // 测试和可访问性
  'aria-label'?: string
  'aria-labelledby'?: string
  'data-testid'?: string
}

// Collapse Context
interface CollapseContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  disabled: boolean
  size: 'sm' | 'md' | 'lg'
  variant: 'default' | 'bordered' | 'ghost'
  toggle: () => void
}

const CollapseContext = React.createContext<CollapseContextValue | null>(null)

const useCollapse = () => {
  const context = React.useContext(CollapseContext)
  if (!context) {
    throw new Error('useCollapse must be used within a Collapse')
  }
  return context
}

// 主组件
const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      children,
      trigger,
      content,
      disabled = false,
      lazy = false,
      keepMounted = true,
      onClick,
      onKeyDown,
      expandIcon,
      collapseIcon,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'data-testid': dataTestid,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen

    const buttonRef = useRef<HTMLButtonElement>(null)

    const handleOpenChange = useCallback(
      (newOpen: boolean) => {
        if (!isControlled) {
          setInternalOpen(newOpen)
        }
        onOpenChange?.(newOpen)
      },
      [isControlled, onOpenChange]
    )

    const toggle = useCallback(() => {
      if (disabled) return
      handleOpenChange(!open)
    }, [disabled, open, handleOpenChange])

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          toggle()
        }

        onKeyDown?.(event)
      },
      [disabled, toggle, onKeyDown]
    )

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return
        toggle()
        onClick?.(event)
      },
      [disabled, toggle, onClick]
    )

    const contextValue: CollapseContextValue = {
      open,
      onOpenChange: handleOpenChange,
      disabled,
      size: size || 'md',
      variant: variant || 'default',
      toggle,
    }

    // 默认展开/折叠图标
    const DefaultExpandIcon = () => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('transition-transform', open && 'rotate-180')}
        aria-hidden="true"
      >
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )

    const DefaultCollapseIcon = () => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('transition-transform', !open && 'rotate-180')}
        aria-hidden="true"
      >
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )

    // 计算测试ID
    const testId = dataTestid || `collapse-${variant}-${size}-${open ? 'open' : 'closed'}`

    return (
      <CollapseContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(collapseVariants({ variant, size, className }))}
          data-testid={testId}
          data-state={open ? 'open' : 'closed'}
          data-disabled={disabled}
          {...props}
        >
          {/* 头部触发器 */}
          <button
            ref={buttonRef}
            type="button"
            className={cn(headerVariants({ variant, size, disabled }))}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-expanded={open}
            aria-controls={testId + '-content'}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            data-testid={testId + '-header'}
          >
            {/* 自定义或默认触发器 */}
            {trigger || (
              <span className="flex-1 text-left font-medium text-[var(--text-primary)]">
                {ariaLabel || '折叠面板'}
              </span>
            )}

            {/* 图标 */}
            <span className="ml-2 text-[var(--text-secondary)] flex-shrink-0">
              {expandIcon && collapseIcon
                ? open
                  ? collapseIcon
                  : expandIcon
                : open
                ? collapseIcon || <DefaultCollapseIcon />
                : expandIcon || <DefaultExpandIcon />}
            </span>
          </button>

          {/* 内容区域 */}
          <AnimatePresence initial={false}>
            {(open || keepMounted) && (
              <motion.div
                id={testId + '-content'}
                role="region"
                aria-labelledby={ariaLabelledby}
                initial={lazy && !open ? { height: 0, opacity: 0 } : { height: 'auto', opacity: 1 }}
                animate={lazy && !open ? { height: 0, opacity: 0 } : { height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className={cn('overflow-hidden', !open && lazy && 'hidden')}
                data-testid={testId + '-content'}
              >
                <div className={cn(contentVariants({ size }))}>
                  {content || children}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CollapseContext.Provider>
    )
  }
)

Collapse.displayName = 'Collapse'

// CollapseHeader 子组件
export interface CollapseHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headerVariants> {
  children: React.ReactNode
  asChild?: boolean
}

const CollapseHeader = React.forwardRef<HTMLDivElement, CollapseHeaderProps>(
  ({ className, variant, size, disabled, children, asChild, ...props }, ref) => {
    const { toggle, variant: contextVariant, size: contextSize, disabled: contextDisabled } = useCollapse()

    const finalVariant = variant || contextVariant
    const finalSize = size || contextSize
    const isDisabled = disabled || contextDisabled

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...children.props,
        onClick: (e: React.MouseEvent) => {
          children.props.onClick?.(e)
          toggle()
        },
      })
    }

    return (
      <div
        ref={ref}
        className={cn(headerVariants({ variant: finalVariant, size: finalSize, disabled: isDisabled }), className)}
        onClick={toggle}
        data-testid="collapse-header-custom"
        {...props}
      >
        {children}
      </div>
    )
  }
)

CollapseHeader.displayName = 'CollapseHeader'

// CollapseContent 子组件
export interface CollapseContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof contentVariants> {
  children: React.ReactNode
}

const CollapseContent = React.forwardRef<HTMLDivElement, CollapseContentProps>(
  ({ className, size, children, ...props }, ref) => {
    const { size: contextSize } = useCollapse()
    const finalSize = size || contextSize

    return (
      <div
        ref={ref}
        className={cn(contentVariants({ size: finalSize }), className)}
        data-testid="collapse-content-custom"
        {...props}
      >
        {children}
      </div>
    )
  }
)

CollapseContent.displayName = 'CollapseContent'

// CollapseItem 复合组件（用于嵌套）
export interface CollapseItemProps extends CollapseProps {
  title: string
  children: React.ReactNode
}

const CollapseItem = React.forwardRef<HTMLDivElement, CollapseItemProps>(
  ({ title, children, ...props }, ref) => {
    return (
      <Collapse ref={ref} {...props}>
        <CollapseItem.Header>{title}</CollapseItem.Header>
        <CollapseItem.Content>{children}</CollapseItem.Content>
      </Collapse>
    )
  }
)

CollapseItem.displayName = 'CollapseItem'

// 添加静态属性
;(CollapseItem as any).Header = CollapseHeader
;(CollapseItem as any).Content = CollapseContent

export { Collapse, CollapseHeader, CollapseContent, CollapseItem, collapseVariants, headerVariants, contentVariants }
