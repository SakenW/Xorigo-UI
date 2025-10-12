"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TypeScript 测试从 @th-ui/core 导入主题模块
const theme_1 = require("@th-ui/core/theme");
// 类型测试
const themeProvider = theme_1.ThemeProvider;
const useThemeHook = theme_1.useTheme;
const palettes = theme_1.colorPalettes;
const getPalette = theme_1.getPaletteById;
const getRandom = theme_1.getRandomPalette;
// 运行时测试
console.log('ThemeProvider:', typeof themeProvider);
console.log('useTheme:', typeof useThemeHook);
console.log('colorPalettes:', Array.isArray(palettes) ? palettes.length : 'not an array');
console.log('getPaletteById:', typeof getPalette);
console.log('getRandomPalette:', typeof getRandom);
// 测试调色板
if (palettes && palettes.length > 0) {
    console.log('First palette name:', palettes[0].name);
}
else {
    console.log('No color palettes found');
}
