import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps {
  /** 子元素 */
  children: React.ReactNode
  /** 容器元素或选择器 */
  container?: HTMLElement | string | null
  /** 是否禁用Portal */
  disabled?: boolean
  /** z-index */
  zIndex?: number
  /** 自定义容器类名 */
  className?: string
  /** 容器内联样式 */
  style?: React.CSSProperties
}

export const Portal = forwardRef<HTMLDivElement, PortalProps>(
  ({
    children,
    container,
    disabled = false,
    zIndex,
    className,
    style,
    ...props
  }, ref) => {
    const [mounted, setMounted] = useState(false)
    const portalContainerRef = useRef<HTMLElement | null>(null)

    // 检测客户端渲染
    useEffect(() => {
      setMounted(true)
      return () => setMounted(false)
    }, [])

    // 获取容器元素
    useEffect(() => {
      if (!mounted || disabled) return

      let targetContainer: HTMLElement | null = null

      if (typeof container === 'string') {
        // 选择器字符串
        targetContainer = document.querySelector(container)
      } else if (container instanceof HTMLElement) {
        // DOM元素
        targetContainer = container
      } else {
        // 默认使用body
        targetContainer = document.body
      }

      portalContainerRef.current = targetContainer

      return () => {
        portalContainerRef.current = null
      }
    }, [mounted, disabled, container])

    // 如果未挂载或禁用Portal，直接返回子元素
    if (!mounted || disabled) {
      return (
        <div ref={ref} className={className} style={style} {...props}>
          {children}
        </div>
      )
    }

    // 如果没有找到容器，返回null
    if (!portalContainerRef.current) {
      console.warn('Portal: 容器元素未找到')
      return null
    }

    // 创建Portal内容
    const portalContent = (
      <div
        ref={ref}
        className={className}
        style={{
          ...style,
          ...(zIndex && { zIndex }),
        }}
        {...props}
      >
        {children}
      </div>
    )

    // 渲染到指定容器
    return createPortal(portalContent, portalContainerRef.current)
  }
)

Portal.displayName = 'Portal'

// 预设Portal组件
export interface BodyPortalProps extends Omit<PortalProps, 'container'> {}

export const BodyPortal = forwardRef<HTMLDivElement, BodyPortalProps>(
  (props, ref) => <Portal ref={ref} container={document.body} {...props} />
)

BodyPortal.displayName = 'BodyPortal'

export interface ModalPortalProps extends Omit<PortalProps, 'container' | 'zIndex'> {
  /** 模态框层级基础值 */
  baseZIndex?: number
}

export const ModalPortal = forwardRef<HTMLDivElement, ModalPortalProps>(
  ({ baseZIndex = 1000, ...props }, ref) => (
    <Portal ref={ref} container={document.body} zIndex={baseZIndex} {...props} />
  )
)

ModalPortal.displayName = 'ModalPortal'

export interface TooltipPortalProps extends Omit<PortalProps, 'container' | 'zIndex'> {
  /** 工具提示层级基础值 */
  baseZIndex?: number
}

export const TooltipPortal = forwardRef<HTMLDivElement, TooltipPortalProps>(
  ({ baseZIndex = 1050, ...props }, ref) => (
    <Portal ref={ref} container={document.body} zIndex={baseZIndex} {...props} />
  )
)

TooltipPortal.displayName = 'TooltipPortal'

export interface NotificationPortalProps extends Omit<PortalProps, 'container' | 'zIndex'> {
  /** 通知层级基础值 */
  baseZIndex?: number
}

export const NotificationPortal = forwardRef<HTMLDivElement, NotificationPortalProps>(
  ({ baseZIndex = 2000, ...props }, ref) => (
    <Portal ref={ref} container={document.body} zIndex={baseZIndex} {...props} />
  )
)

NotificationPortal.displayName = 'NotificationPortal'

// 条件Portal组件
export interface ConditionalPortalProps extends PortalProps {
  /** 条件 */
  condition: boolean
  /** 条件为false时的fallback */
  fallback?: React.ReactNode
}

export const ConditionalPortal = forwardRef<HTMLDivElement, ConditionalPortalProps>(
  ({ condition, fallback, ...props }, ref) => {
    if (condition) {
      return <Portal ref={ref} {...props} />
    }
    return <>{fallback}</>
  }
)

ConditionalPortal.displayName = 'ConditionalPortal'

// 延迟Portal组件
export interface DelayedPortalProps extends PortalProps {
  /** 延迟时间(ms) */
  delay: number
  /** 延迟期间的占位内容 */
  placeholder?: React.ReactNode
}

export const DelayedPortal = forwardRef<HTMLDivElement, DelayedPortalProps>(
  ({ delay, placeholder, children, ...props }, ref) => {
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
      const timer = setTimeout(() => {
        setShouldRender(true)
      }, delay)

      return () => clearTimeout(timer)
    }, [delay])

    if (!shouldRender) {
      return <>{placeholder}</>
    }

    return <Portal ref={ref} {...props}>{children}</Portal>
  }
)

DelayedPortal.displayName = 'DelayedPortal'