'use client'

import React, { useState } from 'react'

interface ColorPickerRendererProps {
  value?: string
  onChange?: (value: string) => void
  presetColors?: string[]
  updateProp?: (prop: string, value: any) => void
}

export default function ColorPickerRenderer({
  value = '#3B82F6',
  onChange,
  presetColors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E', '#000000', '#6B7280', '#FFFFFF'
  ],
  updateProp
}: ColorPickerRendererProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState(value)

  const handleColorSelect = (color: string) => {
    if (onChange) onChange(color)
    if (updateProp) updateProp('value', color)
    setCustomColor(color)
    setIsOpen(false)
  }

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setCustomColor(color)
    if (onChange) onChange(color)
    if (updateProp) updateProp('value', color)
  }

  const isValidColor = (color: string) => {
    return /^#[0-9A-F]{6}$/i.test(color)
  }

  const getColorInfo = (color: string) => {
    if (!isValidColor(color)) return { rgb: '无效', hsl: '无效' }

    // 转换为RGB
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    const rgb = `rgb(${r}, ${g}, ${b})`

    // 转换为HSL
    const rNorm = r / 255
    const gNorm = g / 255
    const bNorm = b / 255

    const max = Math.max(rNorm, gNorm, bNorm)
    const min = Math.min(rNorm, gNorm, bNorm)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break
        case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break
        case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break
      }
    }

    const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
    return { rgb, hsl }
  }

  const colorInfo = getColorInfo(value)

  return (
    <div className="w-full">
      {/* 颜色选择器触发按钮 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-white dark:bg-gray-800"
        >
          <div
            className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: value }}
          />
          <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
            {value}
          </span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 预设颜色快速选择 */}
        <div className="flex items-center gap-1">
          {presetColors.slice(0, 8).map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorSelect(color)}
              className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* 颜色选择器弹窗 */}
      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-80">
          {/* 自定义颜色输入 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              自定义颜色
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-12 h-12 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  const color = e.target.value
                  setCustomColor(color)
                  if (isValidColor(color)) {
                    if (onChange) onChange(color)
                    if (updateProp) updateProp('value', color)
                  }
                }}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
              />
            </div>
          </div>

          {/* 预设颜色网格 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              预设颜色
            </label>
            <div className="grid grid-cols-10 gap-2">
              {presetColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorSelect(color)}
                  className={`
                    w-full aspect-square rounded border-2 transition-all
                    ${value === color
                      ? 'border-blue-500 scale-110 shadow-md'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }
                  `}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* 颜色信息 */}
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>HEX: {value}</div>
            <div>RGB: {colorInfo.rgb}</div>
            <div>HSL: {colorInfo.hsl}</div>
          </div>

          {/* 关闭按钮 */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 颜色信息显示 */}
      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">颜色预览</span>
          <div
            className="w-16 h-8 rounded border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: value }}
          />
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 grid grid-cols-3 gap-2">
          <div>HEX: {value}</div>
          <div className="truncate">{colorInfo.rgb}</div>
          <div className="truncate">{colorInfo.hsl}</div>
        </div>
      </div>
    </div>
  )
}