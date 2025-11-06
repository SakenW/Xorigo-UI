'use client'

/**
 * 📖 主题详情组件
 */

import React from 'react'
import { motion } from 'framer-motion'
import { X, Star, Heart, Share2, Download, Eye } from 'lucide-react'
import type { PresetTheme } from '../../../../packages/core/src/theme/advanced/twenty-six-params'

interface ThemeDetailProps {
  theme: PresetTheme
  onClose: () => void
  onPreview: () => void
  onApply: () => void
  onFavorite: () => void
  onRate: (rating: number) => void
  onShare: () => void
  userId?: string
}

const ThemeDetail: React.FC<ThemeDetailProps> = ({
  theme,
  onClose,
  onPreview,
  onApply,
  onFavorite,
  onRate,
  onShare
}) => {
  const params = theme.parameters

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {theme.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {theme.description}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{theme.rating}</span>
                <span className="text-slate-500">({theme.downloads.toLocaleString()} 下载)</span>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded text-xs">
                {theme.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-6">
          {/* 预览图 */}
          <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex">
            <div
              className="flex-1"
              style={{
                backgroundColor: `hsl(${params.hue.primary}, ${params.saturation.factor * 100}%, ${params.lightness.factor * 50}%)`
              }}
            />
            <div
              className="flex-1"
              style={{
                backgroundColor: `hsl(${params.hue.secondary || params.hue.primary}, ${params.saturation.factor * 100}%, ${params.lightness.factor * 60}%)`
              }}
            />
            <div
              className="flex-1"
              style={{
                backgroundColor: `hsl(${params.hue.accent || params.hue.primary}, ${params.saturation.factor * 100}%, ${params.lightness.factor * 70}%)`
              }}
            />
          </div>

          {/* 标签 */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {theme.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {theme.downloads.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                下载量
              </div>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {theme.rating}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                平均评分
              </div>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {theme.category}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                分类
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={onFavorite}
              className="p-2 text-slate-600 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="收藏"
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={onShare}
              className="p-2 text-slate-600 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="分享"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onPreview}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              预览
            </button>
            <button
              onClick={onApply}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              应用主题
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ThemeDetail
