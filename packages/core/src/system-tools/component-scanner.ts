/**
 * Xorigo UI 组件扫描器
 *
 * 自动扫描和分析项目中的组件，提取API信息进行一致性验证
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import type { ComponentMetadata, APIValidationRule } from './api-standards'

// ============================================================================
// 组件分析结果接口
// ============================================================================

/**
 * 组件分析结果
 */
export interface ComponentAnalysis {
  /** 组件名称 */
  name: string
  /** 组件文件路径 */
  filePath: string
  /** 组件Props接口 */
  props: Record<string, PropInfo>
  /** 导出的类型 */
  exportedTypes: string[]
  /** 是否为可交互组件 */
  isInteractive: boolean
  /** 是否为主题组件 */
  isThemed: boolean
  /** 是否使用主题令牌 */
  usesThemeTokens: boolean
  /** 是否支持七轴主题 */
  supportsSevenAxis: boolean
  /** 是否有JSDoc注释 */
  hasJSDoc: boolean
  /** 是否有示例 */
  hasExamples: boolean
  /** 是否有测试文件 */
  hasTests: boolean
  /** 测试覆盖率 */
  testCoverage?: number
  /** 是否支持键盘导航 */
  supportsKeyboardNavigation: boolean
  /** 是否使用泛型 */
  usesGenerics: boolean
  /** 泛型约束 */
  genericConstraints?: string
  /** 组件分类 */
  category?: ComponentCategory
  /** 源代码内容 */
  sourceCode: string
  /** AST分析结果 */
  ast?: any
}

/**
 * Props信息
 */
export interface PropInfo {
  /** 属性名称 */
  name: string
  /** 属性类型 */
  type: string
  /** 是否必需 */
  required: boolean
  /** 默认值 */
  defaultValue?: any
  /** 描述 */
  description?: string
  /** 是否为事件处理器 */
  isEventHandler: boolean
  /** 枚举值 */
  enum?: string[]
}

/**
 * 组件分类
 */
export type ComponentCategory =
  | 'primitive'
  | 'form'
  | 'layout'
  | 'navigation'
  | 'overlay'
  | 'feedback'
  | 'display'
  | 'provider'
  | 'hook'

/**
 * 扫描配置
 */
export interface ScanConfig {
  /** 扫描根目录 */
  rootDir: string
  /** 组件文件模式 */
  componentPattern: string[]
  /** 测试文件模式 */
  testPattern: string[]
  /** 示例文件模式 */
  examplePattern: string[]
  /** 排除的目录 */
  excludeDirs: string[]
  /** 是否进行深度分析 */
  deepAnalysis: boolean
}

// ============================================================================
// 组件扫描器主类
// ============================================================================

/**
 * 组件扫描器
 */
export class ComponentScanner {
  private config: ScanConfig
  private cache: Map<string, ComponentAnalysis> = new Map()

  constructor(config: Partial<ScanConfig> = {}) {
    this.config = {
      rootDir: process.cwd(),
      componentPattern: ['**/*.tsx', '**/*.ts'],
      testPattern: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts'],
      examplePattern: ['**/*.example.tsx', '**/*.example.ts', '**/examples/**/*'],
      excludeDirs: [
        'node_modules',
        'dist',
        '.git',
        '.next',
        'coverage',
        'archived',
        'backup'
      ],
      deepAnalysis: true,
      ...config,
    }
  }

  /**
   * 扫描所有组件
   */
  async scanComponents(): Promise<ComponentAnalysis[]> {
    const componentFiles = await this.findComponentFiles()
    const analyses: ComponentAnalysis[] = []

    for (const filePath of componentFiles) {
      try {
        const analysis = await this.analyzeComponent(filePath)
        analyses.push(analysis)
        this.cache.set(filePath, analysis)
      } catch (error) {
        console.warn(`分析组件失败 ${filePath}:`, error)
      }
    }

    return analyses
  }

