'use client'

import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { cn } from '../foundations/utils/cn'

// =============================================================================
// ARIA 属性生成器
// =============================================================================

export interface ComponentAriaAttributes {
  role?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-pressed'?: boolean
  'aria-selected'?: boolean
  'aria-disabled'?: boolean
  'aria-busy'?: boolean
  'aria-required'?: boolean
  'aria-invalid'?: boolean
  'aria-hidden'?: boolean
  'aria-modal'?: boolean
  'aria-live'?: 'polite' | 'assertive' | 'off'
  'aria-atomic'?: boolean
}

export function generateAriaProps(
  componentType: string,
  props: Record<string, any>
): ComponentAriaAttributes {
  const ariaProps: ComponentAriaAttributes = {}

  switch (componentType) {
    case 'Button':
      ariaProps.role = 'button'
      if (props.disabled) ariaProps['aria-disabled'] = true
      if (props.loading) {
        ariaProps['aria-busy'] = true
        ariaProps['aria-label'] = props['aria-label'] || 'Loading, please wait'
      }
      if (props['aria-expanded'] !== undefined) {
        ariaProps['aria-expanded'] = props['aria-expanded']
      }
      if (props['aria-pressed'] !== undefined) {
        ariaProps['aria-pressed'] = props['aria-pressed']
      }
      break

    case 'Input':
      if (props.error) {
        ariaProps['aria-invalid'] = true
        ariaProps['aria-describedby'] = props.errorId || 'error-message'
      }
      if (props.required) ariaProps['aria-required'] = true
      if (props.label && !props['aria-label'] && !props['aria-labelledby']) {
        ariaProps['aria-label'] = props.label
      }
      if (props.type === 'search') ariaProps.role = 'searchbox'
      break

    case 'Modal':
      ariaProps.role = 'dialog'
      ariaProps['aria-modal'] = true
      ariaProps['aria-labelledby'] = props.titleId || 'modal-title'
      ariaProps['aria-describedby'] = props.descriptionId || 'modal-description'
      break

    case 'Dropdown':
      ariaProps.role = 'button'
      ariaProps['aria-expanded'] = props.isOpen
      ariaProps['aria-haspopup'] = 'listbox'
      if (props.selectedOption) {
        ariaProps['aria-label'] = props.selectedOption
      }
      break

    case 'Checkbox':
      ariaProps.role = 'checkbox'
      ariaProps['aria-checked'] = props.checked
      if (props.required) ariaProps['aria-required'] = true
      if (props.disabled) ariaProps['aria-disabled'] = true
      break

    case 'Radio':
      ariaProps.role = 'radio'
      ariaProps['aria-checked'] = props.checked
      ariaProps['aria-selected'] = props.checked
      break

    case 'Tab':
      ariaProps.role = 'tab'
      ariaProps['aria-selected'] = props.selected
      ariaProps['aria-disabled'] = props.disabled
      break

    case 'TabPanel':
      ariaProps.role = 'tabpanel'
      if (props.labelledBy) ariaProps['aria-labelledby'] = props.labelledBy
      break

    case 'Link':
      ariaProps.role = 'link'
      if (props.external) {
        ariaProps['aria-label'] = props['aria-label'] || 'External link'
      }
      break
  }

  return ariaProps
}

// =============================================================================
// 键盘导航生成器
// =============================================================================

export interface KeyboardHandlers {
  onKeyDown?: (event: React.KeyboardEvent) => void
  onKeyUp?: (event: React.KeyboardEvent) => void
  onKeyPress?: (event: React.KeyboardEvent) => void
}

