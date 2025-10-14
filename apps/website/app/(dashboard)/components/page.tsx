/**
 * Components Module - 组件展示与复制模块
 * 遵循架构规则：仅展示和复制功能，禁止编辑
 * 所有UI组件来自@xorigo-ui/core
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@xorigo-ui/core'
import {
  Search,
  BookOpen,
  Code,
  Download,
  Eye,
  Grid3X3,
  List,
  Filter,
  Zap,
  Copy,
  Check
} from 'lucide-react'

// 导入自定义组件
import { componentRegistry, componentCategories, ComponentCategory } from '../../../src/components/components/component-registry'
import ComponentCard from '../../../src/components/components/component-card'
import SearchFilter, { SearchFilters, filterComponents } from '../../../src/components/components/search-filter'

// 视图模式
type ViewMode = 'grid' | 'list'

/**
 * 统计卡片组件
 */
function StatsCard({ title, value, icon: Icon, description }: {
  title: string
  value: number
  icon: React.ElementType
  description: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Components 主页面组件
 */
export default function ComponentsPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    tags: [],
    sortBy: 'name',
    sortOrder: 'asc'
  })
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // 过滤后的组件
  const filteredComponents = useMemo(() => {
    return filterComponents(componentRegistry, filters)
  }, [filters])

  // 按分类统计
  const categoryStats = useMemo(() => {
    const stats: Record<ComponentCategory, number> = {} as Record<ComponentCategory, number>

    Object.keys(componentCategories).forEach((category) => {
      stats[category as ComponentCategory] = componentRegistry.filter(
        component => component.category === category
      ).length
    })

    return stats
  }, [])

  // 统计数据
  const stats = {
    total: componentRegistry.length,
    filtered: filteredComponents.length,
    categories: Object.keys(componentCategories).length,
    experimental: componentRegistry.filter(c => c.isExperimental).length
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 页面头部 */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Code className="h-6 w-6" />
                Components
              </h1>
              <p className="text-muted-foreground">
                浏览和复制 Xorigo UI 组件库中的高质量组件
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                仅展示和复制模式
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="h-8 w-8 p-0"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="总组件数"
            value={stats.total}
            icon={BookOpen}
            description="所有可用组件"
          />
          <StatsCard
            title="已筛选"
            value={stats.filtered}
            icon={Filter}
            description="当前筛选结果"
          />
          <StatsCard
            title="分类数"
            value={stats.categories}
            icon={Grid3X3}
            description="组件分类"
          />
          <StatsCard
            title="实验性"
            value={stats.experimental}
            icon={Zap}
            description="实验性组件"
          />
        </div>

        {/* 搜索和筛选 */}
        <SearchFilter
          onFilterChange={setFilters}
          totalCount={stats.total}
          filteredCount={stats.filtered}
        />

        {/* 组件列表 */}
        {filteredComponents.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }>
            {filteredComponents.map((component) => (
              <ComponentCard
                key={component.id}
                component={component}
                compact={viewMode === 'list'}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">未找到匹配的组件</h3>
              <p className="text-muted-foreground mb-4">尝试调整搜索关键词或筛选条件</p>
              <Button variant="outline" onClick={() => setFilters({
                query: '',
                categories: [],
                tags: [],
                sortBy: 'name',
                sortOrder: 'asc'
              })}>
                清除所有筛选
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 分类概览 */}
        {filters.query === '' && filters.categories.length === 0 && filters.tags.length === 0 && (
          <Card>
            <CardHeader title="分类概览" />
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(componentCategories).map(([category, info]) => (
                  <Button
                    key={category}
                    variant="outline"
                    onClick={() => setFilters({ ...filters, categories: [category as ComponentCategory] })}
                    className="h-auto p-3 flex flex-col items-center gap-2"
                  >
                    <span className="text-lg">{info.icon}</span>
                    <span className="text-sm font-medium">{info.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {categoryStats[category as ComponentCategory]}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* 页面底部 */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Components Module - 仅支持组件展示和代码复制</p>
            <p className="mt-1">
              需要编辑功能？请使用{' '}
              <a href="/workbench?mode=editor" className="text-primary hover:underline">
                Workbench Editor 模式
              </a>
            </p>
            <p className="mt-1">
              基于 @xorigo-ui/core v{process.env.npm_package_version || 'latest'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}