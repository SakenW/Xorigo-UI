const { chromium } = require('playwright');

async function autoGalleryTest() {
  console.log('🎬 开始Playwright自动检测测试...');

  let browser;
  try {
    console.log('🔍 让Playwright自动检测浏览器...');

    // 不指定executablePath，让Playwright自动查找
    browser = await chromium.launch({
      headless: true,
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
      // 关键内容检测
      const keywords = [
        { text: 'Xorigo UI 组件库', desc: 'Gallery标题' },
        { text: '组件库展示', desc: '组件库文本' },
        { text: '404', desc: '404内容' },
        { text: '页面不存在', desc: '404文本' },
        { text: 'React', desc: 'React文本' },
        { text: 'Base 基础组件', desc: '基础组件分类' },
        { text: 'Layout 布局组件', desc: '布局组件分类' }
      ];

      keywords.forEach(({ text, desc }) => {
        const found = bodyText.includes(text);
        console.log(`   ${desc}: ${found ? '✅' : '❌'}`);
      });
    }

    // 检查关键组件
    console.log('🧩 检查组件存在情况...');

    const componentSelectors = [
      { selector: 'h1', desc: 'H1标题' },
      { selector: 'h2', desc: 'H2标题' },
      { selector: 'button', desc: '按钮组件' },
      { selector: '[class*="card"]', desc: '卡片组件' },
      { selector: '[class*="gallery"]', desc: 'Gallery组件' },
      { selector: '[class*="component"]', desc: '组件元素' }
    ];

    for (const { selector, desc } of componentSelectors) {
      const count = await page.locator(selector).count();
      console.log(`   ${desc}: ${count}个`);
    }

    // 截图
    console.log('📸 生成页面截图...');
    await page.screenshot({
      path: '/tmp/gallery-auto-screenshot.png',
      fullPage: true
    });
    console.log('   ✅ 截图已保存到 /tmp/gallery-auto-screenshot.png');

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

    if (bodyText && bodyText.includes('Xorigo UI 组件库')) {
      console.log('   ✅ Gallery页面正常显示');
    } else if (bodyText && bodyText.includes('404')) {
      console.log('   ❌ 页面显示404错误');
    } else {
      console.log('   ❓ 页面状态需要进一步检查');
    }

    // 生成诊断报告
    console.log('\n📋 详细诊断报告:');
    console.log(`   页面标题: ${title}`);
    console.log(`   页面URL: ${url}`);
    console.log(`   内容长度: ${bodyText ? bodyText.length : 0} 字符`);
    console.log(`   控制台错误: ${consoleMessages.length} 个`);

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
autoGalleryTest().catch(error => {
  console.error('💥 测试执行失败:', error.message);
  process.exit(1);
});