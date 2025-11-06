/**
 * @fileoverview withAccessibility HOC - 无障碍增强高阶组件
 * @description 为组件提供无障碍功能支持，包括ARIA属性、键盘导航、焦点管理等
 */

import React, { forwardRef, useEffect, useRef, useState, useMemo } from 'react'
import { HOC, ComponentType, FocusHandler } from '../types'

/**
 * 无障碍配置接口
 */
export interface AccessibilityConfig {
  role?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  ariaExpanded?: boolean
  ariaSelected?: boolean
  ariaDisabled?: boolean
  ariaHidden?: boolean
  tabIndex?: number
  enableFocusTrap?: boolean
  focusOnMount?: boolean
  focusOnUpdate?: boolean
  keyboardNavigation?: boolean
  skipToContent?: boolean
  liveRegion?: 'off' | 'polite' | 'assertive'
}

/**
 * 无障碍上下文接口
 */
export interface AccessibilityContextValue {
  id: string
  role: string
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  ariaExpanded?: boolean
  ariaSelected?: boolean
  ariaDisabled?: boolean
  ariaHidden?: boolean
  tabIndex: number
  isFocused: boolean
  focus: () => void
  blur: () => void
  registerAriaId: (id: string) => void
  announce: (message: string, priority?: 'polite' | 'assertive') => void
}

/**
 * 键盘导航配置
 */
export interface KeyboardNavigationConfig {
  keys?: string[]
  onKeyDown?: (event: KeyboardEvent) => void
  onKeyUp?: (event: KeyboardEvent) => void
  trapFocus?: boolean
  loopFocus?: boolean
}

/**
 * 生成唯一ID
 */
