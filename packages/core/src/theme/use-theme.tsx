'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { UNIFIED_THEME_RECIPES, getUnifiedThemeById } from '../system-tools/unified-theme-recipes'
import type { UnifiedThemeRecipe } from '../system-tools/unified-theme-recipes'

// ============================================================================
// 主题状态类型定义
// ============================================================================

export interface SevenAxisTheme {
  mode: 'light' | 'dark' | 'auto'
  colors: {
    primary: string
    accent: string
    background: string
    text?: string
    border?: string
    surface?: string
  }
  recipe: UnifiedThemeRecipe | null
  isTransitioning: boolean
  isLoading: boolean
  error: string | null
}

export interface SevenAxisThemeContextValue {
  theme: SevenAxisTheme
  currentRecipeId: string | null
  setTheme: (theme: Partial<SevenAxisTheme>) => void
  applyRecipe: (recipeId: string) => Promise<boolean>
  resetTheme: () => Promise<void>
  toggleMode: () => Promise<void>
  setMode: (mode: 'light' | 'dark' | 'auto') => Promise<void>
  isDarkMode: boolean
  isSystemDark: boolean
}

export interface SevenAxisThemeProviderProps {
  children: React.ReactNode
  defaultRecipeId?: string
  enableAutoMode?: boolean
  enableTransitions?: boolean
  transitionDuration?: number
  persistToStorage?: boolean
  storageKey?: string
  onThemeChange?: (theme: SevenAxisTheme, recipe: UnifiedThemeRecipe | null) => void
  onRecipeApply?: (recipeId: string, success: boolean) => void
  onError?: (error: string) => void
}

// ============================================================================
// 主题Context
// ============================================================================

const ThemeContext = React.createContext<SevenAxisThemeContextValue | null>(null)

// ============================================================================
// 系统主题检测
// ============================================================================

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// ============================================================================
// CSS变量管理
// ============================================================================

const applyThemeToCSS = (theme: SevenAxisTheme, recipe: UnifiedThemeRecipe | null) => {
  const root = document.documentElement

  // 应用模式
  if (theme.mode === 'auto') {
    const systemMode = getSystemTheme()
    root.setAttribute('data-mode', systemMode)
  } else {
    root.setAttribute('data-mode', theme.mode)
  }

  // 应用基础颜色
  if (theme.colors) {
    root.style.setProperty('--xorigo-primary', theme.colors.primary)
    root.style.setProperty('--xorigo-accent', theme.colors.accent)
    root.style.setProperty('--xorigo-background', theme.colors.background)

    if (theme.colors.text) {
      root.style.setProperty('--xorigo-text-primary', theme.colors.text)
      root.style.setProperty('--xorigo-text-secondary', theme.colors.text)
    }

    if (theme.colors.border) {
      root.style.setProperty('--xorigo-border', theme.colors.border)
    }

    if (theme.colors.surface) {
      root.style.setProperty('--xorigo-surface', theme.colors.surface)
    }
  }

  // 应用配方特定的CSS变量
  if (recipe) {
    root.style.setProperty('--xorigo-recipe-id', recipe.id)
    root.style.setProperty('--xorigo-recipe-name', recipe.name)
    root.style.setProperty('--xorigo-recipe-category', recipe.category)

    // 应用配方ID（用于更复杂的主题逻辑）
    root.setAttribute('data-theme-recipe', recipe.recipeId)

    // 解析recipeId并应用七轴参数
    const recipeParts = recipe.recipeId.split('.')
    if (recipeParts.length >= 1) {
      // Mode轴
      if (recipeParts[0]) {
        root.setAttribute('data-seven-axis-mode', recipeParts[0])
      }

      // Base轴
      if (recipeParts[1]) {
        root.setAttribute('data-seven-axis-base', recipeParts[1])
      }

      // 其他轴参数可以根据需要扩展
      if (recipeParts[2]) {
        root.setAttribute('data-seven-axis-accent', recipeParts[2])
      }
    }
  }
}

// ============================================================================
// 主题提供者组件
// ============================================================================

