/**
 * 🎨 Xorigo UI 风格配方体系 - 风格配方提供者
 *
 * 基于 React 19 + TypeScript 的现代主题系统
 * 支持七轴风格配方、响应级别控制、轴锁等高级功能
 */
import React, { type ReactNode } from 'react';
import type { StyleRecipe, StyleRecipeID, ParsedRecipe, ResponseLevel, AxisLockRule, RecipeValidationResult } from '../types';
/**
 * 风格配方上下文类型
 */
export interface StyleRecipeContextType {
    currentRecipe: StyleRecipe | null;
    currentRecipeID: StyleRecipeID;
    parsedRecipe: ParsedRecipe | null;
    isTransitioning: boolean;
    setRecipe: (recipeID: StyleRecipeID) => Promise<boolean>;
    setRecipeByCategory: (category: string) => Promise<boolean>;
    setRandomRecipe: () => Promise<boolean>;
    searchRecipes: (query: string) => StyleRecipe[];
    availableRecipes: StyleRecipe[];
    categories: string[];
    recommendedRecipes: StyleRecipe[];
    recipesByCategory: Record<string, StyleRecipe[]>;
    axisLocks: AxisLockRule[];
    applyAxisLock: (lock: AxisLockRule) => void;
    clearAxisLocks: () => void;
    responseLevel: ResponseLevel;
    setResponseLevel: (level: ResponseLevel) => void;
    validateCurrentRecipe: () => RecipeValidationResult;
    accessibilityMode: 'strict' | 'standard' | 'relaxed';
    setAccessibilityMode: (mode: 'strict' | 'standard' | 'relaxed') => void;
    updateEngineConfig: (config: any) => void;
}
declare const StyleRecipeContext: React.Context<StyleRecipeContextType>;
/**
 * 风格配方提供者
 */
export declare function StyleRecipeProvider({ children, defaultRecipe, enableTransitions, transitionDuration, }: {
    children: ReactNode;
    defaultRecipe?: StyleRecipeID;
    enableTransitions?: boolean;
    transitionDuration?: number;
}): import("react/jsx-runtime").JSX.Element;
/**
 * 使用风格配方
 */
export declare function useStyleRecipe(): StyleRecipeContextType;
/**
 * 使用当前配方的 CSS 变量
 */
export declare function useStyleRecipeCSS(): Record<string, string>;
/**
 * 使用响应级别控制
 */
export declare function useResponseLevel(level?: ResponseLevel): ResponseLevel;
/**
 * 使用轴锁
 */
export declare function useAxisLock(locks?: AxisLockRule[]): {
    axisLocks: AxisLockRule[];
    applyAxisLock: (lock: AxisLockRule) => void;
    clearAxisLocks: () => void;
};
export { StyleRecipeContext };
//# sourceMappingURL=StyleRecipeProvider.d.ts.map