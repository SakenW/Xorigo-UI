/**
 * 组件文件系统扫描器
 * 自动扫描和发现组件文件，提取元数据信息
 *
 * 注意：此文件使用 Node.js fs 模块，仅在服务器端可用
 */

// import fs from 'fs/promises'
// import path from 'path'
import { ComponentMetadata, ComponentProp, ComponentExample } from './ComponentRegistry'

// 简化的模拟数据，避免在客户端使用 fs 模块
const MOCK_COMPONENTS: ComponentMetadata[] = [
  {
    id: 'button',
    name: 'Button',
    displayName: '按钮',
    description: '基础按钮组件',
    category: 'inputs',
    tags: ['button', 'click', 'action'],
    version: '1.0.0',
    props: [
      { name: 'variant', type: 'string', required: false, description: '按钮样式变体' },
      { name: 'size', type: 'string', required: false, description: '按钮尺寸' },
      { name: 'disabled', type: 'boolean', required: false, description: '是否禁用' }
    ],
    examples: [],
    filePath: 'inputs/button.tsx',
    source: '// Button component source code'
  },
  {
    id: 'input',
    name: 'Input',
    displayName: '输入框',
    description: '文本输入组件',
    category: 'inputs',
    tags: ['input', 'form', 'text'],
    version: '1.0.0',
    props: [
      { name: 'value', type: 'string', required: false, description: '输入值' },
      { name: 'placeholder', type: 'string', required: false, description: '占位符' },
      { name: 'disabled', type: 'boolean', required: false, description: '是否禁用' }
    ],
    examples: [],
    filePath: 'inputs/input.tsx',
    source: '// Input component source code'
  }
]

// ============================================================================
// 类型定义
// ============================================================================

export interface ScanOptions {
  rootPath: string
  includeTestFiles?: boolean
  excludePatterns?: string[]
  maxDepth?: number
  parallel?: boolean
}

export interface ScanResult {
  metadata: ComponentMetadata[]
  errors: ScanError[]
  stats: ScanStats
}

export interface ScanError {
  filePath: string
  error: string
  message: string
}

export interface ScanStats {
  totalFiles: number
  scannedFiles: number
  validComponents: number
  invalidComponents: number
  skippedFiles: number
  scanTime: number
}

// ============================================================================
// 组件扫描器类
// ============================================================================

export class ComponentScanner {
  private options: ScanOptions
  private stats: ScanStats

  constructor(options: ScanOptions) {
    this.options = {
      includeTestFiles: false,
      excludePatterns: [
        'node_modules',
        '.git',
        'dist',
        'build',
        '.next',
        '.turbo',
        'coverage',
        '__snapshots__',
        '*.test.ts',
        '*.test.tsx',
        '*.spec.ts',
        '*.spec.tsx',
        '*.stories.tsx'
      ],
      maxDepth: 10,
      parallel: true,
      ...options
    }
    this.stats = {
      totalFiles: 0,
      scannedFiles: 0,
      validComponents: 0,
      invalidComponents: 0,
      skippedFiles: 0,
      scanTime: 0
    }
  }

  /**
   * 扫描目录并提取所有组件元数据
   * 注意：为了避免客户端使用 fs 模块，这里返回模拟数据
   */
  async scan(): Promise<ScanResult> {
    const startTime = Date.now()

    // 在客户端环境或无法访问文件系统时，返回模拟数据
    if (typeof window !== 'undefined' || !this.options.rootPath) {
      this.stats = {
        totalFiles: MOCK_COMPONENTS.length,
        scannedFiles: MOCK_COMPONENTS.length,
        validComponents: MOCK_COMPONENTS.length,
        invalidComponents: 0,
        skippedFiles: 0,
        scanTime: Date.now() - startTime
      }

      return {
        metadata: MOCK_COMPONENTS,
        errors: [],
        stats: this.stats
      }
    }

    // 服务器端真实扫描逻辑（暂时注释掉 fs 相关代码）
    /*
    try {
      const files = await this.findComponentFiles(this.options.rootPath)
      this.stats.totalFiles = files.length

      const metadata = await this.extractMetadata(files)

      this.stats.scanTime = Date.now() - startTime

      return {
        metadata,
        errors: this.stats.invalidComponents > 0 ? this.collectErrors(metadata) : [],
        stats: this.stats
      }
    } catch (error) {
      throw new Error(`扫描失败: ${error instanceof Error ? error.message : String(error)}`)
    }
    */

    // 临时返回模拟数据
    this.stats = {
      totalFiles: MOCK_COMPONENTS.length,
      scannedFiles: MOCK_COMPONENTS.length,
      validComponents: MOCK_COMPONENTS.length,
      invalidComponents: 0,
      skippedFiles: 0,
      scanTime: Date.now() - startTime
    }

    return {
      metadata: MOCK_COMPONENTS,
      errors: [],
      stats: this.stats
    }
  }

