'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { cn } from '@/utils'
import { Search, Filter, Grid3X3, List, Star, Clock, Code, Zap } from 'lucide-react'
import { getAllComponents } from '../../../data/component-classification'
import { EnhancedComponentCard } from '../cards/enhanced-component-card'
import { ComponentPreviewRenderer } from '../component-previews/enhanced-component-previews'
import { generateComponentCodeExample } from '../component-previews/component-code-examples'

interface ComponentLibraryHomeProps {
  className?: string
  onComponentSelect?: (component: any) => void
}

export function ComponentLibraryHome({
  className,
  onComponentSelect
}: ComponentLibraryHomeProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'popularity'>('name')

  const components = getAllComponents()

  // 获取所有分类
  const categories = useMemo(() => {
    const cats = Array.from(new Set(components.map(comp => comp.category)))
    return ['all', ...cats]
  }, [components])

  // 过滤和排序组件
  const filteredComponents = useMemo(() => {
    let filtered = components.filter(component => {
      const matchesSearch = searchQuery === '' ||
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    // 排序
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'category':
          return a.category.localeCompare(b.category)
        case 'popularity':
          // 模拟热度排序
          return (b.name.length % 10) - (a.name.length % 10)
        default:
          return 0
      }
    })
  }, [components, searchQuery, selectedCategory, sortBy])

  // 统计信息
  const stats = useMemo(() => {
    const byCategory = components.reduce((acc, comp) => {
      acc[comp.category] = (acc[comp.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: components.length,
      categories: Object.keys(byCategory).length,
      mostPopularCategory: Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]
    }
  }, [components])

  const handleComponentClick = (component: any) => {
    onComponentSelect?.(component)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Hero 区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🎨 组件库
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            探索 60+ 个高质量 UI 组件，涵盖基础、表单、布局、导航等 10 大分类
            <br />
            基于 React 19 + TypeScript 5.9 + Tailwind CSS 4 构建
          </p>

          {/* 统计信息卡片 */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Grid3X3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">总组件数</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Filter className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">分类数量</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.categories}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">热门分类</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                {stats.mostPopularCategory?.[0] || 'Base'}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">TypeScript</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                100%
              </div>
            </motion.div>
          </div>

          {/* 搜索和筛选区域 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="搜索组件名称或功能..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-12 text-lg border-0 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 排序选择 */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">按名称排序</option>
                <option value="category">按分类排序</option>
                <option value="popularity">按热度排序</option>
              </select>

              {/* 视图切换 */}
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 分类筛选标签 */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    selectedCategory === category
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  )}
                >
                  {category === 'all' ? '全部' : category}
                  <span className="ml-2 text-xs opacity-60">
                    ({category === 'all' ? components.length : components.filter(c => c.category === category).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 组件列表标题 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategory === 'all' ? '所有组件' : `${selectedCategory} 组件`}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery && `搜索 "${searchQuery}" 的结果 - `}
              共 {filteredComponents.length} 个组件
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              最近更新
            </Button>
            <Button variant="outline" size="sm">
              <Star className="w-4 h-4 mr-2" />
              我的收藏
            </Button>
          </div>
        </div>

        {/* 组件网格 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn(
            viewMode === 'grid'
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          )}
        >
          {filteredComponents.map((component, index) => (
            <motion.div
              key={component.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 * index }}
              onClick={() => handleComponentClick(component)}
            >
              <EnhancedComponentCard
                component={component}
                variant="default"
                density={viewMode === 'list' ? 'compact' : 'comfortable'}
                interactive={true}
                showcase={
                  <ComponentPreviewRenderer component={component} />
                }
                usage={
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <div className="text-sm font-medium mb-2">{component.name} 组件示例</div>
                    <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                      <code>{generateComponentCodeExample({ componentName: component.name })}</code>
                    </pre>
                  </div>
                }
              />
            </motion.div>
          ))}
        </motion.div>

        {/* 空状态 */}
        {filteredComponents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到匹配的组件</h3>
            <p className="text-gray-600 mb-6">尝试调整搜索关键词或选择不同的分类</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
            >
              清除过滤条件
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}