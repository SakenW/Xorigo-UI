/**
 * 🎨 TH-UI 七轴DTCG配方演示组件
 *
 * 真正基于七轴DTCG体系的配色方案演示
 * 完全移除旧的配色系统，全面接入新的七轴配方体系
 *
 * 七轴体系：<mode>.<base>.<accent>.<tone>.<density>.<motion>.<surface>
 */

import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useDTCGStyleRecipe,
  type DTCGStyleRecipe,
  type ResponseLevel,
} from '../../src/style-recipe/provider/DTCGStyleRecipeProvider'
import {
  officialRecipes,
  type StyleRecipe,
} from '../../src/style-recipe/recipes/official-recipes'

// ============================================================================
// 七轴配方卡片组件 (Seven-Axis Recipe Card)
// ============================================================================

interface SevenAxisRecipeCardProps {
  recipe: StyleRecipe
  isSelected: boolean
  isTransitioning: boolean
  onSelect: () => void
  index: number
  currentRecipe: DTCGStyleRecipe | null
}

function SevenAxisRecipeCard({
  recipe,
  isSelected,
  isTransitioning,
  onSelect,
  index,
  currentRecipe
}: SevenAxisRecipeCardProps) {
  // 根据七轴配方生成对应的颜色
  const getRecipeColors = useCallback((recipeId: string) => {
    // 这里应该从DTCG引擎获取真实的颜色令牌
    // 现在基于配方ID生成模拟颜色
    const colorMap: Record<string, {
      primary: string
      secondary: string
      accent: string
      background: string
      surface: string
      text: string
      border: string
    }> = {
      'light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow': {
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#60a5fa',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1f2937',
        border: '#e5e7eb'
      },
      'dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow': {
        primary: '#1e40af',
        secondary: '#1e3a8a',
        accent: '#3b82f6',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        border: '#334155'
      },
      'light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat': {
        primary: '#6b7280',
        secondary: '#9ca3af',
        accent: '#d1d5db',
        background: '#ffffff',
        surface: '#f9fafb',
        text: '#111827',
        border: '#e5e7eb'
      },
      'dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat': {
        primary: '#374151',
        secondary: '#4b5563',
        accent: '#9ca3af',
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb',
        border: '#374151'
      },
      'light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow': {
        primary: '#06b6d4',
        secondary: '#0891b2',
        accent: '#67e8f9',
        background: '#f0fdfa',
        surface: '#ecfeff',
        text: '#134e4a',
        border: '#a7f3d0'
      },
      'dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon': {
        primary: '#0891b2',
        secondary: '#d946ef',
        accent: '#67e8f9',
        background: '#18181b',
        surface: '#27272a',
        text: '#fafafa',
        border: '#3f3f46'
      },
      'light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring': {
        primary: '#a855f7',
        secondary: '#c084fc',
        accent: '#e9d5ff',
        background: '#faf5ff',
        surface: '#f3e8ff',
        text: '#581c87',
        border: '#e9d5ff'
      },
      'dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass': {
        primary: '#9333ea',
        secondary: '#c084fc',
        accent: '#e9d5ff',
        background: '#1a1a1a',
        surface: '#262626',
        text: '#fafafa',
        border: '#404040'
      },
      'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow': {
        primary: '#64748b',
        secondary: '#94a3b8',
        accent: '#cbd5e1',
        background: '#f8fafc',
        surface: '#f1f5f9',
        text: '#0f172a',
        border: '#e2e8f0'
      },
      'hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat': {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#60a5fa',
        background: '#ffffff',
        surface: '#eff6ff',
        text: '#1f2937',
        border: '#3b82f6'
      }
    }

    return colorMap[recipeId] || colorMap['light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow']
  }, [])

  const colors = useMemo(() => getRecipeColors(recipe.id), [recipe.id, getRecipeColors])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
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
        backgroundColor: colors.background,
        color: colors.text,
        borderColor: isSelected ? colors.primary : colors.border
      }}
    >
      {/* 切换动画指示器 */}
      {isTransitioning && isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
          style={{ backgroundColor: colors.primary }}
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
          <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
          <p className="text-sm opacity-80 line-clamp-2">{recipe.description}</p>
        </div>

        {/* 七轴配方ID */}
        <div className="mb-4">
          <code
            className="text-xs px-3 py-2 rounded-lg font-mono block truncate"
            style={{
              backgroundColor: colors.surface,
              color: colors.text,
              border: `1px solid ${colors.border}`
            }}
          >
            {recipe.id}
          </code>
        </div>

        {/* 七轴配置展示 */}
        <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: colors.surface }}>
          <h4 className="text-xs font-semibold mb-2 opacity-70">七轴配置：</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div><span className="font-medium">模式:</span> {recipe.mode}</div>
            <div><span className="font-medium">基础:</span> {recipe.base}</div>
            <div><span className="font-medium">强调:</span> {recipe.accent}</div>
            <div><span className="font-medium">色调:</span> {recipe.tone}</div>
            <div><span className="font-medium">密度:</span> {recipe.density}</div>
            <div><span className="font-medium">动效:</span> {recipe.motion}</div>
            <div className="col-span-2"><span className="font-medium">表面:</span> {recipe.surface}</div>
          </div>
        </div>

        {/* 颜色预览 */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center">
            <div
              className="h-8 w-full rounded-lg mb-1"
              style={{ backgroundColor: colors.primary }}
            />
            <p className="text-xs opacity-60">主色</p>
          </div>
          <div className="text-center">
            <div
              className="h-8 w-full rounded-lg mb-1"
              style={{ backgroundColor: colors.secondary }}
            />
            <p className="text-xs opacity-60">次色</p>
          </div>
          <div className="text-center">
            <div
              className="h-8 w-full rounded-lg mb-1"
              style={{ backgroundColor: colors.accent }}
            />
            <p className="text-xs opacity-60">强调</p>
          </div>
          <div className="text-center">
            <div
              className="h-8 w-full rounded-lg mb-1 border"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border
              }}
            />
            <p className="text-xs opacity-60">背景</p>
          </div>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="px-3 py-1 text-xs font-medium rounded-full"
            style={{
              backgroundColor: colors.primary + '20',
              color: colors.primary
            }}
          >
            {recipe.category}
          </span>
          <span
            className="px-3 py-1 text-xs font-medium rounded-full"
            style={{
              backgroundColor: colors.accent + '20',
              color: colors.primary
            }}
          >
            {recipe.accessibility.contrastLevel}
          </span>
          <span
            className="px-3 py-1 text-xs font-medium rounded-full"
            style={{
              backgroundColor: colors.surface,
              color: colors.text
            }}
          >
            七轴
          </span>
        </div>

        {/* 可访问性指标 */}
        <div className="flex items-center gap-3 text-xs opacity-60">
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
        <div
          className="pt-4 border-t text-center text-xs opacity-60"
          style={{ borderColor: colors.border }}
        >
          {isSelected ? '✅ 当前应用七轴配方' : '👆 点击切换到此七轴配方'}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 七轴配方实时预览组件 (Seven-Axis Live Preview)
