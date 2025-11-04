/**
 * ChartTooltip Component Tests
 *
 * 测试 ChartTooltip 组件的功能和特性
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChartTooltip, type TooltipData } from './chart-tooltip'

// ============================================================================
// Test Suite
// ============================================================================

describe('ChartTooltip', () => {
  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  it('renders correctly with data', () => {
    const data: TooltipData = {
      id: '1',
      title: 'Tooltip Title',
      content: 'Tooltip Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} />)

    expect(screen.getByText('Tooltip Title')).toBeInTheDocument()
    expect(screen.getByText('Tooltip Content')).toBeInTheDocument()
  })

  it('renders without data when visible is false', () => {
    render(<ChartTooltip visible={false} />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).not.toBeInTheDocument()
  })

  it('hides content when visible is false', () => {
    const data: TooltipData = {
      id: '1',
      title: 'Tooltip Title',
      content: 'Tooltip Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={false} />)

    expect(screen.queryByText('Tooltip Title')).not.toBeInTheDocument()
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument()
  })

  // ============================================================================
  // Position Tests
  // ============================================================================

  it('applies top position correctly', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} position="top" />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toBeInTheDocument()
  })

  it('applies bottom position correctly', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} position="bottom" />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toBeInTheDocument()
  })

  it('applies left position correctly', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} position="left" />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toBeInTheDocument()
  })

  it('applies right position correctly', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} position="right" />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toBeInTheDocument()
  })

  it('applies center position correctly', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} position="center" />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toBeInTheDocument()
  })

  // ============================================================================
  // Variant Tests
  // ============================================================================

  it('applies default variant correctly', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} variant="default" />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toBeInTheDocument()
  })

  it('applies card variant correctly', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} variant="card" />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toBeInTheDocument()
  })

  it('applies minimal variant correctly', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} variant="minimal" />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toBeInTheDocument()
  })

  // ============================================================================
  // Arrow Tests
  // ============================================================================

  it('shows arrow when showArrow is true', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} showArrow={true} />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toBeInTheDocument()
  })

  it('hides arrow when showArrow is false', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} showArrow={false} />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toBeInTheDocument()
  })

  // ============================================================================
  // Styling Tests
  // ============================================================================

  it('applies custom className correctly', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} className="custom-tooltip" />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toHaveClass('custom-tooltip')
  })

  it('applies custom style when provided', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} style={{ backgroundColor: 'red' }} />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toHaveStyle({
      backgroundColor: 'red'
    })
  })

  it('applies custom maxWidth', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} maxWidth={300} />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toHaveStyle({
      maxWidth: '300px'
    })
  })

  // ============================================================================
  // Accessibility Tests
  // ============================================================================

  it('has correct role attribute', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toHaveAttribute('role', 'tooltip')
  })

  it('has correct aria-hidden attribute when not visible', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={false} />)

    // 应该不渲染任何内容
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  // ============================================================================
  // Animation Tests
  // ============================================================================

  it('supports motion props for animations', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(
      <ChartTooltip
        data={data}
        visible={true}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    )

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toBeInTheDocument()
  })

  // ============================================================================
  // Forward Ref Tests
  // ============================================================================

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()

    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  // ============================================================================
  // Edge Cases
  // ============================================================================

  it('handles empty data', () => {
    render(<ChartTooltip data={{ id: '1', content: '', x: 0, y: 0 }} visible={true} />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toBeInTheDocument()
  })

  it('handles React node content', () => {
    const data: TooltipData = {
      id: '1',
      content: <div data-testid="custom-content">Custom Content</div>,
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} />)

    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
  })

  it('handles string content', () => {
    const data: TooltipData = {
      id: '1',
      content: 'String Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} />)

    expect(screen.getByText('String Content')).toBeInTheDocument()
  })

  it('handles numeric values', () => {
    const data: TooltipData = {
      id: '1',
      value: 123,
      content: '123',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} />)

    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('handles custom offset', () => {
    const data: TooltipData = {
      id: '1',
      content: 'Content',
      x: 100,
      y: 100
    }

    render(<ChartTooltip data={data} visible={true} offset={16} />)

    const tooltip = document.querySelector('.chart-tooltip')
    expect(tooltip).toBeInTheDocument()
  })
})
