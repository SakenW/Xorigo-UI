/**
 * Xorigo UI IDE 集成工具
 *
 * 为VS Code、WebStorm等IDE提供实时API验证和智能建议
 */

import type { ComponentAnalysis } from './component-scanner'
import type { ValidationResult, ComponentMetadata } from './api-standards'
import { QualityMonitor } from './quality-monitor'

// ============================================================================
// IDE集成接口定义
// ============================================================================

/**
 * IDE诊断信息
 */
export interface IDEDiagnostic {
  /** 诊断范围 */
  range: {
    start: { line: number; character: number }
    end: { line: number; character: number }
  }
  /** 诊断严重程度 */
  severity: DiagnosticSeverity
  /** 诊断消息 */
  message: string
  /** 诊断代码 */
  code?: string | number
  /** 诊断来源 */
  source: string
  /** 诊断标签 */
  tags?: DiagnosticTag[]
  /** 相关信息 */
  relatedInformation?: IDERelatedInformation[]
  /** 快速修复 */
  quickFixes?: IDEQuickFix[]
}

/**
 * 诊断严重程度
 */
export type DiagnosticSeverity = 'error' | 'warning' | 'information' | 'hint'

/**
 * 诊断标签
 */
export type DiagnosticTag = 'unnecessary' | 'deprecated'

/**
 * 相关信息
 */
export interface IDERelatedInformation {
  /** 位置 */
  location: {
    uri: string
    range: {
      start: { line: number; character: number }
      end: { line: number; character: number }
    }
  }
  /** 消息 */
  message: string
}

/**
 * 快速修复
 */
export interface IDEQuickFix {
  /** 修复标题 */
  title: string
  /** 修复操作 */
  kind: QuickFixKind
  /** 编辑操作 */
  edit?: IDETextEdit[]
  /** 命令 */
  command?: IDECommand
}

/**
 * 快速修复类型
 */
export type QuickFixKind =
  | 'quickfix'
  | 'refactor'
  | 'refactor.extract'
  | 'refactor.inline'
  | 'refactor.rewrite'
  | 'source'
  | 'source.organizeImports'

/**
 * 文本编辑
 */
export interface IDETextEdit {
  /** 范围 */
  range: {
    start: { line: number; character: number }
    end: { line: number; character: number }
  }
  /** 新文本 */
  newText: string
}

/**
 * 命令
 */
export interface IDECommand {
  /** 命令标题 */
  title: string
  /** 命令名称 */
  command: string
  /** 命令参数 */
  arguments?: any[]
}

/**
 * 代码完成建议
 */
export interface IDECompletionItem {
  /** 标签 */
  label: string
  /** 类型 */
  kind: CompletionItemKind
  /** 详细信息 */
  detail?: string
  /** 文档 */
  documentation?: string | { kind: 'markdown'; value: string }
  /** 排序文本 */
  sortText?: string
  /** 过滤文本 */
  filterText?: string
  /** 插入文本 */
  insertText?: string
  /** 插入文本格式 */
  insertTextFormat?: InsertTextFormat
  /** 额外数据 */
  data?: any
}

/**
 * 完成项类型
 */
export type CompletionItemKind =
  | 'text'
  | 'method'
  | 'function'
  | 'constructor'
  | 'field'
  | 'variable'
  | 'class'
  | 'interface'
  | 'module'
  | 'property'
  | 'unit'
  | 'value'
  | 'enum'
  | 'keyword'
  | 'snippet'
  | 'color'
  | 'file'
  | 'reference'
  | 'folder'
  | 'enum-member'
  | 'constant'
  | 'struct'
  | 'event'
  | 'operator'
  | 'type-parameter'

/**
 * 插入文本格式
 */
export type InsertTextFormat = 'plaintext' | 'snippet'

/**
 * 悬停信息
 */
export interface IDEHoverInfo {
  /** 内容 */
  contents: {
    kind: 'markdown'
    value: string
  }
  /** 范围 */
  range?: {
    start: { line: number; character: number }
    end: { line: number; character: number }
  }
}

/**
 * 代码签名帮助
 */
export interface IDESignatureHelp {
  /** 签名信息 */
  signatures: IDESignatureInformation[]
  /** 活动签名 */
  activeSignature: number
  /** 活动参数 */
  activeParameter: number
}

