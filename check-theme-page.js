import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('🔍 检查独立主题页面...');

    // 检查端口8081是否可用
    const response1 = await page.goto('http://localhost:8081/theme-test-complete.html', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    if (response1) {
      console.log('✅ 端口8081可以访问');

      const title = await page.title();
      console.log('📄 页面标题:', title);

      // 检查页面内容
      const content = await page.content();
      console.log('📝 页面长度:', content.length, '字符');

      // 查找主题元素
      const themeCards = await page.$$('.theme-card');
      console.log('🎨 主题卡片数量:', themeCards.length);

      // 查找分类按钮
      const categoryCards = await page.$$('.category-card');
      console.log('📂 分类卡片数量:', categoryCards.length);

      // 检查搜索框
      const searchInput = await page.$('#searchInput');
      console.log('🔍 搜索框存在:', !!searchInput);

      // 检查主题网格
      const themeGrid = await page.$('#themeGrid');
      console.log('📋 主题网格存在:', !!themeGrid);

      // 尝试点击一个主题
      if (themeCards.length > 0) {
        console.log('🎯 尝试点击第一个主题...');
        await themeCards[0].click();

        // 等待主题应用
        await page.waitForTimeout(2000);

        // 检查是否有活动主题
        const activeTheme = await page.$('.theme-card.active');
        console.log('✅ 活动主题存在:', !!activeTheme);
      }

      // 截图
      await page.screenshot({ path: '/tmp/theme-page-screenshot.png', fullPage: true });
      console.log('📸 已保存截图到 /tmp/theme-page-screenshot.png');

    } else {
      console.log('❌ 端口8081无法访问');
    }

    // 也检查Next.js是否拦截了请求
    console.log('\n🔍 检查Next.js是否拦截了独立页面...');
    try {
      const response2 = await page.goto('http://localhost:3100/theme-test-complete.html', {
        waitUntil: 'networkidle',
        timeout: 5000
      });

      if (response2) {
        console.log('⚠️ Next.js拦截了独立页面请求，状态码:', response2.status());
      }
    } catch (error) {
      console.log('❌ Next.js也无法访问:', error.message);
    }

    console.log('✅ 检查完成');

  } catch (error) {
    console.error('❌ 检查过程中出错:', error.message);
  } finally {
    await browser.close();
  }
})();