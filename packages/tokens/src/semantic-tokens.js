/**
 * 🎨 语义化令牌系统
 *
 * 将原始设计令牌映射为语义化令牌，用于组件开发
 */
/**
 * 语义化颜色令牌映射
 * 基于使用场景和UI功能定义，而非设计意图
 */
export const semanticColors = {
    // === 基础UI颜色 ===
    // 文本颜色
    'text-primary': 'var(--color-neutral-900)',
    'text-secondary': 'var(--color-neutral-600)',
    'text-tertiary': 'var(--color-neutral-400)',
    'text-inverse': 'var(--color-neutral-50)',
    'text-disabled': 'var(--color-neutral-300)',
    // 背景颜色
    'bg-primary': 'var(--color-neutral-50)',
    'bg-secondary': 'var(--color-white)',
    'bg-tertiary': 'var(--color-neutral-100)',
    'bg-inverse': 'var(--color-neutral-900)',
    'bg-disabled': 'var(--color-neutral-200)',
    // 边框颜色
    'border-primary': 'var(--color-neutral-200)',
    'border-secondary': 'var(--color-neutral-300)',
    'border-focus': 'var(--color-blue-500)',
    // === 交互状态颜色 ===
    // 主色系（用于主要操作）
    'bg-primary-action': 'var(--color-blue-500)',
    'bg-primary-action-hover': 'var(--color-blue-600)',
    'text-primary-action': 'var(--color-blue-500)',
    'text-primary-action-hover': 'var(--color-blue-600)',
    'border-primary-action': 'var(--color-blue-500)',
    'ring-primary-action': 'var(--color-blue-500)',
    // 次色系（用于次要操作）
    'bg-secondary-action': 'var(--color-purple-500)',
    'bg-secondary-action-hover': 'var(--color-purple-600)',
    'text-secondary-action': 'var(--color-purple-500)',
    'text-secondary-action-hover': 'var(--color-purple-600)',
    // === 状态反馈颜色 ===
    // 成功状态
    'bg-success': 'var(--color-green-500)',
    'bg-success-hover': 'var(--color-green-600)',
    'text-success': 'var(--color-green-600)',
    'border-success': 'var(--color-green-500)',
    'ring-success': 'var(--color-green-500)',
    // 警告状态
    'bg-warning': 'var(--color-yellow-500)',
    'bg-warning-hover': 'var(--color-yellow-600)',
    'text-warning': 'var(--color-yellow-600)',
    'border-warning': 'var(--color-yellow-500)',
    'ring-warning': 'var(--color-yellow-500)',
    // 错误状态
    'bg-error': 'var(--color-red-500)',
    'bg-error-hover': 'var(--color-red-600)',
    'text-error': 'var(--color-red-600)',
    'ring-error': 'var(--color-red-500)',
    // 信息状态
    'bg-info': 'var(--color-cyan-500)',
    'bg-info-hover': 'var(--color-cyan-600)',
    'text-info': 'var(--color-cyan-600)',
    'border-info': 'var(--color-cyan-500)',
    'ring-info': 'var(--color-cyan-500)',
    // === 状态边框颜色 ===
    // (已在上面的状态中定义)
    // === 特殊用途颜色 ===
    // 高对比度
    'bg-contrast-high': 'var(--color-neutral-950)',
    'text-contrast-high': 'var(--color-white)',
    // 玻璃效果
    'bg-glass': 'rgba(255, 255, 255, 0.8)',
    'border-glass': 'rgba(255, 255, 255, 0.2)',
    'text-glass': 'rgba(0, 0, 0, 0.8)',
    // 悬浮层
    'bg-overlay': 'rgba(0, 0, 0, 0.5)',
    'bg-floating': 'var(--color-white)',
    'border-floating': 'var(--color-neutral-200)',
    'shadow-floating': '0 10px 25px rgba(0, 0, 0, 0.1)',
    // === 高级视觉效果 ===
    // 渐变效果
    'gradient-primary': 'linear-gradient(135deg, var(--color-blue-500) 0%, var(--color-purple-500) 100%)',
    'gradient-success': 'linear-gradient(135deg, var(--color-green-400) 0%, var(--color-cyan-500) 100%)',
    'gradient-warning': 'linear-gradient(135deg, var(--color-yellow-400) 0%, var(--color-orange-500) 100%)',
    'gradient-danger': 'linear-gradient(135deg, var(--color-red-500) 0%, var(--color-pink-500) 100%)',
    'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    'gradient-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
    // 光晕效果
    'glow-primary': '0 0 20px rgba(59, 130, 246, 0.5)',
    'glow-success': '0 0 20px rgba(34, 197, 94, 0.5)',
    'glow-warning': '0 0 20px rgba(251, 191, 36, 0.5)',
    'glow-danger': '0 0 20px rgba(239, 68, 68, 0.5)',
    'glow-soft': '0 0 30px rgba(168, 85, 247, 0.3)',
    // 边框渐变
    'border-gradient-primary': 'linear-gradient(135deg, var(--color-blue-400), var(--color-purple-400))',
    'border-gradient-rainbow': 'linear-gradient(90deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899)',
};
/**
 * 语义化间距令牌
 */