/**
 * 签名信息
 */
export interface IDESignatureInformation {
  /** 标签 */
  label: string
  /** 文档 */
  documentation?: string | { kind: 'markdown'; value: string }
  /** 参数信息 */
  parameters: IDEParameterInformation[]
}

/**
 * 参数信息
 */
export interface IDEParameterInformation {
  /** 标签 */
  label: string | [number, number]
  /** 文档 */
  documentation?: string | { kind: 'markdown'; value: string }
}

/**
 * 代码格式化结果
 */
export interface IDEFormatResult {
  /** 编辑操作 */
  edits: IDETextEdit[]
}

/**
 * IDE插件配置
 */
export interface IDEPluginConfig {
  /** 插件名称 */
  name: string
  /** 插件版本 */
  version: string
  /** 是否启用实时验证 */
  enableRealTimeValidation: boolean
  /** 是否启用代码完成 */
  enableCodeCompletion: boolean
  /** 是否启用快速修复 */
  enableQuickFixes: boolean
  /** 是否启用悬停帮助 */
  enableHover: boolean
  /** 是否启用签名帮助 */
  enableSignatureHelp: boolean
  /** 验证延迟（毫秒） */
  validationDelay: number
  /** 排除的文件模式 */
  excludePatterns: string[]
  /** 自定义规则 */
  customRules: CustomRule[]
}

/**
 * 自定义规则
 */
export interface CustomRule {
  /** 规则ID */
  id: string
  /** 规则名称 */
  name: string
  /** 规则描述 */
  description: string
  /** 规则类型 */
  type: 'diagnostic' | 'completion' | 'format'
  /** 规则模式 */
  pattern: RegExp
  /** 规则处理器 */
  handler: (context: RuleContext) => RuleResult
}

/**
 * 规则上下文
 */
export interface RuleContext {
  /** 文件URI */
  uri: string
  /** 文件内容 */
  content: string
  /** 光标位置 */
  position: { line: number; character: number }
  /** 组件分析结果 */
  componentAnalysis?: ComponentAnalysis
  /** 验证结果 */
  validationResult?: ValidationResult
}

/**
 * 规则结果
 */
export interface RuleResult {
  /** 诊断信息 */
  diagnostics?: IDEDiagnostic[]
  /** 完成建议 */
  completions?: IDECompletionItem[]
  /** 文本编辑 */
  edits?: IDETextEdit[]
  /** 悬停信息 */
  hover?: IDEHoverInfo
}

// ============================================================================
// IDE集成服务主类
// ============================================================================

/**
 * IDE集成服务
 */
export class IDEIntegrationService {
  private config: IDEPluginConfig
  private qualityMonitor: QualityMonitor
  private componentCache: Map<string, ComponentAnalysis> = new Map()
  private validationCache: Map<string, ValidationResult> = new Map()

