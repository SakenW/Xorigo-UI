/**
 * Xorigo UI Core - v2025.11.03 架构统一导出
 *
 * Three-Layer + Eleven-Category + Stability Labels 架构
 * 符合 v2025.11.03 架构规范的统一入口点
 *
 * @version 2025.11.03
 * @category System
 * @layer system
 */

// ============================================================================
// Layer 1: 基础设施层 (Infrastructure Layer)
// ============================================================================

// 设计基础 (Foundations · 设计基础)
export * from './foundations'

// 系统能力 (System · 系统能力)
export * from './system'

// AI智能系统
export * from './ai'

// ============================================================================
// Layer 2: 组件层 (Component Layer) - 十一类分类
// ============================================================================

// 1. Layout · 布局（内部使用，不对外导出）
// export * from './layout'

// 2. Navigation · 导航（内部使用，不对外导出）
// export * from './navigation'

// 3. Inputs & Controls · 输入与控制
export * from './inputs'

// 4. Forms · 表单结构与校验
export * from './forms'

// 5. Data Display · 数据展示
export * from './data-display'

// 6. Typography & Media · 文本与媒体
export * from './typography-media'

// 7. Charts · 图表（可视化）
export * from './charts'

// 8. Feedback & Status · 反馈与状态（内部使用，不对外导出）
// export * from './feedback'

// 9. Overlays · 浮层（内部使用，不对外导出）
// export * from './overlays'

// 10. Interactive · 高阶交互（内部使用，不对外导出）
// export * from './interactive'

// 11. Utilities · 工具性组件
export * from './utilities'

// ============================================================================
// Layer 3: 原子级组件 (Primitives Layer)
// ============================================================================

// 原子级组件 (Primitives · 原子级组件)
// export * from './primitives'

// ============================================================================
// 特殊功能层 (Special Features)
// ============================================================================

// 动画系统 (Motion · 动画效果)
export * from './motion'

// 特效组件 (Effects · 视觉特效)
export * from './effects'

// 展示组件 (Showcase · 演示组件)
export * from './showcase'

// 工具函数 (Utils · 工具函数)
export * from './utils'

// ============================================================================
// Legacy 兼容性导出 (Legacy Compatibility)
// ============================================================================

// 向后兼容的品牌组件
export * from './branding/navbar-origin-logo'

// 向后兼容的主题组件
export { useSevenAxisTheme as useTheme } from './theme/use-theme'
export { AdvancedThemeSwitcher } from './feedback/advanced-theme-switcher'
export {
  mapRecipeToSystem,
  getAvailableRecipes,
  ThemeBridge,
  useThemeBridge,
  ThemeToggleButton,
  ThemeSelector,
  // 向后兼容
  THEME_RECIPE_MAPPING,
  SYSTEM_TO_RECIPE_MAPPING
} from './theme'

// 向后兼容的营销组件
export * from './MarketingComponents'
