/**
 * Workbench Monaco Editor 集成
 * 提供智能代码编辑、自动补全、语法检查等功能
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { editor } from 'monaco-editor'
import { useWorkbench } from '../workbench-types'

/**
 * Monaco Editor 配置
 */
export interface MonacoEditorConfig {
  /** 语言模式 */
  language?: 'typescript' | 'javascript' | 'tsx' | 'jsx' | 'css' | 'json'
  /** 主题 */
  theme?: 'vs-light' | 'vs-dark' | 'hc-black'
  /** 是否只读 */
  readOnly?: boolean
  /** 字体大小 */
  fontSize?: number
  /** 制表符大小 */
  tabSize?: number
  /** 是否显示行号 */
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval'
  /** 是否自动换行 */
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  /** 最小高度 */
  minHeight?: number
  /** 最大高度 */
  maxHeight?: number
  /** 是否启用代码补全 */
  suggestOnTriggerCharacters?: boolean
  /** 是否启用代码检查 */
  diagnostics?: boolean
  /** 自定义快捷键 */
  keybindings?: Array<{
    key: string
    action: string
  }>
}

/**
 * 代码补全项
 */
interface CompletionItem {
  label: string
  kind: string
  insertText: string
  detail?: string
  documentation?: string
}

/**
 * 诊断信息
 */
interface Diagnostic {
  severity: 'error' | 'warning' | 'info' | 'hint'
  message: string
  startLineNumber: number
  startColumn: number
  endLineNumber: number
  endColumn: number
}

/**
 * 编辑器事件
 */
export interface EditorEvents {
  /** 内容变化 */
  onChange?: (value: string) => void
  /** 光标位置变化 */
  onCursorPositionChange?: (position: { line: number; column: number }) => void
  /** 保存 */
  onSave?: (value: string) => void
  /** 格式化 */
  onFormat?: () => void
  /** 错误 */
  onError?: (error: string) => void
}

/**
 * Monaco Editor 组件属性
 */
export interface WorkbenchMonacoEditorProps {
  /** 初始值 */
  value?: string
  /** 配置 */
  config?: MonacoEditorConfig
  /** 事件处理 */
  events?: EditorEvents
  /** 组件补全数据 */
  completions?: CompletionItem[]
  /** 预设模板 */
  templates?: Array<{
    name: string
    description: string
    content: string
  }>
  /** 是否显示工具栏 */
  showToolbar?: boolean
  /** CSS类名 */
  className?: string
}

/**
 * 组件代码补全提供器
 */
class ComponentCompletionProvider {
  private components: Map<string, any> = new Map()

  /**
   * 注册组件
   */
  registerComponent(name: string, component: any) {
    this.components.set(name, component)
  }

  /**
   * 获取补全项
   */
  getCompletions(): CompletionItem[] {
    const completions: CompletionItem[] = []

    // 基础React补全
    completions.push(
      {
        label: 'useState',
        kind: 'Function',
        insertText: 'const [${1:state}, set${1:state}] = useState<${2:type}>(${3:initialValue})',
        detail: 'React useState Hook',
        documentation: '声明状态变量'
      },
      {
        label: 'useEffect',
        kind: 'Function',
        insertText: 'useEffect(() => {\n  ${1:// effect code}\n}, [${2:dependencies}])',
        detail: 'React useEffect Hook',
        documentation: '处理副作用'
      },
      {
        label: 'useCallback',
        kind: 'Function',
        insertText: 'const ${1:callback} = useCallback((${2:params}) => {\n  ${3:// callback code}\n}, [${4:dependencies}])',
        detail: 'React useCallback Hook',
        documentation: '缓存回调函数'
      },
      {
        label: 'useMemo',
        kind: 'Function',
        insertText: 'const ${1:memoizedValue} = useMemo(() => {\n  ${2:// expensive calculation}\n  return ${3:result}\n}, [${4:dependencies}])',
        detail: 'React useMemo Hook',
        documentation: '缓存计算结果'
      }
    )

    // Xorigo UI 组件补全
    const xorigoComponents = [
      {
        name: 'Button',
        props: ['variant', 'size', 'disabled', 'onClick', 'children'],
        imports: '@xorigo-ui/core'
      },
      {
        name: 'Card',
        props: ['className', 'children'],
        imports: '@xorigo-ui/core'
      },
      {
        name: 'CardContent',
        props: ['className', 'children'],
        imports: '@xorigo-ui/core'
      },
      {
        name: 'CardHeader',
        props: ['className', 'children'],
        imports: '@xorigo-ui/core'
      },
      {
        name: 'Badge',
        props: ['variant', 'className', 'children'],
        imports: '@xorigo-ui/core'
      },
      {
        name: 'Input',
        props: ['type', 'placeholder', 'value', 'onChange', 'disabled'],
        imports: '@xorigo-ui/core'
      }
    ]

    xorigoComponents.forEach(comp => {
      completions.push({
        label: comp.name,
        kind: 'Class',
        insertText: `<${comp.name} ${comp.props.map(prop => `${prop}={$\{1:\}}`).join(' ')}>\n  \${2:children}\n</${comp.name}>`,
        detail: `Xorigo UI ${comp.name} Component`,
        documentation: `${comp.name}组件，来自 ${comp.imports}`
      })
    })

    return completions
  }
}

