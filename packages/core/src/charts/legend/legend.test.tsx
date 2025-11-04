/**
 * Legend Component Tests
 *
 * 测试 Legend 组件的功能和特性
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Legend, type LegendItem } from './legend'

// ============================================================================
// Test Suite
// ============================================================================

describe('Legend', () => {
  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  it('renders correctly with items', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' },
      { id: '2', label: 'Series 2', color: '#ef4444' },
      { id: '3', label: 'Series 3', color: '#10b981' }
    ]

    render(<Legend items={items} />)

    expect(screen.getByText('Series 1')).toBeInTheDocument()
    expect(screen.getByText('Series 2')).toBeInTheDocument()
    expect(screen.getByText('Series 3')).toBeInTheDocument()
  })

  it('displays title when provided', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' }
    ]

    render(<Legend items={items} title="Chart Legend" />)

    expect(screen.getByText('Chart Legend')).toBeInTheDocument()
  })

  // ============================================================================
  // Orientation Tests
  // ============================================================================

  it('renders in horizontal orientation by default', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' },
      { id: '2', label: 'Series 2', color: '#ef4444' }
    ]

    render(<Legend items={items} />)

    const legend = document.querySelector('.legend')
    expect(legend).toBeInTheDocument()
    expect(legend?.firstChild).toHaveClass('flex-row')
  })

  it('renders in vertical orientation when specified', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' },
      { id: '2', label: 'Series 2', color: '#ef4444' }
    ]

    render(<Legend items={items} orientation="vertical" />)

    const legend = document.querySelector('.legend')
    expect(legend?.firstChild).toHaveClass('flex-col')
  })

  // ============================================================================
  // Alignment Tests
  // ============================================================================

  it('aligns items to start by default', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' },
      { id: '2', label: 'Series 2', color: '#ef4444' }
    ]

    render(<Legend items={items} />)

    const legendItems = document.querySelectorAll('.legend-item')
    expect(legendItems.length).toBe(2)
  })

  it('aligns items to center', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' },
      { id: '2', label: 'Series 2', color: '#ef4444' }
    ]

    render(<Legend items={items} align="center" />)

    const legend = document.querySelector('.legend')
    expect(legend?.firstChild).toHaveClass('justify-center')
  })

  it('aligns items to end', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' },
      { id: '2', label: 'Series 2', color: '#ef4444' }
    ]

    render(<Legend items={items} align="end" />)

    const legend = document.querySelector('.legend')
    expect(legend?.firstChild).toHaveClass('justify-end')
  })

  // ============================================================================
  // Symbol Tests
  // ============================================================================

  it('renders default circle symbol', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' }
    ]

    render(<Legend items={items} />)

    const legendItem = document.querySelector('.legend-item')
    expect(legendItem).toBeInTheDocument()
    expect(legendItem?.querySelector('svg')).toBeInTheDocument()
  })

  it('renders square symbol', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6', symbol: 'square' }
    ]

    render(<Legend items={items} />)

    expect(screen.getByText('Series 1')).toBeInTheDocument()
  })

  it('renders triangle symbol', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6', symbol: 'triangle' }
    ]

    render(<Legend items={items} />)

    expect(screen.getByText('Series 1')).toBeInTheDocument()
  })

  it('renders diamond symbol', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6', symbol: 'diamond' }
    ]

    render(<Legend items={items} />)

    expect(screen.getByText('Series 1')).toBeInTheDocument()
  })

  it('renders line symbol', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6', symbol: 'line' }
    ]

    render(<Legend items={items} />)

    expect(screen.getByText('Series 1')).toBeInTheDocument()
  })

  // ============================================================================
  // Interaction Tests
  // ============================================================================

  it('calls onItemClick when item is clicked', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' }
    ]

    const handleClick = vi.fn()

    render(<Legend items={items} onItemClick={handleClick} />)

    const legendItem = document.querySelector('.legend-item')
    fireEvent.click(legendItem!)

    expect(handleClick).toHaveBeenCalledWith(items[0], 0)
  })

  it('calls onItemCheck when checkbox is changed', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6', checked: false }
    ]

    const handleCheck = vi.fn()

    render(
      <Legend
        items={items}
        onItemCheck={handleCheck}
        showCheck={true}
      />
    )

    const checkbox = document.querySelector('input[type="checkbox"]')
    fireEvent.change(checkbox!, { target: { checked: true } })

    expect(handleCheck).toHaveBeenCalledWith(items[0], 0, true)
  })

  // ============================================================================
  // Visibility Tests
  // ============================================================================

  it('hides item when visible is false', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6', visible: false },
      { id: '2', label: 'Series 2', color: '#ef4444', visible: true }
    ]

    render(<Legend items={items} />)

    const legendItem = document.querySelector('.legend-item')
    expect(legendItem).toHaveClass('opacity-50')
  })

  // ============================================================================
  // Styling Tests
  // ============================================================================

  it('applies custom className correctly', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' }
    ]

    render(<Legend items={items} className="custom-legend" />)

    const legend = document.querySelector('.legend')
    expect(legend).toHaveClass('custom-legend')
  })

  it('applies custom style when provided', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' }
    ]

    render(<Legend items={items} style={{ backgroundColor: 'red' }} />)

    const legend = document.querySelector('.legend')
    expect(legend).toHaveStyle({
      backgroundColor: 'red'
    })
  })

  // ============================================================================
  // Size Tests
  // ============================================================================

  it('applies small size correctly', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' }
    ]

    render(<Legend items={items} itemSize="sm" />)

    const legendItem = document.querySelector('.legend-item')
    expect(legendItem).toBeInTheDocument()
  })

  it('applies medium size correctly', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' }
    ]

    render(<Legend items={items} itemSize="md" />)

    const legendItem = document.querySelector('.legend-item')
    expect(legendItem).toBeInTheDocument()
  })

  it('applies large size correctly', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' }
    ]

    render(<Legend items={items} itemSize="lg" />)

    const legendItem = document.querySelector('.legend-item')
    expect(legendItem).toBeInTheDocument()
  })

  // ============================================================================
  // Gap Tests
  // ============================================================================

  it('applies custom gap between items', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' },
      { id: '2', label: 'Series 2', color: '#ef4444' }
    ]

    render(<Legend items={items} gap={24} />)

    const legend = document.querySelector('.legend')
    expect(legend?.firstChild).toHaveClass('gap-6')
  })

  // ============================================================================
  // Animation Tests
  // ============================================================================

  it('supports motion props for animations', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' }
    ]

    render(
      <Legend
        items={items}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    )

    const legend = document.querySelector('.legend')
    expect(legend).toBeInTheDocument()
  })

  // ============================================================================
  // Forward Ref Tests
  // ============================================================================

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()

    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' }
    ]

    render(<Legend items={items} ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  // ============================================================================
  // Edge Cases
  // ============================================================================

  it('handles empty items array', () => {
    render(<Legend items={[]} />)

    const legend = document.querySelector('.legend')
    expect(legend).toBeInTheDocument()
  })

  it('handles custom symbol', () => {
    const items: LegendItem[] = [
      {
        id: '1',
        label: 'Series 1',
        color: '#3b82f6',
        customSymbol: <div data-testid="custom-symbol">Custom</div>
      }
    ]

    render(<Legend items={items} />)

    expect(screen.getByTestId('custom-symbol')).toBeInTheDocument()
  })

  it('handles non-interactive mode', () => {
    const items: LegendItem[] = [
      { id: '1', label: 'Series 1', color: '#3b82f6' }
    ]

    const handleClick = vi.fn()

    render(<Legend items={items} onItemClick={handleClick} interactive={false} />)

    const legendItem = document.querySelector('.legend-item')
    fireEvent.click(legendItem!)

    expect(handleClick).not.toHaveBeenCalled()
  })
})