export function generateKeyboardNavigation(
  componentType: string,
  customHandlers?: Record<string, Function>
): KeyboardHandlers {
  const handlers: KeyboardHandlers = {}

  switch (componentType) {
    case 'Button':
      handlers.onKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
          case 'Enter':
          case ' ':
            event.preventDefault()
            ;(event.target as HTMLElement).click()
            break
          case 'Tab':
            // 允许默认 Tab 行为
            break
          default:
            customHandlers?.onKeyDown?.(event)
        }
      }
      break

    case 'Dropdown':
      handlers.onKeyDown = (event: React.KeyboardEvent) => {
        const { isOpen, onSelect, onOpen, onClose, onNavigate } = customHandlers || {}

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault()
            if (isOpen && onNavigate) {
              onNavigate('down')
            } else if (onOpen) {
              onOpen()
            }
            break
          case 'ArrowUp':
            event.preventDefault()
            if (isOpen && onNavigate) {
              onNavigate('up')
            } else if (onOpen) {
              onOpen()
            }
            break
          case 'Enter':
          case ' ':
            event.preventDefault()
            if (isOpen && onSelect) {
              onSelect()
            } else if (onOpen) {
              onOpen()
            }
            break
          case 'Escape':
            event.preventDefault()
            if (isOpen && onClose) {
              onClose()
            }
            break
          default:
            customHandlers?.onKeyDown?.(event)
        }
      }
      break

    case 'Modal':
      handlers.onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          customHandlers?.onClose?.()
        }
      }
      break

    case 'Checkbox':
      handlers.onKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
          case 'Enter':
          case ' ':
            event.preventDefault()
            ;(event.target as HTMLElement).click()
            break
          default:
            customHandlers?.onKeyDown?.(event)
        }
      }
      break

    case 'Radio':
      handlers.onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          ;(event.target as HTMLElement).click()
        }
      }
      break

    case 'Tab':
      handlers.onKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            event.preventDefault()
            customHandlers?.onNavigate?.('prev')
            break
          case 'ArrowRight':
          case 'ArrowDown':
            event.preventDefault()
            customHandlers?.onNavigate?.('next')
            break
          case 'Enter':
          case ' ':
            event.preventDefault()
            customHandlers?.onSelect?.()
            break
          default:
            customHandlers?.onKeyDown?.(event)
        }
      }
      break
  }

  return handlers
}

// =============================================================================
// 焦点管理
// =============================================================================

export interface FocusManagementOptions {
  trapFocus?: boolean
  restoreFocus?: boolean
  initialFocus?: string
  autofocus?: boolean
}

export function useFocusManagement(
  containerRef: React.RefObject<HTMLElement>,
  options: FocusManagementOptions = {}
) {
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [isFocusTrapped, setIsFocusTrapped] = useState(false)

  // 焦点陷阱
  useEffect(() => {
    if (!options.trapFocus || !containerRef.current) return

    const container = containerRef.current

    // 获取所有可聚焦元素
    const getFocusableElements = () => {
      return container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>
    }

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    // 保存之前的焦点
    previousFocusRef.current = document.activeElement as HTMLElement

    // 设置初始焦点
    if (options.initialFocus) {
      const initialElement = container.querySelector(options.initialFocus) as HTMLElement
      if (initialElement) {
        initialElement.focus()
      }
    } else if (options.autofocus) {
      const firstFocusable = getFocusableElements()[0]
      if (firstFocusable) {
        firstFocusable.focus()
      }
    }

    setIsFocusTrapped(true)
    container.addEventListener('keydown', handleTabKey)

    return () => {
      container.removeEventListener('keydown', handleTabKey)
      setIsFocusTrapped(false)
    }
  }, [options.trapFocus, containerRef, options.initialFocus, options.autofocus])

  // 恢复焦点
  useEffect(() => {
    if (!options.restoreFocus) return

    return () => {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [options.restoreFocus])

  return {
    isFocusTrapped,
    trapFocus: () => setIsFocusTrapped(true),
    releaseFocus: () => setIsFocusTrapped(false),
  }
}

// =============================================================================
// 屏幕阅读器支持
// =============================================================================

export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) {
  // 移除现有的公告
  const existingAnnouncements = document.querySelectorAll('[data-announcement]')
  existingAnnouncements.forEach(el => el.remove())

  // 创建新的公告元素
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.setAttribute('data-announcement', 'true')
  announcement.style.position = 'absolute'
  announcement.style.left = '-10000px'
  announcement.style.width = '1px'
  announcement.style.height = '1px'
  announcement.style.overflow = 'hidden'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // 清理公告元素
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 1000)
}

export function generateStatusMessage(props: Record<string, any>): string {
  const messages: string[] = []

  if (props.disabled) messages.push('Disabled')
  if (props.required) messages.push('Required')
  if (props.error) messages.push(`Error: ${props.error}`)
  if (props.loading) messages.push('Loading')
  if (props.success) messages.push('Success')
  if (props.warning) messages.push('Warning')

  return messages.join(', ')
}

