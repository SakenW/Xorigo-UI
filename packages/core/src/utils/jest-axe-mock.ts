/**
 * jest-axe 替代品
 * 用于可访问性测试的简化版本
 */

export interface AxeResults {
  violations: any[]
  passes: any[]
  incomplete: any[]
}

export async function axe(container: HTMLElement): Promise<AxeResults> {
  // 简化的可访问性检查
  const violations: any[] = []

  // 检查基本的可访问性问题
  const buttons = container.querySelectorAll('button')
  buttons.forEach(button => {
    if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
      violations.push({
        id: 'button-name',
        impact: 'serious',
        description: '按钮必须具有可访问的名称',
        element: button
      })
    }
  })

  const inputs = container.querySelectorAll('input')
  inputs.forEach(input => {
    if (!input.getAttribute('aria-label') &&
        !input.getAttribute('placeholder') &&
        !input.id) {
      violations.push({
        id: 'input-label',
        impact: 'serious',
        description: '输入框必须具有标签',
        element: input
      })
    }
  })

  return {
    violations,
    passes: [],
    incomplete: []
  }
}

export const toHaveNoViolations = {
  toHaveNoViolations(received: AxeResults) {
    const pass = received.violations.length === 0
    return {
      pass,
      message: () => pass
        ? 'Expected to have accessibility violations'
        : `Expected no violations but found ${received.violations.length}`
    }
  }
}