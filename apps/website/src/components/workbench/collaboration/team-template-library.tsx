'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import { Search, Filter, Grid, List, Star, Download, Eye, Heart, Clock, Tag, Plus, Upload, Edit3, Trash2, Copy, CheckCircle, AlertCircle, TrendingUp, Users, Code, Layout, Component, Settings, Workflow, Database, Palette } from 'lucide-react'
import { getTemplateService, type TemplateService } from './services/template-service'
import type {
  TeamTemplate,
  TemplateCategory,
  TemplateLibrary,
  UseTemplateLibraryOptions
} from './types'

// ============================================================================
// 组件变体配置
// ============================================================================

const templateCardVariants = cva(
  'rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-lg',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
        featured: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
        selected: 'border-purple-500 bg-purple-50 dark:bg-purple-950'
      },
      layout: {
        grid: 'p-4',
        list: 'p-4 flex items-center gap-4'
      }
    },
    defaultVariants: {
      variant: 'default',
      layout: 'grid'
    }
  }
)

const categoryIconMap: Record<TemplateCategory, React.ComponentType<any>> = {
  layout: Layout,
  component: Component,
  pattern: Grid,
  'business-logic': Settings,
  'data-structure': Database,
  styling: Palette,
  configuration: Settings,
  workflow: Workflow
}

const categoryColorMap: Record<TemplateCategory, string> = {
  layout: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900',
  component: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900',
  pattern: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900',
  'business-logic': 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900',
  'data-structure': 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900',
  styling: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900',
  configuration: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900',
  workflow: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900'
}

// ============================================================================
// 组件 Props
// ============================================================================

interface TeamTemplateLibraryProps {
  organizationId?: string
  userId: string
  className?: string
  onTemplateSelected?: (template: TeamTemplate) => void
  onError?: (error: any) => void
}

// ============================================================================
// 模卡片组件
// ============================================================================

interface TemplateCardProps {
  template: TeamTemplate
  layout: 'grid' | 'list'
  onSelect: (template: TeamTemplate) => void
  onUse: (template: TeamTemplate) => void
  onRate: (templateId: string, rating: number) => void
  onDuplicate: (template: TeamTemplate) => void
  onEdit: (template: TeamTemplate) => void
  onDelete: (template: TeamTemplate) => void
  showActions?: boolean
}

