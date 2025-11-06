/**
 * @fileoverview 测试环境配置
 * @description Vitest测试环境设置
 */

import '@testing-library/jest-dom'

// 模拟环境变量
Object.defineProperty(process, 'env', {
  value: {
    NODE_ENV: 'test',
    ANTHROPIC_API_KEY: 'test-api-key'
  }
})

// 模拟window对象
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
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    input: ({ children, ...props }: any) => <input {...props}>{children}</input>,
  },
  AnimatePresence: ({ children }: any) => children,
}))
