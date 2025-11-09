'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme, themeConfigs } from '@xorigo-ui/system'

interface ThemeSwitcherProps {
  className?: string
  variant?: 'dropdown' | 'modal' | 'inline'
}

export function ThemeSwitcher({ className = '', variant = 'dropdown' }: ThemeSwitcherProps) {
  const {
    currentTheme,
    setTheme,
    themeConfig,
    availableThemes,
    categories,
    currentCategory,
    setThemeByCategory,
    setRandomTheme,
    searchThemes
  } = useTheme()

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // 获取主题配置的辅助函数
  const getThemeConfig = (theme: string) => {
    return themeConfigs[theme] || null
  }

  // 过滤主题
  const filteredThemes = searchQuery
    ? searchThemes(searchQuery)
    : currentCategory === 'all'
      ? availableThemes
      : availableThemes.filter(theme => {
          const config = getThemeConfig(theme)
          return config?.category === currentCategory
        })

  const handleThemeChange = (theme: string) => {
    setTheme(theme)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleCategoryChange = (category: string) => {
    setThemeByCategory(category)
  }

  const handleRandomTheme = () => {
    setRandomTheme()
    setIsOpen(false)
  }

  if (variant === 'modal') {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    主题切换器
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      currentCategory === 'all'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    全部
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        currentCategory === category
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {getCategoryName(category)}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="搜索主题..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button
                    onClick={handleRandomTheme}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                  >
                    🎲 随机主题
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredThemes.map(theme => (
                    <motion.button
                      key={theme}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleThemeChange(theme)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        currentTheme === theme
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                          style={{
                            background: `linear-gradient(135deg, ${themeConfigs[theme]?.colors[400] || '#60a5fa'} 0%, ${themeConfigs[theme]?.colors[600] || '#2563eb'} 100%)`,
                            boxShadow: `0 0 20px ${themeConfigs[theme]?.glow || 'rgba(14, 165, 233, 0.3)'}`
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {getThemeName(theme)}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {getThemeDescription(theme)}
                          </p>
                        </div>
                        {currentTheme === theme && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div
          className="w-4 h-4 rounded-full"
          style={{
            background: `linear-gradient(135deg, ${themeConfig.colors[400]} 0%, ${themeConfig.colors[600]} 100%)`,
            boxShadow: `0 0 10px ${themeConfig.glow}`
          }}
        />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {getThemeName(currentTheme)}
        </span>
        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">主题切换</h3>
                <button
                  onClick={handleRandomTheme}
                  className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  🎲 随机
                </button>
              </div>

              <div className="flex flex-wrap gap-1">
                {['all', ...categories].map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-2 py-1 rounded-full text-xs transition-colors ${
                      currentCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {category === 'all' ? '全部' : getCategoryName(category)}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {filteredThemes.map(theme => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    currentTheme === theme ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfigs[theme]?.colors[400] || '#60a5fa'} 0%, ${themeConfigs[theme]?.colors[600] || '#2563eb'} 100%)`,
                      boxShadow: `0 0 15px ${themeConfigs[theme]?.glow || 'rgba(14, 165, 233, 0.3)'}`
                    }}
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm text-gray-900 dark:text-white">
                      {getThemeName(theme)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {getThemeDescription(theme)}
                    </div>
                  </div>
                  {currentTheme === theme && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// 辅助函数
function getThemeName(theme: string): string {
  const themeNames: Record<string, string> = {
    'light': '亮色主题',
    'dark': '暗色主题',
    'cyber-blue-purple': '赛博蓝紫',
    'warm-sunrise': '温暖晨曦',
    'pink-romance': '粉彩浪漫',
    'forest-nature': '自然森林',
    'deep-sea': '深海秘境',
    'noble-violet': '高贵紫罗兰',
    'minimal-black-white': '极简黑白',
    'vibrant-lemon': '活力柠檬',
    'dream-rainbow': '梦幻彩虹',
    'carnival-circus': '嘉年华马戏团',
  }
  return themeNames[theme] || theme
}

function getThemeDescription(theme: string): string {
  const descriptions: Record<string, string> = {
    'light': '清新简洁的亮色主题',
    'dark': '护眼的深色主题',
    'cyber-blue-purple': '现代科技感的蓝紫配色',
    'warm-sunrise': '温暖活力的橙色调',
    'pink-romance': '温柔浪漫的粉彩主题',
    'forest-nature': '自然清新的绿色调',
    'deep-sea': '深邃神秘的海洋主题',
    'noble-violet': '优雅高贵的紫色调',
    'minimal-black-white': '经典简约的黑白主题',
    'vibrant-lemon': '充满活力的柠檬黄色',
    'dream-rainbow': '缤纷多彩的彩虹主题',
    'carnival-circus': '欢乐活泼的嘉年华主题',
  }
  return descriptions[theme] || '精美主题'
}

function getThemeGradient(theme: string): string {
  const gradients: Record<string, string> = {
    'light': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'dark': 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    'cyber-blue-purple': 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)',
    'warm-sunrise': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'pink-romance': 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
    'forest-nature': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'deep-sea': 'linear-gradient(135deg, #0ea5e9 0%, #1e40af 100%)',
    'noble-violet': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    'minimal-black-white': 'linear-gradient(135deg, #000000 0%, #ffffff 100%)',
    'vibrant-lemon': 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
    'dream-rainbow': 'linear-gradient(135deg, #ef4444 0%, #eab308 25%, #10b981 50%, #3b82f6 75%, #8b5cf6 100%)',
    'carnival-circus': 'linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%)',
  }
  return gradients[theme] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}

function getThemeGlow(theme: string): string {
  const glows: Record<string, string> = {
    'light': 'rgba(14, 165, 233, 0.3)',
    'dark': 'rgba(168, 85, 247, 0.4)',
    'cyber-blue-purple': 'rgba(139, 92, 246, 0.4)',
    'warm-sunrise': 'rgba(245, 158, 11, 0.4)',
    'pink-romance': 'rgba(236, 72, 153, 0.4)',
    'forest-nature': 'rgba(16, 185, 129, 0.4)',
    'deep-sea': 'rgba(14, 165, 233, 0.4)',
    'noble-violet': 'rgba(139, 92, 246, 0.5)',
    'minimal-black-white': 'rgba(0, 0, 0, 0.3)',
    'vibrant-lemon': 'rgba(234, 179, 8, 0.4)',
    'dream-rainbow': 'rgba(239, 68, 68, 0.4)',
    'carnival-circus': 'rgba(245, 158, 11, 0.4)',
  }
  return glows[theme] || 'rgba(14, 165, 233, 0.3)'
}

function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    'classic': '经典',
    'modern': '现代',
    'nature': '自然',
    'playful': '活泼',
    'elegant': '优雅',
  }
  return categoryNames[category] || category
}