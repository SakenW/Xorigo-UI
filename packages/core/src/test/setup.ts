/**
 * Vitest 测试环境设置
 */

import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// 每个测试后清理
afterEach(() => {
  cleanup()
})

// 模拟 ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// 模拟 IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// 模拟 matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// 模拟 scrollTo
window.scrollTo = () => {}

// 模拟 getComputedStyle
window.getComputedStyle = () => ({
  getPropertyValue: () => '',
}) as CSSStyleDeclaration

// 模拟 CSS 变量支持
CSS.supports = (property: string, value?: string) => {
  if (property.startsWith('--')) return true
  return true
}