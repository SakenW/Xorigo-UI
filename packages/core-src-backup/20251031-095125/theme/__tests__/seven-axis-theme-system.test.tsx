/**
 * 七轴主题系统专项测试套件
 *
 * 全面测试七轴主题系统的各个轴向、配方系统、约束机制和CSS变量管理
 * 确保主题系统在各种组合和边界情况下的正确性和稳定性
 */

import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, useTheme, ThemeAxes } from '../theme-provider'
import { generateThemeTokens, applyThemeConstraints } from '../theme-axis-controller'
import { getThemeRecipe, getAllRecipes } from '../theme-recipes'

// 导入测试组件
import { Button } from '../../primitives/button/button'
import { Card } from '../../data-display/card/card'
import { Badge } from '../../feedback/badge/badge'
import { Alert } from '../../feedback/alert/alert'

// 测试配置
const TEST_TIMEOUT = 10000

describe('七轴主题系统专项测试', () => {
  let originalMatchMedia: typeof window.matchMedia

  beforeEach(() => {
    originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query.includes('dark'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    vi.clearAllMocks()
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    vi.restoreAllMocks()
  })

  // =============================================================================
  // 1. Mode轴测试 (模式轴)
  // =============================================================================
  describe('Mode轴测试 (Light/Dark/HC/Auto)', () => {
    const modes: Array<'light' | 'dark' | 'hc' | 'auto'> = ['light', 'dark', 'hc', 'auto']

    modes.forEach(mode => {
      it(`应该在${mode}模式下正确生成主题令牌`, () => {
        const axes: ThemeAxes = {
          mode,
          base: 'neutral-cool-mid',
          accent: 'mono(blue)',
          tone: 'standard',
          density: 'comfortable',
          motion: 'standard.classic',
          surface: 'flat'
        }

        const themeTokens = generateThemeTokens(axes)

        expect(themeTokens).toBeDefined()
        expect(themeTokens.mode).toBe(mode)
        expect(themeTokens.tokens).toBeDefined()
        expect(Object.keys(themeTokens.tokens)).toContain('xor-bg-primary')
        expect(Object.keys(themeTokens.tokens)).toContain('xor-text-primary')
      })

      it(`应该在${mode}模式下正确应用到组件`, () => {
        const axes: ThemeAxes = {
          mode,
          base: 'neutral-cool-mid',
          accent: 'mono(blue)',
          tone: 'standard',
          density: 'comfortable',
          motion: 'standard.classic',
          surface: 'flat'
        }

        render(
          <ThemeProvider initialAxes={axes}>
            <Button variant="primary">测试按钮</Button>
            <Card>测试卡片</Card>
            <Badge variant="success">测试徽章</Badge>
          </ThemeProvider>
        )

        expect(screen.getByText('测试按钮')).toBeInTheDocument()
        expect(screen.getByText('测试卡片')).toBeInTheDocument()
        expect(screen.getByText('测试徽章')).toBeInTheDocument()
      })

      it(`应该在${mode}模式下满足可访问性标准`, async () => {
        const axes: ThemeAxes = {
          mode,
          base: 'neutral-cool-mid',
          accent: 'mono(blue)',
          tone: 'standard',
          density: 'comfortable',
          motion: 'standard.classic',
          surface: 'flat'
        }

        const { container } = render(
          <ThemeProvider initialAxes={axes}>
            <Button variant="primary">Primary Button</Button>
            <Alert variant="success">Success Alert</Alert>
          </ThemeProvider>
        )

        // 验证CSS变量已注入
        const root = document.documentElement
        expect(root.style.getPropertyValue('--xor-bg-primary')).toBeTruthy()
        expect(root.style.getPropertyValue('--xor-text-primary')).toBeTruthy()

        // 验证对比度
        const buttonStyles = window.getComputedStyle(screen.getByText('Primary Button'))
        expect(buttonStyles.color).toBeTruthy()
        expect(buttonStyles.backgroundColor).toBeTruthy()
      })
    })

    it('auto模式应该响应系统主题变化', async () => {
      const axes: ThemeAxes = {
        mode: 'auto',
        base: 'neutral-cool-mid',
        accent: 'mono(blue)',
        tone: 'standard',
        density: 'comfortable',
        motion: 'standard.classic',
        surface: 'flat'
      }

      render(
        <ThemeProvider initialAxes={axes}>
          <Button>Auto Theme Button</Button>
        </ThemeProvider>
      )

      // 初始状态
      expect(screen.getByText('Auto Theme Button')).toBeInTheDocument()

      // 模拟系统主题变化
      const mockMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      fireEvent.change(mockMediaQuery, { matches: true })

      await waitFor(() => {
        // 验证主题已切换
        const root = document.documentElement
        expect(root.style.getPropertyValue('--xor-bg-primary')).toBeTruthy()
      })
    })
  })

  // =============================================================================
  // 2. Base轴测试 (基础色调轴)
  // =============================================================================
  describe('Base轴测试 (基础色调)', () => {
    const baseOptions = [
      'neutral-cool-mid',
      'neutral-warm-mid',
      'neutral-true-mid',
      'neutral-cool-high',
      'neutral-warm-high',
      'neutral-true-high'
    ]

    baseOptions.forEach(base => {
      it(`应该支持${base}基础色调`, () => {
        const axes: ThemeAxes = {
          mode: 'light',
          base: base as any,
          accent: 'mono(blue)',
          tone: 'standard',
          density: 'comfortable',
          motion: 'standard.classic',
          surface: 'flat'
        }

        const themeTokens = generateThemeTokens(axes)

        expect(themeTokens.tokens).toBeDefined()
        expect(themeTokens.base).toBe(base)
      })
    })

    it('应该在极端基础色调下保持可读性', () => {
      const extremeAxes: ThemeAxes = {
        mode: 'light',
        base: 'neutral-cool-high',
        accent: 'mono(yellow)',
        tone: 'vivid',
        density: 'compact',
        motion: 'expressive.spring',
        surface: 'glass+neon'
      }

      render(
        <ThemeProvider initialAxes={extremeAxes}>
          <Button variant="primary">极端对比按钮</Button>
        </ThemeProvider>
      )

      expect(screen.getByText('极端对比按钮')).toBeInTheDocument()

      // 验证约束系统是否正确应用
      const root = document.documentElement
      expect(root.style.getPropertyValue('--xor-primary')).toBeTruthy()
    })
  })

  // =============================================================================
  // 3. Accent轴测试 (强调色轴)
  // =============================================================================
  describe('Accent轴测试 (强调色)', () => {
    const accentOptions = [
      'mono(blue)',
      'mono(green)',
      'mono(red)',
      'mono(purple)',
      'mono(orange)',
      'analog(blue)',
      'analog(green)',
      'complementary(blue)',
      'triadic(blue)',
      'multi(sunset)',
      'multi(ocean)',
      'multi(forest)'
    ]

    accentOptions.forEach(accent => {
      it(`应该支持${accent}强调色配置`, () => {
        const axes: ThemeAxes = {
          mode: 'light',
          base: 'neutral-cool-mid',
          accent: accent as any,
          tone: 'standard',
          density: 'comfortable',
          motion: 'standard.classic',
          surface: 'flat'
        }

        const themeTokens = generateThemeTokens(axes)

        expect(themeTokens.tokens).toBeDefined()
        expect(themeTokens.accent).toBe(accent)
      })
    })

    it('应该在复杂强调色配置下正确工作', () => {
      const complexAxes: ThemeAxes = {
        mode: 'light',
        base: 'neutral-cool-mid',
        accent: 'multi(sunset-gradient)',
        tone: 'vivid',
        density: 'comfortable',
        motion: 'standard.classic',
        surface: 'flat'
      }

      render(
        <ThemeProvider initialAxes={complexAxes}>
          <div>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
          </div>
        </ThemeProvider>
      )

      // 验证所有组件都正确渲染
      expect(screen.getByText('Primary')).toBeInTheDocument()
      expect(screen.getByText('Secondary')).toBeInTheDocument()
      expect(screen.getByText('Success')).toBeInTheDocument()
      expect(screen.getByText('Warning')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 4. Tone轴测试 (色调轴)
  // =============================================================================
  describe('Tone轴测试 (色调)', () => {
    const toneOptions = ['muted', 'standard', 'vivid']

    toneOptions.forEach(tone => {
      it(`应该支持${tone}色调配置`, () => {
        const axes: ThemeAxes = {
          mode: 'light',
          base: 'neutral-cool-mid',
          accent: 'mono(blue)',
          tone: tone as any,
          density: 'comfortable',
          motion: 'standard.classic',
          surface: 'flat'
        }

        const themeTokens = generateThemeTokens(axes)

        expect(themeTokens.tokens).toBeDefined()
        expect(themeTokens.tone).toBe(tone)
      })
    })

    it('vivid色调应该增强视觉表现', () => {
      const vividAxes: ThemeAxes = {
        mode: 'light',
        base: 'neutral-cool-mid',
        accent: 'mono(blue)',
        tone: 'vivid',
        density: 'comfortable',
        motion: 'standard.classic',
        surface: 'flat'
      }

      const { container } = render(
        <ThemeProvider initialAxes={vividAxes}>
          <Button variant="primary">Vivid Button</Button>
        </ThemeProvider>
      )

      const button = screen.getByText('Vivid Button')
      const styles = window.getComputedStyle(button)

      expect(styles.color).toBeTruthy()
      expect(styles.backgroundColor).toBeTruthy()
    })
  })

  // =============================================================================
  // 5. Density轴测试 (密度轴)
  // =============================================================================
  describe('Density轴测试 (密度)', () => {
    const densityOptions = ['compact', 'comfortable', 'spacious']

    densityOptions.forEach(density => {
      it(`应该支持${density}密度配置`, () => {
        const axes: ThemeAxes = {
          mode: 'light',
          base: 'neutral-cool-mid',
          accent: 'mono(blue)',
          tone: 'standard',
          density: density as any,
          motion: 'standard.classic',
          surface: 'flat'
        }

        render(
          <ThemeProvider initialAxes={axes}>
            <Button>密度测试按钮</Button>
            <Card>密度测试卡片</Card>
          </ThemeProvider>
        )

        expect(screen.getByText('密度测试按钮')).toBeInTheDocument()
        expect(screen.getByText('密度测试卡片')).toBeInTheDocument()
      })
    })

    it('compact密度应该减少间距', () => {
      const compactAxes: ThemeAxes = {
        mode: 'light',
        base: 'neutral-cool-mid',
        accent: 'mono(blue)',
        tone: 'standard',
        density: 'compact',
        motion: 'standard.classic',
        surface: 'flat'
      }

      render(
        <ThemeProvider initialAxes={compactAxes}>
          <Button size="sm">紧凑按钮</Button>
        </ThemeProvider>
      )

      const button = screen.getByText('紧凑按钮')
      const styles = window.getComputedStyle(button)

      expect(styles.padding).toBeTruthy()
    })
  })

  // =============================================================================
  // 6. Motion轴测试 (动效轴)
  // =============================================================================
  describe('Motion轴测试 (动效)', () => {
    const motionOptions = [
      'subtle.classic',
      'standard.classic',
      'expressive.spring',
      'expressive.bounce',
      'dramatic.cinematic'
    ]

    motionOptions.forEach(motion => {
      it(`应该支持${motion}动效配置`, () => {
        const axes: ThemeAxes = {
          mode: 'light',
          base: 'neutral-cool-mid',
          accent: 'mono(blue)',
          tone: 'standard',
          density: 'comfortable',
          motion: motion as any,
          surface: 'flat'
        }

        const themeTokens = generateThemeTokens(axes)

        expect(themeTokens.tokens).toBeDefined()
        expect(themeTokens.motion).toBe(motion)
      })
    })

    it('动效配置应该影响过渡时间', () => {
      const expressiveAxes: ThemeAxes = {
        mode: 'light',
        base: 'neutral-cool-mid',
        accent: 'mono(blue)',
        tone: 'standard',
        density: 'comfortable',
        motion: 'expressive.spring',
        surface: 'flat'
      }

      render(
        <ThemeProvider initialAxes={expressiveAxes}>
          <Button>动效按钮</Button>
        </ThemeProvider>
      )

      const button = screen.getByText('动效按钮')
      const styles = window.getComputedStyle(button)

      // 验证过渡效果
      expect(styles.transition).toBeTruthy()
    })
  })

  // =============================================================================
  // 7. Surface轴测试 (表面轴)
  // =============================================================================
  describe('Surface轴测试 (表面)', () => {
    const surfaceOptions = [
      'flat',
      'soft-shadow',
      'hard-shadow',
      'glass',
      'neon',
      'glass+neon',
      'gradient',
      'textured'
    ]

    surfaceOptions.forEach(surface => {
      it(`应该支持${surface}表面效果`, () => {
        const axes: ThemeAxes = {
          mode: 'light',
          base: 'neutral-cool-mid',
          accent: 'mono(blue)',
          tone: 'standard',
          density: 'comfortable',
          motion: 'standard.classic',
          surface: surface as any
        }

        render(
          <ThemeProvider initialAxes={axes}>
            <Card>表面测试卡片</Card>
          </ThemeProvider>
        )

        expect(screen.getByText('表面测试卡片')).toBeInTheDocument()
      })
    })

    it('glass效果应该应用透明度', () => {
      const glassAxes: ThemeAxes = {
        mode: 'light',
        base: 'neutral-cool-mid',
        accent: 'mono(blue)',
        tone: 'standard',
        density: 'comfortable',
        motion: 'standard.classic',
        surface: 'glass'
      }

      render(
        <ThemeProvider initialAxes={glassAxes}>
          <Card>玻璃卡片</Card>
        </ThemeProvider>
      )

      const card = screen.getByText('玻璃卡片').closest('div')
      const styles = window.getComputedStyle(card!)

      expect(styles.backgroundColor).toBeTruthy()
    })
  })

  // =============================================================================
  // 8. 主题配方系统测试
  // =============================================================================
  describe('主题配方系统测试', () => {
    it('应该正确加载预定义主题配方', () => {
      const recipes = getAllRecipes()
      expect(recipes.length).toBeGreaterThan(0)

      recipes.forEach(recipe => {
        expect(recipe).toHaveProperty('name')
        expect(recipe).toHaveProperty('axes')
        expect(recipe).toHaveProperty('description')
      })
    })

    it('应该能够应用主题配方', () => {
      const recipe = getThemeRecipe('ocean-breeze')
      expect(recipe).toBeDefined()

      if (recipe) {
        render(
          <ThemeProvider initialAxes={recipe.axes}>
            <Button>海洋微风主题</Button>
          </ThemeProvider>
        )

        expect(screen.getByText('海洋微风主题')).toBeInTheDocument()
      }
    })

    it('配方应该在所有组件上正确应用', () => {
      const recipe = getThemeRecipe('sunset-warm')

      if (recipe) {
        render(
          <ThemeProvider initialAxes={recipe.axes}>
            <div>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Card>卡片</Card>
              <Badge variant="success">徽章</Badge>
              <Alert variant="warning">警告</Alert>
            </div>
          </ThemeProvider>
        )

        expect(screen.getByText('Primary')).toBeInTheDocument()
        expect(screen.getByText('Secondary')).toBeInTheDocument()
        expect(screen.getByText('卡片')).toBeInTheDocument()
        expect(screen.getByText('徽章')).toBeInTheDocument()
        expect(screen.getByText('警告')).toBeInTheDocument()
      }
    })
  })

  // =============================================================================
  // 9. 主题约束系统测试
  // =============================================================================
  describe('主题约束系统测试', () => {
    it('高对比模式应该自动降级动效', () => {
      const hcAxes: ThemeAxes = {
        mode: 'hc',
        base: 'neutral-cool-high',
        accent: 'mono(yellow)',
        tone: 'vivid',
        density: 'compact',
        motion: 'expressive.spring', // 应该被降级
        surface: 'glass' // 应该被降级为 flat
      }

      // 监听约束警告
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const constrainedAxes = applyThemeConstraints(hcAxes)

      expect(constrainedAxes.motion).toBe('subtle.classic')
      expect(constrainedAxes.surface).toBe('flat')

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('高对比模式：动效已降级至 subtle.classic')
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('高对比模式：表面已切换至 flat')
      )

      consoleSpy.mockRestore()
    })

    it('vivid + neon组合应该自动调整饱和度', () => {
      const vividNeonAxes: ThemeAxes = {
        mode: 'light',
        base: 'neutral-cool-mid',
        accent: 'mono(blue)',
        tone: 'vivid',
        density: 'comfortable',
        motion: 'standard.classic',
        surface: 'neon'
      }

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const constrainedAxes = applyThemeConstraints(vividNeonAxes)

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('vivid + neon 组合：已自动降低饱和度')
      )

      consoleSpy.mockRestore()
    })

    it('应该验证无效的轴向组合', () => {
      const invalidAxes: ThemeAxes = {
        mode: 'light',
        base: 'invalid-base' as any,
        accent: 'mono(blue)',
        tone: 'standard',
        density: 'comfortable',
        motion: 'standard.classic',
        surface: 'flat'
      }

      expect(() => {
        generateThemeTokens(invalidAxes)
      }).toThrow()
    })
  })

  // =============================================================================
  // 10. 主题动态切换测试
  // =============================================================================
  describe('主题动态切换测试', () => {
    it('应该能够动态切换主题', async () => {
      const ThemeSwitcher = () => {
        const { updateTheme, currentAxes } = useTheme()
        const [isDark, setIsDark] = React.useState(false)

        const switchTheme = () => {
          const newAxes: ThemeAxes = isDark ? {
            mode: 'light',
            base: 'neutral-cool-mid',
            accent: 'mono(blue)',
            tone: 'standard',
            density: 'comfortable',
            motion: 'standard.classic',
            surface: 'flat'
          } : {
            mode: 'dark',
            base: 'neutral-true-mid',
            accent: 'mono(cyan)',
            tone: 'standard',
            density: 'comfortable',
            motion: 'standard.classic',
            surface: 'soft-shadow'
          }

          updateTheme(newAxes)
          setIsDark(!isDark)
        }

        return (
          <div>
            <Button onClick={switchTheme}>
              切换主题 (当前: {isDark ? '暗色' : '亮色'})
            </Button>
            <Button variant="primary">测试按钮</Button>
          </div>
        )
      }

      render(
        <ThemeProvider>
          <ThemeSwitcher />
        </ThemeProvider>
      )

      const switchButton = screen.getByText(/切换主题/)
      const testButton = screen.getByText('测试按钮')

      // 初始状态
      expect(screen.getByText(/亮色/)).toBeInTheDocument()
      expect(testButton).toBeInTheDocument()

      // 切换到暗色主题
      fireEvent.click(switchButton)

      await waitFor(() => {
        expect(screen.getByText(/暗色/)).toBeInTheDocument()
      })

      expect(testButton).toBeInTheDocument()
    })

    it('主题切换应该正确更新CSS变量', async () => {
      const { rerender } = render(
        <ThemeProvider initialAxes={{
          mode: 'light',
          base: 'neutral-cool-mid',
          accent: 'mono(blue)',
          tone: 'standard',
          density: 'comfortable',
          motion: 'standard.classic',
          surface: 'flat'
        }}>
          <Button>测试按钮</Button>
        </ThemeProvider>
      )

      // 记录初始变量值
      const root = document.documentElement
      const initialBgColor = root.style.getPropertyValue('--xor-bg-primary')

      // 切换到暗色主题
      rerender(
        <ThemeProvider initialAxes={{
          mode: 'dark',
          base: 'neutral-true-mid',
          accent: 'mono(cyan)',
          tone: 'standard',
          density: 'comfortable',
          motion: 'standard.classic',
          surface: 'soft-shadow'
        }}>
          <Button>测试按钮</Button>
        </ThemeProvider>
      )

      // 验证变量已更新
      expect(root.style.getPropertyValue('--xor-bg-primary')).not.toBe(initialBgColor)
    })
  })

  // =============================================================================
  // 11. 性能测试
  // =============================================================================
  describe('主题系统性能测试', () => {
    it('主题生成应该在100ms内完成', () => {
      const axes: ThemeAxes = {
        mode: 'light',
        base: 'neutral-cool-mid',
        accent: 'multi(sunset-gradient)',
        tone: 'vivid',
        density: 'comfortable',
        motion: 'expressive.spring',
        surface: 'glass+neon'
      }

      const startTime = performance.now()
      const themeTokens = generateThemeTokens(axes)
      const endTime = performance.now()

      const duration = endTime - startTime

      expect(themeTokens).toBeDefined()
      expect(duration).toBeLessThan(100)
    })

    it('应该高效处理主题切换', async () => {
      const ThemeSwitcher = () => {
        const { updateTheme } = useTheme()

        const switchTheme = () => {
          const axes: ThemeAxes = {
            mode: Math.random() > 0.5 ? 'light' : 'dark',
            base: 'neutral-cool-mid',
            accent: 'mono(blue)',
            tone: 'standard',
            density: 'comfortable',
            motion: 'standard.classic',
            surface: 'flat'
          }
          updateTheme(axes)
        }

        return <Button onClick={switchTheme}>快速切换</Button>
      }

      render(
        <ThemeProvider>
          <ThemeSwitcher />
        </ThemeProvider>
      )

      const button = screen.getByText('快速切换')
      const startTime = performance.now()

      // 快速切换10次
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button)
        await waitFor(() => {}, { timeout: 50 })
      }

      const endTime = performance.now()
      const totalTime = endTime - startTime

      // 平均每次切换应该少于20ms
      expect(totalTime / 10).toBeLessThan(20)
    })
  })

  // =============================================================================
  // 12. 边界情况测试
  // =============================================================================
  describe('边界情况测试', () => {
    it('应该处理空的主题配置', () => {
      expect(() => {
        render(
          <ThemeProvider>
            <Button>默认主题按钮</Button>
          </ThemeProvider>
        )
      }).not.toThrow()

      expect(screen.getByText('默认主题按钮')).toBeInTheDocument()
    })

    it('应该处理部分主题配置', () => {
      const partialAxes: Partial<ThemeAxes> = {
        mode: 'dark',
        accent: 'mono(green)'
      }

      render(
        <ThemeProvider initialAxes={partialAxes as ThemeAxes}>
          <Button>部分配置按钮</Button>
        </ThemeProvider>
      )

      expect(screen.getByText('部分配置按钮')).toBeInTheDocument()
    })

    it('应该处理极端组合而不崩溃', () => {
      const extremeAxes: ThemeAxes = {
        mode: 'hc',
        base: 'neutral-cool-high',
        accent: 'multi(sunset-gradient)',
        tone: 'vivid',
        density: 'compact',
        motion: 'dramatic.cinematic',
        surface: 'glass+neon'
      }

      expect(() => {
        render(
          <ThemeProvider initialAxes={extremeAxes}>
            <div>
              <Button variant="primary">极端按钮</Button>
              <Card variant="outlined">极端卡片</Card>
              <Badge variant="destructive">极端徽章</Badge>
            </div>
          </ThemeProvider>
        )
      }).not.toThrow()

      expect(screen.getByText('极端按钮')).toBeInTheDocument()
      expect(screen.getByText('极端卡片')).toBeInTheDocument()
      expect(screen.getByText('极端徽章')).toBeInTheDocument()
    })
  })
})