/**
 * Link Component Tests
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Link } from './link'

describe('Link', () => {
  it('renders correctly', () => {
    render(
      <Link href="https://example.com">
        Example
      </Link>
    )
    expect(screen.getByText('Example')).toBeInTheDocument()
  })

  it('applies primary variant', () => {
    render(
      <Link href="/home" variant="primary">
        Home
      </Link>
    )
    const link = screen.getByText('Home')
    expect(link).toHaveClass('text-[var(--color-primary-600)]')
  })

  it('removes underline', () => {
    render(
      <Link href="/home" underline={false}>
        Home
      </Link>
    )
    const link = screen.getByText('Home')
    expect(link).not.toHaveClass('hover:underline')
  })

  it('opens external link', () => {
    render(
      <Link href="https://example.com" external>
        External
      </Link>
    )
    const link = screen.getByText('External')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
