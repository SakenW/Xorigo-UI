const { chromium } = require('playwright');

async function simpleGalleryTest() {
  console.log('🎬 开始Playwright简单测试...');

  let browser;
  try {
    // 尝试不同的启动方式
    console.log('🔍 尝试启动Chromium...');

    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    console.log('✅ 浏览器启动成功');

    const page = await browser.newPage();

    // 设置用户代理
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // 访问页面
    console.log('🌐 访问Gallery页面...');
    await page.goto('http://localhost:3100/gallery', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    // 等待页面完全加载
    await page.waitForTimeout(3000);

    // 获取页面标题
    const title = await page.title();
    console.log(`📄 页面标题: ${title}`);

    // 获取页面URL（检查是否被重定向）
    const url = page.url();
    console.log(`🔗 当前URL: ${url}`);

    // 检查页面内容
    console.log('🔍 检查页面内容...');

    // 检查是否有Gallery相关内容
    const hasGalleryTitle = await page.locator('h1, h2').filter({ hasText: 'Xorigo UI' }).count() > 0;
    const has404Content = await page.locator('text=404').count() > 0;
    const hasLoadingContent = await page.locator('[class*="loading"], [class*="skeleton"]').count() > 0;

    console.log(`   Gallery标题: ${hasGalleryTitle ? '✅' : '❌'}`);
    console.log(`   404内容: ${has404Content ? '❌' : '✅'}`);
    console.log(`   加载状态: ${hasLoadingContent ? '⏳' : '✅'}`);

    // 检查控制台错误
    console.log('🐛 检查控制台错误...');
    const consoleMessages = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push({
          type: msg.type(),
          text: msg.text(),
          location: msg.location()
        });
      }
    });

    // 等待更多控制台消息
    await page.waitForTimeout(2000);

    if (consoleMessages.length > 0) {
      console.log(`   发现 ${consoleMessages.length} 个控制台错误:`);
      consoleMessages.forEach((msg, index) => {
        console.log(`     ${index + 1}. [${msg.type.toUpperCase()}] ${msg.text}`);
        if (msg.location) {
          console.log(`        位置: ${msg.location.url}:${msg.location.lineNumber}`);
        }
      });
    } else {
      console.log('   ✅ 未发现控制台错误');
    }

    // 获取页面截图
    console.log('📸 生成页面截图...');
    await page.screenshot({
      path: '/tmp/gallery-playwright-screenshot.png',
      fullPage: true
    });
    console.log('   ✅ 截图已保存到 /tmp/gallery-playwright-screenshot.png');

    // 检查页面DOM结构
    console.log('🏗️ 检查DOM结构...');

    const bodyText = await page.locator('body').textContent();
    if (bodyText && bodyText.trim().length > 0) {
      console.log(`   Body内容长度: ${bodyText.length} 字符`);

      // 查找关键文本
      const hasComponentText = bodyText.includes('组件库展示');
      const hasErrorText = bodyText.includes('页面不存在');
      const hasReactText = bodyText.includes('React');

      console.log(`   组件库文本: ${hasComponentText ? '✅' : '❌'}`);
      console.log(`   错误文本: ${hasErrorText ? '❌' : '✅'}`);
      console.log(`   React文本: ${hasReactText ? '✅' : '❌'}`);
    } else {
      console.log('   ❌ Body内容为空');
    }

    // 检查网络请求状态
    console.log('🌐 检查网络请求...');
    const failedRequests = [];

    page.on('requestfailed', request => {
      failedRequests.push({
        url: request.url(),
        failure: request.failure()
      });
    });

    await page.waitForTimeout(1000);

    if (failedRequests.length > 0) {
      console.log(`   ❌ 发现 ${failedRequests.length} 个失败的请求:`);
      failedRequests.forEach((req, index) => {
        console.log(`     ${index + 1}. ${req.url} - ${req.failure.errorText}`);
      });
    } else {
      console.log('   ✅ 所有网络请求成功');
    }

    // 最终诊断
    console.log('\n🎯 Playwright诊断结果:');

    if (has404Content) {
      console.log('   ❌ 页面显示404错误');
    } else if (hasGalleryTitle) {
      console.log('   ✅ Gallery页面正常显示');
    } else if (hasLoadingContent) {
      console.log('   ⏳ 页面正在加载中');
    } else {
      console.log('   ❓ 页面状态不明');
    }

    if (consoleMessages.length > 0) {
      console.log('   ⚠️ 发现JavaScript错误，需要修复');
    }

    if (failedRequests.length > 0) {
      console.log('   ⚠️ 发现网络请求失败');
    }

  } catch (error) {
    console.error('❌ Playwright测试失败:', error.message);
    console.error('   错误详情:', error.stack);

    // 提供故障排除建议
    console.log('\n💡 故障排除建议:');
    console.log('   1. 检查Docker容器是否正确运行');
    console.log('   2. 确认端口3100可访问');
    console.log('   3. 检查Playwright浏览器安装');
    console.log('   4. 尝试手动访问页面验证状态');

  } finally {
    if (browser) {
      await browser.close();
      console.log('✅ 浏览器已关闭');
    }
  }
}

// 运行测试
simpleGalleryTest().catch(error => {
  console.error('💥 测试执行失败:', error.message);
  process.exit(1);
});