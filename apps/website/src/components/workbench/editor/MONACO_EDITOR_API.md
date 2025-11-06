# Monaco Editor 集成 API 文档

## 概述

Workbench 2.0 集成了完整的 Monaco Editor，为开发者提供强大的代码编辑功能。本文档详细介绍了所有可用的组件、配置选项和使用方法。

## 目录结构

```
editor/
├── enhanced-monaco-editor.tsx      # 增强版 Monaco 编辑器
├── monaco-theme-adapter.tsx        # 七轴主题适配器
├── lazy-monaco-editor.tsx          # 懒加载包装器
├── monaco-editor-wrapper.tsx       # 完整包装器
└── __tests__/                      # 测试文件
    ├── enhanced-monaco-editor.test.tsx
    ├── monaco-theme-adapter.test.tsx
    └── lazy-monaco-editor.test.tsx
```

## 核心组件

### 1. EnhancedMonacoEditor

完整的 Monaco 编辑器组件，提供所有 Monaco 功能。

#### 属性

```typescript
interface EnhancedMonacoEditorProps {
  /** 初始代码值 */
  value?: string

  /** 编辑器配置 */
  config?: Partial<EnhancedEditorConfig>

  /** 事件处理 */
  events?: EditorEvents

  /** 代码片段 */
  snippets?: CodeSnippet[]

  /** 只读模式 */
  readOnly?: boolean

  /** 高度 */
  height?: string | number

  /** 类名 */
  className?: string

  /** 加载指示器 */
  loading?: React.ReactNode
}
```

#### 配置选项 (EnhancedEditorConfig)

```typescript
interface EnhancedEditorConfig {
  /** 语言模式 */
  language: 'typescript' | 'javascript' | 'tsx' | 'jsx' | 'css' | 'json' | 'html' | 'markdown'

  /** 主题 */
  theme: 'vs-light' | 'vs-dark' | 'hc-black' | 'custom'

  /** 字体大小 */
  fontSize: number

  /** 制表符大小 */
  tabSize: number

  /** 行号显示 */
  lineNumbers: 'on' | 'off' | 'relative' | 'interval'

  /** 自动换行 */
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded'

  /** 小地图 */
  minimap: { enabled: boolean }

  /** 代码折叠 */
  folding: boolean

  /** 自动闭合括号 */
  autoCloseBrackets: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never'

  /** 自动缩进 */
  autoIndent: 'none' | 'keep' | 'brackets' | 'advanced' | 'full'

  /** 格式化设置 */
  formatOnPaste: boolean
  formatOnType: boolean

  /** 建议设置 */
  suggest: {
    enabled: boolean
    showMethods: boolean
    showProperties: boolean
    showVariables: boolean
    showFunctions: boolean
    // ... 更多选项
  }

  /** 快速建议 */
  quickSuggestions: boolean | { other: boolean; comments: boolean; strings: boolean }

  /** 参数提示 */
  parameterHints: { enabled: boolean }

  /** 括号配对高亮 */
  bracketPairColorization: { enabled: boolean }

  /** 指南线 */
  guides: {
    bracketPairs: boolean
    bracketPairsHorizontal: boolean
    highlightActiveBracketPair: boolean
    indentation: boolean
  }

  /** 滚动条设置 */
  scrollbar: {
    vertical: 'visible' | 'hidden' | 'auto'
    horizontal: 'visible' | 'hidden' | 'auto'
    useShadows: boolean
    verticalScrollbarSize: number
    horizontalScrollbarSize: number
  }

  /** 光标设置 */
  cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid'
  cursorSmoothCaretAnimation: boolean | 'on'

  /** 平滑滚动 */
  smoothScrolling: boolean

  /** 鼠标滚轮缩放 */
  mouseWheelZoom: boolean

  /** 多选设置 */
  multiCursorModifier: 'ctrlCmd' | 'alt'

  /** 选择高亮 */
  selectionHighlight: boolean

  /** 概念高亮 */
  occurrencesHighlight: boolean

  /** 代码片段高亮 */
  codeLens: boolean

  /** 颜色选择器 */
  colorDecorators: boolean

  /** 灯泡提示 */
  lightbulb: { enabled: boolean }

  /** 显示折叠控制 */
  showFoldingControls: 'always' | 'mouseover' | 'never'

  /** 装饰渲染 */
  renderDecorations: 'all' | 'off' | 'gutter'
}
```

#### 事件 (EditorEvents)

```typescript
interface EditorEvents {
  /** 内容变化 */
  onChange?: (value: string) => void

  /** 保存 */
  onSave?: (value: string) => void

  /** 格式化 */
  onFormat?: () => void

  /** 验证 */
  onValidate?: (validation: CodeValidation) => void

  /** 光标位置变化 */
  onCursorPositionChange?: (position: { line: number; column: number }) => void

  /** 选择变化 */
  onSelectionChange?: (selection: editor.ISelection) => void

  /** 错误 */
  onError?: (error: Error) => void
}
```

#### 使用示例

