/**
 * 🎨 TH-UI DTCG 风格配方提供者
 *
 * 基于 DTCG 标准的现代主题系统
 * 读取 packages/thui-tokens/ 中的结构化令牌
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

import { browserDTCGRecipeEngine, generateBrowserCSSVariables } from '../engine/browser-dtcg-engine'
import { officialRecipes } from '../recipes/official-recipes'
import type {
  StyleRecipeID,
  ParsedRecipe,
  ResponseLevel,
  AxisLockRule,
  RecipeValidationResult,
  CoreTokens,
  RoleTokens,
  ComponentTokens,
} from '../types'

// ============================================================================
// 简化的配方接口 (Simplified Recipe Interface)
// ============================================================================

export interface DTCGStyleRecipe {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  accessibility: {
    cvdFriendly: boolean
    motionSafe: boolean
    contrastLevel: 'AA' | 'AAA' | 'A'
  }
}

// ============================================================================
// 类型定义 (Type Definitions)
// ============================================================================

/**
 * DTCG 风格配方上下文类型
 */
export interface DTCGStyleRecipeContextType {
  // 当前配方状态
  currentRecipe: DTCGStyleRecipe | null
  currentRecipeID: StyleRecipeID
  parsedRecipe: ParsedRecipe | null
  isTransitioning: boolean

  // 配方管理
  setRecipe: (recipeID: StyleRecipeID) => Promise<boolean>
  setRecipeByCategory: (category: string) => Promise<boolean>
  setRandomRecipe: () => Promise<boolean>
  searchRecipes: (query: string) => string[]

  // 配方库
  availableRecipes: DTCGStyleRecipe[]
  categories: string[]
  recommendedRecipes: DTCGStyleRecipe[]
  recipesByCategory: Record<string, DTCGStyleRecipe[]>

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
}

// ============================================================================
// 上下文创建 (Context Creation)
// ============================================================================

const DTCGStyleRecipeContext = createContext<DTCGStyleRecipeContextType | undefined>(undefined)

// ============================================================================
// DTCG 配方映射 (DTCG Recipe Mapping)
// ============================================================================

/**
 * 将 DTCG 配方转换为演示用的配方对象
 */
function createDemoRecipes(): DTCGStyleRecipe[] {
  // 将官方配方转换为 DTCGStyleRecipe 格式
  return officialRecipes.map(recipe => ({
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    category: recipe.category,
    tags: recipe.tags,
    accessibility: {
      cvdFriendly: recipe.accessibility.cvdFriendly,
      motionSafe: recipe.accessibility.motionSafe,
      contrastLevel: recipe.accessibility.contrastLevel as 'AA' | 'AAA' | 'A'
    }
  }))
}

// ============================================================================
// DTCG 风格配方提供者组件 (DTCG Style Recipe Provider Component)
// ============================================================================

/**
 * DTCG 风格配方提供者
 */
