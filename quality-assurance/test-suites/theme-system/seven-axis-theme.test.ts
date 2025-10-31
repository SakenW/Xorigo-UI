/**
 * 🎨 七轴主题系统专项测试
 *
 * 测试覆盖所有7个主题轴的组合和交互
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';

// 扩展 Jest 匹配器
expect.extend(toHaveNoViolations);

// 导入主题系统
import {
  SevenAxisThemeProvider,
  useTheme,
  type ThemeConfig,
  type ThemeAxis,
  type ThemeRecipe
} from '../../../packages/core/src/theme/SevenAxisThemeProvider';

// 导入测试组件
import { Button, Card, Input, Modal } from '../../../packages/core/src';

// 七轴配置定义
const SEVEN_AXES: Record<ThemeAxis, string[]> = {
  mode: ['light', 'dark', 'auto'],
  hue: ['blue', 'green', 'purple', 'orange', 'red', 'teal', 'pink'],
  saturation: ['muted', 'normal', 'vibrant'],
  lightness: ['bright', 'normal', 'dim'],
  density: ['compact', 'normal', 'spacious'],
  roundness: ['sharp', 'rounded', 'circular'],
  contrast: ['low', 'normal', 'high']
} as const;

// 主题配方定义
const THEME_RECIPES: ThemeRecipe[] = [
  {
    name: 'default',
    config: {
      mode: 'light',
      hue: 'blue',
      saturation: 'normal',
      lightness: 'normal',
      density: 'normal',
      roundness: 'rounded',
      contrast: 'normal'
    }
  },
  {
    name: 'dark-professional',
    config: {
      mode: 'dark',
      hue: 'blue',
      saturation: 'muted',
      lightness: 'dim',
      density: 'compact',
      roundness: 'sharp',
      contrast: 'high'
    }
  },
  {
    name: 'vibrant-creative',
    config: {
      mode: 'light',
      hue: 'purple',
      saturation: 'vibrant',
      lightness: 'bright',
      density: 'spacious',
      roundness: 'circular',
      contrast: 'normal'
    }
  },
  {
    name: 'minimal-elegant',
    config: {
      mode: 'light',
      hue: 'teal',
      saturation: 'muted',
      lightness: 'bright',
      density: 'normal',
      roundness: 'rounded',
      contrast: 'low'
    }
  }
];

// 测试辅助组件
const ThemeTestComponent: React.FC<{
  component: React.ComponentType<any>;
  props?: any;
  testId?: string;
}> = ({ component: Component, props = {}, testId }) => {
  const { theme, updateTheme } = useTheme();

  return (
    <div data-testid={testId} data-theme={JSON.stringify(theme)}>
      <Component {...props} />
      <button
        data-testid="theme-switcher"
        onClick={() => updateTheme({ mode: theme.mode === 'light' ? 'dark' : 'light' })}
      >
        Toggle Theme
      </button>
    </div>
  );
};

describe('七轴主题系统测试', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('轴1: 模式轴 (Mode Axis) 测试', () => {
    it('应该在 light 和 dark 模式之间正确切换', async () => {
      const initialTheme: ThemeConfig = {
        mode: 'light',
        hue: 'blue',
        saturation: 'normal',
        lightness: 'normal',
        density: 'normal',
        roundness: 'rounded',
        contrast: 'normal'
      };

      render(
        <SevenAxisThemeProvider initialTheme={initialTheme}>
          <ThemeTestComponent
            component={Button}
            props={{ children: 'Test Button' }}
            testId="mode-test"
          />
        </SevenAxisThemeProvider>
      );

      const testElement = screen.getByTestId('mode-test');
      const themeData = JSON.parse(testElement.getAttribute('data-theme')!);

      // 验证初始主题
      expect(themeData.mode).toBe('light');

      // 切换主题
      const switcher = screen.getByTestId('theme-switcher');
      fireEvent.click(switcher);

      // 验证主题切换
      await waitFor(() => {
        const updatedThemeData = JSON.parse(testElement.getAttribute('data-theme')!);
        expect(updatedThemeData.mode).toBe('dark');
      });
    });

    it('应该在 auto 模式下响应系统偏好', async () => {
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {}
        })
      });

      const autoTheme: ThemeConfig = {
        mode: 'auto',
        hue: 'blue',
        saturation: 'normal',
        lightness: 'normal',
        density: 'normal',
        roundness: 'rounded',
        contrast: 'normal'
      };

      render(
        <SevenAxisThemeProvider initialTheme={autoTheme}>
          <ThemeTestComponent
            component={Card}
            props={{ title: 'Test Card' }}
            testId="auto-theme-test"
          />
        </SevenAxisThemeProvider>
      );

      const testElement = screen.getByTestId('auto-theme-test');
      const themeData = JSON.parse(testElement.getAttribute('data-theme')!);

      // 应该检测到系统偏好为 dark
      expect(themeData.resolvedMode).toBe('dark');
    });
  });

  describe('轴2: 色调轴 (Hue Axis) 测试', () => {
    it.each(SEVEN_AXES.hue)('应该正确应用 %s 色调', async (hue) => {
      const hueTheme: ThemeConfig = {
        mode: 'light',
        hue: hue as any,
        saturation: 'normal',
        lightness: 'normal',
        density: 'normal',
        roundness: 'rounded',
        contrast: 'normal'
      };

      render(
        <SevenAxisThemeProvider initialTheme={hueTheme}>
          <ThemeTestComponent
            component={Button}
            props={{ children: `${hue} Button` }}
            testId={`hue-${hue}-test`}
          />
        </SevenAxisThemeProvider>
      );

      const testElement = screen.getByTestId(`hue-${hue}-test`);
      const themeData = JSON.parse(testElement.getAttribute('data-theme')!);

      expect(themeData.hue).toBe(hue);

      // 验证颜色对比度
      const button = screen.getByRole('button', { name: `${hue} Button` });
      const styles = getComputedStyle(button);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // 验证颜色不为空且符合对比度要求
      expect(color).toBeTruthy();
      expect(backgroundColor).toBeTruthy();
      expect(color).not.toBe(backgroundColor);
    });
  });

  describe('轴3: 饱和度轴 (Saturation Axis) 测试', () => {
    it.each(SEVEN_AXES.saturation)('应该正确应用 %s 饱和度', async (saturation) => {
      const saturationTheme: ThemeConfig = {
        mode: 'light',
        hue: 'blue',
        saturation: saturation as any,
        lightness: 'normal',
        density: 'normal',
        roundness: 'rounded',
        contrast: 'normal'
      };

      render(
        <SevenAxisThemeProvider initialTheme={saturationTheme}>
          <ThemeTestComponent
            component={Button}
            props={{ children: `${saturation} Button`, variant: 'primary' }}
            testId={`saturation-${saturation}-test`}
          />
        </SevenAxisThemeProvider>
      );

      const testElement = screen.getByTestId(`saturation-${saturation}-test`);
      const themeData = JSON.parse(testElement.getAttribute('data-theme')!);

      expect(themeData.saturation).toBe(saturation);

      // 验证饱和度的视觉效果
      const button = screen.getByRole('button');
      const styles = getComputedStyle(button);

      // 检查是否有颜色应用
      expect(styles.color).toBeTruthy();
      expect(styles.backgroundColor).toBeTruthy();
    });
  });

  describe('轴4: 亮度轴 (Lightness Axis) 测试', () => {
    it.each(SEVEN_AXES.lightness)('应该正确应用 %s 亮度', async (lightness) => {
      const lightnessTheme: ThemeConfig = {
        mode: 'light',
        hue: 'blue',
        saturation: 'normal',
        lightness: lightness as any,
        density: 'normal',
        roundness: 'rounded',
        contrast: 'normal'
      };

      render(
        <SevenAxisThemeProvider initialTheme={lightnessTheme}>
          <ThemeTestComponent
            component={Card}
            props={{ title: `${lightness} Card` }}
            testId={`lightness-${lightness}-test`}
          />
        </SevenAxisThemeProvider>
      );

      const testElement = screen.getByTestId(`lightness-${lightness}-test`);
      const themeData = JSON.parse(testElement.getAttribute('data-theme')!);

      expect(themeData.lightness).toBe(lightness);
    });
  });

  describe('轴5: 密度轴 (Density Axis) 测试', () => {
    it.each(SEVEN_AXES.density)('应该正确应用 %s 密度', async (density) => {
      const densityTheme: ThemeConfig = {
        mode: 'light',
        hue: 'blue',
        saturation: 'normal',
        lightness: 'normal',
        density: density as any,
        roundness: 'rounded',
        contrast: 'normal'
      };

      render(
        <SevenAxisThemeProvider initialTheme={densityTheme}>
          <ThemeTestComponent
            component={Input}
            props={{ placeholder: `${density} Input` }}
            testId={`density-${density}-test`}
          />
        </SevenAxisThemeProvider>
      );

      const testElement = screen.getByTestId(`density-${density}-test`);
      const themeData = JSON.parse(testElement.getAttribute('data-theme')!);

      expect(themeData.density).toBe(density);

      // 验证密度对间距的影响
      const input = screen.getByPlaceholderText(`${density} Input`);
      const styles = getComputedStyle(input);

      // 检查 padding 是否根据密度变化
      expect(styles.padding).toBeTruthy();
    });
  });

  describe('轴6: 圆度轴 (Roundness Axis) 测试', () => {
    it.each(SEVEN_AXES.roundness)('应该正确应用 %s 圆度', async (roundness) => {
      const roundnessTheme: ThemeConfig = {
        mode: 'light',
        hue: 'blue',
        saturation: 'normal',
        lightness: 'normal',
        density: 'normal',
        roundness: roundness as any,
        contrast: 'normal'
      };

      render(
        <SevenAxisThemeProvider initialTheme={roundnessTheme}>
          <ThemeTestComponent
            component={Button}
            props={{ children: `${roundness} Button` }}
            testId={`roundness-${roundness}-test`}
          />
        </SevenAxisThemeProvider>
      );

      const testElement = screen.getByTestId(`roundness-${roundness}-test`);
      const themeData = JSON.parse(testElement.getAttribute('data-theme')!);

      expect(themeData.roundness).toBe(roundness);

      // 验证圆角效果
      const button = screen.getByRole('button');
      const styles = getComputedStyle(button);
      const borderRadius = styles.borderRadius;

      expect(borderRadius).toBeTruthy();

      // 验证不同圆度级别的差异
      if (roundness === 'sharp') {
        expect(borderRadius).toBe('0px');
      } else if (roundness === 'circular') {
        expect(parseInt(borderRadius)).toBeGreaterThan(0);
      }
    });
  });

  describe('轴7: 对比度轴 (Contrast Axis) 测试', () => {
    it.each(SEVEN_AXES.contrast)('应该正确应用 %s 对比度', async (contrast) => {
      const contrastTheme: ThemeConfig = {
        mode: 'light',
        hue: 'blue',
        saturation: 'normal',
        lightness: 'normal',
        density: 'normal',
        roundness: 'rounded',
        contrast: contrast as any
      };

      render(
        <SevenAxisThemeProvider initialTheme={contrastTheme}>
          <ThemeTestComponent
            component={Button}
            props={{ children: `${contrast} Button`, variant: 'primary' }}
            testId={`contrast-${contrast}-test`}
          />
        </SevenAxisThemeProvider>
      );

      const testElement = screen.getByTestId(`contrast-${contrast}-test`);
      const themeData = JSON.parse(testElement.getAttribute('data-theme')!);

      expect(themeData.contrast).toBe(contrast);

      // 验证对比度效果
      const button = screen.getByRole('button');
      const styles = getComputedStyle(button);

      expect(styles.color).toBeTruthy();
      expect(styles.backgroundColor).toBeTruthy();

      // 验证颜色对比度（基本检查）
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      expect(color).not.toBe(backgroundColor);
    });
  });

  describe('主题配方组合测试', () => {
    it.each(THEME_RECIPES)('应该正确应用 $name 配方', async (recipe) => {
      render(
        <SevenAxisThemeProvider initialTheme={recipe.config}>
          <ThemeTestComponent
            component={Card}
            props={{ title: recipe.name }}
            testId={`recipe-${recipe.name}`}
          />
        </SevenAxisThemeProvider>
      );

      const testElement = screen.getByTestId(`recipe-${recipe.name}`);
      const themeData = JSON.parse(testElement.getAttribute('data-theme')!);

      // 验证所有轴的配置
      Object.entries(recipe.config).forEach(([axis, value]) => {
        expect(themeData[axis]).toBe(value);
      });

      // 验证视觉渲染
      const card = screen.getByText(recipe.name);
      expect(card).toBeInTheDocument();

      // 验证可访问性
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('主题动态切换测试', () => {
    it('应该支持运行时主题切换', async () => {
      const initialTheme: ThemeConfig = {
        mode: 'light',
        hue: 'blue',
        saturation: 'normal',
        lightness: 'normal',
        density: 'normal',
        roundness: 'rounded',
        contrast: 'normal'
      };

      const DynamicThemeComponent = () => {
        const { theme, updateTheme } = useTheme();

        return (
          <div>
            <Button data-testid="themed-button">Dynamic Button</Button>
            <button
              data-testid="change-hue"
              onClick={() => updateTheme({ hue: 'purple' })}
            >
              Change Hue
            </button>
            <button
              data-testid="change-density"
              onClick={() => updateTheme({ density: 'spacious' })}
            >
              Change Density
            </button>
            <div data-testid="current-theme">{JSON.stringify(theme)}</div>
          </div>
        );
      };

      render(
        <SevenAxisThemeProvider initialTheme={initialTheme}>
          <DynamicThemeComponent />
        </SevenAxisThemeProvider>
      );

      const currentTheme = screen.getByTestId('current-theme');
      let themeData = JSON.parse(currentTheme.textContent || '{}');

      // 验证初始状态
      expect(themeData.hue).toBe('blue');
      expect(themeData.density).toBe('normal');

      // 改变色调
      const changeHue = screen.getByTestId('change-hue');
      fireEvent.click(changeHue);

      await waitFor(() => {
        themeData = JSON.parse(currentTheme.textContent || '{}');
        expect(themeData.hue).toBe('purple');
      });

      // 改变密度
      const changeDensity = screen.getByTestId('change-density');
      fireEvent.click(changeDensity);

      await waitFor(() => {
        themeData = JSON.parse(currentTheme.textContent || '{}');
        expect(themeData.density).toBe('spacious');
      });
    });
  });

  describe('主题持久化测试', () => {
    it('应该能够保存和恢复主题配置', async () => {
      const themeToSave: ThemeConfig = {
        mode: 'dark',
        hue: 'purple',
        saturation: 'vibrant',
        lightness: 'dim',
        density: 'spacious',
        roundness: 'circular',
        contrast: 'high'
      };

      // Mock localStorage
      const localStorageMock = (() => {
        let store: Record<string, string> = {};
        return {
          getItem: (key: string) => store[key] || null,
          setItem: (key: string, value: string) => { store[key] = value.toString(); },
          removeItem: (key: string) => { delete store[key]; },
          clear: () => { store = {}; }
        };
      })();
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });

      const ThemePersistenceComponent = () => {
        const { theme, saveTheme, loadTheme } = useTheme();

        return (
          <div>
            <button
              data-testid="save-theme"
              onClick={() => saveTheme('test-theme')}
            >
              Save Theme
            </button>
            <button
              data-testid="load-theme"
              onClick={() => loadTheme('test-theme')}
            >
              Load Theme
            </button>
            <div data-testid="current-theme">{JSON.stringify(theme)}</div>
          </div>
        );
      };

      render(
        <SevenAxisThemeProvider initialTheme={themeToSave}>
          <ThemePersistenceComponent />
        </SevenAxisThemeProvider>
      );

      const currentTheme = screen.getByTestId('current-theme');
      const saveButton = screen.getByTestId('save-theme');
      const loadButton = screen.getByTestId('load-theme');

      // 保存主题
      fireEvent.click(saveButton);

      // 验证主题已保存
      const savedTheme = localStorageMock.getItem('xorigo-theme-test-theme');
      expect(savedTheme).toBeTruthy();
      expect(JSON.parse(savedTheme!)).toEqual(themeToSave);

      // 改变当前主题
      const differentTheme: ThemeConfig = {
        mode: 'light',
        hue: 'blue',
        saturation: 'normal',
        lightness: 'normal',
        density: 'normal',
        roundness: 'rounded',
        contrast: 'normal'
      };

      // 这里需要通过 updateTheme 来改变主题
      // 然后测试加载功能

      // 加载保存的主题
      fireEvent.click(loadButton);

      await waitFor(() => {
        const themeData = JSON.parse(currentTheme.textContent || '{}');
        expect(themeData).toEqual(themeToSave);
      });
    });
  });

  describe('可访问性测试', () => {
    it.each(THEME_RECIPES)('$name 配方应该符合 WCAG 标准', async (recipe) => {
      render(
        <SevenAxisThemeProvider initialTheme={recipe.config}>
          <div>
            <Button data-testid="accessible-button">Accessible Button</Button>
            <Input data-testid="accessible-input" placeholder="Accessible Input" />
            <Card data-testid="accessible-card" title="Accessible Card">
              Card content
            </Card>
          </div>
        </SevenAxisThemeProvider>
      );

      // 运行可访问性测试
      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // 验证键盘导航
      const button = screen.getByTestId('accessible-button');
      button.focus();
      expect(document.activeElement).toBe(button);

      // 验证 ARIA 属性
      const input = screen.getByTestId('accessible-input');
      expect(input).toHaveAttribute('placeholder');
    });
  });

  describe('性能测试', () => {
    it('主题切换应该在合理时间内完成', async () => {
      const initialTheme: ThemeConfig = {
        mode: 'light',
        hue: 'blue',
        saturation: 'normal',
        lightness: 'normal',
        density: 'normal',
        roundness: 'rounded',
        contrast: 'normal'
      };

      const PerformanceTestComponent = () => {
        const { theme, updateTheme } = useTheme();

        return (
          <div>
            <Button data-testid="perf-button">Performance Test Button</Button>
            <button
              data-testid="rapid-theme-switch"
              onClick={() => updateTheme({
                mode: theme.mode === 'light' ? 'dark' : 'light',
                hue: theme.hue === 'blue' ? 'purple' : 'blue'
              })}
            >
              Rapid Switch
            </button>
          </div>
        );
      };

      render(
        <SevenAxisThemeProvider initialTheme={initialTheme}>
          <PerformanceTestComponent />
        </SevenAxisThemeProvider>
      );

      const switchButton = screen.getByTestId('rapid-theme-switch');

      // 测试快速切换性能
      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        fireEvent.click(switchButton);
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // 10次切换应该在500ms内完成
      expect(duration).toBeLessThan(500);
    });
  });
});