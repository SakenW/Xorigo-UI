'use client'

import { useState, useEffect } from 'react'
import { MasonryLayout } from '../../src/components/workbench/shared/masonry-layout'
import { Input, Button, Badge } from '@xorigo-ui/core'

const mockComponents = [
  { name: 'Button', category: 'base', description: '按钮组件，支持多种变体和尺寸', height: 240 },
  { name: 'Input', category: 'form', description: '输入框组件，支持多种样式和验证', height: 220 },
  { name: 'Card', category: 'data', description: '卡片组件，用于内容展示和分组', height: 200 },
  { name: 'Modal', category: 'overlay', description: '模态框组件，用于弹窗和对话框', height: 180 },
  { name: 'Alert', category: 'feedback', description: '警告提示组件，用于信息反馈', height: 160 },
  { name: 'Typography', category: 'base', description: '文字排版组件，支持多种文字样式', height: 190 },
  { name: 'Table', category: 'data', description: '表格组件，用于数据展示和排序', height: 280 },
  { name: 'Tabs', category: 'nav', description: '标签页组件，用于内容切换', height: 170 },
  { name: 'Tooltip', category: 'overlay', description: '工具提示组件，用于悬浮提示', height: 150 },
  { name: 'Loading', category: 'feedback', description: '加载状态组件，用于等待状态', height: 140 },
  { name: 'Badge', category: 'base', description: '徽标组件，用于状态标记', height: 130 },
  { name: 'Select', category: 'form', description: '选择器组件，用于下拉选择', height: 160 }
]

export default function SimpleWorkbenchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredComponents = mockComponents.filter(comp =>
    comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const masonryItems = filteredComponents.map(component => ({
    id: component.name,
    height: component.height
  }))

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            简化版组件工作台
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            测试瀑布流布局效果
          </p>
        </div>

        {/* 搜索框 */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <Input
              placeholder="搜索组件..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* 统计信息 */}
        <div className="mb-6 text-center">
          <Badge variant="outline">
            {filteredComponents.length} 个组件
          </Badge>
        </div>

        {/* 瀑布流布局 */}
        <div className="relative w-full min-h-[400px]">
          <MasonryLayout
            items={masonryItems}
            gap={20}
            enableAnimation={true}
          >
            {(item) => {
              const component = filteredComponents.find(c => c.name === item.id)
              if (!component) return null

              return (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {component.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {component.category}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {component.description}
                  </p>

                  {/* 简单的组件预览 */}
                  <div className="bg-gray-50 rounded p-4 mb-4">
                    <div className="text-sm text-gray-500 mb-2">预览:</div>
                    {component.name === 'Button' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="primary">主要</Button>
                        <Button size="sm" variant="secondary">次要</Button>
                      </div>
                    )}
                    {component.name === 'Input' && (
                      <Input size="sm" placeholder="示例输入框" />
                    )}
                    {component.name === 'Badge' && (
                      <div className="flex gap-2">
                        <Badge variant="default">默认</Badge>
                        <Badge variant="primary">主要</Badge>
                      </div>
                    )}
                    {['Card', 'Modal', 'Alert', 'Typography', 'Table', 'Tabs', 'Tooltip', 'Loading', 'Select'].includes(component.name) && (
                      <div className="text-center text-gray-400">
                        {component.name} 组件预览
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>预估高度: {component.height}px</span>
                    <Button size="sm" variant="ghost">
                      查看详情
                    </Button>
                  </div>
                </div>
              )
            }}
          </MasonryLayout>

          {/* 空状态 */}
          {masonryItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                没有找到匹配的组件
              </h3>
              <p className="text-gray-600">
                尝试调整搜索关键词
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}