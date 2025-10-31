# Workbench与组件库集成架构设计 v2.0

**生成日期**: 2025-10-31
**版本**: v2.0
**架构师**: Winston (Holistic System Architect)
**文档类型**: 技术实施规范 (TDR-003)

---

## 📋 执行摘要

本文档定义了 Xorigo UI Workbench 与核心组件库的深度集成架构。基于现有的完善Workbench系统，设计了一套高性能、可扩展的集成方案，支持实时组件预览、AI辅助开发、配方系统无缝集成和协作功能。

### 🎯 核心设计目标

- **无缝集成**: Workbench与组件库零配置集成
- **实时预览**: 组件修改即时预览，延迟 < 50ms
- **AI增强**: 智能代码生成和配方推荐
- **协作支持**: 多用户实时协作开发
- **性能优化**: 大型组件库流畅运行，内存使用 < 200MB

---

## 🏗️ 集成架构总览

### 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                    Xorigo UI Workbench                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Monaco Editor │  │  Component      │  │   AI Assistant  │ │
│  │                 │  │  Preview Panel  │  │                 │ │
│  │ - Code Editor   │  │ - Live Preview  │  │ - Code Gen      │ │
│  │ - IntelliSense  │  │ - Theme Switch  │  │ - Recipe Rec    │ │
│  │ - Error Check   │  │ - Props Editor  │  │ - Debug Help    │ │
│  └─────────┬───────┘  └─────────┬───────┘  └─────────┬───────┘ │
│            │                    │                    │           │
│            └────────────────────┼────────────────────┘           │
│                                 │                                │
│  ┌─────────────────────────────┴─────────────────────────────┐   │
│  │              Integration Layer                            │   │
│  │                                                             │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │   │
│  │  │ Component   │  │  Theme      │  │   Asset     │       │   │
│  │  │ Registry    │  │   Bridge    │  │  Manager    │       │   │
│  │  │             │  │             │  │             │       │   │
│  │  │ - Dynamic   │  │ - Recipe    │  │ - Icon      │       │   │
│  │  │   Import    │  │   Sync      │  │   Library  │       │   │
│  │  │ - Hot Reload│  │ - Live      │  │ - Font      │       │   │
│  │  │ - Type Info │  │   Switch    │  │   Loading   │       │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Core Component Library                         │
├─────────────────────────────────────────────────────────────────┤
│  packages/core/src/                                            │
│  ├── foundations/     ├── primitives/     ├── form/            │
│  ├── system/          ├── overlays/       ├── data-display/    │
│  ├── feedback/        ├── layout/         ├── navigation/      │
│  ├── typography/      ├── branding/       ├── showcase/        │
│  └── effects/         └── motion/         └── hooks/           │
└─────────────────────────────────────────────────────────────────┘
```

### 核心集成组件

```typescript
// apps/website/src/components/workbench/integration/types.ts
export interface WorkbenchIntegrationConfig {
  // 组件库配置
  componentLibrary: {
    baseUrl: string
    entryPoints: string[]
    excludePatterns: string[]
    includeDevComponents: boolean
  }

  // 主题系统配置
  themeSystem: {
    enableLivePreview: boolean
    recipeAutoApply: boolean
    customRecipesPath: string
  }

  // AI助手配置
  aiAssistant: {
    enabled: boolean
    provider: 'openai' | 'anthropic' | 'local'
    model: string
    maxTokens: number
  }

  // 开发服务器配置
  devServer: {
    port: number
    hotReload: boolean
    fastRefresh: boolean
  }
}

export interface ComponentRegistry {
  // 组件注册信息
  components: Map<string, ComponentInfo>

  // 动态导入函数
  importComponent: (name: string) => Promise<ComponentModule>

  // 热重载支持
  hotReload: (componentName: string) => void

  // 类型信息获取
  getTypeInfo: (componentName: string) => Promise<TypeInfo>
}

export interface ComponentInfo {
  name: string
  category: ComponentCategory
  description: string
  props: PropDefinition[]
  examples: ComponentExample[]
  dependencies: string[]
  sourcePath: string
  isDevComponent: boolean
}

export interface ThemeBridge {
  // 主题切换
  applyTheme: (recipe: ThemeRecipe) => Promise<void>

  // 配方同步
  syncRecipes: () => Promise<ThemeRecipe[]>

  // 实时预览
  previewTheme: (axis: ThemeAxis) => Promise<ThemeTokens>

  // 主题导出
  exportTheme: (recipe: ThemeRecipe) => Promise<string>
}
```

---

## 🔧 组件注册与动态加载系统

### 组件注册器

```typescript
// apps/website/src/components/workbench/integration/component-registry.ts
export class ComponentRegistry {
  private components = new Map<string, ComponentInfo>()
  private modules = new Map<string, ComponentModule>()
  private watchers = new Map<string, FSWatcher>()
  private typeCache = new Map<string, TypeInfo>()

  constructor(private config: WorkbenchIntegrationConfig) {
    this.initializeRegistry()
  }