// ============================================================================

interface SevenAxisPreviewProps {
  recipe: StyleRecipe
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    border: string
  }
  isTransitioning: boolean
}

function SevenAxisPreview({ recipe, colors, isTransitioning }: SevenAxisPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl border-2 overflow-hidden"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        borderColor: colors.border
      }}
    >
      {/* 头部 */}
      <div
        className="p-6 border-b"
        style={{ borderColor: colors.border }}
      >
        <h3 className="text-2xl font-bold mb-2">七轴配方实时预览</h3>
        <p className="opacity-80">当前七轴配方：{recipe.name}</p>
        <p className="text-xs opacity-60 mt-1">ID: {recipe.id}</p>
      </div>

      {/* 预览内容 */}
      <div className="p-6 space-y-6">
        {/* 七轴配置详情 */}
        <div>
          <h4 className="font-semibold mb-3">七轴配置详情</h4>
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.surface }}
          >
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">模式 (Mode):</span>
                <span>{recipe.mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">基础 (Base):</span>
                <span>{recipe.base}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">强调 (Accent):</span>
                <span>{recipe.accent}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">色调 (Tone):</span>
                <span>{recipe.tone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">密度 (Density):</span>
                <span>{recipe.density}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">动效 (Motion):</span>
                <span>{recipe.motion}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">表面 (Surface):</span>
                <span>{recipe.surface}</span>
              </div>
            </div>
          </div>
        </div>

        {/* UI组件预览 */}
        <div>
          <h4 className="font-semibold mb-3">UI组件效果</h4>
          <div className="space-y-3">
            <button
              className="w-full px-4 py-3 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: colors.primary,
                color: '#ffffff'
              }}
            >
              主要按钮 - {recipe.mode} 模式
            </button>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-3 rounded-lg font-medium border-2 transition-colors"
                style={{
                  borderColor: colors.secondary,
                  color: colors.secondary,
                  backgroundColor: 'transparent'
                }}
              >
                次要按钮
              </button>
              <button
                className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: colors.accent,
                  color: '#ffffff'
                }}
              >
                强调按钮
              </button>
            </div>
          </div>
        </div>

        {/* 卡片组件预览 */}
        <div>
          <h4 className="font-semibold mb-3">卡片组件</h4>
          <div
            className="rounded-lg p-4 border-2"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border
            }}
          >
            <h5 className="font-medium mb-2">示例卡片</h5>
            <p className="text-sm opacity-80 mb-3">
              基于{recipe.base}基础和{recipe.tone}色调的卡片。
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-2 rounded-lg text-sm font-medium text-white"
                style={{
                  backgroundColor: colors.primary
                }}
              >
                主要操作
              </button>
              <button
                className="px-3 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: colors.secondary,
                  color: '#ffffff'
                }}
              >
                次要操作
              </button>
            </div>
          </div>
        </div>

        {/* 表单组件预览 */}
        <div>
          <h4 className="font-semibold mb-3">表单组件</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder={`${recipe.mode} 模式输入框`}
              className="w-full px-4 py-3 rounded-lg border-2 transition-colors"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text
              }}
            />
            <select
              className="w-full px-4 py-3 rounded-lg border-2 transition-colors"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text
              }}
            >
              <option>{recipe.base} 基础选择</option>
              <option>{recipe.tone} 色调选项</option>
              <option>{recipe.density} 密度设置</option>
            </select>
          </div>
        </div>

        {/* 可访问性信息 */}
        <div>
          <h4 className="font-semibold mb-3">可访问性信息</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">对比度级别:</span>
              <span
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: colors.accent + '20',
                  color: colors.primary
                }}
              >
                {recipe.accessibility.contrastLevel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">色盲友好:</span>
              <span>{recipe.accessibility.cvdFriendly ? '✅ 是' : '❌ 否'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">动效安全:</span>
              <span>{recipe.accessibility.motionSafe ? '✅ 是' : '❌ 否'}</span>
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

export function DTCGRecipeDemo() {
  const {
    currentRecipe,
    setRecipe,
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
      recipe.tags.some(tag => tag.toLowerCase().includes(query)) ||
      recipe.id.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // 获取当前选中的官方配方
  const currentOfficialRecipe = officialRecipes.find(r => r.id === currentRecipe?.id)

  // 生成颜色映射
  const getRecipeColors = useCallback((recipeId: string) => {
    const colorMap: Record<string, {
      primary: string
      secondary: string
      accent: string
      background: string
      surface: string
      text: string
      border: string
    }> = {
      'light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow': {
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#60a5fa',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1f2937',
        border: '#e5e7eb'
      },
      'dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow': {
        primary: '#1e40af',
        secondary: '#1e3a8a',
        accent: '#3b82f6',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        border: '#334155'
      },
      'light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat': {
        primary: '#6b7280',
        secondary: '#9ca3af',
        accent: '#d1d5db',
        background: '#ffffff',
        surface: '#f9fafb',
        text: '#111827',
        border: '#e5e7eb'
      },
      'dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat': {
        primary: '#374151',
        secondary: '#4b5563',
        accent: '#9ca3af',
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb',
        border: '#374151'
      },
      'light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow': {
        primary: '#06b6d4',
        secondary: '#0891b2',
        accent: '#67e8f9',
        background: '#f0fdfa',
        surface: '#ecfeff',
        text: '#134e4a',
        border: '#a7f3d0'
      },
      'dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon': {
        primary: '#0891b2',
        secondary: '#d946ef',
        accent: '#67e8f9',
        background: '#18181b',
        surface: '#27272a',
        text: '#fafafa',
        border: '#3f3f46'
      },
      'light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring': {
        primary: '#a855f7',
        secondary: '#c084fc',
        accent: '#e9d5ff',
        background: '#faf5ff',
        surface: '#f3e8ff',
        text: '#581c87',
        border: '#e9d5ff'
      },
      'dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass': {
        primary: '#9333ea',
        secondary: '#c084fc',
        accent: '#e9d5ff',
        background: '#1a1a1a',
        surface: '#262626',
        text: '#fafafa',
        border: '#404040'
      },
      'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow': {
        primary: '#64748b',
        secondary: '#94a3b8',
        accent: '#cbd5e1',
        background: '#f8fafc',
        surface: '#f1f5f9',
        text: '#0f172a',
        border: '#e2e8f0'
      },
      'hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat': {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#60a5fa',
        background: '#ffffff',
        surface: '#eff6ff',
        text: '#1f2937',
        border: '#3b82f6'
      }
    }

    return colorMap[recipeId] || colorMap['light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow']
  }, [])

  const currentColors = useMemo(() => {
    if (!currentRecipe?.id) return getRecipeColors('light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow')
    return getRecipeColors(currentRecipe.id)
  }, [currentRecipe, getRecipeColors])

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: currentColors.surface }}>
      {/* 头部区域 */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: currentColors.text }}>
            🎨 TH-UI 七轴DTCG配方体系
          </h1>
          <p className="text-xl mb-8" style={{ color: currentColors.text, opacity: 0.8 }}>
            基于七轴风格配方的现代化设计系统
          </p>

          {/* 搜索框 */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索七轴配方..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 rounded-xl transition-colors"
                style={{
                  backgroundColor: currentColors.background,
                  borderColor: currentColors.border,
                  color: currentColors.text
                }}
              />
              <svg className="absolute left-3 top-4.5 w-6 h-6" style={{ color: currentColors.text, opacity: 0.4 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* 当前配方状态 */}
          {currentOfficialRecipe && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl border-2"
              style={{
                backgroundColor: currentColors.background,
                borderColor: currentColors.primary
              }}
            >
              <div className="flex items-center justify-center gap-8">
                <div className="text-left">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: currentColors.text }}>
                    当前应用七轴配方：{currentOfficialRecipe.name}
                  </h2>
                  <p className="text-sm font-mono mb-3" style={{ color: currentColors.text, opacity: 0.7 }}>
                    {currentOfficialRecipe.id}
                  </p>
                  <div className="flex items-center gap-4">
                    <span
                      className="px-3 py-1 text-sm font-medium rounded-full"
                      style={{
                        backgroundColor: currentColors.primary + '20',
                        color: currentColors.primary
                      }}
                    >
                      {currentOfficialRecipe.category}
                    </span>
                    <span
                      className="px-3 py-1 text-sm font-medium rounded-full"
                      style={{
                        backgroundColor: currentColors.accent + '20',
                        color: currentColors.primary
                      }}
                    >
                      {currentOfficialRecipe.accessibility.contrastLevel}
                    </span>
                    <span
                      className="px-3 py-1 text-sm font-medium rounded-full"
                      style={{
                        backgroundColor: currentColors.surface,
                        color: currentColors.text
                      }}
                    >
                      七轴体系
                    </span>
                    {isTransitioning && (
                      <span style={{ color: currentColors.primary }}>
                        切换中...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧配方列表 */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: currentColors.text }}>
                七轴配方库 ({filteredRecipes.length})
              </h2>
              <p style={{ color: currentColors.text, opacity: 0.8 }}>
                点击任意七轴配方进行切换和预览
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecipes.map((recipe, index) => (
                <SevenAxisRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isSelected={currentRecipe?.id === recipe.id}
                  isTransitioning={isTransitioning}
                  onSelect={() => setRecipe(recipe.id as any)}
                  index={index}
                  currentRecipe={currentRecipe}
                />
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: currentColors.text }}>
                  没有找到匹配的七轴配方
                </h3>
                <p style={{ color: currentColors.text, opacity: 0.8 }}>
                  尝试调整搜索关键词
                </p>
              </motion.div>
            )}
          </div>

          {/* 右侧实时预览 */}
          <div className="lg:col-span-1">
            {currentOfficialRecipe && (
              <SevenAxisPreview
                recipe={currentOfficialRecipe}
                colors={currentColors}
                isTransitioning={isTransitioning}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