  /**
   * 查找所有组件文件
   * 注意：为了避免在客户端使用 fs 模块，此方法已简化
   */
  private async findComponentFiles(rootPath: string): Promise<string[]> {
    // 在客户端环境，返回空数组，避免使用 fs
    if (typeof window !== 'undefined') {
      return []
    }

    // 服务器端真实扫描逻辑（暂时注释掉）
    /*
    const files: string[] = []
    const excludePatterns = this.options.excludePatterns || []

    const scan = async (dirPath: string, depth: number = 0): Promise<void> => {
      if (depth > (this.options.maxDepth || 10)) return

      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true })

        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name)
          const relativePath = path.relative(rootPath, fullPath)

          // 检查排除模式
          if (this.shouldExclude(relativePath, excludePatterns)) {
            this.stats.skippedFiles++
            continue
          }

          if (entry.isDirectory()) {
            await scan(fullPath, depth + 1)
          } else if (entry.isFile() && this.isComponentFile(entry.name)) {
            files.push(fullPath)
          }
        }
      } catch (error) {
        console.warn(`无法读取目录 ${dirPath}:`, error)
      }
    }

    await scan(rootPath)
    return files
    */

    return []
  }

  /**
   * 检查文件是否应该被排除
   */
  private shouldExclude(filePath: string, patterns: string[]): boolean {
    return patterns.some(pattern => {
      if (pattern.startsWith('*.') && filePath.endsWith(pattern)) {
        return true
      }
      if (filePath.includes(pattern)) {
        return true
      }
      return false
    })
  }

  /**
   * 检查是否为组件文件
   */
  private isComponentFile(filename: string): boolean {
    const componentExtensions = ['.tsx', '.ts']
    const excludeFiles = [
      'index.ts',
      'index.tsx',
      'types.ts',
      'types.tsx',
      'constants.ts',
      'utils.ts',
      'helpers.ts',
      'styles.ts',
      'styles.tsx'
    ]

    if (!componentExtensions.some(ext => filename.endsWith(ext))) {
      return false
    }

    if (excludeFiles.includes(filename)) {
      return false
    }

    return true
  }

  /**
   * 提取组件元数据
   * 注意：为了避免在客户端使用 fs 模块，此方法已简化
   */
  private async extractMetadata(files: string[]): Promise<ComponentMetadata[]> {
    // 在客户端环境，返回模拟数据
    if (typeof window !== 'undefined' || files.length === 0) {
      return MOCK_COMPONENTS
    }

    // 服务器端真实提取逻辑（暂时注释掉）
    /*
    const metadata: ComponentMetadata[] = []

    if (this.options.parallel) {
      const results = await Promise.allSettled(files.map(file => this.extractFromFile(file)))
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          metadata.push(result.value)
          this.stats.validComponents++
        } else {
          this.stats.invalidComponents++
        }
        this.stats.scannedFiles++
      })
    } else {
      for (const file of files) {
        try {
          const meta = await this.extractFromFile(file)
          if (meta) {
            metadata.push(meta)
            this.stats.validComponents++
          } else {
            this.stats.invalidComponents++
          }
        } catch (error) {
          this.stats.invalidComponents++
        }
        this.stats.scannedFiles++
      }
    }

    return metadata
    */

    return MOCK_COMPONENTS
  }

