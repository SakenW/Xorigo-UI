---
name: "Xorigo UI 测试自动化器"
description: "自动化管理 Xorigo UI 项目的测试流程，包括单元测试、集成测试、可访问性测试和视觉回归测试"
author: "Xorigo UI Team"
version: "2025.11.05"
tags: ["testing", "automation", "vitest", "playwright", "accessibility", "visual-regression"]
---

# Xorigo UI 测试自动化器

这个 Skill 专门用于自动化管理 Xorigo UI 项目的测试流程，确保组件库的质量和可靠性。

## 测试类型

### 🧪 单元测试 (Vitest)
- **组件渲染测试** - 验证组件正确渲染
- **Props 传递测试** - 测试属性传递和处理
- **事件处理测试** - 验证用户交互事件
- **边界情况测试** - 测试异常输入和边界值
- **快照测试** - 组件输出快照对比

### 🎭 可访问性测试 (axe-core)
- **WCAG 2.1 AA 合规** - 验证可访问性标准
- **键盘导航测试** - 测试键盘操作支持
- **屏幕阅读器测试** - 验证屏幕阅读器兼容性
- **颜色对比度测试** - 检查文本和背景对比度
- **ARIA 属性验证** - 验证 ARIA 标签和属性

### 🌐 端到端测试 (Playwright)
- **用户流程测试** - 完整的用户操作流程
- **跨浏览器测试** - Chrome、Firefox、Safari 兼容性
- **响应式设计测试** - 移动端、平板、桌面适配
- **主题切换测试** - 10 种主题下的功能验证
- **性能测试** - 加载时间和交互性能

### 📸 视觉回归测试
- **组件截图对比** - 像素级别的视觉对比
- **多主题截图** - 所有主题下的视觉一致性
- **响应式截图** - 不同屏幕尺寸的视觉验证
- **交互状态截图** - hover、focus、disabled 等状态
- **跨浏览器视觉** - 不同浏览器下的视觉一致性

## 使用方法

对我说：
- "运行 Button 组件的所有测试"
- "执行可访问性测试"
- "运行视觉回归测试"
- "测试主题兼容性"
- "生成测试报告"
- "检查测试覆盖率"

## 支持的测试操作

### 🟢 基础测试

**组件单元测试**：
> "运行 Button 组件的单元测试"
> "测试所有核心组件"
> "执行快照测试"

**可访问性测试**：
> "运行可访问性测试"
> "检查 WCAG 合规性"
> "测试键盘导航"

**集成测试**：
> "运行端到端测试"
> "测试用户登录流程"
> "验证表单提交功能"

### 🔍 高级测试

**主题兼容性测试**：
> "测试所有主题下的组件表现"
> "验证主题切换功能"
> "检查深色主题适配"

**视觉回归测试**：
> "运行视觉回归测试"
> "对比组件截图"
> "检查设计一致性"

**性能测试**：
> "测试组件渲染性能"
> "检查主题切换性能"
> "分析加载时间"

### 📊 测试分析和报告

**测试覆盖率**：
> "检查测试覆盖率"
> "生成覆盖率报告"
> "找出未测试的代码"

**测试报告**：
> "生成测试报告"
> "分析测试结果"
> "总结测试问题"

## 测试配置

### 📦 测试框架配置

**Vitest 配置**：
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

**Playwright 配置**：
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run docker:test',
    port: 3100,
  }
})
```

### 🎨 主题测试配置

```typescript
// tests/setup/theme-test.ts
const themes = [
  'midnight', 'ocean', 'forest', 'graphite',
  'sunset', 'lavender', 'cherry', 'pearl',
  'golden', 'crystal'
]

export const testThemes = (testName: string, testFn: (theme: string) => void) => {
  themes.forEach(theme => {
    test(`${testName} - ${theme} theme`, () => testFn(theme))
  })
}
```

## 测试模板

### 🧪 单元测试模板

```typescript
// tests/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@xorigo-ui/core'

describe('Button', () => {
  // 基础渲染测试
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  // Props 测试
  it('applies variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary-500')
  })

  // 事件测试
  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  // 可访问性测试
  it('supports keyboard navigation', () => {
    render(<Button>Submit</Button>)
    const button = screen.getByRole('button')

    button.focus()
    expect(button).toHaveFocus()

    fireEvent.keyDown(button, { key: 'Enter' })
    // 验证键盘交互
  })
})
```

### 🌐 可访问性测试模板

```typescript
// tests/accessibility/button-accessibility.test.tsx
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from '@xorigo-ui/core'

expect.extend(toHaveNoViolations)

describe('Button Accessibility', () => {
  testThemes('should not have accessibility violations', async (theme) => {
    const { container } = render(
      <div data-theme={theme}>
        <Button>Accessible Button</Button>
      </div>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have proper ARIA attributes', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')

    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAttribute('disabled')
  })
})
```

### 📸 视觉回归测试模板

```typescript
// tests/visual/button-visual.test.ts
import { test, expect } from '@playwright/test'

