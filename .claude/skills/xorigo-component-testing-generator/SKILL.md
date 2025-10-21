# 组件测试生成 Skill

**触发条件**：当需要为组件创建测试、验证测试覆盖率、生成测试用例时触发

## 功能描述

自动生成符合 Xorigo UI 标准的组件测试代码，包括单元测试、可访问性测试、主题适配测试和交互测试。

## 核心能力

### 1. 测试模板生成器
基于组件结构自动生成完整的测试模板：

```typescript
// 组件测试模板生成器
class ComponentTestGenerator {
  generateTestSuite(componentInfo: ComponentInfo): {
    testFile: string
    testCases: TestCase[]
    mockData: MockData[]
    coverageTargets: CoverageTargets
  } {
    const { componentName, props, variants, interactions } = componentInfo

    return {
      testFile: this.generateTestFile(componentName),
      testCases: [
        ...this.generateRenderTests(componentName, props),
        ...this.generateVariantTests(componentName, variants),
        ...this.generateInteractionTests(componentName, interactions),
        ...this.generateAccessibilityTests(componentName),
        ...this.generateThemeTests(componentName)
      ],
      mockData: this.generateMockData(props),
      coverageTargets: this.generateCoverageTargets(componentInfo)
    }
  }

  private generateTestFile(componentName: string): string {
    return `import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ${componentName} } from '@xorigo-ui/core'

// 扩展 Jest 匹配器
expect.extend(toHaveNoViolations)

