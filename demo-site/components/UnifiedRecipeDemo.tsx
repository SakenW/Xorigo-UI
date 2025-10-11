/**
 * 🎨 TH-UI 统一配方系统演示组件
 *
 * 核心设计理念：
 * 1. 双轨制配方体系 - 创意配色 + 七轴DTCG配方
 * 2. 智能切换 - 用户可在两种体系间无缝切换
 * 3. 统一交互 - 一致的点击切换和视觉预览体验
 * 4. 扩展性 - 易于添加新的配方类型
 *
 * 包含功能：
 * - 10种创意配色方案 (赛博蓝紫、温暖晨曦等)
 * - 10个七轴DTCG官方配方
 * - 实时配色切换和预览
 * - 配方搜索和筛选
 * - 详细配方信息展示
 * - 导出和分享功能
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDTCGStyleRecipe, type StyleRecipe } from '../../src/style-recipe/provider/DTCGStyleRecipeProvider'
import { officialRecipes } from '../../src/style-recipe/recipes/official-recipes'
import { colorPalettes, type ColorPalette } from '../../src/theme/palettes'

// ============================================================================
// 类型定义 (Type Definitions)
// ============================================================================

export type RecipeType = 'creative' | 'seven-axis'

export interface UnifiedRecipe {
  id: string
  type: RecipeType
  name: string
  description: string
  tags: string[]
  mood: string
  category: string

  // 创意配色的数据
  creativeData?: ColorPalette

  // 七轴配方的数据
  sevenAxisData?: StyleRecipe

  // 统一的显示信息
  preview: {
    primary: string
    secondary: string
    accent: string
    gradient: string
  }

  // 七轴配方特有信息
  axes?: {
    mode: string
    base: string
    accent: string
    tone: string
    density: string
    motion: string
    surface: string
  }
}

// ============================================================================
// 配方转换器 (Recipe Converter)
// ============================================================================

class RecipeConverter {
  /**
   * 将创意配色转换为统一格式
   */
  static convertCreativePalette(palette: ColorPalette): UnifiedRecipe {
    return {
      id: `creative-${palette.id}`,
      type: 'creative',
      name: palette.name,
      description: palette.description,
      tags: palette.tags,
      mood: palette.mood,
      category: '创意配色',
      creativeData: palette,
      preview: {
        primary: palette.primary[500],
        secondary: palette.secondary[500],
        accent: palette.accent[500],
        gradient: palette.gradient.primary
      }
    }
  }

  /**
   * 将七轴配方转换为统一格式
   */
  static convertSevenAxisRecipe(recipe: StyleRecipe): UnifiedRecipe {
    const colors = RecipeConverter.getRecipeColors(recipe.id)
    return {
      id: `seven-axis-${recipe.id}`,
      type: 'seven-axis',
      name: recipe.name,
      description: recipe.description,
      tags: ['七轴体系', 'DTCG', ...recipe.tags],
      mood: 'professional',
      category: '七轴DTCG',
      sevenAxisData: recipe,
      preview: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`
      },
      axes: {
        mode: recipe.id.split('.')[0],
        base: recipe.id.split('.')[1],
        accent: recipe.id.split('.')[2],
        tone: recipe.id.split('.')[3],
        density: recipe.id.split('.')[4],
        motion: recipe.id.split('.')[5],
        surface: recipe.id.split('.')[6]
      }
    }
  }

  /**
   * 获取七轴配方的颜色映射
   */
  static getRecipeColors(recipeId: string): any {
    const colorMap: Record<string, any> = {
      'light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow': {
        primary: '#3b82f6', secondary: '#1d4ed8', accent: '#60a5fa',
        background: '#ffffff', surface: '#f8fafc', text: '#1e293b'
      },
      'dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow': {
        primary: '#60a5fa', secondary: '#93c5fd', accent: '#2563eb',
        background: '#0f172a', surface: '#1e293b', text: '#f1f5f9'
      },
      'light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat': {
        primary: '#6b7280', secondary: '#4b5563', accent: '#9ca3af',
        background: '#ffffff', surface: '#f9fafb', text: '#111827'
      },
      'dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat': {
        primary: '#9ca3af', secondary: '#d1d5db', accent: '#6b7280',
        background: '#111827', surface: '#1f2937', text: '#f9fafb'
      },
      'light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow': {
        primary: '#06b6d4', secondary: '#0891b2', accent: '#22d3ee',
        background: '#ffffff', surface: '#f0fdfa', text: '#134e4a'
      },
      'dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon': {
        primary: '#22d3ee', secondary: '#ec4899', accent: '#a855f7',
        background: '#0c0a09', surface: '#1c1917', text: '#fafaf9'
      },
      'light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring': {
        primary: '#a855f7', secondary: '#9333ea', accent: '#c084fc',
        background: '#ffffff', surface: '#faf5ff', text: '#581c87'
      },
      'dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass': {
        primary: '#c084fc', secondary: '#e879f9', accent: '#a855f7',
        background: '#1c1917', surface: '#292524', text: '#fafaf9'
      },
      'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow': {
        primary: '#71717a', secondary: '#52525b', accent: '#a1a1aa',
        background: '#ffffff', surface: '#fafafa', text: '#18181b'
      },
      'hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat': {
        primary: '#2563eb', secondary: '#1d4ed8', accent: '#3b82f6',
        background: '#ffffff', surface: '#f8fafc', text: '#000000'
      }
    }

    return colorMap[recipeId] || colorMap['light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow']
  }
}

// ============================================================================
// 统一配方管理器 (Unified Recipe Manager)
// ============================================================================

export const useUnifiedRecipeSystem = () => {
  const { recipe: currentSevenAxisRecipe, setRecipe: setSevenAxisRecipe } = useDTCGStyleRecipe()
  const [currentRecipeType, setCurrentRecipeType] = useState<RecipeType>('creative')
  const [selectedCreativeRecipe, setSelectedCreativeRecipe] = useState<ColorPalette | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // 合并所有配方
  const allRecipes = useMemo(() => {
    const creativeRecipes = colorPalettes.map(RecipeConverter.convertCreativePalette)
    const sevenAxisRecipes = officialRecipes.map(RecipeConverter.convertSevenAxisRecipe)

    return [...creativeRecipes, ...sevenAxisRecipes]
  }, [])

  // 过滤配方
  const filteredRecipes = useMemo(() => {
    if (!searchTerm) return allRecipes

    const lowercaseSearch = searchTerm.toLowerCase()
    return allRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(lowercaseSearch) ||
      recipe.description.toLowerCase().includes(lowercaseSearch) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(lowercaseSearch))
    )
  }, [allRecipes, searchTerm])

  // 按类型过滤
  const creativeRecipes = useMemo(() =>
    filteredRecipes.filter(recipe => recipe.type === 'creative'),
    [filteredRecipes]
  )

  const sevenAxisRecipes = useMemo(() =>
    filteredRecipes.filter(recipe => recipe.type === 'seven-axis'),
    [filteredRecipes]
  )

  // 统一的配方选择逻辑
  const selectRecipe = useCallback((recipe: UnifiedRecipe) => {
    if (recipe.type === 'creative') {
      setCurrentRecipeType('creative')
      setSelectedCreativeRecipe(recipe.creativeData || null)
      // 应用创意配色的逻辑
      document.documentElement.style.setProperty('--theme-primary', recipe.preview.primary)
      document.documentElement.style.setProperty('--theme-secondary', recipe.preview.secondary)
      document.documentElement.style.setProperty('--theme-accent', recipe.preview.accent)
    } else if (recipe.type === 'seven-axis' && recipe.sevenAxisData) {
      setCurrentRecipeType('seven-axis')
      setSevenAxisRecipe(recipe.sevenAxisData.id)
    }
  }, [setSevenAxisRecipe])

  // 获取当前颜色
  const currentColors = useMemo(() => {
    if (currentRecipeType === 'creative' && selectedCreativeRecipe) {
      return {
        primary: selectedCreativeRecipe.primary[500],
        secondary: selectedCreativeRecipe.secondary[500],
        accent: selectedCreativeRecipe.accent[500],
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b'
      }
    } else {
      // 七轴配方的颜色
      return RecipeConverter.getRecipeColors(currentSevenAxisRecipe?.id || '')
    }
  }, [currentRecipeType, selectedCreativeRecipe, currentSevenAxisRecipe])

  // 当前选中的配方
  const currentRecipe = useMemo(() => {
    if (currentRecipeType === 'creative' && selectedCreativeRecipe) {
      return RecipeConverter.convertCreativePalette(selectedCreativeRecipe)
    } else {
      const sevenAxisRecipe = allRecipes.find(r => r.type === 'seven-axis' && r.sevenAxisData?.id === currentSevenAxisRecipe?.id)
      return sevenAxisRecipe || null
    }
  }, [currentRecipeType, selectedCreativeRecipe, currentSevenAxisRecipe, allRecipes])

  return {
    // 状态
    currentRecipeType,
    currentRecipe,
    currentColors,
    searchTerm,

    // 数据
    allRecipes,
    filteredRecipes,
    creativeRecipes,
    sevenAxisRecipes,

    // 操作
    selectRecipe,
    setSearchTerm,
    setCurrentRecipeType,
    setSelectedCreativeRecipe
  }
}

// ============================================================================
// 配方卡片组件 (Recipe Card Components)
// ============================================================================

interface UnifiedRecipeCardProps {
  recipe: UnifiedRecipe
  isSelected: boolean
  onSelect: () => void
  index: number
}

function UnifiedRecipeCard({ recipe, isSelected, onSelect, index }: UnifiedRecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`
        relative cursor-pointer rounded-2xl border-2 transition-all duration-300
        ${isSelected
          ? 'border-blue-500 shadow-2xl scale-105'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg'
        }
      `}
      style={{
        background: recipe.preview.gradient,
      }}
    >
      <div className="p-6">
        {/* 配方类型标签 */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`
            px-2 py-1 text-xs font-medium rounded-full
            ${recipe.type === 'creative'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'
            }
          `}>
            {recipe.type === 'creative' ? '🎨 创意' : '🔧 七轴'}
          </span>
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
            {recipe.category}
          </span>
        </div>

        {/* 配方名称和描述 */}
        <h3 className="text-lg font-semibold mb-2 text-white drop-shadow-lg">
          {recipe.name}
        </h3>
        <p className="text-sm text-white/90 mb-4 drop-shadow">
          {recipe.description}
        </p>

        {/* 配方预览 */}
        <div className="flex gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-full border-2 border-white/50"
            style={{ backgroundColor: recipe.preview.primary }}
          />
          <div
            className="w-8 h-8 rounded-full border-2 border-white/50"
            style={{ backgroundColor: recipe.preview.secondary }}
          />
          <div
            className="w-8 h-8 rounded-full border-2 border-white/50"
            style={{ backgroundColor: recipe.preview.accent }}
          />
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-white/20 text-white rounded-md backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 七轴配置显示 */}
        {recipe.axes && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="text-xs text-white/80 font-mono">
              {recipe.axes.mode}.{recipe.axes.base}.{recipe.axes.accent}
            </div>
          </div>
        )}

        {/* 选中状态指示器 */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center"
          >
            <span className="text-blue-500 text-lg">✓</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// ============================================================================
// 主组件 - 统一配方演示 (Unified Recipe Demo)
// ============================================================================

export default function UnifiedRecipeDemo() {
  const {
    currentRecipeType,
    currentRecipe,
    currentColors,
    searchTerm,
    allRecipes,
    filteredRecipes,
    creativeRecipes,
    sevenAxisRecipes,
    selectRecipe,
    setSearchTerm,
    setCurrentRecipeType
  } = useUnifiedRecipeSystem()

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: currentColors.background }}>
      {/* 头部区域 */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: currentColors.text }}>
            🎨 TH-UI 统一配方系统
          </h1>
          <p className="text-xl mb-8" style={{ color: currentColors.text, opacity: 0.8 }}>
            创意配色 × 七轴DTCG体系 - 完美融合的配色方案
          </p>

          {/* 配方类型切换器 */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setCurrentRecipeType('creative')}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${currentRecipeType === 'creative'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              🎨 创意配色 ({creativeRecipes.length})
            </button>
            <button
              onClick={() => setCurrentRecipeType('seven-axis')}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${currentRecipeType === 'seven-axis'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              🔧 七轴DTCG ({sevenAxisRecipes.length})
            </button>
            <button
              onClick={() => setCurrentRecipeType('all')}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${currentRecipeType === 'all' || (currentRecipeType !== 'creative' && currentRecipeType !== 'seven-axis')
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              🌟 全部配方 ({allRecipes.length})
            </button>
          </div>

          {/* 搜索框 */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索配方名称、描述或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border-2 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: currentColors.surface,
                  borderColor: currentColors.primary,
                  color: currentColors.text
                }}
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl">
                🔍
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 当前配方状态 */}
      {currentRecipe && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-7xl mx-auto mb-8"
        >
          <div className="p-6 rounded-2xl border-2 text-center"
            style={{
              backgroundColor: currentColors.surface,
              borderColor: currentColors.primary
            }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: currentColors.text }}>
              当前应用配方：{currentRecipe.name}
            </h2>
            <p className="text-sm font-mono mb-3" style={{ color: currentColors.text, opacity: 0.7 }}>
              {currentRecipe.type === 'seven-axis' ? currentRecipe.id : currentRecipe.id}
            </p>
            <div className="flex justify-center items-center gap-4">
              <span
                className="px-3 py-1 text-sm font-medium rounded-full"
                style={{
                  backgroundColor: currentColors.primary + '20',
                  color: currentColors.primary
                }}
              >
                {currentRecipe.category}
              </span>
              <span
                className="px-3 py-1 text-sm font-medium rounded-full"
                style={{
                  backgroundColor: currentColors.accent + '20',
                  color: currentColors.accent
                }}
              >
                {currentRecipe.type === 'creative' ? '创意配色' : '七轴体系'}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧配方列表 */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: currentColors.text }}>
                {currentRecipeType === 'creative' && '创意配色方案'}
                {currentRecipeType === 'seven-axis' && '七轴DTCG配方'}
                {(currentRecipeType === 'all' || (currentRecipeType !== 'creative' && currentRecipeType !== 'seven-axis')) && '全部配方'}
                ({filteredRecipes.length})
              </h2>
              <p style={{ color: currentColors.text, opacity: 0.8 }}>
                点击任意配方进行切换和预览
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredRecipes.map((recipe, index) => (
                  <UnifiedRecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isSelected={currentRecipe?.id === recipe.id}
                    onSelect={() => selectRecipe(recipe)}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>

            {filteredRecipes.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: currentColors.text }}>
                  没有找到匹配的配方
                </h3>
                <p style={{ color: currentColors.text, opacity: 0.8 }}>
                  尝试调整搜索关键词
                </p>
              </motion.div>
            )}
          </div>

          {/* 右侧详情预览 */}
          <div className="lg:col-span-1">
            {currentRecipe && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* 基本信息卡片 */}
                <div className="p-6 rounded-2xl border-2" style={{
                  backgroundColor: currentColors.surface,
                  borderColor: currentColors.primary
                }}>
                  <h3 className="text-xl font-bold mb-4" style={{ color: currentColors.text }}>
                    📋 配方详情
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <div className="text-xs uppercase tracking-wide mb-1" style={{ color: currentColors.text, opacity: 0.6 }}>
                        配方名称
                      </div>
                      <div className="font-semibold" style={{ color: currentColors.text }}>
                        {currentRecipe.name}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wide mb-1" style={{ color: currentColors.text, opacity: 0.6 }}>
                        配方描述
                      </div>
                      <div className="text-sm" style={{ color: currentColors.text, opacity: 0.8 }}>
                        {currentRecipe.description}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wide mb-1" style={{ color: currentColors.text, opacity: 0.6 }}>
                        配方类型
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 text-xs rounded-md ${
                          currentRecipe.type === 'creative' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {currentRecipe.type === 'creative' ? '🎨 创意配色' : '🔧 七轴DTCG'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                          {currentRecipe.category}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wide mb-1" style={{ color: currentColors.text, opacity: 0.6 }}>
                        标签
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {currentRecipe.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-md"
                            style={{
                              backgroundColor: currentColors.primary + '20',
                              color: currentColors.primary
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 七轴配置卡片 */}
                {currentRecipe.axes && (
                  <div className="p-6 rounded-2xl border-2" style={{
                    backgroundColor: currentColors.surface,
                    borderColor: currentColors.primary
                  }}>
                    <h3 className="text-xl font-bold mb-4" style={{ color: currentColors.text }}>
                      🎯 七轴配置
                    </h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 rounded-lg" style={{ backgroundColor: currentColors.background }}>
                          <div className="text-xs opacity-60 mb-1">模式轴</div>
                          <div className="font-mono font-semibold">{currentRecipe.axes.mode}</div>
                        </div>
                        <div className="p-3 rounded-lg" style={{ backgroundColor: currentColors.background }}>
                          <div className="text-xs opacity-60 mb-1">色调轴</div>
                          <div className="font-mono font-semibold">{currentRecipe.axes.tone}</div>
                        </div>
                        <div className="p-3 rounded-lg" style={{ backgroundColor: currentColors.background }}>
                          <div className="text-xs opacity-60 mb-1">密度轴</div>
                          <div className="font-mono font-semibold">{currentRecipe.axes.density}</div>
                        </div>
                        <div className="p-3 rounded-lg" style={{ backgroundColor: currentColors.background }}>
                          <div className="text-xs opacity-60 mb-1">表面轴</div>
                          <div className="font-mono font-semibold">{currentRecipe.axes.surface}</div>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: currentColors.background }}>
                        <div className="text-xs opacity-60 mb-1">基础轴</div>
                        <div className="font-mono text-sm font-semibold">{currentRecipe.axes.base}</div>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: currentColors.background }}>
                        <div className="text-xs opacity-60 mb-1">强调轴</div>
                        <div className="font-mono text-sm font-semibold">{currentRecipe.axes.accent}</div>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: currentColors.background }}>
                        <div className="text-xs opacity-60 mb-1">动效轴</div>
                        <div className="font-mono text-sm font-semibold">{currentRecipe.axes.motion}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 颜色系统卡片 */}
                <div className="p-6 rounded-2xl border-2" style={{
                  backgroundColor: currentColors.surface,
                  borderColor: currentColors.primary
                }}>
                  <h3 className="text-xl font-bold mb-4" style={{ color: currentColors.text }}>
                    🎨 颜色系统
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: currentColors.text }}>主色 (Primary)</span>
                        <span className="text-xs font-mono" style={{ color: currentColors.text, opacity: 0.6 }}>
                          {currentColors.primary}
                        </span>
                      </div>
                      <div className="h-12 rounded-lg border-2 border-white shadow-inner"
                        style={{ backgroundColor: currentColors.primary }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: currentColors.text }}>辅色 (Secondary)</span>
                        <span className="text-xs font-mono" style={{ color: currentColors.text, opacity: 0.6 }}>
                          {currentColors.secondary}
                        </span>
                      </div>
                      <div className="h-12 rounded-lg border-2 border-white shadow-inner"
                        style={{ backgroundColor: currentColors.secondary }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: currentColors.text }}>强调色 (Accent)</span>
                        <span className="text-xs font-mono" style={{ color: currentColors.text, opacity: 0.6 }}>
                          {currentColors.accent}
                        </span>
                      </div>
                      <div className="h-12 rounded-lg border-2 border-white shadow-inner"
                        style={{ backgroundColor: currentColors.accent }}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2" style={{ color: currentColors.text }}>
                        渐变预览
                      </div>
                      <div className="h-12 rounded-lg border-2 border-white shadow-inner"
                        style={{ background: currentRecipe.preview.gradient }}
                      />
                    </div>
                  </div>
                </div>

                {/* UI组件预览卡片 */}
                <div className="p-6 rounded-2xl border-2" style={{
                  backgroundColor: currentColors.surface,
                  borderColor: currentColors.primary
                }}>
                  <h3 className="text-xl font-bold mb-4" style={{ color: currentColors.text }}>
                    🧩 组件预览
                  </h3>
                  <div className="space-y-3">
                    {/* 按钮预览 */}
                    <div>
                      <div className="text-xs uppercase tracking-wide mb-2" style={{ color: currentColors.text, opacity: 0.6 }}>
                        按钮组件
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                          style={{
                            backgroundColor: currentColors.primary,
                            color: '#ffffff',
                            boxShadow: `0 4px 12px ${currentColors.primary}40`
                          }}
                        >
                          Primary
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                          style={{
                            backgroundColor: currentColors.secondary,
                            color: '#ffffff',
                            boxShadow: `0 4px 12px ${currentColors.secondary}40`
                          }}
                        >
                          Secondary
                        </button>
                      </div>
                    </div>

                    {/* 卡片预览 */}
                    <div>
                      <div className="text-xs uppercase tracking-wide mb-2" style={{ color: currentColors.text, opacity: 0.6 }}>
                        卡片组件
                      </div>
                      <div
                        className="p-4 rounded-lg border transition-all"
                        style={{
                          backgroundColor: currentColors.background,
                          borderColor: currentColors.primary,
                          boxShadow: `0 4px 12px ${currentColors.primary}20`
                        }}
                      >
                        <div className="text-sm font-semibold mb-1" style={{ color: currentColors.text }}>
                          示例卡片
                        </div>
                        <div className="text-xs" style={{ color: currentColors.text, opacity: 0.7 }}>
                          这是一个使用当前配色方案的卡片示例
                        </div>
                      </div>
                    </div>

                    {/* 标签预览 */}
                    <div>
                      <div className="text-xs uppercase tracking-wide mb-2" style={{ color: currentColors.text, opacity: 0.6 }}>
                        标签组件
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 text-sm rounded-full" style={{
                          backgroundColor: currentColors.primary,
                          color: '#ffffff'
                        }}>Primary</span>
                        <span className="px-3 py-1 text-sm rounded-full" style={{
                          backgroundColor: currentColors.accent,
                          color: '#ffffff'
                        }}>Accent</span>
                        <span className="px-3 py-1 text-sm rounded-full border-2" style={{
                          borderColor: currentColors.primary,
                          color: currentColors.primary
                        }}>Outline</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 创意配色特殊信息 */}
                {currentRecipe.type === 'creative' && currentRecipe.creativeData && (
                  <div className="p-6 rounded-2xl border-2" style={{
                    backgroundColor: currentColors.surface,
                    borderColor: currentColors.primary
                  }}>
                    <h3 className="text-xl font-bold mb-4" style={{ color: currentColors.text }}>
                      ✨ 创意特性
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="text-xs uppercase tracking-wide mb-1" style={{ color: currentColors.text, opacity: 0.6 }}>
                          心情氛围
                        </div>
                        <div className="font-semibold capitalize" style={{ color: currentColors.text }}>
                          {currentRecipe.mood}
                        </div>
                      </div>
                      {currentRecipe.creativeData.glow && (
                        <div>
                          <div className="text-xs uppercase tracking-wide mb-1" style={{ color: currentColors.text, opacity: 0.6 }}>
                            发光效果
                          </div>
                          <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-full" style={{
                              backgroundColor: currentRecipe.creativeData.primary[500],
                              boxShadow: `0 0 20px ${currentRecipe.creativeData.glow.primary}`
                            }} />
                            <div className="w-8 h-8 rounded-full" style={{
                              backgroundColor: currentRecipe.creativeData.secondary[500],
                              boxShadow: `0 0 20px ${currentRecipe.creativeData.glow.secondary}`
                            }} />
                            <div className="w-8 h-8 rounded-full" style={{
                              backgroundColor: currentRecipe.creativeData.accent[500],
                              boxShadow: `0 0 20px ${currentRecipe.creativeData.glow.accent}`
                            }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}