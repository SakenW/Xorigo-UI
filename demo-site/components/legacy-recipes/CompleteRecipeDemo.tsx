/**
 * 🎨 TH-UI 完整配色方案演示组件
 *
 * 展示所有10个官方配色方案的完整功能
 * 包含企业、极简、科技、创意、经典等分类
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
// 完整配方卡片组件 (Complete Recipe Card Component)
// ============================================================================

interface CompleteRecipeCardProps {
  recipe: StyleRecipe
  isSelected: boolean
  onSelect: () => void
  responseLevel: ResponseLevel
}

function CompleteRecipeCard({ recipe, isSelected, onSelect, responseLevel }: CompleteRecipeCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
      onClick={onSelect}
    >
      {/* 响应级别徽章 */}
      <div className="absolute top-2 right-2">
        <span className={`
          px-2 py-1 text-xs rounded-full font-medium
          ${responseLevel === 'L3' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
            responseLevel === 'L2' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
            responseLevel === 'L1' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
          }
        `}>
          {responseLevel}
        </span>
      </div>

      {/* 配方信息 */}
      <h3 className="text-lg font-semibold mb-2 pr-16">{recipe.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{recipe.description}</p>

      {/* 配方 ID */}
      <div className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mb-3 truncate" title={recipe.id}>
        {recipe.id}
      </div>

      {/* 分类标签 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
          {recipe.category}
        </span>
        <span className={`
          px-2 py-1 text-xs rounded
          ${recipe.accessibility.contrastLevel === 'AAA' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
            recipe.accessibility.contrastLevel === 'AA' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
          }
        `}>
          {recipe.accessibility.contrastLevel}
        </span>
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-1 mb-3">
        {recipe.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded"
          >
            {tag}
          </span>
        ))}
        {recipe.tags.length > 3 && (
          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
            +{recipe.tags.length - 3}
          </span>
        )}
      </div>

      {/* 可访问性指示器 */}
      <div className="flex gap-2">
        {recipe.accessibility.cvdFriendly && (
          <span className="text-xs" title="色盲友好">
            👁️‍🗨️
          </span>
        )}
        {recipe.accessibility.motionSafe && (
          <span className="text-xs" title="动效安全">
            🎭
          </span>
        )}
        {recipe.accessibility.contrastLevel === 'AAA' && (
          <span className="text-xs" title="高对比度">
            ✨
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// 配方分类筛选器 (Recipe Category Filter)
// ============================================================================

function RecipeCategoryFilter() {
  const { setRecipeByCategory, currentRecipe } = useDTCGStyleRecipe()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', 'corporate', 'minimal', 'tech', 'creative', 'classic']
  const categoryNames = {
    all: '全部',
    corporate: '企业',
    minimal: '极简',
    tech: '科技',
    creative: '创意',
    classic: '经典'
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    if (category === 'all') {
      // 不做任何操作，显示所有配方
    } else {
      setRecipeByCategory(category)
    }
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">配方分类</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategoryClick(category)}
            className={`
              px-4 py-2 rounded-lg border-2 transition-all duration-200
              ${selectedCategory === category
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }
            `}
          >
            {categoryNames[category as keyof typeof categoryNames]}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 配方搜索 (Recipe Search)
// ============================================================================

function RecipeSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<StyleRecipe[]>([])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = searchOfficialRecipes(query)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">配方搜索</h3>

      {/* 搜索框 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜索配色方案..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* 搜索结果 */}
      {searchResults.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">搜索结果 ({searchResults.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {searchResults.map((recipe) => (
              <motion.button
                key={recipe.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // 这里应该触发配方切换，简化演示
                  console.log('Selected recipe:', recipe.id)
                }}
                className="p-3 text-left border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div className="font-medium text-sm">{recipe.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{recipe.category}</div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 主演示组件 (Main Demo Component)
// ============================================================================

export function CompleteRecipeDemo() {
  const {
    currentRecipe,
    setRecipe,
    validateCurrentRecipe,
    isTransitioning
  } = useDTCGStyleRecipe()

  const { responseLevel, setResponseLevel } = useDTCGStyleRecipe()
  const [showAdvanced, setShowAdvanced] = useState(false)

  // 验证当前配方
  const validation = validateCurrentRecipe()

  // 将官方配方转换为 DTCG 配方格式
  const availableDTCGRecipes: DTCGStyleRecipe[] = officialRecipes.map(recipe => ({
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    category: recipe.category,
    tags: recipe.tags,
    accessibility: recipe.accessibility
  }))

  // 当前选中的配方信息
  const currentOfficialRecipe = officialRecipes.find(r => r.id === currentRecipe?.id)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 标题区域 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🎨 TH-UI 完整配色方案
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              10个官方配色方案，涵盖企业、极简、科技、创意等多种风格
            </p>

            {/* 当前配方信息 */}
            {currentOfficialRecipe && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      当前配色: {currentOfficialRecipe.name}
                    </h2>
                    <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mb-2">
                      {currentOfficialRecipe.id}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
                        {currentOfficialRecipe.category}
                      </span>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">
                        {currentOfficialRecipe.accessibility.contrastLevel}
                      </span>
                    </div>
                  </div>
                  {isTransitioning && (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  )}
                </div>

                {/* 可访问性评分 */}
                <div className="mt-4 flex gap-4">
                  <div className="text-sm">
                    <span className="font-medium">对比度:</span> {validation.accessibilityReport.contrastScore}/100
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">CVD友好:</span> {validation.accessibilityReport.cvdScore}/100
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">动效安全:</span> {validation.accessibilityReport.motionScore}/100
                  </div>
                </div>

                {/* 警告信息 */}
                {validation.warnings.length > 0 && (
                  <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm text-yellow-800 dark:text-yellow-300">
                    ⚠️ {validation.warnings.join(', ')}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 控制面板 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* 左侧控制面板 */}
          <div className="lg:col-span-1 space-y-6">

            {/* 配方分类筛选 */}
            <RecipeCategoryFilter />

            {/* 搜索功能 */}
            <RecipeSearch />

            {/* 高级选项切换 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {showAdvanced ? '隐藏' : '显示'}高级选项
            </motion.button>
          </div>

          {/* 右侧配方展示 */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">所有配色方案 ({officialRecipes.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDTCGRecipes.map((recipe) => (
                <CompleteRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isSelected={currentRecipe?.id === recipe.id}
                  onSelect={() => setRecipe(recipe.id as any)}
                  responseLevel={responseLevel}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}