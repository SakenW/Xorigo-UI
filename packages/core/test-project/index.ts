// TypeScript 测试从 @th-ui/core 导入主题模块
import { 
  ThemeProvider, 
  useTheme, 
  colorPalettes, 
  ColorPalette,
  getPaletteById,
  getRandomPalette
} from '@th-ui/core/theme';

// 类型测试
const themeProvider: typeof ThemeProvider = ThemeProvider;
const useThemeHook: typeof useTheme = useTheme;
const palettes: ColorPalette[] = colorPalettes;
const getPalette: typeof getPaletteById = getPaletteById;
const getRandom: typeof getRandomPalette = getRandomPalette;

// 运行时测试
console.log('ThemeProvider:', typeof themeProvider);
console.log('useTheme:', typeof useThemeHook);
console.log('colorPalettes:', Array.isArray(palettes) ? palettes.length : 'not an array');
console.log('getPaletteById:', typeof getPalette);
console.log('getRandomPalette:', typeof getRandom);

// 测试调色板
if (palettes && palettes.length > 0) {
  console.log('First palette name:', palettes[0].name);
} else {
  console.log('No color palettes found');
}