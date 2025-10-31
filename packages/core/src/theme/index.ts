/**
 * 🎨 Xorigo UI 七轴主题系统
 *
 * 完整的动态主题系统，包含：
 * - 七轴DTCG动态配方加载引擎
 * - 高性能参数计算引擎
 * - 配方验证和安全管理
 * - 多层缓存和热更新
 * - 配方存储和版本管理
 * - 智能分类和搜索系统
 * - React主题提供者组件
 *
 * 性能目标：
 * - 配方加载时间 < 50ms
 * - 主题切换时间 < 100ms
 * - 支持1000+配方并发加载
 */

// ========================================================================
// 核心引擎
// ========================================================================

export {
  SevenAxisRecipeEngine,
  DynamicRecipe,
  SevenAxisConfig,
  CalculationContext,
  CompleteCalculationResult,
  EngineConfig,
  RecipeSource,
  sevenAxisEngine,
  loadRecipe,
  applyRecipe,
  calculateTheme,
  subscribeToTheme
} from './seven-axis-recipe-engine'

// ========================================================================
// 验证和安全
// ========================================================================

export {
  RecipeValidator,
  SecurityPolicy,
  ValidationRule,
  ValidationResult,
  ValidationContext,
  ValidationOptions,
  BatchValidationOptions,
  SecurityCheckResult,
  SecurityIssue,
  SecurityRiskLevel,
  BatchValidationResult,
  ValidationSummary,
  recipeValidator,
  validateRecipe,
  checkRecipeSecurity,
  validateRecipes,
  DEFAULT_SECURITY_POLICY
} from './recipe-validator'

// ========================================================================
// 计算引擎
// ========================================================================

export {
  SevenAxisCalculator,
  OKLCHColor,
  ColorConversionResult,
  CalculationCacheItem,
  ColorPalette,
  ColorScale,
  SemanticColors,
  SpatialSystem,
  SpatialScale,
  AnimationSystem,
  CompleteCalculationResult as ThemeCalculationResult,
  CalculatorConfig,
  CacheStats,
  sevenAxisCalculator,
  calculateTheme as calculateThemeComplete,
  getCacheStats,
  clearThemeCache
} from './seven-axis-calculator'

// ========================================================================
// 缓存管理
// ========================================================================

export {
  RecipeCacheManager,
  CacheLevel,
  CacheItem,
  CacheConfig,
  HotUpdateEvent,
  SyncStatus,
  RecipeConflict,
  CacheOptions,
  CacheStats as CacheManagerStats,
  recipeCacheManager,
  getCachedRecipe,
  setCachedRecipe,
  deleteCachedRecipe,
  subscribeToRecipeUpdates
} from './recipe-cache-manager'

// ========================================================================
// 存储管理
// ========================================================================

export {
  RecipeStorageManager,
  SemanticVersion,
  RecipeVersion,
  RecipeDiff,
  RecipeChange,
  RecipeHistory,
  StorageConfig,
  SyncState,
  SyncError,
  SyncConflict,
  PublishOptions,
  DeleteOptions,
  RecipeStats,
  recipeStorageManager,
  publishRecipe,
  getRecipeVersion,
  rollbackRecipe,
  deleteRecipe
} from './recipe-storage-manager'

// ========================================================================
// 注册表和搜索
// ========================================================================

export {
  RecipeRegistry,
  RecipeCategory,
  SearchFilter,
  SearchResult,
  RecipeSearchItem,
  SearchHighlight,
  SearchAggregations,
  RecommendationResult,
  RecipeRecommendation,
  TagStats,
  SearchIndexItem,
  UserPreferences,
  RegistryStats,
  recipeRegistry,
  searchRecipes,
  getRecommendations,
  getCategoryTree,
  getPopularTags
} from './recipe-registry'

// ========================================================================
// React组件
// ========================================================================

export {
  SevenAxisThemeProvider,
  useSevenAxisTheme,
  useThemeValues,
  useThemeRecipe,
  useThemeMode,
  useThemeStatus,
  ThemeTransition,
  ThemeLoadingIndicator,
  ThemeErrorDisplay,
  ThemeContext,
  themeAnimationVariants,
  ThemeContextState,
  ThemeContextActions,
  SevenAxisThemeProviderProps,
  AnimationConfig
} from './seven-axis-theme-provider'

// ========================================================================
// 类型重导出
// ========================================================================

/**
 * 主要类型定义
 */
