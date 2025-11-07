'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ComponentExample } from '@/types/workbench'

interface ComponentPreviewProps {
  component: ComponentExample
  previewProps: Record<string, any>
  updatePreviewProp: (prop: string, value: any) => void
  isInteractiveMode: boolean
  setIsInteractiveMode: (mode: boolean) => void
  resetPreviewProps: () => void
}

// 动态导入组件预览渲染器
const getComponentRenderer = async (componentName: string) => {
  try {
    const renderer = await import(`./renderers/${componentName}Renderer`)
    return renderer.default
  } catch (error) {
    console.warn(`Renderer for ${componentName} not found, using fallback`)
    return null
  }
}

export default function ComponentPreview({
  component,
  previewProps,
  updatePreviewProp,
  isInteractiveMode,
  setIsInteractiveMode,
  resetPreviewProps
}: ComponentPreviewProps) {
  const [renderer, setRenderer] = React.useState<React.ComponentType<any> | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadRenderer = async () => {
      setLoading(true)
      const Renderer = await getComponentRenderer(component.name)
      setRenderer(() => Renderer)
      setLoading(false)
    }

    loadRenderer()
  }, [component.name])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!renderer) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">组件预览暂不可用</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{component.name}</p>
        </div>
      </div>
    )
  }

  const Renderer = renderer

  return (
    <div className="space-y-6">
      {/* 模式切换 */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">组件预览</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsInteractiveMode(false)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              !isInteractiveMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            👁️ 预览模式
          </button>
          <button
            onClick={() => setIsInteractiveMode(true)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              isInteractiveMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            ✏️ 编辑模式
          </button>
          <button
            onClick={resetPreviewProps}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            🔄 重置
          </button>
        </div>
      </div>

      {/* 预览区域 */}
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <AnimatePresence mode="wait">
          <motion.div
            key={isInteractiveMode ? 'edit' : 'preview'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {isInteractiveMode ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Renderer
                    {...previewProps}
                    onChange={(value: any) => updatePreviewProp('value', value)}
                    onCheckedChange={(checked: boolean) => updatePreviewProp('checked', checked)}
                    onSelectedChange={(value: string) => updatePreviewProp('selected', value)}
                    updateProp={updatePreviewProp}
                  />
                </div>

                {/* 属性控制器 */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">属性控制</h4>
                  <div className="space-y-3">
                    {Object.entries(previewProps).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {key}:
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value)}
                          </span>
                          {typeof value === 'boolean' && (
                            <button
                              onClick={() => updatePreviewProp(key, !value)}
                              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              切换
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Renderer {...previewProps} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 当前属性值 */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">当前属性值</h4>
        <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
          {JSON.stringify(previewProps, null, 2)}
        </pre>
      </div>
    </div>
  )
}