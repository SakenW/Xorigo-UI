'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import {
  Settings, Eye, Code, Palette, Layout, Accessibility,
  Zap, CheckCircle, AlertCircle, Info, Download, Copy,
  RefreshCw, Monitor, Tablet, Smartphone, Globe,
  Type, Palette as PaletteIcon, BorderRadius, Shadow,
  ArrowUpDown, Move, RotateCw, Maximize2, Layers,
  Sparkles, Wand2, Target, TrendingUp, BarChart3
} from 'lucide-react'
import { Button } from '@xorigo-ui/core'
import { Card } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { cn } from '@/utils'

interface ComponentDetailsEnhancedProps {
  component: any
  onBack?: () => void
}

interface PropertyConfig {
  id: string
  name: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'range'
  value: any
  defaultValue: any
  description?: string
  category: 'basic' | 'advanced' | 'styling' | 'accessibility'
  options?: { label: string; value: any }[]
  min?: number
  max?: number
  step?: number
}

interface Theme {
  id: string
  name: string
  colors: Record<string, string>
  spacing: Record<string, number>
  typography: Record<string, any>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
}

interface CodeExample {
  id: string
  name: string
  language: 'tsx' | 'jsx' | 'html' | 'vue'
  template: string
  description: string
  complexity: 'basic' | 'intermediate' | 'advanced'
}

interface AccessibilityIssue {
  id: string
  type: 'error' | 'warning' | 'info'
  title: string
  description: string
  solution: string
  wcag: string
}