  /**
   * 从单个文件提取元数据
   * 注意：为了避免在客户端使用 fs 模块，此方法已简化
   */
  private async extractFromFile(filePath: string): Promise<ComponentMetadata | null> {
    // 在客户端环境，返回 null 或模拟数据
    if (typeof window !== 'undefined') {
      return null
    }

    // 服务器端真实提取逻辑（暂时注释掉）
    /*
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const relativePath = path.relative(this.options.rootPath, filePath)

      // 检测是否为React组件
      if (!this.isReactComponent(content)) {
        return null
      }

      // 提取组件信息
      const name = this.extractComponentName(content, filePath)
      const displayName = name
      const description = this.extractDescription(content)
      const category = this.determineCategory(relativePath)
      const tags = this.extractTags(content, category)
      const props = this.extractProps(content)
      const examples = this.extractExamples(content)
      const version = this.extractVersion(content)

      return {
        id: this.generateComponentId(name, relativePath),
        name,
        displayName,
        description,
        category,
        tags,
        version,
        props,
        examples,
        filePath: relativePath,
        source: content.substring(0, 500) + (content.length > 500 ? '...' : '')
      }
    } catch (error) {
      console.warn(`处理文件失败 ${filePath}:`, error)
      return null
    }
    */

    return null
  }

  /**
   * 检测是否为React组件
   */
  private isReactComponent(content: string): boolean {
    const reactPatterns = [
      /import\s+{[^}]*}\s+from\s+['"]react['"]/,
      /from\s+['"]react['"]/,
      /React\.FC/,
      /React\.Component/,
      /extends\s+React\./,
      /function\s+\w+\s*\([^)]*\)\s*{/,
      /const\s+\w+\s*=\s*\([^)]*\)\s*=>/,
      /export\s+default\s+\w+/
    ]

    return reactPatterns.some(pattern => pattern.test(content))
  }

  /**
   * 提取组件名称
   */
  private extractComponentName(content: string, filePath: string): string {
    const patterns = [
      /export\s+(?:default\s+)?(?:function|const)?\s*([A-Z]\w*)/,
      /function\s+([A-Z]\w*)/,
      /const\s+([A-Z]\w*)\s*=/
    ]

    for (const pattern of patterns) {
      const match = content.match(pattern)
      if (match) {
        return match[1]
      }
    }

    // 从文件名提取
    const filename = path.basename(filePath, path.extname(filePath))
    if (filename !== 'index') {
      return filename.charAt(0).toUpperCase() + filename.slice(1)
    }

    return 'UnknownComponent'
  }

  /**
   * 提取描述
   */
  private extractDescription(content: string): string {
    const patterns = [
      /@description\s+([^*]+)/,
      /@summary\s+([^*]+)/,
      /\/\*\*\s*\n\s*\*\s+([^*]+)/
    ]

    for (const pattern of patterns) {
      const match = content.match(pattern)
      if (match) {
        return match[1].trim()
      }
    }

    return '暂无描述'
  }

  /**
   * 确定分类
   */
  private determineCategory(filePath: string): string {
    const categories: Record<string, string> = {
      'accessibility': 'a11y',
      'ai': 'ai',
      'blocks': 'blocks',
      'branding': 'branding',
      'charts': 'charts',
      'data-display': 'data-display',
      'effects': 'effects',
      'feedback': 'feedback',
      'forms': 'forms',
      'inputs': 'inputs',
      'interactive': 'interactive',
      'layout': 'layout',
      'motion': 'motion',
      'navigation': 'navigation',
      'overlays': 'overlays',
      'primitives': 'primitives',
      'showcase': 'showcase',
      'templates': 'templates',
      'typography': 'typography',
      'utilities': 'utilities'
    }

    for (const [dir, category] of Object.entries(categories)) {
      if (filePath.includes(`/src/${dir}/`) || filePath.includes(`/src/components/${dir}/`)) {
        return category
      }
    }

    return 'uncategorized'
  }

