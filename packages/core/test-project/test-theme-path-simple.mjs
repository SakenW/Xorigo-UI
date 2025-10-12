/**
 * 测试从 @th-ui/core/theme 导入主题模块
 */

console.log('=== 测试 @th-ui/core/theme 路径导入 ===');

try {
  // 尝试导入主题模块
  const themeModule = await import('@th-ui/core/theme');
  
  console.log('成功导入主题模块');
  console.log('可用的导出:', Object.keys(themeModule));
  
  // 检查是否有 ThemeProvider
  if (themeModule.ThemeProvider) {
    console.log('✓ ThemeProvider 可用');
  } else {
    console.log('✗ ThemeProvider 不可用');
  }
  
  // 检查是否有 useTheme
  if (themeModule.useTheme) {
    console.log('✓ useTheme 可用');
  } else {
    console.log('✗ useTheme 不可用');
  }
  
  // 检查是否有 colorPalettes
  if (themeModule.colorPalettes) {
    console.log('✓ colorPalettes 可用');
    console.log(`调色板数量: ${themeModule.colorPalettes.length}`);
    console.log('前3个调色板名称:', themeModule.colorPalettes.slice(0, 3).map(p => p.name));
  } else {
    console.log('✗ colorPalettes 不可用');
  }
  
  // 检查是否有 getPaletteById
  if (themeModule.getPaletteById) {
    console.log('✓ getPaletteById 可用');
    const palette = themeModule.getPaletteById('cyber-blue-purple');
    if (palette) {
      console.log(`成功获取调色板: ${palette.name}`);
    } else {
      console.log('获取调色板失败');
    }
  } else {
    console.log('✗ getPaletteById 不可用');
  }
  
  // 检查是否有 getRandomPalette
  if (themeModule.getRandomPalette) {
    console.log('✓ getRandomPalette 可用');
    const randomPalette = themeModule.getRandomPalette();
    console.log(`随机调色板: ${randomPalette.name}`);
  } else {
    console.log('✗ getRandomPalette 不可用');
  }
  
} catch (error) {
  console.log('导入失败:', error.message);
  console.log('错误类型:', error.code);
}

console.log('=== 测试完成 ===');