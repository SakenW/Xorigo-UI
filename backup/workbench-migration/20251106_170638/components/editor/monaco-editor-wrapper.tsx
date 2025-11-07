/**
 * Monaco 编辑器完整包装器
 * 集成所有功能的完整编辑器组件
 */

'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWorkbench } from '../workbench-types'
import LazyMonacoEditor, { usePreloadMonaco } from './lazy-monaco-editor'
import { MonacoThemeAdapter, SevenAxisTheme } from './monaco-theme-adapter'
import type { EnhancedEditorConfig } from './enhanced-monaco-editor'

// ============================================================================
// 包装器属性
// ============================================================================

export interface MonacoEditorWrapperProps {
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
  /** 是否显示完整界面 */
  showFullInterface?: boolean
  /** 是否启用实时验证 */
  enableValidation?: boolean
  /** 是否启用主题适配 */
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

// ============================================================================
// 默认七轴主题
// ============================================================================

const DEFAULT_THEME: SevenAxisTheme = {
  mode: 'dark',
  hue: '#3b82f6',
  saturation: 0.8,
  lightness: 0.6,
  density: 'comfortable',
  roundness: 0.5,
  contrast: 'normal'
}

// ============================================================================
// 主组件
// ============================================================================

/**
 * Monaco 编辑器完整包装器
 * 提供完整的代码编辑体验，包括主题适配、性能优化等
 */
export function MonacoEditorWrapper({
  initialCode = `// 欢迎使用 Xorigo UI Workbench 2.0
// 这是一个增强版 Monaco 编辑器，支持：

import { Button, Card, Input } from '@xorigo-ui/core'
import { useState } from 'react'

export function WelcomeComponent() {
  const [count, setCount] = useState(0)

  return (
    <Card>
      <h1>欢迎使用 Xorigo UI 2.0</h1>
      <p>当前计数: {count}</p>
      <Button
        variant="primary"
        onClick={() => setCount(count + 1)}
      >
        点击我
      </Button>
    </Card>
  )
}

export default WelcomeComponent
`,
  initialLanguage = 'typescript',
  config = {},
  height = 600,
  readOnly = false,
  showFullInterface = true,
  enableValidation = true,
  enableThemeAdapter = true,
  customTheme,
  onChange,
  onSave,
  onError,
  className = ''
}: MonacoEditorWrapperProps) {
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState(initialLanguage)
  const [validation, setValidation] = useState<any>(null)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [isEditorReady, setIsEditorReady] = useState(false)

  // 使用 Workbench 上下文获取主题
  const { activeTheme } = useWorkbench()

  // 预加载 Monaco
  const { preload, isPreloaded } = usePreloadMonaco()

  // 七轴主题配置
  const sevenAxisTheme = useMemo(() => {
    const theme: SevenAxisTheme = customTheme || {
      ...DEFAULT_THEME,
      mode: activeTheme === 'dark' ? 'dark' : 'light'
    }
    return theme
  }, [customTheme, activeTheme])

  /**
   * 处理代码变化
   */
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode)
    onChange?.(newCode)
  }, [onChange])

  /**
   * 处理保存
   */
  const handleSave = useCallback((newCode: string) => {
    onSave?.(newCode)
    console.log('代码已保存:', newCode.substring(0, 100) + '...')
  }, [onSave])

  /**
   * 处理验证
   */
  const handleValidate = useCallback((validationResult: any) => {
    setValidation(validationResult)
  }, [])

  /**
   * 处理光标位置变化
   */
  const handleCursorPositionChange = useCallback((position: { line: number; column: number }) => {
    setCursorPosition(position)
  }, [])

  /**
   * 处理错误
   */
  const handleError = useCallback((error: Error) => {
    console.error('Monaco Editor Error:', error)
    onError?.(error)
  }, [onError])

  /**
   * 预加载编辑器
   */
  useEffect(() => {
    // 在组件挂载时预加载
    preload()
  }, [preload])

  /**
   * 语言切换
   */
  const switchLanguage = useCallback((newLanguage: typeof language) => {
    setLanguage(newLanguage)
  }, [])

  /**
   * 重置代码
   */
  const resetCode = useCallback(() => {
    setCode(initialCode)
  }, [initialCode])

  /**
   * 格式化代码
   */
  const formatCode = useCallback(() => {
    // 格式化逻辑通过编辑器内部处理
    console.log('格式化代码')
  }, [])

  return (
    <motion.div
      className={`monaco-editor-wrapper ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 完整界面 */}
      {showFullInterface && (
        <>
          {/* 头部工具栏 */}
          <div className="border-b bg-muted/30 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold">代码编辑器</h3>
                <span className="text-xs text-muted-foreground px-2 py-0.5 bg-background rounded">
                  Monaco Editor v{isPreloaded ? '0.45+' : '...'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* 语言选择 */}
                <select
                  value={language}
                  onChange={(e) => switchLanguage(e.target.value as typeof language)}
                  className="text-xs px-2 py-1 border rounded bg-background"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="tsx">TSX</option>
                  <option value="jsx">JSX</option>
                  <option value="css">CSS</option>
                  <option value="json">JSON</option>
                </select>

                {/* 操作按钮 */}
                <button
                  onClick={resetCode}
                  className="text-xs px-2 py-1 hover:bg-muted rounded"
                  title="重置代码"
                >
                  重置
                </button>

                <button
                  onClick={formatCode}
                  className="text-xs px-2 py-1 hover:bg-muted rounded"
                  title="格式化代码"
                >
                  格式化
                </button>

                <button
                  onClick={() => onSave?.(code)}
                  className="text-xs px-2 py-1 hover:bg-muted rounded"
                  title="保存代码 (Ctrl+S)"
                >
                  保存
                </button>
              </div>
            </div>
          </div>

          {/* 状态栏 */}
          <div className="border-t bg-muted/20 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>
                  行 {cursorPosition.line}, 列 {cursorPosition.column}
                </span>
                <span>语言: {language.toUpperCase()}</span>
                <span>字符: {code.length}</span>
                <span>行数: {code.split('\n').length}</span>
              </div>
              <div className="flex items-center space-x-4">
                {validation && (
                  <>
                    <span className="text-destructive">
                      {validation.errors?.length || 0} 错误
                    </span>
                    <span className="text-yellow-600">
                      {validation.warnings?.length || 0} 警告
                    </span>
                  </>
                )}
                <span className="text-green-600">
                  ✓ {isEditorReady ? '就绪' : '加载中...'}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 编辑器主体 */}
      <div className="flex-1 relative">
        <LazyMonacoEditor
          value={code}
          config={{
            language,
            ...config
          }}
          height={height}
          readOnly={readOnly}
          events={{
            onChange: handleCodeChange,
            onSave: handleSave,
            onValidate: enableValidation ? handleValidate : undefined,
            onCursorPositionChange: handleCursorPositionChange,
            onError: handleError
          }}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">
                  正在加载 Monaco 编辑器...
                </p>
              </div>
            </div>
          }
        />
      </div>

      {/* 主题适配器 */}
      {enableThemeAdapter && (
        <MonacoThemeAdapter
          theme={sevenAxisTheme}
          monaco={null} // 由编辑器内部传递
          editor={null} // 由编辑器内部传递
          autoApply={true}
        />
      )}

      {/* 验证结果显示 */}
      {showFullInterface && enableValidation && validation && (
        <AnimatePresence>
          {(validation.errors?.length > 0 || validation.warnings?.length > 0) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t bg-muted/10 max-h-40 overflow-y-auto"
            >
              <div className="p-3 space-y-2">
                {validation.errors?.map((error: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start space-x-2 text-xs text-destructive"
                  >
                    <span>❌</span>
                    <span>
                      第{error.line}行:{error.column}
                    </span>
                    <span>{error.message}</span>
                  </motion.div>
                ))}
                {validation.warnings?.map((warning: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start space-x-2 text-xs text-yellow-600"
                  >
                    <span>⚠️</span>
                    <span>
                      第{warning.line}行:{warning.column}
                    </span>
                    <span>{warning.message}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}

// ============================================================================
// 导出
// ============================================================================

export default MonacoEditorWrapper
