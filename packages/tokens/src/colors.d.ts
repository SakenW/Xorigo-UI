/**
 * 🎨 TH-UI 颜色令牌 - 兼容性文件
 *
 * 为 ThemeProvider 提供必要的颜色令牌
 */
export interface ColorPaletteScale {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
}
export declare const colorTokens: {
    neutral: ColorPaletteScale;
    blue: ColorPaletteScale;
    cyan: ColorPaletteScale;
    purple: ColorPaletteScale;
    readonly primary: any;
    readonly secondary: any;
    readonly gray: any;
    warning: ColorPaletteScale;
    success: ColorPaletteScale;
};
