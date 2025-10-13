/**
 * @fileoverview Live Props Editor - 实时属性编辑模式
 * 包含历史记录 (Undo/Redo) 功能
 */

'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { useCurrentComponent, useHistory } from '@/stores/playground.store'
import { PropsEditor, type PropDefinition } from './props-editor'

// ===== 类型定义 =====

export interface LivePropsEditorProps {
  componentId: string
  propDefinitions: PropDefinition[]
}

// ===== 主组件 =====

export function LivePropsEditor({
  componentId,
  propDefinitions,
}: LivePropsEditorProps) {
  const { props, updateProp, resetProps } = useCurrentComponent() as {
    props: Record<string, any>
    updateProp: (key: string, value: any) => void
    resetProps: () => void
  }
  const { canUndo, canRedo, undo, redo } = useHistory() as {
    canUndo: boolean
    canRedo: boolean
    undo: () => void
    redo: () => void
  }

  // 统计已修改的属性数量
  const modifiedCount = useMemo(() => {
    return propDefinitions.filter((def) => {
      const currentValue = props[def.key]
      return currentValue !== undefined && currentValue !== def.defaultValue
    }).length
  }, [props, propDefinitions])

  return (
    <div className="h-full flex flex-col">
      {/* 头部工具栏 */}
      <div className="p-4 border-b border-border bg-background">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-lg">实时编辑</h3>
            {modifiedCount > 0 && (
              <Badge variant="default" className="text-xs">
                {modifiedCount} 项已修改
              </Badge>
            )}
          </div>
        </div>

        {/* 历史记录控制 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              title="撤销 (Ctrl+Z)"
            >
              <UndoIcon className="w-4 h-4" />
              <span className="ml-1">撤销</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              title="重做 (Ctrl+Shift+Z)"
            >
              <RedoIcon className="w-4 h-4" />
              <span className="ml-1">重做</span>
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={resetProps} title="重置所有属性">
            <RefreshIcon className="w-4 h-4" />
            <span className="ml-1">重置</span>
          </Button>
        </div>
      </div>

      {/* 属性编辑器 */}
      <div className="flex-1 overflow-hidden">
        <PropsEditor
          propDefinitions={propDefinitions}
          currentProps={props}
          onPropChange={updateProp}
          onReset={resetProps}
        />
      </div>

      {/* 底部信息 */}
      <div className="p-3 border-t border-border bg-muted">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>组件: {componentId}</span>
          <span>属性: {propDefinitions.length}</span>
        </div>
      </div>
    </div>
  )
}

// ===== 图标组件 =====

function UndoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  )
}

function RedoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
    </svg>
  )
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  )
}
