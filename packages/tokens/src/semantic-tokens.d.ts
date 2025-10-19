/**
 * 🎨 语义化令牌系统
 *
 * 将原始设计令牌映射为语义化令牌，用于组件开发
 */
/**
 * 语义化颜色令牌映射
 * 基于使用场景和UI功能定义，而非设计意图
 */
export declare const semanticColors: {
    readonly 'text-primary': "var(--color-neutral-900)";
    readonly 'text-secondary': "var(--color-neutral-600)";
    readonly 'text-tertiary': "var(--color-neutral-400)";
    readonly 'text-inverse': "var(--color-neutral-50)";
    readonly 'text-disabled': "var(--color-neutral-300)";
    readonly 'bg-primary': "var(--color-neutral-50)";
    readonly 'bg-secondary': "var(--color-white)";
    readonly 'bg-tertiary': "var(--color-neutral-100)";
    readonly 'bg-inverse': "var(--color-neutral-900)";
    readonly 'bg-disabled': "var(--color-neutral-200)";
    readonly 'border-primary': "var(--color-neutral-200)";
    readonly 'border-secondary': "var(--color-neutral-300)";
    readonly 'border-focus': "var(--color-blue-500)";
    readonly 'bg-primary-action': "var(--color-blue-500)";
    readonly 'bg-primary-action-hover': "var(--color-blue-600)";
    readonly 'text-primary-action': "var(--color-blue-500)";
    readonly 'text-primary-action-hover': "var(--color-blue-600)";
    readonly 'border-primary-action': "var(--color-blue-500)";
    readonly 'ring-primary-action': "var(--color-blue-500)";
    readonly 'bg-secondary-action': "var(--color-purple-500)";
    readonly 'bg-secondary-action-hover': "var(--color-purple-600)";
    readonly 'text-secondary-action': "var(--color-purple-500)";
    readonly 'text-secondary-action-hover': "var(--color-purple-600)";
    readonly 'bg-success': "var(--color-green-500)";
    readonly 'bg-success-hover': "var(--color-green-600)";
    readonly 'text-success': "var(--color-green-600)";
    readonly 'border-success': "var(--color-green-500)";
    readonly 'ring-success': "var(--color-green-500)";
    readonly 'bg-warning': "var(--color-yellow-500)";
    readonly 'bg-warning-hover': "var(--color-yellow-600)";
    readonly 'text-warning': "var(--color-yellow-600)";
    readonly 'border-warning': "var(--color-yellow-500)";
    readonly 'ring-warning': "var(--color-yellow-500)";
    readonly 'bg-error': "var(--color-red-500)";
    readonly 'bg-error-hover': "var(--color-red-600)";
    readonly 'text-error': "var(--color-red-600)";
    readonly 'ring-error': "var(--color-red-500)";
    readonly 'bg-info': "var(--color-cyan-500)";
    readonly 'bg-info-hover': "var(--color-cyan-600)";
    readonly 'text-info': "var(--color-cyan-600)";
    readonly 'border-info': "var(--color-cyan-500)";
    readonly 'ring-info': "var(--color-cyan-500)";
    readonly 'bg-contrast-high': "var(--color-neutral-950)";
    readonly 'text-contrast-high': "var(--color-white)";
    readonly 'bg-glass': "rgba(255, 255, 255, 0.8)";
    readonly 'border-glass': "rgba(255, 255, 255, 0.2)";
    readonly 'text-glass': "rgba(0, 0, 0, 0.8)";
    readonly 'bg-overlay': "rgba(0, 0, 0, 0.5)";
    readonly 'bg-floating': "var(--color-white)";
    readonly 'border-floating': "var(--color-neutral-200)";
    readonly 'shadow-floating': "0 10px 25px rgba(0, 0, 0, 0.1)";
    readonly 'gradient-primary': "linear-gradient(135deg, var(--color-blue-500) 0%, var(--color-purple-500) 100%)";
    readonly 'gradient-success': "linear-gradient(135deg, var(--color-green-400) 0%, var(--color-cyan-500) 100%)";
    readonly 'gradient-warning': "linear-gradient(135deg, var(--color-yellow-400) 0%, var(--color-orange-500) 100%)";
    readonly 'gradient-danger': "linear-gradient(135deg, var(--color-red-500) 0%, var(--color-pink-500) 100%)";
    readonly 'gradient-glass': "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)";
    readonly 'gradient-shimmer': "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)";
    readonly 'glow-primary': "0 0 20px rgba(59, 130, 246, 0.5)";
    readonly 'glow-success': "0 0 20px rgba(34, 197, 94, 0.5)";
    readonly 'glow-warning': "0 0 20px rgba(251, 191, 36, 0.5)";
    readonly 'glow-danger': "0 0 20px rgba(239, 68, 68, 0.5)";
    readonly 'glow-soft': "0 0 30px rgba(168, 85, 247, 0.3)";
    readonly 'border-gradient-primary': "linear-gradient(135deg, var(--color-blue-400), var(--color-purple-400))";
    readonly 'border-gradient-rainbow': "linear-gradient(90deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899)";
};
/**
 * 语义化间距令牌
 */