```tsx
import { EnhancedMonacoEditor } from './enhanced-monaco-editor'

function MyEditor() {
  return (
    <EnhancedMonacoEditor
      value={`// 欢迎使用 Monaco Editor
import React from 'react'

export function MyComponent() {
  return <div>Hello World</div>
}`}
      config={{
        language: 'tsx',
        theme: 'vs-dark',
        fontSize: 14,
        minimap: { enabled: true },
        folding: true,
        bracketPairColorization: { enabled: true },
        suggest: {
          enabled: true,
          showSnippets: true
        }
      }}
      events={{
        onChange: (code) => console.log('Code changed:', code),
        onSave: (code) => console.log('Code saved:', code),
        onValidate: (validation) => console.log('Validation:', validation)
      }}
    />
  )
}
```

### 2. MonacoThemeAdapter

七轴主题系统适配器，将 Xorigo UI 主题转换为 Monaco 主题。

#### 属性

```typescript
interface MonacoThemeAdapterProps {
  /** 七轴主题配置 */
  theme: SevenAxisTheme

  /** Monaco 实例 */
  monaco: typeof monaco | null

  /** 编辑器实例 */
  editor: editor.IStandaloneCodeEditor | null

  /** 自动应用主题 */
  autoApply?: boolean
}
```

#### 七轴主题 (SevenAxisTheme)

```typescript
interface SevenAxisTheme {
  /** 模式轴 - light/dark/auto */
  mode: 'light' | 'dark' | 'auto'

  /** 色调轴 - 色相选择 */
  hue: string

  /** 饱和度轴 - 0-1 */
  saturation: number

  /** 亮度轴 - 0-1 */
  lightness: number

  /** 密度轴 - compact/comfortable/spacious */
  density: 'compact' | 'comfortable' | 'spacious'

  /** 圆度轴 - 0-1 */
  roundness: number

  /** 对比度轴 - low/normal/high */
  contrast: 'low' | 'normal' | 'high'

  /** 自定义颜色覆盖 */
  customColors?: Record<string, string>
}
```

#### 使用示例

```tsx
import { MonacoThemeAdapter } from './monaco-theme-adapter'

function MyEditorWithTheme() {
  const theme = {
    mode: 'dark',
    hue: '#3b82f6',
    saturation: 0.8,
    lightness: 0.6,
    density: 'comfortable',
    roundness: 0.5,
    contrast: 'normal'
  }

  return (
    <>
      <EnhancedMonacoEditor {...editorProps} />
      <MonacoThemeAdapter
        theme={theme}
        monaco={monacoInstance}
        editor={editorInstance}
      />
    </>
  )
}
```

### 3. LazyMonacoEditor

懒加载版本的 Monaco 编辑器，优化性能。

#### 属性

```typescript
interface LazyMonacoEditorProps {
  /** 所有 EnhancedMonacoEditor 的属性 */
  [key: string]: any
}
```

#### 使用示例

```tsx
import LazyMonacoEditor from './lazy-monaco-editor'

function MyLazyEditor() {
  return (
    <LazyMonacoEditor
      value="// 懒加载的 Monaco 编辑器"
      config={{ language: 'typescript' }}
      height={600}
    />
  )
}
```

### 4. MonacoEditorWrapper

完整的编辑器包装器，集成所有功能。

#### 属性

```typescript
interface MonacoEditorWrapperProps {
  /** 初始代码 */
  initialCode?: string

  /** 初始语言 */
  initialLanguage?: 'typescript' | 'javascript' | 'tsx' | 'jsx' | 'css' | 'json'

  /** 配置 */
  config?: Partial<EnhancedEditorConfig>

  /** 高度 */
  height?: string | number

  /** 只读模式 */
  readOnly?: boolean

  /** 显示完整界面 */
  showFullInterface?: boolean

  /** 启用实时验证 */
  enableValidation?: boolean

  /** 启用主题适配 */
  enableThemeAdapter?: boolean

  /** 自定义主题 */
  customTheme?: SevenAxisTheme

  /** 变化回调 */
  onChange?: (code: string) => void

  /** 保存回调 */
  onSave?: (code: string) => void

  /** 错误回调 */
  onError?: (error: Error) => void

  /** 类名 */
  className?: string
}
```

#### 使用示例

```tsx
import MonacoEditorWrapper from './monaco-editor-wrapper'

function MyCompleteEditor() {
  return (
    <MonacoEditorWrapper
      initialCode={welcomeCode}
      initialLanguage="tsx"
      height={700}
      showFullInterface={true}
      enableValidation={true}
      enableThemeAdapter={true}
      onChange={(code) => setCode(code)}
      onSave={(code) => saveCode(code)}
      config={{
        fontSize: 14,
        minimap: { enabled: true },
        folding: true,
        formatOnPaste: true,
        formatOnType: true
      }}
    />
  )
}
```

## 性能优化

### 1. 懒加载

使用 `LazyMonacoEditor` 实现按需加载：

```tsx
// 自动懒加载
<LazyMonacoEditor value="..." />

// 手动预加载
const { preload } = usePreloadMonaco()
preload()
```