/**
 * TypeScript 诊断提供器
 */
class TypeDiagnosticsProvider {
  /**
   * 检查代码错误
   */
  async checkCode(code: string): Promise<Diagnostic[]> {
    const diagnostics: Diagnostic[] = []

    try {
      // 基础语法检查
      const lines = code.split('\n')

      lines.forEach((line, index) => {
        const lineNumber = index + 1

        // 检查未闭合的标签
        const openTags = (line.match(/<\w+[^>]*>/g) || []).length
        const closeTags = (line.match(/<\/\w+>/g) || []).length
        const selfClosingTags = (line.match(/<\w+[^>]*\/>/g) || []).length

        if (openTags > closeTags + selfClosingTags) {
          diagnostics.push({
            severity: 'warning',
            message: '可能有未闭合的标签',
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: line.length + 1
          })
        }

        // 检查常见的语法错误
        if (line.includes('import') && !line.includes('from')) {
          diagnostics.push({
            severity: 'error',
            message: 'import语句缺少from关键字',
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: line.length + 1
          })
        }

        // 检查括号匹配
        const openBrackets = (line.match(/\(/g) || []).length
        const closeBrackets = (line.match(/\)/g) || []).length
        const openBraces = (line.match(/{/g) || []).length
        const closeBraces = (line.match(/}/g) || []).length

        if (openBrackets !== closeBrackets) {
          diagnostics.push({
            severity: 'error',
            message: '括号不匹配',
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: line.length + 1
          })
        }

        if (openBraces !== closeBraces) {
          diagnostics.push({
            severity: 'error',
            message: '大括号不匹配',
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: line.length + 1
          })
        }
      })

    } catch (error) {
      console.error('Diagnostics check failed:', error)
    }

    return diagnostics
  }
}

/**
 * 全局补全提供器
 */
const completionProvider = new ComponentCompletionProvider()
const diagnosticsProvider = new TypeDiagnosticsProvider()

/**
 * Workbench Monaco Editor 组件
 */
