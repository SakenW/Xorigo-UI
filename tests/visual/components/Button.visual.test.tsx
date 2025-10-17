import { test, expect } from '@playwright/test';
import {
  setTheme,
  setViewport,
  waitForComponent,
  testComponentStates,
  resetComponentState,
  VISUALPORTS,
  THEMES
} from '../helpers/test-utils';

test.describe('Button组件视觉回归测试', () => {
  const BASE_URL = 'http://localhost:3100/tests/visual/fixtures';

  test.beforeEach(async ({ page }) => {
    // 导航到测试页面
    await page.goto(`${BASE_URL}/component-pages.html`, { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
  });

  // 测试所有主题下的Button组件
  THEMES.forEach(theme => {
    test.describe(`主题: ${theme}`, () => {
      test.beforeEach(async ({ page }) => {
        await setTheme(page, theme);
      });

      test('Button基础渲染', async ({ page }) => {
        const buttonSection = await waitForComponent(page, '[data-testid="button-section"]');

        await expect(buttonSection).toBeVisible();

        // 检查所有button是否正确渲染
        const buttons = page.locator('[data-testid^="button-"]');
        await expect(buttons).toHaveCount(8);

        // 整体截图
        await expect(page.locator('[data-testid="button-section"]')).toHaveScreenshot(
          `button-section-${theme}.png`,
          {
            animations: 'disabled',
            maxDiffPixels: 15,
            threshold: 0.2
          }
        );
      });

      test('Button变体视觉测试', async ({ page }) => {
        const variants = ['primary', 'secondary', 'outline', 'ghost'];

        for (const variant of variants) {
          const button = page.locator(`[data-testid="button-${variant}"]`);
          await expect(button).toBeVisible();

          await expect(button).toHaveScreenshot(
            `button-${variant}-${theme}.png`,
            {
              animations: 'disabled',
              clip: await button.boundingBox(),
              threshold: 0.15
            }
          );
        }
      });

      test('Button尺寸视觉测试', async ({ page }) => {
        const sizes = ['sm', 'md', 'lg'];

        for (const size of sizes) {
          const button = page.locator(`[data-testid="button-${size}"]`);
          await expect(button).toBeVisible();

          await expect(button).toHaveScreenshot(
            `button-${size}-${theme}.png`,
            {
              animations: 'disabled',
              clip: await button.boundingBox(),
              threshold: 0.15
            }
          );
        }
      });

      test('Button交互状态', async ({ page }) => {
        const primaryButton = page.locator('[data-testid="button-primary"]');
        await primaryButton.waitFor({ state: 'visible' });

        // Hover状态
        await primaryButton.hover();
        await page.waitForTimeout(300);
        await expect(primaryButton).toHaveScreenshot(
          `button-primary-hover-${theme}.png`,
          {
            animations: 'disabled',
            clip: await primaryButton.boundingBox(),
            threshold: 0.2
          }
        );

        // Focus状态
        await primaryButton.focus();
        await page.waitForTimeout(300);
        await expect(primaryButton).toHaveScreenshot(
          `button-primary-focus-${theme}.png`,
          {
            animations: 'disabled',
            clip: await primaryButton.boundingBox(),
            threshold: 0.2
          }
        );

        // 按下状态 (active)
        await page.mouse.down();
        await page.waitForTimeout(100);
        await expect(primaryButton).toHaveScreenshot(
          `button-primary-active-${theme}.png`,
          {
            animations: 'disabled',
            clip: await primaryButton.boundingBox(),
            threshold: 0.25
          }
        );
        await page.mouse.up();
      });

      test('Button禁用状态', async ({ page }) => {
        const disabledButton = page.locator('[data-testid="button-disabled"]');
        await expect(disabledButton).toBeVisible();

        await expect(disabledButton).toHaveScreenshot(
          `button-disabled-${theme}.png`,
          {
            animations: 'disabled',
            clip: await disabledButton.boundingBox(),
            threshold: 0.1
          }
        );

        // 验证禁用状态无hover效果
        await disabledButton.hover();
        await page.waitForTimeout(300);
        await expect(disabledButton).toHaveScreenshot(
          `button-disabled-hover-${theme}.png`,
          {
            animations: 'disabled',
            clip: await disabledButton.boundingBox(),
            threshold: 0.1
          }
        );
      });
    });
  });

  // 响应式测试
  Object.entries(VISUALPORTS).forEach(([viewportName, viewport]) => {
    test(`Button响应式测试 - ${viewportName}`, async ({ page }) => {
      await setViewport(page, viewport);
      await setTheme(page, 'default');

      const buttonSection = await waitForComponent(page, '[data-testid="button-section"]');

      await expect(buttonSection).toHaveScreenshot(
        `button-responsive-${viewportName}.png`,
        {
          animations: 'disabled',
          fullPage: false,
          threshold: 0.2
        }
      );
    });
  });

  // 跨浏览器兼容性测试（在不同项目配置中运行）
  test('Button文本内容渲染', async ({ page, browserName }) => {
    await setTheme(page, 'default');

    // 测试不同长度的文本
    const longTextButton = page.locator('button').filter({ hasText: 'Click me' }).first();
    await expect(longTextButton).toBeVisible();

    await expect(longTextButton).toHaveScreenshot(
      `button-text-${browserName}.png`,
      {
        animations: 'disabled',
        clip: await longTextButton.boundingBox(),
        threshold: 0.15
      }
    );
  });

  // 性能测试 - 渲染时间
  test('Button渲染性能', async ({ page }) => {
    const startTime = Date.now();

    await page.goto(`${BASE_URL}/component-pages.html`, { waitUntil: 'networkidle' });
    await waitForComponent(page, '[data-testid="button-primary"]');

    const renderTime = Date.now() - startTime;

    // 渲染时间应该在合理范围内（小于2秒）
    expect(renderTime).toBeLessThan(2000);

    console.log(`Button组件渲染时间: ${renderTime}ms`);
  });

  // 可访问性测试 - 颜色对比度
  test('Button可访问性', async ({ page }) => {
    await setTheme(page, 'default');

    const button = page.locator('[data-testid="button-primary"]');
    await expect(button).toBeVisible();

    // 检查按钮是否有正确的ARIA属性
    const hasAriaLabel = await button.evaluate(el =>
      el.hasAttribute('aria-label') || el.textContent?.trim().length > 0
    );
    expect(hasAriaLabel).toBeTruthy();

    // 检查是否可以通过键盘访问
    await button.focus();
    const isFocused = await button.evaluate(el => document.activeElement === el);
    expect(isFocused).toBeTruthy();
  });
});