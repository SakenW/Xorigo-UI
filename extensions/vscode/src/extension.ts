/**
 * Xorigo UI VS Code Extension - 主扩展文件
 *
 * 提供智能代码补全、悬停提示和主题预览功能
 *
 * @version 1.0.0
 * @author Xorigo UI Team
 */

import * as vscode from 'vscode'
import { CompletionProvider } from './providers/completion-provider'
import { HoverProvider } from './providers/hover-provider'
import { ThemePreviewProvider } from './providers/theme-preview-provider'
import { ComponentDataProvider } from './providers/component-data-provider'

let completionProvider: CompletionProvider
let hoverProvider: HoverProvider
let themePreviewProvider: ThemePreviewProvider
let componentDataProvider: ComponentDataProvider

/**
 * 扩展激活时的处理函数
 * @param context 扩展上下文
 */
export async function activate(context: vscode.ExtensionContext) {
  console.log('Xorigo UI 扩展已激活')

  // 创建提供者实例
  completionProvider = new CompletionProvider()
  hoverProvider = new HoverProvider()
  themePreviewProvider = new ThemePreviewProvider()
  componentDataProvider = new ComponentDataProvider()

  // 注册代码补全提供者
  const completionDisposable = vscode.languages.registerCompletionItemProvider(
    [
      { language: 'typescript', scheme: 'file' },
      { language: 'typescriptreact', scheme: 'file' },
      { language: 'javascript', scheme: 'file' },
      { language: 'javascriptreact', scheme: 'file' }
    ],
    completionProvider,
    ...['<', '.', ' ', '\n', '\t']
  )

  // 注册悬停提示提供者
  const hoverDisposable = vscode.languages.registerHoverProvider(
    [
      { language: 'typescript', scheme: 'file' },
      { language: 'typescriptreact', scheme: 'file' },
      { language: 'javascript', scheme: 'file' },
      { language: 'javascriptreact', scheme: 'file' }
    ],
    hoverProvider
  )

  // 注册组件数据视图
  const componentTreeDataProvider = componentDataProvider
  const componentView = vscode.window.createTreeView('xorigoUiComponents', {
    treeDataProvider: componentTreeDataProvider
  })

  // 注册命令
  const switchThemeCommand = vscode.commands.registerCommand(
    'xorigoUi.switchTheme',
    async () => {
      await themePreviewProvider.showThemePicker()
    }
  )

  const insertComponentCommand = vscode.commands.registerCommand(
    'xorigoUi.insertComponent',
    async (componentName: string) => {
      await completionProvider.insertComponent(componentName)
    }
  )

  const previewThemeCommand = vscode.commands.registerCommand(
    'xorigoUi.previewTheme',
    async () => {
      await themePreviewProvider.previewCurrentTheme()
    }
  )

  const openDocsCommand = vscode.commands.registerCommand(
    'xorigoUi.openDocs',
    async (componentName?: string) => {
      const uri = componentName
        ? vscode.Uri.parse(`https://xorigo-ui.github.io/docs/components/${componentName}`)
        : vscode.Uri.parse('https://xorigo-ui.github.io/docs')
      await vscode.env.openExternal(uri)
    }
  )

  // 状态栏项目
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  )
  statusBarItem.command = 'xorigoUi.switchTheme'
  statusBarItem.text = '$(color-mode) Xorigo UI'
  statusBarItem.tooltip = '点击切换 Xorigo UI 主题'

  // 检查配置决定是否显示状态栏
  const config = vscode.workspace.getConfiguration('xorigoUi')
  if (config.get<boolean>('showThemeInStatusBar', true)) {
    statusBarItem.show()
  }

  // 监听配置变化
  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('xorigoUi.showThemeInStatusBar')) {
      const showInStatusBar = config.get<boolean>('showThemeInStatusBar', true)
      if (showInStatusBar) {
        statusBarItem.show()
      } else {
        statusBarItem.hide()
      }
    }
  })

  // 注册配置更改监听器
  const configChangeDisposable = vscode.workspace.onDidChangeConfiguration(
    async (event) => {
      if (event.affectsConfiguration('xorigoUi')) {
        await completionProvider.refreshConfiguration()
        await hoverProvider.refreshConfiguration()
        await themePreviewProvider.refreshConfiguration()
      }
    }
  )

  // 将所有订阅添加到上下文
  context.subscriptions.push(
    completionDisposable,
    hoverDisposable,
    componentView,
    switchThemeCommand,
    insertComponentCommand,
    previewThemeCommand,
    openDocsCommand,
    statusBarItem,
    configChangeDisposable
  )

  // 显示欢迎消息
  const message = 'Xorigo UI 扩展已激活！享受智能代码补全和主题预览功能吧 🚀'
  vscode.window.showInformationMessage(message, '查看文档').then((selection) => {
    if (selection === '查看文档') {
      vscode.commands.executeCommand('xorigoUi.openDocs')
    }
  })
}

/**
 * 扩展停用时的清理函数
 */
export function deactivate() {
  console.log('Xorigo UI 扩展已停用')
  if (themePreviewProvider) {
    themePreviewProvider.dispose()
  }
}
