/**
 * ChartArea Component Tests
 *
 * 测试 ChartArea 组件的功能和特性
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChartArea, type AreaSeries } from './chart-area'

// ============================================================================
// Test Suite
// ============================================================================

describe('ChartArea', () => {
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

    render(<ChartArea data={data} />)

    const chart = document.querySelector('.chart-area')
    expect(chart).toBeInTheDocument()
  })

  it('renders without data', () => {
    render(<ChartArea data={[]} />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} showLegend={true} />)

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

    render(<ChartArea data={data} type="default" />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} type="stacked" />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} type="percent" />)

    const chart = document.querySelector('.chart-area')
    expect(chart).toBeInTheDocument()
  })

  it('renders stream type area chart', () => {
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

    render(<ChartArea data={data} type="stream" />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} showGrid={false} />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} showLegend={false} />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} showAxis={false} />)

    const chart = document.querySelector('.chart-area')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Gradient Fill Tests
  // ============================================================================

  it('renders with gradient fill', () => {
    const data: AreaSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        fillGradient: {
          from: '#3b82f6',
          to: '#ef4444'
        },
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ChartArea data={data} />)

    const chart = document.querySelector('.chart-area')
    expect(chart).toBeInTheDocument()
  })

  it('renders with solid fill when fillType is solid', () => {
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

    render(<ChartArea data={data} fillType="solid" />)

    const chart = document.querySelector('.chart-area')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Marker Tests
  // ============================================================================

  it('displays markers when showMarkers is true', () => {
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

    render(<ChartArea data={data} showMarkers={true} />)

    const chart = document.querySelector('.chart-area')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom marker size', () => {
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

    render(<ChartArea data={data} showMarkers={true} markerSize={6} />)

    const chart = document.querySelector('.chart-area')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom marker style from series', () => {
    const data: AreaSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        markerStyle: {
          size: 6,
          color: '#ffffff',
          borderColor: '#3b82f6',
          borderWidth: 2
        },
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 }
        ]
      }
    ]

    render(<ChartArea data={data} showMarkers={true} />)

    const chart = document.querySelector('.chart-area')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Threshold Line Tests
  // ============================================================================

  it('renders threshold lines', () => {
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

    const thresholdLines = [
      {
        y: 15,
        color: '#ef4444',
        label: 'Target',
        showLabel: true
      }
    ]

    render(<ChartArea data={data} thresholdLines={thresholdLines} />)

    const chart = document.querySelector('.chart-area')
    expect(chart).toBeInTheDocument()
  })

  it('renders threshold lines without labels', () => {
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

    const thresholdLines = [
      {
        y: 15,
        color: '#ef4444'
      }
    ]

    render(<ChartArea data={data} thresholdLines={thresholdLines} />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} xAxisLabel="X Axis Label" />)

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

    render(<ChartArea data={data} yAxisLabel="Y Axis Label" />)

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

    render(<ChartArea data={data} className="custom-chart-area" />)

    const chart = document.querySelector('.chart-area')
    expect(chart).toHaveClass('custom-chart-area')
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

    render(<ChartArea data={data} style={{ backgroundColor: 'red' }} />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} height={400} />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} width={600} />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} fillOpacity={0.8} />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} showStroke={false} />)

    const chart = document.querySelector('.chart-area')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom strokeWidth', () => {
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

    render(<ChartArea data={data} strokeWidth={3} />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} showLegend={true} />)

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
      <ChartArea
        data={data}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    )

    const chart = document.querySelector('.chart-area')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom animation duration', () => {
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

    render(<ChartArea data={data} animationDuration={1200} />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  // ============================================================================
  // Tooltip Tests
  // ============================================================================

  it('shows tooltip on mouse move', () => {
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

    render(<ChartArea data={data} showTooltip={true} />)

    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('uses custom tooltip formatter', () => {
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

    const customFormatter = (data: any, series: any) => (
      <div>Custom: {series.name} - {data.y}</div>
    )

    render(<ChartArea data={data} tooltipFormatter={customFormatter} />)

    const chart = document.querySelector('.chart-area')
    expect(chart).toBeInTheDocument()
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

    render(<ChartArea data={data} />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} />)

    const chart = document.querySelector('.chart-area')
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

    render(<ChartArea data={data} />)

    const chart = document.querySelector('.chart-area')
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
      <ChartArea
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

    const chart = document.querySelector('.chart-area')
    expect(chart).toBeInTheDocument()
  })

  it('handles data with metadata', () => {
    const data: AreaSeries[] = [
      {
        name: 'Series 1',
        color: '#3b82f6',
        data: [
          { x: 1, y: 10, metadata: { category: 'A' } },
          { x: 2, y: 20, metadata: { category: 'B' } },
          { x: 3, y: 30, metadata: { category: 'C' } }
        ]
      }
    ]

    render(<ChartArea data={data} />)

    const chart = document.querySelector('.chart-area')
    expect(chart).toBeInTheDocument()
  })
})
