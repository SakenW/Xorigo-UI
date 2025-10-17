// @ts-nocheck
/**
 * 🎨 TH-UI 风格配方体系 - 主入口
 *
 * 提供完整的七轴风格配方系统
 * 基于 OKLCH 色彩空间和 WCAG 2.2 标准
 */
// ============================================================================
// 配方集合 (Recipe Collection)
// ============================================================================
export { 
// 官方配方
corporateBlueRecipe, corporateNavyDarkRecipe, minimalWhiteRecipe, minimalGraphiteDarkRecipe, techCyanRecipe, techNeonDarkRecipe, creativePurpleRecipe, creativeAuroraDarkRecipe, classicNeutralRecipe, highContrastProRecipe, 
// 配方集合与工具
officialRecipes, recipeMap, recipesByCategory, getRecipe, getRecipesByCategory, searchRecipes, getRecommendedRecipes, validateRecipeID, parseRecipeID, } from './recipes';
// ============================================================================
// 核心令牌 (Core Tokens)
// ============================================================================
export { 
// OKLCH 色彩空间核心色板
neutralScale, cyanScale, blueScale, purpleScale, magentaScale, grayScale, 
// 状态色标度
successScale, warningScale, errorScale, infoScale, 
// 高度、动效、表面基础
elevationScale, motionBase, surfaceBase, 
// 基础标尺
typographyScale, spacingScale, 
// 核心令牌集合
coreTokens, } from './tokens/core';
// ============================================================================
// 配方引擎 (Recipe Engine)
// ============================================================================
export { 
// 引擎类
StyleRecipeEngine, 
// 默认实例
defaultRecipeEngine, 
// 便捷函数
parseRecipe, validateRecipeAccessibility, getCurrentRecipe, } from './engine';
// ============================================================================
// React 提供者 (React Provider)
// ============================================================================
export { 
// 提供者组件
StyleRecipeProvider, 
// Hook
useStyleRecipe, useStyleRecipeCSS, useResponseLevel, useAxisLock, 
// 上下文
StyleRecipeContext, } from './provider/StyleRecipeProvider';
// ============================================================================
// 工具函数 (Utility Functions)
// ============================================================================
/**
 * 获取配方的简短描述
 */
export function getRecipeDescription(recipeId) {
    const recipe = getRecipe(recipeId);
    return recipe?.description || 'Unknown recipe';
}
/**
 * 检查配方是否适合当前场景
 */
export function isRecipeSuitable(recipe, context) {
    // 检查响应级别兼容性
    if (context.responseLevel === 'L0' && recipe.category !== 'classic') {
        return false;
    }
    // 检查可访问性模式
    if (context.accessibilityMode === 'strict' && !recipe.accessibility.cvdFriendly) {
        return false;
    }
    // 检查动效偏好
    if (context.motionPreference === 'reduce' && recipe.motion.includes('expressive')) {
        return false;
    }
    return true;
}
/**
 * 获取推荐配方列表（基于上下文）
 */
export function getContextualRecommendations(context) {
    let recipes = officialRecipes;
    // 按类别过滤
    if (context.category) {
        recipes = recipes.filter(r => r.category === context.category);
    }
    // 按适合性过滤
    recipes = recipes.filter(r => isRecipeSuitable(r, context));
    // 排序：优先推荐可访问性友好的配方
    recipes.sort((a, b) => {
        const aScore = a.accessibility.cvdFriendly ? 1 : 0;
        const bScore = b.accessibility.cvdFriendly ? 1 : 0;
        return bScore - aScore;
    });
    return recipes.slice(0, 5); // 返回前 5 个推荐
}
// ============================================================================
// 常量定义 (Constants)
// ============================================================================
/**
 * 默认配方 ID
 */
export const DEFAULT_RECIPE = 'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow';
/**
 * 支持的配方类别
 */
export const RECIPE_CATEGORIES = [
    'corporate',
    'minimal',
    'tech',
    'creative',
    'classic',
];
/**
 * 响应级别常量
 */
export const RESPONSE_LEVELS = ['L0', 'L1', 'L2', 'L3'];
/**
 * 可访问性模式
 */
export const ACCESSIBILITY_MODES = ['strict', 'standard', 'relaxed'];
/**
 * 风格轴常量
 */
export const STYLE_AXES = {
    MODE: ['light', 'dark', 'hc'],
    BASE: ['neutral-warm', 'neutral-cool', 'neutral-true'],
    TONE: ['calm', 'standard', 'vivid'],
    DENSITY: ['spacious', 'comfortable', 'compact'],
    MOTION: ['subtle', 'standard', 'expressive'],
    SURFACE: ['flat', 'soft-shadow', 'glass', 'neon'],
};
// ============================================================================
// 版本信息 (Version Information)
// ============================================================================
export const STYLE_RECIPE_VERSION = '1.0.0';
export const STYLE_RECIPE_BUILD_DATE = new Date().toISOString();
/**
 * 获取版本信息
 */
export function getVersionInfo() {
    return {
        version: STYLE_RECIPE_VERSION,
        buildDate: STYLE_RECIPE_BUILD_DATE,
        features: [
            'Seven-axis style recipe system',
            'Three-layer token architecture',
            'OKLCH color space support',
            'WCAG 2.2 compliance',
            'Response level control',
            'Axis lock system',
            'Accessibility validation',
            'Dark mode asymmetric mapping',
        ],
    };
}