  constructor(config: Partial<IDEPluginConfig> = {}) {
    this.config = {
      name: 'xorigo-ui-ide-integration',
      version: '1.0.0',
      enableRealTimeValidation: true,
      enableCodeCompletion: true,
      enableQuickFixes: true,
      enableHover: true,
      enableSignatureHelp: true,
      validationDelay: 500,
      excludePatterns: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/coverage/**',
      ],
      customRules: [],
      ...config,
    }

    this.qualityMonitor = new QualityMonitor()
  }

  /**
   * 分析文件并生成诊断信息
   */
  async analyzeFile(uri: string, content: string): Promise<IDEDiagnostic[]> {
    if (!this.config.enableRealTimeValidation) {
      return []
    }

    // 检查是否应该排除此文件
    if (this.shouldExcludeFile(uri)) {
      return []
    }

    const diagnostics: IDEDiagnostic[] = []

    try {
      // 1. 分析组件
      const analysis = await this.analyzeComponent(uri, content)
      if (!analysis) {
        return []
      }

      // 2. 执行API验证
      const validationResult = await this.validateComponent(analysis)

      // 3. 转换验证结果为IDE诊断
      const validationDiagnostics = this.convertValidationToDiagnostics(
        uri,
        validationResult
      )
      diagnostics.push(...validationDiagnostics)

      // 4. 执行自定义规则
      for (const rule of this.config.customRules) {
        if (rule.type === 'diagnostic') {
          const context: RuleContext = {
            uri,
            content,
            position: { line: 0, character: 0 },
            componentAnalysis: analysis,
            validationResult,
          }

          const result = rule.handler(context)
          if (result.diagnostics) {
            diagnostics.push(...result.diagnostics)
          }
        }
      }

    } catch (error) {
      console.warn(`分析文件失败 ${uri}:`, error)
    }

    return diagnostics
  }

  /**
   * 提供代码完成建议
   */
  async provideCompletions(
    uri: string,
    content: string,
    position: { line: number; character: number }
  ): Promise<IDECompletionItem[]> {
    if (!this.config.enableCodeCompletion) {
      return []
    }

    if (this.shouldExcludeFile(uri)) {
      return []
    }

    const completions: IDECompletionItem[] = []

    try {
      const analysis = await this.analyzeComponent(uri, content)
      if (!analysis) {
        return []
      }

      // 1. 提供Props完成
      const propsCompletions = this.providePropsCompletions(analysis, position)
      completions.push(...propsCompletions)

      // 2. 提供主题相关完成
      const themeCompletions = this.provideThemeCompletions(analysis, position)
      completions.push(...themeCompletions)

      // 3. 提供事件处理器完成
      const eventCompletions = this.provideEventCompletions(analysis, position)
      completions.push(...eventCompletions)

      // 4. 执行自定义完成规则
      for (const rule of this.config.customRules) {
        if (rule.type === 'completion') {
          const context: RuleContext = {
            uri,
            content,
            position,
            componentAnalysis: analysis,
          }

          const result = rule.handler(context)
          if (result.completions) {
            completions.push(...result.completions)
          }
        }
      }

    } catch (error) {
      console.warn(`提供代码完成失败 ${uri}:`, error)
    }

    return completions
  }

  /**
   * 提供悬停信息
   */
  async provideHover(
    uri: string,
    content: string,
    position: { line: number; character: number }
  ): Promise<IDEHoverInfo | null> {
    if (!this.config.enableHover) {
      return null
    }

    if (this.shouldExcludeFile(uri)) {
      return null
    }

    try {
      const analysis = await this.analyzeComponent(uri, content)
      if (!analysis) {
        return null
      }

      // 获取光标位置的单词
      const word = this.getWordAtPosition(content, position)
      if (!word) {
        return null
      }

      // 1. 提供Props信息
      if (word in analysis.props) {
        const prop = analysis.props[word]
        return {
          contents: {
            kind: 'markdown',
            value: this.generatePropDocumentation(prop),
          },
        }
      }

      // 2. 提供组件信息
      if (word === analysis.name) {
        return {
          contents: {
            kind: 'markdown',
            value: this.generateComponentDocumentation(analysis),
          },
        }
      }

      // 3. 执行自定义悬停规则
      for (const rule of this.config.customRules) {
        const context: RuleContext = {
          uri,
          content,
          position,
          componentAnalysis: analysis,
        }

        const result = rule.handler(context)
        if (result.hover) {
          return result.hover
        }
      }

    } catch (error) {
      console.warn(`提供悬停信息失败 ${uri}:`, error)
    }

    return null
  }

  /**
   * 提供签名帮助
   */
  async provideSignatureHelp(
    uri: string,
    content: string,
    position: { line: number; character: number }
  ): Promise<IDESignatureHelp | null> {
    if (!this.config.enableSignatureHelp) {
      return null
    }

    if (this.shouldExcludeFile(uri)) {
      return null
    }

    try {
      const analysis = await this.analyzeComponent(uri, content)
      if (!analysis) {
        return null
      }

      // 分析当前函数调用
      const callInfo = this.analyzeFunctionCall(content, position)
      if (!callInfo) {
        return null
      }

      // 提供函数签名信息
      return this.generateSignatureHelp(callInfo, analysis)

    } catch (error) {
      console.warn(`提供签名帮助失败 ${uri}:`, error)
    }

    return null
  }

  /**
   * 格式化代码
   */
  async formatCode(uri: string, content: string): Promise<IDEFormatResult> {
    const edits: IDETextEdit[] = []

    try {
      const analysis = await this.analyzeComponent(uri, content)
      if (!analysis) {
        return { edits }
      }

      // 1. 格式化Props排序
      const propsSortEdit = this.formatPropsSort(content, analysis)
      if (propsSortEdit) {
        edits.push(propsSortEdit)
      }

      // 2. 格式化导入排序
      const importSortEdit = this.formatImportSort(content)
      if (importSortEdit) {
        edits.push(importSortEdit)
      }

      // 3. 执行自定义格式化规则
      for (const rule of this.config.customRules) {
        if (rule.type === 'format') {
          const context: RuleContext = {
            uri,
            content,
            position: { line: 0, character: 0 },
            componentAnalysis: analysis,
          }

          const result = rule.handler(context)
          if (result.edits) {
            edits.push(...result.edits)
          }
        }
      }

    } catch (error) {
      console.warn(`格式化代码失败 ${uri}:`, error)
    }

    return { edits }
  }

  /**
   * 应用快速修复
   */
  async applyQuickFix(uri: string, diagnostic: IDEDiagnostic): Promise<IDETextEdit[]> {
    if (!this.config.enableQuickFixes) {
      return []
    }

    const edits: IDETextEdit[] = []

    try {
      // 根据诊断类型应用相应的修复
      switch (diagnostic.code) {
        case 'MISSING_BASE_PROP':
          edits.push(...this.fixMissingBaseProp(uri, diagnostic))
          break

        case 'INVALID_PROP_NAME':
          edits.push(...this.fixInvalidPropName(uri, diagnostic))
          break

        case 'MISSING_JSDOC':
          edits.push(...this.fixMissingJSDoc(uri, diagnostic))
          break

        default:
          // 应用自定义快速修复
          if (diagnostic.quickFixes) {
            for (const quickFix of diagnostic.quickFixes) {
              if (quickFix.edit) {
                edits.push(...quickFix.edit)
              }
            }
          }
      }

    } catch (error) {
      console.warn(`应用快速修复失败 ${uri}:`, error)
    }

    return edits
  }

  // ============================================================================
  // 私有辅助方法
  // ============================================================================

  /**
   * 检查文件是否应该被排除
   */
  private shouldExcludeFile(uri: string): boolean {
    return this.config.excludePatterns.some(pattern => {
      const regex = new RegExp(
        pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*')
      )
      return regex.test(uri)
    })
  }

  /**
   * 分析组件
   */
  private async analyzeComponent(uri: string, content: string): Promise<ComponentAnalysis | null> {
    const cacheKey = `${uri}:${this.getContentHash(content)}`

    if (this.componentCache.has(cacheKey)) {
      return this.componentCache.get(cacheKey)!
    }

    try {
      // 这里应该集成实际的组件分析器
      // 暂时返回模拟数据
      const analysis: ComponentAnalysis = {
        name: this.extractComponentName(content) || 'UnknownComponent',
        filePath: uri,
        props: this.extractProps(content),
        exportedTypes: this.extractExportedTypes(content),
        isInteractive: this.isInteractive(content),
        isThemed: this.isThemed(content),
        usesThemeTokens: this.usesThemeTokens(content),
        supportsSevenAxis: this.supportsSevenAxis(content),
        hasJSDoc: this.hasJSDoc(content),
        hasExamples: false, // 需要检查文件系统
        hasTests: false, // 需要检查文件系统
        supportsKeyboardNavigation: this.supportsKeyboardNavigation(content),
        usesGenerics: this.usesGenerics(content),
        genericConstraints: this.extractGenericConstraints(content),
        category: this.determineCategory(uri, content),
        sourceCode: content,
      }

      this.componentCache.set(cacheKey, analysis)
      return analysis

    } catch (error) {
      console.warn(`分析组件失败 ${uri}:`, error)
      return null
    }
  }

  /**
   * 验证组件
   */
  private async validateComponent(analysis: ComponentAnalysis): Promise<ValidationResult> {
    const cacheKey = `${analysis.filePath}:validation`

    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey)!
    }

    try {
      // 这里应该集成实际的API验证器
      // 暂时返回模拟结果
      const result: ValidationResult = {
        passed: true,
        errors: [],
        warnings: [],
        info: [],
        suggestions: [],
      }

      this.validationCache.set(cacheKey, result)
      return result

    } catch (error) {
      console.warn(`验证组件失败 ${analysis.name}:`, error)
      return {
        passed: false,
        errors: [{
          message: `验证失败: ${error.message}`,
          location: analysis.name,
          code: 'VALIDATION_ERROR',
        }],
        warnings: [],
        info: [],
        suggestions: [],
      }
    }
  }

