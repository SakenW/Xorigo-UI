/**
 * 🎭 七轴主题提供者组件
 *
 * 集成Framer Motion动画效果的React主题提供者
 * 支持实时主题切换、动画过渡和上下文管理
 */


import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useRef
} from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'

// 导入七轴主题系统
import {
  DynamicRecipe,
  SevenAxisConfig,
  CalculationContext,
  CompleteCalculationResult
} from './seven-axis-recipe-engine'
import {
  sevenAxisCalculator,
  calculateTheme
} from './seven-axis-calculator'
import {
  sevenAxisEngine,
  applyRecipe,
  subscribeToTheme
} from './seven-axis-recipe-engine'
import {
  recipeCacheManager,
  subscribeToRecipeUpdates
} from './recipe-cache-manager'
import {
  HotUpdateEvent
} from './recipe-cache-manager'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 主题上下文状态
 */
export interface ThemeContextState {
  /** 当前配方ID */
  currentRecipeId: string | null
  /** 当前配方 */
  currentRecipe: DynamicRecipe | null
  /** 主题计算结果 */
  themeResult: CompleteCalculationResult | null
  /** 是否正在加载 */
  isLoading: boolean
  /** 是否正在切换主题 */
  isTransitioning: boolean
  /** 错误信息 */
  error: string | null
  /** 可用配方列表 */
  availableRecipes: string[]
  /** 主题模式 */
  themeMode: 'light' | 'dark' | 'auto'
  /** 系统偏好 */
  systemPreference: 'light' | 'dark'
}

/**
 * 主题上下文操作
 */
export interface ThemeContextActions {
  /** 应用配方 */
  applyRecipe: (recipeId: string, animated?: boolean) => Promise<boolean>
  /** 切换主题模式 */
  toggleThemeMode: () => Promise<void>
  /** 设置主题模式 */
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => Promise<void>
  /** 预加载配方 */
  preloadRecipe: (recipeId: string) => Promise<void>
  /** 获取配方列表 */
  getAvailableRecipes: () => Promise<string[]>
  /** 搜索配方 */
  searchRecipes: (query: string) => Promise<string[]>
  /** 重置为默认主题 */
  resetToDefault: () => Promise<void>
}

/**
 * 主题提供者属性
 */
export interface SevenAxisThemeProviderProps {
  /** 子组件 */
  children: ReactNode
  /** 默认配方ID */
  defaultRecipeId?: string
  /** 默认主题模式 */
  defaultThemeMode?: 'light' | 'dark' | 'auto'
  /** 是否启用动画 */
  enableAnimations?: boolean
  /** 动画配置 */
  animationConfig?: AnimationConfig
  /** 是否预加载配方 */
  enablePreloading?: boolean
  /** 预加载配方列表 */
  preloadRecipes?: string[]
  /** 主题变化回调 */
  onThemeChange?: (recipeId: string, recipe: DynamicRecipe) => void
  /** 主题加载回调 */
  onThemeLoad?: (recipeId: string, isLoading: boolean) => void
  /** 主题错误回调 */
  onThemeError?: (error: string) => void
  /** 自定义上下文 */
  context?: CalculationContext
}

/**
 * 动画配置
 */
export interface AnimationConfig {
  /** 主题切换持续时间 */
  duration: number
  /** 缓动函数 */
  easing: string
  /** 是否启用交错动画 */
  stagger: boolean
  /** 交错延迟 */
  staggerDelay: number
  /** 动画预设 */
  preset: 'fade' | 'slide' | 'scale' | 'flip' | 'custom'
  /** 自定义动画变体 */
  variants?: {
    container?: any
    item?: any
  }
}

/**
 * 主题动画变体
 */
export const themeAnimationVariants = {
  // 淡入淡出
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  // 滑动切换
  slide: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 }
  },
  // 缩放切换
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.05, opacity: 0 }
  },
  // 翻转切换
  flip: {
    initial: { rotateY: -90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: 90, opacity: 0 }
  }
}

// ============================================================================
// 主题上下文
// ============================================================================

/**
 * 主题上下文
 */
const ThemeContext = createContext<{
  state: ThemeContextState
  actions: ThemeContextActions
} | null>(null)

// ============================================================================
// 主题提供者组件
// ============================================================================

/**
 * 七轴主题提供者
 *
 * 提供完整的主题管理功能，包括：
 * - 实时主题切换
 * - 动画过渡效果
 * - 配方预加载
 * - 系统偏好检测
 * - 错误处理
 */
