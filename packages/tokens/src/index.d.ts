/**
 * 🎨 TH-UI 令牌系统 - 统一导出
 *
 * 基于 DTCG 标准的设计令牌系统
 * 从 src/tokens/ 目录动态加载令牌数据
 */
export * from './colors';
import neutralScaleData from './core/palettes/neutralScale.json';
import blueScaleData from './core/palettes/blueScale.json';
import cyanScaleData from './core/palettes/cyanScale.json';
import purpleScaleData from './core/palettes/purpleScale.json';
import stateColorsData from './core/palettes/stateColors.json';
import typographyData from './core/foundations/typography.json';
import spacingData from './core/foundations/spacing.json';
export { neutralScaleData as neutralScale };
export { blueScaleData as blueScale };
export { cyanScaleData as cyanScale };
export { purpleScaleData as purpleScale };
export { stateColorsData as stateColors };
export { typographyData as typography };
export { spacingData as spacing };
import corporateBlueData from './recipes/corporate-blue/meta.json';
export { corporateBlueData as corporateBlue };
import comfortableData from './density-presets/comfortable.json';
import spaciousData from './density-presets/spacious.json';
import compactData from './density-presets/compact.json';
export { comfortableData as comfortable };
export { spaciousData as spacious };
export { compactData as compact };
export { default as buttonAliases } from './aliases/components/button.json';
export { default as cardAliases } from './aliases/components/card.json';
export interface DTCGToken {
    $value: string | number;
    $type: string;
    $description?: string;
}
export interface DTCGPalette {
    [key: string]: DTCGToken;
}
export interface DTCGCoreTokens {
    palettes: {
        neutralScale: DTCGPalette;
        blueScale: DTCGPalette;
        cyanScale: DTCGPalette;
        purpleScale: DTCGPalette;
        stateColors: DTCGPalette;
    };
    foundations: {
        typography: Record<string, any>;
        spacing: Record<string, any>;
    };
}
export interface DTCGRecipeMeta {
    axes: {
        mode: 'light' | 'dark' | 'hc';
        base: {
            neutral: string;
            contrast: string;
        };
        accent: {
            strategy: string;
            hues: string[];
        };
        tone: 'calm' | 'standard' | 'vivid';
        density: 'spacious' | 'comfortable' | 'compact';
        motion: {
            pack: string;
            curve: string;
        };
        surface: string[];
    };
    oklchTone: Record<string, {
        dC: number;
        dL: number;
    }>;
    a11y: {
        text: number;
        largeText: number;
        nonText: number;
    };
}
export interface DTCGDensityPreset {
    multipliers: {
        typography: Record<string, number>;
        spacing: Record<string, number>;
        sizing: Record<string, number>;
        border: Record<string, number>;
        shadow: Record<string, number>;
    };
}
/**
 * 获取所有核心令牌
 */
export declare function getCoreTokens(): DTCGCoreTokens;
/**
 * 获取所有配方元数据
 */
export declare function getAllRecipeMeta(): Record<string, DTCGRecipeMeta>;
/**
 * 获取所有密度预设
 */
export declare function getAllDensityPresets(): Record<string, DTCGDensityPreset>;
