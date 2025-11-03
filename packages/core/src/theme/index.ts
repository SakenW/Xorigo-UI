/**
 * 🎨 Xorigo UI 主题系统 - 简化版本
 *
 * 临时简化版本，只保留核心功能，避免导出冲突
 */

// 核心主题桥接功能
export {
  THEME_RECIPE_MAPPING,
  SYSTEM_TO_RECIPE_MAPPING,
  mapRecipeToSystem,
  mapSystemToRecipe,
  getRecipeInfo,
  getAvailableRecipes,
  getRecipesByCategory,
} from './theme-bridge'

// 主题切换工具
export {
  useTheme,
} from './use-theme'

// 暂时禁用复杂的七轴主题系统，避免导出冲突
// export { ... } from './seven-axis-recipe-engine'
// export { ... } from './recipe-validator'
// export { ... } from './seven-axis-calculator'
// export { ... } from './recipe-cache-manager'
// export { ... } from './recipe-storage-manager'
// export { ... } from './recipe-registry'