/**
 * 🎨 TH-UI 风格配方体系 - 类型定义
 *
 * 基于 Design Tokens Community Group (DTCG) 标准
 * 支持七轴风格配方系统和三层令牌架构
 */
/**
 * 风格轴枚举 - Mode (光照/对比)
 */
export type ModeAxis = 'light' | 'dark' | 'hc';
/**
 * 风格轴枚举 - Base (中性色谱 × 对比)
 */
export type BaseAxis = `${BaseColor}-${ContrastLevel}`;
export type BaseColor = 'neutral-warm' | 'neutral-cool' | 'neutral-true';
export type ContrastLevel = 'low' | 'mid' | 'high';
/**
 * 风格轴枚举 - Accent (主色策略)
 */
export type AccentAxis = `${AccentStrategy}(${AccentHue})`;
export type AccentStrategy = 'mono' | 'analog' | 'duo';
export type AccentHue = string;
/**
 * 风格轴枚举 - Tone (强度：饱和/亮度曲线)
 */
export type ToneAxis = 'calm' | 'standard' | 'vivid';
/**
 * 风格轴枚举 - Density (信息密度/留白)
 */
export type DensityAxis = 'spacious' | 'comfortable' | 'compact';
/**
 * 风格轴枚举 - Motion (动效节奏/幅度)
 */
export type MotionAxis = `${MotionIntensity}.${MotionCurve}`;
export type MotionIntensity = 'subtle' | 'standard' | 'expressive';
export type MotionCurve = 'classic' | 'soft' | 'spring';
/**
 * 风格轴枚举 - Surface (表面语言/材质)
 */
export type SurfaceAxis = SurfaceType | `${SurfaceType}+${SurfaceType}`;
export type SurfaceType = 'flat' | 'soft-shadow' | 'glass' | 'neon';
/**
 * 完整的风格配方标识符
 * 语法: <mode>.<base>.<accent>.<tone>.<density>.<motion>.<surface>
 */
export type StyleRecipeID = `${ModeAxis}.${BaseAxis}.${AccentAxis}.${ToneAxis}.${DensityAxis}.${MotionAxis}.${SurfaceAxis}`;
/**
 * 风格配方接口
 */
export interface StyleRecipe {
    id: StyleRecipeID;
    name: string;
    description: string;
    category: 'corporate' | 'minimal' | 'tech' | 'creative' | 'classic';
    mode: ModeAxis;
    base: BaseAxis;
    accent: AccentAxis;
    tone: ToneAxis;
    density: DensityAxis;
    motion: MotionAxis;
    surface: SurfaceAxis;
    tags: string[];
    accessibility: {
        contrastLevel: 'AA' | 'AAA' | 'HC';
        cvdFriendly: boolean;
        motionSafe: boolean;
    };
}
/**
 * 组件主题响应级别
 */
export type ResponseLevel = 'L0' | 'L1' | 'L2' | 'L3';
/**
 * 响应级别配置
 */
export interface ResponseLevelConfig {
    level: ResponseLevel;
    description: string;
    responsiveAxes: StyleAxis[];
    typicalComponents: string[];
}
/**
 * 风格轴类型枚举
 */
export type StyleAxis = 'mode' | 'base' | 'accent' | 'tone' | 'density' | 'motion' | 'surface';
/**
 * 轴锁配置
 */
export interface AxisLock {
    axes: StyleAxis[];
    scope: 'global' | 'local';
    reason?: string;
}
/**
 * 轴锁规则
 */
export interface AxisLockRule {
    id: string;
    name: string;
    locks: AxisLock[];
    applicableComponents?: string[];
    applicableRegions?: string[];
}
/**
 * 核心令牌 (Core Tokens) - 跨配方共享的安全资源
 */
export interface CoreTokens {
    colors: {
        neutral: ColorScale;
        [key: string]: ColorScale;
    };
    states: {
        success: ColorScale;
        warning: ColorScale;
        error: ColorScale;
        info: ColorScale;
    };
    elevation: ElevationScale;
    motion: MotionBase;
    surface: SurfaceBase;
    foundations: {
        typography: TypographyScale;
        spacing: SpacingScale;
    };
}
/**
 * 语义令牌 (Role Tokens) - 随配方变化
 */