function TemplateCard({
  template,
  layout,
  onSelect,
  onUse,
  onRate,
  onDuplicate,
  onEdit,
  onDelete,
  showActions = true
}: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [rating, setRating] = useState(0)

  const CategoryIcon = categoryIconMap[template.category]
  const categoryColor = categoryColorMap[template.category]

  const handleRating = (newRating: number) => {
    setRating(newRating)
    onRate(template.id, newRating)
  }

  const formatComplexity = (complexity: string) => {
    const complexityMap = {
      simple: '简单',
      moderate: '中等',
      complex: '复杂'
    }
    return complexityMap[complexity as keyof typeof complexityMap] || complexity
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}分钟`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(template)}
      className={cn(templateCardVariants({ layout }))}
    >
      {layout === 'grid' ? (
        // 网格布局
        <div className="space-y-3">
          {/* 头部 */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={cn('p-2 rounded-lg', categoryColor)}>
                <CategoryIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  by {template.author.name}
                </p>
              </div>
            </div>
            {template.isApproved && (
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            )}
          </div>

          {/* 描述 */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {template.description}
          </p>

          {/* 标签 */}
          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                  {tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                  +{template.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 元数据 */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-3">
              <span>{formatComplexity(template.metadata.complexity)}</span>
              <span>{formatTime(template.metadata.estimatedTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>{template.statistics.averageRating.toFixed(1)}</span>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{template.statistics.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>{template.statistics.uses}</span>
              </div>
            </div>
            <span>{formatRelativeTime(template.updatedAt)}</span>
          </div>

          {/* 操作按钮 */}
          <AnimatePresence>
            {isHovered && showActions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onUse(template)}
                  className="flex-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  使用模板
                </button>
                <button
                  onClick={() => onDuplicate(template)}
                  className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {template.author.id === 'current-user' && (
                  <>
                    <button
                      onClick={() => onEdit(template)}
                      className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDelete(template)}
                      className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        // 列表布局
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className={cn('p-2 rounded-lg', categoryColor)}>
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {template.name}
                </h3>
                {template.isApproved && (
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                {template.description}
              </p>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-500">
                <span>by {template.author.name}</span>
                <span>{formatComplexity(template.metadata.complexity)}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span>{template.statistics.averageRating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{template.statistics.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>{template.statistics.uses}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUse(template)
              }}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              使用模板
            </button>
            {showActions && (
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate(template)
                  }}
                  className="p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {template.author.id === 'current-user' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(template)
                      }}
                      className="p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(template)
                      }}
                      className="p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 评分组件 */}
      {rating > 0 && (
        <div className="flex items-center gap-1 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-600 dark:text-gray-400">您的评分:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-4 h-4 cursor-pointer transition-colors',
                  star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRating(star)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ============================================================================
// 搜索和筛选组件
// ============================================================================

interface SearchFilterProps {
  searchTerm: string
  selectedCategory: TemplateCategory | 'all'
  selectedTags: string[]
  categories: TemplateCategory[]
  availableTags: string[]
  onSearchChange: (term: string) => void
  onCategoryChange: (category: TemplateCategory | 'all') => void
  onTagsChange: (tags: string[]) => void
}

function SearchFilter({
  searchTerm,
  selectedCategory,
  selectedTags,
  categories,
  availableTags,
  onSearchChange,
  onCategoryChange,
  onTagsChange
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜索模板..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors',
            showFilters ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          )}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* 筛选器 */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
          >
            {/* 分类筛选 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                分类
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onCategoryChange('all')}
                  className={cn(
                    'px-3 py-1 text-sm rounded-lg transition-colors',
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  全部
                </button>
                {categories.map((category) => {
                  const Icon = categoryIconMap[category]
                  return (
                    <button
                      key={category}
                      onClick={() => onCategoryChange(category)}
                      className={cn(
                        'flex items-center gap-1 px-3 py-1 text-sm rounded-lg transition-colors',
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      {category}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 标签筛选 */}
            {availableTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  标签
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={cn(
                        'px-2 py-1 text-xs rounded-full transition-colors',
                        selectedTags.includes(tag)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 活动筛选条件 */}
      {(selectedCategory !== 'all' || selectedTags.length > 0) && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">筛选条件:</span>
          {selectedCategory !== 'all' && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center gap-1">
              {selectedCategory}
              <button
                onClick={() => onCategoryChange('all')}
                className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                ×
              </button>
            </span>
          )}
          {selectedTags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full flex items-center gap-1">
              {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-1 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ×
              </button>
            </span>
          ))}
          <button
            onClick={() => {
              onCategoryChange('all')
              onTagsChange([])
            }}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            清除全部
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 创建/编辑模板表单
// ============================================================================

interface TemplateFormProps {
  template?: TeamTemplate
  categories: TemplateCategory[]
  onSubmit: (templateData: any) => void
  onCancel: () => void
}

function TemplateForm({ template, categories, onSubmit, onCancel }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    category: template?.category || 'component',
    tags: template?.tags?.join(', ') || '',
    code: template?.content?.code || '',
    dependencies: template?.content?.dependencies?.join(', ') || '',
    version: template?.metadata?.version || '1.0.0',
    framework: template?.metadata?.framework || 'React',
    language: template?.metadata?.language || 'TypeScript',
    complexity: template?.metadata?.complexity || 'simple',
    estimatedTime: template?.metadata?.estimatedTime || 30,
    prerequisites: template?.metadata?.prerequisites?.join(', ') || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const templateData = {
      name: formData.name,
      description: formData.description,
      category: formData.category as TemplateCategory,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      content: {
        code: formData.code,
        dependencies: formData.dependencies.split(',').map(dep => dep.trim()).filter(Boolean),
        configuration: {}
      },
      metadata: {
        version: formData.version,
        compatibility: [`${formData.framework} 18+`, 'TypeScript 5+'],
        framework: formData.framework,
        language: formData.language,
        complexity: formData.complexity as 'simple' | 'moderate' | 'complex',
        estimatedTime: formData.estimatedTime,
        prerequisites: formData.prerequisites.split(',').map(prereq => prereq.trim()).filter(Boolean)
      }
    }

    onSubmit(templateData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {template ? '编辑模板' : '创建新模板'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              模板名称 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              分类 *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            描述 *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            标签 (用逗号分隔)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="例如: responsive, mobile, modern"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            代码 *
          </label>
          <textarea
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
            required
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              版本
            </label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              复杂度
            </label>
            <select
              value={formData.complexity}
              onChange={(e) => setFormData(prev => ({ ...prev, complexity: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="simple">简单</option>
              <option value="moderate">中等</option>
              <option value="complex">复杂</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              预估时间 (分钟)
            </label>
            <input
              type="number"
              value={formData.estimatedTime}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            依赖 (用逗号分隔)
          </label>
          <input
            type="text"
            value={formData.dependencies}
            onChange={(e) => setFormData(prev => ({ ...prev, dependencies: e.target.value }))}
            placeholder="例如: react, @types/react"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            前置条件 (用逗号分隔)
          </label>
          <input
            type="text"
            value={formData.prerequisites}
            onChange={(e) => setFormData(prev => ({ ...prev, prerequisites: e.target.value }))}
            placeholder="例如: React基础, TypeScript基础"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {template ? '更新模板' : '创建模板'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
        </div>
      </form>
    </motion.div>
  )
}

// ============================================================================
// 主团队模板库组件
// ============================================================================

export function TeamTemplateLibrary({
  organizationId,
  userId,
  className,
  onTemplateSelected,
  onError
}: TeamTemplateLibraryProps) {
  const [templates, setTemplates] = useState<TeamTemplate[]>([])
  const [library, setLibrary] = useState<TemplateLibrary | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated' | 'rating' | 'popularity'>('updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<TeamTemplate | null>(null)

  const templateServiceRef = useRef<TemplateService | null>(null)

  // 初始化模板服务
  useEffect(() => {
    if (!userId) return

    const service = getTemplateService({
      organizationId,
      userId,
      onTemplateSelected: (template) => {
        onTemplateSelected?.(template)
      },
      onError: (error) => {
        console.error('Template service error:', error)
        onError?.(error)
      }
    })

    templateServiceRef.current = service

    loadData()
  }, [organizationId, userId])

  // 加载数据
  const loadData = useCallback(async () => {
    try {
      setLoading(true)

      const [libraryData, templatesData] = await Promise.all([
        templateServiceRef.current?.getLibrary() || null,
        templateServiceRef.current?.searchTemplates({
          query: searchTerm,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          tags: selectedTags,
          sortBy,
          sortOrder,
          page: currentPage,
          limit: layout === 'grid' ? 12 : 20
        }) || { success: false, data: { templates: [], total: 0, page: 1, totalPages: 1 } }
      ])

      setLibrary(libraryData)
      if (templatesData.success) {
        setTemplates(templatesData.data.templates)
      }
    } catch (error) {
      console.error('Failed to load template library data:', error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, selectedCategory, selectedTags, sortBy, sortOrder, currentPage, layout, onError])

  // 搜索和筛选变化时重新加载数据
  useEffect(() => {
    setCurrentPage(1)
    loadData()
  }, [searchTerm, selectedCategory, selectedTags, sortBy, sortOrder])

  // 处理模板选择
  const handleTemplateSelect = useCallback((template: TeamTemplate) => {
    console.log('Selected template:', template)
    onTemplateSelected?.(template)
  }, [onTemplateSelected])

  // 处理使用模板
  const handleUseTemplate = useCallback(async (template: TeamTemplate) => {
    if (templateServiceRef.current) {
      const result = await templateServiceRef.current.useTemplate(template.id)
      if (result.success) {
        // 这里可以实现模板使用逻辑
        console.log('Template used:', template)
      }
    }
  }, [])

  // 处理评分模板
  const handleRateTemplate = useCallback(async (templateId: string, rating: number) => {
    if (templateServiceRef.current) {
      const result = await templateServiceRef.current.rateTemplate(templateId, rating)
      if (result.success) {
        await loadData()
      }
    }
  }, [loadData])

  // 处理复制模板
  const handleDuplicateTemplate = useCallback(async (template: TeamTemplate) => {
    if (templateServiceRef.current) {
      const result = await templateServiceRef.current.duplicateTemplate(template.id)
      if (result.success) {
        await loadData()
      }
    }
  }, [loadData])

  // 处理编辑模板
  const handleEditTemplate = useCallback((template: TeamTemplate) => {
    setEditingTemplate(template)
    setShowCreateForm(true)
  }, [])

  // 处理删除模板
  const handleDeleteTemplate = useCallback(async (template: TeamTemplate) => {
    if (window.confirm(`确定要删除模板 "${template.name}" 吗？`)) {
      if (templateServiceRef.current) {
        const result = await templateServiceRef.current.deleteTemplate(template.id)
        if (result.success) {
          await loadData()
        }
      }
    }
  }, [loadData])

  // 处理创建模板
  const handleCreateTemplate = useCallback(async (templateData: any) => {
    if (templateServiceRef.current) {
      const result = await templateServiceRef.current.createTemplate(templateData)
      if (result.success) {
        setShowCreateForm(false)
        await loadData()
      }
    }
  }, [loadData])

  // 处理更新模板
  const handleUpdateTemplate = useCallback(async (templateData: any) => {
    if (templateServiceRef.current && editingTemplate) {
      const result = await templateServiceRef.current.updateTemplate(editingTemplate.id, templateData)
      if (result.success) {
        setShowCreateForm(false)
        setEditingTemplate(null)
        await loadData()
      }
    }
  }, [editingTemplate, loadData])

  // 获取可用标签
  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    templates.forEach(template => {
      template.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  }, [templates])

  // 获取分类列表
  const categories = library?.categories || []

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            团队模板库
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            发现、使用和分享团队模板
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTemplate(null)
            setShowCreateForm(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          创建模板
        </button>
      </div>

      {/* 搜索和筛选 */}
      <SearchFilter
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedTags={selectedTags}
        categories={categories}
        availableTags={availableTags}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onTagsChange={setSelectedTags}
      />

      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">排序:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="updated">更新时间</option>
              <option value="created">创建时间</option>
              <option value="name">名称</option>
              <option value="rating">评分</option>
              <option value="popularity">使用量</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="desc">降序</option>
              <option value="asc">升序</option>
            </select>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            共 {templates.length} 个模板
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLayout('grid')}
            className={cn(
              'p-2 rounded transition-colors',
              layout === 'grid' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            )}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayout('list')}
            className={cn(
              'p-2 rounded transition-colors',
              layout === 'list' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 创建/编辑模板表单 */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TemplateForm
              template={editingTemplate || undefined}
              categories={categories}
              onSubmit={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
              onCancel={() => {
                setShowCreateForm(false)
                setEditingTemplate(null)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 模板列表 */}
      {templates.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Component className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            暂无模板
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            创建第一个模板来开始使用团队模板库
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            创建模板
          </button>
        </div>
      ) : (
        <div className={cn(
          layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'
        )}>
          <AnimatePresence>
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                layout={layout}
                onSelect={handleTemplateSelect}
                onUse={handleUseTemplate}
                onRate={handleRateTemplate}
                onDuplicate={handleDuplicateTemplate}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 分页 */}
      {/* 这里可以实现分页组件 */}
    </div>
  )
}

// 工具函数
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}分钟前`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}小时前`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}天前`
  } else {
    return date.toLocaleDateString()
  }
}