export function DTCGStyleRecipeProvider({
  children,
  defaultRecipe = 'light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow',
  enableTransitions = true,
  transitionDuration = 400,
}: {
  children: ReactNode
  defaultRecipe?: string
  enableTransitions?: boolean
  transitionDuration?: number
}) {
  // ============================================================================
  // 状态管理 (State Management)
  // ============================================================================

  const [currentRecipeID, setCurrentRecipeID] = useState<string>(defaultRecipe)
  const [currentRecipe, setCurrentRecipe] = useState<DTCGStyleRecipe | null>(null)
  const [parsedRecipe, setParsedRecipe] = useState<ParsedRecipe | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [axisLocks, setAxisLocks] = useState<AxisLockRule[]>([])
  const [responseLevel, setResponseLevel] = useState<ResponseLevel>('L2')
  const [accessibilityMode, setAccessibilityMode] = useState<'strict' | 'standard' | 'relaxed'>('standard')

  // ============================================================================
  // 配方库 (Recipe Library)
  // ============================================================================

  const availableRecipes = useMemo(() => createDemoRecipes(), [])
  const categories = useMemo(() =>
    Array.from(new Set(availableRecipes.map(recipe => recipe.category))),
    []
  )
  const recommendedRecipes = useMemo(() => availableRecipes.slice(0, 2), [])
  const recipesByCategory = useMemo(() => {
    const grouped: Record<string, DTCGStyleRecipe[]> = {}
    availableRecipes.forEach(recipe => {
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
    recipeID: string,
    enableAnimation = true
  ): Promise<boolean> => {
    try {
      if (enableAnimation && enableTransitions) {
        setIsTransitioning(true)
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      // 查找配方
      const recipe = availableRecipes.find(r => r.id === recipeID)
      if (!recipe) {
        console.error(`Recipe not found: ${recipeID}`)
        if (enableTransitions) setIsTransitioning(false)
        return false
      }

      // 使用浏览器 DTCG 引擎解析配方
      // 直接使用传入的 recipeID（完整七轴格式）
      const parsed = browserDTCGRecipeEngine.parseRecipe(recipeID as StyleRecipeID, axisLocks)

      if (!parsed) {
        console.error(`Failed to parse DTCG recipe: ${recipeID}`)
        if (enableTransitions) setIsTransitioning(false)
        return false
      }

      // 更新状态
      setCurrentRecipeID(recipeID)
      setCurrentRecipe(recipe)
      setParsedRecipe(parsed)

      // 保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('th-ui-dtcg-recipe', recipeID)
      }

      // 等待动画完成
      if (enableAnimation && enableTransitions) {
        await new Promise(resolve => setTimeout(resolve, transitionDuration))
        setIsTransitioning(false)
      }

      return true
    } catch (error) {
      console.error('Error applying DTCG recipe:', error)
      if (enableTransitions) setIsTransitioning(false)
      return false
    }
  }, [axisLocks, enableTransitions, transitionDuration, availableRecipes])

  /**
   * 设置配方
   */
  const setRecipe = useCallback(async (recipeID: string): Promise<boolean> => {
    return parseAndApplyRecipe(recipeID, true)
  }, [parseAndApplyRecipe])

  /**
   * 按类别设置配方
   */
  const setRecipeByCategory = useCallback(async (category: string): Promise<boolean> => {
    const categoryRecipes = recipesByCategory[category] || []
    if (categoryRecipes.length === 0) {
      console.warn(`No recipes found for category: ${category}`)
      return false
    }

    const randomRecipe = categoryRecipes[Math.floor(Math.random() * categoryRecipes.length)]
    return setRecipe(randomRecipe.id)
  }, [recipesByCategory, setRecipe])

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
  const searchRecipesCallback = useCallback((query: string): string[] => {
    return browserDTCGRecipeEngine.searchRecipes(query)
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
    if (!parsedRecipe) {
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

    // 使用解析结果中的验证信息
    return {
      isValid: parsedRecipe.validation.isValid,
      errors: parsedRecipe.validation.warnings,
      warnings: parsedRecipe.validation.warnings,
      accessibilityReport: parsedRecipe.validation.accessibilityReport,
    }
  }, [parsedRecipe])

  // ============================================================================
  // 初始化与副作用 (Initialization & Side Effects)
  // ============================================================================

  useEffect(() => {
    setMounted(true)

    // 从 localStorage 读取保存的配方
    if (typeof window !== 'undefined') {
      const savedRecipe = localStorage.getItem('th-ui-dtcg-recipe')
      const recipeToUse = savedRecipe || defaultRecipe
      parseAndApplyRecipe(recipeToUse, false)
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

    // 从解析的角色令牌生成 CSS 变量
    const roleVariables = generateBrowserCSSVariables(parsedRecipe.tokens.roles)

    return {
      ...roleVariables,
      // 添加配方元数据变量
      '--th-recipe-id': currentRecipe?.id || '',
      '--th-recipe-name': currentRecipe?.name || '',
      '--th-recipe-category': currentRecipe?.category || '',
      '--th-response-level': responseLevel,
      '--th-accessibility-mode': accessibilityMode,
    }
  }, [parsedRecipe, currentRecipe, responseLevel, accessibilityMode])

  // ============================================================================
  // 上下文值 (Context Value)
  // ============================================================================

  const contextValue: DTCGStyleRecipeContextType = useMemo(() => ({
    // 当前配方状态
    currentRecipe,
    currentRecipeID: currentRecipeID as StyleRecipeID,
    parsedRecipe,
    isTransitioning,

    // 配方管理
    setRecipe: setRecipe as (recipeID: StyleRecipeID) => Promise<boolean>,
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
  ])

  // ============================================================================
  // 渲染 (Rendering)
  // ============================================================================

  if (!mounted) {
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
    <DTCGStyleRecipeContext.Provider value={contextValue}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRecipeID}
          {...(enableTransitions ? transitionVariants : {})}
          className="th-dtcg-style-recipe-root"
          style={cssVariables as React.CSSProperties}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </DTCGStyleRecipeContext.Provider>
  )
}

// ============================================================================
// Hook (Hook)
// ============================================================================

/**
 * 使用 DTCG 风格配方
 */
export function useDTCGStyleRecipe(): DTCGStyleRecipeContextType {
  const context = useContext(DTCGStyleRecipeContext)
  if (context === undefined) {
    throw new Error('useDTCGStyleRecipe must be used within a DTCGStyleRecipeProvider')
  }
  return context
}

// ============================================================================
// 导出 (Exports)
// ============================================================================

export type { DTCGStyleRecipeContextType }
export { DTCGStyleRecipeContext }