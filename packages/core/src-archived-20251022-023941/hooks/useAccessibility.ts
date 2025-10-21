/**
 * 可访问性相关的React Hooks集合
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { generateAriaId, createFocusTrap, announceToScreenReader, KEYS } from '../utils/accessibility'

/**
 * 管理焦点陷阱的Hook
 */
export const useFocusTrap = (isActive: boolean = true) => {
  const containerRef = useRef<HTMLElement>(null)
  const focusTrapRef = useRef<ReturnType<typeof createFocusTrap> | null>(null)

  useEffect(() => {
    if (isActive && containerRef.current) {
      focusTrapRef.current = createFocusTrap(containerRef.current)
      focusTrapRef.current.activate()

      return () => {
        focusTrapRef.current?.deactivate()
      }
    }
  }, [isActive])

  return containerRef
}

/**
 * 管理ARIA live区域的Hook
 */
export const useAriaLive = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority)
  }, [])

  return { announce }
}

/**
 * 管理键盘导航的Hook
 */
export const useKeyboardNavigation = (
  items: Array<{ id: string; element?: HTMLElement; disabled?: boolean }>,
  options: {
    orientation?: 'vertical' | 'horizontal'
    loop?: boolean
    onSelect?: (id: string) => void
  } = {}
) => {
  const { orientation = 'vertical', loop = true, onSelect } = options
  const [activeId, setActiveId] = useState<string | null>(null)
  const containerRef = useRef<HTMLElement>(null)

  const getNextIndex = useCallback((currentIndex: number, direction: number) => {
    let nextIndex = currentIndex + direction

    if (loop) {
      if (nextIndex < 0) nextIndex = items.length - 1
      if (nextIndex >= items.length) nextIndex = 0
    } else {
      nextIndex = Math.max(0, Math.min(items.length - 1, nextIndex))
    }

    // 跳过禁用的项目
    while (items[nextIndex]?.disabled && nextIndex !== currentIndex) {
      nextIndex = nextIndex + direction
      if (loop) {
        if (nextIndex < 0) nextIndex = items.length - 1
        if (nextIndex >= items.length) nextIndex = 0
      } else {
        nextIndex = Math.max(0, Math.min(items.length - 1, nextIndex))
        if (nextIndex === currentIndex) break
      }
    }

    return nextIndex
  }, [items, loop])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const currentIndex = items.findIndex(item => item.id === activeId)
    if (currentIndex === -1) return

    let nextIndex = currentIndex

    switch (e.key) {
      case KEYS.ARROW_DOWN:
      case KEYS.ARROW_RIGHT:
        if (orientation === 'vertical' && e.key === KEYS.ARROW_RIGHT) return
        if (orientation === 'horizontal' && e.key === KEYS.ARROW_DOWN) return
        e.preventDefault()
        nextIndex = getNextIndex(currentIndex, 1)
        break

      case KEYS.ARROW_UP:
      case KEYS.ARROW_LEFT:
        if (orientation === 'vertical' && e.key === KEYS.ARROW_LEFT) return
        if (orientation === 'horizontal' && e.key === KEYS.ARROW_UP) return
        e.preventDefault()
        nextIndex = getNextIndex(currentIndex, -1)
        break

      case KEYS.HOME:
        e.preventDefault()
        nextIndex = 0
        break

      case KEYS.END:
        e.preventDefault()
        nextIndex = items.length - 1
        break

      case KEYS.ENTER:
      case KEYS.SPACE:
        e.preventDefault()
        if (activeId && !items[currentIndex]?.disabled) {
          onSelect?.(activeId)
        }
        return

      default:
        return
    }

    if (nextIndex !== currentIndex && items[nextIndex]?.element) {
      setActiveId(items[nextIndex].id)
      items[nextIndex].element?.focus()
    }
  }, [activeId, items, orientation, getNextIndex, onSelect])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    containerRef,
    activeId,
    setActiveId,
    focusItem: (id: string) => {
      const item = items.find(item => item.id === id)
      if (item?.element && !item.disabled) {
        setActiveId(id)
        item.element.focus()
      }
    }
  }
}

/**
 * 管理页面标题的Hook
 */
export const usePageTitle = (title: string) => {
  useEffect(() => {
    const originalTitle = document.title
    document.title = title

    return () => {
      document.title = originalTitle
    }
  }, [title])
}

/**
 * 管理跳过链接的Hook
 */
export const useSkipLink = (targetId: string) => {
  const [showSkipLink, setShowSkipLink] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KEYS.TAB) {
        setShowSkipLink(true)
      }
    }

    const handleMouseDown = () => {
      setShowSkipLink(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  const handleSkipClick = () => {
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.focus()
      targetElement.scrollIntoView()
    }
  }

  return { showSkipLink, handleSkipClick }
}

/**
 * 检测颜色对比度的Hook
 */
export const useColorContrast = (foreground: string, background: string) => {
  const [contrast, setContrast] = useState<{
    ratio: number
    passesWCAG: {
      AA: boolean
      AAA: boolean
      AALarge: boolean
      AAALarge: boolean
    }
  } | null>(null)

  useEffect(() => {
    // 这里会在后续实现中集成color-contrast-checker
    // 暂时返回模拟数据
    setContrast({
      ratio: 4.5,
      passesWCAG: {
        AA: true,
        AAA: false,
        AALarge: true,
        AAALarge: true
      }
    })
  }, [foreground, background])

  return contrast
}

/**
 * 管理ARIA属性的Hook
 */
export const useAriaProps = (props: Record<string, any>) => {
  const [ariaProps, setAriaProps] = useState<Record<string, any>>({})

  useEffect(() => {
    const filteredProps: Record<string, any> = {}

    Object.keys(props).forEach(key => {
      if (key.startsWith('aria-') || key.startsWith('data-')) {
        filteredProps[key] = props[key]
      }
    })

    setAriaProps(filteredProps)
  }, [props])

  return ariaProps
}

/**
 * 管理加载状态的可访问性Hook
 */
export const useLoadingAria = (isLoading: boolean, loadingMessage?: string) => {
  const { announce } = useAriaLive()

  useEffect(() => {
    if (isLoading && loadingMessage) {
      announce(loadingMessage, 'assertive')
    }
  }, [isLoading, loadingMessage, announce])

  return {
    'aria-busy': isLoading,
    'aria-live': isLoading ? 'polite' : undefined
  }
}