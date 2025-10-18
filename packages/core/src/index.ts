// ===========================
// 组件导出 - 白皮书 v1.2 十大分类架构
// ===========================

// UI 基础组件 - 视觉原子
export * from './ui/'

// Inputs 输入控件 - 表单输入
export * from './inputs/'

// Forms 表单容器 - 表单逻辑
export * from './form/'

// Navigation 导航结构 - 导航组件
export * from './navigation/'

// Layout 布局分区 - 布局工具
export * from './layout/'

// Feedback 反馈状态 - 状态反馈
export * from './feedback/'

// Overlays 弹层遮罩 - 覆盖层
export * from './overlays/'

// DataDisplay 数据展示 - 数据呈现
export * from './datadisplay/'

// Charts 数据可视化 - 图表组件
export * from './charts/'

// Loading 加载组件 - 加载状态
export * from './loading/'

// Effects 特效组件 - 视觉特效
export * from './effects/'

// Interactive 交互组件 - 交互逻辑
export * from './interactive/'

// Showcase 展示组件 - 演示组件
export * from './showcase/'

// Utilities 技术基元 - 技术底层
export * from './utilities/'

// ===========================
// 类型导出 - 仅导出别名类型以避免与组件原生类型冲突
// ===========================
export type {
  ComponentVariants,
  BaseComponentProps,
  LayoutProps,
  EventHandlers,
  FormComponentProps,
  CoreButtonProps,
  CoreInputProps,
  CoreSelectProps,
  CoreModalProps,
  TableColumnProps,
  CoreTableProps,
  NavigationProps,
  AnimationProps,
  ThemeProps,
  ResponsiveProps,
  AccessibilityProps
} from './types/'

// ===========================
// 工具函数导出
// ===========================
export * from './utils/'

// ===========================
// 跨包导出 - 统一入口
// ===========================

// 配方系统
export {
  // React Provider 和 Hooks
  StyleRecipeProvider,
  useStyleRecipe,
  useStyleRecipeCSS,
  useResponseLevel,
  useAxisLock,
  type StyleRecipeContextType,

  // 配方集合
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

  // 配方工具函数
  getRecipe,
  getRecipesByCategory,
  searchRecipes,
  getRecommendedRecipes,
  validateRecipeID,
  parseRecipeID,
  getRecipeDescription,
  isRecipeSuitable,
  getContextualRecommendations,
  getVersionInfo,

  // 配方引擎
  StyleRecipeEngine,
  defaultRecipeEngine,
  parseRecipe,
  validateRecipeAccessibility,
  getCurrentRecipe,

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

  // 常量
  DEFAULT_RECIPE,
  RECIPE_CATEGORIES,
  RESPONSE_LEVELS,
  ACCESSIBILITY_MODES,
  STYLE_AXES,
  STYLE_RECIPE_VERSION,

  // 核心令牌
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
} from '@xorigo-ui/style-recipe'

// 设计令牌系统
export {
  // 基础设计令牌
  colorTokens,

  // 令牌转换器
  tokenTransformer,

  // 语义化令牌
  semanticTokens,

  // 主题管理
  themeManager,
  themeUtils,

  // 颜色迁移工具
  ColorMigrator,

  // 主题验证
  validateThemeSystem,
} from '@xorigo-ui/tokens'

// 主题系统
export {
  // Providers
  ThemeProvider,

  // Provider Props 类型
  type ThemeProviderProps,
} from '@xorigo-ui/system'

// Hooks（占位，待实现）
// export {
//   useControllableState,
//   useKeyboardNavigation,
//   useOverlay,
//   useFocusReturn,
//   useDebouncedValue,
//   useVirtualList,
// } from '@xorigo-ui/hooks'