export const SevenAxisThemeProvider: React.FC<SevenAxisThemeProviderProps> = ({
  children,
  defaultRecipeId = 'corporate-blue',
  defaultThemeMode = 'auto',
  enableAnimations = true,
  animationConfig,
  enablePreloading = true,
  preloadRecipes = ['corporate-blue', 'dark-professional'],
  onThemeChange,
  onThemeLoad,
  onThemeError,
  context
}) => {
  // 状态管理
  const [state, setState] = useState<ThemeContextState>({
    currentRecipeId: null,
    currentRecipe: null,
    themeResult: null,
    isLoading: true,
    isTransitioning: false,
    error: null,
    availableRecipes: [],
    themeMode: defaultThemeMode,
    systemPreference: 'light'
  })

  // 引用管理
  const mountedRef = useRef(true)
  const transitionTimeoutRef = useRef<NodeJS.Timeout>()

  // 动画配置
  const motionConfig = useMemo(() => ({
    duration: 0.3,
    easing: 'ease-in-out',
    stagger: true,
    staggerDelay: 0.05,
    preset: 'fade' as const,
    ...animationConfig
  }), [animationConfig])

  // ========================================================================
  // 初始化
  // ========================================================================

  /**
   * 初始化主题系统
   */
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // 检测系统偏好
        const systemPref = detectSystemPreference()

        // 获取可用配方
        const recipes = await getAvailableRecipes()

        // 确定初始配方ID
        let initialRecipeId = defaultRecipeId
        const savedRecipeId = getSavedRecipeId()

        if (savedRecipeId && recipes.includes(savedRecipeId)) {
          initialRecipeId = savedRecipeId
        }

        // 应用初始主题
        await applyThemeInternal(initialRecipeId, false)

        // 更新状态
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            availableRecipes: recipes,
            systemPreference: systemPref,
            isLoading: false
          }))
        }

        // 预加载配方
        if (enablePreloading) {
          await preloadRecipesInternal(preloadRecipes.filter(id => id !== initialRecipeId))
        }

      } catch (error) {
        console.error('主题初始化失败:', error)
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            error: error instanceof Error ? error.message : '初始化失败',
            isLoading: false
          }))
          onThemeError?.(error instanceof Error ? error.message : '初始化失败')
        }
      }
    }

    initializeTheme()

    // 清理函数
    return () => {
      mountedRef.current = false
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  // ========================================================================
  // 事件监听
  // ========================================================================

  /**
   * 监听配方更新
   */
  useEffect(() => {
    const unsubscribe = subscribeToRecipeUpdates((event: HotUpdateEvent) => {
      handleRecipeUpdate(event)
    })

    return unsubscribe
  }, [])

  /**
   * 监听系统主题变化
   */
  useEffect(() => {
    if (state.themeMode !== 'auto') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      const newPreference = e.matches ? 'dark' : 'light'

      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          systemPreference: newPreference
        }))

        // 如果当前配方支持模式切换，重新应用主题
        if (state.currentRecipe) {
          applyThemeInternal(state.currentRecipe.id, true)
        }
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [state.themeMode, state.currentRecipe])

  // ========================================================================
  // 核心功能函数
  // ========================================================================

  /**
   * 应用主题
   */
  const applyThemeInternal = useCallback(async (
    recipeId: string,
    animated: boolean = true
  ): Promise<boolean> => {
    try {
      // 开始加载
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: true,
          error: null
        }))
        onThemeLoad?.(recipeId, true)
      }

      // 开始过渡
      if (animated && enableAnimations) {
        if (mountedRef.current) {
          setState(prev => ({ ...prev, isTransitioning: true }))
        }
      }

      // 加载并应用配方
      const success = await applyRecipe(recipeId, animated && enableAnimations)

      if (!success) {
        throw new Error(`配方应用失败: ${recipeId}`)
      }

      // 计算主题结果
      const recipe = await getRecipeById(recipeId)
      if (!recipe) {
        throw new Error(`配方不存在: ${recipeId}`)
      }

      const themeResult = await calculateTheme(recipe, {
        systemPreference: state.systemPreference,
        ...context
      })

      // 更新状态
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          currentRecipeId: recipeId,
          currentRecipe: recipe,
          themeResult,
          isLoading: false
        }))
      }

      // 保存到本地存储
      saveRecipeId(recipeId)

      // 触发回调
      onThemeChange?.(recipeId, recipe)

      // 结束过渡
      if (animated && enableAnimations) {
        transitionTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            setState(prev => ({ ...prev, isTransitioning: false }))
          }
        }, motionConfig.duration * 1000)
      } else {
        if (mountedRef.current) {
          setState(prev => ({ ...prev, isTransitioning: false }))
        }
      }

      onThemeLoad?.(recipeId, false)
      return true

    } catch (error) {
      console.error('应用主题失败:', error)
      const errorMessage = error instanceof Error ? error.message : '应用主题失败'

      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
          isTransitioning: false
        }))
      }

      onThemeError?.(errorMessage)
      onThemeLoad?.(recipeId, false)
      return false
    }
  }, [enableAnimations, motionConfig, onThemeChange, onThemeLoad, onThemeError, context, state.systemPreference])

  /**
   * 切换主题模式
   */
  const toggleThemeMode = useCallback(async () => {
    const newMode = state.themeMode === 'light' ? 'dark' : 'light'
    await setThemeMode(newMode)
  }, [state.themeMode])

  /**
   * 设置主题模式
   */
  const setThemeMode = useCallback(async (mode: 'light' | 'dark' | 'auto') => {
    if (mountedRef.current) {
      setState(prev => ({ ...prev, themeMode: mode }))
    }

    // 如果有当前配方，重新应用主题
    if (state.currentRecipe) {
      await applyThemeInternal(state.currentRecipe.id, true)
    }

    saveThemeMode(mode)
  }, [state.currentRecipe, applyThemeInternal])

  /**
   * 预加载配方
   */
  const preloadRecipe = useCallback(async (recipeId: string) => {
    try {
      await recipeCacheManager.prefetchRecipe(recipeId)
    } catch (error) {
      console.warn(`预加载配方失败: ${recipeId}`, error)
    }
  }, [])

  /**
   * 预加载多个配方
   */
  const preloadRecipesInternal = useCallback(async (recipeIds: string[]) => {
    const promises = recipeIds.map(id => preloadRecipe(id))
    await Promise.allSettled(promises)
  }, [preloadRecipe])

  /**
   * 获取可用配方
   */
  const getAvailableRecipes = useCallback(async (): Promise<string[]> => {
    try {
      // 这里应该从配方注册表获取
      // 暂时返回内置配方
      return ['corporate-blue', 'dark-professional', 'minimal-light', 'creative-purple']
    } catch (error) {
      console.error('获取配方列表失败:', error)
      return []
    }
  }, [])

  /**
   * 搜索配方
   */
  const searchRecipes = useCallback(async (query: string): Promise<string[]> => {
    try {
      // 这里应该使用配方注册表搜索
      // 暂时返回简单匹配
      const allRecipes = await getAvailableRecipes()
      return allRecipes.filter(id => id.includes(query.toLowerCase()))
    } catch (error) {
      console.error('搜索配方失败:', error)
      return []
    }
  }, [getAvailableRecipes])

  /**
   * 重置为默认主题
   */
  const resetToDefault = useCallback(async () => {
    await applyThemeInternal(defaultRecipeId, true)
  }, [defaultRecipeId, applyThemeInternal])

  // ========================================================================
  // 事件处理
  // ========================================================================

  /**
   * 处理配方更新
   */
  const handleRecipeUpdate = useCallback((event: HotUpdateEvent) => {
    if (event.type === 'recipe-updated' && event.recipeId === state.currentRecipeId) {
      // 当前配方已更新，重新应用
      applyThemeInternal(event.recipeId, true)
    } else if (event.type === 'recipe-deleted' && event.recipeId === state.currentRecipeId) {
      // 当前配方已删除，重置为默认
      resetToDefault()
    }
  }, [state.currentRecipeId, applyThemeInternal, resetToDefault])

  // ========================================================================
  // 操作对象
  // ========================================================================

  const actions: ThemeContextActions = useMemo(() => ({
    applyRecipe: applyThemeInternal,
    toggleThemeMode,
    setThemeMode,
    preloadRecipe,
    getAvailableRecipes,
    searchRecipes,
    resetToDefault
  }), [
    applyThemeInternal,
    toggleThemeMode,
    setThemeMode,
    preloadRecipe,
    getAvailableRecipes,
    searchRecipes,
    resetToDefault
  ])

  // ========================================================================
  // 渲染
  // ========================================================================

  const animationVariants = useMemo(() => {
    if (motionConfig.variants) {
      return motionConfig.variants
    }
    return themeAnimationVariants[motionConfig.preset] || themeAnimationVariants.fade
  }, [motionConfig])

  return (
    <ThemeContext.Provider value={{ state, actions }}>
      <MotionConfig
        transition={{
          duration: motionConfig.duration,
          ease: motionConfig.easing,
          staggerChildren: motionConfig.stagger ? motionConfig.staggerDelay : 0
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentRecipeId}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animationVariants}
            className="xorigo-theme-provider"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </MotionConfig>
    </ThemeContext.Provider>
  )
}

