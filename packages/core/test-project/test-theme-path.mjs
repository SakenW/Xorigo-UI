console.log('=== 测试 @th-ui/core/theme 路径导入 ===');

try {
  // 尝试从 @th-ui/core/theme 导入
  const theme = await import('@th-ui/core/theme');
  
  console.log('\n1. 导入成功!');
  console.log('- 导入对象键:', Object.keys(theme));
  
  if (theme.colorPalettes) {
    console.log('- 调色板数量:', theme.colorPalettes.length);
    console.log('- 第一个调色板:', theme.colorPalettes[0]?.name || 'undefined');
  }
  
} catch (error) {
  console.error('\n导入失败:', error.message);
  console.error('错误类型:', error.code);
}

console.log('\n=== 测试完成 ===');