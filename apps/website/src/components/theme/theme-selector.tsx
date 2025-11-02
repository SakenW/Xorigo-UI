'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Button,
  Card,
  Input,
  Badge,
  Spinner,
  Surface
} from '@xorigo-ui/core'
import {
  themeUtils,
  recipeRegistry,
  type ThemeSearchResult,
  type ThemeSearchFilter
} from '@xorigo-ui/core'

// 主题分类
const THEME_CATEGORIES = [
  { id: 'all', name: '全部主题', description: '查看所有20个主题配方' },
  { id: 'corporate', name: '企业系列', description: '专业商务应用主题' },
  { id: 'minimal', name: '极简系列', description: '简洁现代设计风格' },
  { id: 'tech', name: '科技系列', description: '现代科技感主题' },
  { id: 'creative', name: '创意系列', description: '富有创意的设计风格' },
  { id: 'nature', name: '自然风光', description: '自然色彩主题' },
  { id: 'festival', name: '节日庆典', description: '欢快节日氛围主题' },
  { id: 'accessibility', name: '可访问性', description: '高对比无障碍主题' }
] as const

// 完整的20个主题数据
const ALL_THEMES = [
  // 企业系列
  {
    id: 'corporate-blue',
    name: '企业蓝',
    category: 'corporate',
    description: '专业企业级蓝色主题，适用于SaaS控制台',
    recipeId: 'light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow',
    colors: { primary: '#3b82f6', accent: '#06b6d4', background: '#ffffff' },
    tags: ['企业', '专业', '蓝色'],
    isNew: false,
    isPopular: true
  },
  {
    id: 'corporate-navy-dark',
    name: '企业深蓝',
    category: 'corporate',
    description: '企业深色配方，适用于正式商业环境',
    recipeId: 'dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow',
    colors: { primary: '#1e3a8a', accent: '#0c4a6e', background: '#0f172a' },
    tags: ['企业', '深色', '专业'],
    isNew: false,
    isPopular: true
  },

  // 极简系列
  {
    id: 'minimal-white',
    name: '极简白',
    category: 'minimal',
    description: '极简白色配方，专注内容展示',
    recipeId: 'light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat',
    colors: { primary: '#6b7280', accent: '#9ca3af', background: '#ffffff' },
    tags: ['极简', '白色', '内容'],
    isNew: false,
    isPopular: true
  },
  {
    id: 'minimal-graphite-dark',
    name: '极简石墨',
    category: 'minimal',
    description: '极简深色配方，石墨风格设计',
    recipeId: 'dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat',
    colors: { primary: '#374151', accent: '#6b7280', background: '#111827' },
    tags: ['极简', '深色', '石墨'],
    isNew: false,
    isPopular: false
  },
  {
    id: 'minimal-black-white',
    name: '极简黑白',
    category: 'minimal',
    description: '极致简约的黑白主题，回归设计的本质',
    recipeId: 'light.neutral-true-mid.mono(gray).calm.spacious.minimal.flat',
    colors: { primary: '#000000', accent: '#666666', background: '#ffffff' },
    tags: ['极简', '黑白', '经典'],
    isNew: true,
    isPopular: true
  },

  // 科技系列
  {
    id: 'tech-cyan',
    name: '科技青',
    category: 'tech',
    description: '科技青色配方，现代科技感设计',
    recipeId: 'light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow',
    colors: { primary: '#06b6d4', accent: '#0891b2', background: '#ffffff' },
    tags: ['科技', '青色', '现代'],
    isNew: false,
    isPopular: true
  },
  {
    id: 'tech-neon-dark',
    name: '科技霓虹',
    category: 'tech',
    description: '科技霓虹深色配方，未来感十足',
    recipeId: 'dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon',
    colors: { primary: '#0ea5e9', accent: '#d946ef', background: '#0f172a' },
    tags: ['科技', '霓虹', '未来'],
    isNew: true,
    isPopular: true
  },
  {
    id: 'cyber-blue-purple',
    name: '赛博蓝紫',
    category: 'tech',
    description: '经典赛博朋克风格，蓝紫渐变充满科技感',
    recipeId: 'dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass',
    colors: { primary: '#3b82f6', accent: '#8b5cf6', background: '#0f172a' },
    tags: ['赛博', '蓝紫', '科技'],
    isNew: true,
    isPopular: false
  },

  // 创意系列
  {
    id: 'creative-purple',
    name: '创意紫',
    category: 'creative',
    description: '创意紫色配方，激发创造力',
    recipeId: 'light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring',
    colors: { primary: '#8b5cf6', accent: '#a78bfa', background: '#ffffff' },
    tags: ['创意', '紫色', '设计'],
    isNew: false,
    isPopular: false
  },
  {
    id: 'creative-aurora-dark',
    name: '创意极光',
    category: 'creative',
    description: '创意极光深色配方，梦幻效果',
    recipeId: 'dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass',
    colors: { primary: '#8b5cf6', accent: '#c084fc', background: '#0f172a' },
    tags: ['创意', '极光', '梦幻'],
    isNew: false,
    isPopular: false
  },
  {
    id: 'royal-violet',
    name: '高贵紫罗兰',
    category: 'creative',
    description: '高贵典雅的紫色主题，皇室般的奢华',
    recipeId: 'dark.neutral-cool-high.mono(purple).vivid.comfortable.standard.glass',
    colors: { primary: '#7c3aed', accent: '#8b5cf6', background: '#0f172a' },
    tags: ['高贵', '紫色', '奢华'],
    isNew: true,
    isPopular: false
  },

  // 自然风光
  {
    id: 'deep-ocean',
    name: '深海探索',
    category: 'nature',
    description: '神秘深邃的蓝色主题，探索深海的静谧',
    recipeId: 'dark.neutral-cool-high.mono(blue).standard.comfortable.minimal.elevated',
    colors: { primary: '#1e40af', accent: '#3b82f6', background: '#0f172a' },
    tags: ['海洋', '深邃', '自然'],
    isNew: true,
    isPopular: true
  },
  {
    id: 'forest-nature',
    name: '自然森林',
    category: 'nature',
    description: '清新自然的绿色主题，呼吸森林的空气',
    recipeId: 'light.neutral-true-mid.analog(green).standard.comfortable.standard.soft-shadow',
    colors: { primary: '#059669', accent: '#10b981', background: '#ffffff' },
    tags: ['森林', '自然', '绿色'],
    isNew: true,
    isPopular: false
  },

  // 温暖活力
  {
    id: 'warm-sunrise',
    name: '温暖晨曦',
    category: 'nature',
    description: '温馨活力的橙色主题，如清晨的第一缕阳光',
    recipeId: 'light.neutral-warm-high.analog(orange).vibrant.comfortable.standard.soft-shadow',
    colors: { primary: '#f97316', accent: '#fb923c', background: '#ffffff' },
    tags: ['温暖', '晨曦', '橙色'],
    isNew: true,
    isPopular: true
  },
  {
    id: 'vibrant-lemon',
    name: '活力柠檬',
    category: 'nature',
    description: '明亮活泼的黄色主题，充满青春活力',
    recipeId: 'light.neutral-warm-mid.analog(yellow).vibrant.comfortable.expressive.soft-shadow',
    colors: { primary: '#eab308', accent: '#facc15', background: '#ffffff' },
    tags: ['活力', '黄色', '青春'],
    isNew: true,
    isPopular: false
  },

  // 浪漫梦幻
  {
    id: 'pink-romance',
    name: '粉彩浪漫',
    category: 'festival',
    description: '温柔浪漫的粉色主题，充满少女心',
    recipeId: 'light.neutral-warm-mid.analog(pink).soft.spacious.standard.soft-shadow',
    colors: { primary: '#ec4899', accent: '#f472b6', background: '#ffffff' },
    tags: ['浪漫', '粉色', '温柔'],
    isNew: true,
    isPopular: false
  },
  {
    id: 'dreamy-rainbow',
    name: '梦幻彩虹',
    category: 'festival',
    description: '缤纷多彩的彩虹主题，如梦如幻',
    recipeId: 'light.neutral-true-mid.triadic(red,green,blue).vivid.spacious.expressive.glass',
    colors: { primary: '#ef4444', accent: '#22c55e', background: '#ffffff' },
    tags: ['彩虹', '梦幻', '缤纷'],
    isNew: true,
    isPopular: true
  },
  {
    id: 'carnival-circus',
    name: '嘉年华马戏团',
    category: 'festival',
    description: '欢快热烈的三色主题，充满节日气氛的嘉年华',
    recipeId: 'light.neutral-warm-mid.triadic(red,yellow,blue).vibrant.comfortable.expressive.elevated',
    colors: { primary: '#ef4444', accent: '#eab308', background: '#ffffff' },
    tags: ['嘉年华', '马戏团', '节日'],
    isNew: true,
    isPopular: false
  },

  // 经典和可访问性
  {
    id: 'classic-neutral',
    name: '经典中性',
    category: 'corporate',
    description: '经典中性配方，永不过时的设计',
    recipeId: 'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow',
    colors: { primary: '#6b7280', accent: '#9ca3af', background: '#ffffff' },
    tags: ['经典', '中性', '永不过时'],
    isNew: false,
    isPopular: false
  },
  {
    id: 'high-contrast-pro',
    name: '高对比专业',
    category: 'accessibility',
    description: '高对比专业配方，满足WCAG AAA标准',
    recipeId: 'hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat',
    colors: { primary: '#1e40af', accent: '#1d4ed8', background: '#ffffff' },
    tags: ['高对比', '可访问性', 'WCAG'],
    isNew: false,
    isPopular: false
  }
] as const