  private async initializeRegistry(): Promise<void> {
    // 1. 扫描组件库目录
    await this.scanComponentLibrary()

    // 2. 注册所有组件
    await this.registerComponents()

    // 3. 设置文件监听
    this.setupFileWatchers()

    // 4. 预加载常用组件
    await this.preloadComponents()
  }

  private async scanComponentLibrary(): Promise<void> {
    const componentDirs = [
      'primitives',
      'form',
      'overlays',
      'data-display',
      'feedback',
      'layout',
      'navigation',
      'typography',
      'branding',
      'showcase',
      'effects',
      'motion'
    ]

    for (const dir of componentDirs) {
      const componentPath = path.join(
        process.cwd(),
        'packages/core/src',
        dir
      )

      if (fs.existsSync(componentPath)) {
        await this.scanDirectory(componentPath, dir as ComponentCategory)
      }
    }
  }

  private async scanDirectory(dirPath: string, category: ComponentCategory): Promise<void> {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const componentPath = path.join(dirPath, entry.name)
        await this.scanComponent(componentPath, category)
      }
    }
  }

  private async scanComponent(componentPath: string, category: ComponentCategory): Promise<void> {
    const componentName = path.basename(componentPath)
    const indexPath = path.join(componentPath, 'index.ts')

    if (!fs.existsSync(indexPath)) {
      return
    }

    // 读取组件源码
    const sourceCode = fs.readFileSync(indexPath, 'utf-8')

    // 解析组件信息
    const componentInfo = await this.parseComponentInfo(
      componentName,
      category,
      sourceCode,
      componentPath
    )

    this.components.set(componentName, componentInfo)
  }

  private async parseComponentInfo(
    name: string,
    category: ComponentCategory,
    sourceCode: string,
    sourcePath: string
  ): Promise<ComponentInfo> {
    // 使用AST解析源码
    const ast = parse(sourceCode, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    })

    let description = ''
    const props: PropDefinition[] = []
    const examples: ComponentExample[] = []
    const dependencies: string[] = []

    // 提取JSDoc注释
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        if (path.node.declaration.type === 'FunctionDeclaration' ||
            path.node.declaration.type === 'ClassDeclaration') {
          description = this.extractJSDoc(path.node.leadingComments) || ''
        }
      },

      ImportDeclaration(path) {
        const source = path.node.source.value
        if (source.startsWith('./') || source.startsWith('../')) {
          dependencies.push(source)
        }
      }
    })

    // 提取Props定义
    const propsType = this.extractPropsType(ast)
    if (propsType) {
      props.push(...await this.parsePropsDefinition(propsType))
    }

    // 查找示例文件
    const examplesPath = path.join(path.dirname(sourcePath), '__examples__')
    if (fs.existsSync(examplesPath)) {
      examples.push(...await this.loadExamples(examplesPath))
    }

    return {
      name,
      category,
      description,
      props,
      examples,
      dependencies,
      sourcePath,
      isDevComponent: sourcePath.includes('/dev/') || sourcePath.includes('/__tests__/')
    }
  }

  // 动态导入组件
  async importComponent(name: string): Promise<ComponentModule> {
    // 1. 检查缓存
    if (this.modules.has(name)) {
      return this.modules.get(name)!
    }

    // 2. 获取组件信息
    const componentInfo = this.components.get(name)
    if (!componentInfo) {
      throw new Error(`Component ${name} not found`)
    }

    // 3. 动态导入
    try {
      const module = await import(componentInfo.sourcePath)
      this.modules.set(name, module)
      return module
    } catch (error) {
      console.error(`Failed to import component ${name}:`, error)
      throw new Error(`Failed to import component ${name}`)
    }
  }

  // 热重载支持
  hotReload(componentName: string): void {
    // 1. 清除模块缓存
    const componentInfo = this.components.get(componentName)
    if (componentInfo) {
      delete require.cache[componentInfo.sourcePath]
      this.modules.delete(componentName)
      this.typeCache.delete(componentName)
    }

    // 2. 重新扫描组件
    this.scanComponent(componentInfo.sourcePath, componentInfo.category)

    // 3. 通知UI更新
    this.notifyHotReload(componentName)
  }

  // 获取类型信息
  async getTypeInfo(componentName: string): Promise<TypeInfo> {
    // 检查缓存
    if (this.typeCache.has(componentName)) {
      return this.typeCache.get(componentName)!
    }

    const componentInfo = this.components.get(componentName)
    if (!componentInfo) {
      throw new Error(`Component ${componentName} not found`)
    }

    // 使用TypeScript编译器API获取类型信息
    const typeInfo = await this.extractTypeInfo(componentInfo.sourcePath)
    this.typeCache.set(componentName, typeInfo)

    return typeInfo
  }

  private setupFileWatchers(): void {
    for (const [name, info] of this.components) {
      const watcher = chokidar.watch(info.sourcePath, {
        ignoreInitial: true,
        persistent: true
      })

      watcher.on('change', () => {
        console.log(`Component ${name} changed, triggering hot reload`)
        this.hotReload(name)
      })

      this.watchers.set(name, watcher)
    }
  }

  private notifyHotReload(componentName: string): void {
    // 发送WebSocket消息到Workbench
    workbenchWebSocket.emit('component-hot-reload', {
      componentName,
      timestamp: Date.now()
    })
  }
}
```

### Monaco Editor集成

```typescript
// apps/website/src/components/workbench/editor/monaco-integration.ts
import * as monaco from 'monaco-editor'
import { ComponentRegistry } from '../integration/component-registry'

