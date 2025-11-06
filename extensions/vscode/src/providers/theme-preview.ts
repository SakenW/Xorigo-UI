/**
 * 主题预览提供者
 *
 * 提供实时主题切换和预览功能
 */

import * as vscode from 'vscode'
import { ThemeData } from '../data/theme-data'

export class ThemePreviewProvider {
  private themeData: ThemeData
  private enabled: boolean = true
  private currentTheme: string = 'corporate-blue'

  constructor() {
    this.themeData = new ThemeData()
    this.refreshConfiguration()
  }

  async refreshConfiguration() {
    const config = vscode.workspace.getConfiguration('xorigoUi')
    this.enabled = config.get<boolean>('enableThemePreview', true)
    await this.themeData.loadThemes()
    this.currentTheme = this.themeData.getCurrentTheme()
  }

  /**
   * 显示主题选择器
   */
  async showThemePicker(): Promise<void> {
    const themes = this.themeData.getAllThemes()

    const items: vscode.QuickPickItem[] = themes.map((theme) => ({
      label: theme.name,
      description: theme.description,
      detail: `${theme.id} - ${theme.category}`,
      kind: vscode.QuickPickItemKind.Default,
    }))

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: '选择 Xorigo UI 主题',
      matchOnDescription: true,
    })

    if (selected) {
      const theme = themes.find((t) => t.name === selected.label)
      if (theme) {
        await this.applyTheme(theme.id)
      }
    }
  }

  /**
   * 预览当前主题
   */
  async previewCurrentTheme(): Promise<void> {
    if (!this.enabled) {
      vscode.window.showWarningMessage('Xorigo UI 主题预览功能已禁用')
      return
    }

    const theme = this.themeData.getTheme(this.currentTheme)
    if (!theme) {
      vscode.window.showErrorMessage(`主题 "${this.currentTheme}" 未找到`)
      return
    }

    // 创建预览面板
    const panel = vscode.window.createWebviewPanel(
      'xorigoThemePreview',
      `主题预览 - ${theme.name}`,
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    )

    panel.webview.html = this.getPreviewHtml(theme)

    // 监听主题变化
    panel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === 'applyTheme') {
          await this.applyTheme(message.themeId)
        }
      },
      undefined,
      []
    )
  }

  /**
   * 应用主题
   */
  private async applyTheme(themeId: string): Promise<void> {
    const theme = this.themeData.getTheme(themeId)
    if (!theme) {
      vscode.window.showErrorMessage(`主题 "${themeId}" 未找到`)
      return
    }

    this.currentTheme = themeId

    // 更新 VS Code 主题（如果支持）
    const config = vscode.workspace.getConfiguration('workbench')
    const currentColorTheme = config.get<string>('colorTheme')

    // 创建临时工作区设置文件
    const workspaceEdit = new vscode.WorkspaceEdit()

    // 检查是否有工作区文件夹
    const workspaceFolders = vscode.workspace.workspaceFolders
    if (workspaceFolders && workspaceFolders.length > 0) {
      const settingsUri = vscode.Uri.joinPath(
        workspaceFolders[0].uri,
        '.vscode',
        'settings.json'
      )

      try {
        const settingsDoc = await vscode.workspace.openTextDocument(settingsUri)
        const settingsContent = settingsDoc.getText()
        const settingsJson = JSON.parse(settingsContent)

        // 添加 Xorigo UI 主题配置
        settingsJson['xorigoUi.currentTheme'] = themeId

        workspaceEdit.replace(
          settingsUri,
          new vscode.Range(0, 0, settingsDoc.lineCount, 0),
          JSON.stringify(settingsJson, null, 2)
        )

        await vscode.workspace.applyEdit(workspaceEdit)
      } catch (error) {
        // 忽略错误，用户可能没有工作区设置
      }
    }

    // 显示成功消息
    vscode.window.setStatusBarMessage(
      `$(check) 已切换到主题: ${theme.name}`,
      3000
    )

    // 触发主题更改事件
    vscode.commands.executeCommand('workbench.action.reloadWindow')
  }

  /**
   * 获取主题预览 HTML
   */
  private getPreviewHtml(theme: any): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>主题预览 - ${theme.name}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: ${theme.variables['--color-surface-50'] || '#f9fafb'};
            color: ${theme.variables['--color-text-primary'] || '#111827'};
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background: ${theme.variables['--color-surface-100'] || '#f3f4f6'};
            padding: 24px;
            border-radius: 8px;
            margin-bottom: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
            margin: 0 0 8px 0;
            font-size: 24px;
            color: ${theme.variables['--color-text-primary'] || '#111827'};
        }

        .header p {
            margin: 0;
            color: ${theme.variables['--color-text-secondary'] || '#6b7280'};
        }

        .themes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 16px;
            margin-top: 24px;
        }

        .theme-card {
            background: ${theme.variables['--color-surface-100'] || '#f3f4f6'};
            padding: 20px;
            border-radius: 8px;
            border: 2px solid ${theme.variables['--color-surface-200'] || '#e5e7eb'};
            cursor: pointer;
            transition: all 0.2s;
        }

        .theme-card:hover {
            border-color: ${theme.variables['--color-primary-500'] || '#3b82f6'};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .theme-card.active {
            border-color: ${theme.variables['--color-primary-500'] || '#3b82f6'};
            background: ${theme.variables['--color-primary-50'] || '#eff6ff'};
        }

        .theme-name {
            font-weight: 600;
            margin-bottom: 8px;
            color: ${theme.variables['--color-text-primary'] || '#111827'};
        }

        .theme-description {
            font-size: 14px;
            color: ${theme.variables['--color-text-secondary'] || '#6b7280'};
            margin-bottom: 12px;
        }

        .color-palette {
            display: flex;
            gap: 8px;
            margin-top: 12px;
        }

        .color-swatch {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            border: 1px solid ${theme.variables['--color-surface-300'] || '#d1d5db'};
        }

        .button-demo {
            display: inline-block;
            padding: 8px 16px;
            margin: 4px;
            background: ${theme.variables['--color-primary-500'] || '#3b82f6'};
            color: ${theme.variables['--color-text-inverse'] || '#ffffff'};
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        }

        .button-demo:hover {
            background: ${theme.variables['--color-primary-600'] || '#2563eb'};
        }

        .button-demo.secondary {
            background: ${theme.variables['--color-secondary-500'] || '#6366f1'};
        }

        .button-demo.secondary:hover {
            background: ${theme.variables['--color-secondary-600'] || '#4f46e5'};
        }

        .status-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: ${theme.variables['--color-surface-800'] || '#1f2937'};
            color: ${theme.variables['--color-text-inverse'] || '#ffffff'};
            padding: 8px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 主题预览 - ${theme.name}</h1>
            <p>${theme.description}</p>
        </div>

        <div class="button-demo" style="margin-right: 8px;">主要按钮</div>
        <div class="button-demo secondary">次要按钮</div>

        <div style="margin-top: 24px; padding: 16px; background: ${theme.variables['--color-surface-100'] || '#f3f4f6'}; border-radius: 8px;">
            <h3 style="margin-top: 0;">输入框示例</h3>
            <input type="text" placeholder="请输入..." style="width: 100%; padding: 8px 12px; border: 1px solid ${theme.variables['--color-border-secondary'] || '#d1d5db'}; border-radius: 6px; background: ${theme.variables['--color-surface-50'] || '#f9fafb'}; color: ${theme.variables['--color-text-primary'] || '#111827'};">
        </div>

        <div style="margin-top: 24px; padding: 16px; background: ${theme.variables['--color-surface-100'] || '#f3f4f6'}; border-radius: 8px;">
            <h3 style="margin-top: 0;">卡片组件</h3>
            <p style="color: ${theme.variables['--color-text-secondary'] || '#6b7280'};">这是一个卡片组件的示例，展示主题的表面和文本颜色。</p>
        </div>
    </div>

    <div class="status-bar">
        <span>当前主题: ${theme.name}</span>
        <span>点击上方主题卡片可快速切换</span>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        function switchTheme(themeId) {
            vscode.postMessage({
                command: 'applyTheme',
                themeId: themeId
            });
        }

        // 监听来自扩展的消息
        window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === 'updateTheme') {
                // 更新主题
                location.reload();
            }
        });
    </script>
</body>
</html>`
  }

  /**
   * 清理资源
   */
  dispose(): void {
    // 清理监听器等资源
  }
}
