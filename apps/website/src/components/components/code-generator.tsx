/**
 * 代码生成器 - 支持多种格式的组件代码生成
 */

import { ComponentMeta, ExampleMeta } from './component-registry'

export type CodeFormat = 'react' | 'vue' | 'html' | 'jsx' | 'tsx'

export interface CodeOptions {
  format: CodeFormat
  includeImports?: boolean
  includeTypeScript?: boolean
  includeProps?: boolean
  variant?: string
  size?: string
  state?: string
  theme?: string
}

/**
 * 生成组件代码
 */
export function generateComponentCode(
  component: ComponentMeta,
  options: CodeOptions
): string {
  const { format, includeImports = true, includeTypeScript = format === 'tsx', variant, size, state } = options

  switch (format) {
    case 'react':
    case 'jsx':
      return generateReactCode(component, { ...options, includeImports, includeTypeScript: false })
    case 'tsx':
      return generateReactCode(component, { ...options, includeImports, includeTypeScript: true })
    case 'vue':
      return generateVueCode(component, options)
    case 'html':
      return generateHTMLCode(component, options)
    default:
      return generateReactCode(component, options)
  }
}

/**
 * 生成 React 代码
 */
function generateReactCode(
  component: ComponentMeta,
  options: CodeOptions & { includeTypeScript: boolean }
): string {
  const { includeImports, includeTypeScript, variant, size, state } = options
  const { id, name, examples } = component

  // 获取默认示例或生成基础示例
  const defaultExample = examples.find(ex => ex.isDefault) || examples[0]
  let code = defaultExample?.code || generateBasicExample(component, 'react')

  // 如果指定了变体，修改代码
  if (variant || size || state) {
    code = modifyCodeWithVariants(code, component, { variant, size, state })
  }

  // 确保包含正确的导入
  if (includeImports) {
    const imports = generateReactImports(component, includeTypeScript)
    code = `${imports}\n\n${code}`
  }

  // 添加 TypeScript 支持
  if (includeTypeScript && !code.includes('interface ') && !code.includes('type ')) {
    const propsInterface = generateTypeScriptInterface(component)
    if (propsInterface) {
      code = `${propsInterface}\n\n${code}`
    }
  }

  return code
}

/**
 * 生成 Vue 代码
 */
function generateVueCode(component: ComponentMeta, options: CodeOptions): string {
  const { variant, size, state } = options
  const { name, examples } = component

  // 从 React 示例转换到 Vue
  const defaultExample = examples.find(ex => ex.isDefault) || examples[0]
  let vueCode = convertReactToVue(defaultExample?.code || generateBasicExample(component, 'vue'))

  // 添加变体支持
  if (variant || size || state) {
    vueCode = modifyVueCodeWithVariants(vueCode, component, { variant, size, state })
  }

  return vueCode
}

/**
 * 生成 HTML 代码
 */
function generateHTMLCode(component: ComponentMeta, options: CodeOptions): string {
  const { variant, size, state } = options
  const { name, examples } = component

  const defaultExample = examples.find(ex => ex.isDefault) || examples[0]
  let htmlCode = convertToHTML(defaultExample?.code || generateBasicExample(component, 'html'))

  // 添加样式属性
  const className = generateHTMLClasses(component, { variant, size, state })
  if (className) {
    htmlCode = htmlCode.replace(/class="([^"]*)"/g, `class="$1 ${className}"`)
  }

  return `<!-- ${name} Component -->\n${htmlCode}`
}

/**
 * 生成 React 导入语句
 */
function generateReactImports(component: ComponentMeta, includeTypeScript: boolean): string {
  const imports = new Set<string>()

  // 基础导入
  imports.add("import React from 'react'")

  // 组件导入
  if (component.id === 'button') {
    imports.add("import { Button } from '@xorigo-ui/core'")
  } else if (component.id === 'card') {
    imports.add("import { Card, CardContent, CardHeader } from '@xorigo-ui/core'")
  } else if (component.id === 'input') {
    imports.add("import { Input } from '@xorigo-ui/core'")
  } else if (component.id === 'alert') {
    imports.add("import { Alert } from '@xorigo-ui/core'")
  } else if (component.id === 'tabs') {
    imports.add("import { Tabs, TabsContent, TabsList, TabsTrigger } from '@xorigo-ui/core'")
  } else if (component.id === 'modal') {
    imports.add("import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@xorigo-ui/core'")
  }

  // Hook 导入
  if (component.id === 'modal') {
    imports.add("import { useState } from 'react'")
  }

  return Array.from(imports).join('\n')
}

/**
 * 生成 TypeScript 接口
 */
function generateTypeScriptInterface(component: ComponentMeta): string {
  const { id, props } = component

  const interfaceName = `${name}Props`
  const propDefinitions = props.map(prop => {
    let typeDef = prop.type
    if (prop.required === false) {
      typeDef += '?'
    }
    return `  ${prop.name}: ${typeDef}`
  }).join('\n')

  return `interface ${interfaceName} {\n${propDefinitions}\n}`
}

