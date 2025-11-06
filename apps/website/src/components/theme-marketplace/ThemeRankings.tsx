'use client'

/**
 * 🏆 主题排行榜组件
 */

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Star, Download, Award } from 'lucide-react'
import type { ThemeMarketplace, MarketplaceTheme } from '../../../../packages/core/src/theme/marketplace'
import type { PresetTheme } from '../../../../packages/core/src/theme/advanced/twenty-six-params'

interface ThemeRankingsProps {
  marketplace: ThemeMarketplace
  onThemeSelect: (theme: PresetTheme) => void
}

const ThemeRankings: React.FC<ThemeRankingsProps> = ({
  marketplace,
  onThemeSelect
}) => {
  const rankings = marketplace.getThemeRankings()

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
        主题排行榜
      </h3>

      <div className="space-y-6">
        {/* 热门主题 */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              热门趋势
            </h4>
          </div>
          <div className="space-y-2">
            {rankings.categories.trending.slice(0, 5).map((theme, index) => (
              <button
                key={theme.id}
                onClick={() => onThemeSelect(theme)}
                className="w-full flex items-center space-x-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
              >
                <span className="flex-shrink-0 w-5 text-xs font-bold text-slate-400">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {theme.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {theme.stats.totalDownloads.toLocaleString()} 下载
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 高评分主题 */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-4 h-4 text-yellow-500" />
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              高评分
            </h4>
          </div>
          <div className="space-y-2">
            {rankings.categories.highestRated.slice(0, 5).map((theme, index) => (
              <button
                key={theme.id}
                onClick={() => onThemeSelect(theme)}
                className="w-full flex items-center space-x-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
              >
                <span className="flex-shrink-0 w-5 text-xs font-bold text-slate-400">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {theme.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    ⭐ {theme.stats.averageRating.toFixed(1)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 下载排行 */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Download className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
              下载排行
            </h4>
          </div>
          <div className="space-y-2">
            {rankings.categories.mostDownloaded.slice(0, 5).map((theme, index) => (
              <button
                key={theme.id}
                onClick={() => onThemeSelect(theme)}
                className="w-full flex items-center space-x-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left"
              >
                <span className="flex-shrink-0 w-5 text-xs font-bold text-slate-400">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {theme.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {(theme.stats.totalDownloads / 1000).toFixed(1)}k 下载
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeRankings
