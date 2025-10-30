'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@xorigo-ui/core'
import { Card } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { cn } from '@/utils'
import { Eye, Settings, RefreshCw, Monitor, Smartphone, Tablet, Maximize2, Grid, Layers, Zap, Palette, Type, Layout, Responsive, Download, Copy } from 'lucide-react'
import type { SolutionConfig, ComponentConfig } from './solution-configurator'

interface RealTimePreviewProps {
  config: SolutionConfig
  components: ComponentConfig[]
  solutionName: string
  onConfigUpdate?: (config: SolutionConfig) => void
  className?: string
}

interface PreviewDevice {
  id: string
  name: string
  icon: React.ReactNode
  width: number
  height: number
  scale: number
}

export function RealTimePreview({
  config,
  components,
  solutionName,
  onConfigUpdate,
  className
}: RealTimePreviewProps) {
  const [activeDevice, setActiveDevice] = useState<string>('desktop')
  const [previewMode, setPreviewMode] = useState<'component' | 'layout' | 'interactive'>('component')
  const [showGrid, setShowGrid] = useState(false)
  const [showRulers, setShowRulers] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [highlightComponent, setHighlightComponent] = useState<string | null>(null)

  const devices: PreviewDevice[] = [
    {
      id: 'desktop',
      name: '桌面端',
      icon: <Monitor className="w-4 h-4" />,
      width: 1200,
      height: 800,
      scale: 0.7
    },
    {
      id: 'tablet',
      name: '平板',
      icon: <Tablet className="w-4 h-4" />,
      width: 768,
      height: 1024,
      scale: 0.8
    },
    {
      id: 'mobile',
      name: '手机',
      icon: <Smartphone className="w-4 h-4" />,
      width: 375,
      height: 667,
      scale: 1
    }
  ]

  const currentDevice = devices.find(d => d.id === activeDevice) || devices[0]

  // 生成预览样式
  const previewStyles = useMemo(() => {
    const styles: React.CSSProperties = {
      width: currentDevice.width,
      height: currentDevice.height,
      transform: `scale(${currentDevice.scale * (zoomLevel / 100)})`,
      transformOrigin: 'top center',
      transition: 'all 0.3s ease',
      backgroundColor: config.theme === 'dark' ? '#1a1a1a' : '#ffffff',
      color: config.theme === 'dark' ? '#ffffff' : '#000000',
      fontFamily: config.designTokens?.fontFamily === 'serif' ? 'serif' :
                  config.designTokens?.fontFamily === 'mono' ? 'monospace' : 'sans-serif',
      fontSize: config.designTokens?.fontSize === 'xs' ? '12px' :
               config.designTokens?.fontSize === 'sm' ? '14px' :
               config.designTokens?.fontSize === 'lg' ? '18px' :
               config.designTokens?.fontSize === 'xl' ? '20px' : '16px',
      lineHeight: config.designTokens?.lineHeight === 'tight' ? '1.25' :
                 config.designTokens?.lineHeight === 'relaxed' ? '1.75' : '1.5',
      borderRadius: `${config.designTokens?.borderRadius === 'none' ? '0' :
                      config.designTokens?.borderRadius === 'small' ? '4px' :
                      config.designTokens?.borderRadius === 'large' ? '12px' :
                      config.designTokens?.borderRadius === 'full' ? '9999px' : '8px'}`,
      boxShadow: config.designTokens?.shadows === 'none' ? 'none' :
                 config.designTokens?.shadows === 'subtle' ? '0 1px 3px rgba(0,0,0,0.12)' :
                 config.designTokens?.shadows === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
                 config.designTokens?.shadows === 'strong' ? '0 10px 15px rgba(0,0,0,0.1)' :
                 config.designTokens?.shadows === 'dramatic' ? '0 20px 25px rgba(0,0,0,0.15)' :
                 '0 4px 6px rgba(0,0,0,0.1)'
    }

    return styles
  }, [config, currentDevice, zoomLevel])

  // 渲染组件预览
  const renderComponentPreview = (component: ComponentConfig, index: number) => {
    const baseStyles: React.CSSProperties = {
      padding: '16px',
      margin: '8px',
      border: `1px solid ${config.theme === 'dark' ? '#333' : '#e5e7eb'}`,
      borderRadius: component.radius === 'none' ? '0' :
                   component.radius === 'sm' ? '4px' :
                   component.radius === 'lg' ? '12px' :
                   component.radius === 'xl' ? '16px' :
                   component.radius === 'full' ? '9999px' : '8px',
      boxShadow: component.shadow === 'none' ? 'none' :
                 component.shadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.05)' :
                 component.shadow === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' :
                 component.shadow === 'xl' ? '0 20px 25px rgba(0,0,0,0.1)' :
                 component.shadow === 'inner' ? 'inset 0 2px 4px rgba(0,0,0,0.06)' :
                 '0 4px 6px rgba(0,0,0,0.1)',
      opacity: (component.opacity || 100) / 100,
      transition: component.transition === 'none' ? 'none' :
                  component.transition === 'fast' ? 'all 0.15s ease' :
                  component.transition === 'slow' ? 'all 0.3s ease' :
                  component.transition === 'bounce' ? 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)' :
                  'all 0.2s ease',
      transform: component.hoverScale ? 'scale(1)' : 'none',
      cursor: component.hoverScale ? 'pointer' : 'default'
    }

    if (component.hoverScale) {
      baseStyles.transition = `${baseStyles.transition}, transform 0.2s ease`
    }

    const isHighlighted = highlightComponent === component.name
    if (isHighlighted) {
      baseStyles.border = `2px solid #3b82f6`
      baseStyles.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)'
    }

    // 根据组件类型渲染不同的预览
    switch (component.name) {
      case 'Button':
        return (
          <button
            key={index}
            style={{
              ...baseStyles,
              backgroundColor: component.color === 'blue' ? '#3b82f6' :
                             component.color === 'green' ? '#10b981' :
                             component.color === 'red' ? '#ef4444' :
                             component.color === 'purple' ? '#8b5cf6' :
                             component.color === 'orange' ? '#f97316' :
                             component.color === 'pink' ? '#ec4899' :
                             component.color === 'indigo' ? '#6366f1' :
                             component.color === 'gray' ? '#6b7280' :
                             component.color === 'slate' ? '#64748b' :
                             component.color === 'zinc' ? '#71717a' : '#3b82f6',
              color: '#ffffff',
              fontSize: component.size === 'xs' ? '12px' :
                       component.size === 'sm' ? '14px' :
                       component.size === 'lg' ? '18px' :
                       component.size === 'xl' ? '20px' :
                       component.size === '2xl' ? '24px' : '16px',
              padding: component.size === 'xs' ? '6px 12px' :
                       component.size === 'sm' ? '8px 16px' :
                       component.size === 'lg' ? '12px 24px' :
                       component.size === 'xl' ? '16px 32px' :
                       component.size === '2xl' ? '20px 40px' : '10px 20px',
              opacity: component.disabled ? 0.5 : baseStyles.opacity,
              cursor: component.disabled ? 'not-allowed' : baseStyles.cursor,
              animation: component.animation === 'fade' ? 'fadeIn 0.3s ease' :
                        component.animation === 'slide' ? 'slideIn 0.3s ease' :
                        component.animation === 'scale' ? 'scaleIn 0.3s ease' :
                        component.animation === 'bounce' ? 'bounce 0.6s ease' :
                        component.animation === 'pulse' ? 'pulse 2s infinite' :
                        component.animation === 'spin' ? 'spin 1s linear infinite' : 'none'
            }}
            disabled={component.disabled}
            onMouseEnter={() => component.hoverScale && setHighlightComponent(component.name)}
            onMouseLeave={() => setHighlightComponent(null)}
          >
            {component.loading ? '加载中...' : component.placeholder || `${component.name} 按钮`}
          </button>
        )

      case 'Input':
        return (
          <input
            key={index}
            type="text"
            placeholder={component.placeholder || `请输入${component.name}信息`}
            disabled={component.disabled}
            style={{
              ...baseStyles,
              width: component.fullWidth ? '100%' : '200px',
              fontSize: component.size === 'xs' ? '12px' :
                       component.size === 'sm' ? '14px' :
                       component.size === 'lg' ? '18px' :
                       component.size === 'xl' ? '20px' :
                       component.size === '2xl' ? '24px' : '16px',
              padding: component.size === 'xs' ? '4px 8px' :
                       component.size === 'sm' ? '6px 12px' :
                       component.size === 'lg' ? '10px 16px' :
                       component.size === 'xl' ? '12px 20px' :
                       component.size === '2xl' ? '16px 24px' : '8px 12px',
              backgroundColor: config.theme === 'dark' ? '#374151' : '#ffffff',
              color: config.theme === 'dark' ? '#ffffff' : '#000000',
              borderColor: component.error ? '#ef4444' : (config.theme === 'dark' ? '#4b5563' : '#d1d5db'),
              borderWidth: '1px',
              borderStyle: component.borderStyle === 'dashed' ? 'dashed' : 'solid',
              opacity: component.disabled ? 0.5 : baseStyles.opacity,
              cursor: component.disabled ? 'not-allowed' : 'text',
              animation: component.animation === 'fade' ? 'fadeIn 0.3s ease' :
                        component.animation === 'slide' ? 'slideIn 0.3s ease' :
                        component.animation === 'scale' ? 'scaleIn 0.3s ease' :
                        component.animation === 'bounce' ? 'bounce 0.6s ease' :
                        component.animation === 'pulse' ? 'pulse 2s infinite' : 'none'
            }}
            onMouseEnter={() => setHighlightComponent(component.name)}
            onMouseLeave={() => setHighlightComponent(null)}
          />
        )

      case 'Card':
        return (
          <div
            key={index}
            style={{
              ...baseStyles,
              backgroundColor: config.theme === 'dark' ? '#1f2937' : '#f9fafb',
              border: `1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'}`,
              padding: '20px',
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              animation: component.animation === 'fade' ? 'fadeIn 0.3s ease' :
                        component.animation === 'slide' ? 'slideIn 0.3s ease' :
                        component.animation === 'scale' ? 'scaleIn 0.3s ease' :
                        component.animation === 'bounce' ? 'bounce 0.6s ease' :
                        component.animation === 'pulse' ? 'pulse 2s infinite' : 'none'
            }}
            onMouseEnter={() => setHighlightComponent(component.name)}
            onMouseLeave={() => setHighlightComponent(null)}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
              {component.placeholder || `${component.name} 标题`}
            </div>
            <div style={{ fontSize: '12px', color: config.theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
              这是一个卡片组件预览
            </div>
          </div>
        )

      case 'Form':
        return (
          <div
            key={index}
            style={{
              ...baseStyles,
              backgroundColor: config.theme === 'dark' ? '#1f2937' : '#ffffff',
              padding: '24px',
              minWidth: '300px'
            }}
            onMouseEnter={() => setHighlightComponent(component.name)}
            onMouseLeave={() => setHighlightComponent(null)}
          >
            <h4 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
              {component.placeholder || '表单标题'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="输入字段 1"
                style={{
                  padding: '8px 12px',
                  border: `1px solid ${config.theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '6px',
                  backgroundColor: config.theme === 'dark' ? '#374151' : '#ffffff',
                  color: config.theme === 'dark' ? '#ffffff' : '#000000'
                }}
              />
              <input
                type="text"
                placeholder="输入字段 2"
                style={{
                  padding: '8px 12px',
                  border: `1px solid ${config.theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
                  borderRadius: '6px',
                  backgroundColor: config.theme === 'dark' ? '#374151' : '#ffffff',
                  color: config.theme === 'dark' ? '#ffffff' : '#000000'
                }}
              />
              <button
                style={{
                  padding: '10px 16px',
                  backgroundColor: component.color === 'blue' ? '#3b82f6' :
                                 component.color === 'green' ? '#10b981' :
                                 component.color === 'red' ? '#ef4444' : '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                提交
              </button>
            </div>
          </div>
        )

      default:
        return (
          <div
            key={index}
            style={{
              ...baseStyles,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80px',
              flexDirection: 'column',
              gap: '8px'
            }}
            onMouseEnter={() => setHighlightComponent(component.name)}
            onMouseLeave={() => setHighlightComponent(null)}
          >
            <div style={{ fontSize: '24px' }}>🧩</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {component.name}
            </div>
            <div style={{ fontSize: '12px', color: config.theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
              {component.variant} • {component.size} • {component.color}
            </div>
          </div>
        )
    }
  }

  // 渲染布局预览
  const renderLayoutPreview = () => {
    const layoutStyles = {
      display: 'grid',
      gap: '16px',
      padding: '20px',
      height: '100%',
      gridTemplateColumns: config.layout === 'sidebar' ? '200px 1fr' :
                           config.layout === 'top' ? '1fr' :
                           '1fr',
      gridTemplateRows: config.layout === 'top' ? '60px 1fr' : '1fr'
    }

    return (
      <div style={layoutStyles}>
        {config.layout === 'sidebar' && (
          <div style={{
            backgroundColor: config.theme === 'dark' ? '#374151' : '#f3f4f6',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>导航</div>
            {['首页', '组件', '文档', '设置'].map((item) => (
              <div key={item} style={{
                padding: '8px 12px',
                borderRadius: '4px',
                backgroundColor: config.theme === 'dark' ? '#4b5563' : '#ffffff',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                {item}
              </div>
            ))}
          </div>
        )}

        {config.layout === 'top' && (
          <div style={{
            backgroundColor: config.theme === 'dark' ? '#374151' : '#f3f4f6',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Logo</div>
            <div style={{ display: 'flex', gap: '16px', marginLeft: 'auto' }}>
              {['首页', '组件', '文档', '设置'].map((item) => (
                <div key={item} style={{
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{
          backgroundColor: config.theme === 'dark' ? '#1f2937' : '#ffffff',
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
            {solutionName}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: config.layout === 'mobile-first' ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {components.slice(0, 4).map((component, index) => (
              <div key={index} style={{
                backgroundColor: config.theme === 'dark' ? '#374151' : '#f9fafb',
                padding: '16px',
                borderRadius: '8px',
                border: `1px solid ${config.theme === 'dark' ? '#4b5563' : '#e5e7eb'}`
              }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {component.name}
                </div>
                <div style={{ fontSize: '12px', color: config.theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                  {component.description || '组件预览内容'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 渲染交互预览
  const renderInteractivePreview = () => {
    return (
      <div style={{ padding: '20px', height: '100%', overflow: 'auto' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
          交互式预览
        </h2>
        <p style={{ marginBottom: '20px', color: config.theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
          点击下方组件查看交互效果
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {components.map((component, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {component.name}
              </div>
              {renderComponentPreview(component, index)}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: config.theme === 'dark' ? '#374151' : '#f9fafb', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>功能特性</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(config.features).map(([key, enabled]) => (
              <span
                key={key}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: enabled ?
                    (config.theme === 'dark' ? '#059669' : '#10b981') :
                    (config.theme === 'dark' ? '#374151' : '#e5e7eb'),
                  color: enabled ? '#ffffff' : (config.theme === 'dark' ? '#9ca3af' : '#6b7280')
                }}
              >
                {key === 'responsive' ? '响应式' :
                 key === 'animations' ? '动画' :
                 key === 'darkMode' ? '暗色模式' :
                 key === 'i18n' ? '国际化' :
                 key === 'testing' ? '测试' :
                 key === 'typescript' ? 'TypeScript' : key}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900', className)}>
      {/* 预览控制栏 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* 设备选择 */}
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-gray-500" />
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {devices.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => setActiveDevice(device.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                      activeDevice === device.id
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    {device.icon}
                    <span className="hidden sm:inline">{device.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 预览模式 */}
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {[
                  { id: 'component', label: '组件', icon: <Layers className="w-4 h-4" /> },
                  { id: 'layout', label: '布局', icon: <Layout className="w-4 h-4" /> },
                  { id: 'interactive', label: '交互', icon: <Zap className="w-4 h-4" /> }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setPreviewMode(mode.id as any)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                      previewMode === mode.id
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    {mode.icon}
                    <span className="hidden sm:inline">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 工具按钮 */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={cn(
                'p-2 rounded-md transition-colors',
                showGrid
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
              title="显示网格"
            >
              <Grid className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowRulers(!showRulers)}
              className={cn(
                'p-2 rounded-md transition-colors',
                showRulers
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
              title="显示标尺"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* 缩放控制 */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                -
              </button>
              <span className="text-sm font-medium text-gray-900 dark:text-white px-2">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                +
              </button>
            </div>

            <button
              onClick={() => setZoomLevel(100)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              title="重置缩放"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 预览区域 */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 p-8">
        <div className="flex justify-center">
          <div className="relative">
            {/* 设备框架 */}
            <div
              className="bg-white dark:bg-gray-900 shadow-2xl overflow-hidden"
              style={previewStyles}
            >
              {/* 网格背景 */}
              {showGrid && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
              )}

              {/* 标尺 */}
              {showRulers && (
                <>
                  <div
                    className="absolute top-0 left-0 right-0 h-4 bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600"
                    style={{ fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}
                  >
                    {currentDevice.width}px
                  </div>
                  <div
                    className="absolute top-0 left-0 bottom-0 w-4 bg-gray-200 dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600"
                    style={{
                      fontSize: '10px',
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      padding: '4px 0'
                    }}
                  >
                    {currentDevice.height}px
                  </div>
                </>
              )}

              {/* 预览内容 */}
              <div style={{
                padding: showRulers ? '20px 20px 20px 20px' : '0',
                height: '100%',
                overflow: 'auto'
              }}>
                {previewMode === 'component' && (
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                      组件预览
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px'
                    }}>
                      {components.map((component, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7 }}>
                            {component.name}
                          </div>
                          {renderComponentPreview(component, index)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewMode === 'layout' && renderLayoutPreview()}
                {previewMode === 'interactive' && renderInteractivePreview()}
              </div>
            </div>

            {/* 设备标签 */}
            <div className="absolute -bottom-6 left-0 right-0 text-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {currentDevice.name} • {currentDevice.width} × {currentDevice.height}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 状态栏 */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>主题: {config.theme}</span>
            <span>布局: {config.layout}</span>
            <span>组件: {components.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>缩放: {zoomLevel}%</span>
            <span>•</span>
            <span>设备: {currentDevice.name}</span>
            <span>•</span>
            <span>模式: {previewMode === 'component' ? '组件' : previewMode === 'layout' ? '布局' : '交互'}</span>
          </div>
        </div>
      </div>

      {/* 全局样式 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-30px); }
          70% { transform: translateY(-15px); }
          90% { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}