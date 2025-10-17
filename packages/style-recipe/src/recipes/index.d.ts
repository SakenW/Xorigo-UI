/**
 * 🎨 TH-UI 风格配方体系 - 官方配方集合
 *
 * 基于设计指南 v1.0 的 10 条官方配方
 * 支持完整的七轴风格配方系统
 */
import type { StyleRecipe, StyleRecipeID, ModeAxis, BaseAxis, AccentAxis, ToneAxis, DensityAxis, MotionAxis, SurfaceAxis } from '../types';
/**
 * Corporate Blue - 企业/SaaS 控制台
 * Recipe: light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow
 */
export declare const corporateBlueRecipe: StyleRecipe;
/**
 * Corporate Navy Dark - 深色企业后台
 * Recipe: dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow
 */
export declare const corporateNavyDarkRecipe: StyleRecipe;
/**
 * Minimal White - 文档/内容主题
 * Recipe: light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat
 */
export declare const minimalWhiteRecipe: StyleRecipe;
/**
 * Minimal Graphite Dark - 内容深色主题
 * Recipe: dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat
 */
export declare const minimalGraphiteDarkRecipe: StyleRecipe;
/**
 * Tech Cyan - 开发者平台
 * Recipe: light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow
 */
export declare const techCyanRecipe: StyleRecipe;
/**
 * Tech Neon Dark - AI/品牌页
 * Recipe: dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon
 */
export declare const techNeonDarkRecipe: StyleRecipe;
/**
 * Creative Purple - 设计/创意主题
 * Recipe: light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring
 */
export declare const creativePurpleRecipe: StyleRecipe;
/**
 * Creative Aurora Dark - 品牌/展示主题
 * Recipe: dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass
 */
export declare const creativeAuroraDarkRecipe: StyleRecipe;
/**
 * Classic Neutral - 默认通用主题
 * Recipe: light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow
 */
export declare const classicNeutralRecipe: StyleRecipe;
/**
 * High-Contrast Pro - 无障碍/高可读主题
 * Recipe: hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat
 */
export declare const highContrastProRecipe: StyleRecipe;
/**
 * 所有官方配方
 */
export declare const officialRecipes: StyleRecipe[];
/**
 * 配方映射表
 */
export declare const recipeMap: Record<string, StyleRecipe>;
/**
 * 按类别分组的配方
 */
export declare const recipesByCategory: Record<string, StyleRecipe[]>;
/**
 * 获取配方
 */
export declare function getRecipe(id: StyleRecipeID): StyleRecipe | undefined;
/**
 * 按类别获取配方
 */
export declare function getRecipesByCategory(category: string): StyleRecipe[];
/**
 * 搜索配方
 */
export declare function searchRecipes(query: string): StyleRecipe[];
/**
 * 获取推荐配方
 */
export declare function getRecommendedRecipes(): StyleRecipe[];
/**
 * 验证配方ID格式
 */
export declare function validateRecipeID(id: string): boolean;
/**
 * 解析配方ID
 */
export declare function parseRecipeID(id: string): {
    mode: ModeAxis;
    base: BaseAxis;
    accent: AccentAxis;
    tone: ToneAxis;
    density: DensityAxis;
    motion: MotionAxis;
    surface: SurfaceAxis;
} | null;
//# sourceMappingURL=index.d.ts.map