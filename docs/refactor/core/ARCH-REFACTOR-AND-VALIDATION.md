# 🧭 Xorigo-UI 重构与校验一体化执行手册（补短板对齐版）

**文件路径**：`/docs/ARCH-REFACTOR-AND-VALIDATION.md`
**版本**：v1.0（2025-10-16）
**适用范围**：Xorigo-UI Monorepo 完整重构与发版流水线建设

---

## 📋 项目现状分析

基于当前项目结构分析：

### ✅ 已有基础设施
- **Monorepo 架构**：基于 npm workspaces，packages/* 分离良好
- **核心包结构**：`@xorigo-ui/core`、`@xorigo-ui/tokens`、`@xorigo-ui/style-recipe`、`@xorigo-ui/system`、`@xorigo-ui/hooks`、`@xorigo-ui/i18n`
- **构建工具**：Vite + TypeScript，已配置 ESM/CJS 双格式输出
- **测试框架**：Vitest + Testing Library，已有基础测试配置
- **Storybook**：已配置，运行在端口 6009
- **Website 消费模式**：`apps/website` 严格消费 packages，符合架构原则

### ⚠️ 需补齐的短板
- **按需打包**：缺少组件级入口和精确的 exports 配置
- **三层解耦**：tokens/theme/core 耦合需要进一步优化
- **a11y 自动化**：缺少 axe-core 集成和键盘矩阵测试
- **视觉回归**：缺少自动化截图对比机制
- **SSR 兼容**：Framer Motion SSR 兜底不完整
- **发版流水线**：缺少 Changesets 和语义化版本管理

---

## 🎯 目标与范围

* **目标**：在不破坏现有架构前提下，补齐发布/体积/a11y/视觉回归/SSR/发版流水线等"最后一公里"
* **范围**：`packages/*`（tokens/style-recipe/system/hooks/core/i18n）、`apps/website/*`（仅消费展示）、CI/CD

---

## 🔄 重构待办（P0 优先级，可连续执行）

### A. 按需打包优化（Tree-shaking 生效）

**目的**：用户 `import '@xorigo-ui/core/button'` 仅引入所需产物
**当前状态**：仅有主入口导出，缺少组件级精确导出

**执行动作**：

1. **为 core 包添加组件级入口**：
```typescript
// packages/core/src/components/index.ts - 新增组件级入口
export * from './button'
export * from './card'
export * from './input'
export * from './dialog'
export * from './tabs'
// ... 其他组件
```

2. **更新 vite.config.ts 支持多入口**：
```typescript
// packages/core/vite.config.ts - 修改构建配置
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        // 新增组件级入口
        './button': resolve(__dirname, 'src/components/button.tsx'),
        './card': resolve(__dirname, 'src/components/card.tsx'),
        './dialog': resolve(__dirname, 'src/components/dialog.tsx'),
        './tabs': resolve(__dirname, 'src/components/tabs.tsx'),
      },
      name: 'Xorigo UI',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        if (format === 'es') {
          return `${entryName}.mjs`
        }
        return `${entryName}.cjs.js`
      },
    },
  },
})
```

3. **完善 package.json exports 配置**：
```json
// packages/core/package.json - 完善导出配置
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs.js"
    },
    "./button": {
      "types": "./dist/button.d.ts",
      "import": "./dist/button.mjs",
      "require": "./dist/button.cjs.js"
    },
    "./card": {
      "types": "./dist/card.d.ts",
      "import": "./dist/card.mjs",
      "require": "./dist/card.cjs.js"
    },
    "./dialog": {
      "types": "./dist/dialog.d.ts",
      "import": "./dist/dialog.mjs",
      "require": "./dist/dialog.cjs.js"
    },
    "./tabs": {
      "types": "./dist/tabs.d.ts",
      "import": "./dist/tabs.mjs",
      "require": "./dist/tabs.cjs.js"
    },
    "./theme": {
      "types": "./dist/theme.d.ts",
      "import": "./dist/theme.mjs",
      "require": "./dist/theme.cjs.js"
    }
  },
  "sideEffects": ["./dist/**/*.css"],
  "files": ["dist", "README.md", "LICENSE"]
}
```

**验证标准**：
- `import '@xorigo-ui/core/button'` 只打包 Button 组件相关代码
- Bundle 分析显示 tree-shaking 生效
- 所有组件级入口的类型声明正确生成

---

### B. Tokens / Theme / Core 三层解耦优化

**目的**：主题切换=变量切换；组件仅消费语义令牌
**当前状态**：已有基础的 tokens 包分离，但主题系统集成需优化

**执行动作**：

1. **强化 @xorigo-ui/tokens 包**：
```typescript
// packages/tokens/src/colors.ts - 增强颜色令牌
export const semanticColors = {
  primary: {
    50: 'var(--color-primary-50)',
    500: 'var(--color-primary-500)',
    900: 'var(--color-primary-900)',
  },
  secondary: {
    50: 'var(--color-secondary-50)',
    500: 'var(--color-secondary-500)',
    900: 'var(--color-secondary-900)',
  },
  // ... 完整的语义颜色系统
}