export default function ComponentDetailsEnhanced({ component, onBack }: ComponentDetailsEnhancedProps) {
  const [activeTab, setActiveTab] = useState<'properties' | 'preview' | 'code' | 'accessibility'>('properties')
  const [selectedTheme, setSelectedTheme] = useState('default')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [selectedCodeExample, setSelectedCodeExample] = useState('basic')

  // 模拟属性配置
  const propertyConfigs: PropertyConfig[] = [
    // 基础属性
    {
      id: 'variant',
      name: '变体',
      type: 'select',
      value: 'primary',
      defaultValue: 'primary',
      description: '组件的主要样式变体',
      category: 'basic',
      options: [
        { label: '主要', value: 'primary' },
        { label: '次要', value: 'secondary' },
        { label: '轮廓', value: 'outline' },
        { label: '幽灵', value: 'ghost' }
      ]
    },
    {
      id: 'size',
      name: '尺寸',
      type: 'select',
      value: 'md',
      defaultValue: 'md',
      description: '组件的尺寸大小',
      category: 'basic',
      options: [
        { label: '小型', value: 'sm' },
        { label: '中型', value: 'md' },
        { label: '大型', value: 'lg' },
        { label: '特大', value: 'xl' }
      ]
    },
    {
      id: 'disabled',
      name: '禁用状态',
      type: 'boolean',
      value: false,
      defaultValue: false,
      description: '是否禁用组件',
      category: 'basic'
    },
    {
      id: 'loading',
      name: '加载状态',
      type: 'boolean',
      value: false,
      defaultValue: false,
      description: '是否显示加载状态',
      category: 'basic'
    },

    // 高级属性
    {
      id: 'animationDuration',
      name: '动画持续时间',
      type: 'range',
      value: 300,
      defaultValue: 300,
      description: '动画过渡时间（毫秒）',
      category: 'advanced',
      min: 0,
      max: 1000,
      step: 50
    },
    {
      id: 'autoFocus',
      name: '自动聚焦',
      type: 'boolean',
      value: false,
      defaultValue: false,
      description: '是否自动获得焦点',
      category: 'advanced'
    },

    // 样式属性
    {
      id: 'backgroundColor',
      name: '背景颜色',
      type: 'color',
      value: '#3b82f6',
      defaultValue: '#3b82f6',
      description: '组件背景颜色',
      category: 'styling'
    },
    {
      id: 'textColor',
      name: '文字颜色',
      type: 'color',
      value: '#ffffff',
      defaultValue: '#ffffff',
      description: '组件文字颜色',
      category: 'styling'
    },
    {
      id: 'borderRadius',
      name: '圆角大小',
      type: 'range',
      value: 8,
      defaultValue: 8,
      description: '组件圆角大小（像素）',
      category: 'styling',
      min: 0,
      max: 24,
      step: 1
    },

    // 可访问性属性
    {
      id: 'ariaLabel',
      name: 'ARIA标签',
      type: 'text',
      value: '',
      defaultValue: '',
      description: '为屏幕阅读器提供的描述',
      category: 'accessibility'
    },
    {
      id: 'ariaDescribedBy',
      name: 'ARIA描述',
      type: 'text',
      value: '',
      defaultValue: '',
      description: '关联的描述元素ID',
      category: 'accessibility'
    }
  ]

  // 模拟主题配置
  const themes: Theme[] = [
    {
      id: 'default',
      name: '默认主题',
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        textSecondary: '#64748b'
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: {
          xs: '12px',
          sm: '14px',
          md: '16px',
          lg: '18px',
          xl: '20px'
        }
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px'
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
      }
    },
    {
      id: 'dark',
      name: '深色主题',
      colors: {
        primary: '#60a5fa',
        secondary: '#94a3b8',
        accent: '#fbbf24',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#94a3b8'
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: {
          xs: '12px',
          sm: '14px',
          md: '16px',
          lg: '18px',
          xl: '20px'
        }
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px'
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.2)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.4)'
      }
    }
  ]

  // 模拟代码示例
  const codeExamples: CodeExample[] = [
    {
      id: 'basic',
      name: '基础用法',
      language: 'tsx',
      template: `import { Button } from '@xorigo-ui/core'

export default function BasicExample() {
  return (
    <Button variant="primary" size="md">
      点击按钮
    </Button>
  )
}`,
      description: '最简单的按钮用法示例',
      complexity: 'basic'
    },
    {
      id: 'advanced',
      name: '高级配置',
      language: 'tsx',
      template: `import { Button } from '@xorigo-ui/core'
import { useState } from 'react'

export default function AdvancedExample() {
  const [isLoading, setIsLoading] = useState(false)
  const [count, setCount] = useState(0)

  const handleClick = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setCount(count + 1)
    setIsLoading(false)
  }

  return (
    <Button
      variant="primary"
      size="lg"
      loading={isLoading}
      onClick={handleClick}
      className="w-full max-w-xs"
    >
      {isLoading ? '加载中...' : \`已点击 \${count} 次\`}
    </Button>
  )
}`,
      description: '包含状态管理和异步处理的完整示例',
      complexity: 'advanced'
    },
    {
      id: 'custom-styling',
      name: '自定义样式',
      language: 'tsx',
      template: `import { Button } from '@xorigo-ui/core'

export default function CustomStylingExample() {
  return (
    <div className="flex flex-col gap-4 p-8">
      {/* 渐变背景按钮 */}
      <Button
        variant="primary"
        className="bg-gradient-to-r from-purple-500 to-pink-500
                   hover:from-purple-600 hover:to-pink-600
                   transform transition-all duration-200
                   hover:scale-105 active:scale-95"
      >
        渐变按钮
      </Button>

      {/* 图标按钮 */}
      <Button
        variant="outline"
        className="flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        带图标按钮
      </Button>

      {/* 圆形按钮 */}
      <Button
        variant="ghost"
        className="w-12 h-12 p-0 rounded-full"
      >
        <Settings className="w-5 h-5" />
      </Button>
    </div>
  )
}`,
      description: '展示如何自定义按钮样式和布局',
      complexity: 'intermediate'
    }
  ]

  // 模拟可访问性问题
  const accessibilityIssues: AccessibilityIssue[] = [
    {
      id: '1',
      type: 'warning',
      title: '缺少键盘焦点样式',
      description: '组件缺少明显的键盘焦点指示器',
      solution: '添加 focus-visible 样式类或使用 :focus 伪类',
      wcag: 'WCAG 2.1.1'
    },
    {
      id: '2',
      type: 'info',
      title: '建议添加 ARIA 标签',
      description: '为了更好的屏幕阅读器支持，建议添加 aria-label',
      solution: '设置适当的 aria-label 属性来描述按钮功能',
      wcag: 'WCAG 1.3.1'
    },
    {
      id: '3',
      type: 'error',
      title: '颜色对比度不足',
      description: '当前颜色组合的对比度可能不符合WCAG标准',
      solution: '调整背景色和文字色以提高对比度至4.5:1或更高',
      wcag: 'WCAG 1.4.3'
    }
  ]

  const [properties, setProperties] = useState<Record<string, any>>(() => {
    const initialProps: Record<string, any> = {}
    propertyConfigs.forEach(config => {
      initialProps[config.id] = config.value
    })
    return initialProps
  })

  const updateProperty = useCallback((id: string, value: any) => {
    setProperties(prev => ({
      ...prev,
      [id]: value
    }))
  }, [])

  const resetProperties = useCallback(() => {
    const defaultProps: Record<string, any> = {}
    propertyConfigs.forEach(config => {
      defaultProps[config.id] = config.defaultValue
    })
    setProperties(defaultProps)
  }, [propertyConfigs])

  const copyCodeToClipboard = useCallback((code: string) => {
    navigator.clipboard.writeText(code)
  }, [])

  const renderPropertyEditor = (config: PropertyConfig) => {
    const value = properties[config.id]

    switch (config.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => updateProperty(config.id, e.target.value)}
            placeholder={config.defaultValue}
          />
        )

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => updateProperty(config.id, parseInt(e.target.value))}
            min={config.min}
            max={config.max}
            step={config.step}
          />
        )

      case 'boolean':
        return (
          <button
            onClick={() => updateProperty(config.id, !value)}
            className={cn(
              'w-12 h-6 rounded-full transition-colors duration-200',
              value ? 'bg-blue-500' : 'bg-gray-300'
            )}
          >
            <div
              className={cn(
                'w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200',
                value ? 'translate-x-6' : 'translate-x-0.5'
              )}
            />
          </button>
        )

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => updateProperty(config.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {config.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value}
              onChange={(e) => updateProperty(config.id, e.target.value)}
              className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <Input
              type="text"
              value={value}
              onChange={(e) => updateProperty(config.id, e.target.value)}
              placeholder="#000000"
            />
          </div>
        )

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={value}
              onChange={(e) => updateProperty(config.id, parseInt(e.target.value))}
              min={config.min}
              max={config.max}
              step={config.step}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{config.min}</span>
              <span className="font-medium text-blue-600">{value}</span>
              <span>{config.max}</span>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getDeviceStyles = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-full max-w-sm mx-auto'
      case 'tablet':
        return 'w-full max-w-2xl mx-auto'
      case 'desktop':
      default:
        return 'w-full max-w-4xl mx-auto'
    }
  }

  const getDeviceIcon = () => {
    switch (previewDevice) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />
      case 'tablet':
        return <Tablet className="w-4 h-4" />
      case 'desktop':
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-white/80 rounded-lg transition-colors"
                >
                  <ArrowUpDown className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {component?.name || 'Button'} 组件详情
                </h1>
                <p className="text-gray-600 mt-1">
                  高级组件配置、预览和代码生成工具
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={resetProperties}>
                <RefreshCw className="w-4 h-4 mr-2" />
                重置属性
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                导出配置
              </Button>
            </div>
          </div>

          {/* 标签页导航 */}
          <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            <div className="flex space-x-1">
              {[
                { key: 'properties', label: '属性编辑', icon: Settings },
                { key: 'preview', label: '主题预览', icon: Eye },
                { key: 'code', label: '代码示例', icon: Code },
                { key: 'accessibility', label: '可访问性', icon: Accessibility }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center',
                    activeTab === tab.key
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 内容区域 */}
        <AnimatePresence mode="wait">
          {/* 属性编辑器 */}
          {activeTab === 'properties' && (
            <motion.div
              key="properties"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-6">
                {['basic', 'advanced', 'styling', 'accessibility'].map(category => {
                  const categoryProperties = propertyConfigs.filter(p => p.category === category)
                  const categoryNames = {
                    basic: '基础属性',
                    advanced: '高级属性',
                    styling: '样式属性',
                    accessibility: '可访问性属性'
                  }
                  const categoryIcons = {
                    basic: Settings,
                    advanced: Layers,
                    styling: PaletteIcon,
                    accessibility: Accessibility
                  }
                  const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons]

                  return (
                    <Card key={category} className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <CategoryIcon className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {categoryNames[category as keyof typeof categoryNames]}
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {categoryProperties.map(config => (
                          <div key={config.id}>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-medium text-gray-700">
                                {config.name}
                              </label>
                              {config.description && (
                                <Info className="w-4 h-4 text-gray-400" title={config.description} />
                              )}
                            </div>
                            {renderPropertyEditor(config)}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )
                })}
              </div>

              {/* 实时预览面板 */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">实时预览</h3>
                  <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
                    <Button
                      variant={properties.variant}
                      size={properties.size}
                      disabled={properties.disabled}
                      loading={properties.loading}
                      style={{
                        backgroundColor: properties.backgroundColor,
                        color: properties.textColor,
                        borderRadius: `${properties.borderRadius}px`,
                        transitionDuration: `${properties.animationDuration}ms`
                      }}
                      aria-label={properties.ariaLabel}
                      aria-describedby={properties.ariaDescribedBy}
                    >
                      示例按钮
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">当前配置</h3>
                  <div className="space-y-2">
                    {Object.entries(properties).map(([key, value]) => {
                      const config = propertyConfigs.find(p => p.id === key)
                      return (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">
                            {config?.name || key}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {typeof value === 'boolean' ? (value ? '是' : '否') : String(value)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* 多主题预览 */}
          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* 主题选择器 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">主题选择</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={cn(
                        'p-4 rounded-lg border-2 transition-all duration-200',
                        selectedTheme === theme.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div
                        className="w-full h-8 rounded mb-2"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <p className="font-medium text-gray-900">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </Card>

              {/* 设备选择器 */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">设备预览</h3>
                  <div className="flex items-center gap-2">
                    {(['desktop', 'tablet', 'mobile'] as const).map(device => (
                      <button
                        key={device}
                        onClick={() => setPreviewDevice(device)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                          previewDevice === device
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        {getDeviceIcon()}
                        {device === 'desktop' ? '桌面' : device === 'tablet' ? '平板' : '手机'}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* 预览区域 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">主题预览</h3>
                <div className={cn('bg-gray-50 rounded-lg p-8', getDeviceStyles())}>
                  <div className="space-y-6">
                    {/* 主题颜色展示 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(themes.find(t => t.id === selectedTheme)?.colors || {}).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div
                            className="w-full h-16 rounded-lg mb-2 border border-gray-200"
                            style={{ backgroundColor: value }}
                          />
                          <p className="text-xs text-gray-600">{key}</p>
                          <p className="text-xs font-mono text-gray-500">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* 组件在不同主题下的展示 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['primary', 'secondary', 'outline', 'ghost'].map(variant => (
                        <div key={variant} className="p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">{variant} 变体</p>
                          <Button variant={variant} className="w-full">
                            示例按钮
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* 代码示例 */}
          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* 代码示例选择 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">代码示例</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {codeExamples.map(example => (
                    <button
                      key={example.id}
                      onClick={() => setSelectedCodeExample(example.id)}
                      className={cn(
                        'p-4 rounded-lg border-2 text-left transition-all duration-200',
                        selectedCodeExample === example.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{example.name}</span>
                        <span className={cn(
                          'text-xs px-2 py-1 rounded-full',
                          example.complexity === 'basic' ? 'bg-green-100 text-green-800' :
                          example.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        )}>
                          {example.complexity === 'basic' ? '基础' :
                           example.complexity === 'intermediate' ? '中级' : '高级'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{example.description}</p>
                    </button>
                  ))}
                </div>
              </Card>

              {/* 代码展示 */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {codeExamples.find(e => e.id === selectedCodeExample)?.name}
                  </h3>
                  <button
                    onClick={() => copyCodeToClipboard(
                      codeExamples.find(e => e.id === selectedCodeExample)?.template || ''
                    )}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    复制代码
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                    <code>{codeExamples.find(e => e.id === selectedCodeExample)?.template}</code>
                  </pre>
                </div>
              </Card>
            </motion.div>
          )}

          {/* 可访问性检测 */}
          {activeTab === 'accessibility' && (
            <motion.div
              key="accessibility"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* 可访问性评分 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">可访问性评分</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#e5e7eb"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#10b981"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${280 * 0.85} 352`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute">
                        <p className="text-2xl font-bold text-gray-900">85</p>
                        <p className="text-xs text-gray-500">分</p>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">整体评分</h4>
                    <p className="text-sm text-gray-600">良好的可访问性支持</p>
                  </div>
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#e5e7eb"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#3b82f6"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${280 * 0.95} 352`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute">
                        <p className="text-2xl font-bold text-gray-900">95</p>
                        <p className="text-xs text-gray-500">%</p>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">键盘导航</h4>
                    <p className="text-sm text-gray-600">优秀的键盘支持</p>
                  </div>
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#e5e7eb"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#f59e0b"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${280 * 0.75} 352`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute">
                        <p className="text-2xl font-bold text-gray-900">75</p>
                        <p className="text-xs text-gray-500">%</p>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">颜色对比</h4>
                    <p className="text-sm text-gray-600">需要改进对比度</p>
                  </div>
                </div>
              </Card>

              {/* 问题列表 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">可访问性问题</h3>
                <div className="space-y-4">
                  {accessibilityIssues.map(issue => (
                    <div
                      key={issue.id}
                      className={cn(
                        'p-4 rounded-lg border',
                        getIssueColor(issue.type)
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{issue.title}</h4>
                            <span className="text-xs text-gray-500">{issue.wcag}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                          <p className="text-sm font-medium text-gray-700">
                            <span className="font-semibold">解决方案：</span> {issue.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* 改进建议 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">改进建议</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: '增强键盘导航',
                      description: '确保所有交互元素都可以通过键盘访问',
                      priority: 'high',
                      icon: Target
                    },
                    {
                      title: '改进颜色对比',
                      description: '使用更鲜明的颜色组合以提高可读性',
                      priority: 'medium',
                      icon: PaletteIcon
                    },
                    {
                      title: '添加 ARIA 标签',
                      description: '为屏幕阅读器提供更好的语义信息',
                      priority: 'medium',
                      icon: Info
                    },
                    {
                      title: '测试焦点管理',
                      description: '验证焦点顺序和可见性',
                      priority: 'low',
                      icon: Eye
                    }
                  ].map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className={cn(
                        'p-2 rounded-lg',
                        suggestion.priority === 'high' ? 'bg-red-100 text-red-600' :
                        suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      )}>
                        <suggestion.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{suggestion.title}</h4>
                        <p className="text-sm text-gray-600">{suggestion.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}