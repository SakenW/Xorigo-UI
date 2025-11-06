/**
 * @fileoverview AI代码生成引擎 - 核心代码生成器
 * @description 集成Claude API，从结构化需求生成React组件代码
 */

import Anthropic from '@anthropic-ai/sdk'
import {
  type ComponentSpec,
  type GenerationConfig,
  type GenerationResult,
  type GeneratedFile,
  type ComponentTemplate,
  type ComponentVariant
} from '../types'
import {
  validateSpec,
  PerformanceTimer,
  generateId,
  generateInterface,
  generateComponentStructure,
  generateJSDoc,
  formatCode
} from '../utils'
import { typeGenerator } from '../type-generator'
import { templates } from '../templates'

// ============================================================================
// 核心代码生成器类
// ============================================================================

export class CodeGenerator {
  private anthropic?: Anthropic
  private config: GenerationConfig
  private cache: Map<string, any> = new Map()

  constructor(config: GenerationConfig) {
    this.config = config
    this.initializeClaude()
  }

  /**
   * 初始化Claude API客户端
   */
  private initializeClaude(): void {
    const apiKey = this.config.claudeConfig?.apiKey || process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      console.warn('⚠️ 未提供Claude API Key，将使用模板生成模式')
      return
    }

    try {
      this.anthropic = new Anthropic({
        apiKey,
      })
      console.log('✅ Claude API客户端初始化成功')
    } catch (error) {
      console.error('❌ Claude API客户端初始化失败:', error)
    }
  }

  /**
   * 生成组件代码
   */
  async generate(spec: ComponentSpec): Promise<GenerationResult> {
    const timer = new PerformanceTimer()
    timer.start()

    console.log(`\n🚀 开始生成组件: ${spec.name}`)
    console.log(`   类型: ${spec.type}`)
    console.log(`   分类: ${spec.category}`)

    // 验证组件规范
    const validation = validateSpec(spec)
    if (!validation.valid) {
      throw new Error(`组件规范验证失败: ${validation.errors.join(', ')}`)
    }

    const files: GeneratedFile[] = []
    let tsErrors: string[] = []

    try {
      // 1. 生成类型定义
      const typesResult = await typeGenerator.generate(spec)
      files.push(...typesResult.files)
      tsErrors = typesResult.tsErrors || []

      // 2. 生成组件代码
      const componentResult = await this.generateComponentCode(spec)
      files.push(componentResult)

      // 3. 生成测试文件（如果需要）
      if (this.config.generateTests) {
        const testResult = await this.generateTest(spec)
        files.push(testResult)
      }

      // 4. 生成Story文件（如果需要）
      if (this.config.generateStory) {
        const storyResult = await this.generateStory(spec)
        files.push(storyResult)
      }

      // 5. 生成文档（如果需要）
      if (this.config.generateDocs) {
        const docsResult = await this.generateDocs(spec)
        files.push(docsResult)
      }

      const totalTime = timer.end()
      const linesOfCode = files.reduce((sum, file) => sum + file.content.split('\n').length, 0)

      console.log(`✅ 组件生成完成: ${spec.name}`)
      console.log(`   文件数量: ${files.length}`)
      console.log(`   代码行数: ${linesOfCode}`)
      console.log(`   生成时间: ${totalTime}ms`)

      return {
        spec,
        files,
        totalTime,
        tsErrors,
        stats: {
          filesGenerated: files.length,
          linesOfCode,
          typeCount: typesResult.files.length
        }
      }
    } catch (error) {
      console.error(`❌ 组件生成失败: ${spec.name}`)
      console.error(error)

      return {
        spec,
        files,
        totalTime: timer.end(),
        tsErrors,
        stats: {
          filesGenerated: 0,
          linesOfCode: 0,
          typeCount: 0
        }
      }
    }
  }

  /**
   * 生成组件代码
   */
  private async generateComponentCode(spec: ComponentSpec): Promise<GeneratedFile> {
    const timer = new PerformanceTimer()
    timer.start()

    let code: string

    // 检查是否有匹配的模板
    const template = templates.find(t => t.type === spec.type)

    if (template && !this.anthropic) {
      // 使用模板生成
      console.log(`   📋 使用模板: ${template.name}`)
      code = this.generateFromTemplate(template, spec)
    } else if (this.anthropic) {
      // 使用AI生成
      console.log(`   🤖 使用AI生成: Claude API`)
      code = await this.generateWithClaude(spec)
    } else {
      // 回退到基础模板
      console.log(`   📦 使用基础模板`)
      code = this.generateBasicComponent(spec)
    }

    const filePath = `${this.config.outputDir}/${spec.name}.tsx`
    const generationTime = timer.end()

    return {
      filePath,
      content: code,
      type: 'component',
      generationTime,
      success: true
    }
  }

  /**
   * 使用Claude API生成代码
   */
  private async generateWithClaude(spec: ComponentSpec): Promise<string> {
    if (!this.anthropic) {
      throw new Error('Claude API未初始化')
    }

    const systemPrompt = this.buildSystemPrompt(spec)

    const userPrompt = this.buildUserPrompt(spec)

    try {
      const response = await this.anthropic.messages.create({
        model: this.config.claudeConfig?.model || 'claude-3-sonnet-20240229',
        max_tokens: this.config.claudeConfig?.maxTokens || 4000,
        temperature: this.config.claudeConfig?.temperature || 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })

      const content = response.content[0]
      if ('text' in content) {
        return this.extractCodeFromResponse(content.text)
      }

      throw new Error('Claude API返回了非文本内容')
    } catch (error) {
      console.error('❌ Claude API调用失败:', error)
      // 回退到模板生成
      console.log('   🔄 回退到模板生成')
      return this.generateBasicComponent(spec)
    }
  }

  /**
   * 构建系统提示
   */
  private buildSystemPrompt(spec: ComponentSpec): string {
    return `你是一个专业的React组件开发专家，擅长生成高质量、符合规范的React组件代码。

你的任务是：
1. 根据组件规范生成完整的TypeScript React组件
2. 严格遵循Xorigo UI设计系统规范
3. 使用七轴主题系统
4. 确保TypeScript类型安全
5. 遵循React 19最佳实践

设计规范：
- 使用Tailwind CSS类名（从@xorigo-ui/tokens获取设计令牌）
- 使用Framer Motion进行动画
- 支持主题切换（light/dark模式）
- 使用forwardRef模式
- 遵循可访问性标准（ARIA属性）
- 使用语义化HTML标签

代码结构：
1. 完整的TypeScript类型定义
2. JSDoc文档注释
3. 组件实现（使用React.forwardRef）
4. 正确的导入语句
5. 错误处理

请直接返回组件代码，不要包含任何解释或额外文本。`
  }

  /**
   * 构建用户提示
   */
  private buildUserPrompt(spec: ComponentSpec): string {
    return `请为以下组件生成完整的TypeScript代码：

组件名称: ${spec.name}
描述: ${spec.description}
类型: ${spec.type}
分类: ${spec.category}
主题支持: ${spec.theming ? '是' : '否'}
动画支持: ${spec.animated ? '是' : '否'}
可访问性: ${spec.accessible ? '是' : '否'}

属性定义:
${spec.props.map(p => `- ${p.name}: ${p.type} ${p.required ? '(必需)' : '(可选)'}`).join('\n')}

${spec.variants && spec.variants.length > 0 ? `变体定义:\n${spec.variants.map(v => `- ${v.name}: ${v.description}`).join('\n')}` : ''}

${spec.dependencies && spec.dependencies.length > 0 ? `依赖组件:\n${spec.dependencies.map(d => `- ${d.name} (${d.type}) from ${d.importPath}`).join('\n')}` : ''}

请生成完整的组件代码，包括：
1. 完整的TypeScript类型定义
2. 组件实现（使用React.forwardRef）
3. JSDoc文档注释
4. 正确的导入语句
5. 主题系统集成
6. 动画效果（如果支持）
7. 可访问性支持（如果需要）

不要包含任何解释，直接返回代码。`
  }

  /**
   * 从Claude响应中提取代码
   */
  private extractCodeFromResponse(text: string): string {
    // 移除可能的markdown代码块标记
    let code = text
    if (code.includes('```')) {
      const matches = code.match(/```(?:tsx|typescript|jsx|javascript)?\n([\s\S]*?)\n```/)
      if (matches) {
        code = matches[1]
      }
    }

    // 清理代码
    code = code.trim()

    return code
  }

  /**
   * 使用模板生成代码
   */
  private generateFromTemplate(template: ComponentTemplate, spec: ComponentSpec): string {
    let code = template.code

    // 替换模板中的占位符
    code = code.replace(/__COMPONENT_NAME__/g, spec.name)
    code = code.replace(/__COMPONENT_DESCRIPTION__/g, spec.description)

    // 替换属性定义
    const interfaceCode = generateInterface(`${spec.name}Props`, spec.props)
    code = code.replace(/__INTERFACE_DEFINITION__/g, interfaceCode)

    // 替换组件实现
    const componentCode = generateComponentStructure(spec.name, spec.props)
    code = code.replace(/__COMPONENT_IMPLEMENTATION__/g, componentCode.join('\n'))

    // 替换变体代码
    if (spec.variants && spec.variants.length > 0) {
      const variantCode = this.generateVariantsCode(spec.variants)
      code = code.replace(/__VARIANTS__/g, variantCode)
    }

    // 清理空行
    code = code.replace(/\n{3,}/g, '\n\n')

    return code
  }

  /**
   * 生成变体代码
   */
  private generateVariantsCode(variants: ComponentVariant[]): string {
    const lines: string[] = []

    lines.push('export const buttonVariants = {')

    for (const variant of variants) {
      lines.push(`  ${variant.name}: {`)
      lines.push(`    className: "${variant.className || ''}",`)
      lines.push('  },')
    }

    lines.push('}')

    return lines.join('\n')
  }

  /**
   * 生成基础组件（回退选项）
   */
  private generateBasicComponent(spec: ComponentSpec): string {
    const imports = [
      "import React, { forwardRef } from 'react'",
      "import { motion } from 'framer-motion'",
      "import { cn } from '@xorigo-ui/utils'"
    ]

    // 添加依赖导入
    if (spec.dependencies) {
      for (const dep of spec.dependencies) {
        if (dep.type === 'component' || dep.type === 'hook') {
          imports.push(`import { ${dep.name} } from '${dep.importPath}'`)
        }
      }
    }

    const interfaceCode = generateInterface(`${spec.name}Props`, spec.props)
    const componentCode = generateComponentStructure(spec.name, spec.props)

    const code = [
      ...imports,
      '',
      interfaceCode,
      '',
      componentCode.join('\n')
    ].join('\n')

    return code
  }

  /**
   * 生成测试文件
   */
  private async generateTest(spec: ComponentSpec): Promise<GeneratedFile> {
    const timer = new PerformanceTimer()
    timer.start()

    const testCode = `/**
 * @fileoverview ${spec.name} 组件测试
 * @description ${spec.description} 的单元测试
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { ${spec.name} } from '../${spec.name}'

describe('${spec.name}', () => {
  it('renders correctly', () => {
    render(<${spec.name}>Test</${spec.name}>)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('applies className correctly', () => {
    const className = 'custom-class'
    render(<${spec.name} className={className}>Test</${spec.name}>)
    expect(screen.getByText('Test')).toHaveClass(className)
  })

  ${spec.events?.map(event => `
  it('calls ${event.name} when clicked', () => {
    const handleClick = vi.fn()
    render(<${spec.name} on${capitalize(event.name)}={handleClick}>Test</${spec.name}>)
    fireEvent.click(screen.getByText('Test'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  }`).join('\n') || ''}
})

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
`

    const filePath = `${this.config.outputDir}/${spec.name}.test.tsx`
    const generationTime = timer.end()

    return {
      filePath,
      content: testCode,
      type: 'test',
      generationTime,
      success: true
    }
  }

  /**
   * 生成Story文件
   */
  private async generateStory(spec: ComponentSpec): Promise<GeneratedFile> {
    const timer = new PerformanceTimer()
    timer.start()

    const storyCode = `import type { Meta, StoryObj } from '@storybook/react'
import { ${spec.name} } from './${spec.name}'

const meta = {
  title: 'Components/${spec.name}',
  component: ${spec.name},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
${spec.props.map(prop => `    ${prop.name}: {
      control: { type: '${prop.type === 'boolean' ? 'boolean' : 'text'}' },
    },`).join('\n')}
  },
} satisfies Meta<typeof ${spec.name}>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
${spec.props.map(prop => {
    if (prop.name === 'children') return `    children: '示例内容',`
    if (prop.type === 'string' && !prop.required) return `    ${prop.name}: '${prop.name}示例',`
    if (prop.type === 'boolean') return `    ${prop.name}: false,`
    if (prop.type === 'number') return `    ${prop.name}: 42,`
    return ''
  }).filter(Boolean).join('\n')}
  },
}
`

    const filePath = `${this.config.outputDir}/${spec.name}.stories.tsx`
    const generationTime = timer.end()

    return {
      filePath,
      content: storyCode,
      type: 'story',
      generationTime,
      success: true
    }
  }

  /**
   * 生成文档
   */
  private async generateDocs(spec: ComponentSpec): Promise<GeneratedFile> {
    const timer = new PerformanceTimer()
    timer.start()

    const docsCode = `# ${spec.name}

${spec.description}

## 用法

\`\`\`tsx
import { ${spec.name} } from '@xorigo-ui/core'

export default function Example() {
  return (
    <${spec.name}>
      示例内容
    </${spec.name}>
  )
}
\`\`\`

## 属性

| 属性名 | 类型 | 必需 | 默认值 | 描述 |
|--------|------|------|--------|------|
${spec.props.map(prop => `| ${prop.name} | ${prop.type} | ${prop.required ? '是' : '否'} | ${prop.defaultValue || '-'} | ${prop.description || '-'} |`).join('\n')}

${spec.variants && spec.variants.length > 0 ? `## 变体

${spec.variants.map(variant => `- **${variant.name}**: ${variant.description || ''}`).join('\n')}

` : ''}## 可访问性

${spec.accessible ? '✅ 该组件支持可访问性标准' : '⚠️ 该组件需要进一步的可访问性支持'}
`

    const filePath = `${this.config.outputDir}/${spec.name}.md`
    const generationTime = timer.end()

    return {
      filePath,
      content: docsCode,
      type: 'docs',
      generationTime,
      success: true
    }
  }

  /**
   * 批量生成组件
   */
  async generateBatch(specs: ComponentSpec[]): Promise<GenerationResult[]> {
    console.log(`\n🚀 开始批量生成 ${specs.length} 个组件`)

    const results: GenerationResult[] = []

    for (const spec of specs) {
      try {
        const result = await this.generate(spec)
        results.push(result)
      } catch (error) {
        console.error(`❌ 生成组件 ${spec.name} 失败:`, error)
        results.push({
          spec,
          files: [],
          totalTime: 0,
          stats: {
            filesGenerated: 0,
            linesOfCode: 0,
            typeCount: 0
          }
        })
      }
    }

    const totalTime = results.reduce((sum, r) => sum + r.totalTime, 0)
    console.log(`\n✅ 批量生成完成`)
    console.log(`   总组件数: ${specs.length}`)
    console.log(`   成功数: ${results.filter(r => r.files.length > 0).length}`)
    console.log(`   失败数: ${results.filter(r => r.files.length === 0).length}`)
    console.log(`   总耗时: ${totalTime}ms`)

    return results
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear()
    console.log('🧹 缓存已清除')
  }

  /**
   * 获取配置
   */
  getConfig(): GenerationConfig {
    return { ...this.config }
  }
}

// ============================================================================
// 导出默认实例
// ============================================================================

/**
 * 创建代码生成器实例
 */
export function createCodeGenerator(config: GenerationConfig): CodeGenerator {
  return new CodeGenerator(config)
}
