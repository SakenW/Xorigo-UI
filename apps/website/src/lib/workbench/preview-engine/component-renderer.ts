/**
 * 组件渲染器
 * 负责动态加载和渲染 React 组件
 */

import type React from 'react'
import type { ComponentInfo } from '@/data/component-classification'
import type { ComponentRenderer, PreviewOptions } from './types'

/**
 * 组件渲染器实现
 */
export class ComponentRendererImpl implements ComponentRenderer {
  private componentCache: Map<string, React.ComponentType<any>> = new Map()
  private loadingPromises: Map<string, Promise<React.ComponentType<any>>> = new Map()

  /**
   * 渲染组件
   */
  async render(
    component: ComponentInfo,
    props: Record<string, any>,
    options: PreviewOptions
  ): Promise<React.ReactNode> {
    try {
      const Component = await this.loadComponent(component.name)

      if (!Component) {
        return this.renderErrorComponent(component.name, 'Component not found')
      }

      const element = React.createElement(Component, {
        ...props,
        'data-component-name': component.name,
        'data-preview-mode': options.mode,
        'data-preview-size': options.size,
        'data-preview-theme': options.theme
      })

      return element
    } catch (error) {
      console.error(`Error rendering component ${component.name}:`, error)
      return this.renderErrorComponent(component.name, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * 获取默认属性
   */
  getDefaultProps(component: ComponentInfo, options: PreviewOptions): Record<string, any> {
    const baseProps: Record<string, any> = {
      // 基础属性
      disabled: false,
      required: false
    }

    // 根据组件类型设置默认属性
    switch (component.name.toLowerCase()) {
      case 'button':
        return {
          ...baseProps,
          children: 'Button',
          variant: 'primary',
          size: options.size || 'md',
          disabled: false,
          loading: false
        }

      case 'input':
        return {
          ...baseProps,
          placeholder: 'Enter text...',
          type: 'text',
          disabled: false,
          required: false
        }

      case 'card':
        return {
          ...baseProps,
          title: 'Card Title',
          description: 'Card description goes here.',
          children: 'Card content'
        }

      case 'modal':
        return {
          ...baseProps,
          open: false,
          title: 'Modal Title',
          children: 'Modal content goes here.'
        }

      case 'avatar':
        return {
          ...baseProps,
          src: undefined,
          alt: 'User Avatar',
          size: options.size || 'md'
        }

      case 'badge':
        return {
          ...baseProps,
          children: 'Badge',
          variant: 'default'
        }

      case 'typography':
        return {
          ...baseProps,
          variant: 'body',
          children: 'Typography text'
        }

      case 'icon':
        return {
          ...baseProps,
          name: 'star',
          size: options.size === 'sm' ? 16 : options.size === 'lg' ? 24 : 20
        }

      case 'alert':
        return {
          ...baseProps,
          variant: 'info',
          title: 'Alert Title',
          description: 'Alert description goes here.'
        }

      case 'toast':
        return {
          ...baseProps,
          variant: 'success',
          title: 'Success',
          description: 'Operation completed successfully.'
        }

      case 'select':
        return {
          ...baseProps,
          placeholder: 'Select an option...',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
          ]
        }

      case 'checkbox':
        return {
          ...baseProps,
          label: 'Checkbox option',
          checked: false
        }

      case 'radio':
        return {
          ...baseProps,
          label: 'Radio option',
          value: 'option1',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
          ]
        }

      case 'switch':
        return {
          ...baseProps,
          label: 'Switch option',
          checked: false
        }

      case 'slider':
        return {
          ...baseProps,
          value: 50,
          min: 0,
          max: 100,
          step: 1
        }

      case 'table':
        return {
          ...baseProps,
          data: [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
          ],
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' }
          ]
        }

      case 'tabs':
        return {
          ...baseProps,
          defaultValue: 'tab1',
          tabs: [
            { value: 'tab1', label: 'Tab 1', content: 'Content for Tab 1' },
            { value: 'tab2', label: 'Tab 2', content: 'Content for Tab 2' }
          ]
        }

      default:
        return baseProps
    }
  }

