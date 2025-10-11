/**
 * 🎨 TH-UI 风格配方体系 - 风格配方提供者
 *
 * 基于 React 19 + TypeScript 的现代主题系统
 * 支持七轴风格配方、响应级别控制、轴锁等高级功能
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import type {
  StyleRecipe,
  StyleRecipeID,
  ParsedRecipe,
  ResponseLevel,
  AxisLockRule,
  RecipeValidationResult,
} from '../types'
import {
  StyleRecipeEngine,
  defaultRecipeEngine,
  parseRecipe,
  validateRecipeAccessibility,
} from '../engine'
import {
  officialRecipes,
  getRecipesByCategory,
  searchRecipes,
  getRecommendedRecipes,
} from '../recipes'

// ============================================================================
// 类型定义 (Type Definitions)
// ============================================================================

/**
 * 风格配方上下文类型
 */
export interface StyleRecipeContextType {
  // 当前配方状态
  currentRecipe: StyleRecipe | null
  currentRecipeID: StyleRecipeID
  parsedRecipe: ParsedRecipe | null
  isTransitioning: boolean

  // 配方管理
  setRecipe: (recipeID: StyleRecipeID) => Promise<boolean>
  setRecipeByCategory: (category: string) => Promise<boolean>
  setRandomRecipe: () => Promise<boolean>
  searchRecipes: (query: string) => StyleRecipe[]

  // 配方库
  availableRecipes: StyleRecipe[]
  categories: string[]
  recommendedRecipes: StyleRecipe[]
  recipesByCategory: Record<string, StyleRecipe[]>

  // 高级功能
  axisLocks: AxisLockRule[]
  applyAxisLock: (lock: AxisLockRule) => void
  clearAxisLocks: () => void

  // 响应级别控制
  responseLevel: ResponseLevel
  setResponseLevel: (level: ResponseLevel) => void

  // 可访问性
  validateCurrentRecipe: () => RecipeValidationResult
  accessibilityMode: 'strict' | 'standard' | 'relaxed'
  setAccessibilityMode: (mode: 'strict' | 'standard' | 'relaxed') => void

  // 引擎配置
  updateEngineConfig: (config: any) => void
}

// ============================================================================
// 上下文创建 (Context Creation)
// ============================================================================

const StyleRecipeContext = createContext<StyleRecipeContextType | undefined>(undefined)

// ============================================================================
// 风格配方提供者组件 (Style Recipe Provider Component)
// ============================================================================

/**
 * 风格配方提供者
 */
