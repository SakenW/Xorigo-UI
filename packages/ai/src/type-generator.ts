/**
 * @fileoverview AI代码生成引擎 - 类型生成器
 * @description 自动生成完整的TypeScript类型定义和接口
 */

import { type ComponentSpec, type GeneratedFile, type ComponentProp } from './types'
import {
  generateInterface,
  generateJSDoc,
  formatCode,
  PerformanceTimer,
  capitalize,
  uncapitalize
} from './utils'

// ============================================================================
// 类型生成器类
// ============================================================================

export class TypeGenerator {
  /**
   * 生成组件相关的所有类型定义
   */
  generate(spec: ComponentSpec): {
    files: GeneratedFile[]
    tsErrors?: string[]
  } {
    const timer = new PerformanceTimer()
    timer.start()

    const files: GeneratedFile[] = []

    try {
      // 1. 生成Props类型定义
      const propsFile = this.generatePropsTypes(spec)
      files.push(propsFile)

      // 2. 生成事件类型定义（如果需要）
      if (spec.events && spec.events.length > 0) {
        const eventsFile = this.generateEventTypes(spec)
        files.push(eventsFile)
      }

      // 3. 生成变体类型定义（如果需要）
      if (spec.variants && spec.variants.length > 0) {
        const variantsFile = this.generateVariantTypes(spec)
        files.push(variantsFile)
      }

      // 4. 生成组件入口类型定义
      const indexFile = this.generateIndexTypes(spec)
      files.push(indexFile)

      const totalTime = timer.end()
      console.log(`   📝 类型定义生成完成: ${files.length} 个文件, ${totalTime}ms`)

      return { files, tsErrors: [] }
    } catch (error) {
      console.error(`❌ 类型定义生成失败:`, error)
      return {
        files,
        tsErrors: [error instanceof Error ? error.message : String(error)]
      }
    }
  }

  /**
   * 生成Props类型定义
   */
  private generatePropsTypes(spec: ComponentSpec): GeneratedFile {
    const timer = new PerformanceTimer()
    timer.start()

    const interfaceCode = generateInterface(`${spec.name}Props`, spec.props)

    const header = `/**
 * @fileoverview ${spec.name} 组件类型定义
 * @description ${spec.description} 的TypeScript类型定义
 * 自动生成，请勿手动修改
 */`

    const content = [
      header,
      '',
      "import React from 'react'",
      '',
      interfaceCode,
      '',
      '// 重新导出常用类型',
      `export type ${spec.name}Element = React.ElementRef<\"${this.getDefaultElement(spec)}\">`,
      `export type ${spec.name}PropsVariants = ${spec.name}Props`
    ].join('\n')

    const filePath = `${this.getTypesDir()}/components/${spec.name}.types.ts`
    const generationTime = timer.end()

    return {
      filePath,
      content,
      type: 'types',
      generationTime,
      success: true
    }
  }

