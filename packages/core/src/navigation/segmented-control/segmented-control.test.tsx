/**
 * SegmentedControl Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SegmentedControl } from './segmented-control'

const options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' }
]

describe('SegmentedControl', () => {
  it('renders all options', () => {
    render(<SegmentedControl options={options} />)
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.getByText('Two')).toBeInTheDocument()
    expect(screen.getByText('Three')).toBeInTheDocument()
  })

  it('handles value change', () => {
    const handleChange = vi.fn()
    render(
      <SegmentedControl options={options} onValueChange={handleChange} />
    )
    fireEvent.click(screen.getByText('Two'))
    expect(handleChange).toHaveBeenCalledWith('two')
  })

  it('applies large size', () => {
    render(<SegmentedControl options={options} size="lg" />)
    const control = screen.getByText('One').parentElement
    expect(control).toHaveClass('h-12', 'text-base')
  })

  it('applies full width', () => {
    render(<SegmentedControl options={options} fullWidth />)
    const control = screen.getByText('One').closest('div')
    expect(control).toHaveClass('w-full')
  })

  it('disables option', () => {
    render(
      <SegmentedControl
        options={[
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two', disabled: true }
        ]}
      />
    )
    const twoButton = screen.getByText('Two').closest('button')
    expect(twoButton).toHaveClass('opacity-50', 'cursor-not-allowed')
  })
})
