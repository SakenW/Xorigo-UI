/**
 * 可访问性工具函数集合
 * 提供常用的可访问性检查和增强功能
 */

/**
 * 生成唯一的ID用于ARIA属性关联
 */
export const generateAriaId = (prefix: string = 'aria'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 检查颜色对比度是否符合WCAG标准
 * 使用现有的color-contrast-checker库
 */
export const checkColorContrast = (foreground: string, background: string): {
  ratio: number
  aa: boolean
  aaa: boolean
  aaLarge: boolean
  aaaLarge: boolean
} => {
  // 这里会在后续实现中集成color-contrast-checker
  return {
    ratio: 0,
    aa: false,
    aaa: false,
    aaLarge: false,
    aaaLarge: false
  }
}

/**
 * 管理焦点陷阱的Hook逻辑
 */
export const createFocusTrap = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        e.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        e.preventDefault()
      }
    }
  }

  return {
    activate: () => {
      container.addEventListener('keydown', handleTabKey)
      firstElement?.focus()
    },
    deactivate: () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }
}

/**
 * 检查元素是否在视口内
 */
export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * 为按钮组件生成可访问性属性
 */
export const getButtonAriaProps = (props: {
  loading?: boolean
  disabled?: boolean
  pressed?: boolean
  expanded?: boolean
  label?: string
  describedBy?: string
}) => {
  const ariaProps: Record<string, any> = {}

  if (props.label) {
    ariaProps['aria-label'] = props.label
  }

  if (props.describedBy) {
    ariaProps['aria-describedby'] = props.describedBy
  }

  if (props.pressed !== undefined) {
    ariaProps['aria-pressed'] = props.pressed
  }

  if (props.expanded !== undefined) {
    ariaProps['aria-expanded'] = props.expanded
  }

  if (props.loading) {
    ariaProps['aria-busy'] = true
  }

  return ariaProps
}

/**
 * 为输入框生成可访问性属性
 */
export const getInputAriaProps = (props: {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  invalid?: boolean
  describedBy?: string
}) => {
  const ariaProps: Record<string, any> = {}

  if (props.label && !props.describedBy) {
    ariaProps['aria-label'] = props.label
  }

  if (props.required) {
    ariaProps['aria-required'] = true
  }

  if (props.invalid || props.error) {
    ariaProps['aria-invalid'] = true
  }

  const describedByParts = []
  if (props.describedBy) describedByParts.push(props.describedBy)
  if (props.helperText) describedByParts.push(`${generateAriaId('helper')}`)
  if (props.error) describedByParts.push(`${generateAriaId('error')}`)

  if (describedByParts.length > 0) {
    ariaProps['aria-describedby'] = describedByParts.join(' ')
  }

  return ariaProps
}

/**
 * 为模态框生成可访问性属性
 */
export const getModalAriaProps = (props: {
  title?: string
  description?: string
  labelId?: string
  descriptionId?: string
  modal?: boolean
}) => {
  const ariaProps: Record<string, any> = {
    role: 'dialog'
  }

  if (props.modal !== false) {
    ariaProps['aria-modal'] = true
  }

  if (props.labelId) {
    ariaProps['aria-labelledby'] = props.labelId
  } else if (props.title) {
    ariaProps['aria-label'] = props.title
  }

  if (props.descriptionId) {
    ariaProps['aria-describedby'] = props.descriptionId
  }

  return ariaProps
}

/**
 * 为头像组件生成可访问性属性
 */
export const getAvatarAriaProps = (props: {
  label?: string
  describedBy?: string
}) => {
  const ariaProps: Record<string, any> = {
    role: 'img'
  }

  if (props.label) {
    ariaProps['aria-label'] = props.label
  }

  if (props.describedBy) {
    ariaProps['aria-describedby'] = props.describedBy
  }

  return ariaProps
}

/**
 * 为芯片组件生成可访问性属性
 */
export const getChipAriaProps = (props: {
  label?: string
  isSelected?: boolean
  isDisabled?: boolean
  describedBy?: string
}) => {
  const ariaProps: Record<string, any> = {
    role: 'img'
  }

  if (props.label) {
    ariaProps['aria-label'] = props.label
  }

  if (props.describedBy) {
    ariaProps['aria-describedby'] = props.describedBy
  }

  if (props.isSelected !== undefined) {
    ariaProps['aria-selected'] = props.isSelected
  }

  if (props.isDisabled) {
    ariaProps['aria-disabled'] = true
  }

  return ariaProps
}

/**
 * 键盘导航常量
 */
export const KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End'
} as const

/**
 * 常用的屏幕阅读器通知
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}
