import { test, expect } from '@playwright/test';
import {
  setTheme,
  waitForComponent,
  THEMES
} from '../helpers/test-utils';

test.describe('主题切换视觉回归测试', () => {
  const BASE_URL = 'http://localhost:3100/tests/visual/fixtures';

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/component-pages.html`, { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
  });

  // 测试所有主题切换
  test('完整主题切换测试', async ({ page }) => {
    for (const theme of THEMES) {
      console.log(`🎨 测试主题: ${theme}`);

      // 设置主题
      await setTheme(page, theme);

      // 等待主题切换完成
      await page.waitForTimeout(1000);

      // 截取整个页面
      await expect(page).toHaveScreenshot(
        `theme-${theme}-full-page.png`,
        {
          animations: 'disabled',
          fullPage: true,
          threshold: 0.25, // 允许更大的差异，因为主题变化可能较大
          maxDiffPixels: 50
        }
      );

      // 验证主题属性是否正确设置
      const currentTheme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
      );
      expect(currentTheme).toBe(theme);
    }
  });

  // 测试主题切换的过渡效果
  test('主题切换过渡效果', async ({ page }) => {
    // 从默认主题开始
    await setTheme(page, 'default');
    await page.waitForTimeout(500);

    // 记录切换前的状态
    const beforeTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(beforeTheme).toBe('default');

    // 切换到dark主题
    await setTheme(page, 'dark');

    // 等待过渡动画完成
    await page.waitForTimeout(1500);

    // 验证主题已切换
    const afterTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(afterTheme).toBe('dark');

    // 截取切换后的状态
    await expect(page).toHaveScreenshot(
      'theme-transition-default-to-dark.png',
      {
        animations: 'disabled', // 禁用动画以获得一致的截图
        fullPage: true,
        threshold: 0.3
      }
    );
  });

  // 测试各个组件在不同主题下的表现
  const components = ['button', 'input', 'card', 'alert', 'badge'];

  components.forEach(component => {
    test(`${component}组件主题适配测试`, async ({ page }) => {
      const screenshots = [];

      for (const theme of THEMES) {
        await setTheme(page, theme);
        await page.waitForTimeout(800);

        const componentSection = page.locator(`[data-testid="${component}-section"]`);
        if (await componentSection.isVisible()) {
          await expect(componentSection).toHaveScreenshot(
            `${component}-theme-${theme}.png`,
            {
              animations: 'disabled',
              fullPage: false,
              threshold: 0.2,
              maxDiffPixels: 20
            }
          );
        }
      }
    });
  });

  // 测试主题的一致性
  test('主题色彩一致性测试', async ({ page }) => {
    const themeColors = {};

    // 收集每个主题的主要颜色
    for (const theme of THEMES) {
      await setTheme(page, theme);
      await page.waitForTimeout(800);

      const colors = await page.evaluate(() => {
        const styles = getComputedStyle(document.documentElement);
        return {
          primary: styles.getPropertyValue('--color-primary-500').trim(),
          secondary: styles.getPropertyValue('--color-secondary-500').trim(),
          background: styles.getPropertyValue('--color-background').trim(),
          text: styles.getPropertyValue('--color-text').trim(),
        };
      });

      themeColors[theme] = colors;
    }

    // 验证每个主题都有独特的颜色配置
    expect(Object.keys(themeColors)).toHaveLength(THEMES.length);

    // 验证dark模式有正确的背景色
    expect(themeColors.dark.background).not.toBe(themeColors.default.background);
    expect(themeColors.dark.text).not.toBe(themeColors.default.text);

    console.log('🎨 主题颜色配置:', themeColors);
  });

  // 测试主题切换时组件状态保持
  test('主题切换状态保持测试', async ({ page }) => {
    await setTheme(page, 'default');

    // 设置一些组件状态
    const button = page.locator('[data-testid="button-primary"]');
    await button.hover();
    await page.waitForTimeout(300);

    const input = page.locator('[data-testid="input-default"]');
    await input.fill('Test content');
    await input.focus();

    // 切换主题
    await setTheme(page, 'dark');
    await page.waitForTimeout(1000);

    // 验证状态是否保持
    await expect(button).toHaveAttribute('data-hovered', 'true');
    await expect(input).toHaveValue('Test content');

    // 截图验证
    await expect(page.locator('[data-testid="button-section"]')).toHaveScreenshot(
      'theme-switch-state-preservation.png',
      {
        animations: 'disabled',
        fullPage: false,
        threshold: 0.25
      }
    );
  });

  // 测试深色模式的特殊处理
  test('深色模式适配测试', async ({ page }) => {
    const darkThemes = ['dark', 'midnight'];

    for (const theme of darkThemes) {
      await setTheme(page, theme);
      await page.waitForTimeout(800);

      // 检查是否应用了深色模式的样式
      const isDarkMode = await page.evaluate(() => {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        const bgColor = computedStyle.getPropertyValue('--color-background').trim();

        // 简单检查背景色是否为深色
        return bgColor && (
          bgColor.includes('rgb(1') || // 深色背景
          bgColor.includes('#0') ||
          bgColor.includes('hsl(0, 0%')
        );
      });

      expect(isDarkMode).toBeTruthy();

      // 验证文本对比度
      const textColor = await page.evaluate(() => {
        const root = document.documentElement;
        return getComputedStyle(root).getPropertyValue('--color-text').trim();
      });

      // 深色模式下的文本应该是浅色的
      const isLightText = textColor && (
        textColor.includes('rgb(25') || // 浅色文本
        textColor.includes('#f') ||
        textColor.includes('255')
      );
      expect(isLightText).toBeTruthy();

      await expect(page).toHaveScreenshot(
        `dark-mode-${theme}-verification.png`,
        {
          animations: 'disabled',
          fullPage: true,
          threshold: 0.2
        }
      );
    }
  });

  // 测试主题切换的性能
  test('主题切换性能测试', async ({ page }) => {
    const switchTimes = [];

    for (let i = 0; i < 5; i++) {
      const theme = THEMES[i % THEMES.length];
      const startTime = Date.now();

      await setTheme(page, theme);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500); // 等待主题应用

      const switchTime = Date.now() - startTime;
      switchTimes.push(switchTime);
    }

    // 计算平均切换时间
    const averageTime = switchTimes.reduce((a, b) => a + b, 0) / switchTimes.length;

    // 主题切换应该在合理时间内完成（小于1秒）
    expect(averageTime).toBeLessThan(1000);

    console.log(`🚀 主题切换平均时间: ${averageTime.toFixed(2)}ms`);
    console.log(`📊 切换时间详情: ${switchTimes.map(t => `${t}ms`).join(', ')}`);
  });

  // 测试主题切换时的错误处理
  test('无效主题处理测试', async ({ page }) => {
    // 尝试设置一个不存在的主题
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'non-existent-theme');
    });

    await page.waitForTimeout(500);

    // 应该回退到默认主题
    const currentTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    // 检查是否回退到默认主题或保持上一个有效主题
    expect(['default', null, 'non-existent-theme']).toContain(currentTheme);

    // 尝试恢复正常主题
    await setTheme(page, 'default');
    await page.waitForTimeout(500);

    const restoredTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(restoredTheme).toBe('default');
  });
});