export declare const semanticSpacing: {
    readonly 'spacing-xs': "var(--spacing-1)";
    readonly 'spacing-sm': "var(--spacing-2)";
    readonly 'spacing-md': "var(--spacing-4)";
    readonly 'spacing-lg': "var(--spacing-6)";
    readonly 'spacing-xl': "var(--spacing-8)";
    readonly 'spacing-2xl': "var(--spacing-12)";
    readonly 'spacing-3xl': "var(--spacing-16)";
    readonly 'spacing-4xl': "var(--spacing-24)";
};
/**
 * 语义化字体令牌
 */
export declare const semanticTypography: {
    readonly 'text-xs': "var(--font-size-xs)";
    readonly 'text-sm': "var(--font-size-sm)";
    readonly 'text-base': "var(--font-size-base)";
    readonly 'text-lg': "var(--font-size-lg)";
    readonly 'text-xl': "var(--font-size-xl)";
    readonly 'text-2xl': "var(--font-size-2xl)";
    readonly 'text-3xl': "var(--font-size-3xl)";
    readonly 'font-light': "var(--font-weight-light)";
    readonly 'font-normal': "var(--font-weight-normal)";
    readonly 'font-medium': "var(--font-weight-medium)";
    readonly 'font-semibold': "var(--font-weight-semibold)";
    readonly 'font-bold': "var(--font-weight-bold)";
};
/**
 * 语义化阴影令牌
 */
export declare const semanticShadows: {
    readonly 'shadow-sm': "var(--shadow-sm)";
    readonly 'shadow-md': "var(--shadow)";
    readonly 'shadow-lg': "var(--shadow-lg)";
    readonly 'shadow-xl': "var(--shadow-xl)";
    readonly 'shadow-2xl': "var(--shadow-2xl)";
    readonly 'shadow-inner': "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)";
    readonly 'shadow-colored-sm': "0 1px 2px 0 rgba(59, 130, 246, 0.1)";
    readonly 'shadow-colored-md': "0 4px 6px -1px rgba(59, 130, 246, 0.2)";
    readonly 'shadow-colored-lg': "0 10px 15px -3px rgba(59, 130, 246, 0.3)";
    readonly 'shadow-glow': "0 0 15px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)";
    readonly 'shadow-neon': "0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.4), 0 0 15px rgba(59, 130, 246, 0.3)";
};
/**
 * 语义化圆角令牌
 */
export declare const semanticBorderRadius: {
    readonly 'radius-none': "var(--radius-none)";
    readonly 'radius-sm': "var(--radius-sm)";
    readonly 'radius-md': "var(--radius)";
    readonly 'radius-lg': "var(--radius-lg)";
    readonly 'radius-xl': "var(--radius-xl)";
    readonly 'radius-full': "var(--radius-full)";
};
/**
 * 动画和过渡令牌
 */
export declare const semanticAnimations: {
    readonly 'transition-fast': "150ms";
    readonly 'transition-base': "200ms";
    readonly 'transition-slow': "300ms";
    readonly 'transition-slower': "500ms";
    readonly 'ease-smooth': "cubic-bezier(0.4, 0, 0.2, 1)";
    readonly 'ease-bounce': "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    readonly 'ease-elastic': "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    readonly 'animate-fade-in': "fadeIn 0.3s ease-smooth";
    readonly 'animate-fade-out': "fadeOut 0.3s ease-smooth";
    readonly 'animate-slide-in': "slideIn 0.3s ease-smooth";
    readonly 'animate-slide-out': "slideOut 0.3s ease-smooth";
    readonly 'animate-scale-in': "scaleIn 0.2s ease-smooth";
    readonly 'animate-shimmer': "shimmer 2s infinite";
    readonly 'animate-pulse-soft': "pulseSoft 2s ease-in-out infinite";
    readonly 'animate-float': "float 3s ease-in-out infinite";
};
/**
 * 组合语义化令牌
 */
