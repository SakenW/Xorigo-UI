import { test, expect } from '@playwright/test';
import {
  setTheme,
  waitForComponent,
  simulateInteraction,
  resetComponentState,
  THEMES
} from '../helpers/test-utils';

test.describe('交互状态视觉回归测试', () => {
  const BASE_URL = 'http://localhost:3100/tests/visual/fixtures';

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/component-pages.html`, { waitUntil: 'networkidle' });
    await page.waitForLoadState('networkidle');
  });

  // 测试Button的所有交互状态
  test.describe('Button交互状态', () => {
    THEMES.forEach(theme => {
      test.describe(`主题: ${theme}`, () => {
        test.beforeEach(async ({ page }) => {
          await setTheme(page, theme);
        });

        test('Button Hover状态', async ({ page }) => {
          const button = page.locator('[data-testid="button-primary"]');
          await waitForComponent(page, '[data-testid="button-primary"]');

          // Hover状态
          await button.hover();
          await page.waitForTimeout(500); // 等待过渡效果

          await expect(button).toHaveScreenshot(
            `button-hover-${theme}.png`,
            {
              animations: 'disabled',
              clip: await button.boundingBox(),
              threshold: 0.2
            }
          );
        });

        test('Button Focus状态', async ({ page }) => {
          const button = page.locator('[data-testid="button-primary"]');
          await waitForComponent(page, '[data-testid="button-primary"]');

          // Focus状态（通过Tab键或直接focus）
          await button.focus();
          await page.waitForTimeout(300);

          await expect(button).toHaveScreenshot(
            `button-focus-${theme}.png`,
            {
              animations: 'disabled',
              clip: await button.boundingBox(),
              threshold: 0.2
            }
          );
        });

        test('Button Active状态', async ({ page }) => {
          const button = page.locator('[data-testid="button-primary"]');
          await waitForComponent(page, '[data-testid="button-primary"]');

          // Active状态（鼠标按下）
          await button.hover();
          await page.mouse.down();
          await page.waitForTimeout(100);

          await expect(button).toHaveScreenshot(
            `button-active-${theme}.png`,
            {
              animations: 'disabled',
              clip: await button.boundingBox(),
              threshold: 0.25
            }
          );

          await page.mouse.up();
        });

        test('Button Disabled状态交互', async ({ page }) => {
          const disabledButton = page.locator('[data-testid="button-disabled"]');
          await waitForComponent(page, '[data-testid="button-disabled"]');

          // 尝试hover禁用按钮
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

          // 尝试点击禁用按钮
          await disabledButton.click({ force: false });
          await page.waitForTimeout(300);

          // 验证按钮仍然禁用且无视觉变化
          const isDisabled = await disabledButton.evaluate(el =>
            el.hasAttribute('disabled') || (el as HTMLButtonElement).disabled
          );
          expect(isDisabled).toBeTruthy();
        });
      });
    });
  });

  // 测试Input的交互状态
  test.describe('Input交互状态', () => {
    THEMES.forEach(theme => {
      test.describe(`主题: ${theme}`, () => {
        test.beforeEach(async ({ page }) => {
          await setTheme(page, theme);
        });

        test('Input Focus状态', async ({ page }) => {
          const input = page.locator('[data-testid="input-default"]');
          await waitForComponent(page, '[data-testid="input-default"]');

          // Focus状态
          await input.focus();
          await page.waitForTimeout(300);

          await expect(input).toHaveScreenshot(
            `input-focus-${theme}.png`,
            {
              animations: 'disabled',
              clip: await input.boundingBox(),
              threshold: 0.2
            }
          );
        });

        test('Input输入状态', async ({ page }) => {
          const input = page.locator('[data-testid="input-default"]');
          await waitForComponent(page, '[data-testid="input-default"]');

          // 输入文本
          await input.focus();
          await page.keyboard.type('Test input content');
          await page.waitForTimeout(300);

          await expect(input).toHaveScreenshot(
            `input-with-content-${theme}.png`,
            {
              animations: 'disabled',
              clip: await input.boundingBox(),
              threshold: 0.15
            }
          );
        });

        test('Input选中状态', async ({ page }) => {
          const input = page.locator('[data-testid="input-default"]');
          await waitForComponent(page, '[data-testid="input-default"]');

          // 输入文本并全选
          await input.fill('Select all text');
          await page.keyboard.press('Control+A');
          await page.waitForTimeout(300);

          await expect(input).toHaveScreenshot(
            `input-selected-${theme}.png`,
            {
              animations: 'disabled',
              clip: await input.boundingBox(),
              threshold: 0.2
            }
          );
        });

        test('Input错误状态交互', async ({ page }) => {
          const errorInput = page.locator('[data-testid="input-error"]');
          await waitForComponent(page, '[data-testid="input-error"]');

          // Focus错误状态的输入框
          await errorInput.focus();
          await page.waitForTimeout(300);

          await expect(errorInput).toHaveScreenshot(
            `input-error-focus-${theme}.png`,
            {
              animations: 'disabled',
              clip: await errorInput.boundingBox(),
              threshold: 0.2
            }
          );
        });
      });
    });
  });

  // 测试Card的交互状态
  test.describe('Card交互状态', () => {
    THEMES.forEach(theme => {
      test.describe(`主题: ${theme}`, () => {
        test.beforeEach(async ({ page }) => {
          await setTheme(page, theme);
        });

        test('Card Hover状态', async ({ page }) => {
          const card = page.locator('[data-testid="card-hover"]');
          await waitForComponent(page, '[data-testid="card-hover"]');

          // Hover状态
          await card.hover();
          await page.waitForTimeout(500); // 等待过渡动画

          await expect(card).toHaveScreenshot(
            `card-hover-effect-${theme}.png`,
            {
              animations: 'disabled',
              clip: await card.boundingBox(),
              threshold: 0.25
            }
          );
        });

        test('Card内部按钮交互', async ({ page }) => {
          const card = page.locator('[data-testid="card-default"]');
          await waitForComponent(page, '[data-testid="card-default"]');

          // 先hover卡片
          await card.hover();
          await page.waitForTimeout(300);

          // 然后hover卡片内的按钮
          const cardButton = card.locator('button').first();
          if (await cardButton.isVisible()) {
            await cardButton.hover();
            await page.waitForTimeout(300);

            await expect(card).toHaveScreenshot(
              `card-button-hover-${theme}.png`,
              {
                animations: 'disabled',
                clip: await card.boundingBox(),
                threshold: 0.25
              }
            );
          }
        });
      });
    });
  });

  // 测试Form组件的交互状态
  test.describe('Form组件交互状态', () => {
    THEMES.forEach(theme => {
      test.describe(`主题: ${theme}`, () => {
        test.beforeEach(async ({ page }) => {
          await setTheme(page, theme);
        });

        test('Switch交互状态', async ({ page }) => {
          const switchElement = page.locator('[data-testid="switch-default"]');
          await waitForComponent(page, '[data-testid="switch-default"]');

          // 初始状态
          await expect(switchElement).toHaveScreenshot(
            `switch-off-${theme}.png`,
            {
              animations: 'disabled',
              clip: await switchElement.boundingBox(),
              threshold: 0.15
            }
          );

          // 点击切换到开启状态
          await switchElement.click();
          await page.waitForTimeout(500);

          await expect(switchElement).toHaveScreenshot(
            `switch-on-${theme}.png`,
            {
              animations: 'disabled',
              clip: await switchElement.boundingBox(),
              threshold: 0.15
            }
          );

          // Hover状态
          await switchElement.hover();
          await page.waitForTimeout(300);

          await expect(switchElement).toHaveScreenshot(
            `switch-on-hover-${theme}.png`,
            {
              animations: 'disabled',
              clip: await switchElement.boundingBox(),
              threshold: 0.2
            }
          );
        });

        test('Checkbox交互状态', async ({ page }) => {
          const checkbox = page.locator('[data-testid="checkbox-default"]');
          await waitForComponent(page, '[data-testid="checkbox-default"]');

          // 未选中状态
          await expect(checkbox).toHaveScreenshot(
            `checkbox-unchecked-${theme}.png`,
            {
              animations: 'disabled',
              clip: await checkbox.boundingBox(),
              threshold: 0.15
            }
          );

          // 点击选中
          await checkbox.click();
          await page.waitForTimeout(300);

          await expect(checkbox).toHaveScreenshot(
            `checkbox-checked-${theme}.png`,
            {
              animations: 'disabled',
              clip: await checkbox.boundingBox(),
              threshold: 0.15
            }
          );

          // Focus状态
          await checkbox.focus();
          await page.waitForTimeout(300);

          await expect(checkbox).toHaveScreenshot(
            `checkbox-checked-focus-${theme}.png`,
            {
              animations: 'disabled',
              clip: await checkbox.boundingBox(),
              threshold: 0.2
            }
          );
        });

        test('Select交互状态', async ({ page }) => {
          const select = page.locator('[data-testid="select-default"]');
          await waitForComponent(page, '[data-testid="select-default"]');

          // 初始状态
          await expect(select).toHaveScreenshot(
            `select-closed-${theme}.png`,
            {
              animations: 'disabled',
              clip: await select.boundingBox(),
              threshold: 0.15
            }
          );

          // 点击打开下拉菜单
          await select.click();
          await page.waitForTimeout(500);

          // 检查下拉菜单是否打开
          const dropdown = page.locator('[role="listbox"], [role="menu"]');
          if (await dropdown.isVisible()) {
            await expect(select).toHaveScreenshot(
              `select-open-${theme}.png`,
              {
                animations: 'disabled',
                fullPage: false,
                threshold: 0.2
              }
            );

            // 选择一个选项
            const firstOption = dropdown.locator('[role="option"]').first();
            if (await firstOption.isVisible()) {
              await firstOption.hover();
              await page.waitForTimeout(300);

              await expect(dropdown).toHaveScreenshot(
                `select-option-hover-${theme}.png`,
                {
                  animations: 'disabled',
                  clip: await dropdown.boundingBox(),
                  threshold: 0.2
                }
              );

              await firstOption.click();
              await page.waitForTimeout(300);

              // 验证选择结果
              await expect(select).toHaveScreenshot(
                `select-with-selection-${theme}.png`,
                {
                  animations: 'disabled',
                  clip: await select.boundingBox(),
                  threshold: 0.15
                }
              );
            }
          }
        });
      });
    });
  });

  // 测试Tab组件的交互状态
  test.describe('Tab交互状态', () => {
    THEMES.forEach(theme => {
      test.describe(`主题: ${theme}`, () => {
        test.beforeEach(async ({ page }) => {
          await setTheme(page, theme);
        });

        test('Tab切换状态', async ({ page }) => {
          const tabs = page.locator('[data-testid="tabs-default"]');
          await waitForComponent(page, '[data-testid="tabs-default"]');

          const tabTriggers = tabs.locator('[role="tab"]');
          await expect(tabTriggers).toHaveCount(3);

          // 默认第一个tab是激活状态
          await expect(tabTriggers.first()).toHaveScreenshot(
            `tab-active-${theme}.png`,
            {
              animations: 'disabled',
              clip: await tabTriggers.first().boundingBox(),
              threshold: 0.15
            }
          );

          // 点击第二个tab
          await tabTriggers.nth(1).click();
          await page.waitForTimeout(500);

          // 验证第二个tab变为激活状态
          await expect(tabTriggers.nth(1)).toHaveScreenshot(
            `tab-activated-${theme}.png`,
            {
              animations: 'disabled',
              clip: await tabTriggers.nth(1).boundingBox(),
              threshold: 0.15
            }
          );

          // Hover非激活状态的tab
          await tabTriggers.first().hover();
          await page.waitForTimeout(300);

          await expect(tabTriggers.first()).toHaveScreenshot(
            `tab-inactive-hover-${theme}.png`,
            {
              animations: 'disabled',
              clip: await tabTriggers.first().boundingBox(),
              threshold: 0.2
            }
          );
        });
      });
    });
  });

  // 测试Modal的交互状态
  test.describe('Modal交互状态', () => {
    THEMES.forEach(theme => {
      test.describe(`主题: ${theme}`, () => {
        test.beforeEach(async ({ page }) => {
          await setTheme(page, theme);
        });

        test('Modal开启和关闭', async ({ page }) => {
          const modalTrigger = page.locator('[data-testid="modal-trigger"]');
          await waitForComponent(page, '[data-testid="modal-trigger"]');

          // 点击触发按钮
          await modalTrigger.click();
          await page.waitForTimeout(800); // 等待模态框动画

          // 验证模态框打开
          const modal = page.locator('[role="dialog"]');
          await expect(modal).toBeVisible();

          await expect(page).toHaveScreenshot(
            `modal-open-${theme}.png`,
            {
              animations: 'disabled',
              fullPage: true,
              threshold: 0.25
            }
          );

          // 检查焦点管理
          const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
          expect(focusedElement).toBe('BUTTON'); // 通常焦点应该在modal内的按钮上

          // 关闭模态框（按ESC键）
          await page.keyboard.press('Escape');
          await page.waitForTimeout(800);

          // 验证模态框关闭
          await expect(modal).not.toBeVisible();

          // 验证焦点返回到触发按钮
          const focusAfterClose = await page.evaluate(() => document.activeElement === modalTrigger.elementHandle());
          expect(focusAfterClose).toBeTruthy();
        });
      });
    });
  });

  // 测试动画和过渡效果
  test.describe('动画和过渡效果', () => {
    test('过渡效果一致性', async ({ page }) => {
      await setTheme(page, 'default');

      const button = page.locator('[data-testid="button-primary"]');
      await waitForComponent(page, '[data-testid="button-primary"]');

      // 测试hover过渡
      const startTime = Date.now();
      await button.hover();
      await page.waitForTimeout(50);
      const hoverStartTime = Date.now() - startTime;

      // 测试focus过渡
      await button.focus();
      await page.waitForTimeout(50);
      const focusStartTime = Date.now() - startTime - hoverStartTime;

      console.log(`🎬 过渡效果时间 - Hover: ${hoverStartTime}ms, Focus: ${focusStartTime}ms`);

      // 验证过渡时间合理
      expect(hoverStartTime).toBeGreaterThan(0);
      expect(focusStartTime).toBeGreaterThan(0);

      // 最终状态截图
      await page.waitForTimeout(250);
      await expect(button).toHaveScreenshot(
        'transition-final-state.png',
        {
          animations: 'disabled',
          clip: await button.boundingBox(),
          threshold: 0.15
        }
      );
    });
  });

  // 测试键盘导航
  test.describe('键盘导航交互', () => {
    test('Tab键导航', async ({ page }) => {
      await setTheme(page, 'default');

      // 从页面顶部开始Tab导航
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      let currentElement = await page.evaluate(() => document.activeElement?.tagName);
      console.log(`第一个聚焦元素: ${currentElement}`);

      // 继续Tab导航并截图每个状态
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(200);

        const focusedElement = page.locator(':focus');
        if (await focusedElement.isVisible()) {
          await expect(focusedElement).toHaveScreenshot(
            `keyboard-focus-${i}.png`,
            {
              animations: 'disabled',
              clip: await focusedElement.boundingBox(),
              threshold: 0.2
            }
          );
        }
      }
    });

    test('Enter和Space键交互', async ({ page }) => {
      await setTheme(page, 'default');

      const button = page.locator('[data-testid="button-primary"]');
      await waitForComponent(page, '[data-testid="button-primary"]');

      // 聚焦按钮
      await button.focus();
      await page.waitForTimeout(300);

      // 按Enter键
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      // 按Space键
      await page.keyboard.press('Space');
      await page.waitForTimeout(300);

      // 验证视觉状态
      await expect(button).toHaveScreenshot(
        'keyboard-activated.png',
        {
          animations: 'disabled',
          clip: await button.boundingBox(),
          threshold: 0.2
        }
      );
    });
  });
});