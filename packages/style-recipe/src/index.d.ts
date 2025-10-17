/**
 * 🎨 TH-UI 风格配方体系 - 主入口
 *
 * 提供完整的七轴风格配方系统
 * 基于 OKLCH 色彩空间和 WCAG 2.2 标准
 */
export type { StyleRecipe, StyleRecipeID, ModeAxis, BaseAxis, AccentAxis, ToneAxis, DensityAxis, MotionAxis, SurfaceAxis, StyleAxis, ResponseLevel, ResponseLevelConfig, AxisLock, AxisLockRule, CoreTokens, RoleTokens, ComponentTokens, ColorScale, ElevationScale, MotionBase, SurfaceBase, TypographyScale, SpacingScale, ParsedRecipe, RecipeEngineConfig, RecipeValidationResult, ParseRecipeID, } from './types';
export { corporateBlueRecipe, corporateNavyDarkRecipe, minimalWhiteRecipe, minimalGraphiteDarkRecipe, techCyanRecipe, techNeonDarkRecipe, creativePurpleRecipe, creativeAuroraDarkRecipe, classicNeutralRecipe, highContrastProRecipe, officialRecipes, recipeMap, recipesByCategory, getRecipe, getRecipesByCategory, searchRecipes, getRecommendedRecipes, validateRecipeID, parseRecipeID, } from './recipes';
export { neutralScale, cyanScale, blueScale, purpleScale, magentaScale, grayScale, successScale, warningScale, errorScale, infoScale, elevationScale, motionBase, surfaceBase, typographyScale, spacingScale, coreTokens, } from './tokens/core';
export { StyleRecipeEngine, defaultRecipeEngine, parseRecipe, validateRecipeAccessibility, getCurrentRecipe, } from './engine';
export { StyleRecipeProvider, useStyleRecipe, useStyleRecipeCSS, useResponseLevel, useAxisLock, StyleRecipeContext, type StyleRecipeContextType, } from './provider/StyleRecipeProvider';
/**
 * 获取配方的简短描述
 */
export declare function getRecipeDescription(recipeId: StyleRecipeID): string;
/**
 * 检查配方是否适合当前场景
 */
export declare function isRecipeSuitable(recipe: StyleRecipe, context: {
    responseLevel?: ResponseLevel;
    accessibilityMode?: 'strict' | 'standard' | 'relaxed';
    motionPreference?: 'no-preference' | 'reduce';
}): boolean;
/**
 * 获取推荐配方列表（基于上下文）
 */
export declare function getContextualRecommendations(context: {
    category?: string;
    responseLevel?: ResponseLevel;
    accessibilityMode?: 'strict' | 'standard' | 'relaxed';
    motionPreference?: 'no-preference' | 'reduce';
}): StyleRecipe[];
/**
 * 默认配方 ID
 */
export declare const DEFAULT_RECIPE: StyleRecipeID;
/**
 * 支持的配方类别
 */
export declare const RECIPE_CATEGORIES: readonly ["corporate", "minimal", "tech", "creative", "classic"];
/**
 * 响应级别常量
 */
export declare const RESPONSE_LEVELS: readonly ["L0", "L1", "L2", "L3"];
/**
 * 可访问性模式
 */
export declare const ACCESSIBILITY_MODES: readonly ["strict", "standard", "relaxed"];
/**
 * 风格轴常量
 */
export declare const STYLE_AXES: {
    readonly MODE: readonly ["light", "dark", "hc"];
    readonly BASE: readonly ["neutral-warm", "neutral-cool", "neutral-true"];
    readonly TONE: readonly ["calm", "standard", "vivid"];
    readonly DENSITY: readonly ["spacious", "comfortable", "compact"];
    readonly MOTION: readonly ["subtle", "standard", "expressive"];
    readonly SURFACE: readonly ["flat", "soft-shadow", "glass", "neon"];
};
export declare const STYLE_RECIPE_VERSION = "1.0.0";
export declare const STYLE_RECIPE_BUILD_DATE: string;
/**
 * 获取版本信息
 */
export declare function getVersionInfo(): {
    version: string;
    buildDate: string;
    features: string[];
};
//# sourceMappingURL=index.d.ts.map