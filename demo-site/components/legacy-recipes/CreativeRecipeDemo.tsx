/**
 * 🎨 TH-UI 创意配色方案演示组件
 *
 * 展示所有原有的创意配色方案，包括：
 * 1. 🌌 赛博蓝紫 (Cyber Blue-Purple)
 * 2. 🌅 温暖晨曦 (Warm Sunrise)
 * 3. 💖 粉色浪漫 (Pink Romance)
 * 4. 🌲 森林自然 (Forest Nature)
 * 5. 🌊 深海探险 (Deep Ocean)
 * 6. 👑 皇室紫罗兰 (Royal Violet)
 * 7. ⚫ 极简黑白 (Minimal Black-White)
 * 8. 🍋 活力柠檬 (Vibrant Lemon)
 * 9. 🌈 梦幻彩虹 (Dreamy Rainbow)
 * 10. 🎪 嘉年华 (Carnival Circus)
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colorPalettes, type ColorPalette } from '../../src/theme/palettes'

// ============================================================================
// 配色卡片组件 (Creative Recipe Card)
// ============================================================================

interface CreativeRecipeCardProps {
  palette: ColorPalette
  isSelected: boolean
  onSelect: () => void
  index: number
}

function CreativeRecipeCard({
  palette,
  isSelected,
  onSelect,
  index
}: CreativeRecipeCardProps) {
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
        background: palette.gradient.background,
      }}
    >
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

      {/* 配色头部 */}
      <div className="p-6">
        {/* 配色名称和描述 */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            {palette.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {palette.description}
          </p>
        </div>

        {/* 颜色展示 */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <div
              className="h-12 w-full rounded-lg mb-1 shadow-sm"
              style={{ backgroundColor: palette.primary[500] }}
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">主色</p>
          </div>
          <div className="text-center">
            <div
              className="h-12 w-full rounded-lg mb-1 shadow-sm"
              style={{ backgroundColor: palette.secondary[500] }}
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">次色</p>
          </div>
          <div className="text-center">
            <div
              className="h-12 w-full rounded-lg mb-1 shadow-sm"
              style={{ backgroundColor: palette.accent[500] }}
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">强调</p>
          </div>
        </div>

        {/* 渐变预览 */}
        <div
          className="h-16 rounded-lg mb-4 shadow-inner"
          style={{ background: palette.gradient.primary }}
        />

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
          >
            {palette.mood}
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {palette.tags.length} 标签
          </span>
        </div>

        {/* 部分标签展示 */}
        <div className="flex flex-wrap gap-1 mb-4">
          {palette.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
          {palette.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400">
              +{palette.tags.length - 3}
            </span>
          )}
        </div>

        {/* 点击提示 */}
        <div
          className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400"
        >
          {isSelected ? '✅ 当前应用配色' : '👆 点击切换到此配色'}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 实时预览组件 (Live Preview)
// ============================================================================

interface CreativePreviewProps {
  palette: ColorPalette
}

function CreativePreview({ palette }: CreativePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800"
    >
      {/* 头部 */}
      <div
        className="p-6 border-b border-gray-200 dark:border-gray-700"
        style={{
          background: palette.gradient.background
        }}
      >
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          实时预览效果
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          当前配色：{palette.name}
        </p>
      </div>

      {/* 预览内容 */}
      <div className="p-6 space-y-6">
        {/* 主按钮预览 */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">按钮组件</h4>
          <div className="space-y-3">
            <button
              className="w-full px-4 py-3 rounded-lg font-medium text-white transition-colors shadow-lg"
              style={{
                backgroundColor: palette.primary[500],
                boxShadow: `0 4px 6px ${palette.primary[300]}`
              }}
            >
              主要按钮 - {palette.name}
            </button>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-3 rounded-lg font-medium border-2 transition-colors"
                style={{
                  borderColor: palette.secondary[500],
                  color: palette.secondary[600],
                  backgroundColor: 'transparent'
                }}
              >
                次要按钮
              </button>
              <button
                className="flex-1 px-4 py-3 rounded-lg font-medium text-white transition-colors shadow-md"
                style={{
                  backgroundColor: palette.accent[500],
                  boxShadow: `0 4px 6px ${palette.accent[300]}`
                }}
              >
                强调按钮
              </button>
            </div>
          </div>
        </div>

        {/* 卡片预览 */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">卡片组件</h4>
          <div
            className="rounded-lg p-4 border-2"
            style={{
              backgroundColor: palette.gradient.background,
              borderColor: palette.primary[200]
            }}
          >
            <h5 className="font-medium mb-2 text-gray-900 dark:text-white">
              示例卡片标题
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              这个卡片使用了{palette.name}的渐变背景。
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-2 rounded-lg text-sm font-medium text-white"
                style={{
                  backgroundColor: palette.primary[500]
                }}
              >
                操作1
              </button>
              <button
                className="px-3 py-2 rounded-lg text-sm font-medium text-white"
                style={{
                  backgroundColor: palette.secondary[500]
                }}
              >
                操作2
              </button>
            </div>
          </div>
        </div>

        {/* 表单预览 */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">表单组件</h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="输入框示例"
              className="w-full px-4 py-3 rounded-lg border-2 transition-colors"
              style={{
                backgroundColor: 'white',
                borderColor: palette.primary[300],
                color: palette.primary[900]
              }}
            />
            <select
              className="w-full px-4 py-3 rounded-lg border-2 transition-colors"
              style={{
                backgroundColor: 'white',
                borderColor: palette.primary[300],
                color: palette.primary[900]
              }}
            >
              <option>下拉选择框</option>
              <option>选项1</option>
              <option>选项2</option>
            </select>
          </div>
        </div>

        {/* 标签预览 */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">标签组件</h4>
          <div className="flex flex-wrap gap-2">
            <span
              className="px-3 py-1 text-sm rounded-full text-white"
              style={{ backgroundColor: palette.primary[500] }}
            >
              主要标签
            </span>
            <span
              className="px-3 py-1 text-sm rounded-full text-white"
              style={{ backgroundColor: palette.secondary[500] }}
            >
              次要标签
            </span>
            <span
              className="px-3 py-1 text-sm rounded-full text-white"
              style={{ backgroundColor: palette.accent[500] }}
            >
              强调标签
            </span>
            <span
              className="px-3 py-1 text-sm rounded-full border-2"
              style={{
                borderColor: palette.primary[500],
                color: palette.primary[600]
              }}
            >
              轮廓标签
            </span>
          </div>
        </div>

        {/* 渐变背景展示 */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">渐变背景</h4>
          <div className="grid grid-cols-2 gap-2">
            <div
              className="h-20 rounded-lg shadow-inner"
              style={{ background: palette.gradient.primary }}
            />
            <div
              className="h-20 rounded-lg shadow-inner"
              style={{ background: palette.gradient.secondary }}
            />
            <div
              className="h-20 rounded-lg shadow-inner"
              style={{ background: palette.gradient.accent }}
            />
            <div
              className="h-20 rounded-lg shadow-inner"
              style={{ background: palette.gradient.background }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 主演示组件 (Main Demo Component)
// ============================================================================

export function CreativeRecipeDemo() {
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>('cyber-blue-purple')
  const [searchQuery, setSearchQuery] = useState('')

  // 过滤配色方案
  const filteredPalettes = useMemo(() => {
    if (!searchQuery.trim()) return colorPalettes

    const query = searchQuery.toLowerCase()
    return colorPalettes.filter(palette =>
      palette.name.toLowerCase().includes(query) ||
      palette.description.toLowerCase().includes(query) ||
      palette.tags.some(tag => tag.toLowerCase().includes(query)) ||
      palette.id.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // 获取当前选中的配色方案
  const currentPalette = useMemo(() => {
    return colorPalettes.find(p => p.id === selectedPaletteId) || colorPalettes[0]
  }, [selectedPaletteId])

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
              🎨 TH-UI 创意配色方案
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              10个精心设计的创意配色方案，点击即可实时预览效果
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

            {/* 当前配色状态 */}
            {currentPalette && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-700"
                style={{
                  background: currentPalette.gradient.background
                }}
              >
                <div className="flex items-center justify-center gap-8">
                  <div className="text-left">
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      当前应用配色：{currentPalette.name}
                    </h2>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300 mb-3">
                      {currentPalette.id}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                        {currentPalette.mood}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                        {currentPalette.tags.length} 个标签
                      </span>
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
          {/* 左侧配色列表 */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                创意配色方案库 ({filteredPalettes.length})
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                点击任意配色方案进行切换和预览
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPalettes.map((palette, index) => (
                <CreativeRecipeCard
                  key={palette.id}
                  palette={palette}
                  isSelected={selectedPaletteId === palette.id}
                  onSelect={() => setSelectedPaletteId(palette.id)}
                  index={index}
                />
              ))}
            </div>

            {filteredPalettes.length === 0 && (
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
            {currentPalette && (
              <CreativePreview palette={currentPalette} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}