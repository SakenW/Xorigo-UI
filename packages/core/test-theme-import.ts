// 测试主题模块类型导入
import { ThemeProvider, useTheme, colorPalettes, ColorPalette } from './dist/theme';

// 测试类型
const themeProvider: typeof ThemeProvider = ThemeProvider;
const useThemeHook: typeof useTheme = useTheme;
const palettes: ColorPalette[] = colorPalettes;

console.log('ThemeProvider:', typeof themeProvider);
console.log('useTheme:', typeof useThemeHook);
console.log('colorPalettes:', Array.isArray(palettes) ? `Array with ${palettes.length} items` : palettes);