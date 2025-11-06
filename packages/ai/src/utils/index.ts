/**
 * @fileoverview AI代码生成引擎 - 工具函数
 * @description 提供代码生成所需的各种工具函数
 */

import { type ComponentSpec, type ComponentProp, type ComponentVariant } from '../types'

// ============================================================================
// 字符串工具
// ============================================================================

/**
 * 将kebab-case转换为PascalCase
 */
export function kebabToPascal(kebab: string): string {
  return kebab
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('')
}

/**
 * 将kebab-case转换为camelCase
 */
export function kebabToCamel(kebab: string): string {
  const pascal = kebabToPascal(kebab)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

/**
 * 将PascalCase转换为kebab-case
 */
export function pascalToKebab(pascal: string): string {
  return pascal
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * 首字母大写
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 首字母小写
 */
export function uncapitalize(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

// ============================================================================
// 代码格式化工具
// ============================================================================

/** 缩进级别 */
const DEFAULT_INDENT = '  '

/**
 * 生成缩进字符串
 */
export function indent(level: number, char: string = DEFAULT_INDENT): string {
  return char.repeat(level)
}

/**
 * 格式化多行代码
 */
export function formatCode(lines: string[], baseIndent: number = 0): string {
  const indentStr = indent(baseIndent)
  return lines.map(line => (line.trim() ? `${indentStr}${line}` : '')).join('\n')
}

/**
 * 生成JSDoc注释
 */
export function generateJSDoc(description: string, params?: Record<string, string>, returns?: string): string {
  const lines = ['/**']
  lines.push(` * ${description}`)

  if (params && Object.keys(params).length > 0) {
    for (const [name, desc] of Object.entries(params)) {
      lines.push(` * @param ${name} ${desc}`)
    }
  }

  if (returns) {
    lines.push(` * @returns ${returns}`)
  }

  lines.push(' */')
  return lines.join('\n')
}

// ============================================================================
// TypeScript工具
// ============================================================================

/**
 * 生成TypeScript属性类型
 */
export function generatePropType(prop: ComponentProp): string {
  if (prop.type.includes('|')) {
    // 联合类型
    return prop.required ? prop.type : `${prop.type} | undefined`
  }

  if (prop.type === 'string' || prop.type === 'number' || prop.type === 'boolean') {
    return prop.required ? prop.type : `${prop.type} | undefined`
  }

  if (prop.type === 'object') {
    return prop.required ? 'Record<string, any>' : 'Record<string, any> | undefined'
  }

  if (prop.type === 'array') {
    return prop.required ? 'any[]' : 'any[] | undefined'
  }

  if (prop.type === 'function') {
    return prop.required ? '(...args: any[]) => void' : '((...args: any[]) => void) | undefined'
  }

  if (prop.type === 'ReactNode') {
    return prop.required ? 'ReactNode' : 'ReactNode | undefined'
  }

  return prop.type
}

/**
 * 生成TypeScript接口
 */
export function generateInterface(name: string, props: ComponentProp[], baseIndent: number = 0): string {
  const lines = [
    `${generateJSDoc(`${name} 组件属性`)}`,
    `export interface ${name}Props {`
  ]

  for (const prop of props) {
    const propType = generatePropType(prop)
    const defaultValue = prop.defaultValue !== undefined && !prop.required
      ? ` = ${formatDefaultValue(prop.defaultValue)}`
      : ''

    if (prop.description) {
      lines.push(`${indent(1, DEFAULT_INDENT)}${generateJSDoc(prop.description)}`)
    }

    lines.push(
      `${indent(1, DEFAULT_INDENT)}${prop.name}${prop.required ? '' : '?'}: ${propType}${defaultValue},`
    )
  }

  lines.push('}')
  return formatCode(lines, baseIndent)
}

/**
 * 格式化默认值
 */
function formatDefaultValue(value: any): string {
  if (typeof value === 'string') {
    return `"${value}"`
  }
  if (typeof value === 'boolean' || typeof value === 'number') {
    return String(value)
  }
  if (Array.isArray(value)) {
    return `[]`
  }
  if (typeof value === 'object') {
    return `{}`
  }
  return 'undefined'
}

// ============================================================================
// React组件工具
// ============================================================================

/**
 * 生成组件导入语句
 */
export function generateImports(dependencies: string[]): string {
  const imports = [
    "import React from 'react'",
    "import { motion } from 'framer-motion'",
    "import { cn } from '@xorigo-ui/utils'"
  ]

  for (const dep of dependencies) {
    if (dep.startsWith('@xorigo-ui/')) {
      imports.push(`import { ${dep.split('/').pop()} } from '${dep}'`)
    }
  }

  return imports.join('\n')
}

/**
 * 生成组件基础结构
 */
export function generateComponentStructure(
  name: string,
  props: ComponentProp[],
  hasChildren: boolean = true,
  baseIndent: number = 0
): string[] {
  const lines: string[] = []

  // Props解构
  const destructuredProps: string[] = []
  for (const prop of props) {
    if (prop.name === 'children' && hasChildren) {
      destructuredProps.push('children')
    } else {
      destructuredProps.push(`${prop.name}`)
    }
  }

  if (destructuredProps.length > 0) {
    lines.push(`const { ${destructuredProps.join(', ')} } = props`)
    lines.push('')
  }

  // 组件实现
  lines.push(`export function ${name}({`)
  for (const prop of props) {
    const propType = generatePropType(prop)
    const defaultValue = prop.defaultValue !== undefined && !prop.required
      ? ` = ${formatDefaultValue(prop.defaultValue)}`
      : ''

    lines.push(`  ${prop.name}${prop.required ? '' : '?'}: ${propType}${defaultValue},`)
  }
  lines.push(`}: ${name}Props) {`)
  lines.push('  // TODO: Implement component logic')
  lines.push('  return null')
  lines.push('}')

  return formatCode(lines, baseIndent).split('\n')
}

/**
 * 生成示例用法代码
 */
export function generateExampleUsage(name: string, props: ComponentProp[]): string {
  const exampleProps: string[] = []

  for (const prop of props) {
    if (prop.name === 'children') {
      exampleProps.push(`  children = "示例内容"`)
    } else if (prop.type === 'string' && !prop.required) {
      exampleProps.push(`  ${prop.name} = "${prop.name}示例"`)
    } else if (prop.type === 'boolean' && !prop.required) {
      exampleProps.push(`  ${prop.name} = {true}`)
    } else if (prop.type === 'number' && !prop.required) {
      exampleProps.push(`  ${prop.name} = {42}`)
    }
  }

  const propsStr = exampleProps.length > 0 ? '\n' + exampleProps.join('\n') + '\n  ' : ''

  return `<${name}${propsStr}/>`
}

// ============================================================================
// 验证工具
// ============================================================================

/**
 * 验证组件名称
 */
export function validateComponentName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: '组件名称不能为空' }
  }

  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    return {
      valid: false,
      error: '组件名称必须为PascalCase格式（例如：MyComponent）'
    }
  }

  return { valid: true }
}

