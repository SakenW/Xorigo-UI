/**
 * @fileoverview Registry Readonly Adapter 单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { readonlyRegistry } from '../registry.readonly'

describe('RegistryReadonlyAdapter', () => {
  describe('getComponents', () => {
    it('应该返回组件列表数组', () => {
      const components = readonlyRegistry.getComponents()
      expect(Array.isArray(components)).toBe(true)
    })

    it('返回的组件应该有必需的属性', () => {
      const components = readonlyRegistry.getComponents()
      if (components.length > 0) {
        const component = components[0]
        expect(component).toHaveProperty('name')
        expect(component).toHaveProperty('category')
      }
    })
  })

  describe('getComponent', () => {
    it('应该根据名称返回组件', () => {
      const components = readonlyRegistry.getComponents()
      if (components.length > 0) {
        const firstComponentName = components[0].name
        const component = readonlyRegistry.getComponent(firstComponentName)
        expect(component).toBeDefined()
        expect(component?.name).toBe(firstComponentName)
      }
    })

    it('不存在的组件应该返回 undefined', () => {
      const component = readonlyRegistry.getComponent('NonExistentComponent')
      expect(component).toBeUndefined()
    })
  })

  describe('getComponentsByCategory', () => {
    it('应该返回指定类别的组件', () => {
      const categories = readonlyRegistry.getCategories()
      if (categories.length > 0) {
        const category = categories[0]
        const components = readonlyRegistry.getComponentsByCategory(category)
        expect(Array.isArray(components)).toBe(true)
        components.forEach((component) => {
          expect(component.category).toBe(category)
        })
      }
    })

    it('不存在的类别应该返回空数组', () => {
      const components = readonlyRegistry.getComponentsByCategory('non-existent')
      expect(Array.isArray(components)).toBe(true)
      expect(components.length).toBe(0)
    })
  })

  describe('getCategories', () => {
    it('应该返回所有唯一的类别', () => {
      const categories = readonlyRegistry.getCategories()
      expect(Array.isArray(categories)).toBe(true)

      // 检查唯一性
      const uniqueCategories = new Set(categories)
      expect(categories.length).toBe(uniqueCategories.size)
    })
  })

  describe('getMetadata', () => {
    it('应该返回 Registry 元数据', () => {
      const metadata = readonlyRegistry.getMetadata()
      expect(metadata).toBeDefined()
      expect(metadata).toHaveProperty('version')
      expect(metadata).toHaveProperty('updated')
    })
  })

  describe('validateConsistency', () => {
    it('应该返回验证结果对象', () => {
      const result = readonlyRegistry.validateConsistency()
      expect(result).toHaveProperty('valid')
      expect(result).toHaveProperty('errors')
      expect(result).toHaveProperty('warnings')
      expect(typeof result.valid).toBe('boolean')
      expect(Array.isArray(result.errors)).toBe(true)
      expect(Array.isArray(result.warnings)).toBe(true)
    })

    it('验证错误应该有正确的结构', () => {
      const result = readonlyRegistry.validateConsistency()
      result.errors.forEach((error) => {
        expect(error).toHaveProperty('type')
        expect(error).toHaveProperty('message')
      })
    })
  })
})
