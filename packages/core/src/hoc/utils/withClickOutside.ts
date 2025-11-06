/**
 * @fileoverview withClickOutside HOC - 点击外部检测高阶组件
 * @description 检测点击事件是否发生在组件外部，常用于下拉菜单、模态框等
 */

import React, { useEffect, useRef, useCallback } from 'react'
import { HOC, ComponentType, ClickHandler } from '../types'

/**
 * 点击外部配置
 */
export interface ClickOutsideConfig {
  /**
   * 点击外部时的处理函数
   */
  onClickOutside: ClickHandler

  /**
   * 是否在组件挂载后立即触发检测
   */
  detectMounted?: boolean

  /**
   * 事件类型
   */
  eventType?: 'click' | 'mousedown' | 'mouseup'

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 排除的元素选择器
   */
  excludeSelectors?: string[]

  /**
   * 包含的元素选择器
   */
  includeSelectors?: string[]
}

/**
 * withClickOutside HOC - 检测点击外部事件
 *
 * @param config 点击外部配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const DropdownMenu = withClickOutside({
 *   onClickOutside: () => setIsOpen(false),
 *   excludeSelectors: ['.dropdown-toggle']
 * })(BaseDropdown)
 * ```
 */
export function withClickOutside<T extends Record<string, any> = {}>(
  config: ClickOutsideConfig
): HOC<T, T & { handleClickOutside: ClickHandler }> {
  return function(Component: ComponentType<T>) {
    const {
      onClickOutside,
      detectMounted = false,
      eventType = 'click',
      disabled = false,
      excludeSelectors = [],
      includeSelectors = [],
    } = config

    const displayName = `withClickOutside(${Component.displayName || Component.name || 'Component'})`

    const ClickOutsideComponent = React.forwardRef<any, T & { handleClickOutside: ClickHandler }>(
      (props, ref) => {
        const componentRef = useRef<HTMLElement>(null)
        const clickHandlerRef = useRef<ClickHandler | null>(null)

        // 创建点击外部处理器
        const handleClickOutside = useCallback((event: MouseEvent | React.MouseEvent) => {
          if (disabled) return

          const target = event.target as Element
          const componentElement = componentRef.current

          if (!componentElement) return

          // 检查点击是否在组件内部
          const isInside = componentElement.contains(target)

          if (!isInside) {
            // 检查是否在排除列表中
            const isExcluded = excludeSelectors.some(selector => {
              try {
                return target.closest(selector) !== null
              } catch {
                return false
              }
            })

            if (isExcluded) return

            // 检查是否在包含列表中（如果指定了包含列表）
            if (includeSelectors.length > 0) {
              const isIncluded = includeSelectors.some(selector => {
                try {
                  return target.closest(selector) !== null
                } catch {
                  return false
                }
              })

              if (!isIncluded) return
            }

            // 触发外部点击事件
            if (onClickOutside) {
              onClickOutside(event)
            }

            // 调用引用处理函数
            if (clickHandlerRef.current) {
              clickHandlerRef.current(event)
            }
          }
        }, [onClickOutside, disabled, excludeSelectors, includeSelectors])

        // 存储点击处理器
        clickHandlerRef.current = handleClickOutside

        // 绑定事件监听器
        useEffect(() => {
          if (disabled) return

          const documentElement = document.documentElement

          const handleGlobalClick = (event: MouseEvent) => {
            handleClickOutside(event)
          }

          documentElement.addEventListener(eventType, handleGlobalClick, true)

          return () => {
            documentElement.removeEventListener(eventType, handleGlobalClick, true)
          }
        }, [handleClickOutside, eventType, disabled])

        // 组件挂载后的检测
        useEffect(() => {
          if (detectMounted && !disabled) {
            // 延迟检测，确保组件完全渲染
            const timeoutId = setTimeout(() => {
              const handleMountedClick = (event: MouseEvent) => {
                handleClickOutside(event)
              }
              document.addEventListener(eventType, handleMountedClick, true)
            }, 0)

            return () => clearTimeout(timeoutId)
          }
        }, [detectMounted, handleClickOutside, eventType, disabled])

        // 传递给组件的增强props
        const enhancedProps = {
          ...props,
          ref: (node: HTMLElement) => {
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
            componentRef.current = node
          },
          handleClickOutside,
        }

        return <Component {...enhancedProps} />
      }
    )

    ClickOutsideComponent.displayName = displayName

    return ClickOutsideComponent
  }
}

// 便捷导出
export const WithClickOutside = withClickOutside

export default withClickOutside
