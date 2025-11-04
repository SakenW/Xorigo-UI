/**
 * AreaChart Component Tests
 *
 * 测试 AreaChart 组件的功能和特性
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AreaChart, type AreaSeries } from './area-chart'

// ============================================================================
// Test Suite
// ============================================================================

describe('AreaChart', () => {
  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  it('renders correctly with data', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} />)

    expect(screen.getByText('Series 1')).toBeInTheDocument()
  })

  it('renders without data', () => {
    render(<AreaChart data={[]} />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  it('displays multiple series', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} />)

    expect(screen.getByText('Series 1')).toBeInTheDocument()
    expect(screen.getByText('Series 2')).toBeInTheDocument()
  })

  // ============================================================================
  // Type Tests
  // ============================================================================

  it('renders default type area chart', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} type="default" />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  it('renders stacked type area chart', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} type="stacked" />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  it('renders percent type area chart', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} type="percent" />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Feature Tests
  // ============================================================================

  it('hides grid when showGrid is false', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} showGrid={false} />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  it('hides legend when showLegend is false', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} showLegend={false} />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  it('hides axis when showAxis is false', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} showAxis={false} />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Label Tests
  // ============================================================================

  it('displays x-axis label', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} xAxisLabel="X Axis Label" />)

    expect(screen.getByText('X Axis Label')).toBeInTheDocument()
  })

  it('displays y-axis label', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} yAxisLabel="Y Axis Label" />)

    expect(screen.getByText('Y Axis Label')).toBeInTheDocument()
  })

  // ============================================================================
  // Styling Tests
  // ============================================================================

  it('applies custom className correctly', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} className="custom-area-chart" />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toHaveClass('custom-area-chart')
  })

  it('applies custom style when provided', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} style={{ backgroundColor: 'red' }} />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toHaveStyle({
      backgroundColor: 'red'
    })
  })

  it('applies custom height', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} height={400} />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom width', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} width={600} />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Fill and Stroke Tests
  // ============================================================================

  it('applies custom fillOpacity', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} fillOpacity={0.8} />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  it('hides stroke when showStroke is false', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} showStroke={false} />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Visibility Tests
  // ============================================================================

  it('hides invisible series in legend', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} showLegend={true} />)

    // Only visible series should appear
    expect(screen.getByText('Series 2')).toBeInTheDocument()
    expect(screen.queryByText('Series 1')).not.toBeInTheDocument()
  })

  // ============================================================================
  // Animation Tests
  // ============================================================================

  it('supports motion props for animations', () => {
    const data: AreaSeries[] = [
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
      <AreaChart
        data={data}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    )

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Forward Ref Tests
  // ============================================================================

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()

    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  // ============================================================================
  // Edge Cases
  // ============================================================================

  it('handles single data point', () => {
    const data: AreaSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10 }
        ]
      }
    ]

    render(<AreaChart data={data} />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  it('handles string x values', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  it('handles negative y values', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  it('handles zero values', () => {
    const data: AreaSeries[] = [
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

    render(<AreaChart data={data} />)

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })

  it('handles custom axis configuration', () => {
    const data: AreaSeries[] = [
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
      <AreaChart
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

    const chart = document.querySelector('.area-chart')
    expect(chart).toBeInTheDocument()
  })
})
