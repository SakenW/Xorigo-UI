/**
 * 组件元数据提取引擎
 * 从TypeScript AST和源码中深度提取组件信息
 */

import * as ts from 'typescript'
import { ComponentMetadata, ComponentProp, ComponentExample } from './ComponentRegistry'

// ============================================================================
// 类型定义
// ============================================================================

export interface ExtractionOptions {
  includeJSDoc?: boolean
  includeExamples?: boolean
  includeDependencies?: boolean
  extractAccessibility?: boolean
  extractThemes?: boolean
  includeUsageStats?: boolean
}

export interface ExtractedDependency {
  name: string
  version?: string
  isLocal?: boolean
  isPeer?: boolean
}

export interface AccessibilityInfo {
  ariaRole?: string
  ariaAttributes?: string[]
  keyboardHandlers?: string[]
  focusable?: boolean
  tabIndex?: number
}

export interface ThemeSupport {
  variants?: string[]
  sizes?: string[]
  colors?: string[]
  customProperties?: string[]
}

// ============================================================================
// 元数据提取引擎类
// ============================================================================

export class MetadataExtractor {
  private options: ExtractionOptions
  private typeChecker: ts.TypeChecker | null = null

  constructor(options: ExtractionOptions = {}) {
    this.options = {
      includeJSDoc: true,
      includeExamples: true,
      includeDependencies: true,
      extractAccessibility: true,
      extractThemes: true,
      includeUsageStats: false,
      ...options
    }
  }

  /**
   * 提取完整元数据
   */
  extract(sourceFile: ts.SourceFile, filePath: string): ComponentMetadata | null {
    const program = ts.createProgram([filePath], {
      target: ts.ScriptTarget.Latest,
      module: ts.ModuleKind.ESNext
    })

    this.typeChecker = program.getTypeChecker()

    try {
      // 查找导出的组件
      const componentNodes = this.findComponentNodes(sourceFile)
      if (componentNodes.length === 0) {
        return null
      }

      // 选择主要组件（通常是默认导出或最后一个导出的组件）
      const mainComponent = componentNodes[componentNodes.length - 1]
      const componentName = this.getComponentName(mainComponent)

      return {
        id: this.generateId(componentName, filePath),
        name: componentName,
        displayName: componentName,
        description: this.extractDescription(sourceFile),
        category: this.determineCategory(filePath),
        tags: this.extractTags(sourceFile),
        version: this.extractVersion(sourceFile),
        props: this.extractProps(mainComponent, sourceFile),
        examples: this.extractExamples(sourceFile),
        source: sourceFile.getFullText(),
        filePath
      }
    } catch (error) {
      console.warn(`元数据提取失败 ${filePath}:`, error)
      return null
    }
  }

  /**
   * 查找组件节点
   */
  private findComponentNodes(sourceFile: ts.SourceFile): ts.Node[] {
    const components: ts.Node[] = []

    const visit = (node: ts.Node) => {
      if (this.isComponentLike(node)) {
        components.push(node)
      }

      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return components
  }

  /**
   * 检查是否为组件类节点
   */
  private isComponentLike(node: ts.Node): boolean {
    if (ts.isFunctionDeclaration(node)) {
      return this.isLikelyComponent(node.name?.getText() || '')
    }

    if (ts.isClassDeclaration(node)) {
      const heritage = node.heritageClauses || []
      return heritage.some(clause => {
        const types = clause.types.map(t => t.expression.getText())
        return types.some(type => type.includes('React') || type.includes('Component'))
      })
    }

    if (ts.isVariableStatement(node)) {
      return node.declarationList.declarations.some(decl => {
        if (ts.isVariableDeclaration(decl) && decl.initializer) {
          const text = decl.initializer.getText()
          return text.includes('React.forwardRef') ||
                 text.includes('() =>') ||
                 text.includes('function')
        }
        return false
      })
    }

    return false
  }

  /**
   * 检查名称是否像组件
   */
  private isLikelyComponent(name: string): boolean {
    return /^[A-Z]/.test(name) && !name.match(/^(use[A-Z]|on[A-Z]|handle[A-Z])/)
  }

  /**
   * 获取组件名称
   */
  private getComponentName(node: ts.Node): string {
    if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
      return node.name?.getText() || 'UnknownComponent'
    }

    if (ts.isVariableStatement(node)) {
      const decl = node.declarationList.declarations[0]
      if (ts.isVariableDeclaration(decl)) {
        return decl.name.getText()
      }
    }

    return 'UnknownComponent'
  }

  /**
   * 提取描述
   */
  private extractDescription(sourceFile: ts.SourceFile): string {
    if (!this.options.includeJSDoc) return '暂无描述'

    // 查找文件开头的JSDoc注释
    const firstChild = sourceFile.getChildAt(0)
    if (ts.isJSDocCommentContainingNode(firstChild) && firstChild.comment) {
      return firstChild.comment.replace(/^\/\*\*\s*/, '').replace(/\s*\*\/$/, '').trim()
    }

    return '暂无描述'
  }

