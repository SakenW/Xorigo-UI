import { Page, expect, Locator } from '@playwright/test';

// 主题配置
export const THEMES = [
  'default',
  'ocean',
  'sunset',
  'forest',
  'purple',
  'midnight',
  'candy',
  'corporate',
  'minimal',
  'dark'
] as const;

// 视口配置
export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  mobileLarge: { width: 414, height: 896 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  desktopLarge: { width: 1920, height: 1080 },
} as const;

// 组件状态
export const COMPONENT_STATES = {
  button: ['default', 'hover', 'active', 'disabled', 'loading'] as const,
  input: ['default', 'focus', 'error', 'disabled'] as const,
  card: ['default', 'hover', 'selected'] as const,
  modal: ['closed', 'open'] as const,
} as const;

/**
 * 设置页面主题
 */
export async function setTheme(page: Page, themeName: string): Promise<void> {
  // 通过CSS变量或API切换主题
  await page.evaluate((theme) => {
    // 假设主题切换逻辑
    document.documentElement.setAttribute('data-theme', theme);

    // 或者通过主题切换按钮
    const themeButton = document.querySelector('[data-testid="theme-switcher"]');
    if (themeButton) {
      (themeButton as HTMLElement).click();

      // 等待主题菜单出现并选择主题
      setTimeout(() => {
        const themeOption = document.querySelector(`[data-theme="${theme}"]`);
        if (themeOption) {
          (themeOption as HTMLElement).click();
        }
      }, 100);
    }
  }, themeName);

  // 等待主题切换完成
  await page.waitForTimeout(500);
}

/**
 * 设置视口大小
 */
export async function setViewport(page: Page, viewport: typeof VIEWPORTS[keyof typeof VIEWPORTS]): Promise<void> {
  await page.setViewportSize(viewport);
  await page.waitForLoadState('networkidle');
}

/**
 * 等待组件加载完成
 */
export async function waitForComponent(page: Page, componentSelector: string): Promise<Locator> {
  const component = page.locator(componentSelector);
  await component.waitFor({ state: 'visible' });
  await page.waitForLoadState('networkidle');
  return component;
}

/**
 * 模拟用户交互
 */
export async function simulateInteraction(
  page: Page,
  selector: string,
  interaction: 'hover' | 'focus' | 'click' | 'blur'
): Promise<void> {
  const element = page.locator(selector);

  switch (interaction) {
    case 'hover':
      await element.hover();
      break;
    case 'focus':
      await element.focus();
      break;
    case 'click':
      await element.click();
      break;
    case 'blur':
      await element.blur();
      break;
  }

  // 等待过渡动画完成
  await page.waitForTimeout(300);
}

/**
 * 获取组件截图配置
 */
export function getScreenshotOptions(componentName?: string, state?: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = componentName
    ? `${componentName}-${state || 'default'}-${timestamp}`
    : `screenshot-${timestamp}`;

  return {
    fullPage: false,
    clip: { x: 0, y: 0, width: 300, height: 200 }, // 默认裁剪区域
    animations: 'disabled' as const,
    caret: 'hide' as const,
  };
}

/**
 * 视觉回归测试断言
 */
export async function expectVisualMatch(
  page: Page,
  componentName: string,
  state?: string,
  threshold = 0.2
): Promise<void> {
  const options = getScreenshotOptions(componentName, state);

  await expect(page).toHaveScreenshot(`${componentName}-${state || 'default'}.png`, {
    ...options,
    threshold,
    maxDiffPixels: 10,
    maxDiffPixelRatio: 0.01,
  });
}

/**
 * 批量测试组件状态
 */
export async function testComponentStates(
  page: Page,
  componentName: string,
  selector: string,
  states: readonly string[]
): Promise<void> {
  for (const state of states) {
    console.log(`🧪 测试 ${componentName} 组件 ${state} 状态`);

    // 根据状态设置相应的交互
    switch (state) {
      case 'hover':
        await simulateInteraction(page, selector, 'hover');
        break;
      case 'focus':
        await simulateInteraction(page, selector, 'focus');
        break;
      case 'active':
        await page.mouse.down();
        await page.mouse.up();
        break;
      case 'disabled':
        // 需要通过props设置disabled状态
        await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (el) el.setAttribute('disabled', 'true');
        }, selector);
        break;
      case 'error':
        // 设置错误状态
        await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (el) el.classList.add('error');
        }, selector);
        break;
    }

    // 等待状态更新
    await page.waitForTimeout(300);

    // 进行视觉对比
    await expectVisualMatch(page, componentName, state);
  }
}

/**
 * 清理状态
 */
export async function resetComponentState(page: Page, selector: string): Promise<void> {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      el.removeAttribute('disabled');
      el.classList.remove('error', 'hover', 'focus');
      el.blur();
    }
  }, selector);

  await page.mouse.move(0, 0); // 移动鼠标避免hover状态
  await page.waitForTimeout(200);
}

/**
 * 生成测试数据
 */
export function generateTestData(componentType: string) {
  const testData = {
    button: {
      text: 'Click me',
      variants: ['primary', 'secondary', 'outline', 'ghost'],
      sizes: ['sm', 'md', 'lg'],
    },
    input: {
      placeholder: 'Enter text...',
      value: 'Test input',
      types: ['text', 'email', 'password'],
    },
    card: {
      title: 'Card Title',
      description: 'This is a card description with some content.',
      imageUrl: 'https://picsum.photos/seed/card/300/200.jpg',
    },
    modal: {
      title: 'Modal Title',
      content: 'This is modal content with some text.',
    },
  };

  return testData[componentType as keyof typeof testData] || {};
}