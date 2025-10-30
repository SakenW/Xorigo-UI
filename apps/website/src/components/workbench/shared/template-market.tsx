'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@xorigo-ui/core'
import { Card } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { cn } from '@/utils'
import {
  Search,
  Star,
  Download,
  Eye,
  Plus,
  Filter,
  Grid,
  List,
  Heart,
  Share2,
  Clock,
  User,
  Tag,
  TrendingUp,
  Sparkles
} from 'lucide-react'

// 模板接口定义
interface Template {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  author: string
  authorAvatar?: string
  rating: number
  downloads: number
  views: number
  likes: number
  createdAt: string
  updatedAt: string
  isOfficial: boolean
  isPremium: boolean
  thumbnail?: string
  preview: string
  config: any
  version: string
}

// 模板分类
const CATEGORIES = [
  { id: 'all', name: '全部模板', icon: Grid },
  { id: 'business', name: '业务组件', icon: TrendingUp },
  { id: 'layout', name: '布局模板', icon: Grid },
  { id: 'form', name: '表单组件', icon: Plus },
  { id: 'dashboard', name: '仪表板', icon: Eye },
  { id: 'ecommerce', name: '电商组件', icon: Star },
  { id: 'social', name: '社交组件', icon: User }
]

// 排序选项
const SORT_OPTIONS = [
  { id: 'popular', name: '最受欢迎' },
  { id: 'newest', name: '最新发布' },
  { id: 'rating', name: '评分最高' },
  { id: 'downloads', name: '下载最多' }
]

// 模拟模板数据
const mockTemplates: Template[] = [
  {
    id: '1',
    name: '现代登录表单',
    description: '简洁现代的登录表单，支持多种认证方式',
    category: 'form',
    tags: ['登录', '表单', '认证', '响应式'],
    author: 'Xorigo Team',
    authorAvatar: '/avatars/xorigo.png',
    rating: 4.8,
    downloads: 1250,
    views: 3200,
    likes: 89,
    createdAt: '2025-10-25',
    updatedAt: '2025-10-28',
    isOfficial: true,
    isPremium: false,
    preview: `import { Button, Input, Card } from '@xorigo-ui/core'

export default function LoginForm() {
  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">登录</h2>
      <Input placeholder="邮箱" className="mb-4" />
      <Input type="password" placeholder="密码" className="mb-6" />
      <Button className="w-full">登录</Button>
    </Card>
  )
}`,
    config: {
      theme: 'modern',
      layout: 'centered',
      components: ['Input', 'Button', 'Card']
    },
    version: '1.2.0'
  },
  {
    id: '2',
    name: '数据仪表板',
    description: '功能完整的数据仪表板，包含图表和统计信息',
    category: 'dashboard',
    tags: ['仪表板', '数据可视化', '图表', '统计'],
    author: 'DevMaster',
    authorAvatar: '/avatars/devmaster.png',
    rating: 4.6,
    downloads: 890,
    views: 2100,
    likes: 67,
    createdAt: '2025-10-20',
    updatedAt: '2025-10-26',
    isOfficial: false,
    isPremium: true,
    preview: `import { Card, Button } from '@xorigo-ui/core'

export default function Dashboard() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="col-span-3 p-6">
        <h2 className="text-xl font-bold mb-4">数据概览</h2>
        {/* 图表组件 */}
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold mb-2">统计信息</h3>
        {/* 统计数据 */}
      </Card>
    </div>
  )
}`,
    config: {
      theme: 'corporate',
      layout: 'grid',
      components: ['Card', 'Button', 'Chart']
    },
    version: '2.1.0'
  },
  {
    id: '3',
    name: '产品展示卡片',
    description: '优雅的产品展示卡片，适合电商网站使用',
    category: 'ecommerce',
    tags: ['产品', '卡片', '电商', '展示'],
    author: 'UIExpert',
    rating: 4.5,
    downloads: 650,
    views: 1800,
    likes: 45,
    createdAt: '2025-10-18',
    updatedAt: '2025-10-25',
    isOfficial: false,
    isPremium: false,
    preview: `import { Card, Button, Image } from '@xorigo-ui/core'

export default function ProductCard({ product }) {
  return (
    <Card className="overflow-hidden">
      <Image src={product.image} alt={product.name} />
      <div className="p-4">
        <h3 className="font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">\${product.price}</span>
          <Button>购买</Button>
        </div>
      </div>
    </Card>
  )
}`,
    config: {
      theme: 'minimal',
      layout: 'card',
      components: ['Card', 'Button', 'Image']
    },
    version: '1.0.0'
  }
]

interface TemplateMarketProps {
  onUseTemplate?: (template: Template) => void
  className?: string
}

export function TemplateMarket({ onUseTemplate, className }: TemplateMarketProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // 过滤和排序模板
  const filteredTemplates = useMemo(() => {
    let templates = [...mockTemplates]

    // 分类过滤
    if (selectedCategory !== 'all') {
      templates = templates.filter(t => t.category === selectedCategory)
    }

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      templates = templates.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 排序
    switch (sortBy) {
      case 'rating':
        templates.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        templates.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
      case 'downloads':
        templates.sort((a, b) => b.downloads - a.downloads)
        break
      default: // popular
        templates.sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
    }

    return templates
  }, [selectedCategory, searchQuery, sortBy])

  // 渲染评分星星
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'w-4 h-4',
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            )}
          />
        ))}
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
          {rating.toFixed(1)}
        </span>
      </div>
    )
  }

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            模板市场
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            发现和使用高质量的代码模板
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            创建模板
          </Button>
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded',
                viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded',
                viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 搜索框 */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索模板名称、描述或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  selectedCategory === category.id
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            )
          })}
        </div>

        {/* 排序 */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {/* 模板列表 */}
      <div className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      )}>
        <AnimatePresence>
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={cn(
                'group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
                viewMode === 'list' ? 'p-4' : 'p-6'
              )}>
                {/* 模板头部 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {template.name}
                      </h3>
                      {template.isOfficial && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium">
                          官方
                        </span>
                      )}
                      {template.isPremium && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs rounded-full font-medium">
                          高级
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {template.name.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* 统计信息 */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {formatNumber(template.downloads)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatNumber(template.views)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {formatNumber(template.likes)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {template.updatedAt}
                  </div>
                </div>

                {/* 评分和作者 */}
                <div className="flex items-center justify-between mb-4">
                  {renderRating(template.rating)}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{template.author}</span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onUseTemplate?.(template)}
                  >
                    使用模板
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="p-2"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 空状态 */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            没有找到相关模板
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            试试调整搜索关键词或筛选条件
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
          >
            清除筛选
          </Button>
        </div>
      )}
    </div>
  )
}