describe('${componentName}', () => {
  // 测试用例将在这里生成
})
    `.trim()
  }

  private generateRenderTests(componentName: string, props: ComponentProps[]): TestCase[] {
    return [
      {
        name: 'renders correctly',
        test: `
    it('renders correctly', () => {
      render(<${componentName}>Test Content</${componentName}>)
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })`,
        category: 'render'
      },
      {
        name: 'renders with default props',
        test: `
    it('renders with default props', () => {
      render(<${componentName} />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })`,
        category: 'render'
      },
      {
        name: 'renders with custom className',
        test: `
    it('renders with custom className', () => {
      render(<${componentName} className="custom-class">Test</${componentName}>)
      const element = screen.getByRole('button')
      expect(element).toHaveClass('custom-class')
    })`,
        category: 'render'
      }
    ]
  }

  private generateVariantTests(componentName: string, variants: Variant[]): TestCase[] {
    return variants.map(variant => ({
      name: `renders with ${variant.name} variant`,
      test: `
    it('renders with ${variant.name} variant', () => {
      render(<${componentName} variant="${variant.name}">Test</${componentName}>)
      const element = screen.getByRole('button')
      expect(element).toHaveClass('${variant.cssClass}')
    })`,
      category: 'variant'
    }))
  }

  private generateInteractionTests(componentName: string, interactions: Interaction[]): TestCase[] {
    return interactions.map(interaction => ({
      name: `handles ${interaction.name} interaction`,
      test: `
    it('handles ${interaction.name} interaction', async () => {
      const user = userEvent.setup()
      const ${interaction.handler} = vi.fn()

      render(<${componentName} ${interaction.propName}={${interaction.handler}}>Test</${componentName}>)

      await user.${interaction.action}(screen.getByRole('button'))
      expect(${interaction.handler}).toHaveBeenCalledTimes(1)
    })`,
      category: 'interaction'
    }))
  }

  private generateAccessibilityTests(componentName: string): TestCase[] {
    return [
      {
        name: 'has no accessibility violations',
        test: `
    it('has no accessibility violations', async () => {
      const { container } = render(<${componentName}>Test Content</${componentName}>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })`,
        category: 'accessibility'
      },
      {
        name: 'supports keyboard navigation',
        test: `
    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(<${componentName} onClick={handleClick}>Test</${componentName}>)

      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)

      await user.keyboard('{ }')
      expect(handleClick).toHaveBeenCalledTimes(2)
    })`,
        category: 'accessibility'
      },
      {
        name: 'has proper ARIA attributes',
        test: `
    it('has proper ARIA attributes', () => {
      render(<${componentName} disabled>Disabled Button</${componentName}>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })`,
        category: 'accessibility'
      }
    ]
  }

  private generateThemeTests(componentName: string): TestCase[] {
    return [
      {
        name: 'adapts to theme changes',
        test: `
    it('adapts to theme changes', () => {
      const { rerender } = render(<${componentName}>Test</${componentName}>)

      // 初始主题
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary-500')

      // 切换主题
      document.documentElement.setAttribute('data-theme', 'dark')
      rerender(<${componentName}>Test</${componentName}>)

      // 验证主题应用
      expect(button).toHaveClass('bg-primary-500')
    })`,
        category: 'theme'
      },
      {
        name: 'works with all recipe variants',
        test: `
    it('works with all recipe variants', () => {
      const recipes = [
        'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow',
        'dark.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow'
      ]

      recipes.forEach(recipe => {
        const { unmount } = render(
          <div data-theme-recipe={recipe}>
            <${componentName}>Test</${componentName}>
          </div>
        )

        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()

        unmount()
      })
    })`,
        category: 'theme'
      }
    ]
  }
}
```

### 2. 测试数据生成器
生成测试所需的模拟数据和 fixtures：

```typescript
// 测试数据生成器
class TestDataGenerator {
  generateMockData(props: ComponentProps[]): MockData[] {
    return props.map(prop => ({
      name: prop.name,
      type: prop.type,
      mockValue: this.generateMockValue(prop),
      scenarios: this.generateScenarios(prop)
    }))
  }

  private generateMockValue(prop: ComponentProps): any {
    switch (prop.type) {
      case 'string':
        return prop.name.includes('label') ? 'Test Label' : 'Test Content'
      case 'boolean':
        return false
      case 'function':
        return `vi.fn()`
      case 'number':
        return prop.name.includes('size') ? 20 : 1
      case 'array':
        return '[]'
      case 'object':
        return '{}'
      default:
        return null
    }
  }

  private generateScenarios(prop: ComponentProps): TestScenario[] {
    const scenarios: TestScenario[] = []

    if (prop.type === 'boolean') {
      scenarios.push(
        { name: `${prop.name} is true`, value: true },
        { name: `${prop.name} is false`, value: false }
      )
    }

    if (prop.name === 'variant') {
      scenarios.push(
        { name: 'primary variant', value: 'primary' },
        { name: 'secondary variant', value: 'secondary' },
        { name: 'outline variant', value: 'outline' }
      )
    }

    if (prop.name === 'size') {
      scenarios.push(
        { name: 'small size', value: 'sm' },
        { name: 'medium size', value: 'md' },
        { name: 'large size', value: 'lg' }
      )
    }

    return scenarios
  }

  generateFixtures(componentName: string): ComponentFixture {
    return {
      basic: {
        name: 'Basic',
        component: `<${componentName}>Basic ${componentName}</${componentName}>`,
        description: 'Basic usage of the component'
      },
      withVariants: {
        name: 'With Variants',
        component: `
<div>
  <${componentName} variant="primary">Primary</${componentName}>
  <${componentName} variant="secondary">Secondary</${componentName}>
  <${componentName} variant="outline">Outline</${componentName}>
</div>        `.trim(),
        description: 'Component with different variants'
      },
      withSizes: {
        name: 'With Sizes',
        component: `
<div>
  <${componentName} size="sm">Small</${componentName}>
  <${componentName} size="md">Medium</${componentName}>
  <${componentName} size="lg">Large</${componentName}>
</div>        `.trim(),
        description: 'Component with different sizes'
      },
      interactive: {
        name: 'Interactive',
        component: `
<${componentName} onClick={() => console.log('clicked')}>
  Click me
</${componentName}>        `.trim(),
        description: 'Component with interaction handlers'
      },
      accessible: {
        name: 'Accessible',
        component: `
<${componentName} aria-label="Action button" disabled>
  Disabled Button
</${componentName}>        `.trim(),
        description: 'Component with accessibility features'
      }
    }
  }
}
```

### 3. 覆盖率分析器
分析测试覆盖率并生成补充测试：

```typescript
// 覆盖率分析器
class CoverageAnalyzer {
  analyzeCoverage(testFile: string, componentFile: string): {
    currentCoverage: CoverageReport
    missingCoverage: MissingCoverage[]
    additionalTests: TestCase[]
    recommendations: string[]
  } {
    const currentCoverage = this.parseCoverageReport(testFile)
    const componentAnalysis = this.analyzeComponent(componentFile)
    const missingCoverage = this.identifyMissingCoverage(currentCoverage, componentAnalysis)

    return {
      currentCoverage,
      missingCoverage,
      additionalTests: this.generateAdditionalTests(missingCoverage),
      recommendations: this.generateRecommendations(missingCoverage)
    }
  }

  private identifyMissingCoverage(
    coverage: CoverageReport,
    analysis: ComponentAnalysis
  ): MissingCoverage[] {
    const missing: MissingCoverage[] = []

    // 检查未测试的 props
    analysis.props.forEach(prop => {
      if (!coverage.props.includes(prop.name)) {
        missing.push({
          type: 'prop',
          name: prop.name,
          description: `Prop '${prop.name}' is not tested`,
          priority: prop.required ? 'high' : 'medium'
        })
      }
    })

    // 检查未测试的变体
    analysis.variants.forEach(variant => {
      if (!coverage.variants.includes(variant.name)) {
        missing.push({
          type: 'variant',
          name: variant.name,
          description: `Variant '${variant.name}' is not tested`,
          priority: 'medium'
        })
      }
    })

    // 检查未测试的事件
    analysis.events.forEach(event => {
      if (!coverage.events.includes(event.name)) {
        missing.push({
          type: 'event',
          name: event.name,
          description: `Event '${event.name}' is not tested`,
          priority: 'high'
        })
      }
    })

    return missing
  }

  private generateAdditionalTests(missing: MissingCoverage[]): TestCase[] {
    return missing.map(item => {
      switch (item.type) {
        case 'prop':
          return {
            name: `handles ${item.name} prop`,
            test: `
    it('handles ${item.name} prop', () => {
      render(<${this.componentName} ${item.name}="${this.getMockValue(item)}">Test</${this.componentName}>)
      // Add assertions for ${item.name} prop
    })`,
            category: 'prop'
          }
        case 'variant':
          return {
            name: `renders ${item.name} variant`,
            test: `
    it('renders ${item.name} variant', () => {
      render(<${this.componentName} variant="${item.name}">Test</${this.componentName}>)
      // Add assertions for ${item.name} variant
    })`,
            category: 'variant'
          }
        case 'event':
          return {
            name: `handles ${item.name} event`,
            test: `
    it('handles ${item.name} event', async () => {
      const user = userEvent.setup()
      const handler = vi.fn()

      render(<${this.componentName} on${item.name.charAt(0).toUpperCase() + item.name.slice(1)}={handler}>Test</${this.componentName}>)

      await user.${this.getEventAction(item.name)}(screen.getByRole('button'))
      expect(handler).toHaveBeenCalled()
    })`,
            category: 'event'
          }
        default:
          return null
      }
    }).filter(Boolean) as TestCase[]
  }
}
```

### 4. E2E 测试生成器
生成端到端测试用例：

```typescript
// E2E 测试生成器
class E2ETestGenerator {
  generateE2ETests(componentName: string, componentInfo: ComponentInfo): {
    testFile: string
    testScenarios: E2ETestScenario[]
    pageObjects: PageObject[]
  } {
    return {
      testFile: this.generateE2ETestFile(componentName),
      testScenarios: [
        this.generateBasicE2EScenario(componentName),
        this.generateVariantE2EScenario(componentName, componentInfo.variants),
        this.generateInteractionE2EScenario(componentName, componentInfo.interactions),
        this.generateAccessibilityE2EScenario(componentName)
      ],
      pageObjects: [this.generatePageObject(componentName)]
    }
  }

  private generateBasicE2EScenario(componentName: string): E2ETestScenario {
    return {
      name: 'Basic Component Rendering',
      description: 'Verify component renders correctly in browser',
      steps: [
        'Navigate to component page',
        'Locate component element',
        'Verify component is visible',
        'Verify content is displayed correctly'
      ],
      testCode: `
describe('${componentName} E2E Tests', () => {
  it('renders correctly in browser', async () => {
    await page.goto('/components/${componentName.toLowerCase()}')

    const component = await page.locator('.xorigo-${componentName.toLowerCase()}')
    await expect(component).toBeVisible()

    const content = await component.locator('text=Test Content')
    await expect(content).toBeVisible()
  })
})
      `.trim()
    }
  }

  private generateInteractionE2EScenario(
    componentName: string,
    interactions: Interaction[]
  ): E2ETestScenario {
    return {
      name: 'Component Interactions',
      description: 'Verify component interactions work correctly',
      steps: [
        'Navigate to component page',
        'Locate interactive elements',
        'Perform user interactions',
        'Verify component responds correctly',
        'Check visual feedback'
      ],
      testCode: `
    it('handles interactions correctly', async () => {
      await page.goto('/components/${componentName.toLowerCase()}')

      const button = await page.locator('.xorigo-${componentName.toLowerCase()}')

      // Test click interaction
      await button.click()
      await expect(button).toHaveClass(/active|pressed/)

      // Test hover state
      await button.hover()
      await expect(button).toHaveClass(/hover/)

      // Test keyboard navigation
      await button.press('Tab')
      await expect(button).toBeFocused()

      await button.press('Enter')
      await expect(button).toHaveClass(/active/)
    })
      `.trim()
    }
  }
}
```

### 5. 视觉回归测试生成器
生成视觉回归测试配置：

```typescript
// 视觉回归测试生成器
class VisualRegressionGenerator {
  generateVisualTests(componentName: string, variants: Variant[]): {
    testConfig: string
    testCases: VisualTestCase[]
    screenshotScenarios: ScreenshotScenario[]
  } {
    return {
      testConfig: this.generateVisualTestConfig(),
      testCases: this.generateVisualTestCases(componentName, variants),
      screenshotScenarios: this.generateScreenshotScenarios(componentName, variants)
    }
  }

  private generateScreenshotScenarios(componentName: string, variants: Variant[]): ScreenshotScenario[] {
    const scenarios: ScreenshotScenario[] = []

    // 基础状态截图
    scenarios.push({
      name: 'default',
      description: 'Default component state',
      props: {},
      viewport: { width: 1024, height: 768 }
    })

    // 变体截图
    variants.forEach(variant => {
      scenarios.push({
        name: `variant-${variant.name}`,
        description: `${variant.name} variant`,
        props: { variant: variant.name },
        viewport: { width: 1024, height: 768 }
      })
    })

    // 响应式截图
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'wide', width: 1920, height: 1080 }
    ]

    viewports.forEach(viewport => {
      scenarios.push({
        name: `responsive-${viewport.name}`,
        description: `Responsive layout on ${viewport.name}`,
        props: {},
        viewport: { width: viewport.width, height: viewport.height }
      })
    })

    return scenarios
  }
}
```

## 测试标准

### 覆盖率要求
- **语句覆盖率**: ≥ 90%
- **分支覆盖率**: ≥ 85%
- **函数覆盖率**: ≥ 90%
- **行覆盖率**: ≥ 90%

### 测试类别
1. **渲染测试**: 组件基本渲染功能
2. **变体测试**: 所有变体和状态
3. **交互测试**: 用户交互和事件处理
4. **可访问性测试**: WCAG 2.1 AA 合规性
5. **主题测试**: 主题适配和配方切换
6. **视觉测试**: 视觉回归和布局一致性

### 测试工具链
- **单元测试**: Vitest + Testing Library
- **E2E测试**: Playwright
- **可访问性**: axe-core
- **视觉测试**: Playwright + Chromatic
- **覆盖率**: c8/v8

## 使用示例

```bash
# 生成组件测试
"为 Button 组件生成完整的测试套件，包括单元测试、可访问性测试和主题测试"

# 分析测试覆盖率
"分析 Card 组件的测试覆盖率，识别未覆盖的代码路径并生成补充测试"

# 生成 E2E 测试
"为 Modal 组件生成端到端测试，包括键盘导航和焦点管理测试"

# 创建视觉回归测试
"为 Input 组件创建视觉回归测试，覆盖所有变体和响应式布局"
```

## 输出格式

1. **测试文件**: 完整的测试代码文件
2. **测试数据**: 模拟数据和 fixtures
3. **覆盖率报告**: 详细的覆盖率分析
4. **E2E测试**: 端到端测试场景
5. **视觉测试**: 视觉回归测试配置

## 技术依据

基于 Xorigo UI 的测试标准和 React 19 + TypeScript 5.9 最佳实践：

- **测试驱动**: 组件开发伴随测试编写
- **全面覆盖**: 功能、可访问性、主题、交互全覆盖
- **自动化**: CI/CD 集成的自动化测试
- **质量保证**: 高覆盖率和严格的质量标准

确保所有组件具备可靠的质量保证和良好的用户体验。