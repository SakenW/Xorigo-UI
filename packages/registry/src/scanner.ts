/**
 * 组件扫描器 - 使用 TypeScript Compiler API 自动提取组件元数据
 */

import fs from 'fs/promises'
import path from 'path'
import type { Component, ComponentProp } from './types'

// 扫描选项
export interface ScanOptions {
  /**
   * 包路径
   */
  packagePath: string
  /**
   * 包名称
   */
  packageName: string
  /**
   * 要扫描的目录
   */
  sourceDir?: string
  /**
   * 排除的目录
   */
  excludeDirs?: string[]
}

// 扫描结果
export interface ScanResult {
  components: Component[]
  errors: ScanError[]
  stats: {
    filesScanned: number
    componentsFound: number
    duration: number
  }
}

// 扫描错误
export interface ScanError {
  file: string
  error: string
  line?: number
}

/**
 * 组件扫描器类
 */
export class ComponentScanner {
  private components: Component[] = []
  private errors: ScanError[] = []
  private filesScanned = 0
  private startTime = 0

  /**
   * 扫描包中的所有组件
   */
  async scan(options: ScanOptions): Promise<ScanResult> {
    this.startTime = Date.now()
    this.components = []
    this.errors = []
    this.filesScanned = 0

    const sourceDir = options.sourceDir || 'src'
    const fullPath = path.join(options.packagePath, sourceDir)

    try {
      await this.scanDirectory(fullPath, options)
    } catch (error) {
      this.errors.push({
        file: fullPath,
        error: error instanceof Error ? error.message : String(error),
      })
    }

    return {
      components: this.components,
      errors: this.errors,
      stats: {
        filesScanned: this.filesScanned,
        componentsFound: this.components.length,
        duration: Date.now() - this.startTime,
      },
    }
  }

