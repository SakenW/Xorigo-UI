/**
 * 🧪 测试环境设置
 */

import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'

// 模拟performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => [])
  }
})

// 模拟localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// 模拟navigator.userAgent
Object.defineProperty(navigator, 'userAgent', {
  value: 'Mozilla/5.0 (Test Environment)',
  configurable: true
})

// 模拟screen对象
Object.defineProperty(window, 'screen', {
  value: {
    width: 1920,
    height: 1080,
    colorDepth: 24,
    pixelDepth: 24
  }
})

// 模拟Date.now
const mockDate = new Date('2024-01-01T00:00:00.000Z')
vi.spyOn(Date, 'now').mockImplementation(() => mockDate.getTime())

// 全局测试设置
beforeAll(() => {
  console.log('🧪 开始AI系统测试')
})

afterEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  console.log('✅ AI系统测试完成')
})

// 导出测试工具
export * from '@testing-library/react'
export { vi } from 'vitest'