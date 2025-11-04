/**
 * 🎭 RTL 书写方向支持 - v2025.11.03
 *
 * 左右书写方向支持、RTL 布局适配
 * 自动方向检测、样式翻转处理
 *
 * @version 2025.11.03
 * @category System
 * @layer system
 */

import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * 书写方向类型
 */
export type TextDirection = 'ltr' | 'rtl' | 'auto'

/**
 * RTL 配置接口
 */
export interface RTLConfig {
  direction: TextDirection
  autoDetect: boolean
  mirrorStyles: boolean
  mirrorIcons: boolean
  respectSystemPreference: boolean
}

/**
 * RTL 上下文接口
 */
export interface RTLContextValue {
  config: RTLConfig
  setDirection: (direction: TextDirection) => void
  isRTL: boolean
  getLogicalStyle: (ltr: string, rtl?: string) => string
  getLogicalProperty: (property: string) => string
  mirrorValue: (value: string) => string
  getEdge: (start: string, end: string) => { start: string; end: string }
}

/**
 * RTL 语言列表
 */
export const RTLLanguages = [
  'ar', 'ara', 'ar-SA', 'ar-EG', 'ar-DZ', 'ar-MA', 'ar-TN', 'ar-OM', 'ar-YE', 'ar-SY', 'ar-JO', 'ar-LB', 'ar-KW', 'ar-AE', 'ar-BH', 'ar-QA',
  'he', 'heb', 'he-IL',
  'fa', 'fas', 'fa-IR',
  'ur', 'urd', 'ur-PK',
  'ps', 'pus', 'ps-AF',
  'sd', 'snd', 'sd-PK',
  'yi', 'yid',
  'ku', 'kur', 'ku-Arab'
]

/**
 * 默认 RTL 配置
 */
export const defaultRTLConfig: RTLConfig = {
  direction: 'ltr',
  autoDetect: true,
  mirrorStyles: true,
  mirrorIcons: true,
  respectSystemPreference: true
}

/**
 * RTL 上下文
 */
export const RTLContext = createContext<RTLContextValue | undefined>(undefined)

/**
 * RTL 提供者组件
 */
export function RTLProvider({
  children,
  defaultConfig = defaultRTLConfig,
  storageKey = 'xorigo-ui-rtl'
}: {
  children: React.ReactNode
  defaultConfig?: RTLConfig
  storageKey?: string
}) {
  const [config, setConfig] = useState<RTLConfig>(defaultConfig)

  // 从本地存储加载配置
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsedConfig = JSON.parse(stored)
        setConfig({ ...defaultConfig, ...parsedConfig })
      }
    } catch (error) {
      console.warn('Failed to load RTL config from localStorage:', error)
    }
  }, [storageKey, defaultConfig])

  // 自动检测方向
  useEffect(() => {
    if (!config.autoDetect) return

    let detectedDirection: TextDirection = 'ltr'

    // 检查 HTML lang 属性
    const htmlLang = document.documentElement.getAttribute('lang') || ''
    if (htmlLang) {
      const langCode = htmlLang.split('-')[0]
      if (RTLLanguages.includes(langCode) || RTLLanguages.includes(htmlLang)) {
        detectedDirection = 'rtl'
      }
    }

    // 检查系统偏好
    if (config.respectSystemPreference) {
      const systemDirection = getSystemTextDirection()
      if (systemDirection !== 'auto') {
        detectedDirection = systemDirection
      }
    }

    if (detectedDirection !== config.direction) {
      setConfig(prev => ({ ...prev, direction: detectedDirection }))
    }
  }, [config.autoDetect, config.respectSystemPreference, config.direction])

  // 保存配置到本地存储
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(config))
    } catch (error) {
      console.warn('Failed to save RTL config to localStorage:', error)
    }
  }, [config, storageKey])

  // 应用方向到 DOM
  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    const actualDirection = config.direction === 'auto' ? getSystemTextDirection() : config.direction

    root.setAttribute('dir', actualDirection)
    root.setAttribute('data-text-direction', config.direction)
    body.setAttribute('data-text-direction', config.direction)

    // 添加 RTL 相关类名
    body.classList.toggle('rtl', actualDirection === 'rtl')
    body.classList.toggle('ltr', actualDirection === 'ltr')
    body.classList.toggle('mirror-styles', config.mirrorStyles && actualDirection === 'rtl')
    body.classList.toggle('mirror-icons', config.mirrorIcons && actualDirection === 'rtl')

    // 更新 CSS 变量
    const cssVariables = generateRTLCSSVariables(config, actualDirection)
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })

  }, [config])

  const setDirection = (direction: TextDirection) => {
    setConfig(prev => ({ ...prev, direction }))
  }

  const isRTL = config.direction === 'rtl' || (config.direction === 'auto' && getSystemTextDirection() === 'rtl')

  const getLogicalStyle = (ltr: string, rtl?: string): string => {
    if (!isRTL) return ltr
    return rtl || ltr
  }

  const getLogicalProperty = (property: string): string => {
    const propertyMap: Record<string, string> = {
      'margin-left': isRTL ? 'margin-right' : 'margin-left',
      'margin-right': isRTL ? 'margin-left' : 'margin-right',
      'padding-left': isRTL ? 'padding-right' : 'padding-left',
      'padding-right': isRTL ? 'padding-left' : 'padding-right',
      'border-left': isRTL ? 'border-right' : 'border-left',
      'border-right': isRTL ? 'border-left' : 'border-right',
      'border-radius-left': isRTL ? 'border-radius-right' : 'border-radius-left',
      'border-radius-right': isRTL ? 'border-radius-left' : 'border-radius-right',
      'text-align-left': isRTL ? 'text-align-right' : 'text-align-left',
      'text-align-right': isRTL ? 'text-align-left' : 'text-align-right',
      'left': isRTL ? 'right' : 'left',
      'right': isRTL ? 'left' : 'right'
    }

    return propertyMap[property] || property
  }

  const mirrorValue = (value: string): string => {
    if (!isRTL || !config.mirrorStyles) return value

    // 翻转方向相关的值
    const mirrorMap: Record<string, string> = {
      'left': 'right',
      'right': 'left',
      'ltr': 'rtl',
      'rtl': 'ltr',
      'start': 'end',
      'end': 'start'
    }

    return mirrorMap[value] || value
  }

  const getEdge = (start: string, end: string) => {
    return isRTL ? { start: end, end: start } : { start, end }
  }

  const value: RTLContextValue = {
    config,
    setDirection,
    isRTL,
    getLogicalStyle,
    getLogicalProperty,
    mirrorValue,
    getEdge
  }

  return (
    <RTLContext.Provider value={value}>
      {children}
    </RTLContext.Provider>
  )
}