interface ThemeSelectorProps {
  selectedTheme?: string
  onThemeSelect?: (themeId: string, theme: typeof ALL_THEMES[0]) => void
  onThemePreview?: (themeId: string, theme: typeof ALL_THEMES[0]) => void
  maxItems?: number
  showSearch?: boolean
  showCategories?: boolean
}

export function ThemeSelector({
  selectedTheme,
  onThemeSelect,
  onThemePreview,
  maxItems = 20,
  showSearch = true,
  showCategories = true
}: ThemeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)

  // 过滤主题
  const filteredThemes = useMemo(() => {
    let themes = ALL_THEMES

    // 分类过滤
    if (selectedCategory !== 'all') {
      themes = themes.filter(theme => theme.category === selectedCategory)
    }

    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      themes = themes.filter(theme =>
        theme.name.toLowerCase().includes(query) ||
        theme.description.toLowerCase().includes(query) ||
        theme.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return themes.slice(0, maxItems)
  }, [searchQuery, selectedCategory, maxItems])

  // 应用主题
  const handleThemeApply = async (themeId: string, theme: typeof ALL_THEMES[0]) => {
    setIsLoading(true)
    try {
      await themeUtils.applyTheme(theme.recipeId)
      onThemeSelect?.(themeId, theme)
    } catch (error) {
      console.error('应用主题失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 预览主题
  const handleThemePreview = (themeId: string, theme: typeof ALL_THEMES[0]) => {
    setPreviewTheme(themeId)
    onThemePreview?.(themeId, theme)
  }

  // 停止预览
  const handleStopPreview = () => {
    setPreviewTheme(null)
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* 标题区域 */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          🎨 主题选择器
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          从20个精心设计的主题配方中选择，涵盖企业、极简、科技、创意等多种风格
        </p>
      </motion.div>

      {/* 搜索和筛选区域 */}
      <AnimatePresence>
        {(showSearch || showCategories) && (
          <motion.div
            className="mb-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* 搜索框 */}
            {showSearch && (
              <div className="max-w-md mx-auto">
                <Input
                  placeholder="搜索主题名称、描述或标签..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
            )}

            {/* 分类筛选 */}
            {showCategories && (
              <div className="flex flex-wrap gap-2 justify-center">
                {THEME_CATEGORIES.map(category => (
                  <motion.button
                    key={category.id}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'ring-2 ring-offset-2'
                        : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category.id
                        ? 'var(--color-primary-500)'
                        : 'var(--color-surface-secondary)',
                      color: selectedCategory === category.id
                        ? 'white'
                        : 'var(--color-text-primary)',
                      borderColor: 'var(--color-border-default)',
                      ringColor: selectedCategory === category.id
                        ? 'var(--color-primary-300)'
                        : 'transparent'
                    }}
                    onClick={() => setSelectedCategory(category.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={category.description}
                  >
                    {category.name}
                    <span className="ml-1 opacity-70">
                      ({ALL_THEMES.filter(t => category.id === 'all' ? true : t.category === category.id).length})
                    </span>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 预览提示 */}
      <AnimatePresence>
        {previewTheme && (
          <motion.div
            className="mb-6 p-4 rounded-lg border-2 border-dashed"
            style={{
              backgroundColor: 'var(--color-surface-tertiary)',
              borderColor: 'var(--color-primary-300)'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary-500)' }} />
                <span style={{ color: 'var(--color-text-primary)' }}>
                  正在预览主题: <strong>{ALL_THEMES.find(t => t.id === previewTheme)?.name}</strong>
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStopPreview}
              >
                停止预览
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主题网格 */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AnimatePresence>
          {filteredThemes.map((theme, index) => (
            <motion.div
              key={theme.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                layout: { duration: 0.3 }
              }}
              whileHover={{ y: -5 }}
            >
              <Card
                className={`h-full cursor-pointer transition-all duration-200 ${
                  selectedTheme === theme.id ? 'ring-2 ring-offset-2' : ''
                } ${previewTheme === theme.id ? 'ring-2 ring-dashed' : ''}`}
                style={{
                  borderColor: selectedTheme === theme.id
                    ? 'var(--color-primary-400)'
                    : previewTheme === theme.id
                    ? 'var(--color-primary-300)'
                    : 'var(--color-border-default)',
                  ringColor: selectedTheme === theme.id
                    ? 'var(--color-primary-400)'
                    : 'transparent'
                }}
                onClick={() => handleThemePreview(theme.id, theme)}
              >
                {/* 主题预览色卡 */}
                <div className="flex h-24 mb-4 rounded-t-lg overflow-hidden">
                  <div
                    className="flex-1"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div
                    className="flex-1"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                  <div
                    className="flex-1"
                    style={{ backgroundColor: theme.colors.background }}
                  />
                </div>

                {/* 主题信息 */}
                <div className="p-4 space-y-3">
                  {/* 标题和标签 */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--color-text-primary)' }}>
                        {theme.name}
                        {theme.isNew && (
                          <Badge variant="accent" size="sm" className="ml-2">
                            新
                          </Badge>
                        )}
                        {theme.isPopular && (
                          <Badge variant="primary" size="sm" className="ml-1">
                            热门
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                        {theme.description}
                      </p>
                    </div>
                  </div>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1">
                    {theme.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: 'var(--color-surface-tertiary)',
                          color: 'var(--color-text-tertiary)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleThemePreview(theme.id, theme)
                      }}
                    >
                      预览
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={isLoading && selectedTheme === theme.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleThemeApply(theme.id, theme)
                      }}
                    >
                      {isLoading && selectedTheme === theme.id ? (
                        <>
                          <Spinner size="sm" className="mr-1" />
                          应用中
                        </>
                      ) : (
                        '应用'
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 空状态 */}
      {filteredThemes.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            没有找到匹配的主题
          </h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            尝试调整搜索关键词或选择不同的分类
          </p>
        </motion.div>
      )}

      {/* 统计信息 */}
      <motion.div
        className="mt-12 text-center text-sm"
        style={{ color: 'var(--color-text-tertiary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        显示 {filteredThemes.length} / {ALL_THEMES.length} 个主题配方
      </motion.div>
    </div>
  )
}

export default ThemeSelector