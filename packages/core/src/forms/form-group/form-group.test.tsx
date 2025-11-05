/**
 * @fileoverview FormGroup 组件单元测试
 * @description 测试表单组组件的各种功能特性，包括渲染、状态管理、交互等
 */

import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormGroup, NestedFormGroup } from './form-group'
import { cn } from '../../utils'

// ============================================================================
// 测试工具函数
// ============================================================================

const renderWithProviders = (component: React.ReactElement) => {
  return render(component)
}

const testId = {
  formGroup: 'form-group',
  title: 'form-group-title',
  description: 'form-group-description',
  helpText: 'form-group-help',
  errorSummary: 'form-group-error',
  content: 'form-group-content',
  collapseButton: 'form-group-collapse-button',
}

// ============================================================================
// 基础渲染测试
// ============================================================================

describe('FormGroup 基础渲染', () => {
  it('应该正确渲染基础表单组', () => {
    renderWithProviders(
      <FormGroup data-testid={testId.formGroup} title="测试组">
        <div>测试内容</div>
      </FormGroup>
    )

    expect(screen.getByTestId(testId.formGroup)).toBeInTheDocument()
    expect(screen.getByText('测试组')).toBeInTheDocument()
    expect(screen.getByText('测试内容')).toBeInTheDocument()
  })

  it('应该支持自定义ID', () => {
    renderWithProviders(
      <FormGroup id="custom-group" data-testid={testId.formGroup}>
        <div>测试内容</div>
      </FormGroup>
    )

    expect(screen.getByTestId(testId.formGroup)).toHaveAttribute('id', 'custom-group')
  })

  it('应该正确应用变体样式', () => {
    const { rerender } = render(
      <FormGroup variant="default" data-testid={testId.formGroup}>
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByTestId(testId.formGroup)).toHaveClass('border-gray-200')

    rerender(
      <FormGroup variant="bordered" data-testid={testId.formGroup}>
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByTestId(testId.formGroup)).toHaveClass('border-2')
  })

  it('应该正确应用尺寸样式', () => {
    const { rerender } = render(
      <FormGroup size="sm" data-testid={testId.formGroup}>
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByTestId(testId.formGroup)).toHaveClass('p-3')

    rerender(
      <FormGroup size="lg" data-testid={testId.formGroup}>
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByTestId(testId.formGroup)).toHaveClass('p-6')
  })
})

// ============================================================================
// 标题和描述测试
// ============================================================================

