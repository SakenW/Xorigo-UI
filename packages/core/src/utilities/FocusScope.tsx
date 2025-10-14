import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react'

export interface FocusScopeProps {
  /** 子元素 */
  children: React.ReactNode
  /** 是否启用焦点范围 */
  enabled?: boolean
  /** 是否自动聚焦 */
  autoFocus?: boolean
  /** 初始聚焦元素选择器 */
  initialFocus?: string
  /** 焦点进入回调 */
  onFocusEnter?: (event: FocusEvent) => void
  /** 焦点离开回调 */
  onFocusLeave?: (event: FocusEvent) => void
  /** 焦点变化回调 */
  onFocusChange?: (element: HTMLElement | null) => void
  /** 是否循环焦点 */
  loop?: boolean
  /** 自定义容器 */
  container?: HTMLElement | null
}

export const FocusScope = forwardRef<HTMLDivElement, FocusScopeProps>(
  ({
    children,
    enabled = true,
    autoFocus = false,
    initialFocus,
    onFocusEnter,
    onFocusLeave,
    onFocusChange,
    loop = false,
    container,
    ...props
  }, ref) => {
    const scopeRef = useRef<HTMLDivElement>(null)
    const [isFocused, setIsFocused] = useState(false)
    const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null)
    const previousFocusedElement = useRef<HTMLElement | null>(null)

    // 合并refs
    const mergedRef = React.useCallback((node: HTMLDivElement) => {
      scopeRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }, [ref])

    // 获取焦点元素列表
    const getFocusableElements = useCallback((): HTMLElement[] => {
      if (!scopeRef.current) return []

      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([type="hidden"]):not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ].join(', ')

      return Array.from(scopeRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[]
    }, [])

    // 获取第一个可聚焦元素
    const getFirstFocusableElement = useCallback((): HTMLElement | null => {
      const elements = getFocusableElements()
      return elements.length > 0 ? elements[0] : null
    }, [getFocusableElements])

    // 获取最后一个可聚焦元素
    const getLastFocusableElement = useCallback((): HTMLElement | null => {
      const elements = getFocusableElements()
      return elements.length > 0 ? elements[elements.length - 1] : null
    }, [getFocusableElements])

    // 设置初始焦点
    const setInitialFocus = useCallback(() => {
      if (!autoFocus || !scopeRef.current) return

      let targetElement: HTMLElement | null = null

      if (initialFocus) {
        targetElement = scopeRef.current.querySelector(initialFocus) as HTMLElement
      }

      if (!targetElement) {
        targetElement = getFirstFocusableElement()
      }

      if (targetElement) {
        targetElement.focus()
      }
    }, [autoFocus, initialFocus, getFirstFocusableElement])

    // 焦点进入处理
    const handleFocusIn = useCallback((event: FocusEvent) => {
      if (!enabled) return

      setIsFocused(true)
      setFocusedElement(event.target as HTMLElement)
      onFocusEnter?.(event)
      onFocusChange?.(event.target as HTMLElement)
    }, [enabled, onFocusEnter, onFocusChange])

    // 焦点离开处理
    const handleFocusOut = useCallback((event: FocusEvent) => {
      if (!enabled) return

      // 检查焦点是否真的离开了范围
      const relatedTarget = event.relatedTarget as HTMLElement
      if (scopeRef.current && relatedTarget && !scopeRef.current.contains(relatedTarget)) {
        setIsFocused(false)
        setFocusedElement(null)
        onFocusLeave?.(event)
        onFocusChange?.(null)
      }
    }, [enabled, onFocusLeave, onFocusChange])

    // 键盘导航处理
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
      if (!enabled || !loop || !scopeRef.current) return

      if (event.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const currentElement = document.activeElement as HTMLElement

      if (event.shiftKey) {
        // Shift + Tab
        if (currentElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (currentElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }, [enabled, loop, getFocusableElements])

    // 程序化聚焦到下一个元素
    const focusNext = useCallback(() => {
      if (!scopeRef.current) return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const currentElement = document.activeElement as HTMLElement
      const currentIndex = focusableElements.indexOf(currentElement)
      const nextIndex = (currentIndex + 1) % focusableElements.length

      focusableElements[nextIndex].focus()
    }, [getFocusableElements])

    // 程序化聚焦到上一个元素
    const focusPrevious = useCallback(() => {
      if (!scopeRef.current) return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const currentElement = document.activeElement as HTMLElement
      const currentIndex = focusableElements.indexOf(currentElement)
      const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1

      focusableElements[prevIndex].focus()
    }, [getFocusableElements])

    // 聚焦到第一个元素
    const focusFirst = useCallback(() => {
      const firstElement = getFirstFocusableElement()
      if (firstElement) {
        firstElement.focus()
      }
    }, [getFirstFocusableElement])

    // 聚焦到最后一个元素
    const focusLast = useCallback(() => {
      const lastElement = getLastFocusableElement()
      if (lastElement) {
        lastElement.focus()
      }
    }, [getLastFocusableElement])

    // 清理焦点
    const clearFocus = useCallback(() => {
      if (focusedElement && focusedElement.blur) {
        focusedElement.blur()
      }
      setFocusedElement(null)
    }, [focusedElement])

    // 暴露的方法
    React.useImperativeHandle(ref, () => ({
      ...scopeRef.current,
      focusNext,
      focusPrevious,
      focusFirst,
      focusLast,
      clearFocus,
      getFocusableElements,
      isFocused,
      focusedElement,
    }), [focusNext, focusPrevious, focusFirst, focusLast, clearFocus, getFocusableElements, isFocused, focusedElement])

    // 设置初始焦点
    useEffect(() => {
      if (enabled && autoFocus) {
        setInitialFocus()
      }
    }, [enabled, autoFocus, setInitialFocus])

    // 监听键盘事件
    useEffect(() => {
      if (!enabled) return

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [enabled, handleKeyDown])

    return (
      <div
        ref={mergedRef}
        onFocusIn={handleFocusIn}
        onFocusOut={handleFocusOut}
        tabIndex={enabled ? -1 : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)

FocusScope.displayName = 'FocusScope'

// 自动聚焦焦点范围组件
export interface AutoFocusScopeProps extends Omit<FocusScopeProps, 'autoFocus'> {}

export const AutoFocusScope = forwardRef<HTMLDivElement, AutoFocusScopeProps>(
  (props, ref) => <FocusScope ref={ref} autoFocus={true} {...props} />
)

AutoFocusScope.displayName = 'AutoFocusScope'

// 循环焦点范围组件
export interface LoopFocusScopeProps extends Omit<FocusScopeProps, 'loop'> {}

export const LoopFocusScope = forwardRef<HTMLDivElement, LoopFocusScopeProps>(
  (props, ref) => <FocusScope ref={ref} loop={true} {...props} />
)

LoopFocusScope.displayName = 'LoopFocusScope'

// 可控焦点范围组件
export interface ControlledFocusScopeProps extends Omit<FocusScopeProps, 'enabled'> {
  /** 是否启用焦点范围 */
  active: boolean
}

export const ControlledFocusScope = forwardRef<HTMLDivElement, ControlledFocusScopeProps>(
  ({ active, ...props }, ref) => <FocusScope ref={ref} enabled={active} {...props} />
)

ControlledFocusScope.displayName = 'ControlledFocusScope'