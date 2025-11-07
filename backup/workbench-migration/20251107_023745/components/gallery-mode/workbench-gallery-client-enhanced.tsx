'use client'

import { useState, useEffect, useMemo } from 'react'
import { Input } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Typography } from '@xorigo-ui/core'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { cn } from '../../../lib/utils'
import { EnhancedComponentCard } from './enhanced-component-card'
import { createIntelligentSearchEngine } from '../../../lib/workbench/intelligent-search'
import { useWorkbench } from '../workbench-context'
import { getAllComponents } from '../../../data/component-classification'

interface WorkbenchGalleryClientEnhancedProps {
  className?: string
}

export function WorkbenchGalleryClientEnhanced({
  className
}: WorkbenchGalleryClientEnhancedProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchEngine, setSearchEngine] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const {
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm
  } = useWorkbench()

  // 使用本地的组件数据
  const components = getAllComponents()
  const categories = Array.from(new Set(components.map(comp => comp.category)))
  const searchStats = { totalResults: components.length }

  // 初始化搜索引擎
  useEffect(() => {
    const engine = createIntelligentSearchEngine({
      fuzzySearch: true,
      semanticSearch: true,
      categoryFiltering: true
    })
    setSearchEngine(engine)
    setIsLoading(false)
  }, [])

  // 简化的搜索逻辑
  const searchResults = useMemo(() => {
    if (!components.length) return []

    let filtered = components

    // 分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(comp => comp.category === selectedCategory)
    }

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(comp =>
        comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [components, selectedCategory, searchTerm])

  // 获取分类统计
  const categoryStats = useMemo(() => {
    const stats = new Map<string, number>()
    stats.set('all', components.length)

    categories.forEach(category => {
      const count = components.filter(comp => comp.category === category).length
      stats.set(category, count)
    })

    return stats
  }, [components, categories])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <Typography variant="body" className="text-muted-foreground">
            正在加载组件库...
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* 画廊标题 */}
      <div className="text-center space-y-4">
        <Typography variant="h2" className="text-3xl font-bold">
          🎨 增强版组件画廊
        </Typography>
        <Typography variant="body" className="text-lg text-muted-foreground max-w-2xl mx-auto">
          体验全新的组件展示方式 - 更大的预览空间、多维度展示、丰富的组件形态
        </Typography>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline" className="text-sm px-3 py-1">
            {searchResults.length} 个组件
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {categories.length} 个分类
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {viewMode === 'grid' ? '网格视图' : '列表视图'}
          </Badge>
        </div>
      </div>

      {/* 搜索和过滤控制 */}
      <Card className="bg-gradient-to-r from-gray-50 to-white border-2">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* 搜索框 */}
            <div className="relative">
              <Input
                placeholder="搜索组件名称、描述或功能..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-base h-12 pl-12"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>

            {/* 分类过滤按钮 */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="transition-all duration-200"
              >
                全部 {categoryStats.get('all')}
              </Button>

              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all duration-200"
                >
                  <span className="mr-1">
                    {category === 'base' && '🎨'}
                    {category === 'layout' && '📐'}
                    {category === 'navigation' && '🧭'}
                    {category === 'form' && '📝'}
                    {category === 'data-display' && '📊'}
                    {category === 'feedback' && '💬'}
                    {category === 'overlay' && '🔳'}
                    {category === 'composite' && '🧩'}
                    {category === 'system' && '⚙️'}
                    {category === 'visualization' && '📈'}
                  </span>
                  {category === 'base' && 'Base'}
                  {category === 'layout' && 'Layout'}
                  {category === 'navigation' && 'Navigation'}
                  {category === 'form' && 'Form'}
                  {category === 'data-display' && 'Data Display'}
                  {category === 'feedback' && 'Feedback'}
                  {category === 'overlay' && 'Overlay'}
                  {category === 'composite' && 'Composite'}
                  {category === 'system' && 'System'}
                  {category === 'visualization' && 'Visualization'}
                  <span className="ml-1 text-xs opacity-75">
                    {categoryStats.get(category)}
                  </span>
                </Button>
              ))}
            </div>

            {/* 视图模式切换 */}
            <div className="flex items-center justify-between">
              <Typography variant="body" className="text-sm text-muted-foreground">
                找到 {searchResults.length} 个组件
              </Typography>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  网格
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  列表
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 组件展示区域 - 增强版网格布局 */}
      <div className="space-y-4">
        {searchResults.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-6xl">🔍</div>
                <Typography variant="h3" className="text-xl">
                  没有找到匹配的组件
                </Typography>
                <Typography variant="body" className="text-muted-foreground">
                  尝试调整搜索关键词或选择不同的分类
                </Typography>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                >
                  清除过滤条件
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={cn(
            "grid gap-6 transition-all duration-300",
            viewMode === 'grid'
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1"
          )}>
            {searchResults.map((component, index) => (
              <div
                key={component.name}
                className="transition-all duration-300 ease-out opacity-0"
                style={{
                  transitionDelay: `${index * 30}ms`,
                  transform: 'translateY(20px)'
                }}
                ref={(el) => {
                  if (el) {
                    setTimeout(() => {
                      el.style.opacity = '1'
                      el.style.transform = 'translateY(0)'
                    }, 100 + index * 30)
                  }
                }}
              >
                <EnhancedComponentCard
                  component={component}
                  onEdit={(comp) => console.log('Edit component:', comp)}
                  onCopy={(comp) => console.log('Copy component:', comp)}
                  onDocs={(comp) => console.log('View docs:', comp)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 使用提示 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="space-y-2">
            <Typography variant="body" className="font-medium text-blue-900">
              💡 增强版画廊特性:
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-blue-800">
              <div>• 更大的组件预览空间</div>
              <div>• 多维度组件形态展示</div>
              <div>• 尺寸、变体、状态对比</div>
              <div>• 可展开的详细视图</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}