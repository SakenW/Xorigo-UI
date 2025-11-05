import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@xorigo-ui/system'
import { getAvailableRecipes, mapRecipeToSystem, COMPLETE_THEME_RECIPES, type CompleteThemeRecipe } from '../theme'
import { cn } from '../utils/cn'

export interface AdvancedThemeSwitcherProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'button' | 'dropdown' | 'popover'
  showLabel?: boolean
  showPreview?: boolean
  enableSearch?: boolean
  enableCategories?: boolean
  maxVisibleThemes?: number
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

export const AdvancedThemeSwitcher: React.FC<AdvancedThemeSwitcherProps> = ({
  className,
  size = 'md',
  variant = 'dropdown',
  showLabel = false,
  showPreview = false,
  enableSearch = false,
  enableCategories = true,
  maxVisibleThemes = 6,
}) => {
  const { currentTheme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  // 获取可用的主题配方
  const availableRecipes = getAvailableRecipes()

  // 过滤主题
  const filteredThemes = availableRecipes.filter(theme =>
    searchQuery ?
      theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
  )

  const handleThemeChange = (recipeId: string) => {
    setIsAnimating(true)
    // 将主题配方ID映射到system包主题ID
    const systemTheme = mapRecipeToSystem(recipeId)
    setTheme(systemTheme)
    setTimeout(() => setIsAnimating(false), 300)
    if (variant === 'popover') {
      setIsOpen(false)
    }
  }

  const cycleTheme = () => {
    const currentIndex = availableRecipes.findIndex(theme => theme.id === currentTheme)
    const nextRecipe = availableRecipes[(currentIndex + 1) % availableRecipes.length]
    if (nextRecipe) {
      handleThemeChange(nextRecipe.id)
    }
  }

  // Button variant - 简单切换
  if (variant === 'button') {
    return (
      <motion.div
        className={cn('relative inline-flex items-center justify-center', className)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.button
          className={cn(
            'relative inline-flex items-center justify-center rounded-full',
            'bg-gradient-to-r from-purple-500 to-cyan-500',
            'hover:from-purple-600 hover:to-cyan-600',
            'text-white shadow-lg hover:shadow-xl',
            'transition-all duration-200',
            sizeClasses[size]
          )}
          onClick={cycleTheme}
          disabled={isAnimating}
        >
          <motion.div
            key={currentTheme}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex items-center justify-center"
          >
            🎨
          </motion.div>

          {isAnimating && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/50"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.button>

        {showLabel && (
          <motion.span
            className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {availableRecipes.find(t => mapRecipeToSystem(t.id) === currentTheme)?.name || currentTheme}
          </motion.span>
        )}
      </motion.div>
    )
  }

  // Dropdown variant - 下拉选择
  if (variant === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <motion.select
          value={currentTheme}
          onChange={(e) => handleThemeChange(e.target.value)}
          className={cn(
            'px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700',
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500',
            'transition-all duration-200',
            size === 'sm' ? 'text-sm' : 'text-base',
            'cursor-pointer hover:border-purple-400 dark:hover:border-purple-500'
          )}
          whileHover={{ scale: 1.02 }}
          whileFocus={{ scale: 1.02 }}
        >
          {filteredThemes.slice(0, maxVisibleThemes).map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
              {theme.isNew && ' ✨'}
              {theme.isPopular && ' 🔥'}
            </option>
          ))}
        </motion.select>

        {showLabel && (
          <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            主题
          </span>
        )}
      </div>
    )
  }

  // Popover variant - 弹出式选择器
  return (
    <div className={cn('relative', className)}>
      <motion.button
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-gradient-to-r from-purple-500 to-cyan-500',
          'hover:from-purple-600 hover:to-cyan-600',
          'text-white shadow-lg hover:shadow-xl',
          'transition-all duration-200',
          size === 'sm' ? 'text-sm' : 'text-base'
        )}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          key={currentTheme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          🎨
        </motion.div>
        {showLabel && (
          <span className="truncate max-w-32">
            {COMPLETE_THEME_RECIPES.find(t => t.id === currentTheme)?.name || currentTheme}
          </span>
        )}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden rounded-lg shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 z-50"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                选择主题
              </h3>
              {enableSearch && (
                <input
                  type="text"
                  placeholder="搜索主题..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700',
                    'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500/20',
                    'transition-all duration-200 text-sm'
                  )}
                />
              )}
            </div>

            <div className="max-h-64 overflow-y-auto">
              {filteredThemes.map((theme) => {
                const isActive = currentTheme === theme.id

                return (
                  <motion.button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={cn(
                      'w-full p-3 border-b border-gray-100 dark:border-gray-800',
                      'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150',
                      'flex items-center gap-3 text-left',
                      isActive && 'bg-purple-50 dark:bg-purple-950/20'
                    )}
                    whileHover={{ x: 4 }}
                  >
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"
                      style={{
                        backgroundColor: theme.colors.primary
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate flex items-center gap-2">
                        {theme.name}
                        {theme.isNew && <span className="text-xs">✨</span>}
                        {theme.isPopular && <span className="text-xs">🔥</span>}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {theme.description}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {theme.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

AdvancedThemeSwitcher.displayName = 'AdvancedThemeSwitcher'

// 为了向后兼容，也导出为 ThemeSwitcher
export { AdvancedThemeSwitcher as ThemeSwitcher }
export type { AdvancedThemeSwitcherProps as ThemeSwitcherProps }