/**
 * 🎨 主题配方系统
 *
 * 基于七轴DTCG配方系统，与真正令牌系统集成，支持动态主题切换
 */
import { TokenTransformer } from './token-transform';
/**
 * 预定义主题配方
 */
export const themeRecipes = {
    'corporate-blue': {
        id: 'corporate-blue',
        name: 'Corporate Blue',
        description: '专业的企业蓝色主题，适用于商业应用',
        axes: {
            mode: 'light',
            base: { neutral: 'standard', contrast: 'medium' },
            accent: { strategy: 'complementary', hues: ['blue'] },
            tone: 'standard',
            density: 'comfortable',
            motion: { pack: 'smooth', curve: 'ease' },
            surface: ['glass', 'solid'],
        },
    },
    'corporate-navy-dark': {
        id: 'corporate-navy-dark',
        name: 'Corporate Navy Dark',
        description: '深色企业主题，适用于专业仪表板',
        axes: {
            mode: 'dark',
            base: { neutral: 'standard', contrast: 'high' },
            accent: { strategy: 'complementary', hues: ['blue'] },
            tone: 'standard',
            density: 'comfortable',
            motion: { pack: 'smooth', curve: 'ease' },
            surface: ['glass', 'solid'],
        },
    },
};
/**
 * 主题配方分类
 */
export const recipeCategories = {
    corporate: ['corporate-blue', 'corporate-navy-dark'],
};
/**
 * 主题配方管理器
 */