export class MonacoIntegration {
  private editor: monaco.editor.IStandaloneCodeEditor
  private componentRegistry: ComponentRegistry
  private completionProvider: monaco.languages.CompletionItemProvider

  constructor(
    editor: monaco.editor.IStandaloneCodeEditor,
    componentRegistry: ComponentRegistry
  ) {
    this.editor = editor
    this.componentRegistry = componentRegistry
    this.setupLanguageFeatures()
  }

  private setupLanguageFeatures(): void {
    // 1. 设置TypeScript语言支持
    this.setupTypeScriptSupport()

    // 2. 设置自动补全
    this.setupAutoCompletion()

    // 3. 设置悬停提示
    this.setupHoverProvider()

    // 4. 设置错误检查
    this.setupDiagnostics()

    // 5. 设置代码格式化
    this.setupFormatting()
  }

  private setupTypeScriptSupport(): void {
    // 添加组件库类型定义
    const componentTypes = this.generateComponentTypeDefinitions()

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      componentTypes,
      'file:///node_modules/@xorigo-ui/core/index.d.ts'
    )

    // 配置编译器选项
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    })
  }

  private generateComponentTypeDefinitions(): string {
    let definitions = `
// Xorigo UI Component Library Type Definitions
import React from 'react'

declare module '@xorigo-ui/core' {
`

    // 为每个组件生成类型定义
    for (const [name, info] of this.componentRegistry.getComponents()) {
      const propsInterface = this.generatePropsInterface(name, info.props)
      definitions += `
  export const ${name}: React.FC<${name}Props>
  export interface ${name}Props {
    ${propsInterface}
  }
`
    }

    definitions += `
  // Theme related types
  export interface ThemeRecipe {
    id: string
    name: string
    axis: ThemeAxis
    tokens: ThemeTokens
  }

  export interface ThemeAxis {
    mode: 'light' | 'dark' | 'auto'
    hue: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'teal' | 'custom'
    saturation: number
    lightness: number
    density: 'compact' | 'comfortable' | 'spacious' | 'custom'
    roundness: number
    contrast: 'low' | 'normal' | 'high' | 'custom'
  }
}
`

    return definitions
  }

  private generatePropsInterface(componentName: string, props: PropDefinition[]): string {
    return props.map(prop => {
      const optional = prop.required ? '' : '?'
      const type = this.getTypeScriptType(prop.type)
      const comment = prop.description ? `  /** ${prop.description} */\n` : ''
      return `${comment}  ${prop.name}${optional}: ${type}`
    }).join('\n')
  }

  private setupAutoCompletion(): void {
    this.completionProvider = {
      provideCompletionItems: async (model, position) => {
        const suggestions: monaco.languages.CompletionItem[] = []

        // 1. 组件名称自动补全
        const componentSuggestions = this.getComponentSuggestions(model, position)
        suggestions.push(...componentSuggestions)

        // 2. Props自动补全
        const propsSuggestions = this.getPropsSuggestions(model, position)
        suggestions.push(...propsSuggestions)

        // 3. 主题配方自动补全
        const themeSuggestions = this.getThemeSuggestions(model, position)
        suggestions.push(...themeSuggestions)

        return { suggestions }
      }
    }

    monaco.languages.registerCompletionItemProvider('typescript', this.completionProvider)
  }

  private getComponentSuggestions(
    model: monaco.editor.ITextModel,
    position: monaco.Position
  ): monaco.languages.CompletionItem[] {
    const suggestions: monaco.languages.CompletionItem[] = []

    // 获取所有可用组件
    const components = Array.from(this.componentRegistry.getComponents().values())

    for (const component of components) {
      suggestions.push({
        label: component.name,
        kind: monaco.languages.CompletionItemKind.Class,
        documentation: component.description,
        insertText: this.generateComponentInsertText(component.name, component.props),
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        sortText: '0' // 组件优先级最高
      })
    }

    return suggestions
  }

  private generateComponentInsertText(componentName: string, props: PropDefinition[]): string {
    let insertText = `<${componentName}`

    // 添加常用props
    const commonProps = props.filter(p => p.required || this.isCommonProp(p.name))
    for (const prop of commonProps) {
      const defaultValue = this.getDefaultValue(prop)
      insertText += `\n  ${prop.name}={${defaultValue}}`
    }

    if (commonProps.length > 0) {
      insertText += '\n'
    }

    insertText += '>$1</' + componentName + '>'

    return insertText
  }

  private getPropsSuggestions(
    model: monaco.editor.ITextModel,
    position: monaco.Position
  ): monaco.languages.CompletionItem[] {
    const suggestions: monaco.languages.CompletionItem[] = []

    // 分析当前光标位置的组件
    const currentComponent = this.getCurrentComponent(model, position)
    if (currentComponent) {
      const componentInfo = this.componentRegistry.getComponentInfo(currentComponent)

      if (componentInfo) {
        for (const prop of componentInfo.props) {
          suggestions.push({
            label: prop.name,
            kind: monaco.languages.CompletionItemKind.Property,
            documentation: prop.description,
            insertText: `${prop.name}={$1}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
          })
        }
      }
    }

    return suggestions
  }

  private getThemeSuggestions(
    model: monaco.editor.ITextModel,
    position: monaco.Position
  ): monaco.languages.CompletionItem[] {
    const suggestions: monaco.languages.CompletionItem[] = []

    // 获取可用主题配方
    const recipes = this.getAvailableRecipes()

    for (const recipe of recipes) {
      suggestions.push({
        label: recipe.name,
        kind: monaco.languages.CompletionItemKind.Value,
        documentation: recipe.description,
        insertText: `"${recipe.id}"`,
        detail: 'Theme Recipe'
      })
    }

    return suggestions
  }

  private setupHoverProvider(): void {
    monaco.languages.registerHoverProvider('typescript', {
      provideHover: async (model, position) => {
        const word = model.getWordAtPosition(position)
        if (!word) return

        // 检查是否是组件名
        const componentInfo = this.componentRegistry.getComponentInfo(word.word)
        if (componentInfo) {
          return {
            range: new monaco.Range(
              position.lineNumber,
              word.startColumn,
              position.lineNumber,
              word.endColumn
            ),
            contents: [
              { value: `**${componentInfo.name}**` },
              { value: componentInfo.description },
              { value: `\`${componentInfo.category}\` category` }
            ]
          }
        }

        return null
      }
    })
  }
}
```

---

## 🎨 主题系统集成

### 主题桥接器

```typescript
// apps/website/src/components/workbench/integration/theme-bridge.ts
export class ThemeBridge {
  private currentRecipe: ThemeRecipe | null = null
  private previewMode = false
  private workbenchWebSocket: WorkbenchWebSocket

