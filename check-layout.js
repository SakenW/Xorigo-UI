import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('🔍 检查独立主题页面布局...');

    // 访问独立主题页面
    await page.goto('http://localhost:8081/theme-test-complete.html', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    // 检查视口大小
    const viewport = page.viewportSize();
    console.log('📐 视口大小:', viewport);

    // 检查页面主体布局
    const body = await page.$('body');
    const bodyStyles = await body.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        margin: computed.margin,
        padding: computed.padding,
        backgroundColor: computed.backgroundColor,
        minHeight: computed.minHeight
      };
    });
    console.log('📄 Body样式:', bodyStyles);

    // 检查头部区域
    const header = await page.$('.header');
    if (header) {
      const headerStyles = await header.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          padding: computed.padding,
          backgroundColor: computed.backgroundColor,
          position: computed.position
        };
      });
      console.log('🎯 Header样式:', headerStyles);
    }

    // 检查主容器
    const container = await page.$('.container');
    if (container) {
      const containerStyles = await container.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          maxWidth: computed.maxWidth,
          margin: computed.margin,
          padding: computed.padding,
          width: computed.width
        };
      });
      console.log('📦 Container样式:', containerStyles);
    }

    // 检查搜索区域
    const searchBox = await page.$('.search-box');
    if (searchBox) {
      const searchStyles = await searchBox.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          position: computed.position,
          width: computed.width,
          margin: computed.margin
        };
      });
      console.log('🔍 搜索框样式:', searchStyles);
    }

    // 检查分类过滤器
    const filterButtons = await page.$('.filter-buttons');
    if (filterButtons) {
      const filterStyles = await filterButtons.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          gridTemplateColumns: computed.gridTemplateColumns,
          gap: computed.gap,
          marginBottom: computed.marginBottom
        };
      });
      console.log('📂 分类过滤器样式:', filterStyles);
    }

    // 检查主题网格
    const themeGrid = await page.$('.theme-grid');
    if (themeGrid) {
      const gridStyles = await themeGrid.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          gridTemplateColumns: computed.gridTemplateColumns,
          gap: computed.gap,
          maxHeight: computed.maxHeight
        };
      });
      console.log('🎨 主题网格样式:', gridStyles);
    }

    // 检查主题卡片布局
    const themeCard = await page.$('.theme-card');
    if (themeCard) {
      const cardStyles = await themeCard.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          padding: computed.padding,
          border: computed.border,
          borderRadius: computed.borderRadius,
          minHeight: computed.minHeight
        };
      });
      console.log('🎭 主题卡片样式:', cardStyles);
    }

    // 检查分类卡片样式
    const categoryCard = await page.$('.category-card');
    if (categoryCard) {
      const categoryStyles = await categoryCard.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          padding: computed.padding,
          gap: computed.gap,
          minHeight: computed.minHeight,
          borderRadius: computed.borderRadius
        };
      });
      console.log('📂 分类卡片样式:', categoryStyles);
    }

    // 检查响应式布局
    const viewportSizes = [
      { width: 1200, height: 800 },  // 桌面
      { width: 768, height: 1024 },   // 平板
      { width: 375, height: 667 }    // 移动
    ];

    for (const size of viewportSizes) {
      console.log(`\n📱 检查响应式布局 (${size.width}x${size.height}):`);
      await page.setViewportSize(size);

      // 等待重绘
      await page.waitForTimeout(500);

      const filterButtons = await page.$('.filter-buttons');
      if (filterButtons) {
        const filterStyles = await filterButtons.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return computed.gridTemplateColumns;
        });
        console.log(`  分类网格: ${filterStyles}`);
      }
    }

    // 截图显示当前状态
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({
      path: '/tmp/theme-layout-desktop.png',
      fullPage: true
    });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.screenshot({
      path: '/tmp/theme-layout-tablet.png',
      fullPage: true
    });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: '/tmp/theme-layout-mobile.png',
      fullPage: true
    });

    console.log('\n📸 已保存布局截图到 /tmp/ 目录');
    console.log('  - theme-layout-desktop.png');
    console.log('  - theme-layout-tablet.png');
    console.log('  - theme-layout-mobile.png');

    console.log('\n✅ 布局检查完成');

  } catch (error) {
    console.error('❌ 检查过程中出错:', error.message);
  } finally {
    await browser.close();
  }
})();