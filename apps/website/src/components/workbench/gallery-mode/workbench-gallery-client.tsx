'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { cn } from '../../../lib/utils'
import type { ComponentCategory } from '../../../data/component-classification'
import type { SearchResult, SearchQuery } from '../../../lib/workbench/intelligent-search/types'
import { createIntelligentSearchEngine } from '../../../lib/workbench/intelligent-search'
import IntelligentSearch from '../search/intelligent-search'
import SimpleComponentCard from '../cards/simple-component-card'

/**
 * Workbench Gallery 客户端组件
 * 处理智能搜索、过滤和交互功能
 */
interface WorkbenchGalleryClientProps {
  categories: ComponentCategory[]
}

export function WorkbenchGalleryClient({ categories }: WorkbenchGalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // 初始化智能搜索引擎
  const searchEngine = useMemo(() => {
    const engine = createIntelligentSearchEngine()
    // 构建所有组件的索引
    const allComponents = categories.flatMap(cat => cat.components)
    engine.buildIndex(allComponents)
    return engine
  }, [categories])

  // 处理智能搜索
  const handleSearch = useCallback(async (query: string, results: SearchResult) => {
    setIsSearching(true)
    setSearchResults(results)
    setIsSearching(false)
  }, [])

  // 处理过滤器变化
  const handleFilter = useCallback((filters: any[]) => {
    // 这里可以根据过滤器调整搜索结果
    console.log('Filters applied:', filters)
  }, [])

  // 获取显示的组件
  const displayComponents = useMemo(() => {
    // 如果有搜索结果，使用搜索结果
    if (searchResults && searchResults.components.length > 0) {
      return searchResults.components
    }

    // 否则使用选中的分类
    if (selectedCategory === 'all') {
      return categories.flatMap(cat => cat.components)
    }

    const selected = categories.find(cat => cat.id === selectedCategory)
    return selected ? selected.components : []
  }, [searchResults, selectedCategory, categories])

  const totalComponents = displayComponents.length

  // 处理组件预览
  const handleComponentPreview = useCallback((component: any) => {
    // 这里可以打开预览模态框或跳转到详细页面
    console.log('Preview component:', component.name)
  }, [])

  // 处理组件编辑
  const handleComponentEdit = useCallback((component: any) => {
    // 跳转到编辑器模式
    const url = `/workbench?mode=editor&component=${component.name}&category=${component.category}`
    window.location.href = url
  }, [])

  // 处理组件复制
  const handleComponentCopy = useCallback((component: any) => {
    // 复制组件代码到剪贴板
    const code = `<${component.name} />`
    navigator.clipboard.writeText(code)
      .then(() => {
        // 可以显示成功提示
        console.log('Component code copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy:', err)
      })
  }, [])

  // 处理组件文档
  const handleComponentDocs = useCallback((component: any) => {
    // 打开组件文档
    const url = `/docs/components/${component.name.toLowerCase()}`
    window.open(url, '_blank')
  }, [])

  return (
    <div className="space-y-8">
      {/* 智能搜索区域 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">🧠 智能搜索</h2>
              <p className="text-sm text-muted-foreground mt-1">
                使用自然语言搜索，支持语义匹配和智能推荐
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {isSearching ? '搜索中...' : '就绪'}
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
            {/* 智能搜索框 */}
            <IntelligentSearch
              searchEngine={searchEngine}
              onSearch={handleSearch}
              onFilter={handleFilter}
              components={categories.flatMap(cat => cat.components)}
              placeholder="搜索组件名称、描述或功能..."
              showSuggestions={true}
              showHistory={true}
            />

            {/* 分类过滤 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchResults(null)
                }}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                  selectedCategory === 'all' && !searchResults
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
                    setSearchResults(null)
                  }}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                    selectedCategory === category.id && !searchResults
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
                {searchResults && (
                  <span>
                    {' '}• 搜索耗时: {searchResults.searchTime.toFixed(0)}ms
                    {' '}• 匹配度: {searchResults.stats.textMatches > 0 ? '文本' : ''}
                    {searchResults.stats.semanticMatches > 0 ? '语义' : ''}
                  </span>
                )}
              </div>
              {selectedCategory !== 'all' && !searchResults && (
                <span>分类: {categories.find(cat => cat.id === selectedCategory)?.name}</span>
              )}
              {searchResults && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchResults(null)
                  }}
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
                {searchResults ? '没有找到匹配的组件' : '该分类暂无组件'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchResults
                  ? '尝试调整搜索关键词或选择其他分类'
                  : '选择其他分类查看组件'
                }
              </p>
              {searchResults && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchResults(null)
                  }}
                >
                  清除搜索条件
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
            // 直接使用组件数据，而不是包装的 componentMatch
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