export declare const semanticTokens: {
    readonly colors: {
        readonly 'text-primary': "var(--color-neutral-900)";
        readonly 'text-secondary': "var(--color-neutral-600)";
        readonly 'text-tertiary': "var(--color-neutral-400)";
        readonly 'text-inverse': "var(--color-neutral-50)";
        readonly 'text-disabled': "var(--color-neutral-300)";
        readonly 'bg-primary': "var(--color-neutral-50)";
        readonly 'bg-secondary': "var(--color-white)";
        readonly 'bg-tertiary': "var(--color-neutral-100)";
        readonly 'bg-inverse': "var(--color-neutral-900)";
        readonly 'bg-disabled': "var(--color-neutral-200)";
        readonly 'border-primary': "var(--color-neutral-200)";
        readonly 'border-secondary': "var(--color-neutral-300)";
        readonly 'border-focus': "var(--color-blue-500)";
        readonly 'bg-primary-action': "var(--color-blue-500)";
        readonly 'bg-primary-action-hover': "var(--color-blue-600)";
        readonly 'text-primary-action': "var(--color-blue-500)";
        readonly 'text-primary-action-hover': "var(--color-blue-600)";
        readonly 'border-primary-action': "var(--color-blue-500)";
        readonly 'ring-primary-action': "var(--color-blue-500)";
        readonly 'bg-secondary-action': "var(--color-purple-500)";
        readonly 'bg-secondary-action-hover': "var(--color-purple-600)";
        readonly 'text-secondary-action': "var(--color-purple-500)";
        readonly 'text-secondary-action-hover': "var(--color-purple-600)";
        readonly 'bg-success': "var(--color-green-500)";
        readonly 'bg-success-hover': "var(--color-green-600)";
        readonly 'text-success': "var(--color-green-600)";
        readonly 'border-success': "var(--color-green-500)";
        readonly 'ring-success': "var(--color-green-500)";
        readonly 'bg-warning': "var(--color-yellow-500)";
        readonly 'bg-warning-hover': "var(--color-yellow-600)";
        readonly 'text-warning': "var(--color-yellow-600)";
        readonly 'border-warning': "var(--color-yellow-500)";
        readonly 'ring-warning': "var(--color-yellow-500)";
        readonly 'bg-error': "var(--color-red-500)";
        readonly 'bg-error-hover': "var(--color-red-600)";
        readonly 'text-error': "var(--color-red-600)";
        readonly 'ring-error': "var(--color-red-500)";
        readonly 'bg-info': "var(--color-cyan-500)";
        readonly 'bg-info-hover': "var(--color-cyan-600)";
        readonly 'text-info': "var(--color-cyan-600)";
        readonly 'border-info': "var(--color-cyan-500)";
        readonly 'ring-info': "var(--color-cyan-500)";
        readonly 'bg-contrast-high': "var(--color-neutral-950)";
        readonly 'text-contrast-high': "var(--color-white)";
        readonly 'bg-glass': "rgba(255, 255, 255, 0.8)";
        readonly 'border-glass': "rgba(255, 255, 255, 0.2)";
        readonly 'text-glass': "rgba(0, 0, 0, 0.8)";
        readonly 'bg-overlay': "rgba(0, 0, 0, 0.5)";
        readonly 'bg-floating': "var(--color-white)";
        readonly 'border-floating': "var(--color-neutral-200)";
        readonly 'shadow-floating': "0 10px 25px rgba(0, 0, 0, 0.1)";
        readonly 'gradient-primary': "linear-gradient(135deg, var(--color-blue-500) 0%, var(--color-purple-500) 100%)";
        readonly 'gradient-success': "linear-gradient(135deg, var(--color-green-400) 0%, var(--color-cyan-500) 100%)";
        readonly 'gradient-warning': "linear-gradient(135deg, var(--color-yellow-400) 0%, var(--color-orange-500) 100%)";
        readonly 'gradient-danger': "linear-gradient(135deg, var(--color-red-500) 0%, var(--color-pink-500) 100%)";
        readonly 'gradient-glass': "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)";
        readonly 'gradient-shimmer': "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)";
        readonly 'glow-primary': "0 0 20px rgba(59, 130, 246, 0.5)";
        readonly 'glow-success': "0 0 20px rgba(34, 197, 94, 0.5)";
        readonly 'glow-warning': "0 0 20px rgba(251, 191, 36, 0.5)";
        readonly 'glow-danger': "0 0 20px rgba(239, 68, 68, 0.5)";
        readonly 'glow-soft': "0 0 30px rgba(168, 85, 247, 0.3)";
        readonly 'border-gradient-primary': "linear-gradient(135deg, var(--color-blue-400), var(--color-purple-400))";
        readonly 'border-gradient-rainbow': "linear-gradient(90deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899)";
    };
    readonly spacing: {
        readonly 'spacing-xs': "var(--spacing-1)";
        readonly 'spacing-sm': "var(--spacing-2)";
        readonly 'spacing-md': "var(--spacing-4)";
        readonly 'spacing-lg': "var(--spacing-6)";
        readonly 'spacing-xl': "var(--spacing-8)";
        readonly 'spacing-2xl': "var(--spacing-12)";
        readonly 'spacing-3xl': "var(--spacing-16)";
        readonly 'spacing-4xl': "var(--spacing-24)";
    };
    readonly typography: {
        readonly 'text-xs': "var(--font-size-xs)";
        readonly 'text-sm': "var(--font-size-sm)";
        readonly 'text-base': "var(--font-size-base)";
        readonly 'text-lg': "var(--font-size-lg)";
        readonly 'text-xl': "var(--font-size-xl)";
        readonly 'text-2xl': "var(--font-size-2xl)";
        readonly 'text-3xl': "var(--font-size-3xl)";
        readonly 'font-light': "var(--font-weight-light)";
        readonly 'font-normal': "var(--font-weight-normal)";
        readonly 'font-medium': "var(--font-weight-medium)";
        readonly 'font-semibold': "var(--font-weight-semibold)";
        readonly 'font-bold': "var(--font-weight-bold)";
    };
    readonly shadows: {
        readonly 'shadow-sm': "var(--shadow-sm)";
        readonly 'shadow-md': "var(--shadow)";
        readonly 'shadow-lg': "var(--shadow-lg)";
        readonly 'shadow-xl': "var(--shadow-xl)";
        readonly 'shadow-2xl': "var(--shadow-2xl)";
        readonly 'shadow-inner': "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)";
        readonly 'shadow-colored-sm': "0 1px 2px 0 rgba(59, 130, 246, 0.1)";
        readonly 'shadow-colored-md': "0 4px 6px -1px rgba(59, 130, 246, 0.2)";
        readonly 'shadow-colored-lg': "0 10px 15px -3px rgba(59, 130, 246, 0.3)";
        readonly 'shadow-glow': "0 0 15px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)";
        readonly 'shadow-neon': "0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.4), 0 0 15px rgba(59, 130, 246, 0.3)";
    };
    readonly borderRadius: {
        readonly 'radius-none': "var(--radius-none)";
        readonly 'radius-sm': "var(--radius-sm)";
        readonly 'radius-md': "var(--radius)";
        readonly 'radius-lg': "var(--radius-lg)";
        readonly 'radius-xl': "var(--radius-xl)";
        readonly 'radius-full': "var(--radius-full)";
    };
    readonly animations: {
        readonly 'transition-fast': "150ms";
        readonly 'transition-base': "200ms";
        readonly 'transition-slow': "300ms";
        readonly 'transition-slower': "500ms";
        readonly 'ease-smooth': "cubic-bezier(0.4, 0, 0.2, 1)";
        readonly 'ease-bounce': "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        readonly 'ease-elastic': "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        readonly 'animate-fade-in': "fadeIn 0.3s ease-smooth";
        readonly 'animate-fade-out': "fadeOut 0.3s ease-smooth";
        readonly 'animate-slide-in': "slideIn 0.3s ease-smooth";
        readonly 'animate-slide-out': "slideOut 0.3s ease-smooth";
        readonly 'animate-scale-in': "scaleIn 0.2s ease-smooth";
        readonly 'animate-shimmer': "shimmer 2s infinite";
        readonly 'animate-pulse-soft': "pulseSoft 2s ease-in-out infinite";
        readonly 'animate-float': "float 3s ease-in-out infinite";
    };
};
/**
 * 语义化令牌工具函数
 */
