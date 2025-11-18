#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testThemeSwitching() {
  console.log('🎨 测试 Xorigo UI 主题切换功能...');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // 访问测试页面
    await page.goto('http://localhost:3100/workbench');

    // 等待页面加载
    await page.waitForSelector('[data-theme]', { timeout: 10000 });

    // 检查初始主题
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });

    console.log(`✅ 初始主题: ${initialTheme}`);

    // 点击主题切换器按钮
    const themeButton = await page.$('button[role="button"]');
    if (themeButton) {
      console.log('✅ 找到主题切换器按钮');
      await themeButton.click();

      // 等待下拉菜单打开
      await page.waitForTimeout(500);

      // 获取可见的主题选项
      const themeOptions = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button[role="menuitem"], button[data-theme]'));
        return buttons.map(btn => btn.textContent?.trim()).filter(Boolean);
      });

      console.log(`✅ 找到 ${themeOptions.length} 个主题选项:`);
      themeOptions.slice(0, 5).forEach(option => console.log(`   - ${option}`));

      if (themeOptions.length > 5) {
        console.log(`   ... 还有 ${themeOptions.length - 5} 个主题`);
      }

      // 测试切换到极简白主题
      const minimalWhiteButton = await page.evaluateHandle(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.find(btn => btn.textContent?.includes('极简白'));
      });

      if (minimalWhiteButton) {
        console.log('✅ 找到极简白主题，正在切换...');
        await minimalWhiteButton.click();
        await page.waitForTimeout(1000);

        // 检查主题是否切换成功
        const newTheme = await page.evaluate(() => {
          return document.documentElement.getAttribute('data-theme');
        });

        console.log(`✅ 切换后主题: ${newTheme}`);

        // 检查CSS变量是否更新
        const cssVariables = await page.evaluate(() => {
          const style = getComputedStyle(document.documentElement);
          return {
            primary: style.getPropertyValue('--theme-primary'),
            bgPrimary: style.getPropertyValue('--theme-bg-primary'),
            textPrimary: style.getPropertyValue('--theme-text-primary')
          };
        });

        console.log('✅ CSS变量状态:');
        Object.entries(cssVariables).forEach(([key, value]) => {
          console.log(`   ${key}: ${value || '未设置'}`);
        });

      } else {
        console.log('❌ 未找到极简白主题按钮');
      }

    } else {
      console.log('❌ 未找到主题切换器按钮');
    }

    console.log('\n🎉 主题切换测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  } finally {
    await browser.close();
  }
}

testThemeSwitching();