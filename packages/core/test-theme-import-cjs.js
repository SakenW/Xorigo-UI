// 测试主题模块导入 (CommonJS)
const { ThemeProvider, useTheme, colorPalettes } = require('./dist/theme.cjs.js');

console.log('ThemeProvider:', typeof ThemeProvider);
console.log('useTheme:', typeof useTheme);
console.log('colorPalettes:', Array.isArray(colorPalettes) ? `Array with ${colorPalettes.length} items` : colorPalettes);