/**
 * 🎨 TH-UI 交互式配色方案演示组件
 *
 * 支持真正的配色切换和实时预览功能
 * 用户可以点击配方并立即看到配色变化效果
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react'
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
// 实时预览组件 (Live Preview Components)
// ============================================================================

interface ColorPalettePreviewProps {
  recipe: StyleRecipe
  isActive: boolean
}

function ColorPalettePreview({ recipe, isActive }: ColorPalettePreviewProps) {
  // 基于配方生成模拟的颜色调色板
  const generateColorPalette = useCallback((recipeId: string) => {
    // 这里根据配方ID生成对应的颜色
    // 实际应用中会从真实的DTCG令牌中获取颜色
    const colorMap: Record<string, { primary: string; secondary: string; accent: string; background: string }> = {
      'light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow': {
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#60a5fa',
        background: '#f8fafc'
      },
      'dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow': {
        primary: '#1e40af',
        secondary: '#1e3a8a',
        accent: '#3b82f6',
        background: '#0f172a'
      },
      'light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat': {
        primary: '#6b7280',
        secondary: '#9ca3af',
        accent: '#d1d5db',
        background: '#ffffff'
      },
      'dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat': {
        primary: '#374151',
        secondary: '#4b5563',
        accent: '#9ca3af',
        background: '#111827'
      },
      'light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow': {
        primary: '#06b6d4',
        secondary: '#0891b2',
        accent: '#67e8f9',
        background: '#f0fdfa'
      },
      'dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon': {
        primary: '#0891b2',
        secondary: '#d946ef',
        accent: '#67e8f9',
        background: '#18181b'
      },
      'light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring': {
        primary: '#a855f7',
        secondary: '#c084fc',
        accent: '#e9d5ff',
        background: '#faf5ff'
      },
      'dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass': {
        primary: '#9333ea',
        secondary: '#c084fc',
        accent: '#e9d5ff',
        background: '#1a1a1a'
      },
      'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow': {
        primary: '#64748b',
        secondary: '#94a3b8',
        accent: '#cbd5e1',
        background: '#f8fafc'
      },
      'hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat': {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#60a5fa',
        background: '#ffffff'
      }
    }

    return colorMap[recipeId] || colorMap['light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow']
  }, [])

  const colors = useMemo(() => generateColorPalette(recipe.id), [recipe.id, generateColorPalette])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
    >
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">颜色预览</h4>

      {/* 颜色展示 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="space-y-2">
          <div
            className="h-12 rounded-lg border border-gray-200 dark:border-gray-600"
            style={{ backgroundColor: colors.primary }}
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">主色</p>
        </div>
        <div className="space-y-2">
          <div
            className="h-12 rounded-lg border border-gray-200 dark:border-gray-600"
            style={{ backgroundColor: colors.secondary }}
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">次色</p>
        </div>
        <div className="space-y-2">
          <div
            className="h-12 rounded-lg border border-gray-200 dark:border-gray-600"
            style={{ backgroundColor: colors.accent }}
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">强调色</p>
        </div>
        <div className="space-y-2">
          <div
            className="h-12 rounded-lg border border-gray-200 dark:border-gray-600"
            style={{ backgroundColor: colors.background }}
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">背景色</p>
        </div>
      </div>

      {/* 示例UI组件预览 */}
      <div className="space-y-3">
        <button
          className="w-full px-4 py-2 rounded-lg text-white font-medium transition-colors"
          style={{ backgroundColor: colors.primary }}
        >
          主要按钮
        </button>
        <div className="flex gap-2">
          <button
            className="flex-1 px-3 py-2 rounded-lg border-2 font-medium transition-colors"
            style={{
              borderColor: colors.secondary,
              color: colors.secondary
            }}
          >
            次要按钮
          </button>
          <button
            className="flex-1 px-3 py-2 rounded-lg font-medium text-white transition-colors"
            style={{ backgroundColor: colors.accent }}
          >
            强调按钮
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 配方卡片组件 (Enhanced Recipe Card)
// ============================================================================

interface InteractiveRecipeCardProps {
  recipe: StyleRecipe
  isSelected: boolean
  isTransitioning: boolean
  onSelect: () => void
  index: number
}

