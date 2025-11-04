/**
 * AppShell Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppShell } from './app-shell'

describe('AppShell', () => {
  it('renders correctly with children', () => {
    render(
      <AppShell>
        <div>Main Content</div>
      </AppShell>
    )
    expect(screen.getByText('Main Content')).toBeInTheDocument()
  })

  it('renders header', () => {
    render(
      <AppShell header={<header>Header</header>}>
        <div>Content</div>
      </AppShell>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
  })

  it('renders sidebar', () => {
    render(
      <AppShell sidebar={<aside>Sidebar</aside>}>
        <div>Content</div>
      </AppShell>
    )
    expect(screen.getByText('Sidebar')).toBeInTheDocument()
  })

  it('applies fixed header', () => {
    render(
      <AppShell header={<header>Header</header>} fixedHeader>
        <div>Content</div>
      </AppShell>
    )
    const header = screen.getByText('Header').closest('header')
    expect(header).toHaveClass('sticky', 'top-0', 'z-40')
  })

  it('applies sidebar on right', () => {
    render(
      <AppShell sidebar={<aside>Sidebar</aside>} sidebarPosition="right">
        <div>Content</div>
      </AppShell>
    )
    // Just verify it renders correctly
    expect(screen.getByText('Sidebar')).toBeInTheDocument()
  })
})
