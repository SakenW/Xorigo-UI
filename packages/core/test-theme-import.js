"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 测试主题模块类型导入
const theme_1 = require("./dist/theme");
// 测试类型
const themeProvider = theme_1.ThemeProvider;
const useThemeHook = theme_1.useTheme;
const palettes = theme_1.colorPalettes;
console.log('ThemeProvider:', typeof themeProvider);
console.log('useTheme:', typeof useThemeHook);
console.log('colorPalettes:', Array.isArray(palettes) ? `Array with ${palettes.length} items` : palettes);
