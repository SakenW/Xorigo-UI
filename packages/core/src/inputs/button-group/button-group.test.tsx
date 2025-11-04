/**
 * ButtonGroup Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ButtonGroup } from './button-group'

describe('ButtonGroup', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ]

  it('renders correctly', () => {
    render(<ButtonGroup options={options} />)
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('selects a single option', () => {
    const onValueChange = vi.fn()
    render(<ButtonGroup options={options} onValueChange={onValueChange} />)

    fireEvent.click(screen.getByText('Option 2'))
    expect(onValueChange).toHaveBeenCalledWith('2')
  })

  it('selects multiple options when multiple is true', () => {
    const onValueChange = vi.fn()
    render(<ButtonGroup options={options} multiple onValueChange={onValueChange} />)

    fireEvent.click(screen.getByText('Option 1'))
    fireEvent.click(screen.getByText('Option 2'))
    expect(onValueChange).toHaveBeenCalledWith(['1', '2'])
  })
})