export const SevenAxisThemeProvider: React.FC<SevenAxisThemeProviderProps> = ({
  children,
  defaultRecipeId = 'corporate-blue',
  enableAutoMode = true,
  enableTransitions = true,
  transitionDuration = 300,
  persistToStorage = true,
  storageKey = 'xorigo-theme',
  onThemeChange,
  onRecipeApply,
  onError
}) => {
  const [theme, setThemeState] = useState<SevenAxisTheme>(() => {
    const defaultRecipe = getUnifiedThemeById(defaultRecipeId)
    const systemMode = enableAutoMode ? getSystemTheme() : 'light'

    return {
      mode: systemMode,
      colors: defaultRecipe ? {
        primary: defaultRecipe.colors.primary,
        accent: defaultRecipe.colors.accent,
        background: defaultRecipe.colors.background
      } : {
        primary: '#3b82f6',
        accent: '#06b6d4',
        background: '#ffffff'
      },
      recipe: defaultRecipe,
      isTransitioning: false,
      isLoading: false,
      error: null
    }
  })

  const [currentRecipeId, setCurrentRecipeId] = useState<string | null>(defaultRecipeId)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 获取当前暗色模式状态
  const isDarkMode = useMemo(() => {
    if (theme.mode === 'auto') {
      return getSystemTheme() === 'dark'
    }
    return theme.mode === 'dark'
  }, [theme.mode])

  const isSystemDark = useMemo(() => getSystemTheme() === 'dark', [])

  // 系统主题变化监听
  useEffect(() => {
    if (!enableAutoMode) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      if (theme.mode === 'auto') {
        setThemeState(prev => ({ ...prev }))
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [enableAutoMode, theme.mode])

  // 从本地存储加载主题设置
  useEffect(() => {
    if (!persistToStorage) return

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)

        if (parsed.currentRecipeId) {
          setCurrentRecipeId(parsed.currentRecipeId)
        }

        if (parsed.mode) {
          setThemeState(prev => ({ ...prev, mode: parsed.mode }))
        }
      }
    } catch (error) {
      console.warn('加载主题设置失败:', error)
    }
  }, [persistToStorage, storageKey])

  // 保存主题设置到本地存储
  useEffect(() => {
    if (!persistToStorage) return

    try {
      const dataToSave = {
        currentRecipeId,
        mode: theme.mode
      }
      localStorage.setItem(storageKey, JSON.stringify(dataToSave))
    } catch (error) {
      console.warn('保存主题设置失败:', error)
    }
  }, [persistToStorage, storageKey, currentRecipeId, theme.mode])

  // 应用主题到DOM
  useEffect(() => {
    if (enableTransitions && isTransitioning) {
      // 添加过渡类
      document.documentElement.classList.add('theme-transitioning')
    } else {
      document.documentElement.classList.remove('theme-transitioning')
    }

    applyThemeToCSS(theme, theme.recipe)
  }, [theme, theme.recipe, enableTransitions, isTransitioning])

  // 设置主题的回调函数
  const setTheme = useCallback((updates: Partial<SevenAxisTheme>) => {
    setThemeState(prev => {
      const newTheme = { ...prev, ...updates }

      // 如果更新了recipe，同时更新颜色
      if (updates.recipe && updates.recipe.colors) {
        newTheme.colors = {
          ...newTheme.colors,
          ...updates.recipe.colors
        }
      }

      onThemeChange?.(newTheme, newTheme.recipe)
      return newTheme
    })
  }, [onThemeChange])

  // 应用主题配方
  const applyRecipe = useCallback(async (recipeId: string): Promise<boolean> => {
    const recipe = getUnifiedThemeById(recipeId)
    if (!recipe) {
      const error = `主题配方不存在: ${recipeId}`
      onError?.(error)
      return false
    }

    setIsTransitioning(true)

    try {
      // 模拟异步加载过程
      await new Promise(resolve => setTimeout(resolve, 50))

      setThemeState(prev => ({
        ...prev,
        recipe,
        colors: {
          primary: recipe.colors.primary,
          accent: recipe.colors.accent,
          background: recipe.colors.background,
          text: recipe.mode === 'dark' ? '#f3f4f6' : '#111827',
          border: recipe.mode === 'dark' ? '#374151' : '#e5e7eb',
          surface: recipe.mode === 'dark' ? '#1f2937' : '#ffffff'
        },
        isLoading: false,
        error: null
      }))

      setCurrentRecipeId(recipeId)
      onRecipeApply?.(recipeId, true)

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '应用主题失败'
      onError?.(errorMessage)
      setThemeState(prev => ({ ...prev, error: errorMessage, isLoading: false }))
      return false
    } finally {
      setIsTransitioning(false)
    }
  }, [onRecipeApply, onError])

  // 重置主题
  const resetTheme = useCallback(async (): Promise<void> => {
    const defaultRecipe = getUnifiedThemeById(defaultRecipeId)
    if (!defaultRecipe) return

    await applyRecipe(defaultRecipe.id)
  }, [defaultRecipeId, applyRecipe])

  // 设置主题模式
  const setMode = useCallback(async (mode: 'light' | 'dark' | 'auto'): Promise<void> => {
    setTheme({ mode })
  }, [setTheme])

  // 切换主题模式
  const toggleMode = useCallback(async (): Promise<void> => {
    const newMode = theme.mode === 'auto' ? 'light' :
                   theme.mode === 'light' ? 'dark' : 'auto'
    await setMode(newMode)
  }, [theme.mode, setMode])

  // 创建上下文值
  const contextValue: SevenAxisThemeContextValue = {
    theme,
    currentRecipeId,
    setTheme,
    applyRecipe,
    resetTheme,
    toggleMode,
    setMode,
    isDarkMode,
    isSystemDark
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// ============================================================================
// 主题Hook
// ============================================================================

export function useSevenAxisTheme(): SevenAxisThemeContextValue {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useSevenAxisTheme must be used within a SevenAxisThemeProvider')
  }
  return context
}

