/**
 * Monaco Editor 集成组件
 * 提供完整的代码编辑、实时预览和错误检测功能
 */

'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

// ============================================================================
// 类型定义
// ============================================================================

export interface EditorConfig {
  language: 'tsx' | 'jsx' | 'typescript' | 'javascript'
  theme: 'light' | 'dark'
  fontSize: number
  tabSize: number
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  minimap: { enabled: boolean }
  lineNumbers: 'on' | 'off' | 'relative' | 'interval'
  folding: boolean
  autoCloseBrackets: boolean
  autoIndent: 'none' | 'keep' | 'brackets' | 'advanced' | 'full'
}

export interface CodeValidation {
  isValid: boolean
  errors: { line: number; message: string }[]
  warnings: { line: number; message: string }[]
}

/**
 * Monaco 编辑器组件
 */
interface MonacoEditorProps {
  value: string
  onChange: (value: string) => void
  onValidate?: (validation: CodeValidation) => void
  config?: Partial<EditorConfig>
  readOnly?: boolean
  height?: string | number
  className?: string
}

/**
 * 实时预览组件
 */
interface LivePreviewProps {
  code: string
  onError?: (error: string) => void
  height?: string | number
  className?: string
}

/**
 * 代码执行结果
 */
interface ExecutionResult {
  success: boolean
  output?: string
  error?: string
  renderTime?: number
}

// ============================================================================
// 简化版 Monaco 编辑器（用于演示）
// ============================================================================

/**
 * 简化的代码编辑器
 * 在实际项目中，这里会使用 @monaco-editor/react
 */
const SimpleMonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  onValidate,
  config,
  readOnly = false,
  height = 400,
  className = ''
}) => {
  const [validation, setValidation] = useState<CodeValidation>({
    isValid: true,
    errors: [],
    warnings: []
  })

  // 模拟代码验证
  const validateCode = useCallback((code: string) => {
    const errors: { line: number; message: string }[] = []
    const warnings: { line: number; message: string }[] = []

    // 简单的语法检查
    if (!code.includes('return')) {
      warnings.push({ line: 1, message: '组件应该包含 return 语句' })
    }

    if (code.includes('var ')) {
      warnings.push({ line: 1, message: '建议使用 let 或 const 替代 var' })
    }

    // 检查 JSX
    if (code.includes('<') && !code.includes('>')) {
      errors.push({ line: 1, message: 'JSX 标签未闭合' })
    }

    const isValid = errors.length === 0

    const result = { isValid, errors, warnings }
    setValidation(result)
    onValidate?.(result)

    return result
  }, [onValidate])

  useEffect(() => {
    if (!readOnly) {
      validateCode(value)
    }
  }, [value, readOnly, validateCode])

  return (
    <div className={`border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden ${className}`}>
      {/* 编辑器头部 */}
      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Editor.tsx</span>
          <span className={`text-xs px-2 py-0.5 rounded ${
            validation.isValid
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {validation.isValid ? '✓ 有效' : '✗ 有错误'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>行 {value.split('\n').length}</span>
          <span>字符 {value.length}</span>
        </div>
      </div>

      {/* 代码编辑器区域 */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          className="w-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none resize-none"
          style={{ height: typeof height === 'number' ? `${height}px` : height }}
          placeholder="编写您的组件代码..."
          spellCheck={false}
        />
        {!readOnly && (
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={() => {
                const blob = new Blob([value], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'Component.tsx'
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="p-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
              title="下载代码"
            >
              💾
            </button>
            <button
              onClick={() => onChange('')}
              className="p-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
              title="清空"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* 验证结果 */}
      {(validation.errors.length > 0 || validation.warnings.length > 0) && (
        <div className="border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-3 max-h-32 overflow-y-auto">
          {validation.errors.map((err, idx) => (
            <div key={idx} className="text-xs text-red-600 dark:text-red-400 mb-1">
              ❌ 第{err.line}行: {err.message}
            </div>
          ))}
          {validation.warnings.map((warn, idx) => (
            <div key={idx} className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">
              ⚠️ 第{warn.line}行: {warn.message}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 实时预览组件
// ============================================================================

/**
 * 实时预览组件
 */
const LivePreview: React.FC<LivePreviewProps> = ({
  code,
  onError,
  height = 400,
  className = ''
}) => {
  const [result, setResult] = useState<ExecutionResult>({
    success: true,
    renderTime: 0
  })
  const [previewHtml, setPreviewHtml] = useState<string>('')

  // 模拟代码编译和预览
  useEffect(() => {
    const compileAndPreview = async () => {
      try {
        const startTime = performance.now()

        // 模拟编译过程
        let compiledCode = code

        // 简单的转换：移除 JSX 转换（实际项目中需要 Babel）
        if (compiledCode.includes('className=')) {
          compiledCode = compiledCode.replace(/className=/g, 'class=')
        }

        // 生成预览 HTML
        const preview = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: white;
              }
              .preview-container {
                display: flex;
                flex-direction: column;
                gap: 16px;
              }
            </style>
          </head>
          <body>
            <div id="root">
              <div style="
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 8px;
                color: white;
                text-align: center;
              ">
                <h1 style="margin: 0; font-size: 24px;">React 组件预览</h1>
                <p style="margin: 8px 0 0 0; opacity: 0.9;">您的代码将在这里渲染</p>
              </div>
              <div style="margin-top: 20px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h3 style="margin: 0 0 12px 0; color: #374151;">组件代码：</h3>
                <pre style="
                  margin: 0;
                  padding: 12px;
                  background: #f9fafb;
                  border-radius: 4px;
                  font-size: 12px;
                  overflow-x: auto;
                  line-height: 1.5;
                "><code>${compiledCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
              </div>
            </div>
          </body>
          </html>
        `

        const renderTime = performance.now() - startTime

        setResult({
          success: true,
          output: preview,
          renderTime
        })
        setPreviewHtml(preview)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '编译失败'
        setResult({
          success: false,
          error: errorMessage
        })
        onError?.(errorMessage)
      }
    }

    const timer = setTimeout(compileAndPreview, 300) // 防抖

    return () => clearTimeout(timer)
  }, [code, onError])

  return (
    <div className={`border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden ${className}`}>
      {/* 预览头部 */}
      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</span>
          <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
            result.success
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            <span>●</span> Live
          </span>
        </div>
        {result.renderTime !== undefined && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            渲染: {result.renderTime.toFixed(2)}ms
          </div>
        )}
      </div>

      {/* 预览内容 */}
      <div
        className="bg-white dark:bg-gray-800"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        {result.success ? (
          <iframe
            srcDoc={previewHtml}
            className="w-full h-full border-0"
            title="Component Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-2">⚠️</div>
              <div className="text-red-600 dark:text-red-400 font-medium mb-1">编译失败</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{result.error}</div>
            </div>
          </div>
        )}
      </div>

      {/* 预览统计 */}
      <div className="border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>代码长度: {code.length} 字符</span>
          <span>行数: {code.split('\n').length}</span>
          <span>JSX: {code.includes('<') ? '✓' : '✗'}</span>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 集成编辑器组件
