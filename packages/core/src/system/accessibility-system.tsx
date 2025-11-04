/**
 * 🎭 可访问性系统 - v2025.11.03
 *
 * 聚焦管理、ARIA辅助、跳转链接支持
 * 屏幕阅读器优化、键盘导航增强
 *
 * @version 2025.11.03
 * @category System
 * @layer system
 */

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

/**
 * 可访问性上下文接口
 */
export interface AccessibilityContextValue {
  // 焦点管理
  focusedElement: HTMLElement | null
  focusElement: (element: HTMLElement | null) => void
  blurElement: () => void

  // 屏幕阅读器
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void

  // 键盘导航
  keyboardNavigation: {
    enabled: boolean
    trapFocus: boolean
    restoreFocus: boolean
  }

  // 可见性偏好
  preferences: {
    reducedMotion: boolean
    highContrast: boolean
    prefersDark: boolean
  }

  // 工具方法
  skipToMain: () => void
  resetFocus: () => void
}

/**
 * 可访问性上下文
 */
export const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined)

/**
 * 可访问性提供者组件
 */
export function AccessibilityProvider({
  children,
  enableKeyboardNavigation = true,
  enableFocusTrap = true,
  enableScreenReaderAnnouncements = true
}: {
  children: React.ReactNode
  enableKeyboardNavigation?: boolean
  enableFocusTrap?: boolean
  enableScreenReaderAnnouncements?: boolean
}) {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null)
  const [keyboardNavigation, setKeyboardNavigation] = useState({
    enabled: enableKeyboardNavigation,
    trapFocus: enableFocusTrap,
    restoreFocus: true
  })
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    prefersDark: false
  })

  // 监听可访问性偏好
  useEffect(() => {
    const updatePreferences = () => {
      setPreferences({
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        highContrast: window.matchMedia('(prefers-contrast: high)').matches ||
                      window.matchMedia('(prefers-contrast: more)').matches,
        prefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches
      })
    }

    updatePreferences()

    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-contrast: more)'),
      window.matchMedia('(prefers-color-scheme: dark)')
    ]

    mediaQueries.forEach(mq => {
      mq.addEventListener('change', updatePreferences)
    })

    return () => {
      mediaQueries.forEach(mq => {
        mq.removeEventListener('change', updatePreferences)
      })
    }
  }, [])

  // 全局键盘事件处理
  useEffect(() => {
    if (!keyboardNavigation.enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Tab 键导航增强
      if (event.key === 'Tab') {
        document.body.setAttribute('data-keyboard-navigation', 'true')
      }

      // Escape 键清除焦点
      if (event.key === 'Escape') {
        setFocusedElement(null)
        document.body.removeAttribute('data-keyboard-navigation')
      }

      // Alt + S 跳转到主内容
      if (event.altKey && event.key === 's') {
        event.preventDefault()
        skipToMainContent()
      }
    }

    const handleMouseDown = () => {
      document.body.removeAttribute('data-keyboard-navigation')
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [keyboardNavigation.enabled])

  const focusElement = (element: HTMLElement | null) => {
    setFocusedElement(element)
    if (element) {
      element.focus()
    }
  }

  const blurElement = () => {
    if (focusedElement) {
      focusedElement.blur()
    }
    setFocusedElement(null)
  }

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!enableScreenReaderAnnouncements) return

    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.style.position = 'absolute'
    announcement.style.left = '-10000px'
    announcement.style.width = '1px'
    announcement.style.height = '1px'
    announcement.style.overflow = 'hidden'

    announcement.textContent = message
    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  const skipToMain = () => {
    skipToMainContent()
  }

  const resetFocus = () => {
    setFocusedElement(null)
  }

  const value: AccessibilityContextValue = {
    focusedElement,
    focusElement,
    blurElement,
    announceToScreenReader,
    keyboardNavigation,
    preferences,
    skipToMain,
    resetFocus
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

/**
 * 使用可访问性的 Hook
 */
export function useAccessibility(): AccessibilityContextValue {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

/**
 * 跳转到主内容
 */
function skipToMainContent() {
  const mainContent = document.getElementById('main-content') ||
                     document.querySelector('main') ||
                     document.querySelector('[role="main"]')

  if (mainContent) {
    mainContent.focus()
    mainContent.scrollIntoView()

    // 为屏幕阅读器用户宣布跳转
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.style.position = 'absolute'
    announcement.style.left = '-10000px'
    announcement.textContent = '已跳转到主内容'
    document.body.appendChild(announcement)

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement)
      }
    }, 1000)
  }
}

/**
 * 跳转导航链接组件
 */
export function SkipLink({
  href = '#main-content',
  children = '跳转到主内容',
  className = ''
}: {
  href?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:p-4 focus:rounded focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
      onClick={(e) => {
        e.preventDefault()
        skipToMainContent()
      }}
    >
      {children}
    </a>
  )
}

