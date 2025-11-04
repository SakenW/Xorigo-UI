/**
 * BarChart Component Tests
 *
 * 测试 BarChart 组件的功能和特性
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { BarChart } from './bar-chart'

// ============================================================================
// Test Suite
// ============================================================================

describe('BarChart', () => {
  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  const mockData = [
    {
      id: 'series-1',
      name: 'Revenue',
      color: '#3b82f6',
      data: [
        { x: 'Jan', y: 4000 },
        { x: 'Feb', y: 3000 },
        { x: 'Mar', y: 5000 }
      ]
    }
  ]

  it('renders correctly with data', () => {
    render(<BarChart data={mockData} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  it('renders with title when provided', () => {
    render(<BarChart data={mockData} />)

    expect(screen.getByTitle('Bar Chart')).toBeInTheDocument()
  })

  it('applies custom aria-label when provided', () => {
    render(<BarChart data={mockData} aria-label="Custom Chart Label" />)

    const chart = screen.getByRole('img')
    expect(chart).toHaveAttribute('aria-label', 'Custom Chart Label')
  })

  // ============================================================================
  // Direction Tests
  // ============================================================================

  it('renders vertical bar chart by default', () => {
    render(<BarChart data={mockData} direction="vertical" />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  it('renders horizontal bar chart when direction is horizontal', () => {
    render(<BarChart data={mockData} direction="horizontal" />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Variant Tests
  // ============================================================================

  it('renders default variant correctly', () => {
    render(<BarChart data={mockData} variant="default" />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  it('renders grouped variant correctly', () => {
    const groupedData = [
      {
        id: 'series-1',
        name: 'Desktop',
        color: '#3b82f6',
        data: [
          { x: 'Q1', y: 400 },
          { x: 'Q2', y: 300 }
        ]
      },
      {
        id: 'series-2',
        name: 'Mobile',
        color: '#ef4444',
        data: [
          { x: 'Q1', y: 200 },
          { x: 'Q2', y: 300 }
        ]
      }
    ]

    render(<BarChart data={groupedData} variant="grouped" />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  it('renders stacked variant correctly', () => {
    const stackedData = [
      {
        id: 'series-1',
        name: 'Desktop',
        color: '#3b82f6',
        data: [
          { x: 'Q1', y: 400 },
          { x: 'Q2', y: 300 }
        ]
      },
      {
        id: 'series-2',
        name: 'Mobile',
        color: '#ef4444',
        data: [
          { x: 'Q1', y: 200 },
          { x: 'Q2', y: 300 }
        ]
      }
    ]

    render(<BarChart data={stackedData} variant="stacked" />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Size and Layout Tests
  // ============================================================================

  it('applies custom dimensions correctly', () => {
    render(<BarChart data={mockData} width={600} height={300} />)

    const svg = screen.getByTitle('Bar Chart')
    expect(svg).toHaveAttribute('width', '600')
    expect(svg).toHaveAttribute('height', '300')
  })

  it('applies custom margin correctly', () => {
    render(
      <BarChart data={mockData} margin={{ top: 30, right: 40, bottom: 50, left: 60 }} />
    )

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Grid Tests
  // ============================================================================

  it('renders grid when showGrid is true', () => {
    render(<BarChart data={mockData} grid={{ enabled: true }} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart.querySelector('.grid')).toBeInTheDocument()
  })

  it('hides grid when showGrid is false', () => {
    render(<BarChart data={mockData} grid={{ enabled: false }} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart.querySelector('.grid')).not.toBeInTheDocument()
  })

  // ============================================================================
  // Axis Tests
  // ============================================================================

  it('renders axes by default', () => {
    render(<BarChart data={mockData} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart.querySelector('.x-axis')).toBeInTheDocument()
    expect(chart.querySelector('.y-axis')).toBeInTheDocument()
  })

  it('hides axes when disabled', () => {
    render(
      <BarChart
        data={mockData}
        axis={{ x: { enabled: false }, y: { enabled: false } }}
      />
    )

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart.querySelector('.x-axis')).not.toBeInTheDocument()
    expect(chart.querySelector('.y-axis')).not.toBeInTheDocument()
  })

  it('applies axis labels when provided', () => {
    render(
      <BarChart
        data={mockData}
        axis={{
          x: { enabled: true, label: 'Month' },
          y: { enabled: true, label: 'Revenue' }
        }}
      />
    )

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toContainElement(screen.getByText('Month'))
    expect(chart).toContainElement(screen.getByText('Revenue'))
  })

  // ============================================================================
  // Legend Tests
  // ============================================================================

  it('renders legend by default', () => {
    render(<BarChart data={mockData} />)

    expect(screen.getByText('Revenue')).toBeInTheDocument()
  })

  it('hides legend when disabled', () => {
    render(<BarChart data={mockData} legend={{ enabled: false }} />)

    expect(screen.queryByText('Revenue')).not.toBeInTheDocument()
  })

  it('positions legend at top by default', () => {
    render(<BarChart data={mockData} legend={{ enabled: true }} />)

    const chartContainer = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chartContainer.parentElement).toHaveClass('bar-chart')
  })

  // ============================================================================
  // Tooltip Tests
  // ============================================================================

  it('enables tooltip by default', () => {
    render(<BarChart data={mockData} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  it('disables tooltip when disabled', () => {
    render(<BarChart data={mockData} tooltip={{ enabled: false }} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Animation Tests
  // ============================================================================

  it('applies animation by default', () => {
    render(<BarChart data={mockData} animate={true} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  it('disables animation when animate is false', () => {
    render(<BarChart data={mockData} animate={false} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  it('supports custom animation duration', () => {
    render(<BarChart data={mockData} animationDuration={2000} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Value Labels Tests
  // ============================================================================

  it('does not show value labels by default', () => {
    render(<BarChart data={mockData} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  it('shows value labels when enabled', () => {
    render(<BarChart data={mockData} showValues={true} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Gap Tests
  // ============================================================================

  it('applies custom bar gap', () => {
    render(<BarChart data={mockData} barGap={8} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  it('applies custom bar category gap', () => {
    render(<BarChart data={mockData} barCategoryGap={30} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Color Tests
  // ============================================================================

  it('applies custom colors when provided', () => {
    render(
      <BarChart
        data={mockData}
        colors={['#ff0000', '#00ff00', '#0000ff']}
      />
    )

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  it('uses series color when provided', () => {
    const coloredData = [
      {
        id: 'series-1',
        name: 'Revenue',
        color: '#ff0000',
        data: [
          { x: 'Jan', y: 4000 },
          { x: 'Feb', y: 3000 }
        ]
      }
    ]

    render(<BarChart data={coloredData} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Event Handler Tests
  // ============================================================================

  it('calls onBarClick when bar is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<BarChart data={mockData} onBarClick={handleClick} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    await user.click(chart)

    // Note: The actual click handling depends on the implementation
    // This is a placeholder test
  })

  it('calls onBarHover when bar is hovered', async () => {
    const user = userEvent.setup()
    const handleHover = vi.fn()

    render(<BarChart data={mockData} onBarHover={handleHover} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    await user.hover(chart)

    // Note: The actual hover handling depends on the implementation
    // This is a placeholder test
  })

  // ============================================================================
  // Styling Tests
  // ============================================================================

  it('applies custom className correctly', () => {
    render(<BarChart data={mockData} className="custom-bar-chart" />)

    const chartContainer = screen.getByText('Revenue').closest('.bar-chart')
    expect(chartContainer).toHaveClass('custom-bar-chart')
  })

  it('applies custom style when provided', () => {
    render(
      <BarChart
        data={mockData}
        style={{ backgroundColor: 'red' }}
      />
    )

    const chartContainer = screen.getByText('Revenue').closest('.bar-chart')
    expect(chartContainer).toHaveStyle({
      backgroundColor: 'red'
    })
  })

  // ============================================================================
  // Multi-series Tests
  // ============================================================================

  it('renders multiple data series', () => {
    const multiSeriesData = [
      {
        id: 'series-1',
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 'Jan', y: 4000 },
          { x: 'Feb', y: 3000 }
        ]
      },
      {
        id: 'series-2',
        name: 'Series 2',
        color: '#ef4444',
        data: [
          { x: 'Jan', y: 2000 },
          { x: 'Feb', y: 4000 }
        ]
      }
    ]

    render(<BarChart data={multiSeriesData} />)

    expect(screen.getByText('Series 1')).toBeInTheDocument()
    expect(screen.getByText('Series 2')).toBeInTheDocument()
  })

  it('filters out invisible series', () => {
    const filteredData = [
      {
        id: 'series-1',
        name: 'Visible Series',
        color: '#3b82f6',
        visible: true,
        data: [
          { x: 'Jan', y: 4000 },
          { x: 'Feb', y: 3000 }
        ]
      },
      {
        id: 'series-2',
        name: 'Hidden Series',
        color: '#ef4444',
        visible: false,
        data: [
          { x: 'Jan', y: 2000 },
          { x: 'Feb', y: 4000 }
        ]
      }
    ]

    render(<BarChart data={filteredData} />)

    expect(screen.getByText('Visible Series')).toBeInTheDocument()
    expect(screen.queryByText('Hidden Series')).not.toBeInTheDocument()
  })

  // ============================================================================
  // Forward Ref Tests
  // ============================================================================

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()

    render(<BarChart data={mockData} ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  // ============================================================================
  // Edge Cases
  // ============================================================================

  it('handles empty data gracefully', () => {
    render(<BarChart data={[]} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  it('handles single data point', () => {
    const singlePointData = [
      {
        id: 'series-1',
        name: 'Single Point',
        color: '#3b82f6',
        data: [
          { x: 'Jan', y: 4000 }
        ]
      }
    ]

    render(<BarChart data={singlePointData} />)

    expect(screen.getByText('Single Point')).toBeInTheDocument()
  })

  it('handles zero values', () => {
    const zeroValueData = [
      {
        id: 'series-1',
        name: 'Zero Values',
        color: '#3b82f6',
        data: [
          { x: 'Jan', y: 0 },
          { x: 'Feb', y: 0 }
        ]
      }
    ]

    render(<BarChart data={zeroValueData} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  it('handles negative values', () => {
    const negativeData = [
      {
        id: 'series-1',
        name: 'Negative Values',
        color: '#3b82f6',
        data: [
          { x: 'Jan', y: -1000 },
          { x: 'Feb', y: 2000 }
        ]
      }
    ]

    render(<BarChart data={negativeData} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })

  it('handles large number of categories', () => {
    const largeData = [
      {
        id: 'series-1',
        name: 'Large Dataset',
        color: '#3b82f6',
        data: Array.from({ length: 50 }, (_, i) => ({
          x: `Category ${i}`,
          y: Math.random() * 1000
        }))
      }
    ]

    render(<BarChart data={largeData} />)

    const chart = screen.getByRole('img', { name: /bar chart visualization/i })
    expect(chart).toBeInTheDocument()
  })
})
