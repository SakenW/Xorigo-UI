#!/usr/bin/env tsx

import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'
import { parse } from '@typescript-eslint/parser'
import { traverse } from '@babel/traverse'
import * as t from '@babel/types'
import { Component, Registry } from '../src/types'
import { tokens } from '@xorigo-ui/tokens'

// 组件文件解析器
class ComponentParser {
  private components: Component[] = []

  async parseComponentFiles(pattern: string): Promise<Component[]> {
    const files = await glob(pattern)

    for (const filePath of files) {
      const component = await this.parseComponentFile(filePath)
      if (component) {
        this.components.push(component)
      }
    }

    return this.components
  }

  private async parseComponentFile(filePath: string): Promise<Component | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const ast = parse(content, {
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      })

      let component: Component | null = null

      traverse(ast as any, {
        // 查找 React 组件定义
        ExportNamedDeclaration: (path) => {
          const declaration = path.node.declaration

          if (
            t.isVariableDeclaration(declaration) &&
            declaration.declarations.length > 0
          ) {
            const declarator = declaration.declarations[0]

            if (
              t.isIdentifier(declarator.id) &&
              t.isCallExpression(declarator.init) &&
              t.isIdentifier(declarator.init.callee, { name: 'React.forwardRef' })
            ) {
              // React.forwardRef 组件
              const componentName = (declarator.id as t.Identifier).name
              component = this.createComponentFromAST(componentName, filePath, content)
            }
          }
        },
      })

      return component
    } catch (error) {
      console.warn(`解析组件文件失败: ${filePath}`, error)
      return null
    }
  }

  private createComponentFromAST(name: string, filePath: string, content: string): Component {
    const category = this.getCategoryFromPath(filePath)
    const props = this.extractPropsFromContent(content)
    const variants = this.extractVariantsFromContent(content)

    return {
      name,
      description: this.extractDescription(content),
      category,
      framework: 'react',
      style: 'tailwind',
      files: [path.relative(process.cwd(), filePath)],
      props,
      variants,
      example: this.extractExample(content),
      accessibility: {
        'aria-label': true,
        'keyboard-navigation': true,
        'screen-reader': true,
        'color-contrast': true,
      },
      theme: {
        supported: true,
        tokens: this.extractTokens(content),
      },
    }
  }

  private getCategoryFromPath(filePath: string): Component['category'] {
    if (filePath.includes('/ui/')) return 'ui'
    if (filePath.includes('/feedback/')) return 'feedback'
    if (filePath.includes('/navigation/')) return 'navigation'
    if (filePath.includes('/advanced/')) return 'advanced'
    if (filePath.includes('/radix/')) return 'radix'
    return 'ui'
  }

  private extractDescription(content: string): string {
    const match = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/)
    return match ? match[1] : '组件描述'
  }

  private extractPropsFromContent(content: string): Component['props'] {
    const props: Component['props'] = []

    // 匹配 interface Props 定义
    const interfaceMatch = content.match(/interface\s+\w*Props\s*{([^}]+)}/s)
    if (interfaceMatch) {
      const propsContent = interfaceMatch[1]
      const propMatches = propsContent.matchAll(/(\w+)(\?)?:\s*([^;]+);/g)

      for (const match of propMatches) {
        const [, name, optional, type] = match
        props.push({
          name,
          type: type.trim(),
          required: !optional,
        })
      }
    }

    return props
  }

  private extractVariantsFromContent(content: string): Component['variants'] {
    const variants: Component['variants'] = []

    // 匹配 CVA (class-variance-authority) 定义
    const cvaMatch = content.match(/cva\(([^)]+)\)/s)
    if (cvaMatch) {
      const variantsMatch = content.match(/variants:\s*{([^}]+)}/s)
      if (variantsMatch) {
        const variantsContent = variantsMatch[1]
        const variantMatches = variantsContent.matchAll(/(\w+):\s*{([^}]+)}/g)

        for (const match of variantMatches) {
          const [, variantName, variantContent] = match
          const optionMatches = variantContent.matchAll(/(\w+):\s*["']([^"']+)["']/g)

          for (const optionMatch of optionMatches) {
            const [, optionName, className] = optionMatch
            variants.push({
              name: `${variantName}.${optionName}`,
              className,
            })
          }
        }
      }
    }

    return variants
  }

  private extractExample(content: string): string {
    const exampleMatch = content.match(/```tsx\s*\n([\s\S]*?)\n```/)
    return exampleMatch ? exampleMatch[1].trim() : ''
  }

  private extractTokens(content: string): string[] {
    const tokens: string[] = []
    const tokenMatches = content.matchAll(/var\(--color-([^)]+)\)/g)

    for (const match of tokenMatches) {
      tokens.push(match[1])
    }

    return [...new Set(tokens)]
  }
}