export declare const semanticUtils: {
    /**
     * 获取语义化颜色
     */
    getColor: (name: keyof typeof semanticColors) => string;
    /**
     * 获取语义化间距
     */
    getSpacing: (name: keyof typeof semanticSpacing) => string;
    /**
     * 获取语义化字体
     */
    getTypography: (name: keyof typeof semanticTypography) => string;
    /**
     * 验证语义化令牌名称
     */
    isValidSemanticToken: (token: string) => boolean;
    /**
     * 获取所有语义化令牌名称
     */
    getAllSemanticTokens: () => string[];
};
declare const _default: {
    semanticColors: {
        readonly 'text-primary': "var(--color-neutral-900)";
        readonly 'text-secondary': "var(--color-neutral-600)";
        readonly 'text-tertiary': "var(--color-neutral-400)";
        readonly 'text-inverse': "var(--color-neutral-50)";
        readonly 'text-disabled': "var(--color-neutral-300)";
        readonly 'bg-primary': "var(--color-neutral-50)";
        readonly 'bg-secondary': "var(--color-white)";
        readonly 'bg-tertiary': "var(--color-neutral-100)";
        readonly 'bg-inverse': "var(--color-neutral-900)";
        readonly 'bg-disabled': "var(--color-neutral-200)";
        readonly 'border-primary': "var(--color-neutral-200)";
        readonly 'border-secondary': "var(--color-neutral-300)";
        readonly 'border-focus': "var(--color-blue-500)";
        readonly 'bg-primary-action': "var(--color-blue-500)";
        readonly 'bg-primary-action-hover': "var(--color-blue-600)";
        readonly 'text-primary-action': "var(--color-blue-500)";
        readonly 'text-primary-action-hover': "var(--color-blue-600)";
        readonly 'border-primary-action': "var(--color-blue-500)";
        readonly 'ring-primary-action': "var(--color-blue-500)";
        readonly 'bg-secondary-action': "var(--color-purple-500)";
        readonly 'bg-secondary-action-hover': "var(--color-purple-600)";
        readonly 'text-secondary-action': "var(--color-purple-500)";
        readonly 'text-secondary-action-hover': "var(--color-purple-600)";
        readonly 'bg-success': "var(--color-green-500)";
        readonly 'bg-success-hover': "var(--color-green-600)";
        readonly 'text-success': "var(--color-green-600)";
        readonly 'border-success': "var(--color-green-500)";
        readonly 'ring-success': "var(--color-green-500)";
        readonly 'bg-warning': "var(--color-yellow-500)";
        readonly 'bg-warning-hover': "var(--color-yellow-600)";
        readonly 'text-warning': "var(--color-yellow-600)";
        readonly 'border-warning': "var(--color-yellow-500)";
        readonly 'ring-warning': "var(--color-yellow-500)";
        readonly 'bg-error': "var(--color-red-500)";
        readonly 'bg-error-hover': "var(--color-red-600)";
        readonly 'text-error': "var(--color-red-600)";
        readonly 'ring-error': "var(--color-red-500)";
        readonly 'bg-info': "var(--color-cyan-500)";
        readonly 'bg-info-hover': "var(--color-cyan-600)";
        readonly 'text-info': "var(--color-cyan-600)";
        readonly 'border-info': "var(--color-cyan-500)";
        readonly 'ring-info': "var(--color-cyan-500)";
        readonly 'bg-contrast-high': "var(--color-neutral-950)";
        readonly 'text-contrast-high': "var(--color-white)";
        readonly 'bg-glass': "rgba(255, 255, 255, 0.8)";
        readonly 'border-glass': "rgba(255, 255, 255, 0.2)";
        readonly 'text-glass': "rgba(0, 0, 0, 0.8)";
        readonly 'bg-overlay': "rgba(0, 0, 0, 0.5)";
        readonly 'bg-floating': "var(--color-white)";
        readonly 'border-floating': "var(--color-neutral-200)";
        readonly 'shadow-floating': "0 10px 25px rgba(0, 0, 0, 0.1)";
        readonly 'gradient-primary': "linear-gradient(135deg, var(--color-blue-500) 0%, var(--color-purple-500) 100%)";
        readonly 'gradient-success': "linear-gradient(135deg, var(--color-green-400) 0%, var(--color-cyan-500) 100%)";
        readonly 'gradient-warning': "linear-gradient(135deg, var(--color-yellow-400) 0%, var(--color-orange-500) 100%)";
        readonly 'gradient-danger': "linear-gradient(135deg, var(--color-red-500) 0%, var(--color-pink-500) 100%)";
        readonly 'gradient-glass': "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)";
        readonly 'gradient-shimmer': "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)";
        readonly 'glow-primary': "0 0 20px rgba(59, 130, 246, 0.5)";
        readonly 'glow-success': "0 0 20px rgba(34, 197, 94, 0.5)";
        readonly 'glow-warning': "0 0 20px rgba(251, 191, 36, 0.5)";
        readonly 'glow-danger': "0 0 20px rgba(239, 68, 68, 0.5)";
        readonly 'glow-soft': "0 0 30px rgba(168, 85, 247, 0.3)";
        readonly 'border-gradient-primary': "linear-gradient(135deg, var(--color-blue-400), var(--color-purple-400))";
        readonly 'border-gradient-rainbow': "linear-gradient(90deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899)";
    };
    semanticSpacing: {
        readonly 'spacing-xs': "var(--spacing-1)";
        readonly 'spacing-sm': "var(--spacing-2)";
        readonly 'spacing-md': "var(--spacing-4)";
        readonly 'spacing-lg': "var(--spacing-6)";
        readonly 'spacing-xl': "var(--spacing-8)";
        readonly 'spacing-2xl': "var(--spacing-12)";
        readonly 'spacing-3xl': "var(--spacing-16)";
        readonly 'spacing-4xl': "var(--spacing-24)";
    };
    semanticTypography: {
        readonly 'text-xs': "var(--font-size-xs)";
        readonly 'text-sm': "var(--font-size-sm)";
        readonly 'text-base': "var(--font-size-base)";
        readonly 'text-lg': "var(--font-size-lg)";
        readonly 'text-xl': "var(--font-size-xl)";
        readonly 'text-2xl': "var(--font-size-2xl)";
        readonly 'text-3xl': "var(--font-size-3xl)";
        readonly 'font-light': "var(--font-weight-light)";
        readonly 'font-normal': "var(--font-weight-normal)";
        readonly 'font-medium': "var(--font-weight-medium)";
        readonly 'font-semibold': "var(--font-weight-semibold)";
        readonly 'font-bold': "var(--font-weight-bold)";
    };
    semanticShadows: {
        readonly 'shadow-sm': "var(--shadow-sm)";
        readonly 'shadow-md': "var(--shadow)";
        readonly 'shadow-lg': "var(--shadow-lg)";
        readonly 'shadow-xl': "var(--shadow-xl)";
        readonly 'shadow-2xl': "var(--shadow-2xl)";
        readonly 'shadow-inner': "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)";
        readonly 'shadow-colored-sm': "0 1px 2px 0 rgba(59, 130, 246, 0.1)";
        readonly 'shadow-colored-md': "0 4px 6px -1px rgba(59, 130, 246, 0.2)";
        readonly 'shadow-colored-lg': "0 10px 15px -3px rgba(59, 130, 246, 0.3)";
        readonly 'shadow-glow': "0 0 15px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)";
        readonly 'shadow-neon': "0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.4), 0 0 15px rgba(59, 130, 246, 0.3)";
    };
    semanticBorderRadius: {
        readonly 'radius-none': "var(--radius-none)";
        readonly 'radius-sm': "var(--radius-sm)";
        readonly 'radius-md': "var(--radius)";
        readonly 'radius-lg': "var(--radius-lg)";
        readonly 'radius-xl': "var(--radius-xl)";
        readonly 'radius-full': "var(--radius-full)";
    };
    semanticAnimations: {
        readonly 'transition-fast': "150ms";
        readonly 'transition-base': "200ms";
        readonly 'transition-slow': "300ms";
        readonly 'transition-slower': "500ms";
        readonly 'ease-smooth': "cubic-bezier(0.4, 0, 0.2, 1)";
        readonly 'ease-bounce': "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        readonly 'ease-elastic': "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        readonly 'animate-fade-in': "fadeIn 0.3s ease-smooth";
        readonly 'animate-fade-out': "fadeOut 0.3s ease-smooth";
        readonly 'animate-slide-in': "slideIn 0.3s ease-smooth";
        readonly 'animate-slide-out': "slideOut 0.3s ease-smooth";
        readonly 'animate-scale-in': "scaleIn 0.2s ease-smooth";
        readonly 'animate-shimmer': "shimmer 2s infinite";
        readonly 'animate-pulse-soft': "pulseSoft 2s ease-in-out infinite";
        readonly 'animate-float': "float 3s ease-in-out infinite";
    };
    semanticTokens: {
        readonly colors: {
            readonly 'text-primary': "var(--color-neutral-900)";
            readonly 'text-secondary': "var(--color-neutral-600)";
            readonly 'text-tertiary': "var(--color-neutral-400)";
            readonly 'text-inverse': "var(--color-neutral-50)";
            readonly 'text-disabled': "var(--color-neutral-300)";
            readonly 'bg-primary': "var(--color-neutral-50)";
            readonly 'bg-secondary': "var(--color-white)";
            readonly 'bg-tertiary': "var(--color-neutral-100)";
            readonly 'bg-inverse': "var(--color-neutral-900)";
            readonly 'bg-disabled': "var(--color-neutral-200)";
            readonly 'border-primary': "var(--color-neutral-200)";
            readonly 'border-secondary': "var(--color-neutral-300)";
            readonly 'border-focus': "var(--color-blue-500)";
            readonly 'bg-primary-action': "var(--color-blue-500)";
            readonly 'bg-primary-action-hover': "var(--color-blue-600)";
            readonly 'text-primary-action': "var(--color-blue-500)";
            readonly 'text-primary-action-hover': "var(--color-blue-600)";
            readonly 'border-primary-action': "var(--color-blue-500)";
            readonly 'ring-primary-action': "var(--color-blue-500)";
            readonly 'bg-secondary-action': "var(--color-purple-500)";
            readonly 'bg-secondary-action-hover': "var(--color-purple-600)";
            readonly 'text-secondary-action': "var(--color-purple-500)";
            readonly 'text-secondary-action-hover': "var(--color-purple-600)";
            readonly 'bg-success': "var(--color-green-500)";
            readonly 'bg-success-hover': "var(--color-green-600)";
            readonly 'text-success': "var(--color-green-600)";
            readonly 'border-success': "var(--color-green-500)";
            readonly 'ring-success': "var(--color-green-500)";
            readonly 'bg-warning': "var(--color-yellow-500)";
            readonly 'bg-warning-hover': "var(--color-yellow-600)";
            readonly 'text-warning': "var(--color-yellow-600)";
            readonly 'border-warning': "var(--color-yellow-500)";
            readonly 'ring-warning': "var(--color-yellow-500)";
            readonly 'bg-error': "var(--color-red-500)";
            readonly 'bg-error-hover': "var(--color-red-600)";
            readonly 'text-error': "var(--color-red-600)";
            readonly 'ring-error': "var(--color-red-500)";
            readonly 'bg-info': "var(--color-cyan-500)";
            readonly 'bg-info-hover': "var(--color-cyan-600)";
            readonly 'text-info': "var(--color-cyan-600)";
            readonly 'border-info': "var(--color-cyan-500)";
            readonly 'ring-info': "var(--color-cyan-500)";
            readonly 'bg-contrast-high': "var(--color-neutral-950)";
            readonly 'text-contrast-high': "var(--color-white)";
            readonly 'bg-glass': "rgba(255, 255, 255, 0.8)";
            readonly 'border-glass': "rgba(255, 255, 255, 0.2)";
            readonly 'text-glass': "rgba(0, 0, 0, 0.8)";
            readonly 'bg-overlay': "rgba(0, 0, 0, 0.5)";
            readonly 'bg-floating': "var(--color-white)";
            readonly 'border-floating': "var(--color-neutral-200)";
            readonly 'shadow-floating': "0 10px 25px rgba(0, 0, 0, 0.1)";
            readonly 'gradient-primary': "linear-gradient(135deg, var(--color-blue-500) 0%, var(--color-purple-500) 100%)";
            readonly 'gradient-success': "linear-gradient(135deg, var(--color-green-400) 0%, var(--color-cyan-500) 100%)";
            readonly 'gradient-warning': "linear-gradient(135deg, var(--color-yellow-400) 0%, var(--color-orange-500) 100%)";
            readonly 'gradient-danger': "linear-gradient(135deg, var(--color-red-500) 0%, var(--color-pink-500) 100%)";
            readonly 'gradient-glass': "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)";
            readonly 'gradient-shimmer': "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)";
            readonly 'glow-primary': "0 0 20px rgba(59, 130, 246, 0.5)";
            readonly 'glow-success': "0 0 20px rgba(34, 197, 94, 0.5)";
            readonly 'glow-warning': "0 0 20px rgba(251, 191, 36, 0.5)";
            readonly 'glow-danger': "0 0 20px rgba(239, 68, 68, 0.5)";
            readonly 'glow-soft': "0 0 30px rgba(168, 85, 247, 0.3)";
            readonly 'border-gradient-primary': "linear-gradient(135deg, var(--color-blue-400), var(--color-purple-400))";
            readonly 'border-gradient-rainbow': "linear-gradient(90deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899)";
        };
        readonly spacing: {
            readonly 'spacing-xs': "var(--spacing-1)";
            readonly 'spacing-sm': "var(--spacing-2)";
            readonly 'spacing-md': "var(--spacing-4)";
            readonly 'spacing-lg': "var(--spacing-6)";
            readonly 'spacing-xl': "var(--spacing-8)";
            readonly 'spacing-2xl': "var(--spacing-12)";
            readonly 'spacing-3xl': "var(--spacing-16)";
            readonly 'spacing-4xl': "var(--spacing-24)";
        };
        readonly typography: {
            readonly 'text-xs': "var(--font-size-xs)";
            readonly 'text-sm': "var(--font-size-sm)";
            readonly 'text-base': "var(--font-size-base)";
            readonly 'text-lg': "var(--font-size-lg)";
            readonly 'text-xl': "var(--font-size-xl)";
            readonly 'text-2xl': "var(--font-size-2xl)";
            readonly 'text-3xl': "var(--font-size-3xl)";
            readonly 'font-light': "var(--font-weight-light)";
            readonly 'font-normal': "var(--font-weight-normal)";
            readonly 'font-medium': "var(--font-weight-medium)";
            readonly 'font-semibold': "var(--font-weight-semibold)";
            readonly 'font-bold': "var(--font-weight-bold)";
        };
        readonly shadows: {
            readonly 'shadow-sm': "var(--shadow-sm)";
            readonly 'shadow-md': "var(--shadow)";
            readonly 'shadow-lg': "var(--shadow-lg)";
            readonly 'shadow-xl': "var(--shadow-xl)";
            readonly 'shadow-2xl': "var(--shadow-2xl)";
            readonly 'shadow-inner': "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)";
            readonly 'shadow-colored-sm': "0 1px 2px 0 rgba(59, 130, 246, 0.1)";
            readonly 'shadow-colored-md': "0 4px 6px -1px rgba(59, 130, 246, 0.2)";
            readonly 'shadow-colored-lg': "0 10px 15px -3px rgba(59, 130, 246, 0.3)";
            readonly 'shadow-glow': "0 0 15px rgba(59, 130, 246, 0.5), 0 0 30px rgba(59, 130, 246, 0.3)";
            readonly 'shadow-neon': "0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.4), 0 0 15px rgba(59, 130, 246, 0.3)";
        };
        readonly borderRadius: {
            readonly 'radius-none': "var(--radius-none)";
            readonly 'radius-sm': "var(--radius-sm)";
            readonly 'radius-md': "var(--radius)";
            readonly 'radius-lg': "var(--radius-lg)";
            readonly 'radius-xl': "var(--radius-xl)";
            readonly 'radius-full': "var(--radius-full)";
        };
        readonly animations: {
            readonly 'transition-fast': "150ms";
            readonly 'transition-base': "200ms";
            readonly 'transition-slow': "300ms";
            readonly 'transition-slower': "500ms";
            readonly 'ease-smooth': "cubic-bezier(0.4, 0, 0.2, 1)";
            readonly 'ease-bounce': "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
            readonly 'ease-elastic': "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            readonly 'animate-fade-in': "fadeIn 0.3s ease-smooth";
            readonly 'animate-fade-out': "fadeOut 0.3s ease-smooth";
            readonly 'animate-slide-in': "slideIn 0.3s ease-smooth";
            readonly 'animate-slide-out': "slideOut 0.3s ease-smooth";
            readonly 'animate-scale-in': "scaleIn 0.2s ease-smooth";
            readonly 'animate-shimmer': "shimmer 2s infinite";
            readonly 'animate-pulse-soft': "pulseSoft 2s ease-in-out infinite";
            readonly 'animate-float': "float 3s ease-in-out infinite";
        };
    };
    semanticUtils: {
        /**
         * 获取语义化颜色
         */
        getColor: (name: keyof typeof semanticColors) => string;
        /**
         * 获取语义化间距
         */
        getSpacing: (name: keyof typeof semanticSpacing) => string;
        /**
         * 获取语义化字体
         */
        getTypography: (name: keyof typeof semanticTypography) => string;
        /**
         * 验证语义化令牌名称
         */
        isValidSemanticToken: (token: string) => boolean;
        /**
         * 获取所有语义化令牌名称
         */
        getAllSemanticTokens: () => string[];
    };
};
export default _default;
//# sourceMappingURL=semantic-tokens.d.ts.map