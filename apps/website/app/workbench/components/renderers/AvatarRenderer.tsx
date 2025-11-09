/**
 * Avatar 组件预览渲染器
 * 自动生成于: 2025-11-09
 * 分类: data-display
 * 使用频率: 9
 */

'use client'

import React, { useState } from 'react'

interface AvatarRendererProps {
  component: any
  previewProps: Record<string, any>
  updatePreviewProp: (prop: string, value: any) => void
  isInteractiveMode: boolean
  setIsInteractiveMode: (mode: boolean) => void
  resetPreviewProps: () => void
}

export default function AvatarRenderer({
  component,
  previewProps,
  updatePreviewProp,
  isInteractiveMode,
  setIsInteractiveMode,
  resetPreviewProps
}: AvatarRendererProps) {
  const [variant, setVariant] = useState('default')
  const [size, setSize] = useState('md')
  const [disabled, setDisabled] = useState(false)

  const handleVariantChange = (value: string) => {
    setVariant(value)
    updatePreviewProp('variant', value)
  }

  const handleSizeChange = (value: string) => {
    setSize(value)
    updatePreviewProp('size', value)
  }

  const handleDisabledChange = (value: boolean) => {
    setDisabled(value)
    updatePreviewProp('disabled', value)
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* 控制面板 */}
      {isInteractiveMode && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Avatar 配置
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  变体
                </label>
                <select
                  value={variant}
                  onChange={(e) => handleVariantChange(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full"
                >
                  <option value="default">默认</option>
                  <option value="outline">轮廓</option>
                  <option value="filled">填充</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  尺寸
                </label>
                <select
                  value={size}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full"
                >
                  <option value="sm">小</option>
                  <option value="md">中</option>
                  <option value="lg">大</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  状态
                </label>
                <select
                  value={disabled ? 'disabled' : 'enabled'}
                  onChange={(e) => handleDisabledChange(e.target.value === 'disabled')}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full"
                >
                  <option value="enabled">启用</option>
                  <option value="disabled">禁用</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 组件预览区域 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">
              📊
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              LineChart
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              折线图，展示数据趋势
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 mb-4">
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>分类: charts</div>
                <div>变体: <span className="font-medium">{variant}</span></div>
                <div>尺寸: <span className="font-medium">{size}</span></div>
                <div>状态: <span className="font-medium">{disabled ? '禁用' : '启用'}</span></div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className={"px-4 py-2 rounded text-sm font-medium " + get_variant_classes(variant, disabled)}>
                示例 LineChart
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 交互模式切换 */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-2 flex justify-center">
        <button
          onClick={() => setIsInteractiveMode(!isInteractiveMode)}
          className={"text-xs px-3 py-1 rounded transition-colors " + (
            isInteractiveMode
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          )}
        >
          {isInteractiveMode ? '关闭' : '开启'} 交互模式
        </button>
      </div>
    </div>
  )
}

function get_component_emoji(category: string): string {
  switch (category) {
    case 'charts': return '📊'
    case 'blocks': return '🧱'
    case 'data-display': return '📋'
    case 'input-enhanced': return '🎛️'
    case 'feedback-motion': return '💬'
    case 'navigation': return '🧭'
    case 'layout': return '📐'
    default: return '🧩'
  }
}

function get_variant_classes(variant: string, disabled: boolean): string {
  const baseClasses = 'transition-colors '

  if (disabled) {
    return baseClasses + 'bg-gray-200 text-gray-400 cursor-not-allowed'
  }

  switch (variant) {
    case 'default':
      return baseClasses + 'bg-blue-500 text-white hover:bg-blue-600'
    case 'outline':
      return baseClasses + 'border border-blue-500 text-blue-500 hover:bg-blue-50'
    case 'filled':
      return baseClasses + 'bg-blue-100 text-blue-700 hover:bg-blue-200'
    default:
      return baseClasses + 'bg-gray-500 text-white hover:bg-gray-600'
  }
}
