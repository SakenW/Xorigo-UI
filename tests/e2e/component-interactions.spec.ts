/**
 * @fileoverview E2E 测试 - 组件交互
 * @description 验证关键用户流程的端到端测试
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-05
 */

import { test, expect } from '@playwright/test'

test.describe('组件交互 E2E 测试', () => {
  test.describe('表单提交流程', () => {
    test('应该能够完整填写并提交表单', async ({ page }) => {
      await page.goto('/components/form')

      // 填写用户名
      await page.fill('[data-testid="username-input"]', 'testuser')

      // 填写邮箱
      await page.fill('[data-testid="email-input"]', 'test@example.com')

      // 填写密码
      await page.fill('[data-testid="password-input"]', 'password123')

      // 点击提交按钮
      await page.click('[data-testid="submit-button"]')

      // 验证提交成功
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    })

    test('应该在表单验证失败时显示错误', async ({ page }) => {
      await page.goto('/components/form')

      // 直接提交空表单
      await page.click('[data-testid="submit-button"]')

      // 验证显示验证错误
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    })
  })

  test.describe('主题切换流程', () => {
    test('应该能够在所有主题间切换', async ({ page }) => {
      await page.goto('/recipes')

      const themes = ['midnight', 'ocean', 'forest', 'graphite', 'sunset']

      for (const theme of themes) {
        await page.click(`[data-theme="${theme}"]`)
        
        // 验证主题应用
        const body = page.locator('body')
        await expect(body).toHaveAttribute('data-theme', theme)
      }
    })
  })

  test.describe('组件交互流程', () => {
    test('应该能够使用 Tabs 组件', async ({ page }) => {
      await page.goto('/components/tabs')

      // 点击第二个标签
      await page.click('[role="tab"][value="tab2"]')

      // 验证内容切换
      await expect(page.locator('[role="tabpanel"]')).toContainText('内容2')

      // 点击第三个标签
      await page.click('[role="tab"][value="tab3"]')

      // 验证内容切换
      await expect(page.locator('[role="tabpanel"]')).toContainText('内容3')
    })

    test('应该能够使用模态框组件', async ({ page }) => {
      await page.goto('/components/modal')

      // 打开模态框
      await page.click('[data-testid="open-modal"]')

      // 验证模态框显示
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      // 关闭模态框
      await page.click('[data-testid="close-modal"]')

      // 验证模态框隐藏
      await expect(page.locator('[role="dialog"]')).toBeHidden()
    })
  })
})
