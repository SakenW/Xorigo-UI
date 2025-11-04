/**
 * NavLink Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NavLink } from './nav-link'

describe('NavLink', () => {
  it('renders correctly', () => {
    render(
      <NavLink href="/home">
        Home
      </NavLink>
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('applies active state', () => {
    render(
      <NavLink href="/home" active>
        Home
      </NavLink>
    )
    const link = screen.getByText('Home')
    expect(link).toHaveClass('text-[var(--color-primary-600)]')
  })

  it('applies underline variant', () => {
    render(
      <NavLink href="/home" variant="underline">
        Home
      </NavLink>
    )
    const link = screen.getByText('Home')
    expect(link).toHaveClass('border-b-2')
  })

  it('disables link', () => {
    render(
      <NavLink href="/home" disabled>
        Home
      </NavLink>
    )
    const link = screen.getByText('Home')
    expect(link).toHaveClass('opacity-50', 'cursor-not-allowed')
  })
})