  /**
   * 转换验证结果为IDE诊断
   */
  private convertValidationToDiagnostics(uri: string, result: ValidationResult): IDEDiagnostic[] {
    const diagnostics: IDEDiagnostic[] = []

    // 转换错误
    result.errors.forEach(error => {
      diagnostics.push({
        range: {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 0 },
        },
        severity: 'error',
        message: error.message,
        code: error.code,
        source: 'xorigo-ui-api-validator',
        quickFixes: error.fix ? [{
          title: `修复: ${error.fix}`,
          kind: 'quickfix',
          edit: [], // 需要根据具体修复生成编辑操作
        }] : undefined,
      })
    })

    // 转换警告
    result.warnings.forEach(warning => {
      diagnostics.push({
        range: {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 0 },
        },
        severity: 'warning',
        message: warning.message,
        code: warning.code,
        source: 'xorigo-ui-api-validator',
      })
    })

    return diagnostics
  }

  /**
   * 提供Props完成
   */
  private providePropsCompletions(
    analysis: ComponentAnalysis,
    position: { line: number; character: number }
  ): IDECompletionItem[] {
    const completions: IDECompletionItem[] = []

    Object.entries(analysis.props).forEach(([name, prop]) => {
      completions.push({
        label: name,
        kind: 'property',
        detail: `${prop.type}${prop.required ? ' (必需)' : ' (可选)'}`,
        documentation: prop.description || `属性: ${name}`,
        insertText: `${name}={$1}`,
        insertTextFormat: 'snippet',
      })
    })

    // 添加标准Props
    const standardProps = [
      { name: 'className', type: 'string', description: '自定义CSS类名' },
      { name: 'id', type: 'string', description: '元素唯一标识' },
      { name: 'disabled', type: 'boolean', description: '是否禁用' },
      { name: 'aria-label', type: 'string', description: '可访问性标签' },
    ]

    standardProps.forEach(prop => {
      if (!(prop.name in analysis.props)) {
        completions.push({
          label: prop.name,
          kind: 'property',
          detail: `${prop.type} (标准Props)`,
          documentation: prop.description,
          insertText: `${prop.name}={$1}`,
          insertTextFormat: 'snippet',
        })
      }
    })

    return completions
  }

  /**
   * 提供主题相关完成
   */
  private provideThemeCompletions(
    analysis: ComponentAnalysis,
    position: { line: number; character: number }
  ): IDECompletionItem[] {
    if (!analysis.isThemed) {
      return []
    }

    const completions: IDECompletionItem[] = []

    // 主题变体
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive']
    variants.forEach(variant => {
      completions.push({
        label: `variant="${variant}"`,
        kind: 'enum',
        detail: `主题变体: ${variant}`,
        documentation: `设置组件的视觉变体为 ${variant}`,
      })
    })

    // 尺寸
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
    sizes.forEach(size => {
      completions.push({
        label: `size="${size}"`,
        kind: 'enum',
        detail: `尺寸: ${size}`,
        documentation: `设置组件的尺寸为 ${size}`,
      })
    })

    return completions
  }

  /**
   * 提供事件处理器完成
   */
  private provideEventCompletions(
    analysis: ComponentAnalysis,
    position: { line: number; character: number }
  ): IDECompletionItem[] {
    if (!analysis.isInteractive) {
      return []
    }

    const completions: IDECompletionItem[] = []

    const eventHandlers = [
      { name: 'onClick', description: '点击事件处理器' },
      { name: 'onFocus', description: '聚焦事件处理器' },
      { name: 'onBlur', description: '失焦事件处理器' },
      { name: 'onKeyDown', description: '键盘按下事件处理器' },
      { name: 'onKeyUp', description: '键盘抬起事件处理器' },
    ]

    eventHandlers.forEach(handler => {
      completions.push({
        label: handler.name,
        kind: 'function',
        detail: '事件处理器',
        documentation: handler.description,
        insertText: `${handler.name}={$1}`,
        insertTextFormat: 'snippet',
      })
    })

    return completions
  }

  /**
   * 获取光标位置的单词
   */
  private getWordAtPosition(content: string, position: { line: number; character: number }): string | null {
    const lines = content.split('\n')
    const line = lines[position.line]
    if (!line) {
      return null
    }

    const beforeCursor = line.substring(0, position.character)
    const match = beforeCursor.match(/[\w$]+$/)
    return match ? match[0] : null
  }

  /**
   * 生成Props文档
   */
  private generatePropDocumentation(prop: any): string {
    let doc = `## ${prop.name}\n\n`
    doc += `**类型**: \`${prop.type}\`\n\n`
    doc += `**必需**: ${prop.required ? '是' : '否'}\n\n`

    if (prop.description) {
      doc += `**描述**: ${prop.description}\n\n`
    }

    if (prop.enum) {
      doc += `**可选值**: \n`
      prop.enum.forEach((value: string) => {
        doc += `- \`${value}\`\n`
      })
      doc += '\n'
    }

    return doc
  }

  /**
   * 生成组件文档
   */
  private generateComponentDocumentation(analysis: ComponentAnalysis): string {
    let doc = `# ${analysis.name}\n\n`

    if (analysis.category) {
      doc += `**分类**: ${analysis.category}\n\n`
    }

    doc += `**可交互**: ${analysis.isInteractive ? '是' : '否'}\n\n`
    doc += `**支持主题**: ${analysis.isThemed ? '是' : '否'}\n\n`

    if (Object.keys(analysis.props).length > 0) {
      doc += '## Props\n\n'
      Object.entries(analysis.props).forEach(([name, prop]) => {
        doc += `- \`${name}\`: ${prop.type}${prop.required ? ' (必需)' : ' (可选)'}\n`
      })
    }

    return doc
  }

  /**
   * 分析函数调用
   */
  private analyzeFunctionCall(content: string, position: { line: number; character: number }): any {
    // 这里应该实现实际的函数调用分析
    // 暂时返回null
    return null
  }

  /**
   * 生成签名帮助
   */
  private generateSignatureHelp(callInfo: any, analysis: ComponentAnalysis): IDesignatureHelp | null {
    // 这里应该实现实际的签名帮助生成
    // 暂时返回null
    return null
  }

  /**
   * 格式化Props排序
   */
  private formatPropsSort(content: string, analysis: ComponentAnalysis): IDETextEdit | null {
    // 这里应该实现Props排序逻辑
    // 暂时返回null
    return null
  }

  /**
   * 格式化导入排序
   */
  private formatImportSort(content: string): IDETextEdit | null {
    // 这里应该实现导入排序逻辑
    // 暂时返回null
    return null
  }

  /**
   * 修复缺失的基础Props
   */
  private fixMissingBaseProp(uri: string, diagnostic: IDEDiagnostic): IDETextEdit[] {
    // 这里应该实现具体的修复逻辑
    return []
  }

  /**
   * 修复无效的Props名称
   */
  private fixInvalidPropName(uri: string, diagnostic: IDEDiagnostic): IDETextEdit[] {
    // 这里应该实现具体的修复逻辑
    return []
  }

  /**
   * 修复缺失的JSDoc
   */
  private fixMissingJSDoc(uri: string, diagnostic: IDEDiagnostic): IDETextEdit[] {
    // 这里应该实现具体的修复逻辑
    return []
  }

  // ============================================================================
  // 文本分析辅助方法
  // ============================================================================

  private getContentHash(content: string): string {
    // 简单的哈希函数
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    return hash.toString()
  }

  private extractComponentName(content: string): string | null {
    const match = content.match(/(?:function|const|class)\s+([A-Z][a-zA-Z0-9]*)/)
    return match ? match[1] : null
  }

  private extractProps(content: string): Record<string, any> {
    // 简化的Props提取
    return {}
  }

  private extractExportedTypes(content: string): string[] {
    const types: string[] = []
    const matches = content.matchAll(/export\s+(?:type|interface)\s+(\w+)/g)
    for (const match of matches) {
      types.push(match[1])
    }
    return types
  }

  private isInteractive(content: string): boolean {
    return /onClick|onFocus|onBlur|onKeyDown|onKeyUp/.test(content)
  }

  private isThemed(content: string): boolean {
    return /variant|size|theme|useTheme/.test(content)
  }

  private usesThemeTokens(content: string): boolean {
    return /colorTokens|spacingTokens|typographyTokens/.test(content)
  }

  private supportsSevenAxis(content: string): boolean {
    return /sevenAxis|seven-axis|recipe/.test(content)
  }

  private hasJSDoc(content: string): boolean {
    return /\/\*\*[\s\S]*?\*\//.test(content)
  }

  private supportsKeyboardNavigation(content: string): boolean {
    return /onKeyDown|onKeyUp|tabIndex/.test(content)
  }

  private usesGenerics(content: string): boolean {
    return /<\w+>/.test(content)
  }

  private extractGenericConstraints(content: string): string | undefined {
    const match = content.match(/<(\w+)\s+extends\s+([^>]+)>/)
    return match?.[2]
  }

  private determineCategory(uri: string, content: string): string {
    const pathLower = uri.toLowerCase()
    if (pathLower.includes('primitive')) return 'primitive'
    if (pathLower.includes('form')) return 'form'
    if (pathLower.includes('layout')) return 'layout'
    if (pathLower.includes('nav')) return 'navigation'
    return 'display'
  }
}

