import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('🔍 检查页面主题切换器...');

    // 访问workbench页面
    await page.goto('http://localhost:3100/workbench');

    // 等待页面加载
    await page.waitForLoadState('networkidle');
    console.log('✅ 页面加载完成');

    // 查找主题切换器按钮（使用更通用的选择器）
    const themeButtons = await page.$$('button');
    console.log('🔘 页面中找到的按钮数量:', themeButtons.length);

    // 检查每个按钮的文本内容
    for (let i = 0; i < themeButtons.length; i++) {
      const text = await themeButtons[i].textContent();
      console.log(`按钮 ${i + 1}: "${text}"`);

      // 如果是主题切换按钮，点击它
      if (text && (text.includes('主题') || text.includes('Theme'))) {
        console.log('🎨 找到主题切换按钮，点击它...');
        await themeButtons[i].click();

        // 等待一下，看看是否有下拉菜单出现
        await page.waitForTimeout(2000);

        // 查找主题选项
        const themeOptions = await page.$$('button, [role="option"], .theme-option');
        console.log('🎨 主题选项数量:', themeOptions.length);

        // 显示前几个主题选项的文本
        for (let j = 0; j < Math.min(5, themeOptions.length); j++) {
          const optionText = await themeOptions[j].textContent();
          console.log(`  主题选项 ${j + 1}: "${optionText}"`);
        }

        break;
      }
    }

    // 检查页面中是否有任何主题相关的元素
    const themeElements = await page.$$('[class*="theme"], [data-theme], [id*="theme"]');
    console.log('🎨 主题相关元素数量:', themeElements.length);

    // 检查控制台是否有错误
    const logs = [];
    page.on('console', msg => {
      logs.push({ type: msg.type(), text: msg.text() });
    });

    await page.waitForTimeout(3000);

    console.log('📋 控制台日志:');
    logs.forEach(log => {
      if (log.type === 'error' || log.type === 'warning') {
        console.log(`  ${log.type.toUpperCase()}: ${log.text}`);
      }
    });

    console.log('✅ 检查完成');

  } catch (error) {
    console.error('❌ 检查过程中出错:', error.message);
  } finally {
    await browser.close();
  }
})();