  /**
   * 生成事件类型定义
   */
  private generateEventTypes(spec: ComponentSpec): GeneratedFile {
    const timer = new PerformanceTimer()
    timer.start()

    const lines: string[] = []
    lines.push('/**')
    lines.push(` * ${spec.name} 组件事件类型定义`)
    lines.push(' */')
    lines.push('')
    lines.push("import React from 'react'")
    lines.push('')

    for (const event of spec.events || []) {
      lines.push(generateJSDoc(event.description || `${event.name} 事件`))
      lines.push(`export type ${spec.name}${capitalize(event.name)}Event = ${event.type}`)
      lines.push('')
    }

    // 生成事件处理器类型
    lines.push(generateJSDoc(`${spec.name} 事件处理器类型`))
    lines.push(`export interface ${spec.name}EventHandlers {`)
    for (const event of spec.events || []) {
      const handlerName = `on${capitalize(event.name)}`
      lines.push(`  ${handlerName}?: ${spec.name}${capitalize(event.name)}Event`)
    }
    lines.push('}')
    lines.push('')

    // 生成组合事件类型
    lines.push(generateJSDoc(`${spec.name} 完整事件类型`))
    lines.push(`export type ${spec.name}Events = {`)
    lines.push('  [K in keyof typeof import(\'./' + spec.name.toLowerCase() + '.types\')' + ' as `${spec.name}${capitalize(K)}Event`]: ' + spec.name + `${capitalize(K)}Event`
    lines.push('}')
    lines.push('')

    const content = lines.join('\n')
    const filePath = `${this.getTypesDir()}/events/${spec.name}.events.ts`
    const generationTime = timer.end()

    return {
      filePath,
      content,
      type: 'types',
      generationTime,
      success: true
    }
  }

  /**
   * 生成变体类型定义
   */
  private generateVariantTypes(spec: ComponentSpec): GeneratedFile {
    const timer = new PerformanceTimer()
    timer.start()

    const lines: string[] = []
    lines.push('/**')
    lines.push(` * ${spec.name} 组件变体类型定义`)
    lines.push(' */')
    lines.push('')

    if (!spec.variants || spec.variants.length === 0) {
      return {
        filePath: `${this.getTypesDir()}/variants/${spec.name}.variants.ts`,
        content: lines.join('\n'),
        type: 'types',
        generationTime: 0,
        success: true
      }
    }

    // 生成变体联合类型
    const variantNames = spec.variants.map(v => v.name)
    lines.push(`export type ${spec.name}Variant = ${variantNames.map(v => `'${v}'`).join(' | ')}`)
    lines.push('')

    // 生成变体配置类型
    lines.push(generateJSDoc(`${spec.name} 变体配置类型`))
    lines.push(`export interface ${spec.name}VariantConfig {`)
    lines.push(`  variant?: ${spec.name}Variant`)
    lines.push(`  size?: 'sm' | 'md' | 'lg'`)
    lines.push(`  className?: string`)
    lines.push('}')
    lines.push('')

    // 生成变体映射类型
    lines.push(generateJSDoc(`${spec.name} 变体到类名的映射`))
    lines.push(`export interface ${spec.name}VariantMap {`)
    for (const variant of spec.variants) {
      lines.push(`  ${variant.name}: string`)
    }
    lines.push('}')
    lines.push('')

    // 生成变体工具类型
    lines.push(generateJSDoc(`${spec.name} 变体工具函数类型`))
    lines.push(`export type Get${spec.name}VariantClass = (`)
    lines.push(`  config: ${spec.name}VariantConfig`)
    lines.push(`) => string`)
    lines.push('')

    const content = lines.join('\n')
    const filePath = `${this.getTypesDir()}/variants/${spec.name}.variants.ts`
    const generationTime = timer.end()

    return {
      filePath,
      content,
      type: 'types',
      generationTime,
      success: true
    }
  }

  /**
   * 生成组件入口类型定义
   */
  private generateIndexTypes(spec: ComponentSpec): GeneratedFile {
    const timer = new PerformanceTimer()
    timer.start()

    const lines: string[] = []
    lines.push('/**')
    lines.push(` * ${spec.name} 组件类型入口`)
    lines.push(' * 自动生成的类型定义聚合')
    lines.push(' */')
    lines.push('')

    // 导出所有相关类型
    lines.push(`export * from './components/${spec.name}.types'`)
    if (spec.events && spec.events.length > 0) {
      lines.push(`export * from './events/${spec.name}.events'`)
    }
    if (spec.variants && spec.variants.length > 0) {
      lines.push(`export * from './variants/${spec.name}.variants'`)
    }
    lines.push('')

    // 导出组件类型
    lines.push(generateJSDoc(`${spec.name} 组件类型`))
    lines.push(`export type ${spec.name}Component = React.FC<${spec.name}Props>`)
    lines.push('')

    // 导出ref类型
    lines.push(generateJSDoc(`${spec.name} Ref类型`))
    lines.push(`export type ${spec.name}Ref = React.ElementRef<'${this.getDefaultElement(spec)}'>`)
    lines.push('')

    // 导出组件完整类型
    lines.push(generateJSDoc(`${spec.name} 组件完整类型定义`))
    lines.push(`export interface ${spec.name}ComponentType {`)
    lines.push(`  /** 组件显示名称 */`)
    lines.push(`  displayName: string`)
    lines.push(`  /** 组件属性类型 */`)
    lines.push(`  propTypes: ${spec.name}Props`)
    lines.push(`  /** 默认属性 */`)
    lines.push(`  defaultProps: Partial<${spec.name}Props>`)
    lines.push(`  /** 变体类型 */`)
    lines.push(`  variantType?: ${spec.variants ? spec.name + 'Variant' : 'never'}`)
    lines.push('}')
    lines.push('')

    const content = lines.join('\n')
    const filePath = `${this.getTypesDir()}/${spec.name.toLowerCase()}.ts`
    const generationTime = timer.end()

    return {
      filePath,
      content,
      type: 'types',
      generationTime,
      success: true
    }
  }

  /**
   * 获取默认HTML元素
   */
  private getDefaultElement(spec: ComponentSpec): string {
    const categoryToElement: Record<string, string> = {
      'primitives': 'div',
      'forms': 'input',
      'layout': 'div',
      'navigation': 'nav',
      'overlays': 'div',
      'feedback': 'div'
    }

    return categoryToElement[spec.category] || 'div'
  }

  /**
   * 获取类型定义目录
   */
  private getTypesDir(): string {
    return this.config?.outputDir || 'src/types'
  }

  private config?: { outputDir: string }
}

// ============================================================================
// 导出单例实例
// ============================================================================

export const typeGenerator = new TypeGenerator()
