'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import type { ComponentCategory } from '@/data/component-classification'

/**
 * Workbench Gallery 客户端组件
 * 处理搜索、过滤和交互功能
 */
interface WorkbenchGalleryClientProps {
  categories: ComponentCategory[]
}

export function WorkbenchGalleryClient({ categories }: WorkbenchGalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // 过滤分类
  const filteredCategories = useMemo(() => {
    let filtered = categories

    // 按分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(cat => cat.id === selectedCategory)
    }

    // 按搜索词过滤
    if (searchTerm) {
      filtered = filtered.map(category => ({
        ...category,
        components: category.components.filter(component =>
          component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          component.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.components.length > 0)
    }

    return filtered
  }, [categories, selectedCategory, searchTerm])

  const totalComponents = filteredCategories.reduce((total, cat) => total + cat.components.length, 0)

  return (
    <div className="space-y-8">
      {/* 搜索和过滤区域 */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">搜索和过滤</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 搜索框 */}
            <div>
              <Input
                type="text"
                placeholder="搜索组件名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* 分类过滤 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                全部
                <Badge variant="secondary" className="ml-2 text-xs">
                  {categories.reduce((total, cat) => total + cat.components.length, 0)}
                </Badge>
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.components.length}
                  </Badge>
                </button>
              ))}
            </div>

            {/* 过滤结果统计 */}
            <div className="text-sm text-muted-foreground">
              找到 {totalComponents} 个组件
              {selectedCategory !== 'all' && (
                <span> - 分类: {categories.find(cat => cat.id === selectedCategory)?.name}</span>
              )}
              {searchTerm && <span> - 搜索: "{searchTerm}"</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 组件展示区域 */}
      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">没有找到匹配的组件</h3>
              <p className="text-muted-foreground mb-4">
                尝试调整搜索关键词或选择其他分类
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
              >
                重置过滤条件
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <ComponentCategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 组件分类卡片
 */
function ComponentCategoryCard({ category }: { category: ComponentCategory }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{category.icon}</span>
            <div>
              <h3 className="text-xl font-semibold">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {category.components.length} 个组件
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '收起' : '展开'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.components.map((component) => (
              <ComponentCard key={component.name} component={component} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * 单个组件卡片
 */
function ComponentCard({ component }: { component: any }) {
  const handleEditInPlayground = () => {
    // 跳转到 Editor Mode 并带上组件信息
    const url = `/workbench?mode=editor&component=${component.name}&category=${component.category}`
    window.location.href = url
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleEditInPlayground}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{component.name}</h4>
          <Badge variant="outline" className="text-xs">
            {component.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{component.description}</p>

          {/* 属性展示 */}
          {component.props && (
            <div className="flex flex-wrap gap-1">
              {component.props.slice(0, 3).map((prop: string) => (
                <Badge key={prop} variant="secondary" className="text-xs">
                  {prop}
                </Badge>
              ))}
              {component.props.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{component.props.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* 变体展示 */}
          {component.variants && component.variants.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {component.variants.map((variant: string) => (
                <Badge key={variant} variant="outline" className="text-xs">
                  {variant}
                </Badge>
              ))}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); handleEditInPlayground(); }}>
              在编辑器中打开
            </Button>
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); }}>
              查看文档
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}