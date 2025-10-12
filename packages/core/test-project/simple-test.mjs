// 简单测试
console.log('Starting test...');

try {
  const theme = await import('../dist/theme.mjs');
  console.log('Module imported successfully');
  console.log('Exports:', Object.keys(theme));
  
  if (theme.colorPalettes) {
    console.log('Color palettes found:', theme.colorPalettes.length);
  } else {
    console.log('No color palettes found');
  }
} catch (error) {
  console.error('Error:', error);
}