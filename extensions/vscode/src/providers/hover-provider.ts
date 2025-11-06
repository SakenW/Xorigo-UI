/**
 * 悬停提示提供者
 *
 * 提供组件文档、示例代码和使用指南
 */

import * as vscode from 'vscode'
import { ComponentRegistry } from '../data/component-registry'

export class HoverProvider implements vscode.HoverProvider {
  private componentRegistry: ComponentRegistry
  private enabled: boolean = true

  constructor() {
    this.componentRegistry = new ComponentRegistry()
    this.refreshConfiguration()
  }

  async refreshConfiguration() {
    const config = vscode.workspace.getConfiguration('xorigoUi')
    this.enabled = config.get<boolean>('enableIntelliSense', true)
    await this.componentRegistry.loadComponents()
  }

  /**
   * 提供悬停提示
   */
  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | undefined> {
    if (!this.enabled) {
      return undefined
    }

    const wordRange = document.getWordRangeAtPosition(position)
    if (!wordRange) {
      return undefined
    }

    const word = document.getText(wordRange)

    // 查找匹配的组件
    const component = this.componentRegistry.getComponent(word)
    if (!component) {
      return undefined
    }

    // 创建 Markdown 内容
    const markdownContent = this.createHoverContent(component, document, position)

    return new vscode.Hover(markdownContent, wordRange)
  }

  /**
   * 创建悬停内容
   */
  private createHoverContent(
    component: any,
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.MarkdownString {
    const md = new vscode.MarkdownString()

    // 标题
    md.appendMarkdown(`# ${component.name}\n\n`)
    md.appendMarkdown(`*${component.description}*\n\n`)

    // 分类标签
    md.appendMarkdown(`**分类:** \`${component.category}\`\n\n`)

    // 变体信息
    md.appendMarkdown(`## 变体\n\n`)
    component.variants.forEach((variant: string) => {
      md.appendMarkdown(`- \`${variant}\`\n`)
    })
    md.appendMarkdown('\n')

    // 尺寸信息
    md.appendMarkdown(`## 尺寸\n\n`)
    component.sizes.forEach((size: string) => {
      md.appendMarkdown(`- \`${size}\`\n`)
    })
    md.appendMarkdown('\n')

    // 属性列表
    md.appendMarkdown(`## 属性\n\n`)
    component.props.forEach((prop: any) => {
      const required = prop.required ? ' 🔴' : ' ⚪️'
      const type = prop.type ? ` \`${prop.type}\`` : ''
      const defaultValue = prop.default ? ` (default: \`${prop.default}\`)` : ''
      md.appendMarkdown(`- **${prop.name}**${required}${type}${defaultValue}\n`)
    })
    md.appendMarkdown('\n')

    // 使用示例
    md.appendMarkdown(`## 使用示例\n\n`)
    md.appendCodeblock(component.usageExample, 'tsx')

    // 悬停提示限制
    md.supportHtml = true
    md.isTrusted = true

    return md
  }

  /**
   * 检测位置是否在组件标签内
   */
  private isInComponentTag(
    text: string,
    position: vscode.Position
  ): { tagName: string; inOpeningTag: boolean } | undefined {
    const lineText = document.lineAt(position.line).text

    // 查找 JSX 标签
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)/g
    let match

    while ((match = tagRegex.exec(lineText)) !== null) {
      const tagName = match[1]
      const matchStart = match.index
      const matchEnd = matchStart + match[0].length

      if (position.character >= matchStart && position.character <= matchEnd) {
        return {
          tagName,
          inOpeningTag: !lineText.substring(matchStart, matchEnd).startsWith('</')
        }
      }
    }

    return undefined
  }
}
