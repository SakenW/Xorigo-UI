/**
 * ChartTooltip 组件预览渲染器
 * 图表提示框，显示数据详情
 */

'use client'

import React, { useState } from 'react'

interface ChartTooltipRendererProps {
  component: any
  previewProps: Record<string, any>
  updatePreviewProp: (prop: string, value: any) => void
  isInteractiveMode: boolean
  setIsInteractiveMode: (mode: boolean) => void
  resetPreviewProps: () => void
}

export default function ChartTooltipRenderer({
  component,
  previewProps,
  updatePreviewProp,
  isInteractiveMode,
  setIsInteractiveMode,
  resetPreviewProps
}: ChartTooltipRendererProps) {
  const [variant, setVariant] = useState('dark')
  const [position, setPosition] = useState('top')

  const handleVariantChange = (value: string) => {
    setVariant(value)
    updatePreviewProp('variant', value)
  }

  const handlePositionChange = (value: string) => {
    setPosition(value)
    updatePreviewProp('position', value)
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* 控制面板 */}
      {isInteractiveMode && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              ChartTooltip 配置
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  主题
                </label>
                <select
                  value={variant}
                  onChange={(e) => handleVariantChange(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full"
                >
                  <option value="dark">深色</option>
                  <option value="light">浅色</option>
                  <option value="auto">自动</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  位置
                </label>
                <select
                  value={position}
                  onChange={(e) => handlePositionChange(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full"
                >
                  <option value="top">顶部</option>
                  <option value="bottom">底部</option>
                  <option value="left">左侧</option>
                  <option value="right">右侧</option>
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
              💡
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              ChartTooltip
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              图表提示框，显示数据详情
            </p>

            <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 mb-4">
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>分类: charts</div>
                <div>主题: <span className="font-medium text-blue-600">{variant}</span></div>
                <div>位置: <span className="font-medium text-green-600">{position}</span></div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className={`
                inline-flex items-center px-3 py-2 rounded-lg shadow-lg text-sm
                ${variant === 'dark'
                  ? 'bg-gray-900 text-white border border-gray-700'
                  : variant === 'light'
                  ? 'bg-white text-gray-900 border border-gray-200'
                  : 'bg-blue-500 text-white border border-blue-600'
                }
              `}>
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <div className="text-left">
                  <div className="font-medium">销售额: ¥125,000</div>
                  <div className="text-xs opacity-75">2024年1月</div>
                </div>
              </div>
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