export const tokens = {
  colors: semanticColors,
  spacing: {
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
  },
  // ... 其他设计令牌
}
```

2. **创建 @xorigo-ui/theme 包（如果需要）**：
```typescript
// packages/theme/src/index.ts - 主题配方系统
export const themeRecipes = {
  // 七轴配方系统
  light: {
    mode: 'light',
    hue: 'blue',
    density: 'comfortable',
    surface: 'flat',
    // ... 完整配方
  },
  dark: {
    mode: 'dark',
    hue: 'blue',
    density: 'comfortable',
    surface: 'flat',
    // ... 完整配方
  }
}
```

3. **确保 core 包仅消费 CSS 变量**：
```typescript
// packages/core/src/components/button.tsx - 示例修改
import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-primary-500)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-600)]",
        secondary: "bg-[var(--color-secondary-500)] text-[var(--color-on-secondary)] hover:bg-[var(--color-secondary-600)]",
        outline: "border-[var(--color-border-300)] bg-transparent hover:bg-[var(--color-surface-100)]",
      },
      size: {
        sm: "h-[var(--spacing-8)] px-[var(--spacing-3)] text-sm",
        md: "h-[var(--spacing-10)] px-[var(--spacing-4)] text-base",
        lg: "h-[var(--spacing-12)] px-[var(--spacing-6)] text-lg",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
)
```

**验证标准**：
- 切换主题只需变更 CSS 变量，无需重新编译组件
- core 包中无硬编码颜色值
- SSR 时能正确注入 CSS 变量，避免 hydration mismatch

---

### C. a11y 自动化集成（axe-core + 键盘矩阵）

**目的**：落实可访问性优先原则，建立 a11y 基线
**当前状态**：Storybook 已配置 @storybook/addon-a11y，需要集成到 CI

**执行动作**：

1. **集成 axe-core 到测试流程**：
```bash
# 安装依赖
npm install --save-dev @axe-core/playwright @playwright/test
```

2. **创建 a11y 测试套件**：
```typescript
// packages/core/tests/a11y/dialog.a11y.spec.ts - 新增
import { test, expect } from '@playwright/test'
import { analyze } from '@axe-core/playwright'

