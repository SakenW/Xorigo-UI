'use client'

import React from 'react'

interface LayoutRendererProps {
  type?: 'row' | 'col' | 'grid'
  gap?: number
  padding?: number
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  updateProp?: (prop: string, value: any) => void
}

export default function LayoutRenderer({
  type = 'row',
  gap = 4,
  padding = 4,
  align = 'start',
  justify = 'start',
  updateProp
}: LayoutRendererProps) {
  const getLayoutClasses = () => {
    const gapClass = `gap-${gap}`
    const paddingClass = `p-${padding}`

    const alignClasses = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch'
    }

    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly'
    }

    if (type === 'row') {
      return `flex ${gapClass} ${paddingClass} ${alignClasses[align]} ${justifyClasses[justify]}`
    } else if (type === 'col') {
      return `flex flex-col ${gapClass} ${paddingClass} ${alignClasses[align]} ${justifyClasses[justify]}`
    } else {
      return `grid ${gapClass} ${paddingClass} ${alignClasses[align]} ${justifyClasses[justify]}`
    }
  }

  const sampleItems = Array.from({ length: type === 'grid' ? 6 : 3 }, (_, i) => (
    <div
      key={i}
      className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center font-medium shadow-md hover:shadow-lg transition-shadow"
      style={{
        height: type === 'row' ? '80px' : type === 'col' ? '60px' : '100px',
        width: type === 'col' ? '100%' : type === 'grid' ? '100%' : '120px'
      }}
    >
      {type === 'row' ? `项目 ${i + 1}` : type === 'col' ? `行 ${i + 1}` : `网格 ${i + 1}`}
    </div>
  ))

  return (
    <div className="w-full">
      {/* 布局展示 */}
      <div className="min-h-[200px] bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className={getLayoutClasses()} style={{
          gridTemplateColumns: type === 'grid' ? 'repeat(auto-fit, minmax(150px, 1fr))' : undefined
        }}>
          {sampleItems}
        </div>
      </div>

      {/* 配置面板 */}
      <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          布局配置
        </h4>

        <div className="grid grid-cols-2 gap-4">
          {/* 布局类型 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              布局类型
            </label>
            <select
              value={type}
              onChange={(e) => updateProp && updateProp('type', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            >
              <option value="row">水平布局 (Row)</option>
              <option value="col">垂直布局 (Column)</option>
              <option value="grid">网格布局 (Grid)</option>
            </select>
          </div>

          {/* 间距 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              间距 (gap)
            </label>
            <input
              type="range"
              min="0"
              max="8"
              value={gap}
              onChange={(e) => updateProp && updateProp('gap', Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {gap * 0.25}rem
            </div>
          </div>

          {/* 内边距 */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              内边距 (padding)
            </label>
            <input
              type="range"
              min="0"
              max="8"
              value={padding}
              onChange={(e) => updateProp && updateProp('padding', Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {padding * 0.25}rem
            </div>
          </div>

          {/* 对齐方式 (非grid时显示) */}
          {type !== 'grid' && (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                交叉轴对齐
              </label>
              <select
                value={align}
                onChange={(e) => updateProp && updateProp('align', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              >
                <option value="start">起始对齐</option>
                <option value="center">居中对齐</option>
                <option value="end">末尾对齐</option>
                <option value="stretch">拉伸填充</option>
              </select>
            </div>
          )}

          {/* 主轴对齐 (非grid时显示) */}
          {type !== 'grid' && (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                主轴对齐
              </label>
              <select
                value={justify}
                onChange={(e) => updateProp && updateProp('justify', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              >
                <option value="start">起始对齐</option>
                <option value="center">居中对齐</option>
                <option value="end">末尾对齐</option>
                <option value="between">两端对齐</option>
                <option value="around">环绕对齐</option>
                <option value="evenly">平均对齐</option>
              </select>
            </div>
          )}
        </div>

        {/* CSS类预览 */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
          <div className="text-xs font-mono text-gray-600 dark:text-gray-400">
            {getLayoutClasses()}
          </div>
        </div>
      </div>
    </div>
  )
}