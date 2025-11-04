/**
 * Topbar Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Topbar, type TopbarProps } from './topbar'

describe('Topbar', () => {
  it('renders correctly', () => {
    render(<Topbar>Topbar content</Topbar>)
    expect(screen.getByText('Topbar content')).toBeInTheDocument()
  })

  it('applies custom height', () => {
    render(<Topbar height={80}>Content</Topbar>)
    const topbar = screen.getByText('Content').parentElement
    expect(topbar).toHaveStyle({ height: '80px' })
  })

  it('applies fixed positioning', () => {
    render(<Topbar fixed>Fixed Topbar</Topbar>)
    const topbar = screen.getByText('Fixed Topbar').parentElement
    expect(topbar).toHaveClass('sticky', 'top-0', 'z-50')
  })

  it('applies bordered variant', () => {
    render(<Topbar variant="bordered">Bordered</Topbar>)
    const topbar = screen.getByText('Bordered').parentElement
    expect(topbar).toHaveClass('border-b', 'border-[var(--color-border)]')
  })

  it('applies elevated variant', () => {
    render(<Topbar variant="elevated">Elevated</Topbar>)
    const topbar = screen.getByText('Elevated').parentElement
    expect(topbar).toHaveClass('shadow-md')
  })

  it('applies right alignment', () => {
    render(<Topbar align="right">Right Aligned</Topbar>)
    const topbar = screen.getByText('Right Aligned').parentElement
    expect(topbar).toHaveClass('justify-end')
  })
})