// ============================================================================
// Hook函数
// ============================================================================

/**
 * 使用主题Hook
 */
export const useSevenAxisTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useSevenAxisTheme must be used within a SevenAxisThemeProvider')
  }

  return context
}

/**
 * 使用主题值Hook
 */
export const useThemeValues = () => {
  const { state } = useSevenAxisTheme()

  return useMemo(() => {
    if (!state.themeResult) {
      return {}
    }

    return state.themeResult.cssVariables
  }, [state.themeResult])
}

/**
 * 使用主题配方Hook
 */
export const useThemeRecipe = () => {
  const { state } = useSevenAxisTheme()

  return state.currentRecipe
}

/**
 * 使用主题模式Hook
 */
export const useThemeMode = () => {
  const { state, actions } = useSevenAxisTheme()

  return {
    mode: state.themeMode,
    systemPreference: state.systemPreference,
    isDark: state.themeMode === 'dark' ||
              (state.themeMode === 'auto' && state.systemPreference === 'dark'),
    toggle: actions.toggleThemeMode,
    set: actions.setThemeMode
  }
}

/**
 * 使用主题状态Hook
 */
export const useThemeStatus = () => {
  const { state } = useSevenAxisTheme()

  return {
    isLoading: state.isLoading,
    isTransitioning: state.isTransitioning,
    error: state.error,
    hasError: !!state.error,
    isReady: !state.isLoading && !state.error && !!state.currentRecipe
  }
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 检测系统主题偏好
 */
function detectSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * 获取保存的配方ID
 */
function getSavedRecipeId(): string | null {
  if (typeof localStorage === 'undefined') return null

  try {
    return localStorage.getItem('xorigo-current-recipe')
  } catch {
    return null
  }
}

/**
 * 保存配方ID
 */
function saveRecipeId(recipeId: string): void {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem('xorigo-current-recipe', recipeId)
  } catch (error) {
    console.warn('保存配方ID失败:', error)
  }
}

