/**
 * CheckboxGroup Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CheckboxGroup } from './checkbox-group'

describe('CheckboxGroup', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ]

  it('renders correctly', () => {
    render(<CheckboxGroup options={options} />)
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('selects and deselects options', () => {
    const onValueChange = vi.fn()
    render(<CheckboxGroup options={options} onValueChange={onValueChange} />)

    const checkbox1 = screen.getAllByRole('checkbox')[1]
    fireEvent.click(checkbox1)
    expect(onValueChange).toHaveBeenCalledWith(['1'])
  })

  it('selects all options', () => {
    const onValueChange = vi.fn()
    render(
      <CheckboxGroup options={options} showSelectAll onValueChange={onValueChange} />
    )

    const selectAll = screen.getAllByRole('checkbox')[0]
    fireEvent.click(selectAll)
    expect(onValueChange).toHaveBeenCalledWith(['1', '2', '3'])
  })
})
