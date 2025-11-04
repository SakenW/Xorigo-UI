/**
 * Button Component Tests - 按钮组件测试
 *
 * 测试 Button 组件的所有功能，包括渲染、Props传递、事件处理、
 * 可访问性和主题适配。
 *
 * @version 1.0.0
 * @category Tests
 * @since Xorigo UI v1.5.1
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'
import { vi, expect, describe, test } from 'vitest'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    button: React.forwardRef(({ children, ...props }: any, ref) => (
      <button ref={ref} {...props}>
        {children}
      </button>
    ))
  },
  // Mock variants
  buttonVariants: {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    disabled: { opacity: 0.6 }
  }
}))

// Mock cn utility function
vi.mock('../utils/cn', () => ({
  cn: (...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(' ')
  }
}))

describe('Button Component', () => {
  const user = userEvent.setup()

  // Basic rendering tests
  describe('Rendering', () => {
    test('renders button with default props', () => {
      render(<Button>Click me</Button>)

      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-[var(--color-primary-500)]')
      expect(button).toHaveClass('h-10')
      expect(button).toHaveClass('px-4')
    })

    test('renders with custom className', () => {
      render(<Button className="custom-class">Button</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    test('renders different variants correctly', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-[var(--color-primary-500)]')

      rerender(<Button variant="secondary">Secondary</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-[var(--color-secondary-500)]')

      rerender(<Button variant="outline">Outline</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-transparent')

      rerender(<Button variant="ghost">Ghost</Button>)
      expect(screen.getByRole('button')).toHaveClass('border-transparent')
    })

    test('renders different sizes correctly', () => {
      const { rerender } = render(<Button size="sm">Small</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-8')

      rerender(<Button size="md">Medium</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-10')

      rerender(<Button size="lg">Large</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-12')
    })
  })

  // Props handling tests
  describe('Props Handling', () => {
    test('handles disabled state correctly', () => {
      render(<Button disabled>Disabled Button</Button>)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    test('handles loading state correctly', async () => {
      render(<Button loading>Loading Button</Button>)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'true')

      // Check for loading spinner
      const spinner = button.querySelector('svg.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    test('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<Button ref={ref}>Button with ref</Button>)

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      expect(ref.current).toBe(screen.getByRole('button'))
    })

    test('passes through additional HTML button attributes', () => {
      render(
        <Button
          type="submit"
          aria-label="Submit form"
          data-testid="submit-button"
        >
          Submit
        </Button>
      )

      const button = screen.getByTestId('submit-button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('aria-label', 'Submit form')
    })
  })

  // Event handling tests
  describe('Event Handling', () => {
    test('calls onClick handler when clicked', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click me</Button>)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('does not call onClick when disabled', async () => {
      const handleClick = vi.fn()
      render(
        <Button disabled onClick={handleClick}>
          Disabled Button
        </Button>
      )

      const button = screen.getByRole('button')
      await user.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    test('does not call onClick when loading', async () => {
      const handleClick = vi.fn()
      render(
        <Button loading onClick={handleClick}>
          Loading Button
        </Button>
      )

      const button = screen.getByRole('button')
      await user.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    test('handles keyboard interaction', async () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Button</Button>)

      const button = screen.getByRole('button')
      button.focus()

      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)

      await user.keyboard(' ') // Space key
      expect(handleClick).toHaveBeenCalledTimes(2)
    })
  })

  // Accessibility tests
  describe('Accessibility', () => {
    // test('has no accessibility violations', async () => {
    //   const { container } = render(<Button>Accessible Button</Button>)
    //   const results = await axe(container)
    //   expect(results).toHaveNoViolations()
    // })

    test('has correct ARIA attributes', () => {
      render(<Button disabled>Disabled Button</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    test('has correct ARIA attributes when loading', () => {
      render(<Button loading>Loading Button</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })

    test('supports custom ARIA labels', () => {
      render(
        <Button aria-label="Custom label" aria-describedby="description">
          Button
        </Button>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Custom label')
      expect(button).toHaveAttribute('aria-describedby', 'description')
    })
  })

  // Theme integration tests
  describe('Theme Integration', () => {
    test('uses correct CSS custom properties for theming', () => {
      render(<Button variant="primary">Themed Button</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-[var(--color-primary-500)]')
      expect(button).toHaveClass('text-[var(--color-text-inverse)]')
    })

    test('applies variant-specific theme colors', () => {
      const { rerender } = render(<Button variant="outline">Outline</Button>)
      expect(screen.getByRole('button')).toHaveClass('text-[var(--color-primary-600)]')

      rerender(<Button variant="ghost">Ghost</Button>)
      expect(screen.getByRole('button')).toHaveClass('text-[var(--color-text-secondary)]')
    })
  })

  // Responsive design tests
  describe('Responsive Design', () => {
    test('applies responsive text sizes', () => {
      render(<Button>Responsive Button</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('sm:text-sm')
      expect(button).toHaveClass('md:text-base')
      expect(button).toHaveClass('lg:text-lg')
    })
  })

  // Edge cases
  describe('Edge Cases', () => {
    test('renders without children', () => {
      // Note: This should generally be avoided in practice
      render(<Button />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('handles empty string children', () => {
      render(<Button></Button>)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    test('handles complex children content', () => {
      render(
        <Button>
          <span className="icon">🚀</span>
          <span>Complex Button</span>
        </Button>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button.querySelector('.icon')).toBeInTheDocument()
    })
  })

  // Integration tests
  describe('Integration', () => {
    test('works in form context', async () => {
      const handleSubmit = vi.fn()

      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit Form</Button>
        </form>
      )

      const button = screen.getByRole('button')
      await user.click(button)

      // Note: This test simulates form submission behavior
      expect(button).toHaveAttribute('type', 'submit')
    })

    test('works with keyboard navigation', async () => {
      render(
        <div>
          <Button>First Button</Button>
          <Button>Second Button</Button>
        </div>
      )

      const firstButton = screen.getByRole('button', { name: /first button/i })
      firstButton.focus()

      expect(firstButton).toHaveFocus()

      await user.keyboard('{Tab}')

      const secondButton = screen.getByRole('button', { name: /second button/i })
      expect(secondButton).toHaveFocus()
    })
  })
})