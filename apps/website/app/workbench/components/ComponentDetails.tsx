'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ComponentExample } from '@/types/workbench'
import ComponentPreview from './ComponentPreview'

interface ComponentDetailsProps {
  component: ComponentExample
  onClose: () => void
}

export default function ComponentDetails({ component, onClose }: ComponentDetailsProps) {
  const [previewProps, setPreviewProps] = React.useState<Record<string, any>>({})
  const [isInteractiveMode, setIsInteractiveMode] = React.useState(false)

  // 初始化组件属性
  React.useEffect(() => {
    const initializeProps = () => {
      const props: Record<string, any> = {}
      if (component.props) {
        component.props.forEach(prop => {
          const defaultValue = getPropDefault(prop)
          props[prop] = defaultValue === 'undefined' ? undefined :
                        defaultValue === 'false' ? false :
                        defaultValue === 'true' ? true :
                        defaultValue.startsWith('"') ? defaultValue.slice(1, -1) :
                        defaultValue
        })
      }
      setPreviewProps(props)
    }

    initializeProps()
  }, [component])

  const getPropDefault = (prop: string): string => {
    const defaultMap: Record<string, string> = {
      'placeholder': '""',
      'value': 'undefined',
      'onChange': 'undefined',
      'disabled': 'false',
      'showPassword': 'false',
      'strength': 'true',
      'min': 'undefined',
      'max': 'undefined',
      'step': '1',
      'precision': 'undefined',
      'validation': 'undefined',
      'domains': '[]',
      'countryCode': '"+86"',
      'format': 'international',
      'options': '[]',
      'multiple': 'false',
      'searchable': 'false',
      'checked': 'false',
      'indeterminate': 'false',
      'selected': 'undefined',
      'size': '"md"',
      'columns': '12',
      'gap': '"md"',
      'responsive': '{}',
      'gutter': '"md"',
      'align': '"start"',
      'justify': '"start"',
      'span': 'undefined',
      'offset': '0'
    }
    return defaultMap[prop] || 'undefined'
  }

  const updatePreviewProp = (prop: string, value: any) => {
    setPreviewProps(prev => ({
      ...prev,
      [prop]: value
    }))
  }

  const resetPreviewProps = () => {
    const props: Record<string, any> = {}
    if (component.props) {
      component.props.forEach(prop => {
        const defaultValue = getPropDefault(prop)
        props[prop] = defaultValue === 'undefined' ? undefined :
                      defaultValue === 'false' ? false :
                      defaultValue === 'true' ? true :
                      defaultValue.startsWith('"') ? defaultValue.slice(1, -1) :
                      defaultValue
      })
    }
    setPreviewProps(props)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        {/* 背景遮罩 */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* 详情内容 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative inline-block w-full max-w-6xl p-6 my-8 text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl"
        >
          {/* 头部 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {component.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {component.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧信息 */}
            <div className="lg:col-span-1 space-y-6">
              {/* 基本信息 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">基本信息</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">分类</dt>
                    <dd className="text-sm text-gray-900 dark:text-white">{component.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">类型</dt>
                    <dd className="text-sm text-gray-900 dark:text-white">{component.element}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Props 数量</dt>
                    <dd className="text-sm text-gray-900 dark:text-white">{component.props?.length || 0} 个</dd>
                  </div>
                </dl>
              </div>

              {/* Props 表格 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Props</h3>
                <div className="space-y-2">
                  {component.props?.map((prop, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {prop}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getPropType(prop)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 使用示例 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">使用示例</h3>
                <pre className="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
                  {`<${component.name} ${Object.entries(previewProps)
                    .filter(([_, value]) => value !== undefined)
                    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
                    .join(' ')
                  } />`}
                </pre>
              </div>
            </div>

            {/* 右侧预览 */}
            <div className="lg:col-span-2">
              <ComponentPreview
                component={component}
                previewProps={previewProps}
                updatePreviewProp={updatePreviewProp}
                isInteractiveMode={isInteractiveMode}
                setIsInteractiveMode={setIsInteractiveMode}
                resetPreviewProps={resetPreviewProps}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function getPropType(prop: string): string {
  const typeMap: Record<string, string> = {
    'placeholder': 'string',
    'value': 'string',
    'onChange': 'function',
    'disabled': 'boolean',
    'showPassword': 'boolean',
    'strength': 'boolean',
    'min': 'number',
    'max': 'number',
    'step': 'number',
    'precision': 'number',
    'validation': 'function',
    'domains': 'array',
    'countryCode': 'string',
    'format': 'string',
    'options': 'array',
    'multiple': 'boolean',
    'searchable': 'boolean',
    'checked': 'boolean',
    'indeterminate': 'boolean',
    'selected': 'string',
    'size': 'string',
    'columns': 'number',
    'gap': 'string',
    'responsive': 'object',
    'gutter': 'string',
    'align': 'string',
    'justify': 'string',
    'span': 'number',
    'offset': 'number'
  }
  return typeMap[prop] || 'any'
}