test.describe('Dialog a11y', () => {
  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('/components/dialog')

    // 打开对话框
    await page.click('[data-testid="dialog-trigger"]')
    await page.waitForSelector('[role="dialog"]')

    // 运行 axe 分析
    const accessibilityScanResults = await analyze(page, {
      reporter: 'v2',
      includedImpacts: ['minor', 'moderate', 'serious', 'critical']
    })

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/components/dialog')

    // Tab 导航到触发按钮
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="dialog-trigger"]')).toBeFocused()

    // Enter 打开对话框
    await page.keyboard.press('Enter')
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // Focus 应该在对话框内
    await expect(page.locator('[data-testid="dialog-close"]')).toBeFocused()

    // Escape 关闭对话框
    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()

    // Focus 返回到触发按钮
    await expect(page.locator('[data-testid="dialog-trigger"]')).toBeFocused()
  })
})
```

3. **为其他组件创建类似测试**：
- `tabs.a11y.spec.ts` - Tab 键盘导航
- `dropdown.a11y.spec.ts` - 方向键导航
- `tooltip.a11y.spec.ts` - ARIA 属性验证

4. **更新 package.json 添加 a11y 测试脚本**：
```json
// packages/core/package.json - 新增脚本
{
  "scripts": {
    "test:a11y": "playwright test tests/a11y/",
    "test:a11y:headed": "playwright test tests/a11y/ --headed"
  }
}
```

**验证标准**：
- 所有核心组件通过 axe-core 检测（0 violations）
- 键盘导航矩阵完整覆盖
- ARIA 属性符合 WCAG 2.1 AA 标准

---

### D. 视觉回归保护（Storybook + 截图对比）

**目的**：确保组件库的视觉正确性
**当前状态**：已有 Storybook，缺少自动化截图对比

**执行动作**：

1. **配置 Playwright 视觉测试**：
```typescript
// packages/core/tests/visual/button.visual.spec.ts - 新增
import { test, expect } from '@playwright/test'

test.describe('Button visual regression', () => {
  ['primary', 'secondary', 'outline-solid', 'destructive'].forEach(variant => {
    ['sm', 'md', 'lg'].forEach(size => {
      test(`Button ${variant} ${size}`, async ({ page }) => {
        await page.goto(`/iframe.html?id=components-button--${variant}&args=size:${size}`)

        // 等待组件加载完成
        await page.waitForSelector('button')

        // 截图对比
        await expect(page.locator('button')).toHaveScreenshot(`button-${variant}-${size}.png`)
      })
    })
  })

  test('Button hover states', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary')
    const button = page.locator('button')

    await button.hover()
    await expect(button).toHaveScreenshot('button-primary-hover.png')
  })
})
```

2. **创建视觉测试配置**：
```typescript
// packages/core/playwright.config.ts - 新增
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    // 设置截图差异阈值
    toHaveScreenshot: {
      maxDiffPixels: 10,
      animation: 'disabled',
      caret: 'hide'
    }
  },
  use: {
    baseURL: 'http://localhost:6009', // Storybook 地址
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run storybook',
    port: 6009,
  },
})
```

3. **添加视觉测试脚本**：
```json
// packages/core/package.json - 新增脚本
{
  "scripts": {
    "test:visual": "playwright test tests/visual/",
    "test:visual:update": "playwright test tests/visual/ --update-snapshots"
  }
}
```

**验证标准**：
- 关键组件的视觉回归阈值 < 0.02
- CI 失败时提供清晰的视觉差异报告
- 支持本地更新基线截图

---

### E. SSR / 同构兼容优化

**目的**：消除 SSR 相关错误，支持 Next.js 15 + React 19
**当前状态**：Website 已基于 Next.js 15，需要优化 Framer Motion SSR 兜底

**执行动作**：

1. **优化 Framer Motion SSR 兜底**：
```typescript
// packages/core/src/components/motion-provider.tsx - 新增
'use client'

import { MotionConfig } from 'framer-motion'
import { useEffect, useState } from 'react'

interface MotionProviderProps {
  children: React.ReactNode
}

export function MotionProvider({ children }: MotionProviderProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 服务端渲染时禁用动画，避免 hydration mismatch
  if (!isClient) {
    return <>{children}</>
  }

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {children}
    </MotionConfig>
  )
}
```

2. **创建 SSR 兼容的动画组件**：
```typescript
// packages/core/src/components/animated-card.tsx - 修改
'use client'

