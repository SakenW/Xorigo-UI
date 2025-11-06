'use client'

/**
 * 🎨 主题网格组件
 */

import React from 'react'
import { motion } from 'framer-motion'
import type { PresetTheme } from '../../../../packages/core/src/theme/advanced/twenty-six-params'
import ThemeCard from './ThemeCard'

interface ThemeGridProps {
  themes: PresetTheme[]
  viewMode: 'grid' | 'list'
  onSelect: (theme: PresetTheme) => void
  onPreview: (theme: PresetTheme) => void
  onApply: (theme: PresetTheme) => void
  onFavorite: (themeId: string) => void
  onRate: (themeId: string, rating: number) => void
  onShare: (theme: PresetTheme) => void
  userId?: string
}

const ThemeGrid: React.FC<ThemeGridProps> = ({
  themes,
  viewMode,
  onSelect,
  onPreview,
  onApply,
  onFavorite,
  onRate,
  onShare,
  userId
}) => {
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }
    >
      {themes.map((theme) => (
        <motion.div key={theme.id} variants={itemVariants}>
          <ThemeCard
            theme={theme}
            viewMode={viewMode}
            onSelect={onSelect}
            onPreview={onPreview}
            onApply={onApply}
            onFavorite={onFavorite}
            onRate={onRate}
            onShare={onShare}
            userId={userId}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ThemeGrid
