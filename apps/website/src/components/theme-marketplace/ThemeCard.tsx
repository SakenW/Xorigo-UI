'use client'

/**
 * 🎴 主题卡片组件
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Star,
  Download,
  Heart,
  Share2,
  Eye,
  Award,
  MoreVertical,
  Check
} from 'lucide-react'
import type { PresetTheme } from '../../../../packages/core/src/theme/advanced/twenty-six-params'

interface ThemeCardProps {
  theme: PresetTheme
  viewMode: 'grid' | 'list'
  onSelect: (theme: PresetTheme) => void
  onPreview: (theme: PresetTheme) => void
  onApply: (theme: PresetTheme) => void
  onFavorite: (themeId: string) => void
  onRate: (themeId: string, rating: number) => void
  onShare: (theme: PresetTheme) => void
  userId?: string
}

const ThemeCard: React.FC<ThemeCardProps> = ({
  theme,
  viewMode,
  onSelect,
  onPreview,
  onApply,
  onFavorite,
  onRate,
  onShare,
  userId
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [userRating, setUserRating] = useState<number>(0)

  const params = theme.parameters

  // 生成主题预览色彩
  const primaryColor = `hsl(${params.hue.primary}, ${params.saturation.factor * 100}%, ${params.lightness.factor * 50}%)`
  const secondaryColor = `hsl(${params.hue.secondary || params.hue.primary}, ${params.saturation.factor * 100}%, ${params.lightness.factor * 60}%)`
  const accentColor = `hsl(${params.hue.accent || params.hue.primary}, ${params.saturation.factor * 100}%, ${params.lightness.factor * 70}%)`

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorited(!isFavorited)
    onFavorite(theme.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    onShare(theme)
  }

  const handleRating = (rating: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setUserRating(rating)
    onRate(theme.id, rating)
  }

  const handlePreview = () => {
    onPreview(theme)
  }

  const handleApply = () => {
    onApply(theme)
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-slate-200 dark:border-slate-700"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelect(theme)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-4">
          {/* 主题色彩预览 */}
          <div className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden flex">
            <div
              className="flex-1"
              style={{ backgroundColor: primaryColor }}
            />
            <div
              className="flex-1"
              style={{ backgroundColor: secondaryColor }}
            />
            <div
              className="flex-1"
              style={{ backgroundColor: accentColor }}
            />
          </div>

          {/* 主题信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {theme.name}
              </h3>
              {theme.isPopular && (
                <Award className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              )}
              {theme.isNew && (
                <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full flex-shrink-0">
                  NEW
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {theme.description}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 dark:text-slate-500">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span>{theme.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="w-3 h-3" />
                <span>{theme.downloads.toLocaleString()}</span>
              </div>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">
                {theme.category}
              </span>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePreview()
              }}
              className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="预览"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-lg transition-colors ${
                isFavorited
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-slate-600 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500'
              }`}
              title="收藏"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleApply}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              应用
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  // 网格视图
  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-slate-200 dark:border-slate-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(theme)}
      whileHover={{ y: -4 }}
      layout
    >
      {/* 主题预览图 */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
        <div className="absolute inset-0 flex">
          <div
            className="flex-1 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: primaryColor }}
          />
          <div
            className="flex-1 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: secondaryColor }}
          />
          <div
            className="flex-1 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        {/* 悬浮遮罩 */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-2"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePreview()
                }}
                className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                title="预览"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-white text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
              >
                应用
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 标签 */}
        <div className="absolute top-2 left-2 flex items-center space-x-1">
          {theme.isPopular && (
            <Award className="w-4 h-4 text-yellow-500" />
          )}
          {theme.isNew && (
            <span className="px-1.5 py-0.5 text-xs font-medium bg-green-500 text-white rounded">
              NEW
            </span>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="absolute top-2 right-2 flex items-center space-x-1">
          <button
            onClick={handleFavorite}
            className={`p-1.5 backdrop-blur-sm rounded-lg transition-colors ${
              isFavorited
                ? 'bg-red-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            title="收藏"
          >
            <Heart className={`w-3 h-3 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
            title="分享"
          >
            <Share2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 主题信息 */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate flex-1">
            {theme.name}
          </h3>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {theme.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
          {theme.description}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Download className="w-3 h-3" />
              <span>{(theme.downloads / 1000).toFixed(1)}k</span>
            </div>
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">
              {theme.category}
            </span>
          </div>
        </div>

        {/* 评分 */}
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={(e) => handleRating(star, e)}
              className="text-slate-300 dark:text-slate-600 hover:text-yellow-500 transition-colors"
            >
              <Star
                className={`w-3 h-3 ${
                  star <= (userRating || theme.rating)
                    ? 'text-yellow-500 fill-current'
                    : ''
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// 添加 AnimatePresence
const AnimatePresence = motion(AnimatePresence as any)

export default ThemeCard