export type {
  // 配方核心类型
  SevenAxisConfig as ThemeAxisConfig,
  DynamicRecipe as ThemeRecipe,
  CalculationContext as ThemeContext,

  // 验证相关类型
  SecurityPolicy as ThemeSecurityPolicy,
  ValidationResult as ThemeValidationResult,
  SecurityCheckResult as ThemeSecurityResult,

  // 计算相关类型
  OKLCHColor as ColorOKLCH,
  ColorPalette as ThemeColorPalette,
  SpatialSystem as ThemeSpatialSystem,
  AnimationSystem as ThemeAnimationSystem,

  // 搜索相关类型
  SearchFilter as ThemeSearchFilter,
  SearchResult as ThemeSearchResult,
  RecipeRecommendation as ThemeRecommendation,

  // React相关类型
  ThemeContextState as UseThemeState,
  ThemeContextActions as UseThemeActions
} from './seven-axis-recipe-engine'

// ========================================================================
// 便捷函数和常量
// ========================================================================

/**
 * 默认配置
 */
export const DEFAULT_THEME_CONFIG = {
  recipeId: 'corporate-blue',
  mode: 'auto' as const,
  enableAnimations: true,
  enablePreloading: true,
  cacheSize: 100,
  securityPolicy: 'safe' as const
}

/**
 * 预设配方
 */
export const BUILTIN_RECIPES = [
  'corporate-blue',
  'dark-professional',
  'minimal-light',
  'creative-purple',
  'tech-cyan',
  'nature-green',
  'sunset-orange',
  'ocean-teal'
] as const

/**
 * 主题预设
 */
export const THEME_PRESETS = {
  corporate: {
    name: '企业专业',
    description: '适用于企业环境的专业主题',
    recipes: ['corporate-blue', 'dark-professional']
  },
  minimal: {
    name: '极简主义',
    description: '简洁清爽的极简风格',
    recipes: ['minimal-light']
  },
  creative: {
    name: '创意设计',
    description: '富有创意的设计风格',
    recipes: ['creative-purple', 'sunset-orange']
  },
  technology: {
    name: '科技感',
    description: '现代科技感设计',
    recipes: ['tech-cyan', 'ocean-teal']
  }
} as const

/**
 * 主题工具函数
 */
export const themeUtils = {
  /**
   * 快速应用主题
   */
  async applyTheme(recipeId: string, animated = true): Promise<boolean> {
    return await applyRecipe(recipeId, animated)
  },

  /**
   * 切换主题模式
   */
  async toggleThemeMode(): Promise<void> {
    if (typeof window === 'undefined') return

    const html = document.documentElement
    const currentMode = html.getAttribute('data-mode')
    const newMode = currentMode === 'dark' ? 'light' : 'dark'

    html.setAttribute('data-mode', newMode)
    localStorage.setItem('xorigo-theme-mode', newMode)
  },

  /**
   * 获取当前主题
   */
  getCurrentTheme(): string | null {
    if (typeof window === 'undefined') return null
    return document.documentElement.getAttribute('data-theme')
  },

  /**
   * 检查主题是否可用
   */
  async isThemeAvailable(recipeId: string): Promise<boolean> {
    try {
      const recipe = await getCachedRecipe(recipeId)
      return recipe !== null
    } catch {
      return false
    }
  },

  /**
   * 获取主题统计信息
   */
  getStats() {
    return {
      cache: getCacheStats(),
      registry: recipeRegistry.getRegistryStats()
    }
  },

  /**
   * 清理主题缓存
   */
  clearCache(): void {
    clearThemeCache()
    recipeCacheManager.clearAllCaches()
  },

  /**
   * 预加载主题
   */
  async preloadThemes(recipeIds: string[]): Promise<void> {
    const promises = recipeIds.map(id => recipeCacheManager.prefetchRecipe(id))
    await Promise.allSettled(promises)
  }
}

// ========================================================================
// CSS工具
// ========================================================================

/**
 * CSS变量工具
 */
export const cssUtils = {
  /**
   * 获取CSS变量值
   */
  getCSSVariable(name: string, element?: HTMLElement): string {
    const el = element || document.documentElement
    return getComputedStyle(el).getPropertyValue(`--${name}`).trim()
  },

  /**
   * 设置CSS变量
   */
  setCSSVariable(name: string, value: string, element?: HTMLElement): void {
    const el = element || document.documentElement
    el.style.setProperty(`--${name}`, value)
  },

  /**
   * 批量设置CSS变量
   */
  setCSSVariables(variables: Record<string, string>, element?: HTMLElement): void {
    const el = element || document.documentElement
    Object.entries(variables).forEach(([name, value]) => {
      el.style.setProperty(`--${name}`, value)
    })
  },

  /**
   * 获取所有主题CSS变量
   */
  getThemeCSSVariables(element?: HTMLElement): Record<string, string> {
    const el = element || document.documentElement
    const style = getComputedStyle(el)
    const variables: Record<string, string> = {}

    // 获取所有以 --xorigo- 开头的变量
    for (let i = 0; i < style.length; i++) {
      const property = style[i]
      if (property.startsWith('--xorigo-')) {
        const value = style.getPropertyValue(property).trim()
        variables[property] = value
      }
    }

    return variables
  }
}

// ========================================================================
// 性能监控
// ========================================================================