// ============================================================================
// 辅助Hook
// ============================================================================

/**
 * 使用主题模式的Hook
 */
export function useThemeMode() {
  const { theme, setMode, toggleMode } = useSevenAxisTheme()
  return {
    mode: theme.mode,
    setMode,
    toggleMode,
    isDark: theme.mode === 'dark' || (theme.mode === 'auto' && theme.colors.primary === '#1e293b'),
    isLight: theme.mode === 'light' || (theme.mode === 'auto' && theme.colors.primary !== '#1e293b')
  }
}

/**
 * 使用主题颜色的Hook
 */
export function useThemeColors() {
  const { theme } = useSevenAxisTheme()
  return {
    colors: theme.colors,
    primary: theme.colors.primary,
    accent: theme.colors.accent,
    background: theme.colors.background,
    text: theme.colors.text,
    border: theme.colors.border,
    surface: theme.colors.surface
  }
}

/**
 * 使用主题状态Hook
 */
export function useThemeStatus() {
  const { theme, isLoading, error, isTransitioning } = useSevenAxisTheme()
  return {
    isLoading,
    error,
    isTransitioning,
    hasRecipe: !!theme.recipe,
    recipeId: theme.recipe?.id || null,
    recipeName: theme.recipe?.name || null
  }
}

/**
 * 使用主题推荐Hook
 */
export function useThemeRecommendations() {
  const { theme, applyRecipe } = useSevenAxisTheme()

  const getRecommendations = useCallback(() => {
    // 基于当前主题推荐相似主题
    const currentRecipe = theme.recipe
    if (!currentRecipe) return []

    const recommendations = UNIFIED_THEME_RECIPES.filter(recipe => {
      // 推荐相同分类的其他主题
      if (recipe.category === currentRecipe.category && recipe.id !== currentRecipe.id) {
        return true
      }

      // 推荐具有相似标签的主题
      const hasCommonTag = recipe.tags.some(tag =>
        currentRecipe.tags.includes(tag)
      )

      return hasCommonTag
    })

    // 按优先级排序
    return recommendations
      .sort((a, b) => {
        // 热门主题优先
        if (a.isPopular && !b.isPopular) return -1
        if (!a.isPopular && b.isPopular) return 1

        // 新主题优先
        if (a.isNew && !b.isNew) return -1
        if (!a.isNew && b.isNew) return 1

        return 0
      })
      .slice(0, 3)
  }, [theme.recipe])

  const applyRecommendedTheme = useCallback(async (recipeId: string): Promise<boolean> => {
    return await applyRecipe(recipeId)
  }, [applyRecipe])

  return {
    recommendations: getRecommendations(),
    applyRecommendedTheme,
    hasRecommendations: getRecommendations().length > 0
  }
}