// 主题生成器
class ThemeGenerator {
  generateThemes() {
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
}

// 主生成器
async function generateRegistry(): Promise<void> {
  console.log('🚀 开始生成 Xorigo UI 组件注册表...')

  const parser = new ComponentParser()
  const themeGenerator = new ThemeGenerator()

  // 解析组件
  const components = await parser.parseComponentFiles('../../src/components/**/*.tsx')
  console.log(`✅ 解析到 ${components.length} 个组件`)

  // 生成主题
  const themes = themeGenerator.generateThemes()

  // 构建注册表
  const registry: Registry = {
    version: '0.1.0',
    generatedAt: new Date().toISOString(),
    components,
    tokens: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      typography: tokens.fontSizes,
      borderRadius: tokens.borderRadius,
    },
    themes,
  }

  // 确保输出目录存在
  await fs.mkdir('dist', { recursive: true })

  // 写入注册表文件
  await fs.writeFile(
    'dist/registry.json',
    JSON.stringify(registry, null, 2),
    'utf-8'
  )

  // 生成 TypeScript 类型文件
  const typeDefinitions = generateTypeDefinitions(registry)
  await fs.writeFile('dist/index.d.ts', typeDefinitions, 'utf-8')

  console.log('✅ 注册表生成完成!')
  console.log(`📄 组件数量: ${components.length}`)
  console.log(`🎨 主题数量: ${themes.length}`)
  console.log(`📦 输出文件: dist/registry.json`)
}

// 生成 TypeScript 类型定义
function generateTypeDefinitions(registry: Registry): string {
  return `
// 自动生成的 Xorigo UI 组件注册表类型定义
// 生成时间: ${registry.generatedAt}

export interface ComponentVariant {
  name: string
  description?: string
  className: string
  props?: Record<string, any>
}

export interface ComponentProp {
  name: string
  type: string
  description?: string
  required?: boolean
  defaultValue?: any
  options?: string[]
}

export interface Component {
  name: string
  description: string
  category: 'ui' | 'feedback' | 'navigation' | 'advanced' | 'radix'
  framework: 'react'
  style: 'tailwind'
  files: string[]
  props: ComponentProp[]
  variants: ComponentVariant[]
  example?: string
  accessibility?: {
    'aria-label'?: boolean
    'keyboard-navigation'?: boolean
    'screen-reader'?: boolean
    'color-contrast'?: boolean
  }
  theme?: {
    supported?: boolean
    tokens?: string[]
  }
}

export interface Registry {
  version: string
  generatedAt: string
  components: Component[]
  tokens: {
    colors: Record<string, any>
    spacing: Record<string, any>
    typography: Record<string, any>
    borderRadius: Record<string, any>
  }
  themes: Array<{
    name: string
    colors: Record<string, string>
  }>
}

export const registry: Registry = ${JSON.stringify(registry, null, 2)} as any
`
}

// 执行生成
if (require.main === module) {
  generateRegistry().catch(console.error)
}