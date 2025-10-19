/**
 * 🎨 主题配方系统
 *
 * 基于七轴DTCG配方系统，与真正令牌系统集成，支持动态主题切换
 */
/**
 * 主题配方类型定义
 */
export interface ThemeRecipe {
    id: string;
    name: string;
    description: string;
    axes: {
        mode?: 'light' | 'dark' | 'hc';
        base?: {
            neutral: string;
            contrast: string;
        };
        accent?: {
            strategy: string;
            hues: string[];
        };
        tone?: 'calm' | 'standard' | 'vivid';
        density?: 'spacious' | 'comfortable' | 'compact';
        motion?: {
            pack: string;
            curve: string;
        };
        surface?: string[];
    };
    oklchTone?: Record<string, {
        dC: number;
        dL: number;
    }>;
    a11y?: {
        text: number;
        largeText: number;
        nonText: number;
    };
    variables?: Record<string, string>;
}
/**
 * 预定义主题配方
 */
export declare const themeRecipes: Record<string, ThemeRecipe>;
/**
 * 主题配方分类
 */
export declare const recipeCategories: {
    readonly corporate: readonly ["corporate-blue", "corporate-navy-dark"];
};
/**
 * 主题配方管理器
 */
export declare class ThemeRecipeManager {
    private currentRecipe;
    private observer;
    private tokenTransformer;
    constructor();
    /**
     * 初始化基础设计令牌为CSS变量
     */
    private initializeBaseTokens;
    /**
     * 初始化观察器监听DOM变化
     */
    private initializeObserver;
    /**
     * 应用主题配方
     */
    applyTheme(recipeId: string): boolean;
    /**
     * 应用主题配方的令牌覆盖
     */
    private applyThemeTokenOverrides;
    /**
     * 调整中性色调
     */
    private adjustNeutralTones;
    /**
     * 调整强调色
     */
    private adjustAccentColors;
    /**
     * 调整饱和度
     */
    private adjustToneSaturation;
    /**
     * 获取当前主题
     */
    getCurrentTheme(): string;
    /**
     * 获取主题配方信息
     */
    getRecipe(recipeId: string): ThemeRecipe | null;
    /**
     * 获取所有可用配方
     */
    getAllRecipes(): Record<string, ThemeRecipe>;
    /**
     * 按分类获取配方
     */
    getRecipesByCategory(category: keyof typeof recipeCategories): ThemeRecipe[];
    /**
     * 搜索配方
     */
    searchRecipes(query: string): ThemeRecipe[];
    /**
     * 主题变化通知器
     */
    private notifyThemeChange;
    /**
     * 从本地存储恢复主题
     */
    restoreFromStorage(): string;
    /**
     * 清理资源
     */
    dispose(): void;
}
export declare const themeManager: ThemeRecipeManager;
/**
 * 主题工具函数
 */
export declare const themeUtils: {
    /**
     * 应用主题配方
     */
    applyTheme: (recipeId: string) => boolean;
    /**
     * 获取当前主题
     */
    getCurrentTheme: () => string;
    /**
     * 获取主题信息
     */
    getThemeInfo: (recipeId: string) => ThemeRecipe | null;
    /**
     * 切换到亮色主题
     */
    switchToLightTheme: () => boolean;
    /**
     * 切换到暗色主题
     */
    switchToDarkTheme: () => boolean;
    /**
     * 切换主题模式
     */
    toggleThemeMode: () => boolean;
};
declare const _default: {
    themeRecipes: Record<string, ThemeRecipe>;
    recipeCategories: {
        readonly corporate: readonly ["corporate-blue", "corporate-navy-dark"];
    };
    ThemeRecipeManager: typeof ThemeRecipeManager;
    themeManager: ThemeRecipeManager;
    themeUtils: {
        /**
         * 应用主题配方
         */
        applyTheme: (recipeId: string) => boolean;
        /**
         * 获取当前主题
         */
        getCurrentTheme: () => string;
        /**
         * 获取主题信息
         */
        getThemeInfo: (recipeId: string) => ThemeRecipe | null;
        /**
         * 切换到亮色主题
         */
        switchToLightTheme: () => boolean;
        /**
         * 切换到暗色主题
         */
        switchToDarkTheme: () => boolean;
        /**
         * 切换主题模式
         */
        toggleThemeMode: () => boolean;
    };
};
export default _default;
//# sourceMappingURL=themes.d.ts.map