  constructor(private config: WorkbenchIntegrationConfig) {
    this.workbenchWebSocket = new WorkbenchWebSocket()
    this.initializeThemeSync()
  }

  private async initializeThemeSync(): Promise<void> {
    // 1. 同步现有配方
    await this.syncRecipes()

    // 2. 设置实时更新监听
    this.setupRecipeUpdates()

    // 3. 应用默认主题
    await this.applyDefaultTheme()
  }

  // 应用主题配方
  async applyTheme(recipe: ThemeRecipe): Promise<void> {
    this.currentRecipe = recipe

    // 1. 应用CSS变量
    await this.applyCSSVariables(recipe.tokens)

    // 2. 更新Tailwind配置
    await this.updateTailwindConfig(recipe.tokens)

    // 3. 更新Monaco编辑器主题
    await this.updateEditorTheme(recipe)

    // 4. 通知组件预览更新
    this.notifyPreviewUpdate(recipe)

    // 5. 记录主题使用
    await this.recordThemeUsage(recipe.id)
  }

  private async applyCSSVariables(tokens: ThemeTokens): Promise<void> {
    const root = document.documentElement

    // 批量应用CSS变量以提高性能
    const cssVariables: { [key: string]: string } = {}

    // 颜色变量
    Object.entries(tokens.colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        cssVariables[`--color-${key}`] = value
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([shade, colorValue]) => {
          cssVariables[`--color-${key}-${shade}`] = colorValue as string
        })
      }
    })

    // 间距变量
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      cssVariables[`--spacing-${key}`] = `${value}px`
    })

    // 字体变量
    Object.entries(tokens.typography).forEach(([key, value]) => {
      if (typeof value === 'string') {
        cssVariables[`--font-${key}`] = value
      }
    })

    // 应用变量（批量更新性能更好）
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
  }

  private async updateTailwindConfig(tokens: ThemeTokens): Promise<void> {
    // 动态更新Tailwind配置
    const tailwindConfig = {
      theme: {
        extend: {
          colors: this.generateTailwindColors(tokens.colors),
          spacing: this.generateTailwindSpacing(tokens.spacing),
          fontFamily: this.generateTailwindFonts(tokens.typography),
          borderRadius: this.generateTailwindBorderRadius(tokens)
        }
      }
    }

    // 发送配置更新到开发服务器
    await this.sendTailwindConfigUpdate(tailwindConfig)
  }

  private generateTailwindColors(colors: ColorTokens): { [key: string]: any } {
    const tailwindColors: { [key: string]: any } = {}

    Object.entries(colors).forEach(([name, value]) => {
      if (typeof value === 'object' && value !== null) {
        tailwindColors[name] = value
      }
    })

    return tailwindColors
  }

  private async updateEditorTheme(recipe: ThemeRecipe): Promise<void> {
    // 根据主题配方生成Monaco编辑器主题
    const editorTheme = this.generateEditorTheme(recipe.tokens)

    // 应用到Monaco编辑器
    monaco.editor.defineTheme('xorigo-theme', editorTheme)
    monaco.editor.setTheme('xorigo-theme')
  }

  private generateEditorTheme(tokens: ThemeTokens): monaco.editor.IStandaloneThemeData {
    const isDark = this.currentRecipe?.axis.mode === 'dark'

    return {
      base: isDark ? 'vs-dark' : 'vs',
      inherit: true,
      rules: [
        // 语法高亮颜色
        { token: 'comment', foreground: tokens.colors.neutral[500] },
        { token: 'keyword', foreground: tokens.colors.primary[600] },
        { token: 'string', foreground: tokens.colors.success[600] },
        { token: 'number', foreground: tokens.colors.accent[600] },
      ],
      colors: {
        'editor.background': tokens.colors.neutral[isDark ? 900 : 50],
        'editor.foreground': tokens.colors.neutral[isDark ? 100 : 900],
        'editor.lineHighlightBackground': tokens.colors.neutral[isDark ? 800 : 100],
        'editorCursor.foreground': tokens.colors.primary[500],
        'editor.selectionBackground': tokens.colors.primary[200],
        'editor.inactiveSelectionBackground': tokens.colors.neutral[200],
      }
    }
  }

  // 实时主题预览
  async previewTheme(axis: ThemeAxis): Promise<ThemeTokens> {
    this.previewMode = true

    try {
      // 1. 生成预览令牌
      const previewTokens = await this.generatePreviewTokens(axis)

      // 2. 应用预览样式
      await this.applyPreviewStyles(previewTokens)

      // 3. 通知Workbench预览模式
      this.workbenchWebSocket.emit('theme-preview-mode', {
        enabled: true,
        axis
      })

      return previewTokens
    } catch (error) {
      console.error('Failed to preview theme:', error)
      throw error
    }
  }

  private async generatePreviewTokens(axis: ThemeAxis): Promise<ThemeTokens> {
    // 使用令牌计算引擎生成预览令牌
    const calculator = new TokenCalculator()
    return calculator.calculateAllTokens(axis)
  }

  private async applyPreviewStyles(tokens: ThemeTokens): Promise<void> {
    // 添加预览样式类
    document.body.classList.add('theme-preview-mode')

    // 应用预览CSS变量
    const root = document.documentElement
    root.setAttribute('data-theme-preview', 'true')

    await this.applyCSSVariables(tokens)
  }

  // 退出预览模式
  async exitPreviewMode(): Promise<void> {
    this.previewMode = false

    // 移除预览样式
    document.body.classList.remove('theme-preview-mode')
    document.documentElement.removeAttribute('data-theme-preview')

    // 恢复当前主题
    if (this.currentRecipe) {
      await this.applyTheme(this.currentRecipe)
    }

    // 通知Workbench退出预览
    this.workbenchWebSocket.emit('theme-preview-mode', {
      enabled: false
    })
  }

  // 导出主题
  async exportTheme(recipe: ThemeRecipe): Promise<string> {
    const exportData = {
      recipe,
      cssVariables: this.generateCSSExport(recipe.tokens),
      tailwindConfig: this.generateTailwindExport(recipe.tokens),
      usage: this.generateUsageExample(recipe)
    }

    return JSON.stringify(exportData, null, 2)
  }

  private generateCSSExport(tokens: ThemeTokens): string {
    let css = ':root {\n'

    // 生成CSS变量
    Object.entries(tokens.colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        css += `  --color-${key}: ${value};\n`
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([shade, colorValue]) => {
          css += `  --color-${key}-${shade}: ${colorValue};\n`
        })
      }
    })

    css += '}'

    return css
  }

  private generateUsageExample(recipe: ThemeRecipe): string {
    return `
// 使用主题配方
import { ThemeProvider } from '@xorigo-ui/core'

function App() {
  return (
    <ThemeProvider recipe="${recipe.id}">
      <YourAppComponents />
    </ThemeProvider>
  )
}
`
  }

  private notifyPreviewUpdate(recipe: ThemeRecipe): void {
    this.workbenchWebSocket.emit('theme-updated', {
      recipe,
      timestamp: Date.now()
    })
  }

  private async recordThemeUsage(recipeId: string): Promise<void> {
    try {
      await fetch('/api/recipes/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId, action: 'apply' })
      })
    } catch (error) {
      console.error('Failed to record theme usage:', error)
    }
  }
}
```

### 组件预览系统

```typescript
// apps/website/src/components/workbench/preview/component-preview.tsx
import React, { useState, useEffect, useRef } from 'react'
import { ErrorBoundary } from '../error-boundary'
import { ThemeBridge } from '../integration/theme-bridge'

