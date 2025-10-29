/**
 * 增强组件预览系统
 * 为所有组件提供丰富的预览展示
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  // UI 基础组件 - 只导入实际存在的组件
  Button, Card, Surface,
  // 输入控件组件
  Input,
  // 表单组件
  // 导航组件
  // 数据展示组件
  // 反馈组件
  Alert, Loading, Progress,
} from '@xorigo-ui/core'

// 组件预览映射类型
interface ComponentPreviewProps {
  component: {
    name: string
    category: string
    description: string
  }
  className?: string
}

/**
 * 组件预览渲染器
 * 根据组件名称返回对应的预览组件
 */
export function ComponentPreviewRenderer({ component, className = '' }: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState('preview')
  const [isChecked, setIsChecked] = useState(false)
  const [radioValue, setRadioValue] = useState('option1')
  const [switchOn, setSwitchOn] = useState(false)
  const [sliderValue, setSliderValue] = useState(50)
  const [selectValue, setSelectValue] = useState('option1')
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')

  // 渲染组件预览 - 仅包含实际存在的组件
  const renderComponentPreview = () => {
    try {
      switch (component.name) {
      // ===== UI 基础组件 =====
      case 'Button':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="primary">主要</Button>
              <Button size="sm" variant="secondary">次要</Button>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="primary" disabled>禁用</Button>
            </div>
          </div>
        )

      case 'Card':
        return (
          <Card className="p-3">
            <div className="text-sm font-medium mb-2">卡片标题</div>
            <p className="text-xs text-gray-600">卡片内容描述信息</p>
          </Card>
        )

      // ===== 输入控件组件 =====
      case 'Input':
        return (
          <div className="space-y-2">
            <Input size="sm" placeholder="默认输入框" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <Input size="sm" placeholder="轮廓样式" />
          </div>
        )

      // ===== 反馈组件 =====
      case 'Alert':
        return (
          <div className="space-y-2">
            <Alert>信息提示内容</Alert>
          </div>
        )

      case 'Loading':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Loading size="sm" />
              <span className="text-sm">加载中...</span>
            </div>
          </div>
        )

      case 'Progress':
        return (
          <div className="space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        )

      // ===== 默认展示 =====
      default:
        return (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl font-bold">
              {component.name.charAt(0)}
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{component.name}</div>
              <div className="text-xs text-gray-600 mt-1">
                {component.category} 组件
              </div>
              <div className="text-xs text-orange-600 mt-1">
                组件正在开发中...
              </div>
            </div>
          </div>
        )
    }
    } catch (error) {
      console.error(`Component preview error for ${component.name}:`, error)
      return (
        <div className="flex flex-col items-center gap-3 p-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
            ⚠️
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-red-700">预览错误</div>
            <div className="text-xs text-gray-600 mt-1">
              {component.name} 组件暂时无法预览
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* 标签页导航 */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'preview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          预览
        </button>
        <button
          onClick={() => setActiveTab('states')}
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'states'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          状态
        </button>
      </div>

      {/* 内容区域 */}
      <div className="min-h-[120px] flex items-center justify-center">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {activeTab === 'preview' ? (
            renderComponentPreview()
          ) : (
            <div className="text-center text-sm text-gray-600">
              <div className="font-medium mb-2">组件状态展示</div>
              <div className="space-y-2">
                <div className="flex justify-center gap-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">Default</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Hover</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Focus</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">Disabled</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

/**
 * 导出预览组件供其他模块使用
 */
export default ComponentPreviewRenderer