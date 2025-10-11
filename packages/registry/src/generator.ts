import { Component, Registry } from './types'

// 简化的设计令牌定义
const tokens = {
  colors: {
    primary: '#3b82f6',
    secondary: '#f5f5f5',
    accent: '#f5f5f5',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
}

// 注册表生成器类
export class RegistryGenerator {
  private components: Component[] = []

  /**
   * 添加组件到注册表
   */
  addComponent(component: Component): void {
    this.components.push(component)
  }

  /**
   * 批量添加组件
   */
  addComponents(components: Component[]): void {
    this.components.push(...components)
  }

  /**
   * 生成完整注册表
   */
  generate(): Registry {
    return {
      version: '0.1.0',
      generatedAt: new Date().toISOString(),
      components: this.components,
      tokens: {
        colors: tokens.colors,
        spacing: tokens.spacing,
        typography: tokens.fontSizes,
        borderRadius: tokens.borderRadius,
      },
      themes: this.generateDefaultThemes(),
    }
  }

  /**
   * 生成默认主题
   */
  private generateDefaultThemes() {
    return [
      {
        name: 'light',
        colors: {
          background: '#ffffff',
          foreground: '#0a0a0a',
          muted: '#f5f5f5',
          'muted-foreground': '#737373',
          card: '#ffffff',
          'card-foreground': '#0a0a0a',
          border: '#e5e5e5',
          input: '#e5e5e5',
          ring: '#3b82f6',
          primary: '#3b82f6',
          'primary-foreground': '#ffffff',
          secondary: '#f5f5f5',
          'secondary-foreground': '#0a0a0a',
          accent: '#f5f5f5',
          'accent-foreground': '#0a0a0a',
          destructive: '#ef4444',
          'destructive-foreground': '#ffffff',
        },
      },
      {
        name: 'dark',
        colors: {
          background: '#0a0a0a',
          foreground: '#ffffff',
          muted: '#1a1a1a',
          'muted-foreground': '#a3a3a3',
          card: '#1a1a1a',
          'card-foreground': '#ffffff',
          border: '#262626',
          input: '#262626',
          ring: '#60a5fa',
          primary: '#60a5fa',
          'primary-foreground': '#0a0a0a',
          secondary: '#262626',
          'secondary-foreground': '#ffffff',
          accent: '#262626',
          'accent-foreground': '#ffffff',
          destructive: '#f87171',
          'destructive-foreground': '#0a0a0a',
        },
      },
    ]
  }

  /**
   * 获取组件按类别分组
   */
  getComponentsByCategory(): Record<string, Component[]> {
    return this.components.reduce((acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = []
      }
      acc[component.category].push(component)
      return acc
    }, {} as Record<string, Component[]>)
  }

  /**
   * 根据名称查找组件
   */
  findComponentByName(name: string): Component | undefined {
    return this.components.find(component => component.name === name)
  }

  /**
   * 获取所有组件名称
   */
  getComponentNames(): string[] {
    return this.components.map(component => component.name)
  }
}

// 便捷函数
export function generateRegistry(): Registry {
  const generator = new RegistryGenerator()
  return generator.generate()
}

// 默认导出生成器
export default RegistryGenerator