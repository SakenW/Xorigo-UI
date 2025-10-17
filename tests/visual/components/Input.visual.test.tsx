import { test, expect } from '@playwright/test';
import {
  setTheme,
  setViewport,
  waitForComponent,
  simulateInteraction,
  VISUALPORTS,
  THEMES
} from '../helpers/test-utils';

test.describe('Input组件视觉回归测试', () => {
  const BASE_URL = 'http://localhost:3100/tests/visual/fixtures';

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/component-pages.html`, { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
  });

  // 测试所有主题下的Input组件
  THEMES.forEach(theme => {
    test.describe(`主题: ${theme}`, () => {
      test.beforeEach(async ({ page }) => {
        await setTheme(page, theme);
      });

      test('Input基础渲染', async ({ page }) => {
        const inputSection = await waitForComponent(page, '[data-testid="input-section"]');

        await expect(inputSection).toBeVisible();

        // 检查所有input是否正确渲染
        const inputs = page.locator('[data-testid^="input-"]');
        await expect(inputs).toHaveCount(4);

        // 整体截图
        await expect(inputSection).toHaveScreenshot(
          `input-section-${theme}.png`,
          {
            animations: 'disabled',
            maxDiffPixels: 15,
            threshold: 0.2
          }
        );
      });

      test('Input变体视觉测试', async ({ page }) => {
        const variants = ['default', 'value', 'disabled', 'error'];

        for (const variant of variants) {
          const input = page.locator(`[data-testid="input-${variant}"]`);
          await expect(input).toBeVisible();

          await expect(input).toHaveScreenshot(
            `input-${variant}-${theme}.png`,
            {
              animations: 'disabled',
              clip: await input.boundingBox(),
              threshold: 0.15
            }
          );
        }
      });

      test('Input交互状态', async ({ page }) => {
        const defaultInput = page.locator('[data-testid="input-default"]');
        await defaultInput.waitFor({ state: 'visible' });

        // Focus状态
        await defaultInput.focus();
        await page.waitForTimeout(300);
        await expect(defaultInput).toHaveScreenshot(
          `input-focus-${theme}.png`,
          {
            animations: 'disabled',
            clip: await defaultInput.boundingBox(),
            threshold: 0.2
          }
        );

        // 输入状态
        await defaultInput.fill('Test input content');
        await page.waitForTimeout(300);
        await expect(defaultInput).toHaveScreenshot(
          `input-with-value-${theme}.png`,
          {
            animations: 'disabled',
            clip: await defaultInput.boundingBox(),
            threshold: 0.15
          }
        );
      });

      test('Input禁用状态', async ({ page }) => {
        const disabledInput = page.locator('[data-testid="input-disabled"]');
        await expect(disabledInput).toBeVisible();

        await expect(disabledInput).toHaveScreenshot(
          `input-disabled-${theme}.png`,
          {
            animations: 'disabled',
            clip: await disabledInput.boundingBox(),
            threshold: 0.1
          }
        );

        // 验证禁用状态无法获得焦点
        const isDisabled = await disabledInput.evaluate(el =>
          el.hasAttribute('disabled') || (el as HTMLInputElement).disabled
        );
        expect(isDisabled).toBeTruthy();

        // 尝试focus应该失败
        await disabledInput.focus();
        const isFocused = await disabledInput.evaluate(el => document.activeElement === el);
        expect(isFocused).toBeFalsy();
      });

      test('Input错误状态', async ({ page }) => {
        const errorInput = page.locator('[data-testid="input-error"]');
        await expect(errorInput).toBeVisible();

        await expect(errorInput).toHaveScreenshot(
          `input-error-${theme}.png`,
          {
            animations: 'disabled',
            clip: await errorInput.boundingBox(),
            threshold: 0.2
          }
        );

        // 验证错误状态的视觉指示
        const hasErrorClass = await errorInput.evaluate(el =>
          el.classList.contains('error') || el.classList.contains('border-red-500')
        );
        expect(hasErrorClass).toBeTruthy();
      });
    });
  });

  // 响应式测试
  Object.entries(VISUALPORTS).forEach(([viewportName, viewport]) => {
    test(`Input响应式测试 - ${viewportName}`, async ({ page }) => {
      await setViewport(page, viewport);
      await setTheme(page, 'default');

      const inputSection = await waitForComponent(page, '[data-testid="input-section"]');

      await expect(inputSection).toHaveScreenshot(
        `input-responsive-${viewportName}.png`,
        {
          animations: 'disabled',
          fullPage: false,
          threshold: 0.2
        }
      );
    });
  });

  // Input交互测试
  test('Input用户交互', async ({ page }) => {
    await setTheme(page, 'default');

    const input = page.locator('[data-testid="input-default"]');
    await input.waitFor({ state: 'visible' });

    // 测试hover状态
    await input.hover();
    await page.waitForTimeout(300);
    await expect(input).toHaveScreenshot(
      'input-hover.png',
      {
        animations: 'disabled',
        clip: await input.boundingBox(),
        threshold: 0.2
      }
    );

    // 测试输入长文本
    const longText = 'This is a very long input text to test how the input field handles overflow and scrolling behavior.';
    await input.fill(longText);
    await page.waitForTimeout(300);
    await expect(input).toHaveScreenshot(
      'input-long-text.png',
      {
        animations: 'disabled',
        clip: await input.boundingBox(),
        threshold: 0.15
      }
    );

    // 测试清空输入
    await input.fill('');
    await page.waitForTimeout(300);
    await expect(input).toHaveScreenshot(
      'input-empty.png',
      {
        animations: 'disabled',
        clip: await input.boundingBox(),
        threshold: 0.1
      }
    );
  });

  // Input表单验证测试
  test('Input表单验证状态', async ({ page }) => {
    await setTheme(page, 'default');

    // 通过JavaScript设置验证状态
    await page.evaluate(() => {
      const input = document.querySelector('[data-testid="input-default"]') as HTMLInputElement;
      if (input) {
        input.setCustomValidity('Please enter a valid value');
        input.reportValidity();
      }
    });

    const input = page.locator('[data-testid="input-default"]');
    await expect(input).toHaveScreenshot(
      'input-validation-error.png',
      {
        animations: 'disabled',
        clip: await input.boundingBox(),
        threshold: 0.2
      }
    );
  });

  // Input可访问性测试
  test('Input可访问性', async ({ page }) => {
    await setTheme(page, 'default');

    const input = page.locator('[data-testid="input-default"]');
    await expect(input).toBeVisible();

    // 检查是否有合适的label或placeholder
    const hasLabel = await input.evaluate(el => {
      const id = el.getAttribute('id');
      if (id) {
        return document.querySelector(`label[for="${id}"]`) !== null;
      }
      return el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby') || el.hasAttribute('placeholder');
    });
    expect(hasLabel).toBeTruthy();

    // 检查键盘访问性
    await input.focus();
    const isFocused = await input.evaluate(el => document.activeElement === el);
    expect(isFocused).toBeTruthy();

    // 测试Tab键导航
    await page.keyboard.press('Tab');
    const nextElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(nextElement).toBe('INPUT'); // 应该移动到下一个input
  });

  // Input类型测试
  test('不同类型的Input', async ({ page }) => {
    await setTheme(page, 'default');

    // 动态创建不同类型的input进行测试
    await page.evaluate(() => {
      const container = document.querySelector('[data-testid="input-section"]');
      if (container) {
        const types = ['email', 'password', 'tel', 'url', 'search'];
        types.forEach(type => {
          const input = document.createElement('input');
          input.type = type;
          input.placeholder = `${type} input`;
          input.setAttribute('data-testid', `input-${type}`);
          input.className = 'border rounded px-3 py-2 mr-2 mb-2';
          container.appendChild(input);
        });
      }
    });

    const types = ['email', 'password', 'tel', 'url', 'search'];
    for (const type of types) {
      const input = page.locator(`[data-testid="input-${type}"]`);
      await expect(input).toBeVisible();

      await expect(input).toHaveScreenshot(
        `input-type-${type}.png`,
        {
          animations: 'disabled',
          clip: await input.boundingBox(),
          threshold: 0.15
        }
      );
    }
  });
});