// =============================================================================
// 颜色对比度验证
// =============================================================================

export interface ColorContrastResult {
  ratio: number
  wcagAA: boolean
  wcagAAA: boolean
  recommendation?: string
}

export function validateColorContrast(
  foreground: string,
  background: string
): ColorContrastResult {
  // 计算相对亮度
  const getLuminance = (color: string): number => {
    // 处理不同的颜色格式
    let hex = color.replace('#', '')

    // 如果是 RGB 格式
    if (color.startsWith('rgb')) {
      const values = color.match(/\d+/g)
      if (values && values.length >= 3) {
        const r = parseInt(values[0]) / 255
        const g = parseInt(values[1]) / 255
        const b = parseInt(values[2]) / 255

        return calculateLuminance(r, g, b)
      }
    }

    // 处理十六进制格式
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('')
    }

    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255

    return calculateLuminance(r, g, b)
  }

  const calculateLuminance = (r: number, g: number, b: number): number => {
    const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
    const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
    const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

    return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB
  }

  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

  return {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
    recommendation: ratio < 4.5 ? 'Increase color contrast to meet WCAG AA standards' : undefined
  }
}

// =============================================================================
// 跳过链接支持
// =============================================================================

export interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ href, children, className }, ref) => {
    return React.createElement(
      'a',
      {
        ref,
        href,
        className: cn(
          'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
          'bg-blue-600 text-white px-4 py-2 rounded-md z-50',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          className
        )
      },
      children
    )
  }
)

SkipLink.displayName = 'SkipLink'

// =============================================================================
// 工具函数
// =============================================================================

// cn 函数已移至 foundations/utils/cn.ts，请从那里导入

// =============================================================================
// WCAG 2.1 AA 合规检查清单
// =============================================================================

export interface WCAGComplianceResult {
  compliant: boolean
  issues: Array<{
    type: 'error' | 'warning'
    category: 'keyboard' | 'aria' | 'contrast' | 'focus' | 'screen-reader'
    message: string
    recommendation: string
  }>
  score: number
}

export function checkWCAGCompliance(
  elementType: string,
  props: Record<string, any>,
  element?: HTMLElement
): WCAGComplianceResult {
  const issues: WCAGComplianceResult['issues'] = []

  // 键盘可访问性检查
  if (['button', 'a', 'input', 'select', 'textarea'].includes(elementType)) {
    if (!props.onKeyDown && !props.onClick) {
      issues.push({
        type: 'warning',
        category: 'keyboard',
        message: 'Missing keyboard event handler',
        recommendation: 'Add onKeyDown handler for keyboard accessibility'
      })
    }
  }

  // ARIA 属性检查
  if (props.required && !props['aria-required'] && !props['aria-label']) {
    issues.push({
      type: 'warning',
      category: 'aria',
      message: 'Required field missing ARIA indication',
      recommendation: 'Add aria-required="true" or aria-label'
    })
  }

  if (props.error && !props['aria-invalid'] && !props['aria-describedby']) {
    issues.push({
      type: 'error',
      category: 'aria',
      message: 'Error state missing ARIA attributes',
      recommendation: 'Add aria-invalid="true" and aria-describedby pointing to error message'
    })
  }

  // 焦点管理检查
  if (props.disabled && !props.tabIndex && props.tabIndex !== -1) {
    issues.push({
      type: 'warning',
      category: 'focus',
      message: 'Disabled element should have tabindex="-1"',
      recommendation: 'Add tabindex="-1" to disabled interactive elements'
    })
  }

  // 屏幕阅读器检查
  if (elementType === 'img' && !props.alt && !props['aria-label']) {
    issues.push({
      type: 'error',
      category: 'screen-reader',
      message: 'Image missing alt text',
      recommendation: 'Add descriptive alt text or aria-label'
    })
  }

  const score = Math.max(0, 100 - (issues.filter(i => i.type === 'error').length * 20) - (issues.filter(i => i.type === 'warning').length * 10))

  return {
    compliant: issues.filter(i => i.type === 'error').length === 0,
    issues,
    score
  }
}

export default {
  generateAriaProps,
  generateKeyboardNavigation,
  useFocusManagement,
  announceToScreenReader,
  validateColorContrast,
  checkWCAGCompliance,
  SkipLink
}