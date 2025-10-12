// TH-UI 主入口文件
// 导出所有组件、主题和工具

// 组件库
export * from './components/index'

// 主题系统
export * from './theme/index'

// 设计令牌 (从独立包导出 - 仅导出核心令牌和工具函数)
export {
  // 核心令牌和类型
  getCoreTokens,
  getAllRecipeMeta,
  getAllDensityPresets,
  // 类型导出
  type DTCGToken,
  type DTCGPalette,
  type DTCGCoreTokens,
  type DTCGRecipeMeta,
  type DTCGDensityPreset,

  // 密度预设
  comfortable,
  spacious,
  compact,

  // 基础数据导出
  typography,
  spacing,

  // 组件别名
  buttonAliases,
  cardAliases,
} from '@th-ui/tokens'

// 样式配方系统 (从独立包导出 - 排除冲突的颜色标度)
export {
  // 类型定义
  type StyleRecipe,
  type StyleRecipeID,
  type ModeAxis,
  type BaseAxis,
  type AccentAxis,
  type ToneAxis,
  type DensityAxis,
  type MotionAxis,
  type SurfaceAxis,
  type StyleAxis,
  type ResponseLevel,
  type ResponseLevelConfig,
  type AxisLock,
  type AxisLockRule,
  type CoreTokens,
  type RoleTokens,
  type ComponentTokens,
  type ColorScale,
  type ElevationScale,
  type MotionBase,
  type SurfaceBase,
  type TypographyScale,
  type SpacingScale,
  type ParsedRecipe,
  type RecipeEngineConfig,
  type RecipeValidationResult,
  type ParseRecipeID,

  // 配方集合和工具
  corporateBlueRecipe,
  corporateNavyDarkRecipe,
  minimalWhiteRecipe,
  minimalGraphiteDarkRecipe,
  techCyanRecipe,
  techNeonDarkRecipe,
  creativePurpleRecipe,
  creativeAuroraDarkRecipe,
  classicNeutralRecipe,
  highContrastProRecipe,
  officialRecipes,
  recipeMap,
  recipesByCategory,
  getRecipe,
  getRecipesByCategory,
  searchRecipes,
  getRecommendedRecipes,
  validateRecipeID,
  parseRecipeID,

  // 配方引擎
  StyleRecipeEngine,
  defaultRecipeEngine,
  parseRecipe,
  validateRecipeAccessibility,
  getCurrentRecipe,

  // React 提供者
  StyleRecipeProvider,
  useStyleRecipe,
  useStyleRecipeCSS,
  useResponseLevel,
  useAxisLock,
  type StyleRecipeContextType,

  // 工具函数
  getRecipeDescription,
  isRecipeSuitable,
  getContextualRecommendations,
  getVersionInfo,

  // 常量
  DEFAULT_RECIPE,
  RECIPE_CATEGORIES,
  RESPONSE_LEVELS,
  ACCESSIBILITY_MODES,
  STYLE_AXES,
  STYLE_RECIPE_VERSION,

  // 核心令牌 (不冲突的导出)
  coreTokens,
  elevationScale,
  motionBase,
  surfaceBase,
  typographyScale,
  spacingScale,

  // 状态色标度
  successScale,
  warningScale,
  errorScale,
  infoScale,

  // 额外的颜色标度
  magentaScale,
  grayScale,
} from '@th-ui/style-recipe'

// 工具函数
export * from './utils/index'

// 业务组件 (Blocks)
// export * from './blocks/index' // 暂时禁用以避免循环依赖
