import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('🔍 正在检查页面状态...');

    // 访问workbench页面
    await page.goto('http://localhost:3100/workbench');

    // 等待页面加载
    await page.waitForTimeout(5000);

    // 检查页面标题
    const title = await page.title();
    console.log('📄 页面标题:', title);

    // 检查页面内容
    const content = await page.content();
    console.log('📝 页面长度:', content.length, '字符');

    // 查找错误信息
    const errorElements = await page.$$('[data-testid="error"], .error, .error-message');
    console.log('❌ 错误元素数量:', errorElements.length);

    // 查找主题切换器
    const themeSwitcher = await page.$('[data-testid="theme-switcher"], .theme-switcher');
    console.log('🎨 主题切换器存在:', !!themeSwitcher);

    // 截图
    await page.screenshot({ path: '/tmp/page-screenshot.png', fullPage: true });
    console.log('📸 已保存截图到 /tmp/page-screenshot.png');

    // 检查控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🚨 控制台错误:', msg.text());
      }
    });

    // 等待一段时间观察
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('❌ 检查过程中出错:', error.message);
  } finally {
    await browser.close();
  }
})();