export function WorkbenchMonacoEditor({
  value = '',
  config = {},
  events = {},
  completions = [],
  templates = [],
  showToolbar = true,
  className = '',
}: WorkbenchMonacoEditorProps) {
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const monacoRef = useRef<any>(null)
  const { activeTheme } = useWorkbench()

  // 默认配置
  const defaultConfig: MonacoEditorConfig = {
    language: 'typescript',
    theme: activeTheme === 'dark' ? 'vs-dark' : 'vs-light',
    readOnly: false,
    fontSize: 14,
    tabSize: 2,
    lineNumbers: 'on',
    wordWrap: 'on',
    suggestOnTriggerCharacters: true,
    diagnostics: true,
    ...config
  }

  /**
   * 初始化Monaco Editor
   */
  const initializeEditor = useCallback(async () => {
    if (!containerRef.current || monacoRef.current) return

    try {
      // 动态导入Monaco Editor
      const monaco = await import('monaco-editor')
      monacoRef.current = monaco

      // 注册TypeScript
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types']
      })

      // 注册React类型定义
      monaco.languages.typescript.typescriptDefaults.addExtraLib(`
        declare module 'react' {
          export interface ReactElement<P = any> { }
          export interface ComponentType<P = {}> { }
          export function useState<T>(initial: T): [T, (value: T) => void]
          export function useEffect(effect: () => void, deps?: any[]): void
          export function useCallback<T extends Function>(callback: T, deps: any[]): T
          export function useMemo<T>(factory: () => T, deps: any[]): T
        }
      `, 'file:///node_modules/@types/react/index.d.ts')

      // 创建编辑器实例
      const editorInstance = monaco.editor.create(containerRef.current, {
        value,
        language: defaultConfig.language,
        theme: defaultConfig.theme,
        readOnly: defaultConfig.readOnly,
        fontSize: defaultConfig.fontSize,
        tabSize: defaultConfig.tabSize,
        lineNumbers: defaultConfig.lineNumbers,
        wordWrap: defaultConfig.wordWrap,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        renderLineHighlight: 'line',
        suggestOnTriggerCharacters: defaultConfig.suggestOnTriggerCharacters,
        quickSuggestions: true,
        parameterHints: { enabled: true },
        folding: true,
        foldingStrategy: 'indentation',
        showFoldingControls: 'always',
        contextmenu: true,
        mouseWheelZoom: true,
        cursorBlinking: 'blink',
        cursorSmoothCaretAnimation: true,
        smoothScrolling: true,
        bracketPairColorization: { enabled: true }
      })

      // 注册代码补全
      const completionProvider = monaco.languages.registerCompletionItemProvider(defaultConfig.language!, {
        provideCompletionItems: (model: any, position: any) => {
          const suggestions = [
            ...completionProvider.getCompletions(),
            ...completions
          ].map(item => ({
            label: item.label,
            kind: monaco.languages.CompletionItemKind[item.kind as keyof typeof monaco.languages.CompletionItemKind] || monaco.languages.CompletionItemKind.Text,
            insertText: item.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: item.detail,
            documentation: item.documentation
          }))

          return { suggestions }
        }
      })

      // 注册快捷键
      editorInstance.addAction({
        id: 'save-file',
        label: '保存文件',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
        run: () => {
          events.onSave?.(editorInstance.getValue())
        }
      })

      editorInstance.addAction({
        id: 'format-code',
        label: '格式化代码',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
        run: () => {
          editorInstance.getAction('editor.action.formatDocument')?.run()
          events.onFormat?.()
        }
      })

      // 监听内容变化
      editorInstance.onDidChangeModelContent(() => {
        const newValue = editorInstance.getValue()
        events.onChange?.(newValue)

        // 实时语法检查
        if (defaultConfig.diagnostics) {
          checkDiagnostics(newValue)
        }
      })

      // 监听光标位置变化
      editorInstance.onDidChangeCursorPosition((e: any) => {
        events.onCursorPositionChange?.({
          line: e.position.lineNumber,
          column: e.position.column
        })
      })

      setEditor(editorInstance)
      setIsReady(true)

      return () => {
        completionProvider.dispose()
        editorInstance.dispose()
      }
    } catch (error) {
      console.error('Failed to initialize Monaco Editor:', error)
      events.onError?.(error instanceof Error ? error.message : '编辑器初始化失败')
    }
  }, [])

  /**
   * 检查代码诊断
   */
  const checkDiagnostics = useCallback(async (code: string) => {
    if (!monacoRef.current || !defaultConfig.diagnostics) return

    try {
      const results = await diagnosticsProvider.checkCode(code)
      setDiagnostics(results)

      // 在编辑器中显示诊断信息
      const monaco = monacoRef.current
      const model = editor?.getModel()

      if (model) {
        monaco.editor.setModelMarkers(model, 'typescript', results.map(d => ({
          severity: d.severity === 'error' ? monaco.MarkerSeverity.Error :
                  d.severity === 'warning' ? monaco.MarkerSeverity.Warning :
                  d.severity === 'info' ? monaco.MarkerSeverity.Info :
                  monaco.MarkerSeverity.Hint,
          message: d.message,
          startLineNumber: d.startLineNumber,
          startColumn: d.startColumn,
          endLineNumber: d.endLineNumber,
          endColumn: d.endColumn,
        })))
      }
    } catch (error) {
      console.error('Diagnostics check failed:', error)
    }
  }, [editor, defaultConfig.diagnostics])

  /**
   * 应用模板
   */
  const applyTemplate = useCallback((template: typeof templates[0]) => {
    if (!editor) return

    editor.setValue(template.content)
    editor.focus()
  }, [editor])

  /**
   * 切换全屏
   */
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  /**
   * 格式化代码
   */
  const formatCode = useCallback(() => {
    if (!editor) return
    editor.getAction('editor.action.formatDocument')?.run()
    events.onFormat?.()
  }, [editor, events.onFormat])

  /**
   * 组件挂载时初始化编辑器
   */
  useEffect(() => {
    initializeEditor()

    return () => {
      if (editor) {
        editor.dispose()
      }
    }
  }, [])

  /**
   * 主题变化时更新编辑器主题
   */
  useEffect(() => {
    if (editor && monacoRef.current) {
      const theme = activeTheme === 'dark' ? 'vs-dark' : 'vs-light'
      monacoRef.current.editor.setTheme(theme)
    }
  }, [activeTheme, editor])

  /**
   * 配置变化时更新编辑器
   */
  useEffect(() => {
    if (editor) {
      editor.updateOptions(defaultConfig)
    }
  }, [editor, defaultConfig])

  return (
    <div className={`workbench-monaco-editor flex flex-col ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* 工具栏 */}
      {showToolbar && (
        <div className="border-b px-4 py-2 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">代码编辑器</span>
              <span className="text-xs text-muted-foreground">
                {defaultConfig.language?.toUpperCase()}
              </span>
              {diagnostics.length > 0 && (
                <span className="text-xs text-destructive">
                  {diagnostics.filter(d => d.severity === 'error').length} 错误,
                  {diagnostics.filter(d => d.severity === 'warning').length} 警告
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* 模板选择 */}
              {templates.length > 0 && (
                <select
                  className="text-xs px-2 py-1 border rounded"
                  onChange={(e) => {
                    const template = templates.find(t => t.name === e.target.value)
                    if (template) applyTemplate(template)
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>选择模板</option>
                  {templates.map(template => (
                    <option key={template.name} value={template.name}>
                      {template.name}
                    </option>
                  ))}
                </select>
              )}

              {/* 工具按钮 */}
              <button
                onClick={formatCode}
                className="text-xs px-2 py-1 hover:bg-muted rounded"
                title="格式化代码 (Ctrl+Shift+F)"
              >
                格式化
              </button>

              <button
                onClick={toggleFullscreen}
                className="text-xs px-2 py-1 hover:bg-muted rounded"
                title={isFullscreen ? '退出全屏' : '全屏编辑'}
              >
                {isFullscreen ? '退出全屏' : '全屏'}
              </button>

              <button
                onClick={() => editor?.getAction('editor.action.formatDocument')?.run()}
                className="text-xs px-2 py-1 hover:bg-muted rounded"
                title="保存 (Ctrl+S)"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑器容器 */}
      <div
        ref={containerRef}
        className="flex-1"
        style={{
          minHeight: defaultConfig.minHeight || 200,
          maxHeight: isFullscreen ? 'none' : (defaultConfig.maxHeight || 600)
        }}
      />

      {/* 状态栏 */}
      <div className="border-t px-4 py-1 bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>
            行 {editor?.getPosition()?.lineNumber || 0}, 列 {editor?.getPosition()?.column || 0}
          </div>
          <div className="flex items-center space-x-4">
            <span>UTF-8</span>
            <span>TypeScript</span>
            <span>{value.length} 字符</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 导出实用函数
 */
export { completionProvider, diagnosticsProvider }