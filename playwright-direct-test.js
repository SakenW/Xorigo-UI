const { chromium } = require('playwright');

async function directGalleryTest() {
  console.log('🎬 开始Playwright直接测试...');

  let browser;
  try {
    console.log('🔍 使用直接路径启动Chromium...');

    browser = await chromium.launch({
      headless: true,
      executablePath: '/home/node/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security'
      ]
    });

    console.log('✅ 浏览器启动成功');

    const page = await browser.newPage();

    // 监听控制台消息
    const consoleMessages = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
      console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    });

    // 监听页面错误
    page.on('pageerror', error => {
      console.log('🚨 页面错误:', error.message);
    });

    // 监听请求失败
    const failedRequests = [];
    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        error: request.failure().errorText
      });
      console.log('❌ 请求失败:', request.url(), '-', request.failure().errorText);
    });

    console.log('🌐 访问Gallery页面...');
    await page.goto('http://localhost:3100/gallery', {
      waitUntil: 'networkidle',
      timeout: 20000
    });

    console.log('⏳ 等待页面完全加载...');
    await page.waitForTimeout(5000);

    // 获取页面基本信息
    const title = await page.title();
    const url = page.url();
    console.log(`📄 页面标题: ${title}`);
    console.log(`🔗 当前URL: ${url}`);

    // 检查页面内容
    console.log('🔍 检查页面内容...');

    const bodyText = await page.locator('body').textContent();
    console.log(`   Body内容长度: ${bodyText ? bodyText.length : 0} 字符`);

    if (bodyText) {
      const hasGalleryTitle = bodyText.includes('Xorigo UI 组件库');
      const has404Content = bodyText.includes('404') || bodyText.includes('页面不存在');
      const hasComponentText = bodyText.includes('组件库展示');
      const hasErrorText = bodyText.includes('错误') || bodyText.includes('error');
      const hasReactText = bodyText.includes('React');

      console.log(`   Gallery标题: ${hasGalleryTitle ? '✅' : '❌'}`);
      console.log(`   组件库文本: ${hasComponentText ? '✅' : '❌'}`);
      console.log(`   404内容: ${has404Content ? '❌' : '✅'}`);
      console.log(`   错误文本: ${hasErrorText ? '❌' : '✅'}`);
      console.log(`   React文本: ${hasReactText ? '✅' : '❌'}`);

      // 查找关键组件
      const hasGalleryComponent = await page.locator('[data-testid*="gallery"], [class*="gallery"]').count() > 0;
      const hasCardComponent = await page.locator('[class*="card"], [class*="Card"]').count() > 0;
      const hasButtonComponent = await page.locator('button, [role="button"]').count() > 0;

      console.log(`   Gallery组件: ${hasGalleryComponent ? '✅' : '❌'}`);
      console.log(`   Card组件: ${hasCardComponent ? '✅' : '❌'}`);
      console.log(`   Button组件: ${hasButtonComponent ? '✅' : '❌'}`);
    }

    // 检查DOM结构
    console.log('🏗️ 检查DOM结构...');
    const htmlContent = await page.content();
    console.log(`   HTML大小: ${htmlContent.length} 字符`);

    // 查找关键元素
    const h1Count = await page.locator('h1').count();
    const h2Count = await page.locator('h2').count();
    const divCount = await page.locator('div').count();
    const buttonCount = await page.locator('button').count();

    console.log(`   H1标签数量: ${h1Count}`);
    console.log(`   H2标签数量: ${h2Count}`);
    console.log(`   DIV标签数量: ${divCount}`);
    console.log(`   BUTTON标签数量: ${buttonCount}`);

    // 截图
    console.log('📸 生成页面截图...');
    await page.screenshot({
      path: '/tmp/gallery-direct-screenshot.png',
      fullPage: true
    });
    console.log('   ✅ 截图已保存到 /tmp/gallery-direct-screenshot.png');

    // 最终诊断
    console.log('\n🎯 Playwright诊断结果:');

    if (consoleMessages.length > 0) {
      console.log(`   ⚠️ 发现 ${consoleMessages.length} 个控制台错误:`);
      consoleMessages.forEach((msg, index) => {
        console.log(`     ${index + 1}. ${msg}`);
      });
    } else {
      console.log('   ✅ 未发现控制台错误');
    }

    if (failedRequests.length > 0) {
      console.log(`   ❌ 发现 ${failedRequests.length} 个失败的请求`);
    } else {
      console.log('   ✅ 所有网络请求成功');
    }

    if (bodyText && bodyText.includes('Xorigo UI 组件库')) {
      console.log('   ✅ Gallery页面正常显示');
    } else if (bodyText && bodyText.includes('404')) {
      console.log('   ❌ 页面显示404错误');
    } else {
      console.log('   ❓ 页面状态需要进一步检查');
    }

  } catch (error) {
    console.error('❌ Playwright测试失败:', error.message);
    console.error('   错误详情:', error.stack);
  } finally {
    if (browser) {
      await browser.close();
      console.log('✅ 浏览器已关闭');
    }
  }
}

// 运行测试
directGalleryTest().catch(error => {
  console.error('💥 测试执行失败:', error.message);
  process.exit(1);
});