import { motion, useIsPresent } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '../utils/cn'

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, children, ...props }, ref) => {
    const isPresent = useIsPresent()

    // 客户端渲染时才应用动画
    const Component = isPresent ? motion.div : 'div'

    return (
      <Component
        ref={ref}
        className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        {...(isPresent && {
          variants: {
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 }
          }
        })}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

AnimatedCard.displayName = "AnimatedCard"
```

3. **在 Website 中添加 SSR 示例页**：
```typescript
// apps/website/app/(marketing)/ssr-test/page.tsx - 新增
import { Button, Card, Dialog } from '@xorigo-ui/core'
import { MotionProvider } from '@xorigo-ui/core/motion-provider'

export default function SSRTestPage() {
  return (
    <MotionProvider>
      <div className="container mx-auto py-8 space-y-8">
        <h1 className="text-2xl font-bold">SSR 兼容性测试</h1>

        <Card>
          <Card.Header>
            <Card.Title>组件 SSR 测试</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4">
            <Button variant="primary">主要按钮</Button>
            <Button variant="secondary">次要按钮</Button>

            <Dialog>
              <Dialog.Trigger asChild>
                <Button variant="outline">打开对话框</Button>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>SSR 对话框测试</Dialog.Title>
                </Dialog.Header>
                <div className="py-4">
                  这个对话框在 SSR 环境下应该正常工作。
                </div>
                <Dialog.Footer>
                  <Dialog.Close asChild>
                    <Button>关闭</Button>
                  </Dialog.Close>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog>
          </Card.Content>
        </Card>
      </div>
    </MotionProvider>
  )
}
```

**验证标准**：
- Next.js 构建无 `window is not defined` 错误
- 页面渲染无 hydration mismatch 警告
- Framer Motion 动画在客户端正常工作

---

### F. 版本与流水线建设（Changesets + CI）

**目的**：建立语义化发版流程，多包协同构建
**当前状态**：缺少自动化发版流程

**执行动作**：

1. **初始化 Changesets**：
```bash
# 在根目录执行
npm install --save-dev @changesets/cli
npx changeset init
```

2. **配置 Changesets**：
```json
// .changeset/config.json - 新增
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [
    ["@xorigo-ui/core", "@xorigo-ui/tokens", "@xorigo-ui/style-recipe", "@xorigo-ui/system"]
  ],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

3. **添加根目录 scripts**：
```json
// package.json - 根目录 scripts 更新
{
  "scripts": {
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces",
    "type-check": "npm run type-check --workspaces",
    "test:a11y": "npm --workspace=@xorigo-ui/core run test:a11y",
    "test:visual": "npm --workspace=@xorigo-ui/core run test:visual",
    "storybook": "npm --workspace=@xorigo-ui/core run storybook",
    "build-storybook": "npm --workspace=@xorigo-ui/core run build-storybook",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "npm run build && changeset publish",
    "check:arch": "bash ./scripts/check-architecture-consistency.sh",
    "validate:release": "npm run lint && npm run type-check && npm run test && npm run test:a11y && npm run test:visual"
  }
}
```

4. **创建 GitHub Actions 工作流**：
```yaml
# .github/workflows/release.yml - 新增
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Build packages
        run: npm run build

      - name: Run tests
        run: npm run validate:release

      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: npm run release
          commit: "chore: release packages"
          title: "chore: release packages"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**验证标准**：
- Changesets 能正确生成变更日志
- 语义化版本自动递增
- CI 流程完整通过测试、构建、发布

---

## 🛡️ 架构边界守卫（与 SSOT 自动对齐）

**目的**：确保"Website 只消费不创造"的架构原则不被破坏
**执行脚本**：`/scripts/check-architecture-consistency.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "🧭 Xorigo-UI 架构一致性检查中..."

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1) Website 不得定义 UI 组件
echo "🔍 检查：Website 不得定义 UI 组件..."
if grep -RIE --include=\*.{ts,tsx} "export (default )?function (Button|Card|Input|Dialog|Tabs|Menu|Tooltip|Alert|Avatar|Badge)" apps/website/ 2>/dev/null; then
    echo -e "${RED}❌ 违规：apps/website/* 定义了 UI 组件（违反 SSOT：Website 只消费不创造）${NC}"
    echo "请将 UI 组件移至 packages/core，并确保 Website 仅消费 @xorigo-ui/* 包"
    exit 1
