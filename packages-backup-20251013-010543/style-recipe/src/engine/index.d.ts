/**
 * 🎨 TH-UI 风格配方体系 - 配方引擎 (Recipe Engine)
 *
 * 核心功能：
 * 1. 解析风格配方 ID
 * 2. 生成三层令牌系统
 * 3. 应用轴锁规则
 * 4. 生成 CSS 变量
 * 5. 可访问性验证
 */
import type { StyleRecipe, StyleRecipeID, ParsedRecipe, RecipeEngineConfig, AxisLockRule, RecipeValidationResult } from '../types';
/**
 * 风格配方引擎
 */
export declare class StyleRecipeEngine {
    private config;
    private currentRecipe;
    private axisLocks;
    constructor(config?: Partial<RecipeEngineConfig>);
    /**
     * 解析并应用风格配方
     */
    parseRecipe(recipeId: StyleRecipeID, axisLocks?: AxisLockRule[]): ParsedRecipe | null;
    /**
     * 生成语义令牌 (Role Tokens)
     */
    private generateRoleTokens;
    /**
     * 生成组件别名令牌 (Component Tokens)
     */
    private generateComponentTokens;
    /**
     * 生成 CSS 变量
     */
    private generateCSSVariables;
    /**
     * 解析 Base 轴
     */
    private parseBaseAxis;
    /**
     * 解析 Accent 轴
     */
    private parseAccentAxis;
    /**
     * 解析 Tone 轴
     */
    private parseToneAxis;
    /**
     * 解析 Density 轴
     */
    private parseDensityAxis;
    /**
     * 获取主色标度
     */
    private getAccentScale;
    /**
     * 应用 Dark 模式非对称映射
     */
    private applyDarkModeMapping;
    /**
     * 生成背景令牌
     */
    private generateBackgroundTokens;
    /**
     * 生成文本令牌
     */
    private generateTextTokens;
    /**
     * 生成边框令牌
     */
    private generateBorderTokens;
    /**
     * 生成强调色令牌
     */
    private generateAccentTokens;
    /**
     * 生成状态令牌
     */
    private generateStateTokens;
    /**
     * 初始化响应级别配置
     */
    private initResponseLevels;
    /**
     * 验证配方可访问性
     */
    validateAccessibility(recipe: StyleRecipe): RecipeValidationResult;
    /**
     * 计算对比度分数
     */
    private calculateContrastScore;
    /**
     * 从 OKLCH 值中提取亮度
     */
    private extractLightness;
    /**
     * 获取当前配方
     */
    getCurrentRecipe(): StyleRecipe | null;
    /**
     * 获取配置
     */
    getConfig(): RecipeEngineConfig;
    /**
     * 更新配置
     */
    updateConfig(newConfig: Partial<RecipeEngineConfig>): void;
    /**
     * 应用轴锁
     */
    applyAxisLocks(locks: AxisLockRule[]): void;
    /**
     * 清除轴锁
     */
    clearAxisLocks(): void;
}
/**
 * 默认配方引擎实例
 */
export declare const defaultRecipeEngine: StyleRecipeEngine;
/**
 * 解析配方
 */
export declare function parseRecipe(recipeId: StyleRecipeID, axisLocks?: AxisLockRule[]): ParsedRecipe | null;
/**
 * 验证配方可访问性
 */
export declare function validateRecipeAccessibility(recipe: StyleRecipe): RecipeValidationResult;
/**
 * 获取当前配方
 */
export declare function getCurrentRecipe(): StyleRecipe | null;
//# sourceMappingURL=index.d.ts.map