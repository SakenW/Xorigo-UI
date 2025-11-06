/**
 * 增强版 Monaco 编辑器
 * 提供完整的代码编辑功能，包括语法高亮、智能补全、错误诊断等
 */

'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import * as monaco from 'monaco-editor'
import { motion, AnimatePresence } from 'framer-motion'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 编辑器配置
 */
export interface EnhancedEditorConfig {
  /** 语言模式 */
  language: 'typescript' | 'javascript' | 'tsx' | 'jsx' | 'css' | 'json' | 'html' | 'markdown'
  /** 主题 */
  theme: 'vs-light' | 'vs-dark' | 'hc-black' | 'custom'
  /** 字体大小 */
  fontSize: number
  /** 制表符大小 */
  tabSize: number
  /** 是否显示行号 */
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
  /** 格式化 */
  formatOnPaste: boolean
  /** 输入时格式化 */
  formatOnType: boolean
  /** 建议 */
  suggest: {
    enabled: boolean
    showMethods: boolean
    showProperties: boolean
    showVariables: boolean
    showFunctions: boolean
    showConstructors: boolean
    showFields: boolean
    showClasses: boolean
    showStructs: boolean
    showInterfaces: boolean
    showModules: boolean
    showProperties: boolean
    showEvents: boolean
    showOperators: boolean
    showUnits: boolean
    showValues: boolean
    showConstants: boolean
    showEnums: boolean
    showEnumMembers: boolean
    showTypeParameters: boolean
    showIssues: boolean
    showUsers: boolean
    showColors: boolean
    showFiles: boolean
    showReferences: boolean
    showFolders: boolean
    showWords: boolean
    showSnippets: boolean
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
  /** 滚动条 */
  scrollbar: {
    vertical: 'visible' | 'hidden' | 'auto'
    horizontal: 'visible' | 'hidden' | 'auto'
    useShadows: boolean
    verticalScrollbarSize: number
    horizontalScrollbarSize: number
  }
  /** 光标动画 */
  cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid'
  /** 光标平滑移动 */
  cursorSmoothCaretAnimation: boolean | 'on'
  /** 平滑滚动 */
  smoothScrolling: boolean
  /** 鼠标滚轮缩放 */
  mouseWheelZoom: boolean
  /** 多选 */
  multiCursorModifier: 'ctrlCmd' | 'alt'
  /** 选择高亮 */
  selectionHighlight: boolean
  /** 概念高亮 */
  occurrencesHighlight: boolean
  /** 代码片段高亮 */
  codeLens: boolean
  /** 颜色选择器 */
  colorDecorators: boolean
  /** 轻量级优化 */
  lightbulb: { enabled: boolean }
  /** 错误提示 */
  showFoldingControls: 'always' | 'mouseover' | 'never'
  /** 装饰 */
  renderDecorations: 'all' | 'off' | 'gutter'
}

/**
 * 代码验证结果
 */
export interface CodeValidation {
  isValid: boolean
  errors: { line: number; column: number; message: string; severity: 'error' | 'warning' | 'info' }[]
  warnings: { line: number; column: number; message: string; severity: 'error' | 'warning' | 'info' }[]
  infos: { line: number; column: number; message: string; severity: 'error' | 'warning' | 'info' }[]
  hints: { line: number; column: number; message: string; severity: 'error' | 'warning' | 'info' }[]
}

/**
 * 编辑器事件
 */
export interface EditorEvents {
  onChange?: (value: string) => void
  onSave?: (value: string) => void
  onFormat?: () => void
  onValidate?: (validation: CodeValidation) => void
  onCursorPositionChange?: (position: { line: number; column: number }) => void
  onSelectionChange?: (selection: editor.ISelection) => void
  onError?: (error: Error) => void
}

/**
 * 代码片段
 */
export interface CodeSnippet {
  name: string
  description: string
  code: string
  language: string
  tags?: string[]
}

/**
 * 组件属性
 */
export interface EnhancedMonacoEditorProps {
  /** 初始值 */
  value?: string
  /** 配置 */
  config?: Partial<EnhancedEditorConfig>
  /** 事件处理 */
  events?: EditorEvents
  /** 代码片段 */
  snippets?: CodeSnippet[]
  /** 是否只读 */
  readOnly?: boolean
  /** 高度 */
  height?: string | number
  /** 类名 */
  className?: string
  /** 加载中 */
  loading?: React.ReactNode
}

// ============================================================================
// 默认配置
// ============================================================================

const DEFAULT_CONFIG: EnhancedEditorConfig = {
  language: 'typescript',
  theme: 'vs-dark',
  fontSize: 14,
  tabSize: 2,
  lineNumbers: 'on',
  wordWrap: 'on',
  minimap: { enabled: true },
  folding: true,
  autoCloseBrackets: 'always',
  autoIndent: 'full',
  formatOnPaste: true,
  formatOnType: true,
  suggest: {
    enabled: true,
    showMethods: true,
    showProperties: true,
    showVariables: true,
    showFunctions: true,
    showConstructors: true,
    showFields: true,
    showClasses: true,
    showStructs: true,
    showInterfaces: true,
    showModules: true,
    showProperties: true,
    showEvents: true,
    showOperators: true,
    showUnits: true,
    showValues: true,
    showConstants: true,
    showEnums: true,
    showEnumMembers: true,
    showTypeParameters: true,
    showIssues: true,
    showUsers: true,
    showColors: true,
    showFiles: true,
    showReferences: true,
    showFolders: true,
    showWords: true,
    showSnippets: true
  },
  quickSuggestions: true,
  parameterHints: { enabled: true },
  bracketPairColorization: { enabled: true },
  guides: {
    bracketPairs: true,
    bracketPairsHorizontal: true,
    highlightActiveBracketPair: true,
    indentation: true
  },
  scrollbar: {
    vertical: 'auto',
    horizontal: 'auto',
    useShadows: false,
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10
  },
  cursorBlinking: 'blink',
  cursorSmoothCaretAnimation: 'on',
  smoothScrolling: true,
  mouseWheelZoom: true,
  multiCursorModifier: 'ctrlCmd',
  selectionHighlight: true,
  occurrencesHighlight: true,
  codeLens: true,
  colorDecorators: true,
  lightbulb: { enabled: true },
  showFoldingControls: 'always',
  renderDecorations: 'all'
}

// ============================================================================
// Xorigo UI 组件代码片段
// ============================================================================

const XORIGO_UI_SNIPPETS: CodeSnippet[] = [
  {
    name: 'Button Component',
    description: '完整的 Button 组件',
    language: 'tsx',
    tags: ['button', 'component'],
    code: `import { Button } from '@xorigo-ui/core'

export function MyButton() {
  return (
    <Button
      variant="primary"
      size="md"
      onClick={() => console.log('clicked')}
    >
      Click Me
    </Button>
  )
}`
  },
  {
    name: 'Card Component',
    description: 'Card 容器组件',
    language: 'tsx',
    tags: ['card', 'container'],
    code: `import { Card, CardContent, CardHeader } from '@xorigo-ui/core'

export function MyCard() {
  return (
    <Card>
      <CardHeader>
        <h3>Card Title</h3>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
    </Card>
  )
}`
  },
  {
    name: 'Input Field',
    description: '带标签的输入框',
    language: 'tsx',
    tags: ['input', 'form'],
    code: `import { Input } from '@xorigo-ui/core'

export function MyInput() {
  const [value, setValue] = useState('')

  return (
    <Input
      label="Email"
      type="email"
      value={value}
      onChange={setValue}
      placeholder="Enter your email"
      required
    />
  )
}`
  },
  {
    name: 'useState Hook',
    description: 'React useState 示例',
    language: 'tsx',
    tags: ['hook', 'state'],
    code: `const [state, setState] = useState<any>(initialValue)

// Your code here`
  },
  {
    name: 'useEffect Hook',
    description: 'React useEffect 示例',
    language: 'tsx',
    tags: ['hook', 'effect'],
    code: `useEffect(() => {
  // Side effect logic

  return () => {
    // Cleanup logic
  }
}, [dependencies])`
  },
  {
    name: 'Async Function',
    description: '异步函数模板',
    language: 'tsx',
    tags: ['async', 'promise'],
    code: `async function functionName(params) {
  try {
    // Your async logic here
  } catch (error) {
    console.error('Error:', error)
  }
}`
  },
  {
    name: 'TypeScript Interface',
    description: 'TypeScript 接口定义',
    language: 'typescript',
    tags: ['typescript', 'interface'],
    code: `interface InterfaceName {
  property: type
  optional?: type
}`
  },
  {
    name: 'Styled Component',
    description: '样式化组件',
    language: 'tsx',
    tags: ['styled', 'css'],
    code: `const ComponentName = styled.div\`
  padding: spacingpx;
  background: background;
  border-radius: radiuspx;

  &:hover {
    hover styles
  }
\``
  }
]

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 验证代码
 */
function validateCode(code: string, language: string): CodeValidation {
  const errors: CodeValidation['errors'] = []
  const warnings: CodeValidation['warnings'] = []
  const infos: CodeValidation['infos'] = []
  const hints: CodeValidation['hints'] = []

  // 基础语法检查
  const lines = code.split('\n')

  lines.forEach((line, index) => {
    const lineNumber = index + 1

    // 检查未闭合的标签 (JSX/HTML)
    if ((language === 'tsx' || language === 'jsx' || language === 'html') && line.includes('<')) {
      const openTags = (line.match(/<\w+[^>]*>/g) || []).length
      const closeTags = (line.match(/<\/\w+>/g) || []).length
      const selfClosingTags = (line.match(/<\w+[^>]*\/>/g) || []).length

      if (openTags > closeTags + selfClosingTags) {
        warnings.push({
          line: lineNumber,
          column: 1,
          message: '可能有未闭合的标签',
          severity: 'warning'
        })
      }
    }

    // 检查 import 语句
    if (line.includes('import') && !line.includes('from') && !line.trim().startsWith('//')) {
      errors.push({
        line: lineNumber,
        column: 1,
        message: 'import 语句缺少 from 关键字',
        severity: 'error'
      })
    }

    // 检查括号匹配
    const brackets = { '(': 0, '{': 0, '[': 0 }
    for (const char of line) {
      if (char in brackets) {
        brackets[char as keyof typeof brackets]++
      }
      if (char === ')' && brackets['('] > 0) brackets['(']--
      if (char === '}' && brackets['{'] > 0) brackets['{']--
      if (char === ']' && brackets['['] > 0) brackets['[']--
    }

    if (brackets['('] !== 0) {
      errors.push({
        line: lineNumber,
        column: 1,
        message: '小括号不匹配',
        severity: 'error'
      })
    }
    if (brackets['{'] !== 0) {
      errors.push({
        line: lineNumber,
        column: 1,
        message: '大括号不匹配',
        severity: 'error'
      })
    }
    if (brackets['['] !== 0) {
      errors.push({
        line: lineNumber,
        column: 1,
        message: '中括号不匹配',
        severity: 'error'
      })
    }

    // 检查分号 (TypeScript/JavaScript)
    if ((language === 'typescript' || language === 'javascript') && line.trim()) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.endsWith('*/')) {
        if ((trimmed.endsWith('{') || trimmed.endsWith('}') || trimmed.endsWith(';')) === false) {
          if (!trimmed.includes(' ') && !trimmed.includes('\t')) {
            // No suggestion for single line statements without spaces
          }
        }
      }
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    infos,
    hints
  }
}

/**
 * 注册 Xorigo UI 组件到 Monaco
 */
function registerXorigoUICompletion(monacoInstance: typeof monaco) {
  // Xorigo UI 组件补全
  monacoInstance.languages.registerCompletionItemProvider('typescript', {
    provideCompletionItems: (model, position) => {
      const suggestions: monaco.languages.CompletionItem[] = [
        {
          label: 'Button',
          kind: monacoInstance.languages.CompletionItemKind.Class,
          insertText: 'Button',
          insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: '@xorigo-ui/core',
          documentation: '按钮组件',
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column - 6,
            endColumn: position.column
          }
        },
        {
          label: 'Card',
          kind: monacoInstance.languages.CompletionItemKind.Class,
          insertText: 'Card',
          insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: '@xorigo-ui/core',
          documentation: '卡片容器组件',
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column - 4,
            endColumn: position.column
          }
        },
        {
          label: 'Input',
          kind: monacoInstance.languages.CompletionItemKind.Class,
          insertText: 'Input',
          insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: '@xorigo-ui/core',
          documentation: '输入框组件',
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column - 5,
            endColumn: position.column
          }
        },
        {
          label: 'Badge',
          kind: monacoInstance.languages.CompletionItemKind.Class,
          insertText: 'Badge',
          insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: '@xorigo-ui/core',
          documentation: '徽章组件',
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column - 5,
            endColumn: position.column
          }
        },
        {
          label: 'Dialog',
          kind: monacoInstance.languages.CompletionItemKind.Class,
          insertText: 'Dialog',
          insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: '@xorigo-ui/core',
          documentation: '对话框组件',
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column - 6,
            endColumn: position.column
          }
        }
      ]

      return { suggestions }
    }
  })

  // 注册悬停提示
  monacoInstance.languages.registerHoverProvider('typescript', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position)
      if (!word) return null

      const hoverContent: { value: string }[] = []

      if (word.word === 'Button') {
        hoverContent.push({
          value: '**Button 组件**\n\n用于触发操作的按钮组件\n\n*Props: variant, size, disabled, onClick*'
        })
      } else if (word.word === 'Card') {
        hoverContent.push({
          value: '**Card 组件**\n\n用于包装内容的容器组件\n\n*Props: className, children*'
        })
      } else if (word.word === 'Input') {
        hoverContent.push({
          value: '**Input 组件**\n\n文本输入组件\n\n*Props: type, value, onChange, placeholder*'
        })
      }

      if (hoverContent.length === 0) return null

      return {
        range: new monacoInstance.Range(
          position.lineNumber,
          word.startColumn,
          position.lineNumber,
          word.endColumn
        ),
        contents: hoverContent
      }
    }
  })
}

