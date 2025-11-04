/**
 * Autocomplete Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Autocomplete } from './autocomplete'

describe('Autocomplete', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ]

  it('renders correctly', () => {
    render(<Autocomplete options={options} />)
    const input = screen.getByPlaceholderText('输入搜索...')
    expect(input).toBeInTheDocument()
  })

  it('filters options based on input', async () => {
    render(<Autocomplete options={options} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'Option 1' } })

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })
  })

  it('selects an option', async () => {
    const onValueChange = vi.fn()
    render(<Autocomplete options={options} onValueChange={onValueChange} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'Option 1' } })

    await waitFor(() => {
      const option = screen.getByText('Option 1')
      fireEvent.click(option)
    })

    expect(onValueChange).toHaveBeenCalledWith('1')
  })

  it('handles keyboard navigation', async () => {
    render(<Autocomplete options={options} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'Option' } })
    fireEvent.keyDown(input, { key: 'ArrowDown' })

    await waitFor(() => {
      expect(screen.getAllByRole('option')[0]).toHaveClass('bg-[var(--color-primary-100)]')
    })
  })
})
