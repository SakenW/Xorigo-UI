// 测试主题模块类型导入
/// <reference path="./dist/theme.d.ts" />

import { ThemeProvider, useTheme, colorPalettes, ColorPalette } from './dist/theme';

// 测试类型
const themeProvider: typeof ThemeProvider = {} as any;
const useThemeHook: typeof useTheme = {} as any;
const palettes: ColorPalette[] = [] as any;

console.log('ThemeProvider:', typeof themeProvider);
console.log('useTheme:', typeof useThemeHook);
console.log('colorPalettes:', Array.isArray(palettes) ? `Array with ${palettes.length} items` : palettes);