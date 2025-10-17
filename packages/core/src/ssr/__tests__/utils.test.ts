/**
 * SSR工具测试
 */

import { describe, it, expect, vi } from 'vitest'
import {
  isBrowser,
  isServer,
  isNode,
  hasDOM,
  getEnvironment,
  getWindow,
  getDocument,
  getNavigator,
  getURLParams,
  setPageTitle
} from '../utils/ssr'

// Mock环境变量
const mockWindow = {
  location: {
    search: '?param1=value1&param2=value2'
  },
  navigator: {
    userAgent: 'Test User Agent'
  }
}

const mockDocument = {
  title: 'Test Title'
}

describe('SSR工具', () => {
  describe('环境检测', () => {
    it('应该正确检测浏览器环境', () => {
      expect(typeof isBrowser).toBe('boolean')
      expect(typeof isServer).toBe('boolean')
      expect(isBrowser).toBe(!isServer)
    })

    it('应该正确检测Node.js环境', () => {
      expect(typeof isNode).toBe('boolean')
    })

    it('应该正确检测DOM可用性', () => {
      expect(typeof hasDOM).toBe('boolean')
    })

    it('应该返回环境信息', () => {
      const env = getEnvironment()
      expect(env).toHaveProperty('isBrowser')
      expect(env).toHaveProperty('isServer')
      expect(env).toHaveProperty('isNode')
      expect(env).toHaveProperty('hasDOM')
    })
  })

  describe('浏览器API访问', () => {
    it('在服务端环境应返回null', () => {
      // 在测试环境（模拟服务端）
      const result = getWindow()
      expect(result).toBeNull()
    })

    it('在服务端环境应返回null', () => {
      const result = getDocument()
      expect(result).toBeNull()
    })

    it('在服务端环境应返回null', () => {
      const result = getNavigator()
      expect(result).toBeNull()
    })
  })

  describe('URL参数处理', () => {
    it('在服务端环境应返回空对象', () => {
      const params = getURLParams()
      expect(params).toEqual({})
    })
  })

  describe('页面标题设置', () => {
    it('在服务端环境不应抛出错误', () => {
      expect(() => {
        setPageTitle('Test Title')
      }).not.toThrow()
    })
  })
})