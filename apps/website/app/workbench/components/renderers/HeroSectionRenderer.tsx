/**
 * HeroSection 组件预览渲染器
 * 首屏区块，重要展示区域
 */

'use client'

import React, { useState } from 'react'

interface HeroSectionRendererProps {
  component: any
  previewProps: Record<string, any>
  updatePreviewProp: (prop: string, value: any) => void
  isInteractiveMode: boolean
  setIsInteractiveMode: (mode: boolean) => void
  resetPreviewProps: () => void
}

export default function HeroSectionRenderer({
  component,
  previewProps,
  updatePreviewProp,
  isInteractiveMode,
  setIsInteractiveMode,
  resetPreviewProps
}: HeroSectionRendererProps) {
  const [layout, setLayout] = useState('center')
  const [variant, setVariant] = useState('default')

  const handleLayoutChange = (value: string) => {
    setLayout(value)
    updatePreviewProp('layout', value)
  }

  const handleVariantChange = (value: string) => {
    setVariant(value)
    updatePreviewProp('variant', value)
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* 控制面板 */}
      {isInteractiveMode && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              HeroSection 配置
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  布局
                </label>
                <select
                  value={layout}
                  onChange={(e) => handleLayoutChange(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full"
                >
                  <option value="center">居中</option>
                  <option value="left">左对齐</option>
                  <option value="right">右对齐</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  样式
                </label>
                <select
                  value={variant}
                  onChange={(e) => handleVariantChange(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 w-full"
                >
                  <option value="default">默认</option>
                  <option value="minimal">极简</option>
                  <option value="gradient">渐变</option>
                  <option value="dark">深色</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 组件预览区域 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className={`w-full max-w-2xl mx-auto rounded-lg border border-gray-200 dark:border-gray-700 p-12 ${
          variant === 'dark'
            ? 'bg-gray-900 text-white'
            : variant === 'gradient'
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
            : variant === 'minimal'
            ? 'bg-white text-gray-900'
            : 'bg-blue-500 text-white'
        }`}>
          <div className={`text-center ${layout === 'center' ? '' : layout === 'left' ? 'text-left' : 'text-right'}`}>
            <h1 className={`mb-4 ${
              variant === 'minimal' ? 'text-3xl font-bold' : 'text-4xl font-bold'
            }`}>
              Xorigo UI 设计系统
            </h1>
            <p className={`mb-6 ${
              variant === 'minimal' ? 'text-lg' : 'text-xl'
            } max-w-md mx-auto ${
              variant === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              企业级 React 组件库，助力打造卓越的数字产品体验
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className={`px-6 py-3 rounded-lg font-medium ${
                variant === 'minimal'
                  ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}>
                开始使用
              </button>
              <button className={`px-6 py-3 rounded-lg font-medium ${
                variant === 'minimal'
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'border border-white/25 text-white hover:bg-white/25'
              }`}>
                查看文档
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