fi
echo -e "${GREEN}✅ 通过：Website 未定义 UI 组件${NC}"

# 2) Website 的 UI import 只能来自 @xorigo-ui/*
echo "🔍 检查：Website 的 UI 引用来源..."
if grep -RIn "from ['\"]\..*/components" apps/website/ | grep -v "@xorigo-ui" 2>/dev/null; then
    echo -e "${RED}❌ 违规：Website 存在非 @xorigo-ui 来源的 UI 引用${NC}"
    echo "请确保所有 UI 组件都从 @xorigo-ui/* 包导入"
    exit 1
fi
echo -e "${GREEN}✅ 通过：Website UI 引用来源正确${NC}"

# 3) packages 禁止反向依赖 website
echo "🔍 检查：packages 禁止反向依赖 website..."
if grep -RIn "@xorigo-ui/website\|website" packages/ 2>/dev/null; then
    echo -e "${RED}❌ 违规：packages/* 反向依赖 apps/website${NC}"
    echo "packages 不能依赖 website，保持单向依赖关系"
    exit 1
fi
echo -e "${GREEN}✅ 通过：packages 无反向依赖${NC}"

# 4) 检查是否存在硬编码颜色值
echo "🔍 检查：禁止硬编码颜色值..."
if grep -RIn --include=\*.{ts,tsx} "#[0-9a-fA-F]\{3,6\}\|rgb\|rgba" packages/core/src/components/ | grep -v "// " | head -5; then
    echo -e "${YELLOW}⚠️  警告：发现疑似硬编码颜色值，建议使用 CSS 变量${NC}"
    echo "请使用 var(--color-*) 替代硬编码颜色"
fi

# 5) 检查 package.json sideEffects 配置
echo "🔍 检查：sideEffects 配置..."
if ! grep -q '"sideEffects"' packages/core/package.json; then
    echo -e "${YELLOW}⚠️  警告：core 包缺少 sideEffects 配置${NC}"
    echo "建议添加 \"sideEffects\": [\"./dist/**/*.css\"] 以支持 tree-shaking"
fi

echo -e "${GREEN}🎉 架构一致性检查通过！${NC}"
echo "✅ Website 严格消费 @xorigo-ui/* 包"
echo "✅ 无架构违规依赖"
echo "✅ 符合《关键架构规则》要求"
```

**CI 集成**：
```yaml
# .github/workflows/ci.yml - 新增
name: CI

on:
  pull_request:
    branches:
      - main

jobs:
  arch-guard:
    name: Architecture Guard
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run Architecture Check
        run: bash ./scripts/check-architecture-consistency.sh

  build-test:
    name: Build & Test
    runs-on: ubuntu-latest
    needs: arch-guard
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type Check
        run: npm run type-check

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build
```

---

## 🤖 机器可读任务配置

**文件**：`/docs/refactor-execution-plan.yaml`

```yaml
meta:
  version: 1.0
  project: "Xorigo-UI"
  description: "重构与校验一体化执行计划"
  created: "2025-10-16"
  enforce: true

references:
  - title: "Xorigo-UI核心架构文档"
    path: "docs/WEBSITE-ARCHITECTURE/00-Xorigo-UI核心架构文档终极版.md"
    relevance: "组件分层/令牌/测试金字塔"
  - title: "关键架构规则"
    path: "docs/WEBSITE-ARCHITECTURE/CRITICAL-ARCHITECTURE-RULE.md"
    relevance: "Website 只消费规则"
  - title: "Website技术架构"
    path: "docs/WEBSITE-ARCHITECTURE/00-Website技术架构终极版.md"
    relevance: "模块边界/路由/旅程"