// ============================================================================
// 主组件
// ============================================================================

/**
 * 增强版 Monaco 编辑器
 */
export function EnhancedMonacoEditor({
  value = '',
  config = {},
  events = {},
  snippets = [],
  readOnly = false,
  height = 600,
  className = '',
  loading
}: EnhancedMonacoEditorProps) {
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(null)
  const [monacoInstance, setMonacoInstance] = useState<typeof monaco | null>(null)
  const [validation, setValidation] = useState<CodeValidation>({
    isValid: true,
    errors: [],
    warnings: [],
    infos: [],
    hints: []
  })
  const [showMinimap, setShowMinimap] = useState(config.minimap?.enabled ?? true)
  const [showWhitespace, setShowWhitespace] = useState(false)
  const [wordWrap, setWordWrap] = useState(config.wordWrap ?? 'on')
  const [fontSize, setFontSize] = useState(config.fontSize ?? 14)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 合并配置
  const mergedConfig = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...config,
    minimap: { enabled: showMinimap },
    wordWrap,
    fontSize
  }), [config, showMinimap, wordWrap, fontSize])

  // 合并代码片段
  const allSnippets = useMemo(() => [...XORIGO_UI_SNIPPETS, ...snippets], [snippets])

  /**
   * 编辑器挂载回调
   */
  const handleEditorDidMount: OnMount = useCallback((editorInstance, monaco) => {
    setEditor(editorInstance)
    setMonacoInstance(monaco)
    editorRef.current = editorInstance

    // 注册 Xorigo UI 补全
    registerXorigoUICompletion(monaco)

    // 配置 TypeScript 编译器选项
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
      typeRoots: ['node_modules/@types'],
      strict: false // 暂时禁用严格模式
    })

    // 添加 React 类型定义
    monaco.languages.typescript.typescriptDefaults.addExtraLib(`
      declare module 'react' {
        import * as React from 'react'
        export = React
        export as namespace React

        export interface ReactNode {}
        export interface ReactElement<P = any> {}
        export interface ComponentType<P = {}> {}

        export function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void]
        export function useState<T>(): [T | undefined, (value: T | ((prev: T | undefined) => T)) => void]

        export function useEffect(effect: () => void | (() => void), deps?: any[]): void
        export function useCallback<T extends Function>(callback: T, deps: any[]): T
        export function useMemo<T>(factory: () => T, deps: any[]): T
        export function useRef<T>(initialValue: T): React.MutableRefObject<T>
        export function useContext<T>(Context: React.Context<T>): T
      }

      declare module '@xorigo-ui/core' {
        import * as React from 'react'

        export interface ButtonProps {
          variant?: 'primary' | 'secondary' | 'outline'
          size?: 'sm' | 'md' | 'lg'
          disabled?: boolean
          onClick?: (event: React.MouseEvent) => void
          children?: React.ReactNode
          className?: string
        }

        export const Button: React.FC<ButtonProps>

        export interface CardProps {
          className?: string
          children?: React.ReactNode
        }

        export const Card: React.FC<CardProps>
        export const CardHeader: React.FC<CardProps>
        export const CardContent: React.FC<CardProps>
        export const CardFooter: React.FC<CardProps>

        export interface InputProps {
          type?: string
          value?: string
          onChange?: (value: string) => void
          placeholder?: string
          label?: string
          disabled?: boolean
          required?: boolean
        }

        export const Input: React.FC<InputProps>

        export interface BadgeProps {
          variant?: 'default' | 'success' | 'warning' | 'danger'
          children?: React.ReactNode
        }

        export const Badge: React.FC<BadgeProps>
      }
    `, 'file:///node_modules/@types/react/index.d.ts')

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

    editorInstance.addAction({
      id: 'toggle-minimap',
      label: '切换小地图',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyM],
      run: () => {
        setShowMinimap(prev => !prev)
      }
    })

    editorInstance.addAction({
      id: 'toggle-wordwrap',
      label: '切换自动换行',
      keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.KeyZ],
      run: () => {
        setWordWrap(prev => prev === 'on' ? 'off' : 'on')
      }
    })

    // 监听内容变化
    editorInstance.onDidChangeModelContent(() => {
      const newValue = editorInstance.getValue()
      events.onChange?.(newValue)

      // 实时验证
      const validationResult = validateCode(newValue, mergedConfig.language)
      setValidation(validationResult)
      events.onValidate?.(validationResult)
    })

    // 监听光标位置变化
    editorInstance.onDidChangeCursorPosition((e) => {
      events.onCursorPositionChange?.({
        line: e.position.lineNumber,
        column: e.position.column
      })
    })

    // 监听选择变化
    editorInstance.onDidChangeCursorSelection((e) => {
      events.onSelectionChange?.(e.selection)
    })

    // 设置编辑器选项
    editorInstance.updateOptions(mergedConfig)

  }, [events, mergedConfig])

  /**
   * 处理配置变化
   */
  useEffect(() => {
    if (editor && monacoInstance) {
      editor.updateOptions(mergedConfig)
    }
  }, [editor, monacoInstance, mergedConfig])

  /**
   * 全屏切换
   */
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  /**
   * 应用代码片段
   */
  const applySnippet = useCallback((snippet: CodeSnippet) => {
    if (!editor) return

    const position = editor.getPosition()
    if (!position) return

    editor.executeEdits('apply-snippet', [{
      range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
      text: snippet.code,
      forceMoveMarkers: true
    }])

    editor.focus()
  }, [editor, monacoInstance])

  /**
   * 格式化代码
   */
  const formatCode = useCallback(() => {
    if (!editor) return
    editor.getAction('editor.action.formatDocument')?.run()
    events.onFormat?.()
  }, [editor, events.onFormat])

  /**
   * 验证当前代码
   */
  const validateCurrentCode = useCallback(() => {
    if (!editor) return
    const code = editor.getValue()
    const validationResult = validateCode(code, mergedConfig.language)
    setValidation(validationResult)
    events.onValidate?.(validationResult)
  }, [editor, mergedConfig.language, events.onValidate])

  return (
    <motion.div
      layout
      className={`enhanced-monaco-editor ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 工具栏 */}
      <div className="border-b bg-muted/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">代码编辑器</span>
          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-background rounded">
            {mergedConfig.language.toUpperCase()}
          </span>
          <span className="text-xs text-muted-foreground">
            {value.split('\n').length} 行
          </span>
          {validation.errors.length > 0 && (
            <span className="text-xs text-destructive px-2 py-0.5 bg-destructive/10 rounded">
              ❌ {validation.errors.length} 错误
            </span>
          )}
          {validation.warnings.length > 0 && (
            <span className="text-xs text-yellow-600 px-2 py-0.5 bg-yellow-500/10 rounded">
              ⚠️ {validation.warnings.length} 警告
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* 代码片段选择 */}
          {allSnippets.length > 0 && (
            <select
              className="text-xs px-2 py-1 border rounded bg-background"
              onChange={(e) => {
                const snippet = allSnippets.find(s => s.name === e.target.value)
                if (snippet) {
                  applySnippet(snippet)
                  e.target.value = ''
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>代码片段...</option>
              {allSnippets.map(snippet => (
                <option key={snippet.name} value={snippet.name}>
                  {snippet.name}
                </option>
              ))}
            </select>
          )}

          {/* 视图控制 */}
          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className="text-xs px-2 py-1 hover:bg-muted rounded"
            title="切换小地图 (Ctrl+Shift+M)"
          >
            {showMinimap ? '📋' : '📄'}
          </button>

          <button
            onClick={() => setWordWrap(wordWrap === 'on' ? 'off' : 'on')}
            className="text-xs px-2 py-1 hover:bg-muted rounded"
            title="切换自动换行 (Alt+Z)"
          >
            {wordWrap === 'on' ? '↔️' : '➡️'}
          </button>

          <button
            onClick={() => setShowWhitespace(!showWhitespace)}
            className="text-xs px-2 py-1 hover:bg-muted rounded"
            title="显示空白字符"
          >
            ␣
          </button>

          {/* 编辑操作 */}
          <button
            onClick={formatCode}
            className="text-xs px-2 py-1 hover:bg-muted rounded"
            title="格式化代码 (Ctrl+Shift+F)"
          >
            格式化
          </button>

          <button
            onClick={validateCurrentCode}
            className="text-xs px-2 py-1 hover:bg-muted rounded"
            title="验证代码"
          >
            验证
          </button>

          <button
            onClick={() => setFontSize(fontSize + 1)}
            className="text-xs px-2 py-1 hover:bg-muted rounded"
            title="增大字体"
          >
            A+
          </button>

          <button
            onClick={() => setFontSize(Math.max(10, fontSize - 1))}
            className="text-xs px-2 py-1 hover:bg-muted rounded"
            title="减小字体"
          >
            A-
          </button>

          <button
            onClick={toggleFullscreen}
            className="text-xs px-2 py-1 hover:bg-muted rounded"
            title={isFullscreen ? '退出全屏' : '全屏编辑'}
          >
            {isFullscreen ? '⛶' : '⛶'}
          </button>
        </div>
      </div>

      {/* 编辑器容器 */}
      <div ref={containerRef} className="flex-1 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            {loading}
          </div>
        ) : (
          <Editor
            height={typeof height === 'number' ? `${height}px` : height}
            language={mergedConfig.language}
            value={value}
            theme={mergedConfig.theme}
            onMount={handleEditorDidMount}
            options={{
              ...mergedConfig,
              readOnly,
              renderWhitespace: showWhitespace ? 'all' : 'none'
            }}
            loading={null}
          />
        )}
      </div>

      {/* 状态栏 */}
      <div className="border-t bg-muted/20 px-4 py-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>
              行 {editor?.getPosition()?.lineNumber || 0},
              列 {editor?.getPosition()?.column || 0}
            </span>
            <span>UTF-8</span>
            <span>{mergedConfig.language}</span>
            <span>字体: {fontSize}px</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{value.length} 字符</span>
            <span>{value.split('\n').length} 行</span>
            <span>{validation.errors.length} 错误</span>
            <span>{validation.warnings.length} 警告</span>
          </div>
        </div>
      </div>

      {/* 验证结果面板 */}
      <AnimatePresence>
        {(validation.errors.length > 0 || validation.warnings.length > 0) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t bg-muted/10 max-h-40 overflow-y-auto"
          >
            <div className="p-3 space-y-2">
              {validation.errors.map((error, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-destructive">
                  <span>❌</span>
                  <span>第{error.line}行:{error.column}</span>
                  <span>{error.message}</span>
                </div>
              ))}
              {validation.warnings.map((warning, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-yellow-600">
                  <span>⚠️</span>
                  <span>第{warning.line}行:{warning.column}</span>
                  <span>{warning.message}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================================================
// 导出
// ============================================================================

export default EnhancedMonacoEditor