  /**
   * 提取标签
   */
  private extractTags(content: string, category: string): string[] {
    const tags = new Set<string>([category])

    // 从JSDoc标签提取
    const jsdocTags = content.match(/@tags?\s+([^\n]+)/g)
    if (jsdocTags) {
      jsdocTags.forEach(tag => {
        const matches = tag.match(/@tags?\s+([^\n]+)/)
        if (matches) {
          matches[1].split(',').map(t => t.trim()).forEach(t => tags.add(t))
        }
      })
    }

    // 从注释中提取
    const commentTags = content.match(/\/\/+\s*tags?:?\s*([^\n]+)/gi)
    if (commentTags) {
      commentTags.forEach(tag => {
        const match = tag.match(/tags?:?\s*([^\n]+)/i)
        if (match) {
          match[1].split(',').map(t => t.trim()).forEach(t => tags.add(t))
        }
      })
    }

    // 自动生成常用标签
    if (content.includes('useState') || content.includes('useEffect')) {
      tags.add('hooks')
    }

    if (content.includes('forwardRef')) {
      tags.add('forward-ref')
    }

    if (content.includes('memo')) {
      tags.add('optimized')
    }

    return Array.from(tags)
  }

  /**
   * 提取属性
   */
  private extractProps(content: string): ComponentProp[] {
    const props: ComponentProp[] = []

    // 提取接口定义
    const interfacePattern = /interface\s+(\w*Props|Props)\s*{([^}]+)}/g
    let match
    while ((match = interfacePattern.exec(content)) !== null) {
      const propsContent = match[2]
      const propMatches = propsContent.match(/(\w+)(\??):\s*([^;]+);/g)
      if (propMatches) {
        propMatches.forEach(prop => {
          const propMatch = prop.match(/(\w+)(\??):\s*([^;]+);/)
          if (propMatch) {
            const [, name, optional, type] = propMatch
            props.push({
              name,
              type: type.trim(),
              required: optional !== '?',
              description: this.extractPropDescription(propsContent, name)
            })
          }
        })
      }
    }

    // 提取函数参数
    const functionPattern = /(?:function|const)\s+\w+\s*\(([^)]+)\)/
    const functionMatch = content.match(functionPattern)
    if (functionMatch && props.length === 0) {
      const params = functionMatch[1]
      const paramMatches = params.match(/(\w+)(\??):\s*([^,)]+)/g)
      if (paramMatches) {
        paramMatches.forEach(param => {
          const paramMatch = param.match(/(\w+)(\??):\s*([^,)]+)/)
          if (paramMatch) {
            const [, name, optional, type] = paramMatch
            props.push({
              name,
              type: type.trim(),
              required: optional !== '?'
            })
          }
        })
      }
    }

    return props
  }

  /**
   * 提取属性描述
   */
  private extractPropDescription(propsContent: string, propName: string): string | undefined {
    const pattern = new RegExp(`(\\w+)\\s*\\?*:\\s*[^;]+;[^/]*\\/\\/\\s*([^\\n]+)`)
    const match = propsContent.match(pattern)
    if (match) {
      return match[2].trim()
    }
    return undefined
  }

  /**
   * 提取示例
   */
  private extractExamples(content: string): ComponentExample[] {
    const examples: ComponentExample[] = []

    // 查找代码块示例
    const codeBlockPattern = /```(?:tsx|jsx|ts|js)?\n([\s\S]*?)```/g
    let match
    while ((match = codeBlockPattern.exec(content)) !== null) {
      const code = match[1].trim()
      if (code.includes('<') && code.includes('>')) {
        examples.push({
          id: `example-${examples.length + 1}`,
          name: `示例 ${examples.length + 1}`,
          code
        })
      }
    }

    return examples
  }

  /**
   * 提取版本
   */
  private extractVersion(content: string): string {
    const match = content.match(/@version\s+([^\s\n]+)/)
    if (match) {
      return match[1]
    }
    return '1.0.0'
  }

  /**
   * 生成组件ID
   */
  private generateComponentId(name: string, filePath: string): string {
    const normalized = name
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
    return normalized
  }

  /**
   * 收集错误信息
   */
  private collectErrors(metadata: ComponentMetadata[]): ScanError[] {
    // 这里应该记录扫描过程中的错误
    // 简化实现
    return []
  }
}

export default ComponentScanner