// ============================================================================
// 便捷组件
// ============================================================================

/**
 * 主题切换器组件
 */
export interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'compact' | 'full'
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = true,
  variant = 'default'
}) => {
  const { mode, setMode, toggleMode, isDarkMode, isSystemDark } = useThemeMode()

  const handleClick = () => {
    if (variant === 'full') {
      // 完整模式：light/dark/auto切换
      const modes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto']
      const currentIndex = modes.indexOf(mode)
      const nextMode = modes[(currentIndex + 1) % modes.length]
      setMode(nextMode)
    } else {
      // 简化模式：light/dark切换
      toggleMode()
    }
  }

  const modeLabels = {
    light: '浅色',
    dark: '深色',
    auto: '自动'
  }

  const modeIcons = {
    light: '☀️',
    dark: '🌙',
    auto: '💻'
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={className}
        title={modeLabels[mode]}
        aria-label={`切换主题模式，当前：${modeLabels[mode]}`}
      >
        {modeIcons[mode]}
      </button>
    )
  }

  return (
    <div className={`theme-toggle ${className}`}>
      {showLabel && (
        <span className="theme-toggle-label">
          {modeLabels[mode]}
        </span>
      )}
      <button
        onClick={handleClick}
        className="theme-toggle-button"
        aria-label={`切换主题模式，当前：${modeLabels[mode]}`}
      >
        <span className="theme-toggle-icon">{modeIcons[mode]}</span>
      </button>
    </div>
  )
}

/**
 * 主题状态指示器组件
 */
export const ThemeStatusIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isLoading, isTransitioning, error, recipeName } = useThemeStatus()
  const { isDarkMode } = useThemeMode()

  if (isLoading) {
    return (
      <div className={`theme-status theme-status--loading ${className}`}>
        <span className="theme-status-icon">⏳️</span>
        <span className="theme-status-text">加载主题中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`theme-status theme-status--error ${className}`}>
        <span className="theme-status-icon">⚠️</span>
        <span className="theme-status-text">主题加载失败</span>
      </div>
    )
  }

  if (isTransitioning) {
    return (
      <div className={`theme-status theme-status--transitioning ${className}`}>
        <span className="theme-status-icon">🔄</span>
        <span className="theme-status-text">切换主题中...</span>
      </div>
    )
  }

  return (
    <div className={`theme-status theme-status--${theme.mode === 'dark' ? 'dark' : 'light'} ${className}`}>
      <span className="theme-status-icon">{isDarkMode ? '🌙' : '☀️'}</span>
      <span className="theme-status-text">
        {recipeName || '默认主题'}
      </span>
    </div>
  )
}

// ============================================================================
// CSS类定义（可选，用于主题过渡动画）
// ============================================================================

export const themeTransitionStyles = `
.theme-transitioning * {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--xorigo-border, #e5e7eb);
  border-radius: 0.5rem;
  background: var(--xorigo-surface, #ffffff);
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background: var(--xorigo-accent, #06b6d4);
  color: white;
}

.theme-toggle-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.375rem;
  background: var(--xorigo-primary, #3b82f6);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle-button:hover {
  background: var(--xorigo-accent, #06b6d4);
}

.theme-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.theme-status--loading {
  background: #fef3c7;
  color: #92400e;
  border-color: #fde68a;
}

.theme-status--error {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.theme-status--transitioning {
  background: #e0f2fe;
  color: #0369a1;
  border-color: #bae6fd;
}

.theme-status--light {
  background: #f0fdf4;
  color: #166534;
  border-color: #bbf7d0;
}

.theme-status--dark {
  background: #1f2937;
  color: #f9fafb;
  border-color: #374151;
}
`