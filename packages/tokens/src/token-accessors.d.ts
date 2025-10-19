/**
 * 🎯 令牌访问器函数
 *
 * 提供对外部系统兼容的令牌访问函数
 */
/**
 * 获取核心令牌
 */
export declare function getCoreTokens(): {
    palettes: {
        neutral: import("./colors").ColorPaletteScale;
        blue: import("./colors").ColorPaletteScale;
        cyan: import("./colors").ColorPaletteScale;
        purple: import("./colors").ColorPaletteScale;
        readonly primary: any;
        readonly secondary: any;
        readonly gray: any;
        warning: import("./colors").ColorPaletteScale;
        success: import("./colors").ColorPaletteScale;
        error: import("./colors").ColorPaletteScale;
        red: import("./colors").ColorPaletteScale;
    };
    foundations: {
        typography: {
            fontSize: {
                xs: string;
                sm: string;
                base: string;
                lg: string;
                xl: string;
                '2xl': string;
                '3xl': string;
                '4xl': string;
            };
            fontWeight: {
                light: string;
                normal: string;
                medium: string;
                semibold: string;
                bold: string;
            };
            lineHeight: {
                tight: string;
                normal: string;
                relaxed: string;
            };
        };
        spacing: {
            1: string;
            2: string;
            3: string;
            4: string;
            5: string;
            6: string;
            8: string;
            10: string;
            12: string;
            16: string;
        };
        borderRadius: {
            sm: string;
            base: string;
            md: string;
            lg: string;
            xl: string;
        };
        boxShadow: {
            sm: string;
            base: string;
            md: string;
            lg: string;
            xl: string;
        };
    };
};
/**
 * 获取所有配方元数据
 */
export declare function getAllRecipeMeta(): Record<string, import("./themes").ThemeRecipe>;
/**
 * 获取所有密度预设
 */
export declare function getAllDensityPresets(): {
    compact: {
        name: string;
        description: string;
        spacing: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
        fontSize: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
    };
    comfortable: {
        name: string;
        description: string;
        spacing: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
        fontSize: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
    };
    spacious: {
        name: string;
        description: string;
        spacing: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
        fontSize: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
    };
};
//# sourceMappingURL=token-accessors.d.ts.map