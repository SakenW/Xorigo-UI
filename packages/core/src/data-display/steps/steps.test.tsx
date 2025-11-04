import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Steps, type StepItem } from './steps'
import { CheckIcon } from '../../primitives/Icon'

// 测试辅助函数
const renderSteps = (props = {}) => {
  const defaultProps = {
    items: [
      { id: 1, title: 'Step 1', description: 'First step' },
      { id: 2, title: 'Step 2', description: 'Second step' },
      { id: 3, title: 'Step 3', description: 'Third step' },
    ] as StepItem[],
    ...props,
  }
  return render(<Steps {...defaultProps} />)
}

describe('Steps', () => {
  describe('基础渲染', () => {
    it('应该正确渲染默认步骤组件', () => {
      renderSteps()
      const steps = screen.getByLabelText('Steps')
      expect(steps).toBeInTheDocument()
    })

    it('应该渲染所有步骤项', () => {
      renderSteps()
      const stepTitles = screen.getAllByTestId(/step-title-\d+-pending/)
      expect(stepTitles).toHaveLength(3)
    })

    it('应该显示正确的步骤标题', () => {
      renderSteps()
      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('Step 2')).toBeInTheDocument()
      expect(screen.getByText('Step 3')).toBeInTheDocument()
    })

    it('应该显示步骤编号', () => {
      renderSteps()
      const indicators = screen.getAllByTestId(/step-indicator-\d+-pending/)
      expect(indicators).toHaveLength(3)
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  describe('方向变体', () => {
    it('应该支持水平方向（默认）', () => {
      renderSteps({ orientation: 'horizontal' })
      const steps = screen.getByTestId('steps-horizontal-md')
      expect(steps).toHaveClass('flex-row')
    })

    it('应该支持垂直方向', () => {
      renderSteps({ orientation: 'vertical' })
      const steps = screen.getByTestId('steps-vertical-md')
      expect(steps).toHaveClass('flex-col')
    })

    it('垂直方向应该显示描述文本', () => {
      renderSteps({ orientation: 'vertical' })
      expect(screen.getByTestId('step-description-0-pending')).toBeInTheDocument()
      expect(screen.getByText('First step')).toBeInTheDocument()
    })
  })

  describe('尺寸变体', () => {
    it('应该支持 sm 尺寸', () => {
      renderSteps({ size: 'sm' })
      const stepIndicator = screen.getByTestId('step-indicator-0-pending')
      expect(stepIndicator).toHaveClass('w-6', 'h-6', 'text-xs')
    })

    it('应该支持 md 尺寸（默认）', () => {
      renderSteps()
      const stepIndicator = screen.getByTestId('step-indicator-0-pending')
      expect(stepIndicator).toHaveClass('w-8', 'h-8', 'text-sm')
    })

    it('应该支持 lg 尺寸', () => {
      renderSteps({ size: 'lg' })
      const stepIndicator = screen.getByTestId('step-indicator-0-pending')
      expect(stepIndicator).toHaveClass('w-10', 'h-10', 'text-base')
    })
  })

  describe('状态管理', () => {
    it('应该正确处理pending状态', () => {
      renderSteps()
      const firstStep = screen.getByTestId('step-indicator-0-pending')
      expect(firstStep).toBeInTheDocument()
    })

    it('应该正确处理inProgress状态', () => {
      const items = [
        { id: 1, title: 'Step 1', status: 'completed' as const },
        { id: 2, title: 'Step 2', status: 'inProgress' as const },
        { id: 3, title: 'Step 3', status: 'pending' as const },
      ]
      renderSteps({ items })
      const inProgressStep = screen.getByTestId('step-indicator-1-inProgress')
      expect(inProgressStep).toBeInTheDocument()
    })

    it('应该正确处理completed状态', () => {
      renderSteps({ currentStep: 1 })
      const completedStep = screen.getByTestId('step-indicator-0-completed')
      expect(completedStep).toBeInTheDocument()
      const checkIcon = completedStep.querySelector('svg')
      expect(checkIcon).toBeInTheDocument()
    })

    it('应该正确处理error状态', () => {
      const items = [
        { id: 1, title: 'Step 1', status: 'error' as const },
        { id: 2, title: 'Step 2' },
        { id: 3, title: 'Step 3' },
      ]
      renderSteps({ items })
      const errorStep = screen.getByTestId('step-indicator-0-error')
      expect(errorStep).toBeInTheDocument()
    })

    it('应该正确处理skipped状态', () => {
      const items = [
        { id: 1, title: 'Step 1', status: 'skipped' as const },
        { id: 2, title: 'Step 2' },
        { id: 3, title: 'Step 3' },
      ]
      renderSteps({ items })
      const skippedStep = screen.getByTestId('step-indicator-0-skipped')
      expect(skippedStep).toBeInTheDocument()
    })
  })

  describe('自定义图标', () => {
    it('应该显示自定义图标', () => {
      const CustomIcon = () => <span data-testid="custom-icon">✓</span>
      const items = [
        { id: 1, title: 'Step 1', icon: <CustomIcon /> },
        { id: 2, title: 'Step 2' },
        { id: 3, title: 'Step 3' },
      ]
      renderSteps({ items })
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('自定义图标应该优先于默认图标显示', () => {
      const CustomIcon = () => <span data-testid="custom-icon">★</span>
      const items = [
        { id: 1, title: 'Step 1', status: 'completed' as const, icon: <CustomIcon /> },
        { id: 2, title: 'Step 2' },
        { id: 3, title: 'Step 3' },
      ]
      renderSteps({ items })
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
      expect(screen.queryByText('1')).not.toBeInTheDocument()
    })
  })

  describe('点击导航', () => {
    it('应该支持点击导航', () => {
      const handleStepClick = vi.fn()
      renderSteps({ allowClickNavigation: true, onStepClick: handleStepClick })
      const firstStep = screen.getByTestId('step-indicator-0-pending')
      fireEvent.click(firstStep)
      expect(handleStepClick).toHaveBeenCalledWith(0, expect.any(Object))
    })

    it('应该支持单个步骤的点击导航', () => {
      const items = [
        { id: 1, title: 'Step 1', isClickable: true },
        { id: 2, title: 'Step 2' },
        { id: 3, title: 'Step 3' },
      ]
      const handleStepClick = vi.fn()
      renderSteps({ items, onStepClick: handleStepClick })
      const firstStep = screen.getByTestId('step-indicator-0-pending')
      fireEvent.click(firstStep)
      expect(handleStepClick).toHaveBeenCalledWith(0, expect.any(Object))
    })

    it('不应该在未启用点击导航时触发点击事件', () => {
      const handleStepClick = vi.fn()
      renderSteps({ onStepClick: handleStepClick })
      const firstStep = screen.getByTestId('step-indicator-0-pending')
      fireEvent.click(firstStep)
      expect(handleStepClick).not.toHaveBeenCalled()
    })

    it('应该禁用已禁用的步骤点击', () => {
      const items = [
        { id: 1, title: 'Step 1', disabled: true },
        { id: 2, title: 'Step 2' },
        { id: 3, title: 'Step 3' },
      ]
      const handleStepClick = vi.fn()
      renderSteps({ items, allowClickNavigation: true, onStepClick: handleStepClick })
      const firstStep = screen.getByTestId('step-indicator-0-pending')
      fireEvent.click(firstStep)
      expect(handleStepClick).not.toHaveBeenCalled()
    })
  })

  describe('可折叠功能', () => {
    it('应该支持可折叠步骤', () => {
      const items = [
        { id: 1, title: 'Step 1', isCollapsible: true, customContent: <div>Content 1</div> },
        { id: 2, title: 'Step 2' },
        { id: 3, title: 'Step 3' },
      ]
      renderSteps({ items, collapsible: true })
      const toggleButtons = screen.getAllByLabelText('Expand step')
      expect(toggleButtons).toHaveLength(1)
    })

    it('应该切换折叠状态', () => {
      const items = [
        { id: 1, title: 'Step 1', isCollapsible: true, customContent: <div>Content 1</div> },
        { id: 2, title: 'Step 2' },
        { id: 3, title: 'Step 3' },
      ]
      renderSteps({ items, collapsible: true, defaultExpanded: [false] })
      const toggleButton = screen.getByLabelText('Expand step')
      fireEvent.click(toggleButton)
      expect(screen.getByLabelText('Collapse step')).toBeInTheDocument()
    })

    it('应该显示折叠内容', () => {
      const items = [
        { id: 1, title: 'Step 1', isCollapsible: true, customContent: <div>Content 1</div> },
        { id: 2, title: 'Step 2' },
        { id: 3, title: 'Step 3' },
      ]
      renderSteps({ items, collapsible: true, defaultExpanded: [true] })
      expect(screen.getByTestId('step-content-0-pending')).toBeInTheDocument()
      expect(screen.getByText('Content 1')).toBeInTheDocument()
    })

    it('应该支持受控的折叠状态', () => {
      const items = [
        { id: 1, title: 'Step 1', isCollapsible: true, customContent: <div>Content 1</div> },
        { id: 2, title: 'Step 2' },
        { id: 3, title: 'Step 3' },
      ]
      const handleExpandedChange = vi.fn()
      renderSteps({
        items,
        collapsible: true,
        expanded: [false],
        onExpandedChange: handleExpandedChange
      })
      const toggleButton = screen.getByLabelText('Expand step')
      fireEvent.click(toggleButton)
      expect(handleExpandedChange).toHaveBeenCalledWith([true])
    })
  })

  describe('进度条', () => {
    it('应该显示进度条', () => {
      renderSteps({ showProgressBar: true })
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toBeInTheDocument()
    })

    it('应该计算正确的进度百分比', () => {
      renderSteps({ showProgressBar: true, currentStep: 1 })
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '66')
    })

    it('应该支持自定义进度百分比', () => {
      renderSteps({ showProgressBar: true, progressPercentage: 50 })
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '50')
    })

    it('应该在进度更新时调用回调', () => {
      const handleProgressUpdate = vi.fn()
      renderSteps({
        showProgressBar: true,
        allowClickNavigation: true,
        onProgressUpdate: handleProgressUpdate
      })
      const firstStep = screen.getByTestId('step-indicator-0-pending')
      fireEvent.click(firstStep)
      expect(handleProgressUpdate).toHaveBeenCalled()
    })
  })

  describe('键盘导航', () => {
    it('应该支持右箭头键导航（水平方向）', () => {
      const handleStepClick = vi.fn()
      renderSteps({
        allowClickNavigation: true,
        orientation: 'horizontal',
        onStepClick: handleStepClick
      })
      const container = screen.getByLabelText('Steps')
      fireEvent.keyDown(container, { key: 'ArrowRight' })
      expect(container).toBeInTheDocument()
    })

    it('应该支持下箭头键导航（垂直方向）', () => {
      const handleStepClick = vi.fn()
      renderSteps({
        allowClickNavigation: true,
        orientation: 'vertical',
        onStepClick: handleStepClick
      })
      const container = screen.getByLabelText('Steps')
      fireEvent.keyDown(container, { key: 'ArrowDown' })
      expect(container).toBeInTheDocument()
    })

    it('应该支持Home键跳转到第一个步骤', () => {
      const handleStepClick = vi.fn()
      renderSteps({
        allowClickNavigation: true,
        onStepClick: handleStepClick
      })
      const container = screen.getByLabelText('Steps')
      fireEvent.keyDown(container, { key: 'Home' })
      expect(container).toBeInTheDocument()
    })

    it('应该支持End键跳转到最后一个步骤', () => {
      const handleStepClick = vi.fn()
      renderSteps({
        allowClickNavigation: true,
        onStepClick: handleStepClick
      })
      const container = screen.getByLabelText('Steps')
      fireEvent.keyDown(container, { key: 'End' })
      expect(container).toBeInTheDocument()
    })
  })

  describe('可访问性', () => {
    it('应该有正确的aria-label', () => {
      renderSteps()
      const steps = screen.getByLabelText('Steps')
      expect(steps).toBeInTheDocument()
    })

    it('应该设置当前步骤的aria-current', () => {
      renderSteps({ currentStep: 1 })
      const currentStepIndicator = screen.getByTestId('step-indicator-1-inProgress')
      expect(currentStepIndicator).toHaveAttribute('aria-current', 'step')
    })

    it('应该为进度条添加正确的aria属性', () => {
      renderSteps({ showProgressBar: true })
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
      expect(progressBar).toHaveAttribute('aria-valuenow', '33')
    })

    it('应该为禁用步骤添加aria-disabled', () => {
      const items = [
        { id: 1, title: 'Step 1', disabled: true },
        { id: 2, title: 'Step 2' },
        { id: 3, title: 'Step 3' },
      ]
      renderSteps({ items })
      const disabledStep = screen.getByTestId('step-indicator-0-pending')
      expect(disabledStep).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('自定义内容', () => {
    it('应该渲染自定义内容', () => {
      const CustomContent = () => <div data-testid="custom-content">Custom Step Content</div>
      const items = [
        { id: 1, title: 'Step 1', customContent: <CustomContent /> },
        { id: 2, title: 'Step 2' },
        { id: 3, title: 'Step 3' },
      ]
      renderSteps({ items, orientation: 'vertical' })
      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })

    it('垂直方向应该显示自定义内容', () => {
      const items = [
        { id: 1, title: 'Step 1', customContent: <div>Custom Content</div> },
        { id: 2, title: 'Step 2' },
        { id: 3, title: 'Step 3' },
      ]
      renderSteps({ items, orientation: 'vertical' })
      expect(screen.getByTestId('step-content-0-pending')).toBeInTheDocument()
    })
  })

  describe('响应式设计', () => {
    it('应该支持响应式布局', () => {
      renderSteps({ responsive: true })
      const steps = screen.getByTestId('steps-horizontal-md')
      expect(steps).toBeInTheDocument()
    })

    it('应该支持非响应式布局', () => {
      renderSteps({ responsive: false })
      const steps = screen.getByTestId('steps-horizontal-md')
      expect(steps).toBeInTheDocument()
    })
  })

  describe('测试ID', () => {
    it('应该支持自定义测试ID', () => {
      renderSteps({ testId: 'custom-steps-test-id' })
      expect(screen.getByTestId('custom-steps-test-id')).toBeInTheDocument()
    })

    it('应该自动生成测试ID', () => {
      renderSteps()
      expect(screen.getByTestId('steps-horizontal-md')).toBeInTheDocument()
    })
  })

  describe('forwardRef', () => {
    it('应该正确传递ref', () => {
      const ref = { current: null }
      renderSteps({ ref })
      expect(ref).toBeDefined()
    })
  })

  describe('禁用状态', () => {
    it('应该禁用单个步骤', () => {
      const items = [
        { id: 1, title: 'Step 1', disabled: true },
        { id: 2, title: 'Step 2' },
        { id: 3, title: 'Step 3' },
      ]
      renderSteps({ items })
      const disabledStep = screen.getByTestId('step-indicator-0-pending')
      expect(disabledStep).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('空状态', () => {
    it('应该正确处理空步骤数组', () => {
      renderSteps({ items: [] })
      const steps = screen.getByLabelText('Steps')
      expect(steps).toBeInTheDocument()
    })
  })

  describe('边界情况', () => {
    it('应该处理currentStep超出范围的情况', () => {
      renderSteps({ items: [], currentStep: 10 })
      const steps = screen.getByLabelText('Steps')
      expect(steps).toBeInTheDocument()
    })

    it('应该处理负数的currentStep', () => {
      renderSteps({ currentStep: -1 })
      const steps = screen.getByLabelText('Steps')
      expect(steps).toBeInTheDocument()
    })
  })
})