export function StyleRecipeProvider({
  children,
  defaultRecipe = 'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow',
  enableTransitions = true,
  transitionDuration = 400,
}: {
  children: ReactNode
  defaultRecipe?: StyleRecipeID
  enableTransitions?: boolean
  transitionDuration?: number
}) {
  // ============================================================================
  // 状态管理 (State Management)
  // ============================================================================

  const [currentRecipeID, setCurrentRecipeID] = useState<StyleRecipeID>(defaultRecipe)
  const [currentRecipe, setCurrentRecipe] = useState<StyleRecipe | null>(null)
  const [parsedRecipe, setParsedRecipe] = useState<ParsedRecipe | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [axisLocks, setAxisLocks] = useState<AxisLockRule[]>([])
  const [responseLevel, setResponseLevel] = useState<ResponseLevel>('L2')
  const [accessibilityMode, setAccessibilityMode] = useState<'strict' | 'standard' | 'relaxed'>('standard')

  // ============================================================================
  // 配方库 (Recipe Library)
  // ============================================================================

  const availableRecipes = useMemo(() => officialRecipes, [])
  const categories = useMemo(() =>
    Array.from(new Set(officialRecipes.map(recipe => recipe.category))),
    []
  )
  const recommendedRecipes = useMemo(() => getRecommendedRecipes(), [])
  const recipesByCategory = useMemo(() => {
    const grouped: Record<string, StyleRecipe[]> = {}
    officialRecipes.forEach(recipe => {
      if (!grouped[recipe.category]) {
        grouped[recipe.category] = []
      }
      grouped[recipe.category].push(recipe)
    })
    return grouped
  }, [])

  // ============================================================================
  // 配方解析与切换 (Recipe Parsing & Switching)
  // ============================================================================

  /**
   * 解析并应用配方
   */
  const parseAndApplyRecipe = useCallback(async (
    recipeID: StyleRecipeID,
    enableAnimation = true
  ): Promise<boolean> => {
    try {
      if (enableAnimation && enableTransitions) {
        setIsTransitioning(true)
        // 等待动画开始
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      // 解析配方
      const parsed = parseRecipe(recipeID, axisLocks)
      if (!parsed) {
        console.error(`Failed to parse recipe: ${recipeID}`)
        if (enableTransitions) setIsTransitioning(false)
        return false
      }

      // 验证可访问性
      const validation = validateRecipeAccessibility(parsed.recipe)
      if (!validation.isValid && accessibilityMode === 'strict') {
        console.error('Recipe failed accessibility validation:', validation.errors)
        if (enableTransitions) setIsTransitioning(false)
        return false
      }

      // 显示警告
      if (validation.warnings.length > 0) {
        console.warn('Recipe accessibility warnings:', validation.warnings)
      }

      // 更新状态
      setCurrentRecipeID(recipeID)
      setCurrentRecipe(parsed.recipe)
      setParsedRecipe(parsed)

      // 保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('th-ui-style-recipe', recipeID)
      }

      // 等待动画完成
      if (enableAnimation && enableTransitions) {
        await new Promise(resolve => setTimeout(resolve, transitionDuration))
        setIsTransitioning(false)
      }

      return true
    } catch (error) {
      console.error('Error applying recipe:', error)
      if (enableTransitions) setIsTransitioning(false)
      return false
    }
  }, [axisLocks, accessibilityMode, enableTransitions, transitionDuration])

  /**
   * 设置配方
   */
  const setRecipe = useCallback(async (recipeID: StyleRecipeID): Promise<boolean> => {
    return parseAndApplyRecipe(recipeID, true)
  }, [parseAndApplyRecipe])

  /**
   * 按类别设置配方
   */
  const setRecipeByCategory = useCallback(async (category: string): Promise<boolean> => {
    const categoryRecipes = getRecipesByCategory(category)
    if (categoryRecipes.length === 0) {
      console.warn(`No recipes found for category: ${category}`)
      return false
    }

    // 随机选择该类别中的一个配方
    const randomRecipe = categoryRecipes[Math.floor(Math.random() * categoryRecipes.length)]
    return setRecipe(randomRecipe.id)
  }, [setRecipe])

  /**
   * 设置随机配方
   */
  const setRandomRecipe = useCallback(async (): Promise<boolean> => {
    const randomRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)]
    return setRecipe(randomRecipe.id)
  }, [availableRecipes, setRecipe])

  /**
   * 搜索配方
   */
  const searchRecipesCallback = useCallback((query: string): StyleRecipe[] => {
    return searchRecipes(query)
  }, [])

  // ============================================================================
  // 轴锁管理 (Axis Lock Management)
  // ============================================================================

  /**
   * 应用轴锁
   */
  const applyAxisLock = useCallback((lock: AxisLockRule) => {
    setAxisLocks(prev => [...prev, lock])
  }, [])

  /**
   * 清除轴锁
   */
  const clearAxisLocks = useCallback(() => {
    setAxisLocks([])
  }, [])

  // ============================================================================
  // 可访问性验证 (Accessibility Validation)
  // ============================================================================

  /**
   * 验证当前配方
   */
  const validateCurrentRecipe = useCallback((): RecipeValidationResult => {
    if (!currentRecipe) {
      return {
        isValid: false,
        errors: ['No current recipe to validate'],
        warnings: [],
        accessibilityReport: {
          contrastScore: 0,
          cvdScore: 0,
          motionScore: 0,
        },
      }
    }

    return validateRecipeAccessibility(currentRecipe)
  }, [currentRecipe])

  /**
   * 更新引擎配置
   */
  const updateEngineConfig = useCallback((config: any) => {
    defaultRecipeEngine.updateConfig(config)
  }, [])

  // ============================================================================
  // 初始化与副作用 (Initialization & Side Effects)
  // ============================================================================

  useEffect(() => {
    setMounted(true)

    // 从 localStorage 读取保存的配方
    if (typeof window !== 'undefined') {
      const savedRecipe = localStorage.getItem('th-ui-style-recipe')
      const recipeToUse = savedRecipe || defaultRecipe
      parseAndApplyRecipe(recipeToUse as StyleRecipeID, false)
    } else {
      parseAndApplyRecipe(defaultRecipe, false)
    }
  }, [defaultRecipe, parseAndApplyRecipe])

  // ============================================================================
  // CSS 变量注入 (CSS Variables Injection)
  // ============================================================================

  const cssVariables = useMemo(() => {
    if (!parsedRecipe) {
      return {}
    }

    return {
      ...parsedRecipe.cssVariables,
      // 添加配方元数据变量
      '--th-recipe-id': parsedRecipe.recipe.id,
      '--th-recipe-name': parsedRecipe.recipe.name,
      '--th-recipe-category': parsedRecipe.recipe.category,
      '--th-response-level': responseLevel,
      '--th-accessibility-mode': accessibilityMode,
    }
  }, [parsedRecipe, responseLevel, accessibilityMode])

  // ============================================================================
  // 上下文值 (Context Value)
  // ============================================================================

  const contextValue: StyleRecipeContextType = useMemo(() => ({
    // 当前配方状态
    currentRecipe,
    currentRecipeID,
    parsedRecipe,
    isTransitioning,

    // 配方管理
    setRecipe,
    setRecipeByCategory,
    setRandomRecipe,
    searchRecipes: searchRecipesCallback,

    // 配方库
    availableRecipes,
    categories,
    recommendedRecipes,
    recipesByCategory,

    // 高级功能
    axisLocks,
    applyAxisLock,
    clearAxisLocks,

    // 响应级别控制
    responseLevel,
    setResponseLevel,

    // 可访问性
    validateCurrentRecipe,
    accessibilityMode,
    setAccessibilityMode,

    // 引擎配置
    updateEngineConfig,
  }), [
    currentRecipe,
    currentRecipeID,
    parsedRecipe,
    isTransitioning,
    setRecipe,
    setRecipeByCategory,
    setRandomRecipe,
    searchRecipesCallback,
    availableRecipes,
    categories,
    recommendedRecipes,
    recipesByCategory,
    axisLocks,
    applyAxisLock,
    clearAxisLocks,
    responseLevel,
    setResponseLevel,
    validateCurrentRecipe,
    accessibilityMode,
    setAccessibilityMode,
    updateEngineConfig,
  ])

  // ============================================================================
  // 渲染 (Rendering)
  // ============================================================================

  if (!mounted) {
    // 避免 SSR 不匹配
    return null
  }

  // 转场动画配置
  const transitionVariants = {
    initial: { opacity: 0, scale: 0.98, filter: 'blur(2px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.02, filter: 'blur(2px)' },
    transition: {
      duration: transitionDuration / 1000,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }

  return (
    <StyleRecipeContext.Provider value={contextValue}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRecipeID}
          {...(enableTransitions ? transitionVariants : {})}
          className="th-style-recipe-root"
          style={cssVariables as React.CSSProperties}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </StyleRecipeContext.Provider>
  )
}

