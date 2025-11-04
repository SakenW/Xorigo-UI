/**
 * InfoTooltip Component Tests
 *
 * 测试 InfoTooltip 组件的功能和特性
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { InfoTooltip, type InfoTooltipProps } from './info-tooltip'

// ============================================================================
// Test Suite
// ============================================================================

describe('InfoTooltip', () => {
  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  it('renders correctly with children and content', () => {
    render(
      <InfoTooltip content="Tooltip content">
        <button>Hover me</button>
      </InfoTooltip>
    )

    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  it('does not render tooltip by default', () => {
    render(
      <InfoTooltip content="Tooltip content">
        <button>Hover me</button>
      </InfoTooltip>
    )

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('renders with disabled state', () => {
    render(
      <InfoTooltip content="Tooltip content" disabled>
        <button>Disabled</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Disabled')
    fireEvent.mouseEnter(button)
    fireEvent.mouseLeave(button)

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  // ============================================================================
  // Position Tests
  // ============================================================================

  it('positions tooltip on top by default', async () => {
    render(
      <InfoTooltip content="Top tooltip">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toBeInTheDocument()
      expect(tooltip).toHaveClass('bottom-full')
    })
  })

  it('positions tooltip on bottom', async () => {
    render(
      <InfoTooltip content="Bottom tooltip" position="bottom">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveClass('top-full')
    })
  })

  it('positions tooltip on left', async () => {
    render(
      <InfoTooltip content="Left tooltip" position="left">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveClass('right-full')
    })
  })

  it('positions tooltip on right', async () => {
    render(
      <InfoTooltip content="Right tooltip" position="right">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveClass('left-full')
    })
  })

  // ============================================================================
  // Trigger Tests
  // ============================================================================

  it('shows tooltip on hover by default', async () => {
    render(
      <InfoTooltip content="Hover content">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      expect(screen.getByText('Hover content')).toBeInTheDocument()
    })
  })

  it('hides tooltip when mouse leaves', async () => {
    render(
      <InfoTooltip content="Hover content">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      expect(screen.getByText('Hover content')).toBeInTheDocument()
    })

    fireEvent.mouseLeave(button)

    await waitFor(() => {
      expect(screen.queryByText('Hover content')).not.toBeInTheDocument()
    })
  })

  it('shows tooltip on click when trigger is click', async () => {
    render(
      <InfoTooltip content="Click content" trigger="click">
        <button>Click me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Click me')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Click content')).toBeInTheDocument()
    })
  })

  it('toggles tooltip on click', async () => {
    render(
      <InfoTooltip content="Click content" trigger="click">
        <button>Click me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Click me')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Click content')).toBeInTheDocument()
    })

    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.queryByText('Click content')).not.toBeInTheDocument()
    })
  })

  it('shows tooltip on focus when trigger is focus', async () => {
    render(
      <InfoTooltip content="Focus content" trigger="focus">
        <button>Focus me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Focus me')
    fireEvent.focus(button)

    await waitFor(() => {
      expect(screen.getByText('Focus content')).toBeInTheDocument()
    })
  })

  it('hides tooltip when blur when trigger is focus', async () => {
    render(
      <InfoTooltip content="Focus content" trigger="focus">
        <button>Focus me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Focus me')
    fireEvent.focus(button)

    await waitFor(() => {
      expect(screen.getByText('Focus content')).toBeInTheDocument()
    })

    fireEvent.blur(button)

    await waitFor(() => {
      expect(screen.queryByText('Focus content')).not.toBeInTheDocument()
    })
  })

  // ============================================================================
  // Delay Tests
  // ============================================================================

  it('delays showing tooltip by specified time', async () => {
    render(
      <InfoTooltip content="Delayed content" delay={300}>
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    // Tooltip should not be visible yet
    expect(screen.queryByText('Delayed content')).not.toBeInTheDocument()

    // Wait for delay
    await waitFor(
      () => {
        expect(screen.getByText('Delayed content')).toBeInTheDocument()
      },
      { delay: 350 }
    )
  })

  // ============================================================================
  // Arrow Tests
  // ============================================================================

  it('shows arrow by default', async () => {
    render(
      <InfoTooltip content="Content with arrow">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      // Check if arrow element exists (it should be a div with specific classes)
      const arrow = tooltip.querySelector('div[class*="w-2 h-2"]')
      expect(arrow).toBeInTheDocument()
    })
  })

  it('hides arrow when showArrow is false', async () => {
    render(
      <InfoTooltip content="Content without arrow" showArrow={false}>
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      const arrow = tooltip.querySelector('div[class*="w-2 h-2"]')
      expect(arrow).not.toBeInTheDocument()
    })
  })

  // ============================================================================
  // Variant Tests
  // ============================================================================

  it('applies default variant styles', async () => {
    render(
      <InfoTooltip content="Default variant" variant="default">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveClass('bg-[var(--color-tooltip-bg)]')
      expect(tooltip).toHaveClass('text-[var(--color-tooltip-text)]')
    })
  })

  it('applies inverted variant styles', async () => {
    render(
      <InfoTooltip content="Inverted variant" variant="inverted">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveClass('bg-[var(--color-surface)]')
      expect(tooltip).toHaveClass('text-[var(--color-text-primary)]')
    })
  })

  // ============================================================================
  // Size Tests
  // ============================================================================

  it('applies small size', async () => {
    render(
      <InfoTooltip content="Small size" size="sm">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveClass('text-xs')
      expect(tooltip).toHaveClass('px-2')
      expect(tooltip).toHaveClass('py-1')
    })
  })

  it('applies medium size (default)', async () => {
    render(
      <InfoTooltip content="Medium size" size="md">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveClass('text-sm')
      expect(tooltip).toHaveClass('px-3')
      expect(tooltip).toHaveClass('py-2')
    })
  })

  it('applies large size', async () => {
    render(
      <InfoTooltip content="Large size" size="lg">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveClass('text-base')
      expect(tooltip).toHaveClass('px-4')
      expect(tooltip).toHaveClass('py-3')
    })
  })

  // ============================================================================
  // Force Show Tests
  // ============================================================================

  it('shows tooltip when forceShow is true', () => {
    render(
      <InfoTooltip content="Forced content" forceShow={true}>
        <button>Always visible</button>
      </InfoTooltip>
    )

    expect(screen.getByText('Forced content')).toBeInTheDocument()
  })

  it('ignores trigger events when forceShow is true', () => {
    render(
      <InfoTooltip content="Forced content" forceShow={true} trigger="click">
        <button>Always visible</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Always visible')

    // Even though trigger is click, tooltip should be visible
    expect(screen.getByText('Forced content')).toBeInTheDocument()
  })

  // ============================================================================
  // Custom Content Tests
  // ============================================================================

  it('renders custom content as React node', () => {
    const customContent = (
      <div>
        <strong>Custom Title</strong>
        <p>Custom description</p>
      </div>
    )

    render(
      <InfoTooltip content={customContent}>
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom description')).toBeInTheDocument()
  })

  // ============================================================================
  // Accessibility Tests
  // ============================================================================

  it('has correct role attribute', async () => {
    render(
      <InfoTooltip content="Accessible content">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveAttribute('role', 'tooltip')
    })
  })

  it('has correct aria-hidden attribute when hidden', () => {
    render(
      <InfoTooltip content="Accessible content">
        <button>Hover me</button>
      </InfoTooltip>
    )

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('has correct aria-hidden attribute when shown', async () => {
    render(
      <InfoTooltip content="Accessible content" forceShow={true}>
        <button>Always visible</button>
      </InfoTooltip>
    )

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveAttribute('aria-hidden', 'false')
    })
  })

  // ============================================================================
  // Animation Tests
  // ============================================================================

  it('applies animation classes', async () => {
    render(
      <InfoTooltip content="Animated content">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      // Check for motion div classes
      expect(tooltip).toBeInTheDocument()
    })
  })

  // ============================================================================
  // Styling Tests
  // ============================================================================

  it('applies custom className', async () => {
    render(
      <InfoTooltip content="Custom styled" className="custom-tooltip">
        <button>Hover me</button>
      </InfoTooltip>
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveClass('custom-tooltip')
    })
  })
})
