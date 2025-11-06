'use client'

/**
 * @fileoverview ThemeBridge 主题桥接组件
 * @description 纯UI组件，负责主题切换时的桥接逻辑和状态管理
 *
 * 核心职责：
 * 1. 提供主题切换的UI逻辑
 * 2. 管理主题状态和本地存储
 * 3. 处理主题切换动画和过渡效果
 * 4. 提供主题上下文和Hook
 *
 * 设计原则：
 * - 单一职责：仅处理UI逻辑，映射逻辑委托给theme-mapping模块
 * - 组件化：可组合使用，支持受控和非受控模式
 * - 类型安全：完整的TypeScript类型支持
 * - 可访问性：支持键盘导航和屏幕阅读器
 *
 * @author Xorigo UI Team
 * @version 2.0.0
 */

import React, { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from 'react'

import {
  mapRecipeToSystem,
  mapSystemToRecipe,
  isValidRecipeId,
  isValidSystemTheme,
  getRecipeInfo,
  type RecipeId,
  type SystemThemeId,
  type ThemeRecipe
} from '../../theme'

// ============================================================================
// 类型定义
// ============================================================================

/** 主题桥接器配置选项 */
export interface ThemeBridgeOptions {
  /** 当前主题配方ID */
  recipeId?: RecipeId
  /** 默认主题配方ID */
  defaultRecipeId?: RecipeId
  /** 主题切换动画持续时间（毫秒） */
  transitionDuration?: number
  /** 是否启用本地存储 */
  enableLocalStorage?: boolean
  /** 本地存储的key */
  storageKey?: string
  /** 主题切换回调函数 */
  onThemeChange?: (recipeId: RecipeId, systemTheme: SystemThemeId, recipe?: ThemeRecipe) => void
  /** 验证主题配方ID的自定义函数 */
  validateRecipeId?: (recipeId: string) => boolean
}

/** 主题桥接器上下文值 */
export interface ThemeBridgeContextValue {
  /** 当前主题配方ID */
  recipeId: RecipeId
  /** 当前system主题ID */
  systemTheme: SystemThemeId
  /** 当前主题配方信息 */
  recipe: ThemeRecipe | undefined
  /** 切换到指定主题配方 */
  setRecipe: (recipeId: RecipeId) => void
  /** 切换到指定system主题 */
  setSystemTheme: (systemTheme: SystemThemeId) => void
  /** 重置到默认主题 */
  resetTheme: () => void
  /** 切换主题模式（如果支持） */
  toggleMode?: () => void
  /** 是否正在切换主题 */
  isTransitioning: boolean
}

/** 主题桥接器属性 */
export interface ThemeBridgeProps extends ThemeBridgeOptions {
  /** 子组件 */
  children: ReactNode
  /** 自定义主题切换动画 */
  transitionAnimation?: React.ComponentProps<typeof motion.div>['variants']
}

// ============================================================================
// 默认配置
// ============================================================================

const DEFAULT_CONFIG: Required<Omit<ThemeBridgeOptions, 'recipeId' | 'onThemeChange' | 'validateRecipeId'>> = {
  defaultRecipeId: 'corporate-blue',
  transitionDuration: 300,
  enableLocalStorage: true,
  storageKey: 'xorigo-theme-recipe'
}

// ============================================================================
// 主题上下文
// ============================================================================

const ThemeBridgeContext = createContext<ThemeBridgeContextValue | null>(null)

/**
 * 使用主题桥接器Hook
 *
 * @throws 如果不在ThemeBridge组件内使用，会抛出错误
 *
 * @example
 * ```typescript
 * const { recipeId, setRecipe, recipe, isTransitioning } = useThemeBridge()
 * ```
 */
export function useThemeBridge(): ThemeBridgeContextValue {
  const context = useContext(ThemeBridgeContext)
  if (!context) {
    throw new Error('useThemeBridge must be used within a ThemeBridge provider')
  }
  return context
}

// ============================================================================
// 默认动画配置
// ============================================================================

const DEFAULT_ANIMATION_VARIANTS = {
  enter: {
    opacity: 0,
    scale: 0.95
  },
  center: {
    opacity: 1,
    scale: 1
  },
  exit: {
    opacity: 0,
    scale: 1.05
  }
}

// ============================================================================
// ThemeBridge 组件
// ============================================================================

/**
 * 主题桥接器组件
 *
 * 提供主题切换的UI逻辑和状态管理，支持受控和非受控模式。
 * 内部使用theme-mapping模块处理主题配方到system主题的转换。
 *
 * @example
 * ```typescript
 * // 基础使用
 * <ThemeBridge>
 *   <App />
 * </ThemeBridge>
 *
 * // 自定义配置
 * <ThemeBridge
 *   defaultRecipeId="tech-cyan"
 *   onThemeChange={(recipeId, systemTheme, recipe) => {
 *     console.log('Theme changed:', { recipeId, systemTheme, recipe })
 *   }}
 * >
 *   <App />
 * </ThemeBridge>
 *
 * // 受控模式
 * <ThemeBridge recipeId={controlledRecipeId}>
 *   <App />
 * </ThemeBridge>
 * ```
 */
export function ThemeBridge({
  children,
  recipeId: controlledRecipeId,
  defaultRecipeId = DEFAULT_CONFIG.defaultRecipeId,
  transitionDuration = DEFAULT_CONFIG.transitionDuration,
  enableLocalStorage = DEFAULT_CONFIG.enableLocalStorage,
  storageKey = DEFAULT_CONFIG.storageKey,
  onThemeChange,
  validateRecipeId = isValidRecipeId,
  transitionAnimation = DEFAULT_ANIMATION_VARIANTS
}: ThemeBridgeProps): ReactNode {
  // 状态管理
  const [internalRecipeId, setInternalRecipeId] = useState<RecipeId>(() => {
    // 优先级：受控值 > 本地存储 > 默认值
    if (controlledRecipeId) return controlledRecipeId

    if (enableLocalStorage && typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored && validateRecipeId(stored)) {
        return stored as RecipeId
      }
    }

    return defaultRecipeId
  })

  const [isTransitioning, setIsTransitioning] = useState(false)

  // 计算当前主题（受控模式使用外部值，否则使用内部状态）
  const currentRecipeId = controlledRecipeId ?? internalRecipeId
  const currentSystemTheme = mapRecipeToSystem(currentRecipeId)
  const currentRecipe = getRecipeInfo(currentRecipeId)

  // 本地存储同步
  useEffect(() => {
    if (enableLocalStorage && !controlledRecipeId && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, currentRecipeId)
    }
  }, [currentRecipeId, controlledRecipeId, enableLocalStorage, storageKey])

  // 验证主题有效性
  useEffect(() => {
    if (!validateRecipeId(currentRecipeId)) {
      console.warn(`Invalid recipe ID: ${currentRecipeId}, falling back to default`)
      if (!controlledRecipeId) {
        setInternalRecipeId(defaultRecipeId)
      }
    }
  }, [currentRecipeId, controlledRecipeId, defaultRecipeId, validateRecipeId])

  // 主题切换函数
  const setRecipe = useCallback((newRecipeId: RecipeId) => {
    if (!validateRecipeId(newRecipeId)) {
      console.error(`Invalid recipe ID: ${newRecipeId}`)
      return
    }

    // 如果是受控模式，只触发回调
    if (controlledRecipeId) {
      onThemeChange?.(newRecipeId, mapRecipeToSystem(newRecipeId), getRecipeInfo(newRecipeId))
      return
    }

    // 非受控模式，更新内部状态
    setIsTransitioning(true)
    setInternalRecipeId(newRecipeId)

    // 动画完成后重置过渡状态
    setTimeout(() => {
      setIsTransitioning(false)
    }, transitionDuration)

    onThemeChange?.(newRecipeId, mapRecipeToSystem(newRecipeId), getRecipeInfo(newRecipeId))
  }, [controlledRecipeId, validateRecipeId, onThemeChange, transitionDuration])

  const setSystemTheme = useCallback((systemTheme: SystemThemeId) => {
    if (!isValidSystemTheme(systemTheme)) {
      console.error(`Invalid system theme: ${systemTheme}`)
      return
    }

    const recipeId = mapSystemToRecipe(systemTheme)
    setRecipe(recipeId)
  }, [setRecipe])

  const resetTheme = useCallback(() => {
    setRecipe(defaultRecipeId)
  }, [setRecipe, defaultRecipeId])

  const toggleMode = useCallback(() => {
    // 简单的模式切换逻辑（如果当前主题支持亮/暗模式）
    const recipe = currentRecipe
    if (recipe?.recipeId) {
      const newRecipeId = recipe.recipeId.startsWith('dark')
        ? recipe.recipeId.replace('dark', 'light')
        : recipe.recipeId.replace('light', 'dark')

      // 尝试找到对应的主题配方
      const newRecipe = getRecipeInfo(currentRecipeId.replace(/^(dark|light)/, newRecipeId.startsWith('dark') ? 'dark' : 'light'))
      if (newRecipe) {
        setRecipe(newRecipe.id)
      }
    }
  }, [currentRecipe, currentRecipeId, setRecipe])

  // 构建上下文值
  const contextValue: ThemeBridgeContextValue = {
    recipeId: currentRecipeId,
    systemTheme: currentSystemTheme,
    recipe: currentRecipe,
    setRecipe,
    setSystemTheme,
    resetTheme,
    toggleMode,
    isTransitioning
  }

  return (
    <ThemeBridgeContext.Provider value={contextValue}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRecipeId}
          variants={transitionAnimation}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: transitionDuration / 1000 }}
          style={{ width: '100%', height: '100%' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ThemeBridgeContext.Provider>
  )
}