export interface RoleTokens {
    background: {
        primary: string;
        surface: string;
        elevated: string;
    };
    text: {
        primary: string;
        muted: string;
        inverse: string;
    };
    border: {
        default: string;
        emphasis: string;
    };
    accent: {
        default: string;
        hover: string;
        active: string;
    };
    states: {
        success: string;
        warning: string;
        error: string;
        info: string;
    };
}
/**
 * 组件别名令牌 (Component Aliases) - 组件层
 */
export interface ComponentTokens {
    [componentName: string]: {
        [tokenName: string]: string;
    };
}
/**
 * 颜色标度 - OKLCH 色彩空间
 */
export interface ColorScale {
    [key: number]: string;
}
/**
 * 高度标度
 */
export interface ElevationScale {
    [level: number]: {
        shadow: string;
        mixColor?: string;
        opacity?: number;
    };
}
/**
 * 动效基础
 */
export interface MotionBase {
    duration: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    easing: {
        standard: string;
        decel: string;
        anticipate: string;
    };
    spring: {
        gentle: string;
        bouncy: string;
        brisk: string;
    };
}
/**
 * 表面基础
 */
export interface SurfaceBase {
    shadows: {
        [radius: string]: {
            spread: string;
            blur: string;
            color: string;
        };
    };
    blur: {
        [level: string]: string;
    };
    glow: {
        [intensity: string]: string;
    };
}
/**
 * 排版标度
 */
export interface TypographyScale {
    fontSize: {
        [key: string]: string;
    };
    fontWeight: {
        [key: string]: string;
    };
    lineHeight: {
        [key: string]: string;
    };
    letterSpacing: {
        [key: string]: string;
    };
}
/**
 * 间距标度
 */
export interface SpacingScale {
    [key: string]: string;
}
/**
 * 配方解析结果
 */
export interface ParsedRecipe {
    recipe: StyleRecipe;
    tokens: {
        core: CoreTokens;
        role: RoleTokens;
        component: ComponentTokens;
    };
    cssVariables: Record<string, string>;
}
/**
 * 配方引擎配置
 */
export interface RecipeEngineConfig {
    defaultRecipe: StyleRecipeID;
    availableRecipes: StyleRecipe[];
    axisLocks: AxisLockRule[];
    responseLevels: Record<ResponseLevel, ResponseLevelConfig>;
    oklchEnabled: boolean;
    accessibilityMode: 'strict' | 'standard' | 'relaxed';
}
/**
 * 提取配方ID的各个部分
 */
export type ParseRecipeID<T extends StyleRecipeID> = {
    mode: T extends `${string}.${string}` ? T extends `${infer Mode}.${string}` ? Mode : never : never;
    base: T extends `${string}.${string}.${string}` ? T extends `${string}.${infer Base}.${string}` ? Base : never : never;
    accent: T extends `${string}.${string}.${string}.${string}` ? T extends `${string}.${string}.${infer Accent}.${string}` ? Accent : never : never;
    tone: T extends `${string}.${string}.${string}.${string}.${string}` ? T extends `${string}.${string}.${string}.${infer Tone}.${string}` ? Tone : never : never;
    density: T extends `${string}.${string}.${string}.${string}.${string}.${string}` ? T extends `${string}.${string}.${string}.${string}.${infer Density}.${string}` ? Density : never : never;
    motion: T extends `${string}.${string}.${string}.${string}.${string}.${string}.${string}` ? T extends `${string}.${string}.${string}.${string}.${string}.${infer Motion}.${string}` ? Motion : never : never;
    surface: T extends `${string}.${string}.${string}.${string}.${string}.${string}.${string}.${string}` ? T extends `${string}.${string}.${string}.${string}.${string}.${string}.${infer Surface}` ? Surface : never : never;
};
/**
 * 配方验证结果
 */
export interface RecipeValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    accessibilityReport: {
        contrastScore: number;
        cvdScore: number;
        motionScore: number;
    };
}
//# sourceMappingURL=index.d.ts.map