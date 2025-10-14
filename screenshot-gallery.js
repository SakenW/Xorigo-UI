const puppeteer = require('puppeteer');
const fs = require('fs');

async function takeScreenshot() {
  console.log('🚀 启动 Puppeteer...');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();

    // 设置视口大小
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('📸 访问 Gallery 页面...');
    await page.goto('http://localhost:3100/gallery', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // 等待页面加载完成
    await page.waitForTimeout(3000);

    // 获取页面标题
    const title = await page.title();
    console.log(`📄 页面标题: ${title}`);

    // 获取页面主要内容
    const content = await page.$eval('body', el => {
      const h1 = el.querySelector('h1');
      const main = el.querySelector('main');
      return {
        heading: h1 ? h1.textContent : 'No H1 found',
        mainContent: main ? main.textContent.substring(0, 200) + '...' : 'No main content found'
      };
    });

    console.log(`🎯 主要内容: ${content.heading}`);
    console.log(`📝 内容预览: ${content.mainContent}`);

    // 截图
    const screenshot = await page.screenshot({
      path: '/tmp/gallery-screenshot.png',
      fullPage: true
    });

    console.log('✅ 截图已保存到 /tmp/gallery-screenshot.png');

    // 检查是否有错误元素
    const errors = await page.$$eval('.error, .error-message, [data-error]', elements =>
      elements.map(el => ({ tag: el.tagName, text: el.textContent.substring(0, 100) }))
    );

    if (errors.length > 0) {
      console.log('⚠️ 发现错误元素:', errors);
    } else {
      console.log('✅ 未发现明显的错误元素');
    }

    // 检查组件是否正常加载
    const components = await page.$$eval('[class*="gallery"], [class*="component"], [class*="card"]', elements =>
      elements.map(el => ({ tag: el.tagName, className: el.className }))
    );

    console.log(`🧩 发现 ${components.length} 个组件元素`);
    components.slice(0, 5).forEach((comp, index) => {
      console.log(`   ${index + 1}. ${comp.tag} - ${comp.className}`);
    });

  } catch (error) {
    console.error('❌ 截图失败:', error.message);
  } finally {
    await browser.close();
  }
}

takeScreenshot().then(() => {
  console.log('🎉 截图任务完成');
}).catch(error => {
  console.error('💥 任务失败:', error);
});