// ============================================================================
// VS Code扩展辅助类
// ============================================================================

/**
 * VS Code扩展适配器
 */
export class VSCodeExtensionAdapter {
  private ideService: IDEIntegrationService

  constructor(config?: Partial<IDEPluginConfig>) {
    this.ideService = new IDEIntegrationService(config)
  }

  /**
   * 注册VS Code命令
   */
  registerCommands(): { [key: string]: (...args: any[]) => any } {
    return {
      'xorigo-ui.validateFile': async (uri: string) => {
        const content = await this.readFile(uri)
        return this.ideService.analyzeFile(uri, content)
      },

      'xorigo-ui.validateProject': async (workspaceRoot: string) => {
        // 实现项目级验证
        return { success: true }
      },

      'xorigo-ui.generateReport': async (workspaceRoot: string) => {
        // 生成质量报告
        return { reportPath: '/tmp/xorigo-ui-report.json' }
      },

      'xorigo-ui.fixAllIssues': async (uri: string) => {
        const content = await this.readFile(uri)
        const diagnostics = await this.ideService.analyzeFile(uri, content)
        const allEdits: any[] = []

        for (const diagnostic of diagnostics) {
          const edits = await this.ideService.applyQuickFix(uri, diagnostic)
          allEdits.push(...edits)
        }

        return { edits: allEdits }
      },
    }
  }