  /**
   * 验证属性
   */
  validateProps(component: ComponentInfo, props: Record<string, any>) {
    const errors: string[] = []
    const warnings: string[] = []

    // 基础验证
    if (props.children && typeof props.children !== 'string' && !React.isValidElement(props.children)) {
      warnings.push('Children should be a string or valid React element')
    }

    // 根据组件类型进行特定验证
    switch (component.name.toLowerCase()) {
      case 'button':
        if (props.variant && !['primary', 'secondary', 'outline', 'ghost', 'destructive'].includes(props.variant)) {
          errors.push(`Invalid button variant: ${props.variant}`)
        }
        if (props.size && !['sm', 'md', 'lg'].includes(props.size)) {
          errors.push(`Invalid button size: ${props.size}`)
        }
        break

      case 'input':
        if (props.type && !['text', 'email', 'password', 'search', 'number'].includes(props.type)) {
          warnings.push(`Unknown input type: ${props.type}`)
        }
        break

      case 'modal':
        if (typeof props.open !== 'boolean') {
          errors.push('Modal open prop must be a boolean')
        }
        break

      case 'avatar':
        if (props.src && typeof props.src !== 'string') {
          errors.push('Avatar src must be a string')
        }
        break
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * 加载组件
   */
  private async loadComponent(componentName: string): Promise<React.ComponentType<any> | null> {
    // 检查缓存
    if (this.componentCache.has(componentName)) {
      return this.componentCache.get(componentName)!
    }

    // 检查是否正在加载
    if (this.loadingPromises.has(componentName)) {
      return this.loadingPromises.get(componentName)!
    }

    // 开始加载
    const loadingPromise = this.doLoadComponent(componentName)
    this.loadingPromises.set(componentName, loadingPromise)

    try {
      const component = await loadingPromise
      this.componentCache.set(componentName, component)
      return component
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error)
      return null
    } finally {
      this.loadingPromises.delete(componentName)
    }
  }

  /**
   * 实际加载组件
   */
  private async doLoadComponent(componentName: string): Promise<React.ComponentType<any>> {
    try {
      // 在开发环境中，@xorigo-ui/core 可能不可用
      // 直接创建占位组件
      return this.createPlaceholderComponent(componentName)
    } catch (error) {
      // 创建一个占位组件
      return this.createPlaceholderComponent(componentName)
    }
  }

  /**
   * 创建占位组件
   */
  private createPlaceholderComponent(componentName: string): React.ComponentType<any> {
    return function PlaceholderComponent(props: any) {
      return React.createElement('div', {
        style: {
          padding: '16px',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          color: '#666',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        },
        'data-component-name': componentName,
        'data-placeholder': 'true'
      }, [
        React.createElement('div', {
          key: 'icon',
          style: { fontSize: '24px', marginBottom: '8px' }
        }, '📦'),
        React.createElement('div', {
          key: 'name',
          style: { fontWeight: 'bold', marginBottom: '4px' }
        }, componentName),
        React.createElement('div', {
          key: 'message',
          style: { fontSize: '12px' }
        }, 'Component preview')
      ])
    }
  }

  /**
   * 渲染错误组件
   */
  private renderErrorComponent(componentName: string, error: string): React.ReactNode {
    return React.createElement('div', {
      style: {
        padding: '16px',
        border: '2px solid #ff6b6b',
        borderRadius: '8px',
        backgroundColor: '#ffe0e0',
        color: '#d63031',
        textAlign: 'center',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      },
      'data-component-name': componentName,
      'data-error': 'true'
    }, [
      React.createElement('div', {
        key: 'icon',
        style: { fontSize: '24px', marginBottom: '8px' }
      }, '❌'),
      React.createElement('div', {
        key: 'name',
        style: { fontWeight: 'bold', marginBottom: '4px' }
      }, componentName),
      React.createElement('div', {
        key: 'error',
        style: { fontSize: '12px' }
      }, error)
    ])
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.componentCache.clear()
    this.loadingPromises.clear()
  }

  /**
   * 获取缓存统计
   */
  getCacheStats() {
    return {
      cachedComponents: this.componentCache.size,
      loadingComponents: this.loadingPromises.size,
      cachedComponentNames: Array.from(this.componentCache.keys())
    }
  }
}

/**
 * 创建组件渲染器实例
 */
export function createComponentRenderer(): ComponentRenderer {
  return new ComponentRendererImpl()
}