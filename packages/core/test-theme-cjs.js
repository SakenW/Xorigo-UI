// 测试从 @th-ui/core 导入主题模块 (CommonJS)
const { 
  ThemeProvider, 
  useTheme, 
  colorPalettes, 
  getPaletteById,
  getRandomPalette
} = require('./dist/theme.cjs.js');

console.log('ThemeProvider:', typeof ThemeProvider);
console.log('useTheme:', typeof useTheme);
console.log('colorPalettes:', Array.isArray(colorPalettes) ? colorPalettes.length : 'not an array');
console.log('getPaletteById:', typeof getPaletteById);
console.log('getRandomPalette:', typeof getRandomPalette);

// 测试调色板
if (colorPalettes && colorPalettes.length > 0) {
  console.log('First palette name:', colorPalettes[0].name);
} else {
  console.log('No color palettes found');
}