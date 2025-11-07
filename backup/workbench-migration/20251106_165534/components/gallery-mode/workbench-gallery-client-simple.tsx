'use client'

import { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { cn } from '../../../lib/utils'
import type { ComponentCategory } from '../../../data/component-classification'
import { SimpleComponentCard } from '../cards/simple-component-card'

/**
 * 简化版 Workbench Gallery 客户端组件
 * 移除复杂的智能搜索功能，专注于基本的组件浏览
 */
interface WorkbenchGalleryClientProps {
  categories: ComponentCategory[]
}

export function WorkbenchGalleryClient({ categories }: WorkbenchGalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // 获取显示的组件（过滤逻辑）
  const displayComponents = useMemo(() => {
    let components = categories.flatMap(cat => cat.components)

    // 分类过滤
    if (selectedCategory !== 'all') {
      const selected = categories.find(cat => cat.id === selectedCategory)
      components = selected ? selected.components : []
    }

    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      components = components.filter(component =>
        component.name.toLowerCase().includes(query) ||
        component.description.toLowerCase().includes(query) ||
        component.category.toLowerCase().includes(query)
      )
    }

    return components
  }, [categories, selectedCategory, searchQuery])

  const totalComponents = displayComponents.length

  // 处理组件预览
  const handleComponentPreview = useCallback((component: any) => {
    console.log('Preview component:', component.name)
  }, [])

  // 处理组件编辑
  const handleComponentEdit = useCallback((component: any) => {
    const url = `/workbench?mode=editor&component=${component.name}&category=${component.category}`
    window.location.href = url
  }, [])

  // 处理组件复制
  const handleComponentCopy = useCallback((component: any) => {
    const code = `<${component.name} />`
    navigator.clipboard.writeText(code)
      .then(() => {
        console.log('Component code copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy:', err)
      })
  }, [])

  // 处理组件文档
  const handleComponentDocs = useCallback((component: any) => {
    const url = `/docs/components/${component.name.toLowerCase()}`
    window.open(url, '_blank')
  }, [])

  return (
    <div className="space-y-8">
      {/* 搜索区域 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">🎨 组件浏览</h2>
              <p className="text-sm text-muted-foreground mt-1">
                浏览 Xorigo UI 组件库的所有组件
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {totalComponents} 个组件
              </Badge>
              <div className="flex space-x-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  网格
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  列表
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 搜索框 */}
            <div>
              <input
                type="text"
                placeholder="搜索组件名称、描述或功能..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* 分类过滤 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('all')
                }}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                  selectedCategory === 'all'
                    ? "bg-primary-500 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                全部
                <Badge variant="secondary" className="ml-2 text-xs">
                  {categories.reduce((total, cat) => total + cat.components.length, 0)}
                </Badge>
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id)
                  }}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                    selectedCategory === category.id
                      ? "bg-primary-500 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.components.length}
                  </Badge>
                </button>
              ))}
            </div>

            {/* 搜索统计 */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                找到 {totalComponents} 个组件
                {searchQuery && (
                  <span>
                    {' '}• 搜索: "{searchQuery}"
                  </span>
                )}
              </div>
              {selectedCategory !== 'all' && (
                <span>分类: {categories.find(cat => cat.id === selectedCategory)?.name}</span>
              )}
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                >
                  清除搜索
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 组件展示区域 */}
      {displayComponents.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">
                没有找到匹配的组件
              </h3>
              <p className="text-muted-foreground mb-4">
                尝试调整搜索关键词或选择其他分类
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                >
                  清除所有筛选条件
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={cn(
          viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "space-y-4"
        )}>
          {displayComponents.map((component, index) => {
            if (!component || !component.name) {
              console.warn('Invalid component:', component)
              return null
            }

            return (
              <SimpleComponentCard
                key={component.name}
                component={component}
                onPreview={handleComponentPreview}
                onEdit={handleComponentEdit}
                onCopy={handleComponentCopy}
                onDocs={handleComponentDocs}
              />
            )
          }).filter(Boolean)}
        </div>
      )}
    </div>
  )
}