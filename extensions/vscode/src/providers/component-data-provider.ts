/**
 * 组件数据提供者
 *
 * 提供侧边栏组件树视图
 */

import * as vscode from 'vscode'
import { ComponentRegistry, ComponentMetadata } from '../data/component-registry'
import { ThemeData, ThemeRecipe } from '../data/theme-data'

export interface ComponentTreeItem extends vscode.TreeItem {
  parent?: ComponentTreeItem
  metadata?: ComponentMetadata
  theme?: ThemeRecipe
  category?: string
}

/**
 * 组件数据树视图提供者
 */
export class ComponentDataProvider implements vscode.TreeDataProvider<ComponentTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    ComponentTreeItem | undefined
  > = new vscode.EventEmitter<ComponentTreeItem | undefined>()

  readonly onDidChangeTreeData: vscode.Event<
    ComponentTreeItem | undefined
  > = this._onDidChangeTreeData.event

  private componentRegistry: ComponentRegistry
  private themeData: ThemeData

  constructor() {
    this.componentRegistry = new ComponentRegistry()
    this.themeData = new ThemeData()
    this.loadData()
  }

  private async loadData(): Promise<void> {
    await this.componentRegistry.loadComponents()
    await this.themeData.loadThemes()
  }

  /**
   * 获取树项
   */
  getTreeItem(element: ComponentTreeItem): vscode.TreeItem {
    return element
  }

  /**
   * 获取子项
   */
  async getChildren(element?: ComponentTreeItem): Promise<ComponentTreeItem[]> {
    if (!element) {
      // 根节点 - 返回分类
      return this.getCategoryItems()
    }

    if (element.category) {
      // 分类节点 - 返回组件
      return this.getComponentItems(element.category)
    }

    return []
  }

  /**
   * 获取分类节点
   */
  private getCategoryItems(): ComponentTreeItem[] {
    const categories = new Set(
      this.componentRegistry.getAllComponents().map((c) => c.category)
    )

    return Array.from(categories).map((category) => {
      const item = new ComponentTreeItem(
        category,
        vscode.TreeItemCollapsibleState.Collapsed
      )
      item.category = category
      item.iconPath = new vscode.ThemeIcon(
        this.getCategoryIcon(category),
        new vscode.ThemeColor('charts.blue')
      )
      item.contextValue = 'category'
      return item
    })
  }

  /**
   * 获取组件节点
   */
  private getComponentItems(category: string): ComponentTreeItem[] {
    const components = this.componentRegistry.getComponentsByCategory(category)

    return components.map((component) => {
      const item = new ComponentTreeItem(
        component.name,
        vscode.TreeItemCollapsibleState.None
      )
      item.metadata = component
      item.iconPath = new vscode.ThemeIcon(
        'symbol-class',
        new vscode.ThemeColor('symbolClass')
      )
      item.contextValue = 'component'

      // 添加工具提示
      item.tooltip = `${component.name} - ${component.description}\n\n` +
        `分类: ${component.category}\n` +
        `变体: ${component.variants.join(', ')}\n` +
        `尺寸: ${component.sizes.join(', ')}`

      return item
    })
  }

  /**
   * 获取分类图标
   */
  private getCategoryIcon(category: string): string {
    const iconMap: Record<string, string> = {
      'Inputs': 'symbol-property',
      'Data Display': 'symbol-field',
      'Navigation': 'symbol-method',
      'Overlays': 'symbol-constructor',
      'Feedback': 'symbol-event',
      'Media': 'symbol-interface',
      'Typography': 'symbol-typeParameter',
      'Layout': 'symbol-namespace'
    }
    return iconMap[category] || 'symbol-file'
  }

  /**
   * 刷新数据
   */
  refresh(): void {
    this._onDidChangeTreeData.fire(undefined)
  }

  /**
   * 获取组件详情
   */
  getComponentDetails(componentName: string): ComponentMetadata | undefined {
    return this.componentRegistry.getComponent(componentName)
  }

  /**
   * 搜索组件
   */
  searchComponents(query: string): ComponentMetadata[] {
    return this.componentRegistry.searchComponents(query)
  }
}

/**
 * 主题数据树视图提供者
 */
export class ThemeDataProvider implements vscode.TreeDataProvider<ComponentTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    ComponentTreeItem | undefined
  > = new vscode.EventEmitter<ComponentTreeItem | undefined>()

  readonly onDidChangeTreeData: vscode.Event<
    ComponentTreeItem | undefined
  > = this._onDidChangeTreeData.event

  private themeData: ThemeData

  constructor() {
    this.themeData = new ThemeData()
    this.loadData()
  }

  private async loadData(): Promise<void> {
    await this.themeData.loadThemes()
  }

  /**
   * 获取树项
   */
  getTreeItem(element: ComponentTreeItem): vscode.TreeItem {
    return element
  }

  /**
   * 获取子项
   */
  async getChildren(element?: ComponentTreeItem): Promise<ComponentTreeItem[]> {
    if (!element) {
      // 根节点 - 返回主题分类
      const categories = this.themeData.getCategories()
      return categories.map((category) => {
        const item = new ComponentTreeItem(
          category,
          vscode.TreeItemCollapsibleState.Collapsed
        )
        item.category = category
        item.iconPath = new vscode.ThemeIcon(
          'color-mode',
          new vscode.ThemeColor('activityBarBadge.background')
        )
        item.contextValue = 'themeCategory'
        return item
      })
    }

    if (element.category) {
      // 分类节点 - 返回主题
      const themes = this.themeData.getThemesByCategory(element.category)
      return themes.map((theme) => {
        const item = new ComponentTreeItem(
          theme.name,
          vscode.TreeItemCollapsibleState.None
        )
        item.theme = theme
        item.iconPath = new vscode.ThemeIcon(
          'paintcan',
          new vscode.ThemeColor('paintcan.border')
        )
        item.contextValue = 'theme'

        // 添加工具提示
        item.tooltip = `${theme.name}\n\n` +
          `描述: ${theme.description}\n` +
          `分类: ${theme.category}\n` +
          `模式: ${theme.axes.mode || 'auto'}\n` +
          `色调: ${theme.axes.tone || 'standard'}`

        return item
      })
    }

    return []
  }

  /**
   * 刷新数据
   */
  refresh(): void {
    this._onDidChangeTreeData.fire(undefined)
  }
}
