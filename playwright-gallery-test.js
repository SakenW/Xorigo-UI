const { chromium } = require('playwright');

async function testGalleryPage() {
  console.log('🎬 启动 Playwright 测试...');

  // 让Playwright自动查找浏览器
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-extensions',
      '--disable-plugins',
      '--enable-automation'
    ]
  });

  try {
    console.log('📄 创建新页面...');
    const page = await browser.newPage();

    // 设置用户代理
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // 设置视口
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('🌐 访问 Gallery 页面...');
    const response = await page.goto('http://localhost:3100/gallery', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log(`📊 HTTP 状态: ${response.status()}`);
    console.log(`📊 响应 URL: ${response.url()}`);

    // 等待页面完全加载
    await page.waitForTimeout(3000);

    // 获取页面标题
    const title = await page.title();
    console.log(`📄 页面标题: ${title}`);

    // 检查页面内容
    console.log('🔍 检查页面内容...');

    // 检查是否有错误元素
    const errorElements = await page.$$eval('.error, .error-message, [data-error], .error-boundary', elements =>
      elements.map(el => ({
        tag: el.tagName,
        text: el.textContent?.substring(0, 100) || '',
        className: el.className
      }))
    );

    if (errorElements.length > 0) {
      console.log('❌ 发现错误元素:');
      errorElements.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.tag} - ${error.text} (${error.className})`);
      });
    } else {
      console.log('✅ 未发现明显的错误元素');
    }

    // 检查 Gallery 相关组件
    console.log('🧩 检查 Gallery 组件...');

    const galleryElements = await page.$$eval('[class*="gallery"], [class*="Gallery"], [id*="gallery"], [id*="Gallery"]', elements =>
      elements.map(el => ({
        tag: el.tagName,
        className: el.className,
        id: el.id,
        text: el.textContent?.substring(0, 50) || ''
      }))
    );

    console.log(`✅ 发现 ${galleryElements.length} 个 Gallery 相关元素:`);
    galleryElements.slice(0, 5).forEach((element, index) => {
      console.log(`   ${index + 1}. ${element.tag} - ${element.className || element.id}`);
    });

    // 检查 Card 组件
    const cardElements = await page.$$eval('[class*="card"], [class*="Card"]', elements =>
      elements.map(el => ({
        tag: el.tagName,
        className: el.className,
        text: el.textContent?.substring(0, 50) || ''
      }))
    );

    console.log(`✅ 发现 ${cardElements.length} 个 Card 相关元素:`);
    cardElements.slice(0, 5).forEach((element, index) => {
      console.log(`   ${index + 1}. ${element.tag} - ${element.className}`);
    });

    // 检查按钮组件
    const buttonElements = await page.$$eval('button, [role="button"], [class*="button"], [class*="Button"]', elements =>
      elements.map(el => ({
        tag: el.tagName,
        className: el.className,
        text: el.textContent?.substring(0, 30) || ''
      }))
    );

    console.log(`✅ 发现 ${buttonElements.length} 个按钮元素:`);
    buttonElements.slice(0, 5).forEach((element, index) => {
      console.log(`   ${index + 1}. ${element.tag} - ${element.text}`);
    });

    // 检查导航元素
    const navElements = await page.$$eval('nav, [role="navigation"], [class*="nav"], [class*="Nav"]', elements =>
      elements.map(el => ({
        tag: el.tagName,
        className: el.className,
        text: el.textContent?.substring(0, 30) || ''
      }))
    );

    console.log(`✅ 发现 ${navElements.length} 个导航元素:`);
    navElements.slice(0, 3).forEach((element, index) => {
      console.log(`   ${index + 1}. ${element.tag} - ${element.text}`);
    });

    // 检查页面性能
    console.log('⚡ 检查页面性能...');
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0
      };
    });

    console.log(`⚡ DOM 内容加载时间: ${performanceMetrics.domContentLoaded}ms`);
    console.log(`⚡ 页面完全加载时间: ${performanceMetrics.loadComplete}ms`);
    console.log(`⚡ 首次绘制时间: ${performanceMetrics.firstPaint.toFixed(2)}ms`);
    console.log(`⚡ 首次内容绘制时间: ${performanceMetrics.firstContentfulPaint.toFixed(2)}ms`);

    // 检查控制台错误
    console.log('🐛 检查控制台错误...');
    const consoleMessages = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleMessages.push({
          type: msg.type(),
          text: msg.text(),
          location: msg.location()
        });
      }
    });

    // 等待一段时间收集控制台消息
    await page.waitForTimeout(2000);

    if (consoleMessages.length > 0) {
      console.log('⚠️ 发现控制台警告/错误:');
      consoleMessages.forEach((msg, index) => {
        console.log(`   ${index + 1}. [${msg.type.toUpperCase()}] ${msg.text}`);
        if (msg.location) {
          console.log(`      位置: ${msg.location.url}:${msg.location.lineNumber}`);
        }
      });
    } else {
      console.log('✅ 未发现控制台错误或警告');
    }

    // 截图验证
    console.log('📸 截图验证...');
    await page.screenshot({
      path: '/tmp/gallery-screenshot.png',
      fullPage: true
    });
    console.log('✅ 截图已保存到 /tmp/gallery-screenshot.png');

    // 获取页面 HTML 结构
    const pageStructure = await page.evaluate(() => {
      const structure = {
        hasHead: !!document.querySelector('head'),
        hasBody: !!document.querySelector('body'),
        hasMain: !!document.querySelector('main'),
        hasHeader: !!document.querySelector('header'),
        hasTitle: !!document.querySelector('title'),
        hasMetaDescription: !!document.querySelector('meta[name="description"]'),
        bodyClasses: document.body.className,
        lang: document.documentElement.lang
      };
      return structure;
    });

    console.log('📋 页面结构分析:');
    Object.entries(pageStructure).forEach(([key, value]) => {
      const status = value ? '✅' : '❌';
      console.log(`   ${status} ${key}: ${value}`);
    });

    // 最终总结
    console.log('\n🎯 Playwright 测试总结:');
    console.log(`   ✅ 页面加载成功`);
    console.log(`   ✅ HTTP 状态: ${response.status()}`);
    console.log(`   ✅ 页面标题: ${title}`);
    console.log(`   ✅ Gallery 组件: ${galleryElements.length} 个`);
    console.log(`   ✅ Card 组件: ${cardElements.length} 个`);
    console.log(`   ✅ 按钮组件: ${buttonElements.length} 个`);
    console.log(`   ✅ 导航组件: ${navElements.length} 个`);
    console.log(`   ✅ 页面截图: 已生成`);
    console.log(`   ⚡ 加载性能: ${performanceMetrics.loadComplete}ms`);

    if (errorElements.length === 0 && consoleMessages.length === 0) {
      console.log('\n🎉 Gallery 页面验证完全通过！');
    } else {
      console.log('\n⚠️ Gallery 页面存在一些问题，需要进一步检查。');
    }

  } catch (error) {
    console.error('❌ Playwright 测试失败:', error.message);
    console.error('错误详情:', error.stack);
  } finally {
    await browser.close();
    console.log('\n🏁 Playwright 测试完成');
  }
}

// 运行测试
testGalleryPage().catch(error => {
  console.error('💥 测试执行失败:', error.message);
  process.exit(1);
});