phases:
  - id: "phase-1-build-optimization"
    title: "构建优化与按需打包"
    priority: "P0"
    estimated_time: "2-3 days"

    tasks:
      - id: "add-component-exports"
        title: "添加组件级导出入口"
        description: "为 core 包添加 button、card、dialog 等组件的独立入口"
        files:
          - "packages/core/src/components/index.ts"
          - "packages/core/vite.config.ts"
        commands:
          - "创建组件级入口文件"
          - "更新 Vite 配置支持多入口"
        verification:
          - "import '@xorigo-ui/core/button' 正常工作"
          - "Bundle 分析显示 tree-shaking 生效"

      - id: "update-package-exports"
        title: "更新 package.json exports 配置"
        description: "完善 exports 字段，支持 ESM/CJS/types"
        files:
          - "packages/core/package.json"
        commands:
          - "添加组件级 exports 配置"
          - "配置 sideEffects 字段"
        verification:
          - "所有导入方式都有类型支持"
          - "sideEffects 配置正确"

  - id: "phase-2-theme-decoupling"
    title: "主题系统三层解耦"
    priority: "P0"
    estimated_time: "2-3 days"

    tasks:
      - id: "enhance-tokens-package"
        title: "增强 tokens 包功能"
        description: "完善设计令牌系统，支持 CSS 变量映射"
        files:
          - "packages/tokens/src/colors.ts"
          - "packages/tokens/src/index.ts"
        commands:
          - "定义语义化颜色令牌"
          - "创建 CSS 变量映射"
        verification:
          - "令牌仅引用 CSS 变量"
          - "支持多主题切换"

      - id: "remove-hardcoded-colors"
        title: "移除硬编码颜色值"
        description: "将组件中的硬编码颜色替换为 CSS 变量"
        scope: "packages/core/src/components/*"
        commands:
          - "搜索并替换硬编码颜色"
          - "使用 class-variance-authority 优化"
        verification:
          - "无 #xxxx 或 rgb() 硬编码颜色"
          - "主题切换无需重新编译"

  - id: "phase-3-a11y-automation"
    title: "a11y 自动化集成"
    priority: "P0"
    estimated_time: "3-4 days"

    tasks:
      - id: "integrate-axe-core"
        title: "集成 axe-core 测试"
        description: "为核心组件添加自动化可访问性测试"
        dependencies:
          - "@axe-core/playwright"
          - "@playwright/test"
        files:
          - "packages/core/tests/a11y/*.a11y.spec.ts"
          - "packages/core/playwright.config.ts"
        commands:
          - "创建 a11y 测试套件"
          - "配置 Playwright axe 集成"
        verification:
          - "所有组件 axe violations = 0"
          - "键盘导航完整覆盖"

      - id: "keyboard-matrix-tests"
        title: "键盘矩阵测试"
        description: "为交互组件添加键盘导航测试"
        components: ["Dialog", "Tabs", "Dropdown", "Tooltip"]
        verification:
          - "Tab/Shift+Tab 导航正常"
          - "Enter/Space 激活功能"
          - "Escape 关闭功能"
          - "方向键导航功能"

  - id: "phase-4-visual-regression"
    title: "视觉回归保护"
    priority: "P1"
    estimated_time: "2-3 days"

    tasks:
      - id: "setup-visual-tests"
        title: "设置视觉测试"
        description: "使用 Playwright 截图对比保护视觉正确性"
        files:
          - "packages/core/tests/visual/*.visual.spec.ts"
          - "packages/core/playwright-visual.config.ts"
        commands:
          - "创建关键组件视觉测试"
          - "配置截图对比阈值"
        verification:
          - "视觉差异阈值 < 0.02"
          - "CI 失败提供差异报告"

      - id: "integrate-storybook"
        title: "集成 Storybook 视觉测试"
        description: "基于 Storybook 创建视觉回归基线"
        commands:
          - "为所有 stories 创建截图测试"
          - "配置自动化截图更新"
        verification:
          - "所有组件 stories 有视觉覆盖"
          - "支持本地更新基线"

  - id: "phase-5-ssr-compatibility"
    title: "SSR 兼容性优化"
    priority: "P0"
    estimated_time: "2-3 days"

    tasks:
      - id: "motion-ssr-provider"
        title: "Motion SSR Provider"
        description: "创建支持 SSR 的 Motion Provider"
        files:
          - "packages/core/src/components/motion-provider.tsx"
          - "packages/core/src/components/animated-*.tsx"
        commands:
          - "创建客户端检测逻辑"
          - "优化动画组件 SSR 兜底"
        verification:
          - "Next.js 构建无 window 错误"
          - "无 hydration mismatch"

      - id: "ssr-demo-page"
        title: "SSR 演示页面"
        description: "在 Website 中创建 SSR 兼容性演示页"
        files:
          - "apps/website/app/(marketing)/ssr-test/page.tsx"
        commands:
          - "创建 SSR 测试页面"
          - "添加各类组件 SSR 示例"
        verification:
          - "页面正常 SSR 渲染"
          - "交互功能客户端正常"

  - id: "phase-6-release-pipeline"
    title: "发版流水线建设"
    priority: "P1"
    estimated_time: "3-4 days"

    tasks:
      - id: "setup-changesets"
        title: "设置 Changesets"
        description: "初始化并配置 Changesets 语义化发版"
        files:
          - ".changeset/config.json"
          - "package.json (root)"
        commands:
          - "npx changeset init"
          - "配置 linked packages"
          - "添加发布脚本"
        verification:
          - "Changesets CLI 正常工作"
          - "能生成版本变更日志"

      - id: "ci-cd-setup"
        title: "CI/CD 流水线设置"
        description: "创建完整的构建、测试、发布流水线"
        files:
          - ".github/workflows/ci.yml"
          - ".github/workflows/release.yml"
          - "scripts/check-architecture-consistency.sh"
        commands:
          - "创建 CI 工作流"
          - "创建 Release 工作流"
          - "添加架构守卫脚本"
        verification:
          - "CI 完整通过所有检查"
          - "架构违规能被自动阻断"

