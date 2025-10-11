/**
 * 🎨 TH-UI 重新设计的配色方案演示组件
 *
 * 完全重构的现代化配方展示界面
 * 包含沉浸式体验、高级搜索筛选和响应式设计
 */

import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import {
  useDTCGStyleRecipe,
  type DTCGStyleRecipe,
  type AxisLockRule,
  type ResponseLevel,
} from '../../src/style-recipe/provider/DTCGStyleRecipeProvider'
import {
  officialRecipes,
  searchRecipes as searchOfficialRecipes,
  getRecipesByCategory,
  type StyleRecipe,
} from '../../src/style-recipe/recipes/official-recipes'

// ============================================================================
// 类型定义 (Type Definitions)
// ============================================================================

interface FilterOptions {
  category: string
  contrastLevel: string
  accessibility: string[]
  searchQuery: string
}

interface SortOption {
  key: string
  label: string
  fn: (a: StyleRecipe, b: StyleRecipe) => number
}

// ============================================================================
// 配方预览卡片组件 (Recipe Preview Card)
// ============================================================================

interface RecipePreviewCardProps {
  recipe: StyleRecipe
  isSelected: boolean
  isTransitioning: boolean
  onSelect: () => void
  showDetails: boolean
  index: number
}

function RecipePreviewCard({
  recipe,
  isSelected,
  isTransitioning,
  onSelect,
  showDetails,
  index
}: RecipePreviewCardProps) {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    selected: {
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate={isSelected ? "selected" : "visible"}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`
        relative cursor-pointer rounded-2xl border-2 transition-all duration-300
        ${isSelected
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
    >
      {/* 加载状态指示器 */}
      {isTransitioning && isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      )}

      {/* 选中标记 */}
      {isSelected && (
        <motion.div
          className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}

      <div className="p-6">
        {/* 配方头部信息 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {recipe.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {recipe.description}
            </p>
          </div>
        </div>

        {/* 配方ID */}
        <div className="mb-4">
          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg font-mono text-gray-700 dark:text-gray-300 block truncate">
            {recipe.id}
          </code>
        </div>

        {/* 标签区域 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
            {recipe.category}
          </span>
          <span className={`
            px-3 py-1 text-xs font-medium rounded-full
            ${recipe.accessibility.contrastLevel === 'AAA'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
            }
          `}>
            {recipe.accessibility.contrastLevel}
          </span>
        </div>

        {/* 可访问性指标 */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          {recipe.accessibility.cvdFriendly && (
            <span className="flex items-center gap-1" title="色盲友好">
              <span>👁️</span>
              <span>CVD</span>
            </span>
          )}
          {recipe.accessibility.motionSafe && (
            <span className="flex items-center gap-1" title="动效安全">
              <span>🎭</span>
              <span>Motion</span>
            </span>
          )}
          <span className="flex items-center gap-1" title="对比度评分">
            <span>📊</span>
            <span>{recipe.accessibility.contrastLevel}</span>
          </span>
        </div>

        {/* 展开详情 */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-wrap gap-1">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// 高级筛选组件 (Advanced Filter)
// ============================================================================

interface AdvancedFilterProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  recipes: StyleRecipe[]
}

function AdvancedFilter({ filters, onFiltersChange, recipes }: AdvancedFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // 获取可用的筛选选项
  const availableOptions = useMemo(() => {
    const categories = [...new Set(recipes.map(r => r.category))]
    const contrastLevels = [...new Set(recipes.map(r => r.accessibility.contrastLevel))]
    const tags = [...new Set(recipes.flatMap(r => r.tags))]

    return { categories, contrastLevels, tags }
  }, [recipes])

  const handleFilterChange = useCallback((key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }, [filters, onFiltersChange])

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      initial={false}
    >
      {/* 筛选头部 */}
      <motion.div
        className="p-6 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            高级筛选
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            根据属性快速查找配色方案
          </p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>

      {/* 筛选内容 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 space-y-6">
              {/* 分类筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  配方分类
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFilterChange('category', 'all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filters.category === 'all'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    全部
                  </button>
                  {availableOptions.categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleFilterChange('category', category)}
                      className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                        filters.category === category
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* 对比度级别筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  对比度级别
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFilterChange('contrastLevel', 'all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filters.contrastLevel === 'all'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    全部
                  </button>
                  {availableOptions.contrastLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => handleFilterChange('contrastLevel', level)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        filters.contrastLevel === level
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* 可访问性筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  可访问性特性
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'cvdFriendly', label: '色盲友好', icon: '👁️' },
                    { key: 'motionSafe', label: '动效安全', icon: '🎭' }
                  ].map((feature) => (
                    <label key={feature.key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.accessibility.includes(feature.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFilterChange('accessibility', [...filters.accessibility, feature.key])
                          } else {
                            handleFilterChange('accessibility', filters.accessibility.filter(k => k !== feature.key))
                          }
                        }}
                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span>{feature.icon}</span>
                        <span>{feature.label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================================================
// 配方展示网格组件 (Recipe Grid)
// ============================================================================

interface RecipeGridProps {
  recipes: StyleRecipe[]
  currentRecipe: DTCGStyleRecipe | null
  isTransitioning: boolean
  onRecipeSelect: (recipeId: string) => void
}

function RecipeGrid({ recipes, currentRecipe, isTransitioning, onRecipeSelect }: RecipeGridProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="space-y-6">
      {/* 网格头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            配色方案库
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            共 {recipes.length} 个配色方案
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          {showDetails ? '隐藏详情' : '显示详情'}
        </motion.button>
      </div>

      {/* 配方网格 */}
      <LayoutGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <RecipePreviewCard
              key={recipe.id}
              recipe={recipe}
              isSelected={currentRecipe?.id === recipe.id}
              isTransitioning={isTransitioning}
              onSelect={() => onRecipeSelect(recipe.id)}
              showDetails={showDetails}
              index={index}
            />
          ))}
        </div>
      </LayoutGroup>
    </div>
  )
}

// ============================================================================
// 主演示组件 (Main Demo Component)
// ============================================================================

export function EnhancedRecipeDemo() {
  const {
    currentRecipe,
    setRecipe,
    validateCurrentRecipe,
    isTransitioning
  } = useDTCGStyleRecipe()

  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    contrastLevel: 'all',
    accessibility: [],
    searchQuery: ''
  })

  // 过滤和排序配方
  const filteredRecipes = useMemo(() => {
    let filtered = officialRecipes.filter(recipe => {
      // 分类筛选
      if (filters.category !== 'all' && recipe.category !== filters.category) {
        return false
      }

      // 对比度级别筛选
      if (filters.contrastLevel !== 'all' && recipe.accessibility.contrastLevel !== filters.contrastLevel) {
        return false
      }

      // 可访问性筛选
      if (filters.accessibility.length > 0) {
        const hasAllFeatures = filters.accessibility.every(feature =>
          recipe.accessibility[feature as keyof typeof recipe.accessibility]
        )
        if (!hasAllFeatures) return false
      }

      // 搜索筛选
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase()
        return (
          recipe.name.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query) ||
          recipe.category.toLowerCase().includes(query) ||
          recipe.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }

      return true
    })

    return filtered
  }, [filters])

  // 验证当前配方
  const validation = validateCurrentRecipe()

  // 当前选中的配方信息
  const currentOfficialRecipe = officialRecipes.find(r => r.id === currentRecipe?.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* 头部英雄区域 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              🎨 TH-UI 配色方案
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              基于DTCG标准的10个精心设计配色方案，涵盖企业、极简、科技、创意等多种风格
            </p>

            {/* 当前配方状态 */}
            {currentOfficialRecipe && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-blue-200 dark:border-blue-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      当前配色: {currentOfficialRecipe.name}
                    </h2>
                    <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mb-3">
                      {currentOfficialRecipe.id}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                        {currentOfficialRecipe.category}
                      </span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                        {currentOfficialRecipe.accessibility.contrastLevel}
                      </span>
                    </div>
                  </div>

                  {isTransitioning && (
                    <motion.div
                      className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </div>

                {/* 质量评分 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                    <div className="font-medium text-gray-900 dark:text-white">对比度评分</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {validation.accessibilityReport.contrastScore}/100
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                    <div className="font-medium text-gray-900 dark:text-white">CVD友好度</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {validation.accessibilityReport.cvdScore}/100
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                    <div className="font-medium text-gray-900 dark:text-white">动效安全性</div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {validation.accessibilityReport.motionScore}/100
                    </div>
                  </div>
                </div>

                {/* 警告信息 */}
                {validation.warnings.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-sm text-yellow-800 dark:text-yellow-300"
                  >
                    ⚠️ {validation.warnings.join(', ')}
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* 搜索和筛选区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 搜索框 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                搜索配色方案
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="输入关键词搜索..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="w-full px-4 py-3 pl-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* 高级筛选 */}
            <AdvancedFilter
              filters={filters}
              onFiltersChange={setFilters}
              recipes={officialRecipes}
            />
          </div>

          {/* 右侧主内容 */}
          <div className="lg:col-span-3">
            <RecipeGrid
              recipes={filteredRecipes}
              currentRecipe={currentRecipe}
              isTransitioning={isTransitioning}
              onRecipeSelect={setRecipe}
            />
          </div>
        </div>
      </div>
    </div>
  )
}