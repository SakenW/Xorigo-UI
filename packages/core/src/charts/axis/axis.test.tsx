/**
 * Axis Component Tests
 *
 * 测试 Axis 组件的功能和特性
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Axis } from './axis'

// ============================================================================
// Test Suite
// ============================================================================

describe('Axis', () => {
  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  it('renders correctly with default props', () => {
    render(<Axis type="x" />)

    const axis = document.querySelector('.axis-x')
    expect(axis).toBeInTheDocument()
  })

  it('renders Y axis when type="y"', () => {
    render(<Axis type="y" />)

    const axis = document.querySelector('.axis-y')
    expect(axis).toBeInTheDocument()
  })

  it('displays label when provided', () => {
    render(<Axis type="x" label="X Axis Label" />)

    expect(screen.getByText('X Axis Label')).toBeInTheDocument()
  })

  // ============================================================================
  // Tick Tests
  // ============================================================================

  it('renders ticks when provided', () => {
    const ticks = [
      { value: 0, label: 'Start' },
      { value: 50, label: 'Middle' },
      { value: 100, label: 'End' }
    ]

    render(<Axis type="x" ticks={ticks} />)

    expect(screen.getByText('Start')).toBeInTheDocument()
    expect(screen.getByText('Middle')).toBeInTheDocument()
    expect(screen.getByText('End')).toBeInTheDocument()
  })

  it('uses value as label when label is not provided', () => {
    const ticks = [
      { value: 0 },
      { value: 50 },
      { value: 100 }
    ]

    render(<Axis type="x" ticks={ticks} />)

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  // ============================================================================
  // Grid Tests
  // ============================================================================

  it('renders grid lines when showGrid is true', () => {
    const ticks = [
      { value: 0, label: 'Start' },
      { value: 50, label: 'Middle' },
      { value: 100, label: 'End' }
    ]

    render(<Axis type="x" ticks={ticks} showGrid={true} />)

    const axis = document.querySelector('.axis-x')
    expect(axis?.querySelectorAll('line')).toHaveLength(ticks.length + 1) // +1 for axis line
  })

  it('hides grid lines when showGrid is false', () => {
    const ticks = [
      { value: 0, label: 'Start' },
      { value: 50, label: 'Middle' },
      { value: 100, label: 'End' }
    ]

    render(<Axis type="x" ticks={ticks} showGrid={false} />)

    const axis = document.querySelector('.axis-x')
    expect(axis?.querySelectorAll('line')).toHaveLength(1) // Only axis line
  })

  // ============================================================================
  // Tick Label Tests
  // ============================================================================

  it('shows tick labels when showTickLabels is true', () => {
    const ticks = [
      { value: 0, label: 'Start' },
      { value: 50, label: 'Middle' },
      { value: 100, label: 'End' }
    ]

    render(<Axis type="x" ticks={ticks} showTickLabels={true} />)

    expect(screen.getByText('Start')).toBeInTheDocument()
  })

  it('hides tick labels when showTickLabels is false', () => {
    const ticks = [
      { value: 0, label: 'Start' },
      { value: 50, label: 'Middle' },
      { value: 100, label: 'End' }
    ]

    render(<Axis type="x" ticks={ticks} showTickLabels={false} />)

    expect(screen.queryByText('Start')).not.toBeInTheDocument()
  })

  // ============================================================================
  // Styling Tests
  // ============================================================================

  it('applies custom className correctly', () => {
    render(<Axis type="x" className="custom-axis" />)

    const axis = document.querySelector('.axis-x')
    expect(axis).toHaveClass('custom-axis')
  })

  it('applies custom style when provided', () => {
    render(<Axis type="x" style={{ stroke: 'red' }} />)

    const axis = document.querySelector('.axis-x')
    expect(axis).toBeInTheDocument()
  })

  // ============================================================================
  // Position Tests
  // ============================================================================

  it('supports different axis positions', () => {
    render(<Axis type="x" position="top" />)

    const axis = document.querySelector('.axis-x')
    expect(axis).toBeInTheDocument()
  })

  it('supports Y axis positions', () => {
    render(<Axis type="y" position="right" />)

    const axis = document.querySelector('.axis-y')
    expect(axis).toBeInTheDocument()
  })

  // ============================================================================
  // Color Tests
  // ============================================================================

  it('applies custom axis color', () => {
    render(<Axis type="x" axisColor="blue" />)

    const axis = document.querySelector('.axis-x')
    expect(axis).toBeInTheDocument()
  })

  it('applies custom grid color', () => {
    const ticks = [
      { value: 0, label: 'Start' },
      { value: 50, label: 'Middle' },
      { value: 100, label: 'End' }
    ]

    render(<Axis type="x" ticks={ticks} gridColor="green" />)

    const axis = document.querySelector('.axis-x')
    expect(axis).toBeInTheDocument()
  })

  // ============================================================================
  // Animation Tests
  // ============================================================================

  it('supports motion props for animations', () => {
    render(
      <Axis
        type="x"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    )

    const axis = document.querySelector('.axis-x')
    expect(axis).toBeInTheDocument()
  })

  // ============================================================================
  // Forward Ref Tests
  // ============================================================================

  it('forwards ref correctly', () => {
    const ref = React.createRef<SVGGElement>()

    render(<Axis type="x" ref={ref} />)

    expect(ref.current).toBeInstanceOf(SVGGElement)
  })

  // ============================================================================
  // Edge Cases
  // ============================================================================

  it('handles empty ticks array', () => {
    render(<Axis type="x" ticks={[]} />)

    const axis = document.querySelector('.axis-x')
    expect(axis).toBeInTheDocument()
  })

  it('handles single tick', () => {
    render(<Axis type="x" ticks={[{ value: 50, label: 'Only One' }]} />)

    expect(screen.getByText('Only One')).toBeInTheDocument()
  })

  it('handles string values', () => {
    const ticks = [
      { value: 'A', label: 'Category A' },
      { value: 'B', label: 'Category B' },
      { value: 'C', label: 'Category C' }
    ]

    render(<Axis type="x" ticks={ticks} />)

    expect(screen.getByText('Category A')).toBeInTheDocument()
    expect(screen.getByText('Category B')).toBeInTheDocument()
    expect(screen.getByText('Category C')).toBeInTheDocument()
  })
})
