const { chromium } = require('playwright');

(async () => {
  console.log('🔍 检查workbench页面主题切换功能...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  try {
    // 访问workbench页面
    await page.goto('http://localhost:3100/workbench');
    await page.waitForTimeout(3000);

    console.log('✅ Workbench页面加载成功');

    // 检查主题切换器是否存在
    const themeSwitcher = await page.$('[data-testid="recipe-theme-switcher"], .relative');
    if (themeSwitcher) {
      console.log('✅ 找到主题切换器组件');
    } else {
      console.log('❌ 未找到主题切换器组件');

      // 查找可能的主题切换按钮
      const buttons = await page.$$('button');
      console.log(`📊 页面共有 ${buttons.length} 个按钮`);

      for (let i = 0; i < Math.min(buttons.length, 5); i++) {
        const text = await buttons[i].textContent();
        console.log(`  按钮 ${i + 1}: "${text}"`);
      }
    }

    // 尝试查找主题相关的按钮或元素
    const themeButtons = await page.$$('[class*="theme"], [class*="Theme"]');
    console.log(`🎨 找到 ${themeButtons.length} 个主题相关元素`);

    // 检查是否有下拉菜单或选择器
    const dropdowns = await page.$$('select, [role="combobox"], [aria-expanded]');
    console.log(`📋 找到 ${dropdowns.length} 个下拉组件`);

    // 检查CSS变量是否已设置
    const rootStyles = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = window.getComputedStyle(root);
      return {
        primary: computedStyle.getPropertyValue('--theme-primary'),
        secondary: computedStyle.getPropertyValue('--theme-secondary'),
        accent: computedStyle.getPropertyValue('--theme-accent'),
        background: computedStyle.getPropertyValue('--theme-background')
      };
    });

    console.log('🎨 当前CSS变量状态:');
    Object.entries(rootStyles).forEach(([key, value]) => {
      console.log(`  --${key}: ${value || '未设置'}`);
    });

    // 截图保存当前状态
    await page.screenshot({
      path: '/tmp/workbench-theme-state.png',
      fullPage: true
    });

    // 查找控制台错误
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('❌ 浏览器控制台错误:', msg.text());
      }
    });

    // 尝试点击主题切换器
    try {
      await themeSwitcher.click();
      console.log('✅ 成功点击主题切换器');
      await page.waitForTimeout(1000);

      // 查找主题选项
      const themeOptions = await page.$$('[role="option"], button[class*="theme"]');
      console.log(`🎨 找到 ${themeOptions.length} 个主题选项`);

      if (themeOptions.length > 0) {
        // 尝试使用更直接的方式点击主题选项
        try {
          // 使用JavaScript强制点击主题选项
          const themeClicked = await page.evaluate(() => {
            const buttons = document.querySelectorAll('button');
            for (let button of buttons) {
              const text = button.textContent;
              console.log('Found button:', text);
              if (text && (text.includes('马戏团') || text.includes('极光'))) {
                button.click();
                return true;
              }
            }
            return false;
          });

          if (themeClicked) {
            console.log('✅ 成功点击主题选项');
          } else {
            console.log('❌ 未找到目标主题选项');
          }
        } catch (error) {
          console.log('❌ 点击主题选项失败:', error.message);
        }

        await page.waitForTimeout(2000);

        // 再次检查CSS变量
        const newRootStyles = await page.evaluate(() => {
          const root = document.documentElement;
          const computedStyle = window.getComputedStyle(root);
          return {
            primary: computedStyle.getPropertyValue('--theme-primary'),
            secondary: computedStyle.getPropertyValue('--theme-secondary'),
            accent: computedStyle.getPropertyValue('--theme-accent'),
            background: computedStyle.getPropertyValue('--theme-background')
          };
        });

        console.log('🎨 切换主题后CSS变量状态:');
        Object.entries(newRootStyles).forEach(([key, value]) => {
          const changed = rootStyles[key.replace('-', '')] !== value;
          console.log(`  --${key}: ${value || '未设置'} ${changed ? '✅' : ''}`);
        });
      }
    } catch (error) {
      console.log('❌ 点击主题切换器失败:', error.message);
    }

    // 等待几秒钟观察页面
    await page.waitForTimeout(3000);

    console.log('\n📸 已保存workbench页面截图到 /tmp/workbench-theme-state.png');
    console.log('✅ Workbench页面检查完成');

  } catch (error) {
    console.error('❌ 检查过程中出错:', error.message);
  } finally {
    await browser.close();
  }
})();