/**
 * 焦点陷阱 Hook
 */
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // 保存当前焦点元素
    previousActiveElement.current = document.activeElement as HTMLElement

    // 聚焦到第一个元素
    firstElement?.focus()

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)

    return () => {
      container.removeEventListener('keydown', handleTabKey)

      // 恢复焦点
      if (previousActiveElement.current && document.contains(previousActiveElement.current)) {
        previousActiveElement.current.focus()
      }
    }
  }, [isActive])

  return containerRef
}

/**
 * 屏幕阅读器公告组件
 */
export function ScreenReaderAnnouncement({
  message,
  priority = 'polite',
  timeout = 1000
}: {
  message: string
  priority?: 'polite' | 'assertive'
  timeout?: number
}) {
  const { announceToScreenReader } = useAccessibility()

  useEffect(() => {
    announceToScreenReader(message, priority)
  }, [message, priority, announceToScreenReader])

  return null
}

/**
 * 可见性文本组件（仅屏幕阅读器可见）
 */
export function VisuallyHidden({
  children,
  as: Component = 'span',
  ...props
}: {
  children: React.ReactNode
  as?: React.ElementType
  [key: string]: any
}) {
  return (
    <Component
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0
      }}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * 实时区域组件
 */
export function LiveRegion({
  children,
  polite = true,
  atomic = false
}: {
  children: React.ReactNode
  polite?: boolean
  atomic?: boolean
}) {
  return (
    <div
      aria-live={polite ? 'polite' : 'assertive'}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  )
}

/**
 * 可访问性工具类
 */
export class AccessibilityHelper {
  /**
   * 生成唯一 ID
   */
  static generateId(prefix = 'xorigo'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 检查元素是否可聚焦
   */
  static isFocusable(element: HTMLElement): boolean {
    if (element.disabled || element.hidden) return false

    const tagName = element.tagName.toLowerCase()
    const isFocusableTag = ['input', 'select', 'textarea', 'button', 'a'].includes(tagName)
    const hasTabIndex = element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '-1'
    const isContentEditable = element.getAttribute('contenteditable') === 'true'

    return isFocusableTag || hasTabIndex || isContentEditable
  }

  /**
   * 获取所有可聚焦元素
   */
  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
    ) as NodeListOf<HTMLElement>

    return Array.from(focusableElements).filter(el => !this.isElementHidden(el))
  }

  /**
   * 检查元素是否隐藏
   */
  static isElementHidden(element: HTMLElement): boolean {
    if (element.hidden) return true

    const style = window.getComputedStyle(element)
    return style.display === 'none' ||
           style.visibility === 'hidden' ||
           style.opacity === '0' ||
           element.offsetParent === null
  }

  /**
   * 设置 ARIA 属性
   */
  static setAriaAttributes(element: HTMLElement, attributes: Record<string, string>) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(`aria-${key}`, value)
    })
  }

  /**
   * 移除 ARIA 属性
   */
  static removeAriaAttributes(element: HTMLElement, attributes: string[]) {
    attributes.forEach(attr => {
      element.removeAttribute(`aria-${attr}`)
    })
  }

  /**
   * 验证可访问性
   */
  static validateAccessibility(element: HTMLElement): {
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    // 检查图片 alt 属性
    const images = element.querySelectorAll('img')
    images.forEach(img => {
      if (!img.getAttribute('alt')) {
        warnings.push('图片缺少 alt 属性')
      }
    })

    // 检查链接文本
    const links = element.querySelectorAll('a')
    links.forEach(link => {
      if (!link.textContent?.trim()) {
        errors.push('链接缺少描述性文本')
      }
    })

    // 检查表单标签
    const inputs = element.querySelectorAll('input, select, textarea')
    inputs.forEach(input => {
      const hasLabel = element.querySelector(`label[for="${input.id}"]`) ||
                       input.getAttribute('aria-label') ||
                       input.getAttribute('aria-labelledby')

      if (!hasLabel) {
        warnings.push('表单控件缺少标签')
      }
    })

    // 检查标题层级
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let lastLevel = 0
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1))
      if (level > lastLevel + 1) {
        warnings.push('标题层级跳跃过大')
      }
      lastLevel = level
    })

    return { errors, warnings }
  }

  /**
   * 创建键盘导航映射
   */
  static createKeyboardMap(keyMap: Record<string, () => void>) {
    return (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const modifierKey = event.ctrlKey ? 'ctrl+' :
                         event.altKey ? 'alt+' :
                         event.shiftKey ? 'shift+' : ''
      const fullKey = `${modifierKey}${key}`

      if (keyMap[fullKey]) {
        event.preventDefault()
        keyMap[fullKey]()
      } else if (keyMap[key]) {
        event.preventDefault()
        keyMap[key]()
      }
    }
  }
}