// ============================================================================
// 主题桥接器工具组件
// ============================================================================

/**
 * 主题切换按钮组件
 * 简化的主题切换UI，快速使用
 */
export function ThemeToggleButton({
  className,
  variant = 'outline',
  size = 'sm',
  children = '切换主题',
  ...props
}: {
  className?: string
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
  [key: string]: any
}): ReactNode {
  const { setRecipe, recipeId, isTransitioning } = useThemeBridge()

  const handleToggle = () => {
    // 简单的主题切换逻辑 - 循环切换几个热门主题
    const popularThemes = ['corporate-blue', 'tech-cyan', 'minimal-white', 'cyber-blue-purple']
    const currentIndex = popularThemes.indexOf(recipeId)
    const nextIndex = (currentIndex + 1) % popularThemes.length
    setRecipe(popularThemes[nextIndex] as RecipeId)
  }

  return (
    <button
      className={className}
      disabled={isTransitioning}
      onClick={handleToggle}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * 主题选择器组件
 * 提供主题选择下拉菜单
 */
export function ThemeSelector({
  className,
  recipes,
  ...props
}: {
  className?: string
  recipes?: ThemeRecipe[]
  [key: string]: any
}): ReactNode {
  const { setRecipe, recipeId } = useThemeBridge()

  // Note: getAvailableRecipes is not available in bundled version
  // Users should pass recipes prop directly
  const availableRecipes = recipes || []

  return (
    <select
      className={className}
      value={recipeId}
      onChange={(e) => setRecipe(e.target.value as RecipeId)}
      {...props}
    >
      {availableRecipes.map(recipe => (
        <option key={recipe.id} value={recipe.id}>
          {recipe.name}
        </option>
      ))}
    </select>
  )
}

// ============================================================================
// 导出默认配置（用于自定义）
// ============================================================================

export { DEFAULT_CONFIG }