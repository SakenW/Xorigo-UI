// 测试从 @xorigo-ui/core 导入主题模块
import {
  ThemeProvider,
  useTheme,
  colorPalettes,
  ColorPalette,
  getPaletteById,
  getRandomPalette
} from '@xorigo-ui/core/theme';

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