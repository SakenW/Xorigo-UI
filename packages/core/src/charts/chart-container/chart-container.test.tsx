/**
 * ChartContainer Component Tests
 *
 * 测试 ChartContainer 组件的功能和特性
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ChartContainer } from './chart-container'
import { cn } from '../../utils/cn'

// ============================================================================
// Test Suite
// ============================================================================

describe('ChartContainer', () => {
  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  it('renders correctly with children', () => {
    render(
      <ChartContainer>
        <div data-testid="chart-content">Test Chart</div>
      </ChartContainer>
    )

    expect(screen.getByTestId('chart-content')).toBeInTheDocument()
  })

  it('renders with title when provided', () => {
    render(
      <ChartContainer title="Test Chart">
        <div>Chart Content</div>
      </ChartContainer>
    )

    expect(screen.getByText('Test Chart')).toBeInTheDocument()
  })

  it('applies custom aria-label when provided', () => {
    render(
      <ChartContainer ariaLabel="Custom Chart Label">
        <div>Chart Content</div>
      </ChartContainer>
    )

    const container = screen.getByRole('img')
    expect(container).toHaveAttribute('aria-label', 'Custom Chart Label')
  })

  // ============================================================================
  // Size and Layout Tests
  // ============================================================================

  it('applies custom height correctly', () => {
    render(
      <ChartContainer height={400}>
        <div>Chart Content</div>
      </ChartContainer>
    )

    const container = screen.getByRole('img')
    expect(container).toHaveStyle({
      height: '400px'
    })
  })

  it('applies custom padding correctly', () => {
    render(
      <ChartContainer padding={30}>
        <div>Chart Content</div>
      </ChartContainer>
    )

    const container = screen.getByRole('img')
    expect(container).toHaveStyle({
      padding: '30px'
    })
  })

  it('applies custom margin correctly', () => {
    render(
      <ChartContainer margin="20px">
        <div>Chart Content</div>
      </ChartContainer>
    )

    const container = screen.getByRole('img')
    expect(container).toHaveStyle({
      margin: '20px'
    })
  })

  // ============================================================================
  // Legend Position Tests
  // ============================================================================

  it('renders legend at top when legendPosition="top"', () => {
    render(
      <ChartContainer legendPosition="top">
        <div>Chart Content</div>
      </ChartContainer>
    )

    const container = screen.getByRole('img')
    // 检查是否应用了顶部图例的样式
    expect(container.querySelector('.legend-container')).toBeInTheDocument()
  })

  it('hides legend when legendPosition="none"', () => {
    render(
      <ChartContainer legendPosition="none">
        <div>Chart Content</div>
      </ChartContainer>
    )

    const container = screen.getByRole('img')
    // 检查是否隐藏了图例
    expect(container.querySelector('.legend-container')).not.toBeInTheDocument()
  })

  // ============================================================================
  // Grid Tests
  // ============================================================================

  it('renders grid when showGrid is true', () => {
    render(
      <ChartContainer showGrid={true}>
        <div>Chart Content</div>
      </ChartContainer>
    )

    const container = screen.getByRole('img')
    expect(container.querySelector('.chart-grid')).toBeInTheDocument()
  })

  it('hides grid when showGrid is false', () => {
    render(
      <ChartContainer showGrid={false}>
        <div>Chart Content</div>
      </ChartContainer>
    )

    const container = screen.getByRole('img')
    expect(container.querySelector('.chart-grid')).not.toBeInTheDocument()
  })

  // ============================================================================
  // Styling Tests
  // ============================================================================

  it('applies custom className correctly', () => {
    render(
      <ChartContainer className="custom-class">
        <div>Chart Content</div>
      </ChartContainer>
    )

    const container = screen.getByRole('img')
    expect(container).toHaveClass('custom-class')
  })

  it('applies custom style when provided', () => {
    render(
      <ChartContainer style={{ backgroundColor: 'red' }}>
        <div>Chart Content</div>
      </ChartContainer>
    )

    const container = screen.getByRole('img')
    expect(container).toHaveStyle({
      backgroundColor: 'red'
    })
  })

  // ============================================================================
  // Accessibility Tests
  // ============================================================================

  it('has correct role attribute', () => {
    render(
      <ChartContainer>
        <div>Chart Content</div>
      </ChartContainer>
    )

    const container = screen.getByRole('img')
    expect(container).toHaveAttribute('role', 'img')
  })

  // ============================================================================
  // Animation Tests
  // ============================================================================

  it('supports motion props for animations', () => {
    render(
      <ChartContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div>Chart Content</div>
      </ChartContainer>
    )

    const container = screen.getByRole('img')
    expect(container).toBeInTheDocument()
  })

  // ============================================================================
  // Forward Ref Tests
  // ============================================================================

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()

    render(
      <ChartContainer ref={ref}>
        <div>Chart Content</div>
      </ChartContainer>
    )

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  // ============================================================================
  // Edge Cases
  // ============================================================================

  it('handles empty children gracefully', () => {
    render(<ChartContainer />)

    const container = screen.getByRole('img')
    expect(container).toBeInTheDocument()
  })

  it('handles complex nested children', () => {
    render(
      <ChartContainer>
        <div>
          <svg>
            <rect width="100" height="100" />
          </svg>
        </div>
      </ChartContainer>
    )

    const container = screen.getByRole('img')
    expect(container).toBeInTheDocument()
    expect(screen.getByRole('img')).toContainElement(container.querySelector('svg'))
  })
})