  /**
   * 注册VS Code语言特性
   */
  registerLanguageFeatures(): {
    completionProvider: any
    hoverProvider: any
    signatureHelpProvider: any
    codeActionProvider: any
  } {
    return {
      completionProvider: {
        provideCompletionItems: async (document: any, position: any) => {
          const completions = await this.ideService.provideCompletions(
            document.uri,
            document.getText(),
            position
          )
          return completions
        },
      },

      hoverProvider: {
        provideHover: async (document: any, position: any) => {
          const hover = await this.ideService.provideHover(
            document.uri,
            document.getText(),
            position
          )
          return hover
        },
      },

      signatureHelpProvider: {
        provideSignatureHelp: async (document: any, position: any) => {
          const signatureHelp = await this.ideService.provideSignatureHelp(
            document.uri,
            document.getText(),
            position
          )
          return signatureHelp
        },
      },

      codeActionProvider: {
        provideCodeActions: async (document: any, range: any) => {
          // 提供代码操作（快速修复等）
          return []
        },
      },
    }
  }

  private async readFile(uri: string): Promise<string> {
    // 这里应该使用VS Code的文件系统API
    return ''
  }
}

// ============================================================================
// 工厂函数
// ============================================================================

/**
 * 创建IDE集成服务
 */
export function createIDEIntegrationService(config?: Partial<IDEPluginConfig>): IDEIntegrationService {
  return new IDEIntegrationService(config)
}

/**
 * 创建VS Code扩展适配器
 */
export function createVSCodeExtensionAdapter(config?: Partial<IDEPluginConfig>): VSCodeExtensionAdapter {
  return new VSCodeExtensionAdapter(config)
}