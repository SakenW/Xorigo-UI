/**
 * Tooltip 工具提示组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 状态/通知/进度/结果/无障碍提示
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useThemeSafe } from '../../system/theme-provider'
import { createPortal } from 'react-dom'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const tooltipVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "absolute z-50 px-3 py-2 text-sm rounded-md shadow-lg border max-w-xs transition-all duration-200",
  {
    variants: {
      // 变体系统 - 使用七轴主题系统的颜色令牌
      variant: {
        default: "bg-popover text-popover-foreground border-border-base-base",
        dark: "bg-[var(--xor-bg-tertiary)] text-[var(--xor-text-primary)] border-[var(--xor-border-secondary)]",
        light: "bg-[var(--xor-bg-primary)] text-[var(--xor-text-primary)] border-[var(--xor-border-primary)]",
        success: "bg-success text-success-foreground border-success",
        warning: "bg-warning text-warning-foreground border-warning",
        error: "bg-error-500 text-error-600-foreground border-error-500",
        info: "bg-info text-info-foreground border-info",
      },

      // 位置
      side: {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
        'top-start': "bottom-full left-0 mb-2",
        'top-end': "bottom-full right-0 mb-2",
        'bottom-start': "top-full left-0 mt-2",
        'bottom-end': "top-full right-0 mt-2",
        'left-start': "right-full top-0 mr-2",
        'left-end': "right-full bottom-0 mr-2",
        'right-start': "left-full top-0 ml-2",
        'right-end': "left-full bottom-0 ml-2",
      },

      // 对齐方式
      align: {
        start: "text-left",
        center: "text-center",
        end: "text-right",
      },

      // 动画效果
      animation: {
        none: "",
        fade: "animate-in fade-in",
        scale: "animate-in fade-in zoom-in-95",
        slide: "animate-in fade-in slide-in-from-top-2",
      },

      // 箭头指示器
      arrow: {
        none: "",
        top: "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:translate-y-full after:border-8 after:border-transparent after:border-t-current after:border-b-0",
        bottom: "after:content-[''] after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 after:-translate-y-full after:border-8 after:border-transparent after:border-b-current after:border-t-0",
        left: "after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:translate-x-full after:border-8 after:border-transparent after:border-l-current after:border-r-0",
        right: "after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:-translate-x-full after:border-8 after:border-transparent after:border-r-current after:border-l-0",
      },
    },

    // 默认变体
    defaultVariants: {
      variant: 'default',
      side: 'top',
      align: 'center',
      animation: 'fade',
      arrow: 'none',
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface TooltipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipVariants> {
  /**
   * 触发元素
   */
  children: React.ReactElement

  /**
   * 提示内容
   */
  content: React.ReactNode

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 延迟显示时间（毫秒）
   */
  delay?: number

  /**
   * 延迟隐藏时间（毫秒）
   */
  hideDelay?: number

  /**
   * 是否在点击外部时关闭
   */
  closeOnClickOutside?: boolean

  /**
   * 是否在点击时关闭
   */
  closeOnClick?: boolean

  /**
   * 是否按住 ESC 键关闭
   */
  closeOnEscape?: boolean

  /**
   * 是否悬停在提示内容上时保持显示
   */
  keepTooltipOnHover?: boolean

  /**
   * 自定义容器
   */
  container?: HTMLElement | null

  /**
   * 是否使用 Portal 渲染
   */
  usePortal?: boolean

  /**
   * ARIA 标签
   */
  ariaLabel?: string

  /**
   * 角色标签
   */
  role?: 'tooltip' | 'description'
}

