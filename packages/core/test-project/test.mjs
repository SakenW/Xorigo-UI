// JavaScript 测试从 @th-ui/core 导入主题模块
import { 
  ThemeProvider, 
  useTheme, 
  colorPalettes, 
  getPaletteById,
  getRandomPalette
} from '../dist/theme.mjs';

// 运行时测试
console.log('ThemeProvider:', typeof ThemeProvider);
console.log('useTheme:', typeof useTheme);
console.log('colorPalettes:', Array.isArray(colorPalettes) ? colorPalettes.length : 'not an array');
console.log('getPaletteById:', typeof getPaletteById);
console.log('getRandomPalette:', typeof getRandomPalette);

// 测试调色板
if (colorPalettes && colorPalettes.length > 0) {
  console.log('First palette name:', colorPalettes[0].name);
  console.log('Available palettes:', colorPalettes.map(p => p.name).join(', '));
} else {
  console.log('No color palettes found');
}

// 测试获取调色板函数
const testPalette = getPaletteById('default');
if (testPalette) {
  console.log('Test palette name:', testPalette?.name);
  console.log('Test palette colors:', Object.keys(testPalette.colors || {}).length);
} else {
  console.log('Default palette not found');
}

// 测试随机调色板
const randomPalette = getRandomPalette();
if (randomPalette) {
  console.log('Random palette name:', randomPalette.name);
} else {
  console.log('Random palette not found');
}