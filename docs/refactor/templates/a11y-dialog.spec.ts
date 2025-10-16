// Dialog 组件 a11y 测试模板
import { test, expect } from '@playwright/test'
import { analyze } from '@axe-core/playwright'

test.describe('Dialog a11y 基线测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=components-dialog--primary')
  })

  test('should have no accessibility violations when closed', async ({ page }) => {
    // 初始状态：对话框关闭
    const accessibilityScanResults = await analyze(page, {
      reporter: 'v2',
      includedImpacts: ['minor', 'moderate', 'serious', 'critical']
    })

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have no accessibility violations when open', async ({ page }) => {
    // 打开对话框
    await page.click('[data-testid="dialog-trigger"]')
    await page.waitForSelector('[role="dialog"]')

    // 运行 axe 分析
    const accessibilityScanResults = await analyze(page, {
      reporter: 'v2',
      includedImpacts: ['minor', 'moderate', 'serious', 'critical']
    })

    expect(accessibilityScanResults.violations).toEqual([])

    // 验证关键 a11y 属性
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(dialog).toBeVisible()
  })

  test('should support keyboard navigation - Tab and Shift+Tab', async ({ page }) => {
    await page.click('[data-testid="dialog-trigger"]')
    await page.waitForSelector('[role="dialog"]')

    // Focus 应该在对话框内的第一个可聚焦元素
    await expect(page.locator('[data-testid="dialog-close"]')).toBeFocused()

    // Tab 键导航
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="dialog-confirm"]')).toBeFocused()

    // Shift+Tab 反向导航
    await page.keyboard.press('Shift+Tab')
    await expect(page.locator('[data-testid="dialog-close"]')).toBeFocused()
  })

  test('should support keyboard activation - Enter and Space', async ({ page }) => {
    // 使用 Enter 键打开对话框
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // 使用 Space 键关闭对话框
    await page.keyboard.press('Tab') // 聚焦到关闭按钮
    await page.keyboard.press('Space')
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
  })

  test('should support Escape key to close dialog', async ({ page }) => {
    await page.click('[data-testid="dialog-trigger"]')
    await page.waitForSelector('[role="dialog"]')

    // 使用 Escape 键关闭对话框
    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()

    // Focus 应该返回到触发按钮
    await expect(page.locator('[data-testid="dialog-trigger"]')).toBeFocused()
  })

  test('should trap focus within dialog', async ({ page }) => {
    await page.click('[data-testid="dialog-trigger"]')
    await page.waitForSelector('[role="dialog"]')

    // 获取对话框内所有可聚焦元素
    const focusableElements = await page.locator(
      '[role="dialog"] button, [role="dialog"] input, [role="dialog"] select, [role="dialog"] textarea, [role="dialog"] [tabindex]:not([tabindex="-1"])'
    ).count()

    expect(focusableElements).toBeGreaterThan(0)

    // 焦点应该在对话框内循环
    await page.keyboard.press('Tab') // 移动到最后一个元素
    await page.keyboard.press('Tab') // 应该回到第一个元素
    await expect(page.locator('[data-testid="dialog-close"]')).toBeFocused()
  })

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.click('[data-testid="dialog-trigger"]')
    await page.waitForSelector('[role="dialog"]')

    const dialog = page.locator('[role="dialog"]')

    // 检查必要的 ARIA 属性
    await expect(dialog).toHaveAttribute('aria-modal', 'true')

    // 检查是否有适当的标签
    const hasLabel = await dialog.getAttribute('aria-label') ||
                     await dialog.getAttribute('aria-labelledby')
    expect(hasLabel).toBeTruthy()

    // 检查对话框的可见性
    await expect(dialog).toBeVisible()
  })

  test('should handle overlay click properly', async ({ page }) => {
    await page.click('[data-testid="dialog-trigger"]')
    await page.waitForSelector('[role="dialog"]')

    // 点击背景遮罩（如果有的话）
    const overlay = page.locator('[data-testid="dialog-overlay"]')
    if (await overlay.isVisible()) {
      await overlay.click()
      await expect(page.locator('[role="dialog"]')).not.toBeVisible()
    }
  })

  test('should maintain proper focus management', async ({ page }) => {
    // 记录打开前的焦点元素
    const triggerButton = page.locator('[data-testid="dialog-trigger"]')
    await triggerButton.focus()

    // 打开对话框
    await triggerButton.click()
    await page.waitForSelector('[role="dialog"]')

    // 关闭对话框
    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()

    // 验证焦点是否返回到触发按钮
    await expect(triggerButton).toBeFocused()
  })

  test('should be accessible with screen readers', async ({ page }) => {
    await page.click('[data-testid="dialog-trigger"]')
    await page.waitForSelector('[role="dialog"]')

    // 检查对话框的语义标记
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toHaveAttribute('role', 'dialog')

    // 检查标题的存在
    const title = page.locator('[data-testid="dialog-title"]')
    await expect(title).toBeVisible()

    // 检查描述的存在（如果有）
    const description = page.locator('[data-testid="dialog-description"]')
    if (await description.isVisible()) {
      await expect(dialog).toHaveAttribute('aria-describedby', description.getAttribute('id'))
    }
  })
})