// ============================================================================

/**
 * 集成代码编辑器
 */
interface IntegratedEditorProps {
  initialCode?: string
  onCodeChange?: (code: string) => void
  onExecute?: (code: string) => Promise<ExecutionResult>
  height?: number
  className?: string
}

export const IntegratedEditor: React.FC<IntegratedEditorProps> = ({
  initialCode = `function Welcome() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        欢迎使用 Xorigo UI
      </h1>
      <p className="text-gray-600">
        开始编写您的组件代码
      </p>
    </div>
  )
}`,
  onCodeChange,
  onExecute,
  height = 500,
  className = ''
}) => {
  const [code, setCode] = useState(initialCode)
  const [validation, setValidation] = useState<CodeValidation>({
    isValid: true,
    errors: [],
    warnings: []
  })
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode)
    onCodeChange?.(newCode)
  }, [onCodeChange])

  const handleValidate = useCallback((newValidation: CodeValidation) => {
    setValidation(newValidation)
  }, [])

  const handleExecute = useCallback(async () => {
    if (!onExecute) return

    setIsExecuting(true)
    try {
      const result = await onExecute(code)
      setExecutionResult(result)
    } catch (error) {
      setExecutionResult({
        success: false,
        error: error instanceof Error ? error.message : '执行失败'
      })
    } finally {
      setIsExecuting(false)
    }
  }, [code, onExecute])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 编辑器 */}
      <SimpleMonacoEditor
        value={code}
        onChange={handleCodeChange}
        onValidate={handleValidate}
        height={height}
      />

      {/* 操作按钮 */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleExecute}
          disabled={!validation.isValid || isExecuting}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            !validation.isValid || isExecuting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isExecuting ? (
            <>
              <span className="animate-spin">⏳</span>
              执行中...
            </>
          ) : (
            <>
              <span>▶️</span>
              运行代码
            </>
          )}
        </button>

        <button
          onClick={() => setCode(initialCode)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          重置
        </button>

        <span className={`text-sm ${
          validation.isValid ? 'text-green-600' : 'text-red-600'
        }`}>
          {validation.isValid ? '✓ 代码有效' : `✗ ${validation.errors.length} 个错误`}
        </span>
      </div>

      {/* 执行结果 */}
      {executionResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            executionResult.success
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}
        >
          <div className={`font-medium mb-2 ${
            executionResult.success
              ? 'text-green-800 dark:text-green-200'
              : 'text-red-800 dark:text-red-200'
          }`}>
            {executionResult.success ? '✓ 执行成功' : '✗ 执行失败'}
          </div>
          {executionResult.success && executionResult.renderTime !== undefined && (
            <div className="text-sm text-green-700 dark:text-green-300">
              渲染时间: {executionResult.renderTime.toFixed(2)}ms
            </div>
          )}
          {executionResult.error && (
            <div className="text-sm text-red-700 dark:text-red-300 mt-1">
              {executionResult.error}
            </div>
          )}
        </motion.div>
      )}

      {/* 实时预览 */}
      <LivePreview
        code={code}
        onError={(error) => {
          console.error('Preview error:', error)
        }}
        height={height}
      />
    </div>
  )
}

export default IntegratedEditor
