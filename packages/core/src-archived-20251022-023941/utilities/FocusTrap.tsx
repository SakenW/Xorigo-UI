import React, { forwardRef, useEffect, useRef, useState } from 'react'

export interface FocusTrapProps {
  /** 子元素 */
  children: React.ReactNode
  /** 是否启用焦点陷阱 */
  enabled?: boolean
  /** 初始聚焦元素选择器 */
  initialFocus?: string
  /** 恢复聚焦元素选择器 */
  restoreFocus?: string
  /** 禁用状态下的处理函数 */
  onDisable?: () => void
  /** 激活状态下的处理函数 */
  onActivate?: () => void
  /** 自定义容器 */
  container?: HTMLElement | null
}

export const FocusTrap = forwardRef<HTMLDivElement, FocusTrapProps>(
  ({
    children,
    enabled = true,
    initialFocus,
    restoreFocus,
    onDisable,
    onActivate,
    container,
    ...props
  }, ref) => {
    const trapRef = useRef<HTMLDivElement>(null)
    const previousActiveElement = useRef<HTMLElement | null>(null)
    const [isActivated, setIsActivated] = useState(false)

    // 合并refs
    const mergedRef = React.useCallback((node: HTMLDivElement) => {
      trapRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }, [ref])

    // 获取焦点元素列表
    const getFocusableElements = useCallback((container: HTMLElement): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([type="hidden"]):not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ].join(', ')

      return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[]
    }, [])

    // 获取第一个可聚焦元素
    const getFirstFocusableElement = useCallback((container: HTMLElement): HTMLElement | null => {
      const elements = getFocusableElements(container)
      return elements.length > 0 ? elements[0] : null
    }, [getFocusableElements])

    // 获取最后一个可聚焦元素
    const getLastFocusableElement = useCallback((container: HTMLElement): HTMLElement | null => {
      const elements = getFocusableElements(container)
      return elements.length > 0 ? elements[elements.length - 1] : null
    }, [getFocusableElements])

    // 设置初始焦点
    const setInitialFocus = useCallback(() => {
      if (!trapRef.current) return

      let targetElement: HTMLElement | null = null

      if (initialFocus) {
        targetElement = trapRef.current.querySelector(initialFocus) as HTMLElement
      }

      if (!targetElement) {
        targetElement = getFirstFocusableElement(trapRef.current)
      }

      if (targetElement) {
        targetElement.focus()
      }
    }, [initialFocus, getFirstFocusableElement])

    // 恢复焦点
    const restoreFocusToElement = useCallback(() => {
      if (restoreFocus && trapRef.current) {
        const restoreElement = trapRef.current.querySelector(restoreFocus) as HTMLElement
        if (restoreElement) {
          restoreElement.focus()
          return
        }
      }

      if (previousActiveElement.current && previousActiveElement.current.focus) {
        previousActiveElement.current.focus()
      }
    }, [restoreFocus])

    // 激活焦点陷阱
    const activate = useCallback(() => {
      if (!enabled || !trapRef.current) return

      // 保存当前活动元素
      previousActiveElement.current = document.activeElement as HTMLElement

      // 设置初始焦点
      setInitialFocus()

      setIsActivated(true)
      onActivate?.()
    }, [enabled, setInitialFocus, onActivate])

    // 禁用焦点陷阱
    const deactivate = useCallback(() => {
      if (!isActivated) return

      // 恢复焦点
      restoreFocusToElement()

      setIsActivated(false)
      onDisable?.()
    }, [isActivated, restoreFocusToElement, onDisable])

    // 键盘事件处理
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
      if (!enabled || !trapRef.current || event.key !== 'Tab') return

      const focusableElements = getFocusableElements(trapRef.current)

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }, [enabled, getFocusableElements])

    // 监听键盘事件
    useEffect(() => {
      if (!enabled || !isActivated) return

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [enabled, isActivated, handleKeyDown])

    // 激活/禁用焦点陷阱
    useEffect(() => {
      if (enabled) {
        activate()
      } else {
        deactivate()
      }

      return () => {
        if (isActivated) {
          deactivate()
        }
      }
    }, [enabled, activate, deactivate, isActivated])

    // 监听容器变化
    useEffect(() => {
      if (!enabled || !trapRef.current) return

      const observer = new MutationObserver(() => {
        // 当DOM变化时，重新检查焦点
        if (document.activeElement && !trapRef.current?.contains(document.activeElement)) {
          setInitialFocus()
        }
      })

      observer.observe(trapRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'tabindex']
      })

      return () => observer.disconnect()
    }, [enabled, setInitialFocus])

    return (
      <div ref={mergedRef} {...props}>
        {children}
      </div>
    )
  }
)

FocusTrap.displayName = 'FocusTrap'

// 自动焦点陷阱组件（用于模态框等）
export interface AutoFocusTrapProps extends Omit<FocusTrapProps, 'enabled'> {}

export const AutoFocusTrap = forwardRef<HTMLDivElement, AutoFocusTrapProps>(
  (props, ref) => <FocusTrap ref={ref} enabled={true} {...props} />
)

AutoFocusTrap.displayName = 'AutoFocusTrap'

// 条件焦点陷阱组件
export interface ConditionalFocusTrapProps extends FocusTrapProps {
  /** 条件 */
  condition: boolean
}

export const ConditionalFocusTrap = forwardRef<HTMLDivElement, ConditionalFocusTrapProps>(
  ({ condition, ...props }, ref) => (
    <FocusTrap ref={ref} enabled={condition} {...props} />
  )
)

ConditionalFocusTrap.displayName = 'ConditionalFocusTrap'