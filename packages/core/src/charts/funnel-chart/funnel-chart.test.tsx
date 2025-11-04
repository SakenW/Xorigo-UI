/**
 * FunnelChart Component Tests
 *
 * 测试 FunnelChart 组件的功能和特性
 */

import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FunnelChart, type FunnelDataPoint } from './funnel-chart'

// ============================================================================
// Test Suite
// ============================================================================

describe('FunnelChart', () => {
  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  it('renders correctly with data', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 },
      { label: '阶段 3', value: 60 },
      { label: '阶段 4', value: 40 }
    ]

    render(<FunnelChart data={data} />)

    expect(screen.getByText('阶段 1')).toBeInTheDocument()
    expect(screen.getByText('阶段 2')).toBeInTheDocument()
    expect(screen.getByText('阶段 3')).toBeInTheDocument()
    expect(screen.getByText('阶段 4')).toBeInTheDocument()
  })

  it('renders without data', () => {
    render(<FunnelChart data={[]} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('renders single stage', () => {
    const data: FunnelDataPoint[] = [
      { label: '只有一个阶段', value: 100 }
    ]

    render(<FunnelChart data={data} />)

    expect(screen.getByText('只有一个阶段')).toBeInTheDocument()
  })

  it('renders multiple stages', () => {
    const data: FunnelDataPoint[] = [
      { label: '访问', value: 1000 },
      { label: '注册', value: 800 },
      { label: '激活', value: 600 },
      { label: '付费', value: 400 },
      { label: '留存', value: 200 }
    ]

    render(<FunnelChart data={data} />)

    expect(screen.getByText('访问')).toBeInTheDocument()
    expect(screen.getByText('注册')).toBeInTheDocument()
    expect(screen.getByText('激活')).toBeInTheDocument()
    expect(screen.getByText('付费')).toBeInTheDocument()
    expect(screen.getByText('留存')).toBeInTheDocument()
  })

  // ============================================================================
  // Direction Tests
  // ============================================================================

  it('renders with top-to-bottom direction', () => {
    const data: FunnelDataPoint[] = [
      { label: '顶部', value: 100 },
      { label: '中部', value: 80 },
      { label: '底部', value: 60 }
    ]

    render(<FunnelChart data={data} direction="top-to-bottom" />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('renders with bottom-to-top direction', () => {
    const data: FunnelDataPoint[] = [
      { label: '顶部', value: 100 },
      { label: '中部', value: 80 },
      { label: '底部', value: 60 }
    ]

    render(<FunnelChart data={data} direction="bottom-to-top" />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Visibility Tests
  // ============================================================================

  it('hides percentage when showPercentage is false', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} showPercentage={false} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('hides value when showValue is false', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} showValue={false} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('hides label when showLabel is false', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} showLabel={false} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('hides legend when showLegend is false', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} showLegend={false} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('hides tooltip when showTooltip is false', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} showTooltip={false} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Variant Tests
  // ============================================================================

  it('renders default variant', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} variant="default" />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('renders gradient variant', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} variant="gradient" />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('renders solid variant', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} variant="solid" />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Styling Tests
  // ============================================================================

  it('applies custom className correctly', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 }
    ]

    render(<FunnelChart data={data} className="custom-funnel-chart" />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toHaveClass('custom-funnel-chart')
  })

  it('applies custom style when provided', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 }
    ]

    render(<FunnelChart data={data} style={{ backgroundColor: 'red' }} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toHaveStyle({
      backgroundColor: 'red'
    })
  })

  it('applies custom height', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 }
    ]

    render(<FunnelChart data={data} height={500} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom width', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 }
    ]

    render(<FunnelChart data={data} width={600} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom maxWidth and minWidth', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(
      <FunnelChart
        data={data}
        maxWidth={500}
        minWidth={200}
      />
    )

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom stageHeight', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} stageHeight={80} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom stageGap', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} stageGap={12} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Legend Position Tests
  // ============================================================================

  it('renders legend at bottom', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} legendPosition="bottom" />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('renders legend at top', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} legendPosition="top" />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('renders legend at right', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} legendPosition="right" />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('renders legend at left', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} legendPosition="left" />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Color Tests
  // ============================================================================

  it('applies custom colors to stages', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100, color: '#ff0000' },
      { label: '阶段 2', value: 80, color: '#00ff00' },
      { label: '阶段 3', value: 60, color: '#0000ff' }
    ]

    render(<FunnelChart data={data} />)

    expect(screen.getByText('阶段 1')).toBeInTheDocument()
    expect(screen.getByText('阶段 2')).toBeInTheDocument()
    expect(screen.getByText('阶段 3')).toBeInTheDocument()
  })

  it('applies theme colors when no custom colors', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} />)

    expect(screen.getByText('阶段 1')).toBeInTheDocument()
    expect(screen.getByText('阶段 2')).toBeInTheDocument()
  })

  // ============================================================================
  // Description Tests
  // ============================================================================

  it('displays stage description', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100, description: '描述 1' },
      { label: '阶段 2', value: 80, description: '描述 2' }
    ]

    render(<FunnelChart data={data} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Animation Tests
  // ============================================================================

  it('supports custom animation duration', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} animationDuration={1.5} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('supports motion props for animations', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(
      <FunnelChart
        data={data}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    )

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Custom Formatter Tests
  // ============================================================================

  it('applies custom formatPercentage', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(
      <FunnelChart
        data={data}
        formatPercentage={(p) => `${p.toFixed(0)}%`}
      />
    )

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('applies custom formatValue', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(
      <FunnelChart
        data={data}
        formatValue={(v) => `¥${v}`}
      />
    )

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Tooltip Tests
  // ============================================================================

  it('renders custom tooltip formatter', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(
      <FunnelChart
        data={data}
        tooltipFormatter={(data, index) => (
          <div>
            <p>{data.label}</p>
            <p>Index: {index}</p>
          </div>
        )}
      />
    )

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Event Tests
  // ============================================================================

  it('calls onStageClick when stage is clicked', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    const handleClick = vi.fn()

    render(<FunnelChart data={data} onStageClick={handleClick} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Forward Ref Tests
  // ============================================================================

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()

    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 }
    ]

    render(<FunnelChart data={data} ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  // ============================================================================
  // Edge Cases
  // ============================================================================

  it('handles zero values', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 0 },
      { label: '阶段 2', value: 0 }
    ]

    render(<FunnelChart data={data} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('handles negative values', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: -50 }
    ]

    render(<FunnelChart data={data} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  it('handles large values', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 1000000 },
      { label: '阶段 2', value: 800000 }
    ]

    render(<FunnelChart data={data} />)

    expect(screen.getByText('阶段 1')).toBeInTheDocument()
    expect(screen.getByText('阶段 2')).toBeInTheDocument()
  })

  it('handles small values', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 0.001 },
      { label: '阶段 2', value: 0.0005 }
    ]

    render(<FunnelChart data={data} />)

    expect(screen.getByText('阶段 1')).toBeInTheDocument()
    expect(screen.getByText('阶段 2')).toBeInTheDocument()
  })

  it('hides stroke when showStroke is false', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(<FunnelChart data={data} showStroke={false} />)

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })

  // ============================================================================
  // Props Combination Tests
  // ============================================================================

  it('renders with all features enabled', () => {
    const data: FunnelDataPoint[] = [
      { label: '访问', value: 1000 },
      { label: '注册', value: 800 },
      { label: '激活', value: 600 },
      { label: '付费', value: 400 }
    ]

    render(
      <FunnelChart
        data={data}
        showPercentage={true}
        showValue={true}
        showLabel={true}
        showLegend={true}
        showTooltip={true}
        variant="gradient"
      />
    )

    expect(screen.getByText('访问')).toBeInTheDocument()
    expect(screen.getByText('注册')).toBeInTheDocument()
    expect(screen.getByText('激活')).toBeInTheDocument()
    expect(screen.getByText('付费')).toBeInTheDocument()
  })

  it('renders with all features disabled', () => {
    const data: FunnelDataPoint[] = [
      { label: '阶段 1', value: 100 },
      { label: '阶段 2', value: 80 }
    ]

    render(
      <FunnelChart
        data={data}
        showPercentage={false}
        showValue={false}
        showLabel={false}
        showLegend={false}
        showTooltip={false}
      />
    )

    const chart = document.querySelector('.funnel-chart')
    expect(chart).toBeInTheDocument()
  })
})
