// 测试从 @th-ui/core 导入主题模块
import { 
  ThemeProvider, 
  useTheme, 
  colorPalettes, 
  ColorPalette,
  getPaletteById,
  getRandomPalette
} from './dist/theme.mjs';

console.log('ThemeProvider:', typeof ThemeProvider);
console.log('useTheme:', typeof useTheme);
console.log('colorPalettes:', Array.isArray(colorPalettes) ? colorPalettes.length : 'not an array');
console.log('getPaletteById:', typeof getPaletteById);
console.log('getRandomPalette:', typeof getRandomPalette);

// 测试类型
const testPalette: ColorPalette = colorPalettes[0];
console.log('Test palette name:', testPalette?.name);