/**
 * 使用 RTL 的 Hook
 */
export function useRTL(): RTLContextValue {
  const context = useContext(RTLContext)
  if (!context) {
    throw new Error('useRTL must be used within an RTLProvider')
  }
  return context
}

/**
 * 获取系统文字方向
 */
function getSystemTextDirection(): TextDirection {
  if (typeof window === 'undefined') return 'ltr'

  // 检查浏览器语言
  const browserLang = navigator.language || (navigator as any).userLanguage
  const langCode = browserLang.split('-')[0]

  if (RTLLanguages.includes(langCode) || RTLLanguages.includes(browserLang)) {
    return 'rtl'
  }

  // 检查系统偏好（如果支持）
  if ('getComputedStyle' in document.documentElement) {
    const computedStyle = getComputedStyle(document.documentElement)
    const direction = computedStyle.direction as TextDirection
    if (direction === 'rtl') return 'rtl'
  }

  return 'ltr'
}

/**
 * 生成 RTL CSS 变量
 */
function generateRTLCSSVariables(config: RTLConfig, actualDirection: TextDirection): Record<string, string> {
  const variables: Record<string, string> = {}

  variables['--text-direction'] = actualDirection
  variables['--direction-start'] = actualDirection === 'rtl' ? 'right' : 'left'
  variables['--direction-end'] = actualDirection === 'rtl' ? 'left' : 'right'

  // 逻辑边距
  variables['--margin-inline-start'] = actualDirection === 'rtl' ? 'margin-right' : 'margin-left'
  variables['--margin-inline-end'] = actualDirection === 'rtl' ? 'margin-left' : 'margin-right'
  variables['--padding-inline-start'] = actualDirection === 'rtl' ? 'padding-right' : 'padding-left'
  variables['--padding-inline-end'] = actualDirection === 'rtl' ? 'padding-left' : 'padding-right'

  // 逻辑边框
  variables['--border-inline-start'] = actualDirection === 'rtl' ? 'border-right' : 'border-left'
  variables['--border-inline-end'] = actualDirection === 'rtl' ? 'border-left' : 'border-right'

  // 文本对齐
  variables['--text-align-start'] = actualDirection === 'rtl' ? 'text-align-right' : 'text-align-left'
  variables['--text-align-end'] = actualDirection === 'rtl' ? 'text-align-left' : 'text-align-right'

  // 浮动
  variables['--float-start'] = actualDirection === 'rtl' ? 'float-right' : 'float-left'
  variables['--float-end'] = actualDirection === 'rtl' ? 'float-left' : 'float-right'

  return variables
}

