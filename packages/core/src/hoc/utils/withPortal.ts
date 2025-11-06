/**
 * @fileoverview withPortal HOC - 传送门高阶组件
 * @description 将组件渲染到DOM的任意位置，绕过DOM层级限制
 */

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { HOC, ComponentType, ReactNode } from '../types'

/**
 * 传送门配置
 */
export interface PortalConfig {
  /**
   * 目标容器选择器
   */
  container?: string | HTMLElement

  /**
   * 容器ID（如果container为字符串则使用此ID创建容器）
   */
  containerId?: string

  /**
   * 容器类名
   */
  containerClassName?: string

  /**
   * 容器样式
   */
  containerStyle?: React.CSSProperties

  /**
   * 是否在服务器端渲染时保持
   */
  ssr?: boolean

  /**
   * 是否启用传送门
   */
  enabled?: boolean

  /**
   * 自定义容器创建函数
   */
  createContainer?: () => HTMLElement

  /**
   * 容器清理函数
   */
  onContainerCreate?: (container: HTMLElement) => void

  /**
   * 容器销毁函数
   */
  onContainerDestroy?: (container: HTMLElement) => void
}

/**
 * 传送门上下文
 */
export interface PortalContextValue {
  isInPortal: boolean
  portalContainer: HTMLElement | null
  updateContainer: () => void
  getPortalRoot: () => HTMLElement | null
}

/**
 * 传送门包装器组件
 */
interface PortalWrapperProps {
  children: ReactNode
  container: HTMLElement
  isEnabled: boolean
}

/**
 * 包装在传送门中的组件
 */
function PortalWrapper({ children, container, isEnabled }: PortalWrapperProps) {
  if (!isEnabled) {
    return <>{children}</>
  }

  // 使用React.createPortal渲染到指定容器
  return (
    <div data-portal="true">
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            ...children.props,
            'data-portal-id': 'portal-wrapper',
          })
        : children}
    </div>
  )
}

/**
 * withPortal HOC - 提供传送门功能
 *
 * @param config 传送门配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const Modal = withPortal({
 *   containerId: 'modal-root',
 *   containerClassName: 'modal-overlay'
 * })(BaseModal)
 * ```
 */
export function withPortal<T extends Record<string, any> = {}>(
  config: PortalConfig = {}
): HOC<T, T & PortalContextValue & { portalContainer: HTMLElement | null }> {
  return function(Component: ComponentType<T>) {
    const {
      container: propContainer,
      containerId = 'portal-container',
      containerClassName = 'portal-container',
      containerStyle,
      ssr = false,
      enabled = true,
      createContainer,
      onContainerCreate,
      onContainerDestroy,
    } = config

    const displayName = `withPortal(${Component.displayName || Component.name || 'Component'})`

    const PortalComponent = React.forwardRef<any, T & PortalContextValue>(
      (props, ref) => {
        const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
        const [isContainerReady, setIsContainerReady] = useState(false)
        const containerRef = useRef<HTMLElement>(null)

        // 创建容器
        const createPortalContainer = useCallback(() => {
          let containerElement: HTMLElement | null = null

          if (createContainer) {
            containerElement = createContainer()
          } else if (typeof propContainer === 'string') {
            containerElement = document.querySelector(propContainer) as HTMLElement
          } else if (propContainer instanceof HTMLElement) {
            containerElement = propContainer
          }

          if (!containerElement) {
            containerElement = document.createElement('div')
            containerElement.id = containerId
            containerElement.className = containerClassName
            if (containerStyle) {
              Object.assign(containerElement.style, containerStyle)
            }
            document.body.appendChild(containerElement)
          }

          if (onContainerCreate) {
            onContainerCreate(containerElement)
          }

          return containerElement
        }, [propContainer, containerId, containerClassName, containerStyle, createContainer, onContainerCreate])

        // 清理容器
        const cleanupPortalContainer = useCallback((containerElement: HTMLElement) => {
          if (onContainerDestroy) {
            onContainerDestroy(containerElement)
          }

          // 只有在是我们创建且没有自定义清理函数时才移除
          if (!createContainer && !propContainer && containerElement.parentNode) {
            containerElement.parentNode.removeChild(containerElement)
          }
        }, [onContainerDestroy, createContainer, propContainer])

        // 初始化容器
        useEffect(() => {
          if (typeof window === 'undefined') {
            // 服务端渲染
            if (ssr) {
              setPortalContainer(null)
              setIsContainerReady(true)
            }
            return
          }

          if (!enabled) {
            setPortalContainer(null)
            setIsContainerReady(false)
            return
          }

          const containerElement = createPortalContainer()
          setPortalContainer(containerElement)
          setIsContainerReady(true)

          return () => {
            if (containerElement) {
              cleanupPortalContainer(containerElement)
            }
          }
        }, [createPortalContainer, cleanupPortalContainer, enabled, ssr])

        // 更新容器
        const updateContainer = useCallback(() => {
          if (!enabled) return

          const containerElement = createPortalContainer()
          setPortalContainer(containerElement)
          setIsContainerReady(true)
        }, [createPortalContainer, enabled])

        // 获取传送门根节点
        const getPortalRoot = useCallback(() => {
          if (!portalContainer) return null

          const portalRoot = portalContainer.querySelector('[data-portal="true"]')
          return portalRoot as HTMLElement | null
        }, [portalContainer])

        // 传送门上下文
        const portalContext: PortalContextValue = {
          isInPortal: true,
          portalContainer,
          updateContainer,
          getPortalRoot,
        }

        // 传递给组件的增强props
        const enhancedProps = {
          ...props,
          ref,
          portalContainer: isContainerReady ? portalContainer : null,
          isInPortal: true,
          updateContainer,
          getPortalRoot,
          ...portalContext,
        }

        // 如果容器未准备好，渲染loading状态或null
        if (!isContainerReady) {
          if (ssr) {
            return <Component {...enhancedProps} />
          }
          return null
        }

        // 使用传送门渲染组件
        if (portalContainer && enabled) {
          // 如果有ref，需要将其转发到组件内部
          const ComponentWithRef = React.forwardRef<any, T>(
            (componentProps, componentRef) => (
              <PortalWrapper container={portalContainer} isEnabled={true}>
                <Component ref={componentRef} {...componentProps} />
              </PortalWrapper>
            )
          )

          ComponentWithRef.displayName = displayName
          return <ComponentWithRef {...enhancedProps} />
        }

        return <Component ref={ref} {...enhancedProps} />
      }
    )

    PortalComponent.displayName = displayName

    return PortalComponent
  }
}

// 便捷导出
export const WithPortal = withPortal({})

// 预设配置
export const withModalPortal = withPortal({
  containerId: 'modal-root',
  containerClassName: 'modal-portal',
})

export const withTooltipPortal = withPortal({
  containerId: 'tooltip-root',
  containerClassName: 'tooltip-portal',
})

export const withNotificationPortal = withPortal({
  containerId: 'notification-root',
  containerClassName: 'notification-portal',
})

export default withPortal
