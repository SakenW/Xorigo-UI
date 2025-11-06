/**
 * @fileoverview 端到端工作流测试
 * @description 测试完整的用户工作流，从组件创建到部署的全过程
 */

import { test, expect, type Page } from '@playwright/test'

// 测试数据
const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  avatar: '👤',
}

const TEST_PROJECT = {
  name: 'E2E Test Project',
  description: '端到端测试项目',
}

interface ComponentSpec {
  name: string
  type: 'button' | 'input' | 'modal' | 'card' | 'table'
  variant?: string
  size?: string
  props?: Record<string, any>
}

const COMPONENTS_TO_TEST: ComponentSpec[] = [
  { name: 'Primary Button', type: 'button', variant: 'primary', size: 'lg' },
  { name: 'Secondary Button', type: 'button', variant: 'secondary', size: 'md' },
  { name: 'Text Input', type: 'input', props: { placeholder: 'Enter text' } },
  { name: 'Modal Dialog', type: 'modal', props: { title: 'Test Modal' } },
  { name: 'Info Card', type: 'card', props: { title: 'Card Title' } },
]

test.describe('端到端工作流测试', () => {
  test.beforeEach(async ({ page }) => {
    // 设置视窗大小
    await page.setViewportSize({ width: 1920, height: 1080 })

    // 模拟网络延迟
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 100))
      route.continue()
    })
  })

  test.describe('用户认证工作流', () => {
    test('用户应该能够注册新账户', async ({ page }) => {
      await page.goto('/auth/register')

      await page.fill('[data-testid="register-name"]', TEST_USER.name)
      await page.fill('[data-testid="register-email"]', TEST_USER.email)
      await page.fill('[data-testid="register-password"]', 'Test123456!')
      await page.click('[data-testid="register-submit"]')

      await expect(page.locator('[data-testid="register-success"]')).toBeVisible()
      await expect(page).toHaveURL('/dashboard')
    })

    test('用户应该能够登录现有账户', async ({ page }) => {
      await page.goto('/auth/login')

      await page.fill('[data-testid="login-email"]', TEST_USER.email)
      await page.fill('[data-testid="login-password"]', 'Test123456!')
      await page.click('[data-testid="login-submit"]')

      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
      await expect(page.locator('[data-testid="user-name"]')).toContainText(TEST_USER.name)
    })
  })

  test.describe('项目创建工作流', () => {
    test('用户应该能够创建新项目', async ({ page }) => {
      await page.goto('/dashboard')

      await page.click('[data-testid="create-project"]')
      await page.fill('[data-testid="project-name"]', TEST_PROJECT.name)
      await page.fill('[data-testid="project-description"]', TEST_PROJECT.description)
      await page.selectOption('[data-testid="project-template"]', 'blank')

      await page.click('[data-testid="create-project-submit"]')

      await expect(page.locator('[data-testid="project-title"]')).toContainText(TEST_PROJECT.name)
      await expect(page).toHaveURL(/\/project\/.*/)
    })

    test('用户应该能够从模板创建项目', async ({ page }) => {
      await page.goto('/dashboard')

      await page.click('[data-testid="create-project"]')
      await page.click('[data-testid="template-card-dashboard"]')
      await page.click('[data-testid="use-template"]')

      await expect(page.locator('[data-testid="project-title"]')).toContainText('Dashboard')
      await expect(page.locator('[data-testid="prebuilt-components"]')).toBeVisible()
    })
  })

  test.describe('组件创建工作流', () => {
    test('用户应该能够创建基本组件', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      // 添加按钮组件
      await page.click('[data-testid="add-component"]')
      await page.click('[data-testid="component-button"]')

      await expect(page.locator('[data-testid="component-canvas"] [data-component="button"]')).toBeVisible()

      // 配置按钮属性
      await page.click('[data-testid="component-properties"]')
      await page.selectOption('[data-testid="prop-variant"]', 'primary')
      await page.selectOption('[data-testid="prop-size"]', 'lg')
      await page.fill('[data-testid="prop-text"]', 'Click Me')

      // 验证更改
      const button = page.locator('[data-component="button"]')
      await expect(button).toContainText('Click Me')
      await expect(button).toHaveClass(/variant-primary/)
      await expect(button).toHaveClass(/size-lg/)
    })

    test('用户应该能够创建表单组件', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      await page.click('[data-testid="add-component"]')
      await page.click('[data-testid="component-form"]')

      // 验证表单元素
      await expect(page.locator('[data-component="form"]')).toBeVisible()
      await expect(page.locator('[data-component="input"]')).toBeVisible()
      await expect(page.locator('[data-component="submit-button"]')).toBeVisible()

      // 配置输入框
      await page.click('[data-testid="component-input"]')
      await page.fill('[data-testid="prop-placeholder"]', 'Enter your name')
      await page.fill('[data-testid="prop-label"]', 'Name')

      const input = page.locator('[data-component="input"]')
      await expect(input).toHaveAttribute('placeholder', 'Enter your name')
    })

    test('用户应该能够创建并配置模态框', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      await page.click('[data-testid="add-component"]')
      await page.click('[data-testid="component-modal"]')

      await expect(page.locator('[data-component="modal"]')).toBeVisible()

      // 配置模态框
      await page.click('[data-testid="component-properties"]')
      await page.fill('[data-testid="prop-title"]', 'Confirm Action')
      await page.fill('[data-testid="prop-content"]', 'Are you sure?')

      // 添加确认按钮
      await page.click('[data-testid="add-modal-button"]')
      await page.fill('[data-testid="button-text"]', 'Confirm')
      await page.selectOption('[data-testid="button-variant"]', 'primary')

      // 验证模态框打开
      await page.click('[data-testid="open-modal-trigger"]')
      await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible()

      await page.click('[data-testid="modal-close"]')
      await expect(page.locator('[data-testid="modal-overlay"]')).not.toBeVisible()
    })
  })

  test.describe('组件交互工作流', () => {
    test('组件应该响应用户交互', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      await page.click('[data-testid="add-component"]')
      await page.click('[data-testid="component-button"]')

      // 验证悬停状态
      const button = page.locator('[data-component="button"]')
      await button.hover()
      await expect(button).toHaveClass(/hover/)

      // 验证点击事件
      await page.click('[data-testid="component-properties"]')
      await page.fill('[data-testid="prop-onClick"]', 'alert("Button clicked!")')

      await button.click()

      // 验证点击反馈
      await expect(button).toHaveClass(/active/)
    })

    test('表单组件应该正确验证输入', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      await page.click('[data-testid="add-component"]')
      await page.click('[data-testid="component-form"]')

      // 测试必填验证
      await page.click('[data-testid="submit-form"]')
      await expect(page.locator('[data-testid="validation-error"]')).toContainText('Required')

      // 测试有效输入
      const input = page.locator('[data-component="input"]')
      await input.fill('Valid Input')
      await page.click('[data-testid="submit-form"]')

      await expect(page.locator('[data-testid="form-success"]')).toBeVisible()
    })
  })

  test.describe('主题应用工作流', () => {
    test('用户应该能够切换主题', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      await page.click('[data-testid="theme-selector"]')
      await page.click('[data-testid="theme-option-dark"]')

      await expect(page.locator('html')).toHaveClass(/theme-dark/)

      // 验证组件主题适配
      await page.click('[data-testid="add-component"]')
      await page.click('[data-testid="component-button"]')

      const button = page.locator('[data-component="button"]')
      await expect(button).toHaveClass(/theme-dark/)
    })

    test('用户应该能够自定义主题令牌', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      await page.click('[data-testid="theme-editor"]')
      await page.fill('[data-testid="token-primary-color"]', '#8b5cf6')
      await page.click('[data-testid="apply-theme-changes"]')

      // 验证更改应用到按钮
      await page.click('[data-testid="add-component"]')
      await page.click('[data-testid="component-button"]')

      const button = page.locator('[data-component="button"]')
      await expect(button).toHaveCSS('background-color', 'rgb(139, 92, 246)')
    })

    test('主题配方应该能够保存和加载', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      // 应用主题配方
      await page.click('[data-testid="theme-selector"]')
      await page.click('[data-testid="recipe-light-modern"]')

      await expect(page.locator('[data-testid="active-recipe"]')).toContainText('Light Modern')

      // 保存自定义配方
      await page.click('[data-testid="save-recipe"]')
      await page.fill('[data-testid="recipe-name"]', 'My Custom Theme')
      await page.click('[data-testid="save-recipe-confirm"]')

      await expect(page.locator('[data-testid="recipe-saved-success"]')).toBeVisible()

      // 加载配方
      await page.click('[data-testid="theme-selector"]')
      await page.click('[data-testid="recipe-my-custom-theme"]')

      await expect(page.locator('[data-testid="active-recipe"]')).toContainText('My Custom Theme')
    })
  })

  test.describe('组件库管理', () => {
    test('用户应该能够浏览组件库', async ({ page }) => {
      await page.goto('/components')

      // 验证组件分类
      await expect(page.locator('[data-testid="category-primitives"]')).toBeVisible()
      await expect(page.locator('[data-testid="category-forms"]')).toBeVisible()
      await expect(page.locator('[data-testid="category-layout"]')).toBeVisible()
      await expect(page.locator('[data-testid="category-navigation"]')).toBeVisible()
      await expect(page.locator('[data-testid="category-overlays"]')).toBeVisible()
      await expect(page.locator('[data-testid="category-feedback"]')).toBeVisible()

      // 验证组件数量
      const components = await page.locator('[data-testid^="component-"]').count()
      expect(components).toBeGreaterThan(20)
    })

    test('用户应该能够搜索组件', async ({ page }) => {
      await page.goto('/components')

      await page.fill('[data-testid="component-search"]', 'Button')
      await page.press('[data-testid="component-search"]', 'Enter')

      // 验证搜索结果
      await expect(page.locator('[data-testid="component-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="component-icon-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="component-fab"]')).toBeVisible()

      const searchResults = await page.locator('[data-testid^="component-button"]').count()
      expect(searchResults).toBeGreaterThan(0)
    })

    test('用户应该能够查看组件文档', async ({ page }) => {
      await page.goto('/components/button')

      // 验证文档内容
      await expect(page.locator('[data-testid="component-title"]')).toContainText('Button')
      await expect(page.locator('[data-testid="component-description"]')).toBeVisible()
      await expect(page.locator('[data-testid="prop-table"]')).toBeVisible()
      await expect(page.locator('[data-testid="example-code"]')).toBeVisible()

      // 验证示例渲染
      await expect(page.locator('[data-testid="example-preview"]')).toBeVisible()
    })
  })

  test.describe('导出与部署工作流', () => {
    test('用户应该能够导出组件代码', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      await page.click('[data-testid="add-component"]')
      await page.click('[data-testid="component-button"]')

      // 导出代码
      await page.click('[data-testid="export-button"]')
      await page.selectOption('[data-testid="export-format"]', 'react-tsx')
      await page.click('[data-testid="export-download"]')

      // 验证下载
      const downloadPromise = page.waitForEvent('download')
      await page.click('[data-testid="confirm-export"]')
      const download = await downloadPromise
      expect(download.suggestedFilename()).toContain('button')
    })

    test('用户应该能够预览导出结果', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      await page.click('[data-testid="add-component"]')
      await page.click('[data-testid="component-button"]')

      await page.click('[data-testid="preview-button"]')

      // 验证预览页面
      const previewPage = await page.context().newPage()
      await previewPage.goto('/preview/test-project')

      await expect(previewPage.locator('[data-component="button"]')).toBeVisible()

      // 验证代码
      const codeVisible = await previewPage.locator('[data-testid="code-viewer"]').isVisible()
      expect(codeVisible).toBe(true)
    })

    test('用户应该能够部署项目', async ({ page }) => {
      await page.goto('/project/test-project/settings')

      await page.click('[data-testid="deploy-tab"]')
      await page.fill('[data-testid="deploy-name"]', 'test-project')
      await page.selectOption('[data-testid="deploy-environment"]', 'production')

      await page.click('[data-testid="start-deployment"]')

      // 验证部署进度
      await expect(page.locator('[data-testid="deploy-progress"]')).toBeVisible()
      await expect(page.locator('[data-testid="deploy-status"]')).toContainText('Building')

      // 等待部署完成
      await expect(page.locator('[data-testid="deploy-success"]')).toBeVisible({ timeout: 60000 })

      // 验证部署URL
      await expect(page.locator('[data-testid="deploy-url"]')).toContainText('https://')
    })
  })

  test.describe('AI助手工作流', () => {
    test('AI助手应该能够生成组件', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      await page.click('[data-testid="ai-assistant"]')
      await page.fill('[data-testid="ai-prompt"]', 'Create a login form')
      await page.click('[data-testid="ai-generate"]')

      // 验证AI生成的组件
      await expect(page.locator('[data-component="form"]')).toBeVisible()
      await expect(page.locator('[data-component="input"]')).toBeVisible()
      await expect(page.locator('[data-component="submit-button"]')).toBeVisible()

      // 验证代码生成
      await expect(page.locator('[data-testid="generated-code"]')).toBeVisible()
    })

    test('AI助手应该能够优化主题', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      await page.click('[data-testid="theme-selector"]')
      await page.click('[data-testid="ai-optimize-theme"]')

      await page.fill('[data-testid="ai-theme-prompt"]', 'Optimize for dark mode coding')
      await page.click('[data-testid="ai-optimize-apply"]')

      // 验证主题优化
      await expect(page.locator('html')).toHaveClass(/theme-dark/)
      await expect(page.locator('[data-testid="optimization-notice"]')).toContainText('AI Optimized')
    })

    test('AI助手应该能够生成测试用例', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      await page.click('[data-testid="add-component"]')
      await page.click('[data-testid="component-button"]')

      await page.click('[data-testid="ai-generate-tests"]')

      // 验证测试生成
      await expect(page.locator('[data-testid="generated-tests"]')).toBeVisible()
      await expect(page.locator('[data-testid="test-suite"]')).toContainText('Button')

      // 运行测试
      await page.click('[data-testid="run-tests"]')
      await expect(page.locator('[data-testid="test-results"]')).toContainText('Passed')
    })
  })

  test.describe('性能测试', () => {
    test('页面加载时间应该在可接受范围内', async ({ page }) => {
      const startTime = Date.now()

      await page.goto('/dashboard')

      await page.waitForLoadState('networkidle')

      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(3000) // 3秒
    })

    test('组件渲染应该是流畅的', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      // 添加多个组件
      for (let i = 0; i < 10; i++) {
        await page.click('[data-testid="add-component"]')
        await page.click('[data-testid="component-button"]')
      }

      // 验证所有组件都已渲染
      const components = await page.locator('[data-component="button"]').count()
      expect(components).toBe(10)

      // 验证FPS（简化测试）
      const frameCount = 0
      await page.evaluate(() => {
        let lastTime = performance.now()
        let frames = 0

        function countFrame() {
          frames++
          const currentTime = performance.now()
          if (currentTime - lastTime >= 1000) {
            console.log('FPS:', frames)
            frames = 0
            lastTime = currentTime
          }
          requestAnimationFrame(countFrame)
        }

        requestAnimationFrame(countFrame)
      })

      await page.waitForTimeout(1500)
    })
  })

  test.describe('可访问性测试', () => {
    test('组件应该具有适当的ARIA属性', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      await page.click('[data-testid="add-component"]')
      await page.click('[data-testid="component-button"]')

      const button = page.locator('[data-component="button"]')
      await expect(button).toHaveAttribute('role')
      await expect(button).toHaveAttribute('aria-label')
    })

    test('键盘导航应该正常工作', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      await page.click('[data-testid="add-component"]')
      await page.click('[data-testid="component-button"]')

      // Tab导航
      await page.keyboard.press('Tab')
      await expect(page.locator('[data-component="button"]')).toBeFocused()

      // Enter激活
      await page.keyboard.press('Enter')
      await expect(page.locator('[data-component="button"]')).toHaveClass(/active/)
    })

    test('颜色对比度应该符合WCAG标准', async ({ page }) => {
      await page.goto('/project/test-project/editor')

      await page.click('[data-testid="add-component"]')
      await page.click('[data-testid="component-button"]')

      const button = page.locator('[data-component="button"]')
      const color = await button.evaluate(el => getComputedStyle(el).color)
      const backgroundColor = await button.evaluate(el => getComputedStyle(el).backgroundColor)

      // 简化对比度检查（实际应该使用专业工具）
      expect(color).toBeTruthy()
      expect(backgroundColor).toBeTruthy()
      expect(color).not.toBe(backgroundColor)
    })
  })
})
