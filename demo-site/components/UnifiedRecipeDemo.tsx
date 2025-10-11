/**
 * 🎨 TH-UI 统一配方系统演示组件
 *
 * 核心设计理念：
 * 1. 纯七轴DTCG体系 - 所有配方统一为七轴格式
 * 2. 多维度过滤 - 支持按模式/色调/密度/表面/类别等维度筛选
 * 3. 实时切换 - 点击配方立即应用，无任何中间状态
 * 4. 无限扩展 - 配方数量不受限制，可持续添加
 *
 * 包含功能：
 * - 当前20个七轴DTCG配方 (可无限扩展)
 * - 七轴多维度过滤器 (mode/tone/density/surface/category)
 * - 实时配方切换和预览
 * - 配方搜索和标签筛选
 * - 详细配方信息展示
 */

import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDTCGStyleRecipe } from '../../src/style-recipe/provider/DTCGStyleRecipeProvider'
import { unifiedRecipes, filterUnifiedRecipes, searchUnifiedRecipes, getRecipePreviewColors, type RecipeFilterOptions } from '../../src/style-recipe/recipes/unified-recipes'
import type { StyleRecipe } from '../../src/style-recipe/types'

// ============================================================================
// 类型定义 (Type Definitions)
// ============================================================================

interface FilterState {
  mode: string[]
  tone: string[]
  density: string[]
  surface: string[]
  category: string[]
}

// ============================================================================
// 主组件 (Main Component)
// ============================================================================