function InteractiveRecipeCard({
  recipe,
  isSelected,
  isTransitioning,
  onSelect,
  index
}: InteractiveRecipeCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`
        relative cursor-pointer rounded-2xl border-2 transition-all duration-300
        ${isSelected
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 shadow-2xl'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg'
        }
      `}
    >
      {/* 选中动画指示器 */}
      {isTransitioning && isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}

      {/* 选中标记 */}
      {isSelected && (
        <motion.div
          className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}

      <div className="p-6">
        {/* 配方头部 */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {recipe.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {recipe.description}
          </p>
        </div>

        {/* 配方ID */}
        <div className="mb-4">
          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg font-mono text-gray-700 dark:text-gray-300 block truncate">
            {recipe.id}
          </code>
        </div>

        {/* 标签 */}
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
        </div>

        {/* 点击提示 */}
        <motion.div
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            {isSelected ? '✅ 当前配色' : '👆 点击切换配色'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 实时预览面板组件 (Live Preview Panel)
// ============================================================================

interface LivePreviewPanelProps {
  currentRecipe: StyleRecipe | null
  isTransitioning: boolean
}

function LivePreviewPanel({ currentRecipe, isTransitioning }: LivePreviewPanelProps) {
  if (!currentRecipe) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* 头部 */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          实时预览
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          当前配色：{currentRecipe.name}
        </p>
      </div>

      {/* 预览内容 */}
      <div className="p-6 space-y-6">
        {/* 颜色调色板预览 */}
        <ColorPalettePreview recipe={currentRecipe} isActive={true} />

        {/* 组件示例预览 */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">组件示例</h4>

          <div className="space-y-4">
            {/* 卡片示例 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">示例卡片</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                这是一个使用当前配色的示例卡片组件。
              </p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                示例按钮
              </button>
            </div>

            {/* 表单示例 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">表单元素</h5>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="输入框示例"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>下拉选择框</option>
                  <option>选项1</option>
                  <option>选项2</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 主演示组件 (Main Demo Component)
// ============================================================================

export function InteractiveRecipeDemo() {
  const {
    currentRecipe,
    setRecipe,
    validateCurrentRecipe,
    isTransitioning
  } = useDTCGStyleRecipe()

  const [searchQuery, setSearchQuery] = useState('')

  // 过滤配方
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return officialRecipes

    const query = searchQuery.toLowerCase()
    return officialRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      recipe.category.toLowerCase().includes(query) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }, [searchQuery])

  // 获取当前选中的官方配方
  const currentOfficialRecipe = officialRecipes.find(r => r.id === currentRecipe?.id)

  // 验证当前配方
  const validation = validateCurrentRecipe()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* 头部区域 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🎨 TH-UI 交互式配色方案
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              点击任意配色方案，实时预览效果
            </p>

            {/* 搜索框 */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索配色方案..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <svg className="absolute left-3 top-4.5 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* 当前配方状态 */}
            {currentOfficialRecipe && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-blue-200 dark:border-blue-700"
              >
                <div className="flex items-center justify-center gap-8">
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      当前应用配色
                    </h2>
                    <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mb-3">
                      {currentOfficialRecipe.id}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                        {currentOfficialRecipe.category}
                      </span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                        {currentOfficialRecipe.accessibility.contrastLevel}
                      </span>
                      {isTransitioning && (
                        <span className="text-sm text-blue-600 dark:text-blue-400">
                          切换中...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧配方列表 */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                配色方案库 ({filteredRecipes.length})
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                点击任意配色方案进行切换和预览
              </p>
            </div>

            <LayoutGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRecipes.map((recipe, index) => (
                  <InteractiveRecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isSelected={currentRecipe?.id === recipe.id}
                    isTransitioning={isTransitioning}
                    onSelect={() => setRecipe(recipe.id as any)}
                    index={index}
                  />
                ))}
              </div>
            </LayoutGroup>

            {filteredRecipes.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  没有找到匹配的配色方案
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  尝试调整搜索关键词
                </p>
              </motion.div>
            )}
          </div>

          {/* 右侧实时预览 */}
          <div className="lg:col-span-1">
            <LivePreviewPanel
              currentRecipe={currentOfficialRecipe || null}
              isTransitioning={isTransitioning}
            />
          </div>
        </div>
      </div>
    </div>
  )
}