/**
 * 生成基础示例
 */
function generateBasicExample(component: ComponentMeta, format: CodeFormat): string {
  const { name, id } = component

  switch (id) {
    case 'button':
      return format === 'vue'
        ? `<template>
  <Button @click="handleClick">点击按钮</Button>
</template>

<script setup>
const handleClick = () => {
  console.log('Button clicked')
}
</script>`
        : `function Example() {
  return <Button onClick={() => console.log('clicked')}>点击按钮</Button>
}`

    case 'card':
      return format === 'vue'
        ? `<template>
  <Card>
    <CardContent>
      <h3>卡片标题</h3>
      <p>卡片内容</p>
    </CardContent>
  </Card>
</template>`
        : `function Example() {
  return (
    <Card>
      <CardContent>
        <h3>卡片标题</h3>
        <p>卡片内容</p>
      </CardContent>
    </Card>
  )
}`

    case 'input':
      return format === 'vue'
        ? `<template>
  <Input v-model="value" placeholder="请输入内容" />
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
</script>`
        : `function Example() {
  const [value, setValue] = useState('')

  return (
    <Input
      value={value}
      onChange={setValue}
      placeholder="请输入内容"
    />
  )
}`

    default:
      return `function Example() {
  return <${name} />
}`
  }
}

/**
 * 修改代码以支持变体
 */
function modifyCodeWithVariants(
  code: string,
  component: ComponentMeta,
  variants: { variant?: string; size?: string; state?: string }
): string {
  let modifiedCode = code

  // 修改组件属性
  if (variants.variant) {
    modifiedCode = modifiedCode.replace(
      /<(\w+)/g,
      `<$1 variant="${variants.variant}"`
    )
  }

  if (variants.size) {
    modifiedCode = modifiedCode.replace(
      /variant="[^"]*"/,
      `variant="${variants.variant}" size="${variants.size}"`
    )
  }

  if (variants.state && component.id === 'input') {
    modifiedCode = modifiedCode.replace(
      /<Input/g,
      `<Input ${variants.state === 'error' ? 'error' : variants.state === 'disabled' ? 'disabled' : ''}`
    )
  }

  return modifiedCode
}

/**
 * 修改 Vue 代码以支持变体
 */
function modifyVueCodeWithVariants(
  code: string,
  component: ComponentMeta,
  variants: { variant?: string; size?: string; state?: string }
): string {
  let modifiedCode = code

  // 修改组件属性
  if (variants.variant) {
    modifiedCode = modifiedCode.replace(
      /<(\w+)/g,
      `<$1 variant="${variants.variant}"`
    )
  }

  if (variants.size) {
    modifiedCode = modifiedCode.replace(
      /variant="[^"]*"/,
      `variant="${variants.variant}" size="${variants.size}"`
    )
  }

  return modifiedCode
}

/**
 * 转换 React 代码到 Vue
 */
function convertReactToVue(reactCode: string): string {
  return reactCode
    .replace(/function \w+\(\) \{\s*return \(/g, '<template>')
    .replace(/\);\s*\}/g, '</template>')
    .replace(/className=/g, 'class=')
    .replace(/onClick=/g, '@click=')
    .replace(/onChange=/g, '@input=')
    .replace(/value=\{([^}]+)\}/g, ':value="$1"')
    .replace(/\{([^}]+)\}/g, '{{ $1 }}')
}

/**
 * 转换为 HTML
 */
function convertToHTML(code: string): string {
  return code
    .replace(/function \w+\(\) \{\s*return \(/g, '')
    .replace(/\);\s*\}/g, '')
    .replace(/className=/g, 'class=')
    .replace(/onClick=\{[^}]+\}/g, '')
    .replace(/onChange=\{[^}]+\}/g, '')
    .replace(/\{[^}]+\}/g, '')
    .replace(/<(\w+) \s*\/>/g, '<$1></$1>')
}

/**
 * 生成 HTML 类名
 */
function generateHTMLClasses(
  component: ComponentMeta,
  variants: { variant?: string; size?: string; state?: string }
): string {
  const classes = []

  if (variants.variant) {
    classes.push(`variant-${variants.variant}`)
  }
  if (variants.size) {
    classes.push(`size-${variants.size}`)
  }
  if (variants.state) {
    classes.push(`state-${variants.state}`)
  }

  return classes.join(' ')
}

/**
 * 格式化代码
 */
export function formatCode(code: string, language: CodeFormat): string {
  try {
    // 这里可以集成代码格式化工具，如 Prettier
    return code
  } catch (error) {
    return code
  }
}

/**
 * 代码复制工具
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (error) {
      document.body.removeChild(textArea)
      return false
    }
  }
}