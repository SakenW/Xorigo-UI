// Button 组件视觉回归测试模板
import { test, expect } from '@playwright/test'

test.describe('Button visual regression tests', () => {
  const variants = ['primary', 'secondary', 'outline-solid', 'destructive', 'ghost', 'link']
  const sizes = ['sm', 'md', 'lg']
  const states = ['default', 'hover', 'focus', 'active', 'disabled']

  test.beforeEach(async ({ page }) => {
    // 设置视口大小，确保一致性
    await page.setViewportSize({ width: 1280, height: 720 })
  })

  variants.forEach(variant => {
    sizes.forEach(size => {
      test(`Button ${variant} ${size} - default state`, async ({ page }) => {
        await page.goto(`/iframe.html?id=components-button--${variant}&args=size:${size}`)

        // 等待组件完全加载
        await page.waitForSelector('button')

        // 等待字体加载完成
        await page.waitForLoadState('networkidle')

        // 截图对比
        await expect(page.locator('button')).toHaveScreenshot(
          `button-${variant}-${size}-default.png`,
          {
            animations: 'disabled',
            caret: 'hide',
            scale: 'css',
          }
        )
      })

      test(`Button ${variant} ${size} - hover state`, async ({ page }) => {
        await page.goto(`/iframe.html?id=components-button--${variant}&args=size:${size}`)

        const button = page.locator('button')
        await button.waitFor()

        // 模拟鼠标悬停
        await button.hover()

        // 等待过渡动画完成
        await page.waitForTimeout(300)

        await expect(button).toHaveScreenshot(
          `button-${variant}-${size}-hover.png`,
          {
            animations: 'disabled',
            caret: 'hide',
            scale: 'css',
          }
        )
      })

      test(`Button ${variant} ${size} - focus state`, async ({ page }) => {
        await page.goto(`/iframe.html?id=components-button--${variant}&args=size:${size}`)

        const button = page.locator('button')
        await button.waitFor()

        // 使用键盘聚焦
        await button.focus()

        // 等待焦点样式渲染
        await page.waitForTimeout(100)

        await expect(button).toHaveScreenshot(
          `button-${variant}-${size}-focus.png`,
          {
            animations: 'disabled',
            caret: 'hide',
            scale: 'css',
          }
        )
      })

      test(`Button ${variant} ${size} - active state`, async ({ page }) => {
        await page.goto(`/iframe.html?id=components-button--${variant}&args=size:${size}`)

        const button = page.locator('button')
        await button.waitFor()

        // 模拟鼠标按下（激活状态）
        await button.hover()
        await page.mouse.down()

        await page.waitForTimeout(100)

        await expect(button).toHaveScreenshot(
          `button-${variant}-${size}-active.png`,
          {
            animations: 'disabled',
            caret: 'hide',
            scale: 'css',
          }
        )

        // 释放鼠标
        await page.mouse.up()
      })

      if (variant !== 'destructive') {
        test(`Button ${variant} ${size} - disabled state`, async ({ page }) => {
          await page.goto(`/iframe.html?id=components-button--${variant}&args=size:${size},disabled:true`)

          const button = page.locator('button:disabled')
          await button.waitFor()

          await expect(button).toHaveScreenshot(
            `button-${variant}-${size}-disabled.png`,
            {
              animations: 'disabled',
              caret: 'hide',
              scale: 'css',
            }
          )
        })
      }
    })
  })

  test('Button with loading state', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary&args=loading:true')

    const button = page.locator('button')
    await button.waitFor()

    // 等待加载动画开始
    await page.waitForTimeout(200)

    await expect(button).toHaveScreenshot(
      'button-primary-loading.png',
      {
        animations: 'disabled',
        caret: 'hide',
        scale: 'css',
      }
    )
  })

  test('Button with icon', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary&args=icon:true')

    const button = page.locator('button')
    await button.waitFor()

    await expect(button).toHaveScreenshot(
      'button-primary-with-icon.png',
      {
        animations: 'disabled',
        caret: 'hide',
        scale: 'css',
      }
    )
  })

  test('Button with long text', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary&args=children:This is a very long button text that should wrap or truncate properly')

    const button = page.locator('button')
    await button.waitFor()

    await expect(button).toHaveScreenshot(
      'button-primary-long-text.png',
      {
        animations: 'disabled',
        caret: 'hide',
        scale: 'css',
      }
    )
  })

  // 响应式测试
  ['mobile', 'tablet', 'desktop'].forEach(viewport => {
    const viewportSizes = {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1280, height: 720 }
    }

    test(`Button responsive layout - ${viewport}`, async ({ page }) => {
      await page.setViewportSize(viewportSizes[viewport])
      await page.goto('/iframe.html?id=components-button--primary&args=children:Responsive Button')

      const button = page.locator('button')
      await button.waitFor()

      await expect(button).toHaveScreenshot(
        `button-primary-responsive-${viewport}.png`,
        {
          animations: 'disabled',
          caret: 'hide',
          scale: 'css',
          fullPage: false,
        }
      )
    })
  })

  // 高对比度模式测试
  test('Button in high contrast mode', async ({ page }) => {
    // 模拟高对比度模式
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' })
    await page.goto('/iframe.html?id=components-button--primary')

    const button = page.locator('button')
    await button.waitFor()

    await expect(button).toHaveScreenshot(
      'button-primary-high-contrast.png',
      {
        animations: 'disabled',
        caret: 'hide',
        scale: 'css',
      }
    )
  })

  // 动画状态测试（在动画禁用的情况下）
  test('Button animation states', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary')

    const button = page.locator('button')
    await button.waitFor()

    // 测试快速连续状态变化
    await button.hover()
    await page.waitForTimeout(50)
    await button.focus()
    await page.waitForTimeout(50)

    await expect(button).toHaveScreenshot(
      'button-primary-interactive-state.png',
      {
        animations: 'disabled',
        caret: 'hide',
        scale: 'css',
      }
    )
  })

  // 多个按钮组合测试
  test('Button group layout', async ({ page }) => {
    await page.goto('/iframe.html?id=components-buttongroup--default')

    const buttonGroup = page.locator('[data-testid="button-group"]')
    await buttonGroup.waitFor()

    await expect(buttonGroup).toHaveScreenshot(
      'button-group-layout.png',
      {
        animations: 'disabled',
        caret: 'hide',
        scale: 'css',
      }
    )
  })
})