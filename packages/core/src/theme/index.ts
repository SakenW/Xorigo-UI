/**
 * @fileoverview 主题模块统一导出
 * @description 提供主题相关的所有类型、工具和组件的统一入口
 *
 * 导出结构：
 * - mapping/: 主题映射核心逻辑
 * - components/: 主题相关组件
 * - types/: 类型定义
 * - utils/: 工具函数
 *
 * @author Xorigo UI Team
 * @version 2.0.0
 */

// ============================================================================
// 核心映射模块导出
// ============================================================================

export {
  // 核心类型
  type ThemeRecipe,
  type SystemTheme,
  type RecipeId,
  type SystemThemeId,
  type MappingConfig,

  // 映射表
  THEME_RECIPE_TO_SYSTEM,
  SYSTEM_TO_RECIPE,
  AVAILABLE_RECIPE_IDS,
  AVAILABLE_SYSTEM_THEMES,

  // 默认配置
  DEFAULT_RECIPE_ID,
  DEFAULT_SYSTEM_THEME,

  // 核心函数
  mapRecipeToSystem,
  mapSystemToRecipe,
  isValidRecipeId,
  isValidSystemTheme,
  getRecipeInfo,
  getAvailableRecipes,
  getRecipesByCategory,
  getAvailableSystemThemes,
  getMappingStats,

  // 开发工具
  validateMappings,

  // 向后兼容
  THEME_RECIPE_MAPPING,
  SYSTEM_TO_RECIPE_MAPPING
} from './theme-mapping'

// ============================================================================
// 主题桥接组件导出
// ============================================================================

export {
  // 核心组件
  ThemeBridge,
  useThemeBridge,

  // 工具组件
  ThemeToggleButton,
  ThemeSelector,

  // 类型定义
  type ThemeBridgeProps,
  type ThemeBridgeOptions,
  type ThemeBridgeContextValue,

  // 默认配置
  DEFAULT_CONFIG
} from '../components/base/ThemeBridge'

// ============================================================================
// 重新导出完整主题配方
// ============================================================================

export {
  type CompleteThemeRecipe,
  type ThemeCategory,
  COMPLETE_THEME_RECIPES,
  THEME_CATEGORIES,
  DEFAULT_THEME,
  DEFAULT_CATEGORY,
  getThemesByCategory,
  searchThemes,
  getThemeById,
  getPopularThemes,
  getNewThemes,
  getThemeStats
} from '../system-tools/complete-theme-recipes'

// ============================================================================
// 向后兼容 - 保持旧的导出接口
// ============================================================================

// 主题切换工具（如果存在）
export { useTheme } from './use-theme'