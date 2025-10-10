import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ComponentVariants, sizeClasses, variantClasses } from '../types/components'

// 样式合并工具
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 获取尺寸样式
export function getSizeClasses(size: ComponentVariants['size'] = 'md', customClasses?: string) {
  const baseSize = sizeClasses[size || 'md']
  return customClasses ? cn(baseSize, customClasses) : baseSize
}

// 获取变体样式
export function getVariantClasses(variant: ComponentVariants['variant'] = 'default', customClasses?: string) {
  const baseVariant = variantClasses[variant || 'default']
  return customClasses ? cn(baseVariant, customClasses) : baseVariant
}

// 生成唯一 ID
export function generateId(prefix: string = 'th-ui'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

// 检查是否为有效的子元素
export function isValidChild(child: any): boolean {
  return child && typeof child === 'object' && !Array.isArray(child)
}

// 过滤有效的子元素
export function filterValidChildren(children: React.ReactNode): React.ReactNode {
  return React.Children.toArray(children).filter(isValidChild)
}

// 处理复合组件
export function createCompoundComponent<P extends object>(
  MainComponent: React.FC<P>,
  subComponents: Record<string, React.ComponentType<any>>
) {
  const CompoundComponent = MainComponent as any

  Object.entries(subComponents).forEach(([name, Component]) => {
    CompoundComponent[name] = Component
  })

  return CompoundComponent
}

// 处理键盘事件
export function createKeyboardHandler(
  onEnter?: (event: React.KeyboardEvent) => void,
  onEscape?: (event: React.KeyboardEvent) => void,
  onSpace?: (event: React.KeyboardEvent) => void
) {
  return (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        onEnter?.(event)
        break
      case ' ':
        event.preventDefault()
        onSpace?.(event)
        break
      case 'Escape':
        event.preventDefault()
        onEscape?.(event)
        break
    }
  }
}

// 处理焦点事件
export function createFocusHandler(
  onFocus?: (event: React.FocusEvent) => void,
  onBlur?: (event: React.FocusEvent) => void
) {
  return {
    onFocus: (event: React.FocusEvent) => {
      onFocus?.(event)
    },
    onBlur: (event: React.FocusEvent) => {
      onBlur?.(event)
    }
  }
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 检查元素是否在视口中
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// 滚动到元素
export function scrollToElement(element: HTMLElement, options: ScrollIntoViewOptions = {}) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    ...options
  })
}

// 获取元素的边界信息
export function getElementBounds(element: HTMLElement) {
  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
    top: element.offsetTop,
    left: element.offsetLeft,
    right: element.offsetLeft + element.offsetWidth,
    bottom: element.offsetTop + element.offsetHeight
  }
}

// 检查是否为移动设备
export function isMobile(): boolean {
  return window.innerWidth < 768
}

// 检查是否为平板设备
export function isTablet(): boolean {
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

// 检查是否为桌面设备
export function isDesktop(): boolean {
  return window.innerWidth >= 1024
}

// 获取当前断点
export function getCurrentBreakpoint(): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
  const width = window.innerWidth
  if (width < 640) return 'xs'
  if (width < 768) return 'sm'
  if (width < 1024) return 'md'
  if (width < 1280) return 'lg'
  if (width < 1536) return 'xl'
  return '2xl'
}

// 创建响应式样式
export function createResponsiveStyles(
  styles: Record<string, string>,
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = getCurrentBreakpoint()
): string {
  return styles[breakpoint] || styles.md || ''
}

// 处理异步状态
export function createAsyncState<T>(
  initialData?: T
): {
  data: T | undefined
  loading: boolean
  error: Error | null
  execute: (promise: Promise<T>) => Promise<void>
  reset: () => void
} {
  let data = initialData
  let loading = false
  let error: Error | null = null

  const execute = async (promise: Promise<T>) => {
    loading = true
    error = null
    try {
      data = await promise
    } catch (err) {
      error = err as Error
    } finally {
      loading = false
    }
  }

  const reset = () => {
    data = initialData
    loading = false
    error = null
  }

  return {
    get data() { return data },
    get loading() { return loading },
    get error() { return error },
    execute,
    reset
  }
}

// 创建本地存储 Hook 模式
export function createStorage<T>(key: string, defaultValue: T) {
  const storage = typeof window !== 'undefined' ? localStorage : null

  const getValue = (): T => {
    if (!storage) return defaultValue
    try {
      const item = storage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  const setValue = (value: T) => {
    if (!storage) return
    try {
      storage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error)
    }
  }

  const removeValue = () => {
    if (!storage) return
    storage.removeItem(key)
  }

  return {
    get: getValue,
    set: setValue,
    remove: removeValue
  }
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化数字
export function formatNumber(num: number, options: {
  locale?: string
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
} = {}): string {
  const {
    locale = 'zh-CN',
    currency,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2
  } = options

  if (currency) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(num)
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits
  }).format(num)
}

// 验证邮箱格式
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 验证电话号码格式
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

// 获取 URL 参数
export function getUrlParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

// 设置 URL 参数
export function setUrlParams(params: Record<string, string>): void {
  const url = new URL(window.location.href)
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value)
    } else {
      url.searchParams.delete(key)
    }
  })
  window.history.replaceState({}, '', url.toString())
}