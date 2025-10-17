import { test, expect } from '@playwright/test';
import {
  setTheme,
  setViewport,
  waitForComponent,
  VISUALPORTS
} from '../helpers/test-utils';

test.describe('响应式设计视觉回归测试', () => {
  const BASE_URL = 'http://localhost:3100/tests/visual/fixtures';

  test.beforeEach(async ({ page }) => {
    await setTheme(page, 'default');
  });

  // 测试所有预定义视口
  Object.entries(VISUALPORTS).forEach(([viewportName, viewport]) => {
    test(`响应式布局测试 - ${viewportName}`, async ({ page }) => {
      await setViewport(page, viewport);

      // 导航到响应式测试页面
      await page.goto(`${BASE_URL}/responsive-test-page.html`, { waitUntil: 'networkidle' });
      await page.waitForLoadState('networkidle');

      // 等待所有组件加载完成
      await page.waitForSelector('[data-testid^="responsive-"]', { state: 'visible' });

      // 整体布局截图
      await expect(page).toHaveScreenshot(
        `responsive-layout-${viewportName}.png`,
        {
          animations: 'disabled',
          fullPage: true,
          threshold: 0.2,
          maxDiffPixels: 30
        }
      );

      // 验证视口尺寸
      const actualViewport = page.viewportSize();
      expect(actualViewport?.width).toBe(viewport.width);
      expect(actualViewport?.height).toBe(viewport.height);
    });
  });

  // 测试组件在不同屏幕尺寸下的行为
  test('组件响应式行为测试', async ({ page }) => {
    await page.goto(`${BASE_URL}/responsive-test-page.html`, { waitUntil: 'networkidle' });

    const components = ['button', 'input', 'card'];

    for (const component of components) {
      const viewports = ['mobile', 'tablet', 'desktop'];

      for (const viewportName of viewports) {
        const viewport = VISUALPORTS[viewportName as keyof typeof VISUALPORTS];
        await setViewport(page, viewport);
        await page.waitForTimeout(500);

        const componentElement = page.locator(`[data-testid^="${component}"]`).first();
        if (await componentElement.isVisible()) {
          await expect(componentElement).toHaveScreenshot(
            `${component}-responsive-${viewportName}.png`,
            {
              animations: 'disabled',
              clip: await componentElement.boundingBox(),
              threshold: 0.15
            }
          );
        }
      }
    }
  });

  // 测试网格布局的响应式
  test('网格布局响应式测试', async ({ page }) => {
    await page.goto(`${BASE_URL}/responsive-test-page.html`, { waitUntil: 'networkidle' });

    const testCases = [
      { name: 'mobile', viewport: VISUALPORTS.mobile, expectedColumns: 1 },
      { name: 'mobileLarge', viewport: VISUALPORTS.mobileLarge, expectedColumns: 1 },
      { name: 'tablet', viewport: VISUALPORTS.tablet, expectedColumns: 2 },
      { name: 'desktop', viewport: VISUALPORTS.desktop, expectedColumns: 3 },
      { name: 'desktopLarge', viewport: VISUALPORTS.desktopLarge, expectedColumns: 3 }
    ];

    for (const testCase of testCases) {
      await setViewport(page, testCase.viewport);
      await page.waitForTimeout(800);

      // 检查卡片网格布局
      const cards = page.locator('[data-testid^="responsive-card-"]');
      await expect(cards).toHaveCount(6);

      // 获取所有卡片的位置信息
      const cardPositions = await cards.evaluateAll((elements) =>
        elements.map(el => ({
          x: el.getBoundingClientRect().x,
          y: el.getBoundingClientRect().y,
          width: el.getBoundingClientRect().width
        }))
      );

      // 分析列数
      const uniqueYPositions = [...new Set(cardPositions.map(pos => Math.round(pos.y)))];
      const actualColumns = cardPositions.filter(pos => Math.round(pos.y) === uniqueYPositions[0]).length;

      // 验证列数是否符合预期
      expect(actualColumns).toBeGreaterThanOrEqual(testCase.expectedColumns);

      // 截图验证
      await expect(page.locator('.grid')).toHaveScreenshot(
        `grid-layout-${testCase.name}.png`,
        {
          animations: 'disabled',
          fullPage: false,
          threshold: 0.2
        }
      );
    }
  });

  // 测试文本响应式
  test('文本响应式测试', async ({ page }) => {
    await page.goto(`${BASE_URL}/responsive-test-page.html`, { waitUntil: 'networkidle' });

    const responsiveText = page.locator('h1');
    await expect(responsiveText).toBeVisible();

    const testSizes = ['mobile', 'tablet', 'desktop'];

    for (const sizeName of testSizes) {
      const viewport = VISUALPORTS[sizeName as keyof typeof VISUALPORTS];
      await setViewport(page, viewport);
      await page.waitForTimeout(500);

      // 获取文本大小
      const fontSize = await responsiveText.evaluate(el =>
        getComputedStyle(el).fontSize
      );

      // 验证文本大小随视口变化
      console.log(`${sizeName} 标题字体大小: ${fontSize}`);

      await expect(responsiveText).toHaveScreenshot(
        `text-responsive-${sizeName}.png`,
        {
          animations: 'disabled',
          clip: await responsiveText.boundingBox(),
          threshold: 0.1
        }
      );
    }
  });

  // 测试触摸交互区域
  test('触摸交互区域测试', async ({ page }) => {
    const mobileViewport = VISUALPORTS.mobile;
    await setViewport(page, mobileViewport);

    await page.goto(`${BASE_URL}/component-pages.html`, { waitUntil: 'networkidle' });

    // 测试移动端的触摸目标大小
    const buttons = page.locator('button');
    const touchTargets = [];

    for (let i = 0; i < Math.min(3, await buttons.count()); i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      if (box) {
        // WCAG指南建议触摸目标至少44x44像素
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
        touchTargets.push(box);
      }
    }

    // 截图验证触摸目标
    await expect(page.locator('[data-testid="button-section"]')).toHaveScreenshot(
      'touch-targets-mobile.png',
      {
        animations: 'disabled',
        fullPage: false,
        threshold: 0.15
      }
    );
  });

  // 测试断点切换
  test('断点切换测试', async ({ page }) => {
    await page.goto(`${BASE_URL}/responsive-test-page.html`, { waitUntil: 'networkidle' });

    // 测试关键断点附近的布局变化
    const breakpoints = [
      { name: 'mobile-tablet', width: 767, from: 'mobile', to: 'tablet' },
      { name: 'tablet-desktop', width: 1023, from: 'tablet', to: 'desktop' }
    ];

    for (const breakpoint of breakpoints) {
      // 测试断点前
      await setViewport(page, { width: breakpoint.width - 1, height: 800 });
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot(
        `breakpoint-${breakpoint.name}-before.png`,
        {
          animations: 'disabled',
          fullPage: true,
          threshold: 0.2
        }
      );

      // 测试断点后
      await setViewport(page, { width: breakpoint.width + 1, height: 800 });
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot(
        `breakpoint-${breakpoint.name}-after.png`,
        {
          animations: 'disabled',
          fullPage: true,
          threshold: 0.2
        }
      );
    }
  });

  // 测试横向滚动
  test('横向滚动测试', async ({ page }) => {
    // 使用很窄的视口测试横向滚动
    await setViewport(page, { width: 320, height: 800 });

    await page.goto(`${BASE_URL}/responsive-test-page.html`, { waitUntil: 'networkidle' });

    // 检查页面是否需要横向滚动
    const needsHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > document.body.clientWidth;
    });

    if (needsHorizontalScroll) {
      console.log('⚠️ 检测到横向滚动，这在移动端是不期望的');
    } else {
      console.log('✅ 没有横向滚动，布局适配良好');
    }

    // 截图验证
    await expect(page).toHaveScreenshot(
      'no-horizontal-scroll-mobile.png',
      {
        animations: 'disabled',
        fullPage: true,
        threshold: 0.15
      }
    );

    // 在理想情况下，不应该有横向滚动
    expect(needsHorizontalScroll).toBeFalsy();
  });

  // 测试响应式图片
  test('响应式图片测试', async ({ page }) => {
    await page.goto(`${BASE_URL}/component-pages.html`, { waitUntil: 'networkidle' });

    const viewports = ['mobile', 'tablet', 'desktop'];

    for (const viewportName of viewports) {
      const viewport = VISUALPORTS[viewportName as keyof typeof VISUALPORTS];
      await setViewport(page, viewport);
      await page.waitForTimeout(800);

      // 查找页面中的图片
      const images = page.locator('img');
      if (await images.count() > 0) {
        const firstImage = images.first();

        // 获取图片的实际显示尺寸
        const displaySize = await firstImage.evaluate(img => ({
          width: img.clientWidth,
          height: img.clientHeight
        }));

        // 验证图片尺寸适合当前视口
        expect(displaySize.width).toBeLessThanOrEqual(viewport.width + 50); // 允许一些边距

        await expect(firstImage).toHaveScreenshot(
          `responsive-image-${viewportName}.png`,
          {
            animations: 'disabled',
            clip: await firstImage.boundingBox(),
            threshold: 0.2
          }
        );
      }
    }
  });

  // 测试响应式导航
  test('响应式导航测试', async ({ page }) => {
    await page.goto(`${BASE_URL}/component-pages.html`, { waitUntil: 'networkidle' });

    const testCases = [
      { name: 'mobile', viewport: VISUALPORTS.mobile, expectHamburger: true },
      { name: 'desktop', viewport: VISUALPORTS.desktop, expectHamburger: false }
    ];

    for (const testCase of testCases) {
      await setViewport(page, testCase.viewport);
      await page.waitForTimeout(800);

      // 截图导航区域
      await expect(page.locator('header, nav')).toHaveScreenshot(
        `navigation-${testCase.name}.png`,
        {
          animations: 'disabled',
          fullPage: false,
          threshold: 0.15
        }
      );

      // 在移动端检查是否有汉堡菜单
      if (testCase.expectHamburger) {
        const hamburgerMenu = page.locator('[data-testid="mobile-menu-toggle"], .hamburger, button[aria-label="menu"]');
        const hasHamburger = await hamburgerMenu.count() > 0;
        if (hasHamburger) {
          console.log(`✅ ${testCase.name} 端检测到汉堡菜单`);
        }
      }
    }
  });
});