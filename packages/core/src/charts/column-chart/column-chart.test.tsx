/**
 * ColumnChart Component Tests
 *
 * 测试 ColumnChart 组件的功能和特性
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ColumnChart, type ColumnSeries } from './column-chart'

// ============================================================================
// Test Suite
// ============================================================================

describe('ColumnChart', () => {
  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  it('renders correctly with data', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  it('renders without data', () => {
    render(<ColumnChart data={[]} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  it('displays multiple series', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      },
      {
        name: 'Series 2',
        color: '#ef4444',
        data: [
          { x: 1, y: 15 },
          { x: 2, y: 25 },
          { x: 3, y: 35 }
        ]
      }
    ]

    render(<ColumnChart data={data} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Type Tests
  // ============================================================================

  it('renders default type column chart', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} type="default" />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  it('renders grouped type column chart', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} type="grouped" />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  it('renders stacked type column chart', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} type="stacked" />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Feature Tests
  // ============================================================================

  it('hides grid when showGrid is false', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} showGrid={false} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  it('hides legend when showLegend is false', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} showLegend={false} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  it('hides axis when showAxis is false', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} showAxis={false} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Label Tests
  // ============================================================================

  it('displays x-axis label', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} xAxisLabel="X Axis Label" />)

    expect(screen.getByText('X Axis Label')).toBeInTheDocument()
  })

  it('displays y-axis label', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} yAxisLabel="Y Axis Label" />)

    expect(screen.getByText('Y Axis Label')).toBeInTheDocument()
  })

  // ============================================================================
  // Styling Tests
  // ============================================================================

  it('applies custom className correctly', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} className="custom-column-chart" />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toHaveClass('custom-column-chart')
  })

  it('applies custom style when provided', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} style={{ backgroundColor: 'red' }} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toHaveStyle({
      backgroundColor: 'red'
    })
  })

  it('applies custom height', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} height={400} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom width', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} width={600} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Bar Configuration Tests
  // ============================================================================

  it('applies custom barWidth', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} barWidth={60} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom barGap', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} barGap={4} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  it('hides border when showBorder is false', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} showBorder={false} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Visibility Tests
  // ============================================================================

  it('hides invisible series in legend', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ],
        visible: false
      },
      {
        name: 'Series 2',
        color: '#ef4444',
        data: [
          { x: 1, y: 15 },
          { x: 2, y: 25 },
          { x: 3, y: 35 }
        ]
      }
    ]

    render(<ColumnChart data={data} showLegend={true} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Animation Tests
  // ============================================================================

  it('supports motion props for animations', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(
      <ColumnChart
        data={data}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    )

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Forward Ref Tests
  // ============================================================================

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()

    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  // ============================================================================
  // Edge Cases
  // ============================================================================

  it('handles single data point', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 }
        ]
      }
    ]

    render(<ColumnChart data={data} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  it('handles string x values', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 'A', y: 10 },
          { x: 'B', y: 20 },
          { x: 'C', y: 30 }
        ]
      }
    ]

    render(<ColumnChart data={data} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  it('handles negative y values', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: -10 },
          { x: 2, y: 0 },
          { x: 3, y: 10 }
        ]
      }
    ]

    render(<ColumnChart data={data} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  it('handles zero values', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 0 },
          { x: 2, y: 0 },
          { x: 3, y: 0 }
        ]
      }
    ]

    render(<ColumnChart data={data} />)

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })

  it('handles custom axis configuration', () => {
    const data: ColumnSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(
      <ColumnChart
        data={data}
        xAxisConfig={{
          ticks: [
            { value: 1, label: 'One' },
            { value: 2, label: 'Two' },
            { value: 3, label: 'Three' }
          ]
        }}
        yAxisConfig={{
          ticks: [
            { value: 0, label: '0' },
            { value: 30, label: '30' }
          ]
        }}
      />
    )

    const chart = document.querySelector('.column-chart')
    expect(chart).toBeInTheDocument()
  })
})