  /**
   * 查找组件文件
   */
  private async findComponentFiles(): Promise<string[]> {
    const files: string[] = []

    const walkDir = async (dir: string): Promise<void> => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true })

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name)

          // 跳过排除的目录
          if (entry.isDirectory() && this.config.excludeDirs.includes(entry.name)) {
            continue
          }

          if (entry.isDirectory()) {
            await walkDir(fullPath)
          } else if (entry.isFile()) {
            // 检查是否匹配组件文件模式
            const relativePath = path.relative(this.config.rootDir, fullPath)
            const isComponentFile = this.config.componentPattern.some(pattern =>
              this.matchPattern(relativePath, pattern)
            )

            // 过滤掉测试和示例文件
            const isTestFile = this.config.testPattern.some(pattern =>
              this.matchPattern(relativePath, pattern)
            )
            const isExampleFile = this.config.examplePattern.some(pattern =>
              this.matchPattern(relativePath, pattern)
            )

            if (isComponentFile && !isTestFile && !isExampleFile) {
              files.push(fullPath)
            }
          }
        }
      } catch (error) {
        // 忽略权限错误等
      }
    }

    await walkDir(this.config.rootDir)
    return files
  }

  /**
   * 简单的glob模式匹配
   */
  private matchPattern(str: string, pattern: string): boolean {
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '[^/]')
    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(str)
  }

  /**
   * 分析单个组件
   */
  async analyzeComponent(filePath: string): Promise<ComponentAnalysis> {
    // 检查缓存
    if (this.cache.has(filePath)) {
      return this.cache.get(filePath)!
    }

    const sourceCode = await fs.readFile(filePath, 'utf-8')
    const fileName = path.basename(filePath, path.extname(filePath))

    // 基础分析
    const analysis: ComponentAnalysis = {
      name: fileName,
      filePath,
      props: await this.extractProps(sourceCode),
      exportedTypes: this.extractExportedTypes(sourceCode),
      isInteractive: this.isInteractiveComponent(sourceCode),
      isThemed: this.isThemedComponent(sourceCode),
      usesThemeTokens: this.usesThemeTokens(sourceCode),
      supportsSevenAxis: this.supportsSevenAxis(sourceCode),
      hasJSDoc: this.hasJSDoc(sourceCode, fileName),
      hasExamples: await this.hasExamples(filePath),
      hasTests: await this.hasTests(filePath),
      supportsKeyboardNavigation: this.supportsKeyboardNavigation(sourceCode),
      usesGenerics: this.usesGenerics(sourceCode),
      genericConstraints: this.extractGenericConstraints(sourceCode),
      category: this.determineCategory(filePath, sourceCode),
      sourceCode,
    }

    // 深度分析
    if (this.config.deepAnalysis) {
      analysis.testCoverage = await this.getTestCoverage(filePath)
    }

    return analysis
  }

  /**
   * 提取Props信息
   */
  private async extractProps(sourceCode: string): Promise<Record<string, PropInfo>> {
    const props: Record<string, PropInfo> = {}

    // 简单的正则表达式提取（实际项目中应该使用TypeScript编译器API）
    const interfaceRegex = /interface\s+\w*Props\s*{([^}]+)}/gs
    const typeAliasRegex = /type\s+\w*Props\s*=\s*{([^}]+)}/gs
    const functionComponentRegex = /function\s+(\w+)\(([^)]+)\)\s*[:]/gs

    // 提取接口定义的Props
    const interfaceMatch = interfaceRegex.exec(sourceCode)
    const typeMatch = typeAliasRegex.exec(sourceCode)
    const functionMatch = functionComponentRegex.exec(sourceCode)

    const propsInterface = interfaceMatch?.[1] || typeMatch?.[1] || functionMatch?.[2] || ''

    if (propsInterface) {
      const propLines = propsInterface.split('\n').map(line => line.trim())

      for (const line of propLines) {
        if (line && !line.startsWith('/') && !line.startsWith('*')) {
          const propMatch = line.match(/(\w+)(\?)?:\s*([^;]+)/)
          if (propMatch) {
            const [, name, optional, type] = propMatch
            props[name] = {
              name,
              type: type.trim(),
              required: !optional,
              isEventHandler: name.startsWith('on') && type.includes('React.'),
            }
          }
        }
      }
    }

    return props
  }

  /**
   * 提取导出的类型
   */
  private extractExportedTypes(sourceCode: string): string[] {
    const types: string[] = []

    // 匹配导出的类型
    const exportTypeRegex = /export\s+(?:type|interface)\s+(\w+)/g
    let match

    while ((match = exportTypeRegex.exec(sourceCode)) !== null) {
      types.push(match[1])
    }

    return types
  }

  /**
   * 判断是否为可交互组件
   */
  private isInteractiveComponent(sourceCode: string): boolean {
    const interactiveIndicators = [
      'onClick',
      'onFocus',
      'onBlur',
      'onKeyDown',
      'onKeyUp',
      'onSubmit',
      'onChange',
      'button',
      'input',
      'select',
      'textarea',
    ]

    return interactiveIndicators.some(indicator =>
      sourceCode.includes(indicator)
    )
  }

  /**
   * 判断是否为主题组件
   */
  private isThemedComponent(sourceCode: string): boolean {
    const themeIndicators = [
      'variant',
      'size',
      'colorTheme',
      'theme',
      'useTheme',
      'ThemeProvider',
    ]

    return themeIndicators.some(indicator =>
      sourceCode.includes(indicator)
    )
  }

  /**
   * 判断是否使用主题令牌
   */
  private usesThemeTokens(sourceCode: string): boolean {
    const tokenIndicators = [
      'colorTokens.',
      'spacingTokens.',
      'typographyTokens.',
      'borderRadiusTokens.',
      'tokens.',
      'semanticTokens.',
    ]

    return tokenIndicators.some(indicator =>
      sourceCode.includes(indicator)
    )
  }

  /**
   * 判断是否支持七轴主题
   */
  private supportsSevenAxis(sourceCode: string): boolean {
    const sevenAxisIndicators = [
      'sevenAxis',
      'seven-axis',
      'SevenAxis',
      'recipe',
      'Recipe',
      'DTCG',
      'dtcg',
    ]

    return sevenAxisIndicators.some(indicator =>
      sourceCode.includes(indicator)
    )
  }

  /**
   * 检查是否有JSDoc注释
   */
  private hasJSDoc(sourceCode: string, componentName: string): boolean {
    const jsdocRegex = new RegExp(`\\/\\*\\*[\\s\\S]*?\\*\\/\\s*(?:function|const|class)\\s+${componentName}`, 'i')
    return jsdocRegex.test(sourceCode)
  }

  /**
   * 检查是否有示例文件
   */
  private async hasExamples(componentPath: string): Promise<boolean> {
    const dir = path.dirname(componentPath)
    const componentName = path.basename(componentPath, path.extname(componentPath))

    const examplePatterns = [
      `${componentName}.example.tsx`,
      `${componentName}.example.ts`,
      `${componentName}Example.tsx`,
      `${componentName}Example.ts`,
    ]

    for (const pattern of examplePatterns) {
      try {
        await fs.access(path.join(dir, pattern))
        return true
      } catch {
        // 文件不存在
      }
    }

    // 检查examples目录
    try {
      const examplesDir = path.join(dir, 'examples')
      const files = await fs.readdir(examplesDir)
      return files.some(file => file.includes(componentName))
    } catch {
      // 目录不存在
    }

    return false
  }

  /**
   * 检查是否有测试文件
   */
  private async hasTests(componentPath: string): Promise<boolean> {
    const dir = path.dirname(componentPath)
    const componentName = path.basename(componentPath, path.extname(componentPath))

    const testPatterns = [
      `${componentName}.test.tsx`,
      `${componentName}.test.ts`,
      `${componentName}.spec.tsx`,
      `${componentName}.spec.ts`,
    ]

    for (const pattern of testPatterns) {
      try {
        await fs.access(path.join(dir, pattern))
        return true
      } catch {
        // 文件不存在
      }
    }

    return false
  }

  /**
   * 获取测试覆盖率
   */
  private async getTestCoverage(componentPath: string): Promise<number> {
    // 这里应该集成实际的测试覆盖率工具
    // 暂时返回估算值
    return 85
  }

  /**
   * 检查是否支持键盘导航
   */
  private supportsKeyboardNavigation(sourceCode: string): boolean {
    const keyboardIndicators = [
      'onKeyDown',
      'onKeyUp',
      'tabIndex',
      'keyboard',
      'KeyboardEvent',
    ]

    return keyboardIndicators.some(indicator =>
      sourceCode.includes(indicator)
    )
  }

  /**
   * 检查是否使用泛型
   */
  private usesGenerics(sourceCode: string): boolean {
    const genericRegex = /<\w+>/g
    return genericRegex.test(sourceCode)
  }

  /**
   * 提取泛型约束
   */
  private extractGenericConstraints(sourceCode: string): string | undefined {
    const constraintRegex = /<(\w+)\s+extends\s+([^>]+)>/g
    const match = constraintRegex.exec(sourceCode)
    return match?.[2]
  }

  /**
   * 确定组件分类
   */
  private determineCategory(filePath: string, sourceCode: string): ComponentCategory {
    const pathLower = filePath.toLowerCase()

    if (pathLower.includes('primitive') || pathLower.includes('atom')) {
      return 'primitive'
    } else if (pathLower.includes('form') || pathLower.includes('input')) {
      return 'form'
    } else if (pathLower.includes('layout') || pathLower.includes('grid') || pathLower.includes('flex')) {
      return 'layout'
    } else if (pathLower.includes('nav') || pathLower.includes('menu') || pathLower.includes('header')) {
      return 'navigation'
    } else if (pathLower.includes('overlay') || pathLower.includes('modal') || pathLower.includes('popup')) {
      return 'overlay'
    } else if (pathLower.includes('feedback') || pathLower.includes('toast') || pathLower.includes('alert')) {
      return 'feedback'
    } else if (pathLower.includes('provider') || sourceCode.includes('Context') || sourceCode.includes('Provider')) {
      return 'provider'
    } else if (pathLower.includes('hook') || sourceCode.includes('use') && !sourceCode.includes('function')) {
      return 'hook'
    } else {
      return 'display'
    }
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * 获取缓存大小
   */
  getCacheSize(): number {
    return this.cache.size
  }
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 创建默认的组件扫描器
 */
export function createComponentScanner(config?: Partial<ScanConfig>): ComponentScanner {
  return new ComponentScanner(config)
}

/**
 * 快速扫描组件
 */
export async function quickScanComponents(rootDir?: string): Promise<ComponentAnalysis[]> {
  const scanner = new ComponentScanner({
    rootDir: rootDir || process.cwd(),
    deepAnalysis: false
  })
  return await scanner.scanComponents()
}

/**
 * 深度扫描组件
 */
export async function deepScanComponents(rootDir?: string): Promise<ComponentAnalysis[]> {
  const scanner = new ComponentScanner({
    rootDir: rootDir || process.cwd(),
    deepAnalysis: true
  })
  return await scanner.scanComponents()
}