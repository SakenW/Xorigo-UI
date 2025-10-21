'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '@/utils'

export interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  variant?: 'button' | 'dropdown' | 'grid'
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  size = 'md',
  showLabel = false,
  variant = 'button',
}) => {
  const { currentTheme, setTheme, availableThemes, themeConfig } =
    useTheme()
  const [isAnimating, setIsAnimating] = React.useState(false)

  const handleThemeChange = (newTheme: string) => {
    setIsAnimating(true)
    setTheme(newTheme)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const cycleTheme = () => {
    const currentIndex = availableThemes.indexOf(currentTheme)
    const nextTheme = availableThemes[(currentIndex + 1) % availableThemes.length]
    if (nextTheme) {
      handleThemeChange(nextTheme)
    }
  }

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
            'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
            'hover:bg-gray-200 dark:hover:bg-gray-700',
            'transition-colors duration-200',
            sizeClasses[size]
          )}
          onClick={cycleTheme}
          disabled={isAnimating}
          style={{
            background: themeConfig.gradient,
          }}
        >
          <motion.div
            key={currentTheme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex items-center justify-center text-white"
          >
            🎨
          </motion.div>

          {isAnimating && (
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: typeof themeConfig.colors === 'string' ? themeConfig.colors : (themeConfig.colors[500] as unknown as string) }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0 }}
              exit={{ scale: 1.2, opacity: 0 }}
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
            {themeConfig.name}
          </motion.span>
        )}
      </motion.div>
    )
  }

  if (variant === 'dropdown') {
    return (
      <select
        value={currentTheme}
        onChange={(e) => handleThemeChange(e.target.value)}
        className={cn(
          'px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
          'focus:outline-hidden focus:ring-2 focus:ring-blue-500/20',
          className
        )}
      >
        {availableThemes.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
    )
  }

  // Grid variant - 显示所有主题选项
  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      {availableThemes.map((theme) => {
        const isActive = currentTheme === theme
        return (
          <motion.button
            key={theme}
            onClick={() => handleThemeChange(theme)}
            className={cn(
              'p-3 rounded-lg border-2 transition-all duration-200',
              isActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-sm font-medium truncate">{theme}</div>
          </motion.button>
        )
      })}
    </div>
  )
}

ThemeToggle.displayName = 'ThemeToggle'