export default function UnifiedRecipeDemo() {
  const {
    currentRecipe,
    setRecipe,
  } = useDTCGStyleRecipe()

  // 搜索和过滤状态
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    mode: [],
    tone: [],
    density: [],
    surface: [],
    category: []
  })
  const [showFilters, setShowFilters] = useState(false)

  // 过滤后的配方列表
  const filteredRecipes = useMemo(() => {
    let recipes = [...unifiedRecipes]

    // 文本搜索
    if (searchTerm.trim()) {
      recipes = searchUnifiedRecipes(searchTerm)
    }

    // 多维度过滤
    const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0)
    if (hasActiveFilters) {
      const filterOptions: RecipeFilterOptions = {}
      if (filters.mode.length > 0) filterOptions.mode = filters.mode
      if (filters.tone.length > 0) filterOptions.tone = filters.tone
      if (filters.density.length > 0) filterOptions.density = filters.density
      if (filters.surface.length > 0) filterOptions.surface = filters.surface
      if (filters.category.length > 0) filterOptions.category = filters.category

      recipes = filterUnifiedRecipes(filterOptions)
    }

    return recipes
  }, [searchTerm, filters])

  // 配方选择
  const selectRecipe = useCallback((recipe: StyleRecipe) => {
    setRecipe(recipe.id)
  }, [setRecipe])

  // 过滤器切换
  const toggleFilter = useCallback((dimension: keyof FilterState, value: string) => {
    setFilters(prev => {
      const current = prev[dimension]
      const newValues = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return { ...prev, [dimension]: newValues }
    })
  }, [])

  // 清除所有过滤器
  const clearFilters = useCallback(() => {
    setFilters({
      mode: [],
      tone: [],
      density: [],
      surface: [],
      category: []
    })
    setSearchTerm('')
  }, [])

  // 统计信息
  const stats = useMemo(() => {
    const totalRecipes = unifiedRecipes.length
    const filteredCount = filteredRecipes.length
    const categories = new Set(unifiedRecipes.map(r => r.category))
    const modes = new Set(unifiedRecipes.map(r => r.mode))

    return {
      total: totalRecipes,
      filtered: filteredCount,
      categories: categories.size,
      modes: modes.size
    }
  }, [filteredRecipes])

  // 获取所有可用的过滤选项
  const filterOptions = useMemo(() => ({
    modes: ['light', 'dark', 'hc'],
    tones: ['muted', 'calm', 'standard', 'vivid', 'vibrant'],
    densities: ['compact', 'comfortable', 'spacious'],
    surfaces: ['flat', 'soft-shadow', 'elevated', 'glass', 'glass+neon'],
    categories: Array.from(new Set(unifiedRecipes.map(r => r.category)))
  }), [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* 页面头部 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎨 TH-UI 统一配方体系
              </h1>
              <p className="text-gray-600 mt-1">
                20个七轴DTCG配方，多维度智能过滤
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-blue-600">{stats.filtered}</span> / {stats.total} 配方
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showFilters
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showFilters ? '隐藏过滤器' : '显示过滤器'}
              </button>
            </div>
          </div>

          {/* 搜索栏 */}
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 搜索配方名称、描述、标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 多维度过滤器 */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 bg-gray-50/80"
            >
              <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
                {/* 模式过滤 */}
                <FilterRow
                  label="模式"
                  options={filterOptions.modes}
                  selected={filters.mode}
                  onToggle={(value) => toggleFilter('mode', value)}
                  getLabel={(v) => ({
                    light: '☀️ 亮色',
                    dark: '🌙 深色',
                    hc: '🔆 高对比'
                  }[v] || v)}
                />

                {/* 色调过滤 */}
                <FilterRow
                  label="色调"
                  options={filterOptions.tones}
                  selected={filters.tone}
                  onToggle={(value) => toggleFilter('tone', value)}
                  getLabel={(v) => ({
                    muted: '柔和',
                    calm: '平静',
                    standard: '标准',
                    vivid: '鲜艳',
                    vibrant: '活力'
                  }[v] || v)}
                />

                {/* 密度过滤 */}
                <FilterRow
                  label="密度"
                  options={filterOptions.densities}
                  selected={filters.density}
                  onToggle={(value) => toggleFilter('density', value)}
                  getLabel={(v) => ({
                    compact: '紧凑',
                    comfortable: '舒适',
                    spacious: '宽松'
                  }[v] || v)}
                />

                {/* 表面过滤 */}
                <FilterRow
                  label="表面"
                  options={filterOptions.surfaces}
                  selected={filters.surface}
                  onToggle={(value) => toggleFilter('surface', value)}
                  getLabel={(v) => ({
                    flat: '扁平',
                    'soft-shadow': '柔和阴影',
                    elevated: '层次感',
                    glass: '玻璃',
                    'glass+neon': '霓虹玻璃'
                  }[v] || v)}
                />

                {/* 类别过滤 */}
                <FilterRow
                  label="类别"
                  options={filterOptions.categories}
                  selected={filters.category}
                  onToggle={(value) => toggleFilter('category', value)}
                  getLabel={(v) => ({
                    creative: '🎨 创意',
                    corporate: '💼 企业',
                    minimal: '✨ 极简',
                    tech: '⚡ 科技',
                    classic: '📐 经典'
                  }[v] || v)}
                />

                {/* 清除按钮 */}
                <div className="flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
                  >
                    清除所有过滤器
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 配方效果预览区域 */}
        <AnimatePresence>
          {currentRecipe && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.25, // 更快的动画
                ease: "easeInOut"
              }}
              className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white"
            >
              <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      🎨 当前配方效果预览
                    </h2>
                    <p className="text-sm text-gray-600">
                      点击上方配方卡片可实时切换效果
                    </p>
                  </div>
                  <button
                    onClick={() => setRecipe(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <RecipePreview recipe={currentRecipe} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 配方网格 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">未找到匹配的配方</h3>
            <p className="text-gray-500">试试调整搜索条件或过滤器</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isSelected={currentRecipe?.id === recipe.id}
                onSelect={() => selectRecipe(recipe)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// 子组件 (Sub Components)
// ============================================================================

/**
 * 过滤器行组件
 */
interface FilterRowProps {
  label: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
  getLabel?: (value: string) => string
}

function FilterRow({ label, options, selected, onToggle, getLabel = (v) => v }: FilterRowProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-sm font-medium text-gray-700 min-w-[80px] pt-2">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            onClick={() => onToggle(option)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
              selected.includes(option)
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {getLabel(option)}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * 配方卡片组件
 */
interface RecipeCardProps {
  recipe: StyleRecipe
  isSelected: boolean
  onSelect: () => void
  index: number
}

function RecipeCard({ recipe, isSelected, onSelect, index }: RecipeCardProps) {
  // 使用 recipeColorMap 中定义的实际渐变
  const getPreviewGradient = () => {
    const colors = getRecipePreviewColors(recipe.id)
    return colors.gradient
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.02 }} // 更快更平滑
      whileHover={{
        y: -2,  // 减少悬停位移
        scale: 1.01, // 减少缩放
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.99, // 轻微点击反馈
        transition: { duration: 0.1 }
      }}
      onClick={onSelect}
      className={`
        relative cursor-pointer rounded-2xl border-2 transition-all duration-200 overflow-hidden
        ${isSelected
          ? 'border-blue-500 shadow-xl ring-2 ring-blue-100' // 减少选中效果的强度
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md' // 减少阴影强度
        }
      `}
      style={{ background: getPreviewGradient() }}
    >
      <div className="p-5">
        {/* 配方类别和模式 */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            recipe.category === 'creative' ? 'bg-purple-100 text-purple-800'
              : recipe.category === 'corporate' ? 'bg-blue-100 text-blue-800'
              : recipe.category === 'tech' ? 'bg-cyan-100 text-cyan-800'
              : recipe.category === 'minimal' ? 'bg-gray-100 text-gray-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {recipe.category === 'creative' ? '🎨 创意'
              : recipe.category === 'corporate' ? '💼 企业'
              : recipe.category === 'tech' ? '⚡ 科技'
              : recipe.category === 'minimal' ? '✨ 极简'
              : '📐 经典'}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            recipe.mode === 'dark' ? 'bg-gray-800 text-white'
              : recipe.mode === 'hc' ? 'bg-yellow-100 text-yellow-800'
              : 'bg-white text-gray-800'
          }`}>
            {recipe.mode === 'dark' ? '🌙 深色'
              : recipe.mode === 'hc' ? '🔆 高对比'
              : '☀️ 亮色'}
          </span>
        </div>

        {/* 配方名称 */}
        <h3 className={`text-lg font-bold mb-2 ${
          recipe.mode === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {recipe.name}
        </h3>

        {/* 配方描述 */}
        <p className={`text-sm mb-3 line-clamp-2 ${
          recipe.mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {recipe.description}
        </p>

        {/* 七轴关键信息 */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <AxisBadge label={recipe.tone} color="purple" />
          <AxisBadge label={recipe.density} color="blue" />
          <AxisBadge label={recipe.surface.replace('+', ' ')} color="green" />
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-white/50 backdrop-blur-sm text-gray-700 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 选中指示器 */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-white text-lg">✓</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

/**
 * 轴标签组件
 */
interface AxisBadgeProps {
  label: string
  color: 'purple' | 'blue' | 'green'
}

function AxisBadge({ label, color }: AxisBadgeProps) {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
  }

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${colorClasses[color]}`}>
      {label}
    </span>
  )
}

/**
 * 配方效果预览组件
 */
interface RecipePreviewProps {
  recipe: StyleRecipe
}

function RecipePreview({ recipe }: RecipePreviewProps) {
  const colors = getRecipePreviewColors(recipe.id)

  return (
    <div className="space-y-6">
      {/* 配方信息卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 15 }} // 减少初始位移
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.2, // 更快的动画
          ease: "easeOut"
        }}
        className="rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden"
        style={{ background: colors.gradient }}
      >
        <div className="p-8">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              {/* 配方名称和描述 */}
              <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">
                {recipe.name}
              </h3>
              <p className="text-white/90 mb-4 drop-shadow">
                {recipe.description}
              </p>

              {/* 七轴参数展示 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-xs text-white/70 mb-1">模式</div>
                  <div className="text-sm font-medium text-white">
                    {recipe.mode === 'dark' ? '🌙 深色'
                     : recipe.mode === 'hc' ? '🔆 高对比'
                     : '☀️ 亮色'}
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-xs text-white/70 mb-1">色调</div>
                  <div className="text-sm font-medium text-white">
                    {recipe.tone}
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-xs text-white/70 mb-1">密度</div>
                  <div className="text-sm font-medium text-white">
                    {recipe.density}
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-xs text-white/70 mb-1">表面</div>
                  <div className="text-sm font-medium text-white">
                    {recipe.surface?.replace('+', ' ') || recipe.surface || '未知'}
                  </div>
                </div>
              </div>

              {/* 标签展示 */}
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs bg-white/30 backdrop-blur-sm text-white rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 颜色预览 */}
            <div className="flex flex-col gap-3">
              <div
                className="w-16 h-16 rounded-xl border-2 border-white/30 shadow-lg"
                style={{ backgroundColor: colors.primary }}
                title="主色调"
              />
              <div
                className="w-16 h-16 rounded-xl border-2 border-white/30 shadow-lg"
                style={{ backgroundColor: colors.secondary }}
                title="辅助色调"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 组件预览区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 卡片预览 */}
        <ComponentPreviewCard
          title="卡片组件"
          colors={colors}
          recipe={recipe}
        >
          <div
            className="rounded-lg p-4 border-2 shadow-md"
            style={{
              background: colors.gradient,
              borderColor: colors.primary,
              color: recipe.mode === 'dark' ? 'white' : 'black'
            }}
          >
            <div className="font-semibold mb-2">示例卡片</div>
            <div className="text-sm opacity-80">
              这个卡片使用了 {recipe.name} 配方的颜色和样式
            </div>
            <div
              className="mt-3 px-3 py-1 rounded-md text-sm font-medium inline-block"
              style={{
                backgroundColor: colors.primary,
                color: 'white'
              }}
            >
              操作按钮
            </div>
          </div>
        </ComponentPreviewCard>

        {/* 按钮预览 */}
        <ComponentPreviewCard
          title="按钮组件"
          colors={colors}
          recipe={recipe}
        >
          <div className="space-y-3">
            <button
              className="w-full px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: colors.primary,
                color: 'white',
                border: 'none'
              }}
            >
              主要按钮
            </button>
            <button
              className="w-full px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: 'transparent',
                color: colors.primary,
                border: `2px solid ${colors.primary}`
              }}
            >
              次要按钮
            </button>
          </div>
        </ComponentPreviewCard>

        {/* 标签预览 */}
        <ComponentPreviewCard
          title="标签组件"
          colors={colors}
          recipe={recipe}
        >
          <div className="space-y-2">
            <div
              className="px-3 py-1 rounded-full text-xs font-medium inline-block"
              style={{
                backgroundColor: colors.primary,
                color: 'white'
              }}
            >
              主标签
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-medium inline-block"
              style={{
                backgroundColor: colors.secondary,
                color: 'white'
              }}
            >
              辅助标签
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-medium inline-block"
              style={{
                backgroundColor: `${colors.primary}20`,
                color: colors.primary,
                border: `1px solid ${colors.primary}40`
              }}
            >
              轮廓标签
            </div>
          </div>
        </ComponentPreviewCard>
      </div>
    </div>)
}

/**
 * 组件预览卡片
 */
interface ComponentPreviewCardProps {
  title: string
  colors: { gradient: string; primary: string; secondary: string }
  recipe: StyleRecipe
  children: React.ReactNode
}

function ComponentPreviewCard({ title, colors, recipe, children }: ComponentPreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} // 减少位移
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.15, // 更快的动画
        delay: 0.05 // 轻微延迟，创建渐进效果
      }}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-md" // 减少阴影强度
    >
      <h4 className="text-sm font-medium text-gray-700 mb-4">{title}</h4>
      <div className="space-y-3">
        {children}
      </div>
    </motion.div>
  )
}
