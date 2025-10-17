/**
 * 🎨 TH-UI 风格配方体系 - 核心令牌 (Core Tokens)
 *
 * 跨配方共享的安全资源
 * 基于 OKLCH 色彩空间和 WCAG 2.2 标准
 */
import type { CoreTokens, ColorScale, ElevationScale, MotionBase, SurfaceBase, TypographyScale, SpacingScale } from '../types';
/**
 * 中性色标度 - Neutral Scale
 * 使用 OKLCH 色彩空间，C=0 (无彩度)
 */
export declare const neutralScale: ColorScale;
/**
 * 青色标度 - Cyan Scale
 */
export declare const cyanScale: ColorScale;
/**
 * 蓝色标度 - Blue Scale
 */
export declare const blueScale: ColorScale;
/**
 * 紫色标度 - Purple Scale
 */
export declare const purpleScale: ColorScale;
/**
 * 品红色标度 - Magenta Scale
 */
export declare const magentaScale: ColorScale;
/**
 * 灰色标度 - Gray Scale (用于 mono 配色)
 */
export declare const grayScale: ColorScale;
/**
 * 成功色 - 绿色系
 */
export declare const successScale: ColorScale;
/**
 * 警告色 - 琥珀色系
 */
export declare const warningScale: ColorScale;
/**
 * 错误色 - 红色系
 */
export declare const errorScale: ColorScale;
/**
 * 信息色 - 天蓝色系
 */
export declare const infoScale: ColorScale;
/**
 * 高度阴影标度
 */
export declare const elevationScale: ElevationScale;
/**
 * 动效时长标度
 */
export declare const motionDuration: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
};
/**
 * 动效缓动函数
 */
export declare const motionEasing: {
    standard: string;
    decel: string;
    anticipate: string;
};
/**
 * 弹性动效参数
 */
export declare const motionSpring: {
    gentle: string;
    bouncy: string;
    brisk: string;
};
/**
 * 动效基础令牌
 */
export declare const motionBase: MotionBase;
/**
 * 阴影基础令牌
 */
export declare const shadowBase: {
    sm: {
        spread: string;
        blur: string;
        color: string;
    };
    md: {
        spread: string;
        blur: string;
        color: string;
    };
    lg: {
        spread: string;
        blur: string;
        color: string;
    };
    xl: {
        spread: string;
        blur: string;
        color: string;
    };
};
/**
 * 模糊效果标度
 */
export declare const blurScale: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
};
/**
 * 光晕效果标度
 */
export declare const glowScale: {
    subtle: string;
    medium: string;
    strong: string;
};
/**
 * 表面基础令牌
 */
export declare const surfaceBase: SurfaceBase;
/**
 * 排版标度
 */
export declare const typographyScale: TypographyScale;
/**
 * 间距标度
 */
export declare const spacingScale: SpacingScale;
/**
 * 核心令牌
 */
export declare const coreTokens: CoreTokens;
//# sourceMappingURL=core.d.ts.map