quality_gates:
  - name: "架构一致性"
    description: "确保 Website 只消费不创造"
    script: "scripts/check-architecture-consistency.sh"
    blocking: true

  - name: "类型安全"
    description: "TypeScript 严格模式检查"
    command: "npm run type-check"
    blocking: true

  - name: "代码质量"
    description: "ESLint 规则检查"
    command: "npm run lint"
    blocking: true

  - name: "单元测试"
    description: "所有单元测试通过"
    command: "npm run test"
    blocking: true

  - name: "可访问性"
    description: "axe-core 0 violations"
    command: "npm run test:a11y"
    blocking: true

  - name: "视觉回归"
    description: "视觉差异在阈值内"
    command: "npm run test:visual"
    blocking: true

  - name: "构建成功"
    description: "所有包构建成功"
    command: "npm run build"
    blocking: true

success_criteria:
  build_optimization:
    - "支持按需导入组件"
    - "Tree-shaking 生效验证"
    - "Bundle 体积优化 > 30%"

  theme_system:
    - "三层架构解耦完成"
    - "无硬编码颜色值"
    - "主题切换无需重新编译"

  accessibility:
    - "axe-core 0 violations"
    - "键盘矩阵完整覆盖"
    - "WCAG 2.1 AA 合规"

  visual_regression:
    - "关键组件视觉基线建立"
    - "自动化截图对比工作"
    - "差异阈值 < 0.02"

  ssr_compatibility:
    - "Next.js 15 完全兼容"
    - "无 hydration mismatch"
    - "动画客户端正常工作"

  release_pipeline:
    - "Changesets 语义化发版"
    - "CI/CD 完整流水线"
    - "架构守卫自动阻断"

rollback_plan:
  strategy: "gradual"
  steps:
    - "先发布 @xorigo-ui/core@next 标记进行试用"
    - "监控使用反馈和错误报告"
    - "如有问题立即回滚到上个 stable 版本"
    - "拆分 tokens/theme 包时保留 core 旧入口一个小版本周期"
    - "所有 breaking change 需要 major 版本升级"
