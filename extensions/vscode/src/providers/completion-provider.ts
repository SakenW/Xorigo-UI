/**
 * 智能代码补全提供者
 *
 * 提供组件名称、属性、变体等智能补全
 */

import * as vscode from 'vscode'
import { ComponentRegistry } from '../data/component-registry'

export class CompletionProvider implements vscode.CompletionItemProvider {
  private componentRegistry: ComponentRegistry
  private enabled: boolean = true

  constructor() {
    this.componentRegistry = new ComponentRegistry()
    this.refreshConfiguration()
  }

  async refreshConfiguration() {
    const config = vscode.workspace.getConfiguration('xorigoUi')
    this.enabled = config.get<boolean>('enableSnippets', true)
    await this.componentRegistry.loadComponents()
  }

  /**
   * 提供代码补全
   */
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[] | undefined> {
    if (!this.enabled) {
      return undefined
    }

    const lineText = document.lineAt(position).text
    const linePrefix = lineText.substring(0, position.character)
    const lineSuffix = lineText.substring(position.character)

    // 检测是否在 JSX/TSX 标签内部
    const isInJSX = this.isInJSXContext(lineText, position)

    // 检测是否在 import 语句中
    if (linePrefix.match(/import\s+.*\s+from\s+/)) {
      return this.getImportCompletionItems()
    }

    // 检测是否在属性值中
    if (this.isInAttributeValue(lineText, position)) {
      return this.getAttributeValueCompletions(linePrefix)
    }

    // 检测是否在组件名中
    if (isInJSX) {
      return this.getComponentCompletions(document, position)
    }

    return undefined
  }

  /**
   * 检测是否在 JSX 标签上下文
   */
  private isInJSXContext(line: string, position: vscode.Position): boolean {
    const linePrefix = line.substring(0, position.character)

    // 检测是否在组件标签内
    if (linePrefix.match(/<\w+$/) || linePrefix.match(/<\w+\s+$/)) {
      return true
    }

    // 检测是否在属性名中
    if (linePrefix.match(/<\w+\s+\w*$/)) {
      return true
    }

    // 检测 JSX 文本内容
    if (linePrefix.match(/<\w+[^>]*>$/)) {
      return true
    }

    return false
  }

  /**
   * 检测是否在属性值中
   */
  private isInAttributeValue(line: string, position: vscode.Position): boolean {
    const linePrefix = line.substring(0, position.character)
    const lineSuffix = line.substring(position.character)

    // 检测是否在引号内
    const inSingleQuote = linePrefix.endsWith("'") && !linePrefix.endsWith("\'")
    const inDoubleQuote = linePrefix.endsWith('"') && !linePrefix.endsWith('\"')

    return inSingleQuote || inDoubleQuote
  }

  /**
   * 获取导入语句补全
   */
  private getImportCompletionItems(): vscode.CompletionItem[] {
    const components = this.componentRegistry.getAllComponents()
    const items: vscode.CompletionItem[] = []

    components.forEach((component) => {
      const item = new vscode.CompletionItem(
        `{ ${component.name} }`,
        vscode.CompletionItemKind.Struct
      )
      item.detail = component.category
      item.documentation = component.description
      item.insertText = `{ ${component.name} }`
      items.push(item)
    })

    return items
  }

  /**
   * 获取属性值补全
   */
  private getAttributeValueCompletions(linePrefix: string): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = []

    // 变体值补全
    if (linePrefix.match(/variant=/)) {
      const variants = ['primary', 'secondary', 'outline', 'ghost', 'subtle']
      variants.forEach((variant) => {
        const item = new vscode.CompletionItem(
          variant,
          vscode.CompletionItemKind.EnumMember
        )
        item.insertText = `'${variant}'`
        items.push(item)
      })
    }

    // 尺寸值补全
    if (linePrefix.match(/size=/)) {
      const sizes = ['sm', 'md', 'lg']
      sizes.forEach((size) => {
        const item = new vscode.CompletionItem(
          size,
          vscode.CompletionItemKind.EnumMember
        )
        item.insertText = `'${size}'`
        items.push(item)
      })
    }

    // 状态值补全
    if (linePrefix.match(/status=/)) {
      const statuses = ['default', 'error', 'warning', 'success', 'info']
      statuses.forEach((status) => {
        const item = new vscode.CompletionItem(
          status,
          vscode.CompletionItemKind.EnumMember
        )
        item.insertText = `'${status}'`
        items.push(item)
      })
    }

    return items
  }

  /**
   * 获取组件补全
   */
  private getComponentCompletions(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.CompletionItem[] {
    const components = this.componentRegistry.getAllComponents()
    const items: vscode.CompletionItem[] = []

    components.forEach((component) => {
      const item = new vscode.CompletionItem(
        component.name,
        vscode.CompletionItemKind.Class
      )

      // 详细信息
      item.detail = `${component.name} - ${component.category}`
      item.documentation = new vscode.MarkdownString(
        `**${component.name}**\n\n${component.description}\n\n` +
        `**分类:** ${component.category}\n\n` +
        `**变体:** ${component.variants.join(', ')}\n\n` +
        `**尺寸:** ${component.sizes.join(', ')}\n\n` +
        `---\n\n` +
        `**使用示例:**\n` +
        '```tsx\n' +
        `${component.usageExample}\n` +
        '```\n'
      )

      // 自动导入
      const config = vscode.workspace.getConfiguration('xorigoUi')
      if (config.get<boolean>('autoImport', true)) {
        item.additionalTextEdits = [
          vscode.TextEdit.insert(
            document.positionAt(0),
            `import { ${component.name} } from '@xorigo-ui/core'\n\n`
          )
        ]
      }

      // 插入文本（带属性）
      item.insertText = new vscode.SnippetString(
        `${component.name}>\n\t$0\n</${component.name}>`
      )

      // 排序权重
      item.sortText = `0${component.name}`

      items.push(item)
    })

    return items
  }

  /**
   * 插入组件
   */
  async insertComponent(componentName: string): Promise<void> {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }

    const component = this.componentRegistry.getComponent(componentName)
    if (!component) {
      vscode.window.showErrorMessage(`组件 "${componentName}" 未找到`)
      return
    }

    const snippet = new vscode.SnippetString(
      `<${component.name}>\n\t${component.insertionSnippet}\n</${component.name}>`
    )

    editor.insertSnippet(snippet)
  }
}
