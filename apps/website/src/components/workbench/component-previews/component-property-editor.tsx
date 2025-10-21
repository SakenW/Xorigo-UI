/**
 * 组件属性编辑器
 * 提供实时属性编辑和预览功能
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Button, Input, Select, Checkbox, Switch, Card,
  Typography
} from '@xorigo-ui/core'

interface ComponentPropertyEditorProps {
  component: {
    name: string
    category: string
    description: string
  }
  onPropertyChange?: (property: string, value: any) => void
  className?: string
}

/**
 * 组件属性编辑器
 */
export function ComponentPropertyEditor({
  component,
  onPropertyChange,
  className = ''
}: ComponentPropertyEditorProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [properties, setProperties] = useState<Record<string, any>>({})

  // 根据组件类型生成属性配置
  const getPropertyConfig = () => {
    const configs: Record<string, any> = {
      'Button': {
        basic: [
          { name: 'variant', type: 'select', label: '变体', options: ['primary', 'secondary', 'success', 'warning', 'danger', 'ghost', 'link', 'outline'], default: 'primary' },
          { name: 'size', type: 'select', label: '尺寸', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'], default: 'md' },
          { name: 'disabled', type: 'switch', label: '禁用状态', default: false },
          { name: 'loading', type: 'switch', label: '加载状态', default: false },
          { name: 'fullWidth', type: 'switch', label: '全宽', default: false },
          { name: 'text', type: 'input', label: '按钮文本', default: '按钮' }
        ],
        advanced: [
          { name: 'leftIcon', type: 'input', label: '左图标', default: '' },
          { name: 'rightIcon', type: 'input', label: '右图标', default: '' },
          { name: 'iconOnly', type: 'switch', label: '仅图标', default: false },
          { name: 'ariaLabel', type: 'input', label: 'ARIA 标签', default: '' }
        ]
      },
      'Input': {
        basic: [
          { name: 'variant', type: 'select', label: '变体', options: ['default', 'filled', 'outlined', 'underlined', 'ghost', 'neon'], default: 'default' },
          { name: 'size', type: 'select', label: '尺寸', options: ['sm', 'md', 'lg'], default: 'md' },
          { name: 'placeholder', type: 'input', label: '占位符', default: '请输入内容' },
          { name: 'disabled', type: 'switch', label: '禁用状态', default: false },
          { name: 'required', type: 'switch', label: '必填', default: false }
        ],
        advanced: [
          { name: 'label', type: 'input', label: '标签', default: '' },
          { name: 'error', type: 'input', label: '错误信息', default: '' },
          { name: 'helpText', type: 'input', label: '帮助文本', default: '' },
          { name: 'maxLength', type: 'number', label: '最大长度', default: null },
          { name: 'clearable', type: 'switch', label: '可清除', default: false },
          { name: 'showPasswordToggle', type: 'switch', label: '显示密码切换', default: false }
        ]
      },
      'Card': {
        basic: [
          { name: 'variant', type: 'select', label: '变体', options: ['default', 'outlined', 'elevated', 'filled'], default: 'default' },
          { name: 'padding', type: 'select', label: '内边距', options: ['none', 'sm', 'md', 'lg'], default: 'md' },
          { name: 'shadow', type: 'switch', label: '显示阴影', default: true },
          { name: 'border', type: 'switch', label: '显示边框', default: true }
        ],
        advanced: [
          { name: 'borderRadius', type: 'select', label: '圆角', options: ['none', 'sm', 'md', 'lg', 'full'], default: 'md' },
          { name: 'backgroundColor', type: 'color', label: '背景色', default: '' },
          { name: 'hoverable', type: 'switch', label: '可悬停', default: true }
        ]
      },
      // Badge 组件不存在，已移除配置
      'Alert': {
        basic: [
          { name: 'variant', type: 'select', label: '变体', options: ['info', 'success', 'warning', 'error'], default: 'info' },
          { name: 'title', type: 'input', label: '标题', default: '' },
          { name: 'message', type: 'textarea', label: '消息内容', default: '这是一条提示信息' },
          { name: 'closable', type: 'switch', label: '可关闭', default: false }
        ],
        advanced: [
          { name: 'icon', type: 'switch', label: '显示图标', default: true },
          { name: 'duration', type: 'number', label: '自动关闭时间(ms)', default: null },
          { name: 'action', type: 'input', label: '操作按钮文本', default: '' }
        ]
      },
      'Typography': {
        basic: [
          { name: 'variant', type: 'select', label: '变体', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'small', 'strong', 'em', 'code'], default: 'p' },
          { name: 'color', type: 'select', label: '颜色', options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'info'], default: 'default' },
          { name: 'text', type: 'input', label: '文本内容', default: '这是一段文本' }
        ],
        advanced: [
          { name: 'align', type: 'select', label: '对齐方式', options: ['left', 'center', 'right', 'justify'], default: 'left' },
          { name: 'weight', type: 'select', label: '字重', options: ['light', 'normal', 'medium', 'semibold', 'bold'], default: 'normal' },
          { name: 'size', type: 'select', label: '字体大小', options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'], default: 'base' }
        ]
      }
    }

    return configs[component.name] || {
      basic: [
        { name: 'variant', type: 'select', label: '变体', options: ['default'], default: 'default' },
        { name: 'size', type: 'select', label: '尺寸', options: ['sm', 'md', 'lg'], default: 'md' },
        { name: 'disabled', type: 'switch', label: '禁用状态', default: false }
      ],
      advanced: []
    }
  }

  const config = getPropertyConfig()

  // 处理属性变化
  const handlePropertyChange = (propertyName: string, value: any) => {
    const newProperties = { ...properties, [propertyName]: value }
    setProperties(newProperties)
    onPropertyChange?.(propertyName, value)
  }

  // 渲染属性编辑器
  const renderPropertyEditor = (property: any) => {
    const value = properties[property.name] ?? property.default

    switch (property.type) {
      case 'select':
        return (
          <Select
            value={value}
            onChange={(e) => handlePropertyChange(property.name, e.target.value)}
            className="w-full"
          >
            {property.options.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        )

      case 'input':
        return (
          <Input
            value={value}
            onChange={(e) => handlePropertyChange(property.name, e.target.value)}
            placeholder={property.label}
            className="w-full"
          />
        )

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handlePropertyChange(property.name, e.target.value)}
            placeholder={property.label}
            className="w-full p-2 border rounded resize-none"
            rows={3}
          />
        )

      case 'switch':
        return (
          <Switch
            checked={value}
            onChange={(checked) => handlePropertyChange(property.name, checked)}
            label={property.label}
          />
        )

      case 'checkbox':
        return (
          <Checkbox
            checked={value}
            onChange={(e) => handlePropertyChange(property.name, e.target.checked)}
            label={property.label}
          />
        )

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handlePropertyChange(property.name, e.target.value ? Number(e.target.value) : null)}
            placeholder={property.label}
            className="w-full"
          />
        )

      case 'color':
        return (
          <Input
            type="color"
            value={value || '#000000'}
            onChange={(e) => handlePropertyChange(property.name, e.target.value)}
            className="w-full h-10"
          />
        )

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handlePropertyChange(property.name, e.target.value)}
            placeholder={property.label}
            className="w-full"
          />
        )
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 头部信息 */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {component.name} 属性编辑器
          </h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
            {component.category}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          实时调整组件属性，即时预览效果
        </p>
      </div>

      {/* 属性编辑标签页 */}
      <div className="space-y-6">
        {/* 标签页导航 */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'basic'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            基础属性
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'advanced'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            高级属性
          </button>
        </div>

        {/* 基础属性面板 */}
        {activeTab === 'basic' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {config.basic.map((property, index) => (
              <motion.div
                key={property.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {property.label}
                </label>
                {renderPropertyEditor(property)}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 高级属性面板 */}
        {activeTab === 'advanced' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {config.advanced.length > 0 ? (
              config.advanced.map((property, index) => (
                <motion.div
                  key={property.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {property.label}
                  </label>
                  {renderPropertyEditor(property)}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">⚙️</div>
                <p>该组件暂无高级属性配置</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* 属性预览 */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          当前属性配置
        </h4>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto">
            {JSON.stringify(properties, null, 2)}
          </pre>
        </div>
      </div>

      {/* 重置按钮 */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setProperties({})
            onPropertyChange?.('reset', null)
          }}
        >
          重置所有属性
        </Button>
      </div>
    </div>
  )
}

export default ComponentPropertyEditor