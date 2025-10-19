/**
 * 🎨 Xorigo-UI 令牌系统 - 统一导出
 *
 * 基于 DTCG 标准的设计令牌系统
 * 三层架构：令牌 → 转换 → 语义化
 */
export * from './colors';
export * from './category-colors';
export * from './token-transform';
export * from './semantic-tokens';
export * from './themes';
export * from './color-migration';
export * from './theme-validation';
export * from './component-aliases';
export * from './token-accessors';
/**
 * 获取所有设计令牌
 */
export { colorTokens } from './colors';
/**
 * 获取组件分类颜色令牌
 */
export { componentCategoryColors, getCategoryColors, getCategoryIds, hasCategoryColors, getPrimaryColor, getGradientColor, getHoverGradient, type ComponentCategoryColors, type ComponentCategory } from './category-colors';
/**
 * 获取令牌转换器实例
 */
export { TokenTransformer, tokenTransformer } from './token-transform';
/**
 * 获取语义化令牌
 */
export { semanticTokens } from './semantic-tokens';
/**
 * 获取主题管理器
 */
export { themeManager, themeUtils } from './themes';
/**
 * 获取颜色迁移工具
 */
export { ColorMigrator } from './color-migration';
/**
 * 验证主题系统
 */
export { validateThemeSystem } from './theme-validation';
//# sourceMappingURL=index.d.ts.map