export class ThemeRecipeManager {
    constructor() {
        this.currentRecipe = 'corporate-blue';
        this.observer = null;
        this.tokenTransformer = new TokenTransformer();
        // 只在客户端环境初始化 DOM 相关操作
        if (typeof window !== 'undefined') {
            this.initializeObserver();
            this.initializeBaseTokens();
        }
    }
    /**
     * 初始化基础设计令牌为CSS变量
     */
    initializeBaseTokens() {
        // 防御性检查：确保在浏览器环境中
        if (typeof document === 'undefined')
            return;
        const cssVariables = this.tokenTransformer.generateCSSVariables();
        const styleElement = document.createElement('style');
        styleElement.id = 'xorigo-base-tokens';
        styleElement.textContent = `
      :root {
        ${cssVariables}
      }
    `;
        document.head.appendChild(styleElement);
    }
    /**
     * 初始化观察器监听DOM变化
     */
    initializeObserver() {
        if (typeof window !== 'undefined') {
            this.observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                        const newTheme = document.documentElement.getAttribute('data-theme');
                        if (newTheme && newTheme !== this.currentRecipe) {
                            this.currentRecipe = newTheme;
                            this.notifyThemeChange(newTheme);
                        }
                    }
                });
            });
            this.observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['data-theme'],
            });
        }
    }
    /**
     * 应用主题配方
     */
    applyTheme(recipeId) {
        // SSR 环境检查
        if (typeof document === 'undefined') {
            console.warn('applyTheme 只能在浏览器环境中调用');
            return false;
        }
        const recipe = themeRecipes[recipeId];
        if (!recipe) {
            console.warn(`主题配方 "${recipeId}" 不存在`);
            return false;
        }
        try {
            // 第一步：确保基础令牌已初始化（通过 initializeBaseTokens）
            let baseTokenStyle = document.getElementById('xorigo-base-tokens');
            if (!baseTokenStyle) {
                this.initializeBaseTokens();
            }
            // 第二步：应用配方变量（这些变量会覆盖或扩展基础令牌）
            if (recipe.variables) {
                Object.entries(recipe.variables).forEach(([key, value]) => {
                    document.documentElement.style.setProperty(`--${key}`, value);
                });
            }
            // 第三步：应用七轴配方的主题令牌覆盖
            this.applyThemeTokenOverrides(recipe);
            // 更新主题属性
            document.documentElement.setAttribute('data-theme', recipeId);
            this.currentRecipe = recipeId;
            return true;
        }
        catch (error) {
            console.error('应用主题配方失败:', error);
            return false;
        }
    }
    /**
     * 应用主题配方的令牌覆盖
     */
    applyThemeTokenOverrides(recipe) {
        // SSR 环境检查
        if (typeof document === 'undefined')
            return;
        const themeOverrides = {};
        // 根据七轴配置生成令牌覆盖
        const { mode, base, accent, tone, density } = recipe.axes;
        // 模式覆盖：亮/暗/高对比度
        if (mode === 'dark') {
            themeOverrides['--color-neutral-50'] = '#0f172a';
            themeOverrides['--color-neutral-900'] = '#f8fafc';
            themeOverrides['--color-neutral-950'] = '#020617';
        }
        else if (mode === 'hc') {
            themeOverrides['--color-neutral-50'] = '#ffffff';
            themeOverrides['--color-neutral-900'] = '#000000';
            themeOverrides['--color-neutral-950'] = '#000000';
        }
        // 基础色覆盖
        if (base) {
            // 根据配方的基础色配置调整中性色调
            if (base.neutral !== 'standard') {
                this.adjustNeutralTones(themeOverrides, base.neutral);
            }
        }
        // 强调色覆盖
        if (accent && accent.hues.length > 0) {
            this.adjustAccentColors(themeOverrides, accent);
        }
        // 色调调整
        if (tone) {
            this.adjustToneSaturation(themeOverrides, tone);
        }
        // 应用覆盖
        Object.entries(themeOverrides).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
    }
    /**
     * 调整中性色调
     */
    adjustNeutralTones(overrides, neutralType) {
        const adjustments = {
            warm: {
                '--color-neutral-100': '#fef3c7',
                '--color-neutral-200': '#fde68a',
                '--color-neutral-300': '#fcd34d',
            },
            cool: {
                '--color-neutral-100': '#e0f2fe',
                '--color-neutral-200': '#bae6fd',
                '--color-neutral-300': '#7dd3fc',
            },
            gray: {
                '--color-neutral-100': '#f3f4f6',
                '--color-neutral-200': '#e5e7eb',
                '--color-neutral-300': '#d1d5db',
            }
        };
        const adjustment = adjustments[neutralType];
        if (adjustment) {
            Object.assign(overrides, adjustment);
        }
    }
    /**
     * 调整强调色
     */
    adjustAccentColors(overrides, accent) {
        // 根据配方的强调色配置调整主色调
        const primaryHue = accent.hues[0]; // 取第一个主色调
        if (primaryHue === 'purple') {
            overrides['--xorigo-color-primary-500'] = '#a855f7';
            overrides['--xorigo-color-primary-600'] = '#9333ea';
            overrides['--xorigo-color-secondary-500'] = '#ec4899';
            overrides['--xorigo-color-secondary-600'] = '#db2777';
        }
        else if (primaryHue === 'cyan') {
            overrides['--xorigo-color-primary-500'] = '#06b6d4';
            overrides['--xorigo-color-primary-600'] = '#0891b2';
            overrides['--xorigo-color-secondary-500'] = '#14b8a6';
            overrides['--xorigo-color-secondary-600'] = '#0d9488';
        }
        // 可以根据需要添加更多色调调整
    }
    /**
     * 调整饱和度
     */
    adjustToneSaturation(overrides, tone) {
        if (tone === 'vivid') {
            // 增加饱和度调整因子
            overrides['--color-saturation-factor'] = '1.2';
        }
        else if (tone === 'calm') {
            // 降低饱和度调整因子
            overrides['--color-saturation-factor'] = '0.8';
        }
        else {
            // 标准饱和度
            overrides['--color-saturation-factor'] = '1.0';
        }
    }
    /**
     * 获取当前主题
     */
    getCurrentTheme() {
        return this.currentRecipe;
    }
    /**
     * 获取主题配方信息
     */
    getRecipe(recipeId) {
        return themeRecipes[recipeId] || null;
    }
    /**
     * 获取所有可用配方
     */
    getAllRecipes() {
        return { ...themeRecipes };
    }
    /**
     * 按分类获取配方
     */
    getRecipesByCategory(category) {
        const recipeIds = recipeCategories[category] || [];
        return recipeIds
            .map(id => themeRecipes[id])
            .filter((recipe) => recipe !== undefined);
    }
    /**
     * 搜索配方
     */
    searchRecipes(query) {
        const searchLower = query.toLowerCase();
        return Object.values(themeRecipes).filter((recipe) => recipe.name.toLowerCase().includes(searchLower) ||
            recipe.description.toLowerCase().includes(searchLower) ||
            recipe.id.toLowerCase().includes(searchLower));
    }
    /**
     * 主题变化通知器
     */
    notifyThemeChange(themeId) {
        // SSR 环境检查
        if (typeof document === 'undefined')
            return;
        // 触发自定义事件
        const event = new CustomEvent('themechange', {
            detail: { themeId, recipe: this.getRecipe(themeId) },
        });
        document.dispatchEvent(event);
        // 更新localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('xorigo-ui-theme', themeId);
        }
    }
    /**
     * 从本地存储恢复主题
     */
    restoreFromStorage() {
        // SSR 环境检查
        if (typeof window === 'undefined') {
            return 'corporate-blue'; // 返回默认主题但不应用
        }
        if (typeof localStorage !== 'undefined') {
            const savedTheme = localStorage.getItem('xorigo-ui-theme');
            if (savedTheme && themeRecipes[savedTheme]) {
                this.applyTheme(savedTheme);
                return savedTheme;
            }
        }
        // 应用默认主题
        this.applyTheme('corporate-blue');
        return 'corporate-blue';
    }
    /**
     * 清理资源
     */
    dispose() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }
}
/**
 * 默认主题管理器实例（延迟初始化以支持 SSR）
 */