// =============================================================================
// Tooltip 主组件实现
// =============================================================================

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      content,
      variant,
      side,
      align,
      animation,
      arrow,
      disabled = false,
      delay = 300,
      hideDelay = 100,
      closeOnClickOutside = true,
      closeOnClick = false,
      closeOnEscape = true,
      keepTooltipOnHover = true,
      container,
      usePortal = true,
      ariaLabel,
      role = 'tooltip',
      className,
      ...props
    },
    ref
  ) => {
    const theme = useThemeSafe()
    const [isVisible, setIsVisible] = useState(false)
    const [isDelayedVisible, setIsDelayedVisible] = useState(false)
    const triggerRef = useRef<HTMLDivElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout>()
    const hideTimeoutRef = useRef<NodeJS.Timeout>()

    // 生成主题相关的样式
    const themeStyles: React.CSSProperties = {
      '--tooltip-bg': `hsl(${theme?.colors.popover || '#ffffff'})`,
      '--tooltip-border': `hsl(${theme?.colors.border.primary || '#e5e5e5'})`,
      '--tooltip-text': `hsl(${theme?.colors.text.primary || '#000000'})`,
      '--tooltip-arrow': `hsl(${theme?.colors.border.primary || '#e5e5e5'})`,
      // 可根据七轴动态调整
    }

    // 显示提示
    const showTooltip = React.useCallback(() => {
      if (disabled) return

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = undefined
      }

      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(true)
          setIsDelayedVisible(true)
        }, delay)
      } else {
        setIsVisible(true)
        setIsDelayedVisible(true)
      }
    }, [disabled, delay])

    // 隐藏提示
    const hideTooltip = React.useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }

      if (hideDelay > 0) {
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false)
          setTimeout(() => setIsDelayedVisible(false), 200) // 等待动画完成
        }, hideDelay)
      } else {
        setIsVisible(false)
        setTimeout(() => setIsDelayedVisible(false), 200)
      }
    }, [hideDelay])

    // 处理键盘事件
    const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        hideTooltip()
      }
    }, [closeOnEscape, hideTooltip])

    // 处理点击外部
    const handleClickOutside = React.useCallback((e: MouseEvent) => {
      if (
        closeOnClickOutside &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        hideTooltip()
      }
    }, [closeOnClickOutside, hideTooltip])

    // 处理触发器点击
    const handleTriggerClick = React.useCallback(() => {
      if (closeOnClick) {
        if (isVisible) {
          hideTooltip()
        } else {
          showTooltip()
        }
      }
    }, [closeOnClick, isVisible, showTooltip, hideTooltip])

    // 监听全局事件
    useEffect(() => {
      if (isVisible) {
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
          document.removeEventListener('keydown', handleKeyDown)
          document.removeEventListener('mousedown', handleClickOutside)
        }
      }
    }, [isVisible, handleKeyDown, handleClickOutside])

    // 清理定时器
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
        }
      }
    }, [])

    // 确定箭头方向
    const getArrowDirection = () => {
      if (arrow === 'none') return 'none'
      if (side?.startsWith('top')) return 'top'
      if (side?.startsWith('bottom')) return 'bottom'
      if (side?.startsWith('left')) return 'left'
      if (side?.startsWith('right')) return 'right'
      return 'top'
    }

    // 渲染提示内容
    const renderTooltip = () => {
      if (!isDelayedVisible || !content) return null

      const tooltipContent = (
        <div
          ref={tooltipRef}
          className={cn(
            tooltipVariants({
              variant,
              side,
              align,
              animation,
              arrow: getArrowDirection(),
            }),
            // 可见性控制
            !isVisible && "opacity-0 pointer-events-none",
            className
          )}
          style={themeStyles}
          role={role}
          aria-label={ariaLabel}
          onMouseEnter={keepTooltipOnHover ? () => {
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current)
              hideTimeoutRef.current = undefined
            }
          } : undefined}
          onMouseLeave={keepTooltipOnHover ? hideTooltip : undefined}
          {...props}
        >
          <div className="relative">
            {content}
          </div>
        </div>
      )

      // 使用 Portal 渲染到指定容器
      if (usePortal) {
        const targetContainer = container || document.body
        return createPortal(tooltipContent, targetContainer)
      }

      return tooltipContent
    }

    // 克隆触发元素并添加必要的事件处理器
    const triggerElement = React.cloneElement(children, {
      ref: triggerRef,
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
      onFocus: showTooltip,
      onBlur: hideTooltip,
      onClick: handleTriggerClick,
      'aria-describedby': isVisible ? tooltipRef.current?.id : undefined,
    })

    return (
      <>
        {triggerElement}
        {renderTooltip()}
      </>
    )
  }
)

// =============================================================================
// Tooltip Provider - 用于全局配置
// =============================================================================

interface TooltipContextType {
  delay?: number
  hideDelay?: number
  closeOnClickOutside?: boolean
  closeOnClick?: boolean
  closeOnEscape?: boolean
  container?: HTMLElement | null
  usePortal?: boolean
}

const TooltipContext = React.createContext<TooltipContextType | undefined>(undefined)

export const TooltipProvider: React.FC<{
  children: React.ReactNode
  config?: Partial<TooltipContextType>
}> = ({ children, config }) => {
  const value: TooltipContextType = {
    delay: 300,
    hideDelay: 100,
    closeOnClickOutside: true,
    closeOnClick: false,
    closeOnEscape: true,
    usePortal: true,
    ...config,
  }

  return (
    <TooltipContext.Provider value={value}>
      {children}
    </TooltipContext.Provider>
  )
}

export const useTooltipConfig = () => {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error('useTooltipConfig must be used within a TooltipProvider')
  }
  return context
}

// =============================================================================
// 简化版 Tooltip 组件 - 使用 Provider 配置
// =============================================================================

export interface SimpleTooltipProps extends Omit<TooltipProps, 'delay' | 'hideDelay' | 'closeOnClickOutside' | 'closeOnClick' | 'closeOnEscape' | 'container' | 'usePortal'> {
}

export const SimpleTooltip = React.forwardRef<HTMLDivElement, SimpleTooltipProps>(
  (props, ref) => {
    const config = useTooltipConfig()
    return <Tooltip ref={ref} {...config} {...props} />
  }
)

SimpleTooltip.displayName = 'SimpleTooltip'

// =============================================================================
// 组件元数据
// =============================================================================

Tooltip.displayName = 'Tooltip'

// =============================================================================
// 导出
// =============================================================================

export { Tooltip, tooltipVariants, TooltipContext }
export type { TooltipProps, TooltipContextType }