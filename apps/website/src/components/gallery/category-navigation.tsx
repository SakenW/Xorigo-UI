'use client'

/**
 * 组件分类导航
 *
 * 提供按分类筛选组件的功能
 */

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { Search, Filter } from 'lucide-react'
import { ComponentCategory, ComponentInfo } from '@/data/component-classification'
import { useState } from 'react'
import { ComponentGrid } from './component-card'
import { ComponentPreview } from './component-preview'

interface CategoryNavigationProps {
  categories: ComponentCategory[]
  onPreview?: (component: ComponentInfo) => void
  className?: string
}

export function CategoryNavigation({
  categories,
  onPreview,
  className = ''
}: CategoryNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [previewComponent, setPreviewComponent] = useState<ComponentInfo | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handlePreview = (component: ComponentInfo) => {
    setPreviewComponent(component)
    setIsPreviewOpen(true)
    onPreview?.(component)
  }

  // 过滤组件
  const filteredComponents = () => {
    let components: ComponentInfo[] = []

    if (selectedCategory === 'all') {
      components = categories.flatMap(cat => cat.components)
    } else {
      const category = categories.find(cat => cat.id === selectedCategory)
      components = category?.components || []
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      components = components.filter(component =>
        component.name.toLowerCase().includes(query) ||
        component.description.toLowerCase().includes(query) ||
        component.props?.some(prop => prop.toLowerCase().includes(query))
      )
    }

    return components
  }

  const getTotalCount = () => {
    return categories.reduce((total, cat) => total + cat.components.length, 0)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 搜索和筛选区域 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索组件名称、描述或属性..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            共 {filteredComponents().length} 个组件
          </span>
        </div>
      </div>

      {/* 分类导航标签 */}
      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 lg:grid-cols-11 h-auto p-1">
          <TabsTrigger
            value="all"
            className="text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            全部
            <Badge variant="secondary" className="ml-1 h-5 text-xs">
              {getTotalCount()}
            </Badge>
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              title={category.description}
            >
              <span className="hidden sm:inline">{category.icon}</span>
              <span className="truncate">{category.name.split(' ')[0]}</span>
              <Badge variant="secondary" className="ml-1 h-5 text-xs">
                {category.components.length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* 分类内容 */}
        <TabsContent value="all" className="mt-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">所有组件</h2>
              <p className="text-muted-foreground">
                展示所有 {getTotalCount()} 个组件
              </p>
            </div>
            <ComponentGrid
              components={filteredComponents()}
              onPreview={handlePreview}
            />
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="space-y-6">
              {/* 分类标题 */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{category.icon}</span>
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {category.description}
                </p>
                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span>共 {category.components.length} 个组件</span>
                  <span>•</span>
                  <span>排序 #{category.order}</span>
                </div>
              </div>

              {/* 子分类分组 (如果有) */}
              {(() => {
                const subcategories = Array.from(
                  new Set(
                    category.components
                      .map(comp => comp.subcategory)
                      .filter(Boolean) as string[]
                  )
                )

                if (subcategories.length > 1) {
                  return (
                    <div className="space-y-8">
                      {subcategories.map((subcat) => {
                        const subcatComponents = category.components.filter(
                          comp => comp.subcategory === subcat
                        )
                        return (
                          <div key={subcat}>
                            <h3 className="text-lg font-semibold mb-4">
                              {subcat}
                            </h3>
                            <ComponentGrid
                              components={subcatComponents}
                              onPreview={handlePreview}
                            />
                          </div>
                        )
                      })}
                    </div>
                  )
                }
              })()}

              {/* 该分类的所有组件 */}
              <ComponentGrid
                components={filteredComponents()}
                onPreview={handlePreview}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* 组件预览模态框 */}
      {previewComponent && (
        <ComponentPreview
          component={previewComponent}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        />
      )}
    </div>
  )
}