const { test, expect } = require('@playwright/test');

test.describe('Gallery页面检查', () => {
  test('基础页面加载和组件检查', async ({ page }) => {
    console.log('🎬 开始Gallery页面检查...');

    try {
      // 访问Gallery页面
      console.log('🌐 访问Gallery页面...');
      await page.goto('http://localhost:3100/gallery', {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // 检查页面标题
      const title = await page.title();
      console.log(`📄 页面标题: ${title}`);
      expect(title).toContain('组件库展示');

      // 检查页面内容
      console.log('🔍 检查页面内容...');

      // 检查是否有错误元素
      const errorElements = await page.locator('.error, .error-message, [data-error], .error-boundary').count();
      if (errorElements > 0) {
        console.log(`❌ 发现 ${errorElements} 个错误元素`);
      } else {
        console.log('✅ 未发现明显的错误元素');
      }

      // 检查Gallery相关组件
      const galleryElements = await page.locator('[class*="gallery"], [class*="Gallery"]').count();
      console.log(`✅ 发现 ${galleryElements} 个Gallery相关元素`);

      // 检查Card组件
      const cardElements = await page.locator('[class*="card"], [class*="Card"]').count();
      console.log(`✅ 发现 ${cardElements} 个Card相关元素`);

      // 检查按钮组件
      const buttonElements = await page.locator('button, [role="button"], [class*="button"], [class*="Button"]').count();
      console.log(`✅ 发现 ${buttonElements} 个按钮元素`);

      // 检查导航元素
      const navElements = await page.locator('nav, [role="navigation"], [class*="nav"], [class*="Nav"]').count();
      console.log(`✅ 发现 ${navElements} 个导航元素`);

      // 检查页面性能指标
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

      console.log(`⚡ DOM内容加载时间: ${performanceMetrics.domContentLoaded}ms`);
      console.log(`⚡ 页面完全加载时间: ${performanceMetrics.loadComplete}ms`);
      console.log(`⚡ 首次绘制时间: ${performanceMetrics.firstPaint.toFixed(2)}ms`);
      console.log(`⚡ 首次内容绘制时间: ${performanceMetrics.firstContentfulPaint.toFixed(2)}ms`);

      // 截图保存
      await page.screenshot({
        path: '/tmp/gallery-screenshot.png',
        fullPage: true
      });
      console.log('✅ 截图已保存到 /tmp/gallery-screenshot.png');

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
        });
      } else {
        console.log('✅ 未发现控制台错误或警告');
      }

      // 最终总结
      console.log('\n🎯 Playwright检查总结:');
      console.log(`   ✅ 页面加载成功`);
      console.log(`   ✅ 页面标题: ${title}`);
      console.log(`   ✅ Gallery组件: ${galleryElements}个`);
      console.log(`   ✅ Card组件: ${cardElements}个`);
      console.log(`   ✅ 按钮组件: ${buttonElements}个`);
      console.log(`   ✅ 导航组件: ${navElements}个`);
      console.log(`   ⚡ 加载性能: ${performanceMetrics.loadComplete}ms`);
      console.log(`   ✅ 页面截图: 已生成`);

      if (errorElements === 0 && consoleMessages.length === 0) {
        console.log('\n🎉 Gallery页面检查完全通过！');
      } else {
        console.log('\n⚠️ Gallery页面存在一些问题，需要进一步检查。');
      }

    } catch (error) {
      console.error('❌ Playwright检查失败:', error.message);
      throw error;
    }
  });
});