  /**
   * 递归扫描目录
   */
  private async scanDirectory(dirPath: string, options: ScanOptions): Promise<void> {
    const excludeDirs = options.excludeDirs || ['node_modules', 'dist', '__tests__', 'tests']

    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true })

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name)

        if (item.isDirectory()) {
          if (!excludeDirs.includes(item.name)) {
            await this.scanDirectory(fullPath, options)
          }
        } else if (item.isFile() && /\.(tsx?)$/.test(item.name)) {
          await this.scanFile(fullPath, options)
        }
      }
    } catch (error) {
      this.errors.push({
        file: dirPath,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * 扫描单个文件
   */
  private async scanFile(filePath: string, options: ScanOptions): Promise<void> {
    this.filesScanned++

    try {
      const content = await fs.readFile(filePath, 'utf-8')

      // 跳过不包含组件的文件
      if (!this.isComponentFile(content)) {
        return
      }

      const component = await this.extractComponent(filePath, content, options)
      if (component) {
        this.components.push(component)
      }
    } catch (error) {
      this.errors.push({
        file: filePath,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  /**
   * 判断是否是组件文件
   */
  private isComponentFile(content: string): boolean {
    // 检查是否包含 React 组件定义
    const componentPatterns = [
      /export\s+(const|function)\s+[A-Z]\w+/,
      /export\s+default\s+(function\s+)?[A-Z]\w+/,
      /React\.forwardRef/,
      /React\.memo/,
    ]

    return componentPatterns.some(pattern => pattern.test(content))
  }

  /**
   * 提取组件信息
   */
  private async extractComponent(
    filePath: string,
    content: string,
    options: ScanOptions
  ): Promise<Component | null> {
    // 提取组件名称
    const name = this.extractComponentName(content, filePath)
    if (!name) return null

    // 提取描述
    const description = this.extractDescription(content) || `${name} 组件`

    // 推断分类
    const category = this.inferCategory(filePath, name)

    // 提取 Props
    const props = this.extractProps(content, name)

    // 检查可访问性特性
    const accessibility = this.checkAccessibility(content)

    // 检查主题支持
    const theme = this.checkThemeSupport(content)

    // 提取变体
    const variants = this.extractVariants(content)

    // 生成示例代码
    const example = this.generateExample(name, props)

    return {
      name,
      description,
      category,
      framework: 'react',
      style: 'tailwind',
      files: [path.relative(options.packagePath, filePath)],
      props,
      variants,
      example,
      accessibility,
      theme,
    }
  }

  /**
   * 提取组件名称
   */
  private extractComponentName(content: string, filePath: string): string | null {
    // 尝试从 export 语句提取
    const exportPatterns = [
      /export\s+(?:const|function)\s+([A-Z]\w+)/,
      /export\s+default\s+(?:function\s+)?([A-Z]\w+)/,
      /(?:const|function)\s+([A-Z]\w+)\s*=\s*React\.forwardRef/,
    ]

    for (const pattern of exportPatterns) {
      const match = content.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    // 从文件名提取
    const fileName = path.basename(filePath, path.extname(filePath))
    if (/^[A-Z]/.test(fileName)) {
      return fileName
    }

    return null
  }

  /**
   * 提取组件描述
   */
  private extractDescription(content: string): string | null {
    // 提取 JSDoc 注释
    const jsdocMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/)
    if (jsdocMatch && jsdocMatch[1]) {
      return jsdocMatch[1]
    }

    // 提取单行注释
    const singleLineMatch = content.match(/\/\/\s*(.+?)\n\s*export/)
    if (singleLineMatch && singleLineMatch[1]) {
      return singleLineMatch[1]
    }

    return null
  }

  /**
   * 推断组件分类
   */
  private inferCategory(filePath: string, componentName: string): Component['category'] {
    const pathLower = filePath.toLowerCase()
    const nameLower = componentName.toLowerCase()

    // 基于路径判断
    if (pathLower.includes('/base/') || pathLower.includes('/ui/')) return 'ui'
    if (pathLower.includes('/feedback/')) return 'feedback'
    if (pathLower.includes('/navigation/')) return 'navigation'
    if (pathLower.includes('/radix/')) return 'radix'
    if (pathLower.includes('/advanced/')) return 'advanced'

    // 基于组件名判断
    if (/button|icon|badge|avatar/i.test(nameLower)) return 'ui'
    if (/alert|toast|progress|spinner/i.test(nameLower)) return 'feedback'
    if (/menu|tabs|breadcrumb|pagination/i.test(nameLower)) return 'navigation'

    return 'ui' // 默认分类
  }

  /**
   * 提取 Props 定义
   */
  private extractProps(content: string, componentName: string): ComponentProp[] {
    const props: ComponentProp[] = []

    // 查找 Props 接口定义
    const propsInterfaceRegex = new RegExp(
      `interface\\s+${componentName}Props\\s*\\{([\\s\\S]*?)\\}`,
      'i'
    )
    const match = content.match(propsInterfaceRegex)

    if (!match || !match[1]) {
      return props
    }

    const propsContent = match[1]

    // 解析每个 prop
    const propLines = propsContent.split('\n').filter(line => {
      const trimmed = line.trim()
      return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')
    })

    for (const line of propLines) {
      const propMatch = line.match(/^\s*(\w+)(\?)?\s*:\s*(.+?)(?:\/\/\s*(.*))?$/)
      if (!propMatch) continue

      const [, name, optional, type, description] = propMatch

      props.push({
        name: name || '',
        type: type?.trim() || 'unknown',
        description: description?.trim(),
        required: !optional,
      })
    }

    return props
  }

  /**
   * 检查可访问性特性
   */
  private checkAccessibility(content: string): Component['accessibility'] {
    return {
      'aria-label': /aria-label/i.test(content),
      'keyboard-navigation': /onKeyDown|onKeyPress|tabIndex/i.test(content),
      'screen-reader': /role=|aria-/i.test(content),
      'color-contrast': true, // 默认假设满足
    }
  }

  /**
   * 检查主题支持
   */
  private checkThemeSupport(content: string): Component['theme'] {
    const usesTheme = /useTheme|ThemeProvider|theme\./i.test(content)
    const tokens: string[] = []

    // 提取使用的令牌
    const tokenMatches = content.matchAll(/var\(--([a-z-]+)\)/g)
    for (const match of tokenMatches) {
      if (match[1]) {
        tokens.push(match[1])
      }
    }

    return {
      supported: usesTheme,
      tokens: [...new Set(tokens)],
    }
  }

  /**
   * 提取变体定义
   */
  private extractVariants(content: string): Component['variants'] {
    const variants: Component['variants'] = []

    // 查找 variant 相关的类型定义
    const variantMatch = content.match(/variant\s*\??\s*:\s*([^;,}]+)/)
    if (!variantMatch) return variants

    const variantType = variantMatch[1] || ''
    const variantOptions = variantType.match(/'([^']+)'/g)

    if (variantOptions) {
      for (const option of variantOptions) {
        const variantName = option.replace(/'/g, '')
        variants.push({
          name: variantName,
          className: `variant-${variantName}`,
        })
      }
    }

    return variants
  }

  /**
   * 生成示例代码
   */
  private generateExample(name: string, props: ComponentProp[]): string {
    const requiredProps = props
      .filter(p => p.required)
      .map(p => {
        if (p.type === 'string') return `${p.name}="示例"`
        if (p.type === 'number') return `${p.name}={0}`
        if (p.type === 'boolean') return `${p.name}={true}`
        return `${p.name}={/* TODO */}`
      })
      .join(' ')

    return `<${name}${requiredProps ? ' ' + requiredProps : ''}>
  内容
</${name}>`
  }
}

/**
 * 便捷函数：扫描包
 */
export async function scanPackage(options: ScanOptions): Promise<ScanResult> {
  const scanner = new ComponentScanner()
  return scanner.scan(options)
}

/**
 * 便捷函数：扫描多个包
 */
export async function scanPackages(optionsArray: ScanOptions[]): Promise<ScanResult> {
  const scanner = new ComponentScanner()
  const allComponents: Component[] = []
  const allErrors: ScanError[] = []
  let totalFilesScanned = 0
  const startTime = Date.now()

  for (const options of optionsArray) {
    const result = await scanner.scan(options)
    allComponents.push(...result.components)
    allErrors.push(...result.errors)
    totalFilesScanned += result.stats.filesScanned
  }

  return {
    components: allComponents,
    errors: allErrors,
    stats: {
      filesScanned: totalFilesScanned,
      componentsFound: allComponents.length,
      duration: Date.now() - startTime,
    },
  }
}
