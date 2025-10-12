console.log('=== 主题模块导入测试 ===');

// 导入主题模块
import { 
  ThemeProvider, 
  useTheme, 
  colorPalettes, 
  getPaletteById,
  getRandomPalette
} from '../dist/theme.mjs';

console.log('\n1. 导入的函数和对象:');
console.log('- ThemeProvider:', typeof ThemeProvider);
console.log('- useTheme:', typeof useTheme);
console.log('- colorPalettes:', typeof colorPalettes);

console.log('\n2. 调色板信息:');
if (colorPalettes && Array.isArray(colorPalettes)) {
  console.log('- 调色板数量:', colorPalettes.length);
  console.log('- 第一个调色板:', colorPalettes[0]?.name || 'undefined');
  console.log('- 所有调色板名称:', colorPalettes.map(p => p.name).join(', '));
} else {
  console.log('- 调色板不是数组或未定义');
}

console.log('\n3. 调色板函数测试:');
if (typeof getPaletteById === 'function') {
  const defaultPalette = getPaletteById('cyber-blue-purple');
  if (defaultPalette) {
    console.log('- 通过ID获取调色板成功:', defaultPalette.name);
    console.log('- 主色调数量:', Object.keys(defaultPalette.primary || {}).length);
  } else {
    console.log('- 通过ID获取调色板失败');
  }
} else {
  console.log('- getPaletteById 不是函数');
}

if (typeof getRandomPalette === 'function') {
  const randomPalette = getRandomPalette();
  if (randomPalette) {
    console.log('- 随机调色板:', randomPalette.name);
  } else {
    console.log('- 获取随机调色板失败');
  }
} else {
  console.log('- getRandomPalette 不是函数');
}

console.log('\n=== 测试完成 ===');