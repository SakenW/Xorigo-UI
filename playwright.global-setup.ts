import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 启动Playwright视觉回归测试...');

  // 设置全局超时
  if (process.env.CI) {
    console.log('🏃‍♂️ CI环境 - 设置快速模式');
  }

  // 创建浏览器实例用于预加载
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 确保开发服务器已启动
    console.log('🔍 检查开发服务器状态...');
    await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });

    // 等待页面完全加载
    await page.waitForLoadState('networkidle');

    console.log('✅ 开发服务器运行正常');

  } catch (error) {
    console.error('❌ 开发服务器连接失败:', error);
    throw new Error('开发服务器未启动或无法访问');
  } finally {
    await browser.close();
  }
}

export default globalSetup;