```

---

## ✅ 验收标准（Done 的定义）

### 🏗️ 构建与打包
- ✅ **按需导出**：`import '@xorigo-ui/core/button'` 仅打包 Button 组件
- ✅ **Tree-shaking**：Bundle 分析显示未使用代码被正确移除
- ✅ **类型支持**：所有导出方式都有完整的 TypeScript 类型
- ✅ **格式支持**：同时支持 ESM 和 CJS 导入

### 🎨 主题系统
- ✅ **三层解耦**：tokens/theme/core 职责清晰分离
- ✅ **CSS 变量**：所有样式基于 CSS 变量，无硬编码值
- ✅ **主题切换**：切换主题只需变更 CSS 变量，无需重编译
- ✅ **SSR 兼容**：服务端渲染时正确注入变量

### ♿ 可访问性
- ✅ **axe-core 检测**：所有核心组件 0 violations
- ✅ **键盘导航**：Tab/Enter/Space/Escape/Arrows 完整支持
- ✅ **ARIA 属性**：符合 WCAG 2.1 AA 标准
- ✅ **焦点管理**：焦点陷阱和恢复正确工作

### 🖼️ 视觉回归
- ✅ **基线建立**：所有关键组件建立视觉基线
- ✅ **自动化检测**：CI 自动运行视觉回归测试
- ✅ **差异控制**：视觉差异阈值 < 0.02
- ✅ **报告清晰**：失败时提供清晰的差异报告

### ⚡ SSR 兼容
- ✅ **Next.js 15 兼容**：构建和运行时无错误
- ✅ **零 Hydration 错误**：无 hydration mismatch 警告
- ✅ **动画兜底**：Framer Motion 在 SSR 环境正确降级
- ✅ **客户端激活**：交互功能在客户端正常工作

### 🚀 发版流水线
- ✅ **语义化版本**：Changesets 自动管理版本号
- ✅ **自动化发布**：CI/CD 自动完成测试、构建、发布
- ✅ **变更日志**：自动生成详细的变更日志
- ✅ **架构守卫**：自动检测和阻断架构违规

### 🛡️ 架构边界
- ✅ **消费原则**：Website 严格消费 @xorigo-ui/* 包
- ✅ **单向依赖**：packages 不反向依赖 website
- ✅ **UI 组件隔离**：Website 不定义任何 UI 组件
- ✅ **架构一致性**：符合三份 SSOT 文档要求

---

## 🔒 回滚与风控

### 🚨 风险控制措施
1. **渐进式发布**：先发布 `@xorigo-ui/core@next` 标记进行小范围试用
2. **双轨维护**：拆分 tokens/theme 时保留 core 旧入口，标记 `@deprecated`
3. **向后兼容**：所有 breaking change 需要 major 版本升级
4. **监控告警**：发布后监控错误报告和使用反馈

### 🔄 快速回滚流程
1. **立即回滚**：发现问题立即回滚到上个 stable 版本
2. **根因分析**：详细分析问题原因和影响范围
3. **修复验证**：在测试环境充分验证后重新发布
4. **文档更新**：更新相关文档和迁移指南

### 🛡️ 质量保护网
1. **强制架构检查**：CI 中必须通过架构一致性检查
2. **视觉基线保护**：新样式必须通过视觉回归测试
3. **a11y 基线保护**：新组件必须通过 axe-core 检测
4. **类型安全保护**：TypeScript 严格模式必须通过

---

## 📚 相关文档索引

- **[核心架构文档](docs/WEBSITE-ARCHITECTURE/00-Xorigo-UI核心架构文档终极版.md)**：组件分层、设计令牌、测试金字塔
- **[关键架构规则](docs/WEBSITE-ARCHITECTURE/CRITICAL-ARCHITECTURE-RULE.md)**：Website 只消费不创造原则
- **[Website 技术架构](docs/WEBSITE-ARCHITECTURE/00-Website技术架构终极版.md)**：模块边界、用户旅程、路由结构
- **[项目开发指南](CLAUDE.md)**：Docker 开发环境、组件设计原则、工作流程

---

**维护者**：Xorigo-UI Team
**最后更新**：2025-10-16
**版本**：v1.0

> 🎯 **核心原则**：在保持架构完整性的前提下，补齐组件库发布的"最后一公里"，实现"可发布、可维护、可验证"的现代化组件库。