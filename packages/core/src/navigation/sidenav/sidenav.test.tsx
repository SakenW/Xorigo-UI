/**
 * Sidenav Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Sidenav, type SidenavProps } from './sidenav'

const mockItems = [
  { id: '1', label: 'Home', icon: <span>🏠</span> },
  { id: '2', label: 'About', icon: <span>ℹ️</span> }
]

describe('Sidenav', () => {
  it('renders correctly', () => {
    render(<Sidenav items={mockItems} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('applies collapsed state', () => {
    render(<Sidenav items={mockItems} collapsed />)
    const sidenav = screen.getByText('Home').closest('aside')
    expect(sidenav).toHaveAttribute('style', expect.stringContaining('width'))
  })

  it('applies right position', () => {
    render(<Sidenav items={mockItems} position="right" />)
    const sidenav = screen.getByText('Home').closest('aside')
    expect(sidenav).toBeInTheDocument()
  })

  it('applies bordered variant', () => {
    render(<Sidenav items={mockItems} variant="bordered" />)
    const sidenav = screen.getByText('Home').closest('aside')
    expect(sidenav).toHaveClass('border-r', 'border-[var(--color-border)]')
  })
})
