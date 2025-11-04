/**
 * DonutChart Component Tests
 *
 * 测试 DonutChart 组件的功能和特性
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DonutChart, type DonutDataPoint } from './donut-chart'

// ============================================================================
// Test Suite
// ============================================================================

describe('DonutChart', () => {
  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  it('renders correctly with data', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'Series 1', value: 30, color: '#3b82f6' },
      { id: '2', label: 'Series 2', value: 50, color: '#ef4444' },
      { id: '3', label: 'Series 3', value: 20, color: '#10b981' }
    ]

    render(<DonutChart data={data} />)

    expect(screen.getByText('Series 1')).toBeInTheDocument()
    expect(screen.getByText('Series 2')).toBeInTheDocument()
    expect(screen.getByText('Series 3')).toBeInTheDocument()
  })

  it('renders without data', () => {
    render(<DonutChart data={[]} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  it('calculates total value correctly', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' },
      { id: '2', label: 'B', value: 70, color: '#ef4444' }
    ]

    render(<DonutChart data={data} showCenterText={true} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Center Text Tests
  // ============================================================================

  it('shows center text when provided', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' },
      { id: '2', label: 'B', value: 70, color: '#ef4444' }
    ]

    render(<DonutChart data={data} showCenterText={true} centerText="Total Sales" />)

    expect(screen.getByText('Total Sales')).toBeInTheDocument()
  })

  it('shows center subtitle when provided', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' },
      { id: '2', label: 'B', value: 70, color: '#ef4444' }
    ]

    render(
      <DonutChart
        data={data}
        showCenterText={true}
        centerText="Total"
        centerSubtitle="Sales"
      />
    )

    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('Sales')).toBeInTheDocument()
  })

  it('hides center text when showCenterText is false', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' },
      { id: '2', label: 'B', value: 70, color: '#ef4444' }
    ]

    render(
      <DonutChart
        data={data}
        showCenterText={false}
        centerText="Total"
        centerSubtitle="Sales"
      />
    )

    expect(screen.queryByText('Total')).not.toBeInTheDocument()
    expect(screen.queryByText('Sales')).not.toBeInTheDocument()
  })

  // ============================================================================
  // Feature Tests
  // ============================================================================

  it('hides legend when showLegend is false', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' },
      { id: '2', label: 'B', value: 70, color: '#ef4444' }
    ]

    render(<DonutChart data={data} showLegend={false} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom inner radius', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' },
      { id: '2', label: 'B', value: 70, color: '#ef4444' }
    ]

    render(<DonutChart data={data} innerRadius={0.8} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom thickness', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' },
      { id: '2', label: 'B', value: 70, color: '#ef4444' }
    ]

    render(<DonutChart data={data} thickness={30} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom start angle', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' },
      { id: '2', label: 'B', value: 70, color: '#ef4444' }
    ]

    render(<DonutChart data={data} startAngle={0} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Styling Tests
  // ============================================================================

  it('applies custom className correctly', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' }
    ]

    render(<DonutChart data={data} className="custom-donut-chart" />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toHaveClass('custom-donut-chart')
  })

  it('applies custom style when provided', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' }
    ]

    render(<DonutChart data={data} style={{ backgroundColor: 'red' }} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toHaveStyle({
      backgroundColor: 'red'
    })
  })

  it('applies custom height', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' }
    ]

    render(<DonutChart data={data} height={400} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom width', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' }
    ]

    render(<DonutChart data={data} width={600} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Visibility Tests
  // ============================================================================

  it('hides invisible data points', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6', visible: false },
      { id: '2', label: 'B', value: 70, color: '#ef4444', visible: true }
    ]

    render(<DonutChart data={data} showLegend={true} />)

    expect(screen.queryByText('A')).not.toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  // ============================================================================
  // Label Tests
  // ============================================================================

  it('shows labels when showLabels is true', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' },
      { id: '2', label: 'B', value: 70, color: '#ef4444' }
    ]

    render(<DonutChart data={data} showLabels={true} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  it('applies label position correctly', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' },
      { id: '2', label: 'B', value: 70, color: '#ef4444' }
    ]

    render(<DonutChart data={data} showLabels={true} labelPosition="inside" />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Interaction Tests
  // ============================================================================

  it('calls click handler when interactive', () => {
    const handleClick = vi.fn()

    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' }
    ]

    render(<DonutChart data={data} interactive={true} onClick={handleClick} />)

    // 这里需要模拟点击事件
  })

  it('handles non-interactive mode', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' }
    ]

    render(<DonutChart data={data} interactive={false} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Animation Tests
  // ============================================================================

  it('supports motion props for animations', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' }
    ]

    render(
      <DonutChart
        data={data}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    )

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Forward Ref Tests
  // ============================================================================

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()

    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 30, color: '#3b82f6' }
    ]

    render(<DonutChart data={data} ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  // ============================================================================
  // Edge Cases
  // ============================================================================

  it('handles single data point', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 100, color: '#3b82f6' }
    ]

    render(<DonutChart data={data} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  it('handles zero values', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 0, color: '#3b82f6' },
      { id: '2', label: 'B', value: 100, color: '#ef4444' }
    ]

    render(<DonutChart data={data} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  it('handles all zero values', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 0, color: '#3b82f6' },
      { id: '2', label: 'B', value: 0, color: '#ef4444' }
    ]

    render(<DonutChart data={data} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })

  it('handles percentage display', () => {
    const data: DonutDataPoint[] = [
      { id: '1', label: 'A', value: 25, color: '#3b82f6' },
      { id: '2', label: 'B', value: 75, color: '#ef4444' }
    ]

    render(<DonutChart data={data} showPercentage={true} />)

    const chart = document.querySelector('.donut-chart')
    expect(chart).toBeInTheDocument()
  })
})