/**
 * RTL 样式组件
 */
export function RTLStyle({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  const { isRTL } = useRTL()

  return (
    <div className={`${className} ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {children}
    </div>
  )
}

/**
 * 逻辑边距组件
 */
export function LogicalMargin({
  start,
  end,
  className = ''
}: {
  start?: string
  end?: string
  className?: string
}) {
  const { getEdge, isRTL } = useRTL()
  const edges = getEdge(start || '', end || '')

  const style: React.CSSProperties = {}
  if (edges.start) style.marginInlineStart = edges.start
  if (edges.end) style.marginInlineEnd = edges.end

  return <div className={className} style={style} />
}

/**
 * 逻辑边距 Hook
 */
export function useLogicalSpacing() {
  const { getEdge, isRTL } = useRTL()

  const createSpacing = (start: string, end?: string) => {
    const edges = getEdge(start, end || '')
    return {
      marginInlineStart: edges.start,
      marginInlineEnd: edges.end,
      paddingInlineStart: edges.start,
      paddingInlineEnd: edges.end
    }
  }

  return { createSpacing, isRTL }
}

/**
 * RTL 工具类
 */
export class RTLHelper {
  /**
   * 检查是否为 RTL 语言
   */
  static isRTLLanguage(languageCode: string): boolean {
    return RTLLanguages.includes(languageCode) ||
           RTLLanguages.some(rtl => rtl.startsWith(languageCode))
  }

  /**
   * 获取文字方向
   */
  static getTextDirection(languageCode: string): TextDirection {
    return this.isRTLLanguage(languageCode) ? 'rtl' : 'ltr'
  }

  /**
   * 翻转 CSS 属性
   */
  static flipCSSProperty(property: string, isRTL: boolean): string {
    if (!isRTL) return property

    const flipMap: Record<string, string> = {
      'margin-left': 'margin-right',
      'margin-right': 'margin-left',
      'padding-left': 'padding-right',
      'padding-right': 'padding-left',
      'border-left': 'border-right',
      'border-right': 'border-left',
      'border-left-width': 'border-right-width',
      'border-right-width': 'border-left-width',
      'border-left-color': 'border-right-color',
      'border-right-color': 'border-left-color',
      'border-left-style': 'border-right-style',
      'border-right-style': 'border-left-style',
      'border-top-left-radius': 'border-top-right-radius',
      'border-top-right-radius': 'border-top-left-radius',
      'border-bottom-left-radius': 'border-bottom-right-radius',
      'border-bottom-right-radius': 'border-bottom-left-radius',
      'text-align-left': 'text-align-right',
      'text-align-right': 'text-align-left'
    }

    return flipMap[property] || property
  }

  /**
   * 生成 RTL CSS
   */
  static generateRTLCSS(direction: TextDirection): string {
    if (direction !== 'rtl') return ''

    return `
[dir="rtl"] {
  /* 翻转方向相关的样式 */
  .text-left { text-align: right; }
  .text-right { text-align: left; }
  .float-left { float: right; }
  .float-right { float: left; }

  /* 翻转边距 */
  .ml-1 { margin-right: 0.25rem; margin-left: 0; }
  .mr-1 { margin-left: 0.25rem; margin-right: 0; }
  .pl-1 { padding-right: 0.25rem; padding-left: 0; }
  .pr-1 { padding-left: 0.25rem; padding-right: 0; }

  /* 翻转边框 */
  .border-l { border-right: 1px solid; border-left: 0; }
  .border-r { border-left: 1px solid; border-right: 0; }
}`
  }

  /**
   * 验证文字方向
   */
  static validateDirection(direction: string): direction is TextDirection {
    return ['ltr', 'rtl', 'auto'].includes(direction)
  }

  /**
   * 获取所有 RTL 语言
   */
  static getRTLLanguages(): string[] {
    return [...RTLLanguages]
  }

  /**
   * 添加 RTL 语言
   */
  static addRTLLanguage(languageCode: string): void {
    if (!RTLLanguages.includes(languageCode)) {
      RTLLanguages.push(languageCode)
    }
  }

  /**
   * 移除 RTL 语言
   */
  static removeRTLLanguage(languageCode: string): void {
    const index = RTLLanguages.indexOf(languageCode)
    if (index > -1) {
      RTLLanguages.splice(index, 1)
    }
  }
}