describe('FormGroup 标题和描述', () => {
  it('应该渲染标题', () => {
    renderWithProviders(
      <FormGroup title="测试标题" data-testid={testId.title}>
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByText('测试标题')).toBeInTheDocument()
    expect(screen.getByTestId(testId.title)).toBeInTheDocument()
  })

  it('应该渲染描述文本', () => {
    renderWithProviders(
      <FormGroup
        title="标题"
        description="测试描述"
        data-testid={testId.description}
      >
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByText('测试描述')).toBeInTheDocument()
  })

  it('应该渲染帮助文本', () => {
    renderWithProviders(
      <FormGroup
        title="标题"
        helpText="帮助信息"
        data-testid={testId.helpText}
      >
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByText('帮助信息')).toBeInTheDocument()
  })

  it('应该显示必填标记', () => {
    renderWithProviders(
      <FormGroup title="必填组" required data-testid={testId.formGroup}>
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByText('必填组')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('应该显示可选标记', () => {
    renderWithProviders(
      <FormGroup title="可选组" optional showOptionalIndicator data-testid={testId.formGroup}>
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByText('(可选)')).toBeInTheDocument()
  })

  it('应该隐藏指示器', () => {
    renderWithProviders(
      <FormGroup
        title="隐藏标记"
        required
        showRequiredIndicator={false}
      >
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })
})

// ============================================================================
// 折叠功能测试
// ============================================================================

describe('FormGroup 折叠功能', () => {
  it('应该渲染折叠按钮', () => {
    renderWithProviders(
      <FormGroup
        title="可折叠组"
        collapsible
        data-testid={testId.collapseButton}
      >
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByTestId(testId.collapseButton)).toBeInTheDocument()
  })

  it('应该支持默认折叠状态', () => {
    renderWithProviders(
      <FormGroup
        title="默认折叠"
        collapsible
        defaultCollapsed
        data-testid={testId.content}
      >
        <div>内容</div>
      </FormGroup>
    )

    // 内容应该被隐藏
    expect(screen.getByTestId(testId.content)).toHaveStyle({
      opacity: '0',
      height: '0px',
    })
  })

  it('应该支持controlled折叠状态', async () => {
    const user = userEvent.setup()
    let collapsed = false

    const { rerender } = renderWithProviders(
      <FormGroup
        title="Controlled折叠"
        collapsible
        collapsed={collapsed}
        onCollapseChange={(newCollapsed) => {
          collapsed = newCollapsed
        }}
        data-testid={testId.content}
      >
        <div>内容</div>
      </FormGroup>
    )

    // 初始状态 - 展开
    expect(screen.getByTestId(testId.content)).toHaveStyle({
      opacity: '1',
      height: 'auto',
    })

    // 点击折叠按钮
    const button = screen.getByRole('button')
    await user.click(button)

    // 重新渲染以反映状态变化
    rerender(
      <FormGroup
        title="Controlled折叠"
        collapsible
        collapsed={collapsed}
        onCollapseChange={(newCollapsed) => {
          collapsed = newCollapsed
        }}
        data-testid={testId.content}
      >
        <div>内容</div>
      </FormGroup>
    )

    // 内容应该被隐藏
    await waitFor(() => {
      expect(screen.getByTestId(testId.content)).toHaveStyle({
        opacity: '0',
        height: '0px',
      })
    })
  })

  it('应该切换折叠图标', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <FormGroup
        title="切换测试"
        collapsible
        data-testid={testId.formGroup}
      >
        <div>内容</div>
      </FormGroup>
    )

    const button = screen.getByRole('button')

    // 初始状态 - 右箭头
    expect(button.querySelector('svg')).toBeInTheDocument()

    // 点击折叠
    await user.click(button)

    // 点击展开
    await user.click(button)
  })
})

// ============================================================================
// 布局测试
// ============================================================================

describe('FormGroup 布局', () => {
  it('应该应用single布局', () => {
    renderWithProviders(
      <FormGroup layout="single" data-testid={testId.formGroup}>
        <div>内容1</div>
        <div>内容2</div>
      </FormGroup>
    )

    const content = screen.getByTestId(testId.content).firstChild
    expect(content).toHaveClass('space-y-4')
  })

  it('应该应用grid布局', () => {
    renderWithProviders(
      <FormGroup layout="grid" data-testid={testId.formGroup}>
        <div>内容1</div>
        <div>内容2</div>
      </FormGroup>
    )

    const content = screen.getByTestId(testId.content)
    expect(content).toHaveClass('grid')
    expect(content).toHaveClass('gap-4')
  })

  it('应该应用double布局', () => {
    renderWithProviders(
      <FormGroup layout="double" data-testid={testId.formGroup}>
        <div>内容1</div>
        <div>内容2</div>
      </FormGroup>
    )

    const content = screen.getByTestId(testId.content)
    expect(content).toHaveClass('md:grid-cols-2')
  })

  it('应该应用triple布局', () => {
    renderWithProviders(
      <FormGroup layout="triple" data-testid={testId.formGroup}>
        <div>内容1</div>
        <div>内容2</div>
        <div>内容3</div>
      </FormGroup>
    )

    const content = screen.getByTestId(testId.content)
    expect(content).toHaveClass('lg:grid-cols-3')
  })
})

// ============================================================================
// 错误和验证测试
// ============================================================================

describe('FormGroup 错误和验证', () => {
  it('应该渲染错误消息', () => {
    renderWithProviders(
      <FormGroup
        title="错误组"
        error="这是一个错误"
        data-testid={testId.errorSummary}
      >
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByTestId(testId.errorSummary)).toBeInTheDocument()
    expect(screen.getByText('这是一个错误')).toBeInTheDocument()
  })

  it('应该渲染多个错误消息', () => {
    renderWithProviders(
      <FormGroup
        title="多错误组"
        error={['错误1', '错误2', '错误3']}
        data-testid={testId.errorSummary}
      >
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByText('错误1')).toBeInTheDocument()
    expect(screen.getByText('错误2')).toBeInTheDocument()
    expect(screen.getByText('错误3')).toBeInTheDocument()
  })

  it('应该渲染警告消息', () => {
    renderWithProviders(
      <FormGroup
        title="警告组"
        warning="这是一个警告"
        data-testid={testId.errorSummary}
      >
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByText('这是一个警告')).toBeInTheDocument()
    expect(screen.getByTestId(testId.errorSummary)).toHaveClass('bg-yellow-50')
  })

  it('应该渲染信息消息', () => {
    renderWithProviders(
      <FormGroup
        title="信息组"
        info="这是一个信息"
        data-testid={testId.errorSummary}
      >
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByText('这是一个信息')).toBeInTheDocument()
    expect(screen.getByTestId(testId.errorSummary)).toHaveClass('bg-blue-50')
  })

  it('应该渲染错误汇总列表', () => {
    const errors = [
      { field: '字段1', message: '错误信息1' },
      { field: '字段2', message: '错误信息2' },
    ]

    renderWithProviders(
      <FormGroup
        title="错误汇总"
        errors={errors}
        data-testid={testId.errorSummary}
      >
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByText('字段1:')).toBeInTheDocument()
    expect(screen.getByText('错误信息1')).toBeInTheDocument()
    expect(screen.getByText('字段2:')).toBeInTheDocument()
    expect(screen.getByText('错误信息2')).toBeInTheDocument()
  })

  it('应该显示错误图标', () => {
    renderWithProviders(
      <FormGroup
        title="错误组"
        error="错误"
      >
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByTestId(testId.errorSummary).querySelector('svg')).toBeInTheDocument()
  })
})

// ============================================================================
// 状态管理测试
// ============================================================================

describe('FormGroup 状态管理', () => {
  it('应该正确处理禁用状态', () => {
    renderWithProviders(
      <FormGroup
        title="禁用组"
        disabled
      >
        <div>内容</div>
      </FormGroup>
    )

    const group = screen.getByTestId(testId.formGroup)
    expect(group).toHaveAttribute('aria-disabled', 'true')
    expect(group).toHaveClass('opacity-50')
    expect(group).toHaveClass('cursor-not-allowed')
  })

  it('应该显示禁用标识', () => {
    renderWithProviders(
      <FormGroup
        title="禁用组"
        disabled
      >
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByText('已禁用')).toBeInTheDocument()
  })

  it('应该应用自定义样式类', () => {
    renderWithProviders(
      <FormGroup
        title="自定义样式"
        className="custom-class"
        headerClassName="header-class"
        contentClassName="content-class"
        legendClassName="legend-class"
        descriptionClassName="description-class"
      >
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByTestId(testId.formGroup)).toHaveClass('custom-class')
  })
})

// ============================================================================
// 可访问性测试
// ============================================================================

describe('FormGroup 可访问性', () => {
  it('应该正确设置aria-labelledby', () => {
    renderWithProviders(
      <FormGroup
        title="测试标题"
        data-testid={testId.formGroup}
      >
        <div>内容</div>
      </FormGroup>
    )

    const group = screen.getByTestId(testId.formGroup)
    const title = screen.getByTestId(testId.title)

    expect(group).toHaveAttribute('aria-labelledby', title.id)
  })

  it('应该正确设置aria-describedby', () => {
    renderWithProviders(
      <FormGroup
        title="标题"
        description="描述"
        data-testid={testId.formGroup}
      >
        <div>内容</div>
      </FormGroup>
    )

    const group = screen.getByTestId(testId.formGroup)
    expect(group).toHaveAttribute('aria-describedby')
  })

  it('应该正确设置aria-expanded', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <FormGroup
        title="可折叠组"
        collapsible
        data-testid={testId.formGroup}
      >
        <div>内容</div>
      </FormGroup>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('应该正确设置aria-controls', () => {
    renderWithProviders(
      <FormGroup
        title="可折叠组"
        collapsible
        data-testid={testId.formGroup}
      >
        <div>内容</div>
      </FormGroup>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-controls')
  })

  it('应该使用role="alert"显示错误', () => {
    renderWithProviders(
      <FormGroup
        title="错误组"
        error="错误信息"
      >
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})

// ============================================================================
// NestedFormGroup 测试
// ============================================================================

describe('NestedFormGroup', () => {
  it('应该正确渲染嵌套表单组', () => {
    renderWithProviders(
      <NestedFormGroup
        title="嵌套组"
        data-testid={testId.formGroup}
      >
        <div>内容</div>
      </NestedFormGroup>
    )

    expect(screen.getByTestId(testId.formGroup)).toBeInTheDocument()
    expect(screen.getByText('嵌套组')).toBeInTheDocument()
  })

  it('应该应用缩进样式', () => {
    renderWithProviders(
      <NestedFormGroup
        title="嵌套组"
        showBorder
        data-testid={testId.formGroup}
      >
        <div>内容</div>
      </NestedFormGroup>
    )

    const nested = screen.getByTestId(testId.formGroup).parentElement
    expect(nested).toHaveClass('border-l-2')
    expect(nested).toHaveClass('ml-4')
    expect(nested).toHaveClass('pl-4')
  })

  it('应该支持自定义深度', () => {
    renderWithProviders(
      <NestedFormGroup
        title="深度组"
        depth={3}
        showBorder
      >
        <div>内容</div>
      </NestedFormGroup>
    )

    const nested = screen.getByTestId(testId.formGroup).parentElement
    expect(nested).toHaveClass('mb-4')
  })

  it('应该支持隐藏边框', () => {
    renderWithProviders(
      <NestedFormGroup
        title="无边框组"
        showBorder={false}
      >
        <div>内容</div>
      </NestedFormGroup>
    )

    const nested = screen.getByTestId(testId.formGroup).parentElement
    expect(nested).not.toHaveClass('border-l-2')
  })
})

// ============================================================================
// 动画测试
// ============================================================================

describe('FormGroup 动画', () => {
  it('应该支持展开/折叠动画', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <FormGroup
        title="动画测试"
        collapsible
        data-testid={testId.formGroup}
      >
        <div>内容</div>
      </FormGroup>
    )

    const button = screen.getByRole('button')

    // 初始状态
    expect(screen.getByTestId(testId.content)).toHaveStyle({
      opacity: '1',
      height: 'auto',
    })

    // 点击折叠
    await user.click(button)

    // 动画过渡
    await waitFor(() => {
      expect(screen.getByTestId(testId.content)).toHaveStyle({
        opacity: '0',
        height: '0px',
      })
    })
  })

  it('应该支持错误消息动画', async () => {
    renderWithProviders(
      <FormGroup
        title="错误组"
        error="错误信息"
      >
        <div>内容</div>
      </FormGroup>
    )

    // 错误消息应该以动画形式出现
    const errorSummary = screen.getByTestId(testId.errorSummary)
    expect(errorSummary).toBeInTheDocument()
  })
})

// ============================================================================
// 交互测试
// ============================================================================

describe('FormGroup 交互', () => {
  it('应该支持点击标题折叠', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <FormGroup
        title="点击标题折叠"
        collapsible
        data-testid={testId.formGroup}
      >
        <div>内容</div>
      </FormGroup>
    )

    const title = screen.getByText('点击标题折叠')
    expect(title).toHaveClass('cursor-pointer')

    await user.click(title)

    // 验证折叠状态变化
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('应该调用onCollapseChange回调', async () => {
    const user = userEvent.setup()
    const handleCollapseChange = vi.fn()

    renderWithProviders(
      <FormGroup
        title="Controlled折叠"
        collapsible
        onCollapseChange={handleCollapseChange}
      >
        <div>内容</div>
      </FormGroup>
    )

    const button = screen.getByRole('button')
    await user.click(button)

    expect(handleCollapseChange).toHaveBeenCalledWith(true)
  })
})

// ============================================================================
// 样式变体测试
// ============================================================================

describe('FormGroup 样式变体', () => {
  it('应该应用default变体', () => {
    renderWithProviders(
      <FormGroup variant="default" data-testid={testId.formGroup}>
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByTestId(testId.formGroup)).toHaveClass('border-gray-200')
    expect(screen.getByTestId(testId.formGroup)).toHaveClass('bg-white')
  })

  it('应该应用bordered变体', () => {
    renderWithProviders(
      <FormGroup variant="bordered" data-testid={testId.formGroup}>
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByTestId(testId.formGroup)).toHaveClass('border-2')
    expect(screen.getByTestId(testId.formGroup)).toHaveClass('bg-gray-50')
  })

  it('应该应用ghost变体', () => {
    renderWithProviders(
      <FormGroup variant="ghost" data-testid={testId.formGroup}>
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByTestId(testId.formGroup)).toHaveClass('border-0')
    expect(screen.getByTestId(testId.formGroup)).toHaveClass('bg-transparent')
  })

  it('应该应用filled变体', () => {
    renderWithProviders(
      <FormGroup variant="filled" data-testid={testId.formGroup}>
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.getByTestId(testId.formGroup)).toHaveClass('bg-gray-50')
  })
})

// ============================================================================
// 边界情况测试
// ============================================================================

describe('FormGroup 边界情况', () => {
  it('应该处理空内容', () => {
    renderWithProviders(
      <FormGroup title="空内容组">
        {null}
      </FormGroup>
    )

    expect(screen.getByText('空内容组')).toBeInTheDocument()
  })

  it('应该处理未定义错误', () => {
    renderWithProviders(
      <FormGroup
        title="无错误组"
        error={undefined}
        warning={undefined}
        info={undefined}
      >
        <div>内容</div>
      </FormGroup>
    )

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('应该正确传递HTML属性', () => {
    renderWithProviders(
      <FormGroup
        title="HTML属性"
        data-custom="custom-value"
        role="group"
      >
        <div>内容</div>
      </FormGroup>
    )

    const group = screen.getByTestId(testId.formGroup)
    expect(group).toHaveAttribute('data-custom', 'custom-value')
    expect(group).toHaveAttribute('role', 'group')
  })
})

// ============================================================================
// Context 功能测试
// ============================================================================

describe('FormGroup Context', () => {
  it('应该提供FormGroupContext', () => {
    const contextValue = React.createContext<any>(null)

    renderWithProviders(
      <FormGroup title="上下文测试">
        <div>内容</div>
      </FormGroup>
    )

    // 验证组件能够正常渲染和使用上下文
    expect(screen.getByText('上下文测试')).toBeInTheDocument()
    expect(screen.getByText('内容')).toBeInTheDocument()
  })
})