/**
 * 获取保存的主题模式
 */
function getSavedThemeMode(): 'light' | 'dark' | 'auto' {
  if (typeof localStorage === 'undefined') return 'auto'

  try {
    const saved = localStorage.getItem('xorigo-theme-mode')
    return saved === 'light' || saved === 'dark' || saved === 'auto' ? saved : 'auto'
  } catch {
    return 'auto'
  }
}

/**
 * 保存主题模式
 */
function saveThemeMode(mode: 'light' | 'dark' | 'auto'): void {
  if (typeof localStorage === 'undefined') return

  try {
    localStorage.setItem('xorigo-theme-mode', mode)
  } catch (error) {
    console.warn('保存主题模式失败:', error)
  }
}

/**
 * 获取配方数据
 */
async function getRecipeById(recipeId: string): Promise<DynamicRecipe | null> {
  try {
    return await recipeCacheManager.getRecipe(recipeId)
  } catch (error) {
    console.error('获取配方失败:', error)
    return null
  }
}

// ============================================================================
// 辅助组件
// ============================================================================

/**
 * 主题过渡组件
 */
export const ThemeTransition: React.FC<{
  children: ReactNode
  className?: string
}> = ({ children, className }) => {
  const { state } = useSevenAxisTheme()

  return (
    <motion.div
      className={`theme-transition ${className || ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.2,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * 主题加载指示器
 */
export const ThemeLoadingIndicator: React.FC<{
  className?: string
}> = ({ className }) => {
  const { state } = useSevenAxisTheme()

  if (!state.isLoading) return null

  return (
    <motion.div
      className={`theme-loading-indicator ${className || ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center space-x-2">
        <motion.div
          className="w-4 h-4 bg-current rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <span className="text-sm">加载主题中...</span>
      </div>
    </motion.div>
  )
}

/**
 * 主题错误显示
 */
export const ThemeErrorDisplay: React.FC<{
  className?: string
  onRetry?: () => void
}> = ({ className, onRetry }) => {
  const { state, actions } = useSevenAxisTheme()

  if (!state.error) return null

  return (
    <motion.div
      className={`theme-error ${className || ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-red-800 font-medium">主题加载失败</h3>
            <p className="text-red-600 text-sm mt-1">{state.error}</p>
          </div>
          <button
            onClick={() => {
              actions.resetToDefault()
              onRetry?.()
            }}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 导出
// ============================================================================

export {
  ThemeContext,
  themeAnimationVariants
}

export default {
  SevenAxisThemeProvider,
  useSevenAxisTheme,
  useThemeValues,
  useThemeRecipe,
  useThemeMode,
  useThemeStatus,
  ThemeTransition,
  ThemeLoadingIndicator,
  ThemeErrorDisplay
}