/**
 * 性能监控工具
 */
export const performanceUtils = {
  /**
   * 测量主题切换性能
   */
  async measureThemeSwitch(recipeId: string): Promise<{
    loadTime: number
    applyTime: number
    totalTime: number
  }> {
    const startTime = performance.now()

    // 测量加载时间
    const loadStart = performance.now()
    const recipe = await loadRecipe(recipeId)
    const loadEnd = performance.now()
    const loadTime = loadEnd - loadStart

    // 测量应用时间
    const applyStart = performance.now()
    await applyRecipe(recipeId)
    const applyEnd = performance.now()
    const applyTime = applyEnd - applyStart

    const totalTime = performance.now() - startTime

    return {
      loadTime,
      applyTime,
      totalTime
    }
  },

  /**
   * 获取性能指标
   */
  getMetrics() {
    return {
      cache: getCacheStats(),
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null,
      timing: performance.timing ? {
        domLoad: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        fullLoad: performance.timing.loadEventEnd - performance.timing.navigationStart
      } : null
    }
  }
}

// ========================================================================
// 开发工具
// ========================================================================

/**
 * 开发者工具
 */
export const devUtils = {
  /**
   * 调试主题状态
   */
  debugThemeState() {
    if (process.env.NODE_ENV !== 'development') return

    console.group('🎨 Xorigo UI Theme Debug')
    console.log('Current Recipe:', themeUtils.getCurrentTheme())
    console.log('Cache Stats:', themeUtils.getStats())
    console.log('CSS Variables:', cssUtils.getThemeCSSVariables())
    console.log('Performance Metrics:', performanceUtils.getMetrics())
    console.groupEnd()
  },

  /**
   * 列出所有可用配方
   */
  async listAvailableRecipes(): Promise<string[]> {
    try {
      return await recipeRegistry.searchRecipes({ pageSize: 1000 }).then(result =>
        result.recipes.map(recipe => recipe.id)
      )
    } catch (error) {
      console.error('获取配方列表失败:', error)
      return []
    }
  },

  /**
   * 验证配方
   */
  async validateRecipe(recipeId: string): Promise<boolean> {
    try {
      const recipe = await getCachedRecipe(recipeId)
      if (!recipe) return false

      const validation = await validateRecipe(recipe)
      return validation.isValid
    } catch {
      return false
    }
  },

  /**
   * 导出主题配置
   */
  async exportThemeConfig(): Promise<any> {
    const config = {
      currentTheme: themeUtils.getCurrentTheme(),
      mode: cssUtils.getCSSVariable('xorigo-theme-mode'),
      customVariables: cssUtils.getThemeCSSVariables(),
      cacheStats: themeUtils.getStats(),
      timestamp: new Date().toISOString()
    }

    return config
  },

  /**
   * 导入主题配置
   */
  async importThemeConfig(config: any): Promise<boolean> {
    try {
      if (config.currentTheme) {
        await themeUtils.applyTheme(config.currentTheme)
      }

      if (config.mode) {
        cssUtils.setCSSVariable('xorigo-theme-mode', config.mode)
      }

      if (config.customVariables) {
        cssUtils.setCSSVariables(config.customVariables)
      }

      return true
    } catch (error) {
      console.error('导入主题配置失败:', error)
      return false
    }
  }
}

// ========================================================================
// 版本信息
// ========================================================================

export const THEME_SYSTEM_VERSION = '2.0.0'
export const THEME_SYSTEM_BUILD_DATE = new Date().toISOString()
export const THEME_SYSTEM_FEATURES = [
  '七轴DTCG配方系统',
  '动态加载和热更新',
  '多层缓存架构',
  '配方验证和安全检查',
  '版本控制和回滚',
  '智能搜索和推荐',
  'Framer Motion动画集成',
  'TypeScript类型安全',
  '性能监控和优化'
]

// ========================================================================
// 默认导出
// ========================================================================

export default {
  // 核心组件
  SevenAxisThemeProvider,
  useSevenAxisTheme,

  // 工具函数
  themeUtils,
  cssUtils,
  performanceUtils,
  devUtils,

  // 常量和配置
  DEFAULT_THEME_CONFIG,
  BUILTIN_RECIPES,
  THEME_PRESETS,
  THEME_SYSTEM_VERSION,

  // 引擎实例
  sevenAxisEngine,
  sevenAxisCalculator,
  recipeCacheManager,
  recipeStorageManager,
  recipeRegistry
}

// ========================================================================
// 全局声明（扩展Window对象）
// ========================================================================

declare global {
  interface Window {
    __XORIGO_THEME__?: {
      version: string
      utils: typeof themeUtils
      debug: typeof devUtils
    }
  }
}

// 开发环境下暴露到全局
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.__XORIGO_THEME__ = {
    version: THEME_SYSTEM_VERSION,
    utils: themeUtils,
    debug: devUtils
  }
}