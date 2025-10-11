import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// 扩展Vitest的expect断言
expect.extend(matchers)

// 每个测试后清理
afterEach(() => {
  cleanup()
})
