/**
 * 🎨 TH-UI DTCG 风格配方体系演示组件
 *
 * 展示基于 DTCG 标准的七轴风格配方系统
 * 演示 packages/thui-tokens/ 结构化令牌的使用
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  useDTCGStyleRecipe,
  type DTCGStyleRecipe,
  type AxisLockRule,
  type ResponseLevel,
} from '../../src/style-recipe/provider/DTCGStyleRecipeProvider'

// ============================================================================
// 配方卡片组件 (Recipe Card Component)
// ============================================================================

interface DTCGRecipeCardProps {
  recipe: DTCGStyleRecipe
  isSelected: boolean
  onSelect: () => void
  responseLevel: ResponseLevel
}

function DTCGRecipeCard({ recipe, isSelected, onSelect, responseLevel }: DTCGRecipeCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
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
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{recipe.description}</p>

      {/* 配方 ID */}
      <div className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mb-3">
        {recipe.id}
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-1">
        {recipe.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 可访问性指示器 */}
      <div className="flex gap-2 mt-3">
        {recipe.accessibility.cvdFriendly && (
          <span className="text-xs" title="CVD Friendly">
            👁️‍🗨️
          </span>
        )}
        {recipe.accessibility.motionSafe && (
          <span className="text-xs" title="Motion Safe">
            🎭
          </span>
        )}
        {recipe.accessibility.contrastLevel === 'AAA' && (
          <span className="text-xs" title="High Contrast">
            ✨
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// 响应级别选择器 (Response Level Selector)
// ============================================================================

function DTCGResponseLevelSelector() {
  const { responseLevel, setResponseLevel } = useDTCGStyleRecipe()
  const levels: ResponseLevel[] = ['L0', 'L1', 'L2', 'L3']

  const levelDescriptions = {
    L0: 'Inert - 不响应配方变化',
    L1: 'Color-only - 仅响应颜色变化',
    L2: 'Color + Density/Surface - 颜色+密度+表面',
    L3: 'Full Reactive - 全轴响应',
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">响应级别控制</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {levels.map((level) => (
          <motion.button
            key={level}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setResponseLevel(level)}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200 text-left
              ${responseLevel === level
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }
            `}
          >
            <div className="font-medium">{level}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {levelDescriptions[level]}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 轴锁演示 (Axis Lock Demo)
// ============================================================================

function DTCGAxisLockDemo() {
  const { applyAxisLock, clearAxisLocks, axisLocks } = useDTCGStyleRecipe()

  const demoLocks: AxisLockRule[] = [
    {
      id: 'lock-accent',
      name: '锁定主色',
      locks: [
        { axes: ['accent'], scope: 'global', reason: '保持品牌一致性' }
      ],
    },
    {
      id: 'lock-motion',
      name: '锁定动效',
      locks: [
        { axes: ['motion'], scope: 'global', reason: '减少动效干扰' }
      ],
    },
    {
      id: 'lock-density',
      name: '锁定密度',
      locks: [
        { axes: ['density'], scope: 'local', reason: '保持布局稳定' }
      ],
    },
  ]

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">轴锁控制</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {demoLocks.map((lock) => (
          <motion.button
            key={lock.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => applyAxisLock(lock)}
            className={`
              px-3 py-2 rounded-lg border-2 transition-all duration-200
              ${axisLocks.some(l => l.id === lock.id)
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }
            `}
          >
            {lock.name}
          </motion.button>
        ))}
      </div>
      {axisLocks.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            已锁定: {axisLocks.map(l => l.name).join(', ')}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAxisLocks}
            className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded"
          >
            清除所有
          </motion.button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 配方搜索与分类 (Recipe Search & Category)
// ============================================================================

function DTCGRecipeSearchAndCategory() {
  const {
    setRecipeByCategory,
    searchRecipes,
    categories,
    setRandomRecipe,
    currentRecipe
  } = useDTCGStyleRecipe()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = searchRecipes(query)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">配方搜索与分类</h3>

      {/* 搜索框 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜索 DTCG 配方..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* DTCG 配方搜索结果 */}
      {searchResults.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">DTCG 配方搜索结果 ({searchResults.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {searchResults.map((recipeId) => (
              <motion.button
                key={recipeId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // 这里应该调用 setRecipe，但为了演示简化
                  console.log('Selected DTCG recipe:', recipeId)
                }}
                className="p-2 text-left border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div className="font-medium text-sm">{recipeId}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">DTCG 配方</div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* 分类按钮 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRecipeByCategory(category)}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* 随机配方 */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={setRandomRecipe}
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
      >
        🎲 随机 DTCG 配方
      </motion.button>
    </div>
  )
}

// ============================================================================
// DTCG 架构信息展示 (DTCG Architecture Info)
// ============================================================================

function DTCGArchitectureInfo() {
  return (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700">
      <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
        🏗️ DTCG 架构信息
      </h3>
      <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
        <p>
          <strong>数据源:</strong> packages/thui-tokens/ 目录
        </p>
        <p>
          <strong>标准:</strong> Design Tokens Community Group (DTCG)
        </p>
        <p>
          <strong>结构:</strong> Core → Role → Component 三层令牌架构
        </p>
        <p>
          <strong>特点:</strong> OKLCH 色彩空间、WCAG 2.2 可访问性、七轴风格配方
        </p>
        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-800/30 rounded">
          <code className="text-xs">
            packages/thui-tokens/<br/>
            ├── core/palettes/<br/>
            ├── recipes/corporate-blue/<br/>
            ├── density-presets/<br/>
            └── aliases/components/
          </code>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 主演示组件 (Main Demo Component)
// ============================================================================

export function DTCGStyleRecipeDemo() {
  const {
    currentRecipe,
    availableRecipes,
    setRecipe,
    validateCurrentRecipe,
    isTransitioning
  } = useDTCGStyleRecipe()

  const { responseLevel } = useDTCGStyleRecipe()
  const [showAdvanced, setShowAdvanced] = useState(false)

  // 验证当前配方
  const validation = validateCurrentRecipe()

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
              🎨 TH-UI DTCG 风格配方体系演示
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              基于 DTCG 标准的七轴风格配方系统
            </p>

            {/* 当前配方信息 */}
            {currentRecipe && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      当前 DTCG 配方: {currentRecipe.name}
                    </h2>
                    <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                      {currentRecipe.id}
                    </p>
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

            {/* DTCG 架构信息 */}
            <DTCGArchitectureInfo />

            {/* 响应级别控制 */}
            <DTCGResponseLevelSelector />

            {/* 轴锁演示 */}
            <DTCGAxisLockDemo />

            {/* 搜索与分类 */}
            <DTCGRecipeSearchAndCategory />

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
            <h3 className="text-lg font-semibold mb-4">DTCG 配方库</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableRecipes.map((recipe) => (
                <DTCGRecipeCard
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