const generateId = (prefix: string = 'a11y'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * withAccessibility HOC - 为组件注入无障碍功能
 *
 * @param config 无障碍配置选项
 * @returns 高阶组件函数
 *
 * @example
 * ```tsx
 * const AccessibleButton = withAccessibility({
 *   role: 'button',
 *   ariaLabel: '提交表单',
 *   focusOnMount: true
 * })(Button)
 * ```
 */
export function withAccessibility<T extends Record<string, any> = {}>(
  config: AccessibilityConfig = {}
): HOC<T, T & AccessibilityContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      role,
      ariaLabel,
      ariaLabelledBy,
      ariaDescribedBy,
      ariaExpanded,
      ariaSelected,
      ariaDisabled,
      ariaHidden,
      tabIndex = 0,
      enableFocusTrap = false,
      focusOnMount = false,
      focusOnUpdate = false,
      keyboardNavigation = false,
      skipToContent = false,
      liveRegion = 'off',
    } = config

    const displayName = config.displayName || `withAccessibility(${Component.displayName || Component.name || 'Component'})`

    const AccessibilityComponent = forwardRef<any, T & AccessibilityContextValue>((props, ref) => {
      const {
        id: propId,
        onFocus: propOnFocus,
        onBlur: propOnBlur,
        onKeyDown: propOnKeyDown,
        onKeyUp: propOnKeyUp,
        ...componentProps
      } = props

      // 内部状态
      const [isFocused, setIsFocused] = useState(false)
      const [registeredIds, setRegisteredIds] = useState<string[]>([])

      // refs
      const elementRef = useRef<HTMLElement>(null)
      const focusTrapRef = useRef<HTMLElement[]>([])

      // 生成唯一ID
      const elementId = useMemo(() => {
        return propId || generateId('a11y')
      }, [propId])

      // 焦点管理
      const focus = useMemo(() => {
        return () => {
          if (elementRef.current) {
            elementRef.current.focus()
          }
        }
      }, [])

      const blur = useMemo(() => {
        return () => {
          if (elementRef.current) {
            elementRef.current.blur()
          }
        }
      }, [])

      // 注册ARIA ID
      const registerAriaId = useMemo(() => {
        return (id: string) => {
          setRegisteredIds(prev => [...prev, id])
        }
      }, [])

      // 公告消息到实时区域
      const announce = useMemo(() => {
        return (message: string, priority: 'polite' | 'assertive' = 'polite') => {
          const announcement = document.createElement('div')
          announcement.setAttribute('aria-live', priority)
          announcement.setAttribute('aria-atomic', 'true')
          announcement.setAttribute('class', 'sr-only')
          announcement.textContent = message

          document.body.appendChild(announcement)

          setTimeout(() => {
            document.body.removeChild(announcement)
          }, 1000)
        }
      }, [])

      // 焦点陷阱管理
      useEffect(() => {
        if (enableFocusTrap && isFocused) {
          const trapElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as NodeListOf<HTMLElement>

          focusTrapRef.current = Array.from(trapElements)

          if (focusTrapRef.current.length > 0) {
            const firstElement = focusTrapRef.current[0]
            const lastElement = focusTrapRef.current[focusTrapRef.current.length - 1]

            const handleTabKey = (e: KeyboardEvent) => {
              if (e.key === 'Tab') {
                if (e.shiftKey) {
                  if (document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement.focus()
                  }
                } else {
                  if (document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement.focus()
                  }
                }
              }
            }

            document.addEventListener('keydown', handleTabKey)

            return () => {
              document.removeEventListener('keydown', handleTabKey)
            }
          }
        }
      }, [enableFocusTrap, isFocused])

      // 键盘导航处理
      useEffect(() => {
        if (keyboardNavigation && elementRef.current) {
          const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
              case 'Enter':
              case ' ':
                if (elementRef.current?.tagName === 'BUTTON') {
                  e.preventDefault()
                  elementRef.current.click()
                }
                break
              case 'ArrowUp':
              case 'ArrowDown':
              case 'ArrowLeft':
              case 'ArrowRight':
                // 实现方向键导航逻辑
                const siblingElements = Array.from(
                  elementRef.current.parentElement?.children || []
                ) as HTMLElement[]

                const currentIndex = siblingElements.indexOf(elementRef.current!)

                let nextIndex
                if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                  nextIndex = currentIndex > 0 ? currentIndex - 1 : siblingElements.length - 1
                } else {
                  nextIndex = currentIndex < siblingElements.length - 1 ? currentIndex + 1 : 0
                }

                if (siblingElements[nextIndex]) {
                  e.preventDefault()
                  siblingElements[nextIndex].focus()
                }
                break
              case 'Escape':
                if (elementRef.current?.hasAttribute('aria-expanded')) {
                  elementRef.current.setAttribute('aria-expanded', 'false')
                }
                break
            }

            if (propOnKeyDown) {
              propOnKeyDown(e)
            }
          }

          const handleKeyUp = (e: KeyboardEvent) => {
            if (propOnKeyUp) {
              propOnKeyUp(e)
            }
          }

          elementRef.current.addEventListener('keydown', handleKeyDown)
          elementRef.current.addEventListener('keyup', handleKeyUp)

          return () => {
            if (elementRef.current) {
              elementRef.current.removeEventListener('keydown', handleKeyDown)
              elementRef.current.removeEventListener('keyup', handleKeyUp)
            }
          }
        }
      }, [keyboardNavigation, propOnKeyDown, propOnKeyUp])

      // 挂载时焦点
      useEffect(() => {
        if (focusOnMount && elementRef.current) {
          setTimeout(() => {
            elementRef.current?.focus()
          }, 0)
        }
      }, [focusOnMount])

      // 处理焦点事件
      const handleFocus = (e: React.FocusEvent) => {
        setIsFocused(true)
        if (propOnFocus) {
          propOnFocus(e)
        }
      }

      const handleBlur = (e: React.FocusEvent) => {
        setIsFocused(false)
        if (propOnBlur) {
          propOnBlur(e)
        }
      }

      // 无障碍上下文
      const accessibilityContext = useMemo<AccessibilityContextValue>(() => ({
        id: elementId,
        role: role || '',
        ariaLabel,
        ariaLabelledBy,
        ariaDescribedBy,
        ariaExpanded,
        ariaSelected,
        ariaDisabled,
        ariaHidden,
        tabIndex: ariaDisabled ? -1 : tabIndex,
        isFocused,
        focus: focus(),
        blur: blur(),
        registerAriaId,
        announce,
      }), [
        elementId,
        role,
        ariaLabel,
        ariaLabelledBy,
        ariaDescribedBy,
        ariaExpanded,
        ariaSelected,
        ariaDisabled,
        ariaHidden,
        tabIndex,
        isFocused,
        focus,
        blur,
        registerAriaId,
        announce,
      ])

      // 传递给组件的增强props
      const enhancedProps = {
        ...componentProps,
        id: elementId,
        ref: (node: HTMLElement) => {
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
          elementRef.current = node
        },
        role,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        'aria-describedby': ariaDescribedBy,
        'aria-expanded': ariaExpanded,
        'aria-selected': ariaSelected,
        'aria-disabled': ariaDisabled,
        'aria-hidden': ariaHidden,
        tabIndex: ariaDisabled ? -1 : tabIndex,
        onFocus: handleFocus,
        onBlur: handleBlur,
        ...accessibilityContext,
      }

      return <Component {...enhancedProps} />
    })

    AccessibilityComponent.displayName = displayName

    return AccessibilityComponent
  }
}

// 便捷导出
export const WithAccessibility = withAccessibility({})

// 常用无障碍配置预设
export const withButtonA11y = withAccessibility({
  role: 'button',
  keyboardNavigation: true,
})

export const withDialogA11y = withAccessibility({
  role: 'dialog',
  ariaModal: true,
  enableFocusTrap: true,
  focusOnMount: true,
})

export const withFormFieldA11y = withAccessibility({
  keyboardNavigation: true,
  ariaDescribedBy: true,
})

export default withAccessibility