export const semanticSpacing = {
    'spacing-xs': 'var(--spacing-1)',
    'spacing-sm': 'var(--spacing-2)',
    'spacing-md': 'var(--spacing-4)',
    'spacing-lg': 'var(--spacing-6)',
    'spacing-xl': 'var(--spacing-8)',
    'spacing-2xl': 'var(--spacing-12)',
    'spacing-3xl': 'var(--spacing-16)',
    'spacing-4xl': 'var(--spacing-24)',
};
/**
 * 语义化字体令牌
 */
export const semanticTypography = {
    'text-xs': 'var(--font-size-xs)',
    'text-sm': 'var(--font-size-sm)',
    'text-base': 'var(--font-size-base)',
    'text-lg': 'var(--font-size-lg)',
    'text-xl': 'var(--font-size-xl)',
    'text-2xl': 'var(--font-size-2xl)',
    'text-3xl': 'var(--font-size-3xl)',
    'font-light': 'var(--font-weight-light)',
    'font-normal': 'var(--font-weight-normal)',
    'font-medium': 'var(--font-weight-medium)',
    'font-semibold': 'var(--font-weight-semibold)',
    'font-bold': 'var(--font-weight-bold)',
};
/**
 * 语义化阴影令牌
 */
export const semanticShadows = {
    'shadow-sm': 'var(--shadow-sm)',
    'shadow-md': 'var(--shadow)',
    'shadow-lg': 'var(--shadow-lg)',
    'shadow-xl': 'var(--shadow-xl)',
    'shadow-2xl': 'var(--shadow-2xl)',
    // 高级阴影效果
    'shadow-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    'shadow-colored-sm': '0 1px 2px 0 rgba(59, 130, 246, 0.1)',
    'shadow-colored-md': '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
    'shadow-colored-lg': '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
    'shadow-glow': '0 0 15px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)',
    'shadow-neon': '0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.4), 0 0 15px rgba(59, 130, 246, 0.3)',
};
/**
 * 语义化圆角令牌
 */
export const semanticBorderRadius = {
    'radius-none': 'var(--radius-none)',
    'radius-sm': 'var(--radius-sm)',
    'radius-md': 'var(--radius)',
    'radius-lg': 'var(--radius-lg)',
    'radius-xl': 'var(--radius-xl)',
    'radius-full': 'var(--radius-full)',
};
/**
 * 动画和过渡令牌
 */
export const semanticAnimations = {
    // 过渡时长
    'transition-fast': '150ms',
    'transition-base': '200ms',
    'transition-slow': '300ms',
    'transition-slower': '500ms',
    // 过渡函数
    'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    'ease-elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    // 关键帧动画
    'animate-fade-in': 'fadeIn 0.3s ease-smooth',
    'animate-fade-out': 'fadeOut 0.3s ease-smooth',
    'animate-slide-in': 'slideIn 0.3s ease-smooth',
    'animate-slide-out': 'slideOut 0.3s ease-smooth',
    'animate-scale-in': 'scaleIn 0.2s ease-smooth',
    'animate-shimmer': 'shimmer 2s infinite',
    'animate-pulse-soft': 'pulseSoft 2s ease-in-out infinite',
    'animate-float': 'float 3s ease-in-out infinite',
};
/**
 * 组合语义化令牌
 */
export const semanticTokens = {
    colors: semanticColors,
    spacing: semanticSpacing,
    typography: semanticTypography,
    shadows: semanticShadows,
    borderRadius: semanticBorderRadius,
    animations: semanticAnimations,
};
/**
 * 语义化令牌工具函数
 */
export const semanticUtils = {
    /**
     * 获取语义化颜色
     */
    getColor: (name) => {
        return semanticColors[name] || semanticColors['text-primary'];
    },
    /**
     * 获取语义化间距
     */
    getSpacing: (name) => {
        return semanticSpacing[name] || semanticSpacing['spacing-md'];
    },
    /**
     * 获取语义化字体
     */
    getTypography: (name) => {
        return semanticTypography[name] || semanticTypography['text-base'];
    },
    /**
     * 验证语义化令牌名称
     */
    isValidSemanticToken: (token) => {
        const parts = token.split('-');
        if (parts.length < 2)
            return false;
        const [category, name] = parts;
        return ['color', 'spacing', 'text', 'font', 'shadow', 'radius'].includes(category) && Boolean(name);
    },
    /**
     * 获取所有语义化令牌名称
     */
    getAllSemanticTokens: () => {
        return [
            ...Object.keys(semanticColors),
            ...Object.keys(semanticSpacing),
            ...Object.keys(semanticTypography),
            ...Object.keys(semanticShadows),
            ...Object.keys(semanticBorderRadius)
        ];
    }
};
export default {
    semanticColors,
    semanticSpacing,
    semanticTypography,
    semanticShadows,
    semanticBorderRadius,
    semanticAnimations,
    semanticTokens,
    semanticUtils,
};
