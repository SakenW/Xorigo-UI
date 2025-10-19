/**
 * 🔄 令牌转换器
 *
 * 将DTCG设计令牌转换为CSS变量，支持主题定制
 */
// 内联颜色令牌定义（避免循环导入）
const colorTokens = {
    neutral: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
    },
    blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
    },
    green: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16',
    },
    red: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a',
    },
    yellow: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        950: '#451a03',
    },
    cyan: {
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee',
        500: '#06b6d4',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63',
        950: '#083344',
    },
    purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7c3aed',
        800: '#6b21a8',
        900: '#581c87',
        950: '#3b0764',
    }
};
/**
 * CSS变量生成器
 */
export class TokenTransformer {
    constructor(config = {}) {
        this.config = {
            prefix: 'xorigo',
            includeAlpha: true,
            customMappings: {},
            ...config
        };
    }
    /**
     * 生成CSS变量字符串
     */
    generateCSSVariables() {
        const variables = [];
        // 转换颜色令牌
        Object.entries(colorTokens).forEach(([scaleName, scale]) => {
            if (typeof scale === 'object' && '50' in scale) {
                Object.entries(scale).forEach(([shade, value]) => {
                    const cssVarName = `--${this.config.prefix}-color-${scaleName}-${shade}`;
                    variables.push(`${cssVarName}: ${value};`);
                });
            }
        });
        return variables.join('\n');
    }
    /**
     * 生成CSS变量映射对象
     */
    generateTokenMapping() {
        const mapping = {};
        Object.entries(colorTokens).forEach(([scaleName, scale]) => {
            if (typeof scale === 'object' && '50' in scale) {
                Object.entries(scale).forEach(([shade, value]) => {
                    const tokenName = `${scaleName}-${shade}`;
                    const cssVarName = `var(--${this.config.prefix}-color-${scaleName}-${shade})`;
                    mapping[tokenName] = cssVarName;
                });
            }
        });
        return mapping;
    }
    /**
     * 获取令牌的CSS变量值
     */
    getToken(tokenPath) {
        const mapping = this.generateTokenMapping();
        return mapping[tokenPath] || null;
    }
    /**
     * 令牌是否存在
     */
    hasToken(tokenPath) {
        return this.getToken(tokenPath) !== null;
    }
    /**
     * 获取所有可用的令牌路径
     */
    getAvailableTokens() {
        return Object.keys(this.generateTokenMapping());
    }
    /**
     * 验证令牌路径格式
     */
    validateTokenPath(tokenPath) {
        const pattern = /^[a-z]+-[0-9]+$/i;
        return pattern.test(tokenPath);
    }
    /**
     * 生成Tailwind配置扩展
     */
    generateTailwindExtension() {
        const mapping = this.generateTokenMapping();
        const themeColors = {};
        // 按色系组织
        Object.entries(colorTokens).forEach(([scaleName, scale]) => {
            if (typeof scale === 'object' && '50' in scale) {
                themeColors[scaleName] = {};
                Object.entries(scale).forEach(([shade, value]) => {
                    const cssVarName = `var(--${this.config.prefix}-color-${scaleName}-${shade})`;
                    themeColors[scaleName][shade] = cssVarName;
                });
            }
        });
        return {
            theme: {
                extend: {
                    colors: themeColors
                }
            }
        };
    }
}
/**
 * 默认转换器实例
 */
export const tokenTransformer = new TokenTransformer();
/**
 * 便捷函数
 */
export const getCSSVariables = () => tokenTransformer.generateCSSVariables();
export const getTokenMapping = () => tokenTransformer.generateTokenMapping();
export const getToken = (tokenPath) => tokenTransformer.getToken(tokenPath);
export default {
    TokenTransformer,
    tokenTransformer,
    getCSSVariables,
    getTokenMapping,
    getToken,
};