test.describe('Button Visual Tests', () => {
  const themes = [
    'midnight', 'ocean', 'forest', 'graphite',
    'sunset', 'lavender', 'cherry', 'pearl',
    'golden', 'crystal'
  ]

  themes.forEach(theme => {
    test.describe(`${theme} theme`, () => {
      test('button default state', async ({ page }) => {
        await page.goto(`/components/button?theme=${theme}`)
        const button = page.locator('[data-testid="button-default"]')

        await expect(button).toHaveScreenshot(`button-default-${theme}.png`)
      })

      test('button hover state', async ({ page }) => {
        await page.goto(`/components/button?theme=${theme}`)
        const button = page.locator('[data-testid="button-default"]')

        await button.hover()
        await expect(button).toHaveScreenshot(`button-hover-${theme}.png`)
      })

      test('button variants', async ({ page }) => {
        await page.goto(`/components/button?theme=${theme}`)

        for (const variant of ['primary', 'secondary', 'outline', 'ghost']) {
          const button = page.locator(`[data-testid="button-${variant}"]`)
          await expect(button).toHaveScreenshot(`button-${variant}-${theme}.png`)
        }
      })
    })
  })
})
```

## 测试报告

### 📊 覆盖率报告

```
📊 测试覆盖率报告
====================
文件路径: src/components/Button.tsx
行覆盖率: 95% (19/20)
函数覆盖率: 100% (5/5)
分支覆盖率: 88% (7/8)
语句覆盖率: 95% (19/20)

未覆盖的代码:
  第 45 行: return null  // 异常分支

建议:
- 添加异常情况的测试用例
- 提高分支覆盖率到 100%
```

### 🎯 可访问性报告

```
♿ 可访问性测试报告
====================
总组件数: 15
通过测试: 13
失败组件: 2

❌ 发现的问题:
1. Button 组件 - 缺少 focus-visible 样式
   - 严重级别: 中等
   - 修复建议: 添加 :focus-visible 样式

2. Modal 组件 - 缺少 trap-focus
   - 严重级别: 高
   - 修复建议: 实现焦点陷阱功能

✅ 优秀的组件:
- Card 组件 - 完全符合 WCAG 标准
- Input 组件 - 键盘导航支持良好
- Avatar 组件 - ARIA 标签完整
```

### 📸 视觉回归报告

```
👁️ 视觉回归测试报告
====================
总截图数: 150
对比通过: 148
对比失败: 2

❌ 发现的差异:
1. Button/primary/midnight theme
   - 差异类型: 颜色偏移
   - 差异程度: 0.5%
   - 可能原因: 主题令牌更新

2. Modal/default/ocean theme
   - 差异类型: 阴影变化
   - 差异程度: 1.2%
   - 可能原因: 阴影令牌调整

建议:
- 检查最近的令牌变更
- 更新基准截图
- 验证变更是否为预期
```

## 自动化流程

### 🚀 CI/CD 集成

**GitHub Actions 配置**：
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Start Docker test environment
        run: npm run docker:test-start

      - name: Run unit tests
        run: npm run test:unit

      - name: Run accessibility tests
        run: npm run test:a11y

      - name: Run visual regression tests
        run: npm run test:visual

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
```

### 🔄 本地开发

**监听模式**：
```bash
# 单元测试监听
npm run test:unit:watch

# 可访问性测试监听
npm run test:a11y:watch

# 视觉回归测试监听
npm run test:visual:watch
```

**快速测试**：
```bash
# 快速单元测试
npm run test:unit:quick

# 快速可访问性检查
npm run test:a11y:quick

# 快速视觉检查
npm run test:visual:quick
```

## 最佳实践

### ✅ 测试原则

1. **金字塔原则**：
   - 大量单元测试 (70%)
   - 适量集成测试 (20%)
   - 少量端到端测试 (10%)

2. **FIRST 原则**：
   - **Fast** - 测试要快速运行
   - **Independent** - 测试要独立
   - **Repeatable** - 测试要可重复
   - **Self-Validating** - 测试要自验证
   - **Timely** - 测试要及时

3. **AAA 模式**：
   - **Arrange** - 准备测试数据
   - **Act** - 执行被测操作
   - **Assert** - 验证测试结果

### 📈 质量标准

- **覆盖率目标**：80% 以上
- **可访问性目标**：100% WCAG 2.1 AA 合规
- **视觉一致性**：0% 失败率
- **性能目标**：组件渲染 < 16ms

### 🛠️ 维护策略

- **定期审查**：每月审查测试用例
- **基准更新**：及时更新视觉基准
- **依赖更新**：保持测试依赖最新
- **性能监控**：监控测试执行时间

让我知道你要执行什么测试操作，我会立即运行相应的测试流程并生成详细报告！