interface ComponentPreviewProps {
  componentCode: string
  componentName: string
  themeBridge: ThemeBridge
  onComponentError: (error: Error) => void
}

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({
  componentCode,
  componentName,
  themeBridge,
  onComponentError
}) => {
  const [PreviewComponent, setPreviewComponent] = useState<React.ComponentType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    renderComponent()
  }, [componentCode, componentName])

  const renderComponent = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. 转换代码为组件
      const Component = await compileComponent(componentCode, componentName)

      // 2. 设置组件
      setPreviewComponent(() => Component)

      // 3. 更新iframe内容
      if (iframeRef.current) {
        await updateIframeContent(Component)
      }

    } catch (err) {
      const error = err as Error
      setError(error)
      onComponentError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const compileComponent = async (code: string, name: string): Promise<React.ComponentType> => {
    // 1. 使用Babel转换代码
    const transformedCode = await transformCode(code)

    // 2. 动态创建组件模块
    const module = new Function('React', 'require', transformedCode)

    // 3. 执行并获取组件
    const exports = {}
    module(React, createRequire())

    return exports.default || exports[name]
  }

  const updateIframeContent = async (Component: React.ComponentType) => {
    if (!iframeRef.current) return

    const iframe = iframeRef.current
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document

    if (!iframeDocument) return

    // 注入HTML内容
    iframeDocument.open()
    iframeDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            #root {
              min-height: 100vh;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script>
            // 注入主题CSS变量
            const root = document.documentElement;
            const parentRoot = window.parent.document.documentElement;

            // 复制CSS变量
            for (let i = 0; i < parentRoot.style.length; i++) {
              const property = parentRoot.style[i];
              root.style.setProperty(property, parentRoot.style.getPropertyValue(property));
            }
          </script>
        </body>
      </html>
    `)

    // 渲染React组件到iframe
    const { createRoot } = await import('react-dom/client')
    const root = createRoot(iframeDocument.getElementById('root')!)

    root.render(
      <ErrorBoundary onError={onComponentError}>
        <Component />
      </ErrorBoundary>
    )

    iframeDocument.close()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在渲染组件...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-96 bg-red-50 rounded-lg p-6 overflow-auto">
        <h3 className="text-red-800 font-semibold mb-2">组件渲染错误</h3>
        <pre className="text-red-600 text-sm bg-red-100 p-4 rounded">
          {error.stack || error.message}
        </pre>
      </div>
    )
  }

  return (
    <div className="component-preview">
      <div className="preview-header flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">{componentName}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={renderComponent}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            刷新
          </button>
          <button
            onClick={() => openPreviewInNewTab()}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            新窗口打开
          </button>
        </div>
      </div>

      <iframe
        ref={iframeRef}
        className="w-full h-96 border-0"
        sandbox="allow-scripts allow-same-origin"
        title={`${componentName} Preview`}
      />
    </div>
  )
}

// 错误边界组件
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError(error)
    console.error('Component preview error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="text-red-800 font-semibold">组件预览错误</h3>
          <p className="text-red-600 text-sm mt-2">
            {this.state.error?.message}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

## 🤖 AI助手集成

### AI代码生成器

```typescript
// apps/website/src/components/workbench/ai/ai-code-generator.ts
export class AICodeGenerator {
  private provider: AIProvider
  private contextManager: AIContextManager

  constructor(config: AIConfig) {
    this.provider = this.createProvider(config)
    this.contextManager = new AIContextManager()
  }

  // 生成组件代码
  async generateComponent(prompt: string, context?: GenerationContext): Promise<string> {
    try {
      // 1. 构建完整提示
      const fullPrompt = await this.buildComponentPrompt(prompt, context)

      // 2. 发送到AI服务
      const response = await this.provider.generate(fullPrompt, {
        maxTokens: 2000,
        temperature: 0.7,
        stop: ['```']
      })

      // 3. 解析和清理代码
      const code = this.extractCode(response)

      // 4. 验证生成的代码
      await this.validateGeneratedCode(code)

      return code
    } catch (error) {
      console.error('Failed to generate component:', error)
      throw new Error(`AI生成失败: ${error.message}`)
    }
  }

  // 生成主题配方
  async generateThemeRecipe(description: string, preferences?: ThemePreferences): Promise<ThemeAxis> {
    try {
      const prompt = `
基于以下描述生成七轴主题配置：

描述: ${description}

用户偏好:
${preferences ? JSON.stringify(preferences, null, 2) : '无特定偏好'}

请生成符合七轴主题系统的配置，包含所有必需字段：
- mode: light/dark/auto
- hue: 颜色基调
- saturation: 饱和度 (0-1)
- lightness: 亮度 (0-1)
- density: 密度等级
- roundness: 圆度 (0-1)
- contrast: 对比度等级

返回JSON格式的配置。
`

      const response = await this.provider.generate(prompt, {
        maxTokens: 500,
        temperature: 0.8
      })

      const config = this.extractJSON(response)
      return this.validateThemeAxis(config)
    } catch (error) {
      console.error('Failed to generate theme recipe:', error)
      throw new Error(`主题生成失败: ${error.message}`)
    }
  }

  // 优化现有组件
  async optimizeComponent(code: string, optimizationType: OptimizationType): Promise<string> {
    const prompts = {
      performance: '优化这个React组件的性能，减少不必要的重渲染',
      accessibility: '改进这个组件的可访问性，添加ARIA标签和键盘支持',
      typescript: '将这个组件转换为TypeScript，添加完整的类型定义',
      responsive: '使这个组件响应式，适配移动端和桌面端'
    }

    const prompt = `
${prompts[optimizationType]}

原代码:
\`\`\`tsx
${code}
\`\`\`

请返回优化后的完整代码。
`

    const response = await this.provider.generate(prompt, {
      maxTokens: 3000,
      temperature: 0.3
    })

    return this.extractCode(response)
  }

  // 生成组件测试
  async generateTests(componentCode: string, componentName: string): Promise<string> {
    const prompt = `
为以下React组件生成完整的单元测试（使用Vitest和Testing Library）:

组件名称: ${componentName}

组件代码:
\`\`\`tsx
${componentCode}
\`\`\`

请生成包含以下测试的完整测试文件：
1. 组件正确渲染
2. Props正确传递
3. 事件处理正确
4. 可访问性测试
5. 错误边界测试

返回完整的.tsx测试文件内容。
`

    const response = await this.provider.generate(prompt, {
      maxTokens: 2000,
      temperature: 0.2
    })

    return this.extractCode(response)
  }

  private async buildComponentPrompt(
    userPrompt: string,
    context?: GenerationContext
  ): Promise<string> {
    let prompt = `
你是一个专业的React组件开发专家，使用Xorigo UI组件库。请根据要求生成高质量、可访问的React组件。

Xorigo UI组件库可用组件:
${this.getAvailableComponents()}

组件开发规范:
- 使用TypeScript
- 遵循Atomic Design原则
- 包含完整的Props类型定义
- 添加JSDoc注释
- 考虑可访问性（ARIA标签、键盘导航）
- 使用CSS-in-JS或Tailwind CSS
- 包含错误处理
`

    if (context) {
      prompt += `
当前上下文:
- 当前主题: ${context.currentTheme}
- 相关组件: ${context.relatedComponents?.join(', ') || '无'}
- 使用场景: ${context.useCase || '通用'}
`
    }

    prompt += `
用户需求:
${userPrompt}

请生成完整的React TypeScript组件代码，包括:
1. 组件实现
2. Props接口定义
3. 默认导出
4. 必要的样式

只返回代码，不要额外的解释。
`

    return prompt
  }

  private getAvailableComponents(): string {
    // 从组件注册表获取可用组件
    const componentRegistry = getComponentRegistry()
    const components = Array.from(componentRegistry.getComponents().values())

    return components.map(comp =>
      `- ${comp.name}: ${comp.description}`
    ).join('\n')
  }

  private extractCode(response: string): string {
    // 提取代码块
    const codeBlockMatch = response.match(/```(?:tsx?|jsx?)\n([\s\S]*?)\n```/)
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim()
    }

    // 如果没有代码块，返回原始响应
    return response.trim()
  }

  private extractJSON(response: string): any {
    const jsonMatch = response.match(/```(?:json)?\n([\s\S]*?)\n```/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1])
      } catch (error) {
        throw new Error('无法解析JSON响应')
      }
    }

    throw new Error('响应中没有找到有效的JSON')
  }

  private async validateGeneratedCode(code: string): Promise<void> {
    // 1. TypeScript语法检查
    const syntaxValid = await this.checkTypeScriptSyntax(code)
    if (!syntaxValid) {
      throw new Error('生成的代码包含TypeScript语法错误')
    }

    // 2. 导入检查
    const importsValid = await this.checkImports(code)
    if (!importsValid) {
      throw new Error('生成的代码包含无效的导入')
    }

    // 3. 组件结构检查
    const structureValid = await this.checkComponentStructure(code)
    if (!structureValid) {
      throw new Error('生成的代码不符合React组件结构')
    }
  }

  private validateThemeAxis(config: any): ThemeAxis {
    const required = ['mode', 'hue', 'saturation', 'lightness', 'density', 'roundness', 'contrast']

    for (const field of required) {
      if (!(field in config)) {
        throw new Error(`主题配置缺少必需字段: ${field}`)
      }
    }

    // 类型验证
    if (typeof config.saturation !== 'number' || config.saturation < 0 || config.saturation > 1) {
      throw new Error('saturation必须是0-1之间的数字')
    }

    if (typeof config.lightness !== 'number' || config.lightness < 0 || config.lightness > 1) {
      throw new Error('lightness必须是0-1之间的数字')
    }

    return config as ThemeAxis
  }
}
```

### AI助手UI组件

```typescript
// apps/website/src/components/workbench/ai/ai-assistant.tsx
import React, { useState, useRef } from 'react'
import { AICodeGenerator } from './ai-code-generator'
import { WorkbenchEditor } from '../editor/workbench-editor'