// ============================================================================
// Hook (Hook)
// ============================================================================

/**
 * 使用风格配方
 */
export function useStyleRecipe(): StyleRecipeContextType {
  const context = useContext(StyleRecipeContext)
  if (context === undefined) {
    throw new Error('useStyleRecipe must be used within a StyleRecipeProvider')
  }
  return context
}

// ============================================================================
// 便捷 Hook (Convenience Hooks)
// ============================================================================

/**
 * 使用当前配方的 CSS 变量
 */
export function useStyleRecipeCSS() {
  const { parsedRecipe } = useStyleRecipe()
  return parsedRecipe?.cssVariables || {}
}

/**
 * 使用响应级别控制
 */
export function useResponseLevel(level?: ResponseLevel) {
  const { responseLevel: currentLevel, setResponseLevel } = useStyleRecipe()

  useEffect(() => {
    if (level && level !== currentLevel) {
      setResponseLevel(level)
    }
  }, [level, currentLevel, setResponseLevel])

  return currentLevel
}

/**
 * 使用轴锁
 */
export function useAxisLock(locks?: AxisLockRule[]) {
  const { axisLocks: currentLocks, applyAxisLock, clearAxisLocks } = useStyleRecipe()

  useEffect(() => {
    if (locks) {
      locks.forEach(lock => applyAxisLock(lock))
    }
  }, [locks, applyAxisLock])

  return {
    axisLocks: currentLocks,
    applyAxisLock,
    clearAxisLocks,
  }
}

// ============================================================================
// 导出 (Exports)
// ============================================================================

export type { StyleRecipeContextType }
export { StyleRecipeContext }