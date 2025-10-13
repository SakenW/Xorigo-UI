'use client'

import { readonlyRegistry } from '@/data/registry.readonly'
import { readonlyTokens } from '@/data/tokens.readonly'
import type { Component } from '@/data/types'

/**
 * Playground Client - Playground 系统客户端
 * 负责处理 Playground 的数据获取和状态管理
 */
export class PlaygroundClient {
  /**
   * 获取组件列表
   */
  static async getComponents(): Promise<Component[]> {
    try {
      return readonlyRegistry.getComponents()
    } catch (error) {
      console.error('Failed to get components:', error)
      return []
    }
  }

  /**
   * 获取单个组件
   */
  static async getComponent(id: string): Promise<Component | null> {
    try {
      return readonlyRegistry.getComponent(id)
    } catch (error) {
      console.error(`Failed to get component ${id}:`, error)
      return null
    }
  }

  /**
   * 获取组件属性定义
   */
  static async getComponentProps(component: Component): Promise<any> {
    try {
      // 这里可以根据组件类型返回对应的属性定义
      // 暂时返回一个通用的属性结构
      const baseProps = {
        variant: {
          type: 'select',
          options: ['primary', 'secondary', 'outline', 'ghost'],
          defaultValue: 'primary',
          description: '组件变体',
        },
        size: {
          type: 'select',
          options: ['sm', 'md', 'lg'],
          defaultValue: 'md',
          description: '组件尺寸',
        },
        disabled: {
          type: 'boolean',
          defaultValue: false,
          description: '是否禁用',
        },
        children: {
          type: 'string',
          defaultValue: 'Button',
          description: '组件内容',
        },
      }

      // 根据组件类型添加特定属性
      if (component.name === 'Input') {
        baseProps.placeholder = {
          type: 'string',
          defaultValue: '',
          description: '占位符文本',
        }
        baseProps.type = {
          type: 'select',
          options: ['text', 'email', 'password', 'number'],
          defaultValue: 'text',
          description: '输入类型',
        }
      }

      return baseProps
    } catch (error) {
      console.error('Failed to get component props:', error)
      return {}
    }
  }

  /**
   * 获取主题令牌
   */
  static async getThemeTokens() {
    try {
      const allTokens = readonlyTokens.getAllTokens()
      const colorTokens = readonlyTokens.getTokensByCategory('colors')

      return {
        colors: colorTokens,
        all: allTokens,
      }
    } catch (error) {
      console.error('Failed to get theme tokens:', error)
      return {
        colors: [],
        all: [],
      }
    }
  }

  /**
   * 生成组件代码
   */
  static async generateCode(component: Component, props: Record<string, any>): Promise<string> {
    try {
      const { name } = component
      const propsString = Object.entries(props)
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `${key}="${value}"`
          } else if (typeof value === 'boolean') {
            return value ? key : ''
          } else {
            return `${key}={${JSON.stringify(value)}}`
          }
        })
        .filter(Boolean)
        .join(' ')

      return `<${name}${propsString ? ' ' + propsString : ''}>示例内容</${name}>`
    } catch (error) {
      console.error('Failed to generate code:', error)
      return `<!-- 代码生成失败 -->`
    }
  }

  /**
   * 验证属性值
   */
  static async validateProps(component: Component, props: Record<string, any>): Promise<{
    isValid: boolean
    errors: string[]
  }> {
    try {
      const componentProps = await this.getComponentProps(component)
      const errors: string[] = []

      Object.entries(props).forEach(([key, value]) => {
        const propDef = componentProps[key]
        if (!propDef) {
          errors.push(`未知属性: ${key}`)
          return
        }

        if (propDef.type === 'select' && !propDef.options?.includes(value)) {
          errors.push(`属性 ${key} 的值无效，可选值: ${propDef.options?.join(', ')}`)
        }

        if (propDef.type === 'boolean' && typeof value !== 'boolean') {
          errors.push(`属性 ${key} 必须是布尔值`)
        }
      })

      return {
        isValid: errors.length === 0,
        errors,
      }
    } catch (error) {
      console.error('Failed to validate props:', error)
      return {
        isValid: false,
        errors: ['属性验证失败'],
      }
    }
  }
}

// 导出便捷函数
export const getPlaygroundComponents = PlaygroundClient.getComponents
export const getPlaygroundComponent = PlaygroundClient.getComponent
export const getPlaygroundProps = PlaygroundClient.getComponentProps
export const getThemeTokens = PlaygroundClient.getThemeTokens
export const generateComponentCode = PlaygroundClient.generateCode
export const validatePlaygroundProps = PlaygroundClient.validateProps