  /**
   * 确定分类
   */
  private determineCategory(filePath: string): string {
    const segments = filePath.split(/[\\/]/)

    for (const segment of segments) {
      const categoryMap: Record<string, string> = {
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

      if (categoryMap[segment]) {
        return categoryMap[segment]
      }
    }

    return 'uncategorized'
  }

  /**
   * 提取标签
   */
  private extractTags(sourceFile: ts.SourceFile): string[] {
    const tags = new Set<string>()
    const text = sourceFile.getFullText()

    // 自动检测标签
    if (text.includes('forwardRef')) tags.add('forward-ref')
    if (text.includes('memo')) tags.add('memo')
    if (text.match(/\buse[A-Z]/)) tags.add('hooks')
    if (text.match(/\baria-/)) tags.add('accessible')
    if (text.includes('motion.')) tags.add('animated')

    // 从注释提取标签
    const jsdocTags = text.match(/@tags?\s+([^\n]+)/g)
    if (jsdocTags) {
      jsdocTags.forEach(tag => {
        const match = tag.match(/@tags?\s+([^\n]+)/)
        if (match) {
          match[1].split(',').map(t => t.trim()).forEach(t => tags.add(t))
        }
      })
    }

    // 从分类推断标签
    const category = this.determineCategory(sourceFile.fileName)
    tags.add(category)

    return Array.from(tags)
  }

  /**
   * 提取版本
   */
  private extractVersion(sourceFile: ts.SourceFile): string {
    if (!this.options.includeJSDoc) return '1.0.0'

    const text = sourceFile.getFullText()
    const versionMatch = text.match(/@version\s+([^\s\n]+)/)
    return versionMatch ? versionMatch[1] : '1.0.0'
  }

  /**
   * 提取属性
   */
  private extractProps(componentNode: ts.Node, sourceFile: ts.SourceFile): ComponentProp[] {
    const props: ComponentProp[] = []

    // 查找Props接口
    const propsInterface = this.findPropsInterface(componentNode, sourceFile)
    if (propsInterface) {
      props.push(...this.parseInterface(propsInterface))
    }

    // 从函数参数提取
    const functionParams = this.getFunctionParams(componentNode)
    functionParams.forEach(param => {
      if (!props.find(p => p.name === param.name)) {
        props.push(param)
      }
    })

    return props
  }

  /**
   * 查找Props接口
   */
  private findPropsInterface(componentNode: ts.Node, sourceFile: ts.SourceFile): ts.InterfaceDeclaration | null {
    const componentName = this.getComponentName(componentNode)
    const propsNames = [`${componentName}Props`, 'Props', 'P']

    let result: ts.InterfaceDeclaration | null = null

    const visit = (node: ts.Node) => {
      if (ts.isInterfaceDeclaration(node)) {
        if (propsNames.includes(node.name.getText())) {
          result = node
        }
      }
      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return result
  }

  /**
   * 解析接口为属性数组
   */
  private parseInterface(interfaceNode: ts.InterfaceDeclaration): ComponentProp[] {
    return interfaceNode.members
      .filter(ts.isPropertySignature)
      .map(member => {
        const name = member.name.getText()
        const type = member.type ? this.typeToString(member.type) : 'any'
        const required = !member.questionToken
        const description = this.extractJSDocComment(member)

        return {
          name,
          type,
          required,
          description
        }
      })
  }

  /**
   * 获取函数参数
   */
  private getFunctionParams(node: ts.Node): ComponentProp[] {
    if (ts.isFunctionDeclaration(node) && node.parameters.length > 0) {
      return node.parameters.map(param => ({
        name: param.name.getText(),
        type: param.type ? this.typeToString(param.type) : 'any',
        required: !param.questionToken
      }))
    }

    if (ts.isVariableStatement(node)) {
      const decl = node.declarationList.declarations[0]
      if (ts.isVariableDeclaration(decl) && decl.initializer) {
        if (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer)) {
          return decl.initializer.parameters.map(param => ({
            name: param.name.getText(),
            type: param.type ? this.typeToString(param.type) : 'any',
            required: !param.questionToken
          }))
        }
      }
    }

    return []
  }

  /**
   * 类型转字符串
   */
  private typeToString(type: ts.TypeNode): string {
    if (ts.isKeywordTypeNode(type)) {
      return type.getText()
    }

    if (ts.isTypeReferenceNode(type)) {
      return type.typeName.getText()
    }

    if (ts.isUnionTypeNode(type) || ts.isIntersectionTypeNode(type)) {
      return type.types.map(t => this.typeToString(t)).join(type.kind === ts.SyntaxKind.UnionType ? ' | ' : ' & ')
    }

    if (ts.isArrayTypeNode(type)) {
      return `${this.typeToString(type.elementType)}[]`
    }

    return type.getText()
  }

  /**
   * 提取JSDoc注释
   */
  private extractJSDocComment(node: ts.Node): string | undefined {
    if (!this.options.includeJSDoc) return undefined

    // 简化实现：查找节点前的注释
    const fullText = node.getFullText()
    const commentMatch = fullText.match(/\/\*\*\s*\n\s*\*\s+([^*]+)/)
    return commentMatch ? commentMatch[1].trim() : undefined
  }

  /**
   * 提取示例
   */
  private extractExamples(sourceFile: ts.SourceFile): ComponentExample[] {
    if (!this.options.includeExamples) return []

    const examples: ComponentExample[] = []
    const text = sourceFile.getFullText()

    // 提取代码块
    const codeBlockRegex = /```(?:tsx|jsx|ts|js)?\n([\s\S]*?)```/g
    let match
    while ((match = codeBlockRegex.exec(text)) !== null) {
      const code = match[1].trim()
      if (code.includes('<') && code.includes('>')) {
        examples.push({
          id: `example-${examples.length + 1}`,
          name: `示例 ${examples.length + 1}`,
          code,
          description: '从源码提取的示例'
        })
      }
    }

    return examples
  }

  /**
   * 生成ID
   */
  private generateId(name: string, filePath: string): string {
    return name
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
  }
}

export default MetadataExtractor
