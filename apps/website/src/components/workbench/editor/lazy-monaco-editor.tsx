/**
 * 懒加载 Monaco 编辑器
 * 使用 React.lazy 和 Suspense 实现按需加载，优化首屏加载性能
 */

'use client'

import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'

// 预加载所有 Monaco 相关模块
const EnhancedMonacoEditor = lazy(() =>
  import('./enhanced-monaco-editor').then(module => ({
    default: module.EnhancedMonacoEditor
  }))
)

const MonacoThemeAdapter = lazy(() =>
  import('./monaco-theme-adapter').then(module => ({
    default: module.MonacoThemeAdapter
  }))
)

// ============================================================================
// 懒加载包装器属性
// ============================================================================

export interface LazyMonacoEditorProps {
  /** 传递给编辑器的所有属性 */
  [key: string]: any
}

// ============================================================================
// 加载指示器
// ============================================================================

/**
 * 编辑器加载状态组件
 */
function EditorLoader({
  height = 600,
  message = '正在加载 Monaco 编辑器...'
}: {
  height?: number | string
  message?: string
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center bg-muted/10 border border-dashed border-muted-foreground/20 rounded-lg"
      style={{
        height: typeof height === 'number' ? `${height}px` : height
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* 旋转的加载图标 */}
        <motion.div
          className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      {/* 加载文字 */}
      <motion.p
        className="mt-4 text-sm text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
    </motion.div>
  )
}

// ============================================================================
// 懒加载 Monaco 编辑器组件
// ============================================================================

/**
 * 懒加载 Monaco 编辑器
 * 提供完整的编辑器功能，同时优化加载性能
 */
export function LazyMonacoEditor(props: LazyMonacoEditorProps) {
  const { height = 600, loading, ...editorProps } = props

  const defaultLoading = (
    <EditorLoader
      height={height}
      message="正在初始化 Monaco 编辑器..."
    />
  )

  return (
    <Suspense fallback={loading || defaultLoading}>
      <EnhancedMonacoEditor
        {...editorProps}
        height={height}
        loading={undefined}
      />
    </Suspense>
  )
}

// ============================================================================
// 导出
// ============================================================================

export default LazyMonacoEditor