let themeManagerInstance = null;
export const themeManager = typeof window !== 'undefined'
    ? new ThemeRecipeManager()
    : {
        applyTheme: () => false,
        getCurrentTheme: () => 'corporate-blue',
        getRecipe: () => null,
        getAllRecipes: () => ({}),
        getRecipesByCategory: () => [],
        searchRecipes: () => [],
        restoreFromStorage: () => 'corporate-blue',
        dispose: () => { },
    };
/**
 * 主题工具函数
 */
export const themeUtils = {
    /**
     * 应用主题配方
     */
    applyTheme: (recipeId) => themeManager.applyTheme(recipeId),
    /**
     * 获取当前主题
     */
    getCurrentTheme: () => themeManager.getCurrentTheme(),
    /**
     * 获取主题信息
     */
    getThemeInfo: (recipeId) => themeManager.getRecipe(recipeId),
    /**
     * 切换到亮色主题
     */
    switchToLightTheme: () => {
        const lightRecipes = ['corporate-blue', 'minimal-white', 'tech-cyan', 'creative-purple', 'classic-neutral'];
        const currentTheme = themeManager.getCurrentTheme();
        // 如果当前是暗色主题，切换到对应的亮色版本
        const lightRecipeMap = {
            'corporate-navy-dark': 'corporate-blue',
            'minimal-graphite-dark': 'minimal-white',
            'tech-neon-dark': 'tech-cyan',
            'creative-aurora-dark': 'creative-purple',
        };
        const targetRecipe = lightRecipeMap[currentTheme] || 'corporate-blue';
        return themeManager.applyTheme(targetRecipe);
    },
    /**
     * 切换到暗色主题
     */
    switchToDarkTheme: () => {
        const darkRecipes = ['corporate-navy-dark', 'minimal-graphite-dark', 'tech-neon-dark', 'creative-aurora-dark'];
        const currentTheme = themeManager.getCurrentTheme();
        // 如果当前是亮色主题，切换到对应的暗色版本
        const darkRecipeMap = {
            'corporate-blue': 'corporate-navy-dark',
            'minimal-white': 'minimal-graphite-dark',
            'tech-cyan': 'tech-neon-dark',
            'creative-purple': 'creative-aurora-dark',
            'classic-neutral': 'minimal-graphite-dark',
        };
        const targetRecipe = darkRecipeMap[currentTheme] || 'corporate-navy-dark';
        return themeManager.applyTheme(targetRecipe);
    },
    /**
     * 切换主题模式
     */
    toggleThemeMode: () => {
        const currentTheme = themeManager.getCurrentTheme();
        const isDark = currentTheme.includes('dark') || currentTheme === 'high-contrast-pro';
        return isDark ? themeUtils.switchToLightTheme() : themeUtils.switchToDarkTheme();
    },
};
export default {
    themeRecipes,
    recipeCategories,
    ThemeRecipeManager,
    themeManager,
    themeUtils,
};
