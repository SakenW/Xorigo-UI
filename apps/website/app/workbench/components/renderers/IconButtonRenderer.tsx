/**
 * IconButton 组件预览渲染器
 * 图标按钮，带图标的按钮
 */

'use client'

import React, { useState } from 'react'

interface IconButtonRendererProps {
  component: any
  previewProps: Record<string, any>
  updatePreviewProp: (prop: string, value: any) => void
  isInteractiveMode: boolean
  setIsInteractiveMode: (mode: boolean) => void
  resetPreviewProps: () => void
}

export default function IconButtonRenderer({
  component,
  previewProps,
  updatePreviewProp,
  isInteractiveMode,
  setIsInteractiveMode,
  resetPreviewProps
}: IconButtonRendererProps) {
  const [variant, setVariant] = useState('solid')
  const [size, setSize] = useState('md')
  const [icon, setIcon] = useState('star')

  const handleVariantChange = (value: string) => {
    setVariant(value)
    updatePreviewProp('variant', value)
  }

  const handleSizeChange = (value: string) => {
    setSize(value)
    updatePreviewProp('size', value)
  }

  const handleIconChange = (value: string) => {
    setIcon(value)
    updatePreviewProp('icon', value)
  }

  const getIcon = (iconName: string): string => {
    const iconMap: Record<string, string> = {
      'star': '⭐',
      'heart': '❤️',
      'search': '🔍',
      'download': '⬇️',
      'upload': '⬆️',
      'trash': '🗑️',
      'edit': '✏️',
      'plus': '➕',
      'minus': '➖',
      'check': '✅',
      'close': '❌',
      'menu': '☰'
    }
    return iconMap[iconName] || '⭐'
  }

  const getSizeClasses = (size: string): string => {
    const sizeMap = {
      'xs': 'p-1 text-sm',
      'sm': 'p-2 text-base',
      'md': 'p-3 text-lg',
      'lg': 'p-4 text-xl',
      'xl': 'p-6 text-2xl'
    }
    return sizeMap[size] || 'p-3 text-lg'
  }

  const getVariantClasses = (variant: string): string => {
    const variantMap = {
      'solid': 'bg-blue-500 text-white hover:bg-blue-600',
      'outline': 'border border-blue-500 text-blue-500 hover:bg-blue-50',
      'ghost': 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
      'link': 'text-blue-600 hover:text-blue-700 underline',
      'danger': 'bg-red-500 text-white hover:bg-red-600'
    }
    return variantMap[variant] || 'bg-blue-500 text-white hover:bg-blue-600'
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* 控制面板 */}
      {isInteractiveMode && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              IconButton 配置
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
                  <option value="solid">实心</option>
                  <option value="outline">轮廓</option>
                  <option value="ghost">幽灵</option>
                  <option value="link">链接</option>
                  <option value="danger">危险</option>
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
                  <option value="xs">超小</option>
                  <option value="sm">小</option>
                  <option value="md">中</option>
                  <option value="lg">大</option>
                  <option value="xl">超大</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  图标
                </label>
                <select
                  value={icon}
                  onChange={(e) => handleIconChange(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full"
                >
                  <option value="star">⭐ 星星</option>
                  <option value="heart">❤️ 爱心</option>
                  <option value="search">🔍 搜索</option>
                  <option value="download">⬇️ 下载</option>
                  <option value="upload">⬆️ 上传</option>
                  <option value="trash">🗑️ 删除</option>
                  <option value="edit">✏️ 编辑</option>
                  <option value="plus">➕ 加号</option>
                  <option value="minus">➖ 减号</option>
                  <option value="check">✅ 对勾</option>
                  <option value="close">❌ 关闭</option>
                  <option value="menu">☰ 菜单</option>
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
              🎯
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              IconButton
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              图标按钮，带图标的按钮
            </p>

            <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 mb-4">
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>分类: others</div>
                <div>变体: <span className="font-medium text-blue-600">{variant}</span></div>
                <div>尺寸: <span className="font-medium text-green-600">{size}</span></div>
                <div>图标: <span className="font-medium text-purple-600">{getIcon(icon)}</span></div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                className={`rounded-lg transition-colors ${getSizeClasses(size)} ${getVariantClasses(variant)}`}
              >
                {getIcon(icon)}
              </button>
              <button
                className={`rounded-lg transition-colors ${getSizeClasses(size)} ${getVariantClasses(variant)}`}
              >
                {getIcon(icon)}
                <span className="ml-2">按钮</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 交互模式切换 */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-2 flex justify-center">
        <button
          onClick={() => setIsInteractiveMode(!isInteractiveMode)}
          className={`text-xs px-3 py-1 rounded transition-colors ${
            isInteractiveMode
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {isInteractiveMode ? '关闭' : '开启'} 交互模式
        </button>
      </div>
    </div>
  )
}