### 2. 性能监控

使用性能监控 Hook：

```tsx
import { useMonacoPerformance } from './lazy-monaco-editor'

function MyEditor() {
  const { metrics, measureLoad } = useMonacoPerformance()

  const handleLoad = () => {
    measureLoad('editor-load', async () => {
      // 编辑器加载逻辑
    })
  }

  return (
    <>
      <div>加载时间: {metrics.loadTime}ms</div>
      <LazyMonacoEditor {...props} />
    </>
  )
}
```

### 3. 内存管理

```tsx
import { useMonacoCleanup } from './lazy-monaco-editor'

function MyComponent() {
  const { cleanup } = useMonacoCleanup()

  useEffect(() => {
    return () => {
      cleanup() // 组件卸载时清理
    }
  }, [])
}
```

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+S` | 保存代码 |
| `Ctrl+Shift+F` | 格式化代码 |
| `Ctrl+Shift+M` | 切换小地图 |
| `Alt+Z` | 切换自动换行 |
| `F12` | 跳转到定义 |
| `Ctrl+/` | 切换注释 |
| `Ctrl+D` | 选中最单词 |
| `Ctrl+F` | 查找 |
| `Ctrl+H` | 替换 |
| `Ctrl+G` | 跳转到行 |
| `Ctrl+Shift+P` | 命令面板 |

## 代码片段

内置的 Xorigo UI 代码片段：

1. **Button Component** - 完整的 Button 组件
2. **Card Component** - Card 容器组件
3. **Input Field** - 带标签的输入框
4. **useState Hook** - React useState 示例
5. **useEffect Hook** - React useEffect 示例
6. **Async Function** - 异步函数模板
7. **TypeScript Interface** - TypeScript 接口定义
8. **Styled Component** - 样式化组件

## 主题系统

### 自定义主题

```typescript
const customTheme: SevenAxisTheme = {
  mode: 'dark',
  hue: '#8b5cf6',
  saturation: 0.7,
  lightness: 0.4,
  density: 'compact',
  roundness: 0.3,
  contrast: 'high',
  customColors: {
    'comment': '#666666',
    'string': '#00ff00',
    'keyword': '#ff0000'
  }
}
```

### 预设主题

```typescript
// 现代蓝主题
const modernBlue = {
  mode: 'light' as const,
  hue: '#3b82f6' as string,
  saturation: 0.8,
  lightness: 0.6,
  density: 'comfortable' as const,
  roundness: 0.5,
  contrast: 'normal' as const
}

// 优雅深色主题
const darkElegant = {
  mode: 'dark' as const,
  hue: '#8b5cf6' as string,
  saturation: 0.7,
  lightness: 0.4,
  density: 'compact' as const,
  roundness: 0.3,
  contrast: 'high' as const
}
```

## 错误处理

### 错误边界

编辑器内置错误边界，自动捕获和处理错误：

```tsx
// 自定义错误处理
<EnhancedMonacoEditor
  events={{
    onError: (error) => {
      console.error('编辑器错误:', error)
      // 发送错误报告
    }
  }}
/>
```

### 验证结果

```typescript
interface CodeValidation {
  isValid: boolean
  errors: {
    line: number
    column: number
    message: string
    severity: 'error' | 'warning' | 'info' | 'hint'
  }[]
  warnings: Array<{
    line: number
    column: number
    message: string
    severity: 'error' | 'warning' | 'info' | 'hint'
  }>
  infos: Array<{
    line: number
    column: number
    message: string
    severity: 'error' | 'warning' | 'info' | 'hint'
  }>
  hints: Array<{
    line: number
    column: number
    message: string
    severity: 'error' | 'warning' | 'info' | 'hint'
  }>
}
```

## 最佳实践

### 1. 性能优化

- 使用 `LazyMonacoEditor` 进行懒加载
- 预加载编辑器资源
- 合理设置编辑高度
- 使用合适的语言模式

### 2. 主题适配

- 使用 `MonacoThemeAdapter` 集成七轴主题
- 根据用户偏好自动切换主题
- 自定义颜色以匹配品牌风格

### 3. 用户体验

- 启用实时验证
- 提供代码片段
- 设置合适的字体大小
- 启用智能补全

### 4. 错误处理

- 使用错误边界
- 提供友好的错误提示
- 记录错误日志

## 故障排除

### 常见问题

1. **编辑器加载缓慢**
   - 检查网络连接
   - 确认懒加载配置
   - 预加载资源

2. **主题不生效**
   - 检查主题适配器配置
   - 确认 Monaco 实例正确传递
   - 验证七轴主题配置

3. **智能补全不工作**
   - 检查语言模式设置
   - 确认 TypeScript 配置
   - 验证类型定义

4. **性能问题**
   - 减少编辑器高度
   - 禁用不必要的功能
   - 清理未使用的模型

## 版本信息

- **Monaco Editor**: 0.45+
- **React**: 19.2.0+
- **TypeScript**: 5.9.3+
- **Last Updated**: 2025-11-05

## 支持

如有问题或建议，请联系开发团队。
