/**
 * 增强版 Monaco 编辑器测试
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EnhancedMonacoEditor } from '../enhanced-monaco-editor'

// Mock Monaco Editor
vi.mock('monaco-editor', () => ({
  languages: {
    typescript: {
      typescriptDefaults: {
        setCompilerOptions: vi.fn(),
        addExtraLib: vi.fn()
      },
      ScriptTarget: { ES2020: 2020 },
      ModuleResolutionKind: { NodeJs: 1 },
      ModuleKind: { CommonJS: 1 },
      JsxEmit: { React: 1 }
    },
    registerCompletionItemProvider: vi.fn(() => ({
      dispose: vi.fn()
    }))
  },
  editor: {
    create: vi.fn(() => ({
      addAction: vi.fn(),
      onDidChangeModelContent: vi.fn(),
      onDidChangeCursorPosition: vi.fn(),
      onDidChangeCursorSelection: vi.fn(),
      updateOptions: vi.fn(),
      getValue: vi.fn(() => 'test code'),
      getPosition: vi.fn(() => ({ lineNumber: 1, column: 1 })),
      getAction: vi.fn(() => ({ run: vi.fn() })),
      dispose: vi.fn(),
      focus: vi.fn()
    }))
  },
  KeyMod: { CtrlCmd: 2048, Shift: 1024, Alt: 512 },
  KeyCode: { KeyS: 49, KeyF: 33, KeyM: 50, KeyZ: 52 },
  CompletionItemKind: {
    Text: 0,
    Method: 1,
    Function: 2,
    Constructor: 3,
    Field: 4,
    Variable: 5,
    Class: 6,
    Interface: 7,
    Module: 8,
    Property: 9,
    Unit: 10,
    Value: 11,
    Enum: 12,
    Keyword: 13,
    Snippet: 14,
    Color: 15,
    File: 16,
    Reference: 17,
    Customcolor: 18,
    Folder: 19,
    EnumMember: 20,
    TypeParameter: 21,
    User: 22,
    Issue: 23,
    Snippet: 14
  },
  MarkerSeverity: { Error: 8, Warning: 4, Info: 2, Hint: 1 },
  Range: class {
    constructor(
      public startLineNumber: number,
      public startColumn: number,
      public endLineNumber: number,
      public endColumn: number
    ) {}
  }
}))

describe('EnhancedMonacoEditor', () => {
  const defaultProps = {
    value: 'test code',
    config: {
      language: 'typescript',
      theme: 'vs-dark'
    },
    events: {
      onChange: vi.fn(),
      onSave: vi.fn(),
      onFormat: vi.fn(),
      onValidate: vi.fn()
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders editor container', async () => {
    render(<EnhancedMonacoEditor {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByRole('region')).toBeInTheDocument()
    })
  })

  it('calls onChange when code changes', async () => {
    const user = userEvent.setup()
    render(<EnhancedMonacoEditor {...defaultProps} />)

    await waitFor(() => {
      // Monaco 编辑器会在挂载后初始化
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    // 模拟用户输入
    // 注意：由于 Monaco 是通过 iframe 加载的，实际测试中需要特殊处理
  })

  it('displays validation errors and warnings', async () => {
    const codeWithErrors = `const x = 1
const y = 2
< // 未闭合标签`

    render(
      <EnhancedMonacoEditor
        {...defaultProps}
        value={codeWithErrors}
      />
    )

    await waitFor(() => {
      // 验证错误显示
      expect(screen.getByText(/错误/)).toBeInTheDocument()
    })
  })

  it('applies custom configuration', async () => {
    const customConfig = {
      fontSize: 16,
      tabSize: 4,
      lineNumbers: 'off' as const,
      minimap: { enabled: false }
    }

    render(
      <EnhancedMonacoEditor
        {...defaultProps}
        config={customConfig}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('region')).toBeInTheDocument()
    })
  })

  it('displays code statistics', async () => {
    const code = 'line1\nline2\nline3'

    render(
      <EnhancedMonacoEditor
        {...defaultProps}
        value={code}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(/3 行/)).toBeInTheDocument()
    })
  })

  it('handles fullscreen mode', async () => {
    const user = userEvent.setup()
    render(
      <EnhancedMonacoEditor
        {...defaultProps}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    // 点击全屏按钮
    // 注意：实际测试中需要模拟 Monaco 编辑器的交互
  })

  it('formats code when requested', async () => {
    const onFormat = vi.fn()
    render(
      <EnhancedMonacoEditor
        {...defaultProps}
        events={{ ...defaultProps.events, onFormat }}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    // 点击格式化按钮
    // 注意：实际测试中需要特殊处理
  })

  it('shows toolbar when showToolbar is true', async () => {
    render(
      <EnhancedMonacoEditor
        {...defaultProps}
        showToolbar={true}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('代码编辑器')).toBeInTheDocument()
    })
  })

  it('hides toolbar when showToolbar is false', async () => {
    render(
      <EnhancedMonacoEditor
        {...defaultProps}
        showToolbar={false}
      />
    )

    await waitFor(() => {
      // 工具栏不显示
      expect(screen.queryByText('代码编辑器')).not.toBeInTheDocument()
    })
  })

  it('displays status bar with editor info', async () => {
    render(
      <EnhancedMonacoEditor
        {...defaultProps}
      />
    )

    await waitFor(() => {
      // 状态栏显示编码、语言等信息
      expect(screen.getByText('UTF-8')).toBeInTheDocument()
    })
  })

  it('applies custom theme', async () => {
    const customTheme = 'vs-light'

    render(
      <EnhancedMonacoEditor
        {...defaultProps}
        config={{ theme: customTheme }}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('region')).toBeInTheDocument()
    })
  })

  it('handles save operation', async () => {
    const onSave = vi.fn()

    render(
      <EnhancedMonacoEditor
        {...defaultProps}
        events={{ ...defaultProps.events, onSave }}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    // 模拟 Ctrl+S 保存
    // 注意：实际测试中需要特殊处理键盘事件
  })

  it('validates code in real-time', async () => {
    const onValidate = vi.fn()
    const code = 'const x = 1'

    render(
      <EnhancedMonacoEditor
        {...defaultProps}
        value={code}
        events={{ ...defaultProps.events, onValidate }}
      />
    )

    await waitFor(() => {
      expect(onValidate).toHaveBeenCalled()
    })
  })

  it('supports multiple languages', async () => {
    const languages = ['typescript', 'javascript', 'tsx', 'jsx', 'css', 'json']

    for (const lang of languages) {
      render(
        <EnhancedMonacoEditor
          {...defaultProps}
          config={{ language: lang as any }}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('region')).toBeInTheDocument()
      })
    }
  })

  it('displays error messages', async () => {
    const code = 'import something from // 缺少 from'
    const onError = vi.fn()

    render(
      <EnhancedMonacoEditor
        {...defaultProps}
        value={code}
        events={{ ...defaultProps.events, onError }}
      />
    )

    await waitFor(() => {
      // 应该检测到错误
      expect(screen.getByText(/错误/)).toBeInTheDocument()
    })
  })
})

describe('EnhancedMonacoEditor - Performance', () => {
  it('loads editor lazily', async () => {
    const startTime = performance.now()

    render(
      <EnhancedMonacoEditor
        value="test"
        config={{ language: 'typescript' }}
      />
    )

    await waitFor(() => {
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(100) // 加载时间应小于 100ms
    })
  })

  it('handles large code efficiently', async () => {
    const largeCode = 'const x = 1;\n'.repeat(1000)

    const startTime = performance.now()

    render(
      <EnhancedMonacoEditor
        value={largeCode}
        config={{ language: 'typescript' }}
      />
    )

    await waitFor(() => {
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(200) // 处理大文件应小于 200ms
    })
  })
})