/**
 * 验证组件规范
 */
export function validateSpec(spec: ComponentSpec): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // 验证组件名称
  const nameValidation = validateComponentName(spec.name)
  if (!nameValidation.valid) {
    errors.push(nameValidation.error!)
  }

  // 验证属性
  if (!spec.props || spec.props.length === 0) {
    errors.push('组件必须至少包含一个属性')
  } else {
    // 检查属性名是否重复
    const propNames = new Set<string>()
    for (const prop of spec.props) {
      if (propNames.has(prop.name)) {
        errors.push(`属性名重复：${prop.name}`)
      }
      propNames.add(prop.name)

      // 验证属性名格式
      if (!/^[a-z][a-zA-Z0-9]*$/.test(prop.name)) {
        errors.push(`属性名必须为camelCase格式：${prop.name}`)
      }
    }
  }

  // 验证变体
  if (spec.variants) {
    const variantNames = new Set<string>()
    for (const variant of spec.variants) {
      if (variantNames.has(variant.name)) {
        errors.push(`变体名重复：${variant.name}`)
      }
      variantNames.add(variant.name)
    }
  }

  return { valid: errors.length === 0, errors }
}

// ============================================================================
// 性能监控
// ============================================================================

/**
 * 性能计时器
 */
export class PerformanceTimer {
  private startTime: number = 0

  start(): void {
    this.startTime = Date.now()
  }

  end(): number {
    return Date.now() - this.startTime
  }
}

/**
 * 生成唯一ID
 */
export function generateId(prefix: string = 'xorigo'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
