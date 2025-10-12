'use client'

import { Card, CardContent, CardHeader } from '@th-ui/core'
import { Badge } from '@th-ui/core'
import { Button } from '@th-ui/core'

// 模拟配方数据
const mockRecipe = {
  id: 'modern-ocean',
  name: 'Modern Ocean',
  description: '现代海洋风格配色方案，适合科技类产品展示',
  category: 'technology',
  tags: ['blue', 'modern', 'professional'],
  colors: ['#0EA5E9', '#0284C7', '#0C4A6E', '#075985', '#134E4A'],
  usage: '适用于科技网站、企业应用、数据分析平台',
  preview: {
    primary: {
      background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
      text: '#FFFFFF'
    },
    secondary: {
      background: '#F0F9FF',
      text: '#0C4A6E'
    },
    accent: {
      background: '#0EA5E9',
      text: '#FFFFFF'
    }
  }
}

export function RecipeDetailContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card variant="elevated" className="max-w-4xl mx-auto">
        {/* 配方预览图片 */}
        <img
          src="https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=400&fit=crop"
          alt={mockRecipe.name}
          className="w-full h-64 object-cover rounded-t-lg"
        />

        <CardContent>
          {/* 头部信息 */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {mockRecipe.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {mockRecipe.description}
              </p>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {mockRecipe.tags.map((tag) => (
                  <Badge key={tag} variant="default" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-right">
              <Badge variant="default" className="mb-2">
                {mockRecipe.category}
              </Badge>
            </div>
          </div>

          {/* 配色方案展示 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">配色方案</h2>
            <div className="flex gap-2 mb-4">
              {mockRecipe.colors.map((color, index) => (
                <div key={index} className="flex-1 text-center">
                  <div
                    className="h-20 rounded-lg shadow-md mb-2"
                    style={{ backgroundColor: color }}
                  />
                  <code className="text-xs font-mono">{color}</code>
                </div>
              ))}
            </div>
          </div>

          {/* 应用场景预览 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">应用场景</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Primary 预览 */}
              <div
                className="p-6 rounded-lg text-center"
                style={mockRecipe.preview.primary}
              >
                <h3 className="text-2xl font-bold mb-2">Primary</h3>
                <p className="opacity-90">主要操作按钮</p>
                <Button
                  className="mt-4"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  示例按钮
                </Button>
              </div>

              {/* Secondary 预览 */}
              <div
                className="p-6 rounded-lg text-center"
                style={mockRecipe.preview.secondary}
              >
                <h3 className="text-2xl font-bold mb-2" style={{ color: mockRecipe.preview.secondary.text }}>
                  Secondary
                </h3>
                <p style={{ color: mockRecipe.preview.secondary.text }}>次要元素</p>
                <Button
                  className="mt-4"
                  style={{
                    backgroundColor: mockRecipe.preview.secondary.text,
                    color: mockRecipe.preview.secondary.background
                  }}
                >
                  示例按钮
                </Button>
              </div>

              {/* Accent 预览 */}
              <div
                className="p-6 rounded-lg text-center"
                style={mockRecipe.preview.accent}
              >
                <h3 className="text-2xl font-bold mb-2">Accent</h3>
                <p className="opacity-90">强调元素</p>
                <div className="mt-4 flex gap-2 justify-center">
                  <Badge variant="primary">New</Badge>
                  <Badge variant="primary">Popular</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* 使用说明 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">使用场景</h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {mockRecipe.usage}
              </p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4">
            <Button className="flex-1">
              应用此配方
            </Button>
            <Button variant="primary" className="flex-1">
              复制配色代码
            </Button>
            <Button variant="primary" className="flex-1">
              下载配色文件
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}