/**
 * @fileoverview 测试环境配置
 * @description 为所有测试设置全局配置和工具
 */

import '@testing-library/jest-dom'
import { vi } from 'vitest'

// 模拟IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// 模拟ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// 模拟window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// 模拟Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

// 模拟@radix-ui组件
vi.mock('@radix-ui/react-dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => children,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => children,
  DialogContent: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('@radix-ui/react-toast', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => children,
  Toast: ({ children }: { children: React.ReactNode }) => children,
  ToastTrigger: ({ children }: { children: React.ReactNode }) => children,
}))

// 模拟Lucide图标
vi.mock('lucide-react', () => ({
  icons: {
    Check: 'Check',
    X: 'X',
    Menu: 'Menu',
  },
}))

// 控制台输出（测试时减少噪音）
if (process.env.NODE_ENV === 'test') {
  console.log = vi.fn()
  console.warn = vi.fn()
  console.error = vi.fn()
}
