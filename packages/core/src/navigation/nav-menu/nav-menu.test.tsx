/**
 * NavMenu Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NavMenu } from './nav-menu'

const items = [
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'About', href: '/about' },
  { id: '3', label: 'Contact', href: '/contact' }
]

describe('NavMenu', () => {
  it('renders all items', () => {
    render(<NavMenu items={items} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders vertical orientation', () => {
    render(<NavMenu items={items} orientation="vertical" />)
    const nav = screen.getByText('Home').closest('nav')
    expect(nav).toHaveClass('flex-col')
  })

  it('applies active state', () => {
    render(
      <NavMenu
        items={[
          { id: '1', label: 'Home', href: '/', active: true },
          { id: '2', label: 'About', href: '/about' }
        ]}
      />
    )
    const activeItem = screen.getByText('Home').closest('a')
    expect(activeItem).toHaveClass('bg-[var(--color-primary-100)]')
  })

  it('disables item', () => {
    render(
      <NavMenu
        items={[
          { id: '1', label: 'Home', href: '/', disabled: true }
        ]}
      />
    )
    const disabledItem = screen.getByText('Home').closest('a')
    expect(disabledItem).toHaveClass('opacity-50', 'cursor-not-allowed')
  })
})
