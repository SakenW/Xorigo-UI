/**
 * @fileoverview Props Editor - 属性编辑器组件
 * 支持多种类型的属性编辑 (string, number, boolean, select, color)
 */

'use client'

import { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'

// ===== 类型定义 =====

export type PropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'color'
  | 'range'
  | 'json'

export interface PropDefinition {
  key: string
  type: PropType
  label: string
  defaultValue: any
  options?: string[] | number[] // 用于 select 类型
  min?: number // 用于 number/range 类型
  max?: number
  step?: number
  description?: string
  required?: boolean
}

export interface PropsEditorProps {
  propDefinitions: PropDefinition[]
  currentProps: Record<string, any>
  onPropChange: (key: string, value: any) => void
  onReset?: () => void
}

// ===== 主组件 =====

export function PropsEditor({
  propDefinitions,
  currentProps,
  onPropChange,
  onReset,
}: PropsEditorProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // 过滤属性定义
  const filteredProps = useMemo(() => {
    if (!searchQuery) return propDefinitions

    const query = searchQuery.toLowerCase()
    return propDefinitions.filter(
      (prop) =>
        prop.key.toLowerCase().includes(query) ||
        prop.label.toLowerCase().includes(query) ||
        prop.description?.toLowerCase().includes(query)
    )
  }, [propDefinitions, searchQuery])

  // 渲染单个属性编辑器
  const renderPropEditor = useCallback(
    (prop: PropDefinition) => {
      const value = currentProps[prop.key] ?? prop.defaultValue

      switch (prop.type) {
        case 'string':
          return (
            <StringEditor
              value={value}
              onChange={(newValue) => onPropChange(prop.key, newValue)}
            />
          )

        case 'number':
          return (
            <NumberEditor
              value={value}
              min={prop.min}
              max={prop.max}
              step={prop.step}
              onChange={(newValue) => onPropChange(prop.key, newValue)}
            />
          )

        case 'boolean':
          return (
            <BooleanEditor
              value={value}
              onChange={(newValue) => onPropChange(prop.key, newValue)}
            />
          )

        case 'select':
          return (
            <SelectEditor
              value={value}
              options={prop.options || []}
              onChange={(newValue) => onPropChange(prop.key, newValue)}
            />
          )

        case 'color':
          return (
            <ColorEditor
              value={value}
              onChange={(newValue) => onPropChange(prop.key, newValue)}
            />
          )

        case 'range':
          return (
            <RangeEditor
              value={value}
              min={prop.min ?? 0}
              max={prop.max ?? 100}
              step={prop.step ?? 1}
              onChange={(newValue) => onPropChange(prop.key, newValue)}
            />
          )

        case 'json':
          return (
            <JsonEditor
              value={value}
              onChange={(newValue) => onPropChange(prop.key, newValue)}
            />
          )

        default:
          return <div className="text-muted-foreground text-sm">不支持的类型</div>
      }
    },
    [currentProps, onPropChange]
  )

  return (
    <div className="h-full flex flex-col bg-background">
      {/* 头部 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">属性编辑器</h3>
          {onReset && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              重置
            </Button>
          )}
        </div>

        {/* 搜索框 */}
        <input
          type="text"
          placeholder="搜索属性..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* 属性列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredProps.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {searchQuery ? '未找到匹配的属性' : '没有可编辑的属性'}
          </div>
        ) : (
          filteredProps.map((prop) => (
            <div key={prop.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {prop.label}
                  {prop.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </label>
                <span className="text-xs text-muted-foreground">{prop.type}</span>
              </div>

              {prop.description && (
                <p className="text-xs text-muted-foreground">{prop.description}</p>
              )}

              {renderPropEditor(prop)}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ===== 子编辑器组件 =====

interface EditorProps<T> {
  value: T
  onChange: (value: T) => void
}

function StringEditor({ value, onChange }: EditorProps<string>) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    />
  )
}

function NumberEditor({
  value,
  min,
  max,
  step,
  onChange,
}: EditorProps<number> & { min?: number; max?: number; step?: number }) {
  return (
    <input
      type="number"
      value={value ?? 0}
      min={min}
      max={max}
      step={step ?? 1}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    />
  )
}

function BooleanEditor({ value, onChange }: EditorProps<boolean>) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 rounded border-border text-primary-500 focus:ring-2 focus:ring-primary-500"
      />
      <span className="text-sm">{value ? '启用' : '禁用'}</span>
    </label>
  )
}

function SelectEditor({
  value,
  options,
  onChange,
}: EditorProps<string | number> & { options: (string | number)[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

function ColorEditor({ value, onChange }: EditorProps<string>) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-10 border border-border rounded cursor-pointer"
      />
      <input
        type="text"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
  )
}

function RangeEditor({
  value,
  min,
  max,
  step,
  onChange,
}: EditorProps<number> & { min: number; max: number; step: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {min}
        </span>
        <span className="font-medium">{value ?? min}</span>
        <span className="text-muted-foreground">
          {max}
        </span>
      </div>
      <input
        type="range"
        value={value ?? min}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
      />
    </div>
  )
}

function JsonEditor({ value, onChange }: EditorProps<any>) {
  const [jsonString, setJsonString] = useState(JSON.stringify(value, null, 2))
  const [error, setError] = useState<string | null>(null)

  const handleChange = (newValue: string) => {
    setJsonString(newValue)
    try {
      const parsed = JSON.parse(newValue)
      onChange(parsed)
      setError(null)
    } catch (err) {
      setError('JSON 格式错误')
    }
  }

  return (
    <div className="space-y-2">
      <textarea
        value={jsonString}
        onChange={(e) => handleChange(e.target.value)}
        rows={5}
        className="w-full px-3 py-2 text-sm font-mono border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