interface AIAssistantProps {
  editor: WorkbenchEditor
  onCodeGenerated: (code: string) => void
  onThemeGenerated: (theme: ThemeAxis) => void
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  editor,
  onCodeGenerated,
  onThemeGenerated
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [activeTab, setActiveTab] = useState<'code' | 'theme' | 'optimize'>('code')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const aiGenerator = new AICodeGenerator({
    provider: 'openai',
    model: 'gpt-4',
    maxTokens: 2000
  })

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date()
    }

    setChatHistory(prev => [...prev, userMessage])

    try {
      let response: string

      switch (activeTab) {
        case 'code':
          response = await aiGenerator.generateComponent(prompt, {
            currentTheme: getCurrentTheme(),
            useCase: 'general'
          })
          onCodeGenerated(response)
          break

        case 'theme':
          const themeAxis = await aiGenerator.generateThemeRecipe(prompt)
          onThemeGenerated(themeAxis)
          response = `已生成主题配方: ${JSON.stringify(themeAxis, null, 2)}`
          break

        case 'optimize':
          const currentCode = editor.getValue()
          response = await aiGenerator.optimizeComponent(currentCode, 'performance')
          onCodeGenerated(response)
          break

        default:
          throw new Error('未知的生成类型')
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setChatHistory(prev => [...prev, assistantMessage])
      setPrompt('')

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `生成失败: ${error.message}`,
        timestamp: new Date(),
        isError: true
      }

      setChatHistory(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestion = (suggestion: string) => {
    setPrompt(suggestion)
  }

  const suggestions = {
    code: [
      '创建一个带图标的按钮组件',
      '生成一个响应式的数据表格',
      '创建一个模态对话框组件',
      '生成一个加载状态组件'
    ],
    theme: [
      '创建一个深蓝色的专业主题',
      '生成一个温暖的橙色主题',
      '创建一个高对比度的可访问主题',
      '生成一个极简主义主题'
    ],
    optimize: [
      '优化当前组件的性能',
      '改进可访问性',
      '添加TypeScript类型',
      '使组件响应式'
    ]
  }

  return (
    <div className={`ai-assistant ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="ai-header">
        <h3>AI 助手</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="expand-button"
        >
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {isExpanded && (
        <div className="ai-content">
          <div className="ai-tabs">
            <button
              className={`tab ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              代码生成
            </button>
            <button
              className={`tab ${activeTab === 'theme' ? 'active' : ''}`}
              onClick={() => setActiveTab('theme')}
            >
              主题生成
            </button>
            <button
              className={`tab ${activeTab === 'optimize' ? 'active' : ''}`}
              onClick={() => setActiveTab('optimize')}
            >
              代码优化
            </button>
          </div>

          <div className="ai-suggestions">
            <div className="suggestions-label">快速提示:</div>
            <div className="suggestions-list">
              {suggestions[activeTab].map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-button"
                  onClick={() => handleSuggestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="ai-chat">
            <div className="chat-messages">
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.role} ${message.isError ? 'error' : ''}`}
                >
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message assistant loading">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="ai-input">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={getPlaceholder(activeTab)}
                className="prompt-input"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleGenerate()
                  }
                }}
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isLoading}
                className="generate-button"
              >
                {isLoading ? '生成中...' : '生成'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getPlaceholder(tab: string): string {
  switch (tab) {
    case 'code':
      return '描述你想要生成的组件...'
    case 'theme':
      return '描述你想要的主题风格...'
    case 'optimize':
      return '描述优化需求...'
    default:
      return '输入你的需求...'
  }
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isError?: boolean
}
```

---

## 📋 实施清单

### Phase 1: 基础集成 (3周)

- [ ] **组件注册系统**
  - [ ] 组件扫描和注册
  - [ ] 动态导入机制
  - [ ] 热重载支持
  - [ ] 类型信息提取

- [ ] **Monaco Editor集成**
  - [ ] TypeScript语言支持
  - [ ] 自动补全功能
  - [ ] 智能提示
  - [ ] 错误检查

- [ ] **基础预览系统**
  - [ ] 组件渲染引擎
  - [ ] 错误边界处理
  - [ ] 预览更新机制
  - [ ] 性能优化

### Phase 2: 主题和AI集成 (3周)

- [ ] **主题桥接系统**
  - [ ] 配方应用逻辑
  - [ ] CSS变量管理
  - [ ] 实时预览功能
  - [ ] 主题导出

- [ ] **AI助手**
  - [ ] 代码生成引擎
  - [ ] 主题生成功能
  - [ ] 代码优化建议
  - [ ] 聊天界面

- [ ] **协作功能**
  - [ ] 实时协作支持
  - [ ] 多用户编辑
  - [ ] 冲突解决
  - [ ] 版本控制

### Phase 3: 优化和扩展 (2周)

- [ ] **性能优化**
  - [ ] 组件懒加载
  - [ ] 预览缓存
  - [ ] 内存管理
  - [ ] 渲染优化

- [ ] **用户体验**
  - [ ] 响应式设计
  - [ ] 快捷键支持
  - [ ] 拖拽功能
  - [ ] 个性化设置

- [ ] **监控和调试**
  - [ ] 性能监控
  - [ ] 错误追踪
  - [ ] 使用统计
  - [ ] 调试工具

---

**文档版本**: v2.0
**最后更新**: 2025-10-31
**下次审查**: 2025-12-01
**状态**: ✅ 集成架构设计完成，准备实施