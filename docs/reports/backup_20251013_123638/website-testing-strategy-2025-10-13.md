# 🧪 Xorigo UI Website 重构测试策略

> **文档版本**: v1.0.0
> **创建日期**: 2025-10-13
> **负责团队**: Quality Engineer + Architecture Team
> **测试目标**: 确保 Website 重构达到 **80%+ 测试覆盖率**, **0 严重可访问性问题**, **性能达标**

---

## 📋 目录

1. [测试策略概览](#测试策略概览)
2. [测试维度与指标](#测试维度与指标)
3. [Data Layer 测试](#data-layer-测试)
4. [集成测试](#集成测试)
5. [性能测试](#性能测试)
6. [可访问性测试](#可访问性测试)
7. [测试工具链](#测试工具链)
8. [CI/CD 集成](#cicd-集成)
9. [测试执行计划](#测试执行计划)

---

## 🎯 测试策略概览

### 核心原则

```yaml
测试金字塔:
  单元测试 (70%):
    - Data Layer 适配器单元测试
    - SDK 客户端单元测试
    - Utils 和 Hooks 单元测试
    - 组件 Props 验证测试

  集成测试 (20%):
    - RSC 页面渲染集成测试
    - Client 组件交互集成测试
    - API Routes 集成测试
    - 数据流集成测试

  E2E 测试 (10%):
    - 关键用户路径 E2E 测试
    - 跨浏览器兼容性测试
    - 性能回归测试
    - 可访问性审计测试
```

### 测试优先级

| 优先级 | 测试范围 | 覆盖率目标 | 阻断构建 |
|--------|---------|-----------|---------|
| **P0 (关键路径)** | Data Layer + RSC 边界 + 错误边界 | 90%+ | ✅ 是 |
| **P1 (核心功能)** | Adoption + Playground + Tokens Hub | 80%+ | ✅ 是 |
| **P2 (辅助功能)** | 搜索 + DX 面板 + 优化功能 | 70%+ | ⚠️ 警告 |

### 测试环境

```yaml
本地开发环境:
  - Node.js: 22.x
  - 测试框架: Vitest
  - E2E 工具: Playwright
  - 可访问性: axe-core
  - 性能工具: Lighthouse CI

CI/CD 环境:
  - GitHub Actions
  - 并行测试执行
  - 测试结果缓存
  - 覆盖率报告上传
```

---

## 📊 测试维度与指标

### 1. 测试覆盖率指标

```yaml
代码覆盖率:
  整体覆盖率: ≥ 80%
  Data Layer: ≥ 90%
  SDK Layer: ≥ 85%
  组件 UI: ≥ 75%
  Hooks/Utils: ≥ 85%

分支覆盖率:
  条件分支: ≥ 75%
  错误处理: ≥ 80%
  边界条件: ≥ 70%
```

### 2. 质量指标

```yaml
测试质量:
  测试通过率: ≥ 95%
  测试稳定性: 无 flaky tests
  测试执行时间: ≤ 10 分钟
  测试维护成本: 低 (DRY 原则)

错误检测:
  关键错误检出率: 100%
  性能回归检出率: ≥ 90%
  可访问性问题检出率: ≥ 95%
```

### 3. 性能指标

```yaml
性能测试:
  LCP (3G): ≤ 2.5s
  FCP: ≤ 1.8s
  TTFB: ≤ 800ms
  CLS: ≤ 0.05
  FID: ≤ 100ms

体积预算:
  站点基础: ≤ 120KB gzip
  Playground: ≤ 150KB gzip
  单页最大: ≤ 50KB gzip
```

### 4. 可访问性指标

```yaml
可访问性:
  WCAG 2.1 AA: 严重/中等问题 0
  键盘导航: 100% 支持
  屏幕阅读器: 100% 兼容
  焦点可见性: 100% 清晰
  颜色对比度: ≥ 4.5:1
```

---

## 🗄️ Data Layer 测试

### 1. 只读适配器单元测试

#### 1.1 Registry 适配器测试

```typescript
// apps/website/__tests__/data/registry.readonly.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { readonlyRegistry, validateRegistryConsistency } from '@/data/registry.readonly'

describe('Registry Readonly Adapter', () => {
  describe('数据访问测试', () => {
    it('应该正确加载组件列表', () => {
      const components = readonlyRegistry.getComponents()

      expect(components).toBeInstanceOf(Array)
      expect(components.length).toBeGreaterThan(0)
      expect(components[0]).toHaveProperty('name')
      expect(components[0]).toHaveProperty('category')
    })

    it('应该正确获取单个组件详情', () => {
      const button = readonlyRegistry.getComponent('Button')

      expect(button).toBeDefined()
      expect(button?.name).toBe('Button')
      expect(button?.category).toBeDefined()
    })

    it('应该正确按类别过滤组件', () => {
      const uiComponents = readonlyRegistry.getComponentsByCategory('ui')

      expect(uiComponents).toBeInstanceOf(Array)
      uiComponents.forEach(comp => {
        expect(comp.category).toBe('ui')
      })
    })

    it('应该正确按标签搜索组件', () => {
      const interactiveComponents = readonlyRegistry.searchByTags(['interactive'])

      expect(interactiveComponents).toBeInstanceOf(Array)
      interactiveComponents.forEach(comp => {
        expect(comp.tags).toContain('interactive')
      })
    })
  })

  describe('Schema 验证测试', () => {
    it('应该通过 Schema 验证', () => {
      const result = validateRegistryConsistency()

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('应该验证 preview.module 路径存在性', () => {
      const result = validateRegistryConsistency()

      const previewErrors = result.errors.filter(e => e.type === 'preview')
      expect(previewErrors).toHaveLength(0)
    })

    it('应该验证组件依赖一致性', () => {
      const result = validateRegistryConsistency()

      const dependencyErrors = result.errors.filter(e => e.type === 'dependency')
      expect(dependencyErrors).toHaveLength(0)
    })
  })

  describe('错误处理测试', () => {
    it('应该在组件不存在时返回 undefined', () => {
      const nonExistent = readonlyRegistry.getComponent('NonExistentComponent')

      expect(nonExistent).toBeUndefined()
    })

    it('应该在类别不存在时返回空数组', () => {
      const components = readonlyRegistry.getComponentsByCategory('nonexistent')

      expect(components).toBeInstanceOf(Array)
      expect(components).toHaveLength(0)
    })
  })

  describe('性能测试', () => {
    it('应该在 50ms 内完成组件列表获取', () => {
      const start = performance.now()
      readonlyRegistry.getComponents()
      const end = performance.now()

      expect(end - start).toBeLessThan(50)
    })

    it('应该在 10ms 内完成单个组件获取', () => {
      const start = performance.now()
      readonlyRegistry.getComponent('Button')
      const end = performance.now()

      expect(end - start).toBeLessThan(10)
    })
  })
})
```

#### 1.2 Tokens 适配器测试

```typescript
// apps/website/__tests__/data/tokens.readonly.test.ts
import { describe, it, expect } from 'vitest'
import { readonlyTokens, validateTokensConsistency } from '@/data/tokens.readonly'

describe('Tokens Readonly Adapter', () => {
  describe('数据访问测试', () => {
    it('应该正确加载设计令牌', () => {
      const designTokens = readonlyTokens.getDesignTokens()

      expect(designTokens).toBeDefined()
      expect(designTokens).toHaveProperty('color')
      expect(designTokens).toHaveProperty('spacing')
    })

    it('应该正确加载语义令牌', () => {
      const semanticTokens = readonlyTokens.getSemanticTokens()

      expect(semanticTokens).toBeDefined()
      expect(semanticTokens).toHaveProperty('primary')
      expect(semanticTokens).toHaveProperty('secondary')
    })

    it('应该正确获取主题令牌列表', () => {
      const themes = readonlyTokens.getThemeList()

      expect(themes).toBeInstanceOf(Array)
      expect(themes.length).toBeGreaterThan(0)
    })

    it('应该正确获取指定主题令牌', () => {
      const themes = readonlyTokens.getThemeList()
      const firstTheme = themes[0]
      const themeTokens = readonlyTokens.getThemeTokens(firstTheme)

      expect(themeTokens).toBeDefined()
    })
  })

  describe('Schema 验证测试', () => {
    it('应该通过 Schema 验证', () => {
      const result = validateTokensConsistency()

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('应该验证语义令牌引用一致性', () => {
      const result = validateTokensConsistency()

      const referenceErrors = result.errors.filter(e => e.type === 'reference')
      expect(referenceErrors).toHaveLength(0)
    })
  })

  describe('性能测试', () => {
    it('应该在 50ms 内完成令牌加载', () => {
      const start = performance.now()
      readonlyTokens.getDesignTokens()
      const end = performance.now()

      expect(end - start).toBeLessThan(50)
    })
  })
})
```

### 2. SDK 客户端测试

#### 2.1 Registry SDK 测试

```typescript
// apps/website/__tests__/lib/sdk/registry-client.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { registryClient } from '@/lib/sdk/registry-client'

// Mock fetch
global.fetch = vi.fn()

describe('Website Registry SDK Client', () => {
  beforeEach(() => {
    registryClient.clearCache()
    vi.clearAllMocks()
  })

  describe('组件列表获取', () => {
    it('应该正确获取组件列表', async () => {
      const mockComponents = [
        { name: 'Button', category: 'ui' },
        { name: 'Card', category: 'ui' }
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockComponents
      })

      const components = await registryClient.getComponents()

      expect(components).toEqual(mockComponents)
      expect(global.fetch).toHaveBeenCalledWith('/api/registry/components.json')
    })

    it('应该缓存组件列表结果', async () => {
      const mockComponents = [{ name: 'Button', category: 'ui' }]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockComponents
      })

      // 第一次请求
      await registryClient.getComponents()
      // 第二次请求 (应该使用缓存)
      await registryClient.getComponents()

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('组件搜索', () => {
    it('应该正确搜索组件', async () => {
      const mockComponents = [
        { name: 'Button', title: 'Button Component', tags: ['ui'] },
        { name: 'Card', title: 'Card Component', tags: ['layout'] }
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockComponents
      })

      const results = await registryClient.searchComponents('button')

      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Button')
    })

    it('应该支持多字段搜索', async () => {
      const mockComponents = [
        { name: 'Button', title: 'Button Component', description: 'A clickable button', tags: ['interactive'] }
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockComponents
      })

      // 按标签搜索
      const results = await registryClient.searchComponents('interactive')

      expect(results).toHaveLength(1)
      expect(results[0].tags).toContain('interactive')
    })
  })

  describe('错误处理', () => {
    it('应该在请求失败时抛出错误', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      await expect(registryClient.getComponents()).rejects.toThrow('获取组件列表失败')
    })

    it('应该在网络错误时抛出错误', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      await expect(registryClient.getComponents()).rejects.toThrow('Network error')
    })
  })
})
```

### 3. 验证逻辑测试

#### 3.1 一致性校验测试

```typescript
// apps/website/__tests__/data/validation.test.ts
import { describe, it, expect } from 'vitest'
import { validateAllConsistency } from '@/data/validation'

describe('一致性校验', () => {
  it('应该执行所有校验项', async () => {
    const result = await validateAllConsistency()

    expect(result).toHaveProperty('valid')
    expect(result).toHaveProperty('errors')
    expect(result).toHaveProperty('warnings')
  })

  it('应该在所有校验通过时返回 valid: true', async () => {
    const result = await validateAllConsistency()

    if (result.errors.length === 0) {
      expect(result.valid).toBe(true)
    }
  })

  it('应该在有错误时返回 valid: false', async () => {
    // 假设存在错误
    const result = await validateAllConsistency()

    if (result.errors.length > 0) {
      expect(result.valid).toBe(false)
    }
  })

  it('应该返回详细的错误信息', async () => {
    const result = await validateAllConsistency()

    result.errors.forEach(error => {
      expect(error).toHaveProperty('type')
      expect(error).toHaveProperty('message')
    })
  })
})
```

---

## 🔗 集成测试

### 1. RSC 页面渲染测试

#### 1.1 文档页面集成测试

```typescript
// apps/website/__tests__/integration/docs-page.test.tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import DocsPage from '@/app/docs/[[...slug]]/page'

describe('文档页面集成测试', () => {
  it('应该正确渲染文档页面', async () => {
    const params = { slug: ['getting-started'] }
    const Component = await DocsPage({ params })

    const { container } = render(Component)

    expect(container).toBeTruthy()
  })

  it('应该正确加载 MDX 内容', async () => {
    const params = { slug: ['components', 'button'] }
    const Component = await DocsPage({ params })

    const { container } = render(Component)

    expect(container.querySelector('h1')).toBeTruthy()
  })

  it('应该在页面不存在时显示 404', async () => {
    const params = { slug: ['nonexistent'] }

    await expect(DocsPage({ params })).rejects.toThrow()
  })
})
```

#### 1.2 Adoption 页面集成测试

```typescript
// apps/website/__tests__/integration/adoption-page.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdoptionPage from '@/app/adoption/page'

describe('Adoption 页面集成测试', () => {
  it('应该正确渲染组件矩阵', async () => {
    const Component = await AdoptionPage()

    const { container } = render(Component)

    expect(container).toBeTruthy()
    expect(screen.getByText(/组件/i)).toBeInTheDocument()
  })

  it('应该正确显示组件分类', async () => {
    const Component = await AdoptionPage()

    const { container } = render(Component)

    expect(container.querySelectorAll('[data-category]').length).toBeGreaterThan(0)
  })
})
```

### 2. Client 组件交互测试

#### 2.1 Playground 交互测试

```typescript
// apps/website/__tests__/integration/playground.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PlaygroundClient } from '@/components/playground/playground-client'

describe('Playground 交互测试', () => {
  it('应该正确渲染 Playground', () => {
    render(<PlaygroundClient componentName="Button" />)

    expect(screen.getByText(/预览/i)).toBeInTheDocument()
  })

  it('应该支持 Props 编辑', async () => {
    render(<PlaygroundClient componentName="Button" />)

    const propInput = screen.getByLabelText(/variant/i)
    fireEvent.change(propInput, { target: { value: 'secondary' } })

    await waitFor(() => {
      expect(propInput).toHaveValue('secondary')
    })
  })

  it('应该支持主题切换', async () => {
    render(<PlaygroundClient componentName="Button" />)

    const themeButton = screen.getByText(/切换主题/i)
    fireEvent.click(themeButton)

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark')
    })
  })

  it('应该支持代码预览', async () => {
    render(<PlaygroundClient componentName="Button" />)

    const codeTab = screen.getByText(/代码/i)
    fireEvent.click(codeTab)

    await waitFor(() => {
      expect(screen.getByText(/import/i)).toBeInTheDocument()
    })
  })
})
```

#### 2.2 搜索功能集成测试

```typescript
// apps/website/__tests__/integration/search.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchCommand } from '@/components/search/search-command'

describe('搜索功能集成测试', () => {
  it('应该正确触发搜索', async () => {
    render(<SearchCommand />)

    const searchInput = screen.getByPlaceholderText(/搜索/i)
    fireEvent.change(searchInput, { target: { value: 'Button' } })

    await waitFor(() => {
      expect(screen.getByText(/Button/i)).toBeInTheDocument()
    }, { timeout: 300 })
  })

  it('应该支持键盘导航', async () => {
    render(<SearchCommand />)

    const searchInput = screen.getByPlaceholderText(/搜索/i)
    fireEvent.change(searchInput, { target: { value: 'Button' } })

    await waitFor(() => {
      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })
      expect(document.activeElement).not.toBe(searchInput)
    })
  })

  it('应该在 200ms 内返回搜索结果', async () => {
    render(<SearchCommand />)

    const searchInput = screen.getByPlaceholderText(/搜索/i)
    const start = performance.now()

    fireEvent.change(searchInput, { target: { value: 'Button' } })

    await waitFor(() => {
      const end = performance.now()
      expect(end - start).toBeLessThan(200)
    })
  })
})
```

### 3. API Routes 集成测试

#### 3.1 Registry API 测试

```typescript
// apps/website/__tests__/integration/api/registry.test.ts
import { describe, it, expect } from 'vitest'
import { GET } from '@/app/api/registry/route'

describe('Registry API 集成测试', () => {
  it('应该返回组件列表', async () => {
    const request = new Request('http://localhost:3000/api/registry')
    const response = await GET(request)

    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data).toHaveProperty('components')
    expect(data.components).toBeInstanceOf(Array)
  })

  it('应该返回正确的 Content-Type', async () => {
    const request = new Request('http://localhost:3000/api/registry')
    const response = await GET(request)

    expect(response.headers.get('Content-Type')).toContain('application/json')
  })

  it('应该支持缓存控制', async () => {
    const request = new Request('http://localhost:3000/api/registry')
    const response = await GET(request)

    expect(response.headers.get('Cache-Control')).toBeTruthy()
  })
})
```

### 4. 数据流集成测试

#### 4.1 数据一致性测试

```typescript
// apps/website/__tests__/integration/data-flow.test.ts
import { describe, it, expect } from 'vitest'
import { readonlyRegistry } from '@/data/registry.readonly'
import { registryClient } from '@/lib/sdk/registry-client'

describe('数据流集成测试', () => {
  it('应该确保 Data Layer 和 SDK Layer 数据一致', async () => {
    // Data Layer 数据
    const dataLayerComponents = readonlyRegistry.getComponents()

    // SDK Layer 数据 (模拟客户端调用)
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => dataLayerComponents
    })
    global.fetch = mockFetch

    const sdkLayerComponents = await registryClient.getComponents()

    expect(sdkLayerComponents).toEqual(dataLayerComponents)
  })

  it('应该确保组件详情数据一致', () => {
    const componentName = 'Button'
    const dataLayerComponent = readonlyRegistry.getComponent(componentName)

    expect(dataLayerComponent).toBeDefined()
    expect(dataLayerComponent?.name).toBe(componentName)
  })
})
```

---

## ⚡ 性能测试

### 1. Lighthouse 测试脚本

```typescript
// apps/website/scripts/lighthouse.ts
/**
 * @fileoverview Lighthouse 性能测试脚本
 */

import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import { writeFileSync } from 'fs'
import { join } from 'path'

const PERFORMANCE_BUDGETS = {
  LCP: 2500,      // ms (3G 网络)
  FCP: 1800,      // ms
  TTFB: 800,      // ms
  CLS: 0.05,      // score
  FID: 100,       // ms
}

const PAGES_TO_TEST = [
  { url: 'http://localhost:3000', name: 'home' },
  { url: 'http://localhost:3000/docs', name: 'docs' },
  { url: 'http://localhost:3000/adoption', name: 'adoption' },
  { url: 'http://localhost:3000/playground/Button', name: 'playground' },
  { url: 'http://localhost:3000/tokens', name: 'tokens' },
]

async function runLighthouse(url: string, name: string) {
  console.log(`\n🔍 测试页面: ${name} (${url})`)

  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })

  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility'],
    port: chrome.port,
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
    },
  }

  const runnerResult = await lighthouse(url, options)

  await chrome.kill()

  if (!runnerResult) {
    throw new Error('Lighthouse 测试失败')
  }

  const { lhr } = runnerResult

  // 提取关键指标
  const metrics = {
    LCP: lhr.audits['largest-contentful-paint'].numericValue,
    FCP: lhr.audits['first-contentful-paint'].numericValue,
    TTFB: lhr.audits['server-response-time'].numericValue,
    CLS: lhr.audits['cumulative-layout-shift'].numericValue,
    FID: lhr.audits['max-potential-fid']?.numericValue || 0,
    performanceScore: lhr.categories.performance.score * 100,
    accessibilityScore: lhr.categories.accessibility.score * 100,
  }

  console.log('\n📊 性能指标:')
  console.log(`  LCP: ${metrics.LCP.toFixed(0)}ms (目标: ≤ ${PERFORMANCE_BUDGETS.LCP}ms)`)
  console.log(`  FCP: ${metrics.FCP.toFixed(0)}ms (目标: ≤ ${PERFORMANCE_BUDGETS.FCP}ms)`)
  console.log(`  TTFB: ${metrics.TTFB.toFixed(0)}ms (目标: ≤ ${PERFORMANCE_BUDGETS.TTFB}ms)`)
  console.log(`  CLS: ${metrics.CLS.toFixed(3)} (目标: ≤ ${PERFORMANCE_BUDGETS.CLS})`)
  console.log(`  FID: ${metrics.FID.toFixed(0)}ms (目标: ≤ ${PERFORMANCE_BUDGETS.FID}ms)`)
  console.log(`  性能评分: ${metrics.performanceScore.toFixed(0)}/100`)
  console.log(`  可访问性评分: ${metrics.accessibilityScore.toFixed(0)}/100`)

  // 验证是否达标
  const passed = {
    LCP: metrics.LCP <= PERFORMANCE_BUDGETS.LCP,
    FCP: metrics.FCP <= PERFORMANCE_BUDGETS.FCP,
    TTFB: metrics.TTFB <= PERFORMANCE_BUDGETS.TTFB,
    CLS: metrics.CLS <= PERFORMANCE_BUDGETS.CLS,
    FID: metrics.FID <= PERFORMANCE_BUDGETS.FID,
  }

  const allPassed = Object.values(passed).every(v => v)

  console.log('\n✅ 性能验收:')
  Object.entries(passed).forEach(([key, value]) => {
    console.log(`  ${value ? '✅' : '❌'} ${key}: ${value ? '通过' : '未通过'}`)
  })

  // 保存报告
  const reportPath = join(process.cwd(), `lighthouse-${name}.json`)
  writeFileSync(reportPath, JSON.stringify(lhr, null, 2))
  console.log(`\n📄 完整报告已保存: ${reportPath}`)

  return {
    name,
    metrics,
    passed,
    allPassed,
  }
}

async function main() {
  console.log('🚀 开始 Lighthouse 性能测试\n')

  const results = []

  for (const page of PAGES_TO_TEST) {
    const result = await runLighthouse(page.url, page.name)
    results.push(result)
  }

  console.log('\n📋 测试总结:\n')

  const allPagesPassed = results.every(r => r.allPassed)

  results.forEach(result => {
    const status = result.allPassed ? '✅ 通过' : '❌ 未通过'
    console.log(`  ${status} - ${result.name}`)
  })

  if (!allPagesPassed) {
    console.log('\n❌ 性能测试未通过')
    process.exit(1)
  }

  console.log('\n✅ 所有页面性能测试通过')
  process.exit(0)
}

main()
```

### 2. Bundle Size 检查脚本

```typescript
// apps/website/scripts/check-bundle-size.ts
/**
 * @fileoverview Bundle 体积检查脚本
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { gzipSync, brotliCompressSync } from 'zlib'

const BUNDLE_BUDGETS = {
  site: 120 * 1024,        // 120KB gzip
  playground: 150 * 1024,  // 150KB gzip
  page: 50 * 1024,         // 50KB gzip per page
}

interface BundleInfo {
  name: string
  size: number
  gzipSize: number
  brotliSize: number
  budget: number
  passed: boolean
}

function getFileSize(filePath: string): number {
  return statSync(filePath).size
}

function getGzipSize(content: Buffer): number {
  return gzipSync(content).length
}

function getBrotliSize(content: Buffer): number {
  return brotliCompressSync(content).length
}

function analyzeBundles(distPath: string): BundleInfo[] {
  const bundles: BundleInfo[] = []

  // 分析主要 chunk 文件
  const chunkFiles = readdirSync(join(distPath, 'static/chunks'))
    .filter(f => f.endsWith('.js'))

  for (const file of chunkFiles) {
    const filePath = join(distPath, 'static/chunks', file)
    const content = readFileSync(filePath)

    const size = getFileSize(filePath)
    const gzipSize = getGzipSize(content)
    const brotliSize = getBrotliSize(content)

    // 判断 bundle 类型
    let budget = BUNDLE_BUDGETS.page
    let name = file

    if (file.includes('framework') || file.includes('main')) {
      budget = BUNDLE_BUDGETS.site
      name = 'site-base'
    } else if (file.includes('playground')) {
      budget = BUNDLE_BUDGETS.playground
      name = 'playground'
    }

    bundles.push({
      name,
      size,
      gzipSize,
      brotliSize,
      budget,
      passed: gzipSize <= budget,
    })
  }

  return bundles
}

function formatSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(2)} KB`
}

function printReport(bundles: BundleInfo[]) {
  console.log('\n📦 Bundle 体积报告\n')

  bundles.forEach(bundle => {
    const status = bundle.passed ? '✅' : '❌'
    const percentage = ((bundle.gzipSize / bundle.budget) * 100).toFixed(1)

    console.log(`${status} ${bundle.name}`)
    console.log(`   原始大小: ${formatSize(bundle.size)}`)
    console.log(`   Gzip 大小: ${formatSize(bundle.gzipSize)} / ${formatSize(bundle.budget)} (${percentage}%)`)
    console.log(`   Brotli 大小: ${formatSize(bundle.brotliSize)}`)
    console.log('')
  })

  const allPassed = bundles.every(b => b.passed)

  if (!allPassed) {
    console.log('❌ Bundle 体积检查未通过')
    const failed = bundles.filter(b => !b.passed)
    console.log('\n超出预算的 Bundle:')
    failed.forEach(bundle => {
      const over = bundle.gzipSize - bundle.budget
      console.log(`  - ${bundle.name}: 超出 ${formatSize(over)}`)
    })
    process.exit(1)
  }

  console.log('✅ 所有 Bundle 体积符合预算')
}

async function main() {
  const distPath = join(process.cwd(), '.next')

  console.log('🔍 开始 Bundle 体积检查...')

  const bundles = analyzeBundles(distPath)

  printReport(bundles)
}

main()
```

### 3. Web Vitals 监控

```typescript
// apps/website/src/lib/web-vitals.ts
/**
 * @fileoverview Web Vitals 监控
 */

import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals'

type MetricName = 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB'

interface MetricReport {
  name: MetricName
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

const thresholds: Record<MetricName, { good: number; poor: number }> = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
}

function getRating(name: MetricName, value: number): 'good' | 'needs-improvement' | 'poor' {
  const { good, poor } = thresholds[name]
  if (value <= good) return 'good'
  if (value <= poor) return 'needs-improvement'
  return 'poor'
}

function sendToAnalytics(report: MetricReport) {
  // 发送到分析服务 (Google Analytics, Plausible, etc.)
  console.log('📊 Web Vitals:', report)

  // 示例: 发送到 API
  if (typeof window !== 'undefined') {
    navigator.sendBeacon(
      '/api/analytics/vitals',
      JSON.stringify(report)
    )
  }
}

function handleMetric(metric: Metric) {
  const report: MetricReport = {
    name: metric.name as MetricName,
    value: metric.value,
    rating: getRating(metric.name as MetricName, metric.value),
    timestamp: Date.now(),
  }

  sendToAnalytics(report)
}

export function initWebVitals() {
  if (typeof window === 'undefined') return

  getCLS(handleMetric)
  getFID(handleMetric)
  getFCP(handleMetric)
  getLCP(handleMetric)
  getTTFB(handleMetric)
}
```

### 4. 筛选性能测试

```typescript
// apps/website/__tests__/performance/filter-performance.test.ts
import { describe, it, expect } from 'vitest'
import { performance } from 'perf_hooks'

describe('筛选性能测试', () => {
  it('应该在 50ms 内完成 1k 项筛选', () => {
    // 生成 1000 个模拟组件
    const components = Array.from({ length: 1000 }, (_, i) => ({
      name: `Component${i}`,
      category: ['ui', 'layout', 'form'][i % 3],
      tags: [`tag${i % 10}`, `tag${i % 5}`],
    }))

    const filterFn = (items: typeof components, category: string) => {
      return items.filter(item => item.category === category)
    }

    const start = performance.now()
    const filtered = filterFn(components, 'ui')
    const end = performance.now()

    const duration = end - start

    console.log(`筛选 1000 项耗时: ${duration.toFixed(2)}ms`)
    expect(duration).toBeLessThan(50)
    expect(filtered.length).toBeGreaterThan(0)
  })

  it('应该在 200ms 内完成全局搜索', () => {
    // 生成 1000 个模拟项
    const items = Array.from({ length: 1000 }, (_, i) => ({
      name: `Item${i}`,
      title: `Title ${i}`,
      description: `Description for item ${i}`,
      tags: [`tag${i % 10}`],
    }))

    const searchFn = (items: typeof items, query: string) => {
      const lowerQuery = query.toLowerCase()
      return items.filter(item =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    }

    const start = performance.now()
    const results = searchFn(items, 'item50')
    const end = performance.now()

    const duration = end - start

    console.log(`搜索 1000 项耗时: ${duration.toFixed(2)}ms`)
    expect(duration).toBeLessThan(200)
    expect(results.length).toBeGreaterThan(0)
  })
})
```

---

## ♿ 可访问性测试

### 1. axe-core 集成测试

```typescript
// apps/website/__tests__/a11y/axe-core.test.tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

// 示例: 测试首页可访问性
describe('可访问性测试', () => {
  it('首页应该无可访问性问题', async () => {
    // 注意: 需要在真实浏览器环境中运行
    const { container } = render(
      <div>
        <h1>Xorigo UI</h1>
        <button>Get Started</button>
      </div>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('按钮组件应该无可访问性问题', async () => {
    const { container } = render(
      <button aria-label="Click me">Click</button>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('表单组件应该有正确的标签关联', async () => {
    const { container } = render(
      <form>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" />
      </form>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### 2. 可访问性审计脚本

```typescript
// apps/website/scripts/run-a11y-audit.ts
/**
 * @fileoverview 可访问性审计脚本
 */

import { chromium } from 'playwright'
import { AxePuppeteer } from '@axe-core/puppeteer'
import { writeFileSync } from 'fs'
import { join } from 'path'

const PAGES_TO_AUDIT = [
  { url: 'http://localhost:3000', name: 'home' },
  { url: 'http://localhost:3000/docs', name: 'docs' },
  { url: 'http://localhost:3000/adoption', name: 'adoption' },
  { url: 'http://localhost:3000/playground/Button', name: 'playground' },
]

interface A11yIssue {
  id: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  description: string
  help: string
  helpUrl: string
  nodes: Array<{
    html: string
    target: string[]
  }>
}

async function auditPage(url: string, name: string) {
  console.log(`\n🔍 审计页面: ${name} (${url})`)

  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto(url, { waitUntil: 'networkidle' })

  // 运行 axe 审计
  const results = await new AxePuppeteer(page).analyze()

  await browser.close()

  const { violations, passes } = results

  console.log(`\n📊 审计结果:`)
  console.log(`  通过项: ${passes.length}`)
  console.log(`  违规项: ${violations.length}`)

  if (violations.length > 0) {
    console.log(`\n❌ 发现可访问性问题:\n`)

    const critical = violations.filter(v => v.impact === 'critical')
    const serious = violations.filter(v => v.impact === 'serious')
    const moderate = violations.filter(v => v.impact === 'moderate')
    const minor = violations.filter(v => v.impact === 'minor')

    if (critical.length > 0) {
      console.log(`  🔴 严重 (Critical): ${critical.length}`)
      critical.forEach(v => {
        console.log(`     - ${v.id}: ${v.description}`)
        console.log(`       帮助: ${v.helpUrl}`)
      })
    }

    if (serious.length > 0) {
      console.log(`  🟠 重要 (Serious): ${serious.length}`)
      serious.forEach(v => {
        console.log(`     - ${v.id}: ${v.description}`)
      })
    }

    if (moderate.length > 0) {
      console.log(`  🟡 中等 (Moderate): ${moderate.length}`)
    }

    if (minor.length > 0) {
      console.log(`  🟢 轻微 (Minor): ${minor.length}`)
    }
  }

  // 保存报告
  const reportPath = join(process.cwd(), `a11y-${name}.json`)
  writeFileSync(reportPath, JSON.stringify(results, null, 2))
  console.log(`\n📄 完整报告已保存: ${reportPath}`)

  return {
    name,
    violations,
    passes,
    passed: violations.filter(v => v.impact === 'critical' || v.impact === 'serious').length === 0,
  }
}

async function main() {
  console.log('🚀 开始可访问性审计\n')

  const results = []

  for (const page of PAGES_TO_AUDIT) {
    const result = await auditPage(page.url, page.name)
    results.push(result)
  }

  console.log('\n📋 审计总结:\n')

  const allPagesPassed = results.every(r => r.passed)

  results.forEach(result => {
    const status = result.passed ? '✅ 通过' : '❌ 未通过'
    console.log(`  ${status} - ${result.name} (${result.violations.length} 个问题)`)
  })

  if (!allPagesPassed) {
    console.log('\n❌ 可访问性审计未通过: 存在严重或重要问题')
    process.exit(1)
  }

  console.log('\n✅ 所有页面可访问性审计通过')
  process.exit(0)
}

main()
```

### 3. 键盘导航测试

```typescript
// apps/website/__tests__/a11y/keyboard-navigation.test.ts
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ComponentMatrix } from '@/components/adoption/component-matrix'

describe('键盘导航测试', () => {
  it('应该支持 Tab 键导航', () => {
    render(<ComponentMatrix />)

    const firstButton = screen.getAllByRole('button')[0]
    firstButton.focus()

    expect(document.activeElement).toBe(firstButton)

    // 模拟 Tab 键
    fireEvent.keyDown(firstButton, { key: 'Tab' })

    // 焦点应该移到下一个可聚焦元素
    expect(document.activeElement).not.toBe(firstButton)
  })

  it('应该支持 Enter 键激活按钮', () => {
    const handleClick = vi.fn()
    render(<button onClick={handleClick}>Click me</button>)

    const button = screen.getByRole('button')
    button.focus()

    fireEvent.keyDown(button, { key: 'Enter' })

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('应该支持 Escape 键关闭对话框', () => {
    const handleClose = vi.fn()
    render(
      <div role="dialog" onKeyDown={(e) => {
        if (e.key === 'Escape') handleClose()
      }}>
        <button>Close</button>
      </div>
    )

    const dialog = screen.getByRole('dialog')

    fireEvent.keyDown(dialog, { key: 'Escape' })

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('应该支持方向键导航列表', () => {
    render(
      <ul role="listbox">
        <li role="option" tabIndex={0}>Option 1</li>
        <li role="option" tabIndex={-1}>Option 2</li>
        <li role="option" tabIndex={-1}>Option 3</li>
      </ul>
    )

    const options = screen.getAllByRole('option')
    options[0].focus()

    expect(document.activeElement).toBe(options[0])

    // 模拟 ArrowDown 键
    fireEvent.keyDown(options[0], { key: 'ArrowDown' })

    // 焦点应该移到下一个选项
    // 注意: 实际行为取决于组件实现
  })
})
```

### 4. WCAG 合规性检查

```typescript
// apps/website/scripts/check-wcag-compliance.ts
/**
 * @fileoverview WCAG 2.1 AA 合规性检查
 */

import { chromium } from 'playwright'
import { AxePuppeteer } from '@axe-core/puppeteer'

const WCAG_AA_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
]

async function checkWCAGCompliance(url: string) {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto(url, { waitUntil: 'networkidle' })

  // 运行 WCAG AA 审计
  const results = await new AxePuppeteer(page)
    .withTags(WCAG_AA_TAGS)
    .analyze()

  await browser.close()

  return results
}

async function main() {
  const url = process.argv[2] || 'http://localhost:3000'

  console.log(`\n🔍 检查 WCAG 2.1 AA 合规性: ${url}\n`)

  const results = await checkWCAGCompliance(url)

  const { violations } = results

  if (violations.length === 0) {
    console.log('✅ 通过 WCAG 2.1 AA 合规性检查')
    process.exit(0)
  }

  console.log(`❌ 发现 ${violations.length} 个 WCAG 2.1 AA 违规项:\n`)

  violations.forEach((violation, i) => {
    console.log(`${i + 1}. ${violation.id} (${violation.impact})`)
    console.log(`   描述: ${violation.description}`)
    console.log(`   帮助: ${violation.help}`)
    console.log(`   标准: ${violation.tags.join(', ')}`)
    console.log(`   影响节点: ${violation.nodes.length}`)
    console.log(`   文档: ${violation.helpUrl}\n`)
  })

  process.exit(1)
}

main()
```

---

## 🛠️ 测试工具链

### 1. Vitest 配置

```typescript
// apps/website/vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '.next/',
        'out/',
        '**/*.config.ts',
        '**/*.d.ts',
        '**/__tests__/**',
        '**/tests/**',
      ],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/data': path.resolve(__dirname, './src/data'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
})
```

```typescript
// apps/website/vitest.setup.ts
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers'

// 扩展 expect 匹配器
expect.extend(matchers)

// 每个测试后清理
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any
```

### 2. Playwright 配置

```typescript
// apps/website/playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report.json' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 3. E2E 测试示例

```typescript
// apps/website/__tests__/e2e/adoption-page.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Adoption Page E2E', () => {
  test('应该正确加载组件矩阵页面', async ({ page }) => {
    await page.goto('/adoption')

    await expect(page.locator('h1')).toContainText(/组件/i)
    await expect(page.locator('[data-component-card]')).toHaveCount({ min: 1 })
  })

  test('应该支持组件搜索', async ({ page }) => {
    await page.goto('/adoption')

    const searchInput = page.locator('input[placeholder*="搜索"]')
    await searchInput.fill('Button')

    await page.waitForTimeout(300) // 等待防抖

    const results = page.locator('[data-component-card]')
    const count = await results.count()

    expect(count).toBeGreaterThan(0)

    const firstResult = results.first()
    await expect(firstResult).toContainText(/Button/i)
  })

  test('应该支持类别筛选', async ({ page }) => {
    await page.goto('/adoption')

    const categoryFilter = page.locator('[data-category-filter="ui"]')
    await categoryFilter.click()

    const results = page.locator('[data-component-card]')
    const count = await results.count()

    expect(count).toBeGreaterThan(0)

    // 验证所有结果都是 UI 类别
    for (let i = 0; i < count; i++) {
      const card = results.nth(i)
      await expect(card).toHaveAttribute('data-category', 'ui')
    }
  })

  test('应该支持复制组件命令', async ({ page }) => {
    await page.goto('/adoption')

    const copyButton = page.locator('[data-copy-button]').first()
    await copyButton.click()

    // 验证复制成功提示
    await expect(page.locator('[data-toast]')).toContainText(/复制成功/i)

    // 验证剪贴板内容
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toContain('xorigo add')
  })
})
```

```typescript
// apps/website/__tests__/e2e/playground.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Playground E2E', () => {
  test('应该正确加载 Playground', async ({ page }) => {
    await page.goto('/playground/Button')

    await expect(page.locator('h1')).toContainText(/Button/i)
    await expect(page.locator('[data-preview-area]')).toBeVisible()
  })

  test('应该支持 Props 实时编辑', async ({ page }) => {
    await page.goto('/playground/Button')

    // 打开 Props 编辑器
    const propsEditor = page.locator('[data-props-editor]')
    await expect(propsEditor).toBeVisible()

    // 修改 variant
    const variantSelect = page.locator('select[name="variant"]')
    await variantSelect.selectOption('secondary')

    // 验证预览区域更新
    const preview = page.locator('[data-preview-area] button')
    await expect(preview).toHaveClass(/secondary/i)
  })

  test('应该支持主题切换', async ({ page }) => {
    await page.goto('/playground/Button')

    // 切换到暗色模式
    const themeToggle = page.locator('[data-theme-toggle]')
    await themeToggle.click()

    // 验证 HTML 元素类名
    await expect(page.locator('html')).toHaveClass(/dark/)

    // 验证组件样式更新
    const preview = page.locator('[data-preview-area]')
    await expect(preview).toHaveCSS('background-color', /.+/)
  })

  test('应该支持代码预览', async ({ page }) => {
    await page.goto('/playground/Button')

    // 切换到代码标签
    const codeTab = page.locator('[data-tab="code"]')
    await codeTab.click()

    // 验证代码内容
    const codeBlock = page.locator('[data-code-block]')
    await expect(codeBlock).toContainText(/import/)
    await expect(codeBlock).toContainText(/Button/)
  })

  test('应该支持快照保存', async ({ page }) => {
    await page.goto('/playground/Button')

    // 修改一些 Props
    const variantSelect = page.locator('select[name="variant"]')
    await variantSelect.selectOption('secondary')

    // 保存快照
    const saveButton = page.locator('[data-save-snapshot]')
    await saveButton.click()

    // 验证快照列表
    const snapshotList = page.locator('[data-snapshot-list]')
    await expect(snapshotList.locator('[data-snapshot-item]')).toHaveCount({ min: 1 })

    // 验证 URL 参数
    await expect(page).toHaveURL(/variant=secondary/)
  })
})
```

---

## 🔄 CI/CD 集成

### 1. GitHub Actions 工作流

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-test:
    name: Unit Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage
        working-directory: apps/website

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./apps/website/coverage/lcov.info
          flags: website
          name: website-coverage

  integration-test:
    name: Integration Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run integration tests
        run: npm run test:integration
        working-directory: apps/website

  e2e-test:
    name: E2E Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps
        working-directory: apps/website

      - name: Build application
        run: npm run build
        working-directory: apps/website

      - name: Run E2E tests
        run: npm run test:e2e
        working-directory: apps/website

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: apps/website/playwright-report/
          retention-days: 30

  performance-test:
    name: Performance Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        working-directory: apps/website

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.14.x
          lhci autorun
        working-directory: apps/website

      - name: Check bundle size
        run: npm run check:bundle-size
        working-directory: apps/website

  a11y-test:
    name: Accessibility Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps
        working-directory: apps/website

      - name: Build application
        run: npm run build
        working-directory: apps/website

      - name: Run a11y audit
        run: npm run audit:a11y
        working-directory: apps/website

      - name: Upload a11y report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: a11y-report
          path: apps/website/a11y-*.json
          retention-days: 30

  data-consistency:
    name: Data Consistency Check
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Validate data consistency
        run: npm run validate:consistency
        working-directory: apps/website

      - name: Validate schemas
        run: npm run validate:schemas
        working-directory: apps/website
```

### 2. Lighth