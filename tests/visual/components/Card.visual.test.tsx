import { test, expect } from '@playwright/test';
import {
  setTheme,
  setViewport,
  waitForComponent,
  VISUALPORTS,
  THEMES
} from '../helpers/test-utils';

test.describe('Card组件视觉回归测试', () => {
  const BASE_URL = 'http://localhost:3100/tests/visual/fixtures';

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/component-pages.html`, { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
  });

  // 测试所有主题下的Card组件
  THEMES.forEach(theme => {
    test.describe(`主题: ${theme}`, () => {
      test.beforeEach(async ({ page }) => {
        await setTheme(page, theme);
      });

      test('Card基础渲染', async ({ page }) => {
        const cardSection = await waitForComponent(page, '[data-testid="card-section"]');

        await expect(cardSection).toBeVisible();

        // 检查所有card是否正确渲染
        const cards = page.locator('[data-testid^="card-"]');
        await expect(cards).toHaveCount(3);

        // 整体截图
        await expect(cardSection).toHaveScreenshot(
          `card-section-${theme}.png`,
          {
            animations: 'disabled',
            maxDiffPixels: 20,
            threshold: 0.2
          }
        );
      });

      test('Card变体视觉测试', async ({ page }) => {
        const variants = ['default', 'hover', 'selected'];

        for (const variant of variants) {
          const card = page.locator(`[data-testid="card-${variant}"]`);
          await expect(card).toBeVisible();

          await expect(card).toHaveScreenshot(
            `card-${variant}-${theme}.png`,
            {
              animations: 'disabled',
              clip: await card.boundingBox(),
              threshold: 0.15
            }
          );
        }
      });

      test('Card交互状态', async ({ page }) => {
        const hoverCard = page.locator('[data-testid="card-hover"]');
        await hoverCard.waitFor({ state: 'visible' });

        // Hover状态
        await hoverCard.hover();
        await page.waitForTimeout(500); // 等待过渡动画
        await expect(hoverCard).toHaveScreenshot(
          `card-hover-effect-${theme}.png`,
          {
            animations: 'disabled',
            clip: await hoverCard.boundingBox(),
            threshold: 0.25 // 允许更大的差异，因为包含阴影变化
          }
        );
      });

      test('Card内容布局测试', async ({ page }) => {
        const defaultCard = page.locator('[data-testid="card-default"]');
        await expect(defaultCard).toBeVisible();

        // 检查card内部结构
        const title = defaultCard.locator('h3'); // CardTitle
        const content = defaultCard.locator('p'); // CardContent

        await expect(title).toBeVisible();
        await expect(content).toBeVisible();

        // 整个card的截图
        await expect(defaultCard).toHaveScreenshot(
          `card-layout-${theme}.png`,
          {
            animations: 'disabled',
            clip: await defaultCard.boundingBox(),
            threshold: 0.1
          }
        );
      });

      test('Card选中状态', async ({ page }) => {
        const selectedCard = page.locator('[data-testid="card-selected"]');
        await expect(selectedCard).toBeVisible();

        await expect(selectedCard).toHaveScreenshot(
          `card-selected-${theme}.png`,
          {
            animations: 'disabled',
            clip: await selectedCard.boundingBox(),
            threshold: 0.15
          }
        );
      });
    });
  });

  // 响应式测试
  Object.entries(VISUALPORTS).forEach(([viewportName, viewport]) => {
    test(`Card响应式测试 - ${viewportName}`, async ({ page }) => {
      await setViewport(page, viewport);
      await setTheme(page, 'default');

      const cardSection = await waitForComponent(page, '[data-testid="card-section"]');

      await expect(cardSection).toHaveScreenshot(
        `card-responsive-${viewportName}.png`,
        {
          animations: 'disabled',
          fullPage: false,
          threshold: 0.2
        }
      );
    });
  });

  // Card网格布局测试
  test('Card网格布局', async ({ page }) => {
    await setTheme(page, 'default');

    const cardSection = page.locator('[data-testid="card-section"]');
    const cards = cardSection.locator('[data-testid^="card-"]');

    // 检查卡片是否在网格中正确排列
    await expect(cards).toHaveCount(3);

    // 获取所有卡片的位置信息
    const cardPositions = await cards.evaluateAll((elements) =>
      elements.map(el => ({
        x: el.getBoundingClientRect().x,
        y: el.getBoundingClientRect().y,
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height
      }))
    );

    // 验证卡片不在同一位置（即确实形成了网格布局）
    expect(cardPositions.length).toBeGreaterThan(1);
    expect(cardPositions[0].x).not.toEqual(cardPositions[1].x);

    // 整体布局截图
    await expect(cardSection).toHaveScreenshot(
      'card-grid-layout.png',
      {
        animations: 'disabled',
        fullPage: false,
        threshold: 0.1
      }
    );
  });

  // Card内容溢出测试
  test('Card长内容处理', async ({ page }) => {
    // 这里可以通过JavaScript动态设置长内容来测试
    await page.evaluate(() => {
      const card = document.querySelector('[data-testid="card-default"] p');
      if (card) {
        card.textContent = '这是一个很长的文本内容，用来测试Card组件如何处理长文本内容的显示和布局。当内容超出卡片容器时，应该有合适的处理方式，比如截断或者滚动。'.repeat(3);
      }
    });

    const card = page.locator('[data-testid="card-default"]');
    await expect(card).toHaveScreenshot(
      'card-long-content.png',
      {
        animations: 'disabled',
        clip: await card.boundingBox(),
        threshold: 0.2
      }
    );
  });

  // Card可访问性测试
  test('Card可访问性', async ({ page }) => {
    await setTheme(page, 'default');

    const selectedCard = page.locator('[data-testid="card-selected"]');
    await expect(selectedCard).toBeVisible();

    // 检查选中状态是否有合适的ARIA属性
    const hasAriaSelected = await selectedCard.evaluate(el =>
      el.hasAttribute('aria-selected') || el.hasAttribute('data-selected')
    );

    // 如果卡片是可选择的，应该有相应的ARIA属性
    if (hasAriaSelected) {
      const ariaValue = await selectedCard.evaluate(el =>
        el.getAttribute('aria-selected') || el.getAttribute('data-selected')
      );
      expect(ariaValue).toBeTruthy();
    }

    // 检查卡片内容的可读性
    const title = selectedCard.locator('h3');
    const content = selectedCard.locator('p');

    await expect(